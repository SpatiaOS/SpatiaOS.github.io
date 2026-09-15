// Overall parameters (mm)
body_len   = 50.7;   // X, overall length
body_h     = 19.0;   // Z, overall height
body_d     = 7.9;    // Y, housing depth
shim_t     = 0.1;    // front shim plate thickness
seg_t      = 0.01;   // segment / disc plate thickness
embed      = 0.005;  // small union overlap for manifold result

// Locating pins
pin_r      = 0.25;
pin_shank  = 2.63;
pin_cone   = 0.37;
pin_tip_r  = 0.06;
pin_n      = 12;
pin_margin = 3.0;

// Digit layout
digit_pitch = body_len/4;
dp_r        = 0.8;   // decimal point disc radius

$fn = 48;

// Pointed-end hexagonal plate extruded toward -Y (front plane = local y=0)
module hex_plate(len, wid, t) {
    hl = len/2; hw = wid/2;
    rotate([90,0,0])
        linear_extrude(height=t)
            polygon([[-hl,0],[-(hl-hw),hw],[hl-hw,hw],
                     [hl,0],[hl-hw,-hw],[-(hl-hw),-hw]]);
}

// One seven-segment style plate on the front face at (x,z)
module segment(len, wid, vertical, x, z) {
    translate([x, -shim_t+embed, z])
        if (vertical)
            rotate([0,-90,0]) hex_plate(len, wid, seg_t+embed);
        else
            hex_plate(len, wid, seg_t+embed);
}

// Decimal point disc on the front face
module decimal(x, z) {
    translate([x, -shim_t+embed, z])
        rotate([90,0,0])
            cylinder(h=seg_t+embed, r=dp_r);
}

// Full digit: seven segments (distinct plates) + decimal point
module digit(cx, cz) {
    segment(5.68, 2.29, false, cx,      cz+6.50);  // a (shim_plate)
    segment(6.34, 1.44, true,  cx+3.10, cz+3.25);  // b (strip_panel)
    segment(6.44, 1.48, true,  cx+3.10, cz-3.25);  // c (double-pointed plate)
    segment(5.70, 2.26, false, cx,      cz-6.50);  // d (panel)
    segment(6.44, 1.48, true,  cx-3.10, cz-3.25);  // e
    segment(6.34, 1.44, true,  cx-3.10, cz+3.25);  // f
    segment(5.61, 2.29, false, cx,      cz);       // g (gusset_plate)
    decimal(cx+4.70, cz-6.50);                     // decimal point
}

// Cylindrical shank + truncated conical tip, axis +Z
module pin() {
    cylinder(h=pin_shank, r=pin_r);
    translate([0,0,pin_shank])
        cylinder(h=pin_cone, r1=pin_r, r2=pin_tip_r);
}

// Assembly
union() {
    // Housing: grounded spacer block + front datum shim plate
    color([0.62,0.62,0.65]) {
        translate([-body_len/2, 0, 0])
            cube([body_len, body_d, body_h]);
        translate([-body_len/2, -shim_t, 0])
            cube([body_len, shim_t, body_h]);
    }
    // Row of 12 locating pins on the upper rear edge
    color([0.50,0.50,0.52])
        for (i = [0:pin_n-1])
            translate([-body_len/2 + pin_margin +
                       i*(body_len-2*pin_margin)/(pin_n-1),
                       body_d-embed, body_h])
                rotate([-90,0,0]) pin();
    // Four digits on the front face
    color([0.45,0.45,0.48])
        for (k = [0:3])
            digit((k-1.5)*digit_pitch, body_h/2);
}