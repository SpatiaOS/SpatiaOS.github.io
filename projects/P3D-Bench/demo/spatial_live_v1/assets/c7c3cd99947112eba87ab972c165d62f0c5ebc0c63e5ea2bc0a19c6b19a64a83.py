import cadquery as cq
import math

# =============================================================================
# Stylized / super-deformed tank (isometric reference)
# Units: mm.  +X forward, +Y left, +Z up.  Ground plane Z = 0.
# =============================================================================

# Hull (rounded pill sitting between the tracks)
hull_length = 58.0
hull_width = 26.0
hull_height = 22.0
hull_center_z = 18.0

# Tracks
track_length = 92.0
track_width = 14.0
track_height = 24.0
track_overlap = 2.5

# Road wheels
wheel_radius = 10.6
wheel_thickness = 6.0

# Turret
turret_radius = 16.5
turret_x = 1.5
turret_z = 37.0

# Main gun
gun_radius = 5.4
gun_length = 22.0
gun_z = 34.5
gun_start_x = turret_x + 11.0

# Derived
track_y = hull_width / 2.0 + track_width / 2.0 - track_overlap
track_z = track_height / 2.0
front_wheel_x = (track_length - track_height) / 2.0
rear_wheel_x = -front_wheel_x
cupola_z = turret_z + turret_radius * 0.55


# -----------------------------------------------------------------------------
# Helpers – keep booleans simple (clean=False) to avoid OCCT refine failures
# -----------------------------------------------------------------------------

def fuse(a, b):
    return a.union(b, clean=False)


def fuse_all(items):
    out = items[0]
    for it in items[1:]:
        out = out.union(it, clean=False)
    return out


def capsule_x(length, width, height):
    """Single-solid stadium (slot) elongated along X, centred on origin."""
    return (
        cq.Workplane("XZ")
        .slot2D(length, height)
        .extrude(width)
        .translate((0.0, -width / 2.0, 0.0))
    )


def box_at(dx, dy, dz, x, y, z):
    return cq.Workplane("XY").box(dx, dy, dz).translate((x, y, z))


def cyl_x(x, y, z, length, r):
    """Cylinder along +X starting at x (negative length goes toward -X)."""
    if length >= 0:
        return cq.Workplane("YZ").circle(r).extrude(length).translate((x, y, z))
    return cq.Workplane("YZ").circle(r).extrude(-length).translate((x + length, y, z))


def cyl_y(x, y, z, length, r):
    """Cylinder along +Y starting at y."""
    if length >= 0:
        return cq.Workplane("XZ").circle(r).extrude(length).translate((x, y, z))
    return cq.Workplane("XZ").circle(r).extrude(-length).translate((x, y + length, z))


def cyl_z(x, y, z, length, r):
    """Cylinder along +Z starting at z."""
    if length >= 0:
        return cq.Workplane("XY").circle(r).extrude(length).translate((x, y, z))
    return cq.Workplane("XY").circle(r).extrude(-length).translate((x, y, z + length))


def ball(x, y, z, r):
    return cq.Workplane("XY").sphere(r).translate((x, y, z))


def make_wheel(x, y_start, z, radius, thickness):
    """Road wheel (tyre + face disc + hub), extruded in +Y from y_start."""
    tire = cq.Workplane("XZ").circle(radius).extrude(thickness)
    disc = cq.Workplane("XZ").circle(radius * 0.70).extrude(thickness + 0.8)
    hub = cq.Workplane("XZ").circle(radius * 0.26).extrude(thickness + 1.6)
    rim = cq.Workplane("XZ").circle(radius * 0.48).extrude(thickness + 0.5)
    wheel = fuse_all([tire, disc, hub, rim])
    return wheel.translate((x, y_start, z))


# =============================================================================
# HULL
# =============================================================================

hull_body = capsule_x(hull_length, hull_width, hull_height).translate(
    (0.0, 0.0, hull_center_z)
)

# Slightly raised upper deck the turret sits on
deck = box_at(
    hull_length * 0.70,
    hull_width * 0.90,
    3.0,
    1.0,
    0.0,
    hull_center_z + hull_height / 2.0 + 0.4,
)

# Side stowage / sponsons
sponson_l = box_at(26.0, 5.5, 10.0, 3.0, hull_width / 2.0 + 0.8, hull_center_z + 1.5)
sponson_r = box_at(26.0, 5.5, 10.0, 3.0, -(hull_width / 2.0 + 0.8), hull_center_z + 1.5)

# Front lower glacis block + tiny hitch
glacis = box_at(7.0, hull_width * 0.62, 7.0, hull_length / 2.0 - 8.0, 0.0, hull_center_z + 3.5)
hitch = box_at(4.0, 7.5, 3.2, hull_length / 2.0 - 1.5, 0.0, hull_center_z - 6.0)

# Rear bustle
bustle = box_at(9.0, hull_width * 0.80, 11.0, -hull_length / 2.0 + 5.5, 0.0, hull_center_z + 1.5)

hull = fuse_all([hull_body, deck, sponson_l, sponson_r, glacis, hitch, bustle])


# =============================================================================
# TRACKS (one side) – capsule body, stepped fenders, wheels, pads, skids
# =============================================================================

def make_track(y_center, side):
    """side: +1 = left (near), -1 = right (far)."""
    parts = []

    body = capsule_x(track_length, track_width, track_height).translate(
        (0.0, y_center, track_z)
    )
    parts.append(body)

    # Top fender plate
    parts.append(
        box_at(
            track_length + 3.0,
            track_width + 3.0,
            2.4,
            0.0,
            y_center + side * 0.5,
            track_height + 0.5,
        )
    )

    # Stepped front mudguard (layered plates from the reference)
    front_layers = [
        (track_length / 2.0 - 3.0, track_height - 1.2, 10.0, 3.8),
        (track_length / 2.0 + 0.8, track_height - 5.4, 8.5, 4.2),
        (track_length / 2.0 + 3.2, track_height - 9.6, 7.0, 4.4),
        (track_length / 2.0 + 4.6, track_height - 13.6, 5.5, 4.2),
    ]
    for dx, dz, sx, sz in front_layers:
        parts.append(
            box_at(sx, track_width + 2.2, sz, dx, y_center + side * 0.35, dz)
        )

    # Stepped rear mudguard + upright end plate
    rear_layers = [
        (-track_length / 2.0 + 3.0, track_height - 1.2, 10.0, 3.8),
        (-track_length / 2.0 - 0.6, track_height - 5.6, 8.0, 4.6),
        (-track_length / 2.0 - 2.4, track_height - 10.2, 6.5, 5.0),
    ]
    for dx, dz, sx, sz in rear_layers:
        parts.append(
            box_at(sx, track_width + 2.2, sz, dx, y_center + side * 0.35, dz)
        )
    # Tall rear end-plate (visible on the far track)
    parts.append(
        box_at(
            2.4,
            track_width + 2.0,
            14.0,
            -track_length / 2.0 - 4.0,
            y_center + side * 0.3,
            track_height - 5.0,
        )
    )

    # Side skirt covering the upper run
    parts.append(
        box_at(
            track_length * 0.40,
            2.0,
            track_height * 0.46,
            -1.5,
            y_center + side * (track_width / 2.0 + 0.3),
            track_z + 3.8,
        )
    )

    # Front / rear road wheels on the outer face
    outer = y_center + side * (track_width / 2.0 + 0.8)
    inner = outer - side * wheel_thickness
    y_start = min(inner, outer)
    parts.append(make_wheel(front_wheel_x, y_start, track_z, wheel_radius, wheel_thickness))
    parts.append(make_wheel(rear_wheel_x, y_start, track_z, wheel_radius, wheel_thickness))

    # Small middle roller, partly under the skirt
    parts.append(
        make_wheel(3.5, y_start + side * 0.4, track_z - 1.2, 6.2, wheel_thickness * 0.75)
    )

    # Bottom grousers / track pads (overlap the capsule so fuse is robust)
    pad_w = track_width + 1.0
    n_pads = 8
    span = track_length - track_height - 8.0
    start = -span / 2.0
    step = span / float(n_pads - 1)
    for i in range(n_pads):
        px = start + i * step
        parts.append(box_at(4.0, pad_w, 2.6, px, y_center, 1.0))

    # A few pads wrapped onto the front rounded end (principal-axis rotations)
    r_pad = track_height / 2.0 + 0.8
    for ang_deg in (-40.0, -10.0, 20.0, 50.0):
        ang = math.radians(ang_deg)
        px = front_wheel_x + math.cos(ang) * r_pad
        pz = track_z + math.sin(ang) * r_pad
        pad = (
            box_at(2.4, pad_w, 4.0, 0.0, 0.0, 0.0)
            .rotate((0, 0, 0), (0, 1, 0), -ang_deg)
            .translate((px, y_center, pz))
        )
        parts.append(pad)

    # Pointed front skid tooth
    tooth = (
        cq.Workplane("XZ")
        .moveTo(0.0, 0.0)
        .lineTo(8.0, 0.0)
        .lineTo(1.8, -6.5)
        .close()
        .extrude(8.0)
        .translate((front_wheel_x + 1.0, y_center - 4.0, 1.4))
    )
    parts.append(tooth)

    # Rear skid block
    parts.append(
        box_at(5.5, 8.0, 3.6, -track_length / 2.0 + 1.5, y_center, 1.5)
    )

    return fuse_all(parts)


tracks = fuse(make_track(track_y, +1), make_track(-track_y, -1))


# =============================================================================
# TURRET – globular body, collar, roof platform, cupola
# =============================================================================

turret_sphere = ball(turret_x, 0.0, turret_z, turret_radius)

collar = (
    cq.Workplane("XY")
    .circle(14.5)
    .extrude(5.5)
    .translate((turret_x, 0.0, hull_center_z + hull_height / 2.0 - 1.5))
)

top_pad = (
    cq.Workplane("XY")
    .circle(10.5)
    .extrude(2.2)
    .translate((turret_x - 0.8, 0.4, cupola_z))
)

# Cupola drum
cupola = (
    cq.Workplane("XY")
    .circle(6.0)
    .extrude(4.0)
    .translate((turret_x - 2.2, 1.8, cupola_z + 1.6))
)
cupola_rim = (
    cq.Workplane("XY")
    .circle(7.0)
    .extrude(1.5)
    .translate((turret_x - 2.2, 1.8, cupola_z + 5.0))
)
hatch = (
    cq.Workplane("XY")
    .circle(4.8)
    .extrude(1.3)
    .translate((turret_x - 2.2, 1.8, cupola_z + 6.2))
)

# Gun mantlet (armoured boss)
mantlet_cyl = cyl_x(turret_x + 7.0, 0.0, gun_z, 9.0, 8.6)
mantlet_ball = ball(turret_x + 12.0, 0.0, gun_z, 8.2)

turret = fuse_all(
    [
        turret_sphere,
        collar,
        top_pad,
        cupola,
        cupola_rim,
        hatch,
        mantlet_cyl,
        mantlet_ball,
    ]
)


# =============================================================================
# MAIN GUN – short fat cartoon barrel with a bored muzzle
# =============================================================================

barrel = cyl_x(gun_start_x, 0.0, gun_z, gun_length, gun_radius)
jacket = cyl_x(gun_start_x, 0.0, gun_z, gun_length * 0.40, gun_radius + 1.5)
muzzle_ring = cyl_x(
    gun_start_x + gun_length - 2.6, 0.0, gun_z, 3.0, gun_radius + 1.8
)
bore = cyl_x(gun_start_x - 1.0, 0.0, gun_z, gun_length + 5.0, gun_radius * 0.55)

gun = fuse_all([barrel, jacket, muzzle_ring]).cut(bore, clean=False)


# Hydraulic / coolant pipes wrapping the barrel (axis-aligned segments + balls)
pipe_r = 1.15
pipe_l = fuse_all(
    [
        ball(turret_x + 7.0, 8.2, gun_z + 2.6, pipe_r),
        cyl_x(turret_x + 7.0, 8.2, gun_z + 2.6, 14.0, pipe_r),
        ball(turret_x + 21.0, 8.2, gun_z + 2.6, pipe_r),
        cyl_z(turret_x + 21.0, 8.2, gun_z + 2.6, -8.5, pipe_r),
        ball(turret_x + 21.0, 8.2, gun_z - 5.9, pipe_r),
        cyl_x(turret_x + 21.0, 8.2, gun_z - 5.9, -10.0, pipe_r),
        ball(turret_x + 11.0, 8.2, gun_z - 5.9, pipe_r),
        cyl_y(turret_x + 11.0, 8.2, gun_z - 5.9, -4.0, pipe_r),
    ]
)
pipe_right = fuse_all(
    [
        ball(turret_x + 7.5, -7.4, gun_z + 1.8, pipe_r),
        cyl_x(turret_x + 7.5, -7.4, gun_z + 1.8, 13.0, pipe_r),
        ball(turret_x + 20.5, -7.4, gun_z + 1.8, pipe_r),
        cyl_z(turret_x + 20.5, -7.4, gun_z + 1.8, -8.0, pipe_r),
        ball(turret_x + 20.5, -7.4, gun_z - 6.2, pipe_r),
        cyl_x(turret_x + 20.5, -7.4, gun_z - 6.2, -9.0, pipe_r),
        ball(turret_x + 11.5, -7.4, gun_z - 6.2, pipe_r),
    ]
)

# S-shaped hose on the front-left hull / fender
hose = fuse_all(
    [
        ball(16.0, 9.0, hull_center_z + 8.0, 1.3),
        cyl_x(16.0, 9.0, hull_center_z + 8.0, 7.0, 1.3),
        ball(23.0, 9.0, hull_center_z + 8.0, 1.3),
        cyl_z(23.0, 9.0, hull_center_z + 8.0, -7.5, 1.3),
        ball(23.0, 9.0, hull_center_z + 0.5, 1.3),
        cyl_x(23.0, 9.0, hull_center_z + 0.5, -8.0, 1.3),
        ball(15.0, 9.0, hull_center_z + 0.5, 1.3),
        cyl_z(15.0, 9.0, hull_center_z + 0.5, 6.0, 1.3),
    ]
)

gun = fuse_all([gun, pipe_l, pipe_right, hose])


# =============================================================================
# TURRET ACCESSORIES
# =============================================================================

acc = []

# --- Commander sight / optic on the cupola, tilted forward-up, with a U-hood
sight_len = 10.0
sight_r = 3.2
sight_body = cyl_z(0.0, 0.0, 0.0, sight_len, sight_r)
sight_lens = cyl_z(0.0, 0.0, sight_len - 0.6, 1.8, 4.2)
hood = fuse_all(
    [
        box_at(7.5, 9.5, 2.0, 0.2, 0.0, sight_len + 1.6),
        box_at(7.5, 2.0, 5.5, 0.2, 4.0, sight_len - 0.6),
        box_at(7.5, 2.0, 5.5, 0.2, -4.0, sight_len - 0.6),
    ]
)
sight = (
    fuse_all([sight_body, sight_lens, hood])
    .rotate((0, 0, 0), (0, 1, 0), 42.0)
    .translate((turret_x - 0.5, 1.8, cupola_z + 6.8))
)
acc.append(sight)

# Mount block under the sight
acc.append(box_at(6.0, 7.0, 4.0, turret_x + 1.5, 1.8, cupola_z + 4.5))

# --- Left-side stacked sensor / spare-wheel discs
for zoff in (0.0, 6.4):
    disc = cyl_y(
        turret_x - 4.5,
        turret_radius - 5.0,
        turret_z + 0.5 + zoff,
        4.0,
        4.0,
    )
    hub = cyl_y(
        turret_x - 4.5,
        turret_radius - 5.0,
        turret_z + 0.5 + zoff,
        4.6,
        1.5,
    )
    acc.extend([disc, hub])

# --- Right-side stowage box with two circular ports
acc.append(
    box_at(9.0, 7.5, 10.0, turret_x + 2.5, -turret_radius + 1.0, turret_z + 1.8)
)
for cz in (2.4, -2.4):
    acc.append(
        cyl_y(
            turret_x + 2.5 + cz * 0.15,
            -turret_radius - 2.6,
            turret_z + 1.8 + cz,
            2.2,
            2.1,
        )
    )
acc.append(
    box_at(6.0, 6.0, 7.0, turret_x - 5.5, -turret_radius + 2.2, turret_z + 0.8)
)

# --- Right-rear rocket / gatling pod on a ball mount
br = 1.05
spread = 2.40
barrel_len = 13.0
pod_bits = [cyl_z(0.0, 0.0, 0.0, barrel_len, br)]
for i in range(6):
    a = i * math.pi / 3.0
    pod_bits.append(
        cyl_z(math.cos(a) * spread, math.sin(a) * spread, 0.0, barrel_len, br)
    )
# Retaining bands as solid discs (overlap the cluster)
pod_bits.append(cyl_z(0.0, 0.0, 3.0, 1.2, spread + br + 0.35))
pod_bits.append(cyl_z(0.0, 0.0, 8.6, 1.2, spread + br + 0.35))
pod_bits.append(cyl_z(0.0, 0.0, barrel_len - 0.7, 0.7, spread + br + 0.2))
pod_bits.append(ball(0.0, 0.0, 0.0, 4.2))
pod = (
    fuse_all(pod_bits)
    .rotate((0, 0, 0), (0, 1, 0), -28.0)
    .rotate((0, 0, 0), (1, 0, 0), 38.0)
    .translate((turret_x - 5.5, -20.0, turret_z + 7.5))
)
acc.append(pod)

# Thin bent snorkel / secondary tube beside the pod
acc.append(
    fuse_all(
        [
            cyl_z(turret_x - 3.5, -16.8, turret_z + 5.5, 12.0, 0.7),
            ball(turret_x - 3.5, -16.8, turret_z + 17.5, 0.7),
            cyl_x(turret_x - 3.5, -16.8, turret_z + 17.5, 5.0, 0.7),
        ]
    )
)

# --- Rear vertical multi-tube launcher (smoke / mortar cluster)
lx, ly, lz = turret_x - 8.0, 4.0, turret_z + 9.5
acc.append(cyl_z(lx, ly, lz, 9.0, 3.6))
for dx, dy in ((-1.4, -1.4), (-1.4, 1.4), (1.4, -1.4), (1.4, 1.4), (0.0, 0.0)):
    acc.append(cyl_z(lx + dx, ly + dy, lz, 11.0, 1.0))
acc.append(cyl_z(lx, ly, lz + 6.0, 1.2, 4.0))

# Two angled rear tubes
mortar = (
    cyl_z(0.0, 0.0, 0.0, 14.0, 1.65)
    .rotate((0, 0, 0), (0, 1, 0), -32.0)
    .rotate((0, 0, 0), (1, 0, 0), 16.0)
    .translate((turret_x - 9.5, -7.5, turret_z + 8.0))
)
acc.append(mortar)
acc.append(
    cyl_z(0.0, 0.0, 0.0, 11.0, 1.3)
    .rotate((0, 0, 0), (0, 1, 0), -24.0)
    .translate((turret_x - 8.5, -3.5, turret_z + 9.0))
)

# --- Antenna with ball tip, slightly raked back, plus a short whip
ant_h = 32.0
ant_ang = -10.0
acc.append(cyl_z(turret_x - 5.5, 1.2, cupola_z + 5.5, 2.6, 1.2))
antenna = (
    cyl_z(0.0, 0.0, 0.0, ant_h, 0.45)
    .rotate((0, 0, 0), (0, 1, 0), ant_ang)
    .translate((turret_x - 5.5, 1.2, cupola_z + 7.5))
)
acc.append(antenna)
tip_x = turret_x - 5.5 + ant_h * math.sin(math.radians(ant_ang))
tip_z = cupola_z + 7.5 + ant_h * math.cos(math.radians(ant_ang))
acc.append(ball(tip_x, 1.2, tip_z, 0.85))
acc.append(
    cyl_z(0.0, 0.0, 0.0, 16.0, 0.35)
    .rotate((0, 0, 0), (0, 1, 0), -16.0)
    .translate((turret_x - 4.5, 2.4, cupola_z + 6.0))
)

# Small periscope blocks on the turret roof
acc.append(box_at(3.0, 2.2, 3.4, turret_x + 4.0, 5.5, cupola_z + 2.2))
acc.append(box_at(3.0, 2.2, 3.4, turret_x + 4.0, -4.5, cupola_z + 2.2))

accessories = fuse_all(acc)


# =============================================================================
# EXTRA HULL GREEBLES
# =============================================================================

locker = box_at(9.5, 4.8, 5.5, 15.0, hull_width / 2.0 + 1.8, hull_center_z + 7.5)
exhaust = box_at(7.5, 11.0, 3.6, -21.0, 0.0, hull_center_z + hull_height / 2.0 + 2.0)
slots = [
    box_at(5.5, 1.3, 1.1, -21.0, gy, hull_center_z + hull_height / 2.0 + 4.0)
    for gy in (-3.2, 0.0, 3.2)
]
lamps = [
    cyl_x(track_length / 2.0 - 12.0, yy, track_height + 1.2, 3.0, 1.8)
    for yy in (track_y, -track_y)
]
extra = fuse_all([locker, exhaust] + slots + lamps)


# =============================================================================
# FINAL ASSEMBLY
# =============================================================================

result = fuse_all([hull, tracks, turret, gun, accessories, extra])