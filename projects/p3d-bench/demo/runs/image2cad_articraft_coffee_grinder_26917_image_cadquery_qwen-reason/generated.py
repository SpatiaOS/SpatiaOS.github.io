import cadquery as cq
import math

# Parameters
# Base dimensions
base_width = 100.0
base_depth = 100.0
base_body_height = 80.0
bottom_plate_thickness = 8.0
bottom_plate_overhang = 10.0
top_plate_thickness = 8.0
top_plate_overhang = 10.0

# Drawer details
drawer_height = 40.0
drawer_knob_diameter = 12.0
drawer_knob_protrusion = 8.0
side_handle_diameter = 8.0
side_handle_length = 40.0

# Hopper dimensions
hopper_bottom_diameter = 70.0
hopper_top_diameter = 90.0
hopper_height = 70.0
hopper_wall_thickness = 4.0
hopper_rim_height = 5.0
hopper_rim_width = 3.0

# Crank mechanism
shaft_diameter = 10.0
shaft_height = 30.0
arm_width = 12.0
arm_thickness = 4.0
arm_length = 60.0
handle_knob_radius = 10.0
nut_height = 6.0
nut_diameter = 14.0

# Create the base assembly
# 1. Bottom Plate (Foot)
bottom_plate = (
    cq.Workplane("XY")
    .box(base_width + bottom_plate_overhang * 2, base_depth + bottom_plate_overhang * 2, bottom_plate_thickness)
    .edges("|Z")
    .fillet(5.0)
)

# 2. Main Body
main_body = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness)
    .box(base_width, base_depth, base_body_height)
    .edges("|Z")
    .fillet(2.0)
)

# 3. Top Plate
top_plate = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height)
    .box(base_width + top_plate_overhang * 2, base_depth + top_plate_overhang * 2, top_plate_thickness)
    .edges("|Z")
    .fillet(3.0)
)

# Combine base parts
base_assembly = bottom_plate.union(main_body).union(top_plate)

# 4. Drawer Front
# The drawer is on the front face of the lower section
drawer_front = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + 5.0) # Slightly up from bottom
    .box(base_width - 4, drawer_height, 5.0) # Slightly narrower than body
    .translate((0, base_depth / 2 + 2.5, 0)) # Move to front
)

# 5. Drawer Knob
drawer_knob = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + 5.0 + drawer_height / 2)
    .center(0, base_depth / 2 + 5.0 + drawer_knob_protrusion / 2)
    .cylinder(drawer_knob_protrusion, drawer_knob_diameter)
    .edges(">Z")
    .fillet(2.0)
)

# 6. Side Handle (Vertical bar on the right side of the drawer)
side_handle = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + 5.0 + drawer_height / 2)
    .center(base_width / 2 - 5.0, base_depth / 2 + 5.0)
    .cylinder(side_handle_length, side_handle_diameter)
    .rotate((0, 0, 0), (1, 0, 0), 90) # Rotate to be vertical? No, cylinder is Z-axis.
    # Actually, let's just make a box or cylinder oriented correctly.
    # The image shows a vertical handle on the side.
)
# Re-doing side handle to be a vertical cylinder on the side face
side_handle = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + 5.0 + drawer_height / 2)
    .center(base_width / 2 - 2.0, base_depth / 2 + 2.0) # Near the corner
    .cylinder(side_handle_length, side_handle_diameter)
)

# 7. Logo Plate (Oval on the upper front face)
logo_plate = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height - 20.0)
    .center(0, base_depth / 2 + 1.0)
    .ellipse(30.0, 10.0)
    .extrude(2.0)
)

# Combine base details
base_with_details = (
    base_assembly
    .union(drawer_front)
    .union(drawer_knob)
    .union(side_handle)
    .union(logo_plate)
)

# Create the Hopper
# Profile for revolution
# We define the outer and inner profile of the hopper wall
hopper_profile = (
    cq.Workplane("XZ")
    .moveTo(hopper_bottom_diameter / 2, 0)
    .lineTo(hopper_top_diameter / 2, hopper_height)
    .lineTo(hopper_top_diameter / 2 + hopper_rim_width, hopper_height)
    .lineTo(hopper_top_diameter / 2 + hopper_rim_width, hopper_height + hopper_rim_height)
    .lineTo(hopper_top_diameter / 2 - hopper_wall_thickness + hopper_rim_width, hopper_height + hopper_rim_height)
    .lineTo(hopper_top_diameter / 2 - hopper_wall_thickness, hopper_height)
    .lineTo(hopper_bottom_diameter / 2 - hopper_wall_thickness, 0)
    .close()
)

hopper = hopper_profile.revolve()

# Add internal rings/ribs inside the hopper
# These are thin toruses or extruded circles
inner_ring_1 = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + 10.0)
    .circle(hopper_bottom_diameter / 2 - hopper_wall_thickness - 2.0)
    .circle(hopper_bottom_diameter / 2 - hopper_wall_thickness - 5.0)
    .extrude(2.0)
)

inner_ring_2 = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + 25.0)
    .circle(hopper_bottom_diameter / 2 - hopper_wall_thickness - 1.0)
    .circle(hopper_bottom_diameter / 2 - hopper_wall_thickness - 3.0)
    .extrude(2.0)
)

hopper_with_rings = hopper.union(inner_ring_1).union(inner_ring_2)

# Position the hopper on the top plate
hopper_positioned = hopper_with_rings.translate((0, 0, bottom_plate_thickness + base_body_height + top_plate_thickness))

# Create the Crank Mechanism
# Central Shaft
shaft = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + hopper_height)
    .circle(shaft_diameter / 2)
    .extrude(shaft_height)
)

# Crank Arm
# It attaches to the shaft and goes outwards
# We create it on the top of the shaft
crank_arm = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + hopper_height + shaft_height - 5.0)
    .rect(arm_length, arm_width)
    .extrude(arm_thickness)
    .translate((arm_length / 2, 0, 0)) # Center it relative to attachment? No, start from shaft
)
# Let's refine the arm. It seems to attach to the side of the shaft.
crank_arm = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + hopper_height + 15.0)
    .box(arm_length, arm_width, arm_thickness)
    .translate((arm_length / 2 + shaft_diameter/2, 0, 0))
)

# Handle Knob (Ball shape)
handle_knob = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + hopper_height + 15.0)
    .sphere(handle_knob_radius)
    .translate((arm_length + shaft_diameter/2, 0, 0))
)

# Top Nut
top_nut = (
    cq.Workplane("XY")
    .workplane(offset=bottom_plate_thickness + base_body_height + top_plate_thickness + hopper_height + shaft_height)
    .polygon(6, nut_diameter / 2) # Hexagon
    .extrude(nut_height)
)

# Assemble Crank
crank_assembly = shaft.union(crank_arm).union(handle_knob).union(top_nut)

# Final Assembly
result = (
    base_with_details
    .union(hopper_positioned)
    .union(crank_assembly)
)