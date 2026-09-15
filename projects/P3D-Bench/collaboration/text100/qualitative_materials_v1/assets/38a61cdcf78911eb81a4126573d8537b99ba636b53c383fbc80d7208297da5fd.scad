// Parameters
env_length = 0.303436;
env_width = 0.502485;
env_height = 0.468362;
main_height = 0.4684;

wall_thickness = 0.04;
bottom_thickness = 0.203;
outer_corner_r = 0.04;
inner_corner_r = 0.07;

small_axis_x = 0.1542;
small_axis_y = 0.4232;
small_outer_r = 0.0714;
small_bore_r = 0.025;
small_recess_depth = 0.1764;

large_axis_x = 0.5416;
large_axis_y = 0.2448;
large_outer_r = 0.2084;
large_annular_r = 0.1756;
large_bore_r = 0.0546;
large_height = 0.203;
large_recess_depth = 0.128;

$fn = 80;
eps = 0.001;

module rounded_rect(length, width, radius) {
    if (radius <= 0) {
        square([length, width]);
    } else {
        translate([radius, radius])
            offset(r = radius)
                square([length - 2 * radius, width - 2 * radius]);
    }
}

module main_outer() {
    linear_extrude(height = main_height)
        rounded_rect(env_length, env_width, outer_corner_r);
}

module main_cavity() {
    translate([wall_thickness, wall_thickness, bottom_thickness])
        linear_extrude(height = main_height - bottom_thickness + eps)
            rounded_rect(env_length - 2 * wall_thickness,
                         env_width - 2 * wall_thickness,
                         inner_corner_r);
}

module small_sleeve() {
    translate([small_axis_x, small_axis_y, 0])
        cylinder(h = main_height, r = small_outer_r);
}

module large_annular_solid() {
    hull() {
        translate([env_length - 0.02, large_axis_y - 0.12, 0])
            cube([0.02, 0.24, large_height]);
        translate([large_axis_x, large_axis_y, 0])
            cylinder(h = large_height, r = large_outer_r);
    }
}

module small_recess() {
    translate([small_axis_x, small_axis_y, -eps])
        cylinder(h = small_recess_depth + eps, r = small_outer_r);
}

module small_bore() {
    translate([small_axis_x, small_axis_y, -eps])
        cylinder(h = main_height + 2 * eps, r = small_bore_r);
}

module large_recess() {
    translate([large_axis_x, large_axis_y, -eps])
        cylinder(h = large_recess_depth + eps, r = large_annular_r);
}

module large_bore() {
    translate([large_axis_x, large_axis_y, -eps])
        cylinder(h = large_height + 2 * eps, r = large_bore_r);
}

difference() {
    union() {
        difference() {
            main_outer();
            main_cavity();
        }
        small_sleeve();
        large_annular_solid();
    }
    small_recess();
    small_bore();
    large_recess();
    large_bore();
}