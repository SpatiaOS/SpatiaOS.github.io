import math
import cadquery as cq

# =================================================================
#  HAND WINCH  /  PLANETARY GEAR REDUCER ON A TRIANGULAR STAND
#  (all dimensions in millimetres)
#
#  Interpretation of the picture:
#    * a large internally toothed ring gear ("drum") standing
#      vertically, carried by a triangular side plate with two
#      cross feet
#    * inside the drum a planetary train (sun + 3 planets +
#      carrier spider)
#    * an inclined tubular gearbox reaching from the drum hub
#      forward/down/left to the crank shaft
#    * two crank arms (a long one and a short one) with
#      cylindrical hand grips parallel to the crank axis
# =================================================================

# ---------------- ring gear drum ---------------------------------
drum_outer_r    = 95.0          # outside radius of the drum
drum_width      = 22.0          # axial width of the drum
ring_root_r     = 75.0          # root circle of the internal teeth
ring_tooth_h    = 6.0           # radial tooth height
ring_tooth_w    = 4.0           # circumferential tooth thickness
ring_n_teeth    = 56
hub_z           = 115.0         # height of the wheel axis above ground

# ---------------- planetary train --------------------------------
sun_pitch_r     = 18.0
sun_n_teeth     = 12
planet_pitch_r  = 27.0
planet_n_teeth  = 16
n_planets       = 3
gear_face       = 16.0          # gear width
gear_tooth_h    = 5.5
gear_tooth_w    = 4.5
carrier_r       = sun_pitch_r + planet_pitch_r     # planet centre circle
shaft_r         = 14.0          # main hub shaft
pin_r           = 6.0           # planet pins
carrier_thk     = 8.0

# ---------------- frame ------------------------------------------
plate_thk       = 8.0
plate_gap       = 8.0                       # clearance drum <-> plate
plate_y_in      = drum_width / 2 + plate_gap
frame_x_left    = -125.0
frame_x_right   = 100.0
frame_apex      = (-27.0, 122.0)            # (x , z) of the plate apex
foot_w, foot_len, foot_h = 34.0, 120.0, 14.0
rail_sec        = 14.0
rail_y_rear     = 45.0

# ---------------- gearbox / crank axis ---------------------------
gb_rear   = cq.Vector(  10.0,   10.0, hub_z + 5.0)   # at the drum hub
gb_front  = cq.Vector(-140.0, -112.0,       52.0)    # crank shaft tip
long_arm_len   = 250.0
long_arm_ang   = 15.0            # crank position angle [deg]
long_arm_w     = 26.0
long_arm_t     = 12.0
short_arm_len  = 135.0
short_arm_ang  = -8.0
short_arm_w    = 22.0
short_arm_t    = 10.0
grip_big_r, grip_big_l   = 8.0, 60.0
grip_small_r, grip_small_l = 6.5, 48.0


# =================================================================
#  SMALL HELPERS
# =================================================================
def _v(p):
    """tuple / Vector -> Vector"""
    return p if isinstance(p, cq.Vector) else cq.Vector(float(p[0]), float(p[1]), float(p[2]))


def rod(p1, p2, r):
    """solid cylinder running from point p1 to point p2"""
    a, b = _v(p1), _v(p2)
    d = b - a
    return cq.Workplane("XY").newObject(
        [cq.Solid.makeCylinder(r, d.Length, a, d.normalized())]
    )


def bar(p1, p2, width, thick):
    """rectangular bar running from point p1 to point p2"""
    a, b = _v(p1), _v(p2)
    d = b - a
    n = d.normalized()
    ref = cq.Vector(0, 0, 1)
    if abs(n.dot(ref)) > 0.95:                 # avoid degenerate cross product
        ref = cq.Vector(1, 0, 0)
    xd = ref.cross(n).normalized()
    pl = cq.Plane(origin=(a.x, a.y, a.z),
                  xDir=(xd.x, xd.y, xd.z),
                  normal=(n.x, n.y, n.z))
    return cq.Workplane(pl).rect(width, thick).extrude(d.Length)


def union_all(parts):
    """fuse a list of Workplanes into a single solid"""
    out = parts[0]
    for p in parts[1:]:
        out = out.union(p)
    return out


def spur_gear(pitch_r, n_teeth, tooth_h, tooth_w, face):
    """simplified external spur gear: cylindrical body + radial teeth"""
    body = cq.Workplane("XY").circle(pitch_r - tooth_h / 2.0).extrude(face)
    teeth = (cq.Workplane("XY")
             .polarArray(pitch_r, 0, 360, n_teeth, rotate=True)
             .rect(tooth_h, tooth_w)
             .extrude(face))
    return body.union(teeth)


# =================================================================
#  1. GEAR TRAIN  (built flat about Z, tipped up afterwards)
# =================================================================
# --- internally toothed drum -------------------------------------
ring_body = (cq.Workplane("XY")
             .circle(drum_outer_r).circle(ring_root_r)
             .extrude(drum_width))
ring_teeth = (cq.Workplane("XY")
              .polarArray(ring_root_r - ring_tooth_h / 2.0, 0, 360,
                          ring_n_teeth, rotate=True)
              .rect(ring_tooth_h, ring_tooth_w)
              .extrude(drum_width))
ring_gear = ring_body.union(ring_teeth)

gear_z0 = (drum_width - gear_face) / 2.0          # gears centred in the drum

# --- sun gear on the output shaft --------------------------------
sun = spur_gear(sun_pitch_r, sun_n_teeth,
                gear_tooth_h, gear_tooth_w, gear_face).translate((0, 0, gear_z0))

train_parts = [ring_gear, sun]

# --- three planets, their pins and the carrier arms --------------
planet_blank = spur_gear(planet_pitch_r, planet_n_teeth,
                         gear_tooth_h, gear_tooth_w, gear_face)

carrier_z = gear_z0 + gear_face                   # carrier sits on the gears
for i in range(n_planets):
    ang = 360.0 / n_planets * i + 30.0
    px = carrier_r * math.cos(math.radians(ang))
    py = carrier_r * math.sin(math.radians(ang))

    train_parts.append(planet_blank.translate((px, py, gear_z0)))
    train_parts.append(rod((px, py, gear_z0 - 4),
                           (px, py, carrier_z + carrier_thk), pin_r))
    # carrier arm from the centre boss out to the planet pin
    arm = (cq.Workplane("XY")
           .box(carrier_r, 14.0, carrier_thk, centered=(True, True, False))
           .translate((carrier_r / 2.0, 0, carrier_z))
           .rotate((0, 0, 0), (0, 0, 1), ang))
    train_parts.append(arm)
    # boss around the pin
    train_parts.append(rod((px, py, carrier_z),
                           (px, py, carrier_z + carrier_thk), 10.0))

# --- carrier hub and main shaft ----------------------------------
train_parts.append(rod((0, 0, carrier_z), (0, 0, carrier_z + carrier_thk), 22.0))
train_parts.append(rod((0, 0, -14.0), (0, 0, carrier_z + 18.0), shaft_r))

gear_train = union_all(train_parts)

# tip the train up so that its axis is the global Y axis
wheel = (gear_train
         .rotate((0, 0, 0), (1, 0, 0), -90)
         .translate((0, -drum_width / 2.0, hub_z)))


# =================================================================
#  2. FRAME  (triangular side plate, rails and feet)
# =================================================================
plate = (cq.Workplane("XZ").workplane(offset=plate_y_in)
         .polyline([(frame_x_left, 6.0),
                    (frame_x_right, 6.0),
                    frame_apex])
         .close()
         .extrude(plate_thk))

foot_left = (cq.Workplane("XY")
             .box(foot_w, foot_len, foot_h, centered=(True, True, False))
             .translate((frame_x_left + 18.0, 10.0, 0)))
foot_right = (cq.Workplane("XY")
              .box(foot_w, foot_len, foot_h, centered=(True, True, False))
              .translate((frame_x_right - 18.0, 10.0, 0)))

rail_len = frame_x_right - frame_x_left
rail_front = (cq.Workplane("XY")
              .box(rail_len, rail_sec, rail_sec, centered=(True, True, False))
              .translate(((frame_x_left + frame_x_right) / 2.0,
                          -(plate_y_in + plate_thk / 2.0), 0)))
rail_rear = (cq.Workplane("XY")
             .box(rail_len, rail_sec, rail_sec, centered=(True, True, False))
             .translate(((frame_x_left + frame_x_right) / 2.0, rail_y_rear, 0)))

# rear bearing boss + inclined rear leg
rear_boss = rod((0, 22.0, hub_z), (0, rail_y_rear + 6.0, hub_z), 20.0)
rear_leg = bar((0, rail_y_rear, hub_z),
               (frame_x_right - 18.0, rail_y_rear, foot_h), 18.0, 10.0)

frame = union_all([plate, foot_left, foot_right,
                   rail_front, rail_rear, rear_boss, rear_leg])


# =================================================================
#  3. GEARBOX HOUSING ALONG THE INCLINED CRANK AXIS
# =================================================================
gb_vec = gb_front - gb_rear
gb_dir = gb_vec.normalized()


def gp(t):
    """point on the gearbox axis, t = 0 at the drum, t = 1 at the crank"""
    return gb_rear + gb_vec.multiply(t)


# orthonormal frame of the crank plane
w_vec = gb_dir.cross(cq.Vector(0, 0, 1)).normalized()   # horizontal
v_vec = w_vec.cross(gb_dir).normalized()                # "upwards"


def crank_dir(angle_deg):
    """unit vector in the crank rotation plane"""
    a = math.radians(angle_deg)
    return (v_vec.multiply(math.cos(a)) + w_vec.multiply(math.sin(a))).normalized()


gearbox = union_all([
    rod(gp(0.00), gp(0.55), 20.0),        # main housing tube
    rod(gp(0.52), gp(0.58), 22.0),        # flange
    rod(gp(0.55), gp(0.76), 13.0),        # tapered neck
    rod(gp(0.75), gp(0.91), 8.5),         # bearing nose
    rod(gp(0.90), gp(1.00), 5.5),         # crank shaft stub
])

# small parallel tube (ratchet / pawl housing) beside the main one
side_off = v_vec.multiply(-26.0)
side_tube = union_all([
    rod(gp(0.38) + side_off, gp(0.90) + side_off, 9.0),
    rod(gp(0.88) + side_off, gp(1.00) + side_off, 5.0),
])
gearbox = gearbox.union(side_tube)


# =================================================================
#  4. CRANK ARMS AND HAND GRIPS
# =================================================================
# --- long (high speed) crank -------------------------------------
long_root = gp(0.97)
long_tip = long_root + crank_dir(long_arm_ang).multiply(long_arm_len)
long_crank = union_all([
    rod(gp(0.93), gp(1.03), 11.0),                       # crank boss
    bar(long_root, long_tip, long_arm_w, long_arm_t),    # arm
    rod(long_tip - gb_dir.multiply(8.0),
        long_tip + gb_dir.multiply(14.0), 11.0),         # grip boss
    rod(long_tip, long_tip + gb_dir.multiply(grip_big_l), grip_big_r),
])

# --- short (high torque) crank -----------------------------------
short_root = gp(0.90)
short_tip = short_root + crank_dir(short_arm_ang).multiply(short_arm_len)
short_crank = union_all([
    bar(short_root, short_tip, short_arm_w, short_arm_t),
    rod(short_tip - gb_dir.multiply(6.0),
        short_tip + gb_dir.multiply(10.0), 9.0),
    rod(short_tip, short_tip + gb_dir.multiply(grip_small_l), grip_small_r),
])


# =================================================================
#  5. FINAL ASSEMBLY
# =================================================================
result = union_all([wheel, frame, gearbox, long_crank, short_crank])