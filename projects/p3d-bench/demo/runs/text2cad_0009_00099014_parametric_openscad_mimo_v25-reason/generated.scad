// Base dimensions
length = 0.75;
width = 0.669426;
height = 0.150979;

// Pad depths
pad_depth = 0.151;
continuation_depth = 0.302;

// Pad 1 (shallow)
pad1_w = 0.156427;
pad1_d = 0.090313;
pad1_left = 0.5351;
pad1_right = 0.0585;
pad1_front = 0.109;
pad1_back = 0.4701;

// Pad 2 (shallow)
pad2_w = 0.202932;
pad2_d = 0.128382;
pad2_left = 0.0568;
pad2_right = 0.4903;
pad2_front = 0.0294;
pad2_back = 0.5116;

// Pad 3 (shallow)
pad3_w = 0.207237;
pad3_d = 0.111076;
pad3_left = 0.5157;
pad3_right = 0.0271;
pad3_front = 0.5131;
pad3_back = 0.0452;

// Pad 4 (shallow)
pad4_w = 0.235324;
pad4_d = 0.115862;
pad4_left = 0.0893;
pad4_right = 0.4254;
pad4_front = 0.5088;
pad4_back = 0.0447;

// Continuation dimensions and offsets (sharing edges with shallow pads)
cont1_w = 0.078214;
cont1_d = 0.090313;
cont1_left = 0.6133;
cont1_right = 0.0585;
cont1_front = 0.109;
cont1_back = 0.4701;

cont2_w = 0.101466;
cont2_d = 0.128382;
cont2_left = 0.0568;
cont2_right = 0.5917;
cont2_front = 0.0294;
cont2_back = 0.5116;

cont3_w = 0.103619;
cont3_d = 0.111076;
cont3_left = 0.6193;
cont3_right = 0.0271;
cont3_front = 0.5131;
cont3_back = 0.0452;

cont4_w = 0.117662;
cont4_d = 0.115862;
cont4_left = 0.0893;
cont4_right = 0.543;
cont4_front = 0.5088;
cont4_back = 0.0447;

// Main union of all components
union() {
    // Base solid
    cube([length, width, height]);

    // Pad 1 (shallow)
    translate([pad1_left, pad1_front, -pad_depth])
        cube([pad1_w, pad1_d, pad_depth]);

    // Pad 2 (shallow)
    translate([pad2_left, pad2_front, -pad_depth])
        cube([pad2_w, pad2_d, pad_depth]);

    // Pad 3 (shallow)
    translate([pad3_left, pad3_front, -pad_depth])
        cube([pad3_w, pad3_d, pad_depth]);

    // Pad 4 (shallow)
    translate([pad4_left, pad4_front, -pad_depth])
        cube([pad4_w, pad4_d, pad_depth]);

    // Continuation 1 (deep)
    translate([cont1_left, cont1_front, -(pad_depth + continuation_depth)])
        cube([cont1_w, cont1_d, continuation_depth]);

    // Continuation 2 (deep)
    translate([cont2_left, cont2_front, -(pad_depth + continuation_depth)])
        cube([cont2_w, cont2_d, continuation_depth]);

    // Continuation 3 (deep)
    translate([cont3_left, cont3_front, -(pad_depth + continuation_depth)])
        cube([cont3_w, cont3_d, continuation_depth]);

    // Continuation 4 (deep)
    translate([cont4_left, cont4_front, -(pad_depth + continuation_depth)])
        cube([cont4_w, cont4_d, continuation_depth]);
}