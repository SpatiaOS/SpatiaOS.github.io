// =============================================
// Battleship Figurine – Parametric Model
// =============================================

$fn = 80;

// --- Hull dimensions ---
hull_len     = 100;       // Overall length along X
hull_wid     = 20;        // Maximum beam at deck
hull_ht      = 9;         // Hull depth (keel to deck)
bot_len_frac = 0.88;      // Bottom ellipse length ratio
bot_wid_frac = 0.65;      // Bottom ellipse width ratio

// --- Superstructure (stepped levels) ---
super_x = 0;              // Longitudinal center of superstructure
s1_l = 30;  s1_w = 14;  s1_h = 3.0;   // Base level
s2_l = 20;  s2_w = 10;  s2_h = 3.0;   // Middle level
s3_l = 12;  s3_w = 7;   s3_h = 2.5;   // Bridge / top level

// --- Funnel (smokestack) ---
funnel_r  = 2.5;
funnel_h  = 10;
funnel_x  = super_x - 3;  // Slightly aft of superstructure center

// --- Funnel base casing ---
casing_w = 6;
casing_l = 7;
casing_h = 3;

// --- Turret dimensions ---
turret_r  = 5.0;
turret_h  = 3.5;

// Turret X positions
t_aft_x  = -28;           // Far aft turret (deck level)
t_mid_x  = -10;           // Mid-aft turret (elevated, superfiring)
t_fwd_x  =  22;           // Forward turret (deck level)

// --- Gun barrel dimensions (9 barrels, 3 per turret) ---
barrel_r   = 0.5;
barrel_len = 10.0;
barrel_sep = 2.0;         // Center-to-center spacing between barrels


// =============================================
// Hull – tapered elongated form
// =============================================
module hull_body() {
    hull() {
        // Deck-level ellipse (full size at top)
        translate([0, 0, hull_ht - 0.01])
            linear_extrude(height = 0.01)
                scale([1, hull_wid / hull_len])
                    circle(d = hull_len, $fn = 120);

        // Keel-level ellipse (narrower and shorter)
        linear_extrude(height = 0.01)
            scale([1, (hull_wid * bot_wid_frac) /
                      (hull_len * bot_len_frac)])
                circle(d = hull_len * bot_len_frac, $fn = 120);
    }
}


// =============================================
// Superstructure – three stepped rectangular levels
// =============================================
module superstructure() {
    translate([super_x, 0, hull_ht]) {
        // Base level
        translate([0, 0, s1_h / 2])
            cube([s1_l, s1_w, s1_h], center = true);

        // Middle level
        translate([0, 0, s1_h + s2_h / 2])
            cube([s2_l, s2_w, s2_h], center = true);

        // Bridge / top level
        translate([0, 0, s1_h + s2_h + s3_h / 2])
            cube([s3_l, s3_w, s3_h], center = true);
    }
}


// =============================================
// Funnel with rectangular base casing
// =============================================
module funnel_assembly() {
    // Cylindrical smokestack rising from middle level
    translate([funnel_x, 0, hull_ht + s1_h])
        cylinder(r = funnel_r, h = funnel_h);

    // Rectangular casing at funnel base (spacer / cowl piece)
    translate([funnel_x, 0, hull_ht + s1_h + casing_h / 2])
        cube([casing_l, casing_w, casing_h], center = true);
}


// =============================================
// Turret with triple gun barrels
// =============================================
module turret_assembly(x_pos, forward, z_offset = 0) {
    translate([x_pos, 0, hull_ht + z_offset]) {
        // Cylindrical turret boss
        cylinder(r = turret_r, h = turret_h);

        // Direction multiplier for barrel orientation
        dir = forward ? 1 : -1;

        // Three parallel gun barrels
        for (dy = [-barrel_sep, 0, barrel_sep]) {
            translate([dir * turret_r, dy, turret_h * 0.7])
                rotate([0, forward ? -90 : 90, 0])
                    cylinder(r = barrel_r, h = barrel_len);
        }
    }
}


// =============================================
// Complete Assembly
// =============================================
union() {
    // Ship hull
    hull_body();

    // Central superstructure
    superstructure();

    // Funnel and base casing
    funnel_assembly();

    // Aft turret – deck level, barrels pointing aft
    turret_assembly(t_aft_x, forward = false);

    // Mid-aft turret – elevated on superstructure base, superfiring
    turret_assembly(t_mid_x, forward = false, z_offset = s1_h);

    // Forward turret – deck level, barrels pointing forward
    turret_assembly(t_fwd_x, forward = true);
}