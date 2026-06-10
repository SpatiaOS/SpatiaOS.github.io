// Parameters for base plate
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;
hole_radius = 0.0163;

// Hole positions (from left/front edges)
hole1 = [0.0272, 0.1848];
hole2 = [0.0272, 0.4565];
hole3 = [0.5761, 0.0272];
hole4 = [0.587, 0.5163];

// Raised rail group parameters
rail_span_x = 0.5109;
rail_span_y = 0.5217;
rail_offset_left = 0.0435;
rail_offset_right = 0.1847;
rail_offset_front = 0.0109;
rail_offset_back = 0.0109;
rail_height = 0.0978;
wall_thickness = 0.01; // Assumed wall thickness for frame

// Shallow tab parameters
tab_width = 0.0435;
tab_depth = 0.0761;
tab_offset_left = 0.7065;
tab_offset_right = -0.0109;
tab_offset_front = 0.0978;
tab_offset_back = 0.3696;
tab_height = 0.0163;

// Deeper block parameters
block_length = 0.086957;
block_width = 0.125;
block_height = 0.141304;
block_offset_left = 0.5978;
block_offset_right = 0;
block_offset_front = 0.413;
block_offset_back = 0.0435;
block_hole_radius = 0.0326;
block_hole_center = [0.7391, 0.4548];

$fn = 100; // Smooth curves

// Base plate with through holes
module base_plate() {
    difference() {
        cube([base_length, base_width, base_height]);
        // Four circular through holes
        for (pos = [hole1, hole2, hole3, hole4]) {
            translate([pos[0], pos[1], -0.001])
                cylinder(h = base_height + 0.002, r = hole_radius);
        }
    }
}

// Raised rail group as rectangular frame
module raised_rails() {
    // Outer rectangle position
    outer_x = rail_offset_left;
    outer_y = rail_offset_front;
    // Inner rectangle dimensions
    inner_x = outer_x + wall_thickness;
    inner_y = outer_y + wall_thickness;
    inner_width = rail_span_x - 2 * wall_thickness;
    inner_depth = rail_span_y - 2 * wall_thickness;
    
    translate([0, 0, base_height]) {
        difference() {
            // Outer solid rectangle
            translate([outer_x, outer_y, 0])
                cube([rail_span_x, rail_span_y, rail_height]);
            // Inner cutout to create frame
            translate([inner_x, inner_y, -0.001])
                cube([inner_width, inner_depth, rail_height + 0.002]);
        }
    }
}

// Shallow rectangular tab
module shallow_tab() {
    // Calculate actual position from offsets
    tab_x = tab_offset_left;
    tab_y = tab_offset_front;
    translate([tab_x, tab_y, base_height])
        cube([tab_width, tab_depth, tab_height]);
}

// Deeper side block with circular hole
module deeper_block() {
    // Calculate actual position from offsets
    block_x = block_offset_left;
    block_y = block_offset_front;
    
    translate([0, 0, base_height]) {
        difference() {
            // Main block
            translate([block_x, block_y, 0])
                cube([block_length, block_width, block_height]);
            // Circular through hole
            translate([block_hole_center[0], block_hole_center[1], -0.001])
                cylinder(h = block_height + 0.002, r = block_hole_radius);
        }
    }
}

// Main assembly
union() {
    base_plate();
    raised_rails();
    shallow_tab();
    deeper_block();
}