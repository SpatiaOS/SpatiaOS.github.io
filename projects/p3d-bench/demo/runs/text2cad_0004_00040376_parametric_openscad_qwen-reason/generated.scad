$fn = 100;

// Base & Span Parameters
span_len = 0.75;
span_wid = 0.421875;
base_h_lower = 0.1919;
base_h_upper = 0.4424;

// Left Circular Profile
left_cx = 0.2109;
left_cy = 0.2109;
left_r = 0.2109;

// Right Annular Profile
right_cx = 0.6094;
right_cy = 0.2109;
right_r_out = 0.1406;
right_r_in = 0.1055;

// Upper Section Parameters
upper_r = left_r;
upper_inner_r = right_r_in;
upper_wall = upper_r - upper_inner_r;

// Upright Tab Parameters
tab_l = 0.041188;
tab_w = 0.070313;
tab_h = 0.441346;
tab_x = 0.0703;
tab_y = 0.1758;

// Slot & Tolerance Parameters
slot_w = 0.025;
slot_len_lower = 0.12;
slot_len_upper = upper_wall + 0.02;
eps = 0.02; // Clearance to prevent coplanar face artifacts

// Reusable Rounded Slot Module
module rounded_slot(len, wid, hei) {
    r = wid / 2;
    linear_extrude(height = hei, center = true)
        hull() {
            translate([r, 0]) circle(r = r);
            translate([len - r, 0]) circle(r = r);
        }
}

// Main Assembly
union() {
    // Lower base left profile with boundary slot cut
    difference() {
        translate([left_cx, left_cy, 0])
            cylinder(h = base_h_lower, r = left_r, center = false);
        translate([left_cx, left_cy, base_h_lower / 2])
            rotate([0, 0, 45])
            rounded_slot(slot_len_lower, slot_w, base_h_lower + eps);
    }

    // Lower base right annulus with inner void and slot cut
    difference() {
        translate([right_cx, right_cy, 0])
            cylinder(h = base_h_lower, r = right_r_out, center = false);
        translate([right_cx, right_cy, base_h_lower / 2])
            cylinder(h = base_h_lower + eps, r = right_r_in, center = false);
        translate([right_cx, right_cy, base_h_lower / 2])
            rotate([0, 0, -30])
            rounded_slot(slot_len_lower, slot_w, base_h_lower + eps);
    }

    // Upper left section: taller continuation, hollow core, radial slot interruptions
    difference() {
        translate([left_cx, left_cy, 0])
            cylinder(h = base_h_upper, r = upper_r, center = false);
        translate([left_cx, left_cy, base_h_upper / 2])
            cylinder(h = base_h_upper + eps, r = upper_inner_r, center = false);
        translate([left_cx + upper_inner_r, left_cy, base_h_upper / 2])
            rotate([0, 0, 0])
            rounded_slot(slot_len_upper, slot_w, base_h_upper + eps);
        translate([left_cx, left_cy + upper_inner_r, base_h_upper / 2])
            rotate([0, 0, 90])
            rounded_slot(slot_len_upper, slot_w, base_h_upper + eps);
    }

    // Separate upright tab
    translate([tab_x, tab_y, 0])
        cube([tab_l, tab_w, tab_h], center = false);
}