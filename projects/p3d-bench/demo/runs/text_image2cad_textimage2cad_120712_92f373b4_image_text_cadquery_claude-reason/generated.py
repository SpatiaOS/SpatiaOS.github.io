import cadquery as cq

# Parameters
base_length = 303.9
base_width = 159.5
base_height = 72.0
base_wall_thickness = 3.0
base_rim_height = 8.0

housing_length = 227.4
housing_width = 119.7
housing_height = 50.0
housing_wall_thickness = 2.5

plate_length = 241.82
plate_width = 126.86
plate_thickness = 6.0

boss_radius = 6.0
boss_height = 3.0

panel_length = 80.0
panel_width = 50.0
panel_depth = 1.5
panel_offset_x = -30.0
panel_offset_y = 10.0

dot_radius = 2.0
dot_depth = 0.8

# Base cover - lower dome with flat top deck
base_profile_points = [
    (0, 0),
    (base_width/2 - 20, 0),
    (base_width/2 - 5, base_rim_height),
    (base_width/2, base_rim_height + 10),
    (base_width/2, base_height - 15),
    (base_width/2 - 10, base_height),
    (0, base_height)
]

base_cover = (
    cq.Workplane("XZ")
    .center(-base_length/2, 0)
    .spline(base_profile_points)
    .line(0, -base_height)
    .close()
    .revolve(180, (0, 0, 0), (1, 0, 0))
    .faces(">Y").workplane()
    .center(base_length/2, 0)
    .spline([(x, -y) for x, y in base_profile_points])
    .line(0, base_height)
    .close()
    .revolve(180, (0, 0, 0), (1, 0, 0))
)

base_cover = (
    base_cover
    .faces(">Z").workplane()
    .rect(base_length - 40, base_width - 40)
    .extrude(0.1)
)

# Small circular boss on top deck
base_cover = (
    base_cover
    .faces(">Z").workplane()
    .center(panel_offset_x, panel_offset_y)
    .circle(boss_radius)
    .extrude(boss_height)
)

# Housing cover - upper dome with control panel
housing_profile_points = [
    (0, 0),
    (housing_width/2 - 15, 0),
    (housing_width/2 - 3, 5),
    (housing_width/2, 8),
    (housing_width/2, housing_height - 12),
    (housing_width/2 - 8, housing_height),
    (0, housing_height)
]

housing_cover = (
    cq.Workplane("XZ")
    .center(-housing_length/2, base_height + plate_thickness)
    .spline(housing_profile_points)
    .line(0, -housing_height)
    .close()
    .revolve(180, (0, 0, 0), (1, 0, 0))
    .faces(">Y").workplane()
    .center(housing_length/2, base_height + plate_thickness)
    .spline([(x, -y) for x, y in housing_profile_points])
    .line(0, housing_height)
    .close()
    .revolve(180, (0, 0, 0), (1, 0, 0))
)

# Oval recessed panel on top
housing_cover = (
    housing_cover
    .faces(">Z").workplane()
    .center(panel_offset_x, panel_offset_y)
    .ellipse(panel_length/2, panel_width/2)
    .cutBlind(-panel_depth)
)

# Five dot features in cross pattern
dot_positions = [
    (0, 0),
    (-15, 0),
    (15, 0),
    (0, -12),
    (0, 12)
]

for dx, dy in dot_positions:
    housing_cover = (
        housing_cover
        .faces(">Z").workplane()
        .center(panel_offset_x + dx, panel_offset_y + dy)
        .circle(dot_radius)
        .cutBlind(-dot_depth)
    )

# Cover plate - thin oval disc at seam
cover_plate = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .ellipse(plate_length/2, plate_width/2)
    .extrude(plate_thickness)
)

# Combine all parts into unified assembly
result = base_cover.union(cover_plate).union(housing_cover)