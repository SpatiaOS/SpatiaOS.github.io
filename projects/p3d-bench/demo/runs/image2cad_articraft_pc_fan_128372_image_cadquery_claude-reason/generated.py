import cadquery as cq
import math

# ===== Parameters for Standard 80mm Cooling Fan =====
frame_size = 80.0           # Square frame dimension (mm)
frame_depth = 25.0          # Total depth of fan assembly (mm)
flange_thickness = 3.0      # Thickness of top/bottom flanges (mm)
corner_fillet = 4.0         # Frame corner rounding radius (mm)

# Circular bore / shroud
bore_radius = 38.0          # Inner radius of circular air passage (mm)
shroud_wall = 1.5           # Shroud wall thickness (mm)

# Mounting holes (standard 80mm fan)
mount_spacing = 71.5        # Mounting hole center-to-center (mm)
mount_hole_dia = 4.3        # M4 clearance hole diameter (mm)
mount_boss_radius = 4.0     # Radius of boss around each mount hole (mm)

# Fan rotor hub
hub_radius = 13.0           # Central motor hub radius (mm)
hub_cap_radius = 18.0       # Wider top cap radius (mm)
hub_height = 16.0           # Hub cylinder height (mm)
hub_cap_height = 4.0        # Top cap dome height (mm)

# Fan blades
num_blades = 7              # Number of fan blades
blade_outer_r = 36.0        # Blade tip radius (mm)
blade_inner_r = 15.0        # Blade root radius (mm)
blade_thickness = 1.5       # Blade wall thickness (mm)
blade_height = 14.0         # Blade span height (mm)
blade_pitch = 30.0          # Blade pitch angle (degrees)

# Support struts
strut_width = 3.5           # Width of support struts (mm)

# ===== Derived Values =====
half_mount = mount_spacing / 2.0
hub_base_z = flange_thickness

mount_pts = [
    (half_mount, half_mount),
    (-half_mount, half_mount),
    (-half_mount, -half_mount),
    (half_mount, -half_mount),
]

# ===== 1. Bottom Flange =====
# Square plate with rounded corners and circular bore cut through
bottom_flange = (
    cq.Workplane("XY")
    .rect(frame_size, frame_size)
    .extrude(flange_thickness)
    .edges("|Z").fillet(corner_fillet)
    .faces(">Z").workplane()
    .circle(bore_radius)
    .cutThruAll()
)

# ===== 2. Top Flange =====
# Mirror of bottom flange at the top of the frame
top_flange = (
    cq.Workplane("XY")
    .workplane(offset=frame_depth - flange_thickness)
    .rect(frame_size, frame_size)
    .extrude(flange_thickness)
    .edges("|Z").fillet(corner_fillet)
    .faces(">Z").workplane()
    .circle(bore_radius)
    .cutThruAll()
)

# ===== 3. Cylindrical Shroud =====
# Thin-walled cylinder connecting top and bottom flanges
shroud = (
    cq.Workplane("XY")
    .circle(bore_radius + shroud_wall)
    .circle(bore_radius)
    .extrude(frame_depth)
)

# ===== 4. Assemble Frame =====
frame = bottom_flange.union(top_flange).union(shroud)

# Add corner mounting posts (cylindrical pillars at each corner)
for cx, cy in mount_pts:
    post = (
        cq.Workplane("XY")
        .center(cx, cy)
        .circle(mount_boss_radius)
        .extrude(frame_depth)
    )
    frame = frame.union(post)

# ===== 5. Cut Mounting Holes =====
frame = (
    frame.faces(">Z").workplane()
    .pushPoints(mount_pts)
    .circle(mount_hole_dia / 2.0)
    .cutThruAll()
)

# ===== 6. Support Struts =====
# Four radial struts at 45-degree intervals connecting shroud to hub area
for idx in range(4):
    ang = idx * 90.0 + 45.0
    mid_r = (hub_radius + bore_radius) / 2.0
    strut_length = bore_radius - hub_radius + 4.0

    strut = (
        cq.Workplane("XY")
        .transformed(rotate=(0, 0, ang))
        .center(mid_r, 0)
        .rect(strut_length, strut_width)
        .extrude(flange_thickness)
    )
    frame = frame.union(strut)

# ===== 7. Hub Assembly =====
# Main hub cylinder rising from the strut platform
hub = (
    cq.Workplane("XY")
    .workplane(offset=hub_base_z)
    .circle(hub_radius)
    .extrude(hub_height)
)

# Wider top cap with filleted edge for dome appearance
hub_cap = (
    cq.Workplane("XY")
    .workplane(offset=hub_base_z + hub_height - hub_cap_height)
    .circle(hub_cap_radius)
    .extrude(hub_cap_height)
    .edges(">Z").fillet(2.0)
)

rotor = hub.union(hub_cap)

# ===== 8. Fan Blades =====
# Each blade is a thin plate tilted at the pitch angle for airflow
blade_mid_z = hub_base_z + hub_height / 2.0
blade_len = blade_outer_r - blade_inner_r
blade_ctr_r = (blade_inner_r + blade_outer_r) / 2.0

for i in range(num_blades):
    angle = i * 360.0 / num_blades

    # Position blade radially, then tilt for pitch
    blade = (
        cq.Workplane("XY")
        .workplane(offset=blade_mid_z)
        .transformed(rotate=(0, 0, angle))       # angular position
        .center(blade_ctr_r, 0)                   # radial position
        .transformed(rotate=(blade_pitch, 0, 0))  # pitch tilt
        .rect(blade_len, blade_height)
        .extrude(blade_thickness)
    )
    rotor = rotor.union(blade)

# ===== 9. Final Assembly =====
result = frame.union(rotor)