import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Base slab dimensions
slab_length = 0.414846       # X-axis span (left to right)
slab_width = 0.414846        # Y-axis span (front to back)
slab_thickness = 0.124097    # Z-axis thickness

# Slab vertical circular through-openings
left_opening_x = 0.0837
left_opening_y = 0.2258
left_opening_radius = 0.0344

center_opening_x = 0.2074
center_opening_y = 0.1859
center_opening_radius = 0.0263

right_opening_x = 0.3312
right_opening_y = 0.2258
right_opening_radius = 0.0344

# Lower section: two hollow cylindrical posts on the underside
# Outer radius = 0.105 provides an overhang of ~0.0214 past the left edge
# and a front offset of ~0.1208 from the slab edge.
post_outer_radius = 0.105
post_depth = 0.3791          # Distance reaching below the slab underside
posts_y = 0.2258
left_post_x = 0.0836
right_post_x = 0.3311
lower_bore_radius = 0.0344

# Upper face raised annular collar
collar_x = 0.2074
collar_y = 0.1859
collar_outer_radius = 0.042
collar_inner_radius = 0.0263
collar_height = 0.021        # Height rising above slab top face

# ==============================================================================
# Modeling
# ==============================================================================

# 1. Base square slab (positioned with corner at origin [0, 0, 0])
base_slab = cq.Workplane("XY").box(
    slab_length, slab_width, slab_thickness, centered=False
)

# 2. Lower solid cylindrical posts extending downwards from the underside (Z = 0)
lower_posts = (
    cq.Workplane("XY")
    .pushPoints([(left_post_x, posts_y), (right_post_x, posts_y)])
    .circle(post_outer_radius)
    .extrude(-post_depth)
)

# 3. Upper annular collar rising above the slab top face (Z = slab_thickness)
upper_collar = (
    cq.Workplane("XY")
    .workplane(offset=slab_thickness)
    .moveTo(collar_x, collar_y)
    .circle(collar_outer_radius)
    .circle(collar_inner_radius)
    .extrude(collar_height)
)

# Combine the slab, lower posts, and upper collar into a single solid body
result = base_slab.union(lower_posts).union(upper_collar)

# 4. Cut the outer through-bores extending through the slab and the lower posts
# Ensures the full depth remains open and perfectly aligned
cut_height_outer = slab_thickness + post_depth + 0.02
result = (
    result
    .workplane("XY")
    .workplane(offset=slab_thickness + 0.01)
    .pushPoints([(left_opening_x, left_opening_y), (right_opening_x, right_opening_y)])
    .circle(left_opening_radius)
    .cutBlind(-cut_height_outer)
)

# 5. Cut the central circular bore through the slab and collar
cut_height_center = slab_thickness + collar_height + 0.02
result = (
    result
    .workplane("XY")
    .workplane(offset=slab_thickness + collar_height + 0.01)
    .moveTo(center_opening_x, center_opening_y)
    .circle(center_opening_radius)
    .cutBlind(-cut_height_center)
)