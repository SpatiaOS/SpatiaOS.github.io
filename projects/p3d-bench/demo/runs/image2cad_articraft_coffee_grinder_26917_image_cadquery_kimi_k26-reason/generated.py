import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Base structure
base_w = 50.0
base_d = 50.0
base_h = 34.0

# Bottom foot plate
foot_w = 70.0
foot_d = 70.0
foot_h = 4.0

# Molding step between foot and base box
base_molding_w = base_w + 6.0
base_molding_d = base_d + 6.0
base_molding_h = 2.0

# Top platform (overhangs the base)
platform_w = 72.0
platform_d = 72.0
platform_h = 5.0

# Bowl (tapered hopper)
bowl_bottom_d = 52.0
bowl_top_d = 66.0
bowl_h = 36.0
bowl_wall = 3.0

# Central shaft and crank
shaft_d = 10.0
shaft_h = 50.0  # from platform top to shaft top

clamp_w = 14.0
clamp_d = 10.0
clamp_h = 5.0

handle_len = 46.0
handle_w = 8.0
handle_t = 3.0

knob_d = 10.0
knob_stem_d = 4.0
knob_stem_h = 2.0

bolt_head_d = 7.0
bolt_head_h = 2.5

# Drawer and badge on front face
drawer_w = 38.0
drawer_h = 16.0
drawer_t = 2.5
drawer_knob_d = 8.0

badge_w = 30.0
badge_h = 10.0
badge_t = 1.5

# ==========================================
# Derived heights
# ==========================================
foot_z = 0.0
molding_z = foot_z + foot_h
base_z = molding_z + base_molding_h
platform_z = base_z + base_h
platform_top_z = platform_z + platform_h
shaft_top_z = platform_top_z + shaft_h
front_y = -base_d / 2.0

# ==========================================
# Base Assembly
# ==========================================

# Wide bottom foot plate
foot = cq.Workplane("XY").box(foot_w, foot_d, foot_h, centered=True)

# Molding step just above the foot
base_molding = (
    cq.Workplane("XY")
    .workplane(offset=molding_z)
    .box(base_molding_w, base_molding_d, base_molding_h, centered=True)
)

# Main rectangular base box
base = (
    cq.Workplane("XY")
    .workplane(offset=base_z)
    .box(base_w, base_d, base_h, centered=True)
)

# Top platform that overhangs the base
platform = (
    cq.Workplane("XY")
    .workplane(offset=platform_z)
    .box(platform_w, platform_d, platform_h, centered=True)
)

# ==========================================
# Bowl (hollow tapered frustum)
# ==========================================

# Raised retaining ring on platform where bowl sits
ring_od = bowl_bottom_d + 6.0
ring_id = bowl_bottom_d
ring_h = 2.5
retaining_ring = (
    cq.Workplane("XY")
    .workplane(offset=platform_top_z)
    .circle(ring_od / 2.0)
    .circle(ring_id / 2.0)
    .extrude(ring_h)
)

# Outer shell of bowl
bowl_outer = (
    cq.Workplane("XY")
    .workplane(offset=platform_top_z)
    .circle(bowl_bottom_d / 2.0)
    .workplane(offset=bowl_h)
    .circle(bowl_top_d / 2.0)
    .loft()
)

# Inner cavity to hollow out the bowl
bowl_inner = (
    cq.Workplane("XY")
    .workplane(offset=platform_top_z + bowl_wall)
    .circle((bowl_bottom_d - 2.0 * bowl_wall) / 2.0)
    .workplane(offset=bowl_h)
    .circle((bowl_top_d - 2.0 * bowl_wall) / 2.0)
    .loft()
)

bowl = bowl_outer.cut(bowl_inner)

# ==========================================
# Shaft and Crank Handle
# ==========================================

# Vertical shaft rising from platform center
shaft = (
    cq.Workplane("XY")
    .workplane(offset=platform_top_z)
    .circle(shaft_d / 2.0)
    .extrude(shaft_h)
)

# Clamp bracket fixed to the top of the shaft
clamp = (
    cq.Workplane("XY")
    .workplane(offset=shaft_top_z)
    .box(clamp_w, clamp_d, clamp_h, centered=True)
)

# Hex bolt head on top of the clamp
bolt_head = (
    cq.Workplane("XY")
    .workplane(offset=shaft_top_z + clamp_h)
    .polygon(6, bolt_head_d)
    .extrude(bolt_head_h)
)

# Handle bar extending radially in +X
handle_z = shaft_top_z + clamp_h / 2.0 - handle_t / 2.0
handle = (
    cq.Workplane("XY")
    .workplane(offset=handle_z)
    .box(handle_len, handle_w, handle_t, centered=False)
    .translate((0, -handle_w / 2.0, 0))
)

# Short stem for the knob at the end of the handle
knob_stem = (
    cq.Workplane("XY")
    .workplane(offset=handle_z + handle_t)
    .circle(knob_stem_d / 2.0)
    .extrude(knob_stem_h)
    .translate((handle_len, 0, 0))
)

# Spherical crank knob
knob = (
    cq.Workplane("XY")
    .workplane(offset=handle_z + handle_t + knob_stem_h + knob_d / 2.0)
    .sphere(knob_d / 2.0)
    .translate((handle_len, 0, 0))
)

# ==========================================
# Drawer and Badge (Front Face)
# ==========================================

# Drawer front plate centered on the lower portion of the base front face
drawer_z = base_z + 4.0 + drawer_h / 2.0
drawer = (
    cq.Workplane("XY", origin=(0, front_y, drawer_z))
    .transformed(rotate=(90, 0, 0))
    .rect(drawer_w, drawer_h)
    .extrude(drawer_t)
)

# Round drawer pull knob
drawer_knob = (
    cq.Workplane("XY")
    .sphere(drawer_knob_d / 2.0)
    .translate((0, front_y - drawer_t - drawer_knob_d / 2.0, drawer_z))
)

# Oval badge plate above the drawer
badge_z = base_z + base_h - 7.0
badge = (
    cq.Workplane("XY", origin=(0, front_y, badge_z))
    .transformed(rotate=(90, 0, 0))
    .ellipse(badge_w / 2.0, badge_h / 2.0)
    .extrude(badge_t)
)

# ==========================================
# Final Assembly
# ==========================================
result = (
    foot
    .union(base_molding)
    .union(base)
    .union(platform)
    .union(retaining_ring)
    .union(bowl)
    .union(shaft)
    .union(clamp)
    .union(bolt_head)
    .union(handle)
    .union(knob_stem)
    .union(knob)
    .union(drawer)
    .union(drawer_knob)
    .union(badge)
)