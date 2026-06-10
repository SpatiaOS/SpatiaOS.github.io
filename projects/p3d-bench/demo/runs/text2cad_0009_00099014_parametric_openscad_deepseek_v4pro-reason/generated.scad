// Parametric Base and Underside Pads
base_length = 0.75;
base_width = 0.669426;
base_height = 0.150979;
shallow_depth = 0.151;          // depth of first pad layer below base
deeper_start = 0.1509;          // distance below base underside where deeper section starts
deeper_end = 0.4529;            // distance below base underside where deeper section ends
deeper_depth = deeper_end - deeper_start; // 0.302

$fn = 100; // smoothness (not critical for flat geometry)

// Pad definition: [left_offset, right_offset, front_offset, back_offset, deeper_side]
// deeper_side: "left" means deeper pad shares left edge; "right" shares right edge.
pad_data = [
    [0.5351, 0.0585, 0.109, 0.4701, "right"], // Pad 1
    [0.0568, 0.4903, 0.0294, 0.5116, "left"],  // Pad 2
    [0.5157, 0.0271, 0.5131, 0.0452, "right"], // Pad 3
    [0.0893, 0.4254, 0.5088, 0.0447, "left"]   // Pad 4
];

// Module for a single pad with its deeper continuation
module pad_with_deeper(lx, rx, fy, by, side) {
    // Compute shallow pad dimensions
    sx = base_length - lx - rx;
    sy = base_width - fy - by;

    // Shallow pad: top at base underside (z=0), extending downward
    translate([lx, fy, -shallow_depth])
        cube([sx, sy, shallow_depth]);

    // Deeper continuation: half the X length, same Y, placed at correct side
    deep_x = sx / 2;
    deep_y = sy;
    deep_x_pos = (side == "left") ? lx : (base_length - rx - deep_x);
    deep_y_pos = fy;
    deep_z_pos = -deeper_start; // top of deeper section

    translate([deep_x_pos, deep_y_pos, deep_z_pos])
        cube([deep_x, deep_y, deeper_depth]);
}

// Main model
union() {
    // Base body
    translate([0, 0, 0])
        cube([base_length, base_width, base_height]);

    // All underside pads with deeper continuations
    for (p = pad_data) {
        pad_with_deeper(p[0], p[1], p[2], p[3], p[4]);
    }
}