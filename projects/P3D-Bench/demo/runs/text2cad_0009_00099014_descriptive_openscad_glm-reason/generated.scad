// === Slab with Two-Tier Underside Protrusions ===

// Main slab dimensions
slab_length = 80;    // x-axis extent
slab_width  = 50;    // y-axis extent
slab_thick  = 4;     // z-axis thickness

// Shallow pad dimensions (first tier)
pad_length = 16;    // x-axis
pad_width  = 12;    // y-axis
pad_height = 1.5;   // z-axis (shallow)

// Deep foot dimensions (second tier, narrower in x)
foot_length = 8;    // x-axis (narrower than pad, shares front/back and one side edge)
foot_height = 3;    // z-axis (deeper than pad)

// Margin from slab edges to pad edges
margin_x = 4;
margin_y = 4;

$fn = 100;

// --- Main Model ---
union() {
    // Top slab
    translate([0, 0, slab_thick / 2])
        cube([slab_length, slab_width, slab_thick], center = true);

    // Four corner pad+foot assemblies
    // Front-left: foot shares left edge of pad
    pad_and_foot(
        cx = -slab_length/2 + margin_x + pad_length/2,
        cy = -slab_width/2 + margin_y + pad_width/2,
        align_left = true
    );

    // Front-right: foot shares right edge of pad
    pad_and_foot(
        cx = slab_length/2 - margin_x - pad_length/2,
        cy = -slab_width/2 + margin_y + pad_width/2,
        align_left = false
    );

    // Back-left: foot shares left edge of pad
    pad_and_foot(
        cx = -slab_length/2 + margin_x + pad_length/2,
        cy = slab_width/2 - margin_y - pad_width/2,
        align_left = true
    );

    // Back-right: foot shares right edge of pad
    pad_and_foot(
        cx = slab_length/2 - margin_x - pad_length/2,
        cy = slab_width/2 - margin_y - pad_width/2,
        align_left = false
    );
}

// --- Module: shallow pad + deep foot ---
// cx, cy: center position of the pad on the x-y plane
// align_left: if true foot aligns to left edge; if false foot aligns to right edge
module pad_and_foot(cx, cy, align_left) {
    // Shallow pad (first tier)
    translate([cx, cy, -pad_height / 2])
        cube([pad_length, pad_width, pad_height], center = true);

    // Deep foot (second tier)
    // Shares front and back (y) edges with pad; shares left or right (x) edge
    foot_cx = align_left
        ? cx - pad_length/2 + foot_length/2    // left-aligned
        : cx + pad_length/2 - foot_length/2;   // right-aligned

    translate([foot_cx, cy, -pad_height - foot_height / 2])
        cube([foot_length, pad_width, foot_height], center = true);
}