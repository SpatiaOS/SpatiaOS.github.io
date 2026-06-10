import cadquery as cq
import math

# All dimensions are estimated in millimeters from a typical 80 mm square axial cooling fan.

# Overall frame parameters
outer_size = 80.0
frame_height = 25.0
flange_thickness = 3.2
corner_radius = 6.5
middle_body_overlap = 0.4

# Frame and duct geometry
outer_wall_thickness = 2.8
duct_inner_radius = 32.0
duct_outer_radius = 36.0
inner_lip_width = 1.4
inner_lip_height = 0.55

# Mounting hole and corner boss geometry
screw_center_offset = 31.5
screw_hole_radius = 2.35
screw_boss_radius = 6.0
screw_boss_height = 0.55
corner_post_radius = 5.4

# Decorative groove geometry
groove_width = 1.1
groove_depth = 0.45
groove_overshoot = 0.08
circular_groove_width = 0.75

# Fan impeller geometry
blade_count = 9
hub_radius = 12.0
hub_height = 10.0
hub_center_z = 1.8
hub_edge_fillet = 0.5

blade_inner_radius = 10.5
blade_outer_radius = duct_inner_radius - 1.8
blade_thickness = 2.6
blade_bottom_z = 2.1
blade_initial_angle = -10.0
blade_sweep_angle = 42.0
blade_twist_angle = -7.0
blade_root_angle_width = 28.0
blade_tip_angle_width = 15.0
blade_camber_angle = -5.0
blade_profile_segments = 10

# Hidden motor support arms below the rotor
stator_arm_count = 4
stator_arm_width = 3.0
stator_arm_thickness = 1.8
stator_arm_center_z = -3.3
stator_arm_initial_angle = 45.0

# Derived Z positions
top_surface_z = frame_height / 2.0
bottom_surface_z = -frame_height / 2.0
top_flange_center_z = top_surface_z - flange_thickness / 2.0
bottom_flange_center_z = bottom_surface_z + flange_thickness / 2.0
top_flange_bottom_z = top_surface_z - flange_thickness
bottom_flange_top_z = bottom_surface_z + flange_thickness

middle_body_height = (
    top_flange_bottom_z - bottom_flange_top_z + 2.0 * middle_body_overlap
)
middle_body_center_z = 0.5 * (top_flange_bottom_z + bottom_flange_top_z)

screw_positions = [
    (-screw_center_offset, -screw_center_offset),
    (-screw_center_offset, screw_center_offset),
    (screw_center_offset, -screw_center_offset),
    (screw_center_offset, screw_center_offset),
]

corner_signs = [(-1, -1), (-1, 1), (1, -1), (1, 1)]


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def polar_point(radius, angle_degrees):
    """Return an XY point from a radius and angle in degrees."""
    angle_radians = math.radians(angle_degrees)
    return (
        radius * math.cos(angle_radians),
        radius * math.sin(angle_radians),
    )


def make_rounded_box(width, depth, height, radius, z_center):
    """
    Create a box with rounded vertical outside corners.

    This replaces Workplane.roundedRect(), which is not available in all
    CadQuery versions.
    """
    safe_radius = max(
        0.0,
        min(radius, width / 2.0 - 0.05, depth / 2.0 - 0.05),
    )

    solid = cq.Workplane("XY").box(width, depth, height, centered=True)

    if safe_radius > 0.0:
        solid = solid.edges("|Z").fillet(safe_radius)

    return solid.translate((0, 0, z_center))


def make_cylinders_centered(points, radius, height, z_center):
    """Create one or more cylinders centered about z_center."""
    return (
        cq.Workplane("XY")
        .pushPoints(points)
        .circle(radius)
        .extrude(height)
        .translate((0, 0, z_center - height / 2.0))
    )


def make_cylinders_from_z(points, radius, height, z_min):
    """Create one or more cylinders starting at a specified Z value."""
    return (
        cq.Workplane("XY")
        .pushPoints(points)
        .circle(radius)
        .extrude(height)
        .translate((0, 0, z_min))
    )


def make_annular_cylinder(inner_radius, outer_radius, height, z_center):
    """Create a cylindrical ring with a through bore."""
    outer_cylinder = make_cylinders_centered(
        [(0.0, 0.0)],
        outer_radius,
        height,
        z_center,
    )
    inner_cutter = make_cylinders_centered(
        [(0.0, 0.0)],
        inner_radius,
        height + 2.0,
        z_center,
    )
    return outer_cylinder.cut(inner_cutter)


def make_rounded_square_wall(width, depth, height, wall_thickness, radius, z_center):
    """Create a rounded-square perimeter wall."""
    inner_width = width - 2.0 * wall_thickness
    inner_depth = depth - 2.0 * wall_thickness
    inner_radius = max(radius - wall_thickness, 0.5)

    outer_wall = make_rounded_box(width, depth, height, radius, z_center)
    inner_cutter = make_rounded_box(
        inner_width,
        inner_depth,
        height + 2.0,
        inner_radius,
        z_center,
    )

    return outer_wall.cut(inner_cutter)


def make_flange(z_center):
    """Create a rounded square fan flange with the central circular opening."""
    flange = make_rounded_box(
        outer_size,
        outer_size,
        flange_thickness,
        corner_radius,
        z_center,
    )

    opening_cutter = make_cylinders_centered(
        [(0.0, 0.0)],
        duct_inner_radius,
        flange_thickness + 2.0,
        z_center,
    )

    return flange.cut(opening_cutter)


def make_rounded_slot_solid(start_point, end_point, width, height, z_center):
    """
    Create a capsule/rounded-slot solid between two XY points.

    The shape is made from a rotated rectangular bar plus cylindrical end caps,
    avoiding use of Workplane.slot2D() for broad CadQuery compatibility.
    """
    dx = end_point[0] - start_point[0]
    dy = end_point[1] - start_point[1]
    length = math.hypot(dx, dy)

    if length < 1e-6:
        return make_cylinders_centered([start_point], width / 2.0, height, z_center)

    angle = math.degrees(math.atan2(dy, dx))
    mid_x = (start_point[0] + end_point[0]) / 2.0
    mid_y = (start_point[1] + end_point[1]) / 2.0

    bar = (
        cq.Workplane("XY")
        .box(length, width, height, centered=True)
        .rotate((0, 0, 0), (0, 0, 1), angle)
        .translate((mid_x, mid_y, z_center))
    )

    end_caps = make_cylinders_centered(
        [start_point, end_point],
        width / 2.0,
        height,
        z_center,
    )

    return bar.union(end_caps)


def make_centered_slot_between_points(start_point, end_point, width, height, z_center):
    """Create a rounded slot solid between two XY points."""
    return make_rounded_slot_solid(start_point, end_point, width, height, z_center)


def make_surface_slot_cut(start_point, end_point, width, depth, z_top):
    """Create a shallow rounded-slot cutter ending at the supplied top Z."""
    return make_rounded_slot_solid(
        start_point,
        end_point,
        width,
        depth,
        z_top - depth / 2.0,
    )


def make_annular_surface_cut(inner_radius, outer_radius, depth, z_top):
    """Create a shallow annular cutter ending at the supplied top Z."""
    return make_annular_cylinder(
        inner_radius,
        outer_radius,
        depth,
        z_top - depth / 2.0,
    )


def make_triangular_prism(points, height, z_center):
    """Create a triangular web/gusset prism from three XY points."""
    return (
        cq.Workplane("XY")
        .polyline(points)
        .close()
        .extrude(height)
        .translate((0, 0, z_center - height / 2.0))
    )


def make_blade_profile(base_angle_degrees):
    """Create one curved, swept 2D blade profile in the XY plane."""
    leading_edge_points = []
    trailing_edge_points = []

    for index in range(blade_profile_segments + 1):
        t = index / blade_profile_segments
        radius = blade_inner_radius + (blade_outer_radius - blade_inner_radius) * t

        center_angle = (
            base_angle_degrees
            + blade_sweep_angle * t
            + blade_camber_angle * math.sin(math.pi * t)
        )

        angular_width = (
            blade_root_angle_width * (1.0 - t)
            + blade_tip_angle_width * t
        )

        leading_edge_points.append(
            polar_point(radius, center_angle - angular_width / 2.0)
        )
        trailing_edge_points.append(
            polar_point(radius, center_angle + angular_width / 2.0)
        )

    return leading_edge_points + list(reversed(trailing_edge_points))


def make_blade(base_angle_degrees):
    """Loft one twisted fan blade between lower and upper swept profiles."""
    bottom_profile = make_blade_profile(base_angle_degrees)
    top_profile = make_blade_profile(base_angle_degrees + blade_twist_angle)

    return (
        cq.Workplane("XY")
        .polyline(bottom_profile)
        .close()
        .workplane(offset=blade_thickness)
        .polyline(top_profile)
        .close()
        .loft(combine=True)
        .translate((0, 0, blade_bottom_z))
    )


# ---------------------------------------------------------------------------
# Build the square frame and cylindrical duct
# ---------------------------------------------------------------------------

top_flange = make_flange(top_flange_center_z)
bottom_flange = make_flange(bottom_flange_center_z)

outer_side_wall = make_rounded_square_wall(
    outer_size,
    outer_size,
    middle_body_height,
    outer_wall_thickness,
    corner_radius,
    middle_body_center_z,
)

duct_shroud = make_annular_cylinder(
    duct_inner_radius,
    duct_outer_radius,
    middle_body_height,
    middle_body_center_z,
)

corner_posts = make_cylinders_centered(
    screw_positions,
    corner_post_radius,
    middle_body_height,
    middle_body_center_z,
)

top_screw_bosses = make_cylinders_from_z(
    screw_positions,
    screw_boss_radius,
    screw_boss_height,
    top_surface_z,
)

lower_screw_bosses = make_cylinders_from_z(
    screw_positions,
    screw_boss_radius,
    screw_boss_height,
    bottom_flange_top_z,
)

top_inner_lip = make_annular_cylinder(
    duct_inner_radius,
    duct_inner_radius + inner_lip_width,
    inner_lip_height,
    top_surface_z + inner_lip_height / 2.0,
)

lower_inner_lip = make_annular_cylinder(
    duct_inner_radius,
    duct_inner_radius + inner_lip_width,
    inner_lip_height,
    bottom_flange_top_z + inner_lip_height / 2.0,
)

# Four diagonal triangular gussets tying the circular shroud to the screw posts.
corner_webs = None
corner_web_inner_radius = duct_outer_radius - 0.8
corner_web_post_reach = screw_center_offset - corner_post_radius + 0.6

for sx, sy in corner_signs:
    diagonal_point = (
        sx * corner_web_inner_radius / math.sqrt(2.0),
        sy * corner_web_inner_radius / math.sqrt(2.0),
    )
    post_side_point_a = (
        sx * corner_web_post_reach,
        sy * screw_center_offset,
    )
    post_side_point_b = (
        sx * screw_center_offset,
        sy * corner_web_post_reach,
    )

    web = make_triangular_prism(
        [diagonal_point, post_side_point_a, post_side_point_b],
        middle_body_height,
        middle_body_center_z,
    )

    corner_webs = web if corner_webs is None else corner_webs.union(web)

# Combine frame solids.
frame_components = [
    top_flange,
    bottom_flange,
    outer_side_wall,
    duct_shroud,
    corner_posts,
    top_screw_bosses,
    lower_screw_bosses,
    top_inner_lip,
    lower_inner_lip,
    corner_webs,
]

frame = frame_components[0]
for component in frame_components[1:]:
    frame = frame.union(component)


# ---------------------------------------------------------------------------
# Decorative shallow grooves on the top flange and lower visible flange
# ---------------------------------------------------------------------------

groove_cut_depth = groove_depth + groove_overshoot
top_groove_z = top_surface_z + groove_overshoot
bottom_groove_z = bottom_flange_top_z + groove_overshoot

for sx, sy in corner_signs:
    # Triangular molded detail near each corner screw boss.
    inner_corner_point = (
        sx * (duct_inner_radius / math.sqrt(2.0) + 2.4),
        sy * (duct_inner_radius / math.sqrt(2.0) + 2.4),
    )
    top_edge_point = (
        sx * (screw_center_offset - 10.0),
        sy * (outer_size / 2.0 - 4.5),
    )
    side_edge_point = (
        sx * (outer_size / 2.0 - 4.5),
        sy * (screw_center_offset - 10.0),
    )

    groove_segments = [
        (inner_corner_point, top_edge_point),
        (inner_corner_point, side_edge_point),
        (top_edge_point, side_edge_point),
    ]

    for surface_z in [top_groove_z, bottom_groove_z]:
        for segment_start, segment_end in groove_segments:
            frame = frame.cut(
                make_surface_slot_cut(
                    segment_start,
                    segment_end,
                    groove_width,
                    groove_cut_depth,
                    surface_z,
                )
            )

# Circular molded groove around the central fan opening.
circular_groove_inner_radius = duct_inner_radius + 2.25
circular_groove_outer_radius = circular_groove_inner_radius + circular_groove_width

for surface_z in [top_groove_z, bottom_groove_z]:
    frame = frame.cut(
        make_annular_surface_cut(
            circular_groove_inner_radius,
            circular_groove_outer_radius,
            groove_cut_depth,
            surface_z,
        )
    )

# Through screw holes in all four corners.
screw_hole_cut = make_cylinders_centered(
    screw_positions,
    screw_hole_radius,
    frame_height + 2.0 * screw_boss_height + 4.0,
    0.0,
)

frame = frame.cut(screw_hole_cut)


# ---------------------------------------------------------------------------
# Build the impeller: central hub, curved blades, and low stator arms
# ---------------------------------------------------------------------------

hub = (
    cq.Workplane("XY")
    .circle(hub_radius)
    .extrude(hub_height)
    .edges("%Circle")
    .fillet(hub_edge_fillet)
    .translate((0, 0, hub_center_z - hub_height / 2.0))
)

impeller = hub

# Add the swept fan blades around the hub.
for blade_index in range(blade_count):
    blade_angle = blade_initial_angle + blade_index * 360.0 / blade_count
    impeller = impeller.union(make_blade(blade_angle))

# Add four lower stator arms, mostly hidden by the rotor, connecting hub to frame.
stator_arms = None

for arm_index in range(stator_arm_count):
    arm_angle = stator_arm_initial_angle + arm_index * 360.0 / stator_arm_count
    arm_start = polar_point(hub_radius * 0.55, arm_angle)
    arm_end = polar_point(duct_inner_radius + 1.2, arm_angle)

    arm = make_centered_slot_between_points(
        arm_start,
        arm_end,
        stator_arm_width,
        stator_arm_thickness,
        stator_arm_center_z,
    )

    stator_arms = arm if stator_arms is None else stator_arms.union(arm)

impeller = impeller.union(stator_arms)


# Final model
result = frame.union(impeller)