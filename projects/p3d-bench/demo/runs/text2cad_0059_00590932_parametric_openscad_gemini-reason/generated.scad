// Parameters

// Main base dimensions
base_length = 0.165891;
base_width = 0.325401;
base_height = 0.408347;

// Recess 1 (Top square cut)
recess1_length = 0.089326;
recess1_width = 0.089326;
recess1_x_offset = 0.0383;
recess1_y_offset = 0.0191;
recess1_z_start = 0.319;

// Recess 2 (Lower rectangular opening)
recess2_length = 0.076565;
recess2_width = 0.132416;
recess2_x_offset = 0.0447;
recess2_y_offset = -0.0303;
recess2_z_start = 0;
recess2_z_end = 0.319;

// Recess 3 (Upper back strip cut)
recess3_width = 0.114848;
recess3_y_offset = 0.2106;
recess3_z_start = 0.2807;

// Shallow solid base addition
add_length = 0.4339;
add_width = 0.1148;
add_height = 0.0383;
add_x_offset = -0.134;

// Through holes
hole_radius = 0.0255;
hole_y_offset = 0.0574;
hole1_x_offset = -0.069;
hole2_x_offset = 0.2349;

// Resolution and epsilon for clean boolean operations
$fn = 100;
eps = 0.001;

// Reusable module for the entire part
module main_model() {
    difference() {
        // Combine main base and shallow addition
        union() {
            // Main rectangular base
            cube([base_length, base_width, base_height]);
            
            // Shallow solid base addition at the front
            translate([add_x_offset, 0, 0])
                cube([add_length, add_width, add_height]);
        }
        
        // Cut 1: Top square recess
        translate([recess1_x_offset, recess1_y_offset, recess1_z_start])
            cube([recess1_length, recess1_width, base_height - recess1_z_start + eps]);
            
        // Cut 2: Lower rectangular opening breaking out the front face
        translate([recess2_x_offset, recess2_y_offset, recess2_z_start - eps])
            cube([recess2_length, recess2_width, recess2_z_end - recess2_z_start + eps]);
            
        // Cut 3: Upper back strip cut
        translate([-eps, recess3_y_offset, recess3_z_start])
            cube([base_length + 2*eps, recess3_width + eps, base_height - recess3_z_start + eps]);
            
        // Cut 4: Circular through hole 1 in the shallow addition
        translate([hole1_x_offset, hole_y_offset, -eps])
            cylinder(h=add_height + 2*eps, r=hole_radius);
            
        // Cut 5: Circular through hole 2 in the shallow addition
        translate([hole2_x_offset, hole_y_offset, -eps])
            cylinder(h=add_height + 2*eps, r=hole_radius);
    }
}

// Render the geometry
main_model();