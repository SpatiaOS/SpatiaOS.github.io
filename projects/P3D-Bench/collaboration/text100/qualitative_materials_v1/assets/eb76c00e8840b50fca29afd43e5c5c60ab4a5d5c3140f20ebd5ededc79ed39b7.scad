// =========================================================
//  Parametric model
//  Origin: left / front / underside datum
//  +X -> right (length), +Y -> back (width), +Z -> up
// =========================================================
$fn = 120;

// ---------------- Reference envelope ----------------
L = 0.303436;              // left-right extent
W = 0.502485;              // front-back extent
H = 0.468362;              // total height (base datum -> top of upright solid)

// ---------------- Base slab ----------------
base_t  = 0.20;            // underside (z=0) -> base plane (z=base_t)
floor_t = 0.0;             // interior pocket floor = base plane

// ---------------- Upright body (arc based shell) ----------------
wall     = 0.030;          // side wall thickness
corner_r = 0.045;          // outer corner radius (arc profile)

// ---------------- Small coaxial sleeve ----------------
sleeve_x    = 0.1542;      // from left edge
sleeve_y    = 0.4232;      // from front edge
sleeve_r    = 0.0714;      // sleeve wall outline = stepped face radius
sleeve_bore = 0.025;       // real central opening
sleeve_h    = 0.1764;      // height above the base plane
small_step  = 0.1764;      // underside recess band 0 -> 0.1764
small_step_r = 0.0714;     // repeated stepped circular face radius

// ---------------- Large lower annular solid ----------------
boss_x      = 0.5416;      // from left edge
boss_y      = 0.2448;      // from front edge
boss_r      = 0.2084;      // outer radius (circular profile envelope 0.4168)
boss_step_r = 0.1756;      // repeated annular boundary radius
boss_bore   = 0.0546;      // central opening
boss_h      = 0.203;       // height above the base plane
big_step    = 0.128;       // underside recess band 0 -> 0.128

// ---------- 2D helper: rounded (arc based) rectangle ----------
module rounded_rect(w, d, r) {
    offset(r = r) square([w - 2*r, d - 2*r], center = true);
}

// ---------- Base slab: envelope footprint + circular lobe under the ring ----------
module base_slab() {
    linear_extrude(height = base_t, convexity = 4)
        union() {
            translate([L/2, W/2])       rounded_rect(L, W, corner_r);
            translate([boss_x, boss_y]) circle(r = boss_r);
        }
}

// ---------- Upright shell: rounded outer walls, open curved interior ----------
module upright_body() {
    difference() {
        // outer body, flush to all four reference extents
        translate([0, 0, base_t])
            linear_extrude(height = H - base_t, convexity = 4)
                translate([L/2, W/2]) rounded_rect(L, W, corner_r);
        // open curved interior (open at the top, not a filled block)
        translate([0, 0, base_t + floor_t])
            linear_extrude(height = H - base_t - floor_t + 0.5, convexity = 4)
                translate([L/2, W/2])
                    rounded_rect(L - 2*wall, W - 2*wall, corner_r - wall);
    }
}

// ---------- Small stepped sleeve on the base plane ----------
module small_sleeve() {
    translate([sleeve_x, sleeve_y, base_t])
        cylinder(h = sleeve_h, r = sleeve_r);
}

// ---------- Large lower annular solid ----------
module large_annular_solid() {
    translate([boss_x, boss_y, base_t])
        cylinder(h = boss_h, r = boss_r);
}

// ======================= Assembly =======================
difference() {
    union() {
        base_slab();
        upright_body();
        small_sleeve();          // added after the pocket cut -> stands inside
        large_annular_solid();
    }

    // true bore through the small sleeve + slab
    translate([sleeve_x, sleeve_y, -0.5])
        cylinder(h = base_t + sleeve_h + 1, r = sleeve_bore);

    // true bore through the large annulus + slab
    translate([boss_x, boss_y, -0.5])
        cylinder(h = base_t + boss_h + 1, r = boss_bore);

    // underside stepped recess, small: r 0.0714 over band 0 -> 0.1764
    translate([sleeve_x, sleeve_y, -0.5])
        cylinder(h = small_step + 0.5, r = small_step_r);

    // underside stepped recess, large: r 0.1756 over band 0 -> 0.128
    translate([boss_x, boss_y, -0.5])
        cylinder(h = big_step + 0.5, r = boss_step_r);
}