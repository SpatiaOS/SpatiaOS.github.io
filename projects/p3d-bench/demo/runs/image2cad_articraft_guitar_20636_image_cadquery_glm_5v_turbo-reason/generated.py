import cadquery as cq

# =============================================================================
# Electric Guitar Model - Semi-Hollow Body Style
# Based on visual analysis of the provided image
# =============================================================================

# ---------------------- PARAMETERS ----------------------

# Overall scale factor (1.0 = full size in mm)
scale = 1.0

# Body dimensions
body_length = 450 * scale          # Length of main body
body_width_upper = 280 * scale     # Upper bout width
body_width_lower = 340 * scale     # Lower bout width  
body_width_waist = 220 * scale     # Waist width
body_thickness = 42 * scale        # Overall body thickness
body_edge_radius = 8 * scale       # Edge rounding

# Neck dimensions
neck_length = 540 * scale          # Scale length area
neck_width_nut = 44 * scale        # Width at nut (fret zero)
neck_width_heel = 68 * scale       # Width at body joint
neck_thickness = 22 * scale        # Neck thickness
fretboard_thickness = 6 * scale    # Fretboard overlay thickness
num_frets = 22                     # Number of frets

# Headstock dimensions
head_length = 130 * scale
head_width_max = 90 * scale
head_width_min = 55 * scale

# Hardware dimensions
pickup_length = 70 * scale
pickup_width = 18 * scale
pickup_height = 12 * scale
knob_diameter = 10 * scale
bridge_length = 75 * scale

# F-hole dimensions (semi-hollow characteristic feature)
fhole_height = 65 * scale
fhole_width = 25 * scale

# ---------------------- HELPER FUNCTIONS ----------------------

def create_body_profile():
    """
    Create the guitar body outline using spline points.
    Models a semi-hollow body style similar to ES-335/Guild Starfire.
    """
    # Define key points for the body outline (centered around origin conceptually)
    # Points are defined to create the characteristic guitar shape
    
    pts = [
        # Lower bout (bottom curve)
        (-body_width_lower/2, -body_length*0.4),
        (-body_width_lower/2 + 20, -body_length*0.48),  # Bottom horn start
        (0, -body_length*0.52),                          # Bottom center
        
        # Lower right curve
        (body_width_lower/2 - 20, -body_length*0.48),
        (body_width_lower/2, -body_length*0.35),
        
        # Right side up to waist
        (body_width_lower/2, -body_length*0.1),
        (body_width_waist/2 + 30, body_length*0.05),    # Waist right
        
        # Upper horn (right)
        (body_width_upper/2 - 10, body_length*0.15),
        (body_width_upper/2 - 25, body_length*0.28),    # Horn tip
        
        # Neck pocket area
        (neck_width_heel/2 + 5, body_length*0.38),
        (neck_width_heel/2, body_length*0.42),           # Neck joint
        
        # Upper horn (left) - mirrored roughly
        (-neck_width_heel/2, body_length*0.42),
        (-neck_width_heel/2 - 5, body_length*0.38),
        (-body_width_upper/2 + 25, body_length*0.28),   # Left horn tip
        (-body_width_upper/2 + 10, body_length*0.15),
        
        # Left side down to waist
        (-body_width_waist/2 - 30, body_length*0.05),   # Waist left
        (-body_width_lower/2, -body_length*0.1),
        
        # Close back to start
        (-body_width_lower/2, -body_length*0.4),
    ]
    
    return pts

def create_f_hole():
    """
    Create a stylized f-hole shape typical of semi-hollow guitars.
    Uses spline points to define the characteristic f-shape.
    """
    # Define f-hole as a closed spline shape
    # The f-hole has two rounded ends connected by sides
    
    half_w = fhole_width / 2
    half_h = fhole_height / 2
    
    # Create f-hole profile using points that trace the f-shape
    fhole_pts = [
        # Start at upper right, go clockwise
        (half_w * 0.8, half_h),                    # Upper right inner
        (half_w, half_h * 0.7),                    # Upper right outer
        (half_w, -half_h * 0.3),                   # Right side down
        (half_w * 0.6, -half_h * 0.8),             # Lower right curve start
        (0, -half_h),                              # Bottom center
        (-half_w * 0.6, -half_h * 0.8),            # Lower left curve start
        (-half_w, -half_h * 0.3),                  # Left side up
        (-half_w, half_h * 0.5),                   # Left side upper
        (-half_w * 0.5, half_h),                   # Upper left
        (half_w * 0.8, half_h),                    # Close back to start
    ]
    
    fhole = (
        cq.Workplane("XY")
        .spline(fhole_pts)
        .close()
        .extrude(body_thickness + 2)  # Slightly thicker than body for clean cut
    )
    return fhole

# ---------------------- MAIN MODEL CONSTRUCTION ----------------------

# 1. CREATE GUITAR BODY
# Build from extruded profile with edge rounding

body_points = create_body_profile()

guitar_body = (
    cq.Workplane("XY")
    .spline(body_points)
    .close()
    .extrude(body_thickness)
)

# Add edge rounding (chamfer or fillet on edges)
# Note: filleting complex shapes can be tricky, so we'll keep edges sharp 
# or apply selective rounding

# 2. CUT F-HOLES (Semi-hollow characteristic)
# Position f-holes symmetrically on lower bouts

left_fhole_pos = (-body_width_lower/3.5, -body_length*0.15)
right_fhole_pos = (body_width_lower/3.5, -body_length*0.15)

fhole_shape = create_f_hole()

guitar_body = (
    guitar_body
    .cut(
        fhole_shape.translate((left_fhole_pos[0], left_fhole_pos[1], 0))
    )
    .cut(
        fhole_shape.translate((right_fhole_pos[0], right_fhole_pos[1], 0))
    )
)

# 3. CREATE NECK
# Tapered neck extending from body

neck = (
    cq.Workplane("XY")
    .transformed(offset=(0, body_length*0.42 + neck_length/2, 
                         body_thickness/2 - neck_thickness/2 + fretboard_thickness/2))
    .box(neck_width_heel, neck_length, neck_thickness)
    # Taper the neck (wider at heel, narrower at nut)
    # Using edges for tapering would be ideal but box is simpler approximation
)

# Add fretboard (slightly wider and thinner layer on top)
fretboard = (
    cq.Workplane("XY")
    .transformed(offset=(0, body_length*0.42 + neck_length/2,
                         body_thickness/2 - fretboard_thickness/2))
    .box(neck_width_heel + 4, neck_length + 10, fretboard_thickness)
)

# 4. CREATE HEADSTOCK
# Angled or straight headstock at end of neck

headstock = (
    cq.Workplane("XY")
    .transformed(offset=(0, body_length*0.42 + neck_length + head_length/2,
                         body_thickness/2 - neck_thickness/3))
    .box(head_width_min, head_length, neck_thickness * 0.8)
    # Add some shaping to headstock (simplified as angled ends)
)

# 5. ADD HARDWARE DETAILS
# Pickups (simplified as rectangular blocks)

# Bridge pickup position
bridge_pickup = (
    cq.Workplane("XY")
    .transformed(offset=(0, -body_length*0.05, body_thickness/2 - pickup_height/2))
    .box(pickup_width, pickup_length, pickup_height)
)

# Neck pickup position  
neck_pickup = (
    cq.Workplane("XY")
    .transformed(offset=(0, body_length*0.18, body_thickness/2 - pickup_height/2))
    .box(pickup_width, pickup_length, pickup_height)
)

# Bridge assembly (simplified)
bridge = (
    cq.Workplane("XY")
    .transformed(offset=(0, -body_length*0.18, body_thickness/2 - 6*scale))
    .box(12*scale, bridge_length, 12*scale)
)

# Control knobs (volume/tone)
knob_positions = [
    (body_width_lower/3.5, -body_length*0.08),
    (body_width_lower/3.5 + 18*scale, -body_length*0.02),
    (body_width_lower/3.5 + 36*scale, body_length*0.04),
]

knobs = None
for pos in knob_positions:
    knob = (
        cq.Workplane("XY")
        .transformed(offset=(pos[0], pos[1], body_thickness/2))
        .cylinder(4*scale, knob_diameter/2)
    )
    if knobs is None:
        knobs = knob
    else:
        knobs = knobs.union(knob)

# Pickup selector switch (toggle)
selector_switch = (
    cq.Workplane("XY")
    .transformed(offset=(-body_width_lower/4, body_length*0.08, body_thickness/2))
    .box(4*scale, 25*scale, 5*scale)
)

# 6. ASSEMBLE ALL COMPONENTS

result = (
    guitar_body
    .union(neck)
    .union(fretboard)
    .union(headstock)
    .union(bridge_pickup)
    .union(neck_pickup)
    .union(bridge)
)

if knobs is not None:
    result = result.union(knobs)

result = result.union(selector_switch)

# Optional: Apply overall smoothing/filleting where possible
# (Complex boolean operations may limit fillet success on all edges)

print("Guitar model generated successfully")
print(f"Total approximate length: {(body_length + neck_length + head_length):.1f} mm")