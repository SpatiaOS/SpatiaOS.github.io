// Parameters
base_length    = 0.75;
base_width     = 0.5;
base_height    = 0.125;

bore_x         = 0.375;
bore_y         = 0.25;
bore_r         = 0.125;

collar_h       = 0.0375;
collar_or      = 0.2125;

tab_thick      = 0.125;
tab_width      = 0.375;
tab_y_off      = 0.0625;
tab_top_z      = 0.5875;
tab_hole_r     = 0.0937;
tab_hole_z     = tab_top_z - tab_width / 2;

left_tab_x     = 0;
right_tab_x    = base_length - tab_thick;

$fn = 80;
eps = 0.02;

// Arc-edged base plate (full 0.75 x 0.5 footprint)
module base_plate() {
    cube([base_length, base_width, base_height]);
}

// Underside annular collar (hollow ring, not a pad)
module collar() {
    translate([bore_x, bore_y, -collar_h])
        cylinder(h = collar_h + eps, r = collar_or);
}

// Upright rounded / slot-like tab (elevation stadium head)
module rounded_tab(x) {
    hull() {
        translate([x, tab_y_off, 0])
            cube([tab_thick, tab_width, base_height]);
        translate([x, bore_y, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_thick, r = tab_width / 2);
    }
}

// Central through void (base + collar)
module bore_hole() {
    translate([bore_x, bore_y, -collar_h - eps])
        cylinder(h = base_height + collar_h + 2 * eps, r = bore_r);
}

// Coaxial openings through tab thickness
module tab_holes() {
    translate([-eps, bore_y, tab_hole_z])
        rotate([0, 90, 0])
            cylinder(h = base_length + 2 * eps, r = tab_hole_r);
}

// Main model
difference() {
    union() {
        base_plate();
        collar();
        rounded_tab(left_tab_x);
        rounded_tab(right_tab_x);
    }
    bore_hole();
    tab_holes();
}