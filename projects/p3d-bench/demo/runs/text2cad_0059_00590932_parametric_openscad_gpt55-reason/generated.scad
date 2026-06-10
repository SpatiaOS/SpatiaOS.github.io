// Parameters
$fn = 96;
eps = 0.0001;

// Main base dimensions
main_length = 0.165891;
main_width  = 0.325401;
main_height = 0.408347;
main_nominal_top = 0.4083;

// Top square recess
recess_size_x = 0.089326;
recess_size_y = 0.089326;
recess_left_offset = 0.0383;
recess_front_offset = 0.0191;
recess_bottom_z = 0.319;

// Lower rectangular opening
lower_opening_x = 0.076565;
lower_opening_y = 0.132416;
lower_left_offset = 0.0447;
lower_front_offset = -0.0303;
lower_bottom_z = 0;
lower_top_z = 0.319;

// Upper rear step cut
step_front_remaining = 0.2106;
step_back_width = 0.114848;
step_bottom_z = 0.2807;
step_cut_depth = 0.1276;

// Shallow front base section
front_base_length = 0.4339;
front_base_width = 0.1148;
front_base_height = 0.0383;
front_base_left_projection = 0.134;

// Circular openings in shallow section
hole_radius = 0.0255;
hole_front_offset = 0.0574;
hole_x_positions = [-0.069, 0.2349];

// Helper: cube from minimum corner
module box_at(pos, size) {
    translate(pos)
        cube(size, center=false);
}

// Main rectangular base
module main_base() {
    box_at([0, 0, 0], [main_length, main_width, main_height]);
}

// Added shallow front base section
module shallow_front_base() {
    box_at(
        [-front_base_left_projection, 0, 0],
        [front_base_length, front_base_width, front_base_height]
    );
}

// Top square recess cutter
module top_square_recess_cut() {
    box_at(
        [recess_left_offset, recess_front_offset, recess_bottom_z],
        [recess_size_x, recess_size_y, main_height - recess_bottom_z + eps]
    );
}

// Lower rectangular opening cutter
module lower_rectangular_opening_cut() {
    box_at(
        [lower_left_offset, lower_front_offset, lower_bottom_z - eps],
        [lower_opening_x, lower_opening_y, lower_top_z - lower_bottom_z + 2*eps]
    );
}

// Upper rear step cutter
module upper_back_step_cut() {
    box_at(
        [-eps, step_front_remaining, step_bottom_z],
        [main_length + 2*eps, step_back_width + eps, step_cut_depth + 2*eps]
    );
}

// Vertical circular through-hole cutter for front base
module front_base_hole_cut(xpos) {
    translate([xpos, hole_front_offset, -eps])
        cylinder(h=front_base_height + 2*eps, r=hole_radius, center=false);
}

// Final model
difference() {
    union() {
        main_base();
        shallow_front_base();
    }

    // Recess from top face
    top_square_recess_cut();

    // Lower front opening
    lower_rectangular_opening_cut();

    // Rear high-to-low step
    upper_back_step_cut();

    // Through holes in shallow front base
    for (xpos = hole_x_positions)
        front_base_hole_cut(xpos);
}