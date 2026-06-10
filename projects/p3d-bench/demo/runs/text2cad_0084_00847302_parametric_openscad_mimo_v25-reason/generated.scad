// Parametric Design - Main Reference Dimensions
outer_width = 0.75;      // X dimension
outer_depth = 0.625;     // Y dimension  
outer_height = 0.55;     // Z dimension (base to top)
wall_thickness = 0.075;  // Wall thickness (derived from cuts)

// Front Cut Parameters
front_cut_length = 0.5;
front_cut_margin = 0.125;
front_cut_bottom = 0.25;
front_cut_top = 0.45;
front_cut_depth = 0.075;

// Left Cut Parameters  
left_cut_length = 0.225;
left_cut_front_margin = 0.2;
left_cut_back_margin = 0.2;
left_cut_bottom = 0;
left_cut_top = 0.5;
left_cut_depth = 0.075;

// Internal Ledge Parameters
ledge_length = 0.5;
ledge_width = 0.1;
ledge_thickness = 0.0125;
ledge_side_margin = 0.125;

// Resolution
$fn = 100;

// Module: Main hollow enclosure
module main_enclosure() {
    difference() {
        // Outer solid block
        cube([outer_width, outer_depth, outer_height]);
        
        // Inner void (open top)
        translate([wall_thickness, wall_thickness, wall_thickness])
            cube([
                outer_width - 2*wall_thickness,
                outer_depth - 2*wall_thickness,
                outer_height  // Open top - cut through entire height
            ]);
    }
}

// Module: Front horizontal cut
module front_cut() {
    // Calculate X position (centered with margins)
    front_cut_x = front_cut_margin;
    
    // Position and create cut
    translate([front_cut_x, 0, front_cut_bottom])
        cube([front_cut_length, front_cut_depth, front_cut_top - front_cut_bottom]);
}

// Module: Left vertical cut  
module left_cut() {
    // Calculate Y position (centered with margins)
    left_cut_y = left_cut_front_margin;
    
    // Position and create cut
    translate([0, left_cut_y, left_cut_bottom])
        cube([left_cut_depth, left_cut_length, left_cut_top - left_cut_bottom]);
}

// Module: Internal ledge
module internal_ledge() {
    // Calculate X position (centered with margins)
    ledge_x = ledge_side_margin;
    
    // Position ledge on front inside wall
    translate([ledge_x, wall_thickness, 0])
        cube([ledge_length, ledge_width, ledge_thickness]);
}

// Main assembly
difference() {
    // Create main hollow enclosure
    main_enclosure();
    
    // Subtract front cut
    front_cut();
    
    // Subtract left cut
    left_cut();
}

// Add internal ledge (separate solid addition)
internal_ledge();