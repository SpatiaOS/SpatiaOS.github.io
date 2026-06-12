// Parameters
slab_width = 120;       // Overall width of the main rectangular slab
slab_depth = 80;        // Overall depth of the main rectangular slab
slab_thickness = 5;     // Thickness of the main rectangular slab

pad_width = 20;         // Width of the shallow underside pad (Tier 1)
pad_depth = 15;         // Depth of the shallow underside pad (Tier 1)
pad_thickness = 4;      // Thickness (downward extrusion) of the shallow pad

leg_width = 8;          // Width of the deeper continuation (Tier 2)
leg_thickness = 10;     // Additional thickness (downward extrusion) of the deeper continuation

pad_offset_x = 8;       // Distance from the left/right edge of the slab to the pad
pad_offset_y = 8;       // Distance from the front/back edge of the slab to the pad

eps = 0.01;             // Small overlap value to ensure valid manifold geometry
$fn = 100;              // Resolution for any future curved additions

// Reusable module for the two-tier underside protrusion
module underside_feature(is_left) {
    union() {
        // Tier 1: Shallow underside pad
        // Positioned below the slab, slightly overlapping upwards for manifoldness
        translate([0, 0, -pad_thickness/2 + eps/2])
            cube([pad_width, pad_depth, pad_thickness + eps], center=true);

        // Tier 2: Deeper continuation (leg)
        // Aligned to share the front and back edges (same depth) and either the left or right edge
        leg_x_offset = is_left ? -(pad_width - leg_width)/2 : (pad_width - leg_width)/2;
        
        // Positioned below the pad, slightly overlapping upwards
        translate([leg_x_offset, 0, -pad_thickness - leg_thickness/2 + eps/2])
            cube([leg_width, pad_depth, leg_thickness + eps], center=true);
    }
}

// Main model construction
union() {
    // Main rectangular slab
    // Base is at z=0, grows upwards to z=slab_thickness
    translate([0, 0, slab_thickness/2])
        cube([slab_width, slab_depth, slab_thickness], center=true);

    // Generate the four underside features
    for (x_sign = [-1, 1]) {
        for (y_sign = [-1, 1]) {
            // Calculate absolute positions relative to the center
            x_pos = x_sign * (slab_width/2 - pad_offset_x - pad_width/2);
            y_pos = y_sign * (slab_depth/2 - pad_offset_y - pad_depth/2);
            
            // Determine if the pad is on the left side to align the leg correctly
            is_left = (x_sign == -1);

            // Place the dual-tier pad at the correct corner
            translate([x_pos, y_pos, 0])
                underside_feature(is_left);
        }
    }
}