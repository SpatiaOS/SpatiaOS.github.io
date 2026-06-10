import cadquery as cq

# ============================================
# Simplified Bipedal Mech Robot
# Parametric model inspired by the Bionicle-style
# armored mech figure shown in the image
# ============================================

# === PARAMETERS (mm) ===

# Feet - circular base plates with ankle blocks
foot_radius = 18.0
foot_height = 8.0
ankle_w = 20.0
ankle_d = 16.0
ankle_h = 10.0

# Lower leg (shin) with frontal armor plates
shin_w = 14.0
shin_d = 12.0
shin_h = 52.0
armor_w = 22.0
armor_h = 36.0
armor_t = 3.0

# Knee joint
knee_r = 8.5

# Upper leg (thigh)
thigh_w = 15.0
thigh_d = 13.0
thigh_h = 35.0

# Hip / pelvis connecting the legs
hip_w = 44.0
hip_d = 20.0
hip_h = 14.0

# Torso - main body with wider chest section
torso_w = 50.0
torso_d = 28.0
torso_h = 44.0
chest_w = 56.0
chest_h = 18.0

# Shoulder mounting blocks
sh_w = 16.0
sh_h = 12.0
sh_d = 14.0

# Head with visor and crest
head_w = 16.0
head_d = 20.0
head_h = 14.0
neck_r = 6.0
neck_h = 5.0

# Arm segments
arm_t = 9.0
uarm_h = 26.0
farm_l = 30.0
elbow_r = 6.0

# Weapon dimensions
barrel_l = 45.0
barrel_r = 3.5
claw_l = 18.0
claw_w = 3.0

# Stance / pose offsets
leg_x = 25.0    # half-distance between leg centers
ly_off = 6.0    # left leg forward offset for dynamic pose

# === COMPUTED VERTICAL POSITIONS ===
z1 = foot_height + ankle_h              # top of ankle
z2 = z1 + shin_h                        # top of shin / knee
z3 = z2 + thigh_h                       # top of thigh / hip bottom
z4 = z3 + hip_h                         # top of hip / torso bottom
z5 = z4 + torso_h                       # top of torso
z_sh = z5 - 10                          # shoulder center height
cy = ly_off / 2.0                       # torso center Y (between legs)
sx = chest_w / 2.0 + sh_w / 2.0 - 3.0  # shoulder X offset


# === HELPER FUNCTIONS ===
def box_at(x, y, z, w, d, h):
    """Create a box centered in XY at (x,y), base at z, extruded by h."""
    return (cq.Workplane("XY")
            .transformed(offset=(x, y, z))
            .rect(w, d).extrude(h))


def cyl_at(x, y, z, r, h):
    """Create a cylinder centered at (x,y), base at z, extruded by h."""
    return (cq.Workplane("XY")
            .transformed(offset=(x, y, z))
            .circle(r).extrude(h))


def joint_at(x, y, z, r):
    """Create a joint approximation (short cylinder) centered at (x,y,z)."""
    return (cq.Workplane("XY")
            .transformed(offset=(x, y, z - r * 0.7))
            .circle(r).extrude(r * 1.4))


# ============================================
# BUILD THE ROBOT BY CHAINING UNIONS
# ============================================

# --- RIGHT LEG (at +X) ---
# Right foot: circular base plate
result = cyl_at(leg_x, 0, 0, foot_radius, foot_height)

# Right ankle block sitting on top of foot
result = result.union(box_at(leg_x, 0, foot_height, ankle_w, ankle_d, ankle_h))

# Right ankle joint
result = result.union(joint_at(leg_x, 0, z1, 6.0))

# Right shin (lower leg) structural member
result = result.union(box_at(leg_x, 0, z1, shin_w, shin_d, shin_h))

# Right front armor plate on shin
result = result.union(box_at(leg_x, -shin_d / 2 - armor_t / 2, z1 + 8,
                              armor_w, armor_t, armor_h))

# Right knee joint
result = result.union(joint_at(leg_x, 0, z2, knee_r))

# Right thigh (upper leg)
result = result.union(box_at(leg_x, 0, z2, thigh_w, thigh_d, thigh_h))

# Right hip joint
result = result.union(joint_at(leg_x, 0, z3, 7.0))

# --- LEFT LEG (at -X, shifted forward in Y for dynamic pose) ---
# Left foot
result = result.union(cyl_at(-leg_x, ly_off, 0, foot_radius, foot_height))

# Left ankle block
result = result.union(box_at(-leg_x, ly_off, foot_height, ankle_w, ankle_d, ankle_h))

# Left ankle joint
result = result.union(joint_at(-leg_x, ly_off, z1, 6.0))

# Left shin
result = result.union(box_at(-leg_x, ly_off, z1, shin_w, shin_d, shin_h))

# Left front armor plate
result = result.union(box_at(-leg_x, ly_off - shin_d / 2 - armor_t / 2, z1 + 8,
                              armor_w, armor_t, armor_h))

# Left knee joint
result = result.union(joint_at(-leg_x, ly_off, z2, knee_r))

# Left thigh
result = result.union(box_at(-leg_x, ly_off, z2, thigh_w, thigh_d, thigh_h))

# Left hip joint
result = result.union(joint_at(-leg_x, ly_off, z3, 7.0))

# --- HIP / PELVIS ---
result = result.union(box_at(0, cy, z3, hip_w, hip_d, hip_h))

# --- TORSO ---
# Lower torso section
result = result.union(box_at(0, cy, z4, torso_w, torso_d, torso_h))

# Upper chest plate (wider for shoulder area)
result = result.union(box_at(0, cy, z5 - chest_h, chest_w, torso_d + 4, chest_h))

# Torso center detail (reactor/vent)
result = result.union(cyl_at(0, cy - torso_d / 2, z4 + torso_h / 2 - 5, 5.0, 3.0))

# --- SHOULDER BLOCKS ---
result = result.union(box_at(sx, cy, z_sh - sh_h / 2, sh_w, sh_d, sh_h))
result = result.union(box_at(-sx, cy, z_sh - sh_h / 2, sh_w, sh_d, sh_h))

# Shoulder joint spheres
result = result.union(joint_at(sx + sh_w / 2, cy, z_sh, 7.0))
result = result.union(joint_at(-sx - sh_w / 2, cy, z_sh, 7.0))

# --- NECK ---
result = result.union(cyl_at(0, cy - 1, z5, neck_r, neck_h))

# --- HEAD ---
hb = z5 + neck_h  # head base height

# Main head block
result = result.union(box_at(0, cy - 2, hb, head_w, head_d, head_h))

# Visor / face plate protruding forward
result = result.union(box_at(0, cy - 2 - head_d / 2 - 2, hb + 3,
                              head_w - 4, 4, 8))

# Top crest / fin
result = result.union(box_at(0, cy - 5, hb + head_h, 4, 10, 6))

# --- RIGHT ARM (claw weapon arm, extending right then forward) ---
ra_x = sx + sh_w / 2 + 2     # right arm X position
re_z = z_sh - uarm_h          # elbow Z height

# Upper arm (vertical, hanging down from shoulder)
result = result.union(box_at(ra_x, cy, re_z, arm_t, arm_t, uarm_h))

# Elbow joint
result = result.union(joint_at(ra_x, cy, re_z, elbow_r))

# Forearm (horizontal, extending forward-right)
result = result.union(box_at(ra_x + farm_l / 2, cy - 8, re_z - arm_t / 2,
                              farm_l, arm_t, arm_t))

# Three-pronged claw at end of right forearm
fcx = ra_x + farm_l           # claw base X
fcy = cy - 8                  # claw Y position

# Top claw finger
result = result.union(box_at(fcx + claw_l / 2, fcy, re_z + 3,
                              claw_l, claw_w, claw_w))

# Bottom claw finger
result = result.union(box_at(fcx + claw_l / 2, fcy, re_z - 3 - claw_w,
                              claw_l, claw_w, claw_w))

# Middle claw finger (offset in Y)
result = result.union(box_at(fcx + claw_l / 2, fcy - 3, re_z - claw_w / 2,
                              claw_l, claw_w, claw_w))

# --- LEFT ARM (cannon weapon arm) ---
la_x = -(sx + sh_w / 2 + 2)  # left arm X position

# Upper arm (vertical)
result = result.union(box_at(la_x, cy, re_z, arm_t, arm_t, uarm_h))

# Elbow joint
result = result.union(joint_at(la_x, cy, re_z, elbow_r))

# Forearm (vertical, extending upward with weapon mount)
result = result.union(box_at(la_x - 2, cy - 4, re_z + 2,
                              arm_t + 2, arm_t + 2, farm_l))

# Cannon barrel extending upward from forearm
result = result.union(cyl_at(la_x - 2, cy - 4, re_z + 2 + farm_l,
                              barrel_r, barrel_l))

# --- BACK-MOUNTED WEAPONS (angled barrels on upper back) ---
bw_y = cy + torso_d / 2       # back surface Y position

# Primary back cannon (angled upward-backward)
result = result.union(
    cq.Workplane("XY")
    .transformed(offset=(-6, bw_y, z5 - 8), rotate=(55, 0, 0))
    .circle(barrel_r + 1.0).extrude(barrel_l * 0.75)
)

# Secondary back cannon
result = result.union(
    cq.Workplane("XY")
    .transformed(offset=(-15, bw_y - 2, z5 - 12), rotate=(50, 0, 0))
    .circle(barrel_r).extrude(barrel_l * 0.6)
)