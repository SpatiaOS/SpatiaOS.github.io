// Parameters
$fn = 96;

part_length = 0.75;
part_width  = 0.714286;
part_height = 0.25;

front_block_depth = 0.357143;
rear_side_inset   = 0.214286;

upper_hole_x = 0.375;
upper_hole_y = 0.5357;
upper_hole_r = 0.0893;

front_cut_x_positions = [0.0893, 0.6607];
front_cut_r     = 0.0491;
front_cut_depth = 0.1071;
front_cut_z_min = 0.0759;
front_cut_z_max = 0.1741;
front_cut_z     = (front_cut_z_min + front_cut_z_max) / 2;

eps = 0.002;

// Stepped line profile in plan view
module stepped_profile_2d() {
    polygon(points=[
        [0, 0],
        [part_length, 0],
        [part_length, front_block_depth],
        [part_length - rear_side_inset, front_block_depth],
        [part_length - rear_side_inset, part_width],
        [rear_side_inset, part_width],
        [rear_side_inset, front_block_depth],
        [0, front_block_depth]
    ]);
}

// Main extruded solid from base datum
module main_block() {
    linear_extrude(height=part_height, convexity=10)
        stepped_profile_2d();
}

// Vertical through-opening
module upper_through_hole() {
    translate([upper_hole_x, upper_hole_y, -eps])
        cylinder(h=part_height + 2*eps, r=upper_hole_r);
}

// Separate blind cylindrical cut from the front face
module front_blind_cut(xpos) {
    translate([xpos, -eps, front_cut_z])
        rotate([-90, 0, 0])
            cylinder(h=front_cut_depth + eps, r=front_cut_r);
}

// Final model
difference() {
    main_block();

    // Upper circular through-opening
    upper_through_hole();

    // Two independent front blind cylindrical removals
    for (xpos = front_cut_x_positions)
        front_blind_cut(xpos);
}