// Parametric Roman-numeral clock face inspired by the reference image.
// Units: millimeters

// ---------------------------
// Global resolution
// ---------------------------
$fn = 128;
eps = 0.03;

// ---------------------------
// Main body dimensions
// ---------------------------
outer_diameter = 120;
outer_radius = outer_diameter / 2;

base_thickness = 6.0;
base_edge_chamfer = 0.9;

outer_rim_width = 14.0;
outer_rim_height = 3.0;
outer_rim_chamfer = 1.0;
rim_inner_radius = outer_radius - outer_rim_width;

dial_top_z = base_thickness;

// ---------------------------
// Raised circular detail rings
// ---------------------------
chapter_ring_outer_radius = rim_inner_radius - 3.0;
chapter_ring_width = 1.2;
chapter_ring_inner_radius = chapter_ring_outer_radius - chapter_ring_width;
chapter_ring_height = 0.55;
chapter_ring_chamfer = 0.15;

// ---------------------------
// Roman numeral dimensions
// ---------------------------
numeral_radius = 32.5;
numeral_height = 0.95;

numeral_char_height = 8.0;
numeral_stroke_width = 1.15;
numeral_i_width = 2.4;
numeral_vx_width = 5.8;
numeral_char_gap = 1.0;
numeral_use_serifs = true;
numeral_i_cap_width = 2.6;

// Character codes: 0 = I, 1 = V, 2 = X
roman_sequences = [
    [2, 0, 0],       // XII
    [0],             // I
    [0, 0],          // II
    [0, 0, 0],       // III
    [0, 1],          // IV
    [1],             // V
    [1, 0],          // VI
    [1, 0, 0],       // VII
    [1, 0, 0, 0],    // VIII
    [0, 2],          // IX
    [2],             // X
    [2, 0]           // XI
];

// ---------------------------
// Center hub and pivot
// ---------------------------
center_hub_radius = 14.0;
center_hub_height = 1.15;
center_hub_chamfer = 0.35;

pivot_button_radius = 3.6;
pivot_button_height = 0.85;
pivot_button_chamfer = 0.22;
pivot_recess_radius = 2.25;
pivot_recess_depth = 0.28;

// ---------------------------
// Clock hand dimensions
// ---------------------------
hand_angle_clockwise_from_12 = 38;   // Points toward the upper-right, as in the image
hand_length = 44.0;
hand_tail_length = 6.5;
hand_root_width = 2.1;
hand_tip_width = 0.75;
hand_tip_length = 4.0;
hand_thickness = 0.50;
hand_z = dial_top_z + center_hub_height - eps;

// ---------------------------
// Appearance
// ---------------------------
model_color = [0.55, 0.55, 0.57, 1.0];


// ============================================================
// Vector helper functions for clean 2D stroke construction
// ============================================================
function vec_add(a, b) = [a[0] + b[0], a[1] + b[1]];
function vec_sub(a, b) = [a[0] - b[0], a[1] - b[1]];
function vec_scale(v, s) = [v[0] * s, v[1] * s];
function vec_len(v) = sqrt(v[0] * v[0] + v[1] * v[1]);
function vec_unit(v) = vec_len(v) == 0 ? [0, 0] : [v[0] / vec_len(v), v[1] / vec_len(v)];
function vec_perp(v) = [-v[1], v[0]];

function roman_char_width(code) =
    code == 0 ? numeral_i_width : numeral_vx_width;

function roman_prefix_width(seq, idx) =
    idx <= 0
        ? 0
        : roman_prefix_width(seq, idx - 1) + roman_char_width(seq[idx - 1]) + numeral_char_gap;

function roman_label_width(seq) =
    len(seq) == 0
        ? 0
        : roman_prefix_width(seq, len(seq) - 1) + roman_char_width(seq[len(seq) - 1]);


// ============================================================
// Basic reusable solids
// ============================================================

// Beveled solid disk made from a revolved 2D profile.
module beveled_disk(r, h, ch) {
    c = min(ch, r / 2, h / 2);

    rotate_extrude(convexity = 8)
        polygon(points = [
            [0,     0],
            [r - c, 0],
            [r,     c],
            [r,     h - c],
            [r - c, h],
            [0,     h]
        ]);
}

// Beveled annular ring made from a revolved 2D profile.
module beveled_ring(r_outer, r_inner, h, ch) {
    c = min(ch, (r_outer - r_inner) / 2, h / 2);

    rotate_extrude(convexity = 8)
        polygon(points = [
            [r_inner,     0],
            [r_outer - c, 0],
            [r_outer,     c],
            [r_outer,     h - c],
            [r_outer - c, h],
            [r_inner + c, h],
            [r_inner,     h - c]
        ]);
}

// Square-ended 2D stroke between two points.
module stroke_segment_2d(p1, p2, w) {
    d = vec_sub(p2, p1);
    n = vec_scale(vec_perp(vec_unit(d)), w / 2);

    polygon(points = [
        vec_add(p1, n),
        vec_add(p2, n),
        vec_sub(p2, n),
        vec_sub(p1, n)
    ]);
}


// ============================================================
// Clock body
// ============================================================

module clock_base() {
    // Low circular disk forming the recessed dial surface.
    beveled_disk(
        r = outer_radius,
        h = base_thickness,
        ch = base_edge_chamfer
    );

    // Raised outer annular rim / bezel.
    translate([0, 0, base_thickness - eps])
        beveled_ring(
            r_outer = outer_radius,
            r_inner = rim_inner_radius,
            h = outer_rim_height + eps,
            ch = outer_rim_chamfer
        );

    // Fine raised circular chapter ring near the inside of the bezel.
    translate([0, 0, dial_top_z - eps])
        beveled_ring(
            r_outer = chapter_ring_outer_radius,
            r_inner = chapter_ring_inner_radius,
            h = chapter_ring_height + eps,
            ch = chapter_ring_chamfer
        );
}


// ============================================================
// Roman numeral construction from simple raised strokes
// ============================================================

module roman_char_2d(code) {
    h = numeral_char_height;
    sw = numeral_stroke_width;

    if (code == 0) {
        // I
        union() {
            stroke_segment_2d([0, -h / 2], [0, h / 2], sw);

            if (numeral_use_serifs) {
                stroke_segment_2d([-numeral_i_cap_width / 2,  h / 2],
                                  [ numeral_i_cap_width / 2,  h / 2], sw);
                stroke_segment_2d([-numeral_i_cap_width / 2, -h / 2],
                                  [ numeral_i_cap_width / 2, -h / 2], sw);
            }
        }
    } else if (code == 1) {
        // V
        union() {
            stroke_segment_2d([-numeral_vx_width / 2,  h / 2], [0, -h / 2], sw);
            stroke_segment_2d([ numeral_vx_width / 2,  h / 2], [0, -h / 2], sw);
        }
    } else {
        // X
        union() {
            stroke_segment_2d([-numeral_vx_width / 2, -h / 2],
                              [ numeral_vx_width / 2,  h / 2], sw);
            stroke_segment_2d([-numeral_vx_width / 2,  h / 2],
                              [ numeral_vx_width / 2, -h / 2], sw);
        }
    }
}

module roman_label_2d(seq) {
    total_w = roman_label_width(seq);

    union() {
        for (i = [0 : len(seq) - 1]) {
            x_pos = -total_w / 2 + roman_prefix_width(seq, i) + roman_char_width(seq[i]) / 2;
            translate([x_pos, 0])
                roman_char_2d(seq[i]);
        }
    }
}

module raised_roman_numeral(seq, angle_deg) {
    // Clock angle convention:
    // 0 degrees = XII at +Y, positive angles go clockwise.
    translate([
        numeral_radius * sin(angle_deg),
        numeral_radius * cos(angle_deg),
        dial_top_z - eps
    ])
        rotate([0, 0, -angle_deg])
            linear_extrude(height = numeral_height + eps, convexity = 8)
                roman_label_2d(seq);
}

module all_roman_numerals() {
    for (i = [0 : len(roman_sequences) - 1]) {
        raised_roman_numeral(roman_sequences[i], i * 30);
    }
}


// ============================================================
// Center hub and hands
// ============================================================

module center_hub() {
    // Raised circular center plate.
    translate([0, 0, dial_top_z - eps])
        beveled_disk(
            r = center_hub_radius,
            h = center_hub_height + eps,
            ch = center_hub_chamfer
        );
}

module tapered_clock_hand_2d() {
    // Long, narrow tapered pointer with a small tail behind the pivot.
    polygon(points = [
        [-hand_root_width / 2, -hand_tail_length],
        [ hand_root_width / 2, -hand_tail_length],
        [ hand_tip_width  / 2,  hand_length - hand_tip_length],
        [0,                    hand_length],
        [-hand_tip_width / 2,   hand_length - hand_tip_length]
    ]);
}

module clock_hand() {
    translate([0, 0, hand_z])
        rotate([0, 0, -hand_angle_clockwise_from_12])
            linear_extrude(height = hand_thickness, convexity = 4)
                tapered_clock_hand_2d();
}

module pivot_button() {
    // Small raised circular pivot, with a shallow top recess.
    difference() {
        translate([0, 0, hand_z + hand_thickness - eps])
            beveled_disk(
                r = pivot_button_radius,
                h = pivot_button_height + eps,
                ch = pivot_button_chamfer
            );

        translate([
            0,
            0,
            hand_z + hand_thickness + pivot_button_height - pivot_recess_depth
        ])
            cylinder(
                h = pivot_recess_depth + eps * 3,
                r = pivot_recess_radius,
                center = false
            );
    }
}


// ============================================================
// Main model
// ============================================================

module roman_clock_model() {
    union() {
        clock_base();
        all_roman_numerals();
        center_hub();
        clock_hand();
        pivot_button();
    }
}

color(model_color)
    roman_clock_model();