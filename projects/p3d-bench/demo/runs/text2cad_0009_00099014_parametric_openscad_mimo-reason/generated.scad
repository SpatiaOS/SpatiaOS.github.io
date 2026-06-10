// Parameters
base_length = 0.75;
base_width = 0.669426;
base_height = 0.150979;
main_depth = 0.151;

// Shallow pad parameters
shallow_depth = 0.151;
pad1_size = [0.156427, 0.090313];
pad1_offsets = [0.5351, 0.0585, 0.109, 0.4701]; // left, right, front, back
pad2_size = [0.202932, 0.128382];
pad2_offsets = [0.0568, 0.4903, 0.0294, 0.5116];
pad3_size = [0.207237, 0.111076];
pad3_offsets = [0.5157, 0.0271, 0.5131, 0.0452];
pad4_size = [0.235324, 0.115862];
pad4_offsets = [0.0893, 0.4254, 0.5088, 0.0447];

// Deep continuation parameters
deep_depth = 0.302;
deep_start_offset = 0.1509;
cont1_size = [0.078214, 0.090313];
cont1_offsets = [0.6133, 0.0585, 0.109, 0.4701];
cont2_size = [0.101466, 0.128382];
cont2_offsets = [0.0568, 0.5917, 0.0294, 0.5116];
cont3_size = [0.103619, 0.111076];
cont3_offsets = [0.6193, 0.0271, 0.5131, 0.0452];
cont4_size = [0.117662, 0.115862];
cont4_offsets = [0.0893, 0.543, 0.5088, 0.0447];

$fn = 100;

// Main base module
module base() {
    cube([base_length, base_width, base_height], center = false);
}

// Pad module - creates rectangular pad at specified position
module pad(size, offsets, depth) {
    translate([offsets[0], offsets[2], -depth])
        cube([size[0], size[1], depth], center = false);
}

// Continuation module - creates deeper section below shallow pad
module continuation(size, offsets, depth, start_offset) {
    translate([offsets[0], offsets[2], -start_offset - depth])
        cube([size[0], size[1], depth], center = false);
}

// Main model assembly
union() {
    // Create base
    base();
    
    // Add shallow pads to underside
    pad(pad1_size, pad1_offsets, shallow_depth);
    pad(pad2_size, pad2_offsets, shallow_depth);
    pad(pad3_size, pad3_offsets, shallow_depth);
    pad(pad4_size, pad4_offsets, shallow_depth);
    
    // Add deep continuations below shallow pads
    continuation(cont1_size, cont1_offsets, deep_depth, deep_start_offset);
    continuation(cont2_size, cont2_offsets, deep_depth, deep_start_offset);
    continuation(cont3_size, cont3_offsets, deep_depth, deep_start_offset);
    continuation(cont4_size, cont4_offsets, deep_depth, deep_start_offset);
}