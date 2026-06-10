/* 
   Wall-Mounted Fan 3D Model
   A fully parametric, manifold OpenSCAD script recreating the fan from the image.
   Optimized to prevent STL export timeouts by replacing expensive hull() operations 
   with direct mathematical cylinder placements.
*/

// ==========================================
// PARAMETERS
// ==========================================

// Global Resolution
$fn = 64;
wire_fn = 8; // Lower resolution for thin wires to heavily speed up rendering

// Motor Dimensions
motor_dia = 80;
motor_height = 80;

// Fan Grille Dimensions
cage_dia = 240;
cage_depth = 35; // Depth of one half of the cage
wire_thickness = 2;

// Arm Dimensions
arm_length = 140;
arm_dia_start = 25;
arm_dia_end = 35;

// Wall Base Dimensions
base_dia = 180;
base_depth = 50;

// ==========================================
// MAIN ASSEMBLY
// ==========================================

// Pose angles to match the image reference
arm_angle = 15;
motor_tilt = -35;

// Build the assembly starting from the hinge
rotate([arm_angle, 0, 0]) {
    wall_mount_assembly();
}

rotate([motor_tilt, 0, 0]) {
    // Offset motor so its hinge tab aligns with the origin
    translate([0, -motor_dia/2 - 12, -motor_height/4]) {
        motor_unit();
        
        // Place the fan and grille at the front (bottom) of the motor
        translate([0, 0, -motor_height/2 - cage_depth - 10]) {
            fan_propeller();
            grille_assembly();
        }
    }
}

// ==========================================
// MODULES
// ==========================================

// Helper module to draw a fast cylinder between two points (replaces slow hull operations)
module line(p1, p2, width) {
    v = p2 - p1;
    distance = norm(v);
    // Calculate rotations to point the cylinder from p1 to p2
    theta = acos(v[2] / distance);
    phi = atan2(v[1], v[0]);
    
    translate(p1)
        rotate([0, 0, phi])
        rotate([0, theta, 0])
        cylinder(h=distance, d=width, center=false, $fn=wire_fn);
}

module wall_mount_assembly() {
    // Hinge U-Bracket
    difference() {
        translate([0, -15, 0]) 
            cube([34, 30, 30], center=true);
        // Inner cutout for motor tab
        translate([0, -15, 0]) 
            cube([20.5, 35, 35], center=true);
        // Pivot bolt hole
        rotate([0, 90, 0]) 
            cylinder(d=10.5, h=40, center=true, $fn=32);
        // Taper back to match arm
        translate([0, -35, 0])
            cube([40, 20, 40], center=true);
    }
    
    // Bolt and Nut details
    translate([-17, 0, 0]) 
        rotate([0, 90, 0]) 
        cylinder(d=14, h=4, center=true, $fn=32); // Bolt head
    translate([17, 0, 0]) 
        rotate([0, 90, 0]) 
        cylinder(d=16, h=5, $fn=6, center=true); // Hex nut

    // Main Support Arm
    translate([0, -arm_length/2 - 20, 0])
        rotate([90, 0, 0])
        cylinder(d1=arm_dia_start, d2=arm_dia_end, h=arm_length, center=true, $fn=64);

    // Flared Wall Base
    translate([0, -arm_length - 20, 0])
        rotate([-90, 0, 0]) {
            difference() {
                // Smooth flared trumpet shape
                rotate_extrude($fn=64) {
                    polygon([
                        [0, 0],
                        [base_dia/2, 0],
                        [base_dia/2 - 5, 10],
                        [arm_dia_end/2 + 10, base_depth],
                        [arm_dia_end/2, base_depth],
                        [0, base_depth]
                    ]);
                }
                // Hollow out the back to save material
                translate([0, 0, -1]) 
                    cylinder(d=base_dia-20, h=15, $fn=64);
            }
        }

    // Side Support Wires (Antenna-like rods)
    wire_start_y = -arm_length * 0.4;
    wire_end_y = -arm_length - 15;
    
    // Right wire
    line(
        [arm_dia_start/2 + 2, wire_start_y, 0],
        [base_dia/2 - 20, wire_end_y, 0],
        3
    );
    // Left wire
    line(
        [-arm_dia_start/2 - 2, wire_start_y, 0],
        [-base_dia/2 + 20, wire_end_y, 0],
        3
    );
}

module motor_unit() {
    // Main cylindrical housing
    cylinder(d=motor_dia, h=motor_height, center=true, $fn=64);

    // Top Cap and Details
    translate([0, 0, motor_height/2]) {
        // Raised plateau for vents and switch
        difference() {
            cylinder(d=motor_dia - 10, h=4, center=true, $fn=64);
            
            // Ventilation slots (back half)
            for(x = [-20 : 6 : 20]) {
                translate([x, 15, 0]) 
                    cube([3, 25, 10], center=true);
            }
        }
        
        // Switch plate and slider
        translate([0, -15, 2]) {
            cube([16, 24, 2], center=true); // Plate
            translate([0, -4, 1.5]) 
                cube([8, 8, 3], center=true); // Slider button
        }
    }

    // Bottom mount connecting to the grille
    translate([0, 0, -motor_height/2 - 5])
        cube([35, 35, 10], center=true);

    // Hinge Mount Tab (Back)
    translate([0, motor_dia/2 + 12, motor_height/4]) {
        difference() {
            // Tab body with rounded end
            hull() {
                translate([0, -10, 0]) cube([20, 20, 30], center=true);
                rotate([0, 90, 0]) cylinder(d=30, h=20, center=true, $fn=32);
            }
            // Pivot hole
            rotate([0, 90, 0]) 
                cylinder(d=10.5, h=25, center=true, $fn=32);
        }
    }
}

module grille_assembly() {
    // Front half
    grille_half(is_front=true);
    // Back half
    grille_half(is_front=false);
    
    // Outer rim wire where halves meet
    rotate_extrude($fn=64) 
        translate([cage_dia/2, 0, 0]) 
        circle(d=wire_thickness, $fn=wire_fn);
        
    // Outer binding band connecting the two halves
    difference() {
        cylinder(d=cage_dia + 4, h=12, center=true, $fn=64);
        cylinder(d=cage_dia - 2, h=14, center=true, $fn=64);
    }
    
    // Front center logo plate
    translate([0, 0, -cage_depth - 2])
        cylinder(d=40, h=4, center=true, $fn=32);
}

module grille_half(is_front) {
    z_dir = is_front ? -1 : 1;

    // Radial ribs (converging from outer rim to the front/back center face)
    for(a = [0 : 10 : 350]) {
        rotate([0, 0, a])
        line(
            [20, 0, z_dir * cage_depth], // Center flat face
            [cage_dia/2, 0, 0],          // Outer rim
            wire_thickness
        );
    }

    // Concentric rings forming the dome
    for(r = [40 : 25 : cage_dia/2 - 10]) {
        // Linearly interpolate Z to match the straight radial ribs perfectly
        z_offset = z_dir * cage_depth * (cage_dia/2 - r) / (cage_dia/2 - 20);
        
        translate([0, 0, z_offset])
            rotate_extrude($fn=64) 
            translate([r, 0, 0]) 
            circle(d=wire_thickness, $fn=wire_fn);
    }
}

module fan_propeller() {
    // Center Hub
    cylinder(d=35, h=25, center=true, $fn=32);
    
    // Dome nut on front of hub
    translate([0, 0, -12.5])
        sphere(d=15, $fn=32);

    // Fan Blades
    num_blades = 5;
    for(i = [0 : 360/num_blades : 359]) {
        rotate([0, 0, i])
        translate([15, 0, 0])
        rotate([25, 0, 0]) // Blade pitch angle
        linear_extrude(height=2, center=true, convexity=2)
        // Blade profile
        hull() {
            circle(d=25, $fn=32);
            translate([cage_dia/2 - 47.5, 15]) 
                circle(d=45, $fn=32);
        }
    }
}