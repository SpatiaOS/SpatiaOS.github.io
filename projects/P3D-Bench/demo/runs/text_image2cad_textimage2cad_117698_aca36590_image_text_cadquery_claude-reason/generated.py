import cadquery as cq

# ============================================================
# Warship Figurine — Parametric Model
# ============================================================

# --- Hull ---
hull_length = 100.0         # overall length (bow to stern)
hull_beam = 20.0            # maximum beam (width)
hull_depth = 8.0            # keel-to-deck height
keel_half_length = 38.0     # semi-major axis of narrow keel ellipse
keel_half_width = 1.5       # semi-minor axis of keel ellipse
deck_z = hull_depth         # z-level of the flat deck

# --- Superstructure steps: (x_center, length, width, height above deck) ---
super_steps = [
    (2.0, 30.0, 13.0, 2.5),   # lowest / widest tier
    (3.0, 24.0, 11.0, 5.0),   # second tier
    (4.0, 16.0,  9.0, 7.0),   # third tier
    (6.0,  8.0,  7.0, 9.5),   # bridge / top tier
]

# --- Funnel (smokestack) ---
funnel_radius = 2.5
funnel_height = 6.0
funnel_x = -1.0              # slightly aft of bridge block
funnel_base_offset = 7.0     # sits atop the third tier

# --- Turrets: (x, y, barrel_direction, base_elevation_above_deck) ---
turret_radius = 5.0
turret_height = 3.5
turrets_cfg = [
    (-32.0, 0.0, -1, 0.0),   # far-aft turret, on deck
    (-16.0, 0.0, -1, 2.0),   # mid-aft turret, superfiring (elevated)
    ( 26.0, 0.0,  1, 0.0),   # forward turret, on deck
]

# --- Gun barrels (3 per turret, 9 total) ---
barrel_radius = 0.5
barrel_length = 10.0
barrel_spacing = 1.8         # lateral (Y) spacing between barrels
barrel_z_above_base = 2.0    # barrel centreline height above turret base

# --- Raised platform for superfiring turret ---
platform_length = 12.0
platform_width = 12.0
platform_height = 2.0
platform_x = -16.0

# ============================================================
# 1. Hull — loft from narrow keel to full deck ellipse
# ============================================================
hull = (
    cq.Workplane("XY")
    .ellipse(keel_half_length, keel_half_width)          # keel at z=0
    .workplane(offset=deck_z)
    .ellipse(hull_length / 2.0, hull_beam / 2.0)         # deck at z=deck_z
    .loft()
)
result = hull

# ============================================================
# 2. Superstructure — stepped rectangular blocks
# ============================================================
for xc, sl, sw, sh in super_steps:
    block = (
        cq.Workplane("XY")
        .workplane(offset=deck_z)
        .box(sl, sw, sh, centered=(True, True, False))
        .translate((xc, 0, 0))
    )
    result = result.union(block)

# ============================================================
# 3. Raised platform for mid-aft (superfiring) turret
# ============================================================
platform = (
    cq.Workplane("XY")
    .workplane(offset=deck_z)
    .box(platform_length, platform_width, platform_height,
         centered=(True, True, False))
    .translate((platform_x, 0, 0))
)
result = result.union(platform)

# ============================================================
# 4. Funnel / chimney
# ============================================================
funnel = (
    cq.Workplane("XY")
    .workplane(offset=deck_z + funnel_base_offset)
    .center(funnel_x, 0)
    .circle(funnel_radius)
    .extrude(funnel_height)
)
result = result.union(funnel)

# ============================================================
# 5. Turrets and gun barrels
# ============================================================
for tx, ty, td, elev in turrets_cfg:
    turret_base_z = deck_z + elev

    # Cylindrical turret body
    turret = (
        cq.Workplane("XY")
        .workplane(offset=turret_base_z)
        .center(tx, ty)
        .circle(turret_radius)
        .extrude(turret_height)
    )
    result = result.union(turret)

    # Three parallel gun barrels per turret
    bz = turret_base_z + barrel_z_above_base

    for i in range(3):
        by = ty + (i - 1) * barrel_spacing

        # Barrel extends outward from turret centre
        if td > 0:
            x_start = tx                       # forward: tx → tx + barrel_length
        else:
            x_start = tx - barrel_length       # aft:     tx - barrel_length → tx

        barrel = (
            cq.Workplane("YZ")
            .center(by, bz)
            .circle(barrel_radius)
            .extrude(barrel_length)
            .translate((x_start, 0, 0))
        )
        result = result.union(barrel)