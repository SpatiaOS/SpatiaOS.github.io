import cadquery as cq
import math

# ==================================================================
# Steering-shaft assembly (parametric reconstruction, mm)
#
# Chain : splined pin (outer stub) -> universal-joint yoke -> cross
#         spider -> serrated angle joint -> splined shaft yoke
#         (spline + shank + fork) -> cross spider -> U-joint yoke
#         -> splined pin (outer stub)
# ==================================================================

# --- splines / serrations -----------------------------------------
SPLINE_TEETH  = 36
SPLINE_ROOT_R = 8.62
SPLINE_TIP_R  = 9.70
SERR_TEETH    = 38
SERR_TIP_R    = 8.62
SERR_ROOT_R   = 8.24

# --- shaft / yoke bodies ------------------------------------------
SHANK_R     = 11.08
HUB_R       = 13.0
EAR_BORE_D  = 8.0        # cross-pin bores in the fork ears
EAR_IN      = 13.0       # fork ear inner face offset from axis
EAR_OUT     = 22.0       # fork ear outer face offset from axis

# --- splined coupling pins ----------------------------------------
JOURNAL_R     = 10.0
JOURNAL_LEN   = 48.5
SHOULDER_R    = 12.5
RETAIN_HOLE_D = 6.0

# --- angle joint / layout -----------------------------------------
CLEVIS_BORE_R = 9.55     # clevis bore that receives the shaft spline
BEND_DEG      = 18.0     # articulation angle of the serrated joint
SPIDER_HALF   = 7.0
TRUNNION_R    = 4.05
TRUNNION_REACH = 15.5    # how far trunnions reach into the ear bores

FORK_C = 158.0           # right-hand U-joint centre (main axis)
BEND_C = -48.0           # left-hand U-joint centre (main axis)


# ------------------------------------------------------------------
# generic helpers
# ------------------------------------------------------------------
def star_pts(n, r_tip, r_root, phase=0.0):
    """Alternating tip/root polygon used for splines and serrations."""
    pts = []
    for i in range(2 * n):
        r = r_tip if i % 2 == 0 else r_root
        a = phase + math.pi * i / n
        pts.append((r * math.cos(a), r * math.sin(a)))
    return pts


def xspl(n, r_tip, r_root, x0, length, phase=0.0):
    """Splined / serrated prism running along +X starting at x0."""
    return (cq.Workplane("YZ", origin=(x0, 0, 0))
              .polyline(star_pts(n, r_tip, r_root, phase))
              .close()
              .extrude(length))


def xcyl(r, x0, x1):
    return cq.Workplane("YZ", origin=(x0, 0, 0)).circle(r).extrude(x1 - x0)


def ycyl(r, y0, y1, cx=0.0, cz=0.0):
    return (cq.Workplane("XZ", origin=(cx, 0.5 * (y0 + y1), cz))
              .circle(r).extrude(0.5 * abs(y1 - y0), both=True))


def zcyl(r, z0, z1, cx=0.0, cy=0.0):
    return (cq.Workplane("XY", origin=(cx, cy, 0.5 * (z0 + z1)))
              .circle(r).extrude(0.5 * abs(z1 - z0), both=True))


def box_xyz(x0, x1, y0, y1, z0, z1):
    return (cq.Workplane("XY", origin=(0.5 * (x0 + x1),
                                       0.5 * (y0 + y1),
                                       0.5 * (z0 + z1)))
              .box(x1 - x0, y1 - y0, z1 - z0))


def csk_x(r_mouth, r_throat, x_mouth, depth, inward=True):
    """Countersink cone (cut tool) about the X axis."""
    direction = cq.Vector(-1 if inward else 1, 0, 0)
    return cq.Workplane(obj=cq.Solid.makeCone(
        r_mouth, r_throat, depth, cq.Vector(x_mouth, 0, 0), direction))


# ------------------------------------------------------------------
# splined shaft yoke : spline end -> shank -> U-joint fork
# ------------------------------------------------------------------
shaft_yoke = xspl(SPLINE_TEETH, SPLINE_TIP_R, SPLINE_ROOT_R, -14.0, 58.0)
shaft_yoke = shaft_yoke.union(xcyl(12.5, 42.0, 49.0))            # spline/shank collar
shaft_yoke = shaft_yoke.union(xcyl(SHANK_R, 44.0, 128.0))        # shank
shaft_yoke = shaft_yoke.union(xcyl(14.0, 126.0, 140.0))          # fork boss
for s in (1, -1):
    ya0, ya1 = (EAR_IN, EAR_OUT) if s > 0 else (-EAR_OUT, -EAR_IN)
    shaft_yoke = shaft_yoke.union(box_xyz(134.0, FORK_C, ya0, ya1, -13.5, 13.5))
    shaft_yoke = shaft_yoke.union(ycyl(13.5, ya0, ya1, cx=FORK_C, cz=0.0))
shaft_yoke = shaft_yoke.cut(ycyl(EAR_BORE_D / 2.0, -30.0, 30.0, cx=FORK_C, cz=0.0))


# ------------------------------------------------------------------
# compact universal-joint yoke (2 off) - local frame, hub axis = +X
# ------------------------------------------------------------------
def compact_yoke():
    yk = xcyl(HUB_R, 6.0, 36.0)
    yk = yk.cut(xspl(SERR_TEETH, SERR_TIP_R, SERR_ROOT_R, 4.0, 34.0))  # serrated bore
    yk = yk.cut(csk_x(13.6, 10.3, 36.0, 4.5, True))   # outer countersink
    yk = yk.cut(csk_x(13.6, 9.8, 6.0, 3.0, False))    # inner lead-in
    for s in (1, -1):
        z0, z1 = (EAR_IN, EAR_OUT) if s > 0 else (-EAR_OUT, -EAR_IN)
        yk = yk.union(box_xyz(0.0, 14.0, -12.5, 12.5, z0, z1))       # ear plate
        yk = yk.union(zcyl(12.5, z0, z1, cx=0.0, cy=0.0))            # rounded ear end
    yk = yk.union(box_xyz(-2.0, 10.0, -11.0, 11.0, -13.5, 13.5))     # web
    yk = yk.cut(zcyl(EAR_BORE_D / 2.0, -26.0, 26.0, cx=0.0, cy=0.0)) # cross-pin bores
    return yk


# ------------------------------------------------------------------
# splined coupling pin (2 off) - local frame, axis = +X
# ------------------------------------------------------------------
def splined_pin():
    p = xspl(SPLINE_TEETH, SPLINE_TIP_R, SPLINE_ROOT_R, 14.5, 21.5)
    p = p.union(xcyl(SHOULDER_R, 36.0, 41.0))                       # spline shoulder
    p = p.union(xcyl(JOURNAL_R, 41.0, 41.0 + JOURNAL_LEN))          # smooth journal
    p = p.cut(zcyl(RETAIN_HOLE_D / 2.0, -12.0, 12.0, cx=60.0, cy=0.0))
    p = p.cut(zcyl(RETAIN_HOLE_D / 2.0, -12.0, 12.0, cx=84.0, cy=0.0))
    return p


# ------------------------------------------------------------------
# serrated angle joint : fork + serrated barrel + clevis (global frame)
# ------------------------------------------------------------------
angle_joint = xcyl(13.5, BEND_C + 8.0, BEND_C + 16.0)              # neck boss
angle_joint = angle_joint.union(
    xspl(SERR_TEETH, SERR_TIP_R, SERR_ROOT_R, BEND_C + 14.0, 20.5))  # serrated barrel
clevis = box_xyz(BEND_C + 32.0, 2.0, -17.0, 17.0, -17.0, 17.0)
clevis = clevis.cut(xcyl(CLEVIS_BORE_R, -14.5, 4.5))               # spline-receiving bore
clevis = clevis.cut(csk_x(13.5, 9.9, 2.0, 4.5, True))              # mouth countersink
angle_joint = angle_joint.union(clevis)
for s in (1, -1):
    ya0, ya1 = (EAR_IN, EAR_OUT) if s > 0 else (-EAR_OUT, -EAR_IN)
    angle_joint = angle_joint.union(ycyl(13.5, ya0, ya1, cx=BEND_C, cz=0.0))
angle_joint = angle_joint.cut(ycyl(EAR_BORE_D / 2.0, -26.0, 26.0, cx=BEND_C, cz=0.0))


# ------------------------------------------------------------------
# cross spiders
# ------------------------------------------------------------------
def spider(cx):
    sp = box_xyz(cx - SPIDER_HALF, cx + SPIDER_HALF,
                 -SPIDER_HALF, SPIDER_HALF, -SPIDER_HALF, SPIDER_HALF)
    for s in (1, -1):
        o0, o1 = sorted((s * SPIDER_HALF, s * TRUNNION_REACH))
        sp = sp.union(ycyl(TRUNNION_R, o0, o1, cx=cx, cz=0.0))
        sp = sp.union(zcyl(TRUNNION_R, o0, o1, cx=cx, cy=0.0))
    return sp


spider_r = spider(FORK_C)

# left spider : Y trunnions for the angle-joint fork plus a tilted
# trunnion pair matching the articulated yoke
spider_l = box_xyz(BEND_C - SPIDER_HALF, BEND_C + SPIDER_HALF,
                   -SPIDER_HALF, SPIDER_HALF, -SPIDER_HALF, SPIDER_HALF)
spider_l = spider_l.union(ycyl(TRUNNION_R, SPIDER_HALF, TRUNNION_REACH,
                               cx=BEND_C, cz=0.0))
spider_l = spider_l.union(ycyl(TRUNNION_R, -TRUNNION_REACH, -SPIDER_HALF,
                               cx=BEND_C, cz=0.0))
b = math.radians(BEND_DEG)
for s in (1, -1):
    pnt = cq.Vector(BEND_C + s * SPIDER_HALF * math.sin(b),
                    0.0,
                    s * SPIDER_HALF * math.cos(b))
    dirv = cq.Vector(s * math.sin(b), 0.0, s * math.cos(b))
    spider_l = spider_l.union(cq.Workplane(obj=cq.Solid.makeCylinder(
        TRUNNION_R, TRUNNION_REACH - SPIDER_HALF, pnt, dirv)))


# ------------------------------------------------------------------
# instance placement
# ------------------------------------------------------------------
yoke_r = compact_yoke().translate((FORK_C, 0.0, 0.0))
pin_r = splined_pin().translate((FORK_C, 0.0, 0.0))

bend_rot = 180.0 + BEND_DEG
yoke_l = (compact_yoke()
          .rotate((0, 0, 0), (0, 1, 0), bend_rot)
          .translate((BEND_C, 0.0, 0.0)))
pin_l = (splined_pin()
         .rotate((0, 0, 0), (0, 1, 0), bend_rot)
         .translate((BEND_C, 0.0, 0.0)))

# slender locating pin resting against the shank
loc_pin = xcyl(0.9, 68.0, 113.0).translate((0.0, 0.0, SHANK_R + 0.62))


# ------------------------------------------------------------------
# unified assembly
# ------------------------------------------------------------------
result = shaft_yoke
for part in (spider_r, yoke_r, pin_r,
             angle_joint, spider_l, yoke_l, pin_l,
             loc_pin):
    result = result.union(part)