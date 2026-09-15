// Inline piston assembly model
// All dimensions in millimeters, per provided specification
$fn = 64;

// ---------------------- Parameters ----------------------
// Global assembly
overall_x = 80;
overall_y = 168;
overall_z = 438;
assembly_tilt = -1.8; // slight tilt around X to create diagonal shaft appearance

// Piston dimensions
piston_od = 50;
piston_r = piston_od / 2;
piston_height = 40;
piston_skirt_bore_d = 40;
piston_skirt_bore_r = piston_skirt_bore_d / 2;
piston_crown_pocket_d = 30;
piston_crown_pocket_r = piston_crown_pocket_d / 2;
piston_crown_pocket_depth = 15;
piston_wrist_pin_d = 12;
piston_wrist_pin_r = piston_wrist_pin_d / 2;
piston_wrist_pin_y = 10; // Y offset from skirt bottom
piston_ring_groove_width = 2;
piston_ring_groove_depth = 1.5;
piston_ring_groove_offset = 5; // distance below crown

// Spacer ring dimensions
spacer_od = 54.56;
spacer_or = spacer_od / 2;
spacer_id = 50;
spacer_ir = spacer_id / 2;
spacer_thickness = 5;
spacer_local_y = 27; // Y position relative to piston bottom (below ring groove)

// Shaft dimensions
shaft_rod_d = 6;
shaft_rod_r = shaft_rod_d / 2;
shaft_length = 438;
shaft_y_center = 15;
boss_d = 30;
boss_r = boss_d / 2;
boss_thick = 14; // thickness along X axis
boss_x_center = boss_thick / 2; // offset from arm to support conrod
arm_thick_x = 6;
arm_width_z = 8;
slot_width = 2;
slot_length = 5;

// Connecting rod dimensions
conrod_length = 60; // center distance from big end to wrist pin
big_end_od = 44;
big_end_or = big_end_od / 2;
big_end_id = boss_d;
big_end_ir = big_end_id / 2;
big_end_thick = 10; // thickness along X
small_end_od = piston_skirt_bore_d - 1; // slip fit in skirt bore
small_end_or = small_end_od / 2;
small_end_insert_depth = 21; // insertion into skirt, matches 20.9mm spec
beam_thick_x = 8;
beam_width_z = 12;
beam_flange_thick_z = 2;
beam_web_thick_x = 3;

// Bushing dimensions
bushing_od = 8;
bushing_or = bushing_od / 2;
bushing_id = shaft_rod_d;
bushing_ir = bushing_id / 2;
bushing_length = 5;
bushing_z_pos = shaft_length - bushing_length;

// Assembly positions (evenly spaced along Z, increasing Y offset)
piston_z = [80, 180, 280, 380];
boss_y = [40, 52, 64, 78]; // last boss set for 168mm total height

// ---------------------- Modules ----------------------
module piston() {
    // Piston aligned along Y axis, skirt bottom at Y=0, crown at Y=piston_height, centered at X=0/Z=0
    difference() {
        // Main piston body
        cylinder(h=piston_height, r=piston_r, center=false);
        
        // Internal geometry
        // Blind pocket under crown
        translate([0, piston_height - piston_crown_pocket_depth, 0])
            cylinder(h=piston_crown_pocket_depth + 0.1, r=piston_crown_pocket_r, center=false);
        // Lower skirt bore
        cylinder(h=piston_height - piston_crown_pocket_depth + 0.1, r=piston_skirt_bore_r, center=false);
        // Transverse wrist pin bore
        translate([0, piston_wrist_pin_y, 0])
            rotate([0, 90, 0])
            cylinder(h=piston_od + 1, r=piston_wrist_pin_r, center=true);
        
        // External top ring groove
        groove_y_start = piston_height - piston_ring_groove_offset - piston_ring_groove_width;
        translate([0, groove_y_start, 0])
            difference() {
                cylinder(h=piston_ring_groove_width, r=piston_r, center=false);
                cylinder(h=piston_ring_groove_width + 0.2, r=piston_r - piston_ring_groove_depth, center=false);
            }
    }
}

module spacer() {
    // Annular spacer ring, axis along Y
    difference() {
        cylinder(h=spacer_thickness, r=spacer_or, center=false);
        cylinder(h=spacer_thickness + 0.2, r=spacer_ir, center=false);
    }
}

module conrod() {
    // Big end centered at origin, axis along X; wrist pin at (0, conrod_length, 0)
    beam_start_y = big_end_or;
    beam_end_y = conrod_length - 10; // top of beam meets small end base
    
    // Main conrod geometry
    union() {
        // Big end eye
        translate([0, 0, 0])
            rotate([0, 0, 90])
            difference() {
                cylinder(h=big_end_thick, r=big_end_or, center=true);
                cylinder(h=big_end_thick + 0.2, r=big_end_ir, center=true);
            };
        
        // I-beam core
        translate([-beam_thick_x/2, beam_start_y, -beam_width_z/2])
            cube([beam_thick_x, beam_end_y - beam_start_y, beam_width_z]);
        
        // Small end spigot (inserts into piston skirt)
        translate([0, conrod_length - 10, 0])
            difference() {
                cylinder(h=small_end_insert_depth, r=small_end_or, center=false);
                // Wrist pin cross-hole
                translate([0, piston_wrist_pin_y, 0])
                    rotate([0, 90, 0])
                    cylinder(h=small_end_od + 1, r=piston_wrist_pin_r, center=true);
            };
    }
    
    // Cut I-beam profile notches
    difference() {
        children();
        cut_width_z = beam_width_z - 2*beam_flange_thick_z;
        cut_thick_x = (beam_thick_x - beam_web_thick_x) / 2;
        // Positive X side notch
        translate([beam_web_thick_x/2, beam_start_y, -cut_width_z/2])
            cube([cut_thick_x + 0.1, beam_end_y - beam_start_y, cut_width_z]);
        // Negative X side notch
        translate([-beam_thick_x/2, beam_start_y, -cut_width_z/2])
            cube([cut_thick_x + 0.1, beam_end_y - beam_start_y, cut_width_z]);
    }
}

module shaft() {
    // Main shaft along Z, with offset bosses and bracket arms
    union() {
        // Main backbone rod
        translate([0, shaft_y_center, shaft_length/2])
            rotate([90, 0, 0])
            cylinder(h=shaft_length, r=shaft_rod_r, center=true);
        
        // Bracket arms and disc bosses
        for (i = [0:3]) {
            z = piston_z[i];
            yb = boss_y[i];
            arm_len = yb - (shaft_y_center + shaft_rod_r);
            
            // Crank arm bracket
            translate([-arm_thick_x/2, shaft_y_center + shaft_rod_r, z - arm_width_z/2])
                cube([arm_thick_x, arm_len, arm_width_z]);
            
            // Offset disc boss (crank pin), axis along X
            translate([boss_x_center, yb, z])
                rotate([0, 0, 90])
                cylinder(h=boss_thick, r=boss_r, center=true);
        }
    }
    
    // Cut slots in bracket arms
    difference() {
        children();
        for (i = [0:3]) {
            z = piston_z[i];
            yb = boss_y[i];
            arm_len = yb - (shaft_y_center + shaft_rod_r);
            slot_y_center = shaft_y_center + shaft_rod_r + arm_len/2;
            translate([-arm_thick_x/2 - 0.5, slot_y_center - slot_length/2, z - slot_width/2])
                cube([arm_thick_x + 1, slot_length, slot_width]);
        }
    }
}

module bushing() {
    // End bushing on shaft
    difference() {
        translate([0, shaft_y_center, bushing_z_pos + bushing_length/2])
            rotate([90, 0, 0])
            cylinder(h=bushing_length, r=bushing_or, center=true);
        translate([0, shaft_y_center, bushing_z_pos - 0.1])
            rotate([90, 0, 0])
            cylinder(h=bushing_length + 0.2, r=bushing_ir, center=false);
    }
}

// ---------------------- Main Assembly ----------------------
rotate([assembly_tilt, 0, 0]) {
    // Core shaft and bushing
    shaft();
    bushing();
    
    // Piston, spacer, and conrod sets
    for (i = [0:3]) {
        z = piston_z[i];
        yb = boss_y[i];
        piston_bottom_y = (yb + conrod_length) - piston_wrist_pin_y;
        spacer_y = piston_bottom_y + spacer_local_y;
        
        translate([boss_x_center, yb, z]) conrod();
        translate([boss_x_center, piston_bottom_y, z]) piston();
        translate([boss_x_center, spacer_y, z]) spacer();
    }
}