import math
import cadquery as cq

# Dimensions are in millimetres. The pivot axis is X; leaf profiles lie in YZ.
blade_thickness = 2.0
handle_thickness = 7.0
handle_edge_radius = 1.2

large_leaf_tip_distance = 80.6
small_leaf_tip_distance = 82.4
large_leaf_angle = -10.0
small_leaf_angle = 0.0

blade_heel_z = -8.0
cutting_edge_root_offset = 4.1
blade_tip_offset = 1.0
cutting_bevel_width = 3.6
cutting_edge_thickness = 0.18

# Finger-loop dimensions and centres are expressed in local YZ coordinates.
large_loop_center = (8.9, 51.8)
large_loop_outer_size = (25.9, 51.2)
large_loop_opening_size = (16.8, 40.4)
large_opening_lift = 1.2

small_loop_center = (-10.5, 58.8)
small_loop_outer_size = (21.0, 36.4)
small_loop_opening_size = (13.0, 23.8)
small_opening_lift = 1.0

loop_pear_factor = 0.06
loop_profile_samples = 24

pivot_bore_diameter = 1.583
pivot_boss_radius = 2.654
pivot_boss_height = 0.20

fastener_shaft_radius = 0.876
fastener_shaft_length = 2.0 * blade_thickness
front_head_radius = 2.66
rear_head_radius = 2.56
head_thickness = 1.0
head_edge_radius = 0.28
slot_width = 0.65
slot_depth = 0.58
slot_angle = -18.0

cutter_margin = 1.0

# Fractional distance from tip to heel, followed by distance to the blade spine.
blade_spine_stations = (
    (0.040, 2.10),
    (0.135, 3.35),
    (0.310, 4.35),
    (0.570, 4.85),
    (0.840, 4.80),
    (1.000, 4.60),
)


def make_finger_loop(center, outer_size, opening_size, opening_lift, x_center):
    """Create a softly rounded, slightly pear-shaped finger loop."""
    center_y, center_z = center
    outer_width, outer_height = outer_size
    opening_width, opening_height = opening_size
    axial_start = x_center - handle_thickness / 2.0

    outline_points = []
    for index in range(loop_profile_samples):
        angle = 2.0 * math.pi * index / loop_profile_samples
        sine = math.sin(angle)
        outline_points.append(
            (
                center_y
                + outer_width / 2.0
                * math.cos(angle)
                * (1.0 + loop_pear_factor * sine),
                center_z + outer_height / 2.0 * sine,
            )
        )

    loop_blank = (
        cq.Workplane("YZ", origin=(axial_start, 0, 0))
        .spline(outline_points, periodic=True)
        .close()
        .extrude(handle_thickness)
    )
    finger_opening = (
        cq.Workplane(
            "YZ",
            origin=(
                axial_start - cutter_margin,
                center_y,
                center_z + opening_lift,
            ),
        )
        .ellipse(opening_width / 2.0, opening_height / 2.0)
        .extrude(handle_thickness + 2.0 * cutter_margin)
    )

    return (
        loop_blank.cut(finger_opening)
        .edges("not |X")
        .fillet(handle_edge_radius)
    )


def make_blade_and_shank(side, tip_distance, neck_spine_points, neck_edge_points):
    """Mirror the cutting geometry and its bevel onto the appropriate outer face."""
    axial_start = 0.0 if side > 0 else -blade_thickness
    edge_root = (side * cutting_edge_root_offset, blade_heel_z)
    edge_tip = (-side * blade_tip_offset, -tip_distance)
    blade_span = tip_distance + blade_heel_z

    spine_points = [
        (-side * spine_offset, -tip_distance + fraction * blade_span)
        for fraction, spine_offset in blade_spine_stations
    ]

    leaf_blank = (
        cq.Workplane("YZ", origin=(axial_start, 0, 0))
        .moveTo(*edge_root)
        .lineTo(*edge_tip)
        .spline(spine_points, includeCurrent=True)
        .spline(neck_spine_points, includeCurrent=True)
        .lineTo(*neck_edge_points[0])
        .spline(neck_edge_points[1:] + [edge_root], includeCurrent=True)
        .close()
        .extrude(blade_thickness)
    )

    # A prismatic grinding cut follows the straight cutting edge. Its local
    # vertical direction points toward the exposed face of either blade.
    delta_y = edge_tip[0] - edge_root[0]
    delta_z = edge_tip[1] - edge_root[1]
    edge_length = math.hypot(delta_y, delta_z)
    direction_y = delta_y / edge_length
    direction_z = delta_z / edge_length

    bevel_plane = cq.Plane(
        origin=(0, edge_root[0], edge_root[1]),
        xDir=(0, -side * direction_z, side * direction_y),
        normal=(0, direction_y, direction_z),
    )
    bevel_cutter = (
        cq.Workplane(bevel_plane)
        .polyline(
            [
                (-cutting_bevel_width, blade_thickness),
                (0, cutting_edge_thickness),
                (cutting_bevel_width + cutter_margin, cutting_edge_thickness),
                (
                    cutting_bevel_width + cutter_margin,
                    blade_thickness + cutter_margin,
                ),
                (-cutting_bevel_width, blade_thickness + cutter_margin),
            ]
        )
        .close()
        .extrude(edge_length + cutter_margin)
    )

    return leaf_blank.cut(bevel_cutter)


# Curved necks terminate inside the solid lower portions of the finger loops.
large_shank_top_z = (
    large_loop_center[1] - large_loop_outer_size[1] / 2.0 + 5.8
)
small_shank_top_z = (
    small_loop_center[1] - small_loop_outer_size[1] / 2.0 + 3.6
)

large_neck_spine = [
    (-4.55, 1.0),
    (-3.80, 10.0),
    (-1.20, 22.0),
    (large_loop_center[0] - 6.3, large_shank_top_z),
]
large_neck_edge = [
    (large_loop_center[0] + 6.3, large_shank_top_z),
    (9.40, 23.0),
    (5.70, 12.0),
    (4.60, 2.0),
    (4.35, -3.0),
]

small_neck_spine = [
    (4.65, 1.0),
    (2.10, 12.0),
    (-3.00, 25.0),
    (small_loop_center[0] + 6.9, 36.0),
    (small_loop_center[0] + 5.6, small_shank_top_z),
]
small_neck_edge = [
    (small_loop_center[0] - 5.6, small_shank_top_z),
    (small_loop_center[0] - 1.8, 35.0),
    (-9.20, 23.0),
    (-5.40, 12.0),
    (-4.65, 2.0),
]

large_loop = make_finger_loop(
    large_loop_center,
    large_loop_outer_size,
    large_loop_opening_size,
    large_opening_lift,
    blade_thickness / 2.0,
)
small_loop = make_finger_loop(
    small_loop_center,
    small_loop_outer_size,
    small_loop_opening_size,
    small_opening_lift,
    -blade_thickness / 2.0,
)

large_leaf_blank = make_blade_and_shank(
    1, large_leaf_tip_distance, large_neck_spine, large_neck_edge
)
small_leaf_blank = make_blade_and_shank(
    -1, small_leaf_tip_distance, small_neck_spine, small_neck_edge
)

rear_pivot_boss = (
    cq.Workplane(
        "YZ", origin=(-blade_thickness - pivot_boss_height, 0, 0)
    )
    .circle(pivot_boss_radius)
    .extrude(pivot_boss_height)
)

drill_half_span = blade_thickness + pivot_boss_height + cutter_margin
pivot_drill = (
    cq.Workplane("YZ", origin=(-drill_half_span, 0, 0))
    .circle(pivot_bore_diameter / 2.0)
    .extrude(2.0 * drill_half_span)
)

front_leaf = (
    large_leaf_blank.union(large_loop)
    .cut(pivot_drill)
    .rotate((0, 0, 0), (1, 0, 0), large_leaf_angle)
)
rear_leaf = (
    small_leaf_blank.union(small_loop)
    .union(rear_pivot_boss)
    .cut(pivot_drill)
    .rotate((0, 0, 0), (1, 0, 0), small_leaf_angle)
)

# Spool fastener: four-millimetre shaft, rounded disc heads, and screwdriver slot.
shaft_half_span = fastener_shaft_length / 2.0
pivot_shaft = (
    cq.Workplane("YZ", origin=(-shaft_half_span, 0, 0))
    .circle(fastener_shaft_radius)
    .extrude(fastener_shaft_length)
)
front_head = (
    cq.Workplane("YZ", origin=(shaft_half_span, 0, 0))
    .circle(front_head_radius)
    .extrude(head_thickness)
    .edges(">X")
    .fillet(head_edge_radius)
)
rear_head = (
    cq.Workplane("YZ", origin=(-shaft_half_span - head_thickness, 0, 0))
    .circle(rear_head_radius)
    .extrude(head_thickness)
    .edges("<X")
    .fillet(head_edge_radius)
)

slot_center_x = (
    shaft_half_span
    + head_thickness
    - slot_depth / 2.0
    + cutter_margin / 2.0
)
slot_cutter = (
    cq.Workplane("XY")
    .box(
        slot_depth + cutter_margin,
        slot_width,
        2.0 * front_head_radius + 2.0 * cutter_margin,
    )
    .translate((slot_center_x, 0, 0))
    .rotate((0, 0, 0), (1, 0, 0), slot_angle)
)
pivot_fastener = (
    pivot_shaft.union(front_head)
    .union(rear_head)
    .cut(slot_cutter)
)

# Fuse the contacting leaves and fitted fastener into a single unified model.
result = front_leaf.union(rear_leaf).union(pivot_fastener).clean()