import cadquery as cq

# =============================================================================
# Keyboard Parameters
# =============================================================================

# Overall chassis dimensions (mm)
kbd_length = 280.0
kbd_width = 120.0
base_thickness = 4.0
corner_fillet = 3.0

# Left-side cylindrical battery / hinge compartment
cyl_diameter = 5.0
cyl_length = kbd_width

# Key parameters
key_pitch = 18.0            # Center-to-center distance (1U)
key_gap = 1.5               # Visual gap between adjacent caps
key_cap_y = key_pitch - key_gap   # Key depth (front-to-back)
key_height = 2.5            # How far keys protrude above the base

# =============================================================================
# Key Layout Definition
# =============================================================================
# Each row is defined by its Y position and a list of key widths in "units".
# The layout approximates a compact 78-key keyboard (no numpad).
# Positive Y points toward the back edge.

key_layout = [
    # Row 0: Function keys (Esc, F1-F12, Eject)
    (45.0, [1.0] * 14),

    # Row 1: Number row (` through Backspace)
    (27.0, [1.0] * 13 + [2.0]),

    # Row 2: QWERTY row (Tab through \)
    (9.0, [1.5] + [1.0] * 12 + [1.5]),

    # Row 3: Home row (Caps Lock through Enter)
    (-9.0, [1.75] + [1.0] * 11 + [2.25]),

    # Row 4: Lower alpha row (Left Shift through Right Shift)
    (-27.0, [2.25] + [1.0] * 10 + [2.75]),

    # Row 5: Bottom row (modifiers + spacebar)
    (-45.0, [1.0, 1.0, 1.0, 1.25, 6.0, 1.25, 1.0, 1.0, 1.0]),
]

# =============================================================================
# Base Chassis
# =============================================================================
# Create a thin rounded rectangular slab for the keyboard body.

base = (
    cq.Workplane("XY")
    .box(kbd_length, kbd_width, base_thickness)
    .edges("|Z")
    .fillet(corner_fillet)
)

# =============================================================================
# Left-Side Cylindrical Compartment
# =============================================================================
# The image shows a distinct tube along the left edge that acts as a battery
# housing / foot. It is positioned flush with the bottom face.

cylinder = (
    cq.Workplane("XZ")
    .cylinder(cyl_length, cyl_diameter / 2, centered=True)
    .translate((-kbd_length / 2, 0, -base_thickness / 2 + cyl_diameter / 2))
)

# Merge the cylinder into the main chassis
keyboard = base.union(cylinder)

# =============================================================================
# Key Caps
# =============================================================================
# Generate each key cap as a rectangular prism, center it in its allocated
# unit slot, and place it on top of the chassis.

all_keys = None

for y_pos, key_widths in key_layout:
    # Center the entire row horizontally on the chassis
    row_width = sum(key_widths) * key_pitch
    x_pos = -row_width / 2

    for w in key_widths:
        # Actual key cap width after accounting for the gap
        cap_x = w * key_pitch - key_gap

        # Build the key cap centered at the origin, then translate into place
        cap = (
            cq.Workplane("XY")
            .box(cap_x, key_cap_y, key_height)
            .translate((
                x_pos + (w * key_pitch) / 2,
                y_pos,
                base_thickness / 2 + key_height / 2
            ))
        )

        # Slight top-edge chamfer for a realistic low-profile key appearance
        cap = cap.faces(">Z").edges().chamfer(0.2)

        # Accumulate keys into a single solid
        if all_keys is None:
            all_keys = cap
        else:
            all_keys = all_keys.union(cap)

        # Advance to the next key slot
        x_pos += w * key_pitch

# =============================================================================
# Final Assembly
# =============================================================================
result = keyboard.union(all_keys)