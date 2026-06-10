import cadquery as cq
import math

# -----------------------------
# Parameters - estimated from the reference image
# -----------------------------

# Overall vintage portable TV/radio body
body_width = 220.0
body_depth = 82.0
body_height = 112.0
body_corner_radius = 2.0

# Coordinate references
front_y = -body_depth / 2.0
back_y = body_depth / 2.0
right_x = body_width / 2.0
top_z = body_height

# Front face layout
front_frame_width = body_width - 9.0
front_frame_height = body_height - 8.0
front_frame_rail = 3.0

# CRT screen section
screen_center_x = -34.0
screen_center_z = 56.0
screen_outer_width = 148.0
screen_outer_height = 86.0
screen_outer_rail = 4.0
screen_recess_width = 132.0
screen_recess_height = 72.0
screen_recess_depth = 6.0
screen_glass_width = 122.0
screen_glass_height = 62.0
screen_glass_corner_radius = 7.0
screen_glass_thickness = 0.8

# Right-side control / speaker section
control_center_x = 75.0
control_center_z = 56.0
control_outer_width = 42.0
control_outer_height = 86.0
control_frame_rail = 3.0
control_recess_depth = 2.8

speaker_center_z = 78.0
speaker_width = 32.0
speaker_height = 34.0
speaker_slat_count = 7

lower_panel_center_z = 32.0
lower_panel_width = 33.0
lower_panel_height = 44.0
lower_panel_recess_depth = 5.0

# Top panel and antenna slot
top_cap_height = 2.4
top_rail_height = 2.0
antenna_slot_length = 98.0
antenna_slot_width = 8.0
antenna_slot_center_x = 28.0
antenna_slot_center_y = -5.0

# Antenna base and rods
antenna_base_x = 31.0
antenna_base_y = -4.5
antenna_base_width = 30.0
antenna_base_depth = 12.0
antenna_base_height = 3.0
antenna_hinge_radius = 2.6

left_antenna_start = (24.0, -5.0, top_z + top_cap_height + 5.0)
left_antenna_end = (-78.0, -16.0, top_z + 158.0)
right_antenna_start = (36.0, -5.0, top_z + top_cap_height + 5.0)
right_antenna_end = (132.0, -24.0, top_z + 136.0)

antenna_base_radius = 0.85
antenna_tip_radius = 0.45
antenna_segment_count = 5
antenna_collar_length = 3.2

# Decorative projections
small_projection = 1.0
medium_projection = 2.0
large_projection = 3.6


# -----------------------------
# Helper functions
# -----------------------------

def apply_edge_fillet(workplane, radius, selector=None):
    """Apply an optional cosmetic fillet; return the unfilleted shape if the fillet is not possible."""
    if radius <= 0.0:
        return workplane

    try:
        if selector is None:
            return workplane.edges().fillet(radius)
        return workplane.edges(selector).fillet(radius)
    except Exception:
        return workplane


def make_box(center, size, fillet_radius=0.0):
    """Create a centered box, optionally with softened edges."""
    box_obj = cq.Workplane("XY").box(size[0], size[1], size[2]).translate(center)
    box_obj = apply_edge_fillet(box_obj, fillet_radius)
    return box_obj.val()


def make_front_box(center_x, center_z, width, height, projection, y_origin):
    """Create a rectangular feature on the front face, projecting toward -Y."""
    return make_box(
        (center_x, y_origin - projection / 2.0, center_z),
        (width, projection, height)
    )


def make_front_recess_cut(center_x, center_z, width, height, depth):
    """Create a cutter that removes material inward from the front face."""
    return (
        cq.Workplane("XY")
        .box(width, depth + 0.4, height)
        .translate((center_x, front_y + depth / 2.0, center_z))
    )


def add_front_frame(parts, center_x, center_z, outer_width, outer_height, rail_width, projection, y_origin):
    """Add a four-piece rectangular raised frame on the front face."""
    # Top and bottom rails
    parts.append(make_front_box(
        center_x,
        center_z + outer_height / 2.0 - rail_width / 2.0,
        outer_width,
        rail_width,
        projection,
        y_origin
    ))
    parts.append(make_front_box(
        center_x,
        center_z - outer_height / 2.0 + rail_width / 2.0,
        outer_width,
        rail_width,
        projection,
        y_origin
    ))

    # Left and right rails
    vertical_height = outer_height - 2.0 * rail_width
    parts.append(make_front_box(
        center_x - outer_width / 2.0 + rail_width / 2.0,
        center_z,
        rail_width,
        vertical_height,
        projection,
        y_origin
    ))
    parts.append(make_front_box(
        center_x + outer_width / 2.0 - rail_width / 2.0,
        center_z,
        rail_width,
        vertical_height,
        projection,
        y_origin
    ))


def make_front_rounded_plate(center_x, center_z, width, height, corner_radius, thickness, y_origin):
    """Create a rounded CRT glass plate parallel to the front face."""
    safe_radius = max(0.0, min(corner_radius, width / 2.0 - 0.1, height / 2.0 - 0.1))

    # Preferred method: create a rounded 2D profile on an XZ-oriented plane, then extrude toward -Y.
    front_plane = cq.Plane(
        origin=(0.0, y_origin, 0.0),
        xDir=(1.0, 0.0, 0.0),
        normal=(0.0, -1.0, 0.0)
    )

    if safe_radius > 0.0:
        try:
            return (
                cq.Workplane(front_plane)
                .center(center_x, center_z)
                .rect(width, height)
                .vertices()
                .fillet2D(safe_radius)
                .extrude(thickness)
                .val()
            )
        except Exception:
            pass

    # Robust fallback: make a rectangular plate and fillet its four edges parallel to Y.
    plate = (
        cq.Workplane("XY")
        .box(width, thickness, height)
        .translate((center_x, y_origin - thickness / 2.0, center_z))
    )
    plate = apply_edge_fillet(plate, safe_radius, "|Y")
    return plate.val()


def make_front_cylinder(center_x, center_z, radius, projection, y_origin):
    """Create a circular button or knob projecting from the front face."""
    return cq.Solid.makeCylinder(
        radius,
        projection,
        pnt=cq.Vector(center_x, y_origin, center_z),
        dir=cq.Vector(0.0, -1.0, 0.0)
    )


def make_right_side_box(center_y, center_z, depth, height, projection, x_origin):
    """Create a rectangular feature on the right side face, projecting toward +X."""
    return make_box(
        (x_origin + projection / 2.0, center_y, center_z),
        (projection, depth, height)
    )


def add_right_side_frame(parts, center_y, center_z, outer_depth, outer_height, rail_width, projection, x_origin):
    """Add a four-piece frame on the visible right-side panel."""
    # Top and bottom rails
    parts.append(make_right_side_box(
        center_y,
        center_z + outer_height / 2.0 - rail_width / 2.0,
        outer_depth,
        rail_width,
        projection,
        x_origin
    ))
    parts.append(make_right_side_box(
        center_y,
        center_z - outer_height / 2.0 + rail_width / 2.0,
        outer_depth,
        rail_width,
        projection,
        x_origin
    ))

    # Front and rear vertical rails on the side panel
    vertical_height = outer_height - 2.0 * rail_width
    parts.append(make_right_side_box(
        center_y - outer_depth / 2.0 + rail_width / 2.0,
        center_z,
        rail_width,
        vertical_height,
        projection,
        x_origin
    ))
    parts.append(make_right_side_box(
        center_y + outer_depth / 2.0 - rail_width / 2.0,
        center_z,
        rail_width,
        vertical_height,
        projection,
        x_origin
    ))


def make_cylinder_between(start, end, radius):
    """Create a cylinder between two arbitrary 3D points."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    if length <= 1.0e-6:
        return make_box(start, (radius * 2.0, radius * 2.0, radius * 2.0))

    return cq.Solid.makeCylinder(
        radius,
        length,
        pnt=cq.Vector(start[0], start[1], start[2]),
        dir=cq.Vector(dx / length, dy / length, dz / length)
    )


def lerp_point(start, end, t):
    """Linear interpolation between two points."""
    return (
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t,
    )


def add_segmented_curve(parts, points, radius):
    """Approximate a curved front detail using short cylindrical segments."""
    for index in range(len(points) - 1):
        parts.append(make_cylinder_between(points[index], points[index + 1], radius))


def add_telescoping_antenna(parts, start, end):
    """Create a segmented telescoping antenna with collars and a small cap."""
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    dz = end[2] - start[2]
    antenna_length = math.sqrt(dx * dx + dy * dy + dz * dz)

    if antenna_length <= 1.0e-6:
        return

    unit_direction = (dx / antenna_length, dy / antenna_length, dz / antenna_length)

    for segment_index in range(antenna_segment_count):
        t0 = segment_index / antenna_segment_count
        t1 = (segment_index + 1) / antenna_segment_count

        segment_start = lerp_point(start, end, t0)
        segment_end = lerp_point(start, end, t1)

        radius_blend = segment_index / max(1, antenna_segment_count - 1)
        segment_radius = antenna_base_radius + (antenna_tip_radius - antenna_base_radius) * radius_blend

        parts.append(make_cylinder_between(segment_start, segment_end, segment_radius))

        # Slightly thicker collars at the telescoping joints
        if segment_index < antenna_segment_count - 1:
            joint_center = lerp_point(start, end, t1)
            collar_start = (
                joint_center[0] - unit_direction[0] * antenna_collar_length / 2.0,
                joint_center[1] - unit_direction[1] * antenna_collar_length / 2.0,
                joint_center[2] - unit_direction[2] * antenna_collar_length / 2.0,
            )
            collar_end = (
                joint_center[0] + unit_direction[0] * antenna_collar_length / 2.0,
                joint_center[1] + unit_direction[1] * antenna_collar_length / 2.0,
                joint_center[2] + unit_direction[2] * antenna_collar_length / 2.0,
            )
            parts.append(make_cylinder_between(collar_start, collar_end, segment_radius + 0.22))

    # Small block-like caps at the antenna tips
    parts.append(make_box(end, (4.0, 2.6, 3.0), fillet_radius=0.25))


# -----------------------------
# Model construction
# -----------------------------

model_parts = []

# Main rectangular body with softened external corners
body = (
    cq.Workplane("XY")
    .box(body_width, body_depth, body_height)
    .translate((0.0, 0.0, body_height / 2.0))
)
body = apply_edge_fillet(body, body_corner_radius)

# Recessed CRT screen and right control-panel openings
body = body.cut(make_front_recess_cut(
    screen_center_x,
    screen_center_z,
    screen_recess_width,
    screen_recess_height,
    screen_recess_depth
))
body = body.cut(make_front_recess_cut(
    control_center_x,
    control_center_z,
    control_outer_width - 8.0,
    control_outer_height - 8.0,
    control_recess_depth
))
body = body.cut(make_front_recess_cut(
    control_center_x,
    lower_panel_center_z,
    lower_panel_width,
    lower_panel_height,
    lower_panel_recess_depth
))

model_parts.append(body.val())

# Raised top cap with a long inset slot for the antennas
top_cap = (
    cq.Workplane("XY")
    .box(body_width - 12.0, body_depth - 10.0, top_cap_height)
    .translate((0.0, 0.0, top_z + top_cap_height / 2.0))
)

slot_cut = (
    cq.Workplane("XY")
    .box(antenna_slot_length, antenna_slot_width, top_cap_height + 0.8)
    .translate((antenna_slot_center_x, antenna_slot_center_y, top_z + top_cap_height / 2.0))
)

top_cap = top_cap.cut(slot_cut)
model_parts.append(top_cap.val())

# Recess floor visible through the top antenna slot
model_parts.append(make_box(
    (antenna_slot_center_x, antenna_slot_center_y, top_z + 0.15),
    (antenna_slot_length - 6.0, antenna_slot_width - 2.0, 0.3)
))

# Raised top edge rails
model_parts.append(make_box(
    (0.0, front_y + 5.0, top_z + top_cap_height + top_rail_height / 2.0),
    (body_width - 16.0, 3.0, top_rail_height)
))
model_parts.append(make_box(
    (0.0, back_y - 6.0, top_z + top_cap_height + top_rail_height / 2.0),
    (body_width - 18.0, 3.0, top_rail_height)
))
model_parts.append(make_box(
    (-body_width / 2.0 + 8.0, 0.0, top_z + top_cap_height + top_rail_height / 2.0),
    (3.0, body_depth - 16.0, top_rail_height)
))
model_parts.append(make_box(
    (body_width / 2.0 - 8.0, 0.0, top_z + top_cap_height + top_rail_height / 2.0),
    (3.0, body_depth - 16.0, top_rail_height)
))

# Main front perimeter frame and inner decorative groove
add_front_frame(
    model_parts,
    0.0,
    body_height / 2.0,
    front_frame_width,
    front_frame_height,
    front_frame_rail,
    large_projection,
    front_y
)

add_front_frame(
    model_parts,
    0.0,
    body_height / 2.0,
    front_frame_width - 10.0,
    front_frame_height - 10.0,
    1.2,
    small_projection,
    front_y - large_projection
)

# CRT screen outer raised frame
add_front_frame(
    model_parts,
    screen_center_x,
    screen_center_z,
    screen_outer_width,
    screen_outer_height,
    screen_outer_rail,
    4.2,
    front_y - 0.2
)

# Inset bevel-like frame inside the screen recess
add_front_frame(
    model_parts,
    screen_center_x,
    screen_center_z,
    screen_recess_width,
    screen_recess_height,
    2.0,
    1.0,
    front_y + 1.6
)

# Rounded CRT glass set deep inside the front recess
model_parts.append(make_front_rounded_plate(
    screen_center_x,
    screen_center_z,
    screen_glass_width,
    screen_glass_height,
    screen_glass_corner_radius,
    screen_glass_thickness,
    front_y + screen_recess_depth - 0.25
))

# Subtle curved highlights on the CRT glass
screen_line_y = front_y + screen_recess_depth - screen_glass_thickness - 0.45
add_segmented_curve(
    model_parts,
    [
        (-90.0, screen_line_y, 63.0),
        (-62.0, screen_line_y, 61.0),
        (-35.0, screen_line_y, 57.0),
        (-8.0, screen_line_y, 52.0),
    ],
    0.28
)
add_segmented_curve(
    model_parts,
    [
        (-88.0, screen_line_y, 34.0),
        (-58.0, screen_line_y, 27.0),
        (-24.0, screen_line_y, 25.5),
        (12.0, screen_line_y, 31.0),
    ],
    0.24
)

# Small logo plaque under the CRT screen
model_parts.append(make_front_box(
    screen_center_x + 36.0,
    13.5,
    16.0,
    1.4,
    0.8,
    front_y - 0.7
))

# Vertical ribs separating the CRT from the control section
model_parts.append(make_front_box(43.5, body_height / 2.0, 3.0, 92.0, 4.0, front_y - 0.2))
model_parts.append(make_front_box(49.0, body_height / 2.0, 2.0, 92.0, 2.5, front_y - 0.4))

# Control panel outer frame
add_front_frame(
    model_parts,
    control_center_x,
    control_center_z,
    control_outer_width,
    control_outer_height,
    control_frame_rail,
    4.0,
    front_y - 0.2
)

# Right edge protective rib on the front
model_parts.append(make_front_box(99.0, body_height / 2.0, 4.0, 100.0, 3.8, front_y - 0.2))

# Speaker recess background
model_parts.append(make_front_box(
    control_center_x,
    speaker_center_z,
    speaker_width,
    speaker_height,
    0.5,
    front_y + control_recess_depth - 0.1
))

# Speaker grille frame
add_front_frame(
    model_parts,
    control_center_x,
    speaker_center_z,
    speaker_width + 3.5,
    speaker_height + 3.5,
    1.8,
    1.1,
    front_y + 0.8
)

# Horizontal and staggered grille slats
speaker_bottom_z = speaker_center_z - speaker_height / 2.0 + 4.0
speaker_spacing = (speaker_height - 8.0) / (speaker_slat_count - 1)

for row_index in range(speaker_slat_count):
    z_pos = speaker_bottom_z + row_index * speaker_spacing
    model_parts.append(make_front_box(
        control_center_x,
        z_pos,
        speaker_width - 8.0,
        1.2,
        1.0,
        front_y + 1.1
    ))

    if row_index < speaker_slat_count - 1:
        link_z = z_pos + speaker_spacing / 2.0
        offset = 2.5 if row_index % 2 == 0 else -2.5
        for col_index in range(3):
            x_pos = control_center_x - 9.0 + col_index * 9.0 + offset
            model_parts.append(make_front_box(
                x_pos,
                link_z,
                1.2,
                2.4,
                0.9,
                front_y + 1.0
            ))

# Small display/button strip above the speaker grille
model_parts.append(make_front_box(
    control_center_x + 1.5,
    97.5,
    26.0,
    6.0,
    1.2,
    front_y + 0.4
))

for button_x in [69.0, 74.0, 79.0]:
    model_parts.append(make_front_cylinder(
        button_x,
        97.5,
        1.45,
        1.7,
        front_y - 0.2
    ))

# Lower rectangular control/tape-style dark inset
add_front_frame(
    model_parts,
    control_center_x,
    lower_panel_center_z,
    lower_panel_width + 4.0,
    lower_panel_height + 4.0,
    2.0,
    1.4,
    front_y + 0.6
)

model_parts.append(make_front_box(
    control_center_x,
    lower_panel_center_z,
    lower_panel_width,
    lower_panel_height,
    0.6,
    front_y + lower_panel_recess_depth - 0.2
))

# Small bottom step and foot-like front details
model_parts.append(make_front_box(-82.0, 4.0, 28.0, 2.2, 1.2, front_y - 0.2))
model_parts.append(make_front_box(88.0, 4.0, 24.0, 2.2, 1.2, front_y - 0.2))

# Right side panel, visible in perspective, with inset framing
add_right_side_frame(
    model_parts,
    1.0,
    body_height / 2.0,
    body_depth - 14.0,
    body_height - 18.0,
    2.5,
    2.8,
    right_x
)

# Side panel rear seam and bottom seam details
model_parts.append(make_right_side_box(
    back_y - 8.0,
    body_height / 2.0,
    3.0,
    body_height - 22.0,
    2.4,
    right_x
))
model_parts.append(make_right_side_box(
    1.0,
    10.0,
    body_depth - 22.0,
    2.0,
    1.6,
    right_x
))
model_parts.append(make_right_side_box(
    front_y + 6.0,
    body_height / 2.0,
    2.5,
    body_height - 18.0,
    2.2,
    right_x
))

# Antenna base block and hinge cylinder on top
antenna_base_z = top_z + top_cap_height + antenna_base_height / 2.0
model_parts.append(make_box(
    (antenna_base_x, antenna_base_y, antenna_base_z),
    (antenna_base_width, antenna_base_depth, antenna_base_height),
    fillet_radius=0.4
))

model_parts.append(cq.Solid.makeCylinder(
    antenna_hinge_radius,
    antenna_base_width - 4.0,
    pnt=cq.Vector(
        antenna_base_x - (antenna_base_width - 4.0) / 2.0,
        antenna_base_y,
        top_z + top_cap_height + antenna_base_height + 1.5
    ),
    dir=cq.Vector(1.0, 0.0, 0.0)
))

# Small pivot collars where the rods leave the hinge
model_parts.append(cq.Solid.makeCylinder(
    2.0,
    5.0,
    pnt=cq.Vector(left_antenna_start[0] - 2.5, left_antenna_start[1], left_antenna_start[2] - 1.0),
    dir=cq.Vector(1.0, 0.0, 0.0)
))
model_parts.append(cq.Solid.makeCylinder(
    2.0,
    5.0,
    pnt=cq.Vector(right_antenna_start[0] - 2.5, right_antenna_start[1], right_antenna_start[2] - 1.0),
    dir=cq.Vector(1.0, 0.0, 0.0)
))

# Two angled telescoping antenna rods
add_telescoping_antenna(model_parts, left_antenna_start, left_antenna_end)
add_telescoping_antenna(model_parts, right_antenna_start, right_antenna_end)

# Combine all modeled solids into the final result
result = cq.Workplane("XY").add(cq.Compound.makeCompound(model_parts))