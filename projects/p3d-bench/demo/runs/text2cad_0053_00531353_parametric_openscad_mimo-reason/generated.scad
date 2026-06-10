// Parameters
base_length = 0.75;
base_width = 0.25;
base_thickness = 0.1;
hole_radius = 0.05;
hole_y = 0.125;
hole1_x = 0.125;
hole2_x = 0.625;

upright_length = 0.35;
upright_width = 0.2;
upright_height = 0.2;
upright_x_offset = 0.2;
upright_y_offset = 0.025;

cap_rise = 0.1;

passage_radius = 0.05;
passage_y = 0.125;
passage_z_min = 0.25;
passage_z_max = 0.35;
passage_start_x = 0.2;
passage_reach = 0.444;

relief_x_span = 0.24;
relief_x_clearance = 0.255;
relief_y_start_offset = 0.025;
relief_y_reach = 0.299;
relief_z_min = 0.18;
relief_z_max = 0.45;

$fn = 100;

// Main base (obround slab)
module base() {
    // Create obround: rectangle with semicircular ends
    hull() {
        translate([base_width/2, base_width/2, 0])
            cylinder(h=base_thickness, d=base_width);
        translate([base_length - base_width/2, base_width/2, 0])
            cylinder(h=base_thickness, d=base_width);
    }
}

// Lower upright (rectangular block)
module upright() {
    translate([upright_x_offset, upright_y_offset, base_thickness])
        cube([upright_length, upright_width, upright_height]);
}

// Rounded cap (semicircular profile extruded along length)
module cap() {
    translate([upright_x_offset, upright_y_offset, base_thickness + upright_height]) {
        rotate([90, 0, 90])
            linear_extrude(height = upright_length)
                translate([0, 0, 0])
                    scale([1, cap_rise/(upright_width/2), 1])
                        circle(d=upright_width);
    }
}

// Full model with subtractions
difference() {
    union() {
        base();
        upright();
        cap();
    }
    
    // Vertical through holes in base
    translate([hole1_x, hole_y, -0.01])
        cylinder(h=base_thickness + 0.02, r=hole_radius);
    translate([hole2_x, hole_y, -0.01])
        cylinder(h=base_thickness + 0.02, r=hole_radius);
    
    // Horizontal passage through upright
    translate([passage_start_x, passage_y, (passage_z_min + passage_z_max)/2])
        rotate([0, 90, 0])
            cylinder(h=passage_reach, r=passage_radius);
    
    // Upper relief cut from front
    translate([
        relief_x_clearance,
        upright_y_offset,
        relief_z_min
    ])
        cube([
            relief_x_span,
            relief_y_reach,
            relief_z_max - relief_z_min
        ]);
}