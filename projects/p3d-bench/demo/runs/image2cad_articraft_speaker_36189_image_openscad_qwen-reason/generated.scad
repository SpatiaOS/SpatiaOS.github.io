// Retro-Futuristic Speaker Console
// Parametric OpenSCAD Model

// ==========================================
// Parameters
// ==========================================

// Global Resolution
$fn = 64;

// Main Case Dimensions
case_width = 240;
case_height = 120;
case_depth = 90;
case_wall_thickness = 3;
corner_radius = 4; // For rounding edges

// Speaker Grille Dimensions
speaker_hex_radius = 45;
speaker_inner_radius = 25;
grille_ring_width = 12;
grille_teeth_count = 36;
grille_teeth_depth = 2;

// Center Decoration
center_x_width = 15;
center_x_length = 60;

// Top Panel Controls
control_knob_diameter = 8;
control_knob_height = 4;
control_spacing = 15;

// Legs
leg_height = 110;
leg_top_radius = 14;
leg_bottom_radius = 7;
leg_angle = 15; // Degrees outward
leg_mount_offset_x = 80; // Distance from center X
leg_mount_offset_z = 30; // Distance from center Z (depth wise)

// ==========================================
// Main Assembly
// ==========================================

// Assemble the parts
union() {
    // Main Body
    main_case();
    
    // Legs
    // Front Left
    translate([leg_mount_offset_x, -case_height/2, leg_mount_offset_z]) 
        leg(leg_angle, 180); // Angled forward and left
        
    // Front Right
    translate([-leg_mount_offset_x, -case_height/2, leg_mount_offset_z]) 
        leg(leg_angle, 0); // Angled forward and right (mirrored logic handled in module or rotation)

    // Back Left
    translate([leg_mount_offset_x, case_height/2, -leg_mount_offset_z]) 
        leg(-leg_angle, 0); // Angled backward
        
    // Back Right
    translate([-leg_mount_offset_x, case_height/2, -leg_mount_offset_z]) 
        leg(-leg_angle, 180); // Angled backward
}

// ==========================================
// Modules
// ==========================================

// Module for the main rectangular case with rounded edges
module main_case() {
    // Use hull of spheres to create rounded box efficiently
    // Or just a cube with minkowski for simplicity in this context
    // Given the complexity of the front face, a simple cube with difference is best.
    
    // Base Cube
    difference() {
        // Outer Shell (Rounded via Minkowski - might be slow, let's use a simpler approach: Cube + fillets)
        // Actually, for this specific look, a standard cube with a slight chamfer or just sharp edges is okay, 
        // but the image shows rounded edges.
        // Let's use a hull of 8 spheres for the outer shell.
        hull() {
            // 8 corners
            translate([ case_width/2 - corner_radius,  case_height/2 - corner_radius,  case_depth/2 - corner_radius]) sphere(corner_radius);
            translate([-case_width/2 + corner_radius,  case_height/2 - corner_radius,  case_depth/2 - corner_radius]) sphere(corner_radius);
            translate([ case_width/2 - corner_radius, -case_height/2 + corner_radius,  case_depth/2 - corner_radius]) sphere(corner_radius);
            translate([-case_width/2 + corner_radius, -case_height/2 + corner_radius,  case_depth/2 - corner_radius]) sphere(corner_radius);
            
            translate([ case_width/2 - corner_radius,  case_height/2 - corner_radius, -case_depth/2 + corner_radius]) sphere(corner_radius);
            translate([-case_width/2 + corner_radius,  case_height/2 - corner_radius, -case_depth/2 + corner_radius]) sphere(corner_radius);
            translate([ case_width/2 - corner_radius, -case_height/2 + corner_radius, -case_depth/2 + corner_radius]) sphere(corner_radius);
            translate([-case_width/2 + corner_radius, -case_height/2 + corner_radius, -case_depth/2 + corner_radius]) sphere(corner_radius);
        }
        
        // --- Front Face Details ---
        
        // Left Speaker Recess
        translate([-case_width/4, 0, case_depth/2 + 1]) { // Push slightly out to cut
            rotate([0, 0, 30]) // Align hexagon flat side
            cylinder(h = 10, r = speaker_hex_radius + 2, $fn = 6); 
        }
        
        // Right Speaker Recess
        translate([case_width/4, 0, case_depth/2 + 1]) {
            rotate([0, 0, 30])
            cylinder(h = 10, r = speaker_hex_radius + 2, $fn = 6);
        }

        // Center "X" Decoration Recess
        translate([0, 0, case_depth/2 + 1]) {
            rotate([0, 0, 45]) cube([center_x_length, center_x_width, 10], center=true);
            rotate([0, 0, -45]) cube([center_x_length, center_x_width, 10], center=true);
        }
        
        // Top Panel Lines (Grooves)
        // Divide top into 3 sections
        translate([0, case_height/2 + 1, 0]) {
             rotate([90, 0, 0]) cube([case_width, 2, case_depth], center=true); // Line 1
             translate([case_width/3, 0, 0]) rotate([90, 0, 0]) cube([case_width, 2, case_depth], center=true); // Line 2 (shifted)
             // Correction: The lines go across the depth.
             // Let's redo top grooves.
        }
        
        // Top Grooves (cutting into the top face)
        // The image shows lines dividing the top width-wise? No, length-wise.
        // Looking closely at the image: The top is divided into three panels along the length (X-axis).
        // So lines are parallel to Z-axis.
        translate([-case_width/6, case_height/2 + 1, 0]) rotate([90, 0, 0]) cube([2, 2, case_depth], center=true);
        translate([case_width/6, case_height/2 + 1, 0]) rotate([90, 0, 0]) cube([2, 2, case_depth], center=true);

        // Top Controls Recess (Right side)
        translate([case_width/3, case_height/2 + 1, -case_depth/4]) {
             rotate([90, 0, 0]) cylinder(h=5, r=20); // Recess for knobs
        }
    }
    
    // --- Add Front Face Details (Additive) ---
    
    // Left Speaker Grille
    translate([-case_width/4, 0, case_depth/2 - 1]) { // Slightly inset
        speaker_grille();
    }

    // Right Speaker Grille
    translate([case_width/4, 0, case_depth/2 - 1]) {
        speaker_grille();
    }
    
    // Center X Decoration (Raised)
    translate([0, 0, case_depth/2 + 1]) {
        color("silver")
        union() {
             rotate([0, 0, 45]) cube([center_x_length - 5, center_x_width - 2, 4], center=true);
             rotate([0, 0, -45]) cube([center_x_length - 5, center_x_width - 2, 4], center=true);
        }
    }
    
    // Top Controls (Knobs)
    translate([case_width/3, case_height/2 + 2, -case_depth/4]) {
        // Knob 1
        translate([-control_spacing, 0, 0]) control_knob();
        // Knob 2
        control_knob();
        // Knob 3
        translate([control_spacing, 0, 0]) control_knob();
    }
}

// Module for the detailed speaker grille
module speaker_grille() {
    // Base Hexagon Frame
    difference() {
        // Outer Hexagon
        rotate([0, 0, 30]) cylinder(h = 4, r = speaker_hex_radius, $fn = 6);
        
        // Inner Hexagon (Hollow center)
        rotate([0, 0, 30]) translate([0, 0, -1]) cylinder(h = 6, r = speaker_hex_radius - 8, $fn = 6);
    }
    
    // Inner Decorative Rings
    // Concentric Hexagons
    for (r = [speaker_hex_radius - 12, speaker_hex_radius - 20]) {
        rotate([0, 0, 30]) difference() {
             cylinder(h = 2, r = r, $fn = 6);
             translate([0, 0, -1]) cylinder(h = 4, r = r - 3, $fn = 6);
        }
    }
    
    // Radial Grille Lines (The "teeth")
    // Create a ring of lines
    for (i = [0 : 360/grille_teeth_count : 360]) {
        rotate([0, 0, i]) {
            translate([speaker_inner_radius + 2, 0, 1]) {
                // Small rectangular tooth
                cube([grille_teeth_depth, 2, 3]); 
            }
        }
    }
    
    // Center Speaker Cone
    translate([0, 0, 2]) {
        cylinder(h = 3, r = speaker_inner_radius);
        // Dust cap
        translate([0, 0, 2]) cylinder(h = 2, r = speaker_inner_radius * 0.4);
    }
}

// Module for a single control knob
module control_knob() {
    union() {
        // Base
        cylinder(h = control_knob_height, d = control_knob_diameter);
        // Top indicator line/slot
        translate([0, 0, control_knob_height - 1]) 
            cube([control_knob_diameter + 1, 1, 1], center=true);
    }
}

// Module for a tapered leg
// angle: tilt angle from vertical
// rotation_y: rotation around Y axis to position leg
module leg(angle, rotation_y) {
    rotate([angle, 0, 0]) { // Tilt forward/back
        rotate([0, rotation_y, 0]) { // Rotate around Y to place at corner
            // Tapered cylinder
            // h, r1 (bottom), r2 (top) - wait, standard is r1 bottom, r2 top? 
            // OpenSCAD cylinder: h, r1, r2. r1 is bottom (z=0), r2 is top (z=h).
            // We want thick top, thin bottom.
            translate([0, 0, -leg_height]) // Shift so it attaches at bottom of case
            cylinder(h = leg_height, r1 = leg_bottom_radius, r2 = leg_top_radius);
        }
    }
}