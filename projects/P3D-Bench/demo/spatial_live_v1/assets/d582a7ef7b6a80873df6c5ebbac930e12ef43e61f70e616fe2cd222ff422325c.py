import cadquery as cq
from math import sqrt

# ---------------- Parameters ----------------
# Shaft bar (backbone rod with disc bosses)
shaft_len   = 438.0          # overall length of backbone rod
shaft_r     = 3.0            # 6 mm diameter rod
station_ys  = (70.0, 170.0, 270.0, 370.0)   # crank station positions along Y
throw_y     = 18.0           # in-plane Y offset of disc centre from station
throw_z     = 25.0           # in-plane Z offset (crank throw height)
disc_r      = 15.0           # 30 mm disc bosses
disc_t      = 14.0           # disc thickness (along X)
arm_w       = 10.0           # bracket arm width
arm_t       = 10.0           # bracket arm thickness (along X)
arm_slot_w  = 3.0            # narrow slot in bracket arm

# Connecting rod (I-beam link, inferred from image)
rod_len     = 115.0          # centre distance big-end to small-end
rod_t       = 12.0           # rod thickness along X
big_out_r   = 22.0           # big-end eye outer radius
small_out_r = 10.0           # small-end eye outer radius
shank_w     = 14.0           # I-beam shank width
slot_w      = 4.0            # visible narrow slot through shank web

# Piston
pist_r      = 25.0           # 50 mm outer diameter
pist_h      = 40.0           # overall height
skirt_bore_r    = 20.0       # 40 mm lower skirt bore
skirt_bore_dep  = 25.0
pocket_r        = 15.0       # 30 mm blind pocket under crown
pocket_dep      = 10.0
pin_r           = 6.0        # 12 mm wrist-pin bore
groove_minor    = 1.2        # circumferential ring groove (toroidal blend)
pin_above_skirt = 10.0       # wrist pin height above skirt bottom

# Spacer ring
spacer_or   = 27.28          # 54.56 mm OD
spacer_t    = 5.0

# Bushing
bush_or     = 4.0            # 8 mm OD
bush_len    = 5.0

# ---------------- Derived ----------------
pin_z = throw_z + sqrt(rod_len**2 - throw_y**2)   # wrist-pin axis height
z_b   = pin_z - pin_above_skirt                   # piston skirt bottom height

solids = []

# ---------------- Helpers ----------------
def yz_cyl(y, z, r, t):
    """Cylinder with axis along X, centred on the YZ plane."""
    return cq.Workplane("YZ").moveTo(y, z).circle(r).extrude(t / 2.0, both=True).val()

def rect_between(p0, p1, w):
    """2D rectangle corners (in YZ coords) from p0 to p1 with width w."""
    dy, dz = p1[0] - p0[0], p1[1] - p0[1]
    ln = sqrt(dy * dy + dz * dz)
    px, py = -dz / ln * w / 2.0, dy / ln * w / 2.0
    return [(p0[0] + px, p0[1] + py), (p1[0] + px, p1[1] + py),
            (p1[0] - px, p1[1] - py), (p0[0] - px, p0[1] - py)]

def yz_prism(pts, t):
    """Extruded prism from a YZ-plane polygon, centred on X."""
    return cq.Workplane("YZ").polyline(pts).close().extrude(t / 2.0, both=True).val()

# ---------------- Shaft bar: five rod segments ----------------
bounds = [0.0]
for y in station_ys:
    bounds += [y - throw_y, y + 2.0]
bounds += [shaft_len]
for y0, y1 in zip(bounds[0::2], bounds[1::2]):
    solids.append(cq.Solid.makeCylinder(shaft_r, y1 - y0,
                                        cq.Vector(0, y0, 0), cq.Vector(0, 1, 0)))

# ---------------- Bushing at far end of shaft ----------------
bush = cq.Solid.makeCylinder(bush_or, bush_len, cq.Vector(0, 0, 0), cq.Vector(0, 1, 0))
bush = bush.cut(cq.Solid.makeCylinder(shaft_r, bush_len + 1.0,
                                      cq.Vector(0, -0.5, 0), cq.Vector(0, 1, 0)))
solids.append(bush)

# ---------------- Per-station parts ----------------
for y in station_ys:
    a_pt = (y - throw_y, throw_z)          # disc / big-end centre
    b_pt = (y, pin_z)                      # wrist-pin / small-end centre
    s_pt = (y + 2.0, 0.0)                  # bracket arm root on shaft axis

    # Disc boss + bracket arm (integral with shaft bar)
    solids.append(yz_cyl(a_pt[0], a_pt[1], disc_r, disc_t))
    arm = yz_prism(rect_between(s_pt, a_pt, arm_w), arm_t)
    mid = ((s_pt[0] + a_pt[0]) / 2.0, (s_pt[1] + a_pt[1]) / 2.0)
    d_arm = (a_pt[0] - s_pt[0], a_pt[1] - s_pt[1])
    la = sqrt(d_arm[0]**2 + d_arm[1]**2)
    u = (d_arm[0] / la, d_arm[1] / la)
    slot_pts = rect_between((mid[0] - u[0] * 6, mid[1] - u[1] * 6),
                            (mid[0] + u[0] * 6, mid[1] + u[1] * 6), arm_slot_w)
    arm = arm.cut(yz_prism(slot_pts, arm_t + 2.0))
    solids.append(arm)

    # Connecting rod: big-end eye, I-beam shank with slot, small-end eye
    d = (b_pt[0] - a_pt[0], b_pt[1] - a_pt[1])
    rod = yz_cyl(a_pt[0], a_pt[1], big_out_r, rod_t)
    rod = rod.fuse(yz_cyl(b_pt[0], b_pt[1], small_out_r, rod_t))
    rod = rod.fuse(yz_prism(rect_between(a_pt, b_pt, shank_w), rod_t))
    rod = rod.cut(yz_prism(rect_between((a_pt[0] + u[0] * 0 + d[0] * 0.30,
                                         a_pt[1] + d[1] * 0.30),
                                        (a_pt[0] + d[0] * 0.75,
                                         a_pt[1] + d[1] * 0.75), slot_w), rod_t + 2.0))
    rod = rod.cut(yz_cyl(a_pt[0], a_pt[1], disc_r, rod_t + 2.0))   # coaxial fit on disc
    rod = rod.cut(yz_cyl(b_pt[0], b_pt[1], pin_r, rod_t + 2.0))    # wrist-pin bore
    solids.append(rod)

    # Piston: hollow cylinder with skirt bore, crown pocket, pin bore, ring groove
    pist = (cq.Workplane("XY").workplane(offset=z_b)
            .circle(pist_r).extrude(pist_h))
    pist = pist.cut(cq.Workplane("XY").workplane(offset=z_b)
                    .circle(skirt_bore_r).extrude(skirt_bore_dep))
    pist = pist.cut(cq.Workplane("XY").workplane(offset=z_b + skirt_bore_dep)
                    .circle(pocket_r).extrude(pocket_dep))
    pist = pist.cut(cq.Workplane("YZ").moveTo(y, pin_z)
                    .circle(pin_r).extrude(30.0, both=True))
    groove = cq.Solid.makeTorus(pist_r, groove_minor,
                                cq.Vector(0, y, z_b + 36.0), cq.Vector(0, 0, 1))
    pist = pist.cut(groove)
    solids.append(pist.val())

    # Spacer ring seated on barrel below the crown groove
    solids.append(cq.Workplane("XY").workplane(offset=z_b + 29.0)
                  .circle(spacer_or).circle(pist_r).extrude(spacer_t).val())

# ---------------- Fuse unified assembly ----------------
fused = solids[0].fuse(*solids[1:]).clean()
result = cq.Workplane("XY").add(fused)