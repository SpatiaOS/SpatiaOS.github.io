// ============================================================================
// Antique Coffee Grinder Model
// ============================================================================
// Parametric OpenSCAD model based on the provided image.
// Dimensions are estimated in millimeters.
// ============================================================================

// --- Global Settings ---
$fn = 60; // Resolution for curves

// --- Parameters ---

// Base Dimensions
base_width      = 110;
base_depth      = 110;
base_height     = 90;
base_flange_th  = 6;
base_flange_ext = 10; // Extension of flanges beyond main body
corner_radius   = 5;

// Drawer Dimensions
drawer_height   = 50;
drawer_width    = base_width - 4; // Slightly smaller to fit
drawer_depth    = base_depth - 10;
knob_diameter   = 16;
knob_protrusion = 8;

// Hopper (Bowl) Dimensions
hopper_height   = 80;
hopper_top_r    = 65;
hopper_bot_r    = 48;
hopper_wall_th  = 3;
hopper_rim_th   = 4;
hopper_rim_h    = 6;

// Crank/Handle Dimensions
shaft_diameter  = 10;
shaft_height    = 40; // Height above hopper rim
arm_length      = 80;
arm_width       = 12;
arm_thick       = 4;
handle_knob_r   = 12;
handle_stem_len = 15;

// Colors (for visualization, optional)
color_base      = [0.6, 0.6, 0.6];
color_hopper    = [0.7, 0.7, 0.7];
color_metal     = [0.5, 0.5, 0.5];


// ============================================================================
// Main Assembly
// ============================================================================

module coffee_grinder() {
    // 1. Base Assembly
    translate([0, 0, 0]) {
        base_assembly();
    }

    // 2. Hopper Assembly
    // Positioned on top of the base
    translate([0, 0, base_height + base_flange_th/2]) { 
        // Adjust Z to sit on top flange. 
        // Base total height is roughly base_height + flange thicknesses.
        // Let's assume the main body is base_height, sitting on bottom flange.
        // Top flange is on top of main body.
        
        // Recalculating Z stack:
        // Bottom flange: Z = 0 to base_flange_th
        // Main body: Z = base_flange_th to base_flange_th + base_height
        // Top flange: Z = base_flange_th + base_height to ... + base_flange_th
        
        // Let's restructure the base module to handle its own centering or stacking.
    }
    
    // Let's use a cleaner stacking approach in the execution block below.
}

// --- Execution ---

// Stack logic:
// Bottom Flange (Centered at Z=0? No, let's build from Z=0 up)

// 1. Bottom Flange
translate([0, 0, base_flange_th/2]) {
    rounded_plate(base_width + base_flange_ext*2, base_depth + base_flange_ext*2, base_flange_th, corner_radius*2);
}

// 2. Main Base Body
translate([0, 0, base_flange_th + base_height/2]) {
    base_body();
}

// 3. Top Flange
translate([0, 0, base_flange_th * 2 + base_height + base_flange_th/2]) {
    rounded_plate(base_width + base_flange_ext, base_depth + base_flange_ext, base_flange_th, corner_radius);
}

// 4. Hopper
// Sits on top flange. Top flange top surface is at Z = base_flange_th*2 + base_height + base_flange_th
hopper_z_pos = base_flange_th * 2 + base_height + base_flange_th;
translate([0, 0, hopper_z_pos]) {
    hopper_assembly();
}

// 5. Crank
// Shaft goes into the center of the hopper
translate([0, 0, hopper_z_pos]) {
    crank_assembly();
}


// ============================================================================
// Modules
// ============================================================================

module base_body() {
    color(color_base) {
        difference() {
            // Main box
            cube([base_width, base_depth, base_height], center=true);
            
            // Drawer cutout (front)
            // The drawer is inset.
            translate([0, base_depth/2 - 2, 0]) { // Push to front face
                // Cutout for drawer space
                // We leave a frame around it.
                // Let's just cut a hole for the drawer to slide in/out conceptually, 
                // but in the image, the drawer front IS the front face.
                // So we subtract the internal volume for the drawer box.
                translate([0, 0, -base_height/2 + drawer_height/2 + 10]) { // Vertical position of drawer
                     cube([drawer_width - 2, base_depth - 5, drawer_height], center=true);
                }
            }
            
            // Side guides for drawer (optional detail)
            // Just keeping it simple as a box for now.
        }
        
        // Drawer Front Face
        // It sits slightly proud or flush. In the image, it looks like a panel.
        translate([0, base_depth/2 - 1, -base_height/2 + drawer_height/2 + 10]) {
            drawer_front();
        }
    }
}

module drawer_front() {
    color(color_base) {
        union() {
            // The face plate
            cube([drawer_width, 4, drawer_height], center=true);
            
            // Knob
            translate([0, 3, 0]) {
                cylinder(h=knob_protrusion, d=knob_diameter, center=true);
                sphere(d=knob_diameter, center=true); // Round off the end
            }
            
            // Side handles/guides visible in image? 
            // There are vertical rails on the side of the drawer front.
            translate([drawer_width/2 - 5, 0, 0]) {
                cylinder(h=drawer_height - 10, d=6, center=true);
            }
            translate([-drawer_width/2 + 5, 0, 0]) {
                cylinder(h=drawer_height - 10, d=6, center=true);
            }
        }
    }
}

module rounded_plate(w, d, h, r) {
    color(color_base) {
        // A simple way to make a rounded plate is hull of 4 cylinders
        // Or minkowski of a cube and a cylinder (expensive).
        // Let's use hull of 4 cylinders for efficiency.
        hull() {
            translate([w/2 - r, d/2 - r, 0]) cylinder(h=h, r=r, center=true);
            translate([-w/2 + r, d/2 - r, 0]) cylinder(h=h, r=r, center=true);
            translate([w/2 - r, -d/2 + r, 0]) cylinder(h=h, r=r, center=true);
            translate([-w/2 + r, -d/2 + r, 0]) cylinder(h=h, r=r, center=true);
        }
    }
}

module hopper_assembly() {
    color(color_hopper) {
        difference() {
            // Outer Bowl
            // Tapered cylinder
            // Note: cylinder(r1, r2) creates a cone/frustum.
            // We need to shift it up so the bottom is at Z=0 relative to module
            translate([0, 0, hopper_height/2]) {
                cylinder(h=hopper_height, r1=hopper_bot_r, r2=hopper_top_r, center=true);
            }
            
            // Inner Bowl (Hollow it out)
            translate([0, 0, hopper_height/2]) {
                cylinder(h=hopper_height + 1, r1=hopper_bot_r - hopper_wall_th, r2=hopper_top_r - hopper_wall_th, center=true);
            }
            
            // Bottom hole (for coffee to fall through into base)
            // The hopper sits on the base, so the bottom is open or has a small hole.
            // In the image, there's a mechanism inside.
            // Let's leave the bottom open for the mechanism.
            translate([0, 0, -1]) {
                cylinder(h=10, r=hopper_bot_r - hopper_wall_th + 1, center=true);
            }
        }
        
        // Top Rim/Lip
        translate([0, 0, hopper_height]) {
            difference() {
                cylinder(h=hopper_rim_h, r=hopper_top_r + 2, center=true);
                translate([0, 0, -hopper_rim_h/2]) {
                     cylinder(h=hopper_rim_h + 1, r=hopper_top_r - 1, center=true);
                }
            }
        }
        
        // Internal Ribs/Rings (Decoration/Mechanism housing)
        translate([0, 0, hopper_height * 0.3]) {
            // Calculate radius at this height
            // Linear interpolation of radius
            r_at_h = hopper_bot_r + (hopper_top_r - hopper_bot_r) * 0.3;
            cylinder(h=4, r=r_at_h - 2, center=true);
        }
        
        // Central mechanism housing (The vertical cylinder inside)
        translate([0, 0, hopper_height * 0.4]) {
            cylinder(h=hopper_height * 0.5, r=15, center=true);
        }
    }
}

module crank_assembly() {
    color(color_metal) {
        // Central Shaft
        // Extends from inside the mechanism up through the top
        translate([0, 0, shaft_height/2 + 10]) { // Start slightly inside
            cylinder(h=shaft_height + 20, d=shaft_diameter, center=true);
        }
        
        // Top Nut/Bolt head
        translate([0, 0, shaft_height + 10 + shaft_diameter/2]) {
            // Hex nut approximation or just a cylinder
            cylinder(h=6, d=shaft_diameter * 1.8, center=true);
            // Let's make it look like a square nut or washer
            // cube([12, 12, 4], center=true); 
        }
        
        // Crank Arm
        // It attaches to the shaft and goes out.
        // The image shows a bent arm. Vertical part attached to shaft, horizontal part with handle.
        
        // Vertical attachment bracket
        translate([shaft_diameter/2, 0, shaft_height + 5]) {
            cube([arm_thick, arm_width, 15], center=true);
        }
        
        // Horizontal Arm
        // Rotated 90 degrees to stick out
        // The arm seems to be at a specific height.
        translate([arm_length/2 + shaft_diameter/2, 0, shaft_height + 5]) {
            cube([arm_length, arm_width, arm_thick], center=true);
        }
        
        // Handle Knob Assembly
        translate([arm_length + shaft_diameter/2, 0, shaft_height + 5]) {
            // Stem
            cylinder(h=handle_stem_len, d=6, center=true);
            // Knob (Sphere-ish)
            translate([0, 0, handle_stem_len/2]) {
                sphere(r=handle_knob_r);
            }
            // End cap/washer
            translate([0, 0, handle_stem_len]) {
                cylinder(h=2, d=10, center=true);
            }
        }
    }
}