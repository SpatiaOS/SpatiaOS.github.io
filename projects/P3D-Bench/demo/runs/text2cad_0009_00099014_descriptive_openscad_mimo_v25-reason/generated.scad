// Parameters
slab_length = 100;
slab_width = 80;
slab_thickness = 10;

pad_width = 30;
pad_depth = 20;
pad_thickness = 5;
pad_inset = 10; // Distance from slab edge to pad edge

deeper_width = 15;
deeper_thickness = 8;

$fn = 100;

// Main slab
cube([slab_length, slab_width, slab_thickness]);

// Shallow pads near corners
for (x = [pad_inset, slab_length - pad_inset - pad_width]) {
    for (y = [pad_inset, slab_width - pad_inset - pad_depth]) {
        // Shallow pad
        translate([x, y, -pad_thickness])
            cube([pad_width, pad_depth, pad_thickness]);
        
        // Deeper continuation (aligned to left edge of pad for left pads, right edge for right pads)
        if (x == pad_inset) {
            // Left pads: deeper part on left edge
            translate([x, y, -pad_thickness - deeper_thickness])
                cube([deeper_width, pad_depth, deeper_thickness]);
        } else {
            // Right pads: deeper part on right edge
            translate([x + pad_width - deeper_width, y, -pad_thickness - deeper_thickness])
                cube([deeper_width, pad_depth, deeper_thickness]);
        }
    }
}