// Parametric design for base with features

// --- Base dimensions ---
base_length   = 0.5;
base_width    = 0.4375;
base_height   = 0.09375;   // thickness of main rectangular base

// --- Base circular void ---
hole_radius   = 0.0938;
hole_center_x = 0.25;
hole_center_y = 0.1875;

// --- Underside solid strip (back edge, below base) ---
strip_width   = 0.0625;
strip_y_min   = 0.375;          // front offset 0.375 from y=0
strip_y_max   = strip_y_min + strip_width; // back offset 0 (flush with base back edge)
strip_z_bot1  = -0.25;          // extends 0.25 below base underside
strip_z_top1  = 0;              // starts at base underside

// --- Other back-edge solid (extends both above and below base) ---
strip_z_bot2  = -0.5;
strip_z_top2  = 0.25;
hole2_radius  = 0.05;
hole2_center_x = 0.125;
hole2_center_y = 0.4375;        // back edge (y = base_width)

// --- Annular collar on top of base ---
collar_outer_r = 0.0938;
collar_inner_r = 0.05;
collar_height  = 0.0625;
collar_center_x = 0.2501;
collar_center_y = 0.1876;
collar_z_base = base_height;    // top surface of base

// Resolution
$fn = 80;  // smooth curves

// ---------- modules ----------

module base_plate() {
    difference() {
        // main rectangular base
        cube([base_length, base_width, base_height], center=false);
        // through hole
        translate([hole_center_x, hole_center_y, -1])
            cylinder(h = base_height + 2, r = hole_radius);
    }
}

module underside_strip() {
    // solid strip along back edge, below the base
    translate([0, strip_y_min, strip_z_bot1])
        cube([base_length, strip_width, strip_z_top1 - strip_z_bot1]);
}

module back_strip_with_hole() {
    difference() {
        // solid strip extending from -0.5 below to 0.25 above
        translate([0, strip_y_min, strip_z_bot2])
            cube([base_length, strip_width, strip_z_top2 - strip_z_bot2]);
        // circular void at given position through full height of strip
        translate([hole2_center_x, hole2_center_y, strip_z_bot2 - 0.01])
            cylinder(h = strip_z_top2 - strip_z_bot2 + 0.02, r = hole2_radius);
    }
}

module annular_collar() {
    // ring on top of base around the main hole
    difference() {
        translate([collar_center_x, collar_center_y, collar_z_base])
            cylinder(h = collar_height, r = collar_outer_r);
        translate([collar_center_x, collar_center_y, collar_z_base - 0.01])
            cylinder(h = collar_height + 0.02, r = collar_inner_r);
    }
}

// ---------- assembly ----------
union() {
    base_plate();
    underside_strip();
    back_strip_with_hole();
    annular_collar();
}