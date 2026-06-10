// Retro CRT Television Set with Rabbit Ear Antennas
// Dimensions estimated from proportions in the image

// === Parameters ===
// Main body dimensions
body_width = 400;
body_height = 280;
body_depth = 300;
wall_thickness = 8;

// Front bezel
bezel_thickness = 12;
bezel_border = 15;
bezel_corner_r = 8;

// Screen area (left ~70% of front)
screen_ratio = 0.68;
screen_width = body_width * screen_ratio - bezel_border * 2 - 10;
screen_height = body_height - bezel_border * 2 - 40;
screen_depth = 5;
screen_corner_r = 15;
screen_recess = 6;

// Control panel (right side)
control_width = body_width * (1 - screen_ratio) - bezel_border - 5;
control_height = body_height - bezel_border * 2 - 20;
control_x_offset = body_width * screen_ratio + 5;

// Buttons
button_rows = 4;
button_cols = 3;
button_size = 12;
button_spacing = 18;
button_depth = 3;

// Antenna parameters
antenna_length = 250;
antenna_diameter = 3;
antenna_base_size = 15;
antenna_base_height = 8;
antenna_left_angle_z = -25;
antenna_left_angle_y = 65;
antenna_right_angle_z = 35;
antenna_right_angle_y = 55;

// Body taper (back is narrower than front)
taper_amount = 30;

// Resolution
$fn = 60;

// === Modules ===

// Rounded rectangle for 2D profiles
module rounded_rect(w, h, r) {
    offset(r = r)
        square([w - 2*r, h - 2*r], center = true);
}

// Main TV body with CRT taper
module tv_body() {
    // Tapered body - wider at front, narrower at back
    hull() {
        // Front face
        translate([body_width/2, 0, body_height/2])
            rotate([-90, 0, 0])
            linear_extrude(height = 0.1)
            rounded_rect(body_width, body_height, 5);
        
        // Back face (smaller due to CRT taper)
        translate([body_width/2, body_depth, body_height/2])
            rotate([-90, 0, 0])
            linear_extrude(height = 0.1)
            rounded_rect(body_width - taper_amount, body_height - taper_amount/2, 5);
    }
}

// Hollow interior
module tv_body_hollow() {
    difference() {
        tv_body();
        
        // Hollow out the inside
        translate([wall_thickness, -1, wall_thickness])
        hull() {
            translate([body_width/2 - wall_thickness, 0, body_height/2 - wall_thickness])
                rotate([-90, 0, 0])
                linear_extrude(height = 0.1)
                rounded_rect(body_width - wall_thickness*2, body_height - wall_thickness*2, 3);
            
            translate([body_width/2 - wall_thickness, body_depth - wall_thickness, body_height/2 - wall_thickness])
                rotate([-90, 0, 0])
                linear_extrude(height = 0.1)
                rounded_rect(body_width - taper_amount - wall_thickness*2, body_height - taper_amount/2 - wall_thickness*2, 3);
        }
    }
}

// Front bezel frame
module front_bezel() {
    translate([0, -bezel_thickness, 0])
    difference() {
        // Outer bezel
        hull() {
            translate([body_width/2, 0, body_height/2])
                rotate([-90, 0, 0])
                linear_extrude(height = bezel_thickness)
                rounded_rect(body_width + 4, body_height + 4, bezel_corner_r);
            
            translate([body_width/2, bezel_thickness, body_height/2])
                rotate([-90, 0, 0])
                linear_extrude(height = 0.1)
                rounded_rect(body_width, body_height, 5);
        }
        
        // Screen cutout
        translate([bezel_border + screen_width/2 + 5, -1, bezel_border + screen_height/2 + 20])
            rotate([-90, 0, 0])
            linear_extrude(height = bezel_thickness + 2)
            rounded_rect(screen_width + 4, screen_height + 4, screen_corner_r);
        
        // Control panel cutout (lower dark area)
        translate([control_x_offset + control_width/2, -1, body_height/2 - 20])
            rotate([-90, 0, 0])
            linear_extrude(height = bezel_thickness + 2)
            rounded_rect(control_width, control_height - 40, 3);
    }
}

// Screen (slightly convex/curved CRT screen)
module screen() {
    screen_x = bezel_border + screen_width/2 + 5;
    screen_z = bezel_border + screen_height/2 + 20;
    
    // Screen glass - slightly curved
    translate([screen_x, -bezel_thickness + screen_recess, screen_z])
    rotate([-90, 0, 0]) {
        // Flat approximation with slight bulge
        difference() {
            // Convex screen surface
            resize([screen_width, screen_height, 12])
                sphere(d = screen_width);
            
            // Cut the back flat
            translate([0, 0, -screen_width/2])
                cube([screen_width + 10, screen_height + 10, screen_width], center = true);
        }
    }
    
    // Screen border/gasket
    color([0.2, 0.2, 0.2])
    translate([screen_x, -bezel_thickness + 1, screen_z])
    rotate([-90, 0, 0])
    difference() {
        linear_extrude(height = 2)
            rounded_rect(screen_width + 8, screen_height + 8, screen_corner_r + 2);
        translate([0, 0, -1])
        linear_extrude(height = 4)
            rounded_rect(screen_width - 4, screen_height - 4, screen_corner_r - 2);
    }
}

// Control panel with buttons
module control_panel() {
    panel_x = control_x_offset + control_width/2;
    panel_z = body_height/2 - 20;
    
    // Dark control panel background
    color([0.15, 0.15, 0.15])
    translate([panel_x, -bezel_thickness + 1, panel_z])
        rotate([-90, 0, 0])
        linear_extrude(height = 2)
        rounded_rect(control_width - 4, control_height - 44, 2);
    
    // Button grid (upper portion of control panel)
    button_area_z = panel_z + 15;
    
    for (row = [0 : button_rows - 1]) {
        for (col = [0 : button_cols - 1]) {
            bx = panel_x - (button_cols - 1) * button_spacing / 2 + col * button_spacing;
            bz = button_area_z + 20 - row * button_spacing;
            
            color([0.3, 0.3, 0.3])
            translate([bx, -bezel_thickness - button_depth + 3, bz])
                rotate([-90, 0, 0])
                linear_extrude(height = button_depth)
                rounded_rect(button_size, button_size, 2);
        }
    }
    
    // Power indicator (small circle near top of controls)
    color([0.5, 0.1, 0.1])
    translate([panel_x - 8, -bezel_thickness, panel_z + 58])
        rotate([-90, 0, 0])
        cylinder(h = 2, d = 5);
    
    // Additional indicator
    color([0.5, 0.1, 0.1])
    translate([panel_x, -bezel_thickness, panel_z + 58])
        rotate([-90, 0, 0])
        cylinder(h = 2, d = 5);
    
    translate([panel_x + 8, -bezel_thickness, panel_z + 58])
        rotate([-90, 0, 0])
        cylinder(h = 2, d = 5);
}

// Divider line between screen and control panel
module panel_divider() {
    translate([body_width * screen_ratio - 2, -bezel_thickness - 0.5, bezel_border + 5])
        cube([3, bezel_thickness + 1, body_height - bezel_border * 2 - 10]);
}

// Antenna base mount on top
module antenna_base() {
    // Position on top of the TV, right of center
    translate([body_width * 0.65, body_depth * 0.15, body_height + 2]) {
        // Base block
        color([0.4, 0.4, 0.4])
        difference() {
            hull() {
                cylinder(h = antenna_base_height, d = antenna_base_size);
                translate([20, 0, 0])
                    cylinder(h = antenna_base_height, d = antenna_base_size);
            }
            // Holes for antenna rods
            translate([0, 0, -1])
                cylinder(h = antenna_base_height + 2, d = antenna_diameter + 1);
            translate([20, 0, -1])
                cylinder(h = antenna_base_height + 2, d = antenna_diameter + 1);
        }
    }
}

// Single antenna rod
module antenna_rod(angle_y, angle_z) {
    color([0.6, 0.6, 0.6])
    rotate([0, angle_y, angle_z])
        cylinder(h = antenna_length, d1 = antenna_diameter, d2 = 1.5);
}

// Both antenna rods
module antennas() {
    // Left antenna (taller, angled left and back)
    translate([body_width * 0.65, body_depth * 0.15, body_height + antenna_base_height + 2])
        antenna_rod(antenna_left_angle_y, antenna_left_angle_z);
    
    // Right antenna (shorter, angled right and back)
    translate([body_width * 0.65 + 20, body_depth * 0.15, body_height + antenna_base_height + 2])
        antenna_rod(antenna_right_angle_y, antenna_right_angle_z);
}

// Brand label area
module brand_label() {
    color([0.5, 0.5, 0.5])
    translate([bezel_border + 10, -bezel_thickness - 0.5, bezel_border + 5])
        cube([60, 1, 8]);
}

// Top edge detail / ridge
module top_ridge() {
    translate([body_width/2, body_depth * 0.15, body_height])
        rotate([-90, 0, 0])
        linear_extrude(height = 0.1)
        square([body_width - 20, 4], center = true);
}

// Speaker grille area (on the right side or integrated into control panel)
module speaker_grille() {
    panel_x = control_x_offset + control_width/2;
    panel_z = body_height/2 - 65;
    
    color([0.2, 0.2, 0.2])
    translate([panel_x, -bezel_thickness - 0.5, panel_z]) {
        // Horizontal grille lines
        for (i = [0 : 8]) {
            translate([-(control_width - 20)/2, 0, i * 4])
                cube([control_width - 20, 1, 2]);
        }
    }
}

// Small feet/base
module feet() {
    foot_inset = 30;
    foot_width = 40;
    foot_height = 4;
    foot_depth = 20;
    
    for (x = [foot_inset, body_width - foot_inset - foot_width]) {
        translate([x, body_depth/2 - foot_depth/2, -foot_height])
            cube([foot_width, foot_depth, foot_height]);
    }
}

// === Main Assembly ===
module retro_tv() {
    color([0.65, 0.65, 0.65]) {
        // Main body
        tv_body_hollow();
        
        // Front bezel
        front_bezel();
        
        // Panel divider
        panel_divider();
    }
    
    // Screen
    color([0.35, 0.4, 0.42])
    screen();
    
    // Control panel and buttons
    control_panel();
    
    // Speaker grille
    speaker_grille();
    
    // Antenna base and rods
    antenna_base();
    antennas();
    
    // Brand label
    brand_label();
    
    // Feet
    color([0.3, 0.3, 0.3])
    feet();
}

// Render the TV
retro_tv();