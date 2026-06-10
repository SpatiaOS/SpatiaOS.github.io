import cadquery as cq
import math

# ==========================================
# Parameters
# ==========================================

# Overall Hull Dimensions
hull_length = 100.0
hull_width = 20.0
hull_depth = 8.0

# Superstructure Dimensions
sup_base_l = 28.0
sup_base_w = 14.0
sup_base_h = 4.0

sup_mid_l = 20.0
sup_mid_w = 10.0
sup_mid_h = 4.0

sup_top_l = 12.0
sup_top_w = 6.0
sup_top_h = 4.0

# Turret / Boss Dimensions
boss_radius = 5.0
boss_height = 5.0
num_bosses = 3

# Chimney / Funnel Dimensions
chimney_radius = 2.5
chimney_height = 10.0

# Pin (Gun Barrel) Dimensions
pin_radius = 0.5
pin_length = 10.0
pins_per_turret = 3

# Spacer Dimensions
spacer_length = 9.7
spacer_width = 6.2  # Curved dimension approx
spacer_thickness = 2.1
spacer_radius = 3.1 # Approx radius for the curved surface


# ==========================================
# Modeling Functions & Helpers
# ==========================================

def create_hull():
    """
    Creates the elongated warship hull using a loft operation 
    between a deck ellipse and a smaller keel ellipse to produce 
    the tapered BSpline-like lower contour.
    """
    # Use chained operations to ensure wires are correctly stacked for lofting
    hull_solid = (
        cq.Workplane("XY")
        .ellipse(hull_length / 2, hull_width / 2) # Deck profile
        .workplane(offset=-hull_depth)
        .ellipse(hull_length * 0.4, hull_width * 0.15) # Keel profile (tapered)
        .loft(combine=True) # Loft between the two ellipses
    )
    
    return hull_solid

def create_superstructure():
    """
    Creates the stepped rectangular superstructure amidships.
    """
    return (
        cq.Workplane("XY")
        # Base step
        .box(sup_base_l, sup_base_w, sup_base_h, centered=(True, True, False))
        # Mid step
        .workplane(offset=sup_base_h)
        .box(sup_mid_l, sup_mid_w, sup_mid_h, centered=(True, True, False))
        # Top step
        .workplane(offset=sup_mid_h)
        .box(sup_top_l, sup_top_w, sup_top_h, centered=(True, True, False))
    )

def create_turrets():
    """
    Creates 3 cylindrical turret bosses.
    Layout: 1 Forward, 2 Flanking (Port/Starboard) the superstructure.
    """
    turrets = cq.Workplane("XY")
    
    # Position 1: Forward (Bow)
    pos_front = (-36.0, 0.0, 0.0)
    
    # Position 2 & 3: Flanking (Aft of center, offset in Y)
    pos_starboard = (14.0, 8.0, 0.0)
    pos_port = (14.0, -8.0, 0.0)
    
    positions = [pos_front, pos_starboard, pos_port]
    
    for pos in positions:
        boss = (
            cq.Workplane("XY")
            .transformed(offset=pos)
            .cylinder(boss_height, boss_radius, centered=(True, True, False))
        )
        turrets = turrets.union(boss)
        
    return turrets

def create_chimney():
    """
    Creates the smaller cylindrical chimney on the superstructure.
    """
    # Positioned on top of the mid-superstructure block
    z_offset = sup_base_h + sup_mid_h
    return (
        cq.Workplane("XY")
        .transformed(offset=(0, 0, z_offset))
        .cylinder(chimney_height, chimney_radius, centered=(True, True, False))
    )

def create_pin_cluster(center_pos, direction_angle_deg):
    """
    Creates a cluster of 3 gun barrels (pins) at a given position and orientation.
    Arranged in a triangle pattern.
    """
    cluster = cq.Workplane("XY")
    
    # Local offsets for the triangular formation
    local_offsets = [
        (2.0, 0),      # Front barrel
        (-1.0, 1.0),   # Back Left
        (-1.0, -1.0)   # Back Right
    ]
    
    angle_rad = math.radians(direction_angle_deg)
    cos_a = math.cos(angle_rad)
    sin_a = math.sin(angle_rad)
    
    for lx, ly in local_offsets:
        # Rotate local offset
        rx = lx * cos_a - ly * sin_a
        ry = lx * sin_a + ly * cos_a
        
        # Calculate world position
        wx = center_pos[0] + rx
        wy = center_pos[1] + ry
        wz = center_pos[2] + boss_height # Sit on top of boss
        
        pin = (
            cq.Workplane("XY")
            .transformed(offset=(wx, wy, wz))
            .rotate((0,0,1), (0,0,0), direction_angle_deg)
            .cylinder(pin_length, pin_radius, centered=(False, True, True)) 
        )
        cluster = cluster.union(pin)
        
    return cluster

def create_spacer():
    """
    Creates the partial-cylindrical spacer/key element.
    Constructed by intersecting a cylinder with a slab.
    """
    # Create a cylinder
    cyl = (
        cq.Workplane("XY")
        .cylinder(spacer_length, spacer_radius, centered=(True, True, True))
    )
    
    # Create a cutting box (slab) to define the flat thickness
    cut_box = (
        cq.Workplane("XY")
        .box(spacer_length * 2, spacer_radius * 4, spacer_thickness * 2, centered=(True, True, True))
    )
    
    # Intersect to get the partial cylinder segment
    spacer = cyl.intersect(cut_box)
    
    # Position it on the hull (e.g., side of the superstructure)
    spacer = spacer.translate((0, -11.0, 4.0))
    
    return spacer


# ==========================================
# Assembly Construction
# ==========================================

# 1. Initialize with Hull
assembly = create_hull()

# 2. Add Superstructure
assembly = assembly.union(create_superstructure())

# 3. Add Turrets
turrets = create_turrets()
assembly = assembly.union(turrets)

# 4. Add Chimney
assembly = assembly.union(create_chimney())

# 5. Add Gun Barrels (Pins)
turret_configs = [
    ((-36.0, 0.0, 0.0), 180.0),     # Front: Aim Forward
    ((14.0, 8.0, 0.0), -90.0),      # Starboard: Aim Right
    ((14.0, -8.0, 0.0), 90.0)       # Port: Aim Left
]

for pos, angle in turret_configs:
    assembly = assembly.union(create_pin_cluster(pos, angle))

# 6. Add Spacer
assembly = assembly.union(create_spacer())

# Final Result
result = assembly