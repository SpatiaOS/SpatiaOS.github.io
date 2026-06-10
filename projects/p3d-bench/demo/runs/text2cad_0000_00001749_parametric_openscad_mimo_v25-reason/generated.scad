// D-Shaped Frame with Protrusion and Circular Cut

// Main base reference dimensions
main_length = 0.395255;
main_width  = 0.60219;
main_height = 0.109489;
extrusion_depth = 0.1095;

// D-shape footprint (flush with main base edges)
d_length = 0.3953;
d_width  = 0.6022;

// Frame wall thickness
wall_t = 0.025;

// Protrusion bounding box (edge offsets from main base)
prot_x0 = 0;
prot_x1 = d_length - 0.1356;   // 0.2597
prot_y0 = -0.1478;             // extends beyond front
prot_y1 = d_width - 0.5526;    // 0.0496
prot_h  = 0.054745;

// Coaxial circular profile
circ_cx      = 0.0942;
circ_cy      = -0.0821;
circ_r_outer = 0.0657;
circ_r_cut   = 0.0285;
circ_h       = 0.0547;

$fn = 120;

// D-shape 2D profile: flat back at high y, semicircular front at low y
module d_shape_2d(len, wid, inset=0) {
    r  = len/2 - inset;
    cx = len/2;
    cy = len/2;
    union() {
        // Straight rectangle (sides + back)
        translate([inset, cy])
            square([len - 2*inset, wid - cy - inset]);
        // Lower semicircle (curved front wall)
        translate([cx, cy])
            intersection() {
                circle(r = r);
                translate([-(r+1), -(r+1)])
                    square([2*(r+1), r+1]);
            }
    }
}

// Main assembly
difference() {
    union() {
        // D-shaped frame body
        linear_extrude(height = extrusion_depth)
            d_shape_2d(d_length, d_width);
        // Shallow protrusion block attached to frame front
        translate([prot_x0, prot_y0, 0])
            cube([prot_x1 - prot_x0,
                  prot_y1 - prot_y0,
                  prot_h]);
    }
    // Inner through-opening (continuous through frame and protrusion)
    translate([0, 0, -0.001])
        linear_extrude(height = extrusion_depth + 0.002)
            d_shape_2d(d_length, d_width, wall_t);
    // Concentric circular cut through protrusion band
    translate([circ_cx, circ_cy, -0.001])
        cylinder(h = circ_h + 0.002, r = circ_r_cut);
}