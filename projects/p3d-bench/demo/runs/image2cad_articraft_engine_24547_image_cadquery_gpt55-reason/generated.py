import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters
# Coordinate interpretation:
#   X = crankshaft / flywheel axis
#   Y = horizontal cylinder axis
#   Z = vertical direction
# ---------------------------------------------------------------------------

# Base plate
base_width_x = 100.0
base_depth_y = 120.0
base_center_y = -25.0
base_thickness_z = 5.0
base_corner_radius = 4.5

base_rim_width = 4.0
base_rim_height_z = 2.0
base_bolt_radius = 1.7
base_bolt_height_z = 1.0

# Raised plinth below the crank and flywheels
plinth_width_x = 74.0
plinth_depth_y = 56.0
plinth_center_y = 0.0
plinth_height_z = 5.0

# Main crankshaft and flywheels
shaft_y = 0.0
shaft_z = 50.0
shaft_radius = 3.2
shaft_length_x = 112.0

front_wheel_center_x = -32.0
rear_wheel_center_x = 32.0
flywheel_outer_radius = 31.0
flywheel_rim_inner_radius = 23.7
flywheel_web_radius = 24.2
flywheel_rim_thickness_x = 11.5
flywheel_web_thickness_x = 5.5
flywheel_hub_radius = 8.2
flywheel_hub_length_x = 18.0

flywheel_opening_count = 5
flywheel_opening_pitch_radius = 15.2
flywheel_opening_radius = 6.4
flywheel_opening_phase_degrees = 18.0

flywheel_hub_bolt_count = 4
flywheel_hub_bolt_circle_radius = 5.9
flywheel_hub_bolt_radius = 0.9
flywheel_hub_bolt_height_x = 1.4

shaft_collar_radius = 5.3
shaft_collar_width_x = 4.0
front_shaft_nose_radius = 2.45
front_shaft_nose_length_x = 14.0
rear_shaft_nose_radius = 2.45
rear_shaft_nose_length_x = 10.0

# Bearing stands and side supports
support_bottom_z = base_thickness_z + plinth_height_z
support_plate_thickness_x = 7.0
bearing_support_x_positions = [-19.0, 19.0]
bearing_outer_radius = 8.3
bearing_width_x = 9.5

# Horizontal ribbed cylinder
cylinder_center_x = 0.0
cylinder_axis_z = shaft_z
cylinder_barrel_center_y = -76.0
cylinder_barrel_length_y = 48.0
cylinder_core_radius = 13.2
cylinder_fin_radius = 15.4
cylinder_fin_width_y = 0.75
cylinder_fin_spacing_y = 2.35
cylinder_fin_count = 18
cylinder_fin_margin_y = 3.0

cylinder_rear_cap_radius = 15.6
cylinder_rear_cap_length_y = 4.5
cylinder_rear_cap_center_y = -101.0

cylinder_front_head_radius = 17.2
cylinder_front_head_length_y = 12.0
cylinder_front_head_center_y = -46.0

cylinder_front_flange_radius = 18.4
cylinder_front_flange_length_y = 4.0
cylinder_front_flange_center_y = -38.5

cylinder_gland_radius = 6.6
cylinder_gland_length_y = 7.0
cylinder_gland_center_y = -33.0

# Cylinder cradle and pedestal
cylinder_saddle_width_x = 30.0
cylinder_saddle_length_y = 54.0
cylinder_saddle_height_z = 4.5
cylinder_support_width_x = 24.0
cylinder_support_length_y = 38.0

# Top valve block and vertical pipe
valve_block_size_x = 12.0
valve_block_length_y = 14.0
valve_block_height_z = 4.0
valve_pipe_outer_radius = 3.2
valve_pipe_inner_radius = 2.0
valve_pipe_height_z = 12.0
valve_pipe_lip_outer_radius = 3.8
valve_pipe_lip_height_z = 1.4

# Crosshead, piston rod, and guides
crosshead_y = -20.0
crosshead_size_x = 14.0
crosshead_length_y = 7.0
crosshead_height_z = 8.0
piston_rod_radius = 1.8

guide_length_y = 26.0
guide_center_y = -23.0
guide_rail_size_x = 2.6
guide_rail_size_z = 2.6
guide_rail_offset_x = 8.0
guide_rail_offset_z = 6.0

# Crank and connecting rod
crank_throw_radius = 12.0
crank_angle_degrees = 48.0
crank_disk_radius = 7.2
crank_disk_width_x = 13.0
crank_arm_thickness_x = 10.0
crank_arm_width = 4.6
crank_pin_radius = 3.2
crank_pin_length_x = 22.0
crank_nut_outer_radius = 3.2
crank_nut_thickness_x = 2.0

connecting_rod_thickness_x = 4.5
connecting_rod_width = 3.6
connecting_big_end_radius = 5.4
connecting_big_end_width_x = 7.0
connecting_small_end_radius = 4.2
connecting_small_end_width_x = 6.0

# Small eccentric / valve linkage detail
valve_rod_radius = 0.8
valve_rod_x = 7.0


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def cylinder_x_shape(radius, length, center):
    """Create a solid cylinder oriented along X."""
    center_x, center_y, center_z = center
    return cq.Solid.makeCylinder(
        radius,
        length,
        cq.Vector(center_x - length / 2.0, center_y, center_z),
        cq.Vector(1, 0, 0),
    )


def cylinder_y_shape(radius, length, center):
    """Create a solid cylinder oriented along Y."""
    center_x, center_y, center_z = center
    return cq.Solid.makeCylinder(
        radius,
        length,
        cq.Vector(center_x, center_y - length / 2.0, center_z),
        cq.Vector(0, 1, 0),
    )


def cylinder_z_shape(radius, height, center):
    """Create a solid cylinder oriented along Z."""
    center_x, center_y, center_z = center
    return cq.Solid.makeCylinder(
        radius,
        height,
        cq.Vector(center_x, center_y, center_z - height / 2.0),
        cq.Vector(0, 0, 1),
    )


def make_cylinder_x(radius, length, center):
    """Return a Workplane containing an X-axis cylinder."""
    return cq.Workplane("XY").add(cylinder_x_shape(radius, length, center))


def make_cylinder_y(radius, length, center):
    """Return a Workplane containing a Y-axis cylinder."""
    return cq.Workplane("XY").add(cylinder_y_shape(radius, length, center))


def make_cylinder_z(radius, height, center):
    """Return a Workplane containing a Z-axis cylinder."""
    return cq.Workplane("XY").add(cylinder_z_shape(radius, height, center))


def make_cylinder_between(radius, start_point, end_point):
    """Create a cylinder between two arbitrary 3D points."""
    sx, sy, sz = start_point
    ex, ey, ez = end_point
    dx = ex - sx
    dy = ey - sy
    dz = ez - sz
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    direction = cq.Vector(dx / length, dy / length, dz / length)
    shape = cq.Solid.makeCylinder(radius, length, cq.Vector(sx, sy, sz), direction)
    return cq.Workplane("XY").add(shape)


def make_annular_cylinder_x(outer_radius, inner_radius, length, center):
    """Create a hollow annular cylinder oriented along X."""
    outer = cylinder_x_shape(outer_radius, length, center)
    inner = cylinder_x_shape(inner_radius, length + 2.0, center)
    return cq.Workplane("XY").add(outer.cut(inner))


def make_annular_cylinder_y(outer_radius, inner_radius, length, center):
    """Create a hollow annular cylinder oriented along Y."""
    outer = cylinder_y_shape(outer_radius, length, center)
    inner = cylinder_y_shape(inner_radius, length + 2.0, center)
    return cq.Workplane("XY").add(outer.cut(inner))


def make_tube_z(outer_radius, inner_radius, height, center):
    """Create a short hollow vertical pipe."""
    outer = cylinder_z_shape(outer_radius, height, center)
    inner = cylinder_z_shape(inner_radius, height + 2.0, center)
    return cq.Workplane("XY").add(outer.cut(inner))


def make_rounded_box(size_x, size_y, size_z, center, fillet_radius=0.0):
    """Create a centered box with optional rounded vertical edges."""
    box = cq.Workplane("XY").box(size_x, size_y, size_z).translate(center)

    if fillet_radius > 0.0:
        box = box.edges("|Z").fillet(fillet_radius)

    return box


def make_triangular_prism_x(points_yz, thickness_x, center_x):
    """Create a triangular prism plate from a YZ profile, extruded along X."""
    return (
        cq.Workplane("YZ", origin=(center_x - thickness_x / 2.0, 0, 0))
        .polyline(points_yz)
        .close()
        .extrude(thickness_x)
    )


def make_bar_between_yz(x_center, start_yz, end_yz, thickness_x, width):
    """Create a rectangular bar between two points in the YZ plane."""
    start_y, start_z = start_yz
    end_y, end_z = end_yz

    dy = end_y - start_y
    dz = end_z - start_z
    length = math.sqrt(dy * dy + dz * dz)
    angle_degrees = math.degrees(math.atan2(dz, dy))

    mid_y = (start_y + end_y) / 2.0
    mid_z = (start_z + end_z) / 2.0

    return (
        cq.Workplane("XY")
        .box(thickness_x, length, width)
        .translate((x_center, mid_y, mid_z))
        .rotate(
            (x_center, mid_y, mid_z),
            (x_center + 1.0, mid_y, mid_z),
            angle_degrees,
        )
    )


def make_hex_prism_x(outer_radius, length, center):
    """Create a small hexagonal nut oriented along X."""
    center_x, center_y, center_z = center
    return (
        cq.Workplane("YZ", origin=(center_x - length / 2.0, 0, 0))
        .center(center_y, center_z)
        .polygon(6, outer_radius * 2.0)
        .extrude(length)
    )


def make_flywheel(center_x):
    """Create one flywheel with rim, recessed web, circular openings, and hub."""
    flywheel_components = []

    # Thick annular outer rim.
    flywheel_components.append(
        make_annular_cylinder_x(
            flywheel_outer_radius,
            flywheel_rim_inner_radius,
            flywheel_rim_thickness_x,
            (center_x, shaft_y, shaft_z),
        )
    )

    # Thin central web with five round lightening holes.
    web_shape = cylinder_x_shape(
        flywheel_web_radius,
        flywheel_web_thickness_x,
        (center_x, shaft_y, shaft_z),
    )

    for opening_index in range(flywheel_opening_count):
        angle = math.radians(
            flywheel_opening_phase_degrees
            + opening_index * 360.0 / flywheel_opening_count
        )
        opening_y = shaft_y + flywheel_opening_pitch_radius * math.cos(angle)
        opening_z = shaft_z + flywheel_opening_pitch_radius * math.sin(angle)

        opening_cutter = cylinder_x_shape(
            flywheel_opening_radius,
            flywheel_web_thickness_x + 4.0,
            (center_x, opening_y, opening_z),
        )
        web_shape = web_shape.cut(opening_cutter)

    flywheel_components.append(cq.Workplane("XY").add(web_shape))

    # Prominent central hub.
    flywheel_components.append(
        make_cylinder_x(
            flywheel_hub_radius,
            flywheel_hub_length_x,
            (center_x, shaft_y, shaft_z),
        )
    )

    return flywheel_components


def build_model():
    """Build the complete twin-flywheel horizontal steam-engine style assembly."""
    component_workplanes = []

    # -----------------------------------------------------------------------
    # Base slab, raised rim, and bolt heads
    # -----------------------------------------------------------------------
    base_top_z = base_thickness_z
    base_x_min = -base_width_x / 2.0
    base_x_max = base_width_x / 2.0
    base_y_min = base_center_y - base_depth_y / 2.0
    base_y_max = base_center_y + base_depth_y / 2.0

    component_workplanes.append(
        make_rounded_box(
            base_width_x,
            base_depth_y,
            base_thickness_z,
            (0, base_center_y, base_thickness_z / 2.0),
            base_corner_radius,
        )
    )

    rim_center_z = base_top_z + base_rim_height_z / 2.0

    # Four raised perimeter strips create the stepped base lip.
    component_workplanes.append(
        make_rounded_box(
            base_width_x,
            base_rim_width,
            base_rim_height_z,
            (0, base_y_min + base_rim_width / 2.0, rim_center_z),
            1.0,
        )
    )
    component_workplanes.append(
        make_rounded_box(
            base_width_x,
            base_rim_width,
            base_rim_height_z,
            (0, base_y_max - base_rim_width / 2.0, rim_center_z),
            1.0,
        )
    )
    component_workplanes.append(
        make_rounded_box(
            base_rim_width,
            base_depth_y,
            base_rim_height_z,
            (base_x_min + base_rim_width / 2.0, base_center_y, rim_center_z),
            1.0,
        )
    )
    component_workplanes.append(
        make_rounded_box(
            base_rim_width,
            base_depth_y,
            base_rim_height_z,
            (base_x_max - base_rim_width / 2.0, base_center_y, rim_center_z),
            1.0,
        )
    )

    # Small round bolt heads at the four base corners.
    for bolt_x in (base_x_min + 8.0, base_x_max - 8.0):
        for bolt_y in (base_y_min + 8.0, base_y_max - 8.0):
            component_workplanes.append(
                make_cylinder_z(
                    base_bolt_radius,
                    base_bolt_height_z,
                    (
                        bolt_x,
                        bolt_y,
                        base_top_z + base_rim_height_z + base_bolt_height_z / 2.0,
                    ),
                )
            )

    # Raised central plinth below the crankshaft area.
    component_workplanes.append(
        make_rounded_box(
            plinth_width_x,
            plinth_depth_y,
            plinth_height_z,
            (0, plinth_center_y, base_top_z + plinth_height_z / 2.0),
            2.0,
        )
    )

    # -----------------------------------------------------------------------
    # Bearing stands and crankshaft
    # -----------------------------------------------------------------------
    support_plate_profile_yz = [
        (shaft_y - 24.0, support_bottom_z),
        (shaft_y + 23.0, support_bottom_z),
        (shaft_y + 2.0, shaft_z + 6.0),
    ]

    for support_x in bearing_support_x_positions:
        # Triangular side plate rising from the plinth to the shaft.
        component_workplanes.append(
            make_triangular_prism_x(
                support_plate_profile_yz,
                support_plate_thickness_x,
                support_x,
            )
        )

        # Lower block and bearing cap.
        component_workplanes.append(
            make_rounded_box(
                12.0,
                20.0,
                18.0,
                (support_x, shaft_y, support_bottom_z + 9.0),
                1.0,
            )
        )
        component_workplanes.append(
            make_rounded_box(
                16.0,
                16.0,
                8.0,
                (support_x, shaft_y, shaft_z - 5.0),
                1.0,
            )
        )

        # Round bearing boss surrounding the shaft.
        component_workplanes.append(
            make_cylinder_x(
                bearing_outer_radius,
                bearing_width_x,
                (support_x, shaft_y, shaft_z),
            )
        )

    # Main shaft passing through both flywheels.
    component_workplanes.append(make_cylinder_x(shaft_radius, shaft_length_x, (0, shaft_y, shaft_z)))

    # Collars between flywheel hubs and bearing stands.
    component_workplanes.append(
        make_cylinder_x(
            shaft_collar_radius,
            shaft_collar_width_x,
            (
                front_wheel_center_x
                + flywheel_rim_thickness_x / 2.0
                + shaft_collar_width_x / 2.0,
                shaft_y,
                shaft_z,
            ),
        )
    )
    component_workplanes.append(
        make_cylinder_x(
            shaft_collar_radius,
            shaft_collar_width_x,
            (
                rear_wheel_center_x
                - flywheel_rim_thickness_x / 2.0
                - shaft_collar_width_x / 2.0,
                shaft_y,
                shaft_z,
            ),
        )
    )

    # Small protruding shaft noses on the outside faces.
    component_workplanes.append(
        make_cylinder_x(
            front_shaft_nose_radius,
            front_shaft_nose_length_x,
            (
                front_wheel_center_x
                - flywheel_hub_length_x / 2.0
                - front_shaft_nose_length_x / 2.0,
                shaft_y,
                shaft_z,
            ),
        )
    )
    component_workplanes.append(
        make_cylinder_x(
            rear_shaft_nose_radius,
            rear_shaft_nose_length_x,
            (
                rear_wheel_center_x
                + flywheel_hub_length_x / 2.0
                + rear_shaft_nose_length_x / 2.0,
                shaft_y,
                shaft_z,
            ),
        )
    )

    # -----------------------------------------------------------------------
    # Flywheels
    # -----------------------------------------------------------------------
    component_workplanes.extend(make_flywheel(front_wheel_center_x))
    component_workplanes.extend(make_flywheel(rear_wheel_center_x))

    # Bolt heads around the outside faces of the hubs.
    for wheel_center_x, outward_sign in (
        (front_wheel_center_x, -1.0),
        (rear_wheel_center_x, 1.0),
    ):
        face_x = wheel_center_x + outward_sign * flywheel_hub_length_x / 2.0
        bolt_center_x = face_x + outward_sign * flywheel_hub_bolt_height_x / 2.0

        for bolt_index in range(flywheel_hub_bolt_count):
            angle = math.radians(45.0 + bolt_index * 360.0 / flywheel_hub_bolt_count)
            bolt_y = shaft_y + flywheel_hub_bolt_circle_radius * math.cos(angle)
            bolt_z = shaft_z + flywheel_hub_bolt_circle_radius * math.sin(angle)

            component_workplanes.append(
                make_cylinder_x(
                    flywheel_hub_bolt_radius,
                    flywheel_hub_bolt_height_x,
                    (bolt_center_x, bolt_y, bolt_z),
                )
            )

    # -----------------------------------------------------------------------
    # Ribbed horizontal cylinder and support cradle
    # -----------------------------------------------------------------------
    cylinder_saddle_top_z = cylinder_axis_z - cylinder_core_radius
    cylinder_saddle_center_z = cylinder_saddle_top_z - cylinder_saddle_height_z / 2.0
    cylinder_saddle_bottom_z = cylinder_saddle_top_z - cylinder_saddle_height_z
    cylinder_support_height_z = cylinder_saddle_bottom_z - base_top_z

    # Saddle directly under the cylinder.
    component_workplanes.append(
        make_rounded_box(
            cylinder_saddle_width_x,
            cylinder_saddle_length_y,
            cylinder_saddle_height_z,
            (cylinder_center_x, cylinder_barrel_center_y, cylinder_saddle_center_z),
            1.0,
        )
    )

    # Vertical pedestal beneath the saddle.
    component_workplanes.append(
        make_rounded_box(
            cylinder_support_width_x,
            cylinder_support_length_y,
            cylinder_support_height_z,
            (
                cylinder_center_x,
                cylinder_barrel_center_y + 4.0,
                base_top_z + cylinder_support_height_z / 2.0,
            ),
            1.5,
        )
    )

    # Thin side gusset plates leading up to the saddle.
    for gusset_x in (-15.0, 15.0):
        gusset_profile = [
            (cylinder_barrel_center_y - 23.0, base_top_z),
            (cylinder_barrel_center_y + 24.0, base_top_z),
            (cylinder_barrel_center_y + 5.0, cylinder_saddle_top_z),
        ]
        component_workplanes.append(make_triangular_prism_x(gusset_profile, 3.0, gusset_x))

    # Smooth cylinder core.
    component_workplanes.append(
        make_cylinder_y(
            cylinder_core_radius,
            cylinder_barrel_length_y,
            (cylinder_center_x, cylinder_barrel_center_y, cylinder_axis_z),
        )
    )

    # Many thin cooling fins along the barrel.
    first_fin_y = (
        cylinder_barrel_center_y
        - cylinder_barrel_length_y / 2.0
        + cylinder_fin_margin_y
    )

    for fin_index in range(cylinder_fin_count):
        fin_y = first_fin_y + fin_index * cylinder_fin_spacing_y
        component_workplanes.append(
            make_annular_cylinder_y(
                cylinder_fin_radius,
                cylinder_core_radius - 0.2,
                cylinder_fin_width_y,
                (cylinder_center_x, fin_y, cylinder_axis_z),
            )
        )

    # Rear cap and front head/flange/gland.
    component_workplanes.append(
        make_cylinder_y(
            cylinder_rear_cap_radius,
            cylinder_rear_cap_length_y,
            (cylinder_center_x, cylinder_rear_cap_center_y, cylinder_axis_z),
        )
    )
    component_workplanes.append(
        make_cylinder_y(
            cylinder_front_head_radius,
            cylinder_front_head_length_y,
            (cylinder_center_x, cylinder_front_head_center_y, cylinder_axis_z),
        )
    )
    component_workplanes.append(
        make_cylinder_y(
            cylinder_front_flange_radius,
            cylinder_front_flange_length_y,
            (cylinder_center_x, cylinder_front_flange_center_y, cylinder_axis_z),
        )
    )
    component_workplanes.append(
        make_cylinder_y(
            cylinder_gland_radius,
            cylinder_gland_length_y,
            (cylinder_center_x, cylinder_gland_center_y, cylinder_axis_z),
        )
    )

    # Small drain cock under the ribbed barrel.
    component_workplanes.append(
        make_cylinder_z(
            1.6,
            5.0,
            (
                cylinder_center_x,
                cylinder_barrel_center_y - 12.0,
                cylinder_axis_z - cylinder_fin_radius - 2.5,
            ),
        )
    )

    # Top valve block and short vertical pipe.
    valve_pipe_y = cylinder_front_head_center_y
    valve_mount_top_z = cylinder_axis_z + cylinder_front_head_radius

    component_workplanes.append(
        make_rounded_box(
            valve_block_size_x,
            valve_block_length_y,
            valve_block_height_z,
            (
                cylinder_center_x,
                valve_pipe_y,
                valve_mount_top_z + valve_block_height_z / 2.0,
            ),
            1.0,
        )
    )

    pipe_center_z = (
        valve_mount_top_z
        + valve_block_height_z
        + valve_pipe_height_z / 2.0
    )
    component_workplanes.append(
        make_tube_z(
            valve_pipe_outer_radius,
            valve_pipe_inner_radius,
            valve_pipe_height_z,
            (cylinder_center_x, valve_pipe_y, pipe_center_z),
        )
    )
    component_workplanes.append(
        make_tube_z(
            valve_pipe_lip_outer_radius,
            valve_pipe_inner_radius,
            valve_pipe_lip_height_z,
            (
                cylinder_center_x,
                valve_pipe_y,
                valve_mount_top_z
                + valve_block_height_z
                + valve_pipe_height_z
                + valve_pipe_lip_height_z / 2.0,
            ),
        )
    )

    # -----------------------------------------------------------------------
    # Crosshead, guides, piston rod, crank, and connecting rod
    # -----------------------------------------------------------------------
    # Four guide rails around the crosshead.
    for guide_x in (-guide_rail_offset_x, guide_rail_offset_x):
        for guide_z in (shaft_z - guide_rail_offset_z, shaft_z + guide_rail_offset_z):
            component_workplanes.append(
                make_rounded_box(
                    guide_rail_size_x,
                    guide_length_y,
                    guide_rail_size_z,
                    (guide_x, guide_center_y, guide_z),
                    0.4,
                )
            )

    # Guide end brackets.
    component_workplanes.append(
        make_rounded_box(
            18.0,
            3.0,
            15.0,
            (0, guide_center_y - guide_length_y / 2.0, shaft_z),
            0.6,
        )
    )
    component_workplanes.append(
        make_rounded_box(
            18.0,
            3.0,
            15.0,
            (0, guide_center_y + guide_length_y / 2.0, shaft_z),
            0.6,
        )
    )

    # Sliding crosshead block.
    component_workplanes.append(
        make_rounded_box(
            crosshead_size_x,
            crosshead_length_y,
            crosshead_height_z,
            (0, crosshead_y, shaft_z),
            1.0,
        )
    )

    # Piston rod from the cylinder gland to the crosshead.
    piston_rod_start_y = cylinder_gland_center_y + cylinder_gland_length_y / 2.0
    piston_rod_end_y = crosshead_y - crosshead_length_y / 2.0
    piston_rod_length_y = piston_rod_end_y - piston_rod_start_y

    component_workplanes.append(
        make_cylinder_y(
            piston_rod_radius,
            piston_rod_length_y,
            (
                cylinder_center_x,
                piston_rod_start_y + piston_rod_length_y / 2.0,
                shaft_z,
            ),
        )
    )

    # Crank pin location on the central crank disk.
    crank_angle_radians = math.radians(crank_angle_degrees)
    crank_pin_y = shaft_y + crank_throw_radius * math.cos(crank_angle_radians)
    crank_pin_z = shaft_z + crank_throw_radius * math.sin(crank_angle_radians)

    # Crank disk, arm, pin, and retaining nuts.
    component_workplanes.append(make_cylinder_x(crank_disk_radius, crank_disk_width_x, (0, shaft_y, shaft_z)))
    component_workplanes.append(
        make_bar_between_yz(
            0.0,
            (shaft_y, shaft_z),
            (crank_pin_y, crank_pin_z),
            crank_arm_thickness_x,
            crank_arm_width,
        )
    )
    component_workplanes.append(make_cylinder_x(crank_pin_radius, crank_pin_length_x, (0, crank_pin_y, crank_pin_z)))
    component_workplanes.append(make_rounded_box(8.0, 8.0, 8.0, (0, crank_pin_y, crank_pin_z), 0.8))

    component_workplanes.append(
        make_hex_prism_x(
            crank_nut_outer_radius,
            crank_nut_thickness_x,
            (
                -crank_pin_length_x / 2.0 - crank_nut_thickness_x / 2.0,
                crank_pin_y,
                crank_pin_z,
            ),
        )
    )
    component_workplanes.append(
        make_hex_prism_x(
            crank_nut_outer_radius,
            crank_nut_thickness_x,
            (
                crank_pin_length_x / 2.0 + crank_nut_thickness_x / 2.0,
                crank_pin_y,
                crank_pin_z,
            ),
        )
    )

    # Connecting rod between crosshead and crank pin, with round end bosses.
    component_workplanes.append(
        make_bar_between_yz(
            0.0,
            (crosshead_y, shaft_z),
            (crank_pin_y, crank_pin_z),
            connecting_rod_thickness_x,
            connecting_rod_width,
        )
    )
    component_workplanes.append(
        make_cylinder_x(
            connecting_big_end_radius,
            connecting_big_end_width_x,
            (0, crank_pin_y, crank_pin_z),
        )
    )
    component_workplanes.append(
        make_cylinder_x(
            connecting_small_end_radius,
            connecting_small_end_width_x,
            (0, crosshead_y, shaft_z),
        )
    )
    component_workplanes.append(
        make_cylinder_x(
            2.1,
            crosshead_size_x + 3.0,
            (0, crosshead_y, shaft_z),
        )
    )

    # Small eccentric/valve rod detail visible above the crank area.
    component_workplanes.append(
        make_cylinder_between(
            valve_rod_radius,
            (
                valve_rod_x,
                valve_pipe_y + 4.0,
                valve_mount_top_z + valve_block_height_z * 0.8,
            ),
            (
                valve_rod_x,
                shaft_y - 3.0,
                shaft_z + 4.5,
            ),
        )
    )

    component_workplanes.append(
        make_bar_between_yz(
            valve_rod_x,
            (shaft_y - 5.0, shaft_z + 2.0),
            (shaft_y + 2.5, shaft_z + 10.0),
            2.0,
            1.8,
        )
    )

    # Combine all solid bodies into one compound for display/export.
    solid_shapes = []
    for workplane in component_workplanes:
        solid_shapes.extend(workplane.vals())

    return cq.Workplane("XY").add(cq.Compound.makeCompound(solid_shapes))


# Final CadQuery result
result = build_model()