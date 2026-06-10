import cadquery as cq
import math

# =============================================================================
# PARAMETERS
# =============================================================================

# Heat sink
HEAT_SINK_DIAMETER = 200.0
HEAT_SINK_BASE_THICKNESS = 8.0
FIN_COUNT = 50
FIN_HEIGHT = 22.0
FIN_THICKNESS = 1.5
FIN_INNER_RADIUS = 35.0

# Central hub (driver housing)
HUB_DIAMETER = 65.0
HUB_HEIGHT = 45.0

# Mounting arm
ARM_DIAMETER = 18.0
ARM_LENGTH = 130.0
ARM_ANGLE = 32.0          # degrees above horizontal
ARM_OFFSET_Z = 22.0       # height on hub where arm exits

# Joint / coupling nut
JOINT_WIDTH = 28.0
JOINT_LENGTH = 22.0
JOINT_HEIGHT = 22.0

# Mounting plate / canopy (shallow dome)
PLATE_DIAMETER = 145.0
PLATE_DEPTH = 30.0

# Wires
WIRE_DIAMETER = 1.5


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def cylinder_between(p1, p2, diameter):
    """Return a cylinder stretching from p1 to p2 with the given diameter."""
    x1, y1, z1 = p1
    x2, y2, z2 = p2
    dx = x2 - x1
    dy = y2 - y1
    dz = z2 - z1
    length = math.sqrt(dx * dx + dy * dy + dz * dz)

    # Build along Z then rotate into place
    cyl = cq.Workplane("XY").circle(diameter / 2.0).extrude(length)

    # Rotation from +Z toward (dx, dy, dz)
    dot = dz
    cross_x = -dy
    cross_y = dx
    cross_len = math.sqrt(cross_x ** 2 + cross_y ** 2)

    if cross_len > 1e-6:
        angle = math.degrees(math.atan2(cross_len, dot))
        cyl = cyl.rotate((0, 0, 0), (cross_x, cross_y, 0), angle)
    elif dot < 0:
        cyl = cyl.rotate((0, 0, 0), (1, 0, 0), 180)

    return cyl.translate((x1, y1, z1))


# =============================================================================
# HEAT SINK BASE & FINS
# =============================================================================

# Solid circular base plate
heat_sink_base = (
    cq.Workplane("XY")
    .circle(HEAT_SINK_DIAMETER / 2.0)
    .extrude(HEAT_SINK_BASE_THICKNESS)
)

# Array of thin radial fins
fin_length = (HEAT_SINK_DIAMETER / 2.0) - FIN_INNER_RADIUS
fin_center_radius = FIN_INNER_RADIUS + fin_length / 2.0
fin_z_center = HEAT_SINK_BASE_THICKNESS + FIN_HEIGHT / 2.0

fins = None
for i in range(FIN_COUNT):
    angle = i * 360.0 / FIN_COUNT
    fin = (
        cq.Workplane("XY")
        .transformed(offset=(fin_center_radius, 0, fin_z_center),
                     rotate=(0, 0, angle))
        .box(fin_length, FIN_THICKNESS, FIN_HEIGHT, centered=True)
    )
    fins = fin if fins is None else fins.union(fin)

heat_sink = heat_sink_base.union(fins)


# =============================================================================
# CENTRAL HUB
# =============================================================================

# Main cylinder
hub = (
    cq.Workplane("XY")
    .circle(HUB_DIAMETER / 2.0)
    .extrude(HUB_HEIGHT)
    .translate((0, 0, HEAT_SINK_BASE_THICKNESS))
)

# Raised rim around top edge
ridge = (
    cq.Workplane("XY")
    .circle(HUB_DIAMETER / 2.0 + 1.5)
    .circle(HUB_DIAMETER / 2.0)
    .extrude(2.0)
    .translate((0, 0, HEAT_SINK_BASE_THICKNESS + HUB_HEIGHT))
)
hub = hub.union(ridge)

# Vent slots on top surface
for angle in (-25, 0, 25):
    slot = (
        cq.Workplane("XY")
        .box(18.0, 2.5, 2.0, centered=True)
        .rotate((0, 0, 0), (0, 0, 1), angle)
        .translate((20, 0, HEAT_SINK_BASE_THICKNESS + HUB_HEIGHT))
    )
    hub = hub.cut(slot)

# Small rectangular cover / sensor detail on top
top_cover = (
    cq.Workplane("XY")
    .box(12, 8, 1.5, centered=True)
    .translate((0, 0, HEAT_SINK_BASE_THICKNESS + HUB_HEIGHT + 1.0))
)
hub = hub.union(top_cover)


# =============================================================================
# MOUNTING ARM & JOINT
# =============================================================================

# Hexagonal coupling block at hub side
joint = (
    cq.Workplane("XY")
    .polygon(6, JOINT_WIDTH)
    .extrude(JOINT_HEIGHT)
    .translate((HUB_DIAMETER / 2.0 + JOINT_LENGTH / 2.0,
                0,
                HEAT_SINK_BASE_THICKNESS + ARM_OFFSET_Z))
)

# Cylindrical arm extruded along the angled direction
arm = (
    cq.Workplane("XY")
    .transformed(offset=(HUB_DIAMETER / 2.0 + JOINT_LENGTH,
                         0,
                         HEAT_SINK_BASE_THICKNESS + ARM_OFFSET_Z),
                 rotate=(0, 90.0 - ARM_ANGLE, 0))
    .circle(ARM_DIAMETER / 2.0)
    .extrude(ARM_LENGTH)
)


# =============================================================================
# MOUNTING PLATE (SHALLOW DOME)
# =============================================================================

# Spherical cap geometry
r = PLATE_DIAMETER / 2.0
h = PLATE_DEPTH
R = (r ** 2 + h ** 2) / (2.0 * h)

plate = (
    cq.Workplane("XY")
    .sphere(R)
    .translate((0, 0, h - R))
)

# Cut away everything below z=0 to leave a shallow cap on the XY plane
cutter = (
    cq.Workplane("XY")
    .box(R * 4, R * 4, R * 2, centered=True)
    .translate((0, 0, -R))
)
plate = plate.cut(cutter)

# Arm end point in global space
arm_rad = math.radians(ARM_ANGLE)
end_x = (HUB_DIAMETER / 2.0 + JOINT_LENGTH) + ARM_LENGTH * math.cos(arm_rad)
end_z = (HEAT_SINK_BASE_THICKNESS + ARM_OFFSET_Z) + ARM_LENGTH * math.sin(arm_rad)

# Orient plate axis with arm and place flat-face center at arm end
plate = (
    plate
    .rotate((0, 0, 0), (0, 1, 0), 90.0 - ARM_ANGLE)
    .translate((end_x, 0, end_z))
)


# =============================================================================
# WIRES / CABLES
# =============================================================================

wire_start_y = 12.0
wire_start = (
    HUB_DIAMETER / 2.0 + 5,
    wire_start_y,
    HEAT_SINK_BASE_THICKNESS + HUB_HEIGHT - 5
)
wire_end = (
    end_x - 25,
    wire_start_y,
    end_z - 25
)

wire1 = cylinder_between(wire_start, wire_end, WIRE_DIAMETER)
wire2 = cylinder_between(
    (wire_start[0], -wire_start_y, wire_start[2]),
    (wire_end[0], -wire_start_y, wire_end[2]),
    WIRE_DIAMETER
)


# =============================================================================
# FINAL ASSEMBLY
# =============================================================================

result = (
    heat_sink
    .union(hub)
    .union(joint)
    .union(arm)
    .union(plate)
    .union(wire1)
    .union(wire2)
)