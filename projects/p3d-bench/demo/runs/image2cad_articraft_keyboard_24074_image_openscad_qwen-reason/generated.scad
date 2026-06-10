// Parametric Wireless Keyboard Model
// Based on visual analysis of a sleek, low-profile chiclet keyboard (e.g., Magic Keyboard style)

// ==========================================
// Parameters
// ==========================================
$fn = 60; // Resolution for curves

// Board Dimensions
board_width = 470;      // Total width in mm (Full size approx)
board_depth = 135;      // Total depth in mm
board_thickness = 5;    // Base thickness in mm
board_corner_r = 10;    // Corner radius of the board
board_lip_h = 1;        // Height of the rim/lip

// Key Dimensions
key_pitch = 19.05;      // Standard key pitch (1u) in mm
key_top_w = 15.0;       // Width of key top surface
key_top_h = 15.0;       // Depth of key top surface
key_height = 2.0;       // Height of key protrusion
key_corner_r = 3;       // Corner radius of keys

// Colors (Greyscale approximation of the image)
color_base = [0.2, 0.2, 0.2, 1]; // Dark Grey/Black body
color_key = [0.15, 0.15, 0.15, 1]; // Slightly darker keys

// ==========================================
// Modules
// ==========================================

// Module to create a rounded rectangle in 2D
module rounded_rect_2d(w, d, r) {
    hull() {
        translate([w/2 - r, d/2 - r]) circle(r);
        translate([-w/2 + r, d/2 - r]) circle(r);
        translate([-w/2 + r, -d/2 + r]) circle(r);
        translate([w/2 - r, -d/2 + r]) circle(r);
    }
}

// Module for the base plate
module base_plate() {
    color(color_base)
    difference() {
        // Main body with lip
        linear_extrude(height = board_thickness + board_lip_h)
        rounded_rect_2d(board_width, board_depth, board_corner_r);
        
        // Inner cutout to create the lip (optional, for detail)
        // translate([0, 0, board_lip_h])
        // linear_extrude(height = board_thickness)
        // rounded_rect_2d(board_width - 2, board_depth - 2, board_corner_r - 1);
    }
    
    // Bottom feet/stand (simplified)
    color([0.1, 0.1, 0.1, 1])
    translate([0, -board_depth/2 + 10, -2])
    cube([board_width - 40, 20, 2], center=true);
}

// Module for a single chiclet key
// w_u, h_u: width and height in units (1u = key_pitch)
module chiclet_key(w_u, h_u) {
    // Calculate actual dimensions
    // The key top is smaller than the pitch to create gaps
    actual_w = max(w_u * key_pitch - 3.5, 5); 
    actual_h = max(h_u * key_pitch - 3.5, 5);

    color(color_key)
    translate([0, 0, board_thickness]) // Place on top of base
    linear_extrude(height = key_height)
    rounded_rect_2d(actual_w, actual_h, key_corner_r);
}

// Helper to place a key at specific grid coordinates
// x, y: center position in mm
// w_u, h_u: size in units
module place_key(x, y, w_u, h_u) {
    translate([x, y, 0])
    chiclet_key(w_u, h_u);
}

// ==========================================
// Layout Definition
// ==========================================

module keyboard_layout() {
    // Grid Configuration
    // Origin (0,0) is center of the board
    
    // Y positions for rows (Bottom to Top)
    row_y = [
        -45,   // Row 0: Bottom (Ctrl, Space, Arrows, Numpad 0)
        -26,   // Row 1: Shift, Z-M, Numpad 1-3
        -7,    // Row 2: Caps, A-L, Numpad 4-6
         12,   // Row 3: Tab, Q-P, Numpad 7-9
         31,   // Row 4: Tilde, 1-0, Numpad Num, /, *, -
         50    // Row 5: Esc, F-keys
    ];

    // --- Main Alphanumeric Block ---
    main_block_center_x = -60;
    main_start_x = main_block_center_x - (14.5 * key_pitch / 2); 

    // Row 0 (Bottom): Ctrl, Win, Alt, Space, Alt, Fn
    x = main_start_x;
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // Ctrl
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // Win
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // Alt
    place_key(x + 3.125 * key_pitch, row_y[0], 6.25, 1); x = x + 6.25 * key_pitch; // Space
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // Alt
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // Fn
    
    // Row 1: Shift(2.25), Z...M(10), Shift(2.75)
    x = main_start_x;
    place_key(x, row_y[1], 2.25, 1); x = x + 2.25 * key_pitch; 
    for (i = [0 : 9]) { 
        place_key(x + i * key_pitch, row_y[1], 1, 1); 
    }
    x = x + 10 * key_pitch;
    place_key(x, row_y[1], 2.75, 1); x = x + 2.75 * key_pitch; 

    // Row 2: Caps(1.5), A...L(11), Enter(2.25)
    x = main_start_x;
    place_key(x, row_y[2], 1.5, 1); x = x + 1.5 * key_pitch; 
    for (i = [0 : 10]) { 
        place_key(x + i * key_pitch, row_y[2], 1, 1);
    }
    x = x + 11 * key_pitch;
    place_key(x, row_y[2], 2.25, 1); x = x + 2.25 * key_pitch; 

    // Row 3: Tab(1.5), Q...P(10), [, ], \(3)
    x = main_start_x;
    place_key(x, row_y[3], 1.5, 1); x = x + 1.5 * key_pitch; 
    for (i = [0 : 12]) { 
        place_key(x + i * key_pitch, row_y[3], 1, 1);
    }
    x = x + 13 * key_pitch;

    // Row 4: `(1), 1...0(10), -, =(2), Backspace(2)
    x = main_start_x;
    place_key(x, row_y[4], 1, 1); x = x + key_pitch; 
    for (i = [0 : 11]) { 
        place_key(x + i * key_pitch, row_y[4], 1, 1);
    }
    x = x + 12 * key_pitch;
    place_key(x, row_y[4], 2, 1); x = x + 2 * key_pitch; 

    // Row 5: Esc(1), F1-F4(4), F5-F8(4), F9-F12(4)
    x = main_start_x;
    place_key(x, row_y[5], 1, 1); x = x + key_pitch; // Esc
    x = x + 0.5 * key_pitch; // Gap
    for (i = [0 : 3]) { place_key(x + i * key_pitch, row_y[5], 1, 1); } // F1-F4
    x = x + 4 * key_pitch; 
    
    x = x + 0.5 * key_pitch; // Gap
    for (i = [0 : 3]) { place_key(x + i * key_pitch, row_y[5], 1, 1); } // F5-F8
    x = x + 4 * key_pitch;

    x = x + 0.5 * key_pitch; // Gap
    for (i = [0 : 3]) { place_key(x + i * key_pitch, row_y[5], 1, 1); } // F9-F12
    x = x + 4 * key_pitch;

    // --- Navigation & Arrow Keys ---
    arrow_base_x = main_start_x + 16 * key_pitch;
    
    // Left Arrow
    place_key(arrow_base_x, row_y[0], 1, 1);
    // Down Arrow
    place_key(arrow_base_x + key_pitch, row_y[0], 1, 1);
    // Right Arrow
    place_key(arrow_base_x + 2 * key_pitch, row_y[0], 1, 1);
    // Up Arrow (Above Down)
    place_key(arrow_base_x + key_pitch, row_y[1], 1, 1);
    
    // Nav Cluster (Insert, Home, PageUp / Delete, End, PageDown)
    nav_cluster_x_start = arrow_base_x;
    // Lower row (Del, End, PgDn) - Row 2 level
    for (i = [0 : 2]) { place_key(nav_cluster_x_start + i * key_pitch, row_y[2], 1, 1); }
    // Upper row (Ins, Home, PgUp) - Row 3 level
    for (i = [0 : 2]) { place_key(nav_cluster_x_start + i * key_pitch, row_y[3], 1, 1); }

    // --- Numpad ---
    numpad_center_x = 140;
    numpad_start_x = numpad_center_x - 2 * key_pitch; 
    
    // Numpad Row 4 (Top - Num Lock row)
    x = numpad_start_x;
    place_key(x, row_y[4], 1, 1); x = x + key_pitch; // Num
    place_key(x, row_y[4], 1, 1); x = x + key_pitch; // /
    place_key(x, row_y[4], 1, 1); x = x + key_pitch; // *
    place_key(x, row_y[4], 1, 1); x = x + key_pitch; // -
    
    // Numpad Row 3 (7 8 9 +)
    x = numpad_start_x;
    place_key(x, row_y[3], 1, 1); x = x + key_pitch; // 7
    place_key(x, row_y[3], 1, 1); x = x + key_pitch; // 8
    place_key(x, row_y[3], 1, 1); x = x + key_pitch; // 9
    // + Key (Tall)
    translate([x, (row_y[3] + row_y[2])/2, 0]) chiclet_key(1, 2); 
    x = x + key_pitch;
    
    // Numpad Row 2 (4 5 6)
    x = numpad_start_x;
    place_key(x, row_y[2], 1, 1); x = x + key_pitch; // 4
    place_key(x, row_y[2], 1, 1); x = x + key_pitch; // 5
    place_key(x, row_y[2], 1, 1); x = x + key_pitch; // 6
    
    // Numpad Row 1 (1 2 3 Enter)
    x = numpad_start_x;
    place_key(x, row_y[1], 1, 1); x = x + key_pitch; // 1
    place_key(x, row_y[1], 1, 1); x = x + key_pitch; // 2
    place_key(x, row_y[1], 1, 1); x = x + key_pitch; // 3
    // Enter Key (Tall)
    translate([x, (row_y[1] + row_y[0])/2, 0]) chiclet_key(1, 2);
    x = x + key_pitch;
    
    // Numpad Row 0 (0 .)
    x = numpad_start_x;
    place_key(x, row_y[0], 2, 1); x = x + 2 * key_pitch; // 0 (Wide)
    place_key(x, row_y[0], 1, 1); x = x + key_pitch; // .
}

// ==========================================
// Assembly
// ==========================================

module keyboard() {
    // Base
    base_plate();
    
    // Keys
    keyboard_layout();
}

// Render
keyboard();