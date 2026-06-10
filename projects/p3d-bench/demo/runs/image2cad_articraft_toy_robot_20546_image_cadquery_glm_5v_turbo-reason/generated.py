import cadquery as cq

# =============================================================================
# ROBOT MECH FIGURE - Parametric CAD Model
# Based on Bionicle-style construction robot with articulated limbs
# =============================================================================

# ---------------------- GLOBAL PARAMETERS ------------------------------------
total_height = 100.0      # Overall height of the robot

# Head parameters
head_diameter = 12.0
head_height = 14.0
visor_length = 8.0
visor_width = 6.0

# Torso parameters
torso_width = 18.0
torso_depth = 14.0
torso_height = 24.0

# Arm parameters (per segment)
upper_arm_length = 20.0
upper_arm_width = 6.0
forearm_length = 18.0
forearm_width = 5.0
hand_length = 12.0
claw_spread = 10.0

# Leg parameters
thigh_length = 22.0
thigh_width = 7.0
shin_length = 20.0
shin_width = 6.0
foot_length = 14.0
foot_width = 10.0

# Joint parameters
joint_diameter = 5.0
joint_height = 4.0

# =============================================================================
# COMPONENT FUNCTIONS
# =============================================================================

def create_head():
    """Create the robot head with visor/helmet detail"""
    head_z = torso_height/2 + head_height/2
    
    # Main head sphere
    head = (
        cq.Workplane("XY")
        .workplane(offset=head_z)
        .sphere(head_diameter/2)
    )
    
    # Visor protrusion on front
    visor = (
        cq.Workplane("XY")
        .workplane(offset=head_z + head_diameter/3)
        .box(visor_width, visor_length, 3.0, centered=(True, True, False))
    )
    
    # Helmet crest on top
    crest = (
        cq.Workplane("XY")
        .workplane(offset=head_z + head_diameter/2)
        .box(4.0, 8.0, 4.0, centered=(True, True, False))
    )
    
    return head.union(visor).union(crest)

def create_torso():
    """Create main torso body with armor plating"""
    # Base torso box
    torso = (
        cq.Workplane("XY")
        .box(torso_width, torso_depth, torso_height)
    )
    
    # Front chest armor plate
    chest_armor = (
        cq.Workplane("XZ")
        .workplane(offset=torso_depth/2 + 1.5)
        .center(0, torso_height*0.15)
        .ellipse(torso_width*0.4, torso_height*0.25)
        .extrude(3.0)
    )
    
    # Back pack/armor detail
    backpack = (
        cq.Workplane("XY")
        .transformed(offset=(0, -torso_depth/2 - 3, torso_height*0.1))
        .box(torso_width*0.8, 6.0, torso_height*0.6)
    )
    
    return torso.union(chest_armor).union(backpack)

def create_arm(is_left=True):
    """Create an articulated arm with claw hand"""
    side = -1 if is_left else 1
    offset_x = side * (torso_width/2 + 2)
    arm_base_z = torso_height*0.2
    
    # Upper arm segment
    upper_arm = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x, 0, arm_base_z))
        .box(upper_arm_width, upper_arm_width, upper_arm_length)
    )
    
    # Elbow joint
    elbow = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x, 0, arm_base_z + upper_arm_length/2))
        .cylinder(joint_height, joint_diameter/2)
    )
    
    # Forearm segment
    forearm_offset_z = arm_base_z + upper_arm_length/2 + joint_height/2
    forearm = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*3, 0, forearm_offset_z + forearm_length/2))
        .box(forearm_width, forearm_width, forearm_length)
    )
    
    # Wrist joint
    wrist_z = forearm_offset_z + forearm_length
    wrist = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*3, 0, wrist_z))
        .cylinder(joint_height*0.8, joint_diameter/2 * 0.8)
    )
    
    # Hand/claw assembly
    hand_z = wrist_z + joint_height*0.4
    hand = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2, 0, hand_z + hand_length/2))
        .box(4.0, hand_length*0.6, hand_length)
    )
    
    # Claw fingers
    claw1 = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2 - 3, 0, hand_z + hand_length/2 + claw_spread/2))
        .box(2.0, claw_spread, 3.0)
    )
    
    claw2 = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2 + 3, 0, hand_z + hand_length/2 + claw_spread/2))
        .box(2.0, claw_spread, 3.0)
    )
    
    return upper_arm.union(elbow).union(forearm).union(wrist).union(hand).union(claw1).union(claw2)

def create_leg(is_left=True):
    """Create an articulated leg with armored plates"""
    side = -1 if is_left else 1
    offset_x = side * (torso_width/4)
    hip_z = -torso_height/2
    
    # Hip joint
    hip = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x, 0, hip_z))
        .cylinder(joint_height*1.2, joint_diameter)
    )
    
    # Thigh segment
    thigh_z = hip_z - thigh_length/2 - joint_height*0.6
    thigh = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x, 0, thigh_z))
        .box(thigh_width, thigh_width*1.2, thigh_length)
    )
    
    # Knee joint
    knee_z = hip_z - thigh_length - joint_height*0.6
    knee = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x, 0, knee_z))
        .sphere(joint_diameter*0.7)
    )
    
    # Shin segment
    shin_z = knee_z - shin_length/2 - joint_height*0.3
    shin = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2, 0, shin_z))
        .box(shin_width, shin_width*1.1, shin_length)
    )
    
    # Ankle/Foot base
    ankle_z = knee_z - shin_length - joint_height*0.3
    ankle = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2, 0, ankle_z))
        .box(foot_width*0.8, foot_length*0.4, joint_height)
    )
    
    # Foot
    foot_z = ankle_z - foot_length*0.3
    foot = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2, foot_length*0.2, foot_z))
        .box(foot_width, foot_length, 4.0)
    )
    
    # Toe detail
    toe = (
        cq.Workplane("XY")
        .transformed(offset=(offset_x + side*2, foot_length*0.4 + foot_length*0.2, foot_z + 1.5))
        .box(foot_width*0.6, 4.0, 3.0)
    )
    
    return hip.union(thigh).union(knee).union(shin).union(ankle).union(foot).union(toe)

def create_weapon_backpack():
    """Create weapon/backpack accessory on back"""
    base_offset = (0, -torso_depth/2 - 3, torso_height*0.1)
    
    # Main weapon body
    body = (
        cq.Workplane("XY")
        .transformed(offset=base_offset)
        .box(8.0, 16.0, 4.0)
    )
    
    # Barrel
    barrel = (
        cq.Workplane("YZ")
        .transformed(offset=(base_offset[0] + 4, base_offset[1] + 10, base_offset[2]))
        .cylinder(12.0, 1.5)
    )
    
    # Stock/handle
    stock = (
        cq.Workplane("XY")
        .transformed(offset=(base_offset[0] - 2, base_offset[1] - 6, base_offset[2]))
        .box(4.0, 8.0, 3.0)
    )
    
    return body.union(barrel).union(stock)

# =============================================================================
# MAIN ASSEMBLY
# =============================================================================

# Start with torso as base
result = create_torso()

# Add head
result = result.union(create_head())

# Add left arm
result = result.union(create_arm(is_left=True))

# Add right arm
result = result.union(create_arm(is_left=False))

# Add left leg
result = result.union(create_leg(is_left=True))

# Add right leg  
result = result.union(create_leg(is_left=False))

# Add backpack weapon
result = result.union(create_weapon_backpack())