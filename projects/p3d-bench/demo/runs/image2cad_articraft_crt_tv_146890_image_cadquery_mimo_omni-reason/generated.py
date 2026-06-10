import cadquery as cq

# ----------------------
# Parametric Dimensions (estimated from typical CRT TV proportions)
# ----------------------
# Main cabinet dimensions
tv_main_width = 60.0  # Overall width of the main TV body
tv_main_height = 45.0  # Overall height of the main body
tv_main_depth = 35.0  # Depth of the main cabinet

# Screen & Bezel
screen_width = 45.0  # Width of the visible screen area
screen_height = 35.0  # Height of the visible screen area
screen_recess_depth = 5.0  # How far the screen is recessed from the front face
bezel_thickness = 3.0  # Thickness of the bezel surrounding the screen

# Side Control Panel
control_panel_width = 8.0  # Width of the right-side control panel
control_panel_recess = 2.0  # Depth of the control panel recess
button_count_vertical = 6  # Number of vertical buttons on control panel
button_size = 1.5  # Size of each control button
speaker_grille_height = 15.0  # Height of the speaker grille section

# Rear Cabinet Extension
rear_extension_depth = 10.0  # Depth of the raised rear section
rear_extension_height = 30.0  # Height of the rear extension
rear_extension_width = tv_main_width - 4.0  # Slightly narrower than main body

# Antennas
antenna_length = 60.0  # Length of each telescopic antenna
antenna_diameter = 0.8  # Diameter of antenna rods
antenna_angle = 30.0  # Angle of antennas from vertical (in degrees)
antenna_spacing = 15.0  # Distance between the two antennas on the top

# ----------------------
# Build the TV Model
# ----------------------
# 1. Create main cabinet box
main_cabinet = (
    cq.Workplane("XY")
    .box(tv_main_width, tv_main_height, tv_main_depth)
    # Round the front edges slightly for realism
    .edges("|Z").fillet(1.0)
)

# 2. Create recessed screen area
# First, create the front face workplane
front_face = main_cabinet.faces(">Z").workplane()

# Create the recessed screen cutout (rectangular recess)
screen_cutout = (
    front_face
    .rect(screen_width, screen_height)
    .cutBlind(-screen_recess_depth)
)

# 3. Add bezel around screen (raised frame)
bezel = (
    front_face
    .rect(screen_width + bezel_thickness*2, screen_height + bezel_thickness*2)
    .rect(screen_width, screen_height)
    .extrude(bezel_thickness)
)

# 4. Create side control panel recess
# Get right side face
right_face = main_cabinet.faces(">X").workplane()

# Create recessed control panel
control_panel_recess_feature = (
    right_face
    .center(0, -tv_main_height/4)  # Position below top edge
    .rect(control_panel_width, tv_main_height/2)
    .cutBlind(-control_panel_recess)
)

# Add control buttons (grid of small boxes)
# Create a grid of points for button placement
button_points = (
    right_face
    .center(0, -tv_main_height/4)
    .rarray(
        xSpacing=0, 
        ySpacing=button_size + 1.0,
        xCount=1, 
        yCount=button_count_vertical,
        center=True
    )
)

# Create buttons at each point
buttons = button_points.rect(button_size, button_size).extrude(0.5)

# Add speaker grille (series of horizontal slots)
# Create a grid of points for grille slots
grille_points = (
    right_face
    .center(0, -tv_main_height/4 - speaker_grille_height/2 - button_size)
    .rarray(
        xSpacing=0,
        ySpacing=2.0,
        xCount=1,
        yCount=7,
        center=True
    )
)

# Create grille slots
speaker_grille = grille_points.rect(control_panel_width - 2.0, 1.0).cutBlind(-0.3)

# 5. Add rear cabinet extension
rear_extension = (
    main_cabinet
    .faces("<Z").workplane()
    .center(0, (tv_main_height - rear_extension_height)/2)
    .rect(rear_extension_width, rear_extension_height)
    .extrude(rear_extension_depth)
    .edges("|Z").fillet(1.0)
)

# 6. Add antennas
# Get top face workplane
top_face = main_cabinet.faces(">Z").workplane()

# Create first antenna
antenna_1 = (
    top_face
    .center(-antenna_spacing/2, 0)
    .circle(antenna_diameter/2)
    .extrude(antenna_length)
    .rotate((0,0,0), (0,1,0), antenna_angle)
)

# Create second antenna
antenna_2 = (
    top_face
    .center(antenna_spacing/2, 0)
    .circle(antenna_diameter/2)
    .extrude(antenna_length)
    .rotate((0,0,0), (0,1,0), -antenna_angle)
)

# ----------------------
# Combine all components
# ----------------------
result = (
    main_cabinet
    .union(bezel)
    .union(buttons)
    .union(speaker_grille)
    .union(rear_extension)
    .union(antenna_1)
    .union(antenna_2)
)

# The control panel recess is a cut operation, so we need to apply it separately
result = result.cut(control_panel_recess_feature)