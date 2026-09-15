import cadquery as cq

# =====================================================================
# Inline four-piston linkage assembly (single unified solid, mm).
# Backbone shaft runs along +Y, pistons point +Z, all parts lie near
# the X=0 plane (layout normal ~ X).  Envelope ~ 50 x 168 x 438.
# =====================================================================

# --- shaft bar: backbone rod + integral disc bosses + bracket arms ---
SHAFT_LEN = 438.0
SHAFT_R = 3.0                 # 6 mm backbone rod
BUSHING_OD = 8.0              # end bushing on the rod
BUSHING_ID = 6.0
BUSHING_LEN = 5.0

DISC_R = 15.0                 # 30 mm disc boss
DISC_THK = 14.0               # disc thickness (X)
THROW = 18.0                  # disc centre below the shaft axis
ARM_W = 8.0                   # bracket arm thickness (X)
ARM_LEN = 26.0                # bracket arm length (Y), tabs past disc
ARM_TOP = 2.0                 # arm rises slightly above shaft axis
SLOT_W = 3.0                  # narrow slots through arm tabs / disc edge
SLOT_XW = 20.0
SLOT_Z0, SLOT_Z1 = -14.0, -4.0
SLOT_Y_OFF = 10.0

# --- piston ---
PISTON_R = 25.0               # 50 mm diameter
PISTON_H = 40.0
SKIRT_BORE_R = 20.0           # 40 mm skirt bore (receives rod small end)
SKIRT_BORE_DEPTH = 21.0
POCKET_R = 15.0               # 30 mm blind pocket beneath the crown
CROWN_THK = 10.0
PIN_DIA = 12.0                # transverse wrist-pin bore
PIN_SPOT = 15.0               # square spot-face around the pin bore
PIN_SPOT_DEPTH = 1.5
GROOVE_R = 2.0                # toroidal ring-groove profile radius
RING_OD = 54.56               # spacer ring seated on the barrel
RING_ID = 50.0
RING_THK = 5.0
RING_SETBACK = 1.0

# --- connecting rod ---
BIG_END_R = 22.0
BIG_END_BORE_R = 15.4         # clearance around the disc boss
BIG_END_THK = 10.0
FLANGE_THK = 4.0              # I-beam flange thickness (X)
FLANGE_OFF = 7.0              # flange centre offset from rod axis
FLANGE_W = 16.0               # flange width (Y)
WEB_W = 10.0
WEB_THK = 5.0

# --- layout ---
STATIONS = [55.0, 165.0, 275.0, 385.0]
PISTON_BOT_Z = 95.0

# --- derived datums (total height: disc bottom -33 to crown 135 = 168) ---
DISC_Z = -THROW
PISTON_TOP_Z = PISTON_BOT_Z + PISTON_H
PIN_Z = PISTON_BOT_Z + SKIRT_BORE_DEPTH / 2.0
BOSS_TOP_Z = PISTON_BOT_Z + SKIRT_BORE_DEPTH
BOSS_BOT_Z = PISTON_BOT_Z - 1.0
SHANK_TOP_Z = PIN_Z
GROOVE_Z = PISTON_TOP_Z - 8.5
RING_BOT_Z = PISTON_TOP_Z - RING_THK - RING_SETBACK


def make_crank(y):
    """Disc boss carried on a slotted rectangular bracket arm."""
    disc = (cq.Workplane("YZ", origin=(-DISC_THK / 2.0, y, DISC_Z))
            .circle(DISC_R)
            .extrude(DISC_THK))
    arm = (cq.Workplane("XY", origin=(0.0, y, DISC_Z))
           .box(ARM_W, ARM_LEN, THROW + ARM_TOP, centered=(True, True, False)))
    crank = disc.union(arm)
    # narrow rectangular slots through the exposed tabs and disc edges
    for s in (1.0, -1.0):
        crank = crank.cut(
            cq.Workplane("XY", origin=(0.0, y + s * SLOT_Y_OFF, SLOT_Z0))
            .box(SLOT_XW, SLOT_W, SLOT_Z1 - SLOT_Z0, centered=(True, True, False)))
    return crank


def make_rod(y):
    """I-beam connecting rod: big-end eye, web + flange shank, small-end boss."""
    big_end = (cq.Workplane("YZ", origin=(-BIG_END_THK / 2.0, y, DISC_Z))
               .circle(BIG_END_R)
               .circle(BIG_END_BORE_R)
               .extrude(BIG_END_THK))
    shank_h = SHANK_TOP_Z - DISC_Z
    flanges = (cq.Workplane("XY", origin=(0.0, y, DISC_Z))
               .pushPoints([(-FLANGE_OFF, 0.0), (FLANGE_OFF, 0.0)])
               .rect(FLANGE_THK, FLANGE_W)
               .extrude(shank_h))
    web = (cq.Workplane("XY", origin=(0.0, y, DISC_Z))
           .rect(WEB_W, WEB_THK)
           .extrude(shank_h))
    # small-end boss plugs coaxially into the piston skirt bore
    boss = (cq.Workplane("XY", origin=(0.0, y, BOSS_BOT_Z))
            .circle(SKIRT_BORE_R)
            .extrude(BOSS_TOP_Z - BOSS_BOT_Z))
    return big_end.union(flanges).union(web).union(boss)


def make_piston(y):
    """Squat hollow piston: ring groove, stepped interior, pin spot-faces."""
    p = (cq.Workplane("XY", origin=(0.0, y, PISTON_BOT_Z))
         .circle(PISTON_R)
         .extrude(PISTON_H))
    # 40 mm skirt bore, open at the bottom
    p = p.cut(cq.Workplane("XY", origin=(0.0, y, PISTON_BOT_Z - 1.0))
              .circle(SKIRT_BORE_R)
              .extrude(SKIRT_BORE_DEPTH + 1.0))
    # 30 mm blind pocket stepping up beneath the crown
    pocket_depth = PISTON_H - SKIRT_BORE_DEPTH - CROWN_THK
    p = p.cut(cq.Workplane("XY", origin=(0.0, y, PISTON_BOT_Z + SKIRT_BORE_DEPTH - 1.0))
              .circle(POCKET_R)
              .extrude(pocket_depth + 1.0))
    # toroidal ring groove just below the crown
    p = p.cut(cq.Solid.makeTorus(PISTON_R, GROOVE_R,
                                 cq.Vector(0.0, y, GROOVE_Z),
                                 cq.Vector(0.0, 0.0, 1.0)))
    return p


def make_pin_cutters(y):
    """Wrist-pin bore plus square spot-faces on both barrel faces."""
    bore = (cq.Workplane("YZ", origin=(-PISTON_R - 2.0, y, PIN_Z))
            .circle(PIN_DIA / 2.0)
            .extrude(2.0 * PISTON_R + 4.0))
    spots = None
    for s in (1.0, -1.0):
        spot = (cq.Workplane("YZ", origin=(s * (PISTON_R - PIN_SPOT_DEPTH), y, PIN_Z))
                .rect(PIN_SPOT, PIN_SPOT)
                .extrude(s * PIN_SPOT_DEPTH))
        spots = spot if spots is None else spots.union(spot)
    return bore.union(spots)


# ---- build -----------------------------------------------------------
# backbone shaft with bushing pressed over the near end
result = cq.Workplane("ZX").circle(SHAFT_R).extrude(SHAFT_LEN)
result = result.union(
    cq.Workplane("ZX")
    .circle(BUSHING_OD / 2.0)
    .circle(BUSHING_ID / 2.0)
    .extrude(BUSHING_LEN))

for y in STATIONS:
    # crank disc on its bracket arm, then rod, piston and spacer ring
    result = result.union(make_crank(y))
    result = result.union(make_rod(y))
    result = result.union(make_piston(y))
    result = result.union(
        cq.Workplane("XY", origin=(0.0, y, RING_BOT_Z))
        .circle(RING_OD / 2.0)
        .circle(RING_ID / 2.0)
        .extrude(RING_THK))
    # wrist-pin bore pierces piston walls and rod boss after assembly
    result = result.cut(make_pin_cutters(y))