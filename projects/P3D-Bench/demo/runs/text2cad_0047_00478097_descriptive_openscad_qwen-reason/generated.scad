// ==========================================
// Parametric Stepped Cavity Block with Side Features
// ==========================================

// Global resolution for smooth rendering
$fn = 100;

// --- Main Block Dimensions ---
main_width  = 80;
main_depth  = 60;
main_height = 40;

// --- Top Stepped Cavity Parameters ---
// Step 1: Broad upper recess (leaves thin outer rim)
step1_w     = 70;
step1_d     = 50;
step1_depth = 10;

// Step 2: Middle inset recess
step2_w     = 50;
step2_d     = 35;
step2_depth = 20;

// Step 3: Deepest shifted pocket
step3_w     = 30;
step3_d     = 20;
step3_depth = 30;
step3_off_x = 8;   // X-shift creates uneven interior ledges
step3_off_y = -5;  // Y-shift

// --- Side Projection Parameters ---
proj_width  = 12;
proj_depth  = 40;
proj_height = 18;

// --- Side Recess Parameters (above projection) ---
rec_depth   = 10;
rec_width   = 40;
rec_height  = 12;

// ==========================================
// Module Definitions
// ==========================================

// Base solid: combines main block and side projection
module base_geometry() {
    union() {
        // Main rectangular solid
        cube([main_width, main_depth, main_height], center=true);

        // Side projection attached to the +X face
        translate([main_width/2 + proj_width/2, 0, -main_height/2 + proj_height/2])
            cube([proj_width, proj_depth, proj_height], center=true);
    }
}

// Top nested stepped cavities (subtractive volumes)
module top_cavities() {
    // Upper recess cut
    translate([0, 0, main_height/2 - step1_depth/2])
        cube([step1_w, step1_d, step1_depth], center=true);

    // Middle inset cut
    translate([0, 0, main_height/2 - step2_depth/2])
        cube([step2_w, step2_d, step2_depth], center=true);

    // Deepest shifted pocket cut
    translate([step3_off_x, step3_off_y, main_height/2 - step3_depth/2])
        cube([step3_w, step3_d, step3_depth], center=true);
}

// Side recess cut positioned directly above the projection
module side_recess_cut() {
    translate([main_width/2 - rec_depth/2, 0, -main_height/2 + proj_height + rec_height/2])
        cube([rec_depth, rec_width, rec_height], center=true);
}

// ==========================================
// Final Assembly
// ==========================================

// Start with base geometry, subtract top cavities and side recess
difference() {
    base_geometry();
    top_cavities();
    side_recess_cut();
}