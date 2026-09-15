// Parametric industrial robot arm (6-axis style manipulator)
// Interpretation: mounting base plate with tabs, rotating turret,
// tilted shoulder column, shoulder joint with hex shaft, lower arm link,
// parallel support rod, elbow joint, long cylindrical forearm with
// collars, wrist stack and tool flange.

$fn = 64;

// ---- Base parameters ----
base_w   = 110;   // base plate width (X)
base_d   = 110;   // base plate depth (Y)
base_h   = 16;    // base plate thickness
tab_l    = 20;    // mounting tab length
tab_w    = 25;    // mounting tab width
tab_h    = 10;    // mounting tab thickness
hole_d   = 6;     // tab bolt hole diameter
turret_d = 64;    // turret diameter
turret_h = 14;    // turret height

// ---- Shoulder / arm parameters ----
col_w    = 44;    // shoulder column width
col_t    = 40;    // shoulder column thickness
col_len  = 50;    // shoulder column length
col_tilt = 25;    // column tilt from vertical (deg, toward -X)
sh_joint_d = 56;  // shoulder joint diameter
sh_joint_l = 66;  // shoulder joint length (Y)
hex_d    = 22;    // hex shaft diameter
hex_l    = 40;    // hex shaft length
link_len = 95;    // lower arm link length
arm_tilt = 20;    // lower arm tilt from vertical (deg, toward -X)
elbow_d  = 44;    // elbow joint diameter
elbow_l  = 56;    // elbow joint length

// ---- Forearm / wrist parameters ----
fore_d     = 26;  // forearm tube diameter
fore_len   = 120; // forearm tube length
collar_d   = 44;  // collar ring diameter
fore_pitch = 15;  // forearm elevation above horizontal (deg)
wrist_d    = 20;  // wrist segment diameter
flange_d   = 26;  // tool flange diameter
tool_d     = 12;  // tool stub diameter

// ---- Joint position functions ----
function sh_pos() = [-sin(col_tilt)*col_len, 0,
                      base_h + turret_h - 6 + cos(col_tilt)*col_len];
function el_pos() = sh_pos() + [-sin(arm_tilt)*link_len, 0,
                                 cos(arm_tilt)*link_len];

// Cylinder oriented along Y axis
module y_cyl(d, l) { rotate([-90,0,0]) cylinder(h=l, d=d, center=true); }

// Base plate with mounting tabs, front boss, pocket and holes
module base_plate() {
    difference() {
        union() {
            translate([-base_w/2, -base_d/2, 0]) cube([base_w, base_d, base_h]);
            for (sx = [-1,1], sy = [-1,1])
                translate([sx*(base_w/2 + tab_l/2 - 6), sy*(base_d/2 - 22), tab_h/2])
                    cube([tab_l+6, tab_w, tab_h], center=true);
            translate([-38, -base_d/2 - 2, 0]) cube([46, 10, 26]); // front boss
        }
        for (sx = [-1,1], sy = [-1,1])
            translate([sx*(base_w/2 + tab_l - 8), sy*(base_d/2 - 22), -1])
                cylinder(h=tab_h+2, d=hole_d);
        translate([-30, -base_d/2 - 4, 8]) cube([26, 4, 12]); // boss window
        for (x = [0, 6])
            translate([x, -base_d/2 - 5, 6]) rotate([-90,0,0])
                cylinder(h=10, d=4); // small face holes
    }
}

// Rotating turret + tilted shoulder column
module shoulder_column() {
    translate([0,0,base_h]) cylinder(h=turret_h, d=turret_d);
    translate([0,0,base_h+turret_h-4]) cylinder(h=10, d=turret_d-12);
    translate([0,0,base_h+turret_h-6]) rotate([0,-col_tilt,0])
        translate([0,0,col_len/2]) cube([col_w, col_t, col_len], center=true);
}

// Shoulder joint drum with hex output shaft
module shoulder_joint() {
    translate(sh_pos()) y_cyl(sh_joint_d, sh_joint_l);
    translate(sh_pos() + [0, sh_joint_l/2 - 5, 0]) rotate([-90,0,0])
        cylinder(h=hex_l, d=hex_d, $fn=6);
    translate(sh_pos() + [0, sh_joint_l/2 + hex_l - 5, 0]) rotate([-90,0,0])
        cylinder(h=6, d=hex_d+8, $fn=6);
}

// Lower arm link (hulled drums + web) and side motor block
module lower_arm() {
    hull() {
        translate(sh_pos()) y_cyl(48, 30);
        translate(el_pos()) y_cyl(40, 26);
        translate((sh_pos()+el_pos())/2) rotate([0,-arm_tilt,0])
            cube([20, 26, link_len], center=true);
    }
    translate((sh_pos()+el_pos())/2 + [0,-20,0]) rotate([0,-arm_tilt,0])
        cube([18, 14, 30], center=true);
}

// Parallel support rod from shoulder rear to elbow rear
module parallel_rod() {
    p1 = sh_pos() + [34, 22, 8];
    p2 = el_pos() + [26, 22, -4];
    hull() { translate(p1) y_cyl(14, 10); translate(p2) y_cyl(14, 10); }
}

// Elbow joint drum with face rings
module elbow_joint() {
    translate(el_pos()) y_cyl(elbow_d, elbow_l);
    translate(el_pos()) y_cyl(elbow_d-14, elbow_l+6);
}

// Forearm tube with collars, wrist stack, tool flange and rear stubs
module forearm() {
    translate(el_pos()) rotate([0, 180 + fore_pitch, 0]) union() {
        translate([fore_len/2,0,0]) rotate([0,90,0])
            cylinder(h=fore_len, d=fore_d, center=true);
        translate([10,0,0]) rotate([0,90,0])
            cylinder(h=10, d=collar_d, center=true);
        translate([fore_len-18,0,0]) rotate([0,90,0])
            cylinder(h=14, d=collar_d-4, center=true);
        translate([fore_len+8,0,0]) rotate([0,90,0])
            cylinder(h=16, d1=collar_d-6, d2=wrist_d, center=true);
        translate([fore_len+22,0,0]) rotate([0,90,0])
            cylinder(h=14, d=wrist_d-4, center=true);
        translate([fore_len+30,0,0]) rotate([0,90,0])
            cylinder(h=6, d=flange_d, center=true);
        translate([fore_len+38,0,0]) rotate([0,90,0])
            cylinder(h=10, d=tool_d, center=true);
        translate([fore_len+43,0,0]) rotate([0,90,0])
            cylinder(h=5, d=tool_d+5, center=true);
        translate([-8,0,0]) rotate([0,90,0])
            cylinder(h=16, d=32, center=true); // rear boss
        for (s = [-1,1]) translate([-20, s*11, 6]) rotate([0,90,0])
            cylinder(h=22, d=10, $fn=6, center=true); // rear prongs
    }
}

// ---- Assemble robot ----
union() {
    base_plate();
    shoulder_column();
    shoulder_joint();
    lower_arm();
    parallel_rod();
    elbow_joint();
    forearm();
}