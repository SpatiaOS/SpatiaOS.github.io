$fn = 100;

// --- Parametric Variables ---
// Base solid dimensions
base_len = 0.28896;
base_wid = 0.75;
base_hgt = 0.028846;

// Rib layout parameters
rib_left_offset = 0.0635;
rib_outer_len = 0.162037;
rib_gap = 0.042037;
rib_width = (rib_outer_len - rib_gap) / 2;
rib_hgt = 0.017308;

// Circular feature stages
upper_recess_z = 0.0057;
upper_recess_h = 0.0231;
deeper_cut_z = -0.1154;
deeper_cut_h = 0.1442;

// Hole axes: [left_offset, front_offset, radius]
hole_axes = [
    [0.0352, 0.7072, 0.013],
    [0.1433, 0.0577, 0.0173],
    [0.2538, 0.7072, 0.013]
];

// --- Module Definitions ---
// Base rectangular solid
module base_solid() {
    cube([base_len, base_wid, base_hgt], center=false);
}

// Two separate lengthwise ribs on top of base
module rib_pair() {
    translate([rib_left_offset, 0, base_hgt])
        cube([rib_width, base_wid, rib_hgt], center=false);
    translate([rib_left_offset + rib_width + rib_gap, 0, base_hgt])
        cube([rib_width, base_wid, rib_hgt], center=false);
}

// Stepped circular cut for a single axis
module stepped_circular_cut(x, y, r) {
    union() {
        // Deeper stage extending below base underside
        translate([x, y, deeper_cut_z])
            cylinder(h=deeper_cut_h, r=r, center=false);
        // Upper recess stage stopping above base underside
        translate([x, y, upper_recess_z])
            cylinder(h=upper_recess_h, r=r, center=false);
    }
}

// --- Main Assembly ---
difference() {
    // Combine base and ribs
    union() {
        base_solid();
        rib_pair();
    }
    // Subtract stepped circular features
    for (h = hole_axes) {
        stepped_circular_cut(h[0], h[1], h[2]);
    }
}