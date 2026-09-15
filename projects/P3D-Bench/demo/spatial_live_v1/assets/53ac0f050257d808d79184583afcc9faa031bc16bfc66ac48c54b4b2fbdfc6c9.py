import cadquery as cq
import math

# ==============================================================================
# Parameters - Metal Slug SV-001 Inspired Super Vehicle Tank
# ==============================================================================

# Hull Dimensions
hull_width = 46.0           # Central hull width
hull_length = 66.0          # Central hull length
hull_height = 22.0          # Central hull main tub height
hull_z_base = 11.0          # Ground clearance to bottom of hull

# Track and Suspension Dimensions
track_x_offset = 35.0       # Centerline to track center distance
wheel_radius = 16.0         # Main drive/idler wheel radius
wheel_center_z = 18.0       # Wheel axle elevation
wheel_front_y = 26.0        # Front wheel axle Y position
wheel_rear_y = -26.0        # Rear wheel axle Y position
track_width = 18.0          # Width of track core belt
track_pad_width = 21.0      # Width of individual track shoes

# Turret Dimensions
turret_center_y = -2.0      # Turret offset on Y axis
turret_base_z = 36.0        # Elevation of turret ring base
turret_ring_radius = 23.5   # Turret base ring radius
turret_ring_height = 4.0    # Base ring height
turret_dome_radius = 25.0   # Maximum dome radius
turret_dome_top_z = 63.0    # Peak of cast turret dome

# Main Cannon Dimensions
cannon_mantlet_radius = 13.0 # Spherical mantlet radius
cannon_bore_radius = 6.2     # Inner bore radius
cannon_outer_radius = 8.2    # Outer barrel tube radius
cannon_length = 22.0         # Forward projection of barrel
cannon_z = 49.0              # Cannon elevation centerline

# ==============================================================================
# 1. Track Assembly Function (Left & Right Sides)
# ==============================================================================

def make_track_pad(xc, yc, zc, rot_x):
    """Creates a chunky track shoe with a raised grouser tooth."""
    pad_base = (
        cq.Workplane("XY")
        .box(track_pad_width, 5.2, 2.2)
    )
    grouser = (
        cq.Workplane("XY")
        .workplane(offset=1.1)
        .box(track_pad_width, 2.4, 1.6, centered=(True, True, False))
    )
    pad = (
        pad_base.union(grouser)
        .rotate((0, 0, 0), (1, 0, 0), rot_x)
        .translate((xc, yc, zc))
    )
    return pad

def build_track_unit(side_sign):
    """Builds a complete track and wheel assembly for one side (side_sign = ±1)."""
    xc = side_sign * track_x_offset
    half_tw = track_width / 2.0

    # 1.1 Continuous Track Core Belt (Tangential cylinder-box union)
    c_front = (
        cq.Workplane("YZ")
        .workplane(offset=xc - half_tw)
        .moveTo(wheel_front_y, wheel_center_z)
        .circle(wheel_radius)
        .extrude(track_width)
    )
    c_rear = (
        cq.Workplane("YZ")
        .workplane(offset=xc - half_tw)
        .moveTo(wheel_rear_y, wheel_center_z)
        .circle(wheel_radius)
        .extrude(track_width)
    )
    c_mid = (
        cq.Workplane("XY")
        .workplane(offset=wheel_center_z - wheel_radius)
        .moveTo(xc, 0.0)
        .box(track_width, abs(wheel_front_y - wheel_rear_y), 2.0 * wheel_radius, centered=(True, True, False))
    )
    belt = c_front.union(c_rear).union(c_mid)

    # 1.2 Wheels (Front and Rear with detailed rims, hubs, and 5 lug nuts)
    wheels = []
    outer_x = xc + side_sign * half_tw

    for wy in [wheel_front_y, wheel_rear_y]:
        # Outer rim ring
        rim_offset = outer_x if side_sign > 0 else outer_x - 1.8
        rim = (
            cq.Workplane("YZ")
            .workplane(offset=rim_offset)
            .moveTo(wy, wheel_center_z)
            .circle(15.0)
            .circle(11.5)
            .extrude(1.8)
        )
        # Recessed inner dish
        dish_offset = outer_x - 1.2 if side_sign > 0 else outer_x
        dish = (
            cq.Workplane("YZ")
            .workplane(offset=dish_offset)
            .moveTo(wy, wheel_center_z)
            .circle(11.5)
            .extrude(1.2)
        )
        # Center axle hub cap
        hub_offset = outer_x - 0.5 if side_sign > 0 else outer_x - 2.5
        hub = (
            cq.Workplane("YZ")
            .workplane(offset=hub_offset)
            .moveTo(wy, wheel_center_z)
            .circle(3.8)
            .extrude(3.0)
        )
        # Center axle nut
        nut_offset = outer_x + 2.0 if side_sign > 0 else outer_x - 3.5
        nut = (
            cq.Workplane("YZ")
            .workplane(offset=nut_offset)
            .moveTo(wy, wheel_center_z)
            .circle(1.4)
            .extrude(1.5)
        )
        w_combined = rim.union(dish).union(hub).union(nut)

        # 5 Perimeter Lug Bolts
        lug_offset = outer_x + 0.2 if side_sign > 0 else outer_x - 1.6
        for i in range(5):
            ang = math.radians(i * 72.0 + 18.0)
            ly = wy + 7.2 * math.cos(ang)
            lz = wheel_center_z + 7.2 * math.sin(ang)
            lug = (
                cq.Workplane("YZ")
                .workplane(offset=lug_offset)
                .moveTo(ly, lz)
                .circle(0.85)
                .extrude(1.6)
            )
            w_combined = w_combined.union(lug)
        wheels.append(w_combined)

    # 1.3 Track Shoe Pads
    pads = []
    # Top straight run
    for y in [-20.0, -10.0, 0.0, 10.0, 20.0]:
        pads.append(make_track_pad(xc, y, wheel_center_z + wheel_radius + 1.1, 0.0))
    # Bottom straight run
    for y in [-20.0, -10.0, 0.0, 10.0, 20.0]:
        pads.append(make_track_pad(xc, y, wheel_center_z - wheel_radius - 1.1, 180.0))
    # Front curved section
    for phi in [30.0, 60.0, 90.0, 120.0, 150.0]:
        rad = math.radians(phi)
        py = wheel_front_y + (wheel_radius + 1.1) * math.sin(rad)
        pz = wheel_center_z + (wheel_radius + 1.1) * math.cos(rad)
        pads.append(make_track_pad(xc, py, pz, -phi))
    # Rear curved section
    for phi in [30.0, 60.0, 90.0, 120.0, 150.0]:
        rad = math.radians(phi)
        py = wheel_rear_y - (wheel_radius + 1.1) * math.sin(rad)
        pz = wheel_center_z + (wheel_radius + 1.1) * math.cos(rad)
        pads.append(make_track_pad(xc, py, pz, phi))

    # 1.4 Outer Track Armor Bracket / Mudguard
    fender_pts = [
        (-14.0, 35.5),
        (18.0, 35.5),
        (33.0, 26.0),
        (33.0, 23.0),
        (16.0, 33.5),
        (-14.0, 33.5)
    ]
    fender = (
        cq.Workplane("YZ")
        .workplane(offset=xc - 10.0)
        .polyline(fender_pts)
        .close()
        .extrude(20.0)
    )

    # Combine all track unit components
    track_combined = belt
    for w in wheels:
        track_combined = track_combined.union(w)
    for p in pads:
        track_combined = track_combined.union(p)
    track_combined = track_combined.union(fender)

    return track_combined

# Generate Left and Right Tracks
right_track = build_track_unit(+1.0)
left_track = build_track_unit(-1.0)

# ==============================================================================
# 2. Main Central Hull Construction
# ==============================================================================

# 2.1 Central Hull Tub
hull_tub = (
    cq.Workplane("XY")
    .workplane(offset=hull_z_base)
    .box(hull_width, hull_length, hull_height, centered=(True, True, False))
)

# 2.2 Sloped Front Glacis Plate
glacis_pts = [
    (14.0, 33.0),
    (33.0, 22.0),
    (28.0, 11.0),
    (14.0, 11.0)
]
hull_glacis = (
    cq.Workplane("YZ")
    .workplane(offset=-hull_width / 2.0)
    .polyline(glacis_pts)
    .close()
    .extrude(hull_width)
)

# 2.3 Driver's Armored Vision Hatch (Glacis center)
driver_visor = (
    cq.Workplane("XY")
    .workplane(offset=27.0)
    .moveTo(0.0, 20.0)
    .box(13.0, 9.0, 7.0)
    .edges("|Z").fillet(1.5)
)
visor_slit = (
    cq.Workplane("XY")
    .workplane(offset=30.5)
    .moveTo(0.0, 23.5)
    .box(9.0, 3.0, 1.5)
)
driver_visor = driver_visor.cut(visor_slit)

# 2.4 Lower Front Trench-Crossing Teeth / Dozer Ribs
hull_teeth = []
for tx in [-15.0, -9.0, -3.0, 3.0, 9.0, 15.0]:
    tooth = (
        cq.Workplane("XY")
        .workplane(offset=11.0)
        .moveTo(tx, 30.0)
        .box(3.6, 3.5, 7.5)
    )
    hull_teeth.append(tooth)

# 2.5 Sponsons Connecting Central Hull to Tracks
sponson_r = (
    cq.Workplane("XY")
    .workplane(offset=15.0)
    .moveTo(24.0, 0.0)
    .box(7.0, 34.0, 16.0)
    .edges("|Y").fillet(2.5)
)
sponson_l = (
    cq.Workplane("XY")
    .workplane(offset=15.0)
    .moveTo(-24.0, 0.0)
    .box(7.0, 34.0, 16.0)
    .edges("|Y").fillet(2.5)
)

# Combine Hull Elements
hull = hull_tub.union(hull_glacis).union(driver_visor).union(sponson_r).union(sponson_l)
for t in hull_teeth:
    hull = hull.union(t)

# ==============================================================================
# 3. Turret Assembly
# ==============================================================================

# 3.1 Turret Base Ring
turret_ring = (
    cq.Workplane("XY")
    .workplane(offset=turret_base_z)
    .moveTo(0.0, turret_center_y)
    .circle(turret_ring_radius)
    .extrude(turret_ring_height)
)

# 3.2 Cast Turret Dome (Revolved Solid)
# Profile defined in local coordinates on XZ plane: local X = Global X, local Y = Global Z
dome_profile = [
    (0.0, turret_base_z + turret_ring_height),
    (24.0, turret_base_z + turret_ring_height),
    (25.2, 46.0),
    (24.0, 54.0),
    (19.5, 60.0),
    (12.5, 63.5),
    (0.0, 64.5)
]
turret_dome = (
    cq.Workplane("XZ")
    .polyline(dome_profile)
    .close()
    .revolve(360, (0, 0, 0), (0, 1, 0))
    .translate((0.0, turret_center_y, 0.0))
)

# 3.3 Commander's Hatch & Hinge (Top of Turret)
hatch_base = (
    cq.Workplane("XY")
    .workplane(offset=64.0)
    .moveTo(0.0, turret_center_y - 2.0)
    .box(17.0, 14.0, 2.0)
    .edges("|Z").fillet(2.5)
)
hatch_lid = (
    cq.Workplane("XY")
    .workplane(offset=65.5)
    .moveTo(0.0, turret_center_y - 2.0)
    .box(14.0, 11.5, 1.5)
    .edges("|Z").fillet(2.0)
)
hatch_handle = (
    cq.Workplane("XY")
    .workplane(offset=66.8)
    .moveTo(0.0, turret_center_y + 1.5)
    .box(5.5, 1.2, 0.8)
)
hatch_hinge = (
    cq.Workplane("YZ")
    .workplane(offset=-4.0)
    .moveTo(turret_center_y - 8.0, 65.5)
    .circle(1.2)
    .extrude(8.0)
)
hatch_total = hatch_base.union(hatch_lid).union(hatch_handle).union(hatch_hinge)

# 3.4 Sponsons / Equipment Pods on Turret Sides
def make_turret_pod(x_pos):
    pod = (
        cq.Workplane("XY")
        .workplane(offset=43.0)
        .moveTo(x_pos, turret_center_y + 1.0)
        .box(7.5, 16.0, 14.0)
        .edges().fillet(1.5)
    )
    # Forward sensor / gun ports (along +Y)
    for pz in [46.5, 53.5]:
        port = (
            cq.Workplane("XY")
            .circle(2.2)
            .extrude(2.5)
            .rotate((0, 0, 0), (1, 0, 0), -90.0)
            .translate((x_pos, turret_center_y + 9.0, pz))
        )
        lens = (
            cq.Workplane("XY")
            .circle(1.3)
            .extrude(3.2)
            .rotate((0, 0, 0), (1, 0, 0), -90.0)
            .translate((x_pos, turret_center_y + 9.0, pz))
        )
        pod = pod.union(port).union(lens)
    return pod

pod_right = make_turret_pod(21.5)
pod_left = make_turret_pod(-21.5)

# ==============================================================================
# 4. Main Cannon (Stubby SV-001 Howitzer)
# ==============================================================================

# Cannon modeled along +Z then rotated to point along +Y
mantlet = cq.Workplane("XY").sphere(cannon_mantlet_radius)
barrel_collar = cq.Workplane("XY").workplane(offset=10.0).circle(10.2).extrude(4.0)
barrel_tube = cq.Workplane("XY").workplane(offset=14.0).circle(cannon_outer_radius).extrude(cannon_length)
muzzle_ring = cq.Workplane("XY").workplane(offset=14.0 + cannon_length - 4.0).circle(9.4).extrude(4.0)

cannon_body = mantlet.union(barrel_collar).union(barrel_tube).union(muzzle_ring)

# Bore hole cut
bore = cq.Workplane("XY").workplane(offset=12.0).circle(cannon_bore_radius).extrude(cannon_length + 3.0)
cannon_body = cannon_body.cut(bore)

# 8 Rifling Ribs inside muzzle
for i in range(8):
    ang = math.radians(i * 45.0)
    rx = 5.7 * math.cos(ang)
    ry = 5.7 * math.sin(ang)
    rib = (
        cq.Workplane("XY")
        .workplane(offset=18.0)
        .moveTo(rx, ry)
        .rect(1.0, 1.0)
        .extrude(cannon_length - 2.0)
    )
    cannon_body = cannon_body.union(rib)

# Rotate to point along +Y and translate to turret position
cannon_assembly = (
    cannon_body
    .rotate((0, 0, 0), (1, 0, 0), -90.0)
    .translate((0.0, turret_center_y + 16.0, cannon_z))
)

# 4.2 Mantlet Hydraulic Conduit Tubes
def make_mantlet_conduit(sign):
    p1 = (
        cq.Workplane("YZ")
        .workplane(offset=sign * 10.0)
        .moveTo(turret_center_y + 20.0, cannon_z)
        .circle(1.3)
        .extrude(sign * 4.5)
    )
    elbow = (
        cq.Workplane("XY")
        .moveTo(sign * 14.5, turret_center_y + 20.0)
        .workplane(offset=cannon_z)
        .sphere(1.8)
    )
    p2 = (
        cq.Workplane("XY")
        .circle(1.3)
        .extrude(6.0)
        .rotate((0, 0, 0), (1, 0, 0), 90.0)
        .translate((sign * 14.5, turret_center_y + 20.0, cannon_z))
    )
    return p1.union(elbow).union(p2)

pipe_right = make_mantlet_conduit(+1.0)
pipe_left = make_mantlet_conduit(-1.0)

# ==============================================================================
# 5. Turret Accessories: Periscope, Antennas, Exhausts & Vulcans
# ==============================================================================

# 5.1 Periscope / Searchlight with Visor Cowl
searchlight_base = (
    cq.Workplane("XY")
    .workplane(offset=63.0)
    .moveTo(-2.5, turret_center_y + 8.5)
    .circle(3.0)
    .extrude(3.5)
)
searchlight_body = (
    cq.Workplane("XY")
    .circle(4.2)
    .extrude(8.5)
    .rotate((0, 0, 0), (1, 0, 0), -90.0)
    .translate((-2.5, turret_center_y + 5.5, 70.0))
)
searchlight_cowl = (
    cq.Workplane("XY")
    .circle(5.0)
    .circle(4.2)
    .extrude(4.0)
    .cut(
        cq.Workplane("XY")
        .moveTo(0.0, 5.0)
        .rect(12.0, 10.0)
        .extrude(4.0)
    )
    .rotate((0, 0, 0), (1, 0, 0), -90.0)
    .translate((-2.5, turret_center_y + 11.5, 70.0))
)
searchlight = searchlight_base.union(searchlight_body).union(searchlight_cowl)

# 5.2 Antennas
antenna_base = (
    cq.Workplane("XY")
    .workplane(offset=62.5)
    .moveTo(6.5, turret_center_y - 12.0)
    .circle(2.0)
    .extrude(3.0)
)
antenna_mast_main = (
    cq.Workplane("XY")
    .circle(0.65)
    .extrude(52.0)
    .rotate((0, 0, 0), (1, 0, 0), 18.0)
    .rotate((0, 0, 0), (0, 1, 0), 5.0)
    .translate((6.5, turret_center_y - 12.0, 65.5))
)
antenna_ball = (
    cq.Workplane("XY")
    .moveTo(11.0, turret_center_y - 28.0)
    .workplane(offset=114.0)
    .sphere(1.4)
)
antenna_mast_short = (
    cq.Workplane("XY")
    .circle(0.5)
    .extrude(30.0)
    .rotate((0, 0, 0), (1, 0, 0), 24.0)
    .translate((10.0, turret_center_y - 9.0, 64.0))
)
antennas = antenna_base.union(antenna_mast_main).union(antenna_ball).union(antenna_mast_short)

# 5.3 Engine Exhaust Pipes
exhaust_1 = (
    cq.Workplane("XY")
    .circle(2.0)
    .circle(1.4)
    .extrude(15.0)
    .rotate((0, 0, 0), (1, 0, 0), 24.0)
    .translate((12.5, turret_center_y - 15.0, 53.0))
)
exhaust_2 = (
    cq.Workplane("XY")
    .circle(1.7)
    .circle(1.1)
    .extrude(13.0)
    .rotate((0, 0, 0), (1, 0, 0), 20.0)
    .translate((16.5, turret_center_y - 12.0, 51.0))
)
exhausts = exhaust_1.union(exhaust_2)

# 5.4 Rear-Mounted Twin Vulcan Gatling Cannons
def build_vulcan_gun():
    """Builds a Gatling gun assembly oriented along the +Z axis."""
    v_mount = cq.Workplane("XY").sphere(4.2)
    v_neck = cq.Workplane("XY").workplane(offset=2.5).circle(3.0).extrude(4.0)
    v_body = cq.Workplane("XY").workplane(offset=6.5).circle(4.0).extrude(7.0)
    v_collar = cq.Workplane("XY").workplane(offset=13.5).circle(3.4).extrude(4.0)
    v_axle = cq.Workplane("XY").workplane(offset=17.5).circle(1.0).extrude(20.0)
    v_ring1 = cq.Workplane("XY").workplane(offset=26.0).circle(3.5).circle(1.6).extrude(1.8)
    v_ring2 = cq.Workplane("XY").workplane(offset=35.5).circle(3.5).circle(1.6).extrude(1.8)

    gun = v_mount.union(v_neck).union(v_body).union(v_collar).union(v_axle).union(v_ring1).union(v_ring2)

    # 6 Barrels
    for i in range(6):
        ang = math.radians(i * 60.0)
        bx = 2.4 * math.cos(ang)
        by = 2.4 * math.sin(ang)
        barrel = (
            cq.Workplane("XY")
            .workplane(offset=17.5)
            .moveTo(bx, by)
            .circle(0.65)
            .extrude(19.5)
        )
        gun = gun.union(barrel)
    return gun

vulcan_raw = build_vulcan_gun()

# Position Right Vulcan (+45 deg tilt backward, +18 deg toe-out)
vulcan_right = (
    vulcan_raw
    .rotate((0, 0, 0), (1, 0, 0), 45.0)
    .rotate((0, 0, 0), (0, 0, 1), 18.0)
    .translate((19.5, turret_center_y - 14.0, 50.5))
)

# Position Left Vulcan (+45 deg tilt backward, -18 deg toe-out)
vulcan_left = (
    vulcan_raw
    .rotate((0, 0, 0), (1, 0, 0), 45.0)
    .rotate((0, 0, 0), (0, 0, 1), -18.0)
    .translate((-19.5, turret_center_y - 14.0, 50.5))
)

# ==============================================================================
# 6. Final Assembly
# ==============================================================================

# Combine Complete Turret
turret_total = (
    turret_ring
    .union(turret_dome)
    .union(hatch_total)
    .union(pod_right)
    .union(pod_left)
    .union(cannon_assembly)
    .union(pipe_right)
    .union(pipe_left)
    .union(searchlight)
    .union(antennas)
    .union(exhausts)
    .union(vulcan_right)
    .union(vulcan_left)
)

# Combine Full Vehicle: Hull + Tracks + Turret
result = (
    hull
    .union(right_track)
    .union(left_track)
    .union(turret_total)
)