// Main body dimensions
body_length = 0.702127;
body_width = 0.524964;
body_height = 0.2103;

// Shallow top recess
recess1_length = 0.667793;
recess1_width = 0.490631;
recess1_x = 0.0171;       // inset from left edge
recess1_y = 0.0172;        // inset from front edge
recess1_z_bot = 0.1888;    // bottom of recess above underside
recess1_z_top = 0.2103;    // top of recess (body top)

// Deeper contained rectangular cut
recess2_length = 0.650626;
recess2_width = 0.46488;
recess2_x = 0.0257;        // inset from left edge
recess2_y = 0.03;           // inset from front edge
recess2_z_bot = 0.0729;    // bottom of cut above underside
recess2_z_top = 0.1888;    // top of cut

// Lower pocket
recess3_length = 0.567882;
recess3_width = 0.447713;
recess3_x = 0.0999;        // inset from left edge
recess3_y = 0.0386;         // inset from front edge
recess3_z_bot = 0.0215;    // bottom of pocket above underside
recess3_z_top = 0.073;     // top of pocket

// Side projection (added solid)
proj_length = 0.130618;
proj_width = 0.463588;
proj_x = -0.0479;          // overhangs left edge
proj_y = 0.03;              // inset from front edge
proj_z_bot = 0.073;         // bottom of projection above underside
proj_z_top = 0.0876;        // top of projection

// Side recess (rectangular cut at left edge)
side_recess_depth = 0.0343; // depth into body from left (X)
side_recess_length = 0.3674; // extent along Y
side_recess_x = 0;           // starts at left edge
side_recess_y = 0.0546;      // inset from front edge
side_recess_z_bot = 0.0876;  // bottom of recess above underside
side_recess_z_top = 0.1889;  // top of recess

$fn = 32;

difference() {
    // Solid body union
    union() {
        // Main rectangular body
        cube([body_length, body_width, body_height]);

        // Side projection on left edge
        translate([proj_x, proj_y, proj_z_bot])
            cube([proj_length, proj_width, proj_z_top - proj_z_bot]);
    }

    // Shallow top recess
    translate([recess1_x, recess1_y, recess1_z_bot])
        cube([recess1_length, recess1_width, recess1_z_top - recess1_z_bot]);

    // Deeper contained rectangular cut
    translate([recess2_x, recess2_y, recess2_z_bot])
        cube([recess2_length, recess2_width, recess2_z_top - recess2_z_bot]);

    // Lower pocket
    translate([recess3_x, recess3_y, recess3_z_bot])
        cube([recess3_length, recess3_width, recess3_z_top - recess3_z_bot]);

    // Side recess at left edge
    translate([side_recess_x, side_recess_y, side_recess_z_bot])
        cube([side_recess_depth, side_recess_length, side_recess_z_top - side_recess_z_bot]);
}