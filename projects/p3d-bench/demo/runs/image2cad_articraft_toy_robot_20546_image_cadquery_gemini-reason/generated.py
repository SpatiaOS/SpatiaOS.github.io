import cadquery as cq

# --- Parameters ---
# Overall scale factor
scale = 1.0

# Stance and positioning
stance_w = 50 * scale

# Feet dimensions
foot_w = 25 * scale
foot_l = 40 * scale
foot_h = 8 * scale

# Leg segment dimensions
leg_lower_l = 45 * scale
leg_lower_w = 12 * scale
leg_upper_l = 35 * scale
leg_upper_w = 10 * scale
joint_r = 8 * scale

# Torso dimensions
torso_w = 35 * scale
torso_l = 25 * scale
torso_h = 45 * scale

# Head dimensions
head_w = 15 * scale
head_l = 20 * scale
head_h = 12 * scale

# Arm dimensions
arm_l = 40 * scale
arm_r = 4 * scale

# --- Part Definitions ---

# 1. Feet with toe detail
foot = (
    cq.Workplane("XY")
    .box(foot_w, foot_l, foot_h)
    .edges("|Z").fillet(3 * scale)
    # Add an extruded block on the front face to act as toes
    .faces(">Y").workplane().box(foot_w * 0.6, foot_h * 1.2, foot_l * 0.3)
)

# 2. Lower Leg with structural truss cutout
lower_leg = (
    cq.Workplane("XY")
    .box(leg_lower_w, leg_lower_w, leg_lower_l)
    .faces(">X").workplane().rect(leg_lower_w * 0.6, leg_lower_l * 0.8).cutThruAll()
)

# 3. Upper Leg with structural truss cutout
upper_leg = (
    cq.Workplane("XY")
    .box(leg_upper_w, leg_upper_w, leg_upper_l)
    .faces(">X").workplane().rect(leg_upper_w * 0.6, leg_upper_l * 0.7).cutThruAll()
)

# 4. Spherical joint for articulation points (ankles, knees, hips, shoulders)
joint = cq.Workplane("XY").sphere(joint_r)

# 5. Central Torso block
torso = (
    cq.Workplane("XY")
    .box(torso_w, torso_l, torso_h)
    .edges("|Z").fillet(4 * scale)
)

# 6. Curved Back Armor (Carapace)
# Created using a custom 2D profile extruded symmetrically
back_armor_profile = (
    cq.Workplane("YZ")
    .moveTo(0, torso_h/2 + 5)
    .threePointArc((torso_l*0.8, 0), (0, -torso_h/2 - 15)) # Outer curve
    .lineTo(0, -torso_h/2 - 5)                             # Bottom thickness
    .threePointArc((torso_l*0.8 - 6, 0), (0, torso_h/2))   # Inner curve
    .close()
)
back_armor = back_armor_profile.extrude(torso_w * 0.6, both=True)

# 7. Head with angled face/visor
head = (
    cq.Workplane("XY")
    .box(head_w, head_l, head_h)
    .faces(">Y").chamfer(4 * scale) # Slope the front face
    .faces(">Z").chamfer(2 * scale) # Bevel the top
)

# 8. Arm strut (extruding along Y axis makes it easier to rotate later)
arm_strut = cq.Workplane("XZ").circle(arm_r).extrude(arm_l)

# 9. Left Weapon: Pincer/Claw
pincer_base = cq.Workplane("XY").box(12*scale, 10*scale, 12*scale)
claw = cq.Workplane("XY").box(3*scale, 25*scale, 4*scale)
pincer = (
    pincer_base
    .union(claw.translate((0, 15*scale, 6*scale)).rotate((0,0,0), (1,0,0), 10))
    .union(claw.translate((0, 15*scale, -6*scale)).rotate((0,0,0), (1,0,0), -10))
)

# 10. Right Weapon: Multi-barrel gun / Spikes
spike = cq.Workplane("XY").cylinder(30*scale, 2*scale).rotate((0,0,0), (1,0,0), 90)
multi_spike = (
    cq.Workplane("XY").box(12*scale, 10*scale, 12*scale)
    .union(spike.translate((5*scale, 15*scale, 5*scale)))
    .union(spike.translate((-5*scale, 15*scale, 5*scale)))
    .union(spike.translate((0, 15*scale, -5*scale)))
)

# --- Assembly ---
# We use cq.Assembly to easily position and combine all the parts
robot = cq.Assembly()

# Calculate Z heights for various body sections
z_foot = foot_h / 2
z_ankle = foot_h + joint_r
z_knee = z_ankle + leg_lower_l
z_hip = z_knee + leg_upper_l
z_torso = z_hip + torso_h / 2
z_shoulder = z_torso + torso_h * 0.3
z_neck = z_torso + torso_h / 2 + joint_r
z_head = z_neck + head_h/2 + 5*scale

# Assemble Left Leg
robot.add(foot.translate((-stance_w/2, 0, z_foot)))
robot.add(joint.translate((-stance_w/2, 0, z_ankle)))
robot.add(lower_leg.translate((-stance_w/2, 0, z_ankle + leg_lower_l/2)))
robot.add(joint.translate((-stance_w/2, 0, z_knee)))
robot.add(upper_leg.rotate((0,0,0), (0,1,0), -10).translate((-stance_w/2 + 4, 0, z_knee + leg_upper_l/2)))
robot.add(joint.translate((-stance_w/2 + 8, 0, z_hip)))

# Assemble Right Leg
robot.add(foot.translate((stance_w/2, 0, z_foot)))
robot.add(joint.translate((stance_w/2, 0, z_ankle)))
robot.add(lower_leg.translate((stance_w/2, 0, z_ankle + leg_lower_l/2)))
robot.add(joint.translate((stance_w/2, 0, z_knee)))
robot.add(upper_leg.rotate((0,0,0), (0,1,0), 10).translate((stance_w/2 - 4, 0, z_knee + leg_upper_l/2)))
robot.add(joint.translate((stance_w/2 - 8, 0, z_hip)))

# Assemble Torso, Back Armor, and Head
robot.add(torso.translate((0, 0, z_torso)))
robot.add(back_armor.translate((0, -torso_l/2 + 5, z_torso)))
robot.add(joint.translate((0, 0, z_neck)))
robot.add(head.rotate((0,0,0), (1,0,0), -15).translate((0, 8*scale, z_head)))

# Assemble Left Arm (Arm + Pincer Sub-assembly)
l_shoulder_pos = (-torso_w/2 - joint_r, 0, z_shoulder)
robot.add(joint.translate(l_shoulder_pos))
l_arm_compound = (
    cq.Assembly()
    .add(arm_strut)
    .add(pincer.translate((0, arm_l, 0))) # Attach weapon to end of arm
).toCompound().rotate((0,0,0), (1,0,0), -20).rotate((0,0,0), (0,0,1), -15).translate(l_shoulder_pos)
robot.add(l_arm_compound)

# Assemble Right Arm (Arm + Spikes Sub-assembly)
r_shoulder_pos = (torso_w/2 + joint_r, 0, z_shoulder)
robot.add(joint.translate(r_shoulder_pos))
r_arm_compound = (
    cq.Assembly()
    .add(arm_strut)
    .add(multi_spike.translate((0, arm_l, 0)))
).toCompound().rotate((0,0,0), (1,0,0), -30).rotate((0,0,0), (0,0,1), 15).translate(r_shoulder_pos)
robot.add(r_arm_compound)

# Export the final result as a single solid compound object
result = robot.toCompound()