// Reconstructed trophy assembly - all dimensions are in millimeters.

// -----------------------------
// Global resolution
// -----------------------------
$fn = 96;
eps = 0.05;

pedestal_revolve_fn = 128;
torus_revolve_fn = 128;
torus_tube_fn = 28;
strip_profile_fn = 24;
label_corner_fn = 20;
rounding_fn = 18;
bar_end_fn = 40;
crown_poly_convexity = 10;

// -----------------------------
// Pedestal body parameters
// -----------------------------
pedestal_height = 130.0;
pedestal_profile_samples = 8;

// Revolved outside profile knots: [radius, z]
pedestal_profile_knots = [
    [26.0, 0.0],
    [29.5, 2.0],
    [30.0, 6.0],
    [28.4, 13.0],
    [22.0, 21.0],
    [20.5, 24.0],
    [23.0, 29.0],
    [20.0, 35.0],
    [19.0, 43.0],
    [21.7, 84.0],
    [25.5, 93.0],
    [30.0, 101.0],
    [27.0, 108.0],
    [20.5, 113.0],
    [15.0, 123.0],
    [18.8, pedestal_height]
];

// Decorative molding beads: [z, torus_major_radius, torus_minor_radius]
pedestal_beads = [
    [5.5, 29.0, 0.8],
    [27.5, 22.4, 1.1],
    [96.2, 27.0, 1.0],
    [127.4, 17.9, 0.7]
];

// -----------------------------
// Embossed label parameters
// -----------------------------
emboss_label_x = 8.0;
emboss_label_y = -20.0;
emboss_label_z = 76.0;

emboss_label_pad_width = 31.0;
emboss_label_pad_height = 17.5;
emboss_label_pad_corner_radius = 2.0;
emboss_label_pad_depth = 0.75;

emboss_text_line1 = "Premier";
emboss_text_line2 = "League";
emboss_text_size = 6.8;
emboss_text_line_spacing = 6.8;
emboss_text_depth = 0.85;
emboss_text_angle_deg = -6;
emboss_text_spacing = 0.92;
emboss_text_font = "Liberation Sans:style=Bold";

// -----------------------------
// Crown ring and ball parameters
// -----------------------------
crown_teeth = 10;
crown_inner_radius = 36.88 / 2;
crown_outer_radius = 25.0;

crown_base_z = pedestal_height - 0.6;
crown_total_height = 24.0;
crown_base_band_height = 5.0;
crown_wall_bottom_z = crown_base_z + crown_base_band_height - 0.2;
crown_wall_height = crown_total_height - crown_base_band_height + 0.2;

crown_top_notch_depth = 11.5;
crown_bottom_zigzag_height = 6.5;
crown_tip_z = crown_wall_bottom_z + crown_wall_height;

bearing_ball_radius = 3.0;
bearing_ball_center_radius = crown_outer_radius;
bearing_ball_center_z = crown_tip_z + bearing_ball_radius * 0.78;

ball_post_diameter = 1.35;
ball_post_height = 3.0;

// -----------------------------
// Horizontal key / bar parameters
// -----------------------------
parallel_key_length = 120.0;
parallel_key_depth = 7.5;
parallel_key_height = 7.5;
parallel_key_end_radius = 3.75;
parallel_key_y = 0.0;
parallel_key_z = 128.0;

short_key_length = 101.0;
short_key_width = 7.5;
short_key_height = 7.0;
short_key_bow = 0.65;
short_key_segments = 7;
short_key_y = 3.4;
short_key_z = 107.5;

// -----------------------------
// Large swept handle parameters
// -----------------------------
curved_arm_thickness = 7.5;
curved_arm_width = 7.5;
curved_arm_y = 0.0;
curved_arm_path_samples = 9;
curved_arm_top_lobe_d = 10.0;
curved_arm_bottom_lobe_d = 8.0;

curved_arm_knots = [
    [55.0, 128.0],
    [52.0, 114.0],
    [56.0, 82.0],
    [48.0, 43.0],
    [34.0, 4.0]
];

curved_arm_head_x = 55.0;
curved_arm_head_z = 128.0;
curved_arm_head_size_x = 13.0;
curved_arm_head_size_y = 8.2;
curved_arm_head_size_z = 11.0;
curved_arm_head_corner_radius = 0.8;

// -----------------------------
// Thin decorative curved-strip parameters
// -----------------------------
decor_strip_thickness = 1.1;
decor_strip_samples = 9;

decor_inner_y = -4.2;
decor_inner_width = 5.0;
decor_inner_top_lobe_d = 10.5;
decor_inner_bottom_lobe_d = 8.0;

decor_outer_y = 4.2;
decor_outer_width = 4.3;
decor_outer_top_lobe_d = 8.5;
decor_outer_bottom_lobe_d = 6.2;

decor_inner_knots = [
    [24.0, 121.0],
    [18.0, 101.0],
    [20.0, 65.0],
    [27.0, 25.0],
    [33.0, -18.5]
];

decor_outer_knots = [
    [39.0, 119.0],
    [33.0, 94.0],
    [35.0, 60.0],
    [41.0, 22.0],
    [46.0, -10.0]
];

// -----------------------------
// Retaining clip parameters
// -----------------------------
clip_thickness = 2.0;
clip_y = -4.2;
clip_mount_x = 25.0;
clip_mount_z = 114.0;

clip_hook_outer_radius = 7.8;
clip_hook_inner_radius = 4.7;
clip_hook_center_spacing = 10.0;
clip_arc_start_angle = -135;
clip_arc_end_angle = 135;
clip_arc_segments = 36;

clip_web_x = 3.0;
clip_web_width = 3.2;
clip_web_height = 22.0;

clip_tab_x = -5.5;
clip_tab_z = 3.8;
clip_tab_length = 7.2;
clip_tab_width = 2.4;
clip_tab_angle_deg = 28;

// -----------------------------
// Helper functions
// -----------------------------
function cr_point(p0, p1, p2, p3, t) = [
    0.5 * (
        2 * p1[0] +
        (-p0[0] + p2[0]) * t +
        (2*p0[0] - 5*p1[0] + 4*p2[0] - p3[0]) * pow(t, 2) +
        (-p0[0] + 3*p1[0] - 3*p2[0] + p3[0]) * pow(t, 3)
    ),
    0.5 * (
        2 * p1[1] +
        (-p0[1] + p2[1]) * t +
        (2*p0[1] - 5*p1[1] + 4*p2[1] - p3[1]) * pow(t, 2) +
        (-p0[1] + 3*p1[1] - 3*p2[1] + p3[1]) * pow(t, 3)
    )
];

function catmull_rom_path(knots, samples) =
    [
        for (s = [0 : len(knots) - 2])
            for (j = [(s == 0 ? 0 : 1) : samples])
                let (
                    p0 = knots[max(s - 1, 0)],
                    p1 = knots[s],
                    p2 = knots[s + 1],
                    p3 = knots[min(s + 2, len(knots) - 1)],
                    t = j / samples
                )
                cr_point(p0, p1, p2, p3, t)
    ];

function mirrored_points_x(points, side) =
    [for (p = points) [side * p[0], p[1]]];

function curved_key_section(width, height, bow, segments) =
    concat(
        [[-width/2, -height/2], [width/2, -height/2]],
        [
            for (i = [0 : segments])
                let (yy = width/2 - width * i / segments)
                [yy, height/2 + bow * (1 - pow((2 * yy / width), 2))]
        ]
    );

// -----------------------------
// Generic reusable modules
// -----------------------------
module rounded_box(size, radius) {
    inner = [
        max(size[0] - 2*radius, eps),
        max(size[1] - 2*radius, eps),
        max(size[2] - 2*radius, eps)
    ];

    minkowski() {
        cube(inner, center=true);
        sphere(r=radius, $fn=rounding_fn);
    }
}

module rounded_rectangle_2d(w, h, r) {
    hull() {
        for (xx = [-w/2 + r, w/2 - r]) {
            for (yy = [-h/2 + r, h/2 - r]) {
                translate([xx, yy])
                    circle(r=r, $fn=label_corner_fn);
            }
        }
    }
}

module torus(major_radius, minor_radius) {
    rotate_extrude(convexity=6, $fn=torus_revolve_fn)
        translate([major_radius, 0])
            circle(r=minor_radius, $fn=torus_tube_fn);
}

module annular_cylinder(h, r_outer, r_inner) {
    difference() {
        cylinder(h=h, r=r_outer, center=false, $fn=pedestal_revolve_fn);
        translate([0, 0, -eps])
            cylinder(h=h + 2*eps, r=r_inner, center=false, $fn=pedestal_revolve_fn);
    }
}

module xz_profile_extrude(thickness, y_offset=0) {
    translate([0, y_offset, 0])
        rotate([90, 0, 0])
            linear_extrude(height=thickness, center=true, convexity=10)
                children();
}

module path_strip_2d(points, width) {
    union() {
        for (i = [0 : len(points) - 2]) {
            hull() {
                translate(points[i])
                    circle(d=width, $fn=strip_profile_fn);
                translate(points[i + 1])
                    circle(d=width, $fn=strip_profile_fn);
            }
        }
    }
}

module organic_strip_2d(knots, width, top_lobe_d, bottom_lobe_d, samples) {
    pts = catmull_rom_path(knots, samples);

    union() {
        path_strip_2d(pts, width);

        translate(knots[0])
            circle(d=top_lobe_d, $fn=strip_profile_fn);

        translate(knots[len(knots) - 1])
            circle(d=bottom_lobe_d, $fn=strip_profile_fn);
    }
}

module annular_arc_2d(r_outer, r_inner, a0, a1, segments) {
    polygon(
        points=concat(
            [
                for (i = [0 : segments])
                    [
                        r_outer * cos(a0 + (a1 - a0) * i / segments),
                        r_outer * sin(a0 + (a1 - a0) * i / segments)
                    ]
            ],
            [
                for (i = [segments : -1 : 0])
                    [
                        r_inner * cos(a0 + (a1 - a0) * i / segments),
                        r_inner * sin(a0 + (a1 - a0) * i / segments)
                    ]
            ]
        )
    );
}

// -----------------------------
// Pedestal with raised label
// -----------------------------
module embossed_label() {
    translate([emboss_label_x, emboss_label_y, emboss_label_z])
        rotate([90, 0, 0])
            union() {
                linear_extrude(height=emboss_label_pad_depth, center=false, convexity=4)
                    rounded_rectangle_2d(
                        emboss_label_pad_width,
                        emboss_label_pad_height,
                        emboss_label_pad_corner_radius
                    );

                translate([0, 0, emboss_label_pad_depth - eps])
                    linear_extrude(height=emboss_text_depth, center=false, convexity=6)
                        rotate(emboss_text_angle_deg) {
                            translate([0, emboss_text_line_spacing/2])
                                text(
                                    emboss_text_line1,
                                    size=emboss_text_size,
                                    font=emboss_text_font,
                                    halign="center",
                                    valign="center",
                                    spacing=emboss_text_spacing
                                );

                            translate([0, -emboss_text_line_spacing/2])
                                text(
                                    emboss_text_line2,
                                    size=emboss_text_size,
                                    font=emboss_text_font,
                                    halign="center",
                                    valign="center",
                                    spacing=emboss_text_spacing
                                );
                        }
            }
}

module pedestal_body() {
    union() {
        rotate_extrude(convexity=10, $fn=pedestal_revolve_fn)
            polygon(
                points=concat(
                    [[0, 0]],
                    catmull_rom_path(pedestal_profile_knots, pedestal_profile_samples),
                    [[0, pedestal_height]]
                )
            );

        // Rounded molding transitions on base, lower collar, shoulder, and top cap.
        for (bead = pedestal_beads) {
            translate([0, 0, bead[0]])
                torus(bead[1], bead[2]);
        }

        embossed_label();
    }
}

// -----------------------------
// Serrated crown ring
// -----------------------------
module serrated_crown_wall(teeth, r_outer, r_inner, z_base, height, top_depth, bottom_depth) {
    n = teeth * 2;
    tip_z = z_base + height;
    valley_z = tip_z - top_depth;

    points = concat(
        [
            for (i = [0 : n - 1])
                [
                    r_outer * cos(i * 360 / n),
                    r_outer * sin(i * 360 / n),
                    ((i % 2) == 0) ? z_base + bottom_depth : z_base
                ]
        ],
        [
            for (i = [0 : n - 1])
                [
                    r_outer * cos(i * 360 / n),
                    r_outer * sin(i * 360 / n),
                    ((i % 2) == 0) ? tip_z : valley_z
                ]
        ],
        [
            for (i = [0 : n - 1])
                [
                    r_inner * cos(i * 360 / n),
                    r_inner * sin(i * 360 / n),
                    ((i % 2) == 0) ? z_base + bottom_depth : z_base
                ]
        ],
        [
            for (i = [0 : n - 1])
                [
                    r_inner * cos(i * 360 / n),
                    r_inner * sin(i * 360 / n),
                    ((i % 2) == 0) ? tip_z : valley_z
                ]
        ]
    );

    faces = concat(
        // Outer cylindrical facets
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [i, j, n + j]],
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [i, n + j, n + i]],

        // Inner bore facets
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [2*n + i, 3*n + j, 2*n + j]],
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [2*n + i, 3*n + i, 3*n + j]],

        // Zigzag top annular facets
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [n + i, n + j, 3*n + j]],
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [n + i, 3*n + j, 3*n + i]],

        // Lower zigzag annular facets
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [i, 2*n + j, j]],
        [for (i = [0 : n - 1]) let (j = (i + 1) % n) [i, 2*n + i, 2*n + j]]
    );

    polyhedron(points=points, faces=faces, convexity=crown_poly_convexity);
}

module serrated_ring() {
    union() {
        translate([0, 0, crown_base_z])
            annular_cylinder(
                crown_base_band_height,
                crown_outer_radius,
                crown_inner_radius
            );

        serrated_crown_wall(
            crown_teeth,
            crown_outer_radius,
            crown_inner_radius,
            crown_wall_bottom_z,
            crown_wall_height,
            crown_top_notch_depth,
            crown_bottom_zigzag_height
        );
    }
}

module crown_balls() {
    for (i = [0 : crown_teeth - 1]) {
        rotate([0, 0, i * 360 / crown_teeth]) {
            translate([bearing_ball_center_radius, 0, crown_tip_z - eps])
                cylinder(h=ball_post_height, d=ball_post_diameter, center=false, $fn=24);

            translate([bearing_ball_center_radius, 0, bearing_ball_center_z])
                sphere(r=bearing_ball_radius, $fn=48);
        }
    }
}

// -----------------------------
// Bars and keys
// -----------------------------
module rounded_end_bar_x(length, depth, height, end_radius) {
    cap_r = min(end_radius, height / 2);

    xz_profile_extrude(depth, 0) {
        hull() {
            translate([-(length/2 - cap_r), 0])
                circle(r=cap_r, $fn=bar_end_fn);

            translate([(length/2 - cap_r), 0])
                circle(r=cap_r, $fn=bar_end_fn);
        }
    }
}

module curved_face_key_x(length, width, height, bow, segments) {
    section = curved_key_section(width, height, bow, segments);
    m = len(section);

    points = concat(
        [for (p = section) [-length/2, p[0], p[1]]],
        [for (p = section) [ length/2, p[0], p[1]]]
    );

    faces = concat(
        [[for (k = [m - 1 : -1 : 0]) k]],
        [[for (k = [0 : m - 1]) m + k]],
        [for (k = [0 : m - 1]) let (l = (k + 1) % m) [k, l, m + l, m + k]]
    );

    polyhedron(points=points, faces=faces, convexity=4);
}

module bridge_bars() {
    translate([0, parallel_key_y, parallel_key_z])
        rounded_end_bar_x(
            parallel_key_length,
            parallel_key_depth,
            parallel_key_height,
            parallel_key_end_radius
        );

    translate([0, short_key_y, short_key_z])
        curved_face_key_x(
            short_key_length,
            short_key_width,
            short_key_height,
            short_key_bow,
            short_key_segments
        );
}

// -----------------------------
// Curved arms, thin strips, and clips
// -----------------------------
module large_curved_arm(side=1) {
    xz_profile_extrude(curved_arm_thickness, curved_arm_y) {
        organic_strip_2d(
            mirrored_points_x(curved_arm_knots, side),
            curved_arm_width,
            curved_arm_top_lobe_d,
            curved_arm_bottom_lobe_d,
            curved_arm_path_samples
        );
    }

    translate([side * curved_arm_head_x, curved_arm_y, curved_arm_head_z])
        rounded_box(
            [curved_arm_head_size_x, curved_arm_head_size_y, curved_arm_head_size_z],
            curved_arm_head_corner_radius
        );
}

module decorative_strip(side, knots, y_offset, width, top_lobe_d, bottom_lobe_d) {
    xz_profile_extrude(decor_strip_thickness, y_offset) {
        organic_strip_2d(
            mirrored_points_x(knots, side),
            width,
            top_lobe_d,
            bottom_lobe_d,
            decor_strip_samples
        );
    }
}

module clip_profile_2d() {
    union() {
        translate([0, clip_hook_center_spacing / 2])
            annular_arc_2d(
                clip_hook_outer_radius,
                clip_hook_inner_radius,
                clip_arc_start_angle,
                clip_arc_end_angle,
                clip_arc_segments
            );

        translate([0, -clip_hook_center_spacing / 2])
            annular_arc_2d(
                clip_hook_outer_radius,
                clip_hook_inner_radius,
                clip_arc_start_angle,
                clip_arc_end_angle,
                clip_arc_segments
            );

        translate([clip_web_x, 0])
            square([clip_web_width, clip_web_height], center=true);

        translate([clip_tab_x, clip_tab_z])
            rotate(clip_tab_angle_deg)
                square([clip_tab_length, clip_tab_width], center=true);

        translate([clip_tab_x, -clip_tab_z])
            rotate(-clip_tab_angle_deg)
                square([clip_tab_length, clip_tab_width], center=true);
    }
}

module retaining_clip(side=1) {
    xz_profile_extrude(clip_thickness, clip_y) {
        translate([side * clip_mount_x, clip_mount_z])
            scale([side, 1])
                clip_profile_2d();
    }
}

module handle_and_trim_set() {
    for (side = [-1, 1]) {
        large_curved_arm(side);

        decorative_strip(
            side,
            decor_inner_knots,
            decor_inner_y,
            decor_inner_width,
            decor_inner_top_lobe_d,
            decor_inner_bottom_lobe_d
        );

        decorative_strip(
            side,
            decor_outer_knots,
            decor_outer_y,
            decor_outer_width,
            decor_outer_top_lobe_d,
            decor_outer_bottom_lobe_d
        );

        retaining_clip(side);
    }
}

// -----------------------------
// Unified assembly
// -----------------------------
module trophy_assembly() {
    union() {
        pedestal_body();
        serrated_ring();
        crown_balls();
        bridge_bars();
        handle_and_trim_set();
    }
}

trophy_assembly();