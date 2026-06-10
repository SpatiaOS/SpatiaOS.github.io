import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Barrel Body
barrel_length = 260.0
barrel_max_r = 94.0
barrel_end_r = 72.0
barrel_inner_thickness = 15.0
num_staves = 18

# Hoops (Rings)
hoop1_r = 94.25
hoop1_w = 21.9
hoop1_y = 40.0

hoop2_r = 81.5
hoop2_w = 21.0
hoop2_y = 100.0

# Caps
cap_r = 70.6
cap_t = 12.0
cap_y = 120.0

# Bung (Top Fitting)
bung_r = 20.0
bung_h = 15.0
plug_r = 16.25
plug_h = 14.0

# Stand
stand_foot_l = 220.0
stand_foot_w = 25.0
stand_foot_h = 25.0
stand_foot_x = 50.0

saddle_l = 170.0
saddle_w = 25.0
saddle_h = 45.0
saddle_y = 60.0

# Calculated Z positions for stand to perfectly cradle the barrel
saddle_top_z = -80.0
saddle_z = saddle_top_z - saddle_h / 2.0
foot_z = saddle_top_z - saddle_h - stand_foot_h / 2.0


# ==========================================
# Modeling
# ==========================================

# 1. Barrel Staves
# Create the curved profile for a single stave
stave_profile = (
    cq.Workplane("XY")
    .moveTo(barrel_end_r - barrel_inner_thickness, -barrel_length / 2.0)
    .lineTo(barrel_end_r, -barrel_length / 2.0)
    .threePointArc((barrel_max_r, 0), (barrel_end_r, barrel_length / 2.0))
    .lineTo(barrel_end_r - barrel_inner_thickness, barrel_length / 2.0)
    .threePointArc((barrel_max_r - barrel_inner_thickness, 0), (barrel_end_r - barrel_inner_thickness, -barrel_length / 2.0))
    .close()
)

# Revolve to create one stave, then center it on the axis
stave_base = stave_profile.revolve(360.0 / num_staves, (0, 0, 0), (0, 1, 0))
stave_base = stave_base.rotate((0, 0, 0), (0, 1, 0), -180.0 / num_staves)

# Generate all 18 staves
staves = [stave_base.rotate((0, 0, 0), (0, 1, 0), i * 360.0 / num_staves).val() for i in range(num_staves)]


# 2. Hoops
def make_hoop(radius, width):
    return (
        cq.Workplane("XY")
        .moveTo(radius - 2.0, -width / 2.0)
        .lineTo(radius, -width / 2.0)
        .lineTo(radius, width / 2.0)
        .lineTo(radius - 2.0, width / 2.0)
        .close()
        .revolve(360, (0, 0, 0), (0, 1, 0))
    )

hoops = [
    make_hoop(hoop1_r, hoop1_w).translate((0, hoop1_y, 0)).val(),
    make_hoop(hoop1_r, hoop1_w).translate((0, -hoop1_y, 0)).val(),
    make_hoop(hoop2_r, hoop2_w).translate((0, hoop2_y, 0)).val(),
    make_hoop(hoop2_r, hoop2_w).translate((0, -hoop2_y, 0)).val()
]


# 3. Caps
def make_cap():
    return (
        cq.Workplane("XY")
        .moveTo(0, -cap_t / 2.0)
        .lineTo(cap_r, -cap_t / 2.0)
        .lineTo(cap_r, cap_t / 2.0)
        .lineTo(0, cap_t / 2.0)
        .close()
        .revolve(360, (0, 0, 0), (0, 1, 0))
    )

cap1 = make_cap().translate((0, cap_y, 0))
cap2 = make_cap().translate((0, -cap_y, 0))

# Front cap text decoration
text_emboss = (
    cq.Workplane("XZ")
    .text("Debowa", 25, 2)
).translate((0, cap_y + cap_t / 2.0, 0))

caps = [cap1.val(), cap2.val(), text_emboss.val()]


# 4. Bung (Top fitting)
bung_collar = (
    cq.Workplane("XY")
    .circle(bung_r)
    .extrude(bung_h)
    .faces(">Z")
    .workplane()
    .hole(15)
).translate((0, 0, barrel_max_r - 2.0))

bung_plug = (
    cq.Workplane("XY")
    .circle(plug_r)
    .extrude(plug_h)
).translate((0, 0, barrel_max_r - 2.0 + bung_h - 5.0))

bungs = [bung_collar.val(), bung_plug.val()]


# 5. Tap Sub-assembly
tap_y = cap_y + cap_t / 2.0
tap_z = -30.0

tap_spacer = (
    cq.Workplane("XZ")
    .circle(4)
    .extrude(40)
).translate((0, tap_y, tap_z))

tap_knob = (
    cq.Workplane("XY")
    .circle(15)
    .extrude(45)
).translate((0, tap_y + 25.0, tap_z - 25.0))

tap_lever = (
    cq.Workplane("XY")
    .sphere(8)
    .union(
        cq.Workplane("XY")
        .circle(2.5)
        .extrude(-25) # Pointing downwards
    )
).translate((0, tap_y + 40.0, tap_z))

taps = [tap_spacer.val(), tap_knob.val(), tap_lever.val()]


# 6. Stand
def make_foot():
    return (
        cq.Workplane("XY")
        .box(stand_foot_w, stand_foot_l, stand_foot_h)
        .edges("|X and >Z")
        .chamfer(10)
    )

foot1 = make_foot().translate((stand_foot_x, 0, foot_z))
foot2 = make_foot().translate((-stand_foot_x, 0, foot_z))

def make_saddle(y_pos):
    cutter = (
        cq.Workplane("XZ")
        .circle(barrel_max_r)
        .extrude(300)
        .translate((0, -150, 0))
    )
    return (
        cq.Workplane("XY")
        .box(saddle_l, saddle_w, saddle_h)
        .translate((0, y_pos, saddle_z))
        .cut(cutter)
    )

saddle1 = make_saddle(saddle_y)
saddle2 = make_saddle(-saddle_y)

# Key bar (central connecting bar for the stand)
key_bar = (
    cq.Workplane("XY")
    .box(25, 189, 25)
).translate((0, 0, foot_z + stand_foot_h/2.0 + 12.5))

stand = [foot1.val(), foot2.val(), saddle1.val(), saddle2.val(), key_bar.val()]


# ==========================================
# Final Assembly
# ==========================================

# Combine all parts into a single compound result
all_parts = staves + hoops + caps + bungs + taps + stand
result = cq.Compound.makeCompound(all_parts)