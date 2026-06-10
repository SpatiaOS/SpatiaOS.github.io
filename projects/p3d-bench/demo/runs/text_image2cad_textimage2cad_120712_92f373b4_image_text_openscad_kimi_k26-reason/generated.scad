// Parametric dimensions for the pebble-shaped enclosure assembly
$fn = 100;

// Base cover (lower dome)
base_len        = 304;
base_dep        = 159;
base_h          = 72;
base_rx         = base_len / 2;
base_ry         = base_dep / 2;
base_top_len    = 242;          // mates to cover plate
base_top_dep    = 127;
base_top_rx     = base_top_len / 2;
base_top_ry     = base_top_dep / 2;
base_bulge      = 8;            // hull-sphere z-scale for side curvature

// Cover plate (thin oval disc at the seam)
plate_len       = 242;
plate_dep       = 127;
plate_h         = 6;
plate_rx        = plate_len / 2;
plate_ry        = plate_dep / 2;
plate_rim_r     = 4;            // rim rounding radius

// Housing cover (upper dome with control panel)
housing_len     = 227;
housing_dep     = 120;
housing_h       = 50;
housing_rx      = housing_len / 2;
housing_ry      = housing_dep / 2;
housing_top_len = 140;          // estimated flattened top
housing_top_dep = 76;
housing_top_rx  = housing_top_len / 2;
housing_top_ry  = housing_top_dep / 2;
housing_bulge   = 6;

// Recessed panel details
panel_len       = 80;
panel_dep       = 42;
panel_rx        = panel_len / 2;
panel_ry        = panel_dep / 2;
panel_depth     = 2;

// Control embossments
dot_r           = 1.4;
dot_h           = 0.6;
sym_h           = 0.5;

// ------------------------------------------------------------------
// Helper: smooth oval dome with flat base and flat top deck.
// Uses convex hull of two flattened spheres clipped to the desired height.
// ------------------------------------------------------------------
module oval_dome(rx1, ry1, rx2, ry2, h, bulge) {
    intersection() {
        hull() {
            translate([0, 0, 0])
                scale([rx1, ry1, bulge]) sphere(1);
            translate([0, 0, h])
                scale([rx2, ry2, bulge]) sphere(1);
        }
        translate([0, 0, h/2])
            cube([max(rx1, rx2)*4, max(ry1, ry2)*4, h], center=true);
    }
}

// ------------------------------------------------------------------
// Helper: thin oval disc with rounded B-spline-like rim.
// Intersection of an ellipsoid with a centred slab.
// ------------------------------------------------------------------
module oval_disc(rx, ry, h, rim_r) {
    intersection() {
        scale([rx, ry, rim_r]) sphere(1);
        cube([rx*2 + 1, ry*2 + 1, h], center=true);
    }
}

// ------------------------------------------------------------------
// Main assembly
// ------------------------------------------------------------------
union() {
    // ---- Base cover ------------------------------------------------
    oval_dome(base_rx, base_ry, base_top_rx, base_top_ry, base_h, base_bulge);

    // Small locating boss on top deck (short to avoid interference)
    translate([0, 0, base_h])
        cylinder(h=1.5, r=6);

    // Brand text embossed on front face
    translate([0, base_ry - (base_ry - base_top_ry)*0.35, base_h*0.55])
        rotate([90, 0, 0])
        linear_extrude(0.8)
        text("harman/kardon", size=5, halign="center", valign="center");

    // ---- Cover plate -----------------------------------------------
    translate([0, 0, base_h + plate_h/2])
        oval_disc(plate_rx, plate_ry, plate_h, plate_rim_r);

    // ---- Housing cover ---------------------------------------------
    translate([0, 0, base_h + plate_h])
    difference() {
        oval_dome(housing_rx, housing_ry, housing_top_rx, housing_top_ry, housing_h, housing_bulge);

        // Oval recessed panel on top surface
        translate([0, 0, housing_h - panel_depth])
            scale([panel_rx, panel_ry, 1])
            cylinder(h=panel_depth + 0.1, r=1);
    }

    // ---- Panel embossments (dots & symbols) ------------------------
    translate([0, 0, base_h + plate_h + housing_h - panel_depth])
    union() {
        // Five small circular dots in a quincunx / cross layout
        for (p = [[0, 0], [0, 10], [0, -10], [12, 0], [-12, 0]]) {
            translate([p[0], p[1], 0])
                cylinder(h=dot_h, r=dot_r);
        }

        // Symbols arranged in a cross pattern on the panel floor
        // Minus (left)
        translate([-18, 0, sym_h/2])
            cube([5.5, 1.2, sym_h], center=true);

        // Plus (right)
        translate([18, 0, sym_h/2]) {
            cube([5.5, 1.2, sym_h], center=true);
            cube([1.2, 5.5, sym_h], center=true);
        }

        // X (top)
        translate([0, 15, sym_h/2]) {
            rotate(45) cube([5, 1.2, sym_h], center=true);
            rotate(-45) cube([5, 1.2, sym_h], center=true);
        }

        // Power symbol approximation (bottom) – ring with vertical line
        translate([0, -15, 0]) {
            difference() {
                cylinder(h=sym_h, r=2.3);
                translate([0, 0, -0.05]) cylinder(h=sym_h + 0.1, r=1.3);
                translate([0, -2.3, -0.05]) cube([4.6, 2.3, sym_h + 0.1], center=true);
            }
            translate([0, 2.2, 0]) cube([1, 2.2, sym_h], center=true);
        }
    }
}