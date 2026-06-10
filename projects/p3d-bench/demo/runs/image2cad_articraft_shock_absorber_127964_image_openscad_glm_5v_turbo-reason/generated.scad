// Shock Absorber / Spring Damper Assembly
// Parametric OpenSCAD Model

/* [Main Dimensions] */
overall_height = 80;          // Total height of assembly
spring_outer_dia = 22;        // Outer diameter of coil spring
spring_wire_dia = 2.5;        // Wire thickness of spring
spring_coils = 6;             // Number of active coils
central_rod_dia = 8;          // Diameter of inner piston rod

/* [Gear Parameters] */
gear_teeth = 12;              // Number of teeth on adjustment gear
gear_outer_dia = 28;          // Outer diameter of gear
gear_height = 6;              // Height/thickness of gear
gear_hub_dia = 12;            // Hub diameter where it connects

/* [Mounting Eyes] */
eye_outer_dia = 10;           // Outer diameter of mounting eye
eye_hole_dia = 4.5;           // Hole diameter in mounting eye
eye_width = 8;                // Width of eye (thickness)

/* [Top Assembly] */
top_body_dia = 14;            // Diameter of top cylindrical body
top_body_height = 12;         // Height of top body above gear
top_cap_radius = 3;           // Radius of rounded cap on top

/* [Bottom Assembly] */
bottom_flange_dia = 24;       // Diameter of bottom flange plate
bottom_flange_thickness = 3;  // Thickness of flange
bottom_body_dia = 12;         // Diameter of bottom body
bottom_body_height = 10;      // Height of bottom body below flange

/* [Resolution] */
$fn = 60;                     // Global resolution for smooth curves

// ============================================================
// MODULE DEFINITIONS
// ============================================================

// Mounting Eye Module - Used for both top and bottom connections
module mounting_eye(outer_dia, hole_dia, width) {
    difference() {
        // Main eye body
        rotate([90, 0, 0]) 
            cylinder(h=width, d=outer_dia, center=true);
        // Through hole
        rotate([90, 0, 0]) 
            cylinder(h=width+1, d=hole_dia, center=true);
    }
}

// Gear/Cog Wheel Module - Adjustment mechanism
module gear_wheel(teeth, outer_dia, height, hub_dia) {
    tooth_height = (outer_dia - hub_dia) / 2;
    tooth_width = PI * hub_dia / (teeth * 2);
    
    union() {
        // Base cylinder (hub area)
        cylinder(h=height, d=hub_dia, center=true);
        
        // Teeth around perimeter
        for (i = [0 : teeth-1]) {
            rotate([0, 0, i * (360 / teeth)])
                translate([hub_dia/2 + tooth_height/2, 0, 0])
                    cube([tooth_height, tooth_width, height], center=true);
        }
    }
}

// Helical Spring Module - Coil spring around central rod
module helical_spring(outer_dia, wire_dia, coils, height) {
    pitch = height / coils;                    // Distance between coils
    mean_dia = outer_dia - wire_dia;           // Mean diameter of coil
    
    // Create spring using helical extrusion approach
    translate([0, 0, -height/2])
        linear_extrude(height=height, twist=coils*360, convexity=10)
            translate([mean_dia/2, 0, 0])
                circle(d=wire_dia);
}

// Top Assembly Module - Upper mounting with gear
module top_assembly() {
    union() {
        // Top cap (rounded)
        translate([0, 0, top_body_height + gear_height/2 + top_cap_radius - 0.5])
            sphere(r=top_cap_radius);
        
        // Main cylindrical body
        cylinder(h=top_body_height, d=top_body_dia);
        
        // Offset mounting eye on side
        translate([top_body_dia/2 + eye_outer_dia/2 - 1, 0, top_body_height - 3])
            mounting_eye(eye_outer_dia, eye_hole_dia, eye_width);
        
        // Gear wheel
        translate([0, 0, -gear_height/2])
            gear_wheel(gear_teeth, gear_outer_dia, gear_height, gear_hub_dia);
    }
}

// Bottom Assembly Module - Lower mounting with flange
module bottom_assembly() {
    union() {
        // Bottom flange plate
        cylinder(h=bottom_flange_thickness, d=bottom_flange_dia);
        
        // Lower body cylinder
        translate([0, 0, -bottom_body_height])
            cylinder(h=bottom_body_height, d=bottom_body_dia);
        
        // Bottom mounting eye (perpendicular to top)
        translate([bottom_body_dia/2 + eye_outer_dia/2 - 1, 0, -bottom_body_height + 3])
            rotate([0, 90, 0])
                mounting_eye(eye_outer_dia, eye_hole_dia, eye_width);
        
        // Small detail bump on flange edge
        translate([bottom_flange_dia/2 - 2, 0, bottom_flange_thickness/2])
            sphere(d=3);
    }
}

// Central Rod/Piston Module
module central_rod(dia, height) {
    cylinder(h=height, d=dia, center=true);
}

// ============================================================
// MAIN ASSEMBLY
// ============================================================

union() {
    // Calculate spring height based on overall dimensions
    spring_height = overall_height - top_body_height - gear_height 
                    - bottom_flange_thickness - bottom_body_height - 4;
    
    // Position and assemble all components
    
    // Top assembly (positioned at top)
    translate([0, 0, spring_height/2 + top_body_height/2 + gear_height/2 + 1])
        top_assembly();
    
    // Helical spring (centered)
    helical_spring(spring_outer_dia, spring_wire_dia, spring_coils, spring_height);
    
    // Central rod inside spring
    central_rod(central_rod_dia, spring_height - 4);
    
    // Bottom assembly (positioned at bottom)
    translate([0, 0, -spring_height/2 - bottom_flange_thickness/2 - bottom_body_height/2 - 1])
        bottom_assembly();
}