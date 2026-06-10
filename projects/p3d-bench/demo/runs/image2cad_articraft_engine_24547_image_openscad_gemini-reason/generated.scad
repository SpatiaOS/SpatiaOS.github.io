/* 
   Horizontal Single-Cylinder Engine Model
   A parametric OpenSCAD representation of the provided image.
*/

// ==========================================
// PARAMETERS
// ==========================================

// Global Resolution
$fn = 100;

// Flywheel Parameters
fw_dia = 65;           // Outer diameter of the flywheel
fw_width = 12;         // Total width of the flywheel rim
fw_web_thick = 4;      // Thickness of the inner web
fw_hub_dia = 14;       // Diameter of the central hub
fw_hub_width = 18;     // Width of the central hub
fw_hole_dia = 18;      // Diameter of the cutout holes
fw_hole_offset = 18;   // Distance of holes from center
fw_spacing = 42;       // Distance between the two flywheels

// Shaft Parameters
shaft_dia = 5;         // Main crankshaft diameter
shaft_len = 70;        // Total length of the main shaft

// Cylinder Parameters
cyl_dia = 24;          // Outer diameter of the cylinder (at fins)
cyl_core_dia = 20;     // Diameter of the cylinder body
cyl_len = 45;          // Length of the finned section
cyl_base_len = 15;     // Length of the smooth base section
cyl_offset = 25;       // Distance from crank center to cylinder base
fin_thickness = 0.6;   // Thickness of cooling fins
fin_spacing = 1.5;     // Distance between fins

// Base & Crankcase Parameters
crank_height = 28;     // Height from bottom of base to crankshaft center
base_length = 75;      // Overall length of the base plate
base_width = 46;       // Overall width of the base plate
base_thick = 3;        // Thickness of the bottom flange
block_width = 24;      // Width of the main bearing block
block_length = 35;     // Length of the main bearing block

// Crank Mechanism Parameters
crank_web_thick = 5;
crank_web_width = 14;
crank_web_length = 22;
crank_stroke = 14;     // Distance between shaft center and crankpin center
crank_pin_dia = 5;
crank_pin_len = 16;
conrod_len = 35;       // Distance between big end and small end centers

// ==========================================
// HELPER MODULES
// ==========================================

// Simple hex bolt head
module hex_bolt(size, height) {
    cylinder(d=size, h=height, $fn=6);
}

// Rounded box for base construction
module rounded_box(w, d, h, r) {
    hull() {
        translate([ w/2-r,  d/2-r, 0]) cylinder(r=r, h=h);
        translate([-w/2+r,  d/2-r, 0]) cylinder(r=r, h=h);
        translate([ w/2-r, -d/2+r, 0]) cylinder(r=r, h=h);
        translate([-w/2+r, -d/2+r, 0]) cylinder(r=r, h=h);
    }
}

// ==========================================
// COMPONENT MODULES
// ==========================================

// Flywheel Module
module flywheel() {
    color("#888888")
    difference() {
        union() {
            // Main outer rim
            cylinder(d=fw_dia, h=fw_width, center=true);
            // Central Hub
            cylinder(d=fw_hub_dia, h=fw_hub_width, center=true);
        }
        
        // Recess to create the web (front and back)
        translate([0, 0, fw_web_thick/2 + 0.1]) 
            cylinder(d=fw_dia - 10, h=fw_width);
        translate([0, 0, -fw_width - fw_web_thick/2 - 0.1]) 
            cylinder(d=fw_dia - 10, h=fw_width);
            
        // 5 Circular cutouts in the web
        for(i = [0 : 4]) {
            rotate([0, 0, i * 360/5])
            translate([fw_hole_offset, 0, 0])
            cylinder(d=fw_hole_dia, h=fw_width + 2, center=true);
        }
        
        // Center shaft hole
        cylinder(d=shaft_dia, h=fw_hub_width + 2, center=true);
    }
}

// Cylinder Module with Cooling Fins
module engine_cylinder() {
    color("#777777")
    rotate([0, 90, 0]) { // Orient horizontally
        union() {
            // Smooth base section connecting to crankcase
            cylinder(d=cyl_dia, h=cyl_base_len);
            
            // Finned section
            translate([0, 0, cyl_base_len]) {
                // Core body
                cylinder(d=cyl_core_dia, h=cyl_len);
                // Fins
                for(z = [0 : fin_spacing : cyl_len - fin_thickness]) {
                    translate([0, 0, z])
                    cylinder(d=cyl_dia, h=fin_thickness);
                }
            }
            
            // Cylinder head cap
            translate([0, 0, cyl_base_len + cyl_len])
            cylinder(d=cyl_dia, h=2);
        }
        
        // Top Port / Valve housing
        translate([0, cyl_core_dia/2 - 2, cyl_base_len + 10])
        rotate([-90, 0, 0]) {
            cylinder(d=8, h=12);
            // Port cap
            translate([0, 0, 10]) cylinder(d=10, h=4);
        }
    }
}

// Base and Main Bearing Block
module engine_base() {
    color("#666666")
    union() {
        // Flared Base Plate
        hull() {
            // Bottom flange
            translate([-10, 0, base_thick/2]) 
                rounded_box(base_length, base_width, base_thick, 4);
            // Top of the flare meeting the bearing block
            translate([-5, 0, 12]) 
                rounded_box(block_length + 10, block_width + 4, 0.1, 2);
        }
        
        // Main Bearing Block
        translate([-5, 0, 12 + (crank_height - 12)/2])
            cube([block_length + 10, block_width, crank_height - 12], center=true);
            
        // Bearing Caps
        translate([0, block_width/2 - 4, crank_height]) {
            cube([12, 8, 6], center=true);
            translate([0, 0, 3]) hex_bolt(3, 2);
        }
        translate([0, -block_width/2 + 4, crank_height]) {
            cube([12, 8, 6], center=true);
            translate([0, 0, 3]) hex_bolt(3, 2);
        }
    }
}

// Crankshaft and Connecting Rod Mechanism
module crank_mechanism() {
    color("#999999")
    union() {
        // Main Shaft
        rotate([90, 0, 0]) 
            cylinder(d=shaft_dia, h=shaft_len, center=true);
            
        // Crank Webs
        translate([0, crank_pin_len/2 + crank_web_thick/2, 0])
        rotate([90, 0, 0])
            hull() {
                cylinder(d=crank_web_width, h=crank_web_thick, center=true);
                translate([crank_stroke, 0, 0]) 
                    cylinder(d=crank_web_width-2, h=crank_web_thick, center=true);
            }
            
        translate([0, -crank_pin_len/2 - crank_web_thick/2, 0])
        rotate([90, 0, 0])
            hull() {
                cylinder(d=crank_web_width, h=crank_web_thick, center=true);
                translate([crank_stroke, 0, 0]) 
                    cylinder(d=crank_web_width-2, h=crank_web_thick, center=true);
            }
            
        // Crank Pin
        translate([crank_stroke, 0, 0])
        rotate([90, 0, 0])
            cylinder(d=crank_pin_dia, h=crank_pin_len + 2, center=true);
            
        // Connecting Rod
        translate([crank_stroke, 0, 0])
        rotate([0, 15, 0]) // Slight angle to show movement
        union() {
            // Big end
            rotate([90, 0, 0]) cylinder(d=12, h=8, center=true);
            // Big end cap
            translate([6, 0, 0]) cube([6, 8, 12], center=true);
            // Big end bolts
            translate([8, 0, 4.5]) rotate([0, 90, 0]) hex_bolt(2.5, 2);
            translate([8, 0, -4.5]) rotate([0, 90, 0]) hex_bolt(2.5, 2);
            
            // Rod body
            hull() {
                rotate([90, 0, 0]) cylinder(d=8, h=6, center=true);
                translate([-conrod_len, 0, 0]) 
                    rotate([90, 0, 0]) cylinder(d=6, h=6, center=true);
            }
            
            // Small end (entering cylinder)
            translate([-conrod_len, 0, 0])
                rotate([90, 0, 0]) cylinder(d=8, h=8, center=true);
        }
    }
}

// ==========================================
// MAIN ASSEMBLY
// ==========================================
// The origin [0,0,0] is the center of the crankshaft.

union() {
    // Left Flywheel
    translate([0, fw_spacing/2, 0]) 
        rotate([90, 0, 0]) 
        flywheel();
        
    // Right Flywheel
    translate([0, -fw_spacing/2, 0]) 
        rotate([90, 0, 0]) 
        flywheel();
        
    // Engine Base
    translate([0, 0, -crank_height]) 
        engine_base();
        
    // Cylinder Assembly
    translate([-cyl_offset, 0, 0]) 
        rotate([0, 0, 180]) // Point cylinder away from crank
        engine_cylinder();
        
    // Crankshaft and Rod
    crank_mechanism();
}