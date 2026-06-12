// Parametric Rectangular Slab with Two-Tier Underside Pads
// All dimensions in millimeters

// --- Slab dimensions ---
slab_length = 100;   // X-axis (left-right)
slab_width  = 60;    // Y-axis (front-back)
slab_thickness = 5;  // Z-axis height of the main slab

// --- Pad parameters ---
pad_width  = 20;     // width of the shallow pad (X)
pad_depth  = 10;     // depth of the pad (Y)
pad_height = 2;      // height of the shallow pad (Z)

deep_width  = 10;    // width of the deeper continuation (X, narrower)
deep_height = 8;     // height of the deeper continuation (Z, below shallow pad)

pad_inset = 5;       // distance from slab edges to pad edges

// --- Pad module ---
// Creates a two-tier protrusion with top at z=0, extending downward.
// align_left = true  -> deep part flush with left edge of shallow pad
// align_left = false -> deep part flush with right edge
module two_tier_pad(align_left = true) {
    // Shallow wide pad: top at z=0, bottom at z=-pad_height
    translate([0, 0, -pad_height])
        cube([pad_width, pad_depth, pad_height]);

    // Deeper narrow continuation: top at z=-pad_height, bottom at z=-(pad_height+deep_height)
    x_offset = align_left ? 0 : pad_width - deep_width;
    translate([x_offset, 0, -pad_height - deep_height])
        cube([deep_width, pad_depth, deep_height]);
}

// --- Main model ---
union() {
    // Central slab centered on X and Y, top at z=0, bottom at z=-slab_thickness
    translate([-slab_length/2, -slab_width/2, -slab_thickness])
        cube([slab_length, slab_width, slab_thickness]);

    // Front-left pad (left side, deep part aligned left)
    translate([
        -slab_length/2 + pad_inset + pad_width/2,
        -slab_width/2 + pad_inset + pad_depth/2,
        -slab_thickness
    ])
        two_tier_pad(align_left = true);

    // Back-left pad
    translate([
        -slab_length/2 + pad_inset + pad_width/2,
        slab_width/2 - pad_inset - pad_depth/2,
        -slab_thickness
    ])
        two_tier_pad(align_left = true);

    // Front-right pad (right side, deep part aligned right)
    translate([
        slab_length/2 - pad_inset - pad_width/2,
        -slab_width/2 + pad_inset + pad_depth/2,
        -slab_thickness
    ])
        two_tier_pad(align_left = false);

    // Back-right pad
    translate([
        slab_length/2 - pad_inset - pad_width/2,
        slab_width/2 - pad_inset - pad_depth/2,
        -slab_thickness
    ])
        two_tier_pad(align_left = false);
}