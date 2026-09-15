// Parameters
// Main reference body
body_length = 0.702127;
body_width  = 0.524964;
body_height = 0.2103;

// Top shallow recess
recess_top_length      = 0.667793;
recess_top_width       = 0.490631;
recess_top_inset_left  = 0.0171;
recess_top_inset_front = 0.0172;
recess_top_z           = 0.1888;
recess_top_depth       = 0.0215;

// Middle contained cut
cut_mid_length      = 0.650626;
cut_mid_width       = 0.46488;
cut_mid_inset_left  = 0.0257;
cut_mid_inset_front = 0.03;
cut_mid_z           = 0.0729;
cut_mid_depth       = 0.1159;

// Lower offset pocket
pocket_low_length      = 0.567882;
pocket_low_width       = 0.447713;
pocket_low_inset_left  = 0.0999;
pocket_low_inset_front = 0.0386;
pocket_low_z           = 0.0215;
pocket_low_depth       = 0.0515;

// Solid rectangular side projection
proj_length      = 0.130618;
proj_width       = 0.463588;
proj_thickness   = 0.0146;
proj_overhang    = 0.0479;
proj_inset_front = 0.03;
proj_z           = 0.073;

// Side recess cut
recess_side_depth       = 0.0343;
recess_side_length      = 0.367372;
recess_side_height      = 0.101285;
recess_side_inset_front = 0.0546;
recess_side_z           = 0.0876;

// Small overlap tolerance for manifold booleans
eps = 0.001;

// Modules
module main_body() {
    cube([body_length, body_width, body_height]);
}

module side_projection() {
    translate([-proj_overhang, proj_inset_front, proj_z])
        cube([proj_length, proj_width, proj_thickness]);
}

module top_shallow_recess() {
    translate([recess_top_inset_left, recess_top_inset_front, recess_top_z])
        cube([recess_top_length, recess_top_width, recess_top_depth + eps]);
}

module middle_cut() {
    translate([cut_mid_inset_left, cut_mid_inset_front, cut_mid_z])
        cube([cut_mid_length, cut_mid_width, cut_mid_depth + eps]);
}

module lower_pocket() {
    translate([pocket_low_inset_left, pocket_low_inset_front, pocket_low_z])
        cube([pocket_low_length, pocket_low_width, pocket_low_depth + eps]);
}

module side_recess() {
    translate([-eps, recess_side_inset_front, recess_side_z])
        cube([recess_side_depth + eps, recess_side_length, recess_side_height]);
}

// Main Model Assembly
difference() {
    // Additive geometry
    union() {
        main_body();
        side_projection();
    }
    // Subtractive features
    top_shallow_recess();
    middle_cut();
    lower_pocket();
    side_recess();
}