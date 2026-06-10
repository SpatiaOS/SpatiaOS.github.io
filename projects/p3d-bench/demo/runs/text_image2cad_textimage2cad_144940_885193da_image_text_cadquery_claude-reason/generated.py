import cadquery as cq
from math import sin, cos, radians

# Parameters
pin_30_diameter = 30.0
pin_30_length_short = 90.0
pin_30_length_long = 100.0

pin_40_diameter = 40.0
pin_40_length = 100.0

flat_bar_length = 600.0
flat_bar_width = 50.0
flat_bar_thickness = 10.0

pulley_outer_diameter = 230.0
pulley_thickness = 61.0
pulley_hub_diameter = 140.0
pulley_bolt_hole_diameter = 14.0
pulley_bolt_circle_diameter = 100.0
pulley_notch_radius = 4.0

bracket_arm_length = 380.0
bracket_width = 400.0
bracket_thickness = 80.0
bracket_boss_diameter = 60.0
bracket_hole_diameter = 40.0
bracket_hole_depth = 100.0
bracket_clevis_hole_diameter = 30.0

link_arm_width = 60.0
link_arm_height = 380.0
link_arm_span = 410.0
link_boss_outer_diameter = 60.0
link_boss_hole_diameter = 40.0
link_boss_hole_depth = 100.0
link_socket_diameter = 50.0
link_socket_depth = 15.0

# Flat bar (grounded at top)
flat_bar = (
    cq.Workplane("XY")
    .box(flat_bar_length, flat_bar_width, flat_bar_thickness)
    .translate((0, 0, 400))
)

# Triangular linkage bracket
bracket_points = [
    (-200, -100),
    (200, -100),
    (0, 280)
]
bracket = (
    cq.Workplane("XY")
    .polyline(bracket_points)
    .close()
    .extrude(bracket_thickness)
    .faces(">Z")
    .workplane()
    .center(0, 0)
    .circle(80)
    .cutThruAll()
)
# Add cylindrical bosses at two upper vertices
bracket = (
    bracket
    .faces(">Z")
    .workplane()
    .center(-200, -100)
    .circle(bracket_boss_diameter / 2)
    .extrude(40)
    .faces(">Z")
    .workplane()
    .hole(bracket_hole_diameter, bracket_hole_depth)
)
bracket = (
    bracket
    .faces(">Z[-2]")
    .workplane()
    .center(200, -100)
    .circle(bracket_boss_diameter / 2)
    .extrude(40)
    .faces(">Z")
    .workplane()
    .hole(bracket_hole_diameter, bracket_hole_depth)
)
# Add clevis at lower vertex
bracket = (
    bracket
    .faces(">Z[-3]")
    .workplane()
    .center(0, 280)
    .circle(20)
    .extrude(30)
    .faces(">Z")
    .workplane()
    .hole(bracket_clevis_hole_diameter, 20)
)
bracket = bracket.translate((0, 0, 150))

# U-shaped link arm
link_path = [
    (0, 0),
    (0, 150),
    (150, 250),
    (300, 250),
    (300, 0)
]
link_arm = (
    cq.Workplane("XZ")
    .spline(link_path)
    .close()
    .extrude(link_arm_width)
    .translate((-150, -200, 100))
)
# Add cylindrical bosses at ends
link_arm = (
    link_arm
    .faces(">Y")
    .workplane()
    .center(-150, 100)
    .circle(link_boss_outer_diameter / 2)
    .extrude(40)
    .faces(">Y")
    .workplane()
    .hole(link_boss_hole_diameter, link_boss_hole_depth)
)
link_arm = (
    link_arm
    .faces(">Y[-2]")
    .workplane()
    .center(150, 100)
    .circle(link_boss_outer_diameter / 2)
    .extrude(40)
    .faces(">Y")
    .workplane()
    .hole(link_boss_hole_diameter, link_boss_hole_depth)
)
# Add blind socket
link_arm = (
    link_arm
    .faces("<Z")
    .workplane()
    .center(0, -150)
    .hole(link_socket_diameter, link_socket_depth)
)

# Pulley disc
pulley = (
    cq.Workplane("XY")
    .circle(pulley_outer_diameter / 2)
    .extrude(pulley_thickness)
    .faces(">Z")
    .workplane()
    .circle(pulley_hub_diameter / 2)
    .extrude(20)
)
# Add bolt circle holes
for i in range(5):
    angle = i * 72
    x = (pulley_bolt_circle_diameter / 2) * cos(radians(angle))
    y = (pulley_bolt_circle_diameter / 2) * sin(radians(angle))
    pulley = (
        pulley
        .faces(">Z")
        .workplane()
        .center(x, y)
        .hole(pulley_bolt_hole_diameter)
    )
# Add rim notches
for i in range(30):
    angle = i * 12
    x = ((pulley_outer_diameter / 2) - 5) * cos(radians(angle))
    y = ((pulley_outer_diameter / 2) - 5) * sin(radians(angle))
    pulley = (
        pulley
        .faces(">Z[-2]")
        .workplane()
        .center(x, y)
        .circle(pulley_notch_radius)
        .cutBlind(-5)
    )
pulley = pulley.translate((-150, 50, 100))

# Pins (Ø30 × 90 mm, 2 instances)
pin_30_short_1 = (
    cq.Workplane("XY")
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_length_short)
    .translate((-200, -100, 150))
)
pin_30_short_2 = (
    cq.Workplane("XY")
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_length_short)
    .translate((200, -100, 150))
)

# Pin (Ø30 × 100 mm)
pin_30_long = (
    cq.Workplane("XY")
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_length_long)
    .translate((0, 280, 150))
)

# Pins (Ø40 × 100 mm, 4 instances)
pin_40_1 = (
    cq.Workplane("YZ")
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((-200, -100, 180))
)
pin_40_2 = (
    cq.Workplane("YZ")
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((200, -100, 180))
)
pin_40_3 = (
    cq.Workplane("YZ")
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((-150, -200, 140))
)
pin_40_4 = (
    cq.Workplane("YZ")
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((150, -200, 140))
)

# Combine all parts into unified assembly
result = (
    flat_bar
    .union(bracket)
    .union(link_arm)
    .union(pulley)
    .union(pin_30_short_1)
    .union(pin_30_short_2)
    .union(pin_30_long)
    .union(pin_40_1)
    .union(pin_40_2)
    .union(pin_40_3)
    .union(pin_40_4)
)