// Parametric rounded-wedge base with pocket, web, boss, and slots
$fn = 96;
eps = 0.0004;

// Overall envelope
length = 0.740822;
width = 0.672842;
height = 0.171797;
extrude_h = 0.1718;

// Central circular opening
large_hole_x = 0.3687;
large_hole_y = 0.4283;
large_hole_r = 0.2165;

// Shallow circular upper/floor feature
shallow_x = 0.3688;
shallow_y = 0.4282;
shallow_r = 0.2165;
shallow_h = 0.020616;
shallow_extrude = 0.0206;
shallow_left = 0.1523;
shallow_right = 0.1555;
shallow_front = 0.2117;
shallow_back = 0.0281;

// Narrow straight web
web_length = 0.025368;
web_width = 0.432873;
web_height = 0.171797;
web_extrude = 0.1718;
web_left = 0.3434;
web_right = 0.372;
web_front = 0.2119;
web_back = 0.028;

// Smaller round solid
small_solid_x = 0.4796;
small_solid_y = 0.4282;
small_solid_r = 0.0754;
small_span_x = 0.2;
small_span_y = 0.1984;
small_solid_left = 0.3927;
small_solid_right = 0.1481;
small_solid_front = 0.3476;
small_solid_back = 0.1268;
small_solid_h = 0.1718;

// Circular removed recess
small_hole_x = 0.4796;
small_hole_y = 0.4283;
small_hole_r = 0.0754;
small_hole_span = 0.150716;
small_hole_left = 0.4042;
small_hole_right = 0.1858;
small_hole_front = 0.3529;
small_hole_back = 0.1691;
small_hole_z_min = -0.1512;
small_hole_z_max = 0.0206;
small_hole_depth = 0.1718;

// Underside step
upper_pad_depth = 0.1512;
cont_depth = 0.0206;

// Outer rounded-wedge profile
lobe_r = 0.14;
back_r = width - large_hole_y;

// Lobe slots
slot_r = 0.018;
slot_left_a = [0.100, 0.155];
slot_left_b = [0.175, 0.245];
slot_right_a = [length - 0.100, 0.155];
slot_right_b = [length - 0.175, 0.245];

module wedge_profile() {
    intersection() {
        hull() {
            translate([large_hole_x, large_hole_y])
                circle(r = back_r);
            translate([lobe_r, lobe_r])
                circle(r = lobe_r);
            translate([length - lobe_r, lobe_r])
                circle(r = lobe_r);
        }
        square([length, width]);
    }
}

module slot_profiles() {
    hull() {
        translate(slot_left_a) circle(r = slot_r);
        translate(slot_left_b) circle(r = slot_r);
    }
    hull() {
        translate(slot_right_a) circle(r = slot_r);
        translate(slot_right_b) circle(r = slot_r);
    }
}

module main_wedge() {
    linear_extrude(height = extrude_h, convexity = 8)
        wedge_profile();
}

module underside_continuation() {
    translate([0, 0, -cont_depth])
        linear_extrude(height = cont_depth + eps, convexity = 6)
            intersection() {
                wedge_profile();
                translate([shallow_x, shallow_y])
                    circle(r = shallow_r);
            }
}

module shallow_floor() {
    translate([shallow_x, shallow_y, 0])
        cylinder(h = shallow_extrude, r = shallow_r);
}

module web() {
    translate([web_left, web_front, 0])
        cube([web_length, web_width, web_extrude]);
}

module small_round_solid() {
    translate([small_solid_x, small_solid_y, 0])
        cylinder(h = small_solid_h, r = small_solid_r);
    // short rib so the boss stays manifold with the web
    translate([web_left + web_length - eps, small_solid_y - 0.012, 0])
        cube([
            (small_solid_x - small_solid_r) - (web_left + web_length) + 2 * eps,
            0.024,
            small_solid_h
        ]);
}

module large_pocket() {
    translate([large_hole_x, large_hole_y, shallow_extrude])
        cylinder(h = extrude_h - shallow_extrude + eps, r = large_hole_r);
}

module lobe_slots() {
    translate([0, 0, -cont_depth - eps])
        linear_extrude(height = extrude_h + cont_depth + 2 * eps, convexity = 6)
            slot_profiles();
}

module small_recess() {
    translate([small_hole_x, small_hole_y, small_hole_z_min])
        cylinder(h = small_hole_z_max - small_hole_z_min, r = small_hole_r);
}

difference() {
    union() {
        difference() {
            union() {
                main_wedge();
                underside_continuation();
                shallow_floor();
            }
            large_pocket();
            lobe_slots();
        }
        web();
        small_round_solid();
    }
    small_recess();
}