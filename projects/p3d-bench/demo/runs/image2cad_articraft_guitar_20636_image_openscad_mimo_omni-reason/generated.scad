// Parametric Electric Guitar Model
// All dimensions in millimeters, scaled to approximate full-size guitar

// --------------------------
// Global Parameters
// --------------------------
$fn = 100; // Smooth curves for organic shapes

// Overall Dimensions
total_length = 1000;
body_length = 400;
body_width = 350;
body_thickness = 50;

// Neck Dimensions
neck_length = total_length - body_length;
neck_width_top = 50;  // Width at headstock joint
neck_width_bottom = 70; // Width at body joint
neck_thickness = 30;

// Headstock Dimensions
headstock_length = 150;
headstock_width = 80;
headstock_thickness = 20;

// Fretboard
fret_count = 22;
fret_width = 3;
fret_height = 2;

// Hardware
pickup_width = 150;
pickup_length = 80;
pickup_thickness = 10;
bridge_length = 120;
bridge_width = 30;
bridge_thickness = 15;
knob_diameter = 20;
knob_height = 15;
tuning_peg_diameter = 10;
tuning_peg_length = 30;

// F-holes (semi-hollow body feature)
fhole_width = 80;
fhole_height = 150;
fhole_thickness = 5;

// --------------------------
// Helper Modules
// --------------------------
// Rounded rectangle for smooth body edges
module rounded_rect(w, h, d, r) {
    minkowski() {
        cube([w - 2*r, h - 2*r, d], center=true);
        sphere(r);
    }
}

// Single Fret
module fret() {
    cube([fret_width, neck_width_bottom, fret_height], center=true);
}

// Single Pickup
module pickup() {
    cube([pickup_length, pickup_width, pickup_thickness], center=true);
}

// Single Knob
module knob() {
    cylinder(h=knob_height, d=knob_diameter, center=true);
}

// Single Tuning Peg
module tuning_peg() {
    union() {
        cylinder(h=tuning_peg_length, d=tuning_peg_diameter, center=true);
        translate([0,0,tuning_peg_length/2])
            cylinder(h=5, d=tuning_peg_diameter*1.5, center=true);
    }
}

// F-hole shape (stylized S-curve)
module fhole() {
    linear_extrude(height=fhole_thickness, center=true)
        offset(r=5)
            polygon(points=[
                [-fhole_width/2, -fhole_height/2],
                [-fhole_width/2, fhole_height/2],
                [fhole_width/2, fhole_height/2],
                [fhole_width/2, fhole_height/4],
                [0, 0],
                [fhole_width/2, -fhole_height/4],
                [fhole_width/2, -fhole_height/2]
            ]);
}

// --------------------------
// Main Components
// --------------------------
module guitar_body() {
    difference() {
        // Main body shape (rounded rectangle)
        rounded_rect(body_width, body_length, body_thickness, 20);
        
        // F-holes (two symmetric)
        translate([body_width/3, 0, 0])
            fhole();
        translate([-body_width/3, 0, 0])
            mirror([1,0,0])
                fhole();
    }
    
    // Pickups
    translate([0, -body_length/4, body_thickness/2])
        pickup();
    translate([0, -body_length/4 + pickup_length + 20, body_thickness/2])
        pickup();
    
    // Bridge
    translate([0, body_length/4, body_thickness/2])
        cube([bridge_length, bridge_width, bridge_thickness], center=true);
    
    // Knobs (4 total)
    for (i = [0,1,2,3]) {
        translate([
            body_width/3 - i*20,
            body_length/3,
            body_thickness/2 + knob_height/2
        ])
            knob();
    }
}

module guitar_neck() {
    // Tapered neck shape
    hull() {
        translate([0, 0, 0])
            cube([neck_width_bottom, neck_length, neck_thickness], center=true);
        translate([0, neck_length/2, 0])
            cube([neck_width_top, neck_length, neck_thickness], center=true);
    }
    
    // Frets
    for (i = [0:fret_count-1]) {
        translate([
            0,
            -neck_length/2 + (neck_length/fret_count)*i + neck_length/(fret_count*2),
            neck_thickness/2
        ])
            fret();
    }
}

module guitar_headstock() {
    translate([0, neck_length/2 + headstock_length/2, 0]) {
        // Headstock base
        cube([headstock_width, headstock_length, headstock_thickness], center=true);
        
        // Tuning pegs (6 total, 3 per side)
        for (side = [0,1]) {
            for (i = [0,1,2]) {
                translate([
                    (side ? -1 : 1) * (headstock_width/2 + tuning_peg_length/2),
                    -headstock_length/3 + i*(headstock_length/3),
                    0
                ])
                    tuning_peg();
            }
        }
    }
}

// --------------------------
// Assemble Full Guitar
// --------------------------
module electric_guitar() {
    union() {
        guitar_body();
        translate([0, -body_length/2 - neck_length/2, 0])
            guitar_neck();
        translate([0, -body_length/2 - neck_length, 0])
            guitar_headstock();
    }
}

// Render the full model
electric_guitar();