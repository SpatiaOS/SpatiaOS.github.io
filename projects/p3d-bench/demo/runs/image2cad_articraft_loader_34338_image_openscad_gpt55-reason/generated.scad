// Parametric stylized wheel-loader / front-end loader
// Units: millimeters
// Interpretation: simplified toy-like CAD recreation of the reference image,
// with four treaded wheels, articulated loader arms, front scoop bucket,
// chassis/deck, cab with open framed windows, exhaust stack, and raised details.

// -------------------------
// Global resolution / colors
// -------------------------
$fn = 72;
eps = 0.05;
rounding_fn = 20;

body_col       = [0.62, 0.62, 0.64];
edge_col       = [0.22, 0.22, 0.23];
tire_col       = [0.10, 0.10, 0.11];
rim_col        = [0.74, 0.74, 0.75];
metal_col      = [0.82, 0.82, 0.80];
window_col     = [0.16, 0.20, 0.24];
window_alpha   = 0.38;

// -------------------------
// Overall vehicle layout
// -------------------------
body_width      = 44;
wheel_center_y  = 32;
front_axle_x    = -16;
rear_axle_x     = 38;

// -------------------------
// Tire and wheel parameters
// -------------------------
tire_diameter              = 34;
tire_radius                = tire_diameter / 2;
tire_width                 = 12;
tire_tread_count           = 18;
tire_tread_height          = 3;
tire_tread_length          = 8;
tire_tread_overlap         = 0.8;
tire_tread_side_overhang   = 1.2;

side_lug_count             = 9;
face_lug_radius            = tire_radius * 0.68;
face_lug_length            = 12;
face_lug_width             = 3;
face_lug_spacing           = 3.2;
face_lug_thickness         = 1.3;
face_lug_overlap           = 0.35;
face_lug_angle             = 32;

rim_depth                  = 2.0;
rim_overlap                = 0.35;
rim_outer_diameter         = 23;
rim_inner_diameter         = 17;
rim_disk_diameter          = 18;
hub_diameter               = 8;
hub_hole_diameter          = 3.1;
axle_diameter              = 3.0;

wheel_center_z             = tire_radius + tire_tread_height + 0.6;

// -------------------------
// Chassis, hood, platform
// -------------------------
base_length     = 92;
base_width      = 42;
base_height     = 8;
base_center_x   = 12;
base_center_z   = 32.5;
base_round      = 1.2;

side_panel_length     = 86;
side_panel_thickness  = 4;
side_panel_height     = 18;
side_panel_center_x   = 10;
side_panel_center_z   = 34;
side_panel_y          = base_width / 2 + side_panel_thickness / 2 - 0.5;

deck_length     = 62;
deck_width      = 54;
deck_height     = 5;
deck_center_x   = 30;
deck_center_z   = 42;
deck_round      = 0.8;
deck_top_z      = deck_center_z + deck_height / 2;

deck_edge_thickness = 1.8;
deck_edge_height    = 1.8;

rear_bumper_length    = 8;
rear_bumper_width     = 42;
rear_bumper_height    = 8;
rear_bumper_center_x  = base_center_x + base_length / 2 + rear_bumper_length / 2 - 2;
rear_bumper_center_z  = base_center_z - 1;
rear_bumper_round     = 1.0;

// Hood cross-section is an extruded polygon in X-Z, matching the sloped engine cover.
hood_width        = 34;
hood_front_x      = -42;
hood_rear_x       = 10;
hood_low_z        = 37;
hood_rear_z       = 48;
hood_top_rear_x   = -4;
hood_top_z        = 57;
hood_top_front_x  = -38;
hood_front_top_z  = 47;
hood_points       = [
    [hood_front_x,     hood_low_z],
    [hood_rear_x,      hood_low_z],
    [hood_rear_x,      hood_rear_z],
    [hood_top_rear_x,  hood_top_z],
    [hood_top_front_x, hood_front_top_z]
];

hood_slat_width   = 2.0;
hood_slat_depth   = hood_width + 6;
hood_slat_height  = 2.0;
hood_slat_angle   = -12;
hood_slats        = [
    [-34, 47],
    [-26, 50],
    [-18, 52],
    [-10, 54]
];

vent_louver_count      = 4;
vent_louver_start_x    = -33;
vent_louver_spacing    = 7;
vent_louver_z          = 45;
vent_louver_width      = 4.8;
vent_louver_height     = 1.3;
vent_louver_thickness  = 0.9;

fender_inner_radius = tire_radius + tire_tread_height - 0.2;
fender_thickness    = 3.5;
fender_width        = tire_width + 8;

// -------------------------
// Cab parameters
// -------------------------
cab_center_x            = 25;
cab_length              = 30;
cab_width               = 34;
cab_base_z              = deck_top_z - 0.2;
cab_floor_height        = 4;
cab_post_height         = 32;
cab_post_size           = 4;
cab_center_pillar_size  = 3.2;
cab_header_height       = 4;
cab_sill_bar_height     = 3;
cab_window_bottom_offset = 8;
cab_window_height       = 18;
cab_window_gap          = 1;
window_pane_t           = 0.8;

cab_roof_height     = 8;
cab_roof_overhang   = 5;
cab_roof_round      = 2.4;
cab_roof_top_z      = cab_base_z + cab_floor_height + cab_post_height + cab_roof_height - 2 * eps;

beacon_diameter = 8;
beacon_height   = 4;
beacon_x        = cab_center_x + 6;
beacon_y        = 0;

// -------------------------
// Exhaust stack
// -------------------------
exhaust_x              = 55;
exhaust_y              = 17;
exhaust_base_z         = deck_top_z - eps;
exhaust_height         = 26;
exhaust_outer_diameter = 5;
exhaust_inner_diameter = 3;
exhaust_rim_height     = 2;
exhaust_rim_extra      = 2;

// -------------------------
// Front bucket parameters
// -------------------------
bucket_width           = 84;
bucket_sheet_thickness = 3;
bucket_side_thickness  = 3;
bucket_side_overlap    = 1.0;

bucket_front_x         = -98;
bucket_front_floor_z   = 8;
bucket_front_top_x     = -90;
bucket_front_top_z     = 23;
bucket_back_bottom_x   = -55;
bucket_back_bottom_z   = 14;
bucket_back_top_x      = -44;
bucket_back_top_z      = 37;

bucket_side_points = [
    [bucket_front_x,       bucket_front_floor_z],
    [bucket_front_top_x,   bucket_front_top_z],
    [bucket_back_top_x,    bucket_back_top_z],
    [bucket_back_bottom_x, bucket_back_bottom_z]
];

bucket_cutting_edge_diameter = 4.0;
bucket_lip_diameter          = 3.4;
bucket_rib_width             = 3.2;
bucket_rib_thickness         = 5.0;
bucket_rib_y_positions       = [-bucket_width / 4, 0, bucket_width / 4];

// -------------------------
// Loader arm parameters
// -------------------------
arm_y_offset            = body_width / 2 + 3;
arm_plate_thickness     = 4;
arm_radius              = 3.4;
arm_hole_diameter       = 3.2;
arm_boss_outer_diameter = 8.0;
arm_boss_thickness      = arm_plate_thickness + 2;
arm_cross_tube_diameter = 2.6;

arm_upper_a = [bucket_back_top_x - 8, bucket_back_top_z - 1];
arm_upper_b = [-28, 50];
arm_upper_c = [8, 43];

arm_lower_a = [bucket_back_bottom_x - 7, bucket_back_bottom_z + 10];
arm_lower_b = [-28, 31];
arm_lower_c = [8, 34];

hydraulic_y_inset      = 1.6;
hydraulic_body_diameter = 4.2;
hydraulic_rod_diameter  = 2.2;
hydraulic_body_start_x  = -2;
hydraulic_body_start_z  = 33;
hydraulic_body_end_x    = -29;
hydraulic_body_end_z    = 41;
hydraulic_rod_end_x     = arm_upper_a[0] + 3;
hydraulic_rod_end_z     = arm_upper_a[1];

// -------------------------
// Helper modules
// -------------------------

// Rounded rectangular solid using Minkowski sum.
// Kept centered for predictable placement.
module rounded_box(w, d, h, r) {
    if (r <= 0) {
        cube([w, d, h], center=true);
    } else {
        minkowski() {
            cube([w - 2*r, d - 2*r, h - 2*r], center=true);
            sphere(r=r, $fn=rounding_fn);
        }
    }
}

// Hollow vertical tube.
module tube_z(h, od, id) {
    difference() {
        cylinder(h=h, d=od, center=true);
        cylinder(h=h + 2*eps, d=id, center=true);
    }
}

// Hollow tube with axis along global Y.
module y_tube(h, od, id) {
    difference() {
        rotate([90, 0, 0])
            cylinder(h=h, d=od, center=true);
        rotate([90, 0, 0])
            cylinder(h=h + 2*eps, d=id, center=true);
    }
}

// Cylinder with axis along global Y at an X-Z point.
module y_cylinder_at(p, ypos, h, d) {
    translate([p[0], ypos, p[1]])
        rotate([90, 0, 0])
            cylinder(h=h, d=d, center=true);
}

// Annular boss / ring with axis along global Y.
module y_ring_at(p, ypos, h, od, id) {
    difference() {
        y_cylinder_at(p, ypos, h, od);
        y_cylinder_at(p, ypos, h + 2*eps, id);
    }
}

// Extrudes a 2D polygon drawn in X-Z coordinates along global Y.
module prism_xz(points, width) {
    rotate([90, 0, 0])
        linear_extrude(height=width, center=true, convexity=10)
            polygon(points=points);
}

// Rectangular panel between two X-Z points, extruded across global Y.
module panel_between_xz(p1, p2, width, thickness) {
    dx = p2[0] - p1[0];
    dz = p2[1] - p1[1];
    seg_len = sqrt(dx*dx + dz*dz);
    ang = atan2(dz, dx);

    translate([(p1[0] + p2[0]) / 2, 0, (p1[1] + p2[1]) / 2])
        rotate([0, -ang, 0])
            cube([seg_len, width, thickness], center=true);
}

// General cylinder between two 3D points.
module cylinder_between(p1, p2, d) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    seg_len = norm(v);
    axis = cross([0, 0, 1], v);
    safe_axis = (norm(axis) < eps) ? [1, 0, 0] : axis;
    clamped_cos = (seg_len < eps) ? 1 : max(-1, min(1, v[2] / seg_len));

    translate([(p1[0] + p2[0]) / 2,
               (p1[1] + p2[1]) / 2,
               (p1[2] + p2[2]) / 2])
        rotate(a=acos(clamped_cos), v=safe_axis)
            cylinder(h=seg_len, d=d, center=true);
}

// Rounded flat link plate between two X-Z pivot points.
module rounded_link_xz(p1, p2, ypos, thickness, radius, hole_d) {
    difference() {
        hull() {
            y_cylinder_at(p1, ypos, thickness, 2*radius);
            y_cylinder_at(p2, ypos, thickness, 2*radius);
        }

        for (p = [p1, p2])
            y_cylinder_at(p, ypos, thickness + 2*eps, hole_d);
    }
}

// Half annular wheel fender.
module fender_arch(width, inner_r, thick) {
    intersection() {
        difference() {
            rotate([90, 0, 0])
                cylinder(h=width, r=inner_r + thick, center=true);
            rotate([90, 0, 0])
                cylinder(h=width + 2*eps, r=inner_r, center=true);
        }

        translate([0, 0, (inner_r + thick) / 2])
            cube([2*(inner_r + thick) + 2*eps,
                  width + 2*eps,
                  inner_r + thick], center=true);
    }
}

// -------------------------
// Wheel module
// -------------------------
module wheel() {
    rim_face_y = tire_width / 2 + rim_depth / 2 - rim_overlap;
    face_lug_y = tire_width / 2 + face_lug_thickness / 2 - face_lug_overlap;

    difference() {
        union() {
            // Base tire cylinder and radial rectangular tread blocks.
            color(tire_col) union() {
                rotate([90, 0, 0])
                    cylinder(h=tire_width, d=tire_diameter, center=true);

                for (a = [0 : 360 / tire_tread_count : 359]) {
                    rotate([0, -a, 0])
                        translate([tire_radius + tire_tread_height / 2, 0, 0])
                            cube([tire_tread_height + tire_tread_overlap,
                                  tire_width + 2*tire_tread_side_overhang,
                                  tire_tread_length], center=true);
                }

                // Raised sidewall chevron-like lugs on both wheel faces.
                for (a = [0 : 360 / side_lug_count : 359]) {
                    for (fs = [-1, 1]) {
                        rotate([0, -a, 0])
                            translate([face_lug_radius, fs*face_lug_y, face_lug_spacing / 2])
                                rotate([0, face_lug_angle, 0])
                                    cube([face_lug_length, face_lug_thickness, face_lug_width], center=true);

                        rotate([0, -a, 0])
                            translate([face_lug_radius, fs*face_lug_y, -face_lug_spacing / 2])
                                rotate([0, -face_lug_angle, 0])
                                    cube([face_lug_length, face_lug_thickness, face_lug_width], center=true);
                    }
                }
            }

            // Raised rim, ring, and hub details on both sides.
            color(rim_col) union() {
                for (fs = [-1, 1]) {
                    translate([0, fs*rim_face_y, 0])
                        y_tube(rim_depth, rim_outer_diameter, rim_inner_diameter);

                    translate([0, fs*rim_face_y, 0])
                        rotate([90, 0, 0])
                            cylinder(h=rim_depth, d=rim_disk_diameter, center=true);

                    translate([0, fs*(rim_face_y + rim_depth/2 - eps), 0])
                        rotate([90, 0, 0])
                            cylinder(h=rim_depth, d=hub_diameter, center=true);
                }
            }
        }

        // Small central axle bore.
        rotate([90, 0, 0])
            cylinder(h=tire_width + 2*tire_tread_side_overhang + 2*rim_depth + 4,
                     d=hub_hole_diameter,
                     center=true);
    }
}

// -------------------------
// Chassis and body module
// -------------------------
module chassis_body() {
    // Main body masses: central frame, side panels, deck, fenders, hood, rear bumper.
    color(body_col) union() {
        translate([base_center_x, 0, base_center_z])
            rounded_box(base_length, base_width, base_height, base_round);

        for (side = [-1, 1]) {
            translate([side_panel_center_x, side*side_panel_y, side_panel_center_z])
                cube([side_panel_length, side_panel_thickness, side_panel_height], center=true);
        }

        translate([deck_center_x, 0, deck_center_z])
            rounded_box(deck_length, deck_width, deck_height, deck_round);

        translate([rear_bumper_center_x, 0, rear_bumper_center_z])
            rounded_box(rear_bumper_length, rear_bumper_width, rear_bumper_height, rear_bumper_round);

        prism_xz(hood_points, hood_width);

        // Four fender arches over the wheels.
        for (side = [-1, 1]) {
            for (axle_x = [front_axle_x, rear_axle_x]) {
                translate([axle_x, side*wheel_center_y, wheel_center_z])
                    fender_arch(fender_width, fender_inner_radius, fender_thickness);
            }
        }
    }

    // Raised deck border and hood ribs to mimic black outline/detailing.
    color(edge_col) union() {
        edge_z = deck_top_z + deck_edge_height / 2 - eps;

        for (side = [-1, 1]) {
            translate([deck_center_x, side*(deck_width/2 - deck_edge_thickness/2), edge_z])
                cube([deck_length, deck_edge_thickness, deck_edge_height], center=true);
        }

        for (xpos = [deck_center_x - deck_length/2 + deck_edge_thickness/2,
                     deck_center_x + deck_length/2 - deck_edge_thickness/2]) {
            translate([xpos, 0, edge_z])
                cube([deck_edge_thickness, deck_width, deck_edge_height], center=true);
        }

        // Transverse slats across the sloped hood.
        for (p = hood_slats) {
            translate([p[0], 0, p[1]])
                rotate([0, hood_slat_angle, 0])
                    cube([hood_slat_width, hood_slat_depth, hood_slat_height], center=true);
        }

        // Side louver marks on both sides of the hood.
        for (side = [-1, 1]) {
            for (i = [0 : vent_louver_count - 1]) {
                translate([vent_louver_start_x + i*vent_louver_spacing,
                           side*(hood_width/2 + vent_louver_thickness/2 - eps),
                           vent_louver_z])
                    cube([vent_louver_width,
                          vent_louver_thickness,
                          vent_louver_height], center=true);
            }
        }
    }
}

// -------------------------
// Cab module
// -------------------------
module cab() {
    front_x = cab_center_x - cab_length / 2;
    back_x  = cab_center_x + cab_length / 2;

    post_x_front = front_x + cab_post_size / 2;
    post_x_back  = back_x  - cab_post_size / 2;
    post_y_left  = -cab_width / 2 + cab_post_size / 2;
    post_y_right =  cab_width / 2 - cab_post_size / 2;

    post_bottom_z = cab_base_z + cab_floor_height - eps;
    post_center_z = post_bottom_z + cab_post_height / 2;
    post_top_z    = post_bottom_z + cab_post_height;

    sill_z       = post_bottom_z + cab_window_bottom_offset - cab_sill_bar_height / 2;
    header_z     = post_top_z - cab_header_height / 2;
    window_z     = post_bottom_z + cab_window_bottom_offset + cab_window_height / 2;
    roof_z       = post_top_z + cab_roof_height / 2 - eps;

    front_open_width = (cab_width - 3*cab_post_size) / 2;
    front_pane_width = front_open_width - 2*cab_window_gap;
    front_pane_y     = cab_post_size / 2 + cab_window_gap + front_pane_width / 2;

    side_pane_length = cab_length - 2*cab_post_size - 2*cab_window_gap;

    // Cab structural frame with open window spaces.
    color(body_col) union() {
        translate([cab_center_x, 0, cab_base_z + cab_floor_height / 2])
            rounded_box(cab_length, cab_width, cab_floor_height, 0.8);

        // Corner posts.
        for (px = [post_x_front, post_x_back]) {
            for (py = [post_y_left, post_y_right]) {
                translate([px, py, post_center_z])
                    cube([cab_post_size, cab_post_size, cab_post_height], center=true);
            }
        }

        // Center pillars on front/rear and side faces.
        translate([post_x_front, 0, post_center_z])
            cube([cab_post_size, cab_center_pillar_size, cab_post_height], center=true);

        translate([post_x_back, 0, post_center_z])
            cube([cab_post_size, cab_center_pillar_size, cab_post_height], center=true);

        for (side = [-1, 1]) {
            translate([cab_center_x, side*(cab_width/2 - cab_post_size/2), post_center_z])
                cube([cab_center_pillar_size, cab_post_size, cab_post_height], center=true);
        }

        // Lower sill ring.
        translate([post_x_front, 0, sill_z])
            cube([cab_post_size, cab_width, cab_sill_bar_height], center=true);

        translate([post_x_back, 0, sill_z])
            cube([cab_post_size, cab_width, cab_sill_bar_height], center=true);

        for (side = [-1, 1]) {
            translate([cab_center_x, side*(cab_width/2 - cab_post_size/2), sill_z])
                cube([cab_length, cab_post_size, cab_sill_bar_height], center=true);
        }

        // Upper header ring.
        translate([post_x_front, 0, header_z])
            cube([cab_post_size, cab_width, cab_header_height], center=true);

        translate([post_x_back, 0, header_z])
            cube([cab_post_size, cab_width, cab_header_height], center=true);

        for (side = [-1, 1]) {
            translate([cab_center_x, side*(cab_width/2 - cab_post_size/2), header_z])
                cube([cab_length, cab_post_size, cab_header_height], center=true);
        }

        // Rounded roof with overhang.
        translate([cab_center_x, 0, roof_z])
            rounded_box(cab_length + 2*cab_roof_overhang,
                        cab_width  + 2*cab_roof_overhang,
                        cab_roof_height,
                        cab_roof_round);
    }

    // Slightly transparent panes for visual window contrast.
    color(window_col, window_alpha) union() {
        // Front windows.
        for (side = [-1, 1]) {
            translate([front_x + cab_post_size + window_pane_t/2,
                       side*front_pane_y,
                       window_z])
                cube([window_pane_t, front_pane_width, cab_window_height], center=true);
        }

        // Rear windows.
        for (side = [-1, 1]) {
            translate([back_x - cab_post_size - window_pane_t/2,
                       side*front_pane_y,
                       window_z])
                cube([window_pane_t, front_pane_width, cab_window_height], center=true);
        }

        // Side windows.
        for (side = [-1, 1]) {
            translate([cab_center_x,
                       side*(cab_width/2 - cab_post_size - window_pane_t/2),
                       window_z])
                cube([side_pane_length, window_pane_t, cab_window_height], center=true);
        }
    }
}

// -------------------------
// Bucket module
// -------------------------
module bucket() {
    color(body_col) union() {
        // Bucket floor plate.
        panel_between_xz([bucket_front_x, bucket_front_floor_z],
                         [bucket_back_bottom_x, bucket_back_bottom_z],
                         bucket_width,
                         bucket_sheet_thickness);

        // Tall rear/back plate of scoop.
        panel_between_xz([bucket_back_bottom_x, bucket_back_bottom_z],
                         [bucket_back_top_x, bucket_back_top_z],
                         bucket_width,
                         bucket_sheet_thickness);

        // Triangular side cheeks.
        for (side = [-1, 1]) {
            translate([0, side*(bucket_width/2 - bucket_side_thickness/2), 0])
                prism_xz(bucket_side_points, bucket_side_thickness);
        }

        // Round cutting/front and top lips.
        y_cylinder_at([bucket_front_x, bucket_front_floor_z],
                      0,
                      bucket_width + 2*bucket_side_thickness,
                      bucket_cutting_edge_diameter);

        y_cylinder_at([bucket_back_top_x, bucket_back_top_z],
                      0,
                      bucket_width + 2*bucket_side_thickness,
                      bucket_lip_diameter);

        y_cylinder_at([bucket_back_bottom_x, bucket_back_bottom_z],
                      0,
                      bucket_width + 2*bucket_side_thickness,
                      bucket_lip_diameter);

        // Side reinforcing edge bars.
        for (side = [-1, 1]) {
            side_y = side*(bucket_width/2 + bucket_side_thickness/2 - bucket_side_overlap);

            translate([0, side_y, 0])
                panel_between_xz([bucket_front_x, bucket_front_floor_z],
                                 [bucket_front_top_x, bucket_front_top_z],
                                 bucket_side_thickness,
                                 bucket_lip_diameter);

            translate([0, side_y, 0])
                panel_between_xz([bucket_front_top_x, bucket_front_top_z],
                                 [bucket_back_top_x, bucket_back_top_z],
                                 bucket_side_thickness,
                                 bucket_lip_diameter);

            translate([0, side_y, 0])
                panel_between_xz([bucket_back_bottom_x, bucket_back_bottom_z],
                                 [bucket_back_top_x, bucket_back_top_z],
                                 bucket_side_thickness,
                                 bucket_lip_diameter);
        }
    }

    // Raised ribs on the broad bucket back plate.
    color(edge_col) union() {
        for (rib_y = bucket_rib_y_positions) {
            translate([0, rib_y, 0])
                panel_between_xz([bucket_back_bottom_x + 1.2, bucket_back_bottom_z + 1.4],
                                 [bucket_back_top_x - 1.2,    bucket_back_top_z - 1.2],
                                 bucket_rib_width,
                                 bucket_rib_thickness);
        }
    }
}

// -------------------------
// Loader arm / hydraulic module
// -------------------------
module loader_arms() {
    // Plate-like articulated arms on both sides of the hood.
    color(body_col) union() {
        for (side = [-1, 1]) {
            ypos = side * arm_y_offset;

            // Upper arched arm, made of two rounded link segments.
            rounded_link_xz(arm_upper_a, arm_upper_b, ypos,
                            arm_plate_thickness, arm_radius, arm_hole_diameter);
            rounded_link_xz(arm_upper_b, arm_upper_c, ypos,
                            arm_plate_thickness, arm_radius, arm_hole_diameter);

            // Lower support link.
            rounded_link_xz(arm_lower_a, arm_lower_b, ypos,
                            arm_plate_thickness, arm_radius * 0.85, arm_hole_diameter);
            rounded_link_xz(arm_lower_b, arm_lower_c, ypos,
                            arm_plate_thickness, arm_radius * 0.85, arm_hole_diameter);

            // Short bucket tilt link.
            rounded_link_xz(arm_lower_a, arm_upper_a, ypos,
                            arm_plate_thickness, arm_radius * 0.75, arm_hole_diameter);

            // Pivot collars at joints.
            for (p = [arm_upper_a, arm_upper_b, arm_upper_c,
                      arm_lower_a, arm_lower_b, arm_lower_c]) {
                y_ring_at(p, ypos, arm_boss_thickness,
                          arm_boss_outer_diameter, arm_hole_diameter);
            }
        }

        // Cross tubes/pins running between the two arms.
        y_cylinder_at(arm_upper_a, 0,
                      2*arm_y_offset + arm_plate_thickness,
                      arm_cross_tube_diameter);

        y_cylinder_at(arm_lower_a, 0,
                      2*arm_y_offset + arm_plate_thickness,
                      arm_cross_tube_diameter);

        y_cylinder_at(arm_upper_c, 0,
                      2*arm_y_offset + arm_plate_thickness,
                      arm_cross_tube_diameter);

        y_cylinder_at(arm_lower_c, 0,
                      2*arm_y_offset + arm_plate_thickness,
                      arm_cross_tube_diameter);
    }

    // Hydraulic cylinders and exposed rods.
    color(metal_col) union() {
        for (side = [-1, 1]) {
            ypos = side * (arm_y_offset - hydraulic_y_inset);

            cylinder_between([hydraulic_body_start_x, ypos, hydraulic_body_start_z],
                             [hydraulic_body_end_x,   ypos, hydraulic_body_end_z],
                             hydraulic_body_diameter);

            cylinder_between([hydraulic_body_end_x, ypos, hydraulic_body_end_z],
                             [hydraulic_rod_end_x,  ypos, hydraulic_rod_end_z],
                             hydraulic_rod_diameter);
        }
    }
}

// -------------------------
// Exhaust and roof details
// -------------------------
module exhaust_and_roof_details() {
    color(body_col) union() {
        translate([exhaust_x, exhaust_y, exhaust_base_z + exhaust_height/2])
            tube_z(exhaust_height, exhaust_outer_diameter, exhaust_inner_diameter);

        translate([exhaust_x,
                   exhaust_y,
                   exhaust_base_z + exhaust_height + exhaust_rim_height/2 - eps])
            tube_z(exhaust_rim_height,
                   exhaust_outer_diameter + exhaust_rim_extra,
                   exhaust_inner_diameter);
    }

    color(edge_col) {
        translate([beacon_x, beacon_y, cab_roof_top_z + beacon_height/2 - eps])
            cylinder(h=beacon_height, d=beacon_diameter, center=true);
    }
}

// -------------------------
// Axles
// -------------------------
module axles() {
    color(metal_col) {
        for (axle_x = [front_axle_x, rear_axle_x]) {
            translate([axle_x, 0, wheel_center_z])
                rotate([90, 0, 0])
                    cylinder(h=2*wheel_center_y + 2*tire_width,
                             d=axle_diameter,
                             center=true);
        }
    }
}

// -------------------------
// Main assembly
// -------------------------
module wheel_loader() {
    union() {
        axles();

        // Four treaded wheels.
        for (side = [-1, 1]) {
            for (axle_x = [front_axle_x, rear_axle_x]) {
                translate([axle_x, side*wheel_center_y, wheel_center_z])
                    wheel();
            }
        }

        chassis_body();
        bucket();
        loader_arms();
        cab();
        exhaust_and_roof_details();
    }
}

wheel_loader();