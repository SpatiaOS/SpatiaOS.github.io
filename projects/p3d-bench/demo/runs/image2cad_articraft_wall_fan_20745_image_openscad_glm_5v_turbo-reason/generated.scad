// Wall-Mounted Fan Model - Parametric OpenSCAD Design
// All dimensions in millimeters

// ============================================
// PARAMETERS
// ============================================

// Fan Head Parameters
fan_diameter = 100;          // Outer diameter of fan grille
fan_height = 12;             // Thickness of fan assembly
grille_ring_count = 6;       // Number of concentric rings
grille_spoke_count = 24;     // Number of radial spokes

// Motor Housing Parameters
motor_diameter = 42;         // Diameter of cylindrical motor housing
motor_height = 48;           // Height of motor housing
motor_top_diameter = 38;     // Slightly smaller top diameter

// Arm/Bracket Parameters
arm_length = 70;             // Length of connecting arm
arm_base_diameter = 26;      // Diameter at motor end
arm_tip_diameter = 18;       // Diameter at mounting plate end
hinge_width = 20;            // Width of hinge bracket
hinge_height = 16;           // Height of hinge bracket

// Mounting Plate Parameters
plate_diameter = 90;         // Diameter of wall mounting plate
plate_thickness = 8;         // Thickness of plate
plate_curvature = 5;         // Slight dome curvature

// Global Resolution
$fn = 64;                    // Smoothness of curves

// ============================================
// MODULES
// ============================================

// Fan Grille Assembly
module fan_grille() {
    difference() {
        // Main fan body (solid disk)
        cylinder(h=fan_height, d=fan_diameter, center=true);
        
        // Create grille pattern by subtracting material
        // Concentric rings (cutouts)
        for (i = [1 : grille_ring_count]) {
            ring_diameter = fan_diameter * (i / (grille_ring_count + 1));
            ring_thickness = 3;
            translate([0, 0, 0])
                difference() {
                    cylinder(h=fan_height + 1, d=ring_diameter, center=true);
                    cylinder(h=fan_height + 2, d=ring_diameter - ring_thickness, center=true);
                }
        }
        
        // Radial spokes (cutouts creating the grid pattern)
        for (i = [0 : grille_spoke_count - 1]) {
            rotate([0, 0, i * (360 / grille_spoke_count)])
                translate([fan_diameter/4, 0, 0])
                    cube([fan_diameter/2, 2.5, fan_height + 2], center=true);
        }
        
        // Center hub area (solid)
        cylinder(h=fan_height + 1, d=fan_diameter * 0.18, center=true);
    }
    
    // Outer rim (thicker edge)
    difference() {
        cylinder(h=fan_height, d=fan_diameter, center=true);
        cylinder(h=fan_height + 1, d=fan_diameter - 4, center=true);
    }
}

// Motor Housing
module motor_housing() {
    // Main body - slightly tapered cylinder
    cylinder(h=motor_height, d1=motor_diameter, d2=motor_top_diameter);
    
    // Top cap detail
    translate([0, 0, motor_height])
        cylinder(h=4, d=motor_top_diameter);
    
    // Control panel details on top
    translate([0, 0, motor_height + 3])
        difference() {
            cylinder(h=2, d=motor_top_diameter - 4);
            // Ventilation slots
            for (i = [0 : 8]) {
                rotate([0, 0, i * 20])
                    translate([8, 0, 0])
                        cube([10, 1.5, 3], center=true);
            }
            // Switch slot
            translate([0, -4, 0])
                cube([8, 4, 3], center=true);
        }
    
    // Base flange where it connects to fan
    translate([0, 0, -2])
        difference() {
            cylinder(h=4, d=motor_diameter + 6);
            cylinder(h=5, d=motor_diameter - 2);
        }
}

// Connecting Arm
module connecting_arm() {
    // Tapered arm using hull between two cylinders
    hull() {
        // Base end (at motor)
        translate([0, 0, 0])
            cylinder(h=hinge_height, d=arm_base_diameter, center=true);
        
        // Tip end (at mounting plate)
        translate([arm_length, 0, arm_length * 0.35])
            cylinder(h=10, d=arm_tip_diameter, center=true);
    }
}

// Hinge Bracket (connects arm to motor)
module hinge_bracket() {
    // Main bracket body
    translate([-5, 0, 0])
        difference() {
            // Bracket shell
            union() {
                cube([hinge_width, hinge_height, hinge_height], center=true);
                
                // Pivot ears
                translate([0, hinge_height/2 + 3, 0])
                    cube([hinge_width - 4, 6, hinge_height - 4], center=true);
            }
            
            // Cutout for pivot pin
            rotate([0, 90, 0])
                cylinder(h=hinge_width + 2, d=6, center=true);
            
            // Internal clearance
            cube([hinge_width - 8, hinge_height - 4, hinge_height - 4], center=true);
        }
    
    // Pivot pin
    rotate([0, 90, 0])
        cylinder(h=hinge_width + 10, d=5, center=true);
}

// Wall Mounting Plate
module mounting_plate() {
    // Domed plate using sphere intersection or scaled cylinder
    translate([arm_length, 0, arm_length * 0.35 + plate_thickness/2])
        difference() {
            // Main plate with slight curvature
            scale([1, 1, plate_curvature / (plate_diameter/2)])
                sphere(d=plate_diameter);
            
            // Flatten back slightly for wall contact
            translate([0, 0, -plate_thickness])
                cube([plate_diameter + 2, plate_diameter + 2, plate_thickness * 2], center=true);
        }
    
    // Neck connection to arm
    translate([arm_length, 0, arm_length * 0.35])
        cylinder(h=15, d=arm_tip_diameter + 4);
}

// Support struts (thin wires visible in image)
module support_struts() {
    // Two thin support wires
    strut_start = [arm_length * 0.7, 0, arm_length * 0.25];
    strut_end = [arm_length * 0.9, 0, arm_length * 0.45];
    
    for (offset = [-12, 12]) {
        hull() {
            translate(strut_start + [0, offset, 0])
                sphere(d=1.5);
            translate(strut_end + [0, offset * 1.5, 0])
                sphere(d=1.5);
        }
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Fan head at origin
    color("lightgray")
        fan_grille();
    
    // Motor housing on top of fan
    color("silver")
        translate([0, 0, fan_height/2 + motor_height/2 - 2])
            motor_housing();
    
    // Hinge bracket attached to side of motor
    color("gray")
        translate([motor_diameter/2 + 5, 0, fan_height/2 + motor_height/2 - 10])
            rotate([0, 0, -15])
                hinge_bracket();
    
    // Connecting arm
    color("lightsteelblue")
        translate([motor_diameter/2 + hinge_width/2, 0, fan_height/2 + motor_height/2 - 10])
            rotate([0, 20, 0])
                connecting_arm();
    
    // Mounting plate
    color("gainsboro")
        translate([motor_diameter/2 + hinge_width/2, 0, fan_height/2 + motor_height/2 - 10])
            rotate([0, 20, 0])
                mounting_plate();
    
    // Support struts
    color("darkgray")
        translate([motor_diameter/2 + hinge_width/2, 0, fan_height/2 + motor_height/2 - 10])
            rotate([0, 20, 0])
                support_struts();
}