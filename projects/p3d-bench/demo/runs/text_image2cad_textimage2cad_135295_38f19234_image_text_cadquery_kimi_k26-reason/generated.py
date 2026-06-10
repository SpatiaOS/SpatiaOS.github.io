import cadquery as cq

# =============================================================================
# Assembly parameters – stylized leaping quadruped (low-poly sculptural)
# =============================================================================

# Overall target bounding box (approximate)
assembly_length = 260.0
assembly_width = 128.7
assembly_height = 114.9

# --- Head (sculptural_head_shell) ---
head_cranium_l = 20.0
head_cranium_w = 34.0
head_cranium_h = 32.0
head_snout_l = 18.0
head_snout_w = 22.0
head_snout_h = 20.0
head_jaw_l = 16.0
head_jaw_w = 24.0
head_jaw_h = 14.0
ear_base = 10.0
ear_height = 16.0
ear_thick = 6.0
eye_l = 5.0
eye_w = 3.5
eye_h = 3.0
nose_radius = 2.30
nose_depth = 2.06
head_x = 55.0
head_z = 18.0
head_pitch = 12.0

# --- Torso (figurine_body) ---
body_torso_l = 75.0
body_torso_w = 110.0
body_torso_h = 90.0
body_chest_l = 25.0
body_chest_w = 90.0
body_chest_h = 65.0
fl_leg_l = 26.0
fl_leg_w = 18.0
fl_leg_h = 22.0
body_x = -5.0
body_pitch = 5.0

# --- Rear / tail (ornamental_figurine) ---
rear_haunch_l = 70.0
rear_haunch_w = 105.0
rear_haunch_h = 80.0
hl_thigh_l = 42.0
hl_thigh_w = 26.0
hl_thigh_h = 26.0
hl_shank_l = 32.0
hl_shank_w = 18.0
hl_shank_h = 16.0
tail_radius = 6.5
rear_x = -65.0
rear_z = -5.0
rear_pitch = -10.0

# --- Inferred small neck connector (null-geometry part placeholder) ---
neck_l = 16.0
neck_w = 30.0
neck_h = 26.0
neck_x = 34.0
neck_z = 10.0

# =============================================================================
# Head construction – cranium, snout, jaw, ears, eyes, nose
# =============================================================================

cranium = cq.Workplane("XY").box(head_cranium_l, head_cranium_w, head_cranium_h)

snout = (
    cq.Workplane("XY")
    .box(head_snout_l, head_snout_w, head_snout_h)
    .rotate((0, 0, 0), (0, 1, 0), -10)
    .translate((head_cranium_l / 2 + head_snout_l / 2 - 2, 0, -5))
)

jaw = (
    cq.Workplane("XY")
    .box(head_jaw_l, head_jaw_w, head_jaw_h)
    .translate((head_cranium_l / 2 + head_jaw_l / 2 - 2, 0, -14))
)

# Pointed ears as triangular prisms
def make_ear():
    return (
        cq.Workplane("XY")
        .polyline([(0, 0), (ear_base, 0), (ear_base / 2, ear_height)])
        .close()
        .extrude(ear_thick)
        .translate((-ear_thick / 2, 0, 0))
    )

ear_left = (
    make_ear()
    .rotate((0, 0, 0), (0, 1, 0), -10)
    .translate((-4, head_cranium_w / 2 - 4, head_cranium_h / 2))
)
ear_right = (
    make_ear()
    .rotate((0, 0, 0), (0, 1, 0), -10)
    .translate((-4, -head_cranium_w / 2 + 4, head_cranium_h / 2))
)

head = cranium.union(snout).union(jaw).union(ear_left).union(ear_right)

# Eye indentations
eye = cq.Workplane("XY").box(eye_l, eye_w, eye_h).rotate((0, 0, 0), (0, 1, 0), 25)
head = head.cut(eye.translate((6, head_cranium_w / 2, 3)))
head = head.cut(eye.translate((6, -head_cranium_w / 2, 3)))

# Cylindrical nose at snout tip
nose = (
    cq.Workplane("YZ")
    .cylinder(nose_depth, nose_radius)
    .translate((head_cranium_l / 2 + head_snout_l - 2, 0, -8))
)
head = head.union(nose)

# Pose head – slight upward pitch for leaping attitude
head = head.rotate((0, 0, 0), (0, 1, 0), head_pitch).translate((head_x, 0, head_z))

# =============================================================================
# Body construction – chunky torso, chest, tucked front legs
# =============================================================================

torso = cq.Workplane("XY").box(body_torso_l, body_torso_w, body_torso_h)

chest = (
    cq.Workplane("XY")
    .box(body_chest_l, body_chest_w, body_chest_h)
    .translate((body_torso_l / 2 + body_chest_l / 2 - 5, 0, 8))
)

# Front legs tucked under the chest
fl_leg = cq.Workplane("XY").box(fl_leg_l, fl_leg_w, fl_leg_h).rotate((0, 0, 0), (1, 0, 0), 30)
fl_leg_left = fl_leg.translate(
    (body_torso_l / 2 - 2, body_torso_w / 2 - 12, -body_torso_h / 2 - fl_leg_h / 2 + 8)
)
fl_leg_right = fl_leg.translate(
    (body_torso_l / 2 - 2, -body_torso_w / 2 + 12, -body_torso_h / 2 - fl_leg_h / 2 + 8)
)

body = torso.union(chest).union(fl_leg_left).union(fl_leg_right)
body = body.rotate((0, 0, 0), (0, 1, 0), body_pitch).translate((body_x, 0, 0))

# =============================================================================
# Rear construction – haunch, extended hind legs, swept tail
# =============================================================================
haunch = cq.Workplane("XY").box(rear_haunch_l, rear_haunch_w, rear_haunch_h)

# Hind thigh segments angled backward
hl_thigh = cq.Workplane("XY").box(hl_thigh_l, hl_thigh_w, hl_thigh_h).rotate((0, 0, 0), (0, 1, 0), -25)
hl_thigh_left = hl_thigh.translate(
    (-rear_haunch_l / 2 - hl_thigh_l / 2 + 8, rear_haunch_w / 2 - 14, -10)
)
hl_thigh_right = hl_thigh.translate(
    (-rear_haunch_l / 2 - hl_thigh_l / 2 + 8, -rear_haunch_w / 2 + 14, -10)
)

# Hind shank / foot segments
hl_shank = cq.Workplane("XY").box(hl_shank_l, hl_shank_w, hl_shank_h).rotate((0, 0, 0), (0, 1, 0), -45)
hl_shank_left = hl_shank.translate(
    (-rear_haunch_l / 2 - hl_thigh_l - hl_shank_l / 2 + 12, rear_haunch_w / 2 - 14, -30)
)
hl_shank_right = hl_shank.translate(
    (-rear_haunch_l / 2 - hl_thigh_l - hl_shank_l / 2 + 12, -rear_haunch_w / 2 + 14, -30)
)

# Long curved tail with a hexagonal profile swept along a 3D spline
tail_path_pts = [
    (-rear_haunch_l / 2, 5),
    (-rear_haunch_l / 2 - 25, 18),
    (-rear_haunch_l / 2 - 52, 38),
    (-rear_haunch_l / 2 - 72, 50),
]
tail_path_wp = cq.Workplane("XZ").spline(tail_path_pts)
tail_edge = tail_path_wp.vals()[0]
tail_wire = cq.Wire.assembleEdges([tail_edge])
tail = cq.Workplane("XY").polygon(6, tail_radius * 2).sweep(tail_wire)

rear = haunch.union(hl_thigh_left).union(hl_thigh_right).union(hl_shank_left).union(hl_shank_right).union(tail)
rear = rear.rotate((0, 0, 0), (0, 1, 0), rear_pitch).translate((rear_x, 0, rear_z))

# =============================================================================
# Small interstitial neck piece (inferred from null-extraction part dossier)
# =============================================================================
neck = cq.Workplane("XY").box(neck_l, neck_w, neck_h).translate((neck_x, 0, neck_z))

# =============================================================================
# Final unified assembly
# =============================================================================
result = head.union(neck).union(body).union(rear)