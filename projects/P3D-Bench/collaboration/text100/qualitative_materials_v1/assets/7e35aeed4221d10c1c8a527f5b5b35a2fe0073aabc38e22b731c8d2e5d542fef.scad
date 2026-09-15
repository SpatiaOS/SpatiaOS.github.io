// ============================================================
// Parametric model: upright arc-profiled body on a datum base,
// with a small coaxial sleeve tier, a larger annular collar,
// and stepped underside recesses / true-through central bores.
// All dimensions in millimeters (as stated).
// Origin: left(-X edge at x=0), front(Y=0), bottom(Z=0).
// ============================================================

$fn = 96;

// ---------- Reference envelope ----------
env_len   = 0.303436;   // overall length (X)
env_wid   = 0.502485;   // overall width (Y)
env_hei   = 0.468362;   // overall height (Z)
main_h    = 0.4684;     // main upright solid height above base datum

// ---------- Main body shaping ----------
wall_t    = 0.05;       // shell wall thickness -> open curved interior
outer_rad = 0.08;       // outer corner arc radius
inner_rad = 0.03;       // inner cavity corner arc radius

// ---------- Small sleeve tier (base plane) ----------
slv_x     = 0.1542;     // axis from left edge
slv_y     = 0.4232;     // axis from front edge
slv_r     = 0.0714;     // sleeve wall outline radius (repeated face radius)
slv_bore  = 0.025;      // central bore radius (true void)

// ---------- Large annular collar (upward side of base) ----------
ann_x     = 0.5416;     // axis from left edge
ann_y     = 0.2448;     // axis from front edge
ann_out_r = 0.2084;     // outer radius (0.4168 profile envelope)
ann_bnd_r = 0.1756;     // repeated annular boundary radius
ann_bore  = 0.0546;     // central opening radius (true void)
ann_h     = 0.203;      // collar height above base plane

// ---------- Underside recesses (from base underside, Z=0) ----------
// Large recess
lrg_rec_h = 0.128;      // vertical band 0 .. 0.128
lrg_rec_r = 0.1756;     // recess circular boundary (= ann_bnd_r)
lrg_rec_c = 0.0546;     // recess inner boundary (= ann_bore)
// Small recess (coaxial with sleeve)
sml_rec_h = 0.1764;     // vertical band 0 .. 0.1764
sml_rec_x = 0.1541;     // axis from left edge
sml_rec_y = 0.4232;     // axis from front edge
sml_rec_r = 0.0714;     // recess outer boundary (= slv_r)
sml_rec_c = 0.025;      // recess inner boundary (= slv_bore)

eps = 0.001;            // boolean safety margin

// ============================================================
// Modules
// ============================================================

// Rounded-corner rectangular prism (arc-based profile, flushed)
module rounded_prism(w, d, h, r) {
    linear_extrude(height = h)
        offset(r = r) offset(delta = -r)
            square([w, d], center = false);
}

// Main upright body: filled outer arcs, hollow curved interior
module main_body() {
    difference() {
        rounded_prism(env_len, env_wid, main_h, outer_rad);
        // Open curved interior (full-height cavity)
        translate([wall_t, wall_t, -eps])
            rounded_prism(env_len - 2*wall_t,
                          env_wid - 2*wall_t,
                          main_h + 2*eps,
                          inner_rad);
    }
}

// Small sleeve tier with stepped face profile
module sleeve_tier() {
    translate([slv_x, slv_y, 0])
        cylinder(h = main_h, r = slv_r);
}

// Large annular collar (ring: outer radius, central opening)
module annular_tier() {
    translate([ann_x, ann_y, 0])
        difference() {
            cylinder(h = ann_h, r = ann_out_r);
            cylinder(h = ann_h + 2*eps, r = lrg_rec_c, center = false);
            translate([0, 0, -eps])
                cylinder(h = ann_h + 2*eps, r = ann_bore);
        }
}

// Stepped recess cutter: annular band only (not full-height removal)
module ring_cutter(cx, cy, r_out, r_in, h) {
    translate([cx, cy, 0])
        difference() {
            cylinder(h = h, r = r_out);
            translate([0, 0, -eps])
                cylinder(h = h + 2*eps, r = r_in);
        }
}

// ============================================================
// Assembly
// ============================================================
difference() {
    // --- Positive solids ---
    union() {
        main_body();        // upright rounded/arc body, open interior
        sleeve_tier();      // small circular sleeve from base plane
        annular_tier();     // large annular collar to 0.203 high
    }

    // --- Stepped underside recesses ---
    // Large recess: Z-band 0..0.128, ring 0.0546 .. 0.1756
    ring_cutter(ann_x, ann_y, lrg_rec_r, lrg_rec_c, lrg_rec_h);

    // Small recess: Z-band 0..0.1764, ring 0.025 .. 0.0714
    ring_cutter(sml_rec_x, sml_rec_y, sml_rec_r, sml_rec_c, sml_rec_h);

    // --- True-through central bores ---
    // Sleeve bore: full-height void through its circular tier
    translate([slv_x, slv_y, -eps])
        cylinder(h = main_h + 2*eps, r = slv_bore);

    // Collar bore: true void through the annular tier
    translate([ann_x, ann_y, -eps])
        cylinder(h = ann_h + 2*eps, r = ann_bore);
}