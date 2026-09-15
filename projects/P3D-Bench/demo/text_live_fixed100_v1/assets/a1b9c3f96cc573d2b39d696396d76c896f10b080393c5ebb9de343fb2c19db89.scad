// OpenSCAD parametric model
// Units: millimeters
// Coordinate system:
// X = length, left edge to right edge
// Y = width, front edge to back edge
// Z = height, underside to top

$fn = 64;
eps = 0.000001;

// Main reference body
body_l = 0.702127;
body_w = 0.524964;
body_h = 0.2103;

// Top shallow rectangular recess
top_recess_l = 0.667793;
top_recess_w = 0.490631;
top_recess_left_inset = 0.0171;
top_recess_right_inset = 0.0172;
top_recess_front_inset = 0.0172;
top_recess_back_inset = 0.0172;
top_recess_z_start = 0.1888;
top_recess_depth = 0.0215;

// Middle contained rectangular cut
middle_cut_l = 0.650626;
middle_cut_w = 0.46488;
middle_cut_left_inset = 0.0257;
middle_cut_right_inset = 0.0258;
middle_cut_front_inset = 0.03;
middle_cut_back_inset = 0.0301;
middle_cut_z_start = 0.0729;
middle_cut_depth = 0.1159;

// Lower offset rectangular pocket
lower_pocket_l = 0.567882;
lower_pocket_w = 0.447713;
lower_pocket_left_inset = 0.0999;
lower_pocket_right_inset = 0.0343;
lower_pocket_front_inset = 0.0386;
lower_pocket_back_inset = 0.0387;
lower_pocket_z_start = 0.0215;
lower_pocket_depth = 0.0515;

// Left side solid projection
side_projection_l = 0.130618;
side_projection_w = 0.463588;
side_projection_left_overhang = 0.0479;
side_projection_right_remain = 0.6194;
side_projection_front_inset = 0.03;
side_projection_back_inset = 0.0314;
side_projection_z_start = 0.073;
side_projection_thickness = 0.0146;

// Left side recess
side_recess_depth = 0.0343;
side_recess_face_length = 0.367372;
side_recess_front_inset = 0.0546;
side_recess_back_inset = 0.103;
side_recess_z_start = 0.0876;
side_recess_face_height = 0.101285;

// Helper module for rectangular cuts
module rectangular_cut(x, y, z, l, w, h) {
    translate([x, y, z]) {
        cube([l, w, h]);
    }
}

difference(convexity = 10) {
    union() {
        // Main rectangular solid
        cube([body_l, body_w, body_h]);

        // Added left side projection, lower band
        translate([
            -side_projection_left_overhang,
            side_projection_front_inset,
            side_projection_z_start
        ]) {
            cube([
                side_projection_l,
                side_projection_w,
                side_projection_thickness + eps
            ]);
        }
    }

    union() {
        // Top shallow recess, vertical band 0.1888 to 0.2103
        rectangular_cut(
            top_recess_left_inset,
            top_recess_front_inset,
            top_recess_z_start,
            top_recess_l,
            top_recess_w,
            top_recess_depth + eps
        );

        // Middle contained cut, vertical band 0.0729 to 0.1888
        rectangular_cut(
            middle_cut_left_inset,
            middle_cut_front_inset,
            middle_cut_z_start,
            middle_cut_l,
            middle_cut_w,
            middle_cut_depth + eps
        );

        // Lower offset pocket, vertical band 0.0215 to 0.073
        rectangular_cut(
            lower_pocket_left_inset,
            lower_pocket_front_inset,
            lower_pocket_z_start,
            lower_pocket_l,
            lower_pocket_w,
            lower_pocket_depth + eps
        );

        // Left side recess, vertical band above projection
        rectangular_cut(
            -eps,
            side_recess_front_inset,
            side_recess_z_start - eps,
            side_recess_depth + 2 * eps,
            side_recess_face_length,
            side_recess_face_height + 2 * eps
        );
    }
}