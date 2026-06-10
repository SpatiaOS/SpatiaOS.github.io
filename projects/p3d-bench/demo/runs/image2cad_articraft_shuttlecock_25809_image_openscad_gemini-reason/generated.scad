/* 
   Parametric Synthetic Badminton Shuttlecock
   ------------------------------------------
   This model generates a detailed 3D representation of a plastic 
   shuttlecock, featuring a complex skirt pattern with stiffening ribs, 
   varied cutouts (slots and holes), and a scalloped top edge.
*/

// --- Global Parameters ---

// Resolution (increase for smoother exports, e.g., 100)
$fn = 60;

// Base (Cork/Head) Dimensions
base_radius = 13;
base_height = 10;

// Skirt Dimensions
skirt_bottom_radius = 14;
skirt_top_radius = 33;
skirt_height = 48;
skirt_thickness = 0.8;

// Skirt Features
num_segments = 16;
rib_width = 1.2;
rib_thickness = 1.5;

// --- Helper Modules ---

/* 
   Positions and aligns a child object onto the surface of the conical skirt.
   z: Height along the skirt
   angle: Angular position around the Z-axis
*/
module place_on_cone(z, angle) {
    // Calculate radius at the specific height
    r_z = skirt_bottom_radius + (skirt_top_radius - skirt_bottom_radius) * (z / skirt_height);
    // Calculate the slope angle of the cone
    cone_angle = atan2(skirt_top_radius - skirt_bottom_radius, skirt_height);
    
    rotate([0, 0, angle])
    translate([r_z, 0, z])
    rotate([0, cone_angle, 0]) // Tilt to match the surface normal
    children();
}

/* 
   Generates the patterned cutouts for a single wedge/panel of the skirt.
   The pattern consists of multiple rows of different shapes.
*/
module panel_cutters() {
    // 1. Bottom row: Vertical rectangular slots
    for (a = [-7 : 3.5 : 7]) {
        place_on_cone(z = 9.5, angle = a)
        cube([5, 0.7, 7], center = true);
    }
    
    // 2. Lower middle row: Diagonal slots (sloping right)
    for (a = [-8 : 2.6 : 8]) {
        place_on_cone(z = 18, angle = a)
        rotate([30, 0, 0]) // Rotate around normal to make it diagonal
        cube([5, 0.8, 5], center = true);
    }
    
    // 3. Middle row: Circular holes
    for (a = [-8 : 2.6 : 8]) {
        place_on_cone(z = 26, angle = a)
        rotate([0, 90, 0]) // Orient cylinder to punch through
        cylinder(d = 2.0, h = 5, center = true, $fn = 16);
    }
    
    // 4. Upper middle row: Diagonal slots (sloping left)
    for (a = [-8 : 2.6 : 8]) {
        place_on_cone(z = 34, angle = a)
        rotate([-30, 0, 0])
        cube([5, 0.8, 5], center = true);
    }
    
    // 5. Top row: Smaller diagonal slots (sloping right)
    for (a = [-9 : 2.25 : 9]) {
        place_on_cone(z = 42, angle = a)
        rotate([30, 0, 0])
        cube([5, 0.7, 4], center = true);
    }
}

/* 
   Creates cylindrical cutters to carve out the wavy/scalloped top edge.
*/
module top_scallop_cutters() {
    for (i = [0 : num_segments - 1]) {
        // Position cutter halfway between ribs
        angle = (i + 0.5) * 360 / num_segments;
        rotate([0, 0, angle])
        translate([skirt_top_radius, 0, skirt_height + 3.5])
        rotate([0, 90, 0])
        cylinder(r = 7, h = 20, center = true, $fn = 40);
    }
}

/* 
   The main conical shell of the skirt before cutouts.
*/
module skirt_shell() {
    difference() {
        cylinder(r1 = skirt_bottom_radius, r2 = skirt_top_radius, h = skirt_height, $fn = 120);
        // Subtract inner cone to create wall thickness
        translate([0, 0, -0.1])
        cylinder(
            r1 = skirt_bottom_radius - skirt_thickness, 
            r2 = skirt_top_radius - skirt_thickness, 
            h = skirt_height + 0.2, 
            $fn = 120
        );
    }
}

/* 
   The longitudinal stiffening ribs that run up the outside of the skirt.
*/
module ribs() {
    cone_angle = atan2(skirt_top_radius - skirt_bottom_radius, skirt_height);
    rib_len = sqrt(pow(skirt_top_radius - skirt_bottom_radius, 2) + pow(skirt_height, 2));
    
    for (i = [0 : num_segments - 1]) {
        rotate([0, 0, i * 360 / num_segments])
        translate([skirt_bottom_radius, 0, 0])
        rotate([0, cone_angle, 0])
        // Offset slightly inwards to ensure a solid union with the shell
        translate([rib_thickness/2 - 0.4, 0, rib_len/2])
        cube([rib_thickness, rib_width, rib_len], center = true);
    }
}

/* 
   The solid base/head of the shuttlecock.
*/
module base() {
    // Main cylindrical body
    translate([0, 0, -base_height]) {
        cylinder(r = base_radius, h = base_height);
        // Rounded bottom tip (slightly flattened hemisphere)
        translate([0, 0, 0]) 
            scale([1, 1, 0.85]) 
            sphere(r = base_radius);
    }
    // Connecting collar band where the skirt attaches
    translate([0, 0, -2]) 
        cylinder(r = skirt_bottom_radius + 0.5, h = 2);
}

// --- Main Assembly ---

union() {
    // 1. Solid Base
    color("LightGray") base();
    
    // 2. Detailed Skirt
    color("White")
    union() {
        difference() {
            // Start with the solid conical shell
            skirt_shell();
            
            // Subtract the cutout patterns for all segments
            for (i = [0 : num_segments - 1]) {
                rotate([0, 0, i * 360 / num_segments])
                panel_cutters();
            }
            
            // Subtract the scallops from the top edge
            top_scallop_cutters();
        }
        
        // Add the external stiffening ribs
        ribs();
    }
}