// =====================================================================
//  Parametric model: base frame + raised tray body + top cross rib
//  Units: model units (treated as mm).  Datum: base underside at z = 0.
//  Footprint laid out in the +X / +Y quadrant starting at the origin.
// =====================================================================

$fn = 96;

/* ----------------------------- Parameters ------------------------- */
// Overall footprint (outer envelope, flush on all four edges)
ovl_len = 0.75;          // X : overall length
ovl_wid = 0.677323;      // Y : overall width

// Base frame (underside datum tier)
base_h     = 0.005474;   // nominal frame height
base_thick = 0.0055;     // main solid depth -> top face of base
base_frame = 0.030;      // assumed wall width of the rectangular opening

// Raised tray / wall body sitting on the base top face
tray_depth = 0.0985;     // its own depth
tray_top   = base_thick + tray_depth;   // = 0.1040 datum height of tray top

// Narrow rectangular cross rib on the upper side
rib_len   = 0.531907;    // X extent
rib_wid   = 0.043796;    // Y extent
rib_off_L = 0.109;       // X offset (left)
rib_off_R = 0.1091;      // X offset (right)  -> closes the 0.75 envelope
rib_off_F = 0.3503;      // Y offset (front)
rib_off_B = 0.2832;      // Y offset (back)   -> closes the 0.677323 envelope
rib_top   = 0.1177;      // top level above base datum
rib_thick = 0.0137;      // own (tier) thickness, = rib_top - tray_top

// Circular through openings, normal to the rib (cut through the rib tier)
hole_r  = 0.0137;        // radius
hole_x1 = 0.2354;        // left-hand centre, left offset
hole_x2 = 0.5146;        // right-hand centre, left offset
hole_y  = 0.3722;        // shared front offset
hole_z0 = tray_top;      // 0.104  -> bottom of the rib tier
hole_z1 = rib_top;       // 0.1177 -> top of the rib tier

/* --------------------------- Derived values ----------------------- */
rib_off_L + rib_len + rib_off_R;                  // = 0.75  (sanity)
rib_off_F + rib_wid + rib_off_B;                  // = 0.677323 (sanity)

/* ------------------------------ Modules --------------------------- */
// Base plate with the rectangular inner opening through the base
module base_plate() {
    difference() {
        cube([ovl_len, ovl_wid, base_thick]);
        translate([base_frame, base_frame, -0.001])
            cube([ovl_len - 2 * base_frame,
                  ovl_wid - 2 * base_frame,
                  base_thick + 0.002]);
    }
}

// Solid tray / wall body over the full footprint, stacked on the base
module tray_body() {
    translate([0, 0, base_thick])
        cube([ovl_len, ovl_wid, tray_top - base_thick]);
}

// Cross rib: a thin top tier resting on the tray body
module top_rib() {
    translate([rib_off_L, rib_off_F, tray_top])
        cube([rib_len, rib_wid, rib_thick]);
}

// Pair of circular removals passing only through the rib tier
module rib_holes() {
    for (hx = [hole_x1, hole_x2])
        translate([hx, hole_y, hole_z0])
            cylinder(h = (hole_z1 - hole_z0) + 0.0005, r = hole_r);
}

/* ------------------------------ Assembly -------------------------- */
difference() {
    union() {
        base_plate();    // underside frame with rectangular opening
        tray_body();     // raised solid body, 0.0055 -> 0.104
        top_rib();       // rib tier,          0.104  -> 0.1177
    }
    rib_holes();         // two through holes through the rib tier only
}