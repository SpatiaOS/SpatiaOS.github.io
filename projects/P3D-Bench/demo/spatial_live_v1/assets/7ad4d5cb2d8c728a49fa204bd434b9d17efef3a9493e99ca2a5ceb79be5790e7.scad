// Parameters, mm
$fn = 96;
epsilon = 0.04;
fit_overlap = 0.07;

joint_spacing = 208;
left_joint_angle = 35;
right_joint_angle = 20;
assembly_tilt = 9;
assembly_azimuth = -3.4;
assembly_roll = -35;

yoke_length = 56.8;
yoke_width = 41.4;
yoke_height = 23.4;
ear_thickness = 5.8;
ear_radius = yoke_height / 2;
web_setback = 29;
web_thickness = 9;
web_corner_radius = 2;
hub_front_setback = 28.5;
hub_diameter = 25.4;

pivot_diameter = 8;
web_hole_diameter = 6.78;
web_counterbore_diameter = 17.37;
web_counterbore_depth = 2;
bore_mouth_diameter = 19.48;
bore_chamfer = 1.5;

spline_teeth = 36;
spline_root_radius = 8.24;
spline_tip_radius = 8.62;

coupling_pin_length = 75;
coupling_spline_length = 21.5;
journal_diameter = 20;
journal_chamfer = 0.8;
retention_hole_diameter = 6;
retention_end_offset = 8;
retention_inner_offset = 13;

angle_joint_length = 72;
clamp_length = 23;
clamp_diameter = 30;
clamp_end_chamfer = 2;
clamp_slot_width = 0.9;
clamp_slot_bridge = 5;

shaft_radius = 11.08;
shaft_smooth_length = 78;
shaft_nose_chamfer = 2;
shaft_spline_engagement = 28;
shaft_internal_overlap = 24;
collar_length = 4.2;
collar_diameter = 25.8;
collar_groove_width = 0.65;
collar_groove_depth = 0.8;
collar_groove_positions = [1.1, 2.8];

spider_body_length = 13;
spider_body_diameter = 18;
spider_boss_diameter = 13.5;
spider_boss_length = 28;
bearing_flange_diameter = 14.2;
bearing_cap_diameter = 11.8;
bearing_embed = 0.65;
bearing_flange_height = 0.95;
bearing_cap_height = 1.35;
bearing_recess_diameter = 8.2;
bearing_recess_depth = 0.45;
pivot_extension = 0.5;

locating_pin_length = 1.15;
locating_pin_width = 0.009;
locating_pin_height = 0.013;
locating_pin_inset = 1;

yoke_color = [0.64, 0.65, 0.67];
shaft_color = [0.70, 0.71, 0.73];
spline_color = [0.075, 0.08, 0.09];
spider_color = [0.48, 0.50, 0.52];
cap_color = [0.76, 0.77, 0.79];

// Derived dimensions
left_pivot = -joint_spacing / 2;
right_pivot = joint_spacing / 2;
hub_tail = ear_radius - yoke_length;
angle_hub_tail = ear_radius - angle_joint_length;
web_front = -web_setback + web_thickness / 2;
journal_length = coupling_pin_length - coupling_spline_length;
ear_center = (yoke_width - ear_thickness) / 2;
tube_end = right_pivot - hub_front_setback;
tube_start = tube_end - shaft_smooth_length;
left_socket_end = left_pivot - angle_hub_tail;
shaft_spline_start = left_socket_end - shaft_spline_engagement;

// Axial primitives
module cylinder_x(h, d, center = false) {
    rotate([0, 90, 0])
        cylinder(h = h, d = d, center = center);
}

module taper_x(h, d1, d2, fragments = $fn) {
    rotate([0, 90, 0])
        cylinder(h = h, d1 = d1, d2 = d2, $fn = fragments);
}

module cylinder_y(h, d, center = true) {
    rotate([90, 0, 0])
        cylinder(h = h, d = d, center = center);
}

function spline_profile(root, tip) = [
    for (i = [0 : spline_teeth - 1], j = [0 : 3])
        let(
            fraction = [0.12, 0.30, 0.70, 0.88][j],
            angle = 360 * (i + fraction) / spline_teeth,
            radius = (j == 0 || j == 3) ? root : tip
        )
        [radius * cos(angle), radius * sin(angle)]
];

module spline_x(h, overlap = 0) {
    rotate([0, 90, 0])
        linear_extrude(height = h, convexity = 10)
            polygon(spline_profile(
                spline_root_radius + overlap,
                spline_tip_radius + overlap
            ));
}

module rounded_web() {
    translate([-web_setback, 0, 0])
        rotate([0, 90, 0])
            linear_extrude(height = web_thickness, center = true)
                offset(r = web_corner_radius)
                    square([
                        yoke_height - 2 * web_corner_radius,
                        yoke_width - 2 * web_corner_radius
                    ], center = true);
}

// Fork ears
module ear_profile() {
    hull() {
        circle(r = ear_radius);
        translate([
            -web_setback - web_thickness / 2,
            -ear_radius
        ])
            square([web_thickness, yoke_height]);
    }
}

module fork_ears() {
    for (side = [-1, 1])
        translate([0, side * ear_center, 0])
            rotate([90, 0, 0])
                linear_extrude(height = ear_thickness, center = true)
                    ear_profile();
}

module web_holes() {
    translate([-web_setback, 0, 0])
        cylinder_y(yoke_width + 2 * epsilon, web_hole_diameter);

    translate([-web_setback, 0, -yoke_height / 2 - epsilon])
        cylinder(
            h = web_counterbore_depth + epsilon,
            d = web_counterbore_diameter
        );
}

// Serrated clamp
module clamp_hub(tail) {
    translate([tail, 0, 0])
        rotate([30, 0, 0])
            union() {
                taper_x(
                    clamp_end_chamfer,
                    clamp_diameter - 2 * clamp_end_chamfer,
                    clamp_diameter,
                    6
                );
                translate([clamp_end_chamfer, 0, 0])
                    taper_x(
                        clamp_length - 2 * clamp_end_chamfer,
                        clamp_diameter,
                        clamp_diameter,
                        6
                    );
                translate([clamp_length - clamp_end_chamfer, 0, 0])
                    taper_x(
                        clamp_end_chamfer,
                        clamp_diameter,
                        hub_diameter,
                        6
                    );
            }
}

module yoke(length = yoke_length, clamped = false) {
    tail = ear_radius - length;

    difference() {
        union() {
            fork_ears();
            rounded_web();
            translate([tail, 0, 0])
                cylinder_x(-hub_front_setback - tail, hub_diameter);
            if (clamped)
                clamp_hub(tail);
        }

        cylinder_y(yoke_width + 2 * epsilon, pivot_diameter);

        translate([tail - epsilon, 0, 0])
            spline_x(web_front - tail + 2 * epsilon);

        translate([tail - epsilon, 0, 0])
            taper_x(
                bore_chamfer + epsilon,
                bore_mouth_diameter,
                2 * spline_tip_radius
            );

        translate([web_front - bore_chamfer, 0, 0])
            taper_x(
                bore_chamfer + epsilon,
                2 * spline_tip_radius,
                bore_mouth_diameter
            );

        web_holes();

        if (clamped)
            translate([
                tail - epsilon,
                0,
                -clamp_slot_width / 2
            ])
                cube([
                    clamp_length - clamp_slot_bridge + epsilon,
                    clamp_diameter,
                    clamp_slot_width
                ]);
    }
}

// Outer splined journals
module coupling_pin() {
    journal_start = hub_tail - journal_length;

    difference() {
        union() {
            translate([hub_tail - epsilon, 0, 0])
                spline_x(
                    coupling_spline_length + epsilon,
                    fit_overlap
                );

            translate([journal_start, 0, 0])
                taper_x(
                    journal_chamfer,
                    journal_diameter - 2 * journal_chamfer,
                    journal_diameter
                );

            translate([journal_start + journal_chamfer, 0, 0])
                cylinder_x(
                    journal_length - journal_chamfer + epsilon,
                    journal_diameter
                );
        }

        translate([journal_start + retention_end_offset, 0, 0])
            cylinder(
                h = journal_diameter + 2 * epsilon,
                d = retention_hole_diameter,
                center = true
            );

        translate([hub_tail - retention_inner_offset, 0, 0])
            cylinder_y(
                journal_diameter + 2 * epsilon,
                retention_hole_diameter
            );
    }
}

module outer_end() {
    difference() {
        union() {
            color(yoke_color) yoke();
            color(shaft_color) coupling_pin();
        }
        web_holes();
    }
}

// Spider and bearing caps
module bearing_cap() {
    cap_base = yoke_width / 2 - bearing_embed;
    cap_top = cap_base + bearing_flange_height + bearing_cap_height;

    difference() {
        union() {
            translate([0, 0, cap_base])
                cylinder(
                    h = bearing_flange_height,
                    d = bearing_flange_diameter
                );
            translate([
                0, 0,
                cap_base + bearing_flange_height - epsilon
            ])
                cylinder(
                    h = bearing_cap_height + epsilon,
                    d = bearing_cap_diameter
                );
        }
        translate([0, 0, cap_top - bearing_recess_depth])
            cylinder(
                h = bearing_recess_depth + epsilon,
                d = bearing_recess_diameter
            );
    }
}

module spider() {
    union() {
        color(spider_color)
            union() {
                rotate([22.5, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(
                            h = spider_body_length,
                            d = spider_body_diameter,
                            center = true,
                            $fn = 8
                        );

                cylinder_y(spider_boss_length, spider_boss_diameter);
                cylinder(
                    h = spider_boss_length,
                    d = spider_boss_diameter,
                    center = true
                );

                cylinder_y(
                    yoke_width + 2 * pivot_extension,
                    pivot_diameter + 2 * fit_overlap
                );
                cylinder(
                    h = yoke_width + 2 * pivot_extension,
                    d = pivot_diameter + 2 * fit_overlap,
                    center = true
                );
            }

        color(cap_color)
            for (axis_angle = [0, 90])
                rotate([axis_angle, 0, 0])
                    for (side_angle = [0, 180])
                        rotate([side_angle, 0, 0])
                            bearing_cap();
    }
}

// Telescoping shaft
module shaft_collar() {
    difference() {
        cylinder_x(collar_length, collar_diameter);

        for (position = collar_groove_positions)
            translate([position, 0, 0])
                difference() {
                    cylinder_x(
                        collar_groove_width,
                        collar_diameter + 2 * epsilon
                    );
                    translate([-epsilon, 0, 0])
                        cylinder_x(
                            collar_groove_width + 2 * epsilon,
                            collar_diameter - 2 * collar_groove_depth
                        );
                }
    }
}

module central_shaft() {
    color(spline_color)
        translate([shaft_spline_start, 0, 0])
            spline_x(
                tube_start + shaft_internal_overlap - shaft_spline_start,
                fit_overlap
            );

    color(shaft_color)
        union() {
            translate([tube_start, 0, 0])
                taper_x(
                    shaft_nose_chamfer,
                    2 * shaft_radius - shaft_nose_chamfer,
                    2 * shaft_radius
                );
            translate([tube_start + shaft_nose_chamfer, 0, 0])
                cylinder_x(
                    shaft_smooth_length - shaft_nose_chamfer,
                    2 * shaft_radius
                );
            translate([
                right_pivot + hub_tail - collar_length + epsilon,
                0, 0
            ])
                shaft_collar();
        }
}

module locating_pin() {
    translate([
        right_pivot - web_setback,
        0,
        yoke_height / 2 - locating_pin_inset
    ])
        rotate([0, 90, 0])
            linear_extrude(height = locating_pin_length)
                polygon([
                    [-locating_pin_width / 2, -locating_pin_height / 2],
                    [ locating_pin_width / 2, -locating_pin_height / 2],
                    [0, locating_pin_height / 2]
                ]);
}

// Unified assembly
module assembly() {
    union() {
        central_shaft();

        translate([left_pivot, 0, 0]) {
            color(yoke_color)
                rotate([0, 180, 0])
                    rotate([90, 0, 0])
                        yoke(angle_joint_length, true);

            rotate([0, left_joint_angle, 0])
                outer_end();

            spider();
        }

        translate([right_pivot, 0, 0]) {
            color(yoke_color)
                rotate([90, 0, 0])
                    yoke();

            rotate([0, 180 + right_joint_angle, 0])
                outer_end();

            spider();
        }

        color(shaft_color) locating_pin();
    }
}

rotate([0, 0, assembly_azimuth])
    rotate([0, assembly_tilt, 0])
        rotate([assembly_roll, 0, 0])
            assembly();