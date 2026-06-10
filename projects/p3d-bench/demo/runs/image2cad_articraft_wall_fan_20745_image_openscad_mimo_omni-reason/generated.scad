// Microwave Antenna Assembly - OpenSCAD Model
// Based on visual analysis of the reference image

// ==================== PARAMETERS ====================

// Base grille dimensions
base_diameter = 180;        // Overall diameter of the base grille
base_rim_height = 12;       // Height of the outer rim
base_rim_width = 8;         // Width of the rim wall
fin_count = 48;             // Number of radial fins
fin_height = 15;            // Height of each fin
fin_thickness = 2;          // Thickness of each fin
hub_diameter = 55;          // Central hub diameter
hub_height = 8;             // Height of central hub plate

// Central cylinder dimensions
cylinder_diameter = 65;     // Diameter of the central housing
cylinder_height = 55;       // Height of the central housing
top_cap_height = 5;         // Thickness of top cap
vent_slot_count = 12;       // Number of ventilation slots on top
vent_slot_width = 2;        // Width of ventilation slots
vent_slot_length = 15;      // Length of ventilation slots

// Arm/bracket dimensions
arm_length = 100;           // Length of the connecting arm
arm_width = 22;             // Width of the arm
arm_height = 18;            // Height of the arm
hinge_diameter = 14;        // Diameter of the hinge pivot
hinge_width = 10;           // Width of hinge ears
mount_plate_width = 30;     // Width of mounting plate on cylinder

// Dish/reflector dimensions
dish_diameter = 150;        // Diameter of the dish
dish_depth = 50;            // Depth/height of the parabolic dish
dish_thickness = 3;         // Wall thickness of dish
neck_base_diameter = 35;    // Diameter of neck at dish end
neck_tip_diameter = 22;     // Diameter of neck at arm end
neck_length = 45;           // Length of the tapered neck

// Support rod
rod_diameter = 4;           // Diameter of support rod
rod_length = 70;            // Length of support rod
rod_offset_angle = 25;      // Angle of rod from dish axis

// View settings
show_base = true;
show_cylinder = true;
show_arm = true;
show_dish = true;
show_rod = true;

// Resolution
$fn = 80;

// ==================== MODULES ====================

// Base grille with radial fins and central hub
module base_grille() {
    difference() {
        union() {
            // Outer rim ring
            difference() {
                cylinder(h = base_rim_height, d = base_diameter);
                cylinder(h = base_rim_height + 1, d = base_diameter - 2 * base_rim_width);
            }
            
            // Inner support ring
            translate([0, 0, base_rim_height - 4])
            difference() {
                cylinder(h = 4, d = hub_diameter + 30);
                cylinder(h = 5, d = hub_diameter + 5);
            }
            
            // Radial fins connecting hub to outer rim
            for (i = [0 : fin_count - 1]) {
                rotate([0, 0, i * 360 / fin_count])
                translate([hub_diameter / 2, -fin_thickness / 2, 0])
                cube([base_diameter / 2 - hub_diameter / 2 - base_rim_width, fin_thickness, fin_height]);
            }
            
            // Central hub plate
            cylinder(h = hub_height, d = hub_diameter);
            
            // Hub reinforcement ring
            translate([0, 0, hub_height - 2])
            cylinder(h = 2, d = hub_diameter + 8);
        }
        
        // Central mounting hole for cylinder
        translate([0, 0, -1])
        cylinder(h = hub_height + 2, d = cylinder_diameter - 6);
    }
}

// Central cylindrical housing
module central_cylinder() {
    difference() {
        union() {
            // Main cylinder body
            cylinder(h = cylinder_height, d = cylinder_diameter);
            
            // Top cap with slight overhang
            translate([0, 0, cylinder_height])
            cylinder(h = top_cap_height, d = cylinder_diameter + 4);
            
            // Bottom mounting flange
            cylinder(h = 6, d = cylinder_diameter + 8);
        }
        
        // Top ventilation slots
        for (i = [0 : vent_slot_count - 1]) {
            rotate([0, 0, i * 360 / vent_slot_count])
            translate([10, -vent_slot_width / 2, cylinder_height - 1])
            cube([vent_slot_length, vent_slot_width, top_cap_height + 2]);
        }
        
        // Side rectangular opening
        translate([cylinder_diameter / 2 - 2, -12, 15])
        cube([8, 24, 20]);
        
        // Top keyhole/slot feature
        translate([0, 0, cylinder_height - 1])
        hull() {
            cylinder(h = top_cap_height + 2, d = 12);
            translate([15, 0, 0])
            cylinder(h = top_cap_height + 2, d = 8);
        }
    }
}

// Arm assembly with hinge pivots
module arm_assembly() {
    union() {
        // Main arm body
        cube([arm_length, arm_width, arm_height], center = false);
        
        // Hinge pivot at cylinder end (with mounting plate)
        translate([0, arm_width / 2, arm_height / 2])
        rotate([0, 90, 0]) {
            // Mounting plate
            cylinder(h = 6, d = mount_plate_width);
            // Hinge ear
            translate([0, 0, -hinge_width / 2])
            cylinder(h = hinge_width, d = hinge_diameter);
        }
        
        // Hinge pivot at dish end
        translate([arm_length, arm_width / 2, arm_height / 2])
        rotate([0, 90, 0]) {
            cylinder(h = 6, d = mount_plate_width);
            translate([0, 0, -hinge_width / 2])
            cylinder(h = hinge_width, d = hinge_diameter);
        }
        
        // Reinforcement ribs near hinges
        for (x_pos = [10, arm_length - 16]) {
            translate([x_pos, 0, 0])
            hull() {
                cube([6, arm_width, 2]);
                translate([3, arm_width / 2, arm_height / 2])
                rotate([0, 90, 0])
                cylinder(h = 6, d = arm_height - 2);
            }
        }
    }
}

// Parabolic dish reflector
module dish_reflector() {
    union() {
        // Parabolic dish using rotation
        rotate_extrude(convexity = 10)
        translate([dish_diameter / 2 - dish_thickness, 0, 0])
        hull() {
            // Outer profile points for parabolic shape
            square([dish_thickness, 0.1]);
            translate([-(dish_diameter / 2 - dish_thickness) * 0.7, dish_depth * 0.95, 0])
            square([dish_thickness, 0.1]);
            translate([-(dish_diameter / 2 - dish_thickness), dish_depth, 0])
            square([dish_thickness, 0.1]);
        }
        
        // Simplified dish using hull for parabolic profile
        difference() {
            // Outer dish surface
            hull() {
                for (r = [0 : 5 : dish_diameter / 2 - 10]) {
                    t = r / (dish_diameter / 2);
                    h = dish_depth * (1 - pow(1 - t, 1.5));
                    translate([0, 0, h])
                    cylinder(h = 0.1, d = r * 2 + dish_thickness);
                }
            }
            // Inner dish surface (subtract)
            hull() {
                for (r = [0 : 5 : dish_diameter / 2 - 10 - dish_thickness]) {
                    t = r / (dish_diameter / 2);
                    h = dish_depth * (1 - pow(1 - t, 1.5)) + dish_thickness;
                    translate([0, 0, h])
                    cylinder(h = 0.1, d = r * 2);
                }
            }
        }
        
        // Central hub at dish back
        translate([0, 0, dish_depth])
        cylinder(h = 10, d = neck_base_diameter + 10);
    }
}

// Tapered neck connecting dish to arm
module dish_neck() {
    difference() {
        // Tapered cylinder
        cylinder(h = neck_length, d1 = neck_base_diameter, d2 = neck_tip_diameter);
        
        // Hollow interior
        translate([0, 0, -1])
        cylinder(h = neck_length + 2, d1 = neck_base_diameter - 6, d2 = neck_tip_diameter - 4);
    }
    
    // Transition collar at dish end
    cylinder(h = 8, d = neck_base_diameter + 6);
    
    // Transition collar at arm end
    translate([0, 0, neck_length - 6])
    cylinder(h = 8, d = neck_tip_diameter + 4);
}

// Support rod
module support_rod() {
    cylinder(h = rod_length, d = rod_diameter);
    
    // Small end cap
    translate([0, 0, rod_length])
    sphere(d = rod_diameter + 2);
}

// ==================== MAIN ASSEMBLY ====================

module main_assembly() {
    // Base grille - positioned at origin
    if (show_base) {
        color("Silver", 0.9)
        base_grille();
    }
    
    // Central cylinder - mounted on top of base
    if (show_cylinder) {
        color("LightGray", 0.9)
        translate([0, 0, hub_height])
        central_cylinder();
    }
    
    // Arm assembly - attached to cylinder side, angled upward
    if (show_arm) {
        color("DimGray", 0.9)
        translate([cylinder_diameter / 2 - 5, -arm_width / 2, 25])
        rotate([0, 15, 0])  // Slight upward angle
        arm_assembly();
    }
    
    // Dish assembly - at end of arm
    if (show_dish) {
        // Calculate dish position based on arm angle
        arm_end_x = cylinder_diameter / 2 - 5 + arm_length * cos(15);
        arm_end_z = 25 + arm_length * sin(15);
        
        color("Gainsboro", 0.95)
        translate([arm_end_x + 10, 0, arm_end_z + 15])
        rotate([0, -75, 0])  // Dish faces outward
        union() {
            dish_reflector();
            
            // Neck extending from dish back
            translate([0, 0, -neck_length])
            dish_neck();
        }
        
        // Support rod from dish to arm
        if (show_rod) {
            color("Gray", 0.8)
            translate([arm_end_x - 15, 0, arm_end_z + 5])
            rotate([0, -rod_offset_angle, 0])
            support_rod();
        }
    }
}

// Render the complete assembly
main_assembly();

// ==================== NOTES ====================
// - Dimensions estimated from visual proportions
// - Base diameter ~180mm (typical industrial size)
// - Model represents a microwave feed horn antenna assembly
// - Adjust parameters above to modify dimensions
// - Use F5 to preview, F6 to render, F7 to export STL