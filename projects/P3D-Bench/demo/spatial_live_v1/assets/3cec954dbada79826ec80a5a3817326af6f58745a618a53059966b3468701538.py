import cadquery as cq

# ============================================================
# Steering shaft with two universal-joint knuckles
# Chain along +X:
#   pin1 -> yoke1 -> cross1 -> serrated angle joint -> shaft-yoke
#        -> cross2 -> yoke2 -> pin2
# Left branch is articulated +21 deg about Y at cross1,
# right stub +8 deg about Y at cross2.
# ============================================================

# ---------- helpers ----------
def cyl(r, h, p, d):
    return cq.Solid.makeCylinder(r, h, cq.Vector(*p), cq.Vector(*d))

def cone(r1, r2, h, p, d):
    return cq.Solid.makeCone(r1, r2, h, cq.Vector(*p), cq.Vector(*d))

def box(dx, dy, dz, p):
    return cq.Solid.makeBox(dx, dy, dz, cq.Vector(*p))

def teeth(n, r0, r1, x0, x1, w):
    # ring of n radial spline-tooth boxes about the X axis
    out = []
    for i in range(n):
        t = box(x1 - x0, w, r1 - r0, (x0, -w / 2.0, r0))
        out.append(t.rotate((0, 0, 0), (1, 0, 0), i * 360.0 / n))
    return out

def fuse_all(shapes):
    return shapes[0].fuse(*shapes[1:])

# ---------- key dimensions ----------
C1 = (-27.0, 0.0, 0.0)     # left knuckle (cross 1) centre
C2 = (207.0, 0.0, 0.0)     # right knuckle (cross 2) centre
BEND_L, BEND_R = 21.0, 8.0
EAR_IN, EAR_THK = 10.5, 8.0   # clevis ear inner face / thickness

fasteners = []   # cross-pin studs + heads living in world coordinates

# ---------- integrated splined shaft + fork (grounded, ~220 mm) ----------
sp = [cyl(7.9, 32.0, (-8, 0, 0), (1, 0, 0))]                # spline core
sp += teeth(36, 7.55, 8.62, -8.0, 24.0, 0.9)                # 36-tooth spline
sp.append(cyl(11.08, 164.0, (24, 0, 0), (1, 0, 0)))         # shank / tube
sp.append(cyl(14.0, 10.0, (188, 0, 0), (1, 0, 0)))          # fork shoulder
for s in (1, -1):                                           # fork ears (normal Z)
    z0 = EAR_IN if s > 0 else -(EAR_IN + EAR_THK)
    sp.append(box(13.0, 25.0, EAR_THK, (194, -12.5, z0)))
    sp.append(cyl(12.5, EAR_THK, (207, 0, s * EAR_IN), (0, 0, s)))
shaft = fuse_all(sp)
shaft = shaft.cut(cyl(4.0, 44.0, (207, 0, -22), (0, 0, 1)))  # 8 mm ear bores
for s in (1, -1):
    fasteners += [cyl(3.95, 4.5, (207, 0, s * 14.8), (0, 0, s)),
                  cyl(5.8, 2.7, (207, 0, s * 18.4), (0, 0, s))]

# ---------- serrated angle-joint body (centre-left) ----------
ap = [cyl(13.0, 42.0, (-12, 0, 0), (1, 0, 0))]               # hub (D26)
ap += teeth(38, 7.8, 9.2, -12.0, 30.0, 0.9)                  # internal serration
for s in (1, -1):                                            # semi-circular fork cheeks
    z0 = EAR_IN if s > 0 else -(EAR_IN + EAR_THK)
    ap.append(box(15.0, 26.0, EAR_THK, (-27, -13, z0)))
    ap.append(cyl(13.0, EAR_THK, (-27, 0, s * EAR_IN), (0, 0, s)))
for s in (1, -1):                                            # clamp clevis (19.5 hole)
    y0 = 4.0 if s > 0 else -11.0
    ap.append(box(20.0, 7.0, 24.0, (12, y0, 0)))
aj = fuse_all(ap)
aj = aj.cut(cyl(8.7, 44.0, (-13, 0, 0), (1, 0, 0)))          # serrated bore
aj = aj.cut(cyl(4.0, 44.0, (-27, 0, -22), (0, 0, 1)))        # cheek 8 mm holes
aj = aj.cut(cyl(9.75, 34.0, (22, -17, 12), (0, 1, 0)))       # 19.5 clamp hole
aj = aj.cut(cone(9.75, 11.6, 2.6, (22, 11, 12), (0, 1, 0)))  # countersinks
aj = aj.cut(cone(9.75, 11.6, 2.6, (22, -11, 12), (0, -1, 0)))
grooves = [box(30.0, 1.3, 1.7, (-8, -0.65, 12.45))
           .rotate((0, 0, 0), (1, 0, 0), i * 360.0 / 38) for i in range(38)]
aj = aj.cut(*grooves)                                        # knurled band
for s in (1, -1):
    fasteners += [cyl(3.95, 4.5, (-27, 0, s * 14.8), (0, 0, s)),
                  cyl(5.8, 2.7, (-27, 0, s * 18.4), (0, 0, s))]

# ---------- universal-joint yokes (mirrored pair) ----------
def make_yoke(q, angle, center):
    # local frame: origin at cross centre, +X toward the shaft, hub at q*X
    xlo, xhi = min(q * 13.5, q * 37.0), max(q * 13.5, q * 37.0)
    yp = []
    for s in (1, -1):                                        # clevis ear pair (normal Y)
        y0 = EAR_IN if s > 0 else -(EAR_IN + EAR_THK)
        yp.append(cyl(9.0, EAR_THK, (0, s * EAR_IN, 0), (0, s, 0)))
        yp.append(box(18.0, EAR_THK, 18.0, (0 if q > 0 else -18.0, y0, -9.0)))
    yp.append(cyl(11.7, xhi - xlo, (xlo, 0, 0), (1, 0, 0)))  # hub (D23.4)
    t0, t1 = (13.5, 25.0) if q > 0 else (-25.0, -13.5)
    yp += teeth(40, 9.2, 10.4, t0, t1, 1.2)                  # splined bore teeth
    for s in (1, -1):                                        # second lug pair (normal Z)
        z0 = 8.0 if s > 0 else -20.7
        yp.append(box(10.0, 18.0, 12.7, (q * 18 - 5, -9.0, z0)))
        yp.append(cyl(6.0, 18.0, (q * 18, -9.0, s * 14.35), (0, 1, 0)))
    yk = fuse_all(yp)
    yk = yk.cut(cyl(9.74, xhi - xlo + 2, (xlo - 1, 0, 0), (1, 0, 0)))  # 19.48 bore
    cb0 = 25.0 if q > 0 else -37.0
    yk = yk.cut(cyl(10.1, 13.0, (cb0, 0, 0), (1, 0, 0)))     # journal counterbore
    yk = yk.cut(cyl(4.0, 42.0, (0, -21, 0), (0, 1, 0)))      # ear 8 mm holes
    yk = yk.cut(cyl(4.0, 44.0, (q * 18, 0, -22), (0, 0, 1))) # lug 8 mm holes
    for s in (1, -1):                                        # ear studs + heads
        yk = yk.fuse(cyl(3.95, 4.5, (0, s * 14.8, 0), (0, s, 0)))
        yk = yk.fuse(cyl(5.8, 2.7, (0, s * 18.4, 0), (0, s, 0)))
    return yk.rotate((0, 0, 0), (0, 1, 0), angle).translate(center)

# ---------- splined coupling pins (mirrored pair) ----------
def make_pin(q, angle, center):
    sx0, sx1 = (8.0, 29.5) if q > 0 else (-29.5, -8.0)
    jx0, jx1 = (29.5, 83.0) if q > 0 else (-83.0, -29.5)
    pp = [cyl(8.62, sx1 - sx0, (sx0, 0, 0), (1, 0, 0))]
    pp += teeth(36, 8.45, 9.6, sx0, sx1, 1.0)                # 36-tooth spline
    pp.append(cyl(10.0, jx1 - jx0, (jx0, 0, 0), (1, 0, 0)))  # R10 journal
    pn = fuse_all(pp)
    pn = pn.cut(cyl(3.0, 24.0, (q * 52, 0, -12), (0, 0, 1))) # 6 mm radial holes
    pn = pn.cut(cyl(3.0, 24.0, (q * 68, -12, 0), (0, 1, 0)))
    return pn.rotate((0, 0, 0), (0, 1, 0), angle).translate(center)

# ---------- cross / spider elements ----------
def make_spider(center):
    cp = [box(14.0, 14.0, 14.0, (-7, -7, -7)),
          cyl(3.9, 32.0, (0, -16, 0), (0, 1, 0)),            # Y trunnions
          cyl(3.9, 32.0, (0, 0, -16), (0, 0, 1))]            # Z trunnions
    return fuse_all(cp).translate(center)

# ---------- tiny grounded locating wedge ----------
wedge = (cq.Workplane("YZ")
         .polyline([(0, 0), (1.3, 0), (0.15, 0.9)])
         .close()
         .extrude(12.0)
         .val()
         .translate((14, 10.9, 14)))   # seated against the clamp-clevis flat

# ---------- assembly ----------
cross1 = make_spider(C1)
cross2 = make_spider(C2)
yoke1 = make_yoke(-1, BEND_L, C1)
yoke2 = make_yoke(+1, BEND_R, C2)
pin1 = make_pin(-1, BEND_L, C1)
pin2 = make_pin(+1, BEND_R, C2)

assembly = fuse_all([shaft, aj, wedge,
                     cross1, cross2,
                     yoke1, yoke2,
                     pin1, pin2] + fasteners)

result = cq.Workplane("XY").newObject([assembly])