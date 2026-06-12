// Parameters
base_width = 100;
base_depth = 80;
base_thickness = 4;

rear_raised_depth = 45;
rear_raised_height = 12;

side_strip_width = 6;
side_strip_height = 4;

transverse_y_pos = 15;
transverse_depth = 2;
transverse_height = 10;
transverse_opening_height = 6;

lower_step_depth = 20;
lower_step_drop = 8;

$fn = 100;

// Modules

// Main thin rectangular base slab
module base_slab() {
    cube([base_width, base_depth, base_thickness]);
}

// Raised section at the rear with side strips
module rear_raised_area() {
    // Larger raised rectangular portion at the rear
    translate([0, base_depth - rear_raised_depth, base_thickness])
        cube([base_width, rear_raised_depth, rear_raised_height]);
    
    // Narrow raised strip on the left side
    translate([0, base_depth - rear_raised_depth, base_thickness + rear_raised_height])
        cube([side_strip_width, rear_raised_depth, side_strip_height]);
        
    // Narrow raised strip on the right side
    translate([base_width - side_strip_width, base_depth - rear_raised_depth, base_thickness + rear_raised_height])
        cube([side_strip_width, rear_raised_depth, side_strip_height]);
}

// Very thin transverse added feature spanning across the width
// Built additively to create a real internal opening without cuts
module transverse_feature() {
    // Left support leg
    translate([0, transverse_y_pos, base_thickness])
        cube([side_strip_width, transverse_depth, transverse_opening_height]);
        
    // Right support leg
    translate([base_width - side_strip_width, transverse_y_pos, base_thickness])
        cube([side_strip_width, transverse_depth, transverse_opening_height]);
        
    // Top spanning bridge completing the internal opening
    translate([0, transverse_y_pos, base_thickness + transverse_opening_height])
        cube([base_width, transverse_depth, transverse_height - transverse_opening_height]);
}

// Aligned continuation extending deeper from the shoulder
// This creates the stepped underside so it is not a single flat level
module downward_step() {
    translate([0, base_depth - rear_raised_depth, -lower_step_drop])
        cube([base_width, lower_step_depth, lower_step_drop]);
}

// Main Assembly
union() {
    // Combine all features as solid added material
    base_slab();
    rear_raised_area();
    transverse_feature();
    downward_step();
}