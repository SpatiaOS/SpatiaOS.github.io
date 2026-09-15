import cadquery as cq

# ==============================================================================
# Parametric Dimensions
# ==============================================================================

# Base plate dimensions
base_length = 120.0       # Total length along X-axis
base_width = 70.0         # Total width along Y-axis
base_thickness = 10.0     # Height/thickness of the base plate
corner_radius = 15.0      # Fillet radius for the rounded corners

# Base mounting holes (concentric with rounded corner centers)
hole_spacing_x = base_length - 2 * corner_radius  # 90.0 mm
hole_spacing_y = base_width - 2 * corner_radius   # 40.0 mm
hole_diameter = 8.0                               # Through-hole diameter

# Central post and collar dimensions
post_diameter = 40.0      # Outer diameter of the vertical post
post_height = 30.0        # Height of the post above the base
collar_diameter = 54.0    # Outer diameter of the top collar
collar_height = 12.0      # Height/thickness of the collar

# Stepped central bore dimensions
upper_bore_diameter = 36.0  # Diameter of the wider shallow opening at the top
upper_bore_depth = 10.0     # Depth of the top opening
lower_bore_diameter = 22.0  # Diameter of the narrower deep opening
# Total bore depth stops exactly at the top surface of the base plate
total_bore_depth = post_height + collar_height

# ==============================================================================
# Model Construction
# ==============================================================================

# Step 1: Create the base plate and round the four vertical corners
base = (
    cq.Workplane("XY")
    .box(base_length, base_width, base_thickness)
    .edges("|Z")
    .fillet(corner_radius)
)

# Step 2: Drill four through-holes near the rounded corner areas of the base
base_with_holes = (
    base.faces(">Z")
    .workplane()
    .rect(hole_spacing_x, hole_spacing_y, forConstruction=True)
    .vertices()
    .hole(hole_diameter)
)

# Step 3: Add the solid central post rising from the top face of the base
post = (
    base_with_holes.faces(">Z")
    .workplane()
    .circle(post_diameter / 2.0)
    .extrude(post_height)
)

# Step 4: Add the wider annular collar on top of the post
collar = (
    post.faces(">Z")
    .workplane()
    .circle(collar_diameter / 2.0)
    .extrude(collar_height)
)

# Step 5: Cut the stepped bore down into the raised feature
# A wider shallow counterbore transitions into a narrower bore stopping at the base top face
result = (
    collar.faces(">Z")
    .workplane()
    .cboreHole(
        holeDiameter=lower_bore_diameter,
        cboreDiameter=upper_bore_diameter,
        cboreDepth=upper_bore_depth,
        depth=total_bore_depth
    )
)