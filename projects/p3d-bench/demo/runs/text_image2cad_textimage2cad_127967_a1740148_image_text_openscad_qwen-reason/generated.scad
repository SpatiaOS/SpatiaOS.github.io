// ABB-style Industrial Robot Arm
// Reconstructed from image and structured text description

$fn = 60; // Resolution for curves

// ============================================================================
// PARAMETERS
// ============================================================================

// Base / Housing Cap
base_outer_r = 150;
base_inner_r = 130;
base_height = 104;
base_boss_r = 15;
base_boss_h = 20;

// Lever Arm with Bevel Gear (Shoulder Assembly)
shoulder_base_r = 125;
shoulder_step1_r = 90;
shoulder_step2_r = 68.5;
shoulder_gear_r = 50;
shoulder_gear_teeth = 24;
shoulder_pivot_hole_r = 15; // 30mm diameter

// Connecting Arm (Upper Arm)
upper_arm_length = 442;
upper_arm_hub_r = 30; 
upper_arm_bore_r = 15;
upper_arm_width = 60; 

// Joint Housing (Elbow)
elbow_length = 296;
elbow_arm_r = 31; // 62mm diameter
elbow_bore_r = 22; // 44mm diameter
elbow_pivot_r = 15; // 30mm diameter

// Multi-Bore Housing (Forearm)
forearm_length = 173;
forearm_width = 80;
forearm_height = 76;
forearm_lobes_r = 38; 

// Scroll Housing (Wrist)
wrist_rim_r = 35;
wrist_inner_r = 23.5;
wrist_height = 55;

// Gripper Jaw
jaw_length = 120;
jaw_width = 20;
jaw_pivot_r = 15;

// Spacers
spacer_od = 6;
spacer_id = 3.2;
spacer_h = 3;
spacer_count = 12;
spacer_circle_r = 100; 

// ============================================================================
// MODULES
// ============================================================================

module housing_cap() {
    // Main body - 12-sided prism for lugs
    difference() {
        cylinder(h=base_height, r=base_outer_r, $fn=12);
        // Recessed ledge at inner radius
        translate([0, 0, base_height - 20])
            cylinder(h=25, r=base_inner_r, $fn=60);
    }
    
    // Central boss
    translate([0, 0, base_height])
        cylinder(h=base_boss_h, r=base_boss_r);
        
    // Peripheral lugs detail
    for (i = [0:11]) {
        rotate([0, 0, i * 30])
            translate([base_outer_r - 10, 0, base_height/2])
                cube([20, 40, base_height - 10], center=true);
    }
}

module lever_arm_with_bevel_gear() {
    union() {
        // Base disc
        cylinder(h=60, r=shoulder_base_r);
        // Step 1
        translate([0, 0, 20])
            cylinder(h=40, r=shoulder_step1_r);
        // Step 2
        translate([0, 0, 40])
            cylinder(h=40, r=shoulder_step2_r);
            
        // Bevel Gear Teeth
        translate([0, 0, 50]) {
            for (i = [0:shoulder_gear_teeth-1]) {
                rotate([0, 0, i * (360/shoulder_gear_teeth)])
                    translate([shoulder_gear_r, 0, 0])
                        cube([15, 12, 30], center=true);
            }
        }
        
        // Web-like connecting structure
        translate([0, 0, 80])
            cube([60, 100, 40], center=true);
            
        // Pivot holes for upper arm
        translate([0, 60, 80])
            rotate([90, 0, 0])
                cylinder(h=40, r=shoulder_pivot_hole_r);
        translate([0, -60, 80])
            rotate([90, 0, 0])
                cylinder(h=40, r=shoulder_pivot_hole_r);
    }
}

module spacer() {
    difference() {
        cylinder(h=spacer_h, r=spacer_od/2);
        cylinder(h=spacer_h + 1, r=spacer_id/2, center=true);
    }
}

module connecting_arm() {
    hull() {
        // Shoulder Hub
        translate([0, 0, 0])
            cylinder(h=60, r=upper_arm_hub_r, center=true);
            
        // Mid points for curve
        translate([upper_arm_length * 0.3, 0, 50])
            sphere(r=upper_arm_width/2);
        translate([upper_arm_length * 0.6, 0, 120])
            sphere(r=upper_arm_width/2);
            
        // Elbow Hub
        translate([upper_arm_length * 0.8, 0, 150])
            cylinder(h=60, r=upper_arm_hub_r, center=true);
    }
    
    // Flanged bolt circle on larger hub
    translate([upper_arm_length * 0.8, 0, 150]) {
        translate([0, 0, 35]) 
            for (i = [0:12]) {
                rotate([0, 0, i * (360/13)])
                    translate([40, 0, 0])
                        cylinder(h=10, r=3); 
            }
    }
    
    // Rectangular lugs on top
    translate([upper_arm_length * 0.4, 0, 100])
        cube([30, 20, 10], center=true);
    translate([upper_arm_length * 0.6, 0, 130])
        cube([30, 20, 10], center=true);
}

module joint_housing() {
    union() {
        // Blocky head
        cube([80, 80, 80], center=true);
        
        // Cylindrical arm
        translate([0, 0, -100])
            cylinder(h=150, r=elbow_arm_r);
            
        // Chamfered details
        translate([0, 0, 40])
            cylinder(h=10, r=50);
            
        // Internal bore
        translate([0, 0, -100])
            cylinder(h=160, r=elbow_bore_r);
            
        // Perpendicular blind bores
        translate([50, 0, 0])
            rotate([0, 90, 0])
                cylinder(h=60, r=elbow_pivot_r);
        translate([-50, 0, 0])
            rotate([0, 90, 0])
                cylinder(h=60, r=elbow_pivot_r);
                
        // Bolt circle
        translate([0, 0, -20])
            for (i = [0:11]) {
                rotate([0, 0, i * 30])
                    translate([40, 0, 0])
                        cylinder(h=10, r=1.5);
            }
    }
}

module multi_bore_housing() {
    // Main body with wavy profile
    difference() {
        linear_extrude(height=forearm_length, center=true) {
            union() {
                for (i = [-2:2]) {
                    translate([i * 30, 0])
                        circle(r=forearm_lobes_r);
                }
            }
        }
        
        // Longitudinal bores (subtracted to create holes)
        translate([0, 20, 0])
            rotate([90, 0, 0])
                cylinder(h=forearm_length + 10, r=35, center=true);
        translate([0, -20, 0])
            rotate([90, 0, 0])
                cylinder(h=forearm_length + 10, r=35, center=true);
    }
    
    // Protruding boss
    translate([0, 0, forearm_length/2 + 10])
        cylinder(h=20, r=15);
        
    // Counterbored bolt positions
    for (i = [-3:3]) {
        translate([i * 25, forearm_lobes_r, 0])
            cylinder(h=5, r=4);
        translate([i * 25, -forearm_lobes_r, 0])
            cylinder(h=5, r=4);
    }
}

module scroll_housing() {
    union() {
        // Main body
        cylinder(h=wrist_height, r=wrist_rim_r);
        
        // Rear angular section
        translate([0, 0, -20])
            cube([60, 50, 40], center=true);
            
        // Inner cavity
        translate([0, 0, 1])
            cylinder(h=wrist_height, r=wrist_inner_r);
            
        // Through holes
        for (i = [0:3]) {
            rotate([0, 0, i * 90])
                translate([25, 0, 0])
                    cylinder(h=wrist_height + 2, r=1.5, center=true);
        }
        
        // Blind bore
        translate([0, 0, -30])
            cylinder(h=40, r=10);
    }
}

module gripper_jaw() {
    // Main jaw body
    linear_extrude(height=jaw_width, center=true) {
        polygon(points=[
            [0, 0],          
            [10, -20],       
            [80, -40],       
            [80, -30],       
            [10, 10],        
            [0, 0]           
        ]);
    }
    
    // Pivot boss
    translate([0, 0, 0])
        cylinder(h=jaw_width + 5, r=jaw_pivot_r, center=true);
        
    // Serrations
    translate([80, -35, 0]) 
        for (i = [0:4]) {
            translate([0, -i * 5, 0])
                rotate([0, 0, 45])
                    cube([5, 5, jaw_width], center=true);
        }
        
    // Oblong slots
    translate([40, -15, 0])
        cube([30, 6, jaw_width + 1], center=true);
        
    // Through hole
    translate([0, 0, 0])
        cylinder(h=jaw_width + 10, r=1.5, center=true);
}

// ============================================================================
// ASSEMBLY
// ============================================================================

// 1. Base
translate([0, 0, 0])
    housing_cap();

// 2. Spacers
translate([0, 0, base_height])
    for (i = [0:spacer_count-1]) {
        rotate([0, 0, i * (360/spacer_count)])
            translate([spacer_circle_r, 0, 0])
                spacer();
    }

// 3. Shoulder / Lever Arm Assembly
translate([0, 0, base_height]) {
    lever_arm_with_bevel_gear();
    
    // 4. Connecting Arm
    translate([0, 0, 100]) {
        rotate([0, -50, 0]) { 
            connecting_arm();
            
            // 5. Joint Housing
            translate([upper_arm_length * 0.8, 0, 150]) {
                rotate([0, 80, 0]) {
                    joint_housing();
                    
                    // 6. Multi-Bore Housing
                    translate([0, 0, -120]) {
                        rotate([0, -30, 0]) {
                            multi_bore_housing();
                            
                            // 7. Scroll Housing
                            translate([0, 0, forearm_length/2 + 20]) {
                                rotate([0, 0, 0]) { 
                                    scroll_housing();
                                    
                                    // 8. Gripper Jaws
                                    translate([0, 0, wrist_height/2 + 10]) {
                                        translate([15, 0, 0])
                                            gripper_jaw();
                                        translate([-15, 0, 0])
                                            mirror([1, 0, 0])
                                                gripper_jaw();
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