// Parametric CAD Model - Base with Stepped Stack and Raised Region
// All dimensions in millimeters

// ==================== PARAMETERS ====================
// Main base dimensions
base_length = 0.75;
base_width = 0.364251;
base_height = 0.080711;
extrusion_depth = 0.0807;

// Circular through opening in base
hole_radius = 0.0396;
hole_x = 0.4987;
hole_y = 0.1821;

// Lower collar parameters
collar_radius = 0.1104;
collar_center_x = 0.1865;
collar_center_y = 0.1821;
collar_footprint = 0.220812;
collar_offset_left = 0.0761;
collar_offset_right = 0.4531;
collar_offset_front = 0.0717;
collar_offset_back = 0.0718;
collar_height = 0.0914;

// Upper post parameters
post_radius = 0.0563;
post_footprint = 0.1126;
post_offset_left = 0.1302;
post_offset_right = 0.5072;
post_offset_front = 0.1258;
post_offset_back = 0.1259;
post_height = 0.2893;

// Raised rounded region parameters
raised_length = 0.4584;
raised_width = 0.3356;
raised_offset_left = 0.2916;
raised_offset_right = 0;
raised_offset_front = 0.0144;
raised_offset_back = 0.0143;
raised_height = 0.0411;

// Circular profile in raised region
raised_hole_radius = 0.0396;
raised_hole_x = 0.4987;
raised_hole_y = 0.1822;

// Rectangular rib parameters
rib_length = 0.182741;
rib_width = 0.094416;
rib_offset_left = 0.5673;
rib_offset_right = 0;
rib_offset_front = 0.1349;
rib_offset_back = 0.135;
rib_height = 0.0305;

// Resolution for curved surfaces
$fn = 100;

// ==================== MODULES ====================

// Main base with through hole
module main_base() {
    difference() {
        // Base solid block
        cube([base_length, base_width, base_height]);
        
        // Circular through opening
        translate([hole_x, hole_y, -0.001])
            cylinder(h = base_height + 0.002, r = hole_radius);
    }
}

// Lower circular collar
module lower_collar() {
    // Calculate collar position from offsets
    collar_x = collar_offset_left;
    collar_y = collar_offset_front;
    
    translate([collar_x, collar_y, base_height])
        cylinder(h = collar_height, r = collar_radius);
}

// Upper solid post
module upper_post() {
    // Calculate post position from offsets
    post_x = post_offset_left;
    post_y = post_offset_front;
    
    translate([post_x, post_y, base_height + collar_height])
        cylinder(h = post_height, r = post_radius);
}

// Raised rounded region on right side
module raised_region() {
    // Calculate raised region position
    raised_x = raised_offset_left;
    raised_y = raised_offset_front;
    
    difference() {
        // Solid raised block
        translate([raised_x, raised_y, base_height])
            cube([raised_length, raised_width, raised_height]);
        
        // Circular profile in raised region
        translate([raised_hole_x, raised_hole_y, base_height - 0.001])
            cylinder(h = raised_height + 0.002, r = raised_hole_radius);
    }
}

// Rectangular rib/tab on raised region
module rectangular_rib() {
    // Calculate rib position
    rib_x = rib_offset_left;
    rib_y = rib_offset_front;
    
    translate([rib_x, rib_y, base_height + raised_height])
        cube([rib_length, rib_width, rib_height]);
}

// ==================== MAIN ASSEMBLY ====================

union() {
    // Base structure
    main_base();
    
    // Stepped stack (collar + post)
    lower_collar();
    upper_post();
    
    // Raised region with circular profile
    raised_region();
    
    // Rectangular rib on raised region
    rectangular_rib();
}