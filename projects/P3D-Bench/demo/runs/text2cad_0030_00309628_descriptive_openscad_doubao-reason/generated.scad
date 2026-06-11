// ========================== PARAMETERS ==========================
// Base Sheet Dimensions (mm)
base_length = 120;    // X-axis length of base plate
base_width = 80;      // Y-axis width of base plate
base_thickness = 2;   // Z-axis thickness of base sheet

// Upright Wall Dimensions (mm)
wall_height = 100;    // Vertical height of wall above base top
wall_thickness = 3;   // Thickness of the upright wall

// Base Plate Cutout Dimensions (mm)
base_cut_x = 60;      // X size of base rectangular through cut
base_cut_y = 30;      // Y size of base rectangular through cut
base_cut_offset_x = 10; // X offset from left edge of base
base_cut_offset_y = 10; // Y offset from front edge of base

// Lower Wall Cutout Dimensions (mm)
lower_cut_width = 50;  // Horizontal width of lower wall opening
lower_cut_height = 30; // Vertical height of lower wall opening
lower_cut_gap = 5;     // Gap between base top and bottom of lower cut

// Upper Wall Cutout Dimensions (mm)
upper_cut_width = 25;  // Horizontal width of upper wall opening
upper_cut_height = 20; // Vertical height of upper wall opening
upper_cut_gap = 20;    // Gap between top of lower cut and bottom of upper cut

// Wall Round Hole Dimensions (mm)
hole_diameter = 15;    // Diameter of through hole in wall
hole_top_gap = 15;     // Gap between wall top and top edge of hole

// Global Curve Resolution
$fn = 100;

// ========================== MODULES ==========================
// Flat base plate module
module base_plate() {
    cube([base_length, base_width, base_thickness]);
}

// Full-length upright wall module (mounted along back edge of base)
module upright_wall() {
    translate([0, base_width, base_thickness])
        cube([base_length, wall_thickness, wall_height]);
}

// ========================== MAIN MODEL ==========================
difference() {
    // Union of base solid and wall solid
    union() {
        base_plate();
        upright_wall();
    }

    // 1. Through cutout in base plate
    translate([base_cut_offset_x, base_cut_offset_y, -1])
        cube([base_cut_x, base_cut_y, base_thickness + 2]);

    // 2. Lower rectangular through cut in wall
    translate([
        (base_length - lower_cut_width)/2, 
        base_width - 1, 
        base_thickness + lower_cut_gap
    ])
        cube([lower_cut_width, wall_thickness + 2, lower_cut_height]);

    // 3. Upper rectangular through cut in wall
    upper_cut_z_start = base_thickness + lower_cut_gap + lower_cut_height + upper_cut_gap;
    translate([
        (base_length - upper_cut_width)/2, 
        base_width - 1, 
        upper_cut_z_start
    ])
        cube([upper_cut_width, wall_thickness + 2, upper_cut_height]);

    // 4. Round through hole in upper section of wall
    hole_center_z = base_thickness + wall_height - hole_top_gap - (hole_diameter/2);
    translate([base_length/2, base_width - 1, hole_center_z])
        cylinder(h=wall_thickness + 2, d=hole_diameter);
}