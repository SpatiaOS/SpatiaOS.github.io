import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters (millimetres)
# The reference is interpreted as a compact, stylized tracked science-fiction
# tank. X is left/right, -Y is forward, and Z is up.
# ---------------------------------------------------------------------------

# Hull and running gear
hull_width = 64.0
hull_length = 94.0
hull_corner_radius = 2.0
deck_height = 44.0

track_width = 14.0
track_clearance = 2.0
track_radius = 18.5
track_inner_radius = 16.3
wheel_radius = 16.0
wheel_depth = 12.0
wheel_spacing = 61.0
wheel_center_z = 21.0
track_shoe_count = 26
track_shoe_height = 1.7
track_cleat_height = 0.8

side_armor_width = 8.0
side_armor_length = 29.0
side_armor_height = 30.0
side_armor_center_z = 25.0

# Turret
turret_center_y = 5.0
turret_radius = 31.0
turret_base_z = 44.5
turret_equator_z = 55.5
turret_dome_height = 27.5
turret_seam_width = 0.22
panel_groove_width = 0.32
panel_groove_depth = 0.40

# Main cannon
cannon_center_z = 62.0
cannon_mount_radius = 14.8
cannon_mount_length = 5.0
cannon_neck_length = 2.5
cannon_length = 27.0
cannon_root_radius = 11.1
cannon_muzzle_radius = 10.0
cannon_bore_radius = 8.5

# Twin-port turret side housings
pod_center_x = 30.0
pod_center_y = 6.0
pod_center_z = 64.0
pod_width = 12.0
pod_depth = 21.0
pod_height = 24.0
pod_port_spacing = 11.0
pod_port_radius = 3.4

# Roof details
hatch_width = 35.0
hatch_length = 30.0
hatch_base_z = 80.5
hatch_height = 3.0
searchlight_radius = 7.5
searchlight_center_z = 94.0

antenna_length = 51.0
secondary_antenna_length = 32.0
radio_canister_radius = 3.25
radio_canister_height = 17.0

# Raised rotary gun
rotary_mount_center = (35.0, 29.0, 59.0)
rotary_mount_radius = 5.6
rotary_axis_direction = (0.14, 0.33, 0.934)
rotary_barrel_count = 6
rotary_barrel_pitch_radius = 3.3
rotary_barrel_radius = 1.15
rotary_bore_radius = 0.68
rotary_barrel_length = 30.0
rotary_barrel_start = 10.5
rotary_band_radius = 5.1

# Derived dimensions
track_center_x = hull_width / 2.0 + track_clearance + track_width / 2.0
half_wheel_spacing = wheel_spacing / 2.0
track_outer_x = track_center_x + track_width / 2.0
side_armor_center_x = track_outer_x + 1.0
side_armor_outer_x = side_armor_center_x + side_armor_width / 2.0
cannon_axis = (0.0, -1.0, 0.0)
cannon_mount_y = turret_center_y - 28.0
cannon_start_y = cannon_mount_y - cannon_mount_length - cannon_neck_length
cannon_muzzle_y = cannon_start_y - cannon_length

components = []


# ---------------------------------------------------------------------------
# Reusable modeling helpers
# ---------------------------------------------------------------------------

def vector(value):
    """Accept either a tuple or a CadQuery vector."""
    return value if isinstance(value, cq.Vector) else cq.Vector(*value)


def add_component(shape):
    """Keep individual manufactured pieces in the final compound."""
    if isinstance(shape, cq.Workplane):
        components.extend(shape.solids().vals())
    else:
        components.append(shape)


def axis_plane(origin, direction):
    """Construct a stable sketch plane perpendicular to an arbitrary axis."""
    normal = vector(direction).normalized()
    reference = cq.Vector(1, 0, 0)
    if abs(reference.dot(normal)) > 0.95:
        reference = cq.Vector(0, 1, 0)
    x_direction = (reference - normal * reference.dot(normal)).normalized()
    return cq.Plane(
        origin=vector(origin).toTuple(),
        xDir=x_direction.toTuple(),
        normal=normal.toTuple(),
    )


def cylinder(radius, length, origin, direction=(0, 0, 1)):
    return cq.Workplane("XY").newObject([
        cq.Solid.makeCylinder(
            radius, length, vector(origin), vector(direction).normalized()
        )
    ])


def tube(outer_radius, inner_radius, length, origin, direction=(0, 0, 1)):
    return (
        cq.Workplane(axis_plane(origin, direction))
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(length)
    )


def cone(radius_1, radius_2, length, origin, direction=(0, 0, 1)):
    return cq.Workplane("XY").newObject([
        cq.Solid.makeCone(
            radius_1, radius_2, length,
            vector(origin), vector(direction).normalized()
        )
    ])


def rounded_pipe(points, radius, bend_radius):
    """Sweep a circular pipe along straight runs and tangent circular elbows."""
    points = [vector(point) for point in points]
    edges = []
    cursor = points[0]

    for index in range(1, len(points) - 1):
        previous, corner, following = points[index - 1:index + 2]
        incoming = (corner - previous).normalized()
        outgoing = (following - corner).normalized()
        cosine = max(-1.0, min(1.0, incoming.dot(outgoing)))
        turn_angle = math.acos(cosine)

        if turn_angle < 1.0e-6:
            continue

        trim = min(
            bend_radius * math.tan(turn_angle / 2.0),
            0.42 * (corner - previous).Length,
            0.42 * (following - corner).Length,
        )
        actual_radius = trim / math.tan(turn_angle / 2.0)
        arc_start = corner - incoming * trim
        arc_end = corner + outgoing * trim
        bisector = (outgoing - incoming).normalized()
        arc_center = (
            corner
            + bisector * (actual_radius / math.cos(turn_angle / 2.0))
        )
        midpoint_direction = (
            (arc_start - arc_center).normalized()
            + (arc_end - arc_center).normalized()
        ).normalized()
        arc_midpoint = arc_center + midpoint_direction * actual_radius

        if (arc_start - cursor).Length > 1.0e-7:
            edges.append(cq.Edge.makeLine(cursor, arc_start))
        edges.append(cq.Edge.makeThreePointArc(
            arc_start, arc_midpoint, arc_end
        ))
        cursor = arc_end

    if (points[-1] - cursor).Length > 1.0e-7:
        edges.append(cq.Edge.makeLine(cursor, points[-1]))

    path = cq.Wire.assembleEdges(edges)
    profile_plane = axis_plane(points[0], points[1] - points[0])
    return (
        cq.Workplane(profile_plane)
        .circle(radius)
        .sweep(cq.Workplane("XY").newObject([path]), isFrenet=True)
    )


def track_capsule(radius, x_start, width):
    """Extruded stadium profile, with its long direction along Y."""
    return (
        cq.Workplane("YZ", origin=(x_start, 0, wheel_center_z))
        .moveTo(-half_wheel_spacing, radius)
        .lineTo(half_wheel_spacing, radius)
        .threePointArc(
            (half_wheel_spacing + radius, 0),
            (half_wheel_spacing, -radius),
        )
        .lineTo(-half_wheel_spacing, -radius)
        .threePointArc(
            (-half_wheel_spacing - radius, 0),
            (-half_wheel_spacing, radius),
        )
        .close()
        .extrude(width)
    )


def turret_dome(radius, height, base_z):
    """Revolve a smooth elliptical meridian to form the shallow dome."""
    meridian_points = []
    for index in range(1, 17):
        angle = index * math.pi / 32.0
        meridian_points.append((
            radius * math.cos(angle),
            base_z + height * math.sin(angle),
        ))
    meridian_points[-1] = (0.0, base_z + height)

    return (
        cq.Workplane("XZ", origin=(0, turret_center_y, 0))
        .moveTo(0, base_z)
        .lineTo(radius, base_z)
        .spline(meridian_points, includeCurrent=True)
        .close()
        .revolve(360, (0, 0), (0, 1))
    )


def annular_slot(plane, inner_radius, outer_radius, center_angle, span, depth):
    """A curved ventilation opening used in the wheel face plates."""
    a0 = math.radians(center_angle - span / 2.0)
    am = math.radians(center_angle)
    a1 = math.radians(center_angle + span / 2.0)

    def polar(radius, angle):
        return radius * math.cos(angle), radius * math.sin(angle)

    return (
        cq.Workplane(plane)
        .moveTo(*polar(outer_radius, a0))
        .threePointArc(polar(outer_radius, am), polar(outer_radius, a1))
        .lineTo(*polar(inner_radius, a1))
        .threePointArc(polar(inner_radius, am), polar(inner_radius, a0))
        .close()
        .extrude(depth)
    )


# ---------------------------------------------------------------------------
# Main hull: rounded wedge, sloped front armor, bumper teeth, and deck grille
# ---------------------------------------------------------------------------

hull_profile = [
    (-hull_length / 2.0, 19.0),
    (hull_length / 2.0 - 4.0, 19.0),
    (hull_length / 2.0, 30.0),
    (hull_length / 2.0 - 3.0, 39.0),
    (30.0, deck_height),
    (-26.0, deck_height),
    (-43.0, 34.0),
]

hull = (
    cq.Workplane("YZ")
    .polyline(hull_profile)
    .close()
    .extrude(hull_width / 2.0, both=True)
    .edges()
    .fillet(hull_corner_radius)
)
add_component(hull)

# The front armor follows the slope of the hull's glacis.
glacis_angle = math.atan2(10.0, 17.0)
glacis_plane = cq.Plane(
    origin=(0, -35.0, 38.7),
    xDir=(1, 0, 0),
    normal=(0, -math.sin(glacis_angle), math.cos(glacis_angle)),
)
front_armor = (
    cq.Workplane(glacis_plane)
    .box(55.0, 21.0, 1.4, centered=(True, True, False))
    .edges()
    .fillet(0.3)
)
add_component(front_armor)

# Central rectangular latch on the sloping armor.
add_component(
    cq.Workplane(glacis_plane)
    .center(0, -5.0)
    .workplane(offset=1.4)
    .box(6.5, 7.5, 2.3, centered=(True, True, False))
    .edges()
    .chamfer(0.4)
)

add_component(
    cq.Workplane("XY")
    .box(57.0, 3.0, 3.0)
    .translate((0, -46.5, 21.0))
)

for index in range(7):
    add_component(
        cq.Workplane("XY")
        .box(4.2, 3.2, 7.0)
        .edges("|X")
        .chamfer(0.4)
        .translate(((index - 3) * 7.5, -48.0, 19.5))
    )

# Small exposed cooling grille behind the turret.
add_component(
    cq.Workplane("XY")
    .box(24.0, 9.0, 1.0)
    .edges("|Z")
    .fillet(1.0)
    .translate((0, 36.0, 43.0))
)
for index in range(8):
    add_component(
        cq.Workplane("XY")
        .box(1.1, 7.6, 0.8)
        .translate(((index - 3.5) * 2.7, 36.0, 43.9))
    )


# ---------------------------------------------------------------------------
# Track belts, repeated tread shoes, and four large detailed road wheels
# ---------------------------------------------------------------------------

track_perimeter = 2.0 * wheel_spacing + 2.0 * math.pi * track_radius
shoe_pitch = track_perimeter / track_shoe_count
shoe_length = shoe_pitch * 0.77
shoe_width = track_width + 1.8

for side in (-1, 1):
    belt_x_start = side * track_center_x - track_width / 2.0
    belt = track_capsule(track_radius, belt_x_start, track_width)
    belt = belt.cut(
        track_capsule(track_inner_radius, belt_x_start - 0.2, track_width + 0.4)
    )
    add_component(belt)

    # Equally spaced shoes follow the two straight runs and both semicircles.
    for index in range(track_shoe_count):
        distance = (index + 0.5) * shoe_pitch

        if distance < wheel_spacing:
            y = -half_wheel_spacing + distance
            z = wheel_center_z + track_radius
            normal = (0, 0, 1)

        elif distance < wheel_spacing + math.pi * track_radius:
            angle = (distance - wheel_spacing) / track_radius
            y = half_wheel_spacing + track_radius * math.sin(angle)
            z = wheel_center_z + track_radius * math.cos(angle)
            normal = (0, math.sin(angle), math.cos(angle))

        elif distance < 2.0 * wheel_spacing + math.pi * track_radius:
            distance_on_bottom = (
                distance - wheel_spacing - math.pi * track_radius
            )
            y = half_wheel_spacing - distance_on_bottom
            z = wheel_center_z - track_radius
            normal = (0, 0, -1)

        else:
            angle = (
                distance - 2.0 * wheel_spacing - math.pi * track_radius
            ) / track_radius
            y = -half_wheel_spacing - track_radius * math.sin(angle)
            z = wheel_center_z - track_radius * math.cos(angle)
            normal = (0, -math.sin(angle), -math.cos(angle))

        tread_plane = cq.Plane(
            origin=(side * track_center_x, y, z),
            xDir=(1, 0, 0),
            normal=normal,
        )
        shoe = (
            cq.Workplane(tread_plane)
            .box(
                shoe_width, shoe_length, track_shoe_height,
                centered=(True, True, False),
            )
            .edges()
            .chamfer(0.22)
        )

        # Raised chevron ribs give the broad, angular treads in the reference.
        cleat_outline = [
            (-shoe_width / 2.0, -1.8),
            (0, 0.4),
            (shoe_width / 2.0, -1.8),
            (shoe_width / 2.0, -0.2),
            (0, 2.0),
            (-shoe_width / 2.0, -0.2),
        ]
        cleat = (
            cq.Workplane(tread_plane)
            .workplane(offset=track_shoe_height)
            .polyline(cleat_outline)
            .close()
            .extrude(track_cleat_height)
        )
        add_component(shoe.union(cleat))

    for wheel_y in (-half_wheel_spacing, half_wheel_spacing):
        wheel_axis = (side, 0, 0)
        wheel_start_x = side * (track_center_x - wheel_depth / 2.0)
        wheel_face_x = side * (track_center_x + wheel_depth / 2.0)

        wheel = cylinder(
            wheel_radius, wheel_depth,
            (wheel_start_x, wheel_y, wheel_center_z), wheel_axis,
        ).edges().fillet(0.65)
        add_component(wheel)

        face_plane = axis_plane(
            (wheel_face_x, wheel_y, wheel_center_z), wheel_axis
        )
        face_plate = (
            cq.Workplane(face_plane)
            .circle(13.9)
            .circle(1.5)
            .extrude(0.9)
        )
        slot_plane = axis_plane(
            (wheel_face_x - side * 0.1, wheel_y, wheel_center_z),
            wheel_axis,
        )
        for angle in (60, 180, 300):
            face_plate = face_plate.cut(
                annular_slot(slot_plane, 8.6, 11.8, angle, 54.0, 1.2)
            )
        add_component(face_plate)

        add_component(tube(
            15.6, 13.7, 1.1,
            (wheel_face_x, wheel_y, wheel_center_z), wheel_axis,
        ))
        add_component(tube(
            16.0, 15.5, 0.45,
            (wheel_face_x + side * 0.3, wheel_y, wheel_center_z),
            wheel_axis,
        ))

        hub_origin = (wheel_face_x + side * 0.9, wheel_y, wheel_center_z)
        hub = cone(5.4, 4.5, 2.2, hub_origin, wheel_axis)
        hub = hub.cut(cylinder(1.55, 2.6, hub_origin, wheel_axis))
        add_component(hub)
        add_component(tube(
            2.4, 1.5, 0.8,
            (wheel_face_x + side * 3.1, wheel_y, wheel_center_z),
            wheel_axis,
        ))

        bolt_points = [
            (
                10.6 * math.cos(math.radians(angle)),
                10.6 * math.sin(math.radians(angle)),
            )
            for angle in (0, 120, 240)
        ]
        add_component(
            cq.Workplane(axis_plane(
                (wheel_face_x + side * 0.9, wheel_y, wheel_center_z),
                wheel_axis,
            ))
            .pushPoints(bolt_points)
            .polygon(6, 2.4)
            .extrude(0.65)
        )

    # Rounded central side armor conceals the middle of each track run.
    side_armor = (
        cq.Workplane("XY")
        .box(side_armor_width, side_armor_length, side_armor_height)
        .edges("|X")
        .fillet(4.5)
        .translate((
            side * side_armor_center_x, 0, side_armor_center_z
        ))
    )
    add_component(side_armor)

    side_cover = (
        cq.Workplane("XY")
        .box(0.9, side_armor_length - 2.0, side_armor_height - 2.0)
        .edges("|X")
        .fillet(4.0)
        .translate((
            side * (side_armor_outer_x + 0.35),
            0, side_armor_center_z,
        ))
    )
    side_cover = side_cover.cut(
        cq.Workplane("XY")
        .box(2.0, side_armor_length + 2.0, 0.45)
        .translate((
            side * (side_armor_outer_x + 0.35), 0, 24.0
        ))
    )
    add_component(side_cover)

    add_component(rounded_pipe([
        (side * 25.0, -15.0, 44.5),
        (side * 48.0, -15.0, 44.5),
        (side * 52.0, -15.0, 40.5),
        (side * 52.0, -15.0, 13.0),
    ], radius=1.35, bend_radius=3.0))

    # Wide angular front fenders and short hanging mudflaps.
    fender_profile = [
        (-54.0, 33.0), (-54.0, 35.0),
        (-32.0, 42.0), (-26.0, 42.0),
        (-26.0, 40.0), (-32.0, 40.0),
    ]
    add_component(
        cq.Workplane(
            "YZ",
            origin=(side * track_center_x - (track_width + 3.0) / 2.0, 0, 0),
        )
        .polyline(fender_profile)
        .close()
        .extrude(track_width + 3.0)
        .edges("|X")
        .chamfer(0.3)
    )

    add_component(
        cq.Workplane("XY")
        .box(track_width + 3.0, 1.8, 15.0)
        .edges("|X")
        .chamfer(0.3)
        .rotate((0, 0, 0), (1, 0, 0), 18.0)
        .translate((side * track_center_x, -48.0, 12.5))
    )

    add_component(
        cq.Workplane("XY")
        .box(track_width - 1.0, 1.5, 7.0)
        .rotate((0, 0, 0), (1, 0, 0), -12.0)
        .translate((side * track_center_x, 43.0, 44.0))
    )


# ---------------------------------------------------------------------------
# Two rounded, grooved ventilator cowls on the front glacis
# ---------------------------------------------------------------------------

for side in (-1, 1):
    vent = (
        cq.Workplane("XY")
        .box(8.0, 11.0, 6.0, centered=(True, True, False))
        .edges()
        .fillet(2.3)
    )
    for groove_x in (-1.5, 1.5):
        vent = vent.cut(
            cq.Workplane("XY")
            .box(0.32, 12.0, 2.4)
            .translate((groove_x, 0, 5.7))
        )
    for groove_y in (-2.5, 2.5):
        vent = vent.cut(
            cq.Workplane("XY")
            .box(10.0, 0.32, 2.0)
            .translate((0, groove_y, 5.8))
        )

    vent_origin = glacis_plane.toWorldCoords((side * 20.0, 4.0, 1.4))
    add_component(
        vent.rotate(
            (0, 0, 0), (1, 0, 0), math.degrees(glacis_angle)
        ).translate(vent_origin.toTuple())
    )

    pipe_start = glacis_plane.toWorldCoords((side * 20.0, 8.0, 5.0))
    pipe_direction = (0, math.cos(glacis_angle), math.sin(glacis_angle))
    add_component(cylinder(1.4, 7.0, pipe_start, pipe_direction))


# ---------------------------------------------------------------------------
# Rounded turret with equatorial seam and shallow meridional panel grooves
# ---------------------------------------------------------------------------

add_component(
    cq.Workplane("XY", origin=(0, turret_center_y, turret_base_z - 0.8))
    .circle(turret_radius + 0.8)
    .extrude(1.2)
    .edges()
    .fillet(0.25)
)

lower_turret = (
    cq.Workplane("XY", origin=(0, turret_center_y, turret_base_z))
    .circle(turret_radius)
    .extrude(
        turret_equator_z - turret_base_z - turret_seam_width / 2.0
    )
    .edges("<Z")
    .fillet(0.9)
)

dome_base_z = turret_equator_z + turret_seam_width / 2.0
dome = turret_dome(turret_radius, turret_dome_height, dome_base_z)
inner_dome = turret_dome(
    turret_radius - panel_groove_depth,
    turret_dome_height - panel_groove_depth,
    dome_base_z,
)
panel_skin = dome.cut(inner_dome)

for angle in (0, 60, 120):
    groove_plane = (
        cq.Workplane("XY")
        .box(
            panel_groove_width,
            turret_radius * 2.0 + 4.0,
            turret_dome_height + 2.0,
        )
        .translate((
            0, turret_center_y,
            dome_base_z + turret_dome_height / 2.0,
        ))
        .rotate(
            (0, turret_center_y, 0),
            (0, turret_center_y, 1),
            angle,
        )
    )
    dome = dome.cut(panel_skin.intersect(groove_plane))

# The barrel bore continues a short distance into the turret.
cannon_recess = cylinder(
    cannon_bore_radius, 43.0,
    (0, cannon_muzzle_y - 1.0, cannon_center_z),
    (0, 1, 0),
)
add_component(lower_turret.cut(cannon_recess))
add_component(dome.cut(cannon_recess))


# ---------------------------------------------------------------------------
# Short, large-bore main cannon with concentric mantlet and rifled muzzle
# ---------------------------------------------------------------------------

add_component(tube(
    cannon_mount_radius, cannon_bore_radius,
    cannon_mount_length,
    (0, cannon_mount_y, cannon_center_z), cannon_axis,
).edges().fillet(0.4))

add_component(tube(
    11.9, cannon_bore_radius, cannon_neck_length,
    (0, cannon_mount_y - cannon_mount_length, cannon_center_z),
    cannon_axis,
))

main_barrel = cone(
    cannon_root_radius, cannon_muzzle_radius, cannon_length,
    (0, cannon_start_y, cannon_center_z), cannon_axis,
)
main_barrel = main_barrel.cut(cylinder(
    cannon_bore_radius, cannon_length + 0.4,
    (0, cannon_start_y + 0.2, cannon_center_z), cannon_axis,
))
add_component(main_barrel)

add_component(tube(
    cannon_muzzle_radius + 0.25, cannon_bore_radius, 0.9,
    (0, cannon_muzzle_y + 0.5, cannon_center_z), cannon_axis,
))
add_component(tube(
    cannon_bore_radius + 0.35, cannon_bore_radius, 5.0,
    (0, cannon_muzzle_y + 5.0, cannon_center_z), cannon_axis,
))

for index in range(8):
    angle = 2.0 * math.pi * index / 8.0
    add_component(cylinder(
        0.24, 5.2,
        (
            (cannon_bore_radius - 0.05) * math.cos(angle),
            cannon_muzzle_y + 5.0,
            cannon_center_z
            + (cannon_bore_radius - 0.05) * math.sin(angle),
        ),
        cannon_axis,
    ))

# Prominent C-shaped grab handles flanking the cannon.
for side in (-1, 1):
    add_component(rounded_pipe([
        (side * 18.0, -15.0, 69.0),
        (side * 18.0, -25.0, 69.0),
        (side * 18.0, -25.0, 53.0),
        (side * 18.0, -19.0, 53.0),
    ], radius=1.2, bend_radius=3.0))


# ---------------------------------------------------------------------------
# Rounded turret cheek pods, each carrying two recessed circular ports
# ---------------------------------------------------------------------------

pod_front_y = pod_center_y - pod_depth / 2.0

for side in (-1, 1):
    pod_x = side * pod_center_x
    pod = (
        cq.Workplane("XY")
        .box(pod_width, pod_depth, pod_height)
        .edges("|Y")
        .fillet(2.8)
        .translate((pod_x, pod_center_y, pod_center_z))
    )

    front_plate = (
        cq.Workplane(axis_plane(
            (pod_x, pod_front_y, pod_center_z), (0, -1, 0)
        ))
        .rect(pod_width + 0.4, pod_height + 0.4)
        .extrude(1.2)
        .edges("|Y")
        .fillet(2.4)
    )

    for port_offset in (-pod_port_spacing / 2.0, pod_port_spacing / 2.0):
        port_z = pod_center_z + port_offset
        port_cut = cylinder(
            pod_port_radius, 7.0,
            (pod_x, pod_front_y - 1.5, port_z), (0, 1, 0),
        )
        pod = pod.cut(port_cut)
        front_plate = front_plate.cut(port_cut)

        add_component(tube(
            4.55, pod_port_radius, 0.9,
            (pod_x, pod_front_y - 1.2, port_z), (0, -1, 0),
        ))
        add_component(tube(
            3.3, 2.8, 0.6,
            (pod_x, pod_front_y + 0.7, port_z), (0, -1, 0),
        ))

    add_component(pod)
    add_component(front_plate)

    add_component(
        cq.Workplane("XY")
        .box(0.8, pod_depth - 3.0, pod_height - 3.0)
        .edges("|X")
        .fillet(2.5)
        .translate((
            side * (pod_center_x + pod_width / 2.0 + 0.3),
            pod_center_y + 0.5, pod_center_z,
        ))
    )


# ---------------------------------------------------------------------------
# Raised rectangular roof hatch, rails, hinges, and forward-facing searchlight
# ---------------------------------------------------------------------------

hatch_skirt = (
    cq.Workplane("XY", origin=(0, turret_center_y, 75.5))
    .rect(37.0, 32.0)
    .workplane(offset=5.0)
    .rect(31.0, 26.0)
    .loft()
)
add_component(hatch_skirt)

add_component(
    cq.Workplane("XY")
    .box(hatch_width, hatch_length, 1.6, centered=(True, True, False))
    .edges("|Z")
    .fillet(3.2)
    .translate((0, turret_center_y, hatch_base_z))
)
add_component(
    cq.Workplane("XY")
    .box(
        hatch_width - 2.5, hatch_length - 2.5, hatch_height - 1.6,
        centered=(True, True, False),
    )
    .edges("|Z")
    .fillet(3.0)
    .translate((0, turret_center_y, hatch_base_z + 1.6))
)

hatch_top_z = hatch_base_z + hatch_height
for side in (-1, 1):
    add_component(rounded_pipe([
        (side * 12.5, turret_center_y - 9.0, hatch_top_z),
        (side * 12.5, turret_center_y - 9.0, hatch_top_z + 2.2),
        (side * 12.5, turret_center_y + 9.0, hatch_top_z + 2.2),
        (side * 12.5, turret_center_y + 9.0, hatch_top_z),
    ], radius=0.6, bend_radius=1.4))

    add_component(cylinder(
        1.1, 6.0,
        (side * 7.0 - 3.0, turret_center_y + 14.5, hatch_top_z - 0.5),
        (1, 0, 0),
    ))

# Searchlight swivel pedestal.
add_component(cylinder(4.8, 1.5, (0, 4.0, hatch_top_z)))
add_component(cylinder(2.2, 6.0, (0, 4.0, hatch_top_z + 1.5)))
add_component(cylinder(
    3.0, 5.4, (-2.7, 4.0, 89.2), (1, 0, 0)
))

light_housing = cylinder(
    searchlight_radius, 8.5,
    (0, 6.0, searchlight_center_z), (0, -1, 0),
).edges().fillet(0.6)
add_component(light_housing)

# Tapered rear casing and reinforcing band.
add_component(cone(
    5.6, 4.7, 7.0, (0, 6.0, searchlight_center_z), (0, 1, 0)
))
add_component(tube(
    5.55, 4.9, 0.8,
    (0, 10.0, searchlight_center_z), (0, 1, 0),
))
add_component(cylinder(
    4.7, 0.7, (0, 13.0, searchlight_center_z), (0, 1, 0)
))

# Recessed lens and interrupted front bezel reproduce the slotted circular face.
add_component(cylinder(
    6.45, 0.25, (0, -2.6, searchlight_center_z), (0, -1, 0)
))
light_bezel = tube(
    8.0, 6.6, 1.4,
    (0, -2.5, searchlight_center_z), (0, -1, 0),
)
bezel_slot = (
    cq.Workplane("XY")
    .box(19.0, 2.0, 2.0)
    .translate((0, -3.6, searchlight_center_z))
)
add_component(light_bezel.cut(bezel_slot))

light_face = cylinder(
    6.4, 0.35,
    (0, -3.2, searchlight_center_z), (0, -1, 0),
)
add_component(light_face.cut(bezel_slot))


# ---------------------------------------------------------------------------
# Rear radio plinth, ribbed vertical canister, and two long whip antennas
# ---------------------------------------------------------------------------

add_component(
    cq.Workplane("XY", origin=(-7.0, 26.0, 77.5))
    .rect(13.0, 12.0)
    .workplane(offset=10.0)
    .center(0, 2.0)
    .rect(7.0, 7.0)
    .loft()
)

canister_x, canister_y, canister_z = -14.0, 26.0, 85.5
add_component(cylinder(
    radio_canister_radius, radio_canister_height,
    (canister_x, canister_y, canister_z),
))
for index in range(8):
    angle = 2.0 * math.pi * index / 8.0
    add_component(cylinder(
        0.38, radio_canister_height,
        (
            canister_x + radio_canister_radius * math.cos(angle),
            canister_y + radio_canister_radius * math.sin(angle),
            canister_z,
        ),
    ))

for z in (canister_z - 0.2, canister_z + radio_canister_height - 0.8):
    add_component(cylinder(
        3.85, 1.3, (canister_x, canister_y, z)
    ))

canister_cap_z = canister_z + radio_canister_height + 0.5
canister_cap = cylinder(
    3.8, 0.9, (canister_x, canister_y, canister_cap_z)
)
for index in range(6):
    angle = 2.0 * math.pi * index / 6.0
    canister_cap = canister_cap.cut(cylinder(
        0.58, 1.2,
        (
            canister_x + 2.3 * math.cos(angle),
            canister_y + 2.3 * math.sin(angle),
            canister_cap_z - 0.1,
        ),
    ))
add_component(canister_cap)

antenna_specs = [
    ((-6.0, 28.0, 87.0), (0.13, 0.26, 0.957), antenna_length, 0.48),
    ((-10.0, 26.0, 85.0), (0.02, 0.49, 0.871), secondary_antenna_length, 0.28),
]
for origin, direction, length, root_radius in antenna_specs:
    axis = vector(direction).normalized()
    add_component(cylinder(1.0, 3.2, origin, axis))
    add_component(cone(
        root_radius, root_radius * 0.65, length, origin, axis
    ))
    tip = vector(origin) + axis * length
    add_component(
        cq.Workplane("XY")
        .sphere(root_radius * 1.45)
        .translate(tip.toTuple())
    )


# ---------------------------------------------------------------------------
# Two auxiliary exhaust/launcher tubes behind the right side of the turret
# ---------------------------------------------------------------------------

large_pipe_origin = cq.Vector(17.0, 27.0, 58.0)
large_pipe_axis = cq.Vector(0.05, 0.48, 0.876).normalized()

add_component(cylinder(3.5, 3.0, large_pipe_origin, large_pipe_axis))
add_component(tube(
    2.85, 1.8, 23.0,
    large_pipe_origin + large_pipe_axis * 2.0, large_pipe_axis,
))
add_component(tube(
    3.2, 1.8, 0.85,
    large_pipe_origin + large_pipe_axis * 24.3, large_pipe_axis,
))

small_pipe_origin = cq.Vector(26.0, 27.0, 56.0)
small_pipe_axis = cq.Vector(0, 0.22, 0.975).normalized()
add_component(cylinder(2.7, 18.0, small_pipe_origin, small_pipe_axis))
small_pipe_top = small_pipe_origin + small_pipe_axis * 18.0
add_component(tube(3.1, 2.1, 0.9, small_pipe_top, small_pipe_axis))
add_component(rounded_pipe([
    small_pipe_top.toTuple(),
    (26.0, 33.5, 81.0),
    (26.0, 39.0, 83.0),
], radius=0.65, bend_radius=0.9))


# ---------------------------------------------------------------------------
# Ball-mounted six-barrel rotary gun, angled upward and toward the rear
# ---------------------------------------------------------------------------

rotary_center = vector(rotary_mount_center)
rotary_axis = vector(rotary_axis_direction).normalized()
rotary_plane = axis_plane(rotary_center, rotary_axis)
rotary_u = rotary_plane.xDir
rotary_v = rotary_plane.yDir

support_start = cq.Vector(32.5, 26.5, 47.5)
support_vector = rotary_center - support_start
add_component(cylinder(
    3.2, support_vector.Length, support_start, support_vector
))
add_component(cylinder(
    4.0, 2.0, support_start, support_vector
))
add_component(
    cq.Workplane("XY")
    .sphere(rotary_mount_radius)
    .translate(rotary_center.toTuple())
)

add_component(cylinder(
    4.3, 8.0, rotary_center + rotary_axis * 4.5, rotary_axis
))
add_component(tube(
    4.9, 4.1, 1.8, rotary_center + rotary_axis * 8.5, rotary_axis
))

# Central spindle and the six individually hollow barrels.
add_component(cylinder(
    1.15, rotary_barrel_length - 1.0,
    rotary_center + rotary_axis * rotary_barrel_start, rotary_axis,
))

barrel_offsets = []
for index in range(rotary_barrel_count):
    angle = 2.0 * math.pi * index / rotary_barrel_count
    offset = (
        rotary_u * (rotary_barrel_pitch_radius * math.cos(angle))
        + rotary_v * (rotary_barrel_pitch_radius * math.sin(angle))
    )
    barrel_offsets.append(offset)
    add_component(tube(
        rotary_barrel_radius,
        rotary_bore_radius,
        rotary_barrel_length,
        rotary_center + rotary_axis * rotary_barrel_start + offset,
        rotary_axis,
    ))

# Clamp hoops around the bundle.
for distance, band_length in ((10.0, 2.0), (24.0, 1.5), (37.5, 1.6)):
    add_component(tube(
        rotary_band_radius, 4.15, band_length,
        rotary_center + rotary_axis * distance, rotary_axis,
    ))

# Perforated muzzle plate; tube ends remain slightly proud of its front face.
muzzle_plate_origin = rotary_center + rotary_axis * 38.7
rotary_muzzle_plate = cylinder(
    rotary_band_radius, 1.5, muzzle_plate_origin, rotary_axis
)
for offset in barrel_offsets:
    rotary_muzzle_plate = rotary_muzzle_plate.cut(cylinder(
        rotary_barrel_radius + 0.06, 1.9,
        muzzle_plate_origin - rotary_axis * 0.2 + offset,
        rotary_axis,
    ))
rotary_muzzle_plate = rotary_muzzle_plate.cut(cylinder(
    0.8, 1.9, muzzle_plate_origin - rotary_axis * 0.2, rotary_axis
))
add_component(rotary_muzzle_plate)

add_component(tube(
    1.35, 0.8, 0.55,
    rotary_center + rotary_axis * 40.15, rotary_axis,
))


# ---------------------------------------------------------------------------
# Final multi-part CAD model
# A compound preserves the intentional seams, open bores, and separate wheels.
# ---------------------------------------------------------------------------

result = cq.Workplane("XY").newObject([
    cq.Compound.makeCompound(components)
])