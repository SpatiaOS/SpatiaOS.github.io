import cadquery as cq

# Assembly parameters - overall pebble-shaped enclosure
# Three parts stack vertically: base_cover (bottom), cover_plate (middle), housing_cover (top)

# Base cover parameters - largest dome at bottom
base_length = 304.0      # Long axis (X)
base_width = 159.0       # Short axis (Y)
base_height = 72.0       # Vertical extent (Z)
base_top_length = 242.0  # Top deck long axis (matches cover plate)
base_top_width = 127.0   # Top deck short axis (matches cover plate)

# Cover plate parameters - thin oval disc at parting line
plate_length = 242.0     # Long axis
plate_width = 127.0      # Short axis
plate_thickness = 6.0    # Very thin as described

# Housing cover parameters - upper dome
housing_length = 227.0   # Long axis at bottom (matches plate)
housing_width = 120.0    # Short axis at bottom
housing_height = 50.0    # Vertical extent
housing_top_length = 190.0  # Top surface long axis
housing_top_width = 100.0   # Top surface short axis

# Boss parameters on base cover top deck
boss_radius = 6.0
boss_height = 8.0

# Control panel parameters on housing cover
panel_length = 100.0
panel_width = 60.0
panel_depth = 3.0
dot_radius = 3.0
dot_height = 1.5

# ========== BASE COVER ==========
# Bottom dome - smooth organic shape created via lofted ellipses

# Create the base cover by lofting between three elliptical profiles
base_cover = (
    cq.Workplane("XY")
    # Bottom rim at ground level
    .ellipse(base_length, base_width)
    # Mid-height profile for smoother organic curvature
    .workplane(offset=base_height * 0.5)
    .ellipse((base_length + base_top_length) / 2 * 1.02, 
             (base_width + base_top_width) / 2 * 1.02)
    # Top deck profile at full height
    .workplane(offset=base_height)
    .ellipse(base_top_length, base_top_width)
    # Loft through all three profiles
    .loft(combine=True)
)

# Add cylindrical boss on top deck (offset from center as shown in render)
base_cover = (
    base_cover
    .faces(">Z")
    .workplane()
    .pushPoints([(-40, 0), (40, 0), (0, 30), (0, -30)])
    .circle(boss_radius)
    .extrude(boss_height)
)

# ========== COVER PLATE ==========
# Thin oval disc positioned at the parting line between base and housing
cover_plate = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .ellipse(plate_length, plate_width)
    .extrude(plate_thickness)
)

# ========== HOUSING COVER ==========
# Upper dome with recessed control panel on top

# Create the housing cover by lofting between three elliptical profiles
housing_cover = (
    cq.Workplane("XY")
    # Bottom edge matches cover plate dimensions
    .workplane(offset=base_height + plate_thickness)
    .ellipse(housing_length, housing_width)
    # Waist profile at mid-height for organic curvature
    .workplane(offset=base_height + plate_thickness + housing_height * 0.5)
    .ellipse((housing_length + housing_top_length) / 2,
             (housing_width + housing_top_width) / 2)
    # Top profile at dome peak
    .workplane(offset=base_height + plate_thickness + housing_height)
    .ellipse(housing_top_length, housing_top_width)
    # Loft through all three profiles
    .loft(combine=True)
)

# Add recessed oval control panel on top surface
housing_cover = (
    housing_cover
    .faces(">Z")
    .workplane()
    .slot2D(panel_length, panel_width, angle=0)
    .cutBlind(-panel_depth)
)

# Add five small dot features in cross pattern within the panel
# (representing the control buttons visible in the render)
housing_cover = (
    housing_cover
    .faces(">Z")
    .workplane(offset=-panel_depth)
    .pushPoints([
        (0, 0),           # Center dot
        (20, 0),          # Right
        (-20, 0),         # Left
        (0, 15),          # Top
        (0, -15)          # Bottom
    ])
    .circle(dot_radius)
    .extrude(dot_height)
)

# ========== FINAL ASSEMBLY ==========
# Combine all three parts into a single unified model
result = base_cover.union(cover_plate).union(housing_cover)