import cadquery as cq
import math

# ============================================
# Coilover Shock Absorber - Parametric Model
# ============================================

# --- Parameters ---
rod_radius = 4.0
body_radius = 7.0
collar_radius = 10.0
cap_radius = 13.0

eye_radius = 10.0
eye_bore_radius = 5.0
eye_width = 16.0

coil_radius = 20.0
wire_radius = 3.5
num_coils = 6
spring_length = 85.0

perch_radius = 24.0
perch_height = 4.0

nut_inner_r = 22.0
nut_outer_r = 28.0
nut_height = 10.0
num_teeth = 10

# --- Vertical layout (bottom to top) ---
z_bot_eye_center = 10.0
z_bot_eye_top = 20.0
z_collar1_top = 30.0
z_perch1_top = 34.0
z_spring_top = z_perch1_top + spring_length  # 119
z_perch2_top = z_spring_top + perch_height   # 123
z_nut_top = z_perch2_top + nut_height        # 133
z_collar2_top = z_nut_top + 10.0             # 143
z_cap_top = z_collar2_top + 7.0              # 150
z_top_eye_center = z_cap_top + eye_radius    # 160
z_total = z_cap_top + 2 * eye_radius         # 170

pitch = spring_length / num_coils

# ============================================
# 1. Central Rod (full length)
# ============================================
result = (
    cq.Workplane("XY")
    .circle(rod_radius)
    .extrude(z_total)
)

# ============================================
# 2. Body Tube (middle section)
# ============================================
body_tube = (
    cq.Workplane("XY")
    .workplane(offset=z_bot_eye_top)
    .circle(body_radius)
    .extrude(z_cap_top - z_bot_eye_top)
)
result = result.union(body_tube)

# ============================================
# 3. Bottom Eye Mount (cylinder along Y axis)
# ============================================
bot_eye = (
    cq.Workplane("XZ")
    .circle(eye_radius)
    .extrude(eye_width / 2.0, both=True)
    .translate((0, 0, z_bot_eye_center))
)
result = result.union(bot_eye)

# ============================================
# 4. Bottom Collar (transition piece)
# ============================================
bot_collar = (
    cq.Workplane("XY")
    .workplane(offset=z_bot_eye_top)
    .circle(collar_radius)
    .extrude(z_collar1_top - z_bot_eye_top)
)
result = result.union(bot_collar)

# ============================================
# 5. Bottom Spring Perch (flat disc)
# ============================================
bot_perch = (
    cq.Workplane("XY")
    .workplane(offset=z_collar1_top)
    .circle(perch_radius)
    .extrude(perch_height)
)
result = result.union(bot_perch)

# ============================================
# 6. Helical Coil Spring
# ============================================
helix_wire = cq.Wire.makeHelix(pitch, spring_length, coil_radius)

spring = (
    cq.Workplane("XZ")
    .center(coil_radius, 0)
    .circle(wire_radius)
    .sweep(helix_wire, isFrenet=True)
    .translate((0, 0, z_perch1_top))
)
result = result.union(spring)

# ============================================
# 7. Top Spring Perch (flat disc)
# ============================================
top_perch = (
    cq.Workplane("XY")
    .workplane(offset=z_spring_top)
    .circle(perch_radius)
    .extrude(perch_height)
)
result = result.union(top_perch)

# ============================================
# 8. Castellated Adjustment Nut (gear profile)
# ============================================
tooth_step = 360.0 / num_teeth
gear_pts = []
for i in range(num_teeth):
    a_start = i * tooth_step
    a_mid = a_start + tooth_step * 0.4
    a_end = (i + 1) * tooth_step
    for angle, r in [(a_start, nut_outer_r), (a_mid, nut_outer_r),
                     (a_mid, nut_inner_r), (a_end, nut_inner_r)]:
        rad = math.radians(angle)
        gear_pts.append((r * math.cos(rad), r * math.sin(rad)))

nut_wp = cq.Workplane("XY").workplane(offset=z_perch2_top)
nut_wp = nut_wp.moveTo(gear_pts[0][0], gear_pts[0][1])
for pt in gear_pts[1:]:
    nut_wp = nut_wp.lineTo(pt[0], pt[1])
nut_solid = nut_wp.close().extrude(nut_height)

# Cut center bore through nut
nut_bore = (
    cq.Workplane("XY")
    .workplane(offset=z_perch2_top - 1.0)
    .circle(body_radius + 1.5)
    .extrude(nut_height + 2.0)
)
nut_solid = nut_solid.cut(nut_bore)
result = result.union(nut_solid)

# ============================================
# 9. Upper Collar
# ============================================
up_collar = (
    cq.Workplane("XY")
    .workplane(offset=z_nut_top)
    .circle(collar_radius)
    .extrude(z_collar2_top - z_nut_top)
)
result = result.union(up_collar)

# ============================================
# 10. Upper Cap (wider transition)
# ============================================
up_cap = (
    cq.Workplane("XY")
    .workplane(offset=z_collar2_top)
    .circle(cap_radius)
    .extrude(z_cap_top - z_collar2_top)
)
result = result.union(up_cap)

# ============================================
# 11. Top Eye Mount (cylinder along Y axis)
# ============================================
top_eye = (
    cq.Workplane("XZ")
    .circle(eye_radius)
    .extrude(eye_width / 2.0, both=True)
    .translate((0, 0, z_top_eye_center))
)
result = result.union(top_eye)

# ============================================
# 12. Cut Eye Bore Holes (through both eyes)
# ============================================
for z_ctr in [z_bot_eye_center, z_top_eye_center]:
    bore_cutter = (
        cq.Workplane("XZ")
        .circle(eye_bore_radius)
        .extrude(eye_width + 10.0, both=True)
        .translate((0, 0, z_ctr))
    )
    result = result.cut(bore_cutter)