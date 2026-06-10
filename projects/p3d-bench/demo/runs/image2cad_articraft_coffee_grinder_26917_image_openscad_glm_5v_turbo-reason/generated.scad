// Coffee Grinder Model - Parametric OpenSCAD Design
// Based on Fusion 360 coffee grinder reference image

// ============================================
// PARAMETERS (all dimensions in mm)
// ============================================

// Base dimensions
base_size = 80;           // Square base width/depth
base_height = 8;          // Base thickness
base_overhang = 5;        // How much base extends beyond body
base_rounding = 3;        // Edge rounding radius

// Main body dimensions
body_width = 65;
body_depth = 65;
body_height = 50;
body_wall = 2;            // Wall thickness
body_rounding = 2;        // Corner rounding

// Drawer dimensions
drawer_width = 45;
drawer_height = 30;
drawer_depth = 8;
drawer_inset = 4;         // Inset from body edges
knob_diameter = 10;
knob_height = 6;

// Hopper (bowl) dimensions
hopper_top_diameter = 62;
hopper_bottom_diameter = 52;
hopper_height = 38;
hopper_rim_thickness = 3;
hopper_wall = 2;

// Grinding mechanism
shaft_diameter = 16;
shaft_height = 28;
handle_length = 42;
handle_width = 10;
handle_thickness = 4;
handle_knob_diameter = 14;
nut_size = 7;             // Hex nut size

// Resolution
$fn = 80;                 // Global resolution for smooth curves

// ============================================
// MODULES
// ============================================

// Module: Base platform with molded edges
module base_platform() {
    difference() {
        // Main base with rounded corners
        linear_extrude(height=base_height, center=false)
        offset(r=base_rounding)
        square([base_size - 2*base_rounding, base_size - 2*base_rounding], center=true);
        
        // Optional: Add slight taper/bevel effect using hull could go here
    }
    
    // Decorative molding around bottom edge
    translate([0, 0, 0])
    linear_extrude(height=2, center=false)
    difference() {
        offset(r=1)
        square([base_size + 4, base_size + 4], center=true);
        square([base_size + 0.5, base_size + 0.5], center=true);
    }
}

// Module: Main body box with drawer opening
module main_body() {
    difference() {
        // Outer shell
        rounded_box(body_width, body_depth, body_height, body_rounding);
        
        // Inner cavity (hollow)
        translate([0, 0, body_wall])
        rounded_box(body_width - 2*body_wall, body_depth - 2*body_wall, 
                   body_height + 1, body_rounding - 1);
        
        // Drawer opening (front face)
        translate([-(body_width - drawer_width)/2, body_depth/2 - drawer_inset, 
                  body_height - drawer_height - drawer_inset])
        cube([drawer_width, body_wall + 1, drawer_height]);
    }
    
    // Drawer front panel (with knob)
    drawer();
    
    // Label plate area (debossed text area)
    translate([0, body_depth/2 - 1, body_height - drawer_height - drawer_inset - 8])
    rotate([90, 0, 0])
    linear_extrude(height=1)
    {
        // Oval plaque background
        resize([35, 12])
        circle(d=10);
        
        // Text (commented out as text requires local fonts, using placeholder)
        /*
        translate([0, -1, 0])
        text("Fusion 360", size=4, halign="center", valign="center", font="Arial");
        */
    }
}

// Module: Drawer with knob
module drawer() {
    drawer_y = body_depth/2 - drawer_inset + drawer_depth/2;
    drawer_z = body_height - drawer_height/2 - drawer_inset;
    
    // Drawer body
    translate([0, drawer_y, drawer_z]) {
        difference() {
            // Drawer front (visible part with rounding)
            translate([0, 0, 0])
            linear_extrude(height=drawer_height, center=true)
            offset(r=3)
            square([drawer_width - 6, drawer_depth - 2], center=true);
            
            // Knob hole
            translate([0, drawer_depth/2 - 1, -2])
            cylinder(h=drawer_height, d=knob_diameter + 2, center=true);
        }
        
        // Drawer knob
        translate([0, drawer_depth/2 + knob_height/2 - 1, 0])
        rotate([90, 0, 0])
        knob(knob_diameter, knob_height);
    }
}

// Module: Round knob
module knob(dia, h) {
    union() {
        cylinder(h=h*0.6, d=dia, center=true);
        translate([0, 0, h*0.25])
        sphere(d=dia*0.9);
    }
}

// Module: Hopper/Bowl (conical frustum)
module hopper() {
    z_pos = body_height;
    
    translate([0, 0, z_pos])
    union() {
        // Bottom rim/flange
        translate([0, 0, 0])
        difference() {
            cylinder(h=4, d=hopper_bottom_diameter + 8, center=false);
            cylinder(h=5, d=hopper_bottom_diameter + 4, center=false);
        }
        
        // Main conical body (hollow)
        difference() {
            cylinder(h=hopper_height, d1=hopper_bottom_diameter, 
                    d2=hopper_top_diameter, center=false);
            
            translate([0, 0, -0.1])
            cylinder(h=hopper_height + 1, d1=hopper_bottom_diameter - 2*hopper_wall,
                    d2=hopper_top_diameter - 2*hopper_wall, center=false);
        }
        
        // Top rim
        translate([0, 0, hopper_height - 2])
        difference() {
            cylinder(h=4, d=hopper_top_diameter + 4, center=false);
            translate([0, 0, -0.1])
            cylinder(h=5, d=hopper_top_diameter, center=false);
        }
        
        // Internal grinding chamber floor indication (subtle ring)
        translate([0, 0, 5])
        rotate_extrude()
        translate([(hopper_bottom_diameter - 2*hopper_wall)/2 - 2, 0, 0])
        circle(r=1.5);
    }
}

// Module: Grinding mechanism (shaft + handle)
module grinding_mechanism() {
    total_z = body_height + hopper_height;
    
    translate([0, 0, total_z])
    union() {
        // Central shaft
        cylinder(h=shaft_height, d=shaft_diameter, center=false);
        
        // Top cap/hex nut
        translate([0, 0, shaft_height])
        cylinder(h=nut_size, d=nut_size * 1.8, center=false, $fn=6); // Hexagonal nut
        
        // Handle attachment bracket
        translate([-handle_width/2, 0, shaft_height - 5])
        cube([handle_width, 12, 6], center=false);
        
        // Handle arm
        translate([0, 5, shaft_height - 3])
        rotate([0, 0, 20]) // Angled slightly upward in view
        union() {
            // Main handle bar
            translate([handle_length/2 - 5, 0, 0])
            cube([handle_length, handle_width, handle_thickness], center=true);
            
            // Handle knob at end
            translate([handle_length - 5, 0, 0])
            rotate([0, 90, 0])
            knob(handle_knob_diameter, handle_knob_diameter * 0.8);
            
            // End cap of handle
            translate([-5, 0, 0])
            cube([10, handle_width + 4, handle_thickness + 2], center=true);
        }
    }
}

// Helper module: Rounded box
module rounded_box(w, h, d, r) {
    minkowski() {
        cube([w - 2*r, h - 2*r, d - 2*r], center=true);
        sphere(r);
    }
}

// ============================================
// ASSEMBLY
// ============================================

union() {
    // Base
    color("gray")
    base_platform();
    
    // Main body
    color("lightgray")
    main_body();
    
    // Hopper/Bowl
    color("silver")
    hopper();
    
    // Grinding mechanism
    color("darkgray")
    grinding_mechanism();
}