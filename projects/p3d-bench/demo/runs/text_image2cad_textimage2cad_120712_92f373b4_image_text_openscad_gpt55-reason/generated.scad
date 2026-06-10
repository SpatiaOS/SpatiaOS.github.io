// Parametric reconstruction of a low-profile pebble-shaped enclosure assembly
// Units: millimeters

// ---------- Global resolution ----------
$fn = 96;
surface_segments = 128;
base_loft_layers = 28;
housing_loft_layers = 34;
plate_loft_layers = 10;
eps = 0.05;

// ---------- Overall geometry dimensions ----------
base_length = 303.9;
base_width = 159.5;
base_height = 72.0;
base_top_length = 241.82;
base_top_width = 126.86;
base_shape_exponent = 2.18;
base_profile_power = 1.00;
base_profile_mode = 0;          // 0 = smooth cosine taper

cover_plate_length = 241.82;
cover_plate_width = 126.86;
cover_plate_thickness = 6.0;
cover_plate_edge_radius = 0.8;
cover_plate_shape_exponent = 2.12;
cover_plate_z = base_height - 1.0;

housing_length = 227.4;
housing_width = 119.7;
housing_height = 50.0;
housing_top_length = 108.0;
housing_top_width = 58.0;
housing_shape_exponent = 2.08;
housing_profile_power = 1.62;
housing_profile_mode = 1;       // 1 = ellipsoidal crown taper
housing_plate_overlap = 1.0;
housing_z = cover_plate_z + cover_plate_thickness - housing_plate_overlap;

// ---------- Seam and decorative line dimensions ----------
seam_line_height = 0.28;
seam_line_embed = 0.03;

outer_seam_ring_length = cover_plate_length - 2 * cover_plate_edge_radius - 0.6;
outer_seam_ring_width = cover_plate_width - 2 * cover_plate_edge_radius - 0.6;
outer_seam_ring_band = 0.85;

inner_seam_ring_length = housing_length + 4.0;
inner_seam_ring_width = housing_width + 3.2;
inner_seam_ring_band = 0.85;

bottom_outline_ring_length = base_length - 1.4;
bottom_outline_ring_width = base_width - 1.4;
bottom_outline_ring_band = 0.75;
bottom_outline_ring_height = 0.22;

// ---------- Top control panel ----------
control_panel_offset_x = -9.0;
control_panel_offset_y = 0.0;
control_panel_length = 84.0;
control_panel_width = 46.0;
control_panel_shape_exponent = 2.05;
control_panel_recess_depth = 1.35;
control_panel_floor_clearance = 1.2;
control_panel_floor_thickness = 0.35;

control_panel_rim_outer_length = 91.0;
control_panel_rim_outer_width = 52.0;
control_panel_rim_band = 1.55;
control_panel_rim_height = 0.55;

control_panel_inner_line_length = control_panel_length - 3.8;
control_panel_inner_line_width = control_panel_width - 3.8;
control_panel_inner_line_band = 0.45;
control_panel_inner_line_height = 0.20;

// ---------- Dot and icon relief details ----------
dot_diameter = 2.0;
dot_height = 0.32;
dot_segments = 32;
dot_positions = [
    [-30.0,  10.5],
    [-20.0,  15.0],
    [-10.0,  17.5],
    [  1.0,  16.0],
    [ 12.0,  11.5]
];

icon_height = 0.34;
icon_embed = 0.03;

minus_icon_pos = [-31.0, -14.0];
power_icon_pos = [-11.0, -15.0];
play_icon_pos  = [ -4.0,   0.5];
plus_icon_pos  = [ 17.0,  -4.0];
x_icon_pos     = [ 28.0,  15.0];

minus_icon_length = 10.0;
minus_icon_thickness = 1.25;

plus_icon_size = 8.2;
plus_icon_thickness = 1.15;

x_icon_size = 8.4;
x_icon_thickness = 1.10;

power_icon_diameter = 7.6;
power_icon_ring_thickness = 0.9;

play_icon_size = 8.0;
play_icon_bar_width = 0.95;

// ---------- Side logo ----------
logo_text = "harman/kardon";
logo_font = "Liberation Sans:style=Bold";
logo_size = 6.0;
logo_depth = 0.55;
logo_x = 43.0;
logo_y = -42.0;
logo_z_relative = 24.0;
logo_tilt_x = 56.0;
logo_rotate_z = 0.0;

// ---------- Colors for preview ----------
body_color = [0.72, 0.74, 0.77, 1.0];
plate_color = [0.58, 0.60, 0.63, 1.0];
panel_color = [0.64, 0.65, 0.68, 1.0];
dark_detail_color = [0.03, 0.03, 0.035, 1.0];


// ---------- Helper functions ----------
function clamp01(t) = min(1, max(0, t));

function loft_profile(t, power, mode) =
    mode == 1
        ? 1 - sqrt(max(0, 1 - pow(clamp01(t), power)))
        : 0.5 - 0.5 * cos(180 * pow(clamp01(t), power));

function se_x(rx, exponent, a) =
    rx * sign(cos(a)) * pow(abs(cos(a)), 2 / exponent);

function se_y(ry, exponent, a) =
    ry * sign(sin(a)) * pow(abs(sin(a)), 2 / exponent);

function ring_index(layer, i, n) = layer * n + (i % n);

function loft_points(
    bottom_l,
    bottom_w,
    top_l,
    top_w,
    height,
    n,
    layers,
    exponent,
    profile_power,
    profile_mode
) =
    [
        for (k = [0 : layers])
            let (
                t = k / layers,
                f = loft_profile(t, profile_power, profile_mode),
                rx = bottom_l / 2 * (1 - f) + top_l / 2 * f,
                ry = bottom_w / 2 * (1 - f) + top_w / 2 * f
            )
            for (i = [0 : n - 1])
                let (a = 360 * i / n)
                    [se_x(rx, exponent, a), se_y(ry, exponent, a), height * t]
    ];

function lens_plate_points(length, width, height, edge_r, n, layers, exponent) =
    [
        for (k = [0 : layers])
            let (
                t = k / layers,
                edge_bulge = edge_r * sin(180 * t),
                rx = length / 2 - edge_r + edge_bulge,
                ry = width / 2 - edge_r + edge_bulge
            )
            for (i = [0 : n - 1])
                let (a = 360 * i / n)
                    [se_x(rx, exponent, a), se_y(ry, exponent, a), height * t]
    ];

function loft_faces(n, layers) =
    concat(
        [[for (i = [n - 1 : -1 : 0]) ring_index(0, i, n)]],
        [[for (i = [0 : n - 1]) ring_index(layers, i, n)]],
        [
            for (k = [0 : layers - 1])
                for (i = [0 : n - 1])
                    [
                        ring_index(k, i, n),
                        ring_index(k, (i + 1) % n, n),
                        ring_index(k + 1, (i + 1) % n, n)
                    ]
        ],
        [
            for (k = [0 : layers - 1])
                for (i = [0 : n - 1])
                    [
                        ring_index(k, i, n),
                        ring_index(k + 1, (i + 1) % n, n),
                        ring_index(k + 1, i, n)
                    ]
        ]
    );


// ---------- 2D oval helpers ----------
module superellipse_2d(length, width, exponent = 2.0, segments = surface_segments) {
    polygon(points = [
        for (i = [0 : segments - 1])
            let (
                a = 360 * i / segments,
                rx = length / 2,
                ry = width / 2
            )
                [se_x(rx, exponent, a), se_y(ry, exponent, a)]
    ]);
}

module oval_disc(length, width, height, exponent = 2.0, segments = surface_segments, center = false) {
    linear_extrude(height = height, center = center, convexity = 6)
        superellipse_2d(length, width, exponent, segments);
}

module oval_ring(length, width, band, height, exponent = 2.0, segments = surface_segments, center = false) {
    linear_extrude(height = height, center = center, convexity = 8)
        difference() {
            superellipse_2d(length, width, exponent, segments);
            superellipse_2d(length - 2 * band, width - 2 * band, exponent, segments);
        }
}


// ---------- Reusable 3D body helpers ----------
module oval_loft(
    bottom_l,
    bottom_w,
    top_l,
    top_w,
    height,
    exponent = 2.0,
    profile_power = 1.0,
    profile_mode = 0,
    segments = surface_segments,
    layers = 24
) {
    polyhedron(
        points = loft_points(
            bottom_l,
            bottom_w,
            top_l,
            top_w,
            height,
            segments,
            layers,
            exponent,
            profile_power,
            profile_mode
        ),
        faces = loft_faces(segments, layers),
        convexity = 12
    );
}

module rounded_oval_plate(
    length,
    width,
    height,
    edge_r,
    exponent = 2.0,
    segments = surface_segments,
    layers = 8
) {
    polyhedron(
        points = lens_plate_points(length, width, height, edge_r, segments, layers, exponent),
        faces = loft_faces(segments, layers),
        convexity = 8
    );
}


// ---------- Main shell parts ----------
module base_cover() {
    // Lower pebble body tapering from the large footprint to the seam deck.
    oval_loft(
        base_length,
        base_width,
        base_top_length,
        base_top_width,
        base_height,
        base_shape_exponent,
        base_profile_power,
        base_profile_mode,
        surface_segments,
        base_loft_layers
    );
}

module cover_plate() {
    // Thin oval disc visible as the circumferential parting element.
    rounded_oval_plate(
        cover_plate_length,
        cover_plate_width,
        cover_plate_thickness,
        cover_plate_edge_radius,
        cover_plate_shape_exponent,
        surface_segments,
        plate_loft_layers
    );
}

module housing_cover_body() {
    // Upper freeform dome with a shallow oval recessed top panel.
    difference() {
        oval_loft(
            housing_length,
            housing_width,
            housing_top_length,
            housing_top_width,
            housing_height,
            housing_shape_exponent,
            housing_profile_power,
            housing_profile_mode,
            surface_segments,
            housing_loft_layers
        );

        translate([
            control_panel_offset_x,
            control_panel_offset_y,
            housing_height - control_panel_recess_depth
        ])
            oval_disc(
                control_panel_length,
                control_panel_width,
                control_panel_recess_depth + 2 * eps,
                control_panel_shape_exponent,
                surface_segments
            );
    }
}


// ---------- Relief icon helpers ----------
module relief_bar(length, width, height) {
    linear_extrude(height = height, convexity = 2)
        square([length, width], center = true);
}

module symbol_minus(length, thickness, height) {
    relief_bar(length, thickness, height);
}

module symbol_plus(size, thickness, height) {
    union() {
        relief_bar(size, thickness, height);
        relief_bar(thickness, size, height);
    }
}

module symbol_x(size, thickness, height) {
    union() {
        rotate([0, 0, 45])
            relief_bar(size, thickness, height);
        rotate([0, 0, -45])
            relief_bar(size, thickness, height);
    }
}

module symbol_power(diameter, ring_thickness, height) {
    linear_extrude(height = height, convexity = 4)
        union() {
            difference() {
                circle(d = diameter, $fn = 48);
                circle(d = diameter - 2 * ring_thickness, $fn = 48);
                translate([0, diameter * 0.28])
                    square([ring_thickness * 2.0, diameter * 0.62], center = true);
            }
            translate([0, diameter * 0.20])
                square([ring_thickness, diameter * 0.62], center = true);
        }
}

module symbol_play_pause(size, bar_width, height) {
    linear_extrude(height = height, convexity = 3)
        union() {
            polygon(points = [
                [-size * 0.48, -size * 0.42],
                [-size * 0.48,  size * 0.42],
                [ size * 0.02,  0]
            ]);
            translate([size * 0.25, 0])
                square([bar_width, size * 0.82], center = true);
            translate([size * 0.43, 0])
                square([bar_width, size * 0.82], center = true);
        }
}

module raised_text_label(txt, size, depth, font_name) {
    linear_extrude(height = depth, convexity = 8)
        text(
            t = txt,
            size = size,
            font = font_name,
            halign = "center",
            valign = "center",
            spacing = 0.92
        );
}


// ---------- Assembly details ----------
module seam_details() {
    // Dark preview rings emphasize the visible parting line and thin disc edge.
    color(dark_detail_color) {
        translate([0, 0, cover_plate_z + cover_plate_thickness - seam_line_embed])
            oval_ring(
                outer_seam_ring_length,
                outer_seam_ring_width,
                outer_seam_ring_band,
                seam_line_height,
                cover_plate_shape_exponent
            );

        translate([0, 0, cover_plate_z + cover_plate_thickness - seam_line_embed])
            oval_ring(
                inner_seam_ring_length,
                inner_seam_ring_width,
                inner_seam_ring_band,
                seam_line_height,
                housing_shape_exponent
            );

        translate([0, 0, eps])
            oval_ring(
                bottom_outline_ring_length,
                bottom_outline_ring_width,
                bottom_outline_ring_band,
                bottom_outline_ring_height,
                base_shape_exponent
            );
    }
}

module control_panel_details() {
    panel_floor_z = housing_z + housing_height - control_panel_recess_depth + eps;
    panel_top_z = housing_z + housing_height;
    symbol_z = panel_floor_z + control_panel_floor_thickness - icon_embed;

    // Recess floor.
    color(panel_color)
        translate([
            control_panel_offset_x,
            control_panel_offset_y,
            panel_floor_z
        ])
            oval_disc(
                control_panel_length - 2 * control_panel_floor_clearance,
                control_panel_width - 2 * control_panel_floor_clearance,
                control_panel_floor_thickness,
                control_panel_shape_exponent,
                surface_segments
            );

    // Raised oval rim and fine inner outline.
    color(dark_detail_color) {
        translate([
            control_panel_offset_x,
            control_panel_offset_y,
            panel_top_z - seam_line_embed
        ])
            oval_ring(
                control_panel_rim_outer_length,
                control_panel_rim_outer_width,
                control_panel_rim_band,
                control_panel_rim_height,
                control_panel_shape_exponent
            );

        translate([
            control_panel_offset_x,
            control_panel_offset_y,
            symbol_z
        ])
            oval_ring(
                control_panel_inner_line_length,
                control_panel_inner_line_width,
                control_panel_inner_line_band,
                control_panel_inner_line_height,
                control_panel_shape_exponent
            );
    }

    // Five small dot features and embossed control symbols.
    color(dark_detail_color)
        translate([
            control_panel_offset_x,
            control_panel_offset_y,
            symbol_z
        ]) {
            for (p = dot_positions)
                translate([p[0], p[1], 0])
                    cylinder(h = dot_height, d = dot_diameter, center = false, $fn = dot_segments);

            translate([minus_icon_pos[0], minus_icon_pos[1], 0])
                symbol_minus(minus_icon_length, minus_icon_thickness, icon_height);

            translate([power_icon_pos[0], power_icon_pos[1], 0])
                symbol_power(power_icon_diameter, power_icon_ring_thickness, icon_height);

            translate([play_icon_pos[0], play_icon_pos[1], 0])
                symbol_play_pause(play_icon_size, play_icon_bar_width, icon_height);

            translate([plus_icon_pos[0], plus_icon_pos[1], 0])
                symbol_plus(plus_icon_size, plus_icon_thickness, icon_height);

            translate([x_icon_pos[0], x_icon_pos[1], 0])
                symbol_x(x_icon_size, x_icon_thickness, icon_height);
        }
}

module side_logo() {
    // Slightly embedded raised logo on the front-right sloped housing surface.
    color(dark_detail_color)
        translate([logo_x, logo_y, housing_z + logo_z_relative])
            rotate([logo_tilt_x, 0, logo_rotate_z])
                raised_text_label(logo_text, logo_size, logo_depth, logo_font);
}


// ---------- Unified model ----------
union() {
    color(body_color)
        base_cover();

    color(plate_color)
        translate([0, 0, cover_plate_z])
            cover_plate();

    color(body_color)
        translate([0, 0, housing_z])
            housing_cover_body();

    seam_details();
    control_panel_details();
    side_logo();
}