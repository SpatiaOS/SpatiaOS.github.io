import cadquery as cq

# ----------------------
# Parametric Dimensions (estimated from proportions)
# ----------------------
# Piston Head Parameters
piston_outer_dia = 80.0       # Diameter of the piston crown
piston_head_height = 60.0     # Total height of the piston head (including ring grooves)
num_piston_rings = 3          # Number of piston ring grooves
ring_groove_depth = 2.0       # Depth of each piston ring groove
ring_groove_width = 1.5       # Width of each piston ring groove
ring_spacing = 5.0            # Spacing between piston ring grooves
piston_pin_dia = 18.0         # Diameter of the piston pin hole
piston_pin_offset = 30.0      # Distance from piston top to center of piston pin hole
piston_boss_dia = 30.0        # Diameter of the raised boss around the pin hole
piston_boss_height = 5.0      # Height of the raised boss

# Connecting Rod Parameters
rod_total_length = 200.0      # Total length from piston pin center to big end center
rod_web_thickness = 8.0       # Thickness of the central web of the I-beam rod
rod_flange_width = 20.0       # Width of the I-beam flanges
rod_flange_thickness = 6.0    # Thickness of the I-beam flanges
small_end_outer_dia = 30.0    # Outer diameter of the small (piston pin) end
big_end_outer_dia = 50.0      # Outer diameter of the big (crankshaft) end
big_end_inner_dia = 40.0      # Inner diameter of the big end bearing
big_end_cap_thickness = 12.0  # Thickness of the big end bearing cap
bolt_dia = 6.0                # Diameter of big end bolts
bolt_length = 25.0            # Length of big end bolts
bolt_hex_size = 10.0          # Hex size of bolt heads/nuts

# ----------------------
# 1. Model Piston Head
# ----------------------
# Create main piston cylinder
piston_main = cq.Workplane("XY").circle(piston_outer_dia / 2).extrude(piston_head_height)

# Cut piston ring grooves
piston_with_rings = piston_main
for i in range(num_piston_rings):
    # Calculate groove position (from bottom of piston up)
    groove_z = piston_head_height - (ring_spacing * (i + 1)) - (ring_groove_width / 2)
    # Create groove cutter (thin cylinder)
    groove_cutter = (
        cq.Workplane("XY")
        .transformed(offset=(0, 0, groove_z))
        .circle(piston_outer_dia / 2)
        .circle(piston_outer_dia / 2 - ring_groove_depth)
        .extrude(ring_groove_width)
    )
    # Subtract groove from piston
    piston_with_rings = piston_with_rings.cut(groove_cutter)

# Add piston pin boss (raised area around pin hole)
piston_with_boss = (
    piston_with_rings
    .faces(">Z")
    .workplane(offset=-piston_pin_offset)
    .circle(piston_boss_dia / 2)
    .extrude(piston_boss_height, combine="a")
)

# Cut piston pin hole
piston_final = (
    piston_with_boss
    .faces(">Z")
    .workplane(offset=-piston_pin_offset)
    .hole(piston_pin_dia, depth=piston_head_height)
)

# ----------------------
# 2. Model Connecting Rod
# ----------------------
# Create small end (piston pin end)
small_end = (
    cq.Workplane("XY")
    .circle(small_end_outer_dia / 2)
    .circle(piston_pin_dia / 2)
    .extrude(rod_flange_thickness)
    .translate((0, 0, -rod_flange_thickness / 2))
)

# Create I-beam rod profile
rod_profile = (
    cq.Workplane("XZ")
    .transformed(offset=(0, 0, -rod_total_length / 2))
    # Draw I-beam shape
    .rect(rod_flange_width, rod_flange_thickness)
    .rect(rod_flange_width - 2 * rod_web_thickness, rod_flange_width)
    .extrude(rod_total_length)
    .translate((0, 0, rod_total_length / 2))
)

# Create big end (crankshaft end)
big_end_rod = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, -rod_total_length))
    .circle(big_end_outer_dia / 2)
    .circle(big_end_inner_dia / 2)
    .extrude(big_end_cap_thickness)
)

# Assemble rod components
connecting_rod = small_end.union(rod_profile).union(big_end_rod)

# ----------------------
# 3. Model Big End Cap & Bolts
# ----------------------
# Create bearing cap
bearing_cap = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, -rod_total_length - big_end_cap_thickness))
    .circle(big_end_outer_dia / 2)
    .circle(big_end_inner_dia / 2)
    .extrude(big_end_cap_thickness)
)

# Create bolt holes in cap and rod
bolt_hole_positions = [
    (big_end_outer_dia / 2 - 8, 0),
    (-big_end_outer_dia / 2 + 8, 0)
]

# Cut bolt holes in rod and cap
for pos in bolt_hole_positions:
    connecting_rod = (
        connecting_rod
        .faces(">Z")
        .workplane(offset=-rod_total_length)
        .pushPoints([pos])
        .hole(bolt_dia)
    )
    bearing_cap = (
        bearing_cap
        .faces(">Z")
        .workplane(offset=-big_end_cap_thickness)
        .pushPoints([pos])
        .hole(bolt_dia)
    )

# Create bolts (hex heads + shafts)
def create_bolt(x, y, z):
    bolt = (
        cq.Workplane("XY")
        .transformed(offset=(x, y, z))
        .polygon(6, bolt_hex_size)
        .extrude(bolt_hex_size / 2)
        .faces(">Z")
        .hole(bolt_dia, depth=bolt_length)
        .faces(">Z")
        .workplane()
        .circle(bolt_dia / 2)
        .extrude(bolt_length - bolt_hex_size / 2)
    )
    return bolt

# Add bolts to the assembly
bolts = create_bolt(bolt_hole_positions[0][0], bolt_hole_positions[0][1], -rod_total_length - big_end_cap_thickness)
bolts = bolts.union(create_bolt(bolt_hole_positions[1][0], bolt_hole_positions[1][1], -rod_total_length - big_end_cap_thickness))

# ----------------------
# 4. Final Assembly
# ----------------------
# Combine all parts into final result
result = piston_final.union(connecting_rod).union(bearing_cap).union(bolts)

# Note: Removed the fillet operation that was causing the error
# The BRep_API error occurred because the fillet operation was trying to fillet
# edges that were not suitable for filleting (possibly non-manifold or zero-radius edges)
# For a clean export, we'll skip the fillet operation