// Global resolution
$fn = 100;

// ============== PARAMETERS ==============
// Base dimensions
base_outer_r = 150;
base_inner_r = 130;
base_height = 104;
boss_r = 15;
boss_height = 20;
lug_count = 12;

// Lever arm dimensions
lever_base_r1 = 125;
lever_base_r2 = 90;
lever_base_r3 = 68.5;
lever_height = 323;
gear_tooth_count = 24;
gear_tooth_r = 50;
gear_tooth_height = 10;

// Spacer dimensions
spacer_outer_r = 3;
spacer_inner_r = 1.6;
spacer_height = 3;
spacer_count = 12;

// Connecting arm dimensions
arm_length = 442;
arm_hub_r = 15;
arm_flange_r = 30;
arm_hole_count = 13;
arm_hole_r = 3;

// Joint housing dimensions
joint_length = 296;
joint_cyl_r = 31;
joint_bore_r = 22;
joint_flange_r = 40;
joint_hole_count = 12;
joint_hole_r = 1.5;

// Multi-bore housing dimensions
multi_length = 173;
multi_width = 80;
multi_height = 76;
multi_cross_r = 85;
multi_long_r = 35.4;
multi_boss_r = 15;

// Scroll housing dimensions
scroll_rim_r = 35;
scroll_inner_r = 23.5;
scroll_length = 87.6;
scroll_hole_count = 4;
scroll_hole_r = 1.5;

// Gripper jaw dimensions
jaw_width = 19.5;
jaw_length = 126.9;
jaw_pivot_r = 15;
jaw_slot_width = 6;
jaw_slot_length = 30;
jaw_tooth_count = 8;

// ============== HELPER MODULES ==============
module base_lug() {
    // Radial mounting lug on base
    cube([20, 40, base_height], center=true);
}

module gear_tooth() {
    // Single bevel gear tooth
    hull() {
        cylinder(h=gear_tooth_height, r1=5, r2=3, center=true);
        translate([0, gear_tooth_r, 0])
            cylinder(h=gear_tooth_height, r=2, center=true);
    }
}

module spacer_ring() {
    // Bearing spacer ring
    difference() {
        cylinder(h=spacer_height, r=spacer_outer_r, center=true);
        cylinder(h=spacer_height+1, r=spacer_inner_r, center=true);
    }
}

module arm_hole_pattern() {
    // 13-hole pattern on arm flange
    for (i = [0:arm_hole_count-1]) {
        rotate([0, 0, i * 360/arm_hole_count])
            translate([arm_flange_r, 0, 0])
                cylinder(h=10, r=arm_hole_r, center=true);
    }
}

module joint_hole_pattern() {
    // 12-hole pattern on joint flange
    for (i = [0:joint_hole_count-1]) {
        rotate([0, 0, i * 360/joint_hole_count])
            translate([joint_flange_r, 0, 0])
                cylinder(h=10, r=joint_hole_r, center=true);
    }
}

module gripper_serrations() {
    // Serrated gripping face
    for (i = [0:jaw_tooth_count-1]) {
        translate([0, i*5 - jaw_length/2, 0])
            cube([jaw_width, 3, 5], center=true);
    }
}

// ============== PART MODULES ==============
module housing_cap() {
    // Base housing cap with stepped profile and lugs
    difference() {
        union() {
            // Main cylindrical body
            cylinder(h=base_height, r=base_outer_r, center=true);
            
            // Central boss
            translate([0, 0, base_height/2 + boss_height/2])
                cylinder(h=boss_height, r=boss_r, center=true);
            
            // Peripheral lugs
            for (i = [0:lug_count-1]) {
                rotate([0, 0, i * 360/lug_count])
                    translate([base_outer_r, 0, 0])
                        base_lug();
            }
        }
        
        // Inner recess
        cylinder(h=base_height+1, r=base_inner_r, center=true);
    }
}

module lever_arm_with_gear() {
    // Lever arm with bevel gear teeth
    difference() {
        union() {
            // Stepped base
            cylinder(h=20, r=lever_base_r1, center=true);
            translate([0, 0, 20])
                cylinder(h=20, r=lever_base_r2, center=true);
            translate([0, 0, 40])
                cylinder(h=20, r=lever_base_r3, center=true);
            
            // Main arm
            translate([0, 0, 40 + lever_height/2])
                cylinder(h=lever_height, r=60, center=true);
            
            // Gear teeth at top
            for (i = [0:gear_tooth_count-1]) {
                rotate([0, 0, i * 360/gear_tooth_count])
                    translate([0, 0, 40 + lever_height])
                        gear_tooth();
            }
        }
        
        // Blind holes for pins
        translate([50, 0, 30])
            rotate([0, 90, 0])
                cylinder(h=20, r=15, center=true);
        translate([0, 50, 30])
            rotate([90, 0, 0])
                cylinder(h=20, r=15, center=true);
    }
}

module spacer_array() {
    // 12 spacers in rotational pattern
    for (i = [0:spacer_count-1]) {
        rotate([0, 0, i * 360/spacer_count])
            translate([base_outer_r + 10, 0, base_height/2])
                spacer_ring();
    }
}

module connecting_arm() {
    // Curved connecting arm with flanged hub
    difference() {
        union() {
            // Main curved arm (approximated with hull)
            hull() {
                cylinder(h=20, r=arm_hub_r, center=true);
                translate([arm_length, 0, 0])
                    cylinder(h=20, r=arm_hub_r, center=true);
            }
            
            // Flanged hub at one end
            translate([arm_length, 0, 0])
                cylinder(h=10, r=arm_flange_r, center=true);
        }
        
        // Central bores
        cylinder(h=30, r=arm_hub_r, center=true);
        translate([arm_length, 0, 0])
            cylinder(h=30, r=arm_hub_r, center=true);
        
        // Flange holes
        translate([arm_length, 0, 0])
            arm_hole_pattern();
    }
}

module joint_housing() {
    // L-shaped joint housing
    difference() {
        union() {
            // Cylindrical arm
            cylinder(h=joint_length, r=joint_cyl_r, center=true);
            
            // Block head
            translate([0, 0, joint_length/2])
                cube([100, 80, 50], center=true);
            
            // Flange
            translate([0, 0, joint_length/2 - 25])
                cylinder(h=10, r=joint_flange_r, center=true);
        }
        
        // Main bore
        cylinder(h=joint_length+1, r=joint_bore_r, center=true);
        
        // Blind holes
        translate([40, 0, joint_length/2])
            rotate([0, 90, 0])
                cylinder(h=20, r=15, center=true);
        translate([0, 40, joint_length/2])
            rotate([90, 0, 0])
                cylinder(h=20, r=15, center=true);
        
        // Flange holes
        translate([0, 0, joint_length/2 - 25])
            joint_hole_pattern();
    }
}

module multi_bore_housing() {
    // Multi-lobed housing with cross-bore
    difference() {
        union() {
            // Main body (approximated as rounded box)
            minkowski() {
                cube([multi_length-20, multi_width-20, multi_height-20], center=true);
                sphere(r=10);
            }
            
            // Protruding boss
            translate([multi_length/2, 0, 0])
                cylinder(h=20, r=multi_boss_r, center=true);
        }
        
        // Cross-bore
        rotate([0, 90, 0])
            cylinder(h=multi_width+1, r=multi_cross_r, center=true);
        
        // Longitudinal bores
        for (i = [-1, 1]) {
            translate([0, i*30, 0])
                cylinder(h=multi_length+1, r=multi_long_r, center=true);
        }
        
        // Counterbored holes (simplified)
        for (i = [0:5], j = [0:3]) {
            translate([
                -multi_length/2 + 20 + i*30,
                -multi_width/2 + 20 + j*20,
                0
            ])
                cylinder(h=multi_height+1, r=4, center=true);
        }
    }
}

module scroll_housing() {
    // Scroll-shaped wrist housing
    difference() {
        union() {
            // Circular rim
            cylinder(h=10, r=scroll_rim_r, center=true);
            
            // Angular rear section
            translate([0, 0, -20])
                cube([scroll_length-20, 50, 30], center=true);
        }
        
        // Scroll cavity (simplified)
        cylinder(h=15, r=scroll_inner_r, center=true);
        
        // Through-holes
        for (i = [0:scroll_hole_count-1]) {
            rotate([0, 0, i * 90 + 45])
                translate([scroll_rim_r - 5, 0, 0])
                    cylinder(h=20, r=scroll_hole_r, center=true);
        }
        
        // Blind bore
        translate([0, 0, -15])
            cylinder(h=20, r=10, center=true);
    }
}

module gripper_jaw() {
    // Single gripper jaw with serrations and slots
    difference() {
        union() {
            // V-shaped body
            hull() {
                cylinder(h=jaw_width, r=jaw_pivot_r, center=true);
                translate([0, jaw_length/2, 0])
                    cube([jaw_width, 10, jaw_width], center=true);
            }
            
            // Pivot boss
            cylinder(h=jaw_width+5, r=jaw_pivot_r+5, center=true);
        }
        
        // Adjustment slots
        for (i = [-1, 1]) {
            translate([0, i*20, 0])
                hull() {
                    cylinder(h=jaw_width+1, r=jaw_slot_width/2, center=true);
                    translate([0, jaw_slot_length, 0])
                        cylinder(h=jaw_width+1, r=jaw_slot_width/2, center=true);
                }
        }
        
        // Through-hole
        cylinder(h=jaw_width+1, r=1.5, center=true);
    }
    
    // Serrations on gripping face
    translate([0, jaw_length/2, 0])
        gripper_serrations();
}

// ============== ASSEMBLY ==============
module assembly() {
    // Base (grounded)
    housing_cap();
    
    // Spacer array on base
    spacer_array();
    
    // Lever arm on base
    translate([0, 0, base_height/2])
        lever_arm_with_gear();
    
    // Connecting arm attached to lever
    translate([0, 0, base_height + lever_height])
        rotate([0, 0, 30])
            connecting_arm();
    
    // Joint housing at end of connecting arm
    translate([arm_length, 0, base_height + lever_height])
        rotate([0, 0, 30])
            rotate([0, 90, 0])
                joint_housing();
    
    // Multi-bore housing (forearm)
    translate([arm_length + joint_length/2, 0, base_height + lever_height])
        rotate([0, 0, 30])
            multi_bore_housing();
    
    // Scroll housing (wrist)
    translate([arm_length + joint_length + multi_length/2, 0, base_height + lever_height])
        rotate([0, 0, 30])
            scroll_housing();
    
    // Gripper jaws (mirror pair)
    translate([arm_length + joint_length + multi_length + scroll_length/2, 0, base_height + lever_height])
        rotate([0, 0, 30]) {
            gripper_jaw();
            mirror([0, 1, 0])
                gripper_jaw();
        }
}

// Render the complete assembly
assembly();