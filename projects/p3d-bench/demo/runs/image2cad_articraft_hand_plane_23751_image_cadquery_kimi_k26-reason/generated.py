import cadquery as cq

# =============================================================================
# PARAMETERS
# =============================================================================
# Base
base_thickness = 10.0
base_fillet = 6.0
knob_offset_x = 55.0

# Knobs
knob_dia = 32.0
knob_stem_dia = 14.0
knob_stem_height = 6.0

# Mouth (blade opening through base)
mouth_width = 18.0
mouth_depth = 16.0
mouth_y = -10.0          # Position just behind front wall

# Main column and blade
column_dia = 12.0
column_height = 48.0
column_y = 5.0           # Slightly behind blade

blade_width = 8.0
blade_thick = 2.5
blade_length = 42.0
blade_y = -5.0           # Forward of column, above mouth

# Blade carrier
carrier_dia = 20.0
carrier_height = 16.0
carrier_z = 28.0         # Height above base bottom where carrier sits

# Depth adjustment screw
adj_dia = 7.0
adj_height = 52.0
adj_wheel_dia = 18.0
adj_wheel_thick = 5.0
adj_x = 12.0             # To the right of column

# Depth stop rod (left of column)
stop_dia = 8.0
stop_height = 32.0
stop_x = -22.0

# Side thumb screw (locks carrier)
thumb_dia = 6.0
thumb_length = 14.0
thumb_head_dia = 14.0

# Small knurled knob on left platform
small_knob_dia = 10.0
small_knob_height = 5.0

# =============================================================================
# BASE CASTING
# =============================================================================
# Hourglass-shaped base built from two rounded end platforms and front/back bridges
left_platform = (
    cq.Workplane("XY")
    .moveTo(-knob_offset_x, 2)
    .rect(46, 52)
    .extrude(base_thickness)
    .edges("|Z")
    .fillet(10)
)

right_platform = (
    cq.Workplane("XY")
    .moveTo(knob_offset_x, 2)
    .rect(46, 52)
    .extrude(base_thickness)
    .edges("|Z")
    .fillet(10)
)

# Front toe (protrudes forward, forms the arch wall with "STANLEY" text)
front_bridge = (
    cq.Workplane("XY")
    .moveTo(0, -10)
    .rect(86, 24)
    .extrude(base_thickness)
    .edges("|Z")
    .fillet(8)
)

# Rear bridge connecting the two wings
back_bridge = (
    cq.Workplane("XY")
    .moveTo(0, 8)
    .rect(108, 22)
    .extrude(base_thickness)
    .edges("|Z")
    .fillet(4)
)

# Union base pieces and fillet vertical edges for smooth casting look
base = left_platform.union(right_platform).union(front_bridge).union(back_bridge)
base = base.edges("|Z").fillet(base_fillet)

# Arch-shaped mouth opening through base for blade clearance
mouth = (
    cq.Workplane("XY", origin=(0, mouth_y, -1))
    .moveTo(-mouth_width / 2, -mouth_depth / 2)
    .lineTo(-mouth_width / 2, mouth_depth / 2 - 5)
    .threePointArc((0, mouth_depth / 2), (mouth_width / 2, mouth_depth / 2 - 5))
    .lineTo(mouth_width / 2, -mouth_depth / 2)
    .close()
    .extrude(base_thickness + 2)
)
base = base.cut(mouth)

# Raised circular pads where knobs mount
pad_dia = 26.0
pad_height = 2.5
left_pad = cq.Workplane("XY", origin=(-knob_offset_x, 2, base_thickness)).circle(pad_dia / 2).extrude(pad_height)
right_pad = cq.Workplane("XY", origin=(knob_offset_x, 2, base_thickness)).circle(pad_dia / 2).extrude(pad_height)
base = base.union(left_pad).union(right_pad)

# Raised pad for main vertical column
col_pad_dia = 24.0
col_pad_height = 3.0
col_pad = cq.Workplane("XY", origin=(0, column_y, base_thickness)).circle(col_pad_dia / 2).extrude(col_pad_height)
base = base.union(col_pad)

# Recessed label pocket on right platform ("No 71" area)
label_pocket = (
    cq.Workplane("XY", origin=(knob_offset_x - 8, -10, base_thickness + pad_height - 0.5))
    .box(18, 10, 1)
)
base = base.cut(label_pocket)

# Large through-hole near front of right platform
hole_large = cq.Workplane("XY", origin=(knob_offset_x - 12, -12, -1)).circle(5.5).extrude(base_thickness + 2)
base = base.cut(hole_large)

# Small mounting holes on each platform
hole_left = cq.Workplane("XY", origin=(-knob_offset_x + 8, -12, -1)).circle(2.5).extrude(base_thickness + 2)
hole_right = cq.Workplane("XY", origin=(knob_offset_x - 8, 12, -1)).circle(2.5).extrude(base_thickness + 2)
base = base.cut(hole_left).cut(hole_right)

# =============================================================================
# SIDE KNOBS (Handles)
# =============================================================================
def create_knob(x, y, z):
    """Spherical knob with cylindrical stem and a top slot."""
    stem = cq.Workplane("XY", origin=(x, y, z)).circle(knob_stem_dia / 2).extrude(knob_stem_height)
    sphere = cq.Workplane("XY", origin=(x, y, z + knob_stem_height)).sphere(knob_dia / 2)
    # Slot across the top of the sphere (typical molded parting line)
    slot = cq.Workplane("XZ", origin=(x, y, z + knob_stem_height + knob_dia / 2)).box(knob_dia, 1.2, knob_dia)
    return stem.union(sphere).cut(slot)

left_knob = create_knob(-knob_offset_x, 2, base_thickness + pad_height)
right_knob = create_knob(knob_offset_x, 2, base_thickness + pad_height)

# =============================================================================
# CENTRAL CUTTER MECHANISM
# =============================================================================
# Main vertical column
column = cq.Workplane("XY", origin=(0, column_y, base_thickness + col_pad_height)).circle(column_dia / 2).extrude(column_height)

# Blade carrier - cylindrical collar that slides on the column
carrier = cq.Workplane("XY", origin=(0, column_y, carrier_z)).circle(carrier_dia / 2).extrude(carrier_height)

# Tongue that holds the blade, projecting forward from carrier
holder = cq.Workplane("XY", origin=(0, blade_y, carrier_z + 2)).box(blade_width + 4, 6, 8)
carrier = carrier.union(holder)

# Flat blade projecting downward through the mouth
blade = cq.Workplane("XY", origin=(0, blade_y, carrier_z - blade_length / 2 + 4)).box(blade_width, blade_thick, blade_length)

# Depth adjustment screw (vertical threaded rod behind carrier)
adj_post = cq.Workplane("XY", origin=(adj_x, column_y, base_thickness + col_pad_height)).circle(adj_dia / 2).extrude(adj_height)
adj_nut = cq.Workplane("XY", origin=(adj_x, column_y, base_thickness + col_pad_height + adj_height - 6)).circle(9).extrude(5)
adj_wheel = cq.Workplane("XY", origin=(adj_x, column_y, base_thickness + col_pad_height + adj_height)).circle(adj_wheel_dia / 2).extrude(adj_wheel_thick)

# Depth stop rod (left side, adjustable vertical post)
stop_rod = cq.Workplane("XY", origin=(stop_x, column_y, base_thickness)).circle(stop_dia / 2).extrude(stop_height)
stop_lock = cq.Workplane("XY", origin=(stop_x, column_y, base_thickness + stop_height)).circle(6).extrude(4)

# Side thumb screw that locks the carrier to the column
thumb_body = cq.Workplane("YZ", origin=(carrier_dia / 2, column_y, carrier_z + carrier_height / 2)).circle(thumb_dia / 2).extrude(thumb_length)
thumb_head = cq.Workplane("YZ", origin=(carrier_dia / 2 + thumb_length, column_y, carrier_z + carrier_height / 2)).circle(thumb_head_dia / 2).extrude(4)

# =============================================================================
# SMALL LEFT-PLATFORM KNOB
# =============================================================================
# Small knurled disc / adjustment screw on left wing (fence or stop adjustment)
small_x = -knob_offset_x + 14
small_y = -10
small_post = cq.Workplane("XY", origin=(small_x, small_y, base_thickness)).circle(2.5).extrude(5)
small_head = cq.Workplane("XY", origin=(small_x, small_y, base_thickness + 5)).circle(small_knob_dia / 2).extrude(small_knob_height)

# =============================================================================
# FINAL ASSEMBLY
# =============================================================================
result = (
    base
    .union(left_knob)
    .union(right_knob)
    .union(column)
    .union(carrier)
    .union(blade)
    .union(adj_post)
    .union(adj_nut)
    .union(adj_wheel)
    .union(stop_rod)
    .union(stop_lock)
    .union(thumb_body)
    .union(thumb_head)
    .union(small_post)
    .union(small_head)
)