import cadquery as cq
import math

# Parameters - Overall ship dimensions
hull_length = 100.0
hull_width = hull_length / 5.0  # Aspect ratio 5:1
hull_height = 15.0
deck_thickness = 2.0

# Turret boss parameters
turret_radius = 5.0
turret_height = 6.0
turret_positions = [25.0, 50.0, 75.0]  # Z positions along hull

# Chimney parameters
chimney_radius = 2.5
chimney_height = 8.0

# Pin (gun barrel) parameters
pin_radius = 0.5
pin_length = 10.0
pins_per_turret = 3

# Superstructure parameters
superstructure_length = 30.0
superstructure_width = 12.0
superstructure_height = 8.0
superstructure_steps = 3
step_height = superstructure_height / superstructure_steps

# Spacer parameters (approximate based on bbox)
spacer_length = 9.7
spacer_width = 6.2
spacer_height = 2.1
spacer_position_z = 40.0  # Near superstructure

# Create the hull body with tapered shape
hull = (
    cq.Workplane("XZ")
    .box(hull_length, hull_width, hull_height)
    .edges("|Y").chamfer(5.0)  # Chamfer hull edges at 45°
    .workplane(offset=hull_height/2)
    .box(hull_length * 0.9, hull_width * 0.9, deck_thickness)  # Deck
)

# Add superstructure with stepped design
for i in range(superstructure_steps):
    step_length = superstructure_length * (1 - i * 0.2)
    step_width = superstructure_width * (1 - i * 0.2)
    hull = (
        hull.workplane(offset=hull_height/2 + deck_thickness + i * step_height)
        .box(step_length, step_width, step_height)
    )

# Add turret bosses
for pos_z in turret_positions:
    hull = (
        hull.workplane(offset=hull_height/2 + deck_thickness)
        .center(0, pos_z - hull_length/2)
        .circle(turret_radius)
        .extrude(turret_height)
    )

# Add chimney on superstructure
hull = (
    hull.workplane(offset=hull_height/2 + deck_thickness + superstructure_height)
    .center(0, 0)
    .circle(chimney_radius)
    .extrude(chimney_height)
)

# Create gun barrel pins for each turret
pins = []
for pos_z in turret_positions:
    for i in range(pins_per_turret):
        angle = i * 120  # 120° apart
        # Calculate offsets using trigonometry
        offset_x = 2.0 * math.cos(math.radians(angle))
        offset_z = 2.0 * math.sin(math.radians(angle))
        
        pin = (
            cq.Workplane("XZ")
            .center(offset_x, pos_z + offset_z - hull_length/2)
            .circle(pin_radius)
            .extrude(pin_length)
        )
        pins.append(pin)

# Create spacer part (approximated as cylindrical segment with oblique ends)
spacer = (
    cq.Workplane("XZ")
    .center(0, spacer_position_z - hull_length/2)
    .ellipse(spacer_width/2, spacer_height/2)
    .extrude(spacer_length)
    .faces(">Y").workplane()
    .transformed(rotate=(10, 0, 0))  # Tilted end cap
    .circle(spacer_height/2 * 0.8)
    .cutBlind(-spacer_length * 0.3)
    .faces("<Y").workplane()
    .transformed(rotate=(-10, 0, 0))  # Other tilted end cap
    .circle(spacer_height/2 * 0.8)
    .cutBlind(-spacer_length * 0.3)
)

# Combine all parts into single unified model
result = hull
for pin in pins:
    result = result.union(pin)
result = result.union(spacer)