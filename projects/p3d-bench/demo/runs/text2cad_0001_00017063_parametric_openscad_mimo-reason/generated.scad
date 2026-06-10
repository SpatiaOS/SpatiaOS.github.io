// Parametric design for base with two circular holes and a front band pocket

// Base dimensions
length = 0.75;
width = 0.21875;
height = 0.28125;
extrusion_depth = 0.2812; // main extrusion depth (same as height)

// Hole parameters
hole_radius = 0.0312;
hole1_x = 0.0717;
hole1_y = 0.0625;
hole2_x = 0.6692;
hole2_y = 0.0625;

// Band (pocket) parameters
band_length = 0.6599; // envelope length of the two holes
band_height = 0.0625; // vertical height of the band
band_depth = 0.0625;  // cut depth into the base from the front
band_z_start = 0.1081; // band start height above base underside
band_z_end = 0.1705;   // band end height above base underside

// Derived band position
band_x_center = (hole1_x + hole2_x) / 2; // center between holes
band_y = width; // front face (y = width)
band_z = band_z_start;

// Resolution for smooth circles
$fn = 100;

// Module for creating a through hole (cylinder along z-axis)
module through_hole(x, y, r) {
    translate([x, y, -0.001]) // slight offset to ensure clean cut
        cylinder(h = height + 0.002, r = r, center = false);
}

// Module for creating the front band pocket
module front_band(x_center, y, z, len, h, depth) {
    translate([x_center - len/2, y - depth, z])
        cube([len, depth, h]);
}

// Main model: base with holes and band pocket
difference() {
    // Solid base block
    cube([length, width, height]);
    
    // Subtract two through holes
    through_hole(hole1_x, hole1_y, hole_radius);
    through_hole(hole2_x, hole2_y, hole_radius);
    
    // Subtract front band pocket
    front_band(band_x_center, band_y, band_z, band_length, band_height, band_depth);
}