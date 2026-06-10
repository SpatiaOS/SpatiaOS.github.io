// === Parameters ===

// Base plate dimensions
base_length   = 0.73913;
base_width    = 0.543478;
base_height   = 0.016304;

// Through-hole radius (4 holes in base plate)
hole_r = 0.0163;

// Hole center positions [x, y] from front-left corner of base
hole_pos = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.587,  0.5163]
];

// Raised rail frame (rectangular rib outline on upper face)
rail_x_off    = 0.0435;
rail_y_off    = 0.0109;
rail_span_x   = 0.5109;
rail_span_y   = 0.5217;
rail_height   = 0.0978;
rail_wall     = 0.016304;   // rib wall thickness

// Shallow rectangular tab on upper face
tab_x_off     = 0.7065;
tab_y_off     = 0.0978;
tab_length    = 0.0435;
tab_width     = 0.0761;
tab_height    = 0.0163;

// Deep side block
block_x_off   = 0.5978;
block_y_off   = 0.413;
block_x_size  = 0.141304;
block_y_size  = 0.086957;
block_z_size  = 0.141304;   // total height from z=0

// Horizontal through-hole in deep block
bhole_r       = 0.0326;
bhole_y       = 0.4548;     // y center (front-edge offset)

// Resolution
$fn = 100;

// === Helper Modules ===

// Rectangular frame: outer shell minus inner void
module rect_frame(ox, oy, h, wall) {
    difference() {
        cube([ox, oy, h]);
        translate([wall, wall, -0.001])
            cube([ox - 2 * wall, oy - 2 * wall, h + 0.002]);
    }
}

// === Main Assembly ===

difference() {
    union() {
        // Step 1: Main rectangular base plate
        cube([base_length, base_width, base_height]);

        // Step 2: Raised rail frame (rib outlines, not filled pad)
        translate([rail_x_off, rail_y_off, base_height])
            rect_frame(rail_span_x, rail_span_y, rail_height, rail_wall);

        // Step 3: Shallow rectangular tab on upper face
        translate([tab_x_off, tab_y_off, base_height])
            cube([tab_length, tab_width, tab_height]);

        // Step 4: Deep side block (starts at z=0, encompasses base region)
        translate([block_x_off, block_y_off, 0])
            cube([block_x_size, block_y_size, block_z_size]);
    }

    // Step 5: Four circular through-holes in the base plate
    for (p = hole_pos) {
        translate([p[0], p[1], -0.001])
            cylinder(h = base_height + 0.002, r = hole_r);
    }

    // Step 6: Horizontal through-hole in deep block (along x-axis)
    translate([block_x_off - 0.001, bhole_y, block_z_size / 2])
        rotate([0, 90, 0])
            cylinder(h = block_x_size + 0.002, r = bhole_r);
}