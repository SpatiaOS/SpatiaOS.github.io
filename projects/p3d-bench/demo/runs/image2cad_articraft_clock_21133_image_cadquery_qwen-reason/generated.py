import cadquery as cq
import math

# Parameters
outer_radius = 50.0
rim_width = 8.0
total_height = 12.0
recess_depth = 3.0
hub_radius = 8.0
hub_height = 2.0
pin_radius = 2.0
pin_height = 2.5  # Height of the central pivot pin
hand_thickness = 1.0
numeral_radius = 32.0
numeral_height = 1.5
numeral_fontsize = 6.0
minute_hand_length = 32.0
minute_hand_width = 1.5
hour_hand_length = 22.0
hour_hand_width = 2.0

# 1. Create Base and Recess
# Create the main cylinder
base_wp = cq.Workplane("XY").circle(outer_radius).extrude(total_height)

# Cut the recessed face
# We perform the cut and extract the solid to ensure 'result' has a solid on stack.
# This fixes the "Workplane object must have at least one solid on the stack" error.
base_solid = (
    base_wp
    .faces(">Z")
    .workplane()
    .circle(outer_radius - rim_width)
    .cutBlind(-recess_depth)
    .val()
)
result = cq.Workplane("XY").newObject([base_solid])

# 2. Center Hub
face_z = total_height - recess_depth
hub = (
    cq.Workplane("XY")
    .circle(hub_radius)
    .extrude(hub_height)
    .translate((0, 0, face_z))
)
result = result.union(hub)

# 3. Clock Hands
hub_top_z = face_z + hub_height

# Hour Hand (Shorter, points near 12)
# Positioned at hub top (slightly overlapping to ensure union)
hour_hand = (
    cq.Workplane("XY")
    .rect(hour_hand_width, hour_hand_length)
    .extrude(hand_thickness)
    .translate((0, hour_hand_length / 2, 0)) # Pivot at one end
    .rotate((0, 0, 0), (0, 0, 1), -5) # Slightly past 12 (approx 12:10)
    .translate((0, 0, hub_top_z - 0.01))
)
result = result.union(hour_hand)

# Minute Hand (Longer, points to 2)
# Positioned on top of hour hand (slightly overlapping)
minute_hand = (
    cq.Workplane("XY")
    .rect(minute_hand_width, minute_hand_length)
    .extrude(hand_thickness)
    .translate((0, minute_hand_length / 2, 0))
    .rotate((0, 0, 0), (0, 0, 1), -60) # Points to 2 (30 degrees from 12)
    .translate((0, 0, hub_top_z + hand_thickness - 0.01))
)
result = result.union(minute_hand)

# 4. Center Pin (Pivot)
# Sits on hub, extends above hands to hold them.
# Overlaps with hub and hands to ensure boolean union works.
pin = (
    cq.Workplane("XY")
    .circle(pin_radius)
    .extrude(pin_height + 0.2) 
    .translate((0, 0, hub_top_z - 0.1))
)
result = result.union(pin)

# 5. Numerals
numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]
# Angles in degrees (Standard math: 0=East, 90=North). 
# Clock positions: 12->90, 1->60, 2->30, 3->0, ...
angles = [90, 60, 30, 0, 330, 300, 270, 240, 210, 180, 150, 120]

for i, num in enumerate(numerals):
    angle = angles[i]
    rad = math.radians(angle)
    
    x = numeral_radius * math.cos(rad)
    y = numeral_radius * math.sin(rad)
    
    # Text rotation to keep numerals upright relative to clock face
    # 12 (90 deg) -> 0 deg (upright)
    # 3 (0 deg) -> -90 deg
    text_angle = angle - 90
    
    txt = (
        cq.Workplane("XY")
        .moveTo(x, y)
        .rotate((0, 0, 0), (x, y, 0), text_angle)
        .text(
            num,
            fontsize=numeral_fontsize,
            distance=numeral_height,
            halign="center",
            valign="center"
        )
        .translate((0, 0, face_z))
    )
    result = result.union(txt)

# The variable 'result' holds the final model