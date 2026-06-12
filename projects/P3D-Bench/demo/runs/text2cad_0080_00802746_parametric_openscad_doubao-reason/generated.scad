// Global resolution setting for smooth curved surfaces
$fn = 100;

// --------------------------
// Main Body Parameters
// --------------------------
main_cylinder_radius = 0.1875;
positive_side_extent = 0.5625;  // Distance from shared shoulder (z=0) to +Z end
negative_side_extent = 0.5625;  // Distance from shared shoulder (z=0) to -Z end

// --------------------------
// Positive Side Cut Parameters
// --------------------------
pos_large_hole_radius = 0.0975;
pos_large_hole_depth = 0.9375;  // Reach from shoulder into +Z direction
pos_small_hole_radius = 0.0534;
pos_small_hole_depth = 0.9375;
pos_small_hole_offset = 0.12;   // Lateral offset to keep separate from large hole

// --------------------------
// Negative Side Cut Parameters
// --------------------------
neg_central_hole_radius = 0.0562;
neg_central_hole_depth = 0.375; // Reach from shoulder into -Z direction
// First annular recess
annular1_inner_r = 0.0562;
annular1_outer_r = 0.1162;
annular1_depth = 0.0562;        // Reach from shoulder into -Z direction
// Second annular recess
annular2_inner_r = 0.0562;
annular2_outer_r = 0.075;
annular2_depth = 0.0562;        // Reach from shoulder into -Z direction
annular2_offset = 0.09;         // Lateral offset to keep separate from central features

// --------------------------
// Helper Modules
// --------------------------
// Generates a hollow annular (ring) recess shape
module annular_recess(inner_r, outer_r, depth) {
    difference() {
        cylinder(h=depth, r=outer_r, center=false);
        cylinder(h=depth + 0.1, r=inner_r, center=false);
    }
}

// --------------------------
// Main Model Construction
// --------------------------
difference() {
    // Main solid body: two attached cylinders on opposite sides of shared shoulder
    union() {
        // Positive side main cylinder
        translate([0, 0, 0])
            cylinder(h=positive_side_extent, r=main_cylinder_radius, center=false);
        // Negative side main cylinder
        translate([0, 0, -negative_side_extent])
            cylinder(h=negative_side_extent, r=main_cylinder_radius, center=false);
    }

    // --------------------------
    // Positive side material removals
    // --------------------------
    // Large central positive hole
    translate([0, 0, 0])
        cylinder(h=pos_large_hole_depth, r=pos_large_hole_radius, center=false);
    // Small separate positive hole
    translate([pos_small_hole_offset, 0, 0])
        cylinder(h=pos_small_hole_depth, r=pos_small_hole_radius, center=false);

    // --------------------------
    // Negative side material removals
    // --------------------------
    // Central negative hole
    translate([0, 0, -neg_central_hole_depth])
        cylinder(h=neg_central_hole_depth, r=neg_central_hole_radius, center=false);
    // First central annular recess
    translate([0, 0, -annular1_depth])
        annular_recess(annular1_inner_r, annular1_outer_r, annular1_depth);
    // Second offset annular recess
    translate([annular2_offset, 0, -annular2_depth])
        annular_recess(annular2_inner_r, annular2_outer_r, annular2_depth);
}