// Global resolution setting
$fn = 50;

// --------------------------
// Base Dimension Parameters
// --------------------------
base_length = 0.75;        // X-axis: left to right dimension
base_width = 0.669426;     // Y-axis: front to back dimension
base_height = 0.150979;    // Z-axis: top to bottom base thickness

// --------------------------
// Pad Height Parameters
// --------------------------
shallow_pad_height = 0.151;        // Height of upper pads protruding below base underside
deep_pad_height = 0.302;           // Height of lower continuation pads
deep_pad_z_start_offset = 0.1509;  // Distance below base underside where deep pads begin

// --------------------------
// Reusable Pad Module
// Takes edge offsets from base boundaries and z position parameters
// --------------------------
module offset_pad(left_offset, right_offset, front_offset, back_offset, z_bottom, pad_height) {
    pad_x_pos = left_offset;
    pad_y_pos = front_offset;
    pad_x_size = base_length - left_offset - right_offset;
    pad_y_size = base_width - front_offset - back_offset;
    
    translate([pad_x_pos, pad_y_pos, z_bottom])
        cube([pad_x_size, pad_y_size, pad_height]);
}

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // Base body: top face at Z=0, underside at Z=-base_height
    translate([0, 0, -base_height])
        cube([base_length, base_width, base_height]);

    // --------------------------
    // Shallow Upper Pads
    // --------------------------
    // Pad 1
    offset_pad(
        left_offset = 0.5351,
        right_offset = 0.0585,
        front_offset = 0.109,
        back_offset = 0.4701,
        z_bottom = -base_height - shallow_pad_height,
        pad_height = shallow_pad_height
    );

    // Pad 2
    offset_pad(
        left_offset = 0.0568,
        right_offset = 0.4903,
        front_offset = 0.0294,
        back_offset = 0.5116,
        z_bottom = -base_height - shallow_pad_height,
        pad_height = shallow_pad_height
    );

    // Pad 3
    offset_pad(
        left_offset = 0.5157,
        right_offset = 0.0271,
        front_offset = 0.5131,
        back_offset = 0.0452,
        z_bottom = -base_height - shallow_pad_height,
        pad_height = shallow_pad_height
    );

    // Pad 4
    offset_pad(
        left_offset = 0.0893,
        right_offset = 0.4254,
        front_offset = 0.5088,
        back_offset = 0.0447,
        z_bottom = -base_height - shallow_pad_height,
        pad_height = shallow_pad_height
    );

    // --------------------------
    // Deep Lower Continuation Pads
    // --------------------------
    // Continuation for Pad 1
    offset_pad(
        left_offset = 0.6133,
        right_offset = 0.0585,
        front_offset = 0.109,
        back_offset = 0.4701,
        z_bottom = -base_height - deep_pad_z_start_offset - deep_pad_height,
        pad_height = deep_pad_height
    );

    // Continuation for Pad 2
    offset_pad(
        left_offset = 0.0568,
        right_offset = 0.5917,
        front_offset = 0.0294,
        back_offset = 0.5116,
        z_bottom = -base_height - deep_pad_z_start_offset - deep_pad_height,
        pad_height = deep_pad_height
    );

    // Continuation for Pad 3
    offset_pad(
        left_offset = 0.6193,
        right_offset = 0.0271,
        front_offset = 0.5131,
        back_offset = 0.0452,
        z_bottom = -base_height - deep_pad_z_start_offset - deep_pad_height,
        pad_height = deep_pad_height
    );

    // Continuation for Pad 4
    offset_pad(
        left_offset = 0.0893,
        right_offset = 0.543,
        front_offset = 0.5088,
        back_offset = 0.0447,
        z_bottom = -base_height - deep_pad_z_start_offset - deep_pad_height,
        pad_height = deep_pad_height
    );
}