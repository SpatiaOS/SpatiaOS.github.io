import math
import cadquery as cq

# ---------------------------------------------------------------------------
# Parameters (mm)
# ---------------------------------------------------------------------------
N_TEETH = 36
SPLINE_MAJOR_R = 8.62
SPLINE_MINOR_R = 7.55

PIN_JOURNAL_R = 10.0
PIN_JOURNAL_LEN = 53.5
PIN_SPLINE_LEN = 21.5
PIN_HOLE_D = 6.0
PIN_COLLAR_R = 11.6
PIN_END_BORE_R = 5.5
PIN_END_BORE_DEPTH = 9.0

YOKE_THICK = 23.4
YOKE_EAR_SPAN = 41.4
YOKE_EAR_INNER = 25.0
YOKE_HUB_R = 13.2
YOKE_HUB_LEN = 16.0
YOKE_HOLE_Z = 45.0
YOKE_PIVOT_R = 4.0
YOKE_BORE_R = 8.90
YOKE_CBORE_R = 9.80
YOKE_CBORE_DEPTH = 3.5

AJ_THICK = 26.0
AJ_EAR_SPAN = 42.0
AJ_EAR_INNER = 26.0
AJ_HUB_R = 14.0
AJ_HUB_LEN = 22.0
AJ_HOLE_Z = 50.0
AJ_BORE_R = 9.10

SHAFT_SPLINE_LEN = 62.0
SHAFT_SHANK_R = 11.08
SHAFT_SHANK_LEN = 78.0
SHAFT_HUB_LEN = 16.0
SHAFT_SPLINE_ENGAGE = 15.0
SHAFT_HUB_R = 13.6

CROSS_PIN_D = 8.0
CROSS_SPAN = 47.0
CROSS_CORE = 15.0

LEFT_BEND_DEG = 32.0
RIGHT_BEND_DEG = 6.0

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _v(p):
    return p if isinstance(p, cq.Vector) else cq.Vector(*p)


def _xyz(p):
    p = _v(p)
    return (p.x, p.y, p.z)


def _rodrigues(vec, axis_from, axis_to):
    a = axis_from.normalized()
    b = axis_to.normalized()
    k = a.cross(b)
    dot = max(-1.0, min(1.0, a.dot(b)))
    if k.Length < 1e-9:
        if dot > 0:
            return cq.Vector(vec.x, vec.y, vec.z)
        perp = cq.Vector(1, 0, 0) if abs(a.x) < 0.9 else cq.Vector(0, 1, 0)
        k = a.cross(perp).normalized()
        ang = math.pi
    else:
        k = k.normalized()
        ang = math.acos(dot)
    c, s = math.cos(ang), math.sin(ang)
    return vec * c + k.cross(vec) * s + k * (k.dot(vec) * (1.0 - c))


def place_part(wp, origin, z_dir, y_dir):
    """Map local +Z -> z_dir, local +Y -> y_dir, local origin -> origin."""
    z = _v(z_dir).normalized()
    y_want = _v(y_dir)
    y_want = y_want - z * y_want.dot(z)
    if y_want.Length < 1e-9:
        tmp = cq.Vector(1, 0, 0) if abs(z.x) < 0.9 else cq.Vector(0, 1, 0)
        y_want = tmp.cross(z)
    y_want = y_want.normalized()

    z0 = cq.Vector(0, 0, 1)
    axis = z0.cross(z)
    dot = max(-1.0, min(1.0, z0.dot(z)))
    if axis.Length > 1e-9:
        wp = wp.rotate((0, 0, 0), (axis.x, axis.y, axis.z), math.degrees(math.acos(dot)))
    elif dot < 0:
        wp = wp.rotate((0, 0, 0), (1, 0, 0), 180.0)

    y_after = _rodrigues(cq.Vector(0, 1, 0), z0, z)
    cr = y_after.cross(y_want)
    roll = math.degrees(math.atan2(cr.dot(z), y_after.dot(y_want)))
    if abs(roll) > 1e-6:
        wp = wp.rotate((0, 0, 0), (z.x, z.y, z.z), roll)

    o = _v(origin)
    return wp.translate((o.x, o.y, o.z))


def make_spline(major_r, minor_r, n_teeth, length):
    da = 2.0 * math.pi / n_teeth
    pts = []
    for i in range(n_teeth):
        a0 = i * da
        a1 = a0 + da * 0.16
        a2 = a0 + da * 0.34
        a3 = a0 + da * 0.66
        a4 = a0 + da * 0.84
        pts.append((minor_r * math.cos(a1), minor_r * math.sin(a1)))
        pts.append((major_r * math.cos(a2), major_r * math.sin(a2)))
        pts.append((major_r * math.cos(a3), major_r * math.sin(a3)))
        pts.append((minor_r * math.cos(a4), minor_r * math.sin(a4)))
    return cq.Workplane("XY").polyline(pts).close().extrude(length)


def make_yoke(
    thick=YOKE_THICK,
    ear_span=YOKE_EAR_SPAN,
    ear_inner=YOKE_EAR_INNER,
    hub_r=YOKE_HUB_R,
    hub_len=YOKE_HUB_LEN,
    hole_z=YOKE_HOLE_Z,
    pivot_r=YOKE_PIVOT_R,
    bore_r=None,
    cbore_r=None,
    cbore_depth=YOKE_CBORE_DEPTH,
):
    """Hub along +Z (back at z=0); pivot holes along Y at z=hole_z."""
    cap_r = thick / 2.0

    round_ends = (
        cq.Workplane("XZ")
        .center(0.0, hole_z)
        .circle(cap_r)
        .extrude(ear_span / 2.0, both=True)
    )
    arm_z0 = hub_len * 0.30
    arm_len = hole_z - arm_z0
    arms = (
        cq.Workplane("XY")
        .box(thick, ear_span, arm_len)
        .translate((0.0, 0.0, arm_z0 + arm_len / 2.0))
    )
    hub = cq.Workplane("XY").circle(hub_r).extrude(hub_len + 6.0)
    body = round_ends.union(arms).union(hub)

    slot_z0 = hub_len
    slot_z1 = hole_z + cap_r + 4.0
    slot = (
        cq.Workplane("XY")
        .box(thick + 10.0, ear_inner, slot_z1 - slot_z0)
        .translate((0.0, 0.0, (slot_z0 + slot_z1) / 2.0))
    )
    body = body.cut(slot)

    pivot = (
        cq.Workplane("XZ")
        .center(0.0, hole_z)
        .circle(pivot_r)
        .extrude(ear_span / 2.0 + 6.0, both=True)
    )
    body = body.cut(pivot)

    if bore_r is not None:
        body = body.cut(
            cq.Workplane("XY").circle(bore_r).extrude(hub_len + hole_z + 4.0)
        )
    if cbore_r is not None:
        body = body.cut(cq.Workplane("XY").circle(cbore_r).extrude(cbore_depth))
    return body


def make_cross(span=CROSS_SPAN, pin_d=CROSS_PIN_D, core=CROSS_CORE):
    r = pin_d / 2.0
    pin_y = cq.Workplane("XZ").circle(r).extrude(span / 2.0, both=True)
    pin_z = cq.Workplane("XY").circle(r).extrude(span / 2.0, both=True)
    cap_y = cq.Workplane("XZ").circle(r + 1.4).extrude(core / 2.0 + 2.0, both=True)
    cap_z = cq.Workplane("XY").circle(r + 1.4).extrude(core / 2.0 + 2.0, both=True)
    block = cq.Workplane("XY").box(core, core, core)
    return pin_y.union(pin_z).union(cap_y).union(cap_z).union(block)


def make_splined_pin():
    """Spline along +Z (into hub); journal along -Z (outboard stub)."""
    spline = make_spline(SPLINE_MAJOR_R, SPLINE_MINOR_R, N_TEETH, PIN_SPLINE_LEN)
    journal = cq.Workplane("XY").circle(PIN_JOURNAL_R).extrude(-PIN_JOURNAL_LEN)
    collar = cq.Workplane("XY").circle(PIN_COLLAR_R).extrude(-5.0)
    pin = spline.union(journal).union(collar)

    for zpos in (-16.0, -40.0):
        hole = (
            cq.Workplane("YZ")
            .center(0.0, zpos)
            .circle(PIN_HOLE_D / 2.0)
            .extrude(PIN_JOURNAL_R + 8.0, both=True)
        )
        pin = pin.cut(hole)

    end_bore = (
        cq.Workplane("XY")
        .workplane(offset=-PIN_JOURNAL_LEN)
        .circle(PIN_END_BORE_R)
        .extrude(PIN_END_BORE_DEPTH)
    )
    pin = pin.cut(end_bore)
    return pin


def make_angle_joint():
    """Forked yoke + hanging rectangular clevis with large through-hole."""
    body = make_yoke(
        thick=AJ_THICK,
        ear_span=AJ_EAR_SPAN,
        ear_inner=AJ_EAR_INNER,
        hub_r=AJ_HUB_R,
        hub_len=AJ_HUB_LEN,
        hole_z=AJ_HOLE_Z,
        pivot_r=YOKE_PIVOT_R,
        bore_r=AJ_BORE_R,
        cbore_r=9.74,
        cbore_depth=3.0,
    )

    boss_x, boss_y, boss_z = 16.0, 30.0, 36.0
    boss_cy = -AJ_HUB_R - 6.0
    boss_cz = 16.0
    boss = (
        cq.Workplane("XY")
        .box(boss_x, boss_y, boss_z)
        .translate((2.0, boss_cy, boss_cz))
    )
    body = body.union(boss)

    # 19.5 mm clevis hole through the rectangular face (local +X)
    clevis = (
        cq.Workplane("YZ")
        .center(boss_cy, boss_cz)
        .circle(19.5 / 2.0)
        .extrude(40.0, both=True)
    )
    body = body.cut(clevis)
    return body


def make_shaft_yoke():
    """Spline + smooth shank + U-joint yoke, local +Z = shaft axis."""
    spline = make_spline(SPLINE_MAJOR_R, SPLINE_MINOR_R, N_TEETH, SHAFT_SPLINE_LEN)
    shank = (
        cq.Workplane("XY")
        .circle(SHAFT_SHANK_R)
        .extrude(SHAFT_SHANK_LEN + 3.0)
        .translate((0.0, 0.0, SHAFT_SPLINE_LEN - 1.5))
    )
    collar = (
        cq.Workplane("XY")
        .circle(SHAFT_SHANK_R + 2.4)
        .extrude(8.0)
        .translate((0.0, 0.0, SHAFT_SPLINE_LEN + SHAFT_SHANK_LEN - 4.0))
    )
    yoke = make_yoke(
        thick=YOKE_THICK,
        ear_span=YOKE_EAR_SPAN,
        ear_inner=YOKE_EAR_INNER,
        hub_r=SHAFT_HUB_R,
        hub_len=SHAFT_HUB_LEN,
        hole_z=YOKE_HOLE_Z,
        pivot_r=YOKE_PIVOT_R,
        bore_r=None,
    ).translate((0.0, 0.0, SHAFT_SPLINE_LEN + SHAFT_SHANK_LEN))
    return spline.union(shank).union(collar).union(yoke)


# ---------------------------------------------------------------------------
# Layout
# Left U-joint bent in XZ; right U-joint slightly bent in XY (90° phasing)
# ---------------------------------------------------------------------------
alpha = math.radians(LEFT_BEND_DEG)
gamma = math.radians(RIGHT_BEND_DEG)

shaft_dir = cq.Vector(1.0, 0.0, 0.0)
# Inboard axes of the outer yokes (local +Z, toward each cross)
left_inboard = cq.Vector(math.cos(alpha), 0.0, -math.sin(alpha))
right_outboard = cq.Vector(math.cos(gamma), math.sin(gamma), 0.0)
right_inboard = right_outboard * -1.0

left_cross_p = cq.Vector(0.0, 0.0, 0.0)

left_inner_z = shaft_dir * -1.0
left_inner_y = cq.Vector(0.0, 1.0, 0.0)
left_inner_origin = left_cross_p - left_inner_z * YOKE_HOLE_Z

shaft_origin = left_inner_origin + left_inner_z * SHAFT_SPLINE_ENGAGE
shaft_hole_z = SHAFT_SPLINE_LEN + SHAFT_SHANK_LEN + YOKE_HOLE_Z
right_cross_p = shaft_origin + shaft_dir * shaft_hole_z

left_outer_z = left_inboard
left_outer_y = cq.Vector(math.sin(alpha), 0.0, math.cos(alpha))
left_outer_origin = left_cross_p - left_outer_z * AJ_HOLE_Z

right_outer_z = right_inboard
right_outer_y = cq.Vector(-math.sin(gamma), math.cos(gamma), 0.0)
right_outer_origin = right_cross_p - right_outer_z * YOKE_HOLE_Z

# ---------------------------------------------------------------------------
# Place components
# ---------------------------------------------------------------------------
left_pin = place_part(make_splined_pin(), left_outer_origin, left_outer_z, left_outer_y)
angle_joint = place_part(make_angle_joint(), left_outer_origin, left_outer_z, left_outer_y)
left_spider = (
    make_cross()
    .rotate((0.0, 0.0, 0.0), (0.0, 1.0, 0.0), LEFT_BEND_DEG)
    .translate(_xyz(left_cross_p))
)
left_inner = place_part(
    make_yoke(bore_r=YOKE_BORE_R, cbore_r=YOKE_CBORE_R),
    left_inner_origin,
    left_inner_z,
    left_inner_y,
)

shaft = place_part(
    make_shaft_yoke(),
    shaft_origin,
    shaft_dir,
    cq.Vector(0.0, 0.0, 1.0),
)

right_spider = (
    make_cross()
    .rotate((0.0, 0.0, 0.0), (0.0, 0.0, 1.0), RIGHT_BEND_DEG)
    .translate(_xyz(right_cross_p))
)
right_outer = place_part(
    make_yoke(bore_r=YOKE_BORE_R, cbore_r=YOKE_CBORE_R),
    right_outer_origin,
    right_outer_z,
    right_outer_y,
)
right_pin = place_part(
    make_splined_pin(), right_outer_origin, right_outer_z, right_outer_y
)

# ---------------------------------------------------------------------------
# Unified compound (do not name this list `parts`)
# ---------------------------------------------------------------------------
result = cq.Workplane("XY").newObject(
    [
        left_pin.val(),
        angle_joint.val(),
        left_spider.val(),
        left_inner.val(),
        shaft.val(),
        right_spider.val(),
        right_outer.val(),
        right_pin.val(),
    ]
)