// --- PARAMETERS ---

// General TV Dimensions
tv_width = 160;
tv_height = 105;
tv_depth = 75;
corner_radius = 2;

// Rear CRT Housing
rear_width = 90;
rear_height = 75;
rear_depth = 35;

// Front Face Layout
front_margin = 4;
divider_width = 3;
recess_depth = 3;

// Screen Panel Dimensions
screen_panel_w = 105;
screen_panel_h = tv_height - (front_margin * 2);

// Screen Bezel & Glass
bezel_depth = 14;
bezel_border = 6;
glass_curve_radius = 120;

// Control Panel Dimensions
control_panel_w = tv_width - screen_panel_w - divider_width - (front_margin * 2);
control_panel_h = screen_panel_h;

// Antenna Parameters
antenna_length_1 = 60;
antenna_length_2 = 50;
antenna_spread_angle = 35;
antenna_back_angle = 20;

// Resolution
$fn = 60;

// --- MAIN ASSEMBLY ---

// Center the entire model for convenience
translate([0, 0, tv_height/2]) {
    build_tv();
}

// --- MODULES ---

module build_tv() {
    union() {
        main_chassis();
        screen_assembly();
        control_panel_assembly();
        antenna_assembly();
    }
}

module main_chassis() {
    color("gray")
    difference() {
        union() {
            // Main body
            cube([tv_width, tv_depth, tv_height], center=true);
            
            // Rear CRT housing protrusion
            translate([0, (tv_depth + rear_depth)/2 - 1, 0])
                cube([rear_width, rear_depth, rear_height], center=true);
        }
        
        // Front main recess (creates the outer rim)
        translate([0, -tv_depth/2 + recess_depth/2 - 0.1, 0])
            cube([tv_width - front_margin*2, recess_depth + 0.2, tv_height - front_margin*2], center=true);
    }
    
    // Vertical divider between screen and control panel
    color("gray")
    translate([(screen_panel_w - control_panel_w)/2, -tv_depth/2 + recess_depth/2, 0])
        cube([divider_width, recess_depth, tv_height - front_margin*2], center=true);
}

module screen_assembly() {
    // Center position for the screen section
    screen_x = -(tv_width/2) + front_margin + (screen_panel_w/2);
    screen_y = -tv_depth/2 + recess_depth;
    
    translate([screen_x, screen_y, 0]) {
        // Sloped Bezel
        color("darkgray")
        difference() {
            // Bezel block
            translate([0, bezel_depth/2, 0])
                cube([screen_panel_w, bezel_depth, screen_panel_h], center=true);
            
            // Sloped cutout for the screen
            hull() {
                // Outer opening
                translate([0, 0, 0])
                    cube([screen_panel_w - bezel_border*2, 0.1, screen_panel_h - bezel_border*2], center=true);
                // Inner opening
                translate([0, bezel_depth + 0.1, 0])
                    cube([screen_panel_w - bezel_border*6, 0.1, screen_panel_h - bezel_border*6], center=true);
            }
        }
        
        // CRT Glass Screen
        color("#2a2a2a")
        intersection() {
            // Bounding box to trim the sphere
            translate([0, bezel_depth/2, 0])
                cube([screen_panel_w - bezel_border*2, bezel_depth, screen_panel_h - bezel_border*2], center=true);
            
            // Large sphere to create the curved screen surface
            translate([0, glass_curve_radius + bezel_depth - 2, 0])
                sphere(r=glass_curve_radius, $fn=100);
        }
    }
}

module control_panel_assembly() {
    // Center position for the control panel section
    panel_x = (tv_width/2) - front_margin - (control_panel_w/2);
    panel_y = -tv_depth/2 + recess_depth;
    
    translate([panel_x, panel_y, 0]) {
        // Control panel base block
        color("gray")
        translate([0, recess_depth/2, 0])
            cube([control_panel_w, recess_depth, control_panel_h], center=true);
            
        // Top section: Dials, Sliders, and Buttons
        translate([0, 0, control_panel_h/4 + 5]) {
            // Small indicator lights / top buttons
            for (i = [-1, 1]) {
                color("silver")
                translate([i * 10, -0.5, 18])
                    cube([8, 2, 4], center=true);
            }
            
            // Horizontal slider tracks
            for (y = [0 : -6 : -18]) {
                color("black")
                translate([0, -0.5, y + 10])
                    cube([control_panel_w - 8, 2, 2], center=true);
                
                // Slider knobs
                color("silver")
                translate([sin(y*20)*5, -1.5, y + 10])
                    cube([4, 3, 4], center=true);
            }
            
            // Bottom row of push buttons
            for (x = [-12, 0, 12]) {
                color("darkgray")
                translate([x, -1, -15])
                    cube([8, 3, 6], center=true);
            }
        }
        
        // Bottom section: Speaker Grille
        speaker_h = control_panel_h / 2.2;
        color("black")
        translate([0, -1, -control_panel_h/2 + speaker_h/2 + 2])
            cube([control_panel_w - 6, 2, speaker_h], center=true);
    }
}

module antenna_assembly() {
    // Antenna base mounted on the top rear
    base_width = 40;
    base_depth = 15;
    base_height = 6;
    
    translate([0, tv_depth/2 - base_depth/2 - 5, tv_height/2 + base_height/2]) {
        // Mounting block
        color("darkgray")
        cube([base_width, base_depth, base_height], center=true);
        
        // Left Antenna
        translate([-base_width/4, 0, base_height/2])
            single_antenna(-antenna_spread_angle);
            
        // Right Antenna
        translate([base_width/4, 0, base_height/2])
            single_antenna(antenna_spread_angle);
    }
}

module single_antenna(angle_x) {
    color("silver")
    rotate([antenna_back_angle, angle_x, 0]) {
        // Base swivel joint
        sphere(d=6);
        
        // Bottom thick rod
        cylinder(h=antenna_length_1, d=2.5);
        
        // Top thin rod (telescopic)
        translate([0, 0, antenna_length_1])
            cylinder(h=antenna_length_2, d=1.2);
            
        // End cap
        translate([0, 0, antenna_length_1 + antenna_length_2])
            cylinder(h=3, d=2.5);
    }
}