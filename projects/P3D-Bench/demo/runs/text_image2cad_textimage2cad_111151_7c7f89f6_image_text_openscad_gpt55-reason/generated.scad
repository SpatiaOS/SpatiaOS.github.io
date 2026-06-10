// Stylised chair-like mechanical bracket assembly
// Units: millimeters

// -------------------------
// Global resolution
// -------------------------
$fn = 72;
eps = 0.05;

// -------------------------
// Overall envelope
// -------------------------
overall_width  = 110;
overall_depth  = 100;
overall_height = 300;

// -------------------------
// Seat / horizontal base
// -------------------------
seat_width      = 100;
seat_depth      = 100;
seat_thickness  = 12;
seat_z_bottom   = 100;
seat_z_top      = seat_z_bottom + seat_thickness;

seat_recess_depth = 2.2;
seat_recess_specs = [
    // [x, y, width, height, rotation]
    [-30, -26, 22, 16, 0],
    [  2,  18, 24, 18, 0],
    [ 29, -27, 22, 16, 0]
];

// -------------------------
// Tall rear plate
// -------------------------
back_width           = 72;
back_thickness       = 8;
back_panel_height    = overall_height - seat_z_bottom;
back_top_slope_drop  = 10;
back_bottom_z        = seat_z_bottom;
back_y_center        = overall_depth / 2 - back_thickness / 2;
back_front_y         = back_y_center - back_thickness / 2;

back_cutout_specs = [
    // [x, local_z, width, height, rotation]
    [-13, 76, 15, 20, -18],
    [ 12, 80, 14, 19,  22],
    [  0, 64, 10, 12,   0],
    [-16, 53, 13, 23,  25],
    [ 18, 54, 12, 18, -18],
    [  4, 90,  9, 16,  35]
];

// -------------------------
// Leaf-like raised spline decoration on rear plate
// -------------------------
leaf_rib_width    = 2.4;
leaf_rib_depth    = 2.0;
leaf_rib_overlap  = 0.35;
leaf_curve_steps  = 36;

leaf_left_start   = [-33, 16];
leaf_tip          = [-33, back_panel_height - 5];
leaf_right_end    = [ 12, 25];

// -------------------------
// Semicircular side arc features
// -------------------------
side_panel_radius        = seat_depth / 2;
side_panel_thickness     = 6;
side_panel_arc_steps     = 56;

side_panel_rib_depth     = 2.5;
side_panel_rib_overlap   = 0.35;
side_panel_rib_width     = 2.0;
side_panel_rib_margin    = 8;

side_panel_outer_face_x  = overall_width / 2 - side_panel_rib_depth + side_panel_rib_overlap;

side_inner_arc_radius    = 20;
side_small_arc_radius    = 10;
side_decor_diamond_w     = 15;
side_decor_diamond_h     = 18;
side_decor_diamond_y     = 19;
side_decor_diamond_z     = 31;
side_decor_diamond_rot   = 10;

// -------------------------
// Four waisted legs / column spacers
// -------------------------
leg_size             = 25;
leg_height           = 100;
leg_seat_overlap     = 1.0;
leg_model_height     = leg_height + leg_seat_overlap;
leg_spacing_x        = 68;
leg_spacing_y        = 62;

leg_waist_x          = 7.0;
leg_waist_y          = 6.0;
leg_corner_radius    = 2.0;
leg_chamfer_height   = 11;
leg_chamfer_inset    = 3.0;
leg_corner_segments  = 5;
leg_waist_sections   = 14;


// -------------------------
// Helper functions
// -------------------------
function arc2d(r, a0, a1, steps) =
    [for (i = [0 : steps])
        [
            r * cos(a0 + (a1 - a0) * i / steps),
            r * sin(a0 + (a1 - a0) * i / steps)
        ]
    ];

function bezier2(p0, p1, p2, p3, t) =
    [
        pow(1 - t, 3) * p0[0]
            + 3 * pow(1 - t, 2) * t * p1[0]
            + 3 * (1 - t) * pow(t, 2) * p2[0]
            + pow(t, 3) * p3[0],

        pow(1 - t, 3) * p0[1]
            + 3 * pow(1 - t, 2) * t * p1[1]
            + 3 * (1 - t) * pow(t, 2) * p2[1]
            + pow(t, 3) * p3[1]
    ];

function bezier2_points(p0, p1, p2, p3, steps) =
    [for (i = [0 : steps]) bezier2(p0, p1, p2, p3, i / steps)];

function rounded_rect_points(w, d, r, seg) =
    concat(
        [for (i = [0 : seg])
            let(a = -90 + 90 * i / seg)
            [ w / 2 - r + r * cos(a), -d / 2 + r + r * sin(a)]
        ],
        [for (i = [0 : seg])
            let(a = 0 + 90 * i / seg)
            [ w / 2 - r + r * cos(a),  d / 2 - r + r * sin(a)]
        ],
        [for (i = [0 : seg])
            let(a = 90 + 90 * i / seg)
            [-w / 2 + r + r * cos(a),  d / 2 - r + r * sin(a)]
        ],
        [for (i = [0 : seg])
            let(a = 180 + 90 * i / seg)
            [-w / 2 + r + r * cos(a), -d / 2 + r + r * sin(a)]
        ]
    );

function waist_size_at_z(z, h, size, reduction, chamfer_h, chamfer_inset) =
    (z <= chamfer_h)
        ? size - chamfer_inset * z / chamfer_h
        : (z >= h - chamfer_h)
            ? size - chamfer_inset * (h - z) / chamfer_h
            : size - chamfer_inset
                - (reduction - chamfer_inset)
                * sin(180 * (z - chamfer_h) / (h - 2 * chamfer_h));


// -------------------------
// Axis remapping extrusion helpers
// -------------------------
module extrude_y(height, center = true, convexity = 10) {
    multmatrix([
        [1, 0, 0, 0],
        [0, 0, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
    linear_extrude(height = height, center = center, convexity = convexity) {
        children();
    }
}

module extrude_x(height, center = true, convexity = 10) {
    multmatrix([
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
    linear_extrude(height = height, center = center, convexity = convexity) {
        children();
    }
}


// -------------------------
// 2D helper shapes
// -------------------------
module diamond_2d(w, h) {
    polygon(points = [
        [0, -h / 2],
        [w / 2, 0],
        [0, h / 2],
        [-w / 2, 0]
    ]);
}

module path2d(points, radius) {
    union() {
        for (i = [0 : len(points) - 2]) {
            hull() {
                translate([points[i][0], points[i][1]])
                    circle(r = radius);
                translate([points[i + 1][0], points[i + 1][1]])
                    circle(r = radius);
            }
        }
    }
}

module semicircle_profile_2d(r, steps) {
    polygon(points = arc2d(r, 0, 180, steps));
}

module back_plate_profile_2d() {
    polygon(points = [
        [-back_width / 2, 0],
        [ back_width / 2, 0],
        [ back_width / 2, back_panel_height - back_top_slope_drop],
        [-back_width / 2, back_panel_height]
    ]);
}


// -------------------------
// Seat and bracket components
// -------------------------
module seat_slab() {
    translate([-seat_width / 2, -seat_depth / 2, seat_z_bottom])
        cube([seat_width, seat_depth, seat_thickness], center = false);
}

module back_plate() {
    translate([0, back_y_center, back_bottom_z])
        extrude_y(back_thickness, center = true)
            back_plate_profile_2d();
}

module side_arc_panels() {
    for (sx = [-1, 1]) {
        translate([sx * (side_panel_outer_face_x - side_panel_thickness / 2), 0, seat_z_bottom])
            extrude_x(side_panel_thickness, center = true)
                semicircle_profile_2d(side_panel_radius, side_panel_arc_steps);
    }
}

module seat_recess_cutters() {
    for (c = seat_recess_specs) {
        translate([c[0], c[1], seat_z_top - seat_recess_depth])
            linear_extrude(height = seat_recess_depth + eps, center = false, convexity = 4)
                rotate(c[4])
                    diamond_2d(c[2], c[3]);
    }
}

module back_cutout_cutters() {
    for (c = back_cutout_specs) {
        translate([c[0], back_y_center, back_bottom_z + c[1]])
            extrude_y(back_thickness + 2 * eps, center = true)
                rotate(c[4])
                    diamond_2d(c[2], c[3]);
    }
}

module back_leaf_decor_2d() {
    path2d(
        bezier2_points(
            leaf_left_start,
            [-37, 76],
            [-39, 150],
            leaf_tip,
            leaf_curve_steps
        ),
        leaf_rib_width / 2
    );

    path2d(
        bezier2_points(
            leaf_tip,
            [ -5, 160],
            [ 42,  78],
            leaf_right_end,
            leaf_curve_steps
        ),
        leaf_rib_width / 2
    );

    path2d(
        bezier2_points(
            leaf_right_end,
            [  3, 15],
            [-19, 10],
            leaf_left_start,
            leaf_curve_steps / 2
        ),
        leaf_rib_width / 2
    );
}

module back_leaf_rib() {
    translate([
        0,
        back_front_y - leaf_rib_depth / 2 + leaf_rib_overlap,
        back_bottom_z
    ])
    extrude_y(leaf_rib_depth, center = true)
        back_leaf_decor_2d();
}

module side_panel_decor_2d() {
    path2d(
        arc2d(
            side_panel_radius - side_panel_rib_margin,
            10,
            170,
            side_panel_arc_steps
        ),
        side_panel_rib_width / 2
    );

    translate([12, 7])
        path2d(
            arc2d(side_inner_arc_radius, 20, 160, 32),
            side_panel_rib_width / 2
        );

    translate([23, 27])
        path2d(
            arc2d(side_small_arc_radius, 200, 340, 24),
            side_panel_rib_width / 2
        );

    translate([side_decor_diamond_y, side_decor_diamond_z])
        rotate(side_decor_diamond_rot)
            diamond_2d(side_decor_diamond_w, side_decor_diamond_h);
}

module side_panel_ribs() {
    for (sx = [-1, 1]) {
        translate([
            sx * (side_panel_outer_face_x + side_panel_rib_depth / 2 - side_panel_rib_overlap),
            0,
            seat_z_bottom + eps
        ])
        extrude_x(side_panel_rib_depth, center = true)
            side_panel_decor_2d();
    }
}

module decorative_bracket() {
    union() {
        difference() {
            union() {
                seat_slab();
                side_arc_panels();
                back_plate();
            }

            seat_recess_cutters();
            back_cutout_cutters();
        }

        back_leaf_rib();
        side_panel_ribs();
    }
}


// -------------------------
// Waisted column / spacer leg
// -------------------------
module waisted_column(
    w = leg_size,
    d = leg_size,
    h = leg_model_height,
    waist_x = leg_waist_x,
    waist_y = leg_waist_y,
    corner_r = leg_corner_radius,
    chamfer_h = leg_chamfer_height,
    chamfer_inset = leg_chamfer_inset,
    corner_segments = leg_corner_segments,
    waist_sections = leg_waist_sections
) {
    zvals = concat(
        [0, chamfer_h],
        [for (j = [1 : waist_sections - 1])
            chamfer_h + (h - 2 * chamfer_h) * j / waist_sections
        ],
        [h - chamfer_h, h]
    );

    section_count = len(rounded_rect_points(w, d, corner_r, corner_segments));

    pts = [
        for (j = [0 : len(zvals) - 1])
            for (p = rounded_rect_points(
                waist_size_at_z(zvals[j], h, w, waist_x, chamfer_h, chamfer_inset),
                waist_size_at_z(zvals[j], h, d, waist_y, chamfer_h, chamfer_inset),
                corner_r,
                corner_segments
            ))
                [p[0], p[1], zvals[j]]
    ];

    bottom_face = [for (i = [section_count - 1 : -1 : 0]) i];

    top_face = [
        for (i = [0 : section_count - 1])
            (len(zvals) - 1) * section_count + i
    ];

    side_faces = [
        for (j = [0 : len(zvals) - 2])
            for (i = [0 : section_count - 1])
                [
                    j * section_count + i,
                    j * section_count + (i + 1) % section_count,
                    (j + 1) * section_count + (i + 1) % section_count,
                    (j + 1) * section_count + i
                ]
    ];

    polyhedron(
        points = pts,
        faces = concat([bottom_face], side_faces, [top_face]),
        convexity = 10
    );
}

module legs() {
    for (x = [-leg_spacing_x / 2, leg_spacing_x / 2]) {
        for (y = [-leg_spacing_y / 2, leg_spacing_y / 2]) {
            translate([x, y, 0])
                rotate([0, 0, (x * y > 0) ? 0 : 90])
                    waisted_column();
        }
    }
}


// -------------------------
// Unified assembly
// -------------------------
module chair_assembly() {
    union() {
        decorative_bracket();
        legs();
    }
}

chair_assembly();