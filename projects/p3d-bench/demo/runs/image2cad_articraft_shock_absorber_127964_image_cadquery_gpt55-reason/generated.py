import cadquery as cq
import math

# -----------------------------------------------------------------------------
# Parameters
# -----------------------------------------------------------------------------
# Units are approximate millimeters.  The model is interpreted as a coil-over
# shock absorber with a helical spring, central damper body, serrated adjuster
# collar, and upper/lower eyelet mounts.

# Spring geometry
spring_mean_radius = 17.0
spring_wire_radius = 2.8
spring_bottom_z = 32.0
spring_height = 70.0
spring_turns = 4.65
spring_pitch = spring_height / spring_turns

# Central damper body and rod
damper_body_radius = 6.7
damper_body_bottom_z = 25.0
damper_body_top_z = 79.0

piston_rod_radius = 4.4
piston_rod_bottom_z = 74.0
piston_rod_top_z = 121.5

thread_core_radius = 5.5
thread_wire_radius = 0.35
thread_bottom_z = 83.0
thread_height = 28.0
thread_pitch = 2.5

# Lower spring seat
lower_seat_center_z = 27.0
lower_seat_thickness = 4.0
lower_seat_outer_radius = 18.5
lower_seat_inner_radius = 5.8
lower_seat_lip_major_radius = 17.1
lower_seat_lip_minor_radius = 2.1
lower_seat_lip_z = 29.2

# Upper spring seat and lock rings
top_seat_center_z = 106.5
top_seat_thickness = 4.0
top_seat_outer_radius = 17.2
top_seat_inner_radius = 5.6
top_seat_lip_major_radius = 16.7
top_seat_lip_minor_radius = 2.0
top_seat_lip_z = 104.4

preload_ring_outer_radius = 9.4
preload_ring_inner_radius = 5.55
preload_ring_thickness = 1.8
preload_ring_lower_z = 92.0
preload_ring_upper_z = 98.0

upper_retaining_collar_outer_radius = 12.0
upper_retaining_collar_inner_radius = 5.6
upper_retaining_collar_thickness = 3.0
upper_retaining_collar_z = 109.2

# Serrated adjuster collar / gear
gear_tooth_count = 14
gear_root_radius = 16.3
gear_outer_radius = 22.2
gear_tooth_fraction = 0.52
gear_thickness = 8.0
gear_center_z = 116.0
gear_center_hole_radius = 6.9

gear_bottom_z = gear_center_z - gear_thickness / 2.0
gear_top_z = gear_center_z + gear_thickness / 2.0

gear_tab_height = 7.0
gear_tab_overlap = 0.35
gear_tab_radial_length = 6.2
gear_tab_tangential_width = 3.2
gear_tab_center_radius = 19.0
gear_tab_center_z = gear_bottom_z - gear_tab_height / 2.0 + gear_tab_overlap

# Upper eyelet mount
top_post_radius = 6.7
top_post_bottom_z = gear_top_z - 0.6
top_post_height = 23.0
top_post_top_z = top_post_bottom_z + top_post_height

top_eye_center_z = top_post_bottom_z + 17.6
top_eye_outer_radius = 7.1
top_eye_hole_radius = 3.1
top_eye_boss_length = 22.0
top_eye_rim_radius = 8.1
top_eye_rim_width = 3.6

top_button_radius = 4.4
top_button_height = 1.4
top_button_center_z = top_post_top_z + top_post_radius - top_button_height / 2.0 + 0.25

# Lower eyelet mount
bottom_eye_center_z = 8.0
bottom_eye_outer_radius = 7.4
bottom_eye_hole_radius = 3.1
bottom_eye_boss_length = 23.0
bottom_eye_rim_radius = 8.3
bottom_eye_rim_width = 3.6

bottom_post_radius = 6.0
bottom_post_bottom_z = bottom_eye_center_z - 0.5
bottom_post_top_z = lower_seat_center_z + lower_seat_thickness / 2.0 + 1.0

# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------
def safe_fillet(workplane, selector, radius):
    """Apply a fillet when possible, otherwise keep the original shape."""
    if radius <= 0:
        return workplane
    try:
        return workplane.edges(selector).fillet(radius)
    except Exception:
        return workplane


def centered_cylinder(radius, height, z_center, fillet_radius=0.0):
    """Create a vertical cylinder centered on the global Z axis."""
    cylinder = (
        cq.Workplane("XY")
        .circle(radius)
        .extrude(height)
        .translate((0.0, 0.0, z_center - height / 2.0))
    )
    return safe_fillet(cylinder, "%Circle", fillet_radius)


def annular_cylinder(outer_radius, inner_radius, height, z_center, fillet_radius=0.0):
    """Create a vertical annular cylinder."""
    outer = centered_cylinder(outer_radius, height, z_center)
    inner_cut = centered_cylinder(inner_radius, height + 2.0, z_center)
    ring = outer.cut(inner_cut)
    return safe_fillet(ring, "%Circle", fillet_radius)


def horizontal_cylinder_x(
    radius,
    length,
    z_center,
    x_center=0.0,
    y_center=0.0,
    fillet_radius=0.0,
):
    """Create a cylinder whose axis runs along the X direction."""
    cylinder = (
        cq.Workplane("YZ")
        .circle(radius)
        .extrude(length, both=True)
        .translate((x_center, y_center, z_center))
    )
    return safe_fillet(cylinder, "%Circle", fillet_radius)


def torus_z(major_radius, minor_radius, z_center):
    """Create a toroidal rounded ring around the Z axis."""
    return cq.Workplane("XY").add(
        cq.Solid.makeTorus(
            major_radius,
            minor_radius,
            cq.Vector(0.0, 0.0, z_center),
            cq.Vector(0.0, 0.0, 1.0),
        )
    )


def helical_tube(center_radius, tube_radius, height, pitch, z_bottom, phase_degrees=0.0):
    """Sweep a circular section along a helix to form the spring/thread."""
    helix_path = cq.Wire.makeHelix(pitch, height, center_radius)

    tube = (
        cq.Workplane("XZ")
        .center(center_radius, 0.0)
        .circle(tube_radius)
        .sweep(helix_path, isFrenet=True, combine=False)
    )

    if abs(phase_degrees) > 1e-6:
        tube = tube.rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), phase_degrees)

    return tube.translate((0.0, 0.0, z_bottom))


def toothed_disk(
    root_radius,
    outer_radius,
    tooth_count,
    tooth_fraction,
    height,
    z_center,
    center_hole_radius,
    fillet_radius=0.0,
):
    """Create a simple serrated radial collar using a 2D toothed profile."""
    points = []
    angle_step = 2.0 * math.pi / tooth_count
    tooth_half_angle = angle_step * tooth_fraction / 2.0

    for index in range(tooth_count):
        valley_angle = index * angle_step
        tooth_center_angle = valley_angle + angle_step / 2.0

        points.append(
            (
                root_radius * math.cos(valley_angle),
                root_radius * math.sin(valley_angle),
            )
        )
        points.append(
            (
                outer_radius * math.cos(tooth_center_angle - tooth_half_angle),
                outer_radius * math.sin(tooth_center_angle - tooth_half_angle),
            )
        )
        points.append(
            (
                outer_radius * math.cos(tooth_center_angle + tooth_half_angle),
                outer_radius * math.sin(tooth_center_angle + tooth_half_angle),
            )
        )

    disk = (
        cq.Workplane("XY")
        .polyline(points)
        .close()
        .extrude(height)
        .translate((0.0, 0.0, z_center - height / 2.0))
    )

    if center_hole_radius > 0:
        center_hole = centered_cylinder(center_hole_radius, height + 2.0, z_center)
        disk = disk.cut(center_hole)

    return safe_fillet(disk, "|Z", fillet_radius)


def radial_box(
    center_radius,
    radial_length,
    tangential_width,
    height,
    z_center,
    angle_degrees,
    fillet_radius=0.0,
):
    """Create a rectangular radial tab and rotate it around the Z axis."""
    tab = (
        cq.Workplane("XY")
        .box(radial_length, tangential_width, height)
        .translate((center_radius, 0.0, z_center))
        .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle_degrees)
    )
    return safe_fillet(tab, "|Z", fillet_radius)


# -----------------------------------------------------------------------------
# Central damper body, rod, and visible upper threads
# -----------------------------------------------------------------------------
damper_body = centered_cylinder(
    damper_body_radius,
    damper_body_top_z - damper_body_bottom_z,
    (damper_body_bottom_z + damper_body_top_z) / 2.0,
    fillet_radius=0.45,
)

piston_rod = centered_cylinder(
    piston_rod_radius,
    piston_rod_top_z - piston_rod_bottom_z,
    (piston_rod_bottom_z + piston_rod_top_z) / 2.0,
    fillet_radius=0.25,
)

thread_core = centered_cylinder(
    thread_core_radius,
    thread_height,
    thread_bottom_z + thread_height / 2.0,
    fillet_radius=0.15,
)

external_thread = helical_tube(
    thread_core_radius + thread_wire_radius,
    thread_wire_radius,
    thread_height,
    thread_pitch,
    thread_bottom_z,
    phase_degrees=8.0,
)

preload_ring_lower = annular_cylinder(
    preload_ring_outer_radius,
    preload_ring_inner_radius,
    preload_ring_thickness,
    preload_ring_lower_z,
    fillet_radius=0.18,
)

preload_ring_upper = annular_cylinder(
    preload_ring_outer_radius,
    preload_ring_inner_radius,
    preload_ring_thickness,
    preload_ring_upper_z,
    fillet_radius=0.18,
)

upper_retaining_collar = annular_cylinder(
    upper_retaining_collar_outer_radius,
    upper_retaining_collar_inner_radius,
    upper_retaining_collar_thickness,
    upper_retaining_collar_z,
    fillet_radius=0.25,
)

# -----------------------------------------------------------------------------
# Spring seats and helical coil spring
# -----------------------------------------------------------------------------
lower_seat = annular_cylinder(
    lower_seat_outer_radius,
    lower_seat_inner_radius,
    lower_seat_thickness,
    lower_seat_center_z,
    fillet_radius=0.3,
)

# Small wrench-like scallops/notches in the lower spring perch rim.
for notch_angle in (28.0, 148.0, 268.0):
    notch_cut = radial_box(
        lower_seat_outer_radius + 1.2,
        7.0,
        5.0,
        lower_seat_thickness + 1.5,
        lower_seat_center_z,
        notch_angle,
    )
    lower_seat = lower_seat.cut(notch_cut)

lower_seat_lip = torus_z(
    lower_seat_lip_major_radius,
    lower_seat_lip_minor_radius,
    lower_seat_lip_z,
)

lower_seat_inner_hub = annular_cylinder(
    10.0,
    lower_seat_inner_radius,
    3.0,
    lower_seat_center_z + 1.2,
    fillet_radius=0.2,
)

lower_base_detail_ring = annular_cylinder(
    lower_seat_outer_radius + 1.3,
    lower_seat_outer_radius - 0.5,
    0.8,
    lower_seat_center_z - 2.2,
    fillet_radius=0.08,
)

top_seat = annular_cylinder(
    top_seat_outer_radius,
    top_seat_inner_radius,
    top_seat_thickness,
    top_seat_center_z,
    fillet_radius=0.3,
)

top_seat_lip = torus_z(
    top_seat_lip_major_radius,
    top_seat_lip_minor_radius,
    top_seat_lip_z,
)

top_seat_inner_hub = annular_cylinder(
    10.4,
    top_seat_inner_radius,
    3.2,
    top_seat_center_z + 1.5,
    fillet_radius=0.2,
)

spring = helical_tube(
    spring_mean_radius,
    spring_wire_radius,
    spring_height,
    spring_pitch,
    spring_bottom_z,
    phase_degrees=18.0,
)

# -----------------------------------------------------------------------------
# Serrated adjuster collar / crown gear at the top of the spring
# -----------------------------------------------------------------------------
gear = toothed_disk(
    gear_root_radius,
    gear_outer_radius,
    gear_tooth_count,
    gear_tooth_fraction,
    gear_thickness,
    gear_center_z,
    gear_center_hole_radius,
    fillet_radius=0.28,
)

gear_lower_hub = annular_cylinder(
    13.0,
    gear_center_hole_radius,
    3.2,
    gear_bottom_z - 1.0,
    fillet_radius=0.2,
)

gear_upper_hub = annular_cylinder(
    11.5,
    gear_center_hole_radius,
    4.2,
    gear_top_z - 1.4,
    fillet_radius=0.22,
)

gear_top_detail_ring = annular_cylinder(
    15.0,
    13.6,
    0.7,
    gear_top_z + 0.25,
    fillet_radius=0.06,
)

gear_tabs = []
for index in range(gear_tooth_count):
    angle = (index + 0.5) * 360.0 / gear_tooth_count
    gear_tabs.append(
        radial_box(
            gear_tab_center_radius,
            gear_tab_radial_length,
            gear_tab_tangential_width,
            gear_tab_height,
            gear_tab_center_z,
            angle,
            fillet_radius=0.22,
        )
    )

# -----------------------------------------------------------------------------
# Upper eyelet mount with rounded tower and horizontal through-hole
# -----------------------------------------------------------------------------
top_post = centered_cylinder(
    top_post_radius,
    top_post_height,
    top_post_bottom_z + top_post_height / 2.0,
)

top_dome = (
    cq.Workplane("XY")
    .sphere(top_post_radius)
    .translate((0.0, 0.0, top_post_top_z))
)

top_eye_boss = horizontal_cylinder_x(
    top_eye_outer_radius,
    top_eye_boss_length,
    top_eye_center_z,
    fillet_radius=0.35,
)

top_eye_rim_offset = top_eye_boss_length / 2.0 + top_eye_rim_width / 2.0 - 0.2

top_eye_rim_left = horizontal_cylinder_x(
    top_eye_rim_radius,
    top_eye_rim_width,
    top_eye_center_z,
    x_center=-top_eye_rim_offset,
    fillet_radius=0.25,
)

top_eye_rim_right = horizontal_cylinder_x(
    top_eye_rim_radius,
    top_eye_rim_width,
    top_eye_center_z,
    x_center=top_eye_rim_offset,
    fillet_radius=0.25,
)

top_eye_hole = horizontal_cylinder_x(
    top_eye_hole_radius,
    top_eye_boss_length + 2.0 * top_eye_rim_width + 8.0,
    top_eye_center_z,
)

top_mount = (
    top_post
    .union(top_dome)
    .union(top_eye_boss)
    .union(top_eye_rim_left)
    .union(top_eye_rim_right)
    .cut(top_eye_hole)
)

top_button = centered_cylinder(
    top_button_radius,
    top_button_height,
    top_button_center_z,
    fillet_radius=0.12,
)

# -----------------------------------------------------------------------------
# Lower eyelet mount with vertical stem and horizontal through-hole
# -----------------------------------------------------------------------------
bottom_post = centered_cylinder(
    bottom_post_radius,
    bottom_post_top_z - bottom_post_bottom_z,
    (bottom_post_bottom_z + bottom_post_top_z) / 2.0,
    fillet_radius=0.25,
)

bottom_eye_boss = horizontal_cylinder_x(
    bottom_eye_outer_radius,
    bottom_eye_boss_length,
    bottom_eye_center_z,
    fillet_radius=0.35,
)

bottom_eye_rim_offset = bottom_eye_boss_length / 2.0 + bottom_eye_rim_width / 2.0 - 0.2

bottom_eye_rim_left = horizontal_cylinder_x(
    bottom_eye_rim_radius,
    bottom_eye_rim_width,
    bottom_eye_center_z,
    x_center=-bottom_eye_rim_offset,
    fillet_radius=0.25,
)

bottom_eye_rim_right = horizontal_cylinder_x(
    bottom_eye_rim_radius,
    bottom_eye_rim_width,
    bottom_eye_center_z,
    x_center=bottom_eye_rim_offset,
    fillet_radius=0.25,
)

bottom_eye_hole = horizontal_cylinder_x(
    bottom_eye_hole_radius,
    bottom_eye_boss_length + 2.0 * bottom_eye_rim_width + 8.0,
    bottom_eye_center_z,
)

bottom_mount = (
    bottom_post
    .union(bottom_eye_boss)
    .union(bottom_eye_rim_left)
    .union(bottom_eye_rim_right)
    .cut(bottom_eye_hole)
)

# -----------------------------------------------------------------------------
# Combine all visible solids into a single CadQuery result
# -----------------------------------------------------------------------------
components = [
    bottom_mount,
    lower_seat,
    lower_seat_lip,
    lower_seat_inner_hub,
    lower_base_detail_ring,
    damper_body,
    piston_rod,
    thread_core,
    external_thread,
    preload_ring_lower,
    preload_ring_upper,
    upper_retaining_collar,
    spring,
    top_seat,
    top_seat_lip,
    top_seat_inner_hub,
    gear,
    gear_lower_hub,
    gear_upper_hub,
    gear_top_detail_ring,
    top_mount,
    top_button,
]

components.extend(gear_tabs)

all_shapes = []
for component in components:
    all_shapes.extend(component.vals())

result = cq.Workplane("XY").add(cq.Compound.makeCompound(all_shapes))