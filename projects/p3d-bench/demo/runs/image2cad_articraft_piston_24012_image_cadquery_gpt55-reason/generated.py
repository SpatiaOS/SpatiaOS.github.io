import math
import cadquery as cq

# Parameters
# Units are millimeters. Dimensions are estimated from the reference image.
piston_diameter = 62.0
piston_radius = piston_diameter / 2.0
piston_height = 42.0
piston_edge_fillet = 1.25

# Piston ring grooves
top_ring_groove_count = 6
top_ring_first_z = 27.4
top_ring_pitch = 1.45
top_ring_width = 0.62
top_ring_depth = 1.05

bottom_ring_groove_centers = (3.2, 5.1, 7.0)
bottom_ring_width = 0.65
bottom_ring_depth = 1.0

# Piston top details
top_recess_radius = 6.8
top_recess_depth = 1.4
top_slot_width = 0.75
top_slot_depth = 0.35
top_slot_angle_deg = 32.0
top_slot_outer_radius = piston_radius - 7.0

# Wrist pin boss and bore on the piston sides
piston_pin_z = 17.2
pin_boss_outer_radius = 10.2
pin_boss_recess_radius = 7.2
pin_boss_protrusion = 4.2
pin_boss_overlap = 1.6
pin_boss_recess_depth = 1.1
pin_bore_radius = 4.5

# Connecting rod shank
rod_web_thickness_y = 4.2
rod_flange_thickness_y = 8.5
rod_cut_through_y = 22.0
rod_neck_width_x = 11.0
rod_neck_depth_y = 8.5
rod_neck_height_z = 12.0
rod_neck_center_z = -4.0

# Big-end bearing
big_end_center_z = -112.0
big_end_outer_radius = 22.0
big_end_inner_radius = 13.0
big_end_body_thickness_y = 12.0
bearing_lip_outer_radius = 17.0
bearing_lip_thickness_y = 2.0
bearing_lip_overlap = 0.15

# Big-end cap lugs and bolts
lug_width_x = 9.0
lug_depth_y = 16.0
lug_height_z = 28.0
lug_overlap_x = 3.0
lug_center_z = big_end_center_z - 4.0

bolt_shaft_radius = 1.6
bolt_head_diameter = 6.4
bolt_stud_height = 4.0
bolt_head_height = 3.0
bolt_overlap = 0.2

# Small engraved split line across the big-end cap
cap_split_line_z = big_end_center_z - 7.0
cap_split_line_height = 0.55
cap_split_line_depth_y = 0.8


# Helper functions
def make_piston_groove_cut(z_center, groove_width, groove_depth, body_radius):
    """Create a thin annular cutting tool for a circumferential piston groove."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_center - groove_width / 2.0)
        .circle(body_radius + 1.0)
        .circle(body_radius - groove_depth)
        .extrude(groove_width)
    )


def make_xz_prism(points_xz, thickness_y):
    """Create a prism from an XZ-plane polygon, extruded symmetrically along Y."""
    return (
        cq.Workplane("XY")
        .workplane(offset=-thickness_y / 2.0)
        .polyline(points_xz)
        .close()
        .extrude(thickness_y)
        .rotate((0, 0, 0), (1, 0, 0), 90)
    )


def make_bar_xz(start_xz, end_xz, bar_width, thickness_y):
    """Create a rectangular rib/bar between two points in the XZ plane."""
    x1, z1 = start_xz
    x2, z2 = end_xz
    dx = x2 - x1
    dz = z2 - z1
    length = math.hypot(dx, dz)

    normal_x = -dz / length * (bar_width / 2.0)
    normal_z = dx / length * (bar_width / 2.0)

    bar_profile = [
        (x1 + normal_x, z1 + normal_z),
        (x2 + normal_x, z2 + normal_z),
        (x2 - normal_x, z2 - normal_z),
        (x1 - normal_x, z1 - normal_z),
    ]

    return make_xz_prism(bar_profile, thickness_y)


def make_cylinder_y(radius, length_y, center):
    """Create a cylinder with its axis along Y."""
    return (
        cq.Workplane("XY")
        .workplane(offset=-length_y / 2.0)
        .circle(radius)
        .extrude(length_y)
        .rotate((0, 0, 0), (1, 0, 0), 90)
        .translate(center)
    )


def make_annular_cylinder_y(outer_radius, inner_radius, length_y, center):
    """Create an annular cylinder / washer with its axis along Y."""
    return (
        cq.Workplane("XY")
        .workplane(offset=-length_y / 2.0)
        .circle(outer_radius)
        .circle(inner_radius)
        .extrude(length_y)
        .rotate((0, 0, 0), (1, 0, 0), 90)
        .translate(center)
    )


def make_cylinder_z(radius, x, y, z_start, height):
    """Create a vertical cylinder along Z."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_start)
        .center(x, y)
        .circle(radius)
        .extrude(height)
    )


def make_hex_prism_z(diameter, x, y, z_start, height):
    """Create a vertical hexagonal bolt head / nut."""
    return (
        cq.Workplane("XY")
        .workplane(offset=z_start)
        .center(x, y)
        .polygon(6, diameter)
        .extrude(height)
    )


# Create the piston body as a vertical cylinder with softened top and bottom edges.
piston = (
    cq.Workplane("XY")
    .circle(piston_radius)
    .extrude(piston_height)
)
piston = piston.faces(">Z").edges().fillet(piston_edge_fillet)
piston = piston.faces("<Z").edges().fillet(piston_edge_fillet)

# Cut stacked ring grooves near the top skirt.
for groove_index in range(top_ring_groove_count):
    groove_z = top_ring_first_z + groove_index * top_ring_pitch
    piston = piston.cut(
        make_piston_groove_cut(
            groove_z,
            top_ring_width,
            top_ring_depth,
            piston_radius,
        )
    )

# Cut lower skirt grooves.
for groove_z in bottom_ring_groove_centers:
    piston = piston.cut(
        make_piston_groove_cut(
            groove_z,
            bottom_ring_width,
            bottom_ring_depth,
            piston_radius,
        )
    )

# Add a shallow radial engraving on the piston crown.
top_slot_inner_radius = top_recess_radius
top_slot_length = top_slot_outer_radius - top_slot_inner_radius
top_slot_cut_height = top_slot_depth + 0.25
top_slot_center_radius = top_slot_inner_radius + top_slot_length / 2.0

top_slot_cut = (
    cq.Workplane("XY")
    .box(
        top_slot_length,
        top_slot_width,
        top_slot_cut_height,
        centered=(True, True, True),
    )
    .translate(
        (
            top_slot_center_radius,
            0.0,
            piston_height - top_slot_depth / 2.0 + 0.125,
        )
    )
    .rotate((0, 0, 0), (0, 0, 1), top_slot_angle_deg)
)
piston = piston.cut(top_slot_cut)

# Cut the circular shallow recess on the piston crown.
top_recess_cut = (
    cq.Workplane("XY")
    .workplane(offset=piston_height - top_recess_depth)
    .circle(top_recess_radius)
    .extrude(top_recess_depth + 0.25)
)
piston = piston.cut(top_recess_cut)

# Add front and rear wrist-pin bosses, then cut their concentric recesses and through-bore.
pin_boss_length = pin_boss_protrusion + pin_boss_overlap

for side_sign in (1.0, -1.0):
    boss_center_y = side_sign * (
        piston_radius + (pin_boss_protrusion - pin_boss_overlap) / 2.0
    )
    pin_boss = make_cylinder_y(
        pin_boss_outer_radius,
        pin_boss_length,
        (0.0, boss_center_y, piston_pin_z),
    )
    piston = piston.union(pin_boss)

for side_sign in (1.0, -1.0):
    boss_face_y = side_sign * (piston_radius + pin_boss_protrusion)
    recess_cut_length = pin_boss_recess_depth + 0.8
    recess_center_y = boss_face_y - side_sign * (
        pin_boss_recess_depth / 2.0 - 0.4
    )
    boss_recess_cut = make_cylinder_y(
        pin_boss_recess_radius,
        recess_cut_length,
        (0.0, recess_center_y, piston_pin_z),
    )
    piston = piston.cut(boss_recess_cut)

pin_bore_cut = make_cylinder_y(
    pin_bore_radius,
    2.0 * (piston_radius + pin_boss_protrusion) + 4.0,
    (0.0, 0.0, piston_pin_z),
)
piston = piston.cut(pin_bore_cut)


# Create the connecting rod web as a tapered XZ profile with a large internal opening.
rod_outer_profile = [
    (-5.5, -3.0),
    (-6.4, -46.0),
    (-9.8, -76.0),
    (-17.5, -99.0),
    (-12.0, -107.0),
    (12.0, -107.0),
    (17.5, -99.0),
    (9.8, -76.0),
    (6.4, -46.0),
    (5.5, -3.0),
]

rod_window_profile = [
    (-2.5, -11.0),
    (-6.0, -62.0),
    (-10.5, -88.0),
    (0.0, -99.0),
    (10.5, -88.0),
    (6.0, -62.0),
    (2.5, -11.0),
]

rod_frame = make_xz_prism(rod_outer_profile, rod_web_thickness_y)
rod_frame = rod_frame.cut(make_xz_prism(rod_window_profile, rod_cut_through_y))

# Add raised side flanges to suggest the I-beam style section visible in the reference.
left_flange_profile = [
    (-5.9, -3.0),
    (-6.7, -48.0),
    (-10.5, -78.0),
    (-18.0, -101.0),
    (-13.3, -105.0),
    (-7.2, -82.0),
    (-4.5, -48.0),
    (-4.2, -3.0),
]
right_flange_profile = [(-x, z) for x, z in left_flange_profile]

left_flange = make_xz_prism(left_flange_profile, rod_flange_thickness_y)
right_flange = make_xz_prism(right_flange_profile, rod_flange_thickness_y)

# Top neck disappears into the piston skirt.
rod_neck = (
    cq.Workplane("XY")
    .box(
        rod_neck_width_x,
        rod_neck_depth_y,
        rod_neck_height_z,
        centered=(True, True, True),
    )
    .translate((0.0, 0.0, rod_neck_center_z))
)

connecting_rod = rod_frame.union(left_flange).union(right_flange).union(rod_neck)

# Internal truss-like ribs within the rod opening.
rib_specs = [
    ((0.0, -14.0), (0.0, -94.0), 2.0),
    ((-7.0, -89.0), (3.8, -66.0), 1.9),
    ((7.0, -89.0), (-3.8, -66.0), 1.9),
    ((-5.5, -66.0), (3.0, -42.0), 1.7),
    ((5.5, -66.0), (-3.0, -42.0), 1.7),
]

for rib_start, rib_end, rib_width in rib_specs:
    rib = make_bar_xz(rib_start, rib_end, rib_width, rod_web_thickness_y + 0.4)
    connecting_rod = connecting_rod.union(rib)


# Create the big-end bearing ring and raised bearing lips.
big_end_ring = make_annular_cylinder_y(
    big_end_outer_radius,
    big_end_inner_radius,
    big_end_body_thickness_y,
    (0.0, 0.0, big_end_center_z),
)

front_lip_y = (
    big_end_body_thickness_y / 2.0
    + bearing_lip_thickness_y / 2.0
    - bearing_lip_overlap
)
back_lip_y = -front_lip_y

front_bearing_lip = make_annular_cylinder_y(
    bearing_lip_outer_radius,
    big_end_inner_radius,
    bearing_lip_thickness_y,
    (0.0, front_lip_y, big_end_center_z),
)
back_bearing_lip = make_annular_cylinder_y(
    bearing_lip_outer_radius,
    big_end_inner_radius,
    bearing_lip_thickness_y,
    (0.0, back_lip_y, big_end_center_z),
)

big_end_assembly = big_end_ring.union(front_bearing_lip).union(back_bearing_lip)

# Add blocky cap lugs on both sides of the big end.
lug_x_offset = big_end_outer_radius + lug_width_x / 2.0 - lug_overlap_x

left_lug = (
    cq.Workplane("XY")
    .box(lug_width_x, lug_depth_y, lug_height_z, centered=(True, True, True))
    .translate((-lug_x_offset, 0.0, lug_center_z))
)
right_lug = (
    cq.Workplane("XY")
    .box(lug_width_x, lug_depth_y, lug_height_z, centered=(True, True, True))
    .translate((lug_x_offset, 0.0, lug_center_z))
)

big_end_assembly = big_end_assembly.union(left_lug).union(right_lug)

# Engrave the split line of the lower bearing cap on the front and rear faces.
cap_width_x = 2.0 * (lug_x_offset + lug_width_x / 2.0) + 2.0
big_end_front_y = max(
    lug_depth_y / 2.0,
    big_end_body_thickness_y / 2.0 + bearing_lip_thickness_y - bearing_lip_overlap,
)

front_cap_split_cut = (
    cq.Workplane("XY")
    .box(
        cap_width_x,
        cap_split_line_depth_y,
        cap_split_line_height,
        centered=(True, True, True),
    )
    .translate(
        (
            0.0,
            big_end_front_y - cap_split_line_depth_y / 2.0,
            cap_split_line_z,
        )
    )
)
back_cap_split_cut = (
    cq.Workplane("XY")
    .box(
        cap_width_x,
        cap_split_line_depth_y,
        cap_split_line_height,
        centered=(True, True, True),
    )
    .translate(
        (
            0.0,
            -big_end_front_y + cap_split_line_depth_y / 2.0,
            cap_split_line_z,
        )
    )
)

big_end_assembly = big_end_assembly.cut(front_cap_split_cut).cut(back_cap_split_cut)

# Add four small bolt/stud details around the cap lugs.
lug_top_z = lug_center_z + lug_height_z / 2.0
lug_bottom_z = lug_center_z - lug_height_z / 2.0

for bolt_x in (-lug_x_offset, lug_x_offset):
    top_stud = make_cylinder_z(
        bolt_shaft_radius,
        bolt_x,
        0.0,
        lug_top_z - bolt_overlap,
        bolt_stud_height + bolt_overlap,
    )
    top_head = make_hex_prism_z(
        bolt_head_diameter,
        bolt_x,
        0.0,
        lug_top_z + bolt_stud_height - bolt_overlap,
        bolt_head_height,
    )

    bottom_stud = make_cylinder_z(
        bolt_shaft_radius,
        bolt_x,
        0.0,
        lug_bottom_z - bolt_stud_height,
        bolt_stud_height + bolt_overlap,
    )
    bottom_head = make_hex_prism_z(
        bolt_head_diameter,
        bolt_x,
        0.0,
        lug_bottom_z - bolt_stud_height - bolt_head_height,
        bolt_head_height + bolt_overlap,
    )

    bolt_set = top_stud.union(top_head).union(bottom_stud).union(bottom_head)
    big_end_assembly = big_end_assembly.union(bolt_set)


# Combine the piston, rod, and big-end components.
result = piston.union(connecting_rod).union(big_end_assembly)

# Clear the big-end bore after union so the bearing hole remains open through all overlapping geometry.
final_big_end_bore_cut = make_cylinder_y(
    big_end_inner_radius + 0.05,
    lug_depth_y + 6.0,
    (0.0, 0.0, big_end_center_z),
)
result = result.cut(final_big_end_bore_cut)