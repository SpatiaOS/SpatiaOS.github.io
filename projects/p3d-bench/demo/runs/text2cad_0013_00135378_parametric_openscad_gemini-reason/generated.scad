// CAD Model: Rounded slot-like base with concentric collars and core
// The model is centered at the origin (0,0,0). 
// The left edge is at X = -0.375 and front edge is at Y = -0.225,
// which places the requested central axis exactly at the origin.

// --- Parameters ---

// Base footprint dimensions
base_length = 0.75;
base_width = 0.45;
base_height = 0.05625; // Nominal base height from description
base_depth = 0.0562;   // Absolute reach depth for the base

// Concentric feature radii
r_collar1_out = 0.225;
r_collar1_in  = 0.1875;
r_collar2_out = 0.0937;
r_collar2_in  = 0.0562;
r_core        = 0.0562;

// Concentric feature absolute reach depths (from Z=0 shared shoulder datum)
depth_collar1 = 0.1687;
depth_collar2 = 0.0937;
depth_core    = 0.075;

// Resolution for smooth curves
$fn = 100;

// --- Modules ---

// Module for the rounded, slot-like rectangular base (stadium shape)
module base_footprint(h) {
    // Distance between centers of the two semi-circles
    center_dist = base_length - base_width;
    
    hull() {
        translate([-center_dist/2, 0, 0]) 
            cylinder(h=h, r=base_width/2);
        translate([center_dist/2, 0, 0]) 
            cylinder(h=h, r=base_width/2);
    }
}

// --- Main Geometry ---

union() {
    // 1. Base footprint with the specified central annular opening
    difference() {
        base_footprint(base_depth);
        
        // Annular opening between r=0.1875 and r=0.0937
        // Created by subtracting a hollow tube to leave the innermost base solid intact
        difference() {
            translate([0, 0, -1]) 
                cylinder(h=base_depth + 2, r=r_collar1_in);
            translate([0, 0, -2]) 
                cylinder(h=base_depth + 4, r=r_collar2_out);
        }
    }
    
    // 2. Outer annular collar (occupies the central 0.45 circular span)
    difference() {
        cylinder(h=depth_collar1, r=r_collar1_out);
        translate([0, 0, -1]) 
            cylinder(h=depth_collar1 + 2, r=r_collar1_in);
    }
    
    // 3. Smaller coaxial annular section (Inner collar)
    difference() {
        cylinder(h=depth_collar2, r=r_collar2_out);
        translate([0, 0, -1]) 
            cylinder(h=depth_collar2 + 2, r=r_collar2_in);
    }
    
    // 4. Innermost solid circular section (Core)
    cylinder(h=depth_core, r=r_core);
}