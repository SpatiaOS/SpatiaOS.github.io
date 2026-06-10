// Resolution for curved features
$fn = 100;

// Main plate dimensions
plate_length = 0.225;
plate_width = 0.75;
plate_thickness = 0.0375;

// Through-hole parameters
hole_radius = 0.0281;
hole_center_x = 0.1125;
hole1_y = 0.0375;
hole2_y = 0.7125;

// Central upper rectangular solid
upper_width = 0.5625;
upper_front_offset = 0.0938;
upper_back_offset = 0.0937;
upper_top_z = 0.1125;

// Central lower rectangular solid
lower_depth = 0.375;

// Stepped boss parameters
boss_x = 0.1125;
boss_y = 0.46875;
boss_outer_r = 0.1078;
boss_inner_r = 0.0563;
boss_height = 0.0938;

// Upper solid pin parameters
pin_r = 0.0563;
pin_height = 0.1594;

// Derived dimensions
upper_y_start = upper_front_offset;
upper_y_span = plate_width - upper_front_offset - upper_back_offset;
upper_height = upper_top_z - plate_thickness;
lower_z = -lower_depth;

// Model assembly
union() {
    // Base plate with two through holes
    difference() {
        cube([plate_length, plate_width, plate_thickness]);

        translate([hole_center_x, hole1_y, -0.001])
            cylinder(h = plate_thickness + 0.002, r = hole_radius);

        translate([hole_center_x, hole2_y, -0.001])
            cylinder(h = plate_thickness + 0.002, r = hole_radius);
    }

    // Upper central shoulder
    translate([0, upper_y_start, plate_thickness])
        cube([plate_length, upper_y_span, upper_height]);

    // Lower central solid
    translate([0, upper_y_start, lower_z])
        cube([plate_length, upper_y_span, lower_depth]);

    // Annular collar
    translate([boss_x, boss_y, upper_top_z])
        difference() {
            cylinder(h = boss_height, r = boss_outer_r);
            translate([0, 0, -0.001])
                cylinder(h = boss_height + 0.002, r = boss_inner_r);
        }

    // Solid pin on same axis
    translate([boss_x, boss_y, upper_top_z])
        cylinder(h = pin_height, r = pin_r);
}