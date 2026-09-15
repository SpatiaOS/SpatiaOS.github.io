// Parameters
blade_thickness = 2.0;
handle_thickness = 7.0;
pivot_bore_diameter = 1.583;
pivot_body_radius = 4.6;
pivot_boss_radius = 2.654;
pivot_boss_height = 0.18;

front_blade_length = 84.4;
rear_blade_length = 80.5;
front_tip_offset = -14.0;
rear_tip_offset = 5.5;
front_blade_bow = -0.8;
rear_blade_bow = 2.0;
blade_root_width = 8.8;
blade_root_drop = 7.5;
blade_tip_width = 0.16;
blade_edge_thickness = 0.15;
blade_bevel_width = 1.35;
blade_taper_power = 1.2;
blade_tip_thickness_ratio = 0.25;

large_loop_center = [12.0, 49.4];
large_loop_size = [23.0, 51.0];
large_loop_opening = [14.2, 40.0];
large_loop_hole_shift = 1.9;
large_loop_angle = -11;

small_loop_center = [-20.5, 40.0];
small_loop_size = [24.0, 38.5];
small_loop_opening = [14.4, 25.0];
small_loop_hole_shift = 1.8;
small_loop_angle = 20;

handle_edge_radius = 1.15;
neck_edge_radius = 0.18;
handle_groove_inset = 1.65;
handle_groove_width = 0.24;
handle_groove_depth = 0.18;
neck_attachment_width_ratio = 0.29;
neck_attachment_height_ratio = -0.32;

fastener_length = 6.0;
shaft_length = 4.0;
shaft_radius = 0.876;
front_head_radius = 2.66;
rear_head_radius = 2.56;
head_edge_chamfer = 0.12;
slot_width = 0.55;
slot_depth = 0.45;
slot_angle = 13;

metal_color = [0.65, 0.66, 0.68];
handle_color = [0.56, 0.57, 0.59];
fastener_color = [0.73, 0.74, 0.76];

curve_steps = 24;
blade_stations = 64;
rounding_fragments = 32;
epsilon = 0.02;
$fn = 96;

$vpr = [80, 0, 65];
$vpt = [0, 0, -4];
$vpd = 460;

// Profile helpers
function bezier(a, b, c, d, t) =
    pow(1-t, 3)*a +
    3*pow(1-t, 2)*t*b +
    3*(1-t)*t*t*c +
    t*t*t*d;

function bezier_path(segments) = [
    for (segment = segments)
        for (i = [0:curve_steps-1])
            bezier(segment[0], segment[1],
                   segment[2], segment[3], i/curve_steps)
];

function placed_point(p, center, angle) = center + [
    p[0]*cos(angle) - p[1]*sin(angle),
    p[0]*sin(angle) + p[1]*cos(angle)
];

module x_extrude(thickness, center_x = 0) {
    translate([center_x-thickness/2, 0, 0])
        rotate([90, 0, 90])
            linear_extrude(height = thickness, convexity = 10)
                children();
}

module rounded_plate(thickness, radius, center_x = 0) {
    minkowski() {
        x_extrude(thickness-2*radius, center_x)
            offset(delta = -radius)
                children();
        sphere(r = radius, $fn = rounding_fragments);
    }
}

module loop_placement(center, angle) {
    translate(center)
        rotate(angle)
            children();
}

module loop_outline(size) {
    scale(size)
        polygon(points = bezier_path([
            [[0, .5], [.29, .5], [.5, .34], [.5, .10]],
            [[.5, .10], [.5, -.20], [.19, -.5], [0, -.5]],
            [[0, -.5], [-.19, -.5], [-.5, -.20], [-.5, .10]],
            [[-.5, .10], [-.5, .34], [-.29, .5], [0, .5]]
        ]));
}

module loop_opening(size, shift) {
    translate([0, shift])
        scale([size[0]/2, size[1]/2])
            circle(r = 1);
}

// Rounded finger loop and shallow molded seam
module finger_loop(center, size, opening, shift, angle, center_x) {
    difference() {
        rounded_plate(handle_thickness, handle_edge_radius, center_x)
            loop_placement(center, angle)
                difference() {
                    loop_outline(size);
                    loop_opening(opening, shift);
                }

        for (face = [-1, 1])
            x_extrude(
                handle_groove_depth + epsilon,
                center_x + face *
                    (handle_thickness/2-handle_groove_depth/2)
            )
                loop_placement(center, angle)
                    difference() {
                        offset(delta = -handle_groove_inset)
                            loop_outline(size);
                        offset(delta = -handle_groove_inset
                                       -handle_groove_width)
                            loop_outline(size);
                    }
    }
}

// Curved handle shank
module neck_profile(center, size, angle) {
    left_attachment = placed_point([
        -size[0]*neck_attachment_width_ratio,
        size[1]*neck_attachment_height_ratio
    ], center, angle);

    right_attachment = placed_point([
        size[0]*neck_attachment_width_ratio,
        size[1]*neck_attachment_height_ratio
    ], center, angle);

    left_root = [-blade_root_width/2, -blade_root_drop];
    right_root = [blade_root_width/2, -blade_root_drop];

    union() {
        circle(r = pivot_body_radius);
        polygon(points = bezier_path([
            [left_root, left_root, right_root, right_root],
            [
                right_root,
                [blade_root_width/2, right_attachment[1]*.30],
                [right_attachment[0], right_attachment[1]*.70],
                right_attachment
            ],
            [
                right_attachment, right_attachment,
                left_attachment, left_attachment
            ],
            [
                left_attachment,
                [left_attachment[0], left_attachment[1]*.70],
                [-blade_root_width/2, left_attachment[1]*.30],
                left_root
            ]
        ]));
    }
}

// Five-sided blade sections form a continuous cutting bevel
function blade_section(t, length, tip_offset, bow, face_sign) =
    let(
        side = -face_sign,
        center_y = tip_offset*t + bow*sin(180*t),
        width = blade_tip_width +
            (blade_root_width-blade_tip_width) *
            (1-pow(t, blade_taper_power)),
        thickness = blade_thickness *
            (1-(1-blade_tip_thickness_ratio)*pow(t, 14)),
        spine_y = center_y + side*width/2,
        edge_y = center_y - side*width/2,
        bevel_y = edge_y + side*min(blade_bevel_width, width*.60),
        z = -blade_root_drop-(length-blade_root_drop)*t,
        edge_x = face_sign*min(blade_edge_thickness, thickness*.5)
    ) [
        [0, spine_y, z],
        [0, edge_y, z],
        [edge_x, edge_y, z],
        [face_sign*thickness, bevel_y, z],
        [face_sign*thickness, spine_y, z]
    ];

module tapered_blade(length, tip_offset, bow, face_sign) {
    sides = 5;

    vertices = [
        for (i = [0:blade_stations])
            each blade_section(
                i/blade_stations, length, tip_offset, bow, face_sign
            )
    ];

    faces = concat(
        [[for (j = [0:sides-1]) j]],
        [[for (j = [sides-1:-1:0]) blade_stations*sides+j]],
        [
            for (i = [0:blade_stations-1])
                for (j = [0:sides-1])
                    let(
                        k = (j+1)%sides,
                        a = i*sides+j,
                        b = (i+1)*sides+j,
                        c = (i+1)*sides+k,
                        d = i*sides+k
                    )
                    each [[a, b, c], [a, c, d]]
        ]
    );

    polyhedron(points = vertices, faces = faces, convexity = 10);
}

// Complete blade-and-handle half
module scissor_half(face_sign, length, tip_offset, bow,
                    center, size, opening, shift, angle,
                    add_boss = false) {
    center_x = face_sign*blade_thickness/2;
    cutter_thickness = 2*(handle_thickness+fastener_length);

    difference() {
        union() {
            color(metal_color)
                union() {
                    tapered_blade(length, tip_offset, bow, face_sign);

                    rounded_plate(
                        blade_thickness, neck_edge_radius, center_x
                    )
                        neck_profile(center, size, angle);

                    if (add_boss)
                        x_extrude(
                            pivot_boss_height + epsilon,
                            face_sign *
                                (blade_thickness+pivot_boss_height/2)
                        )
                            circle(r = pivot_boss_radius);
                }

            color(handle_color)
                finger_loop(
                    center, size, opening, shift, angle, center_x
                );
        }

        x_extrude(cutter_thickness)
            circle(d = pivot_bore_diameter);

        x_extrude(cutter_thickness)
            loop_placement(center, angle)
                loop_opening(opening, shift);
    }
}

// Domed spool heads
module fastener_head(radius, height) {
    rotate_extrude(convexity = 10)
        polygon(points = concat(
            [
                [0, 0],
                [radius-head_edge_chamfer, 0],
                [radius, head_edge_chamfer]
            ],
            [
                for (i = [0:curve_steps])
                    bezier(
                        [radius, height*.42],
                        [radius, height*.85],
                        [radius*.68, height],
                        [0, height],
                        i/curve_steps
                    )
            ]
        ));
}

module slotted_fastener() {
    head_height = (fastener_length-shaft_length)/2;

    color(fastener_color)
        difference() {
            union() {
                rotate([0, 90, 0])
                    cylinder(h = shaft_length, r = shaft_radius,
                             center = true);

                translate([shaft_length/2, 0, 0])
                    rotate([0, 90, 0])
                        fastener_head(front_head_radius, head_height);

                translate([-shaft_length/2, 0, 0])
                    rotate([0, -90, 0])
                        fastener_head(rear_head_radius, head_height);
            }

            rotate([slot_angle, 0, 0])
                x_extrude(
                    slot_depth + epsilon,
                    fastener_length/2-slot_depth/2+epsilon/2
                )
                    square([
                        slot_width,
                        2*front_head_radius+2*epsilon
                    ], center = true);
        }
}

// Unified assembly
union() {
    scissor_half(
        1, front_blade_length, front_tip_offset, front_blade_bow,
        large_loop_center, large_loop_size, large_loop_opening,
        large_loop_hole_shift, large_loop_angle, true
    );

    scissor_half(
        -1, rear_blade_length, rear_tip_offset, rear_blade_bow,
        small_loop_center, small_loop_size, small_loop_opening,
        small_loop_hole_shift, small_loop_angle
    );

    slotted_fastener();
}