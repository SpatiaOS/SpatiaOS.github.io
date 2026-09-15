// =====================================================
//  Channel base plate with perimeter wall, end block
//  and four annular posts
// =====================================================
$fn = 100;

// ---------- Base plate ----------
base_len   = 0.75;      // X length
base_wid   = 0.375;     // Y width
base_h     = 0.0375;    // extrusion depth of base

// ---------- Raised perimeter wall (open channel) ----------
wall_top_z = 0.1312;                 // top surface from base datum
wall_h     = wall_top_z - base_h;    // 0.0937 extrusion depth
wall_thk   = 0.0281;                 // wall material thickness

// ---------- Narrow rectangular solid at left end ----------
blk_len    = 0.0319;                 // X footprint
blk_wid    = 0.3094;                 // Y footprint
blk_x      = 0.0;                    // left edge offset
blk_y      = 0.0281;                 // front edge offset
blk_top_z  = 0.0937;                 // top from base datum
blk_h      = blk_top_z - base_h;     // 0.05625 extrusion depth

// ---------- Annular posts ----------
post_y      = 0.1875;                                // common Y centre
post_x      = [0.15,   0.30,   0.45,   0.60  ];      // X centres
post_r_out  = [0.0469, 0.0469, 0.0562, 0.0562];      // outer radii
post_r_in   = [0.0188, 0.0197, 0.0216, 0.0234];      // bore radii
post_top_z  = 0.1312;                                // top from base datum
post_h      = post_top_z - base_h;                   // 0.0937 extrusion depth

holes_through_base = false;          // true = bores pierce the base plate
eps = 0.001;                         // clearance for clean booleans

// =====================================================
//  Modules
// =====================================================

// Solid rectangular base plate
module base_plate() {
    cube([base_len, base_wid, base_h]);
}

// Raised rectangular wall, flush with all four base edges,
// interior left open to form the channel
module perimeter_wall() {
    translate([0, 0, base_h])
        difference() {
            cube([base_len, base_wid, wall_h]);
            translate([wall_thk, wall_thk, -eps])
                cube([base_len - 2*wall_thk,
                      base_wid - 2*wall_thk,
                      wall_h + 2*eps]);
        }
}

// Narrow rectangular solid at the left end of the channel
module left_block() {
    translate([blk_x, blk_y, base_h])
        cube([blk_len, blk_wid, blk_h]);
}

// One annular (tubular) post
module annular_post(x, y, ro, ri) {
    translate([x, y, base_h])
        difference() {
            cylinder(h = post_h, r = ro);
            translate([0, 0, -eps])
                cylinder(h = post_h + 2*eps, r = ri);
        }
}

// All four posts, kept as separate cylinders (no connecting plate)
module posts() {
    for (i = [0 : len(post_x) - 1])
        annular_post(post_x[i], post_y, post_r_out[i], post_r_in[i]);
}

// Optional bores continued through the base plate
module base_bores() {
    if (holes_through_base)
        for (i = [0 : len(post_x) - 1])
            translate([post_x[i], post_y, -eps])
                cylinder(h = base_h + 2*eps, r = post_r_in[i]);
}

// =====================================================
//  Assembly
// =====================================================
difference() {
    union() {
        base_plate();       // step 1: rectangular base
        perimeter_wall();   // step 2: raised wall, open channel
        left_block();       // step 3: narrow end solid
        posts();            // step 4: four annular posts
    }
    base_bores();           // optional through-bores in base
}