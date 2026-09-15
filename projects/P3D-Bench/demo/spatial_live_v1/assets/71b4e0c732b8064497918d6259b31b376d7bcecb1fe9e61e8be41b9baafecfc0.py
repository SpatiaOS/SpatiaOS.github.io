import cadquery as cq

# ----------------------------------------------------------------------
# Parameters (mm) — 4-digit seven-segment LED display
# ----------------------------------------------------------------------
BODY_L = 50.7          # housing length (X)
BODY_H = 19.0          # housing height (Y)
BODY_D = 7.9           # housing depth (Z)

PLATE_T = 0.1          # front shim plate thickness
SEG_T = 0.01           # segment / decimal-point disc thickness
EMBED = 0.005          # embedding depth used for robust fusion of thin parts

DP_R = 0.8             # decimal-point disc radius

PIN_R = 0.25           # locating-pin shank radius
PIN_SHANK_L = 2.63     # pin shank length
PIN_TIP_L = 0.37       # pin conical tip length
PIN_TIP_R = 0.06       # truncated flat at the tip
PIN_EMBED = 0.05       # shank seating depth into the rear face
N_PINS = 12
PIN_Y = 17.0           # height of the pin row on the rear face
PIN_MARGIN = 3.5       # inset of the outer pins from the housing ends

N_DIGITS = 4           # digits on the front face
PITCH = 12.2           # digit spacing along the length
DIGIT_CY = 9.0         # digit center height
ROW_OFF = 5.2          # digit center -> top/bottom bar centerline
COL_OFF = 2.08         # digit center -> vertical bar centerline
DP_DX = 4.25           # decimal-point offset from digit center (x)
DP_DY = -5.75          # decimal-point offset from digit center (y)

# Segment plate classes (length, width, tip_a, tip_b); the two
# null-extraction classes are reconstructed from assembly topology
SEG_TOP = (6.44, 1.48, 0.62, 0.62)   # top bar
SEG_MID = (6.34, 1.44, 0.62, 0.62)   # middle bar
SEG_BOT = (6.39, 1.46, 0.62, 0.62)   # bottom bar (inferred)
SEG_TL = (5.68, 2.29, 0.45, 0.45)    # upper-left bar
SEG_TR = (5.70, 2.26, 0.45, 0.45)    # upper-right bar
SEG_BL = (5.61, 2.29, 0.90, 0.20)    # lower-left bar (tapers to a point below)
SEG_BR = (5.66, 2.28, 0.45, 0.45)    # lower-right bar (inferred)

SEG_Z0 = BODY_D + PLATE_T - EMBED     # base plane of the thin front overlays


# ----------------------------------------------------------------------
# Outline helpers for the thin hexagonal segment plates
# ----------------------------------------------------------------------
def hbar_pts(L, W, t_l, t_r):
    """Hexagonal outline of a horizontal segment (pointed left/right ends)."""
    return [
        (-L / 2.0, 0.0),
        (-L / 2.0 + t_l, W / 2.0),
        (L / 2.0 - t_r, W / 2.0),
        (L / 2.0, 0.0),
        (L / 2.0 - t_r, -W / 2.0),
        (-L / 2.0 + t_l, -W / 2.0),
    ]


def vbar_pts(L, W, t_b, t_t):
    """Hexagonal outline of a vertical segment (pointed bottom/top ends)."""
    return [
        (0.0, -L / 2.0),
        (W / 2.0, -L / 2.0 + t_b),
        (W / 2.0, L / 2.0 - t_t),
        (0.0, L / 2.0),
        (-W / 2.0, L / 2.0 - t_t),
        (-W / 2.0, -L / 2.0 + t_b),
    ]


def thin_plate(pts, x, y):
    """Extrude a 2D outline into a thin plate seated on the front shim plate."""
    return (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(SEG_T)
        .translate((x, y, SEG_Z0))
    )


# ----------------------------------------------------------------------
# Build the individual bodies
# ----------------------------------------------------------------------
solids = []

# Grounded spacer block (main housing)
solids.append(
    cq.Workplane("XY").box(BODY_L, BODY_H, BODY_D, centered=False)
)

# Front shim plate (datum face for all segments and decimal-point discs)
solids.append(
    cq.Workplane("XY")
    .box(BODY_L, BODY_H, PLATE_T, centered=False)
    .translate((0.0, 0.0, BODY_D))
)

# Four digits, each built from 7 hexagonal segment plates + 1 decimal disc
cx0 = (BODY_L - (N_DIGITS - 1) * PITCH - DP_DX - DP_R + SEG_TOP[0] / 2.0) / 2.0
for d in range(N_DIGITS):
    cx = cx0 + d * PITCH
    cy = DIGIT_CY

    # Horizontal bars: top / middle / bottom
    for dy, spec in ((ROW_OFF, SEG_TOP), (0.0, SEG_MID), (-ROW_OFF, SEG_BOT)):
        L, W, t_l, t_r = spec
        solids.append(thin_plate(hbar_pts(L, W, t_l, t_r), cx, cy + dy))

    # Vertical bars: upper-left / upper-right / lower-left / lower-right
    for dx, dy, spec in (
        (-COL_OFF, ROW_OFF / 2.0, SEG_TL),
        (COL_OFF, ROW_OFF / 2.0, SEG_TR),
        (-COL_OFF, -ROW_OFF / 2.0, SEG_BL),
        (COL_OFF, -ROW_OFF / 2.0, SEG_BR),
    ):
        L, W, t_b, t_t = spec
        solids.append(thin_plate(vbar_pts(L, W, t_b, t_t), cx + dx, cy + dy))

    # Decimal-point disc (bottom-right of the digit)
    solids.append(
        cq.Workplane("XY")
        .circle(DP_R)
        .extrude(SEG_T)
        .translate((cx + DP_DX, cy + DP_DY, SEG_Z0))
    )

# Twelve locating pins seated on the upper rear face, pointing backwards
pin_dx = (BODY_L - 2.0 * PIN_MARGIN) / (N_PINS - 1)
for i in range(N_PINS):
    px = PIN_MARGIN + i * pin_dx
    # Cylindrical shank (slightly seated into the housing for a clean fuse)
    solids.append(
        cq.Solid.makeCylinder(
            PIN_R,
            PIN_SHANK_L + PIN_EMBED,
            cq.Vector(px, PIN_Y, -PIN_SHANK_L),
            cq.Vector(0, 0, 1),
        )
    )
    # Conical tip with a small truncated flat
    solids.append(
        cq.Solid.makeCone(
            PIN_R,
            PIN_TIP_R,
            PIN_TIP_L,
            cq.Vector(px, PIN_Y, -PIN_SHANK_L - PIN_TIP_L),
            cq.Vector(0, 0, 1),
        )
    )

# ----------------------------------------------------------------------
# Fuse everything into a single unified model
# ----------------------------------------------------------------------
result = solids[0]
for s in solids[1:]:
    result = result.union(s)