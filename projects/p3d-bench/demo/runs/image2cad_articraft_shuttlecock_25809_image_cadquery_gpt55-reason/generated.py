import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------

# Overall proportions estimated from the reference image.
# The drum/basket axis is the X axis; the Y/Z plane is the circular section.
body_length = 112.0
body_radius = 40.0
wall_thickness = 1.6

# The visible shell is interpreted as a faceted cylindrical perforated basket.
panel_count = 10
panel_width_fill = 0.92

# Raised ribs and flanges
rib_overlap = 0.15
seam_rib_width = 2.3
seam_rib_height = 2.7
diagonal_rib_width = 2.2
diagonal_rib_height = 1.7
front_rim_axial_width = 3.6
front_rim_height = 2.1
rear_body_band_width = 4.0
rear_body_band_height = 2.0
front_tab_axial_length = 4.2
front_tab_height = 3.0

# Perforation sizes
round_hole_radius = 2.45
small_round_hole_radius = 1.55
louver_slot_length = 8.0
louver_slot_diameter = 1.35
short_slot_length = 6.4
short_slot_diameter = 1.15
slash_slot_length = 7.5
slash_slot_diameter = 1.05

# Smooth rear cap / collar
rear_cap_overlap = 1.2
rear_collar_length = 11.0
rear_dome_length = 25.0
cap_radius_extra = 1.0
rear_ring_height = 1.6
rear_ring_axial_width = 2.2
rear_ring_overlap = 0.25

# Derived values
panel_angle_degrees = 360.0 / panel_count
panel_width = 2.0 * body_radius * math.tan(math.pi / panel_count) * panel_width_fill
front_x = -body_length / 2.0
rear_x = body_length / 2.0
outer_body_radius = body_radius + wall_thickness / 2.0
cap_radius = outer_body_radius + cap_radius_extra
top_of_shell_z = wall_thickness / 2.0
cutter_depth = wall_thickness + 5.0


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def make_centered_slot_cutter(points, slot_length, slot_diameter, angle_degrees):
    """Create a centered-through cutter made from multiple 2D slots."""
    return (
        cq.Workplane("XY")
        .pushPoints(points)
        .slot2D(slot_length, slot_diameter, angle=angle_degrees)
        .extrude(cutter_depth)
        .translate((0.0, 0.0, -cutter_depth / 2.0))
    )


def make_centered_circle_cutter(points, radius):
    """Create a centered-through cutter made from multiple circular holes."""
    return (
        cq.Workplane("XY")
        .pushPoints(points)
        .circle(radius)
        .extrude(cutter_depth)
        .translate((0.0, 0.0, -cutter_depth / 2.0))
    )


def cut_slot_pattern(solid, points, slot_length, slot_diameter, angle_degrees):
    """Subtract a repeated rounded-slot pattern from a flat panel."""
    if not points:
        return solid
    return solid.cut(make_centered_slot_cutter(points, slot_length, slot_diameter, angle_degrees))


def cut_circle_pattern(solid, points, radius):
    """Subtract a repeated circular-hole pattern from a flat panel."""
    if not points:
        return solid
    return solid.cut(make_centered_circle_cutter(points, radius))


def make_flat_raised_box(x_center, y_center, x_size, y_size, height, z_base):
    """Create a small raised rectangular feature on the outside of a flat panel."""
    return (
        cq.Workplane("XY")
        .box(x_size, y_size, height)
        .translate((x_center, y_center, z_base + height / 2.0))
    )


def make_flat_bar_between(x1, y1, x2, y2, width, height, z_base):
    """Create a raised flat bar between two local XY points."""
    dx = x2 - x1
    dy = y2 - y1
    length = math.hypot(dx, dy)

    nx = -dy / length * width / 2.0
    ny = dx / length * width / 2.0

    points = [
        (x1 + nx, y1 + ny),
        (x2 + nx, y2 + ny),
        (x2 - nx, y2 - ny),
        (x1 - nx, y1 - ny),
    ]

    profile = cq.Workplane("XY").moveTo(points[0][0], points[0][1])
    for point in points[1:]:
        profile = profile.lineTo(point[0], point[1])

    return profile.close().extrude(height).translate((0.0, 0.0, z_base))


def place_flat_part_on_cylinder(flat_part, theta_degrees, radial_distance):
    """
    Place a flat part tangent to the cylindrical basket.

    Local axes:
      X = basket axis
      Y = circumferential/tangential direction
      Z = outward radial direction
    """
    theta_radians = math.radians(theta_degrees)
    rotation_angle = theta_degrees - 90.0

    return (
        flat_part
        .rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), rotation_angle)
        .translate(
            (
                0.0,
                radial_distance * math.cos(theta_radians),
                radial_distance * math.sin(theta_radians),
            )
        )
    )


def make_revolved_profile(points):
    """Revolve an X/radius profile around the X axis."""
    profile = cq.Workplane("XY").moveTo(points[0][0], points[0][1])
    for point in points[1:]:
        profile = profile.lineTo(point[0], point[1])

    return profile.close().revolve(
        360.0,
        axisStart=(0.0, 0.0, 0.0),
        axisEnd=(1.0, 0.0, 0.0),
    )


def make_revolved_rectangular_ring(x_center, radius_center, axial_width, radial_height):
    """Create a thin circular raised band around the X axis."""
    x0 = x_center - axial_width / 2.0
    x1 = x_center + axial_width / 2.0
    inner_radius = radius_center - radial_height / 2.0
    outer_radius = radius_center + radial_height / 2.0

    return make_revolved_profile(
        [
            (x0, inner_radius),
            (x1, inner_radius),
            (x1, outer_radius),
            (x0, outer_radius),
        ]
    )


def make_rear_cap():
    """Create the smooth rounded rear cap and short cylindrical collar."""
    cap_start_x = rear_x - rear_cap_overlap
    collar_end_x = cap_start_x + rear_collar_length

    profile_points = [
        (cap_start_x, 0.0),
        (cap_start_x, cap_radius),
        (collar_end_x, cap_radius),
    ]

    # Quarter-ellipse dome profile, similar to the rounded end in the image.
    dome_segments = 14
    for i in range(1, dome_segments + 1):
        phi = (math.pi / 2.0) * i / dome_segments
        x = collar_end_x + rear_dome_length * math.sin(phi)
        r = cap_radius * math.cos(phi)
        profile_points.append((x, r))

    return make_revolved_profile(profile_points)


def make_flat_perforated_panel(pattern_index):
    """Create one flat perforated facet before wrapping it around the cylinder."""
    sheet = cq.Workplane("XY").box(body_length, panel_width, wall_thickness)

    x_shift = (pattern_index - 1.5) * 1.2
    diagonal_sign = 1.0 if pattern_index % 2 == 0 else -1.0
    round_row_y = diagonal_sign * panel_width * 0.28

    # Front group of long narrow louver slots.
    front_louver_points = []
    for x in [-47.0, -38.5, -30.0]:
        for y in [-0.34 * panel_width, -0.11 * panel_width, 0.11 * panel_width, 0.34 * panel_width]:
            front_louver_points.append((x + x_shift, y))

    # Rear group of transverse/short louver slots.
    rear_louver_points = []
    for x in [18.0, 26.5, 35.0, 43.5]:
        for y in [-0.31 * panel_width, 0.0, 0.31 * panel_width]:
            rear_louver_points.append((x + x_shift, y))

    # Row of larger circular holes.
    round_hole_points = [
        (x + x_shift, round_row_y)
        for x in [-34.0, -24.0, -14.0, -4.0, 6.0, 16.0, 26.0, 36.0]
    ]

    # Secondary row of smaller circular holes.
    small_round_hole_points = [
        (x + x_shift, -round_row_y)
        for x in [2.0, 12.0, 22.0, 32.0, 42.0]
    ]

    # Scattered diagonal slash perforations across the central field.
    slash_points = []
    for row_index, y in enumerate([-0.34 * panel_width, 0.0, 0.34 * panel_width]):
        for column_index, x in enumerate([-41.0, -29.0, -17.0, -5.0, 7.0, 19.0, 31.0, 43.0]):
            if (row_index + column_index + pattern_index) % 2 == 0:
                slash_points.append((x + x_shift, y))

    sheet = cut_slot_pattern(sheet, front_louver_points, louver_slot_length, louver_slot_diameter, 0.0)
    sheet = cut_slot_pattern(sheet, rear_louver_points, short_slot_length, short_slot_diameter, 90.0)
    sheet = cut_circle_pattern(sheet, round_hole_points, round_hole_radius)
    sheet = cut_circle_pattern(sheet, small_round_hole_points, small_round_hole_radius)
    sheet = cut_slot_pattern(sheet, slash_points, slash_slot_length, slash_slot_diameter, diagonal_sign * 35.0)

    # Raised panel details: end flanges plus diagonal stiffening rib.
    z_base = top_of_shell_z - rib_overlap
    panel_shapes = [sheet.val()]

    panel_shapes.append(
        make_flat_raised_box(
            front_x + front_rim_axial_width / 2.0,
            0.0,
            front_rim_axial_width,
            panel_width * 0.82,
            front_rim_height,
            z_base,
        ).val()
    )

    panel_shapes.append(
        make_flat_raised_box(
            rear_x - rear_body_band_width / 2.0,
            0.0,
            rear_body_band_width,
            panel_width * 0.86,
            rear_body_band_height,
            z_base,
        ).val()
    )

    panel_shapes.append(
        make_flat_bar_between(
            front_x + 10.0,
            -diagonal_sign * panel_width * 0.43,
            rear_x - 14.0,
            diagonal_sign * panel_width * 0.43,
            diagonal_rib_width,
            diagonal_rib_height,
            z_base,
        ).val()
    )

    # Small secondary brace near the front, giving the shell a folded/stamped look.
    panel_shapes.append(
        make_flat_bar_between(
            front_x + 18.0,
            diagonal_sign * panel_width * 0.10,
            front_x + 42.0,
            -diagonal_sign * panel_width * 0.42,
            diagonal_rib_width * 0.72,
            diagonal_rib_height * 0.85,
            z_base,
        ).val()
    )

    return cq.Workplane("XY").add(cq.Compound.makeCompound(panel_shapes))


# ---------------------------------------------------------------------------
# Build the model
# ---------------------------------------------------------------------------

component_shapes = []

# Cache a few varied panel patterns and repeat them around the circumference.
flat_panel_patterns = [make_flat_perforated_panel(i) for i in range(4)]

for panel_index in range(panel_count):
    theta = panel_index * panel_angle_degrees
    flat_panel = flat_panel_patterns[panel_index % len(flat_panel_patterns)]
    placed_panel = place_flat_part_on_cylinder(flat_panel, theta, body_radius)
    component_shapes.append(placed_panel.val())

# Long raised ribs on the seams between neighboring facets.
flat_seam_rib = make_flat_raised_box(
    0.0,
    0.0,
    body_length + 1.5,
    seam_rib_width,
    seam_rib_height,
    top_of_shell_z - rib_overlap,
)

for seam_index in range(panel_count):
    theta = (seam_index + 0.5) * panel_angle_degrees
    placed_rib = place_flat_part_on_cylinder(flat_seam_rib, theta, body_radius)
    component_shapes.append(placed_rib.val())

# Small front tabs/notches at each seam, matching the segmented scalloped rim.
flat_front_tab = make_flat_raised_box(
    front_x - 0.4,
    0.0,
    front_tab_axial_length,
    seam_rib_width * 1.25,
    front_tab_height,
    top_of_shell_z - rib_overlap,
)

for seam_index in range(panel_count):
    theta = (seam_index + 0.5) * panel_angle_degrees
    placed_tab = place_flat_part_on_cylinder(flat_front_tab, theta, body_radius)
    component_shapes.append(placed_tab.val())

# Smooth rear cap with two narrow raised circular bands.
rear_cap = make_rear_cap()
component_shapes.append(rear_cap.val())

rear_cap_start_x = rear_x - rear_cap_overlap
rear_collar_end_x = rear_cap_start_x + rear_collar_length
rear_ring_radius_center = cap_radius + rear_ring_height / 2.0 - rear_ring_overlap

rear_ring_1 = make_revolved_rectangular_ring(
    rear_cap_start_x + 2.2,
    rear_ring_radius_center,
    rear_ring_axial_width,
    rear_ring_height,
)
rear_ring_2 = make_revolved_rectangular_ring(
    rear_collar_end_x - 2.0,
    rear_ring_radius_center,
    rear_ring_axial_width,
    rear_ring_height,
)

component_shapes.append(rear_ring_1.val())
component_shapes.append(rear_ring_2.val())

# Final compound result
result = cq.Workplane("XY").add(cq.Compound.makeCompound(component_shapes))