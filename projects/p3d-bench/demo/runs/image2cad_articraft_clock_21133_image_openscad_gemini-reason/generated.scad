/* 
 * Parametric Roman Numeral Clock Face
 * 
 * This script generates a 3D model of a classic clock with Roman numerals,
 * an outer rim, a raised central hub, and stylized hour and minute hands.
 */

// --- Resolution ---
$fn = 100; // High resolution for smooth curves

// --- Parameters ---
// Base Clock Dimensions
clock_radius = 60;        // Outer radius of the clock
clock_thickness = 4;      // Thickness of the main base plate

// Rim Dimensions
rim_width = 8;            // Width of the raised outer rim
rim_height = 3;           // Height of the rim above the face
face_radius = clock_radius - rim_width; // Inner radius of the recessed face

// Central Hub Dimensions
hub_radius = 18;          // Radius of the raised central hub
hub_height = 1.5;         // Height of the central hub above the face

// Numeral Dimensions
numeral_radius = 34;      // Distance from center to the bottom of the numerals
numeral_size = 11;        // Font size for the Roman numerals
numeral_height = 1.5;     // Extrusion height of the numerals
font_style = "Serif:style=Bold"; // Font family

// Hand Dimensions
hand_thickness = 1.2;     // Extrusion height of the hands
hour_hand_length = 26;    // Length of the hour hand
minute_hand_length = 40;  // Length of the minute hand
hand_hole_radius = 1.5;   // Radius of the central hole in the hands

// Time Setting (Angles in degrees, 12 o'clock = 0)
// Set to ~10:10 to match the reference image
hour_angle = -305;        // Hour hand position
minute_angle = -60;       // Minute hand position


// --- Modules ---

// Generates the main solid body of the clock including base, rim, and hub
module clock_body() {
    union() {
        // Main base plate
        cylinder(h=clock_thickness, r=clock_radius);
        
        // Raised outer rim
        difference() {
            cylinder(h=clock_thickness + rim_height, r=clock_radius);
            // Subtracted inner cylinder to create the rim
            // Translated slightly down to prevent Z-fighting
            translate([0, 0, clock_thickness - 0.01])
                cylinder(h=rim_height + 0.02, r=face_radius);
        }
        
        // Raised central hub
        translate([0, 0, clock_thickness - 0.01])
            cylinder(h=hub_height + 0.01, r=hub_radius);
    }
}

// Generates the Roman numerals arranged in a circle
module draw_numerals() {
    numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    
    for (i = [0 : 11]) {
        angle = i * 30; // 360 degrees / 12 hours = 30 degrees per hour
        
        // Rotate each numeral to its correct hour position
        rotate([0, 0, -angle])
            // Translate outwards to the numeral ring
            translate([0, numeral_radius, clock_thickness])
                linear_extrude(numeral_height)
                    // valign="baseline" ensures the bottom of the text points towards the center
                    text(numerals[i], size=numeral_size, font=font_style, halign="center", valign="baseline");
    }
}

// Generates a stylized clock hand with a circular base, straight shaft, and kite/diamond head
module clock_hand(length, base_r, shaft_w, head_l, head_w, hole_r, thickness) {
    linear_extrude(thickness) {
        difference() {
            union() {
                // Circular base
                circle(r=base_r);
                
                // Straight shaft
                translate([-shaft_w/2, 0])
                    square([shaft_w, length - head_l]);
                
                // Kite/Diamond shaped pointer head
                translate([0, length - head_l])
                    polygon([
                        [-shaft_w/2, 0],
                        [-head_w/2, head_l/3],
                        [0, head_l],
                        [head_w/2, head_l/3],
                        [shaft_w/2, 0]
                    ]);
            }
            // Center hole for the pin
            circle(r=hole_r);
        }
    }
}

// Generates the central pin/rivet that holds the hands
module center_pin() {
    pin_height = hand_thickness * 2 + 0.8;
    translate([0, 0, clock_thickness + hub_height]) {
        difference() {
            // Main pin body
            cylinder(h=pin_height, r=2.5);
            // Small indentation at the top to look like a rivet
            translate([0, 0, pin_height - 0.5])
                cylinder(h=0.6, r=1.5);
        }
    }
}


// --- Main Assembly ---

// 1. Clock Body
color("silver") 
    clock_body();

// 2. Roman Numerals
color("darkgray") 
    draw_numerals();

// 3. Hour Hand (Bottom layer)
translate([0, 0, clock_thickness + hub_height])
    rotate([0, 0, hour_angle])
        color("black")
            clock_hand(
                length=hour_hand_length, 
                base_r=4.5, 
                shaft_w=2.5, 
                head_l=8, 
                head_w=5, 
                hole_r=hand_hole_radius, 
                thickness=hand_thickness
            );

// 4. Minute Hand (Top layer)
translate([0, 0, clock_thickness + hub_height + hand_thickness])
    rotate([0, 0, minute_angle])
        color("black")
            clock_hand(
                length=minute_hand_length, 
                base_r=4, 
                shaft_w=2, 
                head_l=10, 
                head_w=4, 
                hole_r=hand_hole_radius, 
                thickness=hand_thickness
            );

// 5. Center Pin/Rivet
color("silver") 
    center_pin();