// Mech Robot / Bionicle-style Figure
// Simplified for efficient rendering while maintaining shape

$fn = 16;

// === Global Parameters ===
torso_width = 30;
torso_depth = 20;
torso_height = 35;

hip_width = 28;
hip_height = 12;
hip_depth = 18;

upper_leg_length = 30;
upper_leg_width = 10;
lower_leg_length = 35;
lower_leg_width = 12;
shin_armor_width = 16;
shin_armor_height = 28;

foot_length = 30;
foot_width = 25;
foot_height = 10;
foot_base_height = 6;
foot_base_dia = 28;

upper_arm_length = 22;
upper_arm_width = 8;
lower_arm_length = 25;
lower_arm_width = 7;

head_width = 16;
head_depth = 18;
head_height = 14;

weapon_length = 40;
weapon_dia = 5;
joint_radius = 5;

// Pose angles
left_hip_angle = 10;
right_hip_angle = -5;
left_knee_angle = -15;
right_knee_angle = -10;
left_shoulder_angle = -40;
right_shoulder_angle = 20;
left_elbow_angle = -30;
right_elbow_angle = -50;
torso_twist = -8;

// === Helper Modules ===

module rounded_box(w, d, h, r=2) {
    translate([0,0,0])
    hull() {
        for (x=[-1,1], y=[-1,1])
            translate([x*(w/2-r), y*(d/2-r), 0])
                cylinder(h=h, r=r, center=true);
    }
}

module armor_plate(w, d, h) {
    cube([w, d, h], center=true);
}

module joint(r=5) {
    color("DimGray") sphere(r, $fn=12);
}

module limb(length, r1, r2) {
    hull() {
        sphere(r1, $fn=12);
        translate([0,0,-length])
            sphere(r2, $fn=12);
    }
}

// === Component Modules ===

module foot() {
    color("Gray") {
        // Base plate
        translate([0,0,foot_base_height/2])
            cylinder(h=foot_base_height, d1=foot_base_dia, d2=foot_base_dia-4, center=true, $fn=8);
        
        // Toe section
        translate([5,0,foot_base_height+foot_height/2])
            cube([foot_length*0.6, foot_width*0.7, foot_height*0.6], center=true);
        
        // Heel
        translate([-5,0,foot_base_height+foot_height/2])
            cube([foot_length*0.35, foot_width*0.6, foot_height*0.7], center=true);
        
        // Ankle connector
        translate([0,0,foot_base_height+foot_height])
            cylinder(h=6, d1=12, d2=8, $fn=12);
        
        // Toe details
        for (i=[-1,0,1])
            translate([foot_length*0.35, i*7, foot_base_height+3])
                cube([8,5,3], center=true);
    }
}

module lower_leg() {
    color("Silver") {
        limb(lower_leg_length, lower_leg_width/2, lower_leg_width/2*0.8);
        
        // Shin armor
        translate([lower_leg_width/2-1, 0, -lower_leg_length*0.55])
            cube([6, shin_armor_width, shin_armor_height], center=true);
        
        // Triangle details on armor
        for (i=[0:2])
            translate([lower_leg_width/2+2.5, 0, -lower_leg_length*0.7 + i*8])
                rotate([90,0,0])
                    cylinder(h=2, r1=3, r2=0, center=true, $fn=3);
    }
}

module upper_leg() {
    color("DarkGray") {
        limb(upper_leg_length, upper_leg_width/2, upper_leg_width/2*1.1);
        
        // Thigh armor
        translate([upper_leg_width/2+1, 0, -upper_leg_length*0.5])
            cube([5, upper_leg_width*1.1, upper_leg_length*0.55], center=true);
    }
}

module leg(hip_angle, knee_angle, mirror_leg=false) {
    mir = mirror_leg ? -1 : 1;
    joint();
    rotate([hip_angle, 0, mir*5]) {
        upper_leg();
        translate([0,0,-upper_leg_length]) {
            joint(joint_radius*0.9);
            rotate([knee_angle, 0, 0]) {
                lower_leg();
                translate([0,0,-lower_leg_length]) {
                    joint(joint_radius*0.8);
                    translate([0,0,-foot_height-foot_base_height])
                        rotate([0,0,mir*5])
                            foot();
                }
            }
        }
    }
}

module torso() {
    color("Silver") {
        // Main chest
        hull() {
            translate([0,0,torso_height*0.4])
                cube([torso_depth-2, torso_width-2, torso_height*0.3], center=true);
            translate([0,0,-torso_height*0.1])
                cube([torso_depth*0.7, torso_width*0.65, torso_height*0.18], center=true);
        }
        
        // Upper collar
        translate([0,0,torso_height*0.5])
            cube([torso_depth*0.6, torso_width*0.75, 7], center=true);
        
        // Back armor
        translate([-torso_depth/2-2, 0, torso_height*0.25])
            cube([6, torso_width*0.55, torso_height*0.45], center=true);
        
        // Side panels
        for (side=[-1,1])
            translate([0, side*torso_width/2, torso_height*0.3])
                cube([torso_depth*0.55, 4, 16], center=true);
        
        // Waist
        translate([0,0,-torso_height*0.15])
            cylinder(h=8, d1=16, d2=20, center=true, $fn=12);
    }
}

module hip_section() {
    color("DimGray") {
        cube([hip_depth, hip_width, hip_height], center=true);
        for (side=[-1,1])
            translate([0, side*hip_width/2, 0])
                rotate([0,90,0])
                    cylinder(h=hip_depth*0.5, d=10, center=true, $fn=12);
    }
}

module claw() {
    color("Gray") {
        cylinder(h=6, d=8, center=true, $fn=10);
        for (angle=[-25, 0, 25]) {
            rotate([angle, 0, 0])
                translate([0,0,-15]) {
                    limb(12, 2.5, 2);
                    translate([0,0,-12])
                        rotate([15,0,0])
                            limb(10, 2, 1);
                }
        }
        translate([0,0,-8])
            cube([7,12,10], center=true);
    }
}

module weapon_arm_end() {
    color("DimGray") {
        rotate([0,90,0])
            cylinder(h=25, d=6, $fn=10);
        translate([0,3,0])
            rotate([0,90,0])
                cylinder(h=20, d=4, $fn=8);
        cube([10,12,10], center=true);
        translate([-6,0,0])
            cube([8,10,8], center=true);
    }
}

module arm(shoulder_angle, elbow_angle, is_claw=true) {
    joint(joint_radius*1.1);
    rotate([shoulder_angle, 0, 0]) {
        color("Silver") {
            limb(upper_arm_length, upper_arm_width/2, upper_arm_width/2*0.9);
            translate([upper_arm_width/2+1, 0, -5])
                cube([4, upper_arm_width*1.2, 13], center=true);
        }
        translate([0,0,-upper_arm_length]) {
            joint(joint_radius*0.8);
            rotate([elbow_angle, 0, 0]) {
                color("Silver") {
                    limb(lower_arm_length, lower_arm_width/2, lower_arm_width/2*0.85);
                    translate([lower_arm_width/2, 0, -lower_arm_length*0.4])
                        cube([3, lower_arm_width, lower_arm_length*0.4], center=true);
                }
                translate([0,0,-lower_arm_length]) {
                    if (is_claw) claw();
                    else weapon_arm_end();
                }
            }
        }
    }
}

module head() {
    color("DimGray") {
        // Main skull
        scale([1, head_depth/head_width, head_height/head_width])
            sphere(head_width/2, $fn=16);
        
        // Jaw
        translate([head_depth*0.15, 0, -head_height*0.25])
            scale([1.2, 0.8, 0.6])
                sphere(7, $fn=12);
        
        // Visor
        color("DarkSlateGray")
            translate([head_depth*0.35, 0, 0])
                scale([0.5, 1.0, 0.35])
                    sphere(7, $fn=12);
        
        // Crest
        translate([0,0,head_height*0.45])
            scale([1.5, 0.3, 1])
                sphere(4, $fn=10);
        
        // Side details
        for (s=[-1,1])
            translate([0, s*head_width/2, 0])
                sphere(3, $fn=8);
    }
}

module shoulder_weapons() {
    color("Gray") {
        rotate([0,70,0]) {
            cylinder(h=weapon_length, d=weapon_dia, $fn=10);
            translate([0,0,weapon_length])
                cylinder(h=5, d1=weapon_dia, d2=weapon_dia*0.6, $fn=10);
        }
        translate([3,4,0])
            rotate([0,65,5])
                cylinder(h=weapon_length*0.85, d=weapon_dia*0.7, $fn=8);
        cube([10,12,8], center=true);
    }
}

// === Main Assembly ===
module mech_robot() {
    hip_z = lower_leg_length + upper_leg_length + foot_height + foot_base_height + 10;
    
    translate([0,0,hip_z])
    rotate([0,0,torso_twist]) {
        hip_section();
        
        // Legs
        translate([0, -hip_width/2-2, 0])
            leg(left_hip_angle, left_knee_angle, false);
        translate([0, hip_width/2+2, 0])
            leg(right_hip_angle, right_knee_angle, true);
        
        // Torso
        translate([0,0,hip_height/2+5])
            torso();
        
        // Arms
        translate([0, -torso_width/2-3, hip_height/2+5+torso_height*0.45])
            arm(left_shoulder_angle, left_elbow_angle, false);
        translate([0, torso_width/2+3, hip_height/2+5+torso_height*0.45])
            arm(right_shoulder_angle, right_elbow_angle, true);
        
        // Head
        translate([0,0, hip_height/2+5+torso_height*0.55+head_height/2+2])
            rotate([0,0,-torso_twist*0.5])
                head();
        
        // Shoulder weapons
        translate([-torso_depth/2, -8, hip_height/2+5+torso_height*0.5])
            rotate([0,0,15])
                shoulder_weapons();
    }
}

mech_robot();