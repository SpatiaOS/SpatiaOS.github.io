// Parametric dimensions
plate_length = 0.225;
plate_width = 0.75;
plate_thickness = 0.0375;

hole_radius = 0.0281;
hole1_x = 0.1125;
hole1_y = 0.0375;
hole2_x = 0.1125;
hole2_y = 0.7125;

upper_rect_length = 0.225;
upper_rect_width = 0.5625;
upper_rect_y_offset = 0.0938;
upper_rect_top_z = 0.1125;

lower_rect_length = 0.225;
lower_rect_width = 0.5625;
lower_rect_y_offset = 0.0938;
lower_rect_depth = 0.375;

annular_outer_r = 0.1078;
annular_inner_r = 0.0563;
annular_cx = 0.1125;
annular_cy = 0.4687;
annular_bottom_z = 0.1125;
annular_top_z = 0.2063;

pin_radius = 0.0563;
pin_cx = 0.1126;
pin_cy = 0.4688;
pin_bottom_z = 0.1125;
pin_top_z = 0.2719;

$fn = 100;

union() {
    // Base plate with two through holes
    difference() {
        cube([plate_length, plate_width, plate_thickness]);
        translate([hole1_x, hole1_y, -0.001])
            cylinder(h=plate_thickness + 0.002, r=hole_radius);
        translate([hole2_x, hole2_y, -0.001])
            cylinder(h=plate_thickness + 0.002, r=hole_radius);
    }

    // Upper central rectangular solid (shoulder)
    translate([0, upper_rect_y_offset, plate_thickness])
        cube([upper_rect_length, upper_rect_width, upper_rect_top_z - plate_thickness]);

    // Lower central rectangular solid (underside)
    translate([0, lower_rect_y_offset, -lower_rect_depth])
        cube([lower_rect_length, lower_rect_width, lower_rect_depth]);

    // Annular boss (hollow ring section)
    translate([annular_cx, annular_cy, annular_bottom_z])
        difference() {
            cylinder(h=annular_top_z - annular_bottom_z, r=annular_outer_r);
            translate([0, 0, -0.001])
                cylinder(h=annular_top_z - annular_bottom_z + 0.002, r=annular_inner_r);
        }

    // Solid circular pin above the shoulder
    translate([pin_cx, pin_cy, pin_bottom_z])
        cylinder(h=pin_top_z - pin_bottom_z, r=pin_radius);
}