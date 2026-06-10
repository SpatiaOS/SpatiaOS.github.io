import cadquery as cq
import math

# ============================================================
# Parameters
# ============================================================

# Small bevel gear
SM_TEETH = 24
SM_TIP_R = 52.0       # outer tip radius
SM_ROOT_R = 44.0      # outer root radius
SM_TAPER = 0.65       # inner-to-outer ratio
SM_FACE_H = 18.0      # axial height of tooth cone
SM_BORE_R = 14.4      # bore radius
SM_HUB_R = 22.0       # hub outer radius
SM_HUB_H = 30.0       # hub height

# Large bevel gear (two instances, same part)
LG_TEETH = 40
LG_TIP_R = 90.0
LG_ROOT_R = 78.0
LG_TAPER = 0.55
LG_FACE_H = 25.0
LG_BORE_R = 33.874
LG_HUB_R = 48.0
LG_HUB_H = 10.0

# Shaft / pin dimensions
SM_PIN_R = 14.4
SM_PIN_L = 120.0
LG_PIN1_R = 33.87     # center-bottom gear shaft
LG_PIN1_L = 175.0
LG_PIN2_R = 33.87     # right gear shaft
LG_PIN2_L = 100.0

# ============================================================
# Helper: 2-D gear-tooth polygon
# ============================================================

def gear_profile(n_teeth, tip_r, root_r):
    """Return list of (x,y) points describing a gear cross-section."""
    pts = []
    for i in range(n_teeth):
        base = 2.0 * math.pi * i / n_teeth
        pitch = 2.0 * math.pi / n_teeth
        # Trapezoidal tooth: root-root-tip-tip-root-root
        for frac, r in [(0.02, root_r), (0.18, root_r),
                        (0.22, tip_r),  (0.48, tip_r),
                        (0.52, root_r), (0.72, root_r)]:
            a = base + frac * pitch
            pts.append((r * math.cos(a), r * math.sin(a)))
    return pts

# ============================================================
# Helper: approximate bevel gear solid
# ============================================================

def make_bevel_gear(n_teeth, tip_r, root_r, taper, face_h,
                    bore_r, hub_r, hub_h):
    """
    Bevel gear approximation.
    Large-end teeth at z = 0, tapering toward z = face_h.
    Hub extends from z = 0 down to z = -hub_h.
    """
    inner_tip = tip_r * taper
    inner_root = root_r * taper

    # Extrude spur-gear profile upward
    pts = gear_profile(n_teeth, tip_r, root_r)
    spur = cq.Workplane("XY").polyline(pts).close().extrude(face_h)

    # Intersect with tapering frustum to cut bevel shape
    frustum = (
        cq.Workplane("XY")
        .circle(tip_r + 3.0)
        .workplane(offset=face_h)
        .circle(inner_tip + 3.0)
        .loft()
    )
    teeth_body = spur.intersect(frustum)

    # Solid root cone beneath the tooth tips
    root_cone = (
        cq.Workplane("XY")
        .circle(root_r)
        .workplane(offset=face_h)
        .circle(inner_root)
        .loft()
    )
    gear = teeth_body.union(root_cone)

    # Hub behind the back (large-end) face
    hub = (
        cq.Workplane("XY")
        .workplane(offset=-hub_h)
        .circle(hub_r)
        .extrude(hub_h)
    )
    gear = gear.union(hub)

    # Central bore
    bore = (
        cq.Workplane("XY")
        .circle(bore_r)
        .extrude(face_h + hub_h + 20.0)
        .translate((0, 0, -hub_h - 10.0))
    )
    gear = gear.cut(bore)

    return gear

# ============================================================
# Build gear bodies
# ============================================================

small_gear = make_bevel_gear(
    SM_TEETH, SM_TIP_R, SM_ROOT_R, SM_TAPER,
    SM_FACE_H, SM_BORE_R, SM_HUB_R, SM_HUB_H
)

large_gear = make_bevel_gear(
    LG_TEETH, LG_TIP_R, LG_ROOT_R, LG_TAPER,
    LG_FACE_H, LG_BORE_R, LG_HUB_R, LG_HUB_H
)

# ============================================================
# Assembly layout
# ============================================================
# Gear apexes converge near (0, 0, LG_FACE_H).
# Gear 1 (large): vertical axis +Z, teeth upward
# Gear 2 (large): horizontal axis +X, teeth toward left
# Gear 3 (small): axis tilted upper-left, teeth toward mesh zone

# --- Gear 1  (center-bottom, axis Z) ---
gear1 = large_gear  # already oriented correctly

# Shaft 1 – extends downward through bore
shaft1 = (
    cq.Workplane("XY")
    .circle(LG_PIN1_R)
    .extrude(LG_PIN1_L)
    .translate((0, 0, -(LG_PIN1_L - LG_HUB_H * 0.5)))
)

# --- Gear 2  (right, axis X) ---
# Rotate –90° about Y  ⇒  local Z  →  –X
# Then translate so inner end aligns with gear 1's inner end zone
gear2 = (
    large_gear
    .rotate((0, 0, 0), (0, 1, 0), -90)
    .translate((LG_FACE_H, 0, LG_FACE_H))
)

# Shaft 2 – along +X extending right from hub
shaft2 = (
    cq.Workplane("XY")
    .circle(LG_PIN2_R)
    .extrude(LG_PIN2_L)
    .rotate((0, 0, 0), (0, 1, 0), 90)           # orient along +X
    .translate((LG_FACE_H + LG_HUB_H - 5.0, 0, LG_FACE_H))
)

# --- Small gear  (upper-left) ---
# Rotate 90° about X  ⇒  local Z  →  –Y  (axis points into –Y)
# Then place upper-left of the mesh zone
sm_offset_x = -70.0
sm_offset_z = LG_FACE_H

gear3 = (
    small_gear
    .rotate((0, 0, 0), (1, 0, 0), 90)
    .translate((sm_offset_x, SM_FACE_H + 5.0, sm_offset_z))
)

# Small pin – extends in +Y (upward) from hub
# After –90° about X, canonical Z maps to +Y
pin3 = (
    cq.Workplane("XY")
    .circle(SM_PIN_R)
    .extrude(SM_PIN_L)
    .rotate((0, 0, 0), (1, 0, 0), -90)          # orient along +Y
    .translate((sm_offset_x, 2.0, sm_offset_z))  # start just inside bore
)

# ============================================================
# Combine into a single unified model
# ============================================================

result = (
    gear1
    .union(shaft1)
    .union(gear2)
    .union(shaft2)
    .union(gear3)
    .union(pin3)
)