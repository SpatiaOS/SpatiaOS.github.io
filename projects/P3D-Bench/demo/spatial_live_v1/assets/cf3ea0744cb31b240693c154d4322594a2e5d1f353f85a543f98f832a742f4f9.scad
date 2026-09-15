// Estimated dimensions, millimeters
$fn = 80;
eps = 0.05;

// Mounting base
base_w = 80;
base_d = 108;
base_h = 18;
corner_cut = 13;
ear_w = 24;
ear_d = 22;
ear_h = 5;
ear_chamfer = 3;
mount_hole_d = 3.2;
mount_hole_spacing = 6;
base_notch_w = 15;
base_notch_d = 9;
base_notch_depth = 4;
panel_w = 17;
panel_h = 10;
panel_projection = 1.2;
panel_border = 0.8;
screw_d = 2.6;
screw_projection = 1.1;

// Rotary pedestal
turret_y = 6;
turret_d = 55;
turret_h = 18;
turret_flange_d = 61;
turret_band_h = 2.5;
pedestal_w = 43;
pedestal_d = 48;

// Shoulder and output shaft
shoulder_y = 0;
shoulder_z = 65;
shoulder_d = 50;
shoulder_core_d = 38;
shoulder_core_w = 43;
wheel_x = 19;
wheel_depth = 14;
wheel_groove = 0.8;
rear_cover_h = 5;
shaft_length = 29;
shaft_size = 13;
shaft_chamfer = 1.6;
shaft_cap_size = 16;
shaft_cap_h = 4;
shaft_socket_d = 8;
shaft_bolt_d = 6.5;
shaft_socket_depth = 1.5;

// Faceted main arm
arm_w = 29;
arm_top_y = -34;
arm_top_z = 136;
arm_chamfer = 1.1;
arm_slice = 0.8;
seam_width = 0.45;
seam_depth = 0.45;
arm_stations = [
    [shoulder_y, shoulder_z, 25, arm_w],
    [-10, 85, 28, arm_w + 3],
    [-25, 113, 22, arm_w],
    [arm_top_y, arm_top_z, 17, arm_w - 3]
];

// Rear parallel link and wrist
rear_link_x = -20;
rear_link_thickness = 7;
rear_link_width = 8;
rear_link_bottom_y = 18;
rear_link_bottom_z = 69;
rear_link_bend_y = 23;
rear_link_bend_z = 97;
wrist_y = -7;
wrist_z = 142;
wrist_pin_d = 11;
wrist_pin_length = 46;
wrist_cheek_thickness = 5;
wrist_cheek_radius = 4;
saddle_length = 20;
saddle_d = 29;
saddle_block_h = 12;

// Horizontal cylindrical tool
barrel_z = 154;
barrel_d = 22;
barrel_length = 78;
barrel_rear_y = -18;
barrel_front_y = barrel_rear_y - barrel_length;
front_collar_length = 20;
front_flange_d = 33;
rear_collar_length = 12;
rear_flange_d = 32;
rear_cap_length = 5;
nozzle_length = 13;
nozzle_base_d = 18;
nozzle_tip_d = 8;

// Tool jaws and rear terminals
jaw_length = 13;
jaw_height = 9;
jaw_thickness = 3.5;
jaw_spacing = 12;
jaw_chamfer = 2;
jaw_bridge_length = 4;
jaw_bridge_w = 16;
tool_stem_d = 7;
tool_stem_length = 18;
tool_tip_d = 9;
tool_tip_length = 3;
tool_bore_d = 3.8;
tool_bore_depth = 5;
rib_count = 4;
rib_pitch = 1.25;
rib_width = 0.6;
rib_d = 12;
terminal_spacing = 15;
terminal_w = 8;
terminal_h = 10;
terminal_length = 13;
terminal_chamfer = 1.2;
terminal_band_h = 1.2;

// Derived positions
front_collar_start = barrel_front_y - 0.3 * front_collar_length;
rear_collar_start = barrel_rear_y - 5;
rear_cap_start = rear_collar_start + rear_collar_length;
nozzle_start = front_collar_start - nozzle_length;
tool_tip_y = nozzle_start - tool_stem_length + 1;
shaft_start = wheel_x + wheel_depth - eps;
shaft_end = shaft_start + shaft_length;
pedestal_bottom = base_h + turret_h - 5;

// Chamfered profiles
module chamfered_rectangle(w, d, c) {
    polygon([
        [-w/2+c, -d/2], [w/2-c, -d/2],
        [w/2, -d/2+c], [w/2, d/2-c],
        [w/2-c, d/2], [-w/2+c, d/2],
        [-w/2, d/2-c], [-w/2, -d/2+c]
    ]);
}

module prism_x(points, width, x = 0) {
    translate([x, 0, 0])
        rotate([90, 0, 90])
            linear_extrude(height = width, center = true, convexity = 10)
                polygon(points);
}

module cylinder_x(x, y, z, length, d1, d2 = undef, facets = $fn) {
    translate([x, y, z])
        rotate([0, 90, 0])
            cylinder(h = length, d1 = d1,
                     d2 = is_undef(d2) ? d1 : d2, $fn = facets);
}

module cylinder_y(y, z, length, d1, d2 = undef, x = 0) {
    translate([x, y, z])
        rotate([-90, 0, 0])
            cylinder(h = length, d1 = d1,
                     d2 = is_undef(d2) ? d1 : d2);
}

module chamfered_block_x(x, y, z, length, w, h, c) {
    translate([x, y, z])
        rotate([90, 0, 90])
            linear_extrude(height = length)
                chamfered_rectangle(w, h, c);
}

module chamfered_block_y(x, y, z, length, w, h, c) {
    translate([x, y, z])
        rotate([-90, 0, 0])
            linear_extrude(height = length)
                chamfered_rectangle(w, h, c);
}

// Axial stations: [distance, diameter]
module turned_y(stations, y, z) {
    translate([0, y, z])
        rotate([-90, 0, 0])
            rotate_extrude(convexity = 10)
                polygon(concat(
                    [[0, stations[0][0]]],
                    [for (p = stations) [p[1]/2, p[0]]],
                    [[0, stations[len(stations)-1][0]]]
                ));
}

// Stepped base with low mounting ears
module mounting_base() {
    difference() {
        union() {
            difference() {
                linear_extrude(height = base_h)
                    chamfered_rectangle(base_w, base_d, ear_chamfer);

                for (sx = [-1, 1], sy = [-1, 1])
                    translate([
                        sx * base_w/2,
                        sy * base_d/2,
                        base_h/2
                    ])
                        cube([
                            2*corner_cut,
                            2*corner_cut,
                            base_h + 2*eps
                        ], center = true);
            }

            for (sx = [-1, 1], sy = [-1, 1])
                translate([
                    sx * (base_w/2 - 4),
                    sy * (base_d/2 - 5), 0
                ])
                    linear_extrude(height = ear_h)
                        chamfered_rectangle(ear_w, ear_d, ear_chamfer);
        }

        for (sx = [-1, 1], sy = [-1, 1], k = [-1, 1])
            translate([
                sx * (base_w/2 - 2),
                sy * (base_d/2 - 5) + k*mount_hole_spacing/2,
                -eps
            ])
                cylinder(h = ear_h + 2*eps, d = mount_hole_d);

        translate([
            -base_w/5,
            -base_d/2 + base_notch_d/2 - eps,
            base_h - base_notch_depth/2 + eps
        ])
            cube([
                base_notch_w,
                base_notch_d + 2*eps,
                base_notch_depth + 2*eps
            ], center = true);

        for (sy = [-1, 1])
            translate([
                base_w/2 - seam_depth/2,
                sy * (base_d/2 - corner_cut - 3),
                base_h/2
            ])
                cube([seam_depth + eps, seam_width, base_h + 2*eps],
                     center = true);
    }

    chamfered_block_y(
        -base_w/10, -base_d/2 - panel_projection,
        base_h/2, panel_projection + eps,
        panel_w, panel_h, panel_border
    );

    for (x = [base_w/4, base_w/4 + 4],
         z = [base_h/3, 2*base_h/3])
        cylinder_y(
            -base_d/2 - screw_projection, z,
            screw_projection + eps, screw_d, x = x
        );
}

// Concentric yaw bearing and angular shoulder support
module pedestal() {
    translate([0, turret_y, base_h - eps]) {
        cylinder(h = turret_h + eps, d = turret_d - 3);

        cylinder(h = turret_band_h, d = turret_d + 2);

        translate([0, 0, turret_band_h + 1])
            cylinder(h = turret_h/2, d = turret_d);

        translate([0, 0, turret_h - 2*turret_band_h])
            cylinder(h = turret_band_h, d = turret_flange_d);

        translate([0, 0, turret_h - turret_band_h - eps])
            cylinder(h = turret_band_h + eps,
                     d1 = turret_flange_d, d2 = turret_d - 4);
    }

    prism_x([
        [-pedestal_d*0.56, shoulder_z - 10],
        [-pedestal_d*0.53, shoulder_z - 18],
        [-pedestal_d*0.26, pedestal_bottom],
        [pedestal_d*0.28, pedestal_bottom],
        [pedestal_d*0.48, pedestal_bottom + 11],
        [pedestal_d*0.48, shoulder_z - 7],
        [pedestal_d*0.25, shoulder_z + 5],
        [-pedestal_d*0.27, shoulder_z + 5]
    ], pedestal_w);

    translate([0, turret_y + pedestal_d/8, pedestal_bottom])
        cylinder(h = shoulder_z - pedestal_bottom - 8,
                 d = turret_d * 0.68);

    translate([0, -pedestal_d*0.32, shoulder_z - 12])
        cube([pedestal_w + 2, pedestal_d*0.45, 3], center = true);
}

// Tapered, segmented lifting arm
module lifting_arm() {
    difference() {
        union() {
            for (i = [0 : len(arm_stations)-2])
                hull() {
                    for (j = [i, i+1])
                        translate([
                            0, arm_stations[j][0], arm_stations[j][1]
                        ])
                            linear_extrude(height = arm_slice, center = true)
                                chamfered_rectangle(
                                    arm_stations[j][3],
                                    arm_stations[j][2],
                                    arm_chamfer
                                );
                }

            cylinder_x(
                -arm_w/2, shoulder_y, shoulder_z,
                arm_w, shoulder_core_d
            );
        }

        for (i = [1 : len(arm_stations)-2], side = [-1, 1])
            translate([
                side * (arm_stations[i][3]/2 - seam_depth/2),
                arm_stations[i][0],
                arm_stations[i][1]
            ])
                cube([
                    seam_depth + eps,
                    arm_stations[i][2] + 2*eps,
                    seam_width
                ], center = true);
    }
}

// Slender rear linkage
module parallel_link() {
    w = rear_link_width;

    prism_x([
        [wrist_y - w/2, wrist_z + w/3],
        [wrist_y + w/2, wrist_z + w/3],
        [rear_link_bend_y + w/2, rear_link_bend_z],
        [rear_link_bottom_y + w/2, rear_link_bottom_z],
        [rear_link_bottom_y - w/2, rear_link_bottom_z],
        [rear_link_bend_y - w/2, rear_link_bend_z],
        [wrist_y - w/2, wrist_z - w/2]
    ], rear_link_thickness, rear_link_x);

    cylinder_x(
        -wrist_pin_length/2,
        rear_link_bottom_y, rear_link_bottom_z,
        wrist_pin_length, wrist_pin_d
    );

    cylinder_x(
        -wrist_pin_length/2, wrist_y, wrist_z,
        wrist_pin_length, wrist_pin_d
    );
}

// Lower barrel saddle and wrist cheeks
module wrist_support() {
    saddle_y = arm_top_y + 4;

    difference() {
        union() {
            cylinder_y(
                saddle_y - saddle_length/2,
                barrel_z, saddle_length, saddle_d
            );

            translate([0, saddle_y, barrel_z - saddle_block_h])
                cube([arm_w, saddle_length, saddle_block_h],
                     center = true);
        }

        cylinder_y(
            saddle_y - saddle_length/2 - eps,
            barrel_z, saddle_length + 2*eps,
            barrel_d - 0.8
        );

        translate([0, saddle_y, barrel_z + saddle_d/2])
            cube([
                2*saddle_d, saddle_length + 2*eps,
                saddle_d
            ], center = true);
    }

    translate([
        0, (saddle_y + wrist_y)/2,
        wrist_z - wrist_pin_d/4
    ])
        cube([
            arm_w,
            abs(wrist_y - saddle_y) + wrist_pin_d/2,
            wrist_pin_d
        ], center = true);

    for (side = [-1, 1])
        hull() {
            for (p = [
                [wrist_y - 4, wrist_z - 2],
                [wrist_y + 8, wrist_z + 1],
                [wrist_y + 5, wrist_z + 10]
            ])
                cylinder_x(
                    side*(arm_w/2 + wrist_cheek_thickness/2)
                        - wrist_cheek_thickness/2,
                    p[0], p[1], wrist_cheek_thickness,
                    2*wrist_cheek_radius
                );
        }
}

// Large shouldered wheel with concentric face grooves
module shoulder_wheel() {
    r = shoulder_d/2;
    h = wheel_depth;

    cylinder_x(
        -shoulder_core_w/2, shoulder_y, shoulder_z,
        shoulder_core_w, shoulder_core_d
    );

    cylinder_x(
        -shoulder_core_w/2 - rear_cover_h,
        shoulder_y, shoulder_z,
        rear_cover_h + eps,
        shoulder_d*0.80, shoulder_d*0.88
    );

    translate([wheel_x, shoulder_y, shoulder_z])
        rotate([0, 90, 0])
            rotate_extrude(convexity = 10)
                polygon([
                    [0, 0],
                    [r*0.87, 0],
                    [r*0.96, h*0.12],
                    [r, h*0.30],
                    [r, h*0.61],
                    [r*0.93, h*0.86],
                    [r*0.90, h],
                    [r*0.83, h],
                    [r*0.83, h-wheel_groove],
                    [r*0.77, h-wheel_groove],
                    [r*0.77, h],
                    [r*0.70, h],
                    [r*0.70, h-wheel_groove],
                    [r*0.63, h-wheel_groove],
                    [r*0.63, h],
                    [0, h]
                ]);

    difference() {
        union() {
            chamfered_block_x(
                shaft_start, shoulder_y, shoulder_z,
                shaft_length, shaft_size, shaft_size, shaft_chamfer
            );

            chamfered_block_x(
                shaft_end - shaft_cap_h,
                shoulder_y, shoulder_z,
                shaft_cap_h, shaft_cap_size, shaft_cap_size,
                2*shaft_chamfer
            );
        }

        cylinder_x(
            shaft_end - shaft_socket_depth,
            shoulder_y, shoulder_z,
            shaft_socket_depth + eps, shaft_socket_d,
            facets = 6
        );
    }

    cylinder_x(
        shaft_end - shaft_socket_depth - eps,
        shoulder_y, shoulder_z,
        shaft_socket_depth, shaft_bolt_d, facets = 6
    );
}

// Long barrel, stepped collars, and rear connector pair
module barrel_assembly() {
    cylinder_y(
        barrel_front_y + 7, barrel_z,
        barrel_length - 4, barrel_d
    );

    turned_y([
        [0, nozzle_base_d],
        [front_collar_length*0.12, nozzle_base_d],
        [front_collar_length*0.12, front_flange_d*0.78],
        [front_collar_length*0.27, front_flange_d*0.92],
        [front_collar_length*0.33, front_flange_d],
        [front_collar_length*0.43, front_flange_d],
        [front_collar_length*0.43, front_flange_d*0.93],
        [front_collar_length*0.51, front_flange_d*0.93],
        [front_collar_length*0.51, front_flange_d],
        [front_collar_length*0.60, front_flange_d],
        [front_collar_length*0.60, front_flange_d*0.89],
        [front_collar_length*0.69, front_flange_d*0.89],
        [front_collar_length*0.77, barrel_d + 2.5],
        [front_collar_length*0.95, barrel_d + 2.5],
        [front_collar_length*0.95, barrel_d + 1],
        [front_collar_length, barrel_d + 1]
    ], front_collar_start, barrel_z);

    turned_y([
        [0, barrel_d + 2],
        [rear_collar_length*0.12, barrel_d + 2],
        [rear_collar_length*0.12, rear_flange_d*0.84],
        [rear_collar_length*0.28, rear_flange_d*0.84],
        [rear_collar_length*0.28, rear_flange_d*0.94],
        [rear_collar_length*0.43, rear_flange_d],
        [rear_collar_length*0.60, rear_flange_d],
        [rear_collar_length*0.60, rear_flange_d*0.91],
        [rear_collar_length*0.77, rear_flange_d*0.91],
        [rear_collar_length*0.77, rear_flange_d*0.84],
        [rear_collar_length, rear_flange_d*0.84]
    ], rear_collar_start, barrel_z);

    cylinder_y(
        rear_cap_start - eps, barrel_z,
        rear_cap_length + eps, rear_flange_d*0.84, barrel_d
    );

    for (side = [-1, 1]) {
        terminal_y = rear_cap_start + rear_cap_length - 1;

        chamfered_block_y(
            side*terminal_spacing/2, terminal_y, barrel_z,
            terminal_length, terminal_w, terminal_h, terminal_chamfer
        );

        chamfered_block_y(
            side*terminal_spacing/2,
            terminal_y + terminal_length - 2*terminal_band_h,
            barrel_z, terminal_band_h,
            terminal_w + 1, terminal_h + 1, terminal_chamfer
        );
    }
}

// Stepped nozzle and compact two-jaw end fitting
module tool_end() {
    difference() {
        union() {
            turned_y([
                [0, nozzle_tip_d],
                [nozzle_length*0.24, nozzle_tip_d],
                [nozzle_length*0.24, nozzle_base_d*0.72],
                [nozzle_length*0.45, nozzle_base_d*0.72],
                [nozzle_length*0.45, nozzle_base_d*0.88],
                [nozzle_length*0.80, nozzle_base_d*0.88],
                [nozzle_length, nozzle_base_d]
            ], nozzle_start, barrel_z);

            cylinder_y(
                tool_tip_y, barrel_z,
                tool_stem_length + eps, tool_stem_d
            );

            cylinder_y(
                tool_tip_y - tool_tip_length,
                barrel_z, tool_tip_length + eps,
                tool_tip_d*0.9, tool_tip_d
            );

            chamfered_block_y(
                0, nozzle_start - jaw_bridge_length/2, barrel_z,
                jaw_bridge_length, jaw_bridge_w,
                jaw_height, jaw_chamfer/2
            );

            for (side = [-1, 1])
                translate([
                    side*jaw_spacing/2,
                    nozzle_start - jaw_length/2,
                    barrel_z
                ])
                    rotate([90, 0, 90])
                        linear_extrude(
                            height = jaw_thickness, center = true
                        )
                            chamfered_rectangle(
                                jaw_length, jaw_height, jaw_chamfer
                            );

            cylinder_y(
                nozzle_start - rib_count*rib_pitch,
                barrel_z, rib_count*rib_pitch + eps,
                rib_d - 2
            );

            for (i = [0 : rib_count-1])
                cylinder_y(
                    nozzle_start - (i+1)*rib_pitch,
                    barrel_z, rib_width, rib_d
                );
        }

        cylinder_y(
            tool_tip_y - tool_tip_length - eps,
            barrel_z, tool_bore_depth + eps, tool_bore_d
        );
    }
}

// Assembled industrial manipulator
color([0.66, 0.67, 0.69])
union() {
    mounting_base();
    pedestal();
    lifting_arm();
    parallel_link();
    wrist_support();
    shoulder_wheel();
    barrel_assembly();
    tool_end();
}