// ============================================================================
// Front-End Loader Tractor Model
// ============================================================================

// Global Resolution
$fn = 32;

// ============================================================================
// Parameters
// ============================================================================

// General Dimensions
chassis_length = 120;
chassis_width = 60;
chassis_height = 25;
chassis_ground_clearance = 15;

// Wheels
wheel_radius = 22;
wheel_width = 16;
wheel_track_width = 70; // Distance between outer edges of wheels
tire_tread_depth = 4;
tire_tread_count = 12;

// Cab
cab_width = 45;
cab_length = 35;
cab_height = 30;
cab_pos_x = -20; // Relative to chassis center
cab_pos_y = 0;
cab_pos_z = chassis_height;

// Exhaust
exhaust_height = 20;
exhaust_radius = 4;

// Loader Arms
arm_length = 60;
arm_width = 8;
arm_thickness = 6;
arm_pivot_z = chassis_height + 5;
arm_pivot_x = 25;

// Bucket
bucket_width = 75;
bucket_height = 30;
bucket_depth = 35;
bucket_wall_thickness = 3;

// ============================================================================
// Main Assembly
// ============================================================================

assembly();

module assembly() {
    // Chassis
    translate([0, 0, chassis_ground_clearance]) {
        chassis_body();
        
        // Cab
        translate([cab_pos_x, cab_pos_y, cab_pos_z]) {
            cab();
        }
        
        // Exhaust
        translate([cab_pos_x - 15, cab_width/2 - 5, cab_pos_z + cab_height]) {
            exhaust();
        }
        
        // Loader Arms & Bucket
        // Left Arm
        translate([arm_pivot_x, wheel_track_width/2 - wheel_width/2 - 2, arm_pivot_z]) {
            loader_arm();
            // Bucket connection
            translate([arm_length, 0, -5]) {
                rotate([0, 0, 0]) { // Adjust bucket angle
                     bucket();
                }
            }
            // Hydraulic cylinder (simplified)
            translate([15, -5, 10]) {
                rotate([0, 30, 0]) {
                    cylinder(h=25, r=3);
                }
            }
        }

        // Right Arm
        translate([arm_pivot_x, -(wheel_track_width/2 - wheel_width/2 + 2), arm_pivot_z]) {
            mirror([0, 1, 0]) {
                loader_arm();
                // Bucket connection
                translate([arm_length, 0, -5]) {
                    bucket();
                }
                 // Hydraulic cylinder (simplified)
                translate([15, -5, 10]) {
                    rotate([0, 30, 0]) {
                        cylinder(h=25, r=3);
                    }
                }
            }
        }
    }

    // Wheels
    // Front Left
    translate([35, wheel_track_width/2, chassis_ground_clearance]) {
        wheel();
    }
    // Front Right
    translate([35, -wheel_track_width/2, chassis_ground_clearance]) {
        wheel();
    }
    // Rear Left
    translate([-35, wheel_track_width/2, chassis_ground_clearance]) {
        wheel();
    }
    // Rear Right
    translate([-35, -wheel_track_width/2, chassis_ground_clearance]) {
        wheel();
    }
    
    // Steps/Ladder on the side
    translate([10, chassis_width/2 + 2, chassis_ground_clearance + 5]) {
        ladder();
    }
}

// ============================================================================
// Component Modules
// ============================================================================

module chassis_body() {
    // Main Chassis Block
    color("gray")
    union() {
        // Base frame
        cube([chassis_length, chassis_width, chassis_height], center=true);
        
        // Engine Hood (Front part, slightly narrower/higher)
        translate([25, 0, chassis_height/2]) {
            cube([35, chassis_width - 10, 15], center=true);
        }
        
        // Rear Platform (under cab)
        translate([-25, 0, chassis_height/2]) {
             cube([45, chassis_width + 5, 5], center=true);
        }
        
        // Wheel arches (simplified as blocks for now, or just let wheels intersect)
        // The image shows distinct fenders.
        // Front Fender
        translate([35, 0, chassis_height + 5]) {
             cube([30, chassis_width + 2, 10], center=true);
        }
        // Rear Fender
        translate([-35, 0, chassis_height + 5]) {
             cube([30, chassis_width + 2, 10], center=true);
        }
    }
}

module cab() {
    color("lightgray")
    union() {
        // Main Cab Body
        // Use minkowski for rounded roof
        minkowski() {
            cube([cab_length - 4, cab_width - 4, cab_height - 4], center=true);
            sphere(r=2);
        }
        
        // Windows (Cutouts)
        // We need to subtract from the main body. 
        // Since I used union above, I should wrap the whole cab in a difference if I want holes.
        // Let's restructure:
    }
    
    // Restructuring Cab for Windows
    difference() {
        // Solid Cab Base
        minkowski() {
            cube([cab_length, cab_width - 2, cab_height - 2], center=true);
            sphere(r=2);
        }
        
        // Front Window
        translate([cab_length/2 - 1, 0, 2]) {
            cube([2, cab_width - 4, cab_height - 8], center=true);
        }
        
        // Side Windows (Left)
        translate([0, cab_width/2 - 1, 2]) {
            cube([cab_length - 10, 2, cab_height - 10], center=true);
        }
         // Side Windows (Right)
        translate([0, -cab_width/2 + 1, 2]) {
            cube([cab_length - 10, 2, cab_height - 10], center=true);
        }
        
        // Back Window
        translate([-cab_length/2 + 1, 0, 2]) {
            cube([2, cab_width - 6, cab_height - 8], center=true);
        }
    }
    
    // Door frame details / Pillars
    color("darkgray")
    union() {
        // Front Pillars
        translate([cab_length/2 - 2, cab_width/2 - 2, 0]) {
             cube([2, 2, cab_height], center=true);
        }
        translate([cab_length/2 - 2, -cab_width/2 + 2, 0]) {
             cube([2, 2, cab_height], center=true);
        }
    }
}

module exhaust() {
    color("black")
    union() {
        cylinder(h=exhaust_height, r=exhaust_radius);
        // Cap
        translate([0, 0, exhaust_height]) {
            cylinder(h=2, r=exhaust_radius + 1);
        }
    }
}

module wheel() {
    rotate([90, 0, 0]) { // Orient along Y axis
        union() {
            // Tire Base
            color("black")
            cylinder(h=wheel_width, r=wheel_radius);
            
            // Rim / Hub
            color("gray")
            cylinder(h=wheel_width + 1, r=wheel_radius * 0.6);
            
            // Hub Hole
            color("black")
            cylinder(h=wheel_width + 2, r=5);
            
            // Treads
            color("black")
            for (i = [0 : tire_tread_count-1]) {
                rotate([0, 0, i * (360/tire_tread_count)]) {
                    translate([wheel_radius, 0, 0]) {
                        tread_block();
                    }
                }
            }
        }
    }
}

module tread_block() {
    // Chevron / V-shape tread
    union() {
        // Left part of V
        rotate([0, 0, 30]) {
            cube([tire_tread_depth * 2, tire_tread_depth, wheel_width], center=true);
        }
        // Right part of V
        rotate([0, 0, -30]) {
            cube([tire_tread_depth * 2, tire_tread_depth, wheel_width], center=true);
        }
    }
}

module loader_arm() {
    color("orange")
    union() {
        // Main Arm Bar
        // Using hull for rounded ends
        hull() {
            sphere(r=arm_width/2);
            translate([arm_length, 0, 0]) sphere(r=arm_width/2);
        }
        
        // Vertical supports for bucket connection
        translate([arm_length, 0, -10]) {
            cube([arm_thickness, arm_width, 15], center=true);
        }
        
        // Pivot point detail
        sphere(r=arm_width/2 + 1);
    }
}

module bucket() {
    color("gray")
    union() {
        // The bucket is complex. I'll build it from plates.
        
        // Back Plate
        translate([-bucket_depth/2, 0, 0]) {
            cube([bucket_wall_thickness, bucket_width, bucket_height], center=true);
        }
        
        // Bottom Plate
        translate([0, 0, -bucket_height/2]) {
            cube([bucket_depth, bucket_width, bucket_wall_thickness], center=true);
        }
        
        // Side Plates (Angled)
        // Left Side
        translate([0, bucket_width/2 - bucket_wall_thickness/2, 0]) {
             // Rotate to flare out
             rotate([0, 0, 15]) {
                 cube([bucket_depth, bucket_wall_thickness, bucket_height], center=true);
             }
        }
        // Right Side
        translate([0, -bucket_width/2 + bucket_wall_thickness/2, 0]) {
             rotate([0, 0, -15]) {
                 cube([bucket_depth, bucket_wall_thickness, bucket_height], center=true);
             }
        }
        
        // Top Lip / Cutting Edge
        // Angled forward
        translate([bucket_depth/2 - 2, 0, bucket_height/2 - 2]) {
            rotate([45, 0, 0]) {
                cube([10, bucket_width + 5, 4], center=true);
            }
        }
        
        // Reinforcement ribs on the side (visible in image)
        translate([0, bucket_width/2 + 2, 0]) {
             cube([bucket_depth - 5, 2, bucket_height - 5], center=true);
        }
        translate([0, -bucket_width/2 - 2, 0]) {
             cube([bucket_depth - 5, 2, bucket_height - 5], center=true);
        }
    }
}

module ladder() {
    color("black")
    union() {
        // Side rail
        cube([2, 2, 20], center=true);
        // Rungs
        for (i = [0:3]) {
            translate([0, 0, -8 + i * 5]) {
                rotate([90, 0, 0])
                cylinder(h=4, r=1.5);
            }
        }
    }
}