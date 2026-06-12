// ============================================================
// Parametric stepped-hole base plate with paired ribs
// All dimensions in the original (unit-less) source units
// ============================================================

// ---- Base solid ----
base_len    = 0.28896;     // X
base_wid    = 0.75;        // Y
base_hgt    = 0.028846;    // Z (underside z=0, top z=base_hgt)

// ---- Rib pad (two ribs running full Y) ----
rib_band_x  = 0.162037;    // outside footprint in X
rib_edge_off= 0.0635;      // offset from left/right of base to rib band
rib_height  = 0.017308;    // rises above base top
rib_width   = 0.020;       // individual rib thickness in X (assumed)

// ---- Hole axis locations (left offset = X, front offset = Y) ----
hole1_r = 0.013;   hole1_x = 0.0352;  hole1_y = 0.7072;
hole2_r = 0.0173;  hole2_x = 0.1433;  hole2_y = 0.0577;
hole3_r = 0.013;   hole3_x = 0.2538;  hole3_y = 0.7072;

// ---- Stepped cut Z-extents (relative to base underside z=0) ----
upper_recess_z_lo = 0.0057;   // shallow recess bottom
upper_recess_z_hi = 0.0288;   // shallow recess top (= base top)
deep_cut_z_hi     = 0.0288;   // deep cut top
deep_cut_z_lo     = -0.1154;  // deep cut bottom (passes through underside)

$fn = 96;

// ------------------------------------------------------------
// Module: a pair of ribs along Y, occupying outer edges of band
// ------------------------------------------------------------
module rib_pair() {
    // Left rib
    translate([rib_edge_off, 0, base_hgt])
        cube([rib_width, base_wid, rib_height]);
    // Right rib
    translate([rib_edge_off + rib_band_x - rib_width, 0, base_hgt])
        cube([rib_width, base_wid, rib_height]);
}

// ------------------------------------------------------------
// Module: stepped circular cut (shallow recess + deep through cut)
// ------------------------------------------------------------
module stepped_hole(x, y, r) {
    // Shallow upper recess stage
    translate([x, y, upper_recess_z_lo])
        cylinder(h = upper_recess_z_hi - upper_recess_z_lo, r = r);
    // Deeper aligned cut stage (through and below)
    translate([x, y, deep_cut_z_lo])
        cylinder(h = deep_cut_z_hi - deep_cut_z_lo, r = r);
}

// ------------------------------------------------------------
// Main assembly
// ------------------------------------------------------------
difference() {
    union() {
        // Base solid
        cube([base_len, base_wid, base_hgt]);
        // Two lengthwise ribs on top face
        rib_pair();
    }
    // Three stepped circular removals
    stepped_hole(hole1_x, hole1_y, hole1_r);
    stepped_hole(hole2_x, hole2_y, hole2_r);
    stepped_hole(hole3_x, hole3_y, hole3_r);
}