// 4-Digit 7-Segment Display Module
// Dimensions in millimeters

$fn = 40;

// Housing & front plate parameters
box_w = 50.7;
box_h = 19.0;
box_d = 7.9;
shim_t = 0.1;

// Segment plate parameters
seg_len_h   = 6.40;
seg_len_v   = 5.65;
seg_w       = 1.46;
seg_t       = 0.01;
slant_angle = 8.2;
y_top       = 5.85;
y_mid       = 2.925;
x_side      = 3.35;

// Decimal point parameters
dp_r = 0.80;
dp_x = 4.80;
dp_y = -5.85;

// Digit array parameters
digit_pitch = 11.8;

// Pin parameters
pin_count = 12;
pin_pitch = 2.54;
pin_r     = 0.25;
pin_shank = 2.63;
pin_cone  = 0.37;
pin_tip_r = 0.08;
pin_y     = box_h / 2 - 1.2;

// Hexagonal segment plate
module segment_plate(len, w, t) {
    linear_extrude(height = t, center = true) {
        polygon(points = [
            [-len / 2, 0],
            [-len / 2 + w / 2,  w / 2],
            [ len / 2 - w / 2,  w / 2],
            [ len / 2, 0],
            [ len / 2 - w / 2, -w / 2],
            [-len / 2 + w / 2, -w / 2]
        ]);
    }
}

// Single 7-segment digit with decimal point
module digit() {
    multmatrix([
        [1, tan(slant_angle), 0, 0],
        [0, 1,                0, 0],
        [0, 0,                1, 0],
        [0, 0,                0, 1]
    ]) {
        // Horizontal segments (a, g, d)
        translate([0,  y_top, 0]) segment_plate(seg_len_h, seg_w, seg_t);
        translate([0,      0, 0]) segment_plate(seg_len_h, seg_w, seg_t);
        translate([0, -y_top, 0]) segment_plate(seg_len_h, seg_w, seg_t);

        // Vertical segments (f, b, e, c)
        translate([-x_side,  y_mid, 0]) rotate([0, 0, 90]) segment_plate(seg_len_v, seg_w, seg_t);
        translate([ x_side,  y_mid, 0]) rotate([0, 0, 90]) segment_plate(seg_len_v, seg_w, seg_t);
        translate([-x_side, -y_mid, 0]) rotate([0, 0, 90]) segment_plate(seg_len_v, seg_w, seg_t);
        translate([ x_side, -y_mid, 0]) rotate([0, 0, 90]) segment_plate(seg_len_v, seg_w, seg_t);
    }

    // Circular decimal point
    translate([dp_x, dp_y, 0])
        cylinder(h = seg_t, r = dp_r, center = true);
}

// Locating pin
module locating_pin() {
    cylinder(h = pin_shank, r = pin_r);
    translate([0, 0, pin_shank])
        cylinder(h = pin_cone, r1 = pin_r, r2 = pin_tip_r);
}

// Complete Assembly
union() {
    // Spacer block (main housing)
    color([0.55, 0.55, 0.55])
        translate([0, 0, -box_d / 2])
            cube([box_w, box_h, box_d], center = true);

    // Front datum shim plate
    color([0.50, 0.50, 0.50])
        translate([0, 0, shim_t / 2])
            cube([box_w, box_h, shim_t], center = true);

    // 4 digits with decimal points
    color([0.85, 0.85, 0.85]) {
        for (i = [0 : 3]) {
            translate([(i - 1.5) * digit_pitch, 0, shim_t + seg_t / 2])
                digit();
        }
    }

    // 12 locating pins on upper rear edge
    color([0.75, 0.75, 0.78]) {
        for (i = [0 : pin_count - 1]) {
            translate([(i - (pin_count - 1) / 2) * pin_pitch, pin_y, -box_d])
                rotate([180, 0, 0])
                    locating_pin();
        }
    }
}