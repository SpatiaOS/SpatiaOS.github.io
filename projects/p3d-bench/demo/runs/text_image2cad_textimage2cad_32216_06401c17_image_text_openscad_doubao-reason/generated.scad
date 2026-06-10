// Global Configuration
$fn = 64;
fit_tolerance = 0.05;

// ------------------------------
// Core Dimension Parameters
// ------------------------------
// Central End Fitting
end_fit_lower_r = 13.5;
end_fit_lower_h = 12;
end_fit_upper_r = 9.39;
end_fit_upper_h = 15;
end_fit_cone_h = 10;
end_fit_eye_thickness = 6;
end_fit_eye_hole_d = 5;

// Lower Mounting Lugs (8x)
lug_lower_th = 1.47;
lug_lower_hole_d = 2.8;
lug_lower_w = 7.5;
lug_lower_h = 8.5;

// Upper D-shaped Lug Tabs (4x)
lug_tab_th = 1.47;
lug_tab_hole_d = 1.28;
lug_tab_r = 2.85;
lug_tab_l = 9;

// Upper Mounting Lugs (4x)
lug_upper_th = 1.47;
lug_upper_hole_d = 2.48;
lug_upper_r = 2.85;
lug_upper_l = 9;

// Jaw Components
jaw_length = 73.6;
jaw_thickness = 8;
jaw_width = 12;
jaw_hole_d = 3.6;
jaw_curve_angle = 15;

// Cylindrical Barrels
barrel_length = 28;
barrel_outer_r = 3.38;
barrel_wall = 0.7;
barrel_inner_r = barrel_outer_r - barrel_wall;

// Follower Rods
rod_total_l = 22.3;
rod_head_r = 2.53;
rod_shaft_r = 0.54;
rod_boss_hole_d = 1.2;

// Fasteners
stepped_pin_shank_r = 1.35;
stepped_pin_head_r = 1.8;
stepped_pin_total_l = 8.4;

flanged_pin_shaft_r = 0.6;
flanged_pin_head_r = 1.8;
flanged_pin_total_l = 8.4;

spool_pin_shaft_r = 0.6;
spool_pin_large_flange_r = 1.8;
spool_pin_total_l = 5.46;

plain_pin_d = 1.08;
plain_pin_l = 1.08;

// ------------------------------
// Module Definitions
// ------------------------------
module end_fitting() {
    union() {
        // Main bell shape
        translate([0, 0, end_fit_lower_h/2])
        cylinder(h=end_fit_lower_h, r=end_fit_lower_r, center=true);
        
        translate([0, 0, end_fit_lower_h + end_fit_cone_h/2])
        cylinder(h=end_fit_cone_h, r1=end_fit_lower_r, r2=end_fit_upper_r, center=true);
        
        translate([0, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h/2])
        cylinder(h=end_fit_upper_h, r=end_fit_upper_r, center=true);
        
        // Top eye lug
        translate([0, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h]) {
            rotate([90, 0, 0])
            linear_extrude(height=end_fit_eye_thickness, center=true) {
                hull() {
                    square([end_fit_upper_r*2, 10], center=true);
                    translate([0, 5]) circle(r=end_fit_upper_r);
                }
            }
            cylinder(h=end_fit_eye_thickness + 1, d=end_fit_eye_hole_d, center=true);
        }
        
        // 8 Lower mounting lugs
        for (i = [0:7]) {
            rotate(i*45, [0, 1, 0])
            translate([end_fit_lower_r + lug_lower_th/2, 0, end_fit_lower_h/2])
            rotate([0, 90, 0])
            linear_extrude(height=lug_lower_th, center=true) {
                difference() {
                    hull() {
                        square([lug_lower_w, lug_lower_h], center=true);
                        translate([lug_lower_w/2, 0]) square([2, 12], center=true);
                    }
                    translate([lug_lower_w/4, 0]) circle(d=lug_lower_hole_d);
                }
            }
        }
        
        // 4 Upper D-shaped tabs + 4 upper mounting lugs (alternating)
        for (i = [0:3]) {
            // D-shaped lug tab
            rotate(i*90, [0, 1, 0])
            translate([end_fit_upper_r + lug_tab_th/2, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h*0.75])
            rotate([0, 90, 0])
            linear_extrude(height=lug_tab_th, center=true) {
                difference() {
                    hull() {
                        square([lug_tab_l, lug_tab_r*2], center=true);
                        translate([lug_tab_l/2, 0]) circle(r=lug_tab_r);
                    }
                    translate([lug_tab_l/2 - lug_tab_r/2, 0]) circle(d=lug_tab_hole_d);
                }
            }
            
            // Upper mounting lug
            rotate(i*90 + 45, [0, 1, 0])
            translate([end_fit_upper_r + lug_upper_th/2, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h*0.25])
            rotate([0, 90, 0])
            linear_extrude(height=lug_upper_th, center=true) {
                difference() {
                    hull() {
                        square([lug_upper_l, lug_upper_r*2], center=true);
                        translate([lug_upper_l/2, 0]) circle(r=lug_upper_r);
                    }
                    translate([lug_upper_l/2 - lug_upper_r/2, 0]) circle(d=lug_upper_hole_d);
                }
            }
        }
    }
}

module gripper_jaw(is_tine = false) {
    union() {
        linear_extrude(height=jaw_thickness, center=true) {
            difference() {
                // Curved main profile
                hull() {
                    translate([0, 0]) circle(r=jaw_width/2);
                    translate([jaw_length*cos(jaw_curve_angle*pi/180), -jaw_length*sin(jaw_curve_angle*pi/180)]) 
                    circle(r= is_tine ? 2 : jaw_width/3);
                }
                // Stiffening rib cutouts
                for (step = [10:15:jaw_length-10]) {
                    translate([step*cos(jaw_curve_angle*pi/180), -step*sin(jaw_curve_angle*pi/180)])
                    square([3, jaw_width-4], center=true);
                }
            }
        }
        // Pivot hole at top
        rotate([0, 90, 0])
        cylinder(h=jaw_thickness + 1, d=jaw_hole_d, center=true);
        // Mid-body connection hole
        translate([jaw_length*0.4*cos(jaw_curve_angle*pi/180), -jaw_length*0.4*sin(jaw_curve_angle*pi/180), 0])
        rotate([90, 0, 0])
        cylinder(h=jaw_thickness + 1, d=jaw_hole_d, center=true);
    }
}

module cylindrical_barrel() {
    difference() {
        union() {
            cylinder(h=barrel_length - barrel_outer_r, r=barrel_outer_r, center=false);
            translate([0, 0, barrel_length - barrel_outer_r]) sphere(r=barrel_outer_r);
        }
        cylinder(h=barrel_length + 1, r=barrel_inner_r, center=false);
    }
}

module follower_rod() {
    union() {
        // Mushroom head
        cylinder(h=2, r=rod_head_r, center=true);
        // Main shaft
        translate([0,0,1 + rod_total_l/2])
        cylinder(h=rod_total_l, r=rod_shaft_r, center=true);
        // End boss
        translate([0,0,rod_total_l + 2])
        rotate([90,0,0])
        cylinder(h=6, r=1.5, center=true);
        // Boss through hole
        translate([0,0,rod_total_l + 2])
        cylinder(h=7, d=rod_boss_hole_d, center=true);
    }
}

module stepped_pin() {
    union() {
        cylinder(h=0.8, r=stepped_pin_head_r, center=false);
        translate([0,0,0.8]) cylinder(h=0.4, r=1.55, center=false);
        translate([0,0,1.2]) cylinder(h=stepped_pin_total_l - 1.2, r=stepped_pin_shank_r, center=false);
    }
}

module flanged_pin() {
    union() {
        cylinder(h=0.4, r=flanged_pin_head_r, center=false);
        translate([0,0,0.4]) cylinder(h=flanged_pin_total_l - 0.8, r=flanged_pin_shaft_r, center=false);
        translate([0,0,flanged_pin_total_l - 0.4]) cylinder(h=0.4, r=0.95, center=false);
    }
}

module spool_pin() {
    union() {
        cylinder(h=0.6, r=spool_pin_large_flange_r, center=false);
        translate([0,0,0.6]) cylinder(h=spool_pin_total_l - 1.2, r=spool_pin_shaft_r, center=false);
        translate([0,0,spool_pin_total_l - 0.6]) cylinder(h=0.6, r=0.95, center=false);
    }
}

module plain_pin() {
    cylinder(h=plain_pin_l, d=plain_pin_d, center=true);
}

// ------------------------------
// Main Assembly
// ------------------------------
union() {
    end_fitting();
    
    // 4-fold rotational symmetry assembly
    for (i = [0:3]) {
        rotate(i*90, [0, 1, 0]) {
            // Jaw assembly (alternate between tine and jaw)
            translate([end_fit_lower_r + 15, 0, end_fit_lower_h + end_fit_cone_h - 10])
            rotate([0, 0, -45])
            gripper_jaw(is_tine = i%2 == 0);
            
            // Cylindrical actuation barrel
            translate([end_fit_upper_r + lug_upper_th, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h*0.25])
            rotate([0, -30, 0])
            cylindrical_barrel();
            
            // Follower linkage rod
            translate([end_fit_lower_r + lug_lower_th, 0, end_fit_lower_h/2])
            rotate([0, -60, 0])
            follower_rod();
            
            // Fasteners
            // Jaw pivot pin
            translate([end_fit_upper_r + lug_upper_th + barrel_length*cos(30*pi/180), 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h*0.25 - barrel_length*sin(30*pi/180)])
            rotate([0,90,0])
            stepped_pin();
            
            // Barrel upper mount pin
            translate([end_fit_upper_r + lug_upper_th, 0, end_fit_lower_h + end_fit_cone_h + end_fit_upper_h*0.25])
            rotate([0,90,0])
            flanged_pin();
            
            // Rod lower mount pin
            translate([end_fit_lower_r + lug_lower_th, 0, end_fit_lower_h/2])
            rotate([0,90,0])
            spool_pin();
            
            // Rod to jaw connection pin
            translate([end_fit_lower_r + lug_lower_th + rod_total_l*cos(60*pi/180), 0, end_fit_lower_h/2 - rod_total_l*sin(60*pi/180)])
            rotate([90,0,0])
            plain_pin();
        }
    }
}