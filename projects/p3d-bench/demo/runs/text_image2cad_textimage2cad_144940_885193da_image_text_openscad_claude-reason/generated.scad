// Parameters
$fn = 100;

// Flat bar dimensions
bar_length = 600;
bar_width = 50;
bar_thickness = 10;

// Pin dimensions
pin_30_dia = 30;
pin_30_length_short = 90;
pin_30_length_long = 100;

pin_40_dia = 40;
pin_40_length = 100;

// Triangular bracket dimensions
bracket_width = 400;
bracket_height = 380;
bracket_thickness = 80;
bracket_boss_dia = 60;
bracket_boss_height = 50;
bracket_hole_40_dia = 40;
bracket_hole_40_depth = 100;
bracket_hole_30_dia = 30;
bracket_hole_30_depth = 17.3;
bracket_arm_width = 60;

// Link arm dimensions
link_arm_width = 60;
link_arm_outer_radius = 190;
link_arm_inner_radius = 130;
link_arm_boss_dia = 60;
link_arm_boss_height = 50;
link_arm_hole_dia = 40;
link_arm_hole_depth = 100;
link_arm_socket_dia = 50;
link_arm_socket_depth = 15;

// Pulley dimensions
pulley_outer_dia = 230;
pulley_thickness = 61;
pulley_hub_dia = 140;
pulley_hub_height = 30;
pulley_bolt_circle_dia = 100;
pulley_bolt_hole_dia = 14;
pulley_notch_count = 30;
pulley_notch_dia = 8;

// Assembly positioning
bracket_z = 150;
link_arm_x = -100;
link_arm_y = 100;
link_arm_z = 250;
pulley_x = -150;
pulley_y = -50;
pulley_z = 200;

// Flat bar (grounded at top)
translate([0, 0, 450])
color("lightgray")
cube([bar_length, bar_width, bar_thickness], center=true);

// Triangular linkage bracket
translate([0, 0, bracket_z])
color("silver")
triangular_bracket();

// U-shaped link arm
translate([link_arm_x, link_arm_y, link_arm_z])
rotate([0, 30, 45])
color("gray")
link_arm();

// Pulley disc
translate([pulley_x, pulley_y, pulley_z])
rotate([90, 0, 0])
color("darkgray")
pulley_disc();

// Pins - 30mm x 90mm (×2)
translate([-150, -100, 200])
rotate([0, 90, 0])
color("steelblue")
cylinder(d=pin_30_dia, h=pin_30_length_short, center=true);

translate([150, 100, 200])
rotate([0, 90, 0])
color("steelblue")
cylinder(d=pin_30_dia, h=pin_30_length_short, center=true);

// Pin - 30mm x 100mm (×1)
translate([-180, -150, 100])
rotate([0, 90, 0])
color("steelblue")
cylinder(d=pin_30_dia, h=pin_30_length_long, center=true);

// Pins - 40mm (×4, inferred geometry)
translate([100, 150, 300])
rotate([0, 90, 0])
color("dimgray")
cylinder(d=pin_40_dia, h=pin_40_length, center=true);

translate([-100, 150, 300])
rotate([0, 90, 0])
color("dimgray")
cylinder(d=pin_40_dia, h=pin_40_length, center=true);

translate([120, -120, 250])
rotate([0, 90, 0])
color("dimgray")
cylinder(d=pin_40_dia, h=pin_40_length, center=true);

translate([-120, -120, 250])
rotate([0, 90, 0])
color("dimgray")
cylinder(d=pin_40_dia, h=pin_40_length, center=true);

// Modules

module triangular_bracket() {
    difference() {
        union() {
            // Main triangular body with three arms
            hull() {
                // Upper left vertex with boss
                translate([-bracket_width/2 + 50, 0, bracket_height/2 - 50])
                cylinder(d=bracket_boss_dia, h=bracket_thickness, center=true);
                
                // Upper right vertex with boss
                translate([bracket_width/2 - 50, 0, bracket_height/2 - 50])
                cylinder(d=bracket_boss_dia, h=bracket_thickness, center=true);
                
                // Lower vertex with clevis
                translate([0, 0, -bracket_height/2 + 50])
                cylinder(d=bracket_arm_width, h=bracket_thickness, center=true);
            }
            
            // Bosses for 40mm holes
            translate([-bracket_width/2 + 50, 0, bracket_height/2 - 50])
            cylinder(d=bracket_boss_dia, h=bracket_boss_height, center=true);
            
            translate([bracket_width/2 - 50, 0, bracket_height/2 - 50])
            cylinder(d=bracket_boss_dia, h=bracket_boss_height, center=true);
        }
        
        // Central cutout
        translate([0, 0, 0])
        scale([0.5, 1, 0.6])
        cylinder(d=200, h=bracket_thickness+10, center=true);
        
        // 40mm through-holes at upper vertices
        translate([-bracket_width/2 + 50, 0, bracket_height/2 - 50])
        rotate([90, 0, 0])
        cylinder(d=bracket_hole_40_dia, h=bracket_hole_40_depth, center=true);
        
        translate([bracket_width/2 - 50, 0, bracket_height/2 - 50])
        rotate([90, 0, 0])
        cylinder(d=bracket_hole_40_dia, h=bracket_hole_40_depth, center=true);
        
        // 30mm through-hole at lower vertex
        translate([0, 0, -bracket_height/2 + 50])
        rotate([90, 0, 0])
        cylinder(d=bracket_hole_30_dia, h=bracket_hole_30_depth, center=true);
    }
}

module link_arm() {
    difference() {
        union() {
            // U-shaped swept body
            rotate_extrude(angle=180)
            translate([link_arm_outer_radius, 0, 0])
            circle(d=link_arm_width);
            
            // Left boss
            translate([-link_arm_outer_radius, 0, 0])
            rotate([0, 90, 0])
            cylinder(d=link_arm_boss_dia, h=link_arm_boss_height, center=true);
            
            // Right boss
            translate([link_arm_outer_radius, 0, 0])
            rotate([0, 90, 0])
            cylinder(d=link_arm_boss_dia, h=link_arm_boss_height, center=true);
        }
        
        // 40mm through-holes in bosses
        translate([-link_arm_outer_radius, 0, 0])
        rotate([0, 90, 0])
        cylinder(d=link_arm_hole_dia, h=link_arm_hole_depth, center=true);
        
        translate([link_arm_outer_radius, 0, 0])
        rotate([0, 90, 0])
        cylinder(d=link_arm_hole_dia, h=link_arm_hole_depth, center=true);
        
        // 50mm blind socket on lateral face
        translate([0, link_arm_boss_dia/2, 0])
        rotate([90, 0, 0])
        cylinder(d=link_arm_socket_dia, h=link_arm_socket_depth);
    }
}

module pulley_disc() {
    difference() {
        union() {
            // Main disc body
            cylinder(d=pulley_outer_dia, h=pulley_thickness, center=true);
            
            // Central hub
            cylinder(d=pulley_hub_dia, h=pulley_thickness + pulley_hub_height, center=true);
        }
        
        // Five bolt-circle through-holes
        for (i = [0:4]) {
            rotate([0, 0, i * 72])
            translate([pulley_bolt_circle_dia/2, 0, 0])
            cylinder(d=pulley_bolt_hole_dia, h=pulley_thickness + pulley_hub_height + 10, center=true);
        }
        
        // Periodic notches around rim
        for (i = [0:pulley_notch_count-1]) {
            rotate([0, 0, i * 360/pulley_notch_count])
            translate([pulley_outer_dia/2 - 5, 0, 0])
            cylinder(d=pulley_notch_dia, h=pulley_thickness + 10, center=true);
        }
    }
}