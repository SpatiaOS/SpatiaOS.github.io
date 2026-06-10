import cadquery as cq

# Parameters
plate_thickness = 1.5
head_half_thickness = 2.5
hole_radius = 0.5
chamfer_plate = 0.15
chamfer_head = 0.5
split_line_chamfer = 0.1
ring_major_radius = 1.2
ring_wire_radius = 0.15

# 1. Head Profile (Hub Cap)
# Modeled as a multi-faceted bulbous shape with explicit lines and fillets for robust chamfering
half_head = (
    cq.Workplane("XY")
    .moveTo(0.5, 4.5)
    .lineTo(0.5, 6.5)
    .lineTo(2.5, 8.5)
    .lineTo(5.0, 8.5)
    .lineTo(7.0, 7.0)
    .lineTo(7.5, 5.0)
    .lineTo(5.5, 2.5)
    .lineTo(2.5, 2.5)
    .close()
    .extrude(head_half_thickness)
    .edges("|Z").fillet(0.8)
    .edges(">Z").chamfer(chamfer_head)
    .edges("<Z").chamfer(split_line_chamfer)
)

# Eye feature on the head (raised boss with dimple and central bearing)
eye_center = (4.0, 5.5)
eye_boss = (
    cq.Workplane("XY", origin=(eye_center[0], eye_center[1], head_half_thickness))
    .circle(1.5)
    .extrude(0.5)
    .edges(">Z").chamfer(0.2)
)
eye_hole = (
    cq.Workplane("XY", origin=(eye_center[0], eye_center[1], head_half_thickness + 0.5))
    .circle(0.8)
    .extrude(-0.4)
)
inner_cyl = (
    cq.Workplane("XY", origin=(eye_center[0], eye_center[1], head_half_thickness + 0.1))
    .circle(0.4)
    .extrude(0.3)
)

# Combine head half features
half_head = half_head.union(eye_boss).cut(eye_hole).union(inner_cyl)

# Mirror to create full symmetrical head
head = half_head.union(half_head.mirror("XY"))

# 2. Fin Plate
# Modeled with lines and fillets rather than a B-spline to ensure the subsequent chamfering succeeds
plate = (
    cq.Workplane("XY", origin=(0, 0, -plate_thickness / 2))
    .moveTo(4.0, 5.5)
    .lineTo(6.0, 8.5)
    .lineTo(10.0, 10.5)
    .lineTo(16.0, 9.5)
    .lineTo(22.5, 6.0)
    .lineTo(17.0, 2.0)
    .lineTo(12.0, 1.0)
    .lineTo(6.0, 3.5)
    .close()
    .extrude(plate_thickness)
    .edges("|Z").fillet(1.0)
)

# Add holes to plate (4 on ridge, 1 at tail, 1 at belly)
hole_pts = [
    (9.5, 8.8),
    (11.5, 8.6),
    (13.5, 8.4),
    (15.5, 8.2),
    (19.5, 6.0),  # tail hole
    (14.0, 2.5)   # belly hole
]

holes_wp = cq.Workplane("XY", origin=(0, 0, plate_thickness))
plate = plate.cut(
    holes_wp.pushPoints(hole_pts).circle(hole_radius).extrude(-plate_thickness * 2)
)

# Chamfer plate edges (creates the conical transitions on both outer profile and bores)
plate = plate.edges(">Z or <Z").chamfer(chamfer_plate)

# 3. Rings (Toroidal wire rings)
# Positioned to hang naturally through the tail and belly holes
# Using cq.Solid.makeTorus to avoid Workplane method errors
ring1_solid = cq.Solid.makeTorus(ring_major_radius, ring_wire_radius, cq.Vector(19.5, 5.0, 0), cq.Vector(1, 0, 0))
ring2_solid = cq.Solid.makeTorus(ring_major_radius, ring_wire_radius, cq.Vector(14.0, 1.5, 0), cq.Vector(1, 0, 0))

# 4. Final Assembly
result = head.union(plate).union(ring1_solid).union(ring2_solid)