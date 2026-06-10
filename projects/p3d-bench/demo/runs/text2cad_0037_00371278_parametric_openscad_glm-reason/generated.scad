// === Parametric Variables ===

// Base plate
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

// Through holes in base plate
hole_radius = 0.0163;
hole1_pos = [0.0272, 0.1848];
hole2_pos = [0.0272, 0.4565];
hole3_pos = [0.5761, 0.0272];
hole4_pos = [0.587, 0.5163];

// Raised rail group (rectangular frame outline)
rail_left_offset = 0.0435;
rail_right_offset = 0.1847;
rail_front_offset = 0.0109;
rail_back_offset = 0.0109;
rail_raise = 0.0978;
rail_wall = 0.0163; // assumed rib wall thickness

// Shallow rectangular tab
tab_left_offset = 0.7065;
tab_right_offset = -0.0109;  // negative = extends beyond base right edge
tab_front_offset = 0.0978;
tab_back_offset = 0.3696;
tab_height = 0.0163;

// Deeper side block
block_left_offset = 0.5978;
block_right_offset = 0;
block_front_offset = 0.413;
block_back_offset = 0.0435;
block_height = 0.141304;

// Hole through deeper block
block_hole_radius = 0.0326;
block_hole_x = 0.7391;
block_hole_y = 0.4548;

$fn = 100;

// === Derived Positions ===
rail_x0 = rail_left_offset;
rail_x1 = base_length - rail_right_offset;
rail_y0 = rail_front_offset;
rail_y1 = base_width - rail_back_offset;

tab_x0 = tab_left_offset;
tab_x1 = base_length - tab_right_offset;
tab_y0 = tab_front_offset;
tab_y1 = base_width - tab_back_offset;

blk_x0 = block_left_offset;
blk_x1 = base_length - block_right_offset;
blk_y0 = block_front_offset;
blk_y1 = base_width - block_back_offset;

// === Main Assembly ===
union() {

    // --- Base plate with four through holes ---
    difference() {
        cube([base_length, base_width, base_height]);

        for (p = [hole1_pos, hole2_pos, hole3_pos, hole4_pos]) {
            translate([p[0], p[1], -0.001])
                cylinder(h=base_height + 0.002, r=hole_radius);
        }
    }

    // --- Raised rail group: rectangular rib outline (frame) ---
    translate([rail_x0, rail_y0, base_height])
    difference() {
        // Outer rectangular profile
        cube([rail_x1 - rail_x0, rail_y1 - rail_y0, rail_raise]);
        // Hollow interior
        translate([rail_wall, rail_wall, -0.001])
            cube([
                rail_x1 - rail_x0 - 2 * rail_wall,
                rail_y1 - rail_y0 - 2 * rail_wall,
                rail_raise + 0.002
            ]);
    }

    // --- Shallow rectangular tab ---
    translate([tab_x0, tab_y0, base_height])
        cube([tab_x1 - tab_x0, tab_y1 - tab_y0, tab_height]);

    // --- Deeper side block with through hole ---
    translate([blk_x0, blk_y0, base_height])
    difference() {
        cube([blk_x1 - blk_x0, blk_y1 - blk_y0, block_height]);
        // Circular through opening in block
        translate([block_hole_x - blk_x0, block_hole_y - blk_y0, -0.001])
            cylinder(h=block_height + 0.002, r=block_hole_radius);
    }

}