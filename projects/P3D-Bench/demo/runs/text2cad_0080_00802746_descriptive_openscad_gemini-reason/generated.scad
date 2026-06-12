// Parameters
$fn = 100;

// Upper Sleeve Cylinder
u_cyl_od = 60;
u_cyl_h = 50;

// Lower Side Cylinder
l_cyl_od = 45;
l_cyl_h = 35;
l_cyl_offset_x = 35;
l_cyl_offset_z = -15;

// Upper Cylinder Internal Features
u_bore_id = 20;
u_step1_id = 40;
u_step1_depth = 12;
u_step2_id = 30;
u_step2_depth = 25;
u_annular_relief_od = 45;
u_annular_relief_id = 28;
u_annular_relief_depth = 8;

// Lower Cylinder Internal Features
l_bore_id = 15;
l_step_id = 28;
l_step_depth = 15;

// Small Circular Cuts (Lower Cylinder)
small_hole_d = 6;
small_hole_bc = 15;
small_hole_count = 4;

// Manifold tolerance
eps = 0.05;

// Reusable module for annular ring cut
module annular_ring(od, id, h) {
    difference() {
        cylinder(h=h, d=od, center=false);
        translate([0, 0, -eps])
            cylinder(h=h + 2*eps, d=id, center=false);
    }
}

// Main solid body
module solid_body() {
    union() {
        // Upper sleeve cylinder
        cylinder(h=u_cyl_h, d=u_cyl_od, center=false);

        // Lower side cylinder (offset to intersect curved walls)
        translate([l_cyl_offset_x, 0, l_cyl_offset_z])
            cylinder(h=l_cyl_h, d=l_cyl_od, center=false);
    }
}

// Subtractive features
module negative_features() {
    // --- Upper Cylinder Cuts ---
    
    // Central bore
    translate([0, 0, -eps])
        cylinder(h=u_cyl_h + 2*eps, d=u_bore_id, center=false);
        
    // Top stepped recess 1 (widest)
    translate([0, 0, u_cyl_h - u_step1_depth + eps])
        cylinder(h=u_step1_depth, d=u_step1_id, center=false);
        
    // Top stepped recess 2 (intermediate)
    translate([0, 0, u_cyl_h - u_step2_depth + eps])
        cylinder(h=u_step2_depth, d=u_step2_id, center=false);
        
    // Underside shallow annular relief
    translate([0, 0, -eps])
        annular_ring(od=u_annular_relief_od, id=u_annular_relief_id, h=u_annular_relief_depth + eps);

    // --- Lower Cylinder Cuts ---
    
    translate([l_cyl_offset_x, 0, l_cyl_offset_z]) {
        // Central bore
        translate([0, 0, -eps])
            cylinder(h=l_cyl_h + 2*eps, d=l_bore_id, center=false);
            
        // Top deeper circular cut
        translate([0, 0, l_cyl_h - l_step_depth + eps])
            cylinder(h=l_step_depth, d=l_step_id, center=false);
            
        // Small round cut profiles (arranged in a bolt circle)
        for (i = [0 : small_hole_count - 1]) {
            angle = i * (360 / small_hole_count);
            translate([small_hole_bc * cos(angle), small_hole_bc * sin(angle), -eps])
                cylinder(h=l_cyl_h + 2*eps, d=small_hole_d, center=false);
        }
    }
}

// Final Assembly
difference() {
    solid_body();
    negative_features();
}