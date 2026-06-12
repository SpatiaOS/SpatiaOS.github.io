// Parametric Variables
shoulder_height = 0;       // Shared shoulder plane at z=0
cylinder_radius = 0.1875;  // Radius of both main cylinders
cylinder_height = 0.5625;  // Height of each cylinder from shoulder
cylinder_offset = 0.2;     // Lateral offset between cylinder centers
$fn = 100;                 // Smoothness for curved surfaces

// Positive side removal parameters
pos_hole1_radius = 0.0975;
pos_hole2_radius = 0.0534;
pos_reach = 0.9375;        // Reach from shoulder into positive side

// Negative side removal parameters
neg_central_radius = 0.0562;
neg_central_reach = 0.375; // Reach from shoulder into negative side
neg_annular1_inner = 0.0562;
neg_annular1_outer = 0.1162;
neg_annular2_inner = 0.0562;
neg_annular2_outer = 0.075;
neg_annular_depth = 0.0562; // Reach from shoulder into negative side

// Main body: Two overlapping cylinders from shoulder
module main_body() {
    // First cylinder
    translate([cylinder_offset/2, 0, shoulder_height])
        cylinder(h=cylinder_height, r=cylinder_radius);
    
    // Second cylinder (overlapping)
    translate([-cylinder_offset/2, 0, shoulder_height])
        cylinder(h=cylinder_height, r=cylinder_radius);
}

// Positive side cuts (from top, going down)
module positive_cuts() {
    // First hole (larger)
    translate([cylinder_offset/2, 0, shoulder_height + cylinder_height - pos_reach])
        cylinder(h=pos_reach, r=pos_hole1_radius);
    
    // Second hole (smaller)
    translate([cylinder_offset/2, 0, shoulder_height + cylinder_height - pos_reach])
        cylinder(h=pos_reach, r=pos_hole2_radius);
}

// Negative side cuts (from bottom, going up)
module negative_cuts() {
    // Central hole
    translate([0, 0, shoulder_height - neg_central_reach])
        cylinder(h=neg_central_reach, r=neg_central_radius);
    
    // First annular recess
    translate([0, 0, shoulder_height - neg_annular_depth])
        difference() {
            cylinder(h=neg_annular_depth, r=neg_annular1_outer);
            cylinder(h=neg_annular_depth, r=neg_annular1_inner);
        }
    
    // Second annular recess
    translate([0, 0, shoulder_height - neg_annular_depth])
        difference() {
            cylinder(h=neg_annular_depth, r=neg_annular2_outer);
            cylinder(h=neg_annular_depth, r=neg_annular2_inner);
        }
}

// Final model: Main body with all cuts removed
difference() {
    main_body();
    positive_cuts();
    negative_cuts();
}