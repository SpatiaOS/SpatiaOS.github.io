// Parametric design for complex rectangular part with pockets, projection, and recess

// Main body dimensions
body_length   = 0.702127;
body_width    = 0.524964;
body_height   = 0.2103;   // top surface height

// Top shallow recess
top_recess_length    = 0.667793;
top_recess_width     = 0.490631;
top_recess_left_inset  = 0.0171;
top_recess_right_inset = 0.0172; // not directly used, but for reference
top_recess_front_inset = 0.0172;
top_recess_back_inset  = 0.0172; // reference
top_recess_z_bottom = 0.1888;
top_recess_z_top    = 0.2103;

// Middle pocket (continuation downward)
mid_pocket_length   = 0.650626;
mid_pocket_width    = 0.46488;
mid_pocket_left_inset  = 0.0257;
mid_pocket_right_inset = 0.0258; // reference
mid_pocket_front_inset = 0.03;
mid_pocket_back_inset  = 0.0301; // reference
mid_pocket_z_bottom = 0.0729;
mid_pocket_z_top    = 0.1888;

// Lower offset pocket
low_pocket_length   = 0.567882;
low_pocket_width    = 0.447713;
low_pocket_left_inset  = 0.0999;
low_pocket_right_inset = 0.0343; // reference
low_pocket_front_inset = 0.0386;
low_pocket_back_inset  = 0.0387; // reference
low_pocket_z_bottom = 0.0215;
low_pocket_z_top    = 0.073;

// Side projection (overhangs left edge)
proj_length   = 0.130618;   // x‑span
proj_width    = 0.463588;   // y‑span (computed from insets)
proj_overhang = 0.0479;     // how far it extends left of the body
proj_front_inset = 0.03;
proj_back_inset  = 0.0314;
proj_z_bottom = 0.073;
proj_z_top    = 0.0876;

// Side recess (cut on left face)
side_recess_depth   = 0.0343;
side_recess_front_inset = 0.0546;
side_recess_back_inset  = 0.103;
side_recess_z_bottom = 0.0876;
side_recess_z_top    = 0.1889;

// Resolution for curved surfaces (not needed here, but included)
$fn = 50;

// Modules for each feature

module main_body() {
    cube([body_length, body_width, body_height]);
}

module top_recess() {
    translate([top_recess_left_inset, top_recess_front_inset, top_recess_z_bottom])
        cube([top_recess_length, top_recess_width, top_recess_z_top - top_recess_z_bottom]);
}

module mid_pocket() {
    translate([mid_pocket_left_inset, mid_pocket_front_inset, mid_pocket_z_bottom])
        cube([mid_pocket_length, mid_pocket_width, mid_pocket_z_top - mid_pocket_z_bottom]);
}

module low_pocket() {
    translate([low_pocket_left_inset, low_pocket_front_inset, low_pocket_z_bottom])
        cube([low_pocket_length, low_pocket_width, low_pocket_z_top - low_pocket_z_bottom]);
}

module side_projection() {
    // Overhangs left edge: starts at -proj_overhang, spans proj_length
    translate([-proj_overhang, proj_front_inset, proj_z_bottom])
        cube([proj_length, body_width - proj_front_inset - proj_back_inset, proj_z_top - proj_z_bottom]);
}

module side_recess() {
    // Cut into left side from x=0 to side_recess_depth
    translate([0, side_recess_front_inset, side_recess_z_bottom])
        cube([side_recess_depth, body_width - side_recess_front_inset - side_recess_back_inset, side_recess_z_top - side_recess_z_bottom]);
}

// Final model: main body with projection, then subtract all pockets and side recess
difference() {
    union() {
        main_body();
        side_projection();
    }
    top_recess();
    mid_pocket();
    low_pocket();
    side_recess();
}