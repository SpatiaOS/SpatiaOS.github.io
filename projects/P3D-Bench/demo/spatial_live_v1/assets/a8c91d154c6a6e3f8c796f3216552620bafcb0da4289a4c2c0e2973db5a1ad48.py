import math
import cadquery as cq

# ============================== GLOBAL PARAMETERS ==============================
# The whole assembly is modelled in a "local" frame:
#   local X -> length of the blades,  local Y -> width (splay),  local Z -> thickness.
# At the very end it is rotated so that the thin plane normal points along X.

BLADE_THK = 2.0          # thin steel blade / shank thickness (= pivot bore length)
HANDLE_THK = 7.0         # moulded finger-loop thickness (= part bounding-box thickness)
PIVOT_HOLE_D = 1.583     # pivot bore diameter
BOSS_R = 2.654           # small raised boss around the bore
BOSS_H = 0.25
OPEN_ANGLE = 10.0        # total angle between the two blade halves

# slotted knob fastener -------------------------------------------------------
SHAFT_R = PIVOT_HOLE_D / 2.0     # shaft fills both bores (annotation lists 0.876 / 0.79)
SHAFT_LEN = 2 * BLADE_THK        # 4.0 mm  = two 2 mm thick blades
HEAD_R_1 = 2.66                  # slotted (upper) disc head
HEAD_R_2 = 2.56                  # plain (lower) disc head
HEAD_H = 1.0
HEAD_RND = 0.35
SLOT_W = 0.9
SLOT_DEPTH = 0.45

# ------------------------- blade half definitions ---------------------------
# Each half is described by a spine (centre line, pivot at the origin) with a
# left / right half width per station, plus an elliptical finger loop.

BLADE_LARGE = {
    "spine": [
        (-37.9, 19.9), (-30.0, 13.5), (-23.0, 8.3), (-16.0, 4.3), (-9.0, 1.6),
        (0.0, 0.0), (12.0, -0.6), (30.0, -1.0), (50.0, -1.0), (68.0, -0.6), (84.0, 0.0),
    ],
    "hw_left": [4.2, 3.8, 3.6, 3.8, 4.4, 5.2, 4.8, 3.9, 2.9, 1.8, 0.25],   # back edge
    "hw_right": [4.2, 3.8, 3.6, 3.8, 4.4, 4.6, 4.0, 3.0, 2.0, 1.2, 0.25],  # cutting edge
    "loop_center": (-52.0, 27.0),
    "loop_angle": 153.4,          # major axis aligned with the neck
    "loop_a": 19.0,
    "loop_b": 13.0,
    "loop_ring": 4.5,             # radial wall of the loop
    "ramp_x0": -33.0,             # neck keeps full handle thickness up to here
    "ramp_x1": -21.0,             # ... and is thinned to blade thickness from here
    "thin_z0": 0.0,               # this half sits on the upper side of the joint plane
    "boss_up": True,
    "swing": OPEN_ANGLE / 2.0,
}

BLADE_SMALL = {
    "spine": [
        (-37.2, -10.3), (-30.0, -7.0), (-23.0, -4.5), (-16.0, -2.5), (-9.0, -1.0),
        (0.0, 0.0), (14.0, 0.5), (32.0, 0.9), (55.0, 0.9), (78.0, 0.5), (97.6, 0.0),
    ],
    "hw_left": [4.0, 3.6, 3.4, 3.6, 4.2, 4.6, 4.0, 3.2, 2.2, 1.3, 0.25],   # cutting edge
    "hw_right": [4.0, 3.6, 3.4, 3.6, 4.2, 5.2, 4.6, 3.8, 2.8, 1.7, 0.25],  # back edge
    "loop_center": (-48.0, -13.0),
    "loop_angle": 14.0,
    "loop_a": 14.0,
    "loop_b": 10.0,
    "loop_ring": 4.2,
    "ramp_x0": -33.0,
    "ramp_x1": -21.0,
    "thin_z0": -BLADE_THK,        # lower side of the joint plane
    "boss_up": False,
    "swing": -OPEN_ANGLE / 2.0,
}


# ================================= HELPERS ==================================
def _side_points(spine, hw_left, hw_right):
    """Offset a spine polyline by per-station half widths -> left / right rails."""
    n = len(spine)
    left, right = [], []
    for i in range(n):
        x, y = spine[i]
        if i == 0:
            dx, dy = spine[1][0] - x, spine[1][1] - y
        elif i == n - 1:
            dx, dy = x - spine[n - 2][0], y - spine[n - 2][1]
        else:
            dx = spine[i + 1][0] - spine[i - 1][0]
            dy = spine[i + 1][1] - spine[i - 1][1]
        length = math.hypot(dx, dy)
        nx, ny = -dy / length, dx / length          # in-plane normal
        left.append((x + nx * hw_left[i], y + ny * hw_left[i]))
        right.append((x - nx * hw_right[i], y - ny * hw_right[i]))
    return left, right


def _blade_outline(spine, hw_left, hw_right, z0):
    """Closed spline outline (loop root -> tip -> back) of one blade half."""
    left, right = _side_points(spine, hw_left, hw_right)
    return (
        cq.Workplane("XY", origin=(0, 0, z0))
        .moveTo(*left[0])
        .spline(left[1:], includeCurrent=True)      # back / outer contour
        .lineTo(*right[-1])                         # blade point
        .spline(right[-2::-1], includeCurrent=True)  # cutting side contour
        .close()
    )


def _ramp_cutter(x0, x1, z_full, z_thin, outward):
    """
    Prismatic cutter that leaves the full handle thickness for x < x0 and the
    blade thickness for x > x1, blending linearly in between (offset shank).
    """
    big = 500.0
    pts = [
        (x0 - big, z_full),
        (x0, z_full),
        (x1, z_thin),
        (x1 + big, z_thin),
        (x1 + big, z_full + outward * big),
        (x0 - big, z_full + outward * big),
    ]
    return cq.Workplane("XZ").polyline(pts).close().extrude(big, both=True)


def _finger_loop(center, angle, a, b, ring, thk):
    """Domed elliptical finger loop: lofted outer lens minus lofted inner hole."""
    dz = thk / 2.0
    outer = (
        cq.Workplane("XY", origin=(0, 0, -dz))
        .ellipse(0.90 * a, 0.90 * b)
        .workplane(offset=dz)
        .ellipse(a, b)
        .workplane(offset=dz)
        .ellipse(0.90 * a, 0.90 * b)
        .loft(ruled=False)
    )
    ai, bi = a - ring, b - ring
    inner = (
        cq.Workplane("XY", origin=(0, 0, -(dz + 2.0)))
        .ellipse(ai + 1.2, bi + 1.2)
        .workplane(offset=dz + 2.0)
        .ellipse(ai, bi)
        .workplane(offset=dz + 2.0)
        .ellipse(ai + 1.2, bi + 1.2)
        .loft(ruled=False)
    )
    return (
        outer.cut(inner)
        .rotate((0, 0, 0), (0, 0, 1), angle)
        .translate((center[0], center[1], 0.0))
    )


def make_blade_half(cfg):
    """Finger loop + offset neck + tapered blade, with the pivot bore."""
    thin_z0 = cfg["thin_z0"]

    # start from the full-thickness prism of the planar outline ...
    solid = _blade_outline(
        cfg["spine"], cfg["hw_left"], cfg["hw_right"], -HANDLE_THK / 2.0
    ).extrude(HANDLE_THK)

    # ... then ramp it down to a thin blade sitting on one side of the joint plane
    solid = solid.cut(
        _ramp_cutter(cfg["ramp_x0"], cfg["ramp_x1"],
                     HANDLE_THK / 2.0, thin_z0 + BLADE_THK, +1.0)
    )
    solid = solid.cut(
        _ramp_cutter(cfg["ramp_x0"], cfg["ramp_x1"],
                     -HANDLE_THK / 2.0, thin_z0, -1.0)
    )

    # moulded finger loop
    solid = solid.union(
        _finger_loop(cfg["loop_center"], cfg["loop_angle"],
                     cfg["loop_a"], cfg["loop_b"], cfg["loop_ring"], HANDLE_THK)
    )

    # raised boss on the outer face + pivot bore
    boss_z = thin_z0 + BLADE_THK if cfg["boss_up"] else thin_z0 - BOSS_H
    solid = solid.union(
        cq.Workplane("XY", origin=(0, 0, boss_z)).circle(BOSS_R).extrude(BOSS_H)
    )
    solid = solid.cut(
        cq.Workplane("XY", origin=(0, 0, -HANDLE_THK))
        .circle(PIVOT_HOLE_D / 2.0)
        .extrude(2 * HANDLE_THK)
    )

    # scissor opening angle about the pivot axis
    return solid.rotate((0, 0, 0), (0, 0, 1), cfg["swing"])


def make_fastener():
    """Spool shaped slotted knob: shaft + two rounded disc heads, one slotted."""
    shaft = (
        cq.Workplane("XY", origin=(0, 0, -SHAFT_LEN / 2.0))
        .circle(SHAFT_R)
        .extrude(SHAFT_LEN)
    )
    head_top = (
        cq.Workplane("XY", origin=(0, 0, SHAFT_LEN / 2.0))
        .circle(HEAD_R_1)
        .extrude(HEAD_H)
        .edges(">Z")
        .fillet(HEAD_RND)
    )
    head_bot = (
        cq.Workplane("XY", origin=(0, 0, -SHAFT_LEN / 2.0 - HEAD_H))
        .circle(HEAD_R_2)
        .extrude(HEAD_H)
        .edges("<Z")
        .fillet(HEAD_RND)
    )
    slot = cq.Workplane("XY", origin=(0, 0, SHAFT_LEN / 2.0 + HEAD_H - SLOT_DEPTH)).box(
        2 * HEAD_R_1 + 2.0, SLOT_W, SLOT_DEPTH + 1.0, centered=(True, True, False)
    )
    return shaft.union(head_top).union(head_bot).cut(slot)


# ================================= ASSEMBLY =================================
blade_large_loop = make_blade_half(BLADE_LARGE)
blade_small_loop = make_blade_half(BLADE_SMALL)
fastener = make_fastener()

scissors = blade_large_loop.union(blade_small_loop).union(fastener)

# planar layout with its normal along X, blades running along Z (tips at -Z)
result = scissors.rotate((0, 0, 0), (0, 1, 0), 90)