// Parameters (mm)
curve_segments = 96;
$fn = curve_segments;

eps = 0.02;

// Rounded-ended base
base_length = 110;
base_width = 46;
base_height = 12;

// Raised annular collar
collar_x = 20;
collar_y = 0;
collar_outer_d = 32;
collar_bore_d = 14;
collar_height = 10;

// Lower stepped bore tier
underside_step_d = 24;
underside_step_depth = 4.5;

// True through opening in base
through_slot_x = -30;
through_slot_y = 0;
through_slot_length = 24;
through_slot_width = 12;

// Side circular recesses
side_recess_d = 7.5;
side_recess_depth = 3.2;
side_recess_z = base_height / 2;
side_recess_x_positions = [-24, 0, 24];

// Underside circular cut pattern
underside_pocket_d = 6.5;
underside_pocket_depth = 2.2;
underside_pocket_positions = [
    [-44,  12],
    [-44, -12],
    [ -7,  15],
    [ -7, -15],
    [ 34,  12],
    [ 34, -12]
];

// 2D rounded slot/capsule
module capsule_2d(l, w) {
    hull() {
        translate([-(l - w) / 2, 0]) circle(d = w);
        translate([ (l - w) / 2, 0]) circle(d = w);
    }
}

// Extruded rounded-ended body
module capsule_prism(l, w, h) {
    linear_extrude(height = h, center = false, convexity = 10)
        capsule_2d(l, w);
}

// Base solid
module base_body() {
    capsule_prism(base_length, base_width, base_height);
}

// Collar solid, slightly overlapped into base
module collar_body() {
    translate([collar_x, collar_y, base_height - eps])
        cylinder(h = collar_height + eps, d = collar_outer_d, center = false);
}

// Real through slot cut in the base
module through_slot_cut() {
    translate([through_slot_x, through_slot_y, -eps])
        linear_extrude(height = base_height + 2 * eps, center = false, convexity = 10)
            capsule_2d(through_slot_length, through_slot_width);
}

// Collar bore and separate underside step
module stepped_bore_cuts() {
    translate([collar_x, collar_y, -eps])
        cylinder(h = base_height + collar_height + 2 * eps, d = collar_bore_d, center = false);

    translate([collar_x, collar_y, -eps])
        cylinder(h = underside_step_depth + eps, d = underside_step_d, center = false);
}

// Shallow circular side recess
module side_recess_cut(x_pos, side_sign) {
    translate([
        x_pos,
        side_sign * (base_width / 2 - side_recess_depth / 2),
        side_recess_z
    ])
        rotate([90, 0, 0])
            cylinder(h = side_recess_depth + 2 * eps, d = side_recess_d, center = true);
}

// All side recess cuts
module side_recess_cuts() {
    for (x_pos = side_recess_x_positions) {
        for (side_sign = [-1, 1]) {
            side_recess_cut(x_pos, side_sign);
        }
    }
}

// Shallow underside circular pocket
module underside_pocket_cut(pos) {
    translate([pos[0], pos[1], -eps])
        cylinder(h = underside_pocket_depth + eps, d = underside_pocket_d, center = false);
}

// All underside pocket cuts
module underside_pocket_cuts() {
    for (pos = underside_pocket_positions) {
        underside_pocket_cut(pos);
    }
}

// Main model
difference() {
    union() {
        base_body();
        collar_body();
    }

    through_slot_cut();
    stepped_bore_cuts();
    side_recess_cuts();
    underside_pocket_cuts();
}