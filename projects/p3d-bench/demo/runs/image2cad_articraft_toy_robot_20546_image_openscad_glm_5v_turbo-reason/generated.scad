// Bionicle-Style Action Figure Model - Optimized Version
// Parametric OpenSCAD implementation

// ============================================
// PARAMETERS - Adjust these to modify the model
// ============================================

// Global resolution - reduced for faster rendering
$fn = 24;  // Lower value for speed, increase to 48+ for smoother curves

// Scale factor for overall size
scale_factor = 1.0;

// Head parameters
head_diameter = 18 * scale_factor;
head_height = 20 * scale_factor;
visor_width = 12 * scale_factor;
visor_height = 6 * scale_factor;

// Torso parameters
torso_width = 32 * scale_factor;
torso_depth = 22 * scale_factor;
torso_height = 35 * scale_factor;

// Arm parameters
upper_arm_length = 22 * scale_factor;
upper_arm_width = 10 * scale_factor;
lower_arm_length = 24 * scale_factor;
lower_arm_width = 8 * scale_factor;
hand_length = 16 * scale_factor;

// Leg parameters
thigh_length = 24 * scale_factor;
thigh_width = 12 * scale_factor;
shin_length = 26 * scale_factor;
shin_width = 9 * scale_factor;
foot_length = 18 * scale_factor;
foot_width = 14 * scale_factor;
foot_height = 8 * scale_factor;

// Joint parameters
joint_diameter = 8 * scale_factor;
ball_joint_radius = 5 * scale_factor;

// ============================================
// MODULE DEFINITIONS - Optimized for performance
// ============================================

// Head module with helmet and visor
module head() {
    union() {
        // Main head dome - simplified shape
        translate([0, 0, head_height/2])
            scale([1, 0.85, 1])
                sphere(d=head_diameter);
        
        // Face plate / visor area
        translate([0, -head_diameter*0.25, head_height*0.25])
            rotate([-15, 0, 0])
                difference() {
                    cube([visor_width + 4, 5, visor_height + 2], center=true);
                    translate([0, -1, 0])
                        cube([visor_width, 4, visor_height], center=true);
                }
        
        // Crest/fin on top of head
        translate([0, -2, head_height*0.65])
            rotate([-20, 0, 0])
                linear_extrude(height=2, scale=0.3)
                    polygon(points=[[-5, 0], [5, 0], [3, 10], [0, 14], [-3, 10]]);
        
        // Side armor pieces - simplified
        for(side = [-1, 1]) {
            translate([side * (head_diameter/2 - 2), -2, head_height*0.35])
                rotate([0, side * 20, 0])
                    sphere(d=9);
        }
        
        // Neck connector
        translate([0, 2, -head_height*0.25])
            cylinder(h=6, d=joint_diameter);
    }
}

// Torso module with chest armor - simplified
module torso() {
    union() {
        // Main torso body - using simpler hull
        hull() {
            translate([0, 0, torso_height*0.55])
                sphere(d=torso_width * 0.75);
            translate([0, 0, -torso_height*0.15])
                sphere(d=torso_width * 0.6);
        }
        
        // Chest armor plate - simplified
        translate([0, torso_depth/2 - 3, torso_height*0.2])
            rotate([70, 0, 0])
                linear_extrude(height=6)
                    rounded_rect(torso_width * 0.6, torso_height * 0.35, 3);
        
        // Shoulder mounts
        for(side = [-1, 1]) {
            translate([side * (torso_width/2 - 4), 0, torso_height*0.42])
                ball_joint();
        }
        
        // Back armor/wings - simplified
        translate([0, -torso_depth/2 + 2, torso_height*0.25])
            rotate([-60, 0, 0])
                for(side = [-1, 1]) {
                    translate([side * 7, 0, 0])
                        scale([1.2, 0.25, 0.8])
                            sphere(d=14);
                }
        
        // Hip connectors
        for(side = [-1, 1]) {
            translate([side * 10, 0, -torso_height*0.22])
                ball_joint();
        }
    }
}

// Ball joint connector module - simplified
module ball_joint() {
    sphere(r=ball_joint_radius);
}

// Socket joint (receives ball joint) - simplified
module socket_joint() {
    difference() {
        sphere(d=joint_diameter * 1.3);
        sphere(d=ball_joint_radius * 2.1);
        translate([0, 0, -ball_joint_radius])
            cylinder(h=ball_joint_radius * 1.8, d=ball_joint_radius * 2.1);
    }
}

// Upper arm module - simplified
module upper_arm() {
    union() {
        // Main arm segment - simple cylinder with tapered ends
        hull() {
            translate([0, 0, 2])
                cylinder(h=1, d=upper_arm_width * 0.9);
            translate([0, 0, upper_arm_length - 2])
                cylinder(h=1, d=upper_arm_width * 0.85);
        }
        
        // Armor plate - simplified
        translate([0, upper_arm_width/2 + 1, upper_arm_length*0.35])
            rotate([80, 0, 0])
                cylinder(h=upper_arm_length*0.4, d=upper_arm_width*0.7);
        
        // Upper joint (shoulder) - socket
        translate([0, 0, upper_arm_length])
            socket_joint();
        
        // Lower joint (elbow) - ball
        translate([0, 0, 0])
            ball_joint();
            
        // Single piston detail instead of multiple
        translate([upper_arm_width/2 + 1, 0, upper_arm_length*0.4])
            rotate([0, 90, 0])
                cylinder(h=5, d=2);
    }
}

// Lower arm module - simplified
module lower_arm() {
    union() {
        // Main forearm
        hull() {
            translate([0, 0, 2])
                cylinder(h=1, d=lower_arm_width * 0.9);
            translate([0, 0, lower_arm_length - 2])
                cylinder(h=1, d=lower_arm_width * 0.8);
        }
        
        // Forearm armor - simplified
        translate([0, lower_arm_width/2 + 0.5, lower_arm_length*0.4])
            rotate([85, 0, 0])
                cylinder(h=lower_arm_length*0.5, d=lower_arm_width*0.85);
        
        // Upper joint connection
        translate([0, 0, lower_arm_length])
            socket_joint();
        
        // Wrist joint
        translate([0, 0, 0])
            scale([0.8, 0.8, 0.8])
                ball_joint();
                
        // Reduced mechanical details
        translate([lower_arm_width/2 + 0.5, 0, lower_arm_length*0.5])
            rotate([0, 90, 0])
                cylinder(h=3, d=1.5);
    }
}

// Hand/claw module - simplified
module hand() {
    union() {
        // Palm
        translate([0, 0, hand_length*0.25])
            scale([1, 0.7, 1])
                sphere(d=hand_length * 0.45);
        
        // Fingers/claws (3 fingers) - simplified
        for(angle = [-30, 0, 30]) {
            rotate([0, angle, 0])
                translate([0, 0, hand_length*0.5])
                    rotate([-25, 0, 0])
                        hull() {
                            sphere(d=3.5);
                            translate([0, 0, hand_length*0.35])
                                scale([0.3, 0.3, 1])
                                    sphere(d=5);
                        }
        }
        
        // Thumb - simplified
        translate([5, 0, hand_length*0.15])
            rotate([0, -50, 15])
                scale([0.6, 0.6, 0.6])
                    hull() {
                        sphere(d=3.5);
                        translate([0, 0, hand_length*0.3])
                            scale([0.3, 0.3, 1])
                                sphere(d=5);
                    }
        
        // Wrist connector
        translate([0, 0, 0])
            scale([0.7, 0.7, 0.7])
                socket_joint();
    }
}

// Thigh module - simplified
module thigh() {
    union() {
        // Main thigh segment
        hull() {
            translate([0, 0, 2])
                cylinder(h=1, d=thigh_width * 0.9);
            translate([0, 0, thigh_length - 2])
                cylinder(h=1, d=thigh_width * 0.85);
        }
        
        // Thigh armor - simplified
        translate([0, thigh_width/2 + 1, thigh_length*0.35])
            rotate([82, 0, 0])
                cylinder(h=thigh_length*0.45, d=thigh_width*0.75);
        
        // Hip joint (top)
        translate([0, 0, thigh_length])
            socket_joint();
        
        // Knee joint (bottom)
        translate([0, 0, 0])
            ball_joint();
            
        // Single side detail
        translate([thigh_width/2 + 1, 0, thigh_length*0.5])
            rotate([0, 90, 0])
                cylinder(h=3, d=2.5);
    }
}

// Shin module - simplified
module shin() {
    union() {
        // Main shin segment
        hull() {
            translate([0, 0, 2])
                cylinder(h=1, d=shin_width * 0.9);
            translate([0, 0, shin_length - 2])
                cylinder(h=1, d=shin_width * 0.8);
        }
        
        // Shin guard/armor - simplified
        translate([0, shin_width/2 + 0.5, shin_length*0.4])
            rotate([83, 0, 0])
                cylinder(h=shin_length*0.45, d=shin_width*0.8);
        
        // Knee connection (top)
        translate([0, 0, shin_length])
            socket_joint();
        
        // Ankle joint (bottom)
        translate([0, 0, 0])
            scale([0.9, 0.9, 0.9])
                ball_joint();
                
        // Reduced pistons
        translate([shin_width/2 + 0.5, 0, shin_length*0.4])
            rotate([0, 90, 0])
                cylinder(h=3, d=2);
    }
}

// Foot module - simplified
module foot() {
    union() {
        // Main foot body - simplified hull
        hull() {
            translate([0, -foot_length*0.15, 0])
                sphere(d=foot_width * 0.6);
            translate([0, foot_length*0.25, 0])
                sphere(d=foot_width * 0.5);
            translate([0, 0, foot_height * 0.8])
                sphere(d=foot_width * 0.65);
        }
        
        // Toes (3 visible toes) - simplified
        for(x = [-foot_width*0.2, 0, foot_width*0.2]) {
            translate([x, foot_length*0.35, foot_height*0.15])
                scale([0.3, 0.8, 0.35])
                    sphere(d=foot_width * 0.45);
        }
        
        // Ankle connector
        translate([0, -foot_length*0.08, foot_height * 0.75])
            scale([0.8, 0.8, 0.8])
                socket_joint();
    }
}

// Helper: 2D rounded rectangle - optimized without minkowski
module rounded_rect(w, h, r) {
    r = min(r, min(w, h) / 2);
    offset(r=r)
        offset(r=-r)
            square([w - 0.01, h - 0.01], center=true);
}

// ============================================
// MAIN ASSEMBLY
// ============================================

module bionicle_figure() {
    // Positioning offsets
    head_z = torso_height/2 + head_height*0.32;
    
    // Torso (center)
    torso();
    
    // Head
    translate([0, 0, head_z])
        head();
    
    // Left Arm assembly
    translate([-torso_width/2 + 2, 0, torso_height*0.42]) {
        rotate([0, 18, -12]) {
            upper_arm();
            translate([0, 0, -upper_arm_length - 1.5])
                rotate([8, 0, 0]) {
                    lower_arm();
                    translate([0, 0, -lower_arm_length - 1.2])
                        rotate([-18, 12, 0])
                            hand();
                }
        }
    }
    
    // Right Arm assembly
    translate([torso_width/2 - 2, 0, torso_height*0.42]) {
        rotate([0, -18, 12]) {
            upper_arm();
            translate([0, 0, -upper_arm_length - 1.5])
                rotate([8, 0, 0]) {
                    lower_arm();
                    translate([0, 0, -lower_arm_length - 1.2])
                        rotate([-18, -12, 0])
                            hand();
                }
        }
    }
    
    // Left Leg assembly
    translate([-10, 0, -torso_height*0.22]) {
        rotate([12, 4, -4]) {
            thigh();
            translate([0, 0, -thigh_length - 1.5])
                rotate([-8, 0, 0]) {
                    shin();
                    translate([0, 0, -shin_length - 1.5])
                        rotate([4, 0, 0])
                            foot();
                }
        }
    }
    
    // Right Leg assembly
    translate([10, 0, -torso_height*0.22]) {
        rotate([12, -4, 4]) {
            thigh();
            translate([0, 0, -thigh_length - 1.5])
                rotate([-8, 0, 0]) {
                    shin();
                    translate([0, 0, -shin_length - 1.5])
                        rotate([4, 0, 0])
                            foot();
                }
        }
    }
}

// Render the figure
bionicle_figure();

// Optional: Add base/platform (uncomment if needed)
// translate([0, 0, -foot_height - shin_length - thigh_length - torso_height*0.22 - 2])
//     cylinder(h=2, d=50, $fn=48);