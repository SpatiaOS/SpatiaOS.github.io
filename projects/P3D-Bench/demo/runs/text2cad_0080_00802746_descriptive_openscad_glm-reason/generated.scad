// ============================================================
// Bearing Housing with Stepped Bore, Side Cylinder & Reliefs
// ============================================================

// --- Main (upper) cylinder ---
main_od       = 64;    // outer diameter
main_height   = 55;    // total height

// --- Side (lower) cylinder ---
side_od       = 44;    // outer diameter
side_length   = 50;    // length extending outward from main axis
side_center_z = 17;    // height of side cylinder centerline

// --- Stepped concentric bore (top → bottom) ---
bore_s1_d     = 36;   // first (widest) step diameter
bore_s1_depth = 14;   // depth of first step from top surface
bore_s2_d     = 30;   // second step diameter
bore_s2_depth = 28;   // depth of second step from top surface
bore_s3_d     = 24;   // through-bore diameter (narrowest)

// --- Side cylinder bore ---
side_bore_d   = 24;

// --- Small circular recesses (openings, not pads) ---
sm_hole_d     = 6;    // diameter of each small recess
sm_hole_depth = 8;    // depth of each small recess
sm_hole_pcd   = 48;   // pitch-circle diameter
sm_hole_n     = 4;    // number of small recesses around top

// --- Bottom annular reliefs ---
ann1_od    = 52;  // first annular relief outer diameter
ann1_id    = 28;  // first annular relief inner diameter
ann1_depth = 2.5; // first annular relief depth

ann2_od    = 36;  // second annular relief outer diameter
ann2_id    = 20;  // second annular relief inner diameter
ann2_depth = 2.0; // second annular relief depth

// --- Bottom deep circular cuts ---
deep_cut_d     = 16;  // diameter of each deep circular cut
deep_cut_depth = 12;  // depth of each deep circular cut
deep_cut_pcd   = 38;  // pitch-circle diameter for deep cuts
deep_cut_n     = 3;   // number of deep circular cuts

$fn = 120;

// ============================================================
// Helper: annular ring volume (used as subtractive tool)
// ============================================================
module annular_ring(od, id, depth) {
    difference() {
        cylinder(d = od, h = depth);
        translate([0, 0, -0.01])
            cylinder(d = id, h = depth + 0.02);
    }
}

// ============================================================
// Helper: small recess at a given angle on the top rim
// ============================================================
module small_recess(angle) {
    x = sm_hole_pcd / 2 * cos(angle);
    y = sm_hole_pcd / 2 * sin(angle);
    translate([x, y, main_height - sm_hole_depth])
        cylinder(d = sm_hole_d, h = sm_hole_depth + 0.1);
}

// ============================================================
// Helper: deep circular cut on the bottom face
// ============================================================
module deep_cut(angle) {
    x = deep_cut_pcd / 2 * cos(angle);
    y = deep_cut_pcd / 2 * sin(angle);
    translate([x, y, -0.01])
        cylinder(d = deep_cut_d, h = deep_cut_depth);
}

// ============================================================
// Main model
// ============================================================
difference() {

    // ---- Solid body: union of two overlapping cylinders ----
    union() {
        // Upper sleeve-like cylinder (vertical)
        cylinder(d = main_od, h = main_height);

        // Lower side cylinder (horizontal, intersecting main body)
        translate([0, -side_length / 2, side_center_z])
            rotate([-90, 0, 0])
                cylinder(d = side_od, h = side_length);
    }

    // ---- Stepped concentric bore (top entry) ----
    // Step 1 – widest, shallowest pocket
    translate([0, 0, main_height - bore_s1_depth])
        cylinder(d = bore_s1_d, h = bore_s1_depth + 0.1);

    // Step 2 – intermediate pocket
    translate([0, 0, main_height - bore_s2_depth])
        cylinder(d = bore_s2_d, h = bore_s2_depth - bore_s1_depth + 0.1);

    // Step 3 – through-bore (narrowest, runs full height)
    translate([0, 0, -0.01])
        cylinder(d = bore_s3_d, h = main_height + 0.02);

    // ---- Side cylinder bore ----
    translate([0, -side_length / 2 - 0.1, side_center_z])
        rotate([-90, 0, 0])
            cylinder(d = side_bore_d, h = side_length + 0.2);

    // ---- Small circular recesses around top face ----
    for (i = [0 : sm_hole_n - 1]) {
        small_recess(i * 360 / sm_hole_n);
    }

    // ---- Bottom annular relief 1 (wider, shallower) ----
    translate([0, 0, -0.01])
        annular_ring(ann1_od, ann1_id, ann1_depth);

    // ---- Bottom annular relief 2 (narrower, at next depth level) ----
    translate([0, 0, ann1_depth - 0.01])
        annular_ring(ann2_od, ann2_id, ann2_depth);

    // ---- Deep circular cuts on bottom face ----
    for (i = [0 : deep_cut_n - 1]) {
        deep_cut(i * 360 / deep_cut_n + 60);
    }
}