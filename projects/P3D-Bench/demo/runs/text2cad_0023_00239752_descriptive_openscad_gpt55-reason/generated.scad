// Parameters
$fn = 96;
eps = 0.02;

// Base plate
plate_length = 100;
plate_width = 42;
plate_thickness = 4;

// Raised lengthwise ribs
rib_length = 84;
rib_width = 4;
rib_height = 3;
rib_center_spacing = 27;

// Stepped circular cuts
hole_through_diameter = 5;
hole_recess_diameter = 10;
hole_recess_depth = 1.6;
hole_end_offset = 14;
hole_pair_spacing = 12;

// Hole layout: two near one end, one near the other
hole_x = plate_length / 2 - hole_end_offset;
hole_centers = [
    [-hole_x, -hole_pair_spacing / 2],
    [-hole_x,  hole_pair_spacing / 2],
    [ hole_x,  0]
];

// Base plate solid
module base_plate() {
    translate([0, 0, plate_thickness / 2])
        cube([plate_length, plate_width, plate_thickness], center=true);
}

// One raised rib on the top face
module raised_rib(y_pos) {
    translate([0, y_pos, plate_thickness + rib_height / 2])
        cube([rib_length, rib_width, rib_height], center=true);
}

// Pair of raised lengthwise ribs
module raised_ribs() {
    for (y_pos = [-rib_center_spacing / 2, rib_center_spacing / 2])
        raised_rib(y_pos);
}

// Stepped circular opening: shallow top recess plus deeper through cut
module stepped_hole(x_pos, y_pos) {
    translate([x_pos, y_pos, plate_thickness / 2])
        cylinder(h=plate_thickness + 2 * eps, d=hole_through_diameter, center=true);

    translate([x_pos, y_pos, plate_thickness - hole_recess_depth / 2 + eps / 2])
        cylinder(h=hole_recess_depth + eps, d=hole_recess_diameter, center=true);
}

// All circular cuts
module all_stepped_holes() {
    for (p = hole_centers)
        stepped_hole(p[0], p[1]);
}

// Main model
difference() {
    union() {
        base_plate();
        raised_ribs();
    }

    all_stepped_holes();
}