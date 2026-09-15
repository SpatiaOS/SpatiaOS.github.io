import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters
# ---------------------------------------------------------------------------
shaft_length = 438.0
shaft_diameter = 6.0

disc_diameter = 30.0
disc_thickness = 14.0
disc_center_y = 20.0
disc_slot_width = 6.0
disc_slot_len = 16.0

arm_size_x = 5.0
arm_size_z = 6.0
arm_len_y = 20.0

piston_od = 50.0
piston_height = 40.0
piston_skirt_id = 40.0
piston_pocket_id = 30.0
piston_pin_d = 12.0
skirt_depth = 21.0
pocket_depth = 33.0
pin_from_bottom = 16.0
groove_from_top = 7.0
groove_width = 2.4
groove_depth = 1.6

spacer_od = 54.56
spacer_id = 50.0
spacer_thickness = 5.0

rod_cc = 90.0
big_end_od = 42.0
big_end_id = 30.4
big_end_thick = 14.0
small_end_od = 18.0
small_end_id = 12.2
small_end_thick = 20.0
ibeam_flange_x = 10.0
ibeam_web_x = 3.5
ibeam_z_big = 8.0
ibeam_z_small = 4.5
ibeam_pocket_inset = 2.0

bushing_od = 8.0
bushing_id = 6.0
bushing_length = 5.0

n_stations = 4
z_start = 55.0
z_end = 400.0
z_positions = [
    z_start + i * (z_end - z_start) / (n_stations - 1) for i in range(n_stations)
]


# ---------------------------------------------------------------------------
# Part constructors
# ---------------------------------------------------------------------------
def make_piston():
    """Piston standing along +Y, pin bore along X."""
    body = cq.Workplane("XZ").circle(piston_od / 2.0).extrude(piston_height)
    body = body.faces(">Y").chamfer(0.8)

    body = body.cut(
        cq.Workplane("XZ").circle(piston_skirt_id / 2.0).extrude(skirt_depth)
    )
    body = body.cut(
        cq.Workplane("XZ").circle(piston_pocket_id / 2.0).extrude(pocket_depth)
    )

    gz = piston_height - groove_from_top - groove_width
    groove = (
        cq.Workplane("XZ")
        .workplane(offset=gz)
        .circle(piston_od / 2.0 + 0.4)
        .circle(piston_od / 2.0 - groove_depth)
        .extrude(groove_width)
    )
    body = body.cut(groove)

    pin_cutter = (
        cq.Workplane("YZ")
        .workplane(offset=-(piston_od / 2.0 + 1.0))
        .center(pin_from_bottom, 0.0)
        .circle(piston_pin_d / 2.0)
        .extrude(piston_od + 2.0)
    )
    return body.cut(pin_cutter)


def make_spacer():
    return (
        cq.Workplane("XZ")
        .circle(spacer_od / 2.0)
        .circle(spacer_id / 2.0)
        .extrude(spacer_thickness)
    )


def make_connecting_rod():
    """I-beam rod: big-end eye at the origin, small-end eye at +Y = rod_cc."""
    big = (
        cq.Workplane("YZ")
        .workplane(offset=-big_end_thick / 2.0)
        .circle(big_end_od / 2.0)
        .circle(big_end_id / 2.0)
        .extrude(big_end_thick)
    )
    small = (
        cq.Workplane("YZ")
        .workplane(offset=-small_end_thick / 2.0)
        .center(rod_cc, 0.0)
        .circle(small_end_od / 2.0)
        .circle(small_end_id / 2.0)
        .extrude(small_end_thick)
    )

    y1 = big_end_od / 2.0 - 3.0
    y2 = rod_cc - small_end_od / 2.0 + 3.0

    envelope = (
        cq.Workplane("YZ")
        .workplane(offset=-ibeam_flange_x / 2.0)
        .moveTo(y1, -ibeam_z_big)
        .lineTo(y2, -ibeam_z_small)
        .lineTo(y2, ibeam_z_small)
        .lineTo(y1, ibeam_z_big)
        .close()
        .extrude(ibeam_flange_x)
    )

    pocket_depth = (ibeam_flange_x - ibeam_web_x) / 2.0
    yi1 = y1 + 2.5
    yi2 = y2 - 2.5
    zb = ibeam_z_big - ibeam_pocket_inset
    zs = ibeam_z_small - ibeam_pocket_inset

    pocket_plus = (
        cq.Workplane("YZ")
        .workplane(offset=ibeam_flange_x / 2.0)
        .moveTo(yi1, -zb)
        .lineTo(yi2, -zs)
        .lineTo(yi2, zs)
        .lineTo(yi1, zb)
        .close()
        .extrude(-pocket_depth)
    )
    pocket_minus = (
        cq.Workplane("YZ")
        .workplane(offset=-ibeam_flange_x / 2.0)
        .moveTo(yi1, -zb)
        .lineTo(yi2, -zs)
        .lineTo(yi2, zs)
        .lineTo(yi1, zb)
        .close()
        .extrude(pocket_depth)
    )
    ibeam = envelope.cut(pocket_plus).cut(pocket_minus)
    return big.union(small).union(ibeam)


def make_shaft_bar():
    """6 mm backbone with four slotted disc bosses on short bracket arms."""
    bar = cq.Workplane("XY").circle(shaft_diameter / 2.0).extrude(shaft_length)

    for z in z_positions:
        disc = (
            cq.Workplane("YZ")
            .workplane(offset=-disc_thickness / 2.0)
            .center(disc_center_y, z)
            .circle(disc_diameter / 2.0)
            .extrude(disc_thickness)
        )
        slot = (
            cq.Workplane("XY")
            .workplane(offset=z)
            .center(0.0, disc_center_y - disc_slot_len / 4.0)
            .box(disc_thickness + 2.0, disc_slot_len, disc_slot_width)
        )
        disc = disc.cut(slot)

        arm = (
            cq.Workplane("XY")
            .workplane(offset=z)
            .center(0.0, arm_len_y / 2.0)
            .box(arm_size_x, arm_len_y, arm_size_z)
        )
        bar = bar.union(arm).union(disc)

    return bar


def make_bushing():
    return (
        cq.Workplane("XY")
        .circle(bushing_od / 2.0)
        .circle(bushing_id / 2.0)
        .extrude(bushing_length)
    )


# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------
piston_y0 = disc_center_y + rod_cc - pin_from_bottom
spacer_y = piston_y0 + piston_height - spacer_thickness

result = make_shaft_bar()
result = result.add(make_bushing())

for z in z_positions:
    result = result.add(make_connecting_rod().translate((0.0, disc_center_y, z)))
    result = result.add(make_piston().translate((0.0, piston_y0, z)))
    result = result.add(make_spacer().translate((0.0, spacer_y, z)))