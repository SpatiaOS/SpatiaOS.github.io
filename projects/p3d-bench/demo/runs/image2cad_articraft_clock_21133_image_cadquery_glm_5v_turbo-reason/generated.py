import cadquery as cq
import math

# ============================================
# CLOCK FACE PARAMETERS
# ============================================

# Overall dimensions (mm)
outer_diameter = 100.0          # Total diameter of the clock
rim_width = 10.0                # Width of the outer raised rim
base_thickness = 8.0            # Thickness of the main face
rim_extra_height = 4.0          # How much the rim rises above the face

# Inner dimensions
inner_diameter = outer_diameter - 2 * rim_width
inner_radius = inner_diameter / 2

# Center hub
hub_diameter = 24.0             # Diameter of the central hub
hub_height = 5.0                # Height of hub above base
cap_diameter = 8.0              # Diameter of the center cap
cap_height = 3.0                # Height of the cap

# Roman numerals configuration
numerals = ["XII", "I", "II", "III", "IV", "V", 
            "VI", "VII", "VIII", "IX", "X", "XI"]
numeral_size = 12.0             # Font size
numeral_depth = 2.0             # Extrusion depth of numerals
numeral_radius = 34.0           # Distance from center to numeral placement

# Clock hands
hour_hand_length = 20.0         # Length of hour hand
minute_hand_length = 32.0       # Length of minute hand
hand_width = 3.5                # Width of hands
hand_thickness = 2.0            # Thickness of hands
hour_hand_angle = -52.0         # Hour hand angle (degrees, 0=12 o'clock, CW negative)
minute_hand_angle = -28.0       # Minute hand angle

# ============================================
# MODEL CONSTRUCTION
# ============================================

# 1. Create the main base disk (the inner face)
base = (
    cq.Workplane("XY")
    .circle(inner_radius)
    .extrude(base_thickness)
)

# 2. Create and attach the outer raised rim
#    This is an annular ring surrounding the base
rim = (
    cq.Workplane("XY")
    .circle(outer_diameter / 2)
    .extrude(base_thickness + rim_extra_height)
    .faces(">Z")
    .workplane()
    .circle(inner_radius)
    .cutThruAll()
)

result = base.union(rim)

# 3. Add the central hub (raised cylinder in middle)
hub = (
    cq.Workplane("XY")
    .circle(hub_diameter / 2)
    .extrude(base_thickness + hub_height)
)
result = result.union(hub)

# 4. Add the center cap (small cylinder on top of hub)
center_cap = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height)
    .circle(cap_diameter / 2)
    .extrude(cap_height)
)
result = result.union(center_cap)

# 5. Add Roman numerals positioned radially around the face
#    Each numeral is placed at 30-degree intervals (360/12)
for i, numeral in enumerate(numerals):
    angle_degrees = i * 30.0  # 0 at XII, increasing clockwise
    
    # Create numeral text at the calculated position
    # Transform: rotate to correct angle, then offset outward by numeral_radius
    numeral_feature = (
        cq.Workplane("XY")
        .workplane(offset=base_thickness)  # Sit on top of base surface
        .transformed(
            rotate=(0, 0, angle_degrees),  # Rotate around Z-axis
            offset=(0, numeral_radius, 0)  # Move outward from center
        )
        .text(numeral, numeral_size, numeral_depth)
    )
    result = result.union(numeral_feature)

# 6. Add the hour hand
#    Positioned just below the cap, angled appropriately
hour_hand = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height + cap_height - hand_thickness + 0.5)
    .transformed(rotate=(0, 0, hour_hand_angle))
    .rect(hand_width, hour_hand_length)
    .extrude(hand_thickness)
)
result = result.union(hour_hand)

# 7. Add the minute hand (slightly longer, positioned slightly above hour hand)
minute_hand = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height + cap_height - hand_thickness + 1.5)
    .transformed(rotate=(0, 0, minute_hand_angle))
    .rect(hand_width * 0.75, minute_hand_length)  # Slightly narrower than hour hand
    .extrude(hand_thickness)
)
result = result.union(minute_hand)