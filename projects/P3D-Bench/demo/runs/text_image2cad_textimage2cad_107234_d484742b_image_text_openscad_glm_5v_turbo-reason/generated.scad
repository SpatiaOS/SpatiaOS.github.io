// Parameters (dimensions in mm)
fin_length = 21.85;
fin_max_width = 11.28;
fin_thickness = 1.5;

// Hole parameters
hole_dia = 1.8;
hole_chamfer_dia = 2.8; // Conical transition
hole_chamfer_depth = 0.5;

// Hub parameters
hub_width = 9;
hub_height = 7;
hub_depth = 5; // Protrusion from fin

// Ring parameters
ring_outer_dia = 1.8;
ring_wire_dia = 0.25;

// Resolution
$fn = 50;

// ---------------------------------------------------------
// Module: Wire Ring (Toroidal)
// ---------------------------------------------------------
module wire_ring(od, wd) {
    rotate_extrude(angle=360, convexity=10) {
        translate([od/2 - wd/2, 0, 0]) {
            circle(d=wd);
        }
    }
}

// ---------------------------------------------------------
// Module: Chamfered Hole (Cylinder + Cone)
// ---------------------------------------------------------
module chamfered_hole(h, d_bore, d_chamfer, depth_chamfer) {
    union() {
        // Main bore
        cylinder(h=h+1, d=d_bore, center=true);
        // Chamfer (cone)
        translate([0, 0, h/2 - depth_chamfer + 0.01]) {
            cylinder(h=depth_chamfer+0.1, d1=d_bore, d2=d_chamfer);
        }
        // Bottom chamfer (optional, assuming symmetric or single sided based on "cap")
        translate([0, 0, -(h/2) + 0.01]) {
             cylinder(h=depth_chamfer+0.1, d1=d_chamfer, d2=d_bore);
        }
    }
}

// ---------------------------------------------------------
// Module: Fin Plate
// ---------------------------------------------------------
module fin_plate() {
    difference() {
        // Base shape: Linear extrusion of a custom polygon
        linear_extrude(height=fin_thickness, center=true) {
            // Define the wedge/fish profile
            // Coordinates approximated from visual and description
            polygon(points=[
                // Top edge (starts near hub, goes to tip)
                [2, 4.5],       // Top-Left shoulder
                [14, 3.5],      // Top-Mid (curve start)
                [fin_length, 0],// Tip
                
                // Bottom edge (tip back to hub)
                [15, -4],       // Bottom-Mid
                [8, -5],        // Lower belly
                [2, -5.5],      // Bottom-Left shoulder
                
                // Concave cutout to clear hub (inner corner)
                [-1, -3],       // Cutout bottom
                [-1, 3]         // Cutout top
            ]);
        }
        
        // --- Features ---
        
        // 1. Five holes along the top ridge
        // Spacing them out along the upper curve
        for (i = [0:4]) {
            // Interpolate position along the top edge
            let (
                x_pos = 6 + i * 3.2,
                y_pos = 3.8 - i * 0.7 // Slight downward slope
            )
            translate([x_pos, y_pos, 0]) {
                chamfered_hole(fin_thickness, hole_dia, hole_chamfer_dia, hole_chamfer_depth);
            }
        }
        
        // 2. Hole for lower wire ring
        translate([8, -4.5, 0]) {
            chamfered_hole(fin_thickness, hole_dia, hole_chamfer_dia, hole_chamfer_depth);
        }
        
        // 3. Hole for tip wire ring
        translate([fin_length - 1.5, -1.5, 0]) {
            chamfered_hole(fin_thickness, hole_dia, hole_chamfer_dia, hole_chamfer_depth);
        }
        
        // 4. Central Hub Bore (if fin plate passes through hub)
        // Assuming the fin plate has a slot or hole for the central axle
        translate([-2, 0, 0]) {
            cylinder(h=fin_thickness+1, d=4, center=true);
        }
    }
    
    // Add Wire Rings (attached to the plate)
    // Lower Ring
    translate([8, -4.5, -fin_thickness/2 - ring_wire_dia/2]) {
        color("silver") wire_ring(ring_outer_dia, ring_wire_dia);
        // Rotate ring to hang naturally
        rotate([90, 0, 20]) wire_ring(ring_outer_dia, ring_wire_dia); 
    }
    
    // Tip Ring
    translate([fin_length - 1.5, -1.5, -fin_thickness/2 - ring_wire_dia/2]) {
         color("silver") rotate([90, 0, -30]) wire_ring(ring_outer_dia, ring_wire_dia);
    }
}

// ---------------------------------------------------------
// Module: Hub Cap (Bulbous Multi-faceted End)
// Modeled as a hull of primitives to simulate freeform surface
// ---------------------------------------------------------
module hub_cap() {
    // The hub consists of two mirrored halves (top/bottom of Z axis relative to fin center?)
    // Or front/back? Image shows it wrapping the end. 
    // We will construct it as a solid volume at the left end.
    
    color("lightgray")
    translate([-hub_depth/2 + 1, 0, 0]) { // Shift to attach to fin end
        // Create the bulbous shape using Hull
        // Mirrored to ensure symmetry across XY plane (since fin is centered on Z)
        union() {
            // Top Half Shell
            intersection() {
                hull() {
                    sphere(d=hub_width);
                    translate([-(hub_depth), 0, 2]) sphere(d=hub_height*0.8);
                    translate([-(hub_depth)*0.5, 3, 1]) sphere(d=4);
                }
                translate([0,0,hub_height/4]) cube([hub_depth*3, hub_width*2, hub_height], center=true);
            }
            
            // Bottom Half Shell (Mirror)
            intersection() {
                hull() {
                    sphere(d=hub_width);
                    translate([-(hub_depth), 0, -2]) sphere(d=hub_height*0.8);
                    translate([-(hub_depth)*0.5, 3, -1]) sphere(d=4);
                }
                translate([0,0,-hub_height/4]) cube([hub_depth*3, hub_width*2, hub_height], center=true);
            }
            
            // Central Bearing Seat / Boss
            translate([0, 0, 0]) {
                 cylinder(h=hub_height*0.8, d=5, center=true);
                 // Flange/Bead around the seat
                 translate([0,0,1.5]) torus(3.5, 0.8);
            }
        }
    }
}

// Helper for torus shape used in hub
module torus(major_r, minor_r) {
    rotate_extrude() {
        translate([major_r, 0, 0]) {
            circle(r=minor_r);
        }
    }
}

// ---------------------------------------------------------
// Assembly
// ---------------------------------------------------------

union() {
    // 1. Main Fin Plate
    fin_plate();
    
    // 2. Hub Assembly (Positioned at the blunt left end)
    // The fin plate ends around x=-1 (based on polygon). 
    // Hub should overlap or abut here.
    hub_cap();
}