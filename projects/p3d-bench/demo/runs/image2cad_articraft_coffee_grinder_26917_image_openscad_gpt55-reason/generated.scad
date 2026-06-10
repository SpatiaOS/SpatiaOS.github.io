// Parametric recreation of the pictured Fusion 360 style appliance.
// Units: millimeters.

// -----------------------------------------------------------------------------
// Global settings
// -----------------------------------------------------------------------------
$fn = 96;
eps = 0.02;
overlap = 0.10;
show_badge_text = true;

// Preview colors; STL export ignores colors but they help identify features.
body_color      = [0.66, 0.66, 0.66, 1.0];
trim_color      = [0.48, 0.48, 0.48, 1.0];
dark_color      = [0.04, 0.04, 0.04, 1.0];
highlight_color = [0.82, 0.82, 0.82, 1.0];

// -----------------------------------------------------------------------------
// Lower plinth / base
// -----------------------------------------------------------------------------
base_w = 126;
base_d = 126;
base_h = 7;
base_corner_r = 7;
base_chamfer = 3;

base_frame_outer_w = 110;
base_frame_outer_d = 110;
base_frame_h = 1.2;
base_frame_border = 3;
base_frame_corner_r = 5;

base_inner_frame_outer_w = 98;
base_inner_frame_outer_d = 98;
base_inner_frame_h = 0.9;
base_inner_frame_border = 2;
base_inner_frame_corner_r = 4;

// -----------------------------------------------------------------------------
// Rectangular main body
// -----------------------------------------------------------------------------
body_w = 84;
body_d = 84;
body_h = 58;
body_corner_r = 3.5;

body_z = base_h - overlap;
body_front_y = -body_d / 2;

// -----------------------------------------------------------------------------
// Front face panel, name badge, and control knob
// -----------------------------------------------------------------------------
front_panel_w = 68;
front_panel_h = 36;
front_panel_t = 2.1;
front_panel_corner_r = 5;
front_panel_frame_t = 1.0;
front_panel_frame_border = 1.2;
front_panel_center_z = body_z + 25;

front_panel_edge_w = 5;
front_panel_edge_h = front_panel_h + 8;
front_panel_edge_t = 2.5;

front_horizontal_trim_w = front_panel_w + 8;
front_horizontal_trim_h = 4;
front_horizontal_trim_t = 2.7;

badge_w = 52;
badge_h = 14;
badge_t = 1.4;
badge_frame_t = 0.8;
badge_frame_border = 1.4;
badge_x = -12;
badge_z = body_z + 43;
badge_text = "Fusion 360";
badge_text_size = 6.2;
badge_text_depth = 0.8;
badge_text_z_offset = -0.45;
badge_font = "Liberation Sans:style=Bold";

front_knob_x = -22;
front_knob_z = body_z + 19;
front_knob_base_d = 12;
front_knob_cap_d = 13;
front_knob_cap_squash = 0.45;
front_knob_projection = 5.8;
front_knob_center_button_d = 4.2;
front_knob_center_button_h = 0.8;

// -----------------------------------------------------------------------------
// Top square plate and circular collar
// -----------------------------------------------------------------------------
top_plate_w = 112;
top_plate_d = 112;
top_plate_h = 8;
top_plate_corner_r = 5.5;
top_plate_chamfer = 2.5;

top_plate_z = body_z + body_h - overlap;
top_plate_top_z = top_plate_z + top_plate_h;

bowl_collar_od = 86;
bowl_collar_id = 64;
bowl_collar_h = 2.4;
bowl_collar_bead_r = 0.75;

// -----------------------------------------------------------------------------
// Open tapered bowl
// -----------------------------------------------------------------------------
bowl_z = top_plate_top_z - overlap;
bowl_h = 56;
bowl_bottom_od = 72;
bowl_top_od = 88;
bowl_wall_t = 2.8;
bowl_floor_t = 3.0;

bowl_top_rim_roll_r = 2.6;
bowl_band_r = 0.75;
bowl_upper_band_z = bowl_h - 8;
bowl_inner_upper_band_z = bowl_h - 4.5;
bowl_lower_band_z = 8;
bowl_lower_band_2_z = 4.2;

bowl_floor_ring_h = 0.95;
bowl_floor_ring_w = 1.6;
bowl_floor_ring_1_od = 42;
bowl_floor_ring_2_od = 54;
bowl_floor_ring_3_od = 66;

bowl_seam_angle = -28;
bowl_seam_w = 1.4;
bowl_seam_t = 1.2;
bowl_seam_z1 = 9;
bowl_seam_z2 = bowl_h - 10;

// -----------------------------------------------------------------------------
// Center post
// -----------------------------------------------------------------------------
central_post_d = 13;
central_post_cap_d = 15;
central_post_cap_h = 2.0;
central_post_floor_collar_d = 18;
central_post_floor_collar_h = 2.0;

// -----------------------------------------------------------------------------
// Crank / bridge arm over the bowl
// -----------------------------------------------------------------------------
arm_clearance_above_rim = 3.2;
arm_thickness = 3.0;
arm_width = 12.5;

arm_bottom_z = bowl_z + bowl_h + arm_clearance_above_rim;

central_post_z = bowl_z + bowl_floor_t - overlap;
central_post_h = arm_bottom_z + arm_thickness - central_post_z + overlap;

arm_center_plate_w = 34;
arm_center_plate_d = 22;
arm_center_plate_corner_r = 2.2;
arm_center_plate_x = 3;
arm_center_plate_y = 0;
arm_center_plate_angle = -18;

arm_end_plate_w = 30;
arm_end_plate_d = 18;
arm_end_plate_corner_r = 2.0;
arm_end_plate_x = 72;
arm_end_plate_y = -5;
arm_end_plate_angle = -12;

arm_path_points = [
    [8, 0],
    [22, 4],
    [42, 2],
    [60, -3],
    [70, -5]
];

// Central screw / nut over spindle
center_washer_d = 14;
center_washer_h = 1.6;
center_hex_d = 10;
center_hex_h = 4.0;
center_hex_hole_d = 4.5;
center_screw_d = 5;
center_screw_h = 1.0;

// End handle knob and small screw
handle_x = arm_end_plate_x - 4;
handle_y = arm_end_plate_y + 0.5;
handle_base_d = 10;
handle_base_h = 2.5;
handle_dome_d = 18;
handle_dome_h = 7.5;
handle_hole_d = 4.2;
handle_hole_depth = 2.2;
handle_hole_ring_r = 0.35;

end_screw_x = arm_end_plate_x + 10.5;
end_screw_y = arm_end_plate_y - 1.5;
end_screw_d = 6;
end_screw_h = 1.0;
end_screw_slot_w = 1.0;
end_screw_slot_l = 5.2;
end_screw_slot_depth = 0.55;

// -----------------------------------------------------------------------------
// Helper function for the tapered bowl
// -----------------------------------------------------------------------------
function bowl_outer_d_at_z(z) =
    bowl_bottom_od + (bowl_top_od - bowl_bottom_od) * (z / bowl_h);

// -----------------------------------------------------------------------------
// 2D rounded rectangle used for extrusions
// -----------------------------------------------------------------------------
module rounded_rect_2d(w, d, r) {
    rr = max(eps, min(r, min(w, d) / 2 - eps));

    hull() {
        for (x = [-w / 2 + rr, w / 2 - rr])
            for (y = [-d / 2 + rr, d / 2 - rr])
                translate([x, y])
                    circle(r = rr);
    }
}

// -----------------------------------------------------------------------------
// Rounded vertical prism with rounded corners in the XY plane
// -----------------------------------------------------------------------------
module rounded_prism(w, d, h, r) {
    linear_extrude(height = h, convexity = 4)
        rounded_rect_2d(w, d, r);
}

// -----------------------------------------------------------------------------
// Chamfered rounded plate made by hulling a larger bottom and smaller top
// -----------------------------------------------------------------------------
module chamfered_rounded_plate(w, d, h, r, chamfer) {
    hull() {
        translate([0, 0, 0])
            linear_extrude(height = eps, convexity = 4)
                rounded_rect_2d(w, d, r);

        translate([0, 0, h - eps])
            linear_extrude(height = eps, convexity = 4)
                rounded_rect_2d(
                    max(eps, w - 2 * chamfer),
                    max(eps, d - 2 * chamfer),
                    max(eps, r - chamfer)
                );
    }
}

// -----------------------------------------------------------------------------
// Raised rounded rectangular frame
// -----------------------------------------------------------------------------
module rounded_frame(w, d, h, r, border) {
    difference() {
        rounded_prism(w, d, h, r);

        translate([0, 0, -eps])
            rounded_prism(
                w - 2 * border,
                d - 2 * border,
                h + 2 * eps,
                max(eps, r - border)
            );
    }
}

// -----------------------------------------------------------------------------
// Annular cylinder for collars and decorative rings
// -----------------------------------------------------------------------------
module annular_cylinder(od, id, h) {
    difference() {
        cylinder(h = h, d = od);

        translate([0, 0, -eps])
            cylinder(h = h + 2 * eps, d = id);
    }
}

// -----------------------------------------------------------------------------
// Torus helper for rolled rims and bead rings
// -----------------------------------------------------------------------------
module torus(major_r, minor_r) {
    rotate_extrude(convexity = 8)
        translate([major_r, 0, 0])
            circle(r = minor_r);
}

// -----------------------------------------------------------------------------
// Vertical rounded plate for front-face details.
// Local origin lies on the back plane; extrusion projects outward along -Y.
// -----------------------------------------------------------------------------
module vertical_rounded_plate(w, h, t, r) {
    rotate([90, 0, 0])
        linear_extrude(height = t, convexity = 4)
            rounded_rect_2d(w, h, r);
}

// -----------------------------------------------------------------------------
// Vertical rounded frame for front-face details.
// -----------------------------------------------------------------------------
module vertical_rounded_frame(w, h, t, r, border) {
    rotate([90, 0, 0])
        linear_extrude(height = t, convexity = 6)
            difference() {
                rounded_rect_2d(w, h, r);
                rounded_rect_2d(
                    w - 2 * border,
                    h - 2 * border,
                    max(eps, r - border)
                );
            }
}

// -----------------------------------------------------------------------------
// Raised vertical text on the front badge.
// -----------------------------------------------------------------------------
module vertical_text_label(label, size, depth) {
    rotate([90, 0, 0])
        linear_extrude(height = depth, convexity = 8)
            text(
                label,
                size = size,
                font = badge_font,
                halign = "center",
                valign = "center",
                spacing = 0.92
            );
}

// -----------------------------------------------------------------------------
// Front control knob projecting from the main body
// -----------------------------------------------------------------------------
module horizontal_front_knob() {
    union() {
        rotate([90, 0, 0])
            cylinder(h = front_knob_projection, d = front_knob_base_d);

        translate([0, -front_knob_projection, 0])
            scale([1, front_knob_cap_squash, 1])
                sphere(d = front_knob_cap_d);

        translate([
            0,
            -front_knob_projection - front_knob_cap_d * front_knob_cap_squash / 2 + overlap,
            0
        ])
            rotate([90, 0, 0])
                cylinder(h = front_knob_center_button_h, d = front_knob_center_button_d);
    }
}

// -----------------------------------------------------------------------------
// Half ellipsoid dome for the crank handle knob
// -----------------------------------------------------------------------------
module half_ellipsoid_dome(d, h) {
    intersection() {
        scale([1, 1, h / (d / 2)])
            sphere(d = d);

        translate([-d / 2 - eps, -d / 2 - eps, 0])
            cube([d + 2 * eps, d + 2 * eps, h + eps]);
    }
}

// -----------------------------------------------------------------------------
// Mushroom-like vertical crank handle knob with shallow top depression
// -----------------------------------------------------------------------------
module vertical_dome_knob() {
    top_z = handle_base_h + handle_dome_h;

    union() {
        difference() {
            union() {
                cylinder(h = handle_base_h, d = handle_base_d);

                translate([0, 0, handle_base_h - overlap])
                    half_ellipsoid_dome(handle_dome_d, handle_dome_h);
            }

            translate([0, 0, top_z - handle_hole_depth])
                cylinder(h = handle_hole_depth + 2 * eps, d = handle_hole_d);
        }

        translate([0, 0, top_z - 0.60])
            torus(handle_hole_d / 2 + handle_hole_ring_r, handle_hole_ring_r);
    }
}

// -----------------------------------------------------------------------------
// Small slotted screw head
// -----------------------------------------------------------------------------
module slotted_screw(d, h, slot_w, slot_l, slot_depth) {
    difference() {
        cylinder(h = h, d = d);

        translate([-slot_l / 2, -slot_w / 2, h - slot_depth])
            cube([slot_l, slot_w, slot_depth + eps]);
    }
}

// -----------------------------------------------------------------------------
// Hex nut with through hole
// -----------------------------------------------------------------------------
module hex_nut(od, h, hole_d) {
    difference() {
        cylinder(h = h, d = od, $fn = 6);

        translate([0, 0, -eps])
            cylinder(h = h + 2 * eps, d = hole_d);
    }
}

// -----------------------------------------------------------------------------
// Rounded bar along a point path, used for the crank strap
// -----------------------------------------------------------------------------
module rounded_bar_path(points, width, h) {
    union() {
        for (i = [0 : 1 : len(points) - 2]) {
            hull() {
                translate([points[i][0], points[i][1], 0])
                    cylinder(h = h, d = width);

                translate([points[i + 1][0], points[i + 1][1], 0])
                    cylinder(h = h, d = width);
            }
        }
    }
}

// -----------------------------------------------------------------------------
// Base plinth assembly
// -----------------------------------------------------------------------------
module base_assembly() {
    union() {
        color(body_color)
            chamfered_rounded_plate(base_w, base_d, base_h, base_corner_r, base_chamfer);

        color(trim_color)
            translate([0, 0, base_h - overlap])
                rounded_frame(
                    base_frame_outer_w,
                    base_frame_outer_d,
                    base_frame_h + overlap,
                    base_frame_corner_r,
                    base_frame_border
                );

        color(dark_color)
            translate([0, 0, base_h + base_frame_h - overlap])
                rounded_frame(
                    base_inner_frame_outer_w,
                    base_inner_frame_outer_d,
                    base_inner_frame_h + overlap,
                    base_inner_frame_corner_r,
                    base_inner_frame_border
                );
    }
}

// -----------------------------------------------------------------------------
// Front face details on the main body
// -----------------------------------------------------------------------------
module front_face_details() {
    front_y = body_front_y + overlap;
    panel_front_y = front_y - front_panel_t + overlap;
    badge_front_y = front_y - badge_t + overlap;
    badge_text_y = badge_front_y - badge_frame_t + overlap;

    union() {
        // Broad raised lower front panel
        color(highlight_color)
            translate([0, front_y, front_panel_center_z])
                vertical_rounded_plate(
                    front_panel_w,
                    front_panel_h,
                    front_panel_t + overlap,
                    front_panel_corner_r
                );

        // Thin outline frame on the panel
        color(trim_color)
            translate([0, panel_front_y, front_panel_center_z])
                vertical_rounded_frame(
                    front_panel_w,
                    front_panel_h,
                    front_panel_frame_t + overlap,
                    front_panel_corner_r,
                    front_panel_frame_border
                );

        // Rounded vertical edge trims
        color(trim_color)
            for (x = [-front_panel_w / 2, front_panel_w / 2])
                translate([x, panel_front_y, front_panel_center_z])
                    vertical_rounded_plate(
                        front_panel_edge_w,
                        front_panel_edge_h,
                        front_panel_edge_t + overlap,
                        front_panel_edge_w / 2
                    );

        // Horizontal trim ledge above the front panel
        color(trim_color)
            translate([
                0,
                panel_front_y,
                front_panel_center_z + front_panel_h / 2 - 1.0
            ])
                vertical_rounded_plate(
                    front_horizontal_trim_w,
                    front_horizontal_trim_h,
                    front_horizontal_trim_t + overlap,
                    front_horizontal_trim_h / 2
                );

        // Oval Fusion 360 badge
        color(highlight_color)
            translate([badge_x, front_y, badge_z])
                vertical_rounded_plate(
                    badge_w,
                    badge_h,
                    badge_t + overlap,
                    badge_h / 2
                );

        color(dark_color)
            translate([badge_x, badge_front_y, badge_z])
                vertical_rounded_frame(
                    badge_w,
                    badge_h,
                    badge_frame_t + overlap,
                    badge_h / 2,
                    badge_frame_border
                );

        if (show_badge_text) {
            color(dark_color)
                translate([badge_x + 1.0, badge_text_y, badge_z + badge_text_z_offset])
                    vertical_text_label(badge_text, badge_text_size, badge_text_depth);
        }

        // Round front control knob
        color(trim_color)
            translate([front_knob_x, front_y, front_knob_z])
                horizontal_front_knob();
    }
}

// -----------------------------------------------------------------------------
// Main lower body with attached front details
// -----------------------------------------------------------------------------
module body_assembly() {
    union() {
        color(body_color)
            translate([0, 0, body_z])
                rounded_prism(body_w, body_d, body_h, body_corner_r);

        front_face_details();
    }
}

// -----------------------------------------------------------------------------
// Collar around the base of the bowl
// -----------------------------------------------------------------------------
module bowl_base_collar() {
    union() {
        annular_cylinder(bowl_collar_od, bowl_collar_id, bowl_collar_h);

        translate([0, 0, bowl_collar_h])
            torus(bowl_collar_od / 2 - bowl_collar_bead_r, bowl_collar_bead_r);

        translate([0, 0, bowl_collar_h])
            torus(bowl_collar_id / 2 + bowl_collar_bead_r, bowl_collar_bead_r);
    }
}

// -----------------------------------------------------------------------------
// Top platform assembly
// -----------------------------------------------------------------------------
module top_platform_assembly() {
    union() {
        color(highlight_color)
            translate([0, 0, top_plate_z])
                chamfered_rounded_plate(
                    top_plate_w,
                    top_plate_d,
                    top_plate_h,
                    top_plate_corner_r,
                    top_plate_chamfer
                );

        color(trim_color)
            translate([0, 0, top_plate_top_z - overlap])
                bowl_base_collar();
    }
}

// -----------------------------------------------------------------------------
// Hollow tapered bowl shell
// -----------------------------------------------------------------------------
module tapered_bowl_shell() {
    inner_bottom_d = bowl_outer_d_at_z(bowl_floor_t) - 2 * bowl_wall_t;
    inner_top_d = bowl_top_od - 2 * bowl_wall_t;

    difference() {
        cylinder(h = bowl_h, d1 = bowl_bottom_od, d2 = bowl_top_od);

        translate([0, 0, bowl_floor_t])
            cylinder(
                h = bowl_h - bowl_floor_t + 2 * eps,
                d1 = inner_bottom_d,
                d2 = inner_top_d
            );
    }
}

// -----------------------------------------------------------------------------
// Raised seam on the tapered bowl wall
// -----------------------------------------------------------------------------
module bowl_outer_seam() {
    hull() {
        translate([
            bowl_outer_d_at_z(bowl_seam_z1) / 2 + bowl_seam_t / 2 - overlap,
            0,
            bowl_seam_z1
        ])
            cube([bowl_seam_t, bowl_seam_w, eps], center = true);

        translate([
            bowl_outer_d_at_z(bowl_seam_z2) / 2 + bowl_seam_t / 2 - overlap,
            0,
            bowl_seam_z2
        ])
            cube([bowl_seam_t, bowl_seam_w, eps], center = true);
    }
}

// -----------------------------------------------------------------------------
// Decorative bowl rings, floor rings, rolled rim, and side seam
// -----------------------------------------------------------------------------
module bowl_decorative_rings() {
    union() {
        // Rolled top rim
        translate([0, 0, bowl_h])
            torus(bowl_top_od / 2 - bowl_top_rim_roll_r, bowl_top_rim_roll_r);

        // Upper rings near the open lip
        translate([0, 0, bowl_inner_upper_band_z])
            torus(
                bowl_outer_d_at_z(bowl_inner_upper_band_z) / 2 - bowl_wall_t * 0.55,
                bowl_band_r
            );

        translate([0, 0, bowl_upper_band_z])
            torus(bowl_outer_d_at_z(bowl_upper_band_z) / 2, bowl_band_r);

        // Lower exterior rings
        translate([0, 0, bowl_lower_band_z])
            torus(bowl_outer_d_at_z(bowl_lower_band_z) / 2, bowl_band_r);

        translate([0, 0, bowl_lower_band_2_z])
            torus(bowl_outer_d_at_z(bowl_lower_band_2_z) / 2, bowl_band_r);

        // Concentric floor rings visible inside the bowl
        translate([0, 0, bowl_floor_t - overlap])
            annular_cylinder(
                bowl_floor_ring_1_od,
                bowl_floor_ring_1_od - 2 * bowl_floor_ring_w,
                bowl_floor_ring_h + overlap
            );

        translate([0, 0, bowl_floor_t - overlap])
            annular_cylinder(
                bowl_floor_ring_2_od,
                bowl_floor_ring_2_od - 2 * bowl_floor_ring_w,
                bowl_floor_ring_h + overlap
            );

        translate([0, 0, bowl_floor_t - overlap])
            annular_cylinder(
                bowl_floor_ring_3_od,
                bowl_floor_ring_3_od - 2 * bowl_floor_ring_w,
                bowl_floor_ring_h + overlap
            );

        // Narrow vertical mold seam on one side
        rotate([0, 0, bowl_seam_angle])
            bowl_outer_seam();
    }
}

// -----------------------------------------------------------------------------
// Bowl assembly
// -----------------------------------------------------------------------------
module bowl_assembly() {
    union() {
        color(body_color)
            translate([0, 0, bowl_z])
                tapered_bowl_shell();

        color(trim_color)
            translate([0, 0, bowl_z])
                bowl_decorative_rings();
    }
}

// -----------------------------------------------------------------------------
// Central spindle/post inside the bowl
// -----------------------------------------------------------------------------
module central_post_assembly() {
    union() {
        color(trim_color)
            translate([0, 0, central_post_z])
                cylinder(h = central_post_h, d = central_post_d);

        color(highlight_color)
            translate([0, 0, bowl_z + bowl_floor_t - overlap])
                cylinder(
                    h = central_post_floor_collar_h,
                    d = central_post_floor_collar_d
                );

        color(highlight_color)
            translate([0, 0, central_post_z + central_post_h - central_post_cap_h])
                cylinder(h = central_post_cap_h, d = central_post_cap_d);
    }
}

// -----------------------------------------------------------------------------
// Flat crank arm geometry: center plate, strap, and end tab
// -----------------------------------------------------------------------------
module crank_arm_plate_geometry() {
    union() {
        rounded_bar_path(arm_path_points, arm_width, arm_thickness);

        translate([arm_center_plate_x, arm_center_plate_y, 0])
            rotate([0, 0, arm_center_plate_angle])
                rounded_prism(
                    arm_center_plate_w,
                    arm_center_plate_d,
                    arm_thickness,
                    arm_center_plate_corner_r
                );

        translate([arm_end_plate_x, arm_end_plate_y, 0])
            rotate([0, 0, arm_end_plate_angle])
                rounded_prism(
                    arm_end_plate_w,
                    arm_end_plate_d,
                    arm_thickness,
                    arm_end_plate_corner_r
                );
    }
}

// -----------------------------------------------------------------------------
// Full crank arm assembly with hardware and handle knob
// -----------------------------------------------------------------------------
module crank_assembly() {
    arm_top_z = arm_bottom_z + arm_thickness;

    union() {
        color(highlight_color)
            translate([0, 0, arm_bottom_z])
                crank_arm_plate_geometry();

        // Hardware above the central post
        color(trim_color)
            translate([0, 0, arm_top_z - overlap])
                cylinder(h = center_washer_h, d = center_washer_d);

        color(highlight_color)
            translate([0, 0, arm_top_z + center_washer_h - overlap])
                hex_nut(center_hex_d, center_hex_h, center_hex_hole_d);

        color(dark_color)
            translate([0, 0, arm_top_z + center_washer_h + center_hex_h - overlap])
                cylinder(h = center_screw_h, d = center_screw_d);

        // Rounded mushroom handle on the far end
        color(trim_color)
            translate([handle_x, handle_y, arm_top_z - overlap])
                vertical_dome_knob();

        // Small slotted screw on the end tab
        color(dark_color)
            translate([end_screw_x, end_screw_y, arm_top_z - overlap])
                slotted_screw(
                    end_screw_d,
                    end_screw_h,
                    end_screw_slot_w,
                    end_screw_slot_l,
                    end_screw_slot_depth
                );
    }
}

// -----------------------------------------------------------------------------
// Complete model
// -----------------------------------------------------------------------------
module complete_model() {
    union() {
        base_assembly();
        body_assembly();
        top_platform_assembly();
        bowl_assembly();
        central_post_assembly();
        crank_assembly();
    }
}

complete_model();