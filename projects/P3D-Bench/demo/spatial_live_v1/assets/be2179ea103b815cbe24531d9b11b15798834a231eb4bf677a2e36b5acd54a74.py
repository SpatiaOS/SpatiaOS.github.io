import cadquery as cq

# ----------------------
# Parameter Definitions
# ----------------------
# Overall body dimensions (mm)
body_length = 50.7       # X axis: long axis across front face
body_height = 19.0       # Z axis: vertical height of front face
body_depth = 8.0         # Y axis: depth from front face to back of housing
pin_radius = 0.25        # Radius of locating pins
pin_shank_len = 2.63     # Length of cylindrical pin shank
pin_tip_len = 0.37       # Length of conical pin tip
pin_tip_radius = 0.1     # Radius of truncated pin tip (flat end)
pin_count = 12           # Total number of pins
pin_spacing = 2.54       # Standard 0.1" pin pitch
pin_z_center = 19.0      # Z position of pin axes (upper rear edge, top of housing)

# 7-segment digit parameters (mm)
digit_width = 7.8        # Total width of a single digit
digit_height = 17.4      # Total height of a single digit
segment_thick = 1.8      # Thickness (width) of each segment bar
segment_len = 6.0        # Length of horizontal/vertical segments
seg_chamfer = 0.8        # Size of 45° chamfer on segment corners
seg_raise = 0.01         # Height segments are raised above front face
digit_pitch = 12.0       # Distance between left edges of adjacent digits
digit_left_margin = 3.2  # Margin from left edge of housing to first digit
digit_bottom_margin = (body_height - digit_height) / 2  # Center digits vertically

# Decimal point parameters (mm)
decimal_radius = 0.8     # Radius of decimal point dots
decimal_raise = 0.01     # Height decimals are raised above front face
decimal_x_offset = digit_width + 2.1  # X offset from digit left edge to decimal center
decimal_z_offset = 1.6   # Z offset from digit bottom to decimal center

# ----------------------
# Model Construction
# ----------------------
# Create main housing block (fused spacer + front shim plate as single solid)
# Front face sits on XZ plane at Y=0, extends back along +Y to back of housing
result = cq.Workplane("XZ").box(
    body_length, body_depth, body_height,
    centered=(False, False, False)
)

# Calculate starting X positions for the 4 evenly spaced digits
digit_x_starts = [digit_left_margin + i * digit_pitch for i in range(4)]
z0 = digit_bottom_margin
dw = digit_width
dh = digit_height
st = segment_thick
hl = segment_len
cs = seg_chamfer

# Add raised seven-segment patterns for each digit
for x0 in digit_x_starts:
    # Define hexagonal vertex sets for each segment (local u,v: u=right, v=up from digit bottom)
    seg_A = [  # Top horizontal
        (st/2 + cs, dh),
        (st/2 + hl - cs, dh),
        (st/2 + hl, dh - cs),
        (st/2 + hl - cs, dh - st),
        (st/2 + cs, dh - st),
        (st/2, dh - cs),
    ]
    seg_D = [  # Bottom horizontal
        (st/2 + cs, 0),
        (st/2 + hl - cs, 0),
        (st/2 + hl, cs),
        (st/2 + hl - cs, st),
        (st/2 + cs, st),
        (st/2, cs),
    ]
    seg_G = [  # Middle horizontal
        (st/2 + cs, dh/2 + st/2),
        (st/2 + hl - cs, dh/2 + st/2),
        (st/2 + hl, dh/2),
        (st/2 + hl - cs, dh/2 - st/2),
        (st/2 + cs, dh/2 - st/2),
        (st/2, dh/2),
    ]
    seg_F = [  # Upper left vertical
        (0, dh/2 + st/2 + cs),
        (0, dh - st - cs),
        (cs, dh - st),
        (st, dh - st - cs),
        (st, dh/2 + st/2 + cs),
        (cs, dh/2 + st/2),
    ]
    seg_B = [  # Upper right vertical
        (dw, dh/2 + st/2 + cs),
        (dw, dh - st - cs),
        (dw - cs, dh - st),
        (dw - st, dh - st - cs),
        (dw - st, dh/2 + st/2 + cs),
        (dw - cs, dh/2 + st/2),
    ]
    seg_E = [  # Lower left vertical
        (0, dh/2 - st/2 - cs),
        (0, st + cs),
        (cs, st),
        (st, st + cs),
        (st, dh/2 - st/2 - cs),
        (cs, dh/2 - st/2),
    ]
    seg_C = [  # Lower right vertical
        (dw, dh/2 - st/2 - cs),
        (dw, st + cs),
        (dw - cs, st),
        (dw - st, st + cs),
        (dw - st, dh/2 - st/2 - cs),
        (dw - cs, dh/2 - st/2),
    ]

    # Extrude each segment and fuse to main housing
    for segment in [seg_A, seg_B, seg_C, seg_D, seg_E, seg_F, seg_G]:
        global_verts = [(x0 + u, z0 + v) for u, v in segment]
        seg_solid = (
            cq.Workplane("XZ")
            .polyline(global_verts).close()
            .extrude(-seg_raise)  # Raise segments slightly out from front face
        )
        result = result.union(seg_solid)

    # Add raised decimal point at lower right of digit
    dec_x = x0 + decimal_x_offset
    dec_z = z0 + decimal_z_offset
    dec_solid = (
        cq.Workplane("XZ")
        .center(dec_x, dec_z)
        .circle(decimal_radius)
        .extrude(-decimal_raise)
    )
    result = result.union(dec_solid)

# Add 12 locating pins along the upper rear edge
pin_start_x = (body_length - (pin_count - 1) * pin_spacing) / 2
for i in range(pin_count):
    px = pin_start_x + i * pin_spacing
    # Cylindrical shank seated against back housing face
    shank = (
        cq.Workplane("XZ", origin=(0, body_depth, 0))
        .center(px, pin_z_center)
        .circle(pin_radius)
        .extrude(pin_shank_len)
    )
    # Truncated conical insertion tip
    tip = (
        cq.Workplane("XZ", origin=(0, body_depth + pin_shank_len, 0))
        .center(px, pin_z_center)
        .circle(pin_radius)
        .workplane(offset=pin_tip_len)
        .circle(pin_tip_radius)
        .loft(combine=True)
    )
    result = result.union(shank.union(tip))