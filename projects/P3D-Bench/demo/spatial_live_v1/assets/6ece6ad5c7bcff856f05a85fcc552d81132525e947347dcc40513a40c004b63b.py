import math
import cadquery as cq

# Dimensions in millimetres
spline_tooth_count = 36
spline_root_radius = 8.24
spline_tip_radius = 8.62
spline_lead_diameter = 19.48
fit_overlap = 0.025

fork_span = 41.4
ear_thickness = 6.0
ear_radius = 11.7
pivot_diameter = 8.0
edge_break = 0.45
outer_yoke_length = 56.8
outer_hub_radius = 11.7
hub_length = 9.0
web_back_x = -28.5
web_front_x = -21.5
web_corner_radius = 1.8
web_hole_diameter = 6.78
web_counterbore_diameter = 17.37
web_counterbore_depth = 8.0
hub_retention_offset = 10.5

coupling_pin_length = 75.0
coupling_spline_length = 21.5
coupling_journal_radius = 10.0
retention_hole_diameter = 6.0
pin_end_chamfer = 0.6
exposed_hole_from_end = 9.5

shaft_total_length = 220.0
shaft_spline_length = 86.5
shaft_journal_length = 78.0
shaft_journal_radius = 11.08
shaft_start_x = 14.0
integrated_hub_radius = 12.8
shoulder_ring_radius = 12.3
shoulder_ring_width = 1.5

adapter_length = 72.0
adapter_ear_radius = 13.0
adapter_web_start_x = 18.5
adapter_web_end_x = 29.0
adapter_retention_x = 27.5
clamp_start_x = 28.0
clamp_width = 26.0
clamp_height = 34.0
clamp_corner_cut = 4.0
clamp_split_width = 1.2
clamp_groove_width = 0.8
clamp_groove_core_radius = 11.7
clamp_bolt_x = 49.0
clamp_bolt_offset = 12.0
articulation_clearance_radius = 24.1

spider_block_width = 14.0
spider_block_depth = 12.0
spider_stem_radius = 5.8
bearing_flange_radius = 9.0
bearing_flange_thickness = 1.5
bearing_contact_overlap = 0.15
trunnion_radius = 3.85
trunnion_end_recess = 0.55
trunnion_end_chamfer = 0.25

locating_pin_length = 1.15
locating_pin_width = 0.009
locating_pin_height = 0.013

left_joint_angle = 50.0
left_fork_clock = 35.0
right_joint_angle = 10.0
right_fork_clock = 45.0
assembly_pitch = -13.0
assembly_yaw = 176.63

# Derived stations, measured along the central shaft axis
fork_face_width = 2.0 * ear_radius
fork_half_gap = fork_span / 2.0 - ear_thickness
outer_hub_back_x = -(outer_yoke_length - ear_radius)
coupling_journal_length = coupling_pin_length - coupling_spline_length
shaft_journal_start_x = shaft_start_x + shaft_spline_length
shaft_journal_end_x = shaft_journal_start_x + shaft_journal_length
integrated_fork_length = (
    shaft_total_length - shaft_spline_length - shaft_journal_length
)
right_joint_x = shaft_start_x + shaft_total_length - ear_radius
adapter_end_x = adapter_length - adapter_ear_radius
left_adapter_clock = 90.0 + left_fork_clock


def cylinder(radius, length, origin, axis=(1, 0, 0)):
    solid = cq.Solid.makeCylinder(
        radius, length, cq.Vector(*origin), cq.Vector(*axis)
    )
    return cq.Workplane("XY").newObject([solid])


def cone(radius_start, radius_end, length, origin, axis=(1, 0, 0)):
    solid = cq.Solid.makeCone(
        radius_start, radius_end, length,
        cq.Vector(*origin), cq.Vector(*axis)
    )
    return cq.Workplane("XY").newObject([solid])


def scaled_vector(vector, distance):
    return (
        vector.x * distance,
        vector.y * distance,
        vector.z * distance,
    )


def spline_section(start_x, length, radial_offset=0.0):
    """Straight splines with circular roots and crests, rather than knurling."""
    root = spline_root_radius + radial_offset
    crest = spline_tip_radius + radial_offset
    pitch = 2.0 * math.pi / spline_tooth_count

    def point(radius, angle):
        return radius * math.cos(angle), radius * math.sin(angle)

    profile = cq.Workplane("YZ", origin=(start_x, 0, 0)).moveTo(
        *point(root, -0.32 * pitch)
    )

    for tooth_index in range(spline_tooth_count):
        angle = tooth_index * pitch
        profile = (
            profile
            .lineTo(*point(crest, angle - 0.18 * pitch))
            .threePointArc(
                point(crest, angle),
                point(crest, angle + 0.18 * pitch),
            )
            .lineTo(*point(root, angle + 0.32 * pitch))
            .threePointArc(
                point(root, angle + 0.50 * pitch),
                point(root, angle + 0.68 * pitch),
            )
        )

    return profile.close().extrude(length)


def rounded_rectangle(workplane, width, height, radius):
    half_width = width / 2.0
    half_height = height / 2.0
    diagonal = radius / math.sqrt(2.0)

    return (
        workplane
        .moveTo(-half_width + radius, -half_height)
        .lineTo(half_width - radius, -half_height)
        .threePointArc(
            (half_width - radius + diagonal, -half_height + radius - diagonal),
            (half_width, -half_height + radius),
        )
        .lineTo(half_width, half_height - radius)
        .threePointArc(
            (half_width - radius + diagonal, half_height - radius + diagonal),
            (half_width - radius, half_height),
        )
        .lineTo(-half_width + radius, half_height)
        .threePointArc(
            (-half_width + radius - diagonal, half_height - radius + diagonal),
            (-half_width, half_height - radius),
        )
        .lineTo(-half_width, -half_height + radius)
        .threePointArc(
            (-half_width + radius - diagonal, -half_height + radius - diagonal),
            (-half_width + radius, -half_height),
        )
        .close()
    )


def rounded_ear(root_x, radius, opening_direction=1):
    return (
        cq.Workplane("XY")
        .moveTo(root_x, -radius)
        .lineTo(0, -radius)
        .threePointArc((opening_direction * radius, 0), (0, radius))
        .lineTo(root_x, radius)
        .close()
        .extrude(ear_thickness)
        .edges("not |Z")
        .chamfer(edge_break)
    )


def drill_pivot_passages(body):
    bore_radius = pivot_diameter / 2.0
    rim_break = 0.35

    body = body.cut(
        cylinder(
            bore_radius, fork_span + 2.0,
            (0, 0, -fork_span / 2.0 - 1.0), (0, 0, 1)
        )
    )
    body = body.cut(
        cone(
            bore_radius + rim_break, bore_radius, rim_break,
            (0, 0, -fork_span / 2.0), (0, 0, 1)
        )
    )
    return body.cut(
        cone(
            bore_radius, bore_radius + rim_break, rim_break,
            (0, 0, fork_span / 2.0 - rim_break), (0, 0, 1)
        )
    )


def make_yoke(hub_back_distance, hub_radius, splined_hub=True):
    """Fork opening toward +X, with its trunnion centre at the origin."""
    rear_x = -hub_back_distance

    hub = (
        cq.Workplane("YZ", origin=(rear_x, 0, 0))
        .circle(hub_radius)
        .extrude(hub_length)
        .faces("<X").edges().chamfer(edge_break)
    )

    transition_start_x = rear_x + 6.0
    transition_profiles = (
        cq.Workplane("YZ", origin=(transition_start_x, 0, 0))
        .circle(hub_radius)
        .workplane(offset=web_back_x + 0.3 - transition_start_x)
    )
    transition = rounded_rectangle(
        transition_profiles, fork_face_width, fork_span, web_corner_radius
    ).loft(combine=True)

    web = rounded_rectangle(
        cq.Workplane("YZ", origin=(web_back_x, 0, 0)),
        fork_face_width, fork_span, web_corner_radius
    ).extrude(web_front_x - web_back_x)

    ear = rounded_ear(web_back_x, ear_radius)
    body = (
        hub.union(transition)
        .union(web)
        .union(ear.translate((0, 0, fork_half_gap)))
        .union(ear.translate((0, 0, -fork_span / 2.0)))
    )
    body = drill_pivot_passages(body)

    if splined_hub:
        body = body.cut(
            spline_section(
                rear_x - 0.3, web_front_x - rear_x + 0.6, -fit_overlap
            )
        )
        body = body.cut(
            cone(
                spline_lead_diameter / 2.0,
                spline_tip_radius - fit_overlap,
                1.4, (rear_x - 0.05, 0, 0),
            )
        )
        body = body.cut(
            cone(
                spline_tip_radius - fit_overlap,
                spline_lead_diameter / 2.0,
                1.4, (web_front_x - 1.35, 0, 0),
            )
        )

        retention_x = rear_x + hub_retention_offset
        body = body.cut(
            cylinder(
                web_hole_diameter / 2.0, fork_span + 2.0,
                (retention_x, 0, -fork_span / 2.0 - 1.0), (0, 0, 1)
            )
        )
        body = body.cut(
            cylinder(
                web_counterbore_diameter / 2.0, web_counterbore_depth,
                (retention_x, 0, -fork_span / 2.0 - 0.05), (0, 0, 1)
            )
        )
    else:
        # Axial relief inside the integral fork leaves its shaft connection solid.
        body = body.cut(
            cylinder(
                web_hole_diameter / 2.0,
                web_front_x - rear_x - 5.5,
                (rear_x + 6.0, 0, 0),
            )
        )
        body = body.cut(
            cylinder(
                web_counterbore_diameter / 2.0, 10.5,
                (web_front_x - 10.0, 0, 0),
            )
        )

    return body


def make_coupling_pin():
    free_end_x = outer_hub_back_x - coupling_journal_length

    journal = cylinder(
        coupling_journal_radius,
        coupling_journal_length - pin_end_chamfer + bearing_contact_overlap,
        (free_end_x + pin_end_chamfer, 0, 0),
    )
    journal = journal.union(
        cone(
            coupling_journal_radius - pin_end_chamfer,
            coupling_journal_radius,
            pin_end_chamfer, (free_end_x, 0, 0),
        )
    )
    pin = journal.union(
        spline_section(outer_hub_back_x, coupling_spline_length)
    )

    for hole_x in (
        free_end_x + exposed_hole_from_end,
        outer_hub_back_x + hub_retention_offset,
    ):
        pin = pin.cut(
            cylinder(
                retention_hole_diameter / 2.0,
                2.0 * coupling_journal_radius + 2.0,
                (hole_x, 0, -coupling_journal_radius - 1.0), (0, 0, 1)
            )
        )
    return pin


def make_angle_adapter():
    half_width = clamp_width / 2.0
    half_height = clamp_height / 2.0
    corner = clamp_corner_cut

    clamp_outline = [
        (-half_width + corner, -half_height),
        (half_width - corner, -half_height),
        (half_width, -half_height + corner),
        (half_width, half_height - corner),
        (half_width - corner, half_height),
        (-half_width + corner, half_height),
        (-half_width, half_height - corner),
        (-half_width, -half_height + corner),
    ]

    clamp = (
        cq.Workplane("YZ", origin=(clamp_start_x, 0, 0))
        .polyline(clamp_outline).close()
        .extrude(adapter_end_x - clamp_start_x)
    )
    web = rounded_rectangle(
        cq.Workplane("YZ", origin=(adapter_web_start_x, 0, 0)),
        clamp_width, fork_span, web_corner_radius
    ).extrude(adapter_web_end_x - adapter_web_start_x)

    # Spherical throat relief clears the opposing fork at the larger joint angle.
    body = web.union(clamp).cut(
        cq.Workplane("XY").sphere(articulation_clearance_radius)
    )
    ear = rounded_ear(
        adapter_web_end_x + 2.0, adapter_ear_radius, opening_direction=-1
    )
    body = (
        body.union(ear.translate((0, 0, fork_half_gap)))
        .union(ear.translate((0, 0, -fork_span / 2.0)))
    )
    body = drill_pivot_passages(body)

    body = body.cut(
        spline_section(
            adapter_web_start_x - 0.4,
            adapter_end_x - adapter_web_start_x + 0.8,
            -fit_overlap,
        )
    )
    body = body.cut(
        cone(
            spline_tip_radius - fit_overlap, spline_lead_diameter / 2.0,
            1.5, (adapter_end_x - 1.45, 0, 0),
        )
    )
    body = body.cut(
        cylinder(
            web_hole_diameter / 2.0, fork_span + 2.0,
            (adapter_retention_x, 0, -fork_span / 2.0 - 1.0), (0, 0, 1)
        )
    )
    body = body.cut(
        cylinder(
            web_counterbore_diameter / 2.0, 3.8,
            (adapter_retention_x, 0, -fork_span / 2.0 - 0.05), (0, 0, 1)
        )
    )

    # A longitudinal saw cut and a shallow transverse groove distinguish the jaws.
    split = (
        cq.Workplane("XY")
        .box(
            adapter_end_x - clamp_start_x + 2.0,
            clamp_split_width, half_height + 1.0,
        )
        .translate((
            (clamp_start_x + adapter_end_x) / 2.0,
            0, (half_height + 1.0) / 2.0,
        ))
    )
    groove_x = (clamp_start_x + adapter_end_x) / 2.0
    groove = (
        cq.Workplane("XY")
        .box(clamp_groove_width, clamp_width + 4.0, clamp_height + 4.0)
        .translate((groove_x, 0, 0))
        .cut(cylinder(
            clamp_groove_core_radius, clamp_groove_width + 2.0,
            (groove_x - clamp_groove_width / 2.0 - 1.0, 0, 0),
        ))
    )
    body = body.cut(split).cut(groove)
    body = body.cut(
        cylinder(
            web_hole_diameter / 2.0, clamp_width + 2.0,
            (clamp_bolt_x, -half_width - 1.0, clamp_bolt_offset), (0, 1, 0)
        )
    )
    body = body.cut(
        cone(
            5.0, web_hole_diameter / 2.0, 1.5,
            (clamp_bolt_x, half_width + 0.05, clamp_bolt_offset), (0, -1, 0)
        )
    )

    locating_pin = (
        cq.Workplane(
            "YZ",
            origin=(clamp_start_x + 2.0, 6.0, half_height - 0.002),
        )
        .ellipse(locating_pin_width / 2.0, locating_pin_height / 2.0)
        .extrude(locating_pin_length)
    )
    return body.union(locating_pin)


def make_spider(first_axis, second_axis):
    axis_a = cq.Vector(*first_axis).normalized()
    axis_b = cq.Vector(*second_axis).normalized()
    normal_axis = axis_a.cross(axis_b).normalized()
    plane = cq.Plane(
        origin=(0, 0, 0),
        xDir=axis_a.toTuple(),
        normal=normal_axis.toTuple(),
    )

    spider = (
        cq.Workplane(plane)
        .box(spider_block_width, spider_block_width, spider_block_depth)
        .edges().fillet(1.8)
    )
    pin_end = fork_span / 2.0 - trunnion_end_recess
    stem_half_length = fork_half_gap - 1.1

    for axis in (axis_a, axis_b):
        direction = axis.toTuple()
        spider = spider.union(
            cylinder(
                spider_stem_radius, 2.0 * stem_half_length,
                scaled_vector(axis, -stem_half_length), direction,
            )
        )
        spider = spider.union(
            cylinder(
                trunnion_radius, 2.0 * (pin_end - trunnion_end_chamfer),
                scaled_vector(axis, -pin_end + trunnion_end_chamfer),
                direction,
            )
        )

        for sign in (-1.0, 1.0):
            outward = scaled_vector(axis, sign)
            spider = spider.union(
                cone(
                    trunnion_radius,
                    trunnion_radius - trunnion_end_chamfer,
                    trunnion_end_chamfer,
                    scaled_vector(axis, sign * (pin_end - trunnion_end_chamfer)),
                    outward,
                )
            )
            # The inner flanges seat against the cheeks; the outer pin ends remain recessed.
            spider = spider.union(
                cylinder(
                    bearing_flange_radius,
                    bearing_flange_thickness + bearing_contact_overlap,
                    scaled_vector(
                        axis, sign * (fork_half_gap - bearing_flange_thickness)
                    ),
                    outward,
                )
            )

    plug_plane = cq.Plane(
        origin=scaled_vector(normal_axis, spider_block_depth / 2.0 - 0.2),
        xDir=axis_a.toTuple(),
        normal=normal_axis.toTuple(),
    )
    grease_plug = cq.Workplane(plug_plane).polygon(6, 6.0).extrude(2.4)
    grease_plug = grease_plug.cut(
        cylinder(
            1.0, 1.2, scaled_vector(normal_axis, 7.3),
            normal_axis.toTuple(),
        )
    )
    return spider.union(grease_plug)


# Repeated outer yokes and their retained, splined output stubs.
outer_yoke = make_yoke(
    outer_yoke_length - ear_radius, outer_hub_radius, splined_hub=True
)
outer_end_unit = outer_yoke.union(make_coupling_pin())

left_end_unit = (
    outer_end_unit
    .rotate((0, 0, 0), (0, 1, 0), -left_joint_angle)
    .rotate((0, 0, 0), (1, 0, 0), left_fork_clock)
)
right_end_unit = (
    outer_end_unit
    .rotate((0, 0, 0), (1, 0, 0), 90.0)
    .rotate((0, 0, 0), (0, 0, 1), 180.0 - right_joint_angle)
    .rotate((0, 0, 0), (1, 0, 0), right_fork_clock)
    .translate((right_joint_x, 0, 0))
)

# Integrated long shaft, with exposed fine splines and a smooth central journal.
shaft_spline = spline_section(shaft_start_x, shaft_spline_length)
shaft_spline = shaft_spline.cut(
    cq.Workplane("XY").sphere(articulation_clearance_radius)
)
shaft_spline = shaft_spline.cut(
    cylinder(
        retention_hole_diameter / 2.0, 2.0 * spline_tip_radius + 2.0,
        (adapter_retention_x, 0, -spline_tip_radius - 1.0), (0, 0, 1)
    )
).rotate((0, 0, 0), (1, 0, 0), left_adapter_clock)

shaft_journal = (
    cq.Workplane("YZ", origin=(shaft_journal_start_x, 0, 0))
    .circle(shaft_journal_radius)
    .extrude(shaft_journal_length)
    .faces("<X").edges().fillet(0.8)
)
shaft_journal = shaft_journal.union(
    cylinder(
        shoulder_ring_radius, shoulder_ring_width,
        (shaft_journal_end_x - 4.3, 0, 0),
    )
).union(
    cylinder(
        shoulder_ring_radius, shoulder_ring_width,
        (shaft_journal_end_x - 1.9, 0, 0),
    )
)

integrated_fork = (
    make_yoke(
        integrated_fork_length - ear_radius,
        integrated_hub_radius,
        splined_hub=False,
    )
    .rotate((0, 0, 0), (1, 0, 0), right_fork_clock)
    .translate((right_joint_x, 0, 0))
)
angle_adapter = make_angle_adapter().rotate(
    (0, 0, 0), (1, 0, 0), left_adapter_clock
)

central_member = (
    shaft_spline.union(shaft_journal)
    .union(integrated_fork)
    .union(angle_adapter)
)

# Each spider follows the two actual, perpendicular trunnion axes.
left_angle = math.radians(left_joint_angle)
left_clock = math.radians(left_fork_clock)
left_spider = make_spider(
    (0, math.cos(left_clock), math.sin(left_clock)),
    (
        -math.sin(left_angle),
        -math.sin(left_clock) * math.cos(left_angle),
        math.cos(left_clock) * math.cos(left_angle),
    ),
)

right_angle = math.radians(right_joint_angle)
right_clock = math.radians(right_fork_clock)
right_spider = make_spider(
    (0, -math.sin(right_clock), math.cos(right_clock)),
    (
        math.sin(right_angle),
        math.cos(right_angle) * math.cos(right_clock),
        math.cos(right_angle) * math.sin(right_clock),
    ),
).translate((right_joint_x, 0, 0))

# Slight interference at spline fits and bearing seats unifies the assembly.
result = (
    central_member
    .union(left_spider)
    .union(left_end_unit)
    .union(right_spider)
    .union(right_end_unit)
    .clean()
    .translate((-right_joint_x / 2.0, 0, 0))
    .rotate((0, 0, 0), (0, 1, 0), assembly_pitch)
    .rotate((0, 0, 0), (0, 0, 1), assembly_yaw)
)

bounding_box = result.val().BoundingBox()
result = result.translate((
    -(bounding_box.xmin + bounding_box.xmax) / 2.0,
    -(bounding_box.ymin + bounding_box.ymax) / 2.0,
    -(bounding_box.zmin + bounding_box.zmax) / 2.0,
))