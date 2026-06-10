// D-Shaped Frame with Shallow Round Protrusion

// Main base dimensions
main_length = 0.3953;
main_width = 0.6022;
main_height = 0.1095;

// Frame wall thickness for inner through-opening
wall_thickness = 0.04;

// Shallow protrusion overall footprint
prot_length = 0.259658;
prot_width = 0.197373;
prot_height = 0.0547;
prot_left = 0;
prot_front = -0.1478;

// Circular portion of protrusion (coaxial with cut)
circ_x = 0.0942;
circ_y = -0.0821;
circ_radius = 0.0657;

// Concentric circular cut through shallow band
cut_radius = 0.0285;

$fn = 100;

// 2D D-shape: semicircular front arc with straight sides and rear
module d_shape_2d(l, w) {
    r = l / 2;
    n = $fn;
    // Semicircular arc from left through bottom to right
    arc_pts = [for (i = [0 : n]) let(a = 180 + i * 180 / n)
               [r + r * cos(a), r + r * sin(a)]];
    // Close polygon with back edge corners
    pts = concat(arc_pts, [[l, w], [0, w]]);
    polygon(pts);
}

// 2D D-shaped frame: outer D-shape minus offset inner opening
module d_frame_2d(l, w, wt) {
    difference() {
        d_shape_2d(l, w);
        offset(delta = -wt)
            d_shape_2d(l, w);
    }
}

// Assemble final model
difference() {
    union() {
        // Main D-shaped frame, full extrusion depth
        linear_extrude(main_height)
            d_frame_2d(main_length, main_width, wall_thickness);

        // Shallow protrusion: rectangular pad plus circular tab
        union() {
            translate([prot_left, prot_front, 0])
                cube([prot_length, prot_width, prot_height]);
            translate([circ_x, circ_y, 0])
                cylinder(r = circ_radius, h = prot_height);
        }
    }

    // Concentric circular cut through shallow band only
    translate([circ_x, circ_y, 0])
        cylinder(r = cut_radius, h = prot_height);
}