// === Parameters ===

// Main base
base_length   = 0.75;
base_width    = 0.364251;
base_height   = 0.080711;
base_end_r    = base_width / 2; // semicircular ends → stadium outline

// Inner slot-like through void (arc-based opening in base)
slot_length   = 0.14;
slot_width    = 0.12;
slot_cx       = 0.375;
slot_cy       = base_width / 2;

// Base circular through hole
bhole_x       = 0.4987;
bhole_y       = 0.1821;
bhole_r       = 0.0396;

// Lower collar cylinder
collar_cx     = 0.1865;
collar_cy     = 0.1821;
collar_r      = 0.1104;
collar_h      = 0.0914;

// Upper post cylinder (coaxial with collar)
post_r        = 0.0563;
post_h        = 0.2893;

// Raised rounded region on right side
raised_x      = 0.2916;
raised_y      = 0.0144;
raised_l      = 0.4584;
raised_w      = 0.3356;
raised_h      = 0.0411;
raised_hole_x = 0.4987;
raised_hole_y = 0.1822;
raised_hole_r = 0.0396;
raised_cr     = 0.020;  // corner rounding

// Rectangular rib / tab on raised region
tab_x         = 0.5673;
tab_y         = 0.1349;
tab_l         = 0.182741;
tab_w         = 0.094416;
tab_h         = 0.0305;

$fn = 120;

// === Helper Modules ===

// 2D stadium (two semicircular ends joined by straight edges)
module stadium_2d(l, w) {
    r = w / 2;
    hull() {
        translate([r, r])     circle(r = r);
        translate([l - r, r]) circle(r = r);
    }
}

// 2D rounded rectangle (four quarter-circle corners)
module rrect_2d(l, w, r) {
    hull() {
        translate([r, r])         circle(r = r);
        translate([l - r, r])     circle(r = r);
        translate([r, w - r])     circle(r = r);
        translate([l - r, w - r]) circle(r = r);
    }
}

// === Assembly ===
eps = 0.001; // boolean clearance

union() {

    // --- 1. Main base plate (stadium outline, with slot void and through hole) ---
    difference() {
        linear_extrude(height = base_height)
            stadium_2d(base_length, base_width);

        // Inner slot-like through void
        translate([slot_cx - slot_length/2,
                   slot_cy - slot_width/2,
                   -eps])
            linear_extrude(height = base_height + 2*eps)
                stadium_2d(slot_length, slot_width);

        // Circular through hole in base
        translate([bhole_x, bhole_y, -eps])
            cylinder(r = bhole_r, h = base_height + 2*eps);
    }

    // --- 2. Coaxial round stepped stack (added material) ---
    // Lower collar
    translate([collar_cx, collar_cy, base_height])
        cylinder(r = collar_r, h = collar_h);

    // Upper solid post
    translate([collar_cx, collar_cy, base_height + collar_h])
        cylinder(r = post_r, h = post_h);

    // --- 3. Raised rounded region on right side ---
    difference() {
        translate([0, 0, base_height])
            linear_extrude(height = raised_h)
                intersection() {
                    // Clip to base stadium outline for matching curvature
                    stadium_2d(base_length, base_width);
                    // Rounded-rectangle footprint of the raised pad
                    translate([raised_x, raised_y])
                        rrect_2d(raised_l, raised_w, raised_cr);
                }

        // Through hole in raised region (same axis as base hole)
        translate([raised_hole_x, raised_hole_y, base_height - eps])
            cylinder(r = raised_hole_r, h = raised_h + 2*eps);
    }

    // --- 4. Rectangular rib / tab on top of raised region ---
    translate([tab_x, tab_y, base_height + raised_h])
        cube([tab_l, tab_w, tab_h]);
}