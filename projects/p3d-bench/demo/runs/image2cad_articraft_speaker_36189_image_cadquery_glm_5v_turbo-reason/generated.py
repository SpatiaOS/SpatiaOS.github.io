import cadquery as cq
import math

# =============================================================================
# Parameters - Main Body Dimensions
# =============================================================================
body_length = 220.0      # Total length of the speaker body (X-axis)
body_width = 85.0        # Depth of the body (Y-axis)
body_height = 105.0      # Height of the body (Z-axis)
wall_thickness = 4.0     # Wall thickness for shell features
fillet_radius = 4.0      # Edge rounding

# =============================================================================
# Parameters - Speaker Grilles
# =============================================================================
speaker_diameter = 52.0          # Diameter of inner speaker cone circle
speaker_hex_flat = 70.0          # Distance across flats of hexagonal frame
speaker_hex_depth = 4.0          # Depth of hexagonal recess
grille_line_count = 36           # Number of radial grille lines
grille_line_width = 2.0          # Width of each radial line
grille_recess_depth = 2.5        # Depth of grille pattern
speaker_spacing = 110.0          # Center-to-center distance between speakers

# =============================================================================
# Parameters - Center Decoration (X-Pattern)
# =============================================================================
center_pattern_width = 35.0      # Width of the X/diamond pattern
center_pattern_height = 55.0     # Height of the pattern
center_pattern_depth = 2.5       # Engrave depth

# =============================================================================
# Parameters - Control Buttons
# =============================================================================
button_count = 3
button_diameter = 10.0
button_height = 2.0
button_spacing = 16.0            # Spacing between button centers
button_offset_from_edge = 28.0   # Distance from right edge

# =============================================================================
# Parameters - Legs
# =============================================================================
leg_height = 65.0
leg_top_diameter = 14.0
leg_bottom_diameter = 9.0

# Leg positions relative to body center bottom
leg_positions = [
    (-body_length * 0.38, -body_width * 0.32),   # Front left
    (-body_length * 0.38, body_width * 0.32),    # Front right  
    (body_length * 0.38, -body_width * 0.32),    # Back left
    (body_length * 0.38, body_width * 0.32),     # Back right
]

# =============================================================================
# Parameters - Top Panel Lines
# =============================================================================
panel_line_depth = 1.0
panel_line_width = 1.0

# =============================================================================
# Build the Model
# =============================================================================

# 1. Create the main rectangular body with filleted edges
body = (
    cq.Workplane("XY")
    .box(body_length, body_width, body_height)
    .edges("|Z")
    .fillet(fillet_radius)
)

# 2. Helper function to create speaker grille assembly at given X position
def create_speaker_grille(center_x):
    """
    Creates a complete speaker grille feature including:
    - Hexagonal recessed frame
    - Radial grille lines
    - Central speaker cone circle
    """
    # Work on the front face (positive Z side) at specified X position
    base_wp = (
        cq.Workplane("XY")
        .workplane(offset=body_height / 2)
        .transformed(offset=(center_x, 0, 0))
    )
    
    # Calculate hexagon radius from flat-to-flat distance
    hex_radius = speaker_hex_flat / (2 * math.cos(math.pi / 6))
    
    # Create hexagonal recess (cut into body)
    hex_cut = (
        base_wp
        .polygon(6, hex_radius)
        .extrude(-speaker_hex_depth)
    )
    
    # Create radial grille lines inside the hex area
    inner_r = speaker_diameter / 2 + 2
    outer_r = speaker_hex_flat / 2 - 4
    
    # Build one radial line then rotate copies around center
    grille_wp = (
        cq.Workplane("XY")
        .workplane(offset=body_height / 2 - speaker_hex_depth + 0.01)
        .transformed(offset=(center_x, 0, 0))
    )
    
    # Create single radial line (thin rectangle positioned radially)
    line_length = outer_r - inner_r
    single_line = (
        grille_wp
        .center(0, inner_r + line_length / 2)
        .rect(grille_line_width, line_length)
        .extrude(-grille_recess_depth)
    )
    
    # Polar array - create all rotated copies
    all_lines = single_line
    for i in range(1, grille_line_count):
        angle = i * (360.0 / grille_line_count)
        rotated = single_line.rotate((center_x, 0, 0), (center_x, 0, 1), angle)
        all_lines = all_lines.union(rotated)
    
    # Central speaker cone (circular feature at center)
    cone = (
        grille_wp
        .circle(speaker_diameter / 2)
        .extrude(-(speaker_hex_depth - 1))
    )
    
    return hex_cut.union(all_lines).union(cone)

# 3. Create both speaker grilles
left_speaker = create_speaker_grille(-speaker_spacing / 2)
right_speaker = create_speaker_grille(speaker_spacing / 2)

# 4. Create center X-pattern decoration (between the two speakers)
center_x_pos = 0
center_wp = (
    cq.Workplane("XY")
    .workplane(offset=body_height / 2)
    .transformed(offset=(center_x_pos, 0, 0))
)

# X shape made of two crossed rectangles
bar1 = center_wp.rect(center_pattern_width * 0.25, center_pattern_height).extrude(-center_pattern_depth)
bar2 = center_wp.rect(center_pattern_height * 0.25, center_pattern_width).extrude(-center_pattern_depth)

# Add diamond shapes on sides of X
diamond_size = 18
diamond1 = (
    center_wp
    .transformed(offset=(-22, 0, 0))
    .polygon(4, diamond_size)
    .extrude(-center_pattern_depth)
)
diamond2 = (
    center_wp
    .transformed(offset=(22, 0, 0))
    .polygon(4, diamond_size)
    .extrude(-center_pattern_depth)
)

center_pattern = bar1.union(bar2).union(diamond1).union(diamond2)

# 5. Create control buttons on top surface (upper right area)
buttons = None
for i in range(button_count):
    btn_x = body_length / 2 - button_offset_from_edge
    btn_y = -button_spacing + (i * button_spacing)
    
    btn = (
        cq.Workplane("XY")
        .workplane(offset=body_height / 2)
        .transformed(offset=(btn_x, btn_y, 0))
        .circle(button_diameter / 2)
        .extrude(button_height)
    )
    
    if buttons is None:
        buttons = btn
    else:
        buttons = buttons.union(btn)

# 6. Create tapered legs at four corners
legs = None
for pos in leg_positions:
    x_pos, y_pos = pos
    
    # Create lofted leg from top circle to smaller bottom circle
    leg = (
        cq.Workplane("XY")
        .transformed(offset=(x_pos, y_pos, -body_height / 2))
        .circle(leg_top_diameter / 2)
        .workplane(offset=-leg_height)
        .circle(leg_bottom_diameter / 2)
        .loft()
    )
    
    if legs is None:
        legs = leg
    else:
        legs = legs.union(leg)

# 7. Create top panel decorative dividing lines (grooves on top surface)
top_wp = (
    cq.Workplane("XY")
    .workplane(offset=body_height / 2)
)

# Longitudinal groove lines across top surface
line1 = top_wp.rect(body_length * 0.85, panel_line_width).extrude(-panel_line_depth)
line2 = (
    top_wp
    .transformed(offset=(-body_length * 0.12, 0, 0))
    .rect(body_length * 0.65, panel_line_width)
    .extrude(-panel_line_depth)
)
line3 = (
    top_wp
    .transformed(offset=(body_length * 0.06, 0, 0))
    .rect(body_length * 0.42, panel_line_width)
    .extrude(-panel_line_depth)
)

top_panels = line1.union(line2).union(line3)

# =============================================================================
# Assemble Final Result
# Combine body with cuts and additions
# =============================================================================

result = (
    body
    .cut(left_speaker)           # Cut left speaker grille
    .cut(right_speaker)          # Cut right speaker grille  
    .cut(center_pattern)         # Cut center X-decoration
    .cut(top_panels)             # Cut top panel grooves
    .union(buttons)              # Add control buttons
    .union(legs)                 # Add tapered legs
)