import cadquery as cq
import math

# ============================================================
# ABB-Style Industrial Robot Arm Assembly
# Approximate bounding box: 830 x 403 x 732 mm
# ============================================================

# --- Arm pose angles ---
ARM_ANGLE = 60.0        # upper arm: degrees above horizontal
FOREARM_ANGLE = 8.0     # forearm: degrees above horizontal

# --- Base housing cap (~390 dia x 104 tall) ---
BASE_R = 155.0          # outer radius
BASE_STEP_R = 130.0     # inner step radius
BASE_H_LOWER = 58.0     # lower portion
BASE_H_UPPER = 28.0     # upper step
BOSS_R = 15.0           # central locating boss
BOSS_H = 18.0
NUM_LUGS = 6            # peripheral mounting lugs

# --- Turntable / lever arm ---
TT_R_LOWER = 125.0;  TT_H_LOWER = 32.0
TT_R_UPPER = 90.0;   TT_H_UPPER = 30.0

# --- Shoulder hub ---
SH_R = 65.0;  SH_H = 80.0

# --- Upper arm (connecting arm ~442 mm) ---
UA_LEN = 440.0;   UA_R = 40.0
UA_HUB_R = 55.0;  UA_HUB_H = 30.0

# --- Elbow joint housing ---
ELB_R = 52.0

# --- Forearm (multi-bore housing ~173 mm) ---
FA_LEN = 200.0;  FA_R = 38.0

# --- Wrist (scroll housing) ---
WR_R = 30.0;  WR_LEN = 55.0

# --- Gripper ---
GR_R = 22.0;       GR_H = 28.0
JAW_LEN = 80.0;    JAW_W = 38.0;    JAW_T = 12.0
JAW_SPREAD = 22.0  # half-distance between jaws
JAW_SPLAY = 12.0   # opening angle per jaw (degrees)

# --- Spacer rings (12x) ---
SPACER_OR = 3.0;  SPACER_IR = 1.6;  SPACER_H = 3.0
SPACER_RING_R = 108.0

# ============================================================
# Derived joint positions
# ============================================================
a_r = math.radians(ARM_ANGLE)
f_r = math.radians(FOREARM_ANGLE)

z_base_top = BASE_H_LOWER + BASE_H_UPPER
z_tt_top = z_base_top + TT_H_LOWER + TT_H_UPPER
z_sh_top = z_tt_top + SH_H  # shoulder pivot height

p_shoulder = (0.0, 0.0, z_sh_top)
p_elbow = (UA_LEN * math.cos(a_r), 0.0, z_sh_top + UA_LEN * math.sin(a_r))
p_wrist = (p_elbow[0] + FA_LEN * math.cos(f_r), 0.0,
           p_elbow[2] + FA_LEN * math.sin(f_r))
p_grip = (p_wrist[0] + WR_LEN * math.cos(f_r), 0.0,
          p_wrist[2] + WR_LEN * math.sin(f_r))
p_jaw = (p_grip[0] + GR_H * math.cos(f_r), 0.0,
         p_grip[2] + GR_H * math.sin(f_r))


def oriented_cyl(radius, length, angle_deg, origin):
    """Create cylinder oriented at angle_deg above horizontal, base at origin."""
    c = cq.Workplane("XY").circle(radius).extrude(length)
    c = c.rotate((0, 0, 0), (0, 1, 0), 90.0 - angle_deg)
    return c.translate(origin)


# ============================================================
# 1. BASE HOUSING CAP - stepped cylinder with mounting lugs
# ============================================================
base = (
    cq.Workplane("XY")
    .circle(BASE_R).extrude(BASE_H_LOWER)
    .faces(">Z").workplane()
    .circle(BASE_STEP_R).extrude(BASE_H_UPPER)
    .faces(">Z").workplane()
    .circle(BOSS_R).extrude(BOSS_H)
)

for i in range(NUM_LUGS):
    ang = math.radians(i * 60.0)
    lx = (BASE_R + 5) * math.cos(ang)
    ly = (BASE_R + 5) * math.sin(ang)
    h_lug = BASE_H_LOWER * 0.75
    lug = (
        cq.Workplane("XY")
        .box(34.0, 22.0, h_lug)
        .translate((lx, ly, h_lug / 2.0))
    )
    base = base.union(lug)

# ============================================================
# 2. TURNTABLE - stacked rings with decorative rim
# ============================================================
turntable = (
    cq.Workplane("XY").workplane(offset=z_base_top)
    .circle(TT_R_LOWER).extrude(TT_H_LOWER)
)
turntable = turntable.union(
    cq.Workplane("XY").workplane(offset=z_base_top + TT_H_LOWER)
    .circle(TT_R_UPPER).extrude(TT_H_UPPER)
)
# Decorative rim ring at turntable transition
turntable = turntable.union(
    cq.Workplane("XY").workplane(offset=z_base_top + TT_H_LOWER - 4)
    .circle(TT_R_LOWER + 4).circle(TT_R_LOWER - 4).extrude(8)
)

# ============================================================
# 3. SPACER RINGS (12x bearing elements on turntable)
# ============================================================
sp_z = z_base_top + TT_H_LOWER + 2.0
spacers = None
for i in range(12):
    ang = math.radians(i * 30.0)
    sx = SPACER_RING_R * math.cos(ang)
    sy = SPACER_RING_R * math.sin(ang)
    sp = (
        cq.Workplane("XY").workplane(offset=sp_z)
        .transformed(offset=(sx, sy, 0))
        .circle(SPACER_OR).circle(SPACER_IR).extrude(SPACER_H)
    )
    spacers = sp if spacers is None else spacers.union(sp)

# ============================================================
# 4. SHOULDER HUB with bearing ring detail
# ============================================================
shoulder = (
    cq.Workplane("XY").workplane(offset=z_tt_top)
    .circle(SH_R).extrude(SH_H)
)
# Bearing ring at shoulder-arm interface
shoulder = shoulder.union(
    cq.Workplane("XY").workplane(offset=z_sh_top - 6)
    .circle(SH_R + 4).circle(SH_R - 4).extrude(12)
)

# ============================================================
# 5. UPPER ARM (~442 mm) with flange hubs at each end
# ============================================================
upper_arm = oriented_cyl(UA_R, UA_LEN, ARM_ANGLE, p_shoulder)

# Bottom flange hub (shoulder end)
upper_arm = upper_arm.union(
    oriented_cyl(UA_HUB_R, UA_HUB_H, ARM_ANGLE, p_shoulder)
)
# Top flange hub (elbow end)
top_hub_orig = (
    (UA_LEN - UA_HUB_H) * math.cos(a_r),
    0.0,
    z_sh_top + (UA_LEN - UA_HUB_H) * math.sin(a_r)
)
upper_arm = upper_arm.union(
    oriented_cyl(UA_HUB_R, UA_HUB_H, ARM_ANGLE, top_hub_orig)
)

# ============================================================
# 6. ELBOW JOINT HOUSING - cylinder + L-shaped transition
# ============================================================
elbow_joint = (
    cq.Workplane("XY")
    .workplane(offset=p_elbow[2] - ELB_R)
    .transformed(offset=(p_elbow[0], 0, 0))
    .circle(ELB_R).extrude(ELB_R * 2)
)
# L-shaped transition block toward forearm
elbow_block = (
    cq.Workplane("XY")
    .box(90.0, 75.0, 65.0)
    .translate((p_elbow[0] + 25, 0, p_elbow[2]))
)
elbow = elbow_joint.union(elbow_block)

# ============================================================
# 7. FOREARM with hub flanges at each end
# ============================================================
forearm = oriented_cyl(FA_R, FA_LEN, FOREARM_ANGLE, p_elbow)

# Entry hub flange
forearm = forearm.union(
    oriented_cyl(FA_R + 8, 24, FOREARM_ANGLE, p_elbow)
)
# Exit hub flange
fa_end_orig = (
    p_elbow[0] + (FA_LEN - 24) * math.cos(f_r),
    0.0,
    p_elbow[2] + (FA_LEN - 24) * math.sin(f_r)
)
forearm = forearm.union(
    oriented_cyl(FA_R + 8, 24, FOREARM_ANGLE, fa_end_orig)
)

# ============================================================
# 8. WRIST (scroll housing) with entry rim flange
# ============================================================
wrist = oriented_cyl(WR_R, WR_LEN, FOREARM_ANGLE, p_wrist)
wrist = wrist.union(
    oriented_cyl(WR_R + 6, 10, FOREARM_ANGLE, p_wrist)
)

# ============================================================
# 9. GRIPPER - mount cylinder + two splayed jaws
# ============================================================
grip_mount = oriented_cyl(GR_R, GR_H, FOREARM_ANGLE, p_grip)


def make_jaw(y_offset):
    """Build a gripper jaw with outward splay for open configuration."""
    jaw = (
        cq.Workplane("XY")
        .box(JAW_T, JAW_W, JAW_LEN)
        .translate((0, 0, JAW_LEN / 2.0))  # base at origin, extends along +Z
    )
    # Splay outward for open-gripper V-shape
    sign = 1.0 if y_offset > 0 else -1.0
    jaw = jaw.rotate((0, 0, 0), (1, 0, 0), sign * JAW_SPLAY)
    # Orient along forearm direction
    jaw = jaw.rotate((0, 0, 0), (0, 1, 0), 90.0 - FOREARM_ANGLE)
    # Position at jaw base with lateral offset
    jaw = jaw.translate((p_jaw[0], p_jaw[1] + y_offset, p_jaw[2]))
    return jaw


jaw_1 = make_jaw(JAW_SPREAD)
jaw_2 = make_jaw(-JAW_SPREAD)

# ============================================================
# FINAL ASSEMBLY - union all components
# ============================================================
result = base
for part in [turntable, spacers, shoulder, upper_arm, elbow,
             forearm, wrist, grip_mount, jaw_1, jaw_2]:
    result = result.union(part)