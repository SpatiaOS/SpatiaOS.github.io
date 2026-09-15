import cadquery as cq

# =============================================================================
#  PARAMETERS  (all dimensions in mm)
# =============================================================================
# --- shaft bar with integral disc bosses -------------------------------------
SHAFT_LEN, SHAFT_DIA = 438.0, 6.0          # backbone rod (runs the full length)
BOSS_DIA, BOSS_THK = 30.0, 14.0            # 4 disc bosses
BRACKET_L, BRACKET_W, BRACKET_H = 20.0, 6.0, 26.0
BRACKET_SLOT_L, BRACKET_SLOT_H = 8.0, 9.0

# --- bushing at the end of the shaft -----------------------------------------
BUSH_OD, BUSH_ID, BUSH_LEN = 8.0, 5.8, 5.0

# --- piston -------------------------------------------------------------------
PISTON_D, PISTON_H = 50.0, 40.0            # OD / height
SKIRT_D, SKIRT_DEPTH = 40.0, 24.0          # lower skirt bore
POCKET_D, POCKET_TOP = 30.0, 34.0          # blind pocket under the crown
GROOVE_Z, GROOVE_W, GROOVE_DEPTH = 30.0, 3.0, 1.5   # ring groove
PIN_D, PIN_Z = 12.0, 16.0                  # wrist pin bore

# --- spacer ring ---------------------------------------------------------------
SPACER_OD, SPACER_ID, SPACER_H, SPACER_Z = 54.56, 49.8, 5.0, 33.0

# --- connecting rod -------------------------------------------------------------
ROD_LEN = 46.0                             # big-end centre -> wrist pin centre
BIG_OD, BIG_BORE, BIG_THK = 40.0, 29.8, 16.0
SMALL_OD, SMALL_BORE, SMALL_THK = 28.0, 12.0, 10.0
SHANK_Z0, SHANK_W0, SHANK_W1 = 16.0, 16.0, 10.0      # shank Y widths
SHANK_T0, SHANK_T1 = 14.0, 10.0                      # shank X thicknesses
WEB_T, FLANGE_T = 3.0, 2.5                           # I-beam web / flange

# --- layout ---------------------------------------------------------------------
STATIONS = [72.0, 167.0, 262.0, 357.0]     # X position of each rod / piston
PISTON_Z0 = ROD_LEN - PIN_Z                # piston bottom face above shaft axis

# =============================================================================
#  PISTON  (axis = Z, bottom face at z = 0)
# =============================================================================
def make_piston():
    body = cq.Workplane("XY").circle(PISTON_D / 2).extrude(PISTON_H)

    # lower skirt bore, open at the bottom
    body = body.cut(cq.Workplane("XY").circle(SKIRT_D / 2).extrude(SKIRT_DEPTH))

    # blind pocket that leaves the flat crown
    body = body.cut(cq.Workplane("XY").workplane(offset=SKIRT_DEPTH)
                    .circle(POCKET_D / 2).extrude(POCKET_TOP - SKIRT_DEPTH))

    # circumferential compression-ring groove (annular cutter)
    groove = (cq.Workplane("XY").workplane(offset=GROOVE_Z)
              .circle(PISTON_D / 2 + 2.0).extrude(GROOVE_W)
              .cut(cq.Workplane("XY").workplane(offset=GROOVE_Z - 1.0)
                   .circle(PISTON_D / 2 - GROOVE_DEPTH).extrude(GROOVE_W + 2.0)))
    body = body.cut(groove)

    # transverse wrist-pin bore (parallel to the shaft = X)
    body = body.cut(cq.Workplane("YZ").circle(PIN_D / 2)
                    .extrude(PISTON_D, both=True).translate((0, 0, PIN_Z)))
    return body

# =============================================================================
#  SPACER RING
# =============================================================================
def make_spacer():
    ring = (cq.Workplane("XY").circle(SPACER_OD / 2).extrude(SPACER_H)
            .cut(cq.Workplane("XY").circle(SPACER_ID / 2).extrude(SPACER_H)))
    return ring.translate((0, 0, SPACER_Z))

# =============================================================================
#  CONNECTING ROD  (local origin = big-end centre, rod axis = +Z)
# =============================================================================
def make_rod():
    # big-end eye - bore parallel to the shaft
    eye = (cq.Workplane("YZ").circle(BIG_OD / 2).extrude(BIG_THK / 2, both=True)
           .cut(cq.Workplane("YZ").circle(BIG_BORE / 2).extrude(BIG_THK, both=True)))

    # small-end eye at the wrist pin
    small = (cq.Workplane("YZ").circle(SMALL_OD / 2).extrude(SMALL_THK / 2, both=True)
             .cut(cq.Workplane("YZ").circle(SMALL_BORE / 2).extrude(SMALL_THK, both=True))
             .translate((0, 0, ROD_LEN)))

    # tapered shank (loft between two rectangles)
    shank = (cq.Workplane("XY").workplane(offset=SHANK_Z0)
             .rect(SHANK_T0, SHANK_W0)
             .workplane(offset=ROD_LEN - SHANK_Z0)
             .rect(SHANK_T1, SHANK_W1)
             .loft())

    # I-beam relief: remove a wedge from both X faces of the shank
    def web_half(z):
        t = (z - SHANK_Z0) / (ROD_LEN - SHANK_Z0)
        return (SHANK_W0 + (SHANK_W1 - SHANK_W0) * t) / 2.0 - FLANGE_T

    z_lo, z_hi = SHANK_Z0 - 6.0, ROD_LEN + 6.0
    for sgn in (1.0, -1.0):
        cutter = (cq.Workplane("XY").workplane(offset=z_lo)
                  .rect(60.0, 2 * web_half(z_lo))
                  .workplane(offset=z_hi - z_lo)
                  .rect(60.0, 2 * web_half(z_hi))
                  .loft()
                  .translate((sgn * (WEB_T / 2 + 30.0), 0, 0)))
        shank = shank.cut(cutter)

    return eye.union(small).union(shank)

# =============================================================================
#  SHAFT BAR WITH DISC BOSSES AND END BUSHING  (axis = X)
# =============================================================================
def make_shaft():
    bar = cq.Workplane("YZ").circle(SHAFT_DIA / 2).extrude(SHAFT_LEN)

    for x in STATIONS:
        # disc boss
        boss = (cq.Workplane("YZ").circle(BOSS_DIA / 2)
                .extrude(BOSS_THK / 2, both=True).translate((x, 0, 0)))
        # rectangular bracket arm beside the boss (with a through slot)
        bracket = (cq.Workplane("XY").box(BRACKET_L, BRACKET_W, BRACKET_H)
                   .cut(cq.Workplane("XY").box(BRACKET_SLOT_L, 3 * BRACKET_W,
                                               BRACKET_SLOT_H))
                   .translate((x + BOSS_THK / 2 + BRACKET_L / 2, 0, 0)))
        bar = bar.union(boss).union(bracket)

    # bushing at the free end of the shaft
    bushing = (cq.Workplane("YZ").circle(BUSH_OD / 2).extrude(BUSH_LEN)
               .cut(cq.Workplane("YZ").circle(BUSH_ID / 2).extrude(BUSH_LEN + 2.0)))
    return bar.union(bushing)

# =============================================================================
#  ASSEMBLY
# =============================================================================
result = make_shaft()

for x in STATIONS:
    result = result.union(make_rod().translate((x, 0, 0)))
    result = result.union(make_piston().translate((x, 0, PISTON_Z0)))
    result = result.union(make_spacer().translate((x, 0, PISTON_Z0)))