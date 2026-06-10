import cadquery as cq

# ==========================================
# Parameters
# ==========================================

# Key dimensions
px = 18.0         # Key pitch X (width + gap)
py = 18.0         # Key pitch Y (depth + gap)
gap = 2.0         # Gap between keys
kd_top = 10.0     # Depth of top row keys (half height)
py_top = kd_top + gap
key_h = 1.5       # Height of keys above base

# Base dimensions
margin = 6.0
base_thickness = 4.0
bump_radius = 6.0

# Layout configurations
main_cols = 15
nav_cols = 3
num_cols = 4
nav_gap = 0.5 * px
num_gap = 0.5 * px

# ==========================================
# Layout Calculations
# ==========================================

total_width = main_cols * px + nav_gap + nav_cols * px + num_gap + num_cols * px - gap
total_depth = py_top + 5 * py - gap

base_width = total_width + 2 * margin
base_depth = total_depth + 2 * margin

# Start coordinates to center the keys on the base
start_x = -base_width / 2.0 + margin
start_y = base_depth / 2.0 - margin

keys = []

def add_key(x, y, w, d):
    """Convert local top-left coordinates to global center coordinates."""
    cx_local = x + w / 2.0
    cy_local = y + d / 2.0
    cx_global = start_x + cx_local
    cy_global = start_y - cy_local
    keys.append((cx_global, cy_global, w, d))

# --- Main Block ---
# Row 0 (Top)
x_pos = 0
for span in [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5]:
    add_key(x_pos, 0, span * px - gap, kd_top)
    x_pos += span * px

# Row 1
x_pos = 0
for span in [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]:
    add_key(x_pos, py_top, span * px - gap, py - gap)
    x_pos += span * px

# Row 2
x_pos = 0
for span in [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5]:
    add_key(x_pos, py_top + py, span * px - gap, py - gap)
    x_pos += span * px

# Row 3
x_pos = 0
for span in [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25]:
    add_key(x_pos, py_top + 2*py, span * px - gap, py - gap)
    x_pos += span * px

# Row 4
x_pos = 0
for span in [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.75]:
    add_key(x_pos, py_top + 3*py, span * px - gap, py - gap)
    x_pos += span * px

# Row 5 (Bottom)
x_pos = 0
for span in [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25]:
    add_key(x_pos, py_top + 4*py, span * px - gap, py - gap)
    x_pos += span * px

# --- Nav Cluster ---
x_nav = main_cols * px + nav_gap
# Row 0
for i in range(3):
    add_key(x_nav + i*px, 0, px - gap, kd_top)
# Row 1
for i in range(3):
    add_key(x_nav + i*px, py_top, px - gap, py - gap)
# Row 2
for i in range(3):
    add_key(x_nav + i*px, py_top + py, px - gap, py - gap)
# Row 4 (Up arrow)
add_key(x_nav + px, py_top + 3*py, px - gap, py - gap)
# Row 5 (Left, Down, Right arrows)
for i in range(3):
    add_key(x_nav + i*px, py_top + 4*py, px - gap, py - gap)

# --- Numpad ---
x_num = x_nav + nav_cols * px + num_gap
# Row 0
for i in range(4):
    add_key(x_num + i*px, 0, px - gap, kd_top)
# Row 1
for i in range(4):
    add_key(x_num + i*px, py_top, px - gap, py - gap)
# Row 2
for i in range(4):
    add_key(x_num + i*px, py_top + py, px - gap, py - gap)
# Row 3
for i in range(4):
    add_key(x_num + i*px, py_top + 2*py, px - gap, py - gap)
# Row 4
for i in range(3):
    add_key(x_num + i*px, py_top + 3*py, px - gap, py - gap)
# Tall key (Enter)
add_key(x_num + 3*px, py_top + 3*py, px - gap, 2*py - gap)
# Row 5
add_key(x_num, py_top + 4*py, 2*px - gap, py - gap) # Wide 0 key
add_key(x_num + 2*px, py_top + 4*py, px - gap, py - gap) # Normal . key

# ==========================================
# 3D Modeling
# ==========================================

# 1. Base Plate
# Centered at origin, top surface at Z = 0
base_plate = (
    cq.Workplane("XY")
    .box(base_width, base_depth, base_thickness)
    .translate((0, 0, -base_thickness / 2.0))
    .edges("|Z and <Y")
    .fillet(4.0) # Round the front corners
)

# 2. Back Cylinder (Bump/Stand)
# Placed at the back edge, extending downwards
bump = (
    cq.Workplane("YZ")
    .workplane(offset=-base_width / 2.0)
    .moveTo(base_depth / 2.0 - bump_radius, -bump_radius)
    .circle(bump_radius)
    .extrude(base_width)
)

base = base_plate.union(bump)

# 3. Keys
key_solids = []
for cx, cy, w, d in keys:
    key = (
        cq.Workplane("XY")
        .center(cx, cy)
        .rect(w, d)
        .extrude(key_h)
        .edges(">Z")
        .fillet(0.4) # Soften the top edges of the keys
    )
    key_solids.append(key.val())

# Combine keys into a single compound for performance
keys_compound = cq.Compound.makeCompound(key_solids)

# 4. Final Assembly
result = base.add(keys_compound)