// Parameters
$fn = 128;
eps = 0.0005;

// Main base reference
base_length = 0.75;
base_width = 0.75;
base_declared_height = 0.05625;
base_center_x = base_length / 2;
base_center_y = base_width / 2;

// Main circular annulus
main_outer_radius = 0.375;
main_inner_radius = 0.3375;
main_z_min = -0.0281;
main_z_max =  0.0281;

// Center annular collar
collar_offset = 0.3;
collar_footprint = 0.15;
collar_outer_radius = collar_footprint / 2;
collar_inner_radius = 0.0375;
collar_z_min = -0.0234;
collar_z_max =  0.0234;

// Rounded radial rib web footprint
web_length = 0.618448;
web_width = 0.521035;
web_height = 0.028125;
web_left_offset = (base_length - web_length) / 2;
web_right_offset = web_left_offset;
web_front_offset = 0.0387;
web_back_offset = base_width - web_front_offset - web_width;
web_center_x = web_left_offset + web_length / 2;
web_center_y = web_front_offset + web_width / 2;
web_z_min = -web_height / 2;
web_z_max =  web_height / 2;

// Rib and slot shaping
web_outer_radius = main_inner_radius + 0.002;
web_inner_radius = collar_inner_radius;
web_slot_radius = (collar_outer_radius + main_inner_radius) / 2;
web_slot_margin = 0.01875;
web_slot_width = (main_inner_radius - collar_outer_radius) - 2 * web_slot_margin;
web_rib_half_angle = 7;
web_slot_step = 3;
web_mask_corner_radius = 0.016;

web_slot_angle_pairs = [
    [30  + web_rib_half_angle, 150 - web_rib_half_angle],
    [150 + web_rib_half_angle, 210 - web_rib_half_angle],
    [210 + web_rib_half_angle, 270 - web_rib_half_angle],
    [270 + web_rib_half_angle, 330 - web_rib_half_angle],
    [330 + web_rib_half_angle, 390 - web_rib_half_angle]
];

// 2D annulus helper
module annulus_2d(r_outer, r_inner) {
    difference() {
        circle(r = r_outer);
        circle(r = r_inner);
    }
}

// 2D rounded rectangle helper
module rounded_rectangle_2d(w, d, r) {
    hull() {
        for (x = [-w/2 + r, w/2 - r])
            for (y = [-d/2 + r, d/2 - r])
                translate([x, y])
                    circle(r = r);
    }
}

// 2D rounded arc slot
module arc_slot_2d(r, w, a_start, a_end, step) {
    for (a = [a_start : step : a_end - step]) {
        hull() {
            translate([r * cos(a), r * sin(a)])
                circle(d = w);
            translate([r * cos(min(a + step, a_end)), r * sin(min(a + step, a_end))])
                circle(d = w);
        }
    }
}

// 3D annular cylinder between z tiers
module annular_cylinder(r_outer, r_inner, z_min, z_max) {
    translate([base_center_x, base_center_y, (z_min + z_max) / 2])
        difference() {
            cylinder(h = z_max - z_min, r = r_outer, center = true);
            cylinder(h = z_max - z_min + 2 * eps, r = r_inner, center = true);
        }
}

// Main base annular rim
module main_base_annulus() {
    annular_cylinder(main_outer_radius, main_inner_radius, main_z_min, main_z_max);
}

// Center annular collar
module center_collar() {
    annular_cylinder(collar_outer_radius, collar_inner_radius, collar_z_min, collar_z_max);
}

// Rib web 2D profile with open elongated arc slots
module rib_web_2d() {
    difference() {
        intersection() {
            annulus_2d(web_outer_radius, web_inner_radius);
            translate([web_center_x - base_center_x, web_center_y - base_center_y])
                rounded_rectangle_2d(web_length, web_width, web_mask_corner_radius);
        }

        for (slot = web_slot_angle_pairs)
            arc_slot_2d(web_slot_radius, web_slot_width, slot[0], slot[1], web_slot_step);
    }
}

// Rounded radial rib web tier
module rib_web() {
    translate([base_center_x, base_center_y, (web_z_min + web_z_max) / 2])
        linear_extrude(height = web_z_max - web_z_min, center = true, convexity = 10)
            rib_web_2d();
}

// Through bore keeper
module center_through_void() {
    translate([base_center_x, base_center_y, 0])
        cylinder(h = base_declared_height + 2 * eps, r = collar_inner_radius, center = true);
}

// Final model
difference() {
    union() {
        main_base_annulus();
        center_collar();
        rib_web();
    }

    center_through_void();
}