import cadquery as cq

# -----------------------------------------------------------------------------
# Geometric Parameters
# -----------------------------------------------------------------------------
# Overall bounding box dimensions
total_length = 0.740822  # Overall X span
total_width = 0.672842   # Overall Y span
total_height = 0.171797  # Overall Z height

# Thickness breakdown for the stepped underside
pad_depth = 0.151181     # Broader upper pad thickness (~0.1512)
step_depth = 0.020616    # Shallow step/continuation thickness (~0.0206)

# Reference centerline in X (symmetric baseline)
x_mid = total_length / 2.0  # 0.370411

# Central circular opening parameters
hole_center_x = 0.3687
hole_center_y = 0.4283
hole_radius = 0.2165

# Narrow straight web crossing the central opening
web_length_x = 0.025368
web_width_y = 0.432873
web_offset_left = 0.3434
web_offset_front = 0.2119
web_center_x = web_offset_left + web_length_x / 2.0
web_center_y = web_offset_front + web_width_y / 2.0

# Secondary smaller round solid feature (boss)
boss_center_x = 0.4796
boss_center_y = 0.4282
boss_outer_radius = 0.0992  # Bounding span ~0.1984

# Circular recess/hole inside the smaller boss
recess_center_x = 0.4796
recess_center_y = 0.4283
recess_radius = 0.0754

# Slot openings near outer lobes
slot_left_x = 0.0760
slot_right_x = total_length - 0.0760  # ~0.6648
slot_center_y = 0.4400
slot_length = 0.1200
slot_width = 0.0350

# -----------------------------------------------------------------------------
# 1. Base Solid: Rounded Wedge Profile
# -----------------------------------------------------------------------------
# Define key control points ensuring exact bounds [0, total_length] & [0, total_width]
p_front_r = (x_mid + 0.08, 0.035)
p_front_apex = (x_mid, 0.0)
p_front_l = (x_mid - 0.08, 0.035)

p_lobe_r_start = (0.6800, 0.3200)
p_lobe_r_apex = (total_length, 0.4400)
p_lobe_r_end = (0.6800, 0.5600)

p_back_apex = (x_mid, total_width)

p_lobe_l_end = (x_mid - (0.6800 - x_mid), 0.5600)
p_lobe_l_apex = (0.0, 0.4400)
p_lobe_l_start = (x_mid - (0.6800 - x_mid), 0.3200)

# Build the rounded wedge base profile and extrude the broader pad
base = (
    cq.Workplane("XY")
    .moveTo(p_front_r[0], p_front_r[1])
    .lineTo(p_lobe_r_start[0], p_lobe_r_start[1])
    .threePointsArc(p_lobe_r_apex, p_lobe_r_end)
    .threePointsArc(p_back_apex, p_lobe_l_end)
    .threePointsArc(p_lobe_l_apex, p_lobe_l_start)
    .lineTo(p_front_l[0], p_front_l[1])
    .threePointsArc(p_front_apex, p_front_r)
    .close()
    .extrude(pad_depth)
)

# -----------------------------------------------------------------------------
# 2. Stepped Underside Continuation (Shallow Step / Rim)
# -----------------------------------------------------------------------------
# Contained continuation extending 0.0206 below the pad
underside_step = (
    cq.Workplane("XY")
    .workplane(offset=-step_depth)
    .moveTo(hole_center_x, hole_center_y)
    .circle(hole_radius + 0.028)
    .extrude(step_depth)
)
base = base.union(underside_step)

# -----------------------------------------------------------------------------
# 3. Central Circular Through-Opening
# -----------------------------------------------------------------------------
base = (
    base.faces(">Z")
    .workplane()
    .moveTo(hole_center_x, hole_center_y)
    .circle(hole_radius)
    .cutThruAll()
)

# -----------------------------------------------------------------------------
# 4. Narrow Solid Web Crossing the Central Opening
# -----------------------------------------------------------------------------
web = (
    cq.Workplane("XY")
    .workplane(offset=-step_depth)
    .moveTo(web_center_x, web_center_y)
    .rect(web_length_x, web_width_y)
    .extrude(total_height)
)
base = base.union(web)

# -----------------------------------------------------------------------------
# 5. Smaller Round Solid Feature (Boss)
# -----------------------------------------------------------------------------
boss = (
    cq.Workplane("XY")
    .workplane(offset=-step_depth)
    .moveTo(boss_center_x, boss_center_y)
    .circle(boss_outer_radius)
    .extrude(total_height)
)
base = base.union(boss)

# -----------------------------------------------------------------------------
# 6. Recess Through-Hole Inside Smaller Boss
# -----------------------------------------------------------------------------
base = (
    base.faces(">Z")
    .workplane()
    .moveTo(recess_center_x, recess_center_y)
    .circle(recess_radius)
    .cutThruAll()
)

# -----------------------------------------------------------------------------
# 7. Slot-Like Openings Near Rounded Outer Lobes
# -----------------------------------------------------------------------------
slots = (
    cq.Workplane("XY")
    .workplane(offset=-step_depth - 0.01)
    .pushPoints([(slot_left_x, slot_center_y), (slot_right_x, slot_center_y)])
    .slot2D(slot_length, slot_width, 90)
    .extrude(total_height + 0.02)
)
result = base.cut(slots)