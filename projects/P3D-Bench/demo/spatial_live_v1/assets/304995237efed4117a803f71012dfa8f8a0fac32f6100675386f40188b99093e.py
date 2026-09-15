import cadquery as cq

# ---------------- Global parameters ----------------
# Thickness direction is X; blades lie in the Y-Z plane and stack face-to-face.
blade_t      = 2.0          # thickness of each blade half plate (pivot bore length)
pivot_hole_r = 1.583 / 2.0  # pivot bore radius (dia 1.583 mm)
boss_r       = 2.654        # pivot boss radius around the bore
blade_len    = 92.0         # pivot -> blade tip
blade_root_w = 7.0          # blade width at pivot
shank_len    = 26.0         # pivot -> loop base
shank_w      = 5.0          # shank (neck) width
loop_wall    = 4.5          # finger-loop ring wall thickness

# Per-half loop ellipse semi-axes (half 1 = rounder loop, half 2 = slender loop)
loop1_a, loop1_b = 12.0, 21.0
loop2_a, loop2_b = 10.0, 24.0

# Open-scissor pose: rigid rotation of each half about the pivot (X axis)
open_ang_1 = 14.0
open_ang_2 = -5.0
tip_off    = -6.0           # lateral offset of blade tip (curved half profile)

# Slotted knob fastener (spool) parameters
shaft_r    = 0.876          # central shaft radius
shaft_len  = 2 * blade_t    # spans both stacked blade plates (4.0 mm)
head1_r    = 2.66           # flanged disc head radii
head2_r    = 2.56
head_h     = 1.0            # head thickness
slot_w     = 1.2            # slot width across head face
slot_len   = 6.0            # slot length (across the head)
slot_depth = 1.0            # slot depth into head2

# ---------------- Helper: one scissor blade half ----------------
def make_blade_half(loop_a, loop_b, tip_offset):
    """Planar blade half: pivot boss + tapered blade + shank + finger loop ring."""
    wp = cq.Workplane("YZ")  # local x = global Y, local y = global Z, normal = +X

    # Pivot boss with through bore added later
    boss = wp.circle(boss_r).extrude(blade_t)

    # Tapered blade ending in a point
    blade = (
        wp.polyline([
            (-blade_root_w / 2.0, 0.0),
            ( blade_root_w / 2.0, 0.0),
            ( tip_offset + 1.2, -blade_len * 0.55),
            ( tip_offset, -blade_len),
        ]).close().extrude(blade_t)
    )

    # Shank / neck connecting pivot to finger loop
    shank = (
        wp.polyline([
            (-shank_w / 2.0, -1.0),
            ( shank_w / 2.0, -1.0),
            ( shank_w / 2.0 + 1.0, shank_len),
            (-shank_w / 2.0 - 1.0, shank_len),
        ]).close().extrude(blade_t)
    )

    # Finger loop: elliptical ring
    loop_cz = shank_len + loop_b - 8.0  # overlap shank top for a clean union
    loop_outer = cq.Workplane("YZ").center(0, loop_cz).ellipse(loop_a, loop_b).extrude(blade_t)
    loop_inner = (
        cq.Workplane("YZ").center(0, loop_cz)
        .ellipse(loop_a - loop_wall, loop_b - loop_wall).extrude(blade_t)
    )

    half = boss.union(blade).union(shank).union(loop_outer).cut(loop_inner)

    # Pivot through-hole (axis along X)
    hole = cq.Workplane("YZ").circle(pivot_hole_r).extrude(blade_t)
    return half.cut(hole)

# ---------------- Position the two halves ----------------
# Half 1 occupies X in [-blade_t, 0]; half 2 occupies X in [0, blade_t]
# so their flat side faces mate on the X = 0 plane.
blade_half_1 = (
    make_blade_half(loop1_a, loop1_b, tip_off)
    .translate((-blade_t, 0, 0))
    .rotate((0, 0, 0), (1, 0, 0), open_ang_1)
)
blade_half_2 = (
    make_blade_half(loop2_a, loop2_b, tip_off)
    .rotate((0, 0, 0), (1, 0, 0), open_ang_2)
)

# ---------------- Slotted knob fastener ----------------
shaft = cq.Workplane("YZ").workplane(offset=-blade_t).circle(shaft_r).extrude(shaft_len)
head_back  = cq.Workplane("YZ").workplane(offset=-blade_t - head_h).circle(head1_r).extrude(head_h)
head_front = cq.Workplane("YZ").workplane(offset=blade_t).circle(head2_r).extrude(head_h)

# Slot cut across the outer face of the front head
slot = (
    cq.Workplane("YZ")
    .workplane(offset=blade_t + head_h - slot_depth)
    .rect(slot_w, slot_len)
    .extrude(slot_depth + 0.5)
)
fastener = shaft.union(head_back).union(head_front).cut(slot)

# ---------------- Unified assembly ----------------
result = blade_half_1.union(blade_half_2).union(fastener)