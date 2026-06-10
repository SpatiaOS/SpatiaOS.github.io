// Parameters
base_length = 0.75;
base_width = 0.625;
base_height = 0.00625;
base_elevation = 0.0062;

wall_thickness = 0.0063;
wall_height_above_plate = 0.1875;
wall_total_height = 0.1938;

// Wall cut parameters
lower_rect_cut_width = 0.081103;
lower_rect_cut_height = 0.111891;
lower_rect_front_offset = 0.4447;
lower_rect_back_offset = 0.0992;

// Circular hole parameters
hole_radius = 0.0432;
hole_front_offset = 0.2948;
hole_height_min = 0.0631;
hole_height_max = 0.1495;
hole_cut_reach = 0.0625;

// Small rectangular cut parameters
small_rect_width = 0.043521;
small_rect_height = 0.044108;
small_rect_front_offset = 0.091;
small_rect_back_offset = 0.4905;
small_rect_height_min = 0.0992;
small_rect_height_max = 0.1433;
small_rect_cut_reach = 0.0625;

// Base cut parameters
base_cut_width = 0.264669;
base_cut_depth = 0.40625;
base_cut_left_offset = 0.3125;
base_cut_right_offset = 0.1728;
base_cut_front_offset = 0.2073;
base_cut_back_offset = 0.0115;
base_cut_height_min = -0.0562;
base_cut_height_max = 0.0063;

$fn = 100;

// Main model
difference() {
    // Solid base and wall
    union() {
        // Main rectangular base
        translate([0, 0, base_elevation - base_height])
            cube([base_length, base_width, base_height]);
        
        // Upright wall along left edge
        translate([0, 0, 0])
            cube([wall_thickness, base_width, wall_total_height]);
    }
    
    // Cut lower rectangular opening through wall
    translate([0, lower_rect_front_offset, 0])
        cube([wall_thickness + 0.001, 
              base_width - lower_rect_front_offset - lower_rect_back_offset, 
              lower_rect_cut_height]);
    
    // Cut circular through-hole in wall
    translate([wall_thickness/2, hole_front_offset, (hole_height_min + hole_height_max)/2])
        rotate([0, 90, 0])
            cylinder(h = hole_cut_reach, r = hole_radius, center = true);
    
    // Cut smaller rectangular opening in wall
    translate([0, small_rect_front_offset, small_rect_height_min])
        cube([small_rect_cut_reach + 0.001, 
              base_width - small_rect_front_offset - small_rect_back_offset, 
              small_rect_height_max - small_rect_height_min]);
    
    // Cut rectangular through opening in base
    translate([base_cut_left_offset, base_cut_front_offset, base_cut_height_min])
        cube([base_length - base_cut_left_offset - base_cut_right_offset,
              base_width - base_cut_front_offset - base_cut_back_offset,
              base_cut_height_max - base_cut_height_min]);
}