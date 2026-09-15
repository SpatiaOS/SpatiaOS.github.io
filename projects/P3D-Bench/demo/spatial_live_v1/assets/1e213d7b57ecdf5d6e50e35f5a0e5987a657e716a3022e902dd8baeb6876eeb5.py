import cadquery as cq
from math import sin, cos, radians, atan2, degrees

# ------------------------------------------------------------------
# PARAMETERS (estimated from image proportions, in mm)
# ------------------------------------------------------------------
# Base plate
base_len      = 150.0   # X extent of mounting plate
base_wid      = 130.0   # Y extent of mounting plate
base_thk      = 22.0    # plate thickness
ear_ext       = 26.0    # how far mounting ears protrude in X
ear_wid       = 36.0    # ear width in Y
ear_thk       = 12.0    # ear thickness
hole_dia      = 7.0     # bolt holes in ears
notch_w       = 34.0    # side notch width
notch_depth   = 16.0    # side notch depth

# Swivel pedestal
ring1_rad, ring1_h = 50.0, 12.0   # lower turntable ring
ring2_rad, ring2_h = 42.0, 14.0   # upper turntable ring

# Tilted torso column
col_dx, col_dy, col_dz = 50.0, 46.0, 60.0
col_tilt      = -12.0   # deg, lean about Y axis
col_center    = (-6.0, 0.0, 72.0)

# Shoulder joint (axis along Y)
sh_x, sh_z    = -10.0, 95.0       # shoulder pivot location
sh_rad        = 32.0
sh_len        = 56.0
hex_shaft_ac  = 26.0              # hex output shaft (across corners)
hex_shaft_len = 34.0
stub_rad, stub_len = 12.0, 14.0   # rear stub

# Lower arm link
arm_len       = 107.0
arm_tilt      = 21.0              # deg from vertical, leaning -X
arm_dx, arm_dy = 40.0, 34.0       # link cross-section

# Elbow joint (axis along Y)
el_rad        = 26.0
el_len        = 46.0

# Forearm tube (horizontal, along -X)
tube_rad      = 15.0
tube_len      = 150.0
collar_rad    = 21.0
collar_w      = 14.0
mid_ring_rad  = 17.0
mid_ring_w    = 10.0
el_hex_ac, el_hex_len = 14.0, 30.0  # twin hex connectors at elbow

# Wrist chain (stepped cylinders along -X)
w_neck1_r, w_neck1_l = 11.0, 10.0
w_bulb_r,  w_bulb_l  = 16.0, 14.0
w_neck2_r, w_neck2_l = 8.0, 10.0
w_flange_r, w_flange_l = 6.0, 6.0
w_tip_r,   w_tip_l   = 3.0, 5.0

# Parallel balancing link (side rod)
rod_dx, rod_dy = 12.0, 8.0
rod_y          = 28.0             # Y offset of rod plane
crank_sz       = 26.0

# ------------------------------------------------------------------
# HELPERS
# ------------------------------------------------------------------
def cyl(r, h, base, direction=(0, 0, 1)):
    """Cylinder from base point along direction."""
    return cq.Workplane("XY").newObject(
        [cq.Solid.makeCylinder(r, h, cq.Vector(*base), cq.Vector(*direction))])

def rbox(dx, dy, dz, center=(0, 0, 0), rot_y=0.0):
    """Box centered at origin, optionally rotated about Y, then moved."""
    wp = cq.Workplane("XY").box(dx, dy, dz)
    if rot_y:
        wp = wp.rotate((0, 0, 0), (0, 1, 0), rot_y)
    return wp.translate(center)

def hex_y(ac, length, base):
    """Hex prism extruded along +Y."""
    return (cq.Workplane("XY").polygon(6, ac).extrude(length)
            .rotate((0, 0, 0), (1, 0, 0), -90).translate(base))

def hex_x(ac, length, base):
    """Hex prism extruded along +X."""
    return (cq.Workplane("XY").polygon(6, ac).extrude(length)
            .rotate((0, 0, 0), (0, 1, 0), 90).translate(base))

# ------------------------------------------------------------------
# BASE PLATE with ears, holes, notches and front pocket
# ------------------------------------------------------------------
base_plate = rbox(base_len, base_wid, base_thk, (0, 0, base_thk / 2))

for sx in (1, -1):
    for sy in (1, -1):
        ex = sx * (base_len / 2 + ear_ext / 2 - 4)
        ey = sy * (base_wid / 2 - 25)
        base_plate = base_plate.union(
            rbox(ear_ext, ear_wid, ear_thk, (ex, ey, ear_thk / 2)))
        for hy in (-10, 10):   # two bolt holes per ear
            base_plate = base_plate.cut(
                cyl(hole_dia / 2, ear_thk + 2, (ex, ey + hy, -1)))

# side notches (step cuts seen on plate edges)
for sx in (1, -1):
    base_plate = base_plate.cut(
        rbox(notch_depth, notch_w, base_thk + 2, (sx * base_len / 2, 0, base_thk / 2)))
# rectangular pocket on front face
base_plate = base_plate.cut(rbox(46, 10, 14, (-20, -base_wid / 2, 8)))

# ------------------------------------------------------------------
# TURNTABLE RINGS + TILTED TORSO
# ------------------------------------------------------------------
pedestal = cyl(ring1_rad, ring1_h, (0, 0, base_thk))
pedestal = pedestal.union(cyl(ring2_rad, ring2_h, (0, 0, base_thk + ring1_h)))
torso = rbox(col_dx, col_dy, col_dz, col_center, rot_y=col_tilt)

# ------------------------------------------------------------------
# SHOULDER JOINT
# ------------------------------------------------------------------
shoulder = cyl(sh_rad, sh_len, (sh_x, -sh_len / 2, sh_z), (0, 1, 0))
shoulder = shoulder.union(hex_y(hex_shaft_ac, hex_shaft_len, (sh_x, sh_len / 2, sh_z)))
shoulder = shoulder.union(cyl(stub_rad, stub_len, (sh_x, -sh_len / 2, sh_z), (0, -1, 0)))

# ------------------------------------------------------------------
# LOWER ARM (tilted link shoulder -> elbow)
# ------------------------------------------------------------------
t = radians(arm_tilt)
el_x = sh_x - sin(t) * arm_len
el_z = sh_z + cos(t) * arm_len
arm_angle = degrees(atan2(el_x - sh_x, el_z - sh_z))
lower_arm = rbox(arm_dx, arm_dy, arm_len + 40,
                 ((sh_x + el_x) / 2, 0, (sh_z + el_z) / 2), rot_y=arm_angle)

# ------------------------------------------------------------------
# ELBOW JOINT + FOREARM TUBE + Wrist chain
# ------------------------------------------------------------------
elbow = cyl(el_rad, el_len, (el_x, -el_len / 2, el_z), (0, 1, 0))

tube_start = (el_x + 25, 0, el_z)
forearm = cyl(tube_rad, tube_len, tube_start, (-1, 0, 0))
forearm = forearm.union(cyl(collar_rad, collar_w, (el_x + 18, 0, el_z), (-1, 0, 0)))
forearm = forearm.union(cyl(collar_rad, collar_w, (el_x + 25 - tube_len, 0, el_z), (-1, 0, 0)))
forearm = forearm.union(cyl(mid_ring_rad, mid_ring_w, (-95, 0, el_z), (-1, 0, 0)))
# twin hex connectors protruding behind elbow collar
forearm = forearm.union(hex_x(el_hex_ac, el_hex_len, (el_x + 5, -12, el_z + 20)))
forearm = forearm.union(hex_x(el_hex_ac, el_hex_len, (el_x + 5,  12, el_z + 20)))

# wrist: stepped decreasing cylinders beyond tube end
xw = el_x + 25 - tube_len
wrist = cyl(w_neck1_r, w_neck1_l, (xw, 0, el_z), (-1, 0, 0))
xw -= w_neck1_l
wrist = wrist.union(cyl(w_bulb_r, w_bulb_l, (xw, 0, el_z), (-1, 0, 0)))
wrist = wrist.union(rbox(18, 16, 16, (xw - 6, 0, el_z + 12)))  # wrist block
xw -= w_bulb_l
wrist = wrist.union(cyl(w_neck2_r, w_neck2_l, (xw, 0, el_z), (-1, 0, 0)))
xw -= w_neck2_l
wrist = wrist.union(cyl(w_flange_r, w_flange_l, (xw, 0, el_z), (-1, 0, 0)))
xw -= w_flange_l
wrist = wrist.union(cyl(w_tip_r, w_tip_l, (xw, 0, el_z), (-1, 0, 0)))

# ------------------------------------------------------------------
# PARALLEL BALANCING LINK (side rod with cranks)
# ------------------------------------------------------------------
pA = (sh_x + 34, rod_y, sh_z + 6)
pB = (el_x + 30, rod_y, el_z - 6)
rod_len = ((pB[0]-pA[0])**2 + (pB[2]-pA[2])**2) ** 0.5
rod_ang = degrees(atan2(pB[0]-pA[0], pB[2]-pA[2]))
link = rbox(rod_dx, rod_dy, rod_len, ((pA[0]+pB[0])/2, rod_y, (pA[2]+pB[2])/2), rot_y=rod_ang)
link = link.union(rbox(crank_sz, 14, crank_sz, pA))   # shoulder crank
link = link.union(rbox(crank_sz, 14, crank_sz, pB))   # elbow crank

# ------------------------------------------------------------------
# ASSEMBLE
# ------------------------------------------------------------------
result = base_plate
for part in (pedestal, torso, shoulder, lower_arm, elbow, forearm, wrist, link):
    result = result.union(part)

result = result