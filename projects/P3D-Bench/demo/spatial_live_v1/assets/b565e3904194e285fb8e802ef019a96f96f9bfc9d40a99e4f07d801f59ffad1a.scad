// Parametric stylized tank
$fn = 36;

// --- overall ---
wheel_d      = 22;
wheel_w      = 5.2;
track_l      = 76;
track_w      = 16.5;
track_h      = 26;
track_y      = 24.5;

hull_l       = 54;
hull_w       = 35;
hull_h       = 20;
hull_cz      = 17;

turret_r     = 16.5;
turret_cx    = 4;
turret_cz    = hull_cz + hull_h/2 + turret_r*0.62;

gun_len      = 24;
gun_d        = 12.5;

// --- helpers ---
module rcube(s, r=2, fn=14) {
    hull()
        for (x=[-1,1]) for (y=[-1,1]) for (z=[-1,1])
            translate([x*(s[0]/2-r), y*(s[1]/2-r), z*(s[2]/2-r)])
                sphere(r=r, $fn=fn);
}

module hose(pts, d) {
    for (i=[0:len(pts)-2])
        hull() {
            translate(pts[i]) sphere(d=d, $fn=10);
            translate(pts[i+1]) sphere(d=d, $fn=10);
        }
}

module bolt_ring(r, n=12, d=1.4, z=0) {
    for (i=[0:n-1])
        rotate([0, 0, i*360/n])
            translate([r, 0, z])
                sphere(d=d, $fn=8);
}

module barrel_cluster(n=6, len=16, bd=2.1, spread=3.1) {
    for (i=[0:n-1])
        rotate([0, 0, i*360/n])
            translate([spread, 0, 0])
                cylinder(h=len, d=bd, $fn=12);
    cylinder(h=len*0.22, d=spread*1.2, $fn=16);
    translate([0, 0, len*0.42])
        cylinder(h=1.6, d=spread*2+bd+1.2, $fn=20);
    translate([0, 0, len*0.78])
        cylinder(h=1.2, d=spread*2+bd+0.6, $fn=20);
}

module road_wheel() {
    rotate([90, 0, 0]) {
        difference() {
            union() {
                difference() {
                    cylinder(h=wheel_w, d=wheel_d, center=true);
                    cylinder(h=wheel_w+0.4, d=wheel_d-3.4, center=true);
                }
                cylinder(h=wheel_w*0.45, d=wheel_d-2.2, center=true);
                cylinder(h=wheel_w*0.72, d=wheel_d*0.3, center=true);
                cylinder(h=wheel_w*0.95, d=wheel_d*0.14, center=true);
            }
            for (a=[0:72:359])
                rotate([0, 0, a+18])
                    translate([wheel_d*0.275, 0, 0])
                        hull() {
                            translate([0.8, 0, 0]) cylinder(h=wheel_w+2, d=4.6, center=true, $fn=16);
                            translate([-0.6, 0, 0]) cylinder(h=wheel_w+2, d=3.4, center=true, $fn=16);
                        }
        }
    }
}

// --- tracks ---
module track_unit(side=1) {
    wr = wheel_d/2;

    // housing
    translate([0, 0, 2.2])
        rcube([track_l, track_w, track_h-5], 2.4);

    // outer applique
    translate([1, side*(track_w/2-0.4), 3])
        rcube([track_l-12, 2.2, track_h-12], 0.7);

    // panel grooves
    for (i=[-2:2])
        translate([i*11, side*(track_w/2+0.15), 3])
            cube([0.7, 1.2, 11], center=true);

    // rivets
    for (i=[-7:7]) {
        translate([i*4.6, side*(track_w/2+0.35), 9.5])
            rotate([90, 0, 0]) cylinder(h=1.1, d=1.35, center=true, $fn=8);
        if (abs(i)<7)
            translate([i*4.6, side*(track_w/2+0.35), -2.5])
                rotate([90, 0, 0]) cylinder(h=1.1, d=1.2, center=true, $fn=8);
    }

    // front stepped armor
    translate([track_l/2-5, side*(track_w/2+0.6), 2])
        rcube([14, 3.2, 18], 0.7);
    translate([track_l/2+3, side*(track_w/2+0.4), -2])
        rcube([10, 2.6, 12], 0.6);
    translate([track_l/2+6, side*2, -8])
        rotate([0, 18, 0])
            cube([8, track_w-4, 2], center=true);

    // rear fender
    translate([-track_l/2+4, side*(track_w/2+0.5), 1])
        rcube([12, 3, 16], 0.7);
    translate([-track_l/2-2, side*(track_w/2+0.3), -3])
        rcube([8, 2.4, 10], 0.5);
    translate([-track_l/2-4, side*1.5, -8])
        cube([7, track_w-5, 1.8], center=true);

    // wheels
    translate([ track_l/2-wr-3.5, side*(track_w/2-wheel_w/2+1.4), 0]) road_wheel();
    translate([-track_l/2+wr+3.5, side*(track_w/2-wheel_w/2+1.4), 0]) road_wheel();

    // treads
    for (i=[-8:8])
        translate([i*4.2, 0, -wr+1.15])
            cube([3.1, track_w+2.4, 2.4], center=true);

    // lower skirt teeth
    for (i=[-3:3])
        translate([i*8, side*(track_w/2-0.2), -wr+3])
            cube([3.5, 1.6, 5], center=true);
}

// --- hull ---
module hull_body() {
    difference() {
        rcube([hull_l, hull_w, hull_h], 5.2);
        // side groove
        translate([0, 0, -1])
            difference() {
                cube([hull_l+4, hull_w+4, 1.1], center=true);
                cube([hull_l-3, hull_w-3, 2], center=true);
            }
    }

    // deck collar
    translate([2, 0, hull_h/2-1.2])
        cylinder(h=4.5, d=turret_r*1.72, $fn=40);
    translate([2, 0, hull_h/2+2.6])
        bolt_ring(turret_r*0.82, 14, 1.5);

    // front rounding extra
    translate([hull_l/2-8, 0, -1])
        rotate([90, 0, 0])
            cylinder(h=hull_w-8, d=hull_h-4, center=true);

    // belly
    translate([0, 0, -hull_h/2-1])
        cube([hull_l*0.78, hull_w*0.62, 4], center=true);

    // hull MG / lamp
    translate([hull_l/2-3, -9, 1])
        rotate([0, 90, 0]) {
            cylinder(h=7, d=4.2);
            translate([0, 0, 6.5]) cylinder(h=1.2, d=5);
        }

    // hull bolts
    for (y=[-1,1])
        for (i=[-2:2])
            translate([i*8, y*(hull_w/2-0.4), 4])
                rotate([90, 0, 0]) cylinder(h=1.2, d=1.4, center=true, $fn=8);

    // left U-pipe
    hose([
        [6, 12, 8],
        [10, 14, 4],
        [16, 13, -1],
        [14, 11, -6],
        [8, 10, -5]
    ], 2.4);

    // right exhaust
    hose([
        [8, -12, 6],
        [14, -14, 3],
        [16, -13, -4],
        [12, -12, -7]
    ], 2.6);

    // extra hull hose toward turret
    hose([
        [-4, 13, 6],
        [-10, 12, 9],
        [-8, 8, 11]
    ], 2.0);
}

// --- gun ---
module main_gun() {
    rotate([0, 90, 0]) {
        difference() {
            union() {
                cylinder(h=gun_len, d=gun_d);
                cylinder(h=8, d=gun_d+6);                 // mantlet
                translate([0, 0, 6]) cylinder(h=2.2, d=gun_d+7);
                translate([0, 0, gun_len-4.2])
                    cylinder(h=4.4, d=gun_d+3);           // muzzle lip
            }
            translate([0, 0, gun_len-8])
                cylinder(h=10, d=gun_d-4);
        }
        bolt_ring((gun_d+6)/2, 8, 1.45, 4.2);
    }
}

module sponson() {
    difference() {
        rcube([11, 7.5, 13.5], 1.1);
        for (z=[3.1, -3.4])
            translate([1.2, 4.6, z])
                rotate([90, 0, 0]) cylinder(d=4.8, h=5, $fn=20);
    }
    for (z=[5.8, 0, -5.8])
        translate([3.6, 3.95, z])
            rotate([90, 0, 0]) cylinder(d=1.15, h=1.0, $fn=8);
}

module cupola() {
    cylinder(h=2.4, d=15);
    bolt_ring(6.6, 10, 1.2, 2.2);
    difference() {
        translate([1.2, 0.6, 6.2])
            rotate([12, -28, 18])
                cylinder(h=9.5, d=10.5, center=true);
        translate([1.2, 0.6, 6.2])
            rotate([12, -28, 18])
                cylinder(h=11, d=7.6, center=true);
        translate([7, 2.5, 7])
            rotate([12, -28, 18])
                cube([10, 12, 12], center=true);
    }
    translate([1.2, 0.6, 6.2])
        rotate([12, -28, 18])
            cylinder(h=8.5, d=3.6, center=true);
    // spotting MG
    translate([2, 4, 8])
        rotate([10, -40, 30])
            cylinder(h=9, d=1.8);
}

// --- turret ---
module turret() {
    difference() {
        sphere(r=turret_r);
        translate([0, 0, -turret_r-3.2])
            cube([turret_r*3, turret_r*3, turret_r], center=true);
    }

    // ring / bolts
    translate([0, 0, -5])
        cylinder(h=6, d=turret_r*1.55);
    translate([0, 0, -3])
        bolt_ring(turret_r*0.92, 18, 1.55);

    // upper hatch plate
    translate([-1, 0, turret_r-3.4])
        rcube([14, 12, 3.2], 1.0);

    translate([turret_r-6.5, 0, -2.2])
        main_gun();

    // recuperator hoses
    hose([
        [6, 9.5, -3],
        [10, 12, -5],
        [16, 10, -4],
        [20, 6.5, -2.2],
        [22, 4.2, -1.5]
    ], 2.15);
    hose([
        [7, -8, -4],
        [12, -11, -3.5],
        [18, -8.5, -2],
        [22, -4.5, -1.2]
    ], 2.0);

    // left / right sponsons
    translate([2, turret_r-1.2, -1])
        rotate([0, 0, 12]) sponson();
    translate([1.5, -(turret_r-1.0), -0.5])
        rotate([0, 0, 180-10]) sponson();

    // rear bustle box
    translate([-10, -7, 1])
        rcube([10, 11, 9], 1.1);

    // cupola
    translate([5.5, 2.5, turret_r-3.6])
        cupola();

    // rear vertical cluster
    translate([-6.5, 5.5, turret_r-4])
        barrel_cluster(n=7, len=12, bd=2.0, spread=2.45);

    // antennas
    translate([-7.5, 2.2, turret_r-3])
        rotate([7, 10, -8]) {
            cylinder(d=1.15, h=40, $fn=10);
            translate([0, 0, 40]) sphere(d=2.3, $fn=12);
            translate([1.2, 0.4, 0])
                rotate([4, -12, 0])
                    cylinder(d=0.7, h=24, $fn=8);
        }

    // right ball + gatling
    translate([-5.5, -turret_r-1.5, 1.5]) {
        sphere(d=11);
        rotate([48, 18, -40])
            translate([0, 0, 4])
                barrel_cluster(n=6, len=18, bd=2.15, spread=3.15);
    }

    // extra tubes by gatling
    translate([-3, -turret_r-0.5, 6])
        rotate([18, 22, -15])
            cylinder(h=13, d=3.4);
    translate([-1, -turret_r-3, 7])
        rotate([25, 40, 10])
            cylinder(h=11, d=1.5, $fn=10);

    // roof box behind cupola
    translate([-1, 1, turret_r-1.8])
        rcube([8, 7, 4.5], 0.8);
}

// --- assembly ---
module tank() {
    wr = wheel_d/2;
    translate([0,  track_y, wr]) track_unit(1);
    translate([0, -track_y, wr]) track_unit(-1);

    // inner track faces / belly beams
    for (s=[-1,1])
        translate([0, s*(track_y-track_w/2+1), wr])
            cube([track_l-16, 2, 10], center=true);

    translate([0, 0, hull_cz])
        hull_body();

    translate([turret_cx, 0, turret_cz])
        turret();
}

tank();