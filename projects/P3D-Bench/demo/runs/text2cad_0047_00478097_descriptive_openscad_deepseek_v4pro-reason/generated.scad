// Parameters (all dimensions in mm)
$fn = 50; // resolution for curved surfaces (not needed here, but good practice)

// Main body dimensions
body_length = 100;
body_width  = 80;
body_height = 50;

// Top recess (shallow, surrounded by thin rim)
rim_thickness = 5;
top_recess_depth = 10;

// Second recess (deeper, inset from top recess)
recess2_length = 70;
recess2_width  = 50;
recess2_depth  = 25;  // total depth from top surface

// Deepest pocket (shifted to one side, uneven ledges)
deepest_length   = 30;
deepest_width    = 30;
deepest_depth    = 45;  // total depth from top surface, leaves solid bottom
deepest_offset_x = 15;  // shift along X relative to center (positive = right side)

// Side projection (added rectangular solid along one side)
projection_length = 20;  // how far it sticks out
projection_width  = 40;
projection_height = 20;  // from bottom upward

// Side recess above the projection (creates stepped depth tier)
side_recess_width   = 30;
side_recess_height  = 15;  // vertical size of the recess
side_recess_depth   = 15;  // how deep it cuts into the main body
side_recess_z_start = projection_height;  // starts at the top of the projection

// Build the main solid: main body + side projection
difference() {
    union() {
        // Main rectangular body (centered at origin)
        cube([body_length, body_width, body_height], center = true);
        
        // Side projection attached to the right side (positive X), bottom-aligned
        translate([
            body_length / 2 + projection_length / 2,  // right face of body + half projection thickness
            0,                                        // centered in Y
            -body_height / 2 + projection_height / 2  // bottom of body + half projection height
        ])
            cube([projection_length, projection_width, projection_height], center = true);
    }
    
    // --- Interior stepped cavity from top ---
    
    // 1. Top recess (broad, shallow, surrounded by rim)
    translate([0, 0, body_height / 2 - top_recess_depth / 2])
        cube([
            body_length - 2 * rim_thickness,
            body_width  - 2 * rim_thickness,
            top_recess_depth
        ], center = true);
    
    // 2. Second recess (smaller, deeper, centered)
    translate([0, 0, body_height / 2 - recess2_depth / 2])
        cube([recess2_length, recess2_width, recess2_depth], center = true);
    
    // 3. Deepest pocket (smallest, deepest, shifted to one side)
    translate([deepest_offset_x, 0, body_height / 2 - deepest_depth / 2])
        cube([deepest_length, deepest_width, deepest_depth], center = true);
    
    // --- Side recess above the projection (stepped tier on the right side) ---
    translate([
        body_length / 2 - side_recess_depth / 2,   // start at right face, go inward
        0,                                         // centered in Y
        -body_height / 2 + side_recess_z_start + side_recess_height / 2  // above projection
    ])
        cube([side_recess_depth, side_recess_width, side_recess_height], center = true);
}