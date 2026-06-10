import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters
# Interpreted from the image as a thin semi-hollow electric guitar:
# - Long axis along Y
# - Body at negative/low Y, neck/headstock at positive Y
# - Thin layered construction in Z
# ---------------------------------------------------------------------------

# Body proportions
body_length = 185.0
body_width = 160.0
body_thickness = 8.0
body_back_thickness = 3.2
body_side_binding_thickness = 0.55
body_top_thickness = body_thickness - body_back_thickness - body_side_binding_thickness
body_top_z = body_thickness

body_neck_pocket_width = 30.0
top_binding_width = 4.0
top_binding_thickness = 0.25

# Neck and fretboard
neck_start_y = 47.0
fretboard_start_y = 43.0
nut_y = 315.0

neck_width_at_body = 34.0
neck_width_at_nut = 21.0
neck_thickness = 3.0
neck_base_z = body_top_z + 0.05

fretboard_width_at_body = 31.0
fretboard_width_at_nut = 18.5
fretboard_thickness = 1.25
fretboard_base_z = neck_base_z + neck_thickness
fretboard_top_z = fretboard_base_z + fretboard_thickness

fret_count = 22
fret_wire_depth = 0.75
fret_wire_height = 0.35
fret_marker_radius = 1.65
fret_marker_height = 0.12
fretboard_side_binding_width = 0.8
fretboard_side_binding_height = 0.10

# Headstock and tuners
headstock_length = 62.0
headstock_max_width = 52.0
headstock_thickness = 3.0
headstock_base_z = body_top_z + 0.35
headstock_top_z = headstock_base_z + headstock_thickness

tuner_post_x = 12.0
tuner_key_x = 32.0
tuner_post_radius = 1.5
tuner_post_height = 2.0
tuner_washer_radius = 2.7
tuner_washer_height = 0.20
tuner_key_x_radius = 4.8
tuner_key_y_radius = 2.8
tuner_key_height = 0.70

# Pickups and bridge hardware
neck_pickup_y = 31.0
bridge_pickup_y = -7.0
pickup_outer_width = 46.0
pickup_outer_depth = 24.0
pickup_inner_width = 37.0
pickup_inner_depth = 16.5
pickup_ring_height = 0.75
pickup_pole_spacing = 6.0

bridge_y = -36.0
tailpiece_y = -61.0
bridge_length = 50.0
bridge_depth = 7.0
bridge_height = 1.2
tailpiece_length = 56.0
tailpiece_depth = 8.0
tailpiece_height = 1.5

# Strings
string_count = 6
bridge_string_spacing = 38.0
nut_string_spacing = 17.0
string_height = 0.18
string_clearance_above_fretboard = 0.70
string_z_center = fretboard_top_z + string_clearance_above_fretboard + string_height / 2.0
scale_length = nut_y - bridge_y

# F-holes and controls
f_hole_x = 51.0
f_hole_slot_width = 2.7
f_hole_z = body_top_z + 0.06
f_hole_height = 0.08

control_knob_radius = 5.0
control_knob_positions = [
    (52.0, 8.0),
    (64.0, -18.0),
    (50.0, -44.0),
    (28.0, -36.0),
]

toggle_switch_position = (49.0, 45.0)
output_jack_position = (66.0, -63.0)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def smooth_closed_polyline(points, iterations=2):
    """Chaikin smoothing to soften polygonal guitar outlines."""
    smoothed = [tuple(p) for p in points]
    for _ in range(iterations):
        next_points = []
        count = len(smoothed)
        for i in range(count):
            p0 = smoothed[i]
            p1 = smoothed[(i + 1) % count]
            q = (0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1])
            r = (0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1])
            next_points.extend([q, r])
        smoothed = next_points
    return smoothed


def scale_points(points, scale_x, scale_y, center=(0.0, 0.0)):
    """Scale XY points about a chosen center."""
    center_x, center_y = center
    return [
        (center_x + (x - center_x) * scale_x, center_y + (y - center_y) * scale_y)
        for x, y in points
    ]


def make_closed_profile(points, z_offset=0.0):
    """Create a closed 2D profile on an XY workplane at a Z offset."""
    return cq.Workplane("XY", origin=(0.0, 0.0, z_offset)).polyline(points).close()


def make_tapered_plate(y_start, y_end, width_start, width_end, z_base, thickness):
    """Create a tapered trapezoidal plate used for neck and fretboard."""
    corners = [
        (-width_start / 2.0, y_start),
        (width_start / 2.0, y_start),
        (width_end / 2.0, y_end),
        (-width_end / 2.0, y_end),
    ]
    return cq.Workplane("XY").polyline(corners).close().extrude(thickness).translate((0.0, 0.0, z_base))


def make_box(width, depth, height, x, y, z_center):
    """Create a centered rectangular solid."""
    return cq.Workplane("XY").box(width, depth, height).translate((x, y, z_center))


def make_cylinder(radius, height, x, y, z_base):
    """Create a vertical cylinder with its base at z_base."""
    return (
        cq.Workplane("XY", origin=(0.0, 0.0, z_base))
        .center(x, y)
        .circle(radius)
        .extrude(height)
    )


def make_slot(x, y, length, diameter, angle_degrees, z_base, height):
    """Create a rounded capsule/slot solid on the XY plane."""
    return (
        cq.Workplane("XY", origin=(0.0, 0.0, z_base))
        .center(x, y)
        .slot2D(length, diameter, angle_degrees)
        .extrude(height)
    )


def make_ellipse_disc(x_radius, y_radius, height, x, y, z_base, angle_degrees=0.0):
    """Create a thin elliptical disc, optionally rotated about Z."""
    disc = cq.Workplane("XY").ellipse(x_radius, y_radius).extrude(height)
    if abs(angle_degrees) > 1.0e-6:
        disc = disc.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle_degrees)
    return disc.translate((x, y, z_base))


def make_rect_segment(start_xy, end_xy, width, height, z_center):
    """Create a narrow rectangular prism between two XY points."""
    start_x, start_y = start_xy
    end_x, end_y = end_xy
    dx = end_x - start_x
    dy = end_y - start_y
    length = math.hypot(dx, dy)
    angle_degrees = math.degrees(math.atan2(dy, dx))
    mid_x = (start_x + end_x) / 2.0
    mid_y = (start_y + end_y) / 2.0

    return (
        cq.Workplane("XY")
        .box(length, width, height)
        .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle_degrees)
        .translate((mid_x, mid_y, z_center))
    )


def make_rect_frame(outer_width, outer_depth, inner_width, inner_depth, height, x, y, z_base):
    """Create a rectangular frame by subtracting a centered inner rectangle."""
    outer = cq.Workplane("XY").rect(outer_width, outer_depth).extrude(height)
    inner = (
        cq.Workplane("XY")
        .rect(inner_width, inner_depth)
        .extrude(height + 0.2)
        .translate((0.0, 0.0, -0.1))
    )
    return outer.cut(inner).translate((x, y, z_base))


def interpolate_width_at_y(y, y_start, y_end, width_start, width_end):
    """Linear width interpolation for tapered fretboard features."""
    t = (y - y_start) / (y_end - y_start)
    t = max(0.0, min(1.0, t))
    return width_start + t * (width_end - width_start)


def linear_positions(total_width, count):
    """Evenly spaced positions centered on X=0."""
    return [
        -total_width / 2.0 + i * total_width / (count - 1)
        for i in range(count)
    ]


# Collect solids as a compound instead of using cq.Assembly.
# This avoids STEP export issues caused by generic exporters iterating assemblies.
model_shapes = []


def add_part(workplane_object):
    """Append a CadQuery workplane's primary shape to the final compound list."""
    model_shapes.append(workplane_object.val())


# ---------------------------------------------------------------------------
# Body outline
# ---------------------------------------------------------------------------

half_body_width = body_width / 2.0
body_tail_y = -body_length * 0.51
body_neck_y = body_length * 0.45
body_center_y = (body_tail_y + body_neck_y) / 2.0

# Double-cut semi-hollow body outline approximated from the image.
body_outline_control_points = [
    (body_neck_pocket_width / 2.0, body_neck_y),
    (half_body_width * 0.28, body_neck_y - body_length * 0.04),
    (half_body_width * 0.55, body_neck_y + body_length * 0.005),
    (half_body_width * 0.80, body_length * 0.35),
    (half_body_width * 0.76, body_length * 0.23),
    (half_body_width * 0.54, body_length * 0.12),
    (half_body_width * 0.78, body_length * 0.04),
    (half_body_width * 0.98, -body_length * 0.10),
    (half_body_width * 1.00, -body_length * 0.27),
    (half_body_width * 0.80, -body_length * 0.42),
    (half_body_width * 0.35, body_tail_y + body_length * 0.02),
    (0.0, body_tail_y),
    (-half_body_width * 0.35, body_tail_y + body_length * 0.02),
    (-half_body_width * 0.80, -body_length * 0.42),
    (-half_body_width * 1.00, -body_length * 0.27),
    (-half_body_width * 0.98, -body_length * 0.10),
    (-half_body_width * 0.78, body_length * 0.04),
    (-half_body_width * 0.54, body_length * 0.12),
    (-half_body_width * 0.76, body_length * 0.23),
    (-half_body_width * 0.80, body_length * 0.35),
    (-half_body_width * 0.55, body_neck_y + body_length * 0.005),
    (-half_body_width * 0.28, body_neck_y - body_length * 0.04),
    (-body_neck_pocket_width / 2.0, body_neck_y),
]

body_outline_points = smooth_closed_polyline(body_outline_control_points, iterations=3)


# ---------------------------------------------------------------------------
# Main body layers and top binding
# ---------------------------------------------------------------------------

body_back = make_closed_profile(body_outline_points, 0.0).extrude(body_back_thickness)
body_side_stripe = make_closed_profile(body_outline_points, body_back_thickness).extrude(body_side_binding_thickness)
body_top = make_closed_profile(
    body_outline_points,
    body_back_thickness + body_side_binding_thickness,
).extrude(body_top_thickness)

add_part(body_back)
add_part(body_side_stripe)
add_part(body_top)

# Raised perimeter binding ring on the top face.
inner_binding_points = scale_points(
    body_outline_points,
    1.0 - 2.0 * top_binding_width / body_width,
    1.0 - 2.0 * top_binding_width / body_length,
    center=(0.0, body_center_y),
)

top_binding_outer = make_closed_profile(body_outline_points, body_top_z + 0.02).extrude(top_binding_thickness)
top_binding_inner_cut = make_closed_profile(inner_binding_points, body_top_z - 0.02).extrude(top_binding_thickness + 0.08)
top_binding = top_binding_outer.cut(top_binding_inner_cut)

add_part(top_binding)


# ---------------------------------------------------------------------------
# F-holes as shallow raised dark-inlay/cutout shapes
# ---------------------------------------------------------------------------

for side, center_y in [(-1, -14.0), (1, 10.0)]:
    stem_angle = 90.0 - side * 14.0
    f_parts = [
        make_slot(side * f_hole_x, center_y, 32.0, f_hole_slot_width, stem_angle, f_hole_z, f_hole_height),
        make_slot(side * f_hole_x, center_y + 14.0, 15.0, 2.2, side * 8.0, f_hole_z, f_hole_height),
        make_slot(side * f_hole_x, center_y - 17.0, 15.0, 2.2, -side * 8.0, f_hole_z, f_hole_height),
        make_cylinder(1.75, f_hole_height, side * (f_hole_x + 3.0), center_y + 17.0, f_hole_z),
        make_cylinder(1.75, f_hole_height, side * (f_hole_x - 3.0), center_y - 20.0, f_hole_z),
    ]
    for part in f_parts:
        add_part(part)


# ---------------------------------------------------------------------------
# Neck, fretboard, frets, markers, and nut
# ---------------------------------------------------------------------------

# Heel block visible where the neck joins the semi-hollow body.
neck_heel = make_tapered_plate(
    fretboard_start_y - 5.0,
    body_neck_y + 7.0,
    38.0,
    29.0,
    body_top_z + 0.03,
    1.4,
)
add_part(neck_heel)

neck = make_tapered_plate(
    neck_start_y,
    nut_y + 3.0,
    neck_width_at_body,
    neck_width_at_nut,
    neck_base_z,
    neck_thickness,
)
add_part(neck)

fretboard = make_tapered_plate(
    fretboard_start_y,
    nut_y,
    fretboard_width_at_body,
    fretboard_width_at_nut,
    fretboard_base_z,
    fretboard_thickness,
)
add_part(fretboard)

# Light side-binding strips along the fretboard edges.
fretboard_edge_z = fretboard_top_z + fretboard_side_binding_height / 2.0 + 0.02
left_fretboard_binding = make_rect_segment(
    (-fretboard_width_at_body / 2.0, fretboard_start_y),
    (-fretboard_width_at_nut / 2.0, nut_y),
    fretboard_side_binding_width,
    fretboard_side_binding_height,
    fretboard_edge_z,
)
right_fretboard_binding = make_rect_segment(
    (fretboard_width_at_body / 2.0, fretboard_start_y),
    (fretboard_width_at_nut / 2.0, nut_y),
    fretboard_side_binding_width,
    fretboard_side_binding_height,
    fretboard_edge_z,
)
add_part(left_fretboard_binding)
add_part(right_fretboard_binding)

# Fret wires using equal-temperament spacing.
fret_y_positions = []
for fret_number in range(1, fret_count + 1):
    distance_from_nut = scale_length - scale_length / (2.0 ** (fret_number / 12.0))
    fret_y = nut_y - distance_from_nut
    fret_y_positions.append(fret_y)

    if fret_y <= fretboard_start_y + 1.0:
        continue

    fret_width = interpolate_width_at_y(
        fret_y,
        fretboard_start_y,
        nut_y,
        fretboard_width_at_body,
        fretboard_width_at_nut,
    )
    fret_bar = make_box(
        fret_width + 1.2,
        fret_wire_depth,
        fret_wire_height,
        0.0,
        fret_y,
        fretboard_top_z + fret_wire_height / 2.0,
    )
    add_part(fret_bar)

# Dot position markers.
marker_frets = [3, 5, 7, 9, 12, 15, 17, 19, 21]
for marker_fret in marker_frets:
    if marker_fret > fret_count:
        continue

    fret_before_y = nut_y if marker_fret == 1 else fret_y_positions[marker_fret - 2]
    fret_after_y = fret_y_positions[marker_fret - 1]
    marker_y = (fret_before_y + fret_after_y) / 2.0

    if marker_y <= fretboard_start_y:
        continue

    marker_x_positions = [-3.8, 3.8] if marker_fret == 12 else [0.0]
    for marker_x in marker_x_positions:
        marker = make_cylinder(
            fret_marker_radius,
            fret_marker_height,
            marker_x,
            marker_y,
            fretboard_top_z + 0.04,
        )
        add_part(marker)

# Nut at the headstock transition.
nut = make_box(
    fretboard_width_at_nut + 4.0,
    3.0,
    1.25,
    0.0,
    nut_y + 0.2,
    fretboard_top_z + 0.625,
)
add_part(nut)


# ---------------------------------------------------------------------------
# Headstock, truss rod cover, and tuning machines
# ---------------------------------------------------------------------------

headstock_half_width = headstock_max_width / 2.0
headstock_control_points = [
    (neck_width_at_nut / 2.0, nut_y),
    (headstock_half_width * 0.70, nut_y + 8.0),
    (headstock_half_width * 0.98, nut_y + 28.0),
    (headstock_half_width * 0.88, nut_y + 47.0),
    (headstock_half_width * 0.50, nut_y + 59.0),
    (headstock_half_width * 0.18, nut_y + 60.0),
    (0.0, nut_y + 53.0),
    (-headstock_half_width * 0.18, nut_y + 60.0),
    (-headstock_half_width * 0.50, nut_y + 59.0),
    (-headstock_half_width * 0.88, nut_y + 47.0),
    (-headstock_half_width * 0.98, nut_y + 28.0),
    (-headstock_half_width * 0.70, nut_y + 8.0),
    (-neck_width_at_nut / 2.0, nut_y),
]
headstock_points = smooth_closed_polyline(headstock_control_points, iterations=1)
headstock = make_closed_profile(headstock_points, headstock_base_z).extrude(headstock_thickness)
add_part(headstock)

# Small truss rod cover.
truss_cover_points = [
    (-4.2, nut_y + 7.0),
    (4.2, nut_y + 7.0),
    (3.0, nut_y + 22.0),
    (0.0, nut_y + 28.0),
    (-3.0, nut_y + 22.0),
]
truss_cover = (
    cq.Workplane("XY", origin=(0.0, 0.0, headstock_top_z + 0.06))
    .polyline(truss_cover_points)
    .close()
    .extrude(0.18)
)
add_part(truss_cover)

for screw_y in [nut_y + 10.0, nut_y + 23.5]:
    screw = make_cylinder(0.75, 0.12, 0.0, screw_y, headstock_top_z + 0.28)
    add_part(screw)

# Three tuners per side.
tuner_y_positions = [nut_y + 13.0, nut_y + 30.0, nut_y + 47.0]

for side in [-1, 1]:
    for tuner_y in tuner_y_positions:
        post_x = side * tuner_post_x
        key_x = side * tuner_key_x

        washer = make_cylinder(tuner_washer_radius, tuner_washer_height, post_x, tuner_y, headstock_top_z + 0.02)
        post = make_cylinder(tuner_post_radius, tuner_post_height, post_x, tuner_y, headstock_top_z + 0.05)
        shaft = make_rect_segment(
            (post_x + side * 1.5, tuner_y),
            (key_x, tuner_y),
            1.1,
            0.5,
            headstock_top_z + 0.78,
        )
        key = make_ellipse_disc(
            tuner_key_x_radius,
            tuner_key_y_radius,
            tuner_key_height,
            key_x,
            tuner_y,
            headstock_top_z + 0.25,
        )

        add_part(washer)
        add_part(post)
        add_part(shaft)
        add_part(key)


# ---------------------------------------------------------------------------
# Pickups, bridge, tailpiece, knobs, switch, and jack
# ---------------------------------------------------------------------------

def add_humbucker(center_y):
    """Add a simplified humbucker with ring, coils, pole pieces, and screws."""
    ring_z = body_top_z + 0.18

    ring = make_rect_frame(
        pickup_outer_width,
        pickup_outer_depth,
        pickup_inner_width,
        pickup_inner_depth,
        pickup_ring_height,
        0.0,
        center_y,
        ring_z,
    )
    add_part(ring)

    base_plate = make_box(
        pickup_inner_width,
        pickup_inner_depth,
        0.45,
        0.0,
        center_y,
        ring_z + 0.35,
    )
    add_part(base_plate)

    coil_depth = pickup_inner_depth * 0.34
    coil_y_offset = pickup_inner_depth * 0.23
    pole_x_positions = [
        -pickup_pole_spacing * 2.5 + i * pickup_pole_spacing
        for i in range(6)
    ]

    for row_sign in [-1, 1]:
        coil_y = center_y + row_sign * coil_y_offset
        coil = make_box(
            pickup_inner_width - 3.5,
            coil_depth,
            0.48,
            0.0,
            coil_y,
            ring_z + 0.82,
        )
        add_part(coil)

        for pole_x in pole_x_positions:
            pole = make_cylinder(0.75, 0.16, pole_x, coil_y, ring_z + 1.08)
            add_part(pole)

    # Four pickup-ring screw heads.
    for sx in [-1, 1]:
        for sy in [-1, 1]:
            screw = make_cylinder(
                0.75,
                0.14,
                sx * (pickup_outer_width / 2.0 - 3.5),
                center_y + sy * (pickup_outer_depth / 2.0 - 3.2),
                ring_z + pickup_ring_height + 0.04,
            )
            add_part(screw)


add_humbucker(neck_pickup_y)
add_humbucker(bridge_pickup_y)

# Bridge and individual saddles.
bridge_z = body_top_z + 1.00
bridge_bar = make_slot(0.0, bridge_y, bridge_length, bridge_depth, 0.0, bridge_z, bridge_height)
add_part(bridge_bar)

bridge_string_x_positions = linear_positions(bridge_string_spacing, string_count)
for index, string_x in enumerate(bridge_string_x_positions):
    saddle = make_box(
        4.3,
        2.9,
        0.72,
        string_x,
        bridge_y + (index - 2.5) * 0.28,
        bridge_z + bridge_height + 0.36,
    )
    add_part(saddle)

for post_x in [-bridge_length / 2.0 + 3.5, bridge_length / 2.0 - 3.5]:
    post = make_cylinder(1.75, 2.2, post_x, bridge_y, body_top_z + 0.30)
    add_part(post)

# Stop tailpiece.
tailpiece_z = body_top_z + 0.55
tailpiece = make_slot(0.0, tailpiece_y, tailpiece_length, tailpiece_depth, 0.0, tailpiece_z, tailpiece_height)
add_part(tailpiece)

for post_x in [-tailpiece_length / 2.0 + 4.0, tailpiece_length / 2.0 - 4.0]:
    post = make_cylinder(1.9, 2.2, post_x, tailpiece_y, body_top_z + 0.25)
    add_part(post)

# Control knobs with small indicator bars.
def add_control_knob(x, y):
    knob_base_z = body_top_z + 0.12
    knob_base_height = 0.55
    knob_cap_height = 1.15

    base = make_cylinder(control_knob_radius, knob_base_height, x, y, knob_base_z)
    cap = make_cylinder(control_knob_radius * 0.78, knob_cap_height, x, y, knob_base_z + knob_base_height)
    indicator = make_rect_segment(
        (x - 2.3, y + 0.9),
        (x + 2.3, y + 0.9),
        0.45,
        0.12,
        knob_base_z + knob_base_height + knob_cap_height + 0.07,
    )

    add_part(base)
    add_part(cap)
    add_part(indicator)


for knob_x, knob_y in control_knob_positions:
    add_control_knob(knob_x, knob_y)

# Toggle switch.
toggle_x, toggle_y = toggle_switch_position
toggle_washer = make_cylinder(4.0, 0.25, toggle_x, toggle_y, body_top_z + 0.12)
toggle_lever_end = (toggle_x + 3.5, toggle_y + 7.0)
toggle_lever = make_rect_segment(
    (toggle_x, toggle_y),
    toggle_lever_end,
    1.0,
    0.45,
    body_top_z + 1.25,
)
toggle_tip = make_cylinder(1.55, 0.75, toggle_lever_end[0], toggle_lever_end[1], body_top_z + 1.38)

add_part(toggle_washer)
add_part(toggle_lever)
add_part(toggle_tip)

# Output jack and tail strap button.
jack_x, jack_y = output_jack_position
jack_washer = make_cylinder(3.6, 0.20, jack_x, jack_y, body_top_z + 0.12)
jack_hole = make_cylinder(1.35, 0.25, jack_x, jack_y, body_top_z + 0.34)
strap_button = make_cylinder(2.0, 0.55, 0.0, body_tail_y + 2.0, body_top_z + 0.18)

add_part(jack_washer)
add_part(jack_hole)
add_part(strap_button)


# ---------------------------------------------------------------------------
# Strings
# ---------------------------------------------------------------------------

nut_string_x_positions = linear_positions(nut_string_spacing, string_count)
string_widths = [0.34, 0.30, 0.27, 0.23, 0.20, 0.18]

# Tailpiece to bridge and bridge to nut.
for index in range(string_count):
    bridge_x = bridge_string_x_positions[index]
    nut_x = nut_string_x_positions[index]
    string_width = string_widths[index]

    tail_to_bridge = make_rect_segment(
        (bridge_x, tailpiece_y),
        (bridge_x, bridge_y),
        string_width,
        string_height,
        string_z_center,
    )
    bridge_to_nut = make_rect_segment(
        (bridge_x, bridge_y),
        (nut_x, nut_y + 1.2),
        string_width,
        string_height,
        string_z_center,
    )

    add_part(tail_to_bridge)
    add_part(bridge_to_nut)

# String fan-out from nut to the 3+3 tuner posts.
left_tuner_targets = [(-tuner_post_x, y) for y in tuner_y_positions]
right_tuner_targets = [(tuner_post_x, y) for y in tuner_y_positions]

for index in range(3):
    string_to_tuner = make_rect_segment(
        (nut_string_x_positions[index], nut_y + 1.2),
        left_tuner_targets[index],
        string_widths[index],
        string_height,
        string_z_center,
    )
    add_part(string_to_tuner)

for index in range(3, 6):
    string_to_tuner = make_rect_segment(
        (nut_string_x_positions[index], nut_y + 1.2),
        right_tuner_targets[index - 3],
        string_widths[index],
        string_height,
        string_z_center,
    )
    add_part(string_to_tuner)


# ---------------------------------------------------------------------------
# Final export object
# ---------------------------------------------------------------------------

result = cq.Compound.makeCompound(model_shapes)