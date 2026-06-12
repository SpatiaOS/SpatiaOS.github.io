// Parameters (all dimensions in mm)
slab_width = 120;
slab_depth = 80;
slab_height = 15;

pad_width = 30;
pad_depth = 20;
pad_height = 5;

cont_width = 14;
cont_height = 8;

edge_margin = 12;
align_left = true;

$fn = 64;

// Derived reference for slab bottom face
z_slab_bottom = -slab_height / 2;

// Main Assembly
union() {
    // Centered main rectangular slab
    cube([slab_width, slab_depth, slab_height], center=true);

    // Instantiate four corner underside features
    underside_feature( 1,  1);
    underside_feature(-1,  1);
    underside_feature( 1, -1);
    underside_feature(-1, -1);
}

// Module: Two-tier underside protrusion
module underside_feature(sx, sy) {
    // Calculate pad center coordinates relative to slab edges
    px = sx * (slab_width / 2 - edge_margin - pad_width / 2);
    py = sy * (slab_depth / 2 - edge_margin - pad_depth / 2);

    // Calculate continuation X offset to share left or right edge with pad
    edge_shift = (pad_width - cont_width) / 2;
    cx = px + (align_left ? -edge_shift : edge_shift);

    // Shallow tier: pad attached directly to slab bottom
    translate([px, py, z_slab_bottom])
        cube([pad_width, pad_depth, pad_height]);

    // Deeper tier: continuation attached below the pad, sharing front/back edges
    translate([cx, py, z_slab_bottom - pad_height])
        cube([cont_width, pad_depth, cont_height]);
}