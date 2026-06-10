$fn = 100;

// === Parametric Variables ===
// Base Slab
base_len = 0.5;
base_wid = 0.75;
base_ht = 0.016667;

// Upper Rectangular Pad
pad_len = 0.5;
pad_wid = 0.5;
pad_reach_z = 0.2334;
pad_y_offset = 0.25;

// Narrow Edge Strips
strip_len = 0.0083;
strip_wid = 0.5;
strip_ht = 0.0083;

// Transverse Feature
trans_len = 0.5;
trans_wid = 0.250819;
trans_ht = 0.0021;
trans_reach_z = 0.335265;
trans_y_offset = 0.24922;

// Stepped Portion
step_upper_ht = 0.1;
step_lower_ht = 0.2167;
step_shallow_len = 0.18;
step_deep_len = 0.14;
step_wid = 0.5;

// Internal Void
void_radius = 0.035;

// === Module Definitions ===

// Base reference slab
module base_slab() {
    cube([base_len, base_wid, base_ht]);
}

// Upper-side rectangular pad (sits on base)
module upper_pad() {
    h = pad_reach_z - base_ht;
    translate([0, pad_y_offset, base_ht]) {
        cube([pad_len, pad_wid, h]);
    }
}

// Narrow edge strips over rear region
module edge_strips() {
    translate([0, pad_y_offset, base_ht]) {
        cube([strip_len, strip_wid, strip_ht]);
    }
    translate([base_len - strip_len, pad_y_offset, base_ht]) {
        cube([strip_len, strip_wid, strip_ht]);
    }
}

// Thin transverse feature (positioned at specified reach)
module transverse_feature() {
    z_pos = trans_reach_z - trans_ht;
    translate([0, trans_y_offset, z_pos]) {
        cube([trans_len, trans_wid, trans_ht]);
    }
}

// Aligned stepped portion (shares shoulder, left, front, back edges)
module stepped_portion() {
    // Shared shoulder aligned with base top
    shoulder_z = base_ht;
    // Shallow upper pad
    translate([0, 0, shoulder_z - step_upper_ht]) {
        cube([step_shallow_len, step_wid, step_upper_ht]);
    }
    // Deeper continuation below, contained within shallow footprint
    translate([0, 0, shoulder_z - step_lower_ht]) {
        cube([step_deep_len, step_wid, step_lower_ht]);
    }
}

// Internal void cutting through the upper pad
module internal_void() {
    h_cut = pad_reach_z - base_ht + 0.02;
    translate([pad_len/2, pad_y_offset + pad_wid/2, base_ht - 0.01]) {
        cylinder(h=h_cut, r=void_radius, center=true);
    }
}

// === Main Assembly ===
difference() {
    union() {
        base_slab();
        upper_pad();
        edge_strips();
        transverse_feature();
        // Place stepped portion aligned to front-left region
        translate([0, 0, 0]) stepped_portion();
    }
    internal_void();
}