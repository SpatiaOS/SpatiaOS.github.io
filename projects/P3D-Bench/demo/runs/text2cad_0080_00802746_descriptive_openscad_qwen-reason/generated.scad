// Parameters
$fn = 100;

// Main vertical body dimensions
body_dia = 40;
body_height = 50;

// Upper sleeve-like cylinder dimensions
sleeve_dia = 52;
sleeve_height = 20;
sleeve_z = body_height - 2; // Overlap for clean union

// Lower side cylinder dimensions (vertical, offset to intersect curved walls)
side_dia = 24;
side_height = 35;
side_x_offset = 14;
side_z = 0;

// Stepped concentric bore (top-down levels)
bore1_d = 32; bore1_h = 12;
bore2_d = 22; bore2_h = 25;
bore3_d = 12; bore3_h = 40;

// Circular cutout parameters (side recesses/openings)
cutout_d = 14;
cutout_depth = 15;
cutout_z = 25;
cutout_angles = [0, 90, 180, 270];

// Underside feature parameters (annular relief + multi-level deep cut)
relief_od = 36;
relief_id = 20;
relief_depth = 6;
deep_cut_d1 = 16; deep_cut_h1 = 10;
deep_cut_d2 = 10; deep_cut_h2 = 15;

// Module: Base solid formed by overlapping vertical cylinders
module base_solid() {
    union() {
        // Primary vertical cylinder
        cylinder(h = body_height, d = body_dia, center = false);
        // Upper sleeve cylinder
        translate([0, 0, sleeve_z])
            cylinder(h = sleeve_height, d = sleeve_dia, center = false);
        // Lower side cylinder (overlaps main body)
        translate([side_x_offset, 0, side_z])
            cylinder(h = side_height, d = side_dia, center = false);
    }
}

// Module: Stepped concentric bore
module stepped_bore(top_z) {
    translate([0, 0, top_z]) {
        // Level 1 (shallowest)
        translate([0, 0, -bore1_h]) cylinder(h = bore1_h, d = bore1_d);
        // Level 2
        translate([0, 0, -(bore1_h + bore2_h)]) cylinder(h = bore2_h, d = bore2_d);
        // Level 3 (deepest)
        translate([0, 0, -(bore1_h + bore2_h + bore3_h)]) cylinder(h = bore3_h, d = bore3_d);
    }
}

// Module: Side circular cutouts (recesses/openings)
module side_cutouts() {
    for (a = cutout_angles) {
        rotate([0, 0, a])
            translate([body_dia / 2, 0, cutout_z])
            rotate([0, 90, 0])
                cylinder(h = cutout_depth + 0.2, d = cutout_d);
    }
}

// Module: Underside annular relief and multi-level deep cuts
module underside_features() {
    translate([0, 0, -0.1]) {
        // Annular relief (ring-shaped recess)
        difference() {
            cylinder(h = relief_depth + 0.2, d = relief_od);
            cylinder(h = relief_depth + 0.4, d = relief_id);
        }
        // Multi-level deep circular cut
        cylinder(h = deep_cut_h1 + 0.2, d = deep_cut_d1);
        translate([0, 0, deep_cut_h1]) cylinder(h = deep_cut_h2 + 0.2, d = deep_cut_d2);
    }
}

// Final model assembly
difference() {
    // Start with the overlapping solid base
    base_solid();
    
    // Subtract concentric stepped bore from top
    stepped_bore(body_height + sleeve_height);
    
    // Subtract side circular recesses/openings
    side_cutouts();
    
    // Subtract underside annular relief and deep cuts
    underside_features();
}