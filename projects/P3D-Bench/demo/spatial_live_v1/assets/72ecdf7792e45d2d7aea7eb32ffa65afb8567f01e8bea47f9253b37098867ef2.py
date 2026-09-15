import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------
THICKNESS = 2.0
HOLE_D = 1.80

# Opening angles (degrees) about the pivot, matching the slightly-open pose
OPEN_LARGE_DEG = -5.0
OPEN_SMALL_DEG = 8.0

# Large (finger) loop — right handle / left blade
L_LOOP_CX, L_LOOP_CY = 12.0, 48.0
L_LOOP_ORX, L_LOOP_ORY = 14.5, 20.0
L_LOOP_IRX, L_LOOP_IRY = 9.6, 14.8
L_LOOP_ANGLE = -8.0
L_INNER_SHIFT = 1.4

# Small (thumb) loop — left handle / right blade
S_LOOP_CX, S_LOOP_CY = -14.0, 44.0
S_LOOP_ORX, S_LOOP_ORY = 11.5, 14.0
S_LOOP_IRX, S_LOOP_IRY = 7.2, 9.6
S_LOOP_ANGLE = 24.0
S_INNER_SHIFT = 1.2

# Fastener (slotted knob)
SHAFT_R = 0.82
SHAFT_LEN = 4.0
HEAD_FRONT_R = 2.66
HEAD_BACK_R = 2.56
HEAD_H = 1.0
SLOT_W = 0.55
SLOT_L = 4.4
SLOT_DEPTH = 0.80


def _shifted_center(cx, cy, shift):
    mag = math.hypot(cx, cy)
    return (cx + shift * cx / mag, cy + shift * cy / mag)


def make_scissor_half(
    blade_pts,
    loop_cx,
    loop_cy,
    loop_orx,
    loop_ory,
    loop_irx,
    loop_iry,
    loop_angle,
    inner_shift,
    thickness,
    hole_d,
):
    """One blade+handle half in XY, pivot bore at the origin, thickness +Z."""
    icx, icy = _shifted_center(loop_cx, loop_cy, inner_shift)

    blade = (
        cq.Workplane("XY")
        .moveTo(blade_pts[0][0], blade_pts[0][1])
        .spline(blade_pts[1:])
        .close()
        .extrude(thickness)
    )

    loop = (
        cq.Workplane("XY")
        .transformed(offset=(loop_cx, loop_cy, 0), rotate=(0, 0, loop_angle))
        .ellipse(loop_orx, loop_ory)
        .extrude(thickness)
    )

    half = loop.union(blade)
    half = half.edges("|Z").fillet(0.7)

    inner = (
        cq.Workplane("XY")
        .transformed(offset=(icx, icy, 0), rotate=(0, 0, loop_angle))
        .ellipse(loop_irx, loop_iry)
        .extrude(thickness + 2.0)
        .translate((0, 0, -1.0))
    )
    half = half.cut(inner)

    hole = (
        cq.Workplane("XY")
        .circle(hole_d / 2.0)
        .extrude(thickness + 2.0)
        .translate((0, 0, -1.0))
    )
    half = half.cut(hole)
    return half


def make_fastener():
    """Spool-shaped slotted knob: two disc heads and a cylindrical shaft."""
    fastener = (
        cq.Workplane("XY")
        .circle(HEAD_BACK_R)
        .extrude(HEAD_H)
        .faces(">Z")
        .workplane()
        .circle(SHAFT_R)
        .extrude(SHAFT_LEN)
        .faces(">Z")
        .workplane()
        .circle(HEAD_FRONT_R)
        .extrude(HEAD_H)
    )
    fastener = fastener.faces(">Z").edges().fillet(0.22)
    fastener = (
        fastener.faces(">Z")
        .workplane()
        .rect(SLOT_L, SLOT_W)
        .cutBlind(-SLOT_DEPTH)
    )
    return fastener


# ---------------------------------------------------------------------------
# Blade strips (tip -> loop along the cutting edge, then loop -> tip along the spine)
# ---------------------------------------------------------------------------
large_pts = [
    (1.0, -93.5),
    (2.2, -72.0),
    (3.0, -48.0),
    (3.6, -24.0),
    (4.1, -6.0),
    (4.4, 6.0),
    (6.2, 18.0),
    (9.5, 30.0),
    (13.5, 40.0),
    (17.5, 48.0),
    (7.0, 50.0),
    (3.5, 36.0),
    (-0.5, 22.0),
    (-4.5, 10.0),
    (-7.5, -1.0),
    (-8.7, -14.0),
    (-8.9, -32.0),
    (-8.2, -55.0),
    (-6.2, -76.0),
    (-2.5, -92.5),
]

small_pts = [
    (-0.8, -98.5),
    (-2.2, -76.0),
    (-3.2, -50.0),
    (-3.8, -24.0),
    (-4.1, -6.0),
    (-4.2, 6.0),
    (-6.0, 16.0),
    (-9.5, 26.0),
    (-13.0, 35.0),
    (-15.0, 43.0),
    (-8.0, 44.0),
    (-5.0, 32.0),
    (-0.5, 20.0),
    (4.0, 10.0),
    (7.0, 0.0),
    (8.4, -12.0),
    (8.6, -32.0),
    (8.0, -56.0),
    (6.0, -78.0),
    (2.8, -97.0),
]

# ---------------------------------------------------------------------------
# Build parts
# ---------------------------------------------------------------------------
large_half = make_scissor_half(
    large_pts,
    L_LOOP_CX, L_LOOP_CY,
    L_LOOP_ORX, L_LOOP_ORY,
    L_LOOP_IRX, L_LOOP_IRY,
    L_LOOP_ANGLE,
    L_INNER_SHIFT,
    THICKNESS,
    HOLE_D,
)

small_half = make_scissor_half(
    small_pts,
    S_LOOP_CX, S_LOOP_CY,
    S_LOOP_ORX, S_LOOP_ORY,
    S_LOOP_IRX, S_LOOP_IRY,
    S_LOOP_ANGLE,
    S_INNER_SHIFT,
    THICKNESS,
    HOLE_D,
)

fastener = make_fastener()

# ---------------------------------------------------------------------------
# Assemble: small half at the back, large half in front, slotted head visible
# ---------------------------------------------------------------------------
large_xf = (
    large_half
    .rotate((0, 0, 0), (0, 0, 1), OPEN_LARGE_DEG)
    .translate((0, 0, THICKNESS))
)
small_xf = small_half.rotate((0, 0, 0), (0, 0, 1), OPEN_SMALL_DEG)
fastener_xf = fastener.translate((0, 0, -HEAD_H))

result = large_xf.union(small_xf).union(fastener_xf)