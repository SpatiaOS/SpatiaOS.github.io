// Global Resolution Setting
$fn = 100;

// --------------------------
// Parametric Dimension Definitions
// --------------------------
// Base Plate Parameters
base_length = 0.73913;
base_width = 0.543478;
base_height = 0.016304;

// Base Mount Hole Parameters
base_hole_radius = 0.0163;
base_hole_centers = [
    [0.0272, 0.1848],   // Hole 1: Left front
    [0.0272, 0.4565],   // Hole 2: Left rear
    [0.5761, 0.0272],   // Hole 3: Right front
    [0.587, 0.5163]     // Hole 4: Right rear
];

// Raised Rail Frame Parameters
rail_left_offset = 0.0435;
rail_front_offset = 0.0109;
rail_span_x = 0.5109;
rail_span_y = 0.5217;
rail_raised_height = 0.0978;
rail_thickness = 0.02; // Uniform rib thickness

// Shallow Surface Tab Parameters
tab_left_offset = 0.7065;
tab_front_offset = 0.0978;
tab_size_x = 0.0435;
tab_size_y = 0.0761;
tab_height = 0.0163;

// Deep Side Block Parameters
block_left_offset = 0.5978;
block_front_offset = 0.413;
block_size_x = 0.1413;
block_size_y = 0.087;
block_raised_height = 0.1413;
block_hole_radius = 0.0326;
block_hole_center = [0.7391, 0.4548];

// --------------------------
// Main Model Construction
// --------------------------
difference() {
    // Union of all positive solid features
    union() {
        // 1. Base plate
        cube([base_length, base_width, base_height], center=false);

        // 2. Raised rail frame (four separate ribs, no infill)
        rail_x0 = rail_left_offset;
        rail_x1 = rail_left_offset + rail_span_x;
        rail_y0 = rail_front_offset;
        rail_y1 = rail_front_offset + rail_span_y;
        // Left rib
        translate([rail_x0, rail_y0, base_height])
            cube([rail_thickness, rail_span_y, rail_raised_height]);
        // Right rib
        translate([rail_x1 - rail_thickness, rail_y0, base_height])
            cube([rail_thickness, rail_span_y, rail_raised_height]);
        // Front rib
        translate([rail_x0 + rail_thickness, rail_y0, base_height])
            cube([rail_span_x - 2*rail_thickness, rail_thickness, rail_raised_height]);
        // Rear rib
        translate([rail_x0 + rail_thickness, rail_y1 - rail_thickness, base_height])
            cube([rail_span_x - 2*rail_thickness, rail_thickness, rail_raised_height]);

        // 3. Shallow surface tab
        translate([tab_left_offset, tab_front_offset, base_height])
            cube([tab_size_x, tab_size_y, tab_height]);

        // 4. Deep side block
        translate([block_left_offset, block_front_offset, base_height])
            cube([block_size_x, block_size_y, block_raised_height]);
    }

    // --------------------------
    // Cut all through holes
    // --------------------------
    // Base plate mounting holes
    for (hc = base_hole_centers) {
        translate([hc[0], hc[1], -0.001])
            cylinder(h=base_height + 0.002, r=base_hole_radius, center=false);
    }

    // Deep block through hole
    translate([block_hole_center[0], block_hole_center[1], base_height - 0.001])
        cylinder(h=block_raised_height + 0.002, r=block_hole_radius, center=false);
}