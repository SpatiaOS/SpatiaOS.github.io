$fn = 100;

// Main Body Dimensions
body_len_x = 0.702127;
body_len_y = 0.524964;
body_len_z = 0.2103;

// Top Shallow Recess
rec1_off_x = 0.0171;
rec1_off_y = 0.0172;
rec1_off_z = 0.1888;
rec1_len_x = 0.667793;
rec1_len_y = 0.490631;
rec1_len_z = 0.0215;

// Middle Continuation Recess
rec2_off_x = 0.0257;
rec2_off_y = 0.03;
rec2_off_z = 0.0729;
rec2_len_x = 0.650626;
rec2_len_y = 0.46488;
rec2_len_z = 0.1159;

// Lower Pocket
pkt_off_x = 0.0999;
pkt_off_y = 0.0386;
pkt_off_z = 0.0215;
pkt_len_x = 0.567882;
pkt_len_y = 0.447713;
pkt_len_z = 0.0515;

// Side Projection (Added Solid)
proj_off_x = -0.0479;
proj_off_y = 0.03;
proj_off_z = 0.073;
proj_len_x = 0.130618;
proj_len_y = 0.463588;
proj_len_z = 0.0146;

// Side Recess (Cut)
sideRec_off_x = 0.0;
sideRec_off_y = 0.0546;
sideRec_off_z = 0.0876;
sideRec_len_x = 0.0343;
sideRec_len_y = 0.367372;
sideRec_len_z = 0.101285;

// Model Assembly
difference() {
    // Base volume + side projection
    union() {
        cube([body_len_x, body_len_y, body_len_z], center=false);
        translate([proj_off_x, proj_off_y, proj_off_z])
            cube([proj_len_x, proj_len_y, proj_len_z], center=false);
    }

    // Remove top shallow recess
    translate([rec1_off_x, rec1_off_y, rec1_off_z])
        cube([rec1_len_x, rec1_len_y, rec1_len_z], center=false);

    // Remove middle continuation recess
    translate([rec2_off_x, rec2_off_y, rec2_off_z])
        cube([rec2_len_x, rec2_len_y, rec2_len_z], center=false);

    // Remove lower pocket
    translate([pkt_off_x, pkt_off_y, pkt_off_z])
        cube([pkt_len_x, pkt_len_y, pkt_len_z], center=false);

    // Remove side recess
    translate([sideRec_off_x, sideRec_off_y, sideRec_off_z])
        cube([sideRec_len_x, sideRec_len_y, sideRec_len_z], center=false);
}