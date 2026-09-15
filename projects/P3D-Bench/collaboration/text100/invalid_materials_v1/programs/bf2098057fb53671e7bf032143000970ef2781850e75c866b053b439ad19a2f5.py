import cadquery as cq

# =============================================================================
# Parameters
# =============================================================================

# Vertical stepped depths
base_thickness = 3.0        # Thickness of the shallow bottom base (mm)
raised_height = 5.0         # Height of the upper solid features above base (mm)
total_height = base_thickness + raised_height  # Full stack height (8.0 mm)
recess_depth = raised_height  # Voids step down to the shallow base floor

# Footprint geometry (rounded body with pointed rear tab)
front_radius = 35.0         # Radius of the rounded front arc
front_center_y = 10.0       # Y-coordinate of the front arc center
rear_tab_radius = 5.0       # Radius of the rear tab tip
rear_tab_center_y = -40.0   # Y-coordinate of the rear tab center

# Tangent transition coordinates (exact geometric calculation)
# Center distance D = 50.0, delta_R = 30.0 -> sin(theta) = 0.6, cos(theta) = 0.8
front_tan_x = 28.0          # front_radius * cos(theta)
front_tan_y = -11.0         # front_center_y - front_radius * sin(theta)
rear_tan_x = 4.0            # rear_tab_radius * cos(theta)
rear_tan_y = -43.0          # rear_tab_center_y - rear_tab_radius * sin(theta)

# Central pocket
center_pocket_radius = 8.0  # Radius of central circular void
center_pocket_y = 8.0       # Center Y-position of central void

# Through-cut hole (full stack penetration near outer rim)
hole_diameter = 4.0         # Diameter of the through-hole
hole_radius = hole_diameter / 2.0
hole_x = 0.0                # Centered on symmetry axis
hole_y = 39.5               # Positioned on the thicker raised outer rim

# =============================================================================
# Modeling
# =============================================================================

# Step 1: Create the main solid sharing the full rounded footprint
# Includes rounded front, smooth tapering sides, and pointed rear tab
main_body = (
    cq.Workplane("XY")
    .moveTo(front_tan_x, front_tan_y)
    .threePointsArc((0.0, front_center_y + front_radius), (-front_tan_x, front_tan_y))
    .lineTo(-rear_tan_x, rear_tan_y)
    .threePointsArc((0.0, rear_tab_center_y - rear_tab_radius), (rear_tan_x, rear_tan_y))
    .close()
    .extrude(total_height)
)

# Step 2: Create recessed void cutters
# The voids step down from the top face to reveal the shallow base below,
# leaving a raised outer rim and curved interior dividing walls.

# 2a. Central circular recessed void
center_void = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(0.0, center_pocket_y)
    .circle(center_pocket_radius)
    .extrude(recess_depth)
)

# 2b. Left curved kidney-shaped void
left_void = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(-6.0, 26.0)
    .threePointsArc((-8.0, 30.0), (-10.0, 32.0))     # Top rounded cap
    .threePointsArc((-26.0, 10.0), (-12.0, -18.0))   # Outer curved boundary
    .threePointsArc((-9.0, -19.0), (-6.0, -16.0))    # Bottom rounded cap
    .threePointsArc((-14.0, 8.0), (-6.0, 26.0))      # Inner curved wall
    .close()
    .extrude(recess_depth)
)

# 2c. Right curved kidney-shaped void (symmetric to left)
right_void = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .moveTo(10.0, 32.0)
    .threePointsArc((8.0, 30.0), (6.0, 26.0))        # Top rounded cap
    .threePointsArc((14.0, 8.0), (6.0, -16.0))       # Inner curved wall
    .threePointsArc((9.0, -19.0), (12.0, -18.0))     # Bottom rounded cap
    .threePointsArc((26.0, 10.0), (10.0, 32.0))      # Outer curved boundary
    .close()
    .extrude(recess_depth)
)

# Step 3: Create the small circular through-cut
# Removed through a deeper vertical span than base thickness (full visible stack)
through_hole = (
    cq.Workplane("XY")
    .moveTo(hole_x, hole_y)
    .circle(hole_radius)
    .extrude(total_height)
)

# Step 4: Combine features via boolean subtraction
result = (
    main_body
    .cut(center_void)
    .cut(left_void)
    .cut(right_void)
    .cut(through_hole)
)