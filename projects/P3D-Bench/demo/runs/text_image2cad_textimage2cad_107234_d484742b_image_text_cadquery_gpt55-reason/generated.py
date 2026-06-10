import cadquery as cq

# Parameters
fin_plate_thickness = 1.50
fin_plate_chamfer = 0.12

top_hole_diameter = 1.05
ring_hole_diameter = 0.70

hub_center = (-1.45, -0.10)
hub_bore_radius = 0.43
hub_bore_chamfer_depth = 0.18
hub_bore_chamfer_width = 0.18

cap_shell_thickness = 1.25
cap_shell_overlap = 0.06
cap_shell_chamfer = 0.18
cap_panel_height = 0.20
cap_panel_chamfer = 0.07

hub_boss_radius = 1.18
hub_boss_height = 0.54
hub_boss_chamfer = 0.10
hub_lip_radius = 0.72
hub_lip_height = 0.16
hub_lip_chamfer = 0.04

wire_ring_major_radius = 0.72
wire_ring_wire_radius = 0.10
wire_ring_center_front_offset = 0.12

# Hole layout on the fin plate
top_row_hole_centers = [
    (4.80, 4.42),
    (6.35, 4.52),
    (7.90, 4.58),
    (9.45, 4.60),
    (11.00, 4.62),
]
lower_body_hole_center = (7.30, -3.05)
tip_ring_hole_center = (18.70, 5.34)


# Helper functions
def scale_points(points, scale_center, scale_x, scale_y):
    cx, cy = scale_center
    return [(cx + (x - cx) * scale_x, cy + (y - cy) * scale_y) for x, y in points]


def make_prism_from_points(points, height, z_base):
    return (
        cq.Workplane("XY")
        .moveTo(points[0][0], points[0][1])
        .polyline(points[1:])
        .close()
        .extrude(height)
        .translate((0.0, 0.0, z_base))
    )


def make_cylinder(center, radius, height, z_base):
    return (
        cq.Workplane("XY")
        .center(center[0], center[1])
        .circle(radius)
        .extrude(height)
        .translate((0.0, 0.0, z_base))
    )


def chamfer_top_and_bottom(model, chamfer_distance):
    model = model.faces(">Z").edges().chamfer(chamfer_distance)
    model = model.faces("<Z").edges().chamfer(chamfer_distance)
    return model


def make_wire_ring(center, major_radius, wire_radius, axis=(1.0, 0.0, 0.0)):
    return cq.Workplane("XY").add(
        cq.Solid.makeTorus(
            major_radius,
            wire_radius,
            cq.Vector(center[0], center[1], center[2]),
            cq.Vector(axis[0], axis[1], axis[2]),
        )
    )


# Create the thin freeform fin plate
fin_clearance_top = (-2.05, 2.65)
fin_clearance_bottom = (-2.20, -3.90)
fin_clearance_mid = (1.90, -0.30)

fin_plate = (
    cq.Workplane("XY")
    .moveTo(fin_clearance_top[0], fin_clearance_top[1])
    .spline(
        [
            (-0.65, 4.20),
            (1.40, 5.50),
            (3.70, 6.05),
            (6.80, 5.72),
            (10.80, 5.58),
            (14.80, 5.82),
            (18.95, 6.15),
        ],
        includeCurrent=True,
    )
    .threePointArc((19.70, 5.85), (19.50, 4.95))
    .spline(
        [
            (17.00, 1.30),
            (14.40, -0.65),
            (11.10, -2.45),
            (7.00, -3.85),
            (2.60, -5.05),
            fin_clearance_bottom,
        ],
        includeCurrent=True,
    )
    .threePointArc(fin_clearance_mid, fin_clearance_top)
    .close()
    .extrude(fin_plate_thickness, both=True)
)

# Cut the chamfered lightening and ring holes through the plate
hole_cutter_depth = fin_plate_thickness * 4.0

for hole_center in top_row_hole_centers:
    fin_plate = fin_plate.cut(
        make_cylinder(
            hole_center,
            top_hole_diameter / 2.0,
            hole_cutter_depth,
            -hole_cutter_depth / 2.0,
        )
    )

for hole_center in (lower_body_hole_center, tip_ring_hole_center):
    fin_plate = fin_plate.cut(
        make_cylinder(
            hole_center,
            ring_hole_diameter / 2.0,
            hole_cutter_depth,
            -hole_cutter_depth / 2.0,
        )
    )

fin_plate = chamfer_top_and_bottom(fin_plate, fin_plate_chamfer)

# Faceted cap outline for the mirrored front/back hub half-shells
cap_outline_points = [
    (1.75, 2.45),
    (0.95, 3.50),
    (-0.45, 4.25),
    (-2.15, 4.15),
    (-3.60, 3.25),
    (-4.65, 1.75),
    (-5.05, 0.20),
    (-4.70, -1.65),
    (-3.55, -3.25),
    (-1.85, -4.20),
    (-0.15, -4.05),
    (1.25, -3.05),
    (2.10, -1.45),
    (2.20, 0.55),
]

cap_panel_points = scale_points(cap_outline_points, hub_center, 0.74, 0.74)

front_shell_z_base = fin_plate_thickness / 2.0 - cap_shell_overlap
front_shell_top_z = front_shell_z_base + cap_shell_thickness
back_shell_z_base = -fin_plate_thickness / 2.0 - cap_shell_thickness + cap_shell_overlap
back_shell_bottom_z = back_shell_z_base

front_cap_shell = chamfer_top_and_bottom(
    make_prism_from_points(cap_outline_points, cap_shell_thickness, front_shell_z_base),
    cap_shell_chamfer,
)
back_cap_shell = chamfer_top_and_bottom(
    make_prism_from_points(cap_outline_points, cap_shell_thickness, back_shell_z_base),
    cap_shell_chamfer,
)

# Raised inset panels on both hub shells
front_panel_z_base = front_shell_top_z
front_panel_top_z = front_panel_z_base + cap_panel_height
back_panel_z_base = back_shell_bottom_z - cap_panel_height
back_panel_bottom_z = back_panel_z_base

front_cap_panel = chamfer_top_and_bottom(
    make_prism_from_points(cap_panel_points, cap_panel_height, front_panel_z_base),
    cap_panel_chamfer,
)
back_cap_panel = chamfer_top_and_bottom(
    make_prism_from_points(cap_panel_points, cap_panel_height, back_panel_z_base),
    cap_panel_chamfer,
)

# Central raised bearing boss and smaller lip, mirrored front/back
front_boss_z_base = front_panel_top_z
front_boss_top_z = front_boss_z_base + hub_boss_height
back_boss_z_base = back_panel_bottom_z - hub_boss_height
back_boss_bottom_z = back_boss_z_base

front_hub_boss = chamfer_top_and_bottom(
    make_cylinder(hub_center, hub_boss_radius, hub_boss_height, front_boss_z_base),
    hub_boss_chamfer,
)
back_hub_boss = chamfer_top_and_bottom(
    make_cylinder(hub_center, hub_boss_radius, hub_boss_height, back_boss_z_base),
    hub_boss_chamfer,
)

front_lip_z_base = front_boss_top_z
front_lip_top_z = front_lip_z_base + hub_lip_height
back_lip_z_base = back_boss_bottom_z - hub_lip_height
back_lip_bottom_z = back_lip_z_base

front_hub_lip = chamfer_top_and_bottom(
    make_cylinder(hub_center, hub_lip_radius, hub_lip_height, front_lip_z_base),
    hub_lip_chamfer,
)
back_hub_lip = chamfer_top_and_bottom(
    make_cylinder(hub_center, hub_lip_radius, hub_lip_height, back_lip_z_base),
    hub_lip_chamfer,
)

# Unite the plate and hub-cap geometry before cutting the bearing bore
result = fin_plate
for component in (
    front_cap_shell,
    back_cap_shell,
    front_cap_panel,
    back_cap_panel,
    front_hub_boss,
    back_hub_boss,
    front_hub_lip,
    back_hub_lip,
):
    result = result.union(component)

# Through bore and conical mouth chamfers at the central hub
hub_bore_cutter_depth = front_lip_top_z - back_lip_bottom_z + 2.0
hub_bore_cylinder = make_cylinder(
    hub_center,
    hub_bore_radius,
    hub_bore_cutter_depth,
    -hub_bore_cutter_depth / 2.0,
)

front_hub_bore_chamfer = cq.Workplane("XY").add(
    cq.Solid.makeCone(
        hub_bore_radius,
        hub_bore_radius + hub_bore_chamfer_width,
        hub_bore_chamfer_depth,
        cq.Vector(hub_center[0], hub_center[1], front_lip_top_z - hub_bore_chamfer_depth),
        cq.Vector(0.0, 0.0, 1.0),
    )
)

back_hub_bore_chamfer = cq.Workplane("XY").add(
    cq.Solid.makeCone(
        hub_bore_radius + hub_bore_chamfer_width,
        hub_bore_radius,
        hub_bore_chamfer_depth,
        cq.Vector(hub_center[0], hub_center[1], back_lip_bottom_z),
        cq.Vector(0.0, 0.0, 1.0),
    )
)

result = (
    result.cut(hub_bore_cylinder)
    .cut(front_hub_bore_chamfer)
    .cut(back_hub_bore_chamfer)
)

# Add the two small wire retaining rings protruding from the fin openings
lower_wire_ring_center = (
    lower_body_hole_center[0],
    lower_body_hole_center[1] - wire_ring_major_radius * 0.80,
    fin_plate_thickness / 2.0 + wire_ring_center_front_offset,
)
tip_wire_ring_center = (
    tip_ring_hole_center[0],
    tip_ring_hole_center[1] - wire_ring_major_radius * 0.80,
    fin_plate_thickness / 2.0 + wire_ring_center_front_offset,
)

lower_wire_ring = make_wire_ring(
    lower_wire_ring_center,
    wire_ring_major_radius,
    wire_ring_wire_radius,
)
tip_wire_ring = make_wire_ring(
    tip_wire_ring_center,
    wire_ring_major_radius,
    wire_ring_wire_radius,
)

result = result.union(lower_wire_ring).union(tip_wire_ring).clean()