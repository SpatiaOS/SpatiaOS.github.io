/* 
   Piston and Connecting Rod Assembly
   Parametric OpenSCAD Model
*/

// --- Global Resolution ---
$fn = 100;

// --- Parametric Variables ---

// Piston Dimensions
piston_diameter = 80;
piston_height = 65;
piston_wall = 6;
wrist_pin_offset_z = 25;       // Distance from bottom of piston to wrist pin center
wrist_pin_diameter = 22;
wrist_pin_hole_outer_d = 36;   // Diameter of the inner bosses
recess_depth = 3.5;            // Depth of the flat outer recesses for the wrist pin

// Piston Rings
ring_groove_depth = 3.5;
ring_groove_width = 2.0;
ring_groove_spacing = 3.0;
ring_groove_start_z = 8.0;     // Distance from top of piston to first ring

// Connecting Rod Dimensions
rod_length = 150;              // Center-to-center distance (Big end to Small end)

// Small End (Wrist pin end)
small_end_outer_d = 34;
small_end_inner_d = wrist_pin_diameter;
small_end_width = 26;

// Big End (Crankshaft end)
big_end_outer_d = 65;
big_end_inner_d = 45;
big_end_width = 30;
bolt_center_distance = 74;
bolt_diameter = 8;

// Shaft (I-beam with truss)
shaft_bottom_w = 42;
shaft_top_w = 26;
shaft_thick = 16;
pocket_depth = 4;              // Depth of the I-beam recess on each side


// --- Modules ---

// Truss Cutout Generator for the Shaft
module shaft_cutouts(thick, z_start, z_end, w_bottom, w_top) {
    num_sections = 7;
    step_z = (z_end - z_start) / num_sections;
    gap = 2.5; // Half of the diagonal rib thickness
    
    for (i = [0 : num_sections - 1]) {
        z1 = z_start + i * step_z;
        z2 = z1 + step_z;
        
        // Interpolate available width at current heights
        w1 = w_bottom - (w_bottom - w_top) * (i / num_sections);
        w2 = w_bottom - (w_bottom - w_top) * ((i+1) / num_sections);
        
        if (i % 2 == 0) {
            // Cutout forming a diagonal rib pointing up-right
            hull() {
                translate([0, -w1/2 + gap*2, z1 + gap]) cube([thick, 0.1, 0.1], center=true);
                translate([0, w1/2 - gap*2, z1 + gap]) cube([thick, 0.1, 0.1], center=true);
                translate([0, -w2/2 + gap*2, z2 - gap]) cube([thick, 0.1, 0.1], center=true);
            }
        } else {
            // Cutout forming a diagonal rib pointing up-left
            hull() {
                translate([0, w1/2 - gap*2, z1 + gap]) cube([thick, 0.1, 0.1], center=true);
                translate([0, -w2/2 + gap*2, z2 - gap]) cube([thick, 0.1, 0.1], center=true);
                translate([0, w2/2 - gap*2, z2 - gap]) cube([thick, 0.1, 0.1], center=true);
            }
        }
    }
}

module piston() {
    difference() {
        union() {
            difference() {
                // Main solid cylindrical body
                translate([0, 0, -wrist_pin_offset_z])
                cylinder(d=piston_diameter, h=piston_height);
                
                // Inner hollow chamber
                translate([0, 0, -wrist_pin_offset_z - 1])
                cylinder(d=piston_diameter - 2*piston_wall, h=piston_height - piston_wall + 1);
            }
            
            // Inner bosses supporting the wrist pin
            rotate([0, 90, 0])
            cylinder(d=wrist_pin_hole_outer_d, h=piston_diameter - 2*piston_wall + 2, center=true);
        }
        
        // Piston ring grooves
        for(i = [0 : 2]) {
            translate([0, 0, piston_height - wrist_pin_offset_z - ring_groove_start_z - i*(ring_groove_width + ring_groove_spacing)])
            difference() {
                cylinder(d=piston_diameter + 2, h=ring_groove_width, center=true);
                cylinder(d=piston_diameter - 2*ring_groove_depth, h=ring_groove_width + 1, center=true);
            }
        }
        
        // Wrist pin through-hole
        rotate([0, 90, 0])
        cylinder(d=wrist_pin_diameter, h=piston_diameter + 10, center=true);
        
        // Outer flat recesses for the wrist pin
        for (dir = [-1, 1]) {
            translate([dir * (piston_diameter/2), 0, 0])
            rotate([0, 90, 0])
            cylinder(d=wrist_pin_hole_outer_d + 6, h=recess_depth * 2, center=true);
        }
        
        // Top face center indentation
        translate([0, 0, piston_height - wrist_pin_offset_z])
        cylinder(d=22, h=2, center=true);
        
        // Top face center hole
        translate([0, 0, piston_height - wrist_pin_offset_z])
        cylinder(d=6, h=10, center=true);
        
        // Top face radial slit
        translate([piston_diameter/4, 0, piston_height - wrist_pin_offset_z])
        cube([piston_diameter/2, 1, 2], center=true);
        
        // Top edge chamfer
        translate([0, 0, piston_height - wrist_pin_offset_z])
        rotate_extrude()
        translate([piston_diameter/2, 0, 0])
        polygon([[0.1, 0.1], [-2, 0.1], [0.1, -2]]);
    }
}

module connecting_rod() {
    // --- Small End ---
    translate([0, 0, rod_length])
    rotate([0, 90, 0])
    difference() {
        cylinder(d=small_end_outer_d, h=small_end_width, center=true);
        cylinder(d=small_end_inner_d, h=small_end_width + 1, center=true);
    }
    
    // --- Big End (Top Half) ---
    difference() {
        union() {
            rotate([0, 90, 0])
            cylinder(d=big_end_outer_d, h=big_end_width, center=true);
            
            // Bolt mounting bosses
            for (dir = [-1, 1]) {
                translate([0, dir * bolt_center_distance/2, 0])
                cube([big_end_width, 18, big_end_outer_d], center=true);
            }
        }
        // Slice off bottom half
        translate([0, 0, -big_end_outer_d/2])
        cube([big_end_width + 1, big_end_outer_d + 40, big_end_outer_d], center=true);
        
        // Main crank hole
        rotate([0, 90, 0])
        cylinder(d=big_end_inner_d, h=big_end_width + 1, center=true);
        
        // Bolt holes
        for (dir = [-1, 1]) {
            translate([0, dir * bolt_center_distance/2, 0])
            cylinder(d=bolt_diameter, h=big_end_outer_d + 10, center=true);
        }
    }
    
    // --- Big End (Bottom Cap) ---
    translate([0, 0, -0.3]) // Slight visual gap for the split line
    difference() {
        union() {
            rotate([0, 90, 0])
            cylinder(d=big_end_outer_d, h=big_end_width, center=true);
            
            // Bolt mounting bosses
            for (dir = [-1, 1]) {
                translate([0, dir * bolt_center_distance/2, 0])
                cube([big_end_width, 18, big_end_outer_d], center=true);
            }
        }
        // Slice off top half
        translate([0, 0, big_end_outer_d/2])
        cube([big_end_width + 1, big_end_outer_d + 40, big_end_outer_d], center=true);
        
        // Main crank hole
        rotate([0, 90, 0])
        cylinder(d=big_end_inner_d, h=big_end_width + 1, center=true);
        
        // Bolt holes
        for (dir = [-1, 1]) {
            translate([0, dir * bolt_center_distance/2, 0])
            cylinder(d=bolt_diameter, h=big_end_outer_d + 10, center=true);
        }
    }
    
    // --- Bolts and Nuts ---
    for (dir = [-1, 1]) {
        translate([0, dir * bolt_center_distance/2, 0])
        union() {
            // Bolt head
            translate([0, 0, -big_end_outer_d/2 - 3])
            cylinder(d=bolt_diameter * 1.6, h=6, $fn=6, center=true); 
            
            // Bolt shaft
            cylinder(d=bolt_diameter * 0.9, h=big_end_outer_d + 10, center=true);
            
            // Nut
            translate([0, 0, big_end_outer_d/2 + 3])
            cylinder(d=bolt_diameter * 1.6, h=6, $fn=6, center=true);
            
            // Thread protrusion
            translate([0, 0, big_end_outer_d/2 + 8])
            cylinder(d=bolt_diameter * 0.8, h=4, center=true);
        }
    }
    
    // --- Tapered Shaft ---
    difference() {
        // Tapered solid envelope
        hull() {
            translate([0, 0, rod_length])
            cube([shaft_thick, shaft_top_w, 1], center=true);
            
            translate([0, 0, 0])
            cube([shaft_thick, shaft_bottom_w, 1], center=true);
        }
        
        // I-beam side pockets (recessing the web)
        for (dir = [-1, 1]) {
            hull() {
                translate([dir * (shaft_thick/2 - pocket_depth/2 + 0.1), 0, rod_length - small_end_outer_d/2])
                cube([pocket_depth + 0.2, shaft_top_w - 8, 0.1], center=true);
                
                translate([dir * (shaft_thick/2 - pocket_depth/2 + 0.1), 0, big_end_outer_d/2])
                cube([pocket_depth + 0.2, shaft_bottom_w - 8, 0.1], center=true);
            }
        }
        
        // Truss cutouts through the web
        shaft_cutouts(
            thick = shaft_thick + 10, 
            z_start = big_end_outer_d/2 + 4, 
            z_end = rod_length - small_end_outer_d/2 - 4, 
            w_bottom = shaft_bottom_w - 8, 
            w_top = shaft_top_w - 8
        );
    }
}

module wrist_pin() {
    translate([0, 0, rod_length])
    rotate([0, 90, 0])
    difference() {
        cylinder(d=wrist_pin_diameter, h=piston_diameter - recess_depth*2 - 1, center=true);
        // Hollow core of the pin
        cylinder(d=wrist_pin_diameter - 6, h=piston_diameter, center=true); 
    }
}

// --- Main Assembly ---
color([0.7, 0.7, 0.72]) {
    union() {
        // Position piston relative to rod's small end
        translate([0, 0, rod_length])
        piston();
        
        connecting_rod();
        
        wrist_pin();
    }
}