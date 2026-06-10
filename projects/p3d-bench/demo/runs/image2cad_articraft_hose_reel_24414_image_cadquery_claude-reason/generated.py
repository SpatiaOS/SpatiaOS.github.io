import cadquery as cq
import math

# =============================================
# Wall-Mounted Hose Reel Assembly
# =============================================
# Coordinate system: Z = up, Y = reel axis (toward wall), X = horizontal

# === Spool Parameters ===
flange_radius = 150.0           # Radius of the side flanges (discs)
flange_thickness = 4.0          # Thickness of each flange
drum_radius = 55.0              # Central drum outer radius
bore_radius = 18.0              # Central bore/axle radius
spool_width = 120.0             # Distance between inner flange faces

# === Hose Coil Parameters ===
hose_diameter = 13.0            # Hose outer diameter
num_coils = 8                   # Number of visible hose wraps
coil_center_radius = drum_radius + hose_diameter * 0.65  # Center of hose cross-section

# === Vent Hole Parameters ===
vent_hole_diameter = 10.0
vent_pitch_radius = 80.0       # Radius of vent hole circle pattern

# === Mounting Arm (Vertical Supply Pipe) ===
pipe_radius = 10.0              # Outer radius of supply pipe
pipe_x_position = -160.0        # X offset of pipe (to the left of reel)
arm_top_z = 270.0               # Z position of arm top
arm_bottom_z = -250.0           # Z position of arm bottom

# === Top Swivel Connector ===
connector_radius = 15.0         # Swivel body radius
connector_height = 15.0         # Swivel body height
hex_across_corners = 30.0       # Hex nut size (across corners ~26mm across flats)
hex_height = 10.0

# === Bottom Nozzle ===
nozzle_body_radius = 10.0
nozzle_body_height = 20.0
nozzle_tip_top_radius = 10.0
nozzle_tip_bottom_radius = 5.0
nozzle_tip_height = 30.0
handle_radius = 3.0
handle_length = 40.0

# =============================================
# 1. BUILD SPOOL ASSEMBLY
# =============================================
# XZ workplane has normal along +Y, so extrude() goes in +Y direction

# Back flange (near wall, at +Y side)
back_flange = (
    cq.Workplane("XZ")
    .circle(flange_radius)
    .circle(bore_radius)
    .extrude(flange_thickness)
    .translate((0, spool_width / 2, 0))
)

# Front flange (facing viewer, at -Y side)
# Build at origin first, add vent holes, then translate
front_flange = (
    cq.Workplane("XZ")
    .circle(flange_radius)
    .circle(bore_radius)
    .extrude(flange_thickness)
)

# Cut decorative vent holes in front flange
vent_points = [
    (vent_pitch_radius * math.cos(math.radians(72 * i + 36)),
     vent_pitch_radius * math.sin(math.radians(72 * i + 36)))
    for i in range(5)
]
front_flange = (
    front_flange
    .faces(">Y").workplane()
    .pushPoints(vent_points)
    .hole(vent_hole_diameter, flange_thickness)
)
front_flange = front_flange.translate(
    (0, -(spool_width / 2 + flange_thickness), 0)
)

# Central drum (annular cylinder between flanges)
drum = (
    cq.Workplane("XZ")
    .circle(drum_radius)
    .circle(bore_radius)
    .extrude(spool_width)
    .translate((0, -spool_width / 2, 0))
)

# Axle through center
axle_length = spool_width + 2 * flange_thickness + 10
axle = (
    cq.Workplane("XZ")
    .circle(bore_radius)
    .extrude(axle_length)
    .translate((0, -axle_length / 2, 0))
)

# Combine spool components
model = back_flange.union(front_flange).union(drum).union(axle)

# =============================================
# 2. HOSE COILS (simplified as annular rings)
# =============================================
for i in range(num_coils):
    y_position = -spool_width / 2 + 3 + i * (hose_diameter + 0.5)
    if y_position + hose_diameter > spool_width / 2 - 2:
        break
    outer_r = coil_center_radius + hose_diameter / 2
    inner_r = coil_center_radius - hose_diameter / 2
    coil_ring = (
        cq.Workplane("XZ")
        .circle(outer_r)
        .circle(inner_r)
        .extrude(hose_diameter * 0.9)
        .translate((0, y_position, 0))
    )
    model = model.union(coil_ring)

# =============================================
# 3. VERTICAL MOUNTING ARM (supply pipe)
# =============================================
arm_total_height = arm_top_z - arm_bottom_z
vertical_arm = (
    cq.Workplane("XY")
    .circle(pipe_radius)
    .extrude(arm_total_height)
    .translate((pipe_x_position, 0, arm_bottom_z))
)
model = model.union(vertical_arm)

# =============================================
# 4. HOSE CONNECTION (reel to arm pipe)
# =============================================
# Horizontal pipe segment connecting reel coils to the vertical arm
connect_z = flange_radius * 0.45  # Height of connection on reel
connect_length = abs(pipe_x_position) - coil_center_radius - hose_diameter
hose_connection = (
    cq.Workplane("YZ")
    .circle(hose_diameter / 2)
    .extrude(connect_length)
    .translate((pipe_x_position + pipe_radius, -hose_diameter / 4, connect_z))
)
model = model.union(hose_connection)

# Lower hose section hanging from reel down toward nozzle
lower_hose_start_z = -(flange_radius * 0.5)
lower_hose_end_z = arm_bottom_z + 30
lower_connect_length = abs(pipe_x_position) - coil_center_radius - hose_diameter
lower_hose_h = (
    cq.Workplane("YZ")
    .circle(hose_diameter / 2)
    .extrude(lower_connect_length * 0.6)
    .translate((pipe_x_position + pipe_radius, -hose_diameter / 4, lower_hose_start_z))
)
model = model.union(lower_hose_h)

# =============================================
# 5. TOP SWIVEL CONNECTOR
# =============================================
# Cylindrical swivel body
swivel_body = (
    cq.Workplane("XY")
    .circle(connector_radius)
    .extrude(connector_height)
    .translate((pipe_x_position, 0, arm_top_z))
)

# Hexagonal nut on top
hex_nut = (
    cq.Workplane("XY")
    .polygon(6, hex_across_corners)
    .extrude(hex_height)
    .translate((pipe_x_position, 0, arm_top_z + connector_height))
)

# Small pipe stub on top (wall connection)
wall_stub = (
    cq.Workplane("XY")
    .circle(pipe_radius * 0.8)
    .extrude(8)
    .translate((pipe_x_position, 0, arm_top_z + connector_height + hex_height))
)

model = model.union(swivel_body).union(hex_nut).union(wall_stub)

# =============================================
# 6. BOTTOM NOZZLE AND VALVE ASSEMBLY
# =============================================
# Nozzle body cylinder
nozzle_body = (
    cq.Workplane("XY")
    .circle(nozzle_body_radius)
    .extrude(nozzle_body_height)
    .translate((pipe_x_position, 0, arm_bottom_z - nozzle_body_height))
)

# Tapered nozzle tip (loft from larger to smaller circle)
nozzle_tip = (
    cq.Workplane("XY")
    .circle(nozzle_tip_top_radius)
    .workplane(offset=nozzle_tip_height)
    .circle(nozzle_tip_bottom_radius)
    .loft()
    .translate((pipe_x_position, 0,
                arm_bottom_z - nozzle_body_height - nozzle_tip_height))
)

# Valve handle (horizontal T-bar extending in X direction)
valve_z = arm_bottom_z - 8
valve_handle = (
    cq.Workplane("YZ")
    .circle(handle_radius)
    .extrude(handle_length)
    .translate((pipe_x_position - handle_length / 2, 0, valve_z))
)

# Valve handle knob at the end
handle_knob = (
    cq.Workplane("XY")
    .circle(handle_radius * 2)
    .extrude(handle_radius * 3)
    .translate((pipe_x_position - handle_length / 2 - handle_radius,
                -handle_radius * 1.5, valve_z - handle_radius))
)

model = model.union(nozzle_body).union(nozzle_tip)
model = model.union(valve_handle).union(handle_knob)

# =============================================
# 7. MOUNTING BRACKET COLLAR
# =============================================
# Small collar where the arm meets the reel axle area
bracket_collar = (
    cq.Workplane("XY")
    .circle(pipe_radius + 5)
    .circle(pipe_radius)
    .extrude(12)
    .translate((pipe_x_position, 0, -6))
)
model = model.union(bracket_collar)

result = model