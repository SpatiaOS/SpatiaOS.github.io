import cadquery as cq
from cadquery import Solid, Vector, Workplane

# ---------------- Global parameters ----------------
BRANCH_ANGLE = 22.0            # kink angle of the angle-joint branch (deg)
N_TEETH = 36                   # spline / serration tooth count
SPLINE_R_ROOT = 8.24           # spline root radius
SPLINE_R_TIP = 8.62            # spline tip radius
JOURNAL_R = 10.0               # smooth pin journal radius
SHANK_R = 11.08                # shaft-yoke shank radius
HUB_R = 14.0                   # yoke hub outer radius
EAR_HOLE_R = 4.0               # 8 mm cross-pin passages
TRUNNION_R = 3.9               # cross (spider) trunnion radius
RADIAL_HOLE_R = 3.0            # 6 mm retention holes in pins
CSK_HOLE_R = 9.74              # 19.48 mm countersunk passage

# ---------------- Helpers ----------------
def splined_shaft_sec(x0, x1, r_root=SPLINE_R_ROOT, r_tip=SPLINE_R_TIP):
    """External straight spline segment along +X."""
    L = x1 - x0
    core = Solid.makeCylinder(r_root, L, Vector(x0, 0, 0), Vector(1, 0, 0))
    tooth_w = 2 * 3.14159 * r_root / N_TEETH * 0.45
    for i in range(N_TEETH):
        t = Solid.makeBox(L, tooth_w, r_tip - r_root + 0.1,
                          Vector(x0, -tooth_w / 2, r_root - 0.1))
        t = t.rotate(Vector(0, 0, 0), Vector(1, 0, 0), i * 360.0 / N_TEETH)
        core = core.fuse(t)
    return core

def splined_bore_cut(x0, x1):
    """Cutter producing an internal splined bore along +X."""
    return splined_shaft_sec(x0 - 1.0, x1 + 1.0)

def ear_plate(x0, x1, hx, axis, c_in, c_out, r_end, hole_r=EAR_HOLE_R):
    """Rounded fork ear plate; axis = hole direction ('Y' or 'Z')."""
    if axis == 'Y':
        plate = Solid.makeBox(x1 - x0, c_out - c_in, 2 * r_end,
                              Vector(x0, c_in, -r_end))
        rnd = Solid.makeCylinder(r_end, c_out - c_in, Vector(hx, c_in, 0), Vector(0, 1, 0))
        hole = Solid.makeCylinder(hole_r, (c_out - c_in) + 4, Vector(hx, c_in - 2, 0), Vector(0, 1, 0))
    else:
        plate = Solid.makeBox(x1 - x0, 2 * r_end, c_out - c_in,
                              Vector(x0, -r_end, c_in))
        rnd = Solid.makeCylinder(r_end, c_out - c_in, Vector(hx, 0, c_in), Vector(0, 0, 1))
        hole = Solid.makeCylinder(hole_r, (c_out - c_in) + 4, Vector(hx, 0, c_in - 2), Vector(0, 0, 1))
    return plate.fuse(rnd).cut(hole)

def cross_spider(cx):
    """U-joint cross / spider centred at (cx,0,0)."""
    body = Solid.makeBox(12, 12, 12, Vector(cx - 6, -6, -6))
    for d in (Vector(0, 1, 0), Vector(0, -1, 0), Vector(0, 0, 1), Vector(0, 0, -1)):
        body = body.fuse(Solid.makeCylinder(TRUNNION_R, 17, Vector(cx, 0, 0), d))
    return body

# ---------------- Branch group (angle-joint end, built along +X then rotated) ----------------
# Serrated angle-joint: semi-circular fork cheeks
serr_fork = ear_plate(-16, 12, 0, 'Z', 6, 14, 9).fuse(ear_plate(-16, 12, 0, 'Z', -14, -6, 9))
# Serrated cylindrical interface zone
serr_zone = splined_shaft_sec(12, 34)
# Rectangular clevis block with blind pin recess
clevis = Solid.makeBox(28, 24, 24, Vector(34, -12, -12))
clevis = clevis.cut(Solid.makeCylinder(SPLINE_R_TIP, 22, Vector(34, 0, 0), Vector(1, 0, 0)))
# Countersunk 19.48 mm through-hole in clevis web
csk = Solid.makeCylinder(CSK_HOLE_R, 24, Vector(48, 0, -12), Vector(0, 0, 1))
csk = csk.fuse(Solid.makeCone(CSK_HOLE_R, CSK_HOLE_R + 4, 4, Vector(48, 0, 12), Vector(0, 0, -1)))
clevis = clevis.cut(csk)
# Side flange plate with small through-hole
flange = Solid.makeBox(24, 4, 28, Vector(36, -16, -14))
flange = flange.cut(Solid.makeCylinder(EAR_HOLE_R, 8, Vector(48, -18, 0), Vector(0, 1, 0)))
serrated_joint = serr_fork.fuse(serr_zone).fuse(clevis).fuse(flange)

# Splined pin #1: spline into clevis recess + exposed journal with radial holes
pin1 = splined_shaft_sec(36, 58)
pin1 = pin1.fuse(Solid.makeCylinder(JOURNAL_R, 50, Vector(58, 0, 0), Vector(1, 0, 0)))
pin1 = pin1.cut(Solid.makeCylinder(RADIAL_HOLE_R, 40, Vector(72, 0, -20), Vector(0, 0, 1)))
pin1 = pin1.cut(Solid.makeCylinder(RADIAL_HOLE_R, 40, Vector(92, -20, 0), Vector(0, 1, 0)))
branch = serrated_joint.fuse(pin1)
branch = branch.rotate(Vector(0, 0, 0), Vector(0, 1, 0), 180.0 + BRANCH_ANGLE)

# ---------------- Main chain along +X ----------------
cross1 = cross_spider(0.0)

# Universal-joint yoke #1: fork A at knuckle 1, hub, fork B prongs over shaft spline
yoke1 = ear_plate(-16, 14, 0, 'Y', 10, 18, 10).fuse(ear_plate(-16, 14, 0, 'Y', -18, -10, 10))
hub1 = Solid.makeCylinder(HUB_R, 44, Vector(14, 0, 0), Vector(1, 0, 0))
hub1 = hub1.cut(splined_bore_cut(14, 58))
yoke1 = yoke1.fuse(hub1)
yoke1 = yoke1.fuse(ear_plate(58, 86, 72, 'Z', 11, 19, 9)).fuse(ear_plate(58, 86, 72, 'Z', -19, -11, 9))

# Splined shaft-yoke: spline end in yoke1 hub, shank, fork at knuckle 2
shaft = splined_shaft_sec(40, 103)
shaft = shaft.fuse(Solid.makeCylinder(SHANK_R, 70, Vector(103, 0, 0), Vector(1, 0, 0)))
shaft = shaft.fuse(ear_plate(173, 201, 187, 'Y', 3, 10, 9)).fuse(ear_plate(173, 201, 187, 'Y', -10, -3, 9))

cross2 = cross_spider(187.0)

# Universal-joint yoke #2: orthogonal fork at knuckle 2 + splined-bore hub
yoke2 = ear_plate(173, 201, 187, 'Z', 10, 18, 10).fuse(ear_plate(173, 201, 187, 'Z', -18, -10, 10))
hub2 = Solid.makeCylinder(HUB_R, 39, Vector(201, 0, 0), Vector(1, 0, 0))
hub2 = hub2.cut(splined_bore_cut(201, 240))
yoke2 = yoke2.fuse(hub2)

# Splined pin #2: spline in yoke2 hub + exposed journal with radial holes
pin2 = splined_shaft_sec(222, 244)
pin2 = pin2.fuse(Solid.makeCylinder(JOURNAL_R, 50, Vector(244, 0, 0), Vector(1, 0, 0)))
pin2 = pin2.cut(Solid.makeCylinder(RADIAL_HOLE_R, 40, Vector(262, 0, -20), Vector(0, 0, 1)))
pin2 = pin2.cut(Solid.makeCylinder(RADIAL_HOLE_R, 40, Vector(282, -20, 0), Vector(0, 1, 0)))

# Slender locating shim (thin wedge pin) seated under the shank
shim = Solid.makeBox(115, 1.3, 0.9, Vector(103, -0.65, -SHANK_R - 0.9))

# ---------------- Unite assembly ----------------
fused = branch.fuse(cross1).fuse(yoke1).fuse(shaft).fuse(cross2).fuse(yoke2).fuse(pin2).fuse(shim)
result = Workplane(obj=fused)