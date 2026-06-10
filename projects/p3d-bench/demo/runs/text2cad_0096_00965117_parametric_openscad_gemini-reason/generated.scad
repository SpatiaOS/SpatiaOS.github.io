// Resolution for curved surfaces
$fn = 100;

// --- Parameters ---

// Base plate dimensions
plate_length = 0.225;
plate_width = 0.75;
plate_thickness = 0.0375;

// Through hole dimensions and positions
hole_radius = 0.0281;
hole_left_offset = 0.1125;
hole_front_offset_1 = 0.0375;
hole_front_offset_2 = 0.7125;

// Central rectangular solid dimensions
rect_length = 0.225;
rect_width = 0.5625;
rect_front_offset = 0.0938;
rect_upper_height = 0.1125;
rect_lower_depth = 0.375;

// Annular collar (stepped boss) dimensions
boss_radius_outer = 0.1078;
boss_radius_inner = 0.0563;
boss_height = 0.0938;
boss_x_offset = 0.1125;
boss_y_offset = 0.4687;

// Solid circular pin dimensions
pin_radius = 0.0563;
pin_height = 0.1594;
pin_x_offset = 0.1126;
pin_y_offset = 0.4688;

// --- Geometry ---

union() {
    // Main base plate with separate through holes near ends
    difference() {
        cube([plate_length, plate_width, plate_thickness]);

        // Front through hole
        translate([hole_left_offset, hole_front_offset_1, -0.01])
            cylinder(h = plate_thickness + 0.02, r = hole_radius);

        // Back through hole
        translate([hole_left_offset, hole_front_offset_2, -0.01])
            cylinder(h = plate_thickness + 0.02, r = hole_radius);
    }

    // Central upper rectangular solid
    translate([0, rect_front_offset, 0])
        cube([rect_length, rect_width, rect_upper_height]);

    // Central underside rectangular solid
    translate([0, rect_front_offset, -rect_lower_depth])
        cube([rect_length, rect_width, rect_lower_depth]);

    // Round stepped boss (hollow annular collar)
    translate([boss_x_offset, boss_y_offset, rect_upper_height])
        difference() {
            cylinder(h = boss_height, r = boss_radius_outer);
            // Inner cutout to make it an annular ring
            translate([0, 0, -0.01])
                cylinder(h = boss_height + 0.02, r = boss_radius_inner);
        }

    // Upper solid circular pin
    translate([pin_x_offset, pin_y_offset, rect_upper_height])
        cylinder(h = pin_height, r = pin_radius);
}