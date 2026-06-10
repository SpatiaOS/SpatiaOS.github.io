// ==========================================
// PARAMETERS
// ==========================================
$fn = 60; // Resolution for curved surfaces

// Central Hub Dimensions
hub_lower_r = 13.5;
hub_lower_h = 12;
hub_cone_h = 15;
hub_upper_r = 9.39;
hub_upper_h = 10;
eye_lug_r = 6.5;
eye_lug_hole = 2.5;

// Pivot Locations
jaw_pivot_r = 21.5;
jaw_pivot_z = 6;
upper_pivot_r = 15.39;
upper_pivot_z = 32;

// Kinematic Linkage
// Jaw mid-body pivot relative to main jaw pivot
rod_pivot_x = 6;
rod_pivot_z = -10;
// Distance and angle calculated to connect upper lug to jaw mid-body
rod_length = 38.0;
actuator_angle = 18.6; 

// ==========================================
// MODULES
// ==========================================

// Central ground body
module central_hub() {
    // Lower cylinder
    cylinder(r=hub_lower_r, h=hub_lower_h);
    
    // Conical transition
    translate([0, 0, hub_lower_h]) 
        cylinder(r1=hub_lower_r, r2=hub_upper_r, h=hub_cone_h);
    
    // Upper cylinder
    translate([0, 0, hub_lower_h + hub_cone_h]) 
        cylinder(r=hub_upper_r, h=hub_upper_h);
    
    // Eye lug at the crown
    translate([0, 0, hub_lower_h + hub_cone_h + hub_upper_h]) {
        difference() {
            hull() {
                translate([0, 0, 0]) cube([10, 4, 0.1], center=true);
                translate([0, 0, 4]) rotate([90, 0, 0]) cylinder(r=eye_lug_r, h=4, center=true);
            }
            // 5mm through-bore
            translate([0, 0, 4]) rotate([90, 0, 0]) cylinder(r=eye_lug_hole, h=6, center=true);
        }
    }
}

// Mounting lug for the lower section (jaw pivot)
module lower_lug() {
    difference() {
        hull() {
            translate([-2, -0.735, 0]) cube([2, 1.47, 10]);
            translate([8, 0, 5]) rotate([90, 0, 0]) cylinder(r=5, h=1.47, center=true);
        }
        // 2.8mm retention hole
        translate([8, 0, 5]) rotate([90, 0, 0]) cylinder(r=1.4, h=3, center=true);
    }
}

// Mounting lug for the upper section (barrel pivot)
module upper_lug() {
    difference() {
        hull() {
            translate([-2, -0.735, 0]) cube([2, 1.47, 8]);
            translate([6, 0, 4]) rotate([90, 0, 0]) cylinder(r=4, h=1.47, center=true);
        }
        // 2.48mm hole
        translate([6, 0, 4]) rotate([90, 0, 0]) cylinder(r=1.24, h=3, center=true);
    }
}

// 2D profile of the curved jaw
module jaw_profile() {
    difference() {
        union() {
            hull() {
                circle(r=4.5);
                translate([rod_pivot_x, rod_pivot_z]) circle(r=4.5);
            }
            hull() {
                translate([rod_pivot_x, rod_pivot_z]) circle(r=4.5);
                translate([12, -25]) circle(r=4.5);
            }
            hull() {
                translate([12, -25]) circle(r=4.5);
                translate([8, -50]) circle(r=3.5);
            }
            hull() {
                translate([8, -50]) circle(r=3.5);
                translate([-2, -72]) circle(r=2);
            }
        }
        // Mid body hole for follower rod
        translate([rod_pivot_x, rod_pivot_z]) circle(r=1.8);
        // Main pivot hole
        circle(r=1.4);
    }
}

// 3D Jaw arm with stiffening ribs
module jaw() {
    // Center web with cutout to allow rod boss clearance
    difference() {
        rotate([90, 0, 0]) linear_extrude(height=1.5, center=true) jaw_profile();
        translate([rod_pivot_x, 0, rod_pivot_z]) rotate([90, 0, 0]) cylinder(r=4.5, h=2, center=true);
    }
    
    // Outer flanges (longitudinal ribs)
    rotate([90, 0, 0]) translate([0, 0, -2.8]) linear_extrude(height=0.8) jaw_profile();
    rotate([90, 0, 0]) translate([0, 0, 2.0]) linear_extrude(height=0.8) jaw_profile();
    
    // Main pivot boss
    rotate([90, 0, 0]) cylinder(r=4.5, h=5.6, center=true);
}

// Hollow barrel and sliding follower rod assembly
module barrel_and_rod() {
    // Hollow Barrel
    color("darkgray")
    difference() {
        union() {
            sphere(r=3.38);
            rotate([180, 0, 0]) cylinder(r=3.38, h=28);
            // Upper pivot boss
            rotate([90, 0, 0]) cylinder(r=3.38, h=4.8, center=true);
        }
        // Hollow bore
        rotate([180, 0, 0]) translate([0, 0, -0.1]) cylinder(r=2.6, h=28.2);
    }
    
    // Follower Rod
    color("silver")
    translate([0, 0, -rod_length]) {
        // Transverse boss
        rotate([90, 0, 0]) cylinder(r=2.5, h=3.8, center=true);
        // Stem
        cylinder(r=0.6, h=17);
        // Mushroom head cap
        translate([0, 0, 17]) cylinder(r=2.53, h=1);
    }
}

// Stepped pin fastener
module stepped_pin() {
    cylinder(r=1.8, h=0.8, center=true);
    translate([0, 0, -4]) cylinder(r=1.35, h=8);
}

// Spool pin fastener
module spool_pin() {
    cylinder(r=0.6, h=5.46, center=true);
    translate([0, 0, 2.5]) cylinder(r=1.8, h=0.4);
    translate([0, 0, -2.9]) cylinder(r=0.95, h=0.4);
}

// ==========================================
// MAIN ASSEMBLY
// ==========================================

union() {
    // Grounded Central Hub
    color("silver") central_hub();
    
    // 4-fold rotationally symmetric mechanism
    for(i = [0 : 90 : 270]) {
        rotate([0, 0, i]) {
            
            // Mounting Lugs
            color("gray") {
                // Lower pair
                translate([hub_lower_r, 4, 1]) lower_lug();
                translate([hub_lower_r, -4, 1]) lower_lug();
                
                // Upper pair
                translate([hub_upper_r, 3.5, 28]) upper_lug();
                translate([hub_upper_r, -3.5, 28]) upper_lug();
            }
            
            // Curved Jaw Arm
            color("dimgray")
            translate([jaw_pivot_r, 0, jaw_pivot_z]) {
                jaw();
                // Pivot stepped pin
                rotate([90, 0, 0]) translate([0, 0, 3.2]) stepped_pin();
            }
            
            // Actuator Linkage (Barrel and Rod)
            translate([upper_pivot_r, 0, upper_pivot_z]) {
                rotate([0, actuator_angle, 0]) {
                    barrel_and_rod();
                }
                // Upper pivot pin
                color("silver") rotate([90, 0, 0]) cylinder(r=1.2, h=7.5, center=true);
            }
            
            // Mid-jaw spool pin connecting rod to jaw
            color("silver")
            translate([jaw_pivot_r + rod_pivot_x, 0, jaw_pivot_z + rod_pivot_z]) {
                rotate([90, 0, 0]) spool_pin();
            }
            
        }
    }
}