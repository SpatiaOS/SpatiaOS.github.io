import cadquery as cq

# ==========================================
# Parameters
# ==========================================
# Hull dimensions
hull_length = 100.0
hull_width = 20.0
hull_depth = 8.0

# Turret dimensions
turret_radius = 5.0
turret1_height = 3.0  # Front turret
turret2_height = 5.0  # Superfiring turret (taller to clear T1)
turret3_height = 3.0  # Rear turret

# Gun barrel (pin) dimensions
pin_radius = 0.5
pin_length = 10.0

# Chimney and spacer dimensions
chimney_radius = 2.5
chimney_base_height = 2.0
chimney_tilt_height = 9.7
chimney_tilt_offset = -1.5

# ==========================================
# Modeling
# ==========================================

# 1. Hull (Smoothly tapered B-Spline lower hull using a loft)
hull = (
    cq.Workplane("XY")
    .workplane(offset=0).ellipse(hull_length / 2, hull_width / 2)
    .workplane(offset=-hull_depth / 2).ellipse(hull_length / 2 * 0.84, hull_width / 2 * 0.6)
    .workplane(offset=-hull_depth).ellipse(hull_length / 2 * 0.4, hull_width / 2 * 0.1)
    .loft(ruled=False)
)

# 2. Superstructure (Stepped rectangular blocks)
# Step 1: Main base
step1 = cq.Workplane("XY").workplane(offset=0).center(-3, 0).box(36, 14, 2, centered=(True, True, False))
# Step 2: Middle tier
step2 = cq.Workplane("XY").workplane(offset=2).center(-2, 0).box(26, 10, 2, centered=(True, True, False))
# Step 3: Small block behind the chimney
step3 = cq.Workplane("XY").workplane(offset=4).center(-8, 0).box(6, 8, 2, centered=(True, True, False))

# Bridge: Front of the superstructure with ±45° chamfered forward edges
bridge = (
    cq.Workplane("XY").workplane(offset=4).center(8, 0)
    .box(6, 10, 4, centered=(True, True, False))
    .edges("|Z and >X").chamfer(2)
)

# Chimney base: Vertical cylindrical protrusion
chimney_base = (
    cq.Workplane("XY").workplane(offset=4).center(0, 0)
    .circle(chimney_radius).extrude(chimney_base_height)
)

# 3. Turrets (Squat cylindrical bosses rising from the deck)
t1 = cq.Workplane("XY").workplane(offset=0).center(35, 0).circle(turret_radius).extrude(turret1_height)
t2 = cq.Workplane("XY").workplane(offset=0).center(22, 0).circle(turret_radius).extrude(turret2_height)
t3 = cq.Workplane("XY").workplane(offset=0).center(-25, 0).circle(turret_radius).extrude(turret3_height)

# 4. Spacer (Tilted chimney extension)
# Modeled as a loft to create the 10-degree tilt and elliptical end profiles
spacer_z_start = 4 + chimney_base_height
spacer = (
    cq.Workplane("XY")
    .workplane(offset=spacer_z_start).center(0, 0).circle(chimney_radius)
    .workplane(offset=chimney_tilt_height).center(chimney_tilt_offset, 0).circle(chimney_radius)
    .loft()
)

# Add a flat cut on the back of the spacer to satisfy the "longitudinal flat" description
flat_cut = (
    cq.Workplane("XY")
    .workplane(offset=spacer_z_start)
    .center(-chimney_radius - 0.5, 0)
    .box(2, 10, 20, centered=(True, True, False))
)
spacer = spacer.cut(flat_cut)

# Combine main bodies into a single result
result = (
    hull
    .union(step1).union(step2).union(step3)
    .union(bridge).union(chimney_base)
    .union(t1).union(t2).union(t3)
    .union(spacer)
)

# 5. Gun Barrels (9 pins: 3 per turret)
barrel_y_offsets = [-1.5, 0, 1.5]

for y in barrel_y_offsets:
    # Turret 1 (Front, pointing forward)
    pin1 = cq.Workplane("YZ").workplane(offset=35).center(y, 1.5).circle(pin_radius).extrude(pin_length)
    
    # Turret 2 (Middle-Front, elevated to clear Turret 1, pointing forward)
    pin2 = cq.Workplane("YZ").workplane(offset=22).center(y, 4.0).circle(pin_radius).extrude(pin_length)
    
    # Turret 3 (Back, pointing backward -> negative extrusion)
    pin3 = cq.Workplane("YZ").workplane(offset=-25).center(y, 1.5).circle(pin_radius).extrude(-pin_length)
    
    result = result.union(pin1).union(pin2).union(pin3)