// Vintage CRT TV OpenSCAD Model
// All dimensions in millimeters

// --- Parameters ---
// Main TV Dimensions
tv_width = 180;          // Front width of the television
tv_height = 140;         // Total height of the TV
tv_depth = 90;           // Depth from front to back

// Screen & Bezel
bezel_thickness = 8;     // Width of the raised bezel around the screen
screen_inset = 4;        // Depth the screen is recessed from the bezel

// Control Panel (Right Side)
control_panel_width = 25; // Width of the right-hand control panel
speaker_height = 50;     // Height of the speaker grille area
button_count = 4;        // Number of control buttons above speaker
button_size = 5;         // Size of each control button

// Antennas
antenna_length = 110;    // Length of each antenna rod
antenna_diameter = 1.5;  // Diameter of antenna rods
antenna_tip_diameter = 3;// Diameter of antenna end caps
antenna_angle = 40;      // Angle of antennas from vertical (degrees)
antenna_spacing = 40;    // Distance between the two antennas on top

// Back Housing (Rear Section)
back_housing_width = 60; // Width of the rear housing
back_housing_depth = 20; // Depth of the rear housing
back_housing_height = 110;// Height of the rear housing

// --- Helper Modules ---
// Single antenna with tip
module single_antenna() {
    color("silver", 0.9)
        cylinder(h=antenna_length, d=antenna_diameter, center=false, $fn=20);
    color("black")
        translate([0, 0, antenna_length])
            sphere(d=antenna_tip_diameter, $fn=15);
}

// Control panel with buttons and speaker
module control_panel() {
    // Base control panel
    color("gray")
        translate([tv_width - control_panel_width, 0, 0])
            cube([control_panel_width, tv_depth, tv_height], center=false);
    
    // Speaker grille (dark inset area)
    color("black")
        translate([tv_width - control_panel_width + 2, 0, 2])
            cube([control_panel_width - 4, tv_depth, speaker_height], center=false);
    
    // Control buttons (above speaker)
    for (i = [0 : button_count-1]) {
        color("lightgray")
            translate([tv_width - control_panel_width + 3 + i*(control_panel_width - 6)/button_count, 
                       0, 
                       speaker_height + 8 + i*(button_size + 3)])
                cube([control_panel_width - 8, 4, button_size], center=false);
    }
}

// Screen and bezel assembly
module screen_assembly() {
    // Raised bezel frame
    color("gray")
        difference() {
            cube([tv_width - control_panel_width, tv_depth, tv_height], center=false);
            // Cut out the inner screen area
            translate([bezel_thickness, -1, bezel_thickness])
                cube([tv_width - control_panel_width - bezel_thickness*2, 
                      tv_depth + 2, 
                      tv_height - bezel_thickness*2], center=false);
        }
    
    // Recessed CRT screen (slightly tapered for realism)
    color("darkgray", 0.8)
        translate([bezel_thickness + screen_inset, 
                   tv_depth/2, 
                   bezel_thickness + screen_inset])
            rotate([90, 0, 0])
                cylinder(h=tv_depth - screen_inset*2, 
                         r1=(tv_width - control_panel_width - bezel_thickness*2 - screen_inset*2)/2,
                         r2=(tv_width - control_panel_width - bezel_thickness*2 - screen_inset*2)/2 - 10,
                         center=true, $fn=50);
}

// --- Main Assembly ---
module vintage_tv() {
    union() {
        // Main outer cabinet
        color("gray")
            cube([tv_width, tv_depth, tv_height], center=false);
        
        // Screen and bezel (left side)
        screen_assembly();
        
        // Control panel (right side)
        control_panel();
        
        // Rear housing (back section)
        color("gray")
            translate([tv_width/2 - back_housing_width/2, 
                       tv_depth - back_housing_depth, 
                       0])
                cube([back_housing_width, back_housing_depth, back_housing_height], center=false);
        
        // Antennas on top
        translate([tv_width/2 - antenna_spacing/2, tv_depth/2, tv_height])
            rotate([antenna_angle, 0, 0])
                single_antenna();
        translate([tv_width/2 + antenna_spacing/2, tv_depth/2, tv_height])
            rotate([antenna_angle, 0, 180])
                single_antenna();
    }
}

// Render the complete model
vintage_tv();