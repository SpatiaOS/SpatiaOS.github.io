import cadquery as cq
import math

# ============================================================
# HYDRAULIC GRAPPLE ASSEMBLY
# A 4-arm hydraulic grapple with bell-shaped central hub,
# tapered jaw arms, hydraulic cylinder barrels, and linkage rods.
# ============================================================

# --- Central Hub ---
hub_r_lo = 13.5        # Lower cylinder radius (mm)
hub_r_hi = 9.39        # Upper cylinder radius (mm)
h_base = 12.0          # Lower cylinder height
h_cone = 14.0          # Cone transition height
h_top = 8.0            # Upper cylinder height
h_hub = h_base + h_cone + h_top  # 34mm total

# --- Eye Lug ---
eye_ht = 3.0           # Half-thickness of tab
eye_h = 6.5            # Straight section height
eye_w = 10.0           # Width (Y direction)
eye_bore_r = 2.5       # Bore radius (5mm dia)

# --- Jaw Arms ---
jaw_len = 65.0         # Total arm length
jaw_w1 = 14.0          # Width at pivot end
jaw_w2 = 3.5           # Width at tip
jaw_t = 5.0            # Arm thickness
jaw_ang = 22.0         # Splay angle from vertical (degrees)
jaw_r = 15.0           # Pivot radial distance from Z axis
jaw_z = 3.0            # Pivot Z position

# --- Hydraulic Cylinder Barrels ---
cyl_r = 3.38           # Outer radius
cyl_wall = 0.7         # Wall thickness
cyl_len = 28.0         # Barrel length
cyl_ang = 15.0         # Splay angle
cyl_r_att = 12.5       # Upper attachment radial distance
cyl_z_att = h_base + h_cone  # Upper attachment Z = 26mm

# --- Follower Rods ---
rod_r = 1.2            # Stem radius
rod_head_r = 2.5       # Mushroom head radius
rod_len = 22.0         # Rod length
rod_ang = 20.0         # Splay angle
rod_r_att = 14.0       # Upper radial attachment
rod_z_att = h_base     # Upper Z attachment = 12mm

# --- Pivot Bosses ---
piv_r = 2.8            # Boss outer radius
piv_w = 9.0            # Boss width (Y extent)
piv_bore_r = 1.4       # Pin bore radius

# --- Mounting Lugs ---
lug_t = 1.47           # Thickness
lug_ext = 5.0          # Radial extension from hub surface
lug_h = 7.0            # Height

N = 4                  # Number of arms (4-fold symmetry)
S2 = math.sqrt(2) / 2  # sin/cos(45 degrees)

# ============================================================
# 1. CENTRAL HUB - bell-shaped solid of revolution
#    Profile on XZ plane, revolved 360 deg around Z axis
# ============================================================
hub = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(hub_r_lo, 0)
    .lineTo(hub_r_lo, h_base)
    .lineTo(hub_r_hi, h_base + h_cone)
    .lineTo(hub_r_hi, h_hub)
    .lineTo(0, h_hub)
    .close()
    .revolve(360, (0, 0), (0, 1))
)
result = hub

# ============================================================
# 2. EYE LUG - rounded tab with through-bore at hub crown
# ============================================================
eye_lug = (
    cq.Workplane("XZ")
    .transformed(offset=(0, h_hub, 0))
    .moveTo(-eye_ht, 0)
    .lineTo(-eye_ht, eye_h)
    .threePointArc((0, eye_h + eye_ht), (eye_ht, eye_h))
    .lineTo(eye_ht, 0)
    .close()
    .extrude(eye_w / 2, both=True)
)

# Bore through the eye lug (Y direction)
eye_bore_cut = (
    cq.Workplane("XZ")
    .transformed(offset=(0, h_hub + eye_h, 0))
    .circle(eye_bore_r)
    .extrude(eye_w + 2, both=True)
)
result = result.union(eye_lug.cut(eye_bore_cut))

# ============================================================
# 3. PROTOTYPE PARTS (created once, placed 4x by symmetry)
# ============================================================

# Jaw arm: tapered loft from wide pivot end to narrow claw tip
jaw_proto = (
    cq.Workplane("XY")
    .rect(jaw_t, jaw_w1)
    .workplane(offset=-jaw_len)
    .rect(jaw_t * 0.6, jaw_w2)
    .loft()
)

# Hydraulic cylinder barrel: hollow tube with hemispherical dome cap
cyl_body = (
    cq.Workplane("XY")
    .circle(cyl_r)
    .circle(cyl_r - cyl_wall)
    .extrude(-cyl_len)
)
cyl_dome = (
    cq.Workplane("XZ")
    .moveTo(0, 0)
    .lineTo(cyl_r, 0)
    .threePointArc((cyl_r * S2, cyl_r * S2), (0, cyl_r))
    .close()
    .revolve(360, (0, 0), (0, 1))
)
cyl_proto = cyl_body.union(cyl_dome)

# Follower rod: thin stem with mushroom-head disc
rod_stem = cq.Workplane("XY").circle(rod_r).extrude(-rod_len)
rod_head = cq.Workplane("XY").circle(rod_head_r).extrude(1.2)
rod_proto = rod_stem.union(rod_head)

# ============================================================
# 4. ASSEMBLE IN 4-FOLD ROTATIONAL SYMMETRY
# ============================================================
for i in range(N):
    theta = i * 90.0

    # --- Jaw arm: tilt outward, translate to pivot, rotate to position ---
    jaw_i = (
        jaw_proto
        .rotate((0, 0, 0), (0, 1, 0), jaw_ang)
        .translate((jaw_r, 0, jaw_z))
        .rotate((0, 0, 0), (0, 0, 1), theta)
    )
    result = result.union(jaw_i)

    # --- Hydraulic cylinder barrel ---
    cyl_i = (
        cyl_proto
        .rotate((0, 0, 0), (0, 1, 0), cyl_ang)
        .translate((cyl_r_att, 0, cyl_z_att))
        .rotate((0, 0, 0), (0, 0, 1), theta)
    )
    result = result.union(cyl_i)

    # --- Follower linkage rod ---
    rod_i = (
        rod_proto
        .rotate((0, 0, 0), (0, 1, 0), rod_ang)
        .translate((rod_r_att, 0, rod_z_att))
        .rotate((0, 0, 0), (0, 0, 1), theta)
    )
    result = result.union(rod_i)

    # --- Lower pivot boss at jaw-hub junction (with pin bore) ---
    pb_lo = (
        cq.Workplane("XZ")
        .transformed(offset=(jaw_r, jaw_z, 0))
        .circle(piv_r)
        .extrude(piv_w / 2, both=True)
    )
    bore_lo = (
        cq.Workplane("XZ")
        .transformed(offset=(jaw_r, jaw_z, 0))
        .circle(piv_bore_r)
        .extrude(piv_w, both=True)
    )
    result = result.union(
        pb_lo.cut(bore_lo).rotate((0, 0, 0), (0, 0, 1), theta)
    )

    # --- Upper pivot boss at cylinder-hub junction ---
    pb_hi = (
        cq.Workplane("XZ")
        .transformed(offset=(cyl_r_att, cyl_z_att, 0))
        .circle(piv_r * 0.7)
        .extrude(piv_w * 0.7 / 2, both=True)
    )
    bore_hi = (
        cq.Workplane("XZ")
        .transformed(offset=(cyl_r_att, cyl_z_att, 0))
        .circle(piv_bore_r * 0.7)
        .extrude(piv_w, both=True)
    )
    result = result.union(
        pb_hi.cut(bore_hi).rotate((0, 0, 0), (0, 0, 1), theta)
    )

    # --- Mid-jaw pivot boss where cylinder meets jaw ---
    mid_frac = 0.50
    sa = math.radians(jaw_ang)
    mid_x = jaw_r + mid_frac * jaw_len * math.sin(sa)
    mid_z = jaw_z - mid_frac * jaw_len * math.cos(sa)
    pb_mid = (
        cq.Workplane("XZ")
        .transformed(offset=(mid_x, mid_z, 0))
        .circle(piv_r * 0.65)
        .extrude(piv_w * 0.6 / 2, both=True)
    )
    bore_mid = (
        cq.Workplane("XZ")
        .transformed(offset=(mid_x, mid_z, 0))
        .circle(piv_bore_r * 0.6)
        .extrude(piv_w, both=True)
    )
    result = result.union(
        pb_mid.cut(bore_mid).rotate((0, 0, 0), (0, 0, 1), theta)
    )

    # --- Mounting lug pairs at lower pivot (flanking each jaw) ---
    for s in [-1, 1]:
        y_pos = s * (jaw_t / 2 + lug_t / 2 + 0.5)
        lug_lo = (
            cq.Workplane("XY")
            .transformed(offset=(hub_r_lo + lug_ext / 2, y_pos, jaw_z))
            .box(lug_ext, lug_t, lug_h)
            .rotate((0, 0, 0), (0, 0, 1), theta)
        )
        result = result.union(lug_lo)

    # --- Mounting lug pairs at upper pivot ---
    for s in [-1, 1]:
        y_pos = s * (jaw_t / 2 + lug_t / 2 + 0.5)
        lug_hi = (
            cq.Workplane("XY")
            .transformed(offset=(hub_r_hi + lug_ext * 0.4, y_pos, cyl_z_att))
            .box(lug_ext * 0.8, lug_t, lug_h * 0.7)
            .rotate((0, 0, 0), (0, 0, 1), theta)
        )
        result = result.union(lug_hi)