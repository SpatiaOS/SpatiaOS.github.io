// Parameters
$fn = 50;

// Main body dimensions
body_l = 0.702127;  // overall length (X)
body_w = 0.524964;  // overall width (Y)
body_h = 0.2103;    // overall height (Z)

// Top shallow recess (band 0.1888 - 0.2103)
r1_l = 0.667793;    // recess length
r1_w = 0.490631;    // recess width
r1_inset_l = 0.0171;   // inset from left edge
r1_inset_r = 0.0172;   // inset from right edge
r1_inset_f = 0.0172;   // inset from front edge
r1_inset_b = 0.0172;   // inset from back edge
r1_z_bot = 0.1888;  // bottom of recess
r1_z_top = 0.2103;   // top of recess
r1_depth = 0.0215;  // recess depth

// Middle contained cut (band 0.0729 - 0.1888)
r2_l = 0.650626;
r2_w = 0.46488;
r2_inset_l = 0.0257;
r2_inset_r = 0.0258;
r2_inset_f = 0.03;
r2_inset_b = 0.0301;
r2_z_bot = 0.0729;
r2_z_top = 0.1888;
r2_depth = 0.1159;

// Lower offset pocket (band 0.0215 - 0.073)
r3_l = 0.567882;
r3_w = 0.447713;
r3_inset_l = 0.0999;
r3_inset_r = 0.0343;
r3_inset_f = 0.0386;
r3_inset_b = 0.0387;
r3_z_bot = 0.0215;
r3_z_top = 0.073;
r3_depth = 0.0515;
r3_bottom_thk = 0.0215;  // remaining floor thickness

// Side projection (added solid, band 0.073 - 0.0876)
sp_l = 0.130618;
sp_w = 0.463588;
sp_overhang_l = 0.0479;   // overhang past left edge
sp_to_right = 0.6194;     // distance to right edge
sp_inset_f = 0.03;
sp_inset_b = 0.0314;
sp_z_bot = 0.073;
sp_z_top = 0.0876;
sp_thk = 0.0146;

// Side recess at left edge (band 0.0876 - 0.1889)
sr_depth_x = 0.0343;   // cut depth into body (X)
sr_len_y = 0.367372;   // length of recess face (Y)
sr_face_h = 0.101285;  // height of recess face (Z)
sr_inset_f = 0.0546;
sr_inset_b = 0.103;
sr_to_right = 0.6678;  // remaining body length to right edge
sr_z_bot = 0.0876;
sr_z_top = 0.1889;

// Helper: axis-aligned box from corner point + size
module box(x, y, z, l, w, h) {
    translate([x, y, z]) cube([l, w, h]);
}

// Main body with all cuts
module main_body() {
    difference() {
        // Base rectangular solid
        box(0, 0, 0, body_l, body_w, body_h);

        // Top shallow recess
        box(r1_inset_l, r1_inset_f, r1_z_bot,
            r1_l, r1_w, r1_z_top - r1_z_bot);

        // Middle contained cut (continuation downward)
        box(r2_inset_l, r2_inset_f, r2_z_bot,
            r2_l, r2_w, r2_z_top - r2_z_bot);

        // Lower offset pocket (leaves bottom thickness)
        box(r3_inset_l, r3_inset_f, r3_z_bot,
            r3_l, r3_w, r3_z_top - r3_z_bot);

        // Side recess at left edge (partial depth, non-through)
        box(0, sr_inset_f, sr_z_bot,
            sr_depth_x, sr_len_y, sr_z_top - sr_z_bot);
    }
}

// Side projection solid
module side_projection() {
    box(-sp_overhang_l, sp_inset_f, sp_z_bot,
        sp_l, sp_w, sp_z_top - sp_z_bot);
}

// Final model: body with cuts plus side projection
main_body();
side_projection();