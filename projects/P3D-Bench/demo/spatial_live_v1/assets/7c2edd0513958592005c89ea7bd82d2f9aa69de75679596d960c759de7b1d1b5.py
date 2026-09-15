import cadquery as cq
import math

# =====================================================================
#  "Super Vehicle" cartoon battle-tank  (Metal-Slug style)
#  ---------------------------------------------------------------
#  Interpretation of the picture:
#     * low, boxy hull with rounded corners riding on two short,
#       stadium shaped track units with two big road wheels each
#     * stepped / angled armour skirts and corner flare plates
#     * a big squashed dome turret sitting on the hull
#     * a fat main cannon with a wide muzzle
#     * a ball mounted multi-barrel (gatling) gun on the turret flank
#     * a thin secondary barrel + bent tube next to it
#     * a vertical multi-tube launcher and a whip antenna on top
#     * a drum shaped searchlight / periscope on the other flank
#  All dimensions are in millimetres, ground plane is Z = 0.
# =====================================================================

# ---------------------------------------------------------------------
# 1. PARAMETERS
# ---------------------------------------------------------------------
# --- hull ------------------------------------------------------------
hull_len      = 112.0          # front to rear
hull_wid      = 56.0           # between the track units
hull_hgt      = 30.0
hull_z0       = 13.0           # underside of the hull above the ground
hull_top      = hull_z0 + hull_hgt
hull_fil_v    = 9.0            # vertical corner radius
hull_fil_t    = 3.0            # top edge radius

# --- track units -----------------------------------------------------
track_len     = 118.0
track_end_r   = 20.0           # radius of the rounded track ends
track_wid     = 17.0
track_y       = hull_wid / 2.0 + track_wid / 2.0 - 1.5
track_zc      = track_end_r    # centre height -> track touches the ground
wheel_dx      = track_len / 2.0 - track_end_r

# --- road wheels -----------------------------------------------------
wheel_r       = 13.5
wheel_t       = 4.0
wheel_holes   = 5

# --- turret (dome) ---------------------------------------------------
tur_r         = 32.0           # radius at the base
tur_h         = 28.0           # dome height
tur_top_r     = 16.0           # radius of the flat top
tur_z         = hull_top       # dome base height

# --- main gun --------------------------------------------------------
gun_pivot     = (12.0, 0.0, tur_z + 13.0)
gun_pitch     = 7.0            # muzzle slightly down
gun_yaw       = 5.0

# --- gatling gun -----------------------------------------------------
gat_ball      = (16.0, 27.0, tur_z + 7.0)
gat_ball_r    = 10.0
gat_pitch     = 32.0           # up
gat_yaw       = 16.0           # outboard

# --- launcher / antenna ----------------------------------------------
lau_base      = (-6.0, 12.0, tur_z + 20.0)
ant_base      = (-14.0, 4.0, tur_z + 24.0)
ant_len       = 88.0


# ---------------------------------------------------------------------
# 2. SMALL HELPERS
# ---------------------------------------------------------------------
def place(obj, rx=0.0, ry=0.0, rz=0.0, pos=(0.0, 0.0, 0.0)):
    """Rotate a solid about the global origin (X, then Y, then Z) and move it."""
    o = obj
    if rx:
        o = o.rotate((0, 0, 0), (1, 0, 0), rx)
    if ry:
        o = o.rotate((0, 0, 0), (0, 1, 0), ry)
    if rz:
        o = o.rotate((0, 0, 0), (0, 0, 1), rz)
    return o.translate(pos)


def stadium(length, radius, thickness):
    """Extruded 'stadium' (rounded rectangle) lying in the XZ plane.
       Result spans y = -thickness .. 0 and is centred on x = z = 0."""
    half = length / 2.0 - radius
    return (cq.Workplane("XZ")
            .moveTo(-half, -radius)
            .lineTo(half, -radius)
            .threePointArc((half + radius, 0.0), (half, radius))
            .lineTo(-half, radius)
            .threePointArc((-half - radius, 0.0), (-half, -radius))
            .close()
            .extrude(thickness))


def road_wheel():
    """One road wheel, built along +Z (disc, lightening holes, hub, rim)."""
    w = cq.Workplane("XY").circle(wheel_r).extrude(wheel_t)
    # lightening / bolt holes
    holes = (cq.Workplane("XY").workplane(offset=wheel_t + 0.5)
             .polarArray(8.4, 0, 360, wheel_holes)
             .circle(1.9).extrude(-2.6))
    w = w.cut(holes)
    # hub cap
    w = w.union(cq.Workplane("XY").workplane(offset=wheel_t - 0.6)
                .circle(4.8).extrude(3.0))
    # outer rim band
    w = w.union(cq.Workplane("XY").circle(wheel_r)
                .circle(wheel_r - 2.2).extrude(wheel_t + 1.3))
    return w


# ---------------------------------------------------------------------
# 3. HULL
# ---------------------------------------------------------------------
hull = (cq.Workplane("XY")
        .box(hull_len, hull_wid, hull_hgt, centered=(True, True, False))
        .edges("|Z").fillet(hull_fil_v)
        .edges(">Z").fillet(hull_fil_t)
        .translate((0, 0, hull_z0)))

# turret ring / raised deck plate
hull = hull.union(cq.Workplane("XY").circle(30.0).extrude(4.0)
                  .translate((0, 0, hull_top - 1.0)))

# front bumper plate
hull = hull.union(cq.Workplane("XY")
                  .box(8.0, 46.0, 20.0, centered=(True, True, False))
                  .edges("|X").fillet(3.0)
                  .translate((hull_len / 2.0 - 1.0, 0.0, hull_z0 + 2.0)))

# vertical cooling ribs on the front plate
for i in range(5):
    hull = hull.union(cq.Workplane("XY")
                      .box(4.0, 5.0, 13.0, centered=(True, True, False))
                      .translate((hull_len / 2.0 + 2.0, -18.0 + i * 9.0, hull_z0 + 3.0)))

# engine deck louvres (rear)
for i in range(4):
    hull = hull.union(cq.Workplane("XY")
                      .box(4.0, 26.0, 3.0, centered=(True, True, False))
                      .translate((-46.0 + i * 8.0, 0.0, hull_top - 1.0)))

# small front hatch on the glacis deck
hull = hull.union(cq.Workplane("XY")
                  .box(18.0, 14.0, 3.5, centered=(True, True, False))
                  .edges("|Z").fillet(3.0)
                  .translate((36.0, -14.0, hull_top - 1.0)))

# ---------------------------------------------------------------------
# 4. TRACK UNITS + WHEELS
# ---------------------------------------------------------------------
running_gear = cq.Workplane("XY")

for s in (1, -1):
    # main track body
    body = stadium(track_len, track_end_r, track_wid).translate((0, track_wid / 2.0, 0))
    # recessed panels (leaves a rim all around, like in the picture)
    pocket = stadium(track_len - 9.0, track_end_r - 4.5, 3.0)
    body = body.cut(pocket.translate((0, track_wid / 2.0 + 0.5, 0)))
    body = body.cut(pocket.translate((0, -track_wid / 2.0 + 3.0 - 0.5, 0)))

    # road wheels on the outer face
    for dx in (wheel_dx, -wheel_dx):
        wl = road_wheel().rotate((0, 0, 0), (1, 0, 0), -90.0)   # +Z -> +Y
        body = body.union(wl.translate((dx, track_wid / 2.0 - 2.5, 0)))

    running_gear = running_gear.union(
        body.translate((0, 0, 0)).rotate((0, 0, 0), (0, 0, 1), 0)
            .translate((0, 0, track_zc))
            .mirror(mirrorPlane="XZ") if s < 0 else
        body.translate((0, track_y, track_zc)))

# (the mirror branch above needs the same offset -> rebuild it cleanly)
running_gear = cq.Workplane("XY")
for s in (1, -1):
    body = stadium(track_len, track_end_r, track_wid).translate((0, track_wid / 2.0, 0))
    pocket = stadium(track_len - 9.0, track_end_r - 4.5, 3.0)
    body = body.cut(pocket.translate((0, track_wid / 2.0 + 0.5, 0)))
    body = body.cut(pocket.translate((0, -track_wid / 2.0 + 3.0 - 0.5, 0)))
    for dx in (wheel_dx, -wheel_dx):
        wl = road_wheel().rotate((0, 0, 0), (1, 0, 0), -90.0)
        body = body.union(wl.translate((dx, track_wid / 2.0 - 2.5, 0)))
    if s < 0:                                   # mirror for the other side
        body = body.mirror(mirrorPlane="XZ")
    running_gear = running_gear.union(body.translate((0, s * track_y, track_zc)))

# ---------------------------------------------------------------------
# 5. ARMOUR SKIRTS / FENDERS
# ---------------------------------------------------------------------
armour = cq.Workplane("XY")

# three stepped plates per side (the "stair" look above the tracks)
for s in (1, -1):
    for i, xs in enumerate((-40.0, 0.0, 40.0)):
        plate = (cq.Workplane("XY")
                 .box(30.0, 18.0, 4.0)
                 .rotate((0, 0, 0), (1, 0, 0), -28.0 * s)
                 .translate((xs,
                             s * (hull_wid / 2.0 + 6.0),
                             hull_top - 4.0 - 2.5 * abs(i - 1))))
        armour = armour.union(plate)

# pointed corner flare plates
for sx in (1, -1):
    for sy in (1, -1):
        wedge = (cq.Workplane("XY")
                 .box(22.0, 22.0, 5.0)
                 .rotate((0, 0, 0), (0, 0, 1), 45.0)
                 .rotate((0, 0, 0), (1, 0, 0), -22.0 * sy)
                 .translate((sx * (hull_len / 2.0 - 4.0),
                             sy * (hull_wid / 2.0 + 8.0),
                             hull_top - 9.0)))
        armour = armour.union(wedge)

# ---------------------------------------------------------------------
# 6. TURRET DOME + DETAILS
# ---------------------------------------------------------------------
# squashed dome, made by revolving a profile about the Z axis
dome = (cq.Workplane("XZ")
        .moveTo(0, 0)
        .lineTo(tur_r, 0)
        .threePointArc((tur_r + 2.0, tur_h * 0.40), (tur_top_r, tur_h))
        .lineTo(0, tur_h)
        .close()
        .revolve(360.0, (0, 0), (0, 1))
        .translate((0, 0, tur_z)))

turret = dome

# main hatch plate on top
turret = turret.union(cq.Workplane("XY")
                      .box(30.0, 15.0, 4.5, centered=(True, True, False))
                      .edges("|Z").fillet(3.0)
                      .translate((1.0, -1.0, tur_z + tur_h - 1.5)))
turret = turret.union(cq.Workplane("XY")
                      .box(13.0, 9.0, 3.0, centered=(True, True, False))
                      .edges("|Z").fillet(2.0)
                      .translate((13.0, 0.0, tur_z + tur_h + 2.0)))

# side equipment box with two round ports
box_pos = (8.0, tur_r * 0.78, tur_z + 10.0)
side_box = (cq.Workplane("XY").box(18.0, 16.0, 22.0)
            .edges("|Z").fillet(2.5)
            .translate(box_pos))
for dz in (-5.0, 5.0):
    boss = (cq.Workplane("YZ").workplane(offset=box_pos[0] + 8.0)
            .center(box_pos[1], box_pos[2] + dz)
            .circle(3.8).extrude(3.0))
    boss = boss.cut(cq.Workplane("YZ").workplane(offset=box_pos[0] + 9.0)
                    .center(box_pos[1], box_pos[2] + dz)
                    .circle(2.2).extrude(3.0))
    side_box = side_box.union(boss)
turret = turret.union(side_box)

# collar ring around the gun mantlet
turret = turret.union(cq.Workplane("YZ").workplane(offset=6.0)
                      .center(0.0, gun_pivot[2])
                      .circle(15.5).extrude(12.0))

# ---------------------------------------------------------------------
# 7. WEAPONS
# ---------------------------------------------------------------------
weapons = cq.Workplane("XY")

# --- 7a. main cannon (built along +X, then aimed) ---------------------
gun = cq.Workplane("YZ").circle(14.0).extrude(14.0)                       # mantlet
gun = gun.union(cq.Workplane("YZ").workplane(offset=10.0).circle(8.5).extrude(10.0))
gun = gun.union(cq.Workplane("YZ").workplane(offset=18.0).circle(6.5).extrude(40.0))
gun = gun.union(cq.Workplane("YZ").workplane(offset=55.0).circle(9.2).extrude(11.0))
gun = gun.cut(cq.Workplane("YZ").workplane(offset=54.0).circle(6.2).extrude(13.0))
weapons = weapons.union(place(gun, ry=gun_pitch, rz=gun_yaw, pos=gun_pivot))

# --- 7b. ball mounted gatling gun -------------------------------------
gat = cq.Workplane("YZ").circle(8.0).extrude(16.0)                        # breech
gat = gat.union(cq.Workplane("YZ").workplane(offset=14.0).circle(6.2).extrude(4.0))
for i in range(6):                                                        # 6 outer barrels
    a = math.radians(60.0 * i + 30.0)
    gat = gat.union(cq.Workplane("YZ").workplane(offset=12.0)
                    .center(4.8 * math.cos(a), 4.8 * math.sin(a))
                    .circle(2.2).extrude(30.0))
gat = gat.union(cq.Workplane("YZ").workplane(offset=12.0)                 # centre barrel
                .circle(2.2).extrude(30.0))
gat = gat.union(cq.Workplane("YZ").workplane(offset=28.0)                 # clamp band
                .circle(8.2).circle(6.4).extrude(3.5))
weapons = weapons.union(cq.Workplane("XY").sphere(gat_ball_r).translate(gat_ball))
weapons = weapons.union(place(gat, ry=-gat_pitch, rz=gat_yaw, pos=gat_ball))

# --- 7c. thin secondary barrel ----------------------------------------
mg = cq.Workplane("YZ").circle(4.0).extrude(8.0)
mg = mg.union(cq.Workplane("YZ").workplane(offset=6.0).circle(2.4).extrude(28.0))
mg = mg.union(cq.Workplane("YZ").workplane(offset=30.0).circle(3.2).extrude(4.0))
weapons = weapons.union(place(mg, ry=-48.0, rz=8.0, pos=(26.0, 14.0, tur_z + 8.0)))

# --- 7d. bent hook shaped tube ----------------------------------------
hook = cq.Workplane("XY").circle(1.7).extrude(22.0)
hook = hook.union(cq.Workplane("XY").sphere(1.9).translate((0, 0, 22.0)))
hook = hook.union(place(cq.Workplane("YZ").circle(1.7).extrude(12.0),
                        ry=55.0, pos=(0, 0, 22.0)))
weapons = weapons.union(hook.translate((32.0, 20.0, hull_top + 2.0)))

# --- 7e. vertical multi-tube launcher ---------------------------------
lau = cq.Workplane("XY").circle(6.0).extrude(40.0)
lau = lau.union(cq.Workplane("XY").workplane(offset=5.0).circle(7.2).extrude(4.0))
lau = lau.union(cq.Workplane("XY").workplane(offset=33.0).circle(7.2).extrude(4.0))
tubes = (cq.Workplane("XY").workplane(offset=40.0)
         .polarArray(3.4, 0, 360, 6).circle(1.35).extrude(-8.0))
tubes = tubes.union(cq.Workplane("XY").workplane(offset=40.0)
                    .circle(1.35).extrude(-8.0))
lau = lau.cut(tubes)
weapons = weapons.union(place(lau, rx=-8.0, ry=14.0, pos=lau_base))

# --- 7f. whip antenna --------------------------------------------------
ant = cq.Workplane("XY").circle(0.85).extrude(ant_len)
ant = ant.union(cq.Workplane("XY").sphere(1.8).translate((0, 0, ant_len)))
ant = ant.union(cq.Workplane("XY").circle(2.6).extrude(6.0))              # base insulator
weapons = weapons.union(place(ant, rx=-6.0, ry=16.0, pos=ant_base))

# --- 7g. drum shaped searchlight / periscope --------------------------
drum = cq.Workplane("YZ").circle(8.5).extrude(20.0)
drum = drum.cut(cq.Workplane("YZ").workplane(offset=16.0).circle(6.6).extrude(6.0))
drum = drum.union(cq.Workplane("YZ").circle(9.5).circle(8.4).extrude(3.0))
mount = cq.Workplane("XY").box(8.0, 5.0, 16.0, centered=(True, True, False))
weapons = weapons.union(place(drum, ry=-18.0, rz=-28.0, pos=(6.0, -19.0, tur_z + 18.0)))
weapons = weapons.union(mount.translate((4.0, -17.0, tur_z + 6.0)))

# --- 7h. small hull machine gun ---------------------------------------
hmg = cq.Workplane("YZ").circle(4.5).extrude(6.0)
hmg = hmg.union(cq.Workplane("YZ").workplane(offset=4.0).circle(2.8).extrude(18.0))
weapons = weapons.union(place(hmg, ry=18.0, rz=22.0, pos=(40.0, 6.0, hull_top + 1.0)))

# ---------------------------------------------------------------------
# 8. FINAL ASSEMBLY
# ---------------------------------------------------------------------
result = (hull
          .union(running_gear)
          .union(armour)
          .union(turret)
          .union(weapons))