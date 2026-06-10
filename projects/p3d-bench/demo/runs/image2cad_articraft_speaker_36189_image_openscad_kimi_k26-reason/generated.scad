// ==========================================
// Retro Radio / Speaker Box
// Parametric OpenSCAD Model
// ==========================================

// --- Main Body Dimensions ---
body_width  = 150;
body_depth  = 55;
body_height = 65;

// --- Front Speaker Grilles ---
speaker_spacing    = 48;      // Distance from body center to each speaker center
hex_outer_r        = 24;      // Outer hexagon radius (bezel frame)
hex_inner_r        = 20;      // Inner hexagon radius (grille cavity)
frame_protrusion   = 4;       // How far the bezel sticks out past the front face
grille_recess      = 5;       // Depth of the speaker cavity
cone_dia           = 22;      // Diameter of the central speaker cone
cone_protrusion    = 3.5;     // How far the cone sticks out from the cavity floor
grille_ring_step   = 3;       // Radial spacing between grille rings
grille_line_w      = 0.8;     // Thickness of each grille ring
grille_ring_height = 0.6;     // How tall the grille rings sit above the cavity floor

// --- Center Starburst Emblem ---
star_size       = 14;         // Overall radius of the 4-pointed star
star_protrusion = 2;          // Height of the raised emblem

// --- Top Panel Grooves ---
groove_width = 2;
groove_depth = 2;

// --- Control Knobs (on top) ---
knob_dia      = 8;
knob_height   = 2;
knob_start_x  = body_width/3 + 6;   // Positioned in the rightmost top strip
knob_spacing  = 9;
knob_y        = body_depth/2 - 10;  // Slightly toward the back edge

// --- Legs ---
leg_length     = 55;
leg_top_dia    = 10;
leg_bottom_dia = 5;
leg_tilt       = 18;          // Splay angle (degrees)
leg_inset      = 8;           // How far leg centers are from side edges

// --- Render Quality ---
$fn = 60;


// ==========================================
// Helper Modules
// ==========================================

// 4-pointed star used for the center emblem
module starburst_2d() {
    r_out = star_size;
    r_in  = star_size * 0.35;
    polygon([
        [0, r_out],
        [ r_in,  r_in],
        [ r_out, 0],
        [ r_in, -r_in],
        [0, -r_out],
        [-r_in, -r_in],
        [-r_out, 0],
        [-r_in,  r_in]
    ]);
}

// Speaker assembly drawn in local XY (attachment face), extending in Z+
// Z+ = outward (toward viewer), Z- = inward (into the body)
module speaker_details() {
    // Outer hexagonal bezel frame
    linear_extrude(height = frame_protrusion)
    difference() {
        circle(r = hex_outer_r, $fn = 6);
        circle(r = hex_inner_r, $fn = 6);
    }

    // Floor of the recessed cavity
    translate([0, 0, -grille_recess])
    linear_extrude(height = grille_ring_height)
    difference() {
        circle(r = hex_inner_r, $fn = 6);
        circle(d = cone_dia, $fn = 50);
    }

    // Concentric hexagonal grille rings
    for (r = [cone_dia/2 + 3 : grille_ring_step : hex_inner_r - 1]) {
        translate([0, 0, -grille_recess])
        linear_extrude(height = grille_ring_height)
        difference() {
            circle(r = r + grille_line_w/2, $fn = 6);
            circle(r = r - grille_line_w/2, $fn = 6);
        }
    }

    // Central speaker cone
    translate([0, 0, -grille_recess])
    cylinder(h = cone_protrusion, d = cone_dia, $fn = 50);
}

// Single tapered leg; top sits at origin and extends downward in -Z
module leg(tilt_x, tilt_y) {
    rotate([tilt_x, tilt_y, 0])
    cylinder(h = leg_length, r1 = leg_top_dia/2, r2 = leg_bottom_dia/2);
}

// All four splayed legs
module legs() {
    // Front left  : forward & left
    translate([-body_width/2 + leg_inset, -body_depth/2 + leg_inset, 0])
    leg( leg_tilt, -leg_tilt);

    // Front right : forward & right
    translate([ body_width/2 - leg_inset, -body_depth/2 + leg_inset, 0])
    leg( leg_tilt,  leg_tilt);

    // Back left   : backward & left
    translate([-body_width/2 + leg_inset,  body_depth/2 - leg_inset, 0])
    leg(-leg_tilt, -leg_tilt);

    // Back right  : backward & right
    translate([ body_width/2 - leg_inset,  body_depth/2 - leg_inset, 0])
    leg(-leg_tilt,  leg_tilt);
}


// ==========================================
// Main Assembly
// ==========================================

difference() {
    // Main rectangular body block
    translate([0, 0, body_height/2])
    cube([body_width, body_depth, body_height], center = true);

    // Top grooves running front-to-back, dividing the top into three strips
    for (gx = [-body_width/3, body_width/3]) {
        translate([gx, 0, body_height - groove_depth/2])
        cube([groove_width, body_depth + 1, groove_depth + 0.1], center = true);
    }

    // Speaker cavities carved into the front face
    for (sx = [-speaker_spacing, speaker_spacing]) {
        translate([sx, -body_depth/2, body_height/2])
        rotate([-90, 0, 0])                       // orient extrusion inward (+Y)
        linear_extrude(height = grille_recess)
        circle(r = hex_inner_r, $fn = 6);
    }
}

// Additive details
union() {
    // Speaker bezels, grilles, and cones mounted on the front face
    for (sx = [-speaker_spacing, speaker_spacing]) {
        translate([sx, -body_depth/2, body_height/2])
        rotate([90, 0, 0])                        // orient local Z+ outward (-Y world)
        speaker_details();
    }

    // Raised starburst emblem between the two speakers
    translate([0, -body_depth/2, body_height/2])
    rotate([90, 0, 0])
    linear_extrude(height = star_protrusion)
    starburst_2d();

    // Three control knobs on the top-right strip
    for (i = [0:2]) {
        translate([knob_start_x + i * knob_spacing, knob_y, body_height])
        cylinder(h = knob_height, d = knob_dia, $fn = 30);
    }

    // Tapered legs
    legs();
}