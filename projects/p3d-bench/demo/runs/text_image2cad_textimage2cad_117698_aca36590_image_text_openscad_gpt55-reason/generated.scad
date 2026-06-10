// Reconstructed warship figurine assembly
// Coordinate convention: X = ship length, Y = beam, Z = vertical.  Units are millimeters.

// -------------------------
// Global parameters
// -------------------------
$fn = 96;

join_overlap = 0.05;
ship_gray = [0.56, 0.57, 0.59, 1.0];

// Hull and deck
hull_length = 100.0;
hull_width = 20.0;
lower_hull_depth = 4.2;
deck_slab_height = 1.0;
deck_top_z = lower_hull_depth + deck_slab_height;

outline_segments = 96;
hull_layers = 9;
planform_exponent = 2.35;
keel_x_scale = 0.84;
keel_y_scale = 0.12;
hull_x_curve_power = 0.55;
hull_y_curve_power = 0.72;

// Turret bosses and gun pins
turret_radius = 5.0;
turret_height = 3.2;

pin_radius = 0.5;
pin_length = 10.0;
pin_y_spacing = 2.0;
pin_embed_depth = 2.5;
barrel_z_offset = turret_height * 0.72;

// [x, y, barrel direction along X]
turret_data = [
    [-37.5, 0.0, -1],
    [-19.0, 0.0, -1],
    [ 32.5, 0.0,  1]
];

// Rectangular stepped superstructure
super_lower_x = 4.0;
super_lower_y = 0.0;
super_lower_length = 31.0;
super_lower_width = 11.0;
super_lower_height = 3.0;

super_middle_x = 4.0;
super_middle_y = 0.0;
super_middle_length = 23.0;
super_middle_width = 8.2;
super_middle_height = 2.2;

super_side_strip_x = 5.5;
super_side_strip_y_offset = 4.8;
super_side_strip_length = 27.0;
super_side_strip_width = 1.4;
super_side_strip_height = 1.2;

bridge_tower_x = -3.5;
bridge_tower_y = 0.0;
bridge_tower_length = 8.5;
bridge_tower_width = 7.0;
bridge_tower_height = 4.0;

bridge_roof_x = bridge_tower_x;
bridge_roof_y = bridge_tower_y;
bridge_roof_length = 6.5;
bridge_roof_width = 5.6;
bridge_roof_height = 1.2;

chimney_base_x = 5.5;
chimney_base_y = 0.0;
chimney_base_length = 9.5;
chimney_base_width = 6.5;
chimney_base_height = 1.1;

chimney_x = chimney_base_x;
chimney_y = chimney_base_y;
chimney_radius = 2.5;
chimney_height = 9.7;

upper_side_block_x = 6.0;
upper_side_block_y_offset = 3.4;
upper_side_block_length = 8.0;
upper_side_block_width = 1.2;
upper_side_block_height = 1.4;

super_middle_bottom_z = deck_top_z + super_lower_height;
super_upper_bottom_z = super_middle_bottom_z + super_middle_height;
bridge_roof_bottom_z = super_upper_bottom_z + bridge_tower_height;
chimney_base_bottom_z = super_upper_bottom_z;
chimney_bottom_z = chimney_base_bottom_z + chimney_base_height;

// Partial cylindrical spacer / cowl
spacer_length = 9.7;
spacer_width = 6.2;
spacer_height = 2.1;
spacer_end_tilt_angle = 10.0;
spacer_arc_segments = 36;
spacer_clip_extra = 4.0;
spacer_mask_margin = 4.0;

spacer_x = 17.0;
spacer_y = -7.0;
spacer_z = deck_top_z;
spacer_yaw_angle = 0.0;


// -------------------------
// Helper functions
// -------------------------
function signed_power(v, e) = (v < 0) ? -pow(-v, e) : pow(v, e);

function superellipse_point(a, b, n, angle_deg) =
    [
        a * signed_power(cos(angle_deg), 2 / n),
        b * signed_power(sin(angle_deg), 2 / n)
    ];

function superellipse_points(a, b, n, seg) =
    [
        for (i = [0 : seg - 1])
            superellipse_point(a, b, n, 360 * i / seg)
    ];

function circular_segment_radius(w, h) =
    (h * h + (w / 2) * (w / 2)) / (2 * h);


// -------------------------
// Hull modules
// -------------------------
module ship_planform_2d(length, width, exponent, seg) {
    polygon(points = superellipse_points(length / 2, width / 2, exponent, seg));
}

module lower_hull(length, width, depth, exponent, seg, layers) {
    points = [
        for (k = [0 : layers - 1])
            let (
                t = k / (layers - 1),
                xs = keel_x_scale + (1 - keel_x_scale) * pow(t, hull_x_curve_power),
                ys = keel_y_scale + (1 - keel_y_scale) * pow(t, hull_y_curve_power)
            )
            for (i = [0 : seg - 1])
                let (p = superellipse_point(length / 2, width / 2, exponent, 360 * i / seg))
                    [p[0] * xs, p[1] * ys, depth * t]
    ];

    bottom_face = [[for (i = [seg - 1 : -1 : 0]) i]];
    top_face = [[for (i = [0 : seg - 1]) (layers - 1) * seg + i]];

    side_faces_a = [
        for (k = [0 : layers - 2], i = [0 : seg - 1])
            [
                k * seg + i,
                k * seg + ((i + 1) % seg),
                (k + 1) * seg + ((i + 1) % seg)
            ]
    ];

    side_faces_b = [
        for (k = [0 : layers - 2], i = [0 : seg - 1])
            [
                k * seg + i,
                (k + 1) * seg + ((i + 1) % seg),
                (k + 1) * seg + i
            ]
    ];

    polyhedron(
        points = points,
        faces = concat(bottom_face, side_faces_a, side_faces_b, top_face),
        convexity = 10
    );
}

module deck_slab() {
    translate([0, 0, lower_hull_depth - join_overlap])
        linear_extrude(height = deck_slab_height + join_overlap, convexity = 10)
            ship_planform_2d(hull_length, hull_width, planform_exponent, outline_segments);
}

module ship_hull() {
    union() {
        lower_hull(
            hull_length,
            hull_width,
            lower_hull_depth,
            planform_exponent,
            outline_segments,
            hull_layers
        );

        deck_slab();
    }
}


// -------------------------
// Deck feature modules
// -------------------------
module deck_box(cx, cy, bottom_z, sx, sy, sz) {
    translate([cx - sx / 2, cy - sy / 2, bottom_z - join_overlap])
        cube([sx, sy, sz + join_overlap], center = false);
}

module vertical_cylinder(cx, cy, bottom_z, radius, height) {
    translate([cx, cy, bottom_z - join_overlap])
        cylinder(h = height + join_overlap, r = radius, center = false);
}

module turret_boss(cx, cy) {
    vertical_cylinder(cx, cy, deck_top_z, turret_radius, turret_height);
}

module pin_barrel() {
    rotate([0, 90, 0])
        cylinder(h = pin_length, r = pin_radius, center = true);
}

module gun_cluster(cx, cy, direction) {
    for (dy = [-pin_y_spacing, 0, pin_y_spacing]) {
        translate([
            cx + direction * (turret_radius - pin_embed_depth + pin_length / 2),
            cy + dy,
            deck_top_z + barrel_z_offset
        ])
            pin_barrel();
    }
}

module central_superstructure() {
    // Broad base tier
    deck_box(
        super_lower_x,
        super_lower_y,
        deck_top_z,
        super_lower_length,
        super_lower_width,
        super_lower_height
    );

    // Reduced upper tier
    deck_box(
        super_middle_x,
        super_middle_y,
        super_middle_bottom_z,
        super_middle_length,
        super_middle_width,
        super_middle_height
    );

    // Long narrow side steps on the base tier
    for (side = [-1, 1]) {
        deck_box(
            super_side_strip_x,
            side * super_side_strip_y_offset,
            super_middle_bottom_z,
            super_side_strip_length,
            super_side_strip_width,
            super_side_strip_height
        );
    }

    // Forward bridge block and roof
    deck_box(
        bridge_tower_x,
        bridge_tower_y,
        super_upper_bottom_z,
        bridge_tower_length,
        bridge_tower_width,
        bridge_tower_height
    );

    deck_box(
        bridge_roof_x,
        bridge_roof_y,
        bridge_roof_bottom_z,
        bridge_roof_length,
        bridge_roof_width,
        bridge_roof_height
    );

    // Aft chimney base and raised side blocks
    deck_box(
        chimney_base_x,
        chimney_base_y,
        chimney_base_bottom_z,
        chimney_base_length,
        chimney_base_width,
        chimney_base_height
    );

    for (side = [-1, 1]) {
        deck_box(
            upper_side_block_x,
            side * upper_side_block_y_offset,
            super_upper_bottom_z,
            upper_side_block_length,
            upper_side_block_width,
            upper_side_block_height
        );
    }

    vertical_cylinder(
        chimney_x,
        chimney_y,
        chimney_bottom_z,
        chimney_radius,
        chimney_height
    );
}


// -------------------------
// Spacer / partial-cylinder cowl
// -------------------------
module circular_segment_2d(width, height, arc_segments) {
    r = circular_segment_radius(width, height);
    cy = height - r;

    polygon(points = concat(
        [[-width / 2, 0], [width / 2, 0]],
        [
            for (i = [1 : arc_segments - 1])
                let (x = width / 2 - width * i / arc_segments)
                    [x, cy + sqrt(max(0, r * r - x * x))]
        ]
    ));
}

module straight_spacer_segment(length, width, height, arc_segments) {
    // Remap extruded Z axis to X so the spacer runs fore-aft.
    multmatrix([
        [0, 0, 1, 0],
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 1]
    ])
        linear_extrude(height = length, center = true, convexity = 4)
            circular_segment_2d(width, height, arc_segments);
}

module spacer_segment(length, width, height, end_tilt_angle, arc_segments) {
    intersection() {
        straight_spacer_segment(length + spacer_clip_extra, width, height, arc_segments);

        // Sheared clipping box creates the shallow oblique end caps.
        multmatrix([
            [1, 0, tan(end_tilt_angle), -tan(end_tilt_angle) * height / 2],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
            translate([0, 0, height / 2])
                cube(
                    [
                        length,
                        width + spacer_mask_margin,
                        height + spacer_mask_margin
                    ],
                    center = true
                );
    }
}

module deck_spacer() {
    translate([spacer_x, spacer_y, spacer_z - join_overlap])
        rotate([0, 0, spacer_yaw_angle])
            spacer_segment(
                spacer_length,
                spacer_width,
                spacer_height,
                spacer_end_tilt_angle,
                spacer_arc_segments
            );
}


// -------------------------
// Main unified model
// -------------------------
module warship_model() {
    union() {
        ship_hull();

        central_superstructure();
        deck_spacer();

        for (turret = turret_data) {
            turret_boss(turret[0], turret[1]);
            gun_cluster(turret[0], turret[1], turret[2]);
        }
    }
}

color(ship_gray)
    warship_model();