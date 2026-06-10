// Parameters
length = 0.75;       // X
width  = 0.714286;   // Y
height = 0.25;       // Z

// Top through-hole
hole_x = 0.375;
hole_y = 0.5357;
hole_r = 0.0893;

// Side blind holes (front face, axis along Y)
side_r       = 0.0491;
side_z       = 0.125;     // (0.0759 + 0.1741)/2
side_depth   = 0.1071;
side_x1      = 0.0893;
side_x2      = 0.6607;

$fn = 100;

// Main stepped block (simplified as the bounding extrusion)
module main_block() {
    cube([length, width, height]);
}

// Final model
difference() {
    main_block();

    // Upper through circular opening
    translate([hole_x, hole_y, -0.01])
        cylinder(h = height + 0.02, r = hole_r);

    // Front-side blind cylindrical cut #1
    translate([side_x1, -0.01, side_z])
        rotate([-90, 0, 0])
            cylinder(h = side_depth + 0.01, r = side_r);

    // Front-side blind cylindrical cut #2
    translate([side_x2, -0.01, side_z])
        rotate([-90, 0, 0])
            cylinder(h = side_depth + 0.01, r = side_r);
}