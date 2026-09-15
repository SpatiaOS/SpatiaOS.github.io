// Parametric Industrial Robot Arm
$fn = 48;

// Joint Angles (Matching Image Pose)
j1 = -35;       // Waist / Turntable rotation (deg)
j2 = -32;       // Shoulder tilt angle (deg, leaning forward)
j3 = 78;        // Elbow tilt angle (deg)
j4 = 0;         // Forearm roll (deg)
j5 = -48;       // Wrist pitch (deg)
j6 = 15;        // Tool flange roll (deg)

// Key Dimensions
base_w           = 320;
base_d           = 320;
base_h           = 55;
riser_d          = 230;
riser_h          = 28;

shoulder_x       = 25;
shoulder_z       = 108;
arm1_w           = 96;
arm1_length      = 240;

arm2_length      = 245;
forearm_tube_d   = 62;
flange_d         = 46;

// Helper: Chamfered Box Profile
module chamfer_box(w, d, h, c) {
    linear_extrude(height=h, center=true)
        polygon([
            [-w/2+c, -d/2], [w/2-c, -d/2],
            [w/2, -d/2+c], [w/2, d/2-c],
            [w/2-c, d/2], [-w/2+c, d/2],
            [-w/2, d/2-c], [-w/2, -d/2+c]
        ]);
}

// 1. Robot Base Assembly
module robot_base() {
    difference() {
        union() {
            // Main square base slab
            translate([0, 0, base_h/2])
                chamfer_box(base_w, base_d, base_h, 8);

            // Mounting ears at corners
            for (sx = [-1, 1], sy = [-1, 1]) {
                translate([sx * (base_w/2 + 6), sy * (base_d/2 - 35), 0])
                    hull() {
                        translate([0, -15, 0]) cylinder(d=22, h=base_h);
                        translate([0, 15, 0]) cylinder(d=22, h=base_h);
                        translate([-sx * 15, 0, 0]) cube([10, 50, base_h], center=true);
                    }
            }

            // Slewing ring riser
            translate([0, 0, base_h]) {
                cylinder(d=riser_d, h=14);
                translate([0, 0, 14]) cylinder(d=riser_d - 18, h=3);
                translate([0, 0, 17]) cylinder(d=riser_d - 4, h=8);
                translate([0, 0, 25]) cylinder(d1=riser_d - 4, d2=riser_d - 20, h=3);
            }
        }

        // Mounting holes in ears
        for (sx = [-1, 1], sy = [-1, 1]) {
            translate([sx * (base_w/2 + 6), sy * (base_d/2 - 35), -1]) {
                translate([0, -12, 0]) cylinder(d=12, h=base_h + 2);
                translate([0, 12, 0]) cylinder(d=12, h=base_h + 2);
            }
        }

        // Side indentation cutouts
        translate([base_w/2 + 2, 0, base_h/2])
            cube([22, base_d - 120, base_h + 2], center=true);
        translate([-base_w/2 - 2, 0, base_h/2])
            cube([22, base_d - 120, base_h + 2], center=true);

        // Angled top pockets
        translate([-75, -45, base_h - 2])
            rotate([0, 0, 35]) cube([50, 24, 8], center=true);
        translate([30, 80, base_h - 2])
            rotate([0, 0, -45]) cube([50, 24, 8], center=true);

        // Recessed front electrical connector panel (-Y face)
        translate([-65, -base_d/2 - 1, 14])
            cube([55, 8, 30]);
    }

    // Connectors on front panel
    translate([45, -base_d/2 - 1, 14]) {
        cube([42, 4, 32]);
        for (ox = [11, 31]) {
            translate([ox, -3, 16])
                rotate([90, 0, 0]) {
                    cylinder(d=14, h=10);
                    cylinder(d=9, h=14);
                }
        }
    }
}

// 2. Turntable & Shoulder Tower (Axis 1)
module carousel() {
    // Turntable baseplate
    cylinder(d=riser_d - 22, h=12);

    // Sculpted upright shoulder tower
    difference() {
        union() {
            // Main tower body
            hull() {
                translate([0, 0, 10])
                    cylinder(d=185, h=15);
                translate([shoulder_x - 10, -arm1_w/2 - 8, shoulder_z])
                    rotate([90, 0, 0]) cylinder(d=95, h=20, center=true);
                translate([shoulder_x - 10, arm1_w/2 + 8, shoulder_z])
                    rotate([90, 0, 0]) cylinder(d=95, h=20, center=true);
            }
            // Rear stiffening web
            hull() {
                translate([-65, 0, 10])
                    cylinder(d=50, h=15);
                translate([-35, 0, shoulder_z - 15])
                    cube([40, arm1_w + 10, 30], center=true);
            }
        }

        // Central clearance slot for lower arm counterweight
        translate([shoulder_x, 0, shoulder_z - 10])
            cube([140, arm1_w + 4, shoulder_z + 40], center=true);
        translate([0, 0, 18])
            cylinder(d=110, h=shoulder_z);
    }

    // Axis 2 Bearing Hub (Prominent concentric hub on +Y side)
    translate([shoulder_x, arm1_w/2 + 18, shoulder_z]) {
        rotate([-90, 0, 0]) {
            cylinder(d=136, h=20);
            translate([0, 0, 20]) cylinder(d1=136, d2=114, h=6);
            translate([0, 0, 26]) cylinder(d=114, h=8);
            translate([0, 0, 34]) cylinder(d=88, h=5);
            translate([0, 0, 39]) cylinder(d=64, h=3);
            // Center hexagonal axle boss and nut
            translate([0, 0, 39]) cylinder(d=44, h=36, $fn=6);
            translate([0, 0, 75]) cylinder(d=26, h=10, $fn=6);
        }
    }

    // Lower Parallel Linkage Pivot Bracket
    translate([shoulder_x + 38, arm1_w/2 + 20, shoulder_z - 36]) {
        rotate([-90, 0, 0]) {
            cylinder(d=22, h=16, center=true);
            cylinder(d=11, h=28, center=true);
        }
    }
}

// 3. Lower Arm (Axis 2 / Boom)
module lower_arm() {
    // Shoulder pivot joint cylinder
    rotate([90, 0, 0])
        cylinder(d=88, h=arm1_w, center=true);

    // Counterweight / Rear Housing
    translate([38, -6, -42]) {
        difference() {
            chamfer_box(74, arm1_w - 4, 76, 12);
            // Slanted rear cut
            translate([26, 0, -26])
                rotate([0, 40, 0])
                cube([60, arm1_w + 10, 60], center=true);
        }
    }

    // Rear counterweight drive motor (-Y side)
    translate([44, -arm1_w/2 - 16, -42]) {
        rotate([90, 0, 0]) {
            cylinder(d=58, h=40, center=true);
            translate([0, 0, 20]) cylinder(d=24, h=14);
        }
    }

    // Main structural beam (Faceted cast profile)
    hull() {
        translate([0, 0, 20])
            chamfer_box(98, arm1_w - 6, 20, 14);
        translate([-4, 0, 115])
            chamfer_box(86, arm1_w - 14, 20, 12);
    }
    hull() {
        translate([-4, 0, 115])
            chamfer_box(86, arm1_w - 14, 20, 12);
        translate([0, 0, arm1_length - 20])
            chamfer_box(92, arm1_w - 4, 20, 12);
    }

    // Front stiffener rib
    translate([-38, 0, arm1_length/2])
        chamfer_box(16, arm1_w - 36, arm1_length - 80, 4);

    // Upper elbow pivot clevis
    translate([0, 0, arm1_length])
        rotate([90, 0, 0])
            cylinder(d=76, h=arm1_w - 8, center=true);
}

// 4. Elbow Assembly & Upper Drive Motors (Axis 3)
module elbow_assembly() {
    // Elbow pivot drum
    rotate([90, 0, 0])
        cylinder(d=74, h=arm1_w - 16, center=true);

    // Motor mounting bracket / gearbox
    translate([32, 0, 20]) {
        rotate([0, -25, 0]) {
            chamfer_box(62, arm1_w - 12, 48, 8);

            // Dual parallel upper motors
            for (my = [-20, 20]) {
                translate([26, my, 8]) {
                    rotate([0, 90, 0]) {
                        cylinder(d=38, h=62);
                        translate([0, 0, 62]) cylinder(d=32, h=10);
                        // Terminal box & cable glands
                        translate([-9, -9, 72]) cube([18, 18, 14]);
                        translate([0, 0, 86]) cylinder(d=9, h=8);
                    }
                }
            }
        }
    }

    // Upper linkage crank arm (+Y side)
    translate([26, arm1_w/2 + 16, 20]) {
        rotate([-90, 0, 0]) {
            cylinder(d=22, h=14, center=true);
            cylinder(d=10, h=24, center=true);
        }
    }
}

// 5. Forearm (Axis 4 Boom)
module forearm() {
    // Rear transition housing at elbow
    translate([-18, 0, 0])
        chamfer_box(55, arm1_w - 20, 64, 10);

    // Rear stepped collars
    translate([-35, 0, 0]) rotate([0, -90, 0]) {
        cylinder(d=96, h=14);
        translate([0, 0, 14]) cylinder(d=88, h=4);
        translate([0, 0, 18]) cylinder(d=94, h=8);
        translate([0, 0, 26]) cylinder(d1=94, d2=forearm_tube_d, h=22);
    }

    // Main smooth cylinder tube
    translate([-83, 0, 0]) rotate([0, -90, 0])
        cylinder(d=forearm_tube_d, h=120);

    // Front stepped collars & rings
    translate([-203, 0, 0]) rotate([0, -90, 0]) {
        cylinder(d1=forearm_tube_d, d2=84, h=14);
        translate([0, 0, 14]) cylinder(d=94, h=14);
        translate([0, 0, 28]) cylinder(d=82, h=4);
        translate([0, 0, 32]) cylinder(d=88, h=10);
        translate([0, 0, 42]) cylinder(d1=76, d2=46, h=16);
    }
}

// 6. Articulated Wrist & Tool Flange (Axis 4, 5, 6)
module wrist() {
    // Axis 4 roll neck
    rotate([0, -90, 0])
        cylinder(d=44, h=20);

    // Axis 5 pitch knuckle
    translate([-30, 0, 0]) {
        rotate([0, j5, 0]) {
            // Knuckle cross-block
            chamfer_box(28, 38, 38, 6);

            // Side pivot cap (+Y side)
            translate([0, 19, 0]) rotate([90, 0, 0]) {
                cylinder(d=32, h=5, center=true);
                cylinder(d=22, h=8, center=true);
                cylinder(d=10, h=12, center=true);
            }

            // Axis 6 tool flange mount
            translate([-18, 0, 0]) {
                rotate([-j6, 0, 0]) {
                    // Flange neck
                    rotate([0, -90, 0]) cylinder(d=28, h=10);

                    // Circular tool flange
                    translate([-10, 0, 0]) rotate([0, -90, 0]) {
                        difference() {
                            union() {
                                cylinder(d=flange_d, h=7);
                                translate([0, 0, 7]) cylinder(d=22, h=3);
                            }
                            // Center locating register bore
                            translate([0, 0, -1]) cylinder(d=12, h=14);
                            // Mounting bolt pattern
                            for (a = [0 : 60 : 300]) {
                                rotate([0, 0, a])
                                    translate([16, 0, -1])
                                        cylinder(d=3.5, h=12);
                            }
                        }
                    }
                }
            }
        }
    }
}

// 7. Dogleg Parallel Linkage Bar
module parallel_link() {
    // Coordinates corresponding to pose
    p_lower = [shoulder_x + 38, arm1_w/2 + 20, shoulder_z - 36];

    // Constructed in carousel frame to connect lower tower pin to elbow crank
    translate([0, p_lower[1], 0]) {
        // Lower eyelet
        translate([p_lower[0], 0, p_lower[2]])
            rotate([-90, 0, 0])
                difference() {
                    cylinder(d=22, h=12, center=true);
                    cylinder(d=11, h=14, center=true);
                }

        // Extruded dogleg profile
        linear_extrude(height=12, center=true) {
            polygon([
                [p_lower[0] - 8, p_lower[2]],
                [p_lower[0] + 8, p_lower[2]],
                [-30, 218],
                [-56, 275],
                [-72, 275],
                [-46, 214]
            ]);
        }

        // Upper eyelet
        translate([-64, 0, 275])
            rotate([-90, 0, 0])
                difference() {
                    cylinder(d=20, h=12, center=true);
                    cylinder(d=10, h=14, center=true);
                }
    }
}

// Complete Robot Hierarchy Assembly
module robot_arm() {
    // Stationary Base
    robot_base();

    // Axis 1: Waist rotation
    translate([0, 0, base_h + riser_h]) {
        rotate([0, 0, j1]) {
            carousel();
            parallel_link();

            // Axis 2: Shoulder pivot
            translate([shoulder_x, 0, shoulder_z]) {
                rotate([0, j2, 0]) {
                    lower_arm();

                    // Axis 3: Elbow pivot
                    translate([0, 0, arm1_length]) {
                        rotate([0, j3, 0]) {
                            elbow_assembly();
                            forearm();

                            // Axis 4, 5, 6: Wrist assembly
                            translate([-arm2_length, 0, 0]) {
                                rotate([-j4, 0, 0])
                                    wrist();
                            }
                        }
                    }
                }
            }
        }
    }
}

// Render Model
robot_arm();