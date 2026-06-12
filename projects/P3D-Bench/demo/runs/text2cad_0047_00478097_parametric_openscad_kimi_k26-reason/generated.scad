// Parameters
$fn = 100;
eps = 0.0001;

// Main body
body_l = 0.702127;
body_w = 0.524964;
body_h = 0.2103;

// Top shallow recess
r1_x = 0.0171;
r1_y = 0.0172;
r1_w = 0.667793;
r1_d = 0.490631;
r1_z = 0.1888;
r1_h = body_h - r1_z; // 0.0215

// Continuation pocket downward
r2_x = 0.0257;
r2_y = 0.03;
r2_w = 0.650626;
r2_d = 0.46488;
r2_z = 0.0729;
r2_h = r1_z - r2_z; // 0.1159

// Lower contained pocket
r3_x = 0.0999;
r3_y = 0.0386;
r3_w = 0.567882;
r3_d = 0.447713;
r3_z = 0.0215;
r3_h = 0.073 - r3_z; // 0.0515

// Side projection
proj_over = 0.0479;
proj_w = 0.130618;
proj_d = 0.463588;
proj_y = 0.03;
proj_z = 0.073;
proj_h = 0.0146;

// Side recess at left edge
sr_depth = 0.0343;
sr_y = 0.0546;
sr_d = 0.3674;
sr_z = 0.0876;
sr_h = 0.1889 - sr_z; // 0.1013

// Base solid
module base_block() {
    cube([body_l, body_w, body_h]);
}

// Left side projection
module side_projection() {
    translate([-proj_over, proj_y, proj_z])
        cube([proj_w, proj_d, proj_h]);
}

// Top shallow recess cutter
module top_recess() {
    translate([r1_x, r1_y, r1_z])
        cube([r1_w, r1_d, r1_h + eps]);
}

// Continuation pocket cutter
module mid_pocket() {
    translate([r2_x, r2_y, r2_z])
        cube([r2_w, r2_d, r2_h]);
}

// Lower pocket cutter
module lower_pocket() {
    translate([r3_x, r3_y, r3_z])
        cube([r3_w, r3_d, r3_h]);
}

// Left side recess cutter
module side_recess() {
    translate([-eps, sr_y, sr_z])
        cube([sr_depth + eps, sr_d, sr_h]);
}

// Assembly
difference() {
    union() {
        base_block();
        side_projection();
    }
    top_recess();
    mid_pocket();
    lower_pocket();
    side_recess();
}