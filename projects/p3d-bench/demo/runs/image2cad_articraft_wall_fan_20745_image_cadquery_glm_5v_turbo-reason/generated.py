import cadquery as cq
import math

# =============================================================================
# PARAMETERS - Wall Mounted Desk Fan
# =============================================================================

# Fan head parameters
fan_diameter = 100.0          # Overall diameter of fan grille
fan_thickness = 12.0          # Thickness of fan housing base
grille_ring_width = 6.0       # Width of outer grille ring
grille_inner_diameter = 85.0  # Inner diameter of grille opening

# Motor housing parameters
motor_diameter = 45.0         # Diameter of cylindrical motor housing
motor_height = 40.0           # Height of motor housing
motor_top_diameter = 42.0     # Slightly smaller top diameter

# Neck/Arm parameters (connecting motor to base)
arm_length = 70.0             # Length of tapered arm
arm_base_diameter = 28.0      # Diameter at motor end
arm_tip_diameter = 22.0       # Diameter at base end
arm_angle = 35.0              # Angle from horizontal (degrees)

# Mounting base parameters
base_diameter = 90.0          # Diameter of wall mount plate
base_depth = 15.0             # Depth/curvature of base dish
base_thickness = 3.0          # Thickness of base material

# Grille detail parameters
num_grille_spokes = 24        # Number of radial spokes
num_grille_rings = 5          # Number of concentric rings
spoke_width = 2.0             # Width of each spoke
ring_height = 8.0             # Height of grille wires

# =============================================================================
# MODELING - Component Creation
# =============================================================================

def create_fan_head():
    """Create the fan head with protective grille"""
    
    # Base disk of fan head
    fan_base = (
        cq.Workplane("XY")
        .circle(fan_diameter / 2)
        .extrude(fan_thickness)
    )
    
    # Outer ring (raised edge)
    outer_ring = (
        cq.Workplane("XY")
        .workplane(offset=fan_thickness)
        .circle(fan_diameter / 2)
        .circle(fan_diameter / 2 - grille_ring_width)
        .extrude(ring_height)
    )
    
    # Inner ring
    inner_ring = (
        cq.Workplane("XY")
        .workplane(offset=fan_thickness)
        .circle(grille_inner_diameter / 2)
        .circle(grille_inner_diameter / 2 - 3)
        .extrude(ring_height * 0.7)
    )
    
    # Create radial spokes for grille
    grille_spokes = None
    spoke_radius = (grille_inner_diameter / 2) - 2
    
    for i in range(num_grille_spokes):
        angle = i * (360.0 / num_grille_spokes)
        spoke = (
            cq.Workplane("XY")
            .workplane(offset=fan_thickness + 1)
            .transformed(rotate=(0, 0, angle))
            .rect(spoke_width, spoke_radius * 2)
            .extrude(ring_height * 0.5)
        )
        if grille_spokes is None:
            grille_spokes = spoke
        else:
            grille_spokes = grille_spokes.union(spoke)
    
    # Create concentric rings for grille
    grille_rings = None
    for j in range(1, num_grille_rings + 1):
        r = (grille_inner_diameter / 2) * (j / (num_grille_rings + 1))
        ring = (
            cq.Workplane("XY")
            .workplane(offset=fan_thickness + 1)
            .circle(r + 0.8)
            .circle(r - 0.8)
            .extrude(ring_height * 0.4)
        )
        if grille_rings is None:
            grille_rings = ring
        else:
            grille_rings = grille_rings.union(ring)
    
    # Combine all fan head components
    fan_head = fan_base.union(outer_ring).union(inner_ring)
    if grille_spokes:
        fan_head = fan_head.union(grille_spokes)
    if grille_rings:
        fan_head = fan_head.union(grille_rings)
    
    return fan_head

def create_motor_housing():
    """Create the cylindrical motor housing on top of fan"""
    
    # Main body - slightly tapered cylinder
    motor = (
        cq.Workplane("XY")
        .workplane(offset=fan_thickness + ring_height)
        .circle(motor_diameter / 2)
        .workplane(offset=motor_height)
        .circle(motor_top_diameter / 2)
        .loft(combine=True)
    )
    
    # Top cap with detail lines (control panel area)
    top_cap = (
        cq.Workplane("XY")
        .workplane(offset=fan_thickness + ring_height + motor_height)
        .circle(motor_top_diameter / 2)
        .extrude(5)
    )
    
    # Add some decorative/control details on top
    control_detail = (
        cq.Workplane("XZ")
        .transformed(rotate=(90, 0, 0), offset=(0, fan_thickness + ring_height + motor_height + 2, 0))
        .rect(20, 12)
        .extrude(2)
    )
    
    motor = motor.union(top_cap).union(control_detail)
    
    return motor

def create_arm():
    """Create the tapered connecting arm between motor and base"""
    
    # Tapered arm using loft between two circles
    arm = (
        cq.Workplane("XY")
        .workplane(offset=10)  # Start height
        .circle(arm_base_diameter / 2)
        .workplane(offset=arm_length, origin=(arm_length * math.cos(math.radians(arm_angle)), 
                                               0, 
                                               arm_length * math.sin(math.radians(arm_angle))))
        .circle(arm_tip_diameter / 2)
        .loft(combine=True)
    )
    
    # Joint connector at motor end
    joint_base = (
        cq.Workplane("XY")
        .workplane(offset=5)
        .circle(arm_base_diameter / 2 + 4)
        .circle(arm_base_diameter / 2)
        .extrude(10)
    )
    
    # Joint connector at base end  
    joint_tip = (
        cq.Workplane("XY")
        .transformed(offset=(arm_length * math.cos(math.radians(arm_angle)), 
                            0, 
                            10 + arm_length * math.sin(math.radians(arm_angle)) - 5))
        .circle(arm_tip_diameter / 2 + 3)
        .circle(arm_tip_diameter / 2)
        .extrude(10)
    )
    
    arm = arm.union(joint_base).union(joint_tip)
    
    return arm

def create_mounting_base():
    """Create the wall mounting base (dish shape)"""
    
    # Calculate position based on arm angle and length
    base_x = (arm_length + 20) * math.cos(math.radians(arm_angle))
    base_z = 10 + (arm_length + 20) * math.sin(math.radians(arm_angle))
    
    # Dish-shaped base using revolve or sphere segment approach
    base = (
        cq.Workplane("XY")
        .transformed(offset=(base_x, 0, base_z))
        .circle(base_diameter / 2)
        .workplane(offset=base_depth)
        .circle(base_diameter / 2 - 5)
        .loft(combine=True)
    )
    
    # Back plate (flat part against wall)
    back_plate = (
        cq.Workplane("YZ")
        .transformed(offset=(base_x + base_depth/2, 0, base_z), rotate=(0, 90, 0))
        .circle(base_diameter / 2)
        .extrude(base_thickness)
    )
    
    base = base.union(back_plate)
    
    return base

# =============================================================================
# ASSEMBLY - Combine all components
# =============================================================================

# Create individual components
fan_head = create_fan_head()
motor_housing = create_motor_housing()
arm = create_arm()
mounting_base = create_mounting_base()

# Combine all parts into final result
result = fan_head.union(motor_housing).union(arm).union(mounting_base)

# Optional: Apply fillets to smooth edges (commented out for performance)
# result = result.edges("|Z").fillet(1.0)