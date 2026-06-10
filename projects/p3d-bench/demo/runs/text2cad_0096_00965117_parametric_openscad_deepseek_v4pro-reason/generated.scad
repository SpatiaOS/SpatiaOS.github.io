// Parametric dimensions
plate_length = 0.225;
plate_width = 0.75;
plate_thickness = 0.0375;

hole_radius = 0.0281;
hole_x = 0.1125;          // centered along length
hole_y1 = 0.0375;
hole_y2 = 0.7125;

upper_block_width = 0.5625;
upper_block_front_off = 0.0938;   // Y start
upper_block_height = 0.1125;      // rises from base datum (z=0)

lower_block_height = 0.375;       // extends downward from base datum
// lower block sits on same footprint, starts at z = -lower_block_height

// Boss dimensions (centroid slightly differing values averaged)
boss_center_x = 0.11255;          // between 0.1125 and 0.1126
boss_center_y = 0.46875;          // between 0.4687 and 0.4688
collar_outer_r = 0.1078;
collar_inner_r = 0.0563;
collar_h = 0.0938;                // above upper block top
pin_r = 0.0563;
pin_h = 0.1594;                   // above upper block top
shoulder_z = upper_block_height;  // top of upper block = 0.1125

// Smoothness
$fn = 100;

// Main model: subtract through holes from union of all bodies
difference() {
    union() {
        // Thin base plate (bottom at z=0)
        translate([0, 0, 0])
            cube([plate_length, plate_width, plate_thickness]);

        // Central upper rectangular solid
        translate([0, upper_block_front_off, 0])
            cube([plate_length, upper_block_width, upper_block_height]);

        // Matching central underside rectangular solid
        translate([0, upper_block_front_off, -lower_block_height])
            cube([plate_length, upper_block_width, lower_block_height]);

        // Stepped boss on upper block:
        //   lower annular collar (hollow ring)
        translate([boss_center_x, boss_center_y, shoulder_z])
            difference() {
                cylinder(r = collar_outer_r, h = collar_h);
                cylinder(r = collar_inner_r, h = collar_h);
            }
        //   upper solid pin (fills inner cavity up to its own height)
        translate([boss_center_x, boss_center_y, shoulder_z])
            cylinder(r = pin_r, h = pin_h);
    }

    // Two separate through holes in the plate
    translate([hole_x, hole_y1, 0])
        cylinder(r = hole_radius, h = plate_thickness);
    translate([hole_x, hole_y2, 0])
        cylinder(r = hole_radius, h = plate_thickness);
}