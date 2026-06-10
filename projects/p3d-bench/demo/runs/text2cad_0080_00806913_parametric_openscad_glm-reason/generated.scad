// === Parameters ===
overall_length = 0.75;
overall_width = 0.220587;
overall_height = 0.147058;
body_height = 0.1471;       // main extrusion height from underside

// Lobe geometry
lobe_radius = 0.1103;       // end lobe radius
left_lobe_cx = 0.1103;      // left lobe center X (from left edge)
right_lobe_cx = 0.6397;     // right lobe center X (from left edge)
lobe_cy = 0.1103;           // both lobe centers Y (from front edge)

// Concentric hole features at each lobe
bore_radius = 0.0294;       // centered through-bore radius
recess_radius = 0.0956;     // larger annular recess radius
recess_depth = 0.0882;      // recess reaches from underside up to this height

// Middle rectangular slot on side web
slot_length = 0.191175;     // X-direction length of slot
slot_vert_height = 0.023529;// Z-direction opening height
slot_left_offset = 0.2794;  // offset from left edge
slot_right_offset = 0.2794; // offset from right edge
slot_z_bottom = 0.0618;     // lower Z bound of slot
slot_z_top = 0.0853;        // upper Z bound of slot
slot_reach = 0.7353;        // Y-direction cut depth (front-to-back, overcuts)

$fn = 100;

// Small epsilon for clean boolean cuts
eps = 0.001;

// === Base rounded link shape ===
// Two equal circular lobes joined by tangent side runs (hull of two circles)
module rounded_link() {
    hull() {
        translate([left_lobe_cx, lobe_cy, 0])
            cylinder(h=body_height, r=lobe_radius);
        translate([right_lobe_cx, lobe_cy, 0])
            cylinder(h=body_height, r=lobe_radius);
    }
}

// === Lobe features: bore + annular recess at one axis ===
module lobe_features(cx, cy) {
    // Through-bore at center of lobe
    translate([cx, cy, -eps])
        cylinder(h=body_height + 2*eps, r=bore_radius);

    // Annular circular recess from underside up to recess_depth
    // Creates stepped counterbore: larger hole at bottom, smaller through-bore above
    translate([cx, cy, -eps])
        cylinder(h=recess_depth + eps, r=recess_radius);
}

// === Assemble model with all cuts ===
difference() {
    // Main solid body
    rounded_link();

    // Left lobe bore and recess
    lobe_features(left_lobe_cx, lobe_cy);

    // Right lobe bore and recess
    lobe_features(right_lobe_cx, lobe_cy);

    // Middle rectangular slot cut from front side through the body
    // X: from left_offset to left_offset + slot_length
    // Y: from front edge (0) through full width and beyond (overcut)
    // Z: from slot_z_bottom to slot_z_top
    translate([slot_left_offset, -eps, slot_z_bottom])
        cube([slot_length, slot_reach, slot_vert_height]);
}