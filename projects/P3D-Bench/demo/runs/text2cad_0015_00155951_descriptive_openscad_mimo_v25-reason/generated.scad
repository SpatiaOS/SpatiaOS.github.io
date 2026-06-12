// Parametric Arc-Based Plate with Tabs and Collar
// All dimensions in millimeters

// --- Main Parameters ---
plate_length = 60;        // Length of plate (x-axis)
plate_width = 30;         // Width of plate (y-axis)
plate_height = 4;         // Height/thickness of main plate
central_hole_d = 12;      // Diameter of central through hole
collar_height = 2;        // Height of annular collar
collar_thickness = 3;     // Wall thickness of collar
tab_height = 15;          // Height of end tabs
tab_width = 10;           // Width of tabs (y-axis)
tab_length = 12;          // Length of tabs (x-axis)
tab_hole_d = 5;           // Diameter of tab through holes
edge_radius = 8;          // Radius for rounded ends of plate
$fn = 100;                // Smooth curves

// --- Helper Modules ---
module rounded_plate(length, width, height, radius) {
    // Create plate with rounded ends using hull of two cylinders
    hull() {
        translate([length/2 - radius, 0, 0])
            cylinder(h=height, r=radius, center=false);
        translate([-length/2 + radius, 0, 0])
            cylinder(h=height, r=radius, center=false);
    }
}

module annular_collar(outer_d, inner_d, height) {
    // Create hollow ring (annular collar)
    difference() {
        cylinder(h=height, d=outer_d, center=false);
        translate([0, 0, -0.1])
            cylinder(h=height + 0.2, d=inner_d, center=false);
    }
}

module rounded_tab(width, length, height, hole_d) {
    // Create rounded tab with through hole
    difference() {
        // Rounded rectangular tab using hull of four spheres
        hull() {
            translate([-length/2 + 2, -width/2 + 2, 0])
                sphere(r=2);
            translate([length/2 - 2, -width/2 + 2, 0])
                sphere(r=2);
            translate([-length/2 + 2, width/2 - 2, 0])
                sphere(r=2);
            translate([length/2 - 2, width/2 - 2, 0])
                sphere(r=2);
            // Extrude to full height
            translate([0, 0, height])
                cube([length-4, width-4, 0.01], center=true);
        }
        // Through hole in tab
        translate([0, 0, -0.1])
            cylinder(h=height + 0.2, d=hole_d, center=false);
    }
}

// --- Main Assembly ---
union() {
    // Main plate with central hole
    difference() {
        // Create rounded plate
        rounded_plate(plate_length, plate_width, plate_height, edge_radius);
        
        // Central through hole
        translate([0, 0, -0.1])
            cylinder(h=plate_height + 0.2, d=central_hole_d, center=false);
    }
    
    // Annular collar on underside
    translate([0, 0, -collar_height])
        annular_collar(central_hole_d + 2*collar_thickness, 
                      central_hole_d, 
                      collar_height);
    
    // End tabs with holes
    translate([plate_length/2 - edge_radius - tab_length/2, 0, plate_height])
        rounded_tab(tab_width, tab_length, tab_height, tab_hole_d);
    
    translate([-plate_length/2 + edge_radius + tab_length/2, 0, plate_height])
        rounded_tab(tab_width, tab_length, tab_height, tab_hole_d);
}