import cadquery as cq

# --------------------------
# Parameter Definitions (estimated from image proportions)
# --------------------------
# Base Heat Sink
base_outer_diameter = 100.0
base_thickness = 8.0
central_cylinder_diameter = 40.0
central_cylinder_height = 30.0
fin_count = 36  # Number of radial cooling fins
fin_height = 15.0
fin_thickness = 2.0
fin_radial_length = 25.0  # Length from central cylinder to fin tip

# Hinge & Arm Assembly
hinge_block_width = 15.0
hinge_block_length = 20.0
hinge_block_height = 10.0
hinge_bolt_diameter = 4.0
hinge_bolt_head_hex_size = 8.0
arm_length = 80.0
arm_base_diameter = 15.0
arm_tip_diameter = 8.0
end_cap_diameter = 40.0

# --------------------------
# 1. Build Base Heat Sink
# --------------------------
# Create base disk
base = (
    cq.Workplane("XY")
    .circle(base_outer_diameter / 2)
    .extrude(base_thickness)
)

# Add central cylinder on top of base
base = (
    base
    .workplane(offset=base_thickness)
    .circle(central_cylinder_diameter / 2)
    .extrude(central_cylinder_height)
)

# Create a single radial fin as a solid box
# Position it radially from central cylinder outward
single_fin = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + central_cylinder_height)
    .center(central_cylinder_diameter / 2, 0)
    .box(fin_radial_length, fin_thickness, fin_height, centered=(False, True, False))
)

# Pattern the fin around the central axis
for i in range(fin_count):
    angle = i * 360.0 / fin_count
    fin_copy = single_fin.rotate((0, 0, 0), (0, 0, 1), angle)
    base = base.union(fin_copy)

# Add recess on top of central cylinder (matching the indented shape in image)
base = (
    base
    .workplane(offset=base_thickness + central_cylinder_height - 5)
    .rect(central_cylinder_diameter * 0.6, central_cylinder_diameter * 0.6)
    .cutBlind(-5)
)

# --------------------------
# 2. Build Hinge & Arm Assembly
# --------------------------
# Create hinge block attached to central cylinder
hinge = (
    cq.Workplane("YZ")
    .workplane(offset=central_cylinder_diameter / 2)
    .rect(hinge_block_width, hinge_block_height)
    .extrude(hinge_block_length)
)

# Add hinge bolt (hex head + shaft)
hinge_bolt = (
    hinge
    .workplane(offset=hinge_block_length / 2)
    .polygon(6, hinge_bolt_head_hex_size)
    .extrude(hinge_bolt_diameter)
    .workplane(offset=hinge_bolt_diameter)
    .circle(hinge_bolt_diameter / 2)
    .extrude(hinge_block_length * 0.8)
)

# Create tapered arm (frustum cylinder)
arm = (
    hinge
    .workplane(offset=hinge_block_length)
    .circle(arm_base_diameter / 2)
    .workplane(offset=arm_length)
    .circle(arm_tip_diameter / 2)
    .loft(combine=True)
)

# Add hemispherical end cap
end_cap = (
    arm
    .workplane(offset=arm_length)
    .sphere(end_cap_diameter / 2)
)

# --------------------------
# Assemble all parts
# --------------------------
result = base.union(hinge_bolt).union(arm).union(end_cap)