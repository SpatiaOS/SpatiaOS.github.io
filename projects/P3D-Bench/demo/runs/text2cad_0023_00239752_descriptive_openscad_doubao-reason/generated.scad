// ==============================
// Parametric Dimensions
// ==============================
// Base plate dimensions
base_length = 150;    // [mm] Length of rectangular base
base_width = 60;      // [mm] Width of rectangular base
base_thickness = 8;   // [mm] Thickness of base plate

// Raised rib dimensions
rib_height = 6;       // [mm] Height of ribs above base surface
rib_width = 8;        // [mm] Width of each rib
rib_spacing = 20;     // [mm] Gap between the two parallel ribs

// Stepped hole dimensions
num_holes = 3;        // Number of circular cutouts
recess_dia = 16;      // [mm] Diameter of shallow upper recess
recess_depth = 3;     // [mm] Depth of shallow upper recess
through_hole_dia = 8; // [mm] Diameter of deeper lower through hole
hole_edge_offset = 20;// [mm] Distance from base end to first/last hole center

// Render resolution
$fn = 100;

// ==============================
// Module Definitions
// ==============================
module stepped_hole(recess_d, recess_dp, hole_d, total_dp) {
    // Generates a stepped hole with wide shallow recess and narrow deep through hole
    // Upper recess cut from top surface
    translate([0, 0, total_dp - recess_dp/2])
    cylinder(d=recess_d, h=recess_dp, center=true);
    // Lower through hole extending full base thickness
    translate([0, 0, total_dp/2])
    cylinder(d=hole_d, h=total_dp, center=true);
}

// ==============================
// Main Model Assembly
// ==============================
difference() {
    // Combine base plate and raised ribs
    union() {
        // Thin rectangular base plate
        cube([base_length, base_width, base_thickness]);

        // Two lengthwise raised ribs
        rib_y_centers = [
            (base_width - rib_spacing)/2 - rib_width/2,
            (base_width + rib_spacing)/2 + rib_width/2
        ];
        for (rib_y = rib_y_centers) {
            translate([0, rib_y, base_thickness])
            cube([base_length, rib_width, rib_height]);
        }
    }

    // Cut three stepped holes into base plate
    hole_x_positions = [
        hole_edge_offset,
        base_length / 2,
        base_length - hole_edge_offset
    ];
    for (hole_x = hole_x_positions) {
        translate([hole_x, base_width/2, 0])
        stepped_hole(recess_dia, recess_depth, through_hole_dia, base_thickness);
    }
}