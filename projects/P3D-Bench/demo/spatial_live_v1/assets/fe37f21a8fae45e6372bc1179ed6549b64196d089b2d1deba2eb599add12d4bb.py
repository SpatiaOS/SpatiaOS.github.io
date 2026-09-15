import cadquery as cq
import math

# ==================================================================
# 6-axis articulated industrial robot arm
# (recreated from the reference image; dimensions in mm, estimated
# from the proportions visible in the picture)
#
# Main features interpreted from the image:
#  - rectangular base plate with corner notches, side mounting tabs,
#    a hexagonal front boss, a slotted pad and small drilled holes
#  - 3-step circular turntable (axis J1)
#  - stepped/wedge-shaped main body casting
#  - large shoulder joint discs (J2) with concentric rings and a
#    hexagonal motor shaft sticking out of the visible side
#  - long cylindrical upper arm inclined ~32 deg
#  - ringed elbow (J3) with two small vertical connector rods
#  - stepped wrist (J4-J6) with bellows rings and a forked tool tip
#  - parallel linkage bar running beside the arm
# ==================================================================

# ------------------------- helpers ---------------------------------
def cyl_between(p1, p2, r):
    """Cylinder spanning points p1 -> p2 with radius r (as Workplane)."""
    v1, v2 = cq.Vector(*p1), cq.Vector(*p2)
    d = v2 - v1
    solid = cq.Solid.makeCylinder(r, d.Length, v1, d.normalized())
    return cq.Workplane("XY").newObject([solid])


def along(origin, direction, s):
    """Point at distance s from origin along a unit direction."""
    return (origin[0] + s * direction[0],
            origin[1] + s * direction[1],
            origin[2] + s * direction[2])


# ------------------------- parameters ------------------------------
# Base plate
BASE_L, BASE_W, BASE_T = 220.0, 180.0, 22.0
CORNER_NOTCH = 30.0
TAB_EXT, TAB_W, TAB_HOLE_R = 18.0, 36.0, 4.0
BOSS_POS, BOSS_DIA, BOSS_H = (15.0, -72.0), 48.0, 12.0
PAD_POS, PAD_SIZE = (-90.0, 28.0), (26.0, 46.0, 11.0)

# Turntable / J1: (radius, height) of the three stacked discs
TT_DISCS = [(68.0, 14.0), (59.0, 14.0), (50.0, 10.0)]

# Main body casting: side (XZ) profile extruded across Y
BODY_W = 76.0
BODY_PROFILE = [
    (52.0, 30.0), (52.0, 74.0),      # front face + first step
    (40.0, 74.0), (40.0, 102.0),     # second step
    (29.0, 102.0), (29.0, 126.0),    # third step
    (10.0, 190.0),                   # sloped shoulder
    (-24.0, 192.0),                  # top
    (-48.0, 30.0),                   # sloped back
]

# Shoulder joint J2 (axis along Y)
J2_C = (0.0, 0.0, 135.0)
J2_R = 57.0
J2_BOSS = 20.0                       # boss width on each side of body

# Upper arm: cylinder 32 deg above horizontal, pointing towards -X
ARM_R = 24.0
ARM_DIR = (-math.cos(math.radians(32.0)), 0.0, math.sin(math.radians(32.0)))
ARM_S0, ARM_S1 = -20.0, 246.0        # start/end along the arm axis
# collars + elbow housing along the arm axis (radius, s_start, s_end)
ARM_FEATURES = [(28.0, 206.0, 213.0),
                (30.0, 217.0, 224.0),
                (30.0, 228.0, 235.0),
                (32.0, 235.0, 260.0)]

# Wrist: bent at the elbow, running 15 deg below horizontal
WRIST_DIR = (-math.cos(math.radians(15.0)), 0.0, -math.sin(math.radians(15.0)))
WRIST_S0 = 252.0                     # bend point measured along arm axis
WRIST_SEGS = [(25.0, -10.0, 26.0),   # wrist housing
              (17.0, 26.0, 66.0),    # mid section
              (12.0, 66.0, 92.0),    # front section
              (10.0, 92.0, 118.0),   # stem under the bellows
              (8.0, 118.0, 126.0)]   # neck
WRIST_RINGS = [(27.0, 26.0, 32.0),   # collar
               (19.0, 66.0, 71.0),   # collar
               (13.5, 92.0, 95.5),   # bellows rings
               (13.5, 98.5, 102.0),
               (13.5, 105.0, 108.5),
               (18.0, 110.0, 118.0), # tool flange
               (9.0, 126.0, 134.0)]  # fork collar
FORK_S = (134.0, 152.0)
FORK_GAP, FORK_R = 6.0, 3.5

# Twin connector rods standing on the elbow
ROD_POS = (-190.0, 13.0, 274.0)
ROD_R, ROD_H, ROD_TILT = 6.0, 36.0, 18.0

# Parallel linkage bar beside the arm
LINK_Y = -40.0
LINK_P1 = (10.0, LINK_Y, 197.0)      # pivot on body shoulder lug
LINK_P2 = (-190.0, LINK_Y, 228.0)    # pivot under the elbow
LINK_W, LINK_T = 26.0, 14.0


# ==================================================================
# 1. Base plate
# ==================================================================
base = cq.Workplane("XY").box(BASE_L, BASE_W, BASE_T,
                              centered=(True, True, False))

# corner notches
for sx in (-1, 1):
    for sy in (-1, 1):
        cutter = (cq.Workplane("XY")
                  .box(CORNER_NOTCH, CORNER_NOTCH, BASE_T + 4,
                       centered=(True, True, False))
                  .translate((sx * (BASE_L / 2 - CORNER_NOTCH / 2),
                              sy * (BASE_W / 2 - CORNER_NOTCH / 2), -2)))
        base = base.cut(cutter)

# mounting tabs on the +X edge, each with two holes
for ty in (-42.0, 42.0):
    tab = (cq.Workplane("XY")
           .box(TAB_EXT, TAB_W, BASE_T, centered=(True, True, False))
           .translate((BASE_L / 2 + TAB_EXT / 2 - 2.0, ty, 0)))
    base = base.union(tab)
    for oy in (-8.0, 8.0):
        hx = BASE_L / 2 + TAB_EXT / 2 + 2.0
        base = base.cut(cyl_between((hx, ty + oy, -2),
                                    (hx, ty + oy, BASE_T + 2), TAB_HOLE_R))

# octagonal boss on the front edge with two holes
boss = (cq.Workplane("XY").workplane(offset=BASE_T)
        .center(*BOSS_POS)
        .polygon(8, BOSS_DIA).extrude(BOSS_H))
base = base.union(boss)
for ox in (-9.0, 9.0):
    base = base.cut(cyl_between((BOSS_POS[0] + ox, BOSS_POS[1], BASE_T - 2),
                                (BOSS_POS[0] + ox, BOSS_POS[1],
                                 BASE_T + BOSS_H + 2), 3.5))

# raised slotted pad on the -X edge
pad = (cq.Workplane("XY")
       .box(PAD_SIZE[0], PAD_SIZE[1], PAD_SIZE[2],
            centered=(True, True, False))
       .translate((PAD_POS[0], PAD_POS[1], BASE_T)))
base = base.union(pad)
base = base.cut(cq.Workplane("XY")
                .box(PAD_SIZE[0] + 4, 10.0, 5.0,
                     centered=(True, True, False))
                .translate((PAD_POS[0], PAD_POS[1],
                            BASE_T + PAD_SIZE[2] - 2.5)))

# rectangular pocket on the front face
base = base.cut(cq.Workplane("XY")
                .box(36.0, 14.0, 16.0, centered=(True, True, False))
                .translate((-35.0, -BASE_W / 2 + 5.0, 3.0)))

# 2x2 pattern of small holes on the top face
for ox in (-8.0, 8.0):
    for oy in (-8.0, 8.0):
        base = base.cut(cyl_between((-58 + ox, -52 + oy, BASE_T + 1),
                                    (-58 + ox, -52 + oy, BASE_T - 9), 2.75))

# ==================================================================
# 2. Turntable (J1)
# ==================================================================
z = BASE_T - 1.0
turntable = cq.Workplane("XY").workplane(offset=z).circle(TT_DISCS[0][0]).extrude(TT_DISCS[0][1])
z += TT_DISCS[0][1]
for r, h in TT_DISCS[1:]:
    turntable = turntable.union(
        cq.Workplane("XY").workplane(offset=z).circle(r).extrude(h))
    z += h

# ==================================================================
# 3. Main body casting (stepped wedge, extruded across Y)
# ==================================================================
body = (cq.Workplane("XZ")
        .polyline(BODY_PROFILE).close()
        .extrude(BODY_W / 2, both=True))

# small stepped cover plate on the front step face
body = body.union(cq.Workplane("XY").box(14, 34, 22).translate((22.0, 0.0, 116.0)))
body = body.union(cq.Workplane("XY").box(6, 22, 14).translate((11.5, 0.0, 116.0)))

# small round auxiliary cover on the far (+Y) side, low on the body
body = body.union(cyl_between((10.0, BODY_W / 2 - 2, 75.0),
                              (10.0, BODY_W / 2 + 16, 75.0), 15.0))
body = body.union(cyl_between((10.0, BODY_W / 2 + 15, 75.0),
                              (10.0, BODY_W / 2 + 21, 75.0), 9.0))

# ==================================================================
# 4. Shoulder joint (J2): boss, concentric rings, hex motor shaft
# ==================================================================
yb = BODY_W / 2 + J2_BOSS            # outer face of the side boss
shoulder = cyl_between((0, -yb, J2_C[2]), (0, yb, J2_C[2]), J2_R)
# concentric rings on the visible (-Y) face
shoulder = shoulder.union(cyl_between((0, -(yb - 1), J2_C[2]), (0, -(yb + 8), J2_C[2]), 47.0))
shoulder = shoulder.union(cyl_between((0, -(yb + 7), J2_C[2]), (0, -(yb + 16), J2_C[2]), 38.0))
shoulder = shoulder.union(cyl_between((0, -(yb + 15), J2_C[2]), (0, -(yb + 23), J2_C[2]), 27.0))
# cover on the far (+Y) face
shoulder = shoulder.union(cyl_between((0, yb - 1, J2_C[2]), (0, yb + 8, J2_C[2]), 42.0))
shoulder = shoulder.union(cyl_between((0, yb + 7, J2_C[2]), (0, yb + 13, J2_C[2]), 24.0))

# hexagonal motor shaft + end cap protruding from the visible side
hex_shaft = (cq.Workplane("XY").polygon(6, 42.0).extrude(36.0)
             .rotate((0, 0, 0), (1, 0, 0), 90)          # axis -> -Y
             .translate((0, -(yb + 22), J2_C[2])))
hex_cap = (cq.Workplane("XY").polygon(6, 26.0).extrude(10.0)
           .rotate((0, 0, 0), (1, 0, 0), 90)
           .translate((0, -(yb + 56), J2_C[2])))
shoulder = shoulder.union(hex_shaft).union(hex_cap)
shoulder = shoulder.union(cyl_between((0, -(yb + 66), J2_C[2]),
                                      (0, -(yb + 70), J2_C[2]), 4.0))

# ==================================================================
# 5. Upper arm with collars and elbow housing
# ==================================================================
arm = cyl_between(along(J2_C, ARM_DIR, ARM_S0),
                  along(J2_C, ARM_DIR, ARM_S1), ARM_R)
for r, s0, s1 in ARM_FEATURES:
    arm = arm.union(cyl_between(along(J2_C, ARM_DIR, s0),
                                along(J2_C, ARM_DIR, s1), r))

# ==================================================================
# 6. Wrist assembly (bent at the elbow) and forked tool tip
# ==================================================================
W0 = along(J2_C, ARM_DIR, WRIST_S0)
wrist = None
for r, s0, s1 in WRIST_SEGS + WRIST_RINGS:
    seg = cyl_between(along(W0, WRIST_DIR, s0),
                      along(W0, WRIST_DIR, s1), r)
    wrist = seg if wrist is None else wrist.union(seg)

# two-pronged fork at the tool tip
for oy in (-FORK_GAP, FORK_GAP):
    p1 = along(W0, WRIST_DIR, FORK_S[0])
    p2 = along(W0, WRIST_DIR, FORK_S[1])
    wrist = wrist.union(cyl_between((p1[0], oy, p1[2]),
                                    (p2[0], oy, p2[2]), FORK_R))

# ==================================================================
# 7. Twin connector rods on top of the elbow
# ==================================================================
rod = (cq.Workplane("XY").circle(ROD_R).extrude(ROD_H)
       .union(cq.Workplane("XY").workplane(offset=ROD_H - 1)
              .circle(ROD_R + 1.5).extrude(5.0))
       .rotate((0, 0, 0), (0, 1, 0), ROD_TILT))
rods = (rod.translate((ROD_POS[0], ROD_POS[1], ROD_POS[2]))
        .union(rod.translate((ROD_POS[0], -ROD_POS[1], ROD_POS[2]))))

# ==================================================================
# 8. Parallel linkage bar beside the arm
# ==================================================================
dx, dz = LINK_P2[0] - LINK_P1[0], LINK_P2[2] - LINK_P1[2]
link_len = math.hypot(dx, dz)
link_ang = math.degrees(math.atan2(-dz, dx))
link_mid = ((LINK_P1[0] + LINK_P2[0]) / 2, LINK_Y,
            (LINK_P1[2] + LINK_P2[2]) / 2)

link = (cq.Workplane("XY").box(link_len, LINK_T, LINK_W)
        .rotate((0, 0, 0), (0, 1, 0), link_ang)
        .translate(link_mid))
# rounded bar ends
for p in (LINK_P1, LINK_P2):
    link = link.union(cyl_between((p[0], LINK_Y - LINK_T / 2, p[2]),
                                  (p[0], LINK_Y + LINK_T / 2, p[2]),
                                  LINK_W / 2))
# shoulder lug, elbow bracket and pivot pins
lug = cq.Workplane("XY").box(18, 16, 30).translate((10.0, LINK_Y, 190.0))
bracket = cq.Workplane("XY").box(18, 26, 22).translate((LINK_P2[0], LINK_Y + 10, 236.0))
pin1 = cyl_between((LINK_P1[0], LINK_Y + 10, LINK_P1[2]),
                   (LINK_P1[0], LINK_Y - 16, LINK_P1[2]), 9.0)
pin2 = cyl_between((LINK_P2[0], LINK_Y + 10, LINK_P2[2]),
                   (LINK_P2[0], LINK_Y - 12, LINK_P2[2]), 8.0)

# ==================================================================
# Final assembly
# ==================================================================
result = (base
          .union(turntable)
          .union(body)
          .union(shoulder)
          .union(arm)
          .union(wrist)
          .union(rods)
          .union(link)
          .union(lug)
          .union(bracket)
          .union(pin1)
          .union(pin2))