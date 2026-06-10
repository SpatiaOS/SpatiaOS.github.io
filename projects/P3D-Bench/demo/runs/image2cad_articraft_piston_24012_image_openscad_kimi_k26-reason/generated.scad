// ============================================
// Piston and Connecting Rod Assembly
// ============================================

$fn = 60;

// --------------------------------------------
// Piston Parameters
// --------------------------------------------
piston_diameter = 80;
piston_height = 70;
valve_pocket_diameter = 14;
valve_pocket_depth = 1.5;

// Ring grooves
ring_count = 3;
ring_height = 2;
ring_depth = 2.5;
ring_spacing = 3;
top_land = 6; // Distance from crown to first groove

// Wrist pin
pin_diameter = 20;
pin_boss_diameter = 28;
pin_length = piston_diameter + 4; // Slightly protrudes from piston
pin_offset = 22; // From bottom of piston to pin center

// --------------------------------------------
// Connecting Rod Parameters
// --------------------------------------------
rod_length = 150; // Wrist pin center to crank pin center

// Small end (top)
small_end_diameter = 26;
small_end_width = 20;

// Big end (bottom)
big_end_diameter = 46;
big_end_width = 28;
big_end_bore = 22;

// I-beam beam dimensions
// Big end (Z = big_end_diameter/2)
beam_width_big = 28;
beam_thickness_big = 30;
flange_big = 5;
web_big = 6;

// Small end (Z = rod_length - small_end_diameter/2)
beam_width_small = 20;
beam_thickness_small = 20;
flange_small = 3;
web_small = 4;

// Cap and bolts
bolt_diameter = 8;
bolt_spacing = 30;
bolt_length = 50;
bolt_z_offset = -15; // Position within cap
nut_size = 12;
nut_height = 5;

// Calculated beam extents
beam_start_z = big_end_diameter / 2;
beam_end_z = rod_length - small_end_diameter / 2;
beam_height = beam_end_z - beam_start_z;

// ============================================
// Modules
// ============================================

// Piston body with ring grooves, valve pocket and wrist pin hole
module piston() {
    difference() {
        union() {
            // Main cylindrical piston body
            cylinder(h=piston_height, d=piston_diameter);
            
            // Wrist pin bosses (slight protrusions on skirt)
            for (side = [-1, 1]) {
                translate([side * piston_diameter / 2, 0, pin_offset])
                    rotate([0, 90, 0])
                    cylinder(h=3, d=pin_boss_diameter, center=true);
            }
        }
        
        // Valve pocket on crown
        translate([0, 0, piston_height - valve_pocket_depth])
            cylinder(h=valve_pocket_depth + 0.01, d=valve_pocket_diameter);
        
        // Ring grooves
        for (i = [0 : ring_count - 1]) {
            z = piston_height - top_land - (i + 1) * ring_height - i * ring_spacing;
            translate([0, 0, z])
                cylinder(h=ring_height, d=piston_diameter + 2 * ring_depth, center=false);
        }
        
        // Wrist pin hole through piston
        translate([0, 0, pin_offset])
            rotate([0, 90, 0])
            cylinder(h=piston_diameter + 4, d=pin_diameter, center=true);
    }
}

// Wrist pin shaft
module wrist_pin() {
    translate([0, 0, pin_offset])
        rotate([0, 90, 0])
        cylinder(h=pin_length, d=pin_diameter, center=true);
}

// Tapered I-beam connecting rod shaft
module connecting_rod_beam() {
    translate([0, 0, beam_start_z])
    linear_extrude(height=beam_height, scale=[
        beam_width_small / beam_width_big,
        beam_thickness_small / beam_thickness_big
    ]) {
        // I-beam profile at big end (start of extrusion)
        union() {
            // Top flange
            translate([0, beam_thickness_big / 2 - flange_big / 2])
                square([beam_width_big, flange_big], center=true);
            // Bottom flange
            translate([0, -beam_thickness_big / 2 + flange_big / 2])
                square([beam_width_big, flange_big], center=true);
            // Central web
            square([web_big, beam_thickness_big], center=true);
        }
    }
}

// Small end bearing eye
module small_end() {
    translate([0, 0, rod_length])
        rotate([0, 90, 0])
        difference() {
            cylinder(h=small_end_width, d=small_end_diameter, center=true);
            // Wrist pin bore
            cylinder(h=small_end_width + 2, d=pin_diameter, center=true);
        }
}

// Upper half of big end (integral with rod)
module big_end_rod_half() {
    difference() {
        intersection() {
            rotate([0, 90, 0])
                cylinder(h=big_end_width, d=big_end_diameter, center=true);
            translate([0, 0, big_end_diameter / 2])
                cube([big_end_width + 2, big_end_diameter, big_end_diameter], center=true);
        }
        // Crank pin bore
        rotate([0, 90, 0])
            cylinder(h=big_end_width + 2, d=big_end_bore, center=true);
    }
}

// Lower half of big end (removable cap) with bolts
module big_end_cap() {
    difference() {
        intersection() {
            rotate([0, 90, 0])
                cylinder(h=big_end_width, d=big_end_diameter, center=true);
            translate([0, 0, -big_end_diameter / 2])
                cube([big_end_width + 2, big_end_diameter, big_end_diameter], center=true);
        }
        // Crank pin bore
        rotate([0, 90, 0])
            cylinder(h=big_end_width + 2, d=big_end_bore, center=true);
    }
    
    // Cap bolts and nuts (pass through cheeks along Y axis)
    for (x = [-bolt_spacing / 2, bolt_spacing / 2]) {
        // Bolt shaft
        translate([x, 0, bolt_z_offset])
            rotate([90, 0, 0])
            cylinder(h=bolt_length, d=bolt_diameter, center=true);
        
        // Hex nut on front face (Y+)
        translate([x, bolt_length / 2 - nut_height / 2, bolt_z_offset])
            rotate([90, 0, 0])
            cylinder(h=nut_height, d=nut_size, $fn=6, center=true);
        
        // Bolt head on back face (Y-)
        translate([x, -bolt_length / 2 + nut_height / 2, bolt_z_offset])
            rotate([90, 0, 0])
            cylinder(h=nut_height, d=bolt_diameter + 2, center=true);
    }
}

// Assembled connecting rod (local coords: big end center at Z=0, small end at Z=rod_length)
module connecting_rod() {
    union() {
        connecting_rod_beam();
        small_end();
        big_end_rod_half();
        big_end_cap();
    }
}

// ============================================
// Main Assembly
// ============================================

// Piston at origin (bottom at Z=0)
piston();

// Wrist pin passing through piston
wrist_pin();

// Connecting rod positioned so small end aligns with wrist pin
translate([0, 0, pin_offset - rod_length])
    connecting_rod();