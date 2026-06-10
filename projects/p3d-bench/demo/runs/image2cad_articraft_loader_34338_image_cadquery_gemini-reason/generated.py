import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Chassis & Body
chassis_l = 85
chassis_w = 26
chassis_h = 20
chassis_z = 10

hood_l = 35
hood_w = 26
hood_h = 16
hood_x = 25

deck_l = 45
deck_w = 68
deck_h = 4
deck_x = -20

# Cab
cab_l = 28
cab_w = 28
cab_h = 30
cab_x = -20
cab_z_offset = 24

# Wheels
axle_z = 10
front_axle_x = 25
rear_axle_x = -25
track_w = 52

R_front = 16
W_front = 12
R_rear = 20
W_rear = 14

# Loader Arms
arm_thickness = 4
arm_y_offset = 16

# ==========================================
# Helper Functions
# ==========================================

def make_wheel(radius, width, tread_count=16):
    """Creates a tractor wheel with chevron treads."""
    half_w = width / 2.0
    
    # Base wheel cylinder
    wheel = cq.Workplane("XZ").circle(radius - 2).extrude(half_w, both=True)
    
    # Rim indent and axle hole
    rim = cq.Workplane("XZ").circle(radius * 0.6).extrude(half_w * 1.1, both=True)
    wheel = wheel.cut(rim)
    hub = cq.Workplane("XZ").circle(radius * 0.65).extrude(half_w * 0.2, both=True)
    axle_hole = cq.Workplane("XZ").circle(radius * 0.1).extrude(half_w * 1.2, both=True)
    wheel = wheel.union(hub).cut(axle_hole)
    
    # Chevron tread sketch
    tread_sk = (cq.Workplane("XY")
                .moveTo(-2, half_w)
                .lineTo(2, half_w)
                .lineTo(6, 0)
                .lineTo(2, -half_w)
                .lineTo(-2, -half_w)
                .lineTo(2, 0)
                .close())
    
    # Create one solid tread block
    tread_solid = tread_sk.extrude(4).translate((0, 0, radius - 2)).val()
    
    # Polar array of treads
    res = wheel.val()
    for i in range(tread_count):
        angle = i * (360.0 / tread_count)
        t_rot = tread_solid.moved(cq.Location(cq.Vector(0,0,0), cq.Vector(0,1,0), angle))
        res = res.fuse(t_rot)
        
    return cq.Workplane("XZ").add(res)

def make_cyl(p1, p2, r1, r2):
    """Creates a hydraulic cylinder from point p1 to p2 in the XZ plane."""
    dx = p2[0] - p1[0]
    dz = p2[1] - p1[1]
    L = math.hypot(dx, dz)
    angle = math.degrees(math.atan2(dz, dx))
    
    # Create along Z axis
    barrel = cq.Workplane("XY").circle(r1).extrude(L * 0.6)
    rod = cq.Workplane("XY").circle(r2).extrude(L)
    comp = barrel.union(rod)
    
    # Rotate to align with the vector (dx, dz)
    comp = comp.rotate((0,0,0), (0,1,0), 90 - angle)
    comp = comp.translate((p1[0], 0, p1[1]))
    return comp

def make_pin(x, z, y_offset, length, radius=1.5):
    """Creates a simple cylindrical pin for joints."""
    return cq.Workplane("XZ").workplane(offset=y_offset).center(x, z).circle(radius).extrude(length)

# ==========================================
# Modeling
# ==========================================

tractor = cq.Workplane("XY")

# --- 1. Main Body & Chassis ---
body = cq.Workplane("XY").box(chassis_l, chassis_w, chassis_h).translate((0, 0, chassis_z + chassis_h/2))

# Cut wheel wells into the chassis
well_f = cq.Workplane("XZ").cylinder(40, R_front + 3).translate((front_axle_x, 0, axle_z))
well_r = cq.Workplane("XZ").cylinder(40, R_rear + 3).translate((rear_axle_x, 0, axle_z))
body = body.cut(well_f).cut(well_r)

# Front hood
hood = cq.Workplane("XY").box(hood_l, hood_w, hood_h).translate((hood_x, 0, chassis_z + chassis_h + hood_h/2))
hood = hood.faces(">X").edges(">Z").chamfer(5) # Sloped front
grill = cq.Workplane("YZ").workplane(offset=hood_x + hood_l/2 - 1).center(0, chassis_z + chassis_h + hood_h/2).box(18, 12, 2)

# Rear deck (fenders over rear wheels)
deck = cq.Workplane("XY").box(deck_l, deck_w, deck_h).translate((deck_x, 0, chassis_z + chassis_h + deck_h/2))
deck = deck.edges("|Z").chamfer(5) # Chamfer outer corners

# Side mounts for the loader arms
mount_pts = [(-10, 10), (-10, 32), (10, 32), (25, 20), (25, 10)]
mount = cq.Workplane("XZ").polyline(mount_pts).close().extrude(2, both=True)
mount_L = mount.translate((0, hood_w/2 + 1, 0))
mount_R = mount.translate((0, -(hood_w/2 + 1), 0))

tractor = tractor.union(body).union(hood).union(grill).union(deck).union(mount_L).union(mount_R)

# --- 2. Cab ---
cab_body = (cq.Workplane("XY")
            .workplane(offset=cab_z_offset)
            .center(cab_x, 0)
            .box(cab_l, cab_w, cab_h, centered=(True, True, False)))

# Cut windows
cab_body = (cab_body
            .faces(">X").workplane().center(0, 2).rect(22, 18).cutThruAll()
            .faces(">Y").workplane().center(0, 2).rect(16, 18).cutThruAll())

cab_roof = (cq.Workplane("XY")
            .workplane(offset=cab_z_offset + cab_h)
            .center(cab_x, 0)
            .box(cab_l + 4, cab_w + 4, 6, centered=(True, True, False))
            .edges(">Z").chamfer(2))

# Steering wheel visible inside
sw_col = cq.Workplane("XY").center(-10, 0).circle(1).extrude(32)
sw_wheel = cq.Workplane("XY").center(-10, 0).workplane(offset=32).circle(5).extrude(1)

tractor = tractor.union(cab_body).union(cab_roof).union(sw_col).union(sw_wheel)

# --- 3. Wheels ---
wheel_f = make_wheel(R_front, W_front, 14)
wheel_r = make_wheel(R_rear, W_rear, 16)

wf_L = wheel_f.translate((front_axle_x, track_w/2, axle_z))
wf_R = wheel_f.translate((front_axle_x, -track_w/2, axle_z))
wr_L = wheel_r.translate((rear_axle_x, track_w/2, axle_z))
wr_R = wheel_r.translate((rear_axle_x, -track_w/2, axle_z))

tractor = tractor.union(wf_L).union(wf_R).union(wr_L).union(wr_R)

# --- 4. Loader Arms & Hydraulics ---
arm_pts = [
    (-8, 26), (23, 28), (43, 2), 
    (48, 6), (26, 35), (-5, 34)
]
arm = cq.Workplane("XZ").polyline(arm_pts).close().extrude(arm_thickness/2.0, both=True)
arm = arm.edges("|Y").fillet(2) # Round the arm profile

arm_L = arm.translate((0, arm_y_offset, 0))
arm_R = arm.translate((0, -arm_y_offset, 0))

# Crossbars connecting the arms
cb1 = cq.Workplane("XZ").workplane(offset=-arm_y_offset).center(20, 27).circle(2).extrude(arm_y_offset*2)
cb2 = cq.Workplane("XZ").workplane(offset=-arm_y_offset).center(35, 15).circle(2).extrude(arm_y_offset*2)

# Hydraulic cylinders
cyl_L = make_cyl((5, 12), (20, 27), 2.5, 1.2).translate((0, arm_y_offset, 0))
cyl_R = make_cyl((5, 12), (20, 27), 2.5, 1.2).translate((0, -arm_y_offset, 0))
tilt_cyl_L = make_cyl((25, 28), (42, 10), 2, 1).translate((0, arm_y_offset, 0))
tilt_cyl_R = make_cyl((25, 28), (42, 10), 2, 1).translate((0, -arm_y_offset, 0))

tractor = tractor.union(arm_L).union(arm_R).union(cb1).union(cb2)
tractor = tractor.union(cyl_L).union(cyl_R).union(tilt_cyl_L).union(tilt_cyl_R)

# Add joint pins
tractor = tractor.union(make_pin(-5, 34, -arm_y_offset-2, arm_y_offset*2+4))
tractor = tractor.union(make_pin(20, 27, -arm_y_offset-2, arm_y_offset*2+4))
tractor = tractor.union(make_pin(43, 2, -arm_y_offset-2, arm_y_offset*2+4))

# --- 5. Front Bucket ---
bucket_outer = [(45, 12), (43, -5), (65, -5)]
bucket_inner = [(63, -3), (46, -3), (47, 12)]
bucket_pts = bucket_outer + bucket_inner[::-1]
bucket = cq.Workplane("XZ").polyline(bucket_pts).close().extrude(28, both=True)

# Bucket side plates
side_plate_pts = [(45, 12), (43, -5), (65, -5), (65, 5), (52, 12)]
sp_L = cq.Workplane("XZ").polyline(side_plate_pts).close().extrude(2).translate((0, 28, 0))
sp_R = cq.Workplane("XZ").polyline(side_plate_pts).close().extrude(2).translate((0, -30, 0))

# Mounting brackets on the back of the bucket
bracket_pts = [(38, -2), (38, 10), (46, 10), (44, -2)]
bracket = cq.Workplane("XZ").polyline(bracket_pts).close().extrude(2, both=True)
br_L = bracket.translate((0, arm_y_offset, 0))
br_R = bracket.translate((0, -arm_y_offset, 0))

# Front cutting edge
ce_pts = [(63, -5), (65, -7), (67, -5), (65, -3)]
edge = cq.Workplane("XZ").polyline(ce_pts).close().extrude(28, both=True)

tractor = tractor.union(bucket).union(sp_L).union(sp_R).union(br_L).union(br_R).union(edge)

# --- 6. Details (Exhaust & Intake) ---
exhaust = cq.Workplane("XY").center(35, -10).circle(2).extrude(45)
exhaust_top = cq.Workplane("XY").center(35, -10).workplane(offset=45).circle(2.5).extrude(3)
intake = cq.Workplane("XY").center(35, 10).circle(1.5).extrude(40)

tractor = tractor.union(exhaust).union(exhaust_top).union(intake)

# Export the final model
result = tractor