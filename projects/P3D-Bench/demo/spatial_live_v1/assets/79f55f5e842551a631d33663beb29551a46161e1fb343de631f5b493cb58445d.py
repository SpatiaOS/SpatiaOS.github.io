import cadquery as cq
import math

# =============================================================================
#  STYLISED ARTICULATED (PALLETISING) INDUSTRIAL ROBOT ON A MACHINE BASE PLATE
#
#  Interpretation of the reference image (all dimensions in millimetres):
#    * square mounting plate with chamfered corners, corner bolting pads and a
#      small cable-connector block on one side
#    * stepped turntable disc stack  ................ axis 1 (rotation about Z)
#    * tapered rotating column carrying the large shoulder bearing / motor
#      shaft with a hexagonal end .................... axis 2 (about Y)
#    * tapered upper arm with a motor housing up to the elbow  .. axis 3
#    * long cylindrical forearm with a bellows-like stack of stepped rings
#    * small stepped wrist (axes 4/5/6) ending in a tool flange
#    * a slim parallel link (strut) from the column rear up to the elbow
#
#  All joint axes 2..5 are parallel to the global Y axis, the arm reaches out
#  towards -X, which reproduces the pose shown in the picture.
# =============================================================================


# ------------------------------------------------------------------- helpers
def ycyl(r, h, base=(0.0, 0.0, 0.0)):
    """Cylinder of radius r / length h, axis parallel to +Y, starting at base."""
    return (cq.Workplane("XY").circle(r).extrude(h)
            .rotate((0, 0, 0), (1, 0, 0), -90)
            .translate(base))


def yhex(across_corners, h, base=(0.0, 0.0, 0.0)):
    """Hexagonal prism, axis parallel to +Y, starting at base."""
    return (cq.Workplane("XY").polygon(6, across_corners).extrude(h)
            .rotate((0, 0, 0), (1, 0, 0), -90)
            .translate(base))


def pt_on_axis(base, tilt, dist):
    """Point 'dist' along an axis through 'base' tilted 'tilt' deg about +Y."""
    a = math.radians(tilt)
    return (base[0] + dist * math.sin(a), base[1], base[2] + dist * math.cos(a))


def acyl(r, h, base, tilt):
    """Cylinder along a tilted axis (tilt about +Y), starting at 'base'."""
    return (cq.Workplane("XY").circle(r).extrude(h)
            .rotate((0, 0, 0), (0, 1, 0), tilt)
            .translate(base))


def acone(r0, r1, h, base, tilt):
    """Truncated cone along a tilted axis."""
    return (cq.Workplane("XY").circle(r0)
            .workplane(offset=h).circle(r1)
            .loft(ruled=True)
            .rotate((0, 0, 0), (0, 1, 0), tilt)
            .translate(base))


def atbox(w0, d0, w1, d1, h, base, tilt):
    """(Tapered) box along a tilted axis: w = local X, d = Y, h = along axis."""
    return (cq.Workplane("XY").rect(w0, d0)
            .workplane(offset=h).rect(w1, d1)
            .loft(ruled=True)
            .rotate((0, 0, 0), (0, 1, 0), tilt)
            .translate(base))


# ---------------------------------------------------------------- PARAMETERS
# --- base plate ------------------------------------------------------------
plate_sz, plate_thk, plate_chamf = 232.0, 16.0, 30.0
riser_sz, riser_thk, riser_chamf = 156.0, 13.0, 12.0
pad_sz, pad_off, pad_h = 46.0, 88.0, 7.0          # corner bolting pads
bolt_d, bolt_pitch = 9.0, 22.0

# --- turntable (axis 1) ----------------------------------------------------
turn_z0 = plate_thk + riser_thk                    # 29 mm
turn_radii = (72.0, 63.0, 55.0)                    # disc radii (bottom -> top)
turn_heights = (10.0, 15.0, 11.0)                  # disc heights

# --- rotating column -------------------------------------------------------
col_z0 = turn_z0 + sum(turn_heights)               # 65 mm
col_h, col_lean = 92.0, 10.0                       # slight lean towards +X
col_bot_w, col_bot_d = 120.0, 114.0
col_top_w, col_top_d = 96.0, 90.0

# --- shoulder joint (axis 2) ----------------------------------------------
shoulder = (8.0, 0.0, 158.0)                       # joint centre
sh_r, sh_w = 50.0, 74.0                            # main housing
sh_shaft_r, sh_shaft_l = 15.0, 55.0                # motor shaft
sh_hex_af, sh_hex_l = 32.0, 18.0                   # hexagonal shaft end

# --- upper arm (link 2) ----------------------------------------------------
ua_tilt, ua_len = -26.0, 205.0                     # tilted towards -X
ua_w0, ua_d0 = 96.0, 88.0                          # section at shoulder
ua_w1, ua_d1 = 72.0, 64.0                          # section at elbow

# --- elbow (axis 3) --------------------------------------------------------
el_r, el_w = 40.0, 64.0

# --- forearm ---------------------------------------------------------------
fa_tilt = -74.0                                    # shallow, points up / -X
fa_tube_r = 34.0
bellow_radii = (40.0, 37.0, 33.0, 29.0)            # stepped "boot" rings
bellow_w = 12.0

# --- parallel link (strut) -------------------------------------------------
strut_y = -46.0                                    # sits beside the upper arm
strut_bot = (52.0, strut_y, 166.0)
strut_top = (-58.0, strut_y, 322.0)

# ------------------------------------------------------- derived geometry --
elbow = pt_on_axis(shoulder, ua_tilt, ua_len)      # elbow joint centre
_dx = strut_top[0] - strut_bot[0]
_dz = strut_top[2] - strut_bot[2]
strut_len = math.hypot(_dx, _dz)
strut_tilt = math.degrees(math.atan2(_dx, _dz))

bodies = []                                        # collected solid bodies

# =============================================================== BASE PLATE
# main plate with chamfered corners
bodies.append(
    cq.Workplane("XY").rect(plate_sz, plate_sz).extrude(plate_thk)
    .edges("|Z").chamfer(plate_chamf)
)

# raised central platform on which the robot is bolted
bodies.append(
    cq.Workplane("XY", origin=(0, 0, plate_thk))
    .rect(riser_sz, riser_sz).extrude(riser_thk)
    .edges("|Z").chamfer(riser_chamf)
)

# four solid corner pads / feet (they overhang the chamfered corners)
bodies.append(
    cq.Workplane("XY")
    .pushPoints([(sx * pad_off, sy * pad_off) for sx in (-1, 1) for sy in (-1, 1)])
    .box(pad_sz, pad_sz, plate_thk + pad_h, centered=(True, True, False))
)

# cable / connector block on the front side of the plate
bodies.append(
    cq.Workplane("XY", origin=(-25.0, -plate_sz / 2 - 8.0, 2.0))
    .box(74.0, 34.0, 30.0, centered=(True, True, False))
)

# ================================================== TURNTABLE  (axis 1) ===
z_level = turn_z0
for disc_r, disc_h in zip(turn_radii, turn_heights):
    bodies.append(cq.Workplane("XY", origin=(0, 0, z_level)).circle(disc_r).extrude(disc_h))
    z_level += disc_h

# ============================================ ROTATING COLUMN (tapered) ===
bodies.append(
    cq.Workplane("XY", origin=(0, 0, col_z0))
    .rect(col_bot_w, col_bot_d)
    .workplane(offset=col_h).center(col_lean, 0)
    .rect(col_top_w, col_top_d)
    .loft(ruled=True)
)

# ================================================ SHOULDER JOINT (axis 2) =
shx, shy, shz = shoulder
# main bearing housing
bodies.append(ycyl(sh_r, sh_w, (shx, shy - sh_w / 2, shz)))
# concentric bearing rings on the visible side + motor shaft with hex end
bodies.append(ycyl(58.0, 10.0, (shx, shy + sh_w / 2, shz)))
bodies.append(ycyl(46.0, 16.0, (shx, shy + sh_w / 2 + 10.0, shz)))
bodies.append(ycyl(34.0, 10.0, (shx, shy + sh_w / 2 + 26.0, shz)))
bodies.append(ycyl(sh_shaft_r, sh_shaft_l, (shx, shy + sh_w / 2 + 30.0, shz)))
bodies.append(yhex(sh_hex_af, sh_hex_l,
                   (shx, shy + sh_w / 2 + 30.0 + sh_shaft_l - 4.0, shz)))
# small ring on the far side
bodies.append(ycyl(56.0, 8.0, (shx, shy - sh_w / 2 - 8.0, shz)))

# ==================================================== UPPER ARM (link 2) ==
bodies.append(atbox(ua_w0, ua_d0, ua_w1, ua_d1, ua_len, shoulder, ua_tilt))
# axis-3 drive housing straddling the arm
bodies.append(atbox(64.0, 94.0, 64.0, 94.0, 48.0,
                    pt_on_axis(shoulder, ua_tilt, 128.0), ua_tilt))

# ======================================================= ELBOW (axis 3) ===
elx, ely, elz = elbow
bodies.append(ycyl(el_r, el_w, (elx, ely - el_w / 2, elz)))
bodies.append(ycyl(46.0, 10.0, (elx, ely + el_w / 2, elz)))
bodies.append(ycyl(46.0, 10.0, (elx, ely - el_w / 2 - 10.0, elz)))

# =========================================================== FOREARM ======
# casing that wraps the elbow and blends into the round tube
bodies.append(atbox(92.0, 84.0, 74.0, 70.0, 105.0,
                    pt_on_axis(elbow, fa_tilt, -48.0), fa_tilt))
# long main tube
bodies.append(acyl(fa_tube_r, 140.0, pt_on_axis(elbow, fa_tilt, 48.0), fa_tilt))
# stepped "bellows" rings running on a slimmer core
bodies.append(acyl(26.0, 64.0, pt_on_axis(elbow, fa_tilt, 178.0), fa_tilt))
for i, ring_r in enumerate(bellow_radii):
    bodies.append(acyl(ring_r, bellow_w,
                       pt_on_axis(elbow, fa_tilt, 180.0 + i * bellow_w),
                       fa_tilt))
# taper down to the wrist
bodies.append(acone(26.0, 20.0, 18.0, pt_on_axis(elbow, fa_tilt, 240.0), fa_tilt))
bodies.append(acyl(19.0, 14.0, pt_on_axis(elbow, fa_tilt, 256.0), fa_tilt))
bodies.append(acyl(14.0, 14.0, pt_on_axis(elbow, fa_tilt, 268.0), fa_tilt))

# ============================================ WRIST (axes 4 / 5 / 6) ======
# small yoke, cross axis and tool flange
bodies.append(atbox(30.0, 46.0, 30.0, 46.0, 18.0,
                    pt_on_axis(elbow, fa_tilt, 278.0), fa_tilt))
wrist = pt_on_axis(elbow, fa_tilt, 288.0)
bodies.append(ycyl(11.0, 52.0, (wrist[0], wrist[1] - 26.0, wrist[2])))
bodies.append(acyl(8.0, 16.0, pt_on_axis(elbow, fa_tilt, 292.0), fa_tilt))
bodies.append(acyl(12.0, 7.0, pt_on_axis(elbow, fa_tilt, 305.0), fa_tilt))

# ================================================ PARALLEL LINK (strut) ===
bodies.append(atbox(34.0, 26.0, 30.0, 24.0, strut_len, strut_bot, strut_tilt))
# pivot bosses at both ends (they tie the strut into column and upper arm)
bodies.append(ycyl(24.0, 70.0, (strut_bot[0], strut_y - 24.0, strut_bot[2])))
bodies.append(ycyl(16.0, 46.0, (strut_top[0], strut_y - 23.0, strut_top[2])))

# ======================================================= ASSEMBLE / UNION =
robot = bodies[0]
for body in bodies[1:]:
    robot = robot.union(body)

# ============================================================ SUBTRACTIONS
# bolt holes: two per corner pad
bolt_pts = [(sgn_x * pad_off + dx, sgn_y * pad_off)
            for sgn_x in (-1, 1) for sgn_y in (-1, 1)
            for dx in (-bolt_pitch / 2, bolt_pitch / 2)]

cutters = (
    cq.Workplane("XY", origin=(0, 0, -5.0))
    .pushPoints(bolt_pts).circle(bolt_d / 2)
    .extrude(plate_thk + pad_h + 10.0)
)

# two connector holes in the front cable block
cutters = cutters.union(ycyl(3.5, 40.0, (-45.0, -150.0, 16.0)))
cutters = cutters.union(ycyl(3.5, 40.0, (-5.0, -150.0, 16.0)))

result = robot.cut(cutters)