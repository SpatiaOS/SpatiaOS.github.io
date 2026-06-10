import math
import cadquery as cq

# Parameters
seat_width = 110.0
seat_depth = 100.0
seat_thickness = 12.0
seat_edge_chamfer = 1.0

leg_size = 25.0
leg_height = 100.0
leg_seat_overlap = 1.0
leg_corner_fillet = 2.0
leg_end_chamfer = 2.6
leg_waist_radius_x = 145.0
leg_waist_radius_y = 132.0
leg_waist_inset_x = 5.0
leg_waist_inset_y = 5.7

back_panel_width = 82.0
back_panel_height = 200.0
back_plate_thickness = 8.0
back_top_slope_drop = 14.0
back_edge_chamfer = 0.8

side_panel_radius = 49.0
side_panel_thickness = 6.0
side_panel_overlap = 1.0
side_rib_projection = 1.6

leaf_rib_projection = 2.0

seat_pocket_depth = 1.6

# Derived layout dimensions
seat_bottom_z = leg_height
seat_top_z = seat_bottom_z + seat_thickness
back_bottom_z = seat_top_z - 2.0
back_top_z = seat_top_z + back_panel_height
back_center_y = seat_depth / 2.0 - back_plate_thickness / 2.0
back_front_face_y = back_center_y - back_plate_thickness / 2.0

right_side_panel_center_x = seat_width / 2.0 - side_panel_thickness / 2.0
left_side_panel_center_x = -right_side_panel_center_x
right_side_outer_x = seat_width / 2.0
left_side_outer_x = -seat_width / 2.0
side_panel_bottom_z = seat_top_z - side_panel_overlap


def diamond_points(center_u, center_v, diagonal_u, diagonal_v, angle_degrees=0.0):
    """Return 2D rhombus vertices in a workplane."""
    angle = math.radians(angle_degrees)
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)

    local_vertices = [
        (0.0, diagonal_v / 2.0),
        (diagonal_u / 2.0, 0.0),
        (0.0, -diagonal_v / 2.0),
        (-diagonal_u / 2.0, 0.0),
    ]

    return [
        (
            center_u + u * cos_a - v * sin_a,
            center_v + u * sin_a + v * cos_a,
        )
        for u, v in local_vertices
    ]


def make_diamond_prism_xy(center_x, center_y, center_z, diagonal_x, diagonal_y, angle_degrees, depth):
    """Create a diamond prism normal to the XY plane."""
    return (
        cq.Workplane("XY", origin=(0.0, 0.0, center_z))
        .polyline(diamond_points(center_x, center_y, diagonal_x, diagonal_y, angle_degrees))
        .close()
        .extrude(depth, both=True)
    )


def make_diamond_prism_xz(center_x, center_z, center_y, diagonal_x, diagonal_z, angle_degrees, depth):
    """Create a diamond prism normal to the XZ plane."""
    return (
        cq.Workplane("XZ", origin=(0.0, center_y, 0.0))
        .polyline(diamond_points(center_x, center_z, diagonal_x, diagonal_z, angle_degrees))
        .close()
        .extrude(depth, both=True)
    )


def make_diamond_prism_yz(center_y, center_z, center_x, diagonal_y, diagonal_z, angle_degrees, depth):
    """Create a diamond prism normal to the YZ plane."""
    return (
        cq.Workplane("YZ", origin=(center_x, 0.0, 0.0))
        .polyline(diamond_points(center_y, center_z, diagonal_y, diagonal_z, angle_degrees))
        .close()
        .extrude(depth, both=True)
    )


def make_side_cheek_panel(x_center):
    """Create one vertical semicircular side panel on the seat."""
    return (
        cq.Workplane("YZ", origin=(x_center, 0.0, 0.0))
        .moveTo(-side_panel_radius, side_panel_bottom_z)
        .threePointArc(
            (0.0, side_panel_bottom_z + side_panel_radius),
            (side_panel_radius, side_panel_bottom_z),
        )
        .close()
        .extrude(side_panel_thickness, both=True)
    )


def make_semicircular_band_yz(
    x_surface,
    side_sign,
    center_y,
    base_z,
    outer_radius,
    inner_radius,
    projection,
    segments=36,
):
    """Create a raised semicircular decorative band on an outer side face."""
    outer_points = []
    inner_points = []

    for index in range(segments + 1):
        theta = math.pi - math.pi * index / segments
        outer_points.append(
            (
                center_y + outer_radius * math.cos(theta),
                base_z + outer_radius * math.sin(theta),
            )
        )

    for index in reversed(range(segments + 1)):
        theta = math.pi - math.pi * index / segments
        inner_points.append(
            (
                center_y + inner_radius * math.cos(theta),
                base_z + inner_radius * math.sin(theta),
            )
        )

    x_center = x_surface + side_sign * projection * 0.40

    return (
        cq.Workplane("YZ", origin=(x_center, 0.0, 0.0))
        .polyline(outer_points + inner_points)
        .close()
        .extrude(projection, both=True)
    )


def make_leaf_rib():
    """Create the raised B-spline leaf outline on the front face of the backrest."""
    rib_center_y = back_front_face_y - leaf_rib_projection * 0.40

    outer_base = (-37.0, seat_top_z + 2.0)
    outer_left_curve = [
        (-36.0, seat_top_z + 65.0),
        (-37.0, seat_top_z + 140.0),
        (-39.0, back_top_z - 7.0),
    ]
    outer_right_curve = [
        (-9.0, seat_top_z + 148.0),
        (23.0, seat_top_z + 96.0),
        (30.0, seat_top_z + 48.0),
        (14.0, seat_top_z + 16.0),
        (-18.0, seat_top_z + 5.0),
        outer_base,
    ]

    inner_base = (-30.0, seat_top_z + 7.0)
    inner_left_curve = [
        (-31.0, seat_top_z + 65.0),
        (-34.0, back_top_z - 20.0),
    ]
    inner_right_curve = [
        (-7.0, seat_top_z + 142.0),
        (14.0, seat_top_z + 94.0),
        (22.0, seat_top_z + 49.0),
        (10.0, seat_top_z + 23.0),
        (-12.0, seat_top_z + 11.0),
        inner_base,
    ]

    outer_leaf = (
        cq.Workplane("XZ", origin=(0.0, rib_center_y, 0.0))
        .moveTo(*outer_base)
        .spline(outer_left_curve, includeCurrent=True)
        .spline(outer_right_curve, includeCurrent=True)
        .close()
        .extrude(leaf_rib_projection, both=True)
    )

    inner_leaf_cutter = (
        cq.Workplane("XZ", origin=(0.0, rib_center_y, 0.0))
        .moveTo(*inner_base)
        .spline(inner_left_curve, includeCurrent=True)
        .spline(inner_right_curve, includeCurrent=True)
        .close()
        .extrude(leaf_rib_projection + 1.0, both=True)
    )

    return outer_leaf.cut(inner_leaf_cutter)


def make_waisted_column():
    """Create a 25 x 25 mm column with concave cylindrical waist panels."""
    column_height = leg_height + leg_seat_overlap
    half_size = leg_size / 2.0
    waist_mid_z = leg_height / 2.0

    column = (
        cq.Workplane("XY")
        .box(leg_size, leg_size, column_height, centered=(True, True, False))
        .faces(">Z")
        .edges()
        .chamfer(leg_end_chamfer)
        .faces("<Z")
        .edges()
        .chamfer(leg_end_chamfer)
        .edges("|Z")
        .fillet(leg_corner_fillet)
    )

    x_cutter_offset = half_size - leg_waist_inset_x + leg_waist_radius_x
    y_cutter_offset = half_size - leg_waist_inset_y + leg_waist_radius_y

    concave_cutters = [
        cq.Workplane("XZ")
        .center(x_cutter_offset, waist_mid_z)
        .circle(leg_waist_radius_x)
        .extrude(leg_size * 4.0, both=True),
        cq.Workplane("XZ")
        .center(-x_cutter_offset, waist_mid_z)
        .circle(leg_waist_radius_x)
        .extrude(leg_size * 4.0, both=True),
        cq.Workplane("YZ")
        .center(y_cutter_offset, waist_mid_z)
        .circle(leg_waist_radius_y)
        .extrude(leg_size * 4.0, both=True),
        cq.Workplane("YZ")
        .center(-y_cutter_offset, waist_mid_z)
        .circle(leg_waist_radius_y)
        .extrude(leg_size * 4.0, both=True),
    ]

    for cutter in concave_cutters:
        column = column.cut(cutter)

    return column


# Create the horizontal seat slab.
seat = (
    cq.Workplane("XY")
    .box(seat_width, seat_depth, seat_thickness, centered=(True, True, False))
    .edges()
    .chamfer(seat_edge_chamfer)
    .translate((0.0, 0.0, seat_bottom_z))
)

# Create the tall sloped backrest plate.
back_panel = (
    cq.Workplane("XZ", origin=(0.0, back_center_y, 0.0))
    .polyline(
        [
            (-back_panel_width / 2.0, back_bottom_z),
            (back_panel_width / 2.0, back_bottom_z),
            (back_panel_width / 2.0, back_top_z - back_top_slope_drop),
            (-back_panel_width / 2.0, back_top_z),
        ]
    )
    .close()
    .extrude(back_plate_thickness, both=True)
    .edges()
    .chamfer(back_edge_chamfer)
)

# Create the side semicircular arc panels and raised decorative bands.
left_side_panel = make_side_cheek_panel(left_side_panel_center_x)
right_side_panel = make_side_cheek_panel(right_side_panel_center_x)

left_outer_side_rib = make_semicircular_band_yz(
    left_side_outer_x,
    -1.0,
    0.0,
    side_panel_bottom_z + 0.3,
    side_panel_radius - 4.5,
    side_panel_radius - 9.0,
    side_rib_projection,
)
right_outer_side_rib = make_semicircular_band_yz(
    right_side_outer_x,
    1.0,
    0.0,
    side_panel_bottom_z + 0.3,
    side_panel_radius - 4.5,
    side_panel_radius - 9.0,
    side_rib_projection,
)

left_small_side_rib = make_semicircular_band_yz(
    left_side_outer_x,
    -1.0,
    16.0,
    seat_top_z + 7.0,
    22.0,
    17.0,
    side_rib_projection,
)
right_small_side_rib = make_semicircular_band_yz(
    right_side_outer_x,
    1.0,
    16.0,
    seat_top_z + 7.0,
    22.0,
    17.0,
    side_rib_projection,
)

leaf_rib = make_leaf_rib()

# Fuse the decorative bracket body.
decorative_bracket = (
    seat.union(back_panel)
    .union(left_side_panel)
    .union(right_side_panel)
    .union(left_outer_side_rib)
    .union(right_outer_side_rib)
    .union(left_small_side_rib)
    .union(right_small_side_rib)
    .union(leaf_rib)
)

# Add shallow diamond pockets on the top of the seat.
seat_pocket_specs = [
    (-28.0, -25.0, 22.0, 16.0, 0.0),
    (2.0, 18.0, 24.0, 17.0, 0.0),
    (29.0, -24.0, 22.0, 16.0, 0.0),
]

for pocket_x, pocket_y, pocket_dx, pocket_dy, pocket_angle in seat_pocket_specs:
    pocket_cutter = make_diamond_prism_xy(
        pocket_x,
        pocket_y,
        seat_top_z - seat_pocket_depth / 2.0,
        pocket_dx,
        pocket_dy,
        pocket_angle,
        seat_pocket_depth + 0.2,
    )
    decorative_bracket = decorative_bracket.cut(pocket_cutter)

# Add tilted diamond through-cutouts in the backrest.
back_cutout_specs = [
    (-18.0, seat_top_z + 88.0, 11.0, 18.0, -28.0),
    (1.0, seat_top_z + 100.0, 10.0, 15.0, 30.0),
    (20.0, seat_top_z + 86.0, 11.0, 18.0, 25.0),
    (-20.0, seat_top_z + 61.0, 12.0, 22.0, 20.0),
    (2.0, seat_top_z + 60.0, 9.0, 12.0, 0.0),
    (19.0, seat_top_z + 47.0, 12.0, 18.0, -20.0),
]

for cutout_x, cutout_z, cutout_dx, cutout_dz, cutout_angle in back_cutout_specs:
    cutout_cutter = make_diamond_prism_xz(
        cutout_x,
        cutout_z,
        back_center_y,
        cutout_dx,
        cutout_dz,
        cutout_angle,
        back_plate_thickness + 4.0,
    )
    decorative_bracket = decorative_bracket.cut(cutout_cutter)

# Add small diamond cutouts through the side arc panels.
side_cutout_depth = side_panel_thickness + 2.0 * side_rib_projection + 4.0
for side_x, side_angle in [
    (right_side_panel_center_x, 24.0),
    (left_side_panel_center_x, -24.0),
]:
    side_cutter = make_diamond_prism_yz(
        17.0,
        seat_top_z + 25.0,
        side_x,
        13.0,
        19.0,
        side_angle,
        side_cutout_depth,
    )
    decorative_bracket = decorative_bracket.cut(side_cutter)

# Place four waisted column legs below the seat with slight overlap for a single fused model.
base_leg = make_waisted_column()
leg_positions = [
    (-36.5, -30.5),
    (36.5, -30.5),
    (-36.5, 30.5),
    (36.5, 30.5),
]

result = decorative_bracket
for leg_x, leg_y in leg_positions:
    result = result.union(base_leg.translate((leg_x, leg_y, 0.0)))

result = result.clean()