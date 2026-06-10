// Parameters
$fn = 96;
eps = 0.0001;

// Base plate
base_length = 0.703125;
base_width = 0.75;
base_height_nominal = 0.013125;
base_height = 0.0131;

base_hole_x = 0.075;
base_hole_y = 0.6562;
base_hole_r = 0.0328;

// Main block
block_length = 0.646875;
block_width = 0.50625;
block_height = 0.645;
block_left_offset = 0.0563;
block_right_offset = -0.0001;
block_front_offset = 0.0844;
block_back_offset = 0.1594;

block_z0 = base_height;
block_top_z = base_height + block_height;

// Top collars
collar_outer_r = 0.0656;
collar_inner_r = 0.0328;
collar_height = 0.0375;
collar_x = 0.2062;
collar_y_positions = [0.1968, 0.4781];

// Collar/top-band openings
top_hole_r = 0.0328;
top_hole_x = 0.2062;
top_hole_y_positions = [0.1969, 0.4781];

// Blind rectangular recesses
recess_span_length = 0.473437;
recess_span_width = 0.39375;
recess_left_offset = 0.1734;
recess_right_offset = 0.0563;
recess_front_offset = 0.1406;
recess_back_offset = 0.2157;
recess_depth = 0.0037;
recess_bottom_z = 0.6544;
recess_top_z = block_top_z;
recess_slot_width = 0.1125;
recess_y_positions = [
    recess_front_offset,
    recess_front_offset + recess_span_width - recess_slot_width
];

// Helpers
module box_at(x, y, z, sx, sy, sz) {
    translate([x, y, z])
        cube([sx, sy, sz], center=false);
}

module z_cylinder_at(x, y, z0, z1, r) {
    translate([x, y, z0])
        cylinder(h=z1 - z0, r=r, center=false);
}

// Solid base
module base_plate() {
    box_at(0, 0, 0, base_length, base_width, base_height);
}

// Solid rectangular block
module main_block() {
    box_at(
        block_left_offset,
        block_front_offset,
        block_z0,
        block_length,
        block_width,
        block_height
    );
}

// Solid collar cylinders
module collar_solids() {
    for (y = collar_y_positions)
        z_cylinder_at(collar_x, y, block_top_z, block_top_z + collar_height, collar_outer_r);
}

// Base through-opening cutter
module base_hole_cut() {
    z_cylinder_at(base_hole_x, base_hole_y, -eps, base_height + eps, base_hole_r);
}

// Blind recess cutters
module recess_cuts() {
    for (y = recess_y_positions)
        box_at(
            recess_left_offset,
            y,
            recess_bottom_z,
            recess_span_length,
            recess_slot_width,
            recess_top_z - recess_bottom_z + eps
        );
}

// Collar center and shallow top-band cutters
module top_hole_cuts() {
    for (y = top_hole_y_positions)
        z_cylinder_at(
            top_hole_x,
            y,
            recess_bottom_z,
            block_top_z + collar_height + eps,
            top_hole_r
        );
}

// Main model
difference() {
    union() {
        base_plate();
        main_block();
        collar_solids();
    }

    // Base plate through-opening
    base_hole_cut();

    // Two separate blind top recesses
    recess_cuts();

    // Collar center openings through collar and shallow top band only
    top_hole_cuts();
}