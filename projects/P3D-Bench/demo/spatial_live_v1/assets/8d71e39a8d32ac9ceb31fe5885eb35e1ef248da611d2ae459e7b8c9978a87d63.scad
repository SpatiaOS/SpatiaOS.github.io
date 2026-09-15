// Stylized cartoon tank: tracked hull, dome turret, cannon, gatling & MG mounts
$fn = 48;

// ---- Parameters ----
track_w = 12;          // track width
track_r = 9;           // track loop radius
wheel_x = 26;          // wheel center offset from center
track_y = 23;          // track lateral center
track_z = 10;          // track axis height
hull_w  = 34;          // hull width
turret_r = 17;         // turret dome radius
gun_z = 22;            // main gun axis height

// ---- Track with grousers, sprockets, fenders ----
module track(side) {
    union() {
        hull() for (x = [-wheel_x, wheel_x])
            translate([x, side*track_y, track_z]) rotate([90,0,0])
                cylinder(h=track_w, r=track_r, center=true);
        // radial grousers around wheels
        for (x = [-wheel_x, wheel_x], a = [0:30:359])
            translate([x + (track_r+0.6)*cos(a), side*track_y, track_z + (track_r+0.6)*sin(a)])
                rotate([0,-a,0]) cube([3.5, track_w, 2.5], center=true);
        // grousers on straight runs
        for (xx = [-18:9:18], s = [-1,1])
            translate([xx, side*track_y, track_z + s*(track_r+0.6)])
                cube([3.5, track_w, 2.5], center=true);
        // road wheels + hub + bolts on outer face
        for (x = [-wheel_x, wheel_x]) {
            translate([x, side*(track_y+track_w/2), track_z]) rotate([-side*90,0,0]) cylinder(h=2, r=7.5);
            translate([x, side*(track_y+track_w/2+2), track_z]) rotate([-side*90,0,0]) cylinder(h=1.5, r=3);
            for (i = [0:120:240])
                translate([x+4.5*cos(i), side*(track_y+track_w/2+2), track_z+4.5*sin(i)])
                    rotate([-side*90,0,0]) cylinder(h=1.2, r=1.1);
        }
        // angled fender flares front/rear
        translate([ 33, side*24, 12]) rotate([ side*25,0,0]) cube([14,14,2], center=true);
        translate([-33, side*24, 12]) rotate([ side*25,0,0]) cube([14,14,2], center=true);
        translate([ 28, side*track_y, 20]) rotate([0, 30,0]) cube([14, track_w+1, 2], center=true);
        translate([-28, side*track_y, 20]) rotate([0,-30,0]) cube([14, track_w+1, 2], center=true);
    }
}

// ---- Hull with sloped plates ----
module hull_body() {
    rotate([90,0,0]) linear_extrude(height=hull_w, center=true)
        polygon([[-28,4],[28,4],[28,12],[20,20],[-24,20],[-28,14]]);
    // front grille teeth
    for (i = [-3:3]) translate([28.5, i*4.5, 7]) rotate([0,15,0]) cube([2,3,7], center=true);
    // hatch diamond on glacis
    translate([24,0,16]) rotate([0,45,0]) cube([5,7,5], center=true);
}

// ---- Turret dome ----
module turret() { translate([0,0,20]) scale([1.15,1.05,0.85]) sphere(r=turret_r); }

// ---- Main gun with hollow muzzle ----
module main_gun() {
    difference() {
        union() {
            translate([8,0,gun_z])  rotate([0,90,0]) cylinder(h=30, r=5);
            translate([6,0,gun_z])  rotate([0,90,0]) cylinder(h=8,  r=7);   // mantlet
            translate([14,0,gun_z]) rotate([0,90,0]) cylinder(h=4,  r=6);   // collar
            translate([34,0,gun_z]) rotate([0,90,0]) cylinder(h=4,  r=5.6); // muzzle ring
        }
        translate([32,0,gun_z]) rotate([0,90,0]) cylinder(h=8, r=3.6);      // bore
    }
}

// ---- Roof hatch with handles ----
module hatch() {
    hull() for (x=[-8,8], y=[-5,5]) translate([x,y,31.5]) cylinder(h=4, r=2);
    for (y=[-3.5,3.5]) translate([0,y,36]) cube([12,1.6,1.6], center=true);
}

// ---- Searchlight tube ----
module searchlight() {
    rotate([0,100,0]) {
        difference() { cylinder(h=8, r=5); translate([0,0,2]) cylinder(h=8, r=4); }
        sphere(r=5); translate([0,0,4]) sphere(r=3.5);
    }
}

// ---- Commander MG ----
module cupola_mg() {
    rotate([5,-5,0]) {
        cylinder(h=13, r=2.6);
        translate([0,0,13])   cylinder(h=2.5, r=3.2);
        translate([0,0,15.5]) cylinder(h=1.5, r=2.2);
    }
}

// ---- Gatling cluster ----
module gatling() {
    rotate([30,25,0]) {
        sphere(r=5); cylinder(h=8, r=3.2);
        translate([0,0,6]) {
            cylinder(h=21, r=1.5);
            for (i=[0:60:359]) rotate([0,0,i]) translate([2.6,0,0]) cylinder(h=20, r=1.3);
            translate([0,0,9]) cylinder(h=3, r=4);
        }
    }
}

// ---- Curved grab pipe ----
module arc_pipe() { rotate_extrude(angle=110) translate([7,0,0]) circle(r=1.2); }

// ---- Side equipment box with round bosses ----
module side_box(x, y, z, side) {
    translate([x,y,z]) cube([11,5,13], center=true);
    translate([x,y+side*2.5,z+3])   rotate([side*90,0,0]) cylinder(h=2, r=3);
    translate([x,y+side*2.5,z-3.5]) rotate([side*90,0,0]) cylinder(h=2, r=3);
}

// ---- Assembly ----
union() {
    hull_body();
    track(1); track(-1);
    turret();
    main_gun();
    hatch();
    translate([6,7,32])   searchlight();
    translate([-6,3,32])  cupola_mg();
    // antennas
    translate([-10,6,31])  rotate([-8,12,0]) cylinder(h=45, r=0.7);
    translate([-12,2,31])  rotate([-4,20,0]) cylinder(h=28, r=0.5);
    // right-side MG barrel and bent pipe
    translate([-2,-10,29]) rotate([35,10,0]) { cylinder(h=16, r=1.9); translate([0,0,16]) sphere(r=1.9); }
    translate([-8,-12,27]) rotate([30,0,0]) {
        cylinder(h=9, r=1.4);
        translate([0,0,9]) sphere(r=1.4);
        translate([0,0,9]) rotate([45,0,0]) cylinder(h=7, r=1.2);
    }
    translate([-11,-13,23]) gatling();
    side_box(2,-15,24,-1);
    side_box(10,12,25,1);
    // curved pipes on mantlet sides and hull
    translate([11,10,22])  rotate([90,0,0])  arc_pipe();
    translate([11,-10,22]) mirror([0,1,0]) rotate([90,0,0]) arc_pipe();
    translate([15,-8,19])  rotate([90,0,30]) arc_pipe();
}