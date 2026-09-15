import cadquery as cq
import math

# =============================================================================
# Parameters (mm) — hand-cranked ring-gear mechanism on a cast stand
# Interpretation: triangular bulkhead plate, internal ring gear with a
# 4-spoke pinion, tapered housing, and a two-arm crank.
# =============================================================================

# Base frame
base_len_x = 78.0
base_width_y = 72.0
base_thick = 8.0
rail_w = 15.0

# Triangular support plate (YZ plane, thickness along X)
tri_x = 6.0
tri_thick = 12.0
tri_base_y = 70.0
tri_top_y = 26.0
tri_height = 86.0

# Main shaft
shaft_z = 80.0
shaft_r = 5.5
shaft_x0 = -92.0
shaft_x1 = 54.0

# Large internal ring gear
ring_outer_r = 70.0
ring_root_r = 59.0
ring_tooth_h = 4.2
ring_tooth_w = 2.6
ring_n_teeth = 42
ring_thick = 16.0
ring_x = 38.0

# Inner 4-spoke gear
inner_root_r = 48.0
inner_tooth_h = 3.8
inner_tooth_w = 2.4
inner_n_teeth = 30
inner_rim_ir = 36.0
inner_hub_r = 11.0
inner_spoke_w = 11.0
inner_thick = 10.0
inner_x = 34.0

# Tapered housing (cone)
cone_r1 = 17.0
cone_r2 = 9.5
cone_x_hi = 6.0
cone_x_lo = -46.0

# Nozzle / collar at the small end of the cone
noz_r = 8.0
noz_len = 10.0
collar_r = 11.0
collar_len = 6.0

# Crank hub
crank_hub_x = -62.0
crank_hub_r = 11.0
crank_hub_len = 16.0

# Crank arms
bar_w = 7.5
bar_t = 6.0
long_len = 128.0
long_ang = 50.0          # deg from +Z toward -X
short_len = 74.0
short_ang = 6.0
grip_r = 5.5
grip_len = 26.0

# Small side lever on the hub
lever_len = 28.0
lever_ang_y = -25.0


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def union_all(parts):
    acc = parts[0]
    for p in parts[1:]:
        acc = acc.union(p)
    return acc


def rect_teeth(radius, tooth_h, tooth_w, n, thick, inward=False):
    """Rectangular teeth arranged in a polar array (XY, extruded +Z)."""
    # Place tooth centres at the mid-height of each tooth
    sign = -1.0 if inward else 1.0
    r_mid = radius + sign * (tooth_h * 0.5)
    # rect(radial, circumferential) — polarArray(rotate=True) aligns local X radially
    teeth = (
        cq.Workplane("XY")
        .polarArray(r_mid, 0, 360, n)
        .rect(tooth_h, tooth_w)
        .extrude(thick)
    )
    return teeth


def to_shaft_axis(solid_xy, x_center, thick):
    """Gear built in XY (axis +Z) -> axis +X, centred at x_center, z=shaft_z."""
    return (
        solid_xy
        .translate((0, 0, -thick / 2.0))
        .rotate((0, 0, 0), (0, 1, 0), 90)
        .translate((x_center, 0, shaft_z))
    )


def crank_arm(length, angle_from_z, x_root, z_root):
    """Rectangular crank bar in the XZ plane plus a cylindrical grip."""
    bar = (
        cq.Workplane("XY")
        .rect(bar_t, bar_w)
        .extrude(length)
        .translate((0, 0, 0))
        .rotate((0, 0, 0), (0, 1, 0), -angle_from_z)
        .translate((x_root, 0, z_root))
    )
    # Enlarged pad at the free end
    a = math.radians(angle_from_z)
    ex = x_root - math.sin(a) * length
    ez = z_root + math.cos(a) * length
    pad = (
        cq.Workplane("XY")
        .box(bar_t + 2, bar_w + 2, 10)
        .rotate((0, 0, 0), (0, 1, 0), -angle_from_z)
        .translate((ex, 0, ez))
    )
    # Grip cylinder along Y
    grip = (
        cq.Workplane("XZ")
        .circle(grip_r)
        .extrude(grip_len)
        .translate((ex, -grip_len / 2.0, ez))
    )
    return union_all([bar, pad, grip])


# -----------------------------------------------------------------------------
# 1. U-shaped base frame
# -----------------------------------------------------------------------------
x_mid = 4.0
rail_len = base_len_x
left_rail = (
    cq.Workplane("XY")
    .box(rail_len, rail_w, base_thick)
    .translate((x_mid, (base_width_y - rail_w) / 2.0, base_thick / 2.0))
)
right_rail = (
    cq.Workplane("XY")
    .box(rail_len, rail_w, base_thick)
    .translate((x_mid, -(base_width_y - rail_w) / 2.0, base_thick / 2.0))
)
# Cross-bar at the wheel (+X) end, with slight overhang “feet”
foot_overhang = 8.0
back_bar = (
    cq.Workplane("XY")
    .box(rail_w + 4, base_width_y + foot_overhang, base_thick)
    .translate((x_mid + rail_len / 2.0 - (rail_w + 4) / 2.0, 0, base_thick / 2.0))
)
# Front cross-bar (handle side)
front_bar = (
    cq.Workplane("XY")
    .box(rail_w, base_width_y - 4, base_thick)
    .translate((x_mid - rail_len / 2.0 + rail_w / 2.0, 0, base_thick / 2.0))
)
base = union_all([left_rail, right_rail, back_bar, front_bar])
base = base.edges("|Z").fillet(2.5)


# -----------------------------------------------------------------------------
# 2. Triangular bulkhead plate (YZ) with shaft boss
# -----------------------------------------------------------------------------
plate = (
    cq.Workplane("YZ")
    .moveTo(-tri_base_y / 2.0, 0)
    .lineTo(tri_base_y / 2.0, 0)
    .lineTo(tri_top_y / 2.0, tri_height)
    .lineTo(-tri_top_y / 2.0, tri_height)
    .close()
    .extrude(-tri_thick)                          # toward -X (handle side of ring)
    .translate((tri_x + tri_thick, 0, 0))
)
# Round the top corners a little via a boss, then bore the shaft
boss = (
    cq.Workplane("YZ")
    .circle(18.0)
    .extrude(-tri_thick - 6.0)
    .translate((tri_x + tri_thick + 3.0, 0, shaft_z))
)
plate = plate.union(boss)
shaft_bore = (
    cq.Workplane("YZ")
    .circle(shaft_r + 0.4)
    .extrude(80)
    .translate((-40, 0, shaft_z))
)
plate = plate.cut(shaft_bore)
# Soften outer silhouette
try:
    plate = plate.edges("|X").fillet(2.0)
except Exception:
    pass


# -----------------------------------------------------------------------------
# 3. Large internal ring gear
# -----------------------------------------------------------------------------
ring_body = cq.Workplane("XY").circle(ring_outer_r).extrude(ring_thick)
try:
    ring_body = ring_body.faces(">Z").edges().fillet(4.0)
    ring_body = ring_body.faces("<Z").edges().fillet(4.0)
except Exception:
    pass
# Inner bore at the tooth-root radius
ring_body = (
    ring_body
    .faces(">Z")
    .workplane()
    .circle(ring_root_r)
    .cutThruAll()
)
ring_teeth = rect_teeth(
    ring_root_r, ring_tooth_h, ring_tooth_w, ring_n_teeth, ring_thick, inward=True
)
ring_gear = ring_body.union(ring_teeth)
ring_gear = to_shaft_axis(ring_gear, ring_x, ring_thick)


# -----------------------------------------------------------------------------
# 4. Inner 4-spoke gear (external teeth)
# -----------------------------------------------------------------------------
inner_body = (
    cq.Workplane("XY")
    .circle(inner_root_r)
    .circle(inner_rim_ir)
    .extrude(inner_thick)
)
inner_teeth = rect_teeth(
    inner_root_r, inner_tooth_h, inner_tooth_w, inner_n_teeth, inner_thick, inward=False
)
hub = cq.Workplane("XY").circle(inner_hub_r).extrude(inner_thick)
# Four spokes
spoke_r = (inner_hub_r + inner_rim_ir) / 2.0
spoke_len = inner_rim_ir - inner_hub_r + 2.0
spokes = (
    cq.Workplane("XY")
    .polarArray(spoke_r, 0, 360, 4)
    .rect(spoke_len, inner_spoke_w)
    .extrude(inner_thick)
)
# Shoulder-pins on the spoke ends (visible in the reference)
pins = (
    cq.Workplane("XY")
    .polarArray(inner_rim_ir - 4.0, 45, 360, 4)
    .circle(3.2)
    .extrude(inner_thick + 6.0)
    .translate((0, 0, -3.0))
)
inner_gear = union_all([inner_body, inner_teeth, hub, spokes, pins])
# Central bore
inner_gear = (
    inner_gear.faces(">Z").workplane().circle(shaft_r + 0.3).cutThruAll()
)
inner_gear = to_shaft_axis(inner_gear, inner_x, inner_thick)

# Thin keeper rod standing up inside the ring (along world Z)
keeper = (
    cq.Workplane("XY")
    .circle(2.2)
    .extrude(ring_outer_r - 8.0)
    .translate((inner_x, 0, shaft_z))
)


# -----------------------------------------------------------------------------
# 5. Through-shaft
# -----------------------------------------------------------------------------
shaft = (
    cq.Workplane("YZ")
    .circle(shaft_r)
    .extrude(shaft_x1 - shaft_x0)
    .translate((shaft_x0, 0, shaft_z))
)


# -----------------------------------------------------------------------------
# 6. Tapered housing + nozzle + collar
# -----------------------------------------------------------------------------
cone_len = cone_x_hi - cone_x_lo
housing = (
    cq.Workplane("YZ")
    .circle(cone_r1)
    .workplane(offset=-cone_len * 0.35)
    .circle(cone_r1 * 0.92)
    .workplane(offset=-cone_len * 0.65)
    .circle(cone_r2)
    .loft(combine=True)
    .translate((cone_x_hi, 0, shaft_z))
)
# Short cylindrical barrel at the small end
barrel = (
    cq.Workplane("YZ")
    .circle(cone_r2)
    .extrude(-8.0)
    .translate((cone_x_lo, 0, shaft_z))
)
collar = (
    cq.Workplane("YZ")
    .circle(collar_r)
    .extrude(-collar_len)
    .translate((cone_x_lo - 8.0, 0, shaft_z))
)
nozzle = (
    cq.Workplane("YZ")
    .circle(noz_r)
    .extrude(-noz_len)
    .translate((cone_x_lo - 8.0 - collar_len, 0, shaft_z))
)
# Bore the output hole through nozzle / collar
out_hole = (
    cq.Workplane("YZ")
    .circle(4.2)
    .extrude(40)
    .translate((cone_x_lo - 30, 0, shaft_z))
)
housing = union_all([housing, barrel, collar, nozzle]).cut(out_hole)


# -----------------------------------------------------------------------------
# 7. Crank hub, two crank arms, side lever
# -----------------------------------------------------------------------------
crank_hub = (
    cq.Workplane("YZ")
    .circle(crank_hub_r)
    .extrude(-crank_hub_len)
    .translate((crank_hub_x, 0, shaft_z))
)
# Chamfer-like step on the hub face
hub_cap = (
    cq.Workplane("YZ")
    .circle(7.5)
    .extrude(-4.0)
    .translate((crank_hub_x - crank_hub_len, 0, shaft_z))
)
hub_bore = (
    cq.Workplane("YZ")
    .circle(shaft_r + 0.2)
    .extrude(30)
    .translate((crank_hub_x - crank_hub_len - 6, 0, shaft_z))
)
crank_hub = crank_hub.union(hub_cap).cut(hub_bore)

long_crank = crank_arm(long_len, long_ang, crank_hub_x - crank_hub_len * 0.45, shaft_z)
short_crank = crank_arm(short_len, short_ang, crank_hub_x - crank_hub_len * 0.45, shaft_z)

# Small side lever (lock / secondary handle) sticking out of the hub
lever_bar = (
    cq.Workplane("XY")
    .rect(6.0, 6.0)
    .extrude(lever_len)
    .rotate((0, 0, 0), (1, 0, 0), 90)
    .rotate((0, 0, 0), (0, 0, 1), lever_ang_y)
    .translate((crank_hub_x - crank_hub_len * 0.5, 0, shaft_z - 2.0))
)
a_y = math.radians(lever_ang_y)
ly = math.cos(a_y) * lever_len
lx = crank_hub_x - crank_hub_len * 0.5
# After rotate(X,90) a +Z extrusion becomes -Y; then rotate Z by lever_ang_y
lever_grip = (
    cq.Workplane("XY")
    .circle(grip_r * 0.85)
    .extrude(grip_len * 0.7)
    .translate((lx - 4.0, -lever_len * 0.15, shaft_z - 2.0))
    .rotate((lx, 0, shaft_z), (0, 0, 1), lever_ang_y)
)


# -----------------------------------------------------------------------------
# 8. Extra mechanical details on the inner carrier (cross pins / bosses)
# -----------------------------------------------------------------------------
def world_pin(x, y, z, r, h, axis="x"):
    if axis == "x":
        return cq.Workplane("YZ").circle(r).extrude(h).translate((x, y, z))
    if axis == "z":
        return cq.Workplane("XY").circle(r).extrude(h).translate((x, y, z))
    return cq.Workplane("XZ").circle(r).extrude(h).translate((x, y, z))


# Central collar on the inner side of the plate
collar_inner = (
    cq.Workplane("YZ")
    .circle(14.0)
    .extrude(8.0)
    .translate((tri_x + 2.0, 0, shaft_z))
)

# Four small axial bosses around the inner hub (visible “planet” studs)
studs = []
for i, ang in enumerate([20, 110, 200, 290]):
    rad = math.radians(ang)
    sy = math.cos(rad) * 22.0
    sz = shaft_z + math.sin(rad) * 22.0
    studs.append(world_pin(inner_x - inner_thick / 2.0 - 3, sy, sz, 2.6, 8.0, "x"))


# -----------------------------------------------------------------------------
# Assemble
# -----------------------------------------------------------------------------
result = union_all(
    [
        base,
        plate,
        ring_gear,
        inner_gear,
        keeper,
        shaft,
        housing,
        crank_hub,
        long_crank,
        short_crank,
        lever_bar,
        collar_inner,
    ]
    + studs
)