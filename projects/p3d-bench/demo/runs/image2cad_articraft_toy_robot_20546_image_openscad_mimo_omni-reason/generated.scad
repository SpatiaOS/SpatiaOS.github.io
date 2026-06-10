// Robot Model - Parametric Design
// Estimated dimensions based on image proportions (mm)

$fn = 100; // Smoothness for curved surfaces

// ------------------------------
// Parametric Variables
// ------------------------------
total_height = 100;   // Overall height (foot bottom to head top)
torso_height = 30;    // Torso vertical size
torso_width = 20;     // Torso horizontal width
torso_depth = 15;     // Torso depth (front-back)
arm_length = 40;      // Shoulder to claw tip
leg_length = 50;      // Hip to foot bottom
foot_size = [15, 10, 8]; // Foot: width, depth, height
head_size = [12, 10, 15]; // Head: width, depth, height
piston_length = 8;    // Piston cylinder length
piston_radius = 1;    // Piston cylinder radius
joint_radius = 2;     // Joint sphere radius

// ------------------------------
// Helper Modules
// ------------------------------

// Head Module: Rounded cube with visor and antenna
module head() {
    // Main head (rounded via minkowski)
    minkowski() {
        cube([head_size[0]-2, head_size[1]-2, head_size[2]-2], center=true);
        sphere(r=1);
    }
    // Visor (flatter, front-facing)
    translate([0, -head_size[1]/2, 0]) {
        cube([head_size[0]*0.8, head_size[1]*0.2, head_size[2]*0.8], center=true);
        // Visor slit (detail)
        translate([0, 0, head_size[2]/2]) cube([head_size[0]*0.6, head_size[1]*0.1, 1], center=true);
    }
    // Antenna (two vertical prongs)
    translate([head_size[0]/2, 0, head_size[2]/2]) {
        cube([1, 1, 4], center=true);
        translate([0, 0, 4]) cube([1, 1, 1], center=true);
    }
    translate([-head_size[0]/2, 0, head_size[2]/2]) {
        cube([1, 1, 4], center=true);
        translate([0, 0, 4]) cube([1, 1, 1], center=true);
    }
}

// Torso Module: Rounded cube with central cylinder and joints
module torso() {
    // Rounded torso base
    minkowski() {
        cube([torso_width-2, torso_depth-2, torso_height-2], center=true);
        sphere(r=1);
    }
    // Central cylindrical core (mechanical detail)
    translate([0, 0, 0]) cylinder(h=torso_height, r=5, center=true);
    // Shoulder joints (spheres for arm attachment)
    translate([torso_width/2, 0, torso_height/2]) sphere(r=joint_radius);
    translate([-torso_width/2, 0, torso_height/2]) sphere(r=joint_radius);
    // Hip joints (spheres for leg attachment)
    translate([0, torso_depth/2, -torso_height/2]) sphere(r=joint_radius);
    translate([0, -torso_depth/2, -torso_height/2]) sphere(r=joint_radius);
    // Torso side details (boxes)
    translate([torso_width/2, 0, 0]) cube([3, 5, 3], center=true);
    translate([-torso_width/2, 0, 0]) cube([3, 5, 3], center=true);
    // Torso top detail (small box)
    translate([0, 0, torso_height/2]) cube([5, 5, 2], center=true);
}

// Arm Module: Upper arm, forearm, claw with pistons/joints
module arm() {
    // Shoulder joint (sphere)
    translate([torso_width/2, 0, torso_height/2]) {
        sphere(r=joint_radius);
        // Upper arm segment
        translate([arm_length/4, 0, 0]) {
            cube([arm_length/2, 3, 3], center=true);
            // Mechanical cylinder (detail)
            translate([arm_length/4, 0, 0]) cylinder(h=5, r=2, center=true);
            // Piston (cylinder)
            translate([arm_length/4, 0, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
        }
        // Forearm segment (attached to upper arm)
        translate([arm_length/2, 0, 0]) {
            sphere(r=joint_radius);
            translate([arm_length/4, 0, 0]) {
                cube([arm_length/2, 2, 2], center=true);
                // Piston (cylinder)
                translate([arm_length/4, 0, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
            }
            // Claw (two prongs + connecting bar)
            translate([arm_length/2, 0, 0]) {
                cube([2, 1, 1], center=true);
                translate([0, 1, 0]) cube([2, 1, 1], center=true);
                // Connecting bar
                translate([0, 0.5, 0]) cube([1, 1, 1], center=true);
                // Piston (cylinder)
                translate([0, 0, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
            }
        }
    }
}

// Leg Module: Upper leg, knee, lower leg, foot with details
module leg() {
    // Hip joint (sphere)
    translate([0, torso_depth/2, -torso_height/2]) {
        sphere(r=joint_radius);
        // Upper leg segment
        translate([0, leg_length/4, 0]) {
            cube([3, leg_length/2, 3], center=true);
            // Mechanical cylinder (detail)
            translate([0, leg_length/4, 0]) cylinder(h=5, r=2, center=true);
            // Piston (cylinder)
            translate([0, leg_length/4, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
        }
        // Knee joint (sphere)
        translate([0, leg_length/2, 0]) {
            sphere(r=joint_radius);
            // Lower leg segment
            translate([0, leg_length/4, 0]) {
                cube([2, leg_length/2, 2], center=true);
                // Mechanical cylinder (detail)
                translate([0, leg_length/4, 0]) cylinder(h=5, r=2, center=true);
                // Piston (cylinder)
                translate([0, leg_length/4, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
            }
            // Foot segment
            translate([0, leg_length/2, 0]) {
                cube(foot_size, center=true);
                // Foot claws (side prongs)
                translate([foot_size[0]/2, 0, 0]) cube([2, foot_size[1], 1], center=true);
                translate([-foot_size[0]/2, 0, 0]) cube([2, foot_size[1], 1], center=true);
                // Foot piston (cylinder)
                translate([0, foot_size[1]/2, 0]) cylinder(h=piston_length, r=piston_radius, center=true);
                // Foot top detail (small cube + cylinder)
                translate([0, 0, foot_size[2]/2]) cube([3, 3, 1], center=true);
                translate([0, 0, foot_size[2]/2]) cylinder(h=3, r=1, center=true);
            }
        }
    }
}

// ------------------------------
// Main Robot Assembly
// ------------------------------
module robot() {
    // Torso (centered)
    torso();
    // Head (above torso)
    translate([0, 0, torso_height/2 + head_size[2]/2]) head();
    // Right arm (right side of torso)
    arm();
    // Left arm (mirrored on x-axis)
    mirror([1, 0, 0]) arm();
    // Right leg (front side of torso)
    leg();
    // Left leg (mirrored on y-axis)
    mirror([0, 1, 0]) leg();
}

// Render the robot
robot();