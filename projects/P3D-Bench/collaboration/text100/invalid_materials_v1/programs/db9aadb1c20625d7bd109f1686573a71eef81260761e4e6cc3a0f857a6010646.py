import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Primary rectangular base
base_length = 0.75       # Length along X
base_width = 0.5         # Width along Y
base_height = 0.125      # Height along Z (base thickness)

# Full-width end strip along the left edge
strip_thickness = 0.125  # Footprint length along X
strip_width = 0.5        # Footprint width along Y
strip_reach = 0.5        # Upper reach from base datum (Z=0)

# Main raised rounded-outline solid
main_length = 0.3125     # Footprint length along X
main_depth = 0.328125    # Footprint depth along Y (0.3281)
main_x_offset = 0.125    # Offset from left edge
main_y_offset = 0.171875 # Offset from front edge (0.1719)
main_reach = 0.34375     # Upper reach from base datum (0.3437)

# Narrow back-right upper tier
tier_length = 0.3125     # Footprint length along X
tier_depth = 0.09375     # Footprint depth along Y (0.0938)
tier_x_offset = 0.4375   # Offset from left edge
tier_reach = 0.34375     # Upper reach from base datum (0.3437)

# Rounded recess (cutout)
cut_length = 0.21875     # Footprint length along X (0.2188)
cut_width = 0.125        # Footprint width along Y
cut_x_offset = 0.53125   # Offset from left edge (0.5312)
cut_y_offset = 0.1875    # Centered front-to-back offset from front/back edges
cut_z_start = -0.0703125 # Lower cut limit below base underside (-0.0703)
cut_total_depth = 0.1953125 # Total vertical cut depth (0.1953)

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Rectangular Base Solid
base = cq.Workplane("XY").box(
    base_length, base_width, base_height, centered=(False, False, False)
)

# 2. Solid Full-Width End Strip (Left Edge)
# Extends from base upper surface (Z = 0.125) to Z = 0.5
strip_height = strip_reach - base_height
left_strip = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .moveTo(strip_thickness / 2.0, base_width / 2.0)
    .rect(strip_thickness, strip_width)
    .extrude(strip_height)
)

# 3. Main Raised Rounded-Outline Solid
# Footprint spans X: [0.125, 0.4375], Y: [0.171875, 0.5]
# Features straight parallel sides from the back edge and a semicircular front
main_x_start = main_x_offset
main_x_end = main_x_offset + main_length
main_arc_radius = main_length / 2.0
main_arc_apex_x = main_x_offset + main_arc_radius
main_arc_center_y = main_y_offset + main_arc_radius
main_height = main_reach - base_height

main_raised = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .moveTo(main_x_start, base_width)
    .lineTo(main_x_start, main_arc_center_y)
    .threePointsArc((main_arc_apex_x, main_y_offset), (main_x_end, main_arc_center_y))
    .lineTo(main_x_end, base_width)
    .close()
    .extrude(main_height)
)

# 4. Narrow Back-Right Upper Tier
# Footprint spans X: [0.4375, 0.75], Y: [0.40625, 0.5]
tier_x_center = tier_x_offset + tier_length / 2.0
tier_y_center = base_width - tier_depth / 2.0
tier_height = tier_reach - base_height

tier = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .moveTo(tier_x_center, tier_y_center)
    .rect(tier_length, tier_depth)
    .extrude(tier_height)
)

# 5. Rounded Recess (Cutout)
# Profile spans X: [0.53125, 0.75], Y: [0.1875, 0.3125], with rounded left inner end
cut_x_start = cut_x_offset
cut_x_end = base_length
cut_radius = cut_width / 2.0
cut_arc_center_x = cut_x_start + cut_radius
cut_y_start = cut_y_offset
cut_y_end = cut_y_start + cut_width
cut_y_center = cut_y_start + cut_radius

recess = (
    cq.Workplane("XY")
    .workplane(offset=cut_z_start)
    .moveTo(cut_x_end, cut_y_end)
    .lineTo(cut_arc_center_x, cut_y_end)
    .threePointsArc((cut_x_start, cut_y_center), (cut_arc_center_x, cut_y_start))
    .lineTo(cut_x_end, cut_y_start)
    .close()
    .extrude(cut_total_depth)
)

# ==============================================================================
# Final Assembly
# ==============================================================================
result = (
    base
    .union(left_strip)
    .union(main_raised)
    .union(tier)
    .cut(recess)
)