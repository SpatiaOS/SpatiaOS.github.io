// Parameters
$fn = 120;
eps = 0.001;

// Main rounded base
base_length = 0.740822;
base_width = 0.672842;
base_height = 0.171797;
main_extrude = 0.1718;
base_corner_radius = 0.08;

// Base footprint offsets
base_offset_left = 0;
base_offset_right = 0;
base_offset_front = 0;
base_offset_back = 0;

// Central circular through opening
central_hole_x = 0.3687;
central_hole_y = 0.4283;
central_radius = 0.2165;

// Shallow circular upper feature
shallow_left = 0.1523;
shallow_right = 0.1555;
shallow_front = 0.2117;
shallow_back = 0.0281;
shallow_length = 0.432928;
shallow_width = 0.432928;
shallow_height = 0.020616;
shallow_extrude = 0.0206;
shallow_axis_x = shallow_left + shallow_length / 2;
shallow_axis_y = shallow_front + shallow_width / 2;
shallow_void_radius = central_radius;
shallow_wall = shallow_extrude;
shallow_outer_radius = shallow_void_radius + shallow_wall;

// Narrow straight web
web_left = 0.3434;
web_right = 0.372;
web_front = 0.2119;
web_back = 0.028;
web_length = 0.025368;
web_width = 0.432873;
web_extrude = main_extrude;

// Smaller round solid feature and bounding solid
small_axis_x = 0.4796;
small_axis_y = 0.4282;
small_radius = 0.0754;
small_left = 0.3927;
small_right = 0.1481;
small_front = 0.3476;
small_back = 0.1268;
small_span_x = base_length - small_left - small_right;
small_span_y = base_width - small_front - small_back;
small_height = main_extrude;
small_corner_radius = min(small_span_x, small_span_y) * 0.2;
small_ring_wall = 0.005;

// Circular removed recess/opening
recess_left = 0.4042;
recess_right = 0.1858;
recess_front = 0.3529;
recess_back = 0.1691;
recess_footprint = 0.150716;
recess_axis_x = recess_left + recess_footprint / 2;
recess_axis_y = recess_front + recess_footprint / 2;
recess_radius = 0.0754;
recess_bottom = -0.1512;
recess_top = 0.0206;
recess_depth = recess_top - recess_bottom;

// Underside stepping
underside_broad_depth = 0.1512;
underside_cont_depth = 0.0206;
lower_pad_radius = shallow_outer_radius;
lower_cont_radius = central_radius;

// Slot-like openings near rounded outer lobes
slot_length = 0.060;
slot_width = 0.018;
slot_edge_offset = 0.120;
slot_positions = [
    [slot_edge_offset, slot_edge_offset, 45],
    [base_length - slot_edge_offset, slot_edge_offset, -45],
    [slot_edge_offset, base_width - slot_edge_offset, -45],
    [base_length - slot_edge_offset, base_width - slot_edge_offset, 45]
];

// Helper: rounded rectangle profile
module rounded_rect_profile(size, r) {
    translate([size[0] / 2, size[1] / 2])
        offset(r = r)
            square([size[0] - 2 * r, size[1] - 2 * r], center = true);
}

// Helper: rounded plate
module rounded_plate(size, r, h) {
    linear_extrude(height = h, convexity = 10)
        rounded_rect_profile(size, r);
}

// Helper: rounded slot cut
module rounded_slot(length, width, h) {
    travel = max(0, length - width);
    linear_extrude(height = h, convexity = 10)
        hull() {
            translate([-travel / 2, 0]) circle(d = width);
            translate([ travel / 2, 0]) circle(d = width);
        }
}

// Central opening cut
module central_hole_cut() {
    translate([central_hole_x, central_hole_y, -eps])
        cylinder(h = main_extrude + shallow_extrude + 2 * eps, r = central_radius);
}

// Slot cuts
module slot_cuts() {
    h = main_extrude + shallow_extrude + 2 * eps;
    for (p = slot_positions) {
        translate([p[0], p[1], -eps])
            rotate([0, 0, p[2]])
                rounded_slot(slot_length, slot_width, h);
    }
}

// Upper base with central opening and slots
module upper_with_openings() {
    difference() {
        union() {
            // Main rounded wedge base footprint
            translate([base_offset_left, base_offset_front])
                rounded_plate([base_length, base_width], base_corner_radius, main_extrude);

            // Shallow circular upper feature, preserving central void
            translate([shallow_axis_x, shallow_axis_y, main_extrude - eps])
                cylinder(h = shallow_extrude + eps, r = shallow_outer_radius);
        }

        central_hole_cut();
        slot_cuts();
    }
}

// Underside stepped pads
module underside_steps() {
    // Broader upper pad
    translate([shallow_axis_x, shallow_axis_y, -underside_broad_depth])
        cylinder(h = underside_broad_depth + eps, r = lower_pad_radius);

    // Contained continuation below broader pad
    translate([shallow_axis_x, shallow_axis_y, -underside_broad_depth - underside_cont_depth])
        cylinder(h = underside_cont_depth + eps, r = lower_cont_radius);
}

// Narrow straight web crossing central opening
module web_solid() {
    translate([web_left, web_front, -eps])
        cube([web_length, web_width, web_extrude + 2 * eps]);
}

// Smaller round solid feature with bounding pad
module small_feature_solid() {
    // Bounding solid pad from offsets
    translate([small_left, small_front, -eps])
        rounded_plate([small_span_x, small_span_y], small_corner_radius, small_height + 2 * eps);

    // Round boss ring around removed recess
    translate([small_axis_x, small_axis_y, -eps])
        cylinder(h = small_height + 2 * eps, r = small_radius + small_ring_wall);
}

// Removed circular recess/opening
module recess_cut() {
    translate([recess_axis_x, recess_axis_y, recess_bottom - eps])
        cylinder(h = recess_depth + 2 * eps, r = recess_radius);
}

// Final model
difference() {
    union() {
        upper_with_openings();
        underside_steps();
        web_solid();
        small_feature_solid();
    }

    recess_cut();
}