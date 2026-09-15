import cadquery as cq

# ------------------------------------------------------------------
# Housing (grounded spacer block) + front shim plate
# ------------------------------------------------------------------
block_length = 50.7   # X extent
block_depth  = 7.9    # Y extent (front face at +Y/2)
block_height = 19.0   # Z extent

shim_thick = 0.1      # thin datum plate bonded to the block front face

# ------------------------------------------------------------------
# Seven-segment digits (4 digits x 7 segment plates) + decimal points
# ------------------------------------------------------------------
digit_count = 4
digit_pitch = block_length / digit_count
seg_thick   = 0.01
row_offset  = 6.0     # z-offset of top / bottom horizontal segments
col_offset  = 2.84    # x-offset of vertical segment centrelines

# One plate class per segment position: (length, width)
SEG_A = (5.68, 2.29)  # top          horizontal
SEG_G = (5.61, 2.29)  # middle       horizontal
SEG_D = (5.70, 2.26)  # bottom       horizontal
SEG_B = (6.44, 1.48)  # upper-right  vertical
SEG_C = (6.34, 1.44)  # lower-right  vertical
SEG_E = (6.40, 1.46)  # lower-left   vertical (inferred class)
SEG_F = (6.40, 1.46)  # upper-left   vertical (inferred class)

dot_radius = 0.8
dot_dx     = 4.4      # decimal point sits lower-right of each digit
dot_dz     = -6.0

# ------------------------------------------------------------------
# Locating pins (row of 12 along the upper rear edge)
# ------------------------------------------------------------------
pin_count      = 12
pin_pitch      = 2.54
pin_radius     = 0.25
pin_tip_radius = 0.08
pin_shank_len  = 2.63
pin_cone_len   = 0.37
pin_z          = block_height / 2 - 0.5
pin_embed      = 0.05

# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def hexagon_points(length, width):
    """Elongated hexagon outline: a strip with pointed ends along its length."""
    hl, hw = length / 2.0, width / 2.0
    p = hw   # pointed (45 deg) tips
    return [
        (-hl + p,  hw), (hl - p,  hw), (hl, 0.0),
        ( hl - p, -hw), (-hl + p, -hw), (-hl, 0.0),
    ]

def make_segment(length, width, cx, cz, vertical):
    """Thin hexagonal segment plate standing on the front face."""
    pts = hexagon_points(length, width)
    if vertical:
        pts = [(u, v) for v, u in pts]  # run the length along Z
    return (
        cq.Workplane("XZ", origin=(cx, front_face_y, cz))
        .polyline(pts)
        .close()
        .extrude(seg_thick, both=True)  # half embedded into the shim face
    )

def make_pin():
    """Straight shank + truncated conical tip, axis pointing toward -Y."""
    shank = cq.Workplane("XY").circle(pin_radius).extrude(pin_shank_len)
    tip = cq.Solid.makeCone(
        pin_radius, pin_tip_radius, pin_cone_len,
        cq.Vector(0, 0, pin_shank_len), cq.Vector(0, 0, 1),
    )
    return shank.union(tip).rotate((0, 0, 0), (1, 0, 0), 90)  # +Z -> -Y

# ------------------------------------------------------------------
# Main bodies
# ------------------------------------------------------------------
block = cq.Workplane("XY").box(block_length, block_depth, block_height)

shim = (
    cq.Workplane("XY")
    .box(block_length, shim_thick, block_height)
    .translate((0, block_depth / 2 + shim_thick / 2, 0))
)

front_face_y = block_depth / 2 + shim_thick
rear_face_y  = -block_depth / 2

# ------------------------------------------------------------------
# Four digits: seven segment plates each, plus a decimal-point disc
# ------------------------------------------------------------------
segment_layout = [
    (SEG_A,  0.0,         row_offset,     False),
    (SEG_F, -col_offset,  row_offset / 2, True),
    (SEG_B,  col_offset,  row_offset / 2, True),
    (SEG_G,  0.0,         0.0,            False),
    (SEG_E, -col_offset, -row_offset / 2, True),
    (SEG_C,  col_offset, -row_offset / 2, True),
    (SEG_D,  0.0,        -row_offset,     False),
]

features = []
digit_centers = [
    (i - (digit_count - 1) / 2.0) * digit_pitch for i in range(digit_count)
]

for dx in digit_centers:
    for dims, ox, oz, vertical in segment_layout:
        features.append(make_segment(*dims, dx + ox, oz, vertical))
    features.append(
        cq.Workplane("XZ", origin=(dx + dot_dx, front_face_y, dot_dz))
        .circle(dot_radius)
        .extrude(seg_thick, both=True)
    )

# ------------------------------------------------------------------
# Locating pins: flat bases seated on the block rear face near the top
# ------------------------------------------------------------------
pin_xs = [(i - (pin_count - 1) / 2.0) * pin_pitch for i in range(pin_count)]
for px in pin_xs:
    features.append(make_pin().translate((px, rear_face_y + pin_embed, pin_z)))

# ------------------------------------------------------------------
# Unified assembly
# ------------------------------------------------------------------
result = block.union(shim)
for feature in features:
    result = result.union(feature)