import math
import cadquery as cq

# =============================================================================
#  Reconstructed drive-shaft assembly: two universal joints on a splined shaft
#  All dimensions in millimetres.
# =============================================================================

# ----------------------------------------------------------------- parameters
N_TEETH    = 36        # spline tooth count (shaft, pins, yoke hubs)
SPL_ROOT_R = 8.62      # spline root (groove) radius
SPL_TIP_R  = 10.00     # spline tooth-tip radius
SHANK_R    = 11.08     # smooth shaft shank radius

PIN_R      = 10.00     # splined coupling-pin journal radius
PIN_BORE_R = 3.39      # axial bore in the free pin end (6.78 dia)
PIN_BORE_L = 12.0
PIN_HOLE_R = 3.00      # radial retention holes (6 dia)

HUB_R      = 14.50     # yoke hub outer radius
HUB_BORE_R = 8.40      # yoke hub pilot bore (spline seats through it)
HUB_CB_R   = 9.74      # hub counterbore, 19.48 dia journal seat
HUB_CB_LEN = 10.0
CSK_LEN    = 1.50      # countersink at the counterbore mouth

EAR_GAP_H  = 10.80     # half gap between the ears of one fork
EAR_T      = 9.00      # ear plate thickness
EAR_END_R  = 10.30     # ear tip radius (= ear half width)
EAR_HOLE_R = 4.00      # 8 mm cross-pin bore

SHAFT_FORK_GAP_H = 10.50   # shaft fork runs marginally tighter than the yokes

TRUN_R     = 4.20      # spider (cross) trunnion radius
TRUN_OVER  = 1.50      # trunnion protrusion beyond the ear face
CROSS_R    = 8.50      # spider centre body radius
CROSS_HALF = 7.50      # spider centre body half length

COLLAR_R   = 13.00     # serrated collar of the angle joint

# ------------------------------------------------------- axial station layout
X_P1_J0,   X_P1_J1     = 0.0,   54.0      # left pin journal
X_P1_SPL0, X_P1_SPL1   = 54.0,  75.5      # left pin spline
X_Y1_HUB0, X_Y1_HUB1   = 52.0,  84.0      # left yoke hub
X_Y1_EAR0, X_Y1_EAR1   = 80.0,  114.0     # left yoke fork ears
X_K1                   = 100.0            # left knuckle (cross) centre

X_J_EAR0,  X_J_EAR1    = 84.0,  118.0     # angle-joint fork ears
X_J_BASE0, X_J_BASE1   = 109.0, 138.0     # angle-joint fork base
X_J_BODY0, X_J_BODY1   = 130.0, 156.0     # angle-joint body
X_J_HOLE               = 144.0            # counterbored web hole
X_COLLAR0, X_COLLAR1   = 150.0, 180.0     # serrated collar

X_S_SPL0,  X_S_SPL1    = 150.0, 232.0     # shaft spline
X_SHANK0,  X_SHANK1    = 230.0, 314.0     # shaft shank
X_F_EAR0,  X_F_EAR1    = 300.0, 336.0     # shaft yoke fork ears
X_K2                   = 318.0            # right knuckle (cross) centre

X_Y2_EAR0, X_Y2_EAR1   = 302.0, 338.0     # right yoke fork ears
X_Y2_HUB0, X_Y2_HUB1   = 326.0, 357.5     # right yoke hub
X_P2_SPL0, X_P2_SPL1   = 335.5, 357.0     # right pin spline
X_P2_TIP               = 411.0            # right pin free end


# ------------------------------------------------------------------ helpers
def cyl_x(r, x0, x1):
    """Solid cylinder lying on the global X axis."""
    return cq.Workplane("YZ").circle(r).extrude(x1 - x0).translate((x0, 0, 0))


def cyl_pt(r, p0, p1):
    """Solid cylinder between two arbitrary points."""
    a, b = cq.Vector(*p0), cq.Vector(*p1)
    axis = b - a
    return cq.Workplane(obj=cq.Solid.makeCylinder(r, axis.Length, a, axis))


def cone_pt(r0, r1, p0, p1):
    """Solid cone/frustum between two points."""
    a, b = cq.Vector(*p0), cq.Vector(*p1)
    axis = b - a
    return cq.Workplane(obj=cq.Solid.makeCone(r0, r1, axis.Length, a, axis))


def spline_x(x0, x1):
    """Straight external spline (N_TEETH teeth) extruded along +X."""
    pitch = 2.0 * math.pi / N_TEETH
    h_root, h_tip = pitch * 0.25, pitch * 0.125
    pts = []
    for i in range(N_TEETH):
        c = i * pitch
        for a, r in ((c - h_root, SPL_ROOT_R), (c - h_tip, SPL_TIP_R),
                     (c + h_tip, SPL_TIP_R), (c + h_root, SPL_ROOT_R)):
            pts.append((r * math.sin(a), r * math.cos(a)))
    return (cq.Workplane("YZ").polyline(pts).close()
            .extrude(x1 - x0).translate((x0, 0, 0)))


def fork_ears(x0, x1, x_hole, along="y", gap_h=EAR_GAP_H):
    """
    Pair of parallel fork ears with semi-circular tips and an 8 mm pin bore.
    `along` gives the plate normal ('y' or 'z'), x_hole is the pin axis station.
    """
    xc, xlen = 0.5 * (x0 + x1), x1 - x0
    span = gap_h + EAR_T                       # outer half width across the ears
    w = EAR_END_R + 1.0                        # blank is trimmed by the tip disc
    if along == "y":
        blank = cq.Workplane("XY").box(xlen, 2 * span, 2 * w).translate((xc, 0, 0))
        slot  = cq.Workplane("XY").box(xlen + 4, 2 * gap_h, 2 * w + 4).translate((xc, 0, 0))
        tip   = cyl_pt(EAR_END_R, (x_hole, -span - 2, 0), (x_hole, span + 2, 0))
        bore  = cyl_pt(EAR_HOLE_R, (x_hole, -span - 3, 0), (x_hole, span + 3, 0))
    else:
        blank = cq.Workplane("XY").box(xlen, 2 * w, 2 * span).translate((xc, 0, 0))
        slot  = cq.Workplane("XY").box(xlen + 4, 2 * w + 4, 2 * gap_h).translate((xc, 0, 0))
        tip   = cyl_pt(EAR_END_R, (x_hole, 0, -span - 2), (x_hole, 0, span + 2))
        bore  = cyl_pt(EAR_HOLE_R, (x_hole, 0, -span - 3), (x_hole, 0, span + 3))
    return blank.cut(slot).intersect(tip).cut(bore)


# ------------------------------------------------------------------- parts
def make_pin():
    """Splined coupling pin, built with its free end at x = 0 growing in +X."""
    p = cyl_x(PIN_R, X_P1_J0, X_P1_J1).union(spline_x(X_P1_SPL0, X_P1_SPL1))
    p = p.cut(cyl_x(PIN_BORE_R, -1.0, PIN_BORE_L))                          # end bore
    p = p.cut(cone_pt(PIN_R + 1.0, PIN_R - 1.5, (-1, 0, 0), (1.5, 0, 0)))   # tip chamfer
    for xh in (14.0, 36.0):                                                 # 6 mm radial holes
        p = p.cut(cyl_pt(PIN_HOLE_R, (xh, 0, -PIN_R - 1), (xh, 0, PIN_R + 1)))
    return p


def u_joint_yoke(x_hub0, x_hub1, x_ear0, x_ear1, x_hole,
                 ear_axis="y", csk_at="+x"):
    """Yoke = hub (spline bore + countersunk journal seat) plus a fork."""
    hub = cyl_x(HUB_R, x_hub0, x_hub1)
    hub = hub.cut(cyl_x(HUB_BORE_R, x_hub0 - 1, x_hub1 + 1))
    if csk_at == "+x":
        hub = hub.cut(cyl_x(HUB_CB_R, x_hub1 - HUB_CB_LEN, x_hub1 + 1))
        hub = hub.cut(cone_pt(HUB_CB_R + CSK_LEN, HUB_CB_R,
                              (x_hub1, 0, 0), (x_hub1 - CSK_LEN, 0, 0)))
    else:
        hub = hub.cut(cyl_x(HUB_CB_R, x_hub0 - 1, x_hub0 + HUB_CB_LEN))
        hub = hub.cut(cone_pt(HUB_CB_R + CSK_LEN, HUB_CB_R,
                              (x_hub0, 0, 0), (x_hub0 + CSK_LEN, 0, 0)))
    return hub.union(fork_ears(x_ear0, x_ear1, x_hole, along=ear_axis))


def joint_cross(xc):
    """Universal-joint spider: centre body with four trunnions."""
    body = cyl_x(CROSS_R, xc - CROSS_HALF, xc + CROSS_HALF)
    reach = EAR_GAP_H + EAR_T + TRUN_OVER
    for d in ((0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)):
        end = (xc + d[0] * reach, d[1] * reach, d[2] * reach)
        body = body.union(cyl_pt(TRUN_R, (xc, 0, 0), end))
    return body


def serrated_angle_joint():
    """Angle joint: fork, web/body and the serrated collar that grips the spline."""
    part = fork_ears(X_J_EAR0, X_J_EAR1, X_K1, along="z")
    part = part.union(cq.Workplane("XY")
                      .box(X_J_BASE1 - X_J_BASE0, 2 * 10.5, 2 * (EAR_GAP_H + EAR_T))
                      .translate((0.5 * (X_J_BASE0 + X_J_BASE1), 0, 0)))
    part = part.union(cq.Workplane("XY")
                      .box(X_J_BODY1 - X_J_BODY0, 26.0, 27.0)
                      .translate((0.5 * (X_J_BODY0 + X_J_BODY1), 0, 0)))
    # counterbored web hole (6.78 through / 17.37 counterbore)
    part = part.cut(cyl_pt(8.685, (X_J_HOLE, 0, 14.5), (X_J_HOLE, 0, 5.5)))
    part = part.cut(cyl_pt(3.39, (X_J_HOLE, 0, 15.0), (X_J_HOLE, 0, -15.0)))
    part = part.union(cyl_x(COLLAR_R, X_COLLAR0, X_COLLAR1))
    return part


def splined_shaft_yoke():
    """Splined shaft: 36-tooth spline, smooth shank and an integral fork."""
    part = spline_x(X_S_SPL0, X_S_SPL1)
    part = part.union(cyl_x(SHANK_R, X_SHANK0, X_SHANK1))
    part = part.union(fork_ears(X_F_EAR0, X_F_EAR1, X_K2,
                                along="z", gap_h=SHAFT_FORK_GAP_H))
    return part


# ------------------------------------------------------------------- assembly
#  left pin -> left yoke -> cross -> angle joint -> shaft -> cross
#  -> right yoke -> right pin, all centred on the X axis.
#
# NOTE: the grounded hair-thin locating pin (e7477ba8, ~.01 mm cross-section)
# is a sub-visible sliver and is intentionally omitted.

result = make_pin()                                                       # splined pin
result = result.union(u_joint_yoke(X_Y1_HUB0, X_Y1_HUB1,
                                   X_Y1_EAR0, X_Y1_EAR1, X_K1, "y", "+x"))
result = result.union(joint_cross(X_K1))                                  # left spider
result = result.union(serrated_angle_joint())                             # angle joint
result = result.union(splined_shaft_yoke())                               # splined shaft
result = result.union(joint_cross(X_K2))                                  # right spider
result = result.union(u_joint_yoke(X_Y2_HUB0, X_Y2_HUB1,
                                   X_Y2_EAR0, X_Y2_EAR1, X_K2, "y", "-x"))
result = result.union(make_pin().rotate((0, 0, 0), (0, 0, 1), 180)
                      .translate((X_P2_TIP, 0, 0)))                       # right pin