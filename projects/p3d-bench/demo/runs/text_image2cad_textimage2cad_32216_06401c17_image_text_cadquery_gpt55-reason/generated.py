import math
import cadquery as cq

# Parameters
# Central end fitting
lower_body_radius = 13.5
lower_body_height = 8.0
upper_body_radius = 9.39
transition_height = 10.0
upper_body_height = 12.0
top_flange_radius = 13.5
top_flange_height = 2.0

eye_lug_width = 10.2
eye_lug_thickness = 5.0
eye_lug_straight_height = 10.0
eye_lug_bore_diameter = 5.0

# Mounting lugs
lug_plate_thickness = 1.47
lower_lug_length = 10.2
lower_lug_height = 7.2
lower_lug_hole_diameter = 2.8
lower_lug_pair_offset = 3.3
lower_lug_z_center = 7.0

upper_lug_length = 8.2
upper_lug_height = 5.7
upper_lug_hole_diameter = 2.48
upper_lug_z_center = 27.0

small_lug_length = 5.9
small_lug_height = 5.7
small_lug_hole_diameter = 1.28
small_lug_z_center = 31.0

# Jaw and support geometry
jaw_angles_deg = [45.0, 135.0, 225.0, 315.0]
jaw_pivot_x = lower_body_radius + lower_lug_length - lower_lug_height / 2.0 - 0.3
jaw_pivot_z = lower_lug_z_center
jaw_length_z = 69.0
jaw_thickness = 4.8
jaw_top_eye_radius = 4.9
jaw_mid_eye_radius = 4.2
jaw_pin_hole_diameter = 3.6
jaw_mid_parameter = 0.32

support_arm_thickness = 1.4
support_arm_width = 2.4
support_arm_side_offset = 5.8

# Cylindrical barrels
barrel_outer_radius = 3.38
barrel_inner_radius = barrel_outer_radius - 0.7
barrel_boss_radius = 1.2
barrel_boss_length = 8.6
barrel_retaining_hole_diameter = 0.864

# Follower rods
rod_radius = 0.54
rod_head_radius = 2.53
rod_head_thickness = 0.85
rod_boss_radius = 1.55
rod_boss_length = 5.0
rod_boss_hole_diameter = 1.2

# Pins
stepped_pin_sections = [(7.2, 1.35), (0.4, 1.55), (0.8, 1.8)]
flanged_pin_sections = [(0.41, 1.8), (7.58, 0.6), (0.41, 0.95)]
spool_pin_sections = [(0.60, 1.8), (4.28, 0.6), (0.58, 0.95)]
plain_pin_radius = 0.5382
plain_pin_length = 1.084


# Helper functions
def point_add(point, direction, distance):
    return (
        point[0] + direction[0] * distance,
        point[1] + direction[1] * distance,
        point[2] + direction[2] * distance,
    )


def normalize(vector):
    length = math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
    return (vector[0] / length, vector[1] / length, vector[2] / length)


def make_cylinder_between(start_point, end_point, radius):
    start_vec = cq.Vector(*start_point)
    end_vec = cq.Vector(*end_point)
    direction_vec = end_vec - start_vec
    return cq.Workplane("XY").add(
        cq.Solid.makeCylinder(radius, direction_vec.Length, start_vec, direction_vec)
    )


def make_sphere(center_point, radius):
    return cq.Workplane("XY").add(cq.Solid.makeSphere(radius, cq.Vector(*center_point)))


def rotate_about_z(model, angle_deg):
    return model.rotate((0, 0, 0), (0, 0, 1), angle_deg)


def make_pin(center_point, axis_direction, section_list):
    axis = normalize(axis_direction)
    total_length = sum(section_length for section_length, _ in section_list)
    cursor = point_add(center_point, axis, -total_length / 2.0)

    pin = None
    for section_length, section_radius in section_list:
        section_end = point_add(cursor, axis, section_length)
        section = make_cylinder_between(cursor, section_end, section_radius)
        pin = section if pin is None else pin.union(section)
        cursor = section_end

    return pin


def make_radial_lug(
    attach_radius,
    radial_length,
    plate_height,
    plate_thickness,
    z_center,
    hole_diameter,
    y_offset=0.0,
):
    nose_radius = plate_height / 2.0
    nose_center_x = attach_radius + radial_length - nose_radius
    z_bottom = z_center - plate_height / 2.0
    z_top = z_center + plate_height / 2.0

    lug = (
        cq.Workplane("XZ")
        .moveTo(attach_radius, z_bottom)
        .lineTo(nose_center_x, z_bottom)
        .threePointArc((nose_center_x + nose_radius, z_center), (nose_center_x, z_top))
        .lineTo(attach_radius, z_top)
        .close()
        .extrude(plate_thickness / 2.0, both=True)
        .translate((0, y_offset, 0))
    )

    lug_hole = (
        cq.Workplane("XZ")
        .center(nose_center_x, z_center)
        .circle(hole_diameter / 2.0)
        .extrude((plate_thickness + 2.0) / 2.0, both=True)
        .translate((0, y_offset, 0))
    )

    return lug.cut(lug_hole)


def jaw_centerline(t):
    x = jaw_pivot_x + 6.0 * t + 19.0 * (t ** 1.65) - 3.0 * (t ** 3.0)
    z = jaw_pivot_z - jaw_length_z * t + 2.0 * math.sin(math.pi * t)
    return x, z


def jaw_width(t, variant_scale=1.0):
    return (7.8 * (1.0 - t) + 2.0 * t) * variant_scale


def make_curved_strip_2d(centerline_func, width_func, start_t, end_t, samples, extrusion_thickness):
    center_points = []
    for i in range(samples):
        t = start_t + (end_t - start_t) * i / (samples - 1)
        center_points.append((t, *centerline_func(t)))

    side_a = []
    side_b = []

    for i, (t, x, z) in enumerate(center_points):
        if i == 0:
            _, x_next, z_next = center_points[i + 1]
            dx = x_next - x
            dz = z_next - z
        elif i == len(center_points) - 1:
            _, x_prev, z_prev = center_points[i - 1]
            dx = x - x_prev
            dz = z - z_prev
        else:
            _, x_prev, z_prev = center_points[i - 1]
            _, x_next, z_next = center_points[i + 1]
            dx = x_next - x_prev
            dz = z_next - z_prev

        normal_length = math.sqrt(dx * dx + dz * dz)
        nx = -dz / normal_length
        nz = dx / normal_length
        half_width = width_func(t) / 2.0

        side_a.append((x + nx * half_width, z + nz * half_width))
        side_b.append((x - nx * half_width, z - nz * half_width))

    outline_points = side_a + list(reversed(side_b))

    return (
        cq.Workplane("XZ")
        .polyline(outline_points)
        .close()
        .extrude(extrusion_thickness / 2.0, both=True)
    )


def make_jaw(variant_scale=1.0, rib_side=1.0):
    jaw_body = make_curved_strip_2d(
        jaw_centerline,
        lambda t: jaw_width(t, variant_scale),
        0.0,
        1.0,
        38,
        jaw_thickness,
    )

    top_eye = (
        cq.Workplane("XZ")
        .center(jaw_pivot_x, jaw_pivot_z)
        .circle(jaw_top_eye_radius * variant_scale)
        .extrude(jaw_thickness / 2.0, both=True)
    )

    mid_x, mid_z = jaw_centerline(jaw_mid_parameter)
    mid_eye = (
        cq.Workplane("XZ")
        .center(mid_x, mid_z)
        .circle(jaw_mid_eye_radius * variant_scale)
        .extrude((jaw_thickness + 1.0) / 2.0, both=True)
    )

    jaw = jaw_body.union(top_eye).union(mid_eye)

    top_hole = (
        cq.Workplane("XZ")
        .center(jaw_pivot_x, jaw_pivot_z)
        .circle(jaw_pin_hole_diameter / 2.0)
        .extrude((jaw_thickness + 3.0) / 2.0, both=True)
    )

    mid_hole = (
        cq.Workplane("XZ")
        .center(mid_x, mid_z)
        .circle(jaw_pin_hole_diameter / 2.0)
        .extrude((jaw_thickness + 3.0) / 2.0, both=True)
    )

    jaw = jaw.cut(top_hole).cut(mid_hole)

    def rib_centerline(offset_amount):
        def _centerline(t):
            x, z = jaw_centerline(t)
            dt = 0.001
            x_next, z_next = jaw_centerline(min(1.0, t + dt))
            x_prev, z_prev = jaw_centerline(max(0.0, t - dt))
            dx = x_next - x_prev
            dz = z_next - z_prev
            normal_length = math.sqrt(dx * dx + dz * dz)
            nx = -dz / normal_length
            nz = dx / normal_length
            return x + nx * offset_amount, z + nz * offset_amount

        return _centerline

    for rib_offset in (-1.9, 1.9):
        rib = make_curved_strip_2d(
            rib_centerline(rib_offset * variant_scale),
            lambda t: 0.75,
            0.12,
            0.92,
            26,
            0.55,
        ).translate((0, rib_side * (jaw_thickness / 2.0 + 0.275), 0))
        jaw = jaw.union(rib)

    return jaw


def make_support_arm(has_pin_tip=False, side_offset=0.0):
    def support_centerline(t):
        x, z = jaw_centerline(t)
        return x - 3.2 + 1.4 * math.sin(math.pi * t), z - 2.0

    support = make_curved_strip_2d(
        support_centerline,
        lambda t: support_arm_width * (1.0 - 0.25 * t),
        0.05,
        1.0,
        34,
        support_arm_thickness,
    ).translate((0, side_offset, 0))

    if has_pin_tip:
        pin_x, pin_z = support_centerline(0.08)
        pin_start = (pin_x, side_offset - 5.5, pin_z)
        pin_end = (pin_x, side_offset + 5.5, pin_z)
        protruding_pin = make_cylinder_between(pin_start, pin_end, 1.0)
        dome = make_sphere(pin_end, 1.0)
        support = support.union(protruding_pin).union(dome)
    else:
        tab_x, tab_z = support_centerline(0.18)
        locating_tab = (
            cq.Workplane("XZ")
            .center(tab_x + 1.2, tab_z)
            .rect(3.0, 4.0)
            .extrude(support_arm_thickness / 2.0, both=True)
            .translate((0, side_offset, 0))
        )
        support = support.union(locating_tab)

    return support


def make_barrel():
    start_point = (14.2, 0.0, upper_lug_z_center)
    end_point = (27.0, 0.0, 5.0)
    axis = normalize(
        (
            end_point[0] - start_point[0],
            end_point[1] - start_point[1],
            end_point[2] - start_point[2],
        )
    )

    barrel = make_cylinder_between(start_point, end_point, barrel_outer_radius)
    barrel = barrel.union(make_sphere(end_point, barrel_outer_radius))

    inner_start = point_add(start_point, axis, -0.5)
    inner_end = point_add(end_point, axis, -barrel_outer_radius * 0.7)
    bore = make_cylinder_between(inner_start, inner_end, barrel_inner_radius)
    barrel = barrel.cut(bore)

    for t in (0.22, 0.78):
        boss_center = (
            start_point[0] + (end_point[0] - start_point[0]) * t,
            0.0,
            start_point[2] + (end_point[2] - start_point[2]) * t,
        )
        boss = make_cylinder_between(
            (boss_center[0], -barrel_boss_length / 2.0, boss_center[2]),
            (boss_center[0], barrel_boss_length / 2.0, boss_center[2]),
            barrel_boss_radius,
        )
        boss_hole = make_cylinder_between(
            (boss_center[0], -barrel_boss_length / 2.0 - 0.8, boss_center[2]),
            (boss_center[0], barrel_boss_length / 2.0 + 0.8, boss_center[2]),
            barrel_retaining_hole_diameter / 2.0,
        )
        barrel = barrel.union(boss).cut(boss_hole)

    return barrel


def make_follower_rod():
    mid_x, mid_z = jaw_centerline(jaw_mid_parameter)
    start_point = (15.2, 5.1, 8.5)
    end_point = (mid_x, 5.1, mid_z)
    axis = normalize(
        (
            end_point[0] - start_point[0],
            end_point[1] - start_point[1],
            end_point[2] - start_point[2],
        )
    )

    stem_start = point_add(start_point, axis, rod_head_thickness * 0.25)
    stem = make_cylinder_between(stem_start, end_point, rod_radius)

    head = make_cylinder_between(
        point_add(start_point, axis, -rod_head_thickness / 2.0),
        point_add(start_point, axis, rod_head_thickness / 2.0),
        rod_head_radius,
    )

    boss = make_cylinder_between(
        (end_point[0], end_point[1] - rod_boss_length / 2.0, end_point[2]),
        (end_point[0], end_point[1] + rod_boss_length / 2.0, end_point[2]),
        rod_boss_radius,
    )

    boss_hole = make_cylinder_between(
        (end_point[0], end_point[1] - rod_boss_length / 2.0 - 0.6, end_point[2]),
        (end_point[0], end_point[1] + rod_boss_length / 2.0 + 0.6, end_point[2]),
        rod_boss_hole_diameter / 2.0,
    )

    return stem.union(head).union(boss).cut(boss_hole)


# Create the central bell-shaped end fitting
lower_body = cq.Workplane("XY").circle(lower_body_radius).extrude(lower_body_height)

transition_body = (
    cq.Workplane("XY")
    .workplane(offset=lower_body_height)
    .circle(lower_body_radius)
    .workplane(offset=transition_height)
    .circle(upper_body_radius)
    .loft(combine=True)
)

upper_body_z = lower_body_height + transition_height
upper_body = (
    cq.Workplane("XY")
    .workplane(offset=upper_body_z)
    .circle(upper_body_radius)
    .extrude(upper_body_height)
)

flange_z = upper_body_z + upper_body_height
top_flange = (
    cq.Workplane("XY")
    .workplane(offset=flange_z)
    .circle(top_flange_radius)
    .extrude(top_flange_height)
)

eye_base_z = flange_z + top_flange_height
eye_radius = eye_lug_width / 2.0
eye_arc_center_z = eye_base_z + eye_lug_straight_height
eye_bore_z = eye_arc_center_z + eye_radius * 0.15

eye_lug = (
    cq.Workplane("XZ")
    .moveTo(-eye_radius, eye_base_z)
    .lineTo(-eye_radius, eye_arc_center_z)
    .threePointArc((0.0, eye_arc_center_z + eye_radius), (eye_radius, eye_arc_center_z))
    .lineTo(eye_radius, eye_base_z)
    .close()
    .extrude(eye_lug_thickness / 2.0, both=True)
)

eye_bore = (
    cq.Workplane("XZ")
    .center(0.0, eye_bore_z)
    .circle(eye_lug_bore_diameter / 2.0)
    .extrude((eye_lug_thickness + 3.0) / 2.0, both=True)
)

central_body = (
    lower_body.union(transition_body)
    .union(upper_body)
    .union(top_flange)
    .union(eye_lug)
    .cut(eye_bore)
)

model_components = [central_body]

# Add the radial mounting lugs around the hub
for angle in jaw_angles_deg:
    for tangential_offset in (-lower_lug_pair_offset, lower_lug_pair_offset):
        lower_lug = make_radial_lug(
            lower_body_radius - 0.3,
            lower_lug_length,
            lower_lug_height,
            lug_plate_thickness,
            lower_lug_z_center,
            lower_lug_hole_diameter,
            tangential_offset,
        )
        model_components.append(rotate_about_z(lower_lug, angle))

    upper_lug = make_radial_lug(
        upper_body_radius - 0.2,
        upper_lug_length,
        upper_lug_height,
        lug_plate_thickness,
        upper_lug_z_center,
        upper_lug_hole_diameter,
        0.0,
    )
    model_components.append(rotate_about_z(upper_lug, angle))

    small_lug = make_radial_lug(
        upper_body_radius - 0.2,
        small_lug_length,
        small_lug_height,
        lug_plate_thickness,
        small_lug_z_center,
        small_lug_hole_diameter,
        0.0,
    )
    model_components.append(rotate_about_z(small_lug, angle + 18.0))

# Add jaws, curved support arms, barrels, rods, and pins with four-fold symmetry
for index, angle in enumerate(jaw_angles_deg):
    is_tine_variant = index % 2 == 0
    rib_side = 1.0 if is_tine_variant else -1.0
    jaw_scale = 0.94 if is_tine_variant else 1.0

    jaw = make_jaw(variant_scale=jaw_scale, rib_side=rib_side)
    support_arm = make_support_arm(
        has_pin_tip=not is_tine_variant,
        side_offset=support_arm_side_offset * rib_side,
    )
    barrel = make_barrel()
    follower_rod = make_follower_rod()

    model_components.append(rotate_about_z(jaw, angle))
    model_components.append(rotate_about_z(support_arm, angle))
    model_components.append(rotate_about_z(barrel, angle))
    model_components.append(rotate_about_z(follower_rod, angle))

    mid_x, mid_z = jaw_centerline(jaw_mid_parameter)

    top_stepped_pin = make_pin(
        (jaw_pivot_x, 0.0, jaw_pivot_z),
        (0.0, 1.0, 0.0),
        stepped_pin_sections,
    )

    mid_flanged_pin = make_pin(
        (mid_x, 0.0, mid_z),
        (0.0, 1.0, 0.0),
        flanged_pin_sections,
    )

    follower_spool_pin = make_pin(
        (mid_x, 5.1, mid_z),
        (0.0, 1.0, 0.0),
        spool_pin_sections,
    )

    plain_pin = make_cylinder_between(
        (21.7, -plain_pin_length / 2.0, 14.5),
        (21.7, plain_pin_length / 2.0, 14.5),
        plain_pin_radius,
    )

    model_components.append(rotate_about_z(top_stepped_pin, angle))
    model_components.append(rotate_about_z(mid_flanged_pin, angle))
    model_components.append(rotate_about_z(follower_spool_pin, angle))
    model_components.append(rotate_about_z(plain_pin, angle))

# Combine all modeled solids into one unified CadQuery result
result = cq.Workplane("XY").add(
    cq.Compound.makeCompound([component.val() for component in model_components])
)