// ============================================================================
// CHIBI TANK - stylised cartoon tank recreated from the reference render
//
// Interpretation:
//   * hemispherical dome turret on a tapered armoured hull
//   * two large road wheels per side wrapped in chunky track pads
//   * oversized main cannon with ribbed muzzle, slight yaw + elevation
//   * dome furniture: twin top hatches, open cupola, ribbed periscope stack,
//     twin-lens optics box, light pod, grab handles, whip antennas
//   * rear deck: exhaust stacks and a ball-mounted gatling gun
//   * angled side skirts and mud flaps over the tracks
// All dimensions in millimetres. Ground plane is Z = 0.
// ============================================================================

$fn = 48;

/* ---------- hull ---------- */
hull_len = 112;                 // overall hull length
hull_wid = 70;                  // hull width
deck_z   = 50;                  // hull roof height

/* ---------- running gear ---------- */
wheel_r = 22;                   // road wheel radius
wheel_w = 15;                   // wheel width
axle_x  = 36;                   // wheel centre offset (front/back)
axle_z  = 26;                   // axle height
track_y = 42;                   // track centre offset (left/right)
pad_l   = 7.5;                  // track pad length (along track run)
pad_w   = 18;                   // track pad width
pad_t   = 4;                    // track pad thickness

/* ---------- turret ---------- */
tur_r = 35;                     // dome radius
tur_x = 2;                      // dome centre x
tur_z = 53;                     // dome centre height

/* ---------- main gun ---------- */
gun_yaw  = 12;                  // azimuth (deg)
gun_elev = 2;                   // elevation (deg)

/* =========================== utility =========================== */

// vertical-axis torus
module torus(R, r) {
    rotate_extrude(convexity = 4)
        translate([R, 0, 0])
            circle(r = r);
}

// U-shaped grab handle, posts along +Z
module grab_handle(w = 9, h = 7, r = 1.5) {
    for (s = [-1, 1])
        translate([s*w/2, 0, 0])
            cylinder(r = r, h = h);
    translate([-w/2, 0, h])
        rotate([0, 90, 0])
            cylinder(r = r, h = w);
}

/* ========================= running gear ========================= */

module road_wheel() {
    rotate([90, 0, 0]) {
        difference() {                                          // tyre ring
            cylinder(r = wheel_r,     h = wheel_w,     center = true);
            cylinder(r = wheel_r - 6, h = wheel_w + 2, center = true);
        }
        cylinder(r = wheel_r - 5, h = wheel_w - 5, center = true);  // dish
        cylinder(r = 4.5, h = wheel_w + 2, center = true);          // hub
        for (a = [0:60:300])                                        // bolts
            rotate([0, 0, a])
                translate([9.5, 0, 0])
                    cylinder(r = 2, h = wheel_w + 1, center = true);
    }
}

module track_pads() {
    r = wheel_r + pad_t/2;                          // pad centre radius
    for (i = [0:9]) {                               // top + bottom runs
        x = -axle_x + i * (2*axle_x / 9);
        for (s = [-1, 1])
            translate([x, 0, axle_z + s*r])
                cube([pad_l, pad_w, pad_t], center = true);
    }
    for (a = [-75:25:75])                           // wrap around front wheel
        translate([axle_x + r*cos(a), 0, axle_z + r*sin(a)])
            rotate([0, 90 - a, 0])
                cube([pad_l, pad_w, pad_t], center = true);
    for (a = [105:25:255])                          // wrap around rear wheel
        translate([-axle_x + r*cos(a), 0, axle_z + r*sin(a)])
            rotate([0, 90 - a, 0])
                cube([pad_l, pad_w, pad_t], center = true);
}

module track_side() {
    for (s = [-1, 1])
        translate([s*axle_x, 0, axle_z])
            road_wheel();
    track_pads();
}

/* ============================ hull ============================ */

module hull_body() {
    hull() {                                                        // tapered hull
        translate([0, 0, 31])  cube([hull_len,     hull_wid - 14, 10], center = true);
        translate([-6, 0, 45]) cube([hull_len - 24, hull_wid - 16, 10], center = true);
    }
    translate([-hull_len/2 + 13, 0, deck_z - 1])                    // raised rear deck
        cube([24, hull_wid - 18, 4], center = true);
    for (i = [0:2])                                                 // deck grilles
        translate([-48 + i*4.5, 0, deck_z + 2.8])
            cube([3, hull_wid - 24, 1.6], center = true);
    for (s = [-1, 1])                                               // bow tow lugs
        translate([hull_len/2 + 0.5, s*14, 31])
            cube([5, 5, 6], center = true);
}

module side_skirts() {
    for (s = [-1, 1]) {
        translate([0, s*42, 59])                                    // side skirt
            rotate([s*20, 0, 0])
                cube([98, 3, 17], center = true);
        translate([52, s*42, 47])                                   // front mud flap
            rotate([s*20, -28, 0])
                cube([20, 3, 13], center = true);
        translate([-52, s*42, 47])                                  // rear mud flap
            rotate([s*20, 28, 0])
                cube([20, 3, 13], center = true);
    }
}

/* ============================ turret ============================ */

// built along +X, origin at mantlet centre
module main_gun() {
    difference() {
        union() {
            rotate([0, 90, 0]) cylinder(r = 13, h = 8, center = true);  // mantlet
            translate([5, 0, 0]) rotate([0, 90, 0]) torus(10, 1.5);     // collar
            translate([4, 0, 0])  rotate([0, 90, 0]) cylinder(r = 10, h = 14);
            translate([11, 0, 0]) rotate([0, 90, 0]) cylinder(r = 7.5, h = 44);
            translate([55, 0, 0]) rotate([0, 90, 0]) {                  // ribbed muzzle
                cylinder(r = 10, h = 15);
                for (i = [0:3])
                    translate([0, 0, 1.2 + i*3.5])
                        cylinder(r = 11.2, h = 1.8);
            }
        }
        translate([66, 0, 0]) rotate([0, 90, 0]) cylinder(r = 6, h = 6); // bore
    }
}

module top_hatch() {
    cube([15, 11, 2.2], center = true);
    translate([0, 0, 1.8])  cube([8, 3, 1.8], center = true);       // handle strip
    translate([-6.5, 0, 1]) cube([2, 11, 3], center = true);        // hinge
}

module cupola() {
    cylinder(r = 7, h = 7);                                         // base
    translate([0, 0, 6.5]) torus(6.3, 1.4);                         // rim
    cylinder(r = 2.5, h = 9);                                       // periscope post
    translate([-6.3, 0, 7.5])                                       // lid, opened
        rotate([0, -108, 0])
            translate([6.3, 0, 0])
                cylinder(r = 6.3, h = 1.8);
}

module periscope_stack() {
    cylinder(r = 4.6, h = 18);
    for (i = [0:2])                                                 // ring ribs
        translate([0, 0, 12.5 + i*2.4])
            difference() {
                cylinder(r = 5.5, h = 1.4);
                cylinder(r = 4.4, h = 1.5);
            }
    for (a = [0:90:270])                                            // castellated top
        rotate([0, 0, a])
            translate([3.6, 0, 17])
                cube([2, 2, 3], center = true);
}

module antenna(h = 55) {
    cylinder(r = 2.2, h = 6);                                       // mount
    translate([0, 0, 5]) cylinder(r = 0.9, h = h);                  // whip
    translate([0, 0, 5 + h]) sphere(r = 1.8);                       // tip ball
}

module optics_box() {                                               // twin-lens "eyes"
    cube([12, 13, 15], center = true);
    for (dz = [-4, 4])
        translate([6, 0, dz])
            rotate([0, 90, 0]) {
                cylinder(r = 4, h = 3);                             // lens barrel
                translate([0, 0, 2.5])                              // rim ring
                    difference() {
                        cylinder(r = 4.6, h = 1.5);
                        cylinder(r = 3.4, h = 1.6);
                    }
            }
}

module light_pod() {                                                // stacked light tubes
    cube([4, 9, 15], center = true);
    for (dz = [-4, 4])
        translate([2, 0, dz])
            rotate([0, 90, 0]) {
                cylinder(r = 4.2, h = 7);
                translate([0, 0, 6])
                    difference() {
                        cylinder(r = 4.8, h = 1.4);
                        cylinder(r = 3.3, h = 1.5);
                    }
            }
}

module turret() {
    translate([tur_x, 0, tur_z]) sphere(r = tur_r);                 // dome
    translate([tur_x, 0, deck_z - 1])                               // base collar
        cylinder(r1 = 28, r2 = 33.5, h = 8);
    translate([tur_x, 0, tur_z + 10]) torus(33.5, 1);               // panel seam

    translate([tur_x, 0, tur_z])                                    // main gun
        rotate([0, 0, gun_yaw])
            translate([30, 0, 12])
                rotate([0, -gun_elev, 0])
                    main_gun();

    for (s = [-1, 1])                                               // twin top hatches
        translate([tur_x + 11, s*9, 84.3])
            rotate([s*15, 19, 0])
                top_hatch();

    translate([-10, 13, 80]) cupola();                              // open cupola
    translate([-18, -2, 77]) rotate([0, -10, 0]) periscope_stack(); // ribbed stack
    translate([-25, 6, 70.5]) rotate([0, -8, 0])  antenna();        // whip antenna
    translate([-14, -12, 77]) rotate([0, -25, 0]) antenna(24);      // short whip

    translate([tur_x, 0, tur_z])                                    // optics box
        rotate([0, 0, -20])
            translate([26, 0, 16])
                rotate([0, -32, 0])
                    optics_box();

    translate([tur_x, 0, tur_z])                                    // light pod
        rotate([0, 0, 56])
            translate([26.5, 0, 13])
                rotate([0, -30, 0])
                    light_pod();

    for (s = [-1, 1])                                               // grab handles
        translate([tur_x + 31*cos(36), s*31*sin(36), 67])
            rotate([0, 0, s*36])
                rotate([0, 60, 0])
                    grab_handle(9, 7, 1.5);
}

/* ==================== rear-deck weapons/exhaust ==================== */

module gatling() {
    translate([0, 0, -9]) cylinder(r = 4, h = 10);                  // pedestal
    sphere(r = 7);                                                  // ball mount
    rotate([0, 0, 25])
        rotate([0, -50, 0]) {
            translate([0, 0, 3]) cylinder(r = 5.5, h = 9);          // breech
            for (a = [0:60:300])                                    // barrel cluster
                rotate([0, 0, a])
                    translate([4.4, 0, 10])
                        cylinder(r = 1.9, h = 38);
            translate([0, 0, 10]) cylinder(r = 1.6, h = 38);        // centre rod
            for (zz = [16, 36])                                     // barrel collars
                translate([0, 0, zz])
                    difference() {
                        cylinder(r = 6.8, h = 2.2);
                        cylinder(r = 5.4, h = 2.4);
                    }
            translate([0, 0, 47.5])                                 // muzzle plate
                difference() {
                    cylinder(r = 6.6, h = 1.6);
                    for (a = [0:60:300])
                        rotate([0, 0, a])
                            translate([4.4, 0, -0.1])
                                cylinder(r = 1.2, h = 1.8);
                }
        }
}

module exhaust(h = 20, r = 4.2) {                                   // open stack pipe
    difference() {
        cylinder(r = r, h = h);
        translate([0, 0, h - 3]) cylinder(r = r - 1.3, h = 4);
    }
}

/* ========================== assembly ========================== */

color("lightgrey") {
    hull_body();
    side_skirts();
    turret();
    translate([-30, -24, 58]) gatling();                            // rear-corner gatling
    translate([-38, 12, deck_z]) rotate([0, -12, 0]) exhaust(20, 4.2);
    translate([-36, -10, deck_z]) exhaust(14, 3.6);
}

color("dimgrey")
    for (s = [-1, 1])
        translate([0, s*track_y, 0])
            track_side();