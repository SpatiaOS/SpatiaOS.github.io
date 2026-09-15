import cadquery as cq

# ==============================================================================
# Parametric Dimensions
# ==============================================================================

# Main Body Dimensions
body_width = 50.0        # Total lateral width (Y axis)
rect_length = 85.0       # Length of the rectangular section (X axis, negative direction)
body_height = 48.0       # Total vertical height (Z axis)
end_radius = body_width / 2.0  # Radius of the rounded annular end (25.0 mm)

# Annular End Void (Coaxial circular opening)
hole_radius = 12.0       # Radius of through hole (24.0 mm diameter)

# Vertical Band Layout (Z axis)
# The body is centered at Z = 0 (-24 to +24)
# Solid middle portion: Z from -8.0 to +8.0 (16.0 mm solid web)
# Upper band: centered at Z = +14.0 (spans Z = 8.0 to 20.0, height 12.0 mm)
# Lower band: centered at Z = -14.0 (spans Z = -20.0 to -8.0, height 12.0 mm)
# Top/bottom margins: 4.0 mm solid rims
z_upper = 14.0
z_lower = -14.0
cut_height = 12.0        # Height of all band cuts

# Longitudinal Cut Positions & Sizes (X axis)
# Rectangular body extends from X = -85.0 to X = 0.0
# Hole boundary is at X = -12.0; cuts maintain solid clearance margins
pocket_length = 24.0     # Length of shallow pocket
through_length = 23.0    # Length of through opening
x_pocket = -63.0         # Center X of shallow pocket (spans X = -75.0 to -51.0)
x_through = -31.5        # Center X of through opening (spans X = -43.0 to -20.0)

# Cut Depths (Y axis)
pocket_depth = 8.0       # Depth of shallow blind pockets into each lateral face
y_pocket_inner = (body_width / 2.0) - pocket_depth  # Inner floor of pocket (Y = 17.0)
y_pocket_outer = (body_width / 2.0) + 2.0           # Extended slightly into air for clean cut
y_through_reach = (body_width / 2.0) + 5.0          # Clearance for through cuts

# ==============================================================================
# Helper Function: 3D Stadium Slot Tool
# ==============================================================================

def make_slot_solid(x_center, z_center, length, height, y_start, y_end):
    """
    Creates a 3D solid slot (obround) on the XZ plane with true arc ends,
    extruded along the Y axis between y_start and y_end.
    
    This ensures all cut boundaries are curved arcs rather than sharp rectangular notches.
    """
    r = height / 2.0
    dx = (length - height) / 2.0
    
    # 2D stadium boundary points in (X, Z)
    p_tl = (x_center - dx, z_center + r)
    p_tr = (x_center + dx, z_center + r)
    p_mr = (x_center + dx + r, z_center)
    p_br = (x_center + dx, z_center - r)
    p_bl = (x_center - dx, z_center - r)
    p_ml = (x_center - dx - r, z_center)
    
    y_max = max(y_start, y_end)
    y_min = min(y_start, y_end)
    dist = y_max - y_min
    
    # In CadQuery, the normal of the "XZ" plane is (0, -1, 0) [-Y direction]
    # Extruding from y_max along normal -Y reaches y_min
    slot_tool = (
        cq.Workplane("XZ", origin=(0, y_max, 0))
        .moveTo(p_tl[0], p_tl[1])
        .lineTo(p_tr[0], p_tr[1])
        .threePointsArc(p_mr, p_br)
        .lineTo(p_bl[0], p_bl[1])
        .threePointsArc(p_ml, p_tl)
        .close()
        .extrude(dist)
    )
    return slot_tool

# ==============================================================================
# 1. Main Base Solid
# ==============================================================================

# Create the solid rectangular body with a smooth, tangent semicircular annular end
p_arc_start = (0.0, -end_radius)
p_arc_mid = (end_radius, 0.0)
p_arc_end = (0.0, end_radius)
p_rect_top = (-rect_length, end_radius)
p_rect_bot = (-rect_length, -end_radius)

base_profile = (
    cq.Workplane("XY")
    .moveTo(p_arc_start[0], p_arc_start[1])
    .threePointsArc(p_arc_mid, p_arc_end)
    .lineTo(p_rect_top[0], p_rect_top[1])
    .lineTo(p_rect_bot[0], p_rect_bot[1])
    .close()
)

# Extrude symmetrically in Z (centered at Z = 0)
body = base_profile.extrude(body_height / 2.0, both=True)

# ==============================================================================
# 2. Coaxial Through Void (Annular Opening)
# ==============================================================================

# Create the real circular through void, concentric with the rounded end
hole_tool = (
    cq.Workplane("XY")
    .circle(hole_radius)
    .extrude(body_height, both=True)
)
result = body.cut(hole_tool)

# ==============================================================================
# 3. Deeper Cuts: Through Openings (Upper & Lower Bands)
# ==============================================================================

# These cuts pass entirely through the body (lateral Y direction),
# with rounded semicircular arc ends maintained on both sides.
upper_through = make_slot_solid(
    x_through, z_upper, through_length, cut_height, -y_through_reach, y_through_reach
)
lower_through = make_slot_solid(
    x_through, z_lower, through_length, cut_height, -y_through_reach, y_through_reach
)

result = result.cut(upper_through).cut(lower_through)

# ==============================================================================
# 4. Shallow Pockets (Upper & Lower Bands, Both Lateral Sides)
# ==============================================================================

# Positive Y Side Shallow Pockets (recessed into +Y face)
upper_pocket_pos = make_slot_solid(
    x_pocket, z_upper, pocket_length, cut_height, y_pocket_inner, y_pocket_outer
)
lower_pocket_pos = make_slot_solid(
    x_pocket, z_lower, pocket_length, cut_height, y_pocket_inner, y_pocket_outer
)

# Negative Y Side Shallow Pockets (recessed into -Y face)
upper_pocket_neg = make_slot_solid(
    x_pocket, z_upper, pocket_length, cut_height, -y_pocket_outer, -y_pocket_inner
)
lower_pocket_neg = make_slot_solid(
    x_pocket, z_lower, pocket_length, cut_height, -y_pocket_outer, -y_pocket_inner
)

# Apply shallow pocket cuts
result = (
    result
    .cut(upper_pocket_pos)
    .cut(lower_pocket_pos)
    .cut(upper_pocket_neg)
    .cut(lower_pocket_neg)
)