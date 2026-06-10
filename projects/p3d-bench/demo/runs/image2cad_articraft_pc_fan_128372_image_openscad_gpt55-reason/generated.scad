// Parametric axial cooling fan model inspired by the reference image
// Units: millimeters

// -------------------------
// Global resolution/settings
// -------------------------
$fn = 96;
eps = 0.05;
min_rounding_r = 0.01;

// -------------------------
// Main frame dimensions
// -------------------------
fan_size = 80.0;                 // overall square frame size
overall_height = 25.0;           // structural height excluding raised surface details
corner_radius = 6.0;             // rounded outside corners

top_plate_thickness = 3.0;
bottom_plate_thickness = 3.0;

plate_opening_d = 64.0;          // circular opening in square flanges
shroud_outer_d = 70.0;           // cylindrical duct outside diameter
shroud_inner_d = 62.0;           // cylindrical duct inside diameter

// -------------------------
// Mounting holes / bosses
// -------------------------
hole_spacing = 68.0;             // center-to-center screw spacing
screw_hole_d = 4.3;
screw_boss_d = 11.5;

// -------------------------
// Frame webbing / connectors
// -------------------------
web_overlap = 0.25;
side_connector_width = 12.0;     // cardinal ribs from duct to square sides
diagonal_connector_width = 4.0;  // corner ribs from duct to screw bosses

// -------------------------
// Raised/recessed surface detail
// -------------------------
surface_feature_h = 0.45;
surface_line_w = 1.1;

outer_rail_inset = 1.8;
central_lip_w = 1.2;
washer_outer_d = 10.6;

groove_width = 1.0;
groove_depth = 0.35;

corner_groove_edge_short = 7.5;
corner_groove_edge_long = 24.0;
corner_groove_inner_clearance = 0.7;

// -------------------------
// Rotor / blade dimensions
// -------------------------
hub_d = 27.0;
hub_height = 8.8;
hub_chamfer = 1.0;
hub_bottom_z = 8.6;

bearing_post_d = 10.0;

blade_count = 9;
blade_tip_clearance = 1.5;
blade_root_overlap = 1.1;
blade_inner_r = hub_d / 2 - blade_root_overlap;
blade_outer_r = shroud_inner_d / 2 - blade_tip_clearance;

blade_center_z = 13.6;
blade_thickness = 1.6;
blade_twist = -12.0;
blade_twist_slices = 8;

blade_profile_steps = 14;
blade_curve_sweep = 38.0;
blade_camber = 6.0;
blade_width_inner = 22.0;
blade_width_outer = 15.0;

// -------------------------
// Hidden stator support spokes
// -------------------------
stator_spoke_z = 4.2;
stator_spoke_h = 1.4;
stator_spoke_w = 3.0;
stator_spoke_overlap = 1.0;

// -------------------------
// Derived values
// -------------------------
frame_half = fan_size / 2;
hole_offset = hole_spacing / 2;
top_plate_z = overall_height - top_plate_thickness;

shroud_outer_r = shroud_outer_d / 2;
shroud_inner_r = shroud_inner_d / 2;
corner_hole_radial = sqrt(2) * hole_offset;

frame_color = [0.62, 0.62, 0.65];
rotor_color = [0.46, 0.46, 0.48];


// -------------------------
// Utility functions
// -------------------------
function lerp(a, b, t) = a + (b - a) * t;
function polar(r, a) = [r * cos(a), r * sin(a)];

function blade_point(t, side) =
    let(
        r = lerp(blade_inner_r, blade_outer_r, t),
        center_angle = blade_curve_sweep * t + blade_camber * sin(180 * t),
        width_angle = lerp(blade_width_inner, blade_width_outer, t),
        a = center_angle + side * width_angle / 2
    )
    polar(r, a);


// -------------------------
// 2D helper geometry
// -------------------------
module rounded_square_2d(w, d, r) {
    if (r > 0) {
        offset(r = r)
            square([w - 2 * r, d - 2 * r], center = true);
    } else {
        square([w, d], center = true);
    }
}

module rounded_square_ring_2d(w, d, r, ring_w) {
    difference() {
        rounded_square_2d(w, d, r);
        rounded_square_2d(
            w - 2 * ring_w,
            d - 2 * ring_w,
            max(r - ring_w, min_rounding_r)
        );
    }
}

module circular_ring_2d(outer_d, inner_d) {
    difference() {
        circle(d = outer_d);
        circle(d = inner_d);
    }
}

module rounded_bar_2d(p1, p2, w) {
    hull() {
        translate(p1)
            circle(d = w);
        translate(p2)
            circle(d = w);
    }
}

module radial_rect_web_2d(start_r, end_r, w) {
    polygon(points = [
        [start_r, -w / 2],
        [end_r,   -w / 2],
        [end_r,    w / 2],
        [start_r,  w / 2]
    ]);
}


// -------------------------
// 3D helper geometry
// -------------------------
module tube(outer_d, inner_d, h, z0 = 0) {
    translate([0, 0, z0])
        difference() {
            cylinder(h = h, d = outer_d, center = false);
            translate([0, 0, -eps])
                cylinder(h = h + 2 * eps, d = inner_d, center = false);
        }
}

module chamfered_cylinder(d, h, ch) {
    r = d / 2;

    rotate_extrude(convexity = 4)
        polygon(points = [
            [0,      0],
            [r - ch, 0],
            [r,      ch],
            [r,      h - ch],
            [r - ch, h],
            [0,      h]
        ]);
}


// -------------------------
// Fan frame components
// -------------------------
module square_frame_plate(z0, t) {
    // Thin rounded-square flange with large circular center opening
    translate([0, 0, z0])
        linear_extrude(height = t, convexity = 8)
            difference() {
                rounded_square_2d(fan_size, fan_size, corner_radius);
                circle(d = plate_opening_d);
            }
}

module shroud_wall() {
    // Full-height cylindrical airflow duct
    tube(shroud_outer_d, shroud_inner_d, overall_height);
}

module corner_columns() {
    // Four vertical screw bosses matching the rounded corner lugs
    for (x = [-hole_offset, hole_offset]) {
        for (y = [-hole_offset, hole_offset]) {
            translate([x, y, 0])
                cylinder(h = overall_height, d = screw_boss_d, center = false);
        }
    }
}

module side_connectors() {
    // Four short vertical webs from cylindrical shroud to square side faces
    for (a = [0 : 90 : 270]) {
        rotate([0, 0, a])
            translate([shroud_outer_r - web_overlap, -side_connector_width / 2, 0])
                cube([
                    frame_half - shroud_outer_r + web_overlap,
                    side_connector_width,
                    overall_height
                ], center = false);
    }
}

module diagonal_connectors() {
    // Four diagonal corner webs tying the round duct to the screw-boss columns
    diag_start = shroud_outer_r - web_overlap;
    diag_end = corner_hole_radial - screw_boss_d / 2 + web_overlap;

    for (a = [45 : 90 : 315]) {
        rotate([0, 0, a])
            linear_extrude(height = overall_height, convexity = 4)
                radial_rect_web_2d(diag_start, diag_end, diagonal_connector_width);
    }
}

module surface_raised_features(z_surface) {
    // Raised perimeter rim, circular lip around the duct, and screw-hole pads
    translate([0, 0, z_surface - eps])
        linear_extrude(height = surface_feature_h + eps, convexity = 8)
            union() {
                rounded_square_ring_2d(
                    fan_size - 2 * outer_rail_inset,
                    fan_size - 2 * outer_rail_inset,
                    max(corner_radius - outer_rail_inset, min_rounding_r),
                    surface_line_w
                );

                circular_ring_2d(
                    shroud_inner_d + 2 * central_lip_w,
                    shroud_inner_d
                );

                for (x = [-hole_offset, hole_offset]) {
                    for (y = [-hole_offset, hole_offset]) {
                        translate([x, y])
                            circle(d = washer_outer_d);
                    }
                }
            }
}

module corner_triangle_grooves_2d(line_w) {
    // Triangular molded details at each screw-corner, approximated as engraved grooves
    for (sx = [-1, 1]) {
        for (sy = [-1, 1]) {
            p1 = [
                sx * (frame_half - corner_groove_edge_short),
                sy * (frame_half - corner_groove_edge_long)
            ];

            p2 = [
                sx * (frame_half - corner_groove_edge_long),
                sy * (frame_half - corner_groove_edge_short)
            ];

            p3 = [
                sx * (hole_offset - screw_boss_d / 2 - corner_groove_inner_clearance),
                sy * (hole_offset - screw_boss_d / 2 - corner_groove_inner_clearance)
            ];

            rounded_bar_2d(p1, p3, line_w);
            rounded_bar_2d(p3, p2, line_w);
            rounded_bar_2d(p2, p1, line_w);
        }
    }
}

module surface_groove_cut_at(z_surface) {
    // Shallow cutters for the triangular corner grooves
    translate([0, 0, z_surface - groove_depth])
        linear_extrude(
            height = groove_depth + surface_feature_h + 2 * eps,
            convexity = 8
        )
            corner_triangle_grooves_2d(groove_width);
}

module surface_groove_cutters() {
    surface_groove_cut_at(overall_height);
    surface_groove_cut_at(bottom_plate_thickness);
}

module fan_frame() {
    union() {
        square_frame_plate(0, bottom_plate_thickness);
        square_frame_plate(top_plate_z, top_plate_thickness);

        shroud_wall();

        corner_columns();
        side_connectors();
        diagonal_connectors();

        surface_raised_features(overall_height);
        surface_raised_features(bottom_plate_thickness);
    }
}


// -------------------------
// Rotor components
// -------------------------
module blade_profile_2d() {
    // Curved swept blade profile in plan view
    polygon(points = concat(
        [for (i = [0 : blade_profile_steps])
            blade_point(i / blade_profile_steps, -1)
        ],
        [for (i = [blade_profile_steps : -1 : 0])
            blade_point(i / blade_profile_steps, 1)
        ]
    ));
}

module one_blade() {
    // Thin blade with slight twist to suggest pitch
    linear_extrude(
        height = blade_thickness,
        center = true,
        twist = blade_twist,
        slices = blade_twist_slices,
        convexity = 6
    )
        blade_profile_2d();
}

module rotor_blades() {
    for (i = [0 : blade_count - 1]) {
        rotate([0, 0, i * 360 / blade_count])
            translate([0, 0, blade_center_z])
                one_blade();
    }
}

module stator_supports() {
    // Low support spokes hidden under the impeller so the STL is one connected solid
    translate([0, 0, stator_spoke_z])
        linear_extrude(height = stator_spoke_h, convexity = 5)
            union() {
                for (a = [0 : 90 : 270]) {
                    rotate(a)
                        rounded_bar_2d(
                            [bearing_post_d / 2 - stator_spoke_overlap, 0],
                            [shroud_inner_r + stator_spoke_overlap, 0],
                            stator_spoke_w
                        );
                }
            }
}

module rotor_hub() {
    // Central motor hub with chamfered top/bottom edges
    translate([0, 0, bottom_plate_thickness - eps])
        cylinder(
            h = hub_bottom_z - bottom_plate_thickness + 2 * eps,
            d = bearing_post_d,
            center = false
        );

    translate([0, 0, hub_bottom_z])
        chamfered_cylinder(hub_d, hub_height, hub_chamfer);
}

module rotor_assembly() {
    union() {
        stator_supports();
        rotor_blades();
        rotor_hub();
    }
}


// -------------------------
// Cutters
// -------------------------
module screw_hole_cutters() {
    for (x = [-hole_offset, hole_offset]) {
        for (y = [-hole_offset, hole_offset]) {
            translate([x, y, -eps])
                cylinder(
                    h = overall_height + surface_feature_h + 2 * eps,
                    d = screw_hole_d,
                    center = false
                );
        }
    }
}

module all_cutters() {
    screw_hole_cutters();
    surface_groove_cutters();
}


// -------------------------
// Final assembly
// -------------------------
module fan_model() {
    difference() {
        union() {
            color(frame_color)
                fan_frame();

            color(rotor_color)
                rotor_assembly();
        }

        all_cutters();
    }
}

fan_model();