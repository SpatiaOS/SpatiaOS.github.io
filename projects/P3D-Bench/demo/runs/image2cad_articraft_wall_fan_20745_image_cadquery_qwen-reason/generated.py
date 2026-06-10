import cadquery as cq
import math

# Parameters
# Heatsink
heatsink_outer_r = 120.0
heatsink_inner_r = 50.0
base_thickness = 10.0
fin_height = 40.0
fin_thickness = 3.0
fin_count = 48

# Housing
housing_r = 50.0
housing_h = 60.0

# Arm
arm_length = 140.0
arm_angle_deg = 35.0
arm_base_r = 18.0
arm_tip_r = 12.0

# Reflector
reflector_r = 100.0
reflector_depth = 60.0
reflector_back_thickness = 5.0

# Joint
bracket_width = 30.0
bracket_depth = 20.0
bracket_height = 40.0
bolt_diameter = 10.0

# 1. Heatsink
# Base Plate
base_plate = cq.Workplane("XY").circle(heatsink_outer_r).extrude(base_thickness)

# Central Hub
hub = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(heatsink_inner_r)
    .extrude(fin_height)
)

# Fins
# Create a single fin in XZ plane (X is radius, Z is height)
# Positioned at Y=0.
fin_profile = (
    cq.Workplane("XZ")
    .moveTo(heatsink_inner_r, 0)
    .lineTo(heatsink_outer_r - 5, 0)
    .lineTo(heatsink_outer_r - 5, fin_height)
    .lineTo(heatsink_inner_r + 2, fin_height)
    .close()
    .extrude(fin_thickness) # Extrude along Y
)

# Array fins
fins = cq.Workplane("XY")
for i in range(fin_count):
    angle = i * (360.0 / fin_count)
    rotated_fin = fin_profile.rotate((0, 0, 0), (0, 0, 1), angle)
    fins = fins.union(rotated_fin)

heatsink = base_plate.union(hub).union(fins)

# Top Ring (optional, adds stability)
top_ring = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + fin_height)
    .circle(heatsink_outer_r - 2)
    .circle(heatsink_inner_r + 2)
    .extrude(3.0)
)
heatsink = heatsink.union(top_ring)

# 2. Housing
housing_z_start = base_thickness + fin_height
housing_top_z = housing_z_start + housing_h

housing = (
    cq.Workplane("XY")
    .workplane(offset=housing_z_start)
    .circle(housing_r)
    .extrude(housing_h)
)

# Top Vents
# Create a workplane at the top of the housing to avoid selector issues
top_face_wp = cq.Workplane("XY").workplane(offset=housing_top_z)

top_vents = (
    top_face_wp
    .rect(10, 30)
    .polarArray(radius=20, startAngle=0, angle=360, count=4)
    .extrude(-5)
)
housing = housing.cut(top_vents)

# Top Boss
top_boss = (
    top_face_wp
    .circle(15)
    .extrude(5)
)
housing = housing.union(top_boss)

# 3. Mounting Bracket
bracket_z = housing_z_start + housing_h / 2
bracket_y_center = housing_r + bracket_depth / 2

bracket = (
    cq.Workplane("XY")
    .box(bracket_width, bracket_depth, bracket_height)
    .translate((0, bracket_y_center, bracket_z))
)

# Bolt Hole (along X axis)
# Create a cylinder to cut
bolt_hole = (
    cq.Workplane("YZ")
    .moveTo(bracket_y_center, bracket_z)
    .circle(bolt_diameter / 2)
    .extrude(bracket_width + 10) # Make it longer than bracket
    .translate((-bracket_width/2 - 5, 0, 0)) # Center it
)
# Cut the hole
bracket = bracket.cut(bolt_hole)

# Union Housing and Bracket
main_body = housing.union(bracket)

# Combine Heatsink and Body
assembly = heatsink.union(main_body)

# 4. Arm
arm_start_y = bracket_y_center
arm_start_z = bracket_z

# Local Arm (along Z axis)
local_arm = (
    cq.Workplane("XY")
    .circle(arm_base_r)
    .workplane(offset=arm_length)
    .circle(arm_tip_r)
    .loft()
)

# Transform Arm to Global
# Rotate around X by (-90 + angle) to point in YZ plane upwards
arm_rot_x = -90 + arm_angle_deg

global_arm = (
    local_arm
    .rotate((0, 0, 0), (1, 0, 0), arm_rot_x)
    .translate((0, arm_start_y, arm_start_z))
)

# 5. Reflector
# Local Reflector (opening towards +Z)
# Profile in XY plane (X is radius, Y is height/depth), revolve around Z
local_reflector = (
    cq.Workplane("XY")
    .moveTo(0, 0) # Back center
    .spline([
        (0, 0), 
        (reflector_r * 0.5, reflector_depth * 0.3),
        (reflector_r, reflector_depth) # Rim edge
    ])
    .lineTo(reflector_r, reflector_depth + reflector_back_thickness) # Rim thickness
    .lineTo(0, reflector_back_thickness) # Back thickness
    .close()
    .revolve(360)
)

# Position Reflector
# We want the back of the reflector (Z=0 in local) to be at the tip of the arm.
# Arm tip in local coords (before global transform) is at Z = arm_length.
# So we shift reflector by arm_length along Z.
reflector_shift_z = arm_length

global_reflector = (
    local_reflector
    .translate((0, 0, reflector_shift_z))
    .rotate((0, 0, 0), (1, 0, 0), arm_rot_x)
    .translate((0, arm_start_y, arm_start_z))
)

# 6. Final Assembly
result = (
    assembly
    .union(global_arm)
    .union(global_reflector)
)

# Add Bolt details
# Bolt Shaft (along X)
bolt_shaft = (
    cq.Workplane("YZ")
    .moveTo(arm_start_y, arm_start_z)
    .circle(bolt_diameter / 2 - 0.5)
    .extrude(bracket_width + 20) 
    .translate((-bracket_width/2 - 10, 0, 0))
)
result = result.union(bolt_shaft)

# Bolt Head (Hex)
bolt_head = (
    cq.Workplane("YZ")
    .moveTo(arm_start_y, arm_start_z)
    .polygon(6, bolt_diameter * 1.8)
    .extrude(10)
    .translate((-bracket_width/2 - 20, 0, 0))
)
result = result.union(bolt_head)

# Nut on the other side
nut = (
    cq.Workplane("YZ")
    .moveTo(arm_start_y, arm_start_z)
    .polygon(6, bolt_diameter * 1.8)
    .extrude(8)
    .translate((bracket_width/2 + 5, 0, 0))
)
result = result.union(nut)