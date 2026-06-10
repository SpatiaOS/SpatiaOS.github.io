import cadquery as cq
import math

# =============================================================================
# PARAMETERS
# =============================================================================
# Main clock body
outer_diameter = 100.0
outer_height = 8.0
recess_diameter = 80.0
recess_depth = 2.0

# Center hub
hub_diameter = 16.0
hub_height = 2.0

# Roman numerals
numeral_height = 1.5
numeral_radius = 32.0
bar_width = 2.0
bar_length = 8.0
x_bar_length = 10.0
v_bar_length = 9.0
v_angle = 22.5
bar_gap = 2.0
step = bar_width + bar_gap  # Center-to-center spacing for vertical bars

# Hands
hand_thickness = 1.0
hour_hand_length = 22.0
hour_hand_width = 4.0
minute_hand_length = 35.0
minute_hand_width = 2.0
hour_angle = 30.0      # 1 o'clock position
minute_angle = 60.0    # 2 o'clock position

# Center pin / rivet
pin_diameter = 4.0
pin_height = 2.5

# =============================================================================
# BASE CLOCK BODY
# =============================================================================
# Outer cylindrical frame, built upward from Z=0
base = cq.Workplane("XY").circle(outer_diameter / 2).extrude(outer_height)

# Recess cut into the top face where numerals reside
recess = (
    cq.Workplane("XY", origin=(0, 0, outer_height - recess_depth))
    .circle(recess_diameter / 2)
    .extrude(recess_depth)
)
base = base.cut(recess)

# =============================================================================
# CENTER HUB
# =============================================================================
# Raised circular boss in the middle of the recessed face
hub = (
    cq.Workplane("XY", origin=(0, 0, outer_height - recess_depth))
    .circle(hub_diameter / 2)
    .extrude(hub_height)
)

# =============================================================================
# ROMAN NUMERAL HELPERS
# =============================================================================
# Z-center of all numerals (recessed face + half extrusion)
num_z = outer_height - recess_depth + numeral_height / 2

def vbar(cx, cy, cz):
    """Single vertical bar (the letter I)."""
    return cq.Workplane("XY").box(bar_width, bar_length, numeral_height).translate((cx, cy, cz))

def x_shape(cx, cy, cz):
    """Letter X from two crossing diagonal bars."""
    x1 = (
        cq.Workplane("XY")
        .box(bar_width, x_bar_length, numeral_height)
        .rotate((0, 0, 0), (0, 0, 1), 45)
        .translate((cx, cy, cz))
    )
    x2 = (
        cq.Workplane("XY")
        .box(bar_width, x_bar_length, numeral_height)
        .rotate((0, 0, 0), (0, 0, 1), -45)
        .translate((cx, cy, cz))
    )
    return x1.union(x2)

def v_shape(cx, cy, cz):
    """Letter V (pointing downward) from two angled bars."""
    left = (
        cq.Workplane("XY")
        .box(bar_width, v_bar_length, numeral_height)
        .rotate((0, 0, 0), (0, 0, 1), -v_angle)
        .translate((cx - 2.2, cy - 1.0, cz))
    )
    right = (
        cq.Workplane("XY")
        .box(bar_width, v_bar_length, numeral_height)
        .rotate((0, 0, 0), (0, 0, 1), v_angle)
        .translate((cx + 2.2, cy - 1.0, cz))
    )
    return left.union(right)

# =============================================================================
# HOUR POSITIONS
# =============================================================================
# Compute tangential positions for each hour (12 at top, clockwise)
hour_pos = {}
for h in range(1, 13):
    angle_deg = 90 - (h - 1) * 30
    rad = math.radians(angle_deg)
    hour_pos[h] = (
        numeral_radius * math.cos(rad),
        numeral_radius * math.sin(rad),
        0,
    )

# =============================================================================
# ASSEMBLE NUMERALS
# =============================================================================
model = base.union(hub)

# 12: XII
xii = (
    x_shape(-5, 0, num_z)
    .union(vbar(3, 0, num_z))
    .union(vbar(3 + step, 0, num_z))
)
model = model.union(xii.translate(hour_pos[12]))

# 1: I
model = model.union(vbar(0, 0, num_z).translate(hour_pos[1]))

# 2: II
ii = vbar(-step / 2, 0, num_z).union(vbar(step / 2, 0, num_z))
model = model.union(ii.translate(hour_pos[2]))

# 3: III
iii = (
    vbar(-step, 0, num_z)
    .union(vbar(0, 0, num_z))
    .union(vbar(step, 0, num_z))
)
model = model.union(iii.translate(hour_pos[3]))

# 4: IIII (traditional representation on clock faces)
iiii = (
    vbar(-1.5 * step, 0, num_z)
    .union(vbar(-0.5 * step, 0, num_z))
    .union(vbar(0.5 * step, 0, num_z))
    .union(vbar(1.5 * step, 0, num_z))
)
model = model.union(iiii.translate(hour_pos[4]))

# 5: V
model = model.union(v_shape(0, 0, num_z).translate(hour_pos[5]))

# 6: VI
vi = v_shape(-step, 0, num_z).union(vbar(step, 0, num_z))
model = model.union(vi.translate(hour_pos[6]))

# 7: VII
vii = (
    v_shape(-1.5 * step, 0, num_z)
    .union(vbar(0.5 * step, 0, num_z))
    .union(vbar(1.5 * step, 0, num_z))
)
model = model.union(vii.translate(hour_pos[7]))

# 8: VIII
viii = (
    v_shape(-2 * step, 0, num_z)
    .union(vbar(0, 0, num_z))
    .union(vbar(step, 0, num_z))
    .union(vbar(2 * step, 0, num_z))
)
model = model.union(viii.translate(hour_pos[8]))

# 9: IX
ix = vbar(-6, 0, num_z).union(x_shape(4, 0, num_z))
model = model.union(ix.translate(hour_pos[9]))

# 10: X
model = model.union(x_shape(0, 0, num_z).translate(hour_pos[10]))

# 11: XI
xi = x_shape(-4, 0, num_z).union(vbar(6, 0, num_z))
model = model.union(xi.translate(hour_pos[11]))

# =============================================================================
# HANDS
# =============================================================================
# Hands sit on top of the center hub
hand_z = outer_height - recess_depth + hub_height + hand_thickness / 2

# Hour hand
hour_hand = (
    cq.Workplane("XY")
    .box(hour_hand_width, hour_hand_length, hand_thickness)
    .translate((0, hour_hand_length / 2, 0))
    .rotate((0, 0, 0), (0, 0, 1), hour_angle)
    .translate((0, 0, hand_z))
)

# Minute hand
minute_hand = (
    cq.Workplane("XY")
    .box(minute_hand_width, minute_hand_length, hand_thickness)
    .translate((0, minute_hand_length / 2, 0))
    .rotate((0, 0, 0), (0, 0, 1), minute_angle)
    .translate((0, 0, hand_z))
)

model = model.union(hour_hand).union(minute_hand)

# =============================================================================
# CENTER PIN
# =============================================================================
# Small cap above the hands at the pivot point
pin = (
    cq.Workplane("XY", origin=(0, 0, hand_z + hand_thickness / 2))
    .circle(pin_diameter / 2)
    .extrude(pin_height)
)
model = model.union(pin)

# =============================================================================
# FINAL RESULT
# =============================================================================
result = model