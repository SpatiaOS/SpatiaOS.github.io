// === Parametric Dimensions ===
plate_length = 80;          // Total length of arc-based plate outline
plate_width = 30;           // Width of the plate
plate_thickness = 5;        // Base plate thickness
central_hole_dia = 10;      // Diameter of central through opening
collar_outer_dia = 20;      // Outer diameter of underside annular collar
collar_height = 3;          // Height of underside collar (shallow tier)
tab_height = 30;            // Height of each tab above plate top (tall tier)
tab_width = 20;             // Width of each tab across plate
tab_depth = 12;             // Thickness of each tab along plate length
tab_hole_dia = 6;           // Through hole diameter in each tab
fillet_r = 3;               // Corner fillet radius on tabs
$fn = 80;

// Derived: half-length of straight portion of stadium shape
straight_half = (plate_length - plate_width) / 2;

// --- Stadium (arc-based) 2D profile ---
module stadium_profile() {
    hull() {
        translate([-straight_half, 0, 0])
            circle(d = plate_width);
        translate([straight_half, 0, 0])
            circle(d = plate_width);
    }
}

// --- Base plate with central through opening ---
module base_plate() {
    difference() {
        // Solid shallow plate with arc-based outline
        linear_extrude(height = plate_thickness)
            stadium_profile();
        // Real through opening at center
        translate([0, 0, -1])
            cylinder(h = plate_thickness + 2, d = central_hole_dia);
    }
}

// --- Hollow annular collar on underside around central opening ---
module underside_collar() {
    translate([0, 0, -collar_height])
        difference() {
            // Outer ring wall
            cylinder(h = collar_height, d = collar_outer_dia);
            // Hollow center — makes it a ring, not a filled disk
            translate([0, 0, -0.5])
                cylinder(h = collar_height + 1, d = central_hole_dia);
        }
}

// --- Tall solid rounded tab rising from upper side ---
module rounded_tab(x_pos) {
    // Position tab bottom flush with plate top, then center vertically for minkowski
    translate([x_pos, 0, plate_thickness + tab_height / 2])
        difference() {
            // Fully rounded rectangular solid via Minkowski sum
            minkowski() {
                cube([
                    tab_depth - 2 * fillet_r,
                    tab_width - 2 * fillet_r,
                    tab_height - 2 * fillet_r
                ], center = true);
                sphere(r = fillet_r);
            }
            // Through opening passing through tab thickness (X direction)
            rotate([0, 90, 0])
                cylinder(h = tab_depth + 2, d = tab_hole_dia, center = true);
        }
}

// === Final Assembly (stepped-depth: tabs >> plate >> collar) ===
union() {
    base_plate();
    underside_collar();
    rounded_tab(-straight_half);   // Left end tab
    rounded_tab(straight_half);    // Right end tab
}