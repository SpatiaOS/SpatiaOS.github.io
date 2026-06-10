// Toy Bulldozer Model - Parametric OpenSCAD Code
// All dimensions in millimeters

// ============================================
// PARAMETERS
// ============================================

// Global resolution
$fn = 60;

// Main body dimensions
body_length = 80;
body_width = 45;
body_height = 18;

// Cabin dimensions
cabin_width = 32;
cabin_depth = 28;
cabin_height = 26;
cabin_wall = 3;
window_width = 10;
window_height = 14;

// Wheel parameters
wheel_diameter = 28;
wheel_width = 16;
wheel_hub_diameter = 12;
wheel_teeth_count = 12;
wheel_tooth_depth = 3;
wheel_axle_diameter = 5;

// Blade parameters
blade_width = 55;
blade_height = 32;
blade_depth = 8;
blade_angle = 75; // degrees from horizontal

// Track/frame under body
track_height = 8;

// Exhaust pipe
exhaust_diameter = 6;
exhaust_height = 14;

// Arm/hydraulic linkage
arm_width = 8;
arm_thickness = 4;

// ============================================
// MODULES
// ============================================

// Module: Treaded wheel with gear-like pattern
module treaded_wheel() {
    difference() {
        // Base wheel cylinder
        cylinder(h=wheel_width, d=wheel_diameter, center=true);
        
        // Center hub hole
        cylinder(h=wheel_width+2, d=wheel_axle_diameter, center=true);
        
        // Hub detail (recess)
        cylinder(h=wheel_width*0.6, d=wheel_hub_diameter+4, center=true);
    }
    
    // Add tread teeth around circumference
    for (i = [0 : wheel_teeth_count-1]) {
        rotate([0, 0, i * (360 / wheel_teeth_count)])
        translate([wheel_diameter/2 - wheel_tooth_depth/2, 0, 0])
        rotate([0, 90, 0])
        linear_extrude(height=wheel_tooth_depth, center=true)
        polygon(points=[
            [-wheel_width/2-1, 0],
            [0, wheel_tooth_depth*1.5],
            [wheel_width/2+1, 0]
        ]);
    }
    
    // Inner hub ring
    difference() {
        cylinder(h=wheel_width*0.8, d=wheel_hub_diameter, center=true);
        cylinder(h=wheel_width*0.8+1, d=wheel_axle_diameter, center=true);
    }
}

// Module: Main chassis/body
module main_body() {
    // Base platform with rounded corners
    hull() {
        translate([body_length/2 - 10, body_width/2 - 5, 0])
        cylinder(h=body_height, r=5);
        
        translate([-(body_length/2) + 10, body_width/2 - 5, 0])
        cylinder(h=body_height, r=5);
        
        translate([body_length/2 - 10, -(body_width/2) + 5, 0])
        cylinder(h=body_height, r=5);
        
        translate([-(body_length/2) + 10, -(body_width/2) + 5, 0])
        cylinder(h=body_height, r=5);
    }
    
    // Front section (raised area for blade mount)
    translate([-body_length/4, 0, body_height/2])
    cube([body_length/2.5, body_width-4, track_height], center=true);
}

// Module: Cabin with windows
module cabin() {
    // Main cabin box with rounded top edge
    difference() {
        // Outer shell
        hull() {
            // Bottom part
            translate([0, 0, cabin_height/4])
            cube([cabin_width, cabin_depth, cabin_height/2], center=true);
            
            // Top rounded part
            translate([0, 0, cabin_height*0.6])
            minkowski() {
                cube([cabin_width-cabin_wall*2, cabin_depth-cabin_wall*2, 0.1], center=true);
                sphere(r=cabin_wall);
            }
        }
        
        // Hollow interior
        translate([0, 0, cabin_height/2 + 1])
        cube([cabin_width-cabin_wall*2, cabin_depth-cabin_wall*2, cabin_height], center=true);
        
        // Front window opening
        translate([0, -(cabin_depth/2) + cabin_wall/2, cabin_height*0.55])
        cube([window_width*1.5, cabin_wall+1, window_height], center=true);
        
        // Side window openings (left and right)
        for (side = [-1, 1]) {
            translate([side * (cabin_width/2 - cabin_wall/2), 0, cabin_height*0.55])
            cube([cabin_wall+1, window_width, window_height], center=true);
        }
        
        // Rear window opening (smaller)
        translate([0, (cabin_depth/2) - cabin_wall/2, cabin_height*0.55])
        cube([window_width, cabin_wall+1, window_height*0.7], center=true);
        
        // Bottom opening (for mounting)
        translate([0, 0, -1])
        cube([cabin_width-cabin_wall*4, cabin_depth-cabin_wall*4, 2], center=true);
    }
    
    // Roof overhang
    translate([0, 0, cabin_height + 1])
    hull() {
        translate([(cabin_width/2)-4, (cabin_depth/2)-4, 0])
        cylinder(h=2, r=4);
        
        translate([-(cabin_width/2)+4, (cabin_depth/2)-4, 0])
        cylinder(h=2, r=4);
        
        translate([(cabin_width/2)-4, -(cabin_depth/2)+4, 0])
        cylinder(h=2, r=4);
        
        translate([-(cabin_width/2)+4, -(cabin_depth/2)+4, 0])
        cylinder(h=2, r=4);
    }
}

// Module: Front blade/bucket
module blade() {
    // Main blade plate - angled
    rotate([0, blade_angle - 90, 0])
    translate([0, 0, blade_height/2])
    difference() {
        // Blade face
        cube([blade_depth, blade_width, blade_height], center=true);
        
        // Inner recess (hollow look)
        translate([blade_depth/3, 0, 0])
        cube([blade_depth, blade_width-6, blade_height-6], center=true);
    }
    
    // Side reinforcements
    for (side = [-1, 1]) {
        translate([blade_height*0.3, side*(blade_width/2-2), blade_height*0.4])
        rotate([0, blade_angle-90, 0])
        cube([blade_depth+2, 4, blade_height*0.6], center=true);
    }
    
    // Top reinforcement bar
    translate([-blade_height*0.15, 0, blade_height*0.9])
    rotate([0, blade_angle-90, 0])
    cube([blade_depth+2, blade_width, 3], center=true);
}

// Module: Hydraulic arm assembly
module hydraulic_arms() {
    // Upper arm pair
    for (side = [-1, 1]) {
        translate([-15, side*12, body_height + 5])
        rotate([0, 20, 0])
        hull() {
            sphere(d=arm_thickness);
            translate([-20, 0, -8])
            sphere(d=arm_thickness);
        }
    }
    
    // Lower arm/support
    translate([-25, 0, body_height/2])
    rotate([0, 35, 0])
    hull() {
        cylinder(h=arm_width, d=arm_thickness, center=true);
        translate([-25, 0, -5])
        cylinder(h=arm_width, d=arm_thickness, center=true);
    }
    
    // Cross brace between upper arms
    translate([-22, 0, body_height + 2])
    rotate([0, 20, 0])
    cube([arm_thickness, 20, arm_thickness], center=true);
    
    // Pivot points (cylindrical details)
    for (pos = [[-15, 12, body_height+5], [-15, -12, body_height+5], 
                [-35, 0, body_height/2-3]]) {
        translate(pos)
        rotate([0, 20, 0])
        cylinder(h=arm_width+2, d=arm_thickness+2, center=true);
    }
}

// Module: Exhaust pipe
module exhaust_pipe() {
    translate([body_length/3, body_width/2 - 8, body_height/2])
    cylinder(h=exhaust_height, d=exhaust_diameter);
    
    // Cap/top
    translate([body_length/3, body_width/2 - 8, body_height/2 + exhaust_height])
    cylinder(h=1.5, d=exhaust_diameter + 2);
}

// Module: Small detail cylinders (lights or vents)
module details() {
    // Front light/vent
    translate([-body_length/3, 0, body_height/2 + 2])
    cylinder(h=4, d=5);
    
    // Rear small detail
    translate([body_length/3 - 5, body_width/2 - 12, body_height/2])
    cylinder(h=6, d=4);
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Main body/chassis
    color("gray")
    main_body();
    
    // Four wheels
    color("darkgray") {
        // Front left
        translate([-body_length/4, body_width/2 + wheel_width/2 - 2, 0])
        treaded_wheel();
        
        // Front right
        translate([-body_length/4, -(body_width/2) - wheel_width/2 + 2, 0])
        treaded_wheel();
        
        // Rear left
        translate([body_length/4, body_width/2 + wheel_width/2 - 2, 0])
        treaded_wheel();
        
        // Rear right
        translate([body_length/4, -(body_width/2) - wheel_width/2 + 2, 0])
        treaded_wheel();
    }
    
    // Cabin
    color("lightgray")
    translate([5, 0, body_height])
    cabin();
    
    // Front blade
    color("silver")
    translate([-body_length/2 - blade_height*0.35, 0, track_height])
    blade();
    
    // Hydraulic arms
    color("gray")
    hydraulic_arms();
    
    // Exhaust pipe
    color("dimgray")
    exhaust_pipe();
    
    // Additional details
    color("silver")
    details();
}