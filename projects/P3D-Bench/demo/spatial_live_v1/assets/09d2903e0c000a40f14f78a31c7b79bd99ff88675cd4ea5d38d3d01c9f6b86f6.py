"""
High-rise tower recreated from the reference image.

Interpretation of the reference geometry:
  * A slender rectangular tower (~20 storeys) with two modelled facades:
      - FRONT (-Y) : recessed glazing bands per storey + a strip of projecting
                     balcony/brise-soleil slabs on the left-hand side.
      - SIDE  (+X) : dense grid of recessed windows (4 per storey).
  * Crown: a hipped "mansard" skirt (canopy) around the top of the shaft,
           a set-back penthouse block and an asymmetric-looking gable roof
           whose ridge runs front-to-back (triangular gable faces +/-Y).
  * Base: a solid plinth wrapping the lower part of the tower plus a low
          podium wing on the left with a parapet-rimmed roof terrace.
"""

import cadquery as cq

# ======================================================================
# Parameters (arbitrary units, proportions taken from the image)
# ======================================================================

# --- tower shaft ------------------------------------------------------
tower_w = 16.0                       # width  of the tower (X)
tower_d = 13.0                       # depth  of the tower (Y)
n_floors = 20                        # number of storeys
floor_h = 3.6                        # storey height
tower_h = n_floors * floor_h         # shaft height = 72.0

# --- front facade (-Y): recessed glazing band -------------------------
front_band_w = 10.0                  # width of the glazed band
front_band_xc = 1.5                  # X-centre of the band (pier on the right)
front_band_h = 2.2                   # band height
front_sill = 0.9                     # floor -> band bottom
front_recess = 0.6                   # set-back of the glass from the face

# --- front facade: projecting balcony slabs ---------------------------
slat_w = 5.5                         # width of the projecting strip
slat_h = 0.5                         # slab thickness
slat_proj = 0.9                      # projection in front of the facade
slat_z = 0.1                         # clearance above the floor line

# --- side facade (+X): window grid ------------------------------------
n_cols = 4                           # windows per storey
win_margin = 1.1                     # solid pier at each end of the depth
win_gap = 0.7                        # pier between windows
win_w = (tower_d - 2 * win_margin - (n_cols - 1) * win_gap) / n_cols
win_h = 2.2
win_sill = 0.8
win_recess = 0.5                     # window set-back

# --- crown ------------------------------------------------------------
canopy_h = 5.0                       # height of the hip skirt
canopy_over = 3.0                    # eave overhang past the shaft
tb_inset = 1.0                       # penthouse set-back per side
top_block_h = 11.0                   # penthouse height
roof_h = 6.0                         # gable rise
roof_over = 0.8                      # gable overhang

# --- base -------------------------------------------------------------
plinth_h = 7.2                       # solid base of the tower (2 storeys)
podium_h = 8.5                       # low wing on the left
podium_ext = 10.0                    # how far the wing extends in -X
parapet = 0.8                        # parapet width on the podium roof


# ======================================================================
# Helper: an array of identical boxes placed on a named work plane
# ======================================================================
def box_array(plane, offset, points, lx, ly, lz):
    """
    Create one Workplane containing a box (lx * ly * lz) at every 2-D point.
    * plane  : "XZ"  -> (lx = X, ly = Z, lz = Y)
               "YZ"  -> (lx = Y, ly = Z, lz = X)
    * offset : shift along the plane normal (the plane sits at the given face)
    """
    return (
        cq.Workplane(plane)
        .workplane(offset=offset)
        .pushPoints(points)
        .box(lx, ly, lz)
    )


# ======================================================================
# 1. Tower shaft
# ======================================================================
tower = (
    cq.Workplane("XY")
    .box(tower_w, tower_d, tower_h)          # centred on the origin
    .translate((0, 0, tower_h / 2))          # base on Z = 0
)

# --- front glazing bands: one recessed band per storey ----------------
band_pts = [
    (front_band_xc, i * floor_h + front_sill + front_band_h / 2)
    for i in range(n_floors)
]
front_cut = box_array(
    "XZ", tower_d / 2, band_pts,
    front_band_w, front_band_h, 2 * front_recess
)

# --- side window grid: 4 columns x 20 rows ----------------------------
col_centres = [
    -tower_d / 2 + win_margin + win_w / 2 + k * (win_w + win_gap)
    for k in range(n_cols)
]
win_pts = [
    (yc, i * floor_h + win_sill + win_h / 2)
    for i in range(n_floors)
    for yc in col_centres
]
side_cut = box_array("YZ", tower_w / 2, win_pts, win_w, win_h, 2 * win_recess)

# subtract both facade patterns from the shaft
tower = tower.cut(front_cut).cut(side_cut)

# --- balcony slabs projecting from the left part of the front face ----
slat_pts = [
    (-tower_w / 2 + slat_w / 2, i * floor_h + slat_z + slat_h / 2)
    for i in range(n_floors)
]
slats = box_array(
    "XZ", tower_d / 2 + slat_proj / 2, slat_pts,
    slat_w, slat_h, slat_proj
)
tower = tower.union(slats)


# ======================================================================
# 2. Crown: hip canopy, penthouse block and gable roof
# ======================================================================
tb_w = tower_w - 2 * tb_inset        # penthouse footprint
tb_d = tower_d - 2 * tb_inset

# hipped skirt: large rectangle at the shaft top lofted to the penthouse
canopy = (
    cq.Workplane("XY")
    .workplane(offset=tower_h)
    .rect(tower_w + 2 * canopy_over, tower_d + 2 * canopy_over)
    .workplane(offset=canopy_h)
    .rect(tb_w, tb_d)
    .loft()
)

# set-back penthouse block
top_block = (
    cq.Workplane("XY")
    .box(tb_w, tb_d, top_block_h)
    .translate((0, 0, tower_h + canopy_h + top_block_h / 2))
)

# gable roof (ridge along Y -> triangular gable faces look to +/-Y)
roof_base = tower_h + canopy_h + top_block_h
roof = (
    cq.Workplane("XZ")
    .moveTo(-(tb_w / 2 + roof_over), 0)
    .lineTo(tb_w / 2 + roof_over, 0)
    .lineTo(0, roof_h)
    .close()
    .extrude(tb_d / 2 + roof_over, both=True)
    .translate((0, 0, roof_base))
)


# ======================================================================
# 3. Base: solid plinth under the tower + podium wing on the left
# ======================================================================
# plinth: widens the bottom two storeys of the right-hand side of the tower
plinth = (
    cq.Workplane("XY")
    .box(13.5, tower_d + 3, plinth_h)
    .translate((4.25, 0, plinth_h / 2))          # X: -2.5 ... 11
)

# podium wing: low block to the left of the tower, set back from its face
pod_x0, pod_x1 = -tower_w / 2 - podium_ext, -tower_w / 2 + 1
pod_y0, pod_y1 = -tower_d / 2 + 1, tower_d / 2 + 2
pod_cx, pod_cy = (pod_x0 + pod_x1) / 2, (pod_y0 + pod_y1) / 2

podium = (
    cq.Workplane("XY")
    .box(pod_x1 - pod_x0, pod_y1 - pod_y0, podium_h)
    .translate((pod_cx, pod_cy, podium_h / 2))
)

# recess the roof of the wing to leave a parapet-rimmed terrace
terrace = (
    cq.Workplane("XY")
    .box(pod_x1 - pod_x0 - 2 * parapet, pod_y1 - pod_y0 - 2 * parapet, 3.0)
    .translate((pod_cx, pod_cy, podium_h - 1.2 + 1.5))
)
podium = podium.cut(terrace)


# ======================================================================
# 4. Assemble the final model
# ======================================================================
result = (
    tower
    .union(plinth)
    .union(podium)
    .union(canopy)
    .union(top_block)
    .union(roof)
)