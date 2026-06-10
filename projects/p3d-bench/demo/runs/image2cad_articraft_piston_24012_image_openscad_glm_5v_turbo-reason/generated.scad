// Piston and Connecting Rod Assembly
// Parametric OpenSCAD Model

// ============================================
// PARAMETERS (all dimensions in mm)
// ============================================

// Piston parameters
piston_diameter = 42;
piston_height = 38;
piston_top_dome_radius = 200;  // Slight dome on top surface
ring_groove_count = 3;
ring_groove_width = 2.5;
ring_groove_depth = 1.8;
ring_groove_spacing = 4;
wrist_pin_diameter = 12;
wrist_pin_boss_outer = 20;
wrist_pin_boss_depth = 8;

// Top valve relief/indentation
top_indentation_diameter = 14;
top_indentation_depth = 1.5;

// Connecting rod parameters
rod_length = 95;              // Center to center length
rod_small_end_width = 18;     // Width at piston end
rod_big_end_width = 28;       // Width at crank end
rod_thickness_center = 6;     // Thickness of web
rod_thickness_end = 10;       // Thickness at ends
rod_i_beam_cutout_ratio = 0.5; // How much of the width is cut out

// Big end bearing parameters
big_end_bore_diameter = 24;
big_end_outer_diameter = 36;
big_end_cap_thickness = 8;
bolt_diameter = 5;
bolt_head_diameter = 9;
bolt_head_height = 4;
nut_diameter = 9;
nut_height = 5;
bolt_spacing = 22;            // Distance between bolt centers

// Resolution
$fn = 80;

// ============================================
// MODULES
// ============================================

module piston() {
    difference() {
        // Main piston body
        union() {
            // Cylinder body
            cylinder(h=piston_height, d=piston_diameter);
            
            // Domed top (slight sphere intersection)
            translate([0, 0, piston_height])
                scale([1, 1, 0.15])
                    sphere(d=piston_diameter * 1.05);
            
            // Wrist pin boss
            translate([piston_diameter/2, 0, piston_height * 0.55])
                rotate([0, 90, 0])
                    cylinder(h=wrist_pin_boss_depth, d=wrist_pin_boss_outer);
        }
        
        // Ring grooves (cut from outside)
        for (i = [0 : ring_groove_count - 1]) {
            translate([0, 0, piston_height - 8 - i * ring_groove_spacing])
                difference() {
                    cylinder(h=ring_groove_width, d=piston_diameter + 1);
                    cylinder(h=ring_groove_width + 1, d=piston_diameter - 2*ring_groove_depth);
                }
        }
        
        // Wrist pin hole (through piston)
        translate([piston_diameter/2 + wrist_pin_boss_depth/2 - wrist_pin_boss_depth, 0, piston_height * 0.55])
            rotate([0, 90, 0])
                cylinder(h=piston_diameter/2 + wrist_pin_boss_depth + 1, d=wrist_pin_diameter);
        
        // Top indentation (valve relief)
        translate([0, 0, piston_height + 0.1])
            cylinder(h=top_indentation_depth + 1, d=top_indentation_diameter);
        
        // Internal hollowing (optional - makes it lighter looking)
        translate([0, 0, -1])
            cylinder(h=piston_height - ring_groove_count * ring_groove_spacing - 6, 
                     d=piston_diameter - 6);
    }
}

module connecting_rod() {
    // Calculate positions
    small_end_z = piston_height / 2;
    big_end_z = small_end_z - rod_length;
    
    union() {
        // Small end (piston pin end)
        translate([0, 0, small_end_z]) {
            difference() {
                // Small end eye
                rotate([90, 0, 0])
                    cylinder(h=rod_small_end_width, d=rod_small_end_width + 4, center=true);
                // Pin hole
                rotate([90, 0, 0])
                    cylinder(h=rod_small_end_width + 2, d=wrist_pin_diameter + 1, center=true);
            }
        }
        
        // Big end (crank end) - main body
        translate([0, 0, big_end_z]) {
            difference() {
                // Main big end shape (slightly wider than bore)
                rotate([90, 0, 0])
                    cylinder(h=rod_big_end_width, d=big_end_outer_diameter, center=true);
                // Crank bore
                rotate([90, 0, 0])
                    cylinder(h=rod_big_end_width + 2, d=big_end_bore_diameter, center=true);
                
                // Split line cut (horizontal)
                translate([big_end_outer_diameter/2 + 1, 0, 0])
                    cube([big_end_outer_diameter, rod_big_end_width + 2, big_end_cap_thickness + 1], center=true);
            }
            
            // Big end cap
            translate([big_end_outer_diameter/2 - big_end_cap_thickness/2, 0, 0]) {
                difference() {
                    // Cap body
                    cube([big_end_cap_thickness, rod_big_end_width, big_end_outer_diameter], center=true);
                    // Bore half
                    translate([-big_end_cap_thickness/2 - 0.5, 0, 0])
                        rotate([90, 0, 0])
                            cylinder(h=rod_big_end_width + 2, d=big_end_bore_diameter, center=true, $fn=50);
                }
                
                // Bolts
                for (side = [-1, 1]) {
                    translate([0, side * bolt_spacing/2, big_end_outer_diameter/4]) {
                        // Bolt shaft
                        rotate([90, 0, 0])
                            cylinder(h=rod_big_end_width + nut_height + 2, d=bolt_diameter, center=true);
                        // Bolt head (one side)
                        translate([0, -side * (rod_big_end_width/2 + bolt_head_height/2 - 1), 0])
                            rotate([90, 0, 0])
                                cylinder(h=bolt_head_height, d=bolt_head_diameter, $fn=6);
                        // Nut (other side)
                        translate([0, side * (rod_big_end_width/2 + nut_height/2 - 1), 0])
                            rotate([90, 0, 0])
                                cylinder(h=nut_height, d=nut_diameter, $fn=6);
                    }
                }
            }
        }
        
        // Connecting rod shaft (I-beam style)
        hull() {
            // Small end connection
            translate([0, 0, small_end_z - rod_small_end_width/3])
                cube([rod_thickness_center, rod_small_end_width - 2, 1], center=true);
            
            // Transition point (upper)
            translate([0, 0, small_end_z - rod_length * 0.3])
                cube([rod_thickness_center, rod_small_end_width - 4, 1], center=true);
        }
        
        hull() {
            // Transition point (lower)
            translate([0, 0, big_end_z + rod_length * 0.25])
                cube([rod_thickness_center, rod_big_end_width - 6, 1], center=true);
            
            // Big end connection
            translate([0, 0, big_end_z + big_end_outer_diameter/4])
                cube([rod_thickness_center * 1.5, rod_big_end_width - 4, 1], center=true);
        }
        
        // Middle section of rod
        hull() {
            translate([0, 0, small_end_z - rod_length * 0.3])
                cube([rod_thickness_center, rod_small_end_width - 4, 1], center=true);
            translate([0, 0, big_end_z + rod_length * 0.25])
                cube([rod_thickness_center, rod_big_end_width - 6, 1], center=true);
        }
        
        // I-beam cutouts ( decorative lightening holes )
        translate([0, 0, (small_end_z + big_end_z)/2]) {
            // Side cutouts to create I-beam profile
            for (z_offset = [-rod_length * 0.15, 0, rod_length * 0.15]) {
                translate([0, 0, z_offset])
                    rotate([0, 0, 0])
                        cube([rod_thickness_center + 2, rod_small_end_width * 0.7, rod_length * 0.12], center=true);
            }
        }
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Piston (positioned at top)
    piston();
    
    // Connecting rod (extends downward from piston)
    connecting_rod();
}