import cadquery as cq

# ==============================================================================
# Parameter Definitions
# ==============================================================================

# Base block dimensions
block_length = 120.0  # Overall length along X axis
block_width = 80.0    # Overall width along Y axis
block_height = 50.0   # Overall height along Z axis
corner_radius = 8.0   # Radius for rounded corners of the base block

# Paired circular cuts (Top face, +Z)
# Positioned symmetrically across X with solid material between them
hole_spacing_x = 28.0  # X offset from center for each hole (+/- 28mm)
hole_offset_y = 12.0   # Y offset from center

# Hole 1 (Left): Shallow counterbore tier, medium depth inner bore
hole1_cbore_dia = 26.0
hole1_cbore_depth = 6.0
hole1_dia = 14.0
hole1_depth = 22.0

# Hole 2 (Right): Deeper counterbore tier, deep inner bore
hole2_cbore_dia = 22.0
hole2_cbore_depth = 14.0
hole2_dia = 12.0
hole2_depth = 36.0

# Side recess with rectangular mouth and cylindrical continuation (Front face, -Y)
recess_offset_x = -20.0     # Horizontal position along the front face
recess_mouth_width = 30.0   # Rectangular mouth width
recess_mouth_height = 18.0  # Rectangular mouth height
recess_mouth_depth = 10.0   # Depth of the rectangular mouth
recess_cyl_dia = 14.0       # Diameter of cylindrical continuation
recess_cyl_depth = 28.0     # Total depth from front face (extends 18mm beyond mouth)

# Transverse round opening at mid-height (Right face, +X)
mid_hole_dia = 18.0         # Diameter of the round opening
mid_hole_offset_y = -12.0   # Y position along the side face
mid_hole_depth = 35.0       # Depth into the right face

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Create the primary solid base block centered at the origin
# Fillet the vertical edges to provide a mostly rectangular mass with rounded profiles
base = (
    cq.Workplane("XY")
    .box(block_length, block_width, block_height)
    .edges("|Z")
    .fillet(corner_radius)
)

# 2. Add the paired circular cuts with distinct depth tiers on the top face (+Z)
# First tiered hole (Left)
result = (
    base.faces(">Z")
    .workplane()
    .pushPoints([(-hole_spacing_x, hole_offset_y)])
    .cboreHole(
        holeDiameter=hole1_dia,
        cboreDiameter=hole1_cbore_dia,
        cboreDepth=hole1_cbore_depth,
        depth=hole1_depth,
    )
)

# Second tiered hole (Right) - uses different depth tiers to maintain tier separation
result = (
    result.faces(">Z")
    .workplane()
    .pushPoints([(hole_spacing_x, hole_offset_y)])
    .cboreHole(
        holeDiameter=hole2_dia,
        cboreDiameter=hole2_cbore_dia,
        cboreDepth=hole2_cbore_depth,
        depth=hole2_depth,
    )
)

# 3. Create the side recess on the front face (-Y)
# Step 3a: Cut the rectangular mouth
result = (
    result.faces("<Y")
    .workplane()
    .pushPoints([(recess_offset_x, 0.0)])
    .rect(recess_mouth_width, recess_mouth_height)
    .cutBlind(-recess_mouth_depth)
)

# Step 3b: Cut the coaxial cylindrical continuation extending deeper into the body
result = (
    result.faces("<Y")
    .workplane()
    .pushPoints([(recess_offset_x, 0.0)])
    .hole(recess_cyl_dia, depth=recess_cyl_depth)
)

# 4. Create the round opening crossing the right side face (+X) at mid-height (Z = 0)
result = (
    result.faces(">X")
    .workplane()
    .pushPoints([(mid_hole_offset_y, 0.0)])
    .hole(mid_hole_dia, depth=mid_hole_depth)
)