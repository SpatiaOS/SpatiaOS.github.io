// Parametric variables for overall dimensions
outer_width = 0.75;
outer_depth = 0.625;
outer_height = 0.55;
wall_thickness = 0.075;

// Front cut parameters
front_cut_width = 0.5;
front_cut_margin = 0.125;
front_cut_z_min = 0.25;
front_cut_z_max = 0.45;
front_cut_depth = 0.075;

// Left cut parameters
left_cut_depth = 0.075;
left_cut_y_span = 0.225;
left_cut_y_margin = 0.2; // Front margin
left_cut_z_max = 0.5;

// Internal ledge parameters
ledge_length = 0.5;
ledge_width = 0.1;
ledge_margin = 0.125;
ledge_thickness = 0.0125;

// Small overlap for robust boolean operations (prevents Z-fighting)
eps = 0.01;

// Module defining the main hollow enclosure with wall cuts
module main_enclosure() {
    difference() {
        // Main solid outer body
        cube([outer_width, outer_depth, outer_height]);

        // Subtract the inner void to create an open-top, open-bottom hollow enclosure
        translate([wall_thickness, wall_thickness, -eps])
            cube([
                outer_width - 2 * wall_thickness,
                outer_depth - 2 * wall_thickness,
                outer_height + 2 * eps
            ]);

        // Remove the horizontal rectangular cut on the front wall
        translate([front_cut_margin, -eps, front_cut_z_min])
            cube([
                front_cut_width,
                front_cut_depth + eps,
                front_cut_z_max - front_cut_z_min
            ]);

        // Remove the vertical rectangular opening on the left side wall
        translate([-eps, left_cut_y_margin, -eps])
            cube([
                left_cut_depth + eps,
                left_cut_y_span,
                left_cut_z_max + eps
            ]);
    }
}

// Module defining the internal shallow ledge
module internal_ledge() {
    // Positioned along the front inside region, sitting at the base datum
    translate([ledge_margin, wall_thickness, 0])
        cube([ledge_length, ledge_width, ledge_thickness]);
}

// Final model construction
union() {
    main_enclosure();
    internal_ledge();
}