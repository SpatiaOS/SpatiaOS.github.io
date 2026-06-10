// Parameters
block_length = 0.75;
block_width = 0.714286;
block_height = 0.25;

through_hole_x = 0.375;
through_hole_y = 0.5357;
through_hole_r = 0.0893;

front_cut_r = 0.0491;
front_cut_depth = 0.1071;
front_cut_z_min = 0.0759;
front_cut_z_max = 0.1741;
front_cut_z_center = (front_cut_z_min + front_cut_z_max) / 2;
front_cut1_x = 0.0893;
front_cut2_x = 0.6607;

$fn = 100;

// Main solid block
module main_block() {
    cube([block_length, block_width, block_height]);
}

// Upper through-opening (circular cut along Z axis)
module upper_through_hole() {
    translate([through_hole_x, through_hole_y, -0.01])
        cylinder(h = block_height + 0.02, r = through_hole_r, center = false);
}

// Front side blind circular cuts (aligned along Y axis)
module front_blind_cuts() {
    translate([front_cut1_x, -0.001, front_cut_z_center])
        rotate([90, 0, 0])
        cylinder(h = front_cut_depth + 0.002, r = front_cut_r, center = false);
    translate([front_cut2_x, -0.001, front_cut_z_center])
        rotate([90, 0, 0])
        cylinder(h = front_cut_depth + 0.002, r = front_cut_r, center = false);
}

// Assembly: Subtract features from main block
difference() {
    main_block();
    upper_through_hole();
    front_blind_cuts();
}