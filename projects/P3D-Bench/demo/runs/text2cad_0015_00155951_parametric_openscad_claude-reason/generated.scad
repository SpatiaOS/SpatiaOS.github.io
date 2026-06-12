// === Parameters ===

// Base plate dimensions
base_length  = 0.75;
base_width   = 0.5;
base_height  = 0.125;
edge_radius  = 0.02;   // arc rounding for plan-view corners

// Central through-hole
hole_cx = 0.375;       // center x (from left edge)
hole_cy = 0.25;        // center y (from front edge)
hole_r  = 0.125;       // hole radius

// Underside annular collar
collar_depth   = 0.0375;
collar_outer_r = 0.2125;
collar_inner_r = 0.125; // matches hole radius

// Tab parameters (identical for left and right)
tab_thick    = 0.125;   // x-direction thickness
tab_span     = 0.375;   // y-direction width
tab_y_inset  = 0.0625;  // inset from front & back edges
tab_top_z    = 0.5875;  // total height from base datum
tab_rise     = tab_top_z - base_height;       // 0.4625
tab_round_r  = tab_span / 2;                  // 0.1875 semicircle at top

// Tab hole
tab_hole_r = 0.0937;
tab_hole_z = tab_top_z - tab_round_r;         // z-center of rounded top

// Tab x-positions
right_tab_x = base_length - tab_thick;        // 0.625
left_tab_x  = 0;

// Resolution
$fn = 100;
eps = 0.01; // boolean clearance

// === Modules ===

// Base plate with arc-rounded plan-view corners
module base_plate() {
    r = edge_radius;
    hull() {
        for (x = [r, base_length - r])
            for (y = [r, base_width - r])
                translate([x, y, 0])
                    cylinder(r = r, h = base_height);
    }
}

// Underside concentric annular collar (hollow ring)
module underside_collar() {
    translate([hole_cx, hole_cy, -collar_depth])
        difference() {
            cylinder(r = collar_outer_r, h = collar_depth);
            translate([0, 0, -eps])
                cylinder(r = collar_inner_r, h = collar_depth + 2 * eps);
        }
}

// Upright rounded tab — stadium/slot profile in elevation
module rounded_tab(x_pos) {
    translate([x_pos, 0, 0])
        union() {
            // Rectangular lower portion rising from base top
            translate([0, tab_y_inset, base_height])
                cube([tab_thick, tab_span, tab_rise - tab_round_r]);
            // Semicylindrical rounded top cap
            translate([0, hole_cy, tab_hole_z])
                rotate([0, 90, 0])
                    cylinder(r = tab_round_r, h = tab_thick);
        }
}

// Through hole in a tab (axis along x through tab thickness)
module tab_hole(x_pos) {
    translate([x_pos - eps, hole_cy, tab_hole_z])
        rotate([0, 90, 0])
            cylinder(r = tab_hole_r, h = tab_thick + 2 * eps);
}

// Central through void spanning base plate and collar
module central_hole() {
    translate([hole_cx, hole_cy, -collar_depth - eps])
        cylinder(r = hole_r, h = base_height + collar_depth + 2 * eps);
}

// === Main Assembly ===

difference() {
    union() {
        // Solid base plate
        base_plate();
        // Annular collar on underside
        underside_collar();
        // Right-end upright rounded tab
        rounded_tab(right_tab_x);
        // Left-end upright rounded tab
        rounded_tab(left_tab_x);
    }

    // Subtract central through void (continuous through base & collar)
    central_hole();
    // Subtract right tab through-hole
    tab_hole(right_tab_x);
    // Subtract left tab through-hole
    tab_hole(left_tab_x);
}