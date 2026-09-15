// Double-Cardan Steering Shaft Assembly Reconstructed from CAD Inventory
$fn = 48;

// ==========================================
// Parameters
// ==========================================

// Splined coupling pin parameters (e73fdae8)
pin_dia          = 20.0;
pin_len          = 75.0;
journal_len      = 53.5;
pin_spline_len   = 21.5;
spline_root_r    = 8.62;
spline_teeth     = 36;
pin_hole_dia     = 6.0;
pin_hole_dist    = 10.0;

// Universal joint yoke parameters (e744bc80)
yoke_len         = 56.8;
yoke_width       = 41.4;
yoke_thick       = 23.4;
hub_len          = 25.0;
hole_dist        = 44.0;
ear_thick        = 9.5;
clevis_gap       = yoke_width - 2 * ear_thick; // 22.4 mm
ear_r            = yoke_thick / 2;             // 11.7 mm

// Cross spider parameters (e73a834c)
cross_span       = 41.4;
cross_pin_d      = 7.96;
cross_center_sz  = 15.0;

// Center shaft parameters (e747c9d4)
shank_r          = 11.08;
shank_len        = 78.0;
shaft_spline_len = 94.0;
spline_root_r2   = 8.62;

// Serrated angle joint parameters (e740c52e)
aj_len           = 72.0;
aj_width         = 42.0;
aj_thick         = 26.0;
aj_hub_len       = 27.0;
aj_clevis_len    = 32.0;

// Assembly kinematic parameters
cross_distance   = 244.0; // Distance between joint pivot centres
joint_angle_1    = 20.0;  // Right knuckle articulation angle (deg)
joint_angle_2    = -20.0; // Left knuckle articulation angle (deg)

// ==========================================
// Component Modules
// ==========================================

// Splined coupling pin (2 instances)
module splined_pin() {
    color([0.78, 0.80, 0.82]) {
        difference() {
            union() {
                // Smooth journal
                cylinder(r = pin_dia / 2, h = journal_len);
                // Spline section
                translate([0, 0, journal_len]) {
                    cylinder(r = spline_root_r, h = pin_spline_len);
                    for (i = [0 : spline_teeth - 1]) {
                        rotate([0, 0, i * 360 / spline_teeth])
                            translate([spline_root_r - 0.2, -0.42, 0])
                                cube([pin_dia / 2 - spline_root_r + 0.2, 0.84, pin_spline_len]);
                    }
                }
            }
            // Tip chamfer
            translate([0, 0, -0.1])
                difference() {
                    cylinder(r = pin_dia / 2 + 2, h = 1.6);
                    cylinder(r1 = pin_dia / 2 - 1.5, r2 = pin_dia / 2 + 0.1, h = 1.61);
                }
            // Spline lead-in chamfer
            translate([0, 0, pin_len - 1.2])
                difference() {
                    cylinder(r = pin_dia / 2 + 2, h = 1.5);
                    cylinder(r1 = pin_dia / 2 + 0.1, r2 = spline_root_r - 0.5, h = 1.5);
                }
            // Radial retention through-holes
            translate([0, 0, pin_hole_dist])
                rotate([90, 0, 0])
                    cylinder(d = pin_hole_dia, h = pin_dia + 4, center = true);
            translate([0, 0, journal_len - 8.0])
                rotate([90, 0, 0])
                    cylinder(d = pin_hole_dia, h = pin_dia + 4, center = true);
        }
    }
}

// Universal joint cross / spider element (2 instances)
module cross_spider() {
    color([0.86, 0.88, 0.90]) {
        // Central body
        intersection() {
            cube([cross_center_sz, cross_center_sz, cross_center_sz], center = true);
            sphere(d = cross_center_sz * 1.34);
        }
        // Trunnions along Y
        rotate([90, 0, 0])
            cylinder(d = cross_pin_d, h = cross_span, center = true);
        // Trunnions along Z
        cylinder(d = cross_pin_d, h = cross_span, center = true);
        // Bearing retaining caps on ends
        for (sign = [-1, 1]) {
            translate([0, sign * (cross_span / 2 - 0.75), 0])
                rotate([90, 0, 0])
                    cylinder(d = 8.5, h = 1.5, center = true);
            translate([0, 0, sign * (cross_span / 2 - 0.75)])
                cylinder(d = 8.5, h = 1.5, center = true);
        }
    }
}

// Universal joint yoke (outer yokes, 2 instances)
module universal_joint_yoke() {
    hub_x_start = -hole_dist;
    hub_x_end   = hub_x_start + hub_len;

    color([0.72, 0.74, 0.76]) {
        difference() {
            union() {
                // Hub rounded block
                hull() {
                    for (sy = [-1, 1], sz = [-1, 1]) {
                        translate([hub_x_start, sy * (yoke_width / 2 - ear_r), sz * (yoke_thick / 2 - ear_r)])
                            rotate([0, 90, 0])
                                cylinder(r = ear_r, h = hub_len);
                    }
                }
                // Fork ears projecting towards cross center at x=0
                for (sign = [-1, 1]) {
                    hull() {
                        translate([hub_x_end - 4, sign * (clevis_gap / 2 + ear_thick / 2), 0])
                            cube([4, ear_thick, yoke_thick], center = true);
                        translate([0, sign * (clevis_gap / 2 + ear_thick / 2), 0])
                            rotate([90, 0, 0])
                                cylinder(r = ear_r, h = ear_thick, center = true);
                    }
                }
            }

            // Splined bore for coupling pin
            translate([hub_x_start - 1, 0, 0])
                rotate([0, 90, 0])
                    cylinder(d = pin_dia, h = hub_len + 4);

            for (i = [0 : spline_teeth - 1]) {
                rotate([i * 360 / spline_teeth, 0, 0])
                    translate([hub_x_start - 1, 0, spline_root_r])
                        cube([hub_len + 2, 0.85, 1.6]);
            }

            // Cross-pin 8 mm through-hole
            rotate([90, 0, 0])
                cylinder(d = 8.0, h = yoke_width + 4, center = true);

            // Clevis clearance pocket
            translate([hub_x_end - 1, -clevis_gap / 2, -yoke_thick / 2 - 1])
                cube([hole_dist - hub_len + ear_r + 2, clevis_gap, yoke_thick + 2]);

            // Articulation swing pocket
            translate([-4, 0, 0])
                sphere(d = clevis_gap + 2);

            // Hub clamping slit
            translate([hub_x_start - 1, -1.0, -yoke_thick / 2 - 1])
                cube([hub_len + 2, 2.0, yoke_thick / 2 + 1]);

            // Clamping pinch bolt passage and counterbore
            translate([hub_x_start + hub_len * 0.45, 0, -yoke_thick / 2 + 5]) {
                cylinder(d = 6.8, h = yoke_thick + 2, center = true);
                translate([0, 0, yoke_thick / 2 - 1.5])
                    cylinder(d = 13.0, h = 5, center = true);
            }
        }
    }
}

// Integrated splined-shaft-yoke (e747c9d4)
module splined_shaft_yoke() {
    // 1. Silver section: Universal joint fork and smooth shank
    color([0.75, 0.77, 0.80]) {
        difference() {
            union() {
                // Fork ears (aligned with Z)
                for (sign = [-1, 1]) {
                    hull() {
                        translate([0, 0, sign * (clevis_gap / 2 + ear_thick / 2)])
                            cylinder(r = ear_r, h = ear_thick, center = true);
                        translate([35, 0, sign * (clevis_gap / 2 + ear_thick / 2)])
                            cube([4, yoke_thick, ear_thick], center = true);
                    }
                }
                // Transition neck from fork to round shank
                hull() {
                    translate([33, 0, 0])
                        cube([4, yoke_thick, yoke_width], center = true);
                    translate([48, 0, 0])
                        rotate([0, 90, 0])
                            cylinder(r = shank_r, h = 4);
                }
                // Smooth cylindrical shank
                translate([48, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(r = shank_r, h = shank_len);
            }

            // Cross-pin 8 mm bore
            cylinder(d = 8.0, h = yoke_width + 4, center = true);

            // Clevis opening
            translate([-ear_r - 1, -yoke_thick / 2 - 1, -clevis_gap / 2])
                cube([35 + ear_r + 1, yoke_thick + 2, clevis_gap]);

            // Internal articulation pocket
            translate([4, 0, 0])
                sphere(d = clevis_gap + 2);
        }
    }

    // 2. Black section: 36-tooth splined shaft section
    color([0.15, 0.15, 0.17]) {
        translate([48 + shank_len, 0, 0]) {
            rotate([0, 90, 0]) {
                difference() {
                    union() {
                        cylinder(r = spline_root_r2, h = shaft_spline_len);
                        for (i = [0 : spline_teeth - 1]) {
                            rotate([0, 0, i * 360 / spline_teeth])
                                translate([spline_root_r2 - 0.2, -0.42, 0])
                                    cube([1.2, 0.84, shaft_spline_len]);
                        }
                    }
                    // Lead chamfer at shaft tip
                    translate([0, 0, shaft_spline_len - 1.5])
                        difference() {
                            cylinder(r = spline_root_r2 + 2, h = 2);
                            cylinder(r1 = spline_root_r2 + 1.2, r2 = spline_root_r2 - 1.0, h = 2);
                        }
                }
            }
        }
    }
}

// Serrated angle joint (e740c52e)
module serrated_angle_joint() {
    hub_x_start = aj_len - aj_hub_len;
    ear_r_aj    = aj_thick / 2;

    color([0.73, 0.75, 0.78]) {
        difference() {
            union() {
                // Fork cheeks
                for (sign = [-1, 1]) {
                    hull() {
                        translate([0, sign * (clevis_gap / 2 + ear_thick / 2), 0])
                            cylinder(r = ear_r_aj, h = ear_thick, center = true);
                        translate([aj_clevis_len, sign * (clevis_gap / 2 + ear_thick / 2), 0])
                            cube([4, ear_thick, aj_thick], center = true);
                    }
                }

                // Serrated cylindrical neck zone
                hull() {
                    translate([28, 0, 0])
                        rotate([0, 90, 0])
                            cylinder(r = 12.0, h = 4);
                    translate([32, 0, 0])
                        rotate([0, 90, 0])
                            cylinder(r = 10.8, h = 13.0);
                }
                for (i = [0 : 37]) {
                    rotate([i * 360 / 38, 0, 0])
                        translate([32, 0, 10.4])
                            cube([13.0, 0.6, 0.7]);
                }

                // Rectangular clevis clamping hub
                hull() {
                    for (sy = [-1, 1], sz = [-1, 1]) {
                        translate([hub_x_start, sy * (aj_width / 2 - ear_r_aj), sz * (aj_thick / 2 - ear_r_aj)])
                            rotate([0, 90, 0])
                                cylinder(r = ear_r_aj, h = aj_hub_len);
                    }
                }
            }

            // Cross-pin 8 mm bore
            cylinder(d = 8.0, h = aj_width + 4, center = true);

            // Clevis slot between cheeks
            translate([-ear_r_aj - 1, -clevis_gap / 2, -aj_thick / 2 - 1])
                cube([aj_clevis_len + ear_r_aj + 1, clevis_gap, aj_thick + 2]);

            // Swing pocket
            translate([4, 0, 0])
                sphere(d = clevis_gap + 2);

            // Internal splined bore for shaft engagement
            translate([hub_x_start - 2, 0, 0])
                rotate([0, 90, 0])
                    cylinder(r = spline_root_r2, h = aj_hub_len + 4);

            // Clamping slit
            translate([hub_x_start - 1, -aj_width / 2 - 1, -1.0])
                cube([aj_hub_len + 2, 12.0, 2.0]);

            // Web clamping counterbore hole
            translate([hub_x_start + aj_hub_len * 0.5, -aj_width / 2 + 6.5, 0]) {
                cylinder(d = 6.78, h = aj_thick + 4, center = true);
                translate([0, 0, aj_thick / 2 - 3.0])
                    cylinder(d = 17.37, h = 6.5, center = true);
            }
        }
    }
}

// Clamping socket head cap screw
module clamp_bolt() {
    color([0.22, 0.23, 0.25]) {
        cylinder(d = 10.0, h = 6.0);
        translate([0, 0, -18.0])
            cylinder(d = 6.0, h = 18.0);
    }
}

// Grounded slender locating pin (e7477ba8)
module locating_pin() {
    color([0.30, 0.32, 0.35])
        translate([0, 0, 0])
            cube([1.15, 0.013, 0.009], center = true);
}

// ==========================================
// Assembly Reconstruction
// ==========================================

module double_cardan_assembly() {
    // ----------------------------------------------------
    // Right Knuckle Joint (Origin at Right Cross [0, 0, 0])
    // ----------------------------------------------------

    // Right spider / cross element
    cross_spider();

    // Central drive shaft: integrated splined shaft with right inner yoke
    splined_shaft_yoke();

    // Right outer yoke (articulated by joint_angle_1 around Y axis)
    rotate([0, joint_angle_1, 0]) {
        universal_joint_yoke();

        // Clamping fastener for right yoke hub
        translate([-hole_dist + hub_len * 0.45, 0, yoke_thick / 2 - 1.0])
            rotate([180, 0, 0])
                clamp_bolt();

        // Right splined pin extending outward from right yoke hub
        translate([-hole_dist - journal_len + 1.0, 0, 0])
            rotate([0, 90, 0])
                splined_pin();
    }

    // ----------------------------------------------------
    // Left Knuckle Joint (Cross pivot at [cross_distance, 0, 0])
    // ----------------------------------------------------
    translate([cross_distance, 0, 0]) {
        // Left spider / cross element
        cross_spider();

        // Serrated angle joint (inner yoke meshing with center splined shaft)
        rotate([0, 180, 0]) {
            serrated_angle_joint();
            // Clamping fastener for angle joint hub
            translate([aj_len - aj_hub_len * 0.5, -aj_width / 2 + 6.5, aj_thick / 2 - 2.0])
                rotate([180, 0, 0])
                    clamp_bolt();
        }

        // Left outer yoke (articulated by joint_angle_2 around Y axis)
        rotate([0, joint_angle_2, 0]) {
            rotate([0, 0, 180]) {
                universal_joint_yoke();

                // Clamping fastener for left yoke hub
                translate([-hole_dist + hub_len * 0.45, 0, yoke_thick / 2 - 1.0])
                    rotate([180, 0, 0])
                        clamp_bolt();

                // Left splined pin extending outward from left yoke hub
                translate([-hole_dist - journal_len + 1.0, 0, 0])
                    rotate([0, 90, 0])
                        splined_pin();
            }
        }
    }

    // Grounded locating element
    translate([hole_dist + 5.0, -yoke_width / 2, 0])
        locating_pin();
}

// Instantiate complete assembly
double_cardan_assembly();