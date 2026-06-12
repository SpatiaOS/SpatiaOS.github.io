// Parameters (mm)
slab_x = 120;          // Left-right slab size
slab_y = 80;           // Front-back slab size
slab_z = 6;            // Slab thickness

pad_x = 28;            // Shallow pad left-right size
pad_y = 20;            // Shallow pad front-back size
pad_z = 2;             // Shallow pad underside depth

continuation_x = 12;   // Narrower lower continuation left-right size
continuation_z = 5;    // Lower continuation depth below pad

pad_margin_x = 8;      // Pad inset from left/right slab edges
pad_margin_y = 8;      // Pad inset from front/back slab edges

overlap = 0.02;        // Small overlap for robust unions

// Derived pad center offsets
pad_center_x = slab_x/2 - pad_margin_x - pad_x/2;
pad_center_y = slab_y/2 - pad_margin_y - pad_y/2;

// Helper: centered rectangular solid
module rectangular_solid(size_vec, center_pos) {
    translate(center_pos)
        cube(size_vec, center=true);
}

// Main rectangular slab, bottom face at z=0
module main_slab() {
    rectangular_solid(
        [slab_x, slab_y, slab_z],
        [0, 0, slab_z/2]
    );
}

// Shallow underside pad, slightly overlapping slab underside
module shallow_pad(cx, cy) {
    rectangular_solid(
        [pad_x, pad_y, pad_z + overlap],
        [cx, cy, -pad_z/2 + overlap/2]
    );
}

// Narrower deeper continuation, sharing one side edge and full front/back edges
module lower_continuation(cx, cy, edge_side) {
    cont_cx = cx + edge_side * (pad_x - continuation_x) / 2;

    rectangular_solid(
        [continuation_x, pad_y, continuation_z + overlap],
        [cont_cx, cy, -pad_z - continuation_z/2 + overlap/2]
    );
}

// One complete two-tier underside protrusion
module tiered_underside_pad(cx, cy, edge_side) {
    union() {
        shallow_pad(cx, cy);
        lower_continuation(cx, cy, edge_side);
    }
}

// Four pads near the slab perimeter
module underside_features() {
    for (x_side = [-1, 1]) {
        for (y_side = [-1, 1]) {
            tiered_underside_pad(
                x_side * pad_center_x,
                y_side * pad_center_y,
                x_side
            );
        }
    }
}

// Final model
union() {
    main_slab();
    underside_features();
}