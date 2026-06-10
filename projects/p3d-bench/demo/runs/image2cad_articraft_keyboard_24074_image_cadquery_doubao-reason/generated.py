import cadquery as cq

# --------------------------
# Parameters (estimated from model proportions)
# --------------------------
overall_length = 280.0       # Total length of keyboard (long axis)
overall_width = 120.0        # Total width of keyboard (short axis)
base_thickness = 2.0         # Thickness of the main base plate
key_protrusion = 1.0         # Height of keycaps above base surface
border_width = 3.0           # Width of the border around the key matrix
key_gap = 1.2                # Spacing between adjacent keycaps
key_1u_size = 10.0           # Dimensions of standard 1-unit square key
key_2u_size = 2*key_1u_size + key_gap  # Length of 2-unit wide key
key_2_25u_size = 2.25*key_1u_size + 1.25*key_gap  # Modifier key length
key_6_25u_size = 6.25*key_1u_size + 5.25*key_gap  # Spacebar length
lip_radius = base_thickness  # Radius of curved lip on left edge

# --------------------------
# Create base plate
# --------------------------
base = (
    cq.Workplane("XY")
    .rect(overall_length, overall_width)
    .extrude(base_thickness)
    .edges("|Z").fillet(0.5)  # Soften side edges
)

# Add curved lip on left short edge (matches image detail)
left_lip = (
    cq.Workplane("XZ", origin=(0, 0, 0))
    .threePointArc((-lip_radius, 0, base_thickness/2), (0, 0, base_thickness))
    .close()
    .extrude(overall_width)
)
base = base.union(left_lip)

# --------------------------
# Generate keycaps
# --------------------------
key_workplane = base.faces(">Z").workplane()
keys = cq.Workplane()

# 1. Alphanumeric section standard keys
alpha_rows = 6
alpha_cols = 15
for row in range(alpha_rows):
    y_offset = border_width + key_1u_size/2 + row*(key_1u_size + key_gap)
    for col in range(alpha_cols):
        # Skip positions reserved for larger special keys
        skip_key = False
        if row == alpha_rows-1 and 2 < col < 9:  # Spacebar position
            skip_key = True
        if row == alpha_rows-2 and col == 0:  # Left shift position
            skip_key = True
        if row == alpha_rows-3 and col >= alpha_cols-2:  # Enter position
            skip_key = True
        if row == 0 and col >= alpha_cols-2:  # Backspace position
            skip_key = True
        
        if not skip_key:
            x_offset = border_width + key_1u_size/2 + col*(key_1u_size + key_gap)
            keys = keys.union(
                key_workplane.center(x_offset, y_offset)
                .rect(key_1u_size, key_1u_size)
                .extrude(key_protrusion)
                .edges("|Z").fillet(0.3)
            )

# 2. Alphanumeric special keys
# Spacebar
keys = keys.union(
    key_workplane.center(border_width + key_6_25u_size/2 + 2*(key_1u_size + key_gap), 
                        border_width + key_1u_size/2 + (alpha_rows-1)*(key_1u_size + key_gap))
    .rect(key_6_25u_size, key_1u_size)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)
# Left shift
keys = keys.union(
    key_workplane.center(border_width + key_2_25u_size/2, 
                        border_width + key_1u_size/2 + (alpha_rows-2)*(key_1u_size + key_gap))
    .rect(key_2_25u_size, key_1u_size)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)
# Enter
keys = keys.union(
    key_workplane.center(border_width + key_2u_size/2 + (alpha_cols-2)*(key_1u_size + key_gap), 
                        border_width + key_1u_size/2 + (alpha_rows-3)*(key_1u_size + key_gap))
    .rect(key_2u_size, key_1u_size)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)
# Backspace
keys = keys.union(
    key_workplane.center(border_width + key_2u_size/2 + (alpha_cols-2)*(key_1u_size + key_gap), 
                        border_width + key_1u_size/2)
    .rect(key_2u_size, key_1u_size)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)

# 3. Numpad section (right side of keyboard)
numpad_cols = 4
numpad_rows = 5
numpad_start_x = overall_length - border_width - numpad_cols*(key_1u_size + key_gap) + key_gap
for row in range(numpad_rows):
    y_offset = border_width + key_1u_size/2 + row*(key_1u_size + key_gap)
    for col in range(numpad_cols):
        # Skip positions for larger numpad keys
        skip_key = False
        if 0 < row < 3 and col == numpad_cols-1:  # Plus key position
            skip_key = True
        if row >= numpad_rows-2 and col == numpad_cols-1:  # Numpad enter position
            skip_key = True
        if row == numpad_rows-1 and col < 2:  # Numpad 0 position
            skip_key = True
        
        if not skip_key:
            x_offset = numpad_start_x + key_1u_size/2 + col*(key_1u_size + key_gap)
            keys = keys.union(
                key_workplane.center(x_offset, y_offset)
                .rect(key_1u_size, key_1u_size)
                .extrude(key_protrusion)
                .edges("|Z").fillet(0.3)
            )

# 4. Numpad special keys
# Vertical plus key
keys = keys.union(
    key_workplane.center(numpad_start_x + key_1u_size/2 + (numpad_cols-1)*(key_1u_size + key_gap), 
                        border_width + key_1u_size + key_gap + (key_1u_size + key_gap))
    .rect(key_1u_size, 2*key_1u_size + key_gap)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)
# Vertical numpad enter
keys = keys.union(
    key_workplane.center(numpad_start_x + key_1u_size/2 + (numpad_cols-1)*(key_1u_size + key_gap), 
                        border_width + 3*key_1u_size + 3*key_gap)
    .rect(key_1u_size, 2*key_1u_size + key_gap)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)
# 2u wide numpad 0
keys = keys.union(
    key_workplane.center(numpad_start_x + key_2u_size/2, 
                        border_width + key_1u_size/2 + (numpad_rows-1)*(key_1u_size + key_gap))
    .rect(key_2u_size, key_1u_size)
    .extrude(key_protrusion)
    .edges("|Z").fillet(0.3)
)

# Combine base and keycaps into final assembly
result = base.union(keys)