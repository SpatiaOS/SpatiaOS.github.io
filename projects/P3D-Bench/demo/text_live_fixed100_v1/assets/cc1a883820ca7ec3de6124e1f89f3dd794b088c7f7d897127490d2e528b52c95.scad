// All dimensions are in millimeters
$fn = 64;
eps = 0.01;

// Main body dimensions
body_length = 80;
body_width = 50;
body_height = 30;

// Top stepped cavity parameters
rim_width = 2;
floor_thickness = 5;

// Broad upper recess, leaving a thin top rim
upper_recess_length = body_length - 2 * rim_width;
upper_recess_width = body_width - 2 * rim_width;
upper_recess_depth = 5;

// Second stepped recess
second_recess_length = 56;
second_recess_width = 32;
second_recess_depth = 12;

// Deepest shifted pocket
deep_pocket_length = 36;
deep_pocket_width = 18;
deep_pocket_shift_x = 7;
deep_pocket_depth = body_height - floor_thickness;

// Side projection parameters
projection_length = 10;
projection_width = 26;
projection_height = 10;

// Side recess above the projection
side_recess_depth = 7;
side_recess_width = projection_width;
side_recess_height = 7;
side_recess_z = projection_height + 1;

// Main rectangular body
module body_blank() {
    translate([-body_length / 2, -body_width / 2, 0])
        cube([body_length, body_width, body_height]);
}

// Added rectangular projection on the +X side
module projection_tab() {
    translate([body_length / 2 - eps, -projection_width / 2, 0])
        cube([projection_length + eps, projection_width, projection_height]);
}

// Rectangular pocket cut downward from the top face
module top_rect_pocket(l, w, d, x = 0, y = 0) {
    translate([x - l / 2, y - w / 2, body_height - d])
        cube([l, w, d + eps]);
}

// Recess cut into the +X side above the projection
module side_recess_cut() {
    translate([body_length / 2 - side_recess_depth, -side_recess_width / 2, side_recess_z])
        cube([side_recess_depth + eps, side_recess_width, side_recess_height]);
}

// Final model
difference() {
    // Combine body and side projection
    union() {
        body_blank();
        projection_tab();
    }

    // Step 1: broad upper recess surrounded by thin rim
    top_rect_pocket(upper_recess_length, upper_recess_width, upper_recess_depth);

    // Step 2: smaller centered recess below the upper recess
    top_rect_pocket(second_recess_length, second_recess_width, second_recess_depth);

    // Step 3: deepest pocket, shifted to one side, solid floor remains
    top_rect_pocket(deep_pocket_length, deep_pocket_width, deep_pocket_depth, deep_pocket_shift_x, 0);

    // Step 4: side recess above the projection
    side_recess_cut();
}