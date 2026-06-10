// ==========================================
// Parametric CAD Model
// ==========================================

// Resolution for any potential curved surfaces (not used here, but standard)
$fn = 100;

// Base Dimensions
base_length = 0.75;
base_width  = 0.669426;
base_height = 0.150979;

// Shallow Pads Common Dimensions
shallow_pad_depth = 0.151;
shallow_pad_z_start = 0;

// Shallow Pad 1 (0.156427 by 0.090313)
pad1_length = 0.156427;
pad1_width  = 0.090313;
pad1_left   = 0.5351;
pad1_front  = 0.109;

// Shallow Pad 2 (0.202932 by 0.128382)
pad2_length = 0.202932;
pad2_width  = 0.128382;
pad2_left   = 0.0568;
pad2_front  = 0.0294;

// Shallow Pad 3 (0.207237 by 0.111076)
pad3_length = 0.207237;
pad3_width  = 0.111076;
pad3_left   = 0.5157;
pad3_front  = 0.5131;

// Shallow Pad 4 (0.235324 by 0.115862)
pad4_length = 0.235324;
pad4_width  = 0.115862;
pad4_left   = 0.0893;
pad4_front  = 0.5088;

// Deeper Continuations Common Dimensions
deep_pad_depth   = 0.302;
deep_pad_z_start = -0.1509;

// Continuation 1 (under Pad 1)
cont1_length = 0.078214;
cont1_width  = 0.090313;
cont1_left   = 0.6133;
cont1_front  = 0.109;

// Continuation 2 (under Pad 2)
cont2_length = 0.101466;
cont2_width  = 0.128382;
cont2_left   = 0.0568;
cont2_front  = 0.0294;

// Continuation 3 (under Pad 3)
cont3_length = 0.103619;
cont3_width  = 0.111076;
cont3_left   = 0.6193;
cont3_front  = 0.5131;

// Continuation 4 (under Pad 4)
cont4_length = 0.117662;
cont4_width  = 0.115862;
cont4_left   = 0.0893;
cont4_front  = 0.5088;

// ==========================================
// Helper Modules
// ==========================================

// Module to create an underside rectangular pad
// Extends downwards from z_start by depth
module underside_pad(length, width, depth, offset_left, offset_front, z_start) {
    translate([offset_left, offset_front, z_start - depth]) {
        cube([length, width, depth]);
    }
}

// ==========================================
// Main Model Assembly
// ==========================================

union() {
    // 1. Solid Rectangular Base
    // Positioned such that the underside is at Z=0, left is X=0, front is Y=0
    cube([base_length, base_width, base_height]);

    // 2. Four Shallow Rectangular Pads
    underside_pad(pad1_length, pad1_width, shallow_pad_depth, pad1_left, pad1_front, shallow_pad_z_start);
    underside_pad(pad2_length, pad2_width, shallow_pad_depth, pad2_left, pad2_front, shallow_pad_z_start);
    underside_pad(pad3_length, pad3_width, shallow_pad_depth, pad3_left, pad3_front, shallow_pad_z_start);
    underside_pad(pad4_length, pad4_width, shallow_pad_depth, pad4_left, pad4_front, shallow_pad_z_start);

    // 3. Four Deeper Solid Rectangular Continuations
    // These start 0.1509 below the base underside and overlap with the shallow pads by 0.0001
    // to ensure manifold geometry, reaching a total depth of 0.4529 below the base.
    underside_pad(cont1_length, cont1_width, deep_pad_depth, cont1_left, cont1_front, deep_pad_z_start);
    underside_pad(cont2_length, cont2_width, deep_pad_depth, cont2_left, cont2_front, deep_pad_z_start);
    underside_pad(cont3_length, cont3_width, deep_pad_depth, cont3_left, cont3_front, deep_pad_z_start);
    underside_pad(cont4_length, cont4_width, deep_pad_depth, cont4_left, cont4_front, deep_pad_z_start);
}