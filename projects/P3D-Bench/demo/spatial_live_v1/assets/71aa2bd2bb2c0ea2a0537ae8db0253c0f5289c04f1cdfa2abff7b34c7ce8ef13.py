import math
import cadquery as cq

# =============================================================================
#  Scissors assembly - two blade/handle halves + slotted pivot fastener
#
#  Frame:  X = blade thickness / pivot axis
#          Y = length axis (pivot at the origin, blade points towards -Y)
#          Z = lateral direction in which the two halves open
# =============================================================================

# ---------------------------------------------------------------- parameters
BLADE_T = 2.0          # thickness of one half (both halves overlap -> 4.0 mm)
BLADE_LEN = 84.0       # pivot -> blade tip
BLADE_HW = 7.0         # blade half width at the pivot
NECK_U = 60.0          # pivot -> finger-loop centre
OPEN_ANGLE = 5.3       # opening half angle of the scissors [deg]

# The two halves are not identical: the reference shows one wide, strongly
# splayed finger loop and one smaller, more upright loop.
#                 side : (loop lateral offset, loop outer R, finger hole R)
LOOP = {-1: (24.0, 13.5, 6.8),
        +1: (16.0, 13.0, 6.5)}

# pivot fastener (slotted knob)
SHAFT_R = 0.876        # shaft radius
SHAFT_LEN = 2.0 * BLADE_T
BORE_R = 0.95          # pivot bore (shaft plus running clearance)
HEAD_R = {+1: 2.66, -1: 2.56}
HEAD_T = 1.0
SLOT_W = 1.0
SLOT_DEPTH = 0.7


def _bowed(p0, p1, bulge=0.0, n=3):
    """Interior sample points of a gently bowed edge running from p0 to p1."""
    (u0, v0), (u1, v1) = p0, p1
    pts = []
    for i in range(1, n + 1):
        t = i / (n + 1.0)
        pts.append((u0 + (u1 - u0) * t,
                    v0 + (v1 - v0) * t + bulge * math.sin(math.pi * t)))
    return pts


def blade_half(side):
    """Finger loop + shank + tapered blade of one scissor half.

    Local frame: pivot at the origin, blade towards -Y, handle towards +Y with
    a lateral offset of ``side * loop_v``.  The plate spans x = 0 .. BLADE_T.
    """
    loop_v, loop_r, hole_r = LOOP[side]

    # --- 2-D outline (u = along the handle, v = lateral) --------------------
    blade_back = [(-64.0, -2.4), (-44.0, -4.4), (-22.0, -6.2), (0.0, -BLADE_HW)]
    blade_front = [(-22.0, 6.2), (-44.0, 4.4), (-64.0, 2.4)]
    shank_back = _bowed((0.0, -BLADE_HW), (NECK_U, loop_v - 9.5), bulge=-1.2)
    shank_front = _bowed((0.0, BLADE_HW), (NECK_U, loop_v + 9.5), bulge=1.2)

    back_pts = blade_back + shank_back + [(NECK_U, loop_v - 9.5)]   # tip -> loop
    front_pts = shank_front[::-1] + blade_front                     # loop -> tip

    outline = (
        cq.Workplane("YZ")
        .moveTo(-BLADE_LEN, 0.0)                                    # blade tip
        .spline([(u, side * v) for (u, v) in back_pts], includeCurrent=True)
        .lineTo(NECK_U, side * (loop_v + 9.5))                      # top of shank
        .spline([(u, side * v) for (u, v) in front_pts], includeCurrent=True)
        .close()
        .extrude(BLADE_T)
    )

    # round finger-loop boss blended into the shank
    loop_disc = (
        cq.Workplane("YZ")
        .center(NECK_U, side * loop_v)
        .circle(loop_r)
        .extrude(BLADE_T)
    )
    half = outline.union(loop_disc)

    # through holes: finger hole and pivot bore
    for cu, cv, r in ((NECK_U, side * loop_v, hole_r), (0.0, 0.0, BORE_R)):
        half = half.cut(
            cq.Workplane("YZ")
            .workplane(offset=-1.0)
            .center(cu, cv)
            .circle(r)
            .extrude(BLADE_T + 2.0)
        )
    return half


# ------------------------------------------------------- the two scissor halves
# Right half sits in x = 0..+t, left half in x = -t..0 (they overlap at pivot)
right_half = blade_half(+1).rotate((0, 0, 0), (1, 0, 0), -OPEN_ANGLE)
left_half = (blade_half(-1)
             .rotate((0, 0, 0), (1, 0, 0), OPEN_ANGLE)
             .translate((-BLADE_T, 0.0, 0.0)))

# --------------------------------------------------------- pivot fastener
fastener = (
    cq.Workplane("YZ")
    .workplane(offset=-SHAFT_LEN / 2.0)
    .circle(SHAFT_R)
    .extrude(SHAFT_LEN)
)
# outer (slotted) head and inner (plain) head
fastener = fastener.union(
    cq.Workplane("YZ").workplane(offset=SHAFT_LEN / 2.0)
    .circle(HEAD_R[+1]).extrude(HEAD_T))
fastener = fastener.union(
    cq.Workplane("YZ").workplane(offset=-SHAFT_LEN / 2.0 - HEAD_T)
    .circle(HEAD_R[-1]).extrude(HEAD_T))

# screwdriver slot across the outer head face
slot_face = SHAFT_LEN / 2.0 + HEAD_T
slot = (
    cq.Workplane("XY")
    .box(1.2, 2.0 * HEAD_R[+1] + 1.0, SLOT_W)
    .translate((slot_face - SLOT_DEPTH + 0.6, 0.0, 0.0))
)
fastener = fastener.cut(slot)

# ------------------------------------------------------------------ assembly
result = left_half.union(right_half).union(fastener)