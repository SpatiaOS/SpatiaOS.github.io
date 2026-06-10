// Parameters
length = 0.75;
width = 0.714286;
height = 0.25;
extrusion_depth = 0.25;

// Upper through-opening parameters
through_x = 0.375;
through_y = 0.5357;
through_radius = 0.0893;

// Front side blind hole parameters
blind_radius = 0.0491;
blind_depth = 0.1071;
blind_z_min = 0.0759;
blind_z_max = 0.1741;
blind_x1 = 0.0893;
blind_x2 = 0.6607;

$fn = 100; // Smooth circles

// Main stepped block
module main_block() {
    // Create the main rectangular block
    cube([length, width, extrusion_depth]);
}

// Upper through-opening
module through_hole() {
    // Circular hole through entire height
    translate([through_x, through_y, 0])
        cylinder(h = extrusion_depth + 0.001, r = through_radius, center = false);
}

// Front side blind hole (single instance)
module blind_hole(x_pos) {
    // Position on front face (y=0) with limited z range
    translate([x_pos, 0, blind_z_min])
        rotate([90, 0, 0])
            cylinder(h = blind_depth, r = blind_radius, center = false);
}

// Main model
difference() {
    // Solid base
    main_block();
    
    // Subtract upper through-opening
    through_hole();
    
    // Subtract front blind holes
    blind_hole(blind_x1);
    blind_hole(blind_x2);
}