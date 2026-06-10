import cadquery as cq

# ----------------------
# Parameter Definitions
# ----------------------
# Base plate dimensions
base_length = 120.0
base_width = 80.0
base_thickness = 6.0
base_cutout_width = 30.0  # Middle cutout width

# Spherical knob parameters
knob_sphere_dia = 25.0
knob_base_dia = 18.0
knob_base_height = 10.0
knob_top_indent_dia = 5.0
knob_top_indent_depth = 2.0

# Central post parameters
central_post_dia = 12.0
central_post_height = 40.0
central_collar_dia = 20.0
central_collar_height = 10.0

# Threaded rod & thumb screw
threaded_rod_dia = 8.0
threaded_rod_length = 30.0
thumb_knob_dia = 15.0
thumb_knob_height = 8.0
small_lever_length = 15.0
small_lever_width = 10.0
small_lever_thickness = 2.0

# ----------------------
# Build Base Plate
# ----------------------
# Create base rectangle
base = cq.Workplane("XY").box(base_length, base_width, base_thickness)

# Add curved side profiles (simplified as rounded edges)
base = base.edges("|Z").fillet(8.0)

# Cut out central section
base = (
    base.workplane(offset=base_thickness/2)
    .rect(base_cutout_width, base_width - 20.0)
    .cutThruAll()
)

# ----------------------
# Add Spherical Knobs
# ----------------------
# Left knob
left_knob = (
    cq.Workplane("XY")
    .transformed(offset=(-(base_length/2 - 15), 0, base_thickness))
    .cylinder(knob_base_height, knob_base_dia/2)
    .faces(">Z").workplane()
    .sphere(knob_sphere_dia/2)
    .faces(">Z").workplane()
    .hole(knob_top_indent_dia, knob_top_indent_depth)
)

# Right knob
right_knob = (
    cq.Workplane("XY")
    .transformed(offset=((base_length/2 - 15), 0, base_thickness))
    .cylinder(knob_base_height, knob_base_dia/2)
    .faces(">Z").workplane()
    .sphere(knob_sphere_dia/2)
    .faces(">Z").workplane()
    .hole(knob_top_indent_dia, knob_top_indent_depth)
)

# ----------------------
# Build Central Assembly
# ----------------------
# Central post
central_post = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, base_thickness))
    .cylinder(central_post_height, central_post_dia/2)
    .faces(">Z").workplane()
    .cylinder(central_collar_height, central_collar_dia/2)
)

# Threaded rod
threaded_rod = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, base_thickness + central_post_height))
    .cylinder(threaded_rod_length, threaded_rod_dia/2)
)

# Thumb knob on rod
thumb_knob = (
    threaded_rod.faces(">Z").workplane()
    .cylinder(thumb_knob_height, thumb_knob_dia/2)
)

# Small lever (thumb screw plate)
small_lever = (
    cq.Workplane("XY")
    .transformed(offset=(15, 0, base_thickness + central_post_height + threaded_rod_length/2), rotate=(0,90,0))
    .box(small_lever_length, small_lever_width, small_lever_thickness)
    .edges("|X").fillet(2.0)
    .faces(">Y").workplane()
    .hole(threaded_rod_dia)
)

# ----------------------
# Combine All Components
# ----------------------
result = base.union(left_knob).union(right_knob).union(central_post).union(threaded_rod).union(thumb_knob).union(small_lever)