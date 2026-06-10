// Parameters
length_rail = 0.748506;
width_rail = 0.024642;
height_rail_lower = 0.018482;
extrusion_depth_lower = 0.0185;

thickness_top = 0.00462;
extrusion_depth_top = 0.0046;

radius_recess = 0.0043;
center_offset_front = 0.0108;
centers_from_left = [0.0138, 0.7346];
recess_band_start = 0.0062;
recess_band_end = 0.0185;
recess_depth = 0.0123;

size_end_block = 0.030803;
height_end_block_lower = 0.018482;
extrusion_depth_end_block = 0.0185;
left_edge_end_block = 0.7192;
right_edge_offset = 0.0015;
front_edge_offset = 0.0361;
back_edge_offset = 0.0299;

radius_recess_end = 0.0043;
center_X_end = 0.7361;
center_Y_end = 0.0192;

size_cutout = 0.027722;
cutout_start_z = 0.0185;
cutout_end_z = -0.0585;
total_cutout_depth = 0.077;

$fn = 100;

// Helper module for cylindrical recess
module cylindrical_recess(radius, center_xy, band_start, band_end, depth) {
    translate([center_xy[0], center_xy[1], band_start])
        cylinder(h = band_end - band_start, r = radius);
}

// Main rail with top layer
module main_rail() {
    // Lower body
    translate([0, 0, 0])
        cube([length_rail, width_rail, height_rail_lower]);
    
    // Top layer
    translate([0, 0, height_rail_lower])
        cube([length_rail, width_rail, thickness_top]);
}

// End block with top layer
module end_block() {
    // Calculate end block position
    x_pos = left_edge_end_block;
    y_pos = -front_edge_offset;
    z_pos = 0;
    
    // Lower body
    translate([x_pos, y_pos, z_pos])
        cube([size_end_block, size_end_block, height_end_block_lower]);
    
    // Top layer
    translate([x_pos, y_pos, height_end_block_lower])
        cube([size_end_block, size_end_block, thickness_top]);
}

// Final model
difference() {
    // Combine main rail and end block
    union() {
        main_rail();
        end_block();
    }
    
    // Cut recesses in main rail
    for (center_x = centers_from_left) {
        cylindrical_recess(
            radius_recess,
            [center_x, center_offset_front],
            recess_band_start,
            recess_band_end,
            recess_depth
        );
    }
    
    // Cut recess in end block
    translate([center_X_end, -center_Y_end, 0])
        cylindrical_recess(
            radius_recess_end,
            [0, 0],
            recess_band_start,
            recess_band_end,
            recess_depth
        );
    
    // Cut rectangular cutout in end block
    translate([left_edge_end_block, -front_edge_offset, cutout_end_z])
        cube([size_cutout, size_cutout, total_cutout_depth]);
}