// ==============================================================
// Stepped-Cavity Block with Side Boss
// A rectangular body with a nested, top-open stepped pocket,
// an offset deep well, a side projection, and a side recess.
// ==============================================================

// ---------------- Parameters (mm) ----------------

// Main body
body_w = 80;                 // width  (X)
body_d = 60;                 // depth  (Y)
body_h = 30;                 // height (Z)

// Upper (broad) recess — leaves a thin rim around the opening
rim_w       = 4;             // thin rim width
step1_depth = 5;             // depth of broad recess below top face

// Second recess — smaller inset rectangle, deeper
step2_inset = 8;             // additional inset per side vs. upper recess
step2_depth = 12;            // depth below top face

// Deepest pocket — shifted toward +X for uneven ledges
pocket_w     = 26;           // pocket width  (X)
pocket_d     = 18;           // pocket depth  (Y)
pocket_depth = 25;           // depth below top (leaves a solid bottom)
pocket_dx    = 14;           // offset of pocket center toward +X

// Side projection (boss) on the +Y face
boss_w = 30;                 // boss width along X
boss_h = 10;                 // boss height along Z
boss_t = 8;                  // boss projection thickness along Y
boss_z = 4;                  // boss bottom height above base

// Side recess cut into the +Y face, above the boss
srec_w   = 22;               // recess width along X
srec_h   = 6;                // recess height along Z
srec_d   = 4;                // recess cut depth into the face
srec_gap = 2;                // vertical gap between boss top and recess

eps = 0.1;                   // overlap epsilon for clean boolean cuts
$fn = 60;                    // curve resolution (no curves here, set anyway)

// ---------------- Helper modules ----------------

// Rectangular cut opening at the top face, descending `depth`
module top_cut(w, d, depth, dx = 0, dy = 0) {
    translate([dx, dy, body_h/2 - depth/2 + eps/2])
        cube([w, d, depth + eps], center = true);
}

// Added rectangular projection on the +Y side face
module side_boss() {
    translate([-boss_w/2, body_d/2, -body_h/2 + boss_z])
        cube([boss_w, boss_t, boss_h]);
}

// Recess cut into the +Y side face, stepped above the boss
module side_recess_cut() {
    z0 = -body_h/2 + boss_z + boss_h + srec_gap;   // above boss + gap
    translate([-srec_w/2, body_d/2 - srec_d, z0])
        cube([srec_w, srec_d + eps, srec_h]);
}

// ---------------- Main model ----------------
difference() {
    // 1) Added material: main body plus the single side projection
    union() {
        cube([body_w, body_d, body_h], center = true);  // main solid
        side_boss();                                     // side boss
    }

    // 2) Broad upper recess — leaves only the thin rim at the top
    top_cut(body_w - 2*rim_w,
            body_d - 2*rim_w,
            step1_depth);

    // 3) Second, smaller inset recess — deeper tier
    top_cut(body_w - 2*(rim_w + step2_inset),
            body_d - 2*(rim_w + step2_inset),
            step2_depth);

    // 4) Deepest pocket, shifted toward +X (uneven interior ledges);
    //    pocket_depth < body_h guarantees a solid bottom
    top_cut(pocket_w, pocket_d, pocket_depth, dx = pocket_dx);

    // 5) Side recess above the boss — extra stepped depth tier
    side_recess_cut();
}