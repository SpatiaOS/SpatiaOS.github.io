/*
 * Parametric Suspension Assembly Reconstruction
 * 
 * This model reconstructs a mechanical suspension assembly based on 
 * provided rendered images and structural text descriptions.
 * It includes a main subframe, upper and lower A-arms (linkages),
 * a central upright/knuckle, a vented pulley/brake disc, and connecting pins.
 */

// --- Global Parameters ---
$fn = 60; // Smoothness for curved surfaces

// Key Coordinate References
sub_x = -20;          // Subframe base X position
sub_z = 175;          // Subframe center Z height
low_piv_z = 0;        // Lower A-arm pivot Z height
up_piv_z = 350;       // Upper A-arm pivot Z height
piv_y = 160;          // Y-offset for all pivots (half-width)
wheel_x = 340;        // Spindle/Wheel center X
wheel_z = 175;        // Spindle/Wheel center Z
low_bj_x = 350;       // Lower ball joint X
low_bj_z = -20;       // Lower ball joint Z
up_bj_x = 320;        // Upper ball joint X
up_bj_z = 370;        // Upper ball joint Z
top_plate_z = 400;    // Top steering/aero plate Z

// --- Modules ---

module subframe() {
    // Main skeletal frame and grounded flat bar
    difference() {
        // Main structural block
        translate([sub_x, 0, sub_z])
            minkowski() {
                cube([40, 480, 480], center=true);
                sphere(10);
            }
        // Central open web cutout
        translate([sub_x, 0, sub_z])
            minkowski() {
                cube([60, 360, 360], center=true);
                sphere(10);
            }
    }
    
    // Clevis mounts for A-arms
    for (z = [low_piv_z, up_piv_z]) {
        for (y = [-piv_y, piv_y]) {
            translate([10, y + 30, z]) cube([60, 15, 60], center=true);
            translate([10, y - 30, z]) cube([60, 15, 60], center=true);
        }
    }
    
    // Grounded flat bar spanning the top (600x50x10)
    translate([sub_x, 0, sub_z + 255]) 
        cube([50, 600, 10], center=true);
}

module lower_a_arm() {
    // Triangular linkage bracket (c0024a12)
    thickness = 25;
    difference() {
        union() {
            // Main webbed body
            linear_extrude(height=thickness, center=true) {
                difference() {
                    // Outer contour
                    hull() {
                        translate([20, piv_y]) circle(d=60);
                        translate([20, -piv_y]) circle(d=60);
                        translate([low_bj_x, 0]) circle(d=50);
                    }
                    // Inner open web cutout
                    hull() {
                        translate([80, piv_y - 50]) circle(d=40);
                        translate([80, -(piv_y - 50)]) circle(d=40);
                        translate([low_bj_x - 70, 0]) circle(d=30);
                    }
                }
            }
            // Pivot Bosses
            for (y = [-piv_y, piv_y]) {
                translate([20, y, 0]) rotate([90, 0, 0]) cylinder(h=70, d=50, center=true);
            }
            // Tip Boss for ball joint
            translate([low_bj_x, 0, 0]) cylinder(h=40, d=45, center=true);
        }
        // Through-holes for pins
        for (y = [-piv_y, piv_y]) {
            translate([20, y, 0]) rotate([90, 0, 0]) cylinder(h=110, d=40, center=true);
        }
        // Tip clevis hole
        translate([low_bj_x, 0, 0]) cylinder(h=50, d=30, center=true);
    }
}

module upper_a_arm() {
    // U-shaped curved link arm (bfd260d0)
    difference() {
        union() {
            // Curved B-spline arms approximated with hulls
            for (y = [-piv_y, piv_y]) {
                hull() {
                    translate([20, y, up_piv_z]) rotate([90, 0, 0]) cylinder(h=50, d=45, center=true);
                    translate([150, y * 0.6, up_piv_z + 10]) sphere(d=35);
                    translate([up_bj_x, 0, up_bj_z]) sphere(d=40);
                }
            }
            // Pivot Bosses
            for (y = [-piv_y, piv_y]) {
                translate([20, y, up_piv_z]) rotate([90, 0, 0]) cylinder(h=70, d=50, center=true);
            }
            // Tip Boss
            translate([up_bj_x, 0, up_bj_z]) cylinder(h=40, d=45, center=true);
        }
        // Through-holes for pivot pins
        for (y = [-piv_y, piv_y]) {
            translate([20, y, up_piv_z]) rotate([90, 0, 0]) cylinder(h=110, d=40, center=true);
        }
        // Tip hole
        translate([up_bj_x, 0, up_bj_z]) cylinder(h=50, d=30, center=true);
        
        // Locating recess blind hole (Ø50 x 15)
        translate([150, 0, up_piv_z + 20]) cylinder(h=30, d=50, center=true);
    }
}

module upright() {
    // Host part / Knuckle connecting A-arms and holding the spindle
    difference() {
        union() {
            // Main vertical body
            hull() {
                translate([low_bj_x, 0, low_bj_z]) sphere(d=50);
                translate([wheel_x, 0, wheel_z]) sphere(d=65);
                translate([up_bj_x, 0, up_bj_z]) sphere(d=50);
            }
            // Spindle base
            translate([wheel_x, 0, wheel_z]) rotate([0, 90, 0]) cylinder(h=30, d=90);
            // Spindle shaft
            translate([wheel_x, 0, wheel_z]) rotate([0, 90, 0]) cylinder(h=120, d=40);
            
            // Mounting pad for top plate
            hull() {
                translate([up_bj_x, 0, up_bj_z]) sphere(d=50);
                translate([up_bj_x - 20, 0, top_plate_z - 4]) cube([50, 60, 8], center=true);
            }
        }
        // Ball joint pin bores
        translate([low_bj_x, 0, low_bj_z]) cylinder(h=80, d=30, center=true);
        translate([up_bj_x, 0, up_bj_z]) cylinder(h=80, d=30, center=true);
    }
}

module top_plate() {
    // Flat plate mounted to the top of the upright
    translate([up_bj_x - 60, 0, top_plate_z]) {
        difference() {
            linear_extrude(height=8, center=true) {
                hull() {
                    translate([60, 0]) circle(d=60);
                    translate([-40, 130]) circle(d=20);
                    translate([-40, -130]) circle(d=20);
                }
            }
            // Center mounting hole
            cylinder(h=20, d=15, center=true);
        }
    }
}

module pulley_disc() {
    // Vented brake/pulley disc (bfd21264)
    // Mounted coaxially on the spindle
    translate([wheel_x + 40, 0, wheel_z]) rotate([0, 90, 0]) {
        difference() {
            union() {
                // Inner friction ring
                cylinder(h=8, d=230, center=true);
                // Outer friction ring
                translate([0, 0, 18]) cylinder(h=8, d=230, center=true);
                // Internal cooling vanes
                for (i = [0:15:345]) {
                    rotate([0, 0, i]) translate([75, 0, 9]) cube([75, 6, 10], center=true);
                }
                // Stepped Hub
                translate([0, 0, 30]) cylinder(h=32, d=140, center=true);
                cylinder(h=18, d1=140, d2=140, center=true);
            }
            // Central spindle bore
            cylinder(h=100, d=40, center=true);
            // 5x Ø14mm Bolt-circle through-holes
            for (i = [0:72:359]) {
                rotate([0, 0, i]) translate([50, 0, 0]) cylinder(h=100, d=14, center=true);
            }
            // Periodic rim notches (R=4mm)
            for (i = [0:12:359]) {
                rotate([0, 0, i]) translate([115, 0, 9]) cylinder(h=30, r=4, center=true);
            }
        }
    }
}

module pins() {
    // 4x Pivot Pins (Ø40 x 100mm)
    for (z = [low_piv_z, up_piv_z]) {
        for (y = [-piv_y, piv_y]) {
            translate([20, y, z]) rotate([90, 0, 0]) cylinder(h=100, d=40, center=true);
        }
    }
    // 2x Grounded/Ball-joint Pins (Ø30 x 90mm)
    translate([low_bj_x, 0, low_bj_z]) cylinder(h=90, d=30, center=true);
    translate([up_bj_x, 0, up_bj_z]) cylinder(h=90, d=30, center=true);
    
    // 1x Additional Pin (Ø30 x 100mm) top plate mount
    translate([up_bj_x - 60, 0, top_plate_z]) cylinder(h=100, d=14, center=true);
}

// --- Main Assembly ---
color([0.75, 0.76, 0.78]) {
    subframe();
    lower_a_arm();
    upper_a_arm();
    upright();
    top_plate();
    pulley_disc();
}

color([0.6, 0.6, 0.65]) {
    pins();
}