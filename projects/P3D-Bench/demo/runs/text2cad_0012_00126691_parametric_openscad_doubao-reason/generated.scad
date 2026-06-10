// ==============================
// Global Parameters (all units consistent)
// ==============================
// Base Slab Dimensions
base_length = 0.5;       // X-axis (left-right)
base_width = 0.75;       // Y-axis (front-back)
base_thickness = 0.0167; // Z-axis (height from datum Z=0)
$fn = 100;               // Curve resolution

// Upper Rear Rectangular Feature
upper_rear_x = 0.5;
upper_rear_y = 0.5;
upper_rear_front_offset = 0.25;
upper_rear_top_z = 0.2334; // Total height from base datum

// Edge Strips on Upper Rear Feature
strip_x_width = 0.0083;
strip_y_length = 0.5;
strip_z_thickness = 0.0083;
strip_front_offset = 0.25;

// Thin Transverse Upper Feature
transverse_x = 0.5;
transverse_y = 0.250819;
transverse_front_offset = 0.24922;
transverse_thickness = 0.0021;
transverse_top_z = 0.335265; // Total height from base datum

// Stepped Portion Dimensions
shallow_pad_x = 0.3;
shallow_pad_z_depth = 0.1;
deep_pad_x = 0.2;
deep_pad_z_depth = 0.2167;

// Internal Void Parameters
void_x = 0.15;
void_y = 0.3;
void_clearance = 0.01; // Ensure void cuts fully through material

// ==============================
// Module Definitions
// ==============================
module base_slab() {
    // Origin at front-left-bottom corner of base
    cube([base_length, base_width, base_thickness]);
}

module upper_rear_feature() {
    translate([0, upper_rear_front_offset, base_thickness])
    cube([
        upper_rear_x, 
        upper_rear_y, 
        upper_rear_top_z - base_thickness
    ]);
}

module edge_strips() {
    // Left edge strip
    translate([0, strip_front_offset, upper_rear_top_z])
    cube([strip_x_width, strip_y_length, strip_z_thickness]);
    
    // Right edge strip
    translate([base_length - strip_x_width, strip_front_offset, upper_rear_top_z])
    cube([strip_x_width, strip_y_length, strip_z_thickness]);
}

module transverse_feature() {
    translate([
        0, 
        transverse_front_offset, 
        transverse_top_z - transverse_thickness
    ])
    cube([transverse_x, transverse_y, transverse_thickness]);
}

module stepped_solid() {
    union() {
        // Shallow upper pad (above upper rear feature shoulder)
        translate([0, upper_rear_front_offset, upper_rear_top_z])
        cube([
            shallow_pad_x, 
            upper_rear_y, 
            shallow_pad_z_depth
        ]);
        
        // Deeper lower pad (below upper rear feature shoulder, same left/front/back edges)
        translate([0, upper_rear_front_offset, upper_rear_top_z - deep_pad_z_depth])
        cube([
            deep_pad_x, 
            upper_rear_y, 
            deep_pad_z_depth
        ]);
    }
}

module internal_void() {
    // Cuts fully through stepped solid region
    translate([
        0.025, 
        upper_rear_front_offset + 0.1, 
        upper_rear_top_z - deep_pad_z_depth - void_clearance
    ])
    cube([
        void_x, 
        void_y, 
        shallow_pad_z_depth + deep_pad_z_depth + 2*void_clearance
    ]);
}

// ==============================
// Main Assembly
// ==============================
union() {
    base_slab();
    upper_rear_feature();
    edge_strips();
    transverse_feature();
    
    // Stepped portion with internal void cutout
    difference() {
        stepped_solid();
        internal_void();
    }
}