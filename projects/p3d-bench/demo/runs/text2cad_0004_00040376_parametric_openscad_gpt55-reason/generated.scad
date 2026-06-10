// Parameters
$fn = 96;

// Reference extents
base_length = 0.750000;
base_width = 0.421875;
base_ref_height = 0.191921;
lower_height = 0.191900;

// Left circular axis and outer profile
left_axis_x = 0.210900;
left_axis_y = 0.210900;
left_outer_radius = 0.210900;

// Right concentric circular group
right_axis_x = 0.609400;
right_axis_y = 0.210900;
right_outer_radius = 0.140600;
right_inner_radius = 0.105500;

// Upper circular continuation
upper_left_offset = 0.000000;
upper_right_offset = 0.328200;
upper_front_offset = 0.000000;
upper_back_offset = 0.000000;
upper_footprint_length = base_length - upper_left_offset - upper_right_offset;
upper_footprint_width = 0.421800;
upper_height = 0.442400;
upper_outer_radius = upper_footprint_length / 2;

// Left inner loop and rounded slot interruptions
left_inner_radius = 0.140600;
left_slot_width = right_outer_radius - right_inner_radius;
left_slot_start_radius = left_inner_radius - left_slot_width;
left_slot_end_radius = left_inner_radius + left_slot_width * 0.80;
left_slot_angles = [0, 90, 270];

// Lower rounded bridge and slot details
bridge_rail_width = 0.052000;
bridge_y_offset = 0.106000;
bridge_left_factor = 0.72;
bridge_right_factor = 0.66;
lower_center_slot_width = (right_axis_x - right_outer_radius) - (left_axis_x + left_outer_radius);
lower_center_slot_start_x = left_axis_x + left_inner_radius;
lower_center_slot_end_x = right_axis_x - right_inner_radius;

// Upright rectangular tab
tab_length = 0.041188;
tab_width = 0.070313;
tab_height = 0.441346;
tab_left_offset = 0.070300;
tab_right_offset = 0.638500;
tab_front_offset = 0.175800;
tab_back_offset = 0.175700;

// Derived axes
left_axis = [left_axis_x, left_axis_y];
right_axis = [right_axis_x, right_axis_y];
upper_axis = [
    upper_left_offset + upper_outer_radius,
    upper_front_offset + upper_footprint_width / 2
];

// Helpers
function polar_xy(c, a, r) = [c[0] + r * cos(a), c[1] + r * sin(a)];

module circle_2d(c, r) {
    translate(c)
        circle(r = r);
}

module rounded_slot_2d(p1, p2, w) {
    hull() {
        translate(p1)
            circle(d = w);
        translate(p2)
            circle(d = w);
    }
}

module radial_slot_2d(c, a, r1, r2, w) {
    rounded_slot_2d(polar_xy(c, a, r1), polar_xy(c, a, r2), w);
}

// Left annular opening with rounded interruptions
module left_opening_2d() {
    union() {
        circle_2d(left_axis, left_inner_radius);
        for (a = left_slot_angles)
            radial_slot_2d(left_axis, a, left_slot_start_radius, left_slot_end_radius, left_slot_width);
    }
}

// Separate rounded lower bridge profiles
module lower_bridge_profiles_2d() {
    for (s = [-1, 1])
        rounded_slot_2d(
            [left_axis_x + left_outer_radius * bridge_left_factor, left_axis_y + s * bridge_y_offset],
            [right_axis_x - right_outer_radius * bridge_right_factor, right_axis_y + s * bridge_y_offset],
            bridge_rail_width
        );
}

// Lower base boundary, not a filled rectangle
module lower_boundary_2d() {
    union() {
        circle_2d(left_axis, left_outer_radius);
        circle_2d(right_axis, right_outer_radius);
        lower_bridge_profiles_2d();
    }
}

// True lower openings and rounded slot voids
module lower_cutouts_2d() {
    union() {
        left_opening_2d();
        circle_2d(right_axis, right_inner_radius);
        rounded_slot_2d(
            [lower_center_slot_start_x, left_axis_y],
            [lower_center_slot_end_x, right_axis_y],
            lower_center_slot_width
        );
    }
}

// Lower shallow extrusion
module lower_base() {
    linear_extrude(height = lower_height, convexity = 10)
        difference() {
            lower_boundary_2d();
            lower_cutouts_2d();
        }
}

// Tall left circular continuation from base datum
module upper_left_section() {
    linear_extrude(height = upper_height, convexity = 10)
        difference() {
            circle_2d(upper_axis, upper_outer_radius);
            left_opening_2d();
        }
}

// Upright rectangular tab from base datum
module upright_tab() {
    translate([tab_left_offset, tab_front_offset, 0])
        cube([tab_length, tab_width, tab_height], center = false);
}

// Main model
union() {
    lower_base();
    upper_left_section();
    upright_tab();
}