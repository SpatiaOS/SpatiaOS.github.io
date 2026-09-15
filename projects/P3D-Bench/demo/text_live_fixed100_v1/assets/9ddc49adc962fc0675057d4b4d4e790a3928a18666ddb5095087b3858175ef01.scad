// Base parameters (mm)
base_length = 0.75;
base_width = 0.375;
base_height = 0.0375;

// Raised channel parameters
upper_top = 0.1312;
upper_height = upper_top - base_height; // 0.0937
front_wall_thickness = 0.0281;
back_wall_thickness = 0.0375;
right_wall_thickness = 0.0319;

// Lower left-end closure
left_length = 0.0319;
left_width = 0.3094;
left_x = 0;
left_front_offset = 0.0281;
left_back_offset = 0.0375;
left_right_offset = base_length - left_x - left_length;
left_top = 0.0937;
left_nominal_height = 0.05625;
left_extrusion_depth = left_top - base_height; // 0.0562

// Annular posts
post_x_positions = [0.15, 0.3, 0.45, 0.6];
post_y = 0.1875;
post_outer_radii = [0.0469, 0.0469, 0.0562, 0.0562];
post_opening_radii = [0.0188, 0.0197, 0.0216, 0.0234];
post_bottom = base_height;
post_top = upper_top;
post_height = post_top - post_bottom;

// Geometry controls
epsilon = 0.00001;
$fn = 100;

// Base
module base() {
    cube([base_length, base_width, base_height]);
}

// Open raised U-channel
module upper_channel() {
    translate([0, 0, base_height])
        difference() {
            cube([base_length, base_width, upper_height]);

            translate([-epsilon, front_wall_thickness, -epsilon])
                cube([
                    base_length - right_wall_thickness + epsilon,
                    base_width
                        - front_wall_thickness
                        - back_wall_thickness,
                    upper_height + 2 * epsilon
                ]);
        }
}

// Lower left-end closure
module left_closure() {
    translate([left_x, left_front_offset, base_height])
        cube([left_length, left_width, left_extrusion_depth]);
}

// Post with through opening
module annular_post(outer_radius, opening_radius, height) {
    difference() {
        cylinder(h = height, r = outer_radius);

        translate([0, 0, -epsilon])
            cylinder(
                h = height + 2 * epsilon,
                r = opening_radius
            );
    }
}

// Separate posts on the intact base
module posts() {
    for (i = [0 : len(post_x_positions) - 1])
        translate([post_x_positions[i], post_y, post_bottom])
            annular_post(
                post_outer_radii[i],
                post_opening_radii[i],
                post_height
            );
}

// Complete model
union() {
    base();
    upper_channel();
    left_closure();
    posts();
}