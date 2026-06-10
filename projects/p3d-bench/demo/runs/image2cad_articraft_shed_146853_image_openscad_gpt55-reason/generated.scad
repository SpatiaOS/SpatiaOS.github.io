// Parametric shed / greenhouse-style structure inspired by the reference image.
// Units: millimeters.

// -----------------------------------------------------------------------------
// Global resolution and tolerances
// -----------------------------------------------------------------------------
curve_segments = 32;
$fn = curve_segments;

eps = 0.01;
detail_embed = 0.20;
axis_parallel_threshold = 0.95;

// -----------------------------------------------------------------------------
// Main building proportions
// -----------------------------------------------------------------------------
building_length = 120;
building_width = 70;

base_height = 5;
base_overhang = 4;

wall_height = 48;
wall_thickness = 2.0;

eave_z = base_height + wall_height;

// -----------------------------------------------------------------------------
// Wall panel and trim dimensions
// -----------------------------------------------------------------------------
panel_thickness = wall_thickness;

batten_width = 1.6;
batten_depth = 1.1;

side_batten_spacing = 11.5;
end_batten_spacing = 10.5;

corner_post_width = 3.0;

bottom_trim_height = 4.0;
top_trim_height = 3.0;
trim_depth = 1.3;

// -----------------------------------------------------------------------------
// Gable and roof dimensions
// -----------------------------------------------------------------------------
roof_rise = 30;
ridge_z = eave_z + roof_rise;

roof_side_overhang = 3;
roof_end_overhang = 4;

roof_half_span = building_width / 2 + roof_side_overhang;
roof_length = building_length + 2 * roof_end_overhang;
roof_x_min = -roof_length / 2;
roof_x_max = roof_length / 2;
roof_slope_length = sqrt(roof_half_span * roof_half_span + roof_rise * roof_rise);

gable_half_span = building_width / 2;
gable_batten_spacing = 9;
gable_min_batten_height = 3;

// Roof timber sizes
rafter_count = 10;

roof_primary_width = 3.4;
roof_primary_depth = 3.4;

rafter_width = 3.0;
rafter_depth = 3.0;

purlin_width = 2.2;
purlin_depth = 2.2;
roof_purlin_t_values = [0.32, 0.62];

roof_brace_width = 1.5;
roof_brace_depth = 1.5;
roof_brace_low_t = 0.16;
roof_brace_high_t = 0.84;

tie_beam_width = 2.2;
tie_beam_depth = 2.2;

roof_web_width = 1.4;
roof_king_post_width = 1.7;
truss_web_ratio = 0.52;

// Partial solid roof panel seen on one roof bay
roof_panel_side = -1;
roof_panel_front_offset = 4;
roof_panel_length = 34;
roof_panel_t_start = 0.03;
roof_panel_t_end = 0.96;
roof_panel_thickness = 1.2;

roof_panel_x_start = roof_x_min + roof_panel_front_offset;
roof_panel_x_end = roof_panel_x_start + roof_panel_length;

// -----------------------------------------------------------------------------
// Double front door dimensions
// -----------------------------------------------------------------------------
door_width = 42;
door_height = 39;
door_bottom_gap = 2.0;

door_panel_depth = 1.4;
door_frame_width = 2.2;
door_frame_depth = 1.4;

door_inner_frame_width = 1.1;

door_bottom_z = base_height + door_bottom_gap;
door_center_z = door_bottom_z + door_height / 2;
door_outer_face_x = -building_length / 2 - door_panel_depth;
door_frame_outer_face_x = door_outer_face_x - door_frame_depth;

hinge_count = 4;
hinge_plate_width = 3.2;
hinge_plate_height = 3.6;
hinge_plate_depth = 0.8;
hinge_pin_radius = 0.45;
hinge_pin_standoff = 0.25;

door_handle_width = 1.0;
door_handle_height = 4.0;
door_handle_depth = 0.7;
door_handle_offset_y = 2.8;
door_handle_z_ratio = 0.55;

// -----------------------------------------------------------------------------
// Colors for preview
// -----------------------------------------------------------------------------
panel_color = [0.68, 0.68, 0.70, 1.0];
frame_color = [0.36, 0.37, 0.39, 1.0];
base_color = [0.55, 0.55, 0.56, 1.0];
roof_sheet_color = [0.74, 0.74, 0.76, 1.0];
hinge_color = [0.10, 0.10, 0.10, 1.0];

// -----------------------------------------------------------------------------
// Vector helpers
// -----------------------------------------------------------------------------
function v_sub(a, b) = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

function v_unit(v) =
    let(n = norm(v))
    (n < eps ? [0, 0, 0] : [v[0] / n, v[1] / n, v[2] / n]);

function rafter_x(i) =
    roof_x_min + i * roof_length / (rafter_count - 1);

function roof_point(side, x, t) =
    [x, side * roof_half_span * (1 - t), eave_z + roof_rise * t];

function gable_roof_z(y) =
    eave_z + roof_rise * (1 - abs(y) / gable_half_span);

// -----------------------------------------------------------------------------
// General rectangular beam between two 3D points.
// The beam is a true cuboid oriented along the point-to-point vector.
// -----------------------------------------------------------------------------
module beam_between(p1, p2, w = 2, h = 2) {
    d = v_sub(p2, p1);
    l = norm(d);

    if (l > eps) {
        x_axis = v_unit(d);
        ref_axis = (abs(x_axis[2]) < axis_parallel_threshold) ? [0, 0, 1] : [0, 1, 0];
        y_axis = v_unit(cross(ref_axis, x_axis));
        z_axis = cross(x_axis, y_axis);

        multmatrix([
            [x_axis[0], y_axis[0], z_axis[0], p1[0]],
            [x_axis[1], y_axis[1], z_axis[1], p1[1]],
            [x_axis[2], y_axis[2], z_axis[2], p1[2]],
            [0,         0,         0,         1]
        ])
        translate([0, -w / 2, -h / 2])
            cube([l, w, h], center = false);
    }
}

// -----------------------------------------------------------------------------
// Exterior trim helpers for walls
// -----------------------------------------------------------------------------
module side_exterior_strip(side = 1, x_center = 0, z_center = 0, x_size = 1, z_size = 1, depth = 1) {
    translate([
        x_center,
        side * (building_width / 2 + (depth - detail_embed) / 2),
        z_center
    ])
        cube([x_size, depth + detail_embed, z_size], center = true);
}

module end_exterior_strip(end_side = 1, y_center = 0, z_center = 0, y_size = 1, z_size = 1, depth = 1) {
    translate([
        end_side * (building_length / 2 + (depth - detail_embed) / 2),
        y_center,
        z_center
    ])
        cube([depth + detail_embed, y_size, z_size], center = true);
}

module front_door_plate(y_center = 0, z_center = 0, y_size = 1, z_size = 1, depth = 1) {
    translate([
        door_outer_face_x - (depth - detail_embed) / 2,
        y_center,
        z_center
    ])
        cube([depth + detail_embed, y_size, z_size], center = true);
}

module front_hardware_plate(y_center = 0, z_center = 0, y_size = 1, z_size = 1, depth = 1) {
    translate([
        door_frame_outer_face_x - (depth - detail_embed) / 2,
        y_center,
        z_center
    ])
        cube([depth + detail_embed, y_size, z_size], center = true);
}

// -----------------------------------------------------------------------------
// Base plinth
// -----------------------------------------------------------------------------
module foundation() {
    color(base_color)
    translate([0, 0, base_height / 2])
        cube([
            building_length + 2 * base_overhang,
            building_width + 2 * base_overhang,
            base_height
        ], center = true);
}

// -----------------------------------------------------------------------------
// Long side wall with raised vertical battens and horizontal trims
// -----------------------------------------------------------------------------
module side_wall(side = 1) {
    color(panel_color)
    translate([
        0,
        side * (building_width / 2 - panel_thickness / 2),
        base_height + wall_height / 2
    ])
        cube([building_length, panel_thickness, wall_height], center = true);

    color(frame_color) {
        // Repeating vertical siding battens
        for (x = [-building_length / 2 + side_batten_spacing : side_batten_spacing : building_length / 2 - side_batten_spacing]) {
            side_exterior_strip(side, x, base_height + wall_height / 2, batten_width, wall_height, batten_depth);
        }

        // Corner posts
        side_exterior_strip(side, -building_length / 2 + corner_post_width / 2, base_height + wall_height / 2, corner_post_width, wall_height, trim_depth);
        side_exterior_strip(side,  building_length / 2 - corner_post_width / 2, base_height + wall_height / 2, corner_post_width, wall_height, trim_depth);

        // Bottom and top rails
        side_exterior_strip(side, 0, base_height + bottom_trim_height / 2, building_length, bottom_trim_height, trim_depth);
        side_exterior_strip(side, 0, eave_z - top_trim_height / 2, building_length, top_trim_height, trim_depth);
    }
}

// -----------------------------------------------------------------------------
// Short end wall. The front end receives the separate double door overlay.
// -----------------------------------------------------------------------------
module end_wall(end_side = 1) {
    color(panel_color)
    translate([
        end_side * (building_length / 2 - panel_thickness / 2),
        0,
        base_height + wall_height / 2
    ])
        cube([panel_thickness, building_width, wall_height], center = true);

    color(frame_color) {
        // Repeating vertical siding battens
        for (y = [-building_width / 2 + end_batten_spacing : end_batten_spacing : building_width / 2 - end_batten_spacing]) {
            end_exterior_strip(end_side, y, base_height + wall_height / 2, batten_width, wall_height, batten_depth);
        }

        // Corner posts
        end_exterior_strip(end_side, -building_width / 2 + corner_post_width / 2, base_height + wall_height / 2, corner_post_width, wall_height, trim_depth);
        end_exterior_strip(end_side,  building_width / 2 - corner_post_width / 2, base_height + wall_height / 2, corner_post_width, wall_height, trim_depth);

        // Bottom and top rails
        end_exterior_strip(end_side, 0, base_height + bottom_trim_height / 2, building_width, bottom_trim_height, trim_depth);
        end_exterior_strip(end_side, 0, eave_z - top_trim_height / 2, building_width, top_trim_height, trim_depth);
    }
}

// -----------------------------------------------------------------------------
// Thin triangular gable infill panel
// -----------------------------------------------------------------------------
module gable_panel_prism(end_side = 1) {
    x0 = end_side * building_length / 2 - wall_thickness / 2;
    x1 = end_side * building_length / 2 + wall_thickness / 2;
    z0 = eave_z - detail_embed;

    polyhedron(
        points = [
            [x0, -gable_half_span, z0],
            [x0,  gable_half_span, z0],
            [x0,  0,               ridge_z],

            [x1, -gable_half_span, z0],
            [x1,  gable_half_span, z0],
            [x1,  0,               ridge_z]
        ],
        faces = [
            [0, 2, 1],
            [3, 4, 5],
            [0, 1, 4, 3],
            [0, 3, 5, 2],
            [1, 2, 5, 4]
        ],
        convexity = 3
    );
}

// -----------------------------------------------------------------------------
// Gable end detailing: vertical battens, outline rafters, king post, and webbing
// -----------------------------------------------------------------------------
module gable_end(end_side = 1) {
    color(panel_color)
        gable_panel_prism(end_side);

    color(frame_color) {
        x = end_side * building_length / 2;

        // Vertical battens inside the triangular gable.
        for (y = [-gable_half_span + gable_batten_spacing : gable_batten_spacing : gable_half_span - gable_batten_spacing]) {
            h = gable_roof_z(y) - eave_z;
            if (h > gable_min_batten_height) {
                end_exterior_strip(
                    end_side,
                    y,
                    eave_z + h / 2 - detail_embed / 2,
                    batten_width,
                    h + detail_embed,
                    batten_depth
                );
            }
        }

        // Gable outline and internal triangular framing.
        beam_between([x, -gable_half_span, eave_z], [x, 0, ridge_z], roof_primary_width, roof_primary_depth);
        beam_between([x,  gable_half_span, eave_z], [x, 0, ridge_z], roof_primary_width, roof_primary_depth);
        beam_between([x, -gable_half_span, eave_z], [x, gable_half_span, eave_z], roof_primary_width, roof_primary_depth);

        beam_between([x, 0, eave_z], [x, 0, ridge_z], roof_king_post_width, roof_king_post_width);
        beam_between([x, -gable_half_span, eave_z], [x, 0, eave_z + roof_rise * truss_web_ratio], roof_web_width, roof_web_width);
        beam_between([x,  gable_half_span, eave_z], [x, 0, eave_z + roof_rise * truss_web_ratio], roof_web_width, roof_web_width);
    }
}

// -----------------------------------------------------------------------------
// Door decorative raised rectangular frame
// -----------------------------------------------------------------------------
module door_raised_rectangle(yc, zc, w, h, bar_w) {
    front_door_plate(yc - w / 2, zc, bar_w, h, door_frame_depth * 0.75);
    front_door_plate(yc + w / 2, zc, bar_w, h, door_frame_depth * 0.75);
    front_door_plate(yc, zc - h / 2, w + bar_w, bar_w, door_frame_depth * 0.75);
    front_door_plate(yc, zc + h / 2, w + bar_w, bar_w, door_frame_depth * 0.75);
}

// -----------------------------------------------------------------------------
// Double front doors with frames, hinges, pins, and small handles
// -----------------------------------------------------------------------------
module double_door() {
    color(panel_color)
    translate([
        -building_length / 2 - (door_panel_depth - detail_embed) / 2,
        0,
        door_center_z
    ])
        cube([door_panel_depth + detail_embed, door_width, door_height], center = true);

    color(frame_color) {
        // Outer door frame
        front_door_plate(-door_width / 2, door_center_z, door_frame_width, door_height, door_frame_depth);
        front_door_plate( door_width / 2, door_center_z, door_frame_width, door_height, door_frame_depth);
        front_door_plate(0, door_bottom_z + door_frame_width / 2, door_width + door_frame_width, door_frame_width, door_frame_depth);
        front_door_plate(0, door_bottom_z + door_height - door_frame_width / 2, door_width + door_frame_width, door_frame_width, door_frame_depth);

        // Center seam between the two door leaves
        front_door_plate(0, door_center_z, door_frame_width, door_height, door_frame_depth);

        // Raised rectangular panel frames on each leaf
        leaf_panel_width = door_width / 2 - 4 * door_frame_width;
        leaf_panel_height = door_height - 4 * door_frame_width - 4;

        door_raised_rectangle(-door_width / 4, door_center_z, leaf_panel_width, leaf_panel_height, door_inner_frame_width);
        door_raised_rectangle( door_width / 4, door_center_z, leaf_panel_width, leaf_panel_height, door_inner_frame_width);
    }

    color(hinge_color) {
        // Hinges along both outer sides
        for (door_side = [-1, 1]) {
            for (i = [0 : hinge_count - 1]) {
                hz = door_bottom_z + door_height * (i + 1) / (hinge_count + 1);
                hy = door_side * (door_width / 2 + hinge_plate_width / 4);

                front_hardware_plate(hy, hz, hinge_plate_width, hinge_plate_height, hinge_plate_depth);

                translate([
                    door_frame_outer_face_x - hinge_plate_depth - hinge_pin_standoff,
                    door_side * (door_width / 2 + hinge_plate_width / 2),
                    hz
                ])
                    cylinder(h = hinge_plate_height + 0.8, r = hinge_pin_radius, center = true);
            }
        }

        // Small pull handles near the center seam
        handle_z = door_bottom_z + door_height * door_handle_z_ratio;

        front_hardware_plate(-door_handle_offset_y, handle_z, door_handle_width, door_handle_height, door_handle_depth);
        front_hardware_plate( door_handle_offset_y, handle_z, door_handle_width, door_handle_height, door_handle_depth);
    }
}

// -----------------------------------------------------------------------------
// Sloped rectangular sheet used for the single solid roof bay.
// Coordinates use t = 0 at eave and t = 1 at ridge.
// -----------------------------------------------------------------------------
module roof_sheet(side = -1, x0 = 0, x1 = 10, t0 = 0, t1 = 1, thick = 1) {
    u_axis = [1, 0, 0];

    // Direction chosen so u_axis, v_axis, n_axis remain right-handed.
    v_axis = (side < 0)
        ? v_unit([0, -side * roof_half_span,  roof_rise])
        : v_unit([0,  side * roof_half_span, -roof_rise]);

    n_axis = v_unit(cross(u_axis, v_axis));

    p_start = (side < 0)
        ? roof_point(side, x0, t0)
        : roof_point(side, x0, t1);

    sheet_x_len = x1 - x0;
    sheet_slope_len = roof_slope_length * abs(t1 - t0);

    if (sheet_x_len > eps && sheet_slope_len > eps) {
        multmatrix([
            [u_axis[0], v_axis[0], n_axis[0], p_start[0]],
            [u_axis[1], v_axis[1], n_axis[1], p_start[1]],
            [u_axis[2], v_axis[2], n_axis[2], p_start[2]],
            [0,         0,         0,         1]
        ])
            cube([sheet_x_len, sheet_slope_len, thick], center = false);
    }
}

// -----------------------------------------------------------------------------
// Roof framing: ridge beam, eaves, purlins, repeated rafters, diagonal bracing,
// tie beams, and truss webs.
// -----------------------------------------------------------------------------
module roof_frame() {
    // Single solid roof panel placed before framing so the timber appears proud.
    color(roof_sheet_color)
        roof_sheet(
            roof_panel_side,
            roof_panel_x_start,
            roof_panel_x_end,
            roof_panel_t_start,
            roof_panel_t_end,
            roof_panel_thickness
        );

    color(frame_color) {
        // Ridge beam
        beam_between([roof_x_min, 0, ridge_z], [roof_x_max, 0, ridge_z], roof_primary_width, roof_primary_depth);

        // Eave beams, rake beams, purlins, rafters, and roof-plane braces.
        for (side = [-1, 1]) {
            // Long eave beam
            beam_between(roof_point(side, roof_x_min, 0), roof_point(side, roof_x_max, 0), roof_primary_width, roof_primary_depth);

            // Rake beams at roof ends
            beam_between(roof_point(side, roof_x_min, 0), roof_point(side, roof_x_min, 1), roof_primary_width, roof_primary_depth);
            beam_between(roof_point(side, roof_x_max, 0), roof_point(side, roof_x_max, 1), roof_primary_width, roof_primary_depth);

            // Purlins running parallel to the ridge
            for (t = roof_purlin_t_values) {
                beam_between(roof_point(side, roof_x_min, t), roof_point(side, roof_x_max, t), purlin_width, purlin_depth);
            }

            // Repeating rafters from eave to ridge
            for (i = [0 : rafter_count - 1]) {
                x = rafter_x(i);
                beam_between(roof_point(side, x, 0), roof_point(side, x, 1), rafter_width, rafter_depth);
            }

            // Alternating diagonal braces between rafter bays
            for (i = [0 : rafter_count - 2]) {
                x1 = rafter_x(i);
                x2 = rafter_x(i + 1);

                if (i % 2 == 0) {
                    beam_between(
                        roof_point(side, x1, roof_brace_low_t),
                        roof_point(side, x2, roof_brace_high_t),
                        roof_brace_width,
                        roof_brace_depth
                    );
                } else {
                    beam_between(
                        roof_point(side, x1, roof_brace_high_t),
                        roof_point(side, x2, roof_brace_low_t),
                        roof_brace_width,
                        roof_brace_depth
                    );
                }
            }
        }

        // Cross ties and triangular truss webbing at each rafter station
        for (i = [0 : rafter_count - 1]) {
            x = rafter_x(i);

            beam_between([x, -roof_half_span, eave_z], [x, roof_half_span, eave_z], tie_beam_width, tie_beam_depth);
            beam_between([x, 0, eave_z], [x, 0, ridge_z], roof_king_post_width, roof_king_post_width);

            for (side = [-1, 1]) {
                beam_between(
                    [x, side * roof_half_span, eave_z],
                    [x, 0, eave_z + roof_rise * truss_web_ratio],
                    roof_web_width,
                    roof_web_width
                );
            }
        }
    }
}

// -----------------------------------------------------------------------------
// Complete model assembly
// -----------------------------------------------------------------------------
module wall_system() {
    side_wall(-1);
    side_wall(1);

    end_wall(-1);
    end_wall(1);

    gable_end(-1);
    gable_end(1);
}

module shed_model() {
    union() {
        foundation();
        wall_system();
        double_door();
        roof_frame();
    }
}

shed_model();