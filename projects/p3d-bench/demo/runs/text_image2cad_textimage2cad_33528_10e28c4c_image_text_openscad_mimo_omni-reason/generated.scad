// DJ Console Assembly - OpenSCAD Model
// Based on rendered image and structured text description
// All dimensions in millimeters

// Global resolution
$fn = 50;

// ====================
// PARAMETERS
// ====================

// Overall assembly dimensions (approximate)
assembly_width = 309;
assembly_depth = 247;
assembly_height = 65;

// Housing cover (top panel)
cover_width = 300;
cover_depth = 230;
cover_height = 45;
cover_corner_fillet = 1.0;
cover_chamfer = 2.0;  // 45° chamfer along top perimeter

// Base plate
base_width = 309;
base_depth = 245;
base_height = 28;

// Jog wheel caps (2 instances)
cap_diameter = 86;
cap_height = 20;
cap_slot_count = 14;
cap_slot_width = 3;
cap_slot_length = 15;
cap_center_step_dia = 60.5;
cap_center_step_depth = 1;
cap_boss_diameter = 8;
cap_boss_height = 4;  // hemisphere

// Spacer blocks (26 instances) - tactile pads
spacer_length = 18.87;
spacer_width = 12.09;
spacer_height = 5.0;
spacer_fillet_radius = 2.0;

// Socket posts (8 instances)
socket_base_dia = 14.89;
socket_height = 17;
socket_hole_dia = 1.178;

// Pins (11 instances) - control stems
pin_diameter = 1.5;
pin_length = 11;

// Flanged bushings (6 instances) - front panel jacks
bushing_flange_dia = 18.2;
bushing_flange_thickness = 2;
bushing_boss_dia = 10.06;
bushing_boss_length = 5;
bushing_bore_dia = 4.92;
bushing_total_depth = 10;

// Wedge guide blocks (3 instances)
wedge_length = 18;
wedge_base_width = 14;
wedge_top_width = 8;
wedge_height = 14;
wedge_groove_width = 6;
wedge_groove_depth = 4;

// Structural bars (3 instances)
bar_length = 20;
bar_width = 2;
bar_height = 1.1;

// Locating pins (3 instances)
locating_pin_base_dia = 14.9;
locating_pin_height = 17;
locating_pin_head_dia = 12;
locating_pin_head_height = 5;
locating_pin_hole_dia = 1.178;

// Ball studs (2 instances)
ball_diameter = 18.2;
ball_collar_dia = 12;
ball_collar_length = 8;
ball_bore_dia = 4.92;

// ====================
// HELPER MODULES
// ====================

// Rounded rectangular block (spacer block)
module rounded_block(length, width, height, fillet_r) {
    minkowski() {
        cube([length - 2*fillet_r, width - 2*fillet_r, height/2], center=false);
        union() {
            cylinder(r=fillet_r, h=height/2);
            translate([0,0,height/2]) sphere(r=fillet_r);
        }
    }
}

// Bell-shaped socket post
module socket_post() {
    difference() {
        // Main body - cone approximation with cylinder and sphere
        union() {
            // Base flange
            cylinder(d=socket_base_dia, h=2);
            // Tapered body
            translate([0,0,2]) cylinder(d1=socket_base_dia, d2=5, h=socket_height-4);
            // Top cap
            translate([0,0,socket_height-2]) cylinder(d=5, h=2);
        }
        // Through-hole
        translate([0,0,-1]) cylinder(d=socket_hole_dia, h=socket_height+2);
    }
}

// Flanged bushing
module flanged_bushing() {
    difference() {
        union() {
            // Flange
            cylinder(d=bushing_flange_dia, h=bushing_flange_thickness);
            // Boss
            translate([0,0,bushing_flange_thickness]) 
                cylinder(d=bushing_boss_dia, h=bushing_boss_length);
        }
        // Central bore
        translate([0,0,-1]) cylinder(d=bushing_bore_dia, h=bushing_total_depth+2);
        // Countersink at entry
        translate([0,0,bushing_flange_thickness-1]) 
            cylinder(d1=bushing_bore_dia, d2=bushing_boss_dia, h=2);
    }
}

// Wedge guide block
module wedge_guide() {
    difference() {
        // Main wedge shape
        hull() {
            cube([wedge_length, wedge_base_width, 0.1]);
            translate([0, (wedge_base_width-wedge_top_width)/2, wedge_height])
                cube([wedge_length, wedge_top_width, 0.1]);
        }
        // Top groove
        translate([-1, wedge_base_width/2 - wedge_groove_width/2, wedge_height - wedge_groove_depth])
            cube([wedge_length+2, wedge_groove_width, wedge_groove_depth+1]);
    }
}

// Locating pin with domed head
module locating_pin() {
    union() {
        // Domed head
        sphere(d=locating_pin_head_dia);
        // Tapered shank
        translate([0,0,-locating_pin_height+locating_pin_head_height])
            cylinder(d1=locating_pin_head_dia*0.6, d2=4, h=locating_pin_height-locating_pin_head_height);
        // Cross-hole (visual representation)
        translate([0,0,-locating_pin_height+3])
            rotate([0,90,0]) cylinder(d=locating_pin_hole_dia, h=locating_pin_base_dia, center=true);
    }
}

// Ball stud
module ball_stud() {
    union() {
        // Spherical dome
        sphere(d=ball_diameter);
        // Cylindrical collar
        translate([0,0,-ball_collar_length])
            cylinder(d=ball_collar_dia, h=ball_collar_length);
        // Central bore
        translate([0,0,-ball_collar_length-1])
            cylinder(d=ball_bore_dia, h=ball_collar_length+2);
    }
}

// Jog wheel cap with slots and boss
module jog_wheel_cap() {
    difference() {
        union() {
            // Main disc
            cylinder(d=cap_diameter, h=cap_height);
            // Central raised step
            translate([0,0,cap_height-cap_center_step_depth])
                cylinder(d=cap_center_step_dia, h=cap_center_step_depth+1);
            // Hemispherical boss
            translate([cap_diameter/4, 0, cap_height])
                sphere(d=cap_boss_diameter);
        }
        // Peripheral slots
        for (i = [0:cap_slot_count-1]) {
            rotate([0,0, i * 360/cap_slot_count])
                translate([cap_diameter/2 - cap_slot_length/2, -cap_slot_width/2, -1])
                    cube([cap_slot_length, cap_slot_width, cap_height+2]);
        }
    }
}

// ====================
// MAIN ASSEMBLY
// ====================

module dj_console_assembly() {
    // Base plate (bottom)
    color("LightGrey", 0.9)
    translate([0, 0, 0])
        cube([base_width, base_depth, base_height]);
    
    // Housing cover (top panel) with cutouts
    color("SlateGray", 0.8)
    difference() {
        // Main cover body
        cube([cover_width, cover_depth, cover_height]);
        
        // Rectangular cutouts for spacer blocks (simplified pattern)
        for (i = [0:5], j = [0:3]) {
            translate([30 + i*45, 30 + j*45, cover_height-2])
                rounded_block(20, 14, 3, cover_corner_fillet);
        }
        
        // Circular recesses for jog wheels
        translate([70, cover_depth/2, cover_height-1])
            cylinder(d=cap_diameter+2, h=2);
        translate([cover_width-70, cover_depth/2, cover_height-1])
            cylinder(d=cap_diameter+2, h=2);
    }
    
    // Spacer blocks (tactile pads) - placed in cutouts
    color("DarkSlateGrey", 0.7)
    for (i = [0:5], j = [0:3]) {
        translate([30 + i*45, 30 + j*45, cover_height-2])
            rounded_block(spacer_length, spacer_width, spacer_height, spacer_fillet_radius);
    }
    
    // Jog wheel caps (2 instances)
    color("DimGrey", 0.85) {
        translate([70, cover_depth/2, cover_height])
            jog_wheel_cap();
        translate([cover_width-70, cover_depth/2, cover_height])
            jog_wheel_cap();
    }
    
    // Socket posts (8 instances) - arranged in pattern
    color("Silver", 0.8)
    for (i = [0:7]) {
        translate([100 + i*25, 50 + (i%2)*30, cover_height])
            socket_post();
    }
    
    // Control pins (11 instances)
    color("White", 0.9)
    for (i = [0:10]) {
        translate([80 + i*20, 100 + (i%3)*20, cover_height])
            cylinder(d=pin_diameter, h=pin_length);
    }
    
    // Flanged bushings (6 instances) - front panel
    color("Gainsboro", 0.85)
    for (i = [0:5]) {
        translate([base_width/2 - 60 + i*24, -2, base_height/2])
            rotate([90,0,0])
                flanged_bushing();
    }
    
    // Wedge guide blocks (3 instances) - central mixer region
    color("DarkGray", 0.75)
    for (i = [0:2]) {
        rotate([0,0, i*120])
            translate([cover_width/2, cover_depth/2, cover_height])
                wedge_guide();
    }
    
    // Structural bars (3 instances) - central region
    color("Gray", 0.8)
    for (i = [0:2]) {
        rotate([0,0, i*120])
            translate([cover_width/2-10, cover_depth/2, cover_height+5])
                cube([bar_length, bar_width, bar_height]);
    }
    
    // Locating pins (3 instances)
    color("WhiteSmoke", 0.9)
    for (i = [0:2]) {
        rotate([0,0, i*120 + 60])
            translate([cover_width/2+40, cover_depth/2, cover_height])
                locating_pin();
    }
    
    // Ball studs (2 instances)
    color("Silver", 0.85) {
        translate([50, cover_depth/2, cover_height])
            ball_stud();
        translate([cover_width-50, cover_depth/2, cover_height])
            ball_stud();
    }
}

// Render the complete assembly
dj_console_assembly();