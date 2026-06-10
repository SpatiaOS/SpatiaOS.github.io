/*
 * Parametric Hose Reel
 * 
 * This model generates a 3D hose reel with a wound hose, 
 * a bottom supply pipe with a valve, and an extended top hose with a connector.
 * 
 * Optimized heavily by using a 2D boolean union for the wound hose profile 
 * before rotate_extrude, preventing OpenSCAD CGAL timeouts during STL export.
 */

// --- Parameters ---

// Resolution for smooth curves
$fn = 64;

// Reel dimensions
flange_dia = 250;       // Diameter of the side plates
flange_thick = 5;       // Thickness of the side plates
drum_dia = 100;         // Diameter of the central core
drum_width = 120;       // Distance between flanges

// Hose dimensions
hose_dia = 12;          // Diameter of the hose
hose_layers = 5;        // Number of layers of wound hose

// Top hose routing
top_hose_x = -180;      // X position of the vertical hose segment
top_hose_z_end = 300;   // Z height of the top connector
bend_radius = 50;       // Radius of the 90-degree hose bend

// Bottom pipe routing
bottom_pipe_y = -90;    // Positioned behind the reel to connect to the axis
bottom_pipe_length = 200;


// --- Modules ---

// Generates the coiled hose on the drum
// Uses a 2D hull and union approach to create a single continuous profile,
// which massively speeds up rendering and prevents non-manifold errors.
module wound_hose() {
    num_wraps = floor((drum_width - 4) / hose_dia); 
    total_width = (num_wraps - 1) * (hose_dia * 0.98);
    
    rotate([90, 0, 0])
    rotate_extrude($fn=64) {
        union() {
            // Core hull to connect all layers into a single manifold solid
            hull() {
                // Base against the drum
                translate([drum_dia/2 - 1, -total_width/2])
                    square([1, total_width]);
                    
                // Center points of all hose wraps
                for(l = [0 : hose_layers - 1]) {
                    layer_radius = drum_dia/2 + hose_dia/2 + l * hose_dia * 0.85; 
                    offset = (l % 2 == 1) ? (hose_dia * 0.49) : 0;
                    for(w = [0 : num_wraps - 1]) {
                        y_pos = -total_width/2 + w * (hose_dia * 0.98) + offset; 
                        if (y_pos < drum_width/2 - 2 && y_pos > -drum_width/2 + 2) {
                            translate([layer_radius, y_pos]) 
                                square(0.1, center=true);
                        }
                    }
                }
            }
            
            // Actual ribbed surface of the hose
            for(l = [0 : hose_layers - 1]) {
                layer_radius = drum_dia/2 + hose_dia/2 + l * hose_dia * 0.85; 
                offset = (l % 2 == 1) ? (hose_dia * 0.49) : 0;
                for(w = [0 : num_wraps - 1]) {
                    y_pos = -total_width/2 + w * (hose_dia * 0.98) + offset; 
                    if (y_pos < drum_width/2 - 2 && y_pos > -drum_width/2 + 2) {
                        translate([layer_radius, y_pos]) 
                            circle(d=hose_dia * 1.02, $fn=16);
                    }
                }
            }
        }
    }
}

// Generates the main reel structure (flanges and drum)
module reel() {
    // Front flange with 4 mounting holes
    translate([0, drum_width/2 + flange_thick/2, 0]) 
        rotate([90, 0, 0]) 
        difference() {
            cylinder(h=flange_thick, d=flange_dia, center=true);
            // 4 holes arranged in a circle
            for(a = [45 : 90 : 360]) {
                rotate([0, 0, a]) 
                    translate([flange_dia * 0.3, 0, 0]) 
                    cylinder(h=flange_thick + 2, d=12, center=true);
            }
        }
        
    // Back flange (solid)
    translate([0, -drum_width/2 - flange_thick/2, 0]) 
        rotate([90, 0, 0]) 
        cylinder(h=flange_thick, d=flange_dia, center=true);
        
    // Center drum (extended slightly to overlap with flanges)
    rotate([90, 0, 0]) 
        cylinder(h=drum_width + 2, d=drum_dia, center=true);
        
    // The hose coiled on the drum
    wound_hose();
}

// Generates the lever handle for the bottom valve
module valve_handle() {
    // Stem connecting to valve
    cylinder(h=15, d=8);
    
    // Handle lever body (oriented along Y so it points horizontally when rotated)
    translate([0, 0, 12]) {
        hull() {
            cylinder(h=4, d=14, center=true);
            translate([0, 40, 0]) cylinder(h=4, d=8, center=true);
        }
        // Thicker grip area
        translate([0, 20, 0]) 
            hull() {
                cylinder(h=6, d=10, center=true);
                translate([0, 21, 0]) cylinder(h=6, d=8, center=true);
            }
    }
}

// Generates the bottom supply pipe, valve, and tapered nozzle
module bottom_assembly() {
    // Horizontal pipe from reel axis back to the drop pipe
    translate([0, -drum_width/2 + 2, 0])
        rotate([90, 0, 0])
        cylinder(h=abs(bottom_pipe_y - (-drum_width/2)) + 10, d=20);

    translate([0, bottom_pipe_y, 0]) {
        // Rotary union / hub connection at the back axis
        rotate([90, 0, 0]) cylinder(h=30, d=35, center=true);
        
        // Vertical drop pipe
        translate([0, 0, -bottom_pipe_length/2]) 
            cylinder(h=bottom_pipe_length, d=14, center=true);
            
        // Upper hexagonal fitting near the rotary union
        translate([0, 0, -30]) 
            cylinder(h=15, d=22, $fn=6);
            
        // Valve assembly
        translate([0, 0, -bottom_pipe_length + 50]) {
            // Spherical cast valve body
            sphere(d=30);
            cylinder(h=40, d=22, center=true);
            
            // Side port and handle
            rotate([0, 0, -30]) {
                translate([10, 0, 0]) rotate([0, 90, 0]) cylinder(h=15, d=14);
                translate([24, 0, 0]) rotate([0, 90, 0]) valve_handle();
            }
        }
        
        // Bottom nozzle assembly
        translate([0, 0, -bottom_pipe_length]) {
            // Hex base
            cylinder(h=12, d=24, $fn=6);
            // Tapered nozzle body 
            translate([0, 0, -35]) cylinder(h=35.1, d1=12, d2=24);
            // Straight tip
            translate([0, 0, -45]) cylinder(h=10.1, d=12);
            // Detail ring at the very tip
            translate([0, 0, -45]) cylinder(h=3, d=14);
        }
    }
}

// Generates the complex connector fitting at the end of the top hose
module top_connector() {
    // Base crimp/hex fitting
    cylinder(h=15, d=22, $fn=6);
    
    // Lower neck
    translate([0, 0, 14.9]) cylinder(h=10.2, d=16);
    
    // Main connector block
    translate([0, 0, 25]) {
        cylinder(h=25, d=20);
        
        // Top cap
        translate([0, 0, 24.9]) cylinder(h=10.1, d=22, $fn=6);
        
        // Angled side port 
        rotate([0, 0, 210]) 
            translate([0, 0, 12.5]) 
            rotate([0, 90, 0]) {
                cylinder(h=18, d=16);
                
                // Port face with inner details
                translate([0, 0, 17.9]) {
                    difference() {
                        cylinder(h=4.1, d=22);
                        // Inner bore
                        translate([0, 0, -1]) cylinder(h=6.2, d=12);
                    }
                    // Connection pins
                    for(a = [0 : 90 : 270]) {
                        rotate([0, 0, a]) 
                            translate([6, 0, 2]) 
                            cylinder(h=3, d=2);
                    }
                }
            }
    }
}

// Generates the hose extending upwards, routed from under the reel
module top_hose_assembly() {
    // Start position safely below the reel flanges to avoid intersections
    start_z = -flange_dia/2 - 15;
    wound_radius = drum_dia/2 + hose_layers * hose_dia * 0.85;
    
    // Vertical drop connecting the wound hose to the lower routing level
    translate([0, 0, start_z]) 
        cylinder(h = abs(-wound_radius - start_z) + 0.1, d=hose_dia, $fn=16);
        
    // Corner joint sphere
    translate([0, 0, start_z]) sphere(d=hose_dia, $fn=16);
        
    // Horizontal segment moving out to the left side
    translate([top_hose_x + bend_radius, 0, start_z]) 
        rotate([0, 90, 0]) 
        cylinder(h = abs(top_hose_x + bend_radius) + 0.1, d=hose_dia, $fn=16);
        
    // Corner joint sphere before the bend
    translate([top_hose_x + bend_radius, 0, start_z]) sphere(d=hose_dia, $fn=16);
        
    // 90-degree smooth bend upwards
    translate([top_hose_x + bend_radius, 0, start_z + bend_radius]) 
        rotate([90, 0, 0]) 
        rotate([0, 0, 90]) 
        rotate_extrude(angle=90, $fn=64) 
        translate([bend_radius, 0, 0]) 
        circle(d=hose_dia, $fn=16);
        
    // Long vertical segment moving up
    translate([top_hose_x, 0, start_z + bend_radius - 0.1]) 
        cylinder(h = top_hose_z_end - (start_z + bend_radius) + 0.2, d=hose_dia, $fn=16);
        
    // Connector fitting at the very top
    translate([top_hose_x, 0, top_hose_z_end]) 
        top_connector();
}


// --- Main Assembly ---

union() {
    reel();
    bottom_assembly();
    top_hose_assembly();
}