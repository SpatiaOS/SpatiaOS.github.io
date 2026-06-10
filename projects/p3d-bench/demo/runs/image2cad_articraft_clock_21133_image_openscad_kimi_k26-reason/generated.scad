// Roman Numeral Sundial / Clock Face
// All dimensions in millimeters

// === General Resolution ===
$fn = 100;

// === Base Dimensions ===
base_diameter   = 100;  // Overall diameter of the disk
base_thickness  =   4;  // Thickness of the main body below the recess
rim_height      =   1;  // Height of the outer rim above the dial face
rim_width       =   5;  // Radial width of the rim
face_diameter   = base_diameter - 2 * rim_width;

// === Dial Face Details ===
numeral_size    = 7.0;  // Font size for Roman numerals
numeral_height  = 0.8;  // Extrusion height of numerals
numeral_radius  = 35.0; // Distance from center to numeral center

// === Center Boss & Pivot ===
center_boss_diameter = 14.0;
center_boss_height   =  1.5;
pivot_diameter       =  3.5;
pivot_height         =  0.8;

// === Gnomon (Shadow Arm) ===
gnomon_length     = 38.0;
gnomon_width      =  2.5;
gnomon_thickness  =  1.0;
gnomon_elevation  = 30.0; // Degrees above horizontal
gnomon_direction  = 30.0; // Degrees clockwise from 12 o'clock (1 o'clock position)

// === Derived ===
face_z = base_thickness;  // Z-level of the recessed dial face
total_height = base_thickness + rim_height;

// ============================================================
// Base plate with recessed dial face
// ============================================================
module base_plate() {
    difference() {
        // Solid disk
        cylinder(d = base_diameter, h = total_height);
        // Recess cut into top surface
        translate([0, 0, base_thickness])
            cylinder(d = face_diameter, h = rim_height + 0.01);
    }
}

// ============================================================
// Roman numerals arranged in a clockwise circle
// XII is placed at the top (12 o'clock)
// ============================================================
module roman_numerals() {
    labels = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    
    for (i = [0 : 11]) {
        angle = i * 30; // 0° = top, increasing clockwise
        // Polar to Cartesian: 0° -> Y+, 90° -> X+
        x = numeral_radius * sin(angle);
        y = numeral_radius * cos(angle);
        
        translate([x, y, face_z])
            linear_extrude(height = numeral_height)
                text(labels[i], size = numeral_size, halign = "center", valign = "center");
    }
}

// ============================================================
// Central raised boss and pivot pin
// ============================================================
module center_assembly() {
    translate([0, 0, face_z]) {
        // Main boss
        cylinder(d = center_boss_diameter, h = center_boss_height);
        // Small pivot on top where the gnomon attaches
        translate([0, 0, center_boss_height])
            cylinder(d = pivot_diameter, h = pivot_height);
    }
}

// ============================================================
// Gnomon (shadow-casting arm)
// Extends from center outward, elevated above the dial face
// ============================================================
module gnomon() {
    translate([0, 0, face_z + center_boss_height + pivot_height])
        rotate([0, 0, gnomon_direction])
            rotate([0, -gnomon_elevation, 0])
                translate([gnomon_length / 2, 0, 0])
                    cube([gnomon_length, gnomon_width, gnomon_thickness], center = true);
}

// ============================================================
// Main Assembly
// ============================================================
union() {
    base_plate();
    roman_numerals();
    center_assembly();
    gnomon();
}