import cadquery as cq
import math

# =============================================================================
# Assembly Parameters
# =============================================================================

# --- Disc plate (top anchor) ---
disc_dia = 180.0
disc_thick = 10.0
disc_hole_dia = 10.0
z_disc_top = 400.0                     # top face height

# --- Rod ---
rod_dia = 10.0
rod_len = 500.0

# --- Flanged bushing ---
bushing_od = 56.5
bushing_bore = 40.0
bushing_height = 11.25
bushing_flange_thick = 3.25
bushing_boss_od = 44.25
bushing_boss_height = bushing_height - bushing_flange_thick   # 8.0

# --- Bushing / locating plug ---
plug_rim_r = 23.0
plug_body_r = 20.0
plug_rim_h = 5.0
plug_body_h = 44.22
plug_taper_h = 77.0 - plug_rim_h - plug_body_h               # ~27.78
plug_blind_bore_dia = 24.0
plug_blind_bore_depth = 10.0
plug_total_h = 77.0

# --- Knob (caps the lower hub) ---
knob_base_r = 10.0                     # matched to plug taper end
knob_dome_r = 30.0
knob_height = 81.0
knob_cone_h = knob_height - knob_dome_r  # 51.0

# --- Splined ring ---
ring_od = 200.0
ring_id = 160.0
ring_thick = 3.9
ring_teeth = 40
ring_body_od = 190.0                   # body radius 95, teeth protrude to 100
z_ring_center = -130.0

# --- Vane slats (x40) ---
slat_count = 40
slat_thick = 3.9                       # circumferential
slat_width = 50.0                      # radial
slat_height = 300.0
z_slat_center = -80.4
slat_inner_radius = 88.5               # yields ~277 mm max assembly width

# =============================================================================
# Derived positions
# =============================================================================
z_disc_bottom = z_disc_top - disc_thick
z_rod_bottom = z_disc_bottom - rod_len
z_bushing_bottom = z_rod_bottom
z_plug_top = z_bushing_bottom
z_plug_bottom = z_plug_top - plug_total_h
z_knob_top = z_plug_bottom
z_knob_bottom = z_knob_top - knob_height

# =============================================================================
# Part modeling
# =============================================================================

# --- Disc plate ---
disc = (
    cq.Workplane("XY")
    .workplane(offset=z_disc_bottom)
    .circle(disc_dia / 2)
    .extrude(disc_thick)
)
disc = disc.faces(">Z").workplane().hole(disc_hole_dia)

# --- Rod ---
rod = (
    cq.Workplane("XY")
    .workplane(offset=z_disc_bottom)
    .circle(rod_dia / 2)
    .extrude(-rod_len)
)

# --- Flanged bushing ---
bushing = (
    cq.Workplane("XZ")
    .moveTo(0, z_bushing_bottom)
    .lineTo(bushing_od / 2, z_bushing_bottom)
    .lineTo(bushing_od / 2, z_bushing_bottom + bushing_flange_thick)
    .lineTo(bushing_boss_od / 2, z_bushing_bottom + bushing_flange_thick)
    .lineTo(bushing_boss_od / 2, z_bushing_bottom + bushing_height)
    .lineTo(0, z_bushing_bottom + bushing_height)
    .close()
    .revolve(axisStart=(0, 0, -1000), axisEnd=(0, 0, 1000))
)
bushing = bushing.faces(">Z").workplane().hole(bushing_bore)

# --- Bushing / locating plug ---
plug = (
    cq.Workplane("XZ")
    .moveTo(0, z_plug_top)
    .lineTo(plug_rim_r, z_plug_top)
    .lineTo(plug_rim_r, z_plug_top - plug_rim_h)
    .lineTo(plug_body_r, z_plug_top - plug_rim_h)
    .lineTo(plug_body_r, z_plug_top - plug_rim_h - plug_body_h)
    .lineTo(knob_base_r, z_plug_bottom)
    .lineTo(0, z_plug_bottom)
    .close()
    .revolve(axisStart=(0, 0, -1000), axisEnd=(0, 0, 1000))
)
plug = plug.faces(">Z").workplane().hole(plug_blind_bore_dia, depth=plug_blind_bore_depth)

# --- Knob ---
knob = (
    cq.Workplane("XZ")
    .moveTo(0, z_knob_top)
    .lineTo(knob_base_r, z_knob_top)
    .lineTo(knob_dome_r, z_knob_top - knob_cone_h)
    .radiusArc((0, z_knob_bottom), knob_dome_r)
    .close()
    .revolve(axisStart=(0, 0, -1000), axisEnd=(0, 0, 1000))
)

# --- Splined ring ---
ring_base = (
    cq.Workplane("XY")
    .workplane(offset=z_ring_center - ring_thick / 2)
    .circle(ring_body_od / 2)
    .circle(ring_id / 2)
    .extrude(ring_thick)
)

tooth_proto = (
    cq.Workplane("XY")
    .box(6, 5, ring_thick, centered=True)
    .translate((0, ring_body_od / 2 + 2.5, z_ring_center))
)

teeth = tooth_proto
for i in range(1, ring_teeth):
    teeth = teeth.union(
        tooth_proto.rotate((0, 0, 0), (0, 0, 1), i * 360.0 / ring_teeth)
    )

ring = ring_base.union(teeth)

# --- Vane slats ---
slat_proto = (
    cq.Workplane("XY")
    .box(slat_width, slat_thick, slat_height, centered=True)
    .translate((slat_inner_radius + slat_width / 2, 0, z_slat_center))
)

slats = slat_proto
for i in range(1, slat_count):
    slats = slats.union(
        slat_proto.rotate((0, 0, 0), (0, 0, 1), i * 360.0 / slat_count)
    )

# =============================================================================
# Unify into a single model
# =============================================================================
result = (
    disc
    .union(rod)
    .union(bushing)
    .union(plug)
    .union(knob)
    .union(ring)
    .union(slats)
)