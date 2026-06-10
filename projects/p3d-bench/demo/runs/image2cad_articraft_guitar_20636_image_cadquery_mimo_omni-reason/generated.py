import cadquery as cq

# ----------------------
# Guitar Parameters (all in mm, based on typical electric guitar proportions)
# ----------------------
# Body dimensions
body_length = 450
body_width = 330
body_thickness = 40
body_top_thickness = 12
f_hole_length = 120
f_hole_width = 35

# Neck dimensions
neck_length = 620
neck_width_nut = 45
neck_width_body = 65
neck_thickness = 25

# Headstock dimensions
headstock_length = 180
headstock_width = 130
headstock_thickness = 20

# Hardware dimensions
pickup_length = 100
pickup_width = 40
pickup_height = 15
knob_diameter = 15
knob_height = 10
bridge_length = 80
bridge_width = 25
bridge_height = 10
sound_hole_diameter = 10

# ----------------------
# Create Guitar Body
# ----------------------
# Create the main body shape (semi-hollow style)
body_outer = (
    cq.Workplane("XY")
    .ellipse(body_length, body_width)
    .extrude(body_thickness)
)

# Create the inner cavity by cutting from the top
body_with_cavity = (
    body_outer.faces(">Z")
    .workplane(offset=-body_top_thickness)
    .ellipse(body_length - 40, body_width - 40)
    .cutBlind(-body_thickness + body_top_thickness)
)

# Add F-holes to the body
# Left F-hole
body_with_left_fhole = (
    body_with_cavity.faces(">Z")
    .workplane()
    .center(-body_length/4, -body_width/6)
    .slot2D(f_hole_length, f_hole_width, angle=15)
    .cutThruAll()
)

# Right F-hole
body_with_fholes = (
    body_with_left_fhole.faces(">Z")
    .workplane()
    .center(-body_length/4, body_width/6)
    .slot2D(f_hole_length, f_hole_width, angle=-15)
    .cutThruAll()
)

# Add sound hole on the body
body_final = (
    body_with_fholes.faces(">Z")
    .workplane()
    .center(body_length/3, 0)
    .circle(sound_hole_diameter/2)
    .cutThruAll()
)

# ----------------------
# Create Guitar Neck
# ----------------------
# Create tapered neck shape on XZ plane
neck = (
    cq.Workplane("XZ")
    .center(0, body_thickness/2)
    .moveTo(-neck_width_body/2, 0)
    .lineTo(-neck_width_nut/2, neck_length)
    .lineTo(neck_width_nut/2, neck_length)
    .lineTo(neck_width_body/2, 0)
    .close()
    .extrude(neck_thickness)
    .translate((0, body_length/2 - 20, 0))
)

# ----------------------
# Create Headstock
# ----------------------
# Create headstock shape with rounded top
headstock = (
    cq.Workplane("XZ")
    .center(0, body_thickness/2 + neck_length)
    .moveTo(-headstock_width/2, 0)
    .lineTo(-headstock_width/2, headstock_length - 30)
    .threePointArc((-headstock_width/2 + 20, headstock_length), (0, headstock_length))
    .threePointArc((headstock_width/2 - 20, headstock_length), (headstock_width/2, headstock_length - 30))
    .lineTo(headstock_width/2, 0)
    .close()
    .extrude(headstock_thickness)
    .translate((0, body_length/2 - 20, 0))
)

# ----------------------
# Create Tuning Pegs as separate objects
# ----------------------
# Create each tuning peg separately to avoid face selection issues
peg_positions = [
    (-headstock_width/4, headstock_length - 60),
    (headstock_width/4, headstock_length - 60),
    (-headstock_width/4, headstock_length - 100),
    (headstock_width/4, headstock_length - 100)
]

# Build headstock with pegs by adding each peg individually
headstock_with_pegs = headstock
for pos in peg_positions:
    # Create each peg as a separate cylinder at the correct position
    peg = (
        cq.Workplane("XZ")
        .center(pos[0], body_thickness/2 + neck_length + pos[1])
        .circle(5)
        .extrude(15)
        .translate((0, body_length/2 - 20, 0))
    )
    headstock_with_pegs = headstock_with_pegs.union(peg)

# ----------------------
# Add Guitar Hardware
# ----------------------
# Add pickups (two single-coil style)
pickup1 = (
    body_final.faces(">Z")
    .workplane()
    .center(-body_length/6, 0)
    .box(pickup_length, pickup_width, pickup_height)
)

pickup2 = (
    pickup1.faces(">Z")
    .workplane()
    .center(pickup_length + 20, 0)
    .box(pickup_length, pickup_width, pickup_height)
)

# Add bridge
body_with_bridge = (
    pickup2.faces(">Z")
    .workplane()
    .center(body_length/6 - pickup_length/2 - 20, 0)
    .box(bridge_length, bridge_width, bridge_height)
)

# Add control knobs (4 total) - create each as separate cylinder
knob_positions = [
    (body_length/3, body_width/6),
    (body_length/3 + 30, body_width/6),
    (body_length/3, -body_width/6),
    (body_length/3 + 30, -body_width/6)
]

body_with_knobs = body_with_bridge
for pos in knob_positions:
    knob = (
        cq.Workplane("XY")
        .center(pos[0], pos[1])
        .workplane(offset=body_thickness)
        .circle(knob_diameter/2)
        .extrude(knob_height)
    )
    body_with_knobs = body_with_knobs.union(knob)

# ----------------------
# Combine All Components
# ----------------------
result = (
    body_with_knobs
    .union(neck)
    .union(headstock_with_pegs)
)