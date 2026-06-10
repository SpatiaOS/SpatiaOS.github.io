import cadquery as cq

# Parameters
# Overall dimensions
fin_length = 22.0
fin_max_width = 11.0
fin_thickness = 1.5

# Hub parameters
hub_radius = 6.0
hub_interface_x = 2.0 # X coordinate where fin meets hub
hub_center_x = hub_interface_x - hub_radius # Center of the circular part
hub_thickness = 4.0 # Hub is thicker than fin

# Hole parameters
top_hole_dia = 2.5
top_hole_cs_dia = 4.5
top_hole_cs_angle = 90 # 45 degree chamfer (90 included angle)
num_top_holes = 5
top_hole_spacing = 2.5
top_hole_start_x = 5.0
top_hole_y = 4.0 # Y position of top holes

bottom_hole_x = 10.0
bottom_hole_y = -3.5
bottom_hole_dia = 2.0

tip_hole_x = 21.0
tip_hole_y = 0.0
tip_hole_dia = 2.0

bearing_hole_dia = 4.0
bearing_boss_dia = 8.0

ring_wire_dia = 0.8
ring_outer_radius = 2.5

# Chamfer
edge_chamfer = 0.3

# 1. Fin Plate Profile
# Defined in XY plane.
# Starts at top-left (hub interface), goes right, tapers to tip, returns left, curves up (cutout), closes.
fin_profile = (
    cq.Workplane("XY")
    .moveTo(hub_interface_x, 4.5) # Top left
    .lineTo(12.0, 4.5) # Top edge
    .lineTo(21.0, 1.0) # Top taper
    .lineTo(fin_length, 0.0) # Tip
    .lineTo(21.0, -1.0) # Bottom taper
    .lineTo(12.0, -3.0) # Bottom edge
    # Concave cutout to clear hub
    # Curve from (12, -3) to (hub_interface_x, -4.5) roughly
    .spline([(6.0, -4.5), (hub_interface_x, -2.5), (hub_interface_x, -4.5)])
    .close()
)

# Extrude Fin
fin_plate = fin_profile.extrude(fin_thickness).translate((0, 0, -fin_thickness/2))

# 2. Hub Profile
# Defined in XY plane.
# D-shape: Semicircle on the left, flat vertical line on the right (interface).
hub_profile = (
    cq.Workplane("XY")
    .moveTo(hub_interface_x, hub_radius)
    .threePointArc((hub_center_x - hub_radius, 0.0), (hub_interface_x, -hub_radius))
    .close()
)

hub_solid = hub_profile.extrude(hub_thickness).translate((0, 0, -hub_thickness/2))

# 3. Central Boss and Bearing
# Boss: Cylinder along Y axis, centered at Hub Center.
boss = (
    cq.Workplane("XZ")
    .center(hub_center_x, 0.0)
    .circle(bearing_boss_dia / 2)
    .extrude(hub_thickness - 0.5, both=True) # Slightly less than hub width
)

# Bearing Hole: Through Y axis.
bearing_hole = (
    cq.Workplane("XZ")
    .center(hub_center_x, 0.0)
    .circle(bearing_hole_dia / 2)
    .extrude(hub_thickness + 2.0, both=True)
)

# 4. Holes in Fin
# Top 5 Countersunk Holes
fin_plate_with_holes = (
    fin_plate
    .faces(">Z")
    .workplane()
    .rarray(top_hole_spacing, 1, num_top_holes, 1)
    .cskHole(top_hole_dia, top_hole_cs_dia, top_hole_cs_angle, depth=fin_thickness)
    .translate((top_hole_start_x, top_hole_y, 0))
)

# Bottom Hole
fin_plate_with_holes = (
    fin_plate_with_holes
    .faces(">Z")
    .workplane()
    .cskHole(bottom_hole_dia, bottom_hole_dia + 1.0, 90, depth=fin_thickness)
    .translate((bottom_hole_x, bottom_hole_y, 0))
)

# Tip Hole
fin_plate_with_holes = (
    fin_plate_with_holes
    .faces(">Z")
    .workplane()
    .cskHole(tip_hole_dia, tip_hole_dia + 1.0, 90, depth=fin_thickness)
    .translate((tip_hole_x, tip_hole_y, 0))
)

# 5. Rings
# Lower Ring (Torus hanging from bottom hole)
# Center at hole position, shifted down by ring radius.
# Normal along Y -> Ring lies in XZ plane.
lower_ring = cq.Solid.makeTorus(
    ring_outer_radius,
    ring_wire_dia / 2,
    (bottom_hole_x, bottom_hole_y, -fin_thickness/2 - ring_outer_radius),
    (0, 1, 0)
)

# Tip Ring (Torus hanging from tip hole)
tip_ring = cq.Solid.makeTorus(
    ring_outer_radius,
    ring_wire_dia / 2,
    (tip_hole_x, tip_hole_y, -fin_thickness/2 - ring_outer_radius),
    (0, 1, 0)
)

# 6. Assembly
# Union Hub and Boss
assembly = hub_solid.union(boss)
# Cut Bearing Hole
assembly = assembly.cut(bearing_hole)
# Union Fin
assembly = assembly.union(fin_plate_with_holes)
# Union Rings
assembly = assembly.union(lower_ring)
assembly = assembly.union(tip_ring)

# 7. Chamfers
# Apply chamfer to top and bottom perimeter edges
assembly = (
    assembly
    .faces(">Z")
    .edges()
    .chamfer(edge_chamfer)
)
assembly = (
    assembly
    .faces("<Z")
    .edges()
    .chamfer(edge_chamfer)
)

result = assembly