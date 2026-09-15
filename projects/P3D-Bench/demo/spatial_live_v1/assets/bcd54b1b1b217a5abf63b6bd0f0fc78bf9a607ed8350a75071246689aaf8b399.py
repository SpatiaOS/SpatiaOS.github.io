import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters (millimetres)
# ---------------------------------------------------------------------------
# Interpretation: an exposed, hand-operated planetary gear demonstrator.
# The image supplies no dimensions, so the proportions are estimated.
# The gears lie in the XZ plane; their common shaft runs along Y.
# Negative Y is the front, where the three crank handles are located.

gear_module = 2.2
pressure_angle_deg = 20.0
ring_tooth_count = 108
sun_tooth_count = 72
planet_count = 3
planet_tooth_count = (ring_tooth_count - sun_tooth_count) // 2
gear_backlash = 0.12
involute_samples = 4

shaft_height = 154.0
shaft_radius = 8.5
shaft_front_y = -170.0
shaft_rear_y = 56.0

ring_outer_radius = 134.0
ring_front_y = 0.0
ring_width = 22.0
ring_edge_chamfer = 0.6

gear_front_y = 4.5
gear_width = 14.0
sun_hub_radius = 18.0
sun_spoke_count = 6
sun_window_inner_radius = 23.0
sun_window_angle_deg = 44.0
sun_rim_thickness = 8.0

planet_pin_radius = 3.4
planet_bore_radius = 3.7
planet_hub_radius = 6.0
planet_lightening_hole_radius = 2.2

carrier_start_angle_deg = 90.0
carrier_front_y = -8.0
carrier_rear_y = 23.0
carrier_thickness = 5.0
carrier_arm_width = 8.0
carrier_hub_radius = 19.5
carrier_eye_radius = 7.5

stand_width = 184.0
stand_thickness = 8.0
stand_front_y = -65.0
stand_rear_y = 36.0
base_front_y = -77.0
base_rear_y = 56.0
base_height = 8.0
base_rail_width = 14.0

bearing_radius = 18.0
bearing_front_y = -111.0
bearing_length = 65.0
bearing_flange_radius = 20.5

crank_thickness = 6.0
crank_hub_radius = 16.0
diagonal_crank_y = -119.0
diagonal_crank_length = 265.0
diagonal_crank_angle_deg = 128.0
upright_crank_y = -136.0
upright_crank_length = 215.0
upright_crank_angle_deg = 92.0
short_crank_y = -158.0
short_crank_length = 82.0
short_crank_angle_deg = 24.0

long_grip_length = 42.0
short_grip_length = 35.0
grip_pin_radius = 3.0
grip_edge_radius = 0.7

# Derived gear dimensions.
sun_pitch_radius = gear_module * sun_tooth_count / 2.0
planet_pitch_radius = gear_module * planet_tooth_count / 2.0
ring_pitch_radius = gear_module * ring_tooth_count / 2.0
planet_orbit_radius = sun_pitch_radius + planet_pitch_radius
sun_root_radius = sun_pitch_radius - 1.25 * gear_module
sun_window_outer_radius = sun_root_radius - sun_rim_thickness

assert ring_tooth_count == sun_tooth_count + 2 * planet_tooth_count
assert (ring_tooth_count + sun_tooth_count) % planet_count == 0

components = []


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------
def xz_workplane(y):
    """Local coordinates are X and Z; negative extrusion travels toward +Y."""
    return cq.Workplane("XZ", origin=(0, y, 0))


def extrude_xz_outline(points, y, thickness):
    return (
        xz_workplane(y)
        .polyline(points)
        .close()
        .extrude(-thickness)
        .val()
    )


def cylinder_y(radius, y, length, x=0.0, z=shaft_height):
    return cq.Solid.makeCylinder(
        radius, length, cq.Vector(x, y, z), cq.Vector(0, 1, 0)
    )


def annulus_y(outer_radius, inner_radius, y, length, x=0.0, z=shaft_height):
    return (
        xz_workplane(y)
        .moveTo(x, z)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(-length)
        .val()
    )


def cylinder_z(radius, z, length, x, y):
    return cq.Solid.makeCylinder(
        radius, length, cq.Vector(x, y, z), cq.Vector(0, 0, 1)
    )


def rectangular_block(length_x, length_y, height, center):
    return (
        cq.Workplane("XY")
        .box(length_x, length_y, height)
        .translate(center)
        .val()
    )


def hex_fastener_y(x, z, y, thickness, corner_diameter, bore_radius=0.0):
    fastener = (
        xz_workplane(y)
        .moveTo(x, z)
        .polygon(6, corner_diameter)
        .extrude(-thickness)
        .val()
    )
    if bore_radius > 0:
        fastener = fastener.cut(
            cylinder_y(bore_radius, y - 0.1, thickness + 0.2, x, z)
        )
    return fastener


def rounded_link(start, end, width, y, thickness):
    dx = end[0] - start[0]
    dz = end[1] - start[1]
    distance = math.hypot(dx, dz)
    angle = math.degrees(math.atan2(dz, dx))
    return (
        xz_workplane(y)
        .center((start[0] + end[0]) / 2, (start[1] + end[1]) / 2)
        .slot2D(distance + width, width, angle)
        .extrude(-thickness)
        .val()
    )


def annular_window(inner_radius, outer_radius, start_deg, end_deg, y, depth):
    """A curved opening between two radial spokes."""
    start = math.radians(start_deg)
    end = math.radians(end_deg)
    middle = (start + end) / 2

    def polar(radius, angle):
        return radius * math.cos(angle), radius * math.sin(angle)

    return (
        cq.Workplane("XZ", origin=(0, y, shaft_height))
        .moveTo(*polar(inner_radius, start))
        .lineTo(*polar(outer_radius, start))
        .threePointArc(polar(outer_radius, middle), polar(outer_radius, end))
        .lineTo(*polar(inner_radius, end))
        .threePointArc(polar(inner_radius, middle), polar(inner_radius, start))
        .close()
        .extrude(-depth)
        .val()
    )


def gear_outline(
    tooth_count,
    pitch_radius,
    root_radius,
    tip_radius,
    phase_deg=0.0,
    center_x=0.0,
    center_z=shaft_height,
    thickness_delta=-gear_backlash,
):
    """Sample involute flanks into one closed, non-self-intersecting profile.

    For the internal ring, this profile describes the tooth-space cutter.
    Its radial limits and backlash sign are therefore reversed.
    """
    pressure_angle = math.radians(pressure_angle_deg)
    base_radius = pitch_radius * math.cos(pressure_angle)
    involute_at_pitch = math.tan(pressure_angle) - pressure_angle
    angular_pitch = 2 * math.pi / tooth_count
    half_pitch_thickness = (
        math.pi / (2 * tooth_count) + thickness_delta / (2 * pitch_radius)
    )
    flank_start_radius = max(root_radius, base_radius)
    phase = math.radians(phase_deg)
    points = []

    def half_tooth_angle(radius):
        tangent = math.sqrt(max((radius / base_radius) ** 2 - 1, 0.0))
        involute = tangent - math.atan(tangent)
        return half_pitch_thickness + involute_at_pitch - involute

    def append_point(radius, angle):
        point = (
            center_x + radius * math.cos(angle),
            center_z + radius * math.sin(angle),
        )
        if not points or math.hypot(
            point[0] - points[-1][0], point[1] - points[-1][1]
        ) > 1.0e-8:
            points.append(point)

    flank_radii = [
        flank_start_radius
        + (tip_radius - flank_start_radius) * i / involute_samples
        for i in range(involute_samples + 1)
    ]

    for tooth_index in range(tooth_count):
        center_angle = phase + tooth_index * angular_pitch
        root_half_angle = half_tooth_angle(flank_start_radius)
        tip_half_angle = half_tooth_angle(tip_radius)

        append_point(root_radius, center_angle - angular_pitch / 2)
        append_point(root_radius, center_angle - root_half_angle)

        for radius in flank_radii:
            append_point(radius, center_angle - half_tooth_angle(radius))

        for step in range(1, 4):
            append_point(
                tip_radius,
                center_angle - tip_half_angle + 2 * tip_half_angle * step / 3,
            )

        for radius in reversed(flank_radii[:-1]):
            append_point(radius, center_angle + half_tooth_angle(radius))

        append_point(root_radius, center_angle + root_half_angle)

    return points


# ---------------------------------------------------------------------------
# Large internal-toothed outer wheel
# ---------------------------------------------------------------------------
sun_phase_deg = 0.0
ring_space_phase_deg = (
    (ring_tooth_count + sun_tooth_count) * carrier_start_angle_deg
    + planet_tooth_count * 180.0
    - sun_tooth_count * sun_phase_deg
    - 180.0
) / ring_tooth_count

ring_blank = (
    cq.Workplane("XZ", origin=(0, ring_front_y, shaft_height))
    .circle(ring_outer_radius)
    .extrude(-ring_width)
    .edges("%CIRCLE")
    .chamfer(ring_edge_chamfer)
    .val()
)

ring_space_outline = gear_outline(
    ring_tooth_count,
    ring_pitch_radius,
    ring_pitch_radius - gear_module,
    ring_pitch_radius + 1.25 * gear_module,
    phase_deg=ring_space_phase_deg,
    thickness_delta=gear_backlash,
)
ring_cutter = extrude_xz_outline(
    ring_space_outline, ring_front_y - 1.0, ring_width + 2.0
)
components.append(ring_blank.cut(ring_cutter))


# ---------------------------------------------------------------------------
# Large, six-spoked sun gear
# ---------------------------------------------------------------------------
sun_outline = gear_outline(
    sun_tooth_count,
    sun_pitch_radius,
    sun_root_radius,
    sun_pitch_radius + gear_module,
    phase_deg=sun_phase_deg,
)
sun_gear = extrude_xz_outline(sun_outline, gear_front_y, gear_width)
sun_gear = sun_gear.fuse(
    cylinder_y(sun_hub_radius, gear_front_y - 3.0, gear_width + 6.0)
)

sun_cutters = [
    cylinder_y(shaft_radius + 0.25, gear_front_y - 4.0, gear_width + 8.0)
]
for window_index in range(sun_spoke_count):
    window_center = (window_index + 0.5) * 360.0 / sun_spoke_count
    sun_cutters.append(
        annular_window(
            sun_window_inner_radius,
            sun_window_outer_radius,
            window_center - sun_window_angle_deg / 2,
            window_center + sun_window_angle_deg / 2,
            gear_front_y - 1.0,
            gear_width + 2.0,
        )
    )
components.append(sun_gear.cut(*sun_cutters))


# ---------------------------------------------------------------------------
# Three planet pinions, evenly spaced around the sun
# ---------------------------------------------------------------------------
planet_centers = []

for planet_index in range(planet_count):
    orbit_angle_deg = (
        carrier_start_angle_deg + planet_index * 360.0 / planet_count
    )
    orbit_angle = math.radians(orbit_angle_deg)
    planet_x = planet_orbit_radius * math.cos(orbit_angle)
    planet_z = shaft_height + planet_orbit_radius * math.sin(orbit_angle)
    planet_centers.append((planet_x, planet_z))

    # Tooth phase satisfies the external sun/planet mesh.
    planet_phase_deg = (
        (sun_tooth_count + planet_tooth_count) * orbit_angle_deg
        + planet_tooth_count * 180.0
        - sun_tooth_count * sun_phase_deg
        - 180.0
    ) / planet_tooth_count

    outline = gear_outline(
        planet_tooth_count,
        planet_pitch_radius,
        planet_pitch_radius - 1.25 * gear_module,
        planet_pitch_radius + gear_module,
        phase_deg=planet_phase_deg,
        center_x=planet_x,
        center_z=planet_z,
    )
    pinion = extrude_xz_outline(outline, gear_front_y, gear_width)
    pinion = pinion.fuse(
        cylinder_y(
            planet_hub_radius,
            gear_front_y - 1.5,
            gear_width + 3.0,
            planet_x,
            planet_z,
        )
    )

    pinion_cutters = [
        cylinder_y(
            planet_bore_radius,
            gear_front_y - 2.0,
            gear_width + 4.0,
            planet_x,
            planet_z,
        )
    ]
    for hole_index in range(3):
        hole_angle = math.radians(planet_phase_deg + hole_index * 120.0)
        pinion_cutters.append(
            cylinder_y(
                planet_lightening_hole_radius,
                gear_front_y - 0.5,
                gear_width + 1.0,
                planet_x + 10.5 * math.cos(hole_angle),
                planet_z + 10.5 * math.sin(hole_angle),
            )
        )
    components.append(pinion.cut(*pinion_cutters))


# ---------------------------------------------------------------------------
# Narrow front and rear carrier spiders, pins, and exposed fasteners
# ---------------------------------------------------------------------------
def make_carrier(y):
    carrier = cylinder_y(
        carrier_hub_radius, y - 1.0, carrier_thickness + 2.0
    )

    for center in planet_centers:
        carrier = carrier.fuse(
            rounded_link(
                (0.0, shaft_height),
                center,
                carrier_arm_width,
                y,
                carrier_thickness,
            ),
            cylinder_y(
                carrier_eye_radius,
                y - 1.0,
                carrier_thickness + 2.0,
                center[0],
                center[1],
            ),
        )

    holes = [
        cylinder_y(shaft_radius + 0.5, y - 2.0, carrier_thickness + 4.0)
    ]
    holes.extend(
        cylinder_y(
            planet_bore_radius, y - 2.0, carrier_thickness + 4.0, x, z
        )
        for x, z in planet_centers
    )
    return carrier.cut(*holes)


front_carrier = make_carrier(carrier_front_y)
front_carrier = front_carrier.fuse(
    annulus_y(carrier_hub_radius, shaft_radius + 0.5, -24.0, 16.0)
)
components.extend([front_carrier, make_carrier(carrier_rear_y)])

for planet_x, planet_z in planet_centers:
    components.append(
        cylinder_y(planet_pin_radius, -13.0, 45.0, planet_x, planet_z)
    )
    for washer_y, washer_length in [(-12.0, 3.0), (29.0, 1.5)]:
        components.append(
            annulus_y(
                6.2, 3.6, washer_y, washer_length, planet_x, planet_z
            )
        )
    for spacer_y, spacer_length in [(-2.0, 5.0), (20.0, 2.0)]:
        components.append(
            annulus_y(
                5.5, 3.6, spacer_y, spacer_length, planet_x, planet_z
            )
        )
    components.extend(
        [
            hex_fastener_y(planet_x, planet_z, -15.0, 3.0, 9.5),
            hex_fastener_y(planet_x, planet_z, 30.5, 2.5, 9.0),
        ]
    )


# ---------------------------------------------------------------------------
# Triangular front cheek and open rear A-frame
# ---------------------------------------------------------------------------
def make_stand_cheek(y, open_center=False):
    cheek = (
        xz_workplane(y)
        .moveTo(-stand_width / 2, base_height)
        .lineTo(stand_width / 2, base_height)
        .lineTo(bearing_radius, shaft_height)
        .threePointArc(
            (0, shaft_height + bearing_radius),
            (-bearing_radius, shaft_height),
        )
        .close()
        .extrude(-stand_thickness)
        .val()
    )
    cheek = cheek.cut(
        cylinder_y(shaft_radius + 0.4, y - 1.0, stand_thickness + 2.0)
    )

    if open_center:
        triangular_opening = [
            (-stand_width / 2 + 23.0, base_height + 17.0),
            (stand_width / 2 - 23.0, base_height + 17.0),
            (0.0, shaft_height - 30.0),
        ]
        cheek = cheek.cut(
            extrude_xz_outline(
                triangular_opening, y - 1.0, stand_thickness + 2.0
            )
        )
    return cheek


components.extend(
    [
        make_stand_cheek(stand_front_y),
        make_stand_cheek(stand_rear_y, open_center=True),
    ]
)

# Low rectangular skid frame beneath the two cheeks.
base_length = base_rear_y - base_front_y
base_center_y = (base_rear_y + base_front_y) / 2
base_members = []

for side in (-1, 1):
    rail = (
        cq.Workplane("XY")
        .box(base_rail_width, base_length, base_height)
        .edges("|Y")
        .chamfer(0.8)
        .translate(
            (side * stand_width / 2, base_center_y, base_height / 2)
        )
        .val()
    )
    base_members.append(rail)

for cheek_y in (stand_front_y, stand_rear_y):
    base_members.append(
        rectangular_block(
            stand_width + base_rail_width,
            10.0,
            base_height,
            (0.0, cheek_y + stand_thickness / 2, base_height / 2),
        )
    )

base_frame = base_members[0].fuse(*base_members[1:])
foot_bolt_positions = [
    (side * stand_width / 2, y)
    for side in (-1, 1)
    for y in (base_front_y + 6.0, base_rear_y - 6.0)
]
base_frame = base_frame.cut(
    *[
        cylinder_z(2.6, -1.0, base_height + 2.0, x, y)
        for x, y in foot_bolt_positions
    ]
)
components.append(base_frame)

for bolt_x, bolt_y in foot_bolt_positions:
    washer = (
        cq.Workplane("XY", origin=(bolt_x, bolt_y, base_height))
        .circle(5.0)
        .circle(2.6)
        .extrude(1.0)
        .val()
    )
    bolt_head = (
        cq.Workplane("XY", origin=(bolt_x, bolt_y, base_height + 1.0))
        .polygon(6, 8.5)
        .extrude(3.0)
        .val()
    )
    components.extend([washer, bolt_head])


# ---------------------------------------------------------------------------
# Long shaft, cylindrical bearing housings, collars, and oil cup
# ---------------------------------------------------------------------------
main_shaft = cylinder_y(
    shaft_radius, shaft_front_y, shaft_rear_y - shaft_front_y
)
# A recessed axial hole reproduces the dark circular center at the front tip.
main_shaft = main_shaft.cut(
    cylinder_y(4.5, shaft_front_y - 0.1, 13.0)
)
components.append(main_shaft)

front_bearing = annulus_y(
    bearing_radius, shaft_radius + 0.25, bearing_front_y, bearing_length
)
for flange_y in (
    bearing_front_y,
    bearing_front_y + bearing_length - 4.0,
):
    front_bearing = front_bearing.fuse(
        annulus_y(
            bearing_flange_radius, shaft_radius + 0.25, flange_y, 4.0
        )
    )
components.append(front_bearing)

rear_bearing = annulus_y(15.0, shaft_radius + 0.25, 32.0, 17.0)
rear_bearing = rear_bearing.fuse(
    annulus_y(18.0, shaft_radius + 0.25, 40.0, 5.0)
)
components.append(rear_bearing)

for outer_radius, collar_y, collar_length in [
    (13.5, -169.0, 9.0),
    (12.0, -150.0, 12.0),
    (13.5, -128.0, 7.0),
    (13.5, -46.0, 18.0),
    (11.0, -2.0, 3.5),
    (11.0, 29.0, 3.0),
    (12.0, 49.0, 2.0),
]:
    components.append(
        annulus_y(
            outer_radius,
            shaft_radius + 0.25,
            collar_y,
            collar_length,
        )
    )

components.extend(
    [
        hex_fastener_y(
            0.0, shaft_height, -28.0, 4.0, 27.0, shaft_radius + 0.25
        ),
        hex_fastener_y(
            0.0, shaft_height, 51.0, 5.0, 25.0, shaft_radius + 0.25
        ),
    ]
)

oil_cup_y = bearing_front_y + bearing_length - 9.0
oil_cup_base_z = shaft_height + bearing_radius
oil_cup = cylinder_z(2.5, oil_cup_base_z - 1.0, 5.0, 0.0, oil_cup_y)
oil_cup = oil_cup.fuse(
    cylinder_z(5.2, oil_cup_base_z + 3.5, 5.0, 0.0, oil_cup_y),
    cylinder_z(5.8, oil_cup_base_z + 8.0, 1.5, 0.0, oil_cup_y),
)
components.append(oil_cup)


# ---------------------------------------------------------------------------
# Three flat crank levers with projecting cylindrical hand grips
# ---------------------------------------------------------------------------
def make_crank(y, length, angle_deg, width, grip_radius, grip_length, slot=False):
    angle = math.radians(angle_deg)
    direction = (math.cos(angle), math.sin(angle))
    normal = (-direction[1], direction[0])

    def arm_point(distance, transverse):
        return (
            direction[0] * distance + normal[0] * transverse,
            shaft_height + direction[1] * distance + normal[1] * transverse,
        )

    # Square-ended strip, with a circular boss at the shaft.
    arm_outline = [
        arm_point(-5.0, -width / 2),
        arm_point(length + 7.0, -width / 2),
        arm_point(length + 7.0, width / 2),
        arm_point(-5.0, width / 2),
    ]
    crank = extrude_xz_outline(arm_outline, y, crank_thickness)
    crank = crank.fuse(
        cylinder_y(crank_hub_radius, y - 2.0, crank_thickness + 4.0)
    )

    grip_x, grip_z = arm_point(length, 0.0)
    crank_cutters = [
        cylinder_y(shaft_radius + 0.25, y - 3.0, crank_thickness + 6.0),
        cylinder_y(
            grip_pin_radius + 0.2,
            y - 1.0,
            crank_thickness + 2.0,
            grip_x,
            grip_z,
        ),
    ]

    if slot:
        # Small square pierced detail, visible on the original flat levers.
        slot_distance = 0.18 * length if length > 150.0 else length - 15.0
        square = [
            arm_point(slot_distance - 2.5, -2.5),
            arm_point(slot_distance + 2.5, -2.5),
            arm_point(slot_distance + 2.5, 2.5),
            arm_point(slot_distance - 2.5, 2.5),
        ]
        crank_cutters.append(
            extrude_xz_outline(square, y - 0.5, crank_thickness + 1.0)
        )

    components.append(crank.cut(*crank_cutters))

    # Each grip projects toward the observer, parallel to the main shaft.
    grip_front_y = y - grip_length - 6.0
    grip = (
        cq.Workplane("XZ", origin=(grip_x, grip_front_y, grip_z))
        .circle(grip_radius)
        .extrude(-grip_length)
        .edges("%CIRCLE")
        .fillet(grip_edge_radius)
        .val()
    )
    grip = grip.cut(
        cylinder_y(
            grip_pin_radius + 0.15,
            grip_front_y + 2.0,
            grip_length,
            grip_x,
            grip_z,
        )
    )
    if slot:
        grip = grip.cut(
            cylinder_y(
                grip_radius - 1.5,
                grip_front_y - 0.1,
                1.6,
                grip_x,
                grip_z,
            )
        )

    grip_pin_start = grip_front_y + 2.5
    components.extend(
        [
            grip,
            cylinder_y(
                grip_pin_radius,
                grip_pin_start,
                y + crank_thickness + 1.0 - grip_pin_start,
                grip_x,
                grip_z,
            ),
            annulus_y(
                grip_radius + 1.0,
                grip_pin_radius + 0.2,
                y - 5.0,
                3.0,
                grip_x,
                grip_z,
            ),
            hex_fastener_y(
                grip_x,
                grip_z,
                y + crank_thickness,
                2.5,
                8.5,
                grip_pin_radius,
            ),
        ]
    )


make_crank(
    diagonal_crank_y,
    diagonal_crank_length,
    diagonal_crank_angle_deg,
    11.0,
    6.0,
    long_grip_length,
)
make_crank(
    upright_crank_y,
    upright_crank_length,
    upright_crank_angle_deg,
    11.0,
    7.0,
    long_grip_length,
    slot=True,
)
make_crank(
    short_crank_y,
    short_crank_length,
    short_crank_angle_deg,
    12.0,
    6.0,
    short_grip_length,
    slot=True,
)

# Preserve the separate mechanical parts rather than fusing moving gears,
# bearings, and fasteners into a single solid.
result = cq.Workplane("XY").newObject([cq.Compound.makeCompound(components)])