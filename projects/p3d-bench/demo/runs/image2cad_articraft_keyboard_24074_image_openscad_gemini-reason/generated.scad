/*
 * Parametric Slim Keyboard Model
 * Recreates the minimalist aesthetic of a modern desktop keyboard
 * with a wedge base, cylindrical back foot, and low-profile keys.
 */

// --- Resolution ---
$fn = 64; 

// --- Design Parameters ---

// Key Grid & Sizing
pitch_x = 18.0;      // Horizontal distance between key centers
pitch_y = 18.0;      // Vertical distance between key centers
gap = 2.5;           // Spacing between adjacent keys
key_height = 1.5;    // Height of the keys above the board surface
key_r = 1.0;         // Corner radius of individual keys

// Base Board Dimensions
board_padding_x = 8.0;  // Margin on left/right sides
board_padding_y = 8.0;  // Margin on top/bottom sides
board_thickness = 3.0;  // Thickness of the front edge of the board
board_r = 4.0;          // Corner radius at the front of the board
foot_radius = 6.0;      // Radius of the cylindrical stand at the back

// Colors (for visualization)
color_board = "#B0B5B9";
color_keys  = "#4A4D54";

// Overlap for manifold 3D printing/export
overlap = 0.1; 

// --- Helper Modules ---

/*
 * Generates a single flat-topped key with rounded corners.
 * Dimensions are calculated based on grid units.
 */
module single_key(w_u, h_u) {
    // Calculate actual physical dimensions
    w = w_u * pitch_x - gap;
    d = h_u * pitch_y - gap;
    
    // Extrude with overlap to ensure it sinks into the board
    linear_extrude(height = key_height + overlap)
    translate([w/2, d/2]) // Center the profile for offset
    offset(r = key_r)
    square([w - 2*key_r, d - 2*key_r], center = true);
}

/*
 * Positions a key at a specific grid coordinate.
 */
module place_key(x_u, y_u, w_u=1, h_u=1) {
    translate([x_u * pitch_x, y_u * pitch_y, 0])
        single_key(w_u, h_u);
}

// --- Keyboard Layout Sections ---

module main_block() {
    // Row 0 (Spacebar row)
    place_key(0, 0, 1.5);    // Ctrl
    place_key(1.5, 0, 1);    // Opt
    place_key(2.5, 0, 1.5);  // Cmd
    place_key(4, 0, 7);      // Spacebar
    place_key(11, 0, 1.5);   // Cmd
    place_key(12.5, 0, 1);   // Opt
    place_key(13.5, 0, 1.5); // Ctrl
    
    // Row 1 (ZXC row)
    place_key(0, 1, 2.25);   // L-Shift
    for(i=[0:9]) place_key(2.25 + i, 1, 1);
    place_key(12.25, 1, 2.75); // R-Shift
    
    // Row 2 (ASD row)
    place_key(0, 2, 1.75);   // Caps Lock
    for(i=[0:10]) place_key(1.75 + i, 2, 1);
    place_key(12.75, 2, 2.25); // Enter
    
    // Row 3 (QWE row)
    place_key(0, 3, 1.5);    // Tab
    for(i=[0:11]) place_key(1.5 + i, 3, 1);
    place_key(13.5, 3, 1.5); // Backslash
    
    // Row 4 (Number row)
    for(i=[0:12]) place_key(i, 4, 1); // Tilde through Equals
    place_key(13, 4, 2);     // Backspace
    
    // Row 5 (Function keys - half height)
    for(i=[0:14]) place_key(i, 5, 1, 0.5);
}

module nav_block() {
    // Offset standard nav block by 15.5 units horizontally
    offset_x = 15.5;
    
    // Row 0 (Arrows)
    place_key(offset_x, 0, 1);       // Left
    place_key(offset_x + 1, 0, 1);   // Down
    place_key(offset_x + 2, 0, 1);   // Right
    
    // Row 1 (Up Arrow)
    place_key(offset_x + 1, 1, 1);   // Up
    
    // Row 2 is empty for visual separation
    
    // Row 3 (Del, End, PgDn)
    for(i=[0:2]) place_key(offset_x + i, 3, 1);
    
    // Row 4 (Ins, Home, PgUp)
    for(i=[0:2]) place_key(offset_x + i, 4, 1);
    
    // Row 5 (F13-F15 - half height)
    for(i=[0:2]) place_key(offset_x + i, 5, 1, 0.5);
}

module numpad_block() {
    // Offset numpad by 19 units horizontally
    offset_x = 19.0;
    
    // Row 0
    place_key(offset_x, 0, 2);       // 0 key (double width)
    place_key(offset_x + 2, 0, 1);   // Decimal
    // Enter key bottom half is covered by the tall key below
    
    // Row 1
    for(i=[0:2]) place_key(offset_x + i, 1, 1); // 1, 2, 3
    place_key(offset_x + 3, 0, 1, 2);           // Enter (tall, spans rows 0-1)
    
    // Row 2
    for(i=[0:2]) place_key(offset_x + i, 2, 1); // 4, 5, 6
    
    // Row 3
    for(i=[0:2]) place_key(offset_x + i, 3, 1); // 7, 8, 9
    place_key(offset_x + 3, 2, 1, 2);           // Plus (tall, spans rows 2-3)
    
    // Row 4
    for(i=[0:3]) place_key(offset_x + i, 4, 1); // NumLock, /, *, -
    
    // Row 5 (F16-F19 - half height)
    for(i=[0:3]) place_key(offset_x + i, 5, 1, 0.5);
}

module all_keys() {
    main_block();
    nav_block();
    numpad_block();
}

// --- Base Geometry ---

module keyboard_base() {
    // Calculate total footprint of the keys
    keys_w = 23 * pitch_x;
    keys_d = 5.5 * pitch_y;
    
    // Add padding to get outer dimensions
    board_w = keys_w + 2 * board_padding_x;
    board_d = keys_d + 2 * board_padding_y;
    
    /* 
     * Create the wedge base using a hull.
     * The top surface is perfectly flat at z = board_thickness.
     * The front is thin, and the back has a large cylindrical foot.
     */
    hull() {
        // Front left corner (thin cylinder)
        translate([board_r, board_r, 0])
            cylinder(r = board_r, h = board_thickness);
            
        // Front right corner (thin cylinder)
        translate([board_w - board_r, board_r, 0])
            cylinder(r = board_r, h = board_thickness);
            
        // Back left corner (sphere forming the foot)
        // Positioned so its top tangent aligns with the top surface
        translate([foot_radius, board_d - foot_radius, board_thickness - foot_radius])
            sphere(r = foot_radius);
            
        // Back right corner (sphere forming the foot)
        translate([board_w - foot_radius, board_d - foot_radius, board_thickness - foot_radius])
            sphere(r = foot_radius);
    }
}

// --- Main Assembly ---

module keyboard() {
    // Render Base
    color(color_board)
    keyboard_base();
    
    // Render Keys
    // Sink the keys slightly into the board by 'overlap' to ensure manifold geometry
    color(color_keys)
    translate([board_padding_x, board_padding_y, board_thickness - overlap])
    all_keys();
}

// Generate the model
keyboard();