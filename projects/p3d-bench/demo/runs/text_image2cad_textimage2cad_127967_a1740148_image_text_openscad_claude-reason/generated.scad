// Industrial Robot Arm Assembly (ABB-style)
// All dimensions in millimeters
$fn = 64;

// ===== Pose Parameters =====
base_yaw        = -20;      // base rotation about Z
shoulder_pitch  = -55;      // shoulder joint angle
elbow_pitch     = 65;       // elbow joint angle
wrist_pitch     = -10;      // wrist bend
wrist_roll      = 0;        // wrist rotation
gripper_angle   = 22;       // half-open angle per jaw

// ===== Base / Housing Cap =====
base_foot_r     = 195;
base_body_r     = 170;
base_ledge_r    = 130;
base_boss_r     = 55;
base_total_h    = 104;
base_foot_h     = 30;
base_body_h     = 30;
base_ledge_h    = 25;
base_boss_h     = 19;
base_lug_count  = 6;
base_lug_w      = 40;
base_lug_d      = 25;
base_lug_h      = 30;

// ===== Shoulder / Lever Arm =====
shoulder_r1     = 120;
shoulder_r2     = 90;
shoulder_r3     = 68;
shoulder_hub_h  = 80;
shoulder_pivot_r= 50;
shoulder_head_w = 100;
shoulder_head_h = 90;
shoulder_head_d = 100;
gear_teeth      = 24;

// ===== Spacer Rings =====
spacer_or       = 3.0;
spacer_ir       = 1.6;
spacer_h        = 3.0;
spacer_count    = 12;
spacer_circle_r = 110;

// ===== Upper Arm (Connecting Arm) =====
arm_length      = 440;
arm_hub_r       = 48;
arm_bore_r      = 15;
arm_shaft_rx    = 35;
arm_shaft_ry    = 28;
arm_thickness   = 60;

// ===== Elbow Joint Housing =====
elbow_block_w   = 90;
elbow_block_h   = 100;
elbow_block_d   = 90;
elbow_cyl_r     = 38;
elbow_cyl_len   = 60;
elbow_bore_r    = 22;

// ===== Forearm (Multi-bore Housing) =====
forearm_len     = 173;
forearm_r       = 38;
forearm_boss_r  = 15;

// ===== Wrist (Scroll Housing) =====
wrist_rim_r     = 35;
wrist_body_w    = 60;
wrist_body_h    = 50;
wrist_len       = 55;

// ===== Gripper Jaws =====
jaw_length      = 120;
jaw_width       = 19;
jaw_depth       = 65;
jaw_pivot_r     = 15;

// ===== Knob Plug =====
knob_dome_r     = 42;
knob_shank_r    = 20;

// ============================================================
// MODULE: Housing Cap (Grounded Base)
// ============================================================
module housing_cap() {
    color([0.72, 0.72, 0.74]) {
        // Bottom foot ring with lugs
        difference() {
            union() {
                cylinder(r=base_foot_r, h=base_foot_h);
                // Mounting lugs
                for (i = [0:base_lug_count-1]) {
                    rotate([0, 0, i * 360/base_lug_count])
                    translate([base_foot_r - 5, -base_lug_w/2, 0])
                        hull() {
                            cube([base_lug_d, base_lug_w, base_lug_h]);
                            translate([5, 5, base_lug_h])
                                cube([base_lug_d - 10, base_lug_w - 10, 1]);
                        }
                }
            }
            // Hollow center
            translate([0, 0, -1])
                cylinder(r=base_foot_r - 30, h=base_foot_h - 8);
        }

        // Main body cylinder
        translate([0, 0, base_foot_h])
        difference() {
            cylinder(r=base_body_r, h=base_body_h);
            translate([0, 0, 10])
                cylinder(r=base_body_r - 15, h=base_body_h);
        }

        // Turntable ledge
        translate([0, 0, base_foot_h + base_body_h])
        difference() {
            cylinder(r=base_ledge_r, h=base_ledge_h);
            translate([0, 0, -1])
                cylinder(r=base_ledge_r - 20, h=base_ledge_h + 2);
        }

        // Concentric groove ring
        translate([0, 0, base_foot_h + base_body_h + 5])
        difference() {
            cylinder(r=base_ledge_r + 15, h=15);
            translate([0, 0, -1])
                cylinder(r=base_ledge_r - 5, h=17);
            translate([0, 0, 5])
                difference() {
                    cylinder(r=base_ledge_r + 16, h=6);
                    cylinder(r=base_ledge_r + 5, h=6);
                }
        }

        // Central boss
        translate([0, 0, base_foot_h + base_body_h])
            cylinder(r=base_boss_r, h=base_boss_h + base_ledge_h);
    }
}

// ============================================================
// MODULE: Spacer Ring (bearing element)
// ============================================================
module spacer_ring() {
    color([0.6, 0.6, 0.62])
    difference() {
        cylinder(r=spacer_or, h=spacer_h);
        translate([0, 0, -0.5])
            cylinder(r=spacer_ir, h=spacer_h + 1);
    }
}

// ============================================================
// MODULE: Lever Arm with Bevel Gear (Shoulder)
// ============================================================
module lever_arm_bevel() {
    color([0.70, 0.70, 0.73]) {
        // Stepped turntable base discs
        cylinder(r=shoulder_r1, h=18);
        translate([0, 0, 18])
            cylinder(r=shoulder_r2, h=18);
        translate([0, 0, 36])
            cylinder(r=shoulder_r3, h=22);

        // Gear teeth ring
        translate([0, 0, 55]) {
            for (i = [0:gear_teeth-1]) {
                rotate([0, 0, i * 360/gear_teeth])
                translate([50, -4, 0])
                    cube([12, 8, 10]);
            }
            cylinder(r=shoulder_r3 - 8, h=12);
        }

        // Shoulder head block (the blocky head at top of shoulder)
        translate([0, 0, 60]) {
            hull() {
                translate([-shoulder_head_w/2, -shoulder_head_d/2, 0])
                    cube([shoulder_head_w, shoulder_head_d, 5]);
                translate([-(shoulder_head_w-10)/2, -(shoulder_head_d-10)/2, shoulder_head_h])
                    cube([shoulder_head_w-10, shoulder_head_d-10, 5]);
            }
            // Chamfered top
            translate([0, 0, shoulder_head_h]) {
                hull() {
                    translate([-(shoulder_head_w-10)/2, -(shoulder_head_d-10)/2, 0])
                        cube([shoulder_head_w-10, shoulder_head_d-10, 5]);
                    translate([-(shoulder_head_w-20)/2, -(shoulder_head_d-20)/2, 25])
                        cube([shoulder_head_w-20, shoulder_head_d-20, 5]);
                }
            }

            // Pivot cylinders on sides
            translate([0, 0, shoulder_head_h + 15])
                rotate([0, 90, 0])
                    cylinder(r=shoulder_pivot_r, h=shoulder_head_w + 30, center=true);
        }
    }
}

// ============================================================
// MODULE: Knob Plug (joint covers)
// ============================================================
module knob_plug() {
    color([0.68, 0.68, 0.72]) {
        // Dome
        scale([1, 1, 0.55])
            sphere(r=knob_dome_r);
        // Flange ring
        difference() {
            cylinder(r=knob_dome_r, h=8);
            translate([0, 0, -1])
                cylinder(r=knob_dome_r - 6, h=10);
        }
        // Shank
        translate([0, 0, -22])
            cylinder(r=knob_shank_r, h=22);
    }
}

// ============================================================
// MODULE: Connecting Arm (upper arm link)
// ============================================================
module connecting_arm() {
    color([0.73, 0.73, 0.76]) {
        // Shoulder hub
        rotate([0, 90, 0])
        difference() {
            cylinder(r=arm_hub_r, h=arm_thickness, center=true);
            cylinder(r=arm_bore_r, h=arm_thickness + 2, center=true);
        }

        // Curved arm body using hull of cross-sections
        for (seg = [0:9]) {
            t1 = seg / 10;
            t2 = (seg + 1) / 10;
            hull() {
                translate([0, arm_curvature(t1), t1 * arm_length])
                    rotate([0, 90, 0])
                        scale([1, 0.75, 1])
                            cylinder(r=arm_shaft_rx * (1 - 0.15*t1), h=arm_thickness * (1 - 0.1*t1), center=true);
                translate([0, arm_curvature(t2), t2 * arm_length])
                    rotate([0, 90, 0])
                        scale([1, 0.75, 1])
                            cylinder(r=arm_shaft_rx * (1 - 0.15*t2), h=arm_thickness * (1 - 0.1*t2), center=true);
            }
        }

        // Elbow hub with bolt flange
        translate([0, arm_curvature(1), arm_length])
            rotate([0, 90, 0])
            difference() {
                union() {
                    cylinder(r=arm_hub_r - 5, h=arm_thickness * 0.85, center=true);
                    // Bolt flange ring
                    cylinder(r=arm_hub_r + 2, h=arm_thickness * 0.5, center=true);
                }
                cylinder(r=arm_bore_r, h=arm_thickness + 2, center=true);
                // 13 blind bolt holes
                for (i = [0:12])
                    rotate([0, 0, i * 360/13])
                        translate([36, 0, arm_thickness * 0.25 - 8])
                            cylinder(r=3, h=10);
            }

        // Small lugs on arm top
        for (i = [0.3, 0.5, 0.65])
            translate([-10, arm_curvature(i) + arm_shaft_rx * 0.5, i * arm_length])
                cube([20, 8, 15]);
    }
}

// Arm curvature function - slight S-curve
function arm_curvature(t) = 15 * sin(t * 180);

// ============================================================
// MODULE: Joint Housing (Elbow)
// ============================================================
module joint_housing() {
    color([0.68, 0.68, 0.71]) {
        difference() {
            union() {
                // Main block with chamfer
                hull() {
                    translate([-elbow_block_w/2, -elbow_block_d/2, 0])
                        cube([elbow_block_w, elbow_block_d, elbow_block_h - 15]);
                    translate([-(elbow_block_w-15)/2, -(elbow_block_d-15)/2, elbow_block_h - 15])
                        cube([elbow_block_w - 15, elbow_block_d - 15, 15]);
                }

                // Cylindrical arm extending forward
                translate([0, 0, elbow_block_h/2])
                    rotate([-90, 0, 0])
                        cylinder(r=elbow_cyl_r, h=elbow_cyl_len);

                // Side pivot bosses
                translate([0, elbow_block_d/4, elbow_block_h/2])
                    rotate([0, 90, 0])
                        cylinder(r=30, h=elbow_block_w + 20, center=true);
            }

            // Through bore along cylindrical arm
            translate([0, 0, elbow_block_h/2])
                rotate([-90, 0, 0])
                    cylinder(r=elbow_bore_r, h=elbow_cyl_len + 30, center=true);

            // Perpendicular blind bores
            translate([0, elbow_block_d/4, elbow_block_h/2])
                rotate([0, 90, 0])
                    cylinder(r=15, h=elbow_block_w + 40, center=true);

            // 12-bolt circle on flange
            translate([0, 0, -1])
                for (i = [0:11])
                    rotate([0, 0, i * 30])
                        translate([32, 0, 0])
                            cylinder(r=1.5, h=15);
        }
    }
}

// ============================================================
// MODULE: Multi-bore Housing (Forearm)
// ============================================================
module multi_bore_housing() {
    color([0.70, 0.70, 0.73]) {
        difference() {
            union() {
                // Multi-lobed main body
                hull() {
                    cylinder(r=forearm_r, h=forearm_len);
                    translate([12, 8, 0])
                        cylinder(r=forearm_r - 8, h=forearm_len);
                    translate([-12, 8, 0])
                        cylinder(r=forearm_r - 8, h=forearm_len);
                }
                // Protruding boss
                translate([0, 0, forearm_len])
                    cylinder(r=forearm_boss_r, h=18);

                // Side lobes for visual detail
                for (a = [60, 180, 300])
                    rotate([0, 0, a])
                        translate([forearm_r - 5, 0, 10])
                            cylinder(r=12, h=forearm_len - 20);
            }

            // Longitudinal bores
            translate([0, 0, -1])
                cylinder(r=18, h=forearm_len + 25);

            // Counterbored bolt positions (visual detail)
            for (i = [0:5])
                rotate([0, 0, i * 60])
                    translate([30, 0, -1])
                        cylinder(r=4, h=15);
            for (i = [0:5])
                rotate([0, 0, i * 60])
                    translate([30, 0, forearm_len - 10])
                        cylinder(r=4, h=12);
        }
    }
}

// ============================================================
// MODULE: Scroll Housing (Wrist)
// ============================================================
module scroll_housing() {
    color([0.68, 0.68, 0.70]) {
        difference() {
            union() {
                // Circular front rim
                cylinder(r=wrist_rim_r, h=18);
                translate([0, 0, 18])
                    cylinder(r=wrist_rim_r - 4, h=5);

                // Angular rear body
                translate([-wrist_body_w/2, -wrist_body_h/2, 18])
                    hull() {
                        cube([wrist_body_w, wrist_body_h, wrist_len - 18]);
                        translate([5, 5, wrist_len - 23])
                            cube([wrist_body_w - 10, wrist_body_h - 10, 5]);
                    }

                // Mounting flanges
                translate([-wrist_body_w/2 - 8, -wrist_body_h/2 - 5, 18])
                    cube([wrist_body_w + 16, wrist_body_h + 10, 8]);
            }

            // Internal scroll cavity
            translate([0, 0, -1])
                cylinder(r=23.5, h=wrist_len + 2);

            // Four mounting through-holes
            for (ix = [-1, 1])
                for (iy = [-1, 1])
                    translate([ix * (wrist_body_w/2 + 2), iy * (wrist_body_h/2), 15])
                        cylinder(r=1.5, h=15);

            // Blind bore
            translate([0, 0, wrist_len - 12])
                cylinder(r=10, h=13);
        }
    }
}

// ============================================================
// MODULE: Gripper Jaw
// ============================================================
module gripper_jaw() {
    color([0.65, 0.65, 0.68]) {
        union() {
            // Pivot boss
            cylinder(r=jaw_pivot_r, h=jaw_width);

            // Main arm going down
            hull() {
                cylinder(r=12, h=jaw_width);
                translate([5, -55, 0])
                    cylinder(r=8, h=jaw_width);
            }

            // Angled finger section
            hull() {
                translate([5, -55, 0])
                    cylinder(r=8, h=jaw_width);
                translate([35, -90, 0])
                    cube([6, 15, jaw_width]);
            }

            // Serrated gripping face
            for (i = [0:5])
                translate([38, -92 + i * 5.5, 0])
                    rotate([0, 0, -15])
                        cube([10, 3, jaw_width]);

            // Elongated adjustment slot (visual)
            translate([2, -30, jaw_width/2])
                rotate([0, 90, 0])
                    hull() {
                        translate([0, 0, 0]) cylinder(r=4, h=3);
                        translate([0, -18, 0]) cylinder(r=4, h=3);
                    }
        }
    }
}

// ============================================================
// MAIN ASSEMBLY
// ============================================================

// Height offsets for joint chain
base_top        = base_total_h;
shoulder_joint_z = base_top + 60 + shoulder_head_h + 15; // top of shoulder head

// 1. Housing Cap (Base) - grounded
housing_cap();

// 2. Spacer rings at turntable interface
translate([0, 0, base_total_h - 5])
    for (i = [0:spacer_count-1])
        rotate([0, 0, i * 360/spacer_count])
            translate([spacer_circle_r, 0, 0])
                spacer_ring();

// 3. Lever arm with bevel gear (Shoulder turntable)
rotate([0, 0, base_yaw])
translate([0, 0, base_top]) {
    lever_arm_bevel();

    // Shoulder joint pivot point
    translate([0, 0, 60 + shoulder_head_h + 15]) {

        // 4. Knob plugs on shoulder pivot
        translate([shoulder_head_w/2 + 18, 0, 0])
            rotate([0, 90, 0])
                knob_plug();
        mirror([1, 0, 0])
            translate([shoulder_head_w/2 + 18, 0, 0])
                rotate([0, 90, 0])
                    knob_plug();

        // Apply shoulder rotation (pitch about X-axis)
        rotate([shoulder_pitch, 0, 0]) {

            // 5. Connecting Arm (upper arm)
            connecting_arm();

            // Elbow joint at end of arm
            translate([0, arm_curvature(1), arm_length]) {
                rotate([elbow_pitch, 0, 0]) {

                    // 6. Joint Housing (Elbow)
                    joint_housing();

                    // Forearm attachment point
                    translate([0, elbow_cyl_len, elbow_block_h/2]) {
                        rotate([-90, 0, 0]) {

                            // 7. Multi-bore Housing (Forearm)
                            multi_bore_housing();

                            // Wrist at end of forearm
                            translate([0, 0, forearm_len + 15]) {
                                rotate([wrist_pitch, 0, wrist_roll]) {

                                    // 8. Scroll Housing (Wrist)
                                    scroll_housing();

                                    // 9. Gripper Jaws (mirror pair)
                                    translate([0, 0, wrist_len + 3]) {
                                        // Jaw 1 - opening to one side
                                        rotate([0, 0, gripper_angle])
                                            gripper_jaw();
                                        // Jaw 2 - mirrored
                                        rotate([0, 0, -gripper_angle])
                                            mirror([1, 0, 0])
                                                gripper_jaw();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}