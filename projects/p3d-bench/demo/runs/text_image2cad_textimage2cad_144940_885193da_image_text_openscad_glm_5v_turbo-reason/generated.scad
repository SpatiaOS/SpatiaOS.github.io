// ==========================================
// Mechanical Assembly Reconstruction
// ==========================================

$fn = 100; // Global resolution

// ------------------------------------------
// Parameters (Dimensions in mm)
// ------------------------------------------

// 1. Flat Bar (Top Rail)
flat_bar_w = 600;
flat_bar_d = 50;
flat_bar_h = 10;
flat_bar_z = 450; // Height position

// 2. Triangular Linkage Bracket
bracket_thickness = 80;
bracket_v1 = [-170, 120, 320]; // Top Left Vertex (Ø40 hole)
bracket_v2 = [170, 120, 320];  // Top Right Vertex (Ø40 hole)
bracket_v3 = [20, -80, 130];   // Lower Left Vertex (Ø30 hole)
bracket_center_web = [0, 60, 230];

// 3. U-Shaped Link Arm
link_arm_boss_od = 60;
link_arm_boss_length = 80;
link_arm_hole_d = 40;
link_arm_sweep_depth = 280; // How far forward it loops

// 4. Pulley Disc
pulley_od = 230;
pulley_height = 61;
pulley_hub_od = 140;
pulley_bolt_circle_d = 105; // Approx based on visual
pulley_bolt_d = 14;

// 5. Pins / Shafts
pin_main_d = 40;  // For top pivots
pin_main_l = 110;
pin_small_d = 30; // For lower pivots
pin_small_l = 90;
pin_long_small_d = 30;
pin_long_small_l = 100;


// ------------------------------------------
// Module Definitions
// ------------------------------------------

// Generic Pin Module
module pin(diameter, length) {
    cylinder(h=length, d=diameter, center=true);
}

// Grounded Flat Bar & Support Frame
module assembly_frame() {
    color("darkgray") {
        // Top Spanning Bar
        translate([0, 0, flat_bar_z])
            cube([flat_bar_w, flat_bar_d, flat_bar_h], center=true);
            
        // Vertical Supports (Inferred from image context)
        translate([-280, 0, flat_bar_z/2])
            cube([40, flat_bar_d + 40, flat_bar_z], center=true);
        translate([280, 0, flat_bar_z/2])
            cube([40, flat_bar_d + 40, flat_bar_z], center=True);
            
        // Base Plate / Grounding
        translate([0, 0, 10])
            cube([650, 200, 20], center=true);
            
        // Grounded Fixed Pins (Mirror Pair - bfd100ee)
        // Placed as structural mounts
        translate([-200, -60, 60]) rotate([0, 90, 0]) pin(pin_small_d, pin_small_l);
        translate([200, -60, 60]) rotate([0, 90, 0]) pin(pin_small_d, pin_small_l);
    }
}

// Triangular Linkage Bracket (c0024a12)
module triangular_bracket() {
    color("steelblue") {
        difference() {
            union() {
                // Construct 3 radiating arms using hull for smooth blends
                // Arm 1: Center to Top Left
                hull() {
                    translate(bracket_center_web) sphere(r=30);
                    translate(bracket_v1) cylinder(h=bracket_thickness, r=40, center=true);
                }
                // Arm 2: Center to Top Right
                hull() {
                    translate(bracket_center_web) sphere(r=30);
                    translate(bracket_v2) cylinder(h=bracket_thickness, r=40, center=true);
                }
                // Arm 3: Center to Bottom
                hull() {
                    translate(bracket_center_web) sphere(r=30);
                    translate(bracket_v3) cylinder(h=bracket_thickness, r=32, center=true);
                }
                
                // Outer Skin (to close the triangle shape visually)
                hull() {
                    translate(bracket_v1) sphere(r=40);
                    translate(bracket_v2) sphere(r=40);
                    translate(bracket_v3) sphere(r=32);
                }
            }
            
            // Central Open Web Cutout
            translate(bracket_center_web) sphere(r=55);
            
            // Through Holes
            // Top Left (Ø40)
            translate(bracket_v1) rotate([0, 90, 15]) 
                cylinder(h=bracket_thickness+2, d=link_arm_hole_d, center=true);
            // Top Right (Ø40)
            translate(bracket_v2) rotate([0, 90, -15]) 
                cylinder(h=bracket_thickness+2, d=link_arm_hole_d, center=true);
            // Bottom Left (Ø30)
            translate(bracket_v3) rotate([0, 90, -50]) 
                cylinder(h=bracket_thickness+2, d=pin_small_d, center=true);
        }
    }
}

// U-Shaped Swept Link Arm (bfd260d0)
module u_link_arm() {
    color("silver") {
        // Define path points for the U-sweep
        p_start = bracket_v1;
        p_end = bracket_v2;
        p_mid_top = [0, 180, 270];
        p_mid_far = [0, link_arm_sweep_depth, 180]; // The bottom of the U loop
        
        difference() {
            union() {
                // Generate swept body using chain of hulls
                // Leg 1
                hull() { translate(p_start) sphere(r=link_arm_boss_od/2); translate(p_mid_top) sphere(r=22); }
                hull() { translate(p_mid_top) sphere(r=22); translate([0, 230, 220]) sphere(r=22); }
                hull() { translate([0, 230, 220]) sphere(r=22); translate(p_mid_far) sphere(r=24); }
                
                // Leg 2 (Symmetric return)
                hull() { translate(p_mid_far) sphere(r=24); translate([0, 230, 220]) sphere(r=22); }
                hull() { translate([0, 230, 220]) sphere(r=22); translate(p_mid_top) sphere(r=22); }
                hull() { translate(p_mid_top) sphere(r=22); translate(p_end) sphere(r=link_arm_boss_od/2); }

                // Cylindrical Bosses at ends
                translate(p_start) rotate([0, 90, 15]) 
                    cylinder(h=link_arm_boss_length, d=link_arm_boss_od, center=true);
                translate(p_end) rotate([0, 90, -15]) 
                    cylinder(h=link_arm_boss_length, d=link_arm_boss_od, center=true);
            }
            
            // Bores in Bosses (Ø40)
            translate(p_start) rotate([0, 90, 15]) 
                cylinder(h=link_arm_boss_length+2, d=link_arm_hole_d, center=true);
            translate(p_end) rotate([0, 90, -15]) 
                cylinder(h=link_arm_boss_length+2, d=link_arm_hole_d, center=true);
                
            // Blind Locating Recess (Ø50 x 15) on lateral face
            translate([0, link_arm_sweep_depth - 20, 190]) 
                rotate([0, 0, 0]) cylinder(h=16, d=50, center=true);
        }
    }
}

// Pulley Disc Assembly (bfd21264)
module pulley_disc() {
    // Position offset from lower vertex
    pos = bracket_v3 + [85, -50, -60]; 
    
    translate(pos) {
        difference() {
            union() {
                // Main Disc Body
                cylinder(h=pulley_height, d=pulley_od, center=true);
                // Stepped Hub
                translate([0, 0, (pulley_height/2) - 15]) 
                    cylinder(h=25, d=pulley_hub_od, center=true);
            }
            
            // 5 Bolt-Circle Holes (Ø14)
            for (i = [0:4]) {
                rotate([0, 0, i * 72 + 18]) // Offset rotation
                    translate([pulley_bolt_circle_d/2, 0, 0])
                        cylinder(h=pulley_height + 2, d=pulley_bolt_d, center=true);
            }
            
            // Periodic Rim Notches (~30 features)
            for (i = [0:29]) {
                rotate([0, 0, i * 12])
                    translate([pulley_od/2, 0, 0])
                        cylinder(h=pulley_height + 2, r=4, center=true);
            }
        }
        
        // Host Part / Mounting Block (Inferred bfce4234)
        color("slategray") {
             hull() {
                 translate([0, 0, -pulley_height/2]) cylinder(h=10, d=80, center=true);
                 translate([0, 40, -pulley_height/2 - 20]) cube([60, 40, 40], center=true);
             }
        }
        
        // Long Pin (bfce1ad2) passing through host part
        rotate([0, 90, 0]) color("gold")
            pin(pin_long_small_d, pin_long_small_l);
    }
}


// ------------------------------------------
// Main Assembly Execution
// ------------------------------------------

assembly_frame();
triangular_bracket();
u_link_arm();
pulley_disc();

// Insert Main Pivot Pins (bfd12828) - Shared by Bracket and Link Arm
color("gold") {
    // Pin at Top Left Vertex
    translate(bracket_v1) rotate([0, 90, 15]) 
        pin(pin_main_d, pin_main_l);
    
    // Pin at Top Right Vertex
    translate(bracket_v2) rotate([0, 90, -15]) 
        pin(pin_main_d, pin_main_l);
}