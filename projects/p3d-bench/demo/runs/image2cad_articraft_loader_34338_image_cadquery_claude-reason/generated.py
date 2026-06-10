import cadquery as cq
import math

# =========================================================
# Wheel Loader (Front-End Loader) - Parametric CadQuery Model
# =========================================================

# --- Wheel Parameters ---
wheel_radius = 25.0           # Tire outer radius
wheel_width = 14.0            # Tire width
tire_thickness = 7.0          # Tire ring cross-section thickness
hub_radius = 8.0              # Center hub radius
num_treads = 14               # Number of tread lugs
tread_height = 4.0            # Tread lug radial protrusion
tread_size = 4.0              # Tread lug width

# --- Vehicle Layout ---
front_axle_x = -18.0          # Front axle X position
rear_axle_x = 58.0            # Rear axle X position
body_half_width = 28.0        # Half-width of main body
wheel_y = body_half_width + wheel_width / 2 + 2.0  # Wheel center Y
wheel_z = wheel_radius + tread_height              # Wheel center height

# --- Chassis ---
chassis_length = 90.0
chassis_width = 56.0
chassis_height = 14.0
chassis_x = (front_axle_x + rear_axle_x) / 2
chassis_z = wheel_z + 4.0

# --- Engine Compartment ---
engine_length = 40.0
engine_width = 50.0
engine_height = 24.0
engine_x = rear_axle_x - 5.0
engine_z = chassis_z + chassis_height / 2 + engine_height / 2

# --- Cab ---
cab_length = 26.0
cab_width = 42.0
cab_height = 28.0
cab_wall = 2.5
cab_x = front_axle_x + 18.0
cab_z = chassis_z + chassis_height / 2 + cab_height / 2

# --- Bucket ---
bucket_width = 78.0
bucket_depth = 42.0
bucket_height = 30.0
bucket_wall_t = 2.5
bucket_pivot_x = -40.0
bucket_base_z = 8.0
bucket_tilt = -12.0           # Tilt angle in degrees

# --- Lift Arms ---
arm_y_offset = body_half_width - 5.0

# --- Exhaust ---
exhaust_radius = 3.0
exhaust_height = 18.0


# =========================================================
# Helper: Create a single wheel with tread lugs
# =========================================================
def make_wheel():
    """Create one wheel centered at origin with axis along Y."""
    # Tire ring (outer rubber)
    tire = (
        cq.Workplane("XZ")
        .circle(wheel_radius)
        .circle(wheel_radius - tire_thickness)
        .extrude(wheel_width)
        .translate((0, -wheel_width / 2, 0))
    )

    # Inner sidewall connecting tire to hub
    sidewall = (
        cq.Workplane("XZ")
        .circle(wheel_radius - tire_thickness)
        .circle(hub_radius)
        .extrude(3.0)
        .translate((0, -1.5, 0))
    )

    # Center hub cylinder
    hub = (
        cq.Workplane("XZ")
        .circle(hub_radius)
        .extrude(5.0)
        .translate((0, -2.5, 0))
    )

    wheel = tire.union(sidewall).union(hub)

    # Add tread lugs evenly spaced around circumference
    for i in range(num_treads):
        angle = 360.0 / num_treads * i
        # Create lug at top of wheel, then rotate into position
        lug = (
            cq.Workplane("XY")
            .box(tread_size, wheel_width * 0.7, tread_height)
            .translate((0, 0, wheel_radius + tread_height / 2 - 1.0))
            .rotate((0, 0, 0), (0, 1, 0), angle)
        )
        wheel = wheel.union(lug)

    return wheel


# =========================================================
# 1. Main Chassis / Frame
# =========================================================
chassis = (
    cq.Workplane("XY")
    .box(chassis_length, chassis_width, chassis_height)
    .translate((chassis_x, 0, chassis_z))
)

# =========================================================
# 2. Engine Compartment (rear section)
# =========================================================
engine = (
    cq.Workplane("XY")
    .box(engine_length, engine_width, engine_height)
    .edges("|Z").fillet(2.0)
    .translate((engine_x, 0, engine_z))
)

# Hood plate on top of engine
hood = (
    cq.Workplane("XY")
    .box(engine_length + 2, engine_width + 2, 3.0)
    .edges("|Z").fillet(2.5)
    .translate((engine_x, 0, engine_z + engine_height / 2 + 1.5))
)

# =========================================================
# 3. Operator Cab with windows
# =========================================================
# Outer cab shell
cab_shell = (
    cq.Workplane("XY")
    .box(cab_length, cab_width, cab_height)
    .edges("|Z").fillet(1.5)
)

# Hollow out interior
cab_interior = (
    cq.Workplane("XY")
    .box(cab_length - 2 * cab_wall, cab_width - 2 * cab_wall, cab_height - cab_wall)
    .translate((0, 0, cab_wall))
)
cab = cab_shell.cut(cab_interior)

# Front window opening
cab = cab.cut(
    cq.Workplane("XY")
    .box(cab_wall + 2, 28.0, 16.0)
    .translate((-cab_length / 2, 0, 3.0))
)

# Side window openings (left and right)
for y_sign in [1, -1]:
    cab = cab.cut(
        cq.Workplane("XY")
        .box(16.0, cab_wall + 2, 16.0)
        .translate((0, y_sign * cab_width / 2, 3.0))
    )

# Rear window opening
cab = cab.cut(
    cq.Workplane("XY")
    .box(cab_wall + 2, 26.0, 14.0)
    .translate((cab_length / 2, 0, 3.0))
)

# Move cab to final position
cab = cab.translate((cab_x, 0, cab_z))

# =========================================================
# 4. Front Grille / Radiator Area
# =========================================================
grille = (
    cq.Workplane("XY")
    .box(16.0, 48.0, 18.0)
    .translate((front_axle_x - 3.0, 0, chassis_z + chassis_height / 2 + 9.0))
)

# =========================================================
# 5. Front Bucket (5-sided open-top scoop)
# =========================================================
bkt_cx = bucket_pivot_x - bucket_depth / 2

# Bottom plate
bkt_bottom = (
    cq.Workplane("XY")
    .box(bucket_depth, bucket_width, bucket_wall_t)
)

# Back wall (connects to lift arms)
bkt_back = (
    cq.Workplane("XY")
    .box(bucket_wall_t, bucket_width, bucket_height)
    .translate((bucket_depth / 2, 0, bucket_height / 2))
)

# Left side wall
bkt_left = (
    cq.Workplane("XY")
    .box(bucket_depth, bucket_wall_t, bucket_height)
    .translate((0, bucket_width / 2, bucket_height / 2))
)

# Right side wall
bkt_right = (
    cq.Workplane("XY")
    .box(bucket_depth, bucket_wall_t, bucket_height)
    .translate((0, -bucket_width / 2, bucket_height / 2))
)

# Cutting edge (reinforced lip at front bottom)
cutting_edge = (
    cq.Workplane("XY")
    .box(3.0, bucket_width + 4.0, 4.0)
    .translate((-bucket_depth / 2 + 1.5, 0, -2.0))
)

# Assemble bucket parts
bucket = (
    bkt_bottom
    .union(bkt_back)
    .union(bkt_left)
    .union(bkt_right)
    .union(cutting_edge)
)

# Translate to world position, then tilt forward
bucket = bucket.translate((bkt_cx, 0, bucket_base_z))
bucket = bucket.rotate(
    (bucket_pivot_x, 0, bucket_base_z),
    (bucket_pivot_x, 1, bucket_base_z),
    bucket_tilt
)

# =========================================================
# 6. Lift Arms and Hydraulic Cylinders
# =========================================================
arm_start_x = cab_x - 5.0
arm_end_x = bucket_pivot_x + 5.0
arm_length = arm_start_x - arm_end_x
arm_center_x = (arm_start_x + arm_end_x) / 2
arm_z = chassis_z + 18.0

# Left lift arm
left_arm = (
    cq.Workplane("XY")
    .box(arm_length, 4.0, 4.5)
    .translate((arm_center_x, arm_y_offset, arm_z))
)

# Right lift arm
right_arm = (
    cq.Workplane("XY")
    .box(arm_length, 4.0, 4.5)
    .translate((arm_center_x, -arm_y_offset, arm_z))
)

# Left hydraulic cylinder (below arm)
cyl_len = arm_length * 0.7
left_cyl = (
    cq.Workplane("XY")
    .box(cyl_len, 3.0, 3.0)
    .translate((arm_center_x + 3.0, arm_y_offset, arm_z - 7.0))
)

# Right hydraulic cylinder
right_cyl = (
    cq.Workplane("XY")
    .box(cyl_len, 3.0, 3.0)
    .translate((arm_center_x + 3.0, -arm_y_offset, arm_z - 7.0))
)

# =========================================================
# 7. Exhaust Stack (cylinder on rear right)
# =========================================================
exhaust = (
    cq.Workplane("XY")
    .circle(exhaust_radius)
    .extrude(exhaust_height)
    .translate((rear_axle_x + 3.0, -17.0, engine_z + engine_height / 2))
)

# =========================================================
# 8. Create and Position Four Wheels
# =========================================================
wheel_template = make_wheel()

front_left_wheel = wheel_template.translate((front_axle_x, wheel_y, wheel_z))
front_right_wheel = wheel_template.translate((front_axle_x, -wheel_y, wheel_z))
rear_left_wheel = wheel_template.translate((rear_axle_x, wheel_y, wheel_z))
rear_right_wheel = wheel_template.translate((rear_axle_x, -wheel_y, wheel_z))

# =========================================================
# 9. Rear Wheel Fenders (flat plates over rear wheels)
# =========================================================
fender_z = wheel_z + wheel_radius + tread_height + 2.0

rear_left_fender = (
    cq.Workplane("XY")
    .box(wheel_radius * 1.5, wheel_width + 6.0, 2.0)
    .translate((rear_axle_x, wheel_y, fender_z))
)

rear_right_fender = (
    cq.Workplane("XY")
    .box(wheel_radius * 1.5, wheel_width + 6.0, 2.0)
    .translate((rear_axle_x, -wheel_y, fender_z))
)

# =========================================================
# 10. Counterweight at rear
# =========================================================
counterweight = (
    cq.Workplane("XY")
    .box(8.0, chassis_width + 4, engine_height + 6)
    .edges("|Z").fillet(2.0)
    .translate((rear_axle_x + engine_length / 2 - 12.0, 0, engine_z))
)

# =========================================================
# Final Assembly - Union all components
# =========================================================
result = (
    chassis
    .union(engine)
    .union(hood)
    .union(cab)
    .union(grille)
    .union(counterweight)
    .union(bucket)
    .union(left_arm)
    .union(right_arm)
    .union(left_cyl)
    .union(right_cyl)
    .union(exhaust)
    .union(front_left_wheel)
    .union(front_right_wheel)
    .union(rear_left_wheel)
    .union(rear_right_wheel)
    .union(rear_left_fender)
    .union(rear_right_fender)
)