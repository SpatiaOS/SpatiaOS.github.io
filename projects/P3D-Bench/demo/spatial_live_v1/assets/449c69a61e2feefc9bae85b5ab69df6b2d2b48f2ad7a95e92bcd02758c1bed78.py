import cadquery as cq
import math

# ----------------------
# Parametric Dimensions (Chibi Metal Slug SV-001 style tank)
# All units in millimeters, proportions matched to reference image
# ----------------------
# Hull
hull_width = 22.0                # Width of central hull (between tracks)
hull_fillet_radius = 4.0         # Radius for rounded hull edges (reduced for reliability)
# Tracks / Running Gear
track_armor_thickness = 4.0      # Thickness of track side armor
wheel_width = 7.0                # Width of road wheels (protruding from armor)
wheel_radius = 11.0              # Outer radius of road wheels
wheel_hub_radius = 4.0           # Center hub radius
wheel_bolt_radius = 1.5          # Wheel bolt head radius
wheel_bolt_count = 4             # Bolts per wheel hub
grouser_height = 3.0             # Height of track cleats/teeth
wheel_center_z = grouser_height + wheel_radius  # Z height of wheel axles
front_wheel_x = -13.0            # X position of front road wheel
rear_wheel_x = 13.0              # X position of rear road wheel
# Turret
turret_dome_radius = 12.0        # Radius of spherical turret dome (corrected proportion)
turret_z_center = 20.0           # Z center of turret dome (at hull top level)
turret_handle_radius = 1.0       # Radius of tubular grab handles
turret_deck_z = 27.0             # Z height of flat cut turret top deck
# Main Cannon
cannon_base_dia = 12.0           # Diameter of cannon collar at turret
cannon_outer_dia = 10.0          # Main barrel outer diameter
cannon_inner_dia = 7.0           # Muzzle bore diameter
cannon_length = 20.0             # Total barrel length
cannon_muzzle_depth = 5.0        # Depth of muzzle opening
# Secondary Weapons & Details
minigun_length = 18.0            # Side minigun total length
minigun_barrel_dia = 1.1         # Individual minigun barrel diameter
minigun_mount_radius = 4.0       # Ball joint radius for minigun
antenna_length = 36.0            # Long radio antenna length
antenna_tip_radius = 1.0         # Antenna ball tip radius
smokestack_height = 10.0         # Rear vertical smokestack height
smokestack_dia = 3.5             # Smokestack diameter
searchlight_radius = 4.0         # Commander searchlight diameter
searchlight_mount_height = 3.0   # Searchlight mounting bracket height

# ----------------------
# Step 1: Build main hull
# ----------------------
# 2D profile of hull in XZ (front/back - height) plane, extruded symmetrically along Y
hull_profile = (
    cq.Workplane("XZ")
    .moveTo(-21, 3)               # Front bottom corner
    .lineTo(-12, 20)              # Sloped front glacis plate
    .lineTo(12, 20)               # Flat turret mounting deck
    .lineTo(21, 14)               # Sloped rear upper plate
    .lineTo(21, 3)                # Rear vertical face
    .lineTo(-21, 3)               # Flat bottom
    .close()
)
hull = hull_profile.extrude(hull_width/2, both=True)  # Extrude symmetric across XZ centerline
hull = hull.edges("|Y").fillet(hull_fillet_radius)    # Round long side edges

# Add traction ribs/blocks to front sloped glacis
slope_angle = math.atan2(17,9) * 180/math.pi
for i in range(6):
    t = i / 5.0
    x_pos = -21 + 9 * t
    z_pos = 3 + 17 * t
    # Fresh block per position to avoid cumulative rotation
    block = cq.Workplane("XY").box(3.0, 6.0, 3.0)
    block = block.rotate((0,0,0), (0,1,0), -slope_angle)
    block = block.translate((x_pos, 0, z_pos + 1.5))
    hull = hull.union(block)

# Add rounded front transmission/headlight boss
hull_boss = (
    cq.Workplane("XZ")
    .center(-10, 15)
    .ellipse(6,5)
    .extrude(8, both=True)
)
hull = hull.union(hull_boss)

# ----------------------
# Step 2: Build track assemblies
# ----------------------
right_track_y_start = hull_width/2
right_track_y_end = right_track_y_start + track_armor_thickness

# Side profile for track armor (faceted sloped style)
track_armor_prof = (
    cq.Workplane("XZ")
    .moveTo(front_wheel_x - wheel_radius, 3)
    .lineTo(front_wheel_x -5, wheel_center_z +4)
    .lineTo(rear_wheel_x +5, wheel_center_z +4)
    .lineTo(rear_wheel_x + wheel_radius,3)
    .lineTo(front_wheel_x - wheel_radius,3)
    .close()
)
right_track = track_armor_prof.extrude(track_armor_thickness).translate((0, right_track_y_start,0))
# Soften only long top edges parallel to track length, use small radius to avoid failure
right_track = right_track.edges("|Y").edges(">Z").fillet(1.0)

# Helper function to create styled road wheels
def make_road_wheel():
    wheel = (
        cq.Workplane("XZ")
        .circle(wheel_radius)
        .extrude(wheel_width)
        # Recessed rim detail
        .faces(">Y")
        .workplane()
        .circle(wheel_radius - 3)
        .cutBlind(-2)
        # Center hub cap
        .faces(">Y")
        .workplane()
        .circle(wheel_hub_radius)
        .extrude(2)
        # Hub bolts
        .faces(">Y")
        .workplane()
        .polarArray(radius=wheel_hub_radius+3, startAngle=0, angle=360, count=wheel_bolt_count)
        .circle(wheel_bolt_radius)
        .extrude(1.2)
    )
    return wheel

# Add front/rear wheels to right track
front_wheel = make_road_wheel().translate((front_wheel_x, right_track_y_end, wheel_center_z))
rear_wheel = make_road_wheel().translate((rear_wheel_x, right_track_y_end, wheel_center_z))
right_track = right_track.union(front_wheel).union(rear_wheel)

# Add track grousers (cleats/teeth) - fresh shape per cleat to avoid transform buildup
# Bottom run (flat on ground)
for gx in range(-24,25,4):
    g = cq.Workplane("XY").box(2.0, track_armor_thickness + 2, grouser_height)
    g = g.translate((gx, right_track_y_start + track_armor_thickness/2, grouser_height/2))
    right_track = right_track.union(g)
# Front curved section around idler
for angle_deg in range(180, 361, 30):
    angle_rad = math.radians(angle_deg)
    base_x = front_wheel_x + wheel_radius * math.cos(angle_rad)
    base_z = wheel_center_z + wheel_radius * math.sin(angle_rad)
    g = cq.Workplane("XY").box(2.0, track_armor_thickness + 2, grouser_height)
    g = g.rotate((0,0,0),(0,1,0), angle_deg + 90)
    g = g.translate((base_x, right_track_y_start + track_armor_thickness/2, base_z))
    right_track = right_track.union(g)
# Rear curved section around sprocket
for angle_deg in range(0, 181, 30):
    angle_rad = math.radians(angle_deg)
    base_x = rear_wheel_x + wheel_radius * math.cos(angle_rad)
    base_z = wheel_center_z + wheel_radius * math.sin(angle_rad)
    g = cq.Workplane("XY").box(2.0, track_armor_thickness + 2, grouser_height)
    g = g.rotate((0,0,0),(0,1,0), angle_deg +90)
    g = g.translate((base_x, right_track_y_start + track_armor_thickness/2, base_z))
    right_track = right_track.union(g)

# Add right track to hull, mirror to create left track
hull = hull.union(right_track)
left_track = right_track.mirror(mirrorPlane="XZ")
hull = hull.union(left_track)

# ----------------------
# Step 3: Build turret assembly
# ----------------------
# Spherical main dome with flat cut top deck - use boolean cut instead of split to avoid null shape error
dome = cq.Workplane("XY").sphere(turret_dome_radius).translate((0, 0, turret_z_center))
# Create large cutting box to remove everything above turret deck height
cut_top = cq.Workplane("XY").box(
    2*turret_dome_radius + 10,
    2*turret_dome_radius + 10,
    turret_dome_radius + 10
).translate((0, 0, turret_deck_z + (turret_dome_radius + 10)/2))
dome = dome.cut(cut_top)

# Add L-shaped tubular grab handles on front of dome around cannon base
# Right handle
handle_r_h = cq.Workplane("YZ").circle(turret_handle_radius).extrude(6).translate((-turret_dome_radius+5, -4 - 3, turret_z_center))
handle_r_v = cq.Workplane("XZ").circle(turret_handle_radius).extrude(4).rotate((0,0,0),(1,0,0),90).translate((-turret_dome_radius+5, -4, turret_z_center -2))
handle_r = handle_r_h.union(handle_r_v)
# Left handle
handle_l_h = cq.Workplane("YZ").circle(turret_handle_radius).extrude(6).translate((-turret_dome_radius+5, 4 - 3, turret_z_center))
handle_l_v = cq.Workplane("XZ").circle(turret_handle_radius).extrude(4).rotate((0,0,0),(1,0,0),90).translate((-turret_dome_radius+5, 4, turret_z_center -2))
handle_l = handle_l_h.union(handle_l_v)
dome = dome.union(handle_r).union(handle_l)

# Add far side circular ports (visible on opposite side of turret)
port_top = cq.Workplane("XZ").circle(2.5).extrude(3).translate((-2, turret_dome_radius-2, turret_z_center+3))
port_bot = cq.Workplane("XZ").circle(2.5).extrude(3).translate((-2, turret_dome_radius-2, turret_z_center-3))
dome = dome.union(port_top).union(port_bot)

# Add side equipment box with vision ports (viewer facing side)
equip_box = (
    cq.Workplane("XY").box(9,6,11)
    .edges("|X").fillet(2.0)
    .translate((0, -(turret_dome_radius-2), turret_z_center))
)
equip_box = (
    equip_box.faces("<Y").workplane()
    .pushPoints([(0,3), (0,-3)])
    .circle(2.5).cutBlind(-2)
)
dome = dome.union(equip_box)

# Add main forward cannon (pointing -X direction / front)
cannon_base = (
    cq.Workplane("YZ").circle(cannon_base_dia/2)
    .extrude(-5).translate((-(turret_dome_radius -5), 0, turret_z_center -1))
)
cannon_barrel = (
    cq.Workplane("YZ").circle(cannon_outer_dia/2)
    .extrude(-cannon_length).translate((-turret_dome_radius, 0, turret_z_center -2))
)
cannon_barrel = (
    cannon_barrel.faces("<X").workplane()
    .circle(cannon_inner_dia/2).cutBlind(-cannon_muzzle_depth)
)
cannon_barrel = cannon_barrel.faces("<X").chamfer(1.2)
dome = dome.union(cannon_base.union(cannon_barrel))

# Add commander searchlight on front turret top
searchlight_base = cq.Workplane("XY").box(5,5,searchlight_mount_height).translate((-5,0,turret_deck_z))
searchlight = (
    cq.Workplane("YZ").circle(searchlight_radius)
    .extrude(5).rotate((0,0,0),(0,1,0),30).rotate((0,0,0),(0,0,1),-15)
    .translate((-5,0, turret_deck_z + searchlight_mount_height))
)
dome = dome.union(searchlight_base).union(searchlight)

# Add top turret hatch with lift handles
hatch_plate = (
    cq.Workplane("XY").box(11, 7, 2)
    .edges("|Z").fillet(2)
    .translate((-1, 0, turret_deck_z + 1))
)
# Helper to make simple U-shaped hatch handle
def make_hatch_handle(length=4, height=2, radius=0.6):
    h = cq.Workplane("XY")
    h = h.union(cq.Workplane("XY").circle(radius).extrude(height).translate((-length/2, 0, 0)))
    h = h.union(cq.Workplane("XY").circle(radius).extrude(height).translate((length/2, 0, 0)))
    h = h.union(cq.Workplane("XZ").center(0, height).circle(radius).extrude(length/2, both=True))
    return h
hatch_h1 = make_hatch_handle().translate((-3, 0, turret_deck_z + 2))
hatch_h2 = make_hatch_handle().translate((2, 0, turret_deck_z + 2))
dome = dome.union(hatch_plate).union(hatch_h1).union(hatch_h2)

# Add twin vertical rear smokestacks
stack1 = cq.Workplane("XY").circle(smokestack_dia/2).extrude(smokestack_height).translate((4,-2,turret_deck_z))
stack2 = cq.Workplane("XY").circle(smokestack_dia/2).extrude(smokestack_height).translate((4,2,turret_deck_z))
stack1 = stack1.faces(">Z").chamfer(0.8)
stack2 = stack2.faces(">Z").chamfer(0.8)
dome = dome.union(stack1).union(stack2)

# Add angled exhaust pipes (viewer-facing side)
exhaust1 = (
    cq.Workplane("XY").circle(2.3).extrude(13)
    .rotate((0,0,0),(0,1,0),20).rotate((0,0,0),(1,0,0),10)
    .translate((6,-8,turret_deck_z))
)
# Bent tip exhaust
exhaust2_straight = (
    cq.Workplane("XY").circle(1.6).extrude(9)
    .rotate((0,0,0),(0,1,0),30).rotate((0,0,0),(1,0,0),15)
    .translate((6,-10,turret_deck_z))
)
exhaust2_tip = (
    cq.Workplane("XZ").circle(1.6).extrude(4)
    .rotate((0,0,0),(0,0,1),-75)
    .translate((6 + 9*math.sin(math.radians(30)), -10 -9*math.sin(math.radians(15))*math.cos(math.radians(30)), turret_deck_z + 9*math.cos(math.radians(30))*math.cos(math.radians(15))))
)
exhaust2 = exhaust2_straight.union(exhaust2_tip)
dome = dome.union(exhaust1).union(exhaust2)

# Angled armor wedge at antenna base
wedge_prof = (
    cq.Workplane("XZ")
    .moveTo(2, turret_deck_z)
    .lineTo(7, turret_deck_z)
    .lineTo(7, turret_deck_z + 7)
    .lineTo(2, turret_deck_z)
    .close()
)
wedge = wedge_prof.extrude(3, both=True)
dome = dome.union(wedge)

# Add antennae with ball tips (leaning rearward as in reference)
antenna_base = cq.Workplane("XY").circle(0.9).extrude(3).translate((6,0,turret_deck_z))
# Long antenna: rotated 25deg back around Y, 5deg right around X
long_ant = (
    cq.Workplane("XY").circle(0.6).extrude(antenna_length)
    .rotate((0,0,0),(0,1,0),25).rotate((0,0,0),(1,0,0),-5)
    .translate((6,0,turret_deck_z+3))
)
# Calculate long antenna tip position
la_tilt_x = math.radians(25)
la_tilt_y = math.radians(-5)
la_z = antenna_length * math.cos(la_tilt_x) * math.cos(la_tilt_y)
la_x = antenna_length * math.sin(la_tilt_x)
la_y = antenna_length * math.cos(la_tilt_x) * math.sin(la_tilt_y)
long_tip = cq.Workplane("XY").sphere(antenna_tip_radius).translate((6+la_x, 0+la_y, turret_deck_z+3+la_z))

# Short antenna
short_ant_len = 19
short_ant = (
    cq.Workplane("XY").circle(0.4).extrude(short_ant_len)
    .rotate((0,0,0),(0,1,0),15).rotate((0,0,0),(1,0,0),-3)
    .translate((5,-1,turret_deck_z+3))
)
sa_tilt_x = math.radians(15)
sa_tilt_y = math.radians(-3)
sa_z = short_ant_len * math.cos(sa_tilt_x) * math.cos(sa_tilt_y)
sa_x = short_ant_len * math.sin(sa_tilt_x)
sa_y = short_ant_len * math.cos(sa_tilt_x) * math.sin(sa_tilt_y)
short_tip = cq.Workplane("XY").sphere(0.7).translate((5+sa_x, -1+sa_y, turret_deck_z+3+sa_z))
dome = dome.union(antenna_base).union(long_ant).union(long_tip).union(short_ant).union(short_tip)

# Add side minigun on viewer-facing side
minigun_ball = cq.Workplane("XY").sphere(minigun_mount_radius).translate((2, -(turret_dome_radius+2), turret_z_center+2))
minigun_angle = 50
minigun_shaft = (
    cq.Workplane("XY").circle(1.8).extrude(minigun_length)
    .rotate((0,0,0),(1,0,0), minigun_angle).translate((2, -(turret_dome_radius+2), turret_z_center+2 + minigun_mount_radius))
)
# Add 6 clustered barrels
minigun_barrels = None
for ang in range(0,360,60):
    barrel = (
        cq.Workplane("XY").center(1.8*math.cos(math.radians(ang)), 1.8*math.sin(math.radians(ang)))
        .circle(minigun_barrel_dia).extrude(minigun_length)
        .rotate((0,0,0),(1,0,0), minigun_angle)
        .translate((2, -(turret_dome_radius+2), turret_z_center+2 + minigun_mount_radius))
    )
    minigun_barrels = barrel if minigun_barrels is None else minigun_barrels.union(barrel)
# Add barrel support clamps
clamp1 = (
    cq.Workplane("XY").circle(4).circle(2.8).extrude(1.2)
    .rotate((0,0,0),(1,0,0), minigun_angle).translate((2, -(turret_dome_radius+2), turret_z_center+2+minigun_mount_radius+7))
)
clamp2 = (
    cq.Workplane("XY").circle(4).circle(2.8).extrude(1.2)
    .rotate((0,0,0),(1,0,0), minigun_angle).translate((2, -(turret_dome_radius+2), turret_z_center+2+minigun_mount_radius+14))
)
dome = dome.union(minigun_ball).union(minigun_shaft).union(minigun_barrels).union(clamp1).union(clamp2)

# ----------------------
# Final assembly: combine hull and turret
# ----------------------
result = hull.union(dome)