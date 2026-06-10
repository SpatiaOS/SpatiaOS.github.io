import cadquery as cq

# ============================================
# ES-335 Style Semi-Hollow Body Electric Guitar
# All dimensions in mm
# ============================================

# ------ Body Parameters ------
body_thickness = 44.0

# ------ Neck Parameters ------
neck_length = 380.0
neck_width_nut = 43.0
neck_width_body = 57.0
neck_depth = 21.0

# ------ Fretboard ------
fb_thickness = 6.0
fb_overhang = 55.0  # extends over body

# ------ Headstock ------
hs_length = 190.0
hs_width = 72.0
hs_thickness = 15.0

# ------ Pickups (humbuckers) ------
pu_length = 70.0
pu_width = 36.0
pu_height = 14.0
neck_pu_y = 95.0
bridge_pu_y = 15.0

# ------ Bridge & Tailpiece ------
bridge_y = -30.0
tp_y = -80.0

# ------ Knobs ------
knob_r = 12.0
knob_h = 10.0
knob_positions = [(-75, -70), (-70, -140), (75, -70), (70, -140)]

# ------ Computed Z and Y References ------
neck_top_z = body_thickness + 1.5
neck_center_z = neck_top_z - neck_depth / 2.0
neck_joint_y = 180.0
nut_y = neck_joint_y + neck_length  # 560

# ============================================
# 1. BODY - Double cutaway semi-hollow shape
#    Outline defined by connected three-point arcs
# ============================================
body = (
    cq.Workplane("XY")
    .moveTo(0, -250)
    # --- Right side: lower bout ---
    .threePointArc((170, -230), (203, -140))
    .threePointArc((188, -35), (148, 28))
    # --- Right: waist (concave) to upper bout ---
    .threePointArc((120, 58), (132, 105))
    .threePointArc((148, 155), (125, 190))
    # --- Right horn tip and cutaway ---
    .threePointArc((98, 210), (72, 214))
    .threePointArc((48, 202), (29, 182))
    # --- Straight across neck pocket ---
    .lineTo(-29, 182)
    # --- Left cutaway and horn tip ---
    .threePointArc((-48, 202), (-72, 214))
    .threePointArc((-98, 210), (-125, 190))
    # --- Left: upper bout to waist ---
    .threePointArc((-148, 155), (-132, 105))
    .threePointArc((-120, 58), (-148, 28))
    # --- Left: lower bout ---
    .threePointArc((-188, -35), (-203, -140))
    .threePointArc((-170, -230), (0, -250))
    .close()
    .extrude(body_thickness)
)

# Note: Fillet removed - complex arc-based outlines cause BRep fillet failures

# ============================================
# 2. F-HOLES (simplified as angled slots)
# ============================================
for sign in [1, -1]:
    fhole_cut = (
        cq.Workplane("XY")
        .center(sign * 82, 30)
        .slot2D(80, 11, angle=sign * 8)
        .extrude(body_thickness + 20)
    ).translate((0, 0, -10))
    body = body.cut(fhole_cut)

# ============================================
# 3. NECK - Tapered loft from body joint to nut
#    XZ workplane normal is +Y; positive offset goes toward headstock
# ============================================
neck = (
    cq.Workplane("XZ")
    .rect(neck_width_body, neck_depth)
    .workplane(offset=neck_length)
    .rect(neck_width_nut, neck_depth * 0.85)
    .loft()
).translate((0, neck_joint_y, neck_center_z))

# ============================================
# 4. FRETBOARD - Thin tapered slab on top of neck
# ============================================
fb_total_len = neck_length + fb_overhang
fb_start_y = neck_joint_y - fb_overhang

fretboard = (
    cq.Workplane("XZ")
    .rect(neck_width_body + 3, fb_thickness)
    .workplane(offset=fb_total_len)
    .rect(neck_width_nut + 1, fb_thickness)
    .loft()
).translate((0, fb_start_y, neck_top_z + fb_thickness / 2.0))

# ============================================
# 5. HEADSTOCK - Tapered slab at end of neck
# ============================================
headstock = (
    cq.Workplane("XZ")
    .rect(hs_width, hs_thickness)
    .workplane(offset=hs_length)
    .rect(hs_width * 0.6, hs_thickness * 0.9)
    .loft()
).translate((0, nut_y, neck_center_z))

# ============================================
# 6. NUT - Small bar at fretboard/headstock junction
# ============================================
nut = (
    cq.Workplane("XY")
    .box(neck_width_nut + 4, 5, 6)
).translate((0, nut_y, neck_top_z + 3))

# ============================================
# 7. PICKUPS - Two humbucker-style rectangular blocks
# ============================================
neck_pickup = (
    cq.Workplane("XY")
    .box(pu_width, pu_length, pu_height)
).translate((0, neck_pu_y, body_thickness + pu_height / 2.0))

bridge_pickup = (
    cq.Workplane("XY")
    .box(pu_width, pu_length, pu_height)
).translate((0, bridge_pu_y, body_thickness + pu_height / 2.0))

# ============================================
# 8. BRIDGE - Tune-o-matic style
# ============================================
bridge = (
    cq.Workplane("XY")
    .box(78, 10, 12)
).translate((0, bridge_y, body_thickness + 6))

# Bridge posts (two cylinders supporting the bridge)
bridge_post_l = (
    cq.Workplane("XY").circle(4).extrude(8)
).translate((-32, bridge_y, body_thickness))
bridge_post_r = (
    cq.Workplane("XY").circle(4).extrude(8)
).translate((32, bridge_y, body_thickness))

# ============================================
# 9. TAILPIECE - Stop bar style
# ============================================
tailpiece = (
    cq.Workplane("XY")
    .box(78, 14, 8)
).translate((0, tp_y, body_thickness + 4))

# Tailpiece posts
tp_post_l = (
    cq.Workplane("XY").circle(4).extrude(6)
).translate((-32, tp_y, body_thickness))
tp_post_r = (
    cq.Workplane("XY").circle(4).extrude(6)
).translate((32, tp_y, body_thickness))

# ============================================
# 10. CONTROL KNOBS (4 cylinders: 2 vol + 2 tone)
# ============================================
knobs = None
for kx, ky in knob_positions:
    k = (
        cq.Workplane("XY")
        .circle(knob_r)
        .extrude(knob_h)
    ).translate((kx, ky, body_thickness))
    knobs = k if knobs is None else knobs.union(k)

# ============================================
# 11. PICKUP TOGGLE SWITCH
# ============================================
toggle = (
    cq.Workplane("XY")
    .circle(3.5)
    .extrude(16)
).translate((-80, 158, body_thickness))

# ============================================
# 12. TUNING PEGS (3+3 arrangement)
#     Cylinders extending sideways from headstock
# ============================================
pegs = None
peg_spacing = 45.0

for i in range(3):
    peg_y = nut_y + 40 + i * peg_spacing

    # Left side tuner peg (extends in +X from left edge)
    left_peg = (
        cq.Workplane("YZ")
        .circle(5)
        .extrude(22)
    ).translate((-hs_width / 2 - 22, peg_y, neck_center_z))
    pegs = left_peg if pegs is None else pegs.union(left_peg)

    # Right side tuner peg (extends in +X from right edge)
    right_peg = (
        cq.Workplane("YZ")
        .circle(5)
        .extrude(22)
    ).translate((hs_width / 2, peg_y, neck_center_z))
    pegs = pegs.union(right_peg)

# Tuner string posts on headstock face
posts = None
for i in range(3):
    peg_y = nut_y + 40 + i * peg_spacing
    for sx in [-1, 1]:
        px = sx * (hs_width / 2 - 12)
        post = (
            cq.Workplane("XY")
            .circle(2.5)
            .extrude(8)
        ).translate((px, peg_y, neck_center_z + hs_thickness / 2))
        posts = post if posts is None else posts.union(post)

# ============================================
# 13. STRAP BUTTON (bottom of body)
# ============================================
strap_button = (
    cq.Workplane("XZ")
    .circle(5)
    .extrude(14)
).translate((0, -260, body_thickness / 2))

# ============================================
# OUTPUT JACK (small cylinder at bottom of body)
# ============================================
output_jack = (
    cq.Workplane("XY")
    .circle(6)
    .extrude(8)
).translate((0, -220, body_thickness / 2))

# ============================================
# ASSEMBLE ALL PARTS
# ============================================
result = body

# Structural parts
for part in [neck, fretboard, headstock, nut]:
    result = result.union(part)

# Hardware
for part in [neck_pickup, bridge_pickup, bridge, bridge_post_l,
             bridge_post_r, tailpiece, tp_post_l, tp_post_r]:
    result = result.union(part)

# Controls
result = result.union(knobs).union(toggle)

# Tuners
result = result.union(pegs).union(posts)

# Extras
result = result.union(strap_button).union(output_jack)