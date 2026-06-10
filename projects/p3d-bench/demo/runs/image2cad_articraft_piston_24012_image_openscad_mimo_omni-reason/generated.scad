// Piston & Connecting Rod Assembly - Parametric Design
// Units: Millimeters | All dimensions are adjustable via top variables
$fn = 100; // Smooth curves for cylindrical components

// --------------------------
// Parameter Definitions
// --------------------------
// Piston Geometry
piston_outer_dia = 80;    // Outer diameter of piston body
piston_height = 50;       // Total height of piston
ring_groove_depth = 1;    // Depth of piston ring grooves
ring_groove_width = 1;    // Width of piston ring grooves
ring_count = 3;           // Number of piston rings
pin_boss_dia = 30;        // Diameter of piston pin mounting bosses
pin_dia = 20;             // Diameter of piston/connecting rod pin
valve_relief_dia = 10;    // Diameter of top valve relief indent
valve_relief_depth = 2;   // Depth of top valve relief indent

// Connecting Rod Geometry
rod_total_length = 150;   // Total length from small end (piston) to big end (crankshaft)
big_end_outer_dia = 60;   // Outer diameter of crankshaft bearing end
big_end_inner_dia = 40;   // Inner diameter (bearing bore)
big_end_thickness = 20;   // Thickness of big end assembly
small_end_dia = 30;       // Outer diameter of piston pin end
rod_beam_width = 15;      // Width of connecting rod I-beam web
rod_beam_height = 40;     // Height of connecting rod I-beam flanges
bolt_dia = 10;            // Diameter of big end mounting bolts
bolt_head_dia = 15;       // Diameter of bolt heads
bolt_head_height = 10;    // Height of bolt heads

// --------------------------
// Piston Module
// --------------------------
module piston() {
    // Main piston body with ring grooves and pin bore
    difference() {
        // Outer piston cylinder
        cylinder(d=piston_outer_dia, h=piston_height, center=true);
        
        // Piston ring grooves (3 total, spaced from top)
        for (i = [0 : ring_count-1]) {
            translate([0, 0, piston_height/2 - 5 - i*5])
                cylinder(d=piston_outer_dia + 2, h=ring_groove_width, center=true);
        }
        
        // Piston pin through-bore
        rotate([0, 90, 0])
            cylinder(d=pin_dia, h=piston_outer_dia + 2, center=true);
        
        // Top valve relief indent
        translate([0, 0, piston_height/2 - valve_relief_depth/2])
            cylinder(d=valve_relief_dia, h=valve_relief_depth, center=true);
    }
    
    // Piston pin mounting bosses (both sides of piston)
    for (side = [-1, 1]) {
        translate([0, side*(piston_outer_dia/2 + pin_boss_dia/2 - ring_groove_depth), 0])
            difference() {
                // Boss outer cylinder
                cylinder(d=pin_boss_dia, h=piston_height - 2*ring_groove_width, center=true);
                // Boss inner bore (matches piston pin)
                rotate([0, 90, 0])
                    cylinder(d=pin_dia, h=pin_boss_dia + 2, center=true);
            }
    }
}

// --------------------------
// Connecting Rod Module
// --------------------------
module connecting_rod() {
    // Big end (crankshaft bearing) assembly with cap and bolts
    module big_end() {
        // Main big end body
        difference() {
            cylinder(d=big_end_outer_dia, h=big_end_thickness, center=true);
            // Bearing bore
            cylinder(d=big_end_inner_dia, h=big_end_thickness + 2, center=true);
            // Bolt mounting holes
            for (side = [-1, 1]) {
                translate([side*(big_end_outer_dia/2 - bolt_dia), 0, 0])
                    cylinder(d=bolt_dia, h=big_end_thickness + 2, center=true);
            }
        }
        
        // Big end cap (separated for assembly)
        translate([0, 0, big_end_thickness/2 + 2]) {
            difference() {
                cylinder(d=big_end_outer_dia, h=big_end_thickness/2, center=true);
                cylinder(d=big_end_inner_dia, h=big_end_thickness/2 + 2, center=true);
                for (side = [-1, 1]) {
                    translate([side*(big_end_outer_dia/2 - bolt_dia), 0, 0])
                        cylinder(d=bolt_dia, h=big_end_thickness/2 + 2, center=true);
                }
            }
            
            // Bolt heads
            for (side = [-1, 1]) {
                translate([side*(big_end_outer_dia/2 - bolt_dia), 0, big_end_thickness/2 + bolt_head_height/2])
                    cylinder(d=bolt_head_dia, h=bolt_head_height, center=true);
            }
        }
    }
    
    // Rod body (I-beam cross section for strength)
    module rod_body() {
        linear_extrude(height=rod_total_length - big_end_thickness/2 - small_end_dia/2, center=false, convexity=10)
            union() {
                // Bottom flange
                square([rod_beam_width, rod_beam_height], center=true);
                // Central web
                square([rod_beam_height, rod_beam_width], center=true);
                // Top flange
                translate([0, rod_beam_height/2 - rod_beam_width/2, 0])
                    square([rod_beam_width, rod_beam_width], center=true);
            }
    }
    
    // Small end (connects to piston pin)
    module small_end() {
        difference() {
            cylinder(d=small_end_dia, h=small_end_dia, center=true);
            cylinder(d=pin_dia, h=small_end_dia + 2, center=true);
        }
    }
    
    // Assemble all connecting rod components
    union() {
        small_end();
        translate([0, 0, -small_end_dia/2])
            rod_body();
        translate([0, 0, -rod_total_length])
            big_end();
    }
}

// --------------------------
// Final Assembly
// --------------------------
module piston_rod_assembly() {
    // Position piston at top, aligned with rod small end
    piston();
    
    // Connect rod to piston pin, extend downward
    translate([0, 0, -rod_total_length])
        rotate([90, 0, 0]) // Rotate rod to vertical orientation
            connecting_rod();
}

// Render complete assembly
piston_rod_assembly();