import cadquery as cq

# ==========================================
# Parameters
# ==========================================
# Base dimensions
base_w = 100
base_d = 100
base_h = 60

# Plate dimensions
plate_w = 120
plate_d = 120
bottom_plate_h = 10
top_plate_h = 8

# Drawer dimensions
drawer_w = 70
drawer_h = 40
drawer_d = 85
drawer_front_t = 6

# Hopper (Bowl) dimensions
hopper_r1 = 45
hopper_r2 = 65
hopper_h = 55
hopper_t = 3

# Mechanism dimensions
shaft_r = 6
shaft_h = 65
handle_l = 85
handle_w = 16
handle_t = 3
handle_lift = 16

# ==========================================
# 1. Base Assembly
# ==========================================
# Bottom Plate (stepped profile)
bottom_plate_1 = cq.Workplane("XY").box(plate_w, plate_d, 6).translate((0, 0, 3)).edges("|Z").fillet(4)
bottom_plate_2 = cq.Workplane("XY").box(plate_w - 12, plate_d - 12, 4).translate((0, 0, 6 + 2)).edges("|Z").fillet(4).edges(">Z").chamfer(1.5)
bottom_plate = bottom_plate_1.union(bottom_plate_2)

# Main Base Body
base_body = cq.Workplane("XY").box(base_w, base_d, base_h).translate((0, 0, bottom_plate_h + base_h/2))

# Top Plate
top_plate = cq.Workplane("XY").box(plate_w, plate_d, top_plate_h).translate((0, 0, bottom_plate_h + base_h + top_plate_h/2)).edges("|Z").fillet(4).edges(">Z").chamfer(2)

base = bottom_plate.union(base_body).union(top_plate)

# Cut hole for drawer
drawer_z = bottom_plate_h + base_h/2 - 4
drawer_hole = cq.Workplane("XY").box(drawer_w, drawer_d, drawer_h).translate((0, -base_d/2 + drawer_d/2, drawer_z))
base = base.cut(drawer_hole)

# ==========================================
# 2. Drawer Assembly
# ==========================================
# Drawer Box (hollowed)
drawer_box = cq.Workplane("XY").box(drawer_w - 0.5, drawer_d, drawer_h - 0.5).translate((0, -base_d/2 + drawer_d/2, drawer_z))
drawer_inside = cq.Workplane("XY").box(drawer_w - 6, drawer_d - 4, drawer_h - 3).translate((0, -base_d/2 + drawer_d/2 + 2, drawer_z + 2))
drawer = drawer_box.cut(drawer_inside)

# Drawer Front Face (with routed edges)
drawer_front = (
    cq.Workplane("XY")
    .box(drawer_w + 6, drawer_front_t, drawer_h + 6)
    .translate((0, -base_d/2 - drawer_front_t/2, drawer_z))
    .edges("|Y").fillet(3)
    .edges("<Y").chamfer(1)
)
drawer = drawer.union(drawer_front)

# Drawer Knob
knob_y = -base_d/2 - drawer_front_t
knob_base = cq.Workplane("XZ").workplane(offset=knob_y).center(0, drawer_z).circle(6).extrude(-3)
knob_stem = cq.Workplane("XZ").workplane(offset=knob_y - 3).center(0, drawer_z).circle(3).extrude(-6)
knob_head = cq.Workplane("XZ").workplane(offset=knob_y - 9).center(0, drawer_z).sphere(7)
drawer = drawer.union(knob_base).union(knob_stem).union(knob_head)

# ==========================================
# 3. Hopper Assembly
# ==========================================
hopper_z = bottom_plate_h + base_h + top_plate_h

# Main Bowl (lofted cone)
hopper_outer = cq.Workplane("XY").workplane(offset=hopper_z).circle(hopper_r1).workplane(offset=hopper_h).circle(hopper_r2).loft()
hopper_inner = cq.Workplane("XY").workplane(offset=hopper_z + 2).circle(hopper_r1 - hopper_t).workplane(offset=hopper_h + 1).circle(hopper_r2 - hopper_t).loft()
hopper = hopper_outer.cut(hopper_inner)

# Top Rim
rim = cq.Workplane("XY").workplane(offset=hopper_z + hopper_h - 4).circle(hopper_r2 + 4).extrude(4).edges(">Z").chamfer(1).edges("<Z").chamfer(1)
hopper = hopper.union(rim)
hopper = hopper.cut(cq.Workplane("XY").workplane(offset=hopper_z + hopper_h - 5).circle(hopper_r2 - hopper_t).extrude(10)) # Clean inside

# Base Ring
base_ring = cq.Workplane("XY").workplane(offset=hopper_z).circle(hopper_r1 + 6).extrude(6).edges(">Z").chamfer(2)
hopper = hopper.union(base_ring)

# Internal Ring for mechanism support
inner_ring = cq.Workplane("XY").workplane(offset=hopper_z).circle(hopper_r1 - hopper_t).extrude(15).cut(
    cq.Workplane("XY").workplane(offset=hopper_z).circle(hopper_r1 - hopper_t - 4).extrude(15)
)
hopper = hopper.union(inner_ring)

# ==========================================
# 4. Mechanism Assembly
# ==========================================
# Central Shaft & Post
shaft = cq.Workplane("XY").workplane(offset=hopper_z).circle(shaft_r).extrude(shaft_h)
center_post = cq.Workplane("XY").workplane(offset=hopper_z).circle(14).extrude(35)
shaft = shaft.union(center_post)

# Crank Handle (constructed in 3 segments to ensure clean geometry)
z_handle_base = hopper_z + shaft_h + handle_t/2

# Segment 1: Flat part over shaft
h1 = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h).center(1.5, 0).box(27, handle_w, handle_t, centered=(True, True, False))
end1 = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h).center(-12, 0).cylinder(handle_t, handle_w/2, centered=(True, True, False))

# Segment 2: Angled loft
h2 = (
    cq.Workplane("YZ")
    .workplane(offset=15)
    .center(0, z_handle_base)
    .rect(handle_w, handle_t)
    .workplane(offset=20)
    .center(0, z_handle_base + handle_lift)
    .rect(handle_w, handle_t)
    .loft()
)

# Segment 3: Flat part at the end
h3_len = handle_l - 35
h3 = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h + handle_lift).center(35 + h3_len/2, 0).box(h3_len, handle_w, handle_t, centered=(True, True, False))
end2 = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h + handle_lift).center(handle_l, 0).cylinder(handle_t, handle_w/2, centered=(True, True, False))

handle = h1.union(end1).union(h2).union(h3).union(end2)

# Nut & Top Shaft bit
nut = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h + handle_t).center(0, 0).polygon(6, 14).extrude(4)
shaft_top_bit = cq.Workplane("XY").workplane(offset=hopper_z + shaft_h + handle_t + 4).center(0, 0).circle(shaft_r).extrude(2).edges(">Z").chamfer(1)
nut = nut.union(shaft_top_bit)

# Handle Knob (turned profile)
k_x = handle_l
k_z = hopper_z + shaft_h + handle_lift + handle_t
hk_base = cq.Workplane("XY").workplane(offset=k_z).center(k_x, 0).circle(5).extrude(2)
hk_stem = cq.Workplane("XY").workplane(offset=k_z+2).center(k_x, 0).circle(3).extrude(6)
hk_mid = cq.Workplane("XY").workplane(offset=k_z+8).center(k_x, 0).circle(8).extrude(3).edges(">Z").chamfer(1).edges("<Z").chamfer(1)
hk_top = cq.Workplane("XY").workplane(offset=k_z+11).center(k_x, 0).sphere(7)
handle_knob = hk_base.union(hk_stem).union(hk_mid).union(hk_top)

# ==========================================
# 5. Details
# ==========================================
# Front Name Plaque
plaque_y = -base_d/2
plaque_z = bottom_plate_h + base_h - 8
plaque_base = cq.Workplane("XZ").workplane(offset=-plaque_y).center(0, plaque_z).ellipse(24, 9).extrude(-1.5)
plaque_border = cq.Workplane("XZ").workplane(offset=-plaque_y).center(0, plaque_z).ellipse(24, 9).extrude(-2.5).cut(
    cq.Workplane("XZ").workplane(offset=-plaque_y).center(0, plaque_z).ellipse(22, 7).extrude(-3)
)
plaque = plaque_base.union(plaque_border)

# ==========================================
# Combine All
# ==========================================
result = (
    base
    .union(drawer)
    .union(hopper)
    .union(shaft)
    .union(handle)
    .union(nut)
    .union(handle_knob)
    .union(plaque)
)