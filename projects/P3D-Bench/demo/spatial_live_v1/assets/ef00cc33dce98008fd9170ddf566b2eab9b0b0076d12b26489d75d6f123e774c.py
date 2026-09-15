import cadquery as cq
import math

# -------------------------------------------------------------------------
# Parameters
# -------------------------------------------------------------------------

# Large wheel (drum/pulley)
wheel_outer_radius = 80.0    # Outer radius of the smooth rim
wheel_root_radius = 65.0     # Root radius of the internal gear teeth
wheel_tip_radius = 55.0      # Tip radius of the internal gear teeth
wheel_width = 30.0           # Width (thickness) of the wheel along the axle
num_teeth = 36               # Number of internal gear teeth

# Main axle (shaft)
axle_radius = 10.0
axle_length = 120.0          # Length from wheel center to crank hub

# Base and support structure
base_length = 160.0
base_width = 100.0
base_thickness = 10.0
support_thickness = 15.0

# Crank mechanism
crank_hub_radius = 15.0
crank_hub_length = 25.0
crank_arm_length = 110.0
crank_arm_thickness = 12.0
crank_arm_width = 20.0
grip_radius = 8.0
grip_length = 40.0

# -------------------------------------------------------------------------
# Geometry Construction
# -------------------------------------------------------------------------

# 1. Wheel Body (Outer smooth rim)
wheel_body = (
    cq.Workplane("YZ")
    .circle(wheel_outer_radius)
    .circle(wheel_root_radius)
    .extrude(wheel_width)
    .translate((-wheel_width / 2, 0, 0))  # Center the wheel on the origin
)

# 2. Internal Gear Teeth
# Calculate angular widths for root and tip of a single tooth
pitch_angle = 360.0 / num_teeth
tooth_w_root = 2 * wheel_root_radius * math.sin(math.radians(pitch_angle / 4))
tooth_w_tip = 2 * wheel_tip_radius * math.sin(math.radians(pitch_angle / 6))

# Create a single tooth profile (trapezoid) and extrude it
tooth = (
    cq.Workplane("YZ")
    .polyline([
        (wheel_root_radius, -tooth_w_root / 2),
        (wheel_tip_radius, -tooth_w_tip / 2),
        (wheel_tip_radius, tooth_w_tip / 2),
        (wheel_root_radius, tooth_w_root / 2)
    ])
    .close()
    .extrude(wheel_width)
    .translate((-wheel_width / 2, 0, 0))
)

# Pattern the tooth around the wheel
teeth = cq.Workplane("YZ")
for i in range(num_teeth):
    angle = i * pitch_angle
    # Rotate around the X-axis (the axle centerline)
    teeth = teeth.union(tooth.rotate((0, 0, 0), (1, 0, 0), angle))

# Combine the wheel body and the teeth
wheel = wheel_body.union(teeth)

# 3. Main Axle
# Extends from the center of the wheel to the left (negative X)
axle = (
    cq.Workplane("YZ")
    .circle(axle_radius)
    .extrude(axle_length)
    .translate((-wheel_width / 2, 0, 0))
)

# 4. Central Hub / Pinion
# A small cylindrical hub on the axle inside the large wheel
pinion = (
    cq.Workplane("YZ")
    .circle(25.0)
    .circle(axle_radius)
    .extrude(20.0)
    .translate((-wheel_width / 2, 0, 0))
)

# 5. Base Plate
# Positioned at the bottom, supporting the entire structure
base = (
    cq.Workplane("XY")
    .box(base_length, base_width, base_thickness)
    .translate((0, 0, -wheel_outer_radius - base_thickness / 2))
)

# Add simple mounting feet for visual detail
feet = (
    cq.Workplane("XY")
    .rect(base_length - 20, base_width - 20)
    .rect(base_length - 40, base_width - 40)
    .extrude(base_thickness)
    .translate((0, 0, -wheel_outer_radius - base_thickness))
)
base = base.union(feet)

# 6. Vertical Support Bracket
# A triangular plate connecting the base to the axle
support_profile = [
    (base_length / 2, -wheel_outer_radius - base_thickness / 2),
    (-base_length / 2, -wheel_outer_radius - base_thickness / 2),
    (-wheel_width / 2 - 10, 0)  # Top point at the axle
]
support = (
    cq.Workplane("XZ")
    .polyline(support_profile)
    .close()
    .extrude(support_thickness, both=True)
)

# 7. Crank Hub
# Attached to the end of the axle
end_x = -wheel_width / 2 - axle_length
crank_hub = (
    cq.Workplane("YZ")
    .circle(crank_hub_radius)
    .circle(axle_radius)
    .extrude(crank_hub_length)
    .translate((end_x, 0, 0))
)

# 8. Crank Arm
# A rectangular bar extending upwards from the hub
crank_arm = (
    cq.Workplane("XZ")
    .center(end_x + crank_hub_length / 2, crank_arm_length / 2)
    .rect(crank_arm_thickness, crank_arm_length)
    .extrude(crank_arm_width, both=True)
)

# 9. Handle Grip
# A cylindrical grip at the end of the crank arm, perpendicular to the arm
grip = (
    cq.Workplane("XY")
    .center(end_x + crank_hub_length / 2, 0)
    .circle(grip_radius)
    .extrude(grip_length, both=True)
    .translate((0, 0, crank_arm_length))
)

# -------------------------------------------------------------------------
# Final Assembly
# -------------------------------------------------------------------------

result = (
    wheel
    .union(axle)
    .union(pinion)
    .union(base)
    .union(support)
    .union(crank_hub)
    .union(crank_arm)
    .union(grip)
)

# Ensure the final model is a clean, valid solid
result = result.clean()