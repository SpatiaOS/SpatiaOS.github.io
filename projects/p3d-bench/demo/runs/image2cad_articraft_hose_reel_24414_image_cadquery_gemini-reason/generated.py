import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Reel Dimensions
reel_radius = 160.0
reel_thickness = 10.0
core_radius = 70.0
core_length = 120.0
hose_coil_radius = 140.0
hose_coil_length = 118.0

# Pipe Dimensions
pipe_radius = 8.0
top_pipe_x = -180.0
top_pipe_y = 250.0
top_pipe_z = -core_length/2.0 - reel_thickness # Positioned at the back of the reel

bottom_pipe_start_y = -hose_coil_radius
bottom_pipe_length = 120.0
bottom_pipe_end_y = bottom_pipe_start_y - bottom_pipe_length

# ==========================================
# 1. Reel Assembly
# ==========================================

# Front Flange (positioned at +Z)
front_flange = (
    cq.Workplane("XY", origin=(0, 0, core_length/2.0))
    .circle(reel_radius)
    .extrude(reel_thickness)
)

# Add 4 mounting holes to the front flange
front_flange = (
    front_flange.faces(">Z")
    .workplane()
    .rect(100, 100, forConstruction=True)
    .vertices()
    .hole(12)
)

# Back Flange (positioned at -Z)
back_flange = (
    cq.Workplane("XY", origin=(0, 0, -core_length/2.0 - reel_thickness))
    .circle(reel_radius)
    .extrude(reel_thickness)
)

# Central Core connecting the flanges
core = (
    cq.Workplane("XY", origin=(0, 0, -core_length/2.0))
    .circle(core_radius)
    .extrude(core_length)
)

# Coiled Hose (represented as a simplified solid cylinder)
coiled_hose = (
    cq.Workplane("XY", origin=(0, 0, -hose_coil_length/2.0))
    .circle(hose_coil_radius)
    .extrude(hose_coil_length)
)

# Combine reel components
reel = front_flange.union(back_flange).union(core).union(coiled_hose)

# ==========================================
# 2. Top Pipe
# ==========================================

# Define the path for the top pipe using explicit arcs for smooth corners
R = 50.0

# Arc 1: Drops down and turns left
a1_start = (0, -150 + R)
a1_end = (-R, -150)
a1_mid = (-R + R * math.cos(math.radians(45)), -150 + R - R * math.sin(math.radians(45)))

# Arc 2: Turns from left to straight up
a2_start = (top_pipe_x + R, -150)
a2_end = (top_pipe_x, -150 + R)
a2_mid = (top_pipe_x + R - R * math.cos(math.radians(45)), -150 + R - R * math.sin(math.radians(45)))

top_pipe_path = (
    cq.Workplane("XY", origin=(0, 0, top_pipe_z))
    .moveTo(0, 0)
    .lineTo(a1_start[0], a1_start[1])
    .threePointArc(a1_mid, a1_end)
    .lineTo(a2_start[0], a2_start[1])
    .threePointArc(a2_mid, a2_end)
    .lineTo(top_pipe_x, top_pipe_y)
)

# Sweep a circle along the path to create the pipe
top_pipe = (
    cq.Workplane("XZ", origin=(0, 0, top_pipe_z))
    .circle(pipe_radius)
    .sweep(top_pipe_path)
)

# Connection fitting where the pipe enters the reel
top_pipe_conn = (
    cq.Workplane("XZ", origin=(0, 0, top_pipe_z))
    .circle(14)
    .extrude(-20) # Extrude downwards along -Y
)

# ==========================================
# 3. Top Fitting (Valve/Quick-Connect)
# ==========================================

# Build the fitting at the origin, then translate it into position
tf_base = cq.Workplane("XZ").circle(14).extrude(20)
tf_hex = cq.Workplane("XZ", origin=(0, 20, 0)).polygon(6, 30).extrude(10)

# Side port pointing forward (+Z direction)
tf_port_body = (
    cq.Workplane("XY", origin=(0, 10, 0)).circle(10).extrude(20)
    .union(cq.Workplane("XY", origin=(0, 10, 20)).circle(12).extrude(5))
)
# Hollow out the side port
tf_port = tf_port_body.faces(">Z").workplane().circle(6).cutBlind(-15)

top_fitting = tf_base.union(tf_hex).union(tf_port)

# Move the completed fitting to the top end of the pipe
top_fitting = top_fitting.translate((top_pipe_x, top_pipe_y, top_pipe_z))

# ==========================================
# 4. Bottom Pipe
# ==========================================

# Straight pipe dropping from the bottom of the coiled hose
bottom_pipe = (
    cq.Workplane("XZ", origin=(0, bottom_pipe_start_y, 0))
    .circle(pipe_radius)
    .extrude(-bottom_pipe_length)
)

# Connection collar at the hose coil
bottom_pipe_conn = (
    cq.Workplane("XZ", origin=(0, bottom_pipe_start_y + 10, 0))
    .circle(14)
    .extrude(-20)
)

# ==========================================
# 5. Bottom Valve & Nozzle
# ==========================================

# Build the valve assembly at the origin
bv_body = cq.Workplane("XZ").sphere(18)
bv_top = cq.Workplane("XZ", origin=(0, 0, 0)).workplane(offset=10).circle(12).extrude(15)
bv_nozzle_base = cq.Workplane("XZ", origin=(0, 0, 0)).workplane(offset=-10).circle(12).extrude(-10)

# Lofted cone for the nozzle shape
bv_nozzle_cone = (
    cq.Workplane("XZ", origin=(0, 0, 0))
    .workplane(offset=-20).circle(12)
    .workplane(offset=-20).circle(6)
    .loft()
)
bv_nozzle_tip = cq.Workplane("XZ", origin=(0, 0, 0)).workplane(offset=-40).circle(6).extrude(-5)

# Valve operating handle
bv_stem = cq.Workplane("XY", origin=(0, 0, 0)).circle(6).extrude(20)
bv_handle = cq.Workplane("XY", origin=(0, 0, 20)).box(60, 8, 4).translate((-25, 0, 0))

bottom_valve = (
    bv_body
    .union(bv_top)
    .union(bv_nozzle_base)
    .union(bv_nozzle_cone)
    .union(bv_nozzle_tip)
    .union(bv_stem)
    .union(bv_handle)
)

# Translate the valve so its top connects to the end of the bottom pipe
bv_y_pos = bottom_pipe_end_y - 25
bottom_valve = bottom_valve.translate((0, bv_y_pos, 0))

# ==========================================
# Final Assembly
# ==========================================

# Combine all components into a single solid model
result = (
    reel
    .union(top_pipe)
    .union(top_pipe_conn)
    .union(top_fitting)
    .union(bottom_pipe)
    .union(bottom_pipe_conn)
    .union(bottom_valve)
)