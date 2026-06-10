// Parametric semi-hollow double-cut electric guitar
// Units: millimeters

// -----------------------------------------------------------------------------
// Global resolution
// -----------------------------------------------------------------------------
$fn = 64;
eps = 0.02;

// -----------------------------------------------------------------------------
// Color palette
// -----------------------------------------------------------------------------
body_color          = [0.53, 0.54, 0.55, 1.0];
body_top_color      = [0.62, 0.63, 0.64, 1.0];
binding_color       = [0.88, 0.86, 0.76, 1.0];
purfling_color      = [0.06, 0.06, 0.06, 1.0];
neck_color          = [0.34, 0.28, 0.21, 1.0];
fretboard_color     = [0.08, 0.07, 0.055, 1.0];
headstock_color     = [0.12, 0.11, 0.10, 1.0];
metal_color         = [0.78, 0.78, 0.76, 1.0];
dark_metal_color    = [0.18, 0.18, 0.17, 1.0];
black_color         = [0.01, 0.01, 0.01, 1.0];
cream_color         = [0.92, 0.88, 0.70, 1.0];
inlay_color         = [0.82, 0.80, 0.72, 1.0];
string_color        = [0.02, 0.02, 0.02, 1.0];

// -----------------------------------------------------------------------------
// Body parameters - stylized ES-style semi-hollow double cutaway
// -----------------------------------------------------------------------------
body_thickness          = 12.0;
body_top_cap_height     = 0.9;
body_surface_z          = body_thickness + body_top_cap_height - eps;

body_outline_round      = 3.0;
body_top_inset          = 1.2;
body_binding_width      = 3.2;
body_binding_height     = 0.55;
body_purfling_width     = 0.8;
body_purfling_inset     = 5.4;
body_purfling_height    = 0.35;

body_profile_points = [
    [ 18,  88],
    [ 40,  86],
    [ 57,  76],
    [ 62,  61],
    [ 48,  49],
    [ 43,  39],
    [ 58,  19],
    [ 75,  -9],
    [ 83, -42],
    [ 70, -72],
    [ 38, -91],
    [  0, -96],
    [-38, -91],
    [-70, -72],
    [-83, -42],
    [-75,  -9],
    [-58,  19],
    [-43,  39],
    [-48,  49],
    [-62,  61],
    [-57,  76],
    [-40,  86],
    [-18,  88]
];

// F-hole parameters
f_hole_x             = 48;
f_hole_y             = -8;
f_hole_angle         = 8;
f_hole_slot_radius   = 1.35;
f_hole_rim_width     = 0.9;
f_hole_rim_height    = 0.35;

// -----------------------------------------------------------------------------
// Neck, fretboard, and headstock parameters
// -----------------------------------------------------------------------------
neck_start_y         = 66;
nut_y                = 305;
neck_length          = nut_y - neck_start_y;
neck_width_body      = 31;
neck_width_nut       = 22;
neck_thickness       = 5.2;
neck_base_z          = body_surface_z - 1.2;

neck_heel_width      = 39;
neck_heel_depth      = 34;
neck_heel_round      = 4;

fretboard_start_y    = 43;
fretboard_length     = nut_y - fretboard_start_y;
fretboard_width_body = 38;
fretboard_width_nut  = 24;
fretboard_thickness  = 1.8;
fretboard_z          = neck_base_z + neck_thickness - eps;
fretboard_top_z      = fretboard_z + fretboard_thickness;

fret_count           = 22;
scale_length         = 335;
fret_wire_h          = 0.55;
fret_wire_depth      = 0.9;
fret_markers         = [3, 5, 7, 9, 12, 15, 17, 19, 21];
inlay_diameter       = 3.6;
inlay_height         = 0.35;

nut_depth            = 2.2;
nut_height           = 1.5;

headstock_start_y    = nut_y;
headstock_length     = 66;
headstock_thickness  = 5.4;
headstock_z          = neck_base_z + 0.2;
headstock_veneer_h   = 0.45;
headstock_top_z      = headstock_z + headstock_thickness;
headstock_surface_z  = headstock_top_z + headstock_veneer_h - eps;
headstock_round      = 2.1;
headstock_veneer_inset = 1.8;

headstock_points = [
    [ neck_width_nut/2,  0],
    [ 20,                8],
    [ 25,               24],
    [ 35,               40],
    [ 30,               57],
    [ 10,               56],
    [  0,               66],
    [-10,               56],
    [-30,               57],
    [-35,               40],
    [-25,               24],
    [-20,                8],
    [-neck_width_nut/2,  0]
];

// Tuner parameters
tuner_post_x          = 18.5;
tuner_knob_x          = 36;
tuner_first_y         = 16;
tuner_pitch           = 15;
tuner_post_d          = 4.2;
tuner_post_h          = 4.0;
tuner_washer_d        = 7.5;
tuner_washer_h        = 0.8;
tuner_stem_d          = 1.8;
tuner_knob_d          = 8.5;

// -----------------------------------------------------------------------------
// Pickup, bridge, tailpiece, controls
// -----------------------------------------------------------------------------
pickup_frame_w        = 48;
pickup_frame_d        = 22;
pickup_frame_ring     = 3.0;
pickup_frame_r        = 2.0;
pickup_frame_h        = 1.2;
pickup_coil_w         = 38;
pickup_coil_d         = 7.2;
pickup_coil_gap       = 2.1;
pickup_coil_h         = 0.8;
pickup_pole_d         = 2.0;
pickup_pole_h         = 0.35;

neck_pickup_y         = 31;
bridge_pickup_y       = -5;

pickguard_thickness   = 0.8;
pickguard_round       = 1.7;
pickguard_points = [
    [18, 48],
    [35, 47],
    [53, 38],
    [57, 25],
    [47, 17],
    [33, 20],
    [24,  8],
    [17, 13],
    [22, 30]
];

bridge_y              = -32;
bridge_width          = 45;
bridge_post_span      = 38;
bridge_post_d         = 4.6;
bridge_post_h         = 2.5;
bridge_bar_d          = 4.2;
bridge_saddle_w       = 4.0;
bridge_saddle_d       = 5.2;
bridge_saddle_h       = 1.2;
bridge_bar_center_z   = body_surface_z + bridge_post_h + bridge_bar_d/2 - eps;

tailpiece_y           = -52;
tailpiece_width       = 46;
tailpiece_post_span   = 39;
tailpiece_post_d      = 5.0;
tailpiece_post_h      = 2.2;
tailpiece_bar_d       = 5.5;
tailpiece_bar_center_z = body_surface_z + tailpiece_post_h + tailpiece_bar_d/2 - eps;

knob_d                = 9.5;
knob_h                = 3.0;
knob_positions        = [
    [57,   8],
    [70, -21],
    [49, -44],
    [70, -58]
];

switch_x              = 39;
switch_y              = 55;
switch_base_d         = 8.5;
switch_base_h         = 0.9;
switch_lever_h        = 8.0;
switch_lever_d        = 1.3;

jack_x                = 59;
jack_y                = -74;
jack_plate_d          = 7.0;
jack_hole_d           = 2.6;

// -----------------------------------------------------------------------------
// Strings
// -----------------------------------------------------------------------------
string_count          = 6;
bridge_string_span    = 36;
nut_string_span       = 20;
tailpiece_string_span = 32;
string_diameters      = [0.85, 0.76, 0.66, 0.55, 0.47, 0.40];

string_tail_z         = tailpiece_bar_center_z + tailpiece_bar_d/2 + 0.30;
string_bridge_z       = bridge_bar_center_z + bridge_bar_d/2 + 0.50;
string_nut_z          = fretboard_top_z + fret_wire_h + 1.0;
string_tuner_z        = headstock_surface_z + tuner_post_h + 0.25;

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------
function lerp(a, b, t) = a + (b - a) * t;
function clamp(v, lo, hi) = min(max(v, lo), hi);
function fret_y(n) = nut_y - scale_length * (1 - pow(2, -n / 12));
function marker_y(n) = (fret_y(n - 1) + fret_y(n)) / 2;
function fretboard_width_at_y(y) =
    lerp(fretboard_width_body, fretboard_width_nut,
        clamp((y - fretboard_start_y) / fretboard_length, 0, 1));

function string_x(i, span) = -span/2 + i * span / (string_count - 1);
function tuner_string_x(i) = (i < 3) ? -tuner_post_x : tuner_post_x;
function tuner_string_y(i) =
    headstock_start_y + tuner_first_y + ((i < 3) ? i : (5 - i)) * tuner_pitch;

// -----------------------------------------------------------------------------
// 2D helper modules
// -----------------------------------------------------------------------------
module rounded_rect_2d(w, d, r) {
    offset(r = r)
        square([w - 2*r, d - 2*r], center = true);
}

module rounded_poly_2d(points, r) {
    offset(r = r)
        offset(delta = -r)
            polygon(points = points);
}

module capsule_2d(p1, p2, r) {
    hull() {
        translate(p1) circle(r = r);
        translate(p2) circle(r = r);
    }
}

module tapered_rect_2d(len, w0, w1) {
    polygon(points = [
        [-w0/2, 0],
        [ w0/2, 0],
        [ w1/2, len],
        [-w1/2, len]
    ]);
}

// -----------------------------------------------------------------------------
// Body outline and f-hole profiles
// -----------------------------------------------------------------------------
module body_outline_2d(inset = 0) {
    offset(delta = -inset)
        offset(r = body_outline_round)
            offset(delta = -body_outline_round)
                polygon(points = body_profile_points);
}

module body_ring_2d(inset = 0, ring_w = 1) {
    difference() {
        body_outline_2d(inset = inset);
        body_outline_2d(inset = inset + ring_w);
    }
}

module f_hole_single_2d() {
    union() {
        capsule_2d([-2,  25], [ 8,  18], f_hole_slot_radius);
        capsule_2d([ 8,  18], [ 6,   9], f_hole_slot_radius);
        capsule_2d([ 6,   9], [-5,  -3], f_hole_slot_radius);
        capsule_2d([-5,  -3], [-8, -15], f_hole_slot_radius);
        capsule_2d([-8, -15], [ 3, -24], f_hole_slot_radius);

        capsule_2d([-9,  25], [-18,  21], f_hole_slot_radius * 0.9);
        capsule_2d([ 7, -24], [ 16, -20], f_hole_slot_radius * 0.9);

        translate([-6,  25]) circle(r = f_hole_slot_radius * 1.45);
        translate([ 5, -24]) circle(r = f_hole_slot_radius * 1.45);
    }
}

module f_holes_2d() {
    translate([ f_hole_x, f_hole_y])
        rotate(-f_hole_angle)
            f_hole_single_2d();

    translate([-f_hole_x, f_hole_y])
        rotate(f_hole_angle)
            mirror([1, 0, 0])
                f_hole_single_2d();
}

// -----------------------------------------------------------------------------
// Body assembly
// -----------------------------------------------------------------------------
module guitar_body() {
    difference() {
        union() {
            // Main body slab
            color(body_color)
                linear_extrude(height = body_thickness)
                    body_outline_2d();

            // Slight raised top surface, inset to suggest carved/arched top
            color(body_top_color)
                translate([0, 0, body_thickness - eps])
                    linear_extrude(height = body_top_cap_height)
                        body_outline_2d(inset = body_top_inset);
        }

        // Through-cut semi-hollow f-holes
        translate([0, 0, -1])
            linear_extrude(height = body_surface_z + 2)
                f_holes_2d();
    }

    // Raised outer cream binding
    color(binding_color)
        translate([0, 0, body_surface_z - eps])
            linear_extrude(height = body_binding_height)
                body_ring_2d(inset = 0, ring_w = body_binding_width);

    // Fine dark purfling line inset from binding
    color(purfling_color)
        translate([0, 0, body_surface_z + body_binding_height - eps])
            linear_extrude(height = body_purfling_height)
                body_ring_2d(inset = body_purfling_inset, ring_w = body_purfling_width);

    // Thin dark lips around f-holes
    color(black_color)
        translate([0, 0, body_surface_z + 0.05])
            linear_extrude(height = f_hole_rim_height)
                difference() {
                    offset(delta = f_hole_rim_width)
                        f_holes_2d();
                    f_holes_2d();
                }

    // Tail strap button on lower rim
    color(metal_color)
        translate([0, -98, body_thickness/2])
            rotate([90, 0, 0])
                cylinder(h = 6, d = 4.2, center = true);
}

// -----------------------------------------------------------------------------
// Neck, fretboard, frets, inlays, headstock, tuners
// -----------------------------------------------------------------------------
module fretboard_assembly() {
    // Dark tapered fingerboard
    color(fretboard_color)
        translate([0, fretboard_start_y, fretboard_z])
            linear_extrude(height = fretboard_thickness)
                tapered_rect_2d(fretboard_length, fretboard_width_body, fretboard_width_nut);

    // Metal fret wires; spacing follows 12-TET scale formula
    color(metal_color) {
        for (n = [1 : fret_count])
            let (fy = fret_y(n), fw = fretboard_width_at_y(fy))
                if (fy > fretboard_start_y + 1 && fy < nut_y - 1)
                    translate([0, fy, fretboard_top_z + fret_wire_h/2 - eps])
                        cube([fw + 1.2, fret_wire_depth, fret_wire_h], center = true);
    }

    // Dot inlays, with double dot at the 12th fret
    color(inlay_color) {
        for (m = fret_markers)
            let (my = marker_y(m))
                if (my > fretboard_start_y && my < nut_y)
                    if (m == 12) {
                        translate([-5.0, my, fretboard_top_z - eps])
                            cylinder(h = inlay_height, d = inlay_diameter);
                        translate([ 5.0, my, fretboard_top_z - eps])
                            cylinder(h = inlay_height, d = inlay_diameter);
                    } else {
                        translate([0, my, fretboard_top_z - eps])
                            cylinder(h = inlay_height, d = inlay_diameter);
                    }
    }

    // Nut at the headstock end
    color(cream_color)
        translate([0, nut_y, fretboard_top_z + nut_height/2 - eps])
            cube([fretboard_width_nut + 3.0, nut_depth, nut_height], center = true);
}

module headstock_outline_2d(inset = 0) {
    offset(delta = -inset)
        offset(r = headstock_round)
            offset(delta = -headstock_round)
                polygon(points = headstock_points);
}

module headstock_assembly() {
    // Main headstock paddle
    color(neck_color)
        translate([0, headstock_start_y, headstock_z])
            linear_extrude(height = headstock_thickness)
                headstock_outline_2d();

    // Dark face veneer
    color(headstock_color)
        translate([0, headstock_start_y, headstock_top_z - eps])
            linear_extrude(height = headstock_veneer_h)
                headstock_outline_2d(inset = headstock_veneer_inset);

    // Truss rod cover
    color(black_color)
        translate([0, headstock_start_y + 5, headstock_surface_z - eps])
            linear_extrude(height = 0.55)
                rounded_poly_2d([
                    [-5,  0],
                    [ 5,  0],
                    [ 4, 16],
                    [ 0, 22],
                    [-4, 16]
                ], 0.55);

    // Truss cover screws
    screw_head(0, headstock_start_y + 8, headstock_surface_z + 0.35, d = 1.4, h = 0.22, rot = 20);
    screw_head(0, headstock_start_y + 23, headstock_surface_z + 0.35, d = 1.4, h = 0.22, rot = -20);

    // Six 3+3 tuners with side knobs
    for (side = [-1, 1]) {
        for (i = [0 : 2])
            let (
                ty = headstock_start_y + tuner_first_y + i * tuner_pitch,
                px = side * tuner_post_x,
                kx = side * tuner_knob_x
            ) {
                color(metal_color)
                    translate([px, ty, headstock_surface_z - eps])
                        cylinder(h = tuner_washer_h, d = tuner_washer_d);

                color(metal_color)
                    translate([px, ty, headstock_surface_z - eps])
                        cylinder(h = tuner_post_h, d = tuner_post_d);

                color(metal_color)
                    translate([(px + kx)/2, ty, headstock_surface_z + 2.2])
                        rotate([0, 90, 0])
                            cylinder(h = abs(kx - px), d = tuner_stem_d, center = true);

                color(metal_color)
                    translate([kx, ty, headstock_surface_z + 2.2])
                        scale([1.15, 0.72, 0.24])
                            sphere(d = tuner_knob_d);
            }
    }
}

module neck_assembly() {
    // Rounded heel block where neck enters the body
    color(neck_color)
        translate([0, neck_start_y - 13, neck_base_z])
            linear_extrude(height = neck_thickness)
                rounded_rect_2d(neck_heel_width, neck_heel_depth, neck_heel_round);

    // Tapered neck shaft
    color(neck_color)
        translate([0, neck_start_y, neck_base_z])
            linear_extrude(height = neck_thickness)
                tapered_rect_2d(neck_length, neck_width_body, neck_width_nut);

    fretboard_assembly();
    headstock_assembly();
}

// -----------------------------------------------------------------------------
// Hardware and controls
// -----------------------------------------------------------------------------
module screw_head(x, y, z, d = 2.2, h = 0.28, rot = 0) {
    color(metal_color)
        translate([x, y, z])
            cylinder(h = h, d = d);

    color(black_color)
        translate([x, y, z + h - eps])
            rotate([0, 0, rot])
                cube([d * 0.72, d * 0.13, 0.16], center = true);
}

module pickup(ypos) {
    // Mounting ring
    color(metal_color)
        translate([0, ypos, body_surface_z - eps])
            linear_extrude(height = pickup_frame_h)
                difference() {
                    rounded_rect_2d(pickup_frame_w, pickup_frame_d, pickup_frame_r);
                    rounded_rect_2d(
                        pickup_frame_w - 2*pickup_frame_ring,
                        pickup_frame_d - 2*pickup_frame_ring,
                        max(0.4, pickup_frame_r - pickup_frame_ring/2)
                    );
                }

    // Two black humbucker coils
    color(black_color) {
        for (cy = [-(pickup_coil_d + pickup_coil_gap)/2, (pickup_coil_d + pickup_coil_gap)/2])
            translate([0, ypos + cy, body_surface_z + 0.25])
                linear_extrude(height = pickup_coil_h)
                    rounded_rect_2d(pickup_coil_w, pickup_coil_d, 0.9);
    }

    // Pole pieces aligned to strings
    color(metal_color) {
        for (cy = [-(pickup_coil_d + pickup_coil_gap)/2, (pickup_coil_d + pickup_coil_gap)/2])
            for (i = [0 : string_count - 1])
                translate([string_x(i, 32), ypos + cy, body_surface_z + pickup_coil_h + 0.25 - eps])
                    cylinder(h = pickup_pole_h, d = pickup_pole_d);
    }

    // Corner mounting screws
    screw_head(-pickup_frame_w/2 + 4, ypos - pickup_frame_d/2 + 4, body_surface_z + pickup_frame_h - eps, d = 2.0, h = 0.25, rot = 35);
    screw_head( pickup_frame_w/2 - 4, ypos - pickup_frame_d/2 + 4, body_surface_z + pickup_frame_h - eps, d = 2.0, h = 0.25, rot = -25);
    screw_head(-pickup_frame_w/2 + 4, ypos + pickup_frame_d/2 - 4, body_surface_z + pickup_frame_h - eps, d = 2.0, h = 0.25, rot = -10);
    screw_head( pickup_frame_w/2 - 4, ypos + pickup_frame_d/2 - 4, body_surface_z + pickup_frame_h - eps, d = 2.0, h = 0.25, rot = 15);
}

module pickguard() {
    color(black_color)
        translate([0, 0, body_surface_z - eps])
            linear_extrude(height = pickguard_thickness)
                rounded_poly_2d(pickguard_points, pickguard_round);

    screw_head(49, 34, body_surface_z + pickguard_thickness - eps, d = 2.0, h = 0.25, rot = 15);
    screw_head(25, 13, body_surface_z + pickguard_thickness - eps, d = 2.0, h = 0.25, rot = -20);
}

module bridge() {
    // Bridge posts
    color(metal_color) {
        for (x = [-bridge_post_span/2, bridge_post_span/2])
            translate([x, bridge_y, body_surface_z - eps])
                cylinder(h = bridge_post_h + eps, d = bridge_post_d);
    }

    // Tune-o-matic bridge bar
    color(metal_color)
        translate([0, bridge_y, bridge_bar_center_z])
            rotate([0, 90, 0])
                cylinder(h = bridge_width, d = bridge_bar_d, center = true);

    // Individual saddles
    color(dark_metal_color) {
        for (i = [0 : string_count - 1])
            translate([
                string_x(i, bridge_string_span),
                bridge_y + ((i % 2) - 0.5) * 1.8,
                bridge_bar_center_z + bridge_bar_d/2 + bridge_saddle_h/2 - eps
            ])
                cube([bridge_saddle_w, bridge_saddle_d, bridge_saddle_h], center = true);
    }
}

module tailpiece() {
    // Stop tailpiece posts
    color(metal_color) {
        for (x = [-tailpiece_post_span/2, tailpiece_post_span/2])
            translate([x, tailpiece_y, body_surface_z - eps])
                cylinder(h = tailpiece_post_h + eps, d = tailpiece_post_d);
    }

    // Stop bar
    color(metal_color)
        translate([0, tailpiece_y, tailpiece_bar_center_z])
            rotate([0, 90, 0])
                cylinder(h = tailpiece_width, d = tailpiece_bar_d, center = true);

    // String anchor holes on the bar
    color(black_color) {
        for (i = [0 : string_count - 1])
            translate([string_x(i, tailpiece_string_span), tailpiece_y, tailpiece_bar_center_z + tailpiece_bar_d/2 - eps])
                cylinder(h = 0.35, d = 1.6);
    }
}

module control_knob(x, y, rot = 0) {
    color(metal_color)
        translate([x, y, body_surface_z - eps])
            cylinder(h = knob_h, r1 = knob_d/2, r2 = knob_d * 0.42);

    color(dark_metal_color)
        translate([x, y, body_surface_z + knob_h - eps])
            cylinder(h = 0.28, d = knob_d * 0.56);

    color(black_color)
        translate([x, y, body_surface_z + knob_h + 0.12])
            rotate([0, 0, rot])
                cube([knob_d * 0.12, knob_d * 0.55, 0.22], center = true);
}

module toggle_switch() {
    color(metal_color)
        translate([switch_x, switch_y, body_surface_z - eps])
            cylinder(h = switch_base_h, d = switch_base_d);

    color(dark_metal_color)
        translate([switch_x, switch_y, body_surface_z + switch_base_h - eps])
            rotate([22, 0, 18])
                cylinder(h = switch_lever_h, d = switch_lever_d);

    color(black_color)
        translate([switch_x, switch_y, body_surface_z + switch_base_h])
            rotate([22, 0, 18])
                translate([0, 0, switch_lever_h])
                    sphere(d = 2.7);
}

module output_jack() {
    color(metal_color)
        translate([jack_x, jack_y, body_surface_z - eps])
            cylinder(h = 0.75, d = jack_plate_d);

    color(black_color)
        translate([jack_x, jack_y, body_surface_z + 0.55])
            cylinder(h = 0.35, d = jack_hole_d);
}

module top_hardware() {
    pickguard();

    pickup(neck_pickup_y);
    pickup(bridge_pickup_y);

    bridge();
    tailpiece();

    for (k = [0 : len(knob_positions) - 1])
        control_knob(knob_positions[k][0], knob_positions[k][1], rot = k * 27);

    toggle_switch();
    output_jack();

    // Small decorative body screws visible on the upper/right body face
    screw_head(62, 41, body_surface_z + 0.08, d = 2.1, h = 0.22, rot = 30);
    screw_head(73, 19, body_surface_z + 0.08, d = 2.1, h = 0.22, rot = -15);
    screw_head(32, 59, body_surface_z + 0.08, d = 2.1, h = 0.22, rot = 45);
}

// -----------------------------------------------------------------------------
// Strings
// -----------------------------------------------------------------------------
module string_between(p1, p2, d) {
    hull() {
        translate(p1) sphere(d = d);
        translate(p2) sphere(d = d);
    }
}

module guitar_strings() {
    color(string_color) {
        for (i = [0 : string_count - 1])
            let (
                xt = string_x(i, tailpiece_string_span),
                xb = string_x(i, bridge_string_span),
                xn = string_x(i, nut_string_span),
                xp = tuner_string_x(i),
                yp = tuner_string_y(i),
                sd = string_diameters[i]
            ) {
                // Tailpiece to bridge
                string_between(
                    [xt, tailpiece_y, string_tail_z],
                    [xb, bridge_y, string_bridge_z],
                    sd
                );

                // Bridge to nut over the pickups and fretboard
                string_between(
                    [xb, bridge_y, string_bridge_z],
                    [xn, nut_y, string_nut_z],
                    sd
                );

                // Nut to tuning post, splayed 3+3 at headstock
                string_between(
                    [xn, nut_y, string_nut_z],
                    [xp, yp, string_tuner_z],
                    sd
                );
            }
    }
}

// -----------------------------------------------------------------------------
// Main model
// -----------------------------------------------------------------------------
module guitar_model() {
    union() {
        guitar_body();
        neck_assembly();
        top_hardware();
        guitar_strings();
    }
}

guitar_model();