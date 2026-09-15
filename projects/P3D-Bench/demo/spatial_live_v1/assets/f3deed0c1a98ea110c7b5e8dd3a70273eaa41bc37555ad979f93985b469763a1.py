import cadquery as cq
import math

# =====================================================================
#  High-rise residential tower
#  -------------------------------------------------------------------
#  Interpretation of the image:
#   - slender ~15 storey tower standing on a plinth + podium slab
#   - right facade : regular grid of recessed windows (6 bays / floor)
#   - front facade : wide recessed balconies with low parapets
#   - one rounded corner (rear-left) with vertical mullion grooves
#   - flat roof with parapet deck + gabled roof structure (left half)
#   - low annex with open rooftop courtyard at the front-left base
#   - chamfered low volume attached at the right side of the base
# =====================================================================

# ----------------------------- parameters ----------------------------
floor_h  = 3.0                       # storey height
n_floors = 15                        # number of storeys
tower_h  = n_floors * floor_h        # main tower height

tower_w  = 16.0                      # footprint X -> front (balcony) facade
tower_d  = 12.0                      # footprint Y -> right (window) facade
corner_r = 5.0                       # rounded corner radius (rear-left)

start_z  = 2 * floor_h               # openings begin above the plinth
n_open   = n_floors - 2              # storeys with windows / balconies

# window grid (right facade, normal +X)
n_bays    = 6
bay_pitch = 1.95
pane_w    = 0.55
pane_h    = 1.90
pane_off  = 0.45                     # pane offset from bay centre
win_depth = 0.30

# balconies (front facade, normal +Y)
balc_xs  = [-1.60, 0.95, 3.50, 6.05]
balc_w   = 2.20
balc_h   = 1.90
balc_dep = 1.00
front_h  = 0.75                      # balcony parapet height
front_t  = 0.30                      # balcony parapet thickness

# plinth + podium
base_h, base_off     = 5.8, 0.7
podium_h, podium_off = 1.4, 1.4

# roof
parapet_h = 1.3
deck_t    = 0.35
gable_h   = 5.0

# annex building with rooftop courtyard
annex_w, annex_d, annex_h = 9.0, 10.0, 8.0
pit_t, pit_dep            = 0.9, 2.8

# chamfered side volume
side_w, side_d, side_h = 5.6, 10.5, 6.4
side_cham = 2.2

# plan centre of the rounded corner arc
arc_c = (-(tower_w / 2 - corner_r), tower_d / 2 - corner_r)

# ----------------------------- tower body ----------------------------
tower = (
    cq.Workplane("XY")
    .rect(tower_w, tower_d)
    .extrude(tower_h)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r)                          # round the rear-left corner
)

# ------------------------- window grid (right) -----------------------
win_pts = []
for k in range(n_open):
    zc = start_z + 1.65 + k * floor_h          # one row of windows per storey
    for j in range(n_bays):
        yc = (j - (n_bays - 1) / 2.0) * bay_pitch
        win_pts += [(yc - pane_off, zc), (yc + pane_off, zc)]   # pane pairs

win_cutter = (
    cq.Workplane("YZ")
    .workplane(offset=tower_w / 2 + 0.1)
    .pushPoints(win_pts)
    .rect(pane_w, pane_h)
    .extrude(-(win_depth + 0.1))
)
tower = tower.cut(win_cutter)

# ------------------------- balconies (front) -------------------------
balc_pts = [
    (start_z + 1.95 + k * floor_h, xc)
    for k in range(n_open)
    for xc in balc_xs
]
balc_cutter = (
    cq.Workplane("ZX")
    .workplane(offset=tower_d / 2 + 0.1)
    .pushPoints(balc_pts)
    .rect(balc_h, balc_w)
    .extrude(-(balc_dep + 0.1))
)
tower = tower.cut(balc_cutter)

# protruding balcony parapets below each recess
balc_fronts = None
for k in range(n_open):
    zb = start_z + 0.1 + k * floor_h
    pts = [(xc, tower_d / 2 + 0.1) for xc in balc_xs]
    wp = (
        cq.Workplane("XY")
        .workplane(offset=zb)
        .pushPoints(pts)
        .rect(balc_w, front_t)
        .extrude(front_h)
    )
    balc_fronts = wp if balc_fronts is None else balc_fronts.union(wp)
tower = tower.union(balc_fronts)

# ------------------ mullion grooves on rounded corner ----------------
mull = None
for ang in range(105, 166, 15):
    a = math.radians(ang)
    px = arc_c[0] + corner_r * math.cos(a)
    py = arc_c[1] + corner_r * math.sin(a)
    m = (
        cq.Workplane("XY")
        .box(0.30, 0.14, tower_h, centered=(True, True, False))
        .rotate((0, 0, 0), (0, 0, 1), ang)     # radial orientation
        .translate((px, py, 0))
    )
    mull = m if mull is None else mull.union(m)
tower = tower.cut(mull)

building = tower

# ------------------------ plinth + entrance --------------------------
base = (
    cq.Workplane("XY")
    .rect(tower_w + 2 * base_off, tower_d + 2 * base_off)
    .extrude(base_h)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r + base_off)
)
building = building.union(base)

# recessed entrance panel on the plinth front face
panel = (
    cq.Workplane("ZX")
    .workplane(offset=tower_d / 2 + base_off + 0.05)
    .center(2.2, 2.0)
    .rect(2.2, 3.4)
    .extrude(-0.2)
)
building = building.cut(panel)

# ------------------------------ podium -------------------------------
podium = (
    cq.Workplane("XY")
    .rect(tower_w + 2 * podium_off, tower_d + 2 * podium_off)
    .extrude(podium_h)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r + podium_off)
)
building = building.union(podium)

# ---------------------- chamfered side volume ------------------------
side = (
    cq.Workplane("XY", origin=(tower_w / 2 + side_w / 2, -0.75, 0))
    .box(side_w, side_d, side_h, centered=(True, True, False))
    .edges("|Z").edges(">X").edges(">Y")
    .chamfer(side_cham)                        # angled corner face
)
building = building.union(side)

# --------------------------- roof + parapet --------------------------
# overhanging parapet ring with visible roof deck
parapet_outer = (
    cq.Workplane("XY")
    .workplane(offset=tower_h)
    .rect(tower_w + 1.0, tower_d + 1.0)
    .extrude(parapet_h)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r + 0.5)
)
parapet_inner = (
    cq.Workplane("XY")
    .workplane(offset=tower_h + deck_t)
    .rect(tower_w, tower_d)
    .extrude(parapet_h + 0.2)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r)
)
building = building.union(parapet_outer.cut(parapet_inner))

# gabled roof structure over the left half (clipped to the plan)
gable = (
    cq.Workplane("XZ", origin=(0, tower_d / 2, 0))
    .polyline([
        (-6.6, tower_h + deck_t),
        (1.0, tower_h + deck_t),
        (-2.8, tower_h + deck_t + gable_h),
    ])
    .close()
    .extrude(tower_d)
)
clip = (
    cq.Workplane("XY")
    .rect(tower_w + 1.0, tower_d + 1.0)
    .extrude(tower_h + deck_t + gable_h + 1.0)
    .edges("|Z").edges(">Y").edges("<X")
    .fillet(corner_r + 0.5)
)
building = building.union(gable.intersect(clip))

# --------------------- annex with roof courtyard ---------------------
annex_cx = -tower_w / 2 - annex_w / 2
annex = (
    cq.Workplane("XY", origin=(annex_cx, 2.0, 0))
    .box(annex_w, annex_d, annex_h, centered=(True, True, False))
)
pit = (
    cq.Workplane("XY", origin=(annex_cx, 2.0, annex_h - pit_dep))
    .box(annex_w - 2 * pit_t, annex_d - 2 * pit_t, pit_dep + 0.5,
         centered=(True, True, False))
)
building = building.union(annex.cut(pit))      # open rooftop courtyard

# small pole inside the courtyard
pole = (
    cq.Workplane("XY", origin=(annex_cx - 1.5, 1.2, annex_h - pit_dep))
    .circle(0.09)
    .extrude(2.4)
)
building = building.union(pole)

result = building