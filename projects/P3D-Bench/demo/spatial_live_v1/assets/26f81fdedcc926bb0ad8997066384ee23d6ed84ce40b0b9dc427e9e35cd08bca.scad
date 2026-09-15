// ============================================================
//  Four-digit seven-segment display module
//  Envelope: 50.7 (X) x 19.0 (Z) x 11.0 (Y)
// ============================================================

$fn = 96;

// ---------- overall envelope ----------
L = 50.7;                 // length  (X)
H = 19.0;                 // height  (Z)
D = 11.0;                 // depth   (Y, front face at y = 0)

// ---------- front-face stack ----------
relief  = 0.5;            // raised height of segments / decimal points
plate_t = 0.1;            // thin front datum (shim) plate
body_d  = D - relief - plate_t;   // main housing block depth
eps     = 0.05;           // small overlap so unions stay watertight

// ---------- seven-segment plate geometry ----------
seg_v_len = 5.68;  seg_v_wid = 2.29;   // upright bars
seg_h_len = 6.34;  seg_h_wid = 1.48;   // cross bars
seg_tip   = 0.60;                      // pointed-end taper (x bar width)
seg_th    = relief + eps;              // plate thickness

// ---------- digit layout ----------
xv = 3.0;                              // upright-bar centre offset
zv = 3.94;                             // upright-bar centre height offset
digit_w = 2*xv + seg_v_wid;            // = 8.29
digit_h = 2*zv + seg_v_len;            // = 13.56
zh = digit_h/2 - seg_h_wid/2;          // cross-bar centre height offset
n_digits    = 4;
digit_pitch = 10.9;
digit_x0    = 4.85;                    // left edge of first digit
digit_zc    = H/2;                     // digit centres on front face

// ---------- decimal points ----------
dp_r   = 0.80;
dp_z   = 5.00;                         // decimal point centre height
dp_gap = 1.30;                         // clearance from digit edge

// ---------- locating pins ----------
pin_r     = 0.25;
pin_shank = 2.63;
pin_tip_h = 0.37;
pin_tip_r = 0.08;
n_pins    = 12;
pin_pitch = 3.3;
pin_y     = D - 2.0;                   // near the rear edge of the top face

// ------------------------------------------------------------
// double-pointed hexagon bar profile
module hex_bar(l, w) {
    t = min(seg_tip*w, l/2 - 0.5);
    polygon([[-l/2,0], [-l/2+t, w/2], [l/2-t, w/2],
             [ l/2,0], [ l/2-t,-w/2], [-l/2+t,-w/2]]);
}

// flat plate lying in the XZ plane, front face at local y = 0
module seg_plate(l, w, th = seg_th) {
    rotate([-90,0,0]) linear_extrude(th) hex_bar(l, w);
}

// one 8-figure, centred on the local origin
module digit() {
    for (sx = [-1,1], sz = [-1,1])                       // four upright bars
        translate([sx*xv, 0, sz*zv])
            rotate([0,90,0]) seg_plate(seg_v_len, seg_v_wid);
    for (sz = [-1,0,1])                                  // three cross bars
        translate([0, 0, sz*zh]) seg_plate(seg_h_len, seg_h_wid);
}

// thin disc with a shallow recessed face (ring appearance)
module decimal_point() {
    difference() {
        cylinder(r = dp_r, h = seg_th);
        translate([0, 0, seg_th - 0.15])
            cylinder(r = dp_r*0.55, h = 0.15 + eps);
    }
}

// cylindrical shank with conical guide tip
module locating_pin() {
    translate([0, 0, -eps]) cylinder(r = pin_r, h = pin_shank + eps);
    translate([0, 0, pin_shank])
        cylinder(r1 = pin_r, r2 = pin_tip_r, h = pin_tip_h);
}

// ------------------------------------------------------------
union() {
    // main housing / spacer block
    translate([0, relief + plate_t - eps, 0])
        cube([L, body_d + eps, H]);

    // front-face datum plate
    translate([0, relief, 0]) cube([L, plate_t, H]);

    // four digits with their decimal points
    for (i = [0 : n_digits-1])
        translate([digit_x0 + digit_w/2 + i*digit_pitch, 0, digit_zc]) {
            digit();
            translate([digit_w/2 + dp_gap, 0, dp_z - digit_zc]) decimal_point();
        }

    // row of 12 locating pins along the upper rear edge
    for (i = [0 : n_pins-1])
        translate([L/2 + (i - (n_pins-1)/2)*pin_pitch, pin_y, H])
            locating_pin();
}