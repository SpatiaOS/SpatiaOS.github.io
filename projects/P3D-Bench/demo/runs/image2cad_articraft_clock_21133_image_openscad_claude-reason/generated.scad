// ==========================================
// Decorative Clock Face with Roman Numerals
// ==========================================

$fn = 120;

// --- Main Disc Parameters ---
total_diameter = 120;      // overall diameter
base_height = 6;           // thickness of the base disc

// --- Outer Rim ---
rim_height = 3;            // height above base surface
rim_width = 8;             // radial width of rim

// --- Inner Decorative Ring ---
ring_outer_radius = 49;
ring_inner_radius = 47;
ring_height = 1.5;

// --- Center Hub ---
hub_diameter = 22;
hub_height = 3;
hub_boss_diameter = 7;
hub_boss_height = 1.2;

// --- Roman Numeral Placement ---
numeral_radius = 38;       // distance from center to numeral
numeral_size = 8;          // font size
numeral_extrude = 2;       // raised height of numerals

// --- Clock Hands ---
minute_length = 35;
minute_width = 1.5;
hour_length = 25;
hour_width = 2.0;
hand_thickness = 1.5;

// Time displayed: 10:10 (classic display)
hour_angle = -305;         // 10 o'clock + slight offset for minutes
minute_angle = -60;        // pointing at 2 (10 minutes)

// --- Roman Numeral Labels ---
roman = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

// ==========================================
// Module: Base disc
// ==========================================
module base_disc() {
    cylinder(d = total_diameter, h = base_height);
}

// ==========================================
// Module: Raised outer rim ring
// ==========================================
module outer_rim() {
    translate([0, 0, base_height])
        difference() {
            cylinder(d = total_diameter, h = rim_height);
            translate([0, 0, -0.1])
                cylinder(d = total_diameter - 2 * rim_width, h = rim_height + 0.2);
        }
}

// ==========================================
// Module: Inner decorative ring
// ==========================================
module inner_ring() {
    translate([0, 0, base_height])
        difference() {
            cylinder(r = ring_outer_radius, h = ring_height);
            translate([0, 0, -0.1])
                cylinder(r = ring_inner_radius, h = ring_height + 0.2);
        }
}

// ==========================================
// Module: Center hub with small boss
// ==========================================
module center_hub() {
    translate([0, 0, base_height]) {
        // Main hub cylinder
        cylinder(d = hub_diameter, h = hub_height);
        // Small raised boss on top
        translate([0, 0, hub_height])
            cylinder(d = hub_boss_diameter, h = hub_boss_height);
    }
}

// ==========================================
// Module: Place a single roman numeral
//   hour_pos: 0=XII, 1=I, 2=II, ... 11=XI
// ==========================================
module place_numeral(text_str, hour_pos) {
    rot_angle = -hour_pos * 30;  // clockwise placement
    rotate([0, 0, rot_angle])
        translate([0, numeral_radius, base_height])
            linear_extrude(numeral_extrude)
                text(text_str, 
                     size = numeral_size, 
                     font = "Liberation Serif:style=Bold",
                     halign = "center", 
                     valign = "center");
}

// ==========================================
// Module: All twelve roman numerals
// ==========================================
module all_numerals() {
    for (i = [0 : 11]) {
        place_numeral(roman[i], i);
    }
}

// ==========================================
// Module: Single clock hand (tapered shape)
//   length: tip distance from center
//   width: base width of hand
// ==========================================
module clock_hand(length, width) {
    translate([0, 0, base_height + hub_height])
        linear_extrude(hand_thickness)
            hull() {
                // Base of hand (wider)
                circle(d = width * 2);
                // Tip of hand (narrow point)
                translate([0, length, 0])
                    circle(d = width * 0.5);
            }
}

// ==========================================
// Module: Both clock hands at specified time
// ==========================================
module clock_hands() {
    // Hour hand (shorter, slightly wider)
    color("gray")
    rotate([0, 0, hour_angle])
        clock_hand(hour_length, hour_width);
    
    // Minute hand (longer, slightly thinner)
    color("gray")
    rotate([0, 0, minute_angle])
        clock_hand(minute_length, minute_width);
}

// ==========================================
// Final Assembly
// ==========================================
union() {
    // Solid base disc
    base_disc();
    
    // Raised outer rim/bezel
    outer_rim();
    
    // Decorative inner ring
    inner_ring();
    
    // Raised roman numerals on face
    all_numerals();
    
    // Center hub/pivot
    center_hub();
    
    // Hour and minute hands
    clock_hands();
}