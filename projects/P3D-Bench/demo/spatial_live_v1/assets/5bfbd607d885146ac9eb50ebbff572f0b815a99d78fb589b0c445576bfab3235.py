import cadquery as cq

# =============================================================================
# 4-digit seven-segment display module
#   - grounded spacer block (housing)
#   - thin datum / shim panel on the front face
#   - 4 seven-segment digits (raised segment plates) + 4 decimal points
#   - 12 locating pins protruding from the upper rear face
# =============================================================================

# ------------------------------- parameters ----------------------------------
# housing (grounded spacer block) and front datum panel
housing_len = 50.7      # X - overall length
housing_hgt = 19.0      # Z - overall height
housing_dep = 7.9       # Y - depth of the spacer block
panel_t     = 0.10      # thickness of the front shim/datum panel

# seven-segment digits
n_digits    = 4
digit_w     = 7.6       # digit width (horizontal bar, tip to tip)
digit_h     = 13.6      # digit height
seg_w       = 1.55      # width of every segment plate
seg_t       = 0.01      # segment plate thickness (very thin)
digit_pitch = 12.4      # digit centre-to-centre spacing

# decimal points
dot_r   = 0.80          # decimal point radius
dot_t   = 0.01          # decimal point thickness
dot_gap = 1.20          # clearance between digit edge and decimal point

# locating pins
n_pins    = 12
pin_r     = 0.25
pin_shank = 2.63
pin_tip   = 0.37
pin_tip_r = 0.08        # small truncated flat at the tip
pin_pitch = 1.60
pin_z     = housing_hgt / 2.0 - 0.5      # sits high on the rear face

# derived digit geometry
bar_off = digit_h / 2.0 - seg_w / 2.0    # z-offset of the top / bottom bars
col_off = digit_w / 2.0 - seg_w / 2.0    # x-offset of the vertical bars
bar_len = digit_w                        # horizontal bars span the digit width
col_len = bar_off                        # vertical bars run bar-centre to bar-centre
col_ctr = bar_off / 2.0                  # z-centre of a vertical bar


# -------------------------------- helpers ------------------------------------
def hex_segment(length, width, thickness, rot=0.0, cx=0.0, cz=0.0):
    """One segment plate: a thin elongated hexagon (45 deg chamfered tips)
    lying in the XZ plane, extruded forward (-Y) onto the front panel."""
    c = width / 2.0
    profile = [
        (-length / 2.0 + c, -width / 2.0),
        ( length / 2.0 - c, -width / 2.0),
        ( length / 2.0,      0.0),
        ( length / 2.0 - c,  width / 2.0),
        (-length / 2.0 + c,  width / 2.0),
        (-length / 2.0,      0.0),
    ]
    return (
        cq.Workplane("XZ")
        .polyline(profile).close()
        .extrude(thickness)
        .rotate((0, 0, 0), (0, 1, 0), rot)          # spin within the front plane
        .translate((cx, -panel_t, cz))
    )


def decimal_dot(cx, cz):
    """Thin disc used as a decimal point indicator."""
    return (
        cq.Workplane("XZ")
        .circle(dot_r)
        .extrude(dot_t)
        .translate((cx, -panel_t, cz))
    )


def make_digit(x0):
    """Seven segment plates plus the decimal point of one digit."""
    layout = [  # (local x, local z, in-plane rotation, plate length)
        ( 0.0,      bar_off,  0.0,  bar_len),    # top bar
        ( 0.0,      0.0,      0.0,  bar_len),    # middle bar
        ( 0.0,     -bar_off,  0.0,  bar_len),    # bottom bar
        (-col_off,  col_ctr,  90.0, col_len),    # upper-left bar
        (-col_off, -col_ctr,  90.0, col_len),    # lower-left bar
        ( col_off,  col_ctr,  90.0, col_len),    # upper-right bar
        ( col_off, -col_ctr,  90.0, col_len),    # lower-right bar
    ]
    solids = [hex_segment(L, seg_w, seg_t, rot, x0 + lx, lz).val()
              for lx, lz, rot, L in layout]
    solids.append(decimal_dot(x0 + digit_w / 2.0 + dot_gap, -bar_off).val())
    return cq.Workplane("XY", obj=solids[0].fuse(*solids[1:]))


def locating_pin(cx, cz):
    """Cylindrical shank with a short truncated-cone tip, pointing out the back."""
    base = cq.Vector(cx, housing_dep, cz)
    axis = cq.Vector(0, 1, 0)
    shank = cq.Solid.makeCylinder(pin_r, pin_shank, base, axis)
    tip = cq.Solid.makeCone(pin_r, pin_tip_r, pin_tip,
                            base + cq.Vector(0, pin_shank, 0), axis)
    return shank.fuse(tip)


# -------------------------------- assembly -----------------------------------
# grounded spacer block + front datum / shim panel (front of block at Y = 0)
result = (
    cq.Workplane("XY")
    .box(housing_len, housing_dep, housing_hgt)
    .translate((0, housing_dep / 2.0, 0))
    .union(
        cq.Workplane("XY")
        .box(housing_len, panel_t, housing_hgt)
        .translate((0, -panel_t / 2.0, 0))
    )
)

# four evenly spaced digits on the front face
digit_x = [(i - (n_digits - 1) / 2.0) * digit_pitch for i in range(n_digits)]
for x0 in digit_x:
    result = result.union(make_digit(x0))

# twelve locating pins along the upper rear face
pin_x = [(i - (n_pins - 1) / 2.0) * pin_pitch for i in range(n_pins)]
pin_solids = [locating_pin(x, pin_z) for x in pin_x]
result = result.union(cq.Workplane("XY", obj=pin_solids[0].fuse(*pin_solids[1:])))