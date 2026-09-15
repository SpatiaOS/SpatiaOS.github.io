import cadquery as cq

# ---------------------- Parametric Dimensions ----------------------
# Core assembly dimensions
blade_thickness = 2.0          # mm, thickness of blade/shank along X-axis
loop_thickness = 7.0           # mm, maximum thickness of finger loops along X-axis
pivot_hole_dia = 1.6           # mm, pivot bore diameter (matches 1.583mm specification)

# Fastener specifications
fastener_shaft_radius = 0.78   # mm, central shaft radius (slight clearance for 1.6mm hole)
fastener_shaft_length = 4.0    # mm, shaft spans combined blade thickness at pivot
fastener_head_large_r = 2.66   # mm, slotted head radius
fastener_head_small_r = 2.56   # mm, opposite plain head radius
fastener_head_thickness = 1.0  # mm, thickness of each flanged head (total length 6mm)
slot_width = 1.0               # mm, width of screwdriver slot

# Large blade (larger finger loop, +X side)
big_loop_y = 20.0
big_loop_z = 52.0
big_outer_ry = 23.0            # loop Y semi-axis (total width 46mm, matches spec)
big_outer_rz = 26.0
big_inner_ry = 17.0
big_inner_rz = 19.0
big_tip_z = -76.0              # tip position for total length 154mm (matches spec)
big_rotation_angle = 5.0       # degrees, rotated open around X axis

# Small blade (smaller thumb loop, -X side)
small_loop_y = -12.0
small_loop_z = 42.0
small_outer_ry = 13.0          # loop Y semi-axis (total width 26mm, matches spec)
small_outer_rz = 17.0
small_inner_ry = 8.0
small_inner_rz = 12.0
small_tip_z = -100.4           # tip position for total length 159.4mm (matches spec)
small_rotation_angle = -5.0    # degrees, rotated open around X axis

# ---------------------- Build Large Scissor Half (+X side) ----------------------
# Thick outer finger loop
big_loop = (
    cq.Workplane("YZ")
    .center(big_loop_y, big_loop_z)
    .ellipse(big_outer_ry, big_outer_rz)
    .extrude(loop_thickness)
)
# Cut inner finger hole through loop
big_loop = (
    big_loop
    .faces("<X")
    .workplane()
    .center(big_loop_y, big_loop_z)
    .ellipse(big_inner_ry, big_inner_rz)
    .cutThruAll()
)
# Thin shank and tapered blade
big_shank = (
    cq.Workplane("YZ")
    .moveTo(0, big_tip_z)
    .lineTo(3, 0)
    .lineTo(big_loop_y, big_loop_z - big_outer_rz)
    .lineTo(-3, 0)
    .close()
    .extrude(blade_thickness)
)
# Combine loop and shank, drill pivot hole
big_blade = big_loop.union(big_shank)
big_blade = (
    big_blade
    .faces("<X")
    .workplane()
    .circle(pivot_hole_dia / 2)
    .cutThruAll()
)
# Rotate to open position
big_blade = big_blade.rotate((0, 0, 0), (1, 0, 0), big_rotation_angle)

# ---------------------- Build Small Scissor Half (-X side) ----------------------
# Thick outer finger loop
small_loop = (
    cq.Workplane("YZ")
    .center(small_loop_y, small_loop_z)
    .ellipse(small_outer_ry, small_outer_rz)
    .extrude(-loop_thickness)
)
# Cut inner finger hole through loop
small_loop = (
    small_loop
    .faces(">X")
    .workplane()
    .center(small_loop_y, small_loop_z)
    .ellipse(small_inner_ry, small_inner_rz)
    .cutThruAll()
)
# Thin shank and tapered blade
small_shank = (
    cq.Workplane("YZ")
    .moveTo(0, small_tip_z)
    .lineTo(-3, 0)
    .lineTo(small_loop_y, small_loop_z - small_outer_rz)
    .lineTo(3, 0)
    .close()
    .extrude(-blade_thickness)
)
# Combine loop and shank, drill pivot hole
small_blade = small_loop.union(small_shank)
small_blade = (
    small_blade
    .faces(">X")
    .workplane()
    .circle(pivot_hole_dia / 2)
    .cutThruAll()
)
# Rotate to open position
small_blade = small_blade.rotate((0, 0, 0), (1, 0, 0), small_rotation_angle)

# ---------------------- Build Slotted Pivot Fastener ----------------------
# Central shaft
fastener = (
    cq.Workplane("YZ")
    .circle(fastener_shaft_radius)
    .extrude(fastener_shaft_length / 2, both=True)
)
# Large slotted head (+X side)
fastener = (
    fastener
    .faces(">X")
    .workplane()
    .circle(fastener_head_large_r)
    .extrude(fastener_head_thickness)
)
# Small plain head (-X side)
fastener = (
    fastener
    .faces("<X")
    .workplane()
    .circle(fastener_head_small_r)
    .extrude(-fastener_head_thickness)
)
# Cut screwdriver slot across large head
slot_cutter = cq.Solid.makeBox(
    fastener_head_thickness,
    slot_width,
    2 * fastener_head_large_r + 2,
    pnt=cq.Vector(
        fastener_shaft_length / 2,
        -slot_width / 2,
        -fastener_head_large_r - 1
    )
)
fastener = fastener.cut(slot_cutter)

# ---------------------- Final Assembly ----------------------
result = big_blade.union(small_blade).union(fastener)
# Apply view rotation to match rendered isometric perspective
result = result.rotate((0, 0, 0), (0, 1, 0), 15).rotate((0, 0, 0), (0, 0, 1), -10)