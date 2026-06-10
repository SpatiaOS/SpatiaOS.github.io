import cadquery as cq

# Parameters
# General Dimensions (Full size keyboard with numpad)
kb_width = 450.0
kb_depth = 140.0
kb_thickness = 4.0
edge_fillet = 4.0

# Key Dimensions (Chiclet style)
key_width = 15.0
key_depth = 15.0
key_height = 1.2
key_fillet = 2.5

# Layout Spacing (Standard pitch is 19.05mm, using 19.0 for simplicity)
pitch_x = 19.0
pitch_y = 19.0

# Helper function to create a key shape
# Returns a Shape (Solid) to allow usage with .locate() in eachpoint
# The previous error occurred because a Workplane was returned, which 
# caused issues in the specific CadQuery version context with .locate() inside eachpoint.
# Returning .val() extracts the underlying Shape.
def make_chiclet_key(w, d, h, r):
    return (
        cq.Workplane("XY")
        .box(w, d, h)
        .edges("|Z")
        .fillet(r)
        .val() # Extract the Shape
    )

# 1. Base Plate
base_plate = (
    cq.Workplane("XY")
    .box(kb_width, kb_depth, kb_thickness)
    .edges("|Z")
    .fillet(edge_fillet)
)

# Workplane for placing keys (top surface of base)
keys_wp = cq.Workplane("XY").workplane(offset=kb_thickness)

# 2. Function Row (Top)
# 13 keys, shifted slightly right
func_start_x = -kb_width/2 + 40
func_start_y = -kb_depth/2 + 20

func_keys = (
    keys_wp
    .moveTo(func_start_x, func_start_y)
    .rarray(pitch_x, pitch_y, 13, 1, center=False)
    .eachpoint(lambda loc: make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(loc))
)

# 3. Main Alphanumeric Block
# 15 columns x 5 rows
# Positioned below the function row
main_start_x = -kb_width/2 + 20
main_start_y = func_start_y + pitch_y + 5 # Gap between F-row and Number row

main_keys = (
    keys_wp
    .moveTo(main_start_x, main_start_y)
    .rarray(pitch_x, pitch_y, 15, 5, center=False)
    .eachpoint(lambda loc: make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(loc))
)

# 4. Number Pad
# 4 columns x 5 rows
# Positioned on the right
numpad_start_x = kb_width/2 - 85
numpad_start_y = main_start_y # Align with top of main block

numpad_keys = (
    keys_wp
    .moveTo(numpad_start_x, numpad_start_y)
    .rarray(pitch_x, pitch_y, 4, 5, center=False)
    .eachpoint(lambda loc: make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(loc))
)

# 5. Arrow Keys (Inverted T)
# Positioned below the numpad/main block gap
arrow_base_x = numpad_start_x - pitch_x
arrow_base_y = main_start_y + 5 * pitch_y + 10

# Create individual arrow keys as Shapes using manual Locations
up_arrow = make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(cq.Location((arrow_base_x, arrow_base_y, 0)))
left_arrow = make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(cq.Location((arrow_base_x - pitch_x, arrow_base_y - pitch_y, 0)))
down_arrow = make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(cq.Location((arrow_base_x, arrow_base_y - pitch_y, 0)))
right_arrow = make_chiclet_key(key_width, key_depth, key_height, key_fillet).locate(cq.Location((arrow_base_x + pitch_x, arrow_base_y - pitch_y, 0)))

arrow_keys = cq.Workplane("XY").newObject([up_arrow, left_arrow, down_arrow, right_arrow])

# 6. Wide Keys (Spacebar, Shifts, Enter, Backspace)
# We add these on top of the grid to simulate the larger keys.
# Dimensions are based on standard key units (u) multiplied by pitch.

# Spacebar (~6u wide)
spacebar_x = main_start_x + 6 * pitch_x
spacebar_y = main_start_y + 4 * pitch_y
spacebar = make_chiclet_key(pitch_x * 6, key_depth, key_height, key_fillet).locate(cq.Location((spacebar_x, spacebar_y, 0)))

# Left Shift (~2.25u wide)
l_shift_x = main_start_x + 1.5 * pitch_x
l_shift_y = main_start_y + 4 * pitch_y
l_shift = make_chiclet_key(pitch_x * 2.25, key_depth, key_height, key_fillet).locate(cq.Location((l_shift_x, l_shift_y, 0)))

# Right Shift (~2.75u wide - often smaller on compact layouts, but let's make it standard)
r_shift_x = main_start_x + 11 * pitch_x
r_shift_y = main_start_y + 4 * pitch_y
r_shift = make_chiclet_key(pitch_x * 2.75, key_depth, key_height, key_fillet).locate(cq.Location((r_shift_x, r_shift_y, 0)))

# Enter (Tall, ~2u high)
enter_x = main_start_x + 13 * pitch_x
enter_y = main_start_y + 2 * pitch_y
enter_key = make_chiclet_key(key_width, key_depth * 2, key_height, key_fillet).locate(cq.Location((enter_x, enter_y + pitch_y/2, 0)))

# Backspace (~2u wide)
backspace_x = main_start_x + 12 * pitch_x
backspace_y = main_start_y
backspace = make_chiclet_key(pitch_x * 2, key_depth, key_height, key_fillet).locate(cq.Location((backspace_x, backspace_y, 0)))

wide_keys = cq.Workplane("XY").newObject([spacebar, l_shift, r_shift, enter_key, backspace])

# 7. Top Lip / Hinge (Battery compartment area)
# A small extrusion at the back edge
top_lip = (
    keys_wp
    .moveTo(0, -kb_depth/2 + 5)
    .rect(kb_width - 30, 8)
    .extrude(2)
    .edges("|Z")
    .fillet(1)
)

# Final Assembly
# Union base, all key groups, and the lip
result = (
    base_plate
    .union(func_keys)
    .union(main_keys)
    .union(numpad_keys)
    .union(arrow_keys)
    .union(wide_keys)
    .union(top_lip)
)