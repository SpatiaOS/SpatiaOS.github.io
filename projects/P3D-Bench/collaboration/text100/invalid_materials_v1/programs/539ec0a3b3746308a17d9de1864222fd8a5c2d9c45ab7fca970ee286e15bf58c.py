import cadquery as cq

# ==============================================================================
# Model Parameters
# ==============================================================================

# Base plate dimensions
base_length = 0.75
base_width = 0.442857
base_height = 0.071429

# Base plate through holes (radius and (x, y) center offsets)
base_hole_radius = 0.0161
base_hole_centers = [
    (0.0714, 0.1071),
    (0.0714, 0.2143),
    (0.2786, 0.3714),
    (0.6714, 0.3714),
]

# Upright block dimensions and placement
upright_length_x = 0.142857
upright_width_y = 0.142857
upright_height_z = 0.142857
upright_offset_left = 0.1429
upright_offset_front = 0.1571

# Upright center positions in XY
upright_center_x = upright_offset_left + upright_length_x / 2.0
upright_center_y = upright_offset_front + upright_width_y / 2.0
upright_back_y = upright_offset_front + upright_width_y  # Y = 0.3000

# Vertical centerline of the openings and recesses in the upright
features_center_z = (0.1285 + 0.1573) / 2.0  # Z = 0.1429

# Circular side opening 1 (entering from left face, drilling in +X)
opening1_left_offset = 0.1429
opening1_front_offset = 0.2071
opening1_radius = 0.0144
opening1_depth = 0.0357

# Circular side opening 2 (entering from back face, drilling in -Y)
opening2_left_offset = 0.2357
opening2_front_offset = 0.3000
opening2_radius = 0.0161
opening2_depth = 0.0357

# Rounded slot-like recesses
slot_total_length = 0.0536
slot_diameter = 0.1655 - 0.1202  # 0.0453 (vertical band height)
slot_cc_distance = slot_total_length - slot_diameter  # center-to-center distance = 0.0083
recess_depth = 0.0143

# Recess 1: oriented along X, thickness along Y (from Y=0.2643 to Y=0.2786)
recess1_center_x = 0.2357
recess1_y_end = base_width - 0.1643  # Y = 0.2786

# Recess 2: oriented along Y, thickness along X (from X=0.1643 to X=0.1786)
recess2_x_start = 0.1643
recess2_center_y = 0.2071

# ==============================================================================
# Modeling
# ==============================================================================

# 1. Create the rectangular base plate
base_plate = (
    cq.Workplane("XY")
    .center(base_length / 2.0, base_width / 2.0)
    .rect(base_length, base_width)
    .extrude(base_height)
)

# 2. Cut the four circular through openings in the base plate
base_holes = (
    cq.Workplane("XY", origin=(0, 0, -0.01))
    .pushPoints(base_hole_centers)
    .circle(base_hole_radius)
    .extrude(base_height + 0.02)
)
base_with_holes = base_plate.cut(base_holes)

# 3. Add the solid square upright block on top of the base plate
upright_block = (
    cq.Workplane("XY", origin=(upright_center_x, upright_center_y, base_height))
    .rect(upright_length_x, upright_width_y)
    .extrude(upright_height_z)
)
body = base_with_holes.union(upright_block)

# 4. Create cutting tool for side opening 1 (entering from left face in +X direction)
tool_opening1 = (
    cq.Workplane("YZ", origin=(opening1_left_offset - 0.001, opening1_front_offset, features_center_z))
    .circle(opening1_radius)
    .extrude(opening1_depth + 0.001)
)

# 5. Create cutting tool for side opening 2 (entering from back face in -Y direction)
# In CadQuery's "XZ" plane, local +Z corresponds to global -Y
tool_opening2 = (
    cq.Workplane("XZ", origin=(opening2_left_offset, upright_back_y + 0.001, features_center_z))
    .circle(opening2_radius)
    .extrude(opening2_depth + 0.001)
)

# 6. Create cutting tool for recess 1 (rounded slot in XZ plane, extruded along -Y)
tool_recess1 = (
    cq.Workplane("XZ", origin=(recess1_center_x, recess1_y_end, features_center_z))
    .slot2D(slot_cc_distance, slot_diameter, 0)
    .extrude(recess_depth)
)

# 7. Create cutting tool for recess 2 (rounded slot in YZ plane, extruded along +X)
tool_recess2 = (
    cq.Workplane("YZ", origin=(recess2_x_start, recess2_center_y, features_center_z))
    .slot2D(slot_cc_distance, slot_diameter, 0)
    .extrude(recess_depth)
)

# 8. Apply all cuts to produce the final model
result = (
    body
    .cut(tool_opening1)
    .cut(tool_opening2)
    .cut(tool_recess1)
    .cut(tool_recess2)
)