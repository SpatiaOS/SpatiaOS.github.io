// Parameters
main_outer_radius = 0.375;
main_inner_radius = 0.3375;
main_height = 0.05625;
main_extrusion_depth = 0.0281;
main_center_offset = 0.375;

collar_footprint = 0.15;
collar_offset = 0.3;
collar_height = 0.0468; // 0.0234 * 2

rib_bounding_length = 0.6184;
rib_bounding_width = 0.521;
rib_offset_left = 0.0658;
rib_offset_right = 0.0658;
rib_offset_front = 0.0387;
rib_offset_back = 0.1903;
rib_length = 0.618448;
rib_width = 0.521035;
rib_height = 0.028125;
rib_z_start = -0.0141;
rib_z_end = 0.0141;

$fn = 100;

// Main base annulus
module main_base() {
    translate([main_center_offset, main_center_offset, 0])
    linear_extrude(height = main_extrusion_depth * 2, center = true)
    difference() {
        circle(r = main_outer_radius);
        circle(r = main_inner_radius);
    }
}

// Central collar annulus
module central_collar() {
    translate([main_center_offset, main_center_offset, 0])
    linear_extrude(height = collar_height, center = true)
    difference() {
        square([collar_footprint, collar_footprint], center = true);
        // Inner void - adjust size as needed
        square([collar_footprint * 0.7, collar_footprint * 0.7], center = true);
    }
}

// Rounded radial rib web with slot openings
module rib_web() {
    rib_center_x = rib_offset_left + rib_length / 2;
    rib_center_y = rib_offset_front + rib_width / 2;
    
    translate([rib_center_x, rib_center_y, (rib_z_start + rib_z_end) / 2])
    difference() {
        // Outer bounding shape
        cube([rib_length, rib_width, rib_height], center = true);
        
        // Create slot-like openings using difference
        // Example: two elongated slots
        slot_width = 0.05;
        slot_length = 0.4;
        slot_spacing = 0.15;
        
        for (i = [-1, 1]) {
            translate([0, i * slot_spacing / 2, 0])
            cube([slot_length, slot_width, rib_height + 1], center = true);
        }
    }
}

// Main assembly
union() {
    main_base();
    central_collar();
    rib_web();
}