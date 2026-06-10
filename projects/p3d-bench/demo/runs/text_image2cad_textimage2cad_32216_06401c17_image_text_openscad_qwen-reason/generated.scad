// ============================================================================
// Parametric Mechanical Grapple Assembly
// Reconstructed from image and structured description.
// ============================================================================

$fn = 60; // Global resolution

// --- Global Parameters ---
// Hub Dimensions
hub_r_lower = 13.5;
hub_h_lower = 15;
hub_r_upper = 9.39;
hub_h_taper = 10;
hub_h_upper = 10;
hub_total_h = hub_h_lower + hub_h_taper + hub_h_upper;
eye_lug_h = 8;
eye_lug_r = 5.07;
eye_hole_d = 5.0;

// Jaw/Arm Dimensions
jaw_len = 73.6;
jaw_pivot_h = 5; // Height of pivot lug
jaw_hole_d = 3.6;
rib_h = 2;

// Linkage Dimensions
barrel_len = 28;
barrel_od = 6.76;
barrel_wall = 0.7;
barrel_id = barrel_od - 2 * barrel_wall;
barrel_dome_r = barrel_od / 2;

rod_len = 22.3;
rod_stem_r = 0.54;
rod_head_r = 2.53;
rod_boss_h = 4;
rod_boss_d = 1.2; // Hole diameter

// Fastener Dimensions
pin_stepped_shank_r = 1.35;
pin_stepped_head_r = 1.8;
pin_flanged_shaft_r = 0.6;
pin_flanged_head_r = 1.8;
pin_spool_shaft_r = 0.6;
pin_spool_flange_r = 1.8;
pin_plain_r = 0.538;

// Lug Dimensions
lug_lower_h = 1.47;
lug_lower_hole_d = 2.8;
lug_upper_d_hole_d = 1.28;
lug_upper_rect_hole_d = 2.48;

// --- Modules ---

// 1. Central Hub (End Fitting)
module hub() {
    // Lower Cylinder
    cylinder(h=hub_h_lower, r=hub_r_lower, center=false);
    
    // Conical Transition
    translate([0, 0, hub_h_lower])
        cylinder(h=hub_h_taper, r1=hub_r_lower, r2=hub_r_upper, center=false);
        
    // Upper Cylinder
    translate([0, 0, hub_h_lower + hub_h_taper])
        cylinder(h=hub_h_upper, r=hub_r_upper, center=false);
        
    // Eye Lug (Top)
    translate([0, 0, hub_total_h]) {
        // Lug body (rounded box approximation)
        hull() {
            sphere(r=eye_lug_r);
            translate([0, 0, -eye_lug_h + eye_lug_r]) sphere(r=eye_lug_r); // Adjust for height
            // Actually, let's make a proper lug
        }
        // Simpler lug: Box with rounded ends
        translate([0, 0, -2]) {
            hull() {
                sphere(r=5);
                translate([0, 0, 6]) sphere(r=5);
            }
        }
        // Eye Hole
        translate([0, 0, 1]) 
            rotate([90, 0, 0]) 
            cylinder(h=12, d=eye_hole_d, center=true);
    }

    // Lower Mounting Lugs (8 instances)
    // "Wrapping around the lower cylindrical section... 2.8 mm through-hole"
    for (i = [0 : 45 : 315]) {
        rotate([0, 0, i])
        translate([hub_r_lower - 2, 0, hub_h_lower / 2]) {
            // Lug body (thin plate)
            cube([4, 8, lug_lower_h], center=true);
            // Hole
            rotate([90, 0, 0])
            cylinder(h=10, d=lug_lower_hole_d, center=true);
        }
    }

    // Upper Mounting Lugs (4 D-shaped + 4 Rectangular)
    // "interface with the upper cylinder"
    upper_z = hub_h_lower + hub_h_taper + hub_h_upper / 2;
    
    // 4 D-shaped lugs (ae59bc4c)
    for (i = [0 : 90 : 270]) {
        rotate([0, 0, i])
        translate([hub_r_upper - 1, 0, upper_z]) {
            // D-shape approx
            hull() {
                sphere(r=2.85);
                translate([-4, 0, 0]) sphere(r=2.85);
            }
            // Hole
            rotate([90, 0, 0])
            cylinder(h=10, d=lug_upper_d_hole_d, center=true);
        }
    }
    
    // 4 Rectangular/Semi-circular lugs (ae6184a4)
    for (i = [45 : 90 : 315]) {
        rotate([0, 0, i])
        translate([hub_r_upper - 1, 0, upper_z]) {
            cube([5.7, 9, 1.5], center=true);
            // Hole
            rotate([90, 0, 0])
            cylinder(h=10, d=lug_upper_rect_hole_d, center=true);
        }
    }
}

// 2. Outer Jaw (Gripper Jaw / Tine)
module jaw_outer() {
    // Main curved body using hull of spheres
    // Starts at pivot (top), curves down and in
    // Length ~73.6
    hull() {
        // Top Pivot Lug
        translate([0, 0, 0]) 
            sphere(r=4); 
            
        // Mid body
        translate([0, -20, -30]) 
            sphere(r=5);
            
        // Lower body (tapering)
        translate([0, -10, -60]) 
            sphere(r=3);
            
        // Tip
        translate([0, 0, -73.6]) 
            sphere(r=1.5);
    }
    
    // Longitudinal Ribs
    translate([0, -2, -30])
        cube([1, 4, 40], center=true);
        
    // Top Pivot Hole (Z-axis oriented? Text says "eye lug at top... 3.6mm through-hole oriented along one axis")
    // Assuming horizontal pivot for the jaw on the hub
    translate([0, 0, 0])
        rotate([90, 0, 0])
        cylinder(h=10, d=jaw_hole_d, center=true);
        
    // Mid-body Hole (Orthogonal)
    translate([0, -15, -35])
        rotate([0, 90, 0])
        cylinder(h=10, d=jaw_hole_d, center=true);
}

// 3. Inner Arm (Curved Support Arm)
module jaw_inner() {
    // Thin elongated strip, S-curve
    // Length ~73.6
    hull() {
        // Top (connects to barrel)
        translate([0, 0, 0])
            sphere(r=3);
            
        // Mid curve
        translate([0, 10, -30])
            sphere(r=2.5);
            
        // Bottom
        translate([0, 0, -60])
            sphere(r=2);
    }
    
    // Small tab near one end
    translate([0, 0, -55])
        cube([2, 4, 2], center=true);
}

// 4. Barrel (Cylindrical Pin with Retaining Features)
module barrel() {
    // Hollow cylinder
    difference() {
        union() {
            // Main body
            cylinder(h=barrel_len, d=barrel_od, center=false);
            // Dome cap
            translate([0, 0, barrel_len])
                sphere(d=barrel_od);
        }
        // Hollow core
        translate([0, 0, -1])
            cylinder(h=barrel_len + 2, d=barrel_id, center=false);
    }
    
    // Radial Bosses with holes
    // "Two small radial bosses... pierced by a through-hole"
    translate([0, 0, barrel_len * 0.7]) {
        rotate([90, 0, 0]) {
            cylinder(h=barrel_od + 4, d=3, center=true); // Boss
            cylinder(h=10, d=0.864, center=true); // Hole
        }
    }
}

// 5. Follower Rod
module rod() {
    // Stem
    cylinder(h=rod_len, r=rod_stem_r, center=false);
    
    // Mushroom Head (Top)
    translate([0, 0, rod_len])
        sphere(r=rod_head_r);
        
    // Transverse Boss (Bottom)
    translate([0, 0, 0]) {
        rotate([90, 0, 0])
            cylinder(h=rod_boss_h + 2, d=4, center=true); // Boss body
        rotate([90, 0, 0])
            cylinder(h=10, d=rod_boss_d, center=true); // Hole
    }
}

// 6. Fasteners
module pin_stepped() {
    // Long shank
    cylinder(h=7.2, r=pin_stepped_shank_r, center=false);
    // Shoulder
    translate([0, 0, 7.2]) cylinder(h=0.4, r=1.55, center=false);
    // Head
    translate([0, 0, 7.6]) cylinder(h=0.4, r=pin_stepped_head_r, center=false);
}

module pin_flanged() {
    // Shaft
    cylinder(h=8.4, r=pin_flanged_shaft_r, center=false);
    // Large Head (Top)
    translate([0, 0, 8.4 - 0.41]) cylinder(h=0.41, r=pin_flanged_head_r, center=false);
    // Small Shoulder (Bottom)
    translate([0, 0, 0]) cylinder(h=0.41, r=0.95, center=false);
}

// --- Assembly ---

module assemble_grapple() {
    // Central Hub
    hub();
    
    // 4 Quadrants
    for (i = [0 : 90 : 270]) {
        rotate([0, 0, i]) {
            
            // --- Linkage Assembly ---
            // Position: Angled out from hub upper lugs
            // Barrel connects Hub to Inner Arm Top
            
            // Calculate position for Barrel base (on Hub upper lugs)
            // Approx angle 30 deg out, Z at upper cylinder
            barrel_angle = 30; 
            barrel_base_z = hub_h_lower + hub_h_taper + 2;
            
            // Place Barrel
            // We need to rotate the barrel to point outwards and downwards slightly?
            // Text: "span between the hub and jaw pivot zones"
            // Let's assume it connects Hub Upper to Inner Arm Top.
            
            translate([0, 0, barrel_base_z]) {
                rotate([0, barrel_angle, 0]) { // Tilt out
                    barrel();
                    
                    // Inner Arm attached to top of Barrel
                    translate([0, 0, barrel_len]) {
                        // Inner Arm pivots here? Or is fixed?
                        // "curved_support_arm... no holes".
                        // Maybe it's fixed to the barrel end?
                        // Let's attach it.
                        rotate([0, -20, 0]) // Curve downwards
                            jaw_inner();
                            
                        // Rod connects Inner Arm (mid) to Outer Jaw (mid)
                        // Approx position on Inner Arm
                        translate([0, 5, -30]) {
                            rotate([0, 45, 0]) // Angle towards Outer Jaw
                                rod();
                        }
                    }
                }
            }
            
            // --- Outer Jaw ---
            // Pivots on Hub Lower Lugs
            // Position: Further out and down
            jaw_pivot_z = hub_h_lower / 2;
            jaw_pivot_r = hub_r_lower + 5;
            
            translate([jaw_pivot_r, 0, jaw_pivot_z]) {
                rotate([0, 20, 0]) // Initial angle
                    jaw_outer();
                    
                // Pin at pivot
                rotate([90, 0, 0])
                    pin_stepped();
            }
            
            // --- Fasteners ---
            // Add pins at linkage points
            // Barrel to Hub
            translate([0, 0, barrel_base_z]) {
                 rotate([0, barrel_angle, 0]) {
                     // Pin through barrel base and hub lug
                     rotate([0, 90, 0])
                         pin_flanged();
                 }
            }
        }
    }
}

// Render
assemble_grapple();