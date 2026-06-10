// Main base plate dimensions
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

// Circular through opening parameters
hole_radius = 0.0163;
hole_centers = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.587, 0.5163]
];

// Raised rail group parameters
rail_outer_length = 0.5109;
rail_outer_width = 0.5217;
rail_offset_left = 0.0435;
rail_offset_right = 0.1847;
rail_offset_front = 0.0109;
rail_offset_back = 0.0109;
rail_height = 0.0978;
rail_wall_thickness = 0.01; // Assumed wall thickness for rib outlines

// Shallow tab parameters
tab_length = 0.0435;
tab_width = 0.0761;
tab_offset_left = 0.7065;
tab_offset_right = -0.0109; // Negative indicates overhang beyond base edge
tab_offset_front = 0.0978;
tab_offset_back = 0.3696;
tab_height = 0.0163;

// Deeper side block parameters
block_length = 0.1413;
block_width = 0.087;
block_offset_left = 0.5978;
block_offset_right = 0;
block_offset_front = 0.413;
block_offset_back = 0.0435;
block_height = 0.1413;
block_hole_radius = 0.0326;
block_hole_center_left = 0.7391;
block_hole_center_front = 0.4548;

$fn = 100;

// Main base plate
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// Circular through holes in base plate
module base_holes() {
    for (center = hole_centers) {
        translate([center[0], center[1], -0.001])
            cylinder(h = base_height + 0.002, r = hole_radius);
    }
}

// Raised rail group as rectangular rib outlines
module rail_group() {
    // Outer rail rectangle position
    outer_x = rail_offset_left;
    outer_y = rail_offset_front;
    outer_z = base_height;
    
    // Inner rectangle dimensions (subtract wall thickness from all sides)
    inner_length = rail_outer_length - 2 * rail_wall_thickness;
    inner_width = rail_outer_width - 2 * rail_wall_thickness;
    
    // Create frame by subtracting inner from outer
    difference() {
        // Outer rectangular frame
        translate([outer_x, outer_y, outer_z])
            cube([rail_outer_length, rail_outer_width, rail_height]);
        
        // Inner cutout
        translate([outer_x + rail_wall_thickness, outer_y + rail_wall_thickness, outer_z - 0.001])
            cube([inner_length, inner_width, rail_height + 0.002]);
    }
}

// Shallow rectangular tab
module shallow_tab() {
    // Calculate actual tab position considering overhang
    tab_x = tab_offset_left;
    tab_y = tab_offset_front;
    
    translate([tab_x, tab_y, base_height])
        cube([tab_length, tab_width, tab_height]);
}

// Deeper side block with circular hole
module deeper_block() {
    // Block position
    block_x = block_offset_left;
    block_y = block_offset_front;
    
    difference() {
        // Main block
        translate([block_x, block_y, base_height])
            cube([block_length, block_width, block_height]);
        
        // Circular through hole
        translate([block_hole_center_left, block_hole_center_front, base_height - 0.001])
            cylinder(h = block_height + 0.002, r = block_hole_radius);
    }
}

// Final assembly
difference() {
    // Start with base plate
    base_plate();
    
    // Subtract circular holes from base
    base_holes();
}

// Add raised features
rail_group();
shallow_tab();
deeper_block();