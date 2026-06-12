// Resolution for smooth curved surfaces
$fn = 100;

// Main body dimensions
upper_dia = 40;
upper_height = 60;
side_dia = 28;
side_height = 35;
side_offset_x = 22;

// Upper concentric stepped bore (from top)
bore_d_large = 26;
bore_d_mid = 20;
bore_d_small = 14;
bore_h_large = 10;
bore_h_mid = 28;
bore_h_small = 48;

// Small round cut features (openings / recesses)
cut_a_dia = 6;          // Horizontal through upper along Y
cut_a_z = 30;
cut_b_dia = 5;          // Vertical from top of side cylinder
cut_b_x = side_offset_x;
cut_b_depth = 12;
cut_c_dia = 8;          // From -X into upper cylinder
cut_c_z = 22;
cut_c_depth = 20;
cut_d_dia = 6;          // From +X side of side cylinder inward
cut_d_z = 12;
cut_d_depth = 12;

// Underside annular reliefs
relief1_od = 32;
relief1_id = 20;
relief1_depth = 2;
relief1_x = 0;
relief1_y = 0;

relief2_od = 24;
relief2_id = 20;
relief2_depth = 1.5;
relief2_x = side_offset_x;
relief2_y = 0;

// Deeper circular cuts from bottom (stepped)
bottom1_x = side_offset_x;
bottom1_y = 0;
bottom1_d_large = 16;
bottom1_d_small = 10;
bottom1_h_large = 6;
bottom1_h_small = 16;

bottom2_x = 0;
bottom2_y = 0;
bottom2_d_large = 16;
bottom2_d_small = 8;
bottom2_h_large = 5;
bottom2_h_small = 14;

// Module: annular relief ring for underside grooves
module annular_relief(x, y, od, id, h) {
    translate([x, y, -0.02]) {
        difference() {
            cylinder(h = h + 0.04, d = od);
            translate([0, 0, -0.01])
                cylinder(h = h + 0.06, d = id);
        }
    }
}

// Module: stepped bore cutter aligned to top face
module top_stepped_bore() {
    translate([0, 0, upper_height + 0.01]) {
        translate([0, 0, -bore_h_large])
            cylinder(h = bore_h_large + 0.02, d = bore_d_large);
        translate([0, 0, -bore_h_mid])
            cylinder(h = bore_h_mid + 0.02, d = bore_d_mid);
        translate([0, 0, -bore_h_small])
            cylinder(h = bore_h_small + 0.02, d = bore_d_small);
    }
}

// Module: stepped circular cut from underside
module bottom_stepped_cut(x, y, d_large, d_small, h_large, h_small) {
    translate([x, y, -0.02]) {
        cylinder(h = h_large + 0.04, d = d_large);
        cylinder(h = h_small + 0.04, d = d_small);
    }
}

// Main model
difference() {
    // Base solid: overlapping vertical round solids
    union() {
        // Upper sleeve-like cylinder
        cylinder(h = upper_height, d = upper_dia);
        
        // Lower side cylinder overlapping the upper
        translate([side_offset_x, 0, 0])
            cylinder(h = side_height, d = side_dia);
    }
    
    // Concentric stepped bore in upper cylinder
    top_stepped_bore();
    
    // Small round cut profiles (openings and recesses)
    // Horizontal through-hole along Y through upper cylinder
    translate([0, 0, cut_a_z])
        rotate([90, 0, 0])
            cylinder(h = upper_dia + 10, d = cut_a_dia, center = true);
    
    // Vertical recess from top of side cylinder
    translate([cut_b_x, 0, side_height])
        cylinder(h = cut_b_depth + 0.02, d = cut_b_dia);
    
    // Side recess from -X into upper cylinder
    translate([-upper_dia / 2, 0, cut_c_z])
        rotate([0, 90, 0])
            cylinder(h = cut_c_depth, d = cut_c_dia);
    
    // Side recess from +X into side cylinder
    translate([side_offset_x + side_dia / 2, 0, cut_d_z])
        rotate([0, -90, 0])
            cylinder(h = cut_d_depth, d = cut_d_dia);
    
    // Underside shallower annular reliefs
    annular_relief(relief1_x, relief1_y, relief1_od, relief1_id, relief1_depth);
    annular_relief(relief2_x, relief2_y, relief2_od, relief2_id, relief2_depth);
    
    // Deeper circular cuts from underside through multiple depth levels
    bottom_stepped_cut(bottom1_x, bottom1_y, bottom1_d_large, bottom1_d_small, bottom1_h_large, bottom1_h_small);
    bottom_stepped_cut(bottom2_x, bottom2_y, bottom2_d_large, bottom2_d_small, bottom2_h_large, bottom2_h_small);
}