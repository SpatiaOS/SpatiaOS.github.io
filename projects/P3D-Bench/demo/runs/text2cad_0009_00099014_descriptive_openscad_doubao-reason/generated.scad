// ==============================================
// PARAMETERS (All dimensions in millimeters)
// ==============================================
// Main slab dimensions
slab_width = 100;       // X-axis length of main top slab
slab_depth = 80;        // Y-axis length of main top slab
slab_thickness = 5;     // Z-axis height of main top slab

// Pad positioning
pad_edge_margin = 5;    // Distance from slab edge to outer edge of shallow pads

// Upper tier (shallow) pad dimensions
shallow_pad_width = 20;   // X-axis width of shallow upper pad tier
shallow_pad_depth = 15;   // Y-axis depth of shallow upper pad tier
shallow_pad_thickness = 2;// Z-axis height of shallow upper pad tier

// Lower tier (deep) pad dimensions
deep_pad_width = 10;      // X-axis width of deep lower pad tier (must be < shallow_pad_width)
deep_pad_thickness = 8;   // Z-axis height of deep lower pad tier
deep_pad_depth = shallow_pad_depth; // Matches shallow pad depth to align front/back edges

// Global resolution setting
$fn = 64;

// ==============================================
// MODULE DEFINITIONS
// ==============================================
/**
 * Two-tier underside pad: shallow upper tier attached to slab, deeper lower tier
 * aligned to either left or right edge of the shallow tier, matching front/back edges
 * @param align_deep_left: If true, deep pad aligns to left edge of shallow pad, else right edge
 * Origin is at top center of the shallow pad (attachment point to slab underside)
 */
module two_tier_pad(align_deep_left = true) {
    // Upper shallow pad tier (attaches directly to slab underside)
    translate([0, 0, -shallow_pad_thickness/2])
    cube([shallow_pad_width, shallow_pad_depth, shallow_pad_thickness], center=true);

    // Calculate X offset for deep pad alignment
    deep_pad_x_offset = align_deep_left ? 
        (-shallow_pad_width/2 + deep_pad_width/2) :  // Align left edge
        (shallow_pad_width/2 - deep_pad_width/2);    // Align right edge

    // Lower deep pad tier (attached to bottom of shallow pad)
    translate([deep_pad_x_offset, 0, -(shallow_pad_thickness + deep_pad_thickness/2)])
    cube([deep_pad_width, deep_pad_depth, deep_pad_thickness], center=true);
}

// ==============================================
// MAIN MODEL ASSEMBLY
// ==============================================
union() {
    // Main top slab (centered on X/Y axis, bottom surface at Z=0)
    translate([-slab_width/2, -slab_depth/2, 0])
    cube([slab_width, slab_depth, slab_thickness]);

    // --------------------------
    // Four underside two-tier pads
    // --------------------------
    // Front left pad (deep pad aligned left)
    translate([
        -slab_width/2 + pad_edge_margin + shallow_pad_width/2,
        -slab_depth/2 + pad_edge_margin + shallow_pad_depth/2,
        0
    ])
    two_tier_pad(align_deep_left=true);

    // Front right pad (deep pad aligned right)
    translate([
        slab_width/2 - pad_edge_margin - shallow_pad_width/2,
        -slab_depth/2 + pad_edge_margin + shallow_pad_depth/2,
        0
    ])
    two_tier_pad(align_deep_left=false);

    // Back left pad (deep pad aligned left)
    translate([
        -slab_width/2 + pad_edge_margin + shallow_pad_width/2,
        slab_depth/2 - pad_edge_margin - shallow_pad_depth/2,
        0
    ])
    two_tier_pad(align_deep_left=true);

    // Back right pad (deep pad aligned right)
    translate([
        slab_width/2 - pad_edge_margin - shallow_pad_width/2,
        slab_depth/2 - pad_edge_margin - shallow_pad_depth/2,
        0
    ])
    two_tier_pad(align_deep_left=false);
}