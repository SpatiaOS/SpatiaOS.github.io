// ==========================================
// Parametric Hollow-Body Electric Guitar
// ==========================================

// --- Parameters ---
$fn = 60; // Resolution for curved surfaces

// Body Dimensions
body_thickness = 45;
body_edge_radius = 10;

// Neck & Scale Dimensions
scale_length = 628;      // Standard Gibson/Epiphone scale length
bridge_y = 140;          // Y-coordinate of the bridge
nut_y = bridge_y + scale_length; // Y-coordinate of the nut (768)
neck_joint_y = 410;      // Where the neck meets the body
fretboard_end_y = 310;   // Where the fretboard ends over the body

// Hardware Dimensions
pickup_width = 70;
pickup_depth = 35;
pickup_height = 16;

// --- Main Assembly ---
color("DimGray") 
union() {
    guitar_body();
    neck();
    headstock();
}

color("#2a2a2a") fretboard();
hardware();
pickguard();
strings();


// --- Modules ---

// 1. Main Body Construction
module guitar_body() {
    difference() {
        // Main body extrusion with rounded corners via offset
        linear_extrude(height = body_thickness) {
            body_2d();
        }
        
        // Subtract F-Holes
        translate([120, 180, -1]) 
            linear_extrude(height = body_thickness + 2) 
            rotate([0, 0, -12]) f_hole_2d();
            
        translate([-120, 180, -1]) 
            linear_extrude(height = body_thickness + 2) 
            rotate([0, 0, 12]) f_hole_2d();
            
        // Cutout for neck joint to ensure flush fit
        translate([0, neck_joint_y + 20, body_thickness/2]) 
            cube([60, 40, body_thickness + 2], center=true);
    }
}

// 2D Profile of the double-cutaway body
module body_2d() {
    // Using offset to create a perfectly smooth, continuous spline-like curve
    offset(r = body_edge_radius, $fn = 100) {
        // Core vertices for the right half of the body
        pts = [
            [0, 10], [35, 12], [80, 25], [125, 50], [155, 85], [170, 130], // Lower bout
            [160, 180], [130, 215], [100, 240], [100, 255], [115, 280],    // Waist
            [135, 310], [135, 340], [120, 370], [100, 395], [90, 400],     // Upper bout & Horn tip
            [75, 395], [65, 380], [55, 365], [40, 360], [25, 370], [20, 410], // Inner horn
            [0, 410] // Center top
        ];
        
        // Combine right and left halves
        union() {
            polygon(pts);
            mirror([1, 0, 0]) polygon(pts);
        }
    }
}

// 2D Profile for a classic F-Hole
module f_hole_2d() {
    difference() {
        union() {
            translate([8, 35]) circle(d=12);
            translate([-8, -35]) circle(d=12);
            // Main sweeping stem
            hull() {
                translate([8, 35]) circle(d=3);
                translate([0, 0]) circle(d=6);
                translate([-8, -35]) circle(d=3);
            }
        }
        // Inner cutouts to define the 'f' shape
        translate([8, 26]) circle(d=10);
        translate([-8, -26]) circle(d=10);
        // Center notches
        translate([-6, 0]) polygon([[-5, -3], [5, 0], [-5, 3]]);
        translate([6, 0]) polygon([[5, -3], [-5, 0], [5, 3]]);
    }
}

// 2. Neck
module neck() {
    // Tapered neck block from body joint to nut
    hull() {
        // Heel at body joint
        translate([0, neck_joint_y - 10, body_thickness/2])
            cube([56, 20, body_thickness], center=true);
        // Neck at nut
        translate([0, nut_y, body_thickness/2 - 2])
            cube([43, 10, body_thickness - 4], center=true);
    }
}

// 3. Headstock
module headstock() {
    translate([0, nut_y, body_thickness - 16]) {
        linear_extrude(height = 15) {
            // "Open book" style headstock profile
            polygon([
                [-21.5, 0], [21.5, 0], 
                [35, 40], [40, 110], [20, 140], [5, 130],
                [0, 135],
                [-5, 130], [-20, 140], [-40, 110], [-35, 40]
            ]);
        }
    }
}

// 4. Fretboard with Frets and Inlays
module fretboard() {
    // Base wood
    translate([0, 0, body_thickness - 1]) {
        linear_extrude(height = 6) {
            polygon([
                [-28, fretboard_end_y], [28, fretboard_end_y], // Heel end
                [-21.5, nut_y], [21.5, nut_y]                  // Nut end
            ]);
        }
    }
    
    // Frets (Rule of 18 / 17.817 approximation)
    color("Silver") {
        for(i=[1:22]) {
            // Calculate fret position based on scale length
            fret_y = bridge_y + scale_length / pow(2, i/12);
            
            // Interpolate width at this fret
            t = (fret_y - fretboard_end_y) / (nut_y - fretboard_end_y);
            w = 56 - t * (56 - 43);
            
            translate([0, fret_y, body_thickness + 5])
                rotate([0, 90, 0]) cylinder(h=w-2, d=1.5, center=true);
        }
    }
    
    // Block Inlays
    color("White") {
        inlay_frets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
        for(i = inlay_frets) {
            fret_y1 = bridge_y + scale_length / pow(2, (i-1)/12);
            fret_y2 = bridge_y + scale_length / pow(2, i/12);
            mid_y = (fret_y1 + fret_y2) / 2;
            
            translate([0, mid_y, body_thickness + 4.5])
                cube([25, (fret_y1 - fret_y2)*0.55, 1], center=true);
        }
    }
}

// 5. Hardware Components
module hardware() {
    color("Silver") {
        // Bridge (Tune-o-matic style)
        translate([0, bridge_y, body_thickness + 2]) {
            cube([85, 12, 10], center=true);
            // Saddles
            for(x=[-25:10:25]) {
                translate([x, 0, 5]) cylinder(h=2, d=4, center=true);
            }
            // Posts
            translate([38, 0, -5]) cylinder(h=10, d=6);
            translate([-38, 0, -5]) cylinder(h=10, d=6);
        }
        
        // Tailpiece (Stopbar style)
        translate([0, 60, body_thickness + 2]) {
            cube([85, 16, 10], center=true);
            // Posts
            translate([38, 0, -5]) cylinder(h=10, d=8);
            translate([-38, 0, -5]) cylinder(h=10, d=8);
        }
        
        // Tuners
        tuner_y_positions = [810, 850, 890];
        for (y = tuner_y_positions) {
            // Right side tuners
            translate([38, y, body_thickness - 8]) {
                cylinder(h=22, d=6); // Post
                translate([10, 0, -4]) rotate([0, 90, 0]) cylinder(h=15, d=10); // Button
            }
            // Left side tuners
            translate([-38, y, body_thickness - 8]) {
                cylinder(h=22, d=6); // Post
                translate([-10, 0, -4]) rotate([0, -90, 0]) cylinder(h=15, d=10); // Button
            }
        }
        
        // Toggle Switch
        translate([-100, 300, body_thickness]) {
            cylinder(h=3, d=18); // Washer
            cylinder(h=15, d=4); // Shaft
            translate([0, 0, 15]) sphere(d=8); // Tip
        }
    }
    
    // Pickups (P90 / Humbucker style)
    color("Black") {
        // Bridge Pickup
        translate([0, 185, body_thickness])
            pickup_block();
            
        // Neck Pickup
        translate([0, 330, body_thickness])
            pickup_block();
            
        // Knobs (Volume/Tone)
        knob_pos = [[100, 100], [140, 90], [120, 60], [160, 50]];
        for (p = knob_pos) {
            translate([p[0], p[1], body_thickness - 1]) {
                cylinder(h=14, d1=20, d2=16);
            }
        }
    }
}

// Single Pickup Module
module pickup_block() {
    difference() {
        // Main pickup body
        translate([0, 0, pickup_height/2 - 4])
            cube([pickup_width, pickup_depth, pickup_height], center=true);
            
        // Pole pieces (simulated with small indents)
        for(x=[-25:10:25]) {
            translate([x, 0, pickup_height - 4]) 
                cylinder(h=2, d=5, center=true);
        }
    }
}

// 6. Pickguard
module pickguard() {
    // Floating pickguard elevated above the body
    translate([0, 0, body_thickness + 10]) {
        color("White") {
            linear_extrude(height = 2) {
                offset(r = 3, $fn = 30) {
                    polygon([
                        [35, 340], [70, 330], [85, 160], 
                        [50, 150], [35, 170], [45, 250]
                    ]);
                }
            }
        }
        // Epiphone-style 'E' Logo on the pickguard
        color("Silver") {
            translate([60, 240, 2]) {
                linear_extrude(height = 0.5) {
                    text("E", size=12, font="Liberation Sans:style=Bold", halign="center", valign="center");
                }
            }
        }
    }
}

// 7. Strings
module strings() {
    color("Silver") {
        // 6 strings spaced evenly
        for(i=[-2.5:1:2.5]) {
            // Tailpiece to Bridge
            hull() {
                translate([i*10, 60, body_thickness + 7]) sphere(d=0.8);
                translate([i*10, bridge_y, body_thickness + 8]) sphere(d=0.8);
            }
            // Bridge to Nut
            hull() {
                translate([i*10, bridge_y, body_thickness + 8]) sphere(d=0.8);
                translate([i*7, nut_y, body_thickness + 6]) sphere(d=0.8);
            }
            // Nut to Tuners (simplified fan out)
            hull() {
                translate([i*7, nut_y, body_thickness + 6]) sphere(d=0.8);
                translate([i*12, 850, body_thickness - 2]) sphere(d=0.8);
            }
        }
    }
}