// Parametric design for collar base assembly
// All dimensions in millimeters

// === Base Parameters ===
base_length = 0.742363;
base_width = 0.535615;
base_height = 0.0944;          // extrusion depth from base datum
base_underside_z = 0;
base_top_z = base_height;      // 0.0944

// === Base Circular Void (through-hole in base) ===
void_x = 0.1583;               // left offset
void_y = 0.3113;               // front offset
void_r = 0.053;
void_z_bottom = base_underside_z;
void_z_top = base_top_z;

// === Upper Annular Collar (hollow cylinder on base top) ===
collar_x = 0.1583;             // coaxial with void
collar_y = 0.3113;
collar_outer_r = 0.0966;
collar_inner_r = 0.0748;
collar_bottom_z = base_top_z;  // sits on base top
collar_top_z = 0.2396;        // from base datum
collar_height = collar_top_z - collar_bottom_z;  // 0.1452

// === Coaxial Stepped Bore (below collar, through and below base) ===
bore_x = 0.1583;
bore_y = 0.3113;
bore_upper_r = 0.0748;         // wider recess
bore_lower_r = 0.053;          // narrower through-hole
bore_upper_z1 = 0.0218;        // upper recess bottom (above base underside)
bore_upper_z2 = 0.0944;        // upper recess top
bore_lower_z1 = -0.0944;       // deeper bore bottom (below base underside)
bore_lower_z2 = -0.0218;       // deeper bore top (below base underside)

// === Small Side Recesses (on front face, near front side) ===
side1_cx = 0.4487;             // center x
side1_cz = 0.0472;             // center z (midpoint of 0.0399..0.0545)
side1_r = 0.0073;
side1_depth = 0.0073;          // into base along +y

side2_cx = 0.5939;
side2_cz = 0.0472;
side2_r = 0.0073;
side2_depth = 0.0073;

// === Underside Circular Recesses (four separate round cuts on bottom face) ===
under_r = 0.0221;
under_depth = 0.0152;          // from z=0 to z=0.0152
under_z_start = base_underside_z;
under_z_end = under_depth;

under_positions = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// === Resolution ===
$fn = 100;

// === Main Model ===
difference() {
    union() {
        // Main base block (rectangular, flush to reference bounds)
        translate([0, 0, base_underside_z])
            cube([base_length, base_width, base_height]);

        // Upper annular collar (hollow cylinder on top of base)
        translate([collar_x, collar_y, collar_bottom_z])
            difference() {
                cylinder(h = collar_height, r = collar_outer_r);
                // Hollow interior
                translate([0, 0, -0.001])
                    cylinder(h = collar_height + 0.002, r = collar_inner_r);
            }
    }

    // --- Subtractions ---

    // Base circular void + deeper bore continuation (r=0.053 continuous hole)
    translate([void_x, void_y, bore_lower_z1])
        cylinder(h = base_top_z - bore_lower_z1 + 0.002, r = bore_lower_r);

    // Upper stepped bore counterbore (r=0.0748, widens top portion)
    translate([bore_x, bore_y, bore_upper_z1])
        cylinder(h = bore_upper_z2 - bore_upper_z1, r = bore_upper_r);

    // Side recess 1 (horizontal cylinder on front face, along +y)
    translate([side1_cx, -0.001, side1_cz])
        rotate([-90, 0, 0])
            cylinder(h = side1_depth + 0.001, r = side1_r);

    // Side recess 2
    translate([side2_cx, -0.001, side2_cz])
        rotate([-90, 0, 0])
            cylinder(h = side2_depth + 0.001, r = side2_r);

    // Underside circular recesses (vertical cylinders cut upward from base underside)
    for (pos = under_positions) {
        translate([pos[0], pos[1], under_z_start - 0.001])
            cylinder(h = under_depth + 0.002, r = under_r);
    }
}