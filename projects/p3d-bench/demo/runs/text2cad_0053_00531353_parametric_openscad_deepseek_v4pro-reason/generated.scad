// ------------------------------
// Parametric Definitions (units: inches)
// ------------------------------

// Base
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;

// Vertical through-holes in base
hole_radius = 0.05;
hole_x1 = 0.125;          // from left edge
hole_x2 = 0.625;
hole_y = 0.125;           // from front edge (y=0)

// Upright rectangular block
upright_length = 0.35;
upright_width = 0.2;
upright_height = 0.2;     // rise above base top
upright_offset_from_ends = 0.2;
upright_offset_front_back = 0.025;
upright_x = upright_offset_from_ends;
upright_y = upright_offset_front_back;
upright_z = base_thickness;   // bottom at top of base

// Rounded cap (half-cylinder) on top of upright
cap_radius = upright_width / 2;   // 0.1
cap_length = upright_length;

// Horizontal through-hole in upright/cap region
horiz_hole_r = 0.05;
horiz_hole_center_y = 0.125;      // from front edge
horiz_hole_center_z = 0.3;        // midpoint of vertical band 0.25–0.35
horiz_hole_start_x = upright_x;   // left face of upright
horiz_hole_length = 0.444;

// Upper relief (removed material)
relief_length = 0.24;
relief_clearance_ends = 0.255;    // from both base ends
relief_x_start = relief_clearance_ends;
relief_y_start = upright_y;       // 0.025 from front
relief_y_reach = 0.299;
relief_z_start = 0.18;
relief_z_end = 0.45;

$fn = 100;  // smooth circular features

// ------------------------------
// Modules
// ------------------------------

// Obround slab (flat ends + semicircular ends)
module obround(length, width, thick) {
    r = width / 2;
    hull() {
        translate([r, r, 0])
            cylinder(r = r, h = thick);
        translate([length - r, r, 0])
            cylinder(r = r, h = thick);
    }
}

// Half-cylinder along X-axis with flat bottom at Z=0
module half_cylinder(l, r) {
    difference() {
        rotate([0, 90, 0])
            cylinder(r = r, h = l, center = false);
        translate([-0.01, -r, -r])
            cube([l + 0.02, 2 * r, r]);
    }
}

// ------------------------------
// Main Model
// ------------------------------
difference() {
    union() {
        // Base with two through-holes
        difference() {
            obround(base_length, base_width, base_thickness);
            // hole 1
            translate([hole_x1, hole_y, 0])
                cylinder(r = hole_radius, h = base_thickness);
            // hole 2
            translate([hole_x2, hole_y, 0])
                cylinder(r = hole_radius, h = base_thickness);
        }

        // Upright block
        translate([upright_x, upright_y, upright_z])
            cube([upright_length, upright_width, upright_height]);

        // Rounded cap placed on top of upright
        translate([upright_x,
                   upright_y + upright_width / 2,
                   upright_z + upright_height])
            half_cylinder(cap_length, cap_radius);
    }

    // Horizontal circular through-passage
    translate([horiz_hole_start_x, horiz_hole_center_y, horiz_hole_center_z])
        rotate([0, 90, 0])
            cylinder(r = horiz_hole_r, h = horiz_hole_length);

    // Upper relief cut
    translate([relief_x_start, relief_y_start, relief_z_start])
        cube([relief_length, relief_y_reach, relief_z_end - relief_z_start]);
}