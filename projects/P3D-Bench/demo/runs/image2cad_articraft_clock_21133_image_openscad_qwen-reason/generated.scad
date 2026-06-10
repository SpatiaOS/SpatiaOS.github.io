// Parametric Clock Face Model
// Based on the provided image of a Roman Numeral Clock

// --- Parameters ---
$fn = 60; // Resolution for curves

// Dimensions
outer_diameter = 100;
total_thickness = 12;
rim_height = 4; // Height of the outer rim above the inner face
inner_diameter = 84; // Diameter of the recessed face

// Numerals
numeral_radius = 32; // Distance from center to numerals
stick_w = 2.5;
stick_l = 7;
stick_h = 2;
stick_gap = 1.5;

// Center Hub
hub_diameter = 16;
hub_height = 3;
hub_pin_diameter = 4;

// Hands
hand_thickness = 1.5;
minute_hand_len = 30;
minute_hand_w = 3;
hour_hand_len = 20;
hour_hand_w = 4;
hand_z_offset = 1; // Gap above hub

// --- Modules ---

// Basic building block for numerals
module stick() {
    cube([stick_w, stick_l, stick_h], center=true);
}

// Numeral I
module numeral_I() {
    stick();
}

// Numeral V
module numeral_V() {
    // Two sticks angled to form a V
    // Bottoms meet at origin
    rotate([0, 0, 25]) translate([0, -stick_l/2 + 1, 0]) stick();
    rotate([0, 0, -25]) translate([0, -stick_l/2 + 1, 0]) stick();
}

// Numeral X
module numeral_X() {
    // Two crossed sticks
    rotate([0, 0, 45]) stick();
    rotate([0, 0, -45]) stick();
}

// Helper for multiple Is
module numeral_II() {
    translate([-stick_w/2 - stick_gap/2, 0, 0]) stick();
    translate([stick_w/2 + stick_gap/2, 0, 0]) stick();
}

module numeral_III() {
    translate([-stick_w - stick_gap, 0, 0]) stick();
    stick();
    translate([stick_w + stick_gap, 0, 0]) stick();
}

module numeral_IIII() {
    translate([-1.5*(stick_w + stick_gap), 0, 0]) stick();
    translate([-0.5*(stick_w + stick_gap), 0, 0]) stick();
    translate([0.5*(stick_w + stick_gap), 0, 0]) stick();
    translate([1.5*(stick_w + stick_gap), 0, 0]) stick();
}

// Composite Numerals
module roman_numeral(n) {
    if (n == 1) numeral_I();
    if (n == 2) numeral_II();
    if (n == 3) numeral_III();
    if (n == 4) numeral_IIII(); // Clocks often use IIII
    if (n == 5) numeral_V();
    if (n == 6) {
        translate([0, stick_l/2 + stick_gap, 0]) numeral_V();
        translate([0, -stick_l/2 - stick_gap, 0]) numeral_I();
    }
    if (n == 7) {
        translate([0, stick_l/2 + stick_gap, 0]) numeral_V();
        translate([0, -stick_l/2 - stick_gap, 0]) numeral_II();
    }
    if (n == 8) {
        translate([0, stick_l/2 + stick_gap, 0]) numeral_V();
        translate([0, -stick_l/2 - stick_gap, 0]) numeral_III();
    }
    if (n == 9) {
        translate([-stick_w/2 - stick_gap, 0, 0]) numeral_I();
        translate([stick_w/2 + stick_gap, 0, 0]) numeral_X();
    }
    if (n == 10) numeral_X();
    if (n == 11) {
        translate([-stick_w/2 - stick_gap, 0, 0]) numeral_X();
        translate([stick_w/2 + stick_gap, 0, 0]) numeral_I();
    }
    if (n == 12) {
        translate([0, stick_l/2 + stick_gap, 0]) numeral_X();
        translate([0, -stick_l/2 - stick_gap, 0]) numeral_II();
    }
}

// Clock Hand (Capsule shape)
module clock_hand(length, width) {
    hull() {
        translate([length/2 - width/2, 0, 0]) cylinder(h=hand_thickness, d=width, center=true);
        translate([-length/2 + width/2, 0, 0]) cylinder(h=hand_thickness, d=width, center=true);
    }
    // Center hole
    // translate([0,0, -1]) cylinder(h=hand_thickness+2, d=2, center=true); 
    // Note: The hole is usually handled by the pin, but we can model the visual hole if needed. 
    // The image shows a pin/washer on top, so the hands are solid underneath.
}

// --- Main Assembly ---

// Base and Rim
difference() {
    // Main outer cylinder
    cylinder(h=total_thickness, d=outer_diameter, center=false);
    
    // Cut out the recess (leaving the rim)
    // The recess starts at height (total_thickness - rim_height)
    translate([0, 0, total_thickness - rim_height]) {
        cylinder(h=rim_height + 1, d=inner_diameter, center=false);
    }
}

// Inner Face Elements (Numerals, Hub, Hands)
// They sit on the recessed floor at z = total_thickness - rim_height
translate([0, 0, total_thickness - rim_height]) {
    
    // Center Hub
    cylinder(h=hub_height, d=hub_diameter, center=false);
    
    // Numerals
    // Loop 1 to 12. 
    // 12 is at top (90 deg in math, but we use clock logic).
    // My rotation logic: rotate(-i*30) puts i=12 at top (0 deg rotation effectively).
    for (i = [1:12]) {
        // Calculate angle: 12 is 0 deg, 3 is -90 deg, etc.
        // Actually, standard clock: 12 is top. 
        // rotate(-i*30): 
        // i=12 -> -360 (0). Top.
        // i=3 -> -90. Right.
        rotate([0, 0, -i * 30]) {
            translate([0, numeral_radius, 0]) {
                // The numeral needs to be upright relative to the rim (radial)
                // My roman_numeral module builds "Up" as +Y.
                // At 12 o'clock (rotate 0), +Y is Radial (Out). Correct.
                // At 3 o'clock (rotate -90), +Y is Global X (Right/Radial). Correct.
                roman_numeral(i);
            }
        }
    }
    
    // Hands
    // Set time to approx 10:10
    // Minute hand (Long) at 2 (10 mins) -> Angle -60
    // Hour hand (Short) at 10 -> Angle -300 (or +60)
    
    // Minute Hand
    rotate([0, 0, -60]) {
        translate([0, 0, hub_height + hand_z_offset]) {
            clock_hand(minute_hand_len, minute_hand_w);
        }
    }
    
    // Hour Hand
    rotate([0, 0, -300]) { // -300 is same as +60
        translate([0, 0, hub_height + hand_z_offset + hand_thickness + 0.2]) {
            clock_hand(hour_hand_len, hour_hand_w);
        }
    }
    
    // Center Pin/Washer
    translate([0, 0, hub_height + hand_z_offset + 2 * hand_thickness + 0.4]) {
        cylinder(h=1.5, d=hub_pin_diameter, center=false);
    }
}