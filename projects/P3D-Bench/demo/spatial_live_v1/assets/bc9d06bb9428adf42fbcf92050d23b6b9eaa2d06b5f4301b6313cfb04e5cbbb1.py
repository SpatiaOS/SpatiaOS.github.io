import cadquery as cq
import math

# =============================================================================
# Pan-tilt turret with cylindrical payload
# Interpreted from the isometric: a heavy equipment base with an interface
# block, an azimuth turntable, an elevation pivot with bearing caps / hex
# shaft, a framed support arm + thin strut, and a stepped cylindrical
# payload (collars, hex packing nut, nozzle) with twin rear bosses.
# Units: millimetres
# =============================================================================

# --- Base plate ---
BASE_L = 96.0
BASE_W = 78.0
BASE_H = 16.0
BASE_CX = -10.0          # plate centre vs turntable axis
BASE_CORNER_R = 4.0

# --- Front interface / control housing ---
FH_X, FH_Y = -42.0, -14.0
FH_L, FH_W, FH_H = 36.0, 34.0, 17.0

# --- Turntable ---
PAD_R, PAD_H = 27.0, 3.5
FLANGE_R, FLANGE_H = 25.0, 6.0

# --- Elevation pivot ---
PIVOT_Z = 42.0
PIVOT_R = 18.0
PIVOT_Y0 = -22.0
PIVOT_LEN = 44.0
CAP_R = 20.0
SHAFT_HEX = 9.0
NUT_HEX = 14.0

# --- Payload pose ---
CLAMP_X = 6.0
CLAMP_Z = 72.0
TILT = 18.0              # elevation, deg (front / nozzle up)
YAW = 24.0               # azimuth of the whole turret, deg

# --- Cylinder ---
CYL_R = 8.0


# -----------------------------------------------------------------------------
# Helpers – always start from XY so offsets are world coordinates
# -----------------------------------------------------------------------------
def union_all(parts):
    acc = parts[0]
    for p in parts[1:]:
        acc = acc.union(p)
    return acc


def cut_all(solid, cutters):
    for c in cutters:
        solid = solid.cut(c)
    return solid


def cyl_z(r, h, x, y, z):
    """Cylinder along +Z starting at (x, y, z)."""
    return cq.Workplane("XY").transformed(offset=(x, y, z)).circle(r).extrude(h)


def cyl_x(r, h, x, y, z):
    """Cylinder along +X starting at (x, y, z)."""
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .transformed(rotate=(0, 90, 0))
        .circle(r)
        .extrude(h)
    )


def cyl_y(r, h, x, y, z):
    """Cylinder along +Y starting at (x, y, z)."""
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .transformed(rotate=(-90, 0, 0))
        .circle(r)
        .extrude(h)
    )


def hex_x(d, h, x, y, z):
    """Hex prism along +X (d = circumscribed diameter)."""
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .transformed(rotate=(0, 90, 0))
        .polygon(6, d)
        .extrude(h)
    )


def hex_y(d, h, x, y, z):
    """Hex prism along +Y."""
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .transformed(rotate=(-90, 0, 0))
        .polygon(6, d)
        .extrude(h)
    )


def box_at(sx, sy, sz, x, y, z, centered=(True, True, True)):
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .box(sx, sy, sz, centered=centered)
    )


def ring_z(od, id_, h, x, y, z):
    return (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .circle(od / 2.0)
        .circle(id_ / 2.0)
        .extrude(h)
    )


# =============================================================================
# BASE  – stepped equipment plate, interface block, mounting ears
# =============================================================================
# Main plate, shifted so the turntable axis sits at world XY origin.
plate = (
    box_at(BASE_L, BASE_W, BASE_H, BASE_CX, 0.0, 0.0, centered=(True, True, False))
    .edges("|Z")
    .fillet(BASE_CORNER_R)
)

# Notch the front-left corner of the plate (stepped outline in the image).
plate = plate.cut(
    box_at(22.0, 18.0, 10.0, -50.0, -34.0, 0.0, centered=(True, True, False))
)

# Raised interface / electronics housing on the front-left.
iface = box_at(
    FH_L, FH_W, FH_H, FH_X, FH_Y, BASE_H, centered=(True, True, False)
).edges("|Z").fillet(2.0)

# Recessed panel on the front face of the housing.
iface = iface.cut(box_at(5.0, 20.0, 9.0, FH_X - FH_L / 2.0, FH_Y + 1.0, BASE_H + 11.0))

# Two indicator / fastener bosses on the lower front of the housing.
btn1 = cyl_x(1.8, 4.0, FH_X - FH_L / 2.0 - 1.2, FH_Y + 8.0, 6.5)
btn2 = cyl_x(1.8, 4.0, FH_X - FH_L / 2.0 - 1.2, FH_Y + 2.5, 6.5)

# Shallow connector block with a slot, on the front of the plate.
connector = box_at(8.0, 16.0, 9.0, -52.0, 2.0, 5.5)
connector = connector.cut(box_at(10.0, 9.0, 3.5, -53.0, 2.0, 6.5))

# Front-right mounting ear (two through-holes visible on the front face).
front_ear = box_at(8.0, 20.0, 16.0, -50.0, 20.0, 8.0)

# Small 2-hole hinge plate on the near-right of the housing.
hinge = box_at(6.0, 8.0, 14.0, -46.0, 8.0, 8.0)

# Right-side tab with a vertical hole.
right_tab = box_at(22.0, 14.0, 10.0, 6.0, 44.0, 5.0)

# Far-right ear.
far_ear = box_at(12.0, 10.0, 8.0, 28.0, 30.0, 10.0)

# Circular pad that the turret rotates on.
pad = cyl_z(PAD_R, PAD_H + 0.6, 0.0, 0.0, BASE_H - 0.3)

base = union_all(
    [plate, iface, btn1, btn2, connector, front_ear, hinge, right_tab, far_ear, pad]
)

# Through-holes in the mounting ears.
base = cut_all(
    base,
    [
        cyl_x(1.9, 16.0, -56.0, 14.5, 8.0),   # front ear
        cyl_x(1.9, 16.0, -56.0, 25.5, 8.0),
        cyl_x(1.6, 14.0, -52.0, 8.0, 5.5),    # hinge plate
        cyl_x(1.6, 14.0, -52.0, 8.0, 11.5),
        cyl_z(2.6, 22.0, 6.0, 44.0, -1.0),    # right tab (vertical)
        cyl_z(2.4, 20.0, 28.0, 30.0, 4.0),    # far ear
    ],
)


# =============================================================================
# TURRET BODY  – azimuth flange, cast housing, elevation bearing, hex shaft
# =============================================================================
flange_z = BASE_H + PAD_H - 0.4
flange = cyl_z(FLANGE_R, FLANGE_H + 0.5, 0.0, 0.0, flange_z)
# Light groove on the flange (bearing-race suggestion).
flange = flange.cut(ring_z(46.0, 38.0, 1.8, 0.0, 0.0, flange_z + FLANGE_H - 1.2))

# Lower cast housing sitting on the flange (bulked-up T around the pivot).
neck = cyl_z(18.0, 22.0, 0.0, 0.0, flange_z + FLANGE_H - 1.0)
bulk = box_at(30.0, 34.0, 22.0, 2.0, 0.0, flange_z + FLANGE_H + 10.0)
# Sloped front face matching the faceted casting in the image.
slope = (
    cq.Workplane("XY")
    .transformed(offset=(-20.0, 0.0, flange_z + FLANGE_H + 8.0))
    .transformed(rotate=(0, 38, 0))
    .box(32.0, 50.0, 18.0)
)
bulk = bulk.cut(slope)

# Horizontal elevation housing (bearing tube).
pivot = cyl_y(PIVOT_R, PIVOT_LEN, 0.0, PIVOT_Y0, PIVOT_Z)

# Right-hand bearing cap with rim, recess and hub.
cap = cyl_y(CAP_R, 6.5, 0.0, PIVOT_Y0 + PIVOT_LEN - 4.0, PIVOT_Z)
cap = cap.cut(cyl_y(14.5, 3.2, 0.0, PIVOT_Y0 + PIVOT_LEN + 0.8, PIVOT_Z))
hub = cyl_y(8.0, 6.0, 0.0, PIVOT_Y0 + PIVOT_LEN - 2.0, PIVOT_Z)
rim = cyl_y(17.5, 2.0, 0.0, PIVOT_Y0 + PIVOT_LEN + 1.8, PIVOT_Z)

# Left-hand smaller cap.
left_cap = cyl_y(15.0, 5.5, 0.0, PIVOT_Y0 - 3.5, PIVOT_Z)

# Boxy motor / gearbox protrusion on the left of the housing.
motor = box_at(14.0, 18.0, 15.0, -17.0, -10.0, PIVOT_Z - 1.0)
motor_boss = cyl_y(6.5, 8.0, -17.0, -20.0, PIVOT_Z)

# Hexagonal elevation shaft through the housing, nut on the right end.
shaft = hex_y(SHAFT_HEX, 56.0, 0.0, PIVOT_Y0 - 2.0, PIVOT_Z)
washer = cyl_y(7.5, 2.2, 0.0, PIVOT_Y0 + PIVOT_LEN + 3.5, PIVOT_Z)
nut = hex_y(NUT_HEX, 5.0, 0.0, PIVOT_Y0 + PIVOT_LEN + 5.2, PIVOT_Z)

turret_body = union_all(
    [
        flange,
        neck,
        bulk,
        pivot,
        cap,
        hub,
        rim,
        left_cap,
        motor,
        motor_boss,
        shaft,
        washer,
        nut,
    ]
)


# =============================================================================
# SUPPORT ARMS  – thick framed plate (with window) + thin diagonal strut
# =============================================================================
# Thick arm on the −Y side: a deep plate spanning housing to clamp, with a
# large opening like the triangular window in the image.
arm_thick = box_at(40.0, 11.0, 50.0, -3.0, -17.0, 47.0)
arm_thick = arm_thick.cut(box_at(18.0, 14.0, 22.0, -5.0, -17.0, 50.0))
# Angled front edge (A-frame silhouette).
arm_thick = arm_thick.cut(
    cq.Workplane("XY")
    .transformed(offset=(-24.0, -17.0, 28.0))
    .transformed(rotate=(0, 36, 0))
    .box(40.0, 16.0, 32.0)
)
# Slight elevation lean toward the clamp.
arm_thick = arm_thick.rotate((0, 0, PIVOT_Z), (0, 1, PIVOT_Z), 8)

# Thin strut on the +Y side, running from the bearing cap up to the clamp.
arm_angle = math.degrees(math.atan2(CLAMP_X, CLAMP_Z - PIVOT_Z))
strut_len = math.hypot(CLAMP_X, CLAMP_Z - PIVOT_Z) + 10.0
arm_thin = (
    cq.Workplane("XY")
    .transformed(offset=(1.0, 16.5, PIVOT_Z + 4.0))
    .transformed(rotate=(0, arm_angle, 0))
    .box(6.0, 4.5, strut_len, centered=(True, True, False))
)

arms = arm_thick.union(arm_thin)


# =============================================================================
# PAYLOAD  – clamp + stepped cylinder (local: origin at clamp, nozzle at −X)
# =============================================================================
# Clamp block around the barrel (chunky mount at the top of the arms).
clamp = box_at(24.0, 32.0, 20.0, 1.0, 0.0, 2.0)
clamp_top = box_at(16.0, 20.0, 10.0, -2.0, 0.0, 13.0)
clamp_rear = box_at(12.0, 22.0, 14.0, 10.0, 0.0, 4.0)

# Twin rear bosses sitting on the clamp (two short cylinders in the image).
pin_block = box_at(10.0, 16.0, 8.0, 10.0, 0.0, 12.0)
pin1 = cyl_x(2.8, 12.0, 8.0, 5.0, 12.0)
pin2 = cyl_x(2.8, 12.0, 8.0, -5.0, 12.0)

# Stepped barrel, front (nozzle) toward local −X, rear toward +X.
# Segments overlap slightly so the union is robust.
muzzle = cyl_x(3.0, 4.2, -82.0, 0.0, 0.0)
muzzle_ring = cyl_x(4.6, 2.6, -78.6, 0.0, 0.0)
pack_nut = hex_x(11.0, 5.2, -76.2, 0.0, 0.0)
neck1 = cyl_x(5.5, 6.2, -72.0, 0.0, 0.0)
bell = cyl_x(10.0, 5.2, -67.2, 0.0, 0.0)
neck2 = cyl_x(6.6, 6.2, -63.2, 0.0, 0.0)
collar_f = cyl_x(10.6, 6.2, -58.2, 0.0, 0.0)
barrel = cyl_x(CYL_R, 56.0, -54.0, 0.0, 0.0)
collar_r = cyl_x(10.2, 6.0, 10.0, 0.0, 0.0)

payload = union_all(
    [
        clamp,
        clamp_top,
        clamp_rear,
        pin_block,
        pin1,
        pin2,
        muzzle,
        muzzle_ring,
        pack_nut,
        neck1,
        bell,
        neck2,
        collar_f,
        barrel,
        collar_r,
    ]
)

# Bore through the nozzle / packing nut (hollow muzzle).
payload = payload.cut(cyl_x(1.35, 16.0, -83.0, 0.0, 0.0))

# Place the payload: +Y rotation lifts the −X (nozzle) side, then move to clamp.
payload = payload.rotate((0, 0, 0), (0, 1, 0), TILT).translate((CLAMP_X, 0.0, CLAMP_Z))


# =============================================================================
# ASSEMBLY
# =============================================================================
turret = union_all([turret_body, arms, payload])
# Azimuth rotation about the turntable axis (matches the posed angle in the image).
turret = turret.rotate((0, 0, 0), (0, 0, 1), YAW)

result = base.union(turret)