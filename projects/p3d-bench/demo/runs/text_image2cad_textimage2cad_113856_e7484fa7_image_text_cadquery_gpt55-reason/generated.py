import math
import cadquery as cq

# Parameters
# Coordinate convention: Y is the vertical assembly axis.
vane_count = 40

# Overall vertical placement
disc_top_y = 400.0
rod_to_disc_overlap = 0.3
hub_to_cage_top_offset = 5.0

# Top disc plate
disc_diameter = 180.0
disc_radius = disc_diameter / 2.0
disc_thickness = 10.0
disc_hole_diameter = 10.0
disc_hole_radius = disc_hole_diameter / 2.0
disc_edge_chamfer = 0.75
disc_center_y = disc_top_y - disc_thickness / 2.0
disc_bottom_y = disc_top_y - disc_thickness

# Rod
rod_diameter = 10.0
rod_radius = rod_diameter / 2.0
rod_length = 500.0
rod_top_y = disc_bottom_y + rod_to_disc_overlap
rod_bottom_y = rod_top_y - rod_length
rod_center_y = (rod_top_y + rod_bottom_y) / 2.0

# Cage / slats
slat_thickness = 3.9
slat_height = 300.0
slat_max_radial_width = 50.0
slat_min_radial_width = 34.0
slat_curvature_radius = 572.5
cage_max_outer_radius = 138.5
cage_top_y = rod_bottom_y + hub_to_cage_top_offset
cage_bottom_y = cage_top_y - slat_height
slat_curve_samples = 32
slat_notch_depth = 14.0
slat_notch_height = 30.0
slat_notch_offset_from_end = 30.0

# Splined ring
splined_ring_inner_radius = 80.0
splined_ring_tooth_root_radius = 95.5
splined_ring_tooth_outer_radius = 100.0
splined_ring_thickness = 3.9
splined_ring_tooth_fraction = 0.52
splined_ring_center_y = cage_top_y - 4.0

# Flanged bushing
bushing_flange_outer_radius = 56.5 / 2.0
bushing_boss_radius = 44.25 / 2.0
bushing_bore_radius = 40.0 / 2.0
bushing_flange_thickness = 3.25
bushing_boss_height = 8.0
bushing_height = bushing_flange_thickness + bushing_boss_height
bushing_bottom_y = splined_ring_center_y + splined_ring_thickness / 2.0 - 0.5
bushing_top_y = bushing_bottom_y + bushing_height

# Locating plug
plug_top_y = bushing_top_y + 1.0
plug_total_height = 77.22
plug_rim_radius = 23.0
plug_rim_height = 5.0
plug_body_radius = 20.0
plug_body_height = 44.22
plug_base_radius = 11.0
plug_base_height = 6.0
plug_blind_bore_radius = 24.0 / 2.0
plug_blind_bore_depth = 10.0

# Knob
knob_height = 81.0
knob_sphere_radius = 30.0
knob_base_radius = 9.0
knob_cone_height = 30.0
knob_base_y = bushing_top_y - 0.5
knob_top_y = knob_base_y + knob_height


# Helper functions
def cylinder_y(radius, height, center_y):
    """Create a cylinder centered on the Y axis."""
    return (
        cq.Workplane("XZ")
        .circle(radius)
        .extrude(height, both=True)
        .translate((0.0, center_y, 0.0))
    )


def annular_cylinder_y(outer_radius, inner_radius, height, center_y):
    """Create an annular cylinder centered on the Y axis."""
    return (
        cq.Workplane("XZ")
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(height, both=True)
        .translate((0.0, center_y, 0.0))
    )


def revolve_profile_about_y(profile_points):
    """Revolve a closed radial/Y profile about the Y axis."""
    workplane = cq.Workplane("XY").moveTo(profile_points[0][0], profile_points[0][1])
    for radius, y_pos in profile_points[1:]:
        workplane = workplane.lineTo(radius, y_pos)
    return workplane.close().revolve(
        360.0,
        axisStart=(0.0, 0.0),
        axisEnd=(0.0, 1.0),
    )


def extrude_xz_polygon(points, thickness):
    """Extrude a closed X/Z polygon symmetrically along Y."""
    workplane = cq.Workplane("XZ").moveTo(points[0][0], points[0][1])
    for x_pos, z_pos in points[1:]:
        workplane = workplane.lineTo(x_pos, z_pos)
    return workplane.close().extrude(thickness, both=True)


# Top disc plate with central through-hole
top_disc = annular_cylinder_y(
    disc_radius,
    disc_hole_radius,
    disc_thickness,
    disc_center_y,
)

if disc_edge_chamfer > 0.0:
    top_disc = top_disc.edges("%CIRCLE").chamfer(disc_edge_chamfer)

# Long central rod, with only a slight insertion into the disc bore
rod = cylinder_y(rod_radius, rod_length, rod_center_y)

# Thin splined ring with 40 external teeth
pitch_angle = 2.0 * math.pi / vane_count
tooth_half_angle = pitch_angle * splined_ring_tooth_fraction / 2.0
tooth_points = [
    (
        splined_ring_tooth_root_radius * math.cos(-pitch_angle / 2.0),
        splined_ring_tooth_root_radius * math.sin(-pitch_angle / 2.0),
    )
]

for tooth_index in range(vane_count):
    tooth_center_angle = tooth_index * pitch_angle
    tooth_start_angle = tooth_center_angle - tooth_half_angle
    tooth_end_angle = tooth_center_angle + tooth_half_angle

    tooth_points.extend(
        [
            (
                splined_ring_tooth_root_radius * math.cos(tooth_start_angle),
                splined_ring_tooth_root_radius * math.sin(tooth_start_angle),
            ),
            (
                splined_ring_tooth_outer_radius * math.cos(tooth_start_angle),
                splined_ring_tooth_outer_radius * math.sin(tooth_start_angle),
            ),
            (
                splined_ring_tooth_outer_radius * math.cos(tooth_end_angle),
                splined_ring_tooth_outer_radius * math.sin(tooth_end_angle),
            ),
            (
                splined_ring_tooth_root_radius * math.cos(tooth_end_angle),
                splined_ring_tooth_root_radius * math.sin(tooth_end_angle),
            ),
        ]
    )

    if tooth_index < vane_count - 1:
        gap_mid_angle = tooth_center_angle + pitch_angle / 2.0
        tooth_points.append(
            (
                splined_ring_tooth_root_radius * math.cos(gap_mid_angle),
                splined_ring_tooth_root_radius * math.sin(gap_mid_angle),
            )
        )

splined_ring_blank = extrude_xz_polygon(tooth_points, splined_ring_thickness)
splined_ring = (
    splined_ring_blank
    .cut(cylinder_y(splined_ring_inner_radius, splined_ring_thickness + 2.0, 0.0))
    .translate((0.0, splined_ring_center_y, 0.0))
)

# Flanged bushing as a revolved stepped annular profile
bushing_flange_top_y = bushing_bottom_y + bushing_flange_thickness
bushing_profile = [
    (bushing_bore_radius, bushing_bottom_y),
    (bushing_flange_outer_radius, bushing_bottom_y),
    (bushing_flange_outer_radius, bushing_flange_top_y),
    (bushing_boss_radius, bushing_flange_top_y),
    (bushing_boss_radius, bushing_top_y),
    (bushing_bore_radius, bushing_top_y),
]
flanged_bushing = revolve_profile_about_y(bushing_profile)

# Locating plug with top rim, straight body, conical lower taper, and blind top bore
plug_bottom_y = plug_top_y - plug_total_height
plug_rim_bottom_y = plug_top_y - plug_rim_height
plug_body_bottom_y = plug_rim_bottom_y - plug_body_height
plug_base_top_y = plug_bottom_y + plug_base_height

plug_profile = [
    (0.0, plug_bottom_y),
    (plug_base_radius, plug_bottom_y),
    (plug_base_radius, plug_base_top_y),
    (plug_body_radius, plug_body_bottom_y),
    (plug_body_radius, plug_rim_bottom_y),
    (plug_rim_radius, plug_rim_bottom_y),
    (plug_rim_radius, plug_top_y),
    (0.0, plug_top_y),
]
locating_plug = revolve_profile_about_y(plug_profile)

plug_blind_bore = cylinder_y(
    plug_blind_bore_radius,
    plug_blind_bore_depth + 1.0,
    plug_top_y - plug_blind_bore_depth / 2.0,
)
locating_plug = locating_plug.cut(plug_blind_bore)

# Knob: flat base, conical stem, and spherical upper dome
knob_sphere_center_y = knob_top_y - knob_sphere_radius
knob_blend_y = knob_base_y + knob_cone_height
knob_blend_radius = math.sqrt(
    max(
        0.0,
        knob_sphere_radius**2 - (knob_blend_y - knob_sphere_center_y) ** 2,
    )
)
knob_blend_angle = math.atan2(
    knob_blend_radius,
    knob_blend_y - knob_sphere_center_y,
)
knob_mid_angle = knob_blend_angle / 2.0
knob_arc_mid = (
    knob_sphere_radius * math.sin(knob_mid_angle),
    knob_sphere_center_y + knob_sphere_radius * math.cos(knob_mid_angle),
)

knob = (
    cq.Workplane("XY")
    .moveTo(0.0, knob_base_y)
    .lineTo(knob_base_radius, knob_base_y)
    .lineTo(knob_blend_radius, knob_blend_y)
    .threePointArc(knob_arc_mid, (0.0, knob_top_y))
    .close()
    .revolve(360.0, axisStart=(0.0, 0.0), axisEnd=(0.0, 1.0))
)

# One bowed radial slat, then rotate it 40 times around the Y axis.
half_slat_height = slat_height / 2.0
slat_end_curve_offset = math.sqrt(slat_curvature_radius**2 - half_slat_height**2)
slat_barrel_bow = slat_curvature_radius - slat_end_curve_offset
slat_outer_end_radius = cage_max_outer_radius - slat_barrel_bow

outer_profile_points = []
inner_profile_points = []

for sample_index in range(slat_curve_samples + 1):
    t = sample_index / slat_curve_samples
    y_pos = cage_top_y - t * slat_height
    curve_y_offset = (t - 0.5) * slat_height
    local_bow = (
        math.sqrt(slat_curvature_radius**2 - curve_y_offset**2)
        - slat_end_curve_offset
    )
    bow_fraction = local_bow / slat_barrel_bow if slat_barrel_bow > 0.0 else 0.0

    outer_radius = slat_outer_end_radius + local_bow
    radial_width = slat_min_radial_width + (
        slat_max_radial_width - slat_min_radial_width
    ) * bow_fraction
    inner_radius = outer_radius - radial_width

    outer_profile_points.append((outer_radius, y_pos))
    inner_profile_points.append((inner_radius, y_pos))

slat_profile_points = outer_profile_points + list(reversed(inner_profile_points))

slat_profile = cq.Workplane("XY").moveTo(
    slat_profile_points[0][0],
    slat_profile_points[0][1],
)
for x_pos, y_pos in slat_profile_points[1:]:
    slat_profile = slat_profile.lineTo(x_pos, y_pos)

base_slat = slat_profile.close().extrude(slat_thickness, both=True)

# Stylized locating notches on the inner edge near both ends of the slat.
slat_inner_end_radius = slat_outer_end_radius - slat_min_radial_width
notch_radial_limit = slat_inner_end_radius + slat_notch_depth

top_notch_cut = (
    cq.Workplane("XY")
    .box(notch_radial_limit, slat_notch_height, slat_thickness + 4.0)
    .translate(
        (
            notch_radial_limit / 2.0,
            cage_top_y - slat_notch_offset_from_end,
            0.0,
        )
    )
)

bottom_notch_cut = (
    cq.Workplane("XY")
    .box(notch_radial_limit, slat_notch_height, slat_thickness + 4.0)
    .translate(
        (
            notch_radial_limit / 2.0,
            cage_bottom_y + slat_notch_offset_from_end,
            0.0,
        )
    )
)

base_slat = base_slat.cut(top_notch_cut).cut(bottom_notch_cut)

# Collect all solids as one compound result.
model_solids = [
    top_disc.val(),
    rod.val(),
    splined_ring.val(),
    flanged_bushing.val(),
    locating_plug.val(),
    knob.val(),
]

for vane_index in range(vane_count):
    angle_degrees = vane_index * 360.0 / vane_count
    slat_instance = base_slat.rotate(
        (0.0, 0.0, 0.0),
        (0.0, 1.0, 0.0),
        angle_degrees,
    )
    model_solids.append(slat_instance.val())

result = cq.Workplane("XY").add(cq.Compound.makeCompound(model_solids))