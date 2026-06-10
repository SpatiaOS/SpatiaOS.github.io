// Parameters
$fn = 96;
eps = 0.001;

// Base
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.10;
base_end_radius = base_width / 2;

// Base through holes
base_hole_radius = 0.05;
base_hole_y = 0.125;
base_hole_xs = [0.125, 0.625];

// Lower upright
upright_end_offset = 0.20;
upright_side_offset = 0.025;
upright_length = base_length - 2 * upright_end_offset;
upright_width = base_width - 2 * upright_side_offset;
upright_height = 0.20;
upright_x = upright_end_offset;
upright_y = upright_side_offset;
upright_z = base_thickness;
upright_top_z = upright_z + upright_height;

// Rounded cap
cap_radius = upright_width / 2;
cap_rise = 0.10;

// Horizontal through-passage
passage_radius = 0.05;
passage_start_x = 0.20;
passage_reach = 0.444;
passage_y = 0.125;
passage_z_min = 0.25;
passage_z_max = 0.35;
passage_z = (passage_z_min + passage_z_max) / 2;

// Rounded upper relief
relief_end_clearance = 0.255;
relief_length = 0.24;
relief_x = relief_end_clearance;
relief_y = 0.025;
relief_depth = 0.299;
relief_z_min = 0.18;
relief_z_max = 0.45;
relief_height = relief_z_max - relief_z_min;
relief_arc_segments = 32;

// 2D obround base outline
module obround_2d(len, wid) {
    hull() {
        translate([wid / 2, wid / 2])
            circle(r = wid / 2);
        translate([len - wid / 2, wid / 2])
            circle(r = wid / 2);
    }
}

// Base slab
module base_slab() {
    linear_extrude(height = base_thickness, convexity = 4)
        obround_2d(base_length, base_width);
}

// Rectangular lower upright
module lower_upright() {
    translate([upright_x, upright_y, upright_z])
        cube([upright_length, upright_width, upright_height]);
}

// Semicylindrical rounded cap
module rounded_cap() {
    intersection() {
        translate([upright_x, upright_y, upright_top_z - eps])
            cube([upright_length, upright_width, cap_rise + 2 * eps]);

        translate([
            upright_x + upright_length / 2,
            upright_y + upright_width / 2,
            upright_top_z
        ])
            rotate([0, 90, 0])
                cylinder(h = upright_length + 2 * eps, r = cap_radius, center = true);
    }
}

// Arched 2D profile for upper relief
module relief_arch_2d(w, h, segments) {
    r = w / 2;
    straight_h = h - r;

    polygon(points = concat(
        [[0, 0], [w, 0]],
        [
            for (i = [0 : segments])
                let (a = 180 * i / segments)
                    [w / 2 + r * cos(a), straight_h + r * sin(a)]
        ]
    ));
}

// Base vertical hole cutters
module base_hole_cutters() {
    for (xpos = base_hole_xs) {
        translate([xpos, base_hole_y, -eps])
            cylinder(h = base_thickness + 2 * eps, r = base_hole_radius);
    }
}

// Lengthwise circular passage cutter
module passage_cutter() {
    translate([
        passage_start_x + passage_reach / 2,
        passage_y,
        passage_z
    ])
        rotate([0, 90, 0])
            cylinder(h = passage_reach + 2 * eps, r = passage_radius, center = true);
}

// Rounded upper relief cutter
module upper_relief_cutter() {
    translate([relief_x, relief_y + relief_depth + eps, relief_z_min])
        rotate([90, 0, 0])
            linear_extrude(height = relief_depth + 2 * eps, convexity = 10)
                relief_arch_2d(relief_length, relief_height, relief_arc_segments);
}

// Solid body before cuts
module solid_body() {
    union() {
        base_slab();
        lower_upright();
        rounded_cap();
    }
}

// All removed material
module all_cutters() {
    union() {
        base_hole_cutters();
        passage_cutter();
        upper_relief_cutter();
    }
}

// Final model
difference() {
    solid_body();
    all_cutters();
}