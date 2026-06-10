import math
import cadquery as cq

# Parameters
stave_count = 18

# Barrel dimensions
barrel_length = 259.6
barrel_end_radius = 79.5
barrel_mid_radius = 90.5
barrel_axis_y = 0.0
barrel_axis_z = 142.0

# Stave/groove detailing
longitudinal_groove_width = 1.25
longitudinal_groove_depth = 20.0
longitudinal_groove_length = barrel_length + 10.0
circumferential_groove_width = 1.2
circumferential_groove_depth = 1.8

# Hoop rings
large_hoop_outer_radius = 94.25
large_hoop_inner_radius = 86.0
large_hoop_width = 21.9
small_hoop_outer_radius = 82.0
small_hoop_inner_radius = 73.5
small_hoop_width = 21.0
large_hoop_offset = 47.0
small_hoop_offset = barrel_length / 2.0 - small_hoop_width / 2.0
hoop_fillet_radius = 0.9

# End caps
cap_radius = 70.6
cap_thickness = 12.0
cap_edge_fillet = 0.8
cap_face_overhang = 2.0
cap_rim_width = 8.0
cap_rim_protrusion = 2.4
cap_rim_overlap = 0.35
cap_boss_radius = 10.0
cap_boss_depth = 3.0

# Decorative text
decorative_text = "Delbousa"
decorative_text_size = 18.0
decorative_text_depth = 1.4
decorative_text_overlap = 0.3
decorative_text_y_offset = -4.0
decorative_text_z_offset = 4.0
decorative_text_angle_deg = -12.0

# Bung fitting
bung_x_position = -30.0
bung_y_position = 0.0
bung_sink_depth = 3.5
collar_flange_radius = 20.0
collar_groove_radius = 16.25
collar_hub_radius = 13.75
collar_height = 15.0
collar_flange_height = 5.0
collar_groove_height = 4.0
collar_bore_radius = 7.5
collar_countersink_radius = 11.5
collar_countersink_depth = 5.0
plug_radius = 16.25
plug_height = 14.0

# Tap assembly
tap_y_offset = -24.0
tap_z_offset = -52.0
tap_base_radius = 11.0
tap_base_length = 6.0
tap_sleeve_outer_radius = 4.0
tap_sleeve_inner_radius = 3.0
tap_sleeve_length = 40.0
knob_main_radius = 13.5
knob_rear_radius = 9.5
knob_neck_radius = 8.0
knob_front_radius = 9.0
handle_disc_radius = 10.6
handle_disc_thickness = 2.8
handle_sphere_radius = 6.5
handle_rod_radius = 2.5
handle_end_ball_radius = 5.0

# Cradle
foot_height = 10.0
foot_length = 42.0
foot_top_length = 25.0
foot_width = 30.0
rail_length = 220.0
rail_width = 25.0
rail_height = 25.0
rail_spacing = 110.0
rail_fillet = 1.0
pad_length = 30.0
pad_height = 5.0
saddle_width_x = 45.0
saddle_length_y = 170.0
saddle_height = 25.0
saddle_fillet = 1.0
saddle_x_positions = (-65.0, 65.0)
key_length = 189.0
key_bottom_width = 25.0
key_top_width = 14.0
key_height = 25.0


# Helper functions
def apply_fillet(workplane, radius):
    """Apply a fillet, returning the unmodified object if the fillet is not possible."""
    if radius <= 0:
        return workplane
    try:
        return workplane.edges().fillet(radius)
    except Exception:
        return workplane


def barrel_radius_at(x_position):
    """Smooth parabolic barrel radius profile."""
    half_length = barrel_length / 2.0
    normalized_position = min(abs(x_position) / half_length, 1.0)
    return barrel_end_radius + (barrel_mid_radius - barrel_end_radius) * (
        1.0 - normalized_position**2
    )


def make_circle_wire_x(x_position, radius):
    """Create a circular wire in a YZ plane for lofting along the barrel axis."""
    edge = cq.Edge.makeCircle(
        radius,
        cq.Vector(x_position, barrel_axis_y, barrel_axis_z),
        cq.Vector(1, 0, 0),
    )
    return cq.Wire.assembleEdges([edge])


def make_cylinder_x(radius, length, center_x, center_y=0.0, center_z=0.0):
    """Create a solid cylinder whose axis is parallel to X."""
    return (
        cq.Workplane("YZ")
        .circle(radius)
        .extrude(length, both=True)
        .translate((center_x, center_y, center_z))
    )


def make_tube_x(outer_radius, inner_radius, length, center_x, center_y=0.0, center_z=0.0):
    """Create a hollow cylinder whose axis is parallel to X."""
    return (
        cq.Workplane("YZ")
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(length, both=True)
        .translate((center_x, center_y, center_z))
    )


def make_cylinder_z(radius, height, base_z=0.0, center_x=0.0, center_y=0.0):
    """Create a vertical cylinder from a base Z height."""
    return (
        cq.Workplane("XY")
        .circle(radius)
        .extrude(height)
        .translate((center_x, center_y, base_z))
    )


def make_sphere(radius, center):
    """Create a sphere at the specified center."""
    return cq.Workplane("XY").add(
        cq.Solid.makeSphere(radius, cq.Vector(center[0], center[1], center[2]))
    )


def make_cylinder_between(start_point, end_point, radius):
    """Create a cylinder between two 3D points."""
    dx = end_point[0] - start_point[0]
    dy = end_point[1] - start_point[1]
    dz = end_point[2] - start_point[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)
    direction = cq.Vector(dx / length, dy / length, dz / length)
    return cq.Workplane("XY").add(
        cq.Solid.makeCylinder(
            radius,
            length,
            cq.Vector(start_point[0], start_point[1], start_point[2]),
            direction,
        )
    )


def make_rounded_box(length_x, width_y, height_z, center, fillet_radius=0.0):
    """Create a box with optional uniform rounded edges."""
    box = (
        cq.Workplane("XY")
        .box(length_x, width_y, height_z)
        .translate((center[0], center[1], center[2]))
    )
    return apply_fillet(box, fillet_radius)


def make_hoop_band(center_x, outer_radius, inner_radius, width):
    """Create a rounded annular hoop around the barrel."""
    hoop = make_tube_x(
        outer_radius,
        inner_radius,
        width,
        center_x,
        barrel_axis_y,
        barrel_axis_z,
    )
    return apply_fillet(hoop, hoop_fillet_radius)


def make_trapezoid_foot(center_x, center_y, center_z):
    """Create a low trapezoidal foot pad with sloped sides."""
    profile_points = [
        (-foot_length / 2.0, -foot_height / 2.0),
        (foot_length / 2.0, -foot_height / 2.0),
        (foot_top_length / 2.0, foot_height / 2.0),
        (-foot_top_length / 2.0, foot_height / 2.0),
    ]
    foot = (
        cq.Workplane("XZ")
        .polyline(profile_points)
        .close()
        .extrude(foot_width, both=True)
        .translate((center_x, center_y, center_z))
    )
    return apply_fillet(foot, 0.6)


def make_key_bar():
    """Create the central trapezoidal key/gib bar."""
    profile_points = [
        (-key_bottom_width / 2.0, -key_height / 2.0),
        (key_bottom_width / 2.0, -key_height / 2.0),
        (key_top_width / 2.0, key_height / 2.0),
        (-key_top_width / 2.0, key_height / 2.0),
    ]
    key = (
        cq.Workplane("YZ")
        .polyline(profile_points)
        .close()
        .extrude(key_length, both=True)
        .translate((0.0, 0.0, foot_height + key_height / 2.0 - 0.5))
    )
    return apply_fillet(key, 1.0)


def make_saddle_support(center_x):
    """Create a saddle block with a shallow concave barrel seat."""
    rail_center_z = foot_height + rail_height / 2.0 - 0.5
    saddle_base_z = rail_center_z + rail_height / 2.0 - 0.5

    support = make_rounded_box(
        saddle_width_x,
        saddle_length_y,
        saddle_height,
        (center_x, 0.0, saddle_base_z + saddle_height / 2.0),
        saddle_fillet,
    )

    # Slightly smaller cutter radius leaves the saddle intruding into the barrel for a unified solid.
    cut_radius = barrel_radius_at(center_x) - 1.2
    saddle_cutter = make_cylinder_x(
        cut_radius,
        saddle_width_x + 8.0,
        center_x,
        barrel_axis_y,
        barrel_axis_z,
    )
    support = support.cut(saddle_cutter)
    return apply_fillet(support, 0.35)


# Barrel body loft
barrel_profile_x_positions = [
    -barrel_length / 2.0,
    -barrel_length * 0.375,
    -barrel_length * 0.18,
    0.0,
    barrel_length * 0.18,
    barrel_length * 0.375,
    barrel_length / 2.0,
]

barrel_profile_wires = [
    make_circle_wire_x(x_position, barrel_radius_at(x_position))
    for x_position in barrel_profile_x_positions
]

barrel_body = cq.Workplane("XY").add(cq.Solid.makeLoft(barrel_profile_wires, False))

# Add shallow circumferential stave-break grooves to the wood body.
for groove_x in (-102.0, -78.0, -25.0, 25.0, 78.0, 102.0):
    local_radius = barrel_radius_at(groove_x)
    groove_cutter = make_tube_x(
        local_radius + 3.0,
        local_radius - circumferential_groove_depth,
        circumferential_groove_width,
        groove_x,
        barrel_axis_y,
        barrel_axis_z,
    )
    barrel_body = barrel_body.cut(groove_cutter)

# Add the four annular hoops.
barrel_shell = barrel_body
barrel_shell = barrel_shell.union(
    make_hoop_band(-small_hoop_offset, small_hoop_outer_radius, small_hoop_inner_radius, small_hoop_width)
)
barrel_shell = barrel_shell.union(
    make_hoop_band(-large_hoop_offset, large_hoop_outer_radius, large_hoop_inner_radius, large_hoop_width)
)
barrel_shell = barrel_shell.union(
    make_hoop_band(large_hoop_offset, large_hoop_outer_radius, large_hoop_inner_radius, large_hoop_width)
)
barrel_shell = barrel_shell.union(
    make_hoop_band(small_hoop_offset, small_hoop_outer_radius, small_hoop_inner_radius, small_hoop_width)
)

# Cut the 18 longitudinal stave seams through the barrel and hoops.
longitudinal_outer_radius = large_hoop_outer_radius + 0.8
for stave_index in range(stave_count):
    angle_deg = 360.0 * stave_index / stave_count
    seam_cutter = (
        cq.Workplane("XY")
        .box(
            longitudinal_groove_length,
            longitudinal_groove_width,
            longitudinal_groove_depth,
        )
        .translate(
            (
                0.0,
                barrel_axis_y,
                barrel_axis_z + longitudinal_outer_radius - longitudinal_groove_depth / 2.0,
            )
        )
        .rotate(
            (0.0, barrel_axis_y, barrel_axis_z),
            (1.0, barrel_axis_y, barrel_axis_z),
            angle_deg,
        )
    )
    barrel_shell = barrel_shell.cut(seam_cutter)

# End caps and front retaining rings
front_cap_face_x = -barrel_length / 2.0 - cap_face_overhang
front_cap_center_x = front_cap_face_x + cap_thickness / 2.0
rear_cap_face_x = barrel_length / 2.0 + cap_face_overhang
rear_cap_center_x = rear_cap_face_x - cap_thickness / 2.0

front_cap = make_cylinder_x(cap_radius, cap_thickness, front_cap_center_x, barrel_axis_y, barrel_axis_z)
front_cap = apply_fillet(front_cap, cap_edge_fillet)

front_rim_length = cap_rim_protrusion + cap_rim_overlap
front_rim_center_x = front_cap_face_x - cap_rim_protrusion / 2.0 + cap_rim_overlap / 2.0
front_rim = make_tube_x(
    cap_radius + 1.2,
    cap_radius - cap_rim_width,
    front_rim_length,
    front_rim_center_x,
    barrel_axis_y,
    barrel_axis_z,
)
front_rim = apply_fillet(front_rim, 0.45)

front_inner_bead = make_tube_x(
    cap_radius - 12.0,
    cap_radius - 14.0,
    front_rim_length * 0.75,
    front_rim_center_x,
    barrel_axis_y,
    barrel_axis_z,
)
front_inner_bead = apply_fillet(front_inner_bead, 0.25)

front_boss = make_cylinder_x(
    cap_boss_radius,
    cap_boss_depth,
    front_cap_face_x + cap_thickness + cap_boss_depth / 2.0 - 0.2,
    barrel_axis_y,
    barrel_axis_z,
)

front_cap = front_cap.union(front_rim).union(front_inner_bead).union(front_boss)

# Embossed front script.
try:
    text_plane = cq.Plane(
        cq.Vector(
            front_cap_face_x - decorative_text_depth + decorative_text_overlap,
            barrel_axis_y + decorative_text_y_offset,
            barrel_axis_z + decorative_text_z_offset,
        ),
        cq.Vector(0, 1, 0),
        cq.Vector(1, 0, 0),
    )
    raised_text = cq.Workplane(text_plane).text(
        decorative_text,
        decorative_text_size,
        decorative_text_depth,
        combine=False,
        halign="center",
        valign="center",
    )
    raised_text = raised_text.rotate(
        (front_cap_face_x, barrel_axis_y, barrel_axis_z),
        (front_cap_face_x + 1.0, barrel_axis_y, barrel_axis_z),
        decorative_text_angle_deg,
    )
    front_cap = front_cap.union(raised_text)
except Exception:
    pass

rear_cap = make_cylinder_x(cap_radius, cap_thickness, rear_cap_center_x, barrel_axis_y, barrel_axis_z)
rear_cap = apply_fillet(rear_cap, cap_edge_fillet)

rear_rim_center_x = rear_cap_face_x + cap_rim_protrusion / 2.0 - cap_rim_overlap / 2.0
rear_rim = make_tube_x(
    cap_radius + 1.2,
    cap_radius - cap_rim_width,
    front_rim_length,
    rear_rim_center_x,
    barrel_axis_y,
    barrel_axis_z,
)
rear_rim = apply_fillet(rear_rim, 0.45)
rear_cap = rear_cap.union(rear_rim)

front_retaining_ring = make_tube_x(
    small_hoop_outer_radius + 1.0,
    cap_radius - 2.0,
    4.0,
    front_cap_face_x + 2.0,
    barrel_axis_y,
    barrel_axis_z,
)
front_retaining_ring = apply_fillet(front_retaining_ring, 0.45)

rear_retaining_ring = make_tube_x(
    small_hoop_outer_radius + 1.0,
    cap_radius - 2.0,
    4.0,
    rear_cap_face_x - 2.0,
    barrel_axis_y,
    barrel_axis_z,
)
rear_retaining_ring = apply_fillet(rear_retaining_ring, 0.45)

# Bung collar and top plug
bung_surface_radius = barrel_radius_at(bung_x_position)
bung_base_z = barrel_axis_z + bung_surface_radius - bung_sink_depth

collar = make_cylinder_z(collar_flange_radius, collar_flange_height)
collar = collar.union(
    make_cylinder_z(collar_groove_radius, collar_groove_height, collar_flange_height)
)
collar = collar.union(
    make_cylinder_z(
        collar_hub_radius,
        collar_height - collar_flange_height - collar_groove_height,
        collar_flange_height + collar_groove_height,
    )
)
collar = apply_fillet(collar, 0.45)

bore_cut = (
    cq.Workplane("XY")
    .circle(collar_bore_radius)
    .extrude(collar_height + 2.0)
    .translate((0.0, 0.0, -1.0))
)

countersink_cut = (
    cq.Workplane("XY")
    .circle(collar_bore_radius)
    .workplane(offset=collar_countersink_depth)
    .circle(collar_countersink_radius)
    .loft(combine=False)
    .translate((0.0, 0.0, collar_height - collar_countersink_depth))
)

collar = collar.cut(bore_cut).cut(countersink_cut)
collar = collar.translate((bung_x_position, bung_y_position, bung_base_z))

plug = make_cylinder_z(
    plug_radius,
    plug_height,
    bung_base_z + collar_height - 0.2,
    bung_x_position,
    bung_y_position,
)
plug = apply_fillet(plug, 1.3)

# Tap sub-assembly on the decorated front cap
tap_center_y = barrel_axis_y + tap_y_offset
tap_center_z = barrel_axis_z + tap_z_offset

tap_base = make_cylinder_x(
    tap_base_radius,
    tap_base_length,
    front_cap_face_x - tap_base_length / 2.0 + 0.3,
    tap_center_y,
    tap_center_z,
)
tap_base = apply_fillet(tap_base, 0.45)

spacer_sleeve = make_tube_x(
    tap_sleeve_outer_radius,
    tap_sleeve_inner_radius,
    tap_sleeve_length,
    front_cap_face_x - tap_sleeve_length / 2.0,
    tap_center_y,
    tap_center_z,
)
spacer_sleeve = apply_fillet(spacer_sleeve, 0.25)

knob_main_center = (front_cap_face_x - 43.0, tap_center_y, tap_center_z)
knob_rear_center = (front_cap_face_x - 28.0, tap_center_y, tap_center_z)
knob_front_center_x = front_cap_face_x - 55.0

knob_main_lobe = make_sphere(knob_main_radius, knob_main_center)
knob_rear_lobe = make_sphere(knob_rear_radius, knob_rear_center)
knob_neck = make_cylinder_x(
    knob_neck_radius,
    20.0,
    front_cap_face_x - 35.0,
    tap_center_y,
    tap_center_z,
)
knob_front_flat = make_cylinder_x(
    knob_front_radius,
    6.0,
    knob_front_center_x,
    tap_center_y,
    tap_center_z,
)
valve_knob = knob_main_lobe.union(knob_rear_lobe).union(knob_neck).union(knob_front_flat)

handle_disc = make_cylinder_x(
    handle_disc_radius,
    handle_disc_thickness,
    front_cap_face_x - 56.5,
    tap_center_y,
    tap_center_z + 6.0,
)
handle_disc = apply_fillet(handle_disc, 0.25)

handle_sphere_center = (front_cap_face_x - 57.0, tap_center_y, tap_center_z + 14.0)
handle_sphere = make_sphere(handle_sphere_radius, handle_sphere_center)

upper_rod = make_cylinder_between(
    (front_cap_face_x - 57.0, tap_center_y, tap_center_z + 18.5),
    (front_cap_face_x - 58.5, tap_center_y, tap_center_z + 33.5),
    handle_rod_radius,
)
upper_ball = make_sphere(
    handle_end_ball_radius,
    (front_cap_face_x - 59.0, tap_center_y, tap_center_z + 38.0),
)

side_rod = make_cylinder_between(
    handle_sphere_center,
    (front_cap_face_x - 61.0, tap_center_y - 17.0, tap_center_z + 8.0),
    handle_rod_radius,
)
side_ball = make_sphere(
    4.5,
    (front_cap_face_x - 62.0, tap_center_y - 20.0, tap_center_z + 6.8),
)

lower_rod = make_cylinder_between(
    (front_cap_face_x - 43.0, tap_center_y, tap_center_z - 9.0),
    (front_cap_face_x - 43.0, tap_center_y, tap_center_z - 24.0),
    3.0,
)
lower_ball = make_sphere(
    5.2,
    (front_cap_face_x - 43.0, tap_center_y, tap_center_z - 29.0),
)

short_nozzle = make_cylinder_between(
    (front_cap_face_x - 46.0, tap_center_y, tap_center_z - 5.5),
    (front_cap_face_x - 62.0, tap_center_y, tap_center_z - 16.5),
    3.0,
)
nozzle_end = make_sphere(
    3.8,
    (front_cap_face_x - 64.0, tap_center_y, tap_center_z - 18.0),
)

tap_handle = (
    handle_disc.union(handle_sphere)
    .union(upper_rod)
    .union(upper_ball)
    .union(side_rod)
    .union(side_ball)
    .union(lower_rod)
    .union(lower_ball)
    .union(short_nozzle)
    .union(nozzle_end)
)

# Cradle frame
rail_center_z = foot_height + rail_height / 2.0 - 0.5
rail_y_positions = (-rail_spacing / 2.0, rail_spacing / 2.0)
foot_x_positions = (-rail_length / 2.0 + foot_length / 2.0 - 4.0, rail_length / 2.0 - foot_length / 2.0 + 4.0)

cradle_components = []

for rail_y in rail_y_positions:
    for foot_x in foot_x_positions:
        cradle_components.append(make_trapezoid_foot(foot_x, rail_y, foot_height / 2.0))

for rail_y in rail_y_positions:
    cradle_components.append(
        make_rounded_box(
            rail_length,
            rail_width,
            rail_height,
            (0.0, rail_y, rail_center_z),
            rail_fillet,
        )
    )

# Raised pads on one rail echo the spacer-bar pads visible in the assembly.
for pad_x in saddle_x_positions:
    cradle_components.append(
        make_rounded_box(
            pad_length,
            rail_width,
            pad_height,
            (
                pad_x,
                rail_spacing / 2.0,
                rail_center_z + rail_height / 2.0 + pad_height / 2.0 - 0.2,
            ),
            0.6,
        )
    )

cradle_components.append(make_key_bar())

for saddle_x in saddle_x_positions:
    cradle_components.append(make_saddle_support(saddle_x))

cradle = cradle_components[0]
for cradle_component in cradle_components[1:]:
    cradle = cradle.union(cradle_component)

# Unite all assembly components into a single model.
result = barrel_shell
result = result.union(front_retaining_ring)
result = result.union(rear_retaining_ring)
result = result.union(front_cap)
result = result.union(rear_cap)
result = result.union(collar)
result = result.union(plug)
result = result.union(tap_base)
result = result.union(spacer_sleeve)
result = result.union(valve_knob)
result = result.union(tap_handle)
result = result.union(cradle)