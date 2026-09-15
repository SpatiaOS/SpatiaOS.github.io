// Parametric Mechanical Assembly: Scissor Assembly
// Units: mm

$fn = 60;

// Assembly kinematic parameter
open_angle = 3.5; // Opening half-angle in degrees

// Fastener parameters (Part 879270a6)
fastener_length = 6.00;
shaft_radius    = 0.876;
shaft_length    = 4.00;
head1_radius    = 2.66;  // Front head (with slot)
head2_radius    = 2.56;  // Back head
head_thickness  = 1.00;
slot_width      = 0.80;
slot_depth      = 0.60;
slot_angle      = 55.0;  // Slot rotation angle

// Blade & Bore parameters
pivot_bore_d    = 1.583;
blade_thickness = 2.00;
handle_thickness= 7.00;
boss_radius     = 2.654;

// Helper: Extrude 2D (Y, Z) profile along X-axis
module to_yz(x_start, thickness) {
    translate([x_start, 0, 0])
    multmatrix([
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
    linear_extrude(height = thickness, convexity = 10)
    children();
}

// Fastener Module (Part 879270a6)
module slotted_knob_fastener() {
    color([0.78, 0.79, 0.82])
    rotate([0, 90, 0]) {
        // Central shaft
        cylinder(h = shaft_length, r = shaft_radius, center = true);

        // Front slotted disc head (+X)
        translate([0, 0, shaft_length / 2])
        difference() {
            cylinder(h = head_thickness, r = head1_radius);
            rotate([0, 0, slot_angle])
            translate([0, 0, head_thickness - slot_depth / 2 + 0.01])
            cube([head1_radius * 2 + 1, slot_width, slot_depth + 0.02], center = true);
        }

        // Back flanged disc head (-X)
        translate([0, 0, -shaft_length / 2 - head_thickness])
        cylinder(h = head_thickness, r = head2_radius);
    }
}

// 2D Profiles for Finger Loop Blade (Part 876d838a)
module blade1_2d() {
    polygon([
        [0.0, 0.0],
        [0.0, -20.0],
        [0.0, -50.0],
        [0.0, -75.0],
        [0.0, -88.0],
        [-0.4, -91.0],
        [-1.2, -92.0],
        [-2.0, -91.2],
        [-3.0, -86.0],
        [-4.8, -72.0],
        [-6.8, -52.0],
        [-8.6, -32.0],
        [-10.0, -15.0],
        [-10.5, 0.0],
        [-6.0, 6.0],
        [0.0, 6.0]
    ]);
}

module handle1_outer_2d() {
    hull() {
        translate([0.0, 0.0]) circle(r = 6.0);
        translate([5.0, 22.0]) circle(r = 6.5);
        translate([13.0, 22.0]) circle(r = 6.0);
        translate([14.5, 52.0]) circle(r = 7.0);
        translate([4.0, 52.0]) circle(r = 7.0);
        translate([8.5, 61.0]) circle(r = 6.4);
    }
    // Stopper bumper
    translate([-3.8, 33.0]) circle(r = 2.0);
}

module handle1_inner_2d() {
    hull() {
        translate([7.0, 28.0]) circle(r = 4.5);
        translate([9.5, 50.0]) circle(r = 5.5);
    }
}

module handle1_groove_2d() {
    difference() {
        hull() {
            translate([7.0, 28.0]) circle(r = 6.5);
            translate([9.5, 50.0]) circle(r = 7.5);
        }
        hull() {
            translate([7.0, 28.0]) circle(r = 4.8);
            translate([9.5, 50.0]) circle(r = 5.8);
        }
    }
}

// Finger-Loop Blade Half (Part 876d838a)
module scissor_blade_finger() {
    color([0.84, 0.85, 0.87])
    difference() {
        union() {
            // Blade & pivot tang (2 mm thick, X in [0, 2])
            to_yz(0, blade_thickness)
            blade1_2d();

            // Thick molded handle (7 mm thick, X in [-1, 6])
            to_yz(-1.0, handle_thickness)
            difference() {
                handle1_outer_2d();
                handle1_inner_2d();
            }

            // Smooth neck transition between pivot tang and handle
            hull() {
                to_yz(0, blade_thickness)
                translate([0, 8]) square([8, 6], center = true);

                to_yz(-1.0, handle_thickness)
                translate([4, 18]) square([12, 6], center = true);
            }
        }

        // Pivot bore
        rotate([0, 90, 0])
        cylinder(h = 20, d = pivot_bore_d, center = true);

        // Blade cutting bevel cut (along outer +X face)
        hull() {
            translate([0.6, 0.5, -2]) cube([2.0, 0.1, 0.1]);
            translate([2.1, -3.0, -2]) cube([0.1, 0.1, 0.1]);
            translate([0.6, 0.5, -93]) cube([2.0, 0.1, 0.1]);
            translate([2.1, -1.0, -93]) cube([0.1, 0.1, 0.1]);
        }

        // Ergonomic sculpted groove on front face of handle
        to_yz(5.4, 0.8)
        handle1_groove_2d();

        // Ergonomic sculpted groove on back face of handle
        to_yz(-1.2, 0.8)
        handle1_groove_2d();
    }
}

// 2D Profiles for Thumb Loop Blade (Part 877ec19e)
module blade2_2d() {
    polygon([
        [0.0, 0.0],
        [0.0, -20.0],
        [0.0, -50.0],
        [0.0, -75.0],
        [0.0, -90.0],
        [0.0, -95.8],
        [0.6, -95.0],
        [2.0, -90.0],
        [4.0, -75.0],
        [6.2, -55.0],
        [8.2, -35.0],
        [9.5, -15.0],
        [8.5, 0.0],
        [6.0, 6.0],
        [0.0, 6.0]
    ]);
}

module handle2_neck_2d() {
    hull() {
        translate([0, 0]) circle(r = 6.0);
        translate([-6, 12]) circle(r = 5.0);
    }
    hull() {
        translate([-6, 12]) circle(r = 5.0);
        translate([-16, 26]) circle(r = 5.5);
    }
    hull() {
        translate([-16, 26]) circle(r = 5.5);
        translate([-26.0, 43.5]) circle(r = 6.0);
    }
}

module handle2_outer_2d() {
    handle2_neck_2d();
    translate([-26.0, 43.5])
    rotate([0, 0, 20])
    hull() {
        translate([0, -4.5]) circle(r = 10.5);
        translate([0, 4.5]) circle(r = 11.0);
    }
}

module handle2_inner_2d() {
    translate([-26.0, 43.5])
    rotate([0, 0, 20])
    hull() {
        translate([0, -3.0]) circle(r = 6.5);
        translate([0, 3.0]) circle(r = 7.0);
    }
}

module handle2_groove_2d() {
    translate([-26.0, 43.5])
    rotate([0, 0, 20])
    difference() {
        hull() {
            translate([0, -3.2]) circle(r = 8.8);
            translate([0, 3.2]) circle(r = 9.2);
        }
        hull() {
            translate([0, -3.0]) circle(r = 6.8);
            translate([0, 3.0]) circle(r = 7.2);
        }
    }
}

// Thumb-Loop Blade Half (Part 877ec19e)
module scissor_blade_thumb() {
    color([0.82, 0.83, 0.85])
    difference() {
        union() {
            // Blade & pivot tang (2 mm thick, X in [-2, 0])
            to_yz(-blade_thickness, blade_thickness)
            blade2_2d();

            // Pivot boss seating the back fastener head
            translate([-2.2, 0, 0])
            rotate([0, 90, 0])
            cylinder(h = 0.4, r = boss_radius);

            // Thick molded handle (7 mm thick, X in [-6, 1])
            to_yz(-6.0, handle_thickness)
            difference() {
                handle2_outer_2d();
                handle2_inner_2d();
            }

            // Smooth neck transition between pivot tang and handle
            hull() {
                to_yz(-blade_thickness, blade_thickness)
                translate([-2, 8]) square([6, 6], center = true);

                to_yz(-6.0, handle_thickness)
                translate([-10, 18]) square([10, 6], center = true);
            }
        }

        // Pivot bore
        rotate([0, 90, 0])
        cylinder(h = 20, d = pivot_bore_d, center = true);

        // Blade cutting bevel cut (along outer -X face)
        hull() {
            translate([-2.6, -0.5, -2]) cube([2.0, 0.1, 0.1]);
            translate([-2.1, 3.0, -2]) cube([0.1, 0.1, 0.1]);
            translate([-2.6, -0.5, -96]) cube([2.0, 0.1, 0.1]);
            translate([-2.1, 1.0, -96]) cube([0.1, 0.1, 0.1]);
        }

        // Ergonomic sculpted groove on front face of handle
        to_yz(0.4, 0.8)
        handle2_groove_2d();

        // Ergonomic sculpted groove on back face of handle
        to_yz(-6.2, 0.8)
        handle2_groove_2d();
    }
}

// Complete Scissor Assembly
module scissor_assembly() {
    // Front blade half (rotates counter-clockwise about pivot axis X)
    rotate([-open_angle, 0, 0])
    scissor_blade_finger();

    // Back blade half (rotates clockwise about pivot axis X)
    rotate([open_angle, 0, 0])
    scissor_blade_thumb();

    // Coaxial pivot fastener
    slotted_knob_fastener();
}

// Render complete assembly
scissor_assembly();