// === Parameters ===

// Base reference slab
base_length    = 0.5;
base_width     = 0.75;
base_height    = 0.016667;

// Rear solid rectangular block (upper-side feature)
block_length   = 0.5;       // flush left & right
block_width    = 0.5;       // flush back, offset 0.25 from front
block_y_offset = 0.25;      // front-edge offset
block_reach    = 0.2334;    // total z from base datum

// Narrow edge strips atop rear block
strip_w        = 0.0083;    // x-width of each strip
strip_l        = 0.5;       // y-length (matches block_width)
strip_h        = 0.0083;    // z-extrusion depth

// Thin transverse plate
plate_length   = 0.5;       // x-extent, flush left & right
plate_width    = 0.250819;  // y-extent
plate_y_offset = 0.24922;   // offset from front edge
plate_thickness= 0.0021;    // own z-thickness
plate_reach    = 0.335265;  // top-surface z from base datum

// Frame wall thickness (matches strip width)
wall_t         = 0.0083;

// Stepped portion depths measured from shoulder (block top)
upper_pad_depth = 0.1;      // all 4 walls (shallow footprint)
deeper_depth    = 0.2167;   // left, front, back walls only

// === Derived Values ===
block_height   = block_reach - base_height;
plate_z_bottom = plate_reach - plate_thickness;
shoulder_z     = block_reach;

// Rectangular void inside thin plate (closed internal profile)
void_x   = wall_t;
void_y   = plate_y_offset + wall_t;
void_len = plate_length - 2 * wall_t;
void_wid = plate_width  - 2 * wall_t;

eps = 0.001;
$fn = 60;

// === Modules ===

// 1. Main reference slab
module base_slab() {
    cube([base_length, base_width, base_height]);
}

// 2. Upper-side solid rectangular feature on rear half
module rear_block() {
    translate([0, block_y_offset, base_height])
        cube([block_length, block_width, block_height]);
}

// 3. Two narrow edge strips on top of rear block
module edge_strips() {
    // Left strip – flush with left edge
    translate([0, block_y_offset, block_reach])
        cube([strip_w, strip_l, strip_h]);
    // Right strip – flush with right edge
    translate([base_length - strip_w, block_y_offset, block_reach])
        cube([strip_w, strip_l, strip_h]);
}

// 4. Stepped frame walls (upper pad + deeper continuation)
//    Connects block top to thin plate; acts as perimeter support.
module stepped_walls() {
    // --- Upper pad (shallow footprint, right wall only) ---
    right_h = plate_z_bottom - shoulder_z;   // ~0.1
    translate([plate_length - wall_t, plate_y_offset, shoulder_z])
        cube([wall_t, plate_width, right_h]);

    // --- Deeper continuation (left, front, back walls) ---
    // Left wall
    translate([0, plate_y_offset, shoulder_z])
        cube([wall_t, plate_width, deeper_depth]);
    // Front wall (full x-span)
    translate([0, plate_y_offset, shoulder_z])
        cube([plate_length, wall_t, deeper_depth]);
    // Back wall (full x-span)
    translate([0, plate_y_offset + plate_width - wall_t, shoulder_z])
        cube([plate_length, wall_t, deeper_depth]);
}

// 5. Thin transverse plate with closed-profile void
module thin_plate() {
    difference() {
        // Solid plate
        translate([0, plate_y_offset, plate_z_bottom])
            cube([plate_length, plate_width, plate_thickness]);
        // Open void (rectangular through-hole)
        translate([void_x, void_y, plate_z_bottom - eps])
            cube([void_len, void_wid, plate_thickness + 2 * eps]);
    }
}

// === Final Assembly ===
union() {
    base_slab();
    rear_block();
    edge_strips();
    stepped_walls();
    thin_plate();
}