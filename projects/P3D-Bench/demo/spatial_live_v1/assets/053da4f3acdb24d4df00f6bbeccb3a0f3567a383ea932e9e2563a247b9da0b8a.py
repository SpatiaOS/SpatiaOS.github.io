import cadquery as cq
import math

# ==============================================================================
# Parameters
# ==============================================================================

# Base & Pedestal
base_width = 340.0        # X dimension
base_length = 360.0       # Y dimension
base_height = 72.0        # Z height
pedestal_dia = 260.0      # Slewing ring pedestal diameter
pedestal_height = 25.0    # Pedestal height
turntable_dia = 220.0     # Turntable disc diameter
turntable_height = 20.0   # Turntable disc thickness

# Axis 2 (Shoulder Pivot)
axis2_z = 215.0           # Height of Axis 2 centerline above ground
axis2_hub_dia = 135.0     # Bearing housing diameter
axis2_hex_dia = 48.0      # Hexagonal shaft extension diameter
axis2_hex_len = 46.0      # Hexagonal shaft length

# Lower Arm (Link 1)
arm1_angle = 32.0         # Forward tilt angle from vertical (degrees)
arm1_len = 275.0          # Center-to-center distance between Axis 2 and Axis 3
arm1_width = 66.0         # Lower arm width along X

# Elbow / Axis 3 Position (Derived)
arm1_rad = math.radians(arm1_angle)
elbow_y = arm1_len * math.sin(arm1_rad)
elbow_z = axis2_z + arm1_len * math.cos(arm1_rad)

# Balancer Parallel Linkage
link_x = 55.0             # X position of the parallel tie rod
link_p1 = cq.Vector(link_x, -60.0, 160.0)                                    # Lower pivot
link_p2 = cq.Vector(link_x, elbow_y - 60.0, elbow_z - (axis2_z - 160.0))    # Upper pivot

# Forearm (Link 2)
forearm_angle = -20.0     # Downward tilt angle from horizontal (degrees)
forearm_len = 310.0       # Forearm body length
forearm_dia = 72.0        # Forearm cylindrical tube diameter

# ==============================================================================
# 1. Base Assembly
# ==============================================================================

# Main base casting
base_block = (
    cq.Workplane("XY")
    .box(base_width, base_length, base_height)
    .translate((0, 0, base_height / 2.0))
    .edges("|Z")
    .chamfer(16.0)
)

# Forklift / handling notches on side
notch = (
    cq.Workplane("XY")
    .box(50.0, 80.0, 30.0)
    .translate((base_width / 2.0, 0, 15.0))
)
base_block = base_block.cut(notch)

# Mounting tab on the side (+X face)
tab1 = (
    cq.Workplane("XY")
    .box(30.0, 90.0, 20.0)
    .translate((base_width / 2.0 + 10.0, -60.0, 10.0))
    .edges("|Z and >X")
    .fillet(10.0)
)
tab1_holes = (
    tab1.faces(">Z")
    .workplane()
    .pushPoints([(0, -25.0), (0, 25.0)])
    .circle(6.5)
    .cutThruAll()
)

tab2 = (
    cq.Workplane("XY")
    .box(30.0, 70.0, 20.0)
    .translate((base_width / 2.0 + 10.0, 80.0, 10.0))
    .edges("|Z and >X")
    .fillet(10.0)
)

# Electrical connector panel on -Y face
elec_panel = (
    cq.Workplane("XZ")
    .box(68.0, 42.0, 14.0)
    .translate((-55.0, -base_length / 2.0 - 7.0, 35.0))
    .edges("|Y")
    .chamfer(3.0)
)
socket1 = (
    cq.Workplane("XZ")
    .circle(7.0)
    .extrude(12.0)
    .translate((-35.0, -base_length / 2.0 - 14.0, 26.0))
)
socket2 = (
    cq.Workplane("XZ")
    .circle(7.0)
    .extrude(12.0)
    .translate((-35.0, -base_length / 2.0 - 14.0, 44.0))
)

# Pedestal boss & slewing ring flange
pedestal = (
    cq.Workplane("XY")
    .workplane(offset=base_height - 1.0)
    .circle(pedestal_dia / 2.0)
    .extrude(pedestal_height + 1.0)
)
slewing_ring = (
    cq.Workplane("XY")
    .workplane(offset=base_height + 12.0)
    .circle((pedestal_dia + 22.0) / 2.0)
    .extrude(8.0)
)

base = (
    base_block
    .union(tab1_holes)
    .union(tab2)
    .union(elec_panel)
    .union(socket1)
    .union(socket2)
    .union(pedestal)
    .union(slewing_ring)
)

# ==============================================================================
# 2. Carousel (Turntable & Shoulder Uprights)
# ==============================================================================

turntable_z = base_height + pedestal_height

# Rotating disc
turntable_disc = (
    cq.Workplane("XY")
    .workplane(offset=turntable_z)
    .circle(turntable_dia / 2.0)
    .extrude(turntable_height)
    .edges(">Z")
    .chamfer(3.0)
)

# Shoulder base plate
shoulder_base = (
    cq.Workplane("XY")
    .box(120.0, 120.0, 32.0)
    .translate((0, -10.0, turntable_z + turntable_height + 14.0))
)

# Right and left upright support towers
tower_r = (
    cq.Workplane("XY")
    .box(36.0, 110.0, axis2_z - (turntable_z + turntable_height))
    .translate((46.0, -10.0, (turntable_z + turntable_height + axis2_z) / 2.0))
)
tower_l = (
    cq.Workplane("XY")
    .box(36.0, 110.0, axis2_z - (turntable_z + turntable_height))
    .translate((-46.0, -10.0, (turntable_z + turntable_height + axis2_z) / 2.0))
)

# Rear bracket for parallel linkage lower anchor
bracket_rear = (
    cq.Workplane("XY")
    .box(24.0, 60.0, 55.0)
    .translate((link_x, -70.0, turntable_z + turntable_height + 25.0))
    .edges("|X and <Y and >Z")
    .fillet(15.0)
)

carousel = (
    turntable_disc
    .union(shoulder_base)
    .union(tower_r)
    .union(tower_l)
    .union(bracket_rear)
)

# ==============================================================================
# 3. Axis 2 Joint & Hex Extension
# ==============================================================================

# Left bearing cap
hub_left = (
    cq.Workplane("YZ")
    .circle(115.0 / 2.0)
    .extrude(-35.0)
    .translate((-34.0, 0, axis2_z))
)

# Right main bearing housing with concentric steps
hub_r1 = (
    cq.Workplane("YZ")
    .circle(axis2_hub_dia / 2.0)
    .extrude(24.0)
    .translate((34.0, 0, axis2_z))
)
hub_r2 = (
    cq.Workplane("YZ")
    .circle(108.0 / 2.0)
    .extrude(16.0)
    .translate((58.0, 0, axis2_z))
)
hub_r3 = (
    cq.Workplane("YZ")
    .circle(84.0 / 2.0)
    .extrude(10.0)
    .translate((74.0, 0, axis2_z))
)

# Prominent hexagonal shaft extension
hex_shaft = (
    cq.Workplane("YZ")
    .polygon(6, axis2_hex_dia)
    .extrude(axis2_hex_len)
    .translate((84.0, 0, axis2_z))
)
hex_bolt = (
    cq.Workplane("YZ")
    .polygon(6, 22.0)
    .extrude(8.0)
    .translate((84.0 + axis2_hex_len, 0, axis2_z))
)

axis2_assembly = (
    hub_left
    .union(hub_r1)
    .union(hub_r2)
    .union(hub_r3)
    .union(hex_shaft)
    .union(hex_bolt)
)

# ==============================================================================
# 4. Lower Arm (Link 1)
# ==============================================================================

# Built in local coordinates where Z aligns with arm centerline, then rotated into place
arm1_pivot_hub = (
    cq.Workplane("YZ")
    .circle(52.0)
    .extrude(arm1_width)
    .translate((-arm1_width / 2.0, 0, 0))
)

# Lower faceted body with backward-projecting shelf
arm1_lower = (
    cq.Workplane("XY")
    .box(arm1_width, 95.0, 95.0)
    .translate((0, -12.5, 62.5))
    .edges("<Y and <Z")
    .chamfer(28.0)
)

# Mid-section transition
arm1_mid = (
    cq.Workplane("XY")
    .box(arm1_width - 6.0, 68.0, 105.0)
    .translate((0, 0, 150.0))
)

# Upper head near elbow
arm1_upper = (
    cq.Workplane("XY")
    .box(arm1_width - 4.0, 76.0, 75.0)
    .translate((0, 5.0, 230.0))
)

arm1_elbow_hub = (
    cq.Workplane("YZ")
    .circle(44.0)
    .extrude(arm1_width)
    .translate((-arm1_width / 2.0, 0, arm1_len))
)

arm1_local = (
    arm1_pivot_hub
    .union(arm1_lower)
    .union(arm1_mid)
    .union(arm1_upper)
    .union(arm1_elbow_hub)
)

# Rotate around X by -arm1_angle to tilt forward, then translate to Axis 2
arm1 = (
    arm1_local
    .rotate((0, 0, 0), (1, 0, 0), -arm1_angle)
    .translate((0, 0, axis2_z))
)

# ==============================================================================
# 5. Parallel Balancer Link Rod
# ==============================================================================

# Pivot bosses
eyelet_low = (
    cq.Workplane("YZ")
    .circle(16.0)
    .extrude(18.0)
    .translate((link_p1.x - 9.0, link_p1.y, link_p1.z))
)
eyelet_up = (
    cq.Workplane("YZ")
    .circle(16.0)
    .extrude(18.0)
    .translate((link_p2.x - 9.0, link_p2.y, link_p2.z))
)

pin_low = (
    cq.Workplane("YZ")
    .circle(8.0)
    .extrude(28.0)
    .translate((link_p1.x - 14.0, link_p1.y, link_p1.z))
)
pin_up = (
    cq.Workplane("YZ")
    .circle(8.0)
    .extrude(28.0)
    .translate((link_p2.x - 14.0, link_p2.y, link_p2.z))
)

# Dogleg / bent tie rod
knee_y = link_p1.y + (link_p2.y - link_p1.y) * 0.25 - 20.0
knee_z = link_p1.z + (link_p2.z - link_p1.z) * 0.25 + 12.0

rod_pts = [
    (link_p1.y - 10.0, link_p1.z - 4.0),
    (knee_y - 11.0, knee_z),
    (link_p2.y - 10.0, link_p2.z + 4.0),
    (link_p2.y + 10.0, link_p2.z - 4.0),
    (knee_y + 11.0, knee_z),
    (link_p1.y + 10.0, link_p1.z + 4.0),
]

rod_bar = (
    cq.Workplane("YZ", origin=(link_x - 7.0, 0, 0))
    .polyline(rod_pts)
    .close()
    .extrude(14.0)
)

balancer_rod = eyelet_low.union(eyelet_up).union(pin_low).union(pin_up).union(rod_bar)

# Elbow crank horn connecting Axis 3 to the balancer rod
horn = (
    cq.Workplane("YZ", origin=(link_x - 14.0, 0, 0))
    .polyline([
        (elbow_y, elbow_z),
        (elbow_y + 12.0, elbow_z - 12.0),
        (link_p2.y + 14.0, link_p2.z - 6.0),
        (link_p2.y - 14.0, link_p2.z + 6.0),
        (elbow_y - 18.0, elbow_z + 14.0)
    ])
    .close()
    .extrude(16.0)
)

# ==============================================================================
# 6. Axis 3 Motors (Elbow Rear)
# ==============================================================================

motor_tilt = 42.0  # Angle pointing backwards/upwards
motor_unit = (
    cq.Workplane("XY")
    .circle(20.0)
    .extrude(65.0)
    .faces(">Z")
    .workplane()
    .circle(11.0)
    .extrude(14.0)
    .faces(">Z")
    .workplane()
    .box(15.0, 15.0, 10.0)
)

motor_mount = (
    cq.Workplane("XY")
    .box(66.0, 48.0, 42.0)
    .rotate((0, 0, 0), (1, 0, 0), motor_tilt)
    .translate((0, elbow_y - 20.0, elbow_z + 14.0))
)

motor1 = (
    motor_unit
    .rotate((0, 0, 0), (1, 0, 0), motor_tilt)
    .translate((-17.0, elbow_y - 24.0, elbow_z + 20.0))
)
motor2 = (
    motor_unit
    .rotate((0, 0, 0), (1, 0, 0), motor_tilt)
    .translate((17.0, elbow_y - 24.0, elbow_z + 20.0))
)

# ==============================================================================
# 7. Forearm & Wrist Assembly (Link 2)
# ==============================================================================

# Built along local Z axis from Z = 0 to tip, then oriented along the forearm direction
# Elbow transition cone
cone = (
    cq.Workplane("XY")
    .circle(52.0)
    .workplane(offset=35.0)
    .circle(37.0)
    .loft()
)

# Main boom tube
tube = (
    cq.Workplane("XY")
    .workplane(offset=35.0)
    .circle(forearm_dia / 2.0)
    .extrude(180.0)
)

# Stepped collar series near wrist
col1 = (
    cq.Workplane("XY")
    .workplane(offset=215.0)
    .circle(46.0)
    .extrude(14.0)
)
col2 = (
    cq.Workplane("XY")
    .workplane(offset=229.0)
    .circle(55.0)
    .extrude(14.0)
)
col3 = (
    cq.Workplane("XY")
    .workplane(offset=243.0)
    .circle(48.0)
    .extrude(12.0)
)
col4 = (
    cq.Workplane("XY")
    .workplane(offset=255.0)
    .circle(40.0)
    .extrude(14.0)
)
neck = (
    cq.Workplane("XY")
    .workplane(offset=269.0)
    .circle(32.0)
    .extrude(36.0)
)

# Wrist: Axis 4 roll hub & Axis 5 pitch clevis
wrist_hub = (
    cq.Workplane("XY")
    .workplane(offset=305.0)
    .circle(26.0)
    .extrude(14.0)
)
clevis_body = (
    cq.Workplane("XY")
    .workplane(offset=319.0)
    .box(46.0, 46.0, 42.0, centered=(True, True, False))
    .edges("|Z")
    .chamfer(6.0)
)
clevis_pivot = (
    cq.Workplane("YZ")
    .workplane(offset=-26.0)
    .circle(11.0)
    .extrude(52.0)
    .translate((0, 0, 340.0))
)
clevis_sensor = (
    cq.Workplane("XY")
    .box(24.0, 16.0, 16.0)
    .translate((0, 24.0, 342.0))
)

# Axis 6 tool mounting flange
flange_disc = (
    cq.Workplane("XY")
    .workplane(offset=361.0)
    .circle(22.0)
    .extrude(10.0)
)
flange_boss = (
    cq.Workplane("XY")
    .workplane(offset=371.0)
    .circle(10.0)
    .extrude(4.0)
)
flange_hole = (
    cq.Workplane("XY")
    .workplane(offset=369.0)
    .circle(5.0)
    .extrude(7.0)
)

forearm_local = (
    cone
    .union(tube)
    .union(col1)
    .union(col2)
    .union(col3)
    .union(col4)
    .union(neck)
    .union(wrist_hub)
    .union(clevis_body)
    .union(clevis_pivot)
    .union(clevis_sensor)
    .union(flange_disc)
    .union(flange_boss)
    .cut(flange_hole)
)

# Rotate forearm down/forward and translate to Axis 3
forearm_rot_angle = -(90.0 - forearm_angle)
forearm = (
    forearm_local
    .rotate((0, 0, 0), (1, 0, 0), forearm_rot_angle)
    .translate((0, elbow_y, elbow_z))
)

# ==============================================================================
# Final Assembly Union
# ==============================================================================

result = (
    base
    .union(carousel)
    .union(axis2_assembly)
    .union(arm1)
    .union(balancer_rod)
    .union(horn)
    .union(motor_mount)
    .union(motor1)
    .union(motor2)
    .union(forearm)
)