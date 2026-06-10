// --------------------------
// Clock Parametric Dimensions
// --------------------------
outer_diameter = 150;       // Total outer diameter of the clock (mm)
total_thickness = 8;        // Total thickness of the clock base
border_width = 12;          // Width of the raised outer rim
recess_depth = 2;           // Depth of the recessed dial area
center_boss_dia = 30;       // Diameter of the raised center boss
center_boss_height = 1;     // Height of center boss above dial surface
numeral_height = 1.5;       // Height of raised Roman numerals
numeral_font_size = 10;     // Font size for hour numerals
numeral_offset_radius = 51; // Distance from center to place numerals
hand_thickness = 1.5;       // Thickness of clock hands
hand_width = 3;             // Width of clock hands
minute_hand_length = 55;    // Length of minute hand
hour_hand_length = 33;      // Length of hour hand
minute_angle = 8;           // Rotation angle of minute hand (0 = 12 o'clock)
hour_angle = -30;           // Rotation angle of hour hand (0 = 12 o'clock)
center_pin_dia = 6;         // Diameter of center hand retainer pin

// Smooth curve resolution
$fn = 120;

// --------------------------
// Static Definitions
// --------------------------
roman_numerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
dial_surface_z = (total_thickness / 2) - recess_depth; // Z position of the dial face

// --------------------------
// Helper Module: Single Clock Hand
// --------------------------
module clock_hand(length, width, thickness, angle) {
    translate([0, 0, dial_surface_z + thickness/2])
    rotate([0, 0, angle])
    translate([length/2, 0, 0])
    linear_extrude(height=thickness, center=true)
    square([length, width], center=true);
}

// --------------------------
// Main Model Assembly
// --------------------------
union() {
    // Base with recessed dial
    difference() {
        // Main outer base disk
        cylinder(h=total_thickness, d=outer_diameter, center=true);
        
        // Cut recess for dial face
        translate([0, 0, dial_surface_z + recess_depth/2])
        cylinder(h=recess_depth + 0.1, d=outer_diameter - 2*border_width, center=true);
    }

    // Raised center boss
    translate([0, 0, dial_surface_z + center_boss_height/2])
    cylinder(h=center_boss_height, d=center_boss_dia, center=true);

    // Raised Roman numerals
    for (hour = [0:11]) {
        rotate([0, 0, hour * 30]) // Rotate to each hour position (360/12 = 30deg)
        translate([numeral_offset_radius, 0, dial_surface_z])
        rotate([0, 0, -hour * 30]) // Rotate back to keep text upright
        linear_extrude(height=numeral_height)
        text(roman_numerals[hour], size=numeral_font_size, font="Arial:Bold", halign="center", valign="center");
    }

    // Clock hands
    clock_hand(minute_hand_length, hand_width, hand_thickness, minute_angle);
    clock_hand(hour_hand_length, hand_width * 1.2, hand_thickness, hour_angle);

    // Center retaining pin
    translate([0, 0, dial_surface_z + center_boss_height/2 + hand_thickness])
    cylinder(h=center_boss_height + hand_thickness, d=center_pin_dia, center=true);
}