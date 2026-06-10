// Global Resolution Setting
$fn = 100;

// --------------------------
// Parametric Dimension Definitions
// --------------------------
// Main Base Dimensions
base_length = 0.742363;    // Total X axis length of base footprint
base_width = 0.535615;     // Total Y axis width of base footprint
base_height = 0.0944;      // Z height of base from underside datum
base_corner_radius = 0.03; // Radius of rounded footprint corners

// Base Plane Void (shared axis with collar and bore)
common_axis_x = 0.1583;    // X offset from left edge of common axis
common_axis_y = 0.3113;    // Y offset from front edge of common axis
base_void_radius = 0.053;  // Radius of base plane through hole

// Upper Annular Collar Dimensions
collar_outer_r = 0.0966;   // Outer radius of upper collar
collar_inner_r = 0.0748;   // Inner radius of upper collar
collar_height = 0.1452;    // Height of collar above base top surface
collar_total_z = base_height + collar_height; // Total Z height from datum (0.2396 as specified)

// Stepped Coaxial Bore Dimensions
bore_upper_r = 0.0748;     // Radius of upper recessed band
bore_upper_z_start = 0.0218; // Start Z of upper recess
bore_upper_z_end = base_height; // End Z of upper recess (base top)
bore_lower_r = 0.053;      // Radius of lower deep bore
bore_lower_z_start = -0.0944; // Start Z of lower bore (below base underside)
bore_lower_z_end = -0.0218;  // End Z of lower bore

// Front Side Recess Dimensions
side_recess_r = 0.0073;    // Radius of front side recesses
side_recess_z_min = 0.0399; // Minimum Z of recess cut
side_recess_z_max = 0.0545; // Maximum Z of recess cut
side_recess_depth = 0.0073; // Cut depth from front face
side_recess_1_x = 0.4487;  // X position of first side recess
side_recess_2_x = 0.5939;  // X position of second side recess

// Underside Recess Dimensions
underside_recess_r = 0.0221; // Radius of underside circular recesses
underside_recess_depth = 0.0152; // Depth of underside recesses
// XY positions of 4 underside recesses [x offset, y offset]
underside_recess_positions = [
    [0.0526, 0.3108],
    [0.3248, 0.4519],
    [0.3248, 0.1717],
    [0.7137, 0.3112]
];

// --------------------------
// Module Definitions
// --------------------------
module rounded_base_footprint(length, width, corner_r) {
    // Generate 2D rounded rectangle footprint matching outer dimensions
    offset(r=corner_r)
    translate([corner_r, corner_r])
    square([length - 2*corner_r, width - 2*corner_r]);
}

// --------------------------
// Main Model Assembly
// --------------------------
difference() {
    // Positive Geometry: Base + Upper Collar
    union() {
        // Main Rounded Base
        linear_extrude(height=base_height)
        rounded_base_footprint(base_length, base_width, base_corner_radius);

        // Upper Annular Collar
        translate([common_axis_x, common_axis_y, base_height])
        difference() {
            cylinder(r=collar_outer_r, h=collar_height);
            cylinder(r=collar_inner_r, h=collar_height + 0.1); // Cut through entire collar
        }
    }

    // --------------------------
    // Cut Features
    // --------------------------
    // 1. Stepped Bore Features
    // Upper recessed band (r=0.0748)
    translate([common_axis_x, common_axis_y, bore_upper_z_start])
    cylinder(r=bore_upper_r, h = bore_upper_z_end - bore_upper_z_start);

    // Connecting base void (r=0.053) between lower and upper bore
    translate([common_axis_x, common_axis_y, bore_lower_z_end])
    cylinder(r=base_void_r, h = bore_upper_z_start - bore_lower_z_end);

    // Lower deep bore (r=0.053)
    translate([common_axis_x, common_axis_y, bore_lower_z_start])
    cylinder(r=bore_lower_r, h = bore_lower_z_end - bore_lower_z_start);

    // 2. Front Side Recesses
    // First side recess
    translate([side_recess_1_x, -0.005, (side_recess_z_min + side_recess_z_max)/2])
    rotate([90, 0, 0]) // Rotate cylinder to align along Y axis (front cut)
    cylinder(r=side_recess_r, h=side_recess_depth + 0.01);

    // Second side recess
    translate([side_recess_2_x, -0.005, (side_recess_z_min + side_recess_z_max)/2])
    rotate([90, 0, 0]) // Rotate cylinder to align along Y axis (front cut)
    cylinder(r=side_recess_r, h=side_recess_depth + 0.01);

    // 3. Underside Recesses
    for (pos = underside_recess_positions) {
        translate([pos[0], pos[1], 0])
        cylinder(r=underside_recess_r, h=underside_recess_depth);
    }
}