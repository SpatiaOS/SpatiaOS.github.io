// Parameters
$fn = 100;

// Main body dimensions (shared shoulder at Z=0)
main_radius = 0.1875;
upper_reach = 0.5625;
lower_reach = 0.5625;
lateral_offset = 0.125; // Lateral shift for lower section to create stepped silhouette

// Positive side (Z+) circular removals
pos_hole1_radius = 0.0975;
pos_hole1_reach = 0.9375;
pos_hole2_radius = 0.0534;
pos_hole2_reach = 0.9375;
pos_hole2_offset_x = 0.15; // Separate lateral placement

// Negative side (Z-) central circular removal
neg_central_radius = 0.0562;
neg_central_reach = 0.375;

// Negative side (Z-) annular recesses
ann1_outer_r = 0.1162;
ann1_inner_r = 0.0562;
ann1_reach = 0.0562;
ann2_outer_r = 0.075;
ann2_inner_r = 0.0562;
ann2_reach = 0.0562;

// Helper module for annular cuts
module annular_recess(outer_r, inner_r, depth) {
    difference() {
        cylinder(h = depth, r = outer_r, center = false);
        translate([0, 0, -0.005]) cylinder(h = depth + 0.01, r = inner_r, center = false);
    }
}

// Main model construction
difference() {
    // Base geometry: attached vertical circular solids
    union() {
        // Upper section extending from shared shoulder
        translate([0, 0, 0]) cylinder(h = upper_reach, r = main_radius, center = false);
        // Lower section extending from shared shoulder, laterally overlapping
        translate([lateral_offset, 0, -lower_reach]) cylinder(h = lower_reach, r = main_radius, center = false);
    }

    // Positive side circular removals (extend upward from shoulder)
    translate([0, 0, 0]) cylinder(h = pos_hole1_reach + 0.01, r = pos_hole1_radius, center = false);
    translate([pos_hole2_offset_x, 0, 0]) cylinder(h = pos_hole2_reach + 0.01, r = pos_hole2_radius, center = false);

    // Negative side central circular removal (extend downward from shoulder)
    translate([0, 0, -neg_central_reach]) cylinder(h = neg_central_reach + 0.02, r = neg_central_radius, center = false);

    // Negative side annular recesses (extend downward from shoulder)
    translate([0, 0, -ann1_reach]) annular_recess(ann1_outer_r, ann1_inner_r, ann1_reach + 0.02);
    translate([0, 0, -ann2_reach]) annular_recess(ann2_outer_r, ann2_inner_r, ann2_reach + 0.02);
}