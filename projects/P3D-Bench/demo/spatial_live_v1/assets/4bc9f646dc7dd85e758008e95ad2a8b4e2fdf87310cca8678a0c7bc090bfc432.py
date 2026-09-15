import cadquery as cq

# ---------------- Global parameters ----------------
body_len   = 50.7   # overall length (X)
body_hgt   = 19.0   # overall height (Z)
body_dpt   = 7.9    # spacer block depth (Y)
shim_thk   = 0.1    # front shim plate thickness
seg_thk    = 0.01   # seven-segment / decimal point plate thickness

# seven-segment digit geometry
seg_wid    = 1.46   # segment strip width
seg_len_h  = 6.40   # nominal horizontal segment length
seg_len_v  = 5.65   # nominal vertical segment length
italic     = 0.12   # italic shear (dx per dz)
n_digits   = 4
dp_rad     = 0.8    # decimal point disc radius

# locating pins
pin_r      = 0.25
pin_shank  = 2.63
pin_tip    = 0.37
pin_tip_r  = 0.10
pin_count  = 12
pin_pitch  = 2.54
pin_z      = 16.5   # pin axis height (near top rear edge)

# derived digit layout values
x_off_v   = seg_len_h / 2.0 - seg_wid / 2.0      # vertical segment x offset
z_off_v   = seg_wid / 2.0 + seg_len_v / 2.0      # vertical segment z offset
z_off_h   = seg_len_v + seg_wid                  # top/bottom segment z offset
digit_pitch = body_len / n_digits
cz = body_hgt / 2.0                              # digit centre height

# (x_off, z_off, length, is_horizontal) for segments A..G
SEG_LAYOUT = [
    (0.0,      z_off_h, 6.44, True),   # A top
    ( x_off_v, z_off_v, 5.70, False),  # B upper right
    ( x_off_v, -z_off_v, 5.65, False), # C lower right
    (0.0,     -z_off_h, 6.40, True),   # D bottom
    (-x_off_v, -z_off_v, 5.61, False), # E lower left
    (-x_off_v,  z_off_v, 5.68, False), # F upper left
    (0.0,      0.0,     6.34, True),   # G middle
]
DP_OFFSET = (x_off_v + seg_wid / 2.0 + 1.0, -z_off_h)  # decimal point position

# ---------------- Helper builders ----------------
def segment_plate(cx, ox, oz, length, horizontal):
    """Thin hexagonal (pointed-end) plate on the front face."""
    hl, hw = length / 2.0, seg_wid / 2.0
    if horizontal:
        local = [(-hl, 0), (-hl + hw, hw), (hl - hw, hw),
                 (hl, 0), (hl - hw, -hw), (-hl + hw, -hw)]
    else:
        local = [(0, -hl), (hw, -hl + hw), (hw, hl - hw),
                 (0, hl), (-hw, hl - hw), (-hw, -hl + hw)]
    pts = [(cx + ox + u + italic * (oz + v), cz + oz + v) for (u, v) in local]
    return (cq.Workplane("XZ").workplane(offset=shim_thk)
            .polyline(pts).close().extrude(seg_thk))

def decimal_disc(cx):
    """Thin circular decimal-point disc on the front face."""
    ox, oz = DP_OFFSET
    x = cx + ox + italic * oz
    return (cq.Workplane("XZ").workplane(offset=shim_thk)
            .center(x, cz + oz).circle(dp_rad).extrude(seg_thk))

def locating_pin(px):
    """Cylindrical shank + conical tip, axis along +Y from the rear face."""
    shank = cq.Solid.makeCylinder(pin_r, pin_shank,
                                  cq.Vector(px, body_dpt, pin_z),
                                  cq.Vector(0, 1, 0))
    tip = cq.Solid.makeCone(pin_r, pin_tip_r, pin_tip,
                            cq.Vector(px, body_dpt + pin_shank, pin_z),
                            cq.Vector(0, 1, 0))
    return cq.Workplane().add(shank).add(tip)

# ---------------- Main body ----------------
# grounded spacer block (rear housing)
result = cq.Workplane("XY").box(body_len, body_dpt, body_hgt,
                                centered=(False, False, False))
# front shim / datum plate
shim = (cq.Workplane("XY")
        .box(body_len, shim_thk, body_hgt, centered=(False, False, False))
        .translate((0, -shim_thk, 0)))
result = result.union(shim)

# four seven-segment digits plus decimal points on the shim front face
for i in range(n_digits):
    cx = digit_pitch * (i + 0.5)
    for (ox, oz, length, horiz) in SEG_LAYOUT:
        result = result.union(segment_plate(cx, ox, oz, length, horiz))
    result = result.union(decimal_disc(cx))

# row of 12 locating pins seated on the rear face
pin_x0 = body_len / 2.0 - (pin_count - 1) * pin_pitch / 2.0
for j in range(pin_count):
    result = result.union(locating_pin(pin_x0 + j * pin_pitch))

result = result.clean()