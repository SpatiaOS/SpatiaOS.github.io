// Parametric dimensions for the overall model
base_length        = 0.73913;
base_width         = 0.543478;
base_thickness     = 0.016304;   // plate thickness, also extrusion for tab
hole_radius        = 0.0163;

// Base-plate hole centre coordinates (x = from left, y = from front)
hole_centers = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.587,  0.5163]
];

// Raised rail group – a rectangular frame made of four separate ribs
rail_height        = 0.0978;
rail_width         = base_thickness;          // rib cross‑section width (assumed)
rail_outer_left    = 0.0435;                  // distance from left edge
rail_outer_right   = base_length - 0.1847;    // distance from right edge
rail_outer_front   = 0.0109;                  // distance from front edge
rail_outer_back    = base_width - 0.0109;     // distance from back edge

// Shallow rectangular tab (overhangs right side)
tab_left           = 0.7065;
tab_right          = base_length + 0.0109;    // offset -0.0109 from right edge
tab_front          = 0.0978;
tab_back           = base_width - 0.3696;     // offset 0.3696 from back edge
tab_height         = 0.0163;

// Deeper side solid block
block_left         = 0.5978;
block_right        = base_length;             // offset 0 from right edge
block_front        = 0.413;
block_back         = base_width - 0.0435;     // offset 0.0435 from back edge
block_height       = 0.141304;
block_hole_radius  = 0.0326;
block_hole_center  = [0.7391, 0.4548];        // same reference plane

// Global resolution
$fn = 100;

module base_plate() {
    cube([base_length, base_width, base_thickness]);
}

// Four circular through‑holes in the base plate
module base_holes() {
    for (c = hole_centers)
        translate([c.x, c.y, -1])
            cylinder(h = base_thickness + 2, r = hole_radius);
}

// Frame made of four separate rectangular ribs
module rail_frame() {
    // left, right, front, back ribs placed flush to the outer boundary
    translate([rail_outer_left, rail_outer_front, 0])
        cube([rail_width, rail_outer_back - rail_outer_front, rail_height]);
    translate([rail_outer_right - rail_width, rail_outer_front, 0])
        cube([rail_width, rail_outer_back - rail_outer_front, rail_height]);
    translate([rail_outer_left + rail_width, rail_outer_front, 0])
        cube([rail_outer_right - rail_outer_left - 2*rail_width, rail_width, rail_height]);
    translate([rail_outer_left + rail_width, rail_outer_back - rail_width, 0])
        cube([rail_outer_right - rail_outer_left - 2*rail_width, rail_width, rail_height]);
}

module shallow_tab() {
    translate([tab_left, tab_front, 0])
        cube([tab_right - tab_left, tab_back - tab_front, tab_height]);
}

module deep_block() {
    translate([block_left, block_front, 0])
        cube([block_right - block_left, block_back - block_front, block_height]);
}

// Through‑hole penetrating the deep block
module deep_block_hole() {
    translate([block_hole_center.x, block_hole_center.y, -0.01])
        cylinder(h = block_height + 0.02, r = block_hole_radius);
}

// --- Assemble the complete solid ---
difference() {
    union() {
        base_plate();
        // Raise all top features above the base plate
        translate([0, 0, base_thickness]) {
            rail_frame();
            shallow_tab();
            deep_block();
        }
    }
    // Subtract base holes
    base_holes();
    // Subtract hole in the deep block
    translate([0, 0, base_thickness])
        deep_block_hole();
}