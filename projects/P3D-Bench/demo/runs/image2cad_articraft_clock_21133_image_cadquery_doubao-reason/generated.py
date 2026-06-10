import cadquery as cq
import math

# ---------------------- PARAMETERS ----------------------
# Overall clock dimensions
outer_diameter = 100.0       # Total outer width of clock
base_thickness = 5.0         # Thickness of the main base plate
rim_width = 10.0             # Width of the raised outer rim
dial_recess_depth = 1.0      # Depth of the recessed dial area inside rim

# Center features
center_boss_diameter = 20.0  # Diameter of raised center boss
center_boss_height = 1.0     # Height of center boss above dial face
center_pin_diameter = 5.0    # Diameter of center pivot pin
center_pin_height = 1.5      # Height of center pivot pin

# Roman numeral parameters
numeral_height = 1.0         # Height of raised numerals above dial
numeral_length = 10.0        # Length of each numeral segment
numeral_width = 2.5          # Width of each numeral segment
numeral_radial_pos = 32.0    # Distance from center to numeral midpoint

# Clock hand parameters
minute_hand_length = 35.0    # Length of minute hand
minute_hand_width = 1.5      # Width of minute hand
minute_hand_height = 0.8     # Thickness of minute hand
hour_hand_length = 22.0      # Length of hour hand
hour_hand_width = 2.0        # Width of hour hand
hour_hand_height = 0.8       # Thickness of hour hand
hand_angle = 60              # Rotation angle of hands (60deg = 2 o'clock position)

# ---------------------- MODELING STEPS ----------------------
# 1. Create main base disc with outer rim
result = (
    cq.Workplane("XY")
    .circle(outer_diameter / 2)
    .extrude(base_thickness)
)

# 2. Cut recessed dial face inside the rim
inner_dial_diameter = outer_diameter - 2 * rim_width
result = (
    result.faces(">Z")
    .workplane()
    .circle(inner_dial_diameter / 2)
    .cutBlind(-dial_recess_depth)
)

# 3. Add raised center boss
result = (
    result.faces("<Z[-2]")  # Select recessed dial face
    .workplane()
    .circle(center_boss_diameter / 2)
    .extrude(center_boss_height)
)

# 4. Add center pivot pin
result = (
    result.faces(">Z")
    .workplane()
    .circle(center_pin_diameter / 2)
    .extrude(center_pin_height)
)

# 5. Add raised roman numerals (simplified segmented design)
# Numeral segment counts per hour position (12 o'clock first)
numeral_segments = [3, 1, 2, 3, 2, 1, 2, 3, 4, 2, 1, 2]
for hour_idx in range(12):
    angle_deg = hour_idx * 30 - 90  # Offset to place 12 at top
    angle_rad = math.radians(angle_deg)
    # Calculate position for this hour's numeral
    x_pos = numeral_radial_pos * math.cos(angle_rad)
    y_pos = numeral_radial_pos * math.sin(angle_rad)
    
    # Create numeral segments for current hour
    num_segs = numeral_segments[hour_idx]
    for seg_idx in range(num_segs):
        seg_offset = (seg_idx - (num_segs -1)/2) * (numeral_width + 0.5)
        seg_x = x_pos + seg_offset * math.cos(angle_rad + math.pi/2)
        seg_y = y_pos + seg_offset * math.sin(angle_rad + math.pi/2)
        # Draw extruded segment
        result = (
            result.faces("<Z[-2]")
            .workplane(centerOption="CenterOfMass")
            .center(seg_x, seg_y)
            .transformed(rotate=(0, 0, angle_deg))
            .rect(numeral_width, numeral_length)
            .extrude(numeral_height)
        )

# 6. Add clock hands
result = (
    result.faces(">Z[-2]")  # Select top of center boss
    .workplane()
    .transformed(rotate=(0, 0, hand_angle))
    # Minute hand
    .rect(minute_hand_width, minute_hand_length, centered=[True, False])
    .extrude(minute_hand_height)
    # Hour hand
    .rect(hour_hand_width, hour_hand_length, centered=[True, False])
    .extrude(hour_hand_height)
)