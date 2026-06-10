import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================
pedestal_base_radius = 30.0
pedestal_height = 130.0

crown_outer_radius = 24.0
crown_inner_radius = 18.5
crown_height = 20.0

sphere_radius = 3.0
arm_thickness = 7.5

bar_width = 7.5
top_bar_length = 120.0
lower_bar_length = 101.0

# ==========================================
# Modeling
# ==========================================

# 1. Pedestal Body
# Revolved profile capturing the flared base, tapered body, bulging shoulder, and concave neck
pedestal = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(pedestal_base_radius, 0)
    .spline([
        (28, 5),
        (22, 15),
        (20, 25),
        (24, 55),
        (32, 85),
        (22, 100),
        (16, 110),
        (20, 120)
    ])
    .lineTo(crown_outer_radius, 125)
    .lineTo(crown_outer_radius, pedestal_height)
    .lineTo(0, pedestal_height)
    .close()
    .revolve()
)

# 2. Serrated Ring (Crown)
# Base cylinder with V-notches cut out to form 10 teeth
crown = (
    cq.Workplane("XY")
    .workplane(offset=pedestal_height)
    .circle(crown_outer_radius)
    .extrude(crown_height)
)

# Cutter for the V-notches
notch_cutter = (
    cq.Workplane("YZ")
    .moveTo(0, pedestal_height + crown_height / 2)
    .lineTo(10.0, pedestal_height + crown_height + 0.1)
    .lineTo(-10.0, pedestal_height + crown_height + 0.1)
    .close()
    .extrude(crown_outer_radius * 3, both=True)
)

# Apply 5 cuts rotated to create 10 notches (since the cutter spans both sides)
for i in range(5):
    angle = i * 36
    rotated_cutter = notch_cutter.rotate((0, 0, 0), (0, 0, 1), angle)
    crown = crown.cut(rotated_cutter)

# Central bore through the crown
# Created from a fresh workplane to avoid non-planar face selection issues after V-cuts
crown_hole = (
    cq.Workplane("XY")
    .workplane(offset=pedestal_height + crown_height + 1.0)
    .circle(crown_inner_radius)
    .extrude(-crown_height - 2.0)
)
crown = crown.cut(crown_hole)

# 3. Bearing Balls (Spheres)
# 10 spheres arrayed around the tips of the crown teeth
sphere_pts = []
for i in range(10):
    angle = 18 + i * 36
    rad = math.radians(angle)
    x = crown_outer_radius * math.cos(rad)
    y = crown_outer_radius * math.sin(rad)
    sphere_pts.append((x, y))

spheres = (
    cq.Workplane("XY")
    .workplane(offset=pedestal_height + crown_height)
    .pushPoints(sphere_pts)
    .sphere(sphere_radius)
)

# 4. Swept Handles (Curved Arms)
# Main vertical structural arms - using threePointArc to prevent invalid zero-length close edges
right_arm = (
    cq.Workplane("XZ")
    .moveTo(45.5, 122.5)
    .lineTo(53, 122.5)
    .threePointArc((58, 85), (37.5, 10))
    .lineTo(30, 10)
    .threePointArc((50.5, 85), (45.5, 122.4))
    .close()
    .extrude(arm_thickness / 2, both=True)
)
left_arm = right_arm.mirror("YZ")

# 5. Parallel Keys (Bridging Bars)
# Top horizontal bar with rounded ends
top_bar = (
    cq.Workplane("XY")
    .workplane(offset=118.75)
    .moveTo(0, 0)
    .rect(top_bar_length, bar_width)
    .extrude(bar_width / 2, both=True)
    .edges("|Z and >X").fillet(bar_width / 2 - 0.1)
    .edges("|Z and <X").fillet(bar_width / 2 - 0.1)
)

# Lower horizontal bar conforming to the inner arms
lower_bar = (
    cq.Workplane("XY")
    .workplane(offset=85)
    .moveTo(0, 0)
    .rect(lower_bar_length, bar_width)
    .extrude(bar_width / 2, both=True)
)

# 6. Curved Support Strips (Thin Ribbons)
# Four thin S-curved decorative strips - using threePointArc to ensure robust geometric closure
right_strip = (
    cq.Workplane("XZ")
    .moveTo(28, 0)
    .lineTo(30, 0)
    .threePointArc((45, 60), (30, 110))
    .lineTo(28, 110)
    .threePointArc((43, 60), (28, 0.1))
    .close()
    .extrude(0.5, both=True)
)
right_strip_front = right_strip.translate((0, 8, 0))
right_strip_back = right_strip.translate((0, -8, 0))
left_strip_front = right_strip_front.mirror("YZ")
left_strip_back = right_strip_back.mirror("YZ")

# 7. Profile-Cut Clips
# C-shaped hook features engaging the arms to the neck
right_clip = (
    cq.Workplane("XZ")
    .moveTo(20, 105)
    .lineTo(40, 105)
    .lineTo(40, 115)
    .lineTo(20, 115)
    .lineTo(20, 113)
    .lineTo(35, 113)
    .lineTo(35, 107)
    .lineTo(20, 107)
    .close()
    .extrude(1.0, both=True)
)
left_clip = right_clip.mirror("YZ")

# ==========================================
# Assembly
# ==========================================
result = (
    pedestal
    .union(crown)
    .union(spheres)
    .union(top_bar)
    .union(lower_bar)
    .union(right_arm)
    .union(left_arm)
    .union(right_strip_front)
    .union(right_strip_back)
    .union(left_strip_front)
    .union(left_strip_back)
    .union(right_clip)
    .union(left_clip)
)