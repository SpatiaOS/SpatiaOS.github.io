// Parameters
length = 0.742363;
width = 0.535615;
base_height = 0.0944;          // main extrusion depth from base datum
$fn = 100;

// Base footprint: stadium (capsule) shape flush to all bounds
base_end_r = width / 2;

// Collar parameters (coaxial with base void)
collar_outer_r = 0.0966;
collar_inner_r = 0.0748;
collar_center_x = 0.1583;
collar_center_y = 0.3113;
collar_base_z = base_height;
collar_top_z = 0.2396;
collar_height = collar_top_z - collar_base_z; // 0.1452

// Base-plane circular void
void_r = 0.053;
void_x = 0.1583;
void_y = 0.3113;

// Coaxial stepped bore
bore_x = 0.1583;
bore_y = 0.3113;
bore_large_r = 0.0748;
bore_large_z1 = 0.0218;
bore_large_z2 = 0.0944;
bore_small_r = 0.053;
bore_small_z1 = 0;
bore_small_z2 = 0.0726;

// Side recess 1 (short cylinder along X, radius 0.0073, length 0.0073)
sr1_xmin = 0.4487;
sr1_len = 0.0073;
sr1_xcenter = sr1_xmin + sr1_len / 2;
sr1_ycenter = 0.0472;
sr1_zcenter = 0.0472;
sr1_r = 0.0073;

// Side recess 2
sr2_xmin = 0.5866;
sr2_len = 0.0073;
sr2_xcenter = sr2_xmin + sr2_len / 2;
sr2_ycenter = 0.0472;
sr2_zcenter = 0.0472;
sr2_r = 0.0073;

// Underside shallow circular recesses
ur_r = 0.0221;
ur_z = 0;
ur_depth = 0.0152;
ur_centers = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Rounded arc-based footprint (stadium / capsule)
module base_footprint() {
    hull() {
        translate([base_end_r, base_end_r, 0])
            circle(r = base_end_r);
        translate([length - base_end_r, base_end_r, 0])
            circle(r = base_end_r);
    }
}

// Main model
difference() {
    union() {
        // Base solid extrusion
        linear_extrude(height = base_height)
            base_footprint();

        // Upper annular cylindrical collar
        translate([collar_center_x, collar_center_y, collar_base_z])
            difference() {
                cylinder(h = collar_height, r = collar_outer_r);
                // Hollow core
                translate([0, 0, -1])
                    cylinder(h = collar_height + 2, r = collar_inner_r);
            }
    }

    // Base-plane circular void (coaxial through-hole)
    translate([void_x, void_y, -1])
        cylinder(h = base_height + 2, r = void_r);

    // Main recessed band (larger radius, 0.0748)
    translate([bore_x, bore_y, bore_large_z1])
        cylinder(h = bore_large_z2 - bore_large_z1, r = bore_large_r);

    // Deeper bore continuation (smaller radius, 0.053)
    translate([bore_x, bore_y, bore_small_z1])
        cylinder(h = bore_small_z2 - bore_small_z1, r = bore_small_r);

    // Side recess 1
    translate([sr1_xcenter, sr1_ycenter, sr1_zcenter])
        rotate([0, 90, 0])
            cylinder(h = sr1_len, r = sr1_r, center = true);

    // Side recess 2
    translate([sr2_xcenter, sr2_ycenter, sr2_zcenter])
        rotate([0, 90, 0])
            cylinder(h = sr2_len, r = sr2_r, center = true);

    // Four separate underside circular cuts
    for (c = ur_centers) {
        translate([c[0], c[1], ur_z])
            cylinder(h = ur_depth, r = ur_r);
    }
}