// Parameters — millimeters
base_length = 0.75;
base_width = 0.5;
base_height = 0.125;
base_corner_radius = 0.0625;

base_hole_x = 0.375;
base_hole_y = 0.25;
base_hole_radius = 0.125;

collar_depth = 0.0375;
collar_outer_radius = 0.2125;
collar_inner_radius = base_hole_radius;

tab_thickness = 0.125;
tab_width = 0.375;
tab_front_offset = 0.0625;
tab_total_height = 0.5875;
tab_top_radius = tab_width / 2;
tab_hole_radius = 0.0937;

left_tab_x = 0;
right_tab_x = base_length - tab_thickness;
tab_center_y = tab_front_offset + tab_width / 2;
tab_hole_z = tab_total_height - tab_top_radius;

epsilon = 0.0001;
$fn = 100;

// Rounded base footprint
module base_profile() {
    translate([base_corner_radius, base_corner_radius])
        offset(r = base_corner_radius)
            square([
                base_length - 2 * base_corner_radius,
                base_width - 2 * base_corner_radius
            ]);
}

// Base plate
module base_plate() {
    linear_extrude(height = base_height)
        base_profile();
}

// Hollow underside collar
module annular_collar() {
    translate([base_hole_x, base_hole_y, -collar_depth])
        linear_extrude(height = collar_depth + epsilon)
            difference() {
                circle(r = collar_outer_radius);
                circle(r = collar_inner_radius);
            }
}

// Upright elevation: straight sides and semicircular crown
module tab_profile() {
    union() {
        translate([-tab_width / 2, base_height - epsilon])
            square([
                tab_width,
                tab_hole_z - base_height + epsilon
            ]);

        translate([0, tab_hole_z])
            circle(r = tab_top_radius);
    }
}

// Upright with opening through its X-axis thickness
module rounded_tab(x_position) {
    difference() {
        translate([x_position, tab_center_y, 0])
            rotate([90, 0, 90])
                linear_extrude(height = tab_thickness)
                    tab_profile();

        translate([
            x_position - epsilon,
            tab_center_y,
            tab_hole_z
        ])
            rotate([0, 90, 0])
                cylinder(
                    h = tab_thickness + 2 * epsilon,
                    r = tab_hole_radius
                );
    }
}

// Joined bracket with continuous base and collar opening
module bracket() {
    difference() {
        union() {
            base_plate();
            annular_collar();
            rounded_tab(left_tab_x);
            rounded_tab(right_tab_x);
        }

        translate([
            base_hole_x,
            base_hole_y,
            -collar_depth - epsilon
        ])
            cylinder(
                h = collar_depth + base_height + 2 * epsilon,
                r = base_hole_radius
            );
    }
}

bracket();