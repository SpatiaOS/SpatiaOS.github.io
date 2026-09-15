// ---------------------------------------------------------------
// Parametric rectangular solid with stepped pockets and side feature
// All dimensions in millimeters
// ---------------------------------------------------------------

// Main body dimensions
body_length   = 0.702127;   // X
body_width    = 0.524964;   // Y
body_height   = 0.210295;   // nominal
main_height   = 0.210300;   // formed main height (Z)

// Top shallow recess (uppermost step)
top_cut_len   = 0.667793;   // X size
top_cut_wid   = 0.490631;   // Y size
top_inset_l   = 0.0171;
top_inset_r   = 0.0172;
top_inset_f   = 0.0172;     // front
top_inset_b   = 0.0172;     // back
top_z_bottom  = 0.1888;
top_z_top     = 0.2103;
top_depth     = 0.0215;

// Middle continuation cut
mid_cut_len   = 0.650626;
mid_cut_wid   = 0.46488;
mid_inset_l   = 0.0257;
mid_inset_r   = 0.0258;
mid_inset_f   = 0.03;
mid_inset_b   = 0.0301;
mid_z_bottom  = 0.0729;
mid_z_top     = 0.1888;
mid_depth     = 0.1159;

// Lower offset pocket (non-through)
low_cut_len   = 0.567882;
low_cut_wid   = 0.447713;
low_inset_l   = 0.0999;
low_inset_r   = 0.0343;
low_inset_f   = 0.0386;
low_inset_b   = 0.0387;
low_z_bottom  = 0.0215;     // leaves bottom thickness 0.0215
low_z_top     = 0.073;
low_depth     = 0.0515;

// Solid side projection on left edge
proj_len      = 0.130618;   // X size
proj_wid      = 0.463588;   // Y size
proj_overhang = 0.0479;     // overhang beyond left edge
proj_to_right = 0.6194;     // from body right edge to projection right face
proj_inset_f  = 0.03;
proj_inset_b  = 0.0314;
proj_thickness = 0.0146;
proj_z_bottom = 0.073;
proj_z_top    = 0.0876;

// Side recess cut into left edge
srec_span_x   = 0.0343;     // depth into body from left edge
srec_face_l   = 0.367372;   // Y length of recessed face
srec_face_w   = 0.101285;   // informational face width
srec_to_right = 0.6678;     // remaining material to right edge
srec_inset_f  = 0.0546;
srec_inset_b  = 0.103;
srec_z_bottom = 0.0876;
srec_z_top    = 0.1889;
srec_depth    = 0.0343;

$fn = 64;

// ---------------------------------------------------------------
// Module: axis-aligned box defined by corner coordinates
// ---------------------------------------------------------------
module box(x1, y1, z1, x2, y2, z2) {
    translate([x1, y1, z1])
        cube([x2 - x1, y2 - y1, z2 - z1]);
}

// ---------------------------------------------------------------
// Module: full positive geometry (main body + side projection)
// ---------------------------------------------------------------
module base_solid() {
    union() {
        // Main reference rectangular solid
        box(0, 0, 0, body_length, body_width, main_height);

        // Solid side projection overhanging the left length edge,
        // lower band from z = 0.073 to 0.0876
        box(-proj_overhang,
            proj_inset_f,
            proj_z_bottom,
            body_length - proj_to_right,
            proj_inset_f + proj_wid,
            proj_z_top);
    }
}

// ---------------------------------------------------------------
// Module: subtractive features (three stacked pockets + side recess)
// ---------------------------------------------------------------
module cavity_set() {
    union() {
        // Top shallow recess, open to the top surface
        box(top_inset_l,
            top_inset_f,
            top_z_bottom,
            body_length - top_inset_r,
            body_width - top_inset_b,
            top_z_top);

        // Middle continuation cut
        box(mid_inset_l,
            mid_inset_f,
            mid_z_bottom,
            body_length - mid_inset_r,
            body_width - mid_inset_b,
            mid_z_top);

        // Lower, more offset pocket (non-through, bottom thickness kept)
        box(low_inset_l,
            low_inset_f,
            low_z_bottom,
            body_length - low_inset_r,
            body_width - low_inset_b,
            low_z_top);

        // Side recess at left edge, contained vertical band
        box(0,
            srec_inset_f,
            srec_z_bottom,
            srec_span_x,
            srec_inset_f + srec_face_l,
            srec_z_top);
    }
}

// ---------------------------------------------------------------
// Final model: solid minus cavities
// ---------------------------------------------------------------
difference() {
    base_solid();
    cavity_set();
}