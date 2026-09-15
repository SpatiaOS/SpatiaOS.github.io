# =====================================================================
# Stylized cartoon tank with an egg-shaped turret.
#
# Interpretation of the image:
#   * Boxy hull with a sloped front glacis and a flat top deck
#   * Two rounded track bands with road wheels + hubs on both sides
#   * Flat fender plates over the top of each track
#   * Large egg/dome shaped turret overhanging the hull
#   * Big main gun (mantlet, mid-barrel collar, muzzle collar, bore)
#   * Raised hatch block + small vent block on the turret top
#   * Twin ribbed exhaust pipes and a thin double antenna at the rear
#   * Periscope on the left turret side, small cannon on the right
#   * Multi-barrel gatling gun on the right rear of the turret
#   * Round view ports on turret/hull and a stowage box with ports
#
# The tank faces +X and stands on the Z = 0 ground plane.
# =====================================================================

import cadquery as cq
import math

# ---------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------
# Hull
HULL_LEN     = 64.0     # hull length (X)
HULL_W       = 36.0     # hull width between the tracks (Y)
HULL_BOT_Z   = 6.0      # underside of the hull
HULL_TOP_Z   = 25.0     # top deck
GLACIS_BOT_Z = 13.0     # height where the front slope starts
GLACIS_TOP_X = 23.0     # upper edge of the front slope

# Running gear / tracks
TRACK_Y     = HULL_W / 2 + 5.5    # track centreline offset
TRACK_CX    = 21.0                # x of the track end-arc centres
TRACK_Z     = 10.5                # height of the track loop centre
TRACK_R_OUT = 10.5                # outer radius of track loop
TRACK_R_IN  = 8.0                 # inner radius (band thickness)
WHEEL_R     = 6.75
WHEEL_Z     = 9.25
WHEEL_XS    = [-21.0, -7.0, 7.0, 21.0]
WHEEL_T     = 9.0
HUB_R, HUB_T = 3.0, 11.0
CAP_R, CAP_T = 1.3, 12.4
FENDER_LEN  = 66.0
FENDER_W    = 13.0
FENDER_BOT, FENDER_TOP = 21.0, 25.0

# Turret (egg dome, revolved half profile of (radius, height))
TUR_X      = -2.0
TUR_BASE_Z = HULL_TOP_Z
TUR_H      = 26.5
TUR_PROFILE = [
    (0.0, 0.0), (14.0, 0.5), (20.5, 4.0), (22.0, 10.0),
    (20.5, 17.0), (14.0, 22.5), (5.0, 25.5), (0.0, TUR_H),
]

# Main gun
GUN_MOUNT = (8.0, 0.0, 35.0)
GUN_TILT  = 12.0                  # degrees downwards
MANTLET_R, MANTLET_END = 10.0, 15.0
BARREL_R, BARREL_END   = 6.5, 34.0
COLLAR_R               = 7.5      # mid-barrel collar 22..26
MUZZLE_R, MUZZLE_END   = 8.0, 39.0
BORE_R, BORE_DEPTH     = 4.5, 6.0

# Secondary details
GAT_TILT, GAT_MOUNT         = 33.0, (-2.0, 20.0, 37.5)
CANNON_TILT, CANNON_MOUNT   = 28.0, (13.0, 15.0, 38.0)
SCOPE_TILT, SCOPE_MOUNT     = 35.0, (-13.0, -17.5, 41.0)
PIPE_TILT                   = 8.0
PIPE_X, PIPE_Y, PIPE_BASE_Z = 15.0, 8.5, 44.0
ANT_BASE                    = (-7.0, 3.0, 47.0)


# ---------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------
def tube_x(radius, x0, x1):
    """Solid cylinder along +X from x0 to x1, centred on Y=Z=0."""
    return cq.Workplane("YZ", origin=(x0, 0.0, 0.0)).circle(radius).extrude(x1 - x0)


def tube_z(radius, z0, z1, cx=0.0, cy=0.0):
    """Solid cylinder along +Z from z0 to z1."""
    return cq.Workplane("XY", origin=(cx, cy, z0)).circle(radius).extrude(z1 - z0)


# ---------------------------------------------------------------------
# 1. Hull - pentagon side profile (with sloped front glacis) extruded
# ---------------------------------------------------------------------
hull = (
    cq.Workplane("XZ")
    .polyline([
        (-HULL_LEN / 2, HULL_BOT_Z),
        ( HULL_LEN / 2, HULL_BOT_Z),
        ( HULL_LEN / 2, GLACIS_BOT_Z),
        ( GLACIS_TOP_X, HULL_TOP_Z),
        (-HULL_LEN / 2, HULL_TOP_Z),
    ])
    .close()
    .extrude(HULL_W / 2, both=True)
)

# ---------------------------------------------------------------------
# 2. Tracks: rounded (stadium) band + road wheels with hubs
# ---------------------------------------------------------------------
track_outer = (
    cq.Workplane("XZ")
    .slot2D(2 * TRACK_CX + 2 * TRACK_R_OUT, 2 * TRACK_R_OUT)
    .extrude(5.5, both=True)
    .translate((0, 0, TRACK_Z))
)
track_inner = (
    cq.Workplane("XZ")
    .slot2D(2 * TRACK_CX + 2 * TRACK_R_IN, 2 * TRACK_R_IN)
    .extrude(6.5, both=True)                 # slightly wider for a clean cut
    .translate((0, 0, TRACK_Z))
)
track_band = track_outer.cut(track_inner)


def road_wheel(x):
    """One road wheel: tyre disc + protruding hub + centre cap."""
    wheel = cq.Workplane("XZ", origin=(x, 0, WHEEL_Z)).circle(WHEEL_R).extrude(WHEEL_T / 2, both=True)
    hub   = cq.Workplane("XZ", origin=(x, 0, WHEEL_Z)).circle(HUB_R).extrude(HUB_T / 2, both=True)
    cap   = cq.Workplane("XZ", origin=(x, 0, WHEEL_Z)).circle(CAP_R).extrude(CAP_T / 2, both=True)
    return wheel.union(hub).union(cap)


def running_gear(side):
    """Complete track assembly for one side (+1 right / -1 left)."""
    gear = track_band
    for x in WHEEL_XS:
        gear = gear.union(road_wheel(x))
    return gear.translate((0, side * TRACK_Y, 0))


# Fender plates over the top of each track
fenders = None
for s in (1, -1):
    f = (
        cq.Workplane("XY", origin=(0, s * TRACK_Y, (FENDER_BOT + FENDER_TOP) / 2))
        .box(FENDER_LEN, FENDER_W, FENDER_TOP - FENDER_BOT)
    )
    fenders = f if fenders is None else fenders.union(f)

# ---------------------------------------------------------------------
# 3. Turret: egg shaped dome made by revolving a spline half-profile
# ---------------------------------------------------------------------
turret = (
    cq.Workplane("XZ")
    .spline(TUR_PROFILE)
    .close()
    .revolve(360)
    .translate((TUR_X, 0, TUR_BASE_Z))
)

# Raised commander hatch block (sunk into the dome)
hatch = (
    cq.Workplane("XY", origin=(4.0, 0.0, 45.0))
    .box(20.0, 14.0, 9.0, centered=(True, True, False))
    .edges().chamfer(1.5)
)

# Small vent block behind the hatch
rear_box = (
    cq.Workplane("XY", origin=(-13.0, 0.0, 47.5))
    .box(9.0, 11.0, 6.0, centered=(True, True, False))
    .edges().chamfer(1.0)
)

# ---------------------------------------------------------------------
# 4. Main gun: mantlet + barrel + collar + muzzle, tilted downwards
# ---------------------------------------------------------------------
main_gun = (
    tube_x(MANTLET_R, 0.0, MANTLET_END)
    .union(tube_x(BARREL_R, MANTLET_END, BARREL_END))
    .union(tube_x(COLLAR_R, 22.0, 26.0))
    .union(tube_x(MUZZLE_R, BARREL_END, MUZZLE_END))
    .cut(tube_x(BORE_R, MUZZLE_END - BORE_DEPTH, MUZZLE_END + 2.0))   # muzzle bore
    .rotate((0, 0, 0), (0, 1, 0), GUN_TILT)
    .translate(GUN_MOUNT)
)

# ---------------------------------------------------------------------
# 5. Gatling gun: ball mount, spine, 6 barrels and two stiffening rings
# ---------------------------------------------------------------------
barrel_pts = [
    (3.2 * math.cos(math.radians(a)), 3.2 * math.sin(math.radians(a)))
    for a in range(0, 360, 60)
]
gatling = (
    cq.Workplane("YZ").pushPoints(barrel_pts).circle(1.1).extrude(26.0)
    .union(tube_x(2.0, -4.5, 22.0))
    .union(tube_x(4.6, 0.5, 3.5))
    .union(tube_x(5.0, 21.5, 24.0))
    .union(cq.Workplane("XY").sphere(5.5).translate((-6.0, 0, 0)))
)
# rotate nose-up around the origin, then shift so the ball lands on its mount
gatling = gatling.rotate((0, 0, 0), (0, 1, 0), -GAT_TILT).translate((
    GAT_MOUNT[0] + 6.0 * math.cos(math.radians(GAT_TILT)),
    GAT_MOUNT[1],
    GAT_MOUNT[2] + 6.0 * math.sin(math.radians(GAT_TILT)),
))

# ---------------------------------------------------------------------
# 6. Small cannon on the right of the turret
# ---------------------------------------------------------------------
small_cannon = (
    tube_x(3.2, 0.0, 3.0)
    .union(tube_x(2.6, 3.0, 16.0))
    .union(tube_x(3.4, 13.0, 16.0))
    .rotate((0, 0, 0), (0, 1, 0), -CANNON_TILT)
    .translate(CANNON_MOUNT)
)

# ---------------------------------------------------------------------
# 7. Periscope / sight on the left of the turret
# ---------------------------------------------------------------------
scope = (
    cq.Workplane("XY").sphere(4.3)
    .union(tube_x(3.5, 0.0, 13.0))
    .union(tube_x(4.6, 10.0, 13.5))     # eyepiece ring
    .union(tube_x(3.0, 13.5, 14.5))     # lens
    .rotate((0, 0, 0), (0, 1, 0), -SCOPE_TILT)
    .translate(SCOPE_MOUNT)
)

# ---------------------------------------------------------------------
# 8. Twin ribbed exhaust pipes at the rear of the turret
# ---------------------------------------------------------------------
def exhaust_pipe():
    pipe = (
        tube_z(2.6, 0.0, 15.0)
        .union(tube_z(3.05, 11.0, 12.2))    # rib
        .union(tube_z(3.20, 13.2, 14.6))    # rib
        .union(tube_z(3.40, 15.0, 17.5))    # cap
    )
    return pipe.rotate((0, 0, 0), (0, 1, 0), -PIPE_TILT)


pipes = (
    exhaust_pipe().translate((-PIPE_X,  PIPE_Y, PIPE_BASE_Z))
    .union(exhaust_pipe().translate((-PIPE_X, -PIPE_Y, PIPE_BASE_Z)))
)

# ---------------------------------------------------------------------
# 9. Thin double antenna at the rear
# ---------------------------------------------------------------------
antenna = (
    tube_z(0.45, 0.0, 30.0)
    .union(cq.Workplane("XY").sphere(0.8).translate((0, 0, 30.0)))
    .rotate((0, 0, 0), (0, 1, 0), -20.0)
    .translate(ANT_BASE)
)
antenna2 = (
    tube_z(0.3, 0.0, 18.0)
    .rotate((0, 0, 0), (0, 1, 0), -20.0)
    .rotate((0, 0, 0), (1, 0, 0), -18.0)
    .translate(ANT_BASE)
)

# ---------------------------------------------------------------------
# 10. View ports and stowage box
# ---------------------------------------------------------------------
# two round ports on the left/front of the dome
turret_ports = (
    cq.Workplane("XZ", origin=(6.0, -17.5, 35.0)).circle(3.0).extrude(2.0)
    .union(cq.Workplane("XZ", origin=(4.0, -19.5, 41.0)).circle(3.0).extrude(2.0))
)

# stowage box with two portholes hanging on the right track/hull side
side_box = (
    cq.Workplane("XY", origin=(-14.0, 28.75, 15.0)).box(13.0, 5.5, 8.0)
    .union(cq.Workplane("ZX", origin=(-14.0, 31.5, 13.2)).circle(2.2).extrude(2.2))
    .union(cq.Workplane("ZX", origin=(-14.0, 31.5, 16.8)).circle(2.2).extrude(2.2))
)

# two round ports on the left hull side
hull_ports = (
    cq.Workplane("XZ", origin=(14.0, -17.8, 13.0)).circle(2.4).extrude(2.2)
    .union(cq.Workplane("XZ", origin=(14.0, -17.8, 17.0)).circle(2.4).extrude(2.2))
)

# ---------------------------------------------------------------------
# Final assembly
# ---------------------------------------------------------------------
result = hull
result = result.union(fenders)
result = result.union(running_gear(1)).union(running_gear(-1))
result = result.union(turret)
result = result.union(hatch).union(rear_box)
result = result.union(main_gun)
result = result.union(gatling)
result = result.union(small_cannon)
result = result.union(scope)
result = result.union(pipes)
result = result.union(antenna).union(antenna2)
result = result.union(turret_ports)
result = result.union(side_box)
result = result.union(hull_ports)