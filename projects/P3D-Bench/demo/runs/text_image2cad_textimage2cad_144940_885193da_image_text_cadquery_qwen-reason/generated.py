import cadquery as cq
import math

# Parameters
# Assembly dimensions approx 600 x 501 x 527 mm
# Coordinate system: Y horizontal, Z vertical, X depth (thickness)

# Triangular Linkage Bracket
bracket_center_y = 130.0
bracket_center_z = 200.0
bracket_arm_width = 60.0
bracket_thickness = 80.0
boss_outer_diameter = 60.0
boss_inner_diameter = 40.0
clevis_width = 40.0
clevis_hole_diameter = 30.0

# Link Arm
link_arm_path_points = [
    (0, 380),       # Top Left
    (-20, 250),     # Curve down
    (150, 100),     # Bottom curve
    (320, 250),     # Curve up
    (400, 380)      # Top Right
]
link_arm_profile_radius = 25.0
link_arm_boss_outer_diameter = 60.0
link_arm_boss_inner_diameter = 40.0
link_arm_blind_hole_diameter = 50.0
link_arm_blind_hole_depth = 15.0

# Pulley
pulley_od = 230.0
pulley_thickness = 61.0
pulley_hub_diameter = 140.0
pulley_hub_height = 20.0
pulley_bolt_hole_diameter = 14.0
pulley_bolt_circle_diameter = 100.0
pulley_notch_radius = 4.0

# Flat Bar
flat_bar_length = 600.0
flat_bar_height = 50.0
flat_bar_thickness = 10.0

# Frame Parts (Right Leg and Bottom Bar)
frame_leg_width = 50.0
frame_leg_height = 400.0
frame_bar_height = 50.0
frame_bar_length = 400.0

# Pins
pin_40_diameter = 40.0
pin_40_length = 100.0
pin_30_diameter = 30.0
pin_30_long_length = 100.0
pin_30_short_length = 90.0

# Positions
tl_pos = (0, 380)
tr_pos = (400, 380)
bl_pos = (0, 0)

# Create the model
result = cq.Workplane("YZ")

# 1. Triangular Linkage Bracket (Y-shape)
# Create arms as rectangles and extrude them to solids, then union
# Arm to TL
dist_tl = math.sqrt((tl_pos[0]-bracket_center_y)**2 + (tl_pos[1]-bracket_center_z)**2)
angle_tl = math.degrees(math.atan2(tl_pos[1]-bracket_center_z, tl_pos[0]-bracket_center_y))
arm_tl = (
    cq.Workplane("YZ")
    .center(bracket_center_y, bracket_center_z)
    .rect(bracket_arm_width, dist_tl + bracket_arm_width/2)
    .rotate((0,0,0), (0,0,1), angle_tl - 90)
    .extrude(bracket_thickness)
)

# Arm to TR
dist_tr = math.sqrt((tr_pos[0]-bracket_center_y)**2 + (tr_pos[1]-bracket_center_z)**2)
angle_tr = math.degrees(math.atan2(tr_pos[1]-bracket_center_z, tr_pos[0]-bracket_center_y))
arm_tr = (
    cq.Workplane("YZ")
    .center(bracket_center_y, bracket_center_z)
    .rect(bracket_arm_width, dist_tr + bracket_arm_width/2)
    .rotate((0,0,0), (0,0,1), angle_tr - 90)
    .extrude(bracket_thickness)
)

# Arm to BL
dist_bl = math.sqrt((bl_pos[0]-bracket_center_y)**2 + (bl_pos[1]-bracket_center_z)**2)
angle_bl = math.degrees(math.atan2(bl_pos[1]-bracket_center_z, bl_pos[0]-bracket_center_y))
arm_bl = (
    cq.Workplane("YZ")
    .center(bracket_center_y, bracket_center_z)
    .rect(bracket_arm_width, dist_bl + bracket_arm_width/2)
    .rotate((0,0,0), (0,0,1), angle_bl - 90)
    .extrude(bracket_thickness)
)

# Union arms to form the bracket base (now solids)
bracket_solid = arm_tl.union(arm_tr).union(arm_bl)

# Fillet the junctions (vertical edges of the Y-shape)
bracket_solid = bracket_solid.edges("|X").fillet(20.0)

# Add bosses at TL and TR
# Boss at TL
boss_tl_solid = (
    cq.Workplane("YZ")
    .moveTo(tl_pos[0], tl_pos[1])
    .circle(boss_outer_diameter / 2)
    .extrude(bracket_thickness + 20)
    .translate((-10, 0, 0)) # Center it on the bracket thickness
    .faces(">X")
    .workplane()
    .circle(boss_inner_diameter / 2)
    .cutThruAll()
)
bracket_solid = bracket_solid.union(boss_tl_solid)

# Boss at TR
boss_tr_solid = (
    cq.Workplane("YZ")
    .moveTo(tr_pos[0], tr_pos[1])
    .circle(boss_outer_diameter / 2)
    .extrude(bracket_thickness + 20)
    .translate((-10, 0, 0))
    .faces(">X")
    .workplane()
    .circle(boss_inner_diameter / 2)
    .cutThruAll()
)
bracket_solid = bracket_solid.union(boss_tr_solid)

# Add clevis at BL
clevis_block = (
    cq.Workplane("YZ")
    .moveTo(bl_pos[0], bl_pos[1])
    .rect(clevis_width + 20, clevis_width + 20)
    .extrude(bracket_thickness)
)
bracket_solid = bracket_solid.union(clevis_block)
# Cut clevis hole
bracket_solid = (
    bracket_solid
    .faces(">X")
    .workplane()
    .moveTo(bl_pos[0], bl_pos[1])
    .circle(clevis_hole_diameter / 2)
    .cutThruAll()
)

# 2. Link Arm (U-shaped)
# Create path
link_path = (
    cq.Workplane("YZ")
    .spline(link_arm_path_points)
    .val()
)
# Create profile (circle in YZ plane, normal X, perpendicular to path in YZ)
# Sweep with Frenet frame to handle curvature
link_arm_body = cq.Workplane("YZ").circle(link_arm_profile_radius).sweep(link_path, isFrenet=True)

# Add bosses at ends
# Boss at TL
link_boss_tl = (
    cq.Workplane("YZ")
    .moveTo(tl_pos[0], tl_pos[1])
    .circle(link_arm_boss_outer_diameter / 2)
    .extrude(bracket_thickness + 40)
    .translate((-20, 0, 0))
    .faces(">X")
    .workplane()
    .circle(link_arm_boss_inner_diameter / 2)
    .cutThruAll()
)
link_arm_body = link_arm_body.union(link_boss_tl)

# Boss at TR
link_boss_tr = (
    cq.Workplane("YZ")
    .moveTo(tr_pos[0], tr_pos[1])
    .circle(link_arm_boss_outer_diameter / 2)
    .extrude(bracket_thickness + 40)
    .translate((-20, 0, 0))
    .faces(">X")
    .workplane()
    .circle(link_arm_boss_inner_diameter / 2)
    .cutThruAll()
)
link_arm_body = link_arm_body.union(link_boss_tr)

# Add blind hole on lateral face
# Approximate position: middle of the U, on the side.
link_arm_body = (
    link_arm_body
    .faces("<X")
    .workplane()
    .moveTo(-20, 250) # Approx position on the left arm
    .circle(link_arm_blind_hole_diameter / 2)
    .cutBlind(link_arm_blind_hole_depth)
)

# 3. Pulley Disc
pulley_disc = (
    cq.Workplane("YZ")
    .workplane(offset=bracket_thickness) # At X=80
    .moveTo(bl_pos[0], bl_pos[1])
    .circle(pulley_od / 2)
    .extrude(pulley_thickness)
)
# Add stepped hub
pulley_disc = (
    pulley_disc
    .faces(">X")
    .workplane()
    .circle(pulley_hub_diameter / 2)
    .extrude(pulley_hub_height)
)
# Add bolt holes
pulley_disc = (
    pulley_disc
    .faces(">X")
    .workplane()
    .pushPoints([
        (pulley_bolt_circle_diameter / 2 * math.cos(i * 2 * math.pi / 5), 
         pulley_bolt_circle_diameter / 2 * math.sin(i * 2 * math.pi / 5))
        for i in range(5)
    ])
    .circle(pulley_bolt_hole_diameter / 2)
    .cutThruAll()
)
# Add periodic notches on rim
notches_list = []
for i in range(30):
    angle = i * 360 / 30
    notch = (
        cq.Workplane("YZ")
        .moveTo(pulley_od / 2, 0)
        .circle(pulley_notch_radius)
        .extrude(pulley_thickness)
        .rotate((0,0,0), (0,0,1), angle)
    )
    notches_list.append(notch)
# Union all notches
if notches_list:
    notches_solid = notches_list[0]
    for n in notches_list[1:]:
        notches_solid = notches_solid.union(n)
    pulley_disc = pulley_disc.cut(notches_solid)

# 4. Flat Bar
flat_bar = (
    cq.Workplane("YZ")
    .workplane(offset=35) # Center X at 40
    .center(200, 400)
    .rect(flat_bar_length, flat_bar_height)
    .extrude(flat_bar_thickness)
)

# 5. Frame Parts (Right Leg and Bottom Bar)
right_leg = (
    cq.Workplane("YZ")
    .moveTo(400, 0)
    .rect(frame_leg_width, frame_leg_height)
    .extrude(bracket_thickness)
    .faces(">Z")
    .workplane()
    .rect(frame_leg_width + 20, 20)
    .extrude(20)
)
bottom_bar = (
    cq.Workplane("YZ")
    .moveTo(0, 0)
    .rect(frame_bar_length, frame_bar_height)
    .extrude(bracket_thickness)
)

# 6. Pins
pin_tl = (
    cq.Workplane("YZ")
    .moveTo(tl_pos[0], tl_pos[1])
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((-50, 0, 0))
)
pin_tr = (
    cq.Workplane("YZ")
    .moveTo(tr_pos[0], tr_pos[1])
    .circle(pin_40_diameter / 2)
    .extrude(pin_40_length)
    .translate((-50, 0, 0))
)
pin_bl_long = (
    cq.Workplane("YZ")
    .moveTo(bl_pos[0], bl_pos[1])
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_long_length)
    .translate((-50, 0, 0))
)
pin_bl_short = (
    cq.Workplane("YZ")
    .moveTo(bl_pos[0], bl_pos[1])
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_short_length)
    .translate((-45, 0, 0))
)
pin_rl_foot = (
    cq.Workplane("YZ")
    .moveTo(400, 0)
    .circle(pin_30_diameter / 2)
    .extrude(pin_30_short_length)
    .translate((-45, 0, 0))
)

# Assemble everything
assembly = (
    bracket_solid
    .union(link_arm_body)
    .union(pulley_disc)
    .union(flat_bar)
    .union(right_leg)
    .union(bottom_bar)
    .union(pin_tl)
    .union(pin_tr)
    .union(pin_bl_long)
    .union(pin_bl_short)
    .union(pin_rl_foot)
)

result = assembly