import math
import cadquery as cq

# Parameters
pose_rotation_degrees = -14.0

seam_radius = 0.85
spine_seam_radius = 1.05

eye_recess_radius = 5.0
eye_bead_radius = 1.65

nose_radius = 2.30
nose_depth = 2.06

ear_base_radius = 7.0

claw_base_radius = 1.25
claw_tip_radius = 0.08
claw_length = 7.0
claw_drop = 0.8


# Vector helpers
def _add(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _scale(v, s):
    return (v[0] * s, v[1] * s, v[2] * s)


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _length(v):
    return math.sqrt(_dot(v, v))


def _normalize(v):
    magnitude = _length(v)
    if magnitude < 1e-9:
        return (1.0, 0.0, 0.0)
    return (v[0] / magnitude, v[1] / magnitude, v[2] / magnitude)


def _perpendicular_x_direction(normal, hint):
    """Project a preferred local X direction into a plane perpendicular to normal."""
    normal_unit = _normalize(normal)
    hint_unit = _normalize(hint)
    projected = _sub(hint_unit, _scale(normal_unit, _dot(hint_unit, normal_unit)))

    if _length(projected) < 1e-6:
        fallback = (0.0, 0.0, 1.0) if abs(normal_unit[2]) < 0.9 else (0.0, 1.0, 0.0)
        projected = _sub(fallback, _scale(normal_unit, _dot(fallback, normal_unit)))

    return _normalize(projected)


# Geometry helpers
def make_ellipse_wire(center, normal, radius_x, radius_y, x_direction):
    plane = cq.Plane(
        origin=cq.Vector(*center),
        xDir=cq.Vector(*x_direction),
        normal=cq.Vector(*normal),
    )
    return cq.Workplane(plane).ellipse(radius_x, radius_y).val()


def make_lofted_tube(section_specs, xdir_hint=(0.0, 1.0, 0.0), ruled=False):
    """Create a soft organic solid through elliptical cross sections."""
    centers = [section[0] for section in section_specs]
    wires = []

    for index, (center, radius_x, radius_y) in enumerate(section_specs):
        if index == 0:
            tangent = _sub(centers[1], centers[0])
        elif index == len(section_specs) - 1:
            tangent = _sub(centers[-1], centers[-2])
        else:
            tangent = _sub(centers[index + 1], centers[index - 1])

        tangent = _normalize(tangent)
        x_direction = _perpendicular_x_direction(tangent, xdir_hint)
        wires.append(make_ellipse_wire(center, tangent, radius_x, radius_y, x_direction))

    return cq.Solid.makeLoft(wires, ruled)


def make_rib_line(points, radius):
    """Raised freeform seam line used to suggest the segmented sculptural shell."""
    return make_lofted_tube(
        [(point, radius, radius) for point in points],
        xdir_hint=(0.0, 0.0, 1.0),
        ruled=True,
    )


def make_spike(base_point, tip_point, base_radius, tip_radius=0.15):
    direction = _sub(tip_point, base_point)
    height = _length(direction)
    return cq.Solid.makeCone(
        base_radius,
        tip_radius,
        height,
        pnt=cq.Vector(*base_point),
        dir=cq.Vector(*_normalize(direction)),
    )


def make_sphere(center, radius):
    return cq.Solid.makeSphere(radius, pnt=cq.Vector(*center))


def make_triangular_fin(center_x, center_y, base_z, length, height, thickness, apex_bias=0.0):
    """Vertical triangular prism used for stylized dorsal and throat facets."""
    fin = (
        cq.Workplane("XZ")
        .polyline(
            [
                (-length / 2.0, 0.0),
                (length / 2.0, 0.0),
                (apex_bias * length, height),
            ]
        )
        .close()
        .extrude(thickness / 2.0, both=True)
        .val()
    )
    return fin.translate((center_x, center_y, base_z))


def make_claws(toe_center, forward_vector, spread_width, count=3):
    direction = _normalize(forward_vector)
    side_direction = _perpendicular_x_direction(direction, (0.0, 1.0, 0.0))

    if count == 1:
        offsets = [0.0]
    else:
        offsets = [
            -spread_width / 2.0 + index * spread_width / (count - 1)
            for index in range(count)
        ]

    claws = []
    for offset in offsets:
        base = _add(toe_center, _scale(side_direction, offset))
        tip = _add(_add(base, _scale(direction, claw_length)), (0.0, 0.0, -claw_drop))
        claws.append(make_spike(base, tip, claw_base_radius, claw_tip_radius))

    return claws


# Main sculptural volumes
solid_components = []

body_core = make_lofted_tube(
    [
        ((-58.0, 0.0, 45.0), 13.0, 16.0),
        ((-42.0, 0.0, 50.0), 28.0, 28.0),
        ((-10.0, 0.0, 57.0), 34.0, 34.0),
        ((24.0, 0.0, 62.0), 31.0, 31.0),
        ((54.0, 0.0, 65.0), 20.0, 23.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

chest_mass = make_lofted_tube(
    [
        ((28.0, 0.0, 50.0), 22.0, 22.0),
        ((45.0, 0.0, 59.0), 27.0, 29.0),
        ((60.0, 0.0, 66.0), 20.0, 25.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

neck = make_lofted_tube(
    [
        ((48.0, 0.0, 65.0), 18.0, 20.0),
        ((60.0, 0.0, 72.0), 16.0, 18.0),
        ((70.0, 0.0, 76.0), 13.0, 16.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

solid_components.extend([body_core, chest_mass, neck])

# Side haunches and shoulder caps add the bulky quadruped musculature.
solid_components.extend(
    [
        make_lofted_tube(
            [
                ((-55.0, -20.0, 42.0), 10.0, 13.0),
                ((-42.0, -30.0, 42.0), 18.0, 21.0),
                ((-25.0, -26.0, 48.0), 15.0, 19.0),
            ],
            xdir_hint=(0.0, 0.0, 1.0),
        ),
        make_lofted_tube(
            [
                ((-55.0, 20.0, 42.0), 10.0, 13.0),
                ((-42.0, 30.0, 42.0), 18.0, 21.0),
                ((-25.0, 26.0, 48.0), 15.0, 19.0),
            ],
            xdir_hint=(0.0, 0.0, 1.0),
        ),
        make_lofted_tube(
            [
                ((24.0, -23.0, 57.0), 10.0, 13.0),
                ((42.0, -30.0, 56.0), 15.0, 19.0),
                ((56.0, -23.0, 62.0), 10.0, 14.0),
            ],
            xdir_hint=(0.0, 0.0, 1.0),
        ),
        make_lofted_tube(
            [
                ((24.0, 23.0, 57.0), 10.0, 13.0),
                ((42.0, 30.0, 56.0), 15.0, 19.0),
                ((56.0, 23.0, 62.0), 10.0, 14.0),
            ],
            xdir_hint=(0.0, 0.0, 1.0),
        ),
    ]
)

# Curled tail, tapered from rump to tip.
tail = make_lofted_tube(
    [
        ((-57.0, 0.0, 46.0), 8.5, 7.5),
        ((-68.0, -4.0, 52.0), 8.0, 7.0),
        ((-76.0, -8.0, 66.0), 7.0, 6.5),
        ((-94.0, -9.0, 80.0), 6.0, 5.8),
        ((-116.0, -5.0, 86.0), 4.8, 4.8),
        ((-132.0, 1.0, 85.0), 3.9, 3.9),
        ((-136.0, 5.0, 83.0), 3.4, 3.4),
    ],
    xdir_hint=(0.0, 0.0, 1.0),
)
solid_components.append(tail)

# Head shell with tapered snout.
head_core = make_lofted_tube(
    [
        ((66.0, 0.0, 75.0), 14.0, 17.0),
        ((78.0, 0.0, 84.0), 21.0, 19.0),
        ((94.0, 0.0, 81.0), 16.0, 13.0),
        ((108.0, 0.0, 76.0), 8.0, 7.0),
        ((113.0, 0.0, 76.0), 5.0, 5.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

# Cut subtle conical eye recesses into the head shell.
head_shell = head_core
for side in (-1.0, 1.0):
    eye_cutter = cq.Solid.makeCone(
        eye_recess_radius,
        1.4,
        9.0,
        pnt=cq.Vector(91.5, side * 26.0, 86.0),
        dir=cq.Vector(0.0, -side, 0.0),
    )
    head_shell = head_shell.cut(eye_cutter)

lower_jaw = make_lofted_tube(
    [
        ((90.0, 0.0, 72.0), 13.0, 5.0),
        ((108.0, 0.0, 72.0), 7.0, 4.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

nose_detail = cq.Solid.makeCylinder(
    nose_radius,
    nose_depth,
    pnt=cq.Vector(113.0, 0.0, 76.0),
    dir=cq.Vector(1.0, 0.0, 0.0),
)

solid_components.extend([head_shell, lower_jaw, nose_detail])

# Eyes and pointed ears.
for side in (-1.0, 1.0):
    solid_components.append(make_sphere((92.0, side * 17.6, 86.2), eye_bead_radius))
    solid_components.append(
        make_spike(
            (78.0, side * 10.5, 96.0),
            (73.0, side * 16.0, 115.0),
            ear_base_radius,
            0.2,
        )
    )

# Dorsal and throat facets echo the faceted, ornamental shell.
solid_components.extend(
    [
        make_triangular_fin(-32.0, 0.0, 75.0, 35.0, 12.0, 9.0, 0.15),
        make_triangular_fin(4.0, 0.0, 86.0, 48.0, 14.0, 8.5, 0.00),
        make_triangular_fin(37.0, 0.0, 84.0, 32.0, 11.0, 7.5, -0.12),
        make_triangular_fin(66.0, 0.0, 61.0, 24.0, -22.0, 24.0, 0.10),
        make_triangular_fin(78.0, -8.0, 63.0, 18.0, -16.0, 8.0, -0.10),
        make_triangular_fin(78.0, 8.0, 63.0, 18.0, -16.0, 8.0, -0.10),
    ]
)

# Rear legs and paws.
near_rear_thigh = make_lofted_tube(
    [
        ((-38.0, -22.0, 44.0), 13.0, 15.0),
        ((-51.0, -24.0, 31.0), 15.0, 17.0),
        ((-56.0, -22.0, 18.0), 10.0, 12.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

near_rear_shin = make_lofted_tube(
    [
        ((-56.0, -22.0, 18.0), 9.0, 10.0),
        ((-44.0, -22.0, 10.0), 7.0, 8.0),
        ((-31.0, -21.0, 8.0), 5.0, 6.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

near_rear_paw = make_lofted_tube(
    [
        ((-31.0, -21.0, 8.0), 5.0, 4.0),
        ((-20.0, -21.0, 5.0), 8.0, 3.8),
        ((-8.0, -21.0, 4.0), 6.0, 3.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

far_rear_thigh = make_lofted_tube(
    [
        ((-46.0, 19.0, 45.0), 10.0, 12.0),
        ((-35.0, 22.0, 30.0), 9.0, 11.0),
        ((-24.0, 20.0, 22.0), 7.0, 9.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

far_rear_shin = make_lofted_tube(
    [
        ((-24.0, 20.0, 22.0), 7.0, 8.0),
        ((-6.0, 18.0, 14.0), 6.0, 6.0),
        ((12.0, 17.0, 11.0), 4.5, 5.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

far_rear_paw = make_lofted_tube(
    [
        ((12.0, 17.0, 11.0), 4.0, 3.5),
        ((24.0, 17.0, 8.0), 6.0, 3.0),
        ((36.0, 17.0, 7.0), 4.5, 2.6),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

solid_components.extend(
    [
        near_rear_thigh,
        near_rear_shin,
        near_rear_paw,
        far_rear_thigh,
        far_rear_shin,
        far_rear_paw,
    ]
)

solid_components.extend(make_claws((-8.0, -21.0, 4.0), (1.0, 0.0, -0.08), 9.0))
solid_components.extend(make_claws((36.0, 17.0, 7.0), (1.0, 0.0, -0.05), 7.0))

# Front legs and paws stretched forward in a leaping pose.
near_front_upper = make_lofted_tube(
    [
        ((42.0, -23.0, 58.0), 10.0, 12.0),
        ((54.0, -24.0, 44.0), 9.0, 11.0),
        ((58.0, -22.0, 33.0), 7.0, 8.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

near_front_lower = make_lofted_tube(
    [
        ((58.0, -22.0, 33.0), 7.0, 8.0),
        ((72.0, -22.0, 22.0), 5.5, 6.0),
        ((86.0, -21.0, 14.0), 4.5, 5.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

near_front_paw = make_lofted_tube(
    [
        ((86.0, -21.0, 14.0), 4.5, 3.5),
        ((96.0, -21.0, 10.0), 7.0, 3.2),
        ((104.0, -21.0, 9.0), 5.0, 2.7),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

far_front_upper = make_lofted_tube(
    [
        ((47.0, 18.0, 60.0), 8.0, 10.0),
        ((62.0, 17.0, 50.0), 7.0, 9.0),
        ((68.0, 16.0, 40.0), 5.5, 7.0),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
)

far_front_lower = make_lofted_tube(
    [
        ((68.0, 16.0, 40.0), 5.5, 7.0),
        ((85.0, 15.0, 31.0), 4.5, 5.5),
        ((98.0, 14.0, 26.0), 3.8, 4.5),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

far_front_paw = make_lofted_tube(
    [
        ((98.0, 14.0, 26.0), 3.8, 3.0),
        ((106.0, 14.0, 23.0), 5.5, 2.8),
        ((110.0, 14.0, 23.0), 4.0, 2.4),
    ],
    xdir_hint=(0.0, 1.0, 0.0),
    ruled=True,
)

solid_components.extend(
    [
        near_front_upper,
        near_front_lower,
        near_front_paw,
        far_front_upper,
        far_front_lower,
        far_front_paw,
    ]
)

solid_components.extend(make_claws((104.0, -21.0, 9.0), (1.0, 0.0, -0.06), 8.0))
solid_components.extend(make_claws((110.0, 14.0, 23.0), (1.0, 0.0, -0.04), 6.5))

# Raised seam network to emulate the many freeform B-spline shell contacts/facets.
solid_components.append(
    make_rib_line(
        [
            (-54.0, 0.0, 61.0),
            (-38.0, 0.0, 78.0),
            (-12.0, 0.0, 90.0),
            (18.0, 0.0, 92.0),
            (50.0, 0.0, 78.0),
        ],
        spine_seam_radius,
    )
)

for side in (-1.0, 1.0):
    side_rib_paths = [
        [
            (-50.0, side * 28.0, 53.0),
            (-30.0, side * 35.0, 70.0),
            (-3.0, side * 35.0, 80.0),
            (20.0, side * 31.0, 72.0),
        ],
        [
            (-44.0, side * 28.0, 42.0),
            (-14.0, side * 35.0, 38.0),
            (18.0, side * 30.0, 45.0),
            (40.0, side * 24.0, 58.0),
        ],
        [
            (-20.0, side * 34.0, 80.0),
            (16.0, side * 31.0, 91.0),
            (45.0, side * 22.0, 83.0),
        ],
        [
            (25.0, side * 30.0, 75.0),
            (42.0, side * 24.0, 66.0),
            (52.0, side * 19.0, 54.0),
        ],
        [
            (76.0, side * 17.0, 90.0),
            (90.0, side * 20.0, 82.0),
            (108.0, side * 9.0, 77.0),
        ],
        [
            (94.0, side * 11.0, 73.0),
            (108.0, side * 6.0, 73.0),
        ],
    ]

    for rib_path in side_rib_paths:
        solid_components.append(make_rib_line(rib_path, seam_radius))

# Short bands at knees, elbows, and paws add articulated segment detail.
limb_rib_paths = [
    [(-58.0, -27.0, 19.0), (-56.0, -22.0, 22.0), (-54.0, -17.0, 19.0)],
    [(-32.0, -26.0, 8.0), (-28.0, -21.0, 8.0), (-32.0, -16.0, 8.0)],
    [(-24.0, 16.0, 22.0), (-22.0, 20.0, 24.0), (-24.0, 24.0, 22.0)],
    [(14.0, 13.0, 11.0), (18.0, 17.0, 10.0), (14.0, 21.0, 11.0)],
    [(56.0, -27.0, 35.0), (59.0, -22.0, 33.0), (56.0, -17.0, 35.0)],
    [(86.0, -25.0, 14.0), (90.0, -21.0, 12.0), (86.0, -17.0, 14.0)],
    [(68.0, 12.0, 40.0), (70.0, 16.0, 38.0), (68.0, 20.0, 40.0)],
    [(98.0, 11.0, 26.0), (101.0, 14.0, 25.0), (98.0, 17.0, 26.0)],
    [(72.0, -14.0, 96.0), (79.0, 0.0, 99.0), (72.0, 14.0, 96.0)],
    [(104.0, -7.0, 80.0), (111.0, 0.0, 78.0), (104.0, 7.0, 80.0)],
]

for rib_path in limb_rib_paths:
    solid_components.append(make_rib_line(rib_path, seam_radius * 0.75))

# Collect intersecting sculptural solids as one display model and rotate to match the rendered diagonal pose.
animal_compound = cq.Compound.makeCompound(solid_components)
animal_compound = animal_compound.rotate(
    (0.0, 0.0, 0.0),
    (0.0, 0.0, 1.0),
    pose_rotation_degrees,
)

result = cq.Workplane("XY").add(animal_compound)