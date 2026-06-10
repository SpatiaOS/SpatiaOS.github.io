// ============================================================
// Parameters
// ============================================================

// Base slab
base_length = 0.5;
base_width = 0.75;
base_height = 0.016667;
base_extrusion = 0.0167;

// Upper rectangular feature
feat_x = 0.5;
feat_y = 0.5;
feat_y_offset = 0.25;
feat_reach = 0.2334;

// Stepped portion: upper pad and deeper continuation
upper_pad_depth = 0.1;
deeper_cont_depth = 0.2167;
// Deeper continuation shares left/front/back edges; right edge inset
deeper_x_right = 0.4917;

// Edge strips
strip_w = 0.0083;
strip_l = 0.5;
strip_h = 0.0083;

// Transverse feature
trans_x = 0.5;
trans_y = 0.250819;
trans_y_offset = 0.24922;
trans_thickness = 0.0021;
trans_reach = 0.335265;

// Interior void (closed internal profile between strips and transverse)
void_x_min = strip_w;
void_x_max = base_length - strip_w;
void_y_min = trans_y_offset + trans_y;
void_y_max = base_width;

$fn = 100;

// ============================================================
// Modules
// ============================================================

// Base slab
module base_slab() {
    cube([base_length, base_width, base_height]);
}

// Stepped rectangular feature combining upper pad and deeper continuation
module stepped_feature() {
    shoulder_z = base_height;

    // Upper pad: wider, shallower step (depth 0.1 from shoulder)
    translate([0, feat_y_offset, shoulder_z])
        cube([feat_x, feat_y, upper_pad_depth]);

    // Deeper continuation: narrower, taller (depth 0.2167 from same shoulder)
    // Shares left, front, and back edges with upper pad; right edge at 0.4917
    translate([0, feat_y_offset, shoulder_z])
        cube([deeper_x_right, feat_y, deeper_cont_depth]);
}

// Two narrow edge strips along left and right edges of the rear region
module edge_strips() {
    strip_z = feat_reach; // Bottom of strips at top of feature

    // Left strip: flush with left edge, offset 0.4917 from right
    translate([0, feat_y_offset, strip_z])
        cube([strip_w, strip_l, strip_h]);

    // Right strip: flush with right edge, offset 0.4917 from left
    translate([base_length - strip_w, feat_y_offset, strip_z])
        cube([strip_w, strip_l, strip_h]);
}

// Thin transverse feature spanning full width
module transverse_feature() {
    trans_z_bottom = trans_reach - trans_thickness;
    translate([0, trans_y_offset, trans_z_bottom])
        cube([trans_x, trans_y, trans_thickness]);
}

// Open void through the added material preserving the closed internal profile
module interior_void() {
    // Void region bounded by strips (left/right), transverse (front), back edge
    // Extends from top of slab upward through all added material
    void_height = trans_reach; // Sufficient to clear all features
    translate([void_x_min, void_y_min, base_height])
        cube([void_x_max - void_x_min, void_y_max - void_y_min, void_height]);
}

// ============================================================
// Assembly: union of all solids minus interior void
// ============================================================

difference() {
    union() {
        base_slab();
        stepped_feature();
        edge_strips();
        transverse_feature();
    }
    interior_void();
}