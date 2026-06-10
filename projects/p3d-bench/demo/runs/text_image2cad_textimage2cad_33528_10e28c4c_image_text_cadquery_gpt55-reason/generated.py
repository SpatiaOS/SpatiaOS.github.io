import math
import cadquery as cq

# Parameters
# The assembly is modeled Z-up, then rotated so the top-deck normal aligns with +Y.
base_plate_length = 309.0
base_plate_depth = 245.0
base_plate_thickness = 28.0
base_plate_corner_radius = 5.0
base_plate_top_chamfer = 1.2
base_plate_bottom_chamfer = 0.8
base_corner_notch_size = 30.0

housing_cover_length = 300.0
housing_cover_depth = 230.0
housing_cover_height = 45.0
housing_cover_corner_radius = 6.0
housing_cover_top_chamfer = 3.0
deck_top_z = housing_cover_height

button_length = 18.87
button_width = 12.09
button_height = 5.0
button_top_fillet = 2.0
button_cutout_clearance = 2.2
button_cutout_depth = 1.4
button_cutout_corner_radius = 1.0

jog_cap_radius = 43.0
jog_recess_radius = 47.0
jog_recess_depth = 2.4
jog_skirt_height = 7.0
jog_ring_height = 10.0
jog_plateau_height = 1.0
jog_cap_height = 20.0
jog_lower_radius = 43.0
jog_upper_radius = 38.0
jog_plateau_radius = 30.25
jog_slot_count = 14
jog_slot_radial_depth = 10.0
jog_slot_tangent_width = 3.0
jog_slot_height = 8.0
jog_slot_radius = 41.0
jog_slot_base_z = 3.5
jog_indicator_radius = 4.0
jog_indicator_offset_x = 18.0
jog_indicator_offset_y = 13.0
jog_indicator_center_z = jog_cap_height - jog_indicator_radius

socket_post_base_radius = 7.45
socket_post_base_height = 2.0
socket_post_lower_height = 4.5
socket_post_upper_height = 7.5
socket_post_neck_height = 3.0
socket_post_height = (
    socket_post_base_height
    + socket_post_lower_height
    + socket_post_upper_height
    + socket_post_neck_height
)
socket_post_lower_top_radius = 5.0
socket_post_neck_radius = 3.0
socket_post_rim_radius = 4.0
socket_post_rim_height = 0.8
socket_post_hole_radius = 1.178 / 2.0

control_pin_radius = 0.75
control_pin_length = 11.0

flanged_bushing_flange_radius = 18.2 / 2.0
flanged_bushing_flange_thickness = 2.0
flanged_bushing_boss_radius = 5.03
flanged_bushing_boss_length = 8.0
flanged_bushing_depth = flanged_bushing_flange_thickness + flanged_bushing_boss_length
flanged_bushing_bore_radius = 4.92 / 2.0
flanged_bushing_countersink_radius = 4.2
flanged_bushing_countersink_depth = 1.8

slider_slot_width = 4.0
slider_slot_depth = 1.0
structural_bar_length = 20.0
structural_bar_width = 2.0
structural_bar_height = 1.1

wedge_bottom_width = 8.0
wedge_top_width = 5.0
wedge_depth = 14.0
wedge_height = 18.0
wedge_groove_width = 2.2
wedge_groove_depth = 1.2

locating_pin_head_radius = 7.45
locating_pin_shank_radius = 3.2
locating_pin_shank_height = 8.0
locating_pin_taper_height = 4.0
locating_pin_taper_top_radius = 5.5
locating_pin_total_height = 17.0
locating_pin_cross_hole_radius = 1.178 / 2.0
locating_pin_slot_width = 1.4
locating_pin_slot_height = 5.2

ball_stud_head_radius = 9.1
ball_stud_collar_radius = 6.2
ball_stud_collar_height = 4.0
ball_stud_sphere_center_z = 2.0
ball_stud_bore_radius = 4.92 / 2.0

corner_boss_radius = 4.5
corner_boss_height = 4.0
corner_boss_hole_radius = 1.2

peripheral_tab_length = 22.0
peripheral_tab_depth = 14.0
peripheral_tab_height = 4.0
peripheral_tab_corner_radius = 3.0
peripheral_tab_hole_radius = 2.0

front_panel_length = 155.0
front_panel_depth = 4.0
front_panel_height = 28.0
front_panel_center_x = -60.0
front_panel_base_z = 5.0
front_panel_center_y = -base_plate_depth / 2.0 - front_panel_depth / 2.0 + 0.5
front_panel_outer_face_y = front_panel_center_y - front_panel_depth / 2.0


# Helper functions
def apply_fillet(workplane, selector, radius):
    """Apply an edge fillet while keeping the model build tolerant of small selector differences."""
    if radius <= 0:
        return workplane
    try:
        return workplane.edges(selector).fillet(radius)
    except Exception:
        return workplane


def apply_chamfer(workplane, selector, distance):
    """Apply an edge chamfer while preserving a valid fallback body."""
    if distance <= 0:
        return workplane
    try:
        return workplane.edges(selector).chamfer(distance)
    except Exception:
        return workplane


def make_rect_prism(length, width, height, center_x=0.0, center_y=0.0, base_z=0.0, rotation_degrees=0.0):
    solid = cq.Workplane("XY").rect(length, width).extrude(height)
    if rotation_degrees:
        solid = solid.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return solid.translate((center_x, center_y, base_z))


def make_rounded_rect_prism(
    length,
    width,
    height,
    corner_radius,
    center_x=0.0,
    center_y=0.0,
    base_z=0.0,
    rotation_degrees=0.0,
):
    # Create a rounded-rectangle footprint by filleting the vertical edges after extrusion.
    solid = cq.Workplane("XY").rect(length, width).extrude(height)
    usable_radius = min(corner_radius, length / 2.0 - 0.05, width / 2.0 - 0.05)
    solid = apply_fillet(solid, "|Z", usable_radius)
    if rotation_degrees:
        solid = solid.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return solid.translate((center_x, center_y, base_z))


def make_cylinder(radius, height, center_x=0.0, center_y=0.0, base_z=0.0):
    return cq.Workplane("XY").circle(radius).extrude(height).translate((center_x, center_y, base_z))


def make_frustum(bottom_radius, top_radius, height, center_x=0.0, center_y=0.0, base_z=0.0):
    frustum_solid = cq.Solid.makeCone(
        bottom_radius,
        top_radius,
        height,
        cq.Vector(0.0, 0.0, 0.0),
        cq.Vector(0.0, 0.0, 1.0),
    )
    return cq.Workplane("XY").newObject([frustum_solid]).translate((center_x, center_y, base_z))


def make_centered_x_cylinder(radius, length, center_x=0.0, center_y=0.0, center_z=0.0):
    return (
        cq.Workplane("XY")
        .circle(radius)
        .extrude(length)
        .translate((0, 0, -length / 2.0))
        .rotate((0, 0, 0), (0, 1, 0), 90)
        .translate((center_x, center_y, center_z))
    )


def make_pillow_button(center_x, center_y, base_z, rotation_degrees=0.0):
    button = cq.Workplane("XY").rect(button_length, button_width).extrude(button_height)
    button = apply_fillet(button, ">Z", button_top_fillet)
    if rotation_degrees:
        button = button.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return button.translate((center_x, center_y, base_z))


def make_jog_wheel(center_x, center_y, base_z):
    # Tapered skirt, cylindrical grip ring, and raised central plateau.
    skirt = make_frustum(jog_lower_radius, jog_upper_radius, jog_skirt_height)
    grip_ring = make_cylinder(jog_upper_radius, jog_ring_height, base_z=jog_skirt_height)
    plateau = make_cylinder(jog_plateau_radius, jog_plateau_height, base_z=jog_skirt_height + jog_ring_height)
    cap = skirt.union(grip_ring).union(plateau)

    # Repeating radial side slots around the jog wheel perimeter.
    for slot_index in range(jog_slot_count):
        slot_angle = slot_index * 360.0 / jog_slot_count
        slot_cutter = (
            cq.Workplane("XY")
            .rect(jog_slot_radial_depth, jog_slot_tangent_width)
            .extrude(jog_slot_height)
            .translate((jog_slot_radius, 0.0, jog_slot_base_z))
            .rotate((0, 0, 0), (0, 0, 1), slot_angle)
        )
        cap = cap.cut(slot_cutter)

    indicator_boss = (
        cq.Workplane("XY")
        .sphere(jog_indicator_radius)
        .translate((jog_indicator_offset_x, jog_indicator_offset_y, jog_indicator_center_z))
    )
    cap = cap.union(indicator_boss)

    return cap.translate((center_x, center_y, base_z))


def make_socket_post(center_x, center_y, base_z, rotation_degrees=0.0):
    post = make_cylinder(socket_post_base_radius, socket_post_base_height)
    post = post.union(
        make_frustum(
            socket_post_base_radius * 0.82,
            socket_post_lower_top_radius,
            socket_post_lower_height,
            base_z=socket_post_base_height,
        )
    )
    post = post.union(
        make_frustum(
            socket_post_lower_top_radius,
            socket_post_neck_radius,
            socket_post_upper_height,
            base_z=socket_post_base_height + socket_post_lower_height,
        )
    )
    post = post.union(
        make_cylinder(
            socket_post_neck_radius,
            socket_post_neck_height,
            base_z=socket_post_base_height + socket_post_lower_height + socket_post_upper_height,
        )
    )
    post = post.union(
        make_cylinder(
            socket_post_rim_radius,
            socket_post_rim_height,
            base_z=socket_post_height - socket_post_rim_height,
        )
    )

    lug = make_rect_prism(3.0, 1.8, 2.4, center_x=4.1, base_z=14.2)
    post = post.union(lug)

    through_hole = make_cylinder(socket_post_hole_radius, socket_post_height + 2.0, base_z=-1.0)
    post = post.cut(through_hole)

    if rotation_degrees:
        post = post.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return post.translate((center_x, center_y, base_z))


def make_flanged_bushing(center_x, face_y, center_z):
    flange = make_cylinder(flanged_bushing_flange_radius, flanged_bushing_flange_thickness)
    boss = make_cylinder(
        flanged_bushing_boss_radius,
        flanged_bushing_boss_length,
        base_z=flanged_bushing_flange_thickness,
    )
    bushing = flange.union(boss)

    bore = make_cylinder(flanged_bushing_bore_radius, flanged_bushing_depth + 1.0, base_z=-0.5)
    bushing = bushing.cut(bore)

    countersink = make_frustum(
        flanged_bushing_bore_radius,
        flanged_bushing_countersink_radius,
        flanged_bushing_countersink_depth,
        base_z=flanged_bushing_depth - flanged_bushing_countersink_depth,
    )
    bushing = bushing.cut(countersink)

    return bushing.rotate((0, 0, 0), (1, 0, 0), 90).translate((center_x, face_y, center_z))


def make_wedge_guide_block(center_x, center_y, base_z, rotation_degrees=0.0):
    # Tapered trapezoidal block with a shallow V-bottom top groove.
    wedge = (
        cq.Workplane("XY")
        .rect(wedge_bottom_width, wedge_depth)
        .workplane(offset=wedge_height)
        .rect(wedge_top_width, wedge_depth)
        .loft(combine=False)
    )

    groove_top_width = wedge_groove_width + 2.0 * wedge_groove_depth
    groove_profile = [
        (-groove_top_width / 2.0, wedge_height + 0.1),
        (groove_top_width / 2.0, wedge_height + 0.1),
        (wedge_groove_width / 2.0, wedge_height - wedge_groove_depth),
        (-wedge_groove_width / 2.0, wedge_height - wedge_groove_depth),
    ]
    groove_cutter = (
        cq.Workplane("XZ")
        .polyline(groove_profile)
        .close()
        .extrude(wedge_depth + 2.0, both=True)
    )
    wedge = wedge.cut(groove_cutter)

    if rotation_degrees:
        wedge = wedge.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return wedge.translate((center_x, center_y, base_z))


def make_locating_pin(center_x, center_y, base_z, rotation_degrees=0.0):
    locating_pin = make_cylinder(locating_pin_shank_radius, locating_pin_shank_height)
    locating_pin = locating_pin.union(
        make_frustum(
            locating_pin_shank_radius,
            locating_pin_taper_top_radius,
            locating_pin_taper_height,
            base_z=locating_pin_shank_height,
        )
    )

    dome_center_z = locating_pin_total_height - locating_pin_head_radius
    dome = cq.Workplane("XY").sphere(locating_pin_head_radius).translate((0, 0, dome_center_z))
    locating_pin = locating_pin.union(dome)

    cross_hole = make_centered_x_cylinder(
        locating_pin_cross_hole_radius,
        locating_pin_head_radius * 2.5,
        center_z=5.0,
    )
    locating_pin = locating_pin.cut(cross_hole)

    tip_slot = make_rect_prism(
        locating_pin_slot_width,
        locating_pin_shank_radius * 2.8,
        locating_pin_slot_height,
        base_z=0.4,
    )
    locating_pin = locating_pin.cut(tip_slot)

    if rotation_degrees:
        locating_pin = locating_pin.rotate((0, 0, 0), (0, 0, 1), rotation_degrees)
    return locating_pin.translate((center_x, center_y, base_z))


def make_ball_stud(center_x, center_y, base_z):
    collar = make_cylinder(ball_stud_collar_radius, ball_stud_collar_height)
    dome = cq.Workplane("XY").sphere(ball_stud_head_radius).translate((0, 0, ball_stud_sphere_center_z))
    stud = collar.union(dome)

    bore = make_cylinder(
        ball_stud_bore_radius,
        ball_stud_head_radius + ball_stud_collar_height + 4.0,
        base_z=-3.0,
    )
    stud = stud.cut(bore)

    return stud.translate((center_x, center_y, base_z))


def make_corner_boss(center_x, center_y):
    boss = make_cylinder(corner_boss_radius, corner_boss_height)
    blind_hole = make_cylinder(corner_boss_hole_radius, corner_boss_height + 1.0, base_z=1.0)
    boss = boss.cut(blind_hole)
    return boss.translate((center_x, center_y, deck_top_z - 0.2))


# Base plate with rounded corners, chamfered edges, blind side holes, and shallow top grooves.
base_plate = make_rounded_rect_prism(
    base_plate_length,
    base_plate_depth,
    base_plate_thickness,
    base_plate_corner_radius,
)
base_plate = apply_chamfer(base_plate, ">Z", base_plate_top_chamfer)
base_plate = apply_chamfer(base_plate, "<Z", base_plate_bottom_chamfer)

front_left_notch = (
    cq.Workplane("XY")
    .polyline(
        [
            (-base_plate_length / 2.0 - 1.0, -base_plate_depth / 2.0 - 1.0),
            (-base_plate_length / 2.0 + base_corner_notch_size, -base_plate_depth / 2.0 - 1.0),
            (-base_plate_length / 2.0 - 1.0, -base_plate_depth / 2.0 + base_corner_notch_size),
        ]
    )
    .close()
    .extrude(base_plate_thickness + 2.0)
    .translate((0, 0, -1.0))
)
base_plate = base_plate.cut(front_left_notch)

base_left_blind_hole = (
    cq.Workplane("XY")
    .circle(6.924 / 2.0)
    .extrude(10.0)
    .rotate((0, 0, 0), (0, 1, 0), 90)
    .translate((-base_plate_length / 2.0 - 0.1, 76.0, base_plate_thickness * 0.55))
)
base_right_blind_hole = (
    cq.Workplane("XY")
    .circle(8.91 / 2.0)
    .extrude(10.0)
    .rotate((0, 0, 0), (0, 1, 0), -90)
    .translate((base_plate_length / 2.0 + 0.1, -76.0, base_plate_thickness * 0.55))
)
base_plate = base_plate.cut(base_left_blind_hole).cut(base_right_blind_hole)

for groove_x, groove_y, groove_angle, groove_length in [
    (-58.0, base_plate_depth / 2.0 - 4.0, 0.0, 86.0),
    (70.0, -base_plate_depth / 2.0 + 4.0, 0.0, 96.0),
]:
    base_groove = make_rounded_rect_prism(
        groove_length,
        2.4,
        1.4,
        1.0,
        groove_x,
        groove_y,
        base_plate_thickness - 1.0,
        groove_angle,
    )
    base_plate = base_plate.cut(base_groove)


# Main housing cover with perimeter chamfer, side blind holes, jog recesses, button pockets, and slider slots.
housing_cover = make_rounded_rect_prism(
    housing_cover_length,
    housing_cover_depth,
    housing_cover_height,
    housing_cover_corner_radius,
)
housing_cover = apply_chamfer(housing_cover, ">Z", housing_cover_top_chamfer)

left_blind_hole = (
    cq.Workplane("XY")
    .circle(6.924 / 2.0)
    .extrude(12.0)
    .rotate((0, 0, 0), (0, 1, 0), 90)
    .translate((-housing_cover_length / 2.0 - 0.1, 86.0, 24.0))
)
right_blind_hole = (
    cq.Workplane("XY")
    .circle(8.91 / 2.0)
    .extrude(12.0)
    .rotate((0, 0, 0), (0, 1, 0), -90)
    .translate((housing_cover_length / 2.0 + 0.1, -86.0, 24.0))
)
housing_cover = housing_cover.cut(left_blind_hole).cut(right_blind_hole)

jog_wheel_locations = [(-82.0, -18.0), (82.0, -18.0)]
for jog_x, jog_y in jog_wheel_locations:
    jog_recess = make_cylinder(
        jog_recess_radius,
        jog_recess_depth + 0.5,
        jog_x,
        jog_y,
        deck_top_z - jog_recess_depth,
    )
    housing_cover = housing_cover.cut(jog_recess)

button_locations = [
    (-128.0, -58.0, 0.0),
    (-106.0, -78.0, 0.0),
    (-128.0, 42.0, 0.0),
    (-108.0, 24.0, 0.0),
    (108.0, -78.0, 0.0),
    (130.0, -58.0, 0.0),
    (108.0, 10.0, 0.0),
    (130.0, -8.0, 0.0),
    (-35.0, 88.0, 0.0),
    (0.0, 88.0, 0.0),
    (35.0, 88.0, 0.0),
    (-35.0, 68.0, 0.0),
    (0.0, 68.0, 0.0),
    (35.0, 68.0, 0.0),
    (-35.0, 48.0, 0.0),
    (0.0, 48.0, 0.0),
    (35.0, 48.0, 0.0),
    (-35.0, 28.0, 0.0),
    (0.0, 28.0, 0.0),
    (35.0, 28.0, 0.0),
    (76.0, 88.0, 0.0),
    (103.0, 88.0, 0.0),
    (130.0, 88.0, 0.0),
    (76.0, 68.0, 0.0),
    (103.0, 68.0, 0.0),
    (130.0, 68.0, 0.0),
]

for button_x, button_y, button_angle in button_locations:
    button_cutout = make_rounded_rect_prism(
        button_length + button_cutout_clearance,
        button_width + button_cutout_clearance,
        button_cutout_depth + 0.3,
        button_cutout_corner_radius,
        button_x,
        button_y,
        deck_top_z - button_cutout_depth,
        button_angle,
    )
    housing_cover = housing_cover.cut(button_cutout)

slider_guides = [
    (0.0, -70.0, 0.0, 58.0, 9.0),
    (-29.0, -13.0, 68.0, 46.0, 5.0),
    (29.0, -13.0, -68.0, 46.0, 5.0),
]

for slot_x, slot_y, slot_angle, slot_length, _ in slider_guides:
    slider_slot = make_rounded_rect_prism(
        slot_length,
        slider_slot_width,
        slider_slot_depth + 0.3,
        slider_slot_width * 0.45,
        slot_x,
        slot_y,
        deck_top_z - slider_slot_depth,
        slot_angle,
    )
    housing_cover = housing_cover.cut(slider_slot)


# Front connector panel and peripheral tab.
front_connector_panel = make_rounded_rect_prism(
    front_panel_length,
    front_panel_depth,
    front_panel_height,
    1.0,
    front_panel_center_x,
    front_panel_center_y,
    front_panel_base_z,
)

tab_center_x = -128.0
tab_center_y = housing_cover_depth / 2.0 + peripheral_tab_depth / 2.0 - 2.0
peripheral_tab = make_rounded_rect_prism(
    peripheral_tab_length,
    peripheral_tab_depth,
    peripheral_tab_height,
    peripheral_tab_corner_radius,
    tab_center_x,
    tab_center_y,
    deck_top_z - 1.0,
)
peripheral_tab = peripheral_tab.cut(
    make_cylinder(
        peripheral_tab_hole_radius,
        peripheral_tab_height + 2.0,
        tab_center_x,
        tab_center_y,
        deck_top_z - 2.0,
    )
)


# Assemble the grounded plates and cover.
model = base_plate.union(housing_cover).union(front_connector_panel).union(peripheral_tab)

# Seated tactile spacer blocks.
button_base_z = deck_top_z - button_cutout_depth - 0.15
for button_x, button_y, button_angle in button_locations:
    model = model.union(make_pillow_button(button_x, button_y, button_base_z, button_angle))

# Two jog-wheel caps.
jog_cap_base_z = deck_top_z - jog_recess_depth - 0.05
for jog_x, jog_y in jog_wheel_locations:
    model = model.union(make_jog_wheel(jog_x, jog_y, jog_cap_base_z))

# Bell-shaped socket posts and matching protruding control pins.
socket_post_locations = [
    (-94.0, 100.0, 0.0),
    (-58.0, 105.0, 20.0),
    (12.0, 105.0, -15.0),
    (64.0, 105.0, 10.0),
    (128.0, 105.0, -25.0),
    (92.0, 42.0, 35.0),
    (52.0, 16.0, -20.0),
    (-22.0, 10.0, 50.0),
]
socket_post_base_z = deck_top_z - 0.2
for post_x, post_y, post_angle in socket_post_locations:
    model = model.union(make_socket_post(post_x, post_y, socket_post_base_z, post_angle))
    model = model.union(make_cylinder(control_pin_radius, control_pin_length, post_x, post_y, deck_top_z + 8.8))

# Additional slender control pins to reach the described 11 pin instances.
for pin_x, pin_y in [(-66.0, 78.0), (18.0, 78.0), (118.0, 45.0)]:
    model = model.union(make_cylinder(control_pin_radius, control_pin_length, pin_x, pin_y, deck_top_z - 0.2))

# Front-panel jack bushings.
bushing_face_y = front_panel_outer_face_y + 0.2
for bushing_x in [-120.0, -96.0, -72.0, -48.0, -24.0, 0.0]:
    model = model.union(make_flanged_bushing(bushing_x, bushing_face_y, 19.0))

# Mixer/crossfader region: three shallow bars with three raised wedge guide blocks.
for slot_x, slot_y, slot_angle, _, knob_offset in slider_guides:
    angle_rad = math.radians(slot_angle)
    knob_x = slot_x + knob_offset * math.cos(angle_rad)
    knob_y = slot_y + knob_offset * math.sin(angle_rad)

    model = model.union(
        make_rect_prism(
            structural_bar_length,
            structural_bar_width,
            structural_bar_height,
            slot_x,
            slot_y,
            deck_top_z - 0.15,
            slot_angle,
        )
    )
    model = model.union(
        make_wedge_guide_block(
            knob_x,
            knob_y,
            deck_top_z - 0.1,
            slot_angle - 90.0,
        )
    )

# Locating pins with domed heads, axial slots, and transverse cross-holes.
for locating_x, locating_y, locating_angle in [
    (-135.0, 72.0, 0.0),
    (0.0, -100.0, 120.0),
    (135.0, 20.0, 240.0),
]:
    model = model.union(make_locating_pin(locating_x, locating_y, deck_top_z - 0.2, locating_angle))

# Ball studs and corner bosses.
for ball_x, ball_y in [(-115.0, -100.0), (115.0, -100.0)]:
    model = model.union(make_ball_stud(ball_x, ball_y, deck_top_z - 0.2))

for boss_x, boss_y in [
    (-142.0, 105.0),
    (142.0, 105.0),
    (-142.0, -105.0),
    (142.0, -105.0),
]:
    model = model.union(make_corner_boss(boss_x, boss_y))

# Final orientation: panel normal aligned with +Y.
result = model.rotate((0, 0, 0), (1, 0, 0), -90)