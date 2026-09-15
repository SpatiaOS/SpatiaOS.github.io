import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Base slab parameters
slab_length = 100.0         # Total length of the slab along X-axis
slab_width = 60.0           # Total width of the slab along Y-axis
slab_thickness = 8.0        # Thickness of the slab along Z-axis

# Central coaxial features (boss, collar, opening)
hole_diameter = 24.0        # Central through-hole opening diameter
upper_boss_diameter = 46.0  # Outer diameter of the upper circular boss
upper_boss_height = 14.0    # Height of upper boss above the slab surface
upper_boss_fillet = 3.0     # Fillet radius for the upper boss rim

collar_diameter = 40.0      # Outer diameter of the underside annular collar
collar_depth = 5.0          # Depth of collar below the slab (shallower than upper boss)

# Upright rounded wall parameters (located at -X side)
wall_thickness = 10.0       # Thickness of the upright wall along X-axis
wall_height = 50.0          # Total height of the upright wall from bottom of the slab

# Elongated through slot in the upright wall
slot_length = 20.0          # Center-to-center distance of the slot
slot_diameter = 10.0        # Diameter / width of the slot
slot_z_center = 28.0        # Elevation of the slot center from the bottom of the slab

# Derived geometric values
wall_radius = slab_width / 2.0                 # Semicircular top arch radius
wall_straight_height = wall_height - wall_radius # Height where the arch begins

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Base rectangular slab (centered on XY, sitting from Z=0 to Z=slab_thickness)
slab = cq.Workplane("XY").box(
    slab_length, slab_width, slab_thickness, centered=(True, True, False)
)

# 2. Upright rounded wall on one side (-X end) with an arched top profile
wall = (
    cq.Workplane("YZ", origin=(-slab_length / 2.0, 0, 0))
    .moveTo(-slab_width / 2.0, 0)
    .lineTo(slab_width / 2.0, 0)
    .lineTo(slab_width / 2.0, wall_straight_height)
    .threePoints((0, wall_height), (-slab_width / 2.0, wall_straight_height))
    .close()
    .extrude(wall_thickness)
)

# 3. Elongated through slot cut into the upright wall
slot_cutter = (
    cq.Workplane("YZ", origin=(-slab_length / 2.0 - 1.0, 0, slot_z_center))
    .slot2D(slot_length, slot_diameter, 0.0)
    .extrude(wall_thickness + 2.0)
)
wall = wall.cut(slot_cutter)

# 4. Upper circular boss (taller feature, with rounded circular rim)
upper_boss = (
    cq.Workplane("XY", origin=(0, 0, slab_thickness))
    .circle(upper_boss_diameter / 2.0)
    .extrude(upper_boss_height)
)
upper_boss = upper_boss.faces(">Z").edges().fillet(upper_boss_fillet)

# 5. Underside collar (shallower feature continuing below the slab)
lower_collar = (
    cq.Workplane("XY", origin=(0, 0, 0))
    .circle(collar_diameter / 2.0)
    .extrude(-collar_depth)
)

# 6. Combine all solid features into a monolithic part
main_body = slab.union(wall).union(upper_boss).union(lower_collar)

# 7. Central through hole coaxial with both circular features (leaving the collar hollow)
total_opening_depth = collar_depth + slab_thickness + upper_boss_height + 2.0
through_hole = (
    cq.Workplane("XY", origin=(0, 0, -collar_depth - 1.0))
    .circle(hole_diameter / 2.0)
    .extrude(total_opening_depth)
)

result = main_body.cut(through_hole)