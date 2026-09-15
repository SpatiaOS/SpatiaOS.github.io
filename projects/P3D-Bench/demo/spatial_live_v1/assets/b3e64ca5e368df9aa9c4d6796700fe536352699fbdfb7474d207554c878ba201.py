import math
import cadquery as cq

# All dimensions are in millimetres and are estimated from the reference image.
# The mechanism is modeled as separate mechanical components so that bearing
# rings, covers, and joint clearances remain visible.

# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------
base_length = 114.0
base_width = 86.0
base_height = 18.0
corner_inset = 15.0
corner_relief = 18.0
mounting_tab_extension = 7.0
mounting_tab_thickness = 5.0
mounting_hole_diameter = 3.4

turntable_x = 9.0
turntable_radius = 29.0
turntable_shoulder_height = 32.0
pedestal_top_height = 50.0

shoulder_x = -9.0
shoulder_z = 75.0
shoulder_cover_radius = 23.0
shoulder_pivot_radius = 16.0

support_cheek_spacing = 35.0
support_cheek_thickness = 6.0
main_arm_depth = 26.0
upper_pivot_x = -40.0
upper_pivot_z = 146.0

secondary_lower_offset = 20.0
secondary_link_y = 23.0
secondary_link_thickness = 4.0

barrel_axis_height = 160.0
barrel_rear_x = -25.0
barrel_length = 74.0
barrel_radius = 10.0

output_shaft_length = 27.0
output_shaft_width = 10.5
output_shaft_height = 11.5
housing_seam_width = 0.32
edge_chamfer = 0.6

# Rotate the complete assembly without changing its working coordinates.
assembly_rotation = 90.0

# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------
components = []


def add_component(component):
    """Collect solids without fusing independently moving mechanical parts."""
    if isinstance(component, cq.Workplane):
        components.append(component.val())
    else:
        components.append(component)


def cylinder(radius, length, origin, axis=(0, 0, 1)):
    """Create an axial cylinder from its starting face."""
    return cq.Solid.makeCylinder(
        radius, length, cq.Vector(*origin), cq.Vector(*axis)
    )


def annular_ring(outer_radius, inner_radius, length, origin, axis=(0, 0, 1)):
    """Create a ring with a slightly overlong bore cutter."""
    outside = cylinder(outer_radius, length, origin, axis)
    bore_origin = tuple(origin[i] - 0.1 * axis[i] for i in range(3))
    bore = cylinder(inner_radius, length + 0.2, bore_origin, axis)
    return outside.cut(bore)


def xz_plate(outline, y_center, thickness):
    """Extrude a global X/Z outline symmetrically about a Y position."""
    plate_plane = cq.Plane(
        origin=(0, y_center + thickness / 2, 0),
        xDir=(1, 0, 0),
        normal=(0, -1, 0),
    )
    return cq.Workplane(plate_plane).polyline(outline).close().extrude(thickness)


def y_axis_plane(x, y, z):
    """A face plane whose local coordinates are global X and Z."""
    return cq.Plane(
        origin=(x, y, z),
        xDir=(1, 0, 0),
        normal=(0, -1, 0),
    )


# ---------------------------------------------------------------------------
# Rectangular mounting base with relieved corners and low mounting feet
# ---------------------------------------------------------------------------
half_length = base_length / 2
half_width = base_width / 2

base_outline = [
    (-half_length, -half_width),
    (half_length - corner_inset, -half_width),
    (half_length - corner_inset, -half_width + 11.0),
    (half_length - 8.0, -half_width + corner_relief),
    (half_length, -half_width + corner_relief),
    (half_length, half_width - corner_relief),
    (half_length - 8.0, half_width - corner_relief),
    (half_length - corner_inset, half_width - 11.0),
    (half_length - corner_inset, half_width),
    (-half_length, half_width),
]

base = cq.Workplane("XY").polyline(base_outline).close().extrude(base_height)

tab_min_x = half_length - corner_inset - 1.0
tab_max_x = half_length + mounting_tab_extension
tab_length = tab_max_x - tab_min_x
tab_center_x = (tab_min_x + tab_max_x) / 2

for side in (-1, 1):
    tab_center_y = side * (half_width - corner_relief / 2)
    mounting_tab = (
        cq.Workplane("XY")
        .box(tab_length, corner_relief, mounting_tab_thickness)
        .edges("|Z")
        .chamfer(1.4)
        .translate(
            (tab_center_x, tab_center_y, mounting_tab_thickness / 2)
        )
    )
    base = base.union(mounting_tab)

    for hole_x in (half_length - 7.0, half_length + 1.0):
        base = base.cut(
            cylinder(
                mounting_hole_diameter / 2,
                mounting_tab_thickness + 2.0,
                (hole_x, tab_center_y, -1.0),
            )
        )

# Shallow edge rebates visible on the top of the equipment base.
for notch_y in (-21.0, 21.0):
    edge_rebate = (
        cq.Workplane("XY")
        .box(12.0, 10.0, 5.0)
        .translate((-half_length + 4.0, notch_y, base_height - 2.5))
    )
    base = base.cut(edge_rebate)

front_top_notch = (
    cq.Workplane("XY")
    .box(13.0, 5.0, 3.5)
    .translate((-3.0, -half_width + 1.0, base_height - 1.25))
)
base = base.cut(front_top_notch)

# Fine vertical cover seams near the mounting-foot side.
for seam_x in (half_length - corner_inset - 5.0,
               half_length - corner_inset - 2.0):
    seam = (
        cq.Workplane("XY")
        .box(0.4, 0.8, base_height - 1.0)
        .translate((seam_x, -half_width + 0.15, base_height / 2))
    )
    base = base.cut(seam)

add_component(base)

# Small rectangular access panel on the front face.
panel_frame = (
    cq.Workplane("XY")
    .box(19.0, 1.2, 12.0)
    .edges("|Y")
    .chamfer(0.7)
    .translate((-21.0, -half_width - 0.5, 8.1))
)
panel_insert = (
    cq.Workplane("XY")
    .box(16.8, 0.5, 9.8)
    .edges("|Y")
    .chamfer(0.35)
    .translate((-21.0, -half_width - 1.15, 8.1))
)
add_component(panel_frame)
add_component(panel_insert)

# Two small connectors beside the access panel.
for connector_z in (5.6, 10.5):
    add_component(
        cylinder(
            1.9, 1.8,
            (23.0, -half_width, connector_z),
            (0, -1, 0),
        )
    )
    add_component(
        cylinder(
            1.45, 0.6,
            (23.0, -half_width - 1.8, connector_z),
            (0, -1, 0),
        )
    )

# ---------------------------------------------------------------------------
# Stepped vertical-axis turntable and cylindrical pedestal
# ---------------------------------------------------------------------------
turntable_profile = [
    (0.0, base_height),
    (turntable_radius - 3.5, base_height),
    (turntable_radius - 2.0, base_height + 1.0),
    (turntable_radius - 2.0, base_height + 3.0),
    (turntable_radius - 3.2, base_height + 3.0),
    (turntable_radius - 3.2, base_height + 8.0),
    (turntable_radius - 2.2, base_height + 8.0),
    (turntable_radius - 2.2, base_height + 9.5),
    (turntable_radius, base_height + 9.5),
    (turntable_radius, base_height + 12.0),
    (turntable_radius - 2.0, turntable_shoulder_height),
    (turntable_radius - 7.5, turntable_shoulder_height),
    (turntable_radius - 7.5, pedestal_top_height - 2.0),
    (turntable_radius - 9.0, pedestal_top_height),
    (0.0, pedestal_top_height),
]

turntable = (
    cq.Workplane("XZ")
    .polyline(turntable_profile)
    .close()
    .revolve(360.0, (0, 0), (0, 1))
    .translate((turntable_x, 0, 0))
)
add_component(turntable)

# ---------------------------------------------------------------------------
# Angular lower cradle carrying the horizontal shoulder joint
# ---------------------------------------------------------------------------
secondary_lower_x = shoulder_x + secondary_lower_offset
secondary_lower_z = shoulder_z

support_outline = [
    (turntable_x - 21.0, 43.0),
    (turntable_x - 6.0, 33.0),
    (turntable_x + 15.0, 36.0),
    (turntable_x + 22.0, 45.0),
    (shoulder_x + 22.0, shoulder_z - 4.0),
    (shoulder_x + 17.0, shoulder_z + 5.0),
    (shoulder_x - 19.0, shoulder_z + 5.0),
    (shoulder_x - 26.0, shoulder_z - 12.0),
]

for side in (-1, 1):
    cheek_y = side * support_cheek_spacing / 2
    cheek = xz_plate(
        support_outline, cheek_y, support_cheek_thickness
    )

    cheek = cheek.union(
        cylinder(
            18.0,
            support_cheek_thickness,
            (shoulder_x, cheek_y + support_cheek_thickness / 2, shoulder_z),
            (0, -1, 0),
        )
    )
    cheek = cheek.union(
        cylinder(
            6.0,
            support_cheek_thickness,
            (
                secondary_lower_x,
                cheek_y + support_cheek_thickness / 2,
                secondary_lower_z,
            ),
            (0, -1, 0),
        )
    )
    cheek = cheek.cut(
        cylinder(
            10.0,
            support_cheek_thickness + 0.4,
            (
                shoulder_x,
                cheek_y + support_cheek_thickness / 2 + 0.2,
                shoulder_z,
            ),
            (0, -1, 0),
        )
    )
    add_component(cheek)

support_bridge = (
    cq.Workplane("XY")
    .box(36.0, support_cheek_spacing, 10.0)
    .edges("|Y")
    .chamfer(2.0)
    .translate((turntable_x + 1.0, 0, 43.0))
)
add_component(support_bridge)

lower_cover_outline = [
    (turntable_x - 20.0, 46.0),
    (turntable_x - 6.0, 35.0),
    (turntable_x + 14.0, 38.0),
    (turntable_x + 19.0, 45.0),
    (shoulder_x + 16.0, 61.0),
    (shoulder_x - 18.0, 61.0),
]
add_component(
    xz_plate(
        lower_cover_outline,
        -(support_cheek_spacing + support_cheek_thickness) / 2 - 0.45,
        0.9,
    )
)

# ---------------------------------------------------------------------------
# Shoulder pivot, stepped bearing covers, and projecting faceted shaft
# ---------------------------------------------------------------------------
add_component(
    cylinder(
        shoulder_pivot_radius, 29.0,
        (shoulder_x, -14.5, shoulder_z),
        (0, 1, 0),
    )
)
add_component(
    cylinder(
        9.5, 48.0,
        (shoulder_x, -24.0, shoulder_z),
        (0, 1, 0),
    )
)

cheek_outer_y = (support_cheek_spacing + support_cheek_thickness) / 2

# Rear bearing cover.
add_component(
    cylinder(
        20.0, 3.0,
        (shoulder_x, cheek_outer_y, shoulder_z),
        (0, 1, 0),
    )
)
add_component(
    cylinder(
        17.5, 1.8,
        (shoulder_x, cheek_outer_y + 3.0, shoulder_z),
        (0, 1, 0),
    )
)
add_component(
    cylinder(
        6.0, 1.5,
        (shoulder_x, cheek_outer_y + 4.8, shoulder_z),
        (0, 1, 0),
    )
)

# Front neck leaves space for the secondary linkage behind the large cover.
front_flange_y = -cheek_outer_y - 5.0
add_component(
    cylinder(
        15.5, 5.0,
        (shoulder_x, -cheek_outer_y, shoulder_z),
        (0, -1, 0),
    )
)
add_component(
    cylinder(
        shoulder_cover_radius, 2.5,
        (shoulder_x, front_flange_y, shoulder_z),
        (0, -1, 0),
    )
)
add_component(
    cylinder(
        shoulder_cover_radius - 0.7, 7.0,
        (shoulder_x, front_flange_y - 2.5, shoulder_z),
        (0, -1, 0),
    )
)

cover_face_y = front_flange_y - 9.5
add_component(
    annular_ring(
        shoulder_cover_radius,
        shoulder_cover_radius - 2.1,
        1.4,
        (shoulder_x, cover_face_y, shoulder_z),
        (0, -1, 0),
    )
)
add_component(
    cylinder(
        shoulder_cover_radius - 2.6, 1.6,
        (shoulder_x, cover_face_y, shoulder_z),
        (0, -1, 0),
    )
)

for outer_r, inner_r in ((20.3, 19.3), (18.3, 17.3)):
    add_component(
        annular_ring(
            outer_r, inner_r, 0.65,
            (shoulder_x, cover_face_y - 1.6, shoulder_z),
            (0, -1, 0),
        )
    )

add_component(
    cylinder(
        16.0, 1.1,
        (shoulder_x, cover_face_y - 1.6, shoulder_z),
        (0, -1, 0),
    )
)
add_component(
    cylinder(
        7.0, 2.3,
        (shoulder_x, cover_face_y - 2.7, shoulder_z),
        (0, -1, 0),
    )
)

shaft_start_y = cover_face_y - 4.6
shaft_end_y = shaft_start_y - output_shaft_length

output_shaft = (
    cq.Workplane("XY")
    .box(output_shaft_width, output_shaft_length, output_shaft_height)
    .edges("|Y")
    .chamfer(1.0)
    .translate(
        (
            shoulder_x,
            (shaft_start_y + shaft_end_y) / 2,
            shoulder_z,
        )
    )
)

shaft_cap = (
    cq.Workplane(y_axis_plane(shoulder_x, shaft_end_y, shoulder_z))
    .polygon(8, 15.0)
    .extrude(2.4)
    .faces("<Y")
    .edges()
    .chamfer(0.35)
)

socket_cutter = (
    cq.Workplane(y_axis_plane(shoulder_x, shaft_end_y + 2.0, shoulder_z))
    .polygon(6, 6.4)
    .extrude(4.8)
)
add_component(output_shaft.cut(socket_cutter))
add_component(shaft_cap.cut(socket_cutter))

# ---------------------------------------------------------------------------
# Tapered, faceted main arm between the shoulder and the upper wrist
# ---------------------------------------------------------------------------
arm_dx = upper_pivot_x - shoulder_x
arm_dz = upper_pivot_z - shoulder_z
arm_length = math.hypot(arm_dx, arm_dz)
arm_unit_x = arm_dx / arm_length
arm_unit_z = arm_dz / arm_length


def arm_point(across, along):
    """Map an arm-local width/length coordinate into the X/Z side view."""
    return (
        shoulder_x + arm_unit_z * across + arm_unit_x * along,
        shoulder_z - arm_unit_x * across + arm_unit_z * along,
    )


arm_local_outline = [
    (-12.0, 0.0),
    (-17.0, 20.0),
    (-14.0, 39.0),
    (-10.0, arm_length - 12.0),
    (-7.5, arm_length + 1.0),
    (7.5, arm_length + 1.0),
    (10.0, arm_length - 12.0),
    (15.0, 39.0),
    (14.0, 18.0),
    (12.0, 0.0),
]
main_arm = xz_plate(
    [arm_point(w, s) for w, s in arm_local_outline],
    0.0,
    main_arm_depth,
)

# Shallow transverse seams divide the broad housing faces into angular panels.
for seam_position in (arm_length * 0.34, arm_length * 0.66):
    seam_outline = [
        arm_point(-25.0, seam_position - housing_seam_width / 2),
        arm_point(25.0, seam_position - housing_seam_width / 2),
        arm_point(25.0, seam_position + housing_seam_width / 2),
        arm_point(-25.0, seam_position + housing_seam_width / 2),
    ]
    for side in (-1, 1):
        main_arm = main_arm.cut(
            xz_plate(
                seam_outline,
                side * (main_arm_depth / 2 - 0.1),
                0.65,
            )
        )

add_component(main_arm)

# ---------------------------------------------------------------------------
# Open upper clevis supporting the horizontal barrel
# ---------------------------------------------------------------------------
upper_fork_outline = [
    (upper_pivot_x - 11.0, upper_pivot_z - 4.0),
    (upper_pivot_x - 12.0, upper_pivot_z + 6.0),
    (upper_pivot_x - 5.0, barrel_axis_height - 7.0),
    (barrel_rear_x + 3.0, barrel_axis_height - 5.0),
    (barrel_rear_x + 6.0, upper_pivot_z - 1.0),
    (barrel_rear_x - 4.0, upper_pivot_z - 6.0),
]

for side in (-1, 1):
    add_component(xz_plate(upper_fork_outline, side * 14.0, 6.0))

upper_fork_bridge = (
    cq.Workplane("XY")
    .box(19.0, 28.0, 4.0)
    .translate((upper_pivot_x + 7.0, 0, upper_pivot_z - 4.0))
)
add_component(upper_fork_bridge)

add_component(
    cylinder(
        5.8, 34.0,
        (upper_pivot_x, -17.0, upper_pivot_z),
        (0, 1, 0),
    )
)
for side in (-1, 1):
    add_component(
        cylinder(
            4.7, 1.5,
            (upper_pivot_x, side * 17.0, upper_pivot_z),
            (0, side, 0),
        )
    )

# ---------------------------------------------------------------------------
# Slim, slightly cranked parallel links behind the main arm
# ---------------------------------------------------------------------------
secondary_upper_x = barrel_rear_x + 5.0
secondary_upper_z = upper_pivot_z + 1.0
link_knee_x = secondary_lower_x + 5.0
link_knee_z = shoulder_z + 25.0

secondary_outline = [
    (secondary_lower_x - 3.0, secondary_lower_z - 3.0),
    (secondary_lower_x + 4.0, secondary_lower_z - 2.0),
    (link_knee_x + 4.0, link_knee_z),
    (link_knee_x + 3.0, link_knee_z + 4.0),
    (secondary_upper_x + 3.0, secondary_upper_z + 3.0),
    (secondary_upper_x - 3.0, secondary_upper_z + 3.0),
    (secondary_upper_x - 4.0, secondary_upper_z - 2.0),
    (link_knee_x - 4.0, link_knee_z - 1.0),
    (secondary_lower_x - 4.0, secondary_lower_z + 4.0),
]

for side in (-1, 1):
    link_y = side * secondary_link_y
    parallel_link = xz_plate(
        secondary_outline, link_y, secondary_link_thickness
    )

    for pivot_x, pivot_z in (
        (secondary_lower_x, secondary_lower_z),
        (secondary_upper_x, secondary_upper_z),
    ):
        parallel_link = parallel_link.union(
            cylinder(
                4.5,
                secondary_link_thickness,
                (
                    pivot_x,
                    link_y + secondary_link_thickness / 2,
                    pivot_z,
                ),
                (0, -1, 0),
            )
        )
        add_component(
            cylinder(
                3.0, 1.4,
                (
                    pivot_x,
                    side * (secondary_link_y + secondary_link_thickness / 2),
                    pivot_z,
                ),
                (0, side, 0),
            )
        )
    add_component(parallel_link)

# Transverse pins tie both links to the lower cradle and upper barrel bracket.
for pivot_x, pivot_z in (
    (secondary_lower_x, secondary_lower_z),
    (secondary_upper_x, secondary_upper_z),
):
    add_component(
        cylinder(
            3.1, 52.0,
            (pivot_x, -26.0, pivot_z),
            (0, 1, 0),
        )
    )

# Rounded triangular cap on the visible upper linkage connection.
link_cap_plane = y_axis_plane(0, -25.0, 0)
upper_link_cap = (
    cq.Workplane(link_cap_plane)
    .moveTo(secondary_upper_x - 7.0, secondary_upper_z - 4.0)
    .lineTo(secondary_upper_x + 3.0, secondary_upper_z - 5.0)
    .threePointArc(
        (secondary_upper_x + 8.0, secondary_upper_z - 1.0),
        (secondary_upper_x + 7.0, secondary_upper_z + 5.0),
    )
    .threePointArc(
        (secondary_upper_x + 3.0, secondary_upper_z + 8.0),
        (secondary_upper_x - 1.0, secondary_upper_z + 6.0),
    )
    .close()
    .extrude(2.6)
)
add_component(upper_link_cap)

# ---------------------------------------------------------------------------
# Turned horizontal barrel, concentric end collars, and stepped tool nose
# ---------------------------------------------------------------------------
barrel_front_x = barrel_rear_x - barrel_length
r = barrel_radius
f = barrel_front_x
b = barrel_rear_x

# The radial profile incorporates the narrow grooves and stepped shoulders.
barrel_profile = [
    (f - 29.0, 0.0),
    (f - 29.0, 0.40 * r),
    (f - 22.0, 0.40 * r),
    (f - 22.0, 0.60 * r),
    (f - 20.0, 0.60 * r),
    (f - 19.0, 0.80 * r),
    (f - 15.0, 0.80 * r),
    (f - 15.0, 0.95 * r),
    (f - 10.0, 0.95 * r),
    (f - 10.0, 1.20 * r),
    (f - 8.0, 1.35 * r),
    (f - 6.0, 1.35 * r),
    (f - 6.0, 1.29 * r),
    (f - 5.2, 1.29 * r),
    (f - 5.2, 1.40 * r),
    (f - 3.0, 1.40 * r),
    (f - 2.0, 1.28 * r),
    (f, 1.28 * r),
    (f, 1.06 * r),
    (f + 5.0, 1.06 * r),
    (f + 5.0, r),
    (b - 8.0, r),
    (b - 8.0, 1.08 * r),
    (b - 5.5, 1.08 * r),
    (b - 5.5, 1.23 * r),
    (b - 3.5, 1.23 * r),
    (b - 3.5, 1.38 * r),
    (b - 1.0, 1.38 * r),
    (b - 1.0, 1.46 * r),
    (b + 1.0, 1.46 * r),
    (b + 2.0, 1.34 * r),
    (b + 3.0, 1.34 * r),
    (b + 3.0, 1.08 * r),
    (b + 7.0, 1.08 * r),
    (b + 7.0, 0.0),
]

barrel = (
    cq.Workplane("XY")
    .polyline(barrel_profile)
    .close()
    .revolve(360.0, (0, 0), (1, 0))
    .translate((0, 0, barrel_axis_height))
)
add_component(barrel)

for collar_x in (f + 5.4, b - 9.0):
    add_component(
        annular_ring(
            r + 0.35, r - 0.15, 0.7,
            (collar_x, 0, barrel_axis_height),
            (1, 0, 0),
        )
    )

add_component(
    annular_ring(
        8.35, 7.8, 0.8,
        (f - 18.0, 0, barrel_axis_height),
        (1, 0, 0),
    )
)

# Faceted rear clamp plate, with two short rectangular terminal projections.
rear_clamp_plane = cq.Plane(
    origin=(b + 2.0, 0, barrel_axis_height),
    xDir=(0, 1, 0),
    normal=(1, 0, 0),
)
rear_clamp_outline = [
    (-14.0, -9.0),
    (-14.0, 8.0),
    (-9.0, 15.0),
    (7.0, 15.0),
    (14.0, 8.0),
    (14.0, -8.0),
    (6.0, -16.0),
    (-6.0, -16.0),
]
rear_clamp = (
    cq.Workplane(rear_clamp_plane)
    .polyline(rear_clamp_outline)
    .close()
    .extrude(4.0)
)
rear_clamp = rear_clamp.cut(
    cylinder(
        10.9, 4.4,
        (b + 1.8, 0, barrel_axis_height),
        (1, 0, 0),
    )
)
add_component(rear_clamp)

for side in (-1, 1):
    rear_terminal = (
        cq.Workplane("XY")
        .box(12.0, 5.5, 7.0)
        .edges("|X")
        .chamfer(0.7)
        .edges(">X")
        .chamfer(0.4)
        .translate((b + 11.5, side * 7.5, barrel_axis_height + 4.5))
    )
    add_component(rear_terminal)

# ---------------------------------------------------------------------------
# Compact tool-end coupling and opposed faceted gripping pads
# ---------------------------------------------------------------------------
gripper_core = (
    cq.Workplane("XY")
    .box(10.0, 9.0, 7.0)
    .edges("|X")
    .chamfer(0.8)
    .translate((f - 31.0, 0, barrel_axis_height))
)
add_component(gripper_core)

add_component(
    cylinder(
        5.2, 8.0,
        (f - 40.0, 0, barrel_axis_height),
        (1, 0, 0),
    )
)

# Closely spaced ribs on the small cylindrical coupling.
for rib_offset in (39.8, 38.3, 36.8, 35.3):
    add_component(
        annular_ring(
            5.8, 5.0, 0.55,
            (f - rib_offset, 0, barrel_axis_height),
            (1, 0, 0),
        )
    )

jaw_outline = [
    (f - 39.0, barrel_axis_height - 4.0),
    (f - 30.0, barrel_axis_height - 4.0),
    (f - 27.0, barrel_axis_height - 1.0),
    (f - 27.0, barrel_axis_height + 3.0),
    (f - 30.0, barrel_axis_height + 4.5),
    (f - 39.0, barrel_axis_height + 4.5),
    (f - 40.5, barrel_axis_height + 2.0),
    (f - 40.5, barrel_axis_height - 2.0),
]
for side in (-1, 1):
    jaw = (
        xz_plate(jaw_outline, side * 5.2, 3.0)
        .edges("|Y")
        .chamfer(0.35)
    )
    add_component(jaw)

# Small recessed circular end fitting, offset slightly below the barrel axis.
tip_z = barrel_axis_height - 2.0
add_component(
    annular_ring(
        3.7, 2.0, 3.0,
        (f - 43.0, 0, tip_z),
        (1, 0, 0),
    )
)
add_component(
    annular_ring(
        4.3, 2.0, 0.9,
        (f - 43.9, 0, tip_z),
        (1, 0, 0),
    )
)

# Preserve the individual assembled components and expose the final CAD model.
result = (
    cq.Workplane("XY")
    .newObject([cq.Compound.makeCompound(components)])
    .rotate((0, 0, 0), (0, 0, 1), assembly_rotation)
)