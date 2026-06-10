// ============================================================
// Parametric Assembly: base + annular boss + hollow sleeve +
// stepped arm + triangular web
// ============================================================

$fn = 96;

// ---- Main base ----
base_L   = 0.341352;
base_W   = 0.199422;
base_H   = 0.065029;
base_ext = 0.065;

// ---- Low annular boss on top of base ----
boss_cx  = 0.2416;   // from left edge of base
boss_cy  = 0.0997;   // from front edge of base
boss_ro  = 0.0997;
boss_ri  = 0.0434;

// ---- Tall hollow sleeve ----
sleeve_cx_off = -0.0834;  // relative to base left reference
sleeve_cy_off =  0.0998;  // relative to base front reference
sleeve_ro     =  0.1301;
sleeve_ri     =  0.0867;
sleeve_H      =  0.2601;

// ---- Projecting stepped arm ----
arm_L         = 0.325145;
arm_W         = 0.260116;
arm_H_top     = 0.1301;   // upward reach
arm_left_off  = -0.4086;  // left edge from base left reference
arm_front_off = -0.0303;  // front edge from base front reference
arm_cut_lo    = 0.0;      // remove lower band 0..0.065
arm_cut_hi    = 0.065;

// ---- Triangular web ----
web_thk        = 0.0217;
web_left_lo    = 0.0466;
web_left_hi    = 0.1863;
web_front_lo   = 0.0781;
web_front_hi   = 0.0996;
web_run        = 0.108382;
web_rise_span  = 0.195087;

// ============================================================
// MODULES
// ============================================================

// Base plate with the low annular boss on top, inner hole through.
module base_with_boss() {
    difference() {
        union() {
            // base slab
            cube([base_L, base_W, base_ext]);
            // low annular ring sitting on top
            translate([boss_cx, boss_cy, base_ext])
                difference() {
                    cylinder(h = base_ext, r = boss_ro);
                    translate([0,0,-0.001])
                        cylinder(h = base_ext + 0.002, r = boss_ri);
                }
        }
        // through-hole in inner profile across the 0.065 thickness
        translate([boss_cx, boss_cy, -0.001])
            cylinder(h = base_ext + 0.002, r = boss_ri);
    }
}

// Tall hollow sleeve, concentric annular cylinder rising from base
module hollow_sleeve() {
    cx = sleeve_cx_off + 0.2602/2 + 0.0; // not used; explicit center below
    // Use the explicit "center offset" given in the spec
    translate([ -sleeve_cx_off,   // -(-0.0834) ... interpret as offset from ref
                sleeve_cy_off, 0 ]) {
        // (Center placed using the stated offsets from the base reference.)
    }
    // Place sleeve using the stated center offsets
    translate([ -sleeve_cx_off, sleeve_cy_off, 0 ])
        difference() {
            cylinder(h = sleeve_H, r = sleeve_ro);
            translate([0,0,-0.001])
                cylinder(h = sleeve_H + 0.002, r = sleeve_ri);
        }
}

// Stepped arm: full block from cut_hi up to arm_H_top, on the side of base.
module stepped_arm() {
    // Arm footprint placed using its left/front offsets relative to base ref
    translate([ arm_left_off, arm_front_off, arm_cut_hi ])
        cube([ arm_L, arm_W, arm_H_top - arm_cut_hi ]);
}

// Triangular web (right-triangle prism) on top of base, rising toward sleeve.
module triangular_web() {
    // Footprint extents
    dx = web_left_hi - web_left_lo;            // plan run direction
    dy = web_front_hi - web_front_lo;          // material thickness band
    // Use side-profile triangle: run = web_run (x), rise = web_rise_span (z)
    translate([ web_left_lo, web_front_lo, base_ext ])
        linear_extrude(height = dy)            // thickness in Y-ish direction
            polygon(points = [
                [0, 0],
                [web_run, 0],
                [0, web_rise_span]
            ]);
}

// ============================================================
// ASSEMBLY
// ============================================================
union() {
    base_with_boss();
    hollow_sleeve();
    stepped_arm();
    triangular_web();
}