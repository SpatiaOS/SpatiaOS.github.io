// ============================================
// Parametric Rail with End Block
// ============================================

// --- Main Rail Dimensions ---
rail_length       = 0.748506;   // X extent
rail_width        = 0.024642;   // Y extent
rail_lower_height = 0.018482;   // Z extent of lower solid body
top_layer_thick   = 0.00462;    // Z thickness of shallow top layer

// --- Circular Recess Parameters (common) ---
recess_r       = 0.0043;        // Recess radius
recess_z_bot   = 0.0062;        // Bottom Z of recess band
recess_y_rail  = 0.0108;        // Rail recess center Y offset from front edge
recess_x1      = 0.0138;        // First rail recess X center
recess_x2      = 0.7346;        // Second rail recess X center

// --- End Block Dimensions ---
block_size     = 0.030803;      // Equal-sided XY dimension
block_x_left   = 0.7192;        // Left edge X position
block_y_front  = -0.0361;       // Front edge Y position (in front of rail)

// --- End Block Circular Recess ---
blk_recess_x   = 0.7361;        // X center
blk_recess_y   = -0.0192;       // Y center (in front of rail front edge)

// --- End Block Rectangular Cutout ---
cutout_size    = 0.027722;       // Equal-sided XY dimension
cutout_reach   = 0.077;          // Total Z reach from upper lower-body shoulder

// --- Resolution ---
$fn = 100;

// ============================================
// Modules
// ============================================

// Circular recess: blind hole from top of lower body down to recess_z_bot
module circ_recess(cx, cy) {
    h = rail_lower_height - recess_z_bot;
    translate([cx, cy, recess_z_bot - 0.0005])
        cylinder(r = recess_r, h = h + 0.001);
}

// ============================================
// Main Assembly
// ============================================

union() {
    // --- Lower bodies with all subtractive features ---
    difference() {
        union() {
            // Step 1: Rail lower solid body
            cube([rail_length, rail_width, rail_lower_height]);

            // Step 3: End block lower solid body
            translate([block_x_left, block_y_front, 0])
                cube([block_size, block_size, rail_lower_height]);
        }

        // Step 5: Two circular recesses in the rail
        circ_recess(recess_x1, recess_y_rail);
        circ_recess(recess_x2, recess_y_rail);

        // Step 7: Circular recess in the end block
        circ_recess(blk_recess_x, blk_recess_y);

        // Step 8: Rectangular cutout in end block
        //         shares block left edge and front edge
        //         extends from top of lower body downward by cutout_reach
        translate([block_x_left, block_y_front,
                   rail_lower_height - cutout_reach])
            cube([cutout_size, cutout_size, cutout_reach + 0.001]);
    }

    // --- Top layers (preserved, unaffected by cuts) ---

    // Step 2: Rail shallow top layer
    translate([0, 0, rail_lower_height])
        cube([rail_length, rail_width, top_layer_thick]);

    // Step 4: End block shallow top layer
    translate([block_x_left, block_y_front, rail_lower_height])
        cube([block_size, block_size, top_layer_thick]);
}