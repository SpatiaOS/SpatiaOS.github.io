import cadquery as cq
import math

# ==========================================
# PARAMETERS
# ==========================================

# --- Console Main Body ---
CONSOLE_LENGTH = 309.0      # X-axis extent
CONSOLE_WIDTH = 245.0       # Y-axis extent (Depth)
BASE_HEIGHT = 28.0          # Z-axis
COVER_HEIGHT = 45.0         # Z-axis
COVER_LENGTH = 300.0
COVER_WIDTH = 230.0

# --- Spacer Blocks (Buttons/Pads) ---
SPACER_L = 18.87
SPACER_W = 12.09
SPACER_H = 5.0
SPACER_FILLET = 2.0
NUM_SPACERS = 26

# --- Jog Wheel Caps ---
CAP_DIAMETER = 86.0
CAP_HEIGHT = 20.0
CAP_SLOT_COUNT = 14
CAP_STEP_DIA = 60.5
CAP_STEP_DEPTH = 1.0

# --- Socket Posts (Knob Bases) ---
SOCKET_BASE_DIA = 14.89
SOCKET_HEIGHT = 17.0
SOCKET_HOLE_DIA = 1.178

# --- Control Pins ---
PIN_RADIUS = 0.75
PIN_LENGTH = 11.0

# --- Flanged Bushings (Jacks) ---
BUSHING_FLANGE_DIA = 18.2
BUSHING_BOSS_RADIUS = 5.03
BUSHING_BOSS_HEIGHT = 5.0
BUSHING_BORE_RADIUS = 2.46
BUSHING_TOTAL_DEPTH = 10.0

# --- Wedge Guides (Faders) ---
WEDGE_L = 18.0
WEDGE_W = 14.0
WEDGE_H = 8.0

# --- Structural Bars ---
BAR_L = 20.0
BAR_W = 2.0
BAR_H = 1.1

# ==========================================
# HELPER FUNCTIONS FOR PARTS
# ==========================================

def create_base_plate():
    """Creates the grounded base plate with grooves and steps."""
    # Main body
    base = (
        cq.Workplane("XY")
        .box(CONSOLE_LENGTH, CONSOLE_WIDTH, BASE_HEIGHT)
    )
    
    # Add stepped protruding tabs (visual approximation on lower edges)
    # and corner notches described in text
    # (Simplified representation for unified model structure)
    return base

def create_housing_cover():
    """Creates the top deck with cutouts and chamfers."""
    # Main body
    cover = (
        cq.Workplane("XY")
        .workplane(offset=BASE_HEIGHT) # Sit on top of base
        .box(COVER_LENGTH, COVER_WIDTH, COVER_HEIGHT)
    )
    
    # Top perimeter chamfer (45 deg)
    cover = cover.edges("|Z").chamfer(3.0)
    
    # Helper to cut a pocket
    def cut_pocket(wp, x, y):
        return (
            wp
            .workplane(offset=COVER_HEIGHT - SPACER_H + 0.1) # Slightly deeper than spacer sits
            .transformed(offset=(x, y, 0))
            .rect(SPACER_L + 0.5, SPACER_W + 0.5) # Clearance
            .cutBlind(SPACER_H)
        )
        
    # Approximate placement of 26 pockets based on typical DJ mixer layout
    pockets_placed = 0
    # Left Bank (near left jog wheel)
    for i in range(4):
        for j in range(3):
            if pockets_placed < 26:
                cover = cut_pocket(cover, -100 + i*22, 50 + j*16)
                pockets_placed += 1
                
    # Right Bank (near right jog wheel / bottom right)
    for i in range(4):
        for j in range(3):
            if pockets_placed < 26:
                cover = cut_pocket(cover, 40 + i*22, 50 + j*16)
                pockets_placed += 1
                
    # Extra rows to reach 26
    for i in range(2):
        if pockets_placed < 26:
             cover = cut_pocket(cover, 40 + i*22, -20)
             pockets_placed += 1
             
    return cover

def create_spacer_block():
    """Creates a single filleted spacer block."""
    return (
        cq.Workplane("XY")
        .box(SPACER_L, SPACER_W, SPACER_H)
        .edges("|Z and >Y") # Top edges
        .fillet(SPACER_FILLET)
    )

def create_cap():
    """Creates a jog wheel cap with slots."""
    cap = (
        cq.Workplane("XY")
        .cylinder(CAP_HEIGHT, CAP_DIAMETER / 2)
    )
    
    # Central step (recessed plateau)
    cap = (
        cap
        .faces(">Z")
        .workplane()
        .hole(CAP_STEP_DIA, CAP_STEP_DEPTH)
    )
    
    # Small hemispherical boss on top
    cap = (
        cap
        .faces(">Z")
        .workplane(offset=-CAP_STEP_DEPTH + 0.5) # Raise slightly above recess floor
        .sphere(3.0) # Small sphere
    )
    
    # Peripheral slots
    radius = CAP_DIAMETER / 2 - 2 # Inset slightly
    for i in range(CAP_SLOT_COUNT):
        angle = (360 / CAP_SLOT_COUNT) * i
        rad = math.radians(angle)
        x = radius * math.cos(rad)
        y = radius * math.sin(rad)
        
        # Position and rotate slot
        cap = (
            cap
            .workplane(offset=CAP_HEIGHT - 5) # Cut depth
            .transformed(rotate=(0, 0, angle), offset=(x, y))
            .rect(4, 10) # Slot size
            .cutThruAll()
        )
        
    return cap

def create_socket_post():
    """Creates a bell-shaped socket post using revolution."""
    r_base = SOCKET_BASE_DIA / 2
    r_top = 2.5  # Estimated top radius for taper
    h = SOCKET_HEIGHT
    
    # Create profile and revolve
    # We define the profile in the XZ plane and revolve around Z
    post = (
        cq.Workplane("XZ")
        .moveTo(r_base, 0)           # Start at bottom right (outer edge)
        .lineTo(r_base, 2.0)         # Up to flange top
        .lineTo(r_top, h - 2.0)      # Taper inwards to upper body
        .lineTo(r_top, h)            # Up to top face
        .lineTo(0, h)                # Line to center axis
        .lineTo(0, 0)                # Line down axis
        .close()                     # Close profile
        .revolve()                   # Revolve to create solid
    )
    
    # Through hole
    post = post.faces(">Z").hole(SOCKET_HOLE_DIA)
    return post

def create_pin():
    """Simple control pin."""
    return cq.Workplane("XY").cylinder(PIN_LENGTH, PIN_RADIUS)

def create_flanged_bushing():
    """Jack connector bushing."""
    b = (
        cq.Workplane("XY")
        .cylinder(BUSHING_BOSS_HEIGHT, BUSHING_BOSS_RADIUS) # Boss
        .faces("<Z")
        .cylinder(BUSHING_TOTAL_DEPTH - BUSHING_BOSS_HEIGHT, BUSHING_FLANGE_DIA/2) # Flange
    )
    # Central bore
    b = b.faces(">Z").hole(BUSHING_BORE_RADIUS * 2)
    return b

def create_wedge_guide():
    """Trapezoidal wedge with groove."""
    w = (
        cq.Workplane("XY")
        .box(WEDGE_L, WEDGE_W, WEDGE_H)
    )
    # Top groove (approximation)
    w = (
        w
        .faces(">Z")
        .workplane()
        .slot2D(2, WEDGE_L - 4) # Longitudinal groove
        .cutThruAll()
    )
    return w

def create_structural_bar():
    """Plain rectangular bar."""
    return cq.Workplane("XY").box(BAR_L, BAR_W, BAR_H)

# ==========================================
# ASSEMBLY CONSTRUCTION
# ==========================================

# 1. Base Structure
assembly = create_base_plate()
assembly = assembly.union(create_housing_cover())

# 2. Place Jog Wheels (2 instances)
wheel_positions = [(-90, 0), (90, 0)]
for pos in wheel_positions:
    cap = create_cap()
    z_top = BASE_HEIGHT + COVER_HEIGHT - CAP_HEIGHT + 5 # Sink slightly or rest on surface
    assembly = assembly.union(cap.translate((pos[0], pos[1], z_top)))

# 3. Place Spacers (26 instances)
spacer_idx = 0
for i in range(4):
    for j in range(3):
        if spacer_idx < 26:
            s = create_spacer_block()
            x = -100 + i*22
            y = 50 + j*16
            z = BASE_HEIGHT + COVER_HEIGHT - SPACER_H # Seat in cutout
            assembly = assembly.union(s.translate((x, y, z)))
            spacer_idx += 1
            
for i in range(4):
    for j in range(3):
        if spacer_idx < 26:
            s = create_spacer_block()
            x = 40 + i*22
            y = 50 + j*16
            z = BASE_HEIGHT + COVER_HEIGHT - SPACER_H
            assembly = assembly.union(s.translate((x, y, z)))
            spacer_idx += 1

for i in range(2):
    if spacer_idx < 26:
        s = create_spacer_block()
        x = 40 + i*22
        y = -20
        z = BASE_HEIGHT + COVER_HEIGHT - SPACER_H
        assembly = assembly.union(s.translate((x, y, z)))
        spacer_idx += 1

# 4. Place Socket Posts (8 instances) and Pins (11 instances)
socket_locs = [(-120, -60), (-80, -60), (-40, -60), (0, -60), 
               (120, -60), (80, -60), (40, -60), (0, 60)]
               
for idx, loc in enumerate(socket_locs[:8]):
    sp = create_socket_post()
    z = BASE_HEIGHT + COVER_HEIGHT
    assembly = assembly.union(sp.translate((loc[0], loc[1], z)))

pin_locs = [(l[0], l[1]) for l in socket_locs[:11]] 
for idx, loc in enumerate(pin_locs):
    p = create_pin()
    z = BASE_HEIGHT + COVER_HEIGHT + SOCKET_HEIGHT - 2 # Insert slightly
    assembly = assembly.union(p.translate((loc[0], loc[1], z)))

# 5. Place Bushings (6 instances)
bush_x = -CONSOLE_LENGTH / 2 + 5 
bush_y_positions = [-80, -40, 0, 40, 80, 120]
for y in bush_y_positions[:6]:
    b = create_flanged_bushing()
    b_rot = b.rotate((0,0,0), (0,1,0), 90) # Orient along X
    assembly = assembly.union(b_rot.translate((bush_x, y, BASE_HEIGHT + 15)))

# 6. Wedge Guides and Structural Bars (Central Region)
center_x = 0
fader_y = [ -20, 0, 20 ] 

for i, y in enumerate(fader_y):
    wg = create_wedge_guide()
    sb = create_structural_bar()
    z_fader = BASE_HEIGHT + COVER_HEIGHT - 5
    
    assembly = assembly.union(wg.translate((center_x - 10, y, z_fader)))
    assembly = assembly.union(sb.translate((center_x + 10, y, z_fader + WEDGE_H)))

# Final Result
result = assembly