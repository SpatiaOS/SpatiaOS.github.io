import cadquery as cq
import math

# =============================================================================
# PARAMETERS
# =============================================================================

# Main body dimensions
body_width = 110.0
body_depth = 40.0
body_height = 48.0

# Speaker parameters (two hexagonal speakers on the front face)
speaker_offset_x = 28.0       # horizontal distance from center to each speaker
speaker_hex_radius = 16.0     # circumradius of the hexagonal bezel
speaker_hex_depth = 2.0       # protrusion from the front face
speaker_cone_dia = 20.0       # diameter of the central speaker cone recess
speaker_cone_depth = 1.5      # depth of the cone recess

# Grille detail (radial ribs between the hexagon and the cone)
grille_ribs = 8
grille_rib_width = 1.2
grille_rib_depth = 0.4
grille_inner_r = speaker_cone_dia / 2.0 + 1.0
grille_outer_r = speaker_hex_radius - 1.0

# Star emblem between the two speakers
star_tip_r = 10.0
star_valley_r = 3.5
star_depth = 1.0

# Top control buttons
button_dia = 5.0
button_height = 1.5
button_x_positions = [35.0, 48.0, 61.0]  # arranged toward the right side
button_y_offset = -8.0                   # slightly toward the back edge

# Leg parameters
leg_length = 50.0
leg_top_dia = 6.0
leg_bottom_dia = 3.0
leg_splay = 15.0          # degrees from vertical
leg_inset = 4.0           # inset from side edges for attachment

# Top panel grooves (shallow detail lines)
groove_depth = 0.8
groove_width = 0.8
groove_x_positions = [-25.0, 25.0]

# Derived helpers
half_w = body_width / 2.0
half_d = body_depth / 2.0
half_h = body_height / 2.0
front_y = half_d
top_z = half_h

# =============================================================================
# MAIN BODY
# =============================================================================
# Start with a centered rectangular prism
model = cq.Workplane("XY").box(body_width, body_depth, body_height)

# =============================================================================
# SPEAKER ASSEMBLIES
# =============================================================================
def make_speaker(x_pos):
    """
    Build a single speaker assembly consisting of:
      - a protruding hexagonal bezel
      - a recessed circular cone
      - thin radial grille ribs on the bezel face
    """
    # Hexagonal bezel protruding from the front face.
    # CadQuery polygon() expects diameter, so we pass 2 * radius.
    # We then rotate 30° around the front axis to achieve a pointy-top hexagon.
    bezel = (
        cq.Workplane("XY", origin=(x_pos, front_y, 0))
        .transformed(rotate=(-90, 0, 0))  # orient local Z to point front (+Y)
        .polygon(6, speaker_hex_radius * 2.0)
        .extrude(speaker_hex_depth)
        .rotate((x_pos, front_y, 0), (0, 1, 0), 30)
    )

    # Cutter for the central speaker cone recess
    cone_cutter = (
        cq.Workplane("XY", origin=(x_pos, front_y + speaker_hex_depth, 0))
        .transformed(rotate=(-90, 0, 0))
        .circle(speaker_cone_dia / 2)
        .extrude(-speaker_cone_depth)
    )
    speaker = bezel.cut(cone_cutter)

    # Radial grille ribs between the cone and the hexagon perimeter
    rib_length = grille_outer_r - grille_inner_r
    rib_mid_r = (grille_inner_r + grille_outer_r) / 2.0
    y_rib = front_y + speaker_hex_depth

    ribs = None
    for i in range(grille_ribs):
        angle = math.radians(i * 360.0 / grille_ribs)
        # Create a thin plate, rotate it to lie on the front face, then orient radially
        rib = (
            cq.Workplane("XY")
            .rect(rib_length, grille_rib_width)
            .extrude(grille_rib_depth)
            .rotate((0, 0, 0), (1, 0, 0), -90)   # map +Z extrusion to +Y (front)
            .rotate((0, 0, 0), (0, 1, 0), math.degrees(angle))  # radial alignment
            .translate((
                x_pos + rib_mid_r * math.cos(angle),
                y_rib,
                rib_mid_r * math.sin(angle)
            ))
        )
        ribs = rib if ribs is None else ribs.union(rib)

    if ribs is not None:
        speaker = speaker.union(ribs)

    return speaker

# Add left and right speakers to the model
model = model.union(make_speaker(-speaker_offset_x))
model = model.union(make_speaker(speaker_offset_x))

# =============================================================================
# CENTER STAR EMBLEM
# =============================================================================
# Generate a 4-pointed star polygon (alternating tip and valley radii)
star_points = []
for i in range(8):
    angle = math.radians(i * 45.0)
    r = star_tip_r if (i % 2 == 0) else star_valley_r
    star_points.append((r * math.cos(angle), r * math.sin(angle)))

star = (
    cq.Workplane("XY", origin=(0, front_y, 0))
    .transformed(rotate=(-90, 0, 0))
    .polyline(star_points)
    .close()
    .extrude(star_depth)
)
model = model.union(star)

# =============================================================================
# TOP CONTROL BUTTONS
# =============================================================================
buttons = None
for bx in button_x_positions:
    btn = (
        cq.Workplane("XY", origin=(bx, button_y_offset, top_z))
        .circle(button_dia / 2)
        .extrude(button_height)
    )
    buttons = btn if buttons is None else buttons.union(btn)

model = model.union(buttons)

# =============================================================================
# TOP PANEL GROOVES
# =============================================================================
for gx in groove_x_positions:
    groove = (
        cq.Workplane("XY", origin=(gx, 0, top_z))
        .rect(groove_width, body_depth - 6.0)
        .extrude(-groove_depth)
    )
    model = model.cut(groove)

# =============================================================================
# LEGS
# =============================================================================
def make_leg(attach_x, attach_y, tilt_x, tilt_y):
    """
    Create a tapered leg, apply splay rotations, and attach it to the body bottom.
    """
    # Half-angle taper so the leg narrows from top to bottom
    taper_angle = math.degrees(
        math.atan((leg_top_dia / 2.0 - leg_bottom_dia / 2.0) / leg_length)
    )

    # Extrude upward with negative taper (narrower at the far end), then flip 180°
    # so the leg points downward and the wide end sits at the attachment point.
    leg = (
        cq.Workplane("XY")
        .circle(leg_top_dia / 2)
        .extrude(leg_length, taper=-taper_angle)
        .rotate((0, 0, 0), (1, 0, 0), 180)
        .rotate((0, 0, 0), (1, 0, 0), tilt_x)
        .rotate((0, 0, 0), (0, 1, 0), tilt_y)
        .translate((attach_x, attach_y, -half_h))
    )
    return leg

# Four legs splayed outward from the bottom corners
legs = [
    make_leg(-half_w + leg_inset,  half_d - leg_inset,  leg_splay,  leg_splay),  # front-left
    make_leg( half_w - leg_inset,  half_d - leg_inset,  leg_splay, -leg_splay),  # front-right
    make_leg(-half_w + leg_inset, -half_d + leg_inset, -leg_splay,  leg_splay),  # back-left
    make_leg( half_w - leg_inset, -half_d + leg_inset, -leg_splay, -leg_splay),  # back-right
]

for leg in legs:
    model = model.union(leg)

# =============================================================================
# FINAL RESULT
# =============================================================================
result = model