import math
import cadquery as cq

# -----------------------------------------------------------------------------
# Parameters
# -----------------------------------------------------------------------------

# Reel spool proportions (estimated from the reference image)
flange_radius = 82.0
flange_thickness = 12.0
flange_edge_fillet = 1.8
drum_length = 100.0
drum_radius = 43.0

# Coiled hose on the reel
hose_radius = 4.2
hose_coil_center_radius = 50.0
hose_pitch = 7.2
hose_turn_count = 13

# Front flange bolt / mounting holes
bolt_pattern_radius = 32.0
bolt_hole_radius = 2.5
bolt_boss_radius = 4.8
bolt_boss_height = 3.2
front_lip_width = 5.0
front_lip_height = 1.8

# Pipe / hose details
pipe_radius = 4.0
pipe_coupling_radius = 6.2

# Left-side vertical pipe and upper valve
left_pipe_y = -118.0
left_pipe_bottom_z = -72.0
left_pipe_top_z = 156.0
top_body_diameter = 23.0
top_body_height = 22.0
top_cap_diameter = 26.0
top_cap_height = 8.0
top_handwheel_major_radius = 6.8
top_handwheel_tube_radius = 1.0

# Lower hanging pipe, valve and nozzle
lower_pipe_y = -16.0
lower_pipe_top_z = -73.0
lower_pipe_bottom_z = -156.0
lower_valve_radius = 10.0
lower_nozzle_length = 36.0
lower_nozzle_top_radius = 6.8
lower_nozzle_tip_radius = 2.7

# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------

def add_workplane_shapes(shape_list, workplane):
    """Append all solids from a CadQuery workplane to the model shape list."""
    shape_list.extend(workplane.vals())


def make_cylinder_between(start_point, end_point, radius):
    """Create a cylinder between two arbitrary 3D points."""
    dx = end_point[0] - start_point[0]
    dy = end_point[1] - start_point[1]
    dz = end_point[2] - start_point[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    if length <= 1e-6:
        return None

    direction = cq.Vector(dx / length, dy / length, dz / length)
    return cq.Solid.makeCylinder(radius, length, cq.Vector(*start_point), direction)


def make_tube_along_points(points, radius, add_joint_spheres=True):
    """Approximate a bent tube using short cylinders and spherical joints."""
    tube_shapes = []

    for start_point, end_point in zip(points[:-1], points[1:]):
        segment = make_cylinder_between(start_point, end_point, radius)
        if segment is not None:
            tube_shapes.append(segment)

    if add_joint_spheres:
        for point in points:
            tube_shapes.append(cq.Solid.makeSphere(radius, cq.Vector(*point)))

    return tube_shapes


def quadratic_bezier_points(start_point, control_point, end_point, segment_count):
    """Generate points along a quadratic Bezier curve."""
    points = []

    for i in range(segment_count + 1):
        t = i / segment_count
        one_minus_t = 1.0 - t

        x = (
            one_minus_t * one_minus_t * start_point[0]
            + 2.0 * one_minus_t * t * control_point[0]
            + t * t * end_point[0]
        )
        y = (
            one_minus_t * one_minus_t * start_point[1]
            + 2.0 * one_minus_t * t * control_point[1]
            + t * t * end_point[1]
        )
        z = (
            one_minus_t * one_minus_t * start_point[2]
            + 2.0 * one_minus_t * t * control_point[2]
            + t * t * end_point[2]
        )

        points.append((x, y, z))

    return points


def make_annular_cylinder_x(outer_radius, inner_radius, x_start, length):
    """Create an annular cylinder whose axis follows the global X direction."""
    return (
        cq.Workplane("YZ")
        .workplane(offset=x_start)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(length)
    )


# -----------------------------------------------------------------------------
# Derived dimensions
# -----------------------------------------------------------------------------

drum_half_length = drum_length / 2.0

rear_flange_x_start = -drum_half_length - flange_thickness
rear_flange_outer_x = rear_flange_x_start

front_flange_x_start = drum_half_length
front_flange_outer_x = front_flange_x_start + flange_thickness

left_pipe_x = rear_flange_x_start + flange_thickness * 0.5
lower_pipe_x = front_flange_outer_x + 2.0

bolt_angles_deg = [45.0, 135.0, 225.0, 315.0]
front_bolt_points_yz = [
    (
        bolt_pattern_radius * math.cos(math.radians(angle)),
        bolt_pattern_radius * math.sin(math.radians(angle)),
    )
    for angle in bolt_angles_deg
]

model_shapes = []

# -----------------------------------------------------------------------------
# Main hose reel spool
# -----------------------------------------------------------------------------

# Central drum/core hidden behind the wound hose.
drum = (
    cq.Workplane("YZ")
    .workplane(offset=-drum_half_length)
    .circle(drum_radius)
    .extrude(drum_length)
)

# Rear flange disk.
rear_flange = (
    cq.Workplane("YZ")
    .workplane(offset=rear_flange_x_start)
    .circle(flange_radius)
    .extrude(flange_thickness)
    .edges()
    .fillet(flange_edge_fillet)
)

# Front flange disk with through mounting holes.
front_flange_base = (
    cq.Workplane("YZ")
    .workplane(offset=front_flange_x_start)
    .circle(flange_radius)
    .extrude(flange_thickness)
    .edges()
    .fillet(flange_edge_fillet)
)

front_hole_cutters = (
    cq.Workplane("YZ")
    .workplane(offset=front_flange_x_start - 1.0)
    .pushPoints(front_bolt_points_yz)
    .circle(bolt_hole_radius)
    .extrude(flange_thickness + 2.0)
)

front_flange = front_flange_base.cut(front_hole_cutters)

# Raised annular rim/lip on the front and rear visible faces.
front_face_lip = make_annular_cylinder_x(
    flange_radius,
    flange_radius - front_lip_width,
    front_flange_outer_x,
    front_lip_height,
)

rear_face_lip = make_annular_cylinder_x(
    flange_radius,
    flange_radius - front_lip_width,
    rear_flange_outer_x - front_lip_height,
    front_lip_height,
)

# Raised small bosses around the front mounting holes.
front_bolt_bosses = (
    cq.Workplane("YZ")
    .workplane(offset=front_flange_outer_x)
    .pushPoints(front_bolt_points_yz)
    .circle(bolt_boss_radius)
    .extrude(bolt_boss_height)
)

front_bolt_boss_holes = (
    cq.Workplane("YZ")
    .workplane(offset=front_flange_outer_x - 0.25)
    .pushPoints(front_bolt_points_yz)
    .circle(bolt_hole_radius)
    .extrude(bolt_boss_height + 0.5)
)

front_bolt_rings = front_bolt_bosses.cut(front_bolt_boss_holes)

for reel_part in [
    drum,
    rear_flange,
    front_flange,
    front_face_lip,
    rear_face_lip,
    front_bolt_rings,
]:
    add_workplane_shapes(model_shapes, reel_part)

# -----------------------------------------------------------------------------
# Wound hose represented by closely spaced torus turns around the drum
# -----------------------------------------------------------------------------

coil_span = (hose_turn_count - 1) * hose_pitch
first_coil_x = -coil_span / 2.0

for index in range(hose_turn_count):
    coil_x = first_coil_x + index * hose_pitch
    hose_turn = cq.Solid.makeTorus(
        hose_coil_center_radius,
        hose_radius,
        cq.Vector(coil_x, 0.0, 0.0),
        cq.Vector(1.0, 0.0, 0.0),
    )
    model_shapes.append(hose_turn)

# -----------------------------------------------------------------------------
# Rear/left supply pipe rising upward with a smooth lower bend
# -----------------------------------------------------------------------------

spool_exit_point = (left_pipe_x, -48.0, -66.0)
bend_control_point = (left_pipe_x, -132.0, -114.0)
vertical_pipe_start_point = (left_pipe_x, left_pipe_y, left_pipe_bottom_z)

left_bend_points = quadratic_bezier_points(
    spool_exit_point,
    bend_control_point,
    vertical_pipe_start_point,
    18,
)
left_pipe_points = left_bend_points + [(left_pipe_x, left_pipe_y, left_pipe_top_z)]

model_shapes.extend(make_tube_along_points(left_pipe_points, pipe_radius))

# Coupling socket where the rear pipe enters the reel.
model_shapes.append(
    cq.Solid.makeCylinder(
        pipe_coupling_radius,
        16.0,
        cq.Vector(left_pipe_x, spool_exit_point[1] - 8.0, spool_exit_point[2]),
        cq.Vector(0.0, 1.0, 0.0),
    )
)

# Collars on the upper vertical pipe.
for collar_z in [132.0, 145.0]:
    model_shapes.append(
        cq.Solid.makeCylinder(
            pipe_coupling_radius,
            8.0,
            cq.Vector(left_pipe_x, left_pipe_y, collar_z),
            cq.Vector(0.0, 0.0, 1.0),
        )
    )

# -----------------------------------------------------------------------------
# Upper valve assembly with hex cap and side handwheel
# -----------------------------------------------------------------------------

top_body_bottom_z = left_pipe_top_z + 4.0
top_body_center_z = top_body_bottom_z + top_body_height * 0.5
top_cap_bottom_z = top_body_bottom_z + top_body_height

# Lower transition into the valve body.
model_shapes.append(
    cq.Solid.makeCone(
        pipe_coupling_radius * 0.75,
        top_body_diameter * 0.42,
        8.0,
        cq.Vector(left_pipe_x, left_pipe_y, top_body_bottom_z - 8.0),
        cq.Vector(0.0, 0.0, 1.0),
    )
)

# Hexagonal valve body.
top_body = (
    cq.Workplane("XY")
    .workplane(offset=top_body_bottom_z)
    .center(left_pipe_x, left_pipe_y)
    .polygon(6, top_body_diameter)
    .extrude(top_body_height)
)

# Top hex cap.
top_cap = (
    cq.Workplane("XY")
    .workplane(offset=top_cap_bottom_z)
    .center(left_pipe_x, left_pipe_y)
    .polygon(6, top_cap_diameter)
    .extrude(top_cap_height)
)

# Small top plug.
model_shapes.append(
    cq.Solid.makeCylinder(
        pipe_radius,
        5.0,
        cq.Vector(left_pipe_x, left_pipe_y, top_cap_bottom_z + top_cap_height),
        cq.Vector(0.0, 0.0, 1.0),
    )
)

add_workplane_shapes(model_shapes, top_body)
add_workplane_shapes(model_shapes, top_cap)

# Side valve port and handwheel.
side_valve_z = top_body_center_z
side_port_length = 18.0
side_port_radius = 5.8
side_port_outer_y = left_pipe_y - side_port_length * 0.5
handwheel_stem_length = 12.0
handwheel_center_y = side_port_outer_y - handwheel_stem_length - 1.5

model_shapes.append(
    cq.Solid.makeCylinder(
        side_port_radius,
        side_port_length,
        cq.Vector(left_pipe_x, left_pipe_y - side_port_length * 0.5, side_valve_z),
        cq.Vector(0.0, 1.0, 0.0),
    )
)

model_shapes.append(
    cq.Solid.makeCylinder(
        2.8,
        handwheel_stem_length,
        cq.Vector(left_pipe_x, side_port_outer_y, side_valve_z),
        cq.Vector(0.0, -1.0, 0.0),
    )
)

model_shapes.append(
    cq.Solid.makeTorus(
        top_handwheel_major_radius,
        top_handwheel_tube_radius,
        cq.Vector(left_pipe_x, handwheel_center_y, side_valve_z),
        cq.Vector(0.0, 1.0, 0.0),
    )
)

model_shapes.append(
    cq.Solid.makeCylinder(
        3.0,
        4.0,
        cq.Vector(left_pipe_x, handwheel_center_y - 2.0, side_valve_z),
        cq.Vector(0.0, 1.0, 0.0),
    )
)

# Four small spokes in the handwheel.
for spoke_angle in [0.0, 90.0, 180.0, 270.0]:
    spoke_end = (
        left_pipe_x + top_handwheel_major_radius * 0.78 * math.cos(math.radians(spoke_angle)),
        handwheel_center_y,
        side_valve_z + top_handwheel_major_radius * 0.78 * math.sin(math.radians(spoke_angle)),
    )
    model_shapes.append(
        make_cylinder_between(
            (left_pipe_x, handwheel_center_y, side_valve_z),
            spoke_end,
            0.65,
        )
    )

# -----------------------------------------------------------------------------
# Front/lower hanging pipe, valve lever and conical nozzle
# -----------------------------------------------------------------------------

lower_pipe_points = [
    (lower_pipe_x, lower_pipe_y, lower_pipe_top_z),
    (lower_pipe_x, lower_pipe_y, lower_pipe_bottom_z),
]
model_shapes.extend(make_tube_along_points(lower_pipe_points, pipe_radius))

# Sleeve at the reel outlet and lower pipe collars.
for sleeve_z, sleeve_height in [
    (lower_pipe_top_z - 4.0, 12.0),
    (-126.0, 8.0),
    (-142.0, 8.0),
]:
    model_shapes.append(
        cq.Solid.makeCylinder(
            pipe_coupling_radius,
            sleeve_height,
            cq.Vector(lower_pipe_x, lower_pipe_y, sleeve_z),
            cq.Vector(0.0, 0.0, 1.0),
        )
    )

# Hex coupling just above the lower valve.
lower_hex_coupling = (
    cq.Workplane("XY")
    .workplane(offset=-154.0)
    .center(lower_pipe_x, lower_pipe_y)
    .polygon(6, 15.0)
    .extrude(8.0)
)
add_workplane_shapes(model_shapes, lower_hex_coupling)

# Rounded lower valve body.
lower_valve_center_z = -174.0

model_shapes.append(
    cq.Solid.makeSphere(
        lower_valve_radius,
        cq.Vector(lower_pipe_x, lower_pipe_y, lower_valve_center_z),
    )
)

model_shapes.append(
    cq.Solid.makeCylinder(
        7.5,
        18.0,
        cq.Vector(lower_pipe_x, lower_pipe_y - 9.0, lower_valve_center_z),
        cq.Vector(0.0, 1.0, 0.0),
    )
)

# Flat lever handle projecting to one side of the valve.
lower_handle_length = 36.0
lower_handle_width_x = 4.0
lower_handle_thickness_z = 3.0
lower_handle_center = (
    lower_pipe_x,
    lower_pipe_y - lower_valve_radius - lower_handle_length * 0.5,
    lower_valve_center_z + 3.0,
)

lower_handle = (
    cq.Workplane("XY")
    .box(lower_handle_width_x, lower_handle_length, lower_handle_thickness_z)
    .translate(lower_handle_center)
)
add_workplane_shapes(model_shapes, lower_handle)

# Rounded knob at the lever tip.
handle_knob_y = lower_pipe_y - lower_valve_radius - lower_handle_length

model_shapes.append(
    cq.Solid.makeCylinder(
        2.4,
        lower_handle_width_x + 3.0,
        cq.Vector(lower_pipe_x - (lower_handle_width_x + 3.0) * 0.5, handle_knob_y, lower_valve_center_z + 3.0),
        cq.Vector(1.0, 0.0, 0.0),
    )
)

# Downward tapered nozzle.
nozzle_start_z = lower_valve_center_z - lower_valve_radius + 2.0
model_shapes.append(
    cq.Solid.makeCone(
        lower_nozzle_top_radius,
        lower_nozzle_tip_radius,
        lower_nozzle_length,
        cq.Vector(lower_pipe_x, lower_pipe_y, nozzle_start_z),
        cq.Vector(0.0, 0.0, -1.0),
    )
)

model_shapes.append(
    cq.Solid.makeCylinder(
        lower_nozzle_tip_radius,
        4.0,
        cq.Vector(lower_pipe_x, lower_pipe_y, nozzle_start_z - lower_nozzle_length),
        cq.Vector(0.0, 0.0, -1.0),
    )
)

# -----------------------------------------------------------------------------
# Final model
# -----------------------------------------------------------------------------

result = cq.Workplane("XY").add(cq.Compound.makeCompound(model_shapes))