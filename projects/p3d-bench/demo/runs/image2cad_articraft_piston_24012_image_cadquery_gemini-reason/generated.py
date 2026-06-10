import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Piston Parameters
piston_dia = 80.0
piston_height = 70.0
piston_wall_thick = 6.0
pin_dia = 22.0
pin_offset_z = 30.0  # Distance from bottom of piston to pin center

# Ring Grooves
ring_width = 2.0
ring_depth = 3.5
ring_pitch = 5.0
num_rings = 3
ring_start_offset = 12.0 # Distance from top of piston to first ring

# Connecting Rod Parameters
rod_length = 160.0  # Center to center distance (Big end to Small end)
rod_width_top = 24.0
rod_width_bottom = 34.0
rod_thickness = 12.0
web_thickness = 3.5

# Small End (Upper)
se_outer_dia = 34.0
se_width = 28.0

# Big End (Lower)
be_inner_dia = 48.0
be_outer_dia = 68.0
be_width = 28.0
lug_height = 14.0
lug_width = 22.0
bolt_spacing = 74.0
bolt_dia = 8.0
bolt_head_hex = 13.0 # Flat-to-flat dimension

# ==========================================
# 1. Piston Modeling
# ==========================================
p_base_z = rod_length - pin_offset_z

# Main solid body
piston = (
    cq.Workplane("XY")
    .workplane(offset=p_base_z)
    .circle(piston_dia / 2)
    .extrude(piston_height)
)

# Hollow interior from the bottom
piston_hollow = (
    cq.Workplane("XY")
    .workplane(offset=p_base_z - 1)
    .circle(piston_dia / 2 - piston_wall_thick)
    .extrude(piston_height - piston_wall_thick + 1)
)
piston = piston.cut(piston_hollow)

# Wrist pin hole through the sides
pin_hole = (
    cq.Workplane("YZ")
    .workplane(offset=-piston_dia)
    .center(0, rod_length)
    .circle(pin_dia / 2)
    .extrude(piston_dia * 2)
)
piston = piston.cut(pin_hole)

# Side recesses for the wrist pin
recess_depth = 3.0
recess1 = (
    cq.Workplane("YZ")
    .workplane(offset=piston_dia/2 - recess_depth)
    .center(0, rod_length)
    .circle(pin_dia/2 + 6)
    .extrude(recess_depth * 2)
)
piston = piston.cut(recess1)

recess2 = (
    cq.Workplane("YZ")
    .workplane(offset=-piston_dia/2 - recess_depth)
    .center(0, rod_length)
    .circle(pin_dia/2 + 6)
    .extrude(recess_depth * 2)
)
piston = piston.cut(recess2)

# Piston ring grooves
for i in range(num_rings):
    z_pos = p_base_z + piston_height - ring_start_offset - i * ring_pitch
    groove = (
        cq.Workplane("XY")
        .workplane(offset=z_pos)
        .circle(piston_dia / 2 + 1)
        .circle(piston_dia / 2 - ring_depth)
        .extrude(-ring_width)
    )
    piston = piston.cut(groove)

# Top surface features (depression and slot)
top_z = p_base_z + piston_height
top_dep = cq.Workplane("XY").workplane(offset=top_z).circle(piston_dia * 0.15).extrude(-1.0)
top_slot = cq.Workplane("XY").workplane(offset=top_z).rect(1.0, piston_dia + 2).extrude(-1.0)
piston = piston.cut(top_dep).cut(top_slot)

# ==========================================
# 2. Connecting Rod - Small End
# ==========================================
small_end = (
    cq.Workplane("YZ")
    .workplane(offset=-se_width/2)
    .center(0, rod_length)
    .circle(se_outer_dia / 2)
    .extrude(se_width)
)
small_end_hole = (
    cq.Workplane("YZ")
    .workplane(offset=-se_width)
    .center(0, rod_length)
    .circle(pin_dia / 2)
    .extrude(se_width * 2)
)
small_end = small_end.cut(small_end_hole)

# ==========================================
# 3. Connecting Rod - Big End (Split)
# ==========================================
# Main cylinder and side lugs
be_cyl = cq.Workplane("YZ").workplane(offset=-be_width/2).center(0,0).circle(be_outer_dia/2).extrude(be_width)
lugs_block = cq.Workplane("XY").workplane(offset=-lug_height).center(0,0).rect(be_width, bolt_spacing + lug_width).extrude(lug_height * 2)
be_solid = be_cyl.union(lugs_block)

# Inner bearing hole
be_hole = cq.Workplane("YZ").workplane(offset=-be_width).center(0,0).circle(be_inner_dia/2).extrude(be_width*2)
be_solid = be_solid.cut(be_hole)

# Bolt holes
bolt_hole1 = cq.Workplane("XY").workplane(offset=-50).center(0, bolt_spacing/2).circle(bolt_dia/2).extrude(100)
bolt_hole2 = cq.Workplane("XY").workplane(offset=-50).center(0, -bolt_spacing/2).circle(bolt_dia/2).extrude(100)
be_solid = be_solid.cut(bolt_hole1).cut(bolt_hole2)

# Split into upper half and lower cap
box_upper = cq.Workplane("XY").center(0,0).rect(200, 200).extrude(100)
box_lower = cq.Workplane("XY").workplane(offset=-100).center(0,0).rect(200, 200).extrude(100)

be_upper = be_solid.intersect(box_upper)
be_lower = be_solid.intersect(box_lower).translate((0, 0, -0.8)) # Slight gap for realism

# ==========================================
# 4. Connecting Rod - Truss Body
# ==========================================
z_bot_rod = be_outer_dia/2 - 2
z_top_rod = rod_length - se_outer_dia/2 + 2

# Base solid shape
rod_solid = (
    cq.Workplane("YZ")
    .workplane(offset=-rod_thickness/2)
    .center(0, 0)
    .moveTo(-rod_width_bottom/2, z_bot_rod)
    .lineTo(rod_width_bottom/2, z_bot_rod)
    .lineTo(rod_width_top/2, z_top_rod)
    .lineTo(-rod_width_top/2, z_top_rod)
    .close()
    .extrude(rod_thickness)
)

# Cut pockets to form an I-beam profile
pocket_depth = (rod_thickness - web_thickness) / 2.0
pm = 5.0 # Pocket margin
w_bot_in = rod_width_bottom - pm*2
w_top_in = rod_width_top - pm*2
z_bot_in = z_bot_rod + pm
z_top_in = z_top_rod - pm

def make_pocket_prof(offset):
    return (
        cq.Workplane("YZ")
        .workplane(offset=offset)
        .center(0, 0)
        .moveTo(-w_bot_in/2, z_bot_in)
        .lineTo(w_bot_in/2, z_bot_in)
        .lineTo(w_top_in/2, z_top_in)
        .lineTo(-w_top_in/2, z_top_in)
        .close()
    )

rod_body = rod_solid.cut(make_pocket_prof(web_thickness/2).extrude(pocket_depth + 5))
rod_body = rod_body.cut(make_pocket_prof(-web_thickness/2).extrude(-(pocket_depth + 5)))

# Cut alternating triangles to create the lattice/truss web
num_triangles = 7
rib_w = 3.0
truss_start_z = z_bot_in + rib_w
truss_end_z = z_top_in - rib_w
tri_h = (truss_end_z - truss_start_z) / num_triangles

truss_cutouts = cq.Workplane("YZ").workplane(offset=-rod_thickness)

for i in range(num_triangles):
    z_base = truss_start_z + i * tri_h + rib_w/2
    z_top = z_base + tri_h - rib_w
    
    # Calculate inner width at specific heights
    def get_inner_w(z):
        t = (z - z_bot_in) / (z_top_in - z_bot_in)
        return w_bot_in - t * (w_bot_in - w_top_in)
        
    w_base = get_inner_w(z_base) - rib_w*2
    w_top = get_inner_w(z_top) - rib_w*2
    
    if w_base > 1 and w_top > 1:
        if i % 2 == 0:
            pts = [(-w_base/2, z_base), (w_base/2, z_base), (0, z_top)]
        else:
            pts = [(-w_top/2, z_top), (w_top/2, z_top), (0, z_base)]
        truss_cutouts = truss_cutouts.polyline(pts).close()

rod_body = rod_body.cut(truss_cutouts.extrude(rod_thickness * 2))

# ==========================================
# 5. Hardware (Bolts & Wrist Pin)
# ==========================================
hex_dia = bolt_head_hex * 1.155 # Circumscribed diameter for polygon

def create_bolt(y_offset):
    shaft = cq.Workplane("XY").workplane(offset=-lug_height - 10).center(0, y_offset).circle(bolt_dia/2).extrude(lug_height * 2 + 20)
    head = cq.Workplane("XY").workplane(offset=-lug_height - 0.8).center(0, y_offset).polygon(6, hex_dia).extrude(-6)
    nut = cq.Workplane("XY").workplane(offset=lug_height).center(0, y_offset).polygon(6, hex_dia).extrude(6)
    return shaft.union(head).union(nut)

bolts = create_bolt(bolt_spacing/2).union(create_bolt(-bolt_spacing/2))

wrist_pin = (
    cq.Workplane("YZ")
    .workplane(offset=-piston_dia/2 + 1)
    .center(0, rod_length)
    .circle(pin_dia/2 - 0.2)
    .extrude(piston_dia - 2)
)

# ==========================================
# Assembly
# ==========================================
# Combine all parts into a single compound result
result = piston
for part in [small_end, rod_body, be_upper, be_lower, bolts, wrist_pin]:
    result = result.union(part)