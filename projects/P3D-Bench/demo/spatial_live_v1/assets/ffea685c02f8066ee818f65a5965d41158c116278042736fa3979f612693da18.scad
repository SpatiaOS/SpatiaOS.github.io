// =====================================================
//  Hand-crank winch / gear mechanism  (all dimensions mm)
// =====================================================
$fn = 72;

// ---------- main parameters ----------
wheel_R   = 150;   // big wheel outer radius
rim_w     = 40;    // rim width (axial)
rim_t     = 28;    // rim radial thickness
teeth_n   = 60;    // internal ring-gear tooth count
tooth_h   = 9;     // tooth radial height (pointing inward)
tooth_w   = 5;     // tooth tangential width
tooth_y   = 30;    // tooth axial depth
spoke_n   = 24;    // number of wire spokes
spoke_r   = 3.2;   // spoke radius
hub_r     = 30;    // hub radius
hub_len   = 70;    // hub length

axle_r    = 9;     // shaft radius
axle_x    = 10;    // shaft position (x)
axle_z    = 185;   // shaft height above ground

pinion_r  = 44;    // small gear on the hub face
pinion_t  = 18;    // its tooth count

base_w    = 300;   // base plate size
base_d    = 200;
base_th   = 12;
foot_h    = 8;

plate_th  = 12;    // triangular support plate thickness

// ---------- ring-gear tooth (trapezoid, extruded axially) ----------
module tooth() {
    linear_extrude(height = tooth_y, center = true)
        polygon([[-tooth_w/2, 0], [ tooth_w/2, 0],
                 [ tooth_w/4, tooth_h], [-tooth_w/4, tooth_h]]);
}

// ---------- big wheel (axis = Y, origin = axle centre) ----------
module wheel() {
    // hub
    translate([0, hub_len/2, 0]) rotate([90, 0, 0])
        cylinder(h = hub_len, r = hub_r, center = true);

    // solid outer rim
    translate([0, 55, 0]) rotate([90, 0, 0]) rotate_extrude()
        polygon([[wheel_R - rim_t, 0], [wheel_R, 0],
                 [wheel_R, rim_w], [wheel_R - rim_t, rim_w]]);

    // internal gear teeth around the rim
    for (i = [0 : teeth_n - 1])
        rotate([0, i * 360 / teeth_n, 0])
            translate([0, 35, wheel_R - rim_t - tooth_h])
                rotate([90, 0, 0]) tooth();

    // radial wire spokes
    for (i = [0 : spoke_n - 1])
        rotate([0, i * 360 / spoke_n, 0])
            translate([0, 35, (hub_r + wheel_R - rim_t) / 2])
                cylinder(h = wheel_R - rim_t - hub_r + 10, r = spoke_r, center = true);
}

// ---------- small gear on the front of the hub ----------
module pinion() {
    translate([0, -6, 0]) rotate([90, 0, 0])
        cylinder(r = pinion_r, h = 14, center = true);
    for (i = [0 : pinion_t - 1])
        rotate([0, i * 360 / pinion_t, 0])
            translate([0, -6, pinion_r + 5])
                rotate([90, 0, 0]) cube([6, 10, 14], center = true);
}

// ---------- crank arm: square bar + cylindrical grip ----------
module crank_arm(ang, len, yc, grip_len) {
    w  = 13;                          // square bar section
    gr = 9;                           // grip radius
    yg = yc - w/2 - grip_len/2 + 6;   // grip centre along the axle
    rotate([0, ang, 0]) {
        // bar running radially from the collar
        translate([0, yc, (15 + len)/2]) cube([w, w, len - 15], center = true);
        // grip, parallel to the axle, with rounded end cap
        translate([0, yg, len - gr - 1]) rotate([90, 0, 0])
            cylinder(h = grip_len, r = gr, center = true);
        translate([0, yg - grip_len/2, len - gr - 1]) sphere(r = gr);
    }
}

// ---------- triangular support plate ----------
module support_plate() {
    translate([0, -60, 0]) rotate([90, 0, 0]) linear_extrude(height = plate_th)
        polygon([[-150, 20], [50, 20], [50, 240]]);
}

// =====================================================
//  assembly
// =====================================================

// base plate and feet
translate([-20, 20, foot_h + base_th/2]) cube([base_w, base_d, base_th], center = true);
for (xf = [-152, 112], yf = [-62, 102])
    translate([xf, yf, foot_h/2]) cube([36, 36, foot_h], center = true);

// support bracket
support_plate();

// everything on the axle line
translate([axle_x, 0, axle_z]) {
    wheel();
    pinion();

    // shaft
    translate([0, -62.5, 0]) rotate([90, 0, 0])
        cylinder(r = axle_r, h = 215, center = true);

    // bearing boss, sleeve and crank collar
    translate([0, -44.5, 0]) rotate([90, 0, 0]) cylinder(r = 32, h = 63, center = true);
    translate([0, -97,   0]) rotate([90, 0, 0]) cylinder(r = 20, h = 42, center = true);
    translate([0, -139,  0]) rotate([90, 0, 0]) cylinder(r = 24, h = 42, center = true);

    // shaft end cap
    translate([0, -175, 0]) rotate([90, 0, 0]) cylinder(r = 13, h = 14, center = true);

    // crank arms with handles
    crank_arm(-42, 255, -147, 70);
    crank_arm( -8, 165, -127, 60);

    // square-head bolt under the collar
    translate([0, -139, -40]) cylinder(r = 6, h = 40, center = true);
    translate([0, -139, -67]) cube([16, 16, 14], center = true);
}