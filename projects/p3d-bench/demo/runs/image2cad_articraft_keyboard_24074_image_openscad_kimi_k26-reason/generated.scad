// ==========================================
// Parametric Compact Keyboard Model
// ==========================================
// Recreation of a slim, compact wireless keyboard 
// with laptop-style flat keycaps and a front lip detail.

// Resolution for curved surfaces
$fn = 50;

// --- Overall Keyboard Dimensions ---
kb_width = 265;          // Overall width (mm)
kb_depth = 110;          // Overall depth (mm)
kb_thickness = 3.5;      // Base chassis thickness (mm)
corner_radius = 4;       // Corner radius of the chassis
lip_radius = 1.2;        // Front edge lip radius

// --- Key Parameters ---
unit = 15.5;             // Key spacing unit (center-to-center, mm)
key_gap = 2.0;           // Total gap between adjacent keys (mm)
key_height = 1.5;        // Keycap height above base (mm)

// --- Layout Margins ---
// Center the 15-unit wide layout horizontally
margin_x = (kb_width - 15 * unit) / 2;
// Center the 6-row layout vertically
margin_y = (kb_depth - 6 * unit) / 2;

// --- Key Layout (widths in key units) ---
// Approximate 65% compact ANSI-like layout with inverted-T arrow cluster
layout_rows = [
    // Row 0: Bottom row (modifiers, spacebar, arrows)
    [1.25, 1.25, 1.25, 6.25, 1, 1, 1, 1, 1],
    // Row 1: ZXCV row + Up arrow above right-shift
    [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75, 1],
    // Row 2: Home row (ASDF)
    [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
    // Row 3: QWERTY row
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    // Row 4: Number row
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
    // Row 5: Function row (15 uniform keys)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// ==========================================
// Modules
// ==========================================

// Flat, stepped keycap resembling scissor-switch laptop keys
module keycap(w, d, h = key_height) {
    // Lower tier (full size, sits flush with base)
    translate([0, 0, h * 0.35 / 2])
        cube([w, d, h * 0.35], center = true);
    
    // Upper tier (slightly smaller, creates subtle edge reveal)
    translate([0, 0, h * 0.35 + h * 0.65 / 2])
        cube([w * 0.88, d * 0.88, h * 0.65], center = true);
}

// Recursively iterate through a row array and place keycaps
module build_row(row_data, y_pos, index = 0, x_offset = 0) {
    if (index < len(row_data)) {
        w = row_data[index];
        
        // Keycap dimensions: fill the unit cell minus uniform gap
        key_w = w * unit - key_gap;
        key_d = unit - key_gap;
        
        // Place keycap centered within its allocated unit width
        translate([x_offset + w * unit / 2, y_pos, kb_thickness])
            keycap(key_w, key_d);
        
        // Recurse to next key, advancing X by this key's unit width
        build_row(row_data, y_pos, index + 1, x_offset + w * unit);
    }
}

// Keyboard chassis: thin rounded slab with front lip
module keyboard_chassis() {
    union() {
        // Main base slab with rounded corners
        // Positioned so front edge sits at Y = 0
        translate([0, corner_radius, 0])
            linear_extrude(height = kb_thickness)
                offset(r = corner_radius)
                    square([kb_width - 2 * corner_radius, kb_depth - 2 * corner_radius]);
        
        // Front lip: rounded edge along front-bottom edge
        translate([corner_radius, 0, 0])
            rotate([0, 90, 0])
                cylinder(h = kb_width - 2 * corner_radius, r = lip_radius, $fn = 30);
        
        // End caps for the lip to blend with rounded corners
        translate([corner_radius, 0, 0])
            sphere(r = lip_radius, $fn = 30);
        translate([kb_width - corner_radius, 0, 0])
            sphere(r = lip_radius, $fn = 30);
    }
}

// ==========================================
// Main Assembly
// ==========================================

// Base chassis
color("Gray")
keyboard_chassis();

// Key cluster
color("DarkSlateGray")
for (i = [0 : len(layout_rows) - 1]) {
    // Compute row center Y (front to back)
    y_pos = margin_y + unit / 2 + i * unit;
    build_row(layout_rows[i], y_pos);
}