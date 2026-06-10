// ==========================================
// Parametric Axial Cooling Fan
// Recreates a standard open-frame case fan (e.g., 120 mm)
// ==========================================

// --- Overall Dimensions ---
fan_size          = 120;    // Outer square width/depth (mm)
fan_thickness     = 25;     // Total thickness (mm)
corner_radius     = 5;      // Outer corner fillet radius (mm)
bore_diameter     = 110;    // Inner circular airflow opening (mm)

// --- Frame Construction ---
frame_plate_thick = 2.5;    // Thickness of top/bottom rim plates (mm)
post_diameter     = 13;     // Corner support post diameter (mm)

// --- Mounting Holes ---
hole_spacing      = 105;    // Center-to-center of corner holes (mm)
hole_diameter     = 4.3;    // Through-hole for M4 screw (mm)
cbore_diameter    = 8.0;    // Counterbore diameter (mm)
cbore_depth       = 1.5;    // Counterbore depth (mm)

// --- Rotor Hub ---
hub_diameter      = 38;     // Central motor hub diameter (mm)
hub_height        = fan_thickness - 2;  // Hub height, slightly less than frame (mm)

// --- Blade Parameters ---
blade_count       = 7;
blade_thickness   = 1.2;    // Material thickness (mm)
blade_span        = fan_thickness - 2*frame_plate_thick - 1; // Vertical clearance (mm)

blade_root_r      = hub_diameter/2 + 1;   // Blade start radius (mm)
blade_tip_r       = bore_diameter/2 - 3;  // Blade end radius (mm)
blade_mid_r       = (blade_root_r + blade_tip_r)/2;

blade_root_chord  = 24;     // Root chord length (mm)
blade_mid_chord   = 18;     // Mid chord length (mm)
blade_tip_chord   = 12;     // Tip chord length (mm)

blade_sweep       = 38;     // Planform sweep from root to tip (deg)
blade_pitch_root  = 42;     // Pitch at root (deg)
blade_pitch_mid   = 28;     // Pitch at mid (deg)
blade_pitch_tip   = 16;     // Pitch at tip (deg)

// --- Render Quality ---
$fn = 100;

// ==========================================
// 2D Frame Plate Profile
// Outer rounded square minus central circular bore
// ==========================================
module frame_profile() {
    difference() {
        // Outer rounded square
        offset(r = corner_radius)
            square([fan_size - 2*corner_radius, fan_size - 2*corner_radius], center = true);
        
        // Inner bore
        circle(d = bore_diameter);
    }
}

// ==========================================
// Corner Post
// Connects top and bottom plates at each corner
// ==========================================
module corner_post() {
    cylinder(h = fan_thickness, d = post_diameter);
}

// ==========================================
// Mounting Hole with Counterbore
// Subtractive feature used at all four corners
// ==========================================
module mounting_hole() {
    // Through hole
    translate([0, 0, -1])
        cylinder(h = fan_thickness + 2, d = hole_diameter);
    
    // Top counterbore
    translate([0, 0, fan_thickness - cbore_depth])
        cylinder(h = cbore_depth + 1, d = cbore_diameter);
    
    // Bottom counterbore
    translate([0, 0, -1])
        cylinder(h = cbore_depth + 1, d = cbore_diameter);
}

// ==========================================
// Single Fan Blade
// Approximated by hull of three swept/pitched sections
// ==========================================
module blade() {
    hull() {
        // Root section
        translate([blade_root_r, 0, 0])
        rotate([0, blade_pitch_root, 0])
            cube([blade_root_chord, blade_thickness, blade_span], center = true);
        
        // Mid section
        translate([blade_mid_r * cos(blade_sweep/2), blade_mid_r * sin(blade_sweep/2), 0])
        rotate([0, blade_pitch_mid, blade_sweep/2])
            cube([blade_mid_chord, blade_thickness, blade_span], center = true);
        
        // Tip section
        translate([blade_tip_r * cos(blade_sweep), blade_tip_r * sin(blade_sweep), 0])
        rotate([0, blade_pitch_tip, blade_sweep])
            cube([blade_tip_chord, blade_thickness, blade_span], center = true);
    }
}

// ==========================================
// Rotor Assembly (Hub + Blades)
// Centered vertically in the frame
// ==========================================
module fan_rotor() {
    translate([0, 0, fan_thickness/2]) {
        // Central hub
        cylinder(h = hub_height, d = hub_diameter, center = true);
        
        // Array of blades
        for (i = [0 : blade_count - 1]) {
            rotate([0, 0, i * 360 / blade_count])
                blade();
        }
    }
}

// ==========================================
// Stationary Frame
// Top/bottom rims, corner posts, and mounting holes
// ==========================================
module fan_frame() {
    difference() {
        union() {
            // Bottom rim plate
            linear_extrude(height = frame_plate_thick)
                frame_profile();
            
            // Top rim plate
            translate([0, 0, fan_thickness - frame_plate_thick])
                linear_extrude(height = frame_plate_thick)
                    frame_profile();
            
            // Four corner posts
            for (x = [-1, 1], y = [-1, 1]) {
                translate([x * hole_spacing/2, y * hole_spacing/2, 0])
                    corner_post();
            }
        }
        
        // Subtract mounting holes at corners
        for (x = [-1, 1], y = [-1, 1]) {
            translate([x * hole_spacing/2, y * hole_spacing/2, 0])
                mounting_hole();
        }
    }
}

// ==========================================
// Final Assembly
// ==========================================
union() {
    fan_frame();
    fan_rotor();
}