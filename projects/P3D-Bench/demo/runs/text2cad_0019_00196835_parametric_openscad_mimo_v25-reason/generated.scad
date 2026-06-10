// ============================================
// Rail with End Block - Parametric CAD Model
// ============================================
// All dimensions in millimeters

// --- Main Rail Dimensions ---
rail_length    = 0.748506;   // Total rail length (x-axis)
rail_width     = 0.024642;   // Rail width (y-axis)
rail_height    = 0.018482;   // Lower body nominal height
rail_depth     = 0.0185;     // Lower body extrusion depth (z)

// --- Upper Layer (shared by rail and end block) ---
upper_thick    = 0.00462;    // Layer nominal thickness
upper_depth    = 0.0046;     // Layer extrusion depth (z)
upper_z_top    = 0.0231;     // Upper surface z from base datum

// --- Circular Recesses in Rail ---
recess_r       = 0.0043;     // Recess radius
recess_y_off   = 0.0108;     // Y-offset from rail front edge
recess1_x      = 0.0138;     // 1st recess center x from rail left
recess2_x      = 0.7346;     // 2nd recess center x from rail left
recess_z_bot   = 0.0062;     // Recess band bottom z
recess_z_top   = 0.0185;     // Recess band top z
recess_depth   = 0.0123;     // Recess cut depth (z_top - z_bot)

// --- End Block ---
end_size       = 0.030803;   // Equal-sided block dimension
end_x          = 0.7192;     // Left edge x from rail left end
end_y          = -0.0361;    // Front edge y (extends in front of rail)

// --- End Block Circular Recess ---
end_circ_x     = 0.7361;     // Center x from rail left end
end_circ_y     = -0.0192;    // Center y (in front of rail front edge)

// --- Rectangular Cutout in End Block ---
cutout_size    = 0.027722;   // Equal-sided cutout dimension
cutout_z_top   = 0.0185;     // Top at lower-body shoulder
cutout_z_bot   = -0.0585;    // Bottom below base datum
cutout_height  = 0.077;      // Total reach from shoulder to bottom

// --- Resolution ---
$fn = 100;

// ============================================
// Model Construction
// ============================================

difference() {
    // === Solid Bodies ===
    union() {
        // Rail lower body (base extrusion from datum)
        cube([rail_length, rail_width, rail_depth]);

        // Rail upper layer (raises surface to 0.0231)
        translate([0, 0, rail_depth])
            cube([rail_length, rail_width, upper_depth]);

        // End block lower body
        translate([end_x, end_y, 0])
            cube([end_size, end_size, rail_depth]);

        // End block upper layer
        translate([end_x, end_y, rail_depth])
            cube([end_size, end_size, upper_depth]);
    }

    // === Subtractive Features ===

    // Rail circular recess 1 (near left end)
    translate([recess1_x, recess_y_off, recess_z_bot])
        cylinder(h = recess_depth, r = recess_r);

    // Rail circular recess 2 (near right end)
    translate([recess2_x, recess_y_off, recess_z_bot])
        cylinder(h = recess_depth, r = recess_r);

    // End block circular recess
    translate([end_circ_x, end_circ_y, recess_z_bot])
        cylinder(h = recess_depth, r = recess_r);

    // Rectangular cutout in end block (deep pocket through lower body)
    translate([end_x, end_y, cutout_z_bot])
        cube([cutout_size, cutout_size, cutout_height]);
}