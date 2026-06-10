// ============================================
// Retro Bluetooth Speaker - OpenSCAD Model
// ============================================
// A parametric model of a retro-style portable speaker
// with geometric front panel design and angled legs

// --- Resolution Settings ---
$fn = 100;  // High resolution for smooth curves

// ============================================
// DIMENSIONAL PARAMETERS (All in mm)
// ============================================

// Main Body Dimensions
body_length = 220;       // Total length (left to right)
body_width = 75;         // Depth (front to back)
body_height = 85;        // Height of main enclosure
body_radius = 6;         // Corner rounding radius
wall_thickness = 3;      // Wall thickness for shell

// Speaker Configuration
speaker_diameter = 48;   // Diameter of speaker cone
speaker_recess = 2;      // How far speaker sits recessed
grille_line_count = 32;  // Number of radial grille lines
grille_line_width = 1.2; // Width of each radial line
hex_layer_count = 3;     // Number of hexagonal decorative rings
hex_ring_spacing = 4;    // Spacing between hex rings

// Front Panel Decoration
decoration_size = 35;    // Size of central X-decoration
decoration_depth = 1.5;  // Depth of engraved decoration

// Top Panel Controls
button_diameter = 9;     // Diameter of control buttons
button_height = 2;       // Height of buttons above surface
button_spacing = 14;     // Center-to-center spacing

// Legs
leg_height = 65;         // Height of each leg
leg_top_dia = 11;        // Diameter at attachment point
leg_bottom_dia = 7;      // Diameter at floor
leg_splay_angle = 18;    // Outward angle from vertical (degrees)

// ============================================
// MODULE DEFINITIONS
// ============================================

// --- Main Enclosure Module ---
module main_body() {
    // Create rounded rectangular prism for main body
    hull() {
        // Four corner spheres define the rounded shape
        for (x = [-body_length/2 + body_radius, body_length/2 - body_radius],
            z = [-body_height/2 + body_radius, body_height/2 - body_radius]) {
            translate([x, 0, z])
                sphere(r=body_radius);
        }
    }
    
    // Add slight bevel to top edge for aesthetics (optional detail)
}

// --- Speaker Grille Assembly ---
module speaker_grille(x_offset) {
    translate([x_offset, body_width/2 - 0.5, 0]) {
        rotate([90, 0, 0]) {
            
            // Outer hexagonal frame assembly
            color("gray") {
                for (i = [1:hex_layer_count]) {
                    // Each layer is a hexagon getting larger
                    hex_size = speaker_diameter/2 + i * hex_ring_spacing;
                    hex_depth = 1.5 - i * 0.3;  // Deeper toward outside
                    
                    difference() {
                        // Hexagon ring
                        linear_extrude(height=hex_depth)
                            regular_polygon(hex_size + 2, 6);
                        // Cut out inner hexagon
                        translate([0, 0, -0.1])
                            linear_extrude(height=hex_depth + 0.2)
                                regular_polygon(hex_size - 1, 6);
                    }
                }
            }
            
            // Radial grille lines (sunburst pattern)
            color("darkgray") {
                for (i = [0:grille_line_count-1]) {
                    rotate([0, 0, i * (360/grille_line_count)])
                        linear_extrude(height=speaker_recess + 0.5)
                            translate([speaker_diameter/4, -grille_line_width/2, 0])
                                square([speaker_diameter/2, grille_line_width]);
                }
            }
            
            // Central speaker cone (smooth circle)
            color("dimgray")
                translate([0, 0, -speaker_recess])
                    cylinder(h=speaker_recess + 1, d=speaker_diameter * 0.75);
                    
            // Inner ring detail around cone
            color("gray")
                translate([0, 0, -0.5])
                    difference() {
                        cylinder(h=1, d=speaker_diameter * 0.82);
                        cylinder(h=1.1, d=speaker_diameter * 0.68);
                    }
        }
    }
}

// Helper function: Regular Polygon
module regular_polygon(radius, sides) {
    circle(r=radius, $fn=sides);
}

// --- Central Decoration (X-Pattern) ---
module central_decoration() {
    translate([0, body_width/2 - 0.5, 0])
        rotate([90, 0, 0])
            linear_extrude(height=decoration_depth + 0.5) {
                // Create X-pattern from four diamond shapes
                for (rot = [0, 90]) {
                    rotate(rot) {
                        // Diamond shape
                        polygon(points=[
                            [0, decoration_size/2],
                            [decoration_size/3, 0],
                            [0, -decoration_size/2],
                            [-decoration_size/3, 0]
                        ]);
                        
                        // Inner line details
                        offset(delta=-3)
                            polygon(points=[
                                [0, decoration_size/2.5],
                                [decoration_size/4, 0],
                                [0, -decoration_size/2.5],
                                [-decoration_size/4, 0]
                            ]);
                    }
                }
                
                // Center circle
                circle(d=decoration_size/4);
            }
}

// --- Control Buttons ---
module control_buttons() {
    // Position buttons on top right area
    start_x = body_length/4;  // Offset from center
    
    for (i = [0:2]) {
        translate([start_x + i * button_spacing, -body_width/2 + 15, body_height/2])
            // Button base (slightly raised cylinder)
            color("silver") {
                cylinder(h=button_height, d=button_diameter);
                // Button top cap (slightly smaller for detail)
                translate([0, 0, button_height - 0.3])
                    cylinder(h=0.4, d=button_diameter * 0.85);
                
                // Button symbols (engraved)
                if (i == 0) {  // Minus sign
                    translate([0, 0, button_height])
                        rotate([0, 0, 0])
                            linear_extrude(0.2)
                                text("-", size=5, halign="center", valign="center");
                } else if (i == 1) {  // Power/Mode symbol
                    translate([0, 0, button_height])
                        linear_extrude(0.2)
                            text("*", size=5, halign="center", valign="center");
                } else {  // Plus sign
                    translate([0, 0, button_height])
                        linear_extrude(0.2)
                            text("+", size=5, halign="center", valign="center");
                }
            }
    }
}

// --- Single Leg Module ---
module single_leg(position) {
    // Calculate position based on which corner
    x_pos = position[0];
    y_pos = position[1];
    
    // Determine splay direction based on quadrant
    x_dir = sign(x_pos);
    y_dir = sign(y_pos);
    
    translate([x_pos, y_pos, -body_height/2])
        rotate([y_dir * leg_splay_angle, x_dir * leg_splay_angle, 0])
            // Tapered cylinder from top to bottom
            color("silver")
                cylinder(
                    h=leg_height,
                    r1=leg_top_dia/2,
                    r2=leg_bottom_dia/2
                );
}

// --- Top Panel Lines (Decorative seams) ---
module top_panel_lines() {
    // Add subtle panel division lines on top
    color("darkgray")
        for (x = [-body_length/4, 0, body_length/4]) {
            translate([x, 0, body_height/2 - 0.1])
                cube([0.5, body_width - 4, 0.2], center=true);
        }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // 1. Main Body Shell
    difference() {
        main_body();
        
        // Hollow out interior (optional - makes it a shell)
        // Comment out if you want solid body
        /*
        scale([1 - 2*wall_thickness/body_length, 
               1 - 2*wall_thickness/body_width, 
               1 - 2*wall_thickness/body_height])
            main_body();
        */
    }
    
    // 2. Left Speaker Assembly
    speaker_grille(-body_length/4 - 10);
    
    // 3. Right Speaker Assembly  
    speaker_grille(body_length/4 + 10);
    
    // 4. Central Geometric Decoration
    color("lightgray")
        central_decoration();
    
    // 5. Top Control Buttons
    control_buttons();
    
    // 6. Top Panel Detail Lines
    top_panel_lines();
    
    // 7. Four Angled Legs
    // Front-left
    single_leg([-body_length/2 + 12, body_width/2 - 12]);
    // Front-right
    single_leg([body_length/2 - 12, body_width/2 - 12]);
    // Back-left
    single_leg([-body_length/2 + 12, -body_width/2 + 12]);
    // Back-right
    single_leg([body_length/2 - 12, -body_width/2 + 12]);
}

// ============================================
// END OF MODEL
// ============================================