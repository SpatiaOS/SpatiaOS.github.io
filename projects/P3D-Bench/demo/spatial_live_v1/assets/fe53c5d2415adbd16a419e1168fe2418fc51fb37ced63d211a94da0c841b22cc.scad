// ============================================================
//  "Super Vehicle" cartoon battle tank  (Metal Slug inspired)
//  Axes:  +X = forward,  +Y = right,  +Z = up
// ============================================================
$fn = 40;

// ---------------- main proportions ----------------
hull_l   = 106;                 // hull length
hull_w   = 58;                  // hull width
hull_h   = 30;                  // hull height
hull_z   = 8;                   // hull underside above ground

wheel_r    = 17;                // road wheel radius
wheel_base = 62;                // front/rear wheel spacing
track_w    = 15;                // track width
track_cz   = 20;                // track centre height
track_y    = hull_w/2 - 2;      // inner face of the track

turret_r = 33;                  // turret dome radius
turret_f = 0.84;                // dome vertical squash
turret_x = -2;                  // dome centre X
turret_z = hull_z + hull_h - 2; // dome base Z

gun_y = -11;                    // main cannon offset (left side)

// ---------------- generic helpers ----------------
module rbox(sz, r) {            // rounded box
    hull() for (x=[-1,1], y=[-1,1], z=[-1,1])
        translate([x*(sz[0]/2-r), y*(sz[1]/2-r), z*(sz[2]/2-r)]) sphere(r=r);
}

module dome(r, f) {             // squashed half sphere
    intersection() {
        scale([1,1,f]) sphere(r=r);
        translate([-r,-r,0]) cube([2*r, 2*r, r*f+1]);
    }
}

module hatch_plate(l, w, t) {   // stadium shaped raised panel
    hull() for (s=[-1,1]) translate([s*(l/2-w/2),0,0]) cylinder(h=t, r=w/2);
}

module rail(R=13, r=1.5, a=150) {   // curved hand rail
    rotate([90,0,0]) rotate_extrude(angle=a) translate([R,0]) circle(r=r);
}

// ---------------- running gear ----------------
module track_profile() {            // 2D band centre line
    hull() {
        translate([-wheel_base/2,0]) circle(r=wheel_r);
        translate([ wheel_base/2,0]) circle(r=wheel_r);
    }
}

module track_ribs() {               // grousers around the band
    for (s=[-1,1])
        for (a=[-72:24:72])
            translate([s*wheel_base/2,0,0])
                rotate([0,0, s>0 ? a : 180-a])
                    translate([wheel_r+2,0,track_w/2]) cube([4,6,track_w], center=true);
    for (x=[-wheel_base/2+5 : 11 : wheel_base/2])
        for (sy=[-1,1])
            translate([x, sy*(wheel_r+2), track_w/2]) cube([4,6,track_w], center=true);
}

module wheel_face() {               // wheel disc + hub + bolts
    cylinder(h=4, r=wheel_r-2);
    cylinder(h=6, r=5);
    for (a=[0:60:359]) rotate([0,0,a]) translate([wheel_r-8,0,0]) cylinder(h=5, r=2);
}

module track_flat() {               // built in XY, extruded along Z
    difference() {
        union() {
            linear_extrude(track_w) offset(r=3) track_profile();
            track_ribs();
        }
        translate([0,0,track_w-2]) linear_extrude(4) offset(r=-3) track_profile();
    }
    for (x=[-wheel_base/2, wheel_base/2])
        translate([x,0,track_w-3]) wheel_face();
}

module corner_fan(sx, sy) {         // angular track guards at the corners
    for (i=[0:2])
        translate([sx*(wheel_base/2 + 9 + i*4),
                   sy*(track_y + track_w/2 + 1),
                   track_cz + 7 + i*7])
            rotate([0, sx*(28 + i*12), 0])
                cube([18, track_w+6, 3], center=true);
}

// ---------------- hull ----------------
module step_stack(sx, sy) {         // stepped armour slats on the deck
    for (i=[0:2])
        translate([sx*(hull_l/2 - 10 - i*10), sy*(hull_w/2 - 7),
                   hull_z + hull_h + 1 + i*4])
            rotate([0, -sx*10, 0]) cube([14, 20, 4], center=true);
}

module hull_body() {
    union() {
        translate([0,0,hull_z + hull_h/2]) rbox([hull_l, hull_w, hull_h], 7);
        // raised decks front & rear
        translate([ hull_l/2-24, 0, hull_z+hull_h]) rbox([40, hull_w-8, 6], 3);
        translate([-hull_l/2+22, 0, hull_z+hull_h]) rbox([36, hull_w-8, 6], 3);
        // turret collar
        translate([turret_x, 0, hull_z+hull_h-2]) cylinder(h=6, r=turret_r*0.82);
        // front lower grill ribs
        for (i=[-2:2])
            translate([hull_l/2-1, i*9, hull_z+8]) cube([7,6,15], center=true);
        // side straps
        for (s=[-1,1])
            translate([hull_l/2-32, s*(hull_w/2), hull_z+hull_h/2])
                cube([5,5,hull_h-8], center=true);
        // small deck hatch
        translate([hull_l/2-28, -9, hull_z+hull_h+4]) cube([13,11,4], center=true);
    }
}

// ---------------- weapons ----------------
module main_gun(bl=44) {
    difference() {
        union() {
            hull() { sphere(r=13); translate([12,0,0]) sphere(r=12); }   // mantlet
            rotate([0,90,0]) cylinder(h=bl, r=6.5);                      // barrel
            translate([26,0,0]) rotate([0,90,0]) cylinder(h=5, r=8.5);   // collar
            translate([bl,0,0]) rotate([0,90,0]) cylinder(h=17, r=9.5);  // muzzle brake
        }
        translate([bl+3,0,0]) rotate([0,90,0]) cylinder(h=20, r=7);      // bore
        for (a=[0:45:135])
            rotate([a,0,0]) translate([bl+8,0,0]) cube([3,24,3], center=true);
    }
}

module gatling(bl=42) {
    difference() {
        union() {
            sphere(r=11);                                                // ball mount
            rotate([0,90,0]) cylinder(h=bl, r=4);                        // core
            for (a=[0:360/7:359])
                rotate([a,0,0]) translate([0,0,7])
                    rotate([0,90,0]) cylinder(h=bl+2, r=2.6);            // barrels
            translate([10,0,0]) rotate([0,90,0]) cylinder(h=5, r=10.5);  // rear collar
            difference() {                                               // front ring
                translate([bl-6,0,0]) rotate([0,90,0]) cylinder(h=5, r=11);
                translate([bl-7,0,0]) rotate([0,90,0]) cylinder(h=7, r=8.6);
            }
        }
        for (a=[0:360/7:359])                                            // bores
            rotate([a,0,0]) translate([0,0,7]) translate([bl-4,0,0])
                rotate([0,90,0]) cylinder(h=9, r=1.3);
    }
}

module mortar(h=30) {               // multi tube grenade launcher
    difference() {
        union() {
            cylinder(h=h, r=7);
            translate([0,0,h-4]) cylinder(h=4, r=8.2);
            translate([0,0,4]) cylinder(h=3, r=8.2);
        }
        translate([0,0,h-7]) cylinder(h=10, r=2.2);
        for (a=[0:90:359])
            rotate([0,0,a]) translate([4.2,0,h-7]) cylinder(h=10, r=2.2);
    }
}

module small_barrel(len=32, r=4) {
    rotate([0,90,0]) cylinder(h=len, r=r);
    translate([len,0,0]) sphere(r=r*0.95);
    translate([6,0,0]) rotate([0,90,0]) cylinder(h=5, r=r+1.6);
}

module sensor_pod(len=26) {         // open ended canister / searchlight
    difference() {
        union() {
            rotate([0,90,0]) cylinder(h=len, r=8);
            translate([len-5,0,0]) rotate([0,90,0]) cylinder(h=5, r=9.5);
            translate([2,0,0])     rotate([0,90,0]) cylinder(h=4, r=9.5);
        }
        translate([len-9,0,0]) rotate([0,90,0]) cylinder(h=13, r=6);
    }
}

module sensor_box() {               // side box with two round ports
    difference() {
        rbox([22,18,24], 3);
        for (z=[-6,6]) translate([8,0,z]) rotate([0,90,0]) cylinder(h=10, r=4);
    }
}

module antenna(len=50, r=0.9) {
    cylinder(h=len, r1=r, r2=r*0.6);
    translate([0,0,len]) sphere(r=1.7);
}

module hook_pipe(h=18, R=8, r=1.8) {    // thin bent tube
    cylinder(h=h, r=r);
    translate([R,0,h]) mirror([1,0,0]) rotate([-90,0,0])
        rotate_extrude(angle=90) translate([R,0]) circle(r=r);
    translate([R,0,h+R]) rotate([0,90,0]) cylinder(h=7, r=r);
}

// ---------------- turret ----------------
module turret() {
    union() {
        dome(turret_r, turret_f);
        cylinder(h=8, r=turret_r*0.8);
        // raised top panels
        translate([6, 7, 23])  hatch_plate(28, 12, 4);
        translate([-4,-10, 22]) hatch_plate(22, 10, 4);
        translate([16, -2, 17]) rbox([16,14,8], 2);
    }
}

// ---------------- complete vehicle ----------------
module tank() {
    // hull & running gear
    hull_body();
    translate([0,  track_y, track_cz]) rotate([-90,0,0]) track_flat();
    translate([0, -track_y, track_cz]) rotate([ 90,0,0]) track_flat();
    for (sx=[-1,1]) for (sy=[-1,1]) corner_fan(sx, sy);
    for (sx=[-1,1]) for (sy=[-1,1]) step_stack(sx, sy);

    // turret
    translate([turret_x, 0, turret_z]) turret();

    // main cannon (front left)
    translate([turret_x+14, gun_y, turret_z+9]) rotate([0,4,0]) main_gun();

    // gatling gun on the right front deck
    translate([hull_l/2-26, 23, hull_z+hull_h+3]) cylinder(h=6, r=7);
    translate([hull_l/2-26, 23, hull_z+hull_h+9]) rotate([0,-12,8]) gatling();

    // secondary barrel above / left of the gatling
    translate([turret_x+18, 13, turret_z+13]) rotate([0,-9,7]) small_barrel(30, 4);

    // bent pipe next to the gatling
    translate([hull_l/2-30, 15, hull_z+hull_h+4]) hook_pipe(16, 7, 1.7);

    // grenade launcher cluster (rear left of dome)
    translate([turret_x-10, -5, turret_z+16]) rotate([4,-14,-8]) mortar(30);

    // antennas
    translate([turret_x-8, 8, turret_z+20]) rotate([-5,-13,0]) antenna(54);
    translate([turret_x-12, 3, turret_z+18]) rotate([-3,-25,0]) antenna(40);

    // searchlight pod, upper left of the dome
    translate([turret_x+4, -19, turret_z+16]) rotate([0,-22,-32]) sensor_pod(26);
    translate([turret_x+2, -17, turret_z+10]) rotate([0,-10,0]) cylinder(h=9, r=4);

    // sensor box on the right flank of the dome
    translate([turret_x+17, 21, turret_z+4]) rotate([0,0,24]) sensor_box();

    // hand rails
    translate([turret_x+6, gun_y-13, turret_z+7])  rotate([0,25,0])  rail(13,1.5,150);
    translate([hull_l/2-34, -hull_w/2-1, hull_z+hull_h+2]) rotate([0,0,-15]) rail(10,1.4,140);

    // short stub gun on the hull front left
    translate([hull_l/2-8, -17, hull_z+hull_h-6]) rotate([0,-18,-14]) small_barrel(16,5);
}

tank();