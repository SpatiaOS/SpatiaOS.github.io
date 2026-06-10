// Parametric dimensions
length = 0.75;
width = 0.21875;
height = 0.28125;
extrusion_depth = 0.2812;          // main extrusion depth from base datum

// Remove-material feature parameters
hole1_x = 0.0717;                  // first circular axis from left edge
hole2_x = 0.6692;                  // second circular axis from left edge
hole_y = 0.0625;                   // both axes from front edge
hole_z_bottom = 0.1081;            // bottom of removed band above underside
hole_z_top = 0.1705;               // top of removed band above underside
hole_radius = 0.0312;
hole_length = 0.0625;              // cut depth along X axis
$fn = 100;

// Base datum is Z=0; extrude upward to fill full footprint with zero edge offsets
module base_block() {
    linear_extrude(height = extrusion_depth)
        square([length, width]);
}

// Two separate circular profiles oriented along X
// Side outline remains arched (circular) rather than a connected rectangular notch
module remove_material() {
    hole_z_center = (hole_z_bottom + hole_z_top) / 2;

    // First circular pocket
    translate([hole1_x, hole_y, hole_z_center])
        rotate([0, 90, 0])
            cylinder(h = hole_length, r = hole_radius, center = true);

    // Second circular pocket
    translate([hole2_x, hole_y, hole_z_center])
        rotate([0, 90, 0])
            cylinder(h = hole_length, r = hole_radius, center = true);
}

// Main assembly: subtract the two circular features from the solid base
difference() {
    base_block();
    remove_material();
}