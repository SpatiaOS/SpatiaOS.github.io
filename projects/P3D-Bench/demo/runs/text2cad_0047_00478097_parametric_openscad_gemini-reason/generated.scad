// Parameters for the Main Body
body_length = 0.702127;
body_width  = 0.524964;
body_height = 0.2103;

// Parameters for Cut 1 (Shallow Top Recess)
cut1_length = 0.667793;
cut1_width  = 0.490631;
cut1_depth  = 0.0215;
cut1_x_offset = 0.0171;
cut1_y_offset = 0.0172;
cut1_z_offset = 0.1888;

// Parameters for Cut 2 (Contained Middle Cut)
cut2_length = 0.650626;
cut2_width  = 0.46488;
cut2_depth  = 0.1159;
cut2_x_offset = 0.0257;
cut2_y_offset = 0.03;
cut2_z_offset = 0.0729;

// Parameters for Cut 3 (Lower Pocket)
cut3_length = 0.567882;
cut3_width  = 0.447713;
cut3_depth  = 0.0515;
cut3_x_offset = 0.0999;
cut3_y_offset = 0.0386;
cut3_z_offset = 0.0215;

// Parameters for Addition 1 (Side Projection)
add1_length = 0.130618;
add1_width  = 0.463588;
add1_height = 0.0146;
add1_x_offset = -0.0479;
add1_y_offset = 0.03;
add1_z_offset = 0.073;

// Parameters for Cut 4 (Side Recess)
cut4_length = 0.0343;
cut4_width  = 0.3674;
cut4_depth  = 0.1013;
cut4_x_offset = 0;
cut4_y_offset = 0.0546;
cut4_z_offset = 0.0876;

// Epsilon for avoiding Z-fighting in boolean operations
eps = 0.001;

// Main Geometry
difference() {
    // Base solid and additions
    union() {
        // Main reference body
        cube([body_length, body_width, body_height]);
        
        // Solid rectangular side projection
        translate([add1_x_offset, add1_y_offset, add1_z_offset])
            cube([add1_length, add1_width, add1_height]);
    }
    
    // Subtractive cuts
    
    // Cut 1: Shallow rectangular recess from the top
    translate([cut1_x_offset, cut1_y_offset, cut1_z_offset])
        cube([cut1_length, cut1_width, cut1_depth + eps]);
        
    // Cut 2: Contained rectangular cut continuing downward
    // Adding eps to depth to ensure clean overlap with Cut 1
    translate([cut2_x_offset, cut2_y_offset, cut2_z_offset])
        cube([cut2_length, cut2_width, cut2_depth + eps]);
        
    // Cut 3: Lower, more offset rectangular pocket
    // Adding eps to depth to ensure clean overlap with Cut 2
    translate([cut3_x_offset, cut3_y_offset, cut3_z_offset])
        cube([cut3_length, cut3_width, cut3_depth + eps]);
        
    // Cut 4: Associated side recess at the left edge
    // Extending slightly in X to cleanly cut the left edge
    translate([cut4_x_offset - eps, cut4_y_offset, cut4_z_offset])
        cube([cut4_length + eps, cut4_width, cut4_depth]);
}