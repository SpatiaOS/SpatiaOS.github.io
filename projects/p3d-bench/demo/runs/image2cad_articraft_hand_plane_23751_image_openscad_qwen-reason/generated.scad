// RAM Mounts Style Dual Ball Base with Central Mechanism
// Parametric OpenSCAD Model

$fn = 60; // Resolution for curves

// --- Parameters ---
// General Dimensions
total_length = 220;
base_thickness = 8;
ball_diameter = 25.4; // Standard 1 inch ball
ball_base_diameter = 40;
ball_base_height = 6;

// Positions
left_ball_x = -80;
right_ball_x = 80;
central_mech_x = 20; // Offset towards right
central_mech_y = 15;

// Central Mechanism Dimensions
central_base_d = 30;
central_post_h = 35;
clamp_width = 20;
thumbscrew_len = 25;

// Colors (for visualization)
color_base = "gray";
color_ball = "lightgray";
color_mech = "silver";
color_knob = "black";

// --- Main Assembly ---
color(color_base)
union() {
    // Main Base Plate
    base_plate();
    
    // Left Ball Mount
    translate([left_ball_x, 0, base_thickness])
    ball_assembly();
    
    // Right Ball Mount
    translate([right_ball_x, 0, base_thickness])
    ball_assembly();
    
    // Central Mechanism
    translate([central_mech_x, central_mech_y, base_thickness])
    central_assembly();
}

// --- Modules ---

// 1. Base Plate
module base_plate() {
    difference() {
        union() {
            // Create the organic shape using hull
            // Left pad area
            translate([left_ball_x, 0, 0])
            cylinder(d=ball_base_diameter + 20, h=base_thickness, center=false);
            
            // Right pad area
            translate([right_ball_x, 0, 0])
            cylinder(d=ball_base_diameter + 20, h=base_thickness, center=false);
            
            // Central bridge area
            // Using hull to connect the shapes smoothly
            hull() {
                translate([left_ball_x, 0, 0])
                cylinder(d=50, h=base_thickness, center=false);
                
                translate([right_ball_x, 0, 0])
                cylinder(d=50, h=base_thickness, center=false);
                
                // Central bulge for the mechanism
                translate([central_mech_x, central_mech_y, 0])
                cylinder(d=50, h=base_thickness, center=false);
            }
        }
        
        // Cutouts / Recesses for aesthetics and weight reduction
        // Left side recess
        translate([left_ball_x, 0, -1])
        cylinder(d=ball_base_diameter + 5, h=base_thickness + 2, center=false);
        
        // Right side recess
        translate([right_ball_x, 0, -1])
        cylinder(d=ball_base_diameter + 5, h=base_thickness + 2, center=false);
        
        // Mounting holes on the right side
        translate([right_ball_x - 20, -15, -1])
        cylinder(d=4, h=base_thickness + 2, center=false);
        translate([right_ball_x - 20, 15, -1])
        cylinder(d=4, h=base_thickness + 2, center=false);
        
        // Central cutout (optional, for cable routing or weight)
        // translate([0, -20, -1])
        // cylinder(d=20, h=base_thickness+2, center=false);
    }
    
    // Embossed Text "RAM" on the right side
    // Note: OpenSCAD text is 2D, we extrude it to make it 3D embossed
    // Since difference() was used above, we need to add this back or do it separately.
    // Let's add it as a separate union or handle it carefully.
    // To keep it simple, I'll add it as a raised feature.
    
    // Actually, let's just add the text on top.
    translate([right_ball_x, 15, base_thickness])
    rotate([0, 0, 0]) // Align text
    color("black") // Just for contrast in preview
    linear_extrude(height=1)
    text("RAM", size=12, halign="center", valign="center", font="Arial:style=Bold");

    // Text on the left curved part
    translate([left_ball_x, -25, base_thickness])
    rotate([0, 0, -90])
    linear_extrude(height=1)
    text("RAM", size=12, halign="center", valign="center", font="Arial:style=Bold");
}

// 2. Ball Assembly (Ball + Base Ring)
module ball_assembly() {
    // Base Ring
    cylinder(d=ball_base_diameter, h=ball_base_height, center=false);
    
    // Neck
    translate([0, 0, ball_base_height])
    cylinder(d1=ball_diameter * 0.6, d2=ball_diameter * 0.8, h=5, center=false);
    
    // The Ball
    translate([0, 0, ball_base_height + 5])
    difference() {
        sphere(d=ball_diameter);
        // The horizontal slot for tightening
        rotate([0, 90, 0])
        cube([ball_diameter + 2, 2, 4], center=true);
        
        // Vertical slot (optional, usually just one main slot)
        // cube([2, 2, ball_diameter + 2], center=true);
    }
}

// 3. Central Assembly
module central_assembly() {
    // Base of central mechanism
    cylinder(d=central_base_d, h=10, center=false);
    
    // Vertical smooth pin (left side of mechanism)
    translate([-8, 0, 10])
    cylinder(d=8, h=central_post_h, center=false);
    
    // Vertical threaded rod area (right side of mechanism)
    translate([8, 0, 10]) {
        // Rod
        cylinder(d=6, h=central_post_h + 10, center=false);
        
        // Top Knob/Handle
        translate([0, 0, central_post_h + 10])
        color(color_knob)
        knob_star();
        
        // Washer under knob
        translate([0, 0, central_post_h])
        cylinder(d=16, h=3, center=false);
    }
    
    // Horizontal Clamp / Thumbscrew mechanism
    // This part clamps onto the vertical post or is part of the base
    translate([0, 0, 20]) {
        // Horizontal arm
        rotate([0, 90, 0])
        cylinder(d=10, h=30, center=true);
        
        // Thumbscrew on the right end
        translate([15, 0, 0])
        rotate([0, 90, 0]) // Rotate to point outwards
        color(color_knob)
        thumbscrew_knob();
    }
    
    // Front curved guard/bridge
    translate([0, -15, 10])
    rotate([90, 0, 0])
    linear_extrude(height=10)
    polygon(points=[
        [-15, 0], [15, 0], [15, 10], [-15, 10]
    ]); // Simplified guard
}

// Helper: Star Knob
module knob_star() {
    rotate_extrude()
    polygon(points=[
        [0, 0],
        [8, 0],
        [8, 2],
        [10, 2],
        [10, 4],
        [8, 4],
        [8, 6],
        [0, 6]
    ]);
    // Add ridges for grip
    for(i=[0:5]) {
        rotate([0, 0, i*60])
        translate([9, 3, 0])
        cube([2, 2, 6], center=true);
    }
}

// Helper: Thumbscrew Knob (Round with ridges)
module thumbscrew_knob() {
    // Main body
    cylinder(d=16, h=12, center=true);
    // Knurled edge
    rotate_extrude()
    translate([8, 0, 0])
    square([2, 12], center=true);
    
    // Screw shaft
    cylinder(d=5, h=20, center=true);
}