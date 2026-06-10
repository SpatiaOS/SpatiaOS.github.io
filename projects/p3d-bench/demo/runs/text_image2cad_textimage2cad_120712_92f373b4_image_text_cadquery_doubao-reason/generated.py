import cadquery as cq

# ----------------------------
# Parameters
# ----------------------------
# Base Cover (part 4607dfae)
base_length = 303.9    # X-axis dimension
base_width = 159.5     # Y-axis dimension
base_height = 72.0     # Z-axis height
base_boss_radius = 6.0
base_boss_height = 8.0
base_boss_offset = 45.0  # Offset of 4 locating bosses from center

# Cover Plate (part 468e7438)
plate_length = 241.82
plate_width = 126.86
plate_thickness = 6.0

# Housing Cover (part 461c9fae)
housing_length = 227.4
housing_width = 119.7
housing_height = 50.0
housing_recess_depth = 2.0
housing_recess_length = 120.0
housing_recess_width = 70.0
button_radius = 4.0
button_height = 0.8
dot_radius = 1.5

# ----------------------------
# Base Cover Construction
# ----------------------------
base_cover = (
    cq.Workplane("XY")
    # Bottom flat base ellipse
    .ellipse(base_length/2, base_width/2)
    # Top flat deck ellipse (matches cover plate footprint)
    .workplane(offset=base_height)
    .ellipse(plate_length/2, plate_width/2)
    # Loft to create curved pebble side walls
    .loft()
    # Add 4 cylindrical locating bosses on top deck
    .faces(">Z")
    .workplane()
    .pushPoints([
        (base_boss_offset, base_boss_offset),
        (base_boss_offset, -base_boss_offset),
        (-base_boss_offset, base_boss_offset),
        (-base_boss_offset, -base_boss_offset)
    ])
    .circle(base_boss_radius)
    .extrude(base_boss_height)
)

# ----------------------------
# Cover Plate Construction
# ----------------------------
cover_plate = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .ellipse(plate_length/2, plate_width/2)
    .extrude(plate_thickness)
)

# ----------------------------
# Housing Cover Construction
# ----------------------------
housing_cover = (
    cq.Workplane("XY")
    # Bottom ellipse (sits on cover plate)
    .workplane(offset=base_height + plate_thickness)
    .ellipse(housing_length/2, housing_width/2)
    # Top flat deck ellipse (slightly smaller for curved dome shape)
    .workplane(offset=housing_height)
    .ellipse(housing_length*0.9/2, housing_width*0.9/2)
    # Loft to create smooth freeform walls
    .loft()
    # Cut recessed control panel on top face
    .faces(">Z")
    .workplane()
    .ellipse(housing_recess_length/2, housing_recess_width/2)
    .cutBlind(-housing_recess_depth)
    # Add 5 small dot status indicators inside recess
    .faces("<Z[1]")
    .workplane()
    .pushPoints([(-40, 0), (-30, 0), (-20, 0), (-10, 0), (0, 0)])
    .circle(dot_radius)
    .extrude(button_height)
    # Add embossed control buttons (simplified cylindrical features)
    .pushPoints([(10, 15), (10, 0), (10, -15), (25, 0), (25, 15)])
    .circle(button_radius)
    .extrude(button_height)
)

# ----------------------------
# Combine all parts into unified assembly
# ----------------------------
result = base_cover.union(cover_plate).union(housing_cover)