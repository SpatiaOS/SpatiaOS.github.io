import cadquery as cq
import math

# -----------------------------------------------------------------------------
# Parameters (millimeters, estimated from the reference image)
# -----------------------------------------------------------------------------

# Main circular fan grille / guard
grill_outer_radius = 72.0
grill_inner_radius = 34.0
grill_outer_top_z = 18.0
grill_inner_top_z = 24.0
grill_lower_z = 3.0

top_radial_rod_count = 72
bottom_radial_rod_count = 48
outer_vertical_bar_count = 80
lower_tooth_count = 56

grill_rod_radius = 0.65
outer_bar_radius = 0.75
lower_tooth_width = 1.1

# Central motor housing
motor_radius = 27.0
motor_body_bottom_z = 24.0
motor_body_height = 40.0
motor_body_top_z = motor_body_bottom_z + motor_body_height

motor_base_fin_count = 72
motor_base_fin_inner_radius = motor_radius + 1.8
motor_base_fin_outer_radius = 41.0
motor_base_fin_height = 12.0
motor_base_fin_width = 0.9

# Top cap with ventilation slots
top_lid_radius = 29.0
top_lid_thickness = 4.0
top_lid_top_z = motor_body_top_z + top_lid_thickness

# Wall mounting arm and bracket
hinge_center_x = motor_radius + 16.0
hinge_center_z = motor_body_bottom_z + 28.0

wall_plate_center_x = 135.0
wall_plate_center_z = 88.0
wall_plate_radius = 43.0
wall_plate_thickness = 9.0
wall_plate_front_x = wall_plate_center_x - wall_plate_thickness / 2.0
wall_hub_depth = 12.0

arm_start = (hinge_center_x + 16.0, 0.0, hinge_center_z + 6.0)
arm_end = (wall_plate_front_x - wall_hub_depth, 0.0, wall_plate_center_z)
arm_start_radius = 7.5
arm_end_radius = 12.5

# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------

def add_part(part):
    """Append either a CadQuery Workplane or Shape to the model part list."""
    if isinstance(part, cq.Workplane):
        model_parts.append(part.val())
    else:
        model_parts.append(part)


def make_cylinder_between(start, end, radius):
    """Create a cylinder whose axis runs between two 3D points."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)
    direction = cq.Vector(dx / length, dy / length, dz / length)

    return cq.Solid.makeCylinder(
        radius,
        length,
        cq.Vector(start[0], start[1], start[2]),
        direction,
    )


def make_cone_between(start, end, radius_start, radius_end):
    """Create a conical frustum whose axis runs between two 3D points."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)
    direction = cq.Vector(dx / length, dy / length, dz / length)

    return cq.Solid.makeCone(
        radius_start,
        radius_end,
        length,
        cq.Vector(start[0], start[1], start[2]),
        direction,
    )


def point_along_line(start, end, distance):
    """Return a point at a given distance from start toward end."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    return (
        start[0] + dx / length * distance,
        start[1] + dy / length * distance,
        start[2] + dz / length * distance,
    )


def line_length(start, end):
    """Distance between two 3D points."""
    return math.sqrt(
        (end[0] - start[0]) ** 2
        + (end[1] - start[1]) ** 2
        + (end[2] - start[2]) ** 2
    )


def make_annular_ring_z(center_radius, radial_width, z_center, height):
    """Create a horizontal annular ring centered on the Z axis."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_center - height / 2.0)
        .circle(center_radius + radial_width / 2.0)
        .circle(center_radius - radial_width / 2.0)
        .extrude(height)
        .val()
    )


def make_radial_rod(inner_radius, outer_radius, inner_z, outer_z, rod_radius, angle_deg):
    """Create a round radial grille wire between two radii."""
    angle_rad = math.radians(angle_deg)

    start = (
        inner_radius * math.cos(angle_rad),
        inner_radius * math.sin(angle_rad),
        inner_z,
    )
    end = (
        outer_radius * math.cos(angle_rad),
        outer_radius * math.sin(angle_rad),
        outer_z,
    )

    return make_cylinder_between(start, end, rod_radius)


def make_radial_box(inner_radius, outer_radius, tangential_width, height, z_center, angle_deg):
    """Create a rectangular radial part and rotate it around the grille center."""
    radial_length = outer_radius - inner_radius
    radial_center = (inner_radius + outer_radius) / 2.0

    return (
        cq.Workplane("XY")
        .box(radial_length, tangential_width, height)
        .translate((radial_center, 0.0, z_center))
        .rotate((0, 0, 0), (0, 0, 1), angle_deg)
        .val()
    )


def make_disk_x(x_start, z_center, radius, depth, fillet_radius=0.0):
    """Create a vertical circular disk whose axis is along X."""
    plane = cq.Plane(
        origin=(x_start, 0.0, z_center),
        xDir=(0.0, 1.0, 0.0),
        normal=(1.0, 0.0, 0.0),
    )

    disk = cq.Workplane(plane).circle(radius).extrude(depth)

    if fillet_radius > 0.0:
        disk = disk.edges("%CIRCLE").fillet(fillet_radius)

    return disk.val()


def make_annular_ring_x(x_start, z_center, outer_radius, inner_radius, depth):
    """Create a vertical annular ring whose axis is along X."""
    plane = cq.Plane(
        origin=(x_start, 0.0, z_center),
        xDir=(0.0, 1.0, 0.0),
        normal=(1.0, 0.0, 0.0),
    )

    return (
        cq.Workplane(plane)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(depth)
        .val()
    )


def make_slot_cut_tool(x_pos, y_pos, z_bottom, length, width, height, angle_deg):
    """Create a vertical rounded-slot cutting tool for the top cap."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_bottom)
        .center(x_pos, y_pos)
        .slot2D(length, width, angle=angle_deg)
        .extrude(height)
    )


# -----------------------------------------------------------------------------
# Build model
# -----------------------------------------------------------------------------

model_parts = []

# -----------------------------------------------------------------------------
# Lower circular grille / fan guard
# -----------------------------------------------------------------------------

# Broad outer lower rim and several concentric cage rings
grille_rings = [
    (grill_outer_radius - 2.0, 6.0, 2.0, 4.0),
    (grill_outer_radius - 3.0, 3.0, 7.0, 2.0),
    (grill_outer_radius - 3.0, 4.0, grill_outer_top_z, 2.4),
    (60.0, 1.8, 16.0, 1.8),
    (52.0, 1.6, 18.8, 1.8),
    (44.0, 1.6, 21.0, 1.8),
    (grill_inner_radius + 1.0, 4.0, grill_inner_top_z, 2.8),
    (50.0, 1.5, 7.0, 1.6),
    (34.0, 1.5, 8.5, 1.6),
]

for radius, width, z_center, height in grille_rings:
    add_part(make_annular_ring_z(radius, width, z_center, height))

# Slightly sloped upper radial cage rods from the motor ring down to the outer hoop
for index in range(top_radial_rod_count):
    angle = 360.0 * index / top_radial_rod_count
    add_part(
        make_radial_rod(
            grill_inner_radius + 1.0,
            grill_outer_radius - 4.0,
            grill_inner_top_z,
            grill_outer_top_z,
            grill_rod_radius,
            angle,
        )
    )

# Lower radial rods visible through the guard
for index in range(bottom_radial_rod_count):
    angle = 360.0 * (index + 0.5) / bottom_radial_rod_count
    add_part(
        make_radial_rod(
            18.0,
            grill_outer_radius - 6.0,
            7.5,
            grill_lower_z,
            0.48,
            angle,
        )
    )

# Vertical perimeter bars around the guard
for index in range(outer_vertical_bar_count):
    angle = 2.0 * math.pi * index / outer_vertical_bar_count
    x_pos = (grill_outer_radius - 3.2) * math.cos(angle)
    y_pos = (grill_outer_radius - 3.2) * math.sin(angle)

    add_part(
        make_cylinder_between(
            (x_pos, y_pos, 2.5),
            (x_pos, y_pos, grill_outer_top_z + 1.5),
            outer_bar_radius,
        )
    )

# Short lower teeth around the bottom edge of the guard
for index in range(lower_tooth_count):
    angle = 360.0 * index / lower_tooth_count
    add_part(
        make_radial_box(
            grill_outer_radius - 9.0,
            grill_outer_radius - 4.0,
            lower_tooth_width,
            3.0,
            -1.0,
            angle,
        )
    )

# Four small latch tabs on the outside rim
for angle in (0.0, 90.0, 180.0, 270.0):
    add_part(
        make_radial_box(
            grill_outer_radius - 1.0,
            grill_outer_radius + 5.0,
            4.0,
            5.0,
            4.0,
            angle,
        )
    )

# Five simplified fan blades below the grille, visible through the cage
for index in range(5):
    angle = 360.0 * index / 5.0 + 16.0

    blade = (
        cq.Workplane("XY")
        .box(40.0, 12.0, 1.2)
        .translate((38.0, 0.0, 9.0))
        .rotate((0, 0, 0), (0, 0, 1), angle)
    )

    add_part(blade)

# -----------------------------------------------------------------------------
# Central motor cylinder, base fins, and top vented cover
# -----------------------------------------------------------------------------

# Fin ring around the motor base
add_part(make_annular_ring_z(motor_radius + 4.0, 7.0, motor_body_bottom_z + 1.2, 5.0))

for index in range(motor_base_fin_count):
    angle = 360.0 * index / motor_base_fin_count
    add_part(
        make_radial_box(
            motor_base_fin_inner_radius,
            motor_base_fin_outer_radius,
            motor_base_fin_width,
            motor_base_fin_height,
            motor_body_bottom_z + 4.5,
            angle,
        )
    )

# Main motor body cylinder
motor_body = (
    cq.Workplane("XY")
    .workplane(offset=motor_body_bottom_z)
    .circle(motor_radius)
    .extrude(motor_body_height)
    .edges("%CIRCLE")
    .fillet(1.2)
)
add_part(motor_body)

# Small side access panel on the motor cylinder
add_part(
    make_radial_box(
        motor_radius - 0.4,
        motor_radius + 2.2,
        16.0,
        22.0,
        motor_body_bottom_z + 19.0,
        220.0,
    )
)

# Vented top cap
top_lid = (
    cq.Workplane("XY")
    .workplane(offset=motor_body_top_z)
    .circle(top_lid_radius)
    .extrude(top_lid_thickness)
    .edges("%CIRCLE")
    .fillet(0.9)
)

# Central parallel ventilation slots
central_slot_y_positions = [-10.0, -6.0, -2.0, 2.0, 6.0, 10.0]
for y_pos in central_slot_y_positions:
    slot_length = 18.0 if abs(y_pos) < 8.0 else 13.0
    slot_tool = make_slot_cut_tool(
        -1.0,
        y_pos,
        motor_body_top_z - 0.5,
        slot_length,
        2.1,
        top_lid_thickness + 1.0,
        0.0,
    )
    top_lid = top_lid.cut(slot_tool)

# Perimeter ventilation slots around the rear half of the cap
for angle_deg in range(20, 161, 10):
    radius = 22.5
    angle_rad = math.radians(angle_deg)
    x_pos = radius * math.cos(angle_rad)
    y_pos = radius * math.sin(angle_rad)

    slot_tool = make_slot_cut_tool(
        x_pos,
        y_pos,
        motor_body_top_z - 0.5,
        7.5,
        1.6,
        top_lid_thickness + 1.0,
        angle_deg,
    )
    top_lid = top_lid.cut(slot_tool)

add_part(top_lid)

# Raised rim on the top cap
add_part(make_annular_ring_z(top_lid_radius - 1.0, 1.8, top_lid_top_z + 0.25, 0.5))

# Small raised switch and screw heads on the top cover
switch_base = (
    cq.Workplane("XY")
    .box(8.0, 5.0, 2.0)
    .translate((-9.0, -5.0, top_lid_top_z + 1.0))
)
add_part(switch_base)

switch_lever = (
    cq.Workplane("XY")
    .box(2.5, 7.0, 2.8)
    .translate((-9.0, -5.0, top_lid_top_z + 3.2))
)
add_part(switch_lever)

for screw_x, screw_y in [(-18.0, -12.0), (16.0, -12.0)]:
    screw_head = (
        cq.Workplane("XY")
        .workplane(offset=top_lid_top_z)
        .center(screw_x, screw_y)
        .circle(1.5)
        .extrude(0.7)
    )
    add_part(screw_head)

# Thin raised seam line across the top cover
add_part(make_radial_box(0.0, top_lid_radius - 3.0, 0.45, 0.35, top_lid_top_z + 0.18, -38.0))

# -----------------------------------------------------------------------------
# Hinge bracket and tapered support arm
# -----------------------------------------------------------------------------

# Rectangular block attached to the side of the motor housing
side_bracket = (
    cq.Workplane("XY")
    .box(15.0, 18.0, 15.0)
    .translate((motor_radius + 6.0, 0.0, hinge_center_z))
)
add_part(side_bracket)

# Forked yoke plates
for y_pos in (-10.0, 10.0):
    fork_plate = (
        cq.Workplane("XY")
        .box(16.0, 3.0, 18.0)
        .translate((hinge_center_x, y_pos, hinge_center_z))
    )
    add_part(fork_plate)

# Pivot bolt through the yoke
add_part(
    make_cylinder_between(
        (hinge_center_x, -14.0, hinge_center_z),
        (hinge_center_x, 14.0, hinge_center_z),
        4.2,
    )
)

# Bolt heads / washers
add_part(
    make_cylinder_between(
        (hinge_center_x, 14.0, hinge_center_z),
        (hinge_center_x, 17.0, hinge_center_z),
        5.5,
    )
)
add_part(
    make_cylinder_between(
        (hinge_center_x, -17.0, hinge_center_z),
        (hinge_center_x, -14.0, hinge_center_z),
        5.5,
    )
)

# Short connector tube from hinge to the main arm
connector_start = (hinge_center_x + 4.0, 0.0, hinge_center_z + 2.5)
connector_end = arm_start
add_part(make_cylinder_between(connector_start, connector_end, 6.5))

# Main tapered support arm
add_part(make_cone_between(arm_start, arm_end, arm_start_radius, arm_end_radius))

# Collars at both ends of the arm
arm_length = line_length(arm_start, arm_end)
add_part(make_cylinder_between(arm_start, point_along_line(arm_start, arm_end, 9.0), 9.2))
add_part(
    make_cylinder_between(
        point_along_line(arm_start, arm_end, arm_length - 10.0),
        arm_end,
        14.0,
    )
)

# Thin wire-like rods seen around the arm in the reference
rear_wire_start = (motor_radius + 2.0, -14.0, top_lid_top_z + 5.0)
rear_wire_end = (wall_plate_front_x - 24.0, -14.0, top_lid_top_z + 7.0)
add_part(make_cylinder_between(rear_wire_start, rear_wire_end, 0.45))

strut_start = point_along_line(arm_start, arm_end, arm_length * 0.70)
strut_start = (strut_start[0], 0.0, strut_start[2] - 10.0)
strut_end = (wall_plate_front_x - 15.0, 0.0, wall_plate_center_z - 35.0)
add_part(make_cylinder_between(strut_start, strut_end, 1.2))
add_part(cq.Solid.makeSphere(2.0, cq.Vector(strut_end[0], strut_end[1], strut_end[2])))

dangling_rod_start = point_along_line(arm_start, arm_end, arm_length * 0.66)
dangling_rod_start = (dangling_rod_start[0], 8.0, dangling_rod_start[2] - 4.0)
dangling_rod_end = (dangling_rod_start[0] + 7.0, 8.0, dangling_rod_start[2] - 28.0)
add_part(make_cylinder_between(dangling_rod_start, dangling_rod_end, 0.9))
add_part(cq.Solid.makeSphere(1.7, cq.Vector(dangling_rod_end[0], dangling_rod_end[1], dangling_rod_end[2])))

# -----------------------------------------------------------------------------
# Circular wall mounting plate and hub
# -----------------------------------------------------------------------------

# Large vertical wall plate
add_part(
    make_disk_x(
        wall_plate_front_x,
        wall_plate_center_z,
        wall_plate_radius,
        wall_plate_thickness,
        fillet_radius=2.6,
    )
)

# Raised outside lip on the front of the wall plate
add_part(
    make_annular_ring_x(
        wall_plate_front_x - 2.4,
        wall_plate_center_z,
        wall_plate_radius,
        wall_plate_radius - 5.0,
        2.4,
    )
)

# Subtle inner circular face detail
add_part(
    make_annular_ring_x(
        wall_plate_front_x - 1.4,
        wall_plate_center_z,
        wall_plate_radius * 0.76,
        wall_plate_radius * 0.72,
        1.4,
    )
)

# Central cylindrical hub where the arm meets the wall plate
add_part(
    make_disk_x(
        wall_plate_front_x - wall_hub_depth,
        wall_plate_center_z,
        15.5,
        wall_hub_depth,
        fillet_radius=1.2,
    )
)

# Small decorative collar at the wall hub
add_part(
    make_annular_ring_x(
        wall_plate_front_x - wall_hub_depth - 2.0,
        wall_plate_center_z,
        18.0,
        14.0,
        2.0,
    )
)

# -----------------------------------------------------------------------------
# Final compounded result
# -----------------------------------------------------------------------------

result = cq.Compound.makeCompound(model_parts)