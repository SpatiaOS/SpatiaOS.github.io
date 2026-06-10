import cadquery as cq

# =================== PARAMETERS ===================
# Piston dimensions
piston_diameter = 40.0
piston_height = 42.0
ring_groove_count = 3
ring_groove_depth = 1.0
ring_groove_width = 1.2
ring_groove_spacing = 2.5
ring_groove_top_offset = 3.0
valve_relief_diameter = 8.0
valve_relief_depth = 1.0

# Piston pin dimensions
pin_diameter = 12.0
pin_offset = 25.0          # Distance from piston top to pin center
pin_boss_diameter = 18.0   # External boss around pin bore
pin_boss_height = 3.0      # Boss protrusion along pin axis

# Connecting rod dimensions
rod_length = 85.0          # Center-to-center from pin to crank
small_end_outer = 18.0     # Small end outer diameter
small_end_width = 10.0     # Small end thickness along pin axis
big_end_outer = 26.0       # Big end outer diameter
big_end_inner = 16.0       # Crank journal bore diameter
big_end_width = 14.0       # Big end thickness along crank axis

# Rod shank dimensions
shank_top_width = 14.0     # Width at small end end (Y direction)
shank_bottom_width = 20.0  # Width at big end (Y direction)
shank_thickness = 8.0      # Thickness in X direction

# Rod cap and bolts
cap_split_offset = 3.0     # Split line below crank center
bolt_diameter = 4.0
bolt_spacing = 18.0        # Distance between bolt centers
bolt_head_diameter = 7.0
bolt_head_height = 3.0
nut_height = 3.0

# =================== BUILD PISTON ===================
# Main piston body: cylinder with top at Z=0, extending in -Z
piston = cq.Workplane("XY").circle(piston_diameter / 2).extrude(-piston_height)

# Cut piston ring grooves near the top
for i in range(ring_groove_count):
    z_pos = -(ring_groove_top_offset + i * (ring_groove_width + ring_groove_spacing))
    groove = (
        cq.Workplane("XY")
        .workplane(offset=z_pos)
        .circle(piston_diameter / 2 + 1)
        .circle(piston_diameter / 2 - ring_groove_depth)
        .extrude(ring_groove_width)
    )
    piston = piston.cut(groove)

# Cut valve relief pocket on the top face
valve_pocket = (
    cq.Workplane("XY")
    .circle(valve_relief_diameter / 2)
    .extrude(-valve_relief_depth)
)
piston = piston.cut(valve_pocket)

# Add external pin bosses on each side of the piston
pin_boss = (
    cq.Workplane("YZ")
    .moveTo(0, -pin_offset)
    .circle(pin_boss_diameter / 2)
    .extrude(pin_boss_height, both=True)
)
piston = piston.union(pin_boss)

# Cut the wrist pin bore through the piston and bosses (along X axis)
pin_bore = (
    cq.Workplane("YZ")
    .moveTo(0, -pin_offset)
    .circle(pin_diameter / 2)
    .extrude(piston_diameter, both=True)
)
piston = piston.cut(pin_bore)

# =================== BUILD CONNECTING ROD ===================
# Global Z coordinates (origin at piston top)
small_end_z = -pin_offset
big_end_z = -pin_offset - rod_length
split_line_z = big_end_z - cap_split_offset

# Small end: cylindrical eye surrounding the wrist pin
small_end = (
    cq.Workplane("YZ")
    .moveTo(0, small_end_z)
    .circle(small_end_outer / 2)
    .extrude(small_end_width / 2, both=True)
)

# Rod shank: tapered block bridging small end and big end
shank_top_z = small_end_z - small_end_outer / 2 * 0.6
shank_bottom_z = big_end_z + big_end_outer / 2 * 0.6

shank = (
    cq.Workplane("XY")
    .workplane(offset=shank_top_z)
    .rect(shank_thickness, shank_top_width)
    .workplane(offset=shank_bottom_z - shank_top_z)
    .rect(shank_thickness, shank_bottom_width)
    .loft()
)

# Big end upper half (attached to rod shank)
rod_big_end_full = (
    cq.Workplane("YZ")
    .moveTo(0, big_end_z)
    .circle(big_end_outer / 2)
    .extrude(big_end_width / 2, both=True)
)
split_cutter = (
    cq.Workplane("YZ")
    .moveTo(0, split_line_z - big_end_outer)
    .rect(big_end_outer * 3, big_end_outer * 2)
    .extrude(big_end_width, both=True)
)
rod_big_end = rod_big_end_full.cut(split_cutter)

# Big end cap (lower half)
cap_full = (
    cq.Workplane("YZ")
    .moveTo(0, big_end_z)
    .circle(big_end_outer / 2)
    .extrude(big_end_width / 2, both=True)
)
cap_cutter = (
    cq.Workplane("YZ")
    .moveTo(0, split_line_z + big_end_outer)
    .rect(big_end_outer * 3, big_end_outer * 2)
    .extrude(big_end_width, both=True)
)
cap = cap_full.cut(cap_cutter)

# Combine rod components
rod = small_end.union(shank).union(rod_big_end).union(cap)

# Cut crank journal bore through the big end assembly
crank_bore = (
    cq.Workplane("YZ")
    .moveTo(0, big_end_z)
    .circle(big_end_inner / 2)
    .extrude(big_end_width + 2, both=True)
)
rod = rod.cut(crank_bore)

# Cut triangular lightening holes through the rod shank
lightening_depth = shank_thickness + 2
lightening_height = 22.0
lightening_width = 7.0

for z_center in [-35.0, -60.0]:
    tri = (
        cq.Workplane("YZ")
        .moveTo(0, z_center - lightening_height / 2)
        .lineTo(lightening_width / 2, z_center + lightening_height / 2)
        .lineTo(-lightening_width / 2, z_center + lightening_height / 2)
        .close()
        .extrude(lightening_depth, both=True)
    )
    rod = rod.cut(tri)

# Cut bolt holes through the cap and rod at the split line
for y_pos in [bolt_spacing / 2, -bolt_spacing / 2]:
    bolt_hole = (
        cq.Workplane("YZ")
        .moveTo(y_pos, split_line_z)
        .circle(bolt_diameter / 2)
        .extrude(big_end_width + 10, both=True)
    )
    rod = rod.cut(bolt_hole)

# Add hex bolt heads and nuts on each side of the big end
for y_pos in [bolt_spacing / 2, -bolt_spacing / 2]:
    # Bolt head on -X side
    head = (
        cq.Workplane("YZ")
        .moveTo(y_pos, split_line_z)
        .polygon(6, bolt_head_diameter)
        .extrude(-bolt_head_height)
        .translate((-big_end_width / 2, 0, 0))
    )
    rod = rod.union(head)

    # Nut on +X side
    nut = (
        cq.Workplane("YZ")
        .moveTo(y_pos, split_line_z)
        .polygon(6, bolt_head_diameter)
        .extrude(bolt_head_height)
        .translate((big_end_width / 2, 0, 0))
    )
    rod = rod.union(nut)

# =================== FINAL ASSEMBLY ===================
result = piston.union(rod)