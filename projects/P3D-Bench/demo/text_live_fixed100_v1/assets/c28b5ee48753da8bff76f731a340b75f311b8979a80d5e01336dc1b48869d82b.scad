// ============================================================
// Channel housing with annular posts
// All dimensions per source drawing (inch-based values)
// ============================================================

// ---- Base plate ----
base_len = 0.75;      // overall length (X)
base_wid = 0.375;     // overall width  (Y)
base_h   = 0.0375;    // base thickness (Z), extrusion depth 0.0375

// ---- Raised perimeter wall material ----
wall_top_z   = 0.1312;              // absolute top of raised walls
wall_h       = wall_top_z - base_h; // extrusion depth = 0.0937
front_wall_t = 0.0281;              // front wall thickness
back_wall_t  = 0.0375;              // back wall thickness
right_wall_x = 0.7181;              // inner face of right end wall

// ---- Left end block (lower than walls) ----
blk_w     = 0.0319;                 // length along X (left offset 0)
blk_front = 0.0281;                 // front offset
blk_depth = 0.3094;                 // width along Y (back offset 0.0375)
blk_top_z = 0.0937;                 // absolute top of block
blk_h     = blk_top_z - base_h;     // extrusion depth = 0.0562

// ---- Annular posts ----
post_y  = 0.1875;                            // centered across width
post_x  = [0.15, 0.30, 0.45, 0.60];          // axis left offsets
post_ro = [0.0469, 0.0469, 0.0562, 0.0562];  // outer radii
post_ri = [0.0188, 0.0197, 0.0216, 0.0234];  // through-hole radii
post_z0 = 0.0375;                            // posts start on base top
post_z1 = 0.1312;                            // extrusion depth 0.0937

eps = 0.001;  // small overlap for clean booleans
$fn = 100;    // smooth cylindrical surfaces

// ---- Base plate ----
module base_plate() {
    cube([base_len, base_wid, base_h]);
}

// ---- Raised wall frame with open channel interior ----
// Front/back walls run full length; right end wall closes the
// channel; left end stays open (filled lower by left_block).
module raised_walls() {
    difference() {
        translate([0, 0, base_h])
            cube([base_len, base_wid, wall_h]);
        // Longitudinal open channel between the wall material
        translate([-eps, front_wall_t, base_h - eps])
            cube([right_wall_x + eps,
                  base_wid - front_wall_t - back_wall_t,
                  wall_h + 2*eps]);
    }
}

// ---- Narrower solid at the left end of the channel ----
module left_block() {
    translate([0, blk_front, base_h])
        cube([blk_w, blk_depth, blk_h]);
}

// ---- Single annular post (hollow cylinder, through bore) ----
module annular_post(ro, ri) {
    difference() {
        cylinder(h = post_z1 - post_z0, r = ro);
        translate([0, 0, -eps])
            cylinder(h = post_z1 - post_z0 + 2*eps, r = ri);
    }
}

// ---- Final assembly ----
union() {
    base_plate();
    raised_walls();
    left_block();
    // Four separate posts, no connecting plate between them
    for (i = [0 : len(post_x) - 1])
        translate([post_x[i], post_y, post_z0])
            annular_post(post_ro[i], post_ri[i]);
}