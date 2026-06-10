import cadquery as cq
import math

# =============================================================================
# PARAMETERS - Vintage CRT Television Model
# =============================================================================

# Main body dimensions
body_width = 100.0       # Overall width of TV
body_height = 70.0       # Overall height
body_depth_front = 45.0  # Depth at front (screen side)
body_depth_back = 60.0   # Depth at back (tube bulge)
body_chamfer = 2.0       # Edge rounding/chamfer size

# Screen parameters
screen_width = 65.0      # Visible screen width
screen_height = 50.0     # Visible screen height
screen_depth = 4.0       # How far screen is recessed
screen_frame = 5.0       # Width of bezel/frame around screen
screen_curve_radius = 80.0  # Radius for CRT curve (convex)

# Control panel (right side)
panel_width = 15.0       # Width of control panel section
button_rows = 4          # Number of button rows
button_cols = 3          # Number of button columns
button_size = 2.5        # Individual button size
button_spacing = 4.0     # Spacing between buttons

# Speaker grille
speaker_height = 25.0    # Height of speaker area
grille_line_count = 12   # Number of horizontal grille lines

# Antenna parameters
antenna_length = 55.0    # Length of each antenna rod
antenna_diameter = 1.0   # Thickness of antenna rod
antenna_angle_left = 25.0   # Left antenna angle from vertical (degrees)
antenna_angle_right = 30.0  # Right antenna angle from vertical (degrees)
antenna_base_height = 3.0   # Height of antenna base housing

# =============================================================================
# MODEL CONSTRUCTION
# =============================================================================

# Start with main body - using a tapered box for CRT depth profile
result = (
    cq.Workplane("XY")
    # Create base profile on XY plane
    .rect(body_width, body_depth_front)
    # Extrude with draft/taper to create depth variation (front narrower than back)
    .extrude(body_height)
)

# Create the screen recession (cut out area for CRT)
screen_cut = (
    cq.Workplane("XY")
    .workplane(offset=body_height - screen_depth)  # Move to near top
    .rect(screen_width + screen_frame * 2, screen_depth + 2)
    .extrude(screen_depth + 1, clean=True)
)

# Position screen cut on left portion of front face
screen_position_x = -(body_width / 2 - screen_width / 2 - screen_frame)
screen_position_y = body_depth_front / 2 - screen_depth / 2 - 1
screen_position_z = body_height / 2 - screen_height / 2 - screen_frame

# Cut the screen cavity from main body
result = result.cut(
    screen_cut.translate((
        screen_position_x,
        screen_position_y,
        screen_position_z
    ))
)

# Create the actual curved CRT screen surface (convex)
# Using a loft or revolved shape for the curve
crt_screen = (
    cq.Workplane("XZ")
    .transformed(offset=(screen_position_x, 0, screen_position_z))
    .rect(screen_width, screen_height)
    .workplane(offset=screen_depth * 0.7)
    .rect(screen_width * 0.95, screen_height * 0.95)
    .loft(combine=True)
)

# Add screen to result (as a separate solid representing glass)
# Actually, let's create it as part of the assembly

# Build the complete TV body with all features
tv_body = (
    cq.Workplane("XY")
    # Main shell with wall thickness consideration
    .box(body_width, body_depth_front, body_height)
    # Chamfer the front edges for realism
    .edges("|Z").chamfer(body_chamfer)
    .edges(">Z or <Z").chamfer(body_chamfer * 0.5)
)

# Screen frame/bezel (the raised border around screen)
frame_outer_w = screen_width + screen_frame * 2
frame_outer_h = screen_height + screen_frame * 2
frame_inner_w = screen_width
frame_inner_h = screen_height

screen_bezel = (
    cq.Workplane("XZ")
    .transformed(offset=(
        -(body_width/2 - frame_outer_w/2),
        body_depth_front/2 - 1,
        body_height/2 - frame_outer_h/2
    ))
    .rect(frame_outer_w, frame_outer_h)
    .rect(frame_inner_w, frame_inner_h, forConstruction=True)
    .extrude(3)
)

# Control panel block (right side of front)
control_panel_x = body_width/2 - panel_width/2 - 2
control_panel = (
    cq.Workplane("XZ")
    .transformed(offset=(
        control_panel_x,
        body_depth_front/2 - 1,
        body_height/2 - screen_height/2 - screen_frame - 10
    ))
    .box(panel_width, 3, 20)
)

# Add buttons to control panel
buttons = None
for row in range(button_rows):
    for col in range(button_cols):
        btn = (
            cq.Workplane("XZ")
            .transformed(offset=(
                control_panel_x - panel_width/2 + 2.5 + col * button_spacing,
                body_depth_front/2 + 0.5,
                body_height/2 - screen_height/2 - screen_frame - 18 + row * button_spacing
            ))
            .circle(button_size/2)
            .extrude(1.5)
        )
        if buttons is None:
            buttons = btn
        else:
            buttons = buttons.union(btn)

# Speaker grille area (below controls)
speaker = (
    cq.Workplane("XZ")
    .transformed(offset=(
        control_panel_x,
        body_depth_front/2 - 1,
        body_height/2 - screen_height/2 - screen_frame - 35
    ))
    .box(panel_width - 2, 3, speaker_height)
)

# Add grille lines to speaker
grille_lines = None
for i in range(grille_line_count):
    line_y = -speaker_height/2 + (i + 0.5) * (speaker_height / grille_line_count)
    line = (
        cq.Workplane("XZ")
        .transformed(offset=(
            control_panel_x,
            body_depth_front/2 + 1,
            body_height/2 - screen_height/2 - screen_frame - 35 + line_y
        ))
        .box(panel_width - 3, 1, 0.8)
    )
    if grille_lines is None:
        grille_lines = line
    else:
        grille_lines = grille_lines.union(line)

# Antenna base (on top of TV)
antenna_base = (
    cq.Workplane("XY")
    .transformed(offset=(0, -body_depth_front/4, body_height/2))
    .box(8, 8, antenna_base_height)
)

# Left antenna (angled left and back)
left_antenna_angle_rad = math.radians(antenna_angle_left)
left_antenna = (
    cq.Workplane("XZ")
    .transformed(offset=(-2, -body_depth_front/4, body_height/2 + antenna_base_height/2))
    .rotate((0,0,0), (0,1,0), antenna_angle_left)
    .rotate((0,0,0), (1,0,0), 15)  # Slight backward tilt
    .circle(antenna_diameter/2)
    .extrude(antenna_length)
)

# Right antenna (angled right and back)
right_antenna = (
    cq.Workplane("XZ")
    .transformed(offset=(2, -body_depth_front/4, body_height/2 + antenna_base_height/2))
    .rotate((0,0,0), (0,1,0), -antenna_angle_right)
    .rotate((0,0,0), (1,0,0), 20)  # Slight backward tilt
    .circle(antenna_diameter/2)
    .extrude(antenna_length)
)

# Assemble all components
result = (
    tv_body
    .union(screen_bezel)
    .union(control_panel)
    .union(buttons)
    .union(speaker)
    .union(grille_lines)
    .union(antenna_base)
    .union(left_antenna)
    .union(right_antenna)
)

# Optional: Add back panel protrusion for CRT tube
back_protrusion = (
    cq.Workplane("XY")
    .transformed(offset=(0, body_depth_front/2 - 5, 0))
    .box(body_width - 10, body_depth_back - body_depth_front + 10, body_height - 10)
)

result = result.union(back_protrusion)