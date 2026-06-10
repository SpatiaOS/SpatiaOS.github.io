/*
 * Parametric Retro Bluetooth Speaker
 * 
 * This script generates a 3D model of a retro-style speaker with 
 * hexagonal grilles, splayed legs, and top-mounted control buttons.
 */

// ==========================================
// PARAMETERS
// ==========================================

// Global Resolution
$fn = 100;

// Main Body Dimensions
box_width = 180;
box_height = 80;
box_depth = 55;
box_corner_radius = 4;

// Leg Dimensions
leg_height = 65;
leg_radius_top = 6;
leg_radius_bottom = 3;
leg_splay_angle_x = 18; // Forward/backward tilt
leg_splay_angle_y = 18; // Left/right tilt
leg_inset_x = 25;
leg_inset_y = 15;

// Speaker Grille Dimensions
speaker_center_offset = 45; // Distance from center to speaker center
speaker_hex_outer_r = 34;
speaker_hex_inner_r = 28;
speaker_center_dome_r = 16;
speaker_depth = 4;
fin_count = 60; // Number of radial fins in the grille

// Button Dimensions
button_radius = 5;
button_spacing = 15;
button_height = 1.5;
button_inset_from_right = 20;

// ==========================================
// MAIN ASSEMBLY
// ==========================================

color("Silver")
assembly();

module assembly() {
    union() {
        // Main Body
        difference() {
            main_body();
            // Top panel seams (decorative grooves)
            top_seams();
        }
        
        // Left Speaker
        translate([-speaker_center_offset, -box_depth/2 + 0.5, 0])
            rotate([90, 0, 0])
            speaker_grille();
            
        // Right Speaker
        translate([speaker_center_offset, -box_depth/2 + 0.5, 0])
            rotate([90, 0, 0])
            speaker_grille();
            
        // Center Decorative Pattern
        translate([0, -box_depth/2 + 0.5, 0])
            rotate([90, 0, 0])
            center_decoration();
            
        // Top Buttons
        top_buttons();
        
        // Legs
        legs();
    }
}

// ==========================================
// MODULE DEFINITIONS
// ==========================================

// Generates the main rounded rectangular box
module main_body() {
    // Extrude a rounded rectangle along the Y axis (depth)
    // Centered on origin
    rotate([90, 0, 0])
    linear_extrude(height = box_depth, center = true, convexity = 3) {
        offset(r = box_corner_radius) {
            square([box_width - 2*box_corner_radius, box_height - 2*box_corner_radius], center = true);
        }
    }
}

// Generates the decorative grooves on the top panel
module top_seams() {
    seam_width = 0.8;
    seam_depth = 1.0;
    
    translate([0, 0, box_height/2 - seam_depth/2 + 0.1]) {
        // Transverse seam (front to back)
        cube([seam_width, box_depth + 2, seam_depth + 0.2], center=true);
        // Longitudinal seam (left to right, back half)
        translate([0, box_depth/4, 0])
            cube([box_width + 2, seam_width, seam_depth + 0.2], center=true);
    }
}

// Generates a single hexagonal speaker grille with radial fins
module speaker_grille() {
    // Rotate 30 degrees so the flat sides are vertical/horizontal
    rotate([0, 0, 30]) {
        union() {
            // Outer Hexagonal Frame
            difference() {
                cylinder(h=speaker_depth, r=speaker_hex_outer_r, $fn=6, center=true);
                cylinder(h=speaker_depth+1, r=speaker_hex_outer_r-3, $fn=6, center=true);
            }
            
            // Inner Hexagonal Ring
            difference() {
                cylinder(h=speaker_depth-1, r=speaker_hex_inner_r, $fn=6, center=true);
                cylinder(h=speaker_depth, r=speaker_hex_inner_r-2, $fn=6, center=true);
            }
            
            // Central Solid Dome/Circle
            cylinder(h=speaker_depth-0.5, r=speaker_center_dome_r, center=true);
            
            // Radial Fins
            // Use intersection to bound the fins within the inner hexagon
            intersection() {
                cylinder(h=speaker_depth-1.5, r=speaker_hex_inner_r-2, $fn=6, center=true);
                
                union() {
                    for(i = [0 : 360/fin_count : 359]) {
                        rotate([0, 0, i])
                        translate([speaker_center_dome_r + 5, 0, 0])
                        // Varying lengths for texture
                        cube([15, 0.8, speaker_depth], center=true);
                    }
                }
            }
        }
    }
}

// Generates the geometric pattern between the speakers
module center_decoration() {
    thickness = 2;
    
    union() {
        // Center Diamond
        rotate([0, 0, 45])
        difference() {
            cube([16, 16, thickness], center=true);
            cube([10, 10, thickness+1], center=true);
        }
        
        // Left Chevron
        translate([-16, 0, 0])
        difference() {
            rotate([0, 0, 45]) cube([12, 12, thickness], center=true);
            translate([3, 0, 0]) rotate([0, 0, 45]) cube([14, 14, thickness+1], center=true);
            translate([10, 0, 0]) cube([20, 20, thickness+2], center=true);
        }
        
        // Right Chevron
        translate([16, 0, 0])
        difference() {
            rotate([0, 0, 45]) cube([12, 12, thickness], center=true);
            translate([-3, 0, 0]) rotate([0, 0, 45]) cube([14, 14, thickness+1], center=true);
            translate([-10, 0, 0]) cube([20, 20, thickness+2], center=true);
        }
    }
}

// Generates the control buttons on the top right
module top_buttons() {
    start_x = box_width/2 - button_inset_from_right - (2 * button_spacing);
    y_pos = 0;
    z_pos = box_height/2 + button_height/2 - 0.5;
    
    // Minus Button
    translate([start_x, y_pos, z_pos]) {
        cylinder(h=button_height, r=button_radius, center=true);
        translate([0, 0, button_height/2]) cube([4, 1.2, 1], center=true); // Symbol
    }
    
    // Plus Button
    translate([start_x + button_spacing, y_pos, z_pos]) {
        cylinder(h=button_height, r=button_radius, center=true);
        translate([0, 0, button_height/2]) {
            cube([4, 1.2, 1], center=true); // Horizontal
            cube([1.2, 4, 1], center=true); // Vertical
        }
    }
    
    // Power Button
    translate([start_x + 2*button_spacing, y_pos, z_pos]) {
        cylinder(h=button_height, r=button_radius, center=true);
        translate([0, 0, button_height/2 + 0.25]) {
            difference() {
                cylinder(h=0.5, r=2.5, center=true);
                cylinder(h=1, r=1.5, center=true);
                translate([0, 2, 0]) cube([1.5, 3, 2], center=true); // Gap in ring
            }
            translate([0, 1.5, 0]) cube([1.2, 3, 0.5], center=true); // Vertical line
        }
    }
}

// Generates the four splayed legs
module legs() {
    x_pos = box_width/2 - leg_inset_x;
    y_pos = box_depth/2 - leg_inset_y;
    z_pos = -box_height/2 + 2; // Sunk slightly into the body
    
    // Front Right
    translate([x_pos, -y_pos, z_pos])
        rotate([leg_splay_angle_x, -leg_splay_angle_y, 0])
        single_leg();
        
    // Front Left
    translate([-x_pos, -y_pos, z_pos])
        rotate([leg_splay_angle_x, leg_splay_angle_y, 0])
        single_leg();
        
    // Back Right
    translate([x_pos, y_pos, z_pos])
        rotate([-leg_splay_angle_x, -leg_splay_angle_y, 0])
        single_leg();
        
    // Back Left
    translate([-x_pos, y_pos, z_pos])
        rotate([-leg_splay_angle_x, leg_splay_angle_y, 0])
        single_leg();
}

// Helper module for a single tapered leg
module single_leg() {
    translate([0, 0, -leg_height])
    cylinder(h=leg_height, r1=leg_radius_bottom, r2=leg_radius_top);
}