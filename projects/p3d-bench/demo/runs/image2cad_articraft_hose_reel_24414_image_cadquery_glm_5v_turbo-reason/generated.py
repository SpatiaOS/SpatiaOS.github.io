import cadquery as cq
import math

# ============================================
# Hose Reel Assembly - Parametric CAD Model
# ============================================

# --- Main Reel Body Parameters ---
flange_diameter = 220.0       # Diameter of the circular end plates
flange_thickness = 12.0       # Thickness of each flange
drum_diameter = 160.0         # Inner diameter of the drum (where hose winds)
drum_width = 170.0            # Width between flanges (internal)
hub_diameter = 40.0           # Central axle/hub diameter
hub_length = drum_width + 2 * flange_thickness  # Total hub length

# --- Mounting Holes (Front Flange) ---
hole_diameter = 10.0          # Diameter of mounting holes
hole_pattern_radius = 70.0    # Radial distance of holes from center
num_holes = 5                 # 5-hole pattern (as seen in image)

# --- Support Structure ---
post_height = 200.0           # Height of vertical support post
post_diameter = 28.0          # Post outer diameter
base_plate_diameter = 50.0    # Base plate diameter
base_plate_thickness = 8.0    # Base plate thickness

# --- Bottom Valve Assembly ---
valve_body_dia = 38.0         # Valve body diameter
valve_body_height = 55.0      # Valve body height
valve_spout_dia = 22.0        # Outlet spout diameter
valve_spout_height = 35.0     # Spout length
handle_length = 45.0          # Valve handle length
handle_thickness = 8.0        # Handle thickness

# --- Inlet Pipe & Fitting ---
inlet_pipe_od = 24.0          # Inlet pipe outer diameter
inlet_pipe_id = 18.0          # Inlet pipe inner diameter
inlet_pipe_height = 280.0     # Vertical height of inlet pipe
inlet_offset_x = 90.0         # Horizontal offset from reel center
fitting_od = 32.0             # Top fitting diameter
fitting_height = 25.0         # Fitting height

# --- Hose Coil Parameters ---
hose_od = 20.0                # Hose outer diameter
num_coils = 14                # Number of visible hose coils
coil_spacing = 22.0           # Center-to-center spacing of coils

# ============================================
# Build the Model
# ============================================

# 1. Create Back Flange (rear circular plate)
back_flange = (
    cq.Workplane("XY")
    .circle(flange_diameter / 2)
    .extrude(flange_thickness)
)

# 2. Create Drum Cylinder (connects the two flanges)
drum_cylinder = (
    cq.Workplane("XY")
    .workplane(offset=flange_thickness)
    .circle(drum_diameter / 2)
    .extrude(drum_width)
)

# 3. Create Front Flange (with mounting holes)
front_flange = (
    cq.Workplane("XY")
    .workplane(offset=flange_thickness + drum_width)
    .circle(flange_diameter / 2)
    .extrude(flange_thickness)
)

# 4. Create Central Hub/Axle
central_hub = (
    cq.Workplane("XY")
    .circle(hub_diameter / 2)
    .extrude(hub_length)
)

# Combine main reel components
reel_body = back_flange.union(drum_cylinder).union(front_flange).union(central_hub)

# 5. Add Mounting Holes to Front Flange
# Pattern: 5 holes arranged asymmetrically (as seen in reference image)
hole_offsets = [
    (0, hole_pattern_radius),                          # Top center
    (-hole_pattern_radius*0.75, hole_pattern_radius*0.65),  # Upper left
    (hole_pattern_radius*0.75, hole_pattern_radius*0.65),   # Upper right  
    (-hole_pattern_radius*0.65, -hole_pattern_radius*0.55), # Lower left
    (hole_pattern_radius*0.65, -hole_pattern_radius*0.55),  # Lower right
]

for hx, hy in hole_offsets:
    reel_body = (
        reel_body
        .faces(">Z")  # Select front face of front flange
        .workplane()
        .move(hx, hy)
        .circle(hole_diameter / 2)
        .cutThruAll()
    )

# 6. Create Vertical Support Post (extends downward from back flange)
support_post = (
    cq.Workplane("XY")
    .workplane(offset=-post_height)  # Extend downward
    .circle(post_diameter / 2)
    .extrude(post_height + flange_thickness)
)

# 7. Create Base Plate (at bottom of post)
base_plate = (
    cq.Workplane("XY")
    .workplane(offset=-post_height - flange_thickness - base_plate_thickness)
    .circle(base_plate_diameter / 2)
    .extrude(base_plate_thickness)
)

reel_body = reel_body.union(support_post).union(base_plate)

# 8. Create Bottom Valve Assembly
valve_center_z = -post_height - flange_thickness - base_plate_thickness

# Valve body (vertical cylinder below post)
valve_body = (
    cq.Workplane("XY")
    .workplane(offset=valve_center_z - valve_body_height)
    .circle(valve_body_dia / 2)
    .extrude(valve_body_height)
)

# Valve outlet spout (tapered nozzle)
valve_spout = (
    cq.Workplane("XY")
    .workplane(offset=valve_center_z - valve_body_height - valve_spout_height)
    .circle(valve_spout_dia / 2)
    .extrude(valve_spout_height)
)

# Valve handle (lever extending horizontally)
valve_handle = (
    cq.Workplane("XZ")
    .transformed(offset=(-handle_length/2, valve_center_z - valve_body_height/2, 0))
    .rect(handle_length, handle_thickness)
    .extrude(12.0)
)

reel_body = reel_body.union(valve_body).union(valve_spout).union(valve_handle)

# 9. Create Inlet Pipe (rises from left side with bend)
# Vertical section of inlet pipe
inlet_vertical = (
    cq.Workplane("XY")
    .transformed(offset=(-inlet_offset_x, 0, 0))
    .circle(inlet_pipe_od / 2)
    .extrude(inlet_pipe_height)
)

# Horizontal elbow section (top of inlet pipe)
inlet_elbow = (
    cq.Workplane("XZ")
    .transformed(offset=(-inlet_offset_x, inlet_pipe_height, 0))
    .circle(inlet_pipe_od / 2)
    .extrude(25.0)
)

# End fitting (hexagonal nut shape approximated as circle with larger dia)
end_fitting = (
    cq.Workplane("XZ")
    .transformed(offset=(-inlet_offset_x - 25, inlet_pipe_height, 0))
    .circle(fitting_od / 2)
    .extrude(fitting_height)
)

reel_body = reel_body.union(inlet_vertical).union(inlet_elbow).union(end_fitting)

# 10. Create Coiled Hose Representation
# Generate multiple torus rings to simulate wound hose
hose_assembly = None
start_radius = hub_diameter / 2 + 8  # Start radius slightly larger than hub
z_start = flange_thickness + 5       # Start Z position inside drum
z_end = flange_thickness + drum_width - 5  # End Z position
z_step = (z_end - z_start) / max(num_coils - 1, 1)

for i in range(num_coils):
    # Calculate current coil radius (increases outward)
    current_radius = start_radius + i * (coil_spacing * 0.15)  # Slight radial growth
    
    # Limit to drum inner radius
    if current_radius > (drum_diameter / 2) - 4:
        current_radius = (drum_diameter / 2) - 4
    
    # Current Z position (stack upward)
    current_z = z_start + i * z_step
    
    # Create torus ring representing one coil turn
    # Using a circle swept along a circular path (approximated as annular ring)
    coil_ring = (
        cq.Workplane("XY")
        .workplane(offset=current_z)
        .circle(current_radius + hose_od/2)
        .circle(current_radius - hose_od/2)
        .extrude(hose_od * 0.9)  # Slightly less than OD to avoid overlap artifacts
    )
    
    if hose_assembly is None:
        hose_assembly = coil_ring
    else:
        hose_assembly = hose_assembly.union(coil_ring)

# Attach hose to main body
if hose_assembly is not None:
    reel_body = reel_body.union(hose_assembly)

# Final result assignment
result = reel_body