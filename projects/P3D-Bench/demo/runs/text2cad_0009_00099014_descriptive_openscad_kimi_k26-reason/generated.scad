// Main slab dimensions
slab_width = 80;
slab_depth = 60;
slab_height = 5;

// Shallow pad dimensions
pad_width = 15;
pad_depth = 12;
pad_height = 2;

// Deeper continuation dimensions
deep_width = 8;
deep_height = 4;  // additional depth below the shallow pad

// Positioning insets from slab edges
pad_inset_x = 5;
pad_inset_y = 5;

// Resolution
$fn = 50;

// Main rectangular slab, bottom at z = 0
module main_slab() {
    cube([slab_width, slab_depth, slab_height]);
}

// Two-tier underside protrusion
// px, py: lower-left corner of the shallow pad footprint
// align_right: if true, deep block aligns to pad's right edge; else left
module two_tier_pad(px, py, align_right) {
    // Shallow pad attached to slab underside
    translate([px, py, -pad_height])
        cube([pad_width, pad_depth, pad_height]);

    // Deeper continuation, narrower, sharing front/back edges
    dx = align_right ? px + pad_width - deep_width : px;
    translate([dx, py, -(pad_height + deep_height)])
        cube([deep_width, pad_depth, deep_height]);
}

// Build model
union() {
    main_slab();

    // Front-left pad, deep aligned to left edge
    two_tier_pad(pad_inset_x, pad_inset_y, false);

    // Front-right pad, deep aligned to right edge
    two_tier_pad(slab_width - pad_inset_x - pad_width, pad_inset_y, true);

    // Back-left pad, deep aligned to left edge
    two_tier_pad(pad_inset_x, slab_depth - pad_inset_y - pad_depth, false);

    // Back-right pad, deep aligned to right edge
    two_tier_pad(slab_width - pad_inset_x - pad_width, slab_depth - pad_inset_y - pad_depth, true);
}