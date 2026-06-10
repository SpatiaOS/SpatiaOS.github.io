import cadquery as cq

# ==========================================
# Parameters
# ==========================================
seat_width = 110.0
seat_depth = 100.0
seat_thickness = 10.0
seat_height = 10.0 # Z-level of the seat's top face

leg_width = 25.0
leg_height = 100.0
leg_waist_radius = 140.0
leg_cut_depth = 5.0
leg_fillet = 2.0

backrest_height = 215.0
backrest_thickness = 10.0

armrest_radius = 50.0
armrest_thickness = 10.0

# ==========================================
# 1. Legs
# ==========================================
# Create a single leg with square top/bottom and filleted vertical corners
leg_base = cq.Workplane("XY").box(leg_width, leg_width, leg_height)
leg_base = leg_base.edges("|Z").fillet(leg_fillet)

# Create the waisted profile by cutting with 4 large cylinders
offset_val = leg_width / 2 + leg_waist_radius - leg_cut_depth

cutter_x_pos = cq.Workplane("YZ").workplane(offset=offset_val).center(0, 0).circle(leg_waist_radius).extrude(leg_width*2, both=True)
leg_base = leg_base.cut(cutter_x_pos)

cutter_x_neg = cq.Workplane("YZ").workplane(offset=-offset_val).center(0, 0).circle(leg_waist_radius).extrude(leg_width*2, both=True)
leg_base = leg_base.cut(cutter_x_neg)

cutter_y_pos = cq.Workplane("XZ").workplane(offset=offset_val).center(0, 0).circle(leg_waist_radius).extrude(leg_width*2, both=True)
leg_base = leg_base.cut(cutter_y_pos)

cutter_y_neg = cq.Workplane("XZ").workplane(offset=-offset_val).center(0, 0).circle(leg_waist_radius).extrude(leg_width*2, both=True)
leg_base = leg_base.cut(cutter_y_neg)

# Position the 4 legs under the seat
leg_x_offset = seat_width / 2 - leg_width / 2
leg_y_offset = seat_depth / 2 - leg_width / 2
leg_z_offset = -leg_height / 2

legs = cq.Workplane("XY")
for dx in [-1, 1]:
    for dy in [-1, 1]:
        legs = legs.add(leg_base.translate((dx * leg_x_offset, dy * leg_y_offset, leg_z_offset)))

# ==========================================
# 2. Seat
# ==========================================
seat = cq.Workplane("XY").workplane(offset=seat_thickness/2).box(seat_width, seat_depth, seat_thickness)

# Diamond cutouts on the top face
seat = (
    seat.faces(">Z").workplane()
    .rect(seat_width/2, seat_depth/2, forConstruction=True)
    .vertices()
    .polygon(4, 20)
    .cutBlind(-3)
)

# ==========================================
# 3. Armrests (Side Panels)
# ==========================================
def make_armrest(x_offset):
    # Base semicircular arch
    armrest = (
        cq.Workplane("YZ").workplane(offset=x_offset)
        .center(0, seat_height)
        .circle(armrest_radius)
        .extrude(armrest_thickness)
    ).cut(
        # Remove anything below the seat bottom
        cq.Workplane("XY").workplane(offset=-50).box(seat_depth*3, seat_depth*3, 100)
    )
    
    # Hexagon cutout on the outer face
    hex_cutter = (
        cq.Workplane("YZ").workplane(offset=x_offset + armrest_thickness/2)
        .center(0, seat_height + 15)
        .polygon(6, 15)
        .extrude(armrest_thickness * 2, both=True)
    )
    return armrest.cut(hex_cutter)

armrest_left = make_armrest(-seat_width/2)
armrest_right = make_armrest(seat_width/2 - armrest_thickness)

# ==========================================
# 4. Backrest
# ==========================================
backrest_y = seat_depth/2 - backrest_thickness/2
backrest_z = seat_thickness + backrest_height/2

backrest = (
    cq.Workplane("XY").workplane(offset=backrest_z)
    .center(0, backrest_y)
    .box(seat_width, backrest_thickness, backrest_height)
)

# Circular cluster of diamond through-holes
diamond_cutter = (
    cq.Workplane("XZ").workplane(offset=backrest_y - 20)
    .center(0, seat_height + 120)
    .polygon(4, 20) # Central diamond
    .center(0, 30).polygon(4, 15).center(0, -30) # Top
    .center(0, -30).polygon(4, 15).center(0, 30) # Bottom
    .center(30, 0).polygon(4, 15).center(-30, 0) # Right
    .center(-30, 0).polygon(4, 15).center(30, 0) # Left
    .extrude(40)
)
backrest = backrest.cut(diamond_cutter)

# Curved leaf contour step-cut on the front face
leaf_cutter = (
    cq.Workplane("XZ").workplane(offset=backrest_y - 15)
    .center(80, seat_height + 120)
    .circle(120)
    .extrude(15 + 2) # Cuts 2mm into the front face
)
backrest = backrest.cut(leaf_cutter)

# ==========================================
# 5. Final Assembly
# ==========================================
result = (
    cq.Workplane("XY")
    .add(legs)
    .add(seat)
    .add(armrest_left)
    .add(armrest_right)
    .add(backrest)
)