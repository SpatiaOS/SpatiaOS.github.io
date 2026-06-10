// Mechanical Grapple Assembly
// 4-fold rotational symmetry, 49 total parts

$fn = 60;

// ============ CENTRAL HUB PARAMETERS ============
hub_lower_r = 13.5;
hub_lower_h = 12;
hub_upper_r = 9.39;
hub_upper_h = 10;
hub_cone_h = 8;
hub_total_h = hub_lower_h + hub_cone_h + hub_upper_h;
eye_width = 10.14;
eye_height = 6;
eye_bore_r = 2.5;

// ============ MOUNTING LUG PARAMETERS ============
lug_thickness = 1.47;
lug_lower_hole_r = 1.4;  // 2.8 mm diameter
lug_lower_outer_r = 13.5;
lug_upper_hole_r = 0.64;  // 1.28 mm diameter
lug_upper2_hole_r = 1.24;  // 2.48 mm diameter
lug_eye_r = 2.85;

// ============ JAW ARM PARAMETERS ============
jaw_length = 73.6;
jaw_pivot_hole_r = 1.8;  // 3.6 mm diameter
jaw_width = 17;
jaw_tip_width = 6;
jaw_thickness = 5;

// ============ BARREL PARAMETERS ============
barrel_length = 28;
barrel_outer_r = 3.38;
barrel_wall = 0.7;
barrel_inner_r = barrel_outer_r - barrel_wall;

// ============ PIN PARAMETERS ============
stepped_pin_shank_r = 1.35;
stepped_pin_head_r = 1.8;
stepped_pin_length = 8.4;
flanged_pin_shaft_r = 0.6;
flanged_pin_head_r = 1.8;
flanged_pin_length = 8.4;
spool_pin_length = 5.46;
cyl_pin_r = 0.54;
cyl_pin_length = 1.08;

// ============ FOLLOWER ROD PARAMETERS ============
follower_head_r = 2.53;
follower_stem_r = 0.54;
follower_stem_length = 16.6;
follower_boss_r = 1.2;
follower_hole_r = 0.6;
follower_total_length = 22.3;

// ============ SUPPORT ARM PARAMETERS ============
support_arm_length = 73.6;
support_arm_width = 8.5;
support_arm_thickness = 3;

// ============ ASSEMBLY PARAMETERS ============
num_jaws = 4;
jaw_spread_angle = 25;
jaw_down_angle = 15;

// ============ HELPER MODULES ============

// Smooth fillet blend
module fillet_blend(r, length) {
    rotate_extrude()
        translate([r, 0, 0])
            circle(r = r);
}

// Stepped pin (ae594702)
module stepped_pin() {
    union() {
        // Main shank
        cylinder(h = 7.2, r = stepped_pin_shank_r, center = false);
        // Shoulder
        translate([0, 0, 7.2])
            cylinder(h = 0.4, r = 1.55, center = false);
        // Head
        translate([0, 0, 7.6])
            cylinder(h = 0.4, r = stepped_pin_head_r, center = false);
    }
}

// Flanged pin (ae596e1c)
module flanged_pin() {
    union() {
        // Small flange
        cylinder(h = 0.41, r = 0.95, center = false);
        // Shaft
        translate([0, 0, 0.41])
            cylinder(h = flanged_pin_length - 0.82, r = flanged_pin_shaft_r, center = false);
        // Large head
        translate([0, 0, flanged_pin_length - 0.41])
            cylinder(h = 0.41, r = flanged_pin_head_r, center = false);
    }
}

// Spool pin (ae610f34)
module spool_pin() {
    union() {
        // Large flange
        cylinder(h = 0.5, r = 1.8, center = false);
        // Shaft
        translate([0, 0, 0.5])
            cylinder(h = 4.28, r = 0.6, center = false);
        // Small flange
        translate([0, 0, 4.78])
            cylinder(h = 0.5, r = 0.95, center = false);
    }
}

// Plain cylindrical pin (ae61d29a)
module cylindrical_pin() {
    cylinder(h = cyl_pin_length, r = cyl_pin_r, center = true);
}

// D-shaped lug tab (ae59bc4c)
module lug_tab() {
    difference() {
        hull() {
            cube([1.47, 5.7, 9.01], center = false);
            translate([1.47/2, 5.7, 0])
                cylinder(h = 9.01, r = 1.47/2, center = false);
        }
        // Through-hole
        translate([1.47/2, 5.7, -0.1])
            cylinder(h = 9.2, r = 0.64, center = false);
    }
}

// Upper mounting lug with 2.48mm hole (ae6184a4)
module mounting_lug_upper() {
    difference() {
        union() {
            // Rectangular end
            cube([1.47, 5.7, 9.0], center = false);
            // Rounded eye end
            translate([1.47/2, 5.7, 0])
                cylinder(h = 9.0, r = 2.85, center = false);
        }
        // Through-hole
        translate([1.47/2, 5.7, -0.1])
            cylinder(h = 9.2, r = lug_upper2_hole_r, center = false);
    }
}

// Lower mounting lug with 2.8mm hole (ae615d7e)
module mounting_lug_lower() {
    difference() {
        hull() {
            cube([1.47, 7.48, 8.48], center = false);
            translate([1.47/2, 7.48, 0])
                cylinder(h = 8.48, r = lug_lower_outer_r, center = false);
        }
        // Through-hole
        translate([1.47/2, 7.48, -0.1])
            cylinder(h = 8.7, r = lug_lower_hole_r, center = false);
    }
}

// Cylindrical barrel with dome (ae59e39a)
module cylindrical_barrel() {
    difference() {
        union() {
            // Main cylinder
            cylinder(h = barrel_length - 4, r = barrel_outer_r, center = false);
            // Domed end
            translate([0, 0, barrel_length - 4])
                scale([1, 1, 0.8])
                    sphere(r = barrel_outer_r);
        }
        // Inner bore
        translate([0, 0, -1])
            cylinder(h = barrel_length, r = barrel_inner_r, center = false);
        // Cross-pin holes
        translate([0, 0, barrel_length * 0.3])
            rotate([90, 0, 0])
                cylinder(h = barrel_outer_r * 2, r = 0.432, center = true);
        translate([0, 0, barrel_length * 0.6])
            rotate([90, 0, 0])
                cylinder(h = barrel_outer_r * 2, r = 0.432, center = true);
    }
}

// Follower rod (ae61f99c)
module follower_rod() {
    union() {
        // Mushroom head
        cylinder(h = 1.5, r = follower_head_r, center = false);
        // Stem
        translate([0, 0, 1.5])
            cylinder(h = follower_stem_length, r = follower_stem_r, center = false);
        // Transverse boss
        translate([0, 0, follower_stem_length + 1.5])
            rotate([90, 0, 0]) {
                cylinder(h = follower_boss_r * 2, r = follower_boss_r, center = true);
                // Through-hole
                cylinder(h = follower_boss_r * 3, r = follower_hole_r, center = true);
            }
    }
}

// Gripper tine (ae4cc3e8) - curved jaw with two orthogonal pin holes
module gripper_tine() {
    difference() {
        union() {
            // Main curved body approximation
            hull() {
                // Top pivot lug
                translate([0, 0, 0])
                    cylinder(h = jaw_thickness, r = jaw_width/2, center = true);
                // Mid section
                translate([0, -jaw_length * 0.4, -jaw_length * 0.15])
                    rotate([-jaw_down_angle, 0, 0])
                        cylinder(h = jaw_thickness, r = jaw_width/2.5, center = true);
                // Tip
                translate([0, -jaw_length * 0.85, -jaw_length * 0.35])
                    rotate([-jaw_down_angle * 1.5, 0, 0])
                        cylinder(h = jaw_thickness * 0.8, r = jaw_tip_width/2, center = true);
            }
            // Stiffening rib
            translate([0, -jaw_length * 0.3, 0])
                cube([1.5, jaw_length * 0.6, jaw_thickness * 1.2], center = true);
        }
        // Top pivot hole (Z-axis)
        cylinder(h = jaw_thickness + 2, r = jaw_pivot_hole_r, center = true);
        // Mid-body hole (X-axis)
        translate([0, -jaw_length * 0.4, -jaw_length * 0.12])
            rotate([0, 90, 0])
                cylinder(h = jaw_thickness + 2, r = jaw_pivot_hole_r, center = true);
    }
}

// Gripper jaw (ae7c8674) - mirrored variant
module gripper_jaw() {
    mirror([1, 0, 0])
        gripper_tine();
}

// Curved support arm (ae44d4ac)
module curved_support_arm() {
    union() {
        // Main arm body
        hull() {
            translate([0, 0, 0])
                cylinder(h = support_arm_thickness, r = support_arm_width/2, center = true);
            translate([0, -support_arm_length * 0.5, -support_arm_length * 0.1])
                cylinder(h = support_arm_thickness, r = support_arm_width/3, center = true);
            translate([0, -support_arm_length, -support_arm_length * 0.2])
                cylinder(h = support_arm_thickness * 0.8, r = 2, center = true);
        }
        // Locating tab at top
        translate([0, support_arm_width/2, 0])
            cube([support_arm_width * 0.6, 3, support_arm_thickness], center = true);
    }
}

// Curved arm with pin tip (ae6666ac)
module curved_arm() {
    union() {
        // Main curved body
        hull() {
            cylinder(h = support_arm_thickness, r = support_arm_width/2, center = true);
            translate([0, -support_arm_length * 0.7, -support_arm_length * 0.15])
                cylinder(h = support_arm_thickness, r = support_arm_width/3, center = true);
        }
        // Pin protrusion at tip
        translate([0, -support_arm_length * 0.85, -support_arm_length * 0.18])
            cylinder(h = 11, r = 1.0, center = false);
    }
}

// Central hub with eye lug (ae62e424)
module end_fitting_with_eye() {
    union() {
        // Lower cylinder
        cylinder(h = hub_lower_h, r = hub_lower_r, center = false);
        // Conical transition
        translate([0, 0, hub_lower_h])
            cylinder(h = hub_cone_h, r1 = hub_lower_r, r2 = hub_upper_r, center = false);
        // Upper cylinder
        translate([0, 0, hub_lower_h + hub_cone_h])
            cylinder(h = hub_upper_h, r = hub_upper_r, center = false);
        // Eye lug
        translate([0, 0, hub_total_h])
            difference() {
                hull() {
                    cylinder(h = eye_height, r = hub_upper_r * 0.55, center = false);
                    translate([0, hub_upper_r * 0.6, 0])
                        cylinder(h = eye_height, r = eye_width/2, center = false);
                }
                // Eye bore
                translate([0, hub_upper_r * 0.6, -0.1])
                    cylinder(h = eye_height + 0.2, r = eye_bore_r, center = false);
            }
    }
}

// ============ ASSEMBLY ============

module grapple_assembly() {
    union() {
        // Central hub - grounded
        color("Silver")
            end_fitting_with_eye();
        
        // Mounting lugs on lower cylinder (8 instances)
        for (i = [0:7]) {
            rotate([0, 0, i * 45])
                translate([hub_lower_r - 1.47/2, 0, hub_lower_h * 0.3])
                    rotate([0, 0, 90])
                        color("LightGray")
                            mounting_lug_lower();
        }
        
        // D-shaped lug tabs on upper cylinder (4 instances)
        for (i = [0:3]) {
            rotate([0, 0, i * 90 + 45])
                translate([hub_upper_r - 1.47/2, 0, hub_lower_h + hub_cone_h + hub_upper_h * 0.4])
                    rotate([0, 0, 90])
                        color("Gainsboro")
                            lug_tab();
        }
        
        // Upper mounting lugs (4 instances)
        for (i = [0:3]) {
            rotate([0, 0, i * 90])
                translate([hub_upper_r - 1.47/2, 0, hub_lower_h + hub_cone_h + hub_upper_h * 0.6])
                    rotate([0, 0, 90])
                        color("LightGray")
                            mounting_lug_upper();
        }
        
        // Jaw arms with 4-fold symmetry
        for (i = [0:3]) {
            rotate([0, 0, i * 90]) {
                // Jaw arm - alternating tine and jaw
                translate([0, -hub_lower_r - 5, hub_lower_h * 0.5])
                    rotate([jaw_down_angle, 0, 0]) {
                        if (i % 2 == 0) {
                            color("DimGray")
                                gripper_tine();
                        } else {
                            color("DimGray")
                                gripper_jaw();
                        }
                        
                        // Stepped pin at pivot
                        translate([0, 0, jaw_thickness/2 + 1])
                            color("Gold")
                                stepped_pin();
                    }
                
                // Curved support arms (between jaws)
                if (i < 2) {
                    translate([15 * (i == 0 ? 1 : -1), -hub_lower_r - 3, hub_lower_h * 0.7])
                        rotate([jaw_down_angle * 0.7, 0, i == 0 ? 5 : -5])
                            color("SlateGray")
                                curved_support_arm();
                }
                
                // Curved arms with pin tips
                if (i >= 2) {
                    translate([12 * (i == 2 ? 1 : -1), -hub_lower_r - 3, hub_lower_h * 0.6])
                        rotate([jaw_down_angle * 0.5, 0, i == 2 ? -3 : 3])
                            color("SlateGray")
                                curved_arm();
                }
                
                // Cylindrical barrels connecting hub to jaw
                translate([hub_upper_r * 0.7 * (i % 2 == 0 ? 1 : -1), 
                          -hub_lower_r + 2, 
                          hub_lower_h + hub_cone_h])
                    rotate([jaw_down_angle * 1.2, 0, (i % 2 == 0 ? -10 : 10)])
                        color("CadetBlue")
                            cylindrical_barrel();
                
                // Follower rods
                translate([hub_upper_r * 0.5 * (i % 2 == 0 ? -1 : 1), 
                          -hub_lower_r + 5, 
                          hub_lower_h + hub_cone_h + 3])
                    rotate([jaw_down_angle, 0, (i % 2 == 0 ? 5 : -5)])
                        color("LightSteelBlue")
                            follower_rod();
                
                // Flanged pins at barrel connections
                translate([hub_upper_r * 0.7 * (i % 2 == 0 ? 1 : -1), 
                          -hub_lower_r + 2, 
                          hub_lower_h + hub_cone_h + barrel_length * 0.5])
                    rotate([90, 0, 0])
                        color("Gold")
                            flanged_pin();
                
                // Spool pins at mid-jaw
                translate([0, -hub_lower_r - jaw_length * 0.35, hub_lower_h * 0.3])
                    rotate([0, 90, 0])
                        color("Brass")
                            spool_pin();
                
                // Cylindrical pins at secondary connections
                translate([10 * (i % 2 == 0 ? 1 : -1), -hub_lower_r - 8, hub_lower_h * 0.6])
                    color("Silver")
                        cylindrical_pin();
            }
        }
    }
}

// Render the complete assembly
grapple_assembly();