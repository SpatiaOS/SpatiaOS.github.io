// ==========================================
// Robotic Arm Assembly Reconstruction
// ==========================================

$fn = 100; // Global resolution

// ------------------------------------------
// PARAMETERS (Dimensions in mm)
// ------------------------------------------

// 1. Housing Cap (Base)
hc_outer_r = 150;
hc_inner_r = 130;
hc_height = 104;
hc_boss_r = 15;
hc_boss_h = 25;
hc_lug_w = 25;
hc_lug_h = 20;
hc_lug_count = 12;

// 2. Spacer Rings (x12)
sp_od = 6.0;
sp_id = 3.2;
sp_h = 3.0;
sp_mount_r = 145; // Radial position on base

// 3. Lever Arm with Bevel Gear (Shoulder)
la_base_r = 125;
la_step_r = 90;
la_neck_r = 68.5;
la_base_h = 25;
la_neck_h = 180; // Total height of arm portion
la_gear_r = 65;
la_gear_h = 45;
la_teeth_r = 50;
la_teeth_n = 24;
la_blind_hole_d = 30;
la_blind_hole_depth = 20;

// 4. Knob Plug (Shoulder Cover)
kp_head_r = 42;
kp_groove_r1 = 41.25;
kp_groove_r2 = 39.5;
kp_shank_r = 20;
kp_shank_h = 24;
kp_tail_w = 36; // Square section width

// 5. Connecting Arm (Upper Link)
ca_length = 442;
ca_width = 120;
ca_thickness = 62;
ca_hub_r = 35;
ca_bore_r = 15;
ca_flange_r = 55;
ca_hole_d = 6;
ca_hole_n = 13;

// 6. Joint Housing (Elbow)
jh_body_l = 130; // Length of the blocky head
jh_body_w = 93.9;
jh_body_h = 132.5;
jh_arm_l = 200;
jh_arm_d = 62;
jh_bore_d = 44;
jh_perp_bore_d = 30;
jh_flange_holes_n = 12;

// 7. Multi-Bore Housing (Wrist Base)
mb_length = 173.1;
mb_width = 80;
mb_height = 76.2;
mb_cross_bore_r = 85; // D=170
mb_long_bore_r = 35.4;

// 8. Scroll Housing (Wrist)
scr_rim_r = 35;
scr_inner_r = 23.5;
scr_depth = 55.4;
scr_mount_holes_d = 3;
scr_blind_bore_d = 20;

// 9. Gripper Jaw (x2)
gj_total_l = 126.9;
gj_w = 19.5;
gj_h = 70.9;
gj_pivot_r = 15;
gj_slot_l = 30;
gj_slot_w = 8;


// ------------------------------------------
// MODULES
// ------------------------------------------

module housing_cap() {
    difference() {
        union() {
            // Main body
            cylinder(h=hc_height - 30, r=hc_outer_r);
            // Inner step / ledge
            translate([0, 0, hc_height - 30]) cylinder(h=30, r=hc_inner_r);
            // Central boss
            translate([0, 0, hc_height]) cylinder(h=hc_boss_h, r=hc_boss_r);
            
            // Peripheral lugs
            for (i = [0 : 360/hc_lug_count : 360-360/hc_lug_count]) {
                rotate([0, 0, i])
                    translate([hc_outer_r, 0, 0])
                        cube([hc_lug_w, 20, hc_lug_h], center=true);
            }
        }
        // Optional: Mounting holes in lugs (blind holes mentioned in context of other parts, 
        // but base usually has through holes. Keeping solid per "grounded part" description 
        // or simple representation).
    }
}

module spacer_ring() {
    difference() {
        cylinder(h=sp_h, d=sp_od);
        translate([0, 0, -1]) cylinder(h=sp_h+2, d=sp_id);
    }
}

module lever_arm_with_bevel_gear() {
    // Base turntable interface
    cylinder(h=la_base_h, r=la_base_r);
    translate([0, 0, la_base_h]) cylinder(h=20, r=la_step_r);
    
    // Main neck/shaft
    translate([0, 0, la_base_h+20]) cylinder(h=la_neck_h, r=la_neck_r);
    
    // Top hub / Gear head
    translate([0, 0, la_base_h+20+la_neck_h]) {
        difference() {
            union() {
                cylinder(h=la_gear_h, r=la_gear_r);
                // Bevel/Crown gear teeth
                for (i = [0 : 360/la_teeth_n : 360-360/la_teeth_n]) {
                    rotate([0, 0, i])
                        translate([la_teeth_r, 0, la_gear_h/2])
                            rotate([0, 90, 0])
                                // Trapezoidal tooth approximation
                                linear_extrude(height=10, center=false)
                                    polygon(points=[[0,-5], [15,0], [15,10], [0,15]]);
                }
            }
            // Blind holes for pins/shafts
            translate([0, 0, -1]) cylinder(h=la_blind_hole_depth, d=la_blind_hole_d);
            // Perpendicular hole
            rotate([0, 90, 0]) translate([-la_gear_h-1, 0, 0]) cylinder(h=la_blind_hole_depth, d=la_blind_hole_d);
        }
    }
}

module knob_plug() {
    // Dome Head
    translate([0, 0, 40]) scale([1, 1, 0.8]) sphere(r=kp_head_r);
    
    // Grooves (subtracted)
    difference() {
        // Shank
        cylinder(h=kp_shank_h, r=kp_shank_r);
        // Groove cut
        translate([0, 0, 15]) rotate_extrude() translate([kp_groove_r1, 0, 0]) circle(r=1.5);
        translate([0, 0, 18]) rotate_extrude() translate([kp_groove_r2, 0, 0]) circle(r=1.5);
    }
    
    // Square Tail (Anti-rotation)
    translate([0, 0, -20]) cube([kp_tail_w, kp_tail_w, 20], center=true);
}

module connecting_arm() {
    // Curved arm approximation using hull of segments
    // Start at origin, curve up and out
    p1 = [0, 0, 0];
    p2 = [ca_length*0.3, ca_length*0.1, ca_length*0.4]; // Control point
    p3 = [ca_length*0.75, ca_length*0.2, ca_length*0.6]; // Control point
    p4 = [ca_length, ca_length*0.25, ca_length*0.7];     // End point
    
    difference() {
        hull() {
            // Hub 1
            translate(p1) rotate([0, 0, atan2(p2[1], p2[0])]) cylinder(h=ca_thickness, r=ca_hub_r);
            // Mid sections for curvature
            translate(p2) rotate([0, 0, atan2(p3[1]-p2[1], p3[0]-p2[0])]) cylinder(h=ca_thickness*0.9, r=ca_width/2);
            translate(p3) rotate([0, 0, atan2(p4[1]-p3[1], p4[0]-p3[0])]) cylinder(h=ca_thickness*0.9, r=ca_width/2);
            // Hub 2 (with flange)
            translate(p4) rotate([0, 0, atan2(p4[1], p4[0])]) {
                cylinder(h=ca_thickness, r=ca_hub_r);
                translate([0, 0, ca_thickness-5]) cylinder(h=5, r=ca_flange_r);
            }
        }
        
        // Central Bores
        translate(p1) rotate([0, 0, atan2(p2[1], p2[0])]) cylinder(h=ca_thickness+2, r=ca_bore_r, center=true);
        translate(p4) rotate([0, 0, atan2(p4[1], p4[0])]) cylinder(h=ca_thickness+2, r=ca_bore_r, center=true);
        
        // Flange Bolt Holes (Blind)
        translate(p4) rotate([0, 0, atan2(p4[1], p4[0])]) {
            for (i = [0 : 360/ca_hole_n : 360-360/ca_hole_n]) {
                rotate([0, 0, i]) translate([ (ca_flange_r+ca_hub_r)/2, 0, ca_thickness-2.5]) 
                    cylinder(h=10, d=ca_hole_d);
            }
        }
        
        // Top Lugs (Visual detail)
        // Simplified as protrusions on the hull
    }
}

module joint_housing() {
    // L-Shaped Body
    // Cylindrical Arm
    rotate([0, 90, 0]) cylinder(h=jh_arm_l, d=jh_arm_d);
    
    // Blocky Head (Elbow joint)
    translate([jh_arm_l, 0, 0]) {
        difference() {
            union() {
                // Main block
                translate([0, 0, jh_body_h/2 - jh_arm_d/2]) 
                    cube([jh_body_l, jh_body_w, jh_body_h], center=true);
                // Flange disk
                translate([jh_body_l/2, 0, 0]) cylinder(h=jh_arm_d, d=jh_arm_d+20);
            }
            // Through bore in arm
            rotate([0, 90, 0]) cylinder(h=jh_arm_l+1, d=jh_bore_d, center=true);
            
            // Perpendicular blind bores in head
            translate([jh_body_l/2 - 10, -jh_body_w/2 - 1, jh_body_h/2 - jh_arm_d/2]) 
                rotate([90, 0, 0]) cylinder(h=jh_blind_hole_depth, d=jh_perp_bore_d);
                
            // Flange holes
            for (i = [0 : 360/jh_flange_holes_n : 360-360/jh_flange_holes_n]) {
                rotate([0, 0, i]) translate([(jh_arm_d+20)/2 + 5, 0, -1]) cylinder(h=5, d=4);
            }
        }
    }
}

module multi_bore_housing() {
    // Wavy/Lobed Profile Approximation
    // Using hull of offset spheres to create organic shape
    
    difference() {
        hull() {
            // Create lobes
            for (i = [-1, 0, 1]) {
                translate([i*30, 0, 0]) sphere(r=45);
                translate([i*30, 0, mb_length*0.4]) sphere(r=40);
                translate([i*30, 0, mb_length*0.8]) sphere(r=38);
            }
            // End caps
            translate([0, 0, -20]) scale([1.2, 1, 1]) cylinder(h=10, r=40);
            translate([0, 0, mb_length+10]) scale([1.2, 1, 1]) cylinder(h=10, r=40);
        }
        
        // Cross Bore (Large)
        rotate([0, 90, 0]) cylinder(h=200, r=mb_cross_bore_r, center=true);
        
        // Longitudinal Bores
        translate([0, 25, mb_length/2]) rotate([90, 0, 0]) cylinder(h=mb_length+40, r=mb_long_bore_r, center=true);
        translate([0, -25, mb_length/2]) rotate([90, 0, 0]) cylinder(h=mb_length+40, r=mb_long_bore_r, center=true);
        
        // Locating pin seats (blind)
        translate([0, 46, mb_length/2]) rotate([90, 0, 0]) cylinder(h=20, d=20);
        translate([0, -46, mb_length/2]) rotate([90, 0, 0]) cylinder(h=20, d=20);
    }
}

module scroll_housing() {
    difference() {
        union() {
            // Main body
            cylinder(h=scr_depth, r=scr_rim_r);
            // Rear mounting flange steps
            translate([0, 0, -15]) cylinder(h=15, r=scr_rim_r - 10);
        }
        
        // Front Cavity (Scroll pocket approximation)
        translate([0, 0, 5]) cylinder(h=scr_depth, r=scr_inner_r);
        
        // Rear Blind Bore
        translate([0, 0, -16]) cylinder(h=10, d=scr_blind_bore_d);
        
        // Mounting Through-Holes (4)
        for (i = [0, 90, 180, 270]) {
            rotate([0, 0, i]) translate([scr_rim_r - 8, 0, -8]) 
                cylinder(h=16, d=scr_mount_holes_d);
        }
    }
}

module gripper_jaw() {
    // V-Shape Angular Body
    angle = 25; // Opening angle
    
    difference() {
        union() {
            // Pivot Boss
            cylinder(h=gj_w, r=gj_pivot_r);
            
            // Lower Arm Segment
            hull() {
                translate([0, 0, gj_w/2]) rotate([0, 0, angle/2]) 
                    translate([gj_total_l*0.4, 0, 0]) cylinder(h=gj_w, r=gj_w/2);
                cylinder(h=gj_w, r=gj_pivot_r);
            }
            
            // Upper Arm Segment (with serration)
            hull() {
                rotate([0, 0, -angle/2]) 
                    translate([gj_total_l, 0, gj_w/2]) cube([10, gj_h, gj_w], center=true);
                cylinder(h=gj_w, r=gj_pivot_r);
            }
        }
        
        // Pivot Hole
        translate([0, 0, -1]) cylinder(h=gj_w+2, d=3); // Through hole
        
        // Adjustment Slots (Oblong)
        rotate([0, 0, angle/4]) translate([gj_total_l*0.35, 0, gj_w/2]) {
            hull() {
                cylinder(h=gj_w+2, r=gj_slot_w/2);
                translate([gj_slot_l, 0, 0]) cylinder(h=gj_w+2, r=gj_slot_w/2);
            }
        }
        
        // Serrations (Subtract sawtooth pattern on tip)
        rotate([0, 0, -angle/2]) translate([gj_total_l - 5, gj_h/2 - 2, -1]) {
            for (i = [0:4:20]) {
                translate([i, 0, 0]) cube([2, 4, gj_w+2]);
            }
        }
    }
}


// ------------------------------------------
// ASSEMBLY COMPOSITION
// ------------------------------------------

union() {
    // 1. Grounded Base (Housing Cap)
    color("gray") housing_cap();
    
    // 2. Spacers (Arranged radially on base ledge)
    color("darkgray") 
    for (i = [0 : 30 : 330]) { // 12-fold symmetry
        rotate([0, 0, i])
            translate([sp_mount_r, 0, hc_height - 5]) // Sit on top step
                spacer_ring();
    }

    // 3. Shoulder Assembly (Lever Arm + Knob Plug)
    // Positioned on top of base, tilted back
    translate([0, 0, hc_height + hc_boss_h]) {
        rotate([20, 0, -15]) { // Tilt and swivel
            color("silver") lever_arm_with_bevel_gear();
            
            // Knob plug on top of gear head
            translate([0, 0, la_base_h+20+la_neck_h+la_gear_h]) {
                color("dimgray") knob_plug();
            }
            
            // 4. Connecting Arm (Upper Link)
            // Attached to the side/top of the shoulder neck
            translate([0, la_neck_r + 10, la_neck_h - 50]) {
                rotate([0, 0, 60]) { // Orient arm towards front-right
                    color("lightgray") connecting_arm();
                    
                    // 5. Joint Housing (Elbow)
                    // Attached to the far end of connecting arm
                    translate([ca_length, ca_length*0.25, ca_length*0.7]) {
                        rotate([0, 0, 210]) { // Align with arm end
                            color("gray") joint_housing();
                            
                            // 6. Multi-Bore Housing (Forearm/Wrist Base)
                            // Attached to the blocky head of the joint housing
                            translate([jh_arm_l + jh_body_l/2 + 10, 0, 0]) {
                                rotate([0, -70, 0]) { // Bend forearm forward/down
                                    color("silver") multi_bore_housing();
                                    
                                    // 7. Scroll Housing (Wrist)
                                    // Attached to end of multi-bore housing
                                    translate([0, 0, mb_length + 10]) {
                                        color("darkgray") scroll_housing();
                                        
                                        // 8. Gripper Jaws (x2)
                                        // Mounted to the front face of scroll housing
                                        translate([0, 0, scr_depth]) {
                                            // Left Jaw
                                            translate([0, 5, 0]) rotate([0, 0, 10]) color("orange") gripper_jaw();
                                            // Right Jaw (Mirror)
                                            translate([0, -5, 0]) rotate([0, 0, -190]) color("orange") gripper_jaw();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}