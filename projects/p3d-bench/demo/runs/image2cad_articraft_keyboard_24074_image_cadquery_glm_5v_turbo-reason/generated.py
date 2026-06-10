import cadquery as cq

# ============================================================
# Keyboard Model Parameters
# ============================================================
# Overall dimensions
keyboard_length = 440.0      # Total length of keyboard (X-axis)
keyboard_width = 135.0       # Total width of keyboard (Y-axis)  
base_thickness = 6.0         # Thickness of the base plate
corner_radius = 8.0          # Radius of rounded corners

# Key parameters
key_size = 13.0              # Standard key cap size (square)
key_height = 2.5             # Height of key caps above base
key_gap = 2.5                # Gap between keys
key_corner_radius = 1.5      # Radius of key cap corners

# Layout parameters
margin_x = 12.0              # Side margin for keys
margin_y_top = 15.0          # Top margin (back of keyboard)
margin_y_bottom = 18.0       # Bottom margin (front of keyboard)

# Special key multipliers (width in units of standard key)
spacebar_width_units = 6.25
enter_width_units = 2.25
shift_right_width_units = 2.75
shift_left_width_units = 2.25
backspace_width_units = 2.0
tab_width_units = 1.75
caps_width_units = 1.75
numpad_zero_width = 2.0
numpad_enter_height = 2.0

# Number pad offset (right section)
numpad_offset_x = 310.0      # X position where numpad starts
numpad_cols = 4              # Columns in numpad
numpad_rows = 5              # Rows in numpad

# Main key grid dimensions
main_cols = 14               # Columns in main area
main_rows = 5                # Rows in main typing area (excluding bottom row)

# ============================================================
# Helper function to create a single key
# ============================================================
def make_key(width_units=1.0, height_units=1.0):
    """Create a single key cap with rounded corners"""
    kw = key_size * width_units + key_gap * (width_units - 1)
    kh = key_size * height_units + key_gap * (height_units - 1)
    return (
        cq.Workplane("XY")
        .rect(kw, kh)
        .extrude(key_height)
        .edges("|Z").fillet(key_corner_radius)
    )

# ============================================================
# Create the keyboard base
# ============================================================
base = (
    cq.Workplane("XY")
    .box(keyboard_length, keyboard_width, base_thickness)
    .edges("|Z and (not |X) and (not |Y)")
    .fillet(corner_radius)
)

# ============================================================
# Build the key layout
# ============================================================
keys = None  # Will hold all keys combined

# Starting position for first row
start_x = -keyboard_length / 2 + margin_x + key_size / 2
start_y = keyboard_width / 2 - margin_y_top - key_size / 2

def add_key_at(x, y, width=1.0, height=1.0):
    """Add a key at specified position and return the solid"""
    return make_key(width, height).translate((x, y, base_thickness / 2))

# Row definitions: each row is list of (width_multiplier, is_special_position)
# We'll build row by row with proper staggering

# Function to calculate x position for a column with staggering
col_positions = []
for col in range(main_cols):
    # Staggered layout simulation
    stagger = 0
    if col >= 1:
        stagger = 1.5  # Slight offset for ergonomic feel
    col_positions.append(start_x + col * (key_size + key_gap) + stagger)

# Build main key area (left/center section)
row_configs = [
    # Row 1 (top): Esc, F-row equivalent simplified, number row
    [1.0] * 14,
    # Row 2: Tab row  
    [1.75] + [1.0] * 12 + [1.5],
    # Row 3: Caps row
    [1.75] + [1.0] * 11 + [2.25, 1.25],
    # Row 4: Shift row
    [2.25] + [1.0] * 10 + [2.75, 1.0],
    # Row 5: Bottom row with spacebar
    [1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.0, 1.0],  # Simplified bottom
]

current_y = start_y
all_keys = []

for row_idx, row_config in enumerate(row_configs[:4]):  # First 4 rows standard
    x_pos = start_x
    if row_idx == 1:  # Tab row indent
        x_pos += 5
    elif row_idx == 2:  # Caps row indent  
        x_pos += 8
    elif row_idx == 3:  # Shift row indent
        x_pos += 12
        
    for key_width in row_config:
        if x_pos < numpad_offset_x - 20:  # Don't overlap numpad area
            key_solid = add_key_at(x_pos, current_y, key_width)
            all_keys.append(key_solid)
        x_pos += key_width * key_size + (key_width - 1) * key_gap
    
    current_y -= (key_size + key_gap)

# Add spacebar row (bottom)
current_y -= (key_size + key_gap)
bottom_row_keys = [
    (start_x + 10, 1.25),
    (start_x + 10 + 1.25*(key_size+key_gap), 1.25), 
    (start_x + 10 + 2.5*(key_size+key_gap), spacebar_width_units),
    (start_x + 10 + (2.5+spacebar_width_units)*(key_size+key_gap), 1.25),
]
for bx, bw in bottom_row_keys:
    if bx < numpad_offset_x - 30:
        all_keys.append(add_key_at(bx, current_y, bw))

# Build Numpad (right section)
numpad_start_x = numpad_offset_x
numpad_start_y = start_y

numpad_layout = [
    # Numpad rows (top to bottom)
    [1.0, 1.0, 1.0, 2.0],     # Numlock, /, *, -
    [1.0, 1.0, 1.0, 2.0],     # 7,8,9,+
    [1.0, 1.0, 1.0, 2.0],     # 4,5,6 (plus extends down)
    [1.0, 1.0, 1.0, 1.0],     # 1,2,3,enter top
    [2.0, 1.0, 1.0, 1.0],     # 0,.,enter bottom
]

ny = numpad_start_y
for nrow in numpad_layout:
    nx = numpad_start_x
    for nw in nrow:
        all_keys.append(add_key_at(nx, ny, nw))
        nx += nw * key_size + (nw - 1) * key_gap
    ny -= (key_size + key_gap)

# Combine all keys into one object
if all_keys:
    keys_combined = all_keys[0]
    for k in all_keys[1:]:
        keys_combined = keys_combined.union(k)

# ============================================================
# Final assembly: Combine base with keys
# ============================================================
result = base.union(keys_combined)

# Optional: Add slight draft/taper to sides for aesthetic (uncomment if desired)
# result = result.edges(">Z and |X").chamfer(0.5)

print("Keyboard model generated successfully")