import cadquery as cq

# Global parametric dimensions - adjust these to change overall robot size/proportions
overall_height = 120.0  # Total height from foot to head top
torso_main_length = 40.0
torso_main_width = 30.0
torso_main_height = 50.0
torso_top_cyl_radius = 12.0
torso_top_cyl_height = 15.0
head_size = 14.0

# Arm parameters
shoulder_joint_radius = 8.0
upper_arm_length = 30.0
upper_arm_width = 10.0
elbow_joint_radius = 6.0
lower_arm_length = 25.0
lower_arm_width = 8.0
claw_length = 15.0
claw_width = 6.0

# Leg parameters
hip_joint_radius = 10.0
upper_leg_length = 40.0
upper_leg_width = 12.0
knee_joint_radius = 8.0
lower_leg_length = 35.0
lower_leg_width = 10.0
foot_length = 25.0
foot_width = 20.0
foot_height = 8.0

# --------------------------
# Build Torso (main body)
# --------------------------
# Main rectangular torso body
torso_main = (
    cq.Workplane("XY")
    .box(torso_main_length, torso_main_width, torso_main_height)
    .edges("|Z").fillet(2.0)  # Soften edges
)

# Cylindrical top section of torso
torso_top_cyl = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, torso_main_height/2))
    .cylinder(torso_top_cyl_height, torso_top_cyl_radius)
)

# Side weapon/protrusion on torso right
torso_right_protrusion = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + 10, 0, torso_main_height/2 - 5))
    .box(15, 8, 10)
    .edges("|Z").fillet(1.0)
)

# Combine torso components
torso = torso_main.union(torso_top_cyl).union(torso_right_protrusion)

# --------------------------
# Build Head
# --------------------------
# Fixed: Removed fillet operation from sphere since spheres have no edges
head = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, torso_main_height/2 + torso_top_cyl_height + head_size/2))
    .sphere(head_size/2)
)

# --------------------------
# Build Right Arm (Claw Arm - robot's right, our left)
# --------------------------
# Shoulder joint
right_shoulder = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius, 0, torso_main_height/2 - 10))
    .sphere(shoulder_joint_radius)
)

# Upper arm
right_upper_arm = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length/2, 0, torso_main_height/2 - 10))
    .box(upper_arm_length, upper_arm_width, upper_arm_width)
    .edges("|Z").fillet(1.0)
)

# Elbow joint
right_elbow = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length - elbow_joint_radius, 0, torso_main_height/2 - 10))
    .sphere(elbow_joint_radius)
)

# Lower arm
right_lower_arm = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length - elbow_joint_radius*2 - lower_arm_length/2, 0, torso_main_height/2 - 10))
    .box(lower_arm_length, lower_arm_width, lower_arm_width)
    .edges("|Z").fillet(1.0)
)

# Claw assembly
claw_base = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length - elbow_joint_radius*2 - lower_arm_length - claw_length/2, 0, torso_main_height/2 - 10))
    .box(claw_length, claw_width*3, claw_width)
    .edges("|Z").fillet(0.5)
)
claw_finger1 = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length - elbow_joint_radius*2 - lower_arm_length - claw_length, claw_width, torso_main_height/2 - 10))
    .box(claw_length, claw_width, claw_width)
    .edges("|Z").fillet(0.5)
)
claw_finger2 = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/2 - shoulder_joint_radius*2 - upper_arm_length - elbow_joint_radius*2 - lower_arm_length - claw_length, -claw_width, torso_main_height/2 - 10))
    .box(claw_length, claw_width, claw_width)
    .edges("|Z").fillet(0.5)
)
right_claw = claw_base.union(claw_finger1).union(claw_finger2)

# Combine right arm components
right_arm = right_shoulder.union(right_upper_arm).union(right_elbow).union(right_lower_arm).union(right_claw)

# --------------------------
# Build Left Arm (Mechanical Arm - robot's left, our right)
# --------------------------
left_shoulder = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + shoulder_joint_radius, 0, torso_main_height/2 - 10))
    .sphere(shoulder_joint_radius)
)
left_upper_arm = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + shoulder_joint_radius*2 + upper_arm_length/2, 0, torso_main_height/2 - 10))
    .box(upper_arm_length, upper_arm_width, upper_arm_width)
    .edges("|Z").fillet(1.0)
)
left_elbow = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + shoulder_joint_radius*2 + upper_arm_length + elbow_joint_radius, 0, torso_main_height/2 - 10))
    .sphere(elbow_joint_radius)
)
left_lower_arm = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + shoulder_joint_radius*2 + upper_arm_length + elbow_joint_radius*2 + lower_arm_length/2, 0, torso_main_height/2 - 10))
    .box(lower_arm_length, lower_arm_width, lower_arm_width)
    .edges("|Z").fillet(1.0)
)
left_arm_end = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/2 + shoulder_joint_radius*2 + upper_arm_length + elbow_joint_radius*2 + lower_arm_length + 5, 0, torso_main_height/2 - 10))
    .cylinder(10, 6)
)

left_arm = left_shoulder.union(left_upper_arm).union(left_elbow).union(left_lower_arm).union(left_arm_end)

# --------------------------
# Build Legs (symmetric left/right, mirrored)
# --------------------------
# Right Leg (robot's right, our left)
right_hip = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius))
    .sphere(hip_joint_radius)
)
right_upper_leg = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length/2))
    .box(upper_leg_width, upper_leg_width, upper_leg_length)
    .edges("|Z").fillet(1.0)
)
right_knee = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius))
    .sphere(knee_joint_radius)
)
right_lower_leg = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius*2 - lower_leg_length/2))
    .box(lower_leg_width, lower_leg_width, lower_leg_length)
    .edges("|Z").fillet(1.0)
)
right_foot = (
    cq.Workplane("XY")
    .transformed(offset=(-torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius*2 - lower_leg_length - foot_height/2))
    .box(foot_length, foot_width, foot_height)
    .edges("|Z").fillet(1.0)
)
right_leg = right_hip.union(right_upper_leg).union(right_knee).union(right_lower_leg).union(right_foot)

# Left Leg (mirror of right leg)
left_hip = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius))
    .sphere(hip_joint_radius)
)
left_upper_leg = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length/2))
    .box(upper_leg_width, upper_leg_width, upper_leg_length)
    .edges("|Z").fillet(1.0)
)
left_knee = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius))
    .sphere(knee_joint_radius)
)
left_lower_leg = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius*2 - lower_leg_length/2))
    .box(lower_leg_width, lower_leg_width, lower_leg_length)
    .edges("|Z").fillet(1.0)
)
left_foot = (
    cq.Workplane("XY")
    .transformed(offset=(torso_main_length/4, 0, -torso_main_height/2 - hip_joint_radius*2 - upper_leg_length - knee_joint_radius*2 - lower_leg_length - foot_height/2))
    .box(foot_length, foot_width, foot_height)
    .edges("|Z").fillet(1.0)
)
left_leg = left_hip.union(left_upper_leg).union(left_knee).union(left_lower_leg).union(left_foot)

# --------------------------
# Combine all components into final robot
# --------------------------
result = torso.union(head).union(right_arm).union(left_arm).union(right_leg).union(left_leg)