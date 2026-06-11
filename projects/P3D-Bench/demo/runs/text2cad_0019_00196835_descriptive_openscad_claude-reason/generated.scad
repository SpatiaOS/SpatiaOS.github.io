// === Parametric Long Rail with End Block ===

// --- Main Rail Parameters ---
rail_length       = 200;    // full length of the slim rail
rail_width        = 12;     // narrow width of the rail
rail_base_height  = 4;      // lower body height
rail_top_height   = 1.5;    // shallow top layer height
rail_total_height = rail_base_height + rail_top_height;

// --- Top Layer Inset (slightly narrower or same width) ---
top_layer_inset   = 0;      // 0 = same width as base

// --- Circular Recess Features Near Rail Ends ---
recess_diameter     = 5;
recess_depth        = 1.2;  // shallow recess into top layer
recess_end_offset   = 10;   // distance from each rail end to recess center
recess_count_per_end = 2;   // number of recesses per end
recess_spacing      = 14;   // spacing between multiple recesses along length

// --- End Block Parameters ---
block_length       = 35;    // how far the block extends beyond rail end
block_width        = 30;    // wider than the rail
block_base_height  = rail_base_height;
block_top_height   = rail_top_height;
block_total_height = block_base_height + block_top_height;

// --- End Block Removed Features ---
// Shallow circular recesses on top of end block
block_recess_diameter = 7;
block_recess_depth    = 1.2;
block_recess_x_off    = 12;   // offset from block center along X
block_recess_y_off    = 0;    // centered on block

// Deep cutout through end block (stepped: goes through top layer + into/through base)
deep_cutout_length    = 14;
deep_cutout_width     = 10;
deep_cutout_depth     = rail_total_height + 1; // fully through

// Shallow step cutout (partial depth pocket above the deep cutout area)
step_cutout_length    = 20;
step_cutout_width     = 16;
step_cutout_depth     = rail_top_height + 1.5; // through top layer + shallow into base

// --- Resolution ---
$fn = 80;

// =============================================
// Module: Main slim rail with shallow top layer
// =============================================
module rail_body() {
    // Lower base rail
    cube([rail_length, rail_width, rail_base_height]);
    // Shallow top layer (full length)
    translate([0, top_layer_inset / 2, rail_base_height])
        cube([rail_length, rail_width - top_layer_inset, rail_top_height]);
}

// =============================================
// Module: Circular recess (cylinder for subtraction)
// =============================================
module circular_recess(d, depth) {
    translate([0, 0, -depth])
        cylinder(d = d, h = depth + 0.01);
}

// =============================================
// Module: Rail-end recesses near one end
// =============================================
module end_recesses(start_x) {
    for (i = [0 : recess_count_per_end - 1]) {
        translate([start_x + i * recess_spacing, rail_width / 2, rail_total_height])
            circular_recess(recess_diameter, recess_depth);
    }
}

// =============================================
// Module: End block extension (wider block at one end)
// =============================================
module end_block_body() {
    // Positioned so it extends beyond rail at x=0, centered on rail's Y center
    translate([-block_length, -(block_width - rail_width) / 2, 0]) {
        // Lower base
        cube([block_length, block_width, block_base_height]);
        // Shallow top layer
        translate([0, 0, block_base_height])
            cube([block_length, block_width, block_top_height]);
    }
}

// =============================================
// Module: End block removed features
// =============================================
module end_block_recesses() {
    block_center_x = -block_length / 2;
    block_center_y = rail_width / 2;

    // Pair of shallow circular recesses on top surface
    for (dx = [-1, 1]) {
        translate([block_center_x + dx * block_recess_x_off,
                   block_center_y + block_recess_y_off,
                   block_total_height])
            circular_recess(block_recess_diameter, block_recess_depth);
    }

    // Shallow stepped pocket (intermediate depth)
    translate([block_center_x - step_cutout_length / 2,
               block_center_y - step_cutout_width / 2,
               block_total_height - step_cutout_depth])
        cube([step_cutout_length, step_cutout_width, step_cutout_depth + 0.01]);

    // Deep cutout (goes fully through the block)
    translate([block_center_x - deep_cutout_length / 2,
               block_center_y - deep_cutout_width / 2,
               -0.01])
        cube([deep_cutout_length, deep_cutout_width, deep_cutout_depth]);
}

// =============================================
// Final Assembly
// =============================================
difference() {
    union() {
        // Main long rail
        rail_body();
        // Wider end block at x=0 side (extends into negative X)
        end_block_body();
    }

    // Recesses near the far end of rail (x = rail_length side)
    end_recesses(rail_length - recess_end_offset - (recess_count_per_end - 1) * recess_spacing);

    // Recesses near the block end of rail (x ≈ 0 side)
    end_recesses(recess_end_offset);

    // End block circular recesses and deep/stepped cutouts
    end_block_recesses();
}