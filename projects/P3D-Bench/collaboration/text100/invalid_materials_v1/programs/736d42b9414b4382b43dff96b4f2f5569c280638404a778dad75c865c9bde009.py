import cadquery as cq

# ==============================================================================
# Parameters
# ==============================================================================

# Plate overall dimensions
plate_thickness = 10.0        # Thickness of the main solid plate
plate_width = 60.0            # Total width of the plate
arc_radius = plate_width / 2  # Radius of the rounded arc end (30.0 mm)
rect_length = 70.0            # Distance from arc center to rectangular end
corner_fillet = 4.0           # Fillet radius for the rectangular extension corners

# Central slot (large through void) parameters
slot_center_x = 20.0          # X position of slot center (centered along plate length)
slot_straight_length = 24.0   # Distance between centers of the slot end arcs
slot_width = 16.0             # Width / diameter of the slot opening

# Smaller circular features (counterbored through-holes)
hole_diameter = 6.5           # Diameter of the through-hole (clearance for M6)
cbore_diameter = 11.0         # Diameter of the shallow annular recess
cbore_depth = 3.0             # Depth of the top-side annular recess step

# Positions for the counterbored mounting holes
hole_positions = [
    (-10.0, 18.0),   # Near the rounded arc end (top)
    (-10.0, -18.0),  # Near the rounded arc end (bottom)
    (50.0, 18.0),    # On the rectangular extension (top)
    (50.0, -18.0),   # On the rectangular extension (bottom)
]

# ==============================================================================
# Model Construction
# ==============================================================================

# 1. Create the base plate profile:
#    - Semicircular arc-based end on the negative X side
#    - Straighter rectangular extension on the positive X side
base_plate = (
    cq.Workplane("XY")
    .moveTo(0, -arc_radius)
    .threePointArc((-arc_radius, 0), (0, arc_radius))
    .lineTo(rect_length, arc_radius)
    .lineTo(rect_length, -arc_radius)
    .close()
    .extrude(plate_thickness)
)

# 2. Add corner fillets to the rectangular extension end
base_plate = (
    base_plate
    .edges("|Z and >X")
    .fillet(corner_fillet)
)

# 3. Cut the large central opening:
#    A through-void with a rounded, slot-like profile and straight-sided portion
plate_with_slot = (
    base_plate
    .faces(">Z")
    .workplane(centerOption="ProjectedOrigin")
    .transformed(offset=(slot_center_x, 0, 0))
    .slot2D(slot_straight_length, slot_width)
    .cutThruAll()
)

# 4. Add the smaller circular features on the top face:
#    Each feature consists of a shallow annular recess (counterbore) step
#    and an underlying round through-hole passing completely through the plate
result = (
    plate_with_slot
    .faces(">Z")
    .workplane(centerOption="ProjectedOrigin")
    .pushPoints(hole_positions)
    .cboreHole(
        holeDiameter=hole_diameter,
        cboreDiameter=cbore_diameter,
        cboreDepth=cbore_depth
    )
)