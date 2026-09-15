import cadquery as cq

# ------------------------------------------------------------------
# Parameters (mm)
# ------------------------------------------------------------------
THICKNESS = 7.0            # common plate thickness (X direction)
PIVOT_HOLE_D = 1.583       # pivot bore diameter (through the thin direction)
PIVOT_BOSS_R = 2.654       # small boss surrounding the pivot bore
BLADE_TILT = 4.0           # crossing half-angle of the two halves (deg)

# Blade half A : large finger loop, ~154 mm overall
A_BLADE_LEN = 88.0
A_BACK_CURVE = [(4.9, -18.0), (5.05, -45.0), (3.6, -70.0)]   # bowed back edge
A_LOOP_C = (8.0, 45.0)     # (y, z) finger-loop centre
A_LOOP_RO, A_LOOP_RI = 22.5, 16.0
A_NECK_TOP = 26.0

# Blade half B : small finger loop, ~159 mm overall
B_BLADE_LEN = 96.0
B_BACK_CURVE = [(4.9, -22.0), (5.05, -52.0), (3.6, -78.0)]
B_LOOP_C = (-7.5, 50.0)
B_LOOP_RO, B_LOOP_RI = 13.0, 8.8
B_NECK_TOP = 39.0

# Slotted knob fastener (spool: two domed heads + central shaft)
HEAD1_R, HEAD2_R = 2.66, 2.56
HEAD_T = 0.95
SHAFT_R = 0.876
POCKET1_R, POCKET2_R = 2.90, 2.75   # countersink pockets in the plates
SLOT_W, SLOT_DEPTH = 1.1, 0.62


def blade_half(sign, blade_len, back_curve, loop_c, loop_ro, loop_ri, neck_top):
    """One scissor half: tapered blade + angled neck + finger-loop ring,
    sketched in the YZ plane and extruded along +X. `sign` mirrors it."""
    loop_cy, loop_cz = loop_c

    # Blade: straight cutting edge, gently bowed spline back edge, pointed tip
    back_pts = [(sign * y, z) for (y, z) in back_curve] + [(0.0, -blade_len)]
    blade = (
        cq.Workplane("YZ")
        .moveTo(sign * -3.6, 2.0)            # root on cutting-edge side
        .lineTo(sign * 3.9, 2.0)             # root on back side
        .spline(back_pts, includeCurrent=True)
        .close()                             # straight cutting edge down to tip
        .extrude(THICKNESS)
    )

    # Neck joining the pivot region to the loop, angled outward
    neck = (
        cq.Workplane("YZ")
        .moveTo(-4.3, -1.0)
        .lineTo(4.3, -1.0)
        .lineTo(loop_cy + 4.0, neck_top)
        .lineTo(loop_cy - 4.0, neck_top)
        .close()
        .extrude(THICKNESS)
    )

    # Finger loop: outer disc with the loop hole cut through
    ring = (
        cq.Workplane("YZ").center(loop_cy, loop_cz).circle(loop_ro).extrude(THICKNESS)
        .cut(cq.Workplane("YZ").center(loop_cy, loop_cz).circle(loop_ri).extrude(THICKNESS))
    )

    # Pivot boss around the bore
    boss = cq.Workplane("YZ").circle(PIVOT_BOSS_R).extrude(THICKNESS)

    return blade.union(neck).union(ring).union(boss)


# ---- the two crossing blade halves (tilted about the X axis) ----
half_a = (
    blade_half(+1, A_BLADE_LEN, A_BACK_CURVE, A_LOOP_C,
               A_LOOP_RO, A_LOOP_RI, A_NECK_TOP)
    .rotate((0, 0, 0), (1, 0, 0), -BLADE_TILT)
)
half_b = (
    blade_half(-1, B_BLADE_LEN, B_BACK_CURVE, B_LOOP_C,
               B_LOOP_RO, B_LOOP_RI, B_NECK_TOP)
    .rotate((0, 0, 0), (1, 0, 0), BLADE_TILT)
)

body = half_a.union(half_b)

# ---- pivot bore through both halves at the crossing point ----
pivot_hole = (
    cq.Workplane("YZ", origin=(-1.0, 0, 0))
    .circle(PIVOT_HOLE_D / 2.0)
    .extrude(THICKNESS + 2.0)
)

# ---- countersink pockets so the fastener heads sit flush ----
pocket_near = cq.Workplane("YZ").circle(POCKET1_R).extrude(1.0)
pocket_far = (
    cq.Workplane("YZ", origin=(THICKNESS - 1.0, 0, 0))
    .circle(POCKET2_R)
    .extrude(1.0)
)

body = body.cut(pivot_hole).cut(pocket_near).cut(pocket_far)

# ---- slotted knob fastener: head / shaft / head spool along X ----
fastener = (
    cq.Workplane("YZ", origin=(0.03, 0, 0)).circle(HEAD1_R).extrude(HEAD_T)
    .union(
        cq.Workplane("YZ", origin=(0.96, 0, 0))
        .circle(SHAFT_R)
        .extrude(THICKNESS - 1.92)
    )
    .union(
        cq.Workplane("YZ", origin=(THICKNESS - 0.98, 0, 0))
        .circle(HEAD2_R)
        .extrude(HEAD_T)
    )
)

# slightly domed head rims
fastener = fastener.edges("<X").fillet(0.25).edges(">X").fillet(0.25)

# driver slot cut across the near head
slot = (
    cq.Workplane("YZ", origin=(-0.2, 0, 0))
    .rect(SLOT_W, 6.0)
    .extrude(SLOT_DEPTH + 0.2)
)
fastener = fastener.cut(slot)

# ---- unified assembly ----
result = body.union(fastener)