import cadquery as cq

# =============================================================================
# Parameters
# =============================================================================

# Tall rectangular body (deeper continuation below the post area)
tall_body_width = 45.0       # Dimension along X
tall_body_depth = 36.0       # Dimension along Y (deeper back-to-front mass)
tall_body_height = 50.0      # Dimension along Z (extends down to Z=0)

# Offset lower block (shallower rectangular mass continuing from one side)
lower_block_width = 35.0     # Dimension along X (extends to the +X side)
lower_block_depth = 22.0     # Dimension along Y (shallower than tall body)
lower_block_height = 20.0    # Vertical thickness of the lower block
lower_block_z_start = 10.0   # Stepped underside: starts higher up at Z=10

# Overhanging top bar (longer, thinner rectangular cap)
top_bar_length = 80.0        # Dimension along X (longer than tall body)
top_bar_width = 36.0         # Dimension along Y
top_bar_thickness = 8.0      # Dimension along Z
top_bar_x_start = -60.0      # Starts at X=-60, extends to X=+20

# Features on top bar:
# 1. Through holes near the overhanging ends
hole_diameter = 6.5
left_hole_x = -52.0          # Centered in the left overhang
right_hole_x = 12.0          # Centered in the right overhang

# 2. Solid vertical post seated in an annular circular seat
post_x = -35.0               # Located directly above the deeper tall body
annular_seat_diameter = 22.0 # Recessed seat diameter
annular_seat_depth = 2.0     # Recessed seat depth
post_diameter = 12.0         # Solid post diameter
post_height = 18.0           # Height of the post above the top bar surface

# 3. Rectangular cut/recess panel on top face
recess_x = -10.0             # Position along X between post and right end
recess_length = 18.0         # Dimension along X
recess_width = 16.0          # Dimension along Y
recess_depth = 2.0           # Depth of cut into top face

# Derived vertical positions
top_bar_z_bottom = tall_body_height
top_bar_z_top = top_bar_z_bottom + top_bar_thickness

# =============================================================================
# 1. Base Geometry Construction
# =============================================================================

# Tall rectangular body (occupies X: [-45, 0], Y: [-18, 18], Z: [0, 50])
tall_body = (
    cq.Workplane("XY")
    .transformed(offset=cq.Vector(-tall_body_width / 2.0, 0, tall_body_height / 2.0))
    .box(tall_body_width, tall_body_depth, tall_body_height)
)

# Offset lower block (shallower depth, stepped underside)
# Front face aligned with tall body at Y = +18; back face stepped forward to Y = -4
lower_y_center = (tall_body_depth / 2.0) - (lower_depth / 2.0)
lower_z_center = lower_block_z_start + (lower_block_height / 2.0)
lower_block = (
    cq.Workplane("XY")
    .transformed(offset=cq.Vector(lower_block_width / 2.0, lower_y_center, lower_z_center))
    .box(lower_width, lower_depth, lower_height)
)

# Overhanging top bar (capping the tall body and overhanging at both ends)
bar_x_center = top_bar_x_start + (top_bar_length / 2.0)
bar_z_center = top_bar_z_bottom + (top_bar_thickness / 2.0)
top_bar = (
    cq.Workplane("XY")
    .transformed(offset=cq.Vector(bar_x_center, 0, bar_z_center))
    .box(top_bar_length, top_bar_width, top_bar_thickness)
)

# Union the main masses into a single solid base
result = tall_body.union(lower_block).union(top_bar)

# =============================================================================
# 2. Features: Holes in Overhanging Ends
# =============================================================================

# Through-holes near the ends of the overhanging top bar
end_holes = (
    cq.Workplane("XY")
    .workplane(offset=top_bar_z_top + 1.0)
    .moveTo(left_hole_x, 0)
    .circle(hole_diameter / 2.0)
    .moveTo(right_hole_x, 0)
    .circle(hole_diameter / 2.0)
    .extrude(-(top_bar_thickness + 2.0))
)
result = result.cut(end_holes)

# =============================================================================
# 3. Features: Annular Circular Seat & Solid Vertical Post
# =============================================================================

# Cut the annular circular seat (recessed counterbore into the top face)
seat_recess = (
    cq.Workplane("XY")
    .workplane(offset=top_bar_z_top + 0.1)
    .moveTo(post_x, 0)
    .circle(annular_seat_diameter / 2.0)
    .extrude(-(annular_seat_depth + 0.1))
)
result = result.cut(seat_recess)

# Add the solid vertical post rising from inside the annular seat
seat_floor_z = top_bar_z_top - annular_seat_depth
total_post_height = post_height + annular_seat_depth
solid_post = (
    cq.Workplane("XY")
    .workplane(offset=seat_floor_z)
    .moveTo(post_x, 0)
    .circle(post_diameter / 2.0)
    .extrude(total_post_height)
)
result = result.union(solid_post)

# =============================================================================
# 4. Features: Rectangular Recess on Top Face
# =============================================================================

# Cut the rectangular panel (recessed pocket rather than a raised pad)
rect_recess = (
    cq.Workplane("XY")
    .workplane(offset=top_bar_z_top + 0.1)
    .moveTo(recess_x, 0)
    .rect(recess_length, recess_width)
    .extrude(-(recess_depth + 0.1))
)
result = result.cut(rect_recess)