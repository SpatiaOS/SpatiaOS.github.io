import cadquery as cq
import math

# Parameters
# Shaft
shaft_radius = 4.0
shaft_length = 140.0

# Top Mount
top_mount_radius = 11.0
top_mount_height = 14.0
top_lug_thickness = 10.0  # Dimension along hole axis (X)
top_lug_length = 16.0     # Dimension along protrusion (Y)
top_lug_height = 12.0     # Dimension along Z
top_hole_radius = 3.5

# Gear / Spline
gear_base_radius = 15.0
gear_height = 10.0
gear_tooth_width = 6.0
gear_tooth_height = 5.0
num_teeth = 8

# Spring
spring_radius = 20.0
spring_wire_radius = 3.0
spring_pitch = 12.0
spring_coils = 6.0
spring_height = spring_pitch * spring_coils

# Bottom Mount
bottom_plate_radius = 19.0
bottom_plate_height = 6.0
bottom_lug_length = 16.0    # Dimension along protrusion (X)
bottom_lug_thickness = 10.0 # Dimension along hole axis (Y)
bottom_lug_height = 12.0    # Dimension along Z
bottom_hole_radius = 3.5

# --- Modeling ---

# 1. Central Shaft
# Positioned centrally along Z axis
shaft = (
    cq.Workplane("XY")
    .circle(shaft_radius)
    .extrude(shaft_length)
    .translate((0, 0, -shaft_length / 2))
)

# 2. Top Assembly
# Position: Top of the shaft.
z_top = shaft_length / 2

# Top Mount Cylinder
top_mount_cyl = (
    cq.Workplane("XY")
    .workplane(offset=z_top - top_mount_height)
    .circle(top_mount_radius)
    .extrude(top_mount_height)
)

# Top Eyelet
# Positioned near the top of the mount, sticking out in +Y direction.
# Hole axis is X.
z_eyelet_top = z_top - top_mount_height * 0.3
y_eyelet_top = top_mount_radius + top_lug_length / 2

top_eyelet = (
    cq.Workplane("XY")
    .workplane(offset=z_eyelet_top)
    .center(0, y_eyelet_top)
    .box(top_lug_thickness, top_lug_length, top_lug_height)
    .faces(">X")
    .workplane()
    .circle(top_hole_radius)
    .cutBlind(-top_lug_thickness)
)

top_assembly = top_mount_cyl.union(top_eyelet)

# 3. Gear Assembly
# Position: Below the top mount.
z_gear_top = z_top - top_mount_height
z_gear_bottom = z_gear_top - gear_height

# Gear Base
gear_base = (
    cq.Workplane("XY")
    .workplane(offset=z_gear_bottom)
    .circle(gear_base_radius)
    .extrude(gear_height)
)

# Gear Teeth
gear_teeth = (
    cq.Workplane("XY")
    .workplane(offset=z_gear_bottom)
    .polarArray(gear_base_radius + gear_tooth_height / 2, 0, 360, num_teeth)
    .rect(gear_tooth_width, gear_tooth_height)
    .extrude(gear_height)
)

gear_assembly = gear_base.union(gear_teeth)

# 4. Spring
# Position: Below the gear.
z_spring_top = z_gear_bottom
z_spring_bottom = z_spring_top - spring_height

# Create Helix
helix = cq.Wire.makeHelix(pitch=spring_pitch, height=spring_height, radius=spring_radius)

# Create Spring Solid using Workplane.sweep
spring = (
    cq.Workplane("YZ")
    .workplane(offset=spring_radius)
    .circle(spring_wire_radius)
    .sweep(helix)
)

# Translate spring to position
spring = spring.translate((0, 0, z_spring_bottom))

# 5. Bottom Assembly
# Position: Below the spring.
z_bottom_plate_top = z_spring_bottom
z_bottom_plate_bottom = z_bottom_plate_top - bottom_plate_height

# Bottom Plate
bottom_plate = (
    cq.Workplane("XY")
    .workplane(offset=z_bottom_plate_bottom)
    .circle(bottom_plate_radius)
    .extrude(bottom_plate_height)
)

# Bottom Eyelet
# Position: Below the plate, sticking out in +X direction (perpendicular to top mount).
# Hole axis is Y.
z_eyelet_bottom = z_bottom_plate_bottom - bottom_lug_height / 2
x_eyelet_bottom = bottom_plate_radius + bottom_lug_length / 2

bottom_eyelet = (
    cq.Workplane("XY")
    .workplane(offset=z_eyelet_bottom)
    .center(x_eyelet_bottom, 0)
    .box(bottom_lug_length, bottom_lug_thickness, bottom_lug_height)
    .faces(">Y")
    .workplane()
    .circle(bottom_hole_radius)
    .cutBlind(-bottom_lug_thickness)
)

bottom_assembly = bottom_plate.union(bottom_eyelet)

# --- Final Assembly ---
result = shaft \
    .union(top_assembly) \
    .union(gear_assembly) \
    .union(spring) \
    .union(bottom_assembly)