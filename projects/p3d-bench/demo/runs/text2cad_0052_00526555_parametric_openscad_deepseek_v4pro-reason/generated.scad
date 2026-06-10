// Parametric dimensions for the main block
block_length = 0.75;
block_width  = 0.714286;
block_height = 0.25;

// Upper through-hole (circular)
through_hole_radius = 0.0893;
through_hole_x      = 0.375;   // from left edge
through_hole_y      = 0.5357;  // from front edge

// Blind cylindrical cuts on front face (Y=0)
blind_hole_radius   = 0.0491;
blind_hole_depth    = 0.1071;   // into the body along Y
blind_hole_z_center = (0.0759 + 0.1741) / 2;  // 0.125, centered vertically
blind_hole1_x       = 0.0893;   // from left edge
blind_hole2_x       = 0.6607;   // from left edge

// Smoothness
$fn = 100;

// Main solid: rectangular block (base at Z=0, left at X=0, front at Y=0)
module main_block() {
    cube([block_length, block_width, block_height]);
}

// Upper through-hole: vertical cylinder removing full height
module through_hole() {
    translate([through_hole_x, through_hole_y, -0.005])
        cylinder(h = block_height + 0.01, r = through_hole_radius);
}

// Single blind hole on the front face, axis along Y
module blind_hole(x_pos) {
    translate([x_pos, 0, blind_hole_z_center])
        rotate([0, 90, 0])
            cylinder(h = blind_hole_depth, r = blind_hole_radius);
}

// Final model: subtract holes from block
difference() {
    main_block();
    through_hole();
    blind_hole(blind_hole1_x);
    blind_hole(blind_hole2_x);
}