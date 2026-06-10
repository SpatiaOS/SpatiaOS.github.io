import cadquery as cq
import math

# =============================================
# Elevator Winch / Traction Machine
# =============================================

# --- Core Parameters ---
shaft_z = 66.0              # Shaft centerline height from base bottom
shaft_r = 5.0               # Shaft radius

# --- Base Plate ---
base_length = 130.0
base_width = 86.0
base_height = 7.0
base_cx = 20.0

# --- X-axis Layout ---
lfw_x = -28.0               # Large flywheel start X
lfw_t = 9.0                 # Large flywheel thickness
sfw_x = 8.0                 # Small flywheel start X
sfw_t = 8.0                 # Small flywheel thickness
drum_x = 25.0               # Drum start X
drum_len = 56.0             # Drum length

# --- Support Brackets ---
brkt1_cx = -4.0
brkt2_cx = 19.0
brkt_t = 10.0
brkt_hw = 33.0              # Half-width in Y

# --- Flywheel sizes ---
lfw_r = 50.0
sfw_r = 42.0

# --- Drum ---
drum_r = 27.0
drum_groove_r = 22.0
flange_r = 33.0
flange_t = 3.0
num_grooves = 12

# --- Top Pipe ---
pipe_r = 5.0
pipe_h = 14.0

# =============================================
# 1. BASE PLATE
# =============================================
base = (
    cq.Workplane("XY")
    .center(base_cx, 0)
    .rect(base_length, base_width)
    .extrude(base_height)
)

# =============================================
# 2. ARCHED SUPPORT BRACKETS
# =============================================
def make_bracket(cx):
    """Create an arch-shaped support bracket centered at X=cx."""
    hw = brkt_hw
    arch_peak_z = shaft_z + 18.0
    bot_z = base_height - 1.0   # Slightly below base top for overlap
    spring_z = shaft_z - 5.0    # Where the arch starts curving

    # Build profile points on YZ plane (local coords: Y horizontal, Z vertical)
    pts = [(-hw, bot_z), (-hw, spring_z)]

    # Arch points - skip i=0 to avoid duplicate with previous point
    n_seg = 20
    for i in range(1, n_seg):
        t = i / float(n_seg)
        y_val = -hw + 2.0 * hw * t
        z_val = spring_z + (arch_peak_z - spring_z) * math.sin(math.pi * t)
        pts.append((y_val, z_val))

    pts.extend([(hw, spring_z), (hw, bot_z)])

    # Create closed wire and extrude
    wp = cq.Workplane("YZ").moveTo(pts[0][0], pts[0][1])
    for p in pts[1:]:
        wp = wp.lineTo(p[0], p[1])
    bracket = wp.close().extrude(brkt_t).translate((cx - brkt_t / 2.0, 0, 0))
    return bracket

bracket1 = make_bracket(brkt1_cx)
bracket2 = make_bracket(brkt2_cx)

# =============================================
# 3. MAIN SHAFT
# =============================================
shaft_x_start = lfw_x - 14.0
shaft_x_end = drum_x + drum_len + 3.0
shaft_length = shaft_x_end - shaft_x_start

shaft = (
    cq.Workplane("YZ")
    .center(0, shaft_z)
    .circle(shaft_r)
    .extrude(shaft_length)
    .translate((shaft_x_start, 0, 0))
)

# =============================================
# 4. FLYWHEELS with lightening holes
# =============================================
def make_flywheel(x_start, outer_r, thickness, n_holes=4,
                  angle_offset=math.pi / 4.0):
    """Create a flywheel disc with lightening holes cut through it."""
    hole_r = outer_r * 0.24
    hole_dist = outer_r * 0.57

    # Full solid disc
    fw = (
        cq.Workplane("YZ")
        .center(0, shaft_z)
        .circle(outer_r)
        .extrude(thickness)
        .translate((x_start, 0, 0))
    )

    # Cut lightening holes
    for i in range(n_holes):
        angle = angle_offset + i * 2.0 * math.pi / n_holes
        dy = hole_dist * math.cos(angle)
        dz = hole_dist * math.sin(angle)
        cut_cyl = (
            cq.Workplane("YZ")
            .center(dy, shaft_z + dz)
            .circle(hole_r)
            .extrude(thickness + 4.0)
            .translate((x_start - 2.0, 0, 0))
        )
        fw = fw.cut(cut_cyl)

    return fw

large_flywheel = make_flywheel(lfw_x, lfw_r, lfw_t, 4)
small_flywheel = make_flywheel(sfw_x, sfw_r, sfw_t, 4)

# =============================================
# 5. GROOVED CABLE DRUM
# =============================================
# Main drum cylinder
drum = (
    cq.Workplane("YZ")
    .center(0, shaft_z)
    .circle(drum_r)
    .extrude(drum_len)
    .translate((drum_x, 0, 0))
)

# Cut grooves into the drum surface
groove_pitch = drum_len / (num_grooves + 1)
groove_width = groove_pitch * 0.45

for i in range(num_grooves):
    groove_x = drum_x + (i + 0.75) * groove_pitch
    groove_cut = (
        cq.Workplane("YZ")
        .center(0, shaft_z)
        .circle(drum_r + 0.5)
        .circle(drum_groove_r)
        .extrude(groove_width)
        .translate((groove_x, 0, 0))
    )
    drum = drum.cut(groove_cut)

# End flanges (positioned to overlap slightly with drum)
for fx in [drum_x - flange_t + 1.0, drum_x + drum_len - 1.0]:
    flange = (
        cq.Workplane("YZ")
        .center(0, shaft_z)
        .circle(flange_r)
        .extrude(flange_t)
        .translate((fx, 0, 0))
    )
    drum = drum.union(flange)

# =============================================
# 6. TOP PIPE / FITTING
# =============================================
pipe_x = drum_x + drum_len * 0.35
pipe = (
    cq.Workplane("XY")
    .center(pipe_x, 0)
    .circle(pipe_r)
    .extrude(pipe_h)
    .translate((0, 0, shaft_z + drum_r - 1.0))
)

# =============================================
# 7. CRANK BLOCK (between flywheels)
# =============================================
crank_cx = (lfw_x + lfw_t + sfw_x) / 2.0
crank_block = (
    cq.Workplane("XY")
    .center(crank_cx, 0)
    .rect(12.0, 14.0)
    .extrude(14.0)
    .translate((0, 0, shaft_z - 7.0))
)

# =============================================
# 8. SHAFT HANDLE / PIN
# =============================================
handle = (
    cq.Workplane("YZ")
    .center(0, shaft_z - 18.0)
    .circle(3.0)
    .extrude(14.0)
    .translate((lfw_x - 12.0, 0, 0))
)

# =============================================
# ASSEMBLY - Union all parts
# =============================================
result = base
result = result.union(bracket1)
result = result.union(bracket2)
result = result.union(shaft)
result = result.union(large_flywheel)
result = result.union(small_flywheel)
result = result.union(drum)
result = result.union(pipe)
result = result.union(crank_block)
result = result.union(handle)