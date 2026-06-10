import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Main body dimensions
body_w = 220
body_h = 100
body_d = 70
fillet_r = 3

# Speaker dimensions
speaker_spacing = 110
speaker_outer_dia = 80
speaker_inner_dia = 60
speaker_center_dia = 40

# Leg dimensions
leg_length = 80
leg_r1 = 6  # Top radius
leg_r2 = 3  # Bottom radius
leg_inset_x = 25
leg_inset_y = 20
leg_angle = 15

# ==========================================
# Main Body
# ==========================================

# Create the main rectangular body with filleted edges
body = cq.Workplane("XY").box(body_w, body_d, body_h).edges().fillet(fillet_r)

# Add a front panel border by cutting a shallow rectangular groove
body = body.faces("<Y").workplane().rect(210, 90).rect(208, 88).cutBlind(-1)

# Add decorative cross grooves on the top face
groove1 = cq.Workplane("XY").box(1, body_d, 1).translate((0, 0, body_h/2))
groove2 = cq.Workplane("XY").box(body_w, 1, 1).translate((0, 0, body_h/2))
body = body.cut(groove1).cut(groove2)

# ==========================================
# Top Panel Buttons
# ==========================================

def create_button(x, y, symbol):
    """Creates a cylindrical button with an engraved symbol."""
    # Base button cylinder
    btn = cq.Workplane("XY").cylinder(2, 4).translate((x, y, body_h/2 + 1))
    
    # Engrave symbols (cut from the top of the button)
    if symbol == 'minus':
        cut = cq.Workplane("XY").box(4, 1, 1).translate((x, y, body_h/2 + 2))
    elif symbol == 'plus':
        cut1 = cq.Workplane("XY").box(4, 1, 1).translate((x, y, body_h/2 + 2))
        cut2 = cq.Workplane("XY").box(1, 4, 1).translate((x, y, body_h/2 + 2))
        cut = cut1.union(cut2)
    elif symbol == 'power':
        # Power symbol: a broken ring with a vertical line
        cut1 = cq.Workplane("XY").cylinder(1, 2.5).cut(cq.Workplane("XY").cylinder(1, 1.5)).translate((x, y, body_h/2 + 2))
        remove_box = cq.Workplane("XY").box(3, 3, 2).translate((x, y+2, body_h/2 + 2))
        cut1 = cut1.cut(remove_box)
        cut2 = cq.Workplane("XY").box(1, 2.5, 1).translate((x, y+1.5, body_h/2 + 2))
        cut = cut1.union(cut2)
    else:
        cut = cq.Workplane("XY")
        
    return btn.cut(cut)

# Add buttons to the top right
body = body.union(create_button(60, -15, 'minus'))
body = body.union(create_button(80, -15, 'plus'))
body = body.union(create_button(100, -15, 'power'))

# ==========================================
# Speakers
# ==========================================

def create_speaker():
    """Builds a single hexagonal speaker grille assembly."""
    # Outer and inner hexagonal rims
    outer_rim = cq.Workplane("XY").polygon(6, speaker_outer_dia).polygon(6, speaker_outer_dia - 5).extrude(3)
    inner_rim = cq.Workplane("XY").polygon(6, speaker_inner_dia + 5).polygon(6, speaker_inner_dia).extrude(3)
    
    # Center circular cap
    cap = cq.Workplane("XY").circle(speaker_center_dia/2).extrude(3)
    
    # Solid backing plate
    base = cq.Workplane("XY").polygon(6, speaker_outer_dia).extrude(0.5)
    
    # Radiating ribs pattern
    box1 = cq.Workplane("XY").box(1.5, speaker_outer_dia - 10, 2, centered=(True, True, False))
    ribs = box1
    for i in range(1, 18):
        ribs = ribs.union(box1.rotate((0,0,0), (0,0,1), i*10))
        
    # Trim ribs to fit between the inner rim and center cap
    hex_bound = cq.Workplane("XY").polygon(6, speaker_inner_dia).extrude(2)
    ribs_trimmed = ribs.intersect(hex_bound)
    center_cut = cq.Workplane("XY").circle(speaker_center_dia/2).extrude(5)
    ribs_final = ribs_trimmed.cut(center_cut)
    
    speaker = outer_rim.union(inner_rim).union(cap).union(base).union(ribs_final)
    return speaker.val()

speaker_solid = create_speaker()

# Place speakers on the front face (oriented towards -Y)
speaker_left = cq.Workplane("XY").add(speaker_solid).rotate((0,0,0), (1,0,0), 90).translate((-speaker_spacing/2, -body_d/2, 0))
speaker_right = cq.Workplane("XY").add(speaker_solid).rotate((0,0,0), (1,0,0), 90).translate((speaker_spacing/2, -body_d/2, 0))

body = body.union(speaker_left).union(speaker_right)

# ==========================================
# Center Geometric Pattern
# ==========================================

# Define coordinates for the central star and diamond shapes
star_pts = [(0, 35), (5, 8), (18, 0), (5, -8), (0, -35), (-5, -8), (-18, 0), (-5, 8)]
star_inner_pts = [(0, 30), (3, 6), (15, 0), (3, -6), (0, -30), (-3, -6), (-15, 0), (-3, 6)]
diamond_pts = [(0, 15), (5, 0), (0, -15), (-5, 0)]

# Create a hollow star outline and a solid inner diamond
star_outer = cq.Workplane("XY").polyline(star_pts).close().extrude(1.5)
star_inner = cq.Workplane("XY").polyline(star_inner_pts).close().extrude(1.5)
star_hollow = star_outer.cut(star_inner).val()

diamond_solid = cq.Workplane("XY").polyline(diamond_pts).close().extrude(2.5).val()

# Combine, rotate to face front, and attach to the body
center_pat = cq.Workplane("XY").add(star_hollow).union(cq.Workplane("XY").add(diamond_solid))
center_pat = center_pat.rotate((0,0,0), (1,0,0), 90).translate((0, -body_d/2, 0))

body = body.union(center_pat)

# ==========================================
# Legs
# ==========================================

def create_leg(dx, dy):
    """Creates a tapered, splayed leg at the specified corner."""
    # Start with a lofted cone for the leg
    l = cq.Workplane("XY").circle(leg_r1).workplane(offset=-leg_length).circle(leg_r2).loft()
    
    # Calculate splay angles (tilting outwards from the center)
    rot_y = -leg_angle * dx
    rot_x = leg_angle * dy
    
    l = l.rotate((0,0,0), (0,1,0), rot_y).rotate((0,0,0), (1,0,0), rot_x)
    
    # Position at the correct corner on the bottom face
    x_pos = (body_w/2 - leg_inset_x) * dx
    y_pos = (body_d/2 - leg_inset_y) * dy
    z_pos = -body_h/2
    
    l = l.translate((x_pos, y_pos, z_pos))
    return l

# Add all four legs
body = body.union(create_leg(-1, -1)) # Front-Left
body = body.union(create_leg(1, -1))  # Front-Right
body = body.union(create_leg(-1, 1))  # Back-Left
body = body.union(create_leg(1, 1))   # Back-Right

# Export the final result
result = body