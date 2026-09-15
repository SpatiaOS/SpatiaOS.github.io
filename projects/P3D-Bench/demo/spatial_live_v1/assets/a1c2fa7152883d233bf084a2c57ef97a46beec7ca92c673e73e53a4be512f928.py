import cadquery as cq

# =============================================================================
# PARAMETERS (meters)
# High-rise mixed-use tower: open slab floors on the front-left, punched-window
# residential wall on the right, postmodern crown (cantilever + pediment),
# podium with a left annex and a sloped right wing.
# =============================================================================

# --- Vertical organization ---
floor_h = 3.2              # typical floor-to-floor height
slab_t = 0.30              # exposed floor-slab thickness
n_floors = 17              # open / main floors above the podium
podium_h = 6.8             # solid base height

# --- Tower footprint (origin = front-left corner of tower at ground) ---
# +X = right (window facade), +Y = back, +Z = up
tower_w = 20.0             # left -> right
tower_d = 16.5             # front -> back

# Recessed open-air slab bay occupying the front-left of the tower
open_w = 12.5              # width of open bay (X)
open_d = 9.5               # depth of open bay (Y)
fin_t = 0.42               # leftover left-hand vertical fin thickness

# --- Crown ---
cantilever_h = 5.2
cantilever_overhang = 4.0
pediment_w = 11.5
pediment_h = 7.2
pediment_d = 4.0
penthouse_h = 10.5
penthouse_left = 7.6       # penthouse mass begins at this X (inset from left)

# --- Windows on the right (+X) facade ---
n_win_cols = 4
n_win_rows = 20
win_w = 2.35               # width along the facade (Y)
win_pane_h = 0.72          # two stacked panes per floor
win_mullion = 0.14
win_depth = 0.60
win_sill = 0.88            # sill height above each floor line

# --- Balconies at the open-bay / residential junction ---
balc_w = 5.8
balc_d = 2.05

# --- Podium / annex / right wing ---
podium_front = 1.8
podium_back = 1.6
podium_right = 1.0

annex_w = 10.5
annex_d = 13.0
annex_h = 11.5

wing_w = 7.6
wing_d = 11.2
wing_h = 9.2

# --- Derived elevations ---
z0 = podium_h                          # tower starts on top of the podium
h_main = n_floors * floor_h
z_crown = z0 + h_main
z_top = z_crown + penthouse_h
h_shaft = z_top - z0


# =============================================================================
# HELPERS
# =============================================================================

def box_from(dx, dy, dz, x0, y0, z0):
    """Axis-aligned box with minimum corner at (x0, y0, z0)."""
    return (
        cq.Workplane("XY")
        .box(dx, dy, dz)
        .translate((x0 + dx / 2.0, y0 + dy / 2.0, z0 + dz / 2.0))
    )


# =============================================================================
# 1. MAIN SHAFT
#    A single rectangular prism spanning podium top -> penthouse roof.
#    Open floors, the left penthouse void and window holes are cut from it.
# =============================================================================

shaft = box_from(tower_w, tower_d, h_shaft, 0.0, 0.0, z0)

# --- Punched windows on the right (+X) facade (two panes per cell) ---
margin_y = 1.35
spacing_y = (tower_d - 2.0 * margin_y) / float(n_win_cols)
win_pts = []
for col in range(n_win_cols):
    y_c = margin_y + spacing_y * (col + 0.5)
    for row in range(n_win_rows):
        z_floor = z0 + row * floor_h
        z_sill = z_floor + win_sill
        z_lo = z_sill + win_pane_h / 2.0
        z_hi = z_sill + win_pane_h + win_mullion + win_pane_h / 2.0
        if (z_hi + win_pane_h / 2.0) > (z_top - 1.15):
            continue
        x_c = tower_w - win_depth / 2.0 + 0.10
        win_pts.append((x_c, y_c, z_lo))
        win_pts.append((x_c, y_c, z_hi))

window_cutters = (
    cq.Workplane("XY")
    .pushPoints(win_pts)
    .box(win_depth + 0.25, win_w, win_pane_h)
)
shaft = shaft.cut(window_cutters)

# --- Open-air slots between floor slabs in the front-left bay ---
# Leaving `fin_t` of wall on the left edge as the vertical fin.
air_pts = []
air_dx = open_w - fin_t
air_dy = open_d + 0.12
air_dz = floor_h - slab_t
for i in range(n_floors):
    x_c = fin_t + air_dx / 2.0
    y_c = air_dy / 2.0 - 0.10          # slightly past the front face
    z_c = z0 + i * floor_h + air_dz / 2.0
    air_pts.append((x_c, y_c, z_c))

air_cutters = cq.Workplane("XY").pushPoints(air_pts).box(air_dx, air_dy, air_dz)
shaft = shaft.cut(air_cutters)

# Vertical circulation void through the open bay (dark central slot)
shaft = shaft.cut(box_from(2.9, 5.2, h_main + 0.4, 4.6, 2.1, z0 - 0.15))

# --- Carve the crown: remove mass that is NOT the penthouse ---
# (a) entire left strip above the main floors
shaft = shaft.cut(
    box_from(penthouse_left + 0.15, tower_d + 2.0, penthouse_h + 1.5,
             -0.20, -1.0, z_crown)
)
# (b) remaining front-left open bay above the main floors (so the cantilever
#     can sit in that void)
shaft = shaft.cut(
    box_from(open_w - penthouse_left + 0.4, open_d + 0.6, penthouse_h + 1.5,
             penthouse_left - 0.15, -0.35, z_crown)
)


# =============================================================================
# 2. PODIUM, LEFT ANNEX, SLOPED RIGHT WING
# =============================================================================

# Main podium under the tower, projecting slightly at front / back / right
podium = box_from(
    tower_w + podium_right + 0.6,
    tower_d + podium_front + podium_back,
    podium_h,
    -0.5,
    -podium_front,
    0.0,
)

# Lower annex on the left – box with an open-top courtyard
annex = box_from(annex_w, annex_d, annex_h, -annex_w + 0.9, 1.6, 0.0)
courtyard = box_from(
    annex_w - 3.2, annex_d - 4.4, annex_h,
    -annex_w + 2.6, 3.6, 2.8,
)
annex = annex.cut(courtyard)

# Right wing with a shed roof sloping down toward the outside
wing = (
    cq.Workplane("XZ")
    .moveTo(0.0, 0.0)
    .lineTo(wing_w, 0.0)
    .lineTo(wing_w, wing_h * 0.32)
    .lineTo(0.0, wing_h)
    .close()
    .extrude(wing_d)
    .translate((tower_w - 0.8, 2.2, 0.0))
)


# =============================================================================
# 3. CROWN: cantilevered mechanical box + triangular pediment
# =============================================================================

# Grey cantilever that caps the open slab stack and projects forward
cantilever = box_from(
    open_w + 2.2,
    open_d + cantilever_overhang - 0.2,
    cantilever_h,
    -0.25,
    -cantilever_overhang,
    z_crown - 0.04,
)

# Triangular pediment sitting on the cantilever, facing the front
pediment = (
    cq.Workplane("XZ")
    .moveTo(-pediment_w / 2.0, 0.0)
    .lineTo(pediment_w / 2.0, 0.0)
    .lineTo(0.0, pediment_h)
    .close()
    .extrude(pediment_d)
    .translate((open_w * 0.46, -cantilever_overhang + 0.35, z_crown + cantilever_h - 0.05))
)

# Thin penthouse roof cap / parapet
roof_cap = box_from(
    tower_w - penthouse_left + 0.5,
    tower_d + 0.35,
    0.42,
    penthouse_left - 0.25,
    -0.15,
    z_top - 0.05,
)


# =============================================================================
# 4. BALCONIES + LEFT-EDGE FIN
# =============================================================================

balc_pts = []
for i in range(n_floors):
    z_c = z0 + (i + 1) * floor_h - slab_t / 2.0
    x_c = open_w + 0.4
    y_c = -balc_d / 2.0
    balc_pts.append((x_c, y_c, z_c))

balconies = (
    cq.Workplane("XY")
    .pushPoints(balc_pts)
    .box(balc_w, balc_d, slab_t)
)

# Extra leading fin on the front-left corner (reads as the double mullion)
lead_fin = box_from(0.28, open_d + 0.55, h_main, -0.18, -0.28, z0)


# =============================================================================
# 5. COMPOSE
# =============================================================================

result = (
    shaft
    .union(podium)
    .union(annex)
    .union(wing)
    .union(cantilever)
    .union(pediment)
    .union(roof_cap)
    .union(balconies)
    .union(lead_fin)
)