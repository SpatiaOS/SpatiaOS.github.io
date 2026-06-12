// === Parameters ===

// Base dimensions
base_length = 0.75;
base_width  = 0.375;
base_height = 0.0375;

// Raised frame (rectangular upper material)
frame_height    = 0.0937;  // extrusion depth above base
wall_front      = 0.0281;  // front wall thickness (y)
wall_back       = 0.0375;  // back wall thickness (y)
wall_left       = 0.0319;  // left wall thickness (x)
wall_right      = 0.0319;  // right wall thickness (x)

// Narrower rectangular solid at left end
rib_length      = 0.0319;
rib_width       = 0.3094;
rib_height      = 0.05625;
rib_x_offset    = 0;
rib_y_offset    = 0.0281;

// Annular post parameters
post_y          = 0.1875;  // all posts centered at this y
post_x          = [0.15, 0.30, 0.45, 0.60];
post_outer_r    = [0.0469, 0.0469, 0.0562, 0.0562];
post_inner_r    = [0.0188, 0.0197, 0.0216, 0.0234];
post_height     = 0.0937;  // from base top to 0.1312

$fn = 100;

// === Modules ===

// Hollow rectangular frame (walls only, open channel inside)
module frame(ol, ow, wf, wb, wl, wr, h) {
    difference() {
        cube([ol, ow, h]);
        translate([wl, wf, -0.001])
            cube([ol - wl - wr, ow - wf - wb, h + 0.002]);
    }
}

// Annular post (cylinder with central through-hole)
module annular_post(outer_r, inner_r, h) {
    difference() {
        cylinder(r = outer_r, h = h);
        translate([0, 0, -0.001])
            cylinder(r = inner_r, h = h + 0.002);
    }
}

// === Assembly ===

union() {
    // 1) Rectangular base
    cube([base_length, base_width, base_height]);

    // 2) Raised rectangular frame on top of base
    translate([0, 0, base_height])
        frame(base_length, base_width,
              wall_front, wall_back, wall_left, wall_right,
              frame_height);

    // 3) Narrower rectangular solid at left end
    translate([rib_x_offset, rib_y_offset, base_height])
        cube([rib_length, rib_width, rib_height]);

    // 4) Four annular cylindrical posts on upper face of base
    for (i = [0 : 3]) {
        translate([post_x[i], post_y, base_height])
            annular_post(post_outer_r[i], post_inner_r[i], post_height);
    }
}