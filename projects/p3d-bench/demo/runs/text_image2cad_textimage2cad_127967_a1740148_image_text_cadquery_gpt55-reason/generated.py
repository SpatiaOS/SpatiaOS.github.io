import cadquery as cq
import math

# Parameters (millimeters)
# Base / housing cap
base_body_radius = 150.0
base_bottom_radius = 162.0
base_inner_ledge_radius = 130.0
base_center_boss_radius = 15.0
base_bottom_height = 18.0
base_main_height = 55.0
base_outer_ledge_height = 10.0
base_inner_ledge_height = 12.0
base_center_boss_height = 20.0

base_lug_count = 12
base_lug_inner_radius = 132.0
base_lug_outer_radius = 195.0
base_lug_width = 34.0
base_lug_height = 52.0
base_lug_foot_height = 8.0
base_lug_hole_radius = 3.5
base_lug_counterbore_radius = 8.0

# Turntable / lever base
turntable_lower_z = 94.0
turntable_lower_radius = 125.0
turntable_lower_height = 18.0
turntable_mid_radius = 90.0
turntable_mid_height = 26.0
turntable_upper_radius = 68.5
turntable_upper_height = 28.0
turntable_tooth_count = 24
turntable_tooth_radial_length = 14.0
turntable_tooth_tangential_width = 8.0
turntable_tooth_height = 14.0

# Bearing spacer rings
spacer_count = 12
spacer_pitch_radius = 137.0
spacer_outer_radius = 3.0
spacer_inner_radius = 1.6
spacer_axial_length = 3.0
spacer_bottom_z = 82.5

# Primary joint layout
shoulder_x = 105.0
shoulder_z = 205.0
elbow_x = -45.0
elbow_z = 575.0
forearm_axis_z = 585.0

shoulder_hub_radius = 55.0
shoulder_hub_width = 92.0
shoulder_cap_radius = 44.0
shoulder_cap_width = 10.0
shoulder_bore_radius = 23.5

elbow_hub_radius = 54.0
elbow_hub_width = 104.0
elbow_cap_radius = 44.0
elbow_cap_width = 8.0
elbow_bore_radius = 22.0

upper_arm_width_y = 58.0
upper_arm_thickness_z = 44.0
lower_lever_width_y = 86.0
lower_lever_thickness_z = 46.0

# Elbow block / right-angle housing
joint_block_length_x = 118.0
joint_block_width_y = 100.0
joint_block_height_z = 96.0
joint_block_center_x = elbow_x - 32.0
joint_block_center_z = elbow_z + 48.0

# Forearm and multi-bore housing
shaft_start_x = 32.0
shaft_end_x = 225.0
shaft_width_y = 52.0
shaft_height_z = 52.0

multi_center_x = 305.0
multi_length_x = 173.0
multi_width_y = 80.0
multi_core_height_z = 46.0
multi_lobe_spacing = 116.0
multi_lobe_radius = 42.0
multi_front_plate_thickness = 8.0

# Wrist, plug, and gripper
wrist_start_x = 415.0
scroll_front_x = 490.0
adapter_block_center_x = 515.0
jaw_pivot_x = 540.0
jaw_pivot_z_offset = 24.0

jaw_thickness_y = 20.0
jaw_pivot_boss_radius = 15.0
jaw_slot_radius = 4.5


# Helper functions
def make_cylinder(start_point, end_point, radius, angle_degrees=360.0):
    """Create a cylinder between two 3D points."""
    sx, sy, sz = start_point
    ex, ey, ez = end_point
    dx, dy, dz = ex - sx, ey - sy, ez - sz
    height = math.sqrt(dx * dx + dy * dy + dz * dz)
    direction = cq.Vector(dx, dy, dz)
    solid = cq.Solid.makeCylinder(
        radius,
        height,
        cq.Vector(sx, sy, sz),
        direction,
        angleDegrees=angle_degrees,
    )
    return cq.Workplane("XY").add(solid)


def make_ring(start_point, end_point, outer_radius, inner_radius):
    """Create a hollow cylindrical ring between two 3D points."""
    sx, sy, sz = start_point
    ex, ey, ez = end_point
    dx, dy, dz = ex - sx, ey - sy, ez - sz
    length = math.sqrt(dx * dx + dy * dy + dz * dz)
    ux, uy, uz = dx / length, dy / length, dz / length
    overshoot = 1.0

    outer = cq.Solid.makeCylinder(
        outer_radius,
        length,
        cq.Vector(sx, sy, sz),
        cq.Vector(dx, dy, dz),
    )
    inner = cq.Solid.makeCylinder(
        inner_radius,
        length + 2.0 * overshoot,
        cq.Vector(sx - ux * overshoot, sy - uy * overshoot, sz - uz * overshoot),
        cq.Vector(dx, dy, dz),
    )
    return cq.Workplane("XY").add(outer.cut(inner))


def cylinder_x(x_min, x_max, y, z, radius):
    return make_cylinder((x_min, y, z), (x_max, y, z), radius)


def cylinder_y(y_min, y_max, x, z, radius):
    return make_cylinder((x, y_min, z), (x, y_max, z), radius)


def cylinder_z(x, y, z_min, height, radius):
    return make_cylinder((x, y, z_min), (x, y, z_min + height), radius)


def centered_box(length_x, width_y, height_z, center):
    return cq.Workplane("XY").box(length_x, width_y, height_z).translate(center)


def chamfered_box(length_x, width_y, height_z, center, chamfer):
    return (
        cq.Workplane("XY")
        .box(length_x, width_y, height_z)
        .edges()
        .chamfer(chamfer)
        .translate(center)
    )


def oriented_box_at_xz(center, length_x, depth_y, thickness_z, angle_degrees, chamfer=0.0):
    """Create a box whose length lies in the XZ plane."""
    box = cq.Workplane("XY").box(length_x, depth_y, thickness_z)
    if chamfer > 0:
        box = box.edges().chamfer(chamfer)
    return box.rotate((0, 0, 0), (0, 1, 0), -angle_degrees).translate(center)


def box_between_xz(start_point, end_point, depth_y, thickness_z, extra_length=0.0):
    sx, sy, sz = start_point
    ex, ey, ez = end_point
    dx, dz = ex - sx, ez - sz
    length = math.sqrt(dx * dx + dz * dz) + extra_length
    angle_degrees = math.degrees(math.atan2(dz, dx))
    center = ((sx + ex) / 2.0, (sy + ey) / 2.0, (sz + ez) / 2.0)
    return oriented_box_at_xz(center, length, depth_y, thickness_z, angle_degrees)


def make_capsule_cutter_y(start_xz, end_xz, radius, depth_y):
    """Through-cutter for oblong slots on parts whose thin direction is Y."""
    sx, sz = start_xz
    ex, ez = end_xz
    cutter = cylinder_y(-depth_y / 2.0, depth_y / 2.0, sx, sz, radius)
    cutter = cutter.union(cylinder_y(-depth_y / 2.0, depth_y / 2.0, ex, ez, radius))
    cutter = cutter.union(
        box_between_xz((sx, 0.0, sz), (ex, 0.0, ez), depth_y, 2.0 * radius)
    )
    return cutter


def cut_blind_hole_y(model, center_x, front_y, center_z, radius, depth):
    cutter = make_cylinder(
        (center_x, front_y + 1.0, center_z),
        (center_x, front_y - depth, center_z),
        radius,
    )
    return model.cut(cutter)


def cut_bolt_circle_on_y(
    model,
    center_x,
    center_z,
    front_y,
    bolt_circle_radius,
    hole_radius,
    count,
    depth,
    angle_offset_degrees=0.0,
):
    for index in range(count):
        angle = math.radians(angle_offset_degrees + 360.0 * index / count)
        x = center_x + bolt_circle_radius * math.cos(angle)
        z = center_z + bolt_circle_radius * math.sin(angle)
        model = cut_blind_hole_y(model, x, front_y, z, hole_radius, depth)
    return model


def add_circular_pins_on_y(
    model,
    center_x,
    center_z,
    surface_y,
    circle_radius,
    count,
    pin_radius,
    pin_length,
    angle_offset_degrees=0.0,
):
    for index in range(count):
        angle = math.radians(angle_offset_degrees + 360.0 * index / count)
        x = center_x + circle_radius * math.cos(angle)
        z = center_z + circle_radius * math.sin(angle)
        pin = make_cylinder((x, surface_y - 0.2, z), (x, surface_y + pin_length, z), pin_radius)
        model = model.union(pin)
    return model


def make_abb_label(center_x, center_y, top_z):
    """Simple raised block-letter label on the elbow housing top."""
    plate_length = 76.0
    plate_width = 38.0
    plate_height = 2.4
    stroke_height = 1.6
    stroke_width = 3.0
    letter_height = 18.0
    letter_width = 11.0

    label = centered_box(
        plate_length,
        plate_width,
        plate_height,
        (center_x, center_y, top_z + plate_height / 2.0 - 0.2),
    )

    def add_stroke(label_model, x_offset, y_offset, length_x, width_y):
        stroke = centered_box(
            length_x,
            width_y,
            stroke_height,
            (
                center_x + x_offset,
                center_y + y_offset,
                top_z + plate_height + stroke_height / 2.0 - 0.3,
            ),
        )
        return label_model.union(stroke)

    def add_letter_a(label_model, x_offset):
        label_model = add_stroke(label_model, x_offset - letter_width / 2.0, 0.0, stroke_width, letter_height)
        label_model = add_stroke(label_model, x_offset + letter_width / 2.0, 0.0, stroke_width, letter_height)
        label_model = add_stroke(label_model, x_offset, letter_height / 2.0 - stroke_width / 2.0, letter_width, stroke_width)
        label_model = add_stroke(label_model, x_offset, 0.0, letter_width, stroke_width)
        return label_model

    def add_letter_b(label_model, x_offset):
        label_model = add_stroke(label_model, x_offset - letter_width / 2.0, 0.0, stroke_width, letter_height)
        label_model = add_stroke(label_model, x_offset, letter_height / 2.0 - stroke_width / 2.0, letter_width, stroke_width)
        label_model = add_stroke(label_model, x_offset, 0.0, letter_width, stroke_width)
        label_model = add_stroke(label_model, x_offset, -letter_height / 2.0 + stroke_width / 2.0, letter_width, stroke_width)
        label_model = add_stroke(label_model, x_offset + letter_width / 2.0, letter_height / 4.0, stroke_width, letter_height / 2.0)
        label_model = add_stroke(label_model, x_offset + letter_width / 2.0, -letter_height / 4.0, stroke_width, letter_height / 2.0)
        return label_model

    label = add_letter_a(label, -22.0)
    label = add_letter_b(label, 0.0)
    label = add_letter_b(label, 22.0)
    return label


def make_gripper_jaw(pivot_x, pivot_z, mirror_sign):
    """Build one gripper finger; mirror_sign=1 for upper jaw and -1 for lower jaw."""
    p0 = (pivot_x, 0.0, pivot_z)
    p1 = (pivot_x + 34.0, 0.0, pivot_z + mirror_sign * 10.0)
    p2 = (pivot_x + 86.0, 0.0, pivot_z + mirror_sign * 30.0)
    p3 = (pivot_x + 118.0, 0.0, pivot_z + mirror_sign * 43.0)
    hook = (pivot_x + 110.0, 0.0, pivot_z + mirror_sign * 14.0)

    jaw = cylinder_y(
        -jaw_thickness_y / 2.0 - 5.0,
        jaw_thickness_y / 2.0 + 5.0,
        pivot_x,
        pivot_z,
        jaw_pivot_boss_radius,
    )

    # Angular V-shaped jaw body
    jaw = jaw.union(cylinder_y(-jaw_thickness_y / 2.0, jaw_thickness_y / 2.0, p1[0], p1[2], 10.0))
    jaw = jaw.union(cylinder_y(-jaw_thickness_y / 2.0, jaw_thickness_y / 2.0, p2[0], p2[2], 10.0))
    jaw = jaw.union(cylinder_y(-jaw_thickness_y / 2.0, jaw_thickness_y / 2.0, p3[0], p3[2], 8.0))
    jaw = jaw.union(box_between_xz(p0, p2, jaw_thickness_y, 18.0, extra_length=10.0))
    jaw = jaw.union(box_between_xz(p2, p3, jaw_thickness_y, 18.0, extra_length=6.0))
    jaw = jaw.union(box_between_xz(p3, hook, jaw_thickness_y, 18.0, extra_length=6.0))

    # Elongated adjustment slots
    slot_1 = make_capsule_cutter_y(
        (pivot_x + 30.0, pivot_z + mirror_sign * 8.0),
        (pivot_x + 54.0, pivot_z + mirror_sign * 16.0),
        jaw_slot_radius,
        jaw_thickness_y + 18.0,
    )
    slot_2 = make_capsule_cutter_y(
        (pivot_x + 62.0, pivot_z + mirror_sign * 19.0),
        (pivot_x + 88.0, pivot_z + mirror_sign * 29.0),
        jaw_slot_radius,
        jaw_thickness_y + 18.0,
    )
    jaw = jaw.cut(slot_1).cut(slot_2)

    # Serration blocks on the gripping tip
    edge_angle = math.degrees(math.atan2(p3[2] - hook[2], p3[0] - hook[0]))
    for tooth_index in range(5):
        t = (tooth_index + 0.5) / 5.0
        x = hook[0] * (1.0 - t) + p3[0] * t
        z = hook[2] * (1.0 - t) + p3[2] * t - mirror_sign * 2.5
        tooth = oriented_box_at_xz(
            (x, 0.0, z),
            8.0,
            jaw_thickness_y + 3.0,
            3.5,
            edge_angle + 90.0,
        )
        jaw = jaw.union(tooth)

    return jaw


# Create housing cap with stepped cylindrical deck and radial lugs
base_outer_ledge_z = base_bottom_height + base_main_height
base_inner_ledge_z = base_outer_ledge_z + base_outer_ledge_height
base_boss_z = base_inner_ledge_z + base_inner_ledge_height
base_lug_length = base_lug_outer_radius - base_lug_inner_radius

housing_cap = cylinder_z(0.0, 0.0, 0.0, base_bottom_height, base_bottom_radius)
housing_cap = housing_cap.union(
    cylinder_z(0.0, 0.0, base_bottom_height, base_main_height, base_body_radius)
)
housing_cap = housing_cap.union(
    cylinder_z(0.0, 0.0, base_outer_ledge_z, base_outer_ledge_height, base_body_radius)
)
housing_cap = housing_cap.union(
    cylinder_z(0.0, 0.0, base_inner_ledge_z, base_inner_ledge_height, base_inner_ledge_radius)
)
housing_cap = housing_cap.union(
    cylinder_z(0.0, 0.0, base_boss_z, base_center_boss_height, base_center_boss_radius)
)

for index in range(base_lug_count):
    angle_degrees = 360.0 * index / base_lug_count

    lug = (
        cq.Workplane("XY")
        .box(base_lug_length, base_lug_width, base_lug_height)
        .translate(
            (
                base_lug_inner_radius + base_lug_length / 2.0,
                0.0,
                base_lug_height / 2.0,
            )
        )
        .rotate((0, 0, 0), (0, 0, 1), angle_degrees)
    )
    foot = (
        cq.Workplane("XY")
        .box(base_lug_length + 12.0, base_lug_width + 12.0, base_lug_foot_height)
        .translate(
            (
                base_lug_inner_radius + base_lug_length / 2.0,
                0.0,
                base_lug_foot_height / 2.0,
            )
        )
        .rotate((0, 0, 0), (0, 0, 1), angle_degrees)
    )
    housing_cap = housing_cap.union(lug).union(foot)

for index in range(base_lug_count):
    angle = math.radians(360.0 * index / base_lug_count)
    hole_radius_from_center = base_lug_inner_radius + base_lug_length * 0.68
    hole_x = hole_radius_from_center * math.cos(angle)
    hole_y = hole_radius_from_center * math.sin(angle)

    housing_cap = housing_cap.cut(
        cylinder_z(
            hole_x,
            hole_y,
            base_lug_height - 6.0,
            8.0,
            base_lug_counterbore_radius,
        )
    )
    housing_cap = housing_cap.cut(
        cylinder_z(
            hole_x,
            hole_y,
            base_lug_height - 26.0,
            28.0,
            base_lug_hole_radius,
        )
    )

result = housing_cap

# Add the 12-fold spacer ring cluster on the turntable ledge
for index in range(spacer_count):
    angle = math.radians(360.0 * index / spacer_count)
    spacer_x = spacer_pitch_radius * math.cos(angle)
    spacer_y = spacer_pitch_radius * math.sin(angle)
    spacer = make_ring(
        (spacer_x, spacer_y, spacer_bottom_z),
        (spacer_x, spacer_y, spacer_bottom_z + spacer_axial_length),
        spacer_outer_radius,
        spacer_inner_radius,
    )
    result = result.union(spacer)

# Build turntable and lower lever with shoulder hub
turntable_top_z = (
    turntable_lower_z
    + turntable_lower_height
    + turntable_mid_height
    + turntable_upper_height
)
tooth_center_radius = turntable_upper_radius + turntable_tooth_radial_length / 2.0

lever_arm = cylinder_z(
    0.0, 0.0, turntable_lower_z, turntable_lower_height, turntable_lower_radius
)
lever_arm = lever_arm.union(
    cylinder_z(
        0.0,
        0.0,
        turntable_lower_z + turntable_lower_height,
        turntable_mid_height,
        turntable_mid_radius,
    )
)
lever_arm = lever_arm.union(
    cylinder_z(
        0.0,
        0.0,
        turntable_lower_z + turntable_lower_height + turntable_mid_height,
        turntable_upper_height,
        turntable_upper_radius,
    )
)

for index in range(turntable_tooth_count):
    angle_degrees = 360.0 * index / turntable_tooth_count
    tooth = (
        cq.Workplane("XY")
        .box(
            turntable_tooth_radial_length,
            turntable_tooth_tangential_width,
            turntable_tooth_height,
        )
        .translate(
            (
                tooth_center_radius,
                0.0,
                turntable_top_z + turntable_tooth_height / 2.0 - 0.4,
            )
        )
        .rotate((0, 0, 0), (0, 0, 1), angle_degrees)
    )
    lever_arm = lever_arm.union(tooth)

lower_link_start = (4.0, 0.0, turntable_lower_z + 60.0)
shoulder_center = (shoulder_x, 0.0, shoulder_z)

lever_arm = lever_arm.union(
    box_between_xz(
        lower_link_start,
        shoulder_center,
        lower_lever_width_y,
        lower_lever_thickness_z,
        extra_length=22.0,
    )
)
lever_arm = lever_arm.union(make_cylinder(lower_link_start, shoulder_center, 24.0))

shoulder_half_width = shoulder_hub_width / 2.0
shoulder_front_y = shoulder_half_width + shoulder_cap_width

lever_arm = lever_arm.union(
    cylinder_y(-shoulder_half_width, shoulder_half_width, shoulder_x, shoulder_z, shoulder_hub_radius)
)
lever_arm = lever_arm.union(
    cylinder_y(shoulder_half_width - 0.2, shoulder_front_y, shoulder_x, shoulder_z, shoulder_cap_radius)
)
lever_arm = lever_arm.union(
    cylinder_y(-shoulder_front_y, -shoulder_half_width + 0.2, shoulder_x, shoulder_z, shoulder_cap_radius)
)

lever_arm = add_circular_pins_on_y(
    lever_arm,
    shoulder_x,
    shoulder_z,
    shoulder_front_y,
    50.0,
    24,
    2.2,
    4.0,
    angle_offset_degrees=7.5,
)

result = result.union(lever_arm)

# Long connecting arm between shoulder and elbow
upper_arm_start = (shoulder_x - 4.0, 0.0, shoulder_z + 18.0)
upper_arm_end = (elbow_x + 4.0, 0.0, elbow_z - 12.0)
upper_arm_angle = math.degrees(
    math.atan2(upper_arm_end[2] - upper_arm_start[2], upper_arm_end[0] - upper_arm_start[0])
)

connecting_arm = box_between_xz(
    upper_arm_start,
    upper_arm_end,
    upper_arm_width_y,
    upper_arm_thickness_z,
    extra_length=30.0,
)
connecting_arm = connecting_arm.union(
    cylinder_y(-34.0, 34.0, shoulder_x, shoulder_z, 49.0)
)
connecting_arm = connecting_arm.union(
    cylinder_y(-34.0, 34.0, elbow_x, elbow_z, 47.0)
)
connecting_arm = connecting_arm.union(
    cylinder_y(34.0, 42.0, elbow_x, elbow_z, 37.0)
)

# Raised rectangular lugs/badges along the shank
for t in (0.34, 0.49, 0.64):
    badge_x = upper_arm_start[0] * (1.0 - t) + upper_arm_end[0] * t
    badge_z = upper_arm_start[2] * (1.0 - t) + upper_arm_end[2] * t
    badge = oriented_box_at_xz(
        (badge_x, -upper_arm_width_y / 2.0 - 2.2, badge_z),
        28.0,
        6.0,
        18.0,
        upper_arm_angle,
    )
    connecting_arm = connecting_arm.union(badge)

result = result.union(connecting_arm)

# Elbow joint housing with blocky L-shaped head and cylindrical hub
joint_block_top_z = joint_block_center_z + joint_block_height_z / 2.0
joint_housing = chamfered_box(
    joint_block_length_x,
    joint_block_width_y,
    joint_block_height_z,
    (joint_block_center_x, 0.0, joint_block_center_z),
    7.0,
)
joint_housing = joint_housing.union(
    cylinder_y(-elbow_hub_width / 2.0, elbow_hub_width / 2.0, elbow_x, elbow_z, elbow_hub_radius)
)

elbow_front_y = elbow_hub_width / 2.0 + elbow_cap_width
joint_housing = joint_housing.union(
    cylinder_y(elbow_hub_width / 2.0 - 0.2, elbow_front_y, elbow_x, elbow_z, elbow_cap_radius)
)
joint_housing = joint_housing.union(
    cylinder_y(-elbow_front_y, -elbow_hub_width / 2.0 + 0.2, elbow_x, elbow_z, elbow_cap_radius)
)

# Cylindrical arm projecting from the right-angle housing into the forearm
joint_housing = joint_housing.union(
    cylinder_x(elbow_x + 12.0, shaft_start_x + 14.0, 0.0, forearm_axis_z, 31.0)
)
joint_housing = joint_housing.union(
    cylinder_x(elbow_x + 22.0, elbow_x + 36.0, 0.0, forearm_axis_z, 42.0)
)
joint_housing = joint_housing.union(make_abb_label(joint_block_center_x, 0.0, joint_block_top_z))

result = result.union(joint_housing)

# Forearm prismatic shaft
shaft_length = shaft_end_x - shaft_start_x
forearm = chamfered_box(
    shaft_length,
    shaft_width_y,
    shaft_height_z,
    ((shaft_start_x + shaft_end_x) / 2.0, 0.0, forearm_axis_z),
    4.0,
)
forearm = forearm.union(cylinder_x(shaft_start_x - 12.0, shaft_start_x + 12.0, 0.0, forearm_axis_z, 29.0))
forearm = forearm.union(cylinder_x(shaft_end_x - 10.0, shaft_end_x + 16.0, 0.0, forearm_axis_z, 29.0))

result = result.union(forearm)

# Multi-bore lobed forearm housing
multi_front_plate_center_y = multi_width_y / 2.0 + multi_front_plate_thickness / 2.0 - 0.5
multi_front_face_y = multi_front_plate_center_y + multi_front_plate_thickness / 2.0

multi_bore_housing = centered_box(
    multi_length_x - 70.0,
    multi_width_y,
    multi_core_height_z,
    (multi_center_x, 0.0, forearm_axis_z),
)
for x_offset in (-multi_lobe_spacing / 2.0, multi_lobe_spacing / 2.0):
    multi_bore_housing = multi_bore_housing.union(
        cylinder_y(
            -multi_width_y / 2.0,
            multi_width_y / 2.0,
            multi_center_x + x_offset,
            forearm_axis_z,
            multi_lobe_radius,
        )
    )

for x_offset, z_offset, radius in (
    (0.0, 33.0, 23.0),
    (0.0, -33.0, 23.0),
    (-37.0, 28.0, 18.0),
    (37.0, -28.0, 18.0),
):
    multi_bore_housing = multi_bore_housing.union(
        cylinder_y(
            -multi_width_y / 2.0,
            multi_width_y / 2.0,
            multi_center_x + x_offset,
            forearm_axis_z + z_offset,
            radius,
        )
    )

multi_front_plate = centered_box(
    multi_length_x - 74.0,
    multi_front_plate_thickness,
    multi_core_height_z + 8.0,
    (multi_center_x, multi_front_plate_center_y, forearm_axis_z),
)
for x_offset in (-multi_lobe_spacing / 2.0, multi_lobe_spacing / 2.0):
    multi_front_plate = multi_front_plate.union(
        cylinder_y(
            multi_front_plate_center_y - multi_front_plate_thickness / 2.0,
            multi_front_plate_center_y + multi_front_plate_thickness / 2.0,
            multi_center_x + x_offset,
            forearm_axis_z,
            multi_lobe_radius - 5.0,
        )
    )
multi_bore_housing = multi_bore_housing.union(multi_front_plate)

# Cross-bore and longitudinal bores
multi_bore_housing = multi_bore_housing.cut(
    cylinder_y(-multi_width_y / 2.0 - 5.0, multi_front_face_y + 2.0, multi_center_x, forearm_axis_z, 26.0)
)
multi_bore_housing = multi_bore_housing.cut(
    cylinder_x(
        multi_center_x - multi_length_x / 2.0 - 4.0,
        multi_center_x + multi_length_x / 2.0 + 4.0,
        0.0,
        forearm_axis_z + 22.0,
        7.0,
    )
)
multi_bore_housing = multi_bore_housing.cut(
    cylinder_x(
        multi_center_x - multi_length_x / 2.0 - 4.0,
        multi_center_x + multi_length_x / 2.0 + 4.0,
        0.0,
        forearm_axis_z - 22.0,
        7.0,
    )
)

# Perimeter blind holes on the front lobed face
for index in range(22):
    angle = math.radians(360.0 * index / 22.0)
    hole_x = multi_center_x + 78.0 * math.cos(angle)
    hole_z = forearm_axis_z + 34.0 * math.sin(angle)
    multi_bore_housing = cut_blind_hole_y(
        multi_bore_housing,
        hole_x,
        multi_front_face_y,
        hole_z,
        2.3,
        12.0,
    )

# Protruding wrist boss
multi_bore_housing = multi_bore_housing.union(
    cylinder_x(
        multi_center_x + multi_length_x / 2.0 - 8.0,
        multi_center_x + multi_length_x / 2.0 + 36.0,
        0.0,
        forearm_axis_z,
        20.0,
    )
)
multi_bore_housing = multi_bore_housing.union(
    cylinder_x(
        multi_center_x + multi_length_x / 2.0 + 25.0,
        multi_center_x + multi_length_x / 2.0 + 43.0,
        0.0,
        forearm_axis_z,
        30.0,
    )
)

result = result.union(multi_bore_housing)

# Wrist scroll housing and compact mounting flanges
wrist = cylinder_x(wrist_start_x, wrist_start_x + 50.0, 0.0, forearm_axis_z, 24.0)
wrist = wrist.union(cylinder_x(wrist_start_x + 28.0, wrist_start_x + 47.0, 0.0, forearm_axis_z, 36.0))
wrist = wrist.union(cylinder_x(wrist_start_x + 47.0, wrist_start_x + 66.0, 0.0, forearm_axis_z, 31.0))
wrist = wrist.union(
    chamfered_box(
        48.0,
        70.0,
        55.0,
        (scroll_front_x - 16.0, 0.0, forearm_axis_z),
        4.0,
    )
)
wrist = wrist.union(cylinder_x(scroll_front_x - 32.0, scroll_front_x + 2.0, 0.0, forearm_axis_z, 35.0))

# Four scroll-housing mounting ears
wrist = wrist.union(centered_box(34.0, 58.0, 12.0, (scroll_front_x - 12.0, 0.0, forearm_axis_z + 36.0)))
wrist = wrist.union(centered_box(34.0, 58.0, 12.0, (scroll_front_x - 12.0, 0.0, forearm_axis_z - 36.0)))
wrist = wrist.union(centered_box(34.0, 12.0, 58.0, (scroll_front_x - 12.0, 40.0, forearm_axis_z)))
wrist = wrist.union(centered_box(34.0, 12.0, 58.0, (scroll_front_x - 12.0, -40.0, forearm_axis_z)))

# Scroll-shaped recessed face and four small through-holes
wrist = wrist.cut(make_cylinder((scroll_front_x + 3.0, 0.0, forearm_axis_z), (scroll_front_x - 18.0, 0.0, forearm_axis_z), 23.5))
wrist = wrist.cut(make_cylinder((scroll_front_x + 3.0, 10.0, forearm_axis_z + 8.0), (scroll_front_x - 12.0, 10.0, forearm_axis_z + 8.0), 10.0))

for hole_y in (-27.0, 27.0):
    for hole_z_offset in (-21.0, 21.0):
        wrist = wrist.cut(
            make_cylinder(
                (scroll_front_x + 4.0, hole_y, forearm_axis_z + hole_z_offset),
                (scroll_front_x - 38.0, hole_y, forearm_axis_z + hole_z_offset),
                1.5,
            )
        )

result = result.union(wrist)

# Stepped plug and gripper support clevis
adapter = cylinder_x(scroll_front_x - 5.0, scroll_front_x + 30.0, 0.0, forearm_axis_z, 24.0)
adapter = adapter.union(cylinder_x(scroll_front_x - 1.0, scroll_front_x + 11.0, 0.0, forearm_axis_z, 32.0))
adapter = adapter.union(
    chamfered_box(
        44.0,
        62.0,
        52.0,
        (adapter_block_center_x, 0.0, forearm_axis_z),
        4.0,
    )
)

upper_pivot_z = forearm_axis_z + jaw_pivot_z_offset
lower_pivot_z = forearm_axis_z - jaw_pivot_z_offset

adapter = adapter.union(
    box_between_xz(
        (adapter_block_center_x + 12.0, 0.0, forearm_axis_z + 12.0),
        (jaw_pivot_x, 0.0, upper_pivot_z),
        34.0,
        18.0,
        extra_length=8.0,
    )
)
adapter = adapter.union(
    box_between_xz(
        (adapter_block_center_x + 12.0, 0.0, forearm_axis_z - 12.0),
        (jaw_pivot_x, 0.0, lower_pivot_z),
        34.0,
        18.0,
        extra_length=8.0,
    )
)
adapter = adapter.union(cylinder_y(-28.0, 28.0, jaw_pivot_x, upper_pivot_z, 18.0))
adapter = adapter.union(cylinder_y(-28.0, 28.0, jaw_pivot_x, lower_pivot_z, 18.0))

result = result.union(adapter)

# Open mirrored jaw pair
upper_jaw = make_gripper_jaw(jaw_pivot_x, upper_pivot_z, 1)
lower_jaw = make_gripper_jaw(jaw_pivot_x, lower_pivot_z, -1)

result = result.union(upper_jaw).union(lower_jaw)

# Functional bores and blind bolt-circle patterns
result = result.cut(cylinder_y(-75.0, 75.0, shoulder_x, shoulder_z, shoulder_bore_radius))
result = result.cut(cylinder_y(-78.0, 78.0, elbow_x, elbow_z, elbow_bore_radius))

result = cut_bolt_circle_on_y(
    result,
    shoulder_x,
    shoulder_z,
    shoulder_front_y,
    38.0,
    3.0,
    13,
    12.0,
    angle_offset_degrees=4.0,
)
result = cut_bolt_circle_on_y(
    result,
    elbow_x,
    elbow_z,
    elbow_front_y,
    42.0,
    1.6,
    12,
    12.0,
    angle_offset_degrees=15.0,
)

# Perpendicular blind bores in the elbow block
result = result.cut(
    make_cylinder(
        (joint_block_center_x, joint_block_width_y / 2.0 + 3.0, joint_block_center_z),
        (joint_block_center_x, joint_block_width_y / 2.0 - 22.0, joint_block_center_z),
        15.0,
    )
)
joint_left_face_x = joint_block_center_x - joint_block_length_x / 2.0
result = result.cut(
    make_cylinder(
        (joint_left_face_x - 3.0, 0.0, joint_block_center_z),
        (joint_left_face_x + 22.0, 0.0, joint_block_center_z),
        15.0,
    )
)

# Gripper pivot through-holes
result = result.cut(cylinder_y(-35.0, 35.0, jaw_pivot_x, upper_pivot_z, 1.5))
result = result.cut(cylinder_y(-35.0, 35.0, jaw_pivot_x, lower_pivot_z, 1.5))

result = result.clean()