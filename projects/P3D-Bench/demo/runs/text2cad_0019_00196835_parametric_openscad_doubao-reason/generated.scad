// Global Settings
$fn = 100; // Smooth curve resolution

// Rail Parameters
rail_length = 0.748506;       // X-axis length of main rail
rail_width = 0.024642;        // Y-axis width of main rail
rail_lower_height = 0.0185;   // Z-height of lower rail body
rail_upper_thickness = 0.0046;// Z-thickness of upper rail top layer

// Recess Parameters
recess_radius = 0.0043;       // Radius of all circular recesses
recess_height = 0.0123;       // Z-height of recess cut
recess_z_start = 0.0062;      // Z-start position of recess cuts
rail_recess_y_center = 0.0108;// Y-center offset for rail recesses from front edge
rail_recess_x_pos = [0.0138, 0.7346]; // X positions of rail recesses

// End Block Parameters
end_block_size = 0.030803;    // Equal X/Y dimension of end block
end_block_left_x = 0.7192;    // X position of end block left edge
end_block_front_y = -0.0361;  // Y position of end block front edge (front of rail = Y=0)
end_block_recess_x = 0.7361;  // X center of end block recess
end_block_recess_y = -0.0192; // Y center of end block recess

// End Cutout Parameters
cutout_size = 0.027722;       // Equal X/Y dimension of end cutout
cutout_total_height = 0.077;  // Total Z height of cutout
cutout_z_bottom = -0.0585;    // Z bottom position of cutout

// Main Model
difference() {
    // Union of all solid components
    union() {
        // Lower rail body
        cube([rail_length, rail_width, rail_lower_height]);
        
        // Lower end block body
        translate([end_block_left_x, end_block_front_y, 0])
            cube([end_block_size, end_block_size, rail_lower_height]);
        
        // Upper rail top layer
        translate([0, 0, rail_lower_height])
            cube([rail_length, rail_width, rail_upper_thickness]);
        
        // Upper end block top layer
        translate([end_block_left_x, end_block_front_y, rail_lower_height])
            cube([end_block_size, end_block_size, rail_upper_thickness]);
    }
    
    // Cut rail recesses
    for (x = rail_recess_x_pos) {
        translate([x, rail_recess_y_center, recess_z_start])
            cylinder(h=recess_height, r=recess_radius);
    }
    
    // Cut end block recess
    translate([end_block_recess_x, end_block_recess_y, recess_z_start])
        cylinder(h=recess_height, r=recess_radius);
    
    // Cut end block rectangular cutout
    translate([end_block_left_x, end_block_front_y, cutout_z_bottom])
        cube([cutout_size, cutout_size, cutout_total_height]);
}