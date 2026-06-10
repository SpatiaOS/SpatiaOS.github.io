import cadquery as cq
import math

# ---------------------------------------------------------------------------
# Parameters (estimated in millimeters)
# ---------------------------------------------------------------------------

# Overall base plate
base_thickness = 8.0
base_edge_fillet = 3.0
panel_recess_depth = 0.6
panel_frame_width = 1.4
panel_frame_height = 0.8

# Handle locations and proportions
left_handle_center = (-82.0, 28.0)
right_handle_center = (82.0, -28.0)

handle_outer_ring_radius = 25.0
handle_inner_ring_radius = 20.0
handle_plinth_radius = 20.0
handle_plinth_height = 4.0
handle_cone_bottom_radius = 16.0
handle_cone_top_radius = 10.5
handle_cone_height = 8.0
handle_neck_radius = 9.0
handle_neck_height = 5.0
handle_knob_height = 52.0
handle_knob_max_radius = 17.0

# Central arched bridge and cutter
arch_center_x = -10.0
arch_center_y = -29.0
arch_outer_radius = 23.0
arch_inner_radius = 17.0
arch_depth = 8.0

# Central post
center_post_x = -24.0
center_post_y = -4.0

# Depth adjuster assembly
depth_boss_x = 36.0
depth_boss_y = 5.0
depth_boss_radius = 25.0
depth_boss_height = 9.0

# Thread/detail sizing
thread_pitch = 2.0
thread_ring_height = 0.45

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

model_parts = []


def add_part(part):
    """Add either a CadQuery Workplane or a Shape to the final compound list."""
    if part is None:
        return
    if isinstance(part, cq.Workplane):
        model_parts.extend(part.vals())
    else:
        model_parts.append(part)


def safe_fillet(workplane, selector, radius):
    """Attempt a fillet and return the original object if the fillet fails."""
    if radius <= 0:
        return workplane
    try:
        return workplane.edges(selector).fillet(radius)
    except Exception:
        return workplane


def cylinder_z(radius, height, x=0.0, y=0.0, z=0.0):
    """Create a vertical cylinder starting at z."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z)
        .center(x, y)
        .circle(radius)
        .extrude(height)
    )


def annular_cylinder_z(x, y, z, outer_radius, inner_radius, height):
    """Create a vertical washer/ring."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z)
        .center(x, y)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(height)
    )


def rounded_box_z(
    length,
    width,
    height,
    x=0.0,
    y=0.0,
    z=0.0,
    fillet_radius=0.0,
    angle_deg=0.0,
):
    """Create a box with optional vertical edge fillets and rotation about Z."""
    part = (
        cq.Workplane("XY")
        .workplane(offset=z)
        .box(length, width, height, centered=(True, True, False))
    )
    part = safe_fillet(part, "|Z", fillet_radius)
    part = part.rotate((0, 0, 0), (0, 0, 1), angle_deg)
    return part.translate((x, y, 0))


def bar_between_xy(point_a, point_b, width, height, z, fillet_radius=0.0):
    """Create a rectangular raised rib/bar between two XY points."""
    ax, ay = point_a
    bx, by = point_b
    dx = bx - ax
    dy = by - ay
    length = math.hypot(dx, dy)
    angle_deg = math.degrees(math.atan2(dy, dx))
    mid_x = (ax + bx) * 0.5
    mid_y = (ay + by) * 0.5
    return rounded_box_z(
        length,
        width,
        height,
        mid_x,
        mid_y,
        z,
        fillet_radius=fillet_radius,
        angle_deg=angle_deg,
    )


def cylinder_axis(radius, length, start_point, direction):
    """Create a cylinder along an arbitrary axis."""
    return cq.Workplane().add(
        cq.Solid.makeCylinder(
            radius,
            length,
            cq.Vector(*start_point),
            cq.Vector(*direction),
        )
    )


def cone_axis(radius_1, radius_2, length, start_point, direction):
    """Create a cone/frustum along an arbitrary axis."""
    return cq.Workplane().add(
        cq.Solid.makeCone(
            radius_1,
            radius_2,
            length,
            cq.Vector(*start_point),
            cq.Vector(*direction),
        )
    )


def cone_z(x, y, z, bottom_radius, top_radius, height):
    """Create a vertical cone/frustum starting at z."""
    return cone_axis(
        bottom_radius,
        top_radius,
        height,
        (x, y, z),
        (0, 0, 1),
    )


def create_egg_knob(x, y, z_base, knob_height, max_radius):
    """Create an egg-shaped wooden-style handle knob with a slotted top recess."""
    bottom_radius = max_radius * 0.55
    top_flat_radius = max_radius * 0.28
    profile_segments = 34

    profile_points = [(0.0, 0.0), (bottom_radius, 0.0)]

    # Bulged egg profile: widest below center, tapered toward the top.
    for index in range(profile_segments):
        u = 0.08 + 0.84 * index / (profile_segments - 1)
        z = knob_height * u
        radius = max_radius * (math.sin(math.pi * u) ** 0.58) * (1.18 - 0.34 * u)
        profile_points.append((radius, z))

    # Small flattened top for the screwdriver slot.
    profile_points.extend(
        [
            (top_flat_radius, knob_height - 2.0),
            (top_flat_radius * 0.92, knob_height),
            (0.0, knob_height),
        ]
    )

    knob = (
        cq.Workplane("XZ")
        .polyline(profile_points)
        .close()
        .revolve(360.0, (0, 0, 0), (0, 0, 1))
        .translate((x, y, z_base))
    )

    # Slot-like recess in the top of each knob.
    slot_tool = (
        cq.Workplane("XY")
        .workplane(offset=z_base + knob_height + 0.5)
        .center(x, y)
        .slot2D(max_radius * 1.05, max_radius * 0.33)
        .extrude(-9.0)
    )

    try:
        knob = knob.cut(slot_tool)
    except Exception:
        pass

    return knob


def create_semicircular_arch(center_x, center_y, z_base, outer_radius, inner_radius, depth):
    """Create the raised arched bridge spanning the cutter mouth."""
    arch = (
        cq.Workplane("XZ")
        .moveTo(-outer_radius, 0.0)
        .threePointArc((0.0, outer_radius), (outer_radius, 0.0))
        .lineTo(inner_radius, 0.0)
        .threePointArc((0.0, inner_radius), (-inner_radius, 0.0))
        .close()
        .extrude(depth)
        .translate((center_x, center_y + depth / 2.0, z_base))
    )
    return arch


def create_blade_wedge(center_x, center_y, z_base, height, top_width, bottom_width, thickness):
    """Create the vertical tapered cutter blade plate behind the bridge."""
    blade = (
        cq.Workplane("XZ")
        .polyline(
            [
                (-bottom_width / 2.0, 0.0),
                (bottom_width / 2.0, 0.0),
                (top_width / 2.0, height),
                (-top_width / 2.0, height),
            ]
        )
        .close()
        .extrude(thickness)
        .translate((center_x, center_y + thickness / 2.0, z_base))
    )
    return blade


def text_xy(label, size, thickness, x, y, z, angle_deg=0.0):
    """Create raised horizontal text. If font generation fails, return empty geometry."""
    try:
        txt = cq.Workplane("XY").text(label, size, thickness)
        txt = txt.rotate((0, 0, 0), (0, 0, 1), angle_deg)
        return txt.translate((x, y, z))
    except Exception:
        return cq.Workplane("XY")


def text_xz(label, size, thickness, x, y, z):
    """Create raised vertical text on an XZ-facing plane."""
    try:
        return cq.Workplane("XZ").text(label, size, thickness).translate((x, y, z))
    except Exception:
        return cq.Workplane("XY")


def add_panel_frame(x, y, width, depth, z, strip_width, height):
    """Add simple raised rectangular panel frames on the base plate."""
    add_part(
        rounded_box_z(
            width,
            strip_width,
            height,
            x,
            y + depth / 2.0 - strip_width / 2.0,
            z,
            fillet_radius=0.3,
        )
    )
    add_part(
        rounded_box_z(
            width,
            strip_width,
            height,
            x,
            y - depth / 2.0 + strip_width / 2.0,
            z,
            fillet_radius=0.3,
        )
    )
    add_part(
        rounded_box_z(
            strip_width,
            depth,
            height,
            x - width / 2.0 + strip_width / 2.0,
            y,
            z,
            fillet_radius=0.3,
        )
    )
    add_part(
        rounded_box_z(
            strip_width,
            depth,
            height,
            x + width / 2.0 - strip_width / 2.0,
            y,
            z,
            fillet_radius=0.3,
        )
    )


def add_threaded_rod_z(x, y, z_start, height, core_radius, thread_radius, pitch, ring_height):
    """Approximate vertical threading with stacked fine annular rings."""
    add_part(cylinder_z(core_radius, height, x, y, z_start))

    ring_count = int(height / pitch)
    for index in range(ring_count):
        z = z_start + index * pitch
        add_part(
            annular_cylinder_z(
                x,
                y,
                z,
                thread_radius,
                core_radius * 0.72,
                ring_height,
            )
        )


def add_threaded_rod_y(x, y_start, z, length, core_radius, thread_radius, pitch, ring_thickness):
    """Approximate horizontal threading along the Y axis."""
    add_part(cylinder_axis(core_radius, length, (x, y_start, z), (0, 1, 0)))

    ring_count = int(length / pitch)
    for index in range(ring_count):
        y = y_start + index * pitch
        add_part(cylinder_axis(thread_radius, ring_thickness, (x, y, z), (0, 1, 0)))


def add_knurled_disk_z(x, y, z, radius, height, teeth=24):
    """Create a horizontal knurled thumb wheel."""
    add_part(cylinder_z(radius, height, x, y, z))

    tooth_radius = 0.75
    for index in range(teeth):
        angle = 2.0 * math.pi * index / teeth
        tooth_x = x + math.cos(angle) * (radius + 0.25)
        tooth_y = y + math.sin(angle) * (radius + 0.25)
        add_part(cylinder_z(tooth_radius, height + 0.2, tooth_x, tooth_y, z - 0.1))

    add_part(cylinder_z(radius * 0.42, height + 1.0, x, y, z - 0.2))


def add_perforated_thumbwheel_y(
    x,
    y_center,
    z,
    radius,
    thickness,
    hole_count=12,
    hole_radius=1.1,
):
    """Create a vertical perforated side thumb wheel, axis along Y."""
    start_y = y_center - thickness / 2.0
    disk_shape = cq.Solid.makeCylinder(
        radius,
        thickness,
        cq.Vector(x, start_y, z),
        cq.Vector(0, 1, 0),
    )

    # Ring of small holes through the face.
    hole_circle_radius = radius * 0.55
    for index in range(hole_count):
        angle = 2.0 * math.pi * index / hole_count
        hole_x = x + math.cos(angle) * hole_circle_radius
        hole_z = z + math.sin(angle) * hole_circle_radius
        hole_shape = cq.Solid.makeCylinder(
            hole_radius,
            thickness + 2.0,
            cq.Vector(hole_x, start_y - 1.0, hole_z),
            cq.Vector(0, 1, 0),
        )
        try:
            disk_shape = disk_shape.cut(hole_shape)
        except Exception:
            pass

    add_part(cq.Workplane().add(disk_shape))

    # Raised edge knurl bumps.
    tooth_radius = 0.65
    for index in range(24):
        angle = 2.0 * math.pi * index / 24
        tooth_x = x + math.cos(angle) * (radius + 0.15)
        tooth_z = z + math.sin(angle) * (radius + 0.15)
        add_part(
            cylinder_axis(
                tooth_radius,
                thickness + 0.5,
                (tooth_x, start_y - 0.25, tooth_z),
                (0, 1, 0),
            )
        )

    # Center hub.
    add_part(cylinder_axis(radius * 0.28, thickness + 1.6, (x, start_y - 0.8, z), (0, 1, 0)))


def semicircle_plate_z(x, y, z, radius, height, angle_deg=0.0):
    """Create a small semi-circular gauge/index plate on the base."""
    plate = (
        cq.Workplane("XY")
        .workplane(offset=z)
        .moveTo(-radius, 0.0)
        .threePointArc((0.0, radius), (radius, 0.0))
        .lineTo(-radius, 0.0)
        .close()
        .extrude(height)
    )
    plate = plate.rotate((0, 0, 0), (0, 0, 1), angle_deg)
    return plate.translate((x, y, 0))


# ---------------------------------------------------------------------------
# Base plate
# ---------------------------------------------------------------------------

# Irregular, mirrored-lobed outline approximating the router plane casting.
base_outline_points = [
    (-110.0, 8.0),
    (-108.0, 28.0),
    (-96.0, 47.0),
    (-78.0, 53.0),
    (-62.0, 47.0),
    (-50.0, 35.0),
    (-33.0, 29.0),
    (-10.0, 30.0),
    (3.0, 39.0),
    (22.0, 39.0),
    (35.0, 28.0),
    (58.0, 29.0),
    (73.0, 43.0),
    (95.0, 42.0),
    (111.0, 28.0),
    (112.0, 7.0),
    (101.0, -5.0),
    (101.0, -28.0),
    (91.0, -44.0),
    (73.0, -53.0),
    (55.0, -48.0),
    (43.0, -35.0),
    (28.0, -28.0),
    (10.0, -28.0),
    (0.0, -42.0),
    (-22.0, -42.0),
    (-35.0, -29.0),
    (-57.0, -29.0),
    (-73.0, -43.0),
    (-95.0, -42.0),
    (-110.0, -27.0),
    (-111.0, -8.0),
]

base = cq.Workplane("XY").polyline(base_outline_points).close().extrude(base_thickness)
base = safe_fillet(base, "|Z", base_edge_fillet)

# Shallow recessed flat panels in the casting.
panel_recess_specs = [
    (-60.0, -4.0, 60.0, 30.0),
    (64.0, -5.0, 58.0, 30.0),
]
for panel_x, panel_y, panel_w, panel_d in panel_recess_specs:
    recess_tool = rounded_box_z(
        panel_w,
        panel_d,
        panel_recess_depth + 0.3,
        panel_x,
        panel_y,
        base_thickness - panel_recess_depth,
        fillet_radius=2.0,
    )
    base = base.cut(recess_tool)

# U-shaped mouth/opening in front of the cutter.
mouth_x = arch_center_x
mouth_y = -38.0
mouth_radius = 16.0
base = base.cut(cylinder_z(mouth_radius, base_thickness + 2.0, mouth_x, mouth_y, -1.0))
base = base.cut(
    rounded_box_z(
        mouth_radius * 1.8,
        36.0,
        base_thickness + 2.0,
        mouth_x,
        mouth_y - 19.0,
        -1.0,
        fillet_radius=1.0,
    )
)

# Small bottom edge relief notches visible in the casting.
base = base.cut(rounded_box_z(10.0, 18.0, base_thickness + 2.0, 70.0, -56.0, -1.0))
base = base.cut(rounded_box_z(10.0, 18.0, base_thickness + 2.0, -80.0, -49.0, -1.0))

# Countersunk/counterbored screw holes in the base.
base_hole_specs = [
    (-62.0, -18.0, 2.1, 4.5),
    (-45.0, -18.0, 1.6, 3.5),
    (46.0, -19.0, 3.1, 6.0),
    (61.0, -19.0, 1.7, 3.6),
    (75.0, 8.0, 1.6, 3.4),
]
for hole_x, hole_y, through_radius, counter_radius in base_hole_specs:
    base = base.cut(cylinder_z(through_radius, base_thickness + 3.0, hole_x, hole_y, -1.0))
    base = base.cut(cylinder_z(counter_radius, 1.8, hole_x, hole_y, base_thickness - 1.4))

add_part(base)

# Raised panel frames and labels.
add_panel_frame(-60.0, -4.0, 60.0, 30.0, base_thickness + 0.05, panel_frame_width, panel_frame_height)
add_panel_frame(64.0, -5.0, 58.0, 30.0, base_thickness + 0.05, panel_frame_width, panel_frame_height)

add_part(rounded_box_z(24.0, 13.0, 1.0, 75.0, 8.0, base_thickness + 0.35, fillet_radius=1.0))
add_part(text_xy("No.71", 4.0, 0.65, 75.0, 8.0, base_thickness + 1.35))

add_part(rounded_box_z(23.0, 12.0, 1.0, -36.0, 10.5, base_thickness + 0.35, fillet_radius=1.0, angle_deg=-18.0))
add_part(text_xy("PAT", 4.0, 0.65, -36.0, 10.5, base_thickness + 1.35, angle_deg=-18.0))

# Small semi-circular indexed gauge plate with drilled dots.
gauge_plate = semicircle_plate_z(-30.0, -1.0, base_thickness + 0.45, 10.0, 1.0)
for gauge_angle in range(25, 156, 22):
    hx = -30.0 + math.cos(math.radians(gauge_angle)) * 7.0
    hy = -1.0 + math.sin(math.radians(gauge_angle)) * 7.0
    gauge_plate = gauge_plate.cut(cylinder_z(0.65, 3.0, hx, hy, base_thickness - 0.2))
add_part(gauge_plate)
add_part(bar_between_xy((-30.0, -1.0), (-21.0, -7.0), 1.1, 0.8, base_thickness + 1.25, fillet_radius=0.2))

# ---------------------------------------------------------------------------
# Two turned handles
# ---------------------------------------------------------------------------

def add_handle_assembly(x, y):
    """Add the stacked collar, neck, and egg-shaped knob."""
    add_part(annular_cylinder_z(x, y, base_thickness + 0.05, handle_outer_ring_radius, handle_inner_ring_radius, 1.4))
    add_part(cylinder_z(handle_plinth_radius, handle_plinth_height, x, y, base_thickness))
    add_part(annular_cylinder_z(x, y, base_thickness + handle_plinth_height - 0.2, 18.5, 15.0, 1.2))
    add_part(cone_z(x, y, base_thickness + handle_plinth_height, handle_cone_bottom_radius, handle_cone_top_radius, handle_cone_height))
    add_part(cylinder_z(handle_neck_radius, handle_neck_height, x, y, base_thickness + handle_plinth_height + handle_cone_height))

    knob_z = base_thickness + handle_plinth_height + handle_cone_height + handle_neck_height
    add_part(create_egg_knob(x, y, knob_z, handle_knob_height, handle_knob_max_radius))

    # Thin equator seam/ring around the knob, matching the split line in the reference.
    seam_z = knob_z + handle_knob_height * 0.54
    seam_outer_radius = handle_knob_max_radius * 0.98
    add_part(
        annular_cylinder_z(
            x,
            y,
            seam_z - 0.28,
            seam_outer_radius,
            seam_outer_radius - 1.0,
            0.56,
        )
    )


add_handle_assembly(*left_handle_center)
add_handle_assembly(*right_handle_center)

# ---------------------------------------------------------------------------
# Arched bridge, cutter, and central post
# ---------------------------------------------------------------------------

# Raised arched bridge over the cutter mouth.
add_part(
    create_semicircular_arch(
        arch_center_x,
        arch_center_y,
        base_thickness,
        arch_outer_radius,
        arch_inner_radius,
        arch_depth,
    )
)

# Bridge feet and raised casting ribs.
add_part(rounded_box_z(7.0, 13.0, 4.0, arch_center_x - arch_outer_radius + 3.0, arch_center_y, base_thickness, fillet_radius=1.0))
add_part(rounded_box_z(7.0, 13.0, 4.0, arch_center_x + arch_outer_radius - 3.0, arch_center_y, base_thickness, fillet_radius=1.0))
add_part(bar_between_xy((arch_center_x + 4.0, arch_center_y + 3.0), (depth_boss_x - 16.0, depth_boss_y - 12.0), 7.0, 4.5, base_thickness + 1.0, fillet_radius=1.0))
add_part(bar_between_xy((arch_center_x - 15.0, arch_center_y + 3.0), (center_post_x - 4.0, center_post_y - 7.0), 4.0, 3.0, base_thickness + 1.0, fillet_radius=0.8))

# Raised Stanley name across the front face of the arch.
add_part(
    text_xz(
        "STANLEY",
        5.2,
        0.8,
        arch_center_x,
        arch_center_y - arch_depth / 2.0 - 0.15,
        base_thickness + 13.3,
    )
)

# Tapered cutter/blade plate located behind the arch.
add_part(create_blade_wedge(-7.0, -21.5, base_thickness, 30.0, top_width=9.0, bottom_width=4.5, thickness=5.0))

# Tall central post and tapered base.
add_part(rounded_box_z(24.0, 18.0, 4.0, center_post_x, center_post_y, base_thickness, fillet_radius=2.0))
add_part(cone_z(center_post_x, center_post_y, base_thickness + 4.0, 11.0, 6.0, 14.0))
add_part(cylinder_z(5.5, 48.0, center_post_x, center_post_y, base_thickness + 18.0))
add_part(cylinder_z(8.0, 4.0, center_post_x, center_post_y, base_thickness + 66.0))
add_part(cylinder_z(6.3, 2.0, center_post_x, center_post_y, base_thickness + 70.0))

# Small clamp screw through the central post.
add_threaded_rod_y(center_post_x, center_post_y + 5.0, base_thickness + 39.0, 18.0, 1.5, 2.0, 2.2, 0.35)
add_part(cylinder_axis(5.0, 2.4, (center_post_x, center_post_y + 23.0, base_thickness + 39.0), (0, 1, 0)))

# ---------------------------------------------------------------------------
# Depth adjuster tower with threaded screw and side thumbwheel
# ---------------------------------------------------------------------------

# Round raised boss on the base.
add_part(cylinder_z(depth_boss_radius, depth_boss_height, depth_boss_x, depth_boss_y, base_thickness))
add_part(annular_cylinder_z(depth_boss_x, depth_boss_y, base_thickness + depth_boss_height - 0.1, depth_boss_radius + 1.0, depth_boss_radius - 3.2, 2.1))
add_part(cylinder_z(depth_boss_radius - 8.5, 3.0, depth_boss_x, depth_boss_y, base_thickness + depth_boss_height))

# Sliding block and guide rods.
slide_block_z = base_thickness + depth_boss_height + 3.0

slide_block = rounded_box_z(12.0, 10.0, 38.0, depth_boss_x - 8.0, depth_boss_y, slide_block_z, fillet_radius=1.1)
slide_block = slide_block.cut(rounded_box_z(3.0, 12.0, 31.0, depth_boss_x - 8.0, depth_boss_y, slide_block_z + 4.0))
add_part(slide_block)

add_part(cylinder_z(3.2, 42.0, depth_boss_x + 2.5, depth_boss_y - 5.2, slide_block_z))
add_part(cylinder_z(3.2, 42.0, depth_boss_x + 2.5, depth_boss_y + 5.2, slide_block_z))
add_part(rounded_box_z(19.0, 12.0, 4.0, depth_boss_x - 2.5, depth_boss_y, slide_block_z + 38.5, fillet_radius=1.2))
add_part(cylinder_z(8.0, 3.2, depth_boss_x - 8.0, depth_boss_y, slide_block_z + 40.0))

# Vertical threaded depth screw with top knurled wheel and nut.
depth_screw_x = depth_boss_x + 13.0
depth_screw_y = depth_boss_y + 4.5
depth_screw_z = base_thickness + depth_boss_height

add_threaded_rod_z(
    depth_screw_x,
    depth_screw_y,
    depth_screw_z,
    55.0,
    core_radius=2.55,
    thread_radius=3.25,
    pitch=thread_pitch,
    ring_height=thread_ring_height,
)

add_knurled_disk_z(depth_screw_x, depth_screw_y, depth_screw_z + 42.0, 12.5, 4.0, teeth=26)
add_part(cylinder_z(4.8, 10.0, depth_screw_x, depth_screw_y, depth_screw_z + 46.0))
add_part(cylinder_z(6.0, 2.2, depth_screw_x, depth_screw_y, depth_screw_z + 56.0))
add_part(cylinder_z(4.0, 4.0, depth_screw_x, depth_screw_y, depth_screw_z + 58.0))

# Side adjustment screw, horizontal and threaded, with perforated wheel.
side_screw_x = depth_boss_x + depth_boss_radius - 3.0
side_screw_z = base_thickness + depth_boss_height + 19.0
side_screw_start_y = depth_boss_y + depth_boss_radius - 3.0

add_part(cone_axis(7.0, 4.2, 8.0, (side_screw_x, side_screw_start_y - 5.0, side_screw_z), (0, 1, 0)))
add_threaded_rod_y(
    side_screw_x,
    side_screw_start_y + 2.0,
    side_screw_z,
    27.0,
    core_radius=2.2,
    thread_radius=2.9,
    pitch=2.0,
    ring_thickness=0.42,
)
add_perforated_thumbwheel_y(
    side_screw_x,
    side_screw_start_y + 34.0,
    side_screw_z,
    radius=12.5,
    thickness=4.0,
    hole_count=12,
    hole_radius=1.0,
)

# ---------------------------------------------------------------------------
# Final compound
# ---------------------------------------------------------------------------

result = cq.Workplane("XY").add(cq.Compound.makeCompound(model_parts))