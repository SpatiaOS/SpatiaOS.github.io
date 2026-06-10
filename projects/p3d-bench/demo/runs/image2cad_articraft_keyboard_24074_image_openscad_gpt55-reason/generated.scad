/*
    Parametric low-profile full-size keyboard model
    Interpretation from image:
    - Very thin rounded rectangular chassis
    - Slightly darker edge/rim and rounded front lip
    - Low, flat, rounded rectangular keycaps
    - Main typing area, navigation cluster, arrow cluster, and numeric keypad
    Units: millimeters
*/

// ----------------------------
// Global resolution
// ----------------------------
$fn = 36;

// ----------------------------
// Chassis parameters
// ----------------------------
base_length        = 430;
base_depth         = 126;
base_height        = 3.2;
base_corner_radius = 5.0;
base_side_bevel    = 1.2;

bottom_rim_height  = 0.65;
bottom_rim_inset   = 6.0;

top_skin_height    = 0.18;
top_skin_raise     = 0.02;
top_skin_inset     = 2.3;

top_ring_thickness = 0.85;
top_ring_height    = 0.06;

front_lip_radius   = 1.8;
front_lip_y_inset  = 1.0;
front_lip_z        = 0.95;

// ----------------------------
// Key layout parameters
// ----------------------------
key_pitch_x        = 17.5;
key_pitch_y        = 17.0;
key_gap_x          = 2.45;
key_gap_y          = 3.10;

main_cluster_cols  = 15;
nav_col            = 16;
numpad_col         = 19.25;

layout_grid_cols   = numpad_col + 4;
layout_grid_rows   = 6;

key_margin_x       = (base_length - (layout_grid_cols * key_pitch_x - key_gap_x)) / 2;
key_margin_y       = (base_depth  - (layout_grid_rows * key_pitch_y - key_gap_y)) / 2;

key_base_z         = base_height + top_skin_raise - 0.012;

// ----------------------------
// Keycap parameters
// ----------------------------
key_skirt_height   = 0.52;
key_skirt_bevel    = 0.25;
key_top_height     = 0.88;
key_top_overlap    = 0.08;
key_top_inset      = 0.82;
key_top_bevel      = 0.34;
key_corner_radius  = 1.45;

// ----------------------------
// Colors for preview
// ----------------------------
edge_dark_color    = [0.05, 0.055, 0.060];
base_side_color    = [0.36, 0.37, 0.39];
base_top_color     = [0.46, 0.47, 0.49];
key_side_color     = [0.08, 0.085, 0.090];
key_top_color      = [0.62, 0.63, 0.65];

// ----------------------------
// Helper functions
// ----------------------------
function safe_radius(w, d, r) = max(0.01, min(r, min(w, d) / 2 - 0.01));

function key_width(u)  = u * key_pitch_x - key_gap_x;
function key_depth(v)  = v * key_pitch_y - key_gap_y;

function grid_x(c, u=1) = -base_length / 2 + key_margin_x + (c + u / 2) * key_pitch_x;
function grid_y(r, v=1) = -base_depth  / 2 + key_margin_y + (r + v / 2) * key_pitch_y;

// ----------------------------
// 2D rounded rectangle primitive
// ----------------------------
module rounded_rect_2d(w, d, r) {
    rr = safe_radius(w, d, r);

    offset(r=rr)
        square(
            [
                max(0.01, w - 2 * rr),
                max(0.01, d - 2 * rr)
            ],
            center=true
        );
}

// ----------------------------
// 2D rounded rectangular ring
// Used for the subtle dark perimeter line on top
// ----------------------------
module rounded_ring_2d(w, d, r, t) {
    difference() {
        rounded_rect_2d(w, d, r);
        rounded_rect_2d(w - 2 * t, d - 2 * t, max(0.01, r - t));
    }
}

// ----------------------------
// Extruded rounded plate
// ----------------------------
module rounded_plate(w, d, h, r) {
    linear_extrude(height=h, convexity=4)
        rounded_rect_2d(w, d, r);
}

// ----------------------------
// Tapered rounded box
// Creates shallow bevels for chassis and keycaps
// ----------------------------
module tapered_rounded_box(w, d, h, r, inset=0.3) {
    top_w = max(0.1, w - 2 * inset);
    top_d = max(0.1, d - 2 * inset);

    linear_extrude(
        height=h,
        scale=[top_w / w, top_d / d],
        convexity=4
    )
        rounded_rect_2d(w, d, r);
}

// ----------------------------
// Thin rolled lip along the front edge,
// matching the rounded curled edge visible in the image
// ----------------------------
module front_rolled_lip() {
    color(edge_dark_color)
        translate([
            0,
            -base_depth / 2 + front_lip_y_inset,
            front_lip_z
        ])
            rotate([0, 90, 0])
                cylinder(
                    h=base_length - 2 * base_corner_radius,
                    r=front_lip_radius,
                    center=true
                );
}

// ----------------------------
// Main keyboard chassis
// ----------------------------
module keyboard_base() {
    union() {
        // Dark lower rim/shadow layer visible around the thin body
        color(edge_dark_color)
            translate([0, 0, -bottom_rim_height + 0.02])
                tapered_rounded_box(
                    base_length - 2 * bottom_rim_inset,
                    base_depth  - 2 * bottom_rim_inset,
                    bottom_rim_height,
                    max(0.5, base_corner_radius - 1.8),
                    0.35
                );

        // Main thin rounded chassis
        color(base_side_color)
            tapered_rounded_box(
                base_length,
                base_depth,
                base_height,
                base_corner_radius,
                base_side_bevel
            );

        // Slightly inset top deck, darker than key tops to emphasize gaps
        color(base_top_color)
            translate([0, 0, base_height - top_skin_height + top_skin_raise])
                rounded_plate(
                    base_length - 2 * top_skin_inset,
                    base_depth  - 2 * top_skin_inset,
                    top_skin_height,
                    max(0.5, base_corner_radius - top_skin_inset)
                );

        // Thin perimeter outline on top surface
        color(edge_dark_color)
            translate([0, 0, base_height + top_skin_raise + 0.004])
                linear_extrude(height=top_ring_height, convexity=4)
                    rounded_ring_2d(
                        base_length - 2 * top_skin_inset + 0.4,
                        base_depth  - 2 * top_skin_inset + 0.4,
                        max(0.5, base_corner_radius - top_skin_inset),
                        top_ring_thickness
                    );

        // Rounded rolled front edge
        front_rolled_lip();
    }
}

// ----------------------------
// Individual low-profile keycap
// ----------------------------
module keycap(w, d) {
    skirt_w = max(2, w);
    skirt_d = max(2, d);

    top_w = max(1, skirt_w - 2 * key_top_inset);
    top_d = max(1, skirt_d - 2 * key_top_inset);

    union() {
        // Dark lower skirt / key side wall
        color(key_side_color)
            tapered_rounded_box(
                skirt_w,
                skirt_d,
                key_skirt_height,
                key_corner_radius,
                key_skirt_bevel
            );

        // Lighter raised top face
        color(key_top_color)
            translate([0, 0, key_skirt_height - key_top_overlap])
                tapered_rounded_box(
                    top_w,
                    top_d,
                    key_top_height,
                    max(0.25, key_corner_radius - key_top_inset),
                    key_top_bevel
                );
    }
}

// ----------------------------
// Place a key on the layout grid
// c/r are grid column and row starts; u/v are key width/depth in grid units
// ----------------------------
module key_at_grid(c, r, u=1, v=1) {
    translate([grid_x(c, u), grid_y(r, v), key_base_z])
        keycap(key_width(u), key_depth(v));
}

// ----------------------------
// Main alphanumeric cluster
// ----------------------------
module main_key_cluster() {
    // Top function row with grouped spacing
    key_at_grid(0, 5);

    for (c = [2 : 1 : 5])
        key_at_grid(c, 5);

    for (c = [6.5 : 1 : 9.5])
        key_at_grid(c, 5);

    for (c = [11 : 1 : 14])
        key_at_grid(c, 5);

    // Number row with wide backspace
    for (c = [0 : 1 : 12])
        key_at_grid(c, 4);

    key_at_grid(13, 4, 2);

    // QWERTY row
    key_at_grid(0, 3, 1.5);

    for (c = [1.5 : 1 : 12.5])
        key_at_grid(c, 3);

    key_at_grid(13.5, 3, 1.5);

    // Home row
    key_at_grid(0, 2, 1.75);

    for (c = [1.75 : 1 : 11.75])
        key_at_grid(c, 2);

    key_at_grid(12.75, 2, 2.25);

    // Shift row
    key_at_grid(0, 1, 2.25);

    for (c = [2.25 : 1 : 11.25])
        key_at_grid(c, 1);

    key_at_grid(12.25, 1, 2.75);

    // Bottom modifier row with long spacebar
    key_at_grid(0,     0, 1.25);
    key_at_grid(1.25,  0, 1.25);
    key_at_grid(2.50,  0, 1.25);
    key_at_grid(3.75,  0, 1.25);

    key_at_grid(5.00,  0, 5.00);

    key_at_grid(10.00, 0, 1.25);
    key_at_grid(11.25, 0, 1.25);
    key_at_grid(12.50, 0, 1.25);
    key_at_grid(13.75, 0, 1.25);
}

// ----------------------------
// Navigation and arrow clusters
// ----------------------------
module navigation_cluster() {
    // Upper navigation block
    for (c = [nav_col : 1 : nav_col + 2]) {
        key_at_grid(c, 5);
        key_at_grid(c, 4);
        key_at_grid(c, 3);
    }

    // Inverted-T arrow cluster
    key_at_grid(nav_col + 1, 1);

    key_at_grid(nav_col + 0, 0);
    key_at_grid(nav_col + 1, 0);
    key_at_grid(nav_col + 2, 0);
}

// ----------------------------
// Numeric keypad
// ----------------------------
module numeric_keypad() {
    // Top small utility row above keypad
    for (c = [0 : 1 : 3])
        key_at_grid(numpad_col + c, 5);

    // Operator row
    for (c = [0 : 1 : 3])
        key_at_grid(numpad_col + c, 4);

    // 7-8-9 row with vertical plus key below
    for (c = [0 : 1 : 2])
        key_at_grid(numpad_col + c, 3);

    // 4-5-6 row and plus spanning two rows
    for (c = [0 : 1 : 2])
        key_at_grid(numpad_col + c, 2);

    key_at_grid(numpad_col + 3, 2, 1, 2);

    // 1-2-3 row and vertical enter below
    for (c = [0 : 1 : 2])
        key_at_grid(numpad_col + c, 1);

    // Bottom keypad row: wide zero, decimal, tall enter
    key_at_grid(numpad_col + 0, 0, 2);
    key_at_grid(numpad_col + 2, 0);
    key_at_grid(numpad_col + 3, 0, 1, 2);
}

// ----------------------------
// All keys
// ----------------------------
module keyboard_keys() {
    union() {
        main_key_cluster();
        navigation_cluster();
        numeric_keypad();
    }
}

// ----------------------------
// Complete model
// ----------------------------
module keyboard_model() {
    union() {
        keyboard_base();
        keyboard_keys();
    }
}

keyboard_model();