import cadquery as cq

# Parameters
torso_radius = 22.0
torso_height = 35.0
leg_length_upper = 35.0
leg_length_lower = 35.0
arm_length = 40.0
head_radius = 9.0

# --- Torso Assembly ---
# Main body: Base block
torso_base = (
    cq.Workplane("XY")
    .box(28, 24, 12)
    .edges("|Z")
    .fillet(2)
)

# Upper dome shell (simulating the curved back plate)
torso_dome = (
    cq.Workplane("XY", origin=(0, 0, 6))
    .sphere(torso_radius)
    .cut(
        cq.Workplane("XY", origin=(0, 0, 6))
        .box(50, 50, 30)
        .translate((0, 0, -15))
    )
)

# Backpack structure
backpack = (
    cq.Workplane("XY", origin=(0, -14, 10))
    .box(12, 8, 20)
    .edges("|Z")
    .fillet(1)
)

# Antennas on backpack
antenna1 = (
    cq.Workplane("XY", origin=(-4, -18, 25))
    .cylinder(12, 1.5)
)
antenna2 = (
    cq.Workplane("XY", origin=(4, -18, 25))
    .cylinder(12, 1.5)
)

torso_assembly = torso_base.union(torso_dome).union(backpack).union(antenna1).union(antenna2)

# --- Head Assembly ---
# Neck connector
neck = (
    cq.Workplane("XY", origin=(0, 0, torso_height - 2))
    .cylinder(4, 4)
)

# Head sphere
head = (
    cq.Workplane("XY", origin=(0, 0, torso_height + 2))
    .sphere(head_radius)
)

# Head fin/antenna
head_fin = (
    cq.Workplane("XY", origin=(0, 0, torso_height + 2 + head_radius))
    .box(2, 10, 3)
    .rotate((0, 0, 0), (1, 0, 0), 45)
)

head_assembly = neck.union(head).union(head_fin)

# --- Leg Assembly Function ---
def create_leg(is_left):
    # Hip joint
    hip = cq.Workplane("XY").sphere(7)
    
    # Thigh segment
    thigh = (
        cq.Workplane("XY", origin=(0, 0, -10))
        .box(12, 12, leg_length_upper)
        .edges("|Z")
        .fillet(2)
    )
    
    # Knee joint
    knee = (
        cq.Workplane("XY", origin=(0, 0, -10 - leg_length_upper))
        .sphere(6)
    )
    
    # Shin segment
    shin = (
        cq.Workplane("XY", origin=(0, 0, -10 - leg_length_upper - 5))
        .box(10, 10, leg_length_lower)
        .edges("|Z")
        .fillet(2)
    )
    
    # Ankle joint
    ankle = (
        cq.Workplane("XY", origin=(0, 0, -10 - leg_length_upper - 5 - leg_length_lower))
        .sphere(5)
    )
    
    # Foot
    foot = (
        cq.Workplane("XY", origin=(0, 8, -10 - leg_length_upper - 5 - leg_length_lower - 5))
        .box(14, 22, 8)
        .edges("|Z")
        .fillet(2)
    )
    
    # Armor Panels (Triangular details)
    # Position panel on the outer side of the leg
    panel_x = -7 if is_left else 7
    
    thigh_panel = (
        cq.Workplane("XY", origin=(panel_x, 0, -10 - leg_length_upper/2))
        .polygon(3, 12)
        .extrude(2)
    )
    
    shin_panel = (
        cq.Workplane("XY", origin=(panel_x, 0, -10 - leg_length_upper - 5 - leg_length_lower/2))
        .polygon(3, 15)
        .extrude(2)
    )

    leg = hip.union(thigh).union(knee).union(shin).union(ankle).union(foot)
    leg = leg.union(thigh_panel).union(shin_panel)
    
    # Tilt leg slightly forward for stance
    return leg.rotate((0,0,0), (1,0,0), -5)

# Position legs
leg_left = create_leg(is_left=True).translate((-10, 0, -10))
leg_right = create_leg(is_left=False).translate((10, 0, -10))

# --- Arm Assembly (Claw Arm) ---
# Positioned on the left side (viewer's left)
shoulder = cq.Workplane("XY").sphere(6)

upper_arm = (
    cq.Workplane("XY", origin=(0, 0, -5))
    .cylinder(20, 4)
    .rotate((0,0,0), (1,0,0), 45)
)

elbow = (
    # Approximate end of rotated upper arm
    cq.Workplane("XY", origin=(0, 14, -14))
    .sphere(4)
)

forearm = (
    cq.Workplane("XY", origin=(0, 14, -14))
    .cylinder(20, 3)
    .rotate((0,0,0), (1,0,0), -30)
)

wrist = (
    # Approximate end of forearm
    cq.Workplane("XY", origin=(0, 31, -4))
    .sphere(3)
)

# Claw Base
claw_base = (
    cq.Workplane("XY", origin=(0, 35, -4))
    .sphere(4)
)

# Claw Fingers (3-pronged gripper)
finger1 = (
    cq.Workplane("XY", origin=(0, 35, -4))
    .box(2, 2, 15)
    .rotate((0,0,0), (1,0,0), 25)
)
finger2 = (
    cq.Workplane("XY", origin=(0, 35, -4))
    .box(2, 2, 15)
    .rotate((0,0,0), (1,0,0), -25)
)
finger3 = (
    cq.Workplane("XY", origin=(0, 35, -4))
    .box(2, 2, 15)
    .rotate((0,0,0), (0,1,0), 90)
)

arm_assembly = shoulder.union(upper_arm).union(elbow).union(forearm).union(wrist)
arm_assembly = arm_assembly.union(claw_base).union(finger1).union(finger2).union(finger3)

# Position arm on the side of the torso
# Torso width is ~28. Side is x=14. Place arm at x = -22.
arm_final = arm_assembly.translate((-22, 5, 15)).rotate((0,0,0), (0,0,1), 20)

# --- Blaster/Other Arm (Right side) ---
# Simplified structure for the other side
blaster_shoulder = cq.Workplane("XY").sphere(6)
blaster_arm_seg = (
    cq.Workplane("XY", origin=(0,0,-5))
    .cylinder(15, 4)
    .rotate((0,0,0), (1,0,0), 30)
)
blaster_gun = (
    cq.Workplane("XY", origin=(0, 10, -8))
    .box(4, 4, 12)
)
blaster_assembly = blaster_shoulder.union(blaster_arm_seg).union(blaster_gun)
blaster_final = blaster_assembly.translate((22, 5, 15)).rotate((0,0,0), (0,0,1), -20)


# --- Final Result ---
result = (
    torso_assembly
    .union(head_assembly)
    .union(leg_left)
    .union(leg_right)
    .union(arm_final)
    .union(blaster_final)
)