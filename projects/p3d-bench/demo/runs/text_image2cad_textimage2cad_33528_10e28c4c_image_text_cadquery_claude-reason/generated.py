import cadquery as cq
import math

# ============================================================
# DJ Controller — Parametric CadQuery Model
# ============================================================

# --- Main body dimensions ---
BODY_L = 309.0       # length (X-axis)
BODY_W = 245.0       # depth  (Y-axis)
TOTAL_H = 40.0       # main enclosure height (Z)
BASE_H = 14.0        # lower base-tier height
INSET = 4.0          # panel inset from base edge
CORNER_R = 8.0       # base corner fillet
TOP_Z = TOTAL_H      # Z of the top working surface

# --- Jog wheel ---
JOG_R = 43.0         # main cylinder radius
JOG_SKIRT_R = 46.0   # wider skirt-base radius
JOG_PLAT_R = 30.0    # central plateau radius
JOG_H = 18.0         # total wheel height above recess
N_SLOTS = 14         # peripheral grip slots
JOG_POS = [(-75.0, 35.0), (75.0, -35.0)]

# --- Button pads (26 total) ---
PL, PW, PH = 18.87, 12.09, 5.0

PAD_POS = [
    # Upper-back left row (4)
    (-25, 82), (-3, 82), (19, 82), (41, 82),
    # Upper-back right 2×2 block (4)
    (72, 85), (94, 85), (72, 67), (94, 67),
    # Left of left jog wheel (2)
    (-128, 58), (-128, 38),
    # Second row center-left (3)
    (-25, 62), (-3, 62), (19, 62),
    # Center horizontal strip (4)
    (-45, 0), (-23, 0), (23, 0), (45, 0),
    # Lower-front left row (4)
    (-45, -80), (-23, -80), (1, -80), (23, -80),
    # Lower-front right 2×2 block (4)
    (35, -86), (57, -86), (35, -102), (57, -102),
    # Single pad right of right jog (1)
    (128, -55),
]

# --- Knob posts (8 tapered cones with pins) ---
KNOB_POS = [
    (-10, 50), (20, 50), (55, 48), (112, 58),
    (120, 25), (120, -10), (-55, -30), (-10, -42),
]
POST_R_BASE = 5.5
POST_R_TOP = 2.5
POST_H = 12.0

# --- Pins ---
PIN_R = 0.75
PIN_H = 11.0
# 3 standalone pin positions (total 11 pins: 8 on posts + 3 standalone)
PIN_EXTRA = [(-128, 80), (128, 80), (0, 20)]

# --- Front-panel jacks (6 flanged bushings) ---
JACK_XS = [-90, -60, -30, 30, 60, 90]
JACK_FLANGE_R = 7.0
JACK_BODY_R = 4.0
JACK_BODY_L = 6.0

# --- Crossfader ---
XF_POS = (0, -10)
XF_SLOT_L = 55.0
XF_SLOT_W = 4.0
XF_KNOB_W = 10.0
XF_KNOB_D = 7.0
XF_KNOB_H = 9.0

# ============================================================
# 1. Main Enclosure (two-tier box)
# ============================================================

# Lower base tier — full footprint
base = (
    cq.Workplane("XY")
    .rect(BODY_L, BODY_W)
    .extrude(BASE_H)
    .edges("|Z").fillet(CORNER_R)
)

# Upper panel tier — slightly inset, with top chamfer
panel = (
    cq.Workplane("XY")
    .workplane(offset=BASE_H - 2)
    .rect(BODY_L - 2 * INSET, BODY_W - 2 * INSET)
    .extrude(TOTAL_H - BASE_H + 2)
    .edges("|Z").fillet(CORNER_R - 1.0)
    .edges(">Z").chamfer(2.0)
)

result = base.union(panel)

# Front-panel recess (reveals jack mounting area)
fp_y = -BODY_W / 2.0 + INSET + 6.0
result = result.cut(
    cq.Workplane("XY")
    .workplane(offset=BASE_H)
    .center(0, fp_y)
    .rect(BODY_L - 50, 8)
    .extrude(TOTAL_H - BASE_H - 4)
)

# ============================================================
# 2. Jog Wheels (with peripheral slots)
# ============================================================

for jx, jy in JOG_POS:
    # Cut circular recess into top surface
    result = result.cut(
        cq.Workplane("XY")
        .workplane(offset=TOP_Z - 3)
        .center(jx, jy)
        .circle(JOG_SKIRT_R + 2)
        .extrude(4)
    )

    # Flared skirt base
    jog = (
        cq.Workplane("XY")
        .circle(JOG_SKIRT_R)
        .extrude(4)
    )
    # Main cylindrical body
    jog = jog.union(
        cq.Workplane("XY")
        .workplane(offset=4)
        .circle(JOG_R)
        .extrude(JOG_H - 6)
    )
    # Raised central plateau
    jog = jog.union(
        cq.Workplane("XY")
        .workplane(offset=JOG_H - 2)
        .circle(JOG_PLAT_R)
        .extrude(2)
    )

    # Build all peripheral slot cutters as one solid
    slots = None
    for i in range(N_SLOTS):
        a = 2.0 * math.pi * i / N_SLOTS
        sx = (JOG_R - 3.0) * math.cos(a)
        sy = (JOG_R - 3.0) * math.sin(a)
        tang_deg = math.degrees(a) + 90.0
        s = (
            cq.Workplane("XY")
            .workplane(offset=5)
            .transformed(offset=(sx, sy, 0), rotate=(0, 0, tang_deg))
            .rect(8, 2.5)
            .extrude(JOG_H - 7)
        )
        slots = s if slots is None else slots.union(s)
    jog = jog.cut(slots)

    # Small hemispherical indicator boss on plateau
    jog = jog.union(
        cq.Workplane("XY")
        .workplane(offset=JOG_H)
        .center(JOG_PLAT_R * 0.4, 0)
        .circle(1.5)
        .extrude(1.0)
    )

    # Position jog wheel in assembly
    result = result.union(jog.translate((jx, jy, TOP_Z - 3)))

# ============================================================
# 3. Button Pads (26 raised rectangular blocks)
# ============================================================

pads = (
    cq.Workplane("XY")
    .workplane(offset=TOP_Z)
    .pushPoints(PAD_POS)
    .rect(PL, PW)
    .extrude(PH)
)
result = result.union(pads)

# ============================================================
# 4. Knob Socket Posts (8 tapered cones) + Pins
# ============================================================

for kx, ky in KNOB_POS:
    # Tapered (lofted) post: wider base to narrow top
    post = (
        cq.Workplane("XY")
        .circle(POST_R_BASE)
        .workplane(offset=POST_H)
        .circle(POST_R_TOP)
        .loft()
        .translate((kx, ky, TOP_Z))
    )
    # Thin control-stem pin atop post
    pin = (
        cq.Workplane("XY")
        .workplane(offset=TOP_Z + POST_H)
        .center(kx, ky)
        .circle(PIN_R)
        .extrude(PIN_H)
    )
    result = result.union(post).union(pin)

# ============================================================
# 5. Standalone Pins (3 extra)
# ============================================================

for px, py in PIN_EXTRA:
    result = result.union(
        cq.Workplane("XY")
        .workplane(offset=TOP_Z)
        .center(px, py)
        .circle(PIN_R)
        .extrude(PIN_H)
    )

# ============================================================
# 6. Front-Panel Jack Connectors (6 flanged bushings)
# ============================================================

jack_mount_y = -BODY_W / 2.0 + INSET + 2.0
jack_center_z = 26.0

for jx in JACK_XS:
    # Build jack at origin pointing +Z, then rotate to face -Y
    jack = (
        cq.Workplane("XY")
        .circle(JACK_FLANGE_R)
        .extrude(2.0)
    )
    jack = jack.union(
        cq.Workplane("XY")
        .workplane(offset=2.0)
        .circle(JACK_BODY_R)
        .extrude(JACK_BODY_L)
    )
    # Rotate 90° around X so it points in -Y (toward user)
    jack = jack.rotate((0, 0, 0), (1, 0, 0), -90)
    jack = jack.translate((jx, jack_mount_y, jack_center_z))
    result = result.union(jack)

# ============================================================
# 7. Crossfader (slot groove + slider knob)
# ============================================================

xf_x, xf_y = XF_POS

# Groove cut into top surface
result = result.cut(
    cq.Workplane("XY")
    .workplane(offset=TOP_Z - 2.0)
    .center(xf_x, xf_y)
    .rect(XF_SLOT_L, XF_SLOT_W)
    .extrude(3.0)
)

# Raised slider knob
result = result.union(
    cq.Workplane("XY")
    .workplane(offset=TOP_Z - 2.0)
    .center(xf_x, xf_y)
    .rect(XF_KNOB_W, XF_KNOB_D)
    .extrude(XF_KNOB_H)
)