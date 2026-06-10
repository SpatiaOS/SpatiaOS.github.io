// Bionicle Rahkshi (Turahk) Model
// Optimized for performance (avoiding complex hulls on spheres)
// Modeled in mm

$fn = 32; // Moderate resolution for speed and quality

// --- Parameters ---
// Colors
c_body = "gray";
c_dark = "black";
c_light = "white";

// Dimensions
torso_h = 40;
torso_w = 35;
leg_len = 50;
arm_len = 40;

// --- Main Assembly ---
module rahkshi_assembly() {
    color(c_body) {
        // Torso Group (Hunched forward)
        translate([0, 0, 70]) {
            rotate([20, 0, 0]) { // Forward lean
                torso_group();
            }
        }
        
        // Head (Attached to torso, adjusted for lean)
        translate([0, 15, 105]) {
             // Compensate for torso lean roughly
            rotate([10, 0, 0]) {
                head_assembly();
            }
        }

        // Left Leg (Forward stance)
        translate([-15, 15, 0]) {
            rotate([15, 0, -5]) {
                leg_assembly();
            }
        }
        
        // Right Leg (Back stance)
        translate([15, -5, 0]) {
            rotate([-10, 0, 10]) {
                leg_assembly();
            }
        }
        
        // Left Arm (Claw - Forward)
        translate([-35, 20, 85]) {
            rotate([30, 0, 40]) {
                arm_claw_assembly();
            }
        }
        
        // Right Arm (Blaster - Back/Side)
        translate([35, 0, 85]) {
            rotate([10, 0, -30]) {
                arm_blaster_assembly();
            }
        }
    }
}

// --- Torso ---
module torso_group() {
    // Main Body Core
    cylinder(h=torso_h, r=15, center=true);
    
    // Chest Plate (Front)
    translate([0, 12, 5]) {
        hull() {
            cube([25, 10, 25], center=true);
            translate([0, 0, 15]) sphere(r=12);
        }
    }
    
    // Back Shell (The large curved carapace)
    // Using a scaled sphere and cutting the front to make it a shell
    translate([0, -5, 10]) {
        difference() {
            scale([1, 0.8, 1.2]) sphere(r=28);
            // Cut out the inside/front
            translate([0, 10, 0]) cube([60, 60, 60], center=true);
            // Cut bottom to fit on hips
            translate([0, 0, -20]) cube([60, 60, 40], center=true);
        }
    }
    
    // Shoulder Sockets
    translate([-20, 0, 15]) sphere(r=10);
    translate([20, 0, 15]) sphere(r=10);
    
    // Hip Sockets
    translate([-12, 0, -15]) sphere(r=12);
    translate([12, 0, -15]) sphere(r=12);
    
    // Spine/Back details
    translate([0, -15, 0]) {
        cylinder(h=30, r=5, center=true);
    }
}

// --- Head ---
module head_assembly() {
    // Main Skull
    hull() {
        sphere(r=14);
        translate([0, 8, 5]) sphere(r=12);
    }
    
    // Snout / Mask
    translate([0, 12, -2]) {
        hull() {
            sphere(r=8);
            translate([0, 10, -5]) sphere(r=5);
        }
    }
    
    // Top Fin
    translate([0, -5, 12]) {
        rotate([0, 0, 0]) {
            hull() {
                cube([3, 15, 15], center=true);
                translate([0, -10, 5]) cube([2, 5, 5], center=true);
            }
        }
    }
    
    // Eyes (Dark sockets)
    color(c_dark) {
        translate([-7, 10, 4]) sphere(r=3);
        translate([7, 10, 4]) sphere(r=3);
    }
}

// --- Legs ---
module leg_assembly() {
    // Thigh
    translate([0, 0, 0]) {
        rotate([45, 0, 0]) {
            // Main thigh bone
            cylinder(h=45, r1=10, r2=8, center=true);
            
            // Side Panel (Triangular armor)
            translate([10, 0, -10]) {
                rotate([0, 90, 0]) {
                    linear_extrude(height=4) {
                        polygon(points=[[0,0], [20, -15], [20, 15]]);
                    }
                }
            }
            
            // Knee Joint
            translate([0, 0, -22]) {
                sphere(r=9);
                
                // Shin
                rotate([-80, 0, 0]) {
                    translate([0, 0, -5]) {
                        // Main shin bone
                        cylinder(h=45, r1=8, r2=6, center=true);
                        
                        // Shin Side Panel
                        translate([8, 0, -10]) {
                            rotate([0, 90, 0]) {
                                linear_extrude(height=3) {
                                    polygon(points=[[0,0], [15, -10], [15, 10]]);
                                }
                            }
                        }
                        
                        // Ankle Joint
                        translate([0, 0, -22]) {
                            sphere(r=7);
                            
                            // Foot
                            translate([0, 0, -5]) {
                                foot_assembly();
                            }
                        }
                    }
                }
            }
        }
    }
}

module foot_assembly() {
    // Main Foot Base
    hull() {
        sphere(r=7);
        translate([0, 15, 0]) sphere(r=5);
        translate([0, -8, 0]) sphere(r=4);
    }
    
    // Toes
    // Center
    translate([0, 18, -2]) {
        hull() {
            sphere(r=3);
            translate([0, 8, -1]) sphere(r=2);
        }
    }
    // Left
    translate([8, 14, -2]) {
        rotate([0, 0, 20]) {
            hull() {
                sphere(r=2.5);
                translate([0, 6, -1]) sphere(r=1.5);
            }
        }
    }
    // Right
    translate([-8, 14, -2]) {
        rotate([0, 0, -20]) {
            hull() {
                sphere(r=2.5);
                translate([0, 6, -1]) sphere(r=1.5);
            }
        }
    }
}

// --- Arms ---
module arm_claw_assembly() {
    // Upper Arm
    cylinder(h=35, r1=8, r2=6, center=true);
    
    // Elbow
    translate([0, 0, -17]) {
        sphere(r=7);
        
        // Forearm
        rotate([40, 0, 0]) {
            translate([0, 0, -5]) {
                cylinder(h=30, r1=6, r2=5, center=true);
                
                // Claw Hand
                translate([0, 0, -20]) {
                    claw_hand();
                }
            }
        }
    }
}

module arm_blaster_assembly() {
    // Upper Arm
    cylinder(h=35, r1=8, r2=6, center=true);
    
    // Elbow
    translate([0, 0, -17]) {
        sphere(r=7);
        
        // Forearm
        rotate([-20, 0, 0]) {
            translate([0, 0, -5]) {
                cylinder(h=30, r1=6, r2=5, center=true);
                
                // Blaster Hand
                translate([0, 0, -20]) {
                    blaster_hand();
                }
            }
        }
    }
}

module claw_hand() {
    // Base joint
    sphere(r=5);
    
    // Top Pincer
    translate([0, 5, 0]) {
        rotate([-20, 0, 0]) {
            hull() {
                sphere(r=3);
                translate([0, 15, -5]) sphere(r=2);
            }
        }
    }
    
    // Bottom Pincer
    translate([0, -5, 0]) {
        rotate([20, 0, 0]) {
            hull() {
                sphere(r=3);
                translate([0, 15, 5]) sphere(r=2);
            }
        }
    }
    
    // Inner Spike
    translate([0, 0, 4]) {
        cylinder(h=12, r1=2, r2=1, center=true);
    }
}

module blaster_hand() {
    // Handle
    cylinder(h=12, r=3, center=true);
    
    // Barrel
    translate([0, 0, 8]) {
        rotate([90, 0, 0]) {
            cylinder(h=25, r1=4, r2=3, center=true);
        }
    }
    
    // Muzzle Flash suppressor / Tip
    translate([0, 0, 20]) {
         rotate([90, 0, 0]) {
            cylinder(h=5, r=5, center=true);
        }
    }
    
    // Scope/Detail
    translate([0, 4, 5]) {
        cube([3, 6, 3], center=true);
    }
}

// --- Execution ---
rahkshi_assembly();