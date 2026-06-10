// ==============================
// Global Parameters
// ==============================
$fn = 64; // Curve smoothness
unit = 1; // mm

// Main Body Dimensions
body_length = 200 * unit;
body_height = 100 * unit;
body_depth = 80 * unit;
body_edge_radius = 2 * unit;

// Leg Dimensions
leg_height = 80 * unit;
leg_top_dia = 8 * unit;
leg_bottom_dia = 5 * unit;
leg_outward_angle = 15; // degrees from vertical

// Speaker Grille Dimensions
speaker_hex_width = 70 * unit; // distance between opposite hex sides
speaker_cone_dia = 45 * unit;
grille_recess_depth = 3 * unit;
grille_slot_count = 30;
grille_slot_width = 2 * unit;

// Front Face Details
x_logo_size = 40 * unit;
x_logo_depth = 1.5 * unit;

// Top Control Details
button_dia = 8 * unit;
button_recess_depth = 1 * unit;
button_spacing = 15 * unit;
panel_line_depth = 0.5 * unit;
panel_line_width = 1 * unit;

// ==============================
// Helper Modules
// ==============================
module rounded_box(w, d, h, r) {
    // Rounded box using Minkowski sum of inner cube and sphere
    minkowski() {
        cube([w - 2*r, d - 2*r, h - 2*r], center=true);
        sphere(r=r);
    }
}

module speaker_grille(hex_size, cone_dia, recess_depth, slot_count, slot_width) {
    // Recessed hexagonal speaker grille with radial slots
    difference() {
        // Hex recess shape
        linear_extrude(height=recess_depth + 0.1)
        circle(d=hex_size, $fn=6);
        
        // Center speaker cone (leave this area uncut)
        translate([0,0,-0.1])
        cylinder(h=recess_depth + 0.2, d=cone_dia);
        
        // Radial slots
        for(i = [0:slot_count-1]) {
            rotate(i * 360 / slot_count)
            translate([cone_dia/2 + 1*unit, 0, 0])
            linear_extrude(height=recess_depth + 0.1)
            square([(hex_size/2 - cone_dia/2 - 2*unit), slot_width], center=true);
        }
    }
}

module leg(height, top_dia, bottom_dia, angle) {
    // Tapered angled support leg
    rotate([-angle, angle, 0])
    cylinder(h=height, r1=top_dia/2, r2=bottom_dia/2, center=false);
}

// ==============================
// Main Assembly
// ==============================
union() {
    // Main body and legs base
    difference() {
        union() {
            // Main rounded enclosure
            translate([0, 0, leg_height + body_height/2])
            rounded_box(body_length, body_depth, body_height, body_edge_radius);
            
            // Four support legs
            translate([-body_length/2 + leg_top_dia/2, -body_depth/2 + leg_top_dia/2, leg_height])
            leg(leg_height, leg_top_dia, leg_bottom_dia, leg_outward_angle);
            
            translate([body_length/2 - leg_top_dia/2, -body_depth/2 + leg_top_dia/2, leg_height])
            rotate([0,0,90])
            leg(leg_height, leg_top_dia, leg_bottom_dia, leg_outward_angle);
            
            translate([-body_length/2 + leg_top_dia/2, body_depth/2 - leg_top_dia/2, leg_height])
            rotate([0,0,-90])
            leg(leg_height, leg_top_dia, leg_bottom_dia, leg_outward_angle);
            
            translate([body_length/2 - leg_top_dia/2, body_depth/2 - leg_top_dia/2, leg_height])
            rotate([0,0,180])
            leg(leg_height, leg_top_dia, leg_bottom_dia, leg_outward_angle);
        }
        
        // ------------------------------
        // Front Face Features
        // ------------------------------
        // Left speaker grille cutout
        translate([-body_length/4, -body_depth/2 - 0.1, leg_height + body_height/2])
        rotate([0,90,0])
        speaker_grille(speaker_hex_width, speaker_cone_dia, grille_recess_depth, grille_slot_count, grille_slot_width);
        
        // Right speaker grille cutout
        translate([body_length/4, -body_depth/2 - 0.1, leg_height + body_height/2])
        rotate([0,90,0])
        speaker_grille(speaker_hex_width, speaker_cone_dia, grille_recess_depth, grille_slot_count, grille_slot_width);
        
        // Center X logo recess
        translate([0, -body_depth/2 -0.1, leg_height + body_height/2])
        rotate([0,90,0])
        linear_extrude(height=x_logo_depth + 0.1)
        union() {
            rotate(45) square([x_logo_size, x_logo_size/6], center=true);
            rotate(-45) square([x_logo_size, x_logo_size/6], center=true);
        }
        
        // ------------------------------
        // Top Face Features
        // ------------------------------
        // Top panel lines
        for(y_pos = [-body_depth/6, body_depth/6]) {
            translate([0, y_pos, leg_height + body_height + 0.1])
            linear_extrude(height=panel_line_depth + 0.2, center=true)
            square([body_length, panel_line_width], center=true);
        }
        
        // Control button recesses
        button_x_pos = body_length/2 - 20*unit;
        button_z_pos = leg_height + body_height + 0.1;
        for(i = [0:2]) {
            translate([button_x_pos, -10*unit + i*button_spacing, button_z_pos])
            cylinder(h=button_recess_depth + 0.2, d=button_dia, center=false);
        }
        
        // Minus symbol on first button
        translate([button_x_pos, -10*unit, button_z_pos])
        linear_extrude(height=button_recess_depth/2 + 0.1)
        square([button_dia*0.6, button_dia*0.15], center=true);
        
        // Plus symbol on second button
        translate([button_x_pos, -10*unit + button_spacing, button_z_pos])
        linear_extrude(height=button_recess_depth/2 + 0.1)
        union() {
            square([button_dia*0.6, button_dia*0.15], center=true);
            rotate(90) square([button_dia*0.6, button_dia*0.15], center=true);
        }
        
        // Power symbol on third button
        translate([button_x_pos, -10*unit + 2*button_spacing, button_z_pos])
        linear_extrude(height=button_recess_depth/2 + 0.1)
        difference() {
            circle(d=button_dia*0.6);
            square([button_dia*0.15, button_dia*0.4], center=true);
        }
    }
}