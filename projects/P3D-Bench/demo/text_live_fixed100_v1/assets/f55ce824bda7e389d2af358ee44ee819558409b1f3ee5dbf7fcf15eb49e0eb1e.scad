// ============================================================
// Stepped-pocket body with side projection and side recess
// All dimensions in model units
// ============================================================

// ---------- Main body ----------
body_L = 0.702127;        // length (X)
body_W = 0.524964;        // width  (Y)
body_H = 0.210295;        // height (Z, nominal 0.2103)

// ---------- Top shallow recess ----------
top_rec_L     = 0.667793; // recess size X
top_rec_W     = 0.490631; // recess size Y
top_rec_left  = 0.0171;   // inset from left edge
top_rec_front = 0.0172;   // inset from front edge
top_rec_z     = 0.1888;   // recess floor height
top_rec_D     = 0.0215;   // recess depth (opens at top)

// ---------- Middle continuation cut ----------
mid_cut_L     = 0.650626;
mid_cut_W     = 0.46488;
mid_cut_left  = 0.0257;   // inset from left edge
mid_cut_front = 0.03;     // inset from front edge
mid_cut_z     = 0.0729;   // cut floor height
mid_cut_D     = 0.1159;   // cut depth (meets top recess floor)

// ---------- Lower contained pocket ----------
low_poc_L     = 0.567882;
low_poc_W     = 0.447713;
low_poc_left  = 0.0999;   // inset from left edge
low_poc_front = 0.0386;   // inset from front edge
low_poc_z     = 0.0215;   // pocket floor (= bottom thickness)
low_poc_D     = 0.0515;   // pocket depth

// ---------- Side projection (added solid, left edge) ----------
proj_L        = 0.130618; // size X
proj_W        = 0.463588; // size Y
proj_over     = 0.0479;   // overhang beyond left edge
proj_front    = 0.03;     // inset from front edge
proj_z        = 0.073;    // bottom of projection
proj_T        = 0.0146;   // thickness (spans 0.073 - 0.0876)

// ---------- Side recess (cut at left edge) ----------
side_rec_D     = 0.0343;  // cut depth into body (X)
side_rec_W     = 0.367372;// face length along Y
side_rec_front = 0.0546;  // inset from front edge
side_rec_z     = 0.0876;  // recess bottom (band 0.0876 - 0.1889)
side_rec_H     = 0.101285;// recess face height

eps = 0.0005;             // overlap margin for clean booleans
$fn = 64;

// ---------- Component modules ----------
module main_body() {
    cube([body_L, body_W, body_H]);
}

module side_projection() {
    // ledge attached at the left edge, overhanging outward
    translate([-proj_over, proj_front, proj_z])
        cube([proj_L, proj_W, proj_T]);
}

module top_recess() {
    translate([top_rec_left, top_rec_front, top_rec_z])
        cube([top_rec_L, top_rec_W, top_rec_D + eps]);
}

module middle_cut() {
    translate([mid_cut_left, mid_cut_front, mid_cut_z])
        cube([mid_cut_L, mid_cut_W, mid_cut_D + eps]);
}

module lower_pocket() {
    translate([low_poc_left, low_poc_front, low_poc_z])
        cube([low_poc_L, low_poc_W, low_poc_D + eps]);
}

module side_recess() {
    // contained side window, does not pass through the body
    translate([-eps, side_rec_front, side_rec_z])
        cube([side_rec_D + eps, side_rec_W, side_rec_H]);
}

// ---------- Final assembly ----------
union() {
    difference() {
        main_body();
        top_recess();       // shallow top recess
        middle_cut();       // deeper continuation cut
        lower_pocket();     // lowest contained pocket
        side_recess();      // left-edge side recess
    }
    side_projection();      // added ledge solid on left side
}