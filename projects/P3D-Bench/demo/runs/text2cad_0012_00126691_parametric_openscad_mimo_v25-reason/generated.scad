// === Main Reference Slab Parameters ===
base_length = 0.5;      // X dimension
base_width = 0.75;      // Y dimension
base_height = 0.016667; // Z dimension (thickness)

// === Upper-Side Block Parameters ===
upper_block_width = 0.5;
upper_block_depth = 0.5;
upper_front_offset = 0.25;
upper_reach = 0.2334;   // Total reach from base datum

// === Edge Strip Parameters ===
strip_width = 0.0083;
strip_length = 0.5;
strip_depth = 0.0083;
strip_front_offset = 0.25;
strip_edge_offset = 0.4917;

// === Transverse Feature Parameters ===
transverse_width = 0.5;
transverse_depth = 0.250819;
transverse_front_offset = 0.24922;
transverse_back_offset = 0.249961;
transverse_thickness = 0.0021;
transverse_reach = 0.335265;

// === Transverse Void Parameters ===
void_width = 0.3;
void_depth = 0.15;

// === Stepped Portion Parameters ===
shallow_depth = 0.1;       // Upper pad depth
deeper_depth = 0.2167;     // Deeper continuation depth
shallow_width = 0.5;
shallow_length = 0.5;
deeper_width = 0.375;      // Contained within shallow footprint
deeper_length = 0.5;

// === Resolution ===
$fn = 100;

// === Main Assembly ===
union() {
    // Step 1: Main reference slab (base)
    cube([base_length, base_width, base_height]);

    // Step 2: Upper-side rectangular feature
    // Flush to left, right, back; offset from front
    translate([0, upper_front_offset, 0])
        cube([upper_block_width, upper_block_depth, upper_reach]);

    // Step 3: Left edge strip
    // Flush with left edge, offset from right
    translate([0, strip_front_offset, upper_reach])
        cube([strip_width, strip_length, strip_depth]);

    // Step 4: Right edge strip
    // Flush with right edge, offset from left
    translate([base_length - strip_width, strip_front_offset, upper_reach])
        cube([strip_width, strip_length, strip_depth]);

    // Step 5: Thin transverse feature with void
    // Flush to left/right, offset from front and back
    difference() {
        // Solid transverse feature
        translate([0, transverse_front_offset, 0])
            cube([transverse_width, transverse_depth, transverse_reach]);

        // Closed internal void profile (rectangular cutout through feature)
        translate([
            (transverse_width - void_width) / 2,
            transverse_front_offset + (transverse_depth - void_depth) / 2,
            -0.001
        ])
            cube([void_width, void_depth, transverse_reach + 0.002]);
    }

    // Step 6: Stepped portion - shallow upper pad
    // Reach measured from base datum
    cube([shallow_width, shallow_length, shallow_depth]);

    // Step 7: Stepped portion - deeper continuation
    // Extends below shoulder; reach measured from same shoulder
    // Shares left, front, back edges with shallow footprint
    translate([0, 0, -(deeper_depth - shallow_depth)])
        cube([deeper_width, deeper_length, deeper_depth]);
}