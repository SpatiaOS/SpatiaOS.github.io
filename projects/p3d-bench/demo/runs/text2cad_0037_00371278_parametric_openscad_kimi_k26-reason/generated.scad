// Parametric dimensions
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

hole_radius = 0.0163;
$fn = 100;

// Base through-hole centers: [x, y]
base_holes = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.587, 0.5163]
];

// Main raised rail group parameters
rail_left   = 0.0435;
rail_right  = 0.1847;
rail_front  = 0.0109;
rail_back   = 0.0109;
rail_height = 0.0978;
rail_thick  = 0.0326;   // rib wall thickness

// Shallow tab parameters
tab_length = 0.0435;
tab_width  = 0.0761;
tab_left   = 0.7065;
tab_front  = 0.0978;
tab_height = 0.0163;

// Deeper side block parameters
// Footprint derived from offsets to ensure placement matches
block_left   = 0.5978;
block_front  = 0.413;
block_length = base_length - block_left;                 // 0.14133
block_width  = base_width - block_front - 0.0435;        // 0.086978
block_height = 0.141304;
block_hole_x = 0.7391;
block_hole_y = 0.4548;
block_hole_r = 0.0326;

// Main rectangular base with four circular through openings
module base_plate() {
    difference() {
        cube([base_length, base_width, base_height]);
        for (p = base_holes) {
            translate([p[0], p[1], -0.01])
                cylinder(h = base_height + 0.02, r = hole_radius);
        }
    }
}

// Raised rail group as separate solid rectangular ribs (outline)
module rail_group() {
    rail_w = base_length - rail_left - rail_right;
    rail_d = base_width - rail_front - rail_back;
    z0     = base_height;

    // Bottom rib
    translate([rail_left, rail_front, z0])
        cube([rail_w, rail_thick, rail_height]);

    // Top rib
    translate([rail_left, base_width - rail_back - rail_thick, z0])
        cube([rail_w, rail_thick, rail_height]);

    // Left rib
    translate([rail_left, rail_front, z0])
        cube([rail_thick, rail_d, rail_height]);

    // Right rib
    translate([base_length - rail_right - rail_thick, rail_front, z0])
        cube([rail_thick, rail_d, rail_height]);
}

// Shallow rectangular tab on upper face
module shallow_tab() {
    translate([tab_left, tab_front, base_height])
        cube([tab_length, tab_width, tab_height]);
}

// Deeper side solid block with through opening
module side_block() {
    difference() {
        translate([block_left, block_front, 0])
            cube([block_length, block_width, block_height]);
        translate([block_hole_x, block_hole_y, -0.01])
            cylinder(h = block_height + 0.02, r = block_hole_r);
    }
}

// Assembly
union() {
    base_plate();
    rail_group();
    shallow_tab();
    side_block();
}