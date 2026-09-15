// ============================================================
//  Bracketed bearing block
//  All dimensions in model units (mm)
// ============================================================
$fn = 140;
eps = 0.001;

// ---------------- Base plate (primary reference) ----------------
base_len = 0.341352;   // X length
base_wid = 0.199422;   // Y width
base_h   = 0.065029;   // Z height
base_ext = 0.065;      // main extrusion depth

// ---------------- Low annular ring (upper side) ----------------
ring_cx  = 0.2416;         // centre from left edge
ring_cy  = 0.0997;         // centre from front edge
ring_r_o = 0.0997;         // outer radius
ring_r_i = 0.0434;         // inner radius
ring_h   = base_ext;       // 0.065 band, bore open through it

// ---------------- Tall hollow sleeve ----------------------------
slv_cx  = -0.0834;         // centre from left reference
slv_cy  = 0.0998;          // centre from front reference
slv_r_o = 0.1301;          // outer radius (0.2602 span)
slv_r_i = 0.0867;          // inner radius
slv_top = 0.2601;          // upward reach from base datum

// ---------------- Projecting arm (raised stepped tier) ----------
arm_x0  = -0.4086;                   // left offset
arm_x1  = -0.4086 + 0.325145;        // right (length 0.325145)
arm_y0  = -0.0303;                   // front offset
arm_y1  = -0.0303 + 0.260116;        // back (width 0.260116)
arm_top = 0.130058;                  // upward reach from base datum
arm_cut = 0.065;                     // lower band removed (0 -> 0.065)

// ---------------- Triangular web --------------------------------
web_x0  = 0.0466;          // left offset
web_run = 0.108382;        // plan run
web_y0  = 0.0781;          // front offset
web_t   = 0.0217;          // material thickness
web_z0  = base_h;          // sits on base top
web_z1  = 0.2601;          // tip reaches the sleeve tier

// ---------------- Modules ---------------------------------------
// Annular ring boss standing on the base top face
module ring_boss() {
    translate([ring_cx, ring_cy, base_h])
        cylinder(h = ring_h, r = ring_r_o);
}

// Tall hollow sleeve body
module sleeve() {
    translate([slv_cx, slv_cy, 0])
        cylinder(h = slv_top, r = slv_r_o);
}

// Projecting arm, raised tier (lower band stripped)
module arm_tier() {
    difference() {
        translate([arm_x0, arm_y0, 0])
            cube([arm_x1 - arm_x0, arm_y1 - arm_y0, arm_top]);
        // remove the 0 -> 0.065 underside band
        translate([arm_x0 - eps, arm_y0 - eps, -eps])
            cube([arm_x1 - arm_x0 + 2*eps, arm_y1 - arm_y0 + 2*eps, arm_cut + eps]);
    }
}

// Triangular stiffening web (thin rib in the X-Z plane)
module web() {
    translate([0, web_y0 + web_t, 0])
        rotate([90, 0, 0])
            linear_extrude(height = web_t)
                polygon(points = [
                    [web_x0,             web_z0],
                    [web_x0 + web_run,   web_z0],
                    [web_x0,             web_z1]
                ]);
}

// ---------------- Assembly --------------------------------------
difference() {
    union() {
        cube([base_len, base_wid, base_h]);   // base plate
        ring_boss();                          // low annular section
        sleeve();                             // hollow sleeve
        arm_tier();                           // projecting arm tier
        web();                                // triangular web
    }

    // Ring inner bore - open through the 0.065 band (and base)
    translate([ring_cx, ring_cy, -eps])
        cylinder(h = base_h + ring_h + 2*eps, r = ring_r_i);

    // Sleeve inner bore - full hollow through the sleeve
    translate([slv_cx, slv_cy, -eps])
        cylinder(h = slv_top + 2*eps, r = slv_r_i);
}