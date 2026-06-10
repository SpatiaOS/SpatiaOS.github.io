import cadquery as cq
import math

# Parameters (adjustable for different fan sizes)
frame_side = 120.0       # mm: Side length of the square frame
frame_thickness = 5.0    # mm: Thickness of top/bottom frame plates
mount_hole_dia = 4.0     # mm: Diameter of mounting holes
mount_hole_offset = 10.0 # mm: Distance from frame edge to mounting hole center
hub_dia = 30.0           # mm: Diameter of the central hub
hub_height = 15.0        # mm: Height of the central hub (increased for better proportions)
blade_count = 7          # Number of fan blades
blade_length = 40.0      # mm: Length of each blade (from hub to tip)
support_width = 5.0      # mm: Width of vertical supports
support_depth = 5.0      # mm: Depth of vertical supports
support_height = 20.0    # mm: Height of vertical supports (distance between top/bottom frames)
blade_thickness = 2.0    # mm: Thickness of each blade
central_hole_dia = 45.0  # mm: Diameter of central hole in frames for blade clearance

# 1. Create Top Frame (Z=0 to Z=frame_thickness)
top_frame = (
    cq.Workplane("XY")
    .box(frame_side, frame_side, frame_thickness)
    .faces(">Z").workplane()
    .hole(central_hole_dia)  # Central hole for blade clearance
    .faces("<Z").workplane()  # Bottom face of top frame
    .rect(frame_side - 2*mount_hole_offset, frame_side - 2*mount_hole_offset, forConstruction=True)
    .vertices()
    .hole(mount_hole_dia)  # Mounting holes at corners
)

# 2. Create Bottom Frame (Z=frame_thickness + support_height to Z=frame_thickness + support_height + frame_thickness)
bottom_frame = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, frame_thickness + support_height))
    .box(frame_side, frame_side, frame_thickness)
    .faces(">Z").workplane()
    .hole(central_hole_dia)  # Central hole (matches top frame)
    .faces("<Z").workplane()
    .rect(frame_side - 2*mount_hole_offset, frame_side - 2*mount_hole_offset, forConstruction=True)
    .vertices()
    .hole(mount_hole_dia)  # Mounting holes (matches top frame)
)

# 3. Create Vertical Supports (4 corners, Z=frame_thickness to Z=frame_thickness + support_height)
# Create one support at a corner position
support = (
    cq.Workplane("XY")
    .transformed(offset=(mount_hole_offset, mount_hole_offset, frame_thickness + support_height/2))
    .box(support_width, support_depth, support_height)
)

# Pattern supports around Z-axis (90° intervals)
# Create all four supports by rotating around the center
supports = []
for i in range(4):
    angle = i * 90
    # Calculate position based on angle
    x = (frame_side/2 - mount_hole_offset) * math.cos(math.radians(angle))
    y = (frame_side/2 - mount_hole_offset) * math.sin(math.radians(angle))
    support_i = (
        cq.Workplane("XY")
        .transformed(offset=(x, y, frame_thickness + support_height/2))
        .box(support_width, support_depth, support_height)
    )
    supports.append(support_i)

# 4. Create Central Hub (centered between top/bottom frames)
hub = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, frame_thickness + support_height/2 - hub_height/2))
    .circle(hub_dia/2)
    .extrude(hub_height)
)

# 5. Create Fan Blades using extrusion approach (more reliable than loft)
# Create a single blade profile at mid-height
blade_mid_z = frame_thickness + support_height/2

# Create a workplane for the blade profile
blade_profile = (
    cq.Workplane("XY")
    .transformed(offset=(0, 0, blade_mid_z))
)

# Draw blade profile as a simple shape (approximating the curved blade)
# Start at hub surface, go to tip with a curved shape
blade_path = (
    blade_profile
    .moveTo(hub_dia/2, 0)  # Start at hub surface
    .lineTo(hub_dia/2 + blade_length/3, blade_thickness)  # First curve point
    .lineTo(hub_dia/2 + 2*blade_length/3, -blade_thickness)  # Second curve point
    .lineTo(hub_dia/2 + blade_length, 0)  # End at blade tip
    .close()
)

# Extrude the blade profile to create a 3D blade
blade = blade_path.extrude(blade_thickness)

# Pattern blades around hub (7 blades)
blades = []
for i in range(blade_count):
    angle = i * (360 / blade_count)
    blade_i = blade.rotate((0, 0, 0), (0, 0, 1), angle)
    blades.append(blade_i)

# 6. Combine All Components
# Start with top frame and union all components
result = top_frame

# Union bottom frame
result = result.union(bottom_frame)

# Union all supports
for support_i in supports:
    result = result.union(support_i)

# Union hub
result = result.union(hub)

# Union all blades
for blade_i in blades:
    result = result.union(blade_i)