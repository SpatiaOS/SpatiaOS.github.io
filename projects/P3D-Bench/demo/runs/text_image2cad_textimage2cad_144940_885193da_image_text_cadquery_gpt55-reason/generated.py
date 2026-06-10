import math
import cadquery as cq

# Coordinate convention:
# X = pivot / shaft axis, Y = frame length, Z = vertical direction.

# ----------------------------
# Parameters
# ----------------------------

# Global structure
flat_bar_length_y = 600.0
flat_bar_width_x = 50.0
flat_bar_thickness_z = 10.0
flat_bar_center = (25.0, 0.0, 260.0)

frame_member_x = 80.0
frame_center_x = 45.0
frame_chamfer = 3.0

# Pivot and pin sizes
large_bore_diameter = 40.0
large_bore_radius = large_bore_diameter / 2.0
large_pin_diameter = 39.0
large_pin_radius = large_pin_diameter / 2.0
large_pin_length = 145.0
large_pin_center_x = 15.0

small_bore_diameter = 30.0
small_bore_radius = small_bore_diameter / 2.0
small_pin_diameter = 29.0
small_pin_radius = small_pin_diameter / 2.0

# Link arm
link_arm_thickness_x = 56.0
link_arm_width = 34.0
link_boss_outer_radius = 30.0
link_boss_length = 100.0
link_boss_collar_radius = 34.0
link_boss_collar_thickness = 9.0
link_blind_socket_radius = 25.0
link_blind_socket_depth = 15.0

# Triangular linkage bracket
bracket_thickness_x = 78.0
bracket_arm_width = 38.0
bracket_large_boss_outer_radius = 31.0
bracket_small_boss_outer_radius = 28.0
bracket_large_boss_length = 105.0
bracket_small_boss_length = 88.0
bracket_boss_collar_thickness = 9.0

# Pulley
pulley_outer_radius = 115.0
pulley_disc_thickness = 61.0
pulley_center_x = -75.0
pulley_hub_radius = 70.0
pulley_hub_length = 18.0
pulley_front_cap_radius = 43.0
pulley_front_cap_length = 12.0
pulley_bolt_circle_radius = 50.0
pulley_bolt_hole_radius = 7.0
pulley_bolt_hole_count = 5
pulley_rim_notch_radius = 4.5
pulley_rim_notch_count = 30

# Key YZ pivot locations
upper_link_rear_top_yz = (145.0, 145.0)
upper_link_rear_lower_yz = (150.0, 55.0)
upper_link_outer_joint_yz = (-205.0, 50.0)

bracket_upper_yz = (55.0, -20.0)
bracket_rear_yz = (185.0, -145.0)
bracket_lower_left_yz = (-205.0, -105.0)

lower_ground_pin_yz = (-205.0, -195.0)


# ----------------------------
# Helper functions
# ----------------------------

def cylinder_x(radius, length, center):
    """Cylinder with its axis along global X."""
    return (
        cq.Workplane("YZ")
        .center(center[1], center[2])
        .circle(radius)
        .extrude(length, both=True)
        .translate((center[0], 0.0, 0.0))
    )


def cylinder_z(radius, length, center):
    """Cylinder with its axis along global Z."""
    return (
        cq.Workplane("XY")
        .center(center[0], center[1])
        .circle(radius)
        .extrude(length, both=True)
        .translate((0.0, 0.0, center[2]))
    )


def box_centered(size_x, size_y, size_z, center, chamfer=0.0):
    """Centered rectangular block with optional edge chamfer."""
    solid = cq.Workplane("XY").box(size_x, size_y, size_z).translate(center)
    if chamfer > 0:
        solid = solid.edges().chamfer(chamfer)
    return solid


def sphere_at(radius, center):
    """Solid sphere located at the requested center."""
    sphere = cq.Solid.makeSphere(radius, cq.Vector(center[0], center[1], center[2]))
    return cq.Workplane("XY").newObject([sphere])


def ring_x(outer_radius, inner_radius, length, center):
    """Annular cylinder with its axis along global X."""
    return cylinder_x(outer_radius, length, center).cut(
        cylinder_x(inner_radius, length + 2.0, center)
    )


def capsule_between_yz(start_yz, end_yz, width, thickness_x, x_center=0.0):
    """Rounded-ended plate segment drawn in the YZ plane and extruded along X."""
    y1, z1 = start_yz
    y2, z2 = end_yz
    dy = y2 - y1
    dz = z2 - z1
    segment_length = math.sqrt(dy * dy + dz * dz)
    radius = width / 2.0

    if segment_length < 1e-6:
        return cylinder_x(radius, thickness_x, (x_center, y1, z1))

    normal_y = -dz / segment_length
    normal_z = dy / segment_length

    profile_points = [
        (y1 + normal_y * radius, z1 + normal_z * radius),
        (y2 + normal_y * radius, z2 + normal_z * radius),
        (y2 - normal_y * radius, z2 - normal_z * radius),
        (y1 - normal_y * radius, z1 - normal_z * radius),
    ]

    web = (
        cq.Workplane("YZ")
        .polyline(profile_points)
        .close()
        .extrude(thickness_x, both=True)
        .translate((x_center, 0.0, 0.0))
    )

    return (
        web
        .union(cylinder_x(radius, thickness_x, (x_center, y1, z1)))
        .union(cylinder_x(radius, thickness_x, (x_center, y2, z2)))
    )


def path_plate_yz(points_yz, width, thickness_x, x_center=0.0):
    """Build a swept-looking link from overlapping rounded plate segments."""
    body = capsule_between_yz(points_yz[0], points_yz[1], width, thickness_x, x_center)
    for start_yz, end_yz in zip(points_yz[1:-1], points_yz[2:]):
        body = body.union(capsule_between_yz(start_yz, end_yz, width, thickness_x, x_center))
    return body


def boss_stack_x(center_yz, outer_radius, length, x_center=0.0,
                 collar_radius=None, collar_thickness=0.0):
    """Cylindrical boss with optional collars at both ends."""
    y, z = center_yz
    boss = cylinder_x(outer_radius, length, (x_center, y, z))

    if collar_radius is not None and collar_thickness > 0:
        left_collar_x = x_center - length / 2.0 + collar_thickness / 2.0
        right_collar_x = x_center + length / 2.0 - collar_thickness / 2.0
        boss = boss.union(cylinder_x(collar_radius, collar_thickness, (left_collar_x, y, z)))
        boss = boss.union(cylinder_x(collar_radius, collar_thickness, (right_collar_x, y, z)))

    return boss


def bearing_block(center_yz, hole_radius, size_y=72.0, size_z=72.0):
    """Frame-mounted bearing block with a through bore along X."""
    y, z = center_yz
    block = box_centered(92.0, size_y, size_z, (frame_center_x, y, z), chamfer=2.5)
    return block.cut(cylinder_x(hole_radius + 0.8, 120.0, (frame_center_x, y, z)))


# ----------------------------
# Grounded frame and flat bar
# ----------------------------

flat_bar = box_centered(
    flat_bar_width_x,
    flat_bar_length_y,
    flat_bar_thickness_z,
    flat_bar_center,
    chamfer=1.2,
)

frame_members = [
    box_centered(frame_member_x, 520.0, 35.0, (frame_center_x, 20.0, 225.0), frame_chamfer),
    box_centered(frame_member_x, 45.0, 420.0, (frame_center_x, 280.0, 15.0), frame_chamfer),
    box_centered(74.0, 40.0, 365.0, (frame_center_x, -120.0, 35.0), frame_chamfer),
    box_centered(frame_member_x, 420.0, 35.0, (frame_center_x, 70.0, -195.0), frame_chamfer),
    box_centered(74.0, 40.0, 260.0, (frame_center_x, 70.0, -60.0), frame_chamfer),
    box_centered(74.0, 155.0, 30.0, (frame_center_x, 135.0, -65.0), frame_chamfer),
    box_centered(74.0, 120.0, 30.0, (frame_center_x, 115.0, 25.0), frame_chamfer),
    path_plate_yz([(75.0, -75.0), (135.0, -145.0)], 36.0, 74.0, x_center=frame_center_x),
]

bearing_blocks = [
    bearing_block(upper_link_rear_top_yz, large_bore_radius),
    bearing_block(upper_link_rear_lower_yz, large_bore_radius),
    bearing_block(bracket_upper_yz, large_bore_radius),
    bearing_block(bracket_rear_yz, large_bore_radius),
    bearing_block(lower_ground_pin_yz, small_bore_radius, size_y=58.0, size_z=52.0),
]


# ----------------------------
# Upper U-shaped swept link arm
# ----------------------------

upper_link_top_path = [
    upper_link_rear_top_yz,
    (70.0, 138.0),
    (-25.0, 110.0),
    (-125.0, 78.0),
    upper_link_outer_joint_yz,
]

upper_link_lower_path = [
    upper_link_rear_lower_yz,
    (85.0, 15.0),
    (-20.0, -5.0),
    (-135.0, 15.0),
    upper_link_outer_joint_yz,
]

upper_link_arm = path_plate_yz(
    upper_link_top_path,
    link_arm_width,
    link_arm_thickness_x,
)

upper_link_arm = upper_link_arm.union(
    path_plate_yz(upper_link_lower_path, link_arm_width, link_arm_thickness_x)
)

upper_link_arm = upper_link_arm.union(
    boss_stack_x(
        upper_link_rear_top_yz,
        link_boss_outer_radius,
        link_boss_length,
        collar_radius=link_boss_collar_radius,
        collar_thickness=link_boss_collar_thickness,
    )
)

upper_link_arm = upper_link_arm.union(
    boss_stack_x(
        upper_link_rear_lower_yz,
        link_boss_outer_radius,
        link_boss_length,
        collar_radius=link_boss_collar_radius,
        collar_thickness=link_boss_collar_thickness,
    )
)

upper_link_arm = upper_link_arm.union(
    boss_stack_x(
        upper_link_outer_joint_yz,
        25.0,
        link_arm_thickness_x + 6.0,
        collar_radius=28.0,
        collar_thickness=6.0,
    )
)

# Through bores and locating blind socket
for pivot_yz in (upper_link_rear_top_yz, upper_link_rear_lower_yz):
    upper_link_arm = upper_link_arm.cut(
        cylinder_x(large_bore_radius + 0.5, link_boss_length + 8.0, (0.0, pivot_yz[0], pivot_yz[1]))
    )

upper_link_arm = upper_link_arm.cut(
    cylinder_x(small_bore_radius + 0.5, link_arm_thickness_x + 12.0,
               (0.0, upper_link_outer_joint_yz[0], upper_link_outer_joint_yz[1]))
)

upper_link_arm = upper_link_arm.cut(
    cylinder_x(
        link_blind_socket_radius,
        link_blind_socket_depth,
        (
            link_arm_thickness_x / 2.0 - link_blind_socket_depth / 2.0,
            -155.0,
            42.0,
        ),
    )
)

# Small spherical contact features near the outboard joint
upper_link_arm = upper_link_arm.union(
    sphere_at(13.0, (-33.0, upper_link_outer_joint_yz[0], upper_link_outer_joint_yz[1]))
)
upper_link_arm = upper_link_arm.union(
    sphere_at(10.0, (31.0, upper_link_outer_joint_yz[0] + 12.0, upper_link_outer_joint_yz[1] - 8.0))
)


# ----------------------------
# Lower triangular linkage bracket
# ----------------------------

bracket_outer_to_upper_path = [
    bracket_lower_left_yz,
    (-145.0, -60.0),
    (-40.0, -25.0),
    bracket_upper_yz,
]

bracket_upper_to_rear_path = [
    bracket_upper_yz,
    (100.0, -45.0),
    (145.0, -90.0),
    bracket_rear_yz,
]

bracket_rear_to_outer_path = [
    bracket_rear_yz,
    (75.0, -180.0),
    (-65.0, -168.0),
    bracket_lower_left_yz,
]

triangular_linkage_bracket = path_plate_yz(
    bracket_outer_to_upper_path,
    bracket_arm_width,
    bracket_thickness_x,
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    path_plate_yz(bracket_upper_to_rear_path, bracket_arm_width, bracket_thickness_x)
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    path_plate_yz(bracket_rear_to_outer_path, bracket_arm_width, bracket_thickness_x)
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    boss_stack_x(
        bracket_upper_yz,
        bracket_large_boss_outer_radius,
        bracket_large_boss_length,
        collar_radius=35.0,
        collar_thickness=bracket_boss_collar_thickness,
    )
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    boss_stack_x(
        bracket_rear_yz,
        bracket_large_boss_outer_radius,
        bracket_large_boss_length,
        collar_radius=35.0,
        collar_thickness=bracket_boss_collar_thickness,
    )
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    boss_stack_x(
        bracket_lower_left_yz,
        bracket_small_boss_outer_radius,
        bracket_small_boss_length,
        collar_radius=32.0,
        collar_thickness=8.0,
    )
)

for pivot_yz in (bracket_upper_yz, bracket_rear_yz):
    triangular_linkage_bracket = triangular_linkage_bracket.cut(
        cylinder_x(large_bore_radius + 0.5, bracket_large_boss_length + 8.0,
                   (0.0, pivot_yz[0], pivot_yz[1]))
    )

triangular_linkage_bracket = triangular_linkage_bracket.cut(
    cylinder_x(small_bore_radius + 0.5, bracket_small_boss_length + 10.0,
               (0.0, bracket_lower_left_yz[0], bracket_lower_left_yz[1]))
)

triangular_linkage_bracket = triangular_linkage_bracket.union(
    sphere_at(12.0, (42.0, bracket_lower_left_yz[0] + 5.0, bracket_lower_left_yz[1] + 2.0))
)


# ----------------------------
# Upright carrier / host inferred from the rendered assembly
# ----------------------------

upright_carrier = path_plate_yz(
    [
        upper_link_outer_joint_yz,
        (-218.0, -25.0),
        bracket_lower_left_yz,
        lower_ground_pin_yz,
    ],
    44.0,
    54.0,
    x_center=-15.0,
)

upright_carrier = upright_carrier.union(
    boss_stack_x(
        upper_link_outer_joint_yz,
        26.0,
        64.0,
        x_center=-15.0,
        collar_radius=30.0,
        collar_thickness=8.0,
    )
)

upright_carrier = upright_carrier.union(
    boss_stack_x(
        bracket_lower_left_yz,
        50.0,
        62.0,
        x_center=-15.0,
        collar_radius=56.0,
        collar_thickness=8.0,
    )
)

upright_carrier = upright_carrier.union(
    boss_stack_x(
        lower_ground_pin_yz,
        23.0,
        56.0,
        x_center=-15.0,
        collar_radius=27.0,
        collar_thickness=7.0,
    )
)

# Flat mounting flange that contacts the pulley back face
upright_carrier = upright_carrier.union(
    cylinder_x(58.0, 12.0, (-49.0, bracket_lower_left_yz[0], bracket_lower_left_yz[1]))
)

for pivot_yz in (upper_link_outer_joint_yz, bracket_lower_left_yz, lower_ground_pin_yz):
    upright_carrier = upright_carrier.cut(
        cylinder_x(small_bore_radius + 0.5, 92.0, (-15.0, pivot_yz[0], pivot_yz[1]))
    )


# ----------------------------
# Pulley disc with stepped hub, bolt circle, and notched rim
# ----------------------------

pulley_center = (pulley_center_x, bracket_lower_left_yz[0], bracket_lower_left_yz[1])
pulley_front_x = pulley_center_x - pulley_disc_thickness / 2.0

pulley_disc = cylinder_x(pulley_outer_radius, pulley_disc_thickness, pulley_center)

# Raised rim lip and stepped central hub
pulley_disc = pulley_disc.union(
    ring_x(pulley_outer_radius, 100.0, 6.0,
           (pulley_front_x - 3.0, bracket_lower_left_yz[0], bracket_lower_left_yz[1]))
)

pulley_disc = pulley_disc.union(
    cylinder_x(
        pulley_hub_radius,
        pulley_hub_length,
        (pulley_front_x - pulley_hub_length / 2.0, bracket_lower_left_yz[0], bracket_lower_left_yz[1]),
    )
)

pulley_disc = pulley_disc.union(
    cylinder_x(
        pulley_front_cap_radius,
        pulley_front_cap_length,
        (
            pulley_front_x - pulley_hub_length - pulley_front_cap_length / 2.0,
            bracket_lower_left_yz[0],
            bracket_lower_left_yz[1],
        ),
    )
)

# Five through holes on the hub bolt circle
for hole_index in range(pulley_bolt_hole_count):
    angle = math.radians(90.0 + 360.0 * hole_index / pulley_bolt_hole_count)
    hole_y = bracket_lower_left_yz[0] + pulley_bolt_circle_radius * math.cos(angle)
    hole_z = bracket_lower_left_yz[1] + pulley_bolt_circle_radius * math.sin(angle)

    pulley_disc = pulley_disc.cut(
        cylinder_x(
            pulley_bolt_hole_radius,
            pulley_disc_thickness + pulley_hub_length + pulley_front_cap_length + 20.0,
            (pulley_center_x - 20.0, hole_y, hole_z),
        )
    )

# Small periodic scallops around the outer rim
for notch_index in range(pulley_rim_notch_count):
    angle = math.radians(360.0 * notch_index / pulley_rim_notch_count)
    notch_y = bracket_lower_left_yz[0] + (pulley_outer_radius + 1.0) * math.cos(angle)
    notch_z = bracket_lower_left_yz[1] + (pulley_outer_radius + 1.0) * math.sin(angle)

    pulley_disc = pulley_disc.cut(
        cylinder_x(
            pulley_rim_notch_radius,
            pulley_disc_thickness + 14.0,
            (pulley_center_x, notch_y, notch_z),
        )
    )


# ----------------------------
# Top inferred fan/gusset plate and small hanging eyelets
# ----------------------------

top_plate_z = 182.0
top_plate_thickness = 10.0
top_plate_points_xy = [
    (-90.0, -130.0),
    (-35.0, -180.0),
    (45.0, -165.0),
    (155.0, 95.0),
    (110.0, 130.0),
    (-45.0, 150.0),
    (-100.0, 30.0),
    (-105.0, -70.0),
]

top_gusset_plate = (
    cq.Workplane("XY")
    .polyline(top_plate_points_xy)
    .close()
    .extrude(top_plate_thickness, both=True)
    .translate((0.0, 0.0, top_plate_z))
)

top_gusset_plate = top_gusset_plate.cut(
    cylinder_z(6.0, top_plate_thickness + 4.0, (10.0, -35.0, top_plate_z))
)

eyelet_centers = [
    (0.0, -25.0, top_plate_z - 30.0),
    (0.0, 25.0, top_plate_z - 30.0),
    (0.0, 72.0, top_plate_z - 30.0),
]

top_eyelets = []
for eyelet_center in eyelet_centers:
    top_eyelets.append(ring_x(16.0, 8.0, 16.0, eyelet_center))
    top_eyelets.append(
        box_centered(
            16.0,
            11.0,
            30.0,
            (eyelet_center[0], eyelet_center[1], eyelet_center[2] + 21.0),
            chamfer=0.8,
        )
    )


# ----------------------------
# Pins and shafts
# ----------------------------

large_pins = [
    cylinder_x(large_pin_radius, large_pin_length,
               (large_pin_center_x, upper_link_rear_top_yz[0], upper_link_rear_top_yz[1])),
    cylinder_x(large_pin_radius, large_pin_length,
               (large_pin_center_x, upper_link_rear_lower_yz[0], upper_link_rear_lower_yz[1])),
    cylinder_x(large_pin_radius, large_pin_length,
               (large_pin_center_x, bracket_upper_yz[0], bracket_upper_yz[1])),
    cylinder_x(large_pin_radius, large_pin_length,
               (large_pin_center_x, bracket_rear_yz[0], bracket_rear_yz[1])),
]

small_pins = [
    cylinder_x(small_pin_radius, 90.0,
               (-15.0, upper_link_outer_joint_yz[0], upper_link_outer_joint_yz[1])),
    cylinder_x(small_pin_radius, 90.0,
               (-15.0, lower_ground_pin_yz[0], lower_ground_pin_yz[1])),
    cylinder_x(small_pin_radius, 100.0,
               (-20.0, bracket_lower_left_yz[0], bracket_lower_left_yz[1])),
]


# ----------------------------
# Unified assembly result
# ----------------------------

compound = cq.Compound.makeCompound(
    [
        shape
        for body in (
            flat_bar,
            top_gusset_plate,
            upper_link_arm,
            triangular_linkage_bracket,
            upright_carrier,
            pulley_disc,
            *frame_members,
            *bearing_blocks,
            *top_eyelets,
            *large_pins,
            *small_pins,
        )
        for shape in body.vals()
    ]
)

result = cq.Workplane("XY").newObject([compound])