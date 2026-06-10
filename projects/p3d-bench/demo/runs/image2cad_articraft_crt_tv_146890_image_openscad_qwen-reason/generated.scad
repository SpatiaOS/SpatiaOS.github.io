// Retro Television Set Model
// Based on 1980s CRT TV design

$fn = 60; // Resolution for curves

// ================= PARAMETERS =================

// Main Dimensions
tv_width = 560;
tv_height = 380;
tv_depth = 420;
wall_thickness = 12;
corner_radius = 15;

// Screen Area
screen_width = 340;
screen_height = 240;
screen_bevel = 20; // Thickness of the front bezel
screen_curve_radius = 600; // Radius of the CRT curve

// Control Panel Area
control_panel_width = tv_width - screen_width - 10; // Remaining width minus gap
control_panel_x_offset = screen_width + 10;

// Antenna
antenna_length = 350;
antenna_thickness = 3;
antenna_angle = 45; // Degrees from vertical

// Colors (for visualization, though STL is monochrome)
color_case = [0.85, 0.85, 0.85]; // Light grey/white plastic
color_screen = [0.1, 0.1, 0.15]; // Dark screen
color_controls = [0.2, 0.2, 0.2]; // Dark grey/black panel
color_knobs = [0.9, 0.9, 0.9]; // White/Silver knobs

// ================= MAIN ASSEMBLY =================

module tv_set() {
    // Main Casing
    color(color_case)
    difference() {
        // Outer Shell with rounded corners
        rounded_box(tv_width, tv_height, tv_depth, corner_radius);
        
        // Hollow out the inside
        translate([0, 0, -wall_thickness/2]) // Adjust for centering
        rounded_box(tv_width - wall_thickness*2, tv_height - wall_thickness*2, tv_depth + 10, corner_radius - wall_thickness/2);
        
        // Cut out the front face opening
        // We will build the front face components separately to allow for complex details
        // Actually, let's keep the front solid and subtract the screen/control recesses
    }
    
    // Front Face Assembly
    // We construct the front face as a separate block attached to the main body
    // to handle the different sections (Screen vs Controls)
    
    translate([-tv_width/2, -tv_height/2, tv_depth/2 - wall_thickness]) {
        // Base Front Panel
        cube([tv_width, tv_height, wall_thickness]);
        
        // --- SCREEN SECTION ---
        translate([10, 10, 0]) { // Margin from left/bottom
            // Screen Bezel Frame
            difference() {
                cube([screen_width, screen_height + 40, wall_thickness + 5]); // Bezel block
                // Cutout for screen
                translate([15, 15, -1]) {
                    cube([screen_width - 30, screen_height + 10, 20]);
                }
                // Cutout for speaker grille below screen
                translate([15, screen_height + 20, -1]) {
                    cube([screen_width - 30, 25, 20]);
                }
            }
            
            // CRT Screen (Curved)
            translate([screen_width/2, (screen_height + 40)/2, wall_thickness + 2]) {
                crt_screen(screen_width - 30, screen_height - 10);
            }
            
            // Speaker Grille Slats
            translate([15, screen_height + 20, wall_thickness + 1]) {
                speaker_grille(screen_width - 30, 25);
            }
            
            // Brand Logo Placeholder (Simple raised rectangle)
            translate([screen_width/2 - 20, 5, wall_thickness + 6]) {
                cube([40, 8, 2]);
            }
        }
        
        // --- CONTROL PANEL SECTION ---
        translate([control_panel_x_offset, 0, 0]) {
            // Vertical Divider/Trim
            cube([5, tv_height, wall_thickness + 2]);
            
            translate([10, 10, 0]) {
                // Control Panel Base
                difference() {
                    cube([control_panel_width - 15, tv_height - 20, wall_thickness + 5]);
                    // Recess for controls
                    translate([0, 0, -1]) {
                        cube([control_panel_width - 15, tv_height - 20, 10]);
                    }
                }
                
                // Top Controls (Knobs)
                translate([(control_panel_width - 15)/2, tv_height - 80, wall_thickness + 2]) {
                    knob_cluster();
                }
                
                // Middle Controls (Button Grid)
                translate([(control_panel_width - 15)/2, tv_height - 160, wall_thickness + 2]) {
                    button_grid();
                }
                
                // Bottom Panel (Dark area, possibly speaker or VHS slot)
                translate([(control_panel_width - 15)/2, 60, wall_thickness + 2]) {
                    color([0.1, 0.1, 0.1])
                    cube([control_panel_width - 25, 100, 2], center=true);
                }
            }
        }
    }
    
    // --- BACK PROTRUSION (CRT Hump) ---
    // The back of a CRT TV sticks out more than the front cabinet usually
    translate([0, 0, -tv_depth/2 + wall_thickness]) {
        // Just a slight bulge at the back to simulate the CRT neck area
        // Keeping it simple as a box for now
        // color(color_case)
        // translate([0, 0, -50])
        // cube([200, 200, 100], center=true); 
        // The image shows a fairly uniform box, maybe slightly deeper at the back.
        // I'll rely on the main box depth to cover this.
    }

    // --- ANTENNAS ---
    translate([0, tv_height/2 - 20, tv_depth/2 - wall_thickness]) {
        antenna_pair();
    }
    
    // --- TOP VENTS ---
    translate([0, 0, tv_height/2 - 5]) {
        top_vents();
    }
}

// ================= HELPER MODULES =================

// Rounded Box using Minkowski
module rounded_box(w, h, d, r) {
    minkowski() {
        cube([w - 2*r, h - 2*r, d - 2*r], center=true);
        sphere(r);
    }
}

// Curved CRT Screen
module crt_screen(w, h) {
    // Create a curved surface
    // We use a sphere section
    color(color_screen)
    intersection() {
        // Sphere for curvature
        sphere(r = screen_curve_radius);
        // Box to slice it to the screen size
        // The sphere is centered at 0,0,0. We need to push it back so the front face is at z=0
        translate([0, 0, -screen_curve_radius + 5]) {
            cube([w, h, 20], center=true);
        }
    }
}

// Speaker Grille with horizontal slats
module speaker_grille(w, h) {
    color([0.2, 0.2, 0.2])
    difference() {
        cube([w, h, 2], center=true);
        // Cut slots
        for (i = [0 : 4 : h-2]) {
            translate([0, -h/2 + i + 1, -1]) {
                cube([w - 2, 1, 4]);
            }
        }
    }
}

// Knob Cluster (Volume, Channel, Fine Tune)
module knob_cluster() {
    // Main large knob (Channel)
    translate([-20, 0, 0]) {
        color(color_knobs)
        cylinder(h=8, d=25, center=true);
        color([0.5, 0.5, 0.5])
        cylinder(h=9, d=5, center=true); // Indicator
    }
    // Small knobs
    translate([20, 15, 0]) {
        color(color_knobs)
        cylinder(h=6, d=15, center=true);
    }
    translate([20, -15, 0]) {
        color(color_knobs)
        cylinder(h=6, d=15, center=true);
    }
}

// Button Grid
module button_grid() {
    rows = 4;
    cols = 4;
    spacing_x = 12;
    spacing_y = 10;
    total_w = (cols - 1) * spacing_x;
    total_h = (rows - 1) * spacing_y;
    
    start_x = -total_w / 2;
    start_y = total_h / 2;
    
    for (r = [0 : rows-1]) {
        for (c = [0 : cols-1]) {
            translate([start_x + c * spacing_x, start_y - r * spacing_y, 0]) {
                color([0.8, 0.8, 0.8])
                cube([8, 6, 3], center=true);
            }
        }
    }
}

// Rabbit Ear Antennas
module antenna_pair() {
    // Left Antenna
    rotate([0, 0, 30]) {
        translate([-40, 0, 0]) {
            antenna_element();
        }
    }
    // Right Antenna
    rotate([0, 0, -30]) {
        translate([40, 0, 0]) {
            antenna_element();
        }
    }
}

module antenna_element() {
    // Base joint
    color([0.3, 0.3, 0.3])
    sphere(d=8);
    
    // Lower segment
    rotate([0, -antenna_angle, 0]) {
        color([0.8, 0.8, 0.8])
        cylinder(h=antenna_length * 0.6, d=antenna_thickness);
        
        // Upper segment (telescopic)
        translate([0, 0, antenna_length * 0.6]) {
            rotate([0, -antenna_angle + 5, 0]) { // Slight angle change for realism
                color([0.9, 0.9, 0.9])
                cylinder(h=antenna_length * 0.4, d=antenna_thickness * 0.7);
                
                // Tip
                translate([0, 0, antenna_length * 0.4]) {
                    sphere(d=antenna_thickness);
                }
            }
        }
    }
}

// Top Vents
module top_vents() {
    // Simple slots on the top rear
    color([0.1, 0.1, 0.1])
    for (i = [0 : 20 : 100]) {
        translate([0, -100 + i, 2]) {
            cube([200, 5, 2], center=true);
        }
    }
}

// ================= EXECUTION =================

tv_set();