// === Parameters ===

// Main rectangular base
base_length    = 0.5;       // X dimension
base_width     = 0.4375;    // Y dimension
base_height    = 0.09375;   // Z dimension (upward from z=0)

// Circular void through the base
base_hole_x    = 0.25;      // Center from left edge
base_hole_y    = 0.1875;    // Center from front edge
base_hole_r    = 0.0938;    // Radius

// Back-edge strip common footprint
strip_length   = 0.5;       // X span (full length)
strip_depth    = 0.0625;    // Y span
strip_y_front  = 0.375;     // Y offset of strip front face

// Strip 1 (upper leg): base underside to 0.25 below
strip1_height  = 0.25;

// Strip 2 (lower leg): 0.25 below to 0.50 below base underside
strip2_height  = 0.25;

// Circular void in strip 2
strip_hole_x   = 0.125;     // Center from left edge
strip_hole_y   = 0.4375;    // Center from front edge
strip_hole_r   = 0.05;      // Radius

// Annular collar on top of base
collar_x       = 0.2501;    // Center from left edge
collar_y       = 0.1876;    // Center from front edge
collar_outer_r = 0.0938;    // Outer radius
collar_inner_r = 0.05;      // Inner radius (void)
collar_height  = 0.0625;    // Height above base top

$fn = 100;

// === Helper Modules ===

// Annular collar (tube)
module annular_collar(cx, cy, z0, h, r_out, r_in) {
    difference() {
        translate([cx, cy, z0])
            cylinder(h = h, r = r_out);
        translate([cx, cy, z0 - 0.01])
            cylinder(h = h + 0.02, r = r_in);
    }
}

// === Main Assembly ===
union() {

    // 1) Main rectangular base with circular void
    difference() {
        cube([base_length, base_width, base_height]);

        // Through-hole in the base
        translate([base_hole_x, base_hole_y, -0.01])
            cylinder(h = base_height + 0.02, r = base_hole_r);
    }

    // 2) Upper back-edge strip (hangs below base, z = -strip1_height to 0)
    translate([0, strip_y_front, -strip1_height])
        cube([strip_length, strip_depth, strip1_height]);

    // 3) Lower back-edge strip with circular void holes
    difference() {
        translate([0, strip_y_front, -(strip1_height + strip2_height)])
            cube([strip_length, strip_depth, strip2_height]);

        // Vertical circular void through strip 2
        translate([strip_hole_x, strip_hole_y,
                   -(strip1_height + strip2_height) - 0.01])
            cylinder(h = strip2_height + 0.02, r = strip_hole_r);
    }

    // 4) Concentric annular collar on top of base
    annular_collar(collar_x, collar_y,
                   base_height, collar_height,
                   collar_outer_r, collar_inner_r);
}