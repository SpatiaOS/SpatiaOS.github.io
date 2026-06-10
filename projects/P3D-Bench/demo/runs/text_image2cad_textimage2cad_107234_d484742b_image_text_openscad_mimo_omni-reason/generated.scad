// Assembly Parameters
$fn = 100;

// Fin plate dimensions (21.85 x 11.28 x 1.5 mm)
fin_length = 21.85;
fin_width = 11.28;
fin_thickness = 1.5;

// Hub cap parameters
hub_outer_diameter = 10.5;
hub_height = 4.0;
hub_wall_thickness = 0.8;

// Central boss parameters
boss_outer_diameter = 3.2;
boss_inner_diameter = 1.8;
boss_height = 3.0;

// Ring parameters
ring_major_radius = 1.2;
ring_minor_radius = 0.25;

// Opening parameters (five along top edge)
opening_diameter = 1.8;
opening_spacing = 2.8;
opening_offset_x = 4.5;
opening_offset_y = 0.7;

// Tip opening for ring
tip_opening_diameter = 1.4;

// Lower body opening for ring
lower_opening_diameter = 1.4;
lower_opening_position = [5.0, -1.5];

// Chamfer parameters
chamfer_size = 0.3;

// Helper module for chamfered cylinder
module chamfered_cylinder(h, r, chamfer) {
    cylinder(h = h - chamfer, r = r, center = true);
    translate([0, 0, h/2 - chamfer/2])
        cylinder(h = chamfer, r1 = r, r2 = r + chamfer, center = true);
    translate([0, 0, -h/2 + chamfer/2])
        cylinder(h = chamfer, r1 = r + chamfer, r2 = r, center = true);
}

// Fin plate with tapered shape and concave cutout
module fin_plate() {
    difference() {
        // Main fin body - tapered wedge shape
        hull() {
            // Blunt end (hub side)
            translate([0, 0, 0])
                cube([fin_width * 0.3, fin_thickness, fin_length * 0.15], center = true);
            
            // Tapered tip
            translate([0, 0, fin_length * 0.4])
                cube([fin_width * 0.08, fin_thickness, 0.1], center = true);
        }
        
        // Concave arc cutout on one side (hub clearance)
        translate([-fin_width/2, 0, fin_length * 0.1])
            rotate([90, 0, 0])
                linear_extrude(fin_thickness + 1, center = true)
                    square([fin_width * 0.4, fin_length * 0.3], center = true);
        
        // Five circular openings along top edge
        for (i = [0:4]) {
            translate([opening_offset_x, fin_thickness/2 + 0.01, 
                      -fin_length * 0.3 + i * opening_spacing])
                rotate([90, 0, 0])
                    chamfered_cylinder(h = fin_thickness + 1, 
                                      r = opening_diameter/2, 
                                      chamfer = chamfer_size);
        }
        
        // Opening at tip for ring
        translate([0, fin_thickness/2 + 0.01, fin_length * 0.35])
            rotate([90, 0, 0])
                chamfered_cylinder(h = fin_thickness + 1, 
                                  r = tip_opening_diameter/2, 
                                  chamfer = chamfer_size);
        
        // Opening in lower body for ring
        translate([lower_opening_position[0], fin_thickness/2 + 0.01, 
                  lower_opening_position[1]])
            rotate([90, 0, 0])
                chamfered_cylinder(h = fin_thickness + 1, 
                                  r = lower_opening_diameter/2, 
                                  chamfer = chamfer_size);
    }
    
    // Add chamfered edges around perimeter (simplified representation)
    translate([0, 0, fin_length * 0.05])
        difference() {
            cube([fin_width * 0.95, fin_thickness * 0.9, fin_length * 0.9], center = true);
            cube([fin_width * 0.9, fin_thickness * 0.85, fin_length * 0.85], center = true);
        }
}

// Hub cap half-shell (one of two mirror pairs)
module hub_cap_half() {
    difference() {
        // Outer shell
        difference() {
            sphere(d = hub_outer_diameter);
            sphere(d = hub_outer_diameter - hub_wall_thickness * 2);
            
            // Cut in half
            translate([0, 0, -hub_outer_diameter/2])
                cube(hub_outer_diameter * 1.1, center = true);
        }
        
        // Central boss cutout
        cylinder(h = hub_height + 1, d = boss_outer_diameter, center = true);
    }
    
    // Central boss (bearing seat)
    difference() {
        cylinder(h = boss_height, d = boss_outer_diameter, center = true);
        cylinder(h = boss_height + 1, d = boss_inner_diameter, center = true);
    }
}

// Toroidal ring (wire ring)
module wire_ring() {
    rotate_extrude()
        translate([ring_major_radius, 0, 0])
            circle(r = ring_minor_radius);
}

// Complete assembly
module assembly() {
    // Fin plate (main structural component)
    fin_plate();
    
    // Hub cap halves (two mirror instances)
    translate([-fin_width/2 + 0.5, 0, -fin_length * 0.25]) {
        // First half
        hub_cap_half();
        
        // Second half (mirrored)
        mirror([0, 1, 0])
            hub_cap_half();
    }
    
    // Wire rings (two instances)
    // Ring at lower body opening
    translate([lower_opening_position[0], 0, lower_opening_position[1]])
        rotate([90, 0, 0])
            wire_ring();
    
    // Ring at tip opening
    translate([0, 0, fin_length * 0.35])
        rotate([90, 0, 0])
            wire_ring();
}

// Render the complete assembly
assembly();