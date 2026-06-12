// === Parameters ===

// Main slab dimensions
slab_width  = 120;   // X dimension of slab
slab_depth  = 80;    // Y dimension of slab
slab_height = 6;     // Z thickness of slab

// Shallow underside pad dimensions
pad_width   = 24;    // X dimension of each pad
pad_depth   = 16;    // Y dimension of each pad
pad_height  = 3;     // Z depth (shallow tier)

// Deep continuation dimensions (narrower, taller)
cont_width  = 14;    // X dimension (must be <= pad_width)
cont_height = 8;     // Z depth below the pad (deep tier)

// Pad inset from slab perimeter edges
inset_x = 8;         // distance from slab left/right edges to pad
inset_y = 8;         // distance from slab front/back edges to pad

// Resolution
$fn = 32;

// === Derived positions ===
// Stack order (bottom to top): deep cont -> shallow pad -> slab
// Z origins for each layer
z_cont = 0;
z_pad  = cont_height;
z_slab = cont_height + pad_height;

// Pad X positions (left pair and right pair)
pad_x_left  = inset_x;
pad_x_right = slab_width - inset_x - pad_width;

// Pad Y positions (front pair and back pair)
pad_y_front = inset_y;
pad_y_back  = slab_depth - inset_y - pad_depth;

// === Modules ===

// Two-tier underside protrusion
// align_right: if true, deep part shares right edge with pad;
//              if false, deep part shares left edge with pad.
module underside_protrusion(align_right = false) {
    // Shallow pad (upper tier, directly under slab)
    translate([0, 0, z_pad])
        cube([pad_width, pad_depth, pad_height]);

    // Deep continuation (lower tier)
    // Shares front & back edges (same Y, same pad_depth)
    // Shares left or right X edge depending on align_right
    cont_x_offset = align_right ? (pad_width - cont_width) : 0;
    translate([cont_x_offset, 0, z_cont])
        cube([cont_width, pad_depth, cont_height]);
}

// === Main Assembly ===
union() {
    // Main rectangular slab (top layer)
    translate([0, 0, z_slab])
        cube([slab_width, slab_depth, slab_height]);

    // Front-left pad: deep part aligned to LEFT (outward edge)
    translate([pad_x_left, pad_y_front, 0])
        underside_protrusion(align_right = false);

    // Front-right pad: deep part aligned to RIGHT (outward edge)
    translate([pad_x_right, pad_y_front, 0])
        underside_protrusion(align_right = true);

    // Back-left pad: deep part aligned to LEFT (outward edge)
    translate([pad_x_left, pad_y_back, 0])
        underside_protrusion(align_right = false);

    // Back-right pad: deep part aligned to RIGHT (outward edge)
    translate([pad_x_right, pad_y_back, 0])
        underside_protrusion(align_right = true);
}