// Parameters
curve_segments = 96;
$fn = curve_segments;

eps = 0.05;
join_overlap = 0.05;

// Main shallow plate
plate_length = 120;
plate_width = 42;
plate_thickness = 4;

// Central through opening
center_hole_d = 20;

// Underside annular collar
collar_outer_d = 36;
collar_depth = 2.5;

// Raised end tabs
tab_length = 34;
tab_width = 30;
tab_height = 18;
tab_hole_d = 9;
tab_center_offset = (plate_length - plate_width) / 2;

// Z levels
plate_bottom_z = 0;
plate_top_z = plate_thickness;
collar_bottom_z = -collar_depth;
tab_top_z = plate_thickness + tab_height;

// 2D arc-based capsule outline
module capsule_2d(len, wid) {
    hull() {
        translate([-(len - wid) / 2, 0])
            circle(d = wid);
        translate([(len - wid) / 2, 0])
            circle(d = wid);
    }
}

// Shallow base plate
module base_plate() {
    translate([0, 0, plate_bottom_z])
        linear_extrude(height = plate_thickness, convexity = 10)
            capsule_2d(plate_length, plate_width);
}

// Underside collar outer solid; center is cut later
module underside_collar() {
    translate([0, 0, collar_bottom_z])
        cylinder(h = collar_depth + join_overlap, d = collar_outer_d);
}

// Tall rounded tab at either end
module raised_end_tab(side) {
    translate([side * tab_center_offset, 0, plate_top_z - join_overlap])
        linear_extrude(height = tab_height + join_overlap, convexity = 10)
            capsule_2d(tab_length, tab_width);
}

// Central through cut
module center_opening_cut() {
    translate([0, 0, collar_bottom_z - eps])
        cylinder(h = collar_depth + plate_thickness + 2 * eps, d = center_hole_d);
}

// End tab through cut
module tab_opening_cut(side) {
    translate([side * tab_center_offset, 0, plate_bottom_z - eps])
        cylinder(h = tab_top_z - plate_bottom_z + 2 * eps, d = tab_hole_d);
}

// Main model
difference() {
    union() {
        base_plate();
        underside_collar();

        for (side = [-1, 1])
            raised_end_tab(side);
    }

    center_opening_cut();

    for (side = [-1, 1])
        tab_opening_cut(side);
}