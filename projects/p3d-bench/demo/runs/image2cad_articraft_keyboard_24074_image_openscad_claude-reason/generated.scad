// Full-Size Slim Keyboard (Apple-style)
// All dimensions in millimeters

$fn = 60;

// ===== Keyboard Body Parameters =====
body_w = 435;           // Total width
body_d = 130;           // Total depth (front to back)
body_h_front = 3.0;     // Height at front edge
body_h_back = 6.0;      // Height at back edge
body_r = 6;             // Corner radius
base_h = 1.2;           // Thin base plate height

// ===== Key Parameters =====
u = 18.5;               // Key unit pitch
cap_1u = 15.5;          // 1U keycap size
cap_h = 1.2;            // Keycap protrusion above surface
well_depth = 0.5;       // Key well depth below surface
cap_r = 1.5;            // Keycap corner radius
well_r = 1.0;           // Well corner radius

// ===== Layout Origin =====
ox = 7;                 // Left edge to column 0 left edge
oy = 9.5;               // Front edge to row 0 bottom edge

// ===== Section Start Columns =====
nav_c = 15.5;           // Navigation cluster start
num_c = 18.75;          // Numpad start

// ===== Functions =====

// Surface height at given Y position (mm)
function surface_z(y) = body_h_front + (body_h_back - body_h_front) *
    max(0, min(1, (y - body_r) / (body_d - 2 * body_r)));

// ===== 2D Rounded Rectangle =====
module rrect(w, h, r) {
    offset(r = r)
        square([w - 2*r, h - 2*r], center = true);
}

// ===== Keyboard Body =====
module keyboard_body() {
    // Main wedge body with rounded corners
    hull() {
        // Front corners (thin)
        translate([body_r, body_r, 0])
            cylinder(r = body_r, h = body_h_front);
        translate([body_w - body_r, body_r, 0])
            cylinder(r = body_r, h = body_h_front);
        // Back corners (thick)
        translate([body_r, body_d - body_r, 0])
            cylinder(r = body_r, h = body_h_back);
        translate([body_w - body_r, body_d - body_r, 0])
            cylinder(r = body_r, h = body_h_back);
    }
    
    // Slightly wider base plate for stepped edge detail
    translate([0, 0, 0])
    hull() {
        translate([body_r - 0.5, body_r - 0.5, 0])
            cylinder(r = body_r, h = base_h);
        translate([body_w - body_r + 0.5, body_r - 0.5, 0])
            cylinder(r = body_r, h = base_h);
        translate([body_r - 0.5, body_d - body_r + 0.5, 0])
            cylinder(r = body_r, h = base_h);
        translate([body_w - body_r + 0.5, body_d - body_r + 0.5, 0])
            cylinder(r = body_r, h = base_h);
    }
}

// ===== Small cylindrical element on left edge (power button) =====
module edge_button() {
    y_pos = body_d * 0.5;
    z_pos = surface_z(y_pos) * 0.45;
    translate([0, y_pos, z_pos])
        rotate([0, 90, 0])
            cylinder(d = 4.5, h = 1.5, $fn = 30);
}

// ===== Keycap Geometry =====
module keycap(wu = 1, hu = 1) {
    w = (wu - 1) * u + cap_1u;
    h = (hu - 1) * u + cap_1u;
    total_h = well_depth + cap_h;
    
    // Slightly tapered cap for realism
    linear_extrude(total_h, scale = 0.97)
        rrect(w, h, cap_r);
}

// ===== Key Well Cut Geometry =====
module keywell(wu = 1, hu = 1) {
    w = (wu - 1) * u + cap_1u + 1.5;
    h = (hu - 1) * u + cap_1u + 1.5;
    
    // Tall cut to go through surface
    linear_extrude(well_depth + cap_h + 8)
        rrect(w, h, well_r);
}

// ===== Key Placement Module =====
// mode: 0 = well (subtraction), 1 = cap (addition)
module pk(col, row, wu, hu, mode) {
    cx = ox + col * u + wu * u / 2;
    cy = oy + row * u + hu * u / 2;
    z = surface_z(cy);
    
    translate([cx, cy, z - well_depth]) {
        if (mode == 0)
            keywell(wu, hu);
        else
            keycap(wu, hu);
    }
}

// ===== Complete Keyboard Layout =====
// Defines all key positions for both wells and caps
module layout(mode) {

    // ======== ROW 0: Space bar / Bottom modifier row ========
    pk(0,     0, 1.25, 1, mode);    // Left Ctrl
    pk(1.25,  0, 1.25, 1, mode);    // Left Fn/Win
    pk(2.5,   0, 1.25, 1, mode);    // Left Alt/Option
    pk(3.75,  0, 6.25, 1, mode);    // Space bar
    pk(10,    0, 1.25, 1, mode);    // Right Alt/Option
    pk(11.25, 0, 1.25, 1, mode);    // Right Cmd/Win
    pk(12.5,  0, 1.25, 1, mode);    // Right Fn/Menu
    pk(13.75, 0, 1.25, 1, mode);    // Right Ctrl

    // Arrow keys (bottom row)
    pk(nav_c,     0, 1, 1, mode);   // Left arrow
    pk(nav_c + 1, 0, 1, 1, mode);   // Down arrow
    pk(nav_c + 2, 0, 1, 1, mode);   // Right arrow

    // Numpad bottom row
    pk(num_c,     0, 2, 1, mode);   // Numpad 0 (2u wide)
    pk(num_c + 2, 0, 1, 1, mode);   // Numpad .
    pk(num_c + 3, 0, 1, 2, mode);   // Numpad Enter (2u tall)

    // ======== ROW 1: Z / Shift row ========
    pk(0, 1, 2.25, 1, mode);        // Left Shift
    for (i = [0:9])                  // Z X C V B N M , . /
        pk(2.25 + i, 1, 1, 1, mode);
    pk(12.25, 1, 2.75, 1, mode);    // Right Shift

    // Up arrow
    pk(nav_c + 1, 1, 1, 1, mode);   // Up arrow

    // Numpad row 1
    for (i = [0:2])                  // 1 2 3
        pk(num_c + i, 1, 1, 1, mode);

    // ======== ROW 2: A / Home row ========
    pk(0, 2, 1.75, 1, mode);        // Caps Lock
    for (i = [0:10])                 // A S D F G H J K L ; '
        pk(1.75 + i, 2, 1, 1, mode);
    pk(12.75, 2, 2.25, 1, mode);    // Enter/Return

    // Numpad row 2
    for (i = [0:2])                  // 4 5 6
        pk(num_c + i, 2, 1, 1, mode);
    pk(num_c + 3, 2, 1, 2, mode);   // Numpad + (2u tall)

    // ======== ROW 3: Q / Tab row ========
    pk(0, 3, 1.5, 1, mode);         // Tab
    for (i = [0:11])                 // Q W E R T Y U I O P [ ]
        pk(1.5 + i, 3, 1, 1, mode);
    pk(13.5, 3, 1.5, 1, mode);      // Backslash

    // Navigation cluster
    for (i = [0:2])                  // Delete End PgDn
        pk(nav_c + i, 3, 1, 1, mode);

    // Numpad row 3
    for (i = [0:2])                  // 7 8 9
        pk(num_c + i, 3, 1, 1, mode);

    // ======== ROW 4: Number row ========
    for (i = [0:12])                 // ` 1 2 3 4 5 6 7 8 9 0 - =
        pk(i, 4, 1, 1, mode);
    pk(13, 4, 2, 1, mode);          // Backspace (2u wide)

    // Navigation cluster
    for (i = [0:2])                  // Insert Home PgUp
        pk(nav_c + i, 4, 1, 1, mode);

    // Numpad row 4
    for (i = [0:3])                  // NumLock / * -
        pk(num_c + i, 4, 1, 1, mode);

    // ======== ROW 5: Function row ========
    for (i = [0:14])                 // Esc F1-F12 + 2 extra
        pk(i, 5, 1, 1, mode);

    // Navigation top row
    for (i = [0:2])                  // PrtSc ScrLk Pause
        pk(nav_c + i, 5, 1, 1, mode);

    // Numpad top row
    for (i = [0:3])                  // Clear = / *
        pk(num_c + i, 5, 1, 1, mode);
}

// ===== Main Assembly =====

// Keyboard body with key wells subtracted
color([0.72, 0.72, 0.74])
difference() {
    union() {
        keyboard_body();
        edge_button();
    }
    // Cut all key wells into the body surface
    layout(0);
}

// All keycaps placed on the surface
color([0.65, 0.65, 0.67])
layout(1);