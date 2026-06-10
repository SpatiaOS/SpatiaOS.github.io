import cadquery as cq
import math

# --------------------------
# Parameter Definitions
# --------------------------
# Main Chassis
chassis_length = 150.0
chassis_width = 80.0
chassis_height = 35.0
chassis_edge_radius = 3.0

# Cab
cab_length = 65.0
cab_width = 60.0
cab_height = 70.0
cab_edge_radius = 4.0
window_size = 22.0
window_offset = 10.0

# Exhaust Pipe
exhaust_radius = 5.0
exhaust_height = 25.0
exhaust_offset_x = -50.0
exhaust_offset_y = 25.0

# Wheels
wheel_radius = 40.0
wheel_thickness = 20.0
tire_lug_depth = 5.0
tire_lug_width = 12.0
num_lugs = 12
hub_radius = 22.0
hub_depth = 5.0
wheel_front_offset = 40.0
wheel_rear_offset = -40.0

# Loader Assembly
arm_thickness = 10.0
arm_width = 70.0
arm_length = 105.0
crossbar_radius = 6.0
num_crossbars = 3

# Bucket
bucket_width = 120.0
bucket_height = 55.0
bucket_depth = 32.0
bucket_thickness = 5.0
bucket_angle = 20.0  # degrees from vertical

# --------------------------
# Model Construction
# --------------------------
# 1. Main Chassis
result = (
    cq.Workplane("XY")
    .box(chassis_length, chassis_width, chassis_height)
    .edges().fillet(chassis_edge_radius)
)

# 2. Operator Cab
cab = (
    cq.Workplane("XY", origin=(0, 0, chassis_height))
    .box(cab_length, cab_width, cab_height)
    .edges("|Z").fillet(cab_edge_radius)
    .faces(">Z").fillet(cab_edge_radius)
    # Cut side windows
    .faces(">Y").workplane().rect(window_size, window_size).cutThruAll()
    .faces("<Y").workplane().rect(window_size, window_size).cutThruAll()
)
result = result.union(cab)

# 3. Exhaust Pipe
exhaust = (
    cq.Workplane("XY", origin=(exhaust_offset_x, exhaust_offset_y, chassis_height + cab_height))
    .circle(exhaust_radius)
    .extrude(exhaust_height)
)
result = result.union(exhaust)

# 4. Wheel Construction (single wheel template)
def make_wheel():
    # Base tire
    wheel = cq.Workplane("YZ").circle(wheel_radius).extrude(wheel_thickness)
    # Add tread lugs
    lug_angle = 360 / num_lugs
    for i in range(num_lugs):
        lug = (
            cq.Workplane("YZ", origin=(0, 0, wheel_thickness/2))
            .transformed(rotate=(0, 0, i * lug_angle))
            .rect(tire_lug_width, wheel_radius + tire_lug_depth)
            .extrude(wheel_thickness)
            .intersect(cq.Workplane("YZ").circle(wheel_radius + tire_lug_depth).extrude(wheel_thickness))
        )
        wheel = wheel.union(lug)
    # Cut hub indent
    wheel = (
        wheel.faces(">X").workplane()
        .circle(hub_radius).cutBlind(-hub_depth)
        .faces("<X").workplane()
        .circle(hub_radius).cutBlind(-hub_depth)
    )
    return wheel

# Position all 4 wheels
wheel_left_front = make_wheel().translate((wheel_front_offset, chassis_width/2 + wheel_thickness/2, chassis_height/2))
wheel_left_rear = make_wheel().translate((wheel_rear_offset, chassis_width/2 + wheel_thickness/2, chassis_height/2))
wheel_right_front = make_wheel().translate((wheel_front_offset, -chassis_width/2 - wheel_thickness/2, chassis_height/2))
wheel_right_rear = make_wheel().translate((wheel_rear_offset, -chassis_width/2 - wheel_thickness/2, chassis_height/2))
result = result.union(wheel_left_front).union(wheel_left_rear).union(wheel_right_front).union(wheel_right_rear)

# 5. Loader Arms
arm_left = (
    cq.Workplane("XZ", origin=(chassis_length/2, chassis_width/2 - arm_thickness/2, chassis_height/2))
    .lineTo(arm_length, -wheel_radius/2)
    .lineTo(arm_length, -wheel_radius/2 + arm_width)
    .lineTo(0, chassis_height/2 + arm_width)
    .close()
    .extrude(arm_thickness)
    .faces(">Y").workplane().pushPoints([(20, chassis_height/2 + 15), (40, chassis_height/2 + 10), (60, chassis_height/2 + 5)])
    .circle(3).cutThruAll()
)
arm_right = arm_left.mirror(mirrorPlane="XZ", basePointVector=(0, 0, 0))
result = result.union(arm_left).union(arm_right)

# Add crossbars between arms
crossbar_spacing = arm_width / (num_crossbars + 1)
for i in range(num_crossbars):
    crossbar = (
        cq.Workplane("XY", origin=(chassis_length/2 + arm_length/3, 0, chassis_height/2 + (i+1)*crossbar_spacing - 10))
        .circle(crossbar_radius)
        .extrude(chassis_width - arm_thickness*2)
    )
    result = result.union(crossbar)

# 6. Front Bucket
bucket = (
    cq.Workplane("YZ", origin=(chassis_length/2 + arm_length, 0, -wheel_radius/2 + bucket_height/2))
    .transformed(rotate=(0, bucket_angle, 0))
    # Bucket profile
    .lineTo(0, bucket_depth)
    .lineTo(bucket_height, bucket_depth * 0.2)
    .lineTo(bucket_height, 0)
    .close()
    .extrude(bucket_width/2, both=True)
    # Hollow out inner bucket
    .faces("<X").workplane(offset=bucket_thickness)
    .lineTo(0, bucket_depth - bucket_thickness*2)
    .lineTo(bucket_height - bucket_thickness*2, (bucket_depth * 0.2) - bucket_thickness)
    .lineTo(bucket_height - bucket_thickness*2, 0)
    .close()
    .cutBlind(bucket_width)
)
result = result.union(bucket)