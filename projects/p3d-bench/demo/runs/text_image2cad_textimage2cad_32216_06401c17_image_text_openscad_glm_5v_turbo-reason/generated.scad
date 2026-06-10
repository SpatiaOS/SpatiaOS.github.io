// =============================================================================
// Grapple Assembly Model
// OpenSCAD Parametric Reconstruction
// =============================================================================

$fn = 60; // Global resolution

// -----------------------------------------------------------------------------
// Parameters (Dimensions in mm)
// -----------------------------------------------------------------------------

// Central End Fitting (Hub)
hub_r_lower = 13.5;
hub_r_upper = 9.39;
hub_h_lower = 13;
hub_h_cone = 11;
hub_h_upper = 17;
eye_lug_w = 11;
eye_lug_h = 15;
eye_lug_thick = 6;
eye_hole_d = 5.0;

// Mounting Lugs (Lower Ring)
lug_lower_count = 8;
lug_lower_hole_d = 2.8;
lug_lower_w = 7.5;
lug_lower_h = 9;
lug_lower_thick = 1.47;

// Mounting Lugs (Upper Ring)
lug_upper_d_count = 4;
lug_upper_d_hole_d = 1.28;
lug_upper_rect_count = 4;
lug_upper_rect_hole_d = 2.48;
lug_upper_thick = 1.47;

// Jaw Arms (Tines/Jaws)
jaw_total_len = 73.6;
jaw_pivot_hole_d = 3.6;
jaw_mid_hole_d = 3.6;
jaw_width_root = 14;
jaw_width_tip = 4;
jaw_thickness = 6;

// Barrels (Hub-to-Pivot)
barrel_len = 28;
barrel_od = 7.0;
barrel_id = 5.6; // Wall ~0.7
barrel_domed_r = 3.5;

// Follower Rods (Hub-to-Mid-Jaw)
rod_len = 22.3;
rod_stem_r = 0.54;
rod_head_r = 2.53;
rod_boss_r = 2.0;
rod_boss_hole_d = 1.2;

// Fasteners (Generic representations)
pin_step_head_d = 3.6;
pin_step_shank_d = 2.7;
pin_flange_head_d = 3.6;
pin_flange_shaft_d = 1.2;
pin_spool_large_d = 3.6;
pin_spool_small_d = 1.9;
pin_plain_d = 1.08;


// -----------------------------------------------------------------------------
// Modules: Components
// -----------------------------------------------------------------------------

module end_fitting() {
    color("Silver") {
        difference() {
            union() {
                // Lower Cylinder
                translate([0, hub_h_lower/2, 0])
                    cylinder(h=hub_h_lower, r=hub_r_lower, center=true);
                
                // Conical Transition
                translate([0, hub_h_lower + hub_h_cone/2, 0])
                    cylinder(h=hub_h_cone, r1=hub_r_lower, r2=hub_r_upper, center=true);
                
                // Upper Cylinder
                translate([0, hub_h_lower + hub_h_cone + hub_h_upper/2, 0])
                    cylinder(h=hub_h_upper, r=hub_r_upper, center=true);
                
                // Eye Lug at Crown
                total_h = hub_h_lower + hub_h_cone + hub_h_upper;
                translate([0, total_h + eye_lug_h/2 - 1, 0]) 
                    hull() {
                        cube([eye_lug_w, eye_lug_h, eye_lug_thick], center=true);
                        translate([0, eye_lug_h/2 - 2, 0])
                            cylinder(h=eye_lug_thick, r=eye_lug_w/2 + 1, center=true);
                    }
            }
            // Eye Hole
            total_h = hub_h_lower + hub_h_cone + hub_h_upper;
            translate([0, total_h + eye_lug_h - 3, 0])
                rotate([90, 0, 0])
                    cylinder(h=eye_lug_thick+2, d=eye_hole_d, center=true);
        }
    }
}

module mounting_lug_lower() {
    color("DarkGray") {
        difference() {
            // D-Shaped profile wrapping the lower cylinder
            // Straight edge facing inward/outward depending on mount, assume tangent
            hull() {
                cube([lug_lower_w, lug_lower_h, lug_lower_thick], center=true);
                translate([0, -lug_lower_h/2 + hub_r_lower, 0])
                    cube([lug_lower_w, 0.1, lug_lower_thick], center=true); // Flatten back to cylinder contour roughly
            }
            // Through hole
            cylinder(h=lug_lower_thick+2, d=lug_lower_hole_d, center=true);
        }
    }
}

module mounting_lug_upper_d() {
    color("Gray") {
        difference() {
            // D-Shape for upper cylinder
            scale([1, 1.2, 1]) // Aspect ratio adjustment
                hull() {
                    cube([5, 6, lug_upper_thick], center=true);
                    translate([0, 3, 0])
                        cylinder(h=lug_upper_thick, r=3, center=true);
                }
            // Hole
            cylinder(h=lug_upper_thick+2, d=lug_upper_d_hole_d, center=true);
        }
    }
}

module mounting_lug_upper_rect() {
    color("Gray") {
        difference() {
            // Rectangular tab with rounded outer edge
            hull() {
                cube([6, 5, lug_upper_thick], center=true);
                translate([0, 3, 0])
                    cylinder(h=lug_upper_thick, r=2.85, center=true);
            }
            // Hole
            cylinder(h=lug_upper_thick+2, d=lug_upper_rect_hole_d, center=true);
        }
    }
}

module barrel() {
    color("LightSteelBlue") {
        difference() {
            union() {
                // Main tube
                cylinder(h=barrel_len, r=barrel_od/2, center=true);
                // Domed cap (at one end)
                translate([0, barrel_len/2, 0])
                    sphere(r=barrel_domed_r);
            }
            // Hollow core
            cylinder(h=barrel_len+1, r=barrel_id/2, center=true);
            // Open end cut (ensure open)
            translate([0, -(barrel_len/2 + barrel_domed_r), 0])
                cylinder(h=barrel_domed_r*2, r=barrel_id/2);
            
            // Radial pin holes (mentioned in text ~0.86mm)
            // Placing them midway
            translate([barrel_od/2 + 1, 5, 0])
                rotate([0, 90, 0])
                    cylinder(h=4, d=0.9, center=true);
        }
    }
}

module follower_rod() {
    color("Orange") {
        // Stem
        cylinder(h=rod_len, r=rod_stem_r, center=true);
        
        // Mushroom Head (Top)
        translate([0, rod_len/2, 0]) {
            cylinder(h=1.5, r=rod_head_r, center=true);
            // Fillet blend simulation
            translate([0, -0.75, 0])
                cylinder(h=1.5, r1=rod_stem_r, r2=rod_head_r, center=true);
        }

        // Transverse Boss (Bottom)
        translate([0, -rod_len/2, 0]) {
            rotate([0, 90, 0])
                cylinder(h=rod_boss_r*2, r=rod_boss_r, center=true);
            // Boss Hole
            rotate([0, 90, 0])
                cylinder(h=rod_boss_r*2+2, d=rod_boss_hole_d, center=true);
        }
    }
}

module jaw_arm(mirror_x=false) {
    color("Goldenrod") {
        // Define the curve using a series of hull points to simulate B-spline volume
        // Points: Root(Pivot) -> Elbow(Mid) -> Tip
        
        // Transform if mirrored variant
        if (mirror_x) { mirror([1, 0, 0]) jaw_solid(); }
        else { jaw_solid(); }
    }
}

module jaw_solid() {
    // Approximate the curved tapered arm using hull()
    // Coordinate system: Y is down the arm length
    
    // Pivot Zone (Thick)
    p1_top = [0, 0, jaw_width_root/2];
    p1_bot = [0, 0, -jaw_width_root/2];
    
    // Mid Zone (Linkage connection, slight curve out)
    // Curve outward in X
    offset_x = 12; 
    p2_top = [offset_x, -30, jaw_width_root/1.5];
    p2_bot = [offset_x, -30, -jaw_width_root/1.5];
    
    // Tip Zone (Narrow, curved further out/down)
    p3_top = [offset_x + 5, -jaw_total_len, jaw_width_tip/2];
    p3_bot = [offset_x + 5, -jaw_total_len, -jaw_width_tip/2];

    difference() {
        // Main Body Volume
        hull() {
            // Root
            translate(p1_top) sphere(r=jaw_thickness/2);
            translate(p1_bot) sphere(r=jaw_thickness/2);
            // Mid
            translate(p2_top) sphere(r=jaw_thickness/2.2);
            translate(p2_bot) sphere(r=jaw_thickness/2.2);
            // Tip
            translate(p3_top) sphere(r=jaw_thickness/3);
            translate(p3_bot) sphere(r=jaw_thickness/3);
        }
        
        // Stiffening Ribs (Subtractive or Additive? Usually additive on surface, 
        // but easier to shape via hull or just leave as solid block for simplicity 
        // given constraints. I'll add simple surface ridges via intersection or 
        // just rely on the hull shape which creates a faceted "ribbed" look if segmented).
        // For now, let's stick to the solid hull which represents the mass.
        
        // Pivot Hole (Z-axis orientation implied by "orthogonal")
        translate([0, 2, 0]) rotate([90, 0, 0])
            cylinder(h=jaw_thickness+4, d=jaw_pivot_hole_d, center=true);
            
        // Mid Body Hole (X-axis orientation)
        translate([offset_x, -30, 0]) rotate([0, 90, 0])
            cylinder(h=jaw_width_root+4, d=jaw_mid_hole_d, center=true);
    }
}

module pin_stepped() {
    color("Red") {
        cylinder(h=7.2, d=pin_step_shank_d, center=true);
        translate([0, 3.8, 0]) cylinder(h=0.4, d=3.1, center=true); // Shoulder
        translate([0, 4.1, 0]) cylinder(h=0.4, d=pin_step_head_d, center=true); // Head
    }
}

module pin_flanged() {
    color("Green") {
        cylinder(h=7.5, d=pin_flange_shaft_d, center=true);
        translate([0, 4, 0]) cylinder(h=0.41, d=1.9, center=true); // Small flange
        translate([0, -4, 0]) cylinder(h=0.41, d=pin_flange_head_d, center=true); // Large head
    }
}


// -----------------------------------------------------------------------------
// Assembly Construction
// -----------------------------------------------------------------------------

module assemble() {
    // 1. Central Body
    end_fitting();
    
    // 2. Lower Mounting Lugs (8 instances)
    for (i = [0 : lug_lower_count - 1]) {
        angle = i * (360 / lug_lower_count);
        rotate([0, 0, angle])
            translate([hub_r_lower - 1, 4, 0]) // Position on lower cylinder
                rotate([0, 0, 0]) // Orient radial
                    mounting_lug_lower();
    }

    // 3. Upper Mounting Lugs (4 D-shape + 4 Rect)
    // Interleaved or grouped? Assume 45deg offsets for 8 total positions on upper ring
    // D-Lugs at 0, 90, 180, 270
    for (i = [0 : lug_upper_d_count - 1]) {
        angle = i * 90;
        rotate([0, 0, angle])
            translate([hub_r_upper - 1, hub_h_lower + hub_h_cone + 8, 0])
                mounting_lug_upper_d();
    }
    // Rect Lugs at 45, 135...
    for (i = [0 : lug_upper_rect_count - 1]) {
        angle = i * 90 + 45;
        rotate([0, 0, angle])
            translate([hub_r_upper - 1, hub_h_lower + hub_h_cone + 6, 0])
                mounting_lug_upper_rect();

    }

    // 4. Arms, Barrels, Rods, and Fasteners (4-Fold Symmetry)
    // Quadrant logic: 0, 90, 180, 270 degrees
    for (i = [0 : 3]) {
        angle = i * 90;
        
        // Determine Jaw Variant (Mirror every other one for visual variety/symmetry)
        is_mirrored = (i % 2 == 1); 
        
        // Rotation for the whole quadrant assembly
        rotate([0, 0, angle]) {
            
            // --- Barrel (Connects Hub Shoulder to Jaw Pivot) ---
            // Position: Radially out, angled down
            // Pivot is roughly at y=5, r=22
            // Hub shoulder is at y~20, r~10
            // Vector math for rotation:
            // Start: (10, 20), End: (22, 5)
            dx = 22 - 10; dy = 5 - 20;
            barrel_angle = atan2(dx, dy); // Angle from Y axis
            
            translate([10, 20, 0]) // Start pos on cone/neck junction
                rotate([0, 0, barrel_angle - 90]) // Align with vector
                    rotate([90, 0, 0]) // Orient cylinder along length
                        barrel();
                        
            // --- Jaw Arm ---
            // Positioned at Pivot Point
            translate([22, 5, 0])
                rotate([0, 0, 0]) // Initial alignment
                jaw_arm(is_mirrored);
                
            // --- Follower Rod (Connects Upper Hub to Jaw Mid) ---
            // Jaw Mid is at approx x=12 (local), y=-30 (local) -> Global x ~ 34, y ~ -25
            // Hub attachment point: Higher up, say y=30, r=15 -> x=15, y=30
            // Vector: (34-15, -25-30) = (19, -55)
            rod_start = [15, 30, 0]; // On upper cylinder
            rod_end = [34, -25, 0];  // At jaw mid-hole location
            
            // Calculate position and rotation for rod
            rod_pos = (rod_start + rod_end) / 2;
            rod_vec = rod_end - rod_start;
            rod_len_actual = norm(rod_vec);
            rod_ay = atan2(rod_vec[0], rod_vec[1]); // Yaw around Y
            // Simplified placement for visual correctness
            translate(rod_pos)
                rotate([0, 0, rod_ay])
                    rotate([90, 0, 0])
                        scale([1, rod_len_actual / rod_len, 1]) // Stretch to fit
                            follower_rod();

            // --- Fasteners ---
            // Pivot Pin (Stepped)
            translate([22, 5, 0])
                rotate([90, 0, 0])
                    pin_stepped();
                    
            // Mid Pin (Flanged)
            // Local mid of jaw is at offset_x=12, y_local=-30
            // Global pos depends on rotation. Assuming jaw aligns mostly radially.
            // Approx global pos for mid pin:
            translate([32, -25, 0]) 
                 rotate([0, 90, 0])
                    pin_flanged();
        }
    }
}

// Render
assemble();