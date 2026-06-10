// Parameters
base_length = 0.5;
base_width = 0.4375;
base_height = 0.09375;
extrusion_depth = 0.0938;

// Hole in base
hole1_x = 0.25;
hole1_y = 0.1875;
hole1_radius = 0.0938;

// Back strip 1 (below base)
strip1_length = 0.5;
strip1_width = 0.0625;
strip1_front_offset = 0.375;
strip1_height_below = 0.25;

// Back strip 2 (spanning base underside)
strip2_length = 0.5;
strip2_width = 0.0625;
strip2_front_offset = 0.375;
strip2_height_below = 0.5;
strip2_height_above = 0.25;

// Holes in strip 2
hole2_x = 0.125;
hole2_y = 0.4375;
hole2_radius = 0.05;

// Annular collar on top
collar_x = 0.2501;
collar_y = 0.1876;
collar_outer_radius = 0.0938;
collar_inner_radius = 0.05;
collar_height = 0.0625;

$fn = 100;

// Main base with hole
module base() {
    difference() {
        cube([base_length, base_width, base_height]);
        // Circular void in base
        translate([hole1_x, hole1_y, -0.001])
            cylinder(h = base_height + 0.002, r = hole1_radius, center = false);
    }
}

// Back strip 1 (below base)
module back_strip1() {
    translate([0, base_width - strip1_width, -strip1_height_below])
        cube([strip1_length, strip1_width, strip1_height_below]);
}

// Back strip 2 (spanning base underside)
module back_strip2() {
    difference() {
        translate([0, base_width - strip2_width, -strip2_height_below])
            cube([strip2_length, strip2_width, strip2_height_below + strip2_height_above]);
        // Circular voids in strip 2
        for (x_pos = [0.125, 0.375]) {
            translate([x_pos, hole2_y, -strip2_height_below - 0.001])
                cylinder(h = strip2_height_below + strip2_height_above + 0.002, r = hole2_radius, center = false);
        }
    }
}

// Annular collar on top
module annular_collar() {
    translate([collar_x, collar_y, base_height])
        difference() {
            cylinder(h = collar_height, r = collar_outer_radius, center = false);
            translate([0, 0, -0.001])
                cylinder(h = collar_height + 0.002, r = collar_inner_radius, center = false);
        }
}

// Assemble all parts
union() {
    base();
    back_strip1();
    back_strip2();
    annular_collar();
}