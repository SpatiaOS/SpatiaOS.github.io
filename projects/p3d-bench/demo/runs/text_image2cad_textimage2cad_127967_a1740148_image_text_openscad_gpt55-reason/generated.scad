// Parametric OpenSCAD reconstruction of an articulated robotic arm assembly
// Units: millimeters

// -----------------------------
// Global resolution / tolerances
// -----------------------------
eps = 0.05;
$fn = 96;

model_color = [0.68, 0.68, 0.66, 1.0];
logo_font = "Liberation Sans:style=Bold";

// -----------------------------
// Overall pose key points
// -----------------------------
shoulder_center = [95, 0, 245];
elbow_center    = [20, 0, 610];

forearm_origin = [80, 0, 605];
forearm_pitch_deg = 8;        // positive Y rotation lowers +X direction

// -----------------------------
// Housing cap / base parameters
// -----------------------------
base_body_d = 300;
base_lug_outer_d = 390;
base_main_h = 84;
base_boss_h = 20;
base_top_z = base_main_h + base_boss_h;

base_lower_d = 300;
base_lower_h = 64;
base_lip_d = 330;
base_lip_h = 12;
base_deck_d = 260;
base_deck_h = 8;
base_boss_d = 30;

base_lug_count = 12;
base_lug_inner_r = 135;
base_lug_outer_r = 195;
base_lug_width = 42;
base_lug_h = 54;
base_lug_hole_d = 14;
base_lug_hole_depth = 16;
base_lug_hole_r = 171;

turntable_z0 = base_main_h;

// -----------------------------
// Turntable / lower lever parameters
// -----------------------------
turn_step1_d = 250;
turn_step1_h = 18;
turn_step2_d = 180;
turn_step2_h = 16;
turn_step3_d = 137;
turn_step3_h = 28;

gear_ring_d = 96;
gear_ring_h = 12;
gear_tooth_count = 24;
gear_tooth_radius = 55;
gear_tooth_radial = 13;
gear_tooth_tangential = 8;
gear_tooth_h = 12;

spacer_count = 12;
spacer_od = 6.0;
spacer_id = 3.2;
spacer_h = 3.0;
spacer_pattern_r = 88;
spacer_z = turntable_z0 + 45;

lever_web_depth = 105;
lever_web_chamfer = 7;
shoulder_hub_d = 112;
shoulder_hub_len = 122;
shoulder_side_ring_d = 82;
shoulder_side_ring_t = 13;
shoulder_visible_bore_d = 44;

// -----------------------------
// Connecting arm parameters
// -----------------------------
connect_depth = 62;
connect_body_d = 58;
connect_lower_hub_d = 104;
connect_upper_hub_d = 96;
connect_hub_len = 72;
connect_bore_d = 30;

connect_lower_flange_d = 122;
connect_flange_t = 10;
connect_bolt_count = 13;
connect_bolt_circle_r = 45;
connect_bolt_hole_d = 6;
connect_bolt_hole_depth = 10;

connect_logo_plate_w = 42;
connect_logo_plate_h = 22;
connect_logo_plate_t = 2.5;

// -----------------------------
// Elbow joint housing parameters
// -----------------------------
joint_block_size = [132, 124, 112];
joint_block_center = [elbow_center[0] + 20, 0, elbow_center[2] + 34];
joint_block_chamfer = 10;

joint_hub_d = 100;
joint_hub_len = 132;
joint_front_ring_d = 76;
joint_front_ring_t = 12;
joint_bore_d = 44;

joint_arm_d = 62;
joint_arm_bore_d = 44;
joint_arm_len = 116;
joint_flange_d = 96;
joint_flange_t = 16;
joint_bolt_count = 12;
joint_bolt_circle_r = 39;
joint_bolt_hole_d = 3;
joint_bolt_hole_depth = 8;

joint_blind_bore_d = 30;
joint_blind_bore_depth = 20;

// -----------------------------
// Forearm / multi-bore housing parameters
// -----------------------------
forearm_bar_len = 152;
forearm_bar_w = 55;
forearm_bar_h = 50;
forearm_bar_chamfer = 4;

forearm_start_collar_d = 82;
forearm_start_collar_t = 18;
forearm_end_collar_d = 72;
forearm_end_collar_t = 12;

multi_center_x = 240;
multi_len = 173;
multi_depth = 80;
multi_height = 76;
multi_profile_amp = 0.09;
multi_profile_lobes = 5;
multi_profile_pts = 96;

multi_cross_bore_d = 66;
multi_axis_bore_d = 30;
multi_small_bore_d = 18;
multi_boss_d = 30;
multi_boss_len = 22;

multi_bolt_d = 4.5;
multi_counterbore_d = 8;
multi_bolt_depth = 8;
multi_counterbore_depth = 3;

// -----------------------------
// Knob / wrist plug parameters
// -----------------------------
knob_center_x = 340;
knob_head_d = 85;
knob_dome_x_thickness = 48;
knob_shank_d = 40;
knob_shank_len = 24;
knob_square_len = 32;
knob_square_size = 58;
knob_key_chamfer = 5;

// -----------------------------
// Scroll wrist housing parameters
// -----------------------------
scroll_center_x = 404;
scroll_len = 88;
scroll_depth = 70;
scroll_height = 55.4;
scroll_body_chamfer = 6;
scroll_rim_od = 70;
scroll_rim_id = 47;
scroll_rim_t = 14;
scroll_inner_boss_d = 20;
scroll_mount_hole_d = 3;
scroll_mount_hole_x_margin = 8;
scroll_mount_y = 25;
scroll_mount_z = 18;

// -----------------------------
// Gripper parameters
// -----------------------------
gripper_pivot_x = 462;
jaw_thickness = 19.5;
jaw_pivot_boss_d = 30;
jaw_pivot_boss_extra = 7;
jaw_pivot_hole_d = 3;
jaw_slot_d = 12;

clevis_body_len = 38;
clevis_body_d = 40;
clevis_body_w = 44;


// -----------------------------
// Utility functions
// -----------------------------
function vadd(a, b) = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
function vsub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function vlerp(a, b, t) = [
    a[0] * (1 - t) + b[0] * t,
    a[1] * (1 - t) + b[1] * t,
    a[2] * (1 - t) + b[2] * t
];

function lobed_profile(n, rz, ry, amp, lobes) =
    [
        for (i = [0 : n - 1])
            let (
                a = 360 * i / n,
                k = 1 + amp * cos(lobes * a)
            )
            [rz * k * cos(a), ry * k * sin(a)]
    ];


// -----------------------------
// Primitive orientation helpers
// -----------------------------
module xcyl(d, h, center = true) {
    rotate([0, 90, 0])
        cylinder(d = d, h = h, center = center);
}

module ycyl(d, h, center = true) {
    rotate([90, 0, 0])
        cylinder(d = d, h = h, center = center);
}

module ring_z(od, id, h, center = true) {
    difference() {
        cylinder(d = od, h = h, center = center);
        cylinder(d = id, h = h + 2 * eps, center = center);
    }
}

module ring_x(od, id, h, center = true) {
    rotate([0, 90, 0])
        ring_z(od, id, h, center);
}

module ring_y(od, id, h, center = true) {
    rotate([90, 0, 0])
        ring_z(od, id, h, center);
}

module beveled_box(size = [10, 10, 10], c = 1) {
    hull() {
        cube([max(size[0] - 2 * c, eps), max(size[1] - 2 * c, eps), size[2]], center = true);
        cube([size[0], max(size[1] - 2 * c, eps), max(size[2] - 2 * c, eps)], center = true);
        cube([max(size[0] - 2 * c, eps), size[1], max(size[2] - 2 * c, eps)], center = true);
    }
}

module y_extruded_polygon(points, depth) {
    rotate([90, 0, 0])
        linear_extrude(height = depth, center = true, convexity = 10)
            polygon(points = points);
}

module x_extruded_polygon(points, length) {
    rotate([0, 90, 0])
        linear_extrude(height = length, center = true, convexity = 10)
            polygon(points = points);
}

module y_slot_between(p1, p2, d, depth) {
    hull() {
        translate([p1[0], 0, p1[1]])
            ycyl(d = d, h = depth, center = true);
        translate([p2[0], 0, p2[1]])
            ycyl(d = d, h = depth, center = true);
    }
}

module raised_text_on_y_face(txt, pos, size = 12, depth = 1.6) {
    translate(pos)
        rotate([90, 0, 0])
            linear_extrude(height = depth, convexity = 4)
                text(txt, size = size, font = logo_font, halign = "center", valign = "center", spacing = 0.85);
}

module top_text(txt, pos, size = 16, depth = 1.6) {
    translate(pos)
        linear_extrude(height = depth, convexity = 4)
            text(txt, size = size, font = logo_font, halign = "center", valign = "center", spacing = 0.85);
}


// -----------------------------
// Base housing cap
// -----------------------------
module housing_cap() {
    difference() {
        union() {
            translate([0, 0, base_lower_h / 2])
                cylinder(d = base_lower_d, h = base_lower_h, center = true);

            translate([0, 0, base_lower_h + base_lip_h / 2])
                cylinder(d = base_lip_d, h = base_lip_h, center = true);

            translate([0, 0, base_lower_h + base_lip_h + base_deck_h / 2])
                cylinder(d = base_deck_d, h = base_deck_h, center = true);

            translate([0, 0, base_main_h + base_boss_h / 2])
                cylinder(d = base_boss_d, h = base_boss_h, center = true);

            for (i = [0 : base_lug_count - 1]) {
                a = 360 * i / base_lug_count;
                rotate([0, 0, a])
                    translate([(base_lug_inner_r + base_lug_outer_r) / 2, 0, base_lug_h / 2])
                        beveled_box(
                            [
                                base_lug_outer_r - base_lug_inner_r,
                                base_lug_width,
                                base_lug_h
                            ],
                            4
                        );
            }
        }

        // Blind mounting pockets on the radial lugs.
        for (i = [0 : base_lug_count - 1]) {
            a = 360 * i / base_lug_count;
            translate([
                base_lug_hole_r * cos(a),
                base_lug_hole_r * sin(a),
                base_lug_h - base_lug_hole_depth / 2 + eps
            ])
                cylinder(d = base_lug_hole_d, h = base_lug_hole_depth + eps, center = true);
        }
    }
}


// -----------------------------
// Spacer ring cluster on turntable
// -----------------------------
module spacer_ring() {
    ring_z(od = spacer_od, id = spacer_id, h = spacer_h, center = true);
}

module spacer_cluster() {
    for (i = [0 : spacer_count - 1]) {
        a = 360 * i / spacer_count;
        translate([
            spacer_pattern_r * cos(a),
            spacer_pattern_r * sin(a),
            spacer_z
        ])
            spacer_ring();
    }
}


// -----------------------------
// Turntable, shoulder pedestal, and lower hub
// -----------------------------
module gear_teeth() {
    gear_z = turntable_z0 + turn_step1_h + turn_step2_h + turn_step3_h + gear_tooth_h / 2;

    for (i = [0 : gear_tooth_count - 1]) {
        a = 360 * i / gear_tooth_count;
        rotate([0, 0, a])
            translate([gear_tooth_radius, 0, gear_z])
                beveled_box(
                    [gear_tooth_radial, gear_tooth_tangential, gear_tooth_h],
                    1.2
                );
    }
}

module lower_pedestal_web() {
    web_points = [
        [-98, turntable_z0 + 15],
        [ 62, turntable_z0 + 15],
        [150, shoulder_center[2] - 36],
        [136, shoulder_center[2] + 44],
        [ 76, shoulder_center[2] + 66],
        [  5, turntable_z0 + 72],
        [-98, turntable_z0 + 54]
    ];

    y_extruded_polygon(web_points, lever_web_depth);
}

module lever_arm_with_bevel_gear() {
    difference() {
        union() {
            translate([0, 0, turntable_z0 + turn_step1_h / 2])
                cylinder(d = turn_step1_d, h = turn_step1_h, center = true);

            translate([0, 0, turntable_z0 + turn_step1_h + turn_step2_h / 2])
                cylinder(d = turn_step2_d, h = turn_step2_h, center = true);

            translate([0, 0, turntable_z0 + turn_step1_h + turn_step2_h + turn_step3_h / 2])
                cylinder(d = turn_step3_d, h = turn_step3_h, center = true);

            translate([0, 0, turntable_z0 + turn_step1_h + turn_step2_h + turn_step3_h + gear_ring_h / 2])
                cylinder(d = gear_ring_d, h = gear_ring_h, center = true);

            gear_teeth();

            lower_pedestal_web();

            translate(shoulder_center)
                ycyl(d = shoulder_hub_d, h = shoulder_hub_len, center = true);

            translate([shoulder_center[0], -shoulder_hub_len / 2 - shoulder_side_ring_t / 2, shoulder_center[2]])
                ycyl(d = shoulder_side_ring_d, h = shoulder_side_ring_t, center = true);

            translate([shoulder_center[0], shoulder_hub_len / 2 + shoulder_side_ring_t / 2, shoulder_center[2]])
                ycyl(d = shoulder_side_ring_d, h = shoulder_side_ring_t, center = true);

            translate([42, 0, turntable_z0 + 74])
                beveled_box([85, 82, 52], lever_web_chamfer);
        }

        translate(shoulder_center)
            ycyl(d = shoulder_visible_bore_d, h = shoulder_hub_len + 2 * shoulder_side_ring_t + 8, center = true);

        // Representative blind pin seats in the shoulder housing.
        translate([shoulder_center[0] + 14, -lever_web_depth / 2 + joint_blind_bore_depth / 2, shoulder_center[2] + 16])
            ycyl(d = joint_blind_bore_d, h = joint_blind_bore_depth + eps, center = true);

        translate([shoulder_center[0] + 16, 0, shoulder_center[2] + shoulder_hub_d / 2 - joint_blind_bore_depth / 2])
            cylinder(d = joint_blind_bore_d, h = joint_blind_bore_depth + eps, center = true);
    }
}


// -----------------------------
// Curved connecting arm with hub bolt circle
// -----------------------------
module curved_y_link(points, diameters, depth) {
    union() {
        for (i = [0 : len(points) - 2]) {
            hull() {
                translate(points[i])
                    ycyl(d = diameters[i], h = depth, center = true);
                translate(points[i + 1])
                    ycyl(d = diameters[i + 1], h = depth, center = true);
            }
        }
    }
}

module connecting_arm_logos() {
    face_y = -connect_depth / 2 - connect_logo_plate_t / 2;

    for (t = [0.30, 0.48, 0.66]) {
        p = vlerp(shoulder_center, elbow_center, t);

        translate([p[0] + 6, face_y, p[2]])
            beveled_box(
                [connect_logo_plate_w, connect_logo_plate_t, connect_logo_plate_h],
                1.2
            );

        raised_text_on_y_face(
            "ABB",
            [p[0] + 6, face_y - connect_logo_plate_t / 2 - 0.05, p[2] - 1],
            11,
            1.2
        );
    }
}

module connecting_arm() {
    mid1 = [72, 0, 370];
    mid2 = [42, 0, 505];

    difference() {
        union() {
            curved_y_link(
                [shoulder_center, mid1, mid2, elbow_center],
                [connect_body_d, connect_body_d * 0.92, connect_body_d * 0.95, connect_body_d],
                connect_depth
            );

            translate(shoulder_center)
                ycyl(d = connect_lower_hub_d, h = connect_hub_len, center = true);

            translate(elbow_center)
                ycyl(d = connect_upper_hub_d, h = connect_hub_len, center = true);

            translate([shoulder_center[0], -connect_hub_len / 2 - connect_flange_t / 2, shoulder_center[2]])
                ycyl(d = connect_lower_flange_d, h = connect_flange_t, center = true);

            translate([elbow_center[0], -connect_hub_len / 2 - connect_flange_t / 2, elbow_center[2]])
                ycyl(d = connect_upper_hub_d + 12, h = connect_flange_t, center = true);

            connecting_arm_logos();
        }

        translate(shoulder_center)
            ycyl(d = connect_bore_d, h = connect_hub_len + 2 * connect_flange_t + 8, center = true);

        translate(elbow_center)
            ycyl(d = connect_bore_d, h = connect_hub_len + 2 * connect_flange_t + 8, center = true);

        // Thirteen blind bolt holes on the lower front flange.
        for (i = [0 : connect_bolt_count - 1]) {
            a = 360 * i / connect_bolt_count;
            translate([
                shoulder_center[0] + connect_bolt_circle_r * cos(a),
                -connect_hub_len / 2 - connect_flange_t + connect_bolt_hole_depth / 2,
                shoulder_center[2] + connect_bolt_circle_r * sin(a)
            ])
                ycyl(d = connect_bolt_hole_d, h = connect_bolt_hole_depth + eps, center = true);
        }
    }
}


// -----------------------------
// Elbow joint housing
// -----------------------------
module elbow_bolt_circle_x(xface, inward_sign) {
    for (i = [0 : joint_bolt_count - 1]) {
        a = 360 * i / joint_bolt_count;
        translate([
            xface + inward_sign * joint_bolt_hole_depth / 2,
            joint_bolt_circle_r * cos(a),
            joint_bolt_circle_r * sin(a)
        ])
            xcyl(d = joint_bolt_hole_d, h = joint_bolt_hole_depth + eps, center = true);
    }
}

module joint_housing() {
    difference() {
        union() {
            translate(joint_block_center)
                beveled_box(joint_block_size, joint_block_chamfer);

            translate(elbow_center)
                ycyl(d = joint_hub_d, h = joint_hub_len, center = true);

            translate([elbow_center[0], -joint_hub_len / 2 - joint_front_ring_t / 2, elbow_center[2]])
                ycyl(d = joint_front_ring_d, h = joint_front_ring_t, center = true);

            translate([elbow_center[0], joint_hub_len / 2 + joint_front_ring_t / 2, elbow_center[2]])
                ycyl(d = joint_front_ring_d, h = joint_front_ring_t, center = true);

            translate(forearm_origin)
                rotate([0, forearm_pitch_deg, 0]) {
                    translate([-joint_arm_len / 2 + 8, 0, 0])
                        xcyl(d = joint_arm_d, h = joint_arm_len, center = true);

                    translate([0, 0, 0])
                        ring_x(od = joint_flange_d, id = joint_arm_bore_d, h = joint_flange_t, center = true);
                }

            top_text(
                "ABB",
                [joint_block_center[0] - 8, -18, joint_block_center[2] + joint_block_size[2] / 2 + 0.4],
                23,
                1.8
            );
        }

        translate(elbow_center)
            ycyl(d = joint_bore_d, h = joint_hub_len + 2 * joint_front_ring_t + 10, center = true);

        translate(forearm_origin)
            rotate([0, forearm_pitch_deg, 0]) {
                translate([-joint_arm_len / 2 + 8, 0, 0])
                    xcyl(d = joint_arm_bore_d, h = joint_arm_len + 8, center = true);

                elbow_bolt_circle_x(joint_flange_t / 2, -1);
            }

        // Perpendicular blind bores on block faces.
        translate([joint_block_center[0] - 18, -joint_block_size[1] / 2 + joint_blind_bore_depth / 2, joint_block_center[2] + 6])
            ycyl(d = joint_blind_bore_d, h = joint_blind_bore_depth + eps, center = true);

        translate([joint_block_center[0] + 22, 0, joint_block_center[2] + joint_block_size[2] / 2 - joint_blind_bore_depth / 2])
            cylinder(d = joint_blind_bore_d, h = joint_blind_bore_depth + eps, center = true);
    }
}


// -----------------------------
// Multi-bore forearm housing
// -----------------------------
module multi_bolt_hole_y(x, z, side_sign) {
    yface = side_sign * multi_depth / 2;

    translate([x, yface - side_sign * multi_counterbore_depth / 2, z])
        ycyl(d = multi_counterbore_d, h = multi_counterbore_depth + eps, center = true);

    translate([x, yface - side_sign * multi_bolt_depth / 2, z])
        ycyl(d = multi_bolt_d, h = multi_bolt_depth + eps, center = true);
}

module multi_bore_housing() {
    difference() {
        union() {
            x_extruded_polygon(
                lobed_profile(
                    multi_profile_pts,
                    multi_height / 2,
                    multi_depth / 2,
                    multi_profile_amp,
                    multi_profile_lobes
                ),
                multi_len
            );

            translate([-multi_len / 2 - 6, 0, 0])
                ring_x(od = 78, id = multi_axis_bore_d, h = 12, center = true);

            translate([multi_len / 2 + multi_boss_len / 2, 0, 0])
                xcyl(d = multi_boss_d, h = multi_boss_len, center = true);
        }

        // Large cross-bore visible through the side faces.
        translate([0, 0, 0])
            ycyl(d = multi_cross_bore_d, h = multi_depth + 12, center = true);

        // Main longitudinal bore and smaller auxiliary bores.
        xcyl(d = multi_axis_bore_d, h = multi_len + multi_boss_len + 20, center = true);

        translate([0, 25, 0])
            xcyl(d = multi_small_bore_d, h = multi_len + 8, center = true);

        translate([0, -25, 0])
            xcyl(d = multi_small_bore_d, h = multi_len + 8, center = true);

        translate([0, 0, 24])
            xcyl(d = multi_small_bore_d, h = multi_len + 8, center = true);

        translate([0, 0, -24])
            xcyl(d = multi_small_bore_d, h = multi_len + 8, center = true);

        // Perimeter counterbored positions on front and rear side faces.
        for (side = [-1, 1]) {
            for (x = [-72, -48, -24, 0, 24, 48, 72]) {
                multi_bolt_hole_y(x, 30, side);
                multi_bolt_hole_y(x, -30, side);
            }

            for (x = [-84, 84]) {
                multi_bolt_hole_y(x, 0, side);
            }
        }
    }
}


// -----------------------------
// Knob / stepped plug
// -----------------------------
module knob_plug() {
    difference() {
        union() {
            translate([-knob_shank_len / 2 - knob_square_len / 2, 0, 0])
                beveled_box([knob_square_len, knob_square_size, knob_square_size], knob_key_chamfer);

            translate([-knob_shank_len / 2, 0, 0])
                xcyl(d = knob_shank_d, h = knob_shank_len, center = true);

            translate([knob_dome_x_thickness / 2, 0, 0])
                scale([knob_dome_x_thickness / knob_head_d, 1, 1])
                    sphere(d = knob_head_d);

            translate([5, 0, 0])
                xcyl(d = knob_head_d * 0.92, h = 5, center = true);
        }

        // Narrow circular shoulder groove.
        translate([7, 0, 0])
            ring_x(od = knob_head_d + 2, id = knob_head_d * 0.88, h = 5.2, center = true);
    }
}


// -----------------------------
// Scroll wrist housing
// -----------------------------
module scroll_housing() {
    difference() {
        union() {
            translate([0, 0, 0])
                beveled_box([scroll_len, scroll_depth, scroll_height], scroll_body_chamfer);

            translate([scroll_len / 2 - scroll_rim_t / 2, 0, 0])
                ring_x(od = scroll_rim_od, id = scroll_rim_id, h = scroll_rim_t, center = true);

            translate([scroll_len / 2 - scroll_rim_t / 2 - 3, 0, 0])
                xcyl(d = scroll_inner_boss_d, h = scroll_rim_t + 4, center = true);

            translate([-scroll_len / 2 + 14, 0, scroll_height / 2 + 7])
                beveled_box([34, scroll_depth * 0.72, 14], 3);

            translate([-scroll_len / 2 + 14, 0, -scroll_height / 2 - 7])
                beveled_box([34, scroll_depth * 0.72, 14], 3);
        }

        // Circular front cavity.
        translate([scroll_len / 2 - scroll_rim_t / 2, 0, 0])
            xcyl(d = scroll_rim_id, h = scroll_rim_t + 2, center = true);

        // Four mounting holes through the angular rear body.
        for (sy = [-1, 1]) {
            for (sz = [-1, 1]) {
                translate([
                    -scroll_len / 2 + scroll_mount_hole_x_margin,
                    sy * scroll_mount_y,
                    sz * scroll_mount_z
                ])
                    xcyl(d = scroll_mount_hole_d, h = scroll_len + 4, center = true);
            }
        }

        // Rear blind locating bore.
        translate([-scroll_len / 2 + 8, 0, 0])
            xcyl(d = 20, h = 18, center = true);
    }
}


// -----------------------------
// Gripper jaws and wrist clevis
// -----------------------------
module gripper_jaw_upper() {
    jaw_points = [
        [-12, -10],
        [ -8,  14],
        [ 14,  28],
        [ 54,  34],
        [ 92,  51],
        [122,  41],
        [128,  28],
        [113,  24],
        [126,  19],
        [111,  17],
        [123,  12],
        [108,  10],
        [118,   5],
        [ 95,   3],
        [ 64,  -6],
        [ 30, -18],
        [  0, -16]
    ];

    difference() {
        union() {
            y_extruded_polygon(jaw_points, jaw_thickness);

            translate([0, 0, 0])
                ycyl(d = jaw_pivot_boss_d, h = jaw_thickness + jaw_pivot_boss_extra, center = true);

            translate([24, 0, 4])
                ycyl(d = 16, h = jaw_thickness + 2, center = true);
        }

        translate([0, 0, 0])
            ycyl(d = jaw_pivot_hole_d, h = jaw_thickness + jaw_pivot_boss_extra + 6, center = true);

        y_slot_between([26, -2], [53, 10], jaw_slot_d, jaw_thickness + 5);
        y_slot_between([62, 10], [93, 21], jaw_slot_d, jaw_thickness + 5);
    }
}

module gripper_clevis() {
    difference() {
        union() {
            translate([-clevis_body_len / 2, 0, 0])
                xcyl(d = clevis_body_d, h = clevis_body_len, center = true);

            translate([0, 0, 0])
                ycyl(d = clevis_body_d, h = clevis_body_w, center = true);

            translate([-22, 0, 0])
                beveled_box([28, clevis_body_w, 34], 4);
        }

        translate([0, 0, 0])
            ycyl(d = jaw_pivot_hole_d, h = clevis_body_w + 10, center = true);
    }
}

module gripper_pair() {
    translate([gripper_pivot_x, 0, 0]) {
        gripper_clevis();

        gripper_jaw_upper();

        mirror([0, 0, 1])
            gripper_jaw_upper();
    }
}


// -----------------------------
// Forearm assembly in local +X coordinates
// -----------------------------
module forearm_bar() {
    difference() {
        union() {
            translate([forearm_bar_len / 2, 0, 0])
                beveled_box([forearm_bar_len, forearm_bar_w, forearm_bar_h], forearm_bar_chamfer);

            translate([0, 0, 0])
                ring_x(od = forearm_start_collar_d, id = joint_arm_bore_d, h = forearm_start_collar_t, center = true);

            translate([forearm_bar_len, 0, 0])
                ring_x(od = forearm_end_collar_d, id = multi_axis_bore_d, h = forearm_end_collar_t, center = true);
        }

        xcyl(d = 22, h = forearm_bar_len + 20, center = true);
    }
}

module forearm_assembly() {
    union() {
        forearm_bar();

        translate([multi_center_x, 0, 0])
            multi_bore_housing();

        translate([knob_center_x, 0, 0])
            knob_plug();

        translate([scroll_center_x, 0, 0])
            scroll_housing();

        gripper_pair();
    }
}

module forearm_pose() {
    translate(forearm_origin)
        rotate([0, forearm_pitch_deg, 0])
            children();
}


// -----------------------------
// Final unified robot arm model
// -----------------------------
module global_clearance_cuts() {
    translate(shoulder_center)
        ycyl(d = shoulder_visible_bore_d, h = base_lug_outer_d + 80, center = true);

    translate(elbow_center)
        ycyl(d = joint_bore_d, h = base_lug_outer_d + 80, center = true);

    forearm_pose() {
        translate([gripper_pivot_x, 0, 0])
            ycyl(d = jaw_pivot_hole_d, h = clevis_body_w + jaw_thickness + 20, center = true);
    }
}

module robot_arm_assembly() {
    color(model_color)
        difference() {
            union() {
                housing_cap();
                lever_arm_with_bevel_gear();
                spacer_cluster();
                connecting_arm();
                joint_housing();

                forearm_pose()
                    forearm_assembly();
            }

            global_clearance_cuts();
        }
}

robot_arm_assembly();