// Bionicle-Style Robot Model
// All dimensions parametric, default units = mm

// ------------------- GLOBAL PARAMETERS -------------------
$fn = 64;                     // Curve smoothness
scale = 1;                    // Overall scale factor
ball_joint_r = 2.5 * scale;   // Standard ball joint size
limb_radius = 2 * scale;      // Arm/leg cross section radius
torso_height = 25 * scale;
torso_width = 15 * scale;
torso_depth = 10 * scale;
head_radius = 6 * scale;
upper_arm_length = 15 * scale;
lower_arm_length = 15 * scale;
upper_leg_length = 20 * scale;
lower_leg_length = 20 * scale;
claw_length = 20 * scale;
foot_length = 18 * scale;

// ------------------- HELPER MODULES -------------------
// Standard ball joint for articulation points
module ball_joint(r=ball_joint_r) {
    sphere(r=r);
}

// Segmented limb with cutout details
module robotic_limb(length, r=limb_radius) {
    difference() {
        // Main limb cylinder
        cylinder(h=length, r=r, center=true);
        // Repeating circular holes along limb
        for (i = [0 : 5*scale : length - 5*scale]) {
            translate([0, 0, i - length/2 + 2.5*scale])
            rotate([90, 0, 0])
            cylinder(h=r*3, r=1.5*scale, center=true);
        }
        // Side triangular cutouts for skeletal look
        for (side = [-1, 1]) {
            translate([0, side*r*0.8, 0])
            linear_extrude(length, center=true)
            polygon(points=[[0, -length/2], [r*0.6, 0], [0, length/2], [-r*0.6, 0]]);
        }
    }
}

// Claw hand for left arm
module pincer_claw() {
    union() {
        // Connection base
        cylinder(h=5*scale, r=limb_radius);
        // Two curved pincer fingers
        for (side = [-1, 1]) {
            translate([side*3*scale, 0, 5*scale])
            rotate([0, side*15, 0])
            linear_extrude(claw_length)
            offset(r=0.5*scale)
            polygon(points=[[0,0], [1*scale, 0], [1.5*scale, claw_length*0.7], [0.5*scale, claw_length], [-0.5*scale, claw_length], [-1.5*scale, claw_length*0.7], [-1*scale, 0]]);
            // Texture ridges on pincer surface
            translate([side*3*scale, 0, 5*scale + claw_length*0.3])
            rotate([0, side*15, 90])
            linear_extrude(2*scale)
            for (i = [0 : 2*scale : claw_length*0.5]) {
                translate([i, 0]) square([1*scale, 1.5*scale]);
            }
        }
    }
}

// Robotic head with eye detail
module robot_head() {
    difference() {
        union() {
            // Curved helmet hull shape
            hull() {
                sphere(r=head_radius);
                translate([0, head_radius*0.8, -head_radius*0.3]) sphere(r=head_radius*0.7);
                translate([0, -head_radius*0.5, head_radius*0.2]) cube([head_radius*1.2, head_radius*1.5, head_radius*0.8], center=true);
            }
            // Eye detail
            translate([head_radius*0.7, 0, 0]) color("darkgray") sphere(r=head_radius*0.25);
        }
        // Lower head opening
        translate([0, 0, -head_radius*0.8]) cube([head_radius*2, head_radius*2, head_radius], center=true);
        // Top mounting hole
        translate([0, 0, head_radius*0.9]) rotate([90,0,0]) cylinder(h=head_radius, r=head_radius*0.2, center=true);
    }
}

// Foot with ankle joint
module robot_foot() {
    union() {
        // Base foot platform
        hull() {
            translate([0, -foot_length*0.4, 0]) cylinder(r=3*scale, h=3*scale);
            translate([0, foot_length*0.4, 0]) cylinder(r=4*scale, h=3*scale);
        }
        // Ankle mount
        translate([0, -foot_length*0.2, 3*scale]) cube([8*scale, 6*scale, 4*scale], center=true);
        translate([0, -foot_length*0.2, 7*scale]) ball_joint();
        // Foot surface detail holes
        difference() {
            translate([0, 0, 1*scale]) cube([7*scale, 12*scale, 2*scale], center=true);
            for (x = [-2*scale, 2*scale], y = [-3*scale, 0, 3*scale]) {
                translate([x, y, 1*scale]) cylinder(h=3*scale, r=1*scale, center=true);
            }
        }
    }
}

// ------------------- MAIN ASSEMBLY -------------------
union() {
    // Main Torso
    translate([0, 0, torso_height/2])
    difference() {
        // Curved torso shell
        rotate_extrude(angle=180)
        translate([torso_depth/2, 0])
        square([torso_width/2, torso_height], center=true);
        // Hollow internal cutout
        translate([0, 0, 0]) cube([torso_width*0.8, torso_depth*0.8, torso_height*0.9], center=true);
        // Joint mounting points
        for (pos = [
            [-torso_width/2, 0, torso_height*0.3],  // Left arm
            [torso_width/2, 0, torso_height*0.3],   // Right arm
            [-torso_width*0.25, 0, -torso_height/2 + 5*scale], // Left leg
            [torso_width*0.25, 0, -torso_height/2 + 10*scale]  // Right leg
        ]) {
            translate(pos) ball_joint();
        }
    }

    // Head
    translate([0, -torso_depth*0.3, torso_height*0.95])
    rotate([-20, 0, 0])
    robot_head();

    // Back Details (fins, prongs, weapons)
    translate([0, torso_depth*0.3, torso_height*0.5]) {
        // Dorsal fin
        rotate([10, 0, 0])
        linear_extrude(2*scale)
        polygon(points=[[0,0], [5*scale, 0], [10*scale, 15*scale], [0, 20*scale], [-10*scale, 15*scale], [-5*scale, 0]]);
        // Rear prongs
        for (a = [30, -30]) {
            rotate([0, a, 0])
            translate([0, 5*scale, 0])
            cylinder(h=15*scale, r1=2*scale, r2=0.5*scale);
        }
        // Side weapon barrels
        for (side = [-1, 1]) {
            translate([side*torso_width*0.4, torso_depth*0.5, -torso_height*0.2])
            rotate([0, side*20, 90])
            cylinder(h=12*scale, r=2*scale);
        }
    }

    // Left Arm (with claw)
    translate([-torso_width/2, 0, torso_height*0.3])
    rotate([0, -40, 60]) {
        robotic_limb(upper_arm_length);
        translate([0, 0, upper_arm_length/2]) ball_joint();
        translate([0, 0, upper_arm_length + 2*scale]) rotate([0, 20, 0]) robotic_limb(lower_arm_length);
        translate([0, 0, upper_arm_length + lower_arm_length + 4*scale]) pincer_claw();
    }

    // Right Arm (with small tool)
    translate([torso_width/2, 0, torso_height*0.3])
    rotate([0, 30, -30]) {
        robotic_limb(upper_arm_length);
        translate([0, 0, upper_arm_length/2]) ball_joint();
        translate([0, 0, upper_arm_length + 2*scale]) rotate([0, -30, 0]) robotic_limb(lower_arm_length);
        translate([0, 0, upper_arm_length + lower_arm_length + 4*scale]) cylinder(h=8*scale, r1=limb_radius, r2=limb_radius*0.3);
    }

    // Left Leg
    translate([-torso_width*0.25, 0, -torso_height/2 + 5*scale])
    rotate([0, 20, 10]) {
        robotic_limb(upper_leg_length);
        translate([0, 0, -upper_leg_length/2]) ball_joint();
        translate([0, 0, -upper_leg_length - 2*scale]) rotate([0, -40, 0]) robotic_limb(lower_leg_length);
        translate([0, 0, -upper_leg_length - lower_leg_length - 4*scale]) rotate([180, 0, 0]) robot_foot();
    }

    // Right Leg
    translate([torso_width*0.25, 0, -torso_height/2 + 10*scale])
    rotate([0, -10, -10]) {
        robotic_limb(upper_leg_length);
        translate([0, 0, -upper_leg_length/2]) ball_joint();
        translate([0, 0, -upper_leg_length - 2*scale]) rotate([0, 40, 0]) robotic_limb(lower_leg_length);
        translate([0, 0, -upper_leg_length - lower_leg_length - 4*scale]) rotate([180, 0, 0]) robot_foot();
    }
}