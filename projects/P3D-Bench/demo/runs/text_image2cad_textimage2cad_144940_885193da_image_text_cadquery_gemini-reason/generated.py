import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================
frame_width = 480
frame_height = 400
frame_thick = 60

pivot_spacing_x = 140  # Half distance between frame pivots
upper_pivot_y = 150
lower_pivot_y = -150
pivot_z = 50
arm_length_z = 300
knuckle_y_upper = 80
knuckle_y_lower = -100

# Calculate arm lengths and rotation angles to meet the knuckle
dy_upper = knuckle_y_upper - upper_pivot_y
upper_length = math.sqrt(dy_upper**2 + arm_length_z**2)
upper_angle = math.degrees(math.atan2(-dy_upper, arm_length_z))

dy_lower = knuckle_y_lower - lower_pivot_y
lower_length = math.sqrt(dy_lower**2 + arm_length_z**2)
lower_angle = math.degrees(math.atan2(-dy_lower, arm_length_z))

# ==========================================
# 1. Base Frame
# ==========================================
frame = cq.Workplane("XY").box(frame_width, frame_height, frame_thick)

# Central cutout to make it a skeletal frame
frame_cutout = cq.Workplane("XY").box(frame_width - 120, frame_height - 120, frame_thick + 10)
frame = frame.cut(frame_cutout)

# Clevis mount blocks for A-arms
mount_blocks = (
    cq.Workplane("XY")
    .workplane(offset=pivot_z)
    .pushPoints([
        (pivot_spacing_x, upper_pivot_y), 
        (-pivot_spacing_x, upper_pivot_y), 
        (pivot_spacing_x, lower_pivot_y), 
        (-pivot_spacing_x, lower_pivot_y)
    ])
    .box(140, 60, 60)
)
frame = frame.union(mount_blocks)

# Clevis slots
slots = (
    cq.Workplane("XY")
    .workplane(offset=pivot_z)
    .pushPoints([
        (pivot_spacing_x, upper_pivot_y), 
        (-pivot_spacing_x, upper_pivot_y), 
        (pivot_spacing_x, lower_pivot_y), 
        (-pivot_spacing_x, lower_pivot_y)
    ])
    .box(102, 80, 80)
)
frame = frame.cut(slots)

# Pivot holes in frame (Ø40 bore for the pins)
pin_holes = (
    cq.Workplane("YZ")
    .workplane(offset=300)
    .pushPoints([(upper_pivot_y, pivot_z), (lower_pivot_y, pivot_z)])
    .circle(20)
    .extrude(-600)
)
frame = frame.cut(pin_holes)

# Grounded flat bar spanning the top
top_bar = (
    cq.Workplane("XY")
    .workplane(offset=frame_thick/2 + 5)
    .center(0, frame_height/2 + 25)
    .box(600, 50, 10)
)
frame = frame.union(top_bar)

# ==========================================
# 2. Upper A-Arm (Link Arm)
# ==========================================
# Built using simple straight lines to avoid BRep_API spline errors
upper_arm_flat = (
    cq.Workplane("XZ")
    .moveTo(pivot_spacing_x, 0)
    .lineTo(80, 150)
    .lineTo(25, upper_length)
    .lineTo(-25, upper_length)
    .lineTo(-80, 150)
    .lineTo(-pivot_spacing_x, 0)
    .lineTo(-90, 0)
    .lineTo(-50, 140)
    .lineTo(-15, upper_length - 30)
    .lineTo(15, upper_length - 30)
    .lineTo(50, 140)
    .lineTo(90, 0)
    .close()
    .extrude(30)
    .translate((0, -15, 0))
)

boss_u1 = cq.Workplane("YZ").workplane(offset=pivot_spacing_x).cylinder(100, 30)
boss_u2 = cq.Workplane("YZ").workplane(offset=-pivot_spacing_x).cylinder(100, 30)
outer_boss_u = cq.Workplane("XZ").center(0, upper_length).cylinder(40, 20)

upper_arm = upper_arm_flat.union(boss_u1).union(boss_u2).union(outer_boss_u)

# Cut pivot bores
upper_arm = upper_arm.cut(
    cq.Workplane("YZ").workplane(offset=300).center(0, 0).circle(20).extrude(-600)
)
upper_arm = upper_arm.cut(
    cq.Workplane("XZ").center(0, upper_length).circle(15).extrude(100, both=True)
)

# Rotate to match knuckle height and position
upper_arm = (
    upper_arm
    .rotate((0,0,0), (1,0,0), upper_angle)
    .translate((0, upper_pivot_y, pivot_z))
)

# ==========================================
# 3. Lower A-Arm (Triangular Bracket)
# ==========================================
lower_arm_flat = (
    cq.Workplane("XZ")
    .moveTo(pivot_spacing_x, 0)
    .lineTo(80, 150)
    .lineTo(30, lower_length)
    .lineTo(-30, lower_length)
    .lineTo(-80, 150)
    .lineTo(-pivot_spacing_x, 0)
    .close()
    .extrude(30)
    .translate((0, -15, 0))
)

cutout = (
    cq.Workplane("XZ")
    .moveTo(90, 40)
    .lineTo(50, 140)
    .lineTo(15, lower_length - 40)
    .lineTo(-15, lower_length - 40)
    .lineTo(-50, 140)
    .lineTo(-90, 40)
    .close()
    .extrude(40)
    .translate((0, -20, 0))
)
lower_arm_flat = lower_arm_flat.cut(cutout)

boss_l1 = cq.Workplane("YZ").workplane(offset=pivot_spacing_x).cylinder(100, 30)
boss_l2 = cq.Workplane("YZ").workplane(offset=-pivot_spacing_x).cylinder(100, 30)
outer_boss_l = cq.Workplane("XZ").center(0, lower_length).cylinder(40, 25)

lower_arm = lower_arm_flat.union(boss_l1).union(boss_l2).union(outer_boss_l)

# Cut pivot bores
lower_arm = lower_arm.cut(
    cq.Workplane("YZ").workplane(offset=300).center(0, 0).circle(20).extrude(-600)
)
lower_arm = lower_arm.cut(
    cq.Workplane("XZ").center(0, lower_length).circle(15).extrude(100, both=True)
)

# Rotate to match knuckle height and position
lower_arm = (
    lower_arm
    .rotate((0,0,0), (1,0,0), lower_angle)
    .translate((0, lower_pivot_y, pivot_z))
)

# ==========================================
# 4. Knuckle (Host Part)
# ==========================================
knuckle_post = (
    cq.Workplane("XZ")
    .workplane(offset=knuckle_y_lower - 20)
    .center(0, pivot_z + arm_length_z)
    .circle(20)
    .extrude((knuckle_y_upper + 20) - (knuckle_y_lower - 20))
)

spindle = (
    cq.Workplane("YZ")
    .workplane(offset=0)
    .center(0, pivot_z + arm_length_z)
    .circle(25)
    .extrude(-120)
)

knuckle = knuckle_post.union(spindle)

# Cut slots to receive the A-arm outer bosses (forming clevises)
knuckle_slots = (
    cq.Workplane("XY")
    .workplane(offset=pivot_z + arm_length_z)
    .pushPoints([(0, knuckle_y_upper), (0, knuckle_y_lower)])
    .box(100, 42, 100)
)
knuckle = knuckle.cut(knuckle_slots)

# Cut pin holes through knuckle
knuckle = knuckle.cut(
    cq.Workplane("XZ")
    .workplane(offset=300)
    .center(0, pivot_z + arm_length_z)
    .circle(15)
    .extrude(-600)
)

# ==========================================
# 5. Brake Rotor (Pulley Disc)
# ==========================================
rotor_x = -90
rotor_y = 0
rotor_z = pivot_z + arm_length_z

rotor_disc = cq.Workplane("YZ").center(rotor_y, rotor_z).circle(115).extrude(-20)
hub = cq.Workplane("YZ").center(rotor_y, rotor_z).circle(70).extrude(-61)
rotor = rotor_disc.union(hub)

bolt_holes = cq.Workplane("YZ").center(rotor_y, rotor_z).polarArray(45, 0, 360, 5).circle(7).extrude(-100)
rotor = rotor.cut(bolt_holes)

center_hole = cq.Workplane("YZ").center(rotor_y, rotor_z).circle(25).extrude(-100)
rotor = rotor.cut(center_hole)

notches = cq.Workplane("YZ").center(rotor_y, rotor_z).polarArray(115, 0, 360, 30).circle(4).extrude(-30)
rotor = rotor.cut(notches)

rotor = rotor.translate((rotor_x, 0, 0))

# ==========================================
# 6. Pins
# ==========================================
# 4 Frame pins (Ø30 x 100) for the A-arms
def create_pin_30_100(x, y, z):
    return cq.Workplane("YZ").workplane(offset=x + 50).center(y, z).circle(15).extrude(-100)

pin1 = create_pin_30_100(pivot_spacing_x, upper_pivot_y, pivot_z)
pin2 = create_pin_30_100(-pivot_spacing_x, upper_pivot_y, pivot_z)
pin3 = create_pin_30_100(pivot_spacing_x, lower_pivot_y, pivot_z)
pin4 = create_pin_30_100(-pivot_spacing_x, lower_pivot_y, pivot_z)

# Knuckle pin lower (Ø30 x 100)
knuckle_pin = (
    cq.Workplane("XZ")
    .workplane(offset=knuckle_y_lower + 50)
    .center(0, pivot_z + arm_length_z)
    .circle(15)
    .extrude(-100)
)

# 2 Grounded pins (Ø30 x 90) at the top frame corners
grounded_pin1 = cq.Workplane("YZ").workplane(offset=200).center(frame_height/2, 0).circle(15).extrude(-90)
grounded_pin2 = cq.Workplane("YZ").workplane(offset=-110).center(frame_height/2, 0).circle(15).extrude(-90)

# ==========================================
# 7. Final Assembly
# ==========================================
result = (
    frame
    .union(upper_arm)
    .union(lower_arm)
    .union(knuckle)
    .union(rotor)
    .union(pin1).union(pin2).union(pin3).union(pin4)
    .union(knuckle_pin)
    .union(grounded_pin1).union(grounded_pin2)
)