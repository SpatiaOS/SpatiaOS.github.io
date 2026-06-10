// Clock Model - Roman Numeral Wall Clock
// Parametric design with all dimensions defined at the top

// --------------------------
// Parameters (adjustable)
// --------------------------
outer_diameter = 150;    // Total outer diameter of clock base
base_thickness = 10;     // Total thickness of clock base
recess_depth = 3;        // Depth of inner recessed area
recess_wall = 5;         // Thickness of outer rim around recess
numeral_size = 12;       // Size of Roman numerals
numeral_thickness = 2;   // Extrusion height of numerals
hand_thickness = 1.5;    // Thickness of clock hands
hour_hand_length = 30;   // Length of hour hand
minute_hand_length = 45; // Length of minute hand
hub_diameter = 8;        // Central hub diameter
hub_height = 4;          // Central hub height
$fn = 100;               // Smoothness for curved surfaces (high for clean circles)

// --------------------------
// Helper Modules
// --------------------------

// Clock Base: raised outer rim + recessed inner floor
module clock_base() {
    // Outer raised rim (full height cylinder with inner cutout)
    difference() {
        cylinder(h=base_thickness, d=outer_diameter, center=true);
        // Cut out inner section to create rim
        cylinder(h=base_thickness + 2, d=outer_diameter - 2*recess_wall, center=true);
    }
    // Recessed inner floor (lower than rim by recess_depth)
    translate([0,0, -recess_depth/2])
        cylinder(h=base_thickness - recess_depth, d=outer_diameter - 2*recess_wall, center=true);
}

// Single extruded Roman numeral
module roman_numeral(num, size, thickness) {
    linear_extrude(height=thickness, center=true)
        text(num, size=size, halign="center", valign="center", font="Arial Black:style=Bold");
}

// All Roman numerals placed around clock face
module clock_numerals() {
    numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    numeral_radius = (outer_diameter - 2*recess_wall)/2 - numeral_size/1.5; // Distance from center to numerals
    
    for (i = [0:11]) {
        angle = i * 30; // 30 degree intervals for 12 numerals
        // Position numeral at correct angle, on recessed floor
        translate([numeral_radius * sin(angle), numeral_radius * cos(angle), 
                   base_thickness/2 - recess_depth/2 + numeral_thickness/2])
            rotate([0,0,-angle]) // Rotate numeral to face outward from center
                roman_numeral(numerals[i], numeral_size, numeral_thickness);
    }
}

// Single clock hand with pointed tip
module clock_hand(length, width, thickness) {
    linear_extrude(height=thickness, center=true)
        union() {
            // Main body of hand
            square([length * 0.8, width], center=false);
            // Pointed tip
            polygon([[length * 0.8, 0], [length * 0.8, width], [length, width/2]]);
        }
}

// Hour and minute hands (positioned as in reference image)
module clock_hands() {
    hand_z = base_thickness/2 - recess_depth/2 + hand_thickness/2;
    
    // Hour hand (shorter, thicker, positioned at ~7 o'clock)
    translate([0,0,hand_z])
        rotate([0,0, 210])
            clock_hand(hour_hand_length, 3, hand_thickness);
    
    // Minute hand (longer, thinner, positioned at ~10 minutes)
    translate([0,0,hand_z + hand_thickness])
        rotate([0,0, 60])
            clock_hand(minute_hand_length, 2, hand_thickness);
}

// Central hub with top pin
module clock_hub() {
    hub_z = base_thickness/2 - recess_depth/2 + hub_height/2;
    
    // Main hub
    translate([0,0,hub_z])
        cylinder(h=hub_height, d=hub_diameter, center=true);
    
    // Small top pin
    translate([0,0,hub_z + hub_height/2 + 1])
        cylinder(h=2, d=2, center=true);
}

// --------------------------
// Main Clock Model
// --------------------------
module clock() {
    union() {
        clock_base();
        clock_numerals();
        clock_hands();
        clock_hub();
    }
}

// Render the complete clock
clock();