import cadquery as cq

# ----------------------
# Parameter Definitions
# ----------------------
# Base Platform
base_size = 200.0
base_height = 10.0
base_frame_offset = 5.0  # Offset for the raised base frame
base_frame_height = 5.0

# Main Housing Box
housing_size = 180.0
housing_height = 120.0

# Front Drawer
drawer_width = 160.0
drawer_depth = 100.0
drawer_height = 40.0
drawer_inset = 10.0  # Inset from housing front
drawer_knob_dia = 20.0
drawer_knob_height = 15.0

# Upper Platform & Bowl
upper_platform_size = 200.0
upper_platform_height = 10.0
bowl_top_dia = 180.0
bowl_bottom_dia = 120.0
bowl_height = 150.0
bowl_wall_thickness = 5.0

# Inner Cylinder & Lever Assembly
inner_cyl_dia = 60.0
inner_cyl_height = 140.0
lever_mount_plate_size = 40.0
lever_mount_plate_height = 8.0
lever_length = 150.0
lever_width = 20.0
lever_height = 8.0
lever_knob_dia = 20.0

# ----------------------
# Build the Model
# ----------------------
# 1. Base Platform with Raised Frame
base = (
    cq.Workplane("XY")
    .box(base_size, base_size, base_height)
    .faces(">Z").workplane()
    .rect(base_size - 2*base_frame_offset, base_size - 2*base_frame_offset)
    .extrude(base_frame_height)
)

# 2. Main Housing Box
housing = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height)
    .box(housing_size, housing_size, housing_height)
)

# 3. Front Drawer
drawer = (
    cq.Workplane("XZ")
    .workplane(offset=-(housing_size/2 - drawer_inset))
    .rect(drawer_width, drawer_height)
    .extrude(drawer_depth)
)
# Add drawer knob
drawer_knob = (
    cq.Workplane("XZ")
    .workplane(offset=-(housing_size/2 - drawer_inset - drawer_depth))
    .circle(drawer_knob_dia/2)
    .extrude(drawer_knob_height)
)

# 4. Upper Platform
upper_platform = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height)
    .box(upper_platform_size, upper_platform_size, upper_platform_height)
)

# 5. Tapered Bowl
# Create a tapered shape using loft
bowl = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height)
    .circle(bowl_top_dia/2)
    .workplane(offset=bowl_height)
    .circle(bowl_bottom_dia/2)
    .loft()
)
# Hollow out the bowl (create inner cavity)
bowl_inner = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height + bowl_wall_thickness)
    .circle(bowl_top_dia/2 - bowl_wall_thickness)
    .workplane(offset=bowl_height - bowl_wall_thickness)
    .circle(bowl_bottom_dia/2 - bowl_wall_thickness)
    .loft()
)
# Subtract inner from outer bowl
bowl = bowl.cut(bowl_inner)

# 6. Inner Central Cylinder
inner_cylinder = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height)
    .circle(inner_cyl_dia/2)
    .extrude(inner_cyl_height)
)

# 7. Lever Assembly
# Mounting plate on top of inner cylinder
lever_mount = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height + inner_cyl_height - lever_mount_plate_height)
    .rect(lever_mount_plate_size, lever_mount_plate_size)
    .extrude(lever_mount_plate_height)
)
# Lever arm
lever_arm = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height + inner_cyl_height - lever_mount_plate_height)
    .workplane(offset=lever_mount_plate_size/2)
    .rect(lever_length, lever_width)
    .extrude(lever_height)
)
# End knob on lever
lever_knob = (
    cq.Workplane("XY")
    .workplane(offset=base_height + base_frame_height + housing_height + upper_platform_height + inner_cyl_height - lever_mount_plate_height)
    .workplane(offset=lever_mount_plate_size/2 + lever_length)
    .sphere(lever_knob_dia/2)
)

# ----------------------
# Assemble all components
# ----------------------
result = (
    base
    .union(housing)
    .union(drawer)
    .union(drawer_knob)
    .union(upper_platform)
    .union(bowl)
    .union(inner_cylinder)
    .union(lever_mount)
    .union(lever_arm)
    .union(lever_knob)
)