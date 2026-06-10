import cadquery as cq
import math

# Parameters
reel_outer_diameter = 240.0
reel_inner_diameter = 160.0
reel_width = 120.0
flange_thickness = 8.0

hose_diameter = 16.0
hose_coils = 6

pipe_diameter = 14.0
pipe_wall_thickness = 2.0

mounting_hole_offset = 60.0
mounting_hole_diameter = 6.0

support_arm_width = 20.0
support_arm_thickness = 6.0

# Position of the vertical supply pipe (left side)
vertical_pipe_x = -140.0

# 1. The Reel Drum and Flanges
# Axis is along Y. Center at (0,0,0).

# Back Flange (Y negative side)
back_flange = (
    cq.Workplane("XZ")
    .circle(reel_outer_diameter / 2)
    .extrude(flange_thickness)
    .translate((0, -reel_width / 2 - flange_thickness, 0))
)

# Drum
drum = (
    cq.Workplane("XZ")
    .circle(reel_inner_diameter / 2)
    .extrude(reel_width)
    .translate((0, -reel_width / 2, 0))
)

# Front Flange (Y positive side)
front_flange_base = (
    cq.Workplane("XZ")
    .circle(reel_outer_diameter / 2)
    .extrude(flange_thickness)
    .translate((0, reel_width / 2, 0))
)

# Mounting holes in Front Flange
front_flange = (
    front_flange_base
    .faces(">Y")
    .workplane()
    .rect(mounting_hole_offset, mounting_hole_offset, forConstruction=True)
    .vertices()
    .hole(mounting_hole_diameter)
)

# Combine Reel Parts
reel_assembly = back_flange.union(drum).union(front_flange)

# 2. The Hose
# Helical sweep around the drum
hose_path = (
    cq.Workplane("XZ")
    .parametricCurve(
        lambda t: (
            (reel_inner_diameter / 2 + hose_diameter / 2 + 2) * math.cos(t * 2 * math.pi * hose_coils),
            -reel_width / 2 + t * reel_width,
            (reel_inner_diameter / 2 + hose_diameter / 2 + 2) * math.sin(t * 2 * math.pi * hose_coils)
        ),
        start=0.05, stop=0.95
    )
)

hose_profile = cq.Workplane("XZ").circle(hose_diameter / 2)
hose = hose_profile.sweep(hose_path, transition='round')

# 3. Support Arm and Vertical Pipe (Left Side)
# Vertical Support Pipe (Tall enough to go below and above reel)
vertical_pipe_total_height = 450
vertical_pipe = (
    cq.Workplane("XZ")
    .circle(pipe_diameter / 2 + pipe_wall_thickness)
    .circle(pipe_diameter / 2)
    .extrude(vertical_pipe_total_height)
    .translate((vertical_pipe_x, 0, -vertical_pipe_total_height/2))
)

# Curved Arm connecting Vertical Pipe to Reel
bracket = (
    cq.Workplane("XZ")
    .moveTo(vertical_pipe_x + 10, 0)
    .lineTo(vertical_pipe_x + 10, -50)
    .threePointArc((-80, -90), (-reel_outer_diameter/2 - 5, -50))
    .lineTo(-reel_outer_diameter/2 - 5, -reel_width/2 - flange_thickness)
    .lineTo(-reel_outer_diameter/2 - 5 - support_arm_thickness, -reel_width/2 - flange_thickness)
    .lineTo(-reel_outer_diameter/2 - 5 - support_arm_thickness, -50)
    .threePointArc((-80 - support_arm_thickness, -90), (vertical_pipe_x + 10 - support_arm_thickness, -50))
    .lineTo(vertical_pipe_x + 10 - support_arm_thickness, 0)
    .close()
    .extrude(support_arm_width)
    .translate((0, -support_arm_width/2, 0))
)

# 4. Top Assembly (Inlet)
top_z_start = vertical_pipe_total_height / 2

# Elbow path: Up then Forward (+Y)
top_path = (
    cq.Workplane("YZ")
    .moveTo(0, top_z_start)
    .lineTo(0, top_z_start + 40)
    .threePointArc((20, top_z_start + 60), (40, top_z_start + 60))
    .lineTo(60, top_z_start + 60)
)

top_pipe_solid = (
    cq.Workplane("YZ")
    .circle(pipe_diameter / 2)
    .sweep(top_path)
    .translate((vertical_pipe_x, 0, 0))
)

# Connector at the end
end_y = 60
end_z = top_z_start + 60

top_connector_body = (
    cq.Workplane("XZ")
    .circle(pipe_diameter / 2 + 4)
    .extrude(15)
    .translate((vertical_pipe_x, end_y + 15, end_z))
)

top_connector_hex = (
    cq.Workplane("XZ")
    .polygon(6, 18)
    .extrude(12)
    .translate((vertical_pipe_x, end_y + 30, end_z))
)

# 5. Bottom Assembly (Outlet)
bottom_pipe_start_z = -reel_outer_diameter / 2
bottom_pipe_length = 150

bottom_pipe = (
    cq.Workplane("XZ")
    .circle(pipe_diameter / 2 + pipe_wall_thickness)
    .circle(pipe_diameter / 2)
    .extrude(bottom_pipe_length)
    .translate((0, 0, bottom_pipe_start_z - bottom_pipe_length))
)

# Valve Body
valve_z = bottom_pipe_start_z - bottom_pipe_length
valve_body = (
    cq.Workplane("XZ")
    .circle(pipe_diameter / 2 + 8)
    .extrude(40)
    .translate((0, 0, valve_z - 40))
)

# Valve Handle
valve_handle = (
    cq.Workplane("XY")
    .box(50, 6, 6)
    .translate((-25, 0, valve_z - 20))
)

valve_stem = (
    cq.Workplane("XZ")
    .circle(4)
    .extrude(10)
    .translate((0, 0, valve_z - 20))
)

# Nozzle
bottom_nozzle = (
    cq.Workplane("XZ")
    .circle(pipe_diameter / 2 + 2)
    .workplane(offset=-30)
    .circle(pipe_diameter / 4)
    .loft()
    .translate((0, 0, valve_z - 40 - 30))
)

# Combine all parts
result = (
    reel_assembly
    .union(hose)
    .union(vertical_pipe)
    .union(bracket)
    .union(top_pipe_solid)
    .union(top_connector_body)
    .union(top_connector_hex)
    .union(bottom_pipe)
    .union(valve_body)
    .union(valve_handle)
    .union(valve_stem)
    .union(bottom_nozzle)
)