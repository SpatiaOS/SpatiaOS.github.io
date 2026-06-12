// Parameters
// Main solid geometry dimensions
solid_radius = 0.1875;
upper_reach = 0.5625;
lower_reach = 0.5625; // Extended symmetrically to accommodate negative cuts
lateral_offset = 0.1875; // Offset for lateral overlap creating stepped silhouette

// Positive side cut dimensions
pos_cut1_r = 0.0975;
pos_cut1_reach = 0.9375;

pos_cut2_r = 0.0534;
pos_cut2_reach = 0.9375;

// Negative side cut dimensions
neg_cut_r = 0.0562;
neg_cut_reach = 0.375;

neg_recess1_r_inner = 0.0562;
neg_recess1_r_outer = 0.1162;
neg_recess1_reach = 0.0562;

neg_recess2_r_inner = 0.0562;
neg_recess2_r_outer = 0.075;
neg_recess2_reach = 0.0562;

// Resolution for smooth curves
$fn = 100;

// Reusable module for creating an annular recess (hollow cylinder cut)
module annular_recess(r_inner, r_outer, depth) {
    difference() {
        cylinder(h=depth, r=r_outer);
        // Extend inner cylinder slightly to ensure clean subtraction without z-fighting
        translate([0, 0, -0.01])
            cylinder(h=depth + 0.02, r=r_inner);
    }
}

// Main solid geometry composed of overlapping vertical cylinders
module main_body() {
    union() {
        // Primary vertical circular solid
        translate([0, 0, -lower_reach])
            cylinder(h=lower_reach + upper_reach, r=solid_radius);
            
        // Second attached solid circular section, laterally overlapping
        translate([lateral_offset, 0, -lower_reach])
            cylinder(h=lower_reach + upper_reach, r=solid_radius);
    }
}

// Subtractive features reaching into the positive side (z > 0)
module positive_cuts() {
    // Main circular removal on the positive side
    translate([0, 0, 0])
        cylinder(h=pos_cut1_reach, r=pos_cut1_r);
        
    // Smaller separate circular removal (placed on the overlapping section)
    translate([lateral_offset, 0, 0])
        cylinder(h=pos_cut2_reach, r=pos_cut2_r);
}

// Subtractive features reaching into the negative side (z < 0)
module negative_cuts() {
    // Central circular removal on the negative side
    translate([0, 0, -neg_cut_reach])
        cylinder(h=neg_cut_reach, r=neg_cut_r);
        
    // First shallow annular recess
    translate([0, 0, -neg_recess1_reach])
        annular_recess(neg_recess1_r_inner, neg_recess1_r_outer, neg_recess1_reach);
        
    // Second shallow annular recess (applied to the secondary overlapping section)
    translate([lateral_offset, 0, -neg_recess2_reach])
        annular_recess(neg_recess2_r_inner, neg_recess2_r_outer, neg_recess2_reach);
}

// Final assembled model
difference() {
    main_body();
    positive_cuts();
    negative_cuts();
}