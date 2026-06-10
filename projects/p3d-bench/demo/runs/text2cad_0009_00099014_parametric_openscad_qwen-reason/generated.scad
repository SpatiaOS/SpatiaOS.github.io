// OpenSCAD Parametric Model
$fn = 64;

// Base Dimensions
base_length = 0.75;
base_width  = 0.669426;
base_height = 0.150979;

// Feature Depths
shallow_depth = 0.151;
deep_depth    = 0.302;
deep_start_z  = -0.1509; // Offset below base underside (Z=0)

// Shallow Pad Parameters: [x_size, y_size, left_offset, front_offset]
s1 = [0.156427, 0.090313, 0.5351, 0.109];
s2 = [0.202932, 0.128382, 0.0568, 0.0294];
s3 = [0.207237, 0.111076, 0.5157, 0.5131];
s4 = [0.235324, 0.115862, 0.0893, 0.5088];

// Deep Continuation Parameters: [x_size, y_size, left_offset, front_offset]
d1 = [0.101466, 0.128382, 0.0568, 0.0294]; // Below s2
d2 = [0.078214, 0.090313, 0.6133, 0.109];   // Below s1
d3 = [0.103619, 0.111076, 0.6193, 0.5131];  // Below s3
d4 = [0.117662, 0.115862, 0.0893, 0.5088];  // Below s4

// Reusable Pad Module
module rect_pad(x, y, h, z_top, lx, fy) {
    translate([lx, fy, z_top - h])
        cube([x, y, h]);
}

// Main Assembly
union() {
    // Solid rectangular base
    cube([base_length, base_width, base_height]);

    // Shallow pads (extend from Z=0 to Z=-0.151)
    rect_pad(s1[0], s1[1], shallow_depth, 0, s1[2], s1[3]);
    rect_pad(s2[0], s2[1], shallow_depth, 0, s2[2], s2[3]);
    rect_pad(s3[0], s3[1], shallow_depth, 0, s3[2], s3[3]);
    rect_pad(s4[0], s4[1], shallow_depth, 0, s4[2], s4[3]);

    // Deep continuations (extend from Z=-0.1509 to Z=-0.4529)
    rect_pad(d1[0], d1[1], deep_depth, deep_start_z, d1[2], d1[3]);
    rect_pad(d2[0], d2[1], deep_depth, deep_start_z, d2[2], d2[3]);
    rect_pad(d3[0], d3[1], deep_depth, deep_start_z, d3[2], d3[3]);
    rect_pad(d4[0], d4[1], deep_depth, deep_start_z, d4[2], d4[3]);
}