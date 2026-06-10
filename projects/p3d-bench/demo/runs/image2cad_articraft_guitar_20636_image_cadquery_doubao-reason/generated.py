import cadquery as cq
import math

# --------------------------
# Semi-Hollow Electric Guitar Parameters (Gibson ES-335 style)
# --------------------------
body_length = 450.0        # Total length of guitar body (neck joint to tail)
body_max_width = 340.0     # Maximum width of body at lower bout
body_thickness = 40.0      # Thickness of the guitar body
edge_fillet_radius = 3.0   # Rounded edge/binding radius

neck_length = 620.0        # Length of neck from nut to body joint
neck_thickness = 22.0      # Thickness of the neck base
fretboard_width_nut = 42.0 # Fretboard width at headstock end
fretboard_width_body = 56.0# Fretboard width at body joint
fretboard_thickness = 6.0  # Thickness of the fretboard
fret_count = 22            # Number of frets on the neck
fret_slot_depth = 0.5      # Depth of fret slots
fret_slot_width = 1.0      # Width of fret slots

headstock_length = 170.0   # Length of headstock from nut
headstock_width = 110.0    # Maximum width of headstock
headstock_back_angle = 12.0# Backwards angle of headstock in degrees
tuner_diameter = 10.0      # Diameter of tuning pegs
tuner_height = 6.0         # Height of tuning pegs above headstock

# Hardware parameters
humbucker_length = 70.0
humbucker_width = 38.0
humbucker_height = 2.0
bridge_length = 85.0
bridge_width = 22.0
bridge_height = 3.0
control_knob_dia = 8.0
control_knob_height = 5.0

# --------------------------
# Step 1: Build Main Guitar Body
# --------------------------
# Classic semi-hollow body outline points
body_outline_pts = [
    (0, body_max_width/2 * 0.7),                # Neck joint upper edge
    (body_length * 0.2, body_max_width/2 * 0.93),# Upper bout peak
    (body_length * 0.4, body_max_width/2 * 0.65),# Upper waist curve
    (body_length * 0.5, body_max_width/2 * 0.58),# Narrowest waist point
    (body_length * 0.63, body_max_width/2 * 0.98),# Lower bout peak
    (body_length, 0),                           # Tail end of body
    (body_length * 0.63, -body_max_width/2 * 0.98),# Lower bout peak bottom
    (body_length * 0.5, -body_max_width/2 * 0.58),# Waist bottom point
    (body_length * 0.4, -body_max_width/2 * 0.65),# Lower waist curve
    (body_length * 0.2, -body_max_width/2 * 0.93),# Upper bout peak bottom
    (0, -body_max_width/2 * 0.7),               # Neck joint lower edge
    (0, body_max_width/2 * 0.7)                 # Close the shape
]

# Create body base
body = (
    cq.Workplane("XY", origin=(0, 0, -body_thickness))
    .polyline(body_outline_pts)
    .close()
    .extrude(body_thickness)
    .edges("|Z").fillet(edge_fillet_radius)  # Round side edges
    .faces(">Z or <Z").edges().fillet(edge_fillet_radius/2)  # Round top/bottom edges
)

# Cut F-style sound holes (simplified F shape)
def make_f_hole(workplane, x_offset, y_offset, mirror=False):
    y_sign = -1 if mirror else 1
    return (
        workplane
        .moveTo(x_offset, y_offset + y_sign*25)
        .spline([
            (x_offset + 15, y_offset + y_sign*60),
            (x_offset + 40, y_offset + y_sign*45),
            (x_offset + 25, y_offset + y_sign*20),
            (x_offset + 50, y_offset + y_sign*5),
            (x_offset + 50, y_offset + y_sign*-10),
            (x_offset + 15, y_offset + y_sign*-25),
            (x_offset, y_offset + y_sign*0)
        ])
        .close()
        .cutBlind(-10)  # Cut 10mm deep into top of body
    )

body = make_f_hole(body, body_length*0.35, 50, mirror=False)
body = make_f_hole(body, body_length*0.35, -50, mirror=True)

# --------------------------
# Step 2: Build Neck & Fretboard
# --------------------------
# Create tapered neck base
neck = (
    cq.Workplane("XZ")
    # Rectangles at both ends of the neck for loft
    .workplane(offset=-fretboard_width_nut/2, origin=(-neck_length, 0, -neck_thickness))
    .rect(fretboard_width_nut, neck_thickness)
    .workplane(offset=neck_length, origin=(0, 0, -neck_thickness))
    .rect(fretboard_width_body, neck_thickness)
    .loft()  # Create tapered solid between the two rectangles
)

# Add fretboard on top of neck
fretboard = (
    cq.Workplane("XZ")
    .workplane(offset=-fretboard_width_nut/2, origin=(-neck_length, 0, 0))
    .rect(fretboard_width_nut, fretboard_thickness)
    .workplane(offset=neck_length, origin=(0, 0, 0))
    .rect(fretboard_width_body, fretboard_thickness)
    .loft()
)

# Cut fret slots into fretboard
fret_spacing = neck_length / fret_count
for i in range(1, fret_count):
    slot_x_pos = -neck_length + i * fret_spacing
    slot_width = fretboard_width_nut + (fretboard_width_body - fretboard_width_nut) * (i/fret_count)
    fretboard = (
        fretboard
        .faces(">Y").workplane(centerOption="CenterOfBoundBox", origin=(slot_x_pos,0,0))
        .slot2D(slot_width + 2, fret_slot_width, 90)
        .cutBlind(-fret_slot_depth)
    )

# --------------------------
# Step 3: Build Headstock (Fixed error: removed invalid extrude after loft, corrected rotation axis)
# --------------------------
# Create headstock base with back angle
headstock = (
    cq.Workplane("XY", origin=(-neck_length, 0, 0))
    # Create angled workplane for headstock back angle: rotate around X axis (corrected rotation order)
    .transformed(rotate=(headstock_back_angle, 0, 0))
    # First profile at nut end of headstock
    .rect(fretboard_width_nut, headstock_width * 0.6)
    # Second workplane offset along headstock length
    .workplane(offset=-headstock_length)
    # Rounded headstock end shape
    .moveTo(0, headstock_width/2)
    .threePointArc((-25, headstock_width*0.55), (-40, headstock_width*0.4))
    .lineTo(-40, -headstock_width*0.4)
    .threePointArc((-25, -headstock_width*0.55), (0, -headstock_width/2))
    .close()
    # Loft between two profiles directly creates solid (removed invalid extrude step after this)
    .loft()
)

# Add tuning pegs (3 per side of headstock)
tuner_x_positions = [-neck_length - 25, -neck_length - 60, -neck_length - 95]
for i, x in enumerate(tuner_x_positions):
    headstock = (
        headstock
        .faces(">Z").workplane(centerOption="ProjectedOrigin", origin=(x, headstock_width*0.37, 0))
        .circle(tuner_diameter/2)
        .extrude(tuner_height)
        .faces(">Z").workplane(centerOption="ProjectedOrigin", origin=(x, -headstock_width*0.37, 0))
        .circle(tuner_diameter/2)
        .extrude(tuner_height)
    )

# --------------------------
# Step 4: Add Hardware
# --------------------------
# Add two humbucker pickups
pickup_positions = [body_length*0.3, body_length*0.42]
for x in pickup_positions:
    body = (
        body
        .faces(">Z").workplane(centerOption="ProjectedOrigin", origin=(x, 0, 0))
        .rect(humbucker_width, humbucker_length)
        .extrude(humbucker_height)
    )

# Add bridge
body = (
    body
    .faces(">Z").workplane(centerOption="ProjectedOrigin", origin=(body_length*0.55, 0, 0))
    .rect(bridge_width, bridge_length)
    .extrude(bridge_height)
)

# Add control knobs (4 total on lower bout)
knob_positions = [
    (body_length*0.72, body_max_width*0.18),
    (body_length*0.79, body_max_width*0.26),
    (body_length*0.76, body_max_width*0.08),
    (body_length*0.83, body_max_width*0.16)
]
for (x, y) in knob_positions:
    body = (
        body
        .faces(">Z").workplane(centerOption="ProjectedOrigin", origin=(x, y, 0))
        .circle(control_knob_dia/2)
        .extrude(control_knob_height)
    )

# Add output jack socket on body edge
body = (
    body
    .faces(">X").workplane(centerOption="CenterOfBoundBox")
    .circle(6)
    .cutBlind(-10)
)

# --------------------------
# Combine all parts into final model
# --------------------------
result = body.union(neck).union(fretboard).union(headstock)