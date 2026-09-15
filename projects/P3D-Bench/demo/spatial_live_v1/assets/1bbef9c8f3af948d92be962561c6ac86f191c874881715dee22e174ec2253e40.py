import cadquery as cq
import math

# =============================================================================
# PARAMETERS
# =============================================================================

# Base Stand Parameters
stand_base_width = 160.0    # Width of triangular base at ground (X)
stand_height = 120.0        # Height from base to central shaft axis (Z)
plate_thickness = 8.0       # Thickness of front and rear stand plates
plate_spacing = 48.0        # Y-distance between front and rear plate
apex_radius = 24.0          # Radius of plate apex around shaft center
tie_bar_size = 14.0         # Size of square tie bars
tie_bar_x = 68.0            # X offset of tie bars from center
tie_bar_z = -105.0          # Z position of tie bars

# Sleeve & Shaft Parameters
sleeve_od = 34.0            # Bearing sleeve outer diameter
sleeve_length = 48.0        # Length sleeve extends forward from front plate
shaft_od = 18.0             # Main central shaft outer diameter
shaft_bore = 10.0           # Inner bore at front of hollow shaft

# Planetary Gear Train Parameters (Module m = 3.5 mm)
# Teeth: Sun = 15, Planet = 18, Ring = 51 (satisfies (51+15)%3 == 0)
n_sun = 15
n_planet = 18
n_ring = 51

gear_width = 20.0           # Face width of sun and planet gears
ring_width = 24.0           # Face width of outer ring gear
ring_od = 220.0             # Outer diameter of ring gear

r_sun_pitch = 26.25
r_sun_tip = 29.0
r_sun_root = 22.8

r_planet_pitch = 31.5
r_planet_tip = 34.3
r_planet_root = 28.0
r_carrier = 57.75           # Center distance from shaft to planet axes

r_ring_pitch = 89.25
r_ring_tip = 86.4           # Internal tooth tip radius
r_ring_root = 92.8          # Internal tooth root radius
r_ring_outer = ring_od / 2.0

planet_angles = [90.0, 210.0, 330.0]  # 3 symmetrically spaced planets

# Crank & Lever Parameters
# Crank 1: Long arm pointing up-left
crank1_angle = 135.0
crank1_length = 165.0
crank1_y = -52.0

# Crank 2: Medium arm pointing nearly vertical
crank2_angle = 82.0
crank2_length = 115.0
crank2_y = -66.0

# Crank 3: Reaction/locking arm pointing down-left
crank3_angle = 198.0
crank3_length = 65.0
crank3_y = -80.0

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def make_gear_pts(r_root, r_tip, n_teeth, rot_angle=0.0):
    """Generates 2D polyline points for a robust trapezoidal gear tooth profile."""
    d_th = 2.0 * math.pi / n_teeth
    pts = []
    for i in range(n_teeth):
        for f, r in [(0.15, r_root), (0.35, r_tip), (0.65, r_tip), (0.85, r_root)]:
            th = (i + f) * d_th + rot_angle
            pts.append((r * math.cos(th), r * math.sin(th)))
    return pts

def make_crank(angle_deg, arm_length, arm_width, arm_thick, y_pos, hub_od, shaft_d, handle_len, handle_d):
    """Creates a crank arm assembly with cylindrical hub, arm, and forward handle."""
    rad = math.radians(angle_deg)
    ux, uz = math.cos(rad), math.sin(rad)
    vx, vz = -math.sin(rad), math.cos(rad)

    hw = arm_width / 2.0
    tip_x = arm_length * ux
    tip_z = arm_length * uz

    # Central hub
    hub = (
        cq.Workplane("XZ", origin=(0, y_pos, 0))
        .circle(hub_od / 2.0)
        .circle(shaft_d / 2.0)
        .extrude(arm_thick)
    )

    # Arm bar
    p1 = (hw * vx, hw * vz)
    p2 = (tip_x + hw * vx, tip_z + hw * vz)
    p3 = (tip_x - hw * vx, tip_z - hw * vz)
    p4 = (-hw * vx, -hw * vz)

    arm = (
        cq.Workplane("XZ", origin=(0, y_pos, 0))
        .polyline([p1, p2, p3, p4])
        .close()
        .extrude(arm_thick)
    )

    # Arm outer boss
    boss = (
        cq.Workplane("XZ", origin=(0, y_pos, 0))
        .center(tip_x, tip_z)
        .circle(arm_width * 0.75)
        .extrude(arm_thick)
    )

    # Crank handle extending forward (-Y)
    handle = (
        cq.Workplane("XZ", origin=(0, y_pos - arm_thick, 0))
        .center(tip_x, tip_z)
        .circle(handle_d / 2.0)
        .extrude(handle_len)
    )

    # Handle end cap
    handle_cap = (
        cq.Workplane("XZ", origin=(0, y_pos - arm_thick - handle_len, 0))
        .center(tip_x, tip_z)
        .circle(handle_d / 2.0 + 0.8)
        .extrude(2.5)
    )

    return hub.union(arm).union(boss).union(handle).union(handle_cap)

# =============================================================================
# 1. BASE STAND & MOUNTING
# =============================================================================

# Triangular A-frame front plate profile
plate_pts = [
    (-stand_base_width / 2.0, -stand_height),
    (-stand_base_width / 2.0, -stand_height + 14.0),
    (-apex_radius, -10.0),
    (-apex_radius, 0.0),
    (apex_radius, 0.0),
    (apex_radius, -10.0),
    (stand_base_width / 2.0, -stand_height + 14.0),
    (stand_base_width / 2.0, -stand_height),
]

front_plate = (
    cq.Workplane("XZ", origin=(0, 0.0, 0))
    .polyline(plate_pts)
    .close()
    .extrude(-plate_thickness)
    .union(
        cq.Workplane("XZ", origin=(0, 0.0, 0))
        .circle(apex_radius)
        .extrude(-plate_thickness)
    )
    .cut(
        cq.Workplane("XZ", origin=(0, -1.0, 0))
        .circle(shaft_od / 2.0 + 2.0)
        .extrude(-plate_thickness - 2.0)
    )
    .cut(
        cq.Workplane("XZ", origin=(0, -1.0, 0))
        .pushPoints([(-tie_bar_x, tie_bar_z), (tie_bar_x, tie_bar_z)])
        .rect(tie_bar_size + 1.0, tie_bar_size + 1.0)
        .extrude(-plate_thickness - 2.0)
    )
)

# Rear plate is parallel, translated along +Y
rear_plate = front_plate.translate((0, plate_spacing, 0))

# Bottom tie bars linking the two plates
tie_bars = (
    cq.Workplane("XZ", origin=(0, -6.0, 0))
    .pushPoints([(-tie_bar_x, tie_bar_z), (tie_bar_x, tie_bar_z)])
    .rect(tie_bar_size, tie_bar_size)
    .extrude(-(plate_spacing + 20.0))
)

# Outer tie bar retention caps
tie_caps = (
    cq.Workplane("XZ", origin=(0, -7.0, 0))
    .pushPoints([(-tie_bar_x, tie_bar_z), (tie_bar_x, tie_bar_z)])
    .rect(tie_bar_size + 5.0, tie_bar_size + 5.0)
    .extrude(-3.0)
).union(
    cq.Workplane("XZ", origin=(0, plate_spacing + 12.0, 0))
    .pushPoints([(-tie_bar_x, tie_bar_z), (tie_bar_x, tie_bar_z)])
    .rect(tie_bar_size + 5.0, tie_bar_size + 5.0)
    .extrude(-3.0)
)

# =============================================================================
# 2. BEARING SLEEVE & CENTRAL SHAFT
# =============================================================================

# Front bearing sleeve
sleeve = (
    cq.Workplane("XZ", origin=(0, 0.0, 0))
    .circle(sleeve_od / 2.0)
    .circle(shaft_od / 2.0 + 1.0)
    .extrude(sleeve_length)
    .union(
        cq.Workplane("XZ", origin=(0, -(sleeve_length - 6.0), 0))
        .circle(sleeve_od / 2.0 + 2.5)
        .circle(shaft_od / 2.0 + 1.0)
        .extrude(6.0)
    )
)

# Top stiffening gusset on sleeve
gusset_pts = [(0.0, 17.0), (0.0, 28.0), (-36.0, 17.0)]
gusset = (
    cq.Workplane("YZ", origin=(0, 0, 0))
    .polyline(gusset_pts)
    .close()
    .extrude(3.0)
    .union(
        cq.Workplane("YZ", origin=(0, 0, 0))
        .polyline(gusset_pts)
        .close()
        .extrude(-3.0)
    )
)

# Oil cup fitting on top of gusset
oil_cup = (
    cq.Workplane("XY", origin=(0, -12.0, 22.0))
    .circle(3.5)
    .extrude(8.0)
    .union(
        cq.Workplane("XY", origin=(0, -12.0, 30.0))
        .circle(4.5)
        .extrude(2.0)
    )
)
sleeve_assembly = sleeve.union(gusset).union(oil_cup)

# Central drive shaft (extends from rear plate through to front cranks)
shaft = (
    cq.Workplane("XZ", origin=(0, -96.0, 0))
    .circle(shaft_od / 2.0)
    .extrude(-(96.0 + plate_spacing + plate_thickness))
    .cut(
        cq.Workplane("XZ", origin=(0, -97.0, 0))
        .circle(shaft_bore / 2.0)
        .extrude(-22.0)
    )
)

# =============================================================================
# 3. GEAR TRAIN (RING, SUN, PLANETS & CARRIER)
# =============================================================================

# Large Internal Ring Gear
pts_ring = make_gear_pts(r_ring_root, r_ring_tip, n_ring)
ring_gear = (
    cq.Workplane("XZ", origin=(0, 18.0, 0))
    .circle(r_ring_outer)
    .extrude(-ring_width)
    .cut(
        cq.Workplane("XZ", origin=(0, 17.0, 0))
        .polyline(pts_ring)
        .close()
        .extrude(-ring_width - 2.0)
    )
    .union(
        cq.Workplane("XZ", origin=(0, 36.0, 0))
        .circle(r_ring_outer + 3.0)
        .circle(r_ring_outer - 8.0)
        .extrude(-6.0)
    )
)

# Central Sun Gear
pts_sun = make_gear_pts(r_sun_root, r_sun_tip, n_sun, rot_angle=0.0)
sun_gear = (
    cq.Workplane("XZ", origin=(0, 20.0, 0))
    .polyline(pts_sun)
    .close()
    .circle(shaft_od / 2.0)
    .extrude(-gear_width)
)

# 3 Planet Gears with cutouts
planet_centers = [
    (r_carrier * math.cos(math.radians(a)), r_carrier * math.sin(math.radians(a)))
    for a in planet_angles
]

planets = []
for idx, (px, pz) in enumerate(planet_centers):
    rot = math.radians(planet_angles[idx] + 10.0)
    pts_p = make_gear_pts(r_planet_root, r_planet_tip, n_planet, rot_angle=rot)

    p_gear = (
        cq.Workplane("XZ", origin=(0, 20.0, 0))
        .center(px, pz)
        .polyline(pts_p)
        .close()
        .circle(6.0)
        .extrude(-gear_width)
    )

    # Lightening cutouts
    cutout_pts = [
        (px + 17.0 * math.cos(math.radians(ha)), pz + 17.0 * math.sin(math.radians(ha)))
        for ha in [0, 90, 180, 270]
    ]
    cutout_solids = (
        cq.Workplane("XZ", origin=(0, 19.0, 0))
        .pushPoints(cutout_pts)
        .circle(4.5)
        .extrude(-gear_width - 2.0)
    )
    planets.append(p_gear.cut(cutout_solids))

# Planet Carrier Front Spider
carrier_front = cq.Workplane("XZ", origin=(0, 16.0, 0)).circle(18.0).extrude(-4.0)
for px, pz in planet_centers:
    arm_angle = math.atan2(pz, px)
    ux, uz = math.cos(arm_angle), math.sin(arm_angle)
    vx, vz = -math.sin(arm_angle), math.cos(arm_angle)
    hw = 7.0
    p1 = (hw * vx, hw * vz)
    p2 = (px + hw * vx, pz + hw * vz)
    p3 = (px - hw * vx, pz - hw * vz)
    p4 = (-hw * vx, -hw * vz)

    arm_solid = (
        cq.Workplane("XZ", origin=(0, 16.0, 0))
        .polyline([p1, p2, p3, p4])
        .close()
        .extrude(-4.0)
    )
    boss_solid = (
        cq.Workplane("XZ", origin=(0, 16.0, 0))
        .center(px, pz)
        .circle(11.0)
        .extrude(-4.0)
    )
    carrier_front = carrier_front.union(arm_solid).union(boss_solid)

carrier_front = (
    carrier_front
    .cut(
        cq.Workplane("XZ", origin=(0, 15.0, 0))
        .circle(shaft_od / 2.0)
        .extrude(-6.0)
    )
    .cut(
        cq.Workplane("XZ", origin=(0, 15.0, 0))
        .pushPoints(planet_centers)
        .circle(6.0)
        .extrude(-6.0)
    )
)

# Rear carrier spider (duplicate translated to rear of gears)
carrier_rear = carrier_front.translate((0, 22.0, 0))

# Planet shafts and retention hardware
planet_pins = (
    cq.Workplane("XZ", origin=(0, 14.0, 0))
    .pushPoints(planet_centers)
    .circle(6.0)
    .extrude(-29.0)
)
pin_heads = (
    cq.Workplane("XZ", origin=(0, 13.0, 0))
    .pushPoints(planet_centers)
    .circle(8.5)
    .extrude(-2.0)
)
pin_nuts = (
    cq.Workplane("XZ", origin=(0, 42.5, 0))
    .pushPoints(planet_centers)
    .polygon(6, 15.0)
    .extrude(-3.0)
)

# Vertical bracket on top carrier arm
top_bracket = (
    cq.Workplane("XZ", origin=(0, 15.0, 0))
    .center(0, 57.75)
    .rect(10.0, 26.0)
    .extrude(-8.0)
)

# =============================================================================
# 4. FRONT CRANKS & CONTROL LEVERS
# =============================================================================

# Crank 1: Long arm pointing up-left (135°)
crank1 = make_crank(
    angle_deg=crank1_angle,
    arm_length=crank1_length,
    arm_width=14.0,
    arm_thick=8.0,
    y_pos=crank1_y,
    hub_od=32.0,
    shaft_d=shaft_od,
    handle_len=36.0,
    handle_d=13.0
)

# Crank 2: Medium arm pointing nearly vertical (82°)
crank2 = make_crank(
    angle_deg=crank2_angle,
    arm_length=crank2_length,
    arm_width=14.0,
    arm_thick=8.0,
    y_pos=crank2_y,
    hub_od=28.0,
    shaft_d=shaft_od,
    handle_len=36.0,
    handle_d=13.0
)
crank2 = crank2.union(
    cq.Workplane("XZ", origin=(0, crank2_y, 0))
    .center(0, 10.0)
    .rect(6.0, 6.0)
    .extrude(8.0)
)

# Crank 3: Clamping/reaction lever pointing down-left (198°)
rad3 = math.radians(crank3_angle)
ux3, uz3 = math.cos(rad3), math.sin(rad3)
vx3, vz3 = -math.sin(rad3), math.cos(rad3)
hw3 = 6.0
tip3_x = crank3_length * ux3
tip3_z = crank3_length * uz3

hub3 = (
    cq.Workplane("XZ", origin=(0, crank3_y, 0))
    .circle(13.0)
    .circle(shaft_od / 2.0)
    .extrude(9.0)
)

arm3_pts = [
    (hw3 * vx3, hw3 * vz3),
    (tip3_x + hw3 * vx3, tip3_z + hw3 * vz3),
    (tip3_x - hw3 * vx3, tip3_z - hw3 * vz3),
    (-hw3 * vx3, -hw3 * vz3)
]
arm3 = (
    cq.Workplane("XZ", origin=(0, crank3_y, 0))
    .polyline(arm3_pts)
    .close()
    .extrude(8.0)
)

boss3 = (
    cq.Workplane("XZ", origin=(0, crank3_y, 0))
    .center(tip3_x, tip3_z)
    .rect(14.0, 14.0)
    .extrude(8.0)
)

lever3_handle = (
    cq.Workplane("XZ", origin=(0, crank3_y - 8.0, 0))
    .center(tip3_x, tip3_z)
    .circle(5.0)
    .extrude(26.0)
    .union(
        cq.Workplane("XZ", origin=(0, crank3_y - 32.0, 0))
        .center(tip3_x, tip3_z)
        .circle(6.5)
        .extrude(4.0)
    )
)
crank3 = hub3.union(arm3).union(boss3).union(lever3_handle)

# =============================================================================
# 5. FINAL ASSEMBLY
# =============================================================================

components = [
    front_plate,
    rear_plate,
    tie_bars,
    tie_caps,
    sleeve_assembly,
    shaft,
    ring_gear,
    sun_gear,
    carrier_front,
    carrier_rear,
    planet_pins,
    pin_heads,
    pin_nuts,
    top_bracket,
    crank1,
    crank2,
    crank3
] + planets

solids = []
for comp in components:
    if hasattr(comp, "vals"):
        solids.extend(comp.vals())
    elif hasattr(comp, "val"):
        solids.append(comp.val())

result = cq.Workplane("XY").newObject([cq.Compound.makeCompound(solids)])