// ============================================================
// PARAMETRIC COMPUTER COOLING FAN MODEL
// OpenSCAD script for 80mm axial fan representation
// ============================================================

// ----------------------------------------
// GLOBAL PARAMETERS
// ----------------------------------------
$fn = 60;  // Fragment resolution for curves

// Fan overall dimensions (80mm standard fan)
fan_width = 80;           // Square frame width (mm)
fan_height = 25;          // Total assembly height (mm)
frame_thick = 5.0;        // Thickness of top/bottom frames (mm)

// Motor hub
hub_dia = 28;             // Central hub diameter (mm)
hub_height = 13;          // Hub protrusion height (mm)
hub_top_dia = 24;         // Top cap diameter (mm)

// Impeller (blades)
blade_count = 7;          // Number of blades
blade_inner_r = 16;       // Blade root radius (mm)
blade_outer_r = 33;       // Blade tip radius (mm)  
blade_twist = 55;         // Blade twist angle (degrees)
blade_pitch = 12;         // Vertical sweep of blade (mm)
blade_chord = 14;         // Blade width/chord (mm)
impeller_ring_dia = 72;   // Outer retaining ring diameter (mm)
impeller_ring_thick = 3;  // Ring thickness (mm)

// Frame features
corner_r = 5;             // Frame corner radius (mm)
hole_dia = 4.2;           // Mounting hole diameter (mm)
hole_inset = 5.5;         // Hole distance from edge (mm)
frame_lip = 1.5;          // Inner lip height (mm)

// Support structure
strut_dia = 3.5;          // Corner pillar diameter (mm)
strut_count = 4;          // Number of support pillars

// ----------------------------------------
// MODULE DEFINITIONS
// ----------------------------------------

/** 
 * Fan Frame Component
 * Creates the square frame with rounded corners, mounting holes, and center aperture
 * @param size: Overall width/length
 * @param thick: Frame thickness
 * @param cr: Corner radius
 * @param hd: Hole diameter
 * @param hi: Hole inset from edge
 * @param is_top: If true, adds cable notch detail
 */
module fan_frame(size, thick, cr, hd, hi, is_top=false) {
    difference() {
        // Main frame body with rounded corners
        linear_extrude(height=thick, center=true, convexity=10)
            offset(r=cr)
                square([size - 2*cr, size - 2*cr], center=true);
        
        // Large center opening for airflow
        cylinder(h=thick+1, d=impeller_ring_dia + 6, center=true);
        
        // Four corner mounting holes
        for(rot=[0:90:270]) {
            rotate([0,0,rot])
                translate([size/2 - hi, size/2 - hi, 0])
                    cylinder(h=thick+2, d=hd, center=true);
        }
        
        // Cable exit notch (bottom frame only)
        if(!is_top) {
            translate([size/2 - 10, 0, 0])
                cube([8, 20, thick+2], center=true);
        }
    }
    
    // Inner raised lip around aperture (aesthetic detail)
    difference() {
        cylinder(h=frame_lip, d=impeller_ring_dia + 4, center=true);
        cylinder(h=frame_lip+1, d=impeller_ring_dia, center=true);
    }
    
    // Corner reinforcement gussets (triangular braces near holes)
    for(rot=[0:90:270]) {
        rotate([0,0,rot])
            translate([size/2 - hi - cr, size/2 - hi - cr, thick/2 - 0.5])
                linear_extrude(height=1, center=true)
                    polygon(points=[
                        [0,0], 
                        [cr+2,0], 
                        [0,cr+2]
                    ]);
    }
}

/**
 * Single Twisted Fan Blade
 * Generates one blade using hull() between root and tip profiles
 * Creates realistic swept-twisted airfoil approximation
 */
module fan_blade(root_r, tip_r, chord, twist_ang, sweep_h) {
    // Define blade profile points at root and tip
    // Root section (lower, untwisted)
    root_profile = [
        [root_r, -chord/2, 0],
        [root_r + chord*0.3, 0, 0],
        [root_r, chord/2, 0]
    ];
    
    // Tip section (higher, twisted)
    tip_profile = [
        [tip_r, -chord*0.6, sweep_h],
        [tip_r + chord*0.15, 0, sweep_h],
        [tip_r, chord*0.6, sweep_h]
    ];
    
    // Build blade using hull between multiple cross-sections for smoothness
    hull() {
        // Root
        translate([root_r, -chord/2.5, 0]) sphere(d=2);
        translate([root_r, chord/2.5, 0]) sphere(d=2);
        translate([root_r + chord*0.25, 0, 1]) sphere(d=2.5);
        
        // Mid-span (50% span)
        mid_r = root_r + (tip_r - root_r)*0.5;
        mid_z = sweep_h*0.5;
        mid_rot = twist_ang*0.5;
        rotate([0,0,mid_rot])
            translate([mid_r, -chord*0.55, mid_z]) sphere(d=1.8);
        rotate([0,0,mid_rot])
            translate([mid_r, chord*0.55, mid_z]) sphere(d=1.8);
        
        // Tip (twisted)
        rotate([0,0,twist_ang])
            translate([tip_r, -chord*0.6, sweep_h]) sphere(d=1.2);
        rotate([0,0,twist_ang])
            translate([tip_r, chord*0.6, sweep_h]) sphere(d=1.2);
        rotate([0,0,twist_ang])
            translate([tip_r + chord*0.1, 0, sweep_h]) sphere(d=1.5);
    }
}

/**
 * Complete Impeller Assembly
 * Hub + outer ring + all blades
 */
module impeller_assembly() {
    // Outer retaining ring (holds blade tips)
    difference() {
        cylinder(h=impeller_ring_thick, d=impeller_ring_dia, center=true);
        cylinder(h=impeller_ring_thick+1, d=impeller_ring_dia - 6, center=true);
    }
    
    // Inner ring connection to hub
    difference() {
        cylinder(h=impeller_ring_thick, d=blade_inner_r*2 + 4, center=true);
        cylinder(h=impeller_ring_thick+1, d=blade_inner_r*2 - 2, center=true);
    }
    
    // Generate blades radially
    for(i=[0:blade_count-1]) {
        rotate([0, 0, i * (360/blade_count)])
            fan_blade(
                root_r=blade_inner_r,
                tip_r=blade_outer_r,
                chord=blade_chord,
                twist_ang=blade_twist,
                sweep_h=blade_pitch
            );
    }
}

/**
 * Motor Hub Assembly
 * Central cylinder with top cap detail
 */
module motor_hub() {
    // Main hub body
    cylinder(h=hub_height, d=hub_dia, center=false);
    
    // Top cap (slightly smaller diameter)
    translate([0, 0, hub_height - 1])
        cylinder(h=2, d=hub_top_dia, center=false);
    
    // Center shaft indication (small protrusion)
    translate([0, 0, hub_height + 0.5])
        cylinder(h=1.5, d=6, center=false);
}

/**
 * Support Strut/Pillar
 * Connects top and bottom frames at corners
 */
module support_pillar(height, diameter) {
    cylinder(h=height, d=diameter, center=true, $fn=20);
}

// ----------------------------------------
// MAIN ASSEMBLY
// ----------------------------------------

union() {
    // --- BOTTOM FRAME ---
    translate([0, 0, -fan_height/2 + frame_thick/2])
        color("DimGray", 0.9)
            fan_frame(fan_width, frame_thick, corner_r, hole_dia, hole_inset, is_top=false);
    
    // --- TOP FRAME ---
    translate([0, 0, fan_height/2 - frame_thick/2])
        color("LightGray", 0.95)
            fan_frame(fan_width, frame_thick, corner_r, hole_dia, hole_inset, is_top=true);
    
    // --- CORNER SUPPORT PILLARS ---
    // Positioned at inset from corners
    pillar_offset = (fan_width/2) - corner_r - 4;
    for(rot=[0:90:270]) {
        rotate([0,0,rot])
            translate([pillar_offset, pillar_offset, 0])
                color("Gray", 0.85)
                    support_pillar(fan_height - frame_thick, strut_dia);
    }
    
    // --- MOTOR HUB ---
    // Sits on bottom frame surface
    translate([0, 0, -fan_height/2 + frame_thick])
        color("SlateGray", 0.95)
            motor_hub();
    
    // --- IMPELLER (BLADES + RINGS) ---
    // Positioned above bottom frame, below top frame
    translate([0, 0, -fan_height/2 + frame_thick + impeller_ring_thick/2 + 2])
        color("Silver", 0.85)
            impeller_assembly();
}

// ----------------------------------------
// END OF FILE
// ----------------------------------------