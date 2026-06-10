// Parameters - Main Base
base_length = 0.742363;
base_width = 0.535615;
base_height = 0.094385;
extrusion_depth = 0.0944;

// Base void parameters
void_left_offset = 0.1583;
void_front_offset = 0.3113;
void_radius = 0.053;

// Collar parameters
collar_left_offset = 0.0617;
collar_front_offset = 0.2147;
collar_outer_radius = 0.0966;
collar_inner_radius = 0.0748;
collar_height = 0.1452;
collar_top_z = 0.2396;

// Stepped bore parameters
bore_left_offset = 0.1583;
bore_front_offset = 0.3113;
bore_large_radius = 0.0748;
bore_small_radius = 0.053;
bore_shallow_start = 0.0218;
bore_shallow_end = 0.0944;
bore_shallow_depth = 0.0726;
bore_deep_start = -0.0944;
bore_deep_end = -0.0218;
bore_deep_depth = 0.0726;

// Side recess parameters
recess1_left_offset = 0.4487;
recess1_front_offset = 0.0472;
recess1_radius = 0.0073;
recess1_start_z = 0.0399;
recess1_end_z = 0.0545;
recess1_depth = 0.0073;

recess2_left_offset = 0.5939;
recess2_front_offset = 0.0472;
recess2_radius = 0.0073;
recess2_start_z = 0.0399;
recess2_end_z = 0.0545;
recess2_depth = 0.0073;

// Underside recess parameters
underside_recess_radius = 0.0221;
underside_recess_depth = 0.0152;
underside_positions = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Resolution
$fn = 100;

// Main base module
module main_base() {
    translate([0, 0, -base_height])
    cube([base_length, base_width, base_height]);
}

// Base void module
module base_void() {
    translate([void_left_offset, void_front_offset, -base_height - 0.001])
    cylinder(h = base_height + 0.002, r = void_radius);
}

// Collar module
module collar() {
    translate([collar_left_offset + collar_outer_radius, 
               collar_front_offset + collar_outer_radius, 
               extrusion_depth])
    difference() {
        cylinder(h = collar_height, r = collar_outer_radius);
        translate([0, 0, -0.001])
        cylinder(h = collar_height + 0.002, r = collar_inner_radius);
    }
}

// Stepped bore module
module stepped_bore() {
    // Shallow bore section
    translate([bore_left_offset, bore_front_offset, bore_shallow_start])
    cylinder(h = bore_shallow_depth, r = bore_large_radius);
    
    // Deep bore section
    translate([bore_left_offset, bore_front_offset, bore_deep_start])
    cylinder(h = bore_deep_depth, r = bore_small_radius);
}

// Side recess module
module side_recess(left_offset, front_offset, radius, start_z, end_z, depth) {
    translate([left_offset, front_offset, start_z])
    cylinder(h = end_z - start_z, r = radius);
}

// Underside recess module
module underside_recess(x_offset, y_offset) {
    translate([x_offset, y_offset, -base_height - 0.001])
    cylinder(h = underside_recess_depth + 0.001, r = underside_recess_radius);
}

// Main model assembly
difference() {
    // Start with base and collar
    union() {
        main_base();
        collar();
    }
    
    // Subtract all voids and recesses
    base_void();
    stepped_bore();
    
    // Side recesses
    side_recess(recess1_left_offset, recess1_front_offset, 
                recess1_radius, recess1_start_z, recess1_end_z, recess1_depth);
    side_recess(recess2_left_offset, recess2_front_offset, 
                recess2_radius, recess2_start_z, recess2_end_z, recess2_depth);
    
    // Underside recesses
    for (pos = underside_positions) {
        underside_recess(pos[0], pos[1]);
    }
}