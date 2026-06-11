// ==========================================
// PARAMETRIC RAIL & EXTENSION ASSEMBLY
// ==========================================
$fn = 64;

// --- Global Parameters (mm) ---
rail_length   = 120;
rail_width    = 10;
rail_base_h   = 4;
rail_top_h    = 2;

ext_length    = 25;
ext_width     = 24;
ext_base_h    = 4;
ext_top_h     = 2;

// --- Feature Parameters ---
recess_dia    = 5;
recess_depth  = 1.5;
deep_cut_dia  = 8;
deep_cut_depth= 8;
feature_offset= 15;

// --- Reusable Modules ---
module stepped_rail(len, w, base_h, top_h) {
    // Lower base body
    translate([0, 0, base_h/2])
        cube([len, w, base_h], center=true);
    // Shallow full-length top layer
    translate([0, 0, base_h + top_h/2])
        cube([len, w, top_h], center=true);
}

module circular_pocket(d, depth, top_z) {
    translate([0, 0, top_z - depth/2])
        cylinder(h=depth, d=d, center=true);
}

module through_cutout(d, depth, top_z) {
    translate([0, 0, top_z - depth/2])
        cylinder(h=depth, d=d, center=true);
}

// --- Main Geometry Assembly ---
difference() {
    // Positive volume union
    union() {
        // Central slim rail
        stepped_rail(rail_length, rail_width, rail_base_h, rail_top_h);
        // Wider end extension
        translate([rail_length/2 + ext_length/2, 0, 0])
            stepped_rail(ext_length, ext_width, ext_base_h, ext_top_h);
    }

    // --- Subtractive Features ---
    // Rail end shallow recesses
    translate([-rail_length/2 + feature_offset, 0, 0])
        circular_pocket(recess_dia, recess_depth, rail_base_h + rail_top_h);
    translate([rail_length/2 - feature_offset, 0, 0])
        circular_pocket(recess_dia, recess_depth, rail_base_h + rail_top_h);

    // Extension detailing: shallow recess + deep stepped cutout
    translate([rail_length + ext_length/2, -ext_width/4, 0])
        circular_pocket(recess_dia, recess_depth, ext_base_h + ext_top_h);
    translate([rail_length + ext_length/2, ext_width/4, 0])
        through_cutout(deep_cut_dia, deep_cut_depth, ext_base_h + ext_top_h);
}