import cadquery as cq
from cadquery import Vector as V
import math

# ---------------- Parameters ----------------
# Hull
hull_len = 56.0          # hull length (X)
hull_wid = 36.0          # hull width (Y)
hull_h   = 14.0          # hull height
hull_z   = 6.0           # hull bottom height above ground
# Tracks
track_w   = 9.0          # track width
track_len = 60.0         # overall track length
track_r   = 8.0          # track end wheel radius (track height = 2*r)
track_cz  = track_r      # track centerline height
grouser_h = 2.0          # track grouser pad height
grouser_t = 4.0          # track grouser pad length
# Wheels
wheel_r = 6.5
# Turret
turret_r   = 15.0        # dome radius
turret_hz  = 13.0        # dome height
turret_bz  = 18.0        # dome base z
# Main gun
gun_z        = 24.0
barrel_r     = 4.0
barrel_len   = 24.0
muzzle_r     = 3.0
muzzle_depth = 5.0

# Collection of all solid features (renamed away from reserved name 'parts')
shapes = []

def _vec(p):
    """Accept tuple or Vector and return a Vector."""
    return p if isinstance(p, V) else V(*p)

def cyl(r, h, base, d):
    """Cylinder solid from base point along direction d."""
    return cq.Solid.makeCylinder(r, h, _vec(base), _vec(d))

def sph(r, c):
    """Sphere solid at center c."""
    return cq.Solid.makeSphere(r, _vec(c))

def boxc(l, w, h, center, rot_axis=None, rot_ang=0.0):
    """Centered box solid, optionally rotated about an axis through its center."""
    b = cq.Workplane("XY").box(l, w, h).translate(center)
    if rot_axis is not None:
        c = V(*center)
        b = b.rotate(c, c + V(*rot_axis), rot_ang)
    return b.val()   # return the Solid, not the Workplane

# ---------------- Hull ----------------
# Main hull box with sloped front glacis and rear plate
hull = cq.Workplane("XY").box(hull_len, hull_wid, hull_h, centered=(True, True, False))
hull = hull.translate((0, 0, hull_z))
hull = hull.edges(">X and >Z").chamfer(5.0)   # sloped front glacis
hull = hull.edges("<X and >Z").chamfer(3.0)   # sloped rear plate
shapes.append(hull.val())

# front hull detail plate (small angled block on glacis)
shapes.append(boxc(5, 7, 4, (hull_len/2 - 3, 0, hull_z + 3), (0, 1, 0), -15))

# ---------------- Tracks (both sides) ----------------
for s in (1, -1):
    y = s * (hull_wid/2 + track_w/2)
    straight = track_len - 2*track_r
    # track body: straight run + rounded end wheels
    shapes.append(boxc(straight, track_w, 2*track_r, (0, y, track_cz)))
    for xe in (straight/2, -straight/2):
        shapes.append(cyl(track_r, track_w, (xe, y - track_w/2, track_cz), (0, 1, 0)))
    # grouser pads on top and bottom runs
    for x in (-15, -5, 5, 15):
        shapes.append(boxc(grouser_t, track_w + 2, grouser_h, (x, y, 2*track_r)))
        shapes.append(boxc(grouser_t, track_w + 2, grouser_h, (x, y, 0)))
    # radial grousers around the end wheels
    for ang in (-60, -30, 0, 30, 60):
        xc = straight/2
        c = (xc + (track_r+0.5)*math.cos(math.radians(ang)), y,
             track_cz + (track_r+0.5)*math.sin(math.radians(ang)))
        shapes.append(boxc(grouser_t, track_w + 2, grouser_h, c, (0, 1, 0), 90 - ang))
    for ang in (120, 150, 180, 210, 240):
        xc = -straight/2
        c = (xc + (track_r+0.5)*math.cos(math.radians(ang)), y,
             track_cz + (track_r+0.5)*math.sin(math.radians(ang)))
        shapes.append(boxc(grouser_t, track_w + 2, grouser_h, c, (0, 1, 0), 90 - ang))
    # angled fenders front/rear over the tracks
    shapes.append(boxc(10, track_w + 3, 1.5, (straight/2 + 3, y, 2*track_r + 1), (0, 1, 0), -25))
    shapes.append(boxc(10, track_w + 3, 1.5, (-straight/2 - 3, y, 2*track_r + 1), (0, 1, 0), 25))
    # outer road wheels with hubs and bolt details
    for xe in (straight/2, -straight/2):
        yo = s * (hull_wid/2 + track_w)
        shapes.append(cyl(wheel_r, 1.5, (xe, yo, track_cz), (0, s, 0)))
        shapes.append(cyl(2.0, 1.2, (xe, yo + s*1.5, track_cz), (0, s, 0)))
        for k in range(3):
            a = math.radians(k*120)
            shapes.append(cyl(0.7, 0.8,
                             (xe + 3.5*math.cos(a), yo + s*1.5, track_cz + 3.5*math.sin(a)),
                             (0, s, 0)))

# ---------------- Turret dome ----------------
# Revolved dome profile (elliptical-like turret)
dome = (cq.Workplane("XZ")
        .moveTo(0, turret_bz).lineTo(turret_r, turret_bz)
        .threePointArc((0.707*turret_r, turret_bz + 0.707*turret_hz), (0, turret_bz + turret_hz))
        .close().revolve(360, (0, 0, 0), (0, 0, 1)))
shapes.append(dome.val())
shapes.append(cyl(11, 4, (0, 0, turret_bz - 2), (0, 0, 1)))  # turret ring blend

# ---------------- Main gun ----------------
shapes.append(cyl(6, 8, (turret_r - 7, 0, gun_z), (1, 0, 0)))                 # mantlet
shapes.append(cyl(barrel_r, barrel_len, (turret_r - 1, 0, gun_z), (1, 0, 0))) # barrel
shapes.append(cyl(barrel_r + 0.6, 2, (turret_r + 6, 0, gun_z), (1, 0, 0)))    # collar ring

# ---------------- Turret top details ----------------
top_z = turret_bz + turret_hz
shapes.append(boxc(14, 10, 2, (-1, 0, top_z - 0.6)))                # hatch plate
shapes.append(boxc(6, 1, 1, (-1, 3, top_z + 0.8)))                  # hatch handles
shapes.append(boxc(6, 1, 1, (-1, -3, top_z + 0.8)))
# cupola with open ring cover
shapes.append(cyl(3.5, 3.5, (3, 5, top_z - 1.5), (0, 0, 1)))
lid_o = cyl(4.0, 1.2, (3, 5, top_z + 2), (-0.4, 0.2, 0.9))
lid_i = cyl(3.2, 1.2, (3, 5, top_z + 2), (-0.4, 0.2, 0.9))
shapes.append(lid_o.cut(lid_i))
# drum magazine with cap and ball top
shapes.append(cyl(2.2, 7, (-7, 2, top_z - 2), (0, 0, 1)))
shapes.append(cyl(2.5, 1.2, (-7, 2, top_z + 5), (0, 0, 1)))
shapes.append(sph(1.0, (-7, 2, top_z + 6.5)))
# antennas (long whip + short rod)
shapes.append(cyl(0.35, 32, (-8, 4, top_z - 2), (0.12, 0.08, 1)))
shapes.append(sph(0.5, (-8 + 0.12*32/1.02, 4 + 0.08*32/1.02, top_z - 2 + 32/1.02)))
shapes.append(cyl(0.3, 14, (-9, 5, top_z - 2), (0.35, 0.25, 1)))
# angled mortar tube with rim
md = V(0.3, -0.3, 1).normalized()
mb = V(-3, -6, top_z - 4)
shapes.append(cyl(1.4, 11, mb, md))
shapes.append(cyl(1.7, 1.2, mb + md*11, md))
# small bent pipe
pd = V(0.15, -0.15, 1).normalized()
pb = V(-6, -9, top_z - 6)
shapes.append(cyl(0.8, 5, pb, pd))
elbow = pb + pd*5
shapes.append(sph(0.9, elbow))
shapes.append(cyl(0.8, 5, elbow, (0.6, -0.5, 0.35)))

# ---------------- Gatling gun (right side) ----------------
g_center = V(2, -turret_r + 2, turret_bz + 7)
shapes.append(sph(3.0, g_center))
d = V(0.45, -0.5, 0.74).normalized()
u = d.cross(V(0, 0, 1)).normalized()
v = d.cross(u).normalized()
for k in range(6):
    a = math.radians(k*60)
    off = (u*math.cos(a) + v*math.sin(a))*1.3
    shapes.append(cyl(0.55, 15, g_center + off - d*2, d))
shapes.append(cyl(1.0, 14, g_center, d))            # center rod
shapes.append(cyl(2.0, 1.5, g_center + d*8, d))     # barrel collar
shapes.append(cyl(1.8, 1.0, g_center + d*13, d))    # front cap

# ---------------- Turret side stowage box ----------------
shapes.append(boxc(8, 4, 9, (4, -turret_r + 0.5, turret_bz + 7)))
for zz in (turret_bz + 9.5, turret_bz + 4.5):
    shapes.append(cyl(1.7, 1.5, (7.5, -turret_r + 0.5, zz), (1, 0, 0)))
    shapes.append(cyl(1.0, 2.2, (7.5, -turret_r + 0.5, zz), (1, 0, 0)))

# ---------------- Curved pipes (exhaust / grab rails) ----------------
p1 = V(18, -16, 20); d1 = V(0.3, -0.7, 0.4).normalized()
shapes.append(cyl(1.2, 6, p1, d1)); e1 = p1 + d1*6
shapes.append(sph(1.3, e1)); shapes.append(cyl(1.2, 5, e1, (0.2, -0.9, -0.3)))
p2 = V(10, 10, 26); d2 = V(0.5, 0.6, 0.5).normalized()
shapes.append(cyl(1.2, 5, p2, d2)); e2 = p2 + d2*5
shapes.append(sph(1.3, e2)); shapes.append(cyl(1.2, 5, e2, (0.2, 0.9, -0.4)))
p3 = V(12, 4, 22); d3 = V(0.4, 0.5, 0.75).normalized()
shapes.append(cyl(1.1, 5, p3, d3)); e3 = p3 + d3*5
shapes.append(sph(1.2, e3)); shapes.append(cyl(1.1, 4, e3, (0.1, 0.9, -0.4)))

# ---------------- Assemble ----------------
# Fuse all solid features into a single body
fused = shapes[0].fuse(*shapes[1:])

# Hollow the main gun muzzle (open barrel bore)
muzzle_cut = cyl(muzzle_r, muzzle_depth + 1,
                 (turret_r - 1 + barrel_len - muzzle_depth, 0, gun_z), (1, 0, 0))
final_solid = fused.cut(muzzle_cut)

# Export result as a Workplane containing the final solid
result = cq.Workplane("XY").add(final_solid)