import math
import cadquery as cq

# ==============================================================================
# Model Parameters
# ==============================================================================

# Main Rectangular Wall (Reference Solid)
wall_length = 0.714286  # Full width along X
wall_width = 0.142857   # Depth along Y
wall_height = 0.428571  # Height along Z

# Vertical Cylindrical Sleeve
sleeve_x = 0.3571       # Center offset from left edge (X = 0)
sleeve_y = 0.5715       # Center offset from front edge (Y = 0)
sleeve_outer_radius = 0.125   # Outer radius (span 0.25 by 0.25)
sleeve_inner_radius = 0.0625  # Concentric through-bore radius
sleeve_reach_z = 0.3571       # Upward reach from base datum (Z = 0)

# Low Rounded and Slot-like Base
base_thickness = 0.0714       # Upper-side solid thickness
base_front_y = 0.1429         # Starts behind front wall
base_footprint_y = 0.5536     # Bounding depth extending behind wall

# Narrow Rib / Post
rib_width = 0.0714            # Footprint width along X
rib_length = 0.2566           # Footprint length along Y
rib_front_y = 0.1429          # Front offset from front reference edge
rib_height = 0.2143           # Solid depth upward from the shared shoulder

# Underside Continuation below Rib
underside_depth = 0.0714      # Extends 0.0714 below base underside (Z = -0.0714 to 0)

# ==============================================================================
# 1. Main Rectangular Wall
# ==============================================================================
# Positioned from X = 0 to wall_length, Y = 0 to wall_width, Z = 0 to wall_height
wall = (
    cq.Workplane("XY")
    .center(wall_length / 2.0, wall_width / 2.0)
    .rect(wall_length, wall_width)
    .extrude(wall_height)
)

# ==============================================================================
# 2. Low Rounded Base with Curved Outer Perimeter
# ==============================================================================
# The base extends from the wall (Y = base_front_y) to the rear circular portion
# coaxial with the sleeve (radius 0.125 around sleeve_x, sleeve_y).
# Tangent lines smoothly connect the front corners (0, base_front_y) and
# (wall_length, base_front_y) to the rear circular apex at Y = base_front_y + base_footprint_y.

dx = sleeve_x - 0.0
dy = sleeve_y - base_front_y
dist = math.hypot(dx, dy)
alpha = math.atan2(dy, dx)
beta = math.asin(sleeve_outer_radius / dist)
theta = alpha + beta
tangent_len = math.sqrt(dist**2 - sleeve_outer_radius**2)

# Tangent contact points on the outer circular perimeter
x_t1 = tangent_len * math.cos(theta)
y_t1 = base_front_y + tangent_len * math.sin(theta)
x_t2 = 2.0 * sleeve_x - x_t1
y_t2 = y_t1
apex_y = sleeve_y + sleeve_outer_radius

base = (
    cq.Workplane("XY")
    .moveTo(0.0, base_front_y)
    .lineTo(x_t1, y_t1)
    .threePointsArc((sleeve_x, apex_y), (x_t2, y_t2))
    .lineTo(wall_length, base_front_y)
    .close()
    .extrude(base_thickness)
)

# ==============================================================================
# 3. Vertical Cylindrical Sleeve
# ==============================================================================
# Solid cylinder reaching upward from the base datum (Z = 0)
sleeve = (
    cq.Workplane("XY")
    .center(sleeve_x, sleeve_y)
    .circle(sleeve_outer_radius)
    .extrude(sleeve_reach_z)
)

# ==============================================================================
# 4. Narrow Rectangular Rib / Post
# ==============================================================================
# Sits above the base shoulder (Z = base_thickness to base_thickness + rib_height)
rib_center_x = sleeve_x
rib_center_y = rib_front_y + rib_length / 2.0

rib = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .center(rib_center_x, rib_center_y)
    .rect(rib_width, rib_length)
    .extrude(rib_height)
)

# ==============================================================================
# 5. Underside Continuation Below Rib
# ==============================================================================
# Contained within the rib footprint, starting at Z = -underside_depth and ending flush at Z = 0
underside = (
    cq.Workplane("XY")
    .workplane(offset=-underside_depth)
    .center(rib_center_x, rib_center_y)
    .rect(rib_width, rib_length)
    .extrude(underside_depth)
)

# ==============================================================================
# 6. Combine Solids
# ==============================================================================
combined = wall.union(base).union(sleeve).union(rib).union(underside)

# ==============================================================================
# 7. Concentric Through Bore & Elongated Through Opening
# ==============================================================================
# Concentric vertical bore through the sleeve
bore_cut = (
    cq.Workplane("XY")
    .workplane(offset=-underside_depth - 0.05)
    .center(sleeve_x, sleeve_y)
    .circle(sleeve_inner_radius)
    .extrude(wall_height + underside_depth + 0.1)
)

# Elongated slot opening in the base, coaxial with the sleeve bore
slot_front_y = sleeve_y - 0.10
slot_front_cut = (
    cq.Workplane("XY")
    .workplane(offset=-underside_depth - 0.05)
    .center(sleeve_x, slot_front_y)
    .circle(sleeve_inner_radius)
    .extrude(base_thickness + underside_depth + 0.1)
)

slot_body_cut = (
    cq.Workplane("XY")
    .workplane(offset=-underside_depth - 0.05)
    .center(sleeve_x, (sleeve_y + slot_front_y) / 2.0)
    .rect(2.0 * sleeve_inner_radius, sleeve_y - slot_front_y)
    .extrude(base_thickness + underside_depth + 0.1)
)

# Apply all through-cuts to finalize the model
result = combined.cut(bore_cut).cut(slot_front_cut).cut(slot_body_cut)