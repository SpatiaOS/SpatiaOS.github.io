import cadquery as cq
import math

# =============================================================================
# Toy Bulldozer / Front Loader Model Parameters
# =============================================================================

# Main body dimensions
body_length = 60.0
body_width = 35.0
body_height = 15.0

# Cabin dimensions
cabin_length = 22.0
cabin_width = 28.0
cabin_height = 20.0
cabin_roof_overhang = 2.0

# Wheel dimensions
wheel_diameter = 22.0
wheel_width = 12.0
wheel_hub_diameter = 10.0
tread_depth = 3.0
num_treads = 8

# Front loader dimensions
bucket_width = 38.0
bucket_height = 18.0
bucket_depth = 20.0
bucket_thickness = 2.0
loader_arm_width = 6.0

# Exhaust pipe dimensions
exhaust_diameter = 4.0
exhaust_height = 12.0

# Positioning offsets
wheelbase = 40.0  # Distance between wheel centers
ground_clearance = wheel_diameter / 2 - 2.0


def create_wheel():
    """Create a single treaded wheel with hub"""
    # Base cylinder for wheel
    wheel = (
        cq.Workplane("XY")
        .circle(wheel_diameter / 2)
        .extrude(wheel_width)
    )
    
    # Create treads around the circumference by rotating copies
    # Single tread profile - triangular shape protruding from rim
    tread = (
        cq.Workplane("XZ")
        .transformed(offset=(wheel_diameter / 2 - tread_depth / 2, 0, -wheel_width / 2))
        .polygon(3, tread_depth * 1.8)
        .extrude(wheel_width + 4)  # Extend through wheel width
    )
    
    # Rotate and union treads around the wheel
    for i in range(num_treads):
        angle = i * (360.0 / num_treads)
        rotated_tread = tread.rotate((0, 0, 0), (0, 0, 1), angle)
        wheel = wheel.union(rotated_tread)
    
    # Add central hub (protruding cylinder) - using both=True for symmetric extrusion
    hub = (
        cq.Workplane("XY")
        .circle(wheel_hub_diameter / 2)
        .extrude(wheel_width + 4, both=True)
        .translate((0, 0, -2))
    )
    wheel = wheel.union(hub)
    
    # Add small center axle hole detail (recessed circle on hub face)
    wheel = (
        wheel
        .faces(">Z")
        .workplane()
        .circle(wheel_hub_diameter / 4)
        .cutThruAll()
    )
    
    return wheel


def create_cabin():
    """Create the operator cabin with windows and roof"""
    # Main cabin box
    cabin = (
        cq.Workplane("XY")
        .box(cabin_length, cabin_width, cabin_height)
    )
    
    # Add roof overhang (slightly wider than cabin)
    roof = (
        cq.Workplane("XY")
        .workplane(offset=cabin_height)
        .box(cabin_length + cabin_roof_overhang * 2, 
             cabin_width + cabin_roof_overhang * 2, 
             2.0)
    )
    cabin = cabin.union(roof)
    
    # Fillet top edges of cabin for rounded appearance
    cabin = cabin.edges("|Z").fillet(1.5)
    
    # Window cutouts
    window_width = 8.0
    window_height = 12.0
    
    # Front window (on +Y face)
    front_window = (
        cq.Workplane("YZ")
        .transformed(offset=(cabin_length / 2 - 0.5, 0, cabin_height * 0.55))
        .rect(window_width, window_height)
        .extrude(-3)
    )
    cabin = cabin.cut(front_window)
    
    # Left side window (on +X face)
    left_window = (
        cq.Workplane("XZ")
        .transformed(offset=(cabin_width / 2 - 0.5, 0, cabin_height * 0.55))
        .rect(window_height * 0.7, window_height * 0.9)
        .extrude(-3)
    )
    cabin = cabin.cut(left_window)
    
    # Right side window (on -X face)
    right_window = (
        cq.Workplane("XZ")
        .transformed(offset=(-cabin_width / 2 + 0.5, 0, cabin_height * 0.55))
        .rect(window_height * 0.7, window_height * 0.9)
        .extrude(3)
    )
    cabin = cabin.cut(right_window)
    
    return cabin


def create_bucket():
    """Create the front loader bucket"""
    # Back plate of bucket
    back_plate = (
        cq.Workplane("YZ")
        .rect(bucket_width, bucket_height)
        .extrude(bucket_thickness)
        .translate((bucket_depth / 2 - bucket_thickness / 2, 0, 0))
    )
    
    # Bottom plate (angled floor)
    bottom_plate = (
        cq.Workplane("XZ")
        .rect(bucket_depth * 0.85, bucket_width - 6)
        .extrude(bucket_thickness)
        .rotate((0, 0, 0), (1, 0, 0), 20)
        .translate((0, 0, -bucket_height * 0.35))
    )
    
    # Side plates (left and right)
    side_shape = (
        cq.Workplane("XZ")
        .moveTo(0, (bucket_width - 4) / 2)
        .lineTo(bucket_depth * 0.7, (bucket_width - 4) / 2)
        .lineTo(bucket_depth, -(bucket_width - 4) / 2 + 4)
        .lineTo(0, -(bucket_width - 4) / 2)
        .close()
        .extrude(bucket_thickness)
    )
    
    left_side = side_shape.translate((0, (bucket_width - 4) / 2 - bucket_thickness / 2, 0))
    right_side = side_shape.translate((0, -(bucket_width - 4) / 2 + bucket_thickness / 2, 0))
    
    # Combine all parts
    bucket = back_plate.union(bottom_plate).union(left_side).union(right_side)
    
    # Round some edges
    bucket = bucket.edges("|Z").fillet(0.8)
    
    return bucket


def create_loader_arms():
    """Create the loader arm assembly connecting bucket to body"""
    arm_length = 28.0
    
    # Main left arm
    left_arm = (
        cq.Workplane("XZ")
        .rect(loader_arm_width, 5.0)
        .extrude(arm_length)
        .rotate((0, 0, 0), (0, 1, 0), -20)
        .translate((0, body_width / 3, 0))
    )
    
    # Main right arm  
    right_arm = (
        cq.Workplane("XZ")
        .rect(loader_arm_width, 5.0)
        .extrude(arm_length)
        .rotate((0, 0, 0), (0, 1, 0), -20)
        .translate((0, -body_width / 3, 0))
    )
    
    # Cross brace between arms
    cross_brace = (
        cq.Workplane("YZ")
        .rect(body_width * 0.5, 4.0)
        .extrude(5.0)
        .translate((-arm_length * 0.35, 0, 0))
    )
    
    # Bucket mounting plate
    mount_plate = (
        cq.Workplane("YZ")
        .rect(body_width * 0.6, 8.0)
        .extrude(3.0)
        .translate((-arm_length + 2, 0, 0))
    )
    
    return left_arm.union(right_arm).union(cross_brace).union(mount_plate)


# =============================================================================
# Main Assembly Construction
# =============================================================================

# Start with main body/chassis base
result = (
    cq.Workplane("XY")
    .box(body_length, body_width, body_height)
)

# Add raised front section (engine hood area)
front_hood = (
    cq.Workplane("XY")
    .box(body_length * 0.45, body_width * 0.95, body_height * 0.65)
    .translate((-body_length * 0.27, 0, body_height * 0.32))
)
result = result.union(front_hood)

# Add cabin on top (positioned towards rear-center)
cabin_pos_z = body_height + body_height * 0.32 + cabin_height / 2
cabin = create_cabin().translate((body_length * 0.08, 0, cabin_pos_z))
result = result.union(cabin)

# Add exhaust pipe (rear right side)
exhaust_pipe = (
    cq.Workplane("XY")
    .circle(exhaust_diameter / 2)
    .extrude(exhaust_height)
    .translate((body_length * 0.32, body_width / 2 - 6, body_height + body_height * 0.32))
)
result = result.union(exhaust_pipe)

# Add smaller secondary pipe (air intake or muffler)
secondary_pipe = (
    cq.Workplane("XY")
    .circle(exhaust_diameter * 0.6 / 2)
    .extrude(exhaust_height * 0.65)
    .translate((body_length * 0.22, -body_width / 2 + 7, body_height + body_height * 0.25))
)
result = result.union(secondary_pipe)

# Create wheel model once and place 4 instances
wheel_model = create_wheel()

# Front wheels
front_left_wheel = wheel_model.translate((
    -wheelbase / 2, 
    body_width / 2 + wheel_width / 2 - 1.5, 
    ground_clearance
))
result = result.union(front_left_wheel)

front_right_wheel = wheel_model.translate((
    -wheelbase / 2,
    -body_width / 2 - wheel_width / 2 + 1.5,
    ground_clearance
))
result = result.union(front_right_wheel)

# Rear wheels
rear_left_wheel = wheel_model.translate((
    wheelbase / 2,
    body_width / 2 + wheel_width / 2 - 1.5,
    ground_clearance
))
result = result.union(rear_left_wheel)

rear_right_wheel = wheel_model.translate((
    wheelbase / 2,
    -body_width / 2 - wheel_width / 2 + 1.5,
    ground_clearance
))
result = result.union(rear_right_wheel)

# Add loader arms assembly
loader_arms = create_loader_arms().translate((
    -body_length / 2 - 2,
    0,
    body_height * 0.45
))
result = result.union(loader_arms)

# Add front bucket
bucket_offset_x = -body_length / 2 - bucket_depth / 2 - 18
bucket = create_bucket().translate((
    bucket_offset_x,
    0,
    ground_clearance + bucket_height * 0.25
))
result = result.union(bucket)

# Add step/ladder detail on left side
step_base = (
    cq.Workplane("XZ")
    .rect(10.0, 1.5)
    .extrude(body_width * 0.15)
    .translate((-body_length * 0.15, body_width / 2 + body_width * 0.075, 4))
)
result = result.union(step_base)

# Add ladder rungs
for i in range(3):
    rung = (
        cq.Workplane("XZ")
        .rect(1.5, 6.0)
        .extrude(body_width * 0.2)
        .translate((-body_length * 0.12 - i * 4, body_width / 2 + body_width * 0.1, 8 + i * 5))
    )
    result = result.union(rung)

# Apply gentle fillets to main body edges for realistic toy appearance
try:
    result = result.edges(
        cq.selectors.AndSelector(
            cq.selectors.TypeSelector("SOLID"),
            cq.selectors.NearestToPointSelector((0, 0, body_height))
        )
    ).fillet(1.0)
except:
    pass  # Skip filleting if edge selection fails