// Mechanical linkage assembly reconstruction
// Units: millimeters

// -----------------------------
// Global resolution / tolerances
// -----------------------------
$fn = 96;

eps = 0.20;
hole_clearance = 0.60;
contact_overlap = 0.50;

// -----------------------------
// Material preview colors
// -----------------------------
frame_color   = [0.55, 0.55, 0.55];
bracket_color = [0.62, 0.62, 0.62];
link_color    = [0.70, 0.70, 0.70];
pulley_color  = [0.58, 0.58, 0.58];
pin_color     = [0.82, 0.82, 0.78];
rocker_color  = [0.38, 0.38, 0.38];
knuckle_color = [0.60, 0.60, 0.60];

// -----------------------------
// Principal pivot layout [Y, Z]
// -----------------------------
tri_pivot_a = [-165, 115];   // lower-left Ø30 pivot, pulley axis
tri_pivot_b = [ 170, 145];   // lower-right Ø40 pivot
tri_pivot_c = [  55, 300];   // upper Ø40 pivot

link_pivot_left  = [-180, 360];
link_pivot_right = [ 175, 340];

shaft40_centers = [
    link_pivot_left,
    link_pivot_right,
    tri_pivot_b,
    tri_pivot_c
];

knuckle_lower = [-165,  72];
knuckle_upper = [-178, 315];

pin30_pair_centers = [
    knuckle_lower,
    knuckle_upper
];

// -----------------------------
// Flat bar
// -----------------------------
flat_bar_length = 600;
flat_bar_width  = 50;
flat_bar_thick  = 10;
flat_bar_y      = 120;
flat_bar_z      = 522;

// -----------------------------
// Fixed rear support frame
// -----------------------------
frame_x = 96;

frame_member_x = 54;
frame_member_y = 42;
frame_member_z = 42;

frame_top_rail_y   = 37.5;
frame_top_rail_len = 395;
frame_top_rail_z   = 493;

frame_mid_rail_y   = 70;
frame_mid_rail_len = 230;
frame_mid_rail_z   = 300;

frame_lower_rail_y   = 82;
frame_lower_rail_len = 285;
frame_lower_rail_z   = 178;

frame_right_post_y = 218;
frame_right_post_z = 334;
frame_right_post_h = 338;

frame_left_post_y = -132;
frame_left_post_z = 420;
frame_left_post_h = 186;

frame_center_post_y = 12;
frame_center_post_z = 326;
frame_center_post_h = 292;

bearing_block_x_center = 96;
bearing_block_x = 70;
bearing_block_y = 74;
bearing_block_z = 74;

host_block_x_center = 42;
host_block_x = 48;
host_block_y = 58;
host_block_z = 58;

// -----------------------------
// Pins and shafts
// -----------------------------
pin40_d   = 40;
pin40_len = 220;
pin40_x   = 25;

pin40_collar_d     = 54;
pin40_collar_thick = 9;
pin40_collar_gap   = 1.0;

pin40_collar_left_x  = -50 - pin40_collar_thick / 2 - pin40_collar_gap;
pin40_collar_right_x =  50 + pin40_collar_thick / 2 + pin40_collar_gap;

pin30_d          = 30;
pin30_pair_len   = 90;
pin30_pair_x     = 0;
pin30_long_len   = 100;
pin30_long_x     = 5;

// -----------------------------
// Triangular linkage bracket
// -----------------------------
tri_body_x      = 30;
tri_arm_d       = 46;
tri_boss40_od   = 70;
tri_boss40_len  = 100;
tri_boss30_od   = 56;
tri_boss30_len  = 82;

tri_cutout_d = 42;
tri_cut_1 = [-48, 150];
tri_cut_2 = [ 82, 164];
tri_cut_3 = [ 26, 248];

tri_sphere_d = 18;
tri_sphere_x = -tri_body_x / 2 - tri_sphere_d / 2 + contact_overlap;
tri_sphere_centers = [
    [-130, 155],
    [  82, 272]
];

// -----------------------------
// U-shaped swept link arm
// -----------------------------
link_body_x    = 40;
link_bar_d     = 34;
link_boss_od   = 60;
link_boss_len  = 100;

link_upper_path = [
    link_pivot_left,
    [-90, 395],
    [ 70, 382],
    link_pivot_right
];

link_lower_path = [
    link_pivot_left,
    [-225, 305],
    [-195, 245],
    [ -40, 248],
    [ 115, 285],
    link_pivot_right
];

link_socket_d     = 50;
link_socket_depth = 15;
link_socket_x     = -link_boss_len / 2 + link_socket_depth / 2;

link_sphere_d = 20;
link_sphere_x = link_body_x / 2 + link_sphere_d / 2 - contact_overlap;
link_sphere_centers = [
    [-170, 332],
    [ 130, 304]
];

// -----------------------------
// Upright / host knuckle
// -----------------------------
knuckle_body_x   = 45;
knuckle_bar_d    = 34;
knuckle_boss_od  = 52;
knuckle_boss_len = 70;
knuckle_sphere_d = 24;
knuckle_sphere_x = -knuckle_body_x / 2 - knuckle_sphere_d / 2 + contact_overlap;

knuckle_sphere_centers = [
    [-170,  92],
    [-178, 300]
];

// -----------------------------
// Pulley disc
// -----------------------------
pulley_outer_d    = 230;
pulley_thickness  = 61;
pulley_center_x   = -(tri_body_x / 2 + pulley_thickness / 2 - contact_overlap);

pulley_hub_d              = 140;
pulley_hub_front_thick    = 14;
pulley_hub_rear_d         = 105;
pulley_hub_rear_thick     = 10;
pulley_cap_d              = 106;
pulley_cap_thick          = 8;

pulley_face_ring_thick = 4;
pulley_face_ring_id    = 204;

pulley_bolt_count    = 5;
pulley_bolt_d        = 14;
pulley_bolt_circle_d = 90;

pulley_notch_count  = 30;
pulley_notch_d      = 8;
pulley_notch_radius = pulley_outer_d / 2 + pulley_notch_d * 0.20;

pulley_cut_h = pulley_thickness
             + pulley_hub_front_thick
             + pulley_hub_rear_thick
             + pulley_cap_thick
             + 4 * eps;

// -----------------------------
// Upper rocker / cover plate
// -----------------------------
top_plate_x = -20;
top_plate_y = 40;
top_plate_z = 410;

top_plate_thick    = 12;
top_plate_corner_r = 22;

top_plate_points = [
    [-145, -125],
    [ 145,  -95],
    [ 130,   85],
    [ -75,  125]
];

top_plate_hole_xy = [8, -22];
top_plate_hole_d  = 12;

top_lug_positions = [
    [-62, 82],
    [  4, 72],
    [ 70, 58]
];

top_lug_len = 34;
top_lug_od  = 24;
top_lug_id  = 12;
top_lug_z   = -top_plate_thick / 2 - top_lug_od / 2 + contact_overlap;

// -----------------------------
// Axis helper primitives
// -----------------------------
module x_cylinder(h, d, center = true) {
    rotate([0, 90, 0])
        cylinder(h = h, d = d, center = center);
}

module y_cylinder(h, d, center = true) {
    rotate([90, 0, 0])
        cylinder(h = h, d = d, center = center);
}

module x_annular_cylinder(h, od, id) {
    difference() {
        x_cylinder(h = h, d = od);
        x_cylinder(h = h + 2 * eps, d = id);
    }
}

module y_annular_cylinder(h, od, id) {
    difference() {
        y_cylinder(h = h, d = od);
        y_cylinder(h = h + 2 * eps, d = id);
    }
}

// Short cylindrical node centered on a Y/Z point, axis along X.
module yz_node(p, d, thickness) {
    translate([0, p[0], p[1]])
        x_cylinder(h = thickness, d = d);
}

// Rounded strut between two Y/Z points using a hull of X-axis cylinders.
module yz_capsule(p1, p2, d, thickness) {
    hull() {
        yz_node(p1, d, thickness);
        yz_node(p2, d, thickness);
    }
}

module strut_path(points, d, thickness) {
    for (i = [0 : 1 : len(points) - 2]) {
        yz_capsule(points[i], points[i + 1], d, thickness);
    }
}

module xy_rounded_hull(points, r) {
    hull() {
        for (p = points)
            translate([p[0], p[1]])
                circle(r = r);
    }
}

// Rectangular bearing block with an X-axis bore.
module bearing_block(p, block_x, block_y, block_z, hole_d, x_center) {
    difference() {
        translate([x_center, p[0], p[1]])
            cube([block_x, block_y, block_z], center = true);

        translate([x_center, p[0], p[1]])
            x_cylinder(h = block_x + 2 * eps, d = hole_d + hole_clearance);
    }
}

// -----------------------------
// Assembly components
// -----------------------------
module flat_bar() {
    color(frame_color)
        translate([0, flat_bar_y, flat_bar_z])
            cube([flat_bar_length, flat_bar_width, flat_bar_thick], center = true);
}

module support_frame() {
    color(frame_color)
    union() {
        // Box-section frame members.
        translate([frame_x, frame_top_rail_y, frame_top_rail_z])
            cube([frame_member_x, frame_top_rail_len, frame_member_z], center = true);

        translate([frame_x, frame_mid_rail_y, frame_mid_rail_z])
            cube([frame_member_x, frame_mid_rail_len, frame_member_z], center = true);

        translate([frame_x, frame_lower_rail_y, frame_lower_rail_z])
            cube([frame_member_x, frame_lower_rail_len, frame_member_z], center = true);

        translate([frame_x, frame_right_post_y, frame_right_post_z])
            cube([frame_member_x, frame_member_y, frame_right_post_h], center = true);

        translate([frame_x, frame_left_post_y, frame_left_post_z])
            cube([frame_member_x, frame_member_y, frame_left_post_h], center = true);

        translate([frame_x, frame_center_post_y, frame_center_post_z])
            cube([frame_member_x, frame_member_y, frame_center_post_h], center = true);

        // Coaxial support blocks for the Ø40 shaft locations.
        bearing_block(link_pivot_left,  bearing_block_x, bearing_block_y, bearing_block_z, pin40_d, bearing_block_x_center);
        bearing_block(link_pivot_right, bearing_block_x, bearing_block_y, bearing_block_z, pin40_d, bearing_block_x_center);
        bearing_block(tri_pivot_b,      bearing_block_x, bearing_block_y, bearing_block_z, pin40_d, bearing_block_x_center);
        bearing_block(tri_pivot_c,      bearing_block_x, bearing_block_y, bearing_block_z, pin40_d, bearing_block_x_center);

        // Compact host block for the lower-left Ø30 pin.
        bearing_block(tri_pivot_a, host_block_x, host_block_y, host_block_z, pin30_d, host_block_x_center);
    }
}

module triangular_linkage_bracket() {
    color(bracket_color)
    union() {
        difference() {
            union() {
                // Three blended arms around an open triangular web.
                yz_capsule(tri_pivot_a, tri_pivot_b, tri_arm_d, tri_body_x);
                yz_capsule(tri_pivot_b, tri_pivot_c, tri_arm_d, tri_body_x);
                yz_capsule(tri_pivot_c, tri_pivot_a, tri_arm_d, tri_body_x);

                // Tubular bosses at the three pivots.
                yz_node(tri_pivot_b, tri_boss40_od, tri_boss40_len);
                yz_node(tri_pivot_c, tri_boss40_od, tri_boss40_len);
                yz_node(tri_pivot_a, tri_boss30_od, tri_boss30_len);
            }

            // Central relief opening.
            hull() {
                yz_node(tri_cut_1, tri_cutout_d, tri_boss40_len + 2 * eps);
                yz_node(tri_cut_2, tri_cutout_d, tri_boss40_len + 2 * eps);
                yz_node(tri_cut_3, tri_cutout_d, tri_boss40_len + 2 * eps);
            }

            // Pivot bores.
            for (p = [tri_pivot_b, tri_pivot_c])
                translate([0, p[0], p[1]])
                    x_cylinder(h = tri_boss40_len + 2 * eps, d = pin40_d + hole_clearance);

            translate([0, tri_pivot_a[0], tri_pivot_a[1]])
                x_cylinder(h = tri_boss30_len + 2 * eps, d = pin30_d + hole_clearance);
        }

        // Small spherical contact pads.
        for (p = tri_sphere_centers)
            translate([tri_sphere_x, p[0], p[1]])
                sphere(d = tri_sphere_d);
    }
}

module link_arm() {
    color(link_color)
    union() {
        difference() {
            union() {
                // Two swept paths form the U-shaped control link.
                strut_path(link_upper_path, link_bar_d, link_body_x);
                strut_path(link_lower_path, link_bar_d, link_body_x);

                // End bosses with Ø40 through-bores.
                yz_node(link_pivot_left,  link_boss_od, link_boss_len);
                yz_node(link_pivot_right, link_boss_od, link_boss_len);
            }

            for (p = [link_pivot_left, link_pivot_right])
                translate([0, p[0], p[1]])
                    x_cylinder(h = link_boss_len + 2 * eps, d = pin40_d + hole_clearance);

            // Shallow lateral locating recess on the left boss.
            translate([link_socket_x, link_pivot_left[0], link_pivot_left[1]])
                x_cylinder(h = link_socket_depth + eps, d = link_socket_d);
        }

        // Small spherical contact pads on the lateral face.
        for (p = link_sphere_centers)
            translate([link_sphere_x, p[0], p[1]])
                sphere(d = link_sphere_d);
    }
}

module upright_knuckle() {
    color(knuckle_color)
    union() {
        difference() {
            union() {
                yz_capsule(knuckle_lower, knuckle_upper, knuckle_bar_d, knuckle_body_x);
                yz_node(knuckle_lower, knuckle_boss_od, knuckle_boss_len);
                yz_node(knuckle_upper, knuckle_boss_od, knuckle_boss_len);
            }

            for (p = [knuckle_lower, knuckle_upper])
                translate([0, p[0], p[1]])
                    x_cylinder(h = knuckle_boss_len + 2 * eps, d = pin30_d + hole_clearance);
        }

        for (p = knuckle_sphere_centers)
            translate([knuckle_sphere_x, p[0], p[1]])
                sphere(d = knuckle_sphere_d);
    }
}

module pulley_disc_local() {
    color(pulley_color)
    difference() {
        union() {
            // Main disc.
            x_cylinder(h = pulley_thickness, d = pulley_outer_d);

            // Raised outer face rings.
            translate([-pulley_thickness / 2 + contact_overlap - pulley_face_ring_thick / 2, 0, 0])
                x_annular_cylinder(h = pulley_face_ring_thick, od = pulley_outer_d, id = pulley_face_ring_id);

            translate([ pulley_thickness / 2 - contact_overlap + pulley_face_ring_thick / 2, 0, 0])
                x_annular_cylinder(h = pulley_face_ring_thick, od = pulley_outer_d, id = pulley_face_ring_id);

            // Stepped hub stack.
            translate([-pulley_thickness / 2 + contact_overlap - pulley_hub_front_thick / 2, 0, 0])
                x_cylinder(h = pulley_hub_front_thick, d = pulley_hub_d);

            translate([
                -pulley_thickness / 2
                + contact_overlap
                - pulley_hub_front_thick
                + contact_overlap
                - pulley_cap_thick / 2,
                0, 0
            ])
                x_cylinder(h = pulley_cap_thick, d = pulley_cap_d);

            translate([pulley_thickness / 2 - contact_overlap + pulley_hub_rear_thick / 2, 0, 0])
                x_cylinder(h = pulley_hub_rear_thick, d = pulley_hub_rear_d);
        }

        // Five bolt-circle through-holes.
        for (i = [0 : pulley_bolt_count - 1])
            let (a = 90 + i * 360 / pulley_bolt_count)
                translate([0,
                           (pulley_bolt_circle_d / 2) * cos(a),
                           (pulley_bolt_circle_d / 2) * sin(a)])
                    x_cylinder(h = pulley_cut_h, d = pulley_bolt_d);

        // Small periodic rim notches.
        for (i = [0 : pulley_notch_count - 1])
            let (a = i * 360 / pulley_notch_count)
                translate([0,
                           pulley_notch_radius * cos(a),
                           pulley_notch_radius * sin(a)])
                    x_cylinder(h = pulley_thickness + 2 * eps, d = pulley_notch_d);
    }
}

module pulley_disc() {
    translate([pulley_center_x, tri_pivot_a[0], tri_pivot_a[1]])
        pulley_disc_local();
}

module pins_and_shafts() {
    color(pin_color)
    union() {
        // Four Ø40 shafts through the larger bores.
        for (p = shaft40_centers) {
            translate([pin40_x, p[0], p[1]])
                x_cylinder(h = pin40_len, d = pin40_d);

            translate([pin40_collar_left_x, p[0], p[1]])
                x_cylinder(h = pin40_collar_thick, d = pin40_collar_d);

            translate([pin40_collar_right_x, p[0], p[1]])
                x_cylinder(h = pin40_collar_thick, d = pin40_collar_d);
        }

        // Pair of grounded Ø30 pins.
        for (p = pin30_pair_centers)
            translate([pin30_pair_x, p[0], p[1]])
                x_cylinder(h = pin30_pair_len, d = pin30_d);

        // Lower-left Ø30 pin through the pulley/bracket/host location.
        translate([pin30_long_x, tri_pivot_a[0], tri_pivot_a[1]])
            x_cylinder(h = pin30_long_len, d = pin30_d);
    }
}

module upper_rocker_plate() {
    translate([top_plate_x, top_plate_y, top_plate_z])
    color(rocker_color)
    union() {
        difference() {
            linear_extrude(height = top_plate_thick, center = true, convexity = 4)
                xy_rounded_hull(top_plate_points, top_plate_corner_r);

            translate([top_plate_hole_xy[0], top_plate_hole_xy[1], 0])
                cylinder(h = top_plate_thick + 2 * eps, d = top_plate_hole_d, center = true);
        }

        // Underside hinge-eye details.
        for (p = top_lug_positions)
            translate([p[0], p[1], top_lug_z])
                y_annular_cylinder(h = top_lug_len, od = top_lug_od, id = top_lug_id);
    }
}

// -----------------------------
// Main unified assembly
// -----------------------------
module assembly() {
    union() {
        flat_bar();
        support_frame();

        triangular_linkage_bracket();
        link_arm();
        upright_knuckle();

        pulley_disc();
        pins_and_shafts();

        upper_rocker_plate();
    }
}

assembly();