// Global resolution control for curved surfaces
$fn = 64;

/* -------------------------- PARAMETER DEFINITIONS ------------------------- */
// Base plate dimensions
base_length = 0.703125;   // X axis dimension (left-right)
base_width = 0.75;        // Y axis dimension (front-back)
base_height = 0.013125;   // Z axis dimension (thickness)
base_hole_r = 0.0328;     // Radius of base through hole
base_hole_x = 0.075;      // Hole X position from left edge
base_hole_y = 0.6562;     // Hole Y position from front edge

// Main rectangular block dimensions
block_length = 0.646875;  // X axis dimension
block_width = 0.50625;    // Y axis dimension
block_height = 0.645;     // Z axis dimension
block_x_offset = 0.0563;  // Offset from base left edge
block_y_offset = 0.0844;  // Offset from base front edge

// Annular collar dimensions
collar_outer_r = 0.0656;
collar_inner_r = 0.0328;
collar_height = 0.0375;
collar_common_x = 0.2062; // Shared X position for both collars
collar_y_pos = [0.1968, 0.4781]; // Y positions from front edge

// Shallow top recess dimensions
recess_depth = 0.0037;
recess_left = 0.1734;
recess_front = 0.1406;
recess_total_len = 0.473437; // Total X span of both recesses
recess_total_wid = 0.39375;  // Total Y span of both recesses
recess_gap = 0.06;            // Gap between the two separate recesses

// Collar center cut dimensions
center_cut_r = 0.0328;
center_cut_y_pos = [0.1969, 0.4781]; // Y positions for through cuts

/* --------------------------- MODULE DEFINITIONS --------------------------- */
// Reusable module for hollow annular collar
module annular_collar(outer_r, inner_r, height) {
    difference() {
        cylinder(r=outer_r, h=height, center=false);
        translate([0, 0, -0.001]) cylinder(r=inner_r, h=height + 0.002, center=false);
    }
}

/* ----------------------------- MAIN MODEL BODY ---------------------------- */
difference() {
    // Union of all positive solid geometry
    union() {
        // Base plate (origin at bottom left front corner)
        cube([base_length, base_width, base_height], center=false);

        // Main block mounted on top of base plate
        translate([block_x_offset, block_y_offset, base_height])
            cube([block_length, block_width, block_height], center=false);

        // Two separate annular collars on top of main block
        for (y = collar_y_pos) {
            translate([collar_common_x, y, base_height + block_height])
                annular_collar(collar_outer_r, collar_inner_r, collar_height);
        }
    }

    // All subtracted cut geometry
    // 1. Through hole in base plate
    translate([base_hole_x, base_hole_y, -0.01])
        cylinder(r=base_hole_r, h=base_height + 0.02, center=false);

    // 2. Two shallow blind recesses in block top face
    recess_x0 = recess_left;
    recess_x1 = recess_left + recess_total_len;
    recess_y0 = recess_front;
    recess_y_split1 = recess_front + (recess_total_wid - recess_gap) / 2;
    recess_y_split2 = recess_front + (recess_total_wid + recess_gap) / 2;
    recess_y1 = recess_front + recess_total_wid;
    recess_z0 = base_height + block_height - recess_depth;
    recess_z1 = base_height + block_height + 0.01;

    // First recess
    translate([recess_x0, recess_y0, recess_z0])
        cube([recess_x1 - recess_x0, recess_y_split1 - recess_y0, recess_z1 - recess_z0]);
    // Second recess
    translate([recess_x0, recess_y_split2, recess_z0])
        cube([recess_x1 - recess_x0, recess_y1 - recess_y_split2, recess_z1 - recess_z0]);

    // 3. Center cuts through collars and shallow recess only (not full block depth)
    cut_total_height = collar_height + recess_depth + 0.02;
    cut_z_start = base_height + block_height - recess_depth - 0.01;
    for (y = center_cut_y_pos) {
        translate([collar_common_x, y, cut_z_start])
            cylinder(r=center_cut_r, h=cut_total_height, center=false);
    }
}