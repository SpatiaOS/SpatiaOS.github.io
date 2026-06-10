// Retro portable TV / microwave-like appliance based on the reference image.
// All dimensions are estimated in millimeters and kept parametric.

// ---------- Global resolution ----------
$fn = 72;

// ---------- Numerical tolerances ----------
eps = 0.05;
front_overlap = 0.08;
min_feature = 0.01;
vector_epsilon = 0.001;

// ---------- Main cabinet dimensions ----------
body_width = 180;
body_depth = 84;
body_height = 78;
body_corner_radius = 1.8;

front_y = -body_depth / 2;
rear_y = body_depth / 2;
top_z = body_height / 2;
bottom_z = -body_height / 2;
body_right_x = body_width / 2;

// ---------- Front perimeter trim ----------
front_border_outer_margin = 3;
front_border_primary_width = 4;
front_border_secondary_width = 4;
front_border_outer_t = 1.4;
front_border_inner_t = 1.0;
front_border_corner_r = 2.5;

front_border_outer_w = body_width - 2 * front_border_outer_margin;
front_border_outer_h = body_height - 2 * front_border_outer_margin;
front_border_inner_w = front_border_outer_w - 2 * front_border_primary_width;
front_border_inner_h = front_border_outer_h - 2 * front_border_primary_width;
front_border_secondary_inner_w = front_border_inner_w - 2 * front_border_secondary_width;
front_border_secondary_inner_h = front_border_inner_h - 2 * front_border_secondary_width;

front_border_line_inset = 6;
front_border_line_width = 0.9;
front_border_line_t = 0.8;
front_border_line_out = 1.0;
front_border_line_x_span = body_width - 2 * front_border_line_inset;
front_border_line_z_span = body_height - 2 * front_border_line_inset;

// ---------- CRT screen / door area ----------
screen_center_x = -22;
screen_center_z = 0;

screen_frame_w = 122;
screen_frame_h = 66;

screen_shadow_outer_add = 8;
screen_shadow_inner_add = 2;
screen_shadow_t = 1.5;
screen_shadow_outer_r = 4.2;
screen_shadow_inner_r = 3.0;

screen_shadow_outer_w = screen_frame_w + screen_shadow_outer_add;
screen_shadow_outer_h = screen_frame_h + screen_shadow_outer_add;
screen_shadow_inner_w = screen_frame_w + screen_shadow_inner_add;
screen_shadow_inner_h = screen_frame_h + screen_shadow_inner_add;

screen_pane_w = 100;
screen_pane_h = 50;
screen_pane_r = 8;

screen_bezel_outer_add = 2;
screen_bezel_inner_extra_w = 12;
screen_bezel_inner_extra_h = 10;
screen_bezel_t = 3.0;
screen_bezel_outer_r = 4.0;
screen_bezel_inner_r = 8.5;

screen_bezel_outer_w = screen_frame_w + screen_bezel_outer_add;
screen_bezel_outer_h = screen_frame_h + screen_bezel_outer_add;
screen_bezel_inner_w = screen_pane_w + screen_bezel_inner_extra_w;
screen_bezel_inner_h = screen_pane_h + screen_bezel_inner_extra_h;

screen_gasket_outer_add_w = 8;
screen_gasket_outer_add_h = 8;
screen_gasket_t = 1.4;
screen_gasket_outer_r = 8.0;
screen_gasket_inner_r = 7.0;

screen_gasket_outer_w = screen_pane_w + screen_gasket_outer_add_w;
screen_gasket_outer_h = screen_pane_h + screen_gasket_outer_add_h;
screen_gasket_inner_w = screen_pane_w;
screen_gasket_inner_h = screen_pane_h;

screen_lens_depth = 1.8;
screen_lens_bevel = 2.2;
screen_lens_recess = 0.10;

screen_curve_out = 1.20;
screen_curve_d = 0.45;

screen_logo_text = "RETRO";
screen_logo_size = 3.0;
screen_logo_depth = 0.35;
screen_logo_z = -31;
screen_logo_embed = 0.15;
screen_logo_out = screen_bezel_t - screen_logo_embed;
screen_logo_spacing = 0.9;
logo_font = "Liberation Sans:style=Bold";

// ---------- Right-side control panel ----------
control_center_x = 62;
control_panel_w = 34;
control_panel_h = 68;
control_outer_margin = 2;

control_outer_w = control_panel_w + 2 * control_outer_margin;
control_outer_h = control_panel_h + 2 * control_outer_margin;

control_outer_ring_t = 1.6;
control_outer_ring_r = 2.0;
control_inner_ring_r = 1.0;
control_base_t = 1.2;
control_base_r = 0.8;

control_separator_w = 2.2;
control_separator_h = 72;
control_separator_t = 2.4;
control_separator_left_x = control_center_x - control_outer_w / 2;
control_separator_right_x = control_center_x + control_outer_w / 2;

control_top_inset = 7;
control_top_z = control_panel_h / 2 - control_top_inset;
control_top_w = control_panel_w - 7;
control_top_h = 8;
control_top_t = 0.9;
control_top_out = 0.8;
control_top_r = 0.6;

control_display_xoff = -5;
control_display_w = 12;
control_display_h = 3.2;
control_display_t = 0.7;
control_display_out = 1.45;
control_display_r = 0.4;

control_button_xoff = 6.5;
control_button_spacing = 3.5;
control_button_count = 3;
control_button_d = 2.3;
control_button_d_step = 0.25;
control_button_t = 0.7;
control_button_out = 1.45;
control_button_z = control_top_z;

control_grille_w = 25;
control_grille_h = 23;
control_grille_z = 9.5;
control_grille_r = 0.6;
control_grille_bg_t = 1.0;
control_grille_bg_out = 0.75;

control_grille_rows = 6;
control_grille_spacing = 3.5;
control_grille_first_z = 3.0;
control_grille_slat_w = control_grille_w - 4;
control_grille_slat_h = 0.9;
control_grille_slat_t = 0.8;
control_grille_slat_out = 1.45;

control_grille_tab_cols = 3;
control_grille_tab_x_start = -8;
control_grille_tab_spacing = 8;
control_grille_tab_stagger = 1.5;
control_grille_tab_z_offset = 1.35;
control_grille_tab_w = 0.9;
control_grille_tab_h = 2.2;
control_grille_tab_t = 0.7;
control_grille_tab_out = 1.52;

control_lower_w = 27;
control_lower_h = 31;
control_lower_z = -20.5;
control_lower_t = 1.1;
control_lower_out = 0.75;
control_lower_r = 0.8;

control_lower_border_margin = 1.5;
control_lower_border_w = control_lower_w + 2 * control_lower_border_margin;
control_lower_border_h = control_lower_h + 2 * control_lower_border_margin;
control_lower_border_t = 0.8;
control_lower_border_out = 1.35;
control_lower_border_r = 1.0;

// ---------- Top grooves and seams ----------
top_slot_depth = 1.5;
top_slot_insert_h = 0.35;
top_slot_insert_clearance = 0.35;
top_slot_r = 2.2;

top_slot1_w = 112;
top_slot1_d = 5.5;
top_slot1_x = -15;
top_slot1_y = -8;

top_slot2_w = 56;
top_slot2_d = 5.0;
top_slot2_x = 39;
top_slot2_y = -2;

top_line_h = 0.35;
top_line_w = 0.9;
top_line_margin_x = 7;
top_line_front_inset = 4;
top_line_rear_inset = 8;
top_line_side_inset = 10;

// ---------- Side-panel detail ----------
side_line_t = 0.9;
side_line_w = 1.2;
side_panel_y_span = body_depth - 18;
side_panel_z_span = body_height - 16;
side_front_line_y = front_y + 8;
side_rear_line_y = rear_y - 8;
side_top_line_z = side_panel_z_span / 2;
side_bottom_line_z = -side_panel_z_span / 2;

// ---------- Antenna assembly ----------
antenna_mount_x = 20;
antenna_mount_y = -5;
antenna_mount_w = 32;
antenna_mount_d = 8;
antenna_mount_h = 1.8;
antenna_mount_r = 1.2;

antenna_socket_d = 5.0;
antenna_socket_h = 0.9;
antenna_base_ball_d = 4.0;
antenna_ball_socket_overlap = 0.35;

antenna_base_dx = 6;
antenna_base_y_offset = -0.5;
antenna_base_z = top_z + antenna_mount_h - front_overlap + antenna_socket_h + antenna_base_ball_d / 2 - antenna_ball_socket_overlap;

antenna_base_left = [
    antenna_mount_x - antenna_base_dx,
    antenna_mount_y + antenna_base_y_offset,
    antenna_base_z
];

antenna_base_right = [
    antenna_mount_x + antenna_base_dx,
    antenna_mount_y + antenna_base_y_offset,
    antenna_base_z
];

antenna_left_tip = [-60, -22, top_z + 148];
antenna_right_tip = [108, -18, top_z + 122];

antenna_rod_d1 = 1.1;
antenna_rod_d2 = 0.85;
antenna_rod_d3 = 0.65;
antenna_collar_d = 1.8;

antenna_tip_block_w = 3.0;
antenna_tip_block_d = 1.6;
antenna_tip_block_h = 3.0;

// ---------- Colors for preview ----------
cabinet_col = [0.60, 0.61, 0.63];
cabinet_light_col = [0.73, 0.74, 0.76];
cabinet_dark_col = [0.38, 0.39, 0.40];
trim_col = [0.06, 0.06, 0.06];
black_col = [0.0, 0.0, 0.0];
glass_col = [0.46, 0.49, 0.50];
metal_col = [0.78, 0.78, 0.76];
antenna_col = [0.08, 0.08, 0.08];

// ---------- Utility functions ----------
function clamp(x, lo, hi) = min(max(x, lo), hi);
function v_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function v_len(v) = sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
function v_lerp(a, b, t) = [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
];

function front_layer_y(t, out = 0) = front_y - t / 2 - out + front_overlap;
function right_side_layer_x(t, out = 0) = body_right_x + t / 2 + out - front_overlap;

// ---------- 2D / 3D helper modules ----------
module rounded_rect_2d(w, h, r) {
    if (r <= 0) {
        square([w, h], center = true);
    } else {
        offset(r = r) {
            square(
                [
                    max(w - 2 * r, min_feature),
                    max(h - 2 * r, min_feature)
                ],
                center = true
            );
        }
    }
}

module rounded_prism_z(w, d, h, r) {
    linear_extrude(height = h, center = true, convexity = 8) {
        rounded_rect_2d(w, d, r);
    }
}

module rounded_box(w, d, h, r) {
    if (r <= 0) {
        cube([w, d, h], center = true);
    } else {
        minkowski() {
            cube(
                [
                    max(w - 2 * r, min_feature),
                    max(d - 2 * r, min_feature),
                    max(h - 2 * r, min_feature)
                ],
                center = true
            );
            sphere(r = r);
        }
    }
}

// Creates a rounded rectangle solid on the front X-Z plane, extruded along Y.
module face_solid(w, h, t, r) {
    rotate([90, 0, 0]) {
        linear_extrude(height = t, center = true, convexity = 8) {
            rounded_rect_2d(w, h, r);
        }
    }
}

// Creates a rounded rectangular ring on the front X-Z plane.
module face_ring(outer_w, outer_h, inner_w, inner_h, t, outer_r, inner_r) {
    rotate([90, 0, 0]) {
        linear_extrude(height = t, center = true, convexity = 10) {
            difference() {
                rounded_rect_2d(outer_w, outer_h, outer_r);
                rounded_rect_2d(inner_w, inner_h, inner_r);
            }
        }
    }
}

module place_front_solid(x, z, w, h, t, r, out = 0) {
    translate([x, front_layer_y(t, out), z]) {
        face_solid(w, h, t, r);
    }
}

module place_front_ring(x, z, outer_w, outer_h, inner_w, inner_h, t, outer_r, inner_r, out = 0) {
    translate([x, front_layer_y(t, out), z]) {
        face_ring(outer_w, outer_h, inner_w, inner_h, t, outer_r, inner_r);
    }
}

module front_box(x, z, w, h, t, out = 0) {
    translate([x, front_layer_y(t, out), z]) {
        cube([w, t, h], center = true);
    }
}

module front_disk(x, z, d, t, out = 0) {
    translate([x, front_layer_y(t, out), z]) {
        rotate([90, 0, 0]) {
            cylinder(h = t, d = d, center = true);
        }
    }
}

module front_text_object(label, size, depth) {
    rotate([90, 0, 0]) {
        linear_extrude(height = depth, center = true, convexity = 4) {
            text(
                label,
                size = size,
                font = logo_font,
                halign = "center",
                valign = "center",
                spacing = screen_logo_spacing
            );
        }
    }
}

module right_side_bar(y, z, len_y, h_z, t, out = 0) {
    translate([right_side_layer_x(t, out), y, z]) {
        cube([t, len_y, h_z], center = true);
    }
}

module rod_between(p1, p2, d) {
    let(v = v_sub(p2, p1), l = v_len(v)) {
        if (l > vector_epsilon) {
            if (abs(v[0]) < vector_epsilon && abs(v[1]) < vector_epsilon) {
                translate(p1) {
                    cylinder(h = l, d = d, center = false);
                }
            } else {
                translate(p1) {
                    rotate(
                        a = acos(clamp(v[2] / l, -1, 1)),
                        v = [-v[1], v[0], 0]
                    ) {
                        cylinder(h = l, d = d, center = false);
                    }
                }
            }
        }
    }
}

// Shallow CRT-like lens: larger at the rear, slightly smaller at the front.
module beveled_front_lens(w, h, depth, r, bevel) {
    hull() {
        translate([0, depth / 2, 0]) {
            face_solid(w, h, min_feature * 8, r);
        }
        translate([0, -depth / 2, 0]) {
            face_solid(
                w - 2 * bevel,
                h - 2 * bevel,
                min_feature * 8,
                max(r - bevel, min_feature)
            );
        }
    }
}

// ---------- Main cabinet ----------
module cabinet_shell() {
    color(cabinet_col) {
        difference() {
            rounded_box(body_width, body_depth, body_height, body_corner_radius);

            // Recessed top grooves visible in the reference image.
            translate([top_slot1_x, top_slot1_y, top_z - top_slot_depth / 2 + eps]) {
                rounded_prism_z(top_slot1_w, top_slot1_d, top_slot_depth + 2 * eps, top_slot_r);
            }

            translate([top_slot2_x, top_slot2_y, top_z - top_slot_depth / 2 + eps]) {
                rounded_prism_z(top_slot2_w, top_slot2_d, top_slot_depth + 2 * eps, top_slot_r);
            }
        }
    }
}

// ---------- Top seam lines and groove bottoms ----------
module top_details() {
    // Dark bottoms inside the shallow top recesses.
    color(trim_col) {
        translate([top_slot1_x, top_slot1_y, top_z - top_slot_depth + top_slot_insert_h / 2 - eps]) {
            rounded_prism_z(
                top_slot1_w - 2 * top_slot_insert_clearance,
                top_slot1_d - 2 * top_slot_insert_clearance,
                top_slot_insert_h,
                max(top_slot_r - top_slot_insert_clearance, min_feature)
            );
        }

        translate([top_slot2_x, top_slot2_y, top_z - top_slot_depth + top_slot_insert_h / 2 - eps]) {
            rounded_prism_z(
                top_slot2_w - 2 * top_slot_insert_clearance,
                top_slot2_d - 2 * top_slot_insert_clearance,
                top_slot_insert_h,
                max(top_slot_r - top_slot_insert_clearance, min_feature)
            );
        }
    }

    // Thin raised seams on the top panel.
    color(trim_col) {
        translate([0, front_y + top_line_front_inset, top_z + top_line_h / 2 - front_overlap]) {
            cube([body_width - 2 * top_line_margin_x, top_line_w, top_line_h], center = true);
        }

        translate([0, rear_y - top_line_rear_inset, top_z + top_line_h / 2 - front_overlap]) {
            cube([body_width - 2 * top_line_margin_x, top_line_w, top_line_h], center = true);
        }

        translate([body_right_x - top_line_side_inset, 0, top_z + top_line_h / 2 - front_overlap]) {
            cube([top_line_w, body_depth - 2 * top_line_margin_x, top_line_h], center = true);
        }
    }
}

// ---------- Front perimeter trim ----------
module front_outer_trim() {
    color(trim_col) {
        place_front_ring(
            0,
            0,
            front_border_outer_w,
            front_border_outer_h,
            front_border_inner_w,
            front_border_inner_h,
            front_border_outer_t,
            front_border_corner_r,
            front_border_corner_r
        );

        front_box(
            0,
            body_height / 2 - front_border_line_inset,
            front_border_line_x_span,
            front_border_line_width,
            front_border_line_t,
            front_border_line_out
        );

        front_box(
            0,
            -body_height / 2 + front_border_line_inset,
            front_border_line_x_span,
            front_border_line_width,
            front_border_line_t,
            front_border_line_out
        );

        front_box(
            -body_width / 2 + front_border_line_inset,
            0,
            front_border_line_width,
            front_border_line_z_span,
            front_border_line_t,
            front_border_line_out
        );

        front_box(
            body_width / 2 - front_border_line_inset,
            0,
            front_border_line_width,
            front_border_line_z_span,
            front_border_line_t,
            front_border_line_out
        );
    }

    color(cabinet_light_col) {
        place_front_ring(
            0,
            0,
            front_border_inner_w,
            front_border_inner_h,
            front_border_secondary_inner_w,
            front_border_secondary_inner_h,
            front_border_inner_t,
            front_border_corner_r,
            front_border_corner_r
        );
    }
}

// ---------- CRT screen assembly ----------
module screen_assembly() {
    // Dark outer outline around the large left door/screen.
    color(trim_col) {
        place_front_ring(
            screen_center_x,
            screen_center_z,
            screen_shadow_outer_w,
            screen_shadow_outer_h,
            screen_shadow_inner_w,
            screen_shadow_inner_h,
            screen_shadow_t,
            screen_shadow_outer_r,
            screen_shadow_inner_r
        );
    }

    // Thick raised gray bezel.
    color(cabinet_light_col) {
        place_front_ring(
            screen_center_x,
            screen_center_z,
            screen_bezel_outer_w,
            screen_bezel_outer_h,
            screen_bezel_inner_w,
            screen_bezel_inner_h,
            screen_bezel_t,
            screen_bezel_outer_r,
            screen_bezel_inner_r
        );
    }

    // Dark inner gasket around the screen pane.
    color(trim_col) {
        place_front_ring(
            screen_center_x,
            screen_center_z,
            screen_gasket_outer_w,
            screen_gasket_outer_h,
            screen_gasket_inner_w,
            screen_gasket_inner_h,
            screen_gasket_t,
            screen_gasket_outer_r,
            screen_gasket_inner_r
        );
    }

    // Slightly protruding beveled screen surface.
    color(glass_col) {
        translate([screen_center_x, front_y - screen_lens_recess, screen_center_z]) {
            beveled_front_lens(
                screen_pane_w,
                screen_pane_h,
                screen_lens_depth,
                screen_pane_r,
                screen_lens_bevel
            );
        }
    }

    // Subtle curved line on the glass, approximated by short rods.
    color(cabinet_dark_col) {
        curve_pts = [
            [screen_center_x - screen_pane_w * 0.42, front_y - screen_curve_out, -5.0],
            [screen_center_x - screen_pane_w * 0.20, front_y - screen_curve_out, -2.2],
            [screen_center_x + screen_pane_w * 0.02, front_y - screen_curve_out, 0.2],
            [screen_center_x + screen_pane_w * 0.24, front_y - screen_curve_out, 1.9],
            [screen_center_x + screen_pane_w * 0.42, front_y - screen_curve_out, 3.0]
        ];

        for (i = [0 : len(curve_pts) - 2]) {
            rod_between(curve_pts[i], curve_pts[i + 1], screen_curve_d);
        }
    }

    // Small brand mark centered on the lower bezel.
    color(trim_col) {
        translate([screen_center_x, front_layer_y(screen_logo_depth, screen_logo_out), screen_logo_z]) {
            front_text_object(screen_logo_text, screen_logo_size, screen_logo_depth);
        }
    }
}

// ---------- Right control panel ----------
module control_panel() {
    // Main panel outline and background.
    color(trim_col) {
        place_front_ring(
            control_center_x,
            0,
            control_outer_w,
            control_outer_h,
            control_panel_w,
            control_panel_h,
            control_outer_ring_t,
            control_outer_ring_r,
            control_inner_ring_r
        );

        front_box(
            control_separator_left_x,
            0,
            control_separator_w,
            control_separator_h,
            control_separator_t
        );

        front_box(
            control_separator_right_x,
            0,
            control_separator_w,
            control_separator_h,
            control_separator_t
        );
    }

    color(cabinet_col) {
        place_front_solid(
            control_center_x,
            0,
            control_panel_w,
            control_panel_h,
            control_base_t,
            control_base_r
        );
    }

    // Top display and button strip.
    color(cabinet_light_col) {
        place_front_solid(
            control_center_x,
            control_top_z,
            control_top_w,
            control_top_h,
            control_top_t,
            control_top_r,
            control_top_out
        );
    }

    color(trim_col) {
        place_front_solid(
            control_center_x + control_display_xoff,
            control_top_z,
            control_display_w,
            control_display_h,
            control_display_t,
            control_display_r,
            control_display_out
        );

        for (b = [0 : control_button_count - 1]) {
            front_disk(
                control_center_x + control_button_xoff + b * control_button_spacing,
                control_button_z,
                control_button_d - b * control_button_d_step,
                control_button_t,
                control_button_out
            );
        }
    }

    // Grille background.
    color(trim_col) {
        place_front_solid(
            control_center_x,
            control_grille_z,
            control_grille_w,
            control_grille_h,
            control_grille_bg_t,
            control_grille_r,
            control_grille_bg_out
        );
    }

    // Horizontal and staggered grille slats.
    color(cabinet_light_col) {
        for (row = [0 : control_grille_rows - 1]) {
            let (
                zrow = control_grille_z - control_grille_h / 2
                     + control_grille_first_z
                     + row * control_grille_spacing
            ) {
                front_box(
                    control_center_x,
                    zrow,
                    control_grille_slat_w,
                    control_grille_slat_h,
                    control_grille_slat_t,
                    control_grille_slat_out
                );
            }
        }

        for (row = [0 : control_grille_rows - 2]) {
            let (
                ztab = control_grille_z - control_grille_h / 2
                     + control_grille_first_z
                     + control_grille_tab_z_offset
                     + row * control_grille_spacing
            ) {
                for (col = [0 : control_grille_tab_cols - 1]) {
                    let (
                        xoff = control_grille_tab_x_start
                             + col * control_grille_tab_spacing
                             + ((row % 2) == 0 ? control_grille_tab_stagger : -control_grille_tab_stagger)
                    ) {
                        front_box(
                            control_center_x + xoff,
                            ztab,
                            control_grille_tab_w,
                            control_grille_tab_h,
                            control_grille_tab_t,
                            control_grille_tab_out
                        );
                    }
                }
            }
        }
    }

    // Lower black rectangular block on the control panel.
    color(black_col) {
        place_front_solid(
            control_center_x,
            control_lower_z,
            control_lower_w,
            control_lower_h,
            control_lower_t,
            control_lower_r,
            control_lower_out
        );
    }

    color(trim_col) {
        place_front_ring(
            control_center_x,
            control_lower_z,
            control_lower_border_w,
            control_lower_border_h,
            control_lower_w,
            control_lower_h,
            control_lower_border_t,
            control_lower_border_r,
            control_lower_r,
            control_lower_border_out
        );
    }
}

// ---------- Right side panel trim ----------
module side_details() {
    color(trim_col) {
        // Large inset-style rectangle on the right side face.
        right_side_bar(0, side_top_line_z, side_panel_y_span, side_line_w, side_line_t);
        right_side_bar(0, side_bottom_line_z, side_panel_y_span, side_line_w, side_line_t);
        right_side_bar(side_front_line_y, 0, side_line_w, side_panel_z_span, side_line_t);
        right_side_bar(side_rear_line_y, 0, side_line_w, side_panel_z_span, side_line_t);

        // Extra rear vertical seam similar to the stepped casing line.
        right_side_bar(rear_y - top_line_rear_inset, 0, side_line_w, body_height - 12, side_line_t);
    }
}

// ---------- Antennas ----------
module antenna_element(base, tip) {
    let (
        p1 = v_lerp(base, tip, 0.42),
        p2 = v_lerp(base, tip, 0.72)
    ) {
        rod_between(base, p1, antenna_rod_d1);
        rod_between(p1, p2, antenna_rod_d2);
        rod_between(p2, tip, antenna_rod_d3);

        translate(p1) {
            sphere(d = antenna_collar_d);
        }

        translate(p2) {
            sphere(d = antenna_collar_d);
        }

        translate(tip) {
            cube([antenna_tip_block_w, antenna_tip_block_d, antenna_tip_block_h], center = true);
        }
    }
}

module antenna_assembly() {
    // Top mounting block.
    color(trim_col) {
        translate([antenna_mount_x, antenna_mount_y, top_z + antenna_mount_h / 2 - front_overlap]) {
            rounded_prism_z(antenna_mount_w, antenna_mount_d, antenna_mount_h, antenna_mount_r);
        }
    }

    // Socket disks and ball joints.
    color(metal_col) {
        translate([
            antenna_base_left[0],
            antenna_base_left[1],
            top_z + antenna_mount_h - front_overlap + antenna_socket_h / 2
        ]) {
            cylinder(h = antenna_socket_h, d = antenna_socket_d, center = true);
        }

        translate([
            antenna_base_right[0],
            antenna_base_right[1],
            top_z + antenna_mount_h - front_overlap + antenna_socket_h / 2
        ]) {
            cylinder(h = antenna_socket_h, d = antenna_socket_d, center = true);
        }

        translate(antenna_base_left) {
            sphere(d = antenna_base_ball_d);
        }

        translate(antenna_base_right) {
            sphere(d = antenna_base_ball_d);
        }
    }

    // Twin telescoping rods.
    color(antenna_col) {
        antenna_element(antenna_base_left, antenna_left_tip);
        antenna_element(antenna_base_right, antenna_right_tip);
    }
}

// ---------- Complete model ----------
module retro_appliance_model() {
    union() {
        cabinet_shell();
        top_details();
        side_details();
        front_outer_trim();
        screen_assembly();
        control_panel();
        antenna_assembly();
    }
}

retro_appliance_model();