import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Leaf general parameters
leaf_thickness = 3.0          # Thickness of both flat solid leaves
leaf_height = 20.0             # Height (width along crossing axis) of both leaves
leaf_angle = 110.0             # Crossing angle between the two leaves (degrees)

# Leaf 1 (Long, rounded far end)
leaf1_length = 60.0            # Total length from crossing axis to rounded tip
leaf1_hole_dia = 4.5           # Diameter of through-holes in leaf 1
leaf1_hole_positions = [22.0, 36.0, 50.0]  # Hole positions along leaf length

# Leaf 2 (Shorter, rectangular far end)
leaf2_length = 35.0            # Length from crossing axis to rectangular end
leaf2_hole_dia = 4.5           # Diameter of through-holes in leaf 2
leaf2_hole_positions = [18.0, 27.0]        # Hole positions along leaf length

# Barrel / Cylindrical feature along the crossing edge
shoulder_radius = 10.0         # Outer radius of the shared central shoulder
shoulder_height = 8.0          # Height of the shared shoulder

upper_sleeve_radius = 8.0      # Outer radius of upper annular sleeve
upper_sleeve_height = 14.0     # Height of upper sleeve above shoulder
upper_bore_radius = 5.5        # Inner bore radius of upper sleeve

lower_sleeve_radius = 8.5      # Outer radius of lower sleeve (stepped barrel OD)
lower_sleeve_height = 14.0     # Height of lower sleeve below shoulder
lower_bore_mid_radius = 4.5    # Mid-step bore radius in lower sleeve
lower_bore_large_radius = 6.5  # Underside circular removed section (counterbore) radius
lower_counterbore_depth = 8.0  # Depth of the underside circular removed section

central_bore_radius = 3.0      # Radius of smaller central round section of through-bore

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Create the cylindrical barrel outer geometry
# Shared central shoulder
shoulder = (
    cq.Workplane("XY")
    .workplane(offset=-shoulder_height / 2.0)
    .circle(shoulder_radius)
    .extrude(shoulder_height)
)

# Material added on top side of the shared shoulder (upper sleeve)
upper_sleeve = (
    cq.Workplane("XY")
    .workplane(offset=shoulder_height / 2.0)
    .circle(upper_sleeve_radius)
    .extrude(upper_sleeve_height)
)

# Material added on bottom side of the shared shoulder (lower stepped sleeve)
lower_sleeve = (
    cq.Workplane("XY")
    .workplane(offset=-(shoulder_height / 2.0 + lower_sleeve_height))
    .circle(lower_sleeve_radius)
    .extrude(lower_sleeve_height)
)

# Union the outer cylindrical barrel components
barrel_solid = shoulder.union(upper_sleeve).union(lower_sleeve)

# 2. Create Leaf 1: Long leaf with semi-circular rounded far end
leaf1_straight_len = leaf1_length - (leaf_height / 2.0)
leaf1 = (
    cq.Workplane("XZ")
    .moveTo(0.0, -leaf_height / 2.0)
    .lineTo(leaf1_straight_len, -leaf_height / 2.0)
    .threePointsArc(
        (leaf1_length, 0.0),
        (leaf1_straight_len, leaf_height / 2.0)
    )
    .lineTo(0.0, leaf_height / 2.0)
    .close()
    .extrude(leaf_thickness / 2.0, both=True)
)

# Cut separate through-openings in Leaf 1
leaf1_holes = (
    cq.Workplane("XZ")
    .pushPoints([(x, 0.0) for x in leaf1_hole_positions])
    .circle(leaf1_hole_dia / 2.0)
    .extrude(leaf_thickness * 2.0, both=True)
)
leaf1 = leaf1.cut(leaf1_holes)

# 3. Create Leaf 2: Shorter leaf with rectangular end
leaf2 = (
    cq.Workplane("XZ")
    .moveTo(0.0, -leaf_height / 2.0)
    .lineTo(leaf2_length, -leaf_height / 2.0)
    .lineTo(leaf2_length, leaf_height / 2.0)
    .lineTo(0.0, leaf_height / 2.0)
    .close()
    .extrude(leaf_thickness / 2.0, both=True)
)

# Cut separate through-openings in Leaf 2
leaf2_holes = (
    cq.Workplane("XZ")
    .pushPoints([(x, 0.0) for x in leaf2_hole_positions])
    .circle(leaf2_hole_dia / 2.0)
    .extrude(leaf_thickness * 2.0, both=True)
)
leaf2 = leaf2.cut(leaf2_holes)

# Rotate Leaf 2 to the crossing angle around the central axis (Z)
leaf2 = leaf2.rotate((0, 0, 0), (0, 0, 1), leaf_angle)

# 4. Combine barrel and leaves into one solid body
combined = barrel_solid.union(leaf1).union(leaf2)

# 5. Create the coaxial hollow stepped bores and underside cavity
total_z_max = (shoulder_height / 2.0) + upper_sleeve_height
total_z_min = -((shoulder_height / 2.0) + lower_sleeve_height)

# Continuous smaller central round section through-bore
central_bore = (
    cq.Workplane("XY")
    .workplane(offset=total_z_min - 1.0)
    .circle(central_bore_radius)
    .extrude((total_z_max - total_z_min) + 2.0)
)

# Upper sleeve annular bore
upper_bore = (
    cq.Workplane("XY")
    .workplane(offset=shoulder_height / 4.0)
    .circle(upper_bore_radius)
    .extrude(upper_sleeve_height + shoulder_height / 4.0 + 1.0)
)

# Lower sleeve mid-step bore
lower_mid_bore = (
    cq.Workplane("XY")
    .workplane(offset=total_z_min - 1.0)
    .circle(lower_bore_mid_radius)
    .extrude(lower_sleeve_height + 1.0 - shoulder_height / 4.0)
)

# Underside circular removed section (deep counterbore creating stepped barrel look)
underside_pocket = (
    cq.Workplane("XY")
    .workplane(offset=total_z_min - 1.0)
    .circle(lower_bore_large_radius)
    .extrude(lower_counterbore_depth + 1.0)
)

# Cut all bore features from the combined assembly
result = (
    combined
    .cut(central_bore)
    .cut(upper_bore)
    .cut(lower_mid_bore)
    .cut(underside_pocket)
)