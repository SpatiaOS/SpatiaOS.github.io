// Parameters
base_length       = 0.75;
base_width        = 0.5;
base_height       = 0.125;
base_corner_r     = 0.05;      // corner radius for base plate

central_hole_x    = 0.375;     // from left edge
central_hole_y    = 0.25;      // from front edge
central_hole_r    = 0.125;

collar_outer_r    = 0.2125;
collar_inner_r    = 0.125;
collar_height     = 0.0375;

tab_footprint_x   = 0.125;     // tab width (X)
tab_footprint_y   = 0.375;     // tab length (Y)
tab_top_z         = 0.5875;    // total height from base datum
tab_height        = tab_top_z - base_height;
tab_corner_r      = tab_footprint_x / 2;  // fully rounded ends
tab_hole_r        = 0.0937;

// Right tab global positions
right_tab_x       = 0.625;     // left edge of right tab
right_tab_center_x = right_tab_x + tab_footprint_x/2;  // = 0.6875
right_hole_global_x = 0.75;
right_hole_global_y = 0.25;
right_hole_local_x = right_hole_global_x - right_tab_center_x; // = 0.0625

// Left tab global positions
left_tab_x        = 0;         // left edge of left tab
left_tab_center_x = left_tab_x + tab_footprint_x/2;   // = 0.0625
left_hole_global_x = 0;
left_hole_global_y = 0.25;
left_hole_local_x = left_hole_global_x - left_tab_center_x;   // = -0.0625

$fn = 100;                   // smooth curved surfaces

// Modules

// Rounded rectangular plate (top/bottom faces flat, vertical edges rounded)
module rounded_plate(length, width, height, radius) {
    linear_extrude(height)
        offset(r = radius)
            square([length - 2*radius, width - 2*radius], center = false);
}

// Underside annular collar (hollow ring)
module collar(outer_r, inner_r, h) {
    difference() {
        cylinder(h = h, r = outer_r);
        cylinder(h = h + 0.01, r = inner_r);  // clean inner cut
    }
}

// Vertical slot-shaped tab with a through hole (hole axis vertical)
module slot_tab_with_hole(height, hole_local_x, hole_local_y, hole_r) {
    difference() {
        linear_extrude(height)
            hull() {
                // Two circles at the ends of the slot
                translate([0, -0.125]) circle(r = tab_corner_r);
                translate([0,  0.125]) circle(r = tab_corner_r);
            }
        // Through hole
        translate([hole_local_x, hole_local_y, -0.01])
            cylinder(h = height + 0.02, r = hole_r);
    }
}

// Main model
difference() {
    union() {
        // Base plate
        rounded_plate(base_length, base_width, base_height, base_corner_r);

        // Underside collar (placed below base)
        translate([central_hole_x, central_hole_y, -collar_height])
            collar(collar_outer_r, collar_inner_r, collar_height);

        // Right tab
        translate([right_tab_center_x, 0.25, base_height])
            slot_tab_with_hole(tab_height, right_hole_local_x, 0, tab_hole_r);

        // Left tab
        translate([left_tab_center_x, 0.25, base_height])
            slot_tab_with_hole(tab_height, left_hole_local_x, 0, tab_hole_r);
    }

    // Central through void (goes through base and collar)
    translate([central_hole_x, central_hole_y, -collar_height - 0.01])
        cylinder(h = base_height + collar_height + 0.02, r = central_hole_r);
}