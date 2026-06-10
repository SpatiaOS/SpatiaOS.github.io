// ==========================================
// Parametric ABB-Style Articulated Robot Arm
// ==========================================

// Global Resolution
$fn = 60;

// Kinematic Pose Angles (degrees)
theta_base = 30;         // Turntable rotation
theta_shoulder = -55;    // Lower arm elevation (negative = forward/up)
theta_elbow = 100;       // Upper arm angle relative to lower arm
theta_wrist = 0;         // Wrist roll
theta_grip = 15;         // Gripper open angle

// Principal Dimensions
base_height = 104;
shoulder_pivot_x = 20;
shoulder_pivot_z = 220;
arm_length = 400;
elbow_offset_x = 80;
elbow_offset_z = 80;
forearm_length = 173;
wrist_length = 55;

// ==========================================
// Module Definitions
// ==========================================

// Grounded base with mounting lugs and central boss
module housing_cap() {
    union() {
        // Main stepped cylindrical body
        cylinder(r=150, h=60);
        cylinder(r=130, h=80);
        
        // Central locating boss
        cylinder(r=15, h=base_height + 20); 
        
        // 12 Peripheral mounting lugs
        for(i = [0 : 30 : 359]) {
            rotate([0, 0, i])
            translate([140, 0, 0])
            difference() {
                // Lug body
                translate([0, -25, 0]) cube([55, 50, 40]);
                // Blind mounting hole
                translate([35, 0, -5]) cylinder(r=8, h=50);
            }
        }
    }
}

// Turntable and shoulder joint clevis
module lever_arm() {
    difference() {
        union() {
            // Concentric steps
            cylinder(r=125, h=20);
            translate([0, 0, 23]) cylinder(r=90, h=27);
            translate([0, 0, 50]) cylinder(r=68.5, h=20);
            
            // 12x Bearing Spacers (embedded between steps)
            for(i = [0 : 30 : 359]) {
                rotate([0, 0, i]) 
                translate([110, 0, 20])
                difference() {
                    cylinder(r=3, h=3);
                    cylinder(r=1.6, h=5, center=true);
                }
            }
            
            // Asymmetric upright shoulder block
            hull() {
                translate([-30, -50, 70]) cube([80, 100, 10]);
                translate([shoulder_pivot_x, 0, shoulder_pivot_z]) 
                    rotate([90, 0, 0]) cylinder(r=60, h=90, center=true);
            }
            
            // Internal bevel gear teeth representation
            for(i = [0 : 15 : 359]) {
                translate([shoulder_pivot_x, 0, shoulder_pivot_z])
                rotate([90, 0, 0])
                rotate([0, 0, i]) {
                    translate([50, 0, 22]) cube([10, 5, 5], center=true);
                    translate([50, 0, -22]) cube([10, 5, 5], center=true);
                }
            }
        }
        
        // Central clearance cutout for the connecting arm
        translate([shoulder_pivot_x, 0, shoulder_pivot_z]) 
            rotate([90, 0, 0]) cylinder(r=65, h=45, center=true);
            
        // Shaft bores
        translate([shoulder_pivot_x, 0, shoulder_pivot_z]) 
            rotate([90, 0, 0]) cylinder(r=15, h=100, center=true);
    }
    
    // Decorative joint caps
    translate([shoulder_pivot_x, 45, shoulder_pivot_z]) rotate([-90, 0, 0]) knob_plug();
    translate([shoulder_pivot_x, -45, shoulder_pivot_z]) rotate([90, 0, 0]) knob_plug();
}

// Lower articulated link
module connecting_arm() {
    difference() {
        union() {
            // Lower pivot hub
            rotate([90, 0, 0]) cylinder(r=45, h=44, center=true);
            // Upper pivot hub
            translate([arm_length, 0, 0]) rotate([90, 0, 0]) cylinder(r=40, h=44, center=true);
            
            // Curved structural web
            hull() {
                rotate([90, 0, 0]) cylinder(r=40, h=40, center=true);
                translate([150, 0, 60]) rotate([90, 0, 0]) cylinder(r=35, h=40, center=true);
            }
            hull() {
                translate([150, 0, 60]) rotate([90, 0, 0]) cylinder(r=35, h=40, center=true);
                translate([arm_length, 0, 0]) rotate([90, 0, 0]) cylinder(r=35, h=40, center=true);
            }
        }
        
        // Side indentations for I-beam style profile
        translate([150, 25, 30]) rotate([0, -15, 0]) cube([250, 10, 40], center=true);
        translate([150, -25, 30]) rotate([0, -15, 0]) cube([250, 10, 40], center=true);
        
        // Pivot shaft bores
        rotate([90, 0, 0]) cylinder(r=15, h=50, center=true);
        translate([arm_length, 0, 0]) rotate([90, 0, 0]) cylinder(r=15, h=50, center=true);
    }
    
    // Branding
    translate([200, -20, 35]) rotate([90, 0, -10]) linear_extrude(2) text("ABB", size=25, halign="center", valign="center");
    translate([200, 20, 35]) rotate([-90, 0, 170]) linear_extrude(2) text("ABB", size=25, halign="center", valign="center");
}

// Elbow joint connecting lower and upper arm
module joint_housing() {
    difference() {
        union() {
            // Main elbow pivot hub
            rotate([90, 0, 0]) cylinder(r=50, h=90, center=true);
            
            // L-shaped transition body
            hull() {
                rotate([90, 0, 0]) cylinder(r=50, h=90, center=true);
                translate([-50, 0, 80]) rotate([90, 0, 0]) cylinder(r=40, h=90, center=true);
            }
            hull() {
                translate([-50, 0, 80]) rotate([90, 0, 0]) cylinder(r=40, h=90, center=true);
                translate([80, 0, 80]) rotate([0, 90, 0]) cylinder(r=40, h=70, center=true);
            }
        }
        
        // Cutout for the connecting arm top hub
        rotate([90, 0, 0]) cylinder(r=45, h=45, center=true);
        
        // Internal 44mm routing through-bore
        translate([20, 0, 80]) rotate([0, 90, 0]) cylinder(r=22, h=100);
    }
    
    // Decorative joint caps
    translate([0, 45, 0]) rotate([-90, 0, 0]) knob_plug();
    translate([0, -45, 0]) rotate([90, 0, 0]) knob_plug();

    // Branding
    translate([-20, -45, 40]) rotate([90, 0, 0]) linear_extrude(2) text("ABB", size=18, halign="center");
    translate([-20, 45, 40]) rotate([-90, 0, 180]) linear_extrude(2) text("ABB", size=18, halign="center");
}

// Forearm with distinctive wavy/lobed profile
module multi_bore_housing() {
    difference() {
        union() {
            // Central cylindrical core
            rotate([0, 90, 0]) cylinder(r=35, h=forearm_length);
            
            // Ribbed lobes
            for(x = [25 : 35 : 150]) {
                translate([x, 0, 0])
                rotate([90, 0, 0])
                cylinder(r=40, h=50, center=true);
            }
        }
        // Offset scallop cuts to create the dog-bone/wavy look
        translate([85, 100, 0]) cylinder(r=85, h=100, center=true);
        translate([85, -100, 0]) cylinder(r=85, h=100, center=true);
        
        // Internal routing bore
        rotate([0, 90, 0]) cylinder(r=22, h=forearm_length + 10, center=true);
    }
}

// Wrist mount for the gripper assembly
module scroll_housing() {
    difference() {
        union() {
            // Flange mating to forearm
            rotate([0, 90, 0]) cylinder(r=35, h=15);
            
            // Tapered transition
            hull() {
                translate([15, 0, 0]) rotate([0, 90, 0]) cylinder(r=35, h=10);
                translate([40, 0, 0]) rotate([0, 90, 0]) cylinder(r=25, h=15);
            }
            
            // Vertical wrist pivot cylinder
            translate([wrist_length, 0, 0]) cylinder(r=20, h=40, center=true);
        }
        // Internal scroll cavity
        translate([wrist_length, 0, 0]) cylinder(r=10, h=42, center=true);
    }
}

// Single gripper jaw with serrations
module gripper_jaw() {
    difference() {
        union() {
            // Pivot boss
            cylinder(r=15, h=8, center=true);
            
            // Angled arm base
            hull() {
                cylinder(r=15, h=8, center=true);
                translate([40, 20, 0]) cylinder(r=10, h=8, center=true);
            }
            
            // Tapered jaw tip
            hull() {
                translate([40, 20, 0]) cylinder(r=10, h=8, center=true);
                translate([85, 5, 0]) cylinder(r=3, h=8, center=true);
            }
            
            // Serrated gripping teeth
            for(i = [45 : 8 : 75]) {
                translate([i, 14 - (i-40)*0.3, 0]) 
                rotate([0, 0, -25]) 
                cube([4, 10, 8], center=true);
            }
        }
        
        // Pivot bore
        cylinder(r=6, h=10, center=true);
        
        // Elongated adjustment slot
        hull() {
            translate([20, 10, 0]) cylinder(r=3, h=10, center=true);
            translate([35, 17, 0]) cylinder(r=3, h=10, center=true);
        }
    }
}

// Dome-headed plug for joint sealing
module knob_plug() {
    cylinder(r=41.25, h=5);
    translate([0, 0, 5]) scale([1, 1, 0.3]) sphere(r=41.25);
}

// ==========================================
// Main Assembly Tree
// ==========================================

// Base
color("darkslategray") 
housing_cap();

// Turntable (Yaw)
translate([0, 0, base_height])
rotate([0, 0, theta_base]) {
    
    color("silver") 
    lever_arm();

    // Lower Arm (Pitch)
    translate([shoulder_pivot_x, 0, shoulder_pivot_z])
    rotate([0, theta_shoulder, 0]) {
        
        color("gainsboro") 
        connecting_arm();

        // Upper Arm / Elbow (Pitch)
        translate([arm_length, 0, 0])
        rotate([0, theta_elbow, 0]) {
            
            color("silver") 
            joint_housing();

            // Forearm (Roll)
            translate([elbow_offset_x, 0, elbow_offset_z])
            rotate([theta_wrist, 0, 0]) {
                
                color("gainsboro") 
                multi_bore_housing();

                // Wrist
                translate([forearm_length, 0, 0]) {
                    
                    color("silver") 
                    scroll_housing();

                    // Gripper Assembly
                    translate([wrist_length, 0, 0]) {
                        
                        // Left Jaw
                        rotate([0, 0, theta_grip])
                        translate([0, 0, 12])
                        color("dimgray") 
                        gripper_jaw();

                        // Right Jaw (Mirrored)
                        rotate([0, 0, -theta_grip])
                        scale([1, -1, 1])
                        translate([0, 0, -12])
                        color("dimgray") 
                        gripper_jaw();
                    }
                }
            }
        }
    }
}