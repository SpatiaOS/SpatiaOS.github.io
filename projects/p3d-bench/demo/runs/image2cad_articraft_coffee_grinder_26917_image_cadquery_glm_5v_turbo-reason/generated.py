import cadquery as cq

# =============================================================================
# Coffee Grinder Model Parameters
# =============================================================================

# Base parameters
base_width = 80.0
base_depth = 80.0
base_height = 12.0
base_chamfer = 3.0

# Main body parameters
body_width = 58.0
body_depth = 58.0
body_height = 48.0
body_fillet = 4.0

# Drawer parameters
drawer_width = 38.0
drawer_height = 26.0
drawer_depth = 6.0
drawer_inset = 2.0
knob_diameter = 8.0
knob_height = 5.0

# Hopper (bean container) parameters
hopper_top_diameter = 68.0
hopper_bottom_diameter = 52.0
hopper_height = 42.0
hopper_rim_width = 4.0
hopper_rim_height = 5.0
wall_thickness = 2.5

# Central shaft parameters
shaft_diameter = 14.0
shaft_height = 28.0

# Crank handle parameters
handle_length = 38.0
handle_width = 10.0
handle_thickness = 4.0
handle_knob_diameter = 12.0
handle_offset = 18.0  # Distance from center

# =============================================================================
# Model Construction
# =============================================================================

# 1. Create the base with chamfered edges
base = (
    cq.Workplane("XY")
    .box(base_width, base_depth, base_height)
    .edges("|Z")
    .chamfer(base_chamfer)
)

# 2. Create the main body centered on base
body = (
    cq.Workplane("XY")
    .workplane(offset=base_height)
    .box(body_width, body_depth, body_height)
    # Select vertical edges for filleting using proper selector syntax
    .edges("|Z")
    .fillet(body_fillet)
)

# 3. Create the drawer front panel with knob
drawer = (
    cq.Workplane("XZ")
    .workplane(offset=-(body_depth/2) + drawer_inset + drawer_depth)
    # Drawer face plate
    .rect(drawer_width, drawer_height)
    .extrude(drawer_depth)
    # Add fillets to drawer edges
    .edges("|Z")
    .fillet(2.0)
)

# Add knob to drawer
drawer_knob = (
    cq.Workplane("XZ")
    .workplane(
        offset=-(body_depth/2) + drawer_inset + drawer_depth + knob_height/2,
        origin=(0, -drawer_height/4)
    )
    .circle(knob_diameter / 2)
    .extrude(knob_height)
)

# Combine drawer components
drawer_assembly = drawer.union(drawer_knob)

# Position drawer in the lower front portion of body
drawer_positioned = drawer_assembly.translate((
    0,
    -body_depth/2 + drawer_inset + drawer_depth/2,
    base_height + drawer_height/2 - 2
))

# 4. Create the hopper (conical bean container)
# Main hopper body (frustum of cone)
hopper_body = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height)
    .circle(hopper_bottom_diameter / 2)
    .workplane(offset=hopper_height)
    .circle(hopper_top_diameter / 2)
    .loft()
)

# Hopper rim (ring at top) - Fixed: Use makeTorus instead of non-existent .torus() method
hopper_rim_solid = cq.Solid.makeTorus(
    hopper_top_diameter/2 - hopper_rim_width/2, 
    hopper_rim_width/2
)
# Position the torus at the correct height
hopper_rim = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height + hopper_height - hopper_rim_height/2)
    .add(hopper_rim_solid)
)

# Inner cavity (to make it hollow looking)
inner_hopper = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height + 1)  # Slight offset from bottom
    .circle(hopper_bottom_diameter/2 - wall_thickness)
    .workplane(offset=hopper_height - 2)
    .circle(hopper_top_diameter/2 - wall_thickness)
    .loft()
)

# Combine hopper parts
hopper = hopper_body.union(hopper_rim)

# 5. Create central shaft
shaft = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height + hopper_height - shaft_height/2)
    .circle(shaft_diameter / 2)
    .extrude(shaft_height)
)

# 6. Create crank handle assembly
# Handle arm
handle_arm = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height + hopper_height)
    .center(handle_offset, 0)
    .box(handle_length, handle_width, handle_thickness)
    .edges("|Z")
    .fillet(1.5)
)

# Handle mounting bracket (connects to shaft)
mount_bracket = (
    cq.Workplane("XY")
    .workplane(offset=base_height + body_height + hopper_height)
    .box(12, handle_width + 4, handle_thickness + 2)
)

# Handle knob (spherical grip)
handle_knob = (
    cq.Workplane("XY")
    .workplane(
        offset=base_height + body_height + hopper_height,
        origin=(handle_offset + handle_length/2 - handle_knob_diameter/2, 0)
    )
    .sphere(handle_knob_diameter / 2)
)

# Combine handle components
crank_handle = handle_arm.union(mount_bracket).union(handle_knob)

# =============================================================================
# Final Assembly
# =============================================================================

result = (
    base
    .union(body)
    .union(drawer_positioned)
    .union(hopper)
    .union(shaft)
    .union(crank_handle)
)