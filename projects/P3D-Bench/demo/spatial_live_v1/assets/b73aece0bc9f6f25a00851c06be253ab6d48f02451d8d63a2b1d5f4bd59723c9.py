import cadquery as cq

# Dimensions in millimetres. X runs along the display, Z is up,
# and the front viewing surface is at Y = 0.
housing_width = 50.7
housing_height = 19.0
housing_depth = 7.9
front_panel_thickness = 0.1
segment_thickness = 0.01

digit_count = 4
digit_pitch = 12.9
first_digit_center_x = -housing_width / 2.0 + 5.85
digit_center_z = -0.15
digit_height = 13.1
digit_slant = 0.20

outer_segment_length = 6.34
outer_segment_width = 1.44
outer_edge_chamfer = 0.32
inner_edge_chamfer = 0.79
outer_segment_tip_drop = 0.66

middle_segment_length = 6.44
middle_segment_width = 1.48

vertical_segment_width = 1.45
vertical_segment_tip_length = 0.75
vertical_segment_x_offset = 3.45
vertical_segment_z_offset = 3.0
upper_left_segment_length = 5.61
upper_right_segment_length = 5.70
lower_left_segment_length = 5.68
lower_right_segment_length = 5.70

decimal_radius = 0.8
decimal_cap_radius = 0.8026
decimal_offset_x = 4.25
decimal_offset_z = -5.8

pin_count = 12
pins_per_row = pin_count // 2
pin_pitch = 2.54
pin_row_spacing = 15.24
pin_radius = 0.25
pin_shank_length = 2.63
pin_tip_length = 0.37
pin_tip_radius = 0.12


def vertical_segment_profile(center_x, center_z, length):
    """Return an unslanted, six-sided vertical segment outline."""
    half_width = vertical_segment_width / 2.0
    half_length = length / 2.0
    shoulder_height = half_length - vertical_segment_tip_length

    return [
        (center_x, center_z + half_length),
        (center_x + half_width, center_z + shoulder_height),
        (center_x + half_width, center_z - shoulder_height),
        (center_x, center_z - half_length),
        (center_x - half_width, center_z - shoulder_height),
        (center_x - half_width, center_z + shoulder_height),
    ]


# Hexagonal segment outlines, defined before applying the common font slant.
half_outer_length = outer_segment_length / 2.0
digit_top = digit_height / 2.0

top_segment_profile = [
    (-half_outer_length + outer_edge_chamfer, digit_top),
    (half_outer_length - outer_edge_chamfer, digit_top),
    (half_outer_length, digit_top - outer_segment_tip_drop),
    (
        half_outer_length - inner_edge_chamfer,
        digit_top - outer_segment_width,
    ),
    (
        -half_outer_length + inner_edge_chamfer,
        digit_top - outer_segment_width,
    ),
    (-half_outer_length, digit_top - outer_segment_tip_drop),
]

bottom_segment_profile = [
    (x, -z) for x, z in top_segment_profile
]

half_middle_length = middle_segment_length / 2.0
half_middle_width = middle_segment_width / 2.0

middle_segment_profile = [
    (-half_middle_length, 0.0),
    (-half_middle_length + half_middle_width, half_middle_width),
    (half_middle_length - half_middle_width, half_middle_width),
    (half_middle_length, 0.0),
    (half_middle_length - half_middle_width, -half_middle_width),
    (-half_middle_length + half_middle_width, -half_middle_width),
]

segment_profiles = [
    top_segment_profile,
    middle_segment_profile,
    bottom_segment_profile,
    vertical_segment_profile(
        -vertical_segment_x_offset,
        vertical_segment_z_offset,
        upper_left_segment_length,
    ),
    vertical_segment_profile(
        vertical_segment_x_offset,
        vertical_segment_z_offset,
        upper_right_segment_length,
    ),
    vertical_segment_profile(
        -vertical_segment_x_offset,
        -vertical_segment_z_offset,
        lower_left_segment_length,
    ),
    vertical_segment_profile(
        vertical_segment_x_offset,
        -vertical_segment_z_offset,
        lower_right_segment_length,
    ),
]

# Fuse the structural block and its flush, thin front panel.
housing = (
    cq.Workplane("XY")
    .box(
        housing_width,
        housing_depth,
        housing_height,
        centered=(True, False, True),
    )
    .translate((0.0, front_panel_thickness, 0.0))
)

front_panel = cq.Workplane("XY").box(
    housing_width,
    front_panel_thickness,
    housing_height,
    centered=(True, False, True),
)

result = housing.union(front_panel)

# The XZ workplane faces toward -Y, so positive extrusion raises the
# segment plates and decimal discs outward from the viewing surface.
for digit_index in range(digit_count):
    digit_center_x = first_digit_center_x + digit_index * digit_pitch

    for profile in segment_profiles:
        slanted_profile = [
            (x + digit_slant * z, z) for x, z in profile
        ]

        segment = (
            cq.Workplane(
                "XZ",
                origin=(digit_center_x, 0.0, digit_center_z),
            )
            .polyline(slanted_profile)
            .close()
            .extrude(segment_thickness)
        )
        result = result.union(segment, clean=False)

    point_radius = (
        decimal_cap_radius
        if digit_index == digit_count - 1
        else decimal_radius
    )

    decimal_point = (
        cq.Workplane(
            "XZ",
            origin=(
                digit_center_x + decimal_offset_x,
                0.0,
                digit_center_z + decimal_offset_z,
            ),
        )
        .circle(point_radius)
        .extrude(segment_thickness)
    )
    result = result.union(decimal_point, clean=False)

# Two rear rows of six reproduce the six exposed upper pins in the view;
# the lower row is concealed behind the housing.
rear_surface_y = front_panel_thickness + housing_depth
pin_direction = cq.Vector(0.0, 1.0, 0.0)

for pin_row_z in (-pin_row_spacing / 2.0, pin_row_spacing / 2.0):
    for pin_index in range(pins_per_row):
        pin_x = (
            pin_index - (pins_per_row - 1) / 2.0
        ) * pin_pitch

        pin_shank = cq.Solid.makeCylinder(
            pin_radius,
            pin_shank_length,
            cq.Vector(pin_x, rear_surface_y, pin_row_z),
            pin_direction,
        )

        pin_tip = cq.Solid.makeCone(
            pin_radius,
            pin_tip_radius,
            pin_tip_length,
            cq.Vector(
                pin_x,
                rear_surface_y + pin_shank_length,
                pin_row_z,
            ),
            pin_direction,
        )

        result = result.union(pin_shank, clean=False)
        result = result.union(pin_tip, clean=False)

result = result.clean()