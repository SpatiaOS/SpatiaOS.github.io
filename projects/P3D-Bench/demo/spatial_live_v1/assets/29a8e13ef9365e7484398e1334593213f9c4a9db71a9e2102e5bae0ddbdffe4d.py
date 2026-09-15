import math
import cadquery as cq

# =====================================================================
#  PARAMETERS  (mm – estimated from the reference image)
# =====================================================================

# ---- foot / base ----
base_len      = 260.0        # bottom plate X size
base_wid      = 260.0        # bottom plate Y size
base_thk      = 22.0         # bottom plate thickness
base_chamfer  = 55.0         # corner cut of the bottom plate
base_fillet   = 14.0         # rounding of the vertical edges

plate2_len    = 200.0        # upper plate
plate2_wid    = 200.0
plate2_thk    = 26.0
plate2_fillet = 16.0

pedestal_r    = 100.0        # round pedestal under the turret
pedestal_h    = 12.0

# ---- turret ----
turret_r      = 92.0
turret_h      = 42.0

# ---- shoulder joint ----
shoulder_z    = 250.0        # height of the shoulder axis above ground

# ---- arm links ----
L2 = 240.0                   # shoulder -> elbow
L3 = 180.0                   # elbow    -> wrist

# ---- pose (degrees) ----
turret_angle   = 35.0        # whole robot turned around Z
shoulder_angle = 28.0        # lower arm lean (from vertical)
elbow_angle    = 38.0        # additional bend at the elbow
wrist_angle    = 6.0         # small bend at the wrist


# =====================================================================
#  HELPER FUNCTIONS
# =====================================================================

def z_cyl(radius, height, z0=0.0, x=0.0, y=0.0):
    """Solid cylinder with +Z axis, standing on the plane z = z0."""
    return (cq.Workplane("XY")
            .circle(radius)
            .extrude(height)
            .translate((x, y, z0)))


def y_cyl(radius, width, center=(0.0, 0.0, 0.0)):
    """Solid cylinder with Y axis, centred on 'center' (used for joints)."""
    c = cq.Workplane("XY").circle(radius).extrude(width)
    c = c.rotate((0, 0, 0), (1, 0, 0), 90.0)          # +Z -> -Y
    return c.translate((center[0], center[1] + width / 2.0, center[2]))


def make_rod(p1, p2, radius):
    """Straight cylinder between two 3D points."""
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    dz = p2[2] - p1[2]
    length = math.sqrt(dx * dx + dy * dy + dz * dz)
    start = cq.Vector(p1[0], p1[1], p1[2])
    direction = cq.Vector(dx / length, dy / length, dz / length)
    solid = cq.Solid.makeCylinder(radius, length, start, direction)
    return cq.Workplane("XY").newObject([solid])


def place(shape, angle_deg, position):
    """Rotate a link about Y (its local +Z becomes the link direction) and
    move its root to the given joint position."""
    return (shape
            .rotate((0, 0, 0), (0, 1, 0), angle_deg)
            .translate(position))


def make_link(length, w_bot, w_top, thickness, fillet_r=10.0):
    """Tapered flat link built along +Z, centred on Y, root at the origin."""
    pts = [(-w_bot / 2.0, 0.0),
           (-w_top / 2.0, length),
           (w_top / 2.0, length),
           (w_bot / 2.0, 0.0)]
    link = cq.Workplane("XY").polyline(pts).close().extrude(thickness)
    link = link.edges("|Z").fillet(fillet_r)                 # round the corners
    link = link.translate((0, 0, -thickness / 2.0))          # centre on Y
    link = link.rotate((0, 0, 0), (1, 0, 0), 90.0)           # +Y -> +Z
    return link


# =====================================================================
#  1. BASE / FOOT
# =====================================================================

# --- bottom plate, square with cut corners ---
a = base_len / 2.0
b = base_wid / 2.0
ch = base_chamfer
outline = [(-a + ch, -b), (a - ch, -b), (a, -b + ch), (a, b - ch),
           (a - ch, b), (-a + ch, b), (-a, b - ch), (-a, -b + ch)]

base = cq.Workplane("XY").polyline(outline).close().extrude(base_thk)
base = base.edges("|Z").fillet(base_fillet)

# --- upper plate ---
plate2 = (cq.Workplane("XY")
          .box(plate2_len, plate2_wid, plate2_thk, centered=(True, True, False))
          .edges("|Z").fillet(plate2_fillet))
plate2 = plate2.translate((0, 0, base_thk))

# --- round pedestal for the turret ---
pedestal = z_cyl(pedestal_r, pedestal_h, base_thk + plate2_thk)

# =====================================================================
#  2. TURRET AND SHOULDER SUPPORT
# =====================================================================

turret_bottom = base_thk + plate2_thk + pedestal_h
turret_top    = turret_bottom + turret_h
turret        = z_cyl(turret_r, turret_h, turret_bottom)

# stepped cast support that carries the shoulder axis
sup_h1 = 60.0
support = (cq.Workplane("XY")
           .box(180.0, 170.0, sup_h1, centered=(True, True, False))
           .edges("|Z").fillet(18.0)
           .translate((0, 0, turret_top)))

support2 = (cq.Workplane("XY")
            .box(150.0, 150.0, shoulder_z - turret_top - sup_h1,
                 centered=(True, True, False))
            .edges("|Z").fillet(15.0)
            .translate((0, 0, turret_top + sup_h1)))
support = support.union(support2)

# --- shoulder joint drum (big disc on one side, smaller on the other) ---
drum  = y_cyl(78.0, 170.0, (0.0, 0.0, shoulder_z))          # main drum
drum  = drum.union(y_cyl(96.0, 32.0, (0.0, 86.0, shoulder_z)))    # +Y disc
drum  = drum.union(y_cyl(56.0, 34.0, (0.0, -100.0, shoulder_z)))  # -Y disc

# =====================================================================
#  3. LOWER ARM  (shoulder -> elbow)
# =====================================================================

l2 = make_link(L2, 140.0, 100.0, 95.0, fillet_r=14.0)
l2 = l2.union(y_cyl(72.0, 180.0, (0.0, 0.0, 0.0)))        # shoulder hub
l2 = l2.union(y_cyl(58.0, 130.0, (0.0, 0.0, L2)))         # elbow hub

a2    = math.radians(shoulder_angle)
elbow = (L2 * math.sin(a2), 0.0, shoulder_z + L2 * math.cos(a2))
l2    = place(l2, shoulder_angle, (0.0, 0.0, shoulder_z))

# =====================================================================
#  4. UPPER ARM  (elbow -> wrist)
# =====================================================================

l3 = make_link(L3, 110.0, 84.0, 75.0, fillet_r=12.0)
l3 = l3.union(y_cyl(58.0, 126.0, (0.0, 0.0, 0.0)))        # elbow hub
l3 = l3.union(y_cyl(44.0, 96.0, (0.0, 0.0, L3)))          # wrist hub
l3 = l3.union(y_cyl(36.0, 150.0, (0.0, 0.0, 46.0)))       # elbow side motor

a3    = math.radians(shoulder_angle + elbow_angle)
wrist = (elbow[0] + L3 * math.sin(a3), 0.0, elbow[2] + L3 * math.cos(a3))
l3    = place(l3, shoulder_angle + elbow_angle, elbow)

# =====================================================================
#  5. FOREARM / WRIST / TOOL  (built along +Z from the wrist)
# =====================================================================

fa = None
z_cursor = 0.0
# stacked cylinders = the stepped, telescopic looking forearm of the image
segments = [(50.0, 50.0),    # wrist housing
            (46.0, 120.0),   # main barrel
            (54.0, 22.0),    # collar
            (42.0, 22.0),
            (36.0, 20.0),
            (28.0, 20.0),
            (22.0, 24.0),
            (15.0, 36.0)]    # thin shaft
for radius, height in segments:
    seg = z_cyl(radius, height, z_cursor)
    fa = seg if fa is None else fa.union(seg)
    z_cursor += height

# small tool flange
flange = (cq.Workplane("XY")
          .box(40.0, 40.0, 14.0, centered=(True, True, False))
          .translate((0.0, 0.0, z_cursor)))
fa = fa.union(flange)
z_cursor += 14.0

# two tiny gripper fingers
for sy in (-1.0, 1.0):
    finger = (cq.Workplane("XY")
              .box(10.0, 12.0, 36.0, centered=(True, True, False))
              .translate((0.0, sy * 13.0, z_cursor)))
    fa = fa.union(finger)

fa = place(fa, shoulder_angle + elbow_angle + wrist_angle, wrist)

# =====================================================================
#  6. PARALLEL LINKAGE RODS (shoulder drum -> forearm base)
# =====================================================================

rod_r = 13.0
rod1 = make_rod((0.0,  78.0, shoulder_z), (wrist[0],  44.0, wrist[2]), rod_r)
rod2 = make_rod((0.0, -78.0, shoulder_z), (wrist[0], -44.0, wrist[2]), rod_r)

# =====================================================================
#  7. ASSEMBLY
# =====================================================================

robot = base.union(plate2).union(pedestal)
robot = robot.union(turret).union(support).union(drum)
robot = robot.union(l2).union(l3).union(fa)
robot = robot.union(rod1).union(rod2)

# turn the whole robot to match the pose of the picture
robot = robot.rotate((0, 0, 0), (0, 0, 1), turret_angle)

result = robot