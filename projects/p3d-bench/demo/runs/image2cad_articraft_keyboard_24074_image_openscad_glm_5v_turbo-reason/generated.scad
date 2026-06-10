// ============================================
// Parametric Keyboard Model
// A modern slim keyboard with rounded base and raised keys
// ============================================

// --------------------------------------------
// DIMENSIONAL PARAMETERS (all in mm)
// --------------------------------------------

// Base plate dimensions
base_width = 455;          // Total width of keyboard
base_depth = 138;          // Total depth (front to back)
base_thickness = 3;        // Thickness of the base plate
corner_radius = 12;        // Radius of rounded corners on base
edge_fillet = 2;           // Small fillet on bottom edge

// Key specifications
key_width = 15;            // Width of standard key
key_height = 15;           // Depth of standard key  
key_cap_height = 1.8;      // Height of key cap above base
key_radius = 1.5;          // Corner radius of each key
key_gap = 2.5;             // Gap between keys

// Layout offsets
left_margin = 18;          // Left edge to first key column
top_margin = 16;           // Top edge to first key row
row_pitch = 19;            // Vertical distance between row centers
col_pitch = 18.5;          // Horizontal distance between column centers

// Special key widths (multipliers of standard key)
spacebar_width = 6.25;     // Spacebar width multiplier
enter_width = 2.25;        // Enter key width multiplier
shift_right_width = 2.75;  // Right shift width multiplier
backspace_width = 2.0;     // Backspace width multiplier
tab_width = 1.5;           // Tab key width multiplier
caps_width = 1.75;         // Caps lock width multiplier
lshift_width = 2.25;       // Left shift width multiplier

// Numpad specifics
numpad_offset_x = 355;     // X offset for numpad start
numpad_key_w = 15;         // Numpad key size
numpad_col_pitch = 17;     // Numpad column spacing

// Resolution
$fn = 60;                  // Smoothness of curves

// --------------------------------------------
// MODULES
// --------------------------------------------

// Rounded rectangular base plate with slight edge fillet
module keyboard_base() {
    difference() {
        // Main body - rounded rectangle
        linear_extrude(height = base_thickness, center = false)
            offset(r = corner_radius)
                square([base_width - 2*corner_radius, 
                       base_depth - 2*corner_radius], center = true);
        
        // Optional: slight undercut on bottom edge for aesthetics
        translate([0, 0, -0.01])
            linear_extrude(height = edge_fillet + 0.02, center = false)
                offset(r = corner_radius - 0.5)
                    square([base_width - 2*corner_radius + 1, 
                           base_depth - 2*corner_radius + 1], center = true);
    }
}

// Individual keycap with rounded top surface
module keycap(kw, kh, height = key_cap_height) {
    // Create a key with rounded top edges
    w = kw * key_width - key_gap;
    h = kh * key_height - key_gap;
    
    translate([0, 0, base_thickness])
        hull() {
            // Bottom face (slightly smaller for draft angle effect)
            translate([0, 0, 0.05])
                cube([w - 0.4, h - 0.4, 0.1], center = true);
            
            // Top face (with rounding)
            translate([0, 0, height - 0.1])
                minkowski() {
                    cube([w - 2*key_radius - 0.5, 
                          h - 2*key_radius - 0.5, 0.1], center = true);
                    cylinder(h = 0.2, r = key_radius, center = true);
                }
        }
}

// Place a single key at grid position
module place_key(col, row, width_mult = 1, height_mult = 1) {
    x_pos = -base_width/2 + left_margin + col * col_pitch + (width_mult - 1) * key_width / 2;
    y_pos = base_depth/2 - top_margin - row * row_pitch - (height_mult - 1) * key_height / 2;
    
    translate([x_pos, y_pos, 0])
        keycap(width_mult, height_mult);
}

// Generate a row of keys
module key_row(start_col, row_num, count, widths = []) {
    if (len(widths) == 0) {
        // Uniform width keys
        for (i = [0 : count-1]) {
            place_key(start_col + i, row_num);
        }
    } else {
        // Variable width keys
        col = start_col;
        for (i = [0 : len(widths)-1]) {
            place_key(col, row_num, widths[i]);
            col = col + widths[i];
        }
    }
}

// Main alphanumeric key area
module main_key_area() {
    // Row 0: Number row (Esc to Backspace)
    key_row(0, 0, 13);  // Esc through Backspace area (simplified)
    
    // Row 1: QWERTY row (Tab to ])
    key_row(0, 1, 13);
    
    // Row 2: ASDF row (Caps to Enter)
    key_row(0, 2, 12);  // Caps through Enter
    
    // Row 3: ZXCV row (LShift to RShift)
    key_row(0, 3, 11);  // Shift through Shift
    
    // Row 4: Bottom row (Ctrl/Space/Ctrl)
    // Simplified as: Ctrl, Win, Alt, Spacebar, Alt, Fn, Ctrl
    place_key(0, 4, 1.25);      // Ctrl
    place_key(1.25, 4, 1.25);   // Win/Super
    place_key(2.5, 4, 1.25);    // Alt
    place_key(3.75, 4, spacebar_width);  // Spacebar
    place_key(3.75 + spacebar_width, 4, 1.25);  // Alt Gr/Fn
    place_key(5 + spacebar_width, 4, 1.25);     // Menu/Fn
    place_key(6.25 + spacebar_width, 4, 1.5);   // Ctrl
    
    // Specific special keys with correct positioning
    // Tab (Row 1, leftmost)
    place_key(0, 1, tab_width);
    
    // Caps Lock (Row 2, leftmost)
    place_key(0, 2, caps_width);
    
    // Left Shift (Row 3, leftmost)
    place_key(0, 3, lshift_width);
    
    // Backspace (Row 0, rightmost)
    place_key(12, 0, backspace_width);
    
    // Enter key (Row 2, right side)
    place_key(11, 2, enter_width);
    
    // Right Shift (Row 3, right side)
    place_key(10, 3, shift_right_width);
}

// Numeric keypad (right side)
module numpad_keys() {
    // Numpad starts at specific X offset
    function np_x(c) = numpad_offset_x / col_pitch + c * (numpad_col_pitch / col_pitch);
    function np_y(r) = r;  // Same row numbering
    
    // Row 0: NumLock, /, *, -
    place_key(np_x(0), np_y(0), 1);
    place_key(np_x(1), np_y(0), 1);
    place_key(np_x(2), np_y(0), 1);
    place_key(np_x(3), np_y(0), 1.5);  // Minus (double wide)
    
    // Row 1: 7, 8, 9, +
    place_key(np_x(0), np_y(1), 1);
    place_key(np_x(1), np_y(1), 1);
    place_key(np_x(2), np_y(1), 1);
    place_key(np_x(3), np_y(1), 1.5);  // Plus (double wide, tall)
    
    // Row 2: 4, 5, 6
    place_key(np_x(0), np_y(2), 1);
    place_key(np_x(1), np_y(2), 1);
    place_key(np_x(2), np_y(2), 1);
    
    // Row 3: 1, 2, 3, Enter (tall)
    place_key(np_x(0), np_y(3), 1);
    place_key(np_x(1), np_y(3), 1);
    place_key(np_x(2), np_y(3), 1);
    place_key(np_x(3), np_y(2), 1, 2);  // Numpad Enter (tall)
    
    // Row 4: 0 (wide), . (decimal)
    place_key(np_x(0), np_y(4), 2);     // Zero key (double wide)
    place_key(np_x(2), np_y(4), 1);     // Decimal point
}

// Navigation cluster (between main keys and numpad)
module nav_cluster() {
    nav_x = 20;  // Column offset for nav cluster
    
    // Insert/Delete/Home/End row
    place_key(nav_x, 0, 1);  // Ins
    place_key(nav_x + 1, 0, 1);  // Home
    place_key(nav_x + 2, 0, 1);  // PgUp
    
    // Arrow keys area (inverted T shape)
    place_key(nav_x + 1, 3, 1);  // Up arrow
    place_key(nav_x, 4, 1);      // Left arrow
    place_key(nav_x + 1, 4, 1);  // Down arrow
    place_key(nav_x + 2, 4, 1);  // Right arrow
}

// --------------------------------------------
// MAIN ASSEMBLY
// --------------------------------------------
union() {
    color("dimgray") keyboard_base();
    
    color("silver") {
        main_key_area();
        numpad_keys();
        nav_cluster();
    }
}