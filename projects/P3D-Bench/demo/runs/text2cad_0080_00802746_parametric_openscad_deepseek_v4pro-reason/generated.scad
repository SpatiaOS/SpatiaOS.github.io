// Parametric stepped cylindrical part
// All dimensions in inches

// Cylinder properties
cyl_radius = 0.1875;
cyl_height = 0.5625;
step_offset_x = 0.06;        // lateral offset of upper cylinder relative to lower cylinder (creates stepped silhouette)

// Positive side (upper) circular cuts
pos_hole1_radius = 0.0975;
pos_hole2_radius = 0.0534;
pos_hole_reach   = 0.9375;   // depth from shoulder upward

// Locations of positive-side holes (within upper cylinder cross-section)
pos_hole1_x = step_offset_x; // larger hole on upper cylinder center
pos_hole1_y = 0;
pos_hole2_x = step_offset_x + 0.08; // smaller hole offset to be separate
pos_hole2_y = 0;

// Negative side (lower) central hole
neg_central_radius = 0.0562;
neg_central_reach  = 0.375;  // depth from shoulder downward

// Negative side annular recesses (shallow rings)
annular_inner_rad  = 0.0562; // same as central hole radius
annular_outer1_rad = 0.1162;
annular_outer2_rad = 0.075;
annular_depth      = 0.0562; // depth from shoulder downward

$fn = 100; // smooth curves

// ---- Main body ----
module main_body() {
    union() {
        // Lower cylinder (centered at origin, extends down from shoulder)
        translate([0, 0, -cyl_height])
            cylinder(h = cyl_height, r = cyl_radius, center = false);

        // Upper cylinder (offset, extends up from shoulder)
        translate([step_offset_x, 0, 0])
            cylinder(h = cyl_height, r = cyl_radius, center = false);
    }
}

// ---- Cuts on the positive side (upper) ----
module positive_cuts() {
    // Larger hole
    translate([pos_hole1_x, pos_hole1_y, 0])
        cylinder(h = pos_hole_reach, r = pos_hole1_radius, center = false);
    // Smaller separate hole
    translate([pos_hole2_x, pos_hole2_y, 0])
        cylinder(h = pos_hole_reach, r = pos_hole2_radius, center = false);
}

// ---- Central hole on the negative side (lower) ----
module negative_central_hole() {
    translate([0, 0, -neg_central_reach])
        cylinder(h = neg_central_reach, r = neg_central_radius, center = false);
}

// ---- Annular recess ring (to be subtracted) ----
module annular_recess(outer_r) {
    // solid ring of depth annular_depth, inner hole equals central hole radius
    difference() {
        translate([0, 0, -annular_depth])
            cylinder(h = annular_depth, r = outer_r);
        translate([0, 0, -annular_depth])
            cylinder(h = annular_depth, r = annular_inner_rad);
    }
}

// ---- Combine all cuts ----
module all_cuts() {
    positive_cuts();
    negative_central_hole();
    annular_recess(annular_outer1_rad);
    annular_recess(annular_outer2_rad);
}

// ---- Final part ----
difference() {
    main_body();
    all_cuts();
}