import cadquery as cq

# ---------------------------------------------------------------------------
# Assembly: four pistons stepping upward, each linked by an I-beam connecting
# rod to a disc boss on a shared slender shaft (single unified model).
# All dimensions in mm.
# ---------------------------------------------------------------------------

# ---- Shared shaft ----
shaft_len = 438.0          # overall shaft length
shaft_r = 3.0              # Ø6 backbone rod

# ---- Disc bosses and bracket arms on the shaft ----
disc_r = 15.0              # Ø30 disc boss
disc_w = 14.0              # boss thickness
disc_slot_w = 3.5          # narrow slot across each boss
arm_wx = 10.0              # bracket arm width (along shaft X)
arm_wy = 8.0               # bracket arm width (transverse Y)
arm_slot_w = 3.5           # lightening slot in the arms

# ---- Station layout: four stations stepping upward along the shaft ----
station_x = [44.0, 142.0, 240.0, 338.0]
disc_z0 = 27.0             # height of first (lowest) disc centre
disc_dz = 20.0             # height step between successive stations

# ---- Connecting rod (inferred from image: I-beam shank, big/small eyes) ----
rod_c2c = 68.0             # big-end to small-end centre distance
big_r_out, big_r_in, big_w = 23.0, 15.2, 16.0
small_r_out, small_r_in = 12.0, 6.1
rod_thk = 12.0

# ---- Wrist pin (documented 12 mm bore; pin coincident/unmodeled in source) ----
pin_r = 6.0
pin_len = 54.0

# ---- Piston ----
pis_r = 25.0               # Ø50 barrel
pis_h = 40.0               # overall height
skirt_r = 20.0             # Ø40 skirt through-bore
skirt_depth = 30.0
pocket_r = 15.0            # Ø30 blind pocket under crown
pocket_depth = 4.0
groove_r_in = 23.5         # ring groove root radius
groove_z0 = 31.0           # groove position (near crown)
groove_w = 5.0
pin_z_local = 26.0         # pin bore height above piston bottom
pin_bore_r = 6.1           # Ø12 pin bore (+clearance)

# ---- Spacer ring ----
ring_r_out = 27.28         # Ø54.56 outer diameter
ring_r_in = 24.9           # nominal Ø50 bore (slight overlap for robust fuse)
ring_w = 5.0

# ---- Bushing ----
bush_r_out = 4.0           # Ø8 outer
bush_r_in = 3.0            # Ø6 bore
bush_len = 5.0


# ---------------------------------------------------------------------------
# Helpers: axis-aligned cylinder primitives
# ---------------------------------------------------------------------------
def cyl_x(r, h, x0, y, z):
    """Cylinder of radius r along +X, spanning x0 .. x0+h at (y, z)."""
    return (cq.Workplane("XY").circle(r).extrude(h)
            .rotate((0, 0, 0), (0, 1, 0), 90)
            .translate((x0, y, z)))


def cyl_y(r, h, x, y0, z):
    """Cylinder of radius r along +Y, spanning y0 .. y0+h at (x, z)."""
    return (cq.Workplane("XY").circle(r).extrude(h)
            .rotate((0, 0, 0), (1, 0, 0), -90)
            .translate((x, y0, z)))


# ---------------------------------------------------------------------------
# Shaft bar: backbone rod + 4 disc bosses on slotted bracket arms + bushing
# ---------------------------------------------------------------------------
shaft_body = cyl_x(shaft_r, shaft_len, 0.0, 0.0, 0.0)

for i, xi in enumerate(station_x):
    zd = disc_z0 + i * disc_dz
    # disc boss, centred on the transverse plane
    disc = cyl_y(disc_r, disc_w, xi, -disc_w / 2.0, zd)
    # rectangular bracket arm from the rod up into the boss
    arm = (cq.Workplane("XY")
           .box(arm_wx, arm_wy, zd + 9.0, centered=(True, True, False))
           .translate((xi, 0.0, -4.0)))
    shaft_body = shaft_body.union(disc).union(arm)
    # lightening slot along the arm
    arm_slot = (cq.Workplane("XY")
                .box(arm_slot_w, 20.0, (zd - 3.0) - 4.5, centered=(True, True, False))
                .translate((xi, 0.0, 4.5)))
    # narrow slot across the lower face of the boss
    disc_slot = (cq.Workplane("XY")
                 .box(disc_slot_w, 20.0, 6.0)
                 .translate((xi, 0.0, zd - 8.0)))
    shaft_body = shaft_body.cut(arm_slot).cut(disc_slot)

# bushing at the near end of the shaft
bushing = cyl_x(bush_r_out, bush_len, 0.0, 0.0, 0.0) \
    .cut(cyl_x(bush_r_in, bush_len + 2.0, -1.0, 0.0, 0.0))
shaft_body = shaft_body.union(bushing)

# ---------------------------------------------------------------------------
# Connecting rod: profile (big eye + tapered shank + small eye) extruded across
# the transverse direction, then bored and slotted to give the I-beam section
# ---------------------------------------------------------------------------
_prof_big = cq.Workplane("XY").circle(big_r_out).extrude(rod_thk)
_prof_small = (cq.Workplane("XY").circle(small_r_out).extrude(rod_thk)
               .translate((0.0, rod_c2c, 0.0)))
_prof_web = (cq.Workplane("XY")
             .polyline([(-16.0, 0.0), (16.0, 0.0),
                        (8.5, rod_c2c - 8.0), (-8.5, rod_c2c - 8.0)])
             .close().extrude(rod_thk))
rod_profile = _prof_big.union(_prof_small).union(_prof_web)

# lay profile vertical (Z) with its thickness centred on Y = 0
conrod = (rod_profile
          .rotate((0, 0, 0), (1, 0, 0), 90)
          .translate((0.0, rod_thk / 2.0, 0.0)))

# wider rim around the big-end eye
big_rim = cyl_y(big_r_out, big_w, 0.0, -big_w / 2.0, 0.0) \
    .cut(cyl_y(big_r_in, big_w + 2.0, 0.0, -(big_w / 2.0 + 1.0), 0.0))
conrod = conrod.union(big_rim)

# bores: big-end eye (clears the disc boss) and small-end pin bore
conrod = conrod.cut(cyl_y(big_r_in, big_w + 6.0, 0.0, -(big_w / 2.0 + 3.0), 0.0))
conrod = conrod.cut(cyl_y(small_r_in, rod_thk + 4.0, 0.0, -(rod_thk / 2.0 + 2.0), rod_c2c))

# I-beam face recesses on both sides of the shank
_recess = cq.Workplane("XY").box(10.0, 3.0, 32.0)
conrod = conrod.cut(_recess.translate((0.0, 4.5, 40.0)))
conrod = conrod.cut(_recess.translate((0.0, -4.5, 40.0)))

# wrist pin through the small-end eye (protrudes slightly from the piston)
pin = cyl_y(pin_r, pin_len, 0.0, -pin_len / 2.0, rod_c2c)
conrod = conrod.union(pin)

# ---------------------------------------------------------------------------
# Piston: hollow barrel with skirt bore, crown pocket, ring groove and pin bore
# ---------------------------------------------------------------------------
piston = cq.Workplane("XY").circle(pis_r).extrude(pis_h)
# Ø40 skirt bore from the bottom
piston = piston.cut(cq.Workplane("XY", origin=(0.0, 0.0, -1.0))
                    .circle(skirt_r).extrude(skirt_depth + 1.0))
# Ø30 blind pocket beneath the crown
piston = piston.cut(cq.Workplane("XY", origin=(0.0, 0.0, skirt_depth))
                    .circle(pocket_r).extrude(pocket_depth))
# circumferential ring groove near the crown
piston = piston.cut(cq.Workplane("XY", origin=(0.0, 0.0, groove_z0))
                    .circle(pis_r).circle(groove_r_in).extrude(groove_w))
# transverse Ø12 wrist-pin bore
piston = piston.cut(cyl_y(pin_bore_r, 60.0, 0.0, -30.0, pin_z_local))

# spacer ring seated over the barrel at the crown groove
spacer_ring = (cq.Workplane("XY", origin=(0.0, 0.0, groove_z0))
               .circle(ring_r_out).circle(ring_r_in).extrude(ring_w))

# ---------------------------------------------------------------------------
# Assemble the four stations
# ---------------------------------------------------------------------------
result = shaft_body
for i, xi in enumerate(station_x):
    zd = disc_z0 + i * disc_dz
    piston_base_z = zd + rod_c2c - pin_z_local
    result = result.union(conrod.translate((xi, 0.0, zd)))
    result = result.union(piston.translate((xi, 0.0, piston_base_z)))
    result = result.union(spacer_ring.translate((xi, 0.0, piston_base_z)))