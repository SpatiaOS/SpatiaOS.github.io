// =====================================================================
//  4-axis palletizing / industrial robot arm
//  Base plate -> rotating turret -> shoulder bearing -> lower arm
//  -> parallelogram link -> long upper arm -> wrist / tool flange
// =====================================================================

$fn = 64;

// ---------------- Base plate ----------------
base_l      = 200;   // plate length (X)
base_w      = 185;   // plate width  (Y)
base_h      = 12;    // lower flange thickness
base_c      = 24;    // corner chamfer
riser_ins   = 22;    // inset of raised block
riser_h     = 18;    // raised block height
base_top    = base_h + riser_h;

// ---------------- Turret (axis 1) ----------------
turret_d    = 140;   // slew-ring diameter
ring_h      = 12;

// ---------------- Shoulder (axis 2) ----------------
sh_z        = 110;   // shoulder axis height above base top
sh_r        = 48;    // bearing housing radius
sh_w        = 56;    // housing width along axis

// ---------------- Lower arm ----------------
la_len      = 165;
la_ang      = 8;     // tilt of lower arm (deg, towards +X)
link_off    = 62;    // parallelogram link offset behind arm

// ---------------- Upper arm (axis 3) ----------------
ua_len      = 270;
ua_ang      = 22;    // elevation of upper arm above horizontal
ua_r        = 27;    // main tube radius

// ---------------- Derived geometry (turret frame) ----------------
u_arm  = [sin(la_ang), 0, cos(la_ang)];    // lower-arm axis
p_arm  = [cos(la_ang), 0,-sin(la_ang)];    // perpendicular (backwards)
sh_pt  = [0, 0, sh_z];
elb_pt = sh_pt + la_len * u_arm;
linkA  = sh_pt  - link_off * p_arm - 18 * u_arm;
linkB  = elb_pt - link_off * p_arm;

// =====================================================================
//  Helper modules
// =====================================================================

// rectangular plate with 45 deg cut corners
module chamfered_plate(l, w, h, c) {
    linear_extrude(h)
        polygon([[-l/2+c,-w/2],[ l/2-c,-w/2],[ l/2,-w/2+c],[ l/2, w/2-c],
                 [ l/2-c, w/2],[-l/2+c, w/2],[-l/2, w/2-c],[-l/2,-w/2+c]]);
}

// slender bar between two points (axis of the round ends along Y)
module strut(p1, p2, r, t) {
    hull() {
        translate(p1) rotate([90,0,0]) cylinder(h=t, r=r, center=true);
        translate(p2) rotate([90,0,0]) cylinder(h=t, r=r, center=true);
    }
}

// =====================================================================
//  Base assembly
// =====================================================================
module base_plate() {
    difference() {
        union() {
            chamfered_plate(base_l, base_w, base_h, base_c);                    // flange
            translate([0,0,base_h-0.01])                                        // raised block
                chamfered_plate(base_l-2*riser_ins, base_w-2*riser_ins,
                                riser_h, base_c*0.55);
            // corner mounting pads
            for (m = [[1,1],[1,-1],[-1,1],[-1,-1]])
                translate([m[0]*(base_l/2-30), m[1]*(base_w/2-28), 0])
                    cylinder(h=base_h+4, r=17);
            // cable / connector box on the -X side
            translate([-base_l/2+4, -34, base_h]) cube([28, 68, 22]);
        }
        // corner bolt holes
        for (m = [[1,1],[1,-1],[-1,1],[-1,-1]])
            translate([m[0]*(base_l/2-30), m[1]*(base_w/2-28), -1])
                cylinder(h=base_h+12, r=6);
        // connector face pockets
        translate([-base_l/2+2, -20, base_h+5]) cube([6, 16, 10]);
        for (i=[0:2]) translate([-base_l/2+2, 6+i*9, base_h+8])
            rotate([0,90,0]) cylinder(h=8, r=3);
    }
}

// =====================================================================
//  Turret : slew ring + pedestal carrying the shoulder
// =====================================================================
module turret() {
    // slew ring / rotating flange
    cylinder(h=ring_h, d=turret_d);
    translate([0,0,ring_h]) cylinder(h=8, d1=turret_d, d2=turret_d-16);

    // pedestal blending into the shoulder housing
    hull() {
        translate([0,0,ring_h+6]) cylinder(h=8, d=turret_d-26);
        translate(sh_pt) rotate([90,0,0]) cylinder(h=sh_w+8, r=34, center=true);
    }
    // rear crank boss for the parallelogram link
    hull() {
        translate(linkA) rotate([90,0,0]) cylinder(h=30, r=20, center=true);
        translate([0,0,sh_z-30]) rotate([90,0,0]) cylinder(h=40, r=26, center=true);
    }
}

// =====================================================================
//  Shoulder bearing housing (axis along +Y) with hex output shaft
// =====================================================================
module shoulder() {
    rotate([-90,0,0]) {
        translate([0,0,-sh_w/2]) cylinder(h=sh_w, r=sh_r);        // main body
        translate([0,0, sh_w/2])       cylinder(h=7, r=sh_r*0.88); // face rings
        translate([0,0, sh_w/2+7])     cylinder(h=7, r=sh_r*0.70);
        translate([0,0, sh_w/2+14])    cylinder(h=6, r=sh_r*0.50);
        translate([0,0, sh_w/2+20])    cylinder(h=48, r=17, $fn=6); // hex shaft
        translate([0,0, sh_w/2+68])    cylinder(h=8,  r=12);
        translate([0,0,-sh_w/2-9])     cylinder(h=9,  r=sh_r*0.78); // rear cover
    }
}

// =====================================================================
//  Lower arm : tapered casting shoulder -> elbow
// =====================================================================
module lower_arm() {
    hull() {
        rotate([90,0,0]) cylinder(h=46, r=37, center=true);
        translate([0,0,la_len]) rotate([90,0,0]) cylinder(h=36, r=26, center=true);
    }
    // stiffening rib on the back face
    hull() {
        translate([-24,0,20])       rotate([90,0,0]) cylinder(h=20, r=12, center=true);
        translate([-8,0,la_len-30]) rotate([90,0,0]) cylinder(h=18, r=9,  center=true);
    }
}

// =====================================================================
//  Elbow joint housing
// =====================================================================
module elbow() {
    rotate([90,0,0]) {
        cylinder(h=44, r=27, center=true);
        for (s=[-1,1]) translate([0,0,s*22]) cylinder(h=6, r=22, center=true);
    }
}

// =====================================================================
//  Wrist : protective bellows, roll tube and tool flange
// =====================================================================
module wrist() {
    for (i=[0:3])                                  // bellows rings
        translate([0,0,i*11]) cylinder(h=9, r1=ua_r+4, r2=ua_r-1);
    translate([0,0,44]) cylinder(h=26, r=15);      // roll tube
    translate([0,0,70]) cylinder(h=10, r=19);      // wrist body
    translate([0,0,80]) rotate([0,25,0]) {         // bend axis
        cylinder(h=16, r=13);
        translate([0,0,16]) cylinder(h=7, r=17, $fn=6);  // hex hub
        translate([0,0,23]) cylinder(h=6, r=13);         // tool flange
        translate([0,0,29]) cylinder(h=5, r=8);
    }
}

// =====================================================================
//  Upper arm : casting at the elbow + long tube + wrist
// =====================================================================
module upper_arm() {
    // elbow-side casting
    hull() {
        rotate([90,0,0]) cylinder(h=42, r=31, center=true);
        translate([0,0,70]) cylinder(h=12, r=ua_r+5);
    }
    cylinder(h=ua_len-80, r=ua_r);                     // main tube
    translate([0,0,ua_len-80]) cylinder(h=14, r=ua_r+3);
    translate([0,0,ua_len-70]) wrist();
}

// =====================================================================
//  Parallelogram linkage (drive rod behind the lower arm)
// =====================================================================
module linkage() {
    strut(linkA, linkB, 15, 24);                       // main rod
    translate(linkA) rotate([90,0,0]) cylinder(h=32, r=17, center=true);
    translate(linkB) rotate([90,0,0]) cylinder(h=32, r=17, center=true);
    // triangular gusset tying the rod head to the elbow
    hull() {
        translate(linkB)  rotate([90,0,0]) cylinder(h=26, r=15, center=true);
        translate(elb_pt) rotate([90,0,0]) cylinder(h=34, r=22, center=true);
    }
}

// =====================================================================
//  Complete robot
// =====================================================================
module robot() {
    color("silver") {
        base_plate();
        translate([0,0,base_top]) {
            turret();
            linkage();
            translate(sh_pt) shoulder();
            translate(sh_pt) rotate([0,la_ang,0]) {
                lower_arm();
                translate([0,0,la_len]) {
                    elbow();
                    rotate([0, 90-ua_ang-la_ang, 0]) upper_arm();
                }
            }
        }
    }
}

robot();