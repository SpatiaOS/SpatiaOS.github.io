// =========================================================
// Retro Bluetooth Speaker - Mid-Century Modern Design
// Dual octagonal speaker grilles with radial patterns,
// decorative X panel, control buttons, and splayed legs
// =========================================================

// ===================== Parameters =====================

// Main body dimensions
body_w     = 240;   // width (X axis)
body_d     = 68;    // depth (Y axis)
body_h     = 92;    // height (Z axis)
chamfer    = 10;    // front vertical edge chamfer

// Speaker grille parameters
spk_r      = 36;    // outer octagon circumradius
spk_hub_r  = 13;    // center hub radius
spk_offset = 60;    // speaker center offset from body center X
spk_cz     = 46;    // speaker center height from body bottom
n_slots    = 26;    // number of radial slots
slot_w     = 1.8;   // radial slot width
recess1    = 2.0;   // outer octagon recess depth
recess2    = 1.5;   // middle ring additional depth
recess3    = 1.5;   // inner ring additional depth

// Center X decoration
deco_d     = 2.0;   // engraving depth

// Side buttons (right face)
btn_r      = 4.5;   // button radius
btn_d      = 1.5;   // button recess depth
btn_spacing = 16;   // vertical spacing between buttons

// Top panel grooves
grv_d      = 1.2;   // groove depth
grv_w      = 1.5;   // groove width

// Legs
leg_h      = 110;   // leg length
leg_rt     = 5.5;   // radius at body attachment (top)
leg_rb     = 3.5;   // radius at floor (bottom)
leg_splay  = 14;    // splay angle from vertical (degrees)
leg_inset  = 12;    // inset from body edges

$fn = 80;

// ===================== Computed Values =====================

// Effective vertical height of splayed legs
leg_vert = leg_h * cos(leg_splay) * cos(leg_splay);

// ===================== Modules =====================

// 2D body cross-section (top-down view, front face at Y=0)
module body_profile() {
    polygon([
        [chamfer,          0      ],   // front-left after chamfer
        [body_w - chamfer, 0      ],   // front-right before chamfer
        [body_w,           chamfer],   // right side start
        [body_w,           body_d ],   // back-right
        [0,                body_d ],   // back-left
        [0,                chamfer]    // left side start
    ]);
}

// Speaker grille cutout (centered at origin, cuts into +Y direction)
module speaker_grille() {
    total_d = recess1 + recess2 + recess3;
    
    // Step 1: Outer octagonal frame recess
    rotate([-90, 22.5, 0])
        linear_extrude(recess1 + 0.01)
            circle(r = spk_r, $fn = 8);
    
    // Step 2: Middle ring recess (deeper)
    translate([0, recess1 - 0.01, 0])
        rotate([-90, 22.5, 0])
            linear_extrude(recess2 + 0.02)
                difference() {
                    circle(r = spk_r - 3, $fn = 8);
                    circle(r = spk_hub_r);
                }
    
    // Step 3: Inner ring recess (deepest)
    translate([0, recess1 + recess2 - 0.02, 0])
        rotate([-90, 22.5, 0])
            linear_extrude(recess3 + 0.03)
                difference() {
                    circle(r = spk_r - 7, $fn = 8);
                    circle(r = spk_hub_r);
                }
    
    // Radial slot pattern cut through all layers
    for (i = [0 : n_slots - 1]) {
        angle = i * 360 / n_slots;
        rotate([-90, 0, 0])
            rotate([0, 0, angle])
                translate([spk_hub_r + 1.5, -slot_w/2, -0.05])
                    cube([spk_r - spk_hub_r - 4, slot_w, total_d + 0.1]);
    }
}

// Decorative X/star pattern between speakers (cuts into +Y)
module center_decoration() {
    hw = 22;   // half-width
    hh = 24;   // half-height
    t  = 2.0;  // outline thickness
    
    rotate([-90, 0, 0])
        translate([0, 0, -0.05])
            linear_extrude(deco_d + 0.1) {
                // Bowtie/hourglass outline
                difference() {
                    polygon([
                        [-hw, -hh], [0, -3], [hw, -hh],
                        [hw,   hh], [0,  3], [-hw,  hh]
                    ]);
                    // Hollow interior
                    offset(delta = -t)
                        polygon([
                            [-hw, -hh], [0, -3], [hw, -hh],
                            [hw,   hh], [0,  3], [-hw,  hh]
                        ]);
                }
                
                // Diagonal cross lines
                for (a = [35, -35])
                    rotate(a)
                        square([hw * 1.3, 1.5], center = true);
                
                // Additional accent lines
                for (a = [55, -55])
                    rotate(a)
                        square([hw * 1.0, 1.2], center = true);
                
                // Horizontal center line
                square([hw * 1.7, 1.2], center = true);
                
                // Vertical center line
                square([1.2, hh * 1.7], center = true);
                
                // Inner chevron details (4 directions)
                for (rot = [0, 90, 180, 270]) {
                    rotate(rot)
                        translate([0, 10])
                            polygon([
                                [-8, 5], [0, 0], [8, 5],
                                [6.5, 5], [0, 1.5], [-6.5, 5]
                            ]);
                }
            }
}

// Circular button indentation
module button_recess() {
    // Outer circle recess
    cylinder(r = btn_r, h = btn_d + 0.2, $fn = 32);
    // Inner detail circle (deeper)
    cylinder(r = btn_r * 0.5, h = btn_d + 0.5, $fn = 32);
}

// Single tapered leg cylinder
module tapered_leg() {
    cylinder(h = leg_h, r1 = leg_rb, r2 = leg_rt, $fn = 24);
}

// ===================== Main Assembly =====================

module retro_speaker() {
    // ---- BODY with all cutout features ----
    translate([0, 0, leg_vert])
    difference() {
        // Solid extruded body
        linear_extrude(body_h)
            body_profile();
        
        // Left speaker grille
        translate([body_w/2 - spk_offset, -0.05, spk_cz])
            speaker_grille();
        
        // Right speaker grille
        translate([body_w/2 + spk_offset, -0.05, spk_cz])
            speaker_grille();
        
        // Center X decoration
        translate([body_w/2, -0.05, spk_cz])
            center_decoration();
        
        // Three control buttons on right side face
        for (i = [0 : 2]) {
            translate([body_w + 0.05,
                       body_d * 0.35 + i * btn_spacing,
                       body_h * 0.6])
                rotate([0, -90, 0])
                    button_recess();
        }
        
        // Top panel grooves (width-wise divisions, 3 columns)
        for (xf = [0.34, 0.66]) {
            translate([body_w * xf - grv_w/2, -0.1, body_h - grv_d])
                cube([grv_w, body_d + 0.2, grv_d + 0.1]);
        }
        
        // Top panel groove (depth-wise division, 2 rows)
        translate([-0.1, body_d * 0.5 - grv_w/2, body_h - grv_d])
            cube([body_w + 0.2, grv_w, grv_d + 0.1]);
    }
    
    // ---- FOUR SPLAYED LEGS ----
    translate([0, 0, leg_vert]) {
        // Front-left leg (splays forward and left)
        translate([leg_inset + chamfer/2, leg_inset, 0])
            rotate([-leg_splay, leg_splay, 0])
                translate([0, 0, -leg_h])
                    tapered_leg();
        
        // Back-left leg (splays backward and left)
        translate([leg_inset + chamfer/2, body_d - leg_inset, 0])
            rotate([leg_splay, leg_splay, 0])
                translate([0, 0, -leg_h])
                    tapered_leg();
        
        // Front-right leg (splays forward and right)
        translate([body_w - leg_inset - chamfer/2, leg_inset, 0])
            rotate([-leg_splay, -leg_splay, 0])
                translate([0, 0, -leg_h])
                    tapered_leg();
        
        // Back-right leg (splays backward and right)
        translate([body_w - leg_inset - chamfer/2, body_d - leg_inset, 0])
            rotate([leg_splay, -leg_splay, 0])
                translate([0, 0, -leg_h])
                    tapered_leg();
    }
}

// Render the complete model
retro_speaker();