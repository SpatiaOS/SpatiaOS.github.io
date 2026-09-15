// =====================================================================
//  4-digit seven-segment display block
//  housing + front shim panel + 28 segment plates + 4 decimal discs
//  + 12 rear locating pins
// =====================================================================
$fn = 96;

// ---------- Housing (spacer block) ----------
body_len   = 50.7;    // X  (length)
body_hgt   = 19.0;    // Y  (height)
body_dep   = 7.9;     // Z  (depth of solid block)

// ---------- Front shim plate (datum face) ----------
panel_thk  = 0.1;

// ---------- Seven-segment plates ----------
seg_thk    = 0.01;    // plate thickness
seg_w      = 1.45;    // segment width
seg_gap    = 0.20;    // gap at the mitred segment junctions
seg_lv     = 5.70;    // vertical segment, tip to tip
seg_lh     = 6.20;    // horizontal segment, tip to tip
hc         = seg_lv + 2*seg_gap;        // vertical centreline pitch
wc         = (seg_lh + 2*seg_gap)/2;    // horizontal centreline half span
italic_deg = 8;                          // digit slant

// ---------- Digit layout ----------
n_digits    = 4;
digit_pitch = 11.4;
digit_x0    = 0;                 // group offset along X
digit_cy    = body_hgt/2;

// ---------- Decimal point discs ----------
dp_r   = 0.8026;
dp_thk = 0.01;
dp_dx  = 4.4;                    // right of digit centre
dp_dy  = -hc;                    // baseline height

// ---------- Locating pins ----------
n_pins    = 12;
pin_pitch = 2.54;
pin_r     = 0.25;
pin_shank = 2.63;
pin_cone  = 0.37;
pin_tip_r = 0.08;
pin_y     = body_hgt - 1.0;      // row sits along the upper rear edge

// =====================================================================
//  Helper modules
// =====================================================================

// elongated hexagon: rectangle with 45 deg pointed ends
module segment_profile(len, w) {
    polygon([[-len/2,      0   ],
             [-len/2+w/2,  w/2 ],
             [ len/2-w/2,  w/2 ],
             [ len/2,      0   ],
             [ len/2-w/2, -w/2 ],
             [-len/2+w/2, -w/2 ]]);
}

module segment_plate(len, w) {
    linear_extrude(height = seg_thk) segment_profile(len, w);
}

// italic shear about the digit centre (x displaced proportionally to y)
module italic() {
    multmatrix([[1, tan(italic_deg), 0, 0],
                [0, 1,               0, 0],
                [0, 0,               1, 0],
                [0, 0,               0, 1]]) children();
}

// seven segment plates of one digit, local origin = digit centre
module digit() {
    // A (top), G (middle), D (bottom)
    for (yy = [hc, 0, -hc])
        translate([0, yy, 0]) segment_plate(seg_lh, seg_w);
    // F, B (upper verticals) and E, C (lower verticals)
    for (xx = [-wc, wc], yy = [hc/2, -hc/2])
        translate([xx, yy, 0]) rotate([0, 0, 90]) segment_plate(seg_lv, seg_w);
}

// cylindrical shank with short conical, flat-topped tip (built along +Z)
module locating_pin() {
    cylinder(h = pin_shank, r = pin_r);
    translate([0, 0, pin_shank])
        cylinder(h = pin_cone, r1 = pin_r, r2 = pin_tip_r);
}

// =====================================================================
//  Assembly
// =====================================================================
union() {

    // housing block, front face on z = 0
    translate([-body_len/2, 0, -body_dep])
        cube([body_len, body_hgt, body_dep]);

    // front shim plate / datum face
    translate([-body_len/2, 0, 0])
        cube([body_len, body_hgt, panel_thk]);

    // digits and their decimal points
    for (i = [0 : n_digits-1]) {
        dx = digit_x0 + digit_pitch * (i - (n_digits-1)/2);

        translate([dx, digit_cy, panel_thk]) italic() digit();

        translate([dx + dp_dx, digit_cy + dp_dy, panel_thk])
            cylinder(h = dp_thk, r = dp_r);
    }

    // rear pin row (protrudes rearwards from the upper part of the back face)
    for (j = [0 : n_pins-1])
        translate([pin_pitch * (j - (n_pins-1)/2), pin_y, -body_dep])
            mirror([0, 0, 1]) locating_pin();
}