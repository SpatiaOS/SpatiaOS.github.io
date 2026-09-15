// ============================================================
// Parametric reference model
// ============================================================

// ----- Base plate -----
base_len    = 0.75;      // X
base_wid    = 0.375;     // Y
base_h      = 0.0375;    // Z
base_top    = base_h;

// ----- Raised upper wall material -----
upper_len   = 0.75;
upper_wid   = 0.375;
upper_top   = 0.1312;              // height above datum
upper_h     = upper_top - base_top; // 0.0937
upper_ext   = 0.0937;               // extrusion depth

// ----- Left-end narrower solid -----
pad_len     = 0.0319;    // X footprint
pad_wid     = 0.3094;    // Y footprint
pad_xmin    = 0;         // left edge offset
pad_xmax    = 0.7181;    // right edge offset (reference)
pad_ymin    = 0.0281;    // front offset
pad_ymax    = 0.0375;    // back offset
pad_top     = 0.0937;
pad_h       = 0.05625;
pad_ext     = 0.0562;

// ----- Annular posts -----
post_cy     = 0.1875;    // front offset (center across width)
post_zmin   = base_top;        // 0.0375
post_zmax   = 0.1312;          // 0.1312
post_h      = post_zmax - post_zmin;  // 0.0937
post_ext    = 0.0937;
post_x      = [0.15, 0.3, 0.45, 0.6];
post_r_out  = [0.0469, 0.0469, 0.0562, 0.0562];
post_r_in   = [0.0188, 0.0197, 0.0216, 0.0234];

$fn = 100;

// ------------------------------------------------------------
// Base plate
// ------------------------------------------------------------
module base_plate() {
    translate([0, 0, 0])
        cube([base_len, base_wid, base_h]);
}

// ------------------------------------------------------------
// Raised outer wall block (channel interior left open)
// Modeled as four walls so the interior cavity stays hollow.
// ------------------------------------------------------------
wall_t = 0.05;   // wall thickness of the surrounding raised material

module raised_walls() {
    // left wall
    cube([wall_t, upper_wid, upper_h]);
    // right wall
    translate([upper_len - wall_t, 0, 0])
        cube([wall_t, upper_wid, upper_h]);
    // front wall
    cube([upper_len, wall_t, upper_h]);
    // back wall
    translate([0, upper_wid - wall_t, 0])
        cube([upper_len, wall_t, upper_h]);
}

// ------------------------------------------------------------
// Left-end narrower solid
// ------------------------------------------------------------
module left_solid() {
    translate([pad_xmin, pad_ymin, base_top])
        cube([pad_len, pad_wid, pad_ext]);
}

// ------------------------------------------------------------
// Single annular post
// ------------------------------------------------------------
module annular_post(px, r_out, r_in) {
    difference() {
        translate([px, post_cy, post_zmin])
            cylinder(h = post_ext, r = r_out);
        translate([px, post_cy, post_zmin - 0.001])
            cylinder(h = post_ext + 0.002, r = r_in);
    }
}

// ------------------------------------------------------------
// Assembly
// ------------------------------------------------------------
union() {
    base_plate();

    // raised wall material sitting on top of base
    translate([0, 0, base_top])
        raised_walls();

    // left-end narrower solid
    left_solid();

    // four separate annular posts
    for (i = [0 : 3])
        annular_post(post_x[i], post_r_out[i], post_r_in[i]);
}