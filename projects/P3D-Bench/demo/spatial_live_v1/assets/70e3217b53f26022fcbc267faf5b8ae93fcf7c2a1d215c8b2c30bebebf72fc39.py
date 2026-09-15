import cadquery as cq

# --- Parametric Dimensions ---
# Overall module housing dimensions
module_width = 50.7       # Length along X axis
module_height = 19.0      # Height along Y axis
housing_depth = 8.0       # Depth of main block + front shim plate (7.9 + 0.1)

# Rear locating pin dimensions (12 pins in a linear row)
num_pins = 12
pin_pitch = 2.54          # Standard 0.1 inch (2.54 mm) header pitch
pin_radius = 0.25         # Shank radius
pin_shank_len = 2.63      # Cylindrical shank length
pin_tip_len = 0.37        # Conical tip taper length
pin_tip_radius = 0.10     # Truncated cone tip radius
pin_y_pos = 7.5           # Protruding near the upper rear edge

# 7-Segment digit dimensions
num_digits = 4
digit_pitch = 11.0        # Center-to-center pitch between digits
slant = 0.145             # Italic shear factor (~8.25 degree tilt)
seg_thickness = 0.04      # Thin embossed plate thickness
seg_overlap = 0.02        # Sub-surface penetration for robust solid boolean union

# Digit local sizing
x0 = 2.50                 # Half-distance between vertical stroke centers
y0 = 5.25                 # Half-distance between horizontal stroke centers
stroke_w = 1.35           # Segment stroke width
k = stroke_w / 2.0        # Half-stroke width (0.675 mm)
hg = 0.12                 # Half-gap between segments (0.24 mm total seam gap)

# Decimal point (DP) dimensions
dp_radius = 0.80          # Circular disc indicator radius
dp_x_offset = 3.80        # X offset from digit center
dp_y_pos = -5.15          # Y position aligned with bottom segment

# Calculate digit centers along X (centered on front face)
digit_centers = [
    -(num_digits - 1) * digit_pitch / 2.0 + i * digit_pitch
    for i in range(num_digits)
]

# --- 7-Segment Polygon Definitions (Local Coordinates before Shear) ---
# Each segment is modeled as a 6-sided polygon matching the physical LED dies
poly_G = [  # Middle horizontal
    (-x0 + 1.414 * hg, 0.0),
    (-x0 + k + hg, k - hg),
    (x0 - k - hg, k - hg),
    (x0 - 1.414 * hg, 0.0),
    (x0 - k - hg, -k + hg),
    (-x0 + k + hg, -k + hg),
]

poly_A = [  # Top horizontal
    (-x0 - k + 1.414 * hg, y0 + k),
    (x0 + k - 1.414 * hg, y0 + k),
    (x0 + k - 0.5 * hg, y0 + k - 0.2),
    (x0 - k - hg, y0 - k + hg),
    (-x0 + k + hg, y0 - k + hg),
    (-x0 - k + 0.5 * hg, y0 + k - 0.2),
]

poly_D = [  # Bottom horizontal
    (-x0 - k + 1.414 * hg, -y0 - k),
    (-x0 - k + 0.5 * hg, -y0 - k + 0.2),
    (-x0 + k + hg, -y0 + k - hg),
    (x0 - k - hg, -y0 + k - hg),
    (x0 + k - 0.5 * hg, -y0 - k + 0.2),
    (x0 + k - 1.414 * hg, -y0 - k),
]

poly_F = [  # Top-left vertical
    (-x0 - k, hg),
    (-x0 - k, y0 + k - 1.414 * hg),
    (-x0 - 0.2, y0 + k - 0.5 * hg),
    (-x0 + k - hg, y0 - k - hg),
    (-x0 + k - hg, k + hg),
    (-x0, hg),
]

poly_B = [  # Top-right vertical (mirror of F across X)
    (x0 + k, hg),
    (x0, hg),
    (x0 - k + hg, k + hg),
    (x0 - k + hg, y0 - k - hg),
    (x0 + 0.2, y0 + k - 0.5 * hg),
    (x0 + k, y0 + k - 1.414 * hg),
]

poly_E = [  # Bottom-left vertical (mirror of F across Y)
    (-x0 - k, -hg),
    (-x0, -hg),
    (-x0 + k - hg, -k - hg),
    (-x0 + k - hg, -y0 + k + hg),
    (-x0 - 0.2, -y0 - k + 0.5 * hg),
    (-x0 - k, -y0 - k + 1.414 * hg),
]

poly_C = [  # Bottom-right vertical (mirror of B across Y)
    (x0 + k, -hg),
    (x0 + k, -y0 - k + 1.414 * hg),
    (x0 + 0.2, -y0 - k + 0.5 * hg),
    (x0 - k + hg, -y0 + k + hg),
    (x0 - k + hg, -k - hg),
    (x0, -hg),
]

segment_templates = [poly_A, poly_B, poly_C, poly_D, poly_E, poly_F, poly_G]

# --- Build Assembly Geometry ---
# 1. Main Housing Block
z_front = housing_depth / 2.0
z_rear = -housing_depth / 2.0

result = cq.Workplane("XY").box(module_width, module_height, housing_depth)

# 2. Linear Row of 12 Locating Pins on Upper Rear Face
pin_x_coords = [
    -(num_pins - 1) * pin_pitch / 2.0 + i * pin_pitch
    for i in range(num_pins)
]

for px in pin_x_coords:
    # Cylindrical shank seating against the housing block
    shank = (
        cq.Workplane("XY", origin=(px, pin_y_pos, z_rear + 0.1))
        .circle(pin_radius)
        .extrude(-(pin_shank_len + 0.1))
    )
    # Tapered conical tip narrowing to truncated flat end
    cone = (
        cq.Workplane("XY", origin=(px, pin_y_pos, z_rear - pin_shank_len))
        .circle(pin_radius)
        .workplane(offset=-pin_tip_len)
        .circle(pin_tip_radius)
        .loft()
    )
    result = result.union(shank).union(cone)

# 3. Four Decimal-Point Discs on Front Face
for dx in digit_centers:
    dp = (
        cq.Workplane("XY", origin=(dx + dp_x_offset, dp_y_pos, z_front - seg_overlap))
        .circle(dp_radius)
        .extrude(seg_thickness + seg_overlap)
    )
    result = result.union(dp)

# 4. Four Seven-Segment Digit Displays (28 Hexagonal Segment Plates)
for dx in digit_centers:
    for template in segment_templates:
        # Apply affine italic shear transform and translate to digit position
        sheared_pts = [(dx + u + v * slant, v) for (u, v) in template]
        segment_solid = (
            cq.Workplane("XY", origin=(0.0, 0.0, z_front - seg_overlap))
            .polyline(sheared_pts)
            .close()
            .extrude(seg_thickness + seg_overlap)
        )
        result = result.union(segment_solid)