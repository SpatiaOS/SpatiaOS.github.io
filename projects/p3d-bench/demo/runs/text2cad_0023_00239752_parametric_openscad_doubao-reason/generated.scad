// ==============================================
// Parameters (all dimensions as specified)
// ==============================================
// Base dimensions (X: length, Y: width, Z: height, underside at Z=0)
base_length = 0.28896;
base_width = 0.75;
base_height = 0.028846;
base_extrusion_depth = 0.0288;

// Rib parameters
rib_outside_span = 0.162037;  // Total X span of paired ribs
rib_edge_offset = 0.0635;     // Offset from base edges to outer rib edges
rib_height = 0.017308;        // Height above base top face
rib_extrusion_depth = 0.0173;
rib_width = rib_outside_span / 3;  // Equal width ribs + equal gap between them
rib_gap = rib_width;

// Stepped hole parameters
upper_recess_top_z = 0.0288;
upper_recess_bottom_z = 0.0057;
upper_recess_depth = upper_recess_top_z - upper_recess_bottom_z; // 0.0231 as specified
deep_cut_top_z = 0.0288;
deep_cut_bottom_z = -0.1154;
deep_cut_depth = deep_cut_top_z - deep_cut_bottom_z; // 0.1442 as specified

// Hole position definitions (X = left offset, Y = front offset)
hole_1_r = 0.013;  hole_1_x = 0.0352;  hole_1_y = 0.7072;
hole_2_r = 0.0173; hole_2_x = 0.1433;  hole_2_y = 0.0577;
hole_3_r = 0.013;  hole_3_x = 0.2538;  hole_3_y = 0.7072;

// Curved surface resolution
$fn = 64;

// ==============================================
// Module Definitions
// ==============================================
// Base solid
module base_solid() {
    cube([base_length, base_width, base_height]);
}

// Two separate lengthwise ribs
module lengthwise_ribs() {
    // Left rib
    translate([rib_edge_offset, 0, base_height])
        cube([rib_width, base_width, rib_height]);
    // Right rib
    translate([rib_edge_offset + rib_width + rib_gap, 0, base_height])
        cube([rib_width, base_width, rib_height]);
}

// Reusable stepped hole cutout
module stepped_hole(r, x_pos, y_pos) {
    translate([x_pos, y_pos, 0]) {
        // Upper shallow recess stage
        translate([0, 0, upper_recess_bottom_z + upper_recess_depth/2])
            cylinder(h=upper_recess_depth, r=r, center=true);
        // Deeper through cut stage
        translate([0, 0, deep_cut_bottom_z + deep_cut_depth/2])
            cylinder(h=deep_cut_depth, r=r, center=true);
    }
}

// ==============================================
// Main Model Assembly
// ==============================================
difference() {
    // Merge base and ribs
    union() {
        base_solid();
        lengthwise_ribs();
    }

    // Cut all three stepped holes
    stepped_hole(hole_1_r, hole_1_x, hole_1_y);
    stepped_hole(hole_2_r, hole_2_x, hole_2_y);
    stepped_hole(hole_3_r, hole_3_x, hole_3_y);
}