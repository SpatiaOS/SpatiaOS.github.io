import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Base plate dimensions
base_length = 150.0       # Overall length along X axis
base_width = 85.0         # Overall width along Y axis
base_thickness = 10.0     # Base plate thickness (Z)
base_corner_radius = 8.0  # Fillet radius for the four outer vertical corners

# Side cut-away feature (curved crescent cut into the front side)
cutaway_radius = 24.0
cutaway_center_x = 35.0
cutaway_center_y = -base_width / 2.0

# Long rounded slot (through-opening on top surface)
slot_center_x = 35.0
slot_center_y = 12.0
slot_length = 42.0        # Total overall length of the rounded slot
slot_width = 11.0         # Width (diameter of the rounded ends)

# Stepped annular boss feature (sharing a common vertical axis)
boss_center_x = -32.0
boss_center_y = 2.0

# Curved transition pad (intermediate stepped base around the collar)
pad_radius = 36.0
pad_height = 4.0          # Height above the base plate surface

# Lower collar (broad circular ring)
lower_collar_od = 52.0
lower_collar_height = 14.0  # Height above the base plate surface

# Upper sleeve (smaller concentric cylinder)
upper_sleeve_od = 36.0
upper_sleeve_height = 16.0  # Additional height above the lower collar

# Continuous central hollow through the entire circular stack and base
bore_diameter = 22.0

# Attached raised strip along the rear edge (stepped shoulder)
strip_length = 80.0
strip_width = 16.0
strip_center_x = -30.0
strip_center_y = base_width / 2.0 - strip_width / 2.0
strip_height = 8.0        # Height above the base plate surface

# Total height from bottom of base to top of the sleeve
total_stack_height = base_thickness + lower_collar_height + upper_sleeve_height

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Primary rectangular base plate with rounded corners
base = (
    cq.Workplane("XY")
    .box(base_length, base_width, base_thickness, centered=(True, True, False))
    .edges("|Z")
    .fillet(base_corner_radius)
)

# 2. Rounded side cut-away along the front edge
cutaway_tool = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .moveTo(cutaway_center_x, cutaway_center_y)
    .circle(cutaway_radius)
    .extrude(base_thickness + 2.0)
)
base = base.cut(cutaway_tool)

# 3. Solid attached strip along the rear edge (stepped height)
raised_strip = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(strip_center_x, strip_center_y)
    .rect(strip_length, strip_width)
    .extrude(strip_height)
)

# 4. Solid curved support pad at the base of the annular stack
curved_pad = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(boss_center_x, boss_center_y)
    .circle(pad_radius)
    .extrude(pad_height)
)

# 5. Broad lower collar
lower_collar = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(boss_center_x, boss_center_y)
    .circle(lower_collar_od / 2.0)
    .extrude(lower_collar_height)
)

# 6. Upper sleeve sharing the same centerline
upper_sleeve = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + lower_collar_height)
    .moveTo(boss_center_x, boss_center_y)
    .circle(upper_sleeve_od / 2.0)
    .extrude(upper_sleeve_height)
)

# Fuse all positive solid material together
result = (
    base
    .union(raised_strip)
    .union(curved_pad)
    .union(lower_collar)
    .union(upper_sleeve)
)

# 7. Central hollow continuing completely through the circular stack and base
central_bore = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .moveTo(boss_center_x, boss_center_y)
    .circle(bore_diameter / 2.0)
    .extrude(total_stack_height + 2.0)
)
result = result.cut(central_bore)

# 8. Long rounded slot opening through the base plate
slot_half_span = (slot_length - slot_width) / 2.0
slot_tool = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .moveTo(slot_center_x - slot_half_span, slot_center_y)
    .circle(slot_width / 2.0)
    .moveTo(slot_center_x + slot_half_span, slot_center_y)
    .circle(slot_width / 2.0)
    .hull()
    .extrude(base_thickness + 2.0)
)
result = result.cut(slot_tool)