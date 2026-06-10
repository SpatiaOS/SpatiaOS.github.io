import cadquery as cq

# --------------------------
# Global Assembly Parameters
# --------------------------
# Base Plate (lower grounded component)
base_width = 309.0       # X axis length
base_depth = 245.0       # Z axis length
base_height = 28.0       # Y axis (vertical) height
base_notch_size = 80.0
base_tab_extrusion = 10.0

# Housing Cover (top deck panel)
cover_width = 300.0
cover_depth = 230.0
cover_height = 37.0      # Visible height above base, total part height 45mm with 8mm recess into base
cover_edge_chamfer = 2.0
cutout_fillet_r = 1.0
wheel_recess_depth = 15.0

# Jog Wheel Cap (x2 instances)
cap_dia = 86.0
cap_height = 20.0
cap_slot_count = 14
cap_slot_w = 3.0
cap_slot_depth = 2.0
cap_indicator_dia = 5.0

# Spacer Block Tactile Pad (x26 instances)
spacer_w = 18.87
spacer_d = 12.09
spacer_h = 5.0
spacer_edge_fillet = 2.0

# Control Stem Pin (x11 instances)
pin_dia = 1.5
pin_length = 11.0

# Front Panel Flanged Bushing Jack (x6 instances)
bushing_flange_dia = 18.2
bushing_bore_dia = 4.92
bushing_depth = 10.0

# Crossfader Components
wedge_guide_w = 8.0
wedge_guide_d = 14.0
wedge_guide_h = 18.0
slider_bar_w = 1.1
slider_bar_d = 2.0
slider_bar_length = 20.0

# --------------------------
# Base Plate Construction
# --------------------------
result = (
    cq.Workplane("XZ")
    .box(base_width, base_depth, base_height)
    .translate((0, base_height/2, 0))  # Align bottom to Y=0 plane
    # Cut left-front notch for jack panel
    .faces("<Z").workplane()
    .moveTo(-base_width/2 + base_notch_size/2, -base_depth/2 + base_notch_size/2)
    .rect(base_notch_size, base_notch_size).cutBlind(base_height)
    # Add protruding jack panel tab
    .moveTo(-base_width/2 + base_notch_size/2, -base_depth/2 + base_notch_size/2)
    .rect(base_notch_size, base_notch_size).extrude(base_tab_extrusion)
)

# --------------------------
# Housing Cover Construction
# --------------------------
cover = (
    cq.Workplane("XZ", origin=(0, base_height, 0))
    .box(cover_width, cover_depth, cover_height)
    # Chamfer upper perimeter edges
    .faces(">Y").edges().chamfer(cover_edge_chamfer)
    # Cut recesses for jog wheels (symmetric left/right placement)
    .faces(">Y").workplane()
    .pushPoints([(-75, 35), (75, -35)])
    .circle(cap_dia/2).cutBlind(-wheel_recess_depth)
)

# Add 26 spacer blocks (symmetric grid arrangement)
spacer = (
    cq.Workplane("XZ")
    .rect(spacer_w, spacer_d).extrude(spacer_h)
    # Fixed edge selection: get perimeter edges of top face to fillet
    .faces(">Y").edges().fillet(spacer_edge_fillet)
)
spacer_positions = [
    (-120,80), (-90,80), (-120,50), (-90,50), (-60,50), (-120,20), (-90,20), (-60,20), (-30,20),
    (-90,-10), (-60,-10), (-30,-10), (-60,-40), (120,-80), (90,-80), (120,-50), (90,-50), (60,-50),
    (120,-20), (90,-20), (60,-20), (30,-20), (90,10), (60,10), (30,10), (60,40)
]
for x, z in spacer_positions:
    cover = cover.union(spacer.translate((x, cover_height, z)))

# Add 2 jog wheel caps
cap = (
    cq.Workplane("XZ")
    .circle(cap_dia/2).extrude(cap_height)
    # Cut circumferential grip slots
    .faces("<Y").workplane()
    .polarArray(cap_dia/2 - 5, 0, 360, cap_slot_count)
    .rect(cap_slot_w, cap_slot_depth).cutBlind(3)
    # Add hemispherical indicator boss
    .faces(">Y").workplane().sphere(cap_indicator_dia/2, combine="s")
)
cover = cover.union(cap.translate((-75, cover_height - wheel_recess_depth + cap_height, 35)))
cover = cover.union(cap.translate((75, cover_height - wheel_recess_depth + cap_height, -35)))

# Add 11 control stem pins
pin = cq.Workplane("XZ").circle(pin_dia/2).extrude(pin_length)
pin_positions = [(-40,90), (-10,70), (20,50), (50,30), (80,10), (110,-10), (10,-70), (40,-50), (70,-30), (-70,70), (-100,50)]
for x, z in pin_positions:
    cover = cover.union(pin.translate((x, cover_height, z)))

# Add 6 front panel jack bushings
bushing = (
    cq.Workplane("YZ")
    .circle(bushing_flange_dia/2).extrude(bushing_depth)
    .faces("<X").workplane().circle(bushing_bore_dia/2).cutThruAll()
)
bushing_positions = [(-140, 5), (-125,5), (-110,5), (-95,5), (-80,5), (-65,5)]
for x, y in bushing_positions:
    cover = cover.union(bushing.translate((x, y, -base_depth/2 + base_tab_extrusion)))

# Add 3 crossfader assemblies
wedge_guide = (
    cq.Workplane("XZ")
    .rect(wedge_guide_w, wedge_guide_d).extrude(wedge_guide_h)
    .faces(">Y").workplane().slot2D(slider_bar_length + 2, slider_bar_w + 0.2, 0).cutBlind(-3)
)
slider = cq.Workplane("XZ").rect(slider_bar_w, slider_bar_length).extrude(slider_bar_d + 2)
crossfader_pos = [(-30,0), (0,0), (30,0)]
for x, z in crossfader_pos:
    cover = cover.union(wedge_guide.translate((x, cover_height - 3, z)))
    cover = cover.union(slider.translate((x, cover_height + slider_bar_d/2, z)))

# Join cover to base plate for final unified assembly
result = result.union(cover)