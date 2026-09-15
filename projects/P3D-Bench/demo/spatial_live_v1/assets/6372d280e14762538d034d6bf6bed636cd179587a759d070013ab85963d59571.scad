// ============================================================
// Industrial articulated robotic arm (interpreted from image)
// Base plate w/ mounting pads -> turntable -> shoulder housing
// -> axis-2 joint w/ hex shaft -> A-frame -> arm tube -> wrist
// All dimensions in mm (estimated from proportions)
// ============================================================
$fn = 90;

// ---- Base plate ----
base_w = 150;  base_d = 116;  base_h = 14;
pad_w  = 36;   pad_d  = 36;   pad_h  = 17;
bolt_d = 6;    bolt_spacing = 18;

// ---- Turntable ----
tt_ring_h = 3;  tt1_d = 88;  tt1_h = 9;  tt2_d = 72;  tt2_h = 9;

// ---- Shoulder / axis-2 joint ----
axis2_z = 96;            // height of shoulder axis above base top
axis2_r = 30;            // big disc radius
axis2_w = 54;            // disc width (Y)
hex_r   = 12;  hex_len = 26;

// ---- Upper A-frame ----
apex_x    = 16;          // pivot X (leaning back)
apex_z    = 162;         // pivot height above base top
plate_t   = 10;
frame_gap = 60;          // distance between side plates
arm_x     = 12;          // shift of whole upper assembly on base

// ---- Arm tube / wrist ----
arm_tilt   = -7;         // deg, wrist end dips down
tube_d     = 32;
tube_front = -110;       // local X of tube front end
tube_rear  = 44;         // local X of tube rear end

// ---------- helpers ----------
module cyl_x(x, h, r)  // cylinder along +X starting at x
    translate([x,0,0]) rotate([0,90,0]) cylinder(h=h, r=r);

module strut(x1,z1,r1, x2,z2,r2, t)  // plate strut in X-Z plane
    hull() {
        translate([x1,0,z1]) rotate([90,0,0]) cylinder(h=t, r=r1, center=true);
        translate([x2,0,z2]) rotate([90,0,0]) cylinder(h=t, r=r2, center=true);
    }

// ---------- base ----------
module base() {
    difference() {
        union() {
            hull()                                   // main slab, rounded corners
                for (sx=[-1,1], sy=[-1,1])
                    translate([sx*(base_w/2-8), sy*(base_d/2-8), 0])
                        cylinder(h=base_h, r=8);
            for (sx=[-1,1], sy=[-1,1])               // 4 mounting pads
                translate([sx*(base_w/2-6), sy*(base_d/2-6), 0])
                    hull()
                        for (px=[-1,1], py=[-1,1])
                            translate([px*(pad_w/2-5), py*(pad_d/2-5), 0])
                                cylinder(h=pad_h, r=5);
        }
        for (sx=[-1,1], sy=[-1,1])                   // pad bolt holes
            translate([sx*(base_w/2-6), sy*(base_d/2-6), 0])
                for (i=[-1,1])
                    translate([i*bolt_spacing/2, 0, -1])
                        cylinder(h=pad_h+2, d=bolt_d);
        for (sy=[-1,1])                              // side notches
            translate([base_w/2-6, sy*30-6, 3]) cube([10,12,base_h]);
        translate([-8, -base_d/2-1, 4]) cube([18,6,7]);   // front pockets
        translate([18, -base_d/2-1, 4]) cube([18,6,7]);
    }
    translate([-42, -base_d/2-4, 2]) cube([18,10,12]);    // connector block
    for (i=[0:2])                                         // connector pins
        translate([-36.5+i*5, -base_d/2-4, 7])
            rotate([90,0,0]) cylinder(h=6, d=3);
    translate([-52, -base_d/2+22, base_h]) cube([14,22,6]); // top details
    translate([46, 16, base_h]) cube([24,26,9]);
}

// ---------- turntable ----------
module turntable() {
    cylinder(h=tt_ring_h, d=94);
    translate([0,0,tt_ring_h])           cylinder(h=tt1_h, d=tt1_d);
    translate([0,0,tt_ring_h+tt1_h-2])   cylinder(h=2, d=tt2_d+6);  // groove ring
    translate([0,0,tt_ring_h+tt1_h])     cylinder(h=tt2_h, d=tt2_d);
}

// ---------- shoulder housing (tapered, wraps lower disc) ----------
module shoulder() {
    z0 = tt_ring_h + tt1_h + tt2_h;
    hull() {
        translate([-27,-26,z0-2]) cube([54,52,10]);
        translate([0,0,axis2_z]) rotate([90,0,0])
            cylinder(h=axis2_w-16, r=axis2_r-2, center=true);
    }
}

// ---------- axis-2 joint: disc, rings, hex output shaft ----------
module axis2_joint() {
    translate([0,0,axis2_z]) {
        rotate([90,0,0]) cylinder(h=axis2_w, r=axis2_r, center=true);
        translate([0, axis2_w/2+1,0]) rotate([90,0,0]) cylinder(h=5, r=25, center=true);
        translate([0, axis2_w/2+4,0]) rotate([90,0,0]) cylinder(h=5, r=20, center=true);
        translate([0, axis2_w/2+7,0]) rotate([90,0,0]) cylinder(h=5, r=15, center=true);
        translate([0, axis2_w/2+hex_len/2+6,0]) rotate([90,0,0])
            cylinder(h=hex_len, r=hex_r, center=true, $fn=6);          // hex shaft
        translate([0, axis2_w/2+hex_len+9,0]) rotate([90,0,0])
            cylinder(h=7, r=hex_r-4.5, center=true, $fn=6);            // hex cap
        translate([0, axis2_w/2+hex_len+13,0]) rotate([90,0,0])
            cylinder(h=3, d=6, center=true);                           // center bolt
        translate([0,-axis2_w/2-3,0]) rotate([90,0,0]) cylinder(h=8, r=13, center=true);
        translate([0,-axis2_w/2-7,0]) rotate([90,0,0]) cylinder(h=4, r=8, center=true);
    }
}

// ---------- A-frame (two struts per side + cross braces) ----------
module frame() {
    for (sy=[-1,1])
        translate([0, sy*frame_gap/2, 0]) {
            strut(-24, axis2_z-16, 12,  apex_x-4, apex_z-6, 9, plate_t);
            strut( 22, axis2_z-2,  12,  apex_x-4, apex_z-6, 9, plate_t);
        }
    translate([apex_x-4,0,apex_z-6]) rotate([90,0,0])
        cylinder(h=frame_gap+2*plate_t+4, r=10, center=true);          // apex pin
    translate([apex_x-12,0,axis2_z+34]) rotate([90,0,0])
        cylinder(h=frame_gap, r=7, center=true);                       // lower brace
}

// ---------- arm: tube, wrist stack + gripper, rear flanges + posts ----------
module arm() {
    rotate([90,0,0]) cylinder(h=frame_gap+22, r=13, center=true);      // pivot boss
    hull() {                                                           // fairing wedge
        rotate([90,0,0]) cylinder(h=frame_gap-8, r=13, center=true);
        translate([-4,0,8]) cube([36, frame_gap-18, 16], center=true);
    }
    translate([0,0,6]) {
        cyl_x(tube_front, tube_rear-tube_front, tube_d/2);             // main tube
        // wrist end: stepped flanges + taper
        cyl_x(tube_front-6, 6, 20);
        cyl_x(tube_front-10, 4, 17);
        cyl_x(tube_front-22, 12, 14);
        translate([tube_front-32,0,0]) rotate([0,90,0]) cylinder(h=10, r1=14, r2=9);
        cyl_x(tube_front-46, 14, 9);
        cyl_x(tube_front-49, 3, 11);
        cyl_x(tube_front-55, 3, 11);
        translate([tube_front-62,0,0]) rotate([0,90,0]) cylinder(h=7, r1=11, r2=8);
        // tool head / gripper tip
        translate([tube_front-76,-7,-8]) cube([12,14,16]);
        translate([tube_front-82,0,0]) rotate([0,90,0]) cylinder(h=6, d=8);
        translate([tube_front-84,0,0]) rotate([0,90,0]) cylinder(h=3, r=5, $fn=6);
        // rear end: grooved flange stack + cap
        cyl_x(tube_rear,    6, 19);
        cyl_x(tube_rear+6,  5, 23);
        cyl_x(tube_rear+11, 6, 20);
        cyl_x(tube_rear+17, 3, 23);
        cyl_x(tube_rear+20, 8, 18);
        // twin angled motor posts on rear cap
        for (sy=[-1,1])
            translate([tube_rear+24, sy*9, 2]) rotate([0,-38,0]) {
                cylinder(h=8, r=8);
                cylinder(h=28, r=6);
                translate([0,0,28]) cylinder(h=4, r=4.5);
            }
    }
}

// ---------- assembly ----------
color([0.62,0.63,0.66]) {
    base();
    translate([arm_x, 0, base_h]) {
        turntable();
        shoulder();
        axis2_joint();
        frame();
        translate([-30,-24,34]) cube([16,16,24]);        // junction box on shoulder
        translate([apex_x-4, 0, apex_z-6])
            rotate([0, arm_tilt, 0])
                arm();
    }
}