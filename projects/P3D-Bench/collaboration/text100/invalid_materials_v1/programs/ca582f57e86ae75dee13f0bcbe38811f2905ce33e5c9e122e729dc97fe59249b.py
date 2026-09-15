import cadquery as cq

# ==============================================================================
# Model Parameters
# ==============================================================================

# Base Plate Dimensions
base_length = 0.329252  # Length along X-axis
base_width = 0.75       # Width along Y-axis
base_height = 0.013589  # Thickness along Z-axis (from Z=0 datum)

# Upright Walls (Full-length parallel walls)
wall_length = base_length
wall_thickness = 0.0136
total_height = 0.2854
wall_height_above_base = total_height - base_height  # 0.271811

# Wall 1 (Rearward upright wall)
wall1_offset_front = 0.6468  # Offset from front edge (back offset = 0.0896)

# Wall 2 (Forward upright wall)
wall2_offset_front = 0.5924  # Offset from front edge (back offset = 0.1440)

# Tall Front-Left Corner Block
corner_block_length = 0.059861  # Flush to left edge (offset to right = 0.2694)
corner_block_width = 0.20094    # Flush to front edge (offset to back = 0.5491)
corner_block_height = wall_height_above_base

# Center Raised Pad
pad_length = 0.1508             # Footprint length (X)
pad_width = 0.1717              # Footprint width (Y)
pad_height_above_base = 0.0544  # Top reaches Z = 0.068 from datum
pad_offset_left = 0.0892        # Offset from left edge (right offset = 0.0893)
pad_offset_front = 0.2892       # Offset from front edge (back offset = 0.2891)

# Through Hole in Pad (Through the pad only)
hole_center_x = 0.1646
hole_center_y = 0.375
hole_radius = 0.0556

# Arc-based Rounded Cutout (Notch across the tall wall region)
cut_width = 0.054357            # Width in length (X) direction
cut_height = 0.163072           # Total height of cutout
cut_offset_left = 0.1374        # Offset from left edge
cut_y_start = 0.4533            # Front offset of cut reach
cut_y_reach = 0.2071            # Front-to-back span (reaches back offset 0.0896)
cut_z_bottom = 0.1223           # Bottom datum of cutout (reaches top 0.2854)
cut_radius = cut_width / 2.0    # Radius of bottom rounded arc

# ==============================================================================
# 3D Modeling Steps
# ==============================================================================

# 1. Create the base plate (corner at origin: X in [0, L], Y in [0, W], Z in [0, H])
base = (
    cq.Workplane("XY")
    .box(base_length, base_width, base_height, centered=False)
)

# 2. Add the rearward upright wall (Wall 1)
wall1 = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .transformed(offset=(0, wall1_offset_front, 0))
    .box(wall_length, wall_thickness, wall_height_above_base, centered=False)
)

# 3. Add the forward upright wall (Wall 2)
wall2 = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .transformed(offset=(0, wall2_offset_front, 0))
    .box(wall_length, wall_thickness, wall_height_above_base, centered=False)
)

# 4. Add the front-left corner block
corner_block = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .box(corner_block_length, corner_block_width, corner_block_height, centered=False)
)

# 5. Combine base, walls, and corner block
combined_walls = base.union(wall1).union(wall2).union(corner_block)

# 6. Create the arc-based rounded cut tool (U-shaped notch profile on XZ plane)
x_min = cut_offset_left
x_max = cut_offset_left + cut_width
x_mid = (x_min + x_max) / 2.0
z_arc_center = cut_z_bottom + cut_radius
z_top = total_height + 0.01  # Overshoot slightly above walls for a clean cut

# Construct the cutter profile on the XZ plane and extrude along Y
# On "XZ" plane, normal is (0, -1, 0), so positive extrusion extends in -Y
cut_tool = (
    cq.Workplane("XZ", origin=(0, cut_y_start + cut_y_reach + 0.005, 0))
    .moveTo(x_min, z_top)
    .lineTo(x_min, z_arc_center)
    .threePointsArc((x_mid, cut_z_bottom), (x_max, z_arc_center))
    .lineTo(x_max, z_top)
    .close()
    .extrude(cut_y_reach + 0.010)
)

# Apply the cut to the wall assembly
walls_cut = combined_walls.cut(cut_tool)

# 7. Create the central pad with the circular through-opening (through the pad only)
pad = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .transformed(offset=(pad_offset_left, pad_offset_front, 0))
    .box(pad_length, pad_width, pad_height_above_base, centered=False)
)

pad_hole = (
    cq.Workplane("XY")
    .workplane(offset=base_height - 0.001)
    .moveTo(hole_center_x, hole_center_y)
    .circle(hole_radius)
    .extrude(pad_height_above_base + 0.002)
)

pad_with_hole = pad.cut(pad_hole)

# 8. Combine the pad into the final model
result = walls_cut.union(pad_with_hole)