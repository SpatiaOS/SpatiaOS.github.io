// Retro CRT Television Model
// Parametric OpenSCAD design based on classic 1980s/90s TV aesthetic

// ============================================
// PARAMETERS (all dimensions in mm)
// ============================================

// Overall TV Cabinet Dimensions
tv_width = 120;          // Total width of the TV
tv_height = 90;          // Total height of the TV
tv_depth = 70;           // Depth from front to back
corner_radius = 4;       // Rounding radius for cabinet corners
wall_thickness = 3;      // Thickness of cabinet walls

// Screen/CRT Parameters
screen_width = 75;       // Width of visible screen area
screen_height = 60;      // Height of visible screen area
screen_depth = 15;       // How far the CRT tube protrudes/curves back
bezel_width = 8;         // Width of the frame around screen
bezel_depth = 5;         // Depth of the bezel (how much it sticks out)

// Control Panel Parameters (right side)
panel_width = 22;        // Width of control panel section
speaker_height = 40;     // Height of speaker grille area
button_area_height = 25; // Height of button/control area
button_rows = 4;         // Number of button rows
button_cols = 3;         // Number of button columns
button_size = 4;         // Size of individual buttons

// Antenna Parameters
antenna_base_width = 12;
antenna_base_length = 30;
antenna_base_height = 6;
antenna_length = 80;     // Length of each antenna rod
antenna_diameter = 1.2;  // Thickness of antenna rods
antenna_angle_spread = 50; // Angle between the two antennas (degrees)
antenna_tilt_forward = 25; // Forward tilt angle (degrees)

// Resolution
$fn = 50;                // Global fragment count for smooth curves

// ============================================
// MODULES
// ============================================

// Main TV Cabinet Body - Rounded rectangular box
module tv_cabinet() {
    // Create main body using hull of spheres for smooth rounding
    hull() {
        // Bottom corners
        translate([-(tv_width/2-corner_radius), -(tv_depth/2-corner_radius), -(tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([(tv_width/2-corner_radius), -(tv_depth/2-corner_radius), -(tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([-(tv_width/2-corner_radius), (tv_depth/2-corner_radius), -(tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([(tv_width/2-corner_radius), (tv_depth/2-corner_radius), -(tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        
        // Top corners
        translate([-(tv_width/2-corner_radius), -(tv_depth/2-corner_radius), (tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([(tv_width/2-corner_radius), -(tv_depth/2-corner_radius), (tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([-(tv_width/2-corner_radius), (tv_depth/2-corner_radius), (tv_height/2-corner_radius)])
            sphere(r=corner_radius);
        translate([(tv_width/2-corner_radius), (tv_depth/2-corner_radius), (tv_height/2-corner_radius)])
            sphere(r=corner_radius);
    }
}

// CRT Screen Tube - Curved glass effect
module crt_screen() {
    // Position screen in left portion of front face
    screen_x_offset = -(tv_width/2) + bezel_width + screen_width/2 + 5;
    screen_y_offset = 0;
    screen_z_offset = 0;
    
    translate([screen_x_offset, screen_y_offset, screen_z_offset]) {
        // Create curved screen using rotate_extrude approximation or scaled sphere intersection
        // The screen bulges outward slightly (convex toward viewer)
        
        difference() {
            // Main curved screen surface - use scaled sphere segment
            scale([screen_width/(screen_depth*2), screen_height/(screen_depth*2), 1])
                sphere(r=screen_depth);
            
            // Cut off back and sides to make flat where it meets the cabinet
            translate([0, 0, -screen_depth*2])
                cube([screen_width*2, screen_height*2, screen_depth*4], center=true);
                
            // Cut sides to fit in opening
            translate([-screen_width, 0, 0])
                cube([screen_width, screen_height*2, screen_depth*2], center=true);
            translate([screen_width, 0, 0])
                cube([screen_width, screen_height*2, screen_depth*2], center=true);
            translate([0, -screen_height, 0])
                cube([screen_width*2, screen_height, screen_depth*2], center=true);
            translate([0, screen_height, 0])
                cube([screen_width*2, screen_height, screen_depth*2], center=true);
        }
    }
}

// Screen Bezel/Frame around the CRT
module screen_bezel() {
    // Position matches screen position
    screen_x_center = -(tv_width/2) + bezel_width + screen_width/2 + 5;
    bezel_outer_w = screen_width + 2*bezel_width;
    bezel_outer_h = screen_height + 2*bezel_width;
    
    translate([screen_x_center, tv_depth/2 - bezel_depth/2, 0]) {
        // Frame around screen - rectangular with inner cutout
        difference() {
            // Outer frame
            cube([bezel_outer_w, bezel_depth, bezel_outer_h], center=true);
            
            // Inner cutout for screen (slightly smaller than screen for overlap)
            cube([screen_width+1, bezel_depth+2, screen_height+1], center=true);
        }
    }
}

// Side and top trim pieces that complete the bezel look
module bezel_trim() {
    screen_x_center = -(tv_width/2) + bezel_width + screen_width/2 + 5;
    bezel_outer_w = screen_width + 2*bezel_width;
    bezel_outer_h = screen_height + 2*bezel_width;
    
    color("gray") {
        // Top trim
        translate([screen_x_center, 0, tv_height/2 - bezel_width/2])
            cube([bezel_outer_w, tv_depth, bezel_width], center=true);
        
        // Bottom trim  
        translate([screen_x_center, 0, -tv_height/2 + bezel_width/2])
            cube([bezel_outer_w, tv_depth, bezel_width], center=true);
            
        // Left side trim
        translate([-(tv_width/2) + bezel_width/2 + 2, 0, 0])
            cube([bezel_width, tv_depth, tv_height - 2*bezel_width], center=true);
    }
}

// Control Panel - Right side with buttons and speaker
module control_panel() {
    panel_x = tv_width/2 - panel_width/2 - 2;
    
    translate([panel_x, tv_depth/2 - wall_thickness/2, 0]) {
        // Speaker grille (lower portion)
        color("black") {
            translate([0, 0, -tv_height/4 - 5])
                cube([panel_width - 4, wall_thickness + 1, speaker_height], center=true);
        }
        
        // Button array (upper portion)
        color("darkgray") {
            translate([0, 0, tv_height/4 + 5]) {
                // Button plate background
                cube([panel_width - 4, wall_thickness + 1, button_area_height], center=true);
                
                // Individual buttons
                for (row = [0 : button_rows-1]) {
                    for (col = [0 : button_cols-1]) {
                        translate([
                            (col - (button_cols-1)/2) * (button_size + 2),
                            0,
                            (row - (button_rows-1)/2) * (button_size + 2)
                        ]) {
                            // Slightly raised button
                            cube([button_size, 1.5, button_size], center=true);
                        }
                    }
                }
            }
        }
    }
}

// Antenna Base - The housing on top where antennas attach
module antenna_base() {
    base_x = 0;  // Centered on top
    base_y = 5;  // Slightly toward back
    
    translate([base_x, base_y, tv_height/2]) {
        // Base platform
        color("gray") 
            cube([antenna_base_width, antenna_base_length, antenna_base_height], center=true);
        
        // Two pivot points for antennas
        pivot_spacing = 8;
        color("darkgray") {
            translate([-pivot_spacing/2, 0, antenna_base_height/2])
                cylinder(h=3, d=4);
            translate([pivot_spacing/2, 0, antenna_base_height/2])
                cylinder(h=3, d=4);
        }
    }
}

// Single Antenna Rod
module antenna_rod(length, diameter) {
    // Tapered rod - thicker at base, thinner at tip
    color("silver") {
        cylinder(h=length, d=diameter, $fn=20);
        // Small ball at tip
        translate([0, 0, length])
            sphere(d=diameter * 1.5, $fn=20);
    }
}

// Complete Antenna Assembly
module antennas() {
    base_x = 0;
    base_y = 5;
    pivot_spacing = 8;
    
    translate([base_x, base_y, tv_height/2 + antenna_base_height/2]) {
        // Left antenna
        translate([-pivot_spacing/2, 0, 2]) {
            rotate([antenna_tilt_forward, 0, -antenna_angle_spread/2])
                antenna_rod(antenna_length, antenna_diameter);
        }
        
        // Right antenna
        translate([pivot_spacing/2, 0, 2]) {
            rotate([antenna_tilt_forward, 0, antenna_angle_spread/2])
                antenna_rod(antenna_length, antenna_diameter);
        }
    }
}

// Back of TV - slightly protruding section for CRT bulk
module tv_back() {
    back_depth = 20;  // How much the back sticks out
    back_width = tv_width - 10;
    back_height = tv_height - 15;
    
    color("gray") {
        translate([0, tv_depth/2 + back_depth/2 - 5, -5])
            cube([back_width, back_depth, back_height], center=true);
    }
}

// Ventilation slots on top/back
module ventilation() {
    slot_width = 30;
    slot_length = tv_depth * 0.6;
    slot_depth = 1.5;
    num_slots = 8;
    
    color("darkgray") {
        for (i = [0 : num_slots-1]) {
            translate([
                -10 + i * 4,
                tv_depth/2 - slot_length/2 - 5,
                tv_height/2 - 1
            ])
                cube([slot_width/num_slots - 1, slot_length, slot_depth], center=true);
        }
    }
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // Main cabinet body
    difference() {
        tv_cabinet();
        
        // Hollow out the interior (optional - makes it a shell)
        // For solid print, comment this out:
        /*
        scale([0.85, 0.80, 0.88])
            tv_cabinet();
        */
        
        // Cutout for screen area
        screen_x_center = -(tv_width/2) + bezel_width + screen_width/2 + 5;
        translate([screen_x_center, tv_depth/2 + 1, 0])
            cube([screen_width + 4, tv_depth, screen_height + 4], center=true);
    }
    
    // Screen components
    crt_screen();
    screen_bezel();
    bezel_trim();
    
    // Control panel
    control_panel();
    
    // Antenna system
    antenna_base();
    antennas();
    
    // Back section
    tv_back();
    
    // Ventilation details
    ventilation();
}