// Parameters for the main base
base_length = 0.742363;
base_width = 0.535615;
base_height = 0.0944;
base_corner_radius = 0.02; // Small radius for the rounded solid footprint

// Parameters for the upper annular collar
collar_x = 0.1583;
collar_y = 0.3113;
collar_outer_r = 0.0966;
collar_inner_r = 0.0748;
collar_z_start = 0.0944;
collar_z_end = 0.2396;

// Parameters for the coaxial stepped bore
bore_r1 = 0.053;
bore_z1_start = -0.01; // Extended slightly for clean boolean cut
bore_z1_end = 0.0218;

bore_r2 = 0.0748;
bore_z2_start = 0.0218;
bore_z2_end = collar_z_end + 0.01; // Extends through the collar

// Parameters for the shallow side recesses
recess_r = 0.0073;
recess_z_start = 0.0399;
recess_z_end = 0.0545;
recess1_x = 0.4487;
recess1_y = 0.0472;
recess2_x = 0.5939;
recess2_y = 0.0472;

// Parameters for the underside circular removed profiles
under_hole_r = 0.0221;
under_hole_depth = 0.0152;
under_hole_locs = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Resolution for smooth circular features
$fn = 100;

// Helper module for the rounded rectangular base footprint
module rounded_base(w, d, h, r) {
    hull() {
        translate([r, r, 0]) cylinder(h=h, r=r);
        translate([w-r, r, 0]) cylinder(h=h, r=r);
        translate([w-r, d-r, 0]) cylinder(h=h, r=r);
        translate([r, d-r, 0]) cylinder(h=h, r=r);
    }
}

// Main model construction
difference() {
    // 1. Solid Bodies (Base + Collar exterior)
    union() {
        // Main base
        rounded_base(base_length, base_width, base_height, base_corner_radius);
        
        // Upper collar (solid, will be hollowed out by the bore)
        translate([collar_x, collar_y, collar_z_start])
            cylinder(h=collar_z_end - collar_z_start, r=collar_outer_r);
    }
    
    // 2. Subtractive Features
    
    // Lower coaxial bore (base-plane circular void)
    translate([collar_x, collar_y, bore_z1_start])
        cylinder(h=bore_z1_end - bore_z1_start, r=bore_r1);
        
    // Upper coaxial bore (recessed band and collar inner hollow)
    translate([collar_x, collar_y, bore_z2_start])
        cylinder(h=bore_z2_end - bore_z2_start, r=bore_r2);
        
    // First side recess
    translate([recess1_x, recess1_y, recess_z_start])
        cylinder(h=recess_z_end - recess_z_start, r=recess_r);
        
    // Second side recess
    translate([recess2_x, recess2_y, recess_z_start])
        cylinder(h=recess_z_end - recess_z_start, r=recess_r);
        
    // Underside pattern of four shallow circular recesses
    for (loc = under_hole_locs) {
        translate([loc[0], loc[1], -0.01])
            cylinder(h=under_hole_depth + 0.01, r=under_hole_r);
    }
}