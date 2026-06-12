// Main body dimensions
length = 0.702127;
width = 0.524964;
height = 0.2103;
$fn = 50;

// Main body
module main_body() {
    cube([length, width, height]);
}

// Shallow top recess (first level)
module top_recess() {
    // Dimensions
    recess_length = 0.667793;
    recess_width = 0.490631;
    recess_depth = 0.0215;
    
    // Position calculations
    left_inset = 0.0171;
    right_inset = 0.0172;
    front_inset = 0.0172;
    back_inset = 0.0172;
    
    // Vertical position (bottom of recess)
    z_start = 0.1888;
    
    translate([left_inset, front_inset, z_start])
        cube([recess_length, recess_width, recess_depth]);
}

// Second level recess
module second_recess() {
    // Dimensions
    recess_length = 0.650626;
    recess_width = 0.46488;
    recess_depth = 0.1159;
    
    // Position calculations
    left_inset = 0.0257;
    right_inset = 0.0258;
    front_inset = 0.03;
    back_inset = 0.0301;
    
    // Vertical position (bottom of recess)
    z_start = 0.0729;
    
    translate([left_inset, front_inset, z_start])
        cube([recess_length, recess_width, recess_depth]);
}

// Lower pocket (third level)
module lower_pocket() {
    // Dimensions
    pocket_length = 0.567882;
    pocket_width = 0.447713;
    pocket_depth = 0.0515;
    
    // Position calculations
    left_inset = 0.0999;
    right_inset = 0.0343;
    front_inset = 0.0386;
    back_inset = 0.0387;
    
    // Vertical position (bottom of pocket)
    z_start = 0.0215;
    
    translate([left_inset, front_inset, z_start])
        cube([pocket_length, pocket_width, pocket_depth]);
}

// Side projection (solid addition)
module side_projection() {
    // Dimensions
    proj_length = 0.130618;
    proj_width = 0.463588;
    proj_thickness = 0.0146;
    
    // Position calculations
    overhang = 0.0479;
    right_space = 0.6194;
    front_inset = 0.03;
    back_inset = 0.0314;
    
    // Vertical position (bottom of projection)
    z_start = 0.073;
    z_end = 0.0876;
    proj_height = z_end - z_start;
    
    // X position (overhanging left edge)
    x_pos = -overhang;
    
    // Y position
    y_pos = front_inset;
    
    translate([x_pos, y_pos, z_start])
        cube([proj_length, proj_width, proj_height]);
}

// Side recess (cutout)
module side_recess() {
    // Dimensions
    recess_depth = 0.0343;
    recess_length = 0.367372;  // Length in z-direction
    recess_width = 0.101285;   // Width in y-direction
    
    // Position calculations
    right_space = 0.6678;
    front_inset = 0.0546;
    back_inset = 0.103;
    
    // Vertical position (bottom of recess)
    z_start = 0.0876;
    z_end = 0.1889;
    recess_height = z_end - z_start;
    
    // X position (at left edge)
    x_pos = 0;
    
    // Y position
    y_pos = front_inset;
    
    translate([x_pos, y_pos, z_start])
        cube([recess_depth, recess_width, recess_height]);
}

// Main assembly
difference() {
    // Start with main body
    main_body();
    
    // Subtract all recesses
    top_recess();
    second_recess();
    lower_pocket();
    side_recess();
}

// Add side projection
side_projection();