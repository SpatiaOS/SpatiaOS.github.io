import cadquery as cq

# =============================================================================
# Assembly Parameters
# =============================================================================
# Base plate
BASE_W = 309.0
BASE_D = 245.0
BASE_H = 28.0

# Housing cover
COVER_W = 300.0
COVER_D = 230.0
COVER_H = 45.0

# Cap (jog wheel)
CAP_DIA = 86.0
CAP_H = 20.0
CAP_SLOT_COUNT = 14
CAP_STEP_DIA = 60.5
CAP_STEP_DEPTH = 1.0

# Spacer block (tactile pad)
SPACER_W = 18.87
SPACER_D = 12.09
SPACER_H = 5.0
SPACER_FILLET = 2.0

# Pin
PIN_DIA = 1.5
PIN_LEN = 11.0

# Socket post
SOCKET_BASE_DIA = 14.89
SOCKET_H = 17.0
SOCKET_HOLE_DIA = 1.178

# Flanged bushing
BUSHING_FLANGE_DIA = 18.2
BUSHING_BOSS_DIA = 10.06
BUSHING_BOSS_LEN = 5.0
BUSHING_BORE_DIA = 4.92

# Wedge guide block
WEDGE_W = 8.0
WEDGE_D = 14.0
WEDGE_H = 18.0

# Structural bar
BAR_W = 1.10
BAR_D = 2.00
BAR_H = 20.0

# Locating pin
LOC_PIN_DIA = 14.9
LOC_PIN_H = 17.0
LOC_PIN_HOLE_DIA = 1.178

# Ball stud
BALL_STUD_DIA = 18.2
BALL_STUD_BORE_DIA = 4.92


# =============================================================================
# Base Plate
# =============================================================================
base = cq.Workplane("XY").box(BASE_W, BASE_D, BASE_H, centered=True).translate((0.0, 0.0, BASE_H / 2.0))

# Shallow elongated grooves on top face
for gy in [-80.0, 0.0, 80.0]:
    groove = cq.Workplane("XY").box(250.0, 4.0, 2.0, centered=True).translate((0.0, gy, BASE_H - 1.0))
    base = base.cut(groove)

# Corner notch
notch = cq.Workplane("XY").box(40.0, 40.0, BASE_H + 2.0, centered=True).translate((BASE_W / 2.0 - 20.0, BASE_D / 2.0 - 20.0, BASE_H / 2.0))
base = base.cut(notch)


# =============================================================================
# Housing Cover
# =============================================================================
cover = cq.Workplane("XY").box(COVER_W, COVER_D, COVER_H, centered=True).translate((0.0, 0.0, COVER_H / 2.0))

# Chamfer upper perimeter edges
cover = cover.faces(">Z").edges().chamfer(3.0)

# Circular recesses for jog-wheel caps
for cx, cy in [(-80.0, 0.0), (80.0, 0.0)]:
    recess = cq.Workplane("XY", origin=(cx, cy, COVER_H - 2.0)).circle(44.0).extrude(2.0)
    cover = cover.cut(recess)

# Rectangular pockets for spacer blocks (depth 3, corner fillet R1.0)
spacer_positions = [
    (-110.0, 60.0), (-90.0, 60.0), (-110.0, 80.0), (-90.0, 80.0),
    (-110.0, -60.0), (-90.0, -60.0), (-110.0, -80.0), (-90.0, -80.0),
    (110.0, 60.0), (90.0, 60.0), (110.0, 80.0), (90.0, 80.0),
    (110.0, -60.0), (90.0, -60.0), (110.0, -80.0), (90.0, -80.0),
    (-40.0, 70.0), (-20.0, 70.0), (20.0, 70.0), (40.0, 70.0),
    (-40.0, -70.0), (-20.0, -70.0), (20.0, -70.0), (40.0, -70.0),
    (-70.0, 0.0), (70.0, 0.0),
]

for sx, sy in spacer_positions:
    pocket = (
        cq.Workplane("XY", origin=(sx, sy, COVER_H - 1.5))
        .box(SPACER_W, SPACER_D, 3.0, centered=True)
        .edges("|Z")
        .fillet(1.0)
    )
    cover = cover.cut(pocket)


# =============================================================================
# Cap (Jog Wheel)
# =============================================================================
def make_cap():
    # Conical skirt: base radius 45, top radius 43, height 2
    skirt = cq.Workplane("XY").circle(45.0).workplane(offset=2.0).circle(43.0).loft()
    # Main cylindrical body: radius 43, height 16 (z=2..18)
    body = cq.Workplane("XY").circle(43.0).extrude(16.0).translate((0.0, 0.0, 2.0))
    cap = skirt.union(body)
    # Raised central plateau
    plateau = (
        cq.Workplane("XY")
        .circle(CAP_STEP_DIA / 2.0)
        .extrude(CAP_STEP_DEPTH)
        .translate((0.0, 0.0, 18.0))
    )
    cap = cap.union(plateau)
    # Small hemispherical indicator boss
    boss = cq.Solid.makeSphere(1.0).translate((0.0, 0.0, 19.0))
    cap = cap.union(boss)
    # Peripheral slots
    for i in range(CAP_SLOT_COUNT):
        angle = i * 360.0 / CAP_SLOT_COUNT
        slot = (
            cq.Workplane("XY")
            .box(6.0, 2.0, 12.0, centered=True)
            .translate((43.0, 0.0, 10.0))
            .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), angle)
        )
        cap = cap.cut(slot)
    return cap


caps = make_cap().translate((-80.0, 0.0, COVER_H))
caps = caps.union(make_cap().translate((80.0, 0.0, COVER_H)))


# =============================================================================
# Spacer Blocks
# =============================================================================
def make_spacer_block():
    block = cq.Workplane("XY").box(SPACER_W, SPACER_D, SPACER_H, centered=True)
    block = block.faces(">Z").edges().fillet(SPACER_FILLET)
    return block


spacers = make_spacer_block().translate((spacer_positions[0][0], spacer_positions[0][1], COVER_H - 3.0 + SPACER_H / 2.0))
for sx, sy in spacer_positions[1:]:
    sb = make_spacer_block().translate((sx, sy, COVER_H - 3.0 + SPACER_H / 2.0))
    spacers = spacers.union(sb)


# =============================================================================
# Pins
# =============================================================================
pin_positions = [
    (-60.0, -60.0), (-60.0, -40.0), (-60.0, 40.0), (-60.0, 60.0),
    (60.0, -60.0), (60.0, -40.0), (60.0, 40.0), (60.0, 60.0),
    (0.0, -50.0), (0.0, 0.0), (0.0, 50.0),
]

pins = cq.Workplane("XY").circle(PIN_DIA / 2.0).extrude(PIN_LEN).translate((pin_positions[0][0], pin_positions[0][1], COVER_H))
for px, py in pin_positions[1:]:
    p = cq.Workplane("XY").circle(PIN_DIA / 2.0).extrude(PIN_LEN).translate((px, py, COVER_H))
    pins = pins.union(p)


# =============================================================================
# Socket Posts
# =============================================================================
def make_socket_post():
    profile = (
        cq.Workplane("XZ")
        .moveTo(0.0, 0.0)
        .lineTo(SOCKET_BASE_DIA / 2.0, 0.0)
        .lineTo(SOCKET_BASE_DIA / 2.0, 2.0)
        .lineTo(4.0, SOCKET_H)
        .lineTo(0.0, SOCKET_H)
        .close()
    )
    post = profile.revolve()
    post = post.cut(cq.Workplane("XY").circle(SOCKET_HOLE_DIA / 2.0).extrude(SOCKET_H))
    return post


socket_positions = [
    (-100.0, -50.0), (-100.0, 50.0), (-50.0, -100.0), (-50.0, 100.0),
    (100.0, -50.0), (100.0, 50.0), (50.0, -100.0), (50.0, 100.0),
]

sockets = make_socket_post().translate((socket_positions[0][0], socket_positions[0][1], COVER_H))
for spx, spy in socket_positions[1:]:
    sp = make_socket_post().translate((spx, spy, COVER_H))
    sockets = sockets.union(sp)


# =============================================================================
# Flanged Bushings (front panel jacks)
# =============================================================================
def make_bushing():
    flange = cq.Workplane("XY").circle(BUSHING_FLANGE_DIA / 2.0).extrude(2.0)
    boss = cq.Workplane("XY").circle(BUSHING_BOSS_DIA / 2.0).extrude(BUSHING_BOSS_LEN + 2.0).translate((0.0, 0.0, 2.0))
    bushing = flange.union(boss)
    bushing = bushing.cut(cq.Workplane("XY").circle(BUSHING_BORE_DIA / 2.0).extrude(BUSHING_BOSS_LEN + 4.0))
    return bushing


bushing_x = [-100.0, -60.0, -20.0, 20.0, 60.0, 100.0]
bushings = make_bushing().rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), -90.0).translate((bushing_x[0], -COVER_D / 2.0 + 1.0, 15.0))
for bx in bushing_x[1:]:
    b = make_bushing().rotate((0.0, 0.0, 0.0), (1.0, 0.0, 0.0), -90.0).translate((bx, -COVER_D / 2.0 + 1.0, 15.0))
    bushings = bushings.union(b)


# =============================================================================
# Wedge Guide Blocks
# =============================================================================
def make_wedge():
    wedge = (
        cq.Workplane("XY")
        .rect(WEDGE_W, WEDGE_D, centered=True)
        .workplane(offset=WEDGE_H)
        .rect(WEDGE_W * 0.5, WEDGE_D * 0.7, centered=True)
        .loft()
    )
    groove = cq.Workplane("XY").box(2.0, WEDGE_D, 1.5, centered=True).translate((0.0, 0.0, WEDGE_H - 0.75))
    wedge = wedge.cut(groove)
    return wedge


wedges = make_wedge().translate((-20.0, 0.0, COVER_H))
wedges = wedges.union(make_wedge().translate((0.0, 0.0, COVER_H)))
wedges = wedges.union(make_wedge().translate((20.0, 0.0, COVER_H)))


# =============================================================================
# Structural Bars
# =============================================================================
bars = cq.Workplane("XY").box(BAR_W, BAR_D, BAR_H, centered=True).translate((-15.0, 15.0, COVER_H + BAR_H / 2.0))
bars = bars.union(cq.Workplane("XY").box(BAR_W, BAR_D, BAR_H, centered=True).translate((0.0, 15.0, COVER_H + BAR_H / 2.0)))
bars = bars.union(cq.Workplane("XY").box(BAR_W, BAR_D, BAR_H, centered=True).translate((15.0, 15.0, COVER_H + BAR_H / 2.0)))


# =============================================================================
# Locating Pins
# =============================================================================
def make_locating_pin():
    # Cylindrical base
    pin = cq.Workplane("XY").circle(LOC_PIN_DIA / 2.0).extrude(2.0)
    # Conical taper transitioning to a narrower shank
    taper = (
        cq.Workplane("XY", origin=(0.0, 0.0, 2.0))
        .circle(LOC_PIN_DIA / 2.0)
        .workplane(offset=7.45)
        .circle(2.0)
        .loft()
    )
    pin = pin.union(taper)
    # Domed head (sphere resting on the base)
    pin = pin.union(cq.Solid.makeSphere(LOC_PIN_DIA / 2.0).translate((0.0, 0.0, 2.0 + LOC_PIN_DIA / 2.0)))
    # Perpendicular cross-hole through the shank
    hole = (
        cq.Workplane("YZ")
        .circle(LOC_PIN_HOLE_DIA / 2.0)
        .extrude(20.0)
        .translate((0.0, 0.0, 8.0))
    )
    pin = pin.cut(hole)
    return pin


loc_pins = make_locating_pin().translate((-120.0, -120.0, BASE_H))
loc_pins = loc_pins.union(make_locating_pin().translate((120.0, -120.0, BASE_H)))
loc_pins = loc_pins.union(make_locating_pin().translate((0.0, 120.0, BASE_H)))


# =============================================================================
# Ball Studs
# =============================================================================
def make_ball_stud():
    stud = cq.Workplane("XY").circle(BALL_STUD_DIA / 2.0).extrude(8.0)
    stud = stud.union(cq.Solid.makeSphere(BALL_STUD_DIA / 2.0).translate((0.0, 0.0, 8.0 + BALL_STUD_DIA / 2.0)))
    stud = stud.cut(cq.Workplane("XY").circle(BALL_STUD_BORE_DIA / 2.0).extrude(8.0))
    return stud


ball_studs = make_ball_stud().translate((-130.0, 0.0, COVER_H))
ball_studs = ball_studs.union(make_ball_stud().translate((130.0, 0.0, COVER_H)))


# =============================================================================
# Final Unified Assembly
# =============================================================================
result = (
    base.union(cover)
    .union(caps)
    .union(spacers)
    .union(pins)
    .union(sockets)
    .union(bushings)
    .union(wedges)
    .union(bars)
    .union(loc_pins)
    .union(ball_studs)
)