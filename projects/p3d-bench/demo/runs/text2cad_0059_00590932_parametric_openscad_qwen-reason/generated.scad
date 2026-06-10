// Resolution for curved features
$fn = 100;

// ====================
// PARAMETRIC VARIABLES
// ====================

// Main Base Dimensions
base_len = 0.165891;
base_wid = 0.325401;
base_ht  = 0.408347;

// Top Square Recess
rec_len = 0.089326;
rec_wid = 0.089326;
rec_x   = 0.0383;   // Left edge offset
rec_y   = 0.0191;   // Front edge offset
rec_z   = 0.319;    // Start height of cut

// Lower Rectangular Opening
low_len = 0.076565;
low_wid = 0.132416;
low_x   = 0.0447;   // Left edge offset
low_y   = -0.0303;  // Front offset (breaks out front face)
low_ht  = 0.319;    // Height of opening

// Upper Back Strip Cutaway
back_wid = 0.114848;
back_y   = 0.2106;  // Front edge of cut (leaves 0.2106 in front)
back_z   = 0.2807;  // Start height of cut
back_ht  = 0.1276;  // Cut depth

// Shallow Base-Level Section
sh_ht  = 0.0383;
sh_len = 0.4339;
sh_wid = 0.1148;
sh_x   = -0.134;    // Projects 0.134 beyond left side

// Circular Through Openings
hole_r  = 0.0255;
hole_y  = 0.0574;   // Front offset line
hole1_x = -0.069;   // Left offset relative to base left edge
hole2_x = 0.2349;   // Left offset relative to base left edge

// ====================
// MAIN MODEL CONSTRUCTION
// ====================

difference() {
    // Combine main base and shallow added section
    union() {
        // Main rectangular solid base
        cube([base_len, base_wid, base_ht]);

        // Shallow solid base-level section
        translate([sh_x, 0, 0])
            cube([sh_len, sh_wid, sh_ht]);
    }

    // 1. Top square recess (cuts from 0.319 to top)
    translate([rec_x, rec_y, rec_z])
        cube([rec_len, rec_wid, base_ht - rec_z + 0.001]);

    // 2. Lower rectangular opening (cuts from z=0 to 0.319)
    translate([low_x, low_y, 0])
        cube([low_len, low_wid, low_ht + 0.001]);

    // 3. Upper back strip cutaway (creates high-to-low step)
    translate([0, back_y, back_z])
        cube([base_len, back_wid + 0.001, back_ht + 0.001]);

    // 4. Two circular through openings in shallow section
    translate([hole1_x, hole_y, -0.001])
        cylinder(h=sh_ht + 0.002, r=hole_r);
    translate([hole2_x, hole_y, -0.001])
        cylinder(h=sh_ht + 0.002, r=hole_r);
}