// OpenSCAD code for the mechanical assembly (simplified approximation)
// Parameters (adjustable for different sizes)
$fn = 100;  // Smoothness for curved surfaces

// Base dimensions
base_length = 100;    // Length of the main base
base_width = 50;      // Width of the main base
base_thickness = 10;  // Thickness of the base

// Sphere knobs (two on either end)
sphere_diameter = 20;    // Diameter of the spherical knobs
sphere_base_dia = 15;    // Diameter of the sphere's cylindrical base
sphere_base_height = 5;  // Height of the sphere's base

// Central mechanism
central_guide_height = 30;  // Height of the vertical guide cylinder
central_guide_dia = 10;     // Diameter of the central guide
screw_diameter = 5;         // Diameter of the screw (threaded part)
screw_length = 40;          // Length of the screw
knob_diameter = 15;         // Diameter of the screw's knob
knob_height = 10;           // Height of the screw's knob

// Mounting holes
mount_hole_dia = 8;  // Diameter of mounting holes


// Module: Base with rounded edges and central cutout
module base_plate() {
    // 2D shape for the base (rounded rectangle)
    base_2d = [
        [0, 0], [base_length, 0], [base_length, base_width], [0, base_width]
    ];
    // 2D shape for the central cutout (rounded rectangle)
    cutout_2d = [
        [10, 10], [base_length - 10, 10], [base_length - 10, base_width - 10], [10, base_width - 10]
    ];
    // Extrude the base with rounded edges
    linear_extrude(base_thickness, center=true) {
        difference() {
            // Rounded base
            offset(r=5) {
                polygon(base_2d);
            }
            // Rounded central cutout
            offset(r=5) {
                polygon(cutout_2d);
            }
        }
    }
    // Add mounting holes (through holes)
    for (x = [10, base_length - 10], y = [10, base_width - 10]) {
        translate([x, y, 0]) {
            cylinder(h=base_thickness + 1, d=mount_hole_dia, center=true);
        }
    }
    // Central hole for the mechanism
    translate([base_length/2, base_width/2, 0]) {
        cylinder(h=base_thickness + 1, d=central_guide_dia, center=true);
    }
}

// Module: Sphere knob with base and top hole
module sphere_knob(d, base_d, base_h) {
    // Sphere with a top hole (detail)
    difference() {
        sphere(d=d, $fn=100);
        // Top hole (small cylinder)
        translate([0, 0, d/2 - 2]) {
            cylinder(h=2, d=d/5, center=true);
        }
    }
    // Cylindrical base for the sphere
    translate([0, 0, -base_h]) {
        cylinder(h=base_h, d=base_d, center=true);
    }
}

// Module: Central mechanism (guide, screw, knob)
module central_mechanism() {
    // Vertical guide cylinder
    cylinder(h=central_guide_height, d=central_guide_dia, center=true);
    // Screw (threaded, represented as a cylinder)
    translate([0, 0, central_guide_height/2]) {
        cylinder(h=screw_length, d=screw_diameter, center=true);
    }
    // Knob on the screw (hexagonal for knurling effect)
    translate([0, 0, central_guide_height/2 + screw_length/2]) {
        rotate([0, 0, 30]) {
            cylinder(h=knob_height, d=knob_diameter, center=true, $fn=6);
        }
    }
    // Clamp around the guide (simplified)
    translate([0, 0, 0]) {
        cylinder(h=central_guide_height/2, d=central_guide_dia + 10, center=true);
    }
}


// Main assembly: Union of all components
union() {
    // Base plate
    base_plate();
    
    // Sphere knobs on either end
    translate([10, base_width/2, base_thickness/2 + sphere_base_height]) {
        sphere_knob(sphere_diameter, sphere_base_dia, sphere_base_height);
    }
    translate([base_length - 10, base_width/2, base_thickness/2 + sphere_base_height]) {
        sphere_knob(sphere_diameter, sphere_base_dia, sphere_base_height);
    }
    
    // Central mechanism
    translate([base_length/2, base_width/2, base_thickness/2 + central_guide_height/2]) {
        central_mechanism();
    }
}