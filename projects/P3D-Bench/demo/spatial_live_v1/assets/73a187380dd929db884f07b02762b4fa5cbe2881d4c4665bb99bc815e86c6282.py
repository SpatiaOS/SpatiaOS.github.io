import cadquery as cq
from math import sin, cos, pi, radians

# =====================================================================
#  STEERING INTERMEDIATE SHAFT  -  two Cardan (universal) joints,
#  splined telescoping shaft, splined end pins and a serrated /
#  clamp-type angle joint at the input end.
#  The chain is articulated: three straight segments joined at the
#  two cross centres, all bends lying in the XZ plane.
# =====================================================================

# ---- articulation (angles measured from +X inside the XZ plane) ------
phi_in, phi_mid, phi_out = -15.0, -22.0, -28.0
joint_span = 195.0                      # distance between the two cross centres

# ---- 36 tooth spline system (common to shaft, pins and bores) --------
spl_teeth = 36
spl_root_r = 8.62
spl_tip_r = 9.75
spl_clr = 0.12                          # bore clearance over the male spline

# ---- universal joint yoke --------------------------------------------
hub_r, hub_len = 13.0, 20.0
ear_len, ear_thk, ear_gap, ear_w = 22.0, 8.5, 24.4, 24.0
ear_hole_d = 8.0
pad_sink, pad_rise = 8.0, 3.0           # rectangular boss blending hub to ears
yoke_pin_z = hub_len + ear_len          # hub base -> cross-pin centre

# ---- cross / spider ---------------------------------------------------
cross_cube = 15.0
cross_shoulder_r, cross_shoulder_l = 6.0, 11.5
cross_arm_r = 3.9
cross_reach = ear_gap / 2.0 + ear_thk   # trunnion tip flush with ear outer face
cross_cap_r = 6.5

# ---- splined coupling pin (both outer ends) --------------------------
pin_len = 75.0
pin_spline_len = 21.5
pin_journal_r = 10.0
pin_hole_d = 6.0
roll_pin_r = 2.85

# ---- long splined shaft with integral yoke ---------------------------
shaft_spline_len = 52.0
shaft_shank_r = 11.08
shaft_total = joint_span - ear_len                       # spline tip -> pin centre
shaft_shank_len = shaft_total - shaft_spline_len - hub_len - ear_len

# ---- serrated angle joint (input clamp yoke) -------------------------
saj_hub_r, saj_hub_len = 14.0, 34.0
saj_clamp_w, saj_clamp_off = 36.0, 5.0                   # X size / X centre offset
saj_clamp_h, saj_clamp_len = 26.0, 24.0                  # Y size / Z size
saj_slot_t = 3.0
saj_bolt_x, saj_bolt_z = 16.5, 12.0
saj_bolt_d = 8.0
saj_pin_z = saj_hub_len + ear_len


# =====================================================================
#  HELPERS
# =====================================================================
def spline_body(root_r, tip_r, n_teeth, length):
    """Straight-toothed spline solid extruded along +Z."""
    step = 2.0 * pi / n_teeth
    pts = []
    for i in range(n_teeth):
        base = i * step
        for frac, r in ((0.00, root_r), (0.16, tip_r), (0.34, tip_r), (0.50, root_r)):
            a = base + frac * step
            pts.append((r * cos(a), r * sin(a)))
    return cq.Workplane("XY").polyline(pts).close().extrude(length)


def y_cyl(z_pos, radius, length):
    """Cylinder whose axis is global Y, centred on (0, 0, z_pos)."""
    return (cq.Workplane("XZ").center(0.0, z_pos).circle(radius)
            .extrude(length).translate((0.0, length / 2.0, 0.0)))


def x_cyl(z_pos, radius, length):
    """Cylinder whose axis is global X, centred on (0, 0, z_pos)."""
    return (cq.Workplane("YZ").workplane(offset=-length / 2.0)
            .center(0.0, z_pos).circle(radius).extrude(length))


def fork(z_base):
    """Pair of rounded lug ears (plates normal to Y) with the cross-pin bore."""
    top = z_base + ear_len
    ears = None
    for s in (-1.0, 1.0):
        yc = s * (ear_gap / 2.0 + ear_thk / 2.0)
        plate = (cq.Workplane("XY").workplane(offset=z_base)
                 .center(0.0, yc).rect(ear_w, ear_thk).extrude(ear_len))
        cap = (cq.Workplane("XZ").center(0.0, top).circle(ear_w / 2.0)
               .extrude(ear_thk).translate((0.0, yc + ear_thk / 2.0, 0.0)))
        ear = plate.union(cap)
        ears = ear if ears is None else ears.union(ear)
    return ears.cut(y_cyl(top, ear_hole_d / 2.0, 120.0))


def yoke_head(z_hub_top):
    """Rectangular boss + fork ears sitting on top of a hub ending at z_hub_top."""
    pad = (cq.Workplane("XY").workplane(offset=z_hub_top - pad_sink)
           .box(ear_w, ear_gap + 2.0 * ear_thk, pad_sink + pad_rise,
                centered=(True, True, False)))
    return pad.union(fork(z_hub_top))


def universal_yoke():
    """Hub with internal splined bore + fork ears (ears along local Y)."""
    body = cq.Workplane("XY").circle(hub_r).extrude(hub_len)
    body = body.union(yoke_head(hub_len))
    bore = spline_body(spl_root_r + spl_clr, spl_tip_r + spl_clr,
                       spl_teeth, hub_len + pad_rise + 4.0).translate((0, 0, -2.0))
    return body.cut(bore)


def universal_cross():
    """Four-trunnion spider; arms along local X and Y."""
    body = cq.Workplane("XY").box(cross_cube, cross_cube, cross_cube).edges().fillet(2.5)
    shoulder = cq.Workplane("YZ").circle(cross_shoulder_r).extrude(cross_shoulder_l)
    trunnion = cq.Workplane("YZ").circle(cross_arm_r).extrude(cross_reach)
    cap = (cq.Workplane("YZ").workplane(offset=cross_reach - 1.5)
           .circle(cross_cap_r).extrude(3.5))
    arm = shoulder.union(trunnion).union(cap)
    for i in range(4):
        body = body.union(arm.rotate((0, 0, 0), (0, 0, 1), 90.0 * i))
    return body


def splined_pin():
    """36 tooth spline at z=0 end, smooth journal outboard, two radial bores."""
    body = spline_body(spl_root_r, spl_tip_r, spl_teeth, pin_spline_len)
    body = body.union(cq.Workplane("XY").workplane(offset=pin_spline_len)
                      .circle(pin_journal_r).extrude(pin_len - pin_spline_len))
    for zh in (pin_spline_len + 14.0, pin_len - 12.0):
        body = body.cut(x_cyl(zh, pin_hole_d / 2.0, 60.0))
    return body


def splined_shaft_yoke():
    """Telescoping spline -> smooth shank -> integral universal joint yoke."""
    z = 0.0
    body = spline_body(spl_root_r, spl_tip_r, spl_teeth, shaft_spline_len)
    z += shaft_spline_len
    body = body.union(cq.Workplane("XY").workplane(offset=z)
                      .circle(shaft_shank_r).extrude(shaft_shank_len))
    z += shaft_shank_len
    body = body.union(cq.Workplane("XY").workplane(offset=z)
                      .circle(hub_r).extrude(hub_len))
    z += hub_len
    return body.union(yoke_head(z))


def serrated_angle_joint():
    """Splined/serrated hub with a pinch clamp collar at one end, fork at the other."""
    body = cq.Workplane("XY").circle(saj_hub_r).extrude(saj_hub_len)
    collar = (cq.Workplane("XY").center(saj_clamp_off, 0.0)
              .box(saj_clamp_w, saj_clamp_h, saj_clamp_len, centered=(True, True, False)))
    body = body.union(collar).union(yoke_head(saj_hub_len))

    # serrated (splined) receiving bore
    bore = spline_body(spl_root_r + spl_clr, spl_tip_r + spl_clr,
                       spl_teeth, saj_hub_len + pad_rise + 6.0).translate((0, 0, -2.0))
    body = body.cut(bore)

    # pinch slot opening towards +X and the clamp-bolt bore
    slot_len = saj_clamp_off + saj_clamp_w / 2.0 + 4.0
    slot = (cq.Workplane("XY").center(slot_len / 2.0, 0.0)
            .box(slot_len, saj_slot_t, saj_clamp_len + 4.0, centered=(True, True, False))
            .translate((0, 0, -2.0)))
    body = body.cut(slot)
    body = body.cut((cq.Workplane("XZ").center(saj_bolt_x, saj_bolt_z)
                     .circle(saj_bolt_d / 2.0).extrude(60.0).translate((0, 30.0, 0))))
    return body


def clamp_bolt():
    """Simple clamp fastener spanning the pinch slot (axis along local Y)."""
    shank = (cq.Workplane("XZ").center(saj_bolt_x, saj_bolt_z)
             .circle(saj_bolt_d / 2.0 - 0.15).extrude(44.0).translate((0, 22.0, 0)))
    head = (cq.Workplane("XZ").center(saj_bolt_x, saj_bolt_z).circle(6.8)
            .extrude(5.0).translate((0, -saj_clamp_h / 2.0, 0)))
    nut = (cq.Workplane("XZ").center(saj_bolt_x, saj_bolt_z).polygon(6, 13.0)
           .extrude(-6.0).translate((0, saj_clamp_h / 2.0, 0)))
    return shank.union(head).union(nut)


# =====================================================================
#  PLACEMENT UTILITIES  (local +Z of every part is its own axis)
# =====================================================================
def uvec(phi_deg):
    return (cos(radians(phi_deg)), 0.0, sin(radians(phi_deg)))


def pt(base, vec, dist):
    return (base[0] + vec[0] * dist, base[1] + vec[1] * dist, base[2] + vec[2] * dist)


def place(shape, phi_deg, origin, spin=0.0, flip=False):
    """Spin about own axis, align local +Z with the segment direction, translate."""
    s = shape.rotate((0, 0, 0), (0, 0, 1), spin) if spin else shape
    ang = (-90.0 - phi_deg) if flip else (90.0 - phi_deg)
    return s.rotate((0, 0, 0), (0, 1, 0), ang).translate(origin)


# =====================================================================
#  ASSEMBLY
# =====================================================================
d_in, d_mid, d_out = uvec(phi_in), uvec(phi_mid), uvec(phi_out)
J1 = (0.0, 0.0, 0.0)                      # first cross centre
J2 = pt(J1, d_mid, joint_span)            # second cross centre

yoke = universal_yoke()
cross = universal_cross()
pin = splined_pin()
shaft = splined_shaft_yoke()
angle_joint = serrated_angle_joint()
bolt = clamp_bolt()
roll_pin = x_cyl(pin_len - 12.0, roll_pin_r, 26.0)

components = [
    # ---- input end: splined pin clamped in the serrated angle joint ----
    place(pin, phi_in, pt(J1, d_in, -(saj_pin_z - pin_spline_len)), flip=True),
    place(angle_joint, phi_in, pt(J1, d_in, -saj_pin_z)),
    place(bolt, phi_in, pt(J1, d_in, -saj_pin_z)),

    # ---- joint 1 ----
    place(cross, phi_mid, J1),
    place(yoke, phi_mid, pt(J1, d_mid, yoke_pin_z), spin=90.0, flip=True),

    # ---- central telescoping splined shaft with integral yoke ----
    place(shaft, phi_mid, pt(J1, d_mid, ear_len)),

    # ---- joint 2 ----
    place(cross, phi_out, J2),
    place(yoke, phi_out, pt(J2, d_out, yoke_pin_z), spin=90.0, flip=True),

    # ---- output end: splined pin + retaining roll pin ----
    place(pin, phi_out, pt(J2, d_out, ear_len)),
    place(roll_pin, phi_out, pt(J2, d_out, ear_len)),
]

result = components[0]
for comp in components[1:]:
    result = result.union(comp)

# centre the finished assembly on the origin
_bb = result.val().BoundingBox()
result = result.translate((-(_bb.xmin + _bb.xmax) / 2.0,
                           -(_bb.ymin + _bb.ymax) / 2.0,
                           -(_bb.zmin + _bb.zmax) / 2.0))