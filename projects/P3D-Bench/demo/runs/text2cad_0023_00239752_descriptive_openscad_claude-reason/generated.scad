// Parametric Rectangular Base with Ribs and Stepped Holes

// === Base Plate Parameters ===
base_length = 120;        // Length of the rectangular base (X)
base_width = 50;          // Width of the rectangular base (Y)
base_thickness = 5;       // Thickness of the base plate (Z)

// === Rib Parameters ===
rib_length = 100;         // Length of each rib along X
rib_width = 5;            // Width of each rib (Y)
rib_height = 4;           // Height of ribs above base top surface
rib_offset_y = 12;        // Distance from centerline to each rib center
rib_offset_x = 0;        // X offset for centering ribs on base

// === Hole Parameters (stepped counterbore style) ===
hole_diameter_upper = 10; // Diameter of the shallow upper recess
hole_depth_upper = 2;     // Depth of the upper recess from top surface
hole_diameter_lower = 6;  // Diameter of the deeper through hole
hole_depth_lower = base_thickness; // Lower hole goes through the base

// === Hole Positions (X, Y relative to base center) ===
// Three holes near the ends of the plate
hole1_pos = [-45, 0];    // Near left end, centered
hole2_pos = [45, -12];   // Near right end, lower
hole3_pos = [45, 12];    // Near right end, upper

// === Resolution ===
$fn = 80;

// --- Module: Stepped Hole (counterbore) ---
// Creates a stepped circular cut with shallow recess on top
// and a deeper narrower hole below
module stepped_hole(d_upper, depth_upper, d_lower, depth_lower) {
    union() {
        // Upper shallow recess (wider)
        translate([0, 0, -depth_upper])
            cylinder(h = depth_upper + 0.01, d = d_upper);
        // Lower deeper hole (narrower), extends down from top surface
        translate([0, 0, -depth_lower - 0.01])
            cylinder(h = depth_lower + 0.02, d = d_lower);
    }
}

// --- Module: Rib ---
// A solid raised rectangular rib on top of the base
module rib(length, width, height) {
    cube([length, width, height], center = false);
}

// --- Main Assembly ---
difference() {
    union() {
        // Base plate centered at origin in XY, bottom at Z=0
        translate([-base_length/2, -base_width/2, 0])
            cube([base_length, base_width, base_thickness]);

        // Rib 1 - offset in +Y direction, on top of base
        translate([-rib_length/2 + rib_offset_x, rib_offset_y - rib_width/2, base_thickness])
            rib(rib_length, rib_width, rib_height);

        // Rib 2 - offset in -Y direction, on top of base
        translate([-rib_length/2 + rib_offset_x, -rib_offset_y - rib_width/2, base_thickness])
            rib(rib_length, rib_width, rib_height);
    }

    // Stepped holes - cut from the top surface of the base
    // Hole 1: near left end
    translate([hole1_pos[0], hole1_pos[1], base_thickness])
        stepped_hole(hole_diameter_upper, hole_depth_upper,
                     hole_diameter_lower, hole_depth_lower);

    // Hole 2: near right end, lower position
    translate([hole2_pos[0], hole2_pos[1], base_thickness])
        stepped_hole(hole_diameter_upper, hole_depth_upper,
                     hole_diameter_lower, hole_depth_lower);

    // Hole 3: near right end, upper position
    translate([hole3_pos[0], hole3_pos[1], base_thickness])
        stepped_hole(hole_diameter_upper, hole_depth_upper,
                     hole_diameter_lower, hole_depth_lower);
}