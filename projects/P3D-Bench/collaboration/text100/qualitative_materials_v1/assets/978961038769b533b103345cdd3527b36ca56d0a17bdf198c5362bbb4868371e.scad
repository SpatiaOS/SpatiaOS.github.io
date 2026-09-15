// Dimensions in millimeters
reference_length = 0.303436;
reference_width = 0.502485;
reference_height = 0.468362;
upright_height = 0.4684;

small_axis_x = 0.1542;
small_axis_y = 0.4232;
small_sleeve_radius = 0.0714;
small_step_radius = small_sleeve_radius;
small_bore_radius = 0.025;

small_recess_axis_x = 0.1541;
small_recess_axis_y = 0.4232;
small_recess_radius = 0.0714;
small_recess_depth = 0.1764;

large_axis_x = 0.5416;
large_axis_y = 0.2448;
large_outer_radius = 0.2084;
large_annular_radius = 0.1756;
large_bore_radius = 0.0546;
large_tier_height = 0.203;
large_recess_depth = 0.128;

// Parametric upright and connecting web
upright_corner_radius = reference_length / 2;
upright_wall = large_outer_radius - large_annular_radius;
small_tier_top = large_tier_height;
bridge_width = 2 * upright_wall;
bridge_height = large_tier_height;

bridge_start_x = reference_length - upright_wall / 2;
bridge_end_x = large_axis_x - large_outer_radius + upright_wall / 2;
bridge_axis_y = large_axis_y;

epsilon = 0.000001;
bore_cut_height = max(reference_height, upright_height, large_tier_height);
$fn = 128;

// Rounded footprint
module rounded_profile(length, width, radius) {
    hull() {
        for (x = [radius, length - radius])
            for (y = [radius, width - radius])
                translate([x, y])
                    circle(r = radius);
    }
}

// Open, curved upright within the reference footprint
module upright() {
    linear_extrude(height = upright_height, convexity = 10)
        difference() {
            rounded_profile(
                reference_length,
                reference_width,
                upright_corner_radius
            );
            offset(delta = -upright_wall)
                rounded_profile(
                    reference_length,
                    reference_width,
                    upright_corner_radius
                );
        }
}

// Circular tier blank
module circular_tier(axis_x, axis_y, radius, bottom, top) {
    translate([axis_x, axis_y, bottom])
        cylinder(h = top - bottom, r = radius);
}

// Rounded lower connecting web
module connecting_web() {
    linear_extrude(height = bridge_height)
        hull() {
            translate([bridge_start_x, bridge_axis_y])
                circle(r = bridge_width / 2);
            translate([bridge_end_x, bridge_axis_y])
                circle(r = bridge_width / 2);
        }
}

// Blind underside recess
module underside_recess(axis_x, axis_y, radius, depth) {
    translate([axis_x, axis_y, -epsilon])
        cylinder(h = depth + epsilon, r = radius);
}

// True through-opening
module through_bore(axis_x, axis_y, radius) {
    translate([axis_x, axis_y, -epsilon])
        cylinder(h = bore_cut_height + 2 * epsilon, r = radius);
}

// Unified body with stepped underside openings
module model() {
    difference() {
        union() {
            upright();
            connecting_web();

            circular_tier(
                large_axis_x,
                large_axis_y,
                large_outer_radius,
                0,
                large_tier_height
            );

            circular_tier(
                small_axis_x,
                small_axis_y,
                small_step_radius,
                small_recess_depth,
                small_tier_top
            );
        }

        underside_recess(
            large_axis_x,
            large_axis_y,
            large_annular_radius,
            large_recess_depth
        );

        underside_recess(
            small_recess_axis_x,
            small_recess_axis_y,
            small_recess_radius,
            small_recess_depth
        );

        through_bore(large_axis_x, large_axis_y, large_bore_radius);
        through_bore(small_axis_x, small_axis_y, small_bore_radius);
    }
}

assert(upright_wall > 0);
assert(upright_wall < upright_corner_radius);
assert(reference_width >= 2 * upright_corner_radius);
assert(large_recess_depth < large_tier_height);
assert(small_recess_depth < small_tier_top);

model();