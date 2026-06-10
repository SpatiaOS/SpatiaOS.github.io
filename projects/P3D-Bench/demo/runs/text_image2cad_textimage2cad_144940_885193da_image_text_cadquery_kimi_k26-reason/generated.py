import cadquery as cq
import math

# =============================================================================
# Parameters
# =============================================================================
# Triangular linkage bracket vertices (YZ plane, thickness along X)
tri_v1_y = -150.0
tri_v1_z = 150.0
tri_v2_y = 200.0
tri_v2_z = 150.0
tri_v3_y = -150.0
tri_v3_z = -200.0
tri_thickness = 30.0

# Boss / hole data
boss_od = 60.0
boss_len = 100.0
boss_hole_r = 20.0          # Ø40 mm

clevis_od = 45.0
clevis_len = 20.0
clevis_hole_r = 15.0        # Ø30 mm

# U-shaped link arm
link_x = 80.0
link_boss_od = 60.0
link_boss_len = 100.0
link_tube_r = 25.0

# Pins
pin40_r = 20.0
pin40_len = 120.0
pin30_r = 15.0
pin30_len_long = 100.0
pin30_len_short = 90.0

# Pulley disc
pulley_x = -80.0
pulley_disc_r = 115.0
pulley_disc_t = 61.0
pulley_hub_r = 70.0
pulley_hub_t = 30.0
pulley_bolt_r = 7.0         # Ø14 mm
pulley_bolt_pcd = 100.0
pulley_notch_r = 4.0
pulley_notch_n = 30

# Flat bar
bar_len = 600.0
bar_width = 50.0
bar_thick = 10.0
bar_z = 260.0

# =============================================================================
# Helper: cylindrical boss with coaxial hole
# =============================================================================
def add_boss(part, x, y, z, outer_r, inner_r, length):
    boss = cq.Workplane("YZ").circle(outer_r).extrude(length / 2, both=True).translate((x, y, z))
    hole = cq.Workplane("YZ").circle(inner_r).extrude(length / 2 + 1, both=True).translate((x, y, z))
    return part.union(boss).cut(hole)

# =============================================================================
# Triangular linkage bracket
# =============================================================================
tri = (
    cq.Workplane("YZ")
    .moveTo(tri_v1_y, tri_v1_z)
    .lineTo(tri_v2_y, tri_v2_z)
    .lineTo(tri_v3_y, tri_v3_z)
    .close()
    .extrude(tri_thickness / 2, both=True)
)

# Central open web
web = (
    cq.Workplane("YZ")
    .moveTo(tri_v1_y * 0.45, tri_v1_z * 0.45)
    .lineTo(tri_v2_y * 0.45, tri_v2_z * 0.45)
    .lineTo(tri_v3_y * 0.45, tri_v3_z * 0.45)
    .close()
    .extrude(tri_thickness / 2 + 1, both=True)
)
tri = tri.cut(web)

# Upper vertex bosses (Ø40) and lower-left clevis boss (Ø30)
tri = add_boss(tri, 0, tri_v1_y, tri_v1_z, boss_od / 2, boss_hole_r, boss_len)
tri = add_boss(tri, 0, tri_v2_y, tri_v2_z, boss_od / 2, boss_hole_r, boss_len)
tri = add_boss(tri, 0, tri_v3_y, tri_v3_z, clevis_od / 2, clevis_hole_r, clevis_len)

# =============================================================================
# U-shaped curved link arm
# =============================================================================
# 3D spline path arching over the bracket
path_pts = [
    cq.Vector(link_x - link_boss_len / 2, tri_v1_y, tri_v1_z),
    cq.Vector(link_x, tri_v1_y, tri_v1_z),
    cq.Vector(link_x + 40, tri_v1_y, tri_v1_z + 100),
    cq.Vector(link_x + 40, tri_v2_y, tri_v2_z + 100),
    cq.Vector(link_x, tri_v2_y, tri_v2_z),
    cq.Vector(link_x - link_boss_len / 2, tri_v2_y, tri_v2_z),
]
path_wire = cq.Wire.assembleEdges([cq.Edge.makeSpline(path_pts)])

# Sweep circular profile along the spline
link_arm = (
    cq.Workplane("YZ", origin=(link_x - link_boss_len / 2, tri_v1_y, tri_v1_z))
    .circle(link_tube_r)
    .sweep(path_wire, isFrenet=True)
)

# Cylindrical end bosses with Ø40 through-holes
link_arm = add_boss(link_arm, link_x, tri_v1_y, tri_v1_z, link_boss_od / 2, boss_hole_r, link_boss_len)
link_arm = add_boss(link_arm, link_x, tri_v2_y, tri_v2_z, link_boss_od / 2, boss_hole_r, link_boss_len)

# =============================================================================
# Pins
# =============================================================================
def make_pin(x, y, z, r, length):
    return cq.Workplane("YZ").circle(r).extrude(length / 2, both=True).translate((x, y, z))

# Four Ø40 pins — two at the bracket, two at the link arm
pin_b1 = make_pin(0, tri_v1_y, tri_v1_z, pin40_r, pin40_len)
pin_b2 = make_pin(0, tri_v2_y, tri_v2_z, pin40_r, pin40_len)
pin_l1 = make_pin(link_x, tri_v1_y, tri_v1_z, pin40_r, pin40_len)
pin_l2 = make_pin(link_x, tri_v2_y, tri_v2_z, pin40_r, pin40_len)

# Lower Ø30 pin at the bracket clevis (pulley axle)
pin_lower = make_pin(0, tri_v3_y, tri_v3_z, pin30_r, pin30_len_long)

# Two shorter Ø30 pins inferred inside the link-arm bosses
pin_h1 = make_pin(link_x, tri_v1_y, tri_v1_z, pin30_r, pin30_len_short)
pin_h2 = make_pin(link_x, tri_v2_y, tri_v2_z, pin30_r, pin30_len_short)

# =============================================================================
# Pulley disc
# =============================================================================
# Main disc
pulley = (
    cq.Workplane("YZ")
    .circle(pulley_disc_r)
    .extrude(pulley_disc_t / 2, both=True)
    .translate((pulley_x, tri_v3_y, tri_v3_z))
)

# Stepped hub on the outboard face (away from bracket)
hub = (
    cq.Workplane("YZ")
    .circle(pulley_hub_r)
    .extrude(-pulley_hub_t)
    .translate((pulley_x - pulley_disc_t / 2, tri_v3_y, tri_v3_z))
)
pulley = pulley.union(hub)

# Five bolt-circle through-holes
bolt_holes = (
    cq.Workplane("YZ", origin=(pulley_x, tri_v3_y, tri_v3_z))
    .polarArray(pulley_bolt_pcd / 2, 0, 360, 5)
    .circle(pulley_bolt_r)
    .extrude(200, both=True)
)
pulley = pulley.cut(bolt_holes)

# Small periodic rim notches (approximated as spherical cuts)
for i in range(pulley_notch_n):
    angle = math.radians(i * 360.0 / pulley_notch_n)
    sy = tri_v3_y + pulley_disc_r * math.cos(angle)
    sz = tri_v3_z + pulley_disc_r * math.sin(angle)
    notch = cq.Solid.makeSphere(pulley_notch_r).translate((pulley_x, sy, sz))
    pulley = pulley.cut(notch)

# =============================================================================
# Flat bar (grounded, spans the top)
# =============================================================================
flat_bar = (
    cq.Workplane("XY")
    .box(bar_width, bar_len, bar_thick)
    .translate((0, 25.0, bar_z + bar_thick / 2))
)

# =============================================================================
# Inferred right-side support / frame (visible in render, null extraction)
# =============================================================================
support = cq.Workplane("XY").box(60, 80, 500).translate((0, 230, 25))
foot = cq.Workplane("XY").box(120, 100, 40).translate((0, 210, -220))
support = support.union(foot)

# =============================================================================
# Unified assembly
# =============================================================================
result = (
    tri
    .union(link_arm)
    .union(pin_b1)
    .union(pin_b2)
    .union(pin_l1)
    .union(pin_l2)
    .union(pin_lower)
    .union(pin_h1)
    .union(pin_h2)
    .union(pulley)
    .union(flat_bar)
    .union(support)
)