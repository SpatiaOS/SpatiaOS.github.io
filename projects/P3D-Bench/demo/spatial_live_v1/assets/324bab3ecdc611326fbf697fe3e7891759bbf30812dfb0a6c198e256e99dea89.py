import cadquery as cq
import math

# ============================================================================
# Hand-cranked planetary-gear demonstrator
# ----------------------------------------------------------------------------
# Interpretation of the reference image:
#   * Large vertical ring gear with INTERNAL teeth, supported by an A-frame
#     style cheek plate on a base with small feet.
#   * Central sun gear + three planet gears carried on a pinned spider
#     (classic planetary train visible inside the ring).
#   * Stepped main shaft / boss / hex nut at the gear centre.
#   * Two hand levers (one long, one short) mounted on a lower pivot boss,
#     each ending in a hollow tubular grip; a small drive link runs from the
#     pivot up to the central boss.
# Units: millimetres.  Gear axis = global X, Z = up.
# ============================================================================

# ----------------------------- parameters ----------------------------------
# Ring gear (internal teeth)
ring_outer_r = 100.0
ring_root_r  = 80.0      # tooth valleys
ring_tip_r   = 74.0      # tooth tips (point inward)
ring_teeth   = 60
ring_thick   = 25.0
rim_width    = 10.0      # raised band on each face of the rim
rim_thick    = 5.0

# Sun gear
sun_tip_r  = 26.0
sun_root_r = 21.5
sun_teeth  = 18
sun_thick  = 18.0
sun_bore_r = 10.0

# Planet gears
pl_tip_r    = 29.5
pl_root_r   = 25.0
pl_teeth    = 21
pl_thick    = 16.0
pl_bore_r   = 6.0
pl_center_r = 50.7
pl_angles   = (90.0, 220.0, 320.0)

# Planet carrier (spider) - sits behind the gears
carr_thick = 6.0
carr_arm_w = 14.0
carr_hub_r = 16.0
carr_x     = 10.0

# Main shaft / boss / nut
shaft_r  = 10.0
boss_r   = 24.0
collar_r = 15.0
nut_dia  = 26.0
axis_z   = 110.0         # height of the gear axis above the ground

# Stand
cheek_x0, cheek_x1 = -46.0, -13.0
base_x0, base_x1   = -52.0, 18.0
base_y0, base_y1   = -120.0, 104.0
base_h  = 12.0
foot_h  = 8.0
cheek_pts = [(-115.0, 0.0), (100.0, 0.0), (100.0, 45.0), (80.0, 70.0),
             (55.0, 85.0), (25.0, 100.0), (-8.0, 115.0), (-118.0, 14.0)]

# Handle mechanism
pivot_x, pivot_y, pivot_z = -62.0, -18.0, 48.0
pivot_boss_r = 12.0
pivot_bore_r = 5.0
lever_w, lever_t = 16.0, 12.0
long_end  = (-105.0, 235.0)    # (y, z) centre of the long grip
short_end = (-40.0, 165.0)     # (y, z) centre of the short grip
grip_r, grip_in_r, grip_len = 10.0, 6.0, 55.0


# ----------------------------- helpers -------------------------------------
def gear_profile_points(tip_r, root_r, count, tip_frac=0.30, root_frac=0.40):
    """Trapezoidal tooth outline (works for external and internal gears)."""
    pts = []
    pitch = 2.0 * math.pi / count
    ht, hr = tip_frac * pitch / 2.0, root_frac * pitch / 2.0
    for i in range(count):
        a = i * pitch
        pts.append((root_r * math.cos(a - hr), root_r * math.sin(a - hr)))
        pts.append((tip_r  * math.cos(a - ht), tip_r  * math.sin(a - ht)))
        pts.append((tip_r  * math.cos(a + ht), tip_r  * math.sin(a + ht)))
        pts.append((root_r * math.cos(a + hr), root_r * math.sin(a + hr)))
    return pts


def cyl_x(radius, x0, x1, y=0.0, z=0.0):
    """Cylinder with its axis along global X."""
    return cq.Solid.makeCylinder(radius, x1 - x0, cq.Vector(x0, y, z),
                                 cq.Vector(1, 0, 0))


def box(x0, x1, y0, y1, z0, z1):
    return cq.Solid.makeBox(x1 - x0, y1 - y0, z1 - z0, cq.Vector(x0, y0, z0))


def bar_x(p1_yz, p2_yz, x_center, width, thick):
    """Flat bar in a constant-X plane spanning p1 -> p2 (points as (y, z))."""
    dy, dz = p2_yz[0] - p1_yz[0], p2_yz[1] - p1_yz[1]
    length = math.hypot(dy, dz)
    angle = math.degrees(math.atan2(dz, dy))
    bar = cq.Solid.makeBox(thick, length, width,
                           cq.Vector(-thick / 2.0, -length / 2.0, -width / 2.0))
    bar = bar.rotate(cq.Vector(0, 0, 0), cq.Vector(1, 0, 0), angle)
    return bar.translate(cq.Vector(x_center,
                                   (p1_yz[0] + p2_yz[0]) / 2.0,
                                   (p1_yz[1] + p2_yz[1]) / 2.0))


def hex_prism_x(dia, thick, x_center, y, z):
    """Hexagonal nut prism with axis along X."""
    return (cq.Workplane("YZ").polygon(6, dia).extrude(thick)
            .translate((x_center - thick / 2.0, y, z)).val())


def external_gear(tip_r, root_r, count, thick, bore_r):
    pts = gear_profile_points(tip_r, root_r, count)
    solid = (cq.Workplane("YZ").polyline(pts).close()
             .extrude(thick).translate((-thick / 2.0, 0.0, 0.0)).val())
    if bore_r > 0.0:
        solid = solid.cut(cyl_x(bore_r, -thick, thick))
    return solid


# ----------------------------- gear cluster --------------------------------
# Ring gear: disc minus an internal-tooth bore
ring_blank = (cq.Workplane("YZ").circle(ring_outer_r)
              .extrude(ring_thick).translate((-ring_thick / 2.0, 0, 0)).val())
ring_bore = (cq.Workplane("YZ")
             .polyline(gear_profile_points(ring_tip_r, ring_root_r, ring_teeth))
             .close().extrude(ring_thick + 4.0)
             .translate((-ring_thick / 2.0 - 2.0, 0, 0)).val())
ring_gear = ring_blank.cut(ring_bore).translate(cq.Vector(0, 0, axis_z))

# Raised rim bands on both faces of the ring
rim = (cq.Workplane("YZ").circle(ring_outer_r).extrude(rim_thick).val()
       .cut(cyl_x(ring_outer_r - rim_width, -2.0, rim_thick + 2.0)))
rim_front = rim.translate(cq.Vector(-ring_thick / 2.0 - rim_thick, 0, axis_z))
rim_back  = rim.translate(cq.Vector(ring_thick / 2.0, 0, axis_z))

# Sun gear
sun = external_gear(sun_tip_r, sun_root_r, sun_teeth, sun_thick, sun_bore_r)
sun = sun.translate(cq.Vector(0, 0, axis_z))

# Planet gears + carrier spider + pins
planet_gears = []
carrier_items = [cyl_x(carr_hub_r, carr_x, carr_x + carr_thick, 0.0, axis_z)]
for ang in pl_angles:
    py = pl_center_r * math.cos(math.radians(ang))
    pz = pl_center_r * math.sin(math.radians(ang))
    pl = external_gear(pl_tip_r, pl_root_r, pl_teeth, pl_thick, pl_bore_r)
    planet_gears.append(pl.translate(cq.Vector(0.0, py, pz + axis_z)))
    carrier_items.append(bar_x((0.0, 0.0), (py, pz),
                               carr_x + carr_thick / 2.0,
                               carr_arm_w, carr_thick)
                         .translate(cq.Vector(0, 0, axis_z)))
    carrier_items.append(cyl_x(pl_bore_r, -12.0, carr_x + carr_thick + 1.0,
                               py, pz + axis_z))

# Main shaft, bearing boss, collar and hex nut
shaft  = cyl_x(shaft_r, -80.0, 26.0, 0.0, axis_z)
boss   = cyl_x(boss_r, -58.0, -10.0, 0.0, axis_z)
collar = cyl_x(collar_r, -66.0, -58.0, 0.0, axis_z)
nut    = hex_prism_x(nut_dia, 10.0, -71.0, 0.0, axis_z)

# ------------------------------- stand -------------------------------------
cheek = (cq.Workplane("YZ").polyline(cheek_pts).close()
         .extrude(cheek_x1 - cheek_x0).translate((cheek_x0, 0, 0)).val())
base  = box(base_x0, base_x1, base_y0, base_y1, 0.0, base_h)
foot_front = box(-56.0, -8.0, -115.0, -93.0, -foot_h, 0.0)
foot_back  = box(-56.0, -8.0, 77.0, 99.0, -foot_h, 0.0)

# ---------------------------- handle mechanism -----------------------------
pivot_boss = cyl_x(pivot_boss_r, -74.0, -44.0, pivot_y, pivot_z).cut(
             cyl_x(pivot_bore_r, -76.0, -42.0, pivot_y, pivot_z))
long_lever  = bar_x((pivot_y, pivot_z), long_end, pivot_x, lever_w, lever_t)
short_lever = bar_x((pivot_y, pivot_z), short_end, pivot_x, lever_w, lever_t)


def make_grip(y, z):
    """Hollow tubular grip attached to the end of a lever."""
    outer = cyl_x(grip_r, -66.0 - grip_len, -66.0, y, z)
    inner = cyl_x(grip_in_r, -67.0 - grip_len, -65.0, y, z)
    return outer.cut(inner)


grip_long  = make_grip(*long_end)
grip_short = make_grip(*short_end)
grip_collar_long  = cyl_x(12.0, -67.0, -61.0, *long_end)
grip_collar_short = cyl_x(12.0, -67.0, -61.0, *short_end)

# Small drive link from the pivot up to the central boss (with hex adjusters)
link       = bar_x((-14.0, 56.0), (-3.0, 96.0), -60.0, 10.0, 8.0)
link_nut_a = hex_prism_x(16.0, 8.0, -60.0, -14.0, 56.0)
link_nut_b = hex_prism_x(16.0, 8.0, -60.0, -3.0, 96.0)

# ------------------------------ assembly -----------------------------------
components = [
    ring_gear, rim_front, rim_back, sun,
    *planet_gears, *carrier_items,
    shaft, boss, collar, nut,
    cheek, base, foot_front, foot_back,
    pivot_boss, long_lever, short_lever,
    grip_long, grip_short, grip_collar_long, grip_collar_short,
    link, link_nut_a, link_nut_b,
]

result = cq.Workplane(obj=cq.Compound.makeCompound(components))