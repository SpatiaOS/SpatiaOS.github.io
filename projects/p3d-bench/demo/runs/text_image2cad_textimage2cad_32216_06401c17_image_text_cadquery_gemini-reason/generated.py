import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Hub parameters
hub_base_r = 13.5
hub_base_h = 12.0
hub_cone_h = 15.0
hub_upper_r = 9.39
hub_upper_h = 10.0
hub_total_h = hub_base_h + hub_cone_h + hub_upper_h

# Eye lug on top of the hub
eye_lug_w = 10.14
eye_lug_h = 10.0
eye_lug_t = 3.0
eye_hole_d = 5.0

# Lower Lugs (Jaw pivots)
jaw_pivot_x = 19.5
jaw_pivot_z = 6.0
lower_lug_gap = 6.0
lower_lug_t = 1.5

# Upper Lugs (Actuator pivots)
act_pivot_x = 14.39
act_pivot_z = 32.0
upper_lug_gap = 4.0
upper_lug_t = 1.5

# Jaw dimensions
jaw_mid_x = 28.0
jaw_mid_z = -5.0
jaw_tip_x = 10.0
jaw_tip_z = -50.0
jaw_t = 5.8

# Actuator dimensions
act_barrel_d = 6.76
act_barrel_l = 24.0
act_rod_d = 1.2

# ==========================================
# Central Hub
# ==========================================

# Base, cone, and upper cylinder
hub_profile = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(hub_base_r, 0)
    .lineTo(hub_base_r, hub_base_h)
    .lineTo(hub_upper_r, hub_base_h + hub_cone_h)
    .lineTo(hub_upper_r, hub_total_h)
    .lineTo(0, hub_total_h)
    .close()
)
hub = hub_profile.revolve(360, (0, 0, 0), (0, 0, 1))

# Top eye lug
eye_lug = (
    cq.Workplane("XZ")
    .center(0, hub_total_h + eye_lug_h / 2.0)
    .rect(eye_lug_w, eye_lug_h)
    .extrude(eye_lug_t / 2.0, both=True)
)
eye_lug_top = (
    cq.Workplane("XZ")
    .center(0, hub_total_h + eye_lug_h)
    .circle(eye_lug_w / 2.0)
    .extrude(eye_lug_t / 2.0, both=True)
)
eye_lug = eye_lug.union(eye_lug_top)

eye_hole_cut = cq.Workplane("XZ").center(0, hub_total_h + eye_lug_h).circle(eye_hole_d / 2.0).extrude(10, both=True)
eye_lug = eye_lug.cut(eye_hole_cut)

hub = hub.union(eye_lug)

# ==========================================
# Jaw Arm
# ==========================================

# Main curved profile (using safe arcs to avoid BRep_API errors)
jaw = (
    cq.Workplane("XZ")
    .moveTo(15.5, 4)
    .lineTo(17.5, 8)
    .threePointArc((31, -15), (12, -50))
    .lineTo(8, -50)
    .threePointArc((24, -15), (15.5, 4))
    .close()
    .extrude(jaw_t / 2.0, both=True)
)

# Pivot bosses
boss1 = cq.Workplane("XZ").center(jaw_pivot_x, jaw_pivot_z).circle(4).extrude(3.5, both=True)
boss2 = cq.Workplane("XZ").center(jaw_mid_x, jaw_mid_z).circle(4).extrude(3.5, both=True)
jaw = jaw.union(boss1).union(boss2)

# Clevis slot for actuator connection
jaw_slot = cq.Workplane("XZ").center(jaw_mid_x, jaw_mid_z).rect(16, 16).extrude(2.1, both=True)
jaw = jaw.cut(jaw_slot)

# Pivot holes
jaw_hole_cut = cq.Workplane("XZ").pushPoints([(jaw_pivot_x, jaw_pivot_z), (jaw_mid_x, jaw_mid_z)]).circle(1.8).extrude(10, both=True)
jaw = jaw.cut(jaw_hole_cut)

# ==========================================
# Actuator (Cylinder & Rod)
# ==========================================

act_dx = jaw_mid_x - act_pivot_x
act_dz = jaw_mid_z - act_pivot_z
act_L = math.hypot(act_dx, act_dz)
act_rot_angle = math.degrees(math.atan2(-act_dx, -act_dz))

# Build vertically along Z first
rod = cq.Workplane("XY").circle(act_rod_d / 2.0).extrude(act_L - act_barrel_l + 0.1)
barrel = cq.Workplane("XY").workplane(offset=act_L - act_barrel_l).circle(act_barrel_d / 2.0).extrude(act_barrel_l)
dome = cq.Workplane("XY").workplane(offset=act_L).sphere(act_barrel_d / 2.0)
actuator = rod.union(barrel).union(dome)

# Linkage bosses
boss_bot = cq.Workplane("XZ").center(0, 0).circle(2.5).extrude(2, both=True)
boss_top = cq.Workplane("XZ").center(0, act_L).circle(3.38).extrude(2, both=True)
actuator = actuator.union(boss_bot).union(boss_top)

# Pin holes
act_hole_cut = cq.Workplane("XZ").pushPoints([(0, 0), (0, act_L)]).circle(0.6).extrude(10, both=True)
actuator = actuator.cut(act_hole_cut)

# Position into place (bottom connects to jaw, top connects to hub)
actuator = actuator.rotate((0, 0, 0), (0, 1, 0), act_rot_angle).translate((jaw_mid_x, 0, jaw_mid_z))

# ==========================================
# Lugs & Pins
# ==========================================

# Lower Lugs (start deep inside the hub to ensure clean union)
lower_lug_solid = (
    cq.Workplane("XZ")
    .moveTo(10.0, jaw_pivot_z - 6)
    .lineTo(jaw_pivot_x, jaw_pivot_z - 6)
    .threePointArc((jaw_pivot_x + 6, jaw_pivot_z), (jaw_pivot_x, jaw_pivot_z + 6))
    .lineTo(10.0, jaw_pivot_z + 6)
    .close()
    .extrude(lower_lug_t)
)

lug1 = lower_lug_solid.translate((0, lower_lug_gap / 2.0, 0))
lug2 = lower_lug_solid.translate((0, -lower_lug_gap / 2.0 - lower_lug_t, 0))
lower_lugs = lug1.union(lug2)

lower_hole_cut = cq.Workplane("XZ").center(jaw_pivot_x, jaw_pivot_z).circle(1.4).extrude(15, both=True)
lower_lugs = lower_lugs.cut(lower_hole_cut)

# Upper Lugs (start deep inside the hub)
upper_lug_solid = (
    cq.Workplane("XZ")
    .moveTo(5.0, act_pivot_z - 4)
    .lineTo(act_pivot_x, act_pivot_z - 4)
    .threePointArc((act_pivot_x + 4, act_pivot_z), (act_pivot_x, act_pivot_z + 4))
    .lineTo(5.0, act_pivot_z + 4)
    .close()
    .extrude(upper_lug_t)
)

ulug1 = upper_lug_solid.translate((0, upper_lug_gap / 2.0, 0))
ulug2 = upper_lug_solid.translate((0, -upper_lug_gap / 2.0 - upper_lug_t, 0))
upper_lugs = ulug1.union(ulug2)

upper_hole_cut = cq.Workplane("XZ").center(act_pivot_x, act_pivot_z).circle(1.24).extrude(15, both=True)
upper_lugs = upper_lugs.cut(upper_hole_cut)

# Pivot Pins
jaw_pin = cq.Workplane("XZ").workplane(offset=-(lower_lug_gap / 2.0 + lower_lug_t + 1.0)).center(jaw_pivot_x, jaw_pivot_z).circle(1.4).extrude(lower_lug_gap + 2 * lower_lug_t + 2.0)
upper_pin = cq.Workplane("XZ").workplane(offset=-(upper_lug_gap / 2.0 + upper_lug_t + 1.0)).center(act_pivot_x, act_pivot_z).circle(0.6).extrude(upper_lug_gap + 2 * upper_lug_t + 2.0)
mid_pin = cq.Workplane("XZ").workplane(offset=-4.5).center(jaw_mid_x, jaw_mid_z).circle(0.6).extrude(9.0)

# ==========================================
# Assembly
# ==========================================

# Combine single arm assembly
arm = (
    jaw
    .union(actuator)
    .union(lower_lugs)
    .union(upper_lugs)
    .union(jaw_pin)
    .union(upper_pin)
    .union(mid_pin)
)

# Pattern 4 times around the Z-axis to create the symmetric grapple
arms = arm
for i in range(1, 4):
    arms = arms.union(arm.rotate((0, 0, 0), (0, 0, 1), 90 * i))

result = hub.union(arms)

# Rotate the entire assembly to align the main axis with the Y-axis 
# as per the text's coordinate system description
result = result.rotate((0, 0, 0), (1, 0, 0), -90)