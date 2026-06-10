import cadquery as cq
import math

# ==============================
# RETRO BLUETOOTH SPEAKER MODEL
# ==============================

# --- Main Body Parameters ---
body_width = 280.0      # X: long axis
body_depth = 72.0       # Y: front to back
body_height = 110.0     # Z: vertical
vert_chamfer = 9.0      # vertical edge chamfer

# --- Speaker Parameters ---
spk_radius = 30.0       # speaker opening radius
spk_x_offset = 88.0     # speaker center offset from body center
spk_depth = 7.0         # speaker hole depth
oct_radius = 48.0       # octagonal frame circumradius
oct_recess = 3.0        # frame recess depth

# --- Radial Slot Parameters ---
num_slots = 12          # tick marks per speaker
slot_width = 2.2
slot_inner_r = spk_radius + 3.0
slot_outer_r = oct_radius - 5.0

# --- Center Decoration ---
deco_size = 35.0        # half-diagonal of X pattern
deco_line_w = 2.5
deco_depth = 2.0

# --- Button Parameters ---
btn_radius = 4.0
btn_recess = 1.5
btn_count = 3
btn_spacing = 16.0
btn_z_pos = 20.0        # above body center

# --- Top Groove Parameters ---
groove_depth = 1.2
groove_width = 1.2

# --- Leg Parameters ---
leg_length = 115.0
leg_r_top = 7.0
leg_r_bottom = 4.5
leg_splay_deg = 14.0
leg_x_inset = 30.0
leg_y_inset = 15.0

# ==============================
# 1. MAIN BODY - chamfered box
# ==============================
body = (
    cq.Workplane("XY")
    .box(body_width, body_depth, body_height)
    .edges("|Z")
    .chamfer(vert_chamfer)
)

# ==============================
# 2. OCTAGONAL SPEAKER RECESSES
# ==============================
front_y = body_depth / 2.0

for xo in [-spk_x_offset, spk_x_offset]:
    # Generate octagon vertices on XZ plane
    oct_pts = []
    for i in range(8):
        angle = math.pi / 8 + i * math.pi / 4
        oct_pts.append((
            xo + oct_radius * math.cos(angle),
            oct_radius * math.sin(angle)
        ))
    # Build octagonal cutting prism (inside body toward front face)
    wp = (
        cq.Workplane("XZ")
        .workplane(offset=front_y - oct_recess)
        .moveTo(*oct_pts[0])
    )
    for pt in oct_pts[1:]:
        wp = wp.lineTo(*pt)
    body = body.cut(wp.close().extrude(oct_recess))

# ==============================
# 3. CIRCULAR SPEAKER OPENINGS
# ==============================
for xo in [-spk_x_offset, spk_x_offset]:
    spk_cut = (
        cq.Workplane("XZ")
        .workplane(offset=front_y - spk_depth)
        .center(xo, 0)
        .circle(spk_radius)
        .extrude(spk_depth)
    )
    body = body.cut(spk_cut)

# ==============================
# 4. RADIAL TICK MARKS around speakers
# ==============================
slot_len = slot_outer_r - slot_inner_r
slot_cut_depth = oct_recess + 1.5

for xo in [-spk_x_offset, spk_x_offset]:
    for i in range(num_slots):
        a = i * 2.0 * math.pi / num_slots
        ca, sa = math.cos(a), math.sin(a)
        mid_r = (slot_inner_r + slot_outer_r) / 2.0

        # Slot center in XZ coordinates
        cx = xo + mid_r * ca
        cz = mid_r * sa
        hl = slot_len / 2.0
        hw = slot_width / 2.0

        # Rotated rectangle corners (radial direction)
        corners = [
            (cx + hl * ca - hw * sa, cz + hl * sa + hw * ca),
            (cx + hl * ca + hw * sa, cz + hl * sa - hw * ca),
            (cx - hl * ca + hw * sa, cz - hl * sa - hw * ca),
            (cx - hl * ca - hw * sa, cz - hl * sa + hw * ca),
        ]

        sc = (
            cq.Workplane("XZ")
            .workplane(offset=front_y - slot_cut_depth)
            .moveTo(*corners[0])
            .lineTo(*corners[1])
            .lineTo(*corners[2])
            .lineTo(*corners[3])
            .close()
            .extrude(slot_cut_depth)
        )
        body = body.cut(sc)

# ==============================
# 5. CENTER X/STAR DECORATION
# ==============================
# Diagonal lines forming an X between the two speakers
for angle_deg in [40, -40]:
    a = math.radians(angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    hl = deco_size
    hw = deco_line_w / 2.0

    corners = [
        (hl * ca - hw * sa, hl * sa + hw * ca),
        (hl * ca + hw * sa, hl * sa - hw * ca),
        (-hl * ca + hw * sa, -hl * sa - hw * ca),
        (-hl * ca - hw * sa, -hl * sa + hw * ca),
    ]
    dc = (
        cq.Workplane("XZ")
        .workplane(offset=front_y - deco_depth)
        .moveTo(*corners[0])
        .lineTo(*corners[1])
        .lineTo(*corners[2])
        .lineTo(*corners[3])
        .close()
        .extrude(deco_depth)
    )
    body = body.cut(dc)

# Horizontal and vertical accent lines
for angle_deg in [0, 90]:
    a = math.radians(angle_deg)
    ca, sa = math.cos(a), math.sin(a)
    hl = deco_size * 0.75
    hw = deco_line_w / 2.0

    corners = [
        (hl * ca - hw * sa, hl * sa + hw * ca),
        (hl * ca + hw * sa, hl * sa - hw * ca),
        (-hl * ca + hw * sa, -hl * sa - hw * ca),
        (-hl * ca - hw * sa, -hl * sa + hw * ca),
    ]
    dc = (
        cq.Workplane("XZ")
        .workplane(offset=front_y - deco_depth)
        .moveTo(*corners[0])
        .lineTo(*corners[1])
        .lineTo(*corners[2])
        .lineTo(*corners[3])
        .close()
        .extrude(deco_depth)
    )
    body = body.cut(dc)

# Diamond outline around center pattern
diamond_r = 28.0
d_verts = [(diamond_r, 0), (0, diamond_r), (-diamond_r, 0), (0, -diamond_r)]
for j in range(4):
    p1 = d_verts[j]
    p2 = d_verts[(j + 1) % 4]
    dx = p2[0] - p1[0]
    dz = p2[1] - p1[1]
    seg_len = math.sqrt(dx ** 2 + dz ** 2)
    ux, uz = dx / seg_len, dz / seg_len
    mx = (p1[0] + p2[0]) / 2.0
    mz = (p1[1] + p2[1]) / 2.0
    hl = seg_len / 2.0
    hw = deco_line_w / 2.0

    corners = [
        (mx + hl * ux - hw * uz, mz + hl * uz + hw * ux),
        (mx + hl * ux + hw * uz, mz + hl * uz - hw * ux),
        (mx - hl * ux + hw * uz, mz - hl * uz - hw * ux),
        (mx - hl * ux - hw * uz, mz - hl * uz + hw * ux),
    ]
    dc = (
        cq.Workplane("XZ")
        .workplane(offset=front_y - deco_depth)
        .moveTo(*corners[0])
        .lineTo(*corners[1])
        .lineTo(*corners[2])
        .lineTo(*corners[3])
        .close()
        .extrude(deco_depth)
    )
    body = body.cut(dc)

# ==============================
# 6. CONTROL BUTTONS (Right Side)
# ==============================
right_x = body_width / 2.0

for i in range(btn_count):
    y_off = -(i - 1) * btn_spacing
    # Button recess
    bc = (
        cq.Workplane("YZ")
        .workplane(offset=right_x - btn_recess)
        .center(y_off, btn_z_pos)
        .circle(btn_radius)
        .extrude(btn_recess)
    )
    body = body.cut(bc)
    # Raised button center
    bb = (
        cq.Workplane("YZ")
        .workplane(offset=right_x - btn_recess)
        .center(y_off, btn_z_pos)
        .circle(btn_radius * 0.6)
        .extrude(btn_recess * 0.5)
    )
    body = body.union(bb)

# ==============================
# 7. TOP PANEL GROOVES
# ==============================
top_z = body_height / 2.0

# Longitudinal groove along X
hg = (
    cq.Workplane("XY")
    .workplane(offset=top_z - groove_depth)
    .rect(body_width * 0.5, groove_width)
    .extrude(groove_depth)
)
body = body.cut(hg)

# Two transverse grooves along Y
for xp in [-body_width * 0.12, body_width * 0.12]:
    vg = (
        cq.Workplane("XY")
        .workplane(offset=top_z - groove_depth)
        .center(xp, 0)
        .rect(groove_width, body_depth * 0.5)
        .extrude(groove_depth)
    )
    body = body.cut(vg)

# ==============================
# 8. SPLAYED TAPERED LEGS
# ==============================
splay_rad = math.radians(leg_splay_deg)
bottom_z = -body_height / 2.0

leg_configs = [
    (-body_width / 2 + leg_x_inset, -body_depth / 2 + leg_y_inset, -1, -1),
    (-body_width / 2 + leg_x_inset,  body_depth / 2 - leg_y_inset, -1,  1),
    ( body_width / 2 - leg_x_inset, -body_depth / 2 + leg_y_inset,  1, -1),
    ( body_width / 2 - leg_x_inset,  body_depth / 2 - leg_y_inset,  1,  1),
]

for lx, ly, sx, sy in leg_configs:
    # Normalize splay direction
    mag = math.sqrt(sx ** 2 + sy ** 2)
    sx_n, sy_n = sx / mag, sy / mag

    # Leg end offsets from attachment point
    dz = leg_length * math.cos(splay_rad)
    dx = leg_length * math.sin(splay_rad) * sx_n
    dy = leg_length * math.sin(splay_rad) * sy_n

    # Loft between top circle and offset bottom circle
    leg = (
        cq.Workplane("XY")
        .workplane(offset=bottom_z)
        .center(lx, ly)
        .circle(leg_r_top)
        .workplane(offset=-dz)
        .center(dx, dy)
        .circle(leg_r_bottom)
        .loft()
    )
    body = body.union(leg)

# ==============================
# FINAL RESULT
# ==============================
result = body