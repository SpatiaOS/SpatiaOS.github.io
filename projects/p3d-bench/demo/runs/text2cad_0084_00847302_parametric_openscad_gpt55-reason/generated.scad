// Parameters
$fn = 32;
eps = 0.001;

// Coordinate system: X left-right, Y front-back, Z up
outer_x = 0.75;
outer_y = 0.625;
outer_z = 0.55;

wall_t = 0.075;

// Front wall cut
front_cut_len = 0.5;
front_cut_side_margin = (outer_x - front_cut_len) / 2; // 0.125
front_cut_depth = 0.075;
front_cut_z0 = 0.25;
front_cut_z1 = 0.45;

// Left side opening
left_open_depth = 0.075;
left_open_right_clearance = outer_x - left_open_depth; // 0.675
left_open_front_margin = 0.2;
left_open_back_margin = 0.2;
left_open_span = outer_y - left_open_front_margin - left_open_back_margin; // 0.225
left_open_z0 = 0;
left_open_z1 = 0.5;

// Internal front ledge
ledge_len = 0.5;
ledge_side_margin = (outer_x - ledge_len) / 2; // 0.125
ledge_width = 0.1;
ledge_thickness = 0.0125;
ledge_overlap = eps;

// Derived inner void
inner_x = outer_x - 2 * wall_t;
inner_y = outer_y - 2 * wall_t;

// Helper
module prism(pos, size) {
    translate(pos)
        cube(size, center=false);
}

// Open-top hollow wall body
module hollow_wall_body() {
    difference() {
        prism([0, 0, 0], [outer_x, outer_y, outer_z]);

        // Rectangular inner void
        prism(
            [wall_t, wall_t, -eps],
            [inner_x, inner_y, outer_z + 2 * eps]
        );
    }
}

// Thin internal front ledge
module front_inside_ledge() {
    prism(
        [ledge_side_margin, wall_t - ledge_overlap, 0],
        [ledge_len, ledge_width + ledge_overlap, ledge_thickness]
    );
}

// Horizontal front wall cut
module front_wall_cut() {
    prism(
        [front_cut_side_margin, -eps, front_cut_z0],
        [front_cut_len, front_cut_depth + 2 * eps, front_cut_z1 - front_cut_z0]
    );
}

// Vertical left side opening
module left_side_opening() {
    prism(
        [-eps, left_open_front_margin, left_open_z0 - eps],
        [left_open_depth + 2 * eps, left_open_span, left_open_z1 - left_open_z0 + eps]
    );
}

// Main model
module enclosure_model() {
    difference() {
        union() {
            hollow_wall_body();
            front_inside_ledge();
        }

        front_wall_cut();
        left_side_opening();
    }
}

enclosure_model();