$fn = 100;

// Outer dimensions
outer_width  = 0.75;
outer_depth  = 0.625;
outer_height = 0.55;

// Shell construction parameters
wall_thickness = 0.05;
base_thickness = 0.05;

// Front horizontal cut parameters
front_cut_len   = 0.5;
front_cut_z_min = 0.25;
front_cut_z_max = 0.45;
front_cut_depth = 0.075;

// Left side vertical opening parameters
side_open_depth        = 0.075;
side_open_len          = 0.225;
side_open_z_max        = 0.50;
side_open_front_margin = 0.20;

// Internal front ledge parameters
ledge_len   = 0.5;
ledge_width = 0.10;
ledge_thick = 0.0125;
ledge_z_pos = front_cut_z_max - ledge_thick;

// Main reusable module
module parametric_enclosure() {
    union() {
        // Create open-top hollow shell by subtracting inner void
        difference() {
            // Outer solid footprint
            cube([outer_width, outer_depth, outer_height]);

            // Inner rectangular void
            translate([wall_thickness, wall_thickness, base_thickness])
                cube([
                    outer_width  - 2 * wall_thickness,
                    outer_depth  - 2 * wall_thickness,
                    outer_height - base_thickness
                ]);

            // Remove front horizontal wall cut
            translate([
                (outer_width - front_cut_len) / 2,
                0,
                front_cut_z_min
            ])
            cube([
                front_cut_len,
                front_cut_depth,
                front_cut_z_max - front_cut_z_min
            ]);

            // Remove left side vertical opening
            translate([
                0,
                side_open_front_margin,
                0
            ])
            cube([
                side_open_depth,
                side_open_len,
                side_open_z_max
            ]);
        }

        // Add internal front ledge solid
        translate([
            (outer_width - ledge_len) / 2,
            wall_thickness,
            ledge_z_pos
        ])
        cube([ledge_len, ledge_width, ledge_thick]);
    }
}

// Instantiate model
parametric_enclosure();