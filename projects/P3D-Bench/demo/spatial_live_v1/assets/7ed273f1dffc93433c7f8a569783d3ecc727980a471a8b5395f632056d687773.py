import cadquery as cq

# ============================================================================
#  Four–cylinder piston / connecting-rod / crank-bar assembly
#
#  Frame convention (matches the rendered view):
#     crank (shaft) axis .............. Y
#     cylinder (piston) axis .......... Z
#     layout plane .................... X = 0   (plane normal along X)
# ============================================================================

# ------------------------------ Parameters ---------------------------------
# Global layout
n_cylinders          = 4
station_pitch        = 100.0     # crank-throw spacing along the shaft
first_station_y      = 75.0      # first throw measured from the bushing end

# Shaft bar with integral disc bosses (crank bar)
shaft_len            = 438.0
shaft_rod_dia        = 6.0
disc_dia             = 30.0
disc_thk             = 14.0
crank_throw          = 25.0      # disc centre offset above the shaft axis
arm_x                = 12.0      # rectangular bracket arm width
arm_y                = 8.0       # rectangular bracket arm thickness
disc_slot_w          = 4.0       # narrow rectangular slot in each disc
disc_slot_depth      = 9.0

# Bushing on the free (far) end of the shaft
bush_od              = 8.0
bush_id              = 6.0
bush_len             = 5.0

# Piston
pist_dia             = 50.0
pist_h               = 40.0
crown_thk            = 6.0
skirt_bore_dia       = 40.0      # lower skirt bore (receives the rod small end)
skirt_bore_depth     = 25.0
pocket_dia           = 30.0      # blind pocket under the crown
pin_bore_dia         = 12.0      # transverse wrist-pin bore (axis // crank axis)
pin_below_crown      = 18.0
groove_below_crown   = 5.0
groove_r             = 1.0       # toroidal ring-groove section radius

# Spacer ring seated on the piston barrel
ring_od              = 54.56
ring_id              = 50.0
ring_h               = 5.0
ring_top_below_crown = 10.0
fit_squeeze          = 0.4       # tiny interference -> robust boolean fusion

# Connecting rod (forked I-beam link)
rod_cc               = 120.0     # big-eye centre -> small-eye centre
big_eye_od           = 40.0
fork_gap             = disc_thk + 1.0   # clearance slot straddling the disc
fork_prong           = 7.0
yoke_w               = 22.0      # block bridging the two fork prongs
yoke_z0              = 15.5
yoke_z1              = 22.0
shank_z0             = 20.0
shank_hw_low         = 11.0      # shank half width at the big end
shank_hw_high        = 8.0       # shank half width at the small end
shank_thk            = 15.4
web_thk              = 6.0       # I-beam web thickness
flange_w             = 3.0       # I-beam flange width
small_eye_od         = 22.0
small_eye_thk        = 16.0


# ------------------------------ Helpers ------------------------------------
def cyl_y(radius, length, y0, x=0.0, z=0.0):
    """Cylinder whose axis runs along +Y, from y0 to y0 + length."""
    plane = cq.Plane(origin=(x, y0, z), xDir=(1, 0, 0), normal=(0, 1, 0))
    return cq.Workplane(plane).circle(radius).extrude(length)


def make_piston():
    """Squat hollow piston: flat crown, ring groove, stepped bore, pin bore."""
    p = cq.Workplane("XY").circle(pist_dia / 2.0).extrude(pist_h)

    # stepped interior: 40 mm skirt bore, then 30 mm blind pocket under crown
    p = p.cut(cq.Workplane("XY").circle(skirt_bore_dia / 2.0).extrude(skirt_bore_depth))
    p = p.cut(cq.Workplane("XY", origin=(0, 0, skirt_bore_depth))
              .circle(pocket_dia / 2.0)
              .extrude(pist_h - crown_thk - skirt_bore_depth))

    # circumferential ring groove (toroidal section) near the crown
    z_groove = pist_h - groove_below_crown
    groove = cq.Workplane("XY").add(
        cq.Solid.makeTorus(pist_dia / 2.0, groove_r,
                           cq.Vector(0, 0, z_groove), cq.Vector(0, 0, 1)))
    p = p.cut(groove)

    # transverse wrist-pin bore, full width, axis parallel to the crank axis
    p = p.cut(cyl_y(pin_bore_dia / 2.0, pist_dia + 4.0, -(pist_dia / 2.0 + 2.0),
                    z=pist_h - pin_below_crown))
    return p


def make_spacer_ring():
    """Thin annular locating ring that seats on the piston barrel."""
    return (cq.Workplane("XY")
            .circle(ring_od / 2.0)
            .circle((ring_id - fit_squeeze) / 2.0)
            .extrude(ring_h))


def make_conrod():
    """Forked I-beam rod: big eye at local origin, small eye at +Z = rod_cc."""
    # forked big end: two prongs straddling the crank disc
    rod = cyl_y(big_eye_od / 2.0, fork_prong, fork_gap / 2.0)
    rod = rod.union(cyl_y(big_eye_od / 2.0, fork_prong, -fork_gap / 2.0 - fork_prong))

    # yoke closing the fork above the disc
    rod = rod.union(cq.Workplane("XY")
                    .box(yoke_w, fork_gap + 2 * fork_prong, yoke_z1 - yoke_z0,
                         centered=(True, True, False))
                    .translate((0, 0, yoke_z0)))

    # tapered shank (plate in the XZ plane, extruded symmetrically along Y)
    shank = (cq.Workplane("XZ")
             .polyline([(-shank_hw_low, shank_z0),
                        (shank_hw_low, shank_z0),
                        (shank_hw_high, rod_cc),
                        (-shank_hw_high, rod_cc)])
             .close()
             .extrude(shank_thk / 2.0, both=True))
    rod = rod.union(shank)

    # small (piston pin) eye
    rod = rod.union(cyl_y(small_eye_od / 2.0, small_eye_thk,
                          -small_eye_thk / 2.0, z=rod_cc))

    # eye bores
    span = 2 * fork_prong + fork_gap + 10.0
    rod = rod.cut(cyl_y(disc_dia / 2.0, span, -span / 2.0))
    rod = rod.cut(cyl_y(pin_bore_dia / 2.0, small_eye_thk + 10.0,
                        -(small_eye_thk / 2.0 + 5.0), z=rod_cc))

    # I-beam relief pockets on both faces of the shank
    pocket_len = rod_cc - 14.0 - 28.0
    pocket_zc = (28.0 + rod_cc - 14.0) / 2.0
    pocket_depth = (shank_thk - web_thk) / 2.0
    for side in (1.0, -1.0):
        cutter = (cq.Workplane("XY")
                  .box(2.0 * (shank_hw_high - flange_w), pocket_depth, pocket_len)
                  .translate((0, side * (web_thk / 2.0 + pocket_depth / 2.0), pocket_zc)))
        rod = rod.cut(cutter)
    return rod


def make_shaft_bar(stations):
    """6 mm backbone rod + four offset disc bosses on rectangular arms + bushing."""
    bar = cyl_y(shaft_rod_dia / 2.0, shaft_len, 0.0)

    for y in stations:
        disc = cyl_y(disc_dia / 2.0, disc_thk, y - disc_thk / 2.0, z=crank_throw)
        # narrow rectangular slot broken out of the disc rim
        slot = (cq.Workplane("XY")
                .box(disc_slot_w, disc_thk + 2.0, disc_slot_depth)
                .translate((0, y,
                            crank_throw + disc_dia / 2.0 - disc_slot_depth / 2.0 + 0.5)))
        disc = disc.cut(slot)

        arm = (cq.Workplane("XY")
               .box(arm_x, arm_y, crank_throw + shaft_rod_dia / 2.0,
                    centered=(True, True, False))
               .translate((0, y, -shaft_rod_dia / 2.0)))

        bar = bar.union(disc).union(arm)

    # bushing coaxial with the rod at the far end of the shaft
    bush = (cyl_y(bush_od / 2.0, bush_len, 0.0)
            .cut(cyl_y((bush_id - fit_squeeze) / 2.0, bush_len + 2.0, -1.0)))
    return bar.union(bush)


# ------------------------------ Assembly -----------------------------------
stations = [first_station_y + i * station_pitch for i in range(n_cylinders)]

# piston sits so that its pin bore is concentric with the rod small eye
piston_z0 = crank_throw + rod_cc - (pist_h - pin_below_crown)
ring_z0 = piston_z0 + pist_h - ring_top_below_crown - ring_h

result = make_shaft_bar(stations)

for y in stations:
    result = (result
              .union(make_conrod().translate((0, y, crank_throw)))
              .union(make_piston().translate((0, y, piston_z0)))
              .union(make_spacer_ring().translate((0, y, ring_z0))))