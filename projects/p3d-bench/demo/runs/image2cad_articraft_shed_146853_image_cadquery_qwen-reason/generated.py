import cadquery as cq
import math

# Parameters
# Dimensions
shed_length = 3000.0  # X-axis (Length of the shed)
shed_width = 2400.0   # Y-axis (Width of the shed)
wall_height = 2000.0  # Z-axis (Height of the walls)
roof_rise = 1000.0    # Height of the roof peak from top of walls

# Timber dimensions
stud_w = 50.0   # Stud width (thickness)
stud_d = 100.0  # Stud depth (width along wall)
plate_w = 50.0
plate_d = 100.0
rafter_w = 50.0
rafter_d = 150.0 # Rafters are deeper
ridge_w = 50.0
ridge_d = 200.0
purlin_w = 50.0
purlin_d = 100.0
base_w = 100.0 # Base frame width
base_h = 50.0  # Base frame height

# Spacing
stud_spacing = 600.0
rafter_spacing = 600.0
purlin_spacing = 800.0 # Distance along the slope

# Panel thickness
panel_thickness = 12.0

# Door parameters
door_width = 800.0
door_height = 1800.0
door_frame_width = 50.0

# --- Helper Functions ---

def create_truss(width, rise):
    """Creates a single rafter truss assembly."""
    half_width = width / 2
    rafter_len = (half_width**2 + rise**2)**0.5
    angle_rad = math.atan(rise / half_width)
    angle_deg = math.degrees(angle_rad)
    
    # Ceiling Joist (Tie beam) - spans the width
    # Oriented along Y.
    joist = cq.Workplane("XZ").box(stud_w, width, stud_d).translate((0, 0, 0)) 
    
    # Left Rafter
    r1 = cq.Workplane("XZ").box(rafter_len, rafter_w, rafter_d)
    r1 = r1.rotate((0,0,0), (0,1,0), angle_deg) 
    mid_x = -half_width / 2
    mid_z = rise / 2
    r1 = r1.translate((mid_x, 0, mid_z))
    
    # Right Rafter
    r2 = cq.Workplane("XZ").box(rafter_len, rafter_w, rafter_d)
    r2 = r2.rotate((0,0,0), (0,1,0), -angle_deg)
    mid_x_r = half_width / 2
    mid_z_r = rise / 2
    r2 = r2.translate((mid_x_r, 0, mid_z_r))
    
    # King Post (Vertical stud in center)
    king_post = cq.Workplane("XZ").box(stud_w, stud_d, rise).translate((0, 0, rise/2))
    
    truss = r1.union(r2).union(joist).union(king_post)
    return truss

# --- Main Modeling ---

# 1. Base Frame
base_front = cq.Workplane("XY").box(shed_length, base_w, base_h).translate((0, -shed_width/2 + base_w/2, base_h/2))
base_back = cq.Workplane("XY").box(shed_length, base_w, base_h).translate((0, shed_width/2 - base_w/2, base_h/2))
base_left = cq.Workplane("XY").box(base_w, shed_width - 2*base_w, base_h).translate((-shed_length/2 + base_w/2, 0, base_h/2))
base_right = cq.Workplane("XY").box(base_w, shed_width - 2*base_w, base_h).translate((shed_length/2 - base_w/2, 0, base_h/2))

base_frame = base_front.union(base_back).union(base_left).union(base_right)

# 2. Walls
wall_base_z = base_h

# Sheathing
wall_front_sheathing = cq.Workplane("XY").box(shed_length, panel_thickness, wall_height).translate((0, -shed_width/2 - panel_thickness/2, wall_base_z + wall_height/2))
wall_back_sheathing = cq.Workplane("XY").box(shed_length, panel_thickness, wall_height).translate((0, shed_width/2 + panel_thickness/2, wall_base_z + wall_height/2))
wall_left_sheathing = cq.Workplane("XY").box(panel_thickness, shed_width + 2*panel_thickness, wall_height).translate((-shed_length/2 - panel_thickness/2, 0, wall_base_z + wall_height/2))
wall_right_sheathing = cq.Workplane("XY").box(panel_thickness, shed_width + 2*panel_thickness, wall_height).translate((shed_length/2 + panel_thickness/2, 0, wall_base_z + wall_height/2))

sheathing = wall_front_sheathing.union(wall_back_sheathing).union(wall_left_sheathing).union(wall_right_sheathing)

# Studs
corner_posts = (
    cq.Workplane("XY")
    .rect(shed_length - stud_d, shed_width - stud_d, forConstruction=True)
    .vertices()
    .box(stud_d, stud_d, wall_height)
    .translate((0, 0, wall_base_z + wall_height/2))
)

num_front_studs = int((shed_length - 2*stud_d) / stud_spacing) + 1
front_studs = (
    cq.Workplane("XY")
    .rarray(stud_spacing, 1, num_front_studs, 1, center=True)
    .box(stud_w, stud_d, wall_height)
    .translate((0, -shed_width/2 + stud_d/2, wall_base_z + wall_height/2))
)

back_studs = (
    cq.Workplane("XY")
    .rarray(stud_spacing, 1, num_front_studs, 1, center=True)
    .box(stud_w, stud_d, wall_height)
    .translate((0, shed_width/2 - stud_d/2, wall_base_z + wall_height/2))
)

num_side_studs = int((shed_width - 2*stud_d) / stud_spacing) + 1
left_studs = (
    cq.Workplane("XY")
    .rarray(1, stud_spacing, 1, num_side_studs, center=True)
    .box(stud_d, stud_w, wall_height)
    .translate((-shed_length/2 + stud_d/2, 0, wall_base_z + wall_height/2))
)

right_studs = (
    cq.Workplane("XY")
    .rarray(1, stud_spacing, 1, num_side_studs, center=True)
    .box(stud_d, stud_w, wall_height)
    .translate((shed_length/2 - stud_d/2, 0, wall_base_z + wall_height/2))
)

studs = corner_posts.union(front_studs).union(back_studs).union(left_studs).union(right_studs)

# Top Plates
top_plate_front = cq.Workplane("XY").box(shed_length, plate_w, plate_w).translate((0, -shed_width/2 + plate_w/2, wall_base_z + wall_height + plate_w/2))
top_plate_back = cq.Workplane("XY").box(shed_length, plate_w, plate_w).translate((0, shed_width/2 - plate_w/2, wall_base_z + wall_height + plate_w/2))
top_plate_left = cq.Workplane("XY").box(plate_w, shed_width, plate_w).translate((-shed_length/2 + plate_w/2, 0, wall_base_z + wall_height + plate_w/2))
top_plate_right = cq.Workplane("XY").box(plate_w, shed_width, plate_w).translate((shed_length/2 - plate_w/2, 0, wall_base_z + wall_height + plate_w/2))

top_plates = top_plate_front.union(top_plate_back).union(top_plate_left).union(top_plate_right)

# 3. Doors
total_door_width = 2 * door_width
door_frame_y = -shed_width/2 - panel_thickness - door_frame_width/2

door_frame_obj = (
    cq.Workplane("XY")
    .box(total_door_width + 2*door_frame_width, door_frame_width, door_height + door_frame_width)
    .translate((0, door_frame_y, wall_base_z + door_height/2 + door_frame_width/2))
)

left_door = (
    cq.Workplane("XY")
    .box(door_width, panel_thickness, door_height)
    .translate((-door_width/2, door_frame_y + door_frame_width/2 + panel_thickness/2, wall_base_z + door_height/2))
)

right_door = (
    cq.Workplane("XY")
    .box(door_width, panel_thickness, door_height)
    .translate((door_width/2, door_frame_y + door_frame_width/2 + panel_thickness/2, wall_base_z + door_height/2))
)

hinge_h = 60
hinge_w = 40
hinge_d = 40
hinges = cq.Workplane("XY")

hinge_x_l = - (total_door_width/2 + door_frame_width) - hinge_d/2
for z in [wall_base_z + door_height * 0.2, wall_base_z + door_height * 0.5, wall_base_z + door_height * 0.8]:
    h = cq.Workplane("XY").box(hinge_d, hinge_w, hinge_h).translate((hinge_x_l, door_frame_y, z))
    hinges = hinges.union(h)

hinge_x_r = (total_door_width/2 + door_frame_width) + hinge_d/2
for z in [wall_base_z + door_height * 0.2, wall_base_z + door_height * 0.5, wall_base_z + door_height * 0.8]:
    h = cq.Workplane("XY").box(hinge_d, hinge_w, hinge_h).translate((hinge_x_r, door_frame_y, z))
    hinges = hinges.union(h)

# 4. Roof Structure
roof_base_z = wall_base_z + wall_height + plate_w

rafter_unit = create_truss(shed_width, roof_rise)
rafter_unit = rafter_unit.translate((0, 0, roof_base_z))

num_rafters = int(shed_length // rafter_spacing) + 1
rafters = cq.Workplane("XY")
for i in range(num_rafters):
    x_pos = -shed_length/2 + i * rafter_spacing
    r = rafter_unit.translate((x_pos, 0, 0))
    rafters = rafters.union(r)

ridge_board = (
    cq.Workplane("XY")
    .box(shed_length, ridge_w, ridge_d)
    .translate((0, 0, roof_base_z + roof_rise))
)

slope_len = ((shed_width/2)**2 + roof_rise**2)**0.5
num_purlins = 2 
purlin_positions = [slope_len * (i+1) / (num_purlins + 1) for i in range(num_purlins)]

purlins = cq.Workplane("XY")

for p_dist in purlin_positions:
    ratio = p_dist / slope_len
    y_pos = (shed_width/2) * (1 - ratio)
    z_pos = roof_base_z + roof_rise * ratio
    
    p_left = (
        cq.Workplane("XY")
        .box(shed_length, purlin_w, purlin_d)
        .translate((0, -y_pos, z_pos))
    )
    p_right = (
        cq.Workplane("XY")
        .box(shed_length, purlin_w, purlin_d)
        .translate((0, y_pos, z_pos))
    )
    
    purlins = purlins.union(p_left).union(p_right)

gable_studs = cq.Workplane("XY")
num_gable_studs = 4
for i in range(1, num_gable_studs):
    y_gable = -shed_width/2 + i * (shed_width / (num_gable_studs + 1))
    h_above = roof_rise * (1 - abs(y_gable) / (shed_width/2))
    
    if h_above > stud_w:
        s = (
            cq.Workplane("XY")
            .box(stud_w, stud_d, h_above)
            .translate((shed_length/2 - stud_d/2, y_gable, roof_base_z + h_above/2))
        )
        gable_studs = gable_studs.union(s)
        
        s_left = (
            cq.Workplane("XY")
            .box(stud_w, stud_d, h_above)
            .translate((-shed_length/2 + stud_d/2, y_gable, roof_base_z + h_above/2))
        )
        gable_studs = gable_studs.union(s_left)

# 5. Assemble
result = (
    base_frame
    .union(sheathing)
    .union(studs)
    .union(top_plates)
    .union(door_frame_obj)
    .union(left_door)
    .union(right_door)
    .union(hinges)
    .union(rafters)
    .union(ridge_board)
    .union(purlins)
    .union(gable_studs)
)