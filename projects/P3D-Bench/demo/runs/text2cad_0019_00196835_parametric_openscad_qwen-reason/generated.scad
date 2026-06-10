$fn = 100;

// === Parametric Dimensions (mm) ===
rail_len = 0.748506;
rail_wid = 0.024642;
rail_h   = 0.018482;
layer_thick = 0.00462;

hole_r = 0.0043;
hole_y_off = 0.0108;
hole_x1 = 0.0138;
hole_x2 = 0.7346;
z_hole_start = 0.0062;
z_hole_h = 0.0123;

block_w = 0.030803;
block_x = 0.7192;
block_y = 0;
block_hole_x = 0.7361;
block_hole_y = 0.0192;

cutout_w = 0.027722;
cutout_x = block_x;
cutout_y = block_y;
cutout_z_bot = -0.0585;
cutout_z_top = 0.0185;
cutout_h = cutout_z_top - cutout_z_bot;

// === Reusable Modules ===
module blind_recess(x, y, z_start, height, radius) {
    translate([x, y, z_start])
        cylinder(h = height, r = radius);
}

module layered_base(w, d, base_h, top_h) {
    cube([w, d, base_h]);
    translate([0, 0, base_h])
        cube([w, d, top_h]);
}

// === Main Assembly ===
difference() {
    // Positive solid volumes
    union() {
        // Rail lower body and shallow top layer
        layered_base(rail_len, rail_wid, rail_h, layer_thick);

        // End block lower body and shallow top layer
        translate([block_x, block_y, 0])
            layered_base(block_w, block_w, rail_h, layer_thick);
    }

    // Subtractive features
    // Rail circular recesses
    blind_recess(hole_x1, hole_y_off, z_hole_start, z_hole_h, hole_r);
    blind_recess(hole_x2, hole_y_off, z_hole_start, z_hole_h, hole_r);

    // End block circular recess
    blind_recess(block_hole_x, block_hole_y, z_hole_start, z_hole_h, hole_r);

    // End block deep rectangular cutout
    translate([cutout_x, cutout_y, cutout_z_bot])
        cube([cutout_w, cutout_w, cutout_h]);
}