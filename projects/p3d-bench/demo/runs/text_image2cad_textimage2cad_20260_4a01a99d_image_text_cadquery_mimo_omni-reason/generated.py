import cadquery as cq

# ===================== Parameter Definitions =====================
# Barrel stave parameters
stave_length = 259.6
stave_width = 33
stave_height = 33.5
num_staves = 18
barrel_radius = 94.5  # Approximate radius to stave center
stave_thickness = 1.0  # Simplified thickness

# Hoop ring parameters
hoop_large_outer_radius = 94.25
hoop_large_inner_radius = 84.25
hoop_large_height = 21.9
hoop_small_outer_radius = 81.5
hoop_small_inner_radius = 71.5
hoop_small_height = 21

# Cap parameters
cap_diameter = 141.2
cap_thickness = 12
cap_radius = cap_diameter / 2
decorated_boss_radius = 10
decorated_boss_depth = 3

# Flanged collar parameters
collar_flange_radius = 20
collar_hub_radius = 13.75
collar_height = 15
collar_countersink_mouth_radius = 23 / 2
collar_countersink_bore_radius = 15 / 2
collar_countersink_depth = 5

# Plug parameters
plug_radius = 16.25
plug_height = 14

# Tap sub-assembly parameters
knob_sphere_radius = 16
knob_bore_radius = 4
knob_bore_depth = 27.5
ball_lever_sphere_radius = 5
ball_lever_lever_diameter = 5
ball_lever_lever_length = 17.4
ball_lever_base_radius = 10.6
spacer_outer_radius = 4
spacer_inner_radius = 3
spacer_length = 40

# Cradle parameters
saddle_length = 170
saddle_width = 45
saddle_height = 25
saddle_cutout_radius = 12.5
crossbar_length = 220
crossbar_width = 25
crossbar_height = 25
crossbar_fillet_radius = 1
key_length = 189
key_width = 25
key_height = 25
key_angle = 22  # degrees

# ===================== Part Creation =====================
# 1. Barrel Body (18 staves) - Simplified as a cylinder
barrel_body = (
    cq.Workplane("XY")
    .circle(barrel_radius)
    .extrude(stave_length)
    .translate((0, 0, -stave_length / 2))
)

# 2. Hoop Rings (2 large, 2 small)
hoop_large = (
    cq.Workplane("XY")
    .circle(hoop_large_outer_radius)
    .circle(hoop_large_inner_radius)
    .extrude(hoop_large_height)
    .translate((0, 0, -hoop_large_height / 2))
)
hoop_small = (
    cq.Workplane("XY")
    .circle(hoop_small_outer_radius)
    .circle(hoop_small_inner_radius)
    .extrude(hoop_small_height)
    .translate((0, 0, -hoop_small_height / 2))
)
# Position hoops along barrel
hoop1_large = hoop_large.translate((0, 0, -stave_length / 4))
hoop2_large = hoop_large.translate((0, 0, stave_length / 4))
hoop1_small = hoop_small.translate((0, 0, 0))
hoop2_small = hoop_small.translate((0, 0, stave_length / 2))

# 3. Caps (plain and decorated)
plain_cap = (
    cq.Workplane("XY")
    .circle(cap_radius)
    .extrude(cap_thickness)
    .translate((0, 0, -stave_length / 2 - cap_thickness / 2))
)
decorated_cap = (
    cq.Workplane("XY")
    .circle(cap_radius)
    .extrude(cap_thickness)
    .translate((0, 0, stave_length / 2 + cap_thickness / 2))
    .workplane(offset=cap_thickness)
    .circle(decorated_boss_radius)
    .extrude(-decorated_boss_depth)
)

# 4. Flanged Collar (bung fitting)
flanged_collar = (
    cq.Workplane("XY")
    .circle(collar_flange_radius)
    .extrude(collar_height)
    .translate((0, 0, stave_length / 2 + collar_height / 2))
    .workplane(offset=collar_height)
    .circle(collar_hub_radius)
    .extrude(5)
    .workplane(offset=0)
    .hole(collar_countersink_bore_radius * 2, collar_countersink_depth)
    .workplane(offset=collar_countersink_depth)
    .hole(collar_countersink_mouth_radius * 2, collar_height - collar_countersink_depth)
)

# 5. Plug (cylindrical cap for collar)
plug = (
    cq.Workplane("XY")
    .circle(plug_radius)
    .extrude(plug_height)
    .translate((0, 0, stave_length / 2 + collar_height + plug_height / 2))
)

# 6. Tap Sub-Assembly
# Knob
knob = (
    cq.Workplane("XY")
    .sphere(knob_sphere_radius)
    .workplane(offset=knob_sphere_radius)
    .hole(knob_bore_radius * 2, knob_bore_depth)
    .translate((0, 0, -stave_length / 2 - cap_thickness - knob_sphere_radius))
)
# Ball Lever Handle
ball_lever = (
    cq.Workplane("XY")
    .sphere(ball_lever_sphere_radius)
    .workplane(offset=ball_lever_sphere_radius)
    .cylinder(ball_lever_lever_length, ball_lever_lever_diameter / 2)
    .translate((0, 0, -stave_length / 2 - cap_thickness - knob_sphere_radius - ball_lever_sphere_radius))
    .workplane(offset=ball_lever_sphere_radius)
    .circle(ball_lever_base_radius)
    .extrude(0.49)
)
# Spacer Sleeve
spacer = (
    cq.Workplane("XY")
    .circle(spacer_outer_radius)
    .circle(spacer_inner_radius)
    .extrude(spacer_length)
    .translate((0, 0, -stave_length / 2 - cap_thickness - knob_sphere_radius - ball_lever_sphere_radius - spacer_length / 2))
)

# 7. Cradle Assembly
# Saddle Supports (2)
saddle1 = (
    cq.Workplane("XY")
    .box(saddle_length, saddle_width, saddle_height)
    .workplane(offset=saddle_height / 2)
    .circle(saddle_cutout_radius)
    .cutThruAll()
    .edges("|Z").fillet(crossbar_fillet_radius)
)
saddle2 = saddle1.mirror("XZ")
# Crossbars (2)
crossbar1 = (
    cq.Workplane("XY")
    .box(crossbar_length, crossbar_width, crossbar_height)
    .edges("|Z").fillet(crossbar_fillet_radius)
    .translate((0, 0, -saddle_height / 2 - crossbar_height / 2))
)
crossbar2 = crossbar1.translate((0, saddle_width, 0))
# Key Bar (trapezoidal cross-section) - Fixed polygon creation
key_bar = (
    cq.Workplane("XY")
    .polyline([
        (-key_width / 2, -key_height / 2),
        (key_width / 2, -key_height / 2),
        (key_width / 2 + key_height * (key_angle / 90), key_height / 2),
        (-key_width / 2 - key_height * (key_angle / 90), key_height / 2),
    ])
    .close()
    .extrude(key_length)
    .edges("|Z").fillet(crossbar_fillet_radius)
    .translate((0, 0, -saddle_height / 2 - key_height / 2))
)

# ===================== Final Assembly =====================
result = (
    barrel_body
    .union(hoop1_large)
    .union(hoop2_large)
    .union(hoop1_small)
    .union(hoop2_small)
    .union(plain_cap)
    .union(decorated_cap)
    .union(flanged_collar)
    .union(plug)
    .union(knob)
    .union(ball_lever)
    .union(spacer)
    .union(saddle1)
    .union(saddle2)
    .union(crossbar1)
    .union(crossbar2)
    .union(key_bar)
)