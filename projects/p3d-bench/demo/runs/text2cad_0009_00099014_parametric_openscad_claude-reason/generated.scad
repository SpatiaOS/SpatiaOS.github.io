// === Parameters ===

// Base dimensions
base_length = 0.75;         // X
base_width  = 0.669426;     // Y
base_height = 0.150979;     // Z (upward from z=0)

// Shallow pad depth (below base underside at z=0)
shallow_depth = 0.151;

// Deep continuation Z range (below base underside)
deep_start = 0.1509;        // top of deep section below base underside
deep_end   = 0.4529;        // bottom of deep section below base underside
deep_depth = deep_end - deep_start; // 0.302

// Pad 1 shallow: offsets from base edges
p1_left  = 0.5351;  p1_right = 0.0585;
p1_front = 0.109;   p1_back  = 0.4701;
p1_sx = base_length - p1_left - p1_right;  // 0.156427
p1_sy = base_width  - p1_front - p1_back;  // 0.090313

// Pad 1 deep continuation (shares right, front, back)
p1d_left = 0.6133;  p1d_right = 0.0585;
p1d_sx = base_length - p1d_left - p1d_right; // 0.078214
p1d_sy = p1_sy;

// Pad 2 shallow
p2_left  = 0.0568;  p2_right = 0.4903;
p2_front = 0.0294;  p2_back  = 0.5116;
p2_sx = base_length - p2_left - p2_right;  // 0.202932
p2_sy = base_width  - p2_front - p2_back;  // 0.128382

// Pad 2 deep continuation (shares left, front, back)
p2d_left = 0.0568;  p2d_right = 0.5917;
p2d_sx = base_length - p2d_left - p2d_right; // 0.101466
p2d_sy = p2_sy;

// Pad 3 shallow
p3_left  = 0.5157;  p3_right = 0.0271;
p3_front = 0.5131;  p3_back  = 0.0452;
p3_sx = base_length - p3_left - p3_right;  // 0.207237
p3_sy = base_width  - p3_front - p3_back;  // 0.111076

// Pad 3 deep continuation (shares right, front, back)
p3d_left = 0.6193;  p3d_right = 0.0271;
p3d_sx = base_length - p3d_left - p3d_right; // 0.103619
p3d_sy = p3_sy;

// Pad 4 shallow
p4_left  = 0.0893;  p4_right = 0.4254;
p4_front = 0.5088;  p4_back  = 0.0447;
p4_sx = base_length - p4_left - p4_right;  // 0.235324
p4_sy = base_width  - p4_front - p4_back;  // 0.115862

// Pad 4 deep continuation (shares left, front, back)
p4d_left = 0.0893;  p4d_right = 0.543;
p4d_sx = base_length - p4d_left - p4d_right; // 0.117662
p4d_sy = p4_sy;

// === Assembly ===
// Base bottom at z=0, pads extend downward into -Z

union() {
    // --- Rectangular base ---
    cube([base_length, base_width, base_height]);

    // --- Pad 1: shallow section ---
    translate([p1_left, p1_front, -shallow_depth])
        cube([p1_sx, p1_sy, shallow_depth]);

    // --- Pad 1: deep continuation (aligned to right, front, back) ---
    translate([p1d_left, p1_front, -deep_end])
        cube([p1d_sx, p1d_sy, deep_depth]);

    // --- Pad 2: shallow section ---
    translate([p2_left, p2_front, -shallow_depth])
        cube([p2_sx, p2_sy, shallow_depth]);

    // --- Pad 2: deep continuation (aligned to left, front, back) ---
    translate([p2d_left, p2_front, -deep_end])
        cube([p2d_sx, p2d_sy, deep_depth]);

    // --- Pad 3: shallow section ---
    translate([p3_left, p3_front, -shallow_depth])
        cube([p3_sx, p3_sy, shallow_depth]);

    // --- Pad 3: deep continuation (aligned to right, front, back) ---
    translate([p3d_left, p3_front, -deep_end])
        cube([p3d_sx, p3d_sy, deep_depth]);

    // --- Pad 4: shallow section ---
    translate([p4_left, p4_front, -shallow_depth])
        cube([p4_sx, p4_sy, shallow_depth]);

    // --- Pad 4: deep continuation (aligned to left, front, back) ---
    translate([p4d_left, p4_front, -deep_end])
        cube([p4d_sx, p4d_sy, deep_depth]);
}