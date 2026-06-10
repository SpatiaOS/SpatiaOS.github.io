// Parametric Model of Rectangular Base with Upright Wall and Cutouts
// All dimensions in millimeters

// --- PARAMETERS ---
// Base dimensions
base_length = 0.75;
base_width = 0.625;
base_height = 0.00625;

// Wall dimensions
wall_thickness = 0.0063;
wall_width = 0.625;
wall_height_above_base = 0.1875;
wall_total_height = 0.1938;  // From base datum

// Lower rectangular opening in wall
lower_opening_width = 0.081103;
lower_opening_height = 0.111891;
lower_opening_front_offset = 0.4447;
lower_opening_back_offset = 0.0992;
lower_opening_z_start = 0;
lower_opening_z_end = 0.1119;

// Circular through-hole in wall
hole_radius = 0.0432;
hole_front_offset = 0.2948;
hole_z_start = 0.0631;
hole_z_end = 0.1495;
hole_cut_depth = 0.0625;

// Smaller rectangular opening in wall
small_opening_width = 0.043521;
small_opening_height = 0.044108;
small_opening_front_offset = 0.091;
small_opening_back_offset = 0.4905;
small_opening_z_start = 0.0992;
small_opening_z_end = 0.1433;
small_opening_cut_depth = 0.0625;

// Base rectangular opening
base_opening_length = 0.264669;
base_opening_width = 0.40625;
base_opening_left_offset = 0.3125;
base_opening_right_offset = 0.1728;
base_opening_front_offset = 0.2073;
base_opening_back_offset = 0.0115;
base_opening_z_start = -0.0562;
base_opening_z_end = 0.0063;

// Resolution for curved surfaces
$fn = 100;

// --- MODULES ---

// Main rectangular base
module base() {
    cube([base_length, base_width, base_height]);
}

// Upright wall along left edge
module wall() {
    translate([0, 0, base_height])
        cube([wall_thickness, wall_width, wall_height_above_base]);
}

// Lower rectangular opening in wall
module lower_wall_opening() {
    // Calculate position based on offsets
    y_pos = lower_opening_front_offset;
    width = wall_width - lower_opening_front_offset - lower_opening_back_offset;
    height = lower_opening_z_end - lower_opening_z_start;
    
    translate([-0.001, y_pos, base_height + lower_opening_z_start])
        cube([wall_thickness + 0.002, width, height]);
}

// Circular through-hole in wall
module circular_hole() {
    // Position at center of wall thickness, based on offsets
    y_pos = hole_front_offset;
    z_center = (hole_z_start + hole_z_end) / 2;
    
    translate([-hole_cut_depth/2, y_pos, base_height + z_center])
        rotate([0, 90, 0])
            cylinder(h = hole_cut_depth, r = hole_radius);
}

// Smaller rectangular opening in wall
module small_wall_opening() {
    // Calculate position based on offsets
    y_pos = small_opening_front_offset;
    width = wall_width - small_opening_front_offset - small_opening_back_offset;
    height = small_opening_z_end - small_opening_z_start;
    
    translate([-small_opening_cut_depth/2, y_pos, base_height + small_opening_z_start])
        cube([small_opening_cut_depth, width, height]);
}

// Rectangular opening in base
module base_opening() {
    // Calculate position based on offsets
    x_pos = base_opening_left_offset;
    y_pos = base_opening_front_offset;
    length = base_length - base_opening_left_offset - base_opening_right_offset;
    width = base_width - base_opening_front_offset - base_opening_back_offset;
    height = base_opening_z_end - base_opening_z_start;
    
    translate([x_pos, y_pos, base_opening_z_start])
        cube([length, width, height]);
}

// --- MAIN MODEL ---
// Start with base and wall, then subtract all openings
difference() {
    // Combine base and wall
    union() {
        base();
        wall();
    }
    
    // Subtract wall openings
    lower_wall_opening();
    circular_hole();
    small_wall_opening();
    
    // Subtract base opening
    base_opening();
}