import math
import cadquery as cq

# ==============================================================================
# Parameter Definitions
# ==============================================================================

# Base Parameters
center_distance = 65.0   # Center-to-center distance between lobes
large_end_radius = 30.0  # Radius of large circular base lobe
small_end_radius = 20.0  # Radius of small circular base lobe
waist_radius = 35.0      # Radius of concave waist transition
base_thickness = 8.0     # Thickness of the base plate

# Large End Raised Annular Section
large_boss_radius = 22.0 # Outer radius of large raised boss
large_boss_height = 12.0 # Height of large boss above base
large_bore_radius = 10.0 # Through hole radius at large end

# Large End Underside Recess
recess_radius = 16.0     # Radius of shallow coaxial recess on underside
recess_depth = 3.0       # Depth of underside recess

# Small End Raised Annular Section (Rounded Body)
small_boss_radius = 14.0 # Outer radius of small raised boss
small_boss_height = 8.0  # Height of small boss above base
small_bore_radius = 7.0  # Through hole radius at small end

# Small End Solid Curved Wall
wall_height = 16.0       # Height of the curved wall above base
wall_outer_radius = small_end_radius  # Flush with outer base perimeter
wall_inner_radius = small_boss_radius  # Attached directly to rounded body

# ==============================================================================
# Geometric Calculations for Tangent Waist
# ==============================================================================

# Distance from circle centers to waist arc center
d1 = waist_radius + large_end_radius
d2 = waist_radius + small_end_radius

# Waist arc center coordinates (upper arc)
xw = (center_distance**2 + d1**2 - d2**2) / (2.0 * center_distance)
yw = math.sqrt(d1**2 - xw**2)

# Tangency point on large circle
p1_x = large_end_radius * xw / d1
p1_y = large_end_radius * yw / d1

# Tangency point on small circle
p2_x = center_distance + small_end_radius * (xw - center_distance) / d2
p2_y = small_end_radius * yw / d2

# Midpoint of upper waist concave arc
mid_top_x = xw
mid_top_y = yw - waist_radius

# Midpoint of lower waist concave arc
mid_bot_x = xw
mid_bot_y = -(yw - waist_radius)

# ==============================================================================
# Model Construction
# ==============================================================================

# Step 1: Create the base with circular end areas and narrowed curved waist
base = (
    cq.Workplane("XY")
    .moveTo(p1_x, -p1_y)
    .threePointArc((-large_end_radius, 0.0), (p1_x, p1_y))
    .threePointArc((mid_top_x, mid_top_y), (p2_x, p2_y))
    .threePointArc((center_distance + small_end_radius, 0.0), (p2_x, -p2_y))
    .threePointArc((mid_bot_x, mid_bot_y), (p1_x, -p1_y))
    .close()
    .extrude(base_thickness)
)

# Step 2: Add the raised circular boss at the larger end
large_boss = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(large_boss_radius)
    .extrude(large_boss_height)
)

# Step 3: Add the raised circular boss (rounded body) at the smaller end
small_boss = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(center_distance, 0.0)
    .circle(small_boss_radius)
    .extrude(small_boss_height)
)

# Step 4: Add the solid curved wall rising from the base at the smaller end
# The wall sweeps the outer semicircle and attaches to the rounded body
curved_wall = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(center_distance, -wall_outer_radius)
    .threePointArc((center_distance + wall_outer_radius, 0.0), (center_distance, wall_outer_radius))
    .lineTo(center_distance, wall_inner_radius)
    .threePointArc((center_distance + wall_inner_radius, 0.0), (center_distance, -wall_inner_radius))
    .close()
    .extrude(wall_height)
)

# Combine all additive features into a single body
result = base.union(large_boss).union(small_boss).union(curved_wall)

# Step 5: Cut the center opening through the larger stacked circular sections
large_through_bore = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .circle(large_bore_radius)
    .extrude(base_thickness + large_boss_height + 2.0)
)
result = result.cut(large_through_bore)

# Step 6: Cut the center opening through the smaller stacked circular sections
small_through_bore = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .moveTo(center_distance, 0.0)
    .circle(small_bore_radius)
    .extrude(base_thickness + wall_height + 2.0)
)
result = result.cut(small_through_bore)

# Step 7: Cut the shallow coaxial recess on the underside of the large end
underside_recess = (
    cq.Workplane("XY")
    .workplane(offset=-1.0)
    .circle(recess_radius)
    .extrude(recess_depth + 1.0)
)
result = result.cut(underside_recess)