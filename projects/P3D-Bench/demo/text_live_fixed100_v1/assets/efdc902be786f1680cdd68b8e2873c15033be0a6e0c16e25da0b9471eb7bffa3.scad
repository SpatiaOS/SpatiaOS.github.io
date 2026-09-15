// =====================================================================
//  Stepped-cavity enclosure block
//  - Rectangular solid opened from the top into nested stepped pockets
//  - Deepest pocket offset to one side (uneven interior ledges)
//  - One rectangular boss on a side face, with a side recess above it
// =====================================================================

$fn = 64;
eps = 0.01;                       // overlap to keep cuts clean

// ---------------- Main body ----------------
body_w  = 100;                    // X size
body_d  = 70;                     // Y size
body_h  = 40;                     // Z size

// ---------------- Tier 1 : broad upper recess (inside thin rim) ------
rim_w    = 5;                     // thin rim left around the top opening
t1_inset = rim_w;                 // inset from every outer face
t1_depth = 6;                     // depth measured from the top face

// ---------------- Tier 2 : mid pocket --------------------------------
t2_inset = t1_inset + 7;          // additional step ledge
t2_depth = 14;                    // depth from the top face

// ---------------- Tier 3 : deepest pocket (shifted sideways) ---------
t3_inset   = t2_inset + 6;        // nominal inset before shifting
t3_shift_x = 9;                   // offset toward +X  -> uneven ledges
t3_shift_y = 4;                   // offset toward +Y
t3_depth   = 30;                  // depth from the top face
floor_t    = body_h - t3_depth;   // remaining solid bottom (10 mm)

// ---------------- Side boss (added material) -------------------------
boss_w = 12;                      // projection out of the +X face
boss_d = 30;                      // length along Y
boss_h = 18;                      // height, starting at the bottom
boss_y = (body_d - boss_d) / 2;   // centred on the side face

// ---------------- Side recess above the boss -------------------------
sr_depth = 10;                    // depth from the top face
sr_w     = 8;                     // cut into the wall from the +X face
sr_d     = boss_d;                // same footprint width as the boss

// =====================================================================
//  Modules
// =====================================================================

// Solid outer block
module main_block() {
    cube([body_w, body_d, body_h]);
}

// Generic top pocket: inset from -X/-Y corner, given size and depth
module top_pocket(x0, y0, sx, sy, depth) {
    translate([x0, y0, body_h - depth])
        cube([sx, sy, depth + eps]);
}

// The three nested pockets forming the stepped cavity
module stepped_cavity() {
    // Tier 1 : broad upper recess bounded by the thin rim
    top_pocket(t1_inset, t1_inset,
               body_w - 2*t1_inset, body_d - 2*t1_inset,
               t1_depth);

    // Tier 2 : smaller inset rectangular pocket
    top_pocket(t2_inset, t2_inset,
               body_w - 2*t2_inset, body_d - 2*t2_inset,
               t2_depth);

    // Tier 3 : deepest pocket, shifted to one side (asymmetric ledges)
    top_pocket(t3_inset + t3_shift_x, t3_inset + t3_shift_y,
               body_w - 2*t3_inset, body_d - 2*t3_inset,
               t3_depth);
}

// Rectangular recess cut into the +X side wall, above the boss
module side_recess() {
    translate([body_w - sr_w, boss_y, body_h - sr_depth])
        cube([sr_w + eps, sr_d, sr_depth + eps]);
}

// Rectangular projection on the +X side face
module side_boss() {
    translate([body_w, boss_y, 0])
        cube([boss_w, boss_d, boss_h]);
}

// =====================================================================
//  Assembly : solid body + boss, minus all cavities
// =====================================================================
module stepped_enclosure() {
    difference() {
        union() {
            main_block();         // base solid
            side_boss();          // added side projection
        }
        stepped_cavity();         // nested top pockets (solid bottom kept)
        side_recess();            // extra stepped tier on the side wall
    }
}

stepped_enclosure();