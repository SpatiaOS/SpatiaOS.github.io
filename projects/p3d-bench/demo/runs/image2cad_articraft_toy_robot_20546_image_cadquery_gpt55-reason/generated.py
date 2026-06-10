import math
import cadquery as cq

# -----------------------------------------------------------------------------
# Parameters
# -----------------------------------------------------------------------------
# Overall scale and visual language: a compact Technic/Bionicle-style robotic
# creature with an arched torso shell, articulated legs, claw arms, long neck,
# angular head, dorsal fins, exposed rods, pins, and perforated beams.
scale = 1.0

# General connector / beam dimensions
technic_pitch = 8.0 * scale
beam_height = 5.0 * scale
beam_depth = 3.0 * scale
hole_radius = 1.45 * scale
pin_radius = 2.8 * scale
pin_hole_radius = 1.05 * scale
joint_ball_radius = 3.4 * scale

# Torso and shell
torso_length = 18.0 * scale
torso_width = 18.0 * scale
torso_height = 12.0 * scale
shell_width = 24.0 * scale
shell_outer_radius = 22.0 * scale
shell_thickness = 4.0 * scale
shell_center_z = 36.0 * scale
shell_start_angle = 28.0
shell_end_angle = 152.0

# Head and neck
head_length = 23.0 * scale
head_width = 14.0 * scale
head_height = 10.0 * scale
head_center = (-40.0 * scale, 0.0, 62.0 * scale)
head_rotation = (0.0, -7.0, 0.0)

# Arms and claws
arm_beam_height = 4.8 * scale
arm_beam_depth = 3.0 * scale
claw_prong_width = 2.0 * scale
claw_prong_thickness = 1.15 * scale

# Legs and feet
leg_plate_height = 6.2 * scale
leg_plate_depth = 2.6 * scale
foot_length = 23.0 * scale
foot_width = 12.0 * scale
foot_height = 3.0 * scale


# -----------------------------------------------------------------------------
# Utility functions
# -----------------------------------------------------------------------------
def safe_fillet(workplane, radius, selector=None):
    """Apply a fillet if possible; return the unmodified solid if OCC rejects it."""
    if radius <= 0:
        return workplane

    try:
        if selector:
            return workplane.edges(selector).fillet(radius)
        return workplane.edges().fillet(radius)
    except Exception:
        return workplane


def rounded_box(length, width, height, fillet_radius=0.5):
    """Create a centered rounded rectangular block."""
    model = cq.Workplane("XY").box(length, width, height)
    return safe_fillet(model, fillet_radius)


def cylinder_axis(axis, length, radius, inner_radius=0.0):
    """Create a centered cylinder or tube aligned to X, Y, or Z."""
    plane_by_axis = {
        "x": "YZ",
        "y": "XZ",
        "z": "XY",
    }
    workplane = cq.Workplane(plane_by_axis[axis])

    if inner_radius and inner_radius > 0:
        return workplane.circle(radius).circle(inner_radius).extrude(length, both=True)

    return workplane.cylinder(length, radius)


def sphere(radius):
    """Create a centered ball joint sphere."""
    return cq.Workplane("XY").sphere(radius)


def distance(point_a, point_b):
    dx = point_b[0] - point_a[0]
    dy = point_b[1] - point_a[1]
    dz = point_b[2] - point_a[2]
    return math.sqrt(dx * dx + dy * dy + dz * dz)


def midpoint(point_a, point_b):
    return (
        (point_a[0] + point_b[0]) * 0.5,
        (point_a[1] + point_b[1]) * 0.5,
        (point_a[2] + point_b[2]) * 0.5,
    )


def lerp(point_a, point_b, t):
    return (
        point_a[0] + (point_b[0] - point_a[0]) * t,
        point_a[1] + (point_b[1] - point_a[1]) * t,
        point_a[2] + (point_b[2] - point_a[2]) * t,
    )


def apply_transform(model, translation=(0, 0, 0), rotation=(0, 0, 0)):
    """Rotate about the origin in XYZ order, then translate."""
    rx, ry, rz = rotation

    transformed = model
    if abs(rx) > 1e-9:
        transformed = transformed.rotate((0, 0, 0), (1, 0, 0), rx)
    if abs(ry) > 1e-9:
        transformed = transformed.rotate((0, 0, 0), (0, 1, 0), ry)
    if abs(rz) > 1e-9:
        transformed = transformed.rotate((0, 0, 0), (0, 0, 1), rz)

    return transformed.translate(translation)


def orient_to_vector(model, direction, center, roll=0.0):
    """Orient a local-X-aligned component so it points along a 3D direction."""
    dx, dy, dz = direction
    horizontal = math.hypot(dx, dy)

    yaw = math.degrees(math.atan2(dy, dx)) if horizontal > 1e-9 else 0.0
    pitch = -math.degrees(math.atan2(dz, horizontal))

    return apply_transform(model, center, (roll, pitch, yaw))


def place_between(model, start_point, end_point, roll=0.0):
    """Place a local-X-aligned component between two points."""
    direction = (
        end_point[0] - start_point[0],
        end_point[1] - start_point[1],
        end_point[2] - start_point[2],
    )
    return orient_to_vector(model, direction, midpoint(start_point, end_point), roll)


# -----------------------------------------------------------------------------
# Reusable modeled elements
# -----------------------------------------------------------------------------
def technic_beam(length, height=beam_height, depth=beam_depth, hole_r=hole_radius):
    """A rectangular Technic-style beam with circular through-holes."""
    beam = rounded_box(length, depth, height, fillet_radius=0.55 * scale)

    hole_count = max(1, int(round(length / technic_pitch)))
    if hole_count == 1:
        hole_positions = [0.0]
    else:
        usable_span = min((hole_count - 1) * technic_pitch, length - 2.7 * hole_r)
        spacing = usable_span / (hole_count - 1)
        hole_positions = [(-usable_span * 0.5) + i * spacing for i in range(hole_count)]

    for x_pos in hole_positions:
        cutter = (
            cq.Workplane("XZ")
            .center(x_pos, 0.0)
            .circle(hole_r)
            .extrude(depth * 4.0, both=True)
        )
        beam = beam.cut(cutter)

    return beam


def truss_plate(length, height=leg_plate_height, depth=leg_plate_depth, hole_r=hole_radius):
    """A thin structural side plate with pin holes and triangular web cutouts."""
    plate = rounded_box(length, depth, height, fillet_radius=0.35 * scale)

    hole_count = max(2, int(round(length / technic_pitch)))
    usable_span = min((hole_count - 1) * technic_pitch, length - 2.8 * hole_r)
    spacing = usable_span / (hole_count - 1)

    for i in range(hole_count):
        x_pos = -usable_span * 0.5 + i * spacing
        cutter = (
            cq.Workplane("XZ")
            .center(x_pos, 0.0)
            .circle(hole_r * 0.92)
            .extrude(depth * 4.0, both=True)
        )
        plate = plate.cut(cutter)

    bay_count = max(1, int(length // technic_pitch))
    bay_spacing = length / (bay_count + 1)

    for bay in range(bay_count):
        x_center = -length * 0.5 + (bay + 1) * bay_spacing
        tri_width = bay_spacing * 0.72
        z_low = -height * 0.33
        z_high = height * 0.33

        if bay % 2 == 0:
            points = [
                (x_center - tri_width * 0.5, z_low),
                (x_center + tri_width * 0.5, z_low),
                (x_center, z_high),
            ]
        else:
            points = [
                (x_center - tri_width * 0.5, z_high),
                (x_center + tri_width * 0.5, z_high),
                (x_center, z_low),
            ]

        cutter = (
            cq.Workplane("XZ")
            .polyline(points)
            .close()
            .extrude(depth * 4.0, both=True)
        )
        plate = plate.cut(cutter)

    return plate


def technic_beam_between(start_point, end_point, height=beam_height, depth=beam_depth, roll=0.0):
    length = distance(start_point, end_point)
    return place_between(technic_beam(length, height, depth), start_point, end_point, roll)


def truss_plate_between(start_point, end_point, height=leg_plate_height, depth=leg_plate_depth, roll=0.0):
    length = distance(start_point, end_point)
    return place_between(truss_plate(length, height, depth), start_point, end_point, roll)


def rod_between(start_point, end_point, radius):
    length = distance(start_point, end_point)
    rod = cylinder_axis("x", length, radius)
    return place_between(rod, start_point, end_point)


def ring_axis_x(width, outer_radius, inner_radius):
    return cylinder_axis("x", width, outer_radius, inner_radius)


def ribbed_rod_between(
    start_point,
    end_point,
    rod_radius=0.65 * scale,
    rib_radius=1.15 * scale,
    rib_width=0.65 * scale,
    rib_count=7,
):
    """A piston/spring-like rod made from a thin cylinder and repeated collars."""
    direction = (
        end_point[0] - start_point[0],
        end_point[1] - start_point[1],
        end_point[2] - start_point[2],
    )

    rod_components = [rod_between(start_point, end_point, rod_radius)]

    for i in range(rib_count):
        t = (i + 1) / (rib_count + 1)
        center = lerp(start_point, end_point, t)
        collar = ring_axis_x(rib_width, rib_radius, max(rod_radius * 0.7, 0.25 * scale))
        rod_components.append(orient_to_vector(collar, direction, center))

    return rod_components


def annular_sector(width, outer_radius, thickness, start_angle, end_angle, segments=36):
    """Curved arched shell section: an annular sector extruded across body width."""
    inner_radius = outer_radius - thickness
    angle_values = [
        math.radians(start_angle + (end_angle - start_angle) * i / segments)
        for i in range(segments + 1)
    ]

    outer_points = [
        (outer_radius * math.cos(angle), outer_radius * math.sin(angle))
        for angle in angle_values
    ]
    inner_points = [
        (inner_radius * math.cos(angle), inner_radius * math.sin(angle))
        for angle in reversed(angle_values)
    ]

    return (
        cq.Workplane("XZ")
        .polyline(outer_points + inner_points)
        .close()
        .extrude(width, both=True)
    )


def flat_prong(length, width, thickness, tip_width=0.45 * scale):
    """Flat tapered claw/toe element, local X from broad base to pointed tip."""
    points = [
        (-length * 0.5, -width * 0.5),
        (length * 0.18, -width * 0.5),
        (length * 0.5, -tip_width * 0.5),
        (length * 0.5, tip_width * 0.5),
        (length * 0.18, width * 0.5),
        (-length * 0.5, width * 0.5),
    ]
    return cq.Workplane("XY").polyline(points).close().extrude(thickness, both=True)


def rectangular_frame(length, width, height, wall=1.8 * scale):
    """Open rectangular block resembling a Technic connector frame."""
    frame = rounded_box(length, width, height, fillet_radius=0.55 * scale)
    opening = cq.Workplane("XY").box(length * 1.5, width - 2 * wall, height - 2 * wall)
    return frame.cut(opening)


def angular_head(length=head_length, width=head_width, height=head_height):
    """Angular robotic reptile-like head shell extruded across width."""
    profile = [
        (-length * 0.55, -height * 0.08),
        (-length * 0.38, -height * 0.46),
        (length * 0.28, -height * 0.42),
        (length * 0.52, -height * 0.08),
        (length * 0.30, height * 0.48),
        (-length * 0.08, height * 0.58),
        (-length * 0.50, height * 0.24),
    ]

    head = cq.Workplane("XZ").polyline(profile).close().extrude(width, both=True)
    return safe_fillet(head, 0.35 * scale)


def lower_jaw(length=18.0 * scale, width=12.0 * scale, height=4.0 * scale):
    """Separate lower jaw plate under the head."""
    profile = [
        (-length * 0.55, -height * 0.20),
        (length * 0.32, -height * 0.28),
        (length * 0.55, height * 0.05),
        (length * 0.15, height * 0.35),
        (-length * 0.48, height * 0.22),
    ]
    return cq.Workplane("XZ").polyline(profile).close().extrude(width, both=True)


def dorsal_fin(length, height, depth):
    """Vertical dorsal fin with narrow slots, modeled as a thin side plate."""
    profile = [
        (-length * 0.50, 0.0),
        (length * 0.50, 0.0),
        (length * 0.34, height * 0.70),
        (length * 0.06, height),
        (-length * 0.26, height * 0.55),
    ]

    fin = cq.Workplane("XZ").polyline(profile).close().extrude(depth, both=True)
    fin = safe_fillet(fin, 0.18 * scale)

    for z_pos in (height * 0.28, height * 0.46, height * 0.64):
        slot = (
            cq.Workplane("XZ")
            .center(0.0, z_pos)
            .rect(length * 0.45, height * 0.055)
            .extrude(depth * 4.0, both=True)
        )
        fin = fin.cut(slot)

    for x_pos, z_pos in [(-length * 0.18, height * 0.18), (length * 0.10, height * 0.22)]:
        hole = (
            cq.Workplane("XZ")
            .center(x_pos, z_pos)
            .circle(1.0 * scale)
            .extrude(depth * 4.0, both=True)
        )
        fin = fin.cut(hole)

    return fin


# -----------------------------------------------------------------------------
# Model construction
# -----------------------------------------------------------------------------
def build_robot_model():
    """Build the complete mechanical creature as a CadQuery compound."""
    component_shapes = []

    def add_component(model):
        """Collect CadQuery solids/compounds into a local compound container."""
        if model is None:
            return

        if isinstance(model, (list, tuple)):
            for item in model:
                add_component(item)
            return

        try:
            component_shapes.extend(model.vals())
        except AttributeError:
            component_shapes.append(model)

    def add_joint(center, axis="y", ball_r=joint_ball_radius):
        """Add a ball-and-pin joint detail."""
        add_component(sphere(ball_r).translate(center))
        add_component(cylinder_axis(axis, 7.2 * scale, pin_radius, pin_hole_radius).translate(center))

    # -------------------------------------------------------------------------
    # Torso core and pelvis
    # -------------------------------------------------------------------------
    add_component(
        rounded_box(torso_length, torso_width, torso_height, 1.1 * scale).translate(
            (-1.0 * scale, 0, 36.0 * scale)
        )
    )
    add_component(cylinder_axis("y", 25.0 * scale, 7.5 * scale, 2.3 * scale).translate((-2.0 * scale, 0, 42.0 * scale)))
    add_component(
        rounded_box(16.0 * scale, 20.0 * scale, 10.0 * scale, 0.9 * scale).translate(
            (1.0 * scale, 0, 28.0 * scale)
        )
    )

    # Front rectangular connector/cockpit-like frame under the shell.
    add_component(
        rectangular_frame(9.0 * scale, 17.0 * scale, 10.0 * scale, 2.1 * scale).translate(
            (-15.0 * scale, 0, 38.0 * scale)
        )
    )

    # Shoulder and hip axles spanning the torso.
    add_component(cylinder_axis("y", 32.0 * scale, 2.5 * scale, 0.9 * scale).translate((-8.0 * scale, 0, 42.0 * scale)))
    add_component(cylinder_axis("y", 21.0 * scale, 2.8 * scale, 1.0 * scale).translate((0.0, 0, 31.0 * scale)))

    # Side connector stacks and small blocky mechanical details.
    for side in (-1, 1):
        add_component(cylinder_axis("y", 3.2 * scale, 4.0 * scale, 1.5 * scale).translate((-8.0 * scale, side * 13.6 * scale, 42.0 * scale)))
        add_component(cylinder_axis("y", 3.2 * scale, 3.6 * scale, 1.3 * scale).translate((0.0, side * 10.8 * scale, 31.0 * scale)))
        add_component(
            rounded_box(5.0 * scale, 2.5 * scale, 10.0 * scale, 0.35 * scale).translate(
                (8.0 * scale, side * 13.7 * scale, 37.0 * scale)
            )
        )

        for z_pos in (32.0 * scale, 38.0 * scale, 44.0 * scale):
            add_component(cylinder_axis("y", 2.0 * scale, 2.45 * scale, 0.85 * scale).translate((5.0 * scale, side * 13.4 * scale, z_pos)))

    # Belly braces.
    add_component(rod_between((-8.0 * scale, -5.5 * scale, 36.0 * scale), (1.5 * scale, -5.5 * scale, 28.0 * scale), 0.65 * scale))
    add_component(rod_between((-8.0 * scale, 5.5 * scale, 36.0 * scale), (1.5 * scale, 5.5 * scale, 28.0 * scale), 0.65 * scale))

    # -------------------------------------------------------------------------
    # Curved arched torso shell
    # -------------------------------------------------------------------------
    shell = annular_sector(
        shell_width,
        shell_outer_radius,
        shell_thickness,
        shell_start_angle,
        shell_end_angle,
        segments=42,
    ).translate((0.0, 0.0, shell_center_z))
    add_component(shell)

    # Raised center ridge and thicker side rims.
    add_component(
        annular_sector(
            2.3 * scale,
            shell_outer_radius + 1.0 * scale,
            1.2 * scale,
            shell_start_angle + 2.0,
            shell_end_angle - 2.0,
            segments=42,
        ).translate((0.0, 0.0, shell_center_z))
    )

    for side in (-1, 1):
        add_component(
            annular_sector(
                1.25 * scale,
                shell_outer_radius + 0.45 * scale,
                shell_thickness + 0.8 * scale,
                shell_start_angle,
                shell_end_angle,
                segments=42,
            ).translate((0.0, side * (shell_width * 0.5 + 0.15 * scale), shell_center_z))
        )

    # Cross ribs and hinge tubes at the ends of the shell.
    for angle in (45.0, 72.0, 100.0, 128.0):
        rad = math.radians(angle)
        x_pos = shell_outer_radius * math.cos(rad)
        z_pos = shell_center_z + shell_outer_radius * math.sin(rad)
        add_component(cylinder_axis("y", shell_width + 2.2 * scale, 0.62 * scale).translate((x_pos, 0.0, z_pos)))

    for angle in (shell_start_angle, shell_end_angle):
        rad = math.radians(angle)
        x_pos = shell_outer_radius * math.cos(rad)
        z_pos = shell_center_z + (shell_outer_radius - shell_thickness * 0.5) * math.sin(rad)
        add_component(cylinder_axis("y", shell_width + 3.0 * scale, 2.1 * scale, 0.8 * scale).translate((x_pos, 0.0, z_pos)))

    # -------------------------------------------------------------------------
    # Dorsal fins and rear twin tail/rail assembly
    # -------------------------------------------------------------------------
    add_component(
        apply_transform(
            dorsal_fin(13.0 * scale, 18.0 * scale, 2.2 * scale),
            (4.5 * scale, 0.0, 54.0 * scale),
            (0.0, -8.0, 0.0),
        )
    )
    add_component(
        apply_transform(
            dorsal_fin(10.5 * scale, 13.0 * scale, 2.0 * scale),
            (14.0 * scale, 0.0, 51.5 * scale),
            (0.0, -18.0, 0.0),
        )
    )

    add_component(cylinder_axis("y", 18.0 * scale, 2.7 * scale, 1.0 * scale).translate((13.0 * scale, 0.0, 49.0 * scale)))

    for side in (-1, 1):
        tail_start = (13.0 * scale, side * 5.0 * scale, 49.0 * scale)
        tail_end = (42.0 * scale, side * 8.0 * scale, 55.0 * scale)

        add_component(ribbed_rod_between(tail_start, tail_end, 0.62 * scale, 1.08 * scale, 0.62 * scale, 9))

        tip_upper = (55.0 * scale, side * 10.0 * scale, 57.0 * scale)
        tip_lower = (54.0 * scale, side * 4.0 * scale, 52.0 * scale)
        add_component(place_between(flat_prong(distance(tail_end, tip_upper), 2.0 * scale, 1.1 * scale), tail_end, tip_upper))
        add_component(place_between(flat_prong(distance(tail_end, tip_lower), 2.0 * scale, 1.1 * scale), tail_end, tip_lower))

    # -------------------------------------------------------------------------
    # Neck and angular head
    # -------------------------------------------------------------------------
    neck_base = (-15.5 * scale, 0.0, 50.0 * scale)
    head_socket = (-29.0 * scale, 0.0, 58.5 * scale)

    add_component(ribbed_rod_between((-15.0 * scale, -4.0 * scale, 50.0 * scale), (-29.0 * scale, -4.0 * scale, 58.2 * scale), 0.62 * scale, 1.08 * scale, 0.62 * scale, 8))
    add_component(ribbed_rod_between((-15.0 * scale, 4.0 * scale, 50.0 * scale), (-29.0 * scale, 4.0 * scale, 58.2 * scale), 0.62 * scale, 1.08 * scale, 0.62 * scale, 8))
    add_component(technic_beam_between((-14.0 * scale, 0.0, 48.0 * scale), (-28.0 * scale, 0.0, 56.5 * scale), 4.2 * scale, 2.6 * scale))

    add_joint(neck_base, axis="y", ball_r=3.0 * scale)
    add_joint(head_socket, axis="y", ball_r=3.0 * scale)

    # Head shell, lower jaw, eyes, cheek pins, and top circular port.
    add_component(apply_transform(angular_head(), head_center, head_rotation))
    add_component(apply_transform(lower_jaw().translate((-1.5 * scale, 0.0, -5.4 * scale)), head_center, head_rotation))

    for side in (-1, 1):
        eye_ring = cylinder_axis("y", 1.25 * scale, 2.45 * scale, 1.05 * scale).translate(
            (-4.8 * scale, side * 7.25 * scale, 2.4 * scale)
        )
        cheek_pin = cylinder_axis("y", 1.25 * scale, 1.95 * scale, 0.75 * scale).translate(
            (4.4 * scale, side * 7.2 * scale, -1.7 * scale)
        )
        jaw_pin = cylinder_axis("y", 1.0 * scale, 1.6 * scale, 0.55 * scale).translate(
            (-9.0 * scale, side * 6.7 * scale, -3.0 * scale)
        )

        add_component(apply_transform(eye_ring, head_center, head_rotation))
        add_component(apply_transform(cheek_pin, head_center, head_rotation))
        add_component(apply_transform(jaw_pin, head_center, head_rotation))

    top_port = cylinder_axis("z", 1.15 * scale, 2.65 * scale, 1.1 * scale).translate((-5.5 * scale, 0.0, 5.7 * scale))
    add_component(apply_transform(top_port, head_center, head_rotation))

    # -------------------------------------------------------------------------
    # Articulated claw arms
    # -------------------------------------------------------------------------
    for side in (-1, 1):
        shoulder = (-8.5 * scale, side * 14.5 * scale, 42.0 * scale)
        elbow = (-23.5 * scale, side * 22.0 * scale, 35.5 * scale)
        wrist = (-39.0 * scale, side * 27.0 * scale, 31.2 * scale)

        # Main perforated Technic-style upper and lower arm links.
        add_component(technic_beam_between(shoulder, elbow, arm_beam_height, arm_beam_depth))
        add_component(technic_beam_between(elbow, wrist, arm_beam_height, arm_beam_depth))

        # Parallel ribbed pistons along each arm segment.
        add_component(
            ribbed_rod_between(
                (shoulder[0] - 0.8 * scale, shoulder[1], shoulder[2] + 3.0 * scale),
                (elbow[0] - 0.8 * scale, elbow[1], elbow[2] + 3.0 * scale),
                0.55 * scale,
                1.0 * scale,
                0.55 * scale,
                6,
            )
        )
        add_component(
            ribbed_rod_between(
                (elbow[0], elbow[1], elbow[2] - 2.0 * scale),
                (wrist[0], wrist[1], wrist[2] + 2.0 * scale),
                0.55 * scale,
                1.0 * scale,
                0.55 * scale,
                7,
            )
        )

        for joint_center in (shoulder, elbow, wrist):
            add_joint(joint_center, axis="y", ball_r=3.05 * scale)

        # Wrist connector frame.
        wrist_frame_start = (wrist[0] + 2.5 * scale, wrist[1], wrist[2])
        wrist_frame_end = (wrist[0] - 4.0 * scale, wrist[1] + side * 1.0 * scale, wrist[2])
        add_component(
            place_between(
                rectangular_frame(6.6 * scale, 7.0 * scale, 5.6 * scale, 1.35 * scale),
                wrist_frame_start,
                wrist_frame_end,
            )
        )

        # Two open tapered claw prongs.
        for jaw_side in (-1, 1):
            root = (
                wrist[0] - 4.5 * scale,
                wrist[1] + jaw_side * side * 1.8 * scale,
                wrist[2] + jaw_side * 0.8 * scale,
            )
            tip = (
                wrist[0] - 20.0 * scale,
                wrist[1] + side * (5.0 + jaw_side * 2.2) * scale,
                wrist[2] + jaw_side * 2.2 * scale,
            )

            add_component(
                place_between(
                    flat_prong(distance(root, tip), claw_prong_width, claw_prong_thickness),
                    root,
                    tip,
                )
            )

        add_component(cylinder_axis("y", 8.0 * scale, 2.1 * scale, 0.75 * scale).translate(wrist))

    # -------------------------------------------------------------------------
    # Legs, knees, ankles, and oversized mechanical feet
    # -------------------------------------------------------------------------
    for side in (-1, 1):
        leg_y = side * 7.2 * scale

        hip = (0.0, leg_y, 31.0 * scale)
        knee = (4.0 * scale, leg_y, 20.8 * scale)
        ankle = (-2.5 * scale, leg_y, 8.2 * scale)

        # Foot base, heel block, and lateral sole details.
        add_component(
            rounded_box(foot_length, foot_width, foot_height, 0.85 * scale).translate(
                (-5.0 * scale, leg_y, foot_height * 0.5)
            )
        )
        add_component(
            rounded_box(8.5 * scale, foot_width * 0.78, 2.6 * scale, 0.65 * scale).translate(
                (5.0 * scale, leg_y, 2.8 * scale)
            )
        )

        for y_offset in (-4.2 * scale, 0.0, 4.2 * scale):
            toe_base = (-13.0 * scale, leg_y + y_offset, 3.2 * scale)
            toe_tip = (-21.5 * scale, leg_y + y_offset * 1.12, 3.35 * scale)
            add_component(place_between(flat_prong(distance(toe_base, toe_tip), 2.15 * scale, 1.15 * scale), toe_base, toe_tip))

        for y_offset in (-5.0 * scale, 5.0 * scale):
            add_component(
                rounded_box(5.0 * scale, 2.0 * scale, 2.2 * scale, 0.35 * scale).translate(
                    (-1.0 * scale, leg_y + y_offset, 3.1 * scale)
                )
            )
            add_component(cylinder_axis("z", 1.1 * scale, 1.45 * scale, 0.5 * scale).translate((-8.5 * scale, leg_y + y_offset, 4.2 * scale)))

        add_joint(hip, axis="y", ball_r=3.15 * scale)
        add_joint(knee, axis="y", ball_r=3.25 * scale)
        add_joint(ankle, axis="y", ball_r=3.35 * scale)

        # Paired side plates form the open lattice upper and lower legs.
        for plate_offset in (-1.45 * scale, 1.45 * scale):
            upper_start = (hip[0], leg_y + plate_offset, hip[2])
            upper_end = (knee[0], leg_y + plate_offset, knee[2])
            lower_start = (knee[0], leg_y + plate_offset, knee[2])
            lower_end = (ankle[0], leg_y + plate_offset, ankle[2])

            add_component(truss_plate_between(upper_start, upper_end, leg_plate_height, leg_plate_depth))
            add_component(truss_plate_between(lower_start, lower_end, leg_plate_height, leg_plate_depth))

        # Central shin beam with visible pin holes.
        add_component(
            technic_beam_between(
                (knee[0] - 1.0 * scale, leg_y, knee[2] - 1.2 * scale),
                (ankle[0] + 0.8 * scale, leg_y, ankle[2] + 1.2 * scale),
                4.7 * scale,
                2.8 * scale,
            )
        )

        # Thin piston from hip area to ankle.
        piston_side_y = leg_y + side * 3.0 * scale
        add_component(
            ribbed_rod_between(
                (-1.8 * scale, piston_side_y, 29.5 * scale),
                (-3.8 * scale, piston_side_y, 9.4 * scale),
                0.55 * scale,
                1.0 * scale,
                0.55 * scale,
                8,
            )
        )

    # -------------------------------------------------------------------------
    # Additional mechanical accents: front module and exposed pins
    # -------------------------------------------------------------------------
    front_module = rounded_box(8.5 * scale, 9.5 * scale, 7.5 * scale, 0.55 * scale).translate(
        (-7.5 * scale, 0.0, 29.5 * scale)
    )
    add_component(front_module)

    for y_pos in (-3.0 * scale, 3.0 * scale):
        for z_pos in (28.0 * scale, 31.2 * scale):
            add_component(cylinder_axis("x", 1.4 * scale, 1.45 * scale, 0.55 * scale).translate((-12.0 * scale, y_pos, z_pos)))

    # Diagonal small body struts under the torso shell.
    add_component(rod_between((-11.0 * scale, -8.0 * scale, 40.0 * scale), (-1.0 * scale, -8.0 * scale, 31.5 * scale), 0.58 * scale))
    add_component(rod_between((-11.0 * scale, 8.0 * scale, 40.0 * scale), (-1.0 * scale, 8.0 * scale, 31.5 * scale), 0.58 * scale))
    add_component(rod_between((8.0 * scale, -8.0 * scale, 42.0 * scale), (3.0 * scale, -8.0 * scale, 31.0 * scale), 0.58 * scale))
    add_component(rod_between((8.0 * scale, 8.0 * scale, 42.0 * scale), (3.0 * scale, 8.0 * scale, 31.0 * scale), 0.58 * scale))

    # Return a single CadQuery object containing all disconnected mechanical elements.
    final_compound = cq.Compound.makeCompound(component_shapes)
    return cq.Workplane("XY").add(final_compound)


# -----------------------------------------------------------------------------
# Final result
# -----------------------------------------------------------------------------
result = build_robot_model()