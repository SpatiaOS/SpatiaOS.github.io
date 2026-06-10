import cadquery as cq

# ---------------------- PARAMETERS (standard 80mm axial PC fan) ----------------------
fan_outer_size = 80.0          # Square outer dimension of fan frame
fan_thickness = 25.0           # Total height/thickness of the fan
frame_corner_radius = 6.0      # Rounded corner radius of outer frame
mounting_hole_pitch = 71.5     # Center-to-center distance between opposite mounting holes
mounting_hole_dia = 4.4        # Diameter of through-hole for mounting screws
frame_flange_thickness = 2.0   # Thickness of top and bottom outer frame flanges
shroud_outer_dia = 72.0        # Outer diameter of the inner air duct/shroud
shroud_wall_thickness = 1.5    # Wall thickness of the inner air duct
hub_dia = 30.0                 # Diameter of central motor hub
num_blades = 7                 # Number of fan impeller blades
blade_thickness = 1.6          # Thickness of each fan blade
support_post_dia = 4.0         # Diameter of corner support posts connecting flanges

# ---------------------- MODELING STEPS ----------------------
# 1. Create top and bottom outer frame flanges (fillet solid edges instead of sketch vertices to fix solid not found error)
top_flange = (
    cq.Workplane("XY")
    .rect(fan_outer_size, fan_outer_size)
    .extrude(frame_flange_thickness)
    .edges("|Z")  # Select all vertical edges parallel to Z axis for fillet
    .fillet(frame_corner_radius)
)
bottom_flange = top_flange.translate((0, 0, fan_thickness - frame_flange_thickness))
fan = top_flange.union(bottom_flange)

# 2. Add corner support posts connecting the two flanges
corner_posts = (
    cq.Workplane("XY", origin=(0, 0, frame_flange_thickness))
    .rect(mounting_hole_pitch, mounting_hole_pitch, forConstruction=True)
    .vertices()
    .circle(support_post_dia / 2)
    .extrude(fan_thickness - 2 * frame_flange_thickness)
)
fan = fan.union(corner_posts)

# 3. Create hollow inner air shroud
shroud_outer = cq.Workplane("XY").circle(shroud_outer_dia / 2).extrude(fan_thickness)
shroud_inner = cq.Workplane("XY").circle((shroud_outer_dia - 2*shroud_wall_thickness)/2).extrude(fan_thickness)
shroud = shroud_outer.cut(shroud_inner)
fan = fan.union(shroud)

# 4. Cut through mounting holes in all four corners
fan = (
    fan.faces(">Z").workplane()
    .rect(mounting_hole_pitch, mounting_hole_pitch, forConstruction=True)
    .vertices()
    .circle(mounting_hole_dia / 2)
    .cutThruAll()
)

# 5. Create central motor hub
hub = (
    cq.Workplane("XY")
    .circle(hub_dia / 2)
    .extrude(fan_thickness * 0.8)
    .translate((0, 0, fan_thickness * 0.1))
    .faces(">Z").fillet(2.0)
    .faces("<Z").fillet(2.0)
)

# 6. Create single fan blade with simplified curved profile
single_blade = (
    cq.Workplane("XZ", origin=(hub_dia/2 + 1, 0, fan_thickness/2))
    # Simplified airfoil profile shape
    .moveTo(0, -fan_thickness*0.3)
    .lineTo(shroud_outer_dia/2 - 2.5, -fan_thickness*0.25)
    .lineTo(shroud_outer_dia/2 - 2.5, fan_thickness*0.25)
    .lineTo(0, fan_thickness*0.3)
    .close()
    .extrude(blade_thickness)
    .rotate((0,0,0), (0,0,1), -18)  # Add blade angle of attack
)

# 7. Circular pattern blades around the hub
blades = single_blade
for blade_idx in range(1, num_blades):
    rotated_blade = single_blade.rotate((0,0,0), (0,0,1), (360/num_blades)*blade_idx)
    blades = blades.union(rotated_blade)

# Combine all components into final model
result = fan.union(hub).union(blades)