// ==========================================
// Parametric Assembly: Stylized Chair
// ==========================================

// Dimensions and Parameters
seat_width = 90;
seat_depth = 100;
seat_thickness = 10;
total_width = 110;

leg_size = 25;
leg_height = 100;

backrest_height = 190;
backrest_thickness = 10;

// Global resolution
$fn = 100;

// ==========================================
// Modules
// ==========================================

// Waisted leg with concave cylindrical sides and rounded corners
module leg() {
    w = leg_size;
    h = leg_height + 0.2; // Small overlap for manifold union
    cut_r = 135;
    waist_w = 12;
    cut_d = (w - waist_w) / 2;
    
    intersection() {
        // Base filleted column
        linear_extrude(h, center=true)
        offset(r=2, $fn=30)
        square([w-4, w-4], center=true);
        
        // Waisted cuts
        difference() {
            cube([w+2, w+2, h+2], center=true);
            for (a = [0, 90, 180, 270]) {
                rotate([0, 0, a])
                translate([0, cut_r + w/2 - cut_d, 0])
                rotate([0, 90, 0])
                cylinder(r=cut_r, h=w*2, center=true);
            }
        }
    }
}

// Semicircular side panel with arched groove and hex cutout
module side_panel() {
    difference() {
        // Main semicircle
        intersection() {
            rotate([0, 90, 0]) cylinder(r=50, h=10, center=true);
            translate([0, 0, 25]) cube([20, 100, 50], center=true);
        }
        
        // Central hex hole (rotated to have flat top/bottom)
        translate([0, 0, 20]) 
        rotate([0, 90, 0]) 
        rotate([0, 0, 30]) 
        cylinder(r=10, h=20, center=true, $fn=6);
        
        // Arched groove
        difference() {
            rotate([0, 90, 0]) cylinder(r=30, h=12, center=true);
            rotate([0, 90, 0]) cylinder(r=20, h=14, center=true);
            translate([0, 0, -50]) cube([20, 100, 100], center=true);
        }
    }
}

// Horizontal seat platform with diamond cutouts
module seat() {
    translate([0, 0, seat_thickness/2])
    difference() {
        cube([seat_width, seat_depth, seat_thickness], center=true);
        
        // Seat diamond cutouts
        for (x = [-20, 20]) {
            for (y = [-20, 20]) {
                translate([x, y, 0]) 
                rotate([0, 0, 45])
                cube([15, 15, seat_thickness + 2], center=true);
            }
        }
    }
}

// Tall vertical backrest with B-spline leaf contour and tilted cutouts
module backrest() {
    h = backrest_height + 0.2; // Small overlap for manifold union
    difference() {
        cube([total_width, backrest_thickness, h], center=true);
        
        // Pointed-leaf contour (S-curve grooves)
        translate([80, 0, 80]) rotate([90, 0, 0])
        difference() { 
            cylinder(r=120, h=20, center=true); 
            cylinder(r=115, h=22, center=true); 
        }
        
        translate([-80, 0, -80]) rotate([90, 0, 0])
        difference() { 
            cylinder(r=120, h=20, center=true); 
            cylinder(r=115, h=22, center=true); 
        }
        
        // Central cluster of tilted diamond cutouts
        translate([0, 0, 10])
        for (a = [0, 90, 180, 270]) {
            rotate([0, a, 0])
            translate([20, 0, 0])
            rotate([30, 0, 0]) // 30-degree tilted wall normal
            rotate([0, 45, 0]) // Diamond shape
            cube([12, 50, 12], center=true);
        }
    }
}

// ==========================================
// Main Assembly
// ==========================================

union() {
    // 1. Four Waisted Legs (descending below the seat)
    for (x = [-32.5, 32.5]) {
        for (y = [-37.5, 37.5]) {
            translate([x, y, -leg_height/2]) 
            leg();
        }
    }
    
    // 2. Decorative Bracket: Seat Platform
    seat();
    
    // 3. Decorative Bracket: Side Panels
    translate([-total_width/2 + 5, 0, seat_thickness - 0.1]) 
    side_panel();
    
    translate([total_width/2 - 5, 0, seat_thickness - 0.1]) 
    side_panel();
    
    // 4. Decorative Bracket: Tall Backrest
    translate([0, seat_depth/2 - backrest_thickness/2, seat_thickness + backrest_height/2]) 
    backrest();
}