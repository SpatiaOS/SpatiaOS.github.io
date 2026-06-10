// Parametric Dimensions
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;
rib_footprint = 0.162037;
rib_edge_offset = 0.0635;
rib_height = 0.017308;
rib_depth = 0.0173;
upper_recess_start = 0.0057;
upper_recess_end = 0.0288;
upper_recess_depth = 0.0231;
deeper_cut_start = 0.0288;
deeper_cut_end = -0.1154;
deeper_cut_depth = 0.1442;

// Hole positions: [left_offset, front_offset, radius]
hole_positions = [
    [0.0352, 0.7072, 0.013],
    [0.1433, 0.0577, 0.0173],
    [0.2538, 0.7072, 0.013]
];

$fn = 100; // Smooth curves

// Base solid
module base_solid() {
    cube([base_length, base_width, base_height]);
}

// Two lengthwise ribs on upper face
module ribs() {
    // Calculate rib width from footprint and edge offsets
    total_rib_space = base_length - 2 * rib_edge_offset;
    rib_width = (rib_footprint - (total_rib_space - rib_footprint)) / 2;
    
    // Left rib
    translate([rib_edge_offset, 0, base_height])
        cube([rib_width, base_width, rib_height]);
    
    // Right rib
    translate([base_length - rib_edge_offset - rib_width, 0, base_height])
        cube([rib_width, base_width, rib_height]);
}

// Stepped circular removed features
module stepped_holes() {
    for (pos = hole_positions) {
        left = pos[0];
        front = pos[1];
        radius = pos[2];
        
        // Upper circular recess stage
        translate([left, front, base_height - upper_recess_start])
            cylinder(h = upper_recess_depth, r = radius);
        
        // Deeper aligned circular cut stage
        translate([left, front, base_height - deeper_cut_start])
            cylinder(h = deeper_cut_depth, r = radius);
    }
}

// Main assembly
difference() {
    union() {
        base_solid();
        ribs();
    }
    stepped_holes();
}