// Global Settings
$fn = 64; // Smooth curve resolution

// Core Parameter Definition
assembly_width = 600;
assembly_depth = 501;
assembly_height = 527;

// Flat Bar (Grounded Top Structural Member)
flat_bar_len = 600;
flat_bar_width = 50;
flat_bar_thick = 10;

// Pin Dimensions
pin_30_dia = 30;
pin_30_short_len = 90; // 2x grounded pivot pins
pin_30_long_len = 100; // 1x bracket lower vertex pin
pin_40_dia = 40;
pin_40_len = 100.6; // 4x coaxial through pins

// Triangular Linkage Bracket
tri_bracket_thick = 80;
tri_bracket_upper_hole_dia = 40;
tri_bracket_lower_hole_dia = 30;
tri_arm_radius = 30;

// U-shaped Link Arm
link_arm_thick = 60;
link_arm_boss_od = 60;
link_arm_bore_dia = 40;
link_arm_blind_hole_dia = 50;
link_arm_blind_hole_depth = 15;

// Pulley Disc
pulley_od = 230;
pulley_thick = 61;
pulley_hub_od = 140;
pulley_bolt_hole_dia = 14;
pulley_bolt_circle_dia = 100;
pulley_rim_notch_r = 4;
pulley_num_notches = 30;

// ------------------------------
// Module Definitions
// ------------------------------
module flat_bar() {
    cube([flat_bar_len, flat_bar_width, flat_bar_thick], center=true);
}

module pin_30(length) {
    cylinder(h=length, d=pin_30_dia, center=true);
}

module pin_40() {
    cylinder(h=pin_40_len, d=pin_40_dia, center=true);
}

module triangular_linkage_bracket() {
    difference() {
        // B-spline blended triangular arm structure
        hull() {
            // Three vertex bosses
            translate([180, 0, 0]) cylinder(h=tri_bracket_thick, d=link_arm_boss_od, center=true);
            translate([-90, 156, 0]) cylinder(h=tri_bracket_thick, d=link_arm_boss_od, center=true);
            translate([-90, -156, 0]) cylinder(h=tri_bracket_thick, d=link_arm_boss_od, center=true);
        }
        // Central open web cutout
        linear_extrude(height=tri_bracket_thick + 2, center=true)
        offset(r=-40) polygon(points=[[180,0], [-90,156], [-90,-156]]);
        
        // Bores at vertices
        translate([180, 0, 0]) cylinder(h=tri_bracket_thick + 2, d=tri_bracket_upper_hole_dia, center=true);
        translate([-90, 156, 0]) cylinder(h=tri_bracket_thick + 2, d=tri_bracket_upper_hole_dia, center=true);
        translate([-90, -156, 0]) cylinder(h=tri_bracket_thick + 2, d=tri_bracket_lower_hole_dia, center=true);
    }
}

module u_shaped_link_arm() {
    difference() {
        union() {
            // End boss cylinders
            translate([170, 0, 120]) cylinder(h=link_arm_thick, d=link_arm_boss_od, center=true);
            translate([-170, 0, 120]) cylinder(h=link_arm_thick, d=link_arm_boss_od, center=true);
            // Swept curved U body
            hull() for (ang = [90:15:270]) {
                x = cos(radians(ang)) * 170;
                z = sin(radians(ang)) * 120;
                translate([x, 0, z]) sphere(r=link_arm_thick/2);
            }
        }
        // Through bores
        translate([170, 0, 120]) cylinder(h=link_arm_thick + 2, d=link_arm_bore_dia, center=true);
        translate([-170, 0, 120]) cylinder(h=link_arm_thick + 2, d=link_arm_bore_dia, center=true);
        // Blind locating hole
        translate([0, link_arm_thick/2, 0]) cylinder(h=link_arm_blind_hole_depth, d=link_arm_blind_hole_dia, center=false);
    }
}

module pulley_disc() {
    difference() {
        union() {
            // Main disc body
            cylinder(h=pulley_thick, d=pulley_od, center=true);
            // Stepped hub
            translate([0, 0, pulley_thick/2 - 5]) cylinder(h=10, d=pulley_hub_od, center=true);
        }
        // Bolt circle holes
        for (ang = [0:72:288]) rotate(ang, [0,0,1]) translate([pulley_bolt_circle_dia/2,0,0]) cylinder(h=pulley_thick+2, d=pulley_bolt_hole_dia, center=true);
        // Rim notches
        for (ang = [0:360/pulley_num_notches:360-360/pulley_num_notches]) rotate(ang, [0,0,1]) translate([pulley_od/2,0,0]) cylinder(h=pulley_thick+2, r=pulley_rim_notch_r, center=true);
    }
}

// ------------------------------
// Main Assembly
// ------------------------------
union() {
    // Grounded top flat bar
    translate([0, 0, assembly_height/2 - flat_bar_thick/2])
    flat_bar();

    // 4x Coaxial 40mm pins aligned with X axis
    for (pos = [[150, 150, 200], [150, -150, 200], [150, 150, -50], [150, -150, -50]])
    translate(pos) rotate([0,90,0]) pin_40();

    // 2x Grounded 30mm short pivot pins
    translate([150, 150, -50]) rotate([0,90,0]) pin_30(pin_30_short_len);
    translate([150, -150, -50]) rotate([0,90,0]) pin_30(pin_30_short_len);

    // 1x 30mm long pin for lower bracket vertex
    translate([70, -250, -50]) rotate([0,90,0]) pin_30(pin_30_long_len);

    // Triangular linkage bracket
    translate([70, 0, -50]) rotate([0,90,0]) triangular_linkage_bracket();

    // U-shaped link arm
    translate([70, 0, 200]) rotate([0,90,0]) u_shaped_link_arm();

    // Mounted pulley disc
    translate([-100, -150, -50]) rotate([0,0,0]) pulley_disc();
}