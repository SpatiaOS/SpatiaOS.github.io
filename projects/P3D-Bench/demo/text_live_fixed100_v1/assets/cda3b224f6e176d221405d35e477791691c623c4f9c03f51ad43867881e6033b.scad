// ============================================================
// Parametric plate with stepped top pocket, lower pocket,
// side projection tab and side recess
// ============================================================

$fn = 64;
eps = 0.0005;                  // small overlap for clean booleans

// ---------- Main reference body ----------
body_len  = 0.702127;          // X
body_wid  = 0.524964;          // Y
body_hgt  = 0.210295;          // Z (main height 0.2103)

// ---------- Upper shallow recess (top opening) ----------
r1_len    = 0.667793;
r1_wid    = 0.490631;
r1_x      = 0.0171;            // inset from left edge
r1_y      = 0.0172;            // inset from front edge
r1_z0     = 0.1888;            // band bottom above underside
r1_depth  = 0.0215;            // -> up to 0.2103

// ---------- Continuation of the top opening (deep pocket) ----------
r2_len    = 0.650626;
r2_wid    = 0.464880;
r2_x      = 0.0257;
r2_y      = 0.0300;
r2_z0     = 0.0729;
r2_depth  = 0.1159;            // -> up to 0.1888

// ---------- Lower offset pocket ----------
r3_len    = 0.567882;
r3_wid    = 0.447713;
r3_x      = 0.0999;
r3_y      = 0.0386;
r3_z0     = 0.0215;            // leaves 0.0215 bottom thickness
r3_depth  = 0.0515;            // -> up to 0.0730

// ---------- Side projection (solid tab) ----------
tab_len   = 0.130618;
tab_wid   = 0.463588;
tab_x     = -0.0479;           // overhangs the left length edge
tab_y     = 0.0300;
tab_z0    = 0.0730;
tab_thk   = 0.0146;            // -> up to 0.0876

// ---------- Side recess (cut at left edge) ----------
sr_depth  = 0.0343;            // X extent measured from left face
sr_len    = 0.367372;          // along Y
sr_y      = 0.0546;            // from front edge
sr_z0     = 0.0876;
sr_hgt    = 0.101285;          // -> up to 0.1889

// ------------------------------------------------------------
// Helper: axis aligned box placed by its minimum corner
// ------------------------------------------------------------
module box_at(pos, size) {
    translate(pos) cube(size);
}

// ------------------------------------------------------------
// Step 1: solid base block with the three stacked pockets
// ------------------------------------------------------------
module base_with_pockets() {
    difference() {
        // Main rectangular solid
        cube([body_len, body_wid, body_hgt]);

        // Shallow top recess (open to the top face)
        box_at([r1_x, r1_y, r1_z0],
               [r1_len, r1_wid, r1_depth + eps]);

        // Deep continuation of the top opening
        box_at([r2_x, r2_y, r2_z0],
               [r2_len, r2_wid, r2_depth + eps]);

        // Lower, more offset pocket
        box_at([r3_x, r3_y, r3_z0],
               [r3_len, r3_wid, r3_depth + eps]);
    }
}

// ------------------------------------------------------------
// Step 2: side projection added in the lower band
// ------------------------------------------------------------
module side_projection() {
    box_at([tab_x, tab_y, tab_z0],
           [tab_len, tab_wid, tab_thk]);
}

// ------------------------------------------------------------
// Step 3: side recess cut at the left edge (not through)
// ------------------------------------------------------------
module side_recess() {
    box_at([-eps, sr_y, sr_z0],
           [sr_depth + eps, sr_len, sr_hgt]);
}

// ------------------------------------------------------------
// Final model
// ------------------------------------------------------------
difference() {
    union() {
        base_with_pockets();
        side_projection();
    }
    side_recess();
}