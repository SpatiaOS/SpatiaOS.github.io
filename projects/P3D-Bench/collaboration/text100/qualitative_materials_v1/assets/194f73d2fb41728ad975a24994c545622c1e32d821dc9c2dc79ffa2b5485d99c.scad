// ------------------------------------------------------------------
// Parametric model — base datum at z = 0, x = left->right, y = front->back
// ------------------------------------------------------------------
$fn = 96;
eps = 0.001;

// ---- Overall reference envelope ----
env_l  = 0.303436;   // length (X)
env_w  = 0.502485;   // width  (Y)
env_h  = 0.468362;   // envelope height
body_h = 0.4684;     // main upright solid height from base datum

// ---- Main upper body (rounded hollow shell) ----
wall_t   = 0.03;     // shell wall thickness
corner_r = 0.05;     // outer arc corner radius
base_t   = 0.203;    // base floor thickness (keeps underside recesses partial-depth)

// ---- Small coaxial sleeve on base plane ----
sleeve_x  = 0.1541;  // axis from left edge
sleeve_y  = 0.4232;  // axis from front edge
sleeve_or = 0.0714;  // sleeve wall outline radius (= stepped face radius)
sleeve_br = 0.025;   // central bore radius (true void)
sleeve_h  = body_h;  // sleeve tier height
sleeve_rz = 0.1764;  // underside stepped recess depth (band 0 .. 0.1764)

// ---- Larger lower annular circular solid ----
ann_x  = 0.5416;     // axis from left edge
ann_y  = 0.2448;     // axis from front edge
ann_or = 0.2084;     // outer radius (0.4168 x 0.4168 profile envelope)
ann_ar = 0.1756;     // annular boundary / step radius
ann_br = 0.0546;     // central opening radius (true void)
ann_h  = 0.203;      // reaches 0.203 above base plane
ann_rz = 0.128;      // underside annular recess depth (band 0 .. 0.128)

// ---- 2D rounded rectangle profile ----
module rounded_rect(w, d, r) {
    hull()
        for (x = [r, w - r], y = [r, d - r])
            translate([x, y]) circle(r);
}

// ---- Main upper body: arc-based shell, open curved interior ----
module main_body() {
    difference() {
        // outer profile flush to left/right/front/back extents
        linear_extrude(height = body_h)
            rounded_rect(env_l, env_w, corner_r);
        // open curved interior from floor to open top
        translate([wall_t, wall_t, base_t])
            linear_extrude(height = body_h)
                rounded_rect(env_l - 2*wall_t, env_w - 2*wall_t, corner_r - wall_t);
    }
}

// ---- Small sleeve tier (solid boss, openings cut later) ----
module sleeve() {
    translate([sleeve_x, sleeve_y, 0])
        cylinder(h = sleeve_h, r = sleeve_or);
}

// ---- Larger lower annular solid (full disc, openings cut later) ----
module annular_solid() {
    translate([ann_x, ann_y, 0])
        cylinder(h = ann_h, r = ann_or);
}

// ---- Underside cuts (stepped recesses, not full-height) ----

// small coaxial stepped recess from underside, band 0 .. 0.1764
module sleeve_recess() {
    translate([sleeve_x, sleeve_y, -eps])
        cylinder(h = sleeve_rz + eps, r = sleeve_or);
}

// small central bore: true void through the sleeve tier
module sleeve_bore() {
    translate([sleeve_x, sleeve_y, -eps])
        cylinder(h = sleeve_h + 2*eps, r = sleeve_br);
}

// large annular recess from underside: ring r 0.0546 .. 0.1756, band 0 .. 0.128
module annular_recess() {
    translate([ann_x, ann_y, -eps])
        difference() {
            cylinder(h = ann_rz + eps, r = ann_ar);
            translate([0, 0, -eps])
                cylinder(h = ann_rz + 3*eps, r = ann_br);
        }
}

// large central opening: true void through the annular tier
module annular_bore() {
    translate([ann_x, ann_y, -eps])
        cylinder(h = ann_h + 2*eps, r = ann_br);
}

// ---- Assembly ----
difference() {
    union() {
        main_body();      // rounded hollow upright body
        sleeve();         // small sleeve on base plane
        annular_solid();  // large lower annular solid on base plane
    }
    sleeve_recess();      // stepped recess, underside of sleeve
    sleeve_bore();        // through bore of sleeve
    annular_recess();     // stepped annular recess, underside of large solid
    annular_bore();       // through opening of large solid
}