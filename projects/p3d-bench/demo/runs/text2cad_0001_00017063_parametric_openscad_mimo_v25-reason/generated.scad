// Parameters
length = 0.75;
width = 0.21875;
height = 0.28125;
extrusion_depth = 0.2812;

// Circular cutout parameters
circle_radius = 0.0312;
left_circle_x = 0.0717;
right_circle_x = 0.6692;
circle_y = 0.0625;

// Cut band parameters
cut_band_bottom = 0.1081;
cut_band_top = 0.1705;
cut_depth = 0.0625;

// Resolution
$fn = 100;

// Main base block
module base_block() {
    cube([length, width, height]);
}

// Circular cutout feature
module circular_cutouts() {
    // Left circular cutout
    translate([left_circle_x, circle_y, cut_band_bottom])
        cylinder(h = cut_depth, r = circle_radius, center = false);
    
    // Right circular cutout
    translate([right_circle_x, circle_y, cut_band_bottom])
        cylinder(h = cut_depth, r = circle_radius, center = false);
}

// Final model with cutouts removed from base
difference() {
    base_block();
    circular_cutouts();
}