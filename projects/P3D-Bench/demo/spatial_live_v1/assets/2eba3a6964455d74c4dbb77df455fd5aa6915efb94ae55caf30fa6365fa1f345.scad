// 4-digit 7-segment display module
$fn = 32;

body_l = 50.7;
body_h = 19.0;
body_d = 7.9;
shim_t = 0.1;
seg_t  = 0.01;

digit_w     = 8.0;
digit_h     = 14.2;
seg_w       = 1.56;
seg_gap     = 0.34;
digit_pitch = 12.45;
n_digits    = 4;

dp_r  = 0.80;
dp_ox = 5.05;
dp_oy = -6.20;

pin_r      = 0.25;
pin_shank  = 2.63;
pin_cone   = 0.37;
pin_tip_r  = 0.06;
pin_pitch  = 2.54;
n_pins     = 12;
pin_y      = body_h - 1.10;
pin_ol     = 0.25;

ol = 0.02;

module hex_bar_2d(len, wid) {
    hi = wid / 2;
    polygon([
        [-len/2,        0],
        [-len/2 + hi,  hi],
        [ len/2 - hi,  hi],
        [ len/2,        0],
        [ len/2 - hi, -hi],
        [-len/2 + hi, -hi]
    ]);
}

module digit_2d() {
    hy = (digit_h - seg_w) / 2;
    vx = (digit_w - seg_w) / 2;
    hl = digit_w - seg_w - seg_gap;
    vl = hy - seg_gap;
    translate([ 0,  hy]) hex_bar_2d(hl, seg_w);
    translate([ 0,   0]) hex_bar_2d(hl, seg_w);
    translate([ 0, -hy]) hex_bar_2d(hl, seg_w);
    translate([ vx,  hy/2]) rotate(90) hex_bar_2d(vl, seg_w);
    translate([ vx, -hy/2]) rotate(90) hex_bar_2d(vl, seg_w);
    translate([-vx,  hy/2]) rotate(90) hex_bar_2d(vl, seg_w);
    translate([-vx, -hy/2]) rotate(90) hex_bar_2d(vl, seg_w);
}

module locating_pin() {
    cylinder(h = pin_shank + pin_ol, r = pin_r);
    translate([0, 0, pin_shank + pin_ol])
        cylinder(h = pin_cone, r1 = pin_r, r2 = pin_tip_r);
}

union() {
    cube([body_l, body_h, body_d]);

    translate([0, 0, -shim_t])
        cube([body_l, body_h, shim_t + ol]);

    first_cx = (body_l - (n_digits - 1) * digit_pitch) / 2;
    cy = body_h / 2;
    zseg = -shim_t - seg_t;
    for (i = [0 : n_digits - 1]) {
        cx = first_cx + i * digit_pitch;
        translate([cx, cy, zseg])
            linear_extrude(height = seg_t + ol, convexity = 8)
                digit_2d();
        translate([cx + dp_ox, cy + dp_oy, zseg])
            cylinder(h = seg_t + ol, r = dp_r);
    }

    first_px = (body_l - (n_pins - 1) * pin_pitch) / 2;
    for (i = [0 : n_pins - 1]) {
        translate([first_px + i * pin_pitch, pin_y, body_d - pin_ol])
            locating_pin();
    }
}