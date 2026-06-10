// Global resolution
$fn = 100;

// Base parameters
base_len = 0.73913;
base_wid = 0.543478;
base_ht = 0.016304;

// Base hole parameters
hole_r = 0.0163;
hole_pos = [
    [0.0272, 0.1848],
    [0.0272, 0.4565],
    [0.5761, 0.0272],
    [0.5870, 0.5163]
];

// Rail parameters
rail_span_x = 0.5109;
rail_span_y = 0.5217;
rail_off_x = 0.0435;
rail_off_y = 0.0109;
rail_ht = 0.0978;
rail_wall = 0.015; // Wall thickness for rib outline

// Tab parameters
tab_len = 0.0435;
tab_wid = 0.0761;
tab_ht = 0.0163;
tab_off_x = 0.7065;
tab_off_y = 0.0978;

// Deep block parameters
blk_len = 0.1413;   // Derived from footprint to match right-edge constraint
blk_wid = 0.087;    // Derived from footprint
blk_ht = 0.1413;
blk_off_x = 0.5978;
blk_off_y = 0.413;

// Deep block hole parameters
blk_hole_r = 0.0326;
blk_hole_x = 0.7391;
blk_hole_y = 0.4548;

// Main geometry assembly
difference() {
    union() {
        // Base plate
        cube([base_len, base_wid, base_ht]);

        // Raised rail outline (hollow rectangular frame)
        translate([rail_off_x, rail_off_y, base_ht]) {
            difference() {
                cube([rail_span_x, rail_span_y, rail_ht]);
                translate([rail_wall, rail_wall, -0.5])
                    cube([rail_span_x - 2*rail_wall, rail_span_y - 2*rail_wall, rail_ht + 1]);
            }
        }

        // Shallow tab
        translate([tab_off_x, tab_off_y, base_ht])
            cube([tab_len, tab_wid, tab_ht]);

        // Deeper side block
        translate([blk_off_x, blk_off_y, base_ht])
            cube([blk_len, blk_wid, blk_ht]);
    }

    // Through holes in base plate
    for (p = hole_pos) {
        translate([p[0], p[1], -1])
            cylinder(r=hole_r, h=base_ht + 2);
    }

    // Through hole in deeper side block
    translate([blk_hole_x, blk_hole_y, base_ht - 1])
        cylinder(r=blk_hole_r, h=blk_ht + 2);
}