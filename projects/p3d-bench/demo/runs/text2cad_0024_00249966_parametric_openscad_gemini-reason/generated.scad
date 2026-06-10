// ==========================================
// Parametric Variables
// ==========================================

$fn = 100; // High resolution for smooth curves

// Main Base Dimensions
base_length = 0.75;
base_width = 0.364251;
base_height = 0.080711;
base_radius = base_width / 2;
base_x1 = base_radius;
base_x2 = base_length - base_radius;
base_y = base_radius;

// Base Inner Slot and Through Hole
slot_x1 = 0.1865;
slot_x2 = 0.4987;
slot_y = 0.1821;
slot_radius = 0.0396;

// Coaxial Round Stepped Stack - Lower Collar
collar_x = 0.1865;
collar_y = 0.1821;
collar_r = 0.1104;
collar_h = 0.0914;

// Coaxial Round Stepped Stack - Upper Post
post_x = 0.1865;
post_y = 0.1821;
post_r = 0.0563;
post_h = 0.2893;

// Raised Rounded Solid Region
raised_width = 0.3356;
raised_offset_x = 0.2916;
raised_offset_y = 0.0144;
raised_h = 0.0411;
raised_r = raised_width / 2;
raised_y = raised_offset_y + raised_r;
raised_x1 = raised_offset_x + raised_r;
raised_x2 = base_length - raised_r;

// Raised Region Circular Hole
raised_hole_x = 0.4987;
raised_hole_y = 0.1822;
raised_hole_r = 0.0396;

// Rectangular Solid Rib / Tab
rib_x = 0.5673;
rib_y = 0.1349;
rib_l = 0.182741;
rib_w = 0.094416;
rib_h = 0.0305;

// ==========================================
// Module Definitions
// ==========================================

// Main base with arc-based rounded outline and inner slot void
module main_base() {
    difference() {
        // Solid base footprint
        hull() {
            translate([base_x1, base_y, 0]) 
                cylinder(h=base_height, r=base_radius);
            translate([base_x2, base_y, 0]) 
                cylinder(h=base_height, r=base_radius);
        }
        
        // Inner slot-like opening including the base circular through opening
        hull() {
            translate([slot_x1, slot_y, -0.01]) 
                cylinder(h=base_height + 0.02, r=slot_radius);
            translate([slot_x2, slot_y, -0.01]) 
                cylinder(h=base_height + 0.02, r=slot_radius);
        }
    }
}

// Coaxial round stepped stack (solid added material)
module stepped_stack() {
    // Lower circular collar
    translate([collar_x, collar_y, base_height])
        cylinder(h=collar_h, r=collar_r);
        
    // Upper post
    translate([post_x, post_y, base_height + collar_h])
        cylinder(h=post_h, r=post_r);
}

// Raised rounded solid region with its own circular profile cut
module raised_region() {
    difference() {
        // Raised rounded footprint continuation
        hull() {
            translate([raised_x1, raised_y, base_height]) 
                cylinder(h=raised_h, r=raised_r);
            translate([raised_x2, raised_y, base_height]) 
                cylinder(h=raised_h, r=raised_r);
        }
        
        // Circular profile void on its plane
        translate([raised_hole_x, raised_hole_y, base_height - 0.01])
            cylinder(h=raised_h + 0.02, r=raised_hole_r);
    }
}

// Rectangular solid rib or tab (shallow added tier)
module rectangular_rib() {
    translate([rib_x, rib_y, base_height + raised_h])
        cube([rib_l, rib_w, rib_h]);
}

// ==========================================
// Main Assembly
// ==========================================

union() {
    main_base();
    stepped_stack();
    raised_region();
    rectangular_rib();
}