import math
import cadquery as cq

# =====================================================================
#  Cartoon battle tank - parametric CadQuery model
#  Coordinate system:  +X = forward (main gun), +Z = up, ground at Z = 0
#  All dimensions in mm, proportions estimated from the reference image.
# =====================================================================

# ---------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------
# --- lower hull -------------------------------------------------------
hull_length = 105.0
hull_width = 62.0
hull_height = 26.0
hull_bottom_z = 12.0
hull_top_z = hull_bottom_z + hull_height            # 38
hull_corner_r = 6.0
glacis_len = 25.0        # horizontal run of the sloped front plate
glacis_drop = 12.0       # vertical drop of the sloped front plate

# --- tracks / running gear -------------------------------------------
track_length = 96.0
track_height = 30.0
track_width = 26.0
track_inner_y = 28.0
track_outer_y = track_inner_y + track_width         # 54

wheel_radius = 13.0
wheel_width = 20.0
wheel_center_z = 13.0
wheel_outer_y = track_outer_y + 2.0                 # 56
wheel_pos_x = [-33.0, -11.0, 11.0, 33.0]

hub_radius = 6.5
hub_out = 3.5
bolt_radius = 1.2
bolt_out = 1.5
bolt_pitch_r = 9.0
bolt_count = 5

fender_length = track_length + 12.0
fender_width = track_width + 8.0
fender_thick = 4.0
fender_ctr_y = 0.5 * (track_inner_y + track_outer_y)

# --- front blade / bumper --------------------------------------------
plate_thick = 8.0
plate_width = 2.0 * track_outer_y + 4.0             # 112
plate_height = 26.0
plate_ctr_z = 21.0
plate_x_min = 49.0
plate_x_max = plate_x_min + plate_thick             # 57

bumper_r = 7.0
bumper_len = 6.0
bumper_y = 16.0

tooth_count = 5
tooth_d = 12.0           # depth  (X)
tooth_w = 9.0            # width  (Y)
tooth_h = 8.0            # height (Z)
tooth_z = 6.0
tooth_y_spacing = 16.0

lug_radius = 5.0
lug_length = 13.0
lug_y = 18.0
lug_x = 34.0
lug_z = hull_top_z - 6.0                            # 32

# --- turret -----------------------------------------------------------
dome_radius = 32.0
dome_base_z = hull_top_z - 2.0                      # 36
ring_radius = 34.0
ring_height = 6.0
ring_z_min = 34.0

# --- main gun ---------------------------------------------------------
gun_z = 44.0
gun_radius = 7.5
gun_bore_r = 6.0
gun_x_base = 10.0
barrel_length = 48.0
mantlet_r = 11.0
mantlet_x = gun_x_base + 18.0
band_radius = 9.0
band_x = gun_x_base + 30.0
band_len = 3.0
bell_length = 8.0
bell_radius = 13.0
muzzle_length = 4.0
bore_x = gun_x_base + 30.0
bore_len = 35.0

# --- commander cupola -------------------------------------------------
cupola_x = 6.0
cupola_radius = 11.0
cupola_base_z = 62.0
hatch_radius = 7.0
hatch_height = 2.5

# --- ribbed canister on the turret roof -------------------------------
can_x, can_y = -12.0, -10.0
can_radius = 7.0
can_height = 22.0
can_base_z = 60.0
can_rib_r = 1.2
can_rib_count = 6

# --- antenna whip ------------------------------------------------------
ant_x, ant_y = -8.0, 6.0
ant_base_z = 60.0
ant_base_h = 10.0
ant_base_r = 3.0
ant_rod_r = 0.9
ant_rod_len = 85.0
ant_tilt = -14.0                                    # about +Y, leans back

# --- turret side stowage boxes ----------------------------------------
box_size = (22.0, 14.0, 18.0)                       # x, y, z
box1_ctr = (10.0, -26.0, 50.0)
box2_ctr = (-14.0, -26.0, 48.0)
box_fillet = 2.0
boss_radius = 5.5
boss_length = 5.0

# --- gatling gun (rear right of the turret) ---------------------------
gat_length = 26.0
gat_radius = 7.0
gat_barrel_r = 2.2
gat_barrel_len = 30.0
gat_pitch = 4.6
gat_count = 6
gat_mount = (-13.0, 20.0, 52.0)
gat_tilt_x = -35.0
gat_tilt_z = 25.0

# --- small secondary gun ----------------------------------------------
sg_radius = 3.5
sg_length = 26.0
sg_flare_r = 5.5
sg_flare_len = 6.0
sg_mount = (-20.0, 12.0, 50.0)
sg_tilt_x = -30.0
sg_tilt_z = 45.0

# --- thin machine gun barrel ------------------------------------------
mg_radius = 1.4
mg_length = 34.0
mg_mount = (-16.0, 14.0, 52.0)
mg_tilt_x = -35.0
mg_tilt_z = 30.0

# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------
# CadQuery extrudes along the normal of the sketch plane.  The exact
# orientation of the "XZ"/"YZ" workplanes depends on the version, so the
# extrusion directions are probed once here.  Every side part is then
# positioned with an explicit coordinate interval, which is unambiguous.
_probe_xz = cq.Workplane("XZ").circle(1.0).extrude(4.0)
_xz_sign = 1.0 if _probe_xz.val().BoundingBox().ymax > 0.0 else -1.0

_probe_yz = cq.Workplane("YZ").circle(1.0).extrude(4.0)
_yz_sign = 1.0 if _probe_yz.val().BoundingBox().xmax > 0.0 else -1.0


def place_across(shape, width, y_min):
    """Shift a solid extruded `width` off the XZ plane so that it spans
    exactly the Y interval [y_min, y_min + width]."""
    extruded_min = min(0.0, _xz_sign * width)
    return shape.translate((0.0, y_min - extruded_min, 0.0))


def cyl_along_x(radius, length, x_start, y, z):
    """Cylinder whose axis is parallel to +X, spanning [x_start, x_start+length]."""
    shape = cq.Workplane("YZ").circle(radius).extrude(length)
    if _yz_sign < 0.0:
        shape = shape.translate((x_start + length, y, z))
    else:
        shape = shape.translate((x_start, y, z))
    return shape


def track_profile(length, height):
    """2D 'stadium' outline (track silhouette), centred on the origin."""
    r = height * 0.5
    straight = (length - height) * 0.5
    return (
        cq.Workplane("XZ")
        .moveTo(-straight, r)
        .lineTo(straight, r)
        .threePointArc((straight + r, 0.0), (straight, -r))
        .lineTo(-straight, -r)
        .threePointArc((-straight - r, 0.0), (-straight, r))
        .close()
    )


def make_dome(radius, base_z, cx=0.0, cy=0.0):
    """Solid hemisphere standing on the horizontal plane z = base_z."""
    ball = cq.Workplane("XY").workplane(offset=base_z).sphere(radius)
    cutter = (
        cq.Workplane("XY")
        .box(6.0 * radius, 6.0 * radius, 2.0 * radius)
        .translate((0.0, 0.0, base_z - radius))
    )
    return ball.cut(cutter).translate((cx, cy, 0.0))


def fuse_all(pieces):
    """Union a list of solids, one boolean at a time."""
    solid = pieces[0]
    for p in pieces[1:]:
        solid = solid.union(p)
    return solid


def make_running_gear(side):
    """One complete track unit: track, road wheels, hubs, bolts, fender.
    side = +1 -> left hand side (Y > 0), side = -1 -> right hand side."""
    s = float(side)
    pieces = []

    # --- track : stadium shaped silhouette extruded sideways ----------
    track = track_profile(track_length, track_height).extrude(track_width)
    y_min = track_inner_y if s > 0 else -track_outer_y
    track = place_across(track, track_width, y_min)
    pieces.append(track.translate((0.0, 0.0, track_height * 0.5)))

    # --- road wheels, hub caps and wheel bolts -------------------------
    wheel_y = (wheel_outer_y - wheel_width) if s > 0 else -wheel_outer_y
    hub_y = (wheel_outer_y - 2.0) if s > 0 else -(wheel_outer_y + hub_out)
    bolt_y = (wheel_outer_y - 2.0) if s > 0 else -(wheel_outer_y + bolt_out)

    for wx in wheel_pos_x:
        wheel = (
            cq.Workplane("XZ")
            .center(wx, wheel_center_z)
            .circle(wheel_radius)
            .extrude(wheel_width)
        )
        pieces.append(place_across(wheel, wheel_width, wheel_y))

        hub = (
            cq.Workplane("XZ")
            .center(wx, wheel_center_z)
            .circle(hub_radius)
            .extrude(hub_out + 2.0)
        )
        pieces.append(place_across(hub, hub_out + 2.0, hub_y))

        for i in range(bolt_count):
            a = 2.0 * math.pi * i / bolt_count
            bolt = (
                cq.Workplane("XZ")
                .center(wx + bolt_pitch_r * math.cos(a),
                        wheel_center_z + bolt_pitch_r * math.sin(a))
                .circle(bolt_radius)
                .extrude(bolt_out + 2.0)
            )
            pieces.append(place_across(bolt, bolt_out + 2.0, bolt_y))

    # --- fender / mud guard above the track ----------------------------
    fender = (
        cq.Workplane("XY")
        .box(fender_length, fender_width, fender_thick)
        .translate((0.0, s * fender_ctr_y,
                    track_height - 1.0 + fender_thick * 0.5))
    )
    pieces.append(fender)

    return fuse_all(pieces)


# ---------------------------------------------------------------------
# 1. Lower hull with the sloped front plate (glacis)
# ---------------------------------------------------------------------
hull = (
    cq.Workplane("XY")
    .box(hull_length, hull_width, hull_height)
    .translate((0.0, 0.0, hull_bottom_z + hull_height * 0.5))
    .edges("|Z")
    .fillet(hull_corner_r)
)

front_x = hull_length * 0.5
glacis_cutter = (
    cq.Workplane("XZ")
    .moveTo(front_x - glacis_len, hull_top_z)
    .lineTo(front_x + 10.0, hull_top_z - glacis_drop
            - 10.0 * (glacis_drop / glacis_len))
    .lineTo(front_x + 10.0, hull_top_z + 12.0)
    .lineTo(front_x - glacis_len, hull_top_z + 12.0)
    .close()
    .extrude(hull_width * 0.75, both=True)
)
hull = hull.cut(glacis_cutter)

# ---------------------------------------------------------------------
# 2. Front blade (bumper plate), round bumpers, teeth row, tow lugs
# ---------------------------------------------------------------------
front_plate = (
    cq.Workplane("XY")
    .box(plate_thick, plate_width, plate_height)
    .translate((plate_x_min + plate_thick * 0.5, 0.0, plate_ctr_z))
)

# two round bumpers bolted onto the face of the blade
bumpers = [
    cyl_along_x(bumper_r, bumper_len, plate_x_max - 2.0,
                sy * bumper_y, plate_ctr_z)
    for sy in (1.0, -1.0)
]

# serrated row of blocks below the blade
teeth = []
for i in range(tooth_count):
    y = (i - (tooth_count - 1) * 0.5) * tooth_y_spacing
    teeth.append(
        cq.Workplane("XY")
        .box(tooth_d, tooth_w, tooth_h)
        .translate((plate_x_max - 1.0 - tooth_d * 0.5, y, tooth_z))
    )

# two tow lugs poking out of the upper glacis
lugs = [
    cyl_along_x(lug_radius, lug_length, lug_x, sy * lug_y, lug_z)
    for sy in (1.0, -1.0)
]

# ---------------------------------------------------------------------
# 3. Running gear (left and right side)
# ---------------------------------------------------------------------
left_gear = make_running_gear(+1)
right_gear = make_running_gear(-1)

# ---------------------------------------------------------------------
# 4. Turret: base ring + big dome
# ---------------------------------------------------------------------
turret_ring = (
    cq.Workplane("XY")
    .circle(ring_radius)
    .extrude(ring_height)
    .translate((0.0, 0.0, ring_z_min))
)
turret_dome = make_dome(dome_radius, dome_base_z)

# ---------------------------------------------------------------------
# 5. Main gun: fat barrel, ball mantlet, ring, trumpet muzzle
# ---------------------------------------------------------------------
gun_barrel = cyl_along_x(gun_radius, barrel_length, gun_x_base, 0.0, gun_z)

gun_mantlet = (
    cq.Workplane("XY").sphere(mantlet_r).translate((mantlet_x, 0.0, gun_z))
)

gun_band = cyl_along_x(band_radius, band_len, band_x, 0.0, gun_z)

# truncate cone (explicit axis) for the flared muzzle
gun_bell = cq.Workplane("XY").add(
    cq.Solid.makeCone(
        gun_radius, bell_radius, bell_length,
        pnt=cq.Vector(gun_x_base + barrel_length, 0.0, gun_z),
        dir=cq.Vector(1.0, 0.0, 0.0),
    )
)

gun_muzzle = cyl_along_x(bell_radius, muzzle_length,
                         gun_x_base + barrel_length + bell_length, 0.0, gun_z)

# bore, cut only through the outer half of the barrel
gun_bore = cyl_along_x(gun_bore_r, bore_len, bore_x, 0.0, gun_z)

main_gun = (
    gun_barrel
    .union(gun_mantlet)
    .union(gun_band)
    .union(gun_bell)
    .union(gun_muzzle)
    .cut(gun_bore)
)

# ---------------------------------------------------------------------
# 6. Commander's cupola + hatch
# ---------------------------------------------------------------------
cupola = make_dome(cupola_radius, cupola_base_z, cupola_x, 0.0)
hatch = (
    cq.Workplane("XY")
    .circle(hatch_radius)
    .extrude(hatch_height)
    .translate((cupola_x, 0.0, cupola_base_z + cupola_radius - 1.0))
)

# ---------------------------------------------------------------------
# 7. Ribbed canister / launcher bank on the turret roof
# ---------------------------------------------------------------------
can_pieces = [
    cq.Workplane("XY")
    .circle(can_radius)
    .extrude(can_height)
    .translate((can_x, can_y, can_base_z))
]

for i in range(can_rib_count):
    a = 2.0 * math.pi * i / can_rib_count + 0.3
    can_pieces.append(
        cq.Workplane("XY")
        .center(can_x + can_radius * math.cos(a),
                can_y + can_radius * math.sin(a))
        .circle(can_rib_r)
        .extrude(can_height - 1.0)
        .translate((0.0, 0.0, can_base_z))
    )

can_pieces.append(
    cq.Workplane("XY")
    .circle(can_radius + 0.8)
    .extrude(2.5)
    .translate((can_x, can_y, can_base_z + can_height - 2.5))
)
canister = fuse_all(can_pieces)

# ---------------------------------------------------------------------
# 8. Antenna: base + long whip
# ---------------------------------------------------------------------
antenna_base = (
    cq.Workplane("XY")
    .circle(ant_base_r)
    .extrude(ant_base_h)
    .translate((ant_x, ant_y, ant_base_z))
)
antenna_rod = (
    cq.Workplane("XY")
    .circle(ant_rod_r)
    .extrude(ant_rod_len)
    .rotate((0, 0, 0), (0, 1, 0), ant_tilt)
    .translate((ant_x, ant_y, ant_base_z + 8.0))
)

# ---------------------------------------------------------------------
# 9. Turret side stowage boxes with round bosses
# ---------------------------------------------------------------------
def stowage_box(center):
    return (
        cq.Workplane("XY")
        .box(*box_size)
        .translate(center)
        .edges("|Z")
        .fillet(box_fillet)
    )


stow_box_1 = stowage_box(box1_ctr)
stow_box_2 = stowage_box(box2_ctr)

boss_1 = place_across(
    cq.Workplane("XZ").center(box1_ctr[0], box1_ctr[2])
    .circle(boss_radius).extrude(boss_length),
    boss_length, box1_ctr[1] - 10.0)
boss_2 = place_across(
    cq.Workplane("XZ").center(box2_ctr[0], box2_ctr[2])
    .circle(boss_radius).extrude(boss_length),
    boss_length, box2_ctr[1] - 10.0)

# ---------------------------------------------------------------------
# 10. Gatling gun (six barrels) on the rear right of the turret
# ---------------------------------------------------------------------
gat_pieces = [
    cq.Workplane("XY").circle(gat_radius).extrude(gat_length),
    cq.Workplane("XY").sphere(gat_radius + 1.0).translate((0.0, 0.0, 3.0)),
]

for i in range(gat_count):
    a = 2.0 * math.pi * i / gat_count
    gat_pieces.append(
        cq.Workplane("XY")
        .center(gat_pitch * math.cos(a), gat_pitch * math.sin(a))
        .circle(gat_barrel_r)
        .extrude(gat_barrel_len)
        .translate((0.0, 0.0, gat_length - 8.0))
    )

gatling = (
    fuse_all(gat_pieces)
    .rotate((0, 0, 0), (1, 0, 0), gat_tilt_x)
    .rotate((0, 0, 0), (0, 0, 1), gat_tilt_z)
    .translate(gat_mount)
)

# ---------------------------------------------------------------------
# 11. Small secondary gun (tube with flared muzzle)
# ---------------------------------------------------------------------
sg_flare = cq.Workplane("XY").add(
    cq.Solid.makeCone(
        sg_radius, sg_flare_r, sg_flare_len,
        pnt=cq.Vector(0.0, 0.0, sg_length - 2.0),
        dir=cq.Vector(0.0, 0.0, 1.0),
    )
)

small_gun = (
    cq.Workplane("XY").circle(sg_radius).extrude(sg_length)
    .union(cq.Workplane("XY").sphere(sg_radius + 1.5).translate((0.0, 0.0, 2.0)))
    .union(sg_flare)
    .rotate((0, 0, 0), (1, 0, 0), sg_tilt_x)
    .rotate((0, 0, 0), (0, 0, 1), sg_tilt_z)
    .translate(sg_mount)
)

# ---------------------------------------------------------------------
# 12. Thin machine gun barrel next to the secondary gun
# ---------------------------------------------------------------------
mg_barrel = (
    cq.Workplane("XY")
    .circle(mg_radius)
    .extrude(mg_length)
    .rotate((0, 0, 0), (1, 0, 0), mg_tilt_x)
    .rotate((0, 0, 0), (0, 0, 1), mg_tilt_z)
    .translate(mg_mount)
)

# ---------------------------------------------------------------------
# 13. Final assembly
# ---------------------------------------------------------------------
result = (
    hull
    .union(front_plate)
    .union(fuse_all(bumpers))
    .union(fuse_all(teeth))
    .union(fuse_all(lugs))
    .union(left_gear)
    .union(right_gear)
    .union(turret_ring)
    .union(turret_dome)
    .union(main_gun)
    .union(cupola)
    .union(hatch)
    .union(canister)
    .union(antenna_base)
    .union(antenna_rod)
    .union(stow_box_1)
    .union(stow_box_2)
    .union(boss_1)
    .union(boss_2)
    .union(gatling)
    .union(small_gun)
    .union(mg_barrel)
)