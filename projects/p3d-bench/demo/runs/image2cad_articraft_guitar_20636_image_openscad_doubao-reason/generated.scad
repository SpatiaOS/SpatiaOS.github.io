// Semi-Hollow Electric Guitar (ES-335 Style)
// Global Configuration
$fn = 64;
scale_factor = 0.5; // Set to 1 for full size, 0.5 for desk model
unit = 1 * scale_factor;

// Core Guitar Dimensions
body_thickness = 45 * unit;
body_length = 480 * unit;
body_max_width = 380 * unit;
body_waist_width = 260 * unit;
neck_length = 420 * unit;
neck_width_nut = 42 * unit;
neck_width_body = 55 * unit;
neck_thickness = 22 * unit;
fretboard_thickness = 3 * unit;
fret_count = 22;
headstock_length = 180 * unit;
headstock_width = 110 * unit;
headstock_pitch = 12; // degrees, standard angled headstock

// Hardware Dimensions
pickup_w = 38 * unit;
pickup_l = 70 * unit;
pickup_h = 5 * unit;
bridge_w = 80 * unit;
bridge_l = 20 * unit;
bridge_h = 8 * unit;
knob_d = 12 * unit;
knob_h = 6 * unit;
tuner_post_d = 6 * unit;
tuner_post_h = 10 * unit;
string_d = 0.8 * unit;

// Helper function to convert degrees to radians
function deg2rad(d) = d * pi / 180;

// ------------------------------
// Module: Semi-hollow guitar body
// ------------------------------
module guitar_body() {
    // Base body 2D profile (ES-335 shape)
    body_points = [
        [0, 0],
        [body_length*0.15, body_max_width/2],
        [body_length*0.35, body_waist_width/2],
        [body_length*0.5, body_max_width*0.45/2],
        // Upper cutaway
        [body_length*0.85, body_max_width*0.35/2],
        [body_length*0.92, neck_width_body/2 + 10*unit],
        [body_length, neck_width_body/2],
        [body_length, -neck_width_body/2],
        [body_length*0.92, -neck_width_body/2 - 10*unit],
        [body_length*0.85, -body_max_width*0.35/2],
        [body_length*0.5, -body_max_width*0.45/2],
        [body_length*0.35, -body_waist_width/2],
        [body_length*0.15, -body_max_width/2],
        [0, 0]
    ];

    difference() {
        // Main body with rounded edges
        linear_extrude(height=body_thickness)
        offset(r=8*unit) polygon(points=body_points);

        // F-hole cutouts (symmetric pair)
        for (side = [1, -1]) {
            translate([body_length*0.4, side*body_waist_width*0.3, -1])
            linear_extrude(height=body_thickness + 2)
            polygon(points=[
                [0, 0], [10*unit, 2*unit], [25*unit, 15*unit],
                [30*unit, 30*unit], [28*unit, 45*unit], [15*unit, 55*unit],
                [0, 60*unit], [-15*unit, 55*unit], [-28*unit, 45*unit],
                [-30*unit, 30*unit], [-25*unit, 15*unit], [-10*unit, 2*unit], [0,0]
            ]);
        }

        // Neck pocket cutout
        translate([body_length, 0, body_thickness/2])
        rotate([90,0,0])
        cylinder(h=20*unit, d1=neck_width_body, d2=neck_width_body*0.95, center=true);
    }
}

// ------------------------------
// Module: Guitar neck + fretboard
// ------------------------------
module guitar_neck() {
    union() {
        // Tapered neck base
        hull() {
            translate([0, 0, 0])
            cube([neck_length*0.05, neck_width_nut, neck_thickness], center=true);

            translate([neck_length, 0, 0])
            cube([neck_length*0.05, neck_width_body, neck_thickness], center=true);
        }

        // Fretboard on top of neck
        hull() {
            translate([0, 0, neck_thickness/2 + fretboard_thickness/2])
            cube([neck_length*0.05, neck_width_nut - 2*unit, fretboard_thickness], center=true);

            translate([neck_length, 0, neck_thickness/2 + fretboard_thickness/2])
            cube([neck_length*0.05, neck_width_body - 2*unit, fretboard_thickness], center=true);
        }

        // Fret lines
        for (fret = [0:fret_count]) {
            x_pos = fret * (neck_length / fret_count);
            w = neck_width_nut + (fret/fret_count)*(neck_width_body - neck_width_nut);
            translate([x_pos, 0, neck_thickness/2 + fretboard_thickness + 0.1*unit])
            cube([1*unit, w, 0.2*unit], center=true);
        }
    }
}

// ------------------------------
// Module: Headstock + tuning pegs
// ------------------------------
module guitar_headstock() {
    rotate([headstock_pitch, 0, 0])
    union() {
        // Headstock base shape
        offset(r=6*unit)
        linear_extrude(height=neck_thickness)
        polygon(points=[
            [0, 0],
            [headstock_length*0.2, headstock_width/2],
            [headstock_length*0.85, headstock_width*0.4/2],
            [headstock_length, neck_width_nut/2],
            [headstock_length, -neck_width_nut/2],
            [headstock_length*0.85, -headstock_width*0.4/2],
            [headstock_length*0.2, -headstock_width/2],
            [0, 0]
        ]);

        // Tuning pegs (3 per side)
        for (i = [0:2]) {
            x_pos = 30*unit + i * 40*unit;
            // Treble side pegs
            translate([x_pos, headstock_width*0.35, neck_thickness])
            cylinder(h=tuner_post_h, d=tuner_post_d, center=false);
            // Bass side pegs
            translate([x_pos, -headstock_width*0.35, neck_thickness])
            cylinder(h=tuner_post_h, d=tuner_post_d, center=false);
        }
    }
}

// ------------------------------
// Module: Guitar hardware
// ------------------------------
module hardware() {
    // Two humbucker pickups
    translate([body_length*0.75, 0, body_thickness])
    cube([pickup_l, pickup_w, pickup_h], center=true);
    translate([body_length*0.6, 0, body_thickness])
    cube([pickup_l, pickup_w, pickup_h], center=true);

    // Bridge assembly
    translate([body_length*0.88, 0, body_thickness + bridge_h/2])
    cube([bridge_l, bridge_w, bridge_h], center=true);

    // Control knobs (4 total)
    knob_positions = [
        [body_length*0.35, body_max_width*0.35],
        [body_length*0.25, body_max_width*0.38],
        [body_length*0.35, body_max_width*0.45],
        [body_length*0.25, body_max_width*0.48]
    ];
    for (pos = knob_positions) {
        translate([pos[0], pos[1], body_thickness])
        cylinder(h=knob_h, d=knob_d, center=false);
    }

    // Toggle switch
    translate([body_length*0.45, body_max_width*0.3, body_thickness])
    cylinder(h=knob_h*0.8, d=knob_d*0.7, center=false);

    // Output jack
    translate([body_length*0.1, -body_max_width*0.48, body_thickness/2])
    rotate([0,90,0])
    cylinder(h=20*unit, d=10*unit, center=true);

    // 6 Strings
    string_spacing_nut = (neck_width_nut - 10*unit)/5;
    string_spacing_bridge = (bridge_w - 10*unit)/5;
    for (s = [0:5]) {
        y_nut = - (neck_width_nut - 10*unit)/2 + s*string_spacing_nut;
        y_bridge = - (bridge_w - 10*unit)/2 + s*string_spacing_bridge;
        hull() {
            translate([headstock_length, y_nut, neck_thickness + fretboard_thickness + 1*unit])
            sphere(r=string_d/2);
            translate([headstock_length + neck_length + body_length*0.88, y_bridge, body_thickness + bridge_h + 0.5*unit])
            sphere(r=string_d/2);
        }
    }
}

// ------------------------------
// Final Assembly
// ------------------------------
translate([0,0,body_thickness/2])
union() {
    // Body placed at end of neck
    translate([headstock_length + neck_length, 0, 0])
    guitar_body();

    // Neck between headstock and body
    translate([headstock_length, 0, 0])
    guitar_neck();

    // Headstock at left end
    guitar_headstock();

    // All hardware components
    translate([headstock_length + neck_length, 0, 0])
    hardware();
}