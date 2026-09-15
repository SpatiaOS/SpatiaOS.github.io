import cadquery as cq
import math

# =====================================================================
#  Articulated industrial robot arm — parametric model
#
#  Interpretation of the image (bottom to top):
#    1. Heavy irregular base plate (corner notches, pocket, holes, side tab)
#    2. Cylindrical rotating turret carrying a horizontal hex-head shaft
#    3. Big shoulder joint cylinder + rear motor + side counterweight boss
#    4. Tapered lower arm with a large round bearing disc on its flank
#       and a thin parallel linkage strut running up to the elbow
#    5. Elbow joint cylinder
#    6. Long stepped cylindrical forearm with strengthening ribs
#    7. Wrist flange/tube and an angled end-effector with rounded tip
# =====================================================================

# ---------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------
# --- base plate ---
plate_len      = 460.0     # overall X size
plate_wid      = 360.0     # overall Y size
plate_thk      = 40.0      # plate thickness
corner_hole_d  = 18.0      # mounting hole diameter
tab_hole_d     = 10.0      # small tab hole diameter
pocket_len     = 110.0     # rectangular deck pocket
pocket_wid     = 60.0
pocket_depth   = 14.0

# --- rotating turret ---
turret_r_bot   = 115.0     # bottom flange radius
turret_h_bot   = 22.0      # bottom flange height
turret_r_top   = 90.0      # main turret radius
turret_h_top   = 48.0      # main turret height
turret_hub_r   = 32.0      # top hub radius
turret_hub_h   = 12.0      # top hub height

# --- horizontal crank shaft with hex head ---
shaft_r        = 20.0
shaft_len      = 95.0
hex_d          = 34.0      # hex head diameter (across corners)
hex_len        = 26.0
crank_nub_d    = 12.0
crank_nub_len  = 8.0

# --- shoulder joint ---
shoulder_r     = 95.0
shoulder_len   = 175.0     # along Y axis
shoulder_z     = 180.0     # axis height above ground
stub_r         = 45.0      # end stubs of shoulder axle
stub_len       = 18.0
motor_r        = 42.0      # rear shoulder motor
motor_len      = 40.0
cw_r           = 30.0      # counterweight boss (behind arm)
cw_len         = 115.0

# --- lower arm (shoulder -> elbow) ---
lower_arm_len  = 235.0
lower_arm_ang  = 62.0      # degrees above horizontal
lower_arm_w    = 95.0      # width across Y at shoulder
lower_arm_t0   = 85.0      # thickness at shoulder
lower_arm_t1   = 62.0      # thickness at elbow
disc_r         = 72.0      # large bearing disc on arm flank
disc_t         = 30.0
disc_frac      = 0.35      # disc position (fraction along arm)

# --- parallel linkage strut (base -> elbow) ---
strut_r        = 15.0
strut_len      = 300.0
strut_y        = 75.0      # lateral offset from arm centre

# --- elbow joint ---
elbow_r        = 62.0
elbow_len      = 145.0     # along Y axis

# --- forearm (elbow -> wrist) ---
forearm_len    = 300.0
forearm_ang    = 12.0      # degrees below horizontal
fa_root_r      = 40.0      # thick root section radius
fa_root_len    = 70.0
fa_r           = 28.0      # main tube radius
rib_r          = 35.0      # reinforcing rib radius
rib_t          = 9.0       # rib thickness

# --- wrist & end effector ---
wr_flange_r    = 35.0
wr_flange_t    = 16.0
wr_r           = 21.0
wr_len         = 60.0
eff_r          = 17.0
eff_len        = 32.0
tool_r         = 9.0
tool_len       = 20.0
tool_kink      = 28.0      # extra downward angle of the tool tip (deg)

# ---------------------------------------------------------------------
# Derived key points (kinematic skeleton)
# ---------------------------------------------------------------------
la_a  = math.radians(lower_arm_ang)
la_ux, la_uz = math.cos(la_a), math.sin(la_a)            # lower-arm unit dir
elbow_pt = (la_ux * lower_arm_len, 0.0,
            shoulder_z + la_uz * lower_arm_len)          # elbow centre

fa_a  = math.radians(forearm_ang)
fa_ux, fa_uz = -math.cos(fa_a), -math.sin(fa_a)          # forearm unit dir

# ---------------------------------------------------------------------
# 1. Base plate — irregular outline with notches, pocket and holes
# ---------------------------------------------------------------------
plate = (
    cq.Workplane("XY")
    .box(plate_len, plate_wid, plate_thk, centered=(True, True, False))
)

# notched front-left corner
plate = plate.cut(
    cq.Workplane("XY")
    .box(110.0, 80.0, plate_thk * 3, centered=(True, True, False))
    .translate((-plate_len / 2 + 55.0, -plate_wid / 2 + 40.0, -plate_thk))
)

# stepped notch along the front edge
plate = plate.cut(
    cq.Workplane("XY")
    .box(120.0, 45.0, plate_thk * 3, centered=(True, True, False))
    .translate((-plate_len / 2 + 175.0, -plate_wid / 2 + 22.5, -plate_thk))
)

# stepped notch on the right (rear) edge
plate = plate.cut(
    cq.Workplane("XY")
    .box(45.0, 90.0, plate_thk * 3, centered=(True, True, False))
    .translate((plate_len / 2 - 22.5, plate_wid / 2 - 45.0, -plate_thk))
)

# mounting tab on the right flank
tab_cx, tab_cy = plate_len / 2 + 30.0, plate_wid / 2 - 90.0
plate = plate.union(
    cq.Workplane("XY")
    .box(60.0, 110.0, plate_thk, centered=(True, True, False))
    .translate((tab_cx, tab_cy, 0.0))
)

# rectangular pocket in the front deck (explicit cutting box, open to the top)
pocket_tool = (
    cq.Workplane("XY")
    .box(pocket_len, pocket_wid, pocket_depth + 20.0, centered=(True, True, False))
    .translate((-40.0, -plate_wid / 2 + 95.0, plate_thk - pocket_depth))
)
plate = plate.cut(pocket_tool)

# corner mounting holes
for hx, hy in [(160.0, 95.0), (160.0, -95.0), (-160.0, 95.0)]:
    plate = plate.cut(
        cq.Workplane("XY", origin=(hx, hy, -10.0))
        .circle(corner_hole_d / 2)
        .extrude(plate_thk + 20.0)
    )

# tab mounting holes
for hy in (tab_cy + 15.0, tab_cy - 15.0):
    plate = plate.cut(
        cq.Workplane("XY", origin=(tab_cx, hy, -10.0))
        .circle(tab_hole_d / 2)
        .extrude(plate_thk + 20.0)
    )

# ---------------------------------------------------------------------
# 2. Rotating turret (stepped cylinders on the plate)
# ---------------------------------------------------------------------
turret = (
    cq.Workplane("XY", origin=(0.0, 0.0, plate_thk))
    .circle(turret_r_bot)
    .extrude(turret_h_bot)
    .faces(">Z")
    .workplane()
    .circle(turret_r_top)
    .extrude(turret_h_top)
    .faces(">Z")
    .workplane()
    .circle(turret_hub_r)
    .extrude(turret_hub_h)
)

# ---------------------------------------------------------------------
# 3. Horizontal crank shaft with hex head (turret drive shaft)
# ---------------------------------------------------------------------
shaft_z = plate_thk + turret_h_bot + 25.0
crank = (
    cq.Workplane(
        cq.Plane(origin=(turret_r_top - 30.0, 0.0, shaft_z),
                 xDir=(0.0, 1.0, 0.0), normal=(1.0, 0.0, 0.0))
    )
    .circle(shaft_r)
    .extrude(shaft_len)
)

hex_head = (
    cq.Workplane(
        cq.Plane(origin=(turret_r_top - 30.0 + shaft_len, 0.0, shaft_z),
                 xDir=(0.0, 1.0, 0.0), normal=(1.0, 0.0, 0.0))
    )
    .polygon(6, hex_d)
    .extrude(hex_len)
    .faces(">X")
    .workplane()
    .circle(crank_nub_d / 2)
    .extrude(crank_nub_len)
)

# ---------------------------------------------------------------------
# 4. Shoulder joint, rear motor and counterweight boss
# ---------------------------------------------------------------------
shoulder = (
    cq.Workplane(
        cq.Plane(origin=(0.0, -shoulder_len / 2, shoulder_z),
                 xDir=(1.0, 0.0, 0.0), normal=(0.0, 1.0, 0.0))
    )
    .circle(shoulder_r)
    .extrude(shoulder_len)
)

# axle stubs on both sides of the shoulder
for sgn in (1.0, -1.0):
    shoulder = shoulder.union(
        cq.Workplane(
            cq.Plane(origin=(0.0, sgn * shoulder_len / 2, shoulder_z),
                     xDir=(1.0, 0.0, 0.0), normal=(0.0, sgn, 0.0))
        )
        .circle(stub_r)
        .extrude(stub_len)
    )

# rear shoulder motor
motor = (
    cq.Workplane(
        cq.Plane(origin=(0.0, -(shoulder_len / 2 + stub_len), shoulder_z),
                 xDir=(1.0, 0.0, 0.0), normal=(0.0, -1.0, 0.0))
    )
    .circle(motor_r)
    .extrude(motor_len)
)

# counterweight boss emerging sideways behind the arm
counterweight = (
    cq.Workplane(
        cq.Plane(origin=(0.0, -lower_arm_w / 2 - 20.0, shoulder_z),
                 xDir=(0.0, 1.0, 0.0), normal=(la_ux, 0.0, la_uz))
    )
    .circle(cw_r)
    .extrude(cw_len)
)

# ---------------------------------------------------------------------
# 5. Lower arm (tapered loft) with large bearing disc on its flank
# ---------------------------------------------------------------------
lower_arm = (
    cq.Workplane(
        cq.Plane(origin=(0.0, 0.0, shoulder_z),
                 xDir=(0.0, 1.0, 0.0), normal=(la_ux, 0.0, la_uz))
    )
    .rect(lower_arm_w, lower_arm_t0)
    .workplane(offset=lower_arm_len)
    .rect(lower_arm_w * 0.7, lower_arm_t1)
    .loft(ruled=True)
)

disc_cx = la_ux * lower_arm_len * disc_frac
disc_cz = shoulder_z + la_uz * lower_arm_len * disc_frac
disc = (
    cq.Workplane(
        cq.Plane(origin=(disc_cx, lower_arm_w / 2 - 17.0, disc_cz),
                 xDir=(1.0, 0.0, 0.0), normal=(0.0, 1.0, 0.0))
    )
    .circle(disc_r)
    .extrude(disc_t)
)

# ---------------------------------------------------------------------
# 5b. Thin parallel linkage strut running from the shoulder housing
#     up to the elbow (offset laterally, like the linkage in the image)
# ---------------------------------------------------------------------
strut_origin = (
    elbow_pt[0] - la_ux * strut_len,
    strut_y,
    elbow_pt[2] - la_uz * strut_len,
)
strut = (
    cq.Workplane(
        cq.Plane(origin=strut_origin,
                 xDir=(0.0, 1.0, 0.0), normal=(la_ux, 0.0, la_uz))
    )
    .circle(strut_r)
    .extrude(strut_len)
)

# ---------------------------------------------------------------------
# 6. Elbow joint
# ---------------------------------------------------------------------
elbow = (
    cq.Workplane(
        cq.Plane(origin=(elbow_pt[0], -elbow_len / 2, elbow_pt[2]),
                 xDir=(1.0, 0.0, 0.0), normal=(0.0, 1.0, 0.0))
    )
    .circle(elbow_r)
    .extrude(elbow_len)
)

# ---------------------------------------------------------------------
# 7. Forearm — stepped tube with reinforcing ribs near the wrist
# ---------------------------------------------------------------------
fa_plane = cq.Plane(origin=elbow_pt, xDir=(0.0, 1.0, 0.0),
                    normal=(fa_ux, 0.0, fa_uz))

forearm = cq.Workplane(fa_plane).circle(fa_root_r).extrude(fa_root_len)

# main thinner tube overlapping the root section
forearm = forearm.union(
    cq.Workplane(fa_plane)
    .workplane(offset=fa_root_len - 8.0)
    .circle(fa_r)
    .extrude(forearm_len - fa_root_len + 8.0)
)

# ribs
for off in (forearm_len - 70.0, forearm_len - 45.0):
    forearm = forearm.union(
        cq.Workplane(fa_plane)
        .workplane(offset=off)
        .circle(rib_r)
        .extrude(rib_t)
    )

# ---------------------------------------------------------------------
# 8. Wrist assembly (placed at the END of the forearm) and the angled
#    end-effector with rounded tip
# ---------------------------------------------------------------------
# wrist flange collar overlapping the end of the forearm tube
wrist = (
    cq.Workplane(fa_plane)
    .workplane(offset=forearm_len - wr_flange_t)
    .circle(wr_flange_r)
    .extrude(wr_flange_t + 4.0)
    .union(
        cq.Workplane(fa_plane)
        .workplane(offset=forearm_len + 4.0)
        .circle(wr_r)
        .extrude(wr_len)
    )
)

# end-effector cylinder after the wrist tube
eff = (
    cq.Workplane(fa_plane)
    .workplane(offset=forearm_len + 4.0 + wr_len)
    .circle(eff_r)
    .extrude(eff_len)
)

# tool tip, kinked further downward like the gripper in the image
tool_start = forearm_len + 4.0 + wr_len + eff_len
tip_x = elbow_pt[0] + fa_ux * tool_start
tip_z = elbow_pt[2] + fa_uz * tool_start
tk_a  = math.radians(forearm_ang + tool_kink)
tk_ux, tk_uz = -math.cos(tk_a), -math.sin(tk_a)

tool = (
    cq.Workplane(
        cq.Plane(origin=(tip_x, 0.0, tip_z),
                 xDir=(0.0, 1.0, 0.0), normal=(tk_ux, 0.0, tk_uz))
    )
    .circle(tool_r)
    .extrude(tool_len)
)

# rounded tip ball
tip_ball_pos = (tip_x + tk_ux * tool_len, 0.0, tip_z + tk_uz * tool_len)
tip_ball = cq.Workplane("XY").sphere(tool_r * 1.4).translate(tip_ball_pos)
tool = tool.union(tip_ball)

# ---------------------------------------------------------------------
# Final assembly
# ---------------------------------------------------------------------
result = (
    plate
    .union(turret)
    .union(crank)
    .union(hex_head)
    .union(shoulder)
    .union(motor)
    .union(counterweight)
    .union(lower_arm)
    .union(disc)
    .union(strut)
    .union(elbow)
    .union(forearm)
    .union(wrist)
    .union(eff)
    .union(tool)
)