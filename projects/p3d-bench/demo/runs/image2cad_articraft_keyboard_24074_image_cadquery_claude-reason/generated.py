import cadquery as cq
from collections import defaultdict

# =====================================================
# Apple-Style Full-Size Slim Keyboard
# Parametric CAD Model
# =====================================================

# --- Body parameters ---
BODY_L = 434.0       # mm, total length (X direction)
BODY_W = 115.0       # mm, total width (Y direction)
BODY_H = 4.5         # mm, total height (Z direction)
BODY_R = 6.0         # mm, corner radius in XY plane

# --- Key parameters ---
PITCH = 19.0         # mm, standard key center-to-center spacing
CAP = 15.5           # mm, standard 1U key cap size
RECESS_D = 0.7       # mm, key recess depth into body surface
FN_H = 10.0          # mm, function row key cap height (shorter)
SEC_GAP = 4.0        # mm, gap between keyboard sections
KEY_FILLET = 1.0     # mm, key cap corner radius

# =====================================================
# Step 1: Create the keyboard body slab (rounded rect via Sketch)
# =====================================================
body = (
    cq.Workplane("XY")
    .sketch()
    .rect(BODY_L, BODY_W)
    .vertices()
    .fillet(BODY_R)
    .finalize()
    .extrude(BODY_H)
)

# =====================================================
# Step 2: Calculate section layout positions
# =====================================================
P = PITCH

# Three sections: Main (15 key-units), Nav (3u), Numpad (4u)
total_key_w = 15 * P + SEC_GAP + 3 * P + SEC_GAP + 4 * P

# X center of column 0 for each section
x_main = -total_key_w / 2 + P / 2       # main section origin
x_nav = x_main + 15 * P + SEC_GAP       # nav cluster origin
x_num = x_nav + 3 * P + SEC_GAP         # numpad origin

# Y layout: function row cell + gap + 5 main rows
fn_cell_h = FN_H + (P - CAP)            # function row total cell height
total_key_h = fn_cell_h + SEC_GAP + 5 * P

# Y centers for each row
y_fn = total_key_h / 2 - fn_cell_h / 2              # function row
y_r0 = y_fn - fn_cell_h / 2 - SEC_GAP - P / 2       # first main row


def row_y(r):
    """Get Y center for main row index r (0=number row, 4=bottom row)."""
    return y_r0 - r * P


# =====================================================
# Step 3: Define all key positions and sizes
# =====================================================
keys = []


def add_key(col, y, width_units=1.0, cap_height=CAP, sec_x=x_main):
    """Add a key to the layout."""
    cx = sec_x + col * P + (width_units - 1) * P / 2
    w = CAP + (width_units - 1) * P
    keys.append((round(cx, 2), round(y, 2), round(w, 2), round(cap_height, 2)))


# ----- Function Row (small half-height keys) -----
for i in range(15):
    add_key(i, y_fn, cap_height=FN_H)
for i in range(3):
    add_key(i, y_fn, cap_height=FN_H, sec_x=x_nav)
for i in range(4):
    add_key(i, y_fn, cap_height=FN_H, sec_x=x_num)

# ----- Row 0: Number row -----
y = row_y(0)
for i in range(13):
    add_key(i, y)
add_key(13, y, 2.0)                                       # Backspace
for i in range(3):
    add_key(i, y, sec_x=x_nav)
for i in range(4):
    add_key(i, y, sec_x=x_num)

# ----- Row 1: QWERTY row -----
y = row_y(1)
add_key(0, y, 1.5)                                        # Tab
for i in range(12):
    add_key(1.5 + i, y)
add_key(13.5, y, 1.5)                                     # Backslash
for i in range(3):
    add_key(i, y, sec_x=x_nav)
for i in range(4):
    add_key(i, y, sec_x=x_num)

# ----- Row 2: Home row -----
y = row_y(2)
add_key(0, y, 1.75)                                       # Caps Lock
for i in range(11):
    add_key(1.75 + i, y)
add_key(12.75, y, 2.25)                                   # Return
for i in range(4):
    add_key(i, y, sec_x=x_num)

# ----- Row 3: Shift row -----
y = row_y(3)
add_key(0, y, 2.25)                                       # Left Shift
for i in range(10):
    add_key(2.25 + i, y)
add_key(12.25, y, 2.75)                                   # Right Shift
add_key(1, y, sec_x=x_nav)                               # Up arrow
for i in range(4):
    add_key(i, y, sec_x=x_num)

# ----- Row 4: Bottom row -----
y = row_y(4)
add_key(0, y, 1.25)                                       # Fn
add_key(1.25, y, 1.25)                                    # Control
add_key(2.5, y, 1.5)                                      # Option
add_key(4.0, y, 1.75)                                     # Command
add_key(5.75, y, 6.25)                                    # Space bar
add_key(12.0, y, 1.75)                                    # Command
add_key(13.75, y, 1.25)                                   # Option
add_key(0, y, sec_x=x_nav)                               # Left arrow
add_key(1, y, sec_x=x_nav)                               # Down arrow
add_key(2, y, sec_x=x_nav)                               # Right arrow
add_key(0, y, 2.0, sec_x=x_num)                          # 0 (2U wide)
add_key(2, y, sec_x=x_num)                               # .
add_key(3, y, sec_x=x_num)                               # Enter

# =====================================================
# Step 4: Cut all key recesses using individual operations
# =====================================================
# Group keys by (width, height) for batch processing
size_groups = defaultdict(list)
for (cx, cy, w, h) in keys:
    size_groups[(w, h)].append((cx, cy))

# Build a single sketch with all key outlines
key_sketch = cq.Sketch()
for (w, h), positions in size_groups.items():
    key_sketch = key_sketch.push(positions).rect(w, h).reset()

# Cut all key recesses from the top face
result = (
    body
    .faces(">Z")
    .workplane()
    .placeSketch(key_sketch)
    .cutBlind(-RECESS_D)
)