import cadquery as cq

# Parameters (millimeters)
base_length = 303.9
base_width = 159.5
base_height = 72.0

housing_length = 227.4
housing_width = 119.7
housing_height = 50.0

cover_plate_length = 241.82
cover_plate_width = 126.86
cover_plate_thickness = 6.0

# Assembly stacking
cover_plate_bottom_z = base_height - cover_plate_thickness * 0.35
housing_base_z = cover_plate_bottom_z + cover_plate_thickness - 0.60
housing_top_z = housing_base_z + housing_height

# Detail dimensions
control_panel_center_x = -6.0
control_panel_center_y = 0.0
control_panel_outer_radius_x = 43.0
control_panel_outer_radius_y = 24.5
control_panel_cut_radius_x = 39.5
control_panel_cut_radius_y = 21.5
control_panel_recess_depth = 1.15
control_panel_floor_z = housing_top_z - control_panel_recess_depth

symbol_relief_height = 0.40
symbol_embed_depth = 0.04
symbol_bottom_z = control_panel_floor_z - symbol_embed_depth

boolean_overlap = 0.25


# Helper functions
def make_ellipse_wire(z_height, x_radius, y_radius, center_x=0.0, center_y=0.0):
    return (
        cq.Workplane("XY")
        .transformed(offset=(center_x, center_y, z_height))
        .ellipse(x_radius, y_radius)
        .val()
    )


def make_lofted_body(sections):
    wires = [
        make_ellipse_wire(z, rx, ry, cx, cy)
        for z, rx, ry, cx, cy in sections
    ]
    return cq.Workplane("XY").add(cq.Solid.makeLoft(wires, ruled=False))


def make_ellipse_disc(z_bottom, x_radius, y_radius, height, center_x=0.0, center_y=0.0):
    return (
        cq.Workplane("XY")
        .transformed(offset=(center_x, center_y, z_bottom))
        .ellipse(x_radius, y_radius)
        .extrude(height)
    )


def make_ellipse_ring(
    z_bottom,
    outer_x_radius,
    outer_y_radius,
    inner_x_radius,
    inner_y_radius,
    height,
    center_x=0.0,
    center_y=0.0,
):
    outer = make_ellipse_disc(
        z_bottom,
        outer_x_radius,
        outer_y_radius,
        height,
        center_x,
        center_y,
    )
    inner_cutter = make_ellipse_disc(
        z_bottom - boolean_overlap,
        inner_x_radius,
        inner_y_radius,
        height + 2.0 * boolean_overlap,
        center_x,
        center_y,
    )
    return outer.cut(inner_cutter)


def make_raised_bar(center_x, center_y, z_bottom, length, width, height, angle_deg=0.0):
    return (
        cq.Workplane("XY")
        .box(length, width, height)
        .rotate((0, 0, 0), (0, 0, 1), angle_deg)
        .translate((center_x, center_y, z_bottom + height / 2.0))
    )


def make_circular_ring(center_x, center_y, z_bottom, outer_radius, stroke_width, height):
    inner_radius = max(outer_radius - stroke_width, 0.01)
    outer = cq.Workplane("XY").circle(outer_radius).extrude(height)
    inner_cutter = (
        cq.Workplane("XY")
        .circle(inner_radius)
        .extrude(height + 2.0 * boolean_overlap)
        .translate((0, 0, -boolean_overlap))
    )
    return outer.cut(inner_cutter).translate((center_x, center_y, z_bottom))


def make_polygon_prism(points, z_bottom, height):
    return (
        cq.Workplane("XY")
        .polyline(points)
        .close()
        .extrude(height)
        .translate((0, 0, z_bottom))
    )


# Base cover: broad low pebble dome tapering up to the parting seam
base_radius_x = base_length / 2.0
base_radius_y = base_width / 2.0
base_top_radius_x = cover_plate_length / 2.0 + 1.5
base_top_radius_y = cover_plate_width / 2.0 + 0.8

base_sections = [
    (0.0, base_radius_x, base_radius_y, 0.0, 0.0),
    (3.0, base_radius_x - 0.7, base_radius_y - 0.3, 0.0, 0.0),
    (14.0, base_radius_x - 3.0, base_radius_y - 1.7, 0.0, 0.0),
    (34.0, base_radius_x - 12.0, base_radius_y - 6.0, 0.0, 0.0),
    (55.0, base_radius_x - 23.0, base_radius_y - 11.0, 0.0, 0.0),
    (68.0, base_top_radius_x + 3.0, base_top_radius_y + 1.8, 0.0, 0.0),
    (base_height, base_top_radius_x, base_top_radius_y, 0.0, 0.0),
]
base_cover = make_lofted_body(base_sections)

# Thin oval cover plate visible at the circumferential seam
cover_plate = make_ellipse_disc(
    cover_plate_bottom_z,
    cover_plate_length / 2.0,
    cover_plate_width / 2.0,
    cover_plate_thickness,
)

# Upper housing cover: smaller dome with a flattened oval top deck
housing_base_radius_x = housing_length / 2.0
housing_base_radius_y = housing_width / 2.0

housing_sections = [
    (housing_base_z, housing_base_radius_x, housing_base_radius_y, 0.0, 0.0),
    (housing_base_z + 4.0, housing_base_radius_x - 0.9, housing_base_radius_y - 0.4, 0.0, 0.0),
    (housing_base_z + 14.0, housing_base_radius_x - 5.6, housing_base_radius_y - 2.8, 0.0, 0.0),
    (housing_base_z + 29.0, housing_base_radius_x - 19.5, housing_base_radius_y - 10.2, 0.0, 0.0),
    (housing_base_z + 42.0, housing_base_radius_x - 43.5, housing_base_radius_y - 22.3, 0.0, 0.0),
    (housing_top_z, 54.0, 29.0, 0.0, 0.0),
]
housing_cover = make_lofted_body(housing_sections)

# Blind oval recess for the control panel
panel_recess_cutter = make_ellipse_disc(
    control_panel_floor_z,
    control_panel_cut_radius_x,
    control_panel_cut_radius_y,
    control_panel_recess_depth + 2.0,
    control_panel_center_x,
    control_panel_center_y,
)
housing_cover = housing_cover.cut(panel_recess_cutter)

# Seam and rim relief details
bottom_rim = make_ellipse_ring(
    0.35,
    base_radius_x,
    base_radius_y,
    base_radius_x - 2.5,
    base_radius_y - 1.5,
    0.80,
)

base_upper_lip = make_ellipse_ring(
    base_height - 1.10,
    base_top_radius_x + 2.3,
    base_top_radius_y + 1.3,
    cover_plate_length / 2.0 - 2.5,
    cover_plate_width / 2.0 - 1.4,
    1.00,
)

cover_plate_top_bead = make_ellipse_ring(
    cover_plate_bottom_z + cover_plate_thickness - 0.35,
    cover_plate_length / 2.0 + 0.3,
    cover_plate_width / 2.0 + 0.2,
    cover_plate_length / 2.0 - 2.1,
    cover_plate_width / 2.0 - 1.2,
    0.65,
)

housing_base_bead = make_ellipse_ring(
    housing_base_z + 0.85,
    housing_base_radius_x + 1.2,
    housing_base_radius_y + 0.7,
    housing_base_radius_x - 2.1,
    housing_base_radius_y - 1.2,
    0.85,
)

housing_lower_groove_line = make_ellipse_ring(
    housing_base_z + 5.0,
    housing_base_radius_x - 1.2,
    housing_base_radius_y - 0.7,
    housing_base_radius_x - 3.7,
    housing_base_radius_y - 2.0,
    0.55,
)

# Raised oval bezel and fine inner line around the recessed control panel
control_panel_outer_rim = make_ellipse_ring(
    housing_top_z - 0.12,
    control_panel_outer_radius_x,
    control_panel_outer_radius_y,
    control_panel_cut_radius_x - 0.3,
    control_panel_cut_radius_y - 0.3,
    0.82,
    control_panel_center_x,
    control_panel_center_y,
)

control_panel_inner_line = make_ellipse_ring(
    control_panel_floor_z - 0.02,
    control_panel_cut_radius_x - 3.0,
    control_panel_cut_radius_y - 1.6,
    control_panel_cut_radius_x - 4.2,
    control_panel_cut_radius_y - 2.7,
    0.32,
    control_panel_center_x,
    control_panel_center_y,
)

# Five small circular dot features on the panel
dot_points = [
    (control_panel_center_x - 29.0, 8.4),
    (control_panel_center_x - 21.0, 11.5),
    (control_panel_center_x - 12.5, 13.6),
    (control_panel_center_x - 4.0, 14.8),
    (control_panel_center_x + 4.5, 14.1),
]
control_panel_dots = (
    cq.Workplane("XY")
    .pushPoints(dot_points)
    .circle(0.75)
    .extrude(symbol_relief_height)
    .translate((0, 0, symbol_bottom_z))
)

# Embossed relief symbols arranged in a cross pattern
minus_icon = make_raised_bar(
    control_panel_center_x - 27.0,
    -8.5,
    symbol_bottom_z,
    9.5,
    1.3,
    symbol_relief_height,
)

x_icon_a = make_raised_bar(
    control_panel_center_x + 28.0,
    12.0,
    symbol_bottom_z,
    11.0,
    1.3,
    symbol_relief_height,
    45.0,
)
x_icon_b = make_raised_bar(
    control_panel_center_x + 28.0,
    12.0,
    symbol_bottom_z,
    11.0,
    1.3,
    symbol_relief_height,
    -45.0,
)

power_center_x = control_panel_center_x - 1.5
power_center_y = -12.0
power_ring = make_circular_ring(
    power_center_x,
    power_center_y,
    symbol_bottom_z,
    4.3,
    1.0,
    symbol_relief_height,
)
power_stem = make_raised_bar(
    power_center_x,
    power_center_y + 3.3,
    symbol_bottom_z,
    1.1,
    5.2,
    symbol_relief_height,
)

speaker_center_x = control_panel_center_x + 19.0
speaker_center_y = -4.0
speaker_body = make_polygon_prism(
    [
        (speaker_center_x - 5.0, speaker_center_y - 2.2),
        (speaker_center_x - 1.2, speaker_center_y - 2.2),
        (speaker_center_x + 3.2, speaker_center_y - 5.2),
        (speaker_center_x + 3.2, speaker_center_y + 5.2),
        (speaker_center_x - 1.2, speaker_center_y + 2.2),
        (speaker_center_x - 5.0, speaker_center_y + 2.2),
    ],
    symbol_bottom_z,
    symbol_relief_height,
)
speaker_wave_a = make_raised_bar(
    speaker_center_x + 7.0,
    speaker_center_y,
    symbol_bottom_z,
    1.1,
    7.5,
    symbol_relief_height,
    -20.0,
)
speaker_wave_b = make_raised_bar(
    speaker_center_x + 9.5,
    speaker_center_y,
    symbol_bottom_z,
    1.0,
    10.0,
    symbol_relief_height,
    -20.0,
)

bluetooth_center_x = control_panel_center_x - 1.0
bluetooth_center_y = 2.2
bluetooth_vertical = make_raised_bar(
    bluetooth_center_x,
    bluetooth_center_y,
    symbol_bottom_z,
    1.1,
    10.0,
    symbol_relief_height,
)
bluetooth_upper = make_raised_bar(
    bluetooth_center_x + 1.8,
    bluetooth_center_y + 2.4,
    symbol_bottom_z,
    6.0,
    1.1,
    symbol_relief_height,
    -45.0,
)
bluetooth_lower = make_raised_bar(
    bluetooth_center_x + 1.8,
    bluetooth_center_y - 2.4,
    symbol_bottom_z,
    6.0,
    1.1,
    symbol_relief_height,
    45.0,
)

# Small side logo relief on the front-facing slope
logo_plane = cq.Plane(
    origin=(38.0, -49.5, housing_base_z + 27.0),
    xDir=(1.0, 0.0, 0.0),
    normal=(0.0, -0.80, 0.60),
)

try:
    side_logo = (
        cq.Workplane(logo_plane)
        .text(
            "harmankardon",
            7.0,
            0.55,
            cut=False,
            combine=False,
            halign="center",
            valign="center",
        )
    )
except Exception:
    side_logo = cq.Workplane(logo_plane).rect(48.0, 5.0).extrude(0.55)

# Collect all modeled solids into one result object
solid_workplanes = [
    base_cover,
    cover_plate,
    housing_cover,
    bottom_rim,
    base_upper_lip,
    cover_plate_top_bead,
    housing_base_bead,
    housing_lower_groove_line,
    control_panel_outer_rim,
    control_panel_inner_line,
    control_panel_dots,
    minus_icon,
    x_icon_a,
    x_icon_b,
    power_ring,
    power_stem,
    speaker_body,
    speaker_wave_a,
    speaker_wave_b,
    bluetooth_vertical,
    bluetooth_upper,
    bluetooth_lower,
    side_logo,
]

solid_shapes = []
for workplane in solid_workplanes:
    solid_shapes.extend(workplane.vals())

assembly_compound = cq.Compound.makeCompound(solid_shapes)
result = cq.Workplane("XY").add(assembly_compound)