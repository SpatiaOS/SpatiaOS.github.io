// ============================================================
// Stylized industrial robot arm - parametric OpenSCAD model
// Units: millimeters. Pose recreated from the reference image:
// swivel base plate, rotating waist, tilted lower arm,
// shoulder drum with drive shaft, upper arm tube with
// stepped wrist, parallel link rod to the rear bracket.
// ============================================================

$fn = 64;

// ---------------- parameters ----------------
// base plate
base_w   = 200;    // square footprint
base_t   = 26;     // plate thickness
tab_sz   = 60;     // corner mounting tabs
tab_off  = 94;     // tab centre offset from origin
hole_d   = 14;     // mounting hole diameter
pocket_d = 26;     // hex bolt pocket

// waist / turret
t1_d = 150;  t1_h = 10;    // lower flange ring
t2_d = 118;  t2_h = 46;    // turret barrel
t3_d =  96;  t3_h =  8;    // top ring

// shoulder drum (pitch axis)
sh_z   = 160;    // shoulder axis height above base
drum_d = 140;    // drum diameter
drum_w = 100;    // drum width

// lower arm
arm_a  = 22;     // lean angle from vertical (deg)
arm_l  = 200;    // length shoulder -> elbow
elbow  = [arm_l*sin(arm_a), 0, sh_z + arm_l*cos(arm_a)];

// upper arm (tube) + wrist
tube_a = -100;   // tube axis tilt about Y (deg)
tube_l = 190;    // usable tube length
tube_d = 50;     // tube diameter

// parallel link rod
rod_y  = 44;                       // rod plane offset (+Y side)
rod_a  = [42, rod_y, 265];         // lower rod end (on arm side)
rod_b  = [100, rod_y, 385];        // upper rod end (rear bracket)

// ---------------- base plate ----------------
module base_plate() {
    color([0.52, 0.53, 0.56]) {
        difference() {
            union() {
                translate([0,0,base_t/2]) cube([base_w, base_w, base_t], center=true);
                // corner mounting tabs (stepped look)
                for (sx = [-1,1], sy = [-1,1])
                    translate([sx*tab_off, sy*tab_off, base_t/2])
                        cube([tab_sz, tab_sz, base_t], center=true);
            }
            // mounting holes
            for (sx = [-1,1], sy = [-1,1])
                translate([sx*tab_off, sy*tab_off, base_t/2])
                    cylinder(d=hole_d, h=base_t+2, center=true);
            // hex bolt pockets
            for (sx = [-1,1], sy = [-1,1])
                translate([sx*tab_off, sy*tab_off, base_t-5])
                    cylinder(d=pocket_d, h=9, $fn=6);
            // cable recess on top face
            translate([0, -base_w/2+18, base_t-5]) cube([46, 22, 10], center=true);
        }
        // front connector boss with two screw holes
        difference() {
            translate([0, -base_w/2-8, base_t/2-4]) cube([54, 20, 24], center=true);
            for (sx = [-1,1])
                translate([sx*15, -base_w/2-8, base_t/2-4])
                    rotate([90,0,0]) cylinder(d=7, h=40, center=true);
        }
    }
}

// ---------------- waist / turret ----------------
module waist() {
    color([0.62, 0.63, 0.66]) {
        translate([0,0,base_t])          cylinder(d=t1_d, h=t1_h);
        translate([0,0,base_t])          cylinder(d=t2_d, h=t2_h);
        translate([0,0,base_t+t2_h])     cylinder(d=t3_d, h=t3_h);
    }
}

// ---------------- shoulder housing ----------------
module shoulder_housing() {
    color([0.62, 0.63, 0.66])
    hull() {
        translate([0,0,base_t+t2_h+t3_h]) cube([112, 104, 2], center=true);
        translate([0,0,sh_z])             cube([86, 86, 2],   center=true);
    }
}

// ---------------- shoulder drum with drive shaft ----------------
module shoulder_drum() {
    color([0.58, 0.59, 0.62])
    translate([0,0,sh_z]) rotate([-90,0,0]) {
        cylinder(d=drum_d, h=drum_w, center=true);                 // main drum
        translate([0,0,drum_w/2])      cylinder(d=76, h=42);       // front hub
        translate([0,0,drum_w/2+42])   cylinder(d=34, h=50, $fn=6);// hex drive
        translate([0,0,drum_w/2+92])   cylinder(d=16, h=12);       // shaft end
        translate([0,0,-drum_w/2-14])  cylinder(d=112, h=14);      // rear cover
    }
}

// ---------------- lower arm (tilted box) ----------------
module lower_arm() {
    color([0.70, 0.71, 0.73])
    translate([0,0,sh_z]) rotate([0, arm_a, 0])
        hull() {
            translate([0,0,-35])       cube([64, 76, 2], center=true);
            translate([0,0,arm_l-25])  cube([52, 58, 2], center=true);
        }
}

// ---------------- upper arm tube + wrist ----------------
module upper_arm() {
    color([0.75, 0.76, 0.78])
    translate(elbow) rotate([0, tube_a, 0]) {
        cylinder(d=tube_d, h=tube_l);                              // main tube
        // rear bearing stack (over the elbow)
        translate([0,0,-32]) cylinder(d=92, h=32);
        translate([0,0,-46]) cylinder(d=66, h=14);
        translate([0,0,-58]) cylinder(d=42, h=12);
        // retaining bolts
        for (s = [-1,1]) translate([0, s*20, -74]) cylinder(d=11, h=24);
        // collar before wrist
        translate([0,0,tube_l-40]) cylinder(d=64, h=16);
        // stepped wrist stack ending in hex tool flange
        translate([0,0,tube_l])      cylinder(d=70, h=18);
        translate([0,0,tube_l+18])   cylinder(d=54, h=16);
        translate([0,0,tube_l+34])   cylinder(d=44, h=14, $fn=6);
        translate([0,0,tube_l+48])   cylinder(d=32, h=12);
        translate([0,0,tube_l+60])   cylinder(d=12, h=16);         // neck
        translate([0,0,tube_l+76])   cylinder(d=20, h=8);          // tip
    }
}

// ---------------- parallel link rod ----------------
module rod_between(A, B, d) {
    v  = B - A;
    L  = norm(v);
    n  = v / L;
    ax = (abs(n[0]) < 1e-9 && abs(n[1]) < 1e-9) ? [0,1,0] : [-n[1], n[0], 0];
    translate(A) rotate(acos(n[2]), ax) cylinder(d=d, h=L);
}

module link_rod() {
    color([0.68, 0.69, 0.71]) {
        rod_between(rod_a, rod_b, 13);
        translate(rod_a) rotate([-90,0,0]) cylinder(d=30, h=38, center=true);
        translate(rod_b) rotate([-90,0,0]) cylinder(d=30, h=32, center=true);
    }
}

// ---------------- rear bracket (tube -> rod) ----------------
module rear_bracket() {
    color([0.70, 0.71, 0.73])
    hull() {
        translate([103, 6, 349])       cube([44, 40, 34], center=true);
        translate([rod_b[0], rod_y, rod_b[2]]) cube([24, 18, 20], center=true);
    }
}

// ---------------- assembly ----------------
base_plate();
waist();
shoulder_housing();
shoulder_drum();
lower_arm();
upper_arm();
rear_bracket();
link_rod();