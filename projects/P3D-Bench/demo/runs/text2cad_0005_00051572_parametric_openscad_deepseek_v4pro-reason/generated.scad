// Base and channel microfluidic device
// Dimensions in inches

// Base plate
base_length = 0.75;
base_width  = 0.375;
base_height = 0.0375;   // main extrusion depth

// Raised wall dimensions (thicknesses inferred from offset data)
wall_left_thick   = 0.0319;
wall_right_thick  = 0.0319;
wall_front_thick  = 0.0281;
wall_back_thick   = 0.0375;
raised_height     = 0.0937;   // from base top (0.0375) to 0.1312

// Narrow solid at left end
narrow_len   = 0.0319;
narrow_wid   = 0.3094;
narrow_ht    = 0.05625;   // starts 0.0375, ends 0.0937
narrow_y     = 0.0281;    // front offset

// Annular posts parameters
post_x        = [0.15, 0.3, 0.45, 0.6];
post_y        = 0.1875;                    // centered width, front offset 0.1875
post_z_base   = 0.0375;
post_h        = 0.0937;
outer_r       = [0.0469, 0.0469, 0.0562, 0.0562];
inner_r       = [0.0188, 0.0197, 0.0216, 0.0234];

$fn = 100;  // smooth cylinders

// Module for a single annular post
module annular_post(outer, inner) {
    difference() {
        cylinder(h = post_h, r = outer, center = false);
        cylinder(h = post_h, r = inner, center = false);
    }
}

// Main assembly
union() {
    // 1. Rectangular base
    cube([base_length, base_width, base_height]);

    // 2. Raised upper material with open channel interior
    difference() {
        // Full block on top of base
        translate([0, 0, base_height])
            cube([base_length, base_width, raised_height]);
        // Subtract interior cavity, leaving walls
        translate([wall_left_thick, wall_front_thick, base_height])
            cube([base_length - wall_left_thick - wall_right_thick,
                  base_width  - wall_front_thick - wall_back_thick,
                  raised_height + 0.01]);  // extra to ensure clean subtraction
    }

    // 3. Narrow rectangular solid on left end
    translate([0, narrow_y, base_height])
        cube([narrow_len, narrow_wid, narrow_ht]);

    // 4. Four separate annular cylindrical posts
    for (i = [0 : 3]) {
        translate([post_x[i], post_y, post_z_base])
            annular_post(outer_r[i], inner_r[i]);
    }
}