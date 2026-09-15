import cadquery as cq
from math import sin, cos, radians

# ======================================================================
#  Cartoon / chibi battle tank (Metal-Slug style)
#  Interpretation of the reference image:
#   - Rounded hull sitting between two wide crawler tracks
#   - Large hemispherical turret dome with a horizontal main cannon
#   - Cupola + periscope on top of the dome
#   - Binocular-style gun sight box on the front-right of the dome
#   - Two exhaust stacks, a tilted gatling gun and a whip antenna
#   - Exposed big road wheels, tread plates, fenders and grab handles
#
#  Axes: X = width, Y = length (front = -Y), Z = up
# ======================================================================

# --------------------------- PARAMETERS -------------------------------
# Hull
hull_len   = 72.0
hull_wid   = 50.0
hull_bot_z = 16.0
hull_top_z = 38.0

# Spherical turret
dome_r  = 25.0
dome_cy = -2.0
dome_cz = hull_top_z - 5.0          # dome centre sunk into the deck

# Main gun
cannon_r   = 6.5
cannon_len = 32.0
cannon_cz  = dome_cz + 3.0
mantlet_r  = 9.0

# Running gear
track_len  = 90.0
track_wid  = 16.0
wheel_r    = 11.0
track_cz   = 13.0                   # axle height
wheel_span = track_len / 2 - wheel_r
track_x    = hull_wid / 2 + track_wid / 2 - 3.0
hub_r      = 4.5
bolt_r     = 1.5
bolt_circ  = 6.5
tread_r    = wheel_r + 1.0

antenna_h  = 42.0

# --------------------------- HELPERS ----------------------------------
def cyl_y(radius, length, loc=(0, 0, 0)):
    """Cylinder with its axis along Y."""
    return (cq.Workplane("XY").cylinder(length, radius)
            .rotate((0, 0, 0), (1, 0, 0), 90).translate(loc))

def cyl_x(radius, length, loc=(0, 0, 0)):
    """Cylinder with its axis along X."""
    return (cq.Workplane("XY").cylinder(length, radius)
            .rotate((0, 0, 0), (0, 1, 0), 90).translate(loc))

# --------------------------- HULL -------------------------------------
# Side profile (angled glacis + tail) extruded across the width
hl = hull_len / 2
profile = [
    (-hl,      hull_bot_z + 4),   # nose
    (-hl + 11, hull_top_z),       # top of glacis
    ( hl - 7,  hull_top_z),       # rear deck
    ( hl,      hull_bot_z + 7),   # tail
    ( hl - 2,  hull_bot_z),
    (-hl + 3,  hull_bot_z),
]
hull = (cq.Workplane("YZ")
        .polyline(profile).close()
        .extrude(hull_wid / 2, both=True)
        .edges("|X").fillet(1.5))          # soften the long edges

# --------------------------- TURRET DOME ------------------------------
dome = cq.Workplane("XY").sphere(dome_r).translate((0, dome_cy, dome_cz))

# --------------------------- MAIN GUN ---------------------------------
barrel_back = -8.0                            # buried inside the dome
barrel_cy   = barrel_back - cannon_len / 2
barrel  = cyl_y(cannon_r, cannon_len, (0, barrel_cy, cannon_cz))
mantlet = cyl_y(mantlet_r, 10.0, (0, -26.0, cannon_cz))   # collar
muzzle  = cyl_y(cannon_r + 1.5, 7.0,
                (0, barrel_cy - cannon_len / 2 + 3.0, cannon_cz))
bore    = cyl_y(4.0, 10.0,
                (0, barrel_cy - cannon_len / 2 - 1.0, cannon_cz))  # cutter

# --------------------------- TURRET DETAILS ---------------------------
# Commander cupola with lid and rotated periscope head
cupola = (cq.Workplane("XY").cylinder(5, 6.5).translate((0, 6, 56))
          .union(cq.Workplane("XY").cylinder(2, 7.5).translate((0, 6, 59)))
          .union(cq.Workplane("XY").box(6, 7, 5)
                 .rotate((0, 0, 0), (0, 0, 1), -20).translate((0, 6, 62))))

# Binocular gun-sight box on the front-right of the dome
sight = cq.Workplane("XY").box(11, 9, 15).translate((14, -16, 42))
for pz in (38.5, 45.5):
    sight = (sight
             .union(cyl_y(3.2, 2.0, (14, -20.5, pz)))   # port ring
             .union(cyl_y(2.3, 5.0, (14, -21.5, pz))))  # port tube

# Exhaust stacks (one tall with cap + spout, one shorter with cap)
stackA = (cq.Workplane("XY").cylinder(24, 3.0).translate((-10, 16, 56))
          .union(cq.Workplane("XY").cylinder(1.6, 3.7).translate((-10, 16, 68.6)))
          .union(cyl_y(1.2, 7.0, (-10, 19, 67.5))))
stackB = (cq.Workplane("XY").cylinder(24, 3.0).translate((8, 22, 48))
          .union(cq.Workplane("XY").cylinder(1.6, 3.7).translate((8, 22, 60.6))))

# Gatling gun on the right-rear corner: 6 barrels around a core
gatling = cq.Workplane("XY").cylinder(26, 2.5).translate((0, 0, 13))
for k in range(6):
    a = radians(k * 60)
    gatling = gatling.union(
        cq.Workplane("XY").cylinder(30, 1.5)
        .translate((4 * cos(a), 4 * sin(a), 15)))
for rz in (9, 22):                                     # clamp rings
    gatling = gatling.union(cq.Workplane("XY").cylinder(3, 6.2).translate((0, 0, rz)))
gatling  = gatling.rotate((0, 0, 0), (1, 0, 0), -35).translate((20, 26, 44))
gat_base = cq.Workplane("XY").sphere(5).translate((20, 26, 42.5))  # ball mount

# Tall whip antenna with ball tip + a short leaning rod on the stack
antenna = (cq.Workplane("XY").cylinder(antenna_h, 0.9)
           .translate((0, 0, antenna_h / 2))
           .union(cq.Workplane("XY").sphere(1.6).translate((0, 0, antenna_h + 1)))
           .rotate((0, 0, 0), (1, 0, 0), -12)
           .translate((-14, 12, 47)))
whip = (cq.Workplane("XY").cylinder(18, 0.7).translate((0, 0, 9))
        .rotate((0, 0, 0), (1, 0, 0), -30)
        .translate((-11, 15, 58)))

# Front deck hatch with a small half-torus handle
hatch = cq.Workplane("XY").box(11, 9, 5).translate((11, -22, 39.5))
hh = (cq.Workplane("XY").add(cq.Solid.makeTorus(2.5, 0.8))
      .rotate((0, 0, 0), (0, 1, 0), 90).translate((11, -22, 42.2)))
hh = hh.cut(cq.Workplane("XY").box(20, 20, 60).translate((11, -22, 12.2)))

# Headlight on the left front fender
headlight = cq.Workplane("XY").cylinder(4, 2.5).translate((-30, -33, 32))

# Grab handles: half-torus loops on the hull side walls
def grab_handle(side):
    x = side * hull_wid / 2
    t = (cq.Workplane("XY").add(cq.Solid.makeTorus(3.0, 1.0))
         .rotate((0, 0, 0), (1, 0, 0), 90).translate((x, -14, 30)))
    cutter = cq.Workplane("XY").box(60, 12, 12).translate((x - 30 * side, -14, 30))
    return t.cut(cutter)

# --------------------------- TRACKS & FENDERS -------------------------
def make_track(side):
    """Track band, two wheels with hubs and wrap-around tread plates."""
    x = side * track_x
    asm = (cq.Workplane("XY")
           .box(track_wid, track_len - 2 * wheel_r, 2 * wheel_r)
           .translate((x, 0, track_cz)))
    for ey in (-wheel_span, wheel_span):
        asm = (asm
               .union(cyl_x(wheel_r,       track_wid,     (x, ey, track_cz)))
               .union(cyl_x(wheel_r + 0.8, track_wid + 2, (x, ey, track_cz)))
               .union(cyl_x(hub_r,         track_wid + 5, (x, ey, track_cz))))
    plate = (track_wid + 3, 6.5, 2.6)
    # tread plates along the straight top / bottom runs
    for py in range(-32, 33, 8):
        for pz in (track_cz + tread_r, track_cz - tread_r):
            asm = asm.union(cq.Workplane("XY").box(*plate).translate((x, py, pz)))
    # tread plates wrapped around the wheels
    for deg in (30, 60, 90, 120, 150):
        a = radians(deg)
        asm = asm.union(cq.Workplane("XY").box(*plate)
                        .rotate((0, 0, 0), (1, 0, 0), deg)
                        .translate((x, -wheel_span - tread_r * sin(a),
                                    track_cz + tread_r * cos(a))))
        asm = asm.union(cq.Workplane("XY").box(*plate)
                        .rotate((0, 0, 0), (1, 0, 0), -deg)
                        .translate((x, wheel_span + tread_r * sin(a),
                                    track_cz + tread_r * cos(a))))
    return asm

def make_fender(side):
    """Flat mudguard over the track plus an angled front flap."""
    x = side * track_x
    f = (cq.Workplane("XY")
         .box(track_wid + 7, track_len * 0.86, 3).translate((x, 1, 29)))
    flap = (cq.Workplane("XY").box(track_wid + 7, 12, 3)
            .rotate((0, 0, 0), (1, 0, 0), 55).translate((x, -42, 23)))
    return f.union(flap)

# Bolt-hole cutters: 3 triangular holes in each wheel face
bolt_holes = []
for side in (1, -1):
    x = side * track_x
    for ey in (-wheel_span, wheel_span):
        for k in range(3):
            aa = radians(90 + k * 120)
            bolt_holes.append(
                cyl_x(bolt_r, track_wid + 8,
                      (x, ey + bolt_circ * cos(aa), track_cz + bolt_circ * sin(aa))))

# --------------------------- ASSEMBLY ---------------------------------
result = hull
for part in (dome, barrel, mantlet, muzzle, cupola, sight,
             stackA, stackB, gatling, gat_base, antenna, whip,
             hatch, hh, headlight,
             grab_handle(1), grab_handle(-1),
             make_track(1), make_track(-1),
             make_fender(1), make_fender(-1)):
    result = result.union(part)

# Final cuts: cannon bore and wheel bolt holes
result = result.cut(bore)
for hole in bolt_holes:
    result = result.cut(hole)