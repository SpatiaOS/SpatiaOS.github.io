// === Parameters ===

// Plate (shallow base with arc/stadium outline)
plate_length     = 120;    // total length along X
plate_width      = 40;     // total width along Y
plate_thickness  = 6;      // shallow plate height (Z)
arc_radius       = 20;     // end-arc radius (= plate_width/2 for smooth stadium)

// Central through-hole
center_hole_dia  = 16;

// Underside annular collar (hollow ring below plate around center hole)
collar_outer_dia = 32;
collar_height    = 8;      // extends downward from plate bottom

// End tabs (tall rounded risers on top of plate)
tab_depth        = 22;     // dimension along plate length (X) — the "thickness"
tab_width        = 34;     // dimension along plate width (Y)
tab_height       = 48;     // total height above plate top surface
tab_corner_r     = 6;      // rounding radius on tab edges
tab_hole_dia     = 10;     // through-hole diameter in each tab
tab_hole_z       = 34;     // height of tab hole center above plate top
tab_center_x     = 44;     // X distance from origin to each tab center

$fn = 100;

// === Modules ===

// Stadium / arc-based 2D outline for the plate
module plate_profile() {
    hull() {
        translate([-(plate_length/2 - arc_radius), 0])
            circle(r = arc_radius);
        translate([ (plate_length/2 - arc_radius), 0])
            circle(r = arc_radius);
    }
}

// Shallow base plate with central through-hole
module base_plate() {
    difference() {
        linear_extrude(height = plate_thickness)
            plate_profile();
        // Central through-hole
        translate([0, 0, -0.5])
            cylinder(h = plate_thickness + 1, d = center_hole_dia);
    }
}

// Annular collar on the underside — hollow ring around center hole
module underside_collar() {
    translate([0, 0, -collar_height])
        difference() {
            cylinder(h = collar_height, d = collar_outer_dia);
            translate([0, 0, -0.5])
                cylinder(h = collar_height + 1, d = center_hole_dia);
        }
}

// Single tall rounded tab built from hull of 8 spheres at corners
module rounded_tab(d, w, h, r) {
    // d=depth(X), w=width(Y), h=height(Z), r=corner rounding
    hull() {
        for (sx = [-1, 1])
            for (sy = [-1, 1]) {
                // Bottom corners: small cylinders so base is flat
                translate([sx*(d/2 - r), sy*(w/2 - r), 0])
                    cylinder(r = r, h = 0.01);
                // Top corners: spheres for rounded top edges
                translate([sx*(d/2 - r), sy*(w/2 - r), h - r])
                    sphere(r = r);
            }
    }
}

// Tab with through-hole (hole passes through depth/thickness along X)
module tab_with_hole() {
    difference() {
        rounded_tab(tab_depth, tab_width, tab_height, tab_corner_r);
        // Through-hole along X (through the tab's thickness)
        translate([0, 0, tab_hole_z])
            rotate([0, 90, 0])
                cylinder(h = tab_depth + 2, d = tab_hole_dia, center = true);
    }
}

// === Assembly ===

union() {
    // 1. Shallow arc-based plate (sits on Z=0..plate_thickness)
    base_plate();

    // 2. Underside annular collar (Z = -collar_height .. 0)
    underside_collar();

    // 3. Left end tab (on top of plate)
    translate([-tab_center_x, 0, plate_thickness])
        tab_with_hole();

    // 4. Right end tab (on top of plate)
    translate([ tab_center_x, 0, plate_thickness])
        tab_with_hole();
}