// === Parameters ===

// Main plate
plate_length   = 0.225;    // X dimension
plate_width    = 0.75;     // Y dimension
plate_thick    = 0.0375;   // Z dimension (base at Z=0, top at Z=0.0375)

// Through holes (two, near each end of width)
hole_radius    = 0.0281;
hole_x         = 0.1125;   // centered in X
hole_y1        = 0.0375;   // near front end
hole_y2        = 0.7125;   // near back end

// Central upper rectangular block
upper_block_length  = 0.225;
upper_block_width   = 0.5625;
upper_block_y_off   = 0.0938;   // front offset from Y=0
upper_block_top_z   = 0.1125;   // top reach from base datum
upper_block_height  = upper_block_top_z - plate_thick; // 0.075

// Central underside rectangular block
lower_block_length  = 0.225;
lower_block_width   = 0.5625;
lower_block_y_off   = 0.0938;
lower_block_depth   = 0.375;    // extends downward from Z=0

// Stepped boss — annular collar (hollow ring)
boss_x              = 0.1125;
boss_y              = 0.4687;
collar_outer_r      = 0.1078;
collar_inner_r      = 0.0563;
collar_base_z       = upper_block_top_z;          // 0.1125 (shoulder)
collar_top_z        = 0.2063;
collar_height       = collar_top_z - collar_base_z; // 0.0938

// Stepped boss — upper solid pin
pin_x               = 0.1126;
pin_y               = 0.4688;
pin_radius          = 0.0563;
pin_top_z           = 0.2719;
pin_height          = pin_top_z - collar_base_z;    // 0.1594

// Resolution
$fn = 100;

// === Modules ===

// Main plate with two through holes
module main_plate() {
    difference() {
        // Base plate sitting on Z=0
        cube([plate_length, plate_width, plate_thick]);

        // Hole near front end
        translate([hole_x, hole_y1, -0.01])
            cylinder(h = plate_thick + 0.02, r = hole_radius);

        // Hole near back end
        translate([hole_x, hole_y2, -0.01])
            cylinder(h = plate_thick + 0.02, r = hole_radius);
    }
}

// Central upper rectangular solid above the plate
module upper_block() {
    translate([0, upper_block_y_off, plate_thick])
        cube([upper_block_length, upper_block_width, upper_block_height]);
}

// Central underside rectangular solid below the plate
module lower_block() {
    translate([0, lower_block_y_off, -lower_block_depth])
        cube([lower_block_length, lower_block_width, lower_block_depth]);
}

// Annular collar — hollow ring on the shoulder
module annular_collar() {
    translate([boss_x, boss_y, collar_base_z])
        difference() {
            cylinder(h = collar_height, r = collar_outer_r);
            translate([0, 0, -0.01])
                cylinder(h = collar_height + 0.02, r = collar_inner_r);
        }
}

// Solid upper pin on the same axis
module solid_pin() {
    translate([pin_x, pin_y, collar_base_z])
        cylinder(h = pin_height, r = pin_radius);
}

// === Assembly ===
union() {
    main_plate();
    upper_block();
    lower_block();
    annular_collar();
    solid_pin();
}