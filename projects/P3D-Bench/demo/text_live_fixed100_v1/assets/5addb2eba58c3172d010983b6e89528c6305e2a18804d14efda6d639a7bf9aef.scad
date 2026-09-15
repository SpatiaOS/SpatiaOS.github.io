// Parameters
$fn = 100;

// Base
base_length   = 0.75;    // overall length (X)
base_width    = 0.375;   // overall width (Y)
base_height   = 0.0375;  // base thickness (Z)
base_extrude  = 0.0375;  // main extrusion depth

// Left-end raised block
blk_len      = 0.0319;   // X footprint
blk_wid      = 0.3094;   // Y footprint
blk_left     = 0;        // left edge offset
blk_front    = 0.0281;   // front edge offset
blk_z_start  = 0.0375;   // sits on top of base
blk_z_top    = 0.0937;   // top height from base datum
blk_height   = 0.05625;  // vertical height
blk_extrude  = 0.0562;   // extrusion depth

// Annular posts (X centers, outer radii, inner hole radii)
post_ys      = 0.1875;   // centered across width
post_z_start = 0.0375;   // on upper face of base
post_z_top   = 0.1312;   // top height from base datum
post_height  = 0.0937;   // extrusion depth
post_x       = [0.15, 0.30, 0.45, 0.60];
post_r_out   = [0.0469, 0.0469, 0.0562, 0.0562];
post_r_in    = [0.0188, 0.0197, 0.0216, 0.0234];

// Base: rectangular slab
module base() {
    linear_extrude(height = base_extrude)
        square([base_length, base_width]);
}

// Left-end raised solid on top of base
module left_block() {
    translate([blk_left, blk_front, blk_z_start])
        linear_extrude(height = blk_extrude)
            square([blk_len, blk_wid]);
}

// Single annular post: outer cylinder with through central opening
module annular_post(x, r_out, r_in) {
    translate([x, post_ys, post_z_start])
        difference() {
            cylinder(h = post_height, r = r_out);
            translate([0, 0, -0.01])
                cylinder(h = post_height + 0.02, r = r_in);
        }
}

// Assemble model
union() {
    base();
    left_block();
    for (i = [0 : len(post_x) - 1])
        annular_post(post_x[i], post_r_out[i], post_r_in[i]);
}