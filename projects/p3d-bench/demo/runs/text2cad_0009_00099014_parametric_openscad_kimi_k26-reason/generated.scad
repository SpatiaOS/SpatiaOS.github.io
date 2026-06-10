// Base dimensions
base_length = 0.75;
base_width = 0.669426;
base_height = 0.150979;

// Pad depth parameters
shallow_depth = 0.151;
deep_start_below = 0.1509;
deep_end_below = 0.4529;
deep_depth = deep_end_below - deep_start_below; // 0.302

// Pad 1 shallow
p1_s_x = 0.156427;
p1_s_y = 0.090313;
p1_s_left = 0.5351;
p1_s_front = 0.109;

// Pad 1 deep
p1_d_x = 0.078214;
p1_d_y = 0.090313;
p1_d_left = 0.6133;
p1_d_front = 0.109;

// Pad 2 shallow
p2_s_x = 0.202932;
p2_s_y = 0.128382;
p2_s_left = 0.0568;
p2_s_front = 0.0294;

// Pad 2 deep
p2_d_x = 0.101466;
p2_d_y = 0.128382;
p2_d_left = 0.0568;
p2_d_front = 0.0294;

// Pad 3 shallow
p3_s_x = 0.207237;
p3_s_y = 0.111076;
p3_s_left = 0.5157;
p3_s_front = 0.5131;

// Pad 3 deep
p3_d_x = 0.103619;
p3_d_y = 0.111076;
p3_d_left = 0.6193;
p3_d_front = 0.5131;

// Pad 4 shallow
p4_s_x = 0.235324;
p4_s_y = 0.115862;
p4_s_left = 0.0893;
p4_s_front = 0.5088;

// Pad 4 deep
p4_d_x = 0.117662;
p4_d_y = 0.115862;
p4_d_left = 0.0893;
p4_d_front = 0.5088;

// Main base body
module base_body() {
    cube([base_length, base_width, base_height]);
}

// Shallow pad extending from base underside
module shallow_pad(left, front, w, d) {
    translate([left, front, -shallow_depth])
        cube([w, d, shallow_depth]);
}

// Deeper continuation pad
module deep_pad(left, front, w, d) {
    translate([left, front, -deep_end_below])
        cube([w, d, deep_depth]);
}

// Assemble solid model
union() {
    // Reference rectangular base
    base_body();

    // Pad 1 features
    shallow_pad(p1_s_left, p1_s_front, p1_s_x, p1_s_y);
    deep_pad(p1_d_left, p1_d_front, p1_d_x, p1_d_y);

    // Pad 2 features
    shallow_pad(p2_s_left, p2_s_front, p2_s_x, p2_s_y);
    deep_pad(p2_d_left, p2_d_front, p2_d_x, p2_d_y);

    // Pad 3 features
    shallow_pad(p3_s_left, p3_s_front, p3_s_x, p3_s_y);
    deep_pad(p3_d_left, p3_d_front, p3_d_x, p3_d_y);

    // Pad 4 features
    shallow_pad(p4_s_left, p4_s_front, p4_s_x, p4_s_y);
    deep_pad(p4_d_left, p4_d_front, p4_d_x, p4_d_y);
}