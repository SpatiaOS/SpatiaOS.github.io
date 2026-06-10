// =============================================================================
// Parametric Hose Reel Model
// =============================================================================

// Global Resolution
$fn = 60;

// --- Parameters ---

// Spool Dimensions
spool_outer_diameter = 320;      // Diameter of the side plates
spool_inner_diameter = 160;      // Diameter of the drum core
spool_width = 240;               // Width between side plates
plate_thickness = 8;             // Thickness of the side plates
rib_height = 5;                  // Height of the guide ribs on the drum
rib_count = 8;                   // Number of guide ribs

// Hose Dimensions
hose_outer_diameter = 22;        // Outer diameter of the hose
hose_inner_diameter = 14;        // Inner diameter (for visualization if needed, mostly solid here)
hose_layers = 1;                 // Number of layers of hose wound

// Pipe/Plumbing Dimensions
pipe_diameter = 18;              // Diameter of the metal pipes
pipe_wall_thickness = 2;         // Wall thickness of pipes

// Mounting Holes (on front plate)
mount_hole_pattern_d = 120;      // Diameter of the circle on which holes sit
mount_hole_d = 6;                // Diameter of mounting holes

// Colors (for visualization)
color_spool = [0.7, 0.7, 0.7];   // Grey plastic/metal
color_hose = [0.2, 0.2, 0.2];    // Black rubber
color_pipe = [0.8, 0.8, 0.8];    // Silver metal
color_valve = [0.9, 0.9, 0.9];   // White/Silver valve parts

// --- Main Assembly ---

color(color_spool)
    spool_assembly();

color(color_hose)
    hose_winding();

color(color_pipe) {
    top_inlet_assembly();
    bottom_outlet_assembly();
}


// --- Modules ---

// 1. The Main Spool (Drum and Side Plates)
module spool_assembly() {
    difference() {
        union() {
            // Back Plate
            translate([0, 0, -spool_width/2 - plate_thickness/2])
                cylinder(h=plate_thickness, d=spool_outer_diameter, center=true);
            
            // Front Plate
            translate([0, 0, spool_width/2 + plate_thickness/2])
                cylinder(h=plate_thickness, d=spool_outer_diameter, center=true);

            // Central Drum Core
            cylinder(h=spool_width, d=spool_inner_diameter, center=true);

            // Guide Ribs on the drum
            // We create ribs to separate hose windings
            for (i = [1 : rib_count]) {
                // Calculate position along the width
                // Distribute ribs evenly
                z_pos = -spool_width/2 + (i * (spool_width / (rib_count + 1)));
                translate([0, 0, z_pos])
                    rotate_extrude()
                        translate([spool_inner_diameter/2 + rib_height/2, 0, 0])
                            square([rib_height, spool_width/rib_count]); // Approximate rib shape
            }
            // Actually, let's make simple ring ribs
            for (i = [1 : rib_count]) {
                z_pos = -spool_width/2 + (i * (spool_width / (rib_count + 1)));
                translate([0, 0, z_pos])
                    rotate_extrude()
                        translate([spool_inner_diameter/2 + 2, 0, 0]) // Offset from core
                            square([4, 6]); // Rib profile: width 4, height 6
            }
        }

        // Mounting Holes on Front Plate
        // 4 holes in a square pattern
        hole_offset = mount_hole_pattern_d / 2 / sqrt(2); // For square pattern on a circle? 
        // Let's just use a square pattern directly
        hole_dist = mount_hole_pattern_d / 2;
        
        // Front plate holes
        translate([0, 0, spool_width/2 + plate_thickness]) {
            translate([hole_dist, hole_dist, 0]) cylinder(h=20, d=mount_hole_d, center=true);
            translate([-hole_dist, hole_dist, 0]) cylinder(h=20, d=mount_hole_d, center=true);
            translate([hole_dist, -hole_dist, 0]) cylinder(h=20, d=mount_hole_d, center=true);
            translate([-hole_dist, -hole_dist, 0]) cylinder(h=20, d=mount_hole_d, center=true);
        }
        
        // Central axle hole (if applicable, usually solid or has a bearing)
        // Let's leave it solid for simplicity unless specified, but usually there's a hub.
        // The image shows the pipe entering the center.
    }
}

// 2. The Wound Hose
module hose_winding() {
    // The hose winds around the drum.
    // Radius of the center of the hose
    hose_path_radius = spool_inner_diameter/2 + rib_height + hose_outer_diameter/2;
    
    // Number of turns that fit in the spool width
    // Leave a little margin
    effective_width = spool_width - 20; 
    num_turns = floor(effective_width / hose_outer_diameter);
    
    // We approximate the spiral as a stack of toruses (rings)
    // This is a simplification but looks correct for this scale
    start_z = -effective_width/2 + hose_outer_diameter/2;
    
    for (i = [0 : num_turns-1]) {
        z_pos = start_z + i * hose_outer_diameter;
        translate([0, 0, z_pos]) {
            // Create a torus representing one loop of hose
            rotate_extrude()
                translate([hose_path_radius, 0, 0])
                    circle(d=hose_outer_diameter);
        }
    }
    
    // Add the "loose" ends of the hose connecting to the pipes
    // Top connection (going up to the inlet)
    // The hose comes off the top of the spool
    translate([0, hose_path_radius, spool_width/2 - hose_outer_diameter]) {
         // This is a rough approximation of the hose bending up
         // It's complex to model the exact bend, so we'll just connect it visually
         // Actually, looking at the image, the hose goes from the spool to the top pipe.
         // Let's assume the top pipe connects to the center, and the hose is fed from there?
         // No, usually water comes IN the top pipe, into the center hub, and out to the hose.
         // OR the hose is permanently attached.
         // In the image: 
         // Top pipe -> Elbow -> Center of Spool (Swivel joint presumably).
         // Hose is wound on spool.
         // End of hose -> Bottom pipe -> Nozzle.
         
         // So we don't need to model the hose connecting to the top pipe physically in the winding loop
         // unless it's a continuous hose. 
         // Let's assume the hose end is at the bottom.
    }
}

// 3. Top Inlet Assembly (Wall connection)
module top_inlet_assembly() {
    // Vertical pipe coming down from top
    top_pipe_height = 400;
    
    // The pipe structure
    // Vertical part
    translate([0, 0, spool_width/2 + plate_thickness + top_pipe_height/2]) {
        // Outer pipe
        cylinder(h=top_pipe_height, d=pipe_diameter, center=true);
        // Inner hole (hollow pipe)
        // translate([0,0, -top_pipe_height/2 - 1]) 
        //    cylinder(h=top_pipe_height+2, d=pipe_diameter - 2*pipe_wall_thickness, center=true); 
        // (Subtracting later or just making it solid for simplicity? Let's make it solid shell)
    }
    
    // Elbow connecting to spool center
    // The pipe bends 90 degrees into the spool
    translate([0, 0, spool_width/2 + plate_thickness]) {
        // Horizontal part entering the spool
        rotate([90, 0, 0])
            cylinder(h=40, d=pipe_diameter, center=false); // Center=false, starts at 0
    }
    
    // Valve at the very top
    translate([0, 0, spool_width/2 + plate_thickness + top_pipe_height]) {
        valve_hex_knob();
    }
}

// 4. Bottom Outlet Assembly (Nozzle)
module bottom_outlet_assembly() {
    bottom_pipe_length = 250;
    
    // Vertical pipe going down from spool center
    translate([0, 0, -spool_width/2 - plate_thickness]) {
        // Pipe extending downwards
        translate([0, 0, -bottom_pipe_length/2])
            cylinder(h=bottom_pipe_length, d=pipe_diameter, center=true);
            
        // Elbow/Bend at the bottom? 
        // The image shows a valve assembly at the bottom.
        // It looks like the pipe comes down, then there's a valve, then a nozzle.
        
        // Valve assembly position
        translate([0, 0, -bottom_pipe_length]) {
            // Connector piece
            cylinder(h=20, d=pipe_diameter + 4, center=true);
            
            // Valve body
            translate([0, 0, -20]) {
                valve_lever_handle();
            }
            
            // Nozzle tip
            translate([0, 0, -50]) {
                nozzle_tip();
            }
        }
    }
}

// --- Helper Modules for Details ---

// Hexagonal Valve Knob (Top)
module valve_hex_knob() {
    // Base
    cylinder(h=15, d=25, center=true);
    // Hexagonal handle
    translate([0, 0, 10])
        cylinder(h=10, d=30, $fn=6, center=true);
    // Stem
    translate([0, 0, -10])
        cylinder(h=10, d=10, center=true);
}

// Lever Handle Valve (Bottom)
module valve_lever_handle() {
    // Valve body (bulky part)
    cylinder(h=30, d=30, center=true);
    
    // Lever handle
    translate([0, 0, 10]) {
        rotate([0, 90, 0]) // Rotate to stick out sideways
            cylinder(h=60, d=6, center=true); // The lever arm
        // Handle grip
        translate([30, 0, 0])
            cylinder(h=20, d=10, center=true);
    }
    
    // Connection to pipe above
    translate([0, 0, 15])
        cylinder(h=10, d=pipe_diameter, center=false);
        
    // Connection to nozzle below
    translate([0, 0, -15])
        cylinder(h=10, d=20, center=false); // Tapering down
}

// Nozzle Tip
module nozzle_tip() {
    // Tapered nozzle
    cylinder(h=40, r1=10, r2=5, center=false);
    // Tip opening
    translate([0, 0, 40])
        cylinder(h=5, d=8, center=false);
}