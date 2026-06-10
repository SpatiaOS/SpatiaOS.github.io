import cadquery as cq
import math

# ============================================================
# Parameters
# ============================================================

# Ceiling disc plate
disc_radius = 90.0
disc_thickness = 10.0
disc_hole_dia = 10.0

# Suspension rod
rod_radius = 5.0
rod_length = 500.0

# Flanged bushing (hub)
fb_flange_r = 28.25
fb_boss_r = 22.125
fb_bore_dia = 40.0
fb_boss_h = 8.0
fb_flange_h = 3.25

# Locating plug (hub)
plug_body_r = 20.0
plug_rim_r = 23.0
plug_body_h = 44.22
plug_rim_h = 5.0
plug_taper_h = 28.0
plug_tip_r = 5.0
plug_bore_dia = 24.0
plug_bore_depth = 10.0

# Splined ring
ring_outer_r = 100.0
ring_bore_r = 80.0
ring_thick = 3.9

# Vane slats
num_slats = 40
slat_thick = 3.9
slat_width = 50.0
slat_height = 300.0
barrel_r = 572.5
slat_base_r = 80.0

# Knob
knob_sphere_r = 30.0
knob_total_h = 81.0
knob_base_r = 10.0

# Barrel sagitta (outward bow at midpoint)
barrel_sag = barrel_r - math.sqrt(barrel_r**2 - (slat_height / 2.0)**2)

# ============================================================
# Vertical layout (Z up, disc top at Z=0)
# ============================================================
z_disc_center = -disc_thickness / 2.0
z_rod_top = -disc_thickness + 0.15
z_rod_bot = z_rod_top - rod_length
z_rod_center = (z_rod_top + z_rod_bot) / 2.0

# Hub top near rod bottom
z_hub_top = z_rod_bot + 5.0
z_fb_top = z_hub_top
z_fb_bot = z_fb_top - fb_boss_h - fb_flange_h

z_plug_top = z_hub_top
z_plug_bot = z_plug_top - plug_rim_h - plug_body_h - plug_taper_h

z_ring_bot = z_fb_bot - 0.5
z_ring_top = z_ring_bot + ring_thick

# Cage slats start near the ring and extend downward
z_cage_top = z_ring_bot + 8.0
z_cage_bot = z_cage_top - slat_height

# Knob caps hub from above (dome up, stem down)
z_knob_bot = z_hub_top - 5.0
z_knob_top = z_knob_bot + knob_total_h

# ============================================================
# 1. Disc Plate
# ============================================================
disc = (
    cq.Workplane("XY")
    .workplane(offset=z_disc_center)
    .cylinder(disc_thickness, disc_radius)
    .faces(">Z").workplane()
    .hole(disc_hole_dia)
)

# ============================================================
# 2. Suspension Rod
# ============================================================
rod = (
    cq.Workplane("XY")
    .workplane(offset=z_rod_center)
    .cylinder(rod_length, rod_radius)
)

# ============================================================
# 3. Flanged Bushing
# ============================================================
bushing_boss = (
    cq.Workplane("XY")
    .workplane(offset=z_fb_top - fb_boss_h / 2.0)
    .cylinder(fb_boss_h, fb_boss_r)
)
bushing_flange = (
    cq.Workplane("XY")
    .workplane(offset=z_fb_top - fb_boss_h - fb_flange_h / 2.0)
    .cylinder(fb_flange_h, fb_flange_r)
)
bushing = bushing_boss.union(bushing_flange)
bushing = bushing.faces(">Z").workplane().hole(fb_bore_dia)

# ============================================================
# 4. Locating Plug (rim + body + tapered base)
# ============================================================
plug_rim = (
    cq.Workplane("XY")
    .workplane(offset=z_plug_top - plug_rim_h / 2.0)
    .cylinder(plug_rim_h, plug_rim_r)
)
plug_body = (
    cq.Workplane("XY")
    .workplane(offset=z_plug_top - plug_rim_h - plug_body_h / 2.0)
    .cylinder(plug_body_h, plug_body_r)
)
# Truncated cone for taper
plug_taper = (
    cq.Workplane("XY")
    .workplane(offset=z_plug_bot)
    .circle(plug_tip_r)
    .workplane(offset=plug_taper_h)
    .circle(plug_body_r)
    .loft()
)
plug = plug_rim.union(plug_body).union(plug_taper)
# Blind bore from top
plug = plug.faces(">Z").workplane().hole(plug_bore_dia, plug_bore_depth)

# ============================================================
# 5. Splined Ring (simplified as plain annular ring)
# ============================================================
ring = (
    cq.Workplane("XY")
    .workplane(offset=z_ring_bot)
    .circle(ring_outer_r)
    .circle(ring_bore_r)
    .extrude(ring_thick)
)

# ============================================================
# 6. Vane Slats — 40 barrel-curved radial fins
# ============================================================
half_h = slat_height / 2.0
cx_ends = slat_base_r + slat_width / 2.0
cx_mid = slat_base_r + barrel_sag + slat_width / 2.0

# One slat via 3-section loft (bottom, middle, top)
one_slat = (
    cq.Workplane("XY")
    .workplane(offset=z_cage_bot)
    .center(cx_ends, 0)
    .rect(slat_width, slat_thick)
    .workplane(offset=half_h)
    .center(barrel_sag, 0)
    .rect(slat_width, slat_thick)
    .workplane(offset=half_h)
    .center(-barrel_sag, 0)
    .rect(slat_width, slat_thick)
    .loft()
)

# Replicate around Z axis
all_slats = one_slat
for i in range(1, num_slats):
    angle = i * 360.0 / num_slats
    all_slats = all_slats.union(
        one_slat.rotate((0, 0, 0), (0, 0, 1), angle)
    )

# ============================================================
# 7. Knob (spherical dome + conical stem, revolved profile)
# ============================================================
knob_cone_h = knob_total_h - knob_sphere_r
z_sph_ctr = z_knob_bot + knob_cone_h

# Arc midpoint at 45° on the sphere
arc_mx = knob_sphere_r * math.sin(math.radians(45))
arc_mz = z_sph_ctr + knob_sphere_r * math.cos(math.radians(45))

knob = (
    cq.Workplane("XZ")
    .moveTo(0, z_knob_top)
    .threePointArc((arc_mx, arc_mz), (knob_sphere_r, z_sph_ctr))
    .lineTo(knob_base_r, z_knob_bot)
    .lineTo(0, z_knob_bot)
    .close()
    .revolve(360, (0, 0), (0, 1))
)

# ============================================================
# Final Assembly — union all parts
# ============================================================
result = (
    disc
    .union(rod)
    .union(bushing)
    .union(plug)
    .union(ring)
    .union(all_slats)
    .union(knob)
)