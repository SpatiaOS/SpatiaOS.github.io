import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Base (housing_cap)
base_dia = 390.0
base_h = 104.0
base_step_r = 130.0

# Shoulder (lever_arm_with_bevel_gear)
shoulder_r1 = 125.0
shoulder_r2 = 90.0
shoulder_h1 = 30.0
shoulder_h2 = 20.0
shoulder_body_x = 160.0
shoulder_body_y = 140.0
shoulder_body_z = 180.0

# Lower Arm (connecting_arm)
lower_arm_l = 442.0
lower_arm_w = 120.0
lower_arm_t = 62.0
hub1_r = 50.0
hub2_r = 45.0

# Elbow (joint_housing)
elbow_head_x = 100.0
elbow_head_y = 132.5
elbow_head_z = 93.9
elbow_cyl_r = 31.0
elbow_cyl_l = 200.0

# Forearm (multi_bore_housing)
forearm_w = 76.0
forearm_h = 80.0
forearm_l = 173.0

# Wrist (scroll_housing)
wrist_r = 42.0
wrist_l = 85.0

# Gripper Jaws
gripper_l = 127.0
gripper_t = 19.5

# Pose Angles (degrees)
theta_pan = 30.0      # Shoulder pan (around Z)
theta_shoulder = 65.0 # Lower arm elevation from horizontal
theta_elbow = -15.0   # Upper arm elevation from horizontal

# ==========================================
# Modeling
# ==========================================

# 1. Base (housing_cap)
# ------------------------------------------
base_cyl = cq.Workplane("XY").cylinder(80, base_dia/2, centered=(True, True, False))
base_step = cq.Workplane("XY", origin=(0,0,80)).cylinder(24, base_step_r, centered=(True, True, False))
base_boss = cq.Workplane("XY", origin=(0,0,104)).cylinder(20, 15, centered=(True, True, False))
base = base_cyl.union(base_step).union(base_boss)

# Add peripheral mounting lugs
lug_cut = cq.Workplane("XY").cylinder(200, 195, centered=(True, True, False))
for i in range(6):
    lug = (
        cq.Workplane("XY")
        .box(base_dia + 20, 40, 80, centered=(True, True, False))
        .rotate((0,0,0), (0,0,1), i * 60)
    )
    base = base.union(lug)
base = base.intersect(lug_cut)

# 2. Shoulder (lever_arm_with_bevel_gear)
# ------------------------------------------
shoulder_base_z = base_h
shoulder_z = shoulder_base_z + shoulder_h1 + shoulder_h2

shoulder = (
    cq.Workplane("XY", origin=(0, 0, shoulder_base_z))
    .cylinder(shoulder_h1, shoulder_r1, centered=(True, True, False))
    .faces(">Z")
    .cylinder(shoulder_h2, shoulder_r2, centered=(True, True, False))
)

# Main shoulder body with U-slot for lower arm
shoulder_body = (
    cq.Workplane("XY", origin=(0, 0, shoulder_z))
    .box(shoulder_body_x, shoulder_body_y, shoulder_body_z, centered=(True, True, False))
)
shoulder_cut = (
    cq.Workplane("XY", origin=(0, 0, shoulder_z + shoulder_body_z - 100))
    .box(shoulder_body_x + 20, lower_arm_w + 10, 110, centered=(True, True, False))
)
shoulder_body = shoulder_body.cut(shoulder_cut)
shoulder = shoulder.union(shoulder_body)

# Pivot point for lower arm
pivot1_z = shoulder_z + shoulder_body_z - 40

# Bevel gear teeth feature
gear_z = pivot1_z + 20
gear_hub = cq.Workplane("XY", origin=(0, 0, gear_z)).cylinder(20, 60, centered=(True, True, False))
for i in range(12):
    cut_box = (
        cq.Workplane("XY", origin=(0, 0, gear_z))
        .box(5, 130, 20, centered=(True, True, False))
        .rotate((0,0,0), (0,0,1), i * 15)
    )
    gear_hub = gear_hub.cut(cut_box)
shoulder = shoulder.union(gear_hub)

# 3. Spacers (12x bearing elements)
# ------------------------------------------
spacer_r = 110.0
spacers = None
for i in range(12):
    angle = i * 30.0
    sp = (
        cq.Workplane("XY", origin=(spacer_r * math.cos(math.radians(angle)), 
                                   spacer_r * math.sin(math.radians(angle)), 
                                   base_h))
        .cylinder(3, 3, centered=(True, True, False))
        .cut(cq.Workplane("XY", origin=(spacer_r * math.cos(math.radians(angle)), 
                                        spacer_r * math.sin(math.radians(angle)), 
                                        base_h)).cylinder(3, 1.6, centered=(True, True, False)))
    )
    spacers = sp if spacers is None else spacers.union(sp)

# 4. Lower Arm (connecting_arm)
# ------------------------------------------
arm_profile = (
    cq.Workplane("XZ")
    .moveTo(0, hub1_r * 0.8)
    .lineTo(lower_arm_l, hub2_r * 0.8)
    .lineTo(lower_arm_l, -hub2_r * 0.8)
    .lineTo(0, -hub1_r * 0.8)
    .close()
    .extrude(lower_arm_t / 2.0, both=True)
)
hub1 = cq.Workplane("XZ").cylinder(lower_arm_w, hub1_r)
hub2 = cq.Workplane("XZ", origin=(lower_arm_l, 0, 0)).cylinder(lower_arm_w, hub2_r)

lower_arm = hub1.union(hub2).union(arm_profile)

# Position lower arm
lower_arm = lower_arm.rotate((0,0,0), (0,1,0), -theta_shoulder)
lower_arm = lower_arm.translate((0, 0, pivot1_z))

# 5. Elbow Joint (joint_housing)
# ------------------------------------------
pivot2_x = lower_arm_l * math.cos(math.radians(theta_shoulder))
pivot2_z = pivot1_z + lower_arm_l * math.sin(math.radians(theta_shoulder))

# U-shaped head to encapsulate lower arm hub
elbow_head = (
    cq.Workplane("YZ", origin=(-40, 0, 0))
    .box(elbow_head_y, elbow_head_z, elbow_head_x + 40, centered=(True, True, False))
    .edges("|X").chamfer(10)
)
elbow_cut = (
    cq.Workplane("YZ", origin=(-50, 0, 0))
    .box(lower_arm_w + 5, elbow_head_z + 10, 100, centered=(True, True, False))
)
elbow_head = elbow_head.cut(elbow_cut)

elbow_hub = cq.Workplane("XZ").cylinder(elbow_head_y, hub2_r + 5)
elbow_arm = cq.Workplane("YZ", origin=(elbow_head_x, 0, 0)).cylinder(elbow_cyl_l, elbow_cyl_r, centered=(True, True, False))

elbow = elbow_head.union(elbow_hub).union(elbow_arm)

# Position elbow
elbow = elbow.rotate((0,0,0), (0,1,0), -theta_elbow)
elbow = elbow.translate((pivot2_x, 0, pivot2_z))

# 6. Forearm (multi_bore_housing)
# ------------------------------------------
forearm = (
    cq.Workplane("YZ")
    .box(forearm_h, forearm_w, forearm_l, centered=(True, True, False))
    .edges("|X").fillet(20)
)

pivot3_dist = elbow_head_x + elbow_cyl_l
pivot3_x = pivot2_x + pivot3_dist * math.cos(math.radians(theta_elbow))
pivot3_z = pivot2_z + pivot3_dist * math.sin(math.radians(theta_elbow))

forearm = forearm.rotate((0,0,0), (0,1,0), -theta_elbow)
forearm = forearm.translate((pivot3_x, 0, pivot3_z))

# 7. Wrist (scroll_housing & knob_plug)
# ------------------------------------------
wrist = (
    cq.Workplane("YZ")
    .cylinder(wrist_l, wrist_r, centered=(True, True, False))
    .faces(">X")
    .box(70, 70, 40, centered=(True, True, False))
    .edges("|X").fillet(10)
)

pivot4_dist = pivot3_dist + forearm_l
pivot4_x = pivot2_x + pivot4_dist * math.cos(math.radians(theta_elbow))
pivot4_z = pivot2_z + pivot4_dist * math.sin(math.radians(theta_elbow))

wrist = wrist.rotate((0,0,0), (0,1,0), -theta_elbow)
wrist = wrist.translate((pivot4_x, 0, pivot4_z))

# 8. Gripper Jaws
# ------------------------------------------
jaw_shape = (
    cq.Workplane("XY")
    .moveTo(0, 10)
    .lineTo(gripper_l * 0.4, 35)
    .lineTo(gripper_l, 25)
    .lineTo(gripper_l, 15)
    .lineTo(gripper_l * 0.4, 20)
    .lineTo(30, 5)
    .lineTo(0, -5)
    .close()
    .extrude(gripper_t / 2.0, both=True)
)
jaw1 = jaw_shape
jaw2 = jaw_shape.mirror("XZ")
jaws = jaw1.union(jaw2)

pivot5_dist = pivot4_dist + wrist_l + 40
pivot5_x = pivot2_x + pivot5_dist * math.cos(math.radians(theta_elbow))
pivot5_z = pivot2_z + pivot5_dist * math.sin(math.radians(theta_elbow))

jaws = jaws.rotate((0,0,0), (0,1,0), -theta_elbow)
jaws = jaws.translate((pivot5_x, 0, pivot5_z))

# ==========================================
# Assembly
# ==========================================

# Group all moving parts and apply pan rotation around global Z
arm_assembly = shoulder.union(spacers).union(lower_arm).union(elbow).union(forearm).union(wrist).union(jaws)
arm_assembly = arm_assembly.rotate((0,0,0), (0,0,1), theta_pan)

# Final model
result = base.union(arm_assembly)