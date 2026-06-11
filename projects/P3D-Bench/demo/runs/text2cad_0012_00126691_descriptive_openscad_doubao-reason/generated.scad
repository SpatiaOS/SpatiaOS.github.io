// ==============================================
// Global Configuration
// ==============================================
$fn = 64; // Smooth resolution for curved features

// ==============================================
// Core Parametric Dimensions (all units in mm)
// ==============================================
// Base Slab Parameters
base_width = 100;       // Total width of base (X axis)
base_depth = 80;        // Total depth of base (Y axis: front=0, back=base_depth)
base_thickness = 3;     // Thickness of base slab (Z axis)

// Rear Raised Block Parameters
rear_raise_depth = 50;  // Depth of rear raised section
rear_raise_height = 8;  // Height of rear section above base

// Side Edge Strip Parameters
side_strip_width = 6;   // Width of left/right raised strips
side_strip_height = 6;  // Height of side strips above base (shallow step)

// Transverse Cross Feature (with internal opening) Parameters
trans_thickness = 8;    // Thickness of cross feature along Y axis
trans_height = 10;      // Total height of cross feature above base
open_width = 70;        // Width of internal through opening
open_height = 4;        // Height of internal through opening

// Forward Continuation Feature Parameters
cont_width = 40;        // Width of forward protruding continuation
cont_depth = 25;        // Depth continuation extends forward from rear shoulder
cont_height = 4;        // Height of continuation feature
cont_z_offset = 2;      // Gap between continuation bottom and base (creates non-flat underside)

// ==============================================
// Reusable Module Definitions
// ==============================================
module base_slab(w, d, t) {
    // Thin flat base slab, origin centered on X axis, front at Y=0
    translate([-w/2, 0, 0])
        cube([w, d, t]);
}

module rear_raised_block(base_w, rear_d, rear_h, base_t, base_d) {
    // Larger raised section occupying rear of base
    translate([-base_w/2, base_d - rear_d, base_t])
        cube([base_w, rear_d, rear_h]);
}

module side_edge_strips(base_w, rear_d, strip_w, strip_h, base_t, base_d) {
    // Narrow raised strips along left/right edges of rear raised section
    union() {
        // Left strip
        translate([-base_w/2, base_d - rear_d, base_t])
            cube([strip_w, rear_d, strip_h]);
        // Right strip
        translate([base_w/2 - strip_w, base_d - rear_d, base_t])
            cube([strip_w, rear_d, strip_h]);
    }
}

module transverse_cross_feature(base_w, t_thick, t_h, o_w, o_h, base_t, rear_d, base_d) {
    // Spanning cross feature with internal through opening
    translate([-base_w/2, base_d - rear_d - t_thick, base_t])
    difference() {
        // Main cross bar
        cube([base_w, t_thick, t_h]);
        // Internal opening (cuts all the way through feature)
        translate([(base_w - o_w)/2, 0, (t_h - o_h)/2])
            cube([o_w, t_thick, o_h]);
    }
}

module forward_continuation(c_w, c_d, c_h, z_off, base_t, rear_d, base_d) {
    // Shallow protruding feature extending forward from rear shoulder
    translate([-c_w/2, base_d - rear_d, base_t + z_off])
        cube([c_w, c_d, c_h]);
}

// ==============================================
// Main Model Assembly (all features added as solid material)
// ==============================================
union() {
    // Base foundation
    base_slab(base_width, base_depth, base_thickness);
    
    // Rear raised main block
    rear_raised_block(base_width, rear_raise_depth, rear_raise_height, base_thickness, base_depth);
    
    // Side edge strips
    side_edge_strips(base_width, rear_raise_depth, side_strip_width, side_strip_height, base_thickness, base_depth);
    
    // Cross spanning feature with internal opening
    transverse_cross_feature(base_width, trans_thickness, trans_height, open_width, open_height, base_thickness, rear_raise_depth, base_depth);
    
    // Forward aligned continuation (creates stepped height and non-flat underside)
    forward_continuation(cont_width, cont_depth, cont_height, cont_z_offset, base_thickness, rear_raise_depth, base_depth);
}