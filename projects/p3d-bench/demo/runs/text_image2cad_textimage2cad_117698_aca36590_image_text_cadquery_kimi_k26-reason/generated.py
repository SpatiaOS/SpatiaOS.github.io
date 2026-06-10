import cadquery as cq

# --- Overall assembly parameters ---
ship_length = 100.0
ship_width = 20.0          # aspect ratio 5:1
hull_height = 10.0
deck_z = hull_height

# Turret bosses (3 instances)
boss_radius = 5.0
boss_height = 6.0
turret_x = [-35.0, -10.0, 30.0]

# Chimney
chimney_radius = 2.5
chimney_height = 8.0

# Gun-barrel pins (9 instances)
pin_radius = 0.5
pin_length = 10.0

# Superstructure stepped blocks
super_x = 2.0

# Spacer partial-elliptical prism
spacer_x_pos = 18.0
spacer_y_pos = 5.0
spacer_length = 9.7
spacer_width = 6.2
spacer_height = 2.1

# --- Hull: lofted elliptical sections for tapered deck & base ---
hull = (
    cq.Workplane("XY")
    .ellipse(42.0, 5.0)
    .workplane(offset=deck_z * 0.25)
    .ellipse(47.0, 8.0)
    .workplane(offset=deck_z * 0.75)
    .ellipse(50.0, 10.0)
    .loft()
)

# --- Superstructure: three stepped boxes with corner chamfers ---
super_lower = (
    cq.Workplane("XY", origin=(super_x, 0.0, deck_z))
    .box(28.0, 12.0, 2.5, centered=True)
    .edges("|Z")
    .chamfer(0.8)
)

super_mid = (
    cq.Workplane("XY", origin=(super_x, 0.0, deck_z + 2.5))
    .box(20.0, 8.0, 2.5, centered=True)
    .edges("|Z")
    .chamfer(0.8)
)

super_top = (
    cq.Workplane("XY", origin=(super_x, 0.0, deck_z + 5.0))
    .box(12.0, 5.0, 2.0, centered=True)
    .edges("|Z")
    .chamfer(0.8)
)

# --- Chimney cylinder on superstructure ---
chimney = (
    cq.Workplane("XY", origin=(super_x + 3.0, 3.5, deck_z + 7.0))
    .circle(chimney_radius)
    .extrude(chimney_height)
)

# --- Three cylindrical turret bosses ---
turrets = None
for tx in turret_x:
    t = (
        cq.Workplane("XY", origin=(tx, 0.0, deck_z))
        .circle(boss_radius)
        .extrude(boss_height)
    )
    turrets = t if turrets is None else turrets.union(t)

# --- Nine gun-barrel pins in triple clusters, projecting forward ---
pins = None
for tx in turret_x:
    for py in [-1.2, 0.0, 1.2]:
        p = (
            cq.Workplane("XY", origin=(tx - boss_radius, py, deck_z + boss_height - 1.0))
            .circle(pin_radius)
            .extrude(-pin_length)
        )
        pins = p if pins is None else pins.union(p)

# --- Spacer: half-elliptical cylinder lying on deck ---
spacer_full = (
    cq.Workplane("YZ", origin=(spacer_x_pos - spacer_length / 2, spacer_y_pos, deck_z))
    .ellipse(spacer_width / 2, spacer_height)
    .extrude(spacer_length)
)

# Slice off the bottom half so the spacer sits flat on the deck
bottom_cutter = (
    cq.Workplane("XY", origin=(0.0, 0.0, deck_z - 25.0))
    .box(200.0, 200.0, 25.0, centered=True)
)
spacer = spacer_full.cut(bottom_cutter)

# --- Union all components into a single solid ---
result = (
    hull
    .union(super_lower)
    .union(super_mid)
    .union(super_top)
    .union(chimney)
    .union(turrets)
    .union(pins)
    .union(spacer)
)