import cadquery as cq

# =============================================================================
# Hose Reel Assembly Parameters
# =============================================================================

# --- Main Drum ---
drum_width = 200.0
flange_diameter = 300.0
flange_thickness = 10.0
core_diameter = 140.0

# --- Drum Ribs ---
rib_count = 7
rib_diameter = 158.0
rib_width = 6.0
rib_margin = 15.0

# --- Inlet Pipe (left side, vertical riser) ---
inlet_pipe_diameter = 20.0
inlet_pipe_radius = inlet_pipe_diameter / 2.0
inlet_pipe_x = -(drum_width / 2.0 + 60.0)   # 60 mm left of drum flange
inlet_pipe_z_bottom = -60.0
inlet_pipe_z_top = 200.0
inlet_bend_radius = 60.0

# --- Outlet Assembly (bottom) ---
outlet_pipe_diameter = 20.0
outlet_pipe_radius = outlet_pipe_diameter / 2.0
outlet_z_start = -core_diameter / 2.0
outlet_pipe_length = 60.0
valve_diameter = 32.0
valve_height = 30.0
nozzle_length = 40.0
nozzle_bottom_diameter = 10.0

# --- Mounting Holes (right flange) ---
mount_bolt_circle_radius = 90.0
mount_hole_diameter = 12.0


# =============================================================================
# Modeling
# =============================================================================

# --- Right Flange (wall mount) with 4 bolt holes ---
right_flange = (
    cq.Workplane("YZ")
    .workplane(offset=drum_width / 2.0)
    .circle(flange_diameter / 2.0)
    .extrude(flange_thickness)
    .faces(">X")
    .workplane()
    .polarArray(mount_bolt_circle_radius, 0, 360, 4)
    .circle(mount_hole_diameter / 2.0)
    .cutThruAll()
)

# --- Left Flange ---
left_flange = (
    cq.Workplane("YZ")
    .workplane(offset=-drum_width / 2.0 - flange_thickness)
    .circle(flange_diameter / 2.0)
    .extrude(flange_thickness)
)

# --- Drum Core (central cylinder) ---
drum_core = (
    cq.Workplane("YZ")
    .workplane(offset=-drum_width / 2.0)
    .circle(core_diameter / 2.0)
    .extrude(drum_width)
)

# --- Raised ribs on drum core to guide hose ---
ribs = None
start_x = -drum_width / 2.0 + rib_margin + rib_width / 2.0
end_x = drum_width / 2.0 - rib_margin - rib_width / 2.0
spacing = (end_x - start_x) / (rib_count - 1) if rib_count > 1 else 0.0

for i in range(rib_count):
    x_pos = start_x + i * spacing
    rib = (
        cq.Workplane("YZ")
        .workplane(offset=x_pos - rib_width / 2.0)
        .circle(rib_diameter / 2.0)
        .extrude(rib_width)
    )
    ribs = rib if ribs is None else ribs.union(rib)

# --- Inlet Vertical Pipe ---
inlet_pipe = (
    cq.Workplane("XY")
    .workplane(offset=inlet_pipe_z_bottom)
    .center(inlet_pipe_x, 0)
    .circle(inlet_pipe_radius)
    .extrude(inlet_pipe_z_top - inlet_pipe_z_bottom)
)

# --- Inlet Elbow (90 deg quarter torus) ---
# Revolves a circle profile around a Y-parallel axis to create the bend
# from the drum face center (x=-100, z=0) down to the vertical pipe base (x=-160, z=-60)
elbow_profile = (
    cq.Workplane("XZ")
    .center(-drum_width / 2.0, 0)
    .circle(inlet_pipe_radius)
)
elbow_axis_start = (inlet_pipe_x, 0, 0)
elbow_axis_end = (inlet_pipe_x, 1, 0)
inlet_elbow = elbow_profile.revolve(90, elbow_axis_start, elbow_axis_end)

# --- Inlet Coupling (fitting at base of riser) ---
inlet_coupling = (
    cq.Workplane("XY")
    .workplane(offset=inlet_pipe_z_bottom)
    .center(inlet_pipe_x, 0)
    .circle(16)
    .extrude(12)
)

# --- Top Inlet Valve Body ---
inlet_valve_body = (
    cq.Workplane("XY")
    .workplane(offset=inlet_pipe_z_top)
    .center(inlet_pipe_x, 0)
    .circle(16)
    .extrude(20)
)

# --- Hexagonal Operating Nut ---
inlet_hex_nut = (
    cq.Workplane("XY")
    .workplane(offset=inlet_pipe_z_top + 20)
    .center(inlet_pipe_x, 0)
    .polygon(6, 30)
    .extrude(12)
)

# --- Side Outlet (small drain/pressure port) ---
side_outlet_z = inlet_pipe_z_top + 10.0
side_outlet_length = 22.0
side_outlet = (
    cq.Workplane("XZ")
    .center(inlet_pipe_x, side_outlet_z)
    .circle(6)
    .extrude(side_outlet_length)
)

# --- Hex Nut on Side Outlet ---
side_outlet_hex = (
    cq.Workplane("XZ")
    .workplane(offset=side_outlet_length)
    .center(inlet_pipe_x, side_outlet_z)
    .polygon(6, 14)
    .extrude(6)
)

# --- Outlet Pipe (drops from drum bottom) ---
outlet_pipe = (
    cq.Workplane("XY")
    .workplane(offset=outlet_z_start)
    .circle(outlet_pipe_radius)
    .extrude(-outlet_pipe_length)
)

# --- Outlet Hex Coupling ---
outlet_hex_z = outlet_z_start - outlet_pipe_length
outlet_hex = (
    cq.Workplane("XY")
    .workplane(offset=outlet_hex_z)
    .circle(14)
    .extrude(-10)
)

# --- Valve Body ---
valve_z_center = outlet_hex_z - 10 - valve_height / 2.0
valve_body = (
    cq.Workplane("XY")
    .workplane(offset=valve_z_center - valve_height / 2.0)
    .circle(valve_diameter / 2.0)
    .extrude(valve_height)
)

# --- Valve Handle (lever extending left) ---
handle = (
    cq.Workplane("XY")
    .workplane(offset=valve_z_center)
    .center(-22, 0)
    .box(44, 5, 4, centered=True)
)

# --- Tapered Nozzle ---
nozzle_top_z = valve_z_center - valve_height / 2.0
nozzle = (
    cq.Workplane("XY")
    .workplane(offset=nozzle_top_z)
    .circle(outlet_pipe_radius)
    .workplane(offset=-nozzle_length)
    .circle(nozzle_bottom_diameter / 2.0)
    .loft()
)

# =============================================================================
# Final Assembly
# =============================================================================
result = right_flange.union(left_flange).union(drum_core)

if ribs is not None:
    result = result.union(ribs)

result = (
    result
    .union(inlet_pipe)
    .union(inlet_elbow)
    .union(inlet_coupling)
    .union(inlet_valve_body)
    .union(inlet_hex_nut)
    .union(side_outlet)
    .union(side_outlet_hex)
    .union(outlet_pipe)
    .union(outlet_hex)
    .union(valve_body)
    .union(handle)
    .union(nozzle)
)