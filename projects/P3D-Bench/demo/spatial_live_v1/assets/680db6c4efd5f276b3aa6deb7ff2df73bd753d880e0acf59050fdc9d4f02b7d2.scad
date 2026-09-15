// ============================================================
// Cartoon-style battle tank (stylized wargame miniature)
// Interpretation: boxy hull with side tracks, big rounded
// dome turret, heavy front cannon, gatling cluster, exhaust
// stacks, antenna, scope, fenders with side armor skirts.
// All dimensions in mm.
// ============================================================
$fn = 72;

// ---------------- Parameters ----------------
// Hull
hull_len = 48;  hull_wid = 32;
hull_bot = 3;   hull_top = 14;
deck_len = 42;  deck_wid = 30;

// Tracks
band_R  = 7.5;    // track band outer radius
band_w  = 11;     // track width
arc_dx  = 17;     // half distance between end arc centers
track_y = 21.5;   // track center offset from hull centerline
track_z = 9.3;    // track center height
wheel_r = 5.4;

// Turret dome
dome_c  = [-2, 0, 17];
dome_r  = 16.5;
dome_zs = 0.82;   // vertical squash of dome

// ---------------- Track ----------------
module track_profile() {
    Rout = band_R;  Rin = band_R - 1.9;  lc = arc_dx;
    // closed band (outer stadium minus inner stadium)
    difference() {
        hull() { translate([ lc,0]) circle(Rout);
                 translate([-lc,0]) circle(Rout); }
        hull() { translate([ lc,0]) circle(Rin);
                 translate([-lc,0]) circle(Rin); }
    }
    // protruding track pads around the perimeter
    pr = Rout + 0.8;
    module pad(a) { rotate([0,0,a]) translate([0,pr]) square([2.8,1.8], center=true); }
    for (x = [-12.8 : 4.25 : 12.8]) {
        translate([x,0]) pad(0);      // bottom run
        translate([x,0]) pad(180);    // top run
    }
    translate([ lc,0]) for (a = [-72 : 24 : 72])  pad(a);  // front arc
    translate([-lc,0]) for (a = [108 : 24 : 252]) pad(a);  // rear arc
}

module road_wheel() {
    rotate([90,0,0]) {
        difference() {
            union() {
                // rim ring
                difference() {
                    cylinder(h=4.2, r=wheel_r, center=true);
                    cylinder(h=4.4, r=wheel_r-1.2, center=true);
                }
                // spokes
                for (a = [0:60:300])
                    rotate([0,0,a]) translate([wheel_r/2-0.15,0,0])
                        cube([wheel_r-0.3,1.7,3.6], center=true);
                cylinder(h=5.2, r=2.0, center=true); // hub
            }
            cylinder(h=5.6, r=0.8, center=true);     // axle bore
        }
    }
}

module track_side(s) {
    translate([0, s*track_y, track_z])
        rotate([90,0,0])
            linear_extrude(height=band_w, center=true)
                track_profile();
    for (wx = [-15,-5,5,15])
        translate([wx, s*track_y, 8.2]) road_wheel();
}

// ---------------- Hull ----------------
module fender(s) {
    // top armor plate over track
    translate([0, s*21.5, 20.3]) difference() {
        cube([56, 12.5, 2.6], center=true);
        translate([ 29.5,0,0]) rotate([0,-45,0]) cube([9,14,9], center=true);
        translate([-29.5,0,0]) rotate([0, 45,0]) cube([9,14,9], center=true);
    }
    // outer side skirt with angled front
    translate([0, s*27.6, 15.5]) difference() {
        cube([46, 1.7, 7.6], center=true);
        translate([24.5,0,0]) rotate([0,-45,0]) cube([8,6,12], center=true);
    }
}

module front_armor() {
    // upper glacis plate (top leans back)
    translate([20.5,0,9.5]) rotate([0,-50,0]) {
        cube([3, 32, 13], center=true);
        translate([1.6,-6.5,1.5]) cube([1.6,5,4]);   // access hatch
    }
    // lower chin plate (undercut) with jagged teeth
    translate([22.8,0,5.2]) rotate([0,55,0]) {
        cube([3, 30, 8], center=true);
        for (i=[-3:3]) translate([1.8, i*4, -2.4]) cube([1.6,2.2,1.8], center=true);
    }
}

module side_details() {
    // left hull side discs
    translate([-6,-16.3,9.5]) rotate([90,0,0]) cylinder(h=1.6, d=4.8, center=true);
    translate([ 3,-16.3,9.5]) rotate([90,0,0]) cylinder(h=1.6, d=4.8, center=true);
    // right side detail box with round vents
    translate([11,16.4,10.5]) cube([8,3.6,9], center=true);
    translate([11,18.5,12.6]) rotate([-90,0,0]) cylinder(h=1.4, d=4.6, center=true);
    translate([11,18.5, 8.2]) rotate([-90,0,0]) cylinder(h=1.4, d=4.6, center=true);
}

module hull_assembly() {
    // main hull box
    translate([0,0,(hull_bot+hull_top)/2])
        cube([hull_len, hull_wid, hull_top-hull_bot], center=true);
    // sponson walls rising to the fenders
    for (s=[-1,1]) translate([0, s*17.5, 14.5]) cube([48,4,9], center=true);
    // raised center deck
    translate([0,0,16]) cube([deck_len, deck_wid, 4], center=true);
    for (s=[-1,1]) fender(s);
    front_armor();
    // rear slope plate and stowage box
    translate([-22.3,0,9]) rotate([0,45,0]) cube([3,30,11], center=true);
    translate([-22.5,0,16.5]) cube([9,18,3.2], center=true);
    side_details();
    // front bumper teeth row
    for (i=[-3:3]) translate([22.6, i*3.8, 3.4]) cube([2,2.2,2.4], center=true);
}

// ---------------- Turret & weapons ----------------
module main_cannon() {
    translate([11,-5.5,14.5]) rotate([0,0,-20]) rotate([0,12,0]) {
        difference() {
            union() {
                sphere(r=7.5);                                   // mantlet
                rotate([0,90,0]) cylinder(h=18, d=11.6);         // barrel
                translate([0.5,0,0]) rotate([0,90,0]) cylinder(h=3, d=13.5);
                translate([17,0,0])  rotate([0,90,0]) cylinder(h=5, d=14); // muzzle
            }
            translate([20,0,0]) rotate([0,90,0]) cylinder(h=3.5, d=9.2); // bore
        }
    }
}

module gatling() {
    translate([2,12.5,22]) rotate([0,0,28]) rotate([0,-38,0]) {
        sphere(r=5.5);                                   // ball mount
        translate([2,0,0]) cube([6,7,7], center=true);   // rear block
        rotate([0,90,0]) cylinder(h=14.5, d=2.8);        // core barrel
        for (a=[0:60:300])                                // barrel cluster
            rotate([0,0,a]) translate([0,3.1,0])
                rotate([0,90,0]) cylinder(h=13, d=2);
        translate([14.3,0,0]) rotate([0,90,0]) cylinder(h=2.6, d=8.4); // muzzle ring
    }
}

module exhausts() {
    translate([-8,3,29]) rotate([0,-14,0])
        for (p=[[-1.7,-1.7],[1.7,-1.7],[-1.7,1.7],[1.7,1.7]])
            translate([p[0],p[1],0]) {
                cylinder(h=12, d=4);
                translate([0,0,12]) cylinder(h=1.6, d=5.2); // flared rim
            }
}

module antennas() {
    translate([-8,7,28]) {
        rotate([0,0,-12]) rotate([0,-22,0]) {
            cylinder(h=32, d=0.9);
            translate([0,0,32]) sphere(r=1.0);
        }
        rotate([0,0,14]) rotate([0,-34,0]) cylinder(h=16, d=0.6);
    }
}

module scope() {
    translate([7,-2,27.9]) {
        rotate([0,-25,0]) cube([9,7,1.6], center=true); // mounting wedge
        sphere(r=3.6);
        rotate([0,6,0]) {
            rotate([0,90,0]) cylinder(h=7.5, d=6.6);    // body
            translate([6.2,0,0]) rotate([0,90,0]) cylinder(h=2.4, d=8.6); // collar
            translate([-1.4,0,0]) cube([3.6,7,6.4], center=true); // rear box
        }
    }
}

module pipe_seg(p1, p2, r) {
    hull() { translate(p1) sphere(r); translate(p2) sphere(r); }
}

module dome_pipe() {
    r = 1.5;
    pipe_seg([-13,-10,22],[-17,-13,15], r);
    pipe_seg([-17,-13,15],[-15.5,-14.5,7.5], r);
    translate([-15.5,-14.5,6.8]) cylinder(h=1.6, d=4.4, center=true); // flange
}

module turret_assembly() {
    translate(dome_c) scale([1.02,1,dome_zs]) sphere(r=dome_r);
    // panel seam ring on dome
    translate([dome_c[0],0,22.5]) rotate_extrude() translate([15.1,0]) circle(r=0.7);
    // small center bump
    translate([dome_c[0],0,30.1]) sphere(r=2.3);
    // raised hatch panels
    for (s=[-1,1])
        translate([-3, s*5.5, 30.0]) rotate([-s*19,0,0])
            cube([10,3.6,1.6], center=true);
    main_cannon();
    gatling();
    exhausts();
    antennas();
    scope();
    dome_pipe();
}

// ---------------- Model ----------------
union() {
    hull_assembly();
    for (s=[-1,1]) track_side(s);
    turret_assembly();
}