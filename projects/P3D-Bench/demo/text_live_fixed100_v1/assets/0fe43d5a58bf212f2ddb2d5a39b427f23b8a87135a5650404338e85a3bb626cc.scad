// ============================================================
// Lever link: base with rounded annular end, tall hollow
// sleeve, raised stepped arm and triangular gusset web
// Datum: base left-front-bottom corner (X right, Y back, Z up)
// ============================================================

// ---------------- Parameters ----------------
// Main base plate
base_len = 0.341352;          // overall length (X)
base_wid = 0.199422;          // overall width  (Y)
base_h   = 0.065;             // extrusion depth (Z)

// Low rounded annular section (rounded right end of base)
boss_cx  = 0.2416;            // centre from base left edge
boss_cy  = 0.0997;            // centre from base front edge
boss_ro  = 0.0997;            // outer radius
boss_ri  = 0.0434;            // inner radius, open through base

// Tall hollow sleeve (concentric annular cylinder)
slv_cx   = -0.0834;           // centre X from base left datum
slv_cy   = 0.0998;            // centre Y from base front datum
slv_ro   = 0.1301;            // outer radius (0.2602 span)
slv_ri   = 0.0867;            // bore radius
slv_top  = 0.2601;            // top reach from base datum

// Projecting straight-sided arm
arm_len  = 0.325145;          // length (X)
arm_wid  = 0.260116;          // width  (Y)
arm_top  = 0.1301;            // top height from base datum
arm_x0   = -0.4086;           // left edge offset
arm_cy   = slv_cy;            // centred on sleeve centreline
band_h   = 0.065;             // lower band cut from underside

// Triangular web (gusset rising toward the sleeve tier)
web_run  = 0.108382;          // plan run (X)
web_th   = 0.0217;            // material thickness (Y)
web_rise = 0.195087;          // vertical rise of side profile
web_x0   = 0.0466;            // start at sleeve surface
web_y0   = 0.0781;            // front offset of web face
web_emb  = 0.030;             // embed into sleeve wall
web_zemb = 0.005;             // embed into base top

eps = 0.002;                  // boolean overlap allowance
$fn = 96;                     // curve resolution

// Derived values
arm_x1  = arm_x0 + arm_len;           // right edge (~ sleeve centre)
web_z0  = base_h - web_zemb;          // web root just below base top
web_top = base_h + web_rise;          // ~ 0.2601 sleeve tier

// ---------------- Modules ----------------
// Base: rectangular body + rounded annular end, bore open through
module base_plate() {
    difference() {
        union() {
            cube([boss_cx, base_wid, base_h]);            // straight portion
            translate([boss_cx, boss_cy, 0])
                cylinder(h = base_h, r = boss_ro);        // rounded end
        }
        translate([boss_cx, boss_cy, -eps])
            cylinder(h = base_h + 2*eps, r = boss_ri);    // through hole
    }
}

// Tall hollow sleeve: annular cylinder from datum to slv_top
module sleeve() {
    translate([slv_cx, slv_cy, 0])
        difference() {
            cylinder(h = slv_top, r = slv_ro);
            translate([0, 0, -eps])
                cylinder(h = slv_top + 2*eps, r = slv_ri); // open bore
        }
}

// Arm: full-depth blank with lower band cut away -> raised stepped tier
module arm() {
    difference() {
        translate([arm_x0, arm_cy - arm_wid/2, 0])
            cube([arm_len, arm_wid, arm_top]);            // blank 0..arm_top
        translate([arm_x0 - eps, arm_cy - arm_wid/2 - eps, -eps])
            cube([arm_len + 2*eps, arm_wid + 2*eps, band_h + eps]); // band cut
    }
}

// Triangular web: XZ side profile extruded across its thickness
module web() {
    x0 = web_x0 - web_emb;                                // embedded root
    translate([0, web_y0 + web_th, 0])
        rotate([90, 0, 0])                                // stand profile upright
            linear_extrude(height = web_th)
                polygon(points = [
                    [x0,               web_z0 ],          // root at base
                    [x0,               web_top],          // high end at sleeve
                    [web_x0 + web_run, web_z0 ]           // tapered tip
                ]);
}

// ---------------- Assembly ----------------
union() {
    base_plate();
    sleeve();
    arm();
    web();
}