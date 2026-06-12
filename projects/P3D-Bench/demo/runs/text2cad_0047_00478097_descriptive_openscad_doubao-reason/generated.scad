// ==============================================
// Parameters (all dimensions in millimeters)
// ==============================================
main_length = 100;    // X-axis size of main body
main_width = 80;      // Y-axis size of main body
main_height = 50;     // Total Z height of main body
bottom_thickness = 5; // Solid thickness at base of cavity
rim_thickness = 4;    // Thickness of top outer rim
upper_recess_depth = 10; // Depth of first top recess below rim
middle_recess_inset = 8; // Inset of middle recess from upper recess walls
middle_recess_depth = 12; // Additional depth of middle recess
deep_pocket_x_offset = 10; // X-axis shift of deepest pocket
deep_pocket_y_offset = 5;  // Y-axis shift of deepest pocket
deep_pocket_inset = 10;    // Inset of deepest pocket from middle recess
side_protrusion_length = 30; // Length of side projection
side_protrusion_width = 25;  // Width of side projection
side_protrusion_height = 20; // Height of side projection
side_recess_depth = 15; // Depth of recess above side projection
side_recess_height = 18;// Height of side recess
$fn = 64; // Smooth resolution for curved features if added

// ==============================================
// Main Model Assembly
// ==============================================
union() {
    // Main body with internal stepped cavities
    difference() {
        // Base main solid
        cube([main_length, main_width, main_height]);

        // Cut upper recess (inside top rim)
        translate([rim_thickness, rim_thickness, main_height - upper_recess_depth])
        cube([
            main_length - 2*rim_thickness,
            main_width - 2*rim_thickness,
            upper_recess_depth + 0.1 // Extra height to avoid z-fighting
        ]);

        // Cut middle recess step
        translate([
            rim_thickness + middle_recess_inset,
            rim_thickness + middle_recess_inset,
            main_height - upper_recess_depth - middle_recess_depth
        ])
        cube([
            main_length - 2*rim_thickness - 2*middle_recess_inset,
            main_width - 2*rim_thickness - 2*middle_recess_inset,
            middle_recess_depth + 0.1
        ]);

        // Cut shifted deepest pocket
        translate([
            rim_thickness + middle_recess_inset + deep_pocket_inset + deep_pocket_x_offset,
            rim_thickness + middle_recess_inset + deep_pocket_inset + deep_pocket_y_offset,
            bottom_thickness
        ])
        cube([
            main_length - 2*rim_thickness - 2*middle_recess_inset - 2*deep_pocket_inset,
            main_width - 2*rim_thickness - 2*middle_recess_inset - 2*deep_pocket_inset,
            main_height - bottom_thickness - upper_recess_depth - middle_recess_depth + 0.1
        ]);
    }

    // Add side projection
    translate([
        main_length,
        (main_width - side_protrusion_width)/2,
        0
    ])
    cube([side_protrusion_length, side_protrusion_width, side_protrusion_height]);
}

// Cut side recess above side projection
difference() {
    children(); // Take the full union above
    translate([
        main_length - side_recess_depth,
        (main_width - side_protrusion_width)/2,
        side_protrusion_height
    ])
    cube([side_recess_depth + 0.1, side_protrusion_width, side_recess_height + 0.1]);
}