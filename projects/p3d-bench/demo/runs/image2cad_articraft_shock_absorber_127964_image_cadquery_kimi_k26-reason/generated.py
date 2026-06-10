import cadquery as cq
import math

# =============================================================================
# SHOCK ABSORBER / COILOVER PARAMETERS
# =============================================================================

# -- Bottom eyelet (lower clevis mount) --
bottom_eyelet_dia = 12.0          # Outer diameter of the eyelet body
bottom_eyelet_width = 10.0        # Thickness of the eyelet along the hole axis
bottom_eyelet_hole_dia = 6.0      # Mounting hole diameter
bottom_eyelet_center_z = bottom_eyelet_dia / 2

# -- Lower mount post --
lower_post_dia = 10.0
lower_post_height = 4.0

# -- Lower spring perch --
lower_perch_dia = 26.0
lower_perch_thickness = 3.0
lower_perch_boss_dia = 14.0       # Retention lip inside the spring ID
lower_perch_boss_height = 2.0

# -- Shock body (damper cylinder) --
shock_body_dia = 10.0
shock_body_height = 48.0

# -- Coil spring --
spring_wire_dia = 3.0
spring_mean_dia = 18.0            # Centerline diameter
spring_height = 50.0
spring_coils = 6.0

# -- Upper spring perch --
upper_perch_dia = 26.0
upper_perch_thickness = 3.0
upper_perch_boss_dia = 14.0       # Retention lip
upper_perch_boss_height = 2.0

# -- Piston rod --
piston_rod_dia = 6.0
piston_rod_bottom_z = lower_post_height + lower_perch_thickness + shock_body_height
piston_rod_top_z = piston_rod_bottom_z + 15.0  # exposed section above shock body

# -- Adjustment nut (toothed star nut) --
nut_height = 6.0
nut_outer_dia = 26.0
nut_inner_dia = 10.0              # Hole through which the piston rod passes
num_teeth = 8
nut_bottom_z = (lower_post_height + lower_perch_thickness + spring_height +
                upper_perch_thickness + 2.0)  # slight gap above upper perch
nut_top_z = nut_bottom_z + nut_height

# -- Top eyelet / clevis --
top_post_dia = 8.0
top_post_height = 8.0
top_eyelet_dia = 12.0
top_eyelet_width = 10.0
top_eyelet_hole_dia = 6.0
top_eyelet_center_z = nut_top_z + top_post_height + top_eyelet_dia / 2

# =============================================================================
# GEOMETRY CONSTRUCTION
# =============================================================================

# --- Bottom Eyelet ---
# Horizontal cylinder along X axis with a through-hole
bottom_eyelet_body = (
    cq.Workplane("YZ")
    .circle(bottom_eyelet_dia / 2)
    .extrude(bottom_eyelet_width / 2, both=True)
    .translate((0, 0, bottom_eyelet_center_z))
)

bottom_eyelet_hole = (
    cq.Workplane("YZ")
    .circle(bottom_eyelet_hole_dia / 2)
    .extrude(bottom_eyelet_width / 2 + 1, both=True)
    .translate((0, 0, bottom_eyelet_center_z))
)

bottom_eyelet = bottom_eyelet_body.cut(bottom_eyelet_hole)

# --- Lower Mount Post ---
lower_post = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height / 2))
    .circle(lower_post_dia / 2)
    .extrude(lower_post_height)
)

# --- Lower Spring Perch ---
lower_perch = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height))
    .circle(lower_perch_dia / 2)
    .extrude(lower_perch_thickness)
)

# Retention boss that centers the bottom of the spring
lower_perch_boss = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness))
    .circle(lower_perch_boss_dia / 2)
    .extrude(lower_perch_boss_height)
)
lower_perch = lower_perch.union(lower_perch_boss)

# Small alignment notch visible on the lower perch edge
notch = (
    cq.Workplane("XY")
    .transformed(offset=(lower_perch_dia / 2 - 1.0, 0,
                         bottom_eyelet_dia + lower_post_height + lower_perch_thickness / 2))
    .box(2.0, 3.0, lower_perch_thickness + 1.0, centered=True)
)
lower_perch = lower_perch.cut(notch)

# --- Shock Body ---
shock_body = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness + shock_body_height / 2))
    .circle(shock_body_dia / 2)
    .extrude(shock_body_height)
)

# --- Coil Spring ---
# Helical spring created by sweeping a circular profile along a helix path
spring_helix = cq.Wire.makeHelix(
    pitch=spring_height / spring_coils,
    height=spring_height,
    radius=spring_mean_dia / 2
)

spring = (
    cq.Workplane("XY")
    .circle(spring_wire_dia / 2)
    .sweep(spring_helix, isFrenet=True)
    .translate((0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness + lower_perch_boss_height))
)

# --- Upper Spring Perch ---
upper_perch = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness + spring_height))
    .circle(upper_perch_dia / 2)
    .extrude(upper_perch_thickness)
)

# Retention boss on the underside to center the top coil
upper_perch_boss = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness + spring_height - upper_perch_boss_height))
    .circle(upper_perch_boss_dia / 2)
    .extrude(upper_perch_boss_height)
)
upper_perch = upper_perch.union(upper_perch_boss)

# Through-hole for the piston rod
upper_perch_hole = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, bottom_eyelet_dia + lower_post_height + lower_perch_thickness + spring_height - 1))
    .circle(piston_rod_dia / 2 + 0.5)
    .extrude(upper_perch_thickness + upper_perch_boss_height + 2)
)
upper_perch = upper_perch.cut(upper_perch_hole)

# --- Piston Rod ---
piston_rod = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, piston_rod_bottom_z + (piston_rod_top_z - piston_rod_bottom_z) / 2))
    .circle(piston_rod_dia / 2)
    .extrude(piston_rod_top_z - piston_rod_bottom_z)
)

# --- Toothed Adjustment Nut ---
# Build an 8-pointed star profile by alternating outer and inner vertices
star_points = []
for i in range(num_teeth * 2):
    angle = math.radians(i * 360 / (num_teeth * 2))
    if i % 2 == 0:
        r = nut_outer_dia / 2
    else:
        r = nut_inner_dia / 2 + 1.5
    star_points.append((r * math.cos(angle), r * math.sin(angle)))

nut = (
    cq.Workplane("XY")
    .polyline(star_points).close()
    .extrude(nut_height)
    .translate((0, 0, nut_bottom_z))
)

# Center hole for the piston rod / threads
nut_hole = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, nut_bottom_z - 1))
    .circle(piston_rod_dia / 2 + 0.5)
    .extrude(nut_height + 2)
)
nut = nut.cut(nut_hole)

# --- Top Eyelet ---
# Vertical post above the nut
top_post = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, nut_top_z + top_post_height / 2))
    .circle(top_post_dia / 2)
    .extrude(top_post_height)
)

# Horizontal cylinder oriented along Y (perpendicular to bottom eyelet)
top_eyelet_body = (
    cq.Workplane("XZ")
    .circle(top_eyelet_dia / 2)
    .extrude(top_eyelet_width / 2, both=True)
    .translate((0, 0, top_eyelet_center_z))
)

top_eyelet_hole = (
    cq.Workplane("XZ")
    .circle(top_eyelet_hole_dia / 2)
    .extrude(top_eyelet_width / 2 + 1, both=True)
    .translate((0, 0, top_eyelet_center_z))
)

top_eyelet = top_post.union(top_eyelet_body).cut(top_eyelet_hole)

# Apply fillets to soften the eyelet edges (cast / forged appearance)
try:
    top_eyelet = top_eyelet.edges().fillet(1.2)
except Exception:
    pass

try:
    bottom_eyelet = bottom_eyelet.edges().fillet(1.0)
except Exception:
    pass

# =============================================================================
# FINAL ASSEMBLY
# =============================================================================
result = (
    bottom_eyelet
    .union(lower_post)
    .union(lower_perch)
    .union(shock_body)
    .union(spring)
    .union(upper_perch)
    .union(piston_rod)
    .union(nut)
    .union(top_eyelet)
)