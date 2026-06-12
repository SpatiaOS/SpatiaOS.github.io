// Parameters
$fn = 100;

// Base dimensions
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;

// Rib dimensions
rib_footprint_width = 0.162037;
rib_length = 0.75;
rib_height = 0.017308;
rib_offset_left = 0.0635;
rib_thickness = 0.015; // Assumed width for individual ribs to form the footprint

// Hole 1 parameters
h1_r = 0.013;
h1_x = 0.0352;
h1_y = 0.7072;

// Hole 2 parameters
h2_r = 0.0173;
h2_x = 0.1433;
h2_y = 0.0577;

// Hole 3 parameters
h3_r = 0.013;
h3_x = 0.2538;
h3_y = 0.7072;

// Stepped feature Z-levels
recess_z_bottom = 0.0057;
recess_z_top = 0.0288;
recess_depth = 0.0231;
recess_radius_offset = 0.005; // Extra radius to create the step for the upper recess

deep_cut_z_bottom = -0.1154;
deep_cut_z_top = 0.0288;
deep_cut_depth = 0.1442;

// Helper module for the stepped circular removed features
module stepped_hole(x, y, r) {
    translate([x, y, 0]) {
        // Deeper aligned circular cut (passes beyond base underside)
        translate([0, 0, deep_cut_z_bottom])
            cylinder(h=deep_cut_depth + 0.001, r=r);
            
        // Upper circular recess stage (stops above base underside)
        translate([0, 0, recess_z_bottom])
            cylinder(h=recess_depth + 0.05, r=r + recess_radius_offset);
    }
}

// Main model construction
difference() {
    union() {
        // Rectangular base solid
        cube([base_length, base_width, base_height]);

        // Upper face lengthwise ribs
        // Left rib
        translate([rib_offset_left, 0, base_height])
            cube([rib_thickness, rib_length, rib_height]);
            
        // Right rib (placed at the opposite end of the specified footprint)
        translate([rib_offset_left + rib_footprint_width - rib_thickness, 0, base_height])
            cube([rib_thickness, rib_length, rib_height]);
    }

    // Three separate stepped circular removed features
    stepped_hole(h1_x, h1_y, h1_r);
    stepped_hole(h2_x, h2_y, h2_r);
    stepped_hole(h3_x, h3_y, h3_r);
}