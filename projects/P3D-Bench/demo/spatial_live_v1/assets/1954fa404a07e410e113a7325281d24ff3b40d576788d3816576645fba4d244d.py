import cadquery as cq

# =============================================================================
# 4-digit seven-segment display module
#   - grounded spacer block (housing)          50.7 x 19.0 x 7.9
#   - thin front shim plate (face datum)       50.7 x 19.0 x 0.1
#   - 4 x 7 thin hexagonal segment plates      (t = 0.01)
#   - 4 thin decimal-point discs               (r = 0.8, t = 0.01)
#   - 12 locating pins on the upper rear edge  (r = 0.25, 2.63 shank + 0.37 tip)
# =============================================================================

# ---- Housing / face plate ---------------------------------------------------
panel_length   = 50.7      # X extent
panel_height   = 19.0      # Y extent
body_depth     = 7.9       # Z extent of the spacer block
face_plate_th  = 0.10      # front shim plate thickness

# ---- Seven-segment artwork --------------------------------------------------
seg_plate_th   = 0.01      # thickness of every segment / decimal plate
seg_stroke     = 1.45      # stroke (width) of a segment
seg_gap        = 0.20      # clearance between neighbouring segments
seg_h_len      = 6.15      # length of the horizontal segments (a, g, d)
seg_v_len      = 5.65      # length of the vertical segments (b, c, e, f)
digit_slant    = 0.15      # italic shear: dx per unit of y  (~8.5 deg)

digit_count    = 4
digit_pitch    = 12.0
first_digit_x  = -18.0     # centre of the left-most digit

# ---- Decimal points ---------------------------------------------------------
dp_radius      = 0.8026
dp_dx          = 3.20      # offset of the disc from the digit centre
dp_dy          = -7.50

# ---- Locating pins ----------------------------------------------------------
pin_count      = 12
pin_pitch      = 1.27
pin_radius     = 0.25
pin_shank_len  = 2.63
pin_cone_len   = 0.37
pin_tip_radius = 0.08
pin_row_y      = 8.50      # height of the pin row on the rear face

# ---- Derived geometry -------------------------------------------------------
front_z   = face_plate_th                                    # visible front face
v_seg_dx  = seg_h_len / 2.0 - seg_stroke / 2.0               # x of vertical segs
v_seg_dy  = seg_stroke / 2.0 + seg_gap + seg_v_len / 2.0     # y of vertical segs
h_seg_dy  = seg_stroke + 2.0 * seg_gap + seg_v_len           # y of top/bottom seg


def segment_outline(cx, cy, length, horizontal):
    """Pointed-end hexagonal outline of one segment, sheared into the italic frame."""
    t = seg_stroke
    if horizontal:
        raw = [(-length / 2.0, 0.0),
               (-length / 2.0 + t / 2.0,  t / 2.0),
               ( length / 2.0 - t / 2.0,  t / 2.0),
               ( length / 2.0, 0.0),
               ( length / 2.0 - t / 2.0, -t / 2.0),
               (-length / 2.0 + t / 2.0, -t / 2.0)]
    else:
        raw = [(0.0, -length / 2.0),
               ( t / 2.0, -length / 2.0 + t / 2.0),
               ( t / 2.0,  length / 2.0 - t / 2.0),
               (0.0,  length / 2.0),
               (-t / 2.0,  length / 2.0 - t / 2.0),
               (-t / 2.0, -length / 2.0 + t / 2.0)]
    # shear about the digit centre-line to obtain the italic look
    return [(cx + px + digit_slant * (cy + py), cy + py) for px, py in raw]


def digit_outlines(x0):
    """Seven segment outlines (a..g) of a single digit centred at x0."""
    segs = [
        segment_outline(0.0,        h_seg_dy, seg_h_len, True),    # a  top
        segment_outline( v_seg_dx,  v_seg_dy, seg_v_len, False),   # b  upper right
        segment_outline( v_seg_dx, -v_seg_dy, seg_v_len, False),   # c  lower right
        segment_outline(0.0,       -h_seg_dy, seg_h_len, True),    # d  bottom
        segment_outline(-v_seg_dx, -v_seg_dy, seg_v_len, False),   # e  lower left
        segment_outline(-v_seg_dx,  v_seg_dy, seg_v_len, False),   # f  upper left
        segment_outline(0.0,             0.0, seg_h_len, True),    # g  middle
    ]
    return [[(x + x0, y) for x, y in poly] for poly in segs]


# ---- Housing block (grounded spacer block), rear side of the face plate ------
housing = (
    cq.Workplane("XY")
    .box(panel_length, panel_height, body_depth, centered=(True, True, False))
    .translate((0, 0, -body_depth))
)

# ---- Front shim plate (datum face) ------------------------------------------
face_plate = (
    cq.Workplane("XY")
    .box(panel_length, panel_height, face_plate_th, centered=(True, True, False))
)

# ---- All 28 segment plates, extruded from the front face --------------------
seg_wp = cq.Workplane("XY", origin=(0, 0, front_z))
for i in range(digit_count):
    digit_x = first_digit_x + i * digit_pitch
    for outline in digit_outlines(digit_x):
        seg_wp = seg_wp.polyline(outline).close()
segment_plates = seg_wp.extrude(seg_plate_th)

# ---- Decimal-point discs ----------------------------------------------------
dp_points = [(first_digit_x + i * digit_pitch + dp_dx, dp_dy) for i in range(digit_count)]
decimal_discs = (
    cq.Workplane("XY", origin=(0, 0, front_z))
    .pushPoints(dp_points)
    .circle(dp_radius)
    .extrude(seg_plate_th)
)

# ---- Locating pins on the upper rear edge -----------------------------------
pin_solids = []
pin_row_x0 = -pin_pitch * (pin_count - 1) / 2.0
for i in range(pin_count):
    px = pin_row_x0 + i * pin_pitch
    shank = cq.Solid.makeCylinder(
        pin_radius, pin_shank_len,
        cq.Vector(px, pin_row_y, -body_depth), cq.Vector(0, 0, -1)
    )
    tip = cq.Solid.makeCone(
        pin_radius, pin_tip_radius, pin_cone_len,
        cq.Vector(px, pin_row_y, -body_depth - pin_shank_len), cq.Vector(0, 0, -1)
    )
    pin_solids.append(shank.fuse(tip))

# ---- Unified assembly -------------------------------------------------------
result = housing.union(face_plate).union(segment_plates).union(decimal_discs)
for pin in pin_solids:
    result = result.union(cq.Workplane("XY").add(pin))