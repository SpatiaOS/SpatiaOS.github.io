import math
import cadquery as cq

# ============================================================
# Scissor assembly: two crossing blade halves + slotted knob.
# Bodies lie in the Y-Z plane; the thin direction is X.
# ============================================================

# ---- Shared blade parameters ----
half_thickness  = 2.1      # ~2.0 mm per half (+0.1 so the halves overlap
                           # slightly at the pivot for a robust Boolean fuse)
pivot_hole_dia  = 1.583    # pivot bore through both halves, axis along X
half_open_angle = 5.0      # each half rotated about X; blades cross and
                           # finger loops splay apart

# ---- Half A: large elongated finger loop (right handle) ----
loopA_center = (11.0, 46.0)
loopA_outer  = (11.0, 15.0)   # ellipse radii (Y, Z) - tall oval loop
loopA_inner  = (6.0, 10.0)

# ---- Half B: smaller, rounder finger loop (left handle) ----
loopB_center = (-9.0, 44.0)
loopB_outer  = (8.0, 10.5)
loopB_inner  = (4.5, 7.0)
loop_rim_fillet = 0.7      # rounds the loop rims into a torus-like grip

# ---- Slotted knob fastener (axis along X) ----
shaft_radius        = 0.82    # slight interference with the 0.7915 bores so
                              # the fastener truly fuses with the halves
shaft_length        = 4.0     # spans both 2 mm blade thicknesses
head_slotted_radius = 2.66
head_plain_radius   = 2.56
head_thickness      = 1.0     # total fastener length = 1 + 4 + 1 = 6 mm
head_rim            = 0.4     # rounded rim rolled into the revolve profile
slot_width          = 0.9
slot_depth          = 0.8
slot_tilt           = 18.0    # slot runs slightly diagonal, as in render

# ---------------- Blade half A ----------------
# Single closed spline profile: blade tip, pivot bulge, flared neck.
bodyA = (
    cq.Workplane("YZ")
    .moveTo(6.0, -2.0)
    # outer cutting edge down to the pointed tip
    .spline([(3.6, -20), (3.0, -50), (2.8, -75), (2.5, -95)],
            includeCurrent=True)
    # inner edge back up into the pivot region
    .spline([(2.2, -75), (1.2, -50), (0.0, -25), (-3.5, -10), (-5.5, -3)],
            includeCurrent=True)
    # around the pivot boss and sweeping up the neck toward the loop
    .spline([(-6.2, 0), (-5.8, 3), (-2.5, 8), (2.5, 17), (4.8, 26),
             (5.0, 33.5)], includeCurrent=True)
    .lineTo(17.0, 32.8)                       # across the loop base
    # outer neck edge back down to the start
    .spline([(13.5, 22), (10.0, 12), (7.5, 5), (6.2, 2)],
            includeCurrent=True)
    .close()
    .extrude(half_thickness)
)

# Finger loop: elliptical annulus with rounded rims (torus-like grip)
ringA = (
    cq.Workplane("YZ")
    .center(*loopA_center)
    .ellipse(*loopA_outer)
    .ellipse(*loopA_inner)
    .extrude(half_thickness)
    .edges()
    .fillet(loop_rim_fillet)
)

# Rotate about the pivot axis so the handle swings right, tip left
halfA = (
    bodyA.union(ringA)
    .rotate((0, 0, 0), (1, 0, 0), -half_open_angle)
)

# ---------------- Blade half B ----------------
# Mirrored about the pivot axis, slightly longer blade, smaller loop.
# Extrusion starts at x = 1.9 -> overlaps half A by 0.2 mm.
bodyB = (
    cq.Workplane("YZ", origin=(shaft_length - half_thickness, 0, 0))
    .moveTo(-6.0, -2.0)
    .spline([(-3.6, -21), (-3.0, -53), (-2.8, -78), (-2.5, -100)],
            includeCurrent=True)
    .spline([(-2.2, -78), (-1.2, -53), (0.0, -26), (3.5, -10), (5.5, -3)],
            includeCurrent=True)
    .spline([(6.2, 0), (5.8, 3), (2.5, 8), (-2.5, 17), (-4.5, 27),
             (-4.6, 35.5)], includeCurrent=True)
    .lineTo(-13.8, 35.0)
    .spline([(-11.0, 25), (-9.0, 15), (-7.2, 6), (-6.2, 2)],
            includeCurrent=True)
    .close()
    .extrude(half_thickness)
)

ringB = (
    cq.Workplane("YZ", origin=(shaft_length - half_thickness, 0, 0))
    .center(*loopB_center)
    .ellipse(*loopB_outer)
    .ellipse(*loopB_inner)
    .extrude(half_thickness)
    .edges()
    .fillet(loop_rim_fillet)
)

halfB = (
    bodyB.union(ringB)
    .rotate((0, 0, 0), (1, 0, 0), half_open_angle)
)

# ---------------- Pivot bores ----------------
halves = halfA.union(halfB)
bore = (
    cq.Workplane("YZ", origin=(-2.0, 0, 0))
    .circle(pivot_hole_dia / 2)
    .extrude(8.0)                     # through both 2 mm halves
)
halves = halves.cut(bore)

# ---------------- Slotted knob fastener ----------------
# Built as a solid of revolution about the X axis so the slightly domed,
# rounded head rims are part of the profile (no fragile edge chamfers).
# Drawn on the XZ plane: local X = global X (shaft axis), local Y = radius.
q = head_rim * math.sqrt(0.5)   # quarter-circle arc midpoint offset

fastener = (
    cq.Workplane("XZ")
    # slotted head: back face, rounded rim, outer face, rounded rim
    .moveTo(-head_thickness, 0)
    .lineTo(-head_thickness, head_slotted_radius - head_rim)
    .threePointArc(
        (-head_thickness + head_rim - q, head_slotted_radius - head_rim + q),
        (-head_thickness + head_rim, head_slotted_radius))
    .lineTo(-head_rim, head_slotted_radius)
    .threePointArc(
        (-head_rim + q, head_slotted_radius - head_rim + q),
        (0, head_slotted_radius - head_rim))
    # step down to the shaft and run its full 4 mm length
    .lineTo(0, shaft_radius)
    .lineTo(shaft_length, shaft_radius)
    # plain head: back face, rounded rim, outer face, rounded rim, front face
    .lineTo(shaft_length, head_plain_radius - head_rim)
    .threePointArc(
        (shaft_length + head_rim - q, head_plain_radius - head_rim + q),
        (shaft_length + head_rim, head_plain_radius))
    .lineTo(shaft_length + head_thickness - head_rim, head_plain_radius)
    .threePointArc(
        (shaft_length + head_thickness - head_rim + q,
         head_plain_radius - head_rim + q),
        (shaft_length + head_thickness, head_plain_radius - head_rim))
    .lineTo(shaft_length + head_thickness, 0)
    .close()
    .revolve(360.0, (0, 0), (1, 0))   # about the local/global X axis
)

# Slot across the slotted head face (torque-engagement groove)
slot = (
    cq.Workplane("XY")
    .box(head_thickness + 0.6, slot_width, 2 * head_slotted_radius + 2.0)
    .rotate((0, 0, 0), (1, 0, 0), slot_tilt)
    .translate((-head_thickness + slot_depth - (head_thickness + 0.6) / 2,
                0, 0))
)
fastener = fastener.cut(slot)

# ---------------- Final assembly ----------------
result = halves.union(fastener)