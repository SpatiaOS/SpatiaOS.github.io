import cadquery as cq

# =============================================================================
# BIONICLE-STYLE ROBOT MODEL
# Approximate recreation of a LEGO Technic/Bionicle humanoid figure based on
# visual proportions.  The model uses a dynamic pose with one leg forward,
# long lower legs, a compact armored torso, a claw on the right arm and a
# barrel weapon on the left, plus characteristic back antenna.
# =============================================================================

# Global scale factor – increase to enlarge the entire model
SCALE = 1.0

# -----------------------------------------------------------------------------
# MAIN PARAMETERS
# -----------------------------------------------------------------------------
# Feet
FOOT_LENGTH      = 24.0 * SCALE
FOOT_WIDTH       = 18.0 * SCALE
FOOT_HEIGHT      = 4.0  * SCALE
ANKLE_HEIGHT     = 6.0  * SCALE

# Legs
LOWER_LEG_LEN    = 34.0 * SCALE
UPPER_LEG_LEN    = 22.0 * SCALE
LEG_WIDTH        = 9.0  * SCALE
LEG_THICKNESS    = 5.0  * SCALE
KNEE_DIAMETER    = 7.0  * SCALE

# Torso
TORSO_WIDTH      = 22.0 * SCALE
TORSO_HEIGHT     = 28.0 * SCALE
TORSO_DEPTH      = 18.0 * SCALE
HIP_WIDTH        = 18.0 * SCALE

# Arms
UPPER_ARM_LEN    = 20.0 * SCALE
FOREARM_LEN      = 18.0 * SCALE
ARM_WIDTH        = 6.0  * SCALE
ARM_THICKNESS    = 4.5  * SCALE

# Head
HEAD_WIDTH       = 9.0  * SCALE
HEAD_HEIGHT      = 11.0 * SCALE
HEAD_DEPTH       = 9.0  * SCALE

# -----------------------------------------------------------------------------
# HELPER: create a centered box, rotate, then translate
# -----------------------------------------------------------------------------
def place_box(length, width, height, tx, ty, tz, rx=0, ry=0, rz=0):
    wp = cq.Workplane("XY").box(length, width, height)
    if rx:
        wp = wp.rotate((0, 0, 0), (1, 0, 0), rx)
    if ry:
        wp = wp.rotate((0, 0, 0), (0, 1, 0), ry)
    if rz:
        wp = wp.rotate((0, 0, 0), (0, 0, 1), rz)
    return wp.translate((tx, ty, tz))

# =============================================================================
# 1. FEET & ANKLES
# =============================================================================
# Right foot (forward / viewer's left)
right_foot = place_box(FOOT_LENGTH, FOOT_WIDTH, FOOT_HEIGHT,
                       -16.0*SCALE, 18.0*SCALE, FOOT_HEIGHT/2.0)
right_foot = right_foot.edges("|Z").fillet(2.5*SCALE)

right_toe  = place_box(8.0*SCALE, 6.0*SCALE, 2.0*SCALE,
                       -20.0*SCALE, 24.0*SCALE, FOOT_HEIGHT + 1.0*SCALE)
right_heel = place_box(6.0*SCALE, 6.0*SCALE, 2.0*SCALE,
                       -12.0*SCALE, 10.0*SCALE, FOOT_HEIGHT + 1.0*SCALE)

# Left foot (back / viewer's right)
left_foot = place_box(FOOT_LENGTH, FOOT_WIDTH, FOOT_HEIGHT,
                      14.0*SCALE, -10.0*SCALE, FOOT_HEIGHT/2.0)
left_foot = left_foot.edges("|Z").fillet(2.5*SCALE)

left_toe  = place_box(8.0*SCALE, 6.0*SCALE, 2.0*SCALE,
                      18.0*SCALE, -4.0*SCALE, FOOT_HEIGHT + 1.0*SCALE)
left_heel = place_box(6.0*SCALE, 6.0*SCALE, 2.0*SCALE,
                      10.0*SCALE, -16.0*SCALE, FOOT_HEIGHT + 1.0*SCALE)

# Ankle cylinders
right_ankle = (cq.Workplane("XY")
               .cylinder(ANKLE_HEIGHT, 3.5*SCALE)
               .translate((-16.0*SCALE, 14.0*SCALE, FOOT_HEIGHT + ANKLE_HEIGHT/2.0)))

left_ankle = (cq.Workplane("XY")
              .cylinder(ANKLE_HEIGHT, 3.5*SCALE)
              .translate((14.0*SCALE, -8.0*SCALE, FOOT_HEIGHT + ANKLE_HEIGHT/2.0)))

# =============================================================================
# 2. LOWER LEGS
# =============================================================================
# Angled beams running from ankle to knee
right_lower_leg = place_box(LEG_THICKNESS, LEG_WIDTH, LOWER_LEG_LEN,
                            0, 0, -LOWER_LEG_LEN/2.0, rx=-12)
right_lower_leg = right_lower_leg.translate((-16.0*SCALE, 14.0*SCALE,
                                             FOOT_HEIGHT + ANKLE_HEIGHT))

left_lower_leg = place_box(LEG_THICKNESS, LEG_WIDTH, LOWER_LEG_LEN,
                           0, 0, -LOWER_LEG_LEN/2.0, rx=8)
left_lower_leg = left_lower_leg.translate((14.0*SCALE, -8.0*SCALE,
                                           FOOT_HEIGHT + ANKLE_HEIGHT))

# =============================================================================
# 3. KNEES
# =============================================================================
right_knee_z = FOOT_HEIGHT + ANKLE_HEIGHT + LOWER_LEG_LEN * 0.85
left_knee_z  = FOOT_HEIGHT + ANKLE_HEIGHT + LOWER_LEG_LEN * 0.82

right_knee = cq.Workplane("XY").sphere(KNEE_DIAMETER/2.0).translate(
    (-14.0*SCALE, 10.0*SCALE, right_knee_z))
left_knee = cq.Workplane("XY").sphere(KNEE_DIAMETER/2.0).translate(
    (12.0*SCALE, -5.0*SCALE, left_knee_z))

# Small front knee pads
right_knee_pad = place_box(6.0*SCALE, 3.0*SCALE, 8.0*SCALE,
                           -14.0*SCALE, 13.0*SCALE, right_knee_z, rx=-12)
left_knee_pad = place_box(6.0*SCALE, 3.0*SCALE, 8.0*SCALE,
                          12.0*SCALE, -2.0*SCALE, left_knee_z, rx=8)

# =============================================================================
# 4. UPPER LEGS
# =============================================================================
# From knee up to hip, angled inward
right_upper_leg = place_box(LEG_THICKNESS, LEG_WIDTH, UPPER_LEG_LEN,
                            0, 0, UPPER_LEG_LEN/2.0, rx=18, ry=-8)
right_upper_leg = right_upper_leg.translate((-14.0*SCALE, 10.0*SCALE, right_knee_z))

left_upper_leg = place_box(LEG_THICKNESS, LEG_WIDTH, UPPER_LEG_LEN,
                           0, 0, UPPER_LEG_LEN/2.0, rx=-12, ry=8)
left_upper_leg = left_upper_leg.translate((12.0*SCALE, -5.0*SCALE, left_knee_z))

# =============================================================================
# 5. HIPS & TORSO CORE
# =============================================================================
hip_z = max(right_knee_z + UPPER_LEG_LEN*0.85,
            left_knee_z  + UPPER_LEG_LEN*0.85)

hips = place_box(HIP_WIDTH, 12.0*SCALE, 10.0*SCALE, 0, 2.0*SCALE, hip_z)

torso_z = hip_z + 5.0*SCALE
torso_core = place_box(TORSO_WIDTH*0.65, TORSO_DEPTH*0.6, TORSO_HEIGHT,
                       0, 2.0*SCALE, torso_z + TORSO_HEIGHT/2.0)

# =============================================================================
# 6. TORSO ARMOR & DETAILS
# =============================================================================
# Large curved chest plate
chest_armor = place_box(TORSO_WIDTH*1.1, 5.0*SCALE, TORSO_HEIGHT*0.85,
                        0, 11.0*SCALE, torso_z + TORSO_HEIGHT*0.55)
# Fillet radius kept small so it fits within the thin armor plate geometry
chest_armor = chest_armor.edges("|X").fillet(2.0*SCALE)

# Back plate
back_armor = place_box(TORSO_WIDTH, 4.0*SCALE, TORSO_HEIGHT*0.7,
                       0, -9.0*SCALE, torso_z + TORSO_HEIGHT*0.65)
# Fillet radius kept small so it fits within the thin back plate geometry
back_armor = back_armor.edges("|X").fillet(1.5*SCALE)

# Side technic bushings
right_side_detail = (cq.Workplane("XY")
                     .cylinder(6.0*SCALE, 3.0*SCALE)
                     .rotate((0,0,0), (1,0,0), 90)
                     .translate((-TORSO_WIDTH/2.0, 0, torso_z + TORSO_HEIGHT*0.5)))
left_side_detail = (cq.Workplane("XY")
                    .cylinder(6.0*SCALE, 3.0*SCALE)
                    .rotate((0,0,0), (1,0,0), 90)
                    .translate((TORSO_WIDTH/2.0, 0, torso_z + TORSO_HEIGHT*0.5)))

# =============================================================================
# 7. HEAD
# =============================================================================
neck = place_box(6.0*SCALE, 5.0*SCALE, 5.0*SCALE,
                 0, 5.0*SCALE, torso_z + TORSO_HEIGHT + 2.5*SCALE)

head = place_box(HEAD_WIDTH, HEAD_DEPTH, HEAD_HEIGHT,
                 0, 7.0*SCALE, torso_z + TORSO_HEIGHT + 5.0*SCALE + HEAD_HEIGHT/2.0)
head = head.edges().fillet(2.0*SCALE)

# Face visor
visor = place_box(HEAD_WIDTH*1.1, 2.0*SCALE, 5.0*SCALE,
                  0, 11.0*SCALE, torso_z + TORSO_HEIGHT + 5.0*SCALE + HEAD_HEIGHT*0.6)

# Top-mounted sensor / eye dome
top_sensor = (cq.Workplane("XY")
              .cylinder(3.0*SCALE, HEAD_WIDTH*0.5)
              .rotate((0,0,0), (1,0,0), 90)
              .translate((0, 7.0*SCALE,
                          torso_z + TORSO_HEIGHT + 5.0*SCALE + HEAD_HEIGHT + 1.5*SCALE)))

# =============================================================================
# 8. RIGHT ARM (CLAW SIDE)
# =============================================================================
right_shoulder_pos = (-TORSO_WIDTH/2.0 - 2.0*SCALE,
                      4.0*SCALE,
                      torso_z + TORSO_HEIGHT - 3.0*SCALE)

right_shoulder = cq.Workplane("XY").sphere(5.5*SCALE).translate(right_shoulder_pos)

# Shoulder armor pad
right_shoulder_pad = place_box(10.0*SCALE, 8.0*SCALE, 5.0*SCALE,
                               right_shoulder_pos[0]-2.0*SCALE,
                               right_shoulder_pos[1],
                               right_shoulder_pos[2]+2.0*SCALE, ry=-10)

# Upper arm reaching forward and down
right_upper_arm = place_box(ARM_THICKNESS, ARM_WIDTH, UPPER_ARM_LEN,
                            0, 0, -UPPER_ARM_LEN/2.0, rx=-35, ry=-25)
right_upper_arm = right_upper_arm.translate(right_shoulder_pos)

# Elbow joint
right_elbow_pos = (-TORSO_WIDTH/2.0 - 8.0*SCALE,
                   14.0*SCALE,
                   right_shoulder_pos[2] - UPPER_ARM_LEN*0.8)
right_elbow = cq.Workplane("XY").sphere(4.0*SCALE).translate(right_elbow_pos)

# Forearm
right_forearm = place_box(ARM_THICKNESS, ARM_WIDTH, FOREARM_LEN,
                          0, 0, -FOREARM_LEN/2.0, rx=-45, ry=-35)
right_forearm = right_forearm.translate(right_elbow_pos)

# Piston / spring details on forearm
right_spring_1 = (cq.Workplane("XY")
                  .cylinder(10.0*SCALE, 1.2*SCALE)
                  .rotate((0,0,0), (1,0,0), -45)
                  .translate((right_elbow_pos[0]-2.0*SCALE,
                              right_elbow_pos[1]+4.0*SCALE,
                              right_elbow_pos[2]-6.0*SCALE)))
right_spring_2 = (cq.Workplane("XY")
                  .cylinder(10.0*SCALE, 1.2*SCALE)
                  .rotate((0,0,0), (1,0,0), -45)
                  .translate((right_elbow_pos[0]+2.0*SCALE,
                              right_elbow_pos[1]+4.0*SCALE,
                              right_elbow_pos[2]-6.0*SCALE)))

# Claw hand
right_hand_pos = (right_elbow_pos[0]-6.0*SCALE,
                  right_elbow_pos[1]+10.0*SCALE,
                  right_elbow_pos[2]-FOREARM_LEN*0.85)
right_hand = cq.Workplane("XY").sphere(3.5*SCALE).translate(right_hand_pos)

# Two large pincers
PINCHER_LEN = 14.0*SCALE
PINCHER_W   = 2.5*SCALE
PINCHER_T   = 2.0*SCALE

right_pincer_1 = place_box(PINCHER_T, PINCHER_W, PINCHER_LEN,
                           0, 0, PINCHER_LEN/2.0, rx=-20, ry=-15)
right_pincer_1 = right_pincer_1.translate(right_hand_pos)

right_pincer_2 = place_box(PINCHER_T, PINCHER_W, PINCHER_LEN,
                           0, 0, PINCHER_LEN/2.0, rx=-20, ry=15)
right_pincer_2 = right_pincer_2.translate(right_hand_pos)

# Central rod between pincers
right_claw_rod = (cq.Workplane("XY")
                  .cylinder(PINCHER_LEN*0.8, 1.0*SCALE)
                  .rotate((0,0,0), (1,0,0), -20)
                  .translate(right_hand_pos))

# =============================================================================
# 9. LEFT ARM (WEAPON SIDE)
# =============================================================================
left_shoulder_pos = (TORSO_WIDTH/2.0 + 2.0*SCALE,
                     0,
                     torso_z + TORSO_HEIGHT - 5.0*SCALE)

left_shoulder = cq.Workplane("XY").sphere(5.5*SCALE).translate(left_shoulder_pos)

left_shoulder_pad = place_box(10.0*SCALE, 8.0*SCALE, 5.0*SCALE,
                              left_shoulder_pos[0]+2.0*SCALE,
                              left_shoulder_pos[1],
                              left_shoulder_pos[2]+2.0*SCALE, ry=10)

left_upper_arm = place_box(ARM_THICKNESS, ARM_WIDTH, UPPER_ARM_LEN,
                           0, 0, -UPPER_ARM_LEN/2.0, rx=25, ry=20)
left_upper_arm = left_upper_arm.translate(left_shoulder_pos)

left_elbow_pos = (TORSO_WIDTH/2.0 + 7.0*SCALE,
                  -6.0*SCALE,
                  left_shoulder_pos[2] - UPPER_ARM_LEN*0.8)
left_elbow = cq.Workplane("XY").sphere(4.0*SCALE).translate(left_elbow_pos)

left_forearm = place_box(ARM_THICKNESS, ARM_WIDTH, FOREARM_LEN,
                         0, 0, -FOREARM_LEN/2.0, rx=35, ry=25)
left_forearm = left_forearm.translate(left_elbow_pos)

# Weapon hand / grip
left_hand_pos = (left_elbow_pos[0]+6.0*SCALE,
                 left_elbow_pos[1]-8.0*SCALE,
                 left_elbow_pos[2]-FOREARM_LEN*0.85)
left_hand = cq.Workplane("XY").sphere(3.5*SCALE).translate(left_hand_pos)

# Weapon housing
left_weapon_housing = place_box(8.0*SCALE, 6.0*SCALE, 10.0*SCALE,
                                0, -3.0*SCALE, 0, rx=35, ry=25)
left_weapon_housing = left_weapon_housing.translate(left_hand_pos)

# Weapon barrel
left_barrel = (cq.Workplane("XY")
               .cylinder(18.0*SCALE, 2.2*SCALE)
               .rotate((0,0,0), (1,0,0), 90)
               .translate((left_hand_pos[0],
                           left_hand_pos[1]-6.0*SCALE,
                           left_hand_pos[2])))

# =============================================================================
# 10. BACK DETAILS
# =============================================================================
# Central spinal column
back_spine = place_box(4.0*SCALE, 4.0*SCALE, TORSO_HEIGHT*0.9,
                       0, -11.0*SCALE, torso_z + TORSO_HEIGHT*0.6)

# Two long antenna / rods protruding upward and backward
antenna_1 = (cq.Workplane("XY")
             .cylinder(26.0*SCALE, 1.2*SCALE)
             .rotate((0,0,0), (1,0,0), -65)
             .translate((-7.0*SCALE, -12.0*SCALE, torso_z + TORSO_HEIGHT)))

antenna_2 = (cq.Workplane("XY")
             .cylinder(22.0*SCALE, 1.2*SCALE)
             .rotate((0,0,0), (1,0,0), -115)
             .translate((7.0*SCALE, -12.0*SCALE, torso_z + TORSO_HEIGHT)))

# Upper back fin
back_fin = place_box(8.0*SCALE, 3.0*SCALE, 12.0*SCALE,
                     0, -11.0*SCALE, torso_z + TORSO_HEIGHT + 4.0*SCALE, rx=-15)

# =============================================================================
# 11. UNION ALL COMPONENTS INTO FINAL RESULT
# =============================================================================
components = [
    right_foot, right_toe, right_heel, right_ankle,
    left_foot, left_toe, left_heel, left_ankle,
    right_lower_leg, left_lower_leg,
    right_knee, left_knee, right_knee_pad, left_knee_pad,
    right_upper_leg, left_upper_leg,
    hips,
    torso_core, chest_armor, back_armor, right_side_detail, left_side_detail,
    neck, head, visor, top_sensor,
    right_shoulder, right_shoulder_pad, right_upper_arm, right_elbow, right_forearm,
    right_spring_1, right_spring_2, right_hand, right_pincer_1, right_pincer_2, right_claw_rod,
    left_shoulder, left_shoulder_pad, left_upper_arm, left_elbow, left_forearm,
    left_hand, left_weapon_housing, left_barrel,
    back_spine, antenna_1, antenna_2, back_fin
]

result = components[0]
for comp in components[1:]:
    result = result.union(comp)