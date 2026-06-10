// Global resolution setting for smooth curved surfaces
$fn = 100;

// --------------------------
// All Parameter Definitions
// --------------------------
// Main base plate dimensions (units consistent with spec)
plate_length = 0.225;      // X-axis dimension
plate_width = 0.75;        // Y-axis dimension
plate_thickness = 0.0375;  // Z-axis dimension, base datum = Z=0 at plate bottom

// Through hole parameters
hole_radius = 0.0281;
hole_center_x = 0.1125;    // Common X center for both holes
hole_y_positions = [0.0375, 0.7125]; // Y positions of the two end holes

// Central rectangular block parameters
central_rect_length = 0.225;    // Full length of plate
central_rect_width = 0.5625;
central_rect_y_start = 0.0938;  // Front offset from plate edge
central_rect_y_end = plate_width - 0.0937; // Back offset from plate edge
upper_rect_top_z = 0.1125;      // Top Z height from base datum
lower_rect_depth = 0.375;       // Downward extension from plate bottom

// Annular hollow boss parameters
boss_outer_r = 0.1078;
boss_inner_r = 0.0563;
boss_center_x = 0.1125;
boss_center_y = 0.4687;
boss_height = 0.0938;           // Height above upper rectangular shoulder

// Upper solid pin parameters
pin_r = 0.0563;
pin_center_x = 0.1126;
pin_center_y = 0.4688;
pin_height = 0.1594;            // Height above upper rectangular shoulder

// --------------------------
// Main Model Construction
// --------------------------
difference() {
    union() {
        // 1. Base plate
        cube([plate_length, plate_width, plate_thickness]);

        // 2. Upper central rectangular solid
        translate([0, central_rect_y_start, plate_thickness])
        cube([
            central_rect_length, 
            central_rect_width, 
            upper_rect_top_z - plate_thickness
        ]);

        // 3. Lower central rectangular solid
        translate([0, central_rect_y_start, -lower_rect_depth])
        cube([central_rect_length, central_rect_width, lower_rect_depth]);

        // 4. Annular hollow stepped boss
        translate([boss_center_x, boss_center_y, upper_rect_top_z])
        difference() {
            cylinder(h=boss_height, r=boss_outer_r, center=false);
            // Slightly taller inner cut to ensure full through hole
            cylinder(h=boss_height + 0.005, r=boss_inner_r, center=false);
        }

        // 5. Upper solid circular pin
        translate([pin_center_x, pin_center_y, upper_rect_top_z])
        cylinder(h=pin_height, r=pin_r, center=false);
    }

    // Cut through holes in the end sections of the base plate
    for (y_pos = hole_y_positions) {
        translate([hole_center_x, y_pos, -0.005])
        // Slightly taller cylinder to guarantee full through cut
        cylinder(h=plate_thickness + 0.01, r=hole_radius, center=false);
    }
}