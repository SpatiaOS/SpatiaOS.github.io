// ============================================================
//  Rounded wedge base plate
//  - rounded outer perimeter with two front lobes (slotted)
//  - large central bore with thin shallow floor (recessed pocket)
//  - narrow straight rib crossing the bore
//  - small round boss with concentric through hole
// ============================================================

$fn  = 160;
eps  = 0.001;                     // cut overshoot

// ---------- Overall envelope --------------------------------
base_len   = 0.740822;            // X extent of footprint
base_wid   = 0.672842;            // Y extent of footprint
base_h     = 0.171797;            // total height (main extrusion depth)

// ---------- Stepped thickness -------------------------------
floor_h      = 0.020616;          // shallow layer (thin floor of the pocket)
pocket_depth = base_h - floor_h;  // 0.1512 -> broader upper pad depth

// ---------- Central circular through opening ----------------
bore_x = 0.3687;                  // axis from left edge
bore_y = 0.4283;                  // axis from front edge
bore_r = 0.2165;

// ---------- Rounded perimeter construction ------------------
rim_r  = base_wid - bore_y;       // 0.2445 rear circle (tangent to back edge)
lobe_r = 0.115;                   // front corner lobe radius

// ---------- Shallow circular upper/floor feature ------------
disc_x = 0.3688;                  // 0.1523 left / 0.1555 right offsets
disc_y = 0.4282;                  // 0.2117 front / 0.0281 back offsets
disc_r = 0.2165;
disc_h = floor_h;                 // 0.0206

// ---------- Narrow straight web across the bore -------------
rib_x0  = 0.3434;                 // left offset
rib_w   = 0.025368;               // length in X
rib_y0  = 0.2119;                 // front offset
rib_len = 0.432873;               // width in Y
rib_h   = base_h;                 // full height

// ---------- Small round solid boss --------------------------
boss_x = 0.4796;
boss_y = 0.4282;
boss_r = 0.0754;
arm_x  = 0.5627;                  // arm blends boss into the rim (bbox 0.2 x 0.1984)
arm_y  = 0.5160;
arm_r  = 0.0300;

// ---------- Circular removed recess / opening ---------------
hole_x = 0.4796;
hole_y = 0.4283;
hole_r = 0.150716 / 2;            // 0.075358, full depth 0.1718

// ---------- Slot-like openings in the lobes -----------------
slot_r    = 0.038;
slot_span = 0.075;

// ============================================================
//  2D profiles
// ============================================================

// Rounded wedge footprint: rear circle hulled with two front lobes
module base_profile() {
    hull() {
        translate([bore_x, bore_y]) circle(r = rim_r);
        translate([lobe_r, lobe_r]) circle(r = lobe_r);
        translate([base_len - lobe_r, lobe_r]) circle(r = lobe_r);
    }
}

// Boss footprint: round hub plus tangential arm reaching the rim
module boss_profile() {
    hull() {
        translate([boss_x, boss_y]) circle(r = boss_r);
        translate([arm_x,  arm_y ]) circle(r = arm_r);
    }
}

// Elongated (slot) opening, centred at cx/cy, oriented at ang
module slot_profile(cx, cy, ang) {
    hull()
        for (s = [-1, 1])
            translate([cx + s * slot_span/2 * cos(ang),
                       cy + s * slot_span/2 * sin(ang)])
                circle(r = slot_r);
}

// ============================================================
//  Solid assembly
// ============================================================

module wedge_body() {
    union() {
        // 1) Main plate with the central through opening
        linear_extrude(height = base_h)
            difference() {
                base_profile();
                translate([bore_x, bore_y]) circle(r = bore_r);
            }

        // 2) Shallow circular feature: thin floor closing the bore,
        //    leaving a pocket of depth 0.1512 above it
        linear_extrude(height = disc_h)
            translate([disc_x, disc_y]) circle(r = disc_r);

        // 3) Narrow straight web crossing the central opening
        translate([rib_x0, rib_y0, 0])
            cube([rib_w, rib_len, rib_h]);

        // 4) Smaller round solid boss (full height) tied to the rim
        linear_extrude(height = base_h) boss_profile();
    }
}

module cutouts() {
    // Circular removed recess / through opening in the boss
    translate([hole_x, hole_y, -eps])
        cylinder(h = base_h + 2*eps, r = hole_r);

    // Slot-like through openings near the rounded outer lobes
    linear_extrude(height = base_h + 2*eps, center = false)
        translate([0, 0]) children();
}

// ============================================================
//  Final model
// ============================================================
difference() {
    wedge_body();

    // concentric through hole in the boss (full 0.1718 depth)
    translate([hole_x, hole_y, -eps])
        cylinder(h = base_h + 2*eps, r = hole_r);

    // lobe slots, aimed at the central axis
    translate([0, 0, -eps])
        linear_extrude(height = base_h + 2*eps) {
            slot_profile(lobe_r, lobe_r,
                         atan2(bore_y - lobe_r, bore_x - lobe_r));
            slot_profile(base_len - lobe_r, lobe_r,
                         atan2(bore_y - lobe_r, bore_x - (base_len - lobe_r)));
        }
}