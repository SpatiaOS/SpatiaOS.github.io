import cadquery as cq
import math

# =============================================
# WINE BARREL ON CRADLE STAND
# =============================================

# ---------- Barrel Parameters ----------
barrel_length = 260.0
barrel_end_r = 75.0          # outer radius at ends
barrel_mid_r = 93.0          # outer radius at middle (bulge)
half_len = barrel_length / 2.0

# Pre-compute circular-arc barrel profile geometry
_arc_cx = -(barrel_end_r**2 - barrel_mid_r**2 + half_len**2) / (2.0 * (barrel_mid_r - barrel_end_r))
_arc_R = barrel_mid_r - _arc_cx

def barrel_r_at(y_from_center):
    """Barrel outer radius at axial distance y from center."""
    y = min(abs(y_from_center), half_len)
    return _arc_cx + math.sqrt(max(_arc_R**2 - y**2, 0))

# ---------- Hoop Parameters ----------
hoop_width = 8.0
hoop_protrusion = 4.0
hoop_y_abs = [100.0, 50.0]  # distance from center (symmetric pairs)

# ---------- Cap Parameters ----------
cap_r = 68.0
cap_t = 12.0

# ---------- Bung (on top) ----------
bung_y_pos = -15.0
bung_flange_r = 20.0
bung_hub_r = 14.0
bung_flange_h = 5.0
bung_hub_h = 8.0
plug_r = 16.25
plug_h = 10.0

# ---------- Tap (on front face) ----------
tap_z_drop = 18.0
spout_r = 4.0
spout_length = 35.0
knob_r_big = 14.0
knob_r_small = 10.0
knob_waist_r = 7.0
ball_r = 8.0
lever_r = 2.5
lever_length = 17.0
disc_base_r = 10.0

# ---------- Cradle Parameters ----------
crossbar_size = 25.0
crossbar_y_len = 210.0
crossbar_x_sep = 120.0
saddle_x_len = 170.0
saddle_y_len = 40.0
saddle_z_height = 30.0
saddle_y_offset = 75.0
channel_depth = 8.0
key_y_len = 189.0
key_size = 25.0

# Barrel center height above ground
barrel_cz = crossbar_size + saddle_z_height - channel_depth + barrel_r_at(saddle_y_offset)

# =============================================
# 1. BARREL BODY - revolved curved profile
# =============================================
# Profile in XY: X=radial, Y=axial; revolve around Y axis
barrel = (
    cq.Workplane("XY")
    .moveTo(0, -half_len)
    .lineTo(barrel_end_r, -half_len)
    .threePointArc((barrel_mid_r, 0), (barrel_end_r, half_len))
    .lineTo(0, half_len)
    .close()
    .revolve(360, (0, 0), (0, 1))
    .translate((0, 0, barrel_cz))
)
result = barrel

# =============================================
# 2. HOOP RINGS - annular bands around barrel
# =============================================
for ya in hoop_y_abs:
    for sign in [1, -1]:
        yp = sign * ya
        r_local = barrel_r_at(yp)
        hoop = (
            cq.Workplane("XZ")
            .circle(r_local + hoop_protrusion)
            .circle(r_local - 0.5)
            .extrude(hoop_width / 2.0, both=True)
            .translate((0, yp, barrel_cz))
        )
        result = result.union(hoop)

# =============================================
# 3. END CAPS - discs closing barrel ends
# =============================================
# Front cap (Y = -half_len)
front_cap = (
    cq.Workplane("XZ")
    .circle(cap_r)
    .extrude(cap_t)
    .translate((0, -half_len, barrel_cz))
)
# Rear cap (Y = +half_len)
rear_cap = (
    cq.Workplane("XZ")
    .circle(cap_r)
    .extrude(-cap_t)
    .translate((0, half_len, barrel_cz))
)
result = result.union(front_cap).union(rear_cap)

# Front cap decorative rim ring
rim_outer_r = cap_r + 4.0
rim_inner_r = cap_r - 2.0
rim_t = 3.0
front_rim = (
    cq.Workplane("XZ")
    .circle(rim_outer_r)
    .circle(rim_inner_r)
    .extrude(rim_t)
    .translate((0, -half_len - 0.5, barrel_cz))
)
result = result.union(front_rim)

# Locating boss on rear cap (small cylinder)
boss_r = 10.0
boss_h = 3.0
rear_boss = (
    cq.Workplane("XZ")
    .circle(boss_r)
    .extrude(boss_h)
    .translate((0, half_len - cap_t, barrel_cz))
)
result = result.union(rear_boss)

# =============================================
# 4. BUNG FITTING + PLUG (on top of barrel)
# =============================================
bung_barrel_r = barrel_r_at(bung_y_pos)
bung_z0 = barrel_cz + bung_barrel_r

# Flange base
bung_flange = (
    cq.Workplane("XY")
    .circle(bung_flange_r)
    .extrude(bung_flange_h)
    .translate((0, bung_y_pos, bung_z0))
)
# Narrower hub
bung_hub = (
    cq.Workplane("XY")
    .circle(bung_hub_r)
    .extrude(bung_hub_h)
    .translate((0, bung_y_pos, bung_z0 + bung_flange_h))
)
# Plug cap
plug_cap = (
    cq.Workplane("XY")
    .circle(plug_r)
    .extrude(plug_h)
    .translate((0, bung_y_pos, bung_z0 + bung_flange_h + bung_hub_h))
)
result = result.union(bung_flange).union(bung_hub).union(plug_cap)

# =============================================
# 5. TAP ASSEMBLY (on front face)
# =============================================
tap_y0 = -half_len
tap_z0 = barrel_cz - tap_z_drop

# Spout cylinder extending forward (-Y)
spout = (
    cq.Workplane("XZ")
    .circle(spout_r)
    .extrude(-spout_length)
    .translate((0, tap_y0, tap_z0))
)
result = result.union(spout)

# Dual-lobe knob (two fused spheroids at end of spout)
knob_y_center = tap_y0 - spout_length
# Large front lobe
knob_big = (
    cq.Workplane("XY")
    .transformed(offset=(0, knob_y_center - 8, tap_z0))
    .sphere(knob_r_big)
)
# Smaller rear lobe
knob_small = (
    cq.Workplane("XY")
    .transformed(offset=(0, knob_y_center + 7, tap_z0))
    .sphere(knob_r_small)
)
result = result.union(knob_big).union(knob_small)

# Ball-lever handle below tap on front face
ball_y = tap_y0 - 5.0
ball_z = tap_z0 - 26.0

# Disc base flush with front face
disc_base = (
    cq.Workplane("XZ")
    .circle(disc_base_r)
    .extrude(-4.0)
    .translate((0, tap_y0, ball_z))
)
result = result.union(disc_base)

# Ball (sphere)
ball = (
    cq.Workplane("XY")
    .transformed(offset=(0, ball_y - 2, ball_z))
    .sphere(ball_r)
)
result = result.union(ball)

# Lever arm extending sideways from ball
lever = (
    cq.Workplane("YZ")
    .circle(lever_r)
    .extrude(lever_length)
    .translate((0, ball_y - 2, ball_z))
)
result = result.union(lever)

# =============================================
# 6. CRADLE / STAND
# =============================================

# --- Two crossbars running along Y (parallel to barrel axis) ---
for x_off in [-crossbar_x_sep / 2, crossbar_x_sep / 2]:
    cbar = (
        cq.Workplane("XY")
        .box(crossbar_size, crossbar_y_len, crossbar_size)
        .translate((x_off, 0, crossbar_size / 2.0))
    )
    result = result.union(cbar)

# --- Two saddle supports perpendicular to barrel axis ---
for y_off in [-saddle_y_offset, saddle_y_offset]:
    r_barrel_local = barrel_r_at(abs(y_off))

    saddle = (
        cq.Workplane("XY")
        .box(saddle_x_len, saddle_y_len, saddle_z_height)
        .translate((0, y_off, crossbar_size + saddle_z_height / 2.0))
    )

    # Concave cylindrical channel cut from top to cradle the barrel
    cut_r = r_barrel_local + 2.0
    channel_cutter = (
        cq.Workplane("XZ")
        .circle(cut_r)
        .extrude(saddle_y_len + 10, both=True)
        .translate((0, y_off, barrel_cz))
    )
    saddle = saddle.cut(channel_cutter)

    # Small raised humps at saddle ends to retain barrel
    for x_end in [-saddle_x_len / 2 + 15, saddle_x_len / 2 - 15]:
        hump = (
            cq.Workplane("XY")
            .transformed(offset=(x_end, y_off, crossbar_size + saddle_z_height))
            .sphere(12.5)
        )
        # Only keep the top portion above saddle top
        hump_cut = (
            cq.Workplane("XY")
            .box(30, saddle_y_len + 5, 30)
            .translate((x_end, y_off, crossbar_size + saddle_z_height - 15))
        )
        hump = hump.cut(hump_cut)
        result = result.union(hump)

    result = result.union(saddle)

# --- Key bar (trapezoidal cross-section, centered along Y) ---
key_angle = 22.0
key_half_w_top = (key_size / 2.0) - key_size * math.tan(math.radians(key_angle)) * 0.3
key_half_w_bot = key_size / 2.0

key_bar = (
    cq.Workplane("XZ")
    .moveTo(-key_half_w_bot, 0)
    .lineTo(-key_half_w_top, key_size)
    .lineTo(key_half_w_top, key_size)
    .lineTo(key_half_w_bot, 0)
    .close()
    .extrude(key_y_len / 2.0, both=True)
    .translate((0, 0, 0))
)
result = result.union(key_bar)

# --- Small foot pads at crossbar ends ---
foot_size = 18.0
foot_h = 3.0
for x_off in [-crossbar_x_sep / 2, crossbar_x_sep / 2]:
    for y_off in [-crossbar_y_len / 2 + 10, crossbar_y_len / 2 - 10]:
        foot = (
            cq.Workplane("XY")
            .box(foot_size + 8, foot_size, foot_h)
            .translate((x_off, y_off, -foot_h / 2.0))
        )
        result = result.union(foot)