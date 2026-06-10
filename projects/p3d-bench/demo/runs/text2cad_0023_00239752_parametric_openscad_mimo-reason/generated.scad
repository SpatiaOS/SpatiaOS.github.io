// Parametric model of base with ribs and stepped circular recesses

// === Parameters ===
// Base dimensions
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;
extrusion_depth = 0.0288;

// Rib parameters
rib_footprint_length = 0.162037;
rib_footprint_width = 0.75;
rib_edge_offset = 0.0635;
rib_height = 0.017308;
rib_extrusion = 0.0173;
rib_thickness = 0.01; // Assumed thickness for two separate ribs

// Circular recess parameters
// Format: [left_offset, front_offset, radius]
circles = [
    [0.0352, 0.7072, 0.013],
    [0.1433, 0.0577, 0.0173],
    [0.2538, 0.7072, 0.013]
];

// Recess stage parameters
upper_recess_start = 0.0057;
upper_recess_end = 0.0288;
upper_recess_depth = 0.0231;

// Deeper cut parameters
deep_cut_top = 0.0288;
deep_cut_bottom = -0.1154;
deep_cut_depth = 0.1442;

$fn = 100; // Smooth circular features

// === Modules ===
// Base rectangular solid
module base() {
    cube([base_length, base_width, base_height]);
}

// Single rib (lengthwise, full width)
module rib() {
    cube([rib_thickness, rib_footprint_width, rib_height]);
}

// Upper circular recess (shallow)
module upper_recess(radius) {
    cylinder(h = upper_recess_depth, r = radius);
}

// Deeper circular cut (passes through base)
module deep_cut(radius) {
    cylinder(h = deep_cut_depth, r = radius);
}

// === Main Model ===
union() {
    // Create base
    base();
    
    // Add two separate ribs centered on base
    translate([(base_length - rib_footprint_length)/2 + rib_edge_offset, 0, base_height]) {
        // Left rib
        rib();
        // Right rib (separated by gap)
        translate([rib_footprint_length - rib_thickness, 0, 0]) {
            rib();
        }
    }
}

// Apply circular removed features
difference() {
    // Base with ribs (from above union)
    children(0);
    
    // Create three stepped circular recesses
    for (circle = circles) {
        left_off = circle[0];
        front_off = circle[1];
        radius = circle[2];
        
        // Position relative to base origin
        translate([left_off, front_off, 0]) {
            // Upper recess (stops above base bottom)
            translate([0, 0, upper_recess_start]) {
                upper_recess(radius);
            }
            
            // Deeper cut (extends beyond base bottom)
            translate([0, 0, deep_cut_bottom]) {
                deep_cut(radius);
            }
        }
    }
}