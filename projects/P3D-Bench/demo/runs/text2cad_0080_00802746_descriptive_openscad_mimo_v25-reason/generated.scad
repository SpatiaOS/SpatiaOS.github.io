// ============================================
// Overlapping Round Solid Assembly
// ============================================

// --- Global Resolution ---
$fn = 100;

// --- Upper Sleeve Parameters ---
upper_od = 50;          // Outer diameter of upper sleeve
upper_height = 80;      // Total height of upper sleeve
upper_wall = 5;         // Wall thickness of sleeve

// --- Bore Stepping Parameters ---
bore_d1 = 30;           // Largest bore diameter (top)
bore_d2 = 26;           // Second step bore diameter
bore_d3 = 22;           // Third step bore diameter
bore_d4 = 18;           // Deepest bore diameter (bottom)
bore_h1 = 20;           // Depth of first bore step from top
bore_h2 = 20;           // Depth of second bore step
bore_h3 = 20;           // Depth of third bore step
bore_h4 = 20;           // Depth of fourth bore step

// --- Lower Side Cylinder Parameters ---
lower_od = 60;          // Outer diameter of lower cylinder
lower_height = 40;      // Height of lower cylinder
lower_offset_x = 0;     // X offset (centered)
lower_offset_y = 28;    // Y offset from upper cylinder center
lower_offset_z = 0;     // Z base position

// --- Small Circular Cutout Parameters ---
cutout_d = 8;           // Diameter of small cutouts
cutout_depth = 6;       // Depth of small cutouts
cutout_count = 6;       // Number of cutouts around upper sleeve
cutout_z_pos = 55;      // Z position of cutouts on upper sleeve
cutout_lower_d = 10;    // Diameter of cutouts on lower cylinder
cutout_lower_depth = 5; // Depth of lower cutouts

// --- Bottom Relief Parameters ---
annular_outer_d = 44;   // Outer diameter of bottom annular relief
annular_inner_d = 34;   // Inner diameter of bottom annular relief
annular_depth = 3;      // Depth of annular relief
deep_cut_d = 20;        // Diameter of deep bottom cuts
deep_cut_depth = 10;    // Depth of deep bottom cuts
deep_cut_offset = 14;   // Offset of deep cuts from center

// --- Interior Multi-Level Cuts ---
interior_d1 = 16;       // Interior cut level 1 diameter
interior_d2 = 12;       // Interior cut level 2 diameter
interior_h1 = 8;        // Interior cut level 1 depth from bottom bore
interior_h2 = 12;       // Interior cut level 2 depth from bottom bore

// ============================================
// Upper Sleeve Module with Stepped Bore
// ============================================
module upper_sleeve() {
    difference() {
        // Main outer cylinder
        cylinder(h = upper_height, d = upper_od);
        
        // Stepped concentric bore from top
        // Step 1 (widest, top)
        translate([0, 0, upper_height - bore_h1])
            cylinder(h = bore_h1 + 1, d = bore_d1);
        
        // Step 2
        translate([0, 0, upper_height - bore_h1 - bore_h2])
            cylinder(h = bore_h2 + 1, d = bore_d2);
        
        // Step 3
        translate([0, 0, upper_height - bore_h1 - bore_h2 - bore_h3])
            cylinder(h = bore_h3 + 1, d = bore_d3);
        
        // Step 4 (narrowest, deepest)
        translate([0, 0, -1])
            cylinder(h = bore_h4 + 1, d = bore_d4);
    }
}

// ============================================
// Lower Side Cylinder Module
// ============================================
module lower_cylinder() {
    translate([lower_offset_x, lower_offset_y, lower_offset_z])
        cylinder(h = lower_height, d = lower_od);
}

// ============================================
// Small Circular Cutouts on Upper Sleeve
// ============================================
module upper_cutouts() {
    for (i = [0 : cutout_count - 1]) {
        angle = i * (360 / cutout_count);
        rotate([0, 0, angle])
            translate([upper_od / 2, 0, cutout_z_pos])
                rotate([0, 90, 0])
                    cylinder(h = cutout_depth, d = cutout_d);
    }
}

// ============================================
// Small Circular Cutouts on Lower Cylinder
// ============================================
module lower_cutouts() {
    // Cutouts on lower cylinder sides
    for (i = [0 : 3]) {
        angle = i * 90;
        translate([lower_offset_x, lower_offset_y, lower_height / 2])
            rotate([0, 0, angle])
                translate([lower_od / 2, 0, 0])
                    rotate([0, 90, 0])
                        cylinder(h = cutout_lower_depth, d = cutout_lower_d);
    }
    // Top face cutouts on lower cylinder
    for (i = [0 : 2]) {
        angle = i * 120 + 30;
        translate([lower_offset_x, lower_offset_y, lower_height])
            rotate([0, 0, angle])
                translate([lower_od / 4, 0, 0])
                    cylinder(h = cutout_lower_depth, d = cutout_lower_d, center = false);
    }
}

// ============================================
// Bottom Annular Relief and Deep Cuts
// ============================================
module bottom_features() {
    // Shallow annular relief ring
    translate([0, 0, -0.01])
        difference() {
            cylinder(h = annular_depth, d = annular_outer_d);
            translate([0, 0, -0.1])
                cylinder(h = annular_depth + 0.2, d = annular_inner_d);
        }
    
    // Deep circular cuts through multiple levels
    for (i = [0 : 2]) {
        angle = i * 120;
        rotate([0, 0, angle])
            translate([deep_cut_offset, 0, -0.01])
                cylinder(h = deep_cut_depth, d = deep_cut_d);
    }
}

// ============================================
// Interior Multi-Level Cuts (from bottom)
// ============================================
module interior_cuts() {
    // Level 1 - wider interior cut
    translate([0, 0, -0.01])
        cylinder(h = interior_h1, d = interior_d1);
    
    // Level 2 - deeper narrower cut
    translate([0, 0, -0.01])
        cylinder(h = interior_h2, d = interior_d2);
}

// ============================================
// Main Assembly
// ============================================
difference() {
    // Union of solid bodies
    union() {
        upper_sleeve();
        lower_cylinder();
    }
    
    // Subtract all cutouts and recesses
    upper_cutouts();
    lower_cutouts();
    bottom_features();
    interior_cuts();
}