// Parametric shallow plate with central opening, underside collar,
// and tall rounded end tabs with through holes.

// --- Plate dimensions ---
plate_length      = 100;   // Overall length of the stadium-shaped plate
plate_width       = 30;    // Width (diameter of the end arcs)
base_height       = 4;     // Thickness of the shallow plate

// --- Central opening ---
central_hole_d    = 12;    // Diameter of the through hole at center

// --- Underside collar ---
collar_outer_d    = 22;    // Outer diameter of the annular collar
collar_height     = 3;     // Height of the shallow lower tier

// --- End tab dimensions ---
tab_depth         = 10;    // How far the tab extends inward from the end
tab_thickness     = 6;     // Blade thickness (hole passes through this)
tab_total_height  = 25;    // Total height of the tab above the plate
tab_top_radius    = 4;     // Radius of the rounded top profile
tab_hole_d        = 4;     // Diameter of the through hole in each tab

// --- Calculated helpers ---
end_cap_offset    = (plate_length - plate_width) / 2;
tab_block_height  = tab_total_height - tab_top_radius;
tab_hole_z        = tab_total_height / 2;   // Centered vertically on the tab

$fn = 100;

// ---------------------------------------------------------
// Main plate body: stadium (lozenge) outline extruded upward
// ---------------------------------------------------------
module plate_body() {
    linear_extrude(height = base_height)
        hull() {
            translate([-end_cap_offset, 0])
                circle(d = plate_width);
            translate([ end_cap_offset, 0])
                circle(d = plate_width);
        }
}

// ---------------------------------------------------------
// Shallow annular collar on the underside, centered on the hole
// ---------------------------------------------------------
module underside_collar() {
    translate([0, 0, -collar_height])
        difference() {
            cylinder(h = collar_height, d = collar_outer_d);
            // Hollow core aligned with the central opening
            translate([0, 0, -0.5])
                cylinder(h = collar_height + 1, d = central_hole_d);
        }
}

// ---------------------------------------------------------
// Single rounded end tab with a through hole along its thickness
// ---------------------------------------------------------
module end_tab() {
    difference() {
        union() {
            // Vertical blade
            cube([tab_depth, tab_thickness, tab_block_height]);
            // Rounded top: half-cylinder running across the thickness (Y)
            translate([tab_depth / 2, tab_thickness / 2, tab_block_height])
                rotate([90, 0, 0])
                    cylinder(h = tab_thickness, r = tab_top_radius, center = true);
        }
        // Through opening drilled along Y (through the tab's thickness)
        translate([tab_depth / 2, tab_thickness / 2, tab_hole_z])
            rotate([90, 0, 0])
                cylinder(h = tab_thickness + 2, d = tab_hole_d, center = true);
    }
}

// ---------------------------------------------------------
// Assembly
// ---------------------------------------------------------
difference() {
    union() {
        // 1. Shallow plate with arc-based (stadium) outline
        plate_body();

        // 2. Shallow hollow collar beneath the plate
        underside_collar();

        // 3. Positive-end tab (flush with the extreme end)
        translate([ plate_length/2 - tab_depth, -tab_thickness/2, base_height])
            end_tab();

        // 4. Negative-end tab (mirrored placement)
        translate([-plate_length/2, -tab_thickness/2, base_height])
            end_tab();
    }

    // 5. Real through opening at the center (cuts plate and collar)
    translate([0, 0, -collar_height - 1])
        cylinder(h = base_height + collar_height + 2, d = central_hole_d);
}