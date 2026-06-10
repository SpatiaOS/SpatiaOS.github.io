import cadquery as cq
import math

# ==========================================
# Clock Face / Medallion Parameters
# ==========================================

# Base dimensions
outer_radius = 60.0          # Overall radius of the clock
base_thickness = 5.0         # Thickness of the base disc

# Outer bezel (raised rim)
bezel_height = 3.0           # Height of bezel above face
bezel_inner_radius = 52.0    # Inner edge of bezel

# Inner decorative ring
ring_outer_radius = 47.0     # Outer edge of inner ring
ring_width = 1.5             # Width of ring
ring_height = 2.0            # Height of ring above face

# Roman numerals
numeral_radius = 39.0        # Distance from center to numeral centers
numeral_size = 7.0           # Font size for numerals
numeral_height = 1.5         # Extrusion height of raised numerals

# Center hub
hub_radius = 9.0             # Radius of center hub
hub_height = 3.0             # Height of center hub
pip_radius = 2.5             # Small center pip radius
pip_height = 1.0             # Pip height above hub

# Clock hands
minute_length = 35.0         # Minute hand length
hour_length = 25.0           # Hour hand length
hand_width = 1.2             # Base hand width
hand_thickness = 0.8         # Hand thickness (height)

# Time display angles (from positive X axis, counterclockwise)
minute_angle_deg = 42.0      # Minute hand angle
hour_angle_deg = 56.0        # Hour hand angle

# ==========================================
# Step 1: Base Disc
# ==========================================
base = (
    cq.Workplane("XY")
    .circle(outer_radius)
    .extrude(base_thickness)
)

# ==========================================
# Step 2: Outer Bezel (Raised Rim)
# ==========================================
bezel = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(outer_radius)
    .circle(bezel_inner_radius)
    .extrude(bezel_height)
)
result = base.union(bezel)

# ==========================================
# Step 3: Inner Decorative Ring
# ==========================================
inner_ring = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(ring_outer_radius)
    .circle(ring_outer_radius - ring_width)
    .extrude(ring_height)
)
result = result.union(inner_ring)

# ==========================================
# Step 4: Center Hub with Pip
# ==========================================
hub = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness)
    .circle(hub_radius)
    .extrude(hub_height)
)
result = result.union(hub)

# Small raised pip on top of hub
pip = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height)
    .circle(pip_radius)
    .extrude(pip_height)
)
result = result.union(pip)

# ==========================================
# Step 5: Roman Numerals (raised from face)
# ==========================================
numerals = [
    "XII", "I", "II", "III", "IV", "V",
    "VI", "VII", "VIII", "IX", "X", "XI"
]

for i, txt in enumerate(numerals):
    # Position angle: 12 o'clock = 90deg from X axis, going clockwise 30deg each
    pos_angle = 90.0 - i * 30.0
    pos_rad = math.radians(pos_angle)

    # Cartesian position on the numeral circle
    nx = numeral_radius * math.cos(pos_rad)
    ny = numeral_radius * math.sin(pos_rad)

    # Rotation so text top faces outward (radial orientation)
    text_rot = pos_angle - 90.0

    # Create raised numeral text
    numeral_body = (
        cq.Workplane("XY")
        .workplane(offset=base_thickness)
        .transformed(offset=(nx, ny, 0), rotate=(0, 0, text_rot))
        .text(txt, numeral_size, numeral_height)
    )
    result = result.union(numeral_body)

# ==========================================
# Step 6: Hour Hand (shorter, wider)
# ==========================================
hour_hand = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height)
    .transformed(rotate=(0, 0, hour_angle_deg))
    .center(hour_length / 2 - 2.0, 0)
    .rect(hour_length, hand_width * 1.5)
    .extrude(hand_thickness)
)
result = result.union(hour_hand)

# ==========================================
# Step 7: Minute Hand (longer, thinner)
# ==========================================
minute_hand = (
    cq.Workplane("XY")
    .workplane(offset=base_thickness + hub_height + hand_thickness)
    .transformed(rotate=(0, 0, minute_angle_deg))
    .center(minute_length / 2 - 2.0, 0)
    .rect(minute_length, hand_width)
    .extrude(hand_thickness)
)
result = result.union(minute_hand)