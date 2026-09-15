// OpenSCAD Model of Rounded Wedge Base
// Global resolution for curved surfaces
$fn = 128;

// -------------------------- PARAMETERS --------------------------
// Main rounded wedge base overall dimensions
base_length = 0.740822;    // X: Total left-right length
base_width = 0.672842;     // Y: Total front-back width
base_extrude = 0.1718;     // Main extrusion depth above base plane
base_corner_r = 0.08;      // Corner radius for rounded outer perimeter lobes
wall_thickness = 0.04;     // Thickness of outer perimeter rim

// Central circular through opening
hole_cx = 0.3687;          // X: Center distance from left edge
hole_cy = 0.4283;          // Y: Center distance from front edge
hole_r = 0.2165;           // Opening radius

// Shallow circular upper cover feature
upper_cx = 0.3688;         // X: Center distance from left edge
upper_cy = 0.4282;         // Y: Center distance from front edge
upper_r = 0.2165;          // Feature radius
upper_h = 0.0206;          // Feature height/extrusion depth

// Narrow solid web crossing central opening
web_x_left = 0.3434;       // X: Left edge offset from base left
web_x_right_offset = 0.372;// X: Right edge offset from base right
web_y_front = 0.2119;      // Y: Front edge offset from base front
web_y_back_offset = 0.028; // Y: Back edge offset from base back
web_h = 0.1718;            // Web height/extrusion depth
web_x_right = base_length - web_x_right_offset;
web_y_back = base_width - web_y_back_offset;
web_thick = web_x_right - web_x_left;
web_width = web_y_back - web_y_front;

// Small round solid post feature inside central opening
post_cx = 0.4796;          // X: Center distance from left edge
post_cy = 0.4282;          // Y: Center distance from front edge
post_r = 0.0754;           // Post radius
post_h = 0.1718;           // Post height/extrusion depth

// Circular removed recess in post/underside
recess_cx = 0.4796;        // X: Center distance from left edge
recess_cy = 0.4283;        // Y: Center distance from front edge
recess_r = 0.0754;         // Recess radius
recess_z_low = -0.1512;    // Z: Lower extent (below base plane Z=0)
recess_z_high = 0.0206;    // Z: Upper extent (above base plane Z=0)
recess_depth = recess_z_high - recess_z_low;

// Underside stepped geometry
rim_below_depth = 0.0206;  // Depth of outer rim below base plane Z=0
pad_thickness = 0.1512;    // Thickness of solid upper pad
pad_z_bottom = 0.0206;     // Z: Bottom face of upper pad
pad_z_top = pad_z_bottom + pad_thickness; // Z: Top face of upper base

// Corner slots near rounded outer lobes
slot_inset = 0.1;          // Inset distance from corners
slot_length = 0.06;        // Slot length
slot_width = 0.02;         // Slot width

// -------------------------- MODULES --------------------------
// 2D Rounded rectangle, origin at front-left corner, corner radius r
module rounded_rect(w, h, r) {
    r = min(r, w/2, h/2);
    translate([r, r])
    minkowski() {
        square([w - 2*r, h - 2*r]);
        circle(r);
    }
}

// -------------------------- MAIN MODEL --------------------------
difference() {
    // Union of all solid components
    union() {
        // Outer perimeter rim (hollow underside wall)
        translate([0, 0, -rim_below_depth])
        linear_extrude(height = pad_z_top + rim_below_depth) {
            difference() {
                rounded_rect(base_length, base_width, base_corner_r);
                offset(r = -wall_thickness)
                    rounded_rect(base_length, base_width, base_corner_r);
            }
        }

        // Solid upper pad (main body, 0.1512 thick)
        translate([0, 0, pad_z_bottom])
        linear_extrude(height = pad_thickness)
            rounded_rect(base_length, base_width, base_corner_r);

        // Support web crossing central opening
        translate([web_x_left, web_y_front, 0])
            cube([web_thick, web_width, web_h]);

        // Round solid post inside central opening
        translate([post_cx, post_cy, 0])
            cylinder(r=post_r, h=post_h, center=false);

        // Shallow circular upper cover feature
        translate([upper_cx, upper_cy, pad_z_top])
            cylinder(r=upper_r, h=upper_h, center=false);
    }

    // -------------------------- CUTOUTS --------------------------
    // Central through opening in upper pad
    translate([hole_cx, hole_cy, pad_z_bottom - 0.5])
        cylinder(r=hole_r, h=pad_thickness + 1, center=false);

    // Deep circular recess through underside into post
    translate([recess_cx, recess_cy, recess_z_low])
        cylinder(r=recess_r, h=recess_depth, center=false);

    // Four angled through slots near rounded corner lobes
    // Front-left corner slot
    translate([slot_inset, slot_inset, -rim_below_depth - 0.1])
    rotate([0, 0, 45])
        cube([slot_length, slot_width, pad_z_top + rim_below_depth + 0.2], center=true);
    // Front-right corner slot
    translate([base_length - slot_inset, slot_inset, -rim_below_depth - 0.1])
    rotate([0, 0, -45])
        cube([slot_length, slot_width, pad_z_top + rim_below_depth + 0.2], center=true);
    // Back-left corner slot
    translate([slot_inset, base_width - slot_inset, -rim_below_depth - 0.1])
    rotate([0, 0, -45])
        cube([slot_length, slot_width, pad_z_top + rim_below_depth + 0.2], center=true);
    // Back-right corner slot
    translate([base_length - slot_inset, base_width - slot_inset, -rim_below_depth - 0.1])
    rotate([0, 0, 45])
        cube([slot_length, slot_width, pad_z_top + rim_below_depth + 0.2], center=true);
}