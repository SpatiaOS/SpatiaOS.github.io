import cadquery as cq
import math

# Parameters - approximate proportions based on the reference image, in millimeters
outer_radius = 60.0
base_thickness = 8.0
dial_recess_radius = 48.0
dial_recess_depth = 2.4
outer_edge_chamfer = 0.7

feature_overlap = 0.05
dial_floor_z = base_thickness - dial_recess_depth

# Thin circular detail ring just inside the raised outer rim
inner_bezel_outer_radius = 46.0
inner_bezel_inner_radius = 45.0
inner_bezel_height = 0.45

# Raised Roman numeral parameters
numeral_radius = 34.0
numeral_raised_height = 0.85
numeral_character_height = 8.8
numeral_i_width = 1.7
numeral_vx_width = 6.2
numeral_character_spacing = 1.3
numeral_stroke_width = 1.15
bar_end_extension = 0.08

# Central boss and pivot
central_disk_radius = 14.2
central_disk_height = 1.55
central_disk_chamfer = 0.2

pivot_radius = 3.7
pivot_height = 1.2
pivot_chamfer = 0.15

# Clock hand / pointer
hand_angle_degrees = 35.0
hand_length = 43.0
hand_tail_length = 4.0
hand_tip_length = 4.0
hand_root_width = 1.35
hand_tip_width = 0.55
hand_height = 0.6
hand_overlap_into_disk = 0.08


def make_cylinder(radius, height, z_base, edge_chamfer=0.0):
    """Create a vertical cylinder with an optional small chamfer on circular edges."""
    solid = cq.Workplane("XY").circle(radius).extrude(height)

    if edge_chamfer > 0.0:
        solid = solid.edges("%Circle").chamfer(edge_chamfer)

    return solid.translate((0.0, 0.0, z_base))


def make_annular_ring(outer_r, inner_r, height, z_base):
    """Create a raised annular ring."""
    return (
        cq.Workplane("XY")
        .circle(outer_r)
        .circle(inner_r)
        .extrude(height)
        .translate((0.0, 0.0, z_base))
    )


def make_bar_between(start_point, end_point, bar_width, bar_height, z_base):
    """Create a rectangular raised stroke between two local XY points."""
    sx, sy = start_point
    ex, ey = end_point

    dx = ex - sx
    dy = ey - sy
    length = math.hypot(dx, dy)

    if length <= 0.0:
        raise ValueError("Bar length must be greater than zero.")

    ux = dx / length
    uy = dy / length

    # Extend each stroke slightly to avoid tiny visual gaps where bars meet.
    sx -= ux * bar_end_extension
    sy -= uy * bar_end_extension
    ex += ux * bar_end_extension
    ey += uy * bar_end_extension

    dx = ex - sx
    dy = ey - sy
    length = math.hypot(dx, dy)
    angle_degrees = math.degrees(math.atan2(dy, dx))

    mid_x = (sx + ex) / 2.0
    mid_y = (sy + ey) / 2.0

    return (
        cq.Workplane("XY")
        .box(length, bar_width, bar_height, centered=(True, True, False))
        .rotate((0, 0, 0), (0, 0, 1), angle_degrees)
        .translate((mid_x, mid_y, z_base))
    )


def make_roman_character(character, x_center, z_base):
    """Create the strokes for one Roman numeral character in local coordinates."""
    half_h = numeral_character_height / 2.0
    bars = []

    if character == "I":
        bars.append(
            make_bar_between(
                (x_center, -half_h),
                (x_center, half_h),
                numeral_stroke_width,
                numeral_raised_height + feature_overlap,
                z_base,
            )
        )

    elif character == "V":
        half_w = numeral_vx_width / 2.0
        bars.append(
            make_bar_between(
                (x_center - half_w, half_h),
                (x_center, -half_h),
                numeral_stroke_width,
                numeral_raised_height + feature_overlap,
                z_base,
            )
        )
        bars.append(
            make_bar_between(
                (x_center, -half_h),
                (x_center + half_w, half_h),
                numeral_stroke_width,
                numeral_raised_height + feature_overlap,
                z_base,
            )
        )

    elif character == "X":
        half_w = numeral_vx_width / 2.0
        bars.append(
            make_bar_between(
                (x_center - half_w, -half_h),
                (x_center + half_w, half_h),
                numeral_stroke_width,
                numeral_raised_height + feature_overlap,
                z_base,
            )
        )
        bars.append(
            make_bar_between(
                (x_center - half_w, half_h),
                (x_center + half_w, -half_h),
                numeral_stroke_width,
                numeral_raised_height + feature_overlap,
                z_base,
            )
        )

    return bars


def make_roman_numeral(numeral_text, radial_angle_degrees):
    """Create a complete Roman numeral and place it radially around the dial."""
    character_widths = {
        "I": numeral_i_width,
        "V": numeral_vx_width,
        "X": numeral_vx_width,
    }

    total_width = sum(character_widths[ch] for ch in numeral_text)
    total_width += numeral_character_spacing * (len(numeral_text) - 1)

    cursor_x = -total_width / 2.0
    local_bars = []
    numeral_z_base = dial_floor_z - feature_overlap

    for character in numeral_text:
        width = character_widths[character]
        x_center = cursor_x + width / 2.0
        local_bars.extend(make_roman_character(character, x_center, numeral_z_base))
        cursor_x += width + numeral_character_spacing

    # Local Y points outward from the center of the clock face.
    placement_rotation = radial_angle_degrees - 90.0
    angle_rad = math.radians(radial_angle_degrees)
    center_x = numeral_radius * math.cos(angle_rad)
    center_y = numeral_radius * math.sin(angle_rad)

    placed_bars = []
    for bar in local_bars:
        placed_bars.append(
            bar.rotate((0, 0, 0), (0, 0, 1), placement_rotation).translate(
                (center_x, center_y, 0.0)
            )
        )

    return placed_bars


def make_clock_hand():
    """Create a slender raised hand pointing toward the upper-right of the dial."""
    central_disk_top_z = dial_floor_z + central_disk_height
    hand_z_base = central_disk_top_z - hand_overlap_into_disk

    hand_profile_points = [
        (-hand_tail_length, -hand_root_width / 2.0),
        (hand_length - hand_tip_length, -hand_tip_width / 2.0),
        (hand_length, 0.0),
        (hand_length - hand_tip_length, hand_tip_width / 2.0),
        (-hand_tail_length, hand_root_width / 2.0),
    ]

    return (
        cq.Workplane("XY")
        .polyline(hand_profile_points)
        .close()
        .extrude(hand_height)
        .rotate((0, 0, 0), (0, 0, 1), hand_angle_degrees)
        .translate((0.0, 0.0, hand_z_base))
    )


# Create the thick circular base with a recessed dial area.
result = cq.Workplane("XY").circle(outer_radius).extrude(base_thickness)

# Slightly soften the outer top and bottom edges.
if outer_edge_chamfer > 0.0:
    result = result.edges("%Circle").chamfer(outer_edge_chamfer)

# Cut the broad circular pocket, leaving a raised outer rim.
result = (
    result.faces(">Z")
    .workplane()
    .circle(dial_recess_radius)
    .cutBlind(-dial_recess_depth)
)

# Add a thin raised circular detail line near the inside of the outer rim.
inner_bezel = make_annular_ring(
    inner_bezel_outer_radius,
    inner_bezel_inner_radius,
    inner_bezel_height + feature_overlap,
    dial_floor_z - feature_overlap,
)
result = result.union(inner_bezel)

# Add raised Roman numerals as font-independent rectangular strokes.
roman_numerals = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
}

for hour in range(1, 13):
    numeral = roman_numerals[hour]
    hour_angle = 90.0 - (hour % 12) * 30.0

    for numeral_bar in make_roman_numeral(numeral, hour_angle):
        result = result.union(numeral_bar)

# Add the raised central circular boss.
central_disk = make_cylinder(
    central_disk_radius,
    central_disk_height + feature_overlap,
    dial_floor_z - feature_overlap,
    central_disk_chamfer,
)
result = result.union(central_disk)

# Add the long clock hand above the central disk.
clock_hand = make_clock_hand()
result = result.union(clock_hand)

# Add the small pivot cap that sits above the hand.
pivot_cap = make_cylinder(
    pivot_radius,
    pivot_height + feature_overlap,
    dial_floor_z + central_disk_height - feature_overlap,
    pivot_chamfer,
)
result = result.union(pivot_cap)