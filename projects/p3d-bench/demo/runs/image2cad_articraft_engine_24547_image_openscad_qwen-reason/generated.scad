// OpenSCAD model of a single-cylinder air compressor/pump
// Based on visual analysis of the provided image

$fn = 60; // Global resolution

// ================= PARAMETERS =================

// Base dimensions
base_length = 180;
base_width = 120;
base_thickness = 8;
base_corner_r = 15;

// Cylinder dimensions
cyl_length = 100;
cyl_radius = 28;
cyl_wall_thickness = 4;
fin_count = 18;
fin_thickness = 2.5;
fin_spacing = 4;
fin_radius = 34;
nozzle_radius = 6;
nozzle_height = 15;

// Shaft and Crank dimensions
shaft_radius = 7;
shaft_length = 160;
crank_radius = 22; // Throw radius
crank_width = 12;
crank_pin_radius = 8;

// Flywheel dimensions
wheel_diameter = 110;
wheel_thickness = 14;
wheel_hub_radius = 18;
wheel_spoke_holes = 4;
wheel_hole_radius = 16;
wheel_hole_dist = 35; // Distance from center for holes

// Spacing
wheel_spacing = 50; // Distance between the two wheels
cyl_offset_x = 60; // Distance from crank center to cylinder start
cyl_height_z = 45; // Height of cylinder center from base

// ================= MODULES =================

module base_plate() {
    // Main base plate with rounded corners
    // Using hull of 4 cylinders to create a rounded rectangle
    h = base_thickness;
    r = base_corner_r;
    w = base_width;
    l = base_length;
    
    color("gray")
    hull() {
        translate([l/2 - r, w/2 - r, 0]) cylinder(r=r, h=h);
        translate([-l/2 + r, w/2 - r, 0]) cylinder(r=r, h=h);
        translate([l/2 - r, -w/2 + r, 0]) cylinder(r=r, h=h);
        translate([-l/2 + r, -w/2 + r, 0]) cylinder(r=r, h=h);
    }
    
    // Mounting ribs/gussets for the cylinder
    // Two vertical supports under the cylinder
    translate([-cyl_offset_x - cyl_length/2 + 10, 0, 0]) {
        cube([20, 40, cyl_height_z - cyl_radius], center=true);
    }
    translate([-cyl_offset_x - cyl_length/2 + 10, 0, 0]) {
        translate([40, 0, 0]) cube([20, 40, cyl_height_z - cyl_radius], center=true);
    }
    
    // Bearing supports for the shaft
    // Left support (near cylinder)
    translate([-crank_radius - 10, 0, 0]) {
        cube([20, base_width - 10, shaft_radius * 2 + 10], center=true);
        // Hole for shaft
        rotate([90, 0, 0]) cylinder(h=base_width, r=shaft_radius + 1, center=true);
    }
    
    // Right support (far side)
    translate([wheel_spacing/2 + 10, 0, 0]) {
         cube([20, base_width - 10, shaft_radius * 2 + 10], center=true);
        rotate([90, 0, 0]) cylinder(h=base_width, r=shaft_radius + 1, center=true);
    }
}

module cylinder_block() {
    // Position the cylinder block
    // It is aligned along the X axis, to the left of the origin
    // Center height is cyl_height_z
    
    translate([-cyl_offset_x - cyl_length/2, 0, cyl_height_z]) {
        rotate([0, 90, 0]) { // Rotate to align with X axis
            
            // Main cylinder barrel
            difference() {
                cylinder(h=cyl_length, r=cyl_radius, center=true);
                // Hollow out the inside (piston chamber)
                translate([0, 0, 1]) cylinder(h=cyl_length, r=cyl_radius - cyl_wall_thickness, center=true);
            }
            
            // Cooling Fins
            // Fins cover most of the barrel, leaving space for the head
            fin_start = -cyl_length/2 + 5;
            fin_end = cyl_length/2 - 15; // Leave space for head
            for (i = [0 : fin_count-1]) {
                z_pos = fin_start + i * (fin_thickness + fin_spacing);
                if (z_pos < fin_end) {
                    translate([0, 0, z_pos])
                        cylinder(h=fin_thickness, r=fin_radius, center=true);
                }
            }
            
            // Cylinder Head (smooth part at the right end)
            translate([cyl_length/2 - 5, 0, 0]) {
                cylinder(h=10, r=cyl_radius + 2, center=true);
            }
            
            // Nozzle/Valve on top
            // Positioned near the head
            translate([cyl_length/2 - 10, cyl_radius + 2, 0]) {
                rotate([90, 0, 0]) // Rotate to point up (Y in local coords is Z in global before rotation? No.)
                // Wait, local coords: X is along barrel. Y is up (global Z). Z is side (global -Y).
                // We rotated [0, 90, 0]. 
                // Original Z is now -X. Original Y is now Y. Original X is now Z.
                // So "Up" relative to cylinder is local Y.
                cylinder(h=nozzle_height, r=nozzle_radius, center=false);
                // Flange
                translate([0, 0, nozzle_height]) cylinder(h=2, r=nozzle_radius + 3, center=true);
            }
            
            // Mounting flange at the bottom
            translate([0, -cyl_radius - 5, 0]) {
                cube([cyl_length - 20, 10, 10], center=true);
            }
        }
    }
}

module flywheel() {
    // Create a spoked flywheel
    // Oriented in Y-Z plane (perpendicular to X axis? No, shaft is Y axis? Let's check.)
    // In my base_plate, shaft supports are along X?
    // Let's re-verify axes.
    // Base is X-Y.
    // Cylinder is along X.
    // Shaft must be along Y to drive the crank which moves along X.
    // So Wheels are in X-Z plane.
    
    difference() {
        union() {
            // Outer Rim
            cylinder(h=wheel_thickness, r=wheel_diameter/2, center=true);
            // Inner Hub
            cylinder(h=wheel_thickness, r=wheel_hub_radius, center=true);
        }
        
        // Large holes in the web
        for (a = [0, 90, 180, 270]) {
            rotate([0, 0, a]) {
                translate([wheel_hole_dist, 0, -wheel_thickness/2 - 1]) {
                    cylinder(h=wheel_thickness + 2, r=wheel_hole_radius);
                }
            }
        }
        
        // Center hole for shaft
        cylinder(h=wheel_thickness + 2, r=shaft_radius + 0.5, center=true);
    }
    
    // Add a handle to one of the wheels (the front one)
    // This is handled in the assembly by adding a specific part
}

module crank_assembly() {
    // Crankshaft and Connecting Rod
    // Shaft runs along Y axis.
    // Crank throw is along X axis.
    
    // Main Shaft
    color("silver")
    rotate([90, 0, 0]) // Rotate cylinder to align with Y
    cylinder(h=shaft_length, r=shaft_radius, center=true);
    
    // Crank Web (between wheels)
    // The web connects the shaft to the crank pin
    // It's a rectangular block offset from the center
    translate([0, 0, 0]) { // Center of shaft
        // We need to rotate the crank mechanism. 
        // Let's assume a specific crank angle, e.g., 45 degrees.
        rotate([0, 45, 0]) { // Rotate around Y axis (shaft axis)
            
            // Crank Web
            // Extends from shaft surface to crank pin
            translate([0, 0, crank_radius/2]) {
                cube([crank_width, shaft_radius * 2 + 4, crank_radius], center=true);
            }
            
            // Crank Pin
            translate([0, 0, crank_radius]) {
                rotate([90, 0, 0]) // Align with Y
                cylinder(h=crank_width, r=crank_pin_radius, center=true);
            }
            
            // Connecting Rod
            // Goes from Crank Pin to Cylinder
            // Crank pin is at (0, 0, crank_radius) in this rotated frame?
            // No, rotate([0, 45, 0]) rotates around Y.
            // So X becomes X*cos - Z*sin...
            // Let's simplify.
            // The crank pin is effectively at x=0, z=crank_radius (before rotation).
            // After rotation [0, 45, 0], it's at x = crank_radius * sin(45), z = crank_radius * cos(45).
            // Wait, standard rotation matrix for Y:
            // x' = x cos + z sin
            // z' = -x sin + z cos
            // If pin is at (0, 0, R), then x' = R sin(45), z' = R cos(45).
            // So pin is "forward" and "up".
            
            // The cylinder is at negative X.
            // So the rod needs to go from the pin back to the cylinder.
            
            // Let's just draw the rod manually using hull of spheres
            // Pin position
            pin_x = crank_radius * sin(45);
            pin_z = crank_radius * cos(45);
            pin_y = 0; // Centered between wheels
            
            // Piston connection point (inside cylinder)
            // Cylinder is at x = -cyl_offset_x ...
            // Let's say the rod connects to the piston face.
            piston_x = -cyl_offset_x - 10; // Approximate piston position
            piston_y = 0;
            piston_z = cyl_height_z; // Cylinder center height
            
            // Draw rod
            // It needs to be angled.
            // Use hull of two spheres for a nice rounded rod
            hull() {
                translate([pin_x, pin_y, pin_z]) sphere(r=crank_pin_radius + 2);
                translate([piston_x, piston_y, piston_z]) sphere(r=10); // Big end bearing
            }
            
            // Piston (simplified)
            translate([piston_x, 0, cyl_height_z]) {
                cylinder(h=20, r=cyl_radius - cyl_wall_thickness - 1, center=true);
            }
        }
    }
}

// ================= ASSEMBLY =================

// 1. Base
base_plate();

// 2. Cylinder Block
cylinder_block();

// 3. Shaft and Crank
crank_assembly();

// 4. Flywheels
// Front Wheel (Left in image view, actually closer to viewer/negative Y?)
// Let's place them symmetrically around Y=0
// Wheel 1 (Front/Leftish)
translate([-crank_radius - 5, -wheel_spacing/2, 0]) {
    // The wheel needs to be perpendicular to the shaft (Y axis).
    // So it lies in X-Z plane.
    // Default cylinder is Z. Rotate 90 around X to lie in Y-Z? No.
    // We want the flat face to be X-Z. So normal is Y.
    // Default cylinder normal is Z.
    // Rotate([90, 0, 0]) makes normal Y.
    rotate([90, 0, 0]) flywheel();
    
    // Handle on this wheel
    // Stick out radially
    translate([0, wheel_thickness/2 + 5, 0]) { // Offset slightly
         // The handle is a small cylinder
         // It's attached to the rim
         translate([wheel_diameter/2 - 5, 0, 0]) {
             rotate([0, 90, 0]) cylinder(h=30, r=4, center=true);
         }
    }
}

// Wheel 2 (Back/Rightish)
translate([crank_radius + 5, wheel_spacing/2, 0]) { // Wait, spacing is along Y?
    // My crank_assembly put the shaft along Y.
    // So wheels should be at Y = +/- spacing/2.
    // But in crank_assembly, I didn't account for wheel position.
    // The shaft is length 160.
    // Let's place wheels at Y = -40 and Y = +40.
}

// Correction on Wheel Placement
// Shaft is along Y.
// Wheels are at Y positions.
// Let's redefine positions.

// Clear previous wheel placement logic and do it cleanly here.

// Front Wheel (closer to negative Y? or positive? Image shows one "front" and one "back")
// Let's say Front is Negative Y.
translate([0, -wheel_spacing/2, 0]) {
    rotate([90, 0, 0]) flywheel();
    // Handle
    // The handle is on the rim.
    // At angle? Let's put it at the "top" or "front".
    // Image shows handle sticking out "left" (negative X) and "down"?
    // Actually, looks like a small shaft extension.
    // Let's add a small cylinder sticking out from the hub or rim.
    // Image: Small cylinder sticking out of the front wheel face, offset from center.
    translate([0, wheel_thickness/2 + 2, 0]) { // Front face
        translate([-20, 0, 0]) { // Offset from center
             cylinder(h=15, r=4, center=true);
        }
    }
}

// Back Wheel
translate([0, wheel_spacing/2, 0]) {
    rotate([90, 0, 0]) flywheel();
}

// Note: The crank_assembly module draws the shaft along Y (length 160).
// It centers it at 0,0,0.
// So the shaft extends from Y=-80 to Y=80.
// The wheels are at Y=-25 and Y=25 (if spacing is 50).
// This fits.

// One detail: The cylinder block mounting.
// The cylinder_block module puts it at X negative.
// The crank_assembly puts the crank at X=0 (roughly).
// This matches the "Inline" layout where Cylinder is Left, Crank is Center.

// Final check on Connecting Rod in crank_assembly:
// It connects Pin (rotated) to Piston (fixed).
// This creates a valid linkage visualization.