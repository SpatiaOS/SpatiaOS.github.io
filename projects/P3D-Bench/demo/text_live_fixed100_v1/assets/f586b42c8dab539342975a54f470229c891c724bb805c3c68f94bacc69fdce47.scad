// Parameters
body_l = 0.702127;
body_w = 0.524964;
body_h = 0.2103;

top_l = 0.667793;
top_w = 0.490631;
top_inset_l = 0.0171;
top_inset_f = 0.0172;
top_z0 = 0.1888;
top_z1 = 0.2103;

mid_l = 0.650626;
mid_w = 0.46488;
mid_inset_l = 0.0257;
mid_inset_f = 0.03;
mid_z0 = 0.0729;
mid_z1 = 0.1888;

low_l = 0.567882;
low_w = 0.447713;
low_inset_l = 0.0999;
low_inset_f = 0.0386;
low_z0 = 0.0215;
low_z1 = 0.073;

proj_l = 0.130618;
proj_w = 0.463588;
proj_overhang = 0.0479;
proj_inset_f = 0.03;
proj_z0 = 0.073;
proj_z1 = 0.0876;

side_l = 0.0343;
side_w = 0.367372;
side_inset_f = 0.0546;
side_z0 = 0.0876;
side_z1 = 0.1889;

eps = 0.001;

module main_body() {
    cube([body_l, body_w, body_h]);
}

module side_projection() {
    translate([-proj_overhang, proj_inset_f, proj_z0])
        cube([proj_l, proj_w, proj_z1 - proj_z0]);
}

module top_recess() {
    translate([top_inset_l, top_inset_f, top_z0])
        cube([top_l, top_w, (top_z1 - top_z0) + eps]);
}

module mid_cut() {
    translate([mid_inset_l, mid_inset_f, mid_z0])
        cube([mid_l, mid_w, mid_z1 - mid_z0]);
}

module low_pocket() {
    translate([low_inset_l, low_inset_f, low_z0])
        cube([low_l, low_w, low_z1 - low_z0]);
}

module side_recess() {
    translate([-eps, side_inset_f, side_z0])
        cube([side_l + eps, side_w, side_z1 - side_z0]);
}

difference() {
    union() {
        main_body();
        side_projection();
    }
    top_recess();
    mid_cut();
    low_pocket();
    side_recess();
}