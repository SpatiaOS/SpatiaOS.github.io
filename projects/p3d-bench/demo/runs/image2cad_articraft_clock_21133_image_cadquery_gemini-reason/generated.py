import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================
base_radius = 50.0
base_thickness = 5.0
rim_width = 8.0
pocket_depth = 2.0

inner_circle_radius = 16.0
inner_circle_height = 0.5

numeral_radius = 33.0
numeral_height = 0.8
font_size = 7.5

hand_thickness = 0.6
center_pin_radius = 2.5

# Calculated Z levels for stacking components
pocket_z = base_thickness - pocket_depth
inner_circle_z = pocket_z + inner_circle_height
hour_hand_z = inner_circle_z
minute_hand_z = hour_hand_z + hand_thickness
pin_top_z = minute_hand_z + hand_thickness + 0.5

# ==========================================
# Modeling
# ==========================================

# 1. Base and Rim
# Create the main cylindrical body and cut a shallow pocket to form the outer rim
result = (
    cq.Workplane("XY")
    .circle(base_radius)
    .extrude(base_thickness)
    .faces(">Z")
    .workplane()
    .circle(base_radius - rim_width)
    .cutBlind(-pocket_depth)
)

# 2. Inner Raised Circle
# A slightly elevated platform in the center of the clock face
inner_circle = (
    cq.Workplane("XY").workplane(offset=pocket_z)
    .circle(inner_circle_radius)
    .extrude(inner_circle_height)
)
result = result.union(inner_circle)

# 3. Roman Numerals
numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
for i, num in enumerate(numerals):
    hour = i + 1
    # Calculate standard angle for each hour (12 is 90 deg, 3 is 0 deg, etc.)
    angle_deg = 90 - (hour * 30)
    angle_rad = math.radians(angle_deg)
    
    # Position on the dial
    x = numeral_radius * math.cos(angle_rad)
    y = numeral_radius * math.sin(angle_rad)
    
    # Create text and rotate so the bottom of each numeral faces the center
    text_wp = (
        cq.Workplane("XY").workplane(offset=pocket_z)
        .transformed(offset=cq.Vector(x, y, 0), rotate=cq.Vector(0, 0, angle_deg - 90))
        .text(num, font_size, numeral_height, halign="center", valign="center")
    )
    result = result.union(text_wp)

# 4. Clock Hands
def create_hand(length, width, thickness):
    """Helper function to create a clock hand with a diamond pointer shape"""
    shaft_end = length - 8
    diamond_peak = length - 4
    pts = [
        (0, width/2),
        (shaft_end, width/2),
        (diamond_peak, width * 1.5),
        (length, 0),
        (diamond_peak, -width * 1.5),
        (shaft_end, -width/2),
        (0, -width/2)
    ]
    return cq.Workplane("XY").polyline(pts).close().extrude(thickness)

# Time is set to approximately 10:10 based on the image
hour_angle = 145 
minute_angle = 30 

# Hour hand (shorter, placed lower)
hour_hand = (
    create_hand(22, 1.2, hand_thickness)
    .translate((0, 0, hour_hand_z))
    .rotate((0, 0, 0), (0, 0, 1), hour_angle)
)
result = result.union(hour_hand)

# Minute hand (longer, placed above hour hand)
minute_hand = (
    create_hand(34, 1.2, hand_thickness)
    .translate((0, 0, minute_hand_z))
    .rotate((0, 0, 0), (0, 0, 1), minute_angle)
)
result = result.union(minute_hand)

# 5. Center Pin
# Secures the hands together, featuring a small decorative depression on top
center_pin = (
    cq.Workplane("XY").workplane(offset=pocket_z)
    .circle(center_pin_radius)
    .extrude(pin_top_z - pocket_z)
    .faces(">Z")
    .workplane()
    .circle(center_pin_radius * 0.6)
    .cutBlind(-0.5)
)
result = result.union(center_pin)