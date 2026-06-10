import cadquery as cq
import math

# ============================================
# Vintage CRT Television Set
# ============================================

# Main cabinet parameters
tv_width = 500.0        # Total width of TV
tv_height = 350.0       # Total height of TV
tv_depth = 340.0        # Total depth (CRT requires significant depth)
cabinet_fillet = 12.0    # Fillet radius on cabinet edges

# Front bezel parameters
bezel_width = 8.0        # Width of the outer bezel frame
bezel_depth = 15.0       # How far the bezel protrudes from front

# Screen parameters
screen_width = 330.0     # Width of the CRT screen area
screen_height = 260.0    # Height of the CRT screen area
screen_offset_x = -60.0  # Screen shifted left (control panel on right)
screen_offset_y = 10.0   # Screen shifted up slightly
screen_recess = 5.0      # How deep the screen is recessed
screen_fillet = 15.0     # Rounded corners on screen

# Control panel parameters
panel_width = 90.0       # Width of control panel area
panel_height = 280.0     # Height of control panel
panel_offset_x = 195.0   # X position of control panel center
panel_recess = 3.0       # Control panel recess depth

# Button parameters
button_rows = 4
button_cols = 3
button_width = 18.0
button_height = 12.0
button_spacing_x = 24.0
button_spacing_y = 18.0
button_area_offset_y = -30.0  # Buttons in lower portion of panel

# Speaker grille parameters (on control panel, upper area)
speaker_width = 70.0
speaker_height = 50.0
speaker_offset_y = 70.0

# Antenna parameters
antenna_length = 300.0
antenna_radius = 1.5
antenna_base_radius = 6.0
antenna_base_height = 10.0

# Foot/stand parameters
foot_width = 40.0
foot_depth = 60.0
foot_height = 8.0

# ============================================
# Step 1: Create the main cabinet body
# ============================================
cabinet = (
    cq.Workplane("XY")
    .box(tv_width, tv_depth, tv_height)
    .edges("|Z")
    .fillet(cabinet_fillet)
    .edges("|X")
    .fillet(8.0)
)

# ============================================
# Step 2: Create the front bezel frame
# ============================================
# The front face is at Y = -tv_depth/2
bezel = (
    cq.Workplane("XY")
    .workplane(offset=0)
    .transformed(offset=(0, -tv_depth / 2 - bezel_depth / 2, 0))
    .box(tv_width - 4, bezel_depth, tv_height - 4)
    .edges("|Y")
    .fillet(10.0)
)

cabinet = cabinet.union(bezel)

# ============================================
# Step 3: Cut out the screen recess
# ============================================
screen_cut = (
    cq.Workplane("XY")
    .transformed(offset=(screen_offset_x, -tv_depth / 2 - bezel_depth + screen_recess, screen_offset_y))
    .box(screen_width, bezel_depth + 10, screen_height)
    .edges("|Y")
    .fillet(screen_fillet)
)

cabinet = cabinet.cut(screen_cut)

# ============================================
# Step 4: Add the CRT screen glass (slightly recessed)
# ============================================
screen_glass = (
    cq.Workplane("XY")
    .transformed(offset=(screen_offset_x, -tv_depth / 2 - bezel_depth + screen_recess + 2, screen_offset_y))
    .box(screen_width - 4, 4.0, screen_height - 4)
    .edges("|Y")
    .fillet(screen_fillet - 2)
)

cabinet = cabinet.union(screen_glass)

# ============================================
# Step 5: Create the inner screen bezel (frame around screen)
# ============================================
inner_bezel = (
    cq.Workplane("XY")
    .transformed(offset=(screen_offset_x, -tv_depth / 2 - bezel_depth / 2, screen_offset_y))
    .box(screen_width + 20, bezel_depth + 2, screen_height + 20)
    .edges("|Y")
    .fillet(screen_fillet + 3)
)

inner_bezel_cut = (
    cq.Workplane("XY")
    .transformed(offset=(screen_offset_x, -tv_depth / 2 - bezel_depth / 2, screen_offset_y))
    .box(screen_width, bezel_depth + 10, screen_height)
    .edges("|Y")
    .fillet(screen_fillet)
)

inner_frame = inner_bezel.cut(inner_bezel_cut)

# Only keep the front portion
front_clip = (
    cq.Workplane("XY")
    .transformed(offset=(0, -tv_depth / 2 - bezel_depth / 2, 0))
    .box(tv_width + 20, bezel_depth + 5, tv_height + 20)
)
inner_frame = inner_frame.intersect(front_clip)

cabinet = cabinet.union(inner_frame)

# ============================================
# Step 6: Cut out control panel recess
# ============================================
panel_cut = (
    cq.Workplane("XY")
    .transformed(offset=(panel_offset_x, -tv_depth / 2 - bezel_depth + panel_recess / 2, -10))
    .box(panel_width, panel_recess + bezel_depth, panel_height)
    .edges("|Y")
    .fillet(3.0)
)

cabinet = cabinet.cut(panel_cut)

# ============================================
# Step 7: Add buttons on the control panel
# ============================================
buttons = cq.Workplane("XY")

for row in range(button_rows):
    for col in range(button_cols):
        bx = panel_offset_x + (col - (button_cols - 1) / 2) * button_spacing_x
        bz = button_area_offset_y + (row - (button_rows - 1) / 2) * button_spacing_y
        by = -tv_depth / 2 - bezel_depth + 1.0

        button = (
            cq.Workplane("XY")
            .transformed(offset=(bx, by, bz))
            .box(button_width, 2.5, button_height)
            .edges("|Y")
            .fillet(1.5)
        )
        buttons = buttons.union(button)

cabinet = cabinet.union(buttons)

# ============================================
# Step 8: Add small indicator dots near top of panel
# ============================================
for i in range(3):
    indicator = (
        cq.Workplane("XY")
        .transformed(offset=(panel_offset_x - 15 + i * 15, -tv_depth / 2 - bezel_depth + 0.5, 85))
        .sphere(3.0)
    )
    cabinet = cabinet.union(indicator)

# ============================================
# Step 9: Create vertical divider line between screen and panel
# ============================================
divider = (
    cq.Workplane("XY")
    .transformed(offset=(panel_offset_x - panel_width / 2 - 2, -tv_depth / 2 - bezel_depth / 2, 0))
    .box(3.0, bezel_depth + 2, tv_height - 20)
    .edges("|Y")
    .fillet(1.0)
)
cabinet = cabinet.union(divider)

# ============================================
# Step 10: Add horizontal divider on panel (between speaker and buttons)
# ============================================
h_divider = (
    cq.Workplane("XY")
    .transformed(offset=(panel_offset_x, -tv_depth / 2 - bezel_depth / 2, 25))
    .box(panel_width - 4, bezel_depth + 1, 2.5)
)
cabinet = cabinet.union(h_divider)

# ============================================
# Step 11: Create bottom label/brand strip
# ============================================
label_strip = (
    cq.Workplane("XY")
    .transformed(offset=(screen_offset_x, -tv_depth / 2 - bezel_depth - 0.5, -tv_height / 2 + 25))
    .box(screen_width - 20, 2.0, 12.0)
    .edges("|Y")
    .fillet(1.0)
)
cabinet = cabinet.union(label_strip)

# ============================================
# Step 12: Create antenna bases on top
# ============================================
antenna_base_x1 = panel_offset_x - 20  # Right-ish on top
antenna_base_x2 = panel_offset_x + 10

antenna_base1 = (
    cq.Workplane("XY")
    .transformed(offset=(antenna_base_x1, -tv_depth / 2 + 40, tv_height / 2))
    .cylinder(antenna_base_height, antenna_base_radius)
)

antenna_base2 = (
    cq.Workplane("XY")
    .transformed(offset=(antenna_base_x2, -tv_depth / 2 + 40, tv_height / 2))
    .cylinder(antenna_base_height, antenna_base_radius)
)

cabinet = cabinet.union(antenna_base1).union(antenna_base2)

# ============================================
# Step 13: Create rabbit ear antennas
# ============================================
# Antenna 1 - angled to the left and back
ant1_start_x = antenna_base_x1
ant1_start_y = -tv_depth / 2 + 40
ant1_start_z = tv_height / 2 + antenna_base_height

# Antenna going up-left
antenna1 = (
    cq.Workplane("XZ")
    .transformed(offset=(ant1_start_x, ant1_start_z, -ant1_start_y))
    .transformed(rotate=(0, 30, -25))
    .cylinder(antenna_length, antenna_radius)
)

# Antenna 2 - angled to the right and back
ant2_start_x = antenna_base_x2
ant2_start_y = -tv_depth / 2 + 40
ant2_start_z = tv_height / 2 + antenna_base_height

antenna2 = (
    cq.Workplane("XZ")
    .transformed(offset=(ant2_start_x, ant2_start_z, -ant2_start_y))
    .transformed(rotate=(0, -20, 35))
    .cylinder(antenna_length, antenna_radius)
)

cabinet = cabinet.union(antenna1).union(antenna2)

# ============================================
# Step 14: Add feet on the bottom
# ============================================
foot_positions = [
    (-tv_width / 2 + 50, -tv_depth / 2 + 50),
    (tv_width / 2 - 50, -tv_depth / 2 + 50),
    (-tv_width / 2 + 50, tv_depth / 2 - 80),
    (tv_width / 2 - 50, tv_depth / 2 - 80),
]

for fx, fy in foot_positions:
    foot = (
        cq.Workplane("XY")
        .transformed(offset=(fx, fy, -tv_height / 2 - foot_height / 2))
        .box(foot_width, foot_depth, foot_height)
        .edges("|Z")
        .fillet(5.0)
    )
    cabinet = cabinet.union(foot)

# ============================================
# Step 15: Add rear ventilation slots
# ============================================
vent_slots = cq.Workplane("XY")
for i in range(8):
    slot = (
        cq.Workplane("XY")
        .transformed(offset=(
            -80 + i * 25,
            tv_depth / 2 - 2,
            50
        ))
        .box(10.0, 8.0, 80.0)
    )
    vent_slots = vent_slots.union(slot)

cabinet = cabinet.cut(vent_slots)

# ============================================
# Final result
# ============================================
result = cabinet