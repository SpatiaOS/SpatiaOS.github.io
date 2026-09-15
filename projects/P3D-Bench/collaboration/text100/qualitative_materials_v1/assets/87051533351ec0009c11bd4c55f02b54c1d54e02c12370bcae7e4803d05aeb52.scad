// ============================================================
// Rounded wedge base with central window, web, under-pad,
// concentric boss/recess and lobe slots.
// Units: millimeters (model units, 1:1).
// ============================================================

$fn = 96;

// ---------------- Overall envelope ----------------
L        = 0.740822;    // overall length (X)
W        = 0.672842;    // overall width  (Y)
H        = 0.171797;    // main extrusion height from base plane
corner_r = 0.07;        // outer perimeter corner rounding
fit      = 0.002;       // tiny overlap allowance for clean booleans

// ---------------- Central circular through opening ----------------
win_cx = 0.3687;        // axis, from left edge
win_cy = 0.4283;        // axis, from front edge
win_r  = 0.2165;        // opening radius

// ---------------- Shallow circular pad associated with opening ----------------
pad_cx = 0.3688;        // axis, from left edge
pad_cy = 0.4282;        // axis, from front edge
pad_t  = 0.020616;      // pad thickness (shallow feature depth)

// ---------------- Narrow straight web crossing the opening ----------------
web_x0    = 0.3434;     // from left edge
web_len_x = 0.025368;   // web thickness (X)
web_len_y = 0.432873;   // web span (Y)

// ---------------- Small round boss and concentric recess ----------------
boss_cx = 0.4796;       // center, from left edge
boss_cy = 0.4282;       // center, from front edge
boss_r  = 0.0992;       // outer radius (0.1984 bounding span / 2)
rec_r   = 0.0754;       // recess radius (inner void)
rec_zlo = -0.1512;      // removed band low  (relative to underside)
rec_zhi = 0.0206;       // removed band high (relative to underside)

// ---------------- Slots near the rounded outer lobes ----------------
slot_w   = 0.050;       // slot width
slot_len = 0.200;       // slot overall length (along Y)
slot_x_l = 0.0775;      // left slot center (X)
slot_x_r = L - 0.0778;  // right slot center (X)

// ================= Modules =================

// Rounded rectangular footprint extruded H upwards (main base slab)
module rounded_base() {
    linear_extrude(height = H)
        hull() {
            translate([corner_r,     corner_r]) circle(corner_r);
            translate([L - corner_r, corner_r]) circle(corner_r);
            translate([L - corner_r, W - corner_r]) circle(corner_r);
            translate([corner_r,     W - corner_r]) circle(corner_r);
        }
}

// Stadium-shaped through-slot profile (capsule), centered on window axis
module slot(cx) {
    hull() {
        translate([cx, win_cy - slot_len/2 + slot_w/2]) circle(slot_w/2);
        translate([cx, win_cy + slot_len/2 - slot_w/2]) circle(slot_w/2);
    }
}

// ================= Assembly =================
difference() {
    union() {

        // Step 1: rounded base slab with the large circular
        //         through opening cut all the way through
        difference() {
            rounded_base();
            translate([win_cx, win_cy, -0.1])
                cylinder(h = H + 0.2, r = win_r);
        }

        // Step 2: shallow circular pad closing the opening from the
        //         underside (solid material, slightly oversized so it
        //         fuses cleanly with the window wall)
        translate([pad_cx, pad_cy, -pad_t])
            cylinder(h = pad_t + 0.004, r = win_r + fit);

        // Step 3: narrow straight web bridging the opening at full
        //         height (ends sunk into the wall/pad for manifoldity)
        translate([web_x0, win_cy - web_len_y/2 - fit, -0.01])
            cube([web_len_x, web_len_y + 2*fit, H + 0.01]);

        // Step 4: small round solid boss standing on the pad inside
        //         the opening (bottom embedded into the pad)
        translate([boss_cx, boss_cy, -0.01])
            cylinder(h = H + 0.01, r = boss_r);
    }

    // Step 5: slot-like through openings near the rounded lobes
    translate([0, 0, -0.1])
        linear_extrude(height = H + 0.2) {
            slot(slot_x_l);
            slot(slot_x_r);
        }

    // Step 6: concentric removed vertical band under the boss
    //         (pierces pad and boss core -> stepped underside void)
    translate([boss_cx, boss_cy, rec_zlo])
        cylinder(h = rec_zhi - rec_zlo, r = rec_r);
}