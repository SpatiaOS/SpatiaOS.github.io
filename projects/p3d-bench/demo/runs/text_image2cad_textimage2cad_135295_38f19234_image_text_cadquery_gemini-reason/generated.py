import cadquery as cq

# ==========================================
# Parameters
# ==========================================
# Target overall bounding box: ~260.2 x 128.7 x 114.9 mm
# The model is constructed along the X-axis for the head-to-tail progression,
# utilizing overlapping lofted profiles to approximate the sculptural B-spline forms.

nose_radius = 2.30
nose_length = 2.06
base_cut_z = -64.0  # Z-level to create the flat seating base

# ==========================================
# Modeling Steps
# ==========================================

# 1. Main Body and Head Shell
# Lofted from the rear to the snout to form the core stylized quadruped shape.
body_head = (
    cq.Workplane("YZ")
    .workplane(offset=0).moveTo(0, 5).ellipse(35, 25)
    .workplane(offset=50).moveTo(0, 20).ellipse(55, 35)
    .workplane(offset=50).moveTo(0, 10).ellipse(40, 30)
    .workplane(offset=30).moveTo(0, -5).ellipse(22, 18)
    .workplane(offset=25).moveTo(0, -20).ellipse(6, 5)
    .loft()
)

# 2. Nose Detail
# Small cylindrical feature at the snout tip. Placed slightly inside to ensure solid union.
nose_wp = cq.Workplane("YZ", origin=(154, 0, -19.5)).transformed(rotate=(30, 0, 0))
nose = nose_wp.circle(nose_radius).extrude(nose_length + 1.0) 

# 3. Pointed Ears
# Located on the head shell, pointing upwards and outwards.
ear_L = (
    cq.Workplane("XY")
    .workplane(offset=15).moveTo(120, 15).ellipse(10, 5)
    .workplane(offset=35).moveTo(110, 30).ellipse(2, 1)
    .loft()
)

# 4. Hind Legs
# Thick thighs extending down to flat feet, typical of a leaping quadruped.
hl_leg_L = (
    cq.Workplane("YZ")
    .workplane(offset=20).moveTo(30, 0).ellipse(15, 20)
    .workplane(offset=-15).moveTo(55, -25).ellipse(10, 15)
    .workplane(offset=-15).moveTo(45, -50).ellipse(6, 8)
    .loft()
)

hl_foot_L = (
    cq.Workplane("YZ")
    .workplane(offset=-10).moveTo(45, -50).ellipse(6, 8)
    .workplane(offset=15).moveTo(40, -60).ellipse(8, 3)
    .loft()
)

# 5. Front Legs
# Shorter limbs extending downwards and forwards.
fl_leg_L = (
    cq.Workplane("YZ")
    .workplane(offset=95).moveTo(30, 0).ellipse(12, 15)
    .workplane(offset=-15).moveTo(45, -25).ellipse(8, 10)
    .workplane(offset=15).moveTo(35, -50).ellipse(5, 6)
    .loft()
)

fl_foot_L = (
    cq.Workplane("YZ")
    .workplane(offset=95).moveTo(35, -50).ellipse(5, 6)
    .workplane(offset=15).moveTo(30, -60).ellipse(6, 3)
    .loft()
)

# 6. Sweeping Tail
# Curving organically from the rear body backwards.
tail = (
    cq.Workplane("YZ")
    .workplane(offset=5).moveTo(0, 5).circle(6)
    .workplane(offset=-35).moveTo(0, -15).circle(5)
    .workplane(offset=-40).moveTo(0, -25).circle(3.5)
    .workplane(offset=-35).moveTo(0, 15).circle(2)
    .loft()
)

# ==========================================
# Assembly & Final Operations
# ==========================================

# Combine all sculptural elements into a single unified freeform model
result = body_head
parts_to_union = [
    nose, 
    ear_L.mirror("XZ"), 
    hl_leg_L.mirror("XZ"), 
    hl_foot_L.mirror("XZ"), 
    fl_leg_L.mirror("XZ"), 
    fl_foot_L.mirror("XZ"), 
    tail
]

for part in parts_to_union:
    result = result.union(part)

# Create the small planar faces acting as a flat base for stable seating
base_cut = cq.Workplane("XY", origin=(0, 0, base_cut_z - 10)).box(500, 500, 20)
result = result.cut(base_cut)