import cadquery as cq

# ============================================================
# Parameters
# ============================================================
# Fin plate (main structural body)
fin_length = 21.85       # X extent, mm
fin_height = 11.28       # Y extent (max), mm
fin_thick = 1.5          # Z extent (thickness), mm

# Hub dome at blunt/head end
hub_r = 4.0              # sphere radius
hub_x = 3.8              # center X
hub_y = 5.2              # center Y

# Central bore and boss at hub
bore_r = 0.55            # bore hole radius
boss_r = 1.5             # boss outer radius
boss_extra = 0.8         # protrusion beyond each fin face

# Five dorsal ridge holes
n_holes = 5
hole_r = 0.65            # hole radius
hole_x0 = 9.5            # first hole X
hole_dx = 2.2            # center-to-center spacing

# Wire rings (small torus loops)
ring_R = 0.70            # torus major radius
ring_r = 0.12            # wire cross-section radius

# ============================================================
# 1. Fin plate – wedge/leaf profile extruded to thickness
# ============================================================
# Outline points in XY plane, clockwise from head left-center
profile = [
    (0.5, 5.2), (0.0, 7.0), (0.8, 8.8), (2.2, 9.8),
    # concave notch clearing the hub cap
    (3.3, 9.0), (4.3, 9.4),
    # dorsal ridge (holes sit here)
    (6.0, 10.8), (8.5, fin_height), (11.0, 11.0),
    (13.5, 10.2), (16.0, 9.0), (18.5, 7.2),
    (20.5, 5.2),
    # tail tip
    (fin_length, 3.5),
    # ventral (belly) edge
    (20.2, 2.5), (18.0, 1.3), (15.0, 0.5),
    (12.0, 0.1), (9.0, 0.0), (6.0, 0.2),
    # lower head
    (3.5, 1.0), (2.0, 2.0), (0.8, 3.2),
]

s = cq.Workplane("XY").moveTo(*profile[0])
for pt in profile[1:]:
    s = s.lineTo(*pt)
body = s.close().extrude(fin_thick)

# ============================================================
# 2. Five through-holes along dorsal ridge
# ============================================================
hpts = []
for i in range(n_holes):
    x = hole_x0 + i * hole_dx
    t = i / (n_holes - 1)
    # Y interpolated along ridge, offset inward from edge
    y = 10.3 - t * 3.5
    hpts.append((x, y))

body = (
    body.faces(">Z").workplane()
    .pushPoints(hpts)
    .circle(hole_r)
    .cutThruAll()
)

# ============================================================
# 3. Hub cap – sphere at head end (two half-shells effect)
# ============================================================
hub_cap = (
    cq.Workplane("XY")
    .transformed(offset=(hub_x, hub_y, fin_thick / 2))
    .sphere(hub_r)
)

# ============================================================
# 4. Boss – cylindrical bearing seat at hub centre
# ============================================================
boss_total_h = fin_thick + 2 * boss_extra
boss = (
    cq.Workplane("XY")
    .center(hub_x, hub_y)
    .circle(boss_r)
    .extrude(boss_total_h)
    .translate((0, 0, -boss_extra))
)

# ============================================================
# 5. Central bore (subtracted from assembly)
# ============================================================
bore_h = 2 * hub_r + 4
bore = (
    cq.Workplane("XY")
    .center(hub_x, hub_y)
    .circle(bore_r)
    .extrude(bore_h)
    .translate((0, 0, fin_thick / 2 - bore_h / 2))
)

# ============================================================
# 6. Wire rings – small torus loops at belly and tail
# ============================================================
def make_torus(R, r):
    """Create a torus centred at the origin, ring in XY plane, axis Z."""
    return (
        cq.Workplane("XZ")
        .center(R, 0)
        .circle(r)
        .revolve(360, (-R, 0), (-R, 1))
    )

# Belly ring – hangs from bottom of body near x ≈ 12
ring1 = make_torus(ring_R, ring_r).translate(
    (12.0, 0.1 - ring_R, fin_thick / 2)
)

# Tail ring – hangs from the pointed tail tip
ring2 = make_torus(ring_R, ring_r).translate(
    (fin_length + 0.1, 3.5 - ring_R, fin_thick / 2)
)

# ============================================================
# 7. Final assembly – union all solids, subtract bore
# ============================================================
result = (
    body
    .union(hub_cap)
    .union(boss)
    .cut(bore)
    .union(ring1)
    .union(ring2)
)