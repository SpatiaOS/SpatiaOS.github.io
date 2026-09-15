import cadquery as cq
import math

# ==============================================
# Industrial Articulated Robot - Parametric Model
# Proportions matched to reference isometric view
# ==============================================

# ----------------------
# Base (mounting plate) Parameters
# ----------------------
base_size = 120.0
base_height = 18.0
lug_protrusion = 22.0       # Length of mounting tabs extending from base
lug_width = 32.0            # Width of mounting tabs
mount_hole_dia = 5.5        # Diameter of mounting bolt holes
mount_hole_spacing = 16.0   # Distance between holes on each lug
port_dia = 6.0              # Diameter of side connector ports
cover_size_x = 18.0         # Size of inspection cover plate
cover_size_y = 12.0

# ----------------------
# Waist (J1 rotary axis) Parameters
# ----------------------
waist_dia = 62.0
waist_height = 28.0
shoulder_axis_height = 70.0 # Height of shoulder pivot above base bottom

# ----------------------
# Shoulder (J2 axis) Parameters
# ----------------------
shoulder_bearing_dia = 52.0 # Diameter of main shoulder bearing
shoulder_shaft_dia = 18.0   # Diameter of shoulder pivot shaft
shoulder_bolt_len = 28.0    # Length of shoulder mounting bolt
shoulder_hex_size = 13.0    # Hex head size (across flats)
shoulder_side_thickness = 16.0 # Thickness of upright support walls

# ----------------------
# Parallelogram Linkage Parameters
# ----------------------
lower_arm_len = 100.0                # Length of lower tapered arm
lower_arm_angle = 35.0              # Angle from vertical (Z) towards front (+Y)
lower_arm_width_x = 38.0            # Width of lower arm along pivot axis
linkage_bar_width = 12.0            # Width of diagonal linkage bar
linkage_bar_thick = 8.0             # Thickness of diagonal linkage bar
linkage_lower_offset_y = -12.0      # Y offset of lower linkage pivot (behind shoulder)
linkage_lower_offset_z = 10.0       # Z offset of lower linkage pivot (above shoulder)

# ----------------------
# Main Arm Parameters
# ----------------------
main_arm_dia = 28.0
main_arm_total_len = 105.0
main_arm_tilt = -12.0               # Downward tilt angle towards end effector (negative for down to +Y)
rear_housing_dia = 42.0             # Diameter of rear pivot housing
clamp_ring_dia = 44.0               # Diameter of clamp ring for lower arm
stud_dia = 8.0                      # Diameter of rear mounting studs
stud_len = 16.0                     # Length of rear studs
stud_offset_z = 12.0                # Vertical spacing between rear studs
clamp_from_rear = 0.48              # Clamp position as fraction of arm length from rear

# ----------------------
# Wrist & End Effector Parameters
# ----------------------
wrist_joint_dia = 36.0
wrist_section_len = 36.0
end_effector_len = 32.0
tip_bolt_dia = 7.0

# ==============================================
# Calculate Derived Geometry Positions
# ==============================================
clamp_offset = clamp_from_rear * main_arm_total_len
wrist_offset = main_arm_total_len - clamp_offset
theta_arm = math.radians(main_arm_tilt)
cos_arm = math.cos(theta_arm)
sin_arm = math.sin(theta_arm)
theta_lower = math.radians(lower_arm_angle)
sin_lower = math.sin(theta_lower)
cos_lower = math.cos(theta_lower)

# Position where lower arm clamps to main arm (top of lower arm after rotation)
clamp_pos_y = lower_arm_len * sin_lower
clamp_pos_z = shoulder_axis_height + lower_arm_len * cos_lower

# Rear pivot and wrist positions (along tilted main arm axis)
rear_world_y = clamp_pos_y - clamp_offset * cos_arm
rear_world_z = clamp_pos_z - clamp_offset * sin_arm
wrist_world_y = clamp_pos_y + wrist_offset * cos_arm
wrist_world_z = clamp_pos_z + wrist_offset * sin_arm

# Diagonal linkage geometry
dy_link = rear_world_y - linkage_lower_offset_y
dz_link = rear_world_z - (shoulder_axis_height + linkage_lower_offset_z)
diag_link_len = math.sqrt(dy_link**2 + dz_link**2)
diag_angle = math.degrees(math.atan2(dz_link, dy_link))

# ==============================================
# Build Individual Components
# ==============================================

# ----------------------------------------------
# Base Plate
# ----------------------------------------------
# Start with main base block, fillet outer corners FIRST while shape is simple
base = cq.Workplane("XY").box(base_size, base_size, base_height, centered=(True, True, False))
base = base.edges("|Z").fillet(2)  # Fillet only the 4 vertical corners of the initial block

# Add mounting lugs on adjacent sides (down-right +X, down-left +Y in isometric)
base = (
    base
    .faces(">X")
    .workplane(centerOption="CenterOfBoundBox")
    .center(0, -base_height/2)
    .box(lug_protrusion, lug_width, base_height, centered=(False, True, False))
    .faces(">Y")
    .workplane(centerOption="CenterOfBoundBox")
    .center(0, -base_height/2)
    .box(lug_width, lug_protrusion, base_height, centered=(True, False, False))
)

# Cut relief notches on opposite sides (up-left -X, up-right -Y)
base = (
    base
    .faces("<X")
    .workplane(centerOption="CenterOfBoundBox")
    .center(0, -base_height/2)
    .rect(12, 40)
    .cutBlind(-15)
    .faces("<Y")
    .workplane(centerOption="CenterOfBoundBox")
    .center(0, -base_height/2)
    .rect(40, 12)
    .cutBlind(-15)
)

# Add inspection cover on +Y face
base = (
    base
    .faces(">Y")
    .workplane(centerOption="CenterOfBoundBox")
    .center(-base_size/4, 0)
    .rect(cover_size_x, cover_size_y)
    .extrude(2.5)
    .faces(">Y")
    .rect(cover_size_x+3, cover_size_y+3)
    .rect(cover_size_x, cover_size_y)
    .extrude(1)
)

# Add twin service connectors
base = (
    base
    .faces(">Y")
    .workplane(centerOption="CenterOfBoundBox")
    .center(base_size/4, -5)
    .pushPoints([(-port_dia*1.2, 0), (port_dia*1.2, 0)])
    .circle(port_dia/2)
    .extrude(4)
)

# Add mounting holes through lugs
base = (
    base
    .faces(">Z")
    .workplane(centerOption="CenterOfBoundBox")
    .pushPoints([
        (base_size/2 + lug_protrusion/2 - 4, -mount_hole_spacing/2),
        (base_size/2 + lug_protrusion/2 - 4, mount_hole_spacing/2),
        (-mount_hole_spacing/2, base_size/2 + lug_protrusion/2 - 4),
        (mount_hole_spacing/2, base_size/2 + lug_protrusion/2 - 4)
    ])
    .hole(mount_hole_dia)
)

# ----------------------------------------------
# Waist (J1 Rotary Joint)
# ----------------------------------------------
waist = (
    cq.Workplane("XY", origin=(0, 0, base_height))
    .circle(waist_dia/2)
    .extrude(waist_height - 10)
    .faces(">Z")
    .circle(waist_dia/2 - 6)
    .extrude(10)
    .faces("<Z")
    .chamfer(2)
)

# ----------------------------------------------
# Shoulder Supports & Bearing (J2 Axis)
# ----------------------------------------------
shoulder_supports = (
    cq.Workplane("XY", origin=(0, 0, base_height + waist_height - 8))
    .rect(shoulder_bearing_dia, 36)
    .extrude(shoulder_axis_height - (base_height + waist_height - 8))
)

shoulder_bearing = (
    cq.Workplane("YZ", origin=(0, 0, shoulder_axis_height))
    .circle(shoulder_bearing_dia/2)
    .extrude(shoulder_side_thickness + 5, both=True)
    .faces(">X")
    .workplane()
    .circle(shoulder_shaft_dia/2 + 6)
    .circle(shoulder_shaft_dia/2)
    .extrude(shoulder_bolt_len - 5)
)

shoulder_bolt = (
    cq.Workplane("YZ", origin=(shoulder_side_thickness + shoulder_bolt_len -5, 0, shoulder_axis_height))
    .circle(shoulder_shaft_dia/2)
    .extrude(8)
    .faces(">X")
    .polygon(6, shoulder_hex_size)
    .extrude(8)
)

# ----------------------------------------------
# Lower Tapered Arm
# ----------------------------------------------
lower_arm = (
    cq.Workplane("XY") # Loft along Z axis first, then rotate around X
    .rect(lower_arm_width_x, 30)
    .workplane(offset=lower_arm_len)
    .rect(lower_arm_width_x - 8, 22)
    .loft()
    # Rotate negative angle around X to tilt towards +Y (front/left in isometric)
    .rotate((0, 0, 0), (1, 0, 0), -lower_arm_angle)
    .translate((0, 0, shoulder_axis_height))
    .edges("|X").fillet(3)
)

# ----------------------------------------------
# Clamp Ring (connects lower arm to main arm, coaxial with main arm)
# ----------------------------------------------
clamp_ring = (
    cq.Workplane("XZ") # Same workplane as main arm, aligned with arm axis
    .circle(clamp_ring_dia/2)
    .circle(main_arm_dia/2 + 0.5)
    .extrude(12, both=True)
    .rotate((0, 0, 0), (1, 0, 0), main_arm_tilt)
    .translate((0, clamp_pos_y, clamp_pos_z))
)

# ----------------------------------------------
# Diagonal Linkage Bar
# ----------------------------------------------
diagonal_link = (
    cq.Workplane("XY")
    .box(linkage_bar_width, diag_link_len, linkage_bar_thick, centered=(True, True, True))
    .rotate((0, 0, 0), (1, 0, 0), diag_angle)
    .translate((
        0,
        linkage_lower_offset_y + dy_link/2,
        shoulder_axis_height + linkage_lower_offset_z + dz_link/2
    ))
    .edges("|X").fillet(1)
)

# ----------------------------------------------
# Main Arm Tube
# ----------------------------------------------
main_arm = (
    cq.Workplane("XZ")
    .circle(main_arm_dia/2)
    .extrude(main_arm_total_len) # Full length extrusion
    .translate((0, -clamp_offset, 0)) # Position clamp at local Y=0
    .rotate((0, 0, 0), (1, 0, 0), main_arm_tilt)
    .translate((0, clamp_pos_y, clamp_pos_z))
    # Add rear bearing ring on rear face (-Y local)
    .faces("<Y")
    .workplane()
    .circle(main_arm_dia/2 + 5)
    .circle(main_arm_dia/2)
    .extrude(8)
    # Add front wrist ring on wrist face (+Y local)
    .faces(">Y")
    .workplane()
    .circle(main_arm_dia/2 + 4)
    .circle(main_arm_dia/2)
    .extrude(6)
)

# ----------------------------------------------
# Rear Pivot Housing with Studs (studs parallel to X axis like shoulder bolt)
# ----------------------------------------------
rear_housing = (
    cq.Workplane("YZ")
    .circle(rear_housing_dia/2)
    .extrude(18, both=True)
    .faces(">X")
    .workplane()
    .pushPoints([(0, stud_offset_z/2), (0, -stud_offset_z/2)])
    .circle(stud_dia/2)
    .extrude(stud_len)
    .rotate((0, 0, 0), (1, 0, 0), main_arm_tilt)
    .translate((0, rear_world_y, rear_world_z))
)

# ----------------------------------------------
# Wrist Joints & End Effector
# ----------------------------------------------
wrist = (
    cq.Workplane("XZ")
    .circle(wrist_joint_dia/2)
    .extrude(12)
    .faces(">Y")
    .workplane()
    .circle(wrist_joint_dia/2 - 6)
    .extrude(wrist_section_len - 12)
    .faces(">Y")
    .workplane()
    .circle(14/2)
    .extrude(15)
    .faces(">Y")
    .workplane()
    .rect(10, 14)
    .extrude(end_effector_len - 15)
    .faces(">Y")
    .workplane()
    .circle(tip_bolt_dia/2)
    .extrude(10)
    .faces(">Y")
    .polygon(6, tip_bolt_dia + 2)
    .extrude(4)
    .rotate((0, 0, 0), (1, 0, 0), main_arm_tilt)
    .translate((0, wrist_world_y, wrist_world_z))
)

# ==============================================
# Final Assembly
# ==============================================
result = (
    base
    .union(waist)
    .union(shoulder_supports)
    .union(shoulder_bearing)
    .union(shoulder_bolt)
    .union(lower_arm)
    .union(clamp_ring)
    .union(diagonal_link)
    .union(main_arm)
    .union(rear_housing)
    .union(wrist)
)