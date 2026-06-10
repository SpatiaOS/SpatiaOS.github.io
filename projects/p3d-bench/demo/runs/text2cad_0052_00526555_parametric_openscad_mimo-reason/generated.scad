// Stepped Block with Circular Openings
// All dimensions in inches

// Main block dimensions
block_length = 0.75;      // Overall length
block_width = 0.714286;   // Overall width  
block_height = 0.25;      // Overall height
extrusion_depth = 0.25;   // Main extrusion depth

// Upper through-opening parameters
through_hole_x = 0.375;   // Distance from left edge
through_hole_y = 0.5357;  // Distance from front edge
through_hole_r = 0.0893;  // Radius

// Side blind hole parameters
side_hole_r = 0.0491;     // Radius of side holes
side_hole_depth = 0.1071; // Depth of cut into block
side_hole_left_x = 0.0893;  // Left hole position
side_hole_right_x = 0.6607; // Right hole position
side_hole_z_start = 0.0759; // Bottom of hole band
side_hole_z_end = 0.1741;   // Top of hole band

// Resolution for smooth curves
$fn = 100;

// Main stepped block
module main_block() {
    // Create rectangular block with given dimensions
    cube([block_length, block_width, block_height]);
}

// Upper through-opening (vertical cylinder)
module through_opening() {
    translate([through_hole_x, through_hole_y, 0])
        cylinder(h = block_height + 0.01, r = through_hole_r, center = false);
}

// Side blind hole (horizontal cylinder limited to band)
module side_blind_hole(x_position) {
    // Calculate vertical center of hole band
    z_center = (side_hole_z_start + side_hole_z_end) / 2;
    band_height = side_hole_z_end - side_hole_z_start;
    
    // Position at front face, oriented along Y-axis
    translate([x_position, 0, z_center])
        rotate([-90, 0, 0])  // Orient cylinder along Y-axis
        // Create cylinder and limit to band height
        intersection() {
            cylinder(h = side_hole_depth, r = side_hole_r, center = false);
            // Limit cylinder to hole band height
            translate([0, 0, -band_height/2])
                cube([side_hole_r*2, side_hole_r*2, band_height], center = true);
        }
}

// Complete model with all features
difference() {
    // Start with main block
    main_block();
    
    // Subtract upper through-opening
    through_opening();
    
    // Subtract left side blind hole
    side_blind_hole(side_hole_left_x);
    
    // Subtract right side blind hole
    side_blind_hole(side_hole_right_x);
}