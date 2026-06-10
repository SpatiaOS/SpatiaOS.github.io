import cadquery as cq

# ==========================================
# Parameters
# ==========================================
cover_width = 300.0
cover_depth = 230.0
cover_height = 45.0
base_height = 28.0

jog_wheel_radius = 43.0
jog_wheel_height = 15.0
jog_top_radius = 30.25
jog_top_height = 5.0

fader_v_dims = (8.0, 14.0, 18.0)
fader_h_dims = (14.0, 8.0, 18.0)

knob_base_r = 7.45
knob_top_r = 4.0
knob_height = 17.0

button_dims = (18.87, 12.09, 5.0)

# Profile points for the main body (includes recessed front cutout)
profile_pts = [
    (150, 115),
    (150, -115),
    (60, -115),
    (40, -95),
    (-40, -95),
    (-60, -115),
    (-150, -115),
    (-150, 115)
]

# ==========================================
# 1. Main Body (Housing Cover + Base Plate)
# ==========================================
# Create the top housing cover with chamfered top edges
housing_cover = (
    cq.Workplane("XY")
    .polyline(profile_pts).close()
    .extrude(cover_height)
    .edges(">Z")
    .chamfer(2.0)
)

# Create the bottom base plate with chamfered bottom edges
base_plate = (
    cq.Workplane("XY")
    .polyline(profile_pts).close()
    .extrude(-base_height)
    .edges("<Z")
    .chamfer(2.0)
)

# Combine into a single base model
result = housing_cover.union(base_plate)

# ==========================================
# 2. Jog Wheels
# ==========================================
# Base cylinder for the jog wheel
jog_wheel_base = (
    cq.Workplane("XY")
    .circle(jog_wheel_radius)
    .extrude(jog_wheel_height)
)

# Create and subtract 14 peripheral slots for grip
slot = (
    cq.Workplane("XY")
    .rect(3, 4)
    .extrude(jog_wheel_height)
    .translate((jog_wheel_radius, 0, 0))
)
for i in range(14):
    angle = i * (360.0 / 14.0)
    rotated_slot = slot.rotate((0, 0, 0), (0, 0, 1), angle)
    jog_wheel_base = jog_wheel_base.cut(rotated_slot)

# Add top plateau and hemispherical indicator boss
jog_top = (
    cq.Workplane("XY")
    .workplane(offset=jog_wheel_height)
    .circle(jog_top_radius)
    .extrude(jog_top_height)
)
boss = (
    cq.Workplane("XY")
    .workplane(offset=jog_wheel_height + jog_top_height)
    .pushPoints([(20, 0)])
    .sphere(3)
)
jog_wheel = jog_wheel_base.union(jog_top).union(boss)

# Place jog wheels on the left and right decks
jog_positions = [(-85, -20), (85, -20)]
jog_wheels = (
    cq.Workplane("XY", origin=(0, 0, cover_height))
    .pushPoints(jog_positions)
    .eachpoint(lambda loc: jog_wheel.val().located(loc))
)
result = result.union(jog_wheels)

# ==========================================
# 3. Faders (Wedge Guide Blocks)
# ==========================================
# Vertical and horizontal fader knobs
fader_v = (
    cq.Workplane("XY")
    .box(*fader_v_dims)
    .edges(">Z")
    .chamfer(1.5)
)
fader_h = (
    cq.Workplane("XY")
    .box(*fader_h_dims)
    .edges(">Z")
    .chamfer(1.5)
)

# Place vertical faders
fader_v_positions = [(-20, -20), (20, -20)]
faders_v = (
    cq.Workplane("XY", origin=(0, 0, cover_height + fader_v_dims[2]/2))
    .pushPoints(fader_v_positions)
    .eachpoint(lambda loc: fader_v.val().located(loc))
)
result = result.union(faders_v)

# Place horizontal crossfader
fader_h_pos = [(0, -60)]
faders_h = (
    cq.Workplane("XY", origin=(0, 0, cover_height + fader_h_dims[2]/2))
    .pushPoints(fader_h_pos)
    .eachpoint(lambda loc: fader_h.val().located(loc))
)
result = result.union(faders_h)

# ==========================================
# 4. Knobs (Socket Posts)
# ==========================================
# Bell-shaped conical posts
knob = (
    cq.Workplane("XY")
    .circle(knob_base_r)
    .workplane(offset=knob_height)
    .circle(knob_top_r)
    .loft()
)

# Layout for the EQ/mixer knobs
knob_positions = [
    (-20, 100), (0, 100),
    (-20, 80), (0, 80), (20, 80),
    (-20, 60), (0, 60), (20, 60)
]

knobs = (
    cq.Workplane("XY", origin=(0, 0, cover_height))
    .pushPoints(knob_positions)
    .eachpoint(lambda loc: knob.val().located(loc))
)
result = result.union(knobs)

# ==========================================
# 5. Buttons (Spacer Blocks)
# ==========================================
# Rectangular pads with filleted tops
button = (
    cq.Workplane("XY")
    .box(*button_dims)
    .edges(">Z")
    .fillet(1.5)
)

button_positions = [
    # Left deck top
    (-120, 80), (-95, 80),
    (-120, 60), (-95, 60),
    # Left deck middle
    (-120, 30), (-95, 30),
    # Left deck bottom
    (-120, -80), (-95, -80),
    # Right deck top grid
    (70, 80), (95, 80), (120, 80),
    (70, 60), (95, 60), (120, 60),
    (70, 40), (95, 40), (120, 40),
    # Right deck bottom
    (95, -80), (120, -80),
    # Center section
    (-20, 30), (0, 30), (20, 30)
]

buttons = (
    cq.Workplane("XY", origin=(0, 0, cover_height + button_dims[2]/2))
    .pushPoints(button_positions)
    .eachpoint(lambda loc: button.val().located(loc))
)
result = result.union(buttons)

# ==========================================
# 6. Front Connectors (Flanged Bushings)
# ==========================================
# Jack connectors located on the recessed front panel
connector = (
    cq.Workplane("XZ")
    .circle(9.1)
    .extrude(-2)
    .union(
        cq.Workplane("XZ")
        .circle(5)
        .extrude(-10)
    )
)

connector_positions = [(-30, 0), (-15, 0), (0, 0), (15, 0), (30, 0)]
connectors = (
    cq.Workplane("XZ", origin=(0, -95, cover_height/2))
    .pushPoints(connector_positions)
    .eachpoint(lambda loc: connector.val().located(loc))
)
result = result.union(connectors)