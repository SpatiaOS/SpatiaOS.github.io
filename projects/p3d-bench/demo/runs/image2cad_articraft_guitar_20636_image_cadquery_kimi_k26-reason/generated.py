import cadquery as cq

# =============================================================================
# Parameters
# =============================================================================

# Overall scale and thicknesses
scale_length = 628.0              # Nut to bridge distance (mm)
body_thickness = 45.0             # Total body thickness
neck_thickness = 25.0             # Neck wood thickness
fretboard_thickness = 6.0         # Fretboard thickness
neck_z = 14.0                     # Z position of neck back face

# Neck geometry
neck_length = 350.0               # Distance from body joint to nut
neck_width_heel = 56.0            # Width at body joint
neck_width_nut = 43.0             # Width at nut

# Headstock geometry
headstock_length = 160.0
headstock_width = 80.0

# Hardware dimensions
pickup_width = 72.0               # Across strings
pickup_length = 36.0              # Along strings
pickup_height = 20.0

bridge_length = 80.0              # Across strings
bridge_width = 15.0               # Along strings
bridge_height = 12.0

tailpiece_length = 80.0
tailpiece_width = 15.0
tailpiece_height = 10.0

knob_diameter = 15.0
knob_height = 20.0

tuner_diameter = 8.0
tuner_length = 20.0

# =============================================================================
# Body
# =============================================================================

# Simplified semi-hollow body outline (ES-335 style)
# X axis: along centerline toward bottom of body
# Y axis: across the body
# Origin: neck joint center
body_points = [
    (400, 0),       # Bottom center
    (390, 80),
    (360, 120),
    (320, 145),
    (280, 155),
    (240, 150),
    (200, 140),
    (160, 125),
    (120, 100),
    (80, 70),
    (40, 40),
    (20, 30),
    (0, 28),        # Neck joint right
    (-50, 100),     # Lower horn tip (toward headstock)
    (-30, 50),
    (-20, 28),
    (-20, -28),
    (-30, -50),
    (-50, -100),    # Upper horn tip
    (0, -28),       # Neck joint left
    (20, -30),
    (40, -40),
    (80, -70),
    (120, -100),
    (160, -125),
    (200, -140),
    (240, -150),
    (280, -155),
    (320, -145),
    (360, -120),
    (390, -80),
]

# Extrude body outline to create solid body
body = (
    cq.Workplane("XY")
    .polyline(body_points)
    .close()
    .extrude(body_thickness)
)

# =============================================================================
# F-holes (simplified elliptical through-holes)
# =============================================================================

fhole_length = 80.0
fhole_width = 12.0

# Create a through-cutting tool for f-holes
fhole_tool = (
    cq.Workplane("XY")
    .ellipse(fhole_length / 2, fhole_width / 2)
    .extrude(body_thickness + 2)
)

# Cut right and left f-holes into the body top
body = body.cut(fhole_tool.translate((100, 80, -1)))
body = body.cut(fhole_tool.translate((100, -80, -1)))

# =============================================================================
# Neck
# =============================================================================

# Tapered neck extruded from neck joint (x=0) toward headstock (negative X)
neck = (
    cq.Workplane("XY")
    .workplane(offset=neck_z)
    .moveTo(0, -neck_width_heel / 2)
    .lineTo(0, neck_width_heel / 2)
    .lineTo(-neck_length, neck_width_nut / 2)
    .lineTo(-neck_length, -neck_width_nut / 2)
    .close()
    .extrude(neck_thickness)
)

# =============================================================================
# Fretboard
# =============================================================================

# Fretboard sits directly on top of the neck, flush with body top
fretboard = (
    cq.Workplane("XY")
    .workplane(offset=neck_z + neck_thickness)
    .moveTo(0, -neck_width_heel / 2)
    .lineTo(0, neck_width_heel / 2)
    .lineTo(-neck_length, neck_width_nut / 2)
    .lineTo(-neck_length, -neck_width_nut / 2)
    .close()
    .extrude(fretboard_thickness)
)

# =============================================================================
# Headstock
# =============================================================================

headstock_x = -neck_length  # Nut position

# Simple tapered headstock shape
headstock = (
    cq.Workplane("XY")
    .workplane(offset=neck_z)
    .moveTo(headstock_x, -headstock_width / 2)
    .lineTo(headstock_x, headstock_width / 2)
    .lineTo(headstock_x - headstock_length, headstock_width / 2 - 10)
    .lineTo(headstock_x - headstock_length, -(headstock_width / 2 - 10))
    .close()
    .extrude(neck_thickness)
)

# =============================================================================
# Hardware - Pickups
# =============================================================================

# Base pickup geometry (humbucker style)
pickup = (
    cq.Workplane("XY")
    .box(pickup_length, pickup_width, pickup_height)
)

# Neck pickup positioned near end of neck
pickup_neck = pickup.translate((80, 0, body_thickness + pickup_height / 2))

# Bridge pickup positioned closer to bridge
pickup_bridge = pickup.translate((180, 0, body_thickness + pickup_height / 2))

# =============================================================================
# Hardware - Bridge and Tailpiece
# =============================================================================

# Tune-o-matic style bridge
bridge = (
    cq.Workplane("XY")
    .box(bridge_width, bridge_length, bridge_height)
    .translate((278, 0, body_thickness + bridge_height / 2))
)

# Stop-bar tailpiece
tailpiece_obj = (
    cq.Workplane("XY")
    .box(tailpiece_width, tailpiece_length, tailpiece_height)
    .translate((320, 0, body_thickness + tailpiece_height / 2))
)

# =============================================================================
# Hardware - Knobs
# =============================================================================

# Knob geometry (cylinder)
knob = cq.Workplane("XY").cylinder(knob_height, knob_diameter / 2)

# Four knobs arranged near the lower bout
knob_positions = [(260, 50), (260, -50), (300, 35), (300, -35)]
knobs = None
for pos in knob_positions:
    k = knob.translate((pos[0], pos[1], body_thickness + knob_height / 2))
    if knobs is None:
        knobs = k
    else:
        knobs = knobs.union(k)

# =============================================================================
# Hardware - Tuners
# =============================================================================

# Tuner posts as small cylinders along Y axis
tuner = cq.Workplane("XZ").cylinder(tuner_length, tuner_diameter / 2)

# Tuner positions on headstock edges (3 per side)
tuner_positions_top = [
    (headstock_x - 20, 35),
    (headstock_x - 40, 35),
    (headstock_x - 60, 35),
]
tuner_positions_bottom = [
    (headstock_x - 20, -35),
    (headstock_x - 40, -35),
    (headstock_x - 60, -35),
]

tuners = None
for pos in tuner_positions_top + tuner_positions_bottom:
    t = tuner.translate((pos[0], pos[1], neck_z + neck_thickness / 2))
    if tuners is None:
        tuners = t
    else:
        tuners = tuners.union(t)

# =============================================================================
# Final Assembly
# =============================================================================

result = (
    body
    .union(neck)
    .union(fretboard)
    .union(headstock)
    .union(pickup_neck)
    .union(pickup_bridge)
    .union(bridge)
    .union(tailpiece_obj)
)

if knobs is not None:
    result = result.union(knobs)

if tuners is not None:
    result = result.union(tuners)