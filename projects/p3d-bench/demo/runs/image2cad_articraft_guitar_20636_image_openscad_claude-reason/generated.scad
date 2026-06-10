// Semi-Hollow Body Electric Guitar (ES-335 Style)
// Simplified parametric model

$fn = 80;

// Overall dimensions (mm)
total_length = 1000;        // Total guitar length
scale_length = 628;         // Scale length

// Body parameters
body_length = 420;
body_width = 340;
body_thickness = 45;
body_edge_radius = 5;
cutaway_depth = 80;
cutaway_width = 100;
waist_indent = 30;

// Neck parameters
neck_length = 480;
neck_width_nut = 43;
neck_width_body = 57;
neck_thickness = 22;
fretboard_width_nut = 43;
fretboard_width_body = 57;
fretboard_thickness = 6;
num_frets = 22;

// Headstock parameters
headstock_length = 190;
headstock_width = 80;
headstock_thickness = 15;
headstock_angle = 14;

// Pickup parameters
pickup_length = 70;
pickup_width = 36;
pickup_height = 18;

// Hardware
bridge_width = 75;
tailpiece_width = 60;
knob_diameter = 18;
knob_height = 12;

// F-hole parameters
fhole_length = 80;
fhole_width = 12;

// Main assembly
guitar();

module guitar() {
    color([0.6, 0.6, 0.62]) {
        body();
        translate([0, body_length/2 - 30, body_thickness/2 - neck_thickness/2 + fretboard_thickness])
            neck();
    }
    color([0.3, 0.3, 0.32]) {
        hardware();
        fretboard();
    }
}

// Guitar body - semi-hollow style with double cutaway
module body() {
    translate([0, 0, 0])
    linear_extrude(height = body_thickness, convexity=4)
        body_outline();
}

module body_outline() {
    // Approximate ES-335 body shape using hull and boolean ops
    offset(r = body_edge_radius)
    offset(r = -body_edge_radius)
    difference() {
        union() {
            // Lower bout
            translate([0, -body_length/4 + 20, 0])
                ellipse(body_width/2, body_length/2.8);
            // Upper bout
            translate([0, body_length/4 - 30, 0])
                ellipse(body_width/2 - 20, body_length/3.2);
            // Connect bouts
            square([body_width - 80, body_length/2], center=true);
        }
        // Waist cutouts
        translate([body_width/2 + 5, 0, 0])
            ellipse(waist_indent + 10, 60);
        translate([-body_width/2 - 5, 0, 0])
            ellipse(waist_indent + 10, 60);
        // Upper cutaway (treble side)
        translate([cutaway_width/2 + 15, body_length/4 + 20, 0])
            ellipse(cutaway_width/2, cutaway_depth);
        // Upper cutaway (bass side)
        translate([-cutaway_width/2 - 15, body_length/4 + 20, 0])
            ellipse(cutaway_width/2, cutaway_depth);
    }
}

module ellipse(rx, ry) {
    scale([rx, ry]) circle(r=1);
}

// Neck
module neck() {
    // Neck shaft
    translate([0, 0, 0])
    hull() {
        translate([0, 0, 0])
            cube([neck_width_body, 1, neck_thickness], center=true);
        translate([0, neck_length, 0])
            cube([neck_width_nut, 1, neck_thickness * 0.85], center=true);
    }
    // Headstock
    translate([0, neck_length, 0])
        headstock();
}

// Fretboard
module fretboard() {
    translate([0, body_length/2 - 30, body_thickness/2 + fretboard_thickness/2]) {
        // Fretboard surface
        color([0.15, 0.1, 0.05])
        hull() {
            translate([0, 0, 0])
                cube([fretboard_width_body, 1, fretboard_thickness], center=true);
            translate([0, neck_length - 20, 0])
                cube([fretboard_width_nut, 1, fretboard_thickness], center=true);
        }
        // Frets
        color([0.8, 0.8, 0.7])
        for (i = [1:num_frets]) {
            fret_pos = neck_length * (1 - pow(2, -i/12));
            fw = fretboard_width_body - (fretboard_width_body - fretboard_width_nut) * (fret_pos / neck_length);
            translate([0, fret_pos, fretboard_thickness/2])
                cube([fw, 1.5, 1.5], center=true);
        }
    }
}

// Headstock
module headstock() {
    rotate([-headstock_angle, 0, 0])
    translate([0, headstock_length/2, 0]) {
        // Headstock body
        color([0.6, 0.6, 0.62])
        linear_extrude(height = headstock_thickness, center=true)
            headstock_shape();
        // Tuning pegs
        color([0.3, 0.3, 0.32])
        for (i = [0:2]) {
            // Treble side
            translate([headstock_width/4, 30 + i * 40, headstock_thickness/2])
                tuning_peg();
            // Bass side
            translate([-headstock_width/4, 30 + i * 40, headstock_thickness/2])
                tuning_peg();
        }
    }
}

module headstock_shape() {
    hull() {
        translate([0, -headstock_length/2 + 10, 0])
            square([neck_width_nut, 10], center=true);
        translate([0, headstock_length/2 - 30, 0])
            ellipse(headstock_width/2, 30);
    }
}

module tuning_peg() {
    // Post
    cylinder(h = 8, d = 6);
    // Button
    translate([12, 0, 4])
        rotate([0, 90, 0])
            cylinder(h = 16, d = 8, center=true);
}

// Hardware (pickups, bridge, knobs, etc.)
module hardware() {
    // Neck pickup
    translate([0, 40, body_thickness])
        pickup();
    // Bridge pickup
    translate([0, -50, body_thickness])
        pickup();
    // Bridge
    translate([0, -100, body_thickness])
        bridge();
    // Tailpiece
    translate([0, -150, body_thickness])
        tailpiece();
    // F-holes
    translate([60, -20, body_thickness - 1])
        fhole();
    translate([-60, -20, body_thickness - 1])
        mirror([1, 0, 0]) fhole();
    // Control knobs (2 volume, 2 tone)
    translate([80, -100, body_thickness])
        knob();
    translate([80, -150, body_thickness])
        knob();
    translate([100, -60, body_thickness])
        knob();
    translate([100, -120, body_thickness])
        knob();
    // Pickup selector switch
    translate([-90, 60, body_thickness])
        cylinder(h = 15, d = 8);
    // Output jack
    translate([100, -180, body_thickness/2])
        rotate([0, 90, 0])
            cylinder(h = 10, d = 12);
}

module pickup() {
    // Pickup housing
    difference() {
        cube([pickup_width, pickup_length, pickup_height], center=true);
        translate([0, 0, 5])
            cube([pickup_width - 6, pickup_length - 6, pickup_height], center=true);
    }
    // Pole pieces
    for (i = [0:5]) {
        translate([-pickup_width/2 + 6 + i * (pickup_width - 12)/5, 0, pickup_height/2])
            cylinder(h = 3, d = 4);
    }
    // Pickup ring
    difference() {
        cube([pickup_width + 10, pickup_length + 10, 4], center=true);
        cube([pickup_width - 2, pickup_length - 2, 5], center=true);
    }
}

module bridge() {
    // Bridge base
    hull() {
        translate([-bridge_width/2, 0, 0])
            cylinder(h = 10, d = 12);
        translate([bridge_width/2, 0, 0])
            cylinder(h = 10, d = 12);
    }
    // Saddles
    translate([0, 0, 10])
        cube([bridge_width - 5, 8, 4], center=true);
}

module tailpiece() {
    // Tailpiece body
    hull() {
        translate([-tailpiece_width/2, 0, 0])
            cylinder(h = 8, d = 10);
        translate([tailpiece_width/2, 0, 0])
            cylinder(h = 8, d = 10);
    }
    // String holes
    for (i = [0:5]) {
        translate([-tailpiece_width/2 + 8 + i * (tailpiece_width - 16)/5, 0, 8])
            cylinder(h = 3, d = 2);
    }
}

module fhole() {
    // Simplified f-hole shape
    linear_extrude(height = 2) {
        // Main S-curve approximation
        union() {
            translate([0, fhole_length/4, 0])
                ellipse(fhole_width/2, fhole_length/4);
            translate([0, -fhole_length/4, 0])
                ellipse(fhole_width/2, fhole_length/4);
            square([fhole_width/2, fhole_length/2], center=true);
        }
    }
}

module knob() {
    // Knob body
    cylinder(h = knob_height, d = knob_diameter);
    // Knob top detail
    translate([0, 0, knob_height])
        cylinder(h = 2, d = knob_diameter - 4);
}

// Strings (decorative)
module strings() {
    color([0.9, 0.9, 0.85])
    for (i = [0:5]) {
        x_offset = -12.5 + i * 5;
        translate([x_offset, -170, body_thickness + 14])
            rotate([-90, 0, 0])
                cylinder(h = neck_length + body_length/2 + 100, d = 0.5 + i * 0.2);
    }
}

strings();