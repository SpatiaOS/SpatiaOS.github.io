// -----------------------------------------------------------
// Stylized industrial robot arm with camera end-effector
// Interpretation of image:
//   - notched base plate with mounting tabs, holes, nameplate
//   - rotating turret with shoulder disc + hex bolt
//   - tapered lower arm with side motor, brace links
//   - elbow joint, cylindrical forearm with stepped collars
//   - small wrist camera with lens at the tip
// Units: mm
// -----------------------------------------------------------

$fn = 96;

/* ---------- Base plate ---------- */
base_l = 128;  base_w = 100;  base_h = 14;
corner_cut = 26;                              // front-left notch
tab_l = 24; tab_w = 12; tab_h = 7;
tab_x = 48; tab_y = 20; tab_hole_d = 5;
plate_len = 26; plate_h = 9; plate_t = 2.5;   // nameplate

/* ---------- Turret (J1 housing) ---------- */
flange_d = 96; flange_h = 7;
tur_d = 76;  tur_h = 26;
cap_d = 64;  cap_h = 8;
disc_d = 44; disc_len = 24; disc_z = 35;
bolt_hex_d = 15; bolt_len = 12;

/* ---------- Lower arm (J2) ---------- */
arm_ang = 60;                                 // rise angle from horizontal
arm_len = 115;
arm_base = [44, 30];                          // cross-section at shoulder
arm_tip  = [26, 20];                          // cross-section at elbow
motor_d = 24; motor_len = 36;

/* ---------- Brace links ---------- */
brace_w = 14; brace_t = 8; brace_y = 16;

/* ---------- Elbow (J3) ---------- */
elbow_d = 38; elbow_len = 44; ecap_d = 46;

/* ---------- Forearm ---------- */
fore_len = 82; fore_d = 22; fore_tilt = 14;   // droop below horizontal
col1_d = 32; col1_h = 16;
col2_d = 27; col2_h = 10;
col3_d = 24; col3_h = 8;
nose_d = 19;

/* ---------- Wrist camera ---------- */
tool_base_d = 15; tool_base_h = 5;
drum_d = 18; drum_h = 4;
tool_body = [15, 13, 12];
lens_d = 8; lens_len = 5;

/* ---------- Derived joint positions ---------- */
S = [0, 0, base_h + flange_h + tur_h + 3];            // shoulder pivot
E = S + arm_len * [-cos(arm_ang), 0, sin(arm_ang)];   // elbow pivot

// Flat strut between two points
module link(p1, p2, w, t) {
    v = p2 - p1;
    az = atan2(v[1], v[0]);
    ay = atan2(sqrt(v[0]*v[0] + v[1]*v[1]), v[2]);
    translate(p1) rotate([0, 0, az]) rotate([0, ay, 0])
        hull() {
            translate([0, 0, 1])         cube([w, t, 2], center = true);
            translate([0, 0, norm(v)-1]) cube([w, t, 2], center = true);
        }
}

// Base plate with notch, tabs, holes and nameplate
module base_plate() {
    difference() {
        union() {
            translate([0, 0, base_h/2]) cube([base_l, base_w, base_h], center = true);
            for (y = [tab_y, -tab_y])                       // raised mounting tabs
                translate([tab_x, y, base_h + tab_h/2])
                    cube([tab_l, tab_w, tab_h], center = true);
            translate([-base_l/2 + 30, -base_w/2 - plate_t, base_h - plate_h - 2])
                cube([plate_len, plate_t + 1, plate_h]);    // nameplate
        }
        for (y = [tab_y, -tab_y])                           // tab holes
            translate([tab_x, y, -1])
                cylinder(h = base_h + tab_h + 2, d = tab_hole_d);
        translate([-base_l/2 - 1, -base_w/2 - 1, -1])       // corner notch
            cube([corner_cut, corner_cut*0.85, base_h + 2]);
        translate([-base_l/2 - 1, -10, 5])                  // left face recess
            cube([8, 20, 6]);
    }
}

// Turret: flange, body, tapered cap, shoulder disc + hex bolt
module turret() {
    translate([0, 0, base_h]) {
        cylinder(h = flange_h, d = flange_d);
        translate([0, 0, flange_h])         cylinder(h = tur_h, d = tur_d);
        translate([0, 0, flange_h + tur_h]) cylinder(h = cap_h, d1 = cap_d, d2 = cap_d - 12);
    }
    translate([tur_d/2 - 8, 0, disc_z]) rotate([0, 90, 0]) {
        cylinder(h = disc_len, d = disc_d);
        translate([0, 0, disc_len])     cylinder(h = 4, d = 18);
        translate([0, 0, disc_len + 4]) cylinder(h = bolt_len, d = bolt_hex_d, $fn = 6);
    }
}

// Tapered lower arm with hub, collar and side motor
module lower_arm() {
    translate(S) rotate([0, -(90 - arm_ang), 0]) {
        hull() {
            translate([0, 0, 4])           cube([arm_base[0], arm_base[1], 8],  center = true);
            translate([0, 0, arm_len - 5]) cube([arm_tip[0],  arm_tip[1],  10], center = true);
        }
        rotate([90, 0, 0]) cylinder(h = 44, d = 40, center = true);       // shoulder hub
        translate([0, 0, arm_len - 12]) cylinder(h = 14, d = 34, center = true);
        // side motor pointing down-forward
        translate([-30, 0, 18]) rotate([0, 90, 0]) cylinder(h = motor_len, d = motor_d, center = true);
        translate([-36, 0, 18]) rotate([0, 90, 0]) cylinder(h = 5, d = motor_d + 4, center = true);
        translate([-50, 0, 18]) rotate([0, 90, 0]) cylinder(h = 4, d = motor_d + 3, center = true);
        translate([-55, 0, 18]) rotate([0, 90, 0]) cylinder(h = 6, d = 9, center = true);
    }
}

// Brace links from turret to elbow
module braces() {
    for (y = [brace_y, -brace_y])
        link([14, y, 32], [E[0] + 14, y, E[2]], brace_w, brace_t);
}

// Elbow joint with end caps and fittings
module elbow_joint() {
    translate(E) rotate([90, 0, 0]) {
        cylinder(h = elbow_len, d = elbow_d, center = true);
        for (s = [-1, 1])
            translate([0, 0, s*(elbow_len/2 - 1)])
                cylinder(h = 6, d = ecap_d, center = true);
    }
    translate([E[0] + 8,  10, E[2] + 20]) rotate([0, -15, 0]) cylinder(h = 14, d = 7, center = true);
    translate([E[0] + 14, -8, E[2] + 18]) rotate([0, -15, 0]) cylinder(h = 12, d = 6, center = true);
}

// Cylindrical forearm with stepped collars and wrist camera
module forearm() {
    translate(E) rotate([0, -(90 + fore_tilt), 0]) {
        cylinder(h = fore_len, d = fore_d);
        translate([0, 0, fore_len - 41]) cylinder(h = col1_h, d = col1_d);
        translate([0, 0, fore_len - 25]) cylinder(h = col2_h, d = col2_d);
        translate([0, 0, fore_len - 15]) cylinder(h = col3_h, d = col3_d);
        translate([0, 0, fore_len - 7])  cylinder(h = 8, d = nose_d);
        // wrist camera assembly
        translate([0, 0, fore_len + 1])  cylinder(h = tool_base_h, d = tool_base_d);
        translate([0, 0, fore_len + 6])  cylinder(h = drum_h, d = drum_d);
        translate([0, 0, fore_len + 16]) cube(tool_body, center = true);
        translate([0, 0, fore_len + 22]) cylinder(h = lens_len, d = lens_d);
        translate([0, 0, fore_len + 27]) cylinder(h = 2, d = 4.5);
    }
}

// ------- Assembly -------
module robot_arm() {
    base_plate();
    turret();
    lower_arm();
    braces();
    elbow_joint();
    forearm();
}

robot_arm();