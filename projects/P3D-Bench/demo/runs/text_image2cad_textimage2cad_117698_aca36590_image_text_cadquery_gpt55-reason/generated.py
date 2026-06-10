import math
import cadquery as cq

# Parameters
# Coordinate system: X = beam, Y = vertical, Z = fore-to-aft ship length.
hull_length = 100.0
hull_max_beam = 20.0
hull_depth = 5.5

feature_overlap = 0.05

turret_radius = 5.0
turret_height = 3.0
turret_positions = [
    (-36.0, -1),  # forward turret, barrels toward bow
    (-16.0, -1),  # forward superstructure turret, barrels toward bow
    (32.0, 1),    # aft turret, barrels toward stern
]

barrel_radius = 0.5
barrel_length = 10.0
barrel_embed_depth = 1.0
barrel_lateral_offsets = [-2.0, 0.0, 2.0]
barrel_center_y = turret_height + 0.2

chimney_radius = 2.5
chimney_height = 10.0
chimney_base_y = 5.7
chimney_center_z = 4.5

spacer_width = 6.2
spacer_height = 2.1
spacer_length = 9.7
spacer_end_tilt_degrees = 10.0


# Helper functions
def make_hull_section_wire(z_position, half_beam, depth):
    """Create one closed transverse hull section with a flat deck and spline lower contour."""
    left_deck = cq.Vector(-half_beam, 0.0, z_position)
    right_deck = cq.Vector(half_beam, 0.0, z_position)

    deck_edge = cq.Edge.makeLine(left_deck, right_deck)

    lower_curve_points = [
        right_deck,
        cq.Vector(0.98 * half_beam, -0.12 * depth, z_position),
        cq.Vector(0.78 * half_beam, -0.50 * depth, z_position),
        cq.Vector(0.36 * half_beam, -0.93 * depth, z_position),
        cq.Vector(0.0, -depth, z_position),
        cq.Vector(-0.36 * half_beam, -0.93 * depth, z_position),
        cq.Vector(-0.78 * half_beam, -0.50 * depth, z_position),
        cq.Vector(-0.98 * half_beam, -0.12 * depth, z_position),
        left_deck,
    ]
    lower_edge = cq.Edge.makeSpline(lower_curve_points)

    return cq.Wire.assembleEdges([deck_edge, lower_edge])


def make_cylinder(radius, height, start_point, axis_direction):
    """Create a cylinder along an explicit 3D axis."""
    cylinder_solid = cq.Solid.makeCylinder(
        radius,
        height,
        cq.Vector(*start_point),
        cq.Vector(*axis_direction),
    )
    return cq.Workplane("XY").add(cylinder_solid)


def make_vertical_cylinder(radius, visible_height, center_x, base_y, center_z):
    """Create an upward Y-axis cylinder with a slight overlap into its mounting face."""
    return make_cylinder(
        radius,
        visible_height + feature_overlap,
        (center_x, base_y - feature_overlap, center_z),
        (0.0, 1.0, 0.0),
    )


def make_longitudinal_cylinder(radius, length, center_x, center_y, start_z, direction):
    """Create a fore-aft gun barrel cylinder."""
    axis_sign = 1.0 if direction >= 0 else -1.0
    return make_cylinder(
        radius,
        length,
        (center_x, center_y, start_z),
        (0.0, 0.0, axis_sign),
    )


def make_deck_box(
    beam_width,
    visible_height,
    longitudinal_length,
    center_x,
    base_y,
    center_z,
    vertical_chamfer=0.0,
):
    """Create a rectangular superstructure block seated on a deck or lower tier."""
    actual_height = visible_height + feature_overlap
    center_y = base_y + visible_height / 2.0 - feature_overlap / 2.0

    block = (
        cq.Workplane("XY")
        .box(beam_width, actual_height, longitudinal_length)
        .translate((center_x, center_y, center_z))
    )

    if vertical_chamfer > 0.0:
        block = block.edges("|Y").chamfer(vertical_chamfer)

    return block


def make_partial_cylindrical_spacer(
    center_x,
    base_y,
    center_z,
    beam_width,
    visible_height,
    longitudinal_length,
    end_tilt_degrees,
):
    """Create a small rounded spacer/cowl with a flat underside and oblique end caps."""
    half_width = beam_width / 2.0
    actual_height = visible_height + feature_overlap
    bottom_y = base_y - feature_overlap
    half_length = longitudinal_length / 2.0
    tilt_tangent = math.tan(math.radians(end_tilt_degrees))

    def profile_wire(z_base, tilt_sign):
        def point(x_offset, y_offset):
            return cq.Vector(
                center_x + x_offset,
                bottom_y + y_offset,
                z_base + tilt_sign * y_offset * tilt_tangent,
            )

        left_bottom = point(-half_width, 0.0)
        right_bottom = point(half_width, 0.0)

        flat_edge = cq.Edge.makeLine(left_bottom, right_bottom)
        curved_edge = cq.Edge.makeSpline(
            [
                right_bottom,
                point(0.78 * half_width, 0.45 * actual_height),
                point(0.35 * half_width, 0.86 * actual_height),
                point(0.0, actual_height),
                point(-0.35 * half_width, 0.86 * actual_height),
                point(-0.78 * half_width, 0.45 * actual_height),
                left_bottom,
            ]
        )

        return cq.Wire.assembleEdges([flat_edge, curved_edge])

    front_wire = profile_wire(center_z - half_length, 1.0)
    rear_wire = profile_wire(center_z + half_length, -1.0)
    spacer_solid = cq.Solid.makeLoft([front_wire, rear_wire], ruled=False)

    return cq.Workplane("XY").add(spacer_solid)


# Create the smoothly tapered hull from lofted spline sections
hull_half_beam = hull_max_beam / 2.0
hull_station_specs = [
    (-0.50, 0.03, 0.08),
    (-0.46, 0.38, 0.34),
    (-0.36, 0.78, 0.68),
    (-0.18, 0.98, 0.94),
    (0.00, 1.00, 1.00),
    (0.18, 0.98, 0.94),
    (0.36, 0.78, 0.68),
    (0.46, 0.38, 0.34),
    (0.50, 0.03, 0.08),
]

hull_section_wires = [
    make_hull_section_wire(
        z_ratio * hull_length,
        beam_ratio * hull_half_beam,
        depth_ratio * hull_depth,
    )
    for z_ratio, beam_ratio, depth_ratio in hull_station_specs
]

hull_solid = cq.Solid.makeLoft(hull_section_wires, ruled=False)
result = cq.Workplane("XY").add(hull_solid)


# Add cylindrical turret bosses and triple-barrel pin clusters
for turret_z, barrel_direction in turret_positions:
    result = result.union(
        make_vertical_cylinder(
            turret_radius,
            turret_height,
            0.0,
            0.0,
            turret_z,
        )
    )

    barrel_start_z = turret_z + barrel_direction * (turret_radius - barrel_embed_depth)

    for lateral_offset in barrel_lateral_offsets:
        result = result.union(
            make_longitudinal_cylinder(
                barrel_radius,
                barrel_length,
                lateral_offset,
                barrel_center_y,
                barrel_start_z,
                barrel_direction,
            )
        )


# Add the stepped rectangular central superstructure
superstructure_blocks = [
    # beam width, height, length, center X, base Y, center Z, chamfer
    (12.5, 2.4, 30.0, 0.0, 0.0, 6.5, 0.45),
    (9.0, 2.0, 20.0, 0.0, 2.4, 5.0, 0.35),
    (7.2, 5.6, 8.0, 0.0, 2.4, -5.5, 0.30),
    (4.6, 1.6, 4.0, 0.0, 8.0, -6.8, 0.20),
    (8.2, 1.3, 8.5, 0.0, 4.4, 4.5, 0.25),
    (10.0, 2.0, 9.0, 0.0, 2.4, 16.5, 0.30),
    (1.2, 1.0, 24.0, 5.25, 2.4, 7.0, 0.10),
    (1.2, 1.0, 24.0, -5.25, 2.4, 7.0, 0.10),
]

for block_parameters in superstructure_blocks:
    result = result.union(make_deck_box(*block_parameters))


# Add the chimney-like cylinder on the superstructure
result = result.union(
    make_vertical_cylinder(
        chimney_radius,
        chimney_height,
        0.0,
        chimney_base_y,
        chimney_center_z,
    )
)


# Add the small partial-cylindrical spacer/cowl near the aft superstructure
result = result.union(
    make_partial_cylindrical_spacer(
        0.0,
        4.4,
        16.5,
        spacer_width,
        spacer_height,
        spacer_length,
        spacer_end_tilt_degrees,
    )
)

result = result.clean()