import cadquery as cq
import math

# ============================================================
# Stylized Leaping Panther/Cat Figurine
# Approximate bounding box: ~260 × 129 × 115 mm
# ============================================================

# --- Pose parameters ---
body_tilt_deg = 25.0   # torso tilt angle (head end rises)
head_tilt_deg = 33.0   # total head tilt from horizontal
bt = math.radians(body_tilt_deg)
ht = math.radians(head_tilt_deg)


def body_pt(x):
    """Map a point along the untilted body axis to tilted world coords."""
    return (x * math.cos(bt), 0.0, x * math.sin(bt))


# ============================================================
# 1. TORSO — loft of elliptical cross-sections, then tilted
# ============================================================
torso = (
    cq.Workplane("YZ")
    .workplane(offset=-70)      # tail root
    .ellipse(12, 14)
    .workplane(offset=25)       # hip
    .ellipse(28, 30)
    .workplane(offset=30)       # waist
    .ellipse(25, 27)
    .workplane(offset=30)       # chest
    .ellipse(29, 31)
    .workplane(offset=25)       # shoulder
    .ellipse(23, 25)
    .workplane(offset=22)       # neck base (x_orig = 62)
    .ellipse(16, 18)
    .loft()
)
torso = torso.rotate((0, 0, 0), (0, 1, 0), -body_tilt_deg)

# ============================================================
# 2. HEAD — lofted from skull back to snout tip
# ============================================================
head = (
    cq.Workplane("YZ")
    .workplane(offset=-8)       # back of skull
    .ellipse(16, 18)
    .workplane(offset=16)       # crown (widest)
    .ellipse(19, 21)
    .workplane(offset=13)       # mid-face
    .ellipse(14, 15)
    .workplane(offset=11)       # upper snout
    .ellipse(9, 10)
    .workplane(offset=9)        # snout tip
    .ellipse(5, 6)
    .loft()
)
head = head.rotate((0, 0, 0), (0, 1, 0), -head_tilt_deg)
# Position at neck base
nbp = body_pt(62)
head = head.translate(nbp)

# ============================================================
# 3. EARS — tapered lofts atop the head
# ============================================================
ear_height = 14.0
ear_sep = 9.0       # Y offset from centerline
ear_fwd = 10.0      # forward along head axis
ear_up = 16.0       # above head center

ecx = nbp[0] + ear_fwd * math.cos(ht)
ecz = nbp[2] + ear_fwd * math.sin(ht) + ear_up

left_ear = (
    cq.Workplane("XY")
    .ellipse(5.0, 3.5)
    .workplane(offset=ear_height)
    .ellipse(1.5, 1.0)
    .loft()
    .translate((ecx, -ear_sep, ecz))
)
right_ear = (
    cq.Workplane("XY")
    .ellipse(5.0, 3.5)
    .workplane(offset=ear_height)
    .ellipse(1.5, 1.0)
    .loft()
    .translate((ecx, ear_sep, ecz))
)

# ============================================================
# 4. NOSE — small cylindrical feature at snout tip
# ============================================================
nose_radius = 2.3
nose_depth = 2.06
nose_dist = 40.0     # distance from head origin along head axis

nose_x = nbp[0] + nose_dist * math.cos(ht)
nose_z = nbp[2] + nose_dist * math.sin(ht)

nose = (
    cq.Workplane("XY")
    .circle(nose_radius)
    .extrude(nose_depth)
    .rotate((0, 0, 0), (0, 1, 0), (90.0 - head_tilt_deg))
    .translate((nose_x, 0, nose_z))
)

# ============================================================
# 5. TAIL — circle swept along a curved spline path
# ============================================================
tail_radius = 8.0
tbp = body_pt(-70)   # tail base position (rear of torso)

# Spline points in XZ plane, origin = tail base
tail_path = (
    cq.Workplane("XZ")
    .spline([
        (-18, -5),
        (-40, 12),
        (-68, 50),
        (-90, 85),
        (-85, 108),
    ])
)

tail = (
    cq.Workplane("YZ")
    .circle(tail_radius)
    .sweep(tail_path)
    .translate(tbp)
)

# ============================================================
# 6. LEGS — tapered cylinders (upper + lower per leg)
# ============================================================
def leg_seg(r_top, r_bot, length):
    """Create a downward-pointing tapered cylinder."""
    return (
        cq.Workplane("XY")
        .circle(r_top)
        .workplane(offset=-length)
        .circle(r_bot)
        .loft()
    )


# --- Front leg parameters ---
fl_lean = 50.0                          # forward lean from vertical (deg)
fl_r_upper, fl_r_knee, fl_r_paw = 12.0, 7.0, 6.0
fl_len_upper, fl_len_lower = 22.0, 22.0
fl_y_offset = 13.0                      # lateral offset from body center
fl_lower_lean = 18.0                    # lower segment lean

sp = body_pt(28)                        # shoulder attachment point
fl_start_z = sp[2] - 18                 # start inside body for overlap
fl_dx = fl_len_upper * math.sin(math.radians(fl_lean))
fl_dz = -fl_len_upper * math.cos(math.radians(fl_lean))

# --- Rear leg parameters ---
rl_lean = -32.0                         # backward lean from vertical (deg)
rl_r_upper, rl_r_knee, rl_r_paw = 16.0, 8.0, 7.0
rl_len_upper, rl_len_lower = 25.0, 22.0
rl_y_offset = 14.0
rl_lower_lean = -5.0

hp = body_pt(-38)                       # hip attachment point
rl_start_z = hp[2] - 12
rl_dx = rl_len_upper * math.sin(math.radians(rl_lean))
rl_dz = -rl_len_upper * math.cos(math.radians(rl_lean))

# Build all 8 leg segments (4 legs × 2 segments)
legs = []
for side in [-1, 1]:
    # Front upper
    legs.append(
        leg_seg(fl_r_upper, fl_r_knee, fl_len_upper)
        .rotate((0, 0, 0), (0, 1, 0), fl_lean)
        .translate((sp[0], side * fl_y_offset, fl_start_z))
    )
    # Front lower
    legs.append(
        leg_seg(fl_r_knee, fl_r_paw, fl_len_lower)
        .rotate((0, 0, 0), (0, 1, 0), fl_lower_lean)
        .translate((sp[0] + fl_dx, side * fl_y_offset, fl_start_z + fl_dz))
    )
    # Rear upper
    legs.append(
        leg_seg(rl_r_upper, rl_r_knee, rl_len_upper)
        .rotate((0, 0, 0), (0, 1, 0), rl_lean)
        .translate((hp[0], side * rl_y_offset, rl_start_z))
    )
    # Rear lower
    legs.append(
        leg_seg(rl_r_knee, rl_r_paw, rl_len_lower)
        .rotate((0, 0, 0), (0, 1, 0), rl_lower_lean)
        .translate((hp[0] + rl_dx, side * rl_y_offset, rl_start_z + rl_dz))
    )

# ============================================================
# FINAL ASSEMBLY — boolean union of all components
# ============================================================
result = (
    torso
    .union(head)
    .union(left_ear)
    .union(right_ear)
    .union(nose)
    .union(tail)
)
for leg in legs:
    result = result.union(leg)