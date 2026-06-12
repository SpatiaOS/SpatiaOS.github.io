// Parameters
$fn = 64;
eps = 0.05;

// Main body
body_length = 90;
body_width = 60;
body_height = 30;

// Top stepped cavity
rim_thickness = 4;
upper_recess_length = body_length - 2 * rim_thickness;
upper_recess_width = body_width - 2 * rim_thickness;
upper_recess_depth = 6;

middle_recess_length = 62;
middle_recess_width = 36;
middle_recess_depth = 15;

deep_recess_length = 36;
deep_recess_width = 22;
deep_recess_depth = 24;
deep_recess_offset_x = 9;
deep_recess_offset_y = -4;

// Side projection
projection_length = 44;
projection_depth = 14;
projection_height = 8;
projection_offset_x = 0;
projection_side = 1; // +Y side

// Side recess above projection
side_recess_length = projection_length;
side_recess_depth = 14;
side_recess_bottom_z = projection_height;
side_recess_height = 14;
side_recess_offset_x = projection_offset_x;

// Helpers
function top_cut_z(depth) = body_height - depth / 2 + eps / 2;

// Base rectangular body
module main_body() {
    translate([0, 0, body_height / 2])
        cube([body_length, body_width, body_height], center=true);
}

// Added side projection
module side_projection() {
    translate([
        projection_offset_x,
        projection_side * (body_width / 2 + projection_depth / 2 - eps / 2),
        projection_height / 2
    ])
        cube([projection_length, projection_depth + eps, projection_height], center=true);
}

// Rectangular cut made downward from the top
module top_rect_cut(length, width, depth, offset_x=0, offset_y=0) {
    translate([offset_x, offset_y, top_cut_z(depth)])
        cube([length, width, depth + eps], center=true);
}

// Rectangular side recess cut above the projection
module side_recess_cut() {
    translate([
        side_recess_offset_x,
        projection_side * (body_width / 2 - side_recess_depth / 2 + eps / 2),
        side_recess_bottom_z + side_recess_height / 2
    ])
        cube([side_recess_length, side_recess_depth + eps, side_recess_height], center=true);
}

// Solid blank before cuts
module solid_blank() {
    union() {
        main_body();
        side_projection();
    }
}

// Nested stepped cavity cuts
module stepped_cavity_cuts() {
    top_rect_cut(upper_recess_length, upper_recess_width, upper_recess_depth);
    top_rect_cut(middle_recess_length, middle_recess_width, middle_recess_depth);
    top_rect_cut(
        deep_recess_length,
        deep_recess_width,
        deep_recess_depth,
        deep_recess_offset_x,
        deep_recess_offset_y
    );
}

// Final model
difference() {
    solid_blank();

    // Top nested stepped cavity
    stepped_cavity_cuts();

    // Side recess tier above projection
    side_recess_cut();
}