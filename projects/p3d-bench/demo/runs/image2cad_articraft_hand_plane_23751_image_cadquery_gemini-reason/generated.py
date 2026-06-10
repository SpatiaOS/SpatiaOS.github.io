import cadquery as cq

# --- Parameters ---
# Base dimensions
base_length = 180.0
base_width_ends = 65.0
base_width_center = 75.0
base_thickness = 12.0
rim_thickness = 2.0
top_z = base_thickness - rim_thickness

# Knob dimensions
knob_dist = 140.0
knob_height = 45.0

# Mechanism dimensions
post_height = 75.0
nut_z_pos = base_thickness + 35

# --- Base ---
# Create the main body footprint using a sketch
base_sk = (
    cq.Sketch()
    .rect(base_length - base_width_ends, base_width_ends - 20)
    .push([( -knob_dist/2, 0), (knob_dist/2, 0)]).circle(base_width_ends/2)
    .push([(0, 0)]).rect(50, base_width_center)
    .clean()
)
base = cq.Workplane("XY").placeSketch(base_sk).extrude(base_thickness)

# Cut a pocket into the top to create the raised rim around the edge
inner_sk = (
    cq.Sketch()
    .rect(base_length - base_width_ends, base_width_ends - 26)
    .push([( -knob_dist/2, 0), (knob_dist/2, 0)]).circle(base_width_ends/2 - 3)
    .push([(0, 0)]).rect(44, base_width_center - 6)
    .clean()
)
base = base.faces(">Z").workplane().placeSketch(inner_sk).extrude(-rim_thickness, combine='cut')

# Central U-shaped cutout for the router blade clearance
u_cutout = cq.Workplane("XY").center(0, -15).rect(26, 40).extrude(20)
base = base.cut(u_cutout)

# Arch cutout underneath the base
arch = cq.Workplane("XZ").center(0, -29).circle(35).extrude(100, both=True)
base = base.cut(arch)

# Mounting holes in the base
# Fixed: directly use the base object to select faces and cut through it
base = base.faces(">Z").workplane().pushPoints([(-20, 15), (20, 15)]).circle(3).cutThruAll()

# --- Knobs ---
# Revolve a profile to create the classic wooden handles
knob_profile = (
    cq.Workplane("XZ")
    .lineTo(15, 0)
    .lineTo(15, 4)
    .threePointArc((10, 10), (12, 16))
    .threePointArc((20, 28), (0, knob_height))
    .close()
)
knob = knob_profile.revolve(360, (0,0,0), (0,0,1))

# Add a flat slot for the top mounting screw
knob = knob.faces(">Z").workplane().rect(12, 1.5).extrude(-2, combine='cut')

# --- Central Mechanism ---
# Boss base for the depth adjustment rod
boss = cq.Workplane("XY").workplane(offset=top_z).center(0, 15).circle(12).extrude(15)

# Main Blade Post (Hexagonal shaft)
post = cq.Workplane("XY").workplane(offset=-5).center(0, -5).polygon(6, 14).extrude(post_height)
post = post.faces(">Z").workplane().circle(6).extrude(5) # Cylindrical screw top

# Router Blade
blade = (
    cq.Workplane("YZ")
    .workplane(offset=-7) # Offset to align with the side of the hex post
    .moveTo(-5, -5)
    .lineTo(-5, -25)
    .lineTo(-25, -25)
    .lineTo(-25, -24) # Sharp cutting tip
    .lineTo(-20, -21)
    .lineTo(-9, -21)
    .lineTo(-9, -5)
    .close()
    .extrude(14)
)

# Threaded Depth Adjustment Rod
rod = cq.Workplane("XY").workplane(offset=top_z + 15).center(0, 15).circle(4).extrude(40)

# Depth Adjustment Nut (with knurled texture)
nut = cq.Workplane("XY").workplane(offset=nut_z_pos).center(0, 15).circle(14).extrude(5)
nut_texture = cq.Workplane("XY").workplane(offset=nut_z_pos).center(0, 15).polygon(20, 14.5).extrude(5)
nut = nut.union(nut_texture)

# Sliding Collar connecting the hex post and the adjustment rod
collar_z = nut_z_pos - 8
collar = (
    cq.Workplane("XY")
    .workplane(offset=collar_z)
    .pushPoints([(0, -5), (0, 15)])
    .cylinder(8, 14)
    .union(
        cq.Workplane("XY")
        .workplane(offset=collar_z)
        .center(0, 5)
        .box(28, 20, 8)
    )
)
# Cut clearance holes through the collar using explicit extrudes to avoid face center issues
collar = collar.cut(
    cq.Workplane("XY")
    .workplane(offset=collar_z)
    .center(0, -5)
    .polygon(6, 14.5)
    .extrude(20, both=True)
)
collar = collar.cut(
    cq.Workplane("XY")
    .workplane(offset=collar_z)
    .center(0, 15)
    .circle(4.5)
    .extrude(20, both=True)
)

# Locking Thumbscrew for the collar
ts_shaft = cq.Workplane("YZ").workplane(offset=18).center(-5, collar_z).cylinder(12, 3)
ts_head = cq.Workplane("YZ").workplane(offset=26).center(-5, collar_z).cylinder(4, 8)
thumbscrew = ts_shaft.union(ts_head)

# --- Left Side Edge Guide Post ---
left_post = cq.Workplane("XY").workplane(offset=top_z).center(-28, -5).circle(5).extrude(35)
left_boss = cq.Workplane("XY").workplane(offset=top_z).center(-28, -5).circle(9).extrude(12)
left_ts_shaft = cq.Workplane("YZ").workplane(offset=-32.5).center(-5, top_z + 6).cylinder(9, 2.5)
left_ts_head = cq.Workplane("YZ").workplane(offset=-39).center(-5, top_z + 6).cylinder(4, 7)

# --- Embossed Text and Logos ---
text_stanley = cq.Workplane("XY").workplane(offset=top_z).center(-40, -15).text("STANLEY", 6, 1.5)
text_no71 = cq.Workplane("XY").workplane(offset=top_z).center(40, -15).text("No. 71", 6, 1.5)
logo_box = cq.Workplane("XY").workplane(offset=top_z).center(-15, 15).rect(8, 8).extrude(1)
logo_inner = cq.Workplane("XY").workplane(offset=top_z).center(-15, 15).rect(5, 5).extrude(1.5)

# --- Final Assembly ---
result = (
    base
    .union(knob.translate((-knob_dist/2, 0, top_z)))
    .union(knob.translate((knob_dist/2, 0, top_z)))
    .union(boss)
    .union(post)
    .union(blade)
    .union(rod)
    .union(nut)
    .union(collar)
    .union(thumbscrew)
    .union(left_post)
    .union(left_boss)
    .union(left_ts_shaft)
    .union(left_ts_head)
    .union(text_stanley)
    .union(text_no71)
    .union(logo_box)
    .union(logo_inner)
)