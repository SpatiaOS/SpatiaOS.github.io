// Parameters
base_len = 0.75;
base_wid = 0.5;
base_hgt = 0.125;
base_corner_r = 0.05;

hole_x = 0.375;
hole_y = 0.25;
hole_r = 0.125;

collar_outer_r = 0.2125;
collar_inner_r = 0.125;
collar_hgt = 0.0375;

tab_len = 0.125;
tab_wid = 0.375;
tab_offset_y = 0.0625;
tab_total_hgt = 0.5875;
tab_hgt = tab_total_hgt - base_hgt;
tab_top_r = tab_len / 2;
tab_hole_r = 0.0937;

// Resolution control
$fn = 100;

// Base Plate: Arc-edged footprint maintaining exact dimensions
module base_plate() {
    linear_extrude(height = base_hgt) {
        offset(r = base_corner_r) {
            square([base_len - 2 * base_corner_r, base_wid - 2 * base_corner_r], center = false);
        }
    }
}

// Underside Annular Collar: Hollow ring below base datum
module underside_collar() {
    difference() {
        cylinder(h = collar_hgt, r = collar_outer_r);
        translate([0, 0, -0.001]) cylinder(h = collar_hgt + 0.002, r = collar_inner_r);
    }
}

// Upright Tab: Slot-like elevation with rounded top
module upright_tab() {
    union() {
        // Rectangular lower section
        cube([tab_len, tab_wid, tab_hgt - tab_top_r]);
        // Half-cylinder upper section for rounded profile
        translate([tab_len / 2, tab_wid / 2, tab_hgt - tab_top_r])
            rotate([90, 0, 0])
                cylinder(h = tab_wid, r = tab_top_r, center = true);
    }
}

// Tab Assembly with Through Hole
module tab_assembly(x_start, x_hole) {
    translate([x_start, tab_offset_y, base_hgt]) {
        difference() {
            upright_tab();
            translate([x_hole - x_start, tab_wid / 2, -0.1])
                cylinder(h = tab_total_hgt + 0.2, r = tab_hole_r);
        }
    }
}

// Main Model Assembly
difference() {
    union() {
        base_plate();
        translate([hole_x, hole_y, -collar_hgt]) underside_collar();
        tab_assembly(0, 0);          // Left tab
        tab_assembly(0.625, 0.75);   // Right tab
    }
    // Central circular through void
    translate([hole_x, hole_y, -collar_hgt - 0.1])
        cylinder(h = base_hgt + collar_hgt + 0.2, r = hole_r);
}