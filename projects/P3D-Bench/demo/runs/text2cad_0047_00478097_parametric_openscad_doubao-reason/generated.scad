// --------------------------
// Global Settings
// --------------------------
$fn = 100; // Curve resolution for smooth geometry

// --------------------------
// Main Body Dimensions
// --------------------------
main_length = 0.702127;   // X-axis (length) dimension
main_width = 0.524964;    // Y-axis (width) dimension
main_height = 0.2103;     // Z-axis (total height, z=0 = underside)

// --------------------------
// Top Shallow Recess Parameters
// --------------------------
top_recess_inset_left = 0.0171;
top_recess_inset_right = 0.0172;
top_recess_inset_front = 0.0172;
top_recess_inset_back = 0.0172;
top_recess_z_start = 0.1888;
top_recess_z_end = main_height;
top_recess_depth = top_recess_z_end - top_recess_z_start; // Matches specified 0.0215

// --------------------------
// Middle Recess (Continuation) Parameters
// --------------------------
middle_cut_inset_left = 0.0257;
middle_cut_inset_right = 0.0258;
middle_cut_inset_front = 0.03;
middle_cut_inset_back = 0.0301;
middle_cut_z_start = 0.0729;
middle_cut_z_end = 0.1888;
middle_cut_depth = middle_cut_z_end - middle_cut_z_start; // Matches specified 0.1159

// --------------------------
// Lower Pocket Parameters
// --------------------------
lower_pocket_inset_left = 0.0999;
lower_pocket_inset_right = 0.0343;
lower_pocket_inset_front = 0.0386;
lower_pocket_inset_back = 0.0387;
lower_pocket_z_start = 0.0215;
lower_pocket_z_end = 0.073;
lower_pocket_depth = lower_pocket_z_end - lower_pocket_z_start; // Matches specified 0.0515

// --------------------------
// Left Side Projection Parameters
// --------------------------
side_proj_overhang_left = 0.0479;
side_proj_length = 0.130618;
side_proj_width = 0.463588;
side_proj_inset_front = 0.03;
side_proj_inset_back = 0.0314;
side_proj_z_start = 0.073;
side_proj_z_end = 0.0876;
side_proj_thickness = side_proj_z_end - side_proj_z_start; // Matches specified 0.0146

// --------------------------
// Left Side Recess Parameters
// --------------------------
side_recess_depth = 0.0343;
side_recess_y_inset_front = 0.0546;
side_recess_y_length = 0.367372;
side_recess_z_start = 0.0876;
side_recess_z_end = 0.1889;
side_recess_z_height = side_recess_z_end - side_recess_z_start; // Matches specified 0.101285

// --------------------------
// Main Model Construction
// --------------------------
difference() {
    // Base solid: main body + side projection
    union() {
        // Primary reference block
        cube([main_length, main_width, main_height]);
        
        // Added left side projection
        translate([
            -side_proj_overhang_left,
            side_proj_inset_front,
            side_proj_z_start
        ])
        cube([side_proj_length, side_proj_width, side_proj_thickness]);
    }

    // Cut 1: Top shallow recess
    translate([
        top_recess_inset_left,
        top_recess_inset_front,
        top_recess_z_start
    ])
    cube([
        main_length - top_recess_inset_left - top_recess_inset_right,
        main_width - top_recess_inset_front - top_recess_inset_back,
        top_recess_depth
    ]);

    // Cut 2: Middle continuation recess
    translate([
        middle_cut_inset_left,
        middle_cut_inset_front,
        middle_cut_z_start
    ])
    cube([
        main_length - middle_cut_inset_left - middle_cut_inset_right,
        main_width - middle_cut_inset_front - middle_cut_inset_back,
        middle_cut_depth
    ]);

    // Cut 3: Lower contained pocket
    translate([
        lower_pocket_inset_left,
        lower_pocket_inset_front,
        lower_pocket_z_start
    ])
    cube([
        main_length - lower_pocket_inset_left - lower_pocket_inset_right,
        main_width - lower_pocket_inset_front - lower_pocket_inset_back,
        lower_pocket_depth
    ]);

    // Cut 4: Left side recess
    translate([
        0,
        side_recess_y_inset_front,
        side_recess_z_start
    ])
    cube([side_recess_depth, side_recess_y_length, side_recess_z_height]);
}