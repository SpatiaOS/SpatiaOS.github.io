// Base datum envelope
base_length = 0.75;
base_width = 0.421875;
base_height = 0.1919;

// Left circular profile (solid disk)
left_cx = 0.2109;
left_cy = 0.2109;
left_r = 0.2109;

// Right concentric circular group (annulus)
right_cx = 0.6094;
right_cy = 0.2109;
right_outer_r = 0.1406;
right_inner_r = 0.1055;

// Upper taller circular section over left-side axis
upper_height = 0.4424;
upper_footprint_w = 0.4218;
upper_footprint_d = 0.4218;
upper_left = 0;
upper_right = 0.3282;
upper_front = 0;
upper_back = 0;
upper_inner_r = right_inner_r; // inner loop void preserved through full height

// Rectangular upright tab
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_left = 0.0703;
tab_front = 0.1758;

// Curved surface resolution
$fn = 100;

// Lower base 2D sketch formed from separate rounded profiles
module lower_profile() {
    union() {
        // Left solid circular profile within full span
        translate([left_cx, left_cy])
            circle(r = left_r);

        // Right annular profile group (outer boundary with true inner void)
        difference() {
            translate([right_cx, right_cy])
                circle(r = right_outer_r);
            translate([right_cx, right_cy])
                circle(r = right_inner_r);
        }
    }
}

// Upper section 2D profile bounded by explicit footprint
module upper_profile() {
    intersection() {
        translate([upper_left, upper_front])
            square([upper_footprint_w, upper_footprint_d]);
        translate([left_cx, left_cy])
            circle(r = left_r);
    }
}

// Rounded slot-like interruptions for annular openings
module opening_slots(h) {
    // Radial slot cuts intersecting the inner loop
    for (a = [45 : 90 : 315])
        rotate([0, 0, a])
            translate([left_cx + upper_inner_r, left_cy, h / 2])
                rotate([0, 90, 0])
                    cylinder(h = 0.06, r = 0.025, center = true, $fn = $fn);
}

// Main assembly
union() {
    // Lower base extruded from base datum
    linear_extrude(height = base_height, convexity = 4)
        lower_profile();

    // Upper circular section: taller continuation from same datum
    difference() {
        linear_extrude(height = upper_height, convexity = 4)
            upper_profile();

        // Inner loop void making section annular where present
        translate([left_cx, left_cy, -0.01])
            cylinder(h = upper_height + 0.02, r = upper_inner_r, $fn = $fn);

        // Rounded slot-like interruptions preserved as true voids
        opening_slots(upper_height);
    }

    // Separate solid rectangular upright tab
    translate([tab_left, tab_front, 0])
        cube([tab_length, tab_width, tab_height]);
}