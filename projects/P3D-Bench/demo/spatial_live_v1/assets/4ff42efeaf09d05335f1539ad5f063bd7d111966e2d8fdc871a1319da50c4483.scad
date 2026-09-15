// Parameters
body_len = 50.7;          // overall length (X)
body_h   = 19.0;          // overall height (Z)
block_d  = 7.9;           // spacer block depth (Y)
shim_t   = 0.1;           // front shim plate thickness
seg_t    = 0.01;          // segment / disc plate thickness
seg_l    = 5.6;           // segment length
seg_w    = 1.4;           // segment width
seg_gap  = 0.3;           // gap between segments
dp_r     = 0.8;           // decimal point disc radius
pin_r    = 0.25;          // pin shank radius
pin_shank= 2.63;          // pin shank length
pin_tip  = 0.37;          // pin conical tip length
pin_tip_r= 0.10;          // pin tip truncation radius
pin_n    = 12;            // number of pins
pin_pitch= 4.0;           // pin spacing along X
pin_z    = body_h - 1.5;  // pin axis height (upper rear edge)
$fn = 48;

// Derived digit layout
zc = seg_w/2 + seg_gap + seg_l/2;          // vertical segment center offset
zt = zc + seg_l/2 + seg_gap + seg_w/2;     // horizontal segment center offset
xv = seg_l/2 + seg_gap + seg_w/2;          // vertical segment x offset
digit_pitch = body_len/4;
front_y = block_d + shim_t;                // y of segment plates
dp_z = body_h/2 - zt + 0.5;                // decimal point height

// Horizontal hexagonal segment plate (pointed ends)
module hex_h(l, w, t) {
    linear_extrude(t)
        polygon([[-l/2,0],[-l/2+w/2,w/2],[l/2-w/2,w/2],
                 [l/2,0],[l/2-w/2,-w/2],[-l/2+w/2,-w/2]]);
}
// Vertical hexagonal segment plate
module hex_v(l, w, t) {
    linear_extrude(t)
        polygon([[0,-l/2],[w/2,-l/2+w/2],[w/2,l/2-w/2],
                 [0,l/2],[-w/2,l/2-w/2],[-w/2,-l/2+w/2]]);
}
// One seven-segment digit at (cx, cz), plates extruded toward +Y from y0
module digit(cx, cz, y0) {
    for (z = [cz+zt, cz, cz-zt])
        translate([cx, y0, z]) rotate([-90,0,0]) hex_h(seg_l, seg_w, seg_t);
    for (z = [cz+zc, cz-zc], s = [-1,1])
        translate([cx+s*xv, y0, z]) rotate([-90,0,0]) hex_v(seg_l, seg_w, seg_t);
}
// Decimal point disc
module dp_disc(x, z, y0) {
    translate([x, y0, z]) rotate([-90,0,0]) cylinder(h=seg_t, r=dp_r);
}
// Locating pin: shank + conical truncated tip, axis along -Y
module pin() {
    rotate([90,0,0]) {
        cylinder(h=pin_shank, r=pin_r);
        translate([0,0,pin_shank]) cylinder(h=pin_tip, r1=pin_r, r2=pin_tip_r);
    }
}

// Unified model
union() {
    // Spacer block (main body)
    cube([body_len, block_d, body_h]);
    // Front shim plate (datum)
    translate([0, block_d, 0]) cube([body_len, shim_t, body_h]);
    // Four digits with decimal points on front face
    for (i = [0:3]) {
        c = digit_pitch*(i+0.5);
        digit(c-1.2, body_h/2, front_y);
        dp_disc(c+5.0, dp_z, front_y);
    }
    // Row of 12 pins on rear face near top edge
    for (i = [0:pin_n-1])
        translate([body_len/2 - (pin_n-1)*pin_pitch/2 + i*pin_pitch, 0, pin_z]) pin();
}