$fn = 100;

// Base parameters
base_len = 0.75;
base_wid = 0.375;
base_ht = 0.0375;

// Raised upper material parameters
raised_len = 0.75;
raised_wid = 0.375;
raised_ht = 0.0937;
raised_z = base_ht;

// Left narrower solid parameters
left_len = 0.0319;
left_wid = 0.3094;
left_ht = 0.0562;
left_x = 0;
left_y = 0.0281;
left_z = base_ht;

// Annular post parameters
post_ht = 0.0937;
post_z = base_ht;
post_y = 0.1875;
post_x = [0.15, 0.3, 0.45, 0.6];
post_r_out = [0.0469, 0.0469, 0.0562, 0.0562];
post_r_in = [0.0188, 0.0197, 0.0216, 0.0234];

// Main model assembly
union() {
    // Create main rectangular base
    cube([base_len, base_wid, base_ht]);

    // Add raised rectangular upper material flush to base edges
    translate([0, 0, raised_z])
        cube([raised_len, raised_wid, raised_ht]);

    // Add narrower rectangular solid at the left end
    translate([left_x, left_y, left_z])
        cube([left_len, left_wid, left_ht]);

    // Place four annular cylindrical posts on the upper face
    for (i = [0:3]) {
        translate([post_x[i], post_y, post_z])
            annular_post(post_ht, post_r_out[i], post_r_in[i]);
    }
}

// Module to generate annular posts with through holes
module annular_post(h, r_outer, r_inner) {
    difference() {
        cylinder(h = h, r = r_outer);
        // Slight over-extension prevents coplanar face artifacts during boolean subtraction
        translate([0, 0, -0.001])
            cylinder(h = h + 0.002, r = r_inner);
    }
}