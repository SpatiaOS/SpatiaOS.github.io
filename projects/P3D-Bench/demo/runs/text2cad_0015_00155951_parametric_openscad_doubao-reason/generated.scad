// ==============================================
// Global Parameters (all dimensions in mm)
// ==============================================
base_len = 0.75;       // Base X-axis length
base_wid = 0.5;        // Base Y-axis width
base_hgt = 0.125;      // Base Z height from datum
base_corner_r = 0.05;  // Radius of base rounded corners

// Central hole parameters
central_hole_r = 0.125;
central_hole_x = 0.375;
central_hole_y = 0.25;

// Underside annular collar parameters
collar_hgt = 0.0375;
collar_outer_r = 0.2125;

// End tab parameters
tab_len = 0.125;
tab_wid = 0.375;
tab_total_z = 0.5875;  // Total tab height from datum
tab_hgt = tab_total_z - base_hgt;
tab_hole_r = 0.0937;
tab_y_offset = 0.0625;
left_tab_hole_x = 0;
right_tab_hole_x = base_len;
tab_hole_y = 0.25;

// Curve resolution
$fn = 100;

// ==============================================
// Reusable Module: Rounded End Tab
// ==============================================
module end_tab(x_pos, y_pos, len, wid, hgt) {
    translate([x_pos, y_pos, base_hgt])
    linear_extrude(height = hgt)
    // Slot-shaped tab footprint with rounded ends
    hull() {
        circle(r = wid/2, center = [0, wid/2]);
        circle(r = wid/2, center = [len, wid/2]);
    }
}

// ==============================================
// Main Model Assembly
// ==============================================
difference() {
    union() {
        // 1. Main base plate with arc-edged corners
        linear_extrude(height = base_hgt)
        offset(r = base_corner_r)
        square([base_len - 2*base_corner_r, base_wid - 2*base_corner_r]);

        // 2. Underside annular collar
        translate([central_hole_x, central_hole_y, -collar_hgt])
        difference() {
            cylinder(h = collar_hgt, r = collar_outer_r);
            cylinder(h = collar_hgt + 0.1, r = central_hole_r);
        }

        // 3. Left end tab
        end_tab(left_tab_hole_x, tab_y_offset, tab_len, tab_wid, tab_hgt);

        // 4. Right end tab
        end_tab(base_len - tab_len, tab_y_offset, tab_len, tab_wid, tab_hgt);
    }

    // Cut all through holes
    // Central through hole (cuts base + collar)
    translate([central_hole_x, central_hole_y, -collar_hgt - 0.1])
    cylinder(h = base_hgt + collar_hgt + 0.2, r = central_hole_r);

    // Left tab through hole
    translate([left_tab_hole_x, tab_hole_y, -0.1])
    cylinder(h = tab_total_z + 0.2, r = tab_hole_r);

    // Right tab through hole
    translate([right_tab_hole_x, tab_hole_y, -0.1])
    cylinder(h = tab_total_z + 0.2, r = tab_hole_r);
}