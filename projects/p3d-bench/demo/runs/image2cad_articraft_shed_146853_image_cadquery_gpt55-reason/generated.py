import cadquery as cq
import math

# -----------------------------
# Parameters - overall building
# -----------------------------
building_length = 120.0
building_width = 70.0
foundation_height = 4.0
wall_height = 44.0
eave_height = foundation_height + wall_height
roof_rise = 28.0

# Wall and trim proportions
wall_panel_thickness = 1.0
base_overhang = 2.5
trim_projection = 1.0
batten_width = 1.2
corner_post_width = 2.6
bottom_rail_height = 2.4
top_rail_height = 2.4

# Door proportions
door_total_width = 32.0
door_center_y = -8.0
door_height = 34.0
door_thickness = 1.2
door_center_gap = 0.8
door_frame_width = 2.0
door_frame_projection = 0.9
inner_door_trim_width = 1.0

# Roof framing proportions
eave_overhang = 2.5
roof_end_overhang = 2.5
rafter_section = 2.3
ridge_beam_width = 3.0
ridge_beam_height = 3.0
fascia_thickness = 2.2
fascia_height = 4.0
purlin_width = 1.4
purlin_height = 1.5
roof_brace_section = 1.1
collar_tie_section = 1.3

# Partial roof sheet detail
roof_panel_thickness = 0.7
roof_panel_normal_offset = -0.55

# Repeated feature counts
long_wall_panel_count = 12
end_wall_panel_count = 7
gable_batten_count = 7
rafter_count = 11

# -----------------------------
# Derived geometry
# -----------------------------
front_x = -building_length / 2.0
back_x = building_length / 2.0
near_y = -building_width / 2.0
far_y = building_width / 2.0

front_exterior_x = front_x - wall_panel_thickness / 2.0
back_exterior_x = back_x + wall_panel_thickness / 2.0
near_exterior_y = near_y - wall_panel_thickness / 2.0
far_exterior_y = far_y + wall_panel_thickness / 2.0

roof_near_eave_y = near_y - eave_overhang
roof_far_eave_y = far_y + eave_overhang
roof_run = building_width / 2.0 + eave_overhang
ridge_height = eave_height + roof_rise
roof_slope_length = math.hypot(roof_run, roof_rise)
roof_angle_deg = math.degrees(math.atan2(roof_rise, roof_run))
roof_angle_rad = math.radians(roof_angle_deg)

roof_start_x = front_x - roof_end_overhang
roof_end_x = back_x + roof_end_overhang
roof_length = building_length + 2.0 * roof_end_overhang

wall_center_z = foundation_height + wall_height / 2.0

# Keep solids as a compound so individual trim and framing edges remain visible.
model_solids = []


# -----------------------------
# Helper functions
# -----------------------------
def add_to_model(workplane):
    """Append solids from a Workplane to the model collection."""
    model_solids.extend(workplane.vals())


def add_box(size_x, size_y, size_z, center):
    """Add an axis-aligned rectangular solid."""
    if min(size_x, size_y, size_z) <= 0:
        return

    solid = cq.Workplane("XY").box(size_x, size_y, size_z).translate(center)
    add_to_model(solid)


def add_rotated_box(size_x, size_y, size_z, center, rotation_axis, angle_degrees):
    """Add a rectangular solid rotated around a world-space axis."""
    if min(size_x, size_y, size_z) <= 0:
        return

    solid = cq.Workplane("XY").box(size_x, size_y, size_z)

    if abs(angle_degrees) > 1e-7:
        solid = solid.rotate((0.0, 0.0, 0.0), rotation_axis, angle_degrees)

    solid = solid.translate(center)
    add_to_model(solid)


def add_beam_between(start, end, section_width, section_height):
    """Create a rectangular beam whose long axis runs between two 3D points."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    if length <= 1e-6 or min(section_width, section_height) <= 0:
        return

    ux = dx / length
    uy = dy / length
    uz = dz / length

    # Start with a box along +X, then rotate it so +X points toward the target.
    dot = max(-1.0, min(1.0, ux))
    angle = math.degrees(math.acos(dot))
    rotation_axis = (0.0, -uz, uy)
    axis_length = math.sqrt(
        rotation_axis[0] * rotation_axis[0]
        + rotation_axis[1] * rotation_axis[1]
        + rotation_axis[2] * rotation_axis[2]
    )

    solid = cq.Workplane("XY").box(length, section_width, section_height)

    if axis_length > 1e-7:
        solid = solid.rotate((0.0, 0.0, 0.0), rotation_axis, angle)
    elif ux < 0:
        solid = solid.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), 180.0)

    midpoint = (
        start[0] + dx / 2.0,
        start[1] + dy / 2.0,
        start[2] + dz / 2.0,
    )

    solid = solid.translate(midpoint)
    add_to_model(solid)


def add_yz_prism(points_yz, center_x, thickness):
    """Add a thin prism defined by YZ-plane polygon points and extruded in X."""
    if thickness <= 0:
        return

    origin_x = center_x - thickness / 2.0
    solid = (
        cq.Workplane("YZ", origin=(origin_x, 0.0, 0.0))
        .polyline(points_yz)
        .close()
        .extrude(thickness)
    )
    add_to_model(solid)


def roof_point(side, x_position, slope_fraction):
    """Return a point on either roof slope, where 0 is eave and 1 is ridge."""
    if side == "near":
        y_position = roof_near_eave_y + slope_fraction * roof_run
    else:
        y_position = roof_far_eave_y - slope_fraction * roof_run

    z_position = eave_height + slope_fraction * roof_rise
    return (x_position, y_position, z_position)


def gable_height_at_y(y_position):
    """Return the top height of the triangular gable at a given Y location."""
    half_width = building_width / 2.0
    fraction_to_ridge = max(0.0, 1.0 - abs(y_position) / half_width)
    return eave_height + roof_rise * fraction_to_ridge


def add_roof_panel(side, x_start, x_end, t_start, t_end):
    """Add a thin sloped roof sheet set slightly below the exposed rafters."""
    x_center = (x_start + x_end) / 2.0
    t_center = (t_start + t_end) / 2.0
    panel_length = x_end - x_start
    panel_slope_width = (t_end - t_start) * roof_slope_length

    center_x, center_y, center_z = roof_point(side, x_center, t_center)

    if side == "near":
        angle = roof_angle_deg
        normal_y = -math.sin(roof_angle_rad)
    else:
        angle = -roof_angle_deg
        normal_y = math.sin(roof_angle_rad)

    normal_z = math.cos(roof_angle_rad)

    center = (
        center_x,
        center_y + roof_panel_normal_offset * normal_y,
        center_z + roof_panel_normal_offset * normal_z,
    )

    add_rotated_box(
        panel_length,
        panel_slope_width,
        roof_panel_thickness,
        center,
        (1.0, 0.0, 0.0),
        angle,
    )


# -----------------------------
# Foundation and wall sheathing
# -----------------------------
add_box(
    building_length + 2.0 * base_overhang,
    building_width + 2.0 * base_overhang,
    foundation_height,
    (0.0, 0.0, foundation_height / 2.0),
)

# Rectangular lower wall panels
add_box(building_length, wall_panel_thickness, wall_height, (0.0, near_y, wall_center_z))
add_box(building_length, wall_panel_thickness, wall_height, (0.0, far_y, wall_center_z))
add_box(wall_panel_thickness, building_width, wall_height, (front_x, 0.0, wall_center_z))
add_box(wall_panel_thickness, building_width, wall_height, (back_x, 0.0, wall_center_z))

# Triangular gable infill panels at both short ends
gable_triangle = [
    (near_y, eave_height),
    (0.0, ridge_height),
    (far_y, eave_height),
]
add_yz_prism(gable_triangle, front_x, wall_panel_thickness)
add_yz_prism(gable_triangle, back_x, wall_panel_thickness)


# -----------------------------
# Exterior posts, rails, and battens
# -----------------------------
# Corner posts
for x in (front_x, back_x):
    for y in (near_y, far_y):
        add_box(
            corner_post_width,
            corner_post_width,
            wall_height,
            (x, y, wall_center_z),
        )

# Bottom and top rails on long walls
for y_face, exterior_sign in ((near_exterior_y, -1.0), (far_exterior_y, 1.0)):
    rail_y = y_face + exterior_sign * trim_projection / 2.0

    add_box(
        building_length,
        trim_projection,
        bottom_rail_height,
        (0.0, rail_y, foundation_height + bottom_rail_height / 2.0),
    )
    add_box(
        building_length,
        trim_projection,
        top_rail_height,
        (0.0, rail_y, eave_height - top_rail_height / 2.0),
    )

# Bottom and top rails on short end walls
for x_face, exterior_sign in ((front_exterior_x, -1.0), (back_exterior_x, 1.0)):
    rail_x = x_face + exterior_sign * trim_projection / 2.0

    add_box(
        trim_projection,
        building_width,
        bottom_rail_height,
        (rail_x, 0.0, foundation_height + bottom_rail_height / 2.0),
    )
    add_box(
        trim_projection,
        building_width,
        top_rail_height,
        (rail_x, 0.0, eave_height - top_rail_height / 2.0),
    )

# Vertical battens on the long side walls
long_batten_positions = [
    front_x + i * building_length / long_wall_panel_count
    for i in range(long_wall_panel_count + 1)
]

for x in long_batten_positions:
    add_box(
        batten_width,
        trim_projection,
        wall_height,
        (x, near_exterior_y - trim_projection / 2.0, wall_center_z),
    )
    add_box(
        batten_width,
        trim_projection,
        wall_height,
        (x, far_exterior_y + trim_projection / 2.0, wall_center_z),
    )

# Vertical battens on end walls, leaving visual space around the front double door
end_batten_positions = [
    near_y + i * building_width / end_wall_panel_count
    for i in range(end_wall_panel_count + 1)
]

door_half_width = door_total_width / 2.0
door_clear_min = door_center_y - door_half_width - door_frame_width
door_clear_max = door_center_y + door_half_width + door_frame_width

for y in end_batten_positions:
    if not (door_clear_min < y < door_clear_max):
        add_box(
            trim_projection,
            batten_width,
            wall_height,
            (front_exterior_x - trim_projection / 2.0, y, wall_center_z),
        )

    add_box(
        trim_projection,
        batten_width,
        wall_height,
        (back_exterior_x + trim_projection / 2.0, y, wall_center_z),
    )

# Gable battens and sloping gable trim
gable_batten_positions = [
    near_y + (i + 1) * building_width / (gable_batten_count + 1)
    for i in range(gable_batten_count)
]

for y in gable_batten_positions:
    top_z = gable_height_at_y(y)
    gable_batten_height = top_z - eave_height

    if gable_batten_height > 0.5:
        add_box(
            trim_projection,
            batten_width,
            gable_batten_height,
            (
                front_exterior_x - trim_projection / 2.0,
                y,
                eave_height + gable_batten_height / 2.0,
            ),
        )
        add_box(
            trim_projection,
            batten_width,
            gable_batten_height,
            (
                back_exterior_x + trim_projection / 2.0,
                y,
                eave_height + gable_batten_height / 2.0,
            ),
        )

# Sloped trim following both gable outlines
for x_face in (
    front_exterior_x - trim_projection / 2.0,
    back_exterior_x + trim_projection / 2.0,
):
    add_beam_between(
        (x_face, near_y, eave_height),
        (x_face, 0.0, ridge_height),
        batten_width,
        batten_width,
    )
    add_beam_between(
        (x_face, far_y, eave_height),
        (x_face, 0.0, ridge_height),
        batten_width,
        batten_width,
    )


# -----------------------------
# Double front door with frames, panels, hinges, and handles
# -----------------------------
door_bottom_z = foundation_height
door_top_z = door_bottom_z + door_height
door_center_z = door_bottom_z + door_height / 2.0

door_leaf_width = (door_total_width - door_center_gap) / 2.0
door_leaf_offset = door_leaf_width / 2.0 + door_center_gap / 2.0

door_slab_center_x = front_exterior_x - door_thickness / 2.0 - 0.15
door_slab_front_x = door_slab_center_x - door_thickness / 2.0
door_trim_center_x = door_slab_front_x - door_frame_projection / 2.0

# Two door leaves
add_box(
    door_thickness,
    door_leaf_width,
    door_height,
    (door_slab_center_x, door_center_y - door_leaf_offset, door_center_z),
)
add_box(
    door_thickness,
    door_leaf_width,
    door_height,
    (door_slab_center_x, door_center_y + door_leaf_offset, door_center_z),
)

# Outer frame and center stile
add_box(
    door_frame_projection,
    door_frame_width,
    door_height,
    (door_trim_center_x, door_center_y - door_half_width, door_center_z),
)
add_box(
    door_frame_projection,
    door_frame_width,
    door_height,
    (door_trim_center_x, door_center_y + door_half_width, door_center_z),
)
add_box(
    door_frame_projection,
    door_frame_width,
    door_height,
    (door_trim_center_x, door_center_y, door_center_z),
)
add_box(
    door_frame_projection,
    door_total_width + 2.0 * door_frame_width,
    door_frame_width,
    (door_trim_center_x, door_center_y, door_top_z + door_frame_width / 2.0),
)
add_box(
    door_frame_projection,
    door_total_width + 2.0 * door_frame_width,
    door_frame_width,
    (door_trim_center_x, door_center_y, door_bottom_z + door_frame_width / 2.0),
)

# Raised rectangular panel trim on each leaf
panel_margin_y = 3.0
panel_margin_z = 4.0
panel_bottom_z = door_bottom_z + panel_margin_z
panel_top_z = door_top_z - panel_margin_z
panel_height = panel_top_z - panel_bottom_z
panel_center_z = (panel_top_z + panel_bottom_z) / 2.0
panel_width = door_leaf_width - 2.0 * panel_margin_y

for leaf_center_y in (
    door_center_y - door_leaf_offset,
    door_center_y + door_leaf_offset,
):
    leaf_left_y = leaf_center_y - door_leaf_width / 2.0
    leaf_right_y = leaf_center_y + door_leaf_width / 2.0
    panel_left_y = leaf_left_y + panel_margin_y
    panel_right_y = leaf_right_y - panel_margin_y

    add_box(
        door_frame_projection,
        inner_door_trim_width,
        panel_height,
        (door_trim_center_x, panel_left_y, panel_center_z),
    )
    add_box(
        door_frame_projection,
        inner_door_trim_width,
        panel_height,
        (door_trim_center_x, panel_right_y, panel_center_z),
    )
    add_box(
        door_frame_projection,
        panel_width,
        inner_door_trim_width,
        (door_trim_center_x, leaf_center_y, panel_bottom_z),
    )
    add_box(
        door_frame_projection,
        panel_width,
        inner_door_trim_width,
        (door_trim_center_x, leaf_center_y, panel_top_z),
    )

# Hinge plates and small handles
hinge_plate_projection = 0.7
hinge_plate_width_y = 1.5
hinge_plate_height_z = 3.0
hinge_x = door_trim_center_x - door_frame_projection / 2.0 - hinge_plate_projection / 2.0

hinge_z_positions = [
    door_bottom_z + door_height * 0.22,
    door_bottom_z + door_height * 0.50,
    door_bottom_z + door_height * 0.78,
]

for z in hinge_z_positions:
    add_box(
        hinge_plate_projection,
        hinge_plate_width_y,
        hinge_plate_height_z,
        (hinge_x, door_center_y - door_half_width - door_frame_width * 0.15, z),
    )
    add_box(
        hinge_plate_projection,
        hinge_plate_width_y,
        hinge_plate_height_z,
        (hinge_x, door_center_y + door_half_width + door_frame_width * 0.15, z),
    )

handle_z = door_bottom_z + door_height * 0.55
add_box(0.8, 0.8, 1.4, (hinge_x, door_center_y - 1.8, handle_z))
add_box(0.8, 0.8, 1.4, (hinge_x, door_center_y + 1.8, handle_z))


# -----------------------------
# Partial sloped roof sheet
# -----------------------------
# The reference shows one broad solid panel among otherwise exposed roof framing.
add_roof_panel("near", front_x + 5.0, front_x + 37.0, 0.05, 0.95)


# -----------------------------
# Roof framing: rafters, ridge, fascia, purlins, braces
# -----------------------------
# Ridge beam
add_box(
    roof_length,
    ridge_beam_width,
    ridge_beam_height,
    (0.0, 0.0, ridge_height),
)

# Eave fascia boards
add_box(
    roof_length,
    fascia_thickness,
    fascia_height,
    (0.0, roof_near_eave_y, eave_height),
)
add_box(
    roof_length,
    fascia_thickness,
    fascia_height,
    (0.0, roof_far_eave_y, eave_height),
)

# Rake/fascia boards on the roof ends
for x in (roof_start_x, roof_end_x):
    add_beam_between(
        roof_point("near", x, 0.0),
        roof_point("near", x, 1.0),
        fascia_thickness,
        fascia_thickness,
    )
    add_beam_between(
        roof_point("far", x, 0.0),
        roof_point("far", x, 1.0),
        fascia_thickness,
        fascia_thickness,
    )

# Repeated rafters along the building length
rafter_positions = [
    front_x + i * building_length / (rafter_count - 1)
    for i in range(rafter_count)
]

for x in rafter_positions:
    add_beam_between(
        roof_point("near", x, 0.0),
        roof_point("near", x, 1.0),
        rafter_section,
        rafter_section,
    )
    add_beam_between(
        roof_point("far", x, 0.0),
        roof_point("far", x, 1.0),
        rafter_section,
        rafter_section,
    )

# Long purlins running parallel to the ridge on both roof slopes
purlin_fractions = [0.18, 0.42, 0.66, 0.86]

for t in purlin_fractions:
    _, near_purlin_y, near_purlin_z = roof_point("near", 0.0, t)
    _, far_purlin_y, far_purlin_z = roof_point("far", 0.0, t)

    add_rotated_box(
        roof_length,
        purlin_width,
        purlin_height,
        (0.0, near_purlin_y, near_purlin_z),
        (1.0, 0.0, 0.0),
        roof_angle_deg,
    )
    add_rotated_box(
        roof_length,
        purlin_width,
        purlin_height,
        (0.0, far_purlin_y, far_purlin_z),
        (1.0, 0.0, 0.0),
        -roof_angle_deg,
    )

# Truss collar ties, king posts, and diagonal webs at each rafter line
collar_fraction = 0.47

for x in rafter_positions:
    near_collar_point = roof_point("near", x, collar_fraction)
    far_collar_point = roof_point("far", x, collar_fraction)
    collar_z = near_collar_point[2]

    add_beam_between(
        near_collar_point,
        far_collar_point,
        collar_tie_section,
        collar_tie_section,
    )
    add_beam_between(
        (x, 0.0, collar_z),
        (x, 0.0, ridge_height),
        collar_tie_section,
        collar_tie_section,
    )
    add_beam_between(
        near_collar_point,
        (x, 0.0, ridge_height),
        roof_brace_section,
        roof_brace_section,
    )
    add_beam_between(
        far_collar_point,
        (x, 0.0, ridge_height),
        roof_brace_section,
        roof_brace_section,
    )

# Ceiling joists across the top of the wall line
for x in rafter_positions:
    add_beam_between(
        (x, near_y, eave_height + 1.0),
        (x, far_y, eave_height + 1.0),
        collar_tie_section,
        collar_tie_section,
    )

# Alternating diagonal roof-bay braces to suggest the lattice framing in the image
for bay_index in range(len(rafter_positions) - 1):
    x0 = rafter_positions[bay_index]
    x1 = rafter_positions[bay_index + 1]

    for side in ("near", "far"):
        if bay_index % 2 == 0:
            start_point = roof_point(side, x0, 0.18)
            end_point = roof_point(side, x1, 0.82)
        else:
            start_point = roof_point(side, x0, 0.82)
            end_point = roof_point(side, x1, 0.18)

        add_beam_between(
            start_point,
            end_point,
            roof_brace_section,
            roof_brace_section,
        )

# Final CadQuery result
model_compound = cq.Compound.makeCompound(model_solids)
result = cq.Workplane("XY").newObject([model_compound])