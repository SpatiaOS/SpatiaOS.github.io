import math
import cadquery as cq

# Parameters
body_height = 130.0
body_max_radius = 30.0

# Pedestal molding and label
label_x_offset = 6.0
label_z_center = 78.0
label_width = 31.0
label_height = 16.0
label_inner_y = -19.6
label_plaque_relief = 0.9
label_text_relief = 0.8
label_text_size = 5.2
label_line_spacing = 5.8

# Crown ring
crown_teeth_count = 10
crown_inner_radius = 18.44
crown_outer_radius = 24.5
crown_wall_thickness = crown_outer_radius - crown_inner_radius
crown_bottom_z = body_height - 1.5
crown_band_height = 11.0
crown_tooth_base_z = crown_bottom_z + 9.0
crown_tooth_tip_z = crown_bottom_z + 24.5
crown_tooth_tangent_width = 12.0
crown_chevron_depth = 1.4
crown_chevron_width = 10.5

# Bearing balls
bearing_ball_count = 10
bearing_ball_radius = 3.0
bearing_ball_radial_position = crown_outer_radius - 0.6
bearing_ball_center_z = crown_tooth_tip_z + bearing_ball_radius - 0.7

# Key bars
parallel_key_length = 120.0
parallel_key_height = 7.5
parallel_key_depth = 7.5
parallel_key_z = 129.5
parallel_key_y = 5.5

short_key_length = 101.0
short_key_height = 7.5
short_key_depth = 7.5
short_key_z = 116.0
short_key_y = 4.0
short_key_conforming_radius = 48.0
short_key_conforming_sag = 1.0

# Main curved handle pair
handle_plate_thickness = 7.5
handle_y_center = 4.0
handle_tip_radius = 4.4

# Clips
clip_thickness = 2.0
clip_y_center = -16.0
clip_outer_radius = 7.0
clip_inner_radius = 4.2

# Thin decorative strips
front_strip_thickness = 1.35
front_strip_y_center = -20.0
rear_strip_thickness = 1.15
rear_strip_y_center = 8.25


# Helper functions
def mirror_x_points(points):
    return [(-x, z) for x, z in points]


def make_profile_plate(outer_points, inner_points, plate_thickness, y_center):
    """Create a vertical XZ freeform strip extruded in the Y direction."""
    return (
        cq.Workplane("XZ", origin=(0.0, y_center + plate_thickness / 2.0, 0.0))
        .moveTo(outer_points[0][0], outer_points[0][1])
        .spline(outer_points[1:], includeCurrent=True)
        .lineTo(inner_points[0][0], inner_points[0][1])
        .spline(inner_points[1:], includeCurrent=True)
        .close()
        .extrude(plate_thickness)
    )


def make_polygon_plate(profile_points, plate_thickness, y_center):
    """Create a thin vertical polygonal plate in the XZ plane."""
    return (
        cq.Workplane("XZ", origin=(0.0, y_center + plate_thickness / 2.0, 0.0))
        .polyline(profile_points)
        .close()
        .extrude(plate_thickness)
    )


def make_crown_tooth(angle_degrees):
    """Create one radial triangular tooth of the crown and rotate it into place."""
    return (
        cq.Workplane("YZ", origin=(crown_inner_radius, 0.0, 0.0))
        .polyline(
            [
                (-crown_tooth_tangent_width / 2.0, crown_tooth_base_z),
                (0.0, crown_tooth_tip_z),
                (crown_tooth_tangent_width / 2.0, crown_tooth_base_z),
            ]
        )
        .close()
        .extrude(crown_wall_thickness)
        .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle_degrees)
    )


def make_lower_crown_chevron(angle_degrees):
    """Create one raised lower V facet on the outer crown wall."""
    return (
        cq.Workplane("YZ", origin=(crown_outer_radius - crown_chevron_depth, 0.0, 0.0))
        .polyline(
            [
                (-crown_chevron_width / 2.0, crown_bottom_z + 8.8),
                (0.0, crown_bottom_z + 1.4),
                (crown_chevron_width / 2.0, crown_bottom_z + 8.8),
            ]
        )
        .close()
        .extrude(crown_chevron_depth + 0.35)
        .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle_degrees)
    )


def make_c_hook(center_x, center_z, side_sign, y_center):
    """Create an open C-shaped hook from an annular plate with an outward gap."""
    hook = (
        cq.Workplane("XZ", origin=(0.0, y_center + clip_thickness / 2.0, 0.0))
        .center(center_x, center_z)
        .circle(clip_outer_radius)
        .circle(clip_inner_radius)
        .extrude(clip_thickness)
    )

    gap_cutter = (
        cq.Workplane("XY")
        .box(clip_outer_radius * 1.35, clip_thickness * 3.0, clip_outer_radius * 1.8)
        .translate(
            (
                center_x + side_sign * clip_outer_radius * 0.78,
                y_center,
                center_z,
            )
        )
    )

    return hook.cut(gap_cutter, clean=False)


def make_clip(side_sign, y_center):
    """Create one thin retaining clip with two C-hook features and angled tabs."""
    upper_hook = make_c_hook(side_sign * 31.5, 114.5, side_sign, y_center)
    lower_hook = make_c_hook(side_sign * 29.5, 104.2, side_sign, y_center)

    bridge_points = [
        (side_sign * 21.5, 118.0),
        (side_sign * 31.0, 120.0),
        (side_sign * 37.0, 114.0),
        (side_sign * 33.4, 108.8),
        (side_sign * 38.0, 102.5),
        (side_sign * 31.0, 96.0),
        (side_sign * 22.0, 99.0),
        (side_sign * 25.7, 108.2),
    ]
    bridge = make_polygon_plate(bridge_points, clip_thickness, y_center)

    return upper_hook.union(lower_hook, clean=False).union(bridge, clean=False)


# Revolved pedestal body
pedestal_profile_points = [
    (0.0, 0.0),
    (26.0, 0.0),
    (29.0, 1.0),
    (30.0, 3.0),
    (30.0, 6.4),
    (28.2, 8.5),
    (25.0, 11.0),
    (23.0, 14.8),
    (24.2, 18.0),
    (27.8, 21.8),
    (29.8, 26.5),
    (29.5, 32.5),
    (26.5, 37.0),
    (23.5, 42.5),
    (22.2, 55.0),
    (21.4, 70.0),
    (20.7, 84.0),
    (19.8, 99.5),
    (22.5, 103.0),
    (27.0, 107.5),
    (29.0, 112.0),
    (27.8, 116.0),
    (24.0, 119.8),
    (20.5, 122.8),
    (18.0, 126.5),
    (18.8, 128.4),
    (22.0, 129.3),
    (22.0, body_height),
    (0.0, body_height),
]

pedestal_body = (
    cq.Workplane("XZ")
    .polyline(pedestal_profile_points)
    .close()
    .revolve(360.0, axisStart=(0.0, 0.0, 0.0), axisEnd=(0.0, 0.0, 1.0))
)

# Add raised axisymmetric moldings that emphasize the base, shoulder, and top collar.
base_lip = (
    cq.Workplane("XY")
    .circle(30.0)
    .circle(23.5)
    .extrude(2.2)
    .translate((0.0, 0.0, 3.6))
)

lower_molding = (
    cq.Workplane("XY")
    .circle(28.0)
    .circle(18.5)
    .extrude(2.4)
    .translate((0.0, 0.0, 35.0))
)

upper_molding = (
    cq.Workplane("XY")
    .circle(26.8)
    .circle(18.0)
    .extrude(2.0)
    .translate((0.0, 0.0, 100.5))
)

neck_collar = (
    cq.Workplane("XY")
    .circle(24.0)
    .circle(15.5)
    .extrude(3.6)
    .translate((0.0, 0.0, 123.8))
)

top_support_disk = (
    cq.Workplane("XY")
    .circle(24.0)
    .extrude(2.4)
    .translate((0.0, 0.0, 126.8))
)

pedestal_body = (
    pedestal_body.union(base_lip, clean=False)
    .union(lower_molding, clean=False)
    .union(upper_molding, clean=False)
    .union(neck_collar, clean=False)
    .union(top_support_disk, clean=False)
)

# Add a shallow raised plaque and embossed lettering on the tapered body.
label_plaque = (
    cq.Workplane("XZ", origin=(0.0, label_inner_y, 0.0))
    .center(label_x_offset, label_z_center)
    .rect(label_width, label_height)
    .extrude(label_plaque_relief)
)
pedestal_body = pedestal_body.union(label_plaque, clean=False)

label_text_base_y = label_inner_y - label_plaque_relief + 0.05
try:
    label_line_1 = (
        cq.Workplane("XY")
        .text(
            "Premier",
            label_text_size,
            label_text_relief,
            cut=False,
            combine=False,
            halign="center",
            valign="center",
        )
        .rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), 90.0)
        .translate(
            (
                label_x_offset,
                label_text_base_y,
                label_z_center + label_line_spacing / 2.0,
            )
        )
    )

    label_line_2 = (
        cq.Workplane("XY")
        .text(
            "League",
            label_text_size,
            label_text_relief,
            cut=False,
            combine=False,
            halign="center",
            valign="center",
        )
        .rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), 90.0)
        .translate(
            (
                label_x_offset,
                label_text_base_y,
                label_z_center - label_line_spacing / 2.0,
            )
        )
    )

    pedestal_body = pedestal_body.union(label_line_1, clean=False).union(
        label_line_2, clean=False
    )
except Exception:
    fallback_label_marks = (
        cq.Workplane("XY")
        .box(20.0, label_text_relief, 0.8)
        .translate(
            (
                label_x_offset,
                label_text_base_y - label_text_relief / 2.0,
                label_z_center + 3.0,
            )
        )
        .union(
            cq.Workplane("XY")
            .box(18.0, label_text_relief, 0.8)
            .translate(
                (
                    label_x_offset,
                    label_text_base_y - label_text_relief / 2.0,
                    label_z_center - 3.0,
                )
            ),
            clean=False,
        )
        .union(
            cq.Workplane("XY")
            .box(1.2, label_text_relief, 11.0)
            .translate(
                (
                    label_x_offset - 11.0,
                    label_text_base_y - label_text_relief / 2.0,
                    label_z_center,
                )
            ),
            clean=False,
        )
    )
    pedestal_body = pedestal_body.union(fallback_label_marks, clean=False)


# Serrated crown ring
crown = (
    cq.Workplane("XY")
    .circle(crown_outer_radius)
    .circle(crown_inner_radius)
    .extrude(crown_band_height)
    .translate((0.0, 0.0, crown_bottom_z))
)

angle_step = 360.0 / crown_teeth_count
for tooth_index in range(crown_teeth_count):
    tooth_angle = tooth_index * angle_step
    crown = crown.union(make_crown_tooth(tooth_angle), clean=False)

for chevron_index in range(crown_teeth_count):
    chevron_angle = (chevron_index + 0.5) * angle_step
    crown = crown.union(make_lower_crown_chevron(chevron_angle), clean=False)

for ball_index in range(bearing_ball_count):
    ball_angle = math.radians(ball_index * angle_step)
    ball_x = bearing_ball_radial_position * math.cos(ball_angle)
    ball_y = bearing_ball_radial_position * math.sin(ball_angle)
    bearing_ball = (
        cq.Workplane("XY")
        .sphere(bearing_ball_radius)
        .translate((ball_x, ball_y, bearing_ball_center_z))
    )
    crown = crown.union(bearing_ball, clean=False)


# Round-ended top parallel key
parallel_key = (
    cq.Workplane(
        "XZ",
        origin=(0.0, parallel_key_y + parallel_key_depth / 2.0, parallel_key_z),
    )
    .slot2D(parallel_key_length, parallel_key_height)
    .extrude(parallel_key_depth)
)

# Shorter conforming-face key
short_key_blank = (
    cq.Workplane("XY")
    .box(short_key_length, short_key_depth, short_key_height)
    .translate((0.0, short_key_y, short_key_z))
)

short_key_cutter_center_z = (
    short_key_z
    - short_key_height / 2.0
    - short_key_conforming_radius
    + short_key_conforming_sag
)
short_key_curved_face_cutter = (
    cq.Workplane(
        "YZ",
        origin=(
            -short_key_length / 2.0 - 2.0,
            short_key_y,
            short_key_cutter_center_z,
        ),
    )
    .circle(short_key_conforming_radius)
    .extrude(short_key_length + 4.0)
)
short_key = short_key_blank.cut(short_key_curved_face_cutter, clean=False)


# Main mirrored curved handles
right_handle_outer = [
    (39.0, 139.0),
    (48.0, 137.0),
    (54.0, 122.0),
    (56.0, 92.0),
    (51.5, 62.0),
    (45.0, 32.0),
    (39.0, 8.0),
]
right_handle_inner = [
    (31.0, 10.0),
    (35.0, 36.0),
    (39.0, 63.0),
    (41.0, 95.0),
    (38.0, 120.0),
    (32.0, 136.0),
]

right_handle = make_profile_plate(
    right_handle_outer, right_handle_inner, handle_plate_thickness, handle_y_center
)
left_handle = make_profile_plate(
    mirror_x_points(right_handle_outer),
    mirror_x_points(right_handle_inner),
    handle_plate_thickness,
    handle_y_center,
)

right_handle_tip = (
    cq.Workplane("XZ", origin=(0.0, handle_y_center + handle_plate_thickness / 2.0, 0.0))
    .center(35.0, 8.5)
    .circle(handle_tip_radius)
    .extrude(handle_plate_thickness)
)

left_handle_tip = (
    cq.Workplane("XZ", origin=(0.0, handle_y_center + handle_plate_thickness / 2.0, 0.0))
    .center(-35.0, 8.5)
    .circle(handle_tip_radius)
    .extrude(handle_plate_thickness)
)

right_handle_head = (
    cq.Workplane("XY")
    .box(15.0, handle_plate_thickness, 12.0)
    .translate((42.8, handle_y_center, 135.0))
)

left_handle_head = (
    cq.Workplane("XY")
    .box(15.0, handle_plate_thickness, 12.0)
    .translate((-42.8, handle_y_center, 135.0))
)

right_handle = right_handle.union(right_handle_tip, clean=False).union(
    right_handle_head, clean=False
)
left_handle = left_handle.union(left_handle_tip, clean=False).union(
    left_handle_head, clean=False
)


# Thin S-curved decorative strips and shaped legs
front_right_outer = [
    (28.0, 130.0),
    (34.0, 118.0),
    (32.0, 96.0),
    (27.0, 72.0),
    (24.0, 48.0),
    (25.5, 24.0),
    (21.0, -18.5),
]
front_right_inner = [
    (12.5, -20.5),
    (16.5, 24.0),
    (19.0, 49.0),
    (20.5, 74.0),
    (22.5, 98.5),
    (22.0, 121.0),
    (19.0, 129.0),
]

front_strip_right = make_profile_plate(
    front_right_outer, front_right_inner, front_strip_thickness, front_strip_y_center
)
front_strip_left = make_profile_plate(
    mirror_x_points(front_right_outer),
    mirror_x_points(front_right_inner),
    front_strip_thickness,
    front_strip_y_center,
)

rear_right_outer = [
    (46.0, 136.0),
    (52.0, 119.0),
    (51.0, 96.0),
    (47.0, 72.0),
    (42.0, 43.0),
    (36.0, 6.0),
]
rear_right_inner = [
    (30.0, 8.0),
    (34.0, 42.0),
    (37.0, 72.0),
    (39.0, 96.0),
    (39.5, 119.0),
    (37.0, 134.0),
]

rear_strip_right = make_profile_plate(
    rear_right_outer, rear_right_inner, rear_strip_thickness, rear_strip_y_center
)
rear_strip_left = make_profile_plate(
    mirror_x_points(rear_right_outer),
    mirror_x_points(rear_right_inner),
    rear_strip_thickness,
    rear_strip_y_center,
)


# Retaining clips near the upper shoulder
right_clip = make_clip(1.0, clip_y_center)
left_clip = make_clip(-1.0, clip_y_center)


# Create the final unified model
result = (
    pedestal_body.union(parallel_key, clean=False)
    .union(short_key, clean=False)
    .union(right_handle, clean=False)
    .union(left_handle, clean=False)
    .union(front_strip_right, clean=False)
    .union(front_strip_left, clean=False)
    .union(rear_strip_right, clean=False)
    .union(rear_strip_left, clean=False)
    .union(right_clip, clean=False)
    .union(left_clip, clean=False)
    .union(crown, clean=False)
)