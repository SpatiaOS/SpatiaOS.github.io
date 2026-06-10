// Parametric grapple assembly reconstruction
// Dimensions are in millimeters.

$fn = 72;
eps = 0.03;

// -----------------------------------------------------------------------------
// Central end fitting
// -----------------------------------------------------------------------------
body_lower_radius = 13.5;
body_upper_radius = 9.39;
body_cap_radius = 13.5;

body_lower_height = 10.0;
body_taper_height = 8.0;
body_upper_height = 8.5;
body_cap_height = 2.6;

body_revolved_height = body_lower_height + body_taper_height + body_upper_height + body_cap_height;

eye_lug_width = 10.14;
eye_lug_thickness = 4.2;
eye_lug_height = 15.0;
eye_lug_overlap = 0.8;
eye_bore_diameter = 5.0;

// -----------------------------------------------------------------------------
// Hub mounting lugs
// -----------------------------------------------------------------------------
lug_attach_overlap = 0.8;

lower_lug_thickness = 1.47;
lower_lug_length = 12.0;
lower_lug_height = 7.48;
lower_lug_hole_diameter = 2.8;
lower_lug_z = 5.0;
lower_lug_attach_radius = body_lower_radius - lug_attach_overlap;
lower_lug_hole_radius = lower_lug_attach_radius + lower_lug_length - lower_lug_height / 2;
lower_lug_pair_y_offset = 2.85;

upper_lug_thickness = 1.47;
upper_lug_length = 10.0;
upper_lug_height = 5.70;
upper_lug_hole_diameter = 2.48;
upper_lug_attach_radius = body_upper_radius - lug_attach_overlap;
upper_lug_z = body_lower_height + body_taper_height + body_upper_height - 1.2;
upper_lug_hole_radius = upper_lug_attach_radius + upper_lug_length - upper_lug_height / 2;

upper_tab_thickness = 1.47;
upper_tab_length = 9.0;
upper_tab_height = 5.70;
upper_tab_hole_diameter = 1.28;
upper_tab_boss_diameter = 5.70;
upper_tab_attach_radius = body_upper_radius - lug_attach_overlap;
upper_tab_z = body_lower_height + body_taper_height + body_upper_height * 0.35;
upper_tab_hole_radius = upper_tab_attach_radius + upper_tab_length - upper_tab_height / 2;

// -----------------------------------------------------------------------------
// Jaw arms and support ribs
// -----------------------------------------------------------------------------
station_angles = [45, 135, 225, 315];

jaw_length = 73.6;
jaw_thickness = 4.0;
jaw_pivot_radius = lower_lug_hole_radius;
jaw_pivot_z = lower_lug_z;

jaw_pivot_outer_diameter = 10.8;
jaw_pin_hole_diameter = 3.6;

jaw_mid_x = 8.8;
jaw_mid_z = -30.0;
jaw_mid_tab_diameter_2d = 8.2;
jaw_mid_boss_diameter = 5.6;
jaw_mid_boss_length = 7.6;
jaw_mid_boss_y_offset = jaw_thickness / 2 + jaw_mid_boss_diameter * 0.35;

jaw_rib_width = 0.75;
jaw_rib_height = 0.70;
jaw_rib_embed = 0.18;
jaw_rib_path = [
    [1.2, -8.0],
    [4.8, -23.0],
    [6.4, -40.0],
    [4.6, -57.0],
    [1.8, -70.0]
];

support_widths = [3.2, 3.0, 2.7, 2.25, 1.55];
support_path = [
    [-2.6, -3.0],
    [-0.4, -18.5],
    [1.5, -38.0],
    [0.0, -58.5],
    [-2.4, -72.8]
];
support_thickness = 1.35;
support_lateral_offset = 6.2;
support_tab_size = [4.2, 1.7, 5.4];
support_tab_location = [0.4, -13.0];

support_tip_pin_radius = 1.0;
support_tip_pin_length = 11.0;

// -----------------------------------------------------------------------------
// Cylindrical barrels
// -----------------------------------------------------------------------------
barrel_outer_radius = 3.38;
barrel_wall = 0.70;
barrel_inner_radius = barrel_outer_radius - barrel_wall;
barrel_dome_solid_depth = 1.35;
barrel_end_ring_thickness = 0.9;
barrel_end_ring_extra_diameter = 0.7;
barrel_boss_diameter = 1.9;
barrel_boss_projection = 1.2;
barrel_retaining_hole_diameter = 0.864;
barrel_flat_cut_depth = 0.35;

barrel_tangent_offset = 2.7;
barrel_start_radius = upper_lug_hole_radius;
barrel_start_z = upper_lug_z;
barrel_end_radius = jaw_pivot_radius + 8.0;
barrel_end_z = jaw_pivot_z - 3.5;

// -----------------------------------------------------------------------------
// Follower rods
// -----------------------------------------------------------------------------
follower_head_radius = 2.53;
follower_head_thickness = 0.85;
follower_stem_radius = 0.54;
follower_boss_diameter = 3.2;
follower_boss_length = 5.0;
follower_boss_hole_diameter = 1.20;
follower_tangent_offset = 2.6;

follower_start_radius = upper_tab_hole_radius;
follower_start_z = upper_tab_z;

// -----------------------------------------------------------------------------
// Fasteners
// -----------------------------------------------------------------------------
pin_fn = 36;
pin_chamfer = 0.12;

stepped_pin_length = 8.4;
stepped_pin_shank_diameter = 2.7;
stepped_pin_shoulder_diameter = 3.1;
stepped_pin_head_diameter = 3.6;
stepped_pin_shoulder_length = 0.4;
stepped_pin_head_length = 0.4;
stepped_pin_shank_length = stepped_pin_length - stepped_pin_shoulder_length - stepped_pin_head_length;

flanged_pin_length = 8.4;
flanged_pin_shaft_diameter = 1.2;
flanged_pin_large_flange_diameter = 3.6;
flanged_pin_small_flange_diameter = 1.9;
flanged_pin_flange_thickness = 0.41;

spool_pin_length = 5.46;
spool_pin_shaft_diameter = 1.2;
spool_pin_large_flange_diameter = 3.6;
spool_pin_small_flange_diameter = 1.9;
spool_pin_flange_thickness = 0.41;

plain_pin_diameter = 1.076;
plain_pin_length = 1.084;

// -----------------------------------------------------------------------------
// Vector helper
// -----------------------------------------------------------------------------
module align_z_to_vector(p1, p2) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    L = norm(v);

    if (L > eps) {
        translate(p1)
            rotate(a = acos(v[2] / L), v = [-v[1], v[0], 0])
                children();
    }
}

// -----------------------------------------------------------------------------
// Reusable lug geometry
// -----------------------------------------------------------------------------
module lug_2d(len, h) {
    r = h / 2;

    union() {
        translate([(len - r) / 2, 0])
            square([len - r, h], center = true);

        translate([len - r, 0])
            circle(r = r);
    }
}

module radial_lug_plate(len, h, thickness, hole_d, boss_d = 0, boss_extra = 0.35) {
    hole_x = len - h / 2;

    difference() {
        union() {
            rotate([90, 0, 0])
                linear_extrude(height = thickness, center = true, convexity = 6)
                    lug_2d(len, h);

            if (boss_d > 0) {
                translate([hole_x, 0, 0])
                    rotate([90, 0, 0])
                        cylinder(h = thickness + boss_extra, d = boss_d, center = true);
            }
        }

        translate([hole_x, 0, 0])
            rotate([90, 0, 0])
                cylinder(h = thickness + boss_extra + 2, d = hole_d, center = true);
    }
}

// -----------------------------------------------------------------------------
// Central bell fitting with top eye
// -----------------------------------------------------------------------------
module bell_body() {
    rotate_extrude(convexity = 10)
        polygon(points = [
            [0, 0],
            [body_lower_radius, 0],
            [body_lower_radius, body_lower_height],
            [body_upper_radius, body_lower_height + body_taper_height],
            [body_upper_radius, body_lower_height + body_taper_height + body_upper_height],
            [body_cap_radius, body_lower_height + body_taper_height + body_upper_height],
            [body_cap_radius, body_revolved_height],
            [0, body_revolved_height]
        ]);
}

module top_eye_lug() {
    r = eye_lug_width / 2;
    straight_h = eye_lug_height - r;

    difference() {
        union() {
            translate([0, 0, straight_h / 2])
                cube([eye_lug_width, eye_lug_thickness, straight_h], center = true);

            translate([0, 0, straight_h])
                rotate([90, 0, 0])
                    cylinder(h = eye_lug_thickness, d = eye_lug_width, center = true);
        }

        translate([0, 0, straight_h])
            rotate([90, 0, 0])
                cylinder(h = eye_lug_thickness + 2, d = eye_bore_diameter, center = true);
    }
}

module end_fitting_with_eye() {
    union() {
        bell_body();

        translate([0, 0, body_revolved_height - eye_lug_overlap])
            top_eye_lug();
    }
}

// -----------------------------------------------------------------------------
// Jaw and curved support components
// -----------------------------------------------------------------------------
module jaw_2d_profile() {
    union() {
        circle(d = jaw_pivot_outer_diameter);

        polygon(points = [
            [-4.4, 1.5],
            [4.2, 1.5],
            [7.7, -8.0],
            [12.0, -23.0],
            [13.2, -39.0],
            [11.2, -56.0],
            [6.2, -70.5],
            [2.0, -jaw_length],
            [-1.0, -jaw_length + 1.5],
            [0.8, -58.0],
            [2.4, -42.0],
            [1.1, -24.0],
            [-2.8, -9.0]
        ]);

        translate([jaw_mid_x, jaw_mid_z])
            circle(d = jaw_mid_tab_diameter_2d);
    }
}

module jaw_plate_solid() {
    rotate([90, 0, 0])
        linear_extrude(height = jaw_thickness, center = true, convexity = 10)
            jaw_2d_profile();
}

module jaw_rib(y_sign, x_offset) {
    y_pos = y_sign * (jaw_thickness / 2 + jaw_rib_height / 2 - jaw_rib_embed);

    for (i = [0 : len(jaw_rib_path) - 2]) {
        hull() {
            translate([jaw_rib_path[i][0] + x_offset, y_pos, jaw_rib_path[i][1]])
                rotate([90, 0, 0])
                    cylinder(h = jaw_rib_height, d = jaw_rib_width, center = true);

            translate([jaw_rib_path[i + 1][0] + x_offset, y_pos, jaw_rib_path[i + 1][1]])
                rotate([90, 0, 0])
                    cylinder(h = jaw_rib_height, d = jaw_rib_width, center = true);
        }
    }
}

module gripper_jaw(side_sign = 1) {
    mid_y = side_sign * jaw_mid_boss_y_offset;

    difference() {
        union() {
            jaw_plate_solid();

            // Cylindrical reinforcement around upper pivot.
            rotate([90, 0, 0])
                cylinder(h = jaw_thickness + 1.6, d = jaw_pivot_outer_diameter + 0.8, center = true);

            // Orthogonal mid-body boss.
            translate([jaw_mid_x, mid_y, jaw_mid_z])
                rotate([0, 90, 0])
                    cylinder(h = jaw_mid_boss_length, d = jaw_mid_boss_diameter, center = true);

            for (face = [-1, 1]) {
                jaw_rib(face, -1.55);
                jaw_rib(face, 1.55);
            }
        }

        // Upper pivot bore.
        rotate([90, 0, 0])
            cylinder(h = jaw_thickness + 4, d = jaw_pin_hole_diameter, center = true);

        // Mid-body bore, perpendicular to the upper pivot bore.
        translate([jaw_mid_x, mid_y, jaw_mid_z])
            rotate([0, 90, 0])
                cylinder(h = jaw_mid_boss_length + 3, d = jaw_pin_hole_diameter, center = true);
    }
}

module support_node(pt, node_d) {
    translate([pt[0], 0, pt[1]])
        rotate([90, 0, 0])
            cylinder(h = support_thickness, d = node_d, center = true);
}

module curved_support_arm(has_tip_pin = false, side_sign = 1) {
    union() {
        for (i = [0 : len(support_path) - 2]) {
            hull() {
                support_node(support_path[i], support_widths[i]);
                support_node(support_path[i + 1], support_widths[i + 1]);
            }
        }

        // Small locating tab near the upper end.
        translate([support_tab_location[0], 0, support_tab_location[1]])
            cube(support_tab_size, center = true);

        // Pin-like protruding feature on two of the four curved arms.
        if (has_tip_pin) {
            pin_y = side_sign * (support_thickness / 2 + support_tip_pin_length / 2 - 0.25);
            cap_y = side_sign * (support_thickness / 2 + support_tip_pin_length - 0.25);

            translate([support_path[0][0], pin_y, support_path[0][1]])
                rotate([90, 0, 0])
                    cylinder(h = support_tip_pin_length, r = support_tip_pin_radius, center = true);

            translate([support_path[0][0], cap_y, support_path[0][1]])
                sphere(r = support_tip_pin_radius);
        }
    }
}

// -----------------------------------------------------------------------------
// Barrel and follower link components
// -----------------------------------------------------------------------------
module barrel_local(L) {
    difference() {
        union() {
            cylinder(h = L, r = barrel_outer_radius);

            // Domed closed end.
            sphere(r = barrel_outer_radius);

            // Slight collar at the open end.
            translate([0, 0, L - barrel_end_ring_thickness / 2])
                cylinder(
                    h = barrel_end_ring_thickness,
                    d = 2 * barrel_outer_radius + barrel_end_ring_extra_diameter,
                    center = true
                );

            // Retaining bosses on the barrel wall.
            for (zpos = [L * 0.36, L * 0.62]) {
                translate([0, 0, zpos])
                    rotate([0, 90, 0])
                        cylinder(
                            h = 2 * barrel_outer_radius + 2 * barrel_boss_projection,
                            d = barrel_boss_diameter,
                            center = true
                        );
            }
        }

        // Hollow bore, open at the non-domed end.
        translate([0, 0, barrel_dome_solid_depth])
            cylinder(h = L + 1, r = barrel_inner_radius);

        // Small transverse retaining holes.
        for (zpos = [L * 0.36, L * 0.62]) {
            translate([0, 0, zpos])
                rotate([0, 90, 0])
                    cylinder(
                        h = 2 * barrel_outer_radius + 2 * barrel_boss_projection + 2,
                        d = barrel_retaining_hole_diameter,
                        center = true
                    );
        }

        // Opposing longitudinal flats.
        translate([0, barrel_outer_radius - barrel_flat_cut_depth + 10, L / 2])
            cube([2 * barrel_outer_radius + 4, 20, L + 2], center = true);

        translate([0, -barrel_outer_radius + barrel_flat_cut_depth - 10, L / 2])
            cube([2 * barrel_outer_radius + 4, 20, L + 2], center = true);
    }
}

module barrel_between(p1, p2) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    L = norm(v);

    align_z_to_vector(p1, p2)
        barrel_local(L);
}

module barrel_link_local(side_sign = 1) {
    p1 = [barrel_start_radius, side_sign * barrel_tangent_offset, barrel_start_z];
    p2 = [barrel_end_radius, side_sign * barrel_tangent_offset, barrel_end_z];

    barrel_between(p1, p2);
}

module follower_head_and_stem(L) {
    union() {
        cylinder(h = follower_head_thickness, r = follower_head_radius, center = true);

        translate([0, 0, L / 2])
            cylinder(h = L, r = follower_stem_radius, center = true);
    }
}

module follower_rod_between(p1, p2) {
    v = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    L = norm(v);

    difference() {
        union() {
            align_z_to_vector(p1, p2)
                follower_head_and_stem(L);

            translate(p2)
                rotate([0, 90, 0])
                    cylinder(h = follower_boss_length, d = follower_boss_diameter, center = true);
        }

        translate(p2)
            rotate([0, 90, 0])
                cylinder(h = follower_boss_length + 2, d = follower_boss_hole_diameter, center = true);
    }
}

module follower_link_local(side_sign = 1) {
    p1 = [follower_start_radius, side_sign * follower_tangent_offset, follower_start_z];
    p2 = [
        jaw_pivot_radius + jaw_mid_x,
        side_sign * jaw_mid_boss_y_offset,
        jaw_pivot_z + jaw_mid_z
    ];

    follower_rod_between(p1, p2);
}

// -----------------------------------------------------------------------------
// Fastener modules
// -----------------------------------------------------------------------------
module stepped_pin() {
    z0 = -stepped_pin_length / 2;
    z1 = z0 + stepped_pin_shank_length;
    z2 = z1 + stepped_pin_shoulder_length;
    z3 = stepped_pin_length / 2;

    rotate_extrude(convexity = 4, $fn = pin_fn)
        polygon(points = [
            [0, z0],
            [stepped_pin_shank_diameter / 2, z0],
            [stepped_pin_shank_diameter / 2, z1 - pin_chamfer],
            [stepped_pin_shoulder_diameter / 2, z1],
            [stepped_pin_shoulder_diameter / 2, z2 - pin_chamfer],
            [stepped_pin_head_diameter / 2, z2],
            [stepped_pin_head_diameter / 2, z3],
            [0, z3]
        ]);
}

module flanged_pin() {
    z0 = -flanged_pin_length / 2;
    z1 = z0 + flanged_pin_flange_thickness;
    z2 = flanged_pin_length / 2 - flanged_pin_flange_thickness;
    z3 = flanged_pin_length / 2;

    rotate_extrude(convexity = 4, $fn = pin_fn)
        polygon(points = [
            [0, z0],
            [flanged_pin_large_flange_diameter / 2, z0],
            [flanged_pin_large_flange_diameter / 2, z1 - pin_chamfer],
            [flanged_pin_shaft_diameter / 2, z1],
            [flanged_pin_shaft_diameter / 2, z2],
            [flanged_pin_small_flange_diameter / 2, z2 + pin_chamfer],
            [flanged_pin_small_flange_diameter / 2, z3],
            [0, z3]
        ]);
}

module spool_pin() {
    z0 = -spool_pin_length / 2;
    z1 = z0 + spool_pin_flange_thickness;
    z2 = spool_pin_length / 2 - spool_pin_flange_thickness;
    z3 = spool_pin_length / 2;

    rotate_extrude(convexity = 4, $fn = pin_fn)
        polygon(points = [
            [0, z0],
            [spool_pin_large_flange_diameter / 2, z0],
            [spool_pin_large_flange_diameter / 2, z1 - pin_chamfer],
            [spool_pin_shaft_diameter / 2, z1],
            [spool_pin_shaft_diameter / 2, z2],
            [spool_pin_small_flange_diameter / 2, z2 + pin_chamfer],
            [spool_pin_small_flange_diameter / 2, z3],
            [0, z3]
        ]);
}

module plain_cylindrical_pin() {
    cylinder(h = plain_pin_length, d = plain_pin_diameter, center = true);
}

// -----------------------------------------------------------------------------
// Station-level repeated geometry
// -----------------------------------------------------------------------------
module lower_mounting_lug_pair_local() {
    for (yoff = [-lower_lug_pair_y_offset, lower_lug_pair_y_offset]) {
        translate([lower_lug_attach_radius, yoff, lower_lug_z])
            radial_lug_plate(
                lower_lug_length,
                lower_lug_height,
                lower_lug_thickness,
                lower_lug_hole_diameter
            );
    }
}

module upper_mounting_lugs_local(side_sign = 1) {
    translate([upper_lug_attach_radius, side_sign * barrel_tangent_offset, upper_lug_z])
        radial_lug_plate(
            upper_lug_length,
            upper_lug_height,
            upper_lug_thickness,
            upper_lug_hole_diameter
        );

    translate([upper_tab_attach_radius, side_sign * follower_tangent_offset, upper_tab_z])
        radial_lug_plate(
            upper_tab_length,
            upper_tab_height,
            upper_tab_thickness,
            upper_tab_hole_diameter,
            boss_d = upper_tab_boss_diameter
        );
}

module station_fasteners_local(side_sign = 1) {
    // Lower shoulder pin through clevis and jaw pivot.
    translate([jaw_pivot_radius, 0, jaw_pivot_z])
        rotate([90, 0, 0])
            stepped_pin();

    // Upper flanged pin near barrel/hub connection.
    translate([upper_lug_hole_radius, side_sign * barrel_tangent_offset, upper_lug_z])
        rotate([90, 0, 0])
            flanged_pin();

    // Short plain pin in small upper lug tab.
    translate([upper_tab_hole_radius, side_sign * follower_tangent_offset, upper_tab_z])
        rotate([90, 0, 0])
            plain_cylindrical_pin();

    // Mid-body spool pin through jaw boss.
    translate([
        jaw_pivot_radius + jaw_mid_x,
        side_sign * jaw_mid_boss_y_offset,
        jaw_pivot_z + jaw_mid_z
    ])
        rotate([0, 90, 0])
            spool_pin();
}

module station_assembly_local(side_sign = 1, support_has_tip_pin = false) {
    lower_mounting_lug_pair_local();
    upper_mounting_lugs_local(side_sign);

    translate([jaw_pivot_radius, 0, jaw_pivot_z])
        gripper_jaw(side_sign);

    translate([jaw_pivot_radius, side_sign * support_lateral_offset, jaw_pivot_z])
        curved_support_arm(has_tip_pin = support_has_tip_pin, side_sign = side_sign);

    barrel_link_local(side_sign);
    follower_link_local(side_sign);
    station_fasteners_local(side_sign);
}

// -----------------------------------------------------------------------------
// Main unified assembly
// -----------------------------------------------------------------------------
union() {
    end_fitting_with_eye();

    for (i = [0 : 3]) {
        rotate([0, 0, station_angles[i]])
            station_assembly_local(
                side_sign = (i % 2 == 0) ? 1 : -1,
                support_has_tip_pin = (i % 2 == 1)
            );
    }
}