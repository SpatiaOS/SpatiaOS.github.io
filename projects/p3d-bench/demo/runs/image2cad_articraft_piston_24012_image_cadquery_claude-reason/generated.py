import cadquery as cq

# ============================================================
# Piston and Connecting Rod Assembly
# ============================================================

# --- Piston Parameters ---
piston_dia = 80.0           # Bore diameter
piston_height = 58.0        # Total piston height
crown_thick = 10.0          # Crown wall thickness
wall_thick = 5.0            # Skirt wall thickness

# Ring groove parameters
n_grooves = 3               # Number of compression/oil ring grooves
groove_depth = 2.5           # Radial depth of each groove
groove_width = 2.0           # Axial width of each groove
land_width = 2.5             # Land between grooves
first_groove_from_top = 7.0  # Distance from crown top to first groove

# Wrist pin
pin_dia = 20.0              # Wrist pin diameter
pin_z = 20.0                # Pin center height from piston bottom

# Valve relief pocket on crown
relief_dia = 16.0
relief_depth = 2.5
relief_offset_x = 12.0

# --- Connecting Rod Parameters ---
rod_length = 140.0          # Center-to-center distance
rod_width = 22.0            # Width along pin axis (Y direction)

# Small end (wrist pin end)
se_od = 32.0                # Small end outer diameter
se_id = 21.0                # Small end inner diameter

# Big end (crankshaft end)
be_od = 56.0                # Big end outer diameter
be_id = 42.0                # Big end inner diameter

# I-beam cross section
web_thick = 8.0             # Web thickness (X direction)
flange_width = 16.0         # Flange width (X direction)
flange_thick = 4.0          # Flange thickness (Y direction)

# Cap bolt parameters
bolt_dia = 8.0
bolt_head_dia = 12.0
bolt_head_h = 5.0
bolt_spacing = 44.0         # Bolt center-to-center (X direction)

# --- Derived values ---
R = piston_dia / 2.0
be_z = pin_z - rod_length   # Big end center Z position

# ============================================================
# 1. BUILD PISTON
# ============================================================

# Main cylindrical body
piston = (
    cq.Workplane("XY")
    .circle(R)
    .extrude(piston_height)
)

# Hollow out interior from bottom, leaving crown thickness at top
piston = (
    piston.faces("<Z").workplane()
    .circle(R - wall_thick)
    .cutBlind(piston_height - crown_thick)
)

# Chamfer the crown top edge
piston = piston.faces(">Z").chamfer(1.5)

# Valve relief pocket on crown surface
piston = (
    piston.faces(">Z").workplane()
    .center(relief_offset_x, 0)
    .circle(relief_dia / 2)
    .cutBlind(-relief_depth)
)

# Cut ring grooves around the outside surface
for i in range(n_grooves):
    z_bottom = (piston_height - first_groove_from_top
                - i * (groove_width + land_width) - groove_width)
    groove = (
        cq.Workplane("XY")
        .workplane(offset=z_bottom)
        .circle(R + 0.1)
        .circle(R - groove_depth)
        .extrude(groove_width)
    )
    piston = piston.cut(groove)

# Wrist pin bore through piston (along Y axis)
# Create cylinder on XY, rotate to align with Y, translate to pin height
pin_bore = (
    cq.Workplane("XY")
    .circle(pin_dia / 2)
    .extrude(piston_dia + 2)
    .rotate((0, 0, 0), (1, 0, 0), -90)
    .translate((0, -(R + 1), pin_z))
)
piston = piston.cut(pin_bore)

# ============================================================
# 2. BUILD CONNECTING ROD - SMALL END
# ============================================================

# Annular ring for the small end bearing
# Built on XY, rotated to Y-axis orientation, translated to pin position
small_end = (
    cq.Workplane("XY")
    .circle(se_od / 2)
    .circle(se_id / 2)
    .extrude(rod_width)
    .rotate((0, 0, 0), (1, 0, 0), -90)
    .translate((0, -rod_width / 2, pin_z))
)

# ============================================================
# 3. BUILD CONNECTING ROD - BIG END
# ============================================================

# Big end bearing ring
be_ring = (
    cq.Workplane("XY")
    .circle(be_od / 2)
    .circle(be_id / 2)
    .extrude(rod_width)
    .rotate((0, 0, 0), (1, 0, 0), -90)
    .translate((0, -rod_width / 2, be_z))
)

# Rectangular bolt tab extending downward for cap bolts
tab_x = bolt_spacing + bolt_head_dia + 6
tab_z = be_od / 2 + 5  # extends from big end center downward
bolt_tab = (
    cq.Workplane("XY")
    .center(0, tab_z / 2)
    .rect(tab_x, tab_z)
    .extrude(rod_width)
    .rotate((0, 0, 0), (1, 0, 0), -90)
    .translate((0, -rod_width / 2, be_z))
)

# Combine ring and bolt tabs
big_end = be_ring.union(bolt_tab)

# Cut the bearing bore through all big end geometry
bore_cut = (
    cq.Workplane("XY")
    .circle(be_id / 2)
    .extrude(rod_width + 4)
    .rotate((0, 0, 0), (1, 0, 0), -90)
    .translate((0, -(rod_width / 2 + 2), be_z))
)
big_end = big_end.cut(bore_cut)

# Cut bolt holes through big end (vertical Z-axis holes)
for x_pos in [bolt_spacing / 2, -bolt_spacing / 2]:
    bolt_hole = (
        cq.Workplane("XY")
        .workplane(offset=be_z - be_od)
        .center(x_pos, 0)
        .circle(bolt_dia / 2)
        .extrude(be_od * 2)
    )
    big_end = big_end.cut(bolt_hole)

# Cap split line - thin horizontal slot at big end center
split_line = (
    cq.Workplane("XY")
    .workplane(offset=be_z - 0.3)
    .rect(tab_x + 10, rod_width + 2)
    .extrude(0.6)
)
big_end = big_end.cut(split_line)

# Bolt heads protruding below the cap
for x_pos in [bolt_spacing / 2, -bolt_spacing / 2]:
    bolt_head = (
        cq.Workplane("XY")
        .workplane(offset=be_z - tab_z - bolt_head_h)
        .center(x_pos, 0)
        .circle(bolt_head_dia / 2)
        .extrude(bolt_head_h)
    )
    big_end = big_end.union(bolt_head)

# ============================================================
# 4. BUILD CONNECTING ROD - I-BEAM SECTION
# ============================================================

# Beam spans between small end and big end with overlap
beam_overlap = 5.0
beam_bot_z = be_z + be_od / 2 - beam_overlap
beam_top_z = pin_z - se_od / 2 + beam_overlap
beam_length = beam_top_z - beam_bot_z

# Web (thin central plate connecting ends)
web = (
    cq.Workplane("XY")
    .workplane(offset=beam_bot_z)
    .rect(web_thick, rod_width)
    .extrude(beam_length)
)

# Front and back flanges at Y-edges of the beam
flange_y_offset = rod_width / 2 - flange_thick / 2
flange_front = (
    cq.Workplane("XY")
    .workplane(offset=beam_bot_z)
    .center(0, flange_y_offset)
    .rect(flange_width, flange_thick)
    .extrude(beam_length)
)
flange_back = (
    cq.Workplane("XY")
    .workplane(offset=beam_bot_z)
    .center(0, -flange_y_offset)
    .rect(flange_width, flange_thick)
    .extrude(beam_length)
)

# Combine I-beam components
beam = web.union(flange_front).union(flange_back)

# ============================================================
# 5. ASSEMBLE CONNECTING ROD
# ============================================================

rod = small_end.union(big_end).union(beam)

# ============================================================
# 6. FINAL ASSEMBLY - PISTON + CONNECTING ROD
# ============================================================

result = piston.union(rod)