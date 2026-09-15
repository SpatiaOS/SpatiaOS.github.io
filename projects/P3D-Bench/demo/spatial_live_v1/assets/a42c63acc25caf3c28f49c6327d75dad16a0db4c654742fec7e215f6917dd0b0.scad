// =====================================================================
//  Cartoon toy tank (T-34 style) -- all dimensions in mm
// =====================================================================
$fn = 64;

// ----------------------------- parameters ---------------------------
// running gear
wheel_r  = 6.5;                    // road wheel radius
trk_thk  = 1.3;                    // track band thickness
trk_w    = 9;                      // track width
trk_x    = 17;                     // half wheel base (y)
hull_w   = 24;                     // hull width between tracks
n_whl    = 4;                      // road wheels per side

wz       = wheel_r + trk_thk;      // axle height
trk_cx   = hull_w/2 + trk_w/2;     // track centre x
trk_top  = 2 * wz;                 // top of the track band
whl_off  = 1.3;                    // sidewards wheel offset

// turret
tur_y    = -4;                     // turret centre (y)
tur_R    = 12.5;                   // hexagonal base circumradius
tur_h    = 5.5;                    // base height
dome_r   = 11.5;                   // dome radius
tur_z    = 19.5;                   // seat height (hull deck top)
dome_z   = tur_z + 1.2 + tur_h;    // dome centre height

// main gun
gun_z    = 24;                     // gun axis height
barrel_r = 2.2;

// ----------------------------- helpers ------------------------------
module box(w, d, h, x = 0, y = 0, z = 0)
    translate([x, y, z]) cube([w, d, h], center = true);

// cylinder between two points
module rod(p1, p2, r, fn = 16) {
    v = p2 - p1;
    translate(p1)
        rotate([0, 0, atan2(v[1], v[0])])
            rotate([0, atan2(sqrt(v[0]*v[0] + v[1]*v[1]), v[2]), 0])
                cylinder(h = norm(v), r = r, $fn = fn);
}

// align children's +z axis with vector v
module dir_align(v)
    rotate([0, 0, atan2(v[1], v[0])])
        rotate([0, atan2(sqrt(v[0]*v[0] + v[1]*v[1]), v[2]), 0])
            children();

// ------------------------------ track -------------------------------
module lug2d(cx, cy, th, R, t = 1.4, w = 3.0) {
    translate([cx + (R + t/2) * cos(th), cy + (R + t/2) * sin(th)])
        rotate(th + 90) square([w, t], center = true);
}

module track_outer_2d() {
    union() {
        hull() {                                          // oval band
            translate([wz,  trk_x]) circle(r = wz);
            translate([wz, -trk_x]) circle(r = wz);
        }
        for (y = [-14 : 3.5 : 14])                        // tread lugs, bottom
            translate([-0.6, y]) square([1.2, 2.6], center = true);
        for (th = [-72 : 24 : 72])  lug2d(wz,  trk_x, th, wz);
        for (th = [108 : 24 : 252]) lug2d(wz, -trk_x, th, wz);
    }
}

module track(side) {
    translate([side * trk_cx, 0, 0])
        rotate([0, -90, 0])
            linear_extrude(height = trk_w, center = true)
                difference() {
                    track_outer_2d();
                    hull() {                                  // inner opening
                        translate([wz,  trk_x]) circle(r = wheel_r);
                        translate([wz, -trk_x]) circle(r = wheel_r);
                    }
                }
}

// ---------------------------- road wheels ---------------------------
module road_wheel(side, y) {
    translate([side * (trk_cx + whl_off), y, wz])
        rotate([0, 90 * side, 0])
            difference() {
                union() {
                    cylinder(h = 3.8, r = wheel_r - 0.15, center = true);
                    cylinder(h = 5.6, r = 1.9, center = true, $fn = 32);
                }
                for (a = [0 : 72 : 359])                      // lightening holes
                    rotate([0, 0, a])
                        translate([3.4, 0, 0])
                            cylinder(h = 8, r = 1.0, center = true, $fn = 24);
            }
}

// ----------------------------- fenders ------------------------------
module fender(side) {
    translate([side * (trk_cx + 0.3), 0, 0]) {
        translate([0, 0, trk_top + 0.6])
            cube([trk_w + 2.6, 50, 1.2], center = true);
        translate([0,  25, trk_top - 1.0]) rotate([-30, 0, 0])
            cube([trk_w + 2.6, 5, 1.2], center = true);
        translate([0, -25, trk_top - 1.0]) rotate([ 30, 0, 0])
            cube([trk_w + 2.6, 5, 1.2], center = true);
    }
}

// ------------------------------ hull --------------------------------
module hull_body() {
    box(hull_w, 48, 8, 0, 0, 10);                      // lower hull, z 6..14
    hull() {                                           // deck + sloped glacis
        box(hull_w,     46, 3, 0, -1, 15);             // z 13.5..16.5
        box(hull_w - 2, 38, 3, 0, -5, 18);             // z 16.5..19.5
    }
}

// ----------------------------- turret -------------------------------
module turret() {
    translate([0, tur_y, 0]) {
        translate([0, 0, tur_z + 0.6]) cylinder(h = 1.2,   r = tur_R, $fn = 48);
        translate([0, 0, tur_z + 1.2]) cylinder(h = tur_h, r = tur_R, $fn = 6);
        translate([0, 0, dome_z])      scale([1, 1, 0.85]) sphere(r = dome_r);
    }
}

// ---------------------------- main gun ------------------------------
module main_gun() {
    translate([0, tur_y, gun_z]) rotate([-90, 0, 0]) {
        translate([0, 0,  8]) cylinder(h = 5,   r = 4.2, $fn = 48);   // mantlet
        translate([0, 0, 13]) cylinder(h = 2,   r = 3.2, $fn = 48);   // collar
        translate([0, 0, 10]) cylinder(h = 24,  r = barrel_r, $fn = 48);
        difference() {                                                // muzzle
            translate([0, 0, 30]) cylinder(h = 5, r = 2.9, $fn = 48);
            translate([0, 0, 32]) cylinder(h = 6, r = 1.6, $fn = 48);
        }
    }
}

// ------------------------ turret top gadgets ------------------------
module mg_battery() {
    for (a = [0 : 60 : 359])                                          // barrels
        rotate([0, 0, a]) translate([1.5, 0, 0]) cylinder(h = 16, r = 0.6, $fn = 12);
    translate([0, 0,  0.5]) cylinder(h = 7, r = 2.4, $fn = 32);       // housing
    translate([0, 0, -2.5]) cylinder(h = 4, r = 2.8, $fn = 32);       // mount
    translate([0, 0, 14.5]) difference() {                            // muzzle ring
        cylinder(h = 1.6, r = 2.3, $fn = 32);
        translate([0, 0, -0.5]) cylinder(h = 3, r = 1.7, $fn = 32);
    }
}

module top_details() {
    // commander hatch + small cap on the dome
    translate([-2, tur_y + 5, 33.2]) cylinder(h = 2.6, r = 4.3, $fn = 48);
    translate([-2, tur_y + 5, 35.0]) cylinder(h = 1.4, r = 3.2, $fn = 48);
    // periscope box on the front slope of the dome
    translate([0, tur_y + 8, 33.0]) rotate([35, 0, 0]) box(5, 2, 2.4);
    // exhaust / snorkel tube with slotted cap
    translate([-1, tur_y - 6, 30]) {
        cylinder(h = 15, r = 1.7, $fn = 32);
        difference() {
            translate([0, 0, 12.5]) cylinder(h = 3, r = 2.4, $fn = 32);
            for (a = [0 : 90 : 359])
                rotate([0, 0, a]) translate([2.2, 0, 14])
                    cube([1.4, 3, 3.2], center = true);
        }
    }
    // radio antenna
    rod([2, tur_y - 3, 34], [3.4, tur_y - 11, 68], 0.35, 12);
    translate([3.4, tur_y - 11, 68]) sphere(r = 0.9, $fn = 16);
    // multi-barrel machine gun, right rear of the turret
    translate([5.5, tur_y - 5, 27.5])
        dir_align([0.3, 0.8, 0.55]) mg_battery();
    // thin bent pipe next to the machine gun
    rod([7.5, tur_y - 2, 27], [7.5, tur_y - 2, 32], 0.5, 10);
    rod([7.5, tur_y - 2, 31.5], [7.5, tur_y + 3, 31.5], 0.5, 10);
    // side pod (smoke launcher) on the right of the turret
    translate([10.5, tur_y - 3, 25]) {
        box(4, 8, 7);
        for (dy = [-2.2, 2.2])
            translate([2, dy, 1.5]) rotate([0, 90, 0]) cylinder(h = 2, r = 1.5, $fn = 32);
    }
    // small fittings on the left side of the turret
    for (p = [[-10, 2, 25], [-10, -1.5, 23]])
        translate(p) rotate([0, 90, 0]) cylinder(h = 3, r = 1.6, $fn = 32);
}

// --------------------------- hull details ---------------------------
module front_details() {
    // driver hatch on the glacis
    translate([-5, 18, 18.3]) rotate([-20.6, 0, 0]) cylinder(h = 1.6, r = 2.8, $fn = 32);
    // head light
    translate([8.5, 20, 19.5]) rotate([-90, 0, 0]) cylinder(h = 3, r = 1.6, $fn = 24);
    // tow hooks
    for (s = [-1, 1]) translate([s * 7, 23.5, 15.5]) box(2, 2.5, 3);
    // access plate on the front deck
    box(11, 6, 1, 0, 11.5, 19.7);
}

// ---------------------------- assembly ------------------------------
track(1);  track(-1);
for (s = [1, -1])
    for (i = [0 : n_whl - 1])
        road_wheel(s, -trk_x + i * (2 * trk_x / (n_whl - 1)));

fender(1);  fender(-1);
hull_body();
front_details();
turret();
main_gun();
top_details();