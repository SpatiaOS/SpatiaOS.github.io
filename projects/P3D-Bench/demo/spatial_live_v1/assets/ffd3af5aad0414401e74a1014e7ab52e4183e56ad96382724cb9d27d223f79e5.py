import math
import cadquery as cq

# Dimensions in millimetres. X is the shaft axis; Z is vertical.
shaft_length = 438.0
shaft_diameter = 6.0
piston_pitch = 100.0
crank_radius = 30.0
crank_phases_deg = (135.0, 315.0, 315.0, 135.0)

crank_disc_diameter = 30.0
crank_disc_thickness = 14.0
disc_edge_chamfer = 0.25
crank_web_thickness = 3.0
crank_web_width = 5.0
crank_web_end_extension = 2.0
crank_web_slot_length = 14.0
crank_web_slot_width = 1.6

piston_diameter = 50.0
piston_height = 40.0
skirt_bore_diameter = 40.0
skirt_bore_depth = 28.0
crown_pocket_diameter = 30.0
crown_thickness = 5.0
crown_edge_radius = 0.3
ring_groove_radius = 0.55
ring_groove_top_offset = 1.6

wrist_pin_diameter = 12.0
wrist_pin_height = 20.0
wrist_pin_length = 50.8
wrist_pin_end_chamfer = 0.3
pin_pad_width = 16.0
pin_pad_height = 14.0
pin_pad_depth = 1.5

skirt_notch_width = 14.0
skirt_notch_height = 3.5
spacer_outer_diameter = 54.56
spacer_inner_diameter = 50.0
spacer_height = 5.0
spacer_top_clearance = 2.8

rod_center_distance = 90.0
rod_thickness = 12.0
big_end_outer_diameter = 38.0
big_end_bore_diameter = 30.0
small_end_outer_diameter = 20.0
rod_shank_width = 11.0
rod_recess_width = 4.8
rod_recess_depth = 3.8
small_end_fork_gap = 4.5
small_end_fork_depth = 12.0

bushing_outer_diameter = 8.0
bushing_inner_diameter = 6.0
bushing_length = 5.0
bushing_end_inset = 0.8

# Slight interference at nominally coincident fits ensures one fused solid.
fit_overlap = 0.02
cut_clearance = 1.0


def x_plane(x_position=0.0, y_position=0.0, z_position=0.0):
    """Sketch coordinates are transverse Y and vertical Z."""
    return cq.Plane(
        origin=(x_position, y_position, z_position),
        xDir=(0, 1, 0),
        normal=(1, 0, 0),
    )


def x_cylinder(radius, length, x_start, y_center=0.0, z_center=0.0):
    return (
        cq.Workplane(x_plane(x_start, y_center, z_center))
        .circle(radius)
        .extrude(length)
    )


def make_crank_web(x_start, throw_y, throw_z):
    """Slotted rectangular crank arm between a main journal and an offset disc."""
    throw_length = math.hypot(throw_y, throw_z)
    direction_y = throw_y / throw_length
    direction_z = throw_z / throw_length
    normal_y = -direction_z
    normal_z = direction_y
    half_width = crank_web_width / 2.0

    start_y = -crank_web_end_extension * direction_y
    start_z = -crank_web_end_extension * direction_z
    end_y = throw_y + crank_web_end_extension * direction_y
    end_z = throw_z + crank_web_end_extension * direction_z

    outline = [
        (start_y + half_width * normal_y, start_z + half_width * normal_z),
        (end_y + half_width * normal_y, end_z + half_width * normal_z),
        (end_y - half_width * normal_y, end_z - half_width * normal_z),
        (start_y - half_width * normal_y, start_z - half_width * normal_z),
    ]

    web = (
        cq.Workplane(x_plane(x_start))
        .polyline(outline)
        .close()
        .extrude(crank_web_thickness + fit_overlap)
    )
    slot = (
        cq.Workplane(x_plane(x_start - cut_clearance))
        .center(throw_y / 2.0, throw_z / 2.0)
        .slot2D(
            crank_web_slot_length,
            crank_web_slot_width,
            math.degrees(math.atan2(throw_z, throw_y)),
        )
        .extrude(crank_web_thickness + fit_overlap + 2.0 * cut_clearance)
    )
    return web.cut(slot)


# Piston template: closed crown, stepped underside cavity, and transverse pin bore.
piston_radius = piston_diameter / 2.0
piston_template = (
    cq.Workplane("XY")
    .circle(piston_radius)
    .extrude(piston_height)
    .edges(">Z")
    .fillet(crown_edge_radius)
)

lower_bore = (
    cq.Workplane("XY", origin=(0, 0, -cut_clearance))
    .circle(skirt_bore_diameter / 2.0)
    .extrude(skirt_bore_depth + cut_clearance)
)
upper_pocket = (
    cq.Workplane("XY", origin=(0, 0, -cut_clearance))
    .circle(crown_pocket_diameter / 2.0)
    .extrude(piston_height - crown_thickness + cut_clearance)
)
piston_template = piston_template.cut(lower_bore).cut(upper_pocket)

pin_bore = x_cylinder(
    wrist_pin_diameter / 2.0,
    piston_diameter + 2.0 * cut_clearance,
    -piston_radius - cut_clearance,
    z_center=wrist_pin_height,
)
piston_template = piston_template.cut(pin_bore)

# Small flat lands around the visible wrist-pin ends.
for side in (-1.0, 1.0):
    pin_pad_cut = (
        cq.Workplane("XY")
        .box(2.0 * pin_pad_depth, pin_pad_width, pin_pad_height)
        .translate((side * piston_radius, 0, wrist_pin_height))
    )
    piston_template = piston_template.cut(pin_pad_cut)

skirt_relief = (
    cq.Workplane("XY")
    .box(
        skirt_notch_width,
        piston_diameter + 2.0 * cut_clearance,
        skirt_notch_height + cut_clearance,
        centered=(True, True, False),
    )
    .translate((0, 0, -cut_clearance))
)
piston_template = piston_template.cut(skirt_relief)

groove_tool = cq.Solid.makeTorus(
    piston_radius,
    ring_groove_radius,
    cq.Vector(0, 0, piston_height - ring_groove_top_offset),
    cq.Vector(0, 0, 1),
)
piston_template = piston_template.cut(groove_tool)

spacer_bottom = piston_height - spacer_top_clearance - spacer_height
spacer_template = (
    cq.Workplane("XY", origin=(0, 0, spacer_bottom))
    .circle(spacer_outer_diameter / 2.0)
    .circle(spacer_inner_diameter / 2.0 - fit_overlap)
    .extrude(spacer_height)
)
piston_template = piston_template.union(spacer_template)

# Connecting-rod template, initially vertical with its big-end centre at the origin.
big_radius = big_end_outer_diameter / 2.0
small_radius = small_end_outer_diameter / 2.0
shank_half_width = rod_shank_width / 2.0
shoulder_y = big_radius * math.cos(math.radians(35.0))
shoulder_z = big_radius * math.sin(math.radians(35.0))
neck_root_height = 1.68 * big_radius
neck_root_half_width = shank_half_width + 0.5

rod_template = (
    cq.Workplane(x_plane(-rod_thickness / 2.0))
    .moveTo(shoulder_y, shoulder_z)
    .threePointArc((0, -big_radius), (-shoulder_y, shoulder_z))
    .threePointArc(
        (-0.46 * big_radius, 1.16 * big_radius),
        (-neck_root_half_width, neck_root_height),
    )
    .lineTo(-shank_half_width, rod_center_distance - 1.6 * small_radius)
    .threePointArc(
        (-0.6 * small_radius, rod_center_distance - small_radius),
        (-0.8 * small_radius, rod_center_distance - 0.6 * small_radius),
    )
    .threePointArc(
        (0, rod_center_distance + small_radius),
        (0.8 * small_radius, rod_center_distance - 0.6 * small_radius),
    )
    .threePointArc(
        (0.6 * small_radius, rod_center_distance - small_radius),
        (shank_half_width, rod_center_distance - 1.6 * small_radius),
    )
    .lineTo(neck_root_half_width, neck_root_height)
    .threePointArc(
        (0.46 * big_radius, 1.16 * big_radius),
        (shoulder_y, shoulder_z),
    )
    .close()
    .extrude(rod_thickness)
)

for bore_height, bore_radius in (
    (0.0, big_end_bore_diameter / 2.0),
    (rod_center_distance, wrist_pin_diameter / 2.0),
):
    rod_template = rod_template.cut(
        x_cylinder(
            bore_radius,
            rod_thickness + 2.0 * cut_clearance,
            -rod_thickness / 2.0 - cut_clearance,
            z_center=bore_height,
        )
    )

# Recess both broad faces, leaving side flanges and a central I-beam web.
recess_bottom = big_radius + 9.0
recess_top = rod_center_distance - small_radius - 4.0
recess_length = recess_top - recess_bottom
recess_center = (recess_top + recess_bottom) / 2.0

for recess_start in (
    -rod_thickness / 2.0 - fit_overlap,
    rod_thickness / 2.0 - rod_recess_depth,
):
    recess_tool = (
        cq.Workplane(x_plane(recess_start))
        .center(0, recess_center)
        .slot2D(recess_length, rod_recess_width, 90.0)
        .extrude(rod_recess_depth + fit_overlap)
    )
    rod_template = rod_template.cut(recess_tool)

fork_clearance = (
    cq.Workplane("XY")
    .box(
        small_end_fork_gap,
        small_end_outer_diameter + 2.0 * cut_clearance,
        small_end_fork_depth + small_radius + cut_clearance,
        centered=(True, True, False),
    )
    .translate((0, 0, rod_center_distance - small_end_fork_depth))
)
rod_template = rod_template.cut(fork_clearance)

# Model the implied wrist pins integrally so the pistons remain connected.
wrist_pin_template = (
    x_cylinder(
        wrist_pin_diameter / 2.0 + fit_overlap,
        wrist_pin_length,
        -wrist_pin_length / 2.0,
        z_center=rod_center_distance,
    )
    .edges("%Circle")
    .chamfer(wrist_pin_end_chamfer)
)
rod_template = rod_template.union(wrist_pin_template)

disc_template = (
    x_cylinder(
        crank_disc_diameter / 2.0 + fit_overlap,
        crank_disc_thickness,
        -crank_disc_thickness / 2.0,
    )
    .edges("%Circle")
    .chamfer(disc_edge_chamfer)
)

# Five coaxial main-journal segments joined through four offset crank discs.
crank_stations = tuple(
    (index - (len(crank_phases_deg) - 1) / 2.0) * piston_pitch
    for index in range(len(crank_phases_deg))
)
shaft_start = -shaft_length / 2.0
shaft_end = shaft_length / 2.0
half_disc_thickness = crank_disc_thickness / 2.0

first_journal_end = crank_stations[0] - half_disc_thickness + fit_overlap
result = x_cylinder(
    shaft_diameter / 2.0,
    first_journal_end - shaft_start,
    shaft_start,
)

for index, (station, phase_deg) in enumerate(
    zip(crank_stations, crank_phases_deg)
):
    phase = math.radians(phase_deg)
    throw_y = crank_radius * math.cos(phase)
    throw_z = crank_radius * math.sin(phase)

    front_web = make_crank_web(
        station - half_disc_thickness - crank_web_thickness,
        throw_y,
        throw_z,
    )
    rear_web = make_crank_web(
        station + half_disc_thickness - fit_overlap,
        throw_y,
        throw_z,
    )
    crank_disc = disc_template.translate((station, throw_y, throw_z))

    result = result.union(front_web).union(crank_disc).union(rear_web)

    next_journal_start = station + half_disc_thickness - fit_overlap
    next_journal_end = (
        crank_stations[index + 1] - half_disc_thickness + fit_overlap
        if index + 1 < len(crank_stations)
        else shaft_end
    )
    result = result.union(
        x_cylinder(
            shaft_diameter / 2.0,
            next_journal_end - next_journal_start,
            next_journal_start,
        )
    )

    # Slider-crank closure keeps every piston axis on the same longitudinal plane.
    rod_angle_deg = math.degrees(math.asin(throw_y / rod_center_distance))
    wrist_center_z = throw_z + math.sqrt(
        rod_center_distance**2 - throw_y**2
    )
    piston_bottom_z = wrist_center_z - wrist_pin_height

    positioned_rod = (
        rod_template
        .rotate((0, 0, 0), (1, 0, 0), rod_angle_deg)
        .translate((station, throw_y, throw_z))
    )
    positioned_piston = piston_template.translate(
        (station, 0, piston_bottom_z)
    )

    result = result.union(positioned_rod).union(positioned_piston)

end_bushing = (
    cq.Workplane(x_plane(shaft_start + bushing_end_inset))
    .circle(bushing_outer_diameter / 2.0)
    .circle(bushing_inner_diameter / 2.0 - fit_overlap)
    .extrude(bushing_length)
)
result = result.union(end_bushing).clean()