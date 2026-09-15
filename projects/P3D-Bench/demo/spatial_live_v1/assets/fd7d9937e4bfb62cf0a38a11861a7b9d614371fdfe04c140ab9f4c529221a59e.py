import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters -- millimetres
# The reference is interpreted as a sixteen-storey residential tower:
# an angled balcony wing, a narrow window bay, a taller rectangular rear wing,
# a triangular rooftop enclosure, and a low side annex.
# ---------------------------------------------------------------------------
storey_count = 16
storey_height = 3300.0
podium_height = 5000.0
rear_wing_base_step = 2400.0

triangle_width = 12000.0
rear_wing_width = 14500.0
rear_wing_depth = 6500.0

front_extension = 8800.0
front_left_extension = 2400.0
front_rear_notch = 3000.0
front_window_bay_width = 4100.0
transition_width = 1050.0
balcony_depth = 2300.0

balcony_slab_thickness = 230.0
balcony_guard_height = 1100.0
balcony_curb_height = 160.0
balcony_return_height = 900.0
balcony_return_thickness = 160.0
railing_post_width = 75.0
railing_bar_height = 45.0
railing_bar_depth = 65.0
handrail_height = 80.0
handrail_depth = 110.0

window_recess = 300.0
window_frame_width = 110.0
window_frame_depth = 140.0
window_mullion_width = 95.0
glazing_thickness = 45.0
front_window_width = 3300.0
front_window_height = 2200.0
window_sill_height = 650.0
rear_window_height = 2200.0
balcony_door_height = 2500.0
balcony_door_sill = 380.0

floor_band_height = 160.0
floor_band_projection = 120.0
vertical_pier_width = 160.0

roof_slab_thickness = 350.0
roof_overhang = 180.0
crown_wall_height = 2600.0
crown_parapet_height = 300.0
crown_parapet_thickness = 320.0
crown_coping_width = 420.0
crown_coping_height = 90.0

rear_roof_slab_thickness = 300.0
rear_parapet_height = 1800.0
rear_parapet_thickness = 300.0
rear_coping_width = 400.0
rear_coping_height = 120.0

podium_front_overhang = 450.0
podium_left_overhang = 350.0
podium_right_overhang = 1400.0
podium_rear_overhang = 900.0
podium_joint_width = 90.0
podium_joint_depth = 65.0

annex_start = 800.0
annex_length = 11000.0
annex_depth = 8500.0
annex_height = 4500.0
annex_roof_thickness = 220.0
annex_parapet_height = 1150.0
annex_parapet_thickness = 260.0
annex_hatch_length = 3200.0
annex_hatch_width = 2400.0
annex_hatch_height = 160.0

fin_count = 4
fin_width = 400.0
fin_thickness = 160.0
fin_first_position = 3800.0
fin_last_position = 8250.0

# ---------------------------------------------------------------------------
# Derived geometry and coordinate systems
# The principal facade follows one edge of an equilateral triangular core.
# This produces the unusually shallow front angle visible in the reference.
# ---------------------------------------------------------------------------
triangle_depth = triangle_width * math.sqrt(3.0) / 2.0
triangle_points = [
    (0.0, 0.0),
    (triangle_width, 0.0),
    (triangle_width / 2.0, -triangle_depth),
]

front_origin = (triangle_width / 2.0, -triangle_depth)
front_tangent = (0.5, math.sqrt(3.0) / 2.0)
front_normal = (math.sqrt(3.0) / 2.0, -0.5)

annex_tangent = (-0.5, math.sqrt(3.0) / 2.0)
annex_normal = (-math.sqrt(3.0) / 2.0, -0.5)

front_u_min = -front_left_extension
front_u_max = triangle_width
front_window_start = front_u_max - front_window_bay_width
balcony_u_end = front_window_start - transition_width
balcony_width = balcony_u_end - front_u_min
balcony_back = front_extension - balcony_depth

tower_height = storey_count * storey_height
front_roof_z = podium_height + tower_height
rear_base_z = podium_height + rear_wing_base_step
rear_roof_z = rear_base_z + tower_height

podium_u_min = front_u_min - podium_left_overhang
podium_u_max = front_u_max + podium_right_overhang
podium_front = front_extension + podium_front_overhang

# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------
def polygon_prism(points, z, height):
    """Extrude a closed XY polygon into a solid."""
    return (
        cq.Workplane("XY", origin=(0.0, 0.0, z))
        .polyline(points)
        .close()
        .extrude(height)
        .val()
    )


def rectangular_solid(x, y, z, width, depth, height):
    return cq.Solid.makeBox(
        width, depth, height, cq.Vector(x, y, z)
    )


def mapped_point(origin, tangent, normal, u, v):
    return (
        origin[0] + tangent[0] * u + normal[0] * v,
        origin[1] + tangent[1] * u + normal[1] * v,
    )


def front_point(u, v):
    return mapped_point(front_origin, front_tangent, front_normal, u, v)


def oriented_prism(origin, tangent, normal, u, v, z, width, depth, height):
    """Rectangular prism using an along-wall and outward-wall coordinate."""
    points = [
        mapped_point(origin, tangent, normal, u, v),
        mapped_point(origin, tangent, normal, u + width, v),
        mapped_point(origin, tangent, normal, u + width, v + depth),
        mapped_point(origin, tangent, normal, u, v + depth),
    ]
    return polygon_prism(points, z, height)


def front_box(u, v, z, width, depth, height):
    return oriented_prism(
        front_origin, front_tangent, front_normal,
        u, v, z, width, depth, height
    )


def annex_box(u, v, z, width, depth, height):
    return oriented_prism(
        front_origin, annex_tangent, annex_normal,
        u, v, z, width, depth, height
    )


def rear_side_box(u, v, z, width, depth, height):
    """Rear wing's visible side: u follows Y; positive v points outward."""
    return rectangular_solid(
        rear_wing_width + v, u, z, depth, width, height
    )


def rear_return_box(u, v, z, width, depth, height):
    """Short exposed return on the rear wing's Y=0 wall."""
    return rectangular_solid(u, -v - depth, z, width, depth, height)


def balcony_side_box(u, v, z, width, depth, height):
    """Narrow left return of the projecting front wing."""
    return front_box(
        front_u_min - v - depth,
        front_rear_notch + u,
        z,
        depth,
        width,
        height,
    )


def window_group(box_function, left, face, bottom, width, height,
                 columns=1, rows=1):
    """Return a recess cutter and separate glazing/frame solids."""
    cutter = box_function(
        left, face - window_recess, bottom,
        width, window_recess + 20.0, height
    )

    details = [
        box_function(
            left, face - window_recess + 20.0, bottom,
            width, glazing_thickness, height
        )
    ]

    frame_v = face - 50.0
    frame = window_frame_width

    # Four perimeter frame members, projecting slightly beyond the wall.
    details.extend([
        box_function(
            left - frame, frame_v, bottom - frame,
            frame, window_frame_depth, height + 2.0 * frame
        ),
        box_function(
            left + width, frame_v, bottom - frame,
            frame, window_frame_depth, height + 2.0 * frame
        ),
        box_function(
            left, frame_v, bottom - frame,
            width, window_frame_depth, frame
        ),
        box_function(
            left, frame_v, bottom + height,
            width, window_frame_depth, frame
        ),
    ])

    # Mullions are real solids rather than surface markings.
    for column in range(1, columns):
        mullion_u = left + width * column / columns
        details.append(
            box_function(
                mullion_u - window_mullion_width / 2.0,
                frame_v, bottom,
                window_mullion_width, window_frame_depth, height
            )
        )

    for row in range(1, rows):
        mullion_z = bottom + height * row / rows
        details.append(
            box_function(
                left, frame_v,
                mullion_z - window_mullion_width / 2.0,
                width, window_frame_depth, window_mullion_width
            )
        )

    details.append(
        box_function(
            left - frame - 35.0, face - 40.0,
            bottom - frame - 65.0,
            width + 2.0 * frame + 70.0, 230.0, 90.0
        )
    )
    return cutter, details


def inset_triangle(distance):
    """Parallel inset of the equilateral crown footprint."""
    centroid = (triangle_width / 2.0, -triangle_depth / 3.0)
    inradius = triangle_depth / 3.0
    scale = 1.0 - distance / inradius
    return [
        (
            centroid[0] + (x - centroid[0]) * scale,
            centroid[1] + (y - centroid[1]) * scale,
        )
        for x, y in triangle_points
    ]


def triangle_ring(z, height, thickness):
    outer = polygon_prism(triangle_points, z, height)
    inner = polygon_prism(inset_triangle(thickness), z - 1.0, height + 2.0)
    return outer.cut(inner)


def rear_roof_ring(z, height, thickness):
    outer = rectangular_solid(
        0.0, 0.0, z, rear_wing_width, rear_wing_depth, height
    )
    inner = rectangular_solid(
        thickness, thickness, z - 1.0,
        rear_wing_width - 2.0 * thickness,
        rear_wing_depth - 2.0 * thickness,
        height + 2.0,
    )
    return outer.cut(inner)


components = []

# ---------------------------------------------------------------------------
# Podium and the lower, perpendicular side annex
# ---------------------------------------------------------------------------
podium_front_outline = [
    front_point(podium_u_min, front_rear_notch - 300.0),
    front_point(0.0, front_rear_notch - 300.0),
    front_point(0.0, -300.0),
    front_point(podium_u_max, -300.0),
    front_point(podium_u_max, podium_front),
    front_point(podium_u_min, podium_front),
]

podium_core = polygon_prism(triangle_points, 0.0, podium_height)
podium_front_body = polygon_prism(
    podium_front_outline, 0.0, podium_height
)
podium_rear_body = rectangular_solid(
    -300.0, -200.0, 0.0,
    rear_wing_width + podium_right_overhang + 300.0,
    rear_wing_depth + podium_rear_overhang + 200.0,
    podium_height,
)
annex_body = annex_box(
    annex_start, 0.0, 0.0,
    annex_length, annex_depth, annex_height
)

podium = podium_core.fuse(
    podium_front_body, podium_rear_body, annex_body
).clean()

# Shallow joints divide the otherwise blank front podium into large panels.
podium_joint_cutters = []
for joint_u in (front_window_start, front_u_max + 200.0):
    podium_joint_cutters.append(
        front_box(
            joint_u - podium_joint_width / 2.0,
            podium_front - podium_joint_depth,
            160.0,
            podium_joint_width,
            podium_joint_depth + 20.0,
            podium_height - 320.0,
        )
    )

podium_joint_cutters.append(
    front_box(
        podium_u_min,
        podium_front - podium_joint_depth,
        podium_height - 260.0,
        podium_u_max - podium_u_min,
        podium_joint_depth + 20.0,
        60.0,
    )
)
podium = podium.cut(cq.Compound.makeCompound(podium_joint_cutters))
components.append(podium)

# The rear wing rises from a slightly higher part of the podium.
components.append(
    rectangular_solid(
        0.0, 0.0, podium_height,
        rear_wing_width, rear_wing_depth, rear_wing_base_step
    )
)

# Accessible annex roof with a shallow perimeter parapet and low roof hatch.
components.append(
    annex_box(
        annex_start, 0.0, annex_height,
        annex_length, annex_depth, annex_roof_thickness
    )
)
annex_parapet_z = annex_height + annex_roof_thickness
annex_parapet_outer = annex_box(
    annex_start, 0.0, annex_parapet_z,
    annex_length, annex_depth, annex_parapet_height
)
annex_parapet_inner = annex_box(
    annex_start + annex_parapet_thickness,
    annex_parapet_thickness,
    annex_parapet_z - 1.0,
    annex_length - 2.0 * annex_parapet_thickness,
    annex_depth - 2.0 * annex_parapet_thickness,
    annex_parapet_height + 2.0,
)
components.append(annex_parapet_outer.cut(annex_parapet_inner))
components.append(
    annex_box(
        annex_start + 0.38 * annex_length,
        1900.0,
        annex_parapet_z,
        annex_hatch_length,
        annex_hatch_width,
        annex_hatch_height,
    )
)

# ---------------------------------------------------------------------------
# Build one front storey, then repeat it vertically.
# Its left facade is recessed behind balconies; its right bay is flush.
# ---------------------------------------------------------------------------
front_body_outline = [
    triangle_points[0],
    triangle_points[1],
    front_point(front_u_max, front_extension),
    front_point(front_window_start, front_extension),
    front_point(balcony_u_end, balcony_back),
    front_point(front_u_min, balcony_back),
    front_point(front_u_min, front_rear_notch),
    front_point(0.0, front_rear_notch),
    triangle_points[2],
]
front_storey_body = polygon_prism(
    front_body_outline, 0.0, storey_height
)
front_cutters = []
front_details = []

# Six-pane window group in the narrow, uninterrupted front strip.
cutter, detail = window_group(
    front_box,
    front_window_start + (front_window_bay_width - front_window_width) / 2.0,
    front_extension,
    window_sill_height,
    front_window_width,
    front_window_height,
    columns=3,
    rows=2,
)
front_cutters.append(cutter)
front_details.extend(detail)

# Two large recessed glazed openings behind each balcony.
door_edge_margin = 350.0
door_central_pier = 250.0
door_width = (
    balcony_width - 2.0 * door_edge_margin - door_central_pier
) / 2.0

for door_index in range(2):
    door_left = (
        front_u_min + door_edge_margin
        + door_index * (door_width + door_central_pier)
    )
    cutter, detail = window_group(
        front_box, door_left, balcony_back,
        balcony_door_sill, door_width, balcony_door_height
    )
    front_cutters.append(cutter)
    front_details.extend(detail)

# Repeated narrow openings on the thin left-hand return.
side_window_width = balcony_back - front_rear_notch - 700.0
cutter, detail = window_group(
    balcony_side_box, 350.0, 0.0, 620.0,
    side_window_width, 2250.0, columns=1, rows=2
)
front_cutters.append(cutter)
front_details.extend(detail)

front_storey_body = front_storey_body.cut(
    cq.Compound.makeCompound(front_cutters)
).clean()

# Projecting balcony plate and a low front curb.
front_details.extend([
    front_box(
        front_u_min, balcony_back, 0.0,
        balcony_width, balcony_depth, balcony_slab_thickness
    ),
    front_box(
        front_u_min, front_extension - 160.0, balcony_slab_thickness,
        balcony_width, 160.0, balcony_curb_height
    ),
])

# Three horizontal rails, a heavier handrail, and three upright posts.
for rail_level in (300.0, 600.0, 900.0):
    front_details.append(
        front_box(
            front_u_min,
            front_extension - railing_bar_depth,
            balcony_slab_thickness + rail_level,
            balcony_width,
            railing_bar_depth,
            railing_bar_height,
        )
    )

front_details.append(
    front_box(
        front_u_min,
        front_extension - handrail_depth,
        balcony_slab_thickness + balcony_guard_height - handrail_height,
        balcony_width, handrail_depth, handrail_height
    )
)

for post_fraction in (0.0, 0.48, 1.0):
    post_u = (
        front_u_min + railing_post_width / 2.0
        + post_fraction * (balcony_width - railing_post_width)
    )
    front_details.append(
        front_box(
            post_u - railing_post_width / 2.0,
            front_extension - 115.0,
            balcony_slab_thickness,
            railing_post_width,
            115.0,
            balcony_guard_height,
        )
    )

# Solid right returns create the repeated white, U-shaped balcony ends.
front_details.extend([
    front_box(
        balcony_u_end - balcony_return_thickness,
        balcony_back,
        balcony_slab_thickness,
        balcony_return_thickness,
        balcony_depth,
        balcony_return_height,
    ),
    front_box(
        balcony_u_end - balcony_return_thickness - 30.0,
        balcony_back,
        balcony_slab_thickness + balcony_return_height,
        balcony_return_thickness + 60.0,
        balcony_depth,
        70.0,
    ),
    front_box(
        front_u_min + 20.0,
        balcony_back,
        balcony_slab_thickness + balcony_guard_height - handrail_height,
        handrail_depth,
        balcony_depth,
        handrail_height,
    ),
    front_box(
        front_window_start,
        front_extension - 25.0,
        0.0,
        front_window_bay_width,
        floor_band_projection + 25.0,
        floor_band_height,
    ),
])

front_storey = cq.Compound.makeCompound(
    [front_storey_body] + front_details
)
for storey_index in range(storey_count):
    components.append(
        front_storey.translate(
            (0.0, 0.0, podium_height + storey_index * storey_height)
        )
    )

# Continuous vertical borders emphasize the narrow window bay.
for pier_u in (
    front_window_start - vertical_pier_width / 2.0,
    front_u_max - vertical_pier_width,
):
    components.append(
        front_box(
            pier_u, front_extension - 35.0, podium_height,
            vertical_pier_width, 135.0, tower_height
        )
    )

# Slender full-height fins form the ribbed far-left edge.
for fin_index in range(fin_count):
    fraction = fin_index / max(1, fin_count - 1)
    fin_v = (
        fin_first_position
        + fraction * (fin_last_position - fin_first_position)
    )
    components.append(
        front_box(
            front_u_min - fin_width + 40.0,
            fin_v - fin_thickness / 2.0,
            0.0,
            fin_width,
            fin_thickness,
            front_roof_z + roof_slab_thickness,
        )
    )

# ---------------------------------------------------------------------------
# Rear wing: repeated deep-set windows and horizontal floor bands.
# ---------------------------------------------------------------------------
rear_storey_body = rectangular_solid(
    0.0, 0.0, 0.0,
    rear_wing_width, rear_wing_depth, storey_height
)
rear_cutters = []
rear_details = []

rear_window_margin = 450.0
cutter, detail = window_group(
    rear_side_box,
    rear_window_margin,
    0.0,
    window_sill_height,
    rear_wing_depth - 2.0 * rear_window_margin,
    rear_window_height,
    columns=3,
    rows=1,
)
rear_cutters.append(cutter)
rear_details.extend(detail)

# A smaller window occupies the short return beside the projecting wing.
return_width = rear_wing_width - triangle_width
return_window_width = return_width - 700.0
cutter, detail = window_group(
    rear_return_box,
    triangle_width + (return_width - return_window_width) / 2.0,
    0.0,
    window_sill_height,
    return_window_width,
    rear_window_height,
    columns=1,
    rows=1,
)
rear_cutters.append(cutter)
rear_details.extend(detail)

rear_storey_body = rear_storey_body.cut(
    cq.Compound.makeCompound(rear_cutters)
).clean()

rear_details.extend([
    rear_side_box(
        0.0, -25.0, 0.0,
        rear_wing_depth,
        floor_band_projection + 25.0,
        floor_band_height,
    ),
    rear_return_box(
        triangle_width, -25.0, 0.0,
        return_width,
        floor_band_projection + 25.0,
        floor_band_height,
    ),
])

rear_storey = cq.Compound.makeCompound(
    [rear_storey_body] + rear_details
)
for storey_index in range(storey_count):
    components.append(
        rear_storey.translate(
            (0.0, 0.0, rear_base_z + storey_index * storey_height)
        )
    )

# ---------------------------------------------------------------------------
# Broad front canopy and the distinctive triangular rooftop enclosure.
# ---------------------------------------------------------------------------
front_roof_outline = [
    triangle_points[0],
    triangle_points[1],
    front_point(front_u_max + roof_overhang, 0.0),
    front_point(front_u_max + roof_overhang, front_extension + roof_overhang),
    front_point(front_u_min - roof_overhang, front_extension + roof_overhang),
    front_point(front_u_min - roof_overhang, front_rear_notch - roof_overhang),
    front_point(0.0, front_rear_notch - roof_overhang),
    triangle_points[2],
]
components.append(
    polygon_prism(front_roof_outline, front_roof_z, roof_slab_thickness)
)

crown_base_z = front_roof_z + roof_slab_thickness
crown_deck_z = crown_base_z + crown_wall_height

components.extend([
    polygon_prism(triangle_points, crown_base_z, crown_wall_height),
    triangle_ring(
        crown_deck_z, crown_parapet_height, crown_parapet_thickness
    ),
    triangle_ring(
        crown_deck_z + crown_parapet_height,
        crown_coping_height,
        crown_coping_width,
    ),
])

# Taller rectangular roof well behind the triangular crown.
components.append(
    rectangular_solid(
        0.0, 0.0, rear_roof_z,
        rear_wing_width, rear_wing_depth, rear_roof_slab_thickness
    )
)
rear_parapet_z = rear_roof_z + rear_roof_slab_thickness
components.extend([
    rear_roof_ring(
        rear_parapet_z, rear_parapet_height, rear_parapet_thickness
    ),
    rear_roof_ring(
        rear_parapet_z + rear_parapet_height,
        rear_coping_height,
        rear_coping_width,
    ),
])

# Keep architectural members as a compound: this preserves window/railing
# detail without an expensive boolean union of hundreds of small solids.
result = cq.Workplane("XY").newObject([
    cq.Compound.makeCompound(components)
])