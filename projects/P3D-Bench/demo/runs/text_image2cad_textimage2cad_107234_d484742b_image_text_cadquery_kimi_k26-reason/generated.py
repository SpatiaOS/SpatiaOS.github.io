import cadquery as cq

# --- Parameters ---
fin_length = 21.85
fin_thickness = 1.5
hole_diameter = 1.5
edge_chamfer = 0.15

hub_radius = 3.5
boss_radius = 1.2
boss_length = 2.0

ring_major_r = 1.0
ring_minor_r = 0.25

# --- Fin Plate ---
fin_pts = [
    (0.0, 2.5),
    (4.0, 4.8),
    (9.0, 5.5),
    (14.0, 4.8),
    (fin_length, 0.0),
    (14.0, -2.0),
    (7.0, -3.5),
    (2.0, -1.2),
    (0.0, -2.0),
]

fin = (
    cq.Workplane("XY")
    .moveTo(fin_pts[0][0], fin_pts[0][1])
    .spline(fin_pts[1:])
    .close()
    .extrude(fin_thickness)
    .translate((0, 0, -fin_thickness / 2))
)

# Holes: five along top ridge + one near lower body
top_hole_centers = [(7.0, 5.0), (9.5, 5.3), (12.0, 5.2), (14.5, 4.6), (17.0, 3.2)]
lower_hole_center = (8.0, -2.5)
all_hole_centers = top_hole_centers + [lower_hole_center]

fin = (
    fin.faces(">Z")
    .workplane()
    .pushPoints(all_hole_centers)
    .hole(hole_diameter)
)

# 45-degree chamfer on all edges (creates conical faces)
fin = fin.edges().chamfer(edge_chamfer)

# --- Hub Shells (rounded cap at blunt end, split into top/bottom halves) ---
hub_sphere = cq.Workplane("XY").sphere(hub_radius).translate((-hub_radius * 0.4, 0, 0))

left_box = cq.Workplane("XY").box(40, 40, 40).translate((-20, 0, 0))
top_box = cq.Workplane("XY").box(40, 40, 40).translate((0, 0, 20))
bottom_box = cq.Workplane("XY").box(40, 40, 40).translate((0, 0, -20))

hub_left = hub_sphere.intersect(left_box)

shell_top = hub_left.intersect(top_box).translate((0, 0, fin_thickness / 2))
shell_bottom = hub_left.intersect(bottom_box).translate((0, 0, -fin_thickness / 2))

# --- Central Cylindrical Boss ---
boss = (
    cq.Workplane("XY")
    .circle(boss_radius)
    .extrude(fin_thickness + boss_length)
    .translate((-1.5, 0, -(fin_thickness + boss_length) / 2))
)

# --- Wire Rings (toroidal) ---
# Profile drawn in XY plane and revolved around X-axis to form a proper torus
tip_ring = (
    cq.Workplane("XY")
    .moveTo(0, ring_major_r)
    .circle(ring_minor_r)
    .revolve(360, (0, 0, 0), (1, 0, 0))
    .translate((fin_length, 0, -fin_thickness / 2 - ring_minor_r))
)

lower_ring = (
    cq.Workplane("XY")
    .moveTo(0, ring_major_r)
    .circle(ring_minor_r)
    .revolve(360, (0, 0, 0), (1, 0, 0))
    .translate((8.0, -2.5, -fin_thickness / 2 - ring_minor_r))
)

# --- Assembly ---
result = (
    fin
    .union(shell_top)
    .union(shell_bottom)
    .union(boss)
    .union(tip_ring)
    .union(lower_ring)
)