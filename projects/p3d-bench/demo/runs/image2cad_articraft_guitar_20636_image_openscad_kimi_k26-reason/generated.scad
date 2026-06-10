// Semi-Hollow Electric Guitar
// Parametric OpenSCAD model approximating an archtop electric guitar

// Resolution
$fn = 60;

// --- Overall Dimensions ---
scale_length = 628.65;          // 24.75 inches (Gibson-style)
body_thickness = 45;
neck_joint_x = 300;             // Where neck meets body
nut_x = 0;

// --- Neck Dimensions ---
neck_length = 300;              // Nut to heel
nut_width = 43;
heel_width = 56;
neck_thickness = 20;
neck_bottom_z = 19;             // Neck back sits inside body volume
neck_top_z = neck_bottom_z + neck_thickness; // 39

// --- Fretboard Dimensions ---
fretboard_thickness = 6;
fretboard_top_z = neck_top_z + fretboard_thickness; // 45
fretboard_end_x = 450;          // Fretboard extends onto body
fretboard_nut_width = 45;       // Slightly wider than nut
fretboard_end_width = 64;

// --- Headstock Dimensions ---
headstock_length = 150;
headstock_width = 80;
headstock_angle = 15;           // Degrees back from vertical

// --- Hardware Dimensions ---
bridge_x = scale_length;        // Bridge location
bridge_length = 74;             // Across the strings
bridge_width = 12;
bridge_height = 10;

tailpiece_x = bridge_x + 40;
tailpiece_length = 90;
tailpiece_width = 12;

pickup_width = 18;
pickup_length = 90;             // Across strings
pickup_height = 15;
neck_pickup_x = 400;
bridge_pickup_x = 560;

knob_diameter = 12;
knob_height = 15;

switch_diameter = 8;
switch_height = 12;

string_diameter = 0.6;

// --- Body Outline Points [x, y] ---
// Traced counter-clockwise from neck joint top
body_points = [
    [neck_joint_x, 28],
    [neck_joint_x + 20, 60],
    [neck_joint_x + 50, 100],
    [neck_joint_x + 80, 120],
    // Cutaway horn
    [neck_joint_x + 120, 130],
    [neck_joint_x + 140, 120],
    // Cutaway scoop
    [neck_joint_x + 130, 90],
    [neck_joint_x + 110, 70],
    // Waist
    [neck_joint_x + 160, 65],
    [neck_joint_x + 200, 75],
    // Lower bout top
    [neck_joint_x + 280, 130],
    [neck_joint_x + 350, 160],
    [neck_joint_x + 420, 150],
    // Tail end
    [neck_joint_x + 460, 120],
    [neck_joint_x + 460, -120],
    // Lower bout bottom
    [neck_joint_x + 420, -150],
    [neck_joint_x + 350, -160],
    [neck_joint_x + 280, -130],
    // Waist bottom
    [neck_joint_x + 200, -75],
    [neck_joint_x + 160, -65],
    // Upper bout bottom (smooth side)
    [neck_joint_x + 110, -110],
    [neck_joint_x + 80, -120],
    [neck_joint_x + 50, -100],
    [neck_joint_x + 20, -60],
    [neck_joint_x, -28]
];

// --- Helper Functions ---
// Calculate fret distance from nut for fret number n (1-indexed)
function fret_pos(n) = scale_length * (1 - pow(2, -n / 12));

// Interpolate fretboard width at a given x along the fretboard
function fretboard_width_at(x) = 
    fretboard_nut_width + (fretboard_end_width - fretboard_nut_width) * (x / fretboard_end_x);

// --- Modules ---

module body_solid() {
    linear_extrude(height = body_thickness)
    polygon(body_points);
}

module f_hole_shape() {
    // Simplified f-hole profile
    linear_extrude(height = body_thickness + 2, center = true)
    polygon([
        [-2, -25], [2, -22], [1, -12], [-3, -2], [1, 8], [2, 18], [-2, 25],
        [-5, 22], [-3, 12], [-7, 2], [-3, -8], [-5, -18], [-2, -25]
    ]);
}

module body() {
    difference() {
        body_solid();
        // Top f-hole
        translate([520, 50, body_thickness / 2])
            rotate([0, 0, -15])
            f_hole_shape();
        // Bottom f-hole (mirrored)
        translate([520, -50, body_thickness / 2])
            rotate([0, 0, 15])
            f_hole_shape();
    }
}

module neck_back() {
    // Tapered neck back from nut to heel
    hull() {
        translate([neck_joint_x, 0, neck_bottom_z + neck_thickness / 2])
            cube([1, heel_width, neck_thickness], center = true);
        translate([nut_x, 0, neck_bottom_z + neck_thickness / 2])
            cube([1, nut_width, neck_thickness], center = true);
    }
}

module fretboard() {
    // Tapered fretboard over neck and body extension
    hull() {
        translate([fretboard_end_x, 0, neck_top_z + fretboard_thickness / 2])
            cube([1, fretboard_end_width, fretboard_thickness], center = true);
        translate([nut_x, 0, neck_top_z + fretboard_thickness / 2])
            cube([1, fretboard_nut_width, fretboard_thickness], center = true);
    }
}

module headstock() {
    // Angled back headstock with tuner posts
    translate([0, 0, neck_top_z])
    rotate([0, -headstock_angle, 0])
    translate([0, 0, -neck_thickness])
    union() {
        // Main headstock slab
        hull() {
            translate([0, -heel_width / 2, 0])
                cube([1, heel_width, neck_thickness]);
            translate([-headstock_length, -headstock_width / 2, 0])
                cube([1, headstock_width, neck_thickness]);
        }
        
        // Tuner posts (3 per side)
        for (i = [0:2]) {
            x = -50 - i * 35;
            // Right side (extends outward in +Y)
            translate([x, headstock_width / 2 - 5, neck_thickness])
                rotate([-90, 0, 0])
                cylinder(h = 15, d = 6);
            // Left side (extends outward in -Y)
            translate([x, -(headstock_width / 2 - 5), neck_thickness])
                rotate([90, 0, 0])
                cylinder(h = 15, d = 6);
        }
    }
}

module frets() {
    color("silver") {
        for (n = [1:22]) {
            x = fret_pos(n);
            if (x <= fretboard_end_x) {
                w = fretboard_width_at(x) + 2; // Slight overhang for visibility
                translate([x, 0, fretboard_top_z])
                    cube([0.8, w, 0.5], center = true);
            }
        }
    }
}

module fret_markers() {
    color("white") {
        for (fret = [3, 5, 7, 9, 12, 15, 17, 19, 21]) {
            x = (fret_pos(fret) + fret_pos(fret - 1)) / 2;
            if (x <= fretboard_end_x) {
                w = fretboard_width_at(x);
                if (fret == 12) {
                    translate([x, -w / 4, fretboard_top_z + 0.5])
                        sphere(d = 3);
                    translate([x, w / 4, fretboard_top_z + 0.5])
                        sphere(d = 3);
                } else {
                    translate([x, 0, fretboard_top_z + 0.5])
                        sphere(d = 3);
                }
            }
        }
    }
}

module pickup(x_pos) {
    color("black")
    translate([x_pos, 0, body_thickness])
        linear_extrude(height = pickup_height)
        square([pickup_width, pickup_length], center = true);
}

module bridge() {
    color("silver")
    translate([bridge_x, 0, body_thickness])
        linear_extrude(height = bridge_height)
        square([bridge_width, bridge_length], center = true);
}

module tailpiece() {
    color("silver")
    translate([tailpiece_x, 0, body_thickness])
        linear_extrude(height = 8)
        square([tailpiece_width, tailpiece_length], center = true);
}

module knobs() {
    // Four knobs in a slight zig-zag pattern on lower bout
    positions = [
        [550, -90],
        [580, -100],
        [610, -90],
        [640, -100]
    ];
    color("black") {
        for (pos = positions) {
            translate([pos[0], pos[1], body_thickness])
                cylinder(h = knob_height, d = knob_diameter);
        }
    }
}

module toggle_switch() {
    color("silver")
    translate([480, 80, body_thickness])
        cylinder(h = switch_height, d = switch_diameter);
}

module strings() {
    color([0.75, 0.75, 0.75]) {
        for (i = [0:5]) {
            // String spacing at bridge and nut
            yb = -25 + i * 10;
            yn = -21.5 + i * 8.6;
            
            // Segment from bridge to nut
            hull() {
                translate([bridge_x, yb, body_thickness + bridge_height + 1])
                    sphere(d = string_diameter);
                translate([nut_x, yn, fretboard_top_z + 1])
                    sphere(d = string_diameter);
            }
            
            // Short segment behind nut toward headstock
            hull() {
                translate([nut_x, yn, fretboard_top_z + 1])
                    sphere(d = string_diameter);
                translate([-40, yn * 1.2, 30])
                    sphere(d = string_diameter);
            }
        }
    }
}

// --- Assembly ---
union() {
    // Main wooden parts
    body();
    neck_back();
    fretboard();
    headstock();
    
    // Metal and hardware
    pickup(neck_pickup_x);
    pickup(bridge_pickup_x);
    bridge();
    tailpiece();
    knobs();
    toggle_switch();
    
    // Details
    frets();
    fret_markers();
    strings();
}