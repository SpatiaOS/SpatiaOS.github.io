// Global Resolution Setting
$fn = 100;

// ------------------------------
// All Parametric Dimensions
// ------------------------------
// Main Base Parameters
base_length = 0.75;          // X-axis total length
base_width = 0.364251;       // Y-axis total width
base_height = 0.0807;        // Z-axis extrusion height
base_corner_radius = 0.02;   // Rounded outer edge radius
base_hole_x = 0.4987;        // Base hole X position from left edge
base_hole_y = 0.1821;        // Base hole Y position from front edge
base_hole_r = 0.0396;        // Base through hole radius
// Inner Slot Parameters (through void)
slot_x_start = 0.27;
slot_x_end = 0.39;
slot_y_start = 0.05;
slot_y_end = 0.31;
slot_end_radius = 0.03;

// Coaxial Stepped Stack Parameters
collar_x = 0.1865;           // Collar X center from left edge
collar_y = 0.1821;           // Collar Y center from front edge
collar_r = 0.1104;           // Lower collar radius
collar_height = 0.0914;      // Collar height above base top
post_r = 0.0563;             // Upper post radius
post_height = 0.2893;        // Post height above collar shoulder

// Right Raised Region Parameters
raised_x_offset = 0.2916;    // Offset from left edge
raised_y_offset = 0.0144;    // Offset from front edge
raised_length = 0.4584;      // X-axis footprint length
raised_width = 0.3356;       // Y-axis footprint width
raised_height = 0.0411;      // Height above base top
raised_corner_radius = 0.02; // Rounded edge radius for region
raised_circle_x = 0.4987;    // Included circle X center
raised_circle_y = 0.1822;    // Included circle Y center
raised_circle_r = 0.0396;    // Included circle radius

// Upper Rectangular Tab Parameters
tab_x_offset = 0.5673;       // Offset from left edge
tab_y_offset = 0.1349;       // Offset from front edge
tab_length = 0.182741;       // X-axis footprint length
tab_width = 0.094416;        // Y-axis footprint width
tab_height = 0.0305;         // Height above raised region shoulder

// ------------------------------
// Helper Modules
// ------------------------------
module rounded_rectangle_2d(w, h, r) {
    // Generates 2D rounded rectangle of width w, height h, corner radius r
    hull() {
        translate([r, r]) circle(r=r);
        translate([w - r, r]) circle(r=r);
        translate([w - r, h - r]) circle(r=r);
        translate([r, h - r]) circle(r=r);
    }
}

// ------------------------------
// Component Modules
// ------------------------------
module main_base() {
    // Main base body with rounded edges and through voids
    difference() {
        // Outer solid base shape
        linear_extrude(height=base_height) {
            rounded_rectangle_2d(base_length, base_width, base_corner_radius);
        }
        // Inner slot through cut
        linear_extrude(height=base_height + 0.1) {
            translate([slot_x_start, slot_y_start])
            rounded_rectangle_2d(slot_x_end - slot_x_start, slot_y_end - slot_y_start, slot_end_radius);
        }
        // Base circular through hole
        translate([base_hole_x, base_hole_y, -0.05])
        cylinder(h=base_height + 0.1, r=base_hole_r);
    }
}

module coaxial_stack() {
    // Lower collar + upper post solid stack
    translate([collar_x, collar_y, base_height]) {
        cylinder(h=collar_height, r=collar_r);
        translate([0, 0, collar_height])
        cylinder(h=post_height, r=post_r);
    }
}

module raised_right_region() {
    // Raised rounded region on right side plus upper tab
    union() {
        // Main raised rounded body
        linear_extrude(height=raised_height) {
            union() {
                translate([raised_x_offset, raised_y_offset])
                rounded_rectangle_2d(raised_length, raised_width, raised_corner_radius);
                translate([raised_circle_x, raised_circle_y])
                circle(r=raised_circle_r);
            }
        }
        // Upper rectangular tab
        translate([tab_x_offset, tab_y_offset, raised_height])
        cube([tab_length, tab_width, tab_height]);
    }
}

// ------------------------------
// Final Assembly
// ------------------------------
union() {
    main_base();
    coaxial_stack();
    translate([0, 0, base_height]) raised_right_region();
}