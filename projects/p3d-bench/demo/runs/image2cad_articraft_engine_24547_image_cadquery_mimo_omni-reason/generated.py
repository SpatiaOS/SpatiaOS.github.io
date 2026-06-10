import cadquery as cq
import math

# ----------------------
# Parameter Definitions (all in millimeters)
# ----------------------
# Base dimensions
base_lower_length = 120.0
base_lower_width = 80.0
base_lower_height = 8.0
base_upper_length = 100.0
base_upper_width = 60.0
base_upper_height = 15.0

# Flywheel parameters
flywheel_outer_dia = 100.0
flywheel_thickness = 10.0
flywheel_hub_dia = 20.0
flywheel_hole_dia = 25.0
flywheel_hole_count = 4

# Central shaft parameters
shaft_main_dia = 18.0
shaft_main_length = 140.0
shaft_small_dia = 12.0
shaft_small_length = 20.0

# Motor/coil assembly parameters
motor_outer_dia = 60.0
motor_length = 80.0
motor_cap_dia = 65.0
motor_cap_height = 5.0
motor_rib_count = 20
motor_rib_depth = 2.0

# ----------------------
# Build the base assembly
# ----------------------
# Lower base plate
base = (
    cq.Workplane("XY")
    .box(base_lower_length, base_lower_width, base_lower_height)
    .edges("|Z").fillet(2.0)  # Fillet base edges
)
# Upper raised platform
base = (
    base
    .workplane(offset=base_lower_height)
    .box(base_upper_length, base_upper_width, base_upper_height)
    .edges("|Z").fillet(1.5)
    .combine()
)

# ----------------------
# Build the flywheels (two identical)
# ----------------------
def make_flywheel():
    # Create main wheel body
    wheel = (
        cq.Workplane("XZ")
        .circle(flywheel_outer_dia/2)
        .circle(flywheel_hub_dia/2)
        .extrude(flywheel_thickness)
    )
    # Add 4 cutout holes, evenly spaced
    hole_angle_step = 360 / flywheel_hole_count
    for i in range(flywheel_hole_count):
        angle = math.radians(i * hole_angle_step)
        x_pos = (flywheel_outer_dia/2 - flywheel_hole_dia/2 - 5) * math.cos(angle)
        y_pos = (flywheel_outer_dia/2 - flywheel_hole_dia/2 - 5) * math.sin(angle)
        wheel = (
            wheel
            .workplane(offset=flywheel_thickness/2)
            .center(x_pos, y_pos)
            .hole(flywheel_hole_dia)
        )
    return wheel

# Position first flywheel
flywheel_1 = make_flywheel().translate((-shaft_main_length/2 + 10, 0, base_lower_height + base_upper_height + flywheel_thickness/2))
# Position second flywheel
flywheel_2 = make_flywheel().translate((shaft_main_length/2 - 10, 0, base_lower_height + base_upper_height + flywheel_thickness/2))

# ----------------------
# Build the central shaft
# ----------------------
shaft = (
    cq.Workplane("XZ")
    .circle(shaft_main_dia/2)
    .extrude(shaft_main_length)
    .translate((-shaft_main_length/2, 0, base_lower_height + base_upper_height + flywheel_thickness/2))
)
# Add smaller end shaft
shaft = (
    shaft
    .workplane(offset=shaft_main_length/2)
    .circle(shaft_small_dia/2)
    .extrude(shaft_small_length)
    .combine()
)

# ----------------------
# Build the motor/coil assembly
# ----------------------
# Main motor coil body
motor = (
    cq.Workplane("XZ")
    .circle(motor_outer_dia/2)
    .extrude(motor_length)
    .translate((-shaft_main_length/2 - motor_length/2 + 15, 0, base_lower_height + base_upper_height + flywheel_thickness/2))
)

# Add ribbed texture using extruded rings instead of cutThruAll
# Create a thin ring profile for the groove
for i in range(motor_rib_count):
    groove_pos = -motor_length/2 + (i+1)*(motor_length/(motor_rib_count+1))
    # Create a thin ring (annulus) that will be cut from the motor
    groove_ring = (
        cq.Workplane("XZ")
        .circle(motor_outer_dia/2)
        .circle(motor_outer_dia/2 - motor_rib_depth)
        .extrude(1.0)  # Thin extrusion for the groove
        .translate((groove_pos, 0, 0))
    )
    # Cut the groove ring from the motor
    motor = motor.cut(groove_ring)

# Add top cap
motor = (
    motor
    .workplane(offset=motor_length/2)
    .circle(motor_cap_dia/2)
    .extrude(motor_cap_height)
    .combine()
)

# ----------------------
# Combine all parts into final result
# ----------------------
result = (
    base
    .add(flywheel_1)
    .add(flywheel_2)
    .add(shaft)
    .add(motor)
    .combine()
)