import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Rod and Canopy
rod_length = 500.0
rod_dia = 10.0
disc_dia = 180.0
disc_thick = 10.0

# Lamp Socket Hub (Plug and Flanged Bushing)
plug_rim_r = 23.0
plug_rim_h = 5.0
plug_body_r = 20.0
plug_body_h = 44.22
plug_taper_h = 28.0
plug_base_r = 15.0
flange_od = 56.5
flange_h = 3.25
boss_od = 44.25
boss_h = 8.0

# Lampshade Cage (Splined Rings and Vane Slats)
ring_id = 160.0
ring_od = 200.0
ring_thick = 3.9
slat_w = 50.0
slat_t = 3.9
slat_l = 300.0
slat_count = 40

# Lightbulb (Knob)
bulb_r = 30.0
bulb_h = 81.0

# Z-axis Coordinates (Vertical arrangement)
z_hub_top = 50.0
rod_bottom = z_hub_top - 10.0  # Rod goes 10mm into the plug's blind hole
z_canopy_top = rod_bottom + rod_length

z_plug_rim_bottom = z_hub_top - plug_rim_h
z_plug_body_bottom = z_plug_rim_bottom - plug_body_h
z_plug_bottom = z_plug_body_bottom - plug_taper_h

z_flange_top = z_plug_rim_bottom - boss_h
z_flange_bottom = z_flange_top - flange_h

z_top_ring = z_flange_bottom
z_bottom_ring = -194.55  # Placed symmetrically relative to the slats

z_slat_center = -80.4
z_slat_top = z_slat_center + slat_l / 2
z_slat_bottom = z_slat_center - slat_l / 2

# ==========================================
# Part Creation
# ==========================================

# 1. Disc Plate (Ceiling Canopy)
disc_plate = (
    cq.Workplane("XY").workplane(offset=z_canopy_top - disc_thick)
    .circle(disc_dia / 2).extrude(disc_thick)
    .faces(">Z").workplane().hole(rod_dia)
)

# 2. Rod (Pendant Stem)
rod = (
    cq.Workplane("XY").workplane(offset=rod_bottom)
    .circle(rod_dia / 2).extrude(rod_length)
)

# 3. Bushing Locating Plug (Upper socket body)
plug_profile = (
    cq.Workplane("XZ")
    .moveTo(0, z_hub_top)
    .lineTo(plug_rim_r, z_hub_top)
    .lineTo(plug_rim_r, z_plug_rim_bottom)
    .lineTo(plug_body_r, z_plug_rim_bottom)
    .lineTo(plug_body_r, z_plug_body_bottom)
    .lineTo(plug_base_r, z_plug_bottom)
    .lineTo(0, z_plug_bottom)
    .close()
)
# Revolve around the local Y axis of the XZ plane (which is the global Z axis)
plug = plug_profile.revolve(360, (0, 0, 0), (0, 1, 0))
# Central blind hole for rod insertion
plug = plug.faces(">Z").workplane().hole(24.0, 10.0)

# 4. Flanged Bushing (Lower socket collar)
flanged_bushing_profile = (
    cq.Workplane("XZ")
    .moveTo(plug_body_r, z_plug_rim_bottom)
    .lineTo(boss_od / 2, z_plug_rim_bottom)
    .lineTo(boss_od / 2, z_flange_top)
    .lineTo(flange_od / 2, z_flange_top)
    .lineTo(flange_od / 2, z_flange_bottom)
    .lineTo(plug_body_r, z_flange_bottom)
    .close()
)
flanged_bushing = flanged_bushing_profile.revolve(360, (0, 0, 0), (0, 1, 0))

# 5. Splined Rings (Lampshade frame)
def make_splined_ring(z_offset, has_spider=False):
    # Base annular ring
    ring = (
        cq.Workplane("XY").workplane(offset=z_offset)
        .circle(95.0).circle(ring_id / 2).extrude(-ring_thick)
    )
    # External teeth
    teeth = (
        cq.Workplane("XY").workplane(offset=z_offset)
        .polarArray(97.5, 0, 360, slat_count)
        .rect(5.0, 4.0).extrude(-ring_thick)
    )
    res = ring.union(teeth)
    
    # Optional spider to connect to the central hub
    if has_spider:
        spider_hub = (
            cq.Workplane("XY").workplane(offset=z_offset)
            .circle(35.0).circle(20.0).extrude(-ring_thick)
        )
        spokes = (
            cq.Workplane("XY").workplane(offset=z_offset)
            .polarArray(57.5, 0, 360, 4)
            .rect(45.0, 10.0).extrude(-ring_thick)
        )
        res = res.union(spider_hub).union(spokes)
        
    return res

top_ring = make_splined_ring(z_top_ring, has_spider=True)
bottom_ring = make_splined_ring(z_bottom_ring, has_spider=False)

# 6. Vane Slats (Lampshade fins)
# Creating the slightly bowed radial profile
slat_profile = (
    cq.Workplane("YZ")
    .moveTo(95.0, z_slat_top)
    .lineTo(95.0, z_slat_bottom)
    .lineTo(95.0 + slat_w, z_slat_bottom)
    .threePointArc((95.0 + slat_w + 20.0, z_slat_center), (95.0 + slat_w, z_slat_top))
    .close()
)
slat = slat_profile.extrude(slat_t / 2, both=True)

# Cut notches to allow the slats to seat onto the splined rings
notch1 = (
    cq.Workplane("YZ").workplane(offset=-slat_t)
    .moveTo(94.0, z_top_ring + 1.0)
    .rect(10.0, -(ring_thick + 2.0), centered=False)
    .extrude(slat_t * 2)
)
notch2 = (
    cq.Workplane("YZ").workplane(offset=-slat_t)
    .moveTo(94.0, z_bottom_ring + 1.0)
    .rect(10.0, -(ring_thick + 2.0), centered=False)
    .extrude(slat_t * 2)
)
slat = slat.cut(notch1).cut(notch2)

# Array 40 slats around the vertical axis
slat_solids = [slat.val().rotate((0, 0, 0), (0, 0, 1), i * 360.0 / slat_count) for i in range(slat_count)]
slats = cq.Workplane("XY").add(slat_solids)

# 7. Knob (Lightbulb capping the hub from below)
z_bulb_top = z_plug_bottom
z_bulb_bottom = z_plug_bottom - bulb_h
z_bulb_center = z_bulb_bottom + bulb_r

# Sphere at the bottom
knob_sphere = cq.Workplane("XY").workplane(offset=z_bulb_center).sphere(bulb_r)
# Cone lofts from the center of the sphere up to the plug base
knob_cone = (
    cq.Workplane("XY").workplane(offset=z_bulb_center)
    .circle(bulb_r)
    .workplane(offset=z_bulb_top - z_bulb_center)
    .circle(plug_base_r)
    .loft()
)
knob = knob_sphere.union(knob_cone)

# ==========================================
# Final Assembly
# ==========================================

result = (
    disc_plate
    .union(rod)
    .union(plug)
    .union(flanged_bushing)
    .union(top_ring)
    .union(bottom_ring)
    .union(slats)
    .union(knob)
)