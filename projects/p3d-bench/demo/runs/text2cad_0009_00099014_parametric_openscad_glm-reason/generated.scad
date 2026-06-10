// Parametric variables
base_length = 0.75;
base_width = 0.669426;
base_height = 0.150979;
shallow_pad_depth = 0.151;
deep_start_below = 0.1509;
deep_end_below = 0.4529;

// Derived z coordinates (base bottom at z=0)
z_base_bot = 0;
z_base_top = base_height;
z_shallow_bot = -shallow_pad_depth;
z_shallow_top = 0;
z_deep_bot = -deep_end_below;
z_deep_top = -deep_start_below;

$fn = 50;

// Module: rectangular block positioned by offsets from base edges and z range
module rect_block(b_l, b_w, o_left, o_right, o_front, o_back, z_bot, z_top) {
    translate([o_left, o_front, z_bot])
        cube([b_l - o_left - o_right, b_w - o_front - o_back, z_top - z_bot]);
}

union() {
    // Solid rectangular base
    rect_block(base_length, base_width, 0, 0, 0, 0, z_base_bot, z_base_top);

    // --- Shallow pads (extend below base underside) ---

    // Pad 1: 0.156427 x 0.090313
    rect_block(base_length, base_width,
        0.5351, 0.0585, 0.109, 0.4701,
        z_shallow_bot, z_shallow_top);

    // Pad 2: 0.202932 x 0.128382
    rect_block(base_length, base_width,
        0.0568, 0.4903, 0.0294, 0.5116,
        z_shallow_bot, z_shallow_top);

    // Pad 3: 0.207237 x 0.111076
    rect_block(base_length, base_width,
        0.5157, 0.0271, 0.5131, 0.0452,
        z_shallow_bot, z_shallow_top);

    // Pad 4: 0.235324 x 0.115862
    rect_block(base_length, base_width,
        0.0893, 0.4254, 0.5088, 0.0447,
        z_shallow_bot, z_shallow_top);

    // --- Deep continuations (narrower sections below shallow pads) ---

    // Deep 1: below pad 1, 0.078214 x 0.090313, shares right/front/back edges
    rect_block(base_length, base_width,
        0.6133, 0.0585, 0.109, 0.4701,
        z_deep_bot, z_deep_top);

    // Deep 2: below pad 2, 0.101466 x 0.128382, shares left/front/back edges
    rect_block(base_length, base_width,
        0.0568, 0.5917, 0.0294, 0.5116,
        z_deep_bot, z_deep_top);

    // Deep 3: below pad 3, 0.103619 x 0.111076, shares right/front/back edges
    rect_block(base_length, base_width,
        0.6193, 0.0271, 0.5131, 0.0452,
        z_deep_bot, z_deep_top);

    // Deep 4: below pad 4, 0.117662 x 0.115862, shares left/front/back edges
    rect_block(base_length, base_width,
        0.0893, 0.543, 0.5088, 0.0447,
        z_deep_bot, z_deep_top);
}