// === Parameters ===
// Main base dimensions
base_length  = 0.75;      // extent along X (left-right)
base_width   = 0.21875;   // extent along Y (front-back)
base_height  = 0.28125;   // peak height along Z
ext_depth    = 0.2812;    // extrusion depth (~base_height)

// Circular hole parameters
hole1_x      = 0.0717;    // first hole center from left edge
hole1_y      = 0.0625;    // first hole center from front edge
hole2_x      = 0.6692;    // second hole center from left edge
hole2_y      = 0.0625;    // second hole center from front edge
hole_r       = 0.0312;    // radius of each circular profile

// Cut band Z-range (above base underside)
cut_z_bot    = 0.1081;    // bottom of removed band
cut_z_top    = 0.1705;    // top of removed band
cut_depth    = 0.0625;    // vertical thickness of cut

// Resolution
$fn = 120;

// === Modules ===

// Semi-elliptical arch profile (2D, in local XY)
// X spans [0, w], Y spans [0, h]; flat base along X axis
module arch_profile_2d(w, h) {
    a = w / 2;   // half-width (horizontal semi-axis)
    b = h;       // full height (vertical semi-axis)
    n = $fn;
    points = [
        for (i = [0 : n])
            let(theta = 180 * i / n)
            [a + a * cos(theta), b * sin(theta)]
    ];
    polygon(points);
}

// Arched base: semi-elliptical cross-section extruded along length
// rotate(120,[1,1,1]) cyclically remaps local X->global Y,
// local Y->global Z, local Z (extrusion)->global X
module arched_base() {
    rotate(120, [1, 1, 1])
        linear_extrude(height = base_length)
            arch_profile_2d(base_width, base_height);
}

// Two separate circular cuts — no slot or pocket connecting them
module circular_cuts() {
    h_cut = cut_z_top - cut_z_bot;
    eps   = 0.001;  // small clearance for clean boolean

    // Circle 1: near the left end
    translate([hole1_x, hole1_y, cut_z_bot - eps])
        cylinder(h = h_cut + 2 * eps, r = hole_r);

    // Circle 2: near the right end
    translate([hole2_x, hole2_y, cut_z_bot - eps])
        cylinder(h = h_cut + 2 * eps, r = hole_r);
}

// === Final Assembly ===
// Subtract the two circular holes from the arched base
difference() {
    arched_base();
    circular_cuts();
}