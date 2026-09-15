import cadquery as cq

# =============================================================================
# 4-digit 7-segment LED display
# X = length, Y = depth (front = +Y), Z = height
# Origin at the centre of the housing block
# =============================================================================

# --- Housing ---
LENGTH = 50.7
HEIGHT = 19.0
BODY_DEPTH = 7.9
SHIM_THK = 0.10

# --- Seven-segment plates (proud on the front face) ---
SEG_THK = 0.28
SEG_W = 1.70
H_LEN = 5.92
V_LEN = 5.48
TIP = SEG_W * 0.5
SLANT = 0.108

AZ = 5.72
GZ = 0.00
DZ = -5.72
LX = -2.96
RX = 2.96
UZ = AZ * 0.5
LZ = DZ * 0.5

DIGIT_PITCH = 12.25
DIGIT_XS = [(i - 1.5) * DIGIT_PITCH for i in range(4)]
DIGIT_Z0 = 0.25

# --- Decimal-point discs ---
DP_THK = 0.28
DP_R = 0.80
DP_DX = 4.95
DP_DZ = -6.32

# --- Locating pins (upper rear, pointing -Y) ---
PIN_R = 0.25
PIN_SHANK = 2.63
PIN_CONE = 0.37
PIN_TIP_R = 0.055
N_PINS = 12
PIN_PITCH = 3.80
PIN_Z = HEIGHT / 2.0 - 1.60

Y_REAR = -BODY_DEPTH / 2.0
Y_SEG = BODY_DEPTH / 2.0 + SHIM_THK


def hex_horizontal(length, width, tip):
    l2, w2 = length / 2.0, width / 2.0
    return [
        (-l2 + tip, -w2),
        (-l2, 0.0),
        (-l2 + tip, w2),
        (l2 - tip, w2),
        (l2, 0.0),
        (l2 - tip, -w2),
    ]


def hex_vertical(length, width, tip):
    l2, w2 = length / 2.0, width / 2.0
    return [
        (0.0, -l2),
        (w2, -l2 + tip),
        (w2, l2 - tip),
        (0.0, l2),
        (-w2, l2 - tip),
        (-w2, -l2 + tip),
    ]


def place(local_pts, cx, cz, ox, oz):
    pts = []
    for x, z in local_pts:
        x = x + cx
        z = z + cz
        x = x + SLANT * z
        pts.append((ox + x, oz + z))
    return pts


def extrude_xz(pts, y0, dy):
    """Polygon in XZ extruded along +Y."""
    return (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(dy)
        .rotate((0, 0, 0), (1, 0, 0), 90)
        .translate((0, y0 + dy, 0))
    )


def make_digit(ox, oz):
    hloc = hex_horizontal(H_LEN, SEG_W, TIP)
    vloc = hex_vertical(V_LEN, SEG_W, TIP)
    specs = [
        (hloc, 0.0, AZ),
        (vloc, RX, UZ),
        (vloc, RX, LZ),
        (hloc, 0.0, DZ),
        (vloc, LX, LZ),
        (vloc, LX, UZ),
        (hloc, 0.0, GZ),
    ]
    digit = None
    for loc, cx, cz in specs:
        seg = extrude_xz(place(loc, cx, cz, ox, oz), Y_SEG, SEG_THK)
        digit = seg if digit is None else digit.union(seg, glue=True, clean=False)
    return digit


def make_dp(x, z):
    return (
        cq.Workplane("XY")
        .circle(DP_R)
        .extrude(DP_THK)
        .rotate((0, 0, 0), (1, 0, 0), 90)
        .translate((x, Y_SEG + DP_THK, z))
    )


def make_pin():
    return (
        cq.Workplane("XZ")
        .moveTo(PIN_R, 0)
        .lineTo(PIN_R, PIN_SHANK)
        .lineTo(PIN_TIP_R, PIN_SHANK + PIN_CONE)
        .lineTo(0, PIN_SHANK + PIN_CONE)
        .lineTo(0, 0)
        .close()
        .revolve(360, (0, 0, 0), (0, 0, 1))
    )


# Main body (housing + front shim)
body_depth = BODY_DEPTH + SHIM_THK
result = (
    cq.Workplane("XY")
    .box(LENGTH, body_depth, HEIGHT)
    .translate((0, SHIM_THK / 2.0, 0))
)

# Four digits and decimal points
for dx in DIGIT_XS:
    result = result.union(make_digit(dx, DIGIT_Z0), glue=True, clean=False)
    result = result.union(
        make_dp(dx + DP_DX, DIGIT_Z0 + DP_DZ), glue=True, clean=False
    )

# 12 locating pins on the upper rear face
pin_proto = make_pin().val()
pin_xs = [(i - (N_PINS - 1) / 2.0) * PIN_PITCH for i in range(N_PINS)]
for px in pin_xs:
    placed = (
        cq.Workplane("XY")
        .newObject([pin_proto])
        .rotate((0, 0, 0), (1, 0, 0), -90)
        .translate((px, Y_REAR, PIN_Z))
    )
    result = result.union(placed, glue=True, clean=False)