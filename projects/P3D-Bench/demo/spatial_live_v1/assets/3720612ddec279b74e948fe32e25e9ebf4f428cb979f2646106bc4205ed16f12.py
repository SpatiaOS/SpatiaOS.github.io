import cadquery as cq

# =============================================================================
#  PARAMETRIC HIGH-RISE RESIDENTIAL TOWER
#
#  Interpretation of the image:
#   * A slender 16-storey tower whose plan is a rectangle with one
#     chamfered corner (the narrow vertical strip visible between the two
#     main facades).
#   * The left / front long facade carries a stack of cantilevered
#     balconies (projecting slabs + horizontal railing slats) with the
#     glazing behind them recessed (dark bands in the picture).
#   * The right facade is a regularly punched window wall (2 x 2 panes
#     per window group, three groups per floor).
#   * The building is capped by an overhanging cornice band and a hipped
#     roof with a ridge.
#   * A large flat canopy overhangs the balcony facade near the top.
#   * A two-storey podium (larger footprint, chamfered corner) sits at
#     the base, and a low open-topped walled annex (court / car park)
#     adjoins it at the front-left.
# =============================================================================

# ----------------------------- main parameters -------------------------------
floor_h        = 3.0      # storey height
n_floors       = 16       # number of tower storeys

tower_w        = 14.0     # tower plan dimension along X
tower_d        = 16.0     # tower plan dimension along Y
corner_chamfer = 2.5      # chamfer cut on the (+X, -Y) corner
tower_h        = n_floors * floor_h

# --- balconies (on the -Y facade) ---
balc_depth     = 2.2      # cantilever projection
balc_slab_t    = 0.35     # balcony slab thickness
balc_rail_h    = 1.10     # railing height
balc_rail_t    = 0.16     # railing / screen thickness
balc_slat_h    = 0.26     # height of one horizontal railing slat
balc_n_slats   = 3        # slats per railing
balc_start     = 1        # lowest floor that gets a balcony
glaze_recess   = 0.45     # depth of the recessed glazing behind balconies
glaze_h        = 2.30     # height of the recessed glazing band

# --- punched windows (on the +X facade) ---
win_recess     = 0.40     # window reveal depth
win_sill       = 0.95     # sill height above floor level
win_band_h     = 1.90     # total window height
win_group_w    = 3.40     # total width of one window group
win_groups     = 3        # window groups per floor
mullion        = 0.22     # mullion thickness between panes

# --- podium / base ---
podium_extra   = 4.0      # how far the podium oversails the tower
podium_h       = 2.0 * floor_h
podium_cap_t   = 0.45     # thin cap slab on top of the podium
podium_cap_out = 0.6

# --- cornice + roof cap ---
cornice_out    = 0.9      # cornice overhang
cornice_t      = 1.30     # cornice band thickness
roof_out       = 0.5      # roof eaves overhang beyond cornice
roof_rise      = 6.0      # roof height
ridge_len      = 6.0      # length of the roof ridge (along Y)
ridge_w        = 0.5

# --- canopy over the balcony facade near the top ---
canopy_t       = 0.55
canopy_depth   = 5.0
canopy_level   = n_floors - 2      # storey at which the canopy sits

# --- adjacent low walled annex ---
annex_w        = 18.0
annex_d        = 15.0
annex_h        = 4.6
annex_wall     = 0.7
annex_slab     = 0.5


# ------------------------------ helpers --------------------------------------
def chamf(offset):
    """Chamfer leg of a plan that is offset outwards by 'offset' from the tower."""
    return corner_chamfer + 0.83 * offset


def plan_pts(w, d, ch):
    """Rectangular plan (w x d) with the (+X, -Y) corner chamfered."""
    return [
        (-w / 2.0,  d / 2.0),
        ( w / 2.0,  d / 2.0),
        ( w / 2.0, -d / 2.0 + ch),
        ( w / 2.0 - ch, -d / 2.0),
        (-w / 2.0, -d / 2.0),
    ]


def prism(w, d, ch, z0, h):
    """Vertical prism from the chamfered plan, base at z0, height h."""
    return (
        cq.Workplane("XY", origin=(0, 0, z0))
        .polyline(plan_pts(w, d, ch))
        .close()
        .extrude(h)
    )


def box_at(x0, y0, z0, dx, dy, dz):
    """Axis aligned box with its minimum corner at (x0, y0, z0)."""
    return cq.Solid.makeBox(dx, dy, dz, cq.Vector(x0, y0, z0))


# ============================ 1. TOWER SHAFT =================================
tower = prism(tower_w, tower_d, corner_chamfer, 0.0, tower_h)

# Usable extents of the two main facades (the chamfer shortens them)
bal_face_y   = -tower_d / 2.0                      # balcony facade plane (-Y)
bal_x_min    = -tower_w / 2.0
bal_x_max    =  tower_w / 2.0 - corner_chamfer
bal_face_cx  = 0.5 * (bal_x_min + bal_x_max)
bal_face_w   = bal_x_max - bal_x_min

win_face_x   =  tower_w / 2.0                      # window facade plane (+X)
win_y_min    = -tower_d / 2.0 + corner_chamfer + 1.2
win_y_max    =  tower_d / 2.0 - 1.2


# ==================== 2. PUNCHED WINDOWS ON THE +X FACADE ====================
# Every floor gets 'win_groups' window groups, each split into 2 x 2 panes
# by mullions -> shallow rectangular reveals cut into the facade.
pane_w = (win_group_w - mullion) / 2.0
pane_h = (win_band_h - mullion) / 2.0

step_y = (win_y_max - win_y_min) / win_groups
group_centres_y = [win_y_min + step_y * (k + 0.5) for k in range(win_groups)]

pane_pts = []
for i in range(n_floors):
    z_base = i * floor_h + win_sill
    for yc in group_centres_y:
        for sx in (-0.5, 0.5):                     # two pane columns
            for row in (0, 1):                     # two pane rows
                pane_pts.append(
                    (yc + sx * (pane_w + mullion),
                     z_base + pane_h / 2.0 + row * (pane_h + mullion))
                )

window_cutter = (
    cq.Workplane("YZ", origin=(win_face_x, 0, 0))   # local (u,v) -> (x=const, Y, Z)
    .pushPoints(pane_pts)
    .rect(pane_w, pane_h)
    .extrude(-win_recess)                           # inwards (-X)
)
tower = tower.cut(window_cutter)


# ============ 3. RECESSED GLAZING BEHIND THE BALCONIES (-Y facade) ===========
glaze_w = bal_face_w - 1.8
glaze_pts = [
    (bal_face_cx, i * floor_h + 0.55 + glaze_h / 2.0) for i in range(n_floors)
]
glazing_cutter = (
    cq.Workplane("XZ", origin=(0, bal_face_y, 0))   # local (u,v) -> (X, y=const, Z)
    .pushPoints(glaze_pts)
    .rect(glaze_w, glaze_h)
    .extrude(-glaze_recess)                         # inwards (+Y)
)
tower = tower.cut(glazing_cutter)


# ======================== 4. STACKED BALCONIES ===============================
balc_w = bal_face_w - 0.6
balc_x0 = bal_face_cx - balc_w / 2.0
slat_gap = (balc_rail_h - balc_n_slats * balc_slat_h) / (balc_n_slats + 1)

balcony_solids = []
for i in range(balc_start, n_floors):
    z = i * floor_h

    # cantilevered balcony slab (extends 0.4 into the shaft for a clean fuse)
    balcony_solids.append(
        box_at(balc_x0, bal_face_y - balc_depth, z - balc_slab_t,
               balc_w, balc_depth + 0.4, balc_slab_t)
    )

    # side privacy screens
    for x in (balc_x0, balc_x0 + balc_w - balc_rail_t):
        balcony_solids.append(
            box_at(x, bal_face_y - balc_depth, z,
                   balc_rail_t, balc_depth + 0.2, balc_rail_h)
        )

    # horizontal railing slats along the outer edge
    for s in range(balc_n_slats):
        z_slat = z + slat_gap + s * (balc_slat_h + slat_gap)
        balcony_solids.append(
            box_at(balc_x0, bal_face_y - balc_depth, z_slat,
                   balc_w, balc_rail_t, balc_slat_h)
        )

balconies = cq.Compound.makeCompound(balcony_solids)


# ======================== 5. TOP CANOPY / BRISE-SOLEIL ======================
canopy = box_at(
    balc_x0 - 1.0,
    bal_face_y - canopy_depth,
    canopy_level * floor_h,
    balc_w + 2.0,
    canopy_depth + 1.2,
    canopy_t,
)


# ====================== 6. CORNICE BAND + HIPPED ROOF =======================
cornice = prism(tower_w + 2 * cornice_out,
                tower_d + 2 * cornice_out,
                chamf(cornice_out),
                tower_h, cornice_t)

roof_base_z = tower_h + cornice_t
roof = (
    cq.Workplane("XY", origin=(0, 0, roof_base_z))
    .rect(tower_w + 2 * (cornice_out + roof_out),
          tower_d + 2 * (cornice_out + roof_out))
    .workplane(offset=roof_rise)
    .rect(ridge_w, ridge_len)                       # near-degenerate ridge
    .loft(ruled=True)
)


# ============================ 7. PODIUM BASE ================================
podium = prism(tower_w + 2 * podium_extra,
               tower_d + 2 * podium_extra,
               chamf(podium_extra),
               0.0, podium_h)

# thin cap slab on top of the podium
podium_cap = prism(tower_w + 2 * (podium_extra + podium_cap_out),
                   tower_d + 2 * (podium_extra + podium_cap_out),
                   chamf(podium_extra + podium_cap_out),
                   podium_h, podium_cap_t)

# recessed entrance / shopfront panel on the +X side of the podium
entrance_x = tower_w / 2.0 + podium_extra
entrance = box_at(entrance_x - 0.45, -3.5, 0.0, 0.9, 7.0, 4.2)
podium = podium.cut(entrance)


# ==================== 8. LOW ADJOINING WALLED ANNEX =========================
annex_x0 = -(tower_w / 2.0 + podium_extra) - annex_w + 2.0
annex_y0 = -(tower_d / 2.0 + podium_extra) - annex_d + 3.0

annex_outer = box_at(annex_x0, annex_y0, 0.0, annex_w, annex_d, annex_h)
annex_void = box_at(annex_x0 + annex_wall,
                    annex_y0 + annex_wall,
                    annex_slab,
                    annex_w - 2 * annex_wall,
                    annex_d - 2 * annex_wall,
                    annex_h)                        # open at the top
annex = cq.Workplane("XY").add(annex_outer).cut(cq.Workplane("XY").add(annex_void))


# ============================ 9. ASSEMBLY ===================================
result = (
    tower
    .union(balconies)
    .union(canopy)
    .union(cornice)
    .union(roof)
    .union(podium)
    .union(podium_cap)
    .union(annex)
)