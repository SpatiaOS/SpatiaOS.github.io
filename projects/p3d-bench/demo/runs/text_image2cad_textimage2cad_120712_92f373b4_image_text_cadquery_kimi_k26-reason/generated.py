import cadquery as cq

# =============================================================================
# PARAMETERS
# =============================================================================

# Base cover (lower dome) – largest shell
BASE_LENGTH     = 304.0
BASE_WIDTH      = 159.0
BASE_HEIGHT     = 72.0
BASE_TOP_LENGTH = 252.0
BASE_TOP_WIDTH  = 132.0

# Cover plate – thin oval disc at the seam
PLATE_LENGTH = 242.0
PLATE_WIDTH  = 127.0
PLATE_THICK  = 6.0

# Housing cover (upper dome) – top shell with recessed control panel
HOUSING_LENGTH = 227.0
HOUSING_WIDTH  = 119.0
HOUSING_HEIGHT = 50.0

# Recessed oval panel on housing cover top
PANEL_LENGTH = 110.0
PANEL_WIDTH  = 55.0
PANEL_DEPTH  = 2.0

# Small raised features
DOT_RADIUS    = 2.5
DOT_HEIGHT    = 0.8
SYMBOL_HEIGHT = 0.6

# Base cover top-deck bosses (text: r=6.0, axial extent 8.0)
BOSS_RADIUS = 6.0
BOSS_HEIGHT = 8.0

# =============================================================================
# BASE COVER
# =============================================================================
# Pebble-shaped lower dome created by lofting elliptical cross-sections.
base_cover = (
    cq.Workplane("XY")
    .ellipse(BASE_LENGTH / 2.0, BASE_WIDTH / 2.0)
    .workplane(offset=BASE_HEIGHT * 0.25)
    .ellipse(BASE_LENGTH * 0.98 / 2.0, BASE_WIDTH * 0.98 / 2.0)
    .workplane(offset=BASE_HEIGHT * 0.25)
    .ellipse(BASE_LENGTH * 0.94 / 2.0, BASE_WIDTH * 0.94 / 2.0)
    .workplane(offset=BASE_HEIGHT * 0.25)
    .ellipse(BASE_LENGTH * 0.88 / 2.0, BASE_WIDTH * 0.88 / 2.0)
    .workplane(offset=BASE_HEIGHT * 0.25)
    .ellipse(BASE_TOP_LENGTH / 2.0, BASE_TOP_WIDTH / 2.0)
    .loft()
)

# Four small cylindrical bosses on the top deck
for dx, dy in ((40.0, 30.0), (-40.0, 30.0), (40.0, -30.0), (-40.0, -30.0)):
    boss = (
        cq.Workplane("XY")
        .workplane(offset=BASE_HEIGHT)
        .center(dx, dy)
        .circle(BOSS_RADIUS)
        .extrude(BOSS_HEIGHT)
    )
    base_cover = base_cover.union(boss)

# =============================================================================
# COVER PLATE
# =============================================================================
# Thin oval disc sandwiched at the seam between the two domes.
cover_plate = (
    cq.Workplane("XY")
    .workplane(offset=BASE_HEIGHT)
    .ellipse(PLATE_LENGTH / 2.0, PLATE_WIDTH / 2.0)
    .extrude(PLATE_THICK)
)

# =============================================================================
# HOUSING COVER
# =============================================================================
# Upper dome, smaller than the base, with a recessed top panel.
housing_cover = (
    cq.Workplane("XY")
    .ellipse(HOUSING_LENGTH / 2.0, HOUSING_WIDTH / 2.0)
    .workplane(offset=HOUSING_HEIGHT * 0.25)
    .ellipse(HOUSING_LENGTH * 0.95 / 2.0, HOUSING_WIDTH * 0.93 / 2.0)
    .workplane(offset=HOUSING_HEIGHT * 0.25)
    .ellipse(HOUSING_LENGTH * 0.88 / 2.0, HOUSING_WIDTH * 0.85 / 2.0)
    .workplane(offset=HOUSING_HEIGHT * 0.25)
    .ellipse(HOUSING_LENGTH * 0.80 / 2.0, HOUSING_WIDTH * 0.77 / 2.0)
    .workplane(offset=HOUSING_HEIGHT * 0.25)
    .ellipse(HOUSING_LENGTH * 0.72 / 2.0, HOUSING_WIDTH * 0.70 / 2.0)
    .loft()
    .translate((0.0, 0.0, BASE_HEIGHT + PLATE_THICK))
)

# Recessed oval panel on the top face
panel_cutter = (
    cq.Workplane("XY")
    .workplane(offset=BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT - PANEL_DEPTH)
    .ellipse(PANEL_LENGTH / 2.0, PANEL_WIDTH / 2.0)
    .extrude(PANEL_DEPTH)
)
housing_cover = housing_cover.cut(panel_cutter)

# Five small circular dot features inside the panel
dot_y = 14.0
for dx in (-24.0, -12.0, 0.0, 12.0, 24.0):
    dot = (
        cq.Workplane("XY")
        .workplane(offset=BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT - PANEL_DEPTH)
        .center(dx, dot_y)
        .circle(DOT_RADIUS)
        .extrude(DOT_HEIGHT)
    )
    housing_cover = housing_cover.union(dot)

# Embossed relief symbols arranged in a cross pattern below the dots
# Center symbol
center_sym = (
    cq.Workplane("XY")
    .workplane(offset=BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT - PANEL_DEPTH)
    .circle(3.5)
    .extrude(SYMBOL_HEIGHT)
)
housing_cover = housing_cover.union(center_sym)

# Four cardinal bars (N, S, E, W)
for dy in (16.0, -16.0):
    arm = (
        cq.Workplane("XY")
        .workplane(offset=BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT - PANEL_DEPTH)
        .center(0.0, dy)
        .rect(2.5, 9.0)
        .extrude(SYMBOL_HEIGHT)
    )
    housing_cover = housing_cover.union(arm)

for dx in (18.0, -18.0):
    arm = (
        cq.Workplane("XY")
        .workplane(offset=BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT - PANEL_DEPTH)
        .center(dx, 0.0)
        .rect(9.0, 2.5)
        .extrude(SYMBOL_HEIGHT)
    )
    housing_cover = housing_cover.union(arm)

# Approximate embossed brand text on the front slope of the housing cover
for i in range(-2, 3):
    text_bar = (
        cq.Workplane("XY")
        .transformed(
            offset=(HOUSING_LENGTH * 0.38, i * 2.8, BASE_HEIGHT + PLATE_THICK + HOUSING_HEIGHT * 0.38),
            rotate=(0.0, -22.0, 0.0)
        )
        .box(38.0, 1.5, 0.4, centered=True)
    )
    housing_cover = housing_cover.union(text_bar)

# =============================================================================
# ASSEMBLY
# =============================================================================
# Combine the three distinct solids into a single compound so that the
# circumferential seam and part boundaries remain visible.
result = cq.Compound.makeCompound([
    base_cover.val(),
    cover_plate.val(),
    housing_cover.val()
])