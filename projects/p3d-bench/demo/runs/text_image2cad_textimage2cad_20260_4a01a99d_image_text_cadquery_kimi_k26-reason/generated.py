import cadquery as cq

# ------------------------------------------------------------------
# Barrel assembly parameters
# ------------------------------------------------------------------
barrel_length        = 260.0
barrel_end_radius    = 80.0
barrel_center_radius = 92.5
barrel_axis_z        = 150.0

cap_diameter         = 141.2
cap_thickness        = 12.0
cap_radius           = cap_diameter / 2.0

hoop_large_od        = 188.5
hoop_small_od        = 163.0
hoop_height          = 21.0

collar_flange_r      = 20.0
collar_groove_r      = 16.25
collar_hub_r         = 13.75
collar_height        = 15.0

plug_radius          = 16.25
plug_height          = 14.0

# Front / back cap outer face positions
front_face_x         = -barrel_length / 2.0 - cap_thickness
back_face_x          =  barrel_length / 2.0

# Tap sub-assembly mounts on the front cap outer face
tap_x                = front_face_x
tap_z                = barrel_axis_z - 45.0

# ------------------------------------------------------------------
# Barrel body – solid of revolution with a bulged profile
# ------------------------------------------------------------------
barrel_profile = (
    cq.Workplane("XZ")
    .moveTo(-barrel_length/2, 0)
    .lineTo(-barrel_length/2, barrel_end_radius)
    .threePointArc((0, barrel_center_radius), (barrel_length/2, barrel_end_radius))
    .lineTo(barrel_length/2, 0)
    .close()
)
barrel = barrel_profile.revolve(360, (0,0,0), (1,0,0)).translate((0,0,barrel_axis_z))

# ------------------------------------------------------------------
# End caps
# ------------------------------------------------------------------
# Front decorated cap – extruded outward (-X) so the outer face is at front_face_x
front_cap = (
    cq.Workplane("YZ")
    .circle(cap_radius)
    .extrude(-cap_thickness)
    .translate((-barrel_length/2, 0, barrel_axis_z))
)
front_cap = front_cap.faces("<X").edges().chamfer(2.0)
front_cap = front_cap.faces("<X").edges().fillet(0.8)

# Locating boss on the rear face (protrudes into the barrel)
boss = (
    cq.Workplane("YZ", origin=(-barrel_length/2, 0, barrel_axis_z))
    .circle(10.0)
    .extrude(3.0)
)
front_cap = front_cap.union(boss)

# Rear plain cap – extruded outward (+X)
back_cap = (
    cq.Workplane("YZ")
    .circle(cap_radius)
    .extrude(cap_thickness)
    .translate((barrel_length/2, 0, barrel_axis_z))
)
back_cap = back_cap.faces(">X").edges().chamfer(2.0)
back_cap = back_cap.faces(">X").edges().fillet(0.8)

# ------------------------------------------------------------------
# Hoop rings – four annular bands
# ------------------------------------------------------------------
def make_hoop(od, height, x_pos):
    return (
        cq.Workplane("YZ")
        .circle(od/2)
        .extrude(height)
        .translate((x_pos - height/2, 0, barrel_axis_z))
    )

hoop1 = make_hoop(hoop_large_od, hoop_height, -30)
hoop2 = make_hoop(hoop_large_od, hoop_height,  30)
hoop3 = make_hoop(hoop_small_od, hoop_height, -125)
hoop4 = make_hoop(hoop_small_od, hoop_height,  125)

# ------------------------------------------------------------------
# Bung fitting – flanged collar + plug
# ------------------------------------------------------------------
collar_z = barrel_axis_z + barrel_center_radius

collar = (
    cq.Workplane("XY")
    .circle(collar_flange_r)
    .extrude(5)
    .faces(">Z")
    .circle(collar_groove_r)
    .extrude(3)
    .faces(">Z")
    .circle(collar_hub_r)
    .extrude(7)
)

# Countersunk through-hole (23 mm mouth → 15 mm bore)
countersink = (
    cq.Workplane("XY", origin=(0,0,15))
    .circle(23/2)
    .extrude(-5)
    .faces("<Z")
    .circle(15/2)
    .extrude(-10)
)
collar = collar.cut(countersink).translate((0,0,collar_z))

plug = (
    cq.Workplane("XY")
    .circle(plug_radius)
    .extrude(plug_height)
    .translate((0,0,collar_z + collar_height))
)
# Round the top and bottom rim edges of the plug
plug = plug.edges().fillet(2.0)

# ------------------------------------------------------------------
# Tap sub-assembly on the front face
# ------------------------------------------------------------------
# Spacer sleeve (tube through the cap, extending into the barrel)
sleeve = (
    cq.Workplane("YZ", origin=(tap_x, 0, tap_z))
    .circle(4.0)
    .circle(3.0)
    .extrude(40.0)
)

# Ball-lever handle (disc base + sphere + lever arm)
ball = cq.Workplane("YZ").sphere(8.0).translate((tap_x - 8.0, 0, tap_z))
base = (
    cq.Workplane("YZ")
    .circle(10.6)
    .extrude(2.0)
    .translate((tap_x - 2.0, 0, tap_z))
)
lever = (
    cq.Workplane("XZ")
    .circle(2.5)
    .extrude(18.0)
    .translate((tap_x - 8.0, 0, tap_z))
)

# Dual-lobe knob – two overlapping spheres with a blind bore
knob = cq.Workplane("YZ").sphere(15.0).translate((tap_x - 15.0, 0, tap_z))
knob = knob.union(cq.Workplane("YZ").sphere(12.0).translate((tap_x - 28.0, 0, tap_z)))
knob = knob.cut(
    cq.Workplane("YZ", origin=(tap_x, 0, tap_z))
    .circle(4.0)
    .extrude(-27.5)
)

# ------------------------------------------------------------------
# Cradle – feet, spacer with pads, and saddle supports
# ------------------------------------------------------------------
# Rear rectangular foot
back_foot = (
    cq.Workplane("XY")
    .box(25, 220, 25)
    .translate((80, 0, -12.5))
    .edges()
    .fillet(1.0)
)

# Front trapezoidal foot (22° angled sides)
front_foot = (
    cq.Workplane("XZ")
    .polyline([(-12.5, 0), (12.5, 0), (22.5, 25), (-22.5, 25)])
    .close()
    .extrude(220)
    .translate((-80, -110, -25))
    .edges()
    .fillet(1.0)
)

# Longitudinal spacer bar with raised pads
spacer = (
    cq.Workplane("XY")
    .box(180, 25, 25)
    .translate((0, 0, 12.5))
    .edges()
    .fillet(1.0)
)
pad1 = cq.Workplane("XY").box(50, 50, 10).translate((-60, 0, 30)).edges().fillet(0.5)
pad2 = cq.Workplane("XY").box(50, 50, 10).translate(( 60, 0, 30)).edges().fillet(0.5)
spacer = spacer.union(pad1).union(pad2)

# Saddle supports – wide blocks beneath the barrel
saddle1 = (
    cq.Workplane("XY")
    .box(50, 170, 25)
    .translate((-60, 0, 47.5))
    .edges()
    .fillet(1.0)
)
saddle2 = (
    cq.Workplane("XY")
    .box(50, 170, 25)
    .translate(( 60, 0, 47.5))
    .edges()
    .fillet(1.0)
)

cradle = back_foot.union(front_foot).union(spacer).union(saddle1).union(saddle2)

# ------------------------------------------------------------------
# Final unified assembly
# ------------------------------------------------------------------
result = (
    barrel
    .union(front_cap)
    .union(back_cap)
    .union(hoop1)
    .union(hoop2)
    .union(hoop3)
    .union(hoop4)
    .union(collar)
    .union(plug)
    .union(sleeve)
    .union(ball)
    .union(base)
    .union(lever)
    .union(knob)
    .union(cradle)
)