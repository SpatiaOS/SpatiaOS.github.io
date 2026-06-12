// === Parametric Variables ===
base_length = 80;
base_width = 40;
base_thickness = 5;

rib_height = 4;
rib_width = 4;
rib_margin = 12; // inset from each end for rib length
rib_spacing = 22; // center-to-center distance between ribs

hole_upper_dia = 8;   // diameter of shallow upper recess
hole_lower_dia = 4.5;  // diameter of deeper through-hole
hole_upper_depth = 2;  // depth of shallow recess from top surface
hole_through = base_thickness + rib_height + 2; // total cut depth (clears everything)

// X positions of the three holes (near the ends)
hole_x1 = 15;
hole_x2 = 40;
hole_x3 = 65;
// Y position centered on base width
hole_y_offset = 0;

$fn = 100;

// === Main Assembly ===
difference() {
    union() {
        // Base plate
        base_plate();
        // Two lengthwise ribs on top face
        ribs();
    }
    // Subtract the three stepped circular openings
    stepped_holes();
}

// === Module: Base Plate ===
module base_plate() {
    cube([base_length, base_width, base_thickness], center=true);
}

// === Module: Two Parallel Lengthwise Ribs ===
module ribs() {
    rib_length = base_length - 2 * rib_margin;
    // Translate ribs to sit on top of base plate
    translate([0, -rib_spacing/2, base_thickness/2])
        rib(rib_length);
    translate([0, rib_spacing/2, base_thickness/2])
        rib(rib_length);
}

module rib(length) {
    translate([0, 0, rib_height/2])
        cube([length, rib_width, rib_height], center=true);
}

// === Module: Three Stepped Holes ===
module stepped_holes() {
    positions = [hole_x1, hole_x2, hole_x3];
    for (i = [0:len(positions)-1]) {
        translate([positions[i], hole_y_offset, 0])
            stepped_hole();
    }
}

module stepped_hole() {
    top_z = base_thickness/2 + rib_height + 1; // start above top of ribs
    bottom_z = -(base_thickness/2 + 1);         // go below bottom of base

    // Shallow upper recess (wider, from top surface down)
    translate([0, 0, top_z])
        cylinder(h=hole_upper_depth + 1, d=hole_upper_dia, center=false);

    // Deep through-hole (narrower, cuts entirely through)
    translate([0, 0, top_z - hole_upper_depth])
        cylinder(h=top_z - bottom_z + hole_upper_depth + 1,
                 d=hole_lower_dia, center=false);
}