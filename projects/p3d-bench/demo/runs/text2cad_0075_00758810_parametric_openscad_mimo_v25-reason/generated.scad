// Main base dimensions
length = 0.742363;
width = 0.535615;
base_height = 0.094385;
extrusion_depth = 0.0944;

// Base-plane circular void
void_left_offset = 0.1583;
void_front_offset = 0.3113;
void_radius = 0.053;

// Upper annular collar
collar_outer_radius = 0.0966;
collar_inner_radius = 0.0748;
collar_footprint = 0.1932;
collar_left_offset = 0.0617;
collar_right_offset = 0.4875;
collar_front_offset = 0.2147;
collar_back_offset = 0.1277;
collar_height_above_base = 0.1452;
collar_total_height = 0.2396;

// Stepped bore parameters
bore_left_offset = 0.1583;
bore_front_offset = 0.3113;
bore_radius_upper = 0.0748;
bore_radius_lower = 0.053;
bore_band_start = 0.0218;
bore_band_end = 0.0944;
bore_depth = 0.0726;
bore_envelope = 0.1496;

// Side recesses
side_recess_radius = 0.0073;
side_recess_depth = 0.0073;
side_recess_z_start = 0.0399;
side_recess_z_end = 0.0545;

// First side recess
side1_left_offset = 0.4487;
side1_front_offset = 0.0472;

// Second side recess
side2_left_offset = 0.5939;
side2_front_offset = 0.0472;

// Underside recesses
underside_radius = 0.0221;
underside_depth = 0.0152;

// Underside recess centers
underside_centers = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// Resolution
$fn = 100;

// Main model
difference() {
    // Main base with rounded edges
    union() {
        // Create rounded base using minkowski sum
        minkowski() {
            cube([length - 0.02, width - 0.02, base_height], center=false);
            cylinder(h=0.01, r=0.01, center=true);
        }
        
        // Upper annular collar
        translate([collar_left_offset + collar_footprint/2, 
                   collar_front_offset + collar_footprint/2, 
                   base_height]) {
            difference() {
                cylinder(h=collar_height_above_base, r=collar_outer_radius);
                cylinder(h=collar_height_above_base + 0.001, r=collar_inner_radius);
            }
        }
    }
    
    // Base-plane circular void (through hole)
    translate([void_left_offset, void_front_offset, -0.001]) {
        cylinder(h=base_height + 0.002, r=void_radius);
    }
    
    // Stepped bore - upper section
    translate([bore_left_offset, bore_front_offset, bore_band_start]) {
        cylinder(h=bore_depth, r=bore_radius_upper);
    }
    
    // Stepped bore - lower section
    translate([bore_left_offset, bore_front_offset, -0.001]) {
        cylinder(h=bore_band_start + 0.001, r=bore_radius_lower);
    }
    
    // First side recess
    translate([side1_left_offset, side1_front_offset, side_recess_z_start]) {
        cylinder(h=side_recess_depth, r=side_recess_radius);
    }
    
    // Second side recess
    translate([side2_left_offset, side2_front_offset, side_recess_z_start]) {
        cylinder(h=side_recess_depth, r=side_recess_radius);
    }
    
    // Underside circular recesses
    for (center = underside_centers) {
        translate([center[0], center[1], -0.001]) {
            cylinder(h=underside_depth + 0.001, r=underside_radius);
        }
    }
}