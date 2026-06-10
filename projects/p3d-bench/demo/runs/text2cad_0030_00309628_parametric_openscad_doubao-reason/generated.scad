// Global Settings
$fn = 50; // Smoothness for curved surfaces

// Base Plate Dimensions
base_length = 0.75;       // X-axis length
base_width = 0.625;       // Y-axis (front-back) width
base_height = 0.00625;    // Z-axis height from base datum (z=0 underside)

// Left Upright Wall Dimensions
wall_thickness = 0.0063;  // X-axis thickness
wall_total_height = 0.1938; // Total Z height from base datum

// Cut 1: Lower Wall Rectangular Opening
cut1_y_length = 0.081103;
cut1_z_height = 0.111891;
cut1_y_back_offset = 0.0992;
cut1_z_min = 0;
cut1_z_max = 0.1119;

// Cut 2: Wall Circular Through Hole
hole_radius = 0.0432;
hole_front_offset_y = 0.2948;
hole_z_min = 0.0631;
hole_z_max = 0.1495;
hole_cut_depth = 0.0625;

// Cut 3: Small Upper Wall Rectangular Opening
cut2_y_length = 0.043521;
cut2_z_height = 0.044108;
cut2_y_back_offset = 0.4905;
cut2_z_min = 0.0992;
cut2_z_max = 0.1433;

// Cut 4: Base Plate Through Opening
base_cut_x_length = 0.264669;
base_cut_y_length = 0.40625;
base_cut_x_left_offset = 0.3125;
base_cut_y_back_offset = 0.0115;
base_cut_z_min = -0.0562;
base_cut_z_max = 0.0063;

// Module: Base Plate
module base_plate() {
    cube([base_length, base_width, base_height], center=false);
}

// Module: Left Upright Wall
module left_wall() {
    translate([0, 0, 0])
        cube([wall_thickness, base_width, wall_total_height], center=false);
}

// Main Model Assembly
difference() {
    // Combine base and wall
    union() {
        base_plate();
        left_wall();
    }
    
    // Cut 1: Lower wall rectangle
    translate([-0.01, cut1_y_back_offset, cut1_z_min])
        cube([wall_thickness + 0.02, cut1_y_length, cut1_z_height], center=false);
    
    // Cut 2: Circular wall hole
    translate([0, base_width - hole_front_offset_y, (hole_z_min + hole_z_max)/2])
        rotate([0, 90, 0]) // Rotate cylinder to cut along X-axis through wall
            cylinder(h=hole_cut_depth, r=hole_radius, center=true);
    
    // Cut 3: Small upper wall rectangle
    translate([-0.01, cut2_y_back_offset, cut2_z_min])
        cube([wall_thickness + 0.06, cut2_y_length, cut2_z_height], center=false);
    
    // Cut 4: Base plate through opening
    translate([base_cut_x_left_offset, base_cut_y_back_offset, base_cut_z_min])
        cube([base_cut_x_length, base_cut_y_length, base_cut_z_max - base_cut_z_min], center=false);
}