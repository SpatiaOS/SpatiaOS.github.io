// Clock Face Model - Parametric OpenSCAD Design
// A classic wall clock with Roman numerals and hands

// ============================================
// PARAMETERS (all dimensions in mm)
// ============================================

// Main body dimensions
clock_diameter = 100;        // Total outer diameter
clock_thickness = 8;         // Total thickness of clock body
rim_width = 10;              // Width of outer rim
dial_depth = 1.5;            // Depth of recessed dial area

// Dial dimensions
dial_diameter = clock_diameter - (rim_width * 2);  // Inner dial diameter
center_hub_diameter = 18;    // Central hub diameter
center_hub_height = 2;       // Hub protrusion height

// Clock hands
hour_hand_length = 22;       // Length of hour hand
minute_hand_length = 32;     // Length of minute hand
hand_width = 3;              // Width of hands
hand_thickness = 1.5;        // Thickness of hands
hand_center_hole = 3;        // Diameter of center hole in hands

// Time setting (degrees from 12 o'clock position)
// Current time appears to be approx 1:08
hour_angle = 34;             // Hour hand angle (1:08 ≈ 34°)
minute_angle = 48;           // Minute hand angle (8 min × 6° = 48°)

// Numerals settings
numeral_radius = 36;         // Radius where numerals are placed
numeral_size = 7;            // Size of numeral text
numeral_depth = 1.5;         // Depth of engraved numerals

// Resolution
$fn = 100;                   // Smoothness of curves

// ============================================
// MODULES
// ============================================

// Main clock body with rim and recessed dial
module clock_body() {
    difference() {
        // Outer cylinder (main body)
        cylinder(h=clock_thickness, d=clock_diameter, center=true);
        
        // Recessed dial area (inner circle cut out from top)
        translate([0, 0, (clock_thickness - dial_depth)/2])
            cylinder(h=dial_depth + 0.01, d=dial_diameter, center=true);
    }
    
    // Add center hub (raised cylinder in middle of dial)
    translate([0, 0, (clock_thickness - center_hub_height)/2])
        cylinder(h=center_hub_height, d=center_hub_diameter, center=true);
}

// Clock hand module - creates tapered or simple rectangular hand
module clock_hand(length, width, thickness) {
    union() {
        // Main hand body (tapered shape using hull)
        hull() {
            // Base of hand (wider)
            translate([0, -width/2, 0])
                cube([4, width, thickness], center=true);
            // Tip of hand (narrower)
            translate([length - 2, -width/3, 0])
                cube([2, width*0.66, thickness], center=true);
        }
        
        // Center hole (for mounting pin)
        cylinder(h=thickness + 0.2, d=hand_center_hole, center=true);
        
        // Decorative circle at base
        translate([0, 0, 0])
            cylinder(h=thickness + 0.1, d=width + 1.5, center=true);
    }
}

// Roman numeral placement module
module place_numerals() {
    roman_numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    
    for (i = [0:11]) {
        angle = i * 30 - 90;  // Start at 12 o'clock (-90 degrees), go clockwise
        
        rotate([0, 0, angle])
            translate([numeral_radius, 0, (clock_thickness - dial_depth)/2 - numeral_depth/2 + 0.05])
                linear_extrude(height=numeral_depth, center=true)
                    text(roman_numerals[i], 
                         size=numeral_size, 
                         halign="center", 
                         valign="center",
                         font="Times New Roman:style=Bold");
    }
}

// Center cap that covers hand attachment point
module center_cap() {
    translate([0, 0, (clock_thickness)/2 + hand_thickness/2 - 0.1])
        cylinder(h=hand_thickness, d=hand_center_hole + 2, center=true);
}

// ============================================
// MAIN ASSEMBLY
// ============================================

union() {
    // 1. Main clock body (rim + dial + hub)
    color("gray")
        clock_body();
    
    // 2. Engraved Roman numerals (subtracted from dial surface)
    color("darkgray")
        place_numerals();
    
    // 3. Hour hand
    color("silver")
        rotate([0, 0, hour_angle])
        translate([0, 0, clock_thickness/2 + hand_thickness/2])
            clock_hand(hour_hand_length, hand_width * 1.3, hand_thickness);
    
    // 4. Minute hand (longer, positioned above hour hand)
    color("silver")
        rotate([0, 0, minute_angle])
        translate([0, 0, clock_thickness/2 + hand_thickness*1.5])
            clock_hand(minute_hand_length, hand_width, hand_thickness);
    
    // 5. Center decorative cap
    color("darkgray")
        center_cap();
}