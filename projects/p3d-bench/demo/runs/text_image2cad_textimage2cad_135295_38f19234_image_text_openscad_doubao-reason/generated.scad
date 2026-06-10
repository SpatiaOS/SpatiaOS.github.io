// Global resolution setting for smooth curves
$fn = 100;

// Overall assembly dimensions matching provided bounding box
total_length = 260.2;
total_width = 128.7;
total_height = 114.9;

// Head (sculptural_head_shell) parameters
head_length = 57.6;
head_width = 43.7;
head_height = 40.3;
nose_radius = 2.3;
nose_depth = 2.06;
ear_height = 15;
eye_indent_radius = 3;

// Torso & Limbs (figurine_body) parameters
torso_length = 117.5;
torso_width = 114.9;
torso_height = 110.9;
leg_radius = 10;
front_leg_length = 60;
back_leg_length = 85;

// Tail (ornamental_figurine) parameters
tail_base_radius = 8;
tail_tip_radius = 3;
tail_curve_points = [
    [-torso_length/2 + 5, 0, -5],
    [-torso_length/2 - 25, 0, 0],
    [-torso_length/2 - 55, 10, 10],
    [-torso_length/2 - 85, 20, 5],
    [-torso_length/2 - 115, 20, -5]
];

// Module: Stylized animal head with pointed ears, eye indents and cylindrical nose
module sculptural_head_shell() {
    difference() {
        union() {
            // Organic main head volume
            hull() {
                sphere(r = head_length / 2.2);
                translate([head_length/2 - 8, 0, 0]) scale([1.2, 0.7, 0.6]) sphere(r=16);
            }
            // Pointed triangular ears
            translate([-5, head_width/3, head_height/4]) rotate([0, -15, 0]) linear_extrude(height=ear_height) circle(r=6, $fn=3);
            translate([-5, -head_width/3, head_height/4]) rotate([0, 15, 0]) linear_extrude(height=ear_height) circle(r=6, $fn=3);
        }
        // Nose socket and eye indentations
        translate([head_length/2 - 1, 0, -1]) cylinder(h=nose_depth + 0.5, r=nose_radius + 0.2, center=false);
        translate([head_length/3, head_width/3.5, 0]) sphere(r=eye_indent_radius);
        translate([head_length/3, -head_width/3.5, 0]) sphere(r=eye_indent_radius);
    }
    // Raised cylindrical nose detail
    translate([head_length/2 - 1, 0, -1]) cylinder(h=nose_depth, r=nose_radius, center=false);
}

// Module: Organic torso + four limbs in leaping pose
module figurine_body() {
    union() {
        // Main curved torso shape
        hull() {
            translate([-10, 0, 0]) scale([1, 1, 0.9]) sphere(r=torso_width / 2.2);
            translate([-torso_length + 15, 0, -15]) scale([0.9, 0.9, 1]) sphere(r=torso_width / 2.5);
        }
        // Front legs
        translate([10, torso_width/3.5, -torso_height/4]) rotate([-35, 0, -25]) cylinder(h=front_leg_length, r1=leg_radius, r2=leg_radius*0.7);
        translate([10, -torso_width/3.5, -torso_height/4]) rotate([-35, 0, 25]) cylinder(h=front_leg_length, r1=leg_radius, r2=leg_radius*0.7);
        // Back legs
        translate([-50, torso_width/3, -torso_height/4 + 10]) rotate([15, 0, 45]) cylinder(h=back_leg_length, r1=leg_radius*1.1, r2=leg_radius*0.6);
        translate([-50, -torso_width/3, -torso_height/4 + 10]) rotate([15, 0, -45]) cylinder(h=back_leg_length, r1=leg_radius*1.1, r2=leg_radius*0.6);
        // Flattened paws
        translate([10 + front_leg_length*cos(-35), torso_width/3.5 + front_leg_length*sin(-25), -torso_height/4 + front_leg_length*sin(-35)]) scale([1, 1, 0.3]) sphere(r=leg_radius*0.8);
        translate([10 + front_leg_length*cos(-35), -torso_width/3.5 + front_leg_length*sin(25), -torso_height/4 + front_leg_length*sin(-35)]) scale([1, 1, 0.3]) sphere(r=leg_radius*0.8);
        translate([-50 + back_leg_length*cos(15), torso_width/3 + back_leg_length*sin(45), -torso_height/4 + 10 + back_leg_length*sin(15)]) scale([1, 1, 0.3]) sphere(r=leg_radius*0.7);
        translate([-50 + back_leg_length*cos(15), -torso_width/3 + back_leg_length*sin(-45), -torso_height/4 + 10 + back_leg_length*sin(15)]) scale([1, 1, 0.3]) sphere(r=leg_radius*0.7);
    }
}

// Module: Curved ornamental tail
module ornamental_figurine() {
    for (i = [0:len(tail_curve_points)-2]) {
        hull() {
            r1 = tail_base_radius - (i / (len(tail_curve_points)-1)) * (tail_base_radius - tail_tip_radius);
            r2 = tail_base_radius - ((i+1) / (len(tail_curve_points)-1)) * (tail_base_radius - tail_tip_radius);
            translate(tail_curve_points[i]) sphere(r=r1);
            translate(tail_curve_points[i+1]) sphere(r=r2);
        }
    }
}

// Main unified assembly aligned to specified diagonal axis
rotate([8, 0, -45])
union() {
    translate([torso_length/2 + 10, 0, 0]) sculptural_head_shell();
    figurine_body();
    ornamental_figurine();
}