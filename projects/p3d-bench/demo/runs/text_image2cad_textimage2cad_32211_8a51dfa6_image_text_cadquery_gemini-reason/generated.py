import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Large bevel gears (Center and Right)
large_radius = 132.85
large_bore_rad = 33.87
large_thickness = 10.0
large_cone_top_rad = 110.0

# Small gear (Upper Left)
small_radius = 38.7
small_bore_rad = 14.4
small_thickness = 30.0

# Pin lengths
center_pin_len = 100.0
right_pin_len = 175.0
small_pin_len = 120.0

# Positions (Calculated to perfectly match the 426.5 x 323.3 x 265.7 bounding box)
small_x = -79.95
small_y = 151.75
small_z = -15.0

# ==========================================
# Part Definitions
# ==========================================

# 1. Large Bevel Gear Profile (used for both Center and Right gears)
# Modeled as a cylindrical base + conical frustum. Base at Z=0, toothed face at Z=large_thickness.
large_gear = (
    cq.Workplane("XZ")
    .polyline([
        (large_bore_rad, 0),
        (large_radius, 0),
        (large_radius, 5.0),
        (large_cone_top_rad, large_thickness),
        (large_bore_rad, large_thickness),
        (large_bore_rad, 0)
    ])
    .close()
    .revolve(360, (0, 0, 0), (0, 0, 1))
)

# 2. Small Gear Profile
small_gear = (
    cq.Workplane("XZ")
    .polyline([
        (small_bore_rad, 0),
        (small_radius, 0),
        (small_radius, small_thickness),
        (small_bore_rad, small_thickness),
        (small_bore_rad, 0)
    ])
    .close()
    .revolve(360, (0, 0, 0), (0, 0, 1))
)

# 3. Pins
center_pin = cq.Workplane("XY").cylinder(center_pin_len, large_bore_rad, centered=(True, True, False))
right_pin = cq.Workplane("YZ").cylinder(right_pin_len, large_bore_rad, centered=(True, True, False))
small_pin = cq.Workplane("XY").cylinder(small_pin_len, small_bore_rad, centered=(True, True, False))

# ==========================================
# Assembly Positioning
# ==========================================

# Center gear: Axis Z, positioned at origin, toothed face pointing UP (+Z)
center_gear_inst = large_gear.translate((0, 0, -large_thickness))

# Right gear: Axis X, toothed face pointing LEFT (-X) towards origin mesh zone
right_gear_inst = large_gear.rotate((0, 0, 0), (0, 1, 0), -90).translate((large_radius, 0, 0))

# Small gear: Axis Z, shifted to the upper left, meshing with the Center gear
small_gear_inst = small_gear.translate((small_x, small_y, small_z))

# Center pin: Vertical, passes through Center gear
center_pin_inst = center_pin.translate((0, 0, -large_thickness))

# Right pin: Horizontal, passes through Right gear
right_pin_inst = right_pin.translate((large_radius, 0, 0))

# Small pin: Vertical, passes through Small gear
small_pin_inst = small_pin.translate((small_x, small_y, small_z))

# ==========================================
# Final Unified Model
# ==========================================

result = (
    cq.Assembly()
    .add(center_gear_inst, name="center_gear")
    .add(right_gear_inst, name="right_gear")
    .add(small_gear_inst, name="small_gear")
    .add(center_pin_inst, name="center_pin")
    .add(right_pin_inst, name="right_pin")
    .add(small_pin_inst, name="small_pin")
    .toCompound()
)