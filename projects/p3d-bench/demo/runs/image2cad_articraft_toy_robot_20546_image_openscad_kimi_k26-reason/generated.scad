/**
 * Mechanical Construction Robot
 * Parametric recreation of a LEGO-style constraction figure
 */

// ==========================================
// Global Parameters
// ==========================================
$fn = 30;

// Master scale factor
s = 1.0;

// --- Foot ---
foot_w = 18 * s;
foot_l = 24 * s;
foot_h = 6 * s;

// --- Leg ---
shin_h = 26 * s;
thigh_h = 22 * s;
leg_w = 9 * s;
leg_d = 10 * s;

// --- Torso ---
torso_w = 24 * s;
torso_h = 28 * s;
torso_d = 14 * s;

// --- Arm ---
arm_seg = 16 * s;
arm_w = 7 * s;

// --- Head ---
head_w = 11 * s;
head_h = 13 * s;
head_d = 11 * s;

// ==========================================
// Utility Modules
// ==========================================

// Rounded cube using minkowski (use sparingly for performance)
module rcube(size, r=1) {
    if (r > 0.01) {
        minkowski() {
            cube([size[0]-2*r, size[1]-2*r, size[2]-2*r], center=true);
            sphere(r);
        }
    } else {
        cube(size, center=true);
    }
}

// ==========================================
// Robot Components
// ==========================================

// Mechanical foot with toe, heel and ankle joint
module foot() {
    union() {
        // Main sole plate
        cube([foot_w, foot_l, foot_h], center=true);
        // Front toe ridge
        translate([0, foot_l/2 - 3, foot_h/2 + 1])
            cube([foot_w - 4, 5, 3], center=true);
        // Rear heel ridge
        translate([0, -foot_l/2 + 3, foot_h/2 + 1])
            cube([foot_w - 4, 4, 3], center=true);
        // Ankle ball joint
        translate([0, -2, foot_h/2 + 3])
            sphere(d=7);
    }
}

// Lower leg with triangular shin armor and knee joint
module lower_leg() {
    union() {
        // Core shin
        cube([leg_w, 5, shin_h], center=true);
        // Triangular shin armor plate
        hull() {
            translate([0, 2, -shin_h/2 + 3])
                cube([leg_w + 2, 2, 4], center=true);
            translate([0, 3, shin_h/2 - 3])
                cube([leg_w + 5, 2, 7], center=true);
        }
        // Knee cylinder joint
        translate([0, 0, shin_h/2])
            rotate([90, 0, 0])
            cylinder(h=8, d=6, center=true);
    }
}

// Upper leg / thigh with hip joint
module upper_leg() {
    union() {
        cube([leg_w, leg_d, thigh_h], center=true);
        // Hip ball joint
        translate([0, 0, thigh_h/2])
            sphere(d=8);
        // Knee bottom connector
        translate([0, 0, -thigh_h/2])
            rotate([90, 0, 0])
            cylinder(h=8, d=6, center=true);
    }
}

// Assembled leg positioned on ground
module leg(side, forward=0, hip_angle=0, knee_angle=0) {
    // side: 1 = left, -1 = right
    x = side * 11;
    translate([x, forward, 0]) {
        // Foot flat on ground
        translate([0, 0, foot_h/2])
            foot();
        // Shin
        translate([0, 0, foot_h + shin_h/2])
            rotate([0, knee_angle, 0])
            lower_leg();
        // Thigh
        translate([0, -2, foot_h + shin_h + thigh_h/2 - 2])
            rotate([0, hip_angle, 0])
            upper_leg();
    }
}

// Central torso with chest armor and waist
module torso() {
    z_hip = foot_h + shin_h + thigh_h - 4;
    union() {
        // Waist / hip block
        translate([0, -2, z_hip + 5])
            rcube([torso_w + 2, torso_d + 4, 10], r=1);
        // Main chest body
        translate([0, 1, z_hip + 10 + torso_h/2 - 2])
            rcube([torso_w, torso_d, torso_h], r=2);
        // Forward chest armor plate
        translate([0, torso_d/2 + 2, z_hip + 10 + torso_h/2 - 2])
            rotate([10, 0, 0])
            cube([torso_w - 6, 3, torso_h - 6], center=true);
        // Abdominal panel
        translate([0, torso_d/2 + 1, z_hip + 8])
            cube([torso_w - 8, 3, 8], center=true);
        // Rear spine detail
        translate([0, -torso_d/2 - 2, z_hip + 10 + torso_h/2 - 2])
            cube([6, 4, torso_h - 4], center=true);
    }
}

// Helmeted head with visor and side ear covers
module head() {
    z_base = foot_h + shin_h + thigh_h + torso_h + 4;
    translate([0, 2, z_base + head_h/2]) {
        union() {
            // Main helmet
            rcube([head_w, head_d, head_h], r=1.5);
            // Forward visor
            translate([0, head_d/2 + 1, -1])
                cube([head_w - 2, 2, 5], center=true);
            // Top crest
            translate([0, -1, head_h/2 + 1])
                cube([head_w - 4, 3, 5], center=true);
            // Side ear covers
            translate([-head_w/2 - 1, 0, 0])
                cylinder(h=head_h - 2, d=4, center=true);
            translate([head_w/2 + 1, 0, 0])
                cylinder(h=head_h - 2, d=4, center=true);
        }
    }
}

// Upper arm segment with shoulder ball and piston detail
module upper_arm() {
    union() {
        cube([arm_w, arm_w, arm_seg], center=true);
        // Shoulder joint
        translate([0, 0, arm_seg/2])
            sphere(d=8);
        // Elbow joint
        translate([0, 0, -arm_seg/2])
            sphere(d=7);
        // Hydraulic piston detail
        translate([arm_w/2 + 1, 0, 0])
            rotate([0, 90, 0])
            cylinder(h=arm_seg*0.6, d=2.5, center=true);
    }
}

// Lower arm / forearm
module lower_arm() {
    union() {
        cube([arm_w - 1, arm_w - 1, arm_seg], center=true);
        // Wrist joint
        translate([0, 0, -arm_seg/2])
            sphere(d=6);
    }
}

// Three-pronged mechanical claw hand
module claw_hand() {
    union() {
        // Wrist block
        cube([5, 5, 5], center=true);
        // Lower left pincer
        translate([-3, 0, -4])
            rotate([0, 25, 0])
            cube([8, 2.5, 2.5], center=true);
        // Lower right pincer
        translate([3, 0, -4])
            rotate([0, -25, 0])
            cube([8, 2.5, 2.5], center=true);
        // Upper central pincer
        translate([0, 0, 4])
            rotate([0, 0, 90])
            cube([8, 2.5, 2.5], center=true);
    }
}

// Simple closed fist
module fist() {
    union() {
        cube([5, 5, 5], center=true);
        sphere(d=6);
    }
}

// Assembled arm with shoulder and elbow articulation
module arm(side, has_claw=true, arm_angle=0, elbow_bend=0) {
    // side: 1 = left, -1 = right
    x = side * (torso_w/2 + 3);
    z = foot_h + shin_h + thigh_h + torso_h - 8;
    
    translate([x, 0, z]) {
        rotate([0, 0, side * arm_angle]) {
            // Upper arm
            translate([0, 0, arm_seg/2])
                upper_arm();
            // Lower arm with elbow rotation
            translate([0, 0, -arm_seg/2])
                rotate([elbow_bend, 0, 0]) {
                    translate([0, 0, -arm_seg/2])
                        lower_arm();
                    // Hand at wrist
                    translate([0, 0, -arm_seg - 3])
                        if (has_claw) {
                            claw_hand();
                        } else {
                            fist();
                        }
                }
        }
    }
}

// Rear backpack with thrusters and antenna fins
module backpack() {
    z = foot_h + shin_h + thigh_h + torso_h - 10;
    translate([0, -torso_d/2 - 4, z + 12]) {
        union() {
            // Main thruster housing
            rcube([torso_w - 8, 5, 18], r=1);
            // Left side thruster
            translate([-torso_w/2 + 5, -3, 4])
                rotate([0, 45, 0])
                cylinder(h=14, d=3.5, center=true);
            // Right side thruster
            translate([torso_w/2 - 5, -3, 4])
                rotate([0, -45, 0])
                cylinder(h=14, d=3.5, center=true);
            // Top antenna / fins
            translate([-6, 0, 10])
                rotate([0, -25, 0])
                cube([2, 3, 14], center=true);
            translate([6, 0, 10])
                rotate([0, 25, 0])
                cube([2, 3, 14], center=true);
        }
    }
}

// ==========================================
// Final Assembly
// ==========================================

module robot() {
    union() {
        // Legs in dynamic walking pose
        leg(1, forward=6, hip_angle=10, knee_angle=5);   // Left leg forward
        leg(-1, forward=-4, hip_angle=-5, knee_angle=-5); // Right leg back
        
        // Torso
        torso();
        
        // Arms: left reaching forward with claw, right tucked
        arm(1, has_claw=true, arm_angle=-35, elbow_bend=-45);
        arm(-1, has_claw=false, arm_angle=15, elbow_bend=-25);
        
        // Head
        head();
        
        // Backpack
        backpack();
    }
}

robot();