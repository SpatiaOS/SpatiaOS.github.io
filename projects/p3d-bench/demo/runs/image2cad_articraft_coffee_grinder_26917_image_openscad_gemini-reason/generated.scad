/*
 * VINTAGE COFFEE GRINDER
 * Parametric OpenSCAD Model
 * 
 * Recreated based on the provided Fusion 360 screenshot.
 * Designed for manifold geometry and STL export.
 */

// ==========================================
// PARAMETERS
// ==========================================

// Global Resolution
$fn = 100;

// Base Box Dimensions
box_w = 100;
box_d = 100;
box_h = 75;
corner_radius = 2;

// Decorative Plates (Top and Bottom)
plate_w = 125;
plate_d = 125;
plate_h = 12;
plate_chamfer_scale = 0.85;

// Drawer
drawer_w = 76;
drawer_h = 45;
drawer_depth = 95;
drawer_recess = 2;

// Plaque
plaque_w = 45;
plaque_h = 15;
plaque_thick = 2;

// Hopper (Metal Bowl)
hopper_base_dia = 85;
hopper_top_dia = 135;
hopper_h = 55;
hopper_thick = 3;

// Internal Mechanism
shaft_dia = 18;
shaft_h = hopper_h + 15;

// Crank Handle
arm_w = 16;
arm_thick = 3;
arm_straight_len = 30;
arm_angle = 18;
arm_angled_len = 45;
arm_end_len = 35;

// ==========================================
// HELPER MODULES
// ==========================================

// 2D Rounded Rectangle
module rounded_square(w, d, r) {
    offset(r=r) square([w - 2*r, d - 2*r], center=true);
}

// Decorative top/bottom plate with ogee/chamfer profile
module decorative_plate(w, d, h, r) {
    base_h = h * 0.4;
    top_h = h * 0.6;
    
    union() {
        // Vertical base lip
        linear_extrude(height=base_h) 
            rounded_square(w, d, r);
        
        // Chamfered top section
        translate([0, 0, base_h - 0.01])
        linear_extrude(height=top_h + 0.01, scale=plate_chamfer_scale) 
            rounded_square(w, d, r);
    }
}

// Drawer Assembly
module drawer() {
    union() {
        // Main drawer body
        translate([0, drawer_depth/2 - box_d/2 + 1, 0])
            cube([drawer_w - 1, drawer_depth, drawer_h - 1], center=true);
        
        // Drawer front face (raised panel detail)
        translate([0, -box_d/2 + drawer_recess/2, 0]) {
            cube([drawer_w, drawer_recess, drawer_h], center=true);
            
            // Raised inner panel
            translate([0, -drawer_recess/2 - 1, 0])
            rotate([90, 0, 0])
            linear_extrude(1)
                rounded_square(drawer_w - 10, drawer_h - 10, 3);
            
            // Drawer Knob
            translate([0, -drawer_recess - 1, 0])
            rotate([-90, 0, 0]) {
                cylinder(h=5, d1=10, d2=6);
                translate([0, 0, 5]) cylinder(h=8, d=6);
                translate([0, 0, 13]) sphere(d=14);
                translate([0, 0, 19]) sphere(d=6);
            }
        }
    }
}

// Front Logo Plaque
module logo_plaque() {
    rotate([90, 0, 0]) {
        union() {
            // Oval base plate
            scale([1, plaque_h/plaque_w, 1]) 
                cylinder(h=plaque_thick, d=plaque_w, center=true);
            
            // Outer raised rim
            translate([0, 0, plaque_thick/2])
            scale([1, plaque_h/plaque_w, 1])
            difference() {
                cylinder(h=1, d=plaque_w, center=false);
                translate([0, 0, -0.1]) cylinder(h=1.2, d=plaque_w - 4, center=false);
            }
            
            // Text
            translate([0, 0, plaque_thick/2])
            linear_extrude(1)
                text("Fusion 360", size=4.5, font="Arial:style=Bold", halign="center", valign="center");
            
            // Side rivets
            translate([plaque_w/2 - 4, 0, plaque_thick/2]) sphere(d=2);
            translate([-plaque_w/2 + 4, 0, plaque_thick/2]) sphere(d=2);
        }
    }
}

// Hopper Assembly
module hopper() {
    union() {
        // Base mounting ring
        cylinder(h=4, d=hopper_base_dia + 10);
        translate([0, 0, 4]) cylinder(h=2, d=hopper_base_dia + 4);
        
        // Main Bowl
        difference() {
            // Outer cone
            cylinder(h=hopper_h, d1=hopper_base_dia, d2=hopper_top_dia);
            // Inner cone (hollowed out)
            translate([0, 0, hopper_thick])
                cylinder(h=hopper_h + 1, d1=hopper_base_dia - 2*hopper_thick, d2=hopper_top_dia - 2*hopper_thick);
        }
        
        // Top rolled rim
        translate([0, 0, hopper_h])
        rotate_extrude()
            translate([hopper_top_dia/2 - hopper_thick/2, 0, 0])
                circle(d=hopper_thick * 1.8);
                
        // Internal mechanism rings (visual representation)
        translate([0, 0, hopper_thick]) {
            for(d = [30 : 10 : hopper_base_dia - 15]) {
                difference() {
                    cylinder(h=3, d=d);
                    translate([0, 0, -0.1]) cylinder(h=3.2, d=d-4);
                }
            }
        }
        
        // Central Shaft Housing
        cylinder(h=shaft_h, d=shaft_dia);
        // Base of shaft
        cylinder(h=hopper_thick + 8, d=shaft_dia + 12);
    }
}

// Crank Handle Assembly
module crank_handle() {
    z_offset = arm_angled_len * sin(arm_angle);
    x_offset_1 = arm_straight_len;
    x_offset_2 = x_offset_1 + arm_angled_len * cos(arm_angle);
    
    // 2D Profile of the bent arm
    module arm_profile() {
        polygon([
            [0, 0],
            [x_offset_1, 0],
            [x_offset_2, z_offset],
            [x_offset_2 + arm_end_len, z_offset],
            [x_offset_2 + arm_end_len, z_offset + arm_thick],
            [x_offset_2 - 2, z_offset + arm_thick],
            [x_offset_1 - 2, arm_thick],
            [0, arm_thick]
        ]);
    }

    union() {
        // The metal arm
        rotate([90, 0, 0]) 
            linear_extrude(height=arm_w, center=true) 
                arm_profile();
                
        // Rounded end caps for the arm
        translate([0, 0, 0]) cylinder(h=arm_thick, d=arm_w);
        translate([x_offset_2 + arm_end_len, 0, z_offset]) cylinder(h=arm_thick, d=arm_w);
        
        // Center Hex Nut
        translate([0, 0, arm_thick]) {
            difference() {
                cylinder(h=6, d=14, $fn=6); // Hexagon
                translate([0, 0, 4]) cylinder(h=3, d=8); // Top indent
            }
            // Washer
            translate([0, 0, -1]) cylinder(h=1, d=18);
        }
        
        // Wooden Knob
        translate([x_offset_2 + arm_end_len - 5, 0, z_offset + arm_thick]) {
            // Rivet head
            translate([0, 0, -arm_thick - 1]) cylinder(h=2, d=8);
            
            // Knob body
            cylinder(h=3, d=14);
            translate([0, 0, 3]) cylinder(h=4, d1=14, d2=8);
            translate([0, 0, 7]) cylinder(h=8, d=8);
            translate([0, 0, 15]) sphere(d=18);
            translate([0, 0, 23]) sphere(d=8);
            translate([0, 0, 26]) sphere(d=4);
        }
    }
}


// ==========================================
// MAIN ASSEMBLY
// ==========================================

module coffee_grinder() {
    
    // 1. Bottom Base Plate
    color("#8a8a8a")
    decorative_plate(plate_w, plate_d, plate_h, corner_radius);
    
    // 2. Main Wooden Box
    color("#9c9c9c")
    translate([0, 0, plate_h]) {
        difference() {
            // Outer Box
            translate([0, 0, box_h/2]) 
                cube([box_w, box_d, box_h], center=true);
                
            // Drawer Cutout
            translate([0, -box_d/2 + drawer_depth/2 - 1, drawer_h/2 + 2])
                cube([drawer_w + 1, drawer_depth, drawer_h + 1], center=true);
        }
    }
    
    // 3. Drawer
    color("#9c9c9c")
    translate([0, 0, plate_h + drawer_h/2 + 2])
        drawer();
        
    // 4. Logo Plaque
    color("#666666")
    translate([0, -box_d/2, plate_h + box_h - 15])
        logo_plaque();
        
    // 5. Top Plate
    color("#8a8a8a")
    translate([0, 0, plate_h + box_h])
        decorative_plate(plate_w, plate_d, plate_h, corner_radius);
        
    // 6. Hopper (Metal Bowl)
    color("#b0b0b0")
    translate([0, 0, plate_h * 2 + box_h])
        hopper();
        
    // 7. Crank Handle Assembly
    color("#555555")
    translate([0, 0, plate_h * 2 + box_h + shaft_h])
        // Rotate handle to match the aesthetic angle in the picture
        rotate([0, 0, -30]) 
            crank_handle();
            
}

// Render the model
coffee_grinder();