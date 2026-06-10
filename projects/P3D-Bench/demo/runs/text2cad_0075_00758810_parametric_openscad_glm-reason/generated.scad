// === Parametric Variables ===

// Base dimensions
base_length = 0.742363;
base_width = 0.535615;
base_height = 0.094385;
base_corner_r = 0.01; // Rounded corner radius

// Base-plane circular void center and radius
void_cx = 0.1583;
void_cy = 0.3113;
void_r = 0.053;

// Collar parameters
collar_cx = 0.1583;
collar_cy = 0.3113;
collar_outer_r = 0.0966;
collar_inner_r = 0.0748;
collar_rise = 0.1452;
collar_top_z = 0.2396;

// Stepped bore - narrow section (base-plane void)
bore_narrow_r = 0.053;
bore_narrow_z_bot = 0.0;
bore_narrow_z_top = 0.0218;

// Stepped bore - wide section
bore_wide_r = 0.0748;
bore_wide_z_bot = 0.0218;
bore_wide_z_top = 0.0944;

// Side recess 1 (front face)
sr1_cx = 0.4487;
sr1_cz = 0.0472;
sr1_r = 0.0073;
sr1_depth = 0.0073;

// Side recess 2 (front face)
sr2_cx = 0.5939;
sr2_cz = 0.0472;
sr2_r = 0.0073;
sr2_depth = 0.0073;

// Underside recess parameters
ur_r = 0.0221;
ur_depth = 0.0152;
ur1_cx = 0.0526; ur1_cy = 0.3108;
ur2_cx = 0.3248; ur2_cy = 0.4519;
ur3_cx = 0.3248; ur3_cy = 0.1717;
ur4_cx = 0.7137; ur4_cy = 0.3112;

$fn = 100;

// === Module: Rounded rectangular block ===
module rounded_rect(length, width, height, cr) {
    hull() {
        translate([cr, cr, 0]) cylinder(h=height, r=cr);
        translate([length - cr, cr, 0]) cylinder(h=height, r=cr);
        translate([cr, width - cr, 0]) cylinder(h=height, r=cr);
        translate([length - cr, width - cr, 0]) cylinder(h=height, r=cr);
    }
}

// === Module: Annular collar ===
module annular_collar(cx, cy, outer_r, inner_r, height, z_base) {
    translate([cx, cy, z_base])
        difference() {
            cylinder(h=height, r=outer_r);
            translate([0, 0, -0.001])
                cylinder(h=height + 0.002, r=inner_r);
        }
}

// === Module: Front-face side recess ===
module side_recess(cx, cz, r, depth) {
    translate([cx, -0.001, cz])
        rotate([-90, 0, 0])
        cylinder(h=depth + 0.002, r=r);
}

// === Module: Underside circular recess ===
module underside_recess(cx, cy, r, depth) {
    translate([cx, cy, -0.001])
        cylinder(h=depth + 0.002, r=r);
}

// === Main Model ===
difference() {
    union() {
        // Base block with rounded corners
        rounded_rect(base_length, base_width, base_height, base_corner_r);

        // Upper annular collar on top of base
        annular_collar(collar_cx, collar_cy, collar_outer_r,
                       collar_inner_r, collar_rise, base_height);
    }

    // Stepped bore - narrow section (base-plane void, r=0.053)
    translate([void_cx, void_cy, bore_narrow_z_bot - 0.001])
        cylinder(h=bore_narrow_z_top - bore_narrow_z_bot + 0.002,
                 r=bore_narrow_r);

    // Stepped bore - wide section (r=0.0748)
    translate([void_cx, void_cy, bore_wide_z_bot])
        cylinder(h=bore_wide_z_top - bore_wide_z_bot + 0.01,
                 r=bore_wide_r);

    // Side recess 1 on front face
    side_recess(sr1_cx, sr1_cz, sr1_r, sr1_depth);

    // Side recess 2 on front face
    side_recess(sr2_cx, sr2_cz, sr2_r, sr2_depth);

    // Underside recesses (four separate circular cuts)
    underside_recess(ur1_cx, ur1_cy, ur_r, ur_depth);
    underside_recess(ur2_cx, ur2_cy, ur_r, ur_depth);
    underside_recess(ur3_cx, ur3_cy, ur_r, ur_depth);
    underside_recess(ur4_cx, ur4_cy, ur_r, ur_depth);
}