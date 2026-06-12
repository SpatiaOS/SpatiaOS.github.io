// === Parameters ===

// Main body dimensions
body_length = 0.702127;   // x-axis
body_width  = 0.524964;   // y-axis
body_height = 0.210295;   // z-axis

// Top shallow recess (step 1 pocket from top)
r1_length      = 0.667793;
r1_width       = 0.490631;
r1_inset_left  = 0.0171;
r1_inset_front = 0.0172;
r1_z_bottom    = 0.1888;
r1_depth       = 0.0215;

// Middle contained cut (step 2 pocket)
r2_length      = 0.650626;
r2_width       = 0.46488;
r2_inset_left  = 0.0257;
r2_inset_front = 0.03;
r2_z_bottom    = 0.0729;
r2_depth       = 0.1159;

// Lower offset pocket (step 3, non-through)
r3_length      = 0.567882;
r3_width       = 0.447713;
r3_inset_left  = 0.0999;
r3_inset_front = 0.0386;
r3_z_bottom    = 0.0215;
r3_depth       = 0.0515;

// Side projection (solid addition on left edge)
proj_length     = 0.130618;
proj_width      = 0.463588;
proj_overhang   = 0.0479;   // extends past left edge
proj_inset_front = 0.03;
proj_z_bottom   = 0.073;
proj_thickness  = 0.0146;

// Side recess (cut into left face)
sr_cut_depth    = 0.0343;
sr_length       = 0.367372;
sr_inset_front  = 0.0546;
sr_z_bottom     = 0.0876;
sr_height       = 0.101285;

// Small epsilon for clean boolean cuts
eps = 0.001;

// === Assembly ===
union() {
    difference() {
        // Step 1: Main rectangular body
        cube([body_length, body_width, body_height]);

        // Step 2: Top shallow recess (inset from all four edges)
        translate([r1_inset_left, r1_inset_front, r1_z_bottom])
            cube([r1_length, r1_width, r1_depth + eps]);

        // Step 3: Middle contained rectangular cut (deeper, narrower)
        translate([r2_inset_left, r2_inset_front, r2_z_bottom])
            cube([r2_length, r2_width, r2_depth + eps]);

        // Step 4: Lower offset pocket (non-through, leaves 0.0215 bottom)
        translate([r3_inset_left, r3_inset_front, r3_z_bottom])
            cube([r3_length, r3_width, r3_depth + eps]);

        // Step 6: Side recess cut at the left edge
        translate([-eps, sr_inset_front, sr_z_bottom])
            cube([sr_cut_depth + eps, sr_length, sr_height]);
    }

    // Step 5: Solid rectangular side projection overhanging left edge
    translate([-proj_overhang, proj_inset_front, proj_z_bottom])
        cube([proj_length, proj_width, proj_thickness]);
}