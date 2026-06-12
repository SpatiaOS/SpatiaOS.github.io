// Parameters
outer_radius = 50;          // Outer radius of the main annular ring
inner_radius = 20;          // Inner radius (center open hole)
base_thickness = 8;         // Thickness of the main outer ring (deepest tier)
collar_outer_radius = 35;   // Outer radius of the hollow collar
collar_height = 4;          // Height of the collar and ribs (shallower tier)
rib_count = 8;              // Number of radial ribs
rib_width = 4;              // Width (diameter) of each rib's rounded ends
$fn = 100;                  // Smooth curved surfaces

// Module for the main outer ring (thick annular base)
module main_ring() {
    difference() {
        cylinder(h = base_thickness, r = outer_radius);
        cylinder(h = base_thickness, r = inner_radius);
    }
}

// Module for the hollow collar (raised, shallower tier)
module collar() {
    translate([0, 0, base_thickness])
    difference() {
        cylinder(h = collar_height, r = collar_outer_radius);
        cylinder(h = collar_height, r = inner_radius);
    }
}

// Module for one radial rib (rounded capsule shape)
module rib(angle) {
    rotate([0, 0, angle])
    translate([collar_outer_radius, 0, base_thickness])
    linear_extrude(height = collar_height)
    hull() {
        circle(d = rib_width);
        translate([outer_radius - collar_outer_radius, 0, 0])
        circle(d = rib_width);
    }
}

// Module for all ribs evenly spaced
module ribs() {
    for (i = [0 : rib_count - 1]) {
        rib(i * 360 / rib_count);
    }
}

// Assemble the complete part
union() {
    main_ring();   // Thick outer ring
    collar();      // Hollow raised collar
    ribs();        // Radial ribs with rounded ends, leaving rounded slot windows
}