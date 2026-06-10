import cadquery as cq

# =============================================================
# Classic Coffee Grinder Model
# =============================================================

# --- Parameters ---
# Base plate
base_width = 100.0
base_depth = 100.0
base_height = 7.0
base_fillet_v = 2.0
base_fillet_h = 2.5

# Body (cube section)
body_width = 76.0
body_depth = 76.0
body_height = 65.0
body_fillet = 2.0

# Top plate
top_width = 100.0
top_depth = 100.0
top_height = 7.0
top_fillet_v = 2.0
top_fillet_h = 2.5

# Bowl/Hopper
bowl_bottom_radius = 36.0
bowl_top_radius = 48.0
bowl_height = 55.0
bowl_wall = 3.0

# Bowl rim
rim_outer_radius = 52.0
rim_height = 7.0

# Center shaft
shaft_radius = 4.5
shaft_height_above_rim = 30.0

# Handle
handle_length = 52.0
handle_width = 11.0
handle_thickness = 5.0
knob_radius = 7.5

# Drawer
drawer_width = 55.0
drawer_height = 28.0
drawer_recess = 1.5
drawer_knob_radius = 5.0

# Corner pillars
pillar_radius = 4.5

# Nameplate
nameplate_width = 45.0
nameplate_height = 14.0

# --- Derived values ---
body_base_z = base_height
top_base_z = base_height + body_height
bowl_base_z = top_base_z + top_height
rim_base_z = bowl_base_z + bowl_height
shaft_top_z = rim_base_z + rim_height + shaft_height_above_rim

# =============================================================
# Base plate
# =============================================================
base = (
    cq.Workplane("XY")
    .box(base_width, base_depth, base_height, centered=(True, True, False))
    .edges("|Z")
    .fillet(base_fillet_h)
    .edges("<Z or >Z")
    .fillet(base_fillet_v)
)

# =============================================================
# Body (cube with slight fillet on vertical edges)
# =============================================================
body = (
    cq.Workplane("XY")
    .workplane(offset=body_base_z)
    .box(body_width, body_depth, body_height, centered=(True, True, False))
    .edges("|Z")
    .fillet(body_fillet)
)

# =============================================================
# Top plate
# =============================================================
top_plate = (
    cq.Workplane("XY")
    .workplane(offset=top_base_z)
    .box(top_width, top_depth, top_height, centered=(True, True, False))
    .edges("|Z")
    .fillet(top_fillet_h)
    .edges(">Z or <Z")
    .fillet(top_fillet_v)
)

# =============================================================
# Bowl (conical/tapered hollow cylinder)
# =============================================================
# Outer shell
bowl_outer = (
    cq.Workplane("XY")
    .workplane(offset=bowl_base_z)
    .circle(bowl_bottom_radius)
    .workplane(offset=bowl_height)
    .circle(bowl_top_radius)
    .loft()
)

# Inner shell (cut out to make hollow)
bowl_inner = (
    cq.Workplane("XY")
    .workplane(offset=bowl_base_z + bowl_wall)
    .circle(bowl_bottom_radius - bowl_wall)
    .workplane(offset=bowl_height - bowl_wall)
    .circle(bowl_top_radius - bowl_wall)
    .loft()
)

bowl = bowl_outer.cut(bowl_inner)

# =============================================================
# Bowl rim (thick ring at the top of the bowl)
# =============================================================
bowl_rim = (
    cq.Workplane("XY")
    .workplane(offset=rim_base_z)
    .circle(rim_outer_radius)
    .circle(bowl_top_radius - bowl_wall)
    .extrude(rim_height)
)

# Fillet the top outer edge of rim
bowl_rim = bowl_rim.edges(">Z").fillet(rim_height / 2.5)

# =============================================================
# Circular seat ring on top plate (where bowl sits)
# =============================================================
seat_ring = (
    cq.Workplane("XY")
    .workplane(offset=top_base_z + top_height)
    .circle(bowl_bottom_radius + 4)
    .circle(bowl_bottom_radius - 2)
    .extrude(3.0)
)

# =============================================================
# Center shaft
# =============================================================
shaft = (
    cq.Workplane("XY")
    .workplane(offset=bowl_base_z)
    .circle(shaft_radius)
    .extrude(shaft_top_z - bowl_base_z)
)

# Shaft top bracket (square mount)
bracket_size = shaft_radius * 2.8
bracket_height = 10.0
bracket = (
    cq.Workplane("XY")
    .workplane(offset=shaft_top_z - bracket_height - handle_thickness)
    .rect(bracket_size, bracket_size)
    .extrude(bracket_height)
    .edges(">Z")
    .fillet(1.5)
)

# =============================================================
# Handle arm
# =============================================================
handle_z = shaft_top_z - handle_thickness
handle_arm = (
    cq.Workplane("XY")
    .workplane(offset=handle_z)
    .center(handle_length / 2, 0)
    .rect(handle_length, handle_width)
    .extrude(handle_thickness)
    .edges("|Z")
    .fillet(handle_width / 2 - 0.5)
)

# Handle knob (sphere at end of arm)
handle_knob = (
    cq.Workplane("XY")
    .transformed(offset=(handle_length, 0, handle_z + handle_thickness / 2))
    .sphere(knob_radius)
)

# =============================================================
# Corner pillars on body
# =============================================================
corner_x = body_width / 2 - pillar_radius - 3
corner_y = body_depth / 2 - pillar_radius - 3

pillar1 = (
    cq.Workplane("XY")
    .workplane(offset=body_base_z)
    .center(corner_x, corner_y)
    .circle(pillar_radius)
    .extrude(body_height)
)

pillar2 = (
    cq.Workplane("XY")
    .workplane(offset=body_base_z)
    .center(-corner_x, corner_y)
    .circle(pillar_radius)
    .extrude(body_height)
)

pillar3 = (
    cq.Workplane("XY")
    .workplane(offset=body_base_z)
    .center(corner_x, -corner_y)
    .circle(pillar_radius)
    .extrude(body_height)
)

pillar4 = (
    cq.Workplane("XY")
    .workplane(offset=body_base_z)
    .center(-corner_x, -corner_y)
    .circle(pillar_radius)
    .extrude(body_height)
)

# =============================================================
# Drawer front (recessed panel on front face)
# =============================================================
drawer_z_center = body_base_z + body_height * 0.45
drawer_front = (
    cq.Workplane("XZ")
    .workplane(offset=-body_depth / 2 - drawer_recess)
    .center(0, drawer_z_center)
    .rect(drawer_width, drawer_height)
    .extrude(drawer_recess)
    .edges("|Y")
    .fillet(1.0)
)

# Drawer knob
drawer_knob = (
    cq.Workplane("XZ")
    .transformed(offset=(-drawer_width / 4, -body_depth / 2 - drawer_recess - drawer_knob_radius + 2, drawer_z_center - drawer_height / 4))
    .sphere(drawer_knob_radius)
)

# =============================================================
# Nameplate (oval on front face)
# =============================================================
nameplate_z = body_base_z + body_height * 0.72
nameplate = (
    cq.Workplane("XZ")
    .workplane(offset=-body_depth / 2 - 1.0)
    .center(0, nameplate_z)
    .ellipse(nameplate_width / 2, nameplate_height / 2)
    .extrude(1.5)
)

# Nameplate border (slightly larger ellipse, thin)
nameplate_border = (
    cq.Workplane("XZ")
    .workplane(offset=-body_depth / 2 - 0.5)
    .center(0, nameplate_z)
    .ellipse(nameplate_width / 2 + 2, nameplate_height / 2 + 2)
    .ellipse(nameplate_width / 2 - 1, nameplate_height / 2 - 1)
    .extrude(1.0)
)

# =============================================================
# Assemble all parts
# =============================================================
result = (
    base
    .union(body)
    .union(top_plate)
    .union(seat_ring)
    .union(bowl)
    .union(bowl_rim)
    .union(shaft)
    .union(bracket)
    .union(handle_arm)
    .union(handle_knob)
    .union(pillar1)
    .union(pillar2)
    .union(pillar3)
    .union(pillar4)
    .union(drawer_front)
    .union(drawer_knob)
    .union(nameplate)
    .union(nameplate_border)
)