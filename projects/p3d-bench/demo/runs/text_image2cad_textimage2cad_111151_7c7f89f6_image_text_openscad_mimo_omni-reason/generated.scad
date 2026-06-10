// Parametric Chair Assembly
// Based on Fusion360 reconstruction

// Global parameters
$fn = 100;

// ===== BRACKET PARAMETERS =====
bracket_width = 110;        // X dimension
bracket_depth = 100;        // Y dimension  
bracket_height = 215;       // Z dimension (vertical plate)
bracket_thickness = 10;     // Plate and base thickness

// Backrest parameters
backrest_point_height = 180; // Height to pointed tip
backrest_width = 100;       // Width of vertical plate
leaf_curve_radius = 150;    // Radius for leaf contour curve

// Base parameters
base_depth = 100;           // Depth of horizontal base
base_width = 110;           // Width of horizontal base
base_arc_radius = 50;       // Semicircular arc on base sides
base_side_curve_radius = 20; // Additional curved contours
base_small_curve_radius = 10;

// Diamond cutout parameters
diamond_size = 15;          // Size of diamond cutouts
diamond_tilt = 30;          // Tilt angle from axes (degrees)
diamond_count = 5;          // Number of diamond cutouts on backrest
diamond_base_count = 3;     // Number of diamond cutouts on base

// ===== LEG PARAMETERS =====
leg_width = 25;             // X dimension
leg_depth = 25;             // Y dimension
leg_height = 100;           // Z dimension
leg_fillet_radius = 2;      // Vertical edge fillets

// Concave cylinder parameters for waisted profile
leg_concave_radius1 = 130;  // Upper concave radius
leg_concave_radius2 = 145;  // Lower concave radius
leg_chamfer_height = 5;     // Height of end chamfers

// ===== ASSEMBLY PARAMETERS =====
seat_height = 100;          // Height from floor to seat top
leg_spacing_x = 70;         // Spacing between legs in X direction
leg_spacing_y = 60;         // Spacing between legs in Y direction

// ===== MODULES =====

// Diamond cutout shape (2D)
module diamond_shape(size, tilt) {
    rotate([0, 0, tilt])
    square([size, size], center=true);
    rotate([0, 0, tilt + 45])
    square([size, size], center=true);
}

// Waisted leg profile (2D cross-section)
module leg_profile() {
    // Square with concave sides
    difference() {
        // Base square
        square([leg_width, leg_depth], center=true);
        
        // Concave cuts on each side
        for (angle = [0, 90, 180, 270]) {
            rotate([0, 0, angle])
            translate([leg_width/2, 0, 0])
            circle(r=leg_concave_radius1, $fn=200);
        }
    }
}

// Complete leg module
module leg() {
    linear_extrude(height=leg_height, center=true) {
        // Main leg profile with fillets
        offset(r=leg_fillet_radius)
        offset(r=-leg_fillet_radius)
        leg_profile();
    }
    
    // Add chamfers at top and bottom
    for (z = [-leg_height/2 + leg_chamfer_height/2, 
               leg_height/2 - leg_chamfer_height/2]) {
        translate([0, 0, z])
        linear_extrude(height=leg_chamfer_height, center=true) {
            offset(r=leg_fillet_radius)
            offset(r=-leg_fillet_radius)
            scale([1.2, 1.2]) // Flared chamfer
            leg_profile();
        }
    }
}

// Decorative bracket module
module decorative_bracket() {
    union() {
        // Vertical backrest plate
        difference() {
            // Main plate
            cube([backrest_width, bracket_thickness, bracket_height], 
                 center=true);
            
            // Pointed leaf contour (simplified as curve)
            translate([0, 0, backrest_point_height/2])
            rotate([90, 0, 0])
            linear_extrude(height=bracket_thickness*2, center=true)
            hull() {
                circle(d=backrest_width);
                translate([0, backrest_point_height - backrest_width/2, 0])
                circle(d=1);
            }
            
            // Diamond cutouts on backrest
            for (i = [0:diamond_count-1]) {
                translate([
                    -backrest_width/4 + (i % 2) * backrest_width/2,
                    0,
                    50 + i * 30
                ])
                rotate([90, 0, 0])
                linear_extrude(height=bracket_thickness*2, center=true)
                diamond_shape(diamond_size, diamond_tilt);
            }
        }
        
        // Horizontal base
        difference() {
            // Main base with rounded front
            hull() {
                // Main rectangular part
                cube([base_width, base_depth - base_arc_radius, 
                      bracket_thickness], center=true);
                
                // Semicircular front
                translate([0, (base_depth - base_arc_radius)/2, 0])
                rotate([0, 0, 90])
                linear_extrude(height=bracket_thickness, center=true)
                circle(r=base_arc_radius);
            }
            
            // Side curved cutouts
            for (side = [-1, 1]) {
                translate([side * base_width/2, 0, 0])
                rotate([0, 0, side * 90])
                linear_extrude(height=bracket_thickness*2, center=true)
                circle(r=base_side_curve_radius);
            }
            
            // Small curved cutouts
            for (x = [-1, 1], y = [-1, 1]) {
                translate([x * base_width/4, y * base_depth/4, 0])
                linear_extrude(height=bracket_thickness*2, center=true)
                circle(r=base_small_curve_radius);
            }
            
            // Diamond cutouts on base
            for (i = [0:diamond_base_count-1]) {
                translate([
                    -base_width/3 + i * base_width/3,
                    -base_depth/4,
                    0
                ])
                linear_extrude(height=bracket_thickness*2, center=true)
                diamond_shape(diamond_size, diamond_tilt);
            }
        }
    }
}

// ===== ASSEMBLY =====
union() {
    // Decorative bracket (seat and backrest)
    translate([0, 0, seat_height])
    decorative_bracket();
    
    // Four legs
    for (x = [-1, 1], y = [-1, 1]) {
        translate([
            x * leg_spacing_x/2,
            y * leg_spacing_y/2,
            leg_height/2
        ])
        leg();
    }
}