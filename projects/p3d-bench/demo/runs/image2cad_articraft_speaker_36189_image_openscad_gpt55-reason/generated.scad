// Retro dual-speaker tabletop console inspired by the reference image
// Units: millimeters

// =========================
// Global resolution
// =========================
$fn = 72;
$fa = 4;
$fs = 0.5;

// =========================
// Main body parameters
// =========================
body_width        = 160;
body_depth        = 42;
body_height       = 62;
body_bottom_z     = 72;
body_corner_r     = 3.5;

body_center_z     = body_bottom_z + body_height / 2;
body_top_z        = body_bottom_z + body_height;
body_front_y      = -body_depth / 2;

join_overlap      = 0.06;

// =========================
// Front face / panel
// =========================
front_panel_width     = body_width - 6;
front_panel_height    = body_height - 5;
front_panel_thickness = 2.4;
front_panel_radius    = 3.0;

front_panel_start_y   = body_front_y + join_overlap;
front_panel_face_y    = front_panel_start_y - front_panel_thickness;
front_feature_start_y = front_panel_face_y + join_overlap;

// =========================
// Speaker grille parameters
// =========================
speaker_x_offset      = 47.5;
speaker_z             = body_bottom_z + body_height * 0.51;

speaker_bezel_outer_r = 31.0;
speaker_grille_outer_d = 44.0;
speaker_grille_inner_d = 29.0;
speaker_center_d       = 26.0;

speaker_slot_count     = 48;
speaker_slot_width     = 1.15;

bezel_thick        = 1.7;
bezel_line_thick   = 2.05;
grille_base_thick  = 1.25;
slot_mark_thick    = 2.15;
center_disc_thick  = 2.45;

// =========================
// Central / chevron ornament parameters
// =========================
front_line_thick    = 1.8;
front_dark_line_t   = 2.25;
chevron_wide_line   = 3.8;
chevron_dark_line   = 1.2;

center_art_top_z    = body_top_z - 8;
center_art_bottom_z = body_bottom_z + 8;
center_art_mid_z    = speaker_z;

// =========================
// Top details
// =========================
top_seam_w       = 0.9;
top_seam_h       = 0.45;
top_seam_xs      = [-23, 27];

button_d         = 7.4;
button_h         = 1.8;
button_chamfer_h = 0.75;
button_spacing   = 12.0;
button_y         = -5.5;
button_start_x   = 42.0;
button_mark_h    = 0.18;

// =========================
// Leg parameters
// =========================
leg_top_d     = 8.8;
leg_foot_d    = 5.9;
leg_socket_d  = 10.8;
leg_socket_h  = 5.0;
leg_top_z     = body_bottom_z - 1.0;
leg_foot_z    = 5.2;

leg_top_points = [
    [-62, -14, leg_top_z],
    [-44,  12, leg_top_z],
    [ 52, -14, leg_top_z],
    [ 63,  12, leg_top_z]
];

leg_foot_points = [
    [-84, -43, leg_foot_z],
    [-36,  31, leg_foot_z + 1.8],
    [ 53, -44, leg_foot_z],
    [ 87,  35, leg_foot_z]
];

// =========================
// Preview colors
// =========================
body_col       = [0.52, 0.52, 0.55];
panel_col      = [0.64, 0.64, 0.67];
detail_col     = [0.72, 0.72, 0.75];
dark_col       = [0.015, 0.015, 0.018];
leg_col        = [0.74, 0.74, 0.77];


// =========================
// Helper functions
// =========================
function clamp(x, lo, hi) = min(max(x, lo), hi);

function regular_ngon_points(n, r, rot = 0) =
    [for (i = [0 : n - 1])
        [r * cos(rot + 360 * i / n), r * sin(rot + 360 * i / n)]
    ];


// =========================
// 2D helper modules
// =========================
module rounded_rect_2d(w, h, r) {
    offset(r = r)
        square([w - 2 * r, h - 2 * r], center = true);
}

module rounded_rect_ring_2d(w, h, r, line_w) {
    difference() {
        rounded_rect_2d(w, h, r);
        rounded_rect_2d(
            w - 2 * line_w,
            h - 2 * line_w,
            max(r - line_w, 0.1)
        );
    }
}

module ngon_2d(n, r, rot = 0) {
    polygon(points = regular_ngon_points(n, r, rot));
}

module octagonal_ring_2d(outer_r, inner_r) {
    difference() {
        ngon_2d(8, outer_r, 22.5);
        ngon_2d(8, inner_r, 22.5);
    }
}

module annulus_2d(outer_d, inner_d) {
    difference() {
        circle(d = outer_d);
        circle(d = inner_d);
    }
}

module stroke2d(points, width) {
    union() {
        for (i = [0 : len(points) - 2]) {
            hull() {
                translate(points[i])
                    circle(d = width);
                translate(points[i + 1])
                    circle(d = width);
            }
        }
    }
}

module radial_slots_2d(count, inner_d, outer_d, slot_w) {
    inner_r = inner_d / 2;
    outer_r = outer_d / 2;
    r_mid   = (inner_r + outer_r) / 2;
    base_l  = outer_r - inner_r;

    intersection() {
        annulus_2d(outer_d, inner_d);

        union() {
            for (i = [0 : count - 1]) {
                let(
                    slot_l = (i % 6 == 0) ? base_l * 1.30 :
                             (i % 2 == 0) ? base_l * 1.02 :
                                             base_l * 0.78,
                    slot_width_i = (i % 5 == 0) ? slot_w * 1.28 : slot_w
                )
                rotate(i * 360 / count)
                    translate([r_mid, 0])
                        square([slot_l, slot_width_i], center = true);
            }
        }
    }
}


// =========================
// 3D helper modules
// =========================
module rounded_box(w, d, h, r) {
    minkowski() {
        cube([w - 2 * r, d - 2 * r, h - 2 * r], center = true);
        sphere(r = r);
    }
}

// Extrude a 2D X/Z profile outward from the front face along -Y.
module front_extrude_at(t, start_y) {
    translate([0, start_y, 0])
        rotate([90, 0, 0])
            linear_extrude(height = t, convexity = 10)
                children();
}

// Cylinder/cone from point p1 to p2, useful for angled tapered legs.
module cylinder_between(p1, p2, d1, d2) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    seg_len = norm(v);
    axis = cross([0, 0, 1], v);
    angle = acos(clamp(v[2] / seg_len, -1, 1));

    translate(p1) {
        if (norm(axis) < 0.0001) {
            if (v[2] < 0)
                rotate([180, 0, 0])
                    cylinder(h = seg_len, d1 = d1, d2 = d2, center = false);
            else
                cylinder(h = seg_len, d1 = d1, d2 = d2, center = false);
        } else {
            rotate(a = angle, v = axis)
                cylinder(h = seg_len, d1 = d1, d2 = d2, center = false);
        }
    }
}


// =========================
// Main body and front plate
// =========================
module console_body() {
    // Rounded rectangular cabinet.
    color(body_col)
        translate([0, 0, body_center_z])
            rounded_box(body_width, body_depth, body_height, body_corner_r);

    // Slightly proud front face plate.
    color(panel_col)
        front_extrude_at(front_panel_thickness, front_panel_start_y)
            translate([0, body_center_z])
                rounded_rect_2d(front_panel_width, front_panel_height, front_panel_radius);

    // Thin dark border line around the front panel.
    color(dark_col)
        front_extrude_at(0.42, front_feature_start_y)
            translate([0, body_center_z])
                rounded_rect_ring_2d(
                    front_panel_width - 2.2,
                    front_panel_height - 2.2,
                    front_panel_radius,
                    0.75
                );
}


// =========================
// Speaker modules
// =========================
module speaker_assembly(cx, cz) {
    // Angular raised outer speaker bezel.
    color(detail_col)
        front_extrude_at(bezel_thick, front_feature_start_y)
            translate([cx, cz])
                octagonal_ring_2d(speaker_bezel_outer_r, speaker_bezel_outer_r - 3.4);

    // Dark decorative groove following the octagonal frame.
    color(dark_col)
        front_extrude_at(bezel_line_thick, front_feature_start_y)
            translate([cx, cz])
                octagonal_ring_2d(speaker_bezel_outer_r - 4.7, speaker_bezel_outer_r - 5.75);

    // Inner angular raised ring.
    color(detail_col)
        front_extrude_at(bezel_thick * 0.9, front_feature_start_y)
            translate([cx, cz])
                octagonal_ring_2d(speaker_bezel_outer_r - 6.7, speaker_bezel_outer_r - 8.35);

    // Fine dark inner octagonal line.
    color(dark_col)
        front_extrude_at(bezel_line_thick, front_feature_start_y)
            translate([cx, cz])
                octagonal_ring_2d(speaker_bezel_outer_r - 9.1, speaker_bezel_outer_r - 10.05);

    // Circular grille annulus.
    color(panel_col)
        front_extrude_at(grille_base_thick, front_feature_start_y)
            translate([cx, cz])
                annulus_2d(speaker_grille_outer_d, speaker_grille_inner_d);

    // Radial grille slots, clipped to the annular speaker band.
    color(dark_col)
        front_extrude_at(slot_mark_thick, front_feature_start_y)
            translate([cx, cz])
                radial_slots_2d(
                    speaker_slot_count,
                    speaker_grille_inner_d - 1.2,
                    speaker_grille_outer_d - 1.0,
                    speaker_slot_width
                );

    // Central solid speaker cap.
    color(panel_col)
        front_extrude_at(center_disc_thick, front_feature_start_y)
            translate([cx, cz])
                circle(d = speaker_center_d);

    // Thin circular outline around the central cap.
    color(dark_col)
        front_extrude_at(center_disc_thick + 0.18, front_feature_start_y)
            translate([cx, cz])
                annulus_2d(speaker_center_d + 2.0, speaker_center_d + 0.7);
}


// =========================
// Front chevrons and center X ornament
// =========================
module chevron_pair() {
    // Left inward-facing chevrons.
    color(detail_col)
        front_extrude_at(front_line_thick, front_feature_start_y)
            stroke2d([[-34, speaker_z + 25], [-13, speaker_z], [-34, speaker_z - 25]], chevron_wide_line);

    color(dark_col)
        front_extrude_at(front_dark_line_t, front_feature_start_y)
            stroke2d([[-34, speaker_z + 25], [-13, speaker_z], [-34, speaker_z - 25]], chevron_dark_line);

    color(detail_col)
        front_extrude_at(front_line_thick, front_feature_start_y)
            stroke2d([[-28, speaker_z + 18], [-16, speaker_z], [-28, speaker_z - 18]], chevron_wide_line * 0.75);

    color(dark_col)
        front_extrude_at(front_dark_line_t, front_feature_start_y)
            stroke2d([[-28, speaker_z + 18], [-16, speaker_z], [-28, speaker_z - 18]], chevron_dark_line);

    // Right inward-facing chevrons.
    color(detail_col)
        front_extrude_at(front_line_thick, front_feature_start_y)
            stroke2d([[34, speaker_z + 25], [13, speaker_z], [34, speaker_z - 25]], chevron_wide_line);

    color(dark_col)
        front_extrude_at(front_dark_line_t, front_feature_start_y)
            stroke2d([[34, speaker_z + 25], [13, speaker_z], [34, speaker_z - 25]], chevron_dark_line);

    color(detail_col)
        front_extrude_at(front_line_thick, front_feature_start_y)
            stroke2d([[28, speaker_z + 18], [16, speaker_z], [28, speaker_z - 18]], chevron_wide_line * 0.75);

    color(dark_col)
        front_extrude_at(front_dark_line_t, front_feature_start_y)
            stroke2d([[28, speaker_z + 18], [16, speaker_z], [28, speaker_z - 18]], chevron_dark_line);
}

module center_x_ornament() {
    // Raised triangular hourglass facets.
    color(detail_col)
        front_extrude_at(1.15, front_feature_start_y)
            union() {
                polygon(points = [
                    [0, center_art_top_z],
                    [-8.8, center_art_mid_z],
                    [8.8, center_art_mid_z]
                ]);

                polygon(points = [
                    [0, center_art_bottom_z],
                    [-8.8, center_art_mid_z],
                    [8.8, center_art_mid_z]
                ]);
            }

    // Dark X and center crease lines.
    color(dark_col)
        front_extrude_at(front_dark_line_t, front_feature_start_y)
            union() {
                stroke2d([[0, center_art_top_z], [-9.5, center_art_mid_z], [0, center_art_bottom_z]], 1.1);
                stroke2d([[0, center_art_top_z], [ 9.5, center_art_mid_z], [0, center_art_bottom_z]], 1.1);
                stroke2d([[0, center_art_bottom_z], [0, center_art_top_z]], 0.75);
            }
}

module front_decoration() {
    speaker_assembly(-speaker_x_offset, speaker_z);
    speaker_assembly( speaker_x_offset, speaker_z);

    chevron_pair();
    center_x_ornament();
}


// =========================
// Top panel seams and buttons
// =========================
module top_panel_seams() {
    color(dark_col) {
        // Long seam lines dividing the top into rectangular panels.
        for (xpos = top_seam_xs) {
            translate([xpos, 0, body_top_z + top_seam_h / 2 - join_overlap])
                cube([top_seam_w, body_depth - 7, top_seam_h], center = true);
        }

        // Front top edge shadow line.
        translate([0, body_front_y + 2.6, body_top_z + top_seam_h / 2 - join_overlap])
            cube([body_width - 10, top_seam_w, top_seam_h], center = true);
    }
}

module button_symbol_2d(symbol_id) {
    if (symbol_id == 0) {
        // Oval ring symbol.
        scale([1.25, 0.78])
            difference() {
                circle(d = 4.5);
                circle(d = 2.9);
            }
    } else if (symbol_id == 1) {
        // Plus symbol.
        square([4.4, 0.9], center = true);
        square([0.9, 4.4], center = true);
    } else {
        // Power-like ring and vertical stroke.
        difference() {
            circle(d = 5.0);
            circle(d = 3.75);
        }
        translate([0, 1.45])
            square([0.95, 2.9], center = true);
    }
}

module top_button(x, y, symbol_id) {
    button_base_z = body_top_z - join_overlap;
    button_mark_z = button_base_z + button_h + button_chamfer_h - join_overlap / 2;

    // Low circular button with chamfered top.
    color(panel_col) {
        translate([x, y, button_base_z])
            cylinder(h = button_h, d = button_d, center = false);

        translate([x, y, button_base_z + button_h])
            cylinder(h = button_chamfer_h, d1 = button_d, d2 = button_d - 1.25, center = false);
    }

    // Dark symbol on top of the button.
    color(dark_col)
        translate([x, y, button_mark_z])
            linear_extrude(height = button_mark_h, convexity = 4)
                button_symbol_2d(symbol_id);
}

module top_controls() {
    for (i = [0 : 2]) {
        top_button(button_start_x + i * button_spacing, button_y, i);
    }
}


// =========================
// Angled tapered legs
// =========================
module leg_socket(x, y) {
    translate([x, y, body_bottom_z - leg_socket_h + join_overlap])
        cylinder(h = leg_socket_h, d = leg_socket_d, center = false);
}

module leg_assembly() {
    for (i = [0 : len(leg_top_points) - 1]) {
        // Short vertical socket under the cabinet.
        color(body_col)
            leg_socket(leg_top_points[i][0], leg_top_points[i][1]);

        // Long tapered angled leg.
        color(leg_col)
            cylinder_between(
                leg_top_points[i],
                leg_foot_points[i],
                leg_top_d,
                leg_foot_d
            );

        // Rounded foot end.
        color(leg_col)
            translate(leg_foot_points[i])
                sphere(d = leg_foot_d);
    }
}


// =========================
// Complete model
// =========================
module retro_speaker_console() {
    union() {
        leg_assembly();
        console_body();
        front_decoration();
        top_panel_seams();
        top_controls();
    }
}

retro_speaker_console();