// Stylized Chair Assembly
// Reconstructed from image and description

$fn = 60; // Resolution for curves

// --- Parameters ---
// Seat Dimensions
seat_width = 100;
seat_depth_rect = 60;
seat_radius = 50;
seat_thickness = 20;

// Backrest Dimensions
backrest_height = 215;
backrest_thickness = 12;

// Leg Dimensions
leg_height = 100;
leg_base_size = 25;
leg_waist_radius = 140; // Large radius for concave sides

// Cutout Dimensions
diamond_size = 12;
diamond_depth = 50; // Through cut

// --- Modules ---

// Module for the waisted leg
module waisted_leg() {
    h = leg_height;
    w = leg_base_size;
    cut_pos = 145; 
    
    difference() {
        // Base cube
        cube([w, w, h], center=true);
        
        // Carve the waist (concave cylindrical sides)
        // Front (+Y)
        translate([0, cut_pos, 0]) rotate([0, 90, 0]) 
            cylinder(h=w+10, r=leg_waist_radius, center=true);
            
        // Back (-Y)
        translate([0, -cut_pos, 0]) rotate([0, 90, 0]) 
            cylinder(h=w+10, r=leg_waist_radius, center=true);
            
        // Right (+X)
        translate([cut_pos, 0, 0]) rotate([90, 0, 0]) 
            cylinder(h=w+10, r=leg_waist_radius, center=true);
            
        // Left (-X)
        translate([-cut_pos, 0, 0]) rotate([90, 0, 0]) 
            cylinder(h=w+10, r=leg_waist_radius, center=true);
    }
}

// Module for diamond cutout
module diamond_cutout(size, depth) {
    // A diamond shape (rotated square)
    rotate([0, 0, 45]) 
        cube([size, size, depth], center=true);
}

// Module for seat 2D profile
module seat_profile_2d() {
    union() {
        // Rectangle part (Back part of seat)
        // Centered in X, starting at Y=0
        translate([-seat_width/2, 0, 0]) 
            square([seat_width, seat_depth_rect]);
        // Semicircle part (Front part of seat)
        // Centered at origin
        circle(r=seat_radius);
    }
}

// Module for backrest solid
module backrest_solid() {
    // Backrest Leaf Profile (XZ plane relative to its base)
    // Approximating the pointed leaf shape described
    leaf_points = [
        [-50, 0],       // Bottom Left
        [50, 0],        // Bottom Right
        [50, 215],      // Top Right (Vertical edge)
        [0, 230],       // Top Tip (Pointed)
        [-40, 150],     // Mid Left (Curved in)
        [-50, 50],      // Lower Left (Curved out)
        [-50, 0]        // Close loop
    ];
    
    linear_extrude(height=backrest_thickness) 
        polygon(leaf_points);
}

// --- Main Assembly ---

difference() {
    union() {
        // Seat Base
        // Seat Bottom at Z=0. Top at Z=seat_thickness.
        // Profile is in XY plane.
        linear_extrude(height=seat_thickness) 
            seat_profile_2d();
            
        // Backrest
        // Attached to back of seat (Y=seat_depth_rect = 60).
        // Rises from Z=seat_thickness (20).
        // Thickness extends in +Y direction.
        translate([0, seat_depth_rect, seat_thickness]) 
            backrest_solid();
            
        // Legs
        // 4 legs under the seat.
        // Seat X: -50..50, Y: -50..60.
        // Leg positions (inset from edges):
        
        // Front Left
        translate([-35, -30, -leg_height/2]) waisted_leg();
        // Front Right
        translate([35, -30, -leg_height/2]) waisted_leg();
        // Back Left
        translate([-35, 40, -leg_height/2]) waisted_leg();
        // Back Right
        translate([35, 40, -leg_height/2]) waisted_leg();
    }
    
    // --- Cutouts ---
    
    // Seat Top Diamonds
    // Seat Top is at Z=seat_thickness.
    // Diamond 1 (Front Center)
    translate([0, -20, seat_thickness + diamond_depth/2]) 
        diamond_cutout(diamond_size, diamond_depth);
    // Diamond 2 (Back Left)
    translate([-30, 30, seat_thickness + diamond_depth/2]) 
        diamond_cutout(diamond_size, diamond_depth);
    // Diamond 3 (Back Right)
    translate([30, 30, seat_thickness + diamond_depth/2]) 
        diamond_cutout(diamond_size, diamond_depth);
        
    // Backrest Diamonds
    // Backrest is at Y=60..72, Z=20..235 (global).
    // Cluster around X=0, Z=120 (local to backrest base).
    // "wall normals tilted approximately 30°" -> rotate around X axis.
    
    // Diamond 1 (Top)
    translate([0, seat_depth_rect + backrest_thickness/2, seat_thickness + 160]) 
        rotate([30, 0, 0]) 
            diamond_cutout(diamond_size, diamond_depth);
    // Diamond 2 (Left)
    translate([-20, seat_depth_rect + backrest_thickness/2, seat_thickness + 130]) 
        rotate([30, 0, 0]) 
            diamond_cutout(diamond_size, diamond_depth);
    // Diamond 3 (Right)
    translate([20, seat_depth_rect + backrest_thickness/2, seat_thickness + 130]) 
        rotate([30, 0, 0]) 
            diamond_cutout(diamond_size, diamond_depth);
    // Diamond 4 (Bottom)
    translate([0, seat_depth_rect + backrest_thickness/2, seat_thickness + 100]) 
        rotate([30, 0, 0]) 
            diamond_cutout(diamond_size, diamond_depth);
}