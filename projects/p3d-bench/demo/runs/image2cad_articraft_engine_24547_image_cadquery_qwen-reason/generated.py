import cadquery as cq

# Parameters
# Base dimensions
base_length = 160.0
base_width = 100.0
base_thickness = 10.0

# Cylinder dimensions
cylinder_diameter = 45.0
cylinder_length = 90.0
cylinder_head_x = -10.0 # Head is near the crankcase (right side in image logic, but cylinder points left)
cylinder_axis_height = 60.0 # Height of cylinder centerline
fin_count = 16
fin_thickness = 2.0
fin_diameter = 58.0
fin_start_x = -25.0
fin_zone_length = 60.0
fin_spacing = fin_zone_length / fin_count
top_pipe_diameter = 12.0
top_pipe_height = 15.0
top_pipe_x = -20.0

# Flywheel and Shaft dimensions
shaft_diameter = 12.0
flywheel_diameter = 90.0
flywheel_thickness = 14.0
flywheel_hole_diameter = 20.0
flywheel_y_offset = 45.0
crank_radius = 25.0

# Connecting Rod and Piston
con_rod_width = 12.0
con_rod_thickness = 8.0
con_rod_length = 35.0 # From crank pin towards piston
piston_diameter = 43.0 # Slightly less than cylinder
piston_length = 25.0
piston_x = -60.0 # Piston pin location roughly

# --- Create the Model ---

# 1. Base Plate
result = (
    cq.Workplane("XY")
    .box(base_length, base_width, base_thickness)
    .edges("|Z")
    .fillet(5.0)
)

# 2. Cylinder Assembly
# Main Cylinder Body
# Cylinder axis is X. Head at cylinder_head_x, body extends in -X direction.
cylinder_body = (
    cq.Workplane("YZ")
    .workplane(offset=cylinder_head_x)
    .circle(cylinder_diameter / 2)
    .extrude(-cylinder_length)
)
result = result.union(cylinder_body)

# Cooling Fins
# Create a single fin template (disk in YZ plane)
fin_template = (
    cq.Workplane("YZ")
    .circle(fin_diameter / 2)
    .extrude(fin_thickness)
)

# Array fins along X using a loop
fins = cq.Workplane("XY") # Dummy base for union
current_x = fin_start_x
for i in range(fin_count):
    fins = fins.union(fin_template.translate((current_x, 0, cylinder_axis_height)))
    current_x -= fin_spacing
result = result.union(fins)

# Top Pipe (Intake/Exhaust/Spark Plug)
# Located on top of the cylinder
top_pipe = (
    cq.Workplane("XY")
    .workplane(offset=cylinder_axis_height + cylinder_diameter/2)
    .moveTo(top_pipe_x, 0)
    .circle(top_pipe_diameter / 2)
    .extrude(top_pipe_height)
)
result = result.union(top_pipe)

# Cylinder Mounting Feet
# Connect cylinder bottom to base
foot_height = cylinder_axis_height - cylinder_diameter/2 - base_thickness
# Two feet, front and back (along Y)
foot1 = (
    cq.Workplane("XY")
    .box(25, 12, foot_height)
    .translate((cylinder_head_x - 20, 20, base_thickness))
)
foot2 = (
    cq.Workplane("XY")
    .box(25, 12, foot_height)
    .translate((cylinder_head_x - 20, -20, base_thickness))
)
result = result.union(foot1).union(foot2)

# 3. Crankcase / Shaft Support
# Central block supporting the shaft
crankcase_block = (
    cq.Workplane("XY")
    .box(50, 60, cylinder_axis_height)
    .translate((0, 0, base_thickness))
)
result = result.union(crankcase_block)

# 4. Shaft
# Runs along Y axis
shaft = (
    cq.Workplane("XZ")
    .circle(shaft_diameter / 2)
    .extrude(120)
    .translate((0, -60, cylinder_axis_height))
)
result = result.union(shaft)

# 5. Crank Mechanism
# Crank Web (The arm connecting shaft to pin)
# Connects Shaft (X=0) to Crank Pin (X=-crank_radius)
# Box width covers the distance
crank_web = (
    cq.Workplane("XY")
    .box(crank_radius + 15, 15, 15)
    .translate((-crank_radius / 2, -7.5, cylinder_axis_height))
)
result = result.union(crank_web)

# Crank Pin
# Parallel to shaft (Y axis), offset by crank_radius (pointing towards cylinder, -X)
crank_pin = (
    cq.Workplane("XZ")
    .moveTo(-crank_radius, 0) # Position at X = -crank_radius
    .circle(shaft_diameter / 2 + 2)
    .extrude(30) # Extrude along Y
    .translate((0, -15, cylinder_axis_height)) # Center in Y
)
result = result.union(crank_pin)

# 6. Flywheels
def create_flywheel():
    fw = (
        cq.Workplane("XY")
        .circle(flywheel_diameter / 2)
        .extrude(flywheel_thickness)
        # Cut 4 lightening holes
        .faces(">Z")
        .workplane()
        .polarArray(flywheel_diameter / 3, 0, 360, 4)
        .circle(flywheel_hole_diameter / 2)
        .cutThruAll()
        # Cut center hole for shaft
        .faces(">Z")
        .workplane()
        .circle(shaft_diameter / 2 + 1)
        .cutThruAll()
    )
    return fw

fw1 = create_flywheel().translate((0, -flywheel_y_offset, cylinder_axis_height))
fw2 = create_flywheel().translate((0, flywheel_y_offset, cylinder_axis_height))
result = result.union(fw1).union(fw2)

# 7. Connecting Rod
# Connects Crank Pin area to Piston area
# Crank pin is at X = -crank_radius.
# Rod extends towards negative X.
con_rod = (
    cq.Workplane("XY")
    .box(con_rod_length, con_rod_width, con_rod_thickness)
    .translate((-crank_radius - con_rod_length, -con_rod_width/2, cylinder_axis_height))
)
result = result.union(con_rod)

# 8. Piston
# Inside the cylinder.
piston = (
    cq.Workplane("YZ")
    .workplane(offset=piston_x - 10) # Start position
    .circle(piston_diameter / 2)
    .extrude(piston_length)
)
result = result.union(piston)

# Piston Rod / Wrist Pin connection
# Small cylinder connecting piston to connecting rod
piston_rod = (
    cq.Workplane("YZ")
    .workplane(offset=piston_x)
    .circle(shaft_diameter / 2)
    .extrude(10)
)
result = result.union(piston_rod)