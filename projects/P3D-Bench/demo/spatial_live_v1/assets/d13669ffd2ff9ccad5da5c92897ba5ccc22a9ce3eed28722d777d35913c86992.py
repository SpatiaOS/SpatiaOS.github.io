import cadquery as cq
import math

# =====================================================================
#  Hand-cranked gear winch
# ---------------------------------------------------------------------
#  Interpretation of the image:
#   * a large wheel with INTERNAL ring-gear teeth, joined to its hub by
#     spokes, turning on a horizontal axle
#   * a smaller coaxial pinion gear sitting inside the wheel
#   * a triangular gusset plate standing on a rectangular base with
#     corner feet, supporting the axle near its apex (rounded boss)
#   * the axle protrudes forward and carries a crank hub with two crank
#     arms (one long, one short), each ending in a cylindrical grip
#     parallel to the axle, plus an end cap with a cotter-pin hole
# =====================================================================

# ----------------------------- parameters ----------------------------
# Large wheel (internal ring gear)
wheel_outer_R   = 105.0    # outer radius of the big wheel
rim_radial_thk  = 16.0     # radial thickness of the rim
rim_width       = 26.0     # axial width of the rim
n_int_teeth     = 60       # number of internal teeth
int_tooth_depth = 7.0      # radial depth of internal teeth
hub_R           = 24.0     # hub radius
hub_width       = 46.0     # hub axial width
n_spokes        = 4        # spokes joining hub to rim
spoke_w_tan     = 12.0     # spoke width (tangential)
spoke_t_axial   = 10.0     # spoke thickness (axial)

# Coaxial pinion gear
pinion_root_R   = 50.0     # pinion root radius
pinion_addendum = 7.0      # pinion tooth height
n_pin_teeth     = 24       # pinion tooth count
pinion_width    = 12.0     # pinion axial width

# Axle
axle_R          = 9.0
axle_back_x     = -26.0    # rear end of axle (inside hub)
axle_front_x    = 122.0    # front end of axle (crank side)
axle_z          = 140.0    # height of the axle axis

# Support frame
gusset_x        = 45.0     # x position of the triangular plate
gusset_t        = 12.0     # plate thickness
gusset_half_w   = 60.0     # half width of the plate base
apex_boss_R     = 22.0     # rounded boss around the axle at the apex
base_cx         = 5.0      # base plate centre x
base_len        = 160.0    # base plate length (x)
base_w          = 128.0    # base plate width (y)
base_t          = 8.0      # base plate thickness
base_bottom_z   = 8.0      # underside of base plate
foot_x_size     = 24.0
foot_y_size     = 20.0
foot_h          = 12.0
foot_xs         = (-62.0, 72.0)
foot_ys         = (-48.0, 48.0)

# Crank mechanism
crank_x         = 117.0    # centre x of the crank disc
crank_R         = 17.0     # crank disc radius
crank_t         = 10.0     # crank disc thickness
arm_len_long    = 235.0    # long crank arm
arm_dir_long    = (0.0, -0.5, 0.866)      # up and to the left
arm_len_short   = 165.0    # short crank arm
arm_dir_short   = (0.0, -0.147, 0.985)    # nearly straight up
arm_thk         = 10.0     # arm thickness (in wheel plane)
arm_axial_w     = 12.0     # arm width (along axle)
grip_R          = 7.0      # handle grip radius
grip_len        = 46.0     # handle grip length
grip_offset_x   = 12.0     # grip offset from crank centre

# ----------------------------- helpers -------------------------------
def polar(r, a):
    """Point on a circle of radius r at angle a."""
    return (r * math.cos(a), r * math.sin(a))


def external_gear_points(r_root, r_tip, n_teeth):
    """2-D trapezoidal-tooth profile of an external spur gear."""
    pts, step = [], 2.0 * math.pi / n_teeth
    for i in range(n_teeth):
        a = i * step
        pts.append(polar(r_root, a))
        pts.append(polar(r_tip, a + 0.25 * step))
        pts.append(polar(r_tip, a + 0.45 * step))
        pts.append(polar(r_root, a + 0.70 * step))
    return pts


def internal_ring_bore_points(r_body, tooth_depth, n_teeth):
    """Bore profile of an internal ring gear (teeth point inward)."""
    pts, step = [], 2.0 * math.pi / n_teeth
    r_tip = r_body - tooth_depth
    for i in range(n_teeth):
        a = i * step
        pts.append(polar(r_body, a))
        pts.append(polar(r_tip, a + 0.25 * step))
        pts.append(polar(r_tip, a + 0.45 * step))
        pts.append(polar(r_body, a + 0.70 * step))
    return pts


# ------------------------- 1. large wheel ----------------------------
rim_body_R = wheel_outer_R - rim_radial_thk

# rim ring
rim = (
    cq.Workplane("YZ", origin=(0, 0, axle_z))
    .circle(wheel_outer_R)
    .extrude(rim_width)
    .translate((-rim_width / 2.0, 0, 0))
)

# cut the internal gear teeth into the bore of the rim
teeth_cutter = (
    cq.Workplane("YZ", origin=(0, 0, axle_z))
    .polyline(internal_ring_bore_points(rim_body_R, int_tooth_depth, n_int_teeth))
    .close()
    .extrude(rim_width + 4.0)
    .translate((-(rim_width / 2.0 + 2.0), 0, 0))
)
wheel = rim.cut(teeth_cutter)

# spokes from hub to rim
for i in range(n_spokes):
    ang = math.pi / 4.0 + i * 2.0 * math.pi / n_spokes
    dy, dz = math.cos(ang), math.sin(ang)
    r_mid = 0.5 * (hub_R + rim_body_R)
    spoke = (
        cq.Workplane(
            cq.Plane(origin=(0, 0, axle_z), xDir=(0, dy, dz), normal=(1, 0, 0))
        )
        .box(rim_body_R - hub_R, spoke_w_tan, spoke_t_axial)
        .translate((0, dy * r_mid, dz * r_mid))
    )
    wheel = wheel.union(spoke)

# central hub
hub = (
    cq.Workplane("YZ", origin=(0, 0, axle_z))
    .circle(hub_R)
    .extrude(hub_width)
    .translate((-hub_width / 2.0, 0, 0))
)
wheel = wheel.union(hub)

# smaller coaxial pinion gear inside the wheel
pinion = (
    cq.Workplane("YZ", origin=(0, 0, axle_z))
    .polyline(
        external_gear_points(pinion_root_R, pinion_root_R + pinion_addendum, n_pin_teeth)
    )
    .close()
    .extrude(pinion_width)
    .translate((-pinion_width / 2.0, 0, 0))
)
wheel = wheel.union(pinion)

# ------------------------- 2. support frame --------------------------
# rectangular base plate
frame = (
    cq.Workplane("XY", origin=(base_cx, 0, base_bottom_z + base_t / 2.0))
    .box(base_len, base_w, base_t)
)

# corner feet pads
for fx in foot_xs:
    for fy in foot_ys:
        foot = (
            cq.Workplane("XY", origin=(fx, fy, foot_h / 2.0))
            .box(foot_x_size, foot_y_size, foot_h)
        )
        frame = frame.union(foot)

# triangular gusset plate rising from the base
gusset = (
    cq.Workplane("YZ", origin=(gusset_x - gusset_t / 2.0, 0, 0))
    .polyline(
        [
            (-gusset_half_w, base_bottom_z),
            (gusset_half_w, base_bottom_z),
            (0.0, axle_z),
        ]
    )
    .close()
    .extrude(gusset_t)
)
frame = frame.union(gusset)

# rounded boss at the apex that carries the axle
apex_boss = (
    cq.Workplane("YZ", origin=(gusset_x - gusset_t / 2.0, 0, axle_z))
    .circle(apex_boss_R)
    .extrude(gusset_t)
)
frame = frame.union(apex_boss)

# ----------------------------- 3. axle -------------------------------
axle = (
    cq.Workplane("YZ", origin=(axle_back_x, 0, axle_z))
    .circle(axle_R)
    .extrude(axle_front_x - axle_back_x)
)

# ----------------------------- 4. crank ------------------------------
crank_hub = (
    cq.Workplane("YZ", origin=(crank_x - crank_t / 2.0, 0, axle_z))
    .circle(crank_R)
    .extrude(crank_t)
)


def make_crank_arm(length, direction):
    """Flat bar crank arm radiating from the crank hub centre."""
    _, dy, dz = direction
    n = math.hypot(dy, dz)
    dy, dz = dy / n, dz / n
    arm = cq.Workplane(
        cq.Plane(origin=(crank_x, 0, axle_z), xDir=(0, dy, dz), normal=(1, 0, 0))
    ).box(length, arm_thk, arm_axial_w)
    return arm.translate((0, dy * length / 2.0, dz * length / 2.0))


def make_grip(length, direction):
    """Cylindrical handle grip at the end of a crank arm (parallel to axle)."""
    _, dy, dz = direction
    n = math.hypot(dy, dz)
    dy, dz = dy / n, dz / n
    return (
        cq.Workplane(
            "YZ",
            origin=(
                crank_x + grip_offset_x - grip_len / 2.0,
                dy * length,
                axle_z + dz * length,
            ),
        )
        .circle(grip_R)
        .extrude(grip_len)
    )


arm_long = make_crank_arm(arm_len_long, arm_dir_long)
arm_short = make_crank_arm(arm_len_short, arm_dir_short)
grip_long = make_grip(grip_len, arm_dir_long)
grip_short = make_grip(grip_len, arm_dir_short)

# end cap on the axle nose with a small cotter-pin hole
end_cap = (
    cq.Workplane("YZ", origin=(axle_front_x, 0, axle_z))
    .circle(12.0)
    .extrude(10.0)
)
cotter_hole = (
    cq.Workplane("XY", origin=(axle_front_x + 5.0, 0, axle_z))
    .circle(3.0)
    .extrude(20.0, both=True)
)

# --------------------------- 5. assembly -----------------------------
result = frame
result = result.union(wheel)
result = result.union(axle)
result = result.union(crank_hub)
result = result.union(arm_long).union(arm_short)
result = result.union(grip_long).union(grip_short)
result = result.union(end_cap).cut(cotter_hole)