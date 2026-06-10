// Wireless Keyboard 3D Model - Simplified for efficient rendering
$fn = 24; // Moderate resolution for faster STL export

// ==============================================
// Global Parameters
// ==============================================

// Overall keyboard dimensions
kb_width = 430;      // Total width (left to right)
kb_depth = 127;      // Total depth (front to back)
base_height = 3;     // Base plate thickness
edge_height = 5;     // Raised edge height
edge_width = 3;      // Edge border width

// Key dimensions
key_h = 4;           // Key height
key_w = 18;          // Standard key width
key_d = 18;          // Standard key depth
key_gap = 2;         // Gap between keys

// Wide key multiples
wide_mult = 1.5;     // Shift, Tab, Caps width multiplier
spacebar_mult = 6;   // Spacebar width multiplier

// Layout positioning
margin_x = 8;        // Left margin
margin_y = 8;        // Top margin

// ==============================================
// Modules
// ==============================================

// Simple rounded key cap
module keycap(w, d, h) {
    hull() {
        translate([0.3, 0.3, 0]) cube([w-0.6, d-0.6, h-0.3]);
        translate([0.3, 0.3, h-0.5]) cube([w-0.6, d-0.6, 0.5]);
    }
}

// Keyboard base with rounded front edge
module base() {
    union() {
        // Main base plate
        cube([kb_width, kb_depth, base_height]);
        
        // Front curved edge (lip)
        translate([0, 0, base_height])
            rotate([0, 90, 0])
                translate([0, 0, -1])
                    linear_extrude(height = kb_width + 2)
                        circle(r = edge_width, $fn = 16);
    }
}

// Key row helper
module key_row(count, start_x, start_y, row_width, key_type_w) {
    x_pos = start_x;
    for (i = [0:count-1]) {
        translate([x_pos, start_y, base_height])
            keycap(key_type_w, key_d, key_h);
        x_pos = x_pos + key_type_w + key_gap;
    }
}

// Main keyboard layout
module keyboard_layout() {
    // Row 1: Number row (13 standard keys)
    for (i = [0:12]) {
        translate([margin_x + i*(key_w + key_gap), margin_y, base_height])
            keycap(key_w, key_d, key_h);
    }
    
    // Row 2: Tab + QWERTY row
    row2_y = margin_y + key_d + key_gap;
    translate([margin_x, row2_y, base_height])
        keycap(key_w * wide_mult, key_d, key_h);
    for (i = [0:11]) {
        translate([margin_x + key_w*wide_mult + key_gap + i*(key_w + key_gap), row2_y, base_height])
            keycap(key_w, key_d, key_h);
    }
    
    // Row 3: Caps Lock + ASDF row
    row3_y = margin_y + 2*(key_d + key_gap);
    translate([margin_x, row3_y, base_height])
        keycap(key_w * wide_mult, key_d, key_h);
    for (i = [0:10]) {
        translate([margin_x + key_w*wide_mult + key_gap + i*(key_w + key_gap), row3_y, base_height])
            keycap(key_w, key_d, key_h);
    }
    
    // Row 4: Left Shift + ZXCV row + Right Shift
    row4_y = margin_y + 3*(key_d + key_gap);
    translate([margin_x, row4_y, base_height])
        keycap(key_w * wide_mult * 1.3, key_d, key_h);
    for (i = [0:9]) {
        translate([margin_x + key_w*wide_mult*1.3 + key_gap + i*(key_w + key_gap), row4_y, base_height])
            keycap(key_w, key_d, key_h);
    }
    translate([margin_x + key_w*wide_mult*1.3 + key_gap + 10*(key_w + key_gap), row4_y, base_height])
        keycap(key_w * wide_mult * 1.5, key_d, key_h);
    
    // Row 5: Ctrl, Alt, Spacebar, Alt, Ctrl
    row5_y = margin_y + 4*(key_d + key_gap);
    // Left modifiers
    translate([margin_x, row5_y, base_height])
        keycap(key_w * 1.2, key_d, key_h);
    translate([margin_x + key_w*1.2 + key_gap, row5_y, base_height])
        keycap(key_w * 1.2, key_d, key_h);
    // Spacebar
    spacebar_x = margin_x + 2*(key_w*1.2 + key_gap);
    translate([spacebar_x, row5_y, base_height])
        keycap(key_w * spacebar_mult, key_d, key_h);
    // Right modifiers
    translate([spacebar_x + key_w*spacebar_mult + key_gap, row5_y, base_height])
        keycap(key_w * 1.2, key_d, key_h);
    translate([spacebar_x + key_w*spacebar_mult + 2*key_gap + key_w*1.2, row5_y, base_height])
        keycap(key_w * 1.2, key_d, key_h);
    
    // Navigation cluster (right side)
    nav_start_x = margin_x + 14*(key_w + key_gap) + 15;
    
    // Nav Row 1: Insert, Home, PgUp, Del
    for (i = [0:2]) {
        translate([nav_start_x + i*(key_w + key_gap), margin_y, base_height])
            keycap(key_w, key_d, key_h);
    }
    translate([nav_start_x + 3*(key_w + key_gap), margin_y, base_height])
        keycap(key_w * 1.3, key_d, key_h);
    
    // Nav Row 2: End, PgDn
    for (i = [0:1]) {
        translate([nav_start_x + i*(key_w + key_gap), margin_y + key_d + key_gap, base_height])
            keycap(key_w, key_d, key_h);
    }
    
    // Arrow keys (inverted T)
    arrow_y = margin_y + 2.5*(key_d + key_gap);
    // Left arrow
    translate([nav_start_x, arrow_y, base_height])
        keycap(key_w, key_d, key_h);
    // Up arrow
    translate([nav_start_x + key_w + key_gap, arrow_y - (key_d + key_gap)/2, base_height])
        keycap(key_w, key_d, key_h);
    // Down arrow
    translate([nav_start_x + key_w + key_gap, arrow_y + (key_d + key_gap)/2, base_height])
        keycap(key_w, key_d, key_h);
    // Right arrow
    translate([nav_start_x + 2*(key_w + key_gap), arrow_y, base_height])
        keycap(key_w, key_d, key_h);
    
    // Numpad area (far right)
    numpad_x = nav_start_x + 5*(key_w + key_gap);
    
    // Numpad rows 1-4
    for (row = [0:3]) {
        for (col = [0:2]) {
            translate([numpad_x + col*(key_w + key_gap), margin_y + row*(key_d + key_gap), base_height])
                keycap(key_w, key_d, key_h);
        }
    }
    // Numpad Enter (tall)
    translate([numpad_x + 3*(key_w + key_gap), margin_y + 2*(key_d + key_gap), base_height])
        keycap(key_w, key_d*2 + key_gap, key_h);
    
    // Numpad 0 (wide) and decimal
    translate([numpad_x, margin_y + 4*(key_d + key_gap), base_height])
        keycap(key_w*2 + key_gap, key_d, key_h);
    translate([numpad_x + 2*(key_w + key_gap), margin_y + 4*(key_d + key_gap), base_height])
        keycap(key_w, key_d, key_h);
}

// ==============================================
// Main Assembly
// ==============================================
module keyboard() {
    color("LightGray") base();
    color("SlateGray") keyboard_layout();
}

// Render the keyboard
keyboard();