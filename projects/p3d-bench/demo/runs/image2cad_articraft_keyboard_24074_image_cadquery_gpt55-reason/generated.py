import cadquery as cq
import math

# -----------------------------------------------------------------------------
# Parameters (all dimensions are in millimetres)
# -----------------------------------------------------------------------------

# Overall slim keyboard base
base_length = 410.0
base_depth = 128.0
base_thickness = 2.4
base_corner_radius = 5.0
base_edge_taper = 0.65

# Slightly inset lower layer visible around the thin edge
underside_length_offset = 8.0
underside_depth_offset = 6.0
underside_height = 0.8
underside_z_offset = -0.55
underside_edge_taper = 0.35

# Rounded rolled front lip, matching the curled leading edge in the image
front_roll_radius = 1.3
front_roll_length = base_length - 14.0
front_roll_center_y = -base_depth / 2.0 + 0.35
front_roll_center_z = 0.15

# Low-profile chiclet key geometry
key_pitch_x = 16.0
key_pitch_y = 16.0
key_clearance = 2.4
key_height = 1.7
key_bevel_inset = 0.7
key_corner_radius = 1.35
key_bottom_z = base_thickness

# Keyboard section placement
main_start_x = -190.0
section_gap = 14.0
main_block_units = 15.0

nav_start_x = main_start_x + main_block_units * key_pitch_x + section_gap
numpad_start_x = nav_start_x + 3.0 * key_pitch_x + section_gap

# Row positions, front to back
row_bottom_y = -45.0
row_z_y = -29.0
row_a_y = -13.0
row_q_y = 3.0
row_number_y = 19.0
row_function_y = 43.0

# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------

def add_rounded_rectangle_profile(workplane, width, depth, radius):
    """Add a rounded rectangle wire to an existing workplane.

    This replaces Workplane.roundedRect so the model works on CadQuery versions
    where that convenience method is not available.
    """
    half_width = width / 2.0
    half_depth = depth / 2.0
    radius = min(max(radius, 0.0), half_width - 0.05, half_depth - 0.05)

    if radius <= 0.05:
        return workplane.rect(width, depth)

    arc_mid = math.sqrt(0.5)
    left = -half_width
    right = half_width
    bottom = -half_depth
    top = half_depth
    r = radius

    return (
        workplane
        .moveTo(right - r, top)
        .lineTo(left + r, top)
        .threePointArc(
            (left + r - r * arc_mid, top - r + r * arc_mid),
            (left, top - r),
        )
        .lineTo(left, bottom + r)
        .threePointArc(
            (left + r - r * arc_mid, bottom + r - r * arc_mid),
            (left + r, bottom),
        )
        .lineTo(right - r, bottom)
        .threePointArc(
            (right - r + r * arc_mid, bottom + r - r * arc_mid),
            (right, bottom + r),
        )
        .lineTo(right, top - r)
        .threePointArc(
            (right - r + r * arc_mid, top - r + r * arc_mid),
            (right - r, top),
        )
        .close()
    )


def make_rounded_rect_loft(
    bottom_width,
    bottom_depth,
    top_width,
    top_depth,
    height,
    bottom_radius,
    top_radius,
):
    """Create a shallow lofted rounded rectangle used for tapered plates/keys."""
    profile = cq.Workplane("XY")
    profile = add_rounded_rectangle_profile(
        profile,
        bottom_width,
        bottom_depth,
        bottom_radius,
    )
    profile = profile.workplane(offset=height)
    profile = add_rounded_rectangle_profile(
        profile,
        top_width,
        top_depth,
        top_radius,
    )

    return profile.loft(ruled=True, combine=False).val()


# Cache keycap templates by unit size so repeated keys are lightweight to place.
keycap_templates = {}


def make_keycap(center_x, center_y, width_units=1.0, depth_units=1.0):
    """Create a low-profile chamfered chiclet-style keycap."""
    template_key = (float(width_units), float(depth_units))

    if template_key not in keycap_templates:
        bottom_width = key_pitch_x * width_units - key_clearance
        bottom_depth = key_pitch_y * depth_units - key_clearance

        top_width = bottom_width - 2.0 * key_bevel_inset
        top_depth = bottom_depth - 2.0 * key_bevel_inset

        bottom_radius = min(
            key_corner_radius,
            bottom_width / 2.0 - 0.1,
            bottom_depth / 2.0 - 0.1,
        )
        top_radius = max(
            0.2,
            min(
                key_corner_radius - key_bevel_inset,
                top_width / 2.0 - 0.1,
                top_depth / 2.0 - 0.1,
            ),
        )

        keycap_templates[template_key] = make_rounded_rect_loft(
            bottom_width,
            bottom_depth,
            top_width,
            top_depth,
            key_height,
            bottom_radius,
            top_radius,
        )

    return keycap_templates[template_key].translate((center_x, center_y, key_bottom_z))


def add_grid_key(key_list, section_start_x, column_units, center_y, width_units=1.0, depth_units=1.0):
    """Add a key whose left edge is located on a unit-spaced keyboard grid."""
    center_x = section_start_x + (column_units + width_units / 2.0) * key_pitch_x
    key_list.append(make_keycap(center_x, center_y, width_units, depth_units))


def add_key_sequence(key_list, section_start_x, center_y, width_sequence):
    """Add a row of keys using standard keyboard unit widths."""
    cursor_units = 0.0

    for width_units in width_sequence:
        add_grid_key(
            key_list,
            section_start_x,
            cursor_units,
            center_y,
            width_units=width_units,
        )
        cursor_units += width_units


# -----------------------------------------------------------------------------
# Base plate
# -----------------------------------------------------------------------------

# Main very thin rounded keyboard body with a slight tapered edge
base_solid = make_rounded_rect_loft(
    base_length - 2.0 * base_edge_taper,
    base_depth - 2.0 * base_edge_taper,
    base_length,
    base_depth,
    base_thickness,
    base_corner_radius - base_edge_taper,
    base_corner_radius,
)

# Inset underside layer, visible as the thin lower step around the perimeter
underside_solid = make_rounded_rect_loft(
    base_length - underside_length_offset - 2.0 * underside_edge_taper,
    base_depth - underside_depth_offset - 2.0 * underside_edge_taper,
    base_length - underside_length_offset,
    base_depth - underside_depth_offset,
    underside_height,
    base_corner_radius - 1.3,
    base_corner_radius - 1.0,
).translate((0.0, 0.0, underside_z_offset))

# Cylindrical rolled front edge/lip along the leading side
front_roll_solid = cq.Solid.makeCylinder(
    front_roll_radius,
    front_roll_length,
    cq.Vector(-front_roll_length / 2.0, front_roll_center_y, front_roll_center_z),
    cq.Vector(1.0, 0.0, 0.0),
)

# -----------------------------------------------------------------------------
# Key layout
# -----------------------------------------------------------------------------

key_solids = []

# Main alphanumeric block, interpreted as a full-size low-profile keyboard layout
add_key_sequence(key_solids, main_start_x, row_function_y, [1.0] * 15)
add_key_sequence(key_solids, main_start_x, row_number_y, [1.0] * 13 + [2.0])
add_key_sequence(key_solids, main_start_x, row_q_y, [1.5] + [1.0] * 12 + [1.5])
add_key_sequence(key_solids, main_start_x, row_a_y, [1.75] + [1.0] * 11 + [2.25])
add_key_sequence(key_solids, main_start_x, row_z_y, [2.25] + [1.0] * 10 + [2.75])
add_key_sequence(
    key_solids,
    main_start_x,
    row_bottom_y,
    [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
)

# Navigation cluster: top keys, insert/home/page block, and inverted-T arrows
for col in range(3):
    add_grid_key(key_solids, nav_start_x, col, row_function_y)

for col in range(3):
    add_grid_key(key_solids, nav_start_x, col, row_number_y)
    add_grid_key(key_solids, nav_start_x, col, row_q_y)

add_grid_key(key_solids, nav_start_x, 1, row_z_y)
add_grid_key(key_solids, nav_start_x, 0, row_bottom_y)
add_grid_key(key_solids, nav_start_x, 1, row_bottom_y)
add_grid_key(key_solids, nav_start_x, 2, row_bottom_y)

# Numeric keypad with a top row, operator keys, wide zero, and tall plus/enter keys
for col in range(4):
    add_grid_key(key_solids, numpad_start_x, col, row_function_y)

for col in range(4):
    add_grid_key(key_solids, numpad_start_x, col, row_number_y)

for col in range(3):
    add_grid_key(key_solids, numpad_start_x, col, row_q_y)

add_grid_key(
    key_solids,
    numpad_start_x,
    3,
    (row_q_y + row_a_y) / 2.0,
    depth_units=2.0,
)

for col in range(3):
    add_grid_key(key_solids, numpad_start_x, col, row_a_y)

for col in range(3):
    add_grid_key(key_solids, numpad_start_x, col, row_z_y)

add_grid_key(
    key_solids,
    numpad_start_x,
    3,
    (row_z_y + row_bottom_y) / 2.0,
    depth_units=2.0,
)

add_grid_key(key_solids, numpad_start_x, 0, row_bottom_y, width_units=2.0)
add_grid_key(key_solids, numpad_start_x, 2, row_bottom_y)

# -----------------------------------------------------------------------------
# Final model
# -----------------------------------------------------------------------------

result = cq.Compound.makeCompound(
    [underside_solid, front_roll_solid, base_solid] + key_solids
)