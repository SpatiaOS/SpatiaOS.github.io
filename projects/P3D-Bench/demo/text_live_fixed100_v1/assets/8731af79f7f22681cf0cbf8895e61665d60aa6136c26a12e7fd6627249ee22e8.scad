// ============================================================
// Stepped-Pocket Open Box with Side Projection
// All dimensions in millimeters
// ============================================================

// ---------- Overall body ----------
W = 80;                 // overall width  (X)
D = 60;                 // overall depth  (Y)
H = 40;                 // overall height (Z)

// ---------- Wall / rim thicknesses ----------
rim_t  = 3;             // thin rim around the top opening
wall_t = 6;             // wall step between successive recesses

// ---------- Nested pocket depths (cut from the top) ----------
recess1_depth = 8;      // broad upper recess
recess2_depth = 16;     // medium recess
recess3_depth = 28;     // deepest pocket (leaves solid bottom)

// ---------- Deepest pocket geometry ----------
deep_w     = 40;        // deepest pocket width  (X)
deep_d     = 30;        // deepest pocket depth  (Y)
deep_shift = 5;         // side offset of deepest pocket vs. upper recesses

// ---------- Side projection & related side recess ----------
proj_w = 30;            // projection width  (X)
proj_d = 8;             // projection outward depth (Y)
proj_h = 12;            // projection height (Z)
proj_x = 25;            // projection X start
side_recess_d = 6;      // side recess cut depth into the body (Y)
side_recess_h = 10;     // side recess height (Z)

$fn = 64;

// ---------- Derived values ----------
recess1_w = W - 2*rim_t;                 // upper recess plan size
recess1_d = D - 2*rim_t;
recess2_w = recess1_w - 2*wall_t;        // medium recess plan size
recess2_d = recess1_d - 2*wall_t;
deep_x0   = (W - deep_w)/2 + deep_shift; // deepest pocket X start (shifted)
deep_y0   = (D - deep_d)/2;              // deepest pocket Y start

// ============================================================
// Modules
// ============================================================

// Broad upper recess, cutting down from the top face
module upper_recess() {
    translate([rim_t, rim_t, H - recess1_depth])
        cube([recess1_w, recess1_d, recess1_depth + 1]);
}

// Medium recess, inset one wall step and cut deeper
module mid_recess() {
    translate([rim_t + wall_t, rim_t + wall_t, H - recess2_depth])
        cube([recess2_w, recess2_d, recess2_depth + 1]);
}

// Deepest pocket, shifted toward +X to leave uneven ledges
module deep_recess() {
    translate([deep_x0, deep_y0, H - recess3_depth])
        cube([deep_w, deep_d, recess3_depth + 1]);
}

// Added rectangular solid projection on the -Y face
module side_projection() {
    translate([proj_x, -proj_d, 0])
        cube([proj_w, proj_d, proj_h]);
}

// Side recess cut in the -Y wall, tiered directly above the projection
module side_recess_cut() {
    translate([proj_x, 0, proj_h])
        cube([proj_w, side_recess_d, side_recess_h]);
}

// ============================================================
// Assembly
// ============================================================

difference() {
    // Solid body plus the added side projection
    union() {
        cube([W, D, H]);
        side_projection();
    }

    // Interior stepped cavity (open from the top, solid bottom)
    upper_recess();
    mid_recess();
    deep_recess();

    // Stepped side tier above the projection
    side_recess_cut();
}