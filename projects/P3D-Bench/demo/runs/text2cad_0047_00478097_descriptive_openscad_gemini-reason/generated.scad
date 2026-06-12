// Parameters

// Main Body Dimensions
body_length = 120;
body_width = 90;
body_height = 60;

// Top Recess (Cavity 1)
rim_thickness = 6;
cavity1_depth = 12;

// Middle Recess (Cavity 2)
cavity2_inset = 12; // Inset relative to the inner edge of the rim
cavity2_depth = 18;

// Deepest Pocket (Cavity 3)
cavity3_length = 45;
cavity3_width = 35;
cavity3_depth = 20;
cavity3_offset_x = 10; // Asymmetric shift to create uneven ledges
cavity3_offset_y = 10;

// Side Projection and Recess
proj_length = 20;
proj_width = 40;
proj_height = 25;
proj_offset_y = 25; // Position along the side (Y-axis)
side_recess_depth = 15; // Cut depth into the main body above projection

// Tolerance for clean boolean operations (prevents Z-fighting)
eps = 0.01;
$fn = 100;

// Module definitions

// Generates the main rectangular solid block
module main_body() {
    cube([body_length, body_width, body_height]);
}

// Generates the subtractive volumes for the nested stepped cavities
module cavities() {
    // Cavity 1: Upper broader recess leaving a thin rim
    translate([rim_thickness, rim_thickness, body_height - cavity1_depth + eps])
        cube([body_length - 2*rim_thickness, body_width - 2*rim_thickness, cavity1_depth]);

    // Cavity 2: Smaller inset rectangular cut continuing downward
    translate([rim_thickness + cavity2_inset, rim_thickness + cavity2_inset, body_height - cavity1_depth - cavity2_depth + eps])
        cube([body_length - 2*(rim_thickness + cavity2_inset), body_width - 2*(rim_thickness + cavity2_inset), cavity2_depth]);

    // Cavity 3: Deepest pocket, shifted to one side for uneven interior ledges
    // Leaves a solid bottom (60 - 12 - 18 - 20 = 10mm remaining thickness)
    translate([rim_thickness + cavity2_inset + cavity3_offset_x, rim_thickness + cavity2_inset + cavity3_offset_y, body_height - cavity1_depth - cavity2_depth - cavity3_depth + eps])
        cube([cavity3_length, cavity3_width, cavity3_depth]);
}

// Generates the subtractive volume for the side recess above the projection
module side_recess() {
    // Recess cut into the main body directly above the side projection
    translate([body_length - side_recess_depth, proj_offset_y, proj_height])
        cube([side_recess_depth + eps, proj_width, body_height - proj_height + eps]);
}

// Generates the additive volume for the side projection
module side_projection() {
    // Added rectangular solid projection along the X-max side
    // Overlaps by eps to ensure a manifold union
    translate([body_length - eps, proj_offset_y, 0])
        cube([proj_length + eps, proj_width, proj_height]);
}

// Main Assembly
union() {
    // Main body with all internal and side recesses removed
    difference() {
        main_body();
        cavities();
        side_recess();
    }
    // Add the side projection
    side_projection();
}