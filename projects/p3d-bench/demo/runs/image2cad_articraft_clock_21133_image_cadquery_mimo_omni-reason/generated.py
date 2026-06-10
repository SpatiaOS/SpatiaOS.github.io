import cadquery as cq
import math

# Parameters
outer_diameter = 100.0
outer_thickness = 10.0
inner_diameter = 80.0
inner_depth = 2.0
center_diameter = 20.0
center_thickness = 5.0
hour_hand_length = 30.0
minute_hand_length = 40.0
hand_width = 2.0
hand_thickness = 1.0
numeral_width = 5.0
numeral_thickness = 2.0
numeral_height = 10.0
numeral_radius = inner_diameter / 2 - numeral_height / 2  # Distance from center to numeral center

# Create outer disk (circular base)
result = cq.Workplane("XY").circle(outer_diameter / 2).extrude(outer_thickness)

# Create inner recess (subtract a cylinder from the top face)
result = result.faces(">Z").workplane().circle(inner_diameter / 2).cutBlind(-inner_depth)

# Create center circle (add a cylinder on top of the recess)
result = result.faces(">Z").workplane().circle(center_diameter / 2).extrude(center_thickness)

# Create hour hand (shorter, pointing at XII - positive Y direction)
hour_hand = result.faces(">Z").workplane().rect(hand_width, hour_hand_length).extrude(hand_thickness)
result = result.union(hour_hand)

# Create minute hand (longer, pointing at XI - 330 degrees from X-axis)
minute_hand = result.faces(">Z").workplane().rect(hand_width, minute_hand_length).rotate((0, 0, 0), (0, 0, 1), -30).extrude(hand_thickness)
result = result.union(minute_hand)

# Create Roman numerals (12 positions, 30 degrees apart)
numeral_angles = [90, 60, 30, 0, -30, -60, -90, -120, -150, -180, -210, -240]
numeral_texts = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]

# Simplified numeral creation (using rectangles for demonstration)
for i, (angle, text) in enumerate(zip(numeral_angles, numeral_texts)):
    # Calculate numeral position (x, y, z)
    x = numeral_radius * math.cos(math.radians(angle))
    y = numeral_radius * math.sin(math.radians(angle))
    z = outer_thickness - inner_depth
    
    # Create a simple numeral shape (adjust based on text)
    # Example: I is a single rectangle, II is two, etc.
    # For simplicity, create a rectangle for each numeral (adjust width/height as needed)
    numeral = cq.Workplane("XY").rect(numeral_width, numeral_height).extrude(numeral_thickness)
    
    # Translate and rotate the numeral to the correct position and angle
    numeral = numeral.translate((x, y, z)).rotate((0, 0, 0), (0, 0, 1), angle)
    
    # Add the numeral to the result
    result = result.union(numeral)

# Final result
result = result