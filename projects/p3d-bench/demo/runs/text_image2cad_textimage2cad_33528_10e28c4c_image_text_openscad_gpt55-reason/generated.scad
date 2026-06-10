// Parametric DJ-style console assembly reconstruction
// Units: millimeters

$fn = 72;
eps = 0.05;

// -----------------------------------------------------------------------------
// Global housing dimensions
// -----------------------------------------------------------------------------
base_l = 309.0;
base_w = 245.0;
base_h = 28.0;
base_corner_r = 6.0;
base_top_chamfer = 2.5;

cover_l = 300.0;
cover_w = 230.0;
cover_z0 = 18.0;
cover_h = 27.0;
cover_top_z = cover_z0 + cover_h;
cover_corner_r = 7.0;
cover_top_chamfer = 4.0;

front_y = -base_w / 2;
back_y = base_w / 2;
left_x = -base_l / 2;
right_x = base_l / 2;

component_overlap = 0.20;

// -----------------------------------------------------------------------------
// Repeated tactile spacer-block pads
// -----------------------------------------------------------------------------
button_w = 18.87;
button_d = 12.09;
button_h = 5.0;
button_corner_r = 1.0;
button_top_chamfer = 1.15;
button_clearance = 0.75;
button_recess_depth = 1.0;
cutout_corner_r = 1.0;

// 26 spacer-block locations: [x, y, rotation_z]
button_positions = [
    [-134, -38, 0], [-113, -61, 0], [-135, -12, 0], [-73, -82, 0],

    [-35, 97, 0], [-5, 97, 0],
    [-35, 72, 0], [-5, 72, 0], [25, 72, 0],
    [-25, 47, 0], [5, 47, 0], [35, 47, 0],
    [-20, 20, 0], [10, 20, 0],

    [62, 86, 0], [92, 86, 0], [122, 86, 0],
    [72, 58, 0], [102, 58, 0], [132, 58, 0],
    [70, 28, 0], [100, 28, 0], [130, 28, 0],
    [128, -10, 0],

    [54, -103, 0], [84, -103, 0]
];

// -----------------------------------------------------------------------------
// Jog-wheel cap dimensions
// -----------------------------------------------------------------------------
jog_d = 86.0;
jog_side_d = 80.0;
jog_top_d = 74.0;
jog_plateau_d = 60.5;

jog_skirt_h = 6.0;
jog_side_band_h = 7.0;
jog_upper_taper_h = 3.0;
jog_top_annulus_h = 1.0;
jog_plateau_h = 1.0;
jog_cap_h = jog_skirt_h + jog_side_band_h + jog_upper_taper_h + jog_top_annulus_h + jog_plateau_h;

jog_recess_d = 92.0;
jog_recess_depth = 1.4;

jog_slot_count = 14;
jog_slot_depth = 7.0;
jog_slot_width = 3.2;
jog_slot_h = 7.6;
jog_slot_center_z = 8.8;

jog_indicator_r = 3.5;
jog_indicator_h = 2.7;
jog_indicator_offset = 21.0;

// [x, y, indicator_angle]
jog_positions = [
    [-92, 38, 55],
    [84, -52, 125]
];

// -----------------------------------------------------------------------------
// Socket posts and plain pins
// -----------------------------------------------------------------------------
socket_post_h = 17.0;
socket_post_base_d = 14.89;
socket_post_hole_d = 1.178;
socket_post_flange_h = 2.5;
socket_post_lower_cone_h = 4.0;
socket_post_mid_cone_h = 6.5;
socket_post_top_h = socket_post_h - socket_post_flange_h - socket_post_lower_cone_h - socket_post_mid_cone_h;
socket_post_top_d = 5.2;
socket_post_lug_size = [3.0, 2.4, 4.0];
socket_post_lug_radial_offset = 1.25;
socket_seat_depth = 0.7;

// [x, y, lug_angle]
socket_positions = [
    [-58, 102, 15],
    [40, 102, -20],
    [82, 104, 10],
    [112, 102, -10],
    [52, 60, 40],
    [48, 32, 70],
    [102, 10, 20],
    [136, -32, -10]
];

pin_d = 1.5;
pin_len = 11.0;
pin_hole_d = 2.0;
pin_socket_depth = 2.0;

// 11 plain vertical pins
pin_positions = [
    [-18, 106],
    [12, 106],
    [70, 102],
    [98, 102],
    [126, 102],
    [-52, 74],
    [18, 58],
    [57, 15],
    [85, 15],
    [115, 15],
    [138, -72]
];

// -----------------------------------------------------------------------------
// Front flanged bushings / jack connectors
// -----------------------------------------------------------------------------
bushing_flange_d = 18.2;
bushing_flange_h = 2.4;
bushing_boss_d = 10.06;
bushing_boss_len = 5.0;
bushing_nose_len = 2.4;
bushing_nose_d = 8.0;
bushing_bore_d = 4.92;
bushing_counter_h = 1.7;
bushing_counter_d = 9.0;
bushing_total_h = bushing_flange_h + bushing_boss_len + bushing_nose_len;
bushing_panel_overlap = 0.6;

jack_panel_hole_d = bushing_bore_d + 0.8;
jack_panel_hole_depth = 12.0;

// [x, z]
bushing_positions = [
    [-98, 23],
    [-76, 20],
    [-54, 23],
    [-32, 20],
    [-10, 23],
    [12, 20]
];

// -----------------------------------------------------------------------------
// Wedge guide blocks and structural bars
// -----------------------------------------------------------------------------
wedge_width = 8.0;
wedge_length = 14.0;
wedge_height = 18.0;
wedge_top_width = 5.5;
wedge_groove_top_w = 4.0;
wedge_groove_bottom_w = 1.0;
wedge_groove_depth = 1.5;

bar_length = 20.0;
bar_width = 2.0;
bar_height = 1.10;

fader_cluster_x = -4.0;
fader_cluster_y = -24.0;
fader_cluster_radius = 23.0;
fader_cluster_start_angle = 90.0;

// -----------------------------------------------------------------------------
// Ball studs and locating pins
// -----------------------------------------------------------------------------
ball_head_d = 18.2;
ball_head_r = ball_head_d / 2;
ball_collar_d = 12.0;
ball_collar_h = 4.0;
ball_dome_h = 6.0;
ball_bore_d = 4.92;
ball_stud_h = ball_collar_h + ball_dome_h;

// [x, y, rotation]
ball_stud_positions = [
    [-130, -88, 0],
    [124, -88, 0]
];

locating_head_d = 14.9;
locating_head_r = locating_head_d / 2;
locating_shank_d = 5.5;
locating_shank_h = 8.0;
locating_taper_h = 4.0;
locating_dome_h = 5.0;
locating_pin_h = locating_shank_h + locating_taper_h + locating_dome_h;
locating_cross_hole_d = 1.178;
locating_cross_hole_z = 5.0;
locating_slot_w = 2.2;
locating_slot_h = 4.2;
locating_slot_z = 2.1;

// [x, y, rotation]
locating_pin_positions = [
    [-24, -74, 0],
    [20, -76, 120],
    [136, -65, 240]
];

// -----------------------------------------------------------------------------
// Peripheral bosses, tab, grooves, and decorative cuts
// -----------------------------------------------------------------------------
corner_boss_d = 7.6;
corner_boss_cyl_h = 2.2;
corner_boss_dome_h = 1.2;
corner_boss_hole_d = 2.3;

corner_boss_positions = [
    [-cover_l / 2 + 11, -cover_w / 2 + 11],
    [ cover_l / 2 - 11, -cover_w / 2 + 11],
    [-cover_l / 2 + 11,  cover_w / 2 - 11],
    [ cover_l / 2 - 11,  cover_w / 2 - 11]
];

tab_length_x = 26.0;
tab_depth_y = 20.0;
tab_height = 3.0;
tab_corner_r = 3.0;
tab_outset = 4.5;
tab_embed = 0.4;
tab_center_x = -cover_l / 2 + tab_length_x / 2 - tab_outset;
tab_center_y = 86.0;
tab_hole_d = 3.6;
tab_hole_x = tab_center_x - tab_length_x * 0.28;
tab_hole_y = tab_center_y;

top_border_l = 276.0;
top_border_d = 206.0;
top_border_r = 5.0;
top_border_line_w = 1.25;
top_border_cut_depth = 0.55;

surface_groove_depth = 0.65;

// [x, y, rotation_z, length, width]
surface_grooves = [
    [-92, -18, 0, 52, 3.0],
    [-52, -74, 0, 44, 2.4],
    [55, -22, 0, 48, 2.6],
    [-126, -72, 0, 30, 2.2],

    [fader_cluster_x, fader_cluster_y, fader_cluster_start_angle, 48, 2.4],
    [fader_cluster_x, fader_cluster_y, fader_cluster_start_angle + 120, 48, 2.4],
    [fader_cluster_x, fader_cluster_y, fader_cluster_start_angle + 240, 48, 2.4]
];

front_recess_depth = 2.6;
front_recess_z = 22.0;
front_recess_h = 22.0;
front_recess1_x = -55.0;
front_recess1_w = 142.0;
front_recess2_x = 92.0;
front_recess2_w = 84.0;
front_seam_w = 1.4;
front_seam_xs = [-132, 18, 48, 136];

side_groove_depth = 1.8;
side_groove_h = 1.4;
side_groove_zs = [8.5, 27.0];

base_notch_size = 18.0;
base_notch_center_x = left_x + 6.0;
base_notch_center_y = front_y + 6.0;

blind_hole_d1 = 6.9;
blind_hole_d2 = 8.9;
blind_hole_depth = 10.0;
blind_hole_z = 22.0;
blind_hole_y1 = 78.0;
blind_hole_y2 = -82.0;

// -----------------------------------------------------------------------------
// 2D helper profiles
// -----------------------------------------------------------------------------
module rounded_rect_2d(w, d, r) {
    if (r <= 0) {
        square([w, d], center = true);
    } else {
        hull() {
            for (x = [-w / 2 + r, w / 2 - r])
                for (y = [-d / 2 + r, d / 2 - r])
                    translate([x, y])
                        circle(r = r);
        }
    }
}

module rounded_rect_ring_2d(w, d, r, t) {
    difference() {
        rounded_rect_2d(w, d, r);
        rounded_rect_2d(w - 2 * t, d - 2 * t, max(r - t, 0.01));
    }
}

module rounded_slot_2d(l, w) {
    if (l <= w) {
        circle(d = w);
    } else {
        hull() {
            translate([-(l - w) / 2, 0])
                circle(d = w);
            translate([(l - w) / 2, 0])
                circle(d = w);
        }
    }
}

// -----------------------------------------------------------------------------
// 3D helper solids
// -----------------------------------------------------------------------------
module spherical_cap(radius, height) {
    intersection() {
        translate([0, 0, height - radius])
            sphere(r = radius);
        cylinder(h = height, r = radius, center = false);
    }
}

module chamfered_slab(l, d, h, r, ch) {
    if (ch > 0) {
        union() {
            linear_extrude(height = h - ch, center = false, convexity = 4)
                rounded_rect_2d(l, d, r);

            translate([0, 0, h - ch])
                linear_extrude(
                    height = ch,
                    center = false,
                    convexity = 4,
                    scale = [(l - 2 * ch) / l, (d - 2 * ch) / d]
                )
                    rounded_rect_2d(l, d, r);
        }
    } else {
        linear_extrude(height = h, center = false, convexity = 4)
            rounded_rect_2d(l, d, r);
    }
}

module spacer_block(w = button_w, d = button_d, h = button_h, r = button_corner_r, ch = button_top_chamfer) {
    union() {
        linear_extrude(height = h - ch, center = false, convexity = 4)
            rounded_rect_2d(w, d, r);

        translate([0, 0, h - ch])
            linear_extrude(
                height = ch,
                center = false,
                convexity = 4,
                scale = [(w - 2 * ch) / w, (d - 2 * ch) / d]
            )
                rounded_rect_2d(w, d, r);
    }
}

// -----------------------------------------------------------------------------
// Main housing body and subtractive panel details
// -----------------------------------------------------------------------------
module raised_tab_body() {
    translate([tab_center_x, tab_center_y, cover_top_z - tab_embed])
        linear_extrude(height = tab_height + tab_embed, center = false, convexity = 4)
            rounded_rect_2d(tab_length_x, tab_depth_y, tab_corner_r);
}

module corner_bosses_body() {
    for (p = corner_boss_positions) {
        translate([p[0], p[1], cover_top_z - component_overlap])
            cylinder(h = corner_boss_cyl_h + component_overlap, d = corner_boss_d, center = false);

        translate([p[0], p[1], cover_top_z + corner_boss_cyl_h - eps])
            spherical_cap(corner_boss_d / 2, corner_boss_dome_h + eps);
    }
}

module top_border_groove_cut() {
    translate([0, 0, cover_top_z - top_border_cut_depth])
        linear_extrude(height = top_border_cut_depth + 2 * eps, center = false, convexity = 4)
            rounded_rect_ring_2d(top_border_l, top_border_d, top_border_r, top_border_line_w);
}

module button_pocket_cuts() {
    for (p = button_positions) {
        translate([p[0], p[1], cover_top_z - button_recess_depth])
            rotate([0, 0, p[2]])
                linear_extrude(height = button_recess_depth + 2 * eps, center = false, convexity = 4)
                    rounded_rect_2d(
                        button_w + 2 * button_clearance,
                        button_d + 2 * button_clearance,
                        cutout_corner_r
                    );
    }
}

module jog_recess_cuts() {
    for (j = jog_positions) {
        translate([j[0], j[1], cover_top_z - jog_recess_depth])
            cylinder(h = jog_recess_depth + 2 * eps, d = jog_recess_d, center = false);
    }
}

module socket_and_pin_hole_cuts() {
    for (p = socket_positions) {
        translate([p[0], p[1], cover_top_z - socket_seat_depth])
            cylinder(h = socket_seat_depth + 2 * eps, d = socket_post_base_d + 1.0, center = false);
    }

    for (p = pin_positions) {
        translate([p[0], p[1], cover_top_z - pin_socket_depth])
            cylinder(h = pin_socket_depth + 2 * eps, d = pin_hole_d, center = false);
    }
}

module surface_groove_cuts() {
    for (g = surface_grooves) {
        translate([g[0], g[1], cover_top_z - surface_groove_depth])
            rotate([0, 0, g[2]])
                linear_extrude(height = surface_groove_depth + 2 * eps, center = false, convexity = 4)
                    rounded_slot_2d(g[3], g[4]);
    }
}

module front_panel_recess_cuts() {
    translate([front_recess1_x, front_y + front_recess_depth / 2 - eps, front_recess_z])
        cube([front_recess1_w, front_recess_depth + 2 * eps, front_recess_h], center = true);

    translate([front_recess2_x, front_y + front_recess_depth / 2 - eps, front_recess_z])
        cube([front_recess2_w, front_recess_depth + 2 * eps, front_recess_h], center = true);

    for (x = front_seam_xs) {
        translate([x, front_y + front_recess_depth / 2 - eps, front_recess_z])
            cube([front_seam_w, front_recess_depth + 2 * eps, front_recess_h + 4], center = true);
    }
}

module side_groove_cuts() {
    for (zg = side_groove_zs) {
        translate([0, front_y + side_groove_depth / 2 - eps, zg])
            cube([base_l - 24, side_groove_depth + 2 * eps, side_groove_h], center = true);

        translate([0, back_y - side_groove_depth / 2 + eps, zg])
            cube([base_l - 24, side_groove_depth + 2 * eps, side_groove_h], center = true);

        translate([left_x + side_groove_depth / 2 - eps, 0, zg])
            cube([side_groove_depth + 2 * eps, base_w - 24, side_groove_h], center = true);

        translate([right_x - side_groove_depth / 2 + eps, 0, zg])
            cube([side_groove_depth + 2 * eps, base_w - 24, side_groove_h], center = true);
    }
}

module bushing_panel_hole_cuts() {
    for (b = bushing_positions) {
        translate([b[0], front_y + jack_panel_hole_depth / 2 - eps, b[1]])
            rotate([90, 0, 0])
                cylinder(h = jack_panel_hole_depth + 2 * eps, d = jack_panel_hole_d, center = true);
    }
}

module blind_side_hole_cuts() {
    translate([left_x + blind_hole_depth / 2 - eps, blind_hole_y1, blind_hole_z])
        rotate([0, 90, 0])
            cylinder(h = blind_hole_depth + 2 * eps, d = blind_hole_d1, center = true);

    translate([right_x - blind_hole_depth / 2 + eps, blind_hole_y2, blind_hole_z])
        rotate([0, 90, 0])
            cylinder(h = blind_hole_depth + 2 * eps, d = blind_hole_d2, center = true);
}

module tab_and_boss_hole_cuts() {
    translate([tab_hole_x, tab_hole_y, cover_top_z - tab_embed - eps])
        cylinder(h = tab_height + tab_embed + 2 * eps, d = tab_hole_d, center = false);

    for (p = corner_boss_positions) {
        translate([p[0], p[1], cover_top_z - component_overlap - eps])
            cylinder(
                h = corner_boss_cyl_h + corner_boss_dome_h + component_overlap + 3 * eps,
                d = corner_boss_hole_d,
                center = false
            );
    }
}

module base_corner_notch_cut() {
    translate([base_notch_center_x, base_notch_center_y, base_h / 2])
        rotate([0, 0, 45])
            cube([base_notch_size, base_notch_size, base_h + 2 * eps], center = true);
}

module housing_cuts() {
    top_border_groove_cut();
    button_pocket_cuts();
    jog_recess_cuts();
    socket_and_pin_hole_cuts();
    surface_groove_cuts();
    front_panel_recess_cuts();
    side_groove_cuts();
    bushing_panel_hole_cuts();
    blind_side_hole_cuts();
    tab_and_boss_hole_cuts();
    base_corner_notch_cut();
}

module housing_body() {
    difference() {
        union() {
            chamfered_slab(base_l, base_w, base_h, base_corner_r, base_top_chamfer);

            translate([0, 0, cover_z0])
                chamfered_slab(cover_l, cover_w, cover_h, cover_corner_r, cover_top_chamfer);

            raised_tab_body();
            corner_bosses_body();
        }

        housing_cuts();
    }
}

// -----------------------------------------------------------------------------
// Control components
// -----------------------------------------------------------------------------
module jog_cap(indicator_angle = 45) {
    union() {
        difference() {
            union() {
                cylinder(h = jog_skirt_h, d1 = jog_d, d2 = jog_side_d, center = false);

                translate([0, 0, jog_skirt_h - eps])
                    cylinder(h = jog_side_band_h + eps, d = jog_side_d, center = false);

                translate([0, 0, jog_skirt_h + jog_side_band_h - eps])
                    cylinder(h = jog_upper_taper_h + eps, d1 = jog_side_d, d2 = jog_top_d, center = false);

                translate([0, 0, jog_skirt_h + jog_side_band_h + jog_upper_taper_h - eps])
                    cylinder(h = jog_top_annulus_h + eps, d = jog_top_d, center = false);

                translate([0, 0, jog_cap_h - jog_plateau_h])
                    cylinder(h = jog_plateau_h, d = jog_plateau_d, center = false);
            }

            for (i = [0 : jog_slot_count - 1]) {
                rotate([0, 0, i * 360 / jog_slot_count])
                    translate([jog_d / 2 - jog_slot_depth / 2 + 0.2, 0, jog_slot_center_z])
                        cube([jog_slot_depth, jog_slot_width, jog_slot_h], center = true);
            }
        }

        translate([
            jog_indicator_offset * cos(indicator_angle),
            jog_indicator_offset * sin(indicator_angle),
            jog_cap_h - eps
        ])
            spherical_cap(jog_indicator_r, jog_indicator_h);
    }
}

module socket_post(lug_angle = 0) {
    rotate([0, 0, lug_angle])
        difference() {
            union() {
                cylinder(h = socket_post_flange_h, d = socket_post_base_d, center = false);

                translate([0, 0, socket_post_flange_h - eps])
                    cylinder(
                        h = socket_post_lower_cone_h + eps,
                        d1 = socket_post_base_d * 0.86,
                        d2 = socket_post_base_d * 0.60,
                        center = false
                    );

                translate([0, 0, socket_post_flange_h + socket_post_lower_cone_h - eps])
                    cylinder(
                        h = socket_post_mid_cone_h + eps,
                        d1 = socket_post_base_d * 0.60,
                        d2 = socket_post_top_d,
                        center = false
                    );

                translate([0, 0, socket_post_h - socket_post_top_h - eps])
                    cylinder(h = socket_post_top_h + eps, d = socket_post_top_d, center = false);

                translate([
                    socket_post_top_d / 2 + socket_post_lug_radial_offset,
                    0,
                    socket_post_h - socket_post_lug_size[2] / 2 - 1.0
                ])
                    cube(socket_post_lug_size, center = true);
            }

            translate([0, 0, -eps])
                cylinder(h = socket_post_h + 2 * eps, d = socket_post_hole_d, center = false);
        }
}

module plain_pin() {
    cylinder(h = pin_len, d = pin_d, center = false);
}

module flanged_bushing() {
    difference() {
        union() {
            cylinder(h = bushing_flange_h, d = bushing_flange_d, center = false);

            translate([0, 0, bushing_flange_h - eps])
                cylinder(h = bushing_boss_len + eps, d = bushing_boss_d, center = false);

            translate([0, 0, bushing_flange_h + bushing_boss_len - eps])
                cylinder(
                    h = bushing_nose_len + eps,
                    d1 = bushing_boss_d,
                    d2 = bushing_nose_d,
                    center = false
                );
        }

        translate([0, 0, -eps])
            cylinder(h = bushing_total_h + 2 * eps, d = bushing_bore_d, center = false);

        translate([0, 0, bushing_total_h - bushing_counter_h])
            cylinder(h = bushing_counter_h + 2 * eps, d1 = bushing_bore_d, d2 = bushing_counter_d, center = false);
    }
}

module ball_stud() {
    difference() {
        union() {
            cylinder(h = ball_collar_h, d = ball_collar_d, center = false);

            translate([0, 0, ball_collar_h - eps])
                spherical_cap(ball_head_r, ball_dome_h + eps);
        }

        translate([0, 0, -eps])
            cylinder(h = ball_stud_h + 2 * eps, d = ball_bore_d, center = false);
    }
}

module locating_pin(rotation_z = 0) {
    rotate([0, 0, rotation_z])
        difference() {
            union() {
                cylinder(h = locating_shank_h, d = locating_shank_d, center = false);

                translate([0, 0, locating_shank_h - eps])
                    cylinder(
                        h = locating_taper_h + eps,
                        d1 = locating_shank_d,
                        d2 = locating_head_d * 0.92,
                        center = false
                    );

                translate([0, 0, locating_shank_h + locating_taper_h - eps])
                    spherical_cap(locating_head_r, locating_dome_h + eps);
            }

            translate([0, 0, locating_cross_hole_z])
                rotate([0, 90, 0])
                    cylinder(h = locating_head_d + 2 * eps, d = locating_cross_hole_d, center = true);

            translate([0, 0, locating_slot_z])
                cube([locating_slot_w, locating_head_d + 2 * eps, locating_slot_h], center = true);
        }
}

module wedge_core(w, l, h, tw) {
    polyhedron(
        points = [
            [-w / 2, -l / 2, 0],
            [ w / 2, -l / 2, 0],
            [ w / 2,  l / 2, 0],
            [-w / 2,  l / 2, 0],

            [-tw / 2, -l / 2, h],
            [ tw / 2, -l / 2, h],
            [ tw / 2,  l / 2, h],
            [-tw / 2,  l / 2, h]
        ],
        faces = [
            [0, 3, 2, 1],
            [4, 5, 6, 7],
            [0, 1, 5, 4],
            [1, 2, 6, 5],
            [2, 3, 7, 6],
            [3, 0, 4, 7]
        ],
        convexity = 4
    );
}

module wedge_groove_cutter(l, h, top_w, bottom_w, depth) {
    polyhedron(
        points = [
            [-bottom_w / 2, -l / 2 - eps, h - depth],
            [ bottom_w / 2, -l / 2 - eps, h - depth],
            [ bottom_w / 2,  l / 2 + eps, h - depth],
            [-bottom_w / 2,  l / 2 + eps, h - depth],

            [-top_w / 2, -l / 2 - eps, h + eps],
            [ top_w / 2, -l / 2 - eps, h + eps],
            [ top_w / 2,  l / 2 + eps, h + eps],
            [-top_w / 2,  l / 2 + eps, h + eps]
        ],
        faces = [
            [0, 3, 2, 1],
            [4, 5, 6, 7],
            [0, 1, 5, 4],
            [1, 2, 6, 5],
            [2, 3, 7, 6],
            [3, 0, 4, 7]
        ],
        convexity = 4
    );
}

module wedge_guide_block() {
    difference() {
        wedge_core(wedge_width, wedge_length, wedge_height, wedge_top_width);
        wedge_groove_cutter(wedge_length, wedge_height, wedge_groove_top_w, wedge_groove_bottom_w, wedge_groove_depth);
    }
}

module structural_bar() {
    translate([0, 0, bar_height / 2])
        cube([bar_width, bar_length, bar_height], center = true);
}

// -----------------------------------------------------------------------------
// Placement modules
// -----------------------------------------------------------------------------
module place_spacer_blocks() {
    for (p = button_positions) {
        translate([p[0], p[1], cover_top_z - button_recess_depth - component_overlap])
            rotate([0, 0, p[2]])
                spacer_block();
    }
}

module place_jog_caps() {
    for (j = jog_positions) {
        translate([j[0], j[1], cover_top_z - jog_recess_depth - component_overlap])
            jog_cap(j[2]);
    }
}

module place_socket_posts() {
    for (p = socket_positions) {
        translate([p[0], p[1], cover_top_z - socket_seat_depth - component_overlap])
            socket_post(p[2]);
    }
}

module place_plain_pins() {
    for (p = pin_positions) {
        translate([p[0], p[1], cover_top_z - pin_socket_depth - component_overlap])
            plain_pin();
    }
}

module place_front_bushings() {
    for (b = bushing_positions) {
        translate([b[0], front_y + bushing_panel_overlap, b[1]])
            rotate([90, 0, 0])
                flanged_bushing();
    }
}

module place_fader_cluster() {
    for (i = [0 : 2]) {
        let (
            a = fader_cluster_start_angle + i * 120,
            px = fader_cluster_x + fader_cluster_radius * cos(a),
            py = fader_cluster_y + fader_cluster_radius * sin(a)
        ) {
            translate([px, py, cover_top_z - component_overlap])
                rotate([0, 0, a])
                    structural_bar();

            translate([px, py, cover_top_z - component_overlap])
                rotate([0, 0, a])
                    wedge_guide_block();
        }
    }
}

module place_ball_studs() {
    for (p = ball_stud_positions) {
        translate([p[0], p[1], cover_top_z - component_overlap])
            rotate([0, 0, p[2]])
                ball_stud();
    }
}

module place_locating_pins() {
    for (p = locating_pin_positions) {
        translate([p[0], p[1], cover_top_z - component_overlap])
            locating_pin(p[2]);
    }
}

module controls_and_hardware() {
    union() {
        place_spacer_blocks();
        place_jog_caps();
        place_socket_posts();
        place_plain_pins();
        place_front_bushings();
        place_fader_cluster();
        place_ball_studs();
        place_locating_pins();
    }
}

// -----------------------------------------------------------------------------
// Unified assembly
// -----------------------------------------------------------------------------
union() {
    housing_body();
    controls_and_hardware();
}