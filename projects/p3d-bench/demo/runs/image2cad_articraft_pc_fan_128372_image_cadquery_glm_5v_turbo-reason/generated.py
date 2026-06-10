import cadquery as cq
import math

# =============================================================================
# PARAMETERS - 80mm Computer Cooling Fan
# =============================================================================

# Overall Dimensions (Standard 80mm fan form factor)
fan_size = 80.0              # Width and height of square frame (mm)
total_depth = 25.0           # Total thickness of fan assembly (mm)
frame_thickness = 5.0        # Thickness of each frame plate (top & bottom)
corner_radius = 4.0          # Radius of frame corners

# Frame Opening (for airflow)
inner_opening_radius = 34.0  # Radius of circular cutout in frame

# Mounting Holes (4 corners)
mount_hole_diameter = 4.2    # Diameter for M4 screws
mount_hole_inset = 6.5       # Distance from edge to hole center
mount_hole_chamfer = 2.0     # Chamfer depth for countersink

# Support Struts (connect top and bottom frames)
strut_width = 5.0            # Width of corner support pillars
strut_positions = [          # Relative positions of 4 corner struts
    (-1, -1), (1, -1), (-1, 1), (1, 1)
]
strut_inset = 12.0           # Distance from corner to strut center

# Motor Hub
hub_diameter = 26.0          # Diameter of central motor housing
hub_height = 12.0            # Height of hub cylinder
hub_z_position = 8.0         # Z-position of hub base from bottom

# Fan Blades
blade_count = 9              # Number of impeller blades
blade_inner_radius = 14.0    # Radius where blade attaches to hub
blade_outer_radius = 32.0    # Outer tip radius of blade
blade_chord = 12.0           # Width of blade profile
blade_thickness = 1.8        # Material thickness of blade
blade_pitch_angle = 35.0     # Twist/pitch angle of blade (degrees)

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def create_frame_plate():
    """
    Creates a single frame plate with:
    - Rounded rectangular outer profile
    - Large circular center opening
    - 4 countersunk mounting holes at corners
    - Reinforcement fillets at corners
    """
    # Base plate with rounded corners
    plate = (
        cq.Workplane("XY")
        .rect(fan_size, fan_size)
        .extrude(frame_thickness)
        .edges("|Z")
        .fillet(corner_radius)
    )
    
    # Cut center opening for airflow
    plate = (
        plate
        .faces(">Z")
        .workplane()
        .circle(inner_opening_radius)
        .cutThruAll()
    )
    
    # Add mounting holes at 4 corners
    half_size = fan_size / 2
    hole_offset = half_size - mount_hole_inset
    
    for x_sign in [-1, 1]:
        for y_sign in [-1, 1]:
            hx = x_sign * hole_offset
            hy = y_sign * hole_offset
            
            # Through hole
            plate = (
                plate
                .faces(">Z")
                .workplane()
                .center(hx, hy)
                .circle(mount_hole_diameter / 2)
                .cutThruAll()
            )
            
            # Countersink chamfer on top face
            plate = (
                plate
                .faces(">Z")
                .workplane()
                .center(hx, hy)
                .circle(mount_hole_diameter / 2 + 1.5)
                .cutBlind(mount_hole_chamfer, taper=45)
            )
    
    # Add corner reinforcement ribs (triangular gussets)
    rib_size = 8.0
    for x_sign in [-1, 1]:
        for y_sign in [-1, 1]:
            rx = x_sign * (half_size - corner_radius - 2)
            ry = y_sign * (half_size - corner_radius - 2)
            
            rib = (
                cq.Workplane("XY")
                .workplane(offset=frame_thickness - 1.5)
                .center(rx, ry)
                .polygon(3, rib_size)  # Triangle
                .extrude(1.5)
            )
            plate = plate.union(rib)
    
    return plate


def create_blade(angle_deg):
    """
    Creates a single twisted fan blade at specified angular position.
    Uses swept profile approach for realistic blade shape.
    """
    angle_rad = math.radians(angle_deg)
    
    # Calculate positions
    r_in = blade_inner_radius
    r_out = blade_outer_radius
    r_mid = (r_in + r_out) / 2
    
    # Create blade as a solid using sweep/loft approach
    # Inner section (narrower, near hub)
    inner_width = blade_chord * 0.5
    outer_width = blade_chord * 0.9
    
    # Build blade using polyline sections and loft
    blade = (
        cq.Workplane("XY")
        .transformed(
            rotate=(0, 0, angle_deg),
            offset=(r_mid * math.cos(angle_rad), r_mid * math.sin(angle_rad), 0)
        )
        .box(r_out - r_in, inner_width, blade_thickness * 0.5)
        .transformed(
            rotate=(0, blade_pitch_angle * 0.4, 0),
            offset=(0, (outer_width - inner_width) / 4, blade_thickness)
        )
    )
    
    # Alternative: Create tapered twisted blade using sketch and extrude with taper
    blade = (
        cq.Workplane("XY")
        .transformed(
            rotate=(0, 0, angle_deg),
            offset=(r_mid * math.cos(angle_rad), r_mid * math.sin(angle_rad), 0)
        )
        .center((r_out - r_in) / 2, 0)
        .rect(r_out - r_in, blade_chord * 0.7)
        .workplane(offset=blade_thickness * 1.5)
        .rect(r_out - r_in, blade_chord * 0.9)
        .loft(combine=True)
    )
    
    return blade

# =============================================================================
# MAIN MODEL ASSEMBLY
# =============================================================================

# 1. Bottom Frame Plate
bottom_frame = create_frame_plate()

# 2. Top Frame Plate (positioned above with gap for impeller)
top_frame = (
    create_frame_plate()
    .translate((0, 0, total_depth - frame_thickness))
)

# 3. Corner Support Struts (connect top and bottom frames)
strut_height = total_depth - (2 * frame_thickness)
struts = cq.Workplane("XY")

for sx, sy in strut_positions:
    px = sx * (fan_size / 2 - strut_inset)
    py = sy * (fan_size / 2 - strut_inset)
    
    strut = (
        cq.Workplane("XY")
        .workplane(offset=frame_thickness)
        .center(px, py)
        .rect(strut_width, strut_width)
        .extrude(strut_height)
    )
    struts = struts.union(strut)

# 4. Central Motor Hub
# Fixed: Removed fillet on cylinder edges (cylinder has no |Z edges to fillet)
hub = (
    cq.Workplane("XY")
    .workplane(offset=hub_z_position)
    .circle(hub_diameter / 2)
    .extrude(hub_height)
)

# 5. Fan Impeller Blades
blades = cq.Workplane("XY")

for i in range(blade_count):
    blade_angle = i * (360.0 / blade_count)
    blade = create_blade(blade_angle)
    # Position blades in middle of frame cavity
    blade = blade.translate((0, 0, frame_thickness + 2))
    blades = blades.union(blade)

# 6. Assemble All Components
result = (
    bottom_frame
    .union(top_frame)
    .union(struts)
    .union(hub)
    .union(blades)
)