import cadquery as cq

# ==============================================================================
# PARAMETERS
# ==============================================================================

# Splined Coupling Pins (x2)
pin_diameter = 20.0
pin_length = 75.0
pin_journal_len = 53.5
pin_spline_len = 21.5
pin_hole_dia = 6.0
pin_hole_dist = 8.0  # distance from free end to hole center
pin_chamfer = 1.0

# Universal Joint Yokes (x2)
yoke_length = 56.8
yoke_width = 41.4
yoke_height = 23.4
yoke_ear_thick = 10.0
yoke_ear_gap = 21.4
yoke_pivot_hole_dia = 8.0
yoke_hub_length = 24.0
yoke_hub_od = 28.0
yoke_bore_dia = 20.0
yoke_pivot_dist = 45.1  # distance from hub face to pivot center

# U-Joint Spiders / Cross Elements (x2)
spider_span = 41.4
spider_trunnion_dia = 8.0
spider_cap_dia = 13.0
spider_cap_thick = 2.5
spider_body_size = 14.0

# Serrated Angle Joint
angle_joint_len = 72.0
angle_joint_fork_width = 42.0
angle_joint_body_width = 26.0
angle_joint_body_height = 30.0
angle_joint_bore_dia = 19.5
angle_joint_pivot_dist = 11.7  # distance from tip to pivot hole

# Splined Shaft Yoke
shaft_total_len = 220.0
shaft_shank_radius = 11.08
shaft_shank_dia = 2 * shaft_shank_radius
shaft_shank_len = 77.0
shaft_spline_len = 95.0
shaft_spline_dia = 19.5
shaft_fork_pivot_dist = 208.3  # distance from spline tip to right fork pivot

# Articulation Angles (matching rendered pose)
joint1_pitch = 16.0   # degrees (tilt up/down)
joint1_yaw = -7.0     # degrees (tilt left/right)
joint2_pitch = 18.0   # degrees
joint2_yaw = 6.0      # degrees


# ==============================================================================
# COMPONENT BUILDERS
# ==============================================================================

def make_splined_pin():
    """Builds a 75 mm splined coupling pin with cross hole and chamfer."""
    body = (
        cq.Workplane("YZ")
        .circle(pin_diameter / 2.0)
        .extrude(pin_length)
    )
    # Chamfer free end (x = pin_length)
    body = body.edges(">X").chamfer(pin_chamfer)

    # 6 mm transverse through-hole near free end
    hole = (
        cq.Workplane("XY")
        .transformed(offset=(pin_length - pin_hole_dist, 0, 0))
        .circle(pin_hole_dia / 2.0)
        .extrude(pin_diameter + 10.0, both=True)
    )
    body = body.cut(hole)

    # Longitudinal spline flutes on the hub-engagement section (x: 0 to 21.5)
    for i in range(16):
        angle = i * (360.0 / 16)
        flute = (
            cq.Workplane("YZ")
            .transformed(rotate=(angle, 0, 0), offset=(0, pin_diameter / 2.0, 0))
            .circle(0.8)
            .extrude(pin_spline_len)
        )
        body = body.cut(flute)

    return body


def make_universal_joint_yoke():
    """Builds a universal joint yoke with hub, pinch clamp, and fork ears."""
    # Hub cylinder along X
    hub = (
        cq.Workplane("YZ")
        .circle(yoke_hub_od / 2.0)
        .extrude(yoke_hub_length)
    )

    # Clamping lug on bottom (-Z)
    lug = (
        cq.Workplane("XY")
        .transformed(offset=(yoke_hub_length / 2.0, 0, -15.0))
        .box(18.0, 18.0, 14.0)
    )
    body = hub.union(lug)

    # Positive fork ear (Y: +10.7 to +20.7)
    ear_pos_box = (
        cq.Workplane("XY")
        .transformed(offset=(31.55, 15.7, 0))
        .box(27.1, yoke_ear_thick, yoke_height)
    )
    ear_pos_cyl = (
        cq.Workplane("XZ")
        .circle(yoke_height / 2.0)
        .extrude(yoke_ear_thick)
        .translate((yoke_pivot_dist, 10.7, 0))
    )
    ear_pos = ear_pos_box.union(ear_pos_cyl)

    # Negative fork ear (Y: -20.7 to -10.7)
    ear_neg_box = (
        cq.Workplane("XY")
        .transformed(offset=(31.55, -15.7, 0))
        .box(27.1, yoke_ear_thick, yoke_height)
    )
    ear_neg_cyl = (
        cq.Workplane("XZ")
        .circle(yoke_height / 2.0)
        .extrude(yoke_ear_thick)
        .translate((yoke_pivot_dist, -20.7, 0))
    )
    ear_neg = ear_neg_box.union(ear_neg_cyl)

    body = body.union(ear_pos).union(ear_neg)

    # Central bore for splined pin
    bore = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, -1.0))
        .circle(yoke_bore_dia / 2.0)
        .extrude(yoke_hub_length + 2.0)
    )
    body = body.cut(bore)

    # Pivot pin hole (8 mm) through both ears along Y
    pivot_hole = (
        cq.Workplane("XZ")
        .circle(yoke_pivot_hole_dia / 2.0)
        .extrude(yoke_width + 20.0)
        .translate((yoke_pivot_dist, -(yoke_width + 20.0) / 2.0, 0))
    )
    body = body.cut(pivot_hole)

    # Pinch bolt hole through lug
    bolt_hole = (
        cq.Workplane("XZ")
        .circle(3.2)
        .extrude(30.0)
        .translate((12.0, -15.0, -15.0))
    )
    body = body.cut(bolt_hole)

    # Clamping slit
    slit = (
        cq.Workplane("XY")
        .transformed(offset=(yoke_hub_length / 2.0, 0, -14.0))
        .box(yoke_hub_length + 2.0, 2.0, 16.0)
    )
    body = body.cut(slit)

    return body


def make_spider():
    """Builds a U-joint cross spider element with bearing caps."""
    center = (
        cq.Workplane("XY")
        .box(spider_body_size, spider_body_size, spider_body_size)
        .edges()
        .chamfer(2.0)
    )

    # Trunnions along Y and Z
    trunnion_y = (
        cq.Workplane("XZ")
        .circle(spider_trunnion_dia / 2.0)
        .extrude(spider_span / 2.0, both=True)
    )
    trunnion_z = (
        cq.Workplane("XY")
        .circle(spider_trunnion_dia / 2.0)
        .extrude(spider_span / 2.0, both=True)
    )

    spider = center.union(trunnion_y).union(trunnion_z)

    # Circular bearing caps on the four trunnion tips
    cap_y1 = (
        cq.Workplane("XZ")
        .circle(spider_cap_dia / 2.0)
        .extrude(spider_cap_thick)
        .translate((0, (spider_span / 2.0) - spider_cap_thick, 0))
    )
    cap_y2 = (
        cq.Workplane("XZ")
        .circle(spider_cap_dia / 2.0)
        .extrude(spider_cap_thick)
        .translate((0, -(spider_span / 2.0), 0))
    )
    cap_z1 = (
        cq.Workplane("XY")
        .circle(spider_cap_dia / 2.0)
        .extrude(spider_cap_thick)
        .translate((0, 0, (spider_span / 2.0) - spider_cap_thick))
    )
    cap_z2 = (
        cq.Workplane("XY")
        .circle(spider_cap_dia / 2.0)
        .extrude(spider_cap_thick)
        .translate((0, 0, -(spider_span / 2.0)))
    )

    spider = spider.union(cap_y1).union(cap_y2).union(cap_z1).union(cap_z2)
    return spider


def make_serrated_angle_joint():
    """Builds the central angle-joint connector with fork and clamping hub."""
    # Clamping hub body
    hub = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, 30.0))
        .rect(angle_joint_body_width, angle_joint_body_height)
        .extrude(42.0)
        .edges("|X")
        .chamfer(2.5)
    )

    # Fork ears along Z (gap 21.4 mm, total width 42 mm)
    # Ear 1 (+Z: 10.7 to 21.0)
    ear_pos_box = (
        cq.Workplane("XY")
        .transformed(offset=(21.85, 0, 15.85))
        .box(20.3, yoke_height, 10.3)
    )
    ear_pos_cyl = (
        cq.Workplane("XY")
        .circle(yoke_height / 2.0)
        .extrude(10.3)
        .translate((angle_joint_pivot_dist, 0, 10.7))
    )
    ear_pos = ear_pos_box.union(ear_pos_cyl)

    # Ear 2 (-Z: -21.0 to -10.7)
    ear_neg_box = (
        cq.Workplane("XY")
        .transformed(offset=(21.85, 0, -15.85))
        .box(20.3, yoke_height, 10.3)
    )
    ear_neg_cyl = (
        cq.Workplane("XY")
        .circle(yoke_height / 2.0)
        .extrude(10.3)
        .translate((angle_joint_pivot_dist, 0, -21.0))
    )
    ear_neg = ear_neg_box.union(ear_neg_cyl)

    body = hub.union(ear_pos).union(ear_neg)

    # Central bore for splined shaft
    bore = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, 28.0))
        .circle(angle_joint_bore_dia / 2.0)
        .extrude(45.0)
    )
    body = body.cut(bore)

    # Pivot pin hole through fork ears along Z
    pivot_hole = (
        cq.Workplane("XY")
        .circle(yoke_pivot_hole_dia / 2.0)
        .extrude(angle_joint_fork_width + 10.0)
        .translate((angle_joint_pivot_dist, 0, -(angle_joint_fork_width + 10.0) / 2.0))
    )
    body = body.cut(pivot_hole)

    # Pinch bolt hole and counterbore
    bolt = (
        cq.Workplane("XZ")
        .circle(3.4)
        .extrude(40.0)
        .translate((52.0, -20.0, -5.0))
    )
    cbore = (
        cq.Workplane("XZ")
        .circle(5.5)
        .extrude(10.0)
        .translate((52.0, 8.0, -5.0))
    )
    body = body.cut(bolt).cut(cbore)

    # Clamping slit
    slit = (
        cq.Workplane("XY")
        .transformed(offset=(51.0, 0, -10.0))
        .box(42.0, 2.0, 15.0)
    )
    body = body.cut(slit)

    return body


def make_splined_shaft_yoke():
    """Builds the elongated splined shaft with integrated universal joint fork."""
    # 1. Spline section (x: 0 to 95)
    spline_sec = (
        cq.Workplane("YZ")
        .circle(shaft_spline_dia / 2.0)
        .extrude(shaft_spline_len)
    )
    for i in range(24):
        ang = i * (360.0 / 24)
        flute = (
            cq.Workplane("YZ")
            .transformed(rotate=(ang, 0, 0), offset=(0, shaft_spline_dia / 2.0, 0))
            .circle(0.7)
            .extrude(shaft_spline_len)
        )
        spline_sec = spline_sec.cut(flute)

    # 2. Conical transition (x: 95 to 98)
    cone = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, shaft_spline_len))
        .circle(shaft_spline_dia / 2.0)
        .workplane(offset=3.0)
        .circle(shaft_shank_radius)
        .loft()
    )

    # 3. Smooth cylindrical shank (x: 98 to 175)
    shank = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, 98.0))
        .circle(shaft_shank_radius)
        .extrude(shaft_shank_len)
    )

    # 4. Fork base block (x: 175 to 190)
    fork_base = (
        cq.Workplane("YZ")
        .transformed(offset=(0, 0, 175.0))
        .circle(shaft_shank_radius)
        .extrude(15.0)
    )

    # 5. Fork ears along Z (gap 21.4 mm, total width 41.4 mm)
    ear_pos_box = (
        cq.Workplane("XY")
        .transformed(offset=(191.65, 0, 15.7))
        .box(33.3, yoke_height, yoke_ear_thick)
    )
    ear_pos_cyl = (
        cq.Workplane("XY")
        .circle(yoke_height / 2.0)
        .extrude(yoke_ear_thick)
        .translate((shaft_fork_pivot_dist, 0, 10.7))
    )
    ear_pos = ear_pos_box.union(ear_pos_cyl)

    ear_neg_box = (
        cq.Workplane("XY")
        .transformed(offset=(191.65, 0, -15.7))
        .box(33.3, yoke_height, yoke_ear_thick)
    )
    ear_neg_cyl = (
        cq.Workplane("XY")
        .circle(yoke_height / 2.0)
        .extrude(yoke_ear_thick)
        .translate((shaft_fork_pivot_dist, 0, -20.7))
    )
    ear_neg = ear_neg_box.union(ear_neg_cyl)

    shaft = spline_sec.union(cone).union(shank).union(fork_base).union(ear_pos).union(ear_neg)

    # Pivot pin hole through ears along Z
    pivot_hole = (
        cq.Workplane("XY")
        .circle(yoke_pivot_hole_dia / 2.0)
        .extrude(yoke_width + 10.0)
        .translate((shaft_fork_pivot_dist, 0, -(yoke_width + 10.0) / 2.0))
    )
    shaft = shaft.cut(pivot_hole)

    return shaft


# ==============================================================================
# ASSEMBLY AND ARTICULATION
# ==============================================================================

# Joint 1 pivot center is at origin (0, 0, 0)
spider1 = make_spider()

# Serrated angle joint: pivot hole aligns with spider1 at (0, 0, 0)
angle_joint = make_serrated_angle_joint().translate((-angle_joint_pivot_dist, 0, 0))

# Splined shaft: spline inserts into angle joint bore, fork pivot aligns at x = 221.6 mm
splined_shaft = make_splined_shaft_yoke().translate((13.3, 0, 0))

# Joint 2 pivot center is at (221.6, 0, 0)
joint2_center_x = 13.3 + shaft_fork_pivot_dist  # 221.6 mm
spider2 = make_spider().translate((joint2_center_x, 0, 0))

# Left Arm Sub-assembly (Outer Yoke 1 + Splined Pin 1)
yoke1 = make_universal_joint_yoke().translate((-yoke_pivot_dist, 0, 0))
pin1 = (
    make_splined_pin()
    .rotate((0, 0, 0), (0, 1, 0), 180)
    .translate((-23.6, 0, 0))
)
left_arm_solid = yoke1.union(pin1)

# Articulate Left Arm at Joint 1 (pitch around Y, yaw around Z)
left_arm = (
    left_arm_solid
    .rotate((0, 0, 0), (0, 1, 0), joint1_pitch)
    .rotate((0, 0, 0), (0, 0, 1), joint1_yaw)
)

# Right Arm Sub-assembly (Outer Yoke 2 + Splined Pin 2)
yoke2 = (
    make_universal_joint_yoke()
    .rotate((0, 0, 0), (0, 1, 0), 180)
    .translate((yoke_pivot_dist, 0, 0))
)
pin2 = make_splined_pin().translate((23.6, 0, 0))
right_arm_solid = yoke2.union(pin2)

# Articulate Right Arm at Joint 2 (pitch around Y, yaw around Z)
right_arm = (
    right_arm_solid
    .rotate((0, 0, 0), (0, 1, 0), joint2_pitch)
    .rotate((0, 0, 0), (0, 0, 1), joint2_yaw)
    .translate((joint2_center_x, 0, 0))
)

# ==============================================================================
# UNIFIED MODEL EXPORT
# ==============================================================================

# Combine all articulated assembly components into a single unified model
assembly_solids = [
    left_arm.val(),
    spider1.val(),
    angle_joint.val(),
    splined_shaft.val(),
    spider2.val(),
    right_arm.val()
]

result = cq.Workplane("XY").newObject([cq.Compound.makeCompound(assembly_solids)])