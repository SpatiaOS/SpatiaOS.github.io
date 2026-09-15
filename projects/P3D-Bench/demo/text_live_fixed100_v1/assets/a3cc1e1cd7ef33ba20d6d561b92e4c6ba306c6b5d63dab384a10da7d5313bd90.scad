// ============================================================
// Parametric plate with central opening, underside collar,
// and tall rounded end tabs with through holes
// ============================================================

// --- Parameters ---
plate_length   = 120;   // overall length of plate (X)
plate_width    = 50;    // width of plate (Y)
plate_thick    = 6;     // plate thickness
center_hole_d  = 20;    // central through opening diameter

collar_od      = 34;    // collar outer diameter
collar_thick   = 4;     // collar height (shallow lower tier)

tab_d          = 24;    // tab diameter (rounded tab)
tab_height     = 30;    // total tab height above plate top
tab_hole_d     = 8;     // through hole in each tab

$fn = 100;

// Center of each tab: ends of the arc-based outline
tab_y_offset = (plate_length - tab_d) / 2;

// ------------------------------------------------------------
// Arc-based plate outline: rectangle capped by semicircular
// ends, extruded as the base slab (centered in X/Y)
// ------------------------------------------------------------
module base_plate() {
    linear_extrude(height = plate_thick)
        hull() {
            translate([-tab_y_offset, 0]) circle(d = plate_width);
            translate([ tab_y_offset, 0]) circle(d = plate_width);
        }
}

// ------------------------------------------------------------
// Central through opening
// ------------------------------------------------------------
module center_hole() {
    cylinder(h = plate_thick + 10, d = center_hole_d, center = true);
}

// ------------------------------------------------------------
// Shallow annular collar on the underside around the opening.
// Hollow ring: outer tube minus inner bore.
// ------------------------------------------------------------
module collar() {
    difference() {
        cylinder(h = collar_thick, d = collar_od, center = false);
        cylinder(h = collar_thick + 2, d = center_hole_d, center = true);
    }
}

// ------------------------------------------------------------
// Tall rounded tab with a through hole through its thickness
// ------------------------------------------------------------
module tab() {
    difference() {
        cylinder(h = tab_height, d = tab_d);           // solid rounded post
        translate([0, 0, tab_height * 0.55])
            rotate([90, 0, 0])                          // horizontal hole
                cylinder(h = tab_d + 10, d = tab_hole_d, center = true);
    }
}

// ============================================================
// Main assembly
// ============================================================
difference() {
    union() {
        // Base plate with collar below it
        base_plate();
        translate([0, 0, -collar_thick]) collar();

        // Tabs rising from upper side at both plate ends
        translate([-tab_y_offset, 0, plate_thick]) tab();
        translate([ tab_y_offset, 0, plate_thick]) tab();
    }
    // Central through opening cuts plate and anything crossing it
    center_hole();
}