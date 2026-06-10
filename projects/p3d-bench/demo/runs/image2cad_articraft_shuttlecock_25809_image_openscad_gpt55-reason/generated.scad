// Perforated scalloped drum / basket modeled from the reference image.
// Interpretation: tapered hollow perforated shell with 8 scalloped/spiral panels,
// raised ribs, mixed slot/round/diagonal perforations, front scalloped rim,
// and a smooth rounded rear cap with collar grooves.
// Units: millimeters.

// -------------------------
// Global resolution
// -------------------------
$fn = 96;
eps = 0.05;

// -------------------------
// Main body proportions
// -------------------------
body_length = 130;
front_outer_diameter = 96;
rear_outer_diameter = 78;
wall_thickness = 2.2;

panel_count = 8;
body_twist_degrees = 22;          // gentle spiral visible in the reference
body_lobe_amplitude = 1.6;        // subtle scalloped/fluted outer body
body_outline_segments = 160;
body_twist_slices = 72;

// -------------------------
// Front scalloped rim
// -------------------------
front_rim_width = 8;
front_rim_forward = 2.2;          // rim extends slightly forward of shell
front_rim_radial_thickness = 6.0;
rim_lobe_amplitude = 4.2;

rim_lug_count = panel_count;
rim_lug_radial = 3.2;
rim_lug_tangential = 5.2;
rim_lug_axial = 2.6;

// -------------------------
// Raised helical ribs
// -------------------------
rib_width = 4.0;
rib_height = 2.8;
rib_overlap = 0.65;
rib_segments = 18;
rib_block_axial_length = 6.0;
rib_z_start = 3.0;
rib_z_end = body_length - 4.0;

// -------------------------
// Circumferential reinforcing bands on body
// -------------------------
body_band_positions = [31, 68, 105];
body_band_width = 3.6;
body_band_height = 2.0;
body_band_inner_overlap = 0.5;

// -------------------------
// Smooth rear collar / rounded cap
// -------------------------
rear_cap_radial_overhang = 2.2;
rear_collar_length = 13.5;
rear_overlap = 3.0;

rear_flange_width = 5.2;
rear_flange_height = 1.3;

rear_cap_cyl_length = 6.0;
rear_dome_length = 28.0;
rear_dome_steps = 32;

rear_groove_offsets = [4.2, 10.6];
rear_groove_radius = 0.75;
rear_groove_major_offset = 0.15;
rear_groove_segments = 24;

// -------------------------
// Perforation parameters
// -------------------------
perforation_cut_depth = 22;

slot_width = 2.5;
slot_length = 15.0;
slot_z_positions = [16, 55, 94];
slot_angle_offsets = [-13.5, -6.75, 0, 6.75, 13.5];
slot_alt_z_shift = 4.0;

round_hole_diameter = 5.8;
round_hole_z_positions = [38, 80, 115];
round_hole_angle_offsets = [-16, -8, 0, 8, 16];
round_hole_row_slope = 0.20;
round_hole_alt_z_shift = -2.5;
round_hole_segments = 28;

diagonal_slit_width = 1.9;
diagonal_slit_length = 13.5;
diagonal_slit_tilt = 32;
diagonal_slit_z_positions = [28, 48, 68, 88, 108];
diagonal_slit_angle_offsets = [-11, 0, 11];
diagonal_alt_z_shift = 3.0;

// -------------------------
// Appearance
// -------------------------
preview_color = [0.72, 0.72, 0.69];

// -------------------------
// Derived values
// -------------------------
front_radius = front_outer_diameter / 2;
rear_radius = rear_outer_diameter / 2;
front_inner_radius = front_radius - wall_thickness;

body_taper_scale = rear_radius / front_radius;
panel_angle = 360 / panel_count;

rear_cap_radius = rear_radius + rear_cap_radial_overhang;

// -------------------------
// Helper functions
// -------------------------
function taper_scale_at(z) =
    1 + (body_taper_scale - 1) * (z / body_length);

function radius_at(z) =
    front_radius * taper_scale_at(z);

function inner_radius_at(z) =
    front_inner_radius * taper_scale_at(z);

function lobe_amp_at(z) =
    body_lobe_amplitude * taper_scale_at(z);

function rib_radius_at(z) =
    radius_at(z) + lobe_amp_at(z);

function cut_radius_at(z) =
    radius_at(z) + lobe_amp_at(z) * 0.35;

function theta_at_z(base_theta, z) =
    base_theta + body_twist_degrees * (z / body_length);

function scalloped_points(n, base_r, amp, lobes, phase = 0) =
    [
        for (i = [0 : 1 : n - 1])
            let(
                a = 360 * i / n,
                r = base_r + amp * (0.5 + 0.5 * cos(lobes * (a - phase)))
            )
            [r * cos(a), r * sin(a)]
    ];

function dome_profile_points(r, cyl_len, dome_len, steps) =
    concat(
        [[0, 0], [r, 0], [r, cyl_len]],
        [
            for (i = [1 : 1 : steps])
                let(a = 90 * i / steps)
                [r * cos(a), cyl_len + dome_len * sin(a)]
        ]
    );

// -------------------------
// Basic reusable geometry
// -------------------------
module torus(major_r, minor_r, minor_segments = 24) {
    rotate_extrude(convexity = 10, $fn = body_outline_segments)
        translate([major_r, 0])
            circle(r = minor_r, $fn = minor_segments);
}

// Twisted, tapered, subtly scalloped hollow body.
module body_shell() {
    linear_extrude(
        height = body_length,
        center = false,
        convexity = 10,
        twist = body_twist_degrees,
        slices = body_twist_slices,
        scale = body_taper_scale
    )
    difference() {
        polygon(points = scalloped_points(
            body_outline_segments,
            front_radius,
            body_lobe_amplitude,
            panel_count,
            0
        ));

        circle(r = front_inner_radius, $fn = body_outline_segments);
    }
}

// Heavier scalloped lip at the open front.
module front_scalloped_rim() {
    translate([0, 0, -front_rim_forward])
        linear_extrude(height = front_rim_width, center = false, convexity = 10)
            difference() {
                polygon(points = scalloped_points(
                    body_outline_segments,
                    front_radius,
                    rim_lobe_amplitude,
                    panel_count,
                    0
                ));

                circle(
                    r = front_radius - front_rim_radial_thickness,
                    $fn = body_outline_segments
                );
            }
}

// Small perimeter lugs/notches visible around the front rim.
module front_rim_lugs() {
    for (i = [0 : 1 : rim_lug_count - 1]) {
        rotate([0, 0, i * 360 / rim_lug_count])
            translate([
                front_radius + rim_lobe_amplitude + rim_lug_radial / 2 - 0.35,
                0,
                -front_rim_forward + front_rim_width / 2
            ])
                cube([rim_lug_radial, rim_lug_tangential, rim_lug_axial], center = true);
    }
}

// Thin raised band wrapped around the body.
module raised_body_band(zc) {
    z0 = max(0, zc - body_band_width / 2);
    z1 = min(body_length, zc + body_band_width / 2);

    difference() {
        translate([0, 0, z0])
            cylinder(
                h = z1 - z0,
                r1 = radius_at(z0) + lobe_amp_at(z0) + body_band_height,
                r2 = radius_at(z1) + lobe_amp_at(z1) + body_band_height,
                center = false,
                $fn = body_outline_segments
            );

        translate([0, 0, z0 - eps])
            cylinder(
                h = z1 - z0 + 2 * eps,
                r1 = max(1, inner_radius_at(z0) - body_band_inner_overlap),
                r2 = max(1, inner_radius_at(z1) - body_band_inner_overlap),
                center = false,
                $fn = body_outline_segments
            );
    }
}

module all_body_bands() {
    for (zc = body_band_positions)
        raised_body_band(zc);
}

// Small rectangular block used to hull continuous spiral ribs.
module rib_block(theta, z) {
    radial_depth = rib_height + rib_overlap;

    rotate([0, 0, theta])
        translate([
            rib_radius_at(z) + rib_height / 2 - rib_overlap / 2,
            0,
            z
        ])
            cube([radial_depth, rib_width, rib_block_axial_length], center = true);
}

// Raised panel rib following the same twist as the body.
module helical_rib(base_theta) {
    for (s = [0 : 1 : rib_segments - 1]) {
        z_a = rib_z_start + (rib_z_end - rib_z_start) * s / rib_segments;
        z_b = rib_z_start + (rib_z_end - rib_z_start) * (s + 1) / rib_segments;

        theta_a = theta_at_z(base_theta, z_a);
        theta_b = theta_at_z(base_theta, z_b);

        hull() {
            rib_block(theta_a, z_a);
            rib_block(theta_b, z_b);
        }
    }
}

module all_helical_ribs() {
    for (i = [0 : 1 : panel_count - 1])
        helical_rib(i * panel_angle);
}

// Rear smooth collar and rounded closed cap.
module rear_smooth_end() {
    union() {
        // Main cylindrical collar overlapping the perforated body.
        translate([0, 0, body_length - rear_overlap])
            cylinder(
                h = rear_collar_length + rear_overlap + eps,
                r = rear_cap_radius,
                center = false,
                $fn = body_outline_segments
            );

        // Slightly raised shoulder/flange at transition to perforated shell.
        translate([0, 0, body_length])
            cylinder(
                h = rear_flange_width,
                r = rear_cap_radius + rear_flange_height,
                center = true,
                $fn = body_outline_segments
            );

        // Bullet-like rounded end cap generated by revolving a 2D profile.
        translate([0, 0, body_length + rear_collar_length - eps])
            rotate_extrude(convexity = 10, $fn = body_outline_segments)
                polygon(points = dome_profile_points(
                    rear_cap_radius,
                    rear_cap_cyl_length,
                    rear_dome_length,
                    rear_dome_steps
                ));
    }
}

// Decorative circumferential groove cuts on rear collar.
module decorative_rear_groove_cuts() {
    for (offset = rear_groove_offsets) {
        translate([0, 0, body_length + offset])
            torus(
                rear_cap_radius + rear_groove_major_offset,
                rear_groove_radius,
                rear_groove_segments
            );
    }
}

// -------------------------
// Perforation cutters
// -------------------------
module radial_rect_cut(theta, z, tangential_w, axial_l, tilt = 0) {
    rotate([0, 0, theta])
        translate([cut_radius_at(z), 0, z])
            rotate([tilt, 0, 0])
                cube([perforation_cut_depth, tangential_w, axial_l], center = true);
}

module radial_round_cut(theta, z, diameter) {
    rotate([0, 0, theta])
        translate([cut_radius_at(z), 0, z])
            rotate([0, 90, 0])
                cylinder(
                    h = perforation_cut_depth,
                    d = diameter,
                    center = true,
                    $fn = round_hole_segments
                );
}

// Mixed perforation pattern on each helical panel.
module panel_perforations(base_theta, panel_id) {
    // Banks of long rectangular slots.
    for (zv = slot_z_positions) {
        for (off = slot_angle_offsets) {
            let(zz = zv + ((panel_id % 2) == 0 ? 0 : slot_alt_z_shift)) {
                radial_rect_cut(
                    theta_at_z(base_theta, zz) + off,
                    zz,
                    slot_width,
                    slot_length,
                    0
                );
            }
        }
    }

    // Rows of circular holes, slightly sloped across each panel.
    for (zv = round_hole_z_positions) {
        for (off = round_hole_angle_offsets) {
            let(zz = zv + off * round_hole_row_slope + ((panel_id % 2) == 0 ? 0 : round_hole_alt_z_shift)) {
                radial_round_cut(
                    theta_at_z(base_theta, zz) + off,
                    zz,
                    round_hole_diameter
                );
            }
        }
    }

    // Narrow diagonal slits resembling the cutting/perforation marks in the image.
    for (zv = diagonal_slit_z_positions) {
        for (off = diagonal_slit_angle_offsets) {
            let(
                zz = zv + ((panel_id % 2) == 0 ? 0 : diagonal_alt_z_shift),
                slit_tilt = (((floor(zv / 10) + panel_id + (off < 0 ? 1 : 0)) % 2) == 0
                    ? diagonal_slit_tilt
                    : -diagonal_slit_tilt)
            ) {
                radial_rect_cut(
                    theta_at_z(base_theta, zz) + off,
                    zz,
                    diagonal_slit_width,
                    diagonal_slit_length,
                    slit_tilt
                );
            }
        }
    }
}

module all_perforation_cuts() {
    union() {
        for (i = [0 : 1 : panel_count - 1]) {
            panel_perforations(i * panel_angle + panel_angle / 2, i);
        }
    }
}

// -------------------------
// Main model
// -------------------------
module perforated_drum_basket() {
    difference() {
        union() {
            body_shell();
            front_scalloped_rim();
            front_rim_lugs();
            all_body_bands();
            all_helical_ribs();
            rear_smooth_end();
        }

        all_perforation_cuts();
        decorative_rear_groove_cuts();
    }
}

// Lay the drum horizontally to match the reference image orientation.
rotate([0, 90, 0]) {
    color(preview_color)
        perforated_drum_basket();
}