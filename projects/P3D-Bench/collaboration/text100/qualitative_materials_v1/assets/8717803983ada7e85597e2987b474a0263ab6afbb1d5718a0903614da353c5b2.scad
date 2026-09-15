// =========================================================
// Upright arched shell with coaxial sleeve + annular boss
// All dimensions are parametric (model units, mm assumed)
// =========================================================

$fn = 100;                       // smooth arcs and circles
eps = 0.002;                     // overlap allowance for clean booleans

// ---------- Reference envelope ----------
env_L = 0.303436;                // X extent (left - right)
env_W = 0.502485;                // Y extent (front - back)
env_H = 0.468362;                // Z extent (reference)

// ---------- Main upright body ----------
body_H = 0.4684;                 // top of upright above base datum
wall_t = 0.030;                  // shell wall thickness
arch_R = env_L / 2;              // crown arc radius (semicircular top)

// ---------- Small coaxial sleeve ----------
slv_x      = 0.1542;             // axis from left edge
slv_y      = 0.4232;             // axis from front edge
slv_r      = 0.0714;             // wall outline / stepped face radius (0.1428 span)
slv_bore_r = 0.025;              // true through bore
slv_h      = 0.2500;             // sleeve top height (must exceed recess depth)
slv_recess = 0.1764;             // underside recess band 0..0.1764

// ---------- Large lower annular boss ----------
boss_x      = 0.5416;            // axis from left edge (extends past envelope
                                 //  right side, per the -0.4138 right offset)
boss_y      = 0.2448;            // axis from front edge
boss_ro     = 0.2084;            // outer radius (0.4168 profile envelope span)
boss_r_step = 0.1756;            // annular boundary / recess radius (0.3512 span)
boss_bore_r = 0.0546;            // true through opening
boss_h      = 0.203;             // height above base plane
boss_step_h = 0.128;             // lower tier height / recess band 0..0.128

// ---------- 2D profile: straight sides + arc crown ----------
module upright_profile(w, h, R) {
    square([w, h - R]);                          // rectangular lower portion
    translate([w/2, h - R]) circle(r = R);       // rounded arc top
}

// ---------- Extrude an X/Z profile along the Y axis ----------
module profile_extrude_y(w, h, R, y0, y1, z0 = 0) {
    translate([0, y1, z0])
        rotate([90, 0, 0])                       // 2D +Y -> +Z, extrusion -> -Y
            linear_extrude(height = y1 - y0)
                upright_profile(w, h, R);
}

// ---------- Main body: rounded shell, open curved interior ----------
module main_body() {
    difference() {
        // Outer solid: flush to left/right/front/back envelope extents
        profile_extrude_y(env_L, body_H, arch_R, 0, env_W);
        // Inner curved void (open at the base, keeps front/back walls)
        translate([wall_t, 0, -eps])
            profile_extrude_y(env_L - 2*wall_t,
                              body_H - wall_t,
                              arch_R - wall_t,
                              wall_t, env_W - wall_t);
    }
}

// ---------- Small sleeve tier on the base plane ----------
module small_sleeve() {
    translate([slv_x, slv_y, 0])
        cylinder(h = slv_h, r = slv_r);
}

// ---------- Large annular boss with stepped outer diameter ----------
module large_boss() {
    translate([boss_x, boss_y, 0]) {
        cylinder(h = boss_step_h, r = boss_ro);                  // lower tier r0.2084
        translate([0, 0, boss_step_h])
            cylinder(h = boss_h - boss_step_h, r = boss_r_step); // upper tier r0.1756
    }
}

// ---------- Assembly with stepped underside recesses and true bores ----------
color("lightsteelblue")
difference() {
    union() {
        main_body();
        small_sleeve();
        large_boss();
    }

    // Large axis: annular underside recess (band 0..0.128) + through bore
    translate([boss_x, boss_y, 0]) {
        cylinder(h = boss_step_h, r = boss_r_step);              // stepped recess
        translate([0, 0, -eps])
            cylinder(h = boss_h + 2*eps, r = boss_bore_r);       // true void
    }

    // Small axis: underside recess (band 0..0.1764) + through bore
    translate([slv_x, slv_y, 0]) {
        cylinder(h = slv_recess, r = slv_r);                     // stepped recess
        translate([0, 0, -eps])
            cylinder(h = slv_h + 2*eps, r = slv_bore_r);         // true void
    }
}