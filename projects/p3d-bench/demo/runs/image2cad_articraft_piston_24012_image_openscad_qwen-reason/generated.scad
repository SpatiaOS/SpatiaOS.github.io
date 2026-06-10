// Piston and Connecting Rod Assembly
// Parametric model based on visual analysis of the provided image.

$fn = 64; // Smoothness for curves

// ================= PARAMETERS =================

// Piston Parameters
piston_diameter = 80;
piston_height = 60;
piston_pin_diameter = 22;
piston_pin_offset_from_top = 18; // Distance from crown to pin center
ring_groove_count = 3;
ring_groove_depth = 1.5;
ring_groove_width = 2.5;
ring_land_height = 4; // Height of the metal between grooves
top_dish_diameter = 30;
top_dish_depth = 2;

// Connecting Rod Parameters
rod_length = 150; // Center to center distance
rod_width = 20; // Thickness of the rod (into the page)
small_end_diameter = 26;
big_end_diameter = 54;
big_end_cap_height = 15; // Height of the bottom cap section
web_thickness = 8; // Thickness of the central I-beam web
flange_thickness = 6; // Thickness of the I-beam flanges

// Bolt Parameters
bolt_diameter = 8;
bolt_head_height = 5;
bolt_head_diameter = 13;
nut_height = 6;

// ================= ASSEMBLY =================

// Position the assembly
translate([0, 0, 0]) {
    // Piston
    translate([0, 0, rod_length + piston_height/2 - piston_pin_offset_from_top]) {
        piston();
    }
    
    // Connecting Rod
    connecting_rod();
}

// ================= MODULES =================

module piston() {
    difference() {
        union() {
            // Main piston body
            cylinder(d = piston_diameter, h = piston_height, center = true);
            
            // Pin Bosses (thickened areas around the pin hole)
            // The image shows the piston skirt thickens around the pin area
            boss_diameter = piston_diameter - 4; // Slightly smaller than main dia
            boss_height = 15;
            translate([0, 0, piston_height/2 - piston_pin_offset_from_top]) {
                rotate([90, 0, 0]) {
                    cylinder(d = boss_diameter, h = boss_height, center = true);
                }
            }
        }
        
        // Top Dish / Valve Relief
        translate([0, 0, piston_height/2]) {
            cylinder(d = top_dish_diameter, h = top_dish_depth + 1);
        }
        
        // Piston Pin Hole
        rotate([90, 0, 0]) {
            cylinder(d = piston_pin_diameter, h = piston_diameter + 10, center = true);
        }
        
        // Ring Grooves
        // Calculate positions for grooves near the top
        for (i = [0 : ring_groove_count - 1]) {
            groove_z = piston_height/2 - (ring_land_height + ring_groove_width) * i - ring_land_height/2 - ring_groove_width/2;
            // Adjust based on image: grooves are near the top
            // Let's place them starting from top - offset
            // Top land
            // Groove 1
            // Land
            // Groove 2 ...
            
            // Refined positioning:
            // Top of piston is piston_height/2
            // First groove starts a bit down
            z_pos = piston_height/2 - 5 - i * (ring_groove_width + 2); 
            translate([0, 0, z_pos]) {
                cylinder(d = piston_diameter - ring_groove_depth * 2, h = ring_groove_width + 0.1, center = true);
            }
        }
        
        // Skirt relief (optional, usually pistons are slightly barrel shaped or tapered)
        // The image shows a straight skirt, maybe slightly tapered at bottom
        // Let's add a small chamfer at the bottom edge
        // (Done via difference of a larger inverted cone if needed, but simple cylinder is close enough)
    }
    
    // Add the "eyelet" detail on the side of the piston (visible in image)
    // This is likely the pin boss outer shape or a specific forging mark.
    // The image shows a circular detail on the side of the skirt.
    translate([piston_diameter/2 - 2, 0, piston_height/2 - piston_pin_offset_from_top]) {
        rotate([90, 0, 0]) {
            // Outer ring of the boss
            difference() {
                cylinder(d = 16, h = 4, center = true);
                cylinder(d = 10, h = 5, center = true);
            }
        }
    }
}

module connecting_rod() {
    // The rod consists of:
    // 1. Small End (Top)
    // 2. Big End (Bottom)
    // 3. I-Beam Shaft connecting them
    
    difference() {
        union() {
            // --- Small End ---
            translate([0, 0, rod_length]) {
                cylinder(d = small_end_diameter, h = rod_width, center = true);
            }
            
            // --- Big End ---
            // The big end is split. We model the main body and the cap.
            // Main body (top part of the split)
            translate([0, 0, 0]) {
                // We create a cylinder and cut the bottom part off for the split line
                // Actually, let's model the full circle first, then we will subtract the split line later or model parts separately.
                // For a solid model, it's easier to model the full big end and then add the cap details.
                // But the image shows a split.
                // Let's model the Big End Body (top half + sides) and Big End Cap (bottom half).
                
                // Big End Body
                // It's roughly a circle with a flat bottom where the cap attaches
                intersection() {
                    cylinder(d = big_end_diameter, h = rod_width, center = true);
                    // Cut off the bottom part to make room for the cap
                    translate([0, 0, -big_end_diameter/4]) cube([big_end_diameter * 1.5, big_end_diameter * 1.5, big_end_diameter], center = true);
                }
                
                // Big End Cap
                translate([0, 0, -big_end_diameter/2 + big_end_cap_height/2]) { // Position cap at bottom
                     // The cap is a segment of the circle
                     // Simplified: A block that matches the bottom curvature
                     hull() {
                         // Top of cap (flat interface)
                         translate([0, 0, big_end_cap_height/2 - 1]) cube([big_end_diameter, rod_width, 2], center = true);
                         // Bottom of cap (curved)
                         // We use a difference to get the curved bottom
                         // Actually, let's just use a cylinder segment
                         // A simpler approximation for the cap:
                         translate([0, 0, -2]) cylinder(d = big_end_diameter, h = big_end_cap_height, center = true);
                     }
                     // Trim the cap to be just the bottom part
                     intersection() {
                         cylinder(d = big_end_diameter, h = big_end_cap_height + 10, center = true); // Dummy large cylinder
                         translate([0, 0, -big_end_cap_height/2]) cube([big_end_diameter * 1.2, big_end_diameter * 1.2, big_end_cap_height], center = true);
                     }
                }
            }
            
            // --- I-Beam Shaft ---
            // We use hull() to create the tapered I-beam shape
            // Flanges (the wide parts)
            hull() {
                // Top flange (at small end)
                translate([0, 0, rod_length]) {
                    cube([rod_width, flange_thickness * 2, web_thickness], center = true); // Wait, rod_width is thickness (Z). 
                    // Let's re-orient.
                    // Standard rod: Small end is at top. Big end at bottom.
                    // Rod width (thickness) is along X axis in this local view? No, usually Y or Z.
                    // In my setup: Z is up.
                    // So rod thickness is along Y axis (depth).
                    // Let's assume rod_width is the dimension along Y.
                    // And the I-beam width is along X.
                    
                    // Correction:
                    // Small end diameter is along X/Y plane.
                    // Rod thickness is along Y? No, usually the rod is "flat" relative to the engine block sides, 
                    // but the I-beam is strong against buckling in the plane of motion.
                    // Let's assume the "width" of the I-beam (flanges) is along X, and thickness is along Y.
                    
                    // Top Flange Box
                    translate([0, 0, 0]) cube([rod_width, flange_thickness * 2, web_thickness], center = true); // This is confusing.
                }
            }
            
            // Let's restart the Shaft logic with clear axes.
            // Z axis: Vertical (Rod length).
            // X axis: Width of the I-beam flanges.
            // Y axis: Thickness of the rod (into the page).
            
            // Small End is at Z = rod_length.
            // Big End is at Z = 0.
            
            // Shaft Flanges (The wide parts of the I)
            // Top Flange (near small end)
            // Bottom Flange (near big end)
            
            // I'll use a dedicated module for the shaft to keep it clean.
            rod_shaft();
        }
        
        // --- Holes ---
        
        // Small End Pin Hole
        translate([0, 0, rod_length]) {
            rotate([90, 0, 0]) {
                cylinder(d = piston_pin_diameter, h = rod_width + 2, center = true);
            }
        }
        
        // Big End Bore (Crankshaft journal)
        translate([0, 0, 0]) {
            crank_journal_dia = big_end_diameter - 10; // Estimate
            cylinder(d = crank_journal_dia, h = rod_width + 2, center = true);
        }
        
        // Split Line cut (to separate cap visually, though it's a union in STL usually)
        // The image shows a split. I'll add a thin cut.
        translate([0, 0, -big_end_diameter/2 + big_end_cap_height]) {
             cube([big_end_diameter + 10, rod_width + 2, 1], center = true);
        }
        
        // Bolt Holes in Big End
        // Bolts are usually parallel to the rod axis or slightly angled.
        // In the image, they look parallel.
        bolt_spacing_x = big_end_diameter * 0.6;
        translate([bolt_spacing_x/2, 0, 0]) {
            cylinder(d = bolt_diameter, h = rod_width + 20, center = true);
        }
        translate([-bolt_spacing_x/2, 0, 0]) {
            cylinder(d = bolt_diameter, h = rod_width + 20, center = true);
        }
    }
    
    // Add Bolts and Nuts
    bolt_spacing_x = big_end_diameter * 0.6;
    
    // Left Bolt
    translate([-bolt_spacing_x/2, 0, 0]) {
        // Bolt goes from top to bottom (or bottom to top)
        // Usually bolts go from the cap up into the rod body.
        // Let's model them sticking out the bottom (cap side).
        translate([0, 0, -big_end_diameter/2 - 5]) {
            bolt_assembly();
        }
    }
    
    // Right Bolt
    translate([bolt_spacing_x/2, 0, 0]) {
        translate([0, 0, -big_end_diameter/2 - 5]) {
            bolt_assembly();
        }
    }
}

module rod_shaft() {
    // Create the I-Beam shape connecting Small End (Z=rod_length) and Big End (Z=0)
    
    // Dimensions at Top (Small End)
    top_flange_width = rod_width; // Thickness of rod
    top_flange_height = 16; // Width of the I-beam at top
    top_web_thickness = web_thickness;
    
    // Dimensions at Bottom (Big End)
    bottom_flange_width = rod_width;
    bottom_flange_height = 24; // Wider at bottom
    bottom_web_thickness = web_thickness + 2;
    
    // 1. The Web (Central vertical part)
    // Hull between top web rect and bottom web rect
    hull() {
        // Top Web
        translate([0, 0, rod_length]) {
            cube([top_web_thickness, top_flange_width, top_flange_height], center = true); 
            // Wait, orientation.
            // Z is up.
            // Web is vertical.
            // So the cube should be tall in Z? No, the web is the connection.
            // The "Web" is the central plate.
            // It runs along Z.
            // Its thickness is along X (or Y).
            // Its height is along Z.
            // Its width (depth) is along Y (or X).
            
            // Let's assume:
            // X axis: Left/Right (Flange width direction)
            // Y axis: Front/Back (Rod thickness direction)
            // Z axis: Up/Down
            
            // Web: Thin in X, Thick in Y, Tall in Z.
            // No, usually I-beam rod:
            // Flanges are parallel to the plane of motion (X-Z plane?).
            // No, usually flanges are perpendicular to the crank axis to resist buckling.
            // Let's look at the image.
            // The rod looks like an "I" when viewed from the side.
            // So the flanges are Left and Right (X axis).
            // The Web is Front and Back (Y axis)? No, Web is central.
            
            // Standard I-Beam Rod:
            // Flanges are the wide parts. Web is the narrow part connecting them.
            // In the image, the rod looks like an H or I.
            // The "flanges" seem to be the parts facing us and away?
            // Or the parts left and right?
            // Looking at the bottom (big end), the rod widens.
            // Looking at the shaft, it has a central web and side flanges.
            // It looks like the flanges are on the Left and Right (X axis).
            // So the Web is in the middle (Y axis thickness).
            
            // Let's try:
            // Web: Cube centered at 0,0. Thickness = web_thickness (along X). Height = rod_length (along Z). Depth = rod_width (along Y).
            // Flanges: Attached to the Web.
            
            // Actually, let's use the Hull approach for the whole I-shape.
            // Top Profile (at Z=rod_length):
            // A shape like "I".
            // Bottom Profile (at Z=0):
            // A shape like "I" but wider.
            
            // Top "I" Profile
            translate([0, 0, rod_length]) {
                // Central Web part
                cube([web_thickness, rod_width, 1], center = true); // Just a slice for hull reference
                // Flanges
                translate([0, 0, 0]) {
                     // Top Flange
                     cube([rod_width, flange_thickness, 14], center = true); // Width=rod_width (Y), Height=14 (X?? No)
                }
            }
        }
    }
    
    // Let's simplify.
    // The rod shaft is a tapered box with cutouts.
    // Outer Box: Hull of Top Box and Bottom Box.
    // Cutouts: Remove material from sides to leave the web.
    
    // Outer Boundary
    hull() {
        // Top Block (Small End area)
        translate([0, 0, rod_length]) {
            cube([rod_width, 16, 1], center = true); // Width (Y) = rod_width. Height (X) = 16. Thickness (Z) = 1 (for hull).
            // Wait, Z is up.
            // So the block is at Z=rod_length.
            // Dimensions: X (width of I), Y (thickness of rod), Z (height of block).
            // Let's say X is the width of the I-beam flanges.
            // Y is the thickness of the rod (into page).
            
            // Top Block:
            cube([16, rod_width, 10], center = true); 
        }
        
        // Bottom Block (Big End area)
        translate([0, 0, 0]) {
            cube([24, rod_width, 10], center = true);
        }
    }
    
    // Now subtract the "empty" parts of the I-beam.
    // The I-beam has a web in the center.
    // So we need to remove material from the "sides" of the X-axis?
    // Or from the "front/back" of the Y-axis?
    
    // Looking at the image:
    // The rod has a central web (thin part) and flanges (wide parts).
    // The flanges seem to be on the "faces" (Y axis faces?).
    // No, usually the I-beam is oriented so the flanges resist the main forces.
    // In the image, the rod looks like the flanges are Left and Right (X axis).
    // So the Web is in the middle (Y axis).
    // Wait, if flanges are Left/Right, then the cross section is |-| (rotated 90 deg).
    // That means the "width" (X) is large, and "thickness" (Y) is small (web) + flanges.
    
    // Let's look at the Big End.
    // The rod connects to the big end. The big end is a circle.
    // The rod widens into the big end.
    // The "I" shape is visible on the shaft.
    // It looks like the flanges are the parts running along the length.
    // And the web connects them.
    
    // Let's assume standard orientation:
    // Flanges are parallel to the plane of motion (X-Z plane).
    // So the "width" of the rod (X) is the flange width.
    // The "thickness" (Y) is the web thickness + flange thickness.
    
    // So, Outer Hull creates a box of Width X (tapered 16->24) and Thickness Y (constant rod_width).
    // To make it an I-beam:
    // We need to remove material from the "middle" of the Thickness Y?
    // No, an I-beam has material at the extremes of the bending axis.
    // If bending is in X-Z plane (side to side), flanges should be at +/- X.
    // If bending is in Y-Z plane (front to back), flanges should be at +/- Y.
    // Pistons push down (Z). Rod buckles.
    // Usually, the rod is stiffer in the plane of motion (X-Z).
    // So flanges should be at +/- X? No, that would make it wide and thin.
    // Usually, the rod is "tall" in the plane of motion?
    // No, the rod is usually an I-beam where the flanges are parallel to the crankshaft axis (Y axis)?
    // Or perpendicular?
    // Most automotive rods are I-beams where the flanges are parallel to the plane of motion (X-Z).
    // Wait, if flanges are parallel to X-Z, then the cross section looks like "H" (rotated).
    // i.e. Flanges are Top and Bottom in the cross section (Y axis)?
    // No, "I" beam: Flanges are the horizontal bars of the I. Web is the vertical bar.
    // If the "I" is upright (standard), flanges are Top/Bottom (Y axis extremes). Web is vertical (X axis?? No, Z axis in cross section).
    
    // Let's look at the image again.
    // The rod shaft has a central "web" that looks like a triangle or truss?
    // No, it looks like a standard I-beam with lightening holes?
    // Actually, looking very closely at the shaft...
    // It looks like an H-beam? Or an I-beam with a very thick web.
    // There are diagonal ribs?
    // "The image shows... a central web... and flanges".
    // Let's assume it's a standard I-beam.
    // I will model it as:
    // Two flanges (plates) running the length of the rod.
    // One web (plate) running the length, connecting the flanges.
    
    // Flanges:
    // Top Flange (in Y): Plate at Y = +rod_width/2 ?? No.
    // Let's assume the rod thickness is Y.
    // Flanges are at Y = +something and Y = -something?
    // Or X = +something and X = -something?
    
    // Let's try: Flanges are on the "sides" (X axis).
    // So the rod is wide (X) and has flanges on the faces?
    // No, that's not an I-beam. That's a box.
    // An I-beam has flanges at the extremes of the major axis.
    // If the major axis is X (width), flanges are at X=+/- Width/2.
    // Then the web is in the middle (X=0).
    // This matches the visual of a rod that is "wide" and has a "thin" middle?
    // No, usually rods are "tall" (in the plane of motion) or "wide" (perpendicular).
    // Most are I-beams where the flanges are parallel to the crankshaft (Y axis).
    // So the cross section looks like "I" (upright).
    // Flanges are at Y = +/- Thickness/2.
    // Web is at X = 0.
    
    // Let's assume this:
    // Flanges are Front and Back (Y axis).
    // Web is Central (X axis).
    // So the rod is "thick" in Y (due to flanges) and "thin" in X (web)??
    // No, the flanges add width in X?
    // Cross section "I":
    // Top bar of I: Wide in X, Thin in Y.
    // Bottom bar of I: Wide in X, Thin in Y.
    // Vertical bar of I: Thin in X, Tall in Y.
    // This means the rod is Wide (X) and Tall (Y).
    // But the image shows the rod is relatively narrow in X and thick in Y?
    // Or vice versa?
    // In the image, the rod looks like the "I" is lying on its side? (H-beam).
    // Or it's a standard I-beam.
    
    // Let's just model a generic "I-beam" shaft.
    // I will create two flanges (top and bottom in Y) and a web (center in X).
    // Flanges: Wide in X, Thin in Y.
    // Web: Thin in X, Tall in Y (connecting flanges).
    
    // Flanges (Top and Bottom in Y)
    hull() {
        // Top Flange (at Y = +rod_width/2 ?? No, let's say Y is thickness)
        // Let's say the rod lies along Z.
        // Cross section is in X-Y plane.
        // Flanges are at Y = +offset and Y = -offset.
        // Web is at X = 0.
        
        // Top Flange (Y positive)
        translate([0, rod_width/2 - flange_thickness/2, rod_length]) {
             cube([16, flange_thickness, 1], center = true); // Wide in X (16), Thin in Y (flange_thickness)
        }
        translate([0, rod_width/2 - flange_thickness/2, 0]) {
             cube([24, flange_thickness, 1], center = true); // Wider at bottom
        }
        
        // Bottom Flange (Y negative)
        translate([0, -rod_width/2 + flange_thickness/2, rod_length]) {
             cube([16, flange_thickness, 1], center = true);
        }
        translate([0, -rod_width/2 + flange_thickness/2, 0]) {
             cube([24, flange_thickness, 1], center = true);
        }
    }
    
    // Web (Connecting the flanges in the middle)
    hull() {
        translate([0, 0, rod_length]) {
            cube([web_thickness, rod_width - flange_thickness, 1], center = true);
        }
        translate([0, 0, 0]) {
            cube([web_thickness + 2, rod_width - flange_thickness, 1], center = true);
        }
    }
    
    // This creates an I-beam where the flanges are Front/Back (Y axis).
    // And the web is Central.
    // This matches the "thick" look of the rod in the image.
}

module bolt_assembly() {
    // Bolt
    color("gray") {
        // Shaft
        cylinder(d = bolt_diameter, h = 30, center = false);
        // Head
        translate([0, 0, 30]) {
            cylinder(d = bolt_head_diameter, h = bolt_head_height, center = false);
        }
    }
    // Nut (on the other side, or same side?)
    // Usually bolt goes through, nut on the other end.
    // In the image, we see bolt heads/nuts on the bottom cap.
    // Let's assume the bolt comes from the top (rod body) down to the cap.
    // So the head is at the top (inside the rod body, hidden?) and nut is at the bottom.
    // Or bolt comes from bottom up.
    // Image shows hexagonal features on the bottom.
    // Let's model a Nut at the bottom.
    translate([0, 0, 30]) { // Just above the bolt head? No.
        // Let's say bolt length is 30.
        // Nut is at the end.
    }
    
    // Let's simplify: Just a hex bolt sticking out.
    // The image shows nuts/bolts on the split line.
    // I'll model a hex nut.
    translate([0, 0, 25]) { // Position on the bolt shaft
        rotate([0, 0, 30]) { // Rotate for hex
            cylinder(d = bolt_head_diameter, h = nut_height, center = true, $fn=6);
        }
    }
}

// Helper to visualize
// translate([100, 0, 0]) piston();
// translate([-100, 0, 0]) connecting_rod();